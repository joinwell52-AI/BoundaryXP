"""Three library-backed checks over bounded source-derived candidate IR.

No model, network, execution authorization, generalized NL understanding or vote.
Run as a JSON stdin/stdout subprocess, isolated by the local Node adapter.
"""
import json
import re
import sys
from collections import defaultdict
from decimal import Decimal, ROUND_CEILING, ROUND_FLOOR
from importlib.metadata import version
from pathlib import Path
import importlib.util

import networkx as nx
import portion as P
import z3
from lark import Lark, Transformer, UnexpectedInput

PARSER = Lark.open(str(Path(__file__).with_name('boundary.lark')), parser='earley', ambiguity='explicit')
_spec=importlib.util.spec_from_file_location('boundx_source_constraints',Path(__file__).with_name('source_constraints.py'))
_source=importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_source)
UNITS = {**{x:('seconds',Decimal(60)) for x in ['分钟','minutes','minute']},
         **{x:('seconds',Decimal(3600)) for x in ['小时','hours','hour']},
         **{x:('seconds',Decimal(1)) for x in ['秒','seconds','second']},
         '元':('yuan',Decimal(1)), 'yuan':('yuan',Decimal(1)),
         '次':('calls',Decimal(1)), 'calls':('calls',Decimal(1))}
MODALITIES = {'必须':'REQUIRE','must':'REQUIRE','不得':'FORBID','must not':'FORBID',
              '不必':'NOT_REQUIRED','无需':'NOT_REQUIRED','need not':'NOT_REQUIRED','do not have to':'NOT_REQUIRED'}

class IR(Transformer):
    def set_decl(self, xs):
        label,*names=map(str,[x for x in xs if x is not None])
        return {'kind':'set','role':'forbidden' if label in ['禁止对象','forbidden targets'] else 'target','values':sorted(set(names))}

    def bound(self, xs):
        name,op,number,unit=map(str,xs)
        unit,factor=UNITS[unit]
        return {'kind':'bound','metric':name,'relation':'ge' if op in ['至少','at least','>='] else 'le',
                'value':str(Decimal(number)*factor),'unit':unit}

    def edge(self, xs):
        a,_,b=map(str,xs)
        return {'kind':'edge','before':a,'after':b}

    def node(self, xs):
        return {'kind':'node','name':str(xs[-1])}

    def modal(self, xs):
        op,body=map(str,xs)
        return {'kind':'modal','modality':MODALITIES[op.lower()],'action':body.strip(),'condition':{'op':'unconditional'}}

