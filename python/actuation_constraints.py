"""Bounded conditional actuation checks, with explicit source-mapping assumptions.

The solver reasons about candidate same-action rules, not physical safety. No
current value, causal axiom, exception or priority is supplied by this module.
"""
import json
import re
from pathlib import Path
import z3

P=json.loads(Path(__file__).with_name('actuation_patterns.json').read_text(encoding='utf-8'))
VERBS={v:k for k,vs in P['verbs'].items() for v in vs}

def rx(key):return re.compile(P[key].replace('{verbs}','|'.join(sorted(VERBS,key=len,reverse=True))),re.I)

def target_key(raw):
    raw=raw.strip().strip('`')
    if re.fullmatch(r'[A-Za-z][A-Za-z0-9]*[_-][A-Za-z0-9_-]+',raw):return ('identifier',raw)
    terms=[];rest=raw
    tokens=sorted([*P['targetTerms'],*P['targetStateModifiers']],key=len,reverse=True)
    matcher=re.compile('|'.join((re.escape(t) if re.search('[\u4e00-\u9fff]',t) else r'\b'+re.escape(t)+r'\b') for t in tokens),re.I)
    def consume(m):
        term=m.group().lower()
        if term in P['targetTerms']:terms.append(P['targetTerms'][term])
        return ''
    rest=matcher.sub(consume,rest)
    if rest.strip() or not terms:return None
    return tuple(sorted(terms))

def analyze(text,spans,numbers,source):
    required=[];forbidden=[];rules=[];findings=[];calculations=[]
    for i,(a,b) in enumerate(spans):
        raw=text[a:b]
        match=rx('required').fullmatch(raw)
        if match and i:
            pa,pb=spans[i-1];condition=text[pa:pb]
            bounds=[n for n in numbers if n['source']==source(text,pa,pb)]
            if rx('when').fullmatch(condition) and len(bounds)==1 and bounds[0]['unit']!='unspecified':
                n=bounds[0];key=target_key(match['target'])
                if key:
                    r={'modality':'REQUIRE','verb':VERBS[match['verb'].lower()],'target':match['target'],'key':key,
                       'source':source(text,a,b),'conditionSource':source(text,pa,pb),'bound':n}
                    required.append(r);rules.append(r)
        ban=rx('forbidden').fullmatch(raw) or rx('forbiddenEn').fullmatch(raw)
        if ban:
            key=target_key(ban['target']);pending=rx('pendingEvent').fullmatch(ban['event'])
            if key and (pending or rx('forbiddenEn').fullmatch(raw)):
                # Keep the source event as a Boolean predicate. 未平稳归零
                # is not replaced with Current > 0 or any invented amperage.
                r={'modality':'FORBID','verb':VERBS[ban['verb'].lower()],'target':ban['target'],'key':key,
                   'source':source(text,a,b),'pendingEvent':ban['event'],'eventSource':source(text,a+ban.start('event'),a+ban.end('event'))}
                forbidden.append(r);rules.append(r)
    if len(rules)>24:raise ValueError('Actuation rule limit')
    for req in required:
        for ban in forbidden:
            if (req['verb'],req['key'])!=(ban['verb'],ban['key']):continue
            n=req['bound'];x=z3.Real('source_metric');v=z3.RealVal(n['value']);pending=z3.Bool('source_pending_event');execute=z3.Bool('execute')
            numeric={'lt':x<v,'le':x<=v,'gt':x>v,'ge':x>=v,'eq':x==v}[n['relation']]
            overlap=z3.Solver();overlap.set(timeout=250);overlap.add(numeric,pending);state=overlap.check()
            calc={'operation':'conditional_actuation_overlap','guardOverlap':str(state),'jointActionConstraints':None,
                  'sources':[req['conditionSource'],req['source'],ban['source']],
                  'actionMapping':{'verb':req['verb'],'left':req['target'],'right':ban['target'],'terms':list(req['key']),
                      'assumption':'same controlled object and execution context; terminology mapping is not language-equivalence proof'},
                  'condition':{'numeric':{'relation':n['relation'],'value':n['value'],'unit':n['unit']},'pendingEvent':ban['pendingEvent']},'decision':None}
            if state==z3.sat:
                model=overlap.model();witness_value=model.eval(x,model_completion=True)
                proof=z3.Solver();proof.set(timeout=250)
                proof.assert_and_track(z3.Implies(numeric,execute),'source_require')
                proof.assert_and_track(z3.Implies(pending,z3.Not(execute)),'source_forbid')
                proof.assert_and_track(x==witness_value,'numeric_witness')
                proof.assert_and_track(pending,'pending_event_witness')
                result=proof.check()
                calc.update(jointActionConstraints=str(result),core=sorted(str(v) for v in proof.unsat_core()) if result==z3.unsat else [],
                    witness={'numericValue':str(witness_value),'unit':n['unit'],'pendingEvent':ban['pendingEvent'],'pendingEventHolds':True,'hypothetical':True})
                if result==z3.unsat:
                    findings.append({'code':'modal_logical_conflict','severity':'conflict','decision':None,'sources':calc['sources'],'proof':calc,
                        'title':{'zh-CN':'切断要求与禁止切断条件存在冲突情形','en':'The disconnect requirement and prohibition can conflict'},
                        'scenario':{'zh-CN':'在“'+req['conditionSource']['quote']+'”且“'+ban['pendingEvent']+'”的假设情形下，若两处指同一个受控对象，则同一切断动作既必须执行又被禁止。',
                                    'en':'If “'+req['conditionSource']['quote']+'” and “'+ban['pendingEvent']+'” hold, and both clauses concern the same controlled object, disconnection is both required and forbidden.'},
                        'suggestion':{'zh-CN':'请核对两处受控对象是否相同，并由有权负责人明确这些条件并存时的处理要求。工具不新增豁免或决定安全操作顺序。',
                                      'en':'Confirm that both descriptions identify the same controlled object, then have the responsible authority specify what to do when both conditions hold. No exemption or safety sequence is invented.'},
                        'assumption':{'zh-CN':'按明确列出的动作术语映射计算；这是有条件的规则反例，不是现场读数、物理死锁证明或执行许可。未归零保持为原文事件条件，没有改写成电流大于零。',
                                      'en':'Computed under the disclosed action terminology mapping. This is a conditional rule witness, not a sensor reading, physical deadlock proof or permission. The pending event is not replaced with a positive-current condition.'}})
            calculations.append(calc)
    return {'schema':P['schema'],'rules':rules,'calculations':calculations,'findings':findings,'decision':None}
