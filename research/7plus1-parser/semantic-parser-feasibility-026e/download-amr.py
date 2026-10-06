import urllib.request, hashlib, json, time, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E'
MODEL=ROOT/'.boundx/experiments/026e/amr'
MODEL.mkdir(parents=True,exist_ok=True)
URL='https://download.hanlp.com/amr/extra/amr-zho-mengzi-base_20220415_101941.zip'
target=MODEL/'amr-zho-mengzi-base_20220415_101941.zip'
started=time.perf_counter()
try:
    h=hashlib.sha256();size=0
    with urllib.request.urlopen(URL,timeout=30) as response, target.open('xb') as file:
        expected=int(response.headers['Content-Length'])
        while True:
            block=response.read(1024*1024)
            if not block:break
            file.write(block);h.update(block);size+=len(block)
            if size%(32*1024*1024)==0:print(json.dumps({'downloaded':size,'expected':expected}),flush=True)
    if size!=expected:raise ValueError('INCOMPLETE_DOWNLOAD')
    with zipfile.ZipFile(target) as archive:
        for name in archive.namelist():
            path=(MODEL/name).resolve()
            if not path.is_relative_to(MODEL.resolve()):raise ValueError('UNSAFE_ARCHIVE_PATH')
        archive.extractall(MODEL)
    configs=list(MODEL.rglob('config.json'))
    receipt={'status':'DOWNLOADED','url':URL,'model_name':'MRP2020_AMR_ZHO_MENGZI_BASE','file':str(target),'sha256':h.hexdigest(),'bytes':size,'configs':[str(p) for p in configs],'seconds':time.perf_counter()-started,'research_only':True,'production_model_registry_changed':False}
    print(json.dumps(receipt),flush=True)
except Exception as e:
    receipt={'status':'DOWNLOAD_FAILED','url':URL,'error':repr(e),'seconds':time.perf_counter()-started,'research_only':True}
with (OUT/'MODEL-DOWNLOAD.json').open('x',encoding='utf-8') as f:json.dump(receipt,f,ensure_ascii=False,indent=2)
