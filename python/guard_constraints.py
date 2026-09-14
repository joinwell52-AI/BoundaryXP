"""Bounded callable references and guards, followed by actual SMT queries.

Callable names/actors/events come from source, never case-specific constants.
Only supported complete local forms enter the solver. Assumptions are explicit.
"""
import json
import re
from pathlib import Path
from itertools import product
from typing import NamedTuple
import z3

PATTERNS=json.loads(Path(__file__).with_name('guard_patterns.json').read_text(encoding='utf-8'))
IDENT=r'`?(?P<identifier>[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+)`?'
ACTOR=r'(?:[\u4e00-\u9fff]{1,12}\s+)?[A-Za-z][A-Za-z0-9_]*'

class Predicate(NamedTuple):
    verb: str
    target: str

def compile_pattern(name):
    return re.compile(PATTERNS[name].replace('{identifier}',IDENT).replace('{actor}',ACTOR),re.I)

def blocks(text):
    start=0
    for m in re.finditer(r'[。！？；;\n]|\.(?=\s+[A-Z]|$)',text):
        raw=text[start:m.start()];a=start+len(raw)-len(raw.lstrip());b=start+len(raw.rstrip())
        if a<b:yield a,b
        start=m.end()
    if text[start:].strip():
        raw=text[start:];yield start+len(raw)-len(raw.lstrip()),start+len(raw.rstrip())

def split_guard(raw):
    comma=re.search(r'[,，]',raw)
    if comma:return raw[:comma.start()].strip(),raw[comma.end():].strip()
    return '',raw

def parse_guard(value,src):
    if not value:return {'op':'constant','value':True}
    for name,negate in [('approval_negative',True),('approval_positive',False)]:
        match=compile_pattern(name).fullmatch(value)
        if match:
            actor=re.search(r'[A-Za-z][A-Za-z0-9_]*$',match['zh'] or match['en']).group()
            atom={'op':'approval','name':actor,'source':src,'granted':None}
            return {'op':'NOT','arg':atom} if negate else atom
    match=compile_pattern('event').fullmatch(value)
    if match and compile_pattern('event_positive').fullmatch(match['event']) and not re.search(PATTERNS['unsafe_scope'],match['event'],re.I):
        return {'op':'event','name':match['event'],'source':src,'observed':None}
    return None

def atoms(guard):
    if guard['op']=='NOT':return atoms(guard['arg'])
    return [] if guard['op']=='constant' else [(guard['op'],guard['name'])]

def expression(guard,symbols):
    if guard['op']=='constant':return z3.BoolVal(guard['value'])
    if guard['op']=='NOT':return z3.Not(expression(guard['arg'],symbols))
    return symbols[(guard['op'],guard['name'])]

def describe(guard,lang):
    if guard['op']=='constant':return '无条件' if lang=='zh-CN' else 'unconditional'
    negative=guard['op']=='NOT';atom=guard['arg'] if negative else guard
    if atom['op']=='approval':return (('未获' if negative else '已获')+atom['name']+'授权') if lang=='zh-CN' else atom['name']+(' has not approved' if negative else ' has approved')
    return atom['name']+('（条件成立）' if lang=='zh-CN' else ' (true)')

