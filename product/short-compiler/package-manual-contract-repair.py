from pathlib import Path
import json, hashlib, zipfile, sys

root = Path(__file__).resolve().parents[2]
number = sys.argv[1] if len(sys.argv) > 1 else '33'
if number not in ('33', '35', '36'):
    raise RuntimeError('INVALID_VERSION')
version = '0.1.0-candidate.031-r1.2-ui.' + number
candidate = root / '.boundx' / 'products' / version
report = root / 'docs' / 'reports' / '7plus1' / 'MANUAL-CONTRACT-REPAIR-r01'
manifest = json.loads((candidate / 'PRODUCT-MANIFEST.json').read_text(encoding='utf-8'))
destination = report / (version + '.zip')
if destination.exists():
    raise RuntimeError('IMMUTABLE_PACKAGE_EXISTS')
with zipfile.ZipFile(destination, 'x', zipfile.ZIP_DEFLATED) as archive:
    for item in manifest['files']:
        file = candidate / item['path']
        if hashlib.sha256(file.read_bytes()).hexdigest() != item['sha256']:
            raise RuntimeError('RESOURCE_CHANGED: ' + item['path'])
        archive.write(file, item['path'])
    archive.write(candidate / 'PRODUCT-MANIFEST.json', 'PRODUCT-MANIFEST.json')
metadata = {'version': version, 'file': str(destination), 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(), 'manifest_files': len(manifest['files']), 'excludes_dependencies_and_credentials': True, 'public_release': False}
(report / ('PACKAGE.json' if number == '33' else 'PACKAGE-ui' + number + '.json')).write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(metadata, ensure_ascii=False))
