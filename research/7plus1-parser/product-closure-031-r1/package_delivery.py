"""Package only the frozen allowlist, then verify extracted bytes; no credentials/history."""
from pathlib import Path
import json, hashlib, zipfile, tempfile, subprocess

root = Path('.boundx/experiments/031-r1/packages/final-c3').resolve()
report = Path('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG').resolve()
delivery = report / 'delivery'
delivery.mkdir(exist_ok=True)
manifest_bytes = (root / 'PRODUCT-MANIFEST.json').read_bytes()
manifest = json.loads(manifest_bytes)
hash_bytes = lambda b: hashlib.sha256(b).hexdigest()
assert hash_bytes(manifest_bytes) == '619884b961d9da62882d07c402042c92ec385ce8e5f692774a0c73fd4f29f39f'
output = delivery / ('BoundX-short-compiler-' + manifest['version'] + '.zip')
assert not output.exists()
paths = [x['path'] for x in manifest['files']] + ['PRODUCT-MANIFEST.json']
with zipfile.ZipFile(output, 'x', compression=zipfile.ZIP_DEFLATED) as archive:
    for rel in sorted(paths):
        p = (root / rel).resolve()
        assert p.is_relative_to(root)
        entry = zipfile.ZipInfo(rel.replace('\\', '/'), date_time=(1980, 1, 1, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(entry, p.read_bytes())

temp = Path(tempfile.mkdtemp(prefix='boundx-031-r1-package-'))
with zipfile.ZipFile(output) as archive:
    assert sorted(archive.namelist()) == sorted(paths)
    archive.extractall(temp)
for x in manifest['files']:
    assert hash_bytes((temp / x['path']).read_bytes()) == x['sha256']
verified = subprocess.run(['node', str(temp / 'product/short-compiler/verify.mjs')], cwd=temp, capture_output=True, text=True, encoding='utf-8')
assert verified.returncode == 0, verified.stderr
result = {'status': 'PASS', 'version': manifest['version'], 'compiler': manifest['compiler_revision'], 'runtime_source_commit': manifest['source_commit'], 'zip': str(output), 'zip_sha256': hash_bytes(output.read_bytes()), 'zip_bytes': output.stat().st_size, 'manifest_sha256': hash_bytes(manifest_bytes), 'verified_files': len(manifest['files']), 'clean_extraction': str(temp), 'verification': json.loads(verified.stdout), 'clean_install_and_upgrade_evidence': 'engineering-c3/RESULTS.json', 'credentials_included': False, 'history_included': False, 'weights_included': False, 'model_calls': 0}
(delivery / 'PACKAGE.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(delivery / 'PRODUCT-MANIFEST.json').write_bytes(manifest_bytes)
print(json.dumps({k: result[k] for k in ['status', 'zip', 'zip_sha256', 'zip_bytes', 'verified_files']}))
