import hashlib, json, pathlib, zipfile, shutil

ROOT = pathlib.Path(__file__).resolve().parents[3]
CODE = pathlib.Path(__file__).resolve().parent
OLD = ROOT / 'docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E'
OUT = ROOT / 'docs/reports/7plus1/7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F'
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p, x):
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open('x', encoding='utf-8', newline='\n') as f: f.write(json.dumps(x, ensure_ascii=False, indent=2)+'\n')

OUT.mkdir(parents=True, exist_ok=True)
with (OUT / '.gitattributes').open('x', encoding='utf-8') as f: f.write('* -text\n')
with (CODE / '.gitattributes').open('x', encoding='utf-8') as f: f.write('* -text\n')
records = {}
for name in ['ORACLE-DOWNSTREAM-10.json','ORACLE-FAILURE-ANALYSIS.json','CORPUS-SELECTION.json','RUNTIME-SNAPSHOT-MANIFEST.json']:
    data=json.loads((OLD/name).read_bytes()); records[name]={'sha256':digest(OLD/name),'keys':list(data),'data':data}
archive=OLD/'EVIDENCE.zip'
assert digest(archive)=='977cd15d6f436181e89baf67577c11bc77dca847c692d3130b865bfb59a535b0'
manifest=json.loads((OLD/'RUNTIME-SNAPSHOT-MANIFEST.json').read_bytes())
print('snapshot keys',list(manifest))
with zipfile.ZipFile(archive) as z:
    snapshots=[n for n in z.namelist() if n.startswith('reproduction-snapshot/') and not n.endswith('/')]
    for name in snapshots:
        rel=pathlib.PurePosixPath(name.removeprefix('reproduction-snapshot/'))
        assert '..' not in rel.parts and not rel.is_absolute()
        for arm in ['baseline','trial']:
            target=CODE/arm/pathlib.Path(*rel.parts); target.parent.mkdir(parents=True,exist_ok=True)
            with target.open('xb') as f: f.write(z.read(name))
    raw=[n for n in z.namelist() if '/oracle/r00' in n and not n.endswith('/')]
    raw_inventory=[{'path':n,'sha256':hashlib.sha256(z.read(n)).hexdigest(),'bytes':len(z.read(n))} for n in raw]
save(OUT/'PREDECESSOR-AUDIT.json',{'archive_sha256':digest(archive),'snapshot_count':len(snapshots),'oracle_raw_count':len(raw),'oracle_raw_inventory':raw_inventory,'records':records})
print('extracted',len(snapshots),'oracle files',len(raw))
selection=records['CORPUS-SELECTION.json']['data']
for r in selection['cases']:
    if r['id'] in selection['oracle_ids']: print(r['id'],r['source'])
