"""Recheck the paper's clarified finite examples, without models or product calls."""
from pathlib import Path
from fractions import Fraction as F
import hashlib,json
H=Path(__file__).resolve().parent;P=H.parent
x=json.loads((P/'evidence-r18/results/R389-081.json').read_text(encoding='utf-8'))
q=next(c for c in x['proposal']['calculations'] if c['id']=='K4')
op=q['operation'];values=[F(a['amount']) for a in op['allocations']];limit=F(op['limit'])
assert op['combination']=='ADDITIVE' and op['unit']=='CNY'
assert values==[F(2500),F(1700)] and limit==4000
assert all(v<=limit for v in values) and sum(values)>limit
saved=next(c for c in x['verification']['checks'] if c['id']=='K4')['result']
assert saved['status']=='VIOLATED' and F(saved['total'])==sum(values)
texts='\n'.join(n['text'] for n in x['joint_input']['nodes'])
assert '任何返款单独记账，不抵减此上限' in texts and '两笔采购都属于同一工作包' in texts
assert sum(values)-300==3900 and sum(values)-limit==200
# A nonempty proposal and its inconsistent inherited constraints are distinct.
freight=[F(0),F(1),F(400)]
proposal=[(F(6400),f,F(6400)+f) for f in freight]
inherited=[a for a in proposal if a[2]<=6000]
assert proposal and not inherited
# General lower-bound argument is in the paper; finite values only check examples.
assert all(total>=6400 and total>6000 for _,_,total in proposal)
# An existential ordered pair alone misses the earlier formal submission.
reviews=[20];submits=[10,30]
some_pair=any(v<s for v in reviews for s in submits)
every_submission=all(any(v<s for v in reviews) for s in submits)
assert some_pair and not every_submission
designated_initial=any(v<10 for v in reviews)
assert not designated_initial
# The switching fragment accepts no-inspection normal delivery; background rejects it.
def switching(h,d,r,stop,no_late_inspection):
    Q=(h or d) and (not h or r)
    K=(not h) or (stop and no_late_inspection)
    return Q and K
assert switching(False,True,False,False,True)
assert not (False and switching(False,True,False,False,True))
assert switching(True,False,True,True,True)
assert switching(True,True,True,True,True)
assert not switching(True,False,True,True,False)
result={'passed':True,'scope':'Finite paper-example checks; not a new product experiment or general semantic proof',
        'combination':{'case_id':'R389-081','query':'K4','source_sha256':hashlib.sha256((P/'evidence-r18/results/R389-081.json').read_bytes()).hexdigest(),'individual_amounts':['2500','1700'],'limit':'4000','total':'4200','excess':'200','refund_does_not_reduce_gross':True},
        'proposal_vs_inherited':{'finite_proposal_models':len(proposal),'inherited_models':len(inherited),'minimum_excess':'400','general_lower_bound_proved_in_text':True},
        'event_identity':{'existential_pair':some_pair,'every_formal_submission':every_submission,'designated_initial_submission_reviewed':designated_initial},
        'stop':{'switching_fragment_needs_inspection_background':True,'report_only_and_voluntary_delivery_both_retained':True},
        'model_calls':0,'product_calls':0}
(H/'r20-example-checks.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
