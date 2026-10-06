import json,zipfile,hashlib,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E'
CODE=ROOT/'research/7plus1-parser/semantic-parser-feasibility-026e'
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()
paths=sorted(p for p in OUT.rglob('*') if p.is_file())
snapshot=json.loads((OUT/'RUNTIME-SNAPSHOT-MANIFEST.json').read_text(encoding='utf8'))['files']
target=OUT/'EVIDENCE.zip';started=time.perf_counter()
with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for i,p in enumerate(paths):
        archive.write(p,p.relative_to(ROOT).as_posix())
        if i%100==0:print(json.dumps({'archived':i,'total':len(paths)}),flush=True)
    for r in snapshot:
        p=ROOT/r['file']
        if sha(p)!=r['sha256']:raise ValueError('SNAPSHOT_SOURCE_CHANGED '+r['file'])
        archive.write(p,'reproduction-snapshot/'+r['file'])
with zipfile.ZipFile(target) as archive:
    bad=archive.testzip()
    if bad:raise ValueError('BAD_ARCHIVE '+bad)
    checked=0
    for p in paths:
        if hashlib.sha256(archive.read(p.relative_to(ROOT).as_posix())).hexdigest()!=sha(p):raise ValueError('ARCHIVE_BYTE_MISMATCH '+str(p))
        checked+=1
result={'file':str(target.relative_to(ROOT)).replace('\\','/'),'sha256':sha(target),'bytes':target.stat().st_size,'raw_files':len(paths),'snapshot_files':len(snapshot),'exact_raw_bytes_verified':checked,'CRC':'PASS','seconds':time.perf_counter()-started,'weights_cache_credentials_included':False,'raw_originals_preserved':True}
with (OUT/'EVIDENCE-PACKAGE.json').open('x',encoding='utf8') as f:json.dump(result,f,ensure_ascii=False,indent=2)
print(json.dumps(result),flush=True)
