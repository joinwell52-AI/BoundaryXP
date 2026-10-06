import sys,json,hashlib,importlib.metadata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E'
EX=ROOT/'.boundx/experiments/026e'
sys.path.insert(0,str(EX/'deps'))
def record(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return {'file':str(p),'bytes':p.stat().st_size,'sha256':h.hexdigest()}
download=json.loads((OUT/'MODEL-DOWNLOAD.json').read_text(encoding='utf8'))
folder=Path(download['configs'][0]).parent
assets=[record(p) for p in sorted(folder.rglob('*')) if p.is_file()]
hf_assets=[record(p) for p in sorted((EX/'hf-cache/hub').rglob('*')) if p.is_file() and 'snapshots' in p.parts]
dep_assets=[record(p) for p in sorted((EX/'deps').rglob('*.py')) if '__pycache__' not in p.parts]
dependencies={n:importlib.metadata.version(n) for n in ['perin-parser','penman','six','scipy','hanlp','torch','transformers','numpy']}
result={'download':download,'load':json.loads((OUT/'C-MODEL-LOAD.json').read_text(encoding='utf8')),'assets':assets,'hf_metadata_tokenizer_assets':hf_assets,'isolated_dependency_source_assets':dep_assets,'dependencies':dependencies,'licenses':{'hanlp_code':'Apache-2.0','perin_code':'MPL-2.0 per installed source-file headers; PyPI package classifiers are not overriding source headers','model':'HanLP published default CC-BY-NC-SA-4.0 unless otherwise specified; archive contains no separate license grant','encoder_base':'Langboat/mengzi-bert-base model card lists Apache-2.0; not a license override for the trained AMR model','training_data':'MRP2020 Chinese AMR; full training-data-specific license not independently established','production_approval':False,'sources':['https://github.com/hankcs/HanLP/blob/master/README.md#license','https://hanlp.hankcs.com/docs/api/hanlp/pretrained/amr.html','https://huggingface.co/Langboat/mengzi-bert-base']},'research_only':True,'weights_or_caches_uploaded':False,'automatic_graph_to_7plus1_projection':False}
with (OUT/'C-MODEL-AUDIT.json').open('x',encoding='utf8') as f:json.dump(result,f,ensure_ascii=False,indent=2)
print(json.dumps({'assets':len(assets),'hf_assets':len(hf_assets),'dependencies':dependencies,'params':result['load']['parameters']}))
