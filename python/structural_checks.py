"""Calculations for explicitly named lists and mandatory prerequisite clauses.

No inferred asset inventory, role hierarchy or missing task edges.
"""
import re
import json
from pathlib import Path
import networkx as nx
import portion as P
from decimal import Decimal,ROUND_FLOOR,ROUND_CEILING

def integer_interval(op,value,interval):
    lo=value.to_integral_value(rounding=ROUND_FLOOR);hi=value.to_integral_value(rounding=ROUND_CEILING)
    if op=='eq':return P.closed(value,value) if lo==hi else P.empty()
    relation,limit={'lt':('le',hi-1),'le':('le',lo),'gt':('ge',lo+1),'ge':('ge',hi)}[op]
    return interval(relation,limit)

def readable(value):
    return re.sub(r"Decimal\('([^']+)'\)",r'\1',str(value))

DEPENDENCIES=[
 (r'(?P<before>[A-Z][A-Za-z0-9_]*)\s*必须在[^；;。]*?\b(?P<after>[A-Z][A-Za-z0-9_]*)\s*之前完成','before'),
 (r'(?P<after>[A-Z][A-Za-z0-9_]*)\s*必须在[^；;。]*?\b(?P<before>[A-Z][A-Za-z0-9_]*)\s*完成(?:并[^；;。]*?)?后(?:方可开始|启动)','after'),
 (r'(?P<after>[A-Z][A-Za-z0-9_]*)\s*必须依赖\s*(?P<before>[A-Z][A-Za-z0-9_]*)\s*的输出','output'),
 (r'(?P<before>[A-Z][A-Za-z0-9_]*)\s+must finish before\s+(?P<after>[A-Z][A-Za-z0-9_]*)','en')]
NAMED_DEPENDENCIES=json.loads(Path(__file__).with_name('dependency_patterns.json').read_text(encoding='utf-8'))