def analyze(text,source):
    declarations=[];rules=[];unresolved=[];findings=[];calculations=[]
    for m in compile_pattern('declaration').finditer(text):
        declarations.append({'name':m['identifier'],'source':source(text,m.start(),m.end())})
    if len(declarations)>40:raise ValueError('Callable declaration limit')
    for a,b in blocks(text):
        raw=text[a:b];modal=compile_pattern('modality').search(raw)
        if not modal:continue
        # This analyzer only handles named callables and explicit interface
        # references. Ordinary business prohibitions are independent B facts;
        # routing must occur before a comma is interpreted as a guard separator.
        suffixes=[raw[x.end():] for x in compile_pattern('modality').finditer(raw)]
        if not any(re.match(IDENT,s) or compile_pattern('anaphora').match(s) for s in suffixes):continue
        src=source(text,a,b);guard_text,action_text=split_guard(raw)
        m=compile_pattern('modality').match(action_text)
        if not m:
            unresolved.append({'source':src,'reason':'unsupported_modal_scope'});continue
        suffix=action_text[m.end():];direct=re.match(IDENT,suffix);reference=compile_pattern('anaphora').match(suffix)
        binding=None
        if direct:
            target=direct['identifier'];tail=suffix[direct.end():];binding={'kind':'explicit','sources':[src]}
        elif reference:
            prior=[d for d in declarations if d['source']['end']<=src['start']]
            choices=sorted(set(d['name'] for d in prior))
            if len(choices)!=1:
                unresolved.append({'source':src,'reason':'ambiguous_action_reference','candidates':choices});continue
            target=choices[0];tail=suffix[reference.end():];binding={'kind':'unique_preceding_callable','sources':[d['source'] for d in prior]}
        else:
            # Other action types stay on their existing calculation path.
            if guard_text or re.search(r'授权|approval|authorization|接口|interface|endpoint',raw,re.I):unresolved.append({'source':src,'reason':'unresolved_callable'})
            continue
        # Tail text can express further conditions/targets; do not silently discard it.
        tail=tail.strip()
        allowed_tail=not tail or bool(compile_pattern('output_tail').fullmatch(tail))
        if not allowed_tail:
            unresolved.append({'source':src,'reason':'unsupported_action_tail'});continue
        guard=parse_guard(guard_text,source(text,a,a+len(guard_text)))
        if guard is None:
            unresolved.append({'source':src,'reason':'unsupported_guard'});continue
        # When a previous semicolon/newline left a guard unattached, do not make this rule unconditional.
        if not guard_text:
            previous=list(blocks(text[:a]))
            if previous:
                x,y=previous[-1]
                if parse_guard(text[x:y],source(text,x,y)) is not None and text[x:y].strip():
                    unresolved.append({'source':src,'reason':'detached_guard'});continue
        modality=PATTERNS['modality_values'][m['modality'].lower()]
        predicate=Predicate('invoke',target)
        rules.append({'id':'rule_'+str(len(rules)+1),'predicate':predicate._asdict(),'modality':modality,
                      'guard':guard,'source':src,'binding':binding,'tail':tail,
                      'conditionSummary':{lang:describe(guard,lang) for lang in ['zh-CN','en']},
                      'scope':'same actor, invocation and target population assumed; not verified'})
    if len(rules)>24:raise ValueError('Guard rule limit')
    for required in [r for r in rules if r['modality']=='REQUIRE']:
        for forbidden in [r for r in rules if r['modality']=='FORBID' and r['predicate']==required['predicate']]:
            keys=sorted(set(atoms(required['guard'])+atoms(forbidden['guard'])))
            symbols={key:z3.Bool('guard_'+str(i)) for i,key in enumerate(keys)}
            req=expression(required['guard'],symbols);ban=expression(forbidden['guard'],symbols)
            solver=z3.Solver();solver.set(timeout=250);solver.add(req,ban);state=solver.check()
            calc={'operation':'source_guard_overlap','action':required['predicate'],'guardOverlap':str(state),
                  'sources':[required['source'],forbidden['source']],'truthTable':[],'decision':None}
            for values in product([False,True],repeat=len(keys)):
                env=[(symbols[key],z3.BoolVal(value)) for key,value in zip(keys,values)]
                evaluate=lambda e:z3.is_true(z3.simplify(z3.substitute(e,*env))) if env else z3.is_true(z3.simplify(e))
                calc['truthTable'].append({'assignments':[{'kind':k[0],'name':k[1],'value':v} for k,v in zip(keys,values)],'required':evaluate(req),'forbidden':evaluate(ban)})
            if state==z3.sat:
                witness=[{'kind':key[0],'name':key[1],'value':z3.is_true(solver.model().eval(symbols[key],model_completion=True))} for key in keys]
                execute=z3.Bool('execute');proof=z3.Solver();proof.set(timeout=250)
                proof.assert_and_track(z3.Implies(req,execute),required['id'])
                proof.assert_and_track(z3.Implies(ban,z3.Not(execute)),forbidden['id'])
                for i,(key,assignment) in enumerate(zip(keys,witness)):
                    proof.assert_and_track(symbols[key]==z3.BoolVal(assignment['value']),'witness_'+str(i))
                calc['formalConstraints']={'required':str(z3.Implies(req,execute)),
                    'forbidden':str(z3.Implies(ban,z3.Not(execute))),'context':witness}
                check=proof.check();calc.update(witness=witness,jointActionConstraints=str(check),core=sorted(str(x) for x in proof.unsat_core()) if check==z3.unsat else [])
                if check==z3.unsat:
                    name=required['predicate']['target'];sources=calc['sources']+forbidden['binding']['sources']
                    condition_zh=describe(required['guard'],'zh-CN')+'，同时'+describe(forbidden['guard'],'zh-CN')
                    condition_en=describe(required['guard'],'en')+' and '+describe(forbidden['guard'],'en')
                    findings.append({'code':'guard_modal_conflict','sources':sources,'severity':'conflict','decision':None,
                        'title':{'zh-CN':name+' 的执行要求与禁止条件冲突','en':'Conflicting execution requirements for '+name},
                        'scenario':{'zh-CN':condition_zh+'时，同一接口既被要求执行，又被禁止执行。','en':'When '+condition_en+', the same invocation is both required and forbidden.'},
                        'suggestion':{'zh-CN':'请明确上述情形下 '+name+' 应等待授权、停止并转交处理，还是适用已另行明确授权的例外；工具不替你选择，也不新增豁免。',
                                      'en':'Specify whether '+name+' must wait for approval, stop and escalate, or follow an explicitly authorized exception. No choice or exemption is created by this tool.'},
                        'assumption':{'zh-CN':'按所引原句指向同一接口、执行者和对象范围计算；反例是假设情形，不是已发生的授权状态。',
                                      'en':'Computed for the same interface, actor and target scope indicated by the quoted clauses. The witness is hypothetical, not a live approval state.'},
                        'witness':witness,'proof':calc})
            if state==z3.unknown or calc.get('jointActionConstraints')=='unknown':
                unresolved.append({'source':required['source'],'reason':'solver_unknown'})
            calculations.append(calc)
    for item in unresolved:
        findings.append({'code':'guard_binding_unresolved','sources':[item['source']],'severity':'unresolved','decision':None,
            'title':{'zh-CN':'这条执行条件尚未算清','en':'This execution condition remains unresolved'},
            'suggestion':{'zh-CN':'“'+item['source']['quote']+'”的动作指代或附加条件尚未绑定。请明确它约束哪个接口、在什么条件下生效；当前不能把它当成无条件要求或判定无冲突。',
                          'en':'The action reference or additional guard in “'+item['source']['quote']+'” is unresolved. Specify the interface and applicability; it cannot be treated as unconditional or conflict-free.'},
            'reason':item['reason']})
    return {'schema':'boundx-callable-guards/v1','rules':rules,'declarations':declarations,
            'calculations':calculations,'findings':findings,'unresolved':unresolved,'decision':None}
