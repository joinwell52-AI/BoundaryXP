"""Package only explicitly listed product resources, not dependencies or user data."""
import hashlib
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[3]
package = root / '.boundx/experiments/031/packages/delivery-031-c5-committed'
manifest = json.loads((package / 'PRODUCT-MANIFEST.json').read_text(encoding='utf-8'))
out = root / '.boundx/deliverables/BoundaryXP-Short-Compiler-0.1.0-candidate.031.5.zip'
out.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(out, mode='x', compression=zipfile.ZIP_DEFLATED) as archive:
    for row in manifest['files']:
        file = (package / row['path']).resolve()
        file.relative_to(package.resolve())
        assert hashlib.sha256(file.read_bytes()).hexdigest() == row['sha256']
        archive.write(file, row['path'])
    archive.write(package / 'PRODUCT-MANIFEST.json', 'PRODUCT-MANIFEST.json')
record = {'path': str(out), 'sha256': hashlib.sha256(out.read_bytes()).hexdigest(), 'bytes': out.stat().st_size, 'source_commit': manifest['source_commit'], 'version': manifest['version'], 'credentials_included': False, 'history_included': False, 'weights_included': False, 'product_ready': False}
report = root / 'docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG'
(report / 'PRODUCT-PACKAGE.json').write_text(json.dumps(record, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(json.dumps(record, ensure_ascii=False))
