"""Independent finite mathematics for EN20-007; not the workbench implementation."""
from pathlib import Path
from fractions import Fraction
from itertools import product
import json,hashlib
P=Path(__file__).resolve().parent
read=lambda p:json.loads(p.read_text(encoding='utf-8'))
x=read(P/'result.json');source=read(P/'provenance.json')
assert hashlib.sha256((P/'result.json').read_bytes()).hexdigest()==source['source_result_sha256']
assert read(P/'source.json')==x['joint_input']
def truth(expr,values):
    if type(expr) is bool:return expr
    assert isinstance(expr,dict) and len(expr)==1,expr
    key,arg=next(iter(expr.items()))
    if key=='var':return values[arg]
    if key=='not':return not truth(arg,values)
    if key=='all':return all(truth(a,values) for a in arg)
    if key=='any':return any(truth(a,values) for a in arg)
    if key=='implies':return not truth(arg[0],values) or truth(arg[1],values)
    raise AssertionError(key)
rows=[]
for c in x['verification']['checks']:
    op=c['operation'];kind=op['kind'];detail={}
    if kind=='budget':
        assert op['combination']=='ADDITIVE' and op['unit']=='EUR' and op['complete'] is False
        lower=sum((Fraction(a['amount']) for a in op['allocations']),Fraction(0));limit=Fraction(op['limit'])
        assert lower==6400 and limit==6000;status='VIOLATED' if lower>limit else 'UNRESOLVED';detail={'lower_bound':str(lower),'limit':str(limit),'minimum_excess':str(lower-limit)}
    elif kind in ['interval_subset','interval_composition']:
        assert op['assessment_mode']=='FACT_ASSESSMENT' and op['unit']=='EUR'
        intervals=op['intervals'] if kind=='interval_composition' else [op['child']]
        if kind=='interval_composition':assert op['combination']=='ADDITIVE' and op['independent'] is True
        assert all(b is None or b['inclusive'] for v in intervals+[op['parent']] for b in [v['lower'],v['upper']])
        lower=sum(Fraction(v['lower']['value']) for v in intervals)
        upper=None if any(v['upper'] is None for v in intervals) else sum(Fraction(v['upper']['value']) for v in intervals)
        pl=None if op['parent']['lower'] is None else Fraction(op['parent']['lower']['value'])
        pu=None if op['parent']['upper'] is None else Fraction(op['parent']['upper']['value'])
        subset=(pl is None or lower>=pl) and (pu is None or upper is not None and upper<=pu)
        disjoint=(pu is not None and lower>pu) or (pl is not None and upper is not None and upper<pl)
        status='VERIFIED' if subset else 'VIOLATED' if disjoint else 'UNRESOLVED'
        detail={'lower_bound':str(lower),'upper_bound':None if upper is None else str(upper),'disjoint':disjoint,'subset':subset}
    else:
        assert kind=='boolean_implication' and op['assessment_mode']=='FACT_ASSESSMENT'
        names=op['variables'];domain=[dict(zip(names,v)) for v in product([False,True],repeat=len(names))]
        models=[v for v in domain if truth(op['child'],v)];assert models
        passing=sum(truth(op['parent'],v) for v in models);failing=len(models)-passing
        status='VERIFIED' if failing==0 else 'VIOLATED' if passing==0 else 'UNRESOLVED'
        detail={'passing_completions':passing,'failing_completions':failing}
        assert passing==c['result']['passing_completions'] and failing==c['result']['failing_completions']
    assert status==c['result']['status'],c['id']
    rows.append({'id':c['id'],'kind':kind,'status':status,'mathematical_detail':detail})
assert len(rows)==9
assert [r['status'] for r in rows]==['VIOLATED']*4+['VERIFIED']*5
print(json.dumps({'passed':True,'case_id':'EN20-007','checks':rows,'scope':'Independent rational lower-bound and finite Boolean checks of saved operands; not a product replay, whole-task reduction, or new semantic annotation.','workbench_source_used':False,'model_requests':0}))
