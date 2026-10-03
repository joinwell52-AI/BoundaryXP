import sys,json,hashlib,importlib.metadata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'scripts'))
from nlp_model_specs import fingerprint_model_directory,NLP_SPECS
rows=[]
for language in ('zh','en'):
    name=NLP_SPECS['spacy'][language]['model']
    module=__import__(name)
    directory=Path(module.__file__).parent/(name+'-'+NLP_SPECS['spacy'][language]['version'])
    rows.append({'resource':name,'path':str(directory),'version':importlib.metadata.version(name),'actual_asset_sha256':fingerprint_model_directory(directory),'metadata_path':str(ROOT/'.boundx/nlp-models'/('spacy-'+language+'.json')),'metadata_sha256':hashlib.sha256((ROOT/'.boundx/nlp-models'/('spacy-'+language+'.json')).read_bytes()).hexdigest(),'actually_invoked_evidence':'MODEL-PREFLIGHT.json / frozen non-Gold signals'})
directory=ROOT/'.boundx/nlp-models/hanlp/mtl'/NLP_SPECS['hanlp']['zh']['model'].rsplit('/',1)[-1].removesuffix('.zip')
rows.append({'resource':'hanlp-zh','path':str(directory),'version':importlib.metadata.version('hanlp'),'actual_asset_sha256':fingerprint_model_directory(directory),'expected_asset_sha256':NLP_SPECS['hanlp']['zh']['asset_sha256'],'metadata_path':str(ROOT/'.boundx/nlp-models/hanlp-zh.json'),'metadata_sha256':hashlib.sha256((ROOT/'.boundx/nlp-models/hanlp-zh.json').read_bytes()).hexdigest(),'actually_invoked_evidence':'MODEL-PREFLIGHT.json / frozen non-Gold signals'})
runtime={p:importlib.metadata.version(p) for p in ('torch','transformers','tokenizers','spacy','hanlp')}
out=Path(__file__).parent/'NLP-RESOURCE-MANIFESTS.json'
out.write_text(json.dumps({'syntax_resources':rows,'runtime':runtime,'status':'PASS' if rows[-1]['actual_asset_sha256']==rows[-1]['expected_asset_sha256'] else 'FAIL'},indent=2)+'\n',encoding='utf8')
print(json.dumps({'status':json.loads(out.read_text())['status'],'resources':[r['resource'] for r in rows]}))
