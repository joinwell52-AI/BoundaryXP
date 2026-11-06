"""Independently rebuild configuration and prompt availability counts from saved files."""
from pathlib import Path
from collections import Counter
import hashlib,json
E=Path(__file__).resolve().parent;P=E.parent
read=lambda p:json.loads(p.read_text(encoding='utf-8'));sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest=read(E/'SOURCE-MANIFEST.json')
for r in manifest['entries']:assert sha(E/r['package_path'])==r['sha256'],r['package_path']
index=read(E/'run-resources.json');records={r['case_id']:r for r in index['records']}
models=Counter();reasoning=Counter();protocol=Counter();prompts=Counter();actual=Counter()
for f in (P/'evidence-r18/results').glob('*.json'):
    x=read(f);p=read(P/'evidence-r18/projects'/f.name);r=records[f.stem]
    assert sha(f)==r['result_sha256'] and sha(P/'evidence-r18/projects'/f.name)==r['project_sha256']
    assert x['joint_resources']['protocol']==r['protocol_digest'];protocol[r['protocol_digest']]+=1
    assert x['joint_resources']['instructions']==r['prompt_digest'];prompts[r['prompt_digest']]+=1
    m=x.get('metrics',{});g=m.get('original_generation_metrics',m)
    assert g.get('actual_model')==r['generation_actual_model'];actual[str(g.get('actual_model'))]+=1
    assert p['settings'].get('model')==r['saved_project_requested_model'];models[r['saved_project_requested_model']]+=1
    assert p['settings'].get('reasoning')==r['saved_project_reasoning'];reasoning[r['saved_project_reasoning']]+=1
assert models=={'gpt-6.1-sol':625} and reasoning=={'medium':583,'xhigh':42} and actual=={'None':625}
draft=E/'protocol-source/BXP-0001-0.4.0-draft.1.zh-CN.md'
assert protocol=={sha(draft):625}
pi=read(E/'prompt-index.json');found=0;covered=0;missing=0
for r in pi['digests']:
    assert prompts[r['sha256']]==r['cases']
    if r.get('path'):assert sha(E/r['path'])==r['sha256'];found+=1;covered+=r['cases']
    else:missing+=r['cases']
assert found==pi['originals_found']==0 and covered==pi['cases_with_exact_prompt']==0 and missing==625
assert pi['historical_originals_found']==9 and pi['historical_cases_with_exact_prompt']==604
print(json.dumps({'passed':True,'cases':625,'retained_source_files':len(manifest['entries']),'exact_prompt_originals':found,'covered_results':covered,'not_bundled_prompt_results':missing,'historical_missing_original_results':21,'production_templates_distributed':False,'saved_protocol_resource':'0.4.0-draft.1','paper_specification':'0.4.0-draft.2 / 2026-10-27-r2','configured_request_models':dict(models),'configured_reasoning':dict(reasoning),'actual_model_unrecorded':625,'temperature_not_retrospectively_filled':True,'model_requests':0}))
