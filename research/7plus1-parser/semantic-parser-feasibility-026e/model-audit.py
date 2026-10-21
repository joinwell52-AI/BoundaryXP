import sys, json, hashlib, importlib.metadata, importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E'
sys.path.insert(0,str(ROOT/'scripts'))
from nlp_model_specs import fingerprint_model_directory, NLP_SPECS
def files(root):
    rows=[]
    for p in sorted(root.rglob('*')):
        if not p.is_file() or '__pycache__' in p.parts: continue
        h=hashlib.sha256()
        with p.open('rb') as f:
            for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
        rows.append({'file':str(p),'bytes':p.stat().st_size,'sha256':h.hexdigest()})
    return rows
models=[]
for lang in ['zh','en']:
    spec=NLP_SPECS['spacy'][lang]
    path=Path(importlib.util.find_spec(spec['model']).origin).parent/(spec['model']+'-'+spec['version'])
    actual=fingerprint_model_directory(path)
    wheel=ROOT/'.boundx/nlp-models'/(spec['model']+'-'+spec['version']+'-py3-none-any.whl')
    wheel_sha=hashlib.sha256(wheel.read_bytes()).hexdigest()
    models.append({'arm':['A','B'],'engine':'spacy','language':lang,**spec,'path':str(path),'actual_directory_sha256':actual,'wheel':str(wheel),'actual_wheel_sha256':wheel_sha,'registered_hash_kind':'WHEEL_FILE_SHA256','hash_matches':wheel_sha==spec['sha256'],'files':files(path),'role':'Primary English syntax; Chinese cross-check retained in B raw worker response'})
spec=NLP_SPECS['hanlp']['zh']
path=ROOT/'.boundx/nlp-models/hanlp'/'hanlp/mtl'/spec['model'].split('/')[-1].removesuffix('.zip')
if not path.exists():
    paths=list((ROOT/'.boundx').glob('**/'+spec['model'].split('/')[-1].removesuffix('.zip')))
    path=next(p for p in paths if p.is_dir())
actual=fingerprint_model_directory(path)
models.append({'arm':['A','B'],'engine':'hanlp','language':'zh',**spec,'path':str(path),'actual_sha256':actual,'hash_matches':actual==spec['asset_sha256'],'files':files(path),'role':'Primary Chinese POS/DEP/SRL and retained SDP/CON in raw B worker output'})
dependencies={name:importlib.metadata.version(name) for name in ['hanlp','spacy','torch','transformers','tokenizers','numpy']}
result={'models':models,'dependencies':dependencies,'all_model_hashes_verified':all(m['hash_matches'] for m in models),'BGE_M3':{'called':False,'reason':'Synchronous unchanged syntax/candidate control isolates NLP fragmentation.'},'E5':{'called':False},'NLI':{'called':False},'LLM':{'called':False},'production_registry_modified':False}
with (OUT/('AB-MODEL-AUDIT-'+(sys.argv[1] if len(sys.argv)>1 else 'r002')+'.json')).open('x',encoding='utf8') as f:json.dump(result,f,ensure_ascii=False,indent=2)
print(json.dumps({'verified':result['all_model_hashes_verified'],'models':[m['engine']+':'+m['language'] for m in models],'dependencies':dependencies}))
