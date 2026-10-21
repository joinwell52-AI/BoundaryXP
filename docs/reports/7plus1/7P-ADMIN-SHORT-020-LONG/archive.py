from pathlib import Path
import hashlib,json,tarfile
root=Path('docs/reports/7plus1/7P-ADMIN-SHORT-020-LONG')
dest=root/'evidence-archives'
assert not (root/'ARCHIVE-INDEX.json').exists()
dest.mkdir(exist_ok=True)
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
paths=[]
for sub in ['runs','blind','repeat','anti-overfit']:
    for p in (root/sub).rglob('*'):
        if not p.is_file():continue
        relative=p.relative_to(root).as_posix()
        if '/MAIN/fresh-04/' in relative:continue
        if p.name in ['RESULTS.json','SUITE-SOURCES.json','SUITE-ORACLE.json','SUITE-SOURCE-FREEZE.json','SUITE-ORACLE-FREEZE.json','FIRST-DIVERGENCES.json','SOURCE-FREEZE.json','CASES.json','STATIC.json']:continue
        paths.append(p)
paths.sort()
archives=[];group=[];size=0
def archive(group):
    filename=dest/('part-%03d.tar.gz'%(len(archives)+1));assert not filename.exists()
    records=[]
    with tarfile.open(filename,'w:gz',compresslevel=6) as tar:
        for p in group:
            name=p.as_posix();info=tar.gettarinfo(str(p),name)
            info.uid=info.gid=0;info.uname=info.gname='';info.mtime=0
            with p.open('rb') as f:tar.addfile(info,f)
            records.append({'path':name,'sha256':sha(p),'bytes':p.stat().st_size})
    archives.append({'archive_path':filename.as_posix(),'sha256':sha(filename),'bytes':filename.stat().st_size,'file_count':len(records),'files':records})
    print(filename,len(records),filename.stat().st_size,flush=True)
for p in paths:
    if group and (size+p.stat().st_size>20*1024*1024 or len(group)>=180):
        archive(group);group=[];size=0
    group.append(p);size+=p.stat().st_size
if group:archive(group)
(root/'ARCHIVE-INDEX.json').write_text(json.dumps({'format':'LOSSLESS_TAR_GZIP_ORIGINAL_BYTES','no_evidence_deleted':True,'archives':archives},indent=2)+'\n',encoding='utf8')
print('ARCHIVE_COMPLETE',len(paths),len(archives),flush=True)