def calculate(text,spans,numbers,source,interval,note,identifier,lists=(),memberships=(),metric_candidates=()):
    calculations={'sets':[],'graph':[]};findings=[];facts=[]
    targets=[r for r in lists if r['role']=='target'];banned=[r for r in lists if r['role']=='forbidden']
    if targets and banned:
        t=set().union(*(set(r['values']) for r in targets));b=set().union(*(set(r['values']) for r in banned))
        overlap=sorted(t&b);remaining=sorted(t-b)
        calc={'operation':'explicit_list_intersection','targets':sorted(t),'forbidden':sorted(b),'overlap':overlap,'difference':remaining,
              'sources':[r['source'] for r in targets+banned],'authorized':None}
        calculations['sets'].append(calc)
        if overlap:
            f=note('explicit_target_overlap',targets[0]['source'],'显式目标清单与禁止清单交叠：'+', '.join(overlap)+'。请核对这些对象的任务范围；差集只是计算结果，不代表其余对象已获授权。',
                'Explicit target and prohibition lists overlap: '+', '.join(overlap)+'. Review those targets; the set difference does not authorize the remaining objects.')
            f.update(code='target_forbidden_overlap',severity='conflict',entities=overlap,proof=calc,
                title={'zh-CN':'目标名单与禁止名单重叠：'+', '.join(overlap),'en':'Targets overlap the prohibition list: '+', '.join(overlap)},
                scenario={'zh-CN':'这些对象同时被列为任务目标与禁止对象，当前要求需要核对。','en':'These objects are listed as both task targets and forbidden objects.'})
            f['sources']=[x['source'] for x in targets+banned];findings.append(f)
    for branch in memberships:
        calc={'operation':'membership_branch_coverage',**branch,'coveredCount':len(branch['coveredOutcomes']),'outcomeCount':2}
        calculations['graph'].append(calc)
        if branch['otherwise'] is None:
            description=branch['subject']+' ∉ {'+', '.join(branch['members'])+'}'
            f=note('dangling_conditional_branch',branch['condition'],
                '请补充 '+description+' 时如何处理，例如记录并跳过、转人工或停止；由 ADMIN 选择，不自动放行。',
                'Specify what to do when '+description+', such as record and skip, escalate, or stop. ADMIN chooses; no automatic release is inferred.')
            f.update(severity='unresolved',title={'zh-CN':'未说明不在清单内时如何处理','en':'No action is stated for objects outside the list'},
                scenario={'zh-CN':'已识别在清单内的处理分支；不在清单内的分支没有明确后续动作。这不证明任务一定卡死。',
                          'en':'The in-list branch has stated actions; the out-of-list branch has none identified. This does not prove deadlock.'},proof=calc)
            findings.append(f)
    graph=nx.DiGraph();edges=[]
    for pattern,_ in DEPENDENCIES:
        for m in re.finditer(pattern,text):
            src=source(text,m.start(),m.end());u,v=m['before'],m['after']
            graph.add_edge(u,v);edges.append({'before':u,'after':v,'source':src})
    named_edges=[]
    for a,b in spans:
        # Only an explicit final colon separates a lead-in from a step clause.
        start=a+max(text[a:b].rfind('：'),text[a:b].rfind(':'))+1
        src=source(text,start,b)
        if any(e['source']['start']<src['end'] and src['start']<e['source']['end'] for e in edges):continue
        for pattern in NAMED_DEPENDENCIES['patterns']:
            m=re.fullmatch(pattern,text[start:b].strip())
            if not m:continue
            u,v=m['before'].strip(),m['after'].strip()
            if not re.search('[\u4e00-\u9fff]',u+v):continue
            e={'before':u,'after':v,'source':source(text,start,b)}
            graph.add_edge(u,v);edges.append(e);named_edges.append(e)
    if edges:
        components=[sorted(c) for c in nx.strongly_connected_components(graph)];cyclic=[c for c in components if len(c)>1 or graph.has_edge(c[0],c[0])]
        order=list(nx.lexicographical_topological_sort(graph)) if not cyclic else None
        calculations['graph'].append({'operation':'explicit_prerequisite_graph','edges':edges,'scc':components,'cyclicComponents':cyclic,'topologicalOrder':order,'terminationProven':False})
        facts.append({'type':'prerequisite','source':edges[0]['source'],'summary':{
            'zh-CN':'显式依赖：'+', '.join(u+'→'+v for u,v in graph.edges)+('；没有依赖环，可行拓扑顺序：'+' → '.join(order) if order else '；存在依赖环。'),
            'en':'Explicit dependencies: '+', '.join(u+'→'+v for u,v in graph.edges)+('; no cycle, topological order: '+' → '.join(order) if order else '; dependency cycle found.')}})
        for c in cyclic:
            f=note('explicit_dependency_cycle',edges[0]['source'],'强制前置形成循环：'+', '.join(c)+'。请调整引用的前后条件；工具不自动删除边。','Mandatory prerequisites form a cycle: '+', '.join(c)+'. Revise the precedence conditions; no edge is removed automatically.')
            f['sources']=[e['source'] for e in edges if e['before'] in c and e['after'] in c];findings.append(f)
        if named_edges and not cyclic:
            f=note('dependency_identity_unresolved',named_edges[0]['source'],
                '已按原文步骤名称计算依赖图，尚未证明存在环。请为同一步骤使用统一名称或明确对应关系；不同步骤名不能自动合并。',
                'The dependency graph uses the exact source step names; no cycle has been established. Use consistent names or explicit aliases for the same step. Different step descriptions are not merged automatically.')
            f.update(severity='unresolved',title={'zh-CN':'依赖已提取，步骤对应关系需核对','en':'Dependencies extracted; step identities need review'},proof=calculations['graph'][-1])
            f['sources']=[e['source'] for e in named_edges];findings.append(f)
    groups={}
    for n in numbers:
        if n['kind']=='bound' and n.get('dimension'):groups.setdefault((n.get('metricKey',n['metric']),n['unit']),[]).append(n)
    for (_,unit),items in groups.items():
        if len(items)<2:continue
        metric=items[0].get('boundMetric',items[0]['metric'])
        result=P.open(-P.inf,P.inf)
        for n in items:result &= integer_interval(n['relation'],Decimal(n['value']),interval) if unit=='count' else interval(n['relation'],Decimal(n['value']))
        operands=[{'relation':n['relation'],'value':n['value'],'interval':readable(integer_interval(n['relation'],Decimal(n['value']),interval) if unit=='count' else interval(n['relation'],Decimal(n['value']))),'source':n['expressionSource']} for n in items]
        calc={'operation':'source_bound_intersection','metric':metric,'unit':unit,'interval':str(result),'empty':result.empty,
              'operands':operands,'readableResult':'∅' if result.empty else readable(result),
              'binding':items[0].get('metricBinding'),'sources':[i['source'] for i in items]}
        calculations['sets'].append(calc)
        facts.append({'type':'interval_intersection','source':items[0]['source'],'summary':{'zh-CN':'同一局部指标“'+metric+'”的区间交集：'+readable(result)+' '+unit+'。','en':'Same local metric '+metric+' has intersection '+readable(result)+' '+unit+'.'}})
        if result.empty:
            f=note('source_interval_empty',items[0]['source'],'同一局部指标“'+metric+'”的上下界交集为空。请核对上下限值或说明是否属于不同条件。','The local metric '+metric+' has an empty bound intersection. Review the values or distinguish their conditions.')
            signs={'lt':'<','le':'≤','gt':'>','ge':'≥','eq':'='}
            values=' 且 '.join(signs[n['relation']]+' '+n['value'] for n in items)
            f.update(code='interval_empty',severity='conflict',metric=metric,proof=calc,
                title={'zh-CN':metric+'：上下限无交集','en':'Incompatible bounds for '+metric},
                scenario={'zh-CN':metric+'要求 '+values+' '+('元' if unit=='CNY' else unit)+'，不存在同时满足这些条件的数值。',
                          'en':metric+' requires '+values.replace(' 且 ',' and ')+' '+unit+'; no value satisfies all these bounds.'})
            if calc['binding'] and calc['binding']['method']=='adjacent_amount_signature':f['assumption']={'zh-CN':'按相邻原句中相同动作、单笔粒度和主题“'+calc['binding']['topicAnchor']+'”绑定为同一金额计算；若实际是不同费用，应分别命名。',
                'en':'Adjacent clauses are mapped to the same amount using their shared action, transaction granularity and topic. If they concern different fees, name those separately.'}
            elif calc['binding'] and calc['binding']['status']=='source_binding_assumption':
                f['assumption']={'zh-CN':'后一指标名是前一指标名的缩略复指，按同一对象计算。请确认两处是否确实指向同一指标；若是不同对象，应分别写出全名。',
                    'en':'The later metric is an abbreviated reference to the earlier name. Confirm that they describe the same quantity; otherwise use distinct full names.'}
            if f.get('assumption'):
                f['scenario']['zh-CN']='按相邻两处描述指向同一指标计算：'+f['scenario']['zh-CN']
                f['scenario']['en']='Assuming the adjacent descriptions name the same metric: '+f['scenario']['en']
            f['sources']=[i['source'] for i in items];findings.append(f)
    for candidate in metric_candidates:
        left,right=candidate['left'],candidate['right'];unit=left['unit']
        convert=lambda n:integer_interval(n['relation'],Decimal(n['value']),interval) if unit=='count' else interval(n['relation'],Decimal(n['value']))
        intersection=convert(left)&convert(right)
        if not intersection.empty:continue
        names=[left['metricDisplay'],right['metricDisplay']]
        calc={'operation':'unbound_interval_comparison','metric':' / '.join(names),'metricNames':names,'unit':unit,
              'sameMetricHypothesis':True,'bindingEstablished':False,'emptyUnderHypothesis':True,'readableResult':'∅',
              'operands':[{'relation':n['relation'],'value':n['value'],'interval':readable(convert(n)),'source':n['expressionSource']} for n in [left,right]],
              'sources':[left['source'],right['source']]}
        calculations['sets'].append(calc)
        f=note('metric_identity_unresolved',left['source'],
            '请确认“'+names[0]+'”与“'+names[1]+'”是否为同一指标。若是同一指标，两处上下界没有共同取值，需要修正；若不是，请分别写出对象和指标全名。',
            'Confirm whether “'+names[0]+'” and “'+names[1]+'” name the same metric. If so, their bounds have no common value and need revision; otherwise state their distinct objects and full metric names.')
        f.update(severity='attention',proof=calc,sources=calc['sources'],
            title={'zh-CN':'先确认两个指标是否相同','en':'Confirm whether the two metrics are identical'},
            scenario={'zh-CN':'两段由转折词关联且共享名称尾部“'+candidate['sharedHead']+'”，但对象对应关系未确定。以下空集只在“同一指标”的假设下成立，尚未判为实际冲突。',
                      'en':'The contrasting clauses share a metric noun ending, but their object identity is unresolved. The empty intersection below holds only under a same-metric hypothesis; an actual conflict has not been established.'})
        findings.append(f)
    return {'calculations':calculations,'findings':findings,'facts':facts}
