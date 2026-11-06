"""Independent exact arithmetic and elementary witnesses on selected operands."""
from pathlib import Path
from fractions import Fraction
import argparse,json
R=Path(__file__).resolve().parent;E=R.parent/'evidence-r18'
def get(name,key):
 x=json.loads((E/'results'/(name+'.json')).read_text(encoding='utf-8'));c=next(c for c in x['verification']['checks'] if c['id']==key)
 return x,c
def verify():
 results=[]
 for case,key in [('R389-389','K5'),('EN20-007','K1'),('ENG20-016','K4')]:
  x,c=get(case,key);op=c['operation'];fixed=sum((Fraction(a['amount']) for a in op['allocations']),Fraction(0));cap=Fraction(op['limit'])
  assert op['combination']=='ADDITIVE' and all(a['amount_kind']=='FIXED' for a in op['allocations'])
  assert fixed>cap and c['result']['status']=='VIOLATED'
  results.append({'case_id':case,'query':key,'fixed_sum':str(fixed),'cap':str(cap),'minimum_excess':str(fixed-cap),'premise':'Other admissible contributions are nonnegative and no credits apply; this premise is source-backed, not established by arithmetic alone.','conclusion':'All admissible completions exceed the cap.','evidence_ids':c['evidence_ids']})
 x,c=get('EN20-011','K2');op=c['operation'];lo=Fraction(op['child']['lower']['value']);hi=Fraction(op['child']['upper']['value']);limit=Fraction(op['parent']['upper']['value'])
 assert lo<=limit<hi and c['result']['status']=='UNRESOLVED'
 results.append({'case_id':'EN20-011','query':'K2','conforming_witness':str(lo),'violating_witness':str(hi),'cap':str(limit),'premise':'The interval denotes possible values of one measured fact, not permitted plan choices.','conclusion':'Both outcomes are possible; the fact remains unresolved.'})
 x,c=get('ENG20-004','K2');edge=c['operation']['edges'][0];assert edge['from']==edge['to'] and c['result']['status']=='VIOLATED'
 results.append({'case_id':'ENG20-004','query':'K2','self_edge':edge,'premise':'Both endpoints denote the same individual action and prerequisite is strict.','conclusion':'The strict self-prerequisite has no execution order.'})
 x,c=get('R389-114','K2');op=c['operation'];assert op['parent']==op['child']=='rc31' and c['result']['status']=='VERIFIED'
 results.append({'case_id':'R389-114','query':'K2','version':op['parent'],'premise':'Parent and child values refer to the same declared version attribute.','conclusion':'Exact version equality holds; equality does not establish release permission.'})
 return {'passed':True,'examples':results,'model_calls':0,'core_calls':0,'scope':'Six selected queries recomputed with exact rational arithmetic, order and equality. These checks do not automatically prove natural-language interpretation correctness.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--record',action='store_true');a=p.parse_args();d=verify();out=R/'witness-checks.json'
 if a.record:out.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 else:assert json.loads(out.read_text(encoding='utf-8'))==d
 print(json.dumps({'passed':True,'selected_queries':len(d['examples']),'new_model_calls':0,'core_calls':0}))