def evidence(text, start, end):
    # Python code points converted to the browser's UTF-16 [start,end).
    return {'quote':text[start:end], 'start':len(text[:start].encode('utf-16-le'))//2,
            'end':len(text[:end].encode('utf-16-le'))//2}

def source_slice(text, start, end):
    return text.encode('utf-16-le')[start*2:end*2].decode('utf-16-le')

def extract(text, statements):
    records,unknown=[],[]
    covered=set()
    # These candidates are produced locally by the Node source parser. Validate
    # evidence before reuse, and leave multi-interpretation statements unresolved.
    for s in statements:
        if len(s.get('candidates',[]))!=1:continue
        if source_slice(text,s['start'],s['end'])!=s['quote']:raise ValueError('Invalid source correspondence')
        c=s['candidates'][0]
        if c['modality'] not in MODALITIES.values():raise ValueError('Unknown modality')
        records.append({'kind':'modal','modality':c['modality'],'action':c['action'],
                        'condition':c['condition'],'source':{k:s[k] for k in ['quote','start','end']}})
        covered.add(s['quote'])
    for match in re.finditer(r'[^。！？；;\n]+',text):
        raw=match.group().strip().removesuffix('.')
        if not raw:continue
        start=match.start()+match.group().index(raw)
        src=evidence(text,start,start+len(raw))
        if raw in covered:continue
        if len(raw)>1000:
            unknown.append({**src,'reason':'clause_length_limit'});continue
        try:
            # Explicit document labels carry scope, not an action or a guard.
            payload=re.sub(r'^(?:全局要求|Global requirements)\s*[:：]\s*','',raw,flags=re.I)
            tree=PARSER.parse(payload)
            if any(t.data=='_ambig' for t in tree.iter_subtrees()):raise ValueError('ambiguous')
            record=IR().transform(tree)
            if record['kind']=='modal' and re.search(r'[,，:：“”"\[【]|不得|必须|未经|并非|\b(if|unless|except|but|not|must)\b',record['action'],re.I):
                raise ValueError('unsupported nested scope')
            records.append({**record,'source':src})
        except (UnexpectedInput,ValueError):
            unknown.append({**src,'reason':'uncovered_grammar'})
    return records,unknown

def finding(code, sources, zh, en, witness=None):
    return {'code':code,'sources':sources,'suggestion':{'zh-CN':zh,'en':en},'witness':witness,'decision':None}

def check_sets(records):
    findings,calculations=[],[]
    targets=[r for r in records if r['kind']=='set' and r['role']=='target']
    forbidden=[r for r in records if r['kind']=='set' and r['role']=='forbidden']
    if targets and forbidden:
        t=set().union(*(set(r['values']) for r in targets));b=set().union(*(set(r['values']) for r in forbidden))
        overlap=sorted(t&b)
        calculations.append({'operation':'intersection','targets':sorted(t),'forbidden':sorted(b),'intersection':overlap})
        if overlap:findings.append(finding('target_overlap',[r['source'] for r in targets+forbidden],
            f'对象清单与禁止对象重叠：{", ".join(overlap)}。请核对同一任务范围及例外条件；工具不自动删除对象或禁项。',
            f'Targets overlap forbidden objects: {", ".join(overlap)}. Confirm task scope and exceptions; nothing is removed automatically.',overlap))
    groups=defaultdict(list)
    for r in records:
        if r['kind']=='bound':groups[(r['metric'],r['unit'])].append(r)
    for (metric,unit),bounds in sorted(groups.items()):
        interval=P.open(-P.inf,P.inf)
        for r in bounds:
            v=Decimal(r['value'])
            if unit=='calls':v=v.to_integral_value(rounding=ROUND_CEILING if r['relation']=='ge' else ROUND_FLOOR)
            interval &= P.closedopen(v,P.inf) if r['relation']=='ge' else P.openclosed(-P.inf,v)
        calculations.append({'operation':'interval_intersection','metric':metric,'unit':unit,'result':str(interval),'empty':interval.empty})
        if interval.empty:findings.append(finding('interval_empty',[r['source'] for r in bounds],
            f'“{metric}”的同单位上下限没有交集。请调整下限或上限；不把不同指标的时间范围混算。',
            f'The bounds for {metric} have an empty intersection. Revise the lower or upper bound; different metrics are not combined.',{'metric':metric,'unit':unit,'bounds':bounds}))
    return engine('portion + Python set','sets',calculations,findings)

def condition_expr(node, symbols):
    op=node['op']
    if op=='unconditional':return z3.BoolVal(True)
    if op=='NOT':return z3.Not(condition_expr(node['arg'],symbols))
    if op=='approval':return condition_expr(node['authorities'],symbols)
    if op=='authority':
        name=node['name'];symbols.setdefault(name,z3.Bool('approval_'+str(len(symbols))))
        return symbols[name]
    if op in ['AND','OR']:
        return {'AND':z3.And,'OR':z3.Or}[op](*[condition_expr(n,symbols) for n in node['args']])
    raise ValueError('Unsupported condition')

def check_logic(records):
    groups=defaultdict(list);findings=[];calculations=[]
    for r in records:
        if r['kind']=='modal':groups[r['action']].append(r)
    for action,rules in sorted(groups.items()):
        required=[r for r in rules if r['modality']=='REQUIRE'];banned=[r for r in rules if r['modality']=='FORBID']
        pairs=0
        for a in required:
            for b in banned:
                pairs+=1
                symbols={};guard=z3.And(condition_expr(a['condition'],symbols),condition_expr(b['condition'],symbols))
                s=z3.Solver();s.set(timeout=250);s.add(guard);state=s.check()
                calculation={'action':action,'guardOverlap':str(state),'sources':[a['source'],b['source']]}
                if state==z3.sat:
                    witness={n:z3.is_true(s.model().eval(v,model_completion=True)) for n,v in sorted(symbols.items())}
                    x=z3.Bool('execute');proof=z3.Solver();proof.set(timeout=250)
                    proof.assert_and_track(x,'required');proof.assert_and_track(z3.Not(x),'forbidden');p=proof.check()
                    calculation.update({'witness':witness,'jointActionConstraints':str(p),'core':sorted(str(v) for v in proof.unsat_core()) if p==z3.unsat else []})
                    findings.append(finding('modal_overlap',[a['source'],b['source']],
                        f'在同一执行者、任务和对象范围的假设下，“{action}”存在必须与禁止同时生效的条件。请核对授权适用范围或修改要求；提到授权者不表示已经获批。',
                        f'Under the same actor, task and scope assumption, {action} can be both required and forbidden. Clarify scope or revise requirements; an approval mention is not a granted approval.',witness))
                calculations.append(calculation)
        if not pairs:calculations.append({'action':action,'result':'no_require_forbid_pair','modalities':sorted(set(r['modality'] for r in rules))})
    return engine('z3-solver','logic',calculations,findings)

def check_graph(records):
    declarations=[r for r in records if r['kind']=='node'];edges=[r for r in records if r['kind']=='edge']
    graph=nx.DiGraph();graph.add_nodes_from(r['name'] for r in declarations)
    graph.add_edges_from((r['before'],r['after']) for r in edges)
    findings=[];calculations=[]
    if edges or declarations:
        components=sorted([sorted(c) for c in nx.strongly_connected_components(graph)],key=lambda c:tuple(c))
        cycles=[c for c in components if len(c)>1 or graph.has_edge(c[0],c[0])]
        for c in cycles:
            findings.append(finding('dependency_cycle',[r['source'] for r in edges if r['before'] in c and r['after'] in c],
                f'必须先完成的依赖形成循环：{"、".join(c)}。请区分强制前置与仅供参考的信息；这不是任意业务流程的停机证明。',
                f'Mandatory completion dependencies form a cycle: {", ".join(c)}. Distinguish prerequisites from references; this is not a general termination proof.',c))
        declared={r['name'] for r in declarations};missing=sorted(set(graph)-declared) if declarations else []
        if missing:findings.append(finding('undeclared_dependency',[r['source'] for r in edges],
            f'依赖中出现未列入任务节点清单的名称：{"、".join(missing)}。请补充节点说明或确认它们是否为外部依赖。',
            f'Dependencies reference undeclared nodes: {", ".join(missing)}. Declare them or identify external dependencies.',missing))
        calculations.append({'nodes':sorted(graph),'edges':sorted([list(e) for e in graph.edges]),'components':components,
                             'topologicalOrder':list(nx.lexicographical_topological_sort(graph)) if not cycles else None})
    return engine('networkx','graph',calculations,findings)

def engine(library,name,calculations,findings):
    unknown=any(c.get('guardOverlap')=='unknown' or c.get('jointActionConstraints')=='unknown' for c in calculations)
    return {'name':name,'library':library,'status':'incomplete' if unknown else 'findings' if findings else 'checked' if calculations else 'insufficient_data',
            'calculations':calculations,'findings':findings,'decision':None}

def compute_single(text, statements=None):
    if not isinstance(text,str) or not text.strip() or len(text)>100000:raise ValueError('Text length must be 1..100000')
    records,unknown=extract(text,statements or [])
    if len(records)>200:raise ValueError('At most 200 source constraints per calculation')
    # Bound solver pair count independently of input length.
    if sum(r['kind']=='modal' for r in records)>40:raise ValueError('At most 40 modal clauses per calculation')
    engines=[]
    for name,fn in [('sets',check_sets),('logic',check_logic),('graph',check_graph)]:
        try:engines.append(fn(records))
        except Exception as error:engines.append({'name':name,'status':'error','calculations':[],'findings':[],'error':type(error).__name__,'decision':None})
    analysis_error=None
    try:analysis=_source.analyze_source(text)
    except Exception as error:
        analysis=None;analysis_error={'code':'source_analysis_incomplete','type':type(error).__name__}
    # Partial source operations carry their own provenance and do not turn
    # unrelated clauses into a global SAT/permission/termination verdict.
    source_ops={
        'sets':[{'operation':'source_interval','constraint':n} for n in analysis['numbers']]
               +[{'operation':'symbolic_exclusion','constraint':e} for e in analysis['sets']['exclusions']]
               +[{'operation':'distinct_time_anchors','constraint':e} for e in analysis['times']['comparisons']],
        'logic':[{'operation':'numeric_boundary_probe','source':n['expressionSource'],'result':n['boundaryProbe']} for n in analysis['numbers']]
                +[{'operation':'approval_truth_table','source':a['source'],'result':a['truthTable']} for a in analysis['approvals']]
                +analysis['guardAnalysis']['calculations']+analysis['actuationAnalysis']['calculations']+analysis['effectAnalysis']['calculations'],
        'graph':[{'operation':'candidate_source_graph','result':analysis['flow']}] if analysis['flow']['nodes'] else []} if analysis else {k:[] for k in ['sets','logic','graph']}
    for e in engines:
        e['sourceCalculations']=source_ops[e['name']]+(analysis['structuralCalculations'].get(e['name'],[]) if analysis else [])
        if e['status']=='insufficient_data' and e['sourceCalculations']:e['status']='partial'
    return {'schema':'boundx-admin-engines/v1','sourceAnalysis':analysis,'sourceAnalysisError':analysis_error,'versions':{n:version(n) for n in ['lark','portion','z3-solver','networkx']},
            'text':text,'ir':records,'uncovered':unknown,'engines':engines,
            'businessDecision':None,'confirmation':None,'limitation':'Candidate source mapping; no voting, authorization, production readiness or general language proof.'}

def compute(text, statements=None):
    if not isinstance(text,str) or not text.strip() or len(text)>100000:raise ValueError('Text length must be 1..100000')
    spec=importlib.util.spec_from_file_location('boundx_work_packages',Path(__file__).with_name('work_packages.py'))
    wp=importlib.util.module_from_spec(spec);spec.loader.exec_module(wp)
    layout=wp.partition(text)
    if layout:
        result=wp.compute_packages(text,layout,compute_single)
        result['unscopedStatementsUsed']=False
        return result
    return compute_single(text,statements)

if __name__=='__main__':
    try:
        data=json.loads(sys.stdin.buffer.read(2000000).decode('utf-8'))
        result=compute(data['text'],data.get('statements'))
        sys.stdout.buffer.write(json.dumps(result,ensure_ascii=False,sort_keys=True).encode('utf-8'))
    except Exception as error:
        # No environment, credentials or arbitrary exception bodies in the UI.
        sys.stdout.write(json.dumps({'error':'Local calculation failed','type':type(error).__name__}))
        sys.exit(1)
