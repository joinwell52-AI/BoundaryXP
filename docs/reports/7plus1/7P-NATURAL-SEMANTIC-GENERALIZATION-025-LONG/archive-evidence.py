import pathlib, json, hashlib, zipfile, sys
root = pathlib.Path('docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG')
mode = sys.argv[1] if len(sys.argv)>1 else 'development'
groups = sorted((root/'development').iterdir()) if mode=='development' else [root/x for x in ['mutation-raw','source-audits','blind-first','reproducible-runtime']]
destination = root/'raw-archives'; destination.mkdir(exist_ok=True)
def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda:f.read(1048576),b''): h.update(block)
    return h.hexdigest()
records=[]
for group in groups:
    target=destination/(mode+'-'+group.name+'.zip')
    if target.exists():
        print('preserved '+str(target),flush=True); continue
    entries=[]
    with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
        for file in sorted(group.rglob('*')):
            if not file.is_file(): continue
            relative=file.relative_to(root).as_posix(); checksum=digest(file)
            entries.append({'path':relative,'bytes':file.stat().st_size,'sha256':checksum})
            archive.write(file,relative)
        archive.writestr('ARCHIVE-CONTENTS.json',json.dumps({'original_root':str(root),'files':entries},ensure_ascii=False,indent=2))
    with zipfile.ZipFile(target) as archive:
        for e in entries:
            h=hashlib.sha256()
            with archive.open(e['path']) as f:
                for block in iter(lambda:f.read(1048576),b''): h.update(block)
            if h.hexdigest()!=e['sha256']: raise RuntimeError('ARCHIVE_BYTES_MISMATCH '+e['path'])
    records.append({'archive':target.relative_to(root).as_posix(),'sha256':digest(target),'bytes':target.stat().st_size,'original_file_count':len(entries),'verification':'PASS','files':entries})
    print(json.dumps({k:v for k,v in records[-1].items() if k!='files'}),flush=True)
index=destination/(mode+'-INDEX.json')
with index.open('x',encoding='utf8') as file: json.dump({'groups':records},file,ensure_ascii=False,indent=2)
