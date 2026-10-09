"""Archive only the exact frozen product manifest; no history/cache/credentials."""
from pathlib import Path
import hashlib,json,zipfile,sys
root=(Path('.boundx/experiments/032/packages')/(sys.argv[1] if len(sys.argv)>1 else 'final-c1')).resolve()
report=Path('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG')
manifest=json.loads((root/'PRODUCT-MANIFEST.json').read_text(encoding='utf-8'))
destination=report/'delivery'
destination.mkdir(exist_ok=True)
archive=destination/('BoundX-short-compiler-'+manifest['version']+'.zip')
with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
    for item in manifest['files']+[{'path':'PRODUCT-MANIFEST.json'}]:
        p=(root/item['path']).resolve()
        if not p.is_relative_to(root):raise ValueError('ESCAPING_PRODUCT_FILE')
        b=p.read_bytes()
        if 'sha256' in item and hashlib.sha256(b).hexdigest()!=item['sha256']:raise ValueError('PRODUCT_CHANGED')
        info=zipfile.ZipInfo(item['path'],date_time=(2000,1,1,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(info,b)
metadata={'archive':str(archive).replace('\\','/'),'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'manifest_sha256':hashlib.sha256((root/'PRODUCT-MANIFEST.json').read_bytes()).hexdigest(),'implementation_commit':manifest['source_commit'],'version':manifest['version'],'credentials_included':False,'history_included':False,'weights_included':False,'dependencies_included':False,'product_acceptance':'BLOCKED_BY_REAL_VALIDATION','installed_on_58618':False}
(destination/('PACKAGE-'+manifest['version']+'.json')).write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(metadata,ensure_ascii=False))
