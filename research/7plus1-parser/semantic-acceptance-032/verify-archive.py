"""Round-trip the exact own candidate archive in an isolated directory."""
from pathlib import Path
import hashlib,json,zipfile,sys

report=Path('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG')
version=sys.argv[1] if len(sys.argv)>1 else '0.1.0-candidate.032.2'
metadata=json.loads((report/('delivery/PACKAGE-'+version+'.json')).read_text(encoding='utf-8'))
archive=Path(metadata['archive'])
assert hashlib.sha256(archive.read_bytes()).hexdigest()==metadata['sha256']
target=Path('.boundx/experiments/032/zip-extracted-'+version).resolve()
target.mkdir(exist_ok=False)
with zipfile.ZipFile(archive) as z:
    manifest_bytes=z.read('PRODUCT-MANIFEST.json')
    assert hashlib.sha256(manifest_bytes).hexdigest()==metadata['manifest_sha256']
    manifest=json.loads(manifest_bytes)
    allowed={f['path'] for f in manifest['files']}|{'PRODUCT-MANIFEST.json'}
    assert len(z.namelist())==len(allowed) and set(z.namelist())==allowed
    for name in z.namelist():
        p=(target/name).resolve()
        assert p.is_relative_to(target)
        p.parent.mkdir(parents=True,exist_ok=True)
        with p.open('xb') as f:f.write(z.read(name))
for item in manifest['files']:
    assert hashlib.sha256((target/item['path']).read_bytes()).hexdigest()==item['sha256']
result={'status':'PASS','version':manifest['version'],'archive_sha256':metadata['sha256'],
        'manifest_sha256':metadata['manifest_sha256'],'files':len(manifest['files']),
        'exact_manifest_only':True,'model_requests':0,'user_installation_changed':False,
        'dependency_install_and_rollback':'engineering/isolation-'+('domain-c3' if version.endswith('.3') else 'consumer-c2')+'/RESULTS.json'}
with (report/('delivery/ZIP-ROUNDTRIP-'+('C3' if version.endswith('.3') else 'C2')+'.json')).open('x',encoding='utf-8') as f:
    json.dump(result,f,ensure_ascii=False,indent=2);f.write('\n')
print(json.dumps(result))
