from pathlib import Path
import json, hashlib, zipfile
root=Path(__file__).resolve().parents[2]
version='0.1.0-candidate.031-r1.2-ui.52'
candidate=root/'.boundx'/'products'/version
report=root/'docs'/'reports'/'7plus1'/'UI52-FINAL-RESULT-DISPLAY-r01'
manifest=json.loads((candidate/'PRODUCT-MANIFEST.json').read_text(encoding='utf-8'))
destination=report/(version+'.zip')
with zipfile.ZipFile(destination,'x',zipfile.ZIP_DEFLATED) as archive:
    for item in manifest['files']:
        file=candidate/item['path']
        if hashlib.sha256(file.read_bytes()).hexdigest()!=item['sha256']: raise RuntimeError('RESOURCE_CHANGED')
        archive.write(file,item['path'])
    archive.write(candidate/'PRODUCT-MANIFEST.json','PRODUCT-MANIFEST.json')
with (report/'PACKAGE.json').open('x',encoding='utf-8') as f:
    json.dump({'version':version,'sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),'manifest_files':len(manifest['files']),'public_release':False,'model_calls':0},f,indent=2)
print(version)
