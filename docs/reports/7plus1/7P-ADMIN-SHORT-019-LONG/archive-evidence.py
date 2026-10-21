"""Lossless deterministic evidence archives; originals are never removed."""
from pathlib import Path
import concurrent.futures, gzip, hashlib, io, json, tarfile

OUT=Path('docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG')
assert not (OUT/'SEAL.md').exists()
ARCHIVE=OUT/'archives'
ARCHIVE.mkdir(exist_ok=True)
groups=[]
for root in ['attempts','controls-attempts','retention-attempts','closure-attempts','shadow-runs','repeat-fresh-02']:
    for p in sorted((OUT/root).iterdir()):
        if p.is_dir() and not (root=='controls-attempts' and p.name=='fresh-r01'):
            groups.append(p)
for root in ['baseline-50','retention-diagnostic-r01','repeat-pilot-final']:
    groups.append(OUT/root)

def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()

def archive(group):
    key=str(group.relative_to(OUT)).replace('\\','/').replace('/','--')
    target=ARCHIVE/(key+'.tar.gz')
    if target.exists():raise RuntimeError('EXISTING_ARCHIVE '+str(target))
    files=sorted(p for p in group.rglob('*') if p.is_file())
    records=[]
    with target.open('wb') as raw, gzip.GzipFile(fileobj=raw,mode='wb',mtime=0,filename='',compresslevel=6) as gz, tarfile.open(fileobj=gz,mode='w|',format=tarfile.PAX_FORMAT) as tar:
        for p in files:
            data=p.read_bytes();path=p.as_posix()
            info=tarfile.TarInfo(path);info.size=len(data);info.mtime=0;info.mode=0o644
            tar.addfile(info,io.BytesIO(data))
            records.append({'path':path,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
    expected={r['path']:r for r in records}
    with tarfile.open(target,'r:gz') as tar:
        count=0
        for info in tar:
            assert info.isfile() and info.name in expected
            data=tar.extractfile(info).read();r=expected[info.name]
            assert len(data)==r['bytes'] and hashlib.sha256(data).hexdigest()==r['sha256']
            count+=1
        assert count==len(records)
    print(key,len(records),target.stat().st_size,flush=True)
    return {'group':group.as_posix(),'archive_path':target.as_posix(),'sha256':sha(target),'bytes':target.stat().st_size,'raw_bytes':sum(r['bytes'] for r in records),'file_count':len(records),'verified':'EVERY_TAR_MEMBER_SHA256_EXACT','files':records}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    rows=list(pool.map(archive,groups))
result={'status':'PASS','method':'gzip/PAX tar containing original repository-relative paths, verified by every member byte hash; no original files deleted or rewritten','restore':'From repository root: tar -xzf <archive_path>. All archive paths are under this task report directory. Restore only archives needed for a read-only replay.','archives':rows,'file_count':sum(r['file_count'] for r in rows),'raw_bytes':sum(r['raw_bytes'] for r in rows),'archive_bytes':sum(r['bytes'] for r in rows)}
(OUT/'ARCHIVE-INDEX.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('ALL_ARCHIVES_VERIFIED',result['file_count'],result['archive_bytes'])
