from pathlib import Path
import hashlib,json,tarfile,datetime
root=Path('docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG')
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
    assert sha(f['path'])==f['sha256'] and Path(f['path']).stat().st_size==f['bytes'],f['path']
for line in (root/'SHA256SUMS.txt').read_text(encoding='utf8').splitlines():
    expected,path=line.split('  ',1);assert sha(path)==expected,path
seal=(root/'SEAL.md').read_text(encoding='utf8')
assert sha(root/'MANIFEST.json') in seal and sha(root/'SHA256SUMS.txt') in seal
freeze=read(root/'CANDIDATE-DIAGNOSTIC-FREEZE.json')
for f in freeze['runtime_closure']+freeze['models']:assert sha(f['path'])==f['sha256'],f['path']
candidate=hashlib.sha256(json.dumps(freeze['runtime_closure'],ensure_ascii=False,separators=(',',':')).encode('utf8')).hexdigest()
assert candidate==freeze['candidate_hash']
base=read(root/'BASELINE.json')
for f in base['tracked']:
    actual=sha(f['path']) if Path(f['path']).exists() else None
    assert actual==f['sha256'],f['path']
first_count=0
for line in (root/'FIRST-BLIND-SHA256SUMS.txt').read_text(encoding='utf8').splitlines():
    expected,path=line.split('  ',1);assert sha(path)==expected,path;first_count+=1
for label in ['r01','r02']:
    folder=root/'development'/label
    assert read(folder/'CONTROL-FREEZE.json')['sha256']==sha(folder/'CONTROLS.json')
    original=read(folder/'ALL-IMPLEMENTATION-FREEZE.json')
    for f in original['files']:assert sha(folder/'runtime'/Path(f['path']).name)==f['sha256'],f['path']
archive=read(root/'ARCHIVE-INDEX.json');count=0
for a in archive['archives']:
    assert sha(a['archive_path'])==a['sha256']
    expected={f['path']:f for f in a['files']}
    with tarfile.open(a['archive_path'],'r:gz') as t:
        assert {m.name for m in t.getmembers()}==set(expected)
        for m in t.getmembers():
            data=t.extractfile(m).read();f=expected[m.name]
            assert len(data)==f['bytes'] and hashlib.sha256(data).hexdigest()==f['sha256'],m.name
            assert sha(m.name)==f['sha256'],m.name
            count+=1
    print(a['archive_path'],'VERIFIED',flush=True)
first=read(root/'FIRST-BLIND-RESULTS.json');final=read(root/'FINAL-OUTCOME.json')
assert first['pass']==16 and final['final_development_score']=='21/100'
assert final['terminal_outcome']=='ARCHITECTURE_REVIEW_REQUIRED' and final['candidate_accepted'] is False
result={'status':'PASS','scope':'Artifact integrity and seal verification ONLY; semantic acceptance remains false','verified_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'manifest_sha256':sha(root/'MANIFEST.json'),'sha256sums_sha256':sha(root/'SHA256SUMS.txt'),'seal_sha256':sha(root/'SEAL.md'),'candidate_hash':candidate,'direct_files':len(manifest['files']),'archive_count':len(archive['archives']),'archive_members':count,'archive_members_match_local_original_bytes':True,'first_blind_files_unchanged':first_count,'protected_files_unchanged':len(base['tracked']),'model_files_unchanged':len(freeze['models']),'source_oracle_unchanged':True,'semantic_acceptance':False,'production_switch':False}
target.write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
print(json.dumps(result),flush=True)
