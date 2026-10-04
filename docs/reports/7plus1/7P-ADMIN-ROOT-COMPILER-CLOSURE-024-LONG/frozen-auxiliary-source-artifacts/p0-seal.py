"""Freeze this authorized repair after acceptance; never overwrite a seal."""
from pathlib import Path
import hashlib, json
BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[2]
def read(path): return json.loads(path.read_text(encoding='utf-8'))
def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(8*1024*1024),b''): h.update(chunk)
    return h.hexdigest()
def write(name,value):
    with (BASE/name).open('x',encoding='utf-8',newline='\n') as f: json.dump(value,f,ensure_ascii=False,indent=2); f.write('\n')
if (BASE/'SEAL.json').exists(): raise RuntimeError('ALREADY_SEALED')
validation=read(BASE/'VALIDATION.json'); regression=read(BASE/'FULL-REGRESSION.json'); parity=read(BASE/'CLI-UI-PARITY.json'); ui=read(BASE/'UI-VERIFICATION.json')
assert validation['status']=='PASS' and all(c['pass'] for c in validation['checks'])
assert regression['exit_code']==0 and regression['fail']==0 and regression['tests']==regression['pass']+regression['skipped']
assert parity['status']=='PASS' and parity['semantic_divergence']==0 and not ui['console_errors']
prior=read(BASE/'OLD-CANDIDATE-PRESERVATION.json'); assert not prior['snapshot_mismatches'] and not prior['original_candidate_directory_mismatches']
old=read(ROOT/'research/7plus1-parser/final-v0.1/MANIFEST.json')
model_verification=[]; extra=[]
for p in old['files']:
    if p.startswith('.boundx/semantic-models/') and p.endswith('/MANIFEST.json'):
        manifest=read(ROOT/p); checked=[]
        for item in manifest['files']:
            target=(ROOT/p).parent/item['path']; actual=digest(target)
            assert actual==item['sha256'],str(target)
            checked.append({'path':target.relative_to(ROOT).as_posix(),'sha256':actual});extra.append(target)
        model_verification.append({'resource':manifest['resource_id'],'revision':manifest['revision'],'manifest_sha256':digest(ROOT/p),'verified_files':checked})
write('MODEL-ASSET-VERIFICATION.json',model_verification)
role=read(BASE/'NLP-MODEL-ROLE-AUDIT.json')
role['linguistic_model_details']=[
 {'name':'spaCy en_core_web_sm','path':str(ROOT/'.boundx/nlp-venv/Lib/site-packages/en_core_web_sm/en_core_web_sm-3.8.0'),'loaded':True,'call_site':'linguistic-worker.analyze -> nlp.pipe','input_output_proof':'NLP-INVOCATION-PROOF.json / input 0','role':'English dependency/POS/NER','fallback':'No inferred replacement facts'},
 {'name':'spaCy zh_core_web_sm','path':str(ROOT/'.boundx/nlp-venv/Lib/site-packages/zh_core_web_sm/zh_core_web_sm-3.8.0'),'loaded':True,'call_site':'linguistic-worker.analyze -> nlp.pipe','input_output_proof':'NLP-INVOCATION-PROOF.json / input 1 / entities','role':'Chinese secondary syntax and NER','fallback':'No inferred replacement facts'},
 {'name':'HanLP zh','path':str(ROOT/'.boundx/nlp-models/hanlp'),'descriptor':str(ROOT/'.boundx/nlp-models/hanlp-zh.json'),'loaded':True,'call_site':'linguistic-worker.analyze -> model(batch, tasks)','input_output_proof':'NLP-INVOCATION-PROOF.json / input 1 / tokens and pos_alternatives and srl','role':'Chinese dependency/POS/SRL with protected tokens','fallback':'Fail parse rather than replace evidence with a different algorithm'}]
(BASE/'NLP-MODEL-ROLE-AUDIT-PRESEAL.json').write_bytes((BASE/'NLP-MODEL-ROLE-AUDIT.json').read_bytes())
(BASE/'NLP-MODEL-ROLE-AUDIT.json').write_text(json.dumps(role,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
selected=set(ROOT/p for p in old['files'])|set(extra)|{ROOT/'tests/parser-p0-semantic-repair.test.mjs'}
for p in BASE.rglob('*'):
    if p.is_file() and '__pycache__' not in p.parts and p.name not in ('MANIFEST.json','SEAL.json'): selected.add(p)
files={p.relative_to(ROOT).as_posix():digest(p) for p in sorted(selected)}
manifest={'format':'boundx-parser-p0-repair-freeze/v0.1','scope':'T1/T2, M1-M6, class-level regressions; ADMIN review pending','files':files,'policy':role['policy'],'prior_snapshot':prior,'runtime_note':'Existing run files are sealed; subsequent new runs may append in new directories. No source or audit overwrite.'}
write('MANIFEST.json',manifest)
write('SEAL.json',{'IMPLEMENTATION_FROZEN':True,'P0_SEMANTIC_CORRECTNESS_REPAIR':'PASS','status':'READY_FOR_ADMIN_REVIEW','acceptance_checks':len(validation['checks']),'full_regression':{'tests':regression['tests'],'passed':regression['pass'],'failed':0,'skipped':regression['skipped']},'CLI_UI_SEMANTIC_DIVERGENCE':0,'manifest_sha256':digest(BASE/'MANIFEST.json'),'file_count':len(files),'LLM':'NOT_USED','BLIND':'NOT_RUN','015_OPTIMIZATION':'NOT_RUN','FormalBoundaryModel':'NOT_STARTED','Admission':'NOT_STARTED','business_decision':None,'execution_authorization':None})
assert all(digest(ROOT/p)==h for p,h in files.items())
print(json.dumps(read(BASE/'SEAL.json'),ensure_ascii=False))
