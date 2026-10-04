from pathlib import Path
import hashlib,json,tarfile,datetime
root=Path('docs/reports/7plus1/7P-ADMIN-SHORT-020-LONG')
target=root/'SEAL-VERIFICATION.json'
assert not target.exists()
def sha(p):
    h=hashlib.sha256()
    with Path(p).open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()
def read(p):return json.loads(Path(p).read_text(encoding='utf8'))
manifest=read(root/'MANIFEST.json')
for f in manifest['files']:
    assert sha(f['path'])==f['sha256'],f['path']
    assert Path(f['path']).stat().st_size==f['bytes'],f['path']
for line in (root/'SHA256SUMS.txt').read_text(encoding='utf8').splitlines():
    expected,path=line.split('  ',1);assert sha(path)==expected,path
seal=(root/'SEAL.md').read_text(encoding='utf8')
assert sha(root/'MANIFEST.json') in seal and sha(root/'SHA256SUMS.txt') in seal
freeze=read(root/'candidate-freezes/2.json')
for f in freeze['files']+freeze['own_runtime_files']+freeze['models']+freeze['validation_protocol']:
    assert sha(f['path'])==f['sha256'],f['path']
candidate=hashlib.sha256(json.dumps({'files':freeze['files'],'models':freeze['models']},ensure_ascii=False,separators=(',',':')).encode('utf8')).hexdigest()
assert candidate==freeze['candidate_hash']
base=read(root/'BASELINE.json')
for f in base['tracked']:
    actual=sha(f['path']) if Path(f['path']).exists() else None
    assert actual==f['sha256'],f['path']
assert read(root/'DEVELOPMENT-CONTROLS-FREEZE.json')['sha256']==sha(root/'DEVELOPMENT-CONTROLS.json')
archive=read(root/'ARCHIVE-INDEX.json');count=0
for a in archive['archives']:
    assert sha(a['archive_path'])==a['sha256'],a['archive_path']
    expected={f['path']:f for f in a['files']}
    with tarfile.open(a['archive_path'],'r:gz') as t:
        assert {m.name for m in t.getmembers()}==set(expected)
        for m in t.getmembers():
            data=t.extractfile(m).read();f=expected[m.name]
            assert len(data)==f['bytes'] and hashlib.sha256(data).hexdigest()==f['sha256'],m.name
            assert sha(m.name)==f['sha256'],m.name
            count+=1
    print(a['archive_path'],'VERIFIED',flush=True)
for suite in ['C1-A','C2-A','C2-B','C2-B2']:
    folder=root/'blind'/suite
    if not folder.exists():continue
    for name,source in [('SUITE-SOURCE-FREEZE.json','SUITE-SOURCES.json'),('SUITE-ORACLE-FREEZE.json','SUITE-ORACLE.json')]:
        assert read(folder/name)['sha256']==sha(folder/source),suite
    if (folder/'first/RESULTS.json').exists():
        x=read(folder/'first/RESULTS.json')
        assert x['candidate_hash']==read(folder/'SUITE-SOURCE-FREEZE.json')['candidate_hash'],suite
        assert x['candidate_hash']==read(folder/'SUITE-ORACLE-FREEZE.json')['candidate_hash'],suite
result={'status':'PASS','verified_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'manifest_sha256':sha(root/'MANIFEST.json'),'sha256sums_sha256':sha(root/'SHA256SUMS.txt'),'seal_sha256':sha(root/'SEAL.md'),'candidate_hash':candidate,'direct_files':len(manifest['files']),'archive_count':len(archive['archives']),'archive_members':count,'archive_members_match_local_original_bytes':True,'protected_files_unchanged':len(base['tracked']),'model_files_unchanged':len(freeze['models']),'validation_protocol_unchanged':True,'sources_and_oracles_match_prefrozen_digests':True,'production_switch':False}
target.write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
print(json.dumps(result),flush=True)
