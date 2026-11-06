"""Read-only audit of the supplied current-result snapshot; no Core/model calls."""
from pathlib import Path
from collections import Counter
import hashlib,json
R=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
d=json.loads((R/'STATISTICS-VERIFIED.json').read_text(encoding='utf-8'))
assert sha(R/'STATISTICS-VERIFIED.json')=='069324ca249421ebfee1cb1b09bde9da4587acb2a1f939687d0a5aac6618b523'
rows=d['rows'];assert len(rows)==len({r['id'] for r in rows})==625
assert sum(r['nodes'] for r in rows)==3219
assert sum(r['annotation']==r['llm'] for r in rows)==625
assert sum(r['llm']==r['calculator'] for r in rows)==625
assert Counter(r['llm'] for r in rows)==d['distribution']=={'越界':259,'未越界':246,'信息不足':120}
counts=Counter()
for r in rows:
 for k,v in r['counts'].items():counts[k]+=v
 project=json.loads((R/'projects'/(r['id']+'.json')).read_text(encoding='utf-8'))
 result=json.loads((R/'results'/(r['id']+'.json')).read_text(encoding='utf-8'))
 assert sha(R/'projects'/(r['id']+'.json'))==r['project_sha256']
 assert sha(R/'results'/(r['id']+'.json'))==r['result_sha256']
 assert len(project['nodes'])==r['nodes']
 assert result['verification']['calculation_counts']==r['counts']
 checks=result['verification']['checks']
 differences=[c for c in checks if c.get('expected_comparison')=='DIFFERENCE']
 assert len(differences)==r['counts']['different']
 assert len(r['item_differences'])==r['counts']['different']
 for item in r['item_differences']:
  saved=next(c for c in differences if c['id']==item['id'])
  assert saved['result']==item['result'] and saved['difference_kind']==item['kind']
 assert sum(len(c.get('reference_errors',[]))>0 for c in checks)==r['counts']['invalid_references']
for k,v in d['counts'].items():assert counts[k]==v,(k,counts[k],v)
assert counts['total']==3469 and counts['matched']==3457 and counts['different']==9 and counts['incomplete']==3
assert counts['calculated']==3466 and counts['label_encoding_differences']==6 and counts['computed_result_differences']==3
assert counts['invalid']==0 and counts['invalid_references']==3
assert len(d['reference_error_cases'])==1 and d['reference_error_cases'][0]['id']=='JH-CAR36-025'
assert len(d['latest_jobs'])==625 and Counter(r['status'] for r in d['latest_jobs'])=={'COMPLETED':625}
assert len(d['excluded'])==1
for batch in d['batches']:
 group=[r for r in rows if r['batch']==batch['batch']]
 assert len(group)==batch['total']
 assert sum(r['nodes'] for r in group)==batch['nodes']
assert d['new_model_calls']==d['new_core_calls']==0
print(json.dumps({'passed':True,'groups':625,'nodes':3219,'calculations':3469,'matched':3457,'different':9,'incomplete':3,'reference_error_items':3,'scope':'Frozen raw-file identity and row-level statistical audit; not a new semantic review or mathematical replay.','new_model_calls':0,'new_core_calls':0}))
