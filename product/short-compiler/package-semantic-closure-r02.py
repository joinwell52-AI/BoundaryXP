"""Package the manifest-listed same-core candidate, never local history or credentials."""
import hashlib, json, pathlib, zipfile, difflib, sys
suffix=sys.argv[1] if len(sys.argv)>1 else '30'
if suffix not in ('30','31','32'): raise RuntimeError('INVALID_VERSION')
root=pathlib.Path('.boundx/products/0.1.0-candidate.031-r1.2-ui.'+suffix).resolve()
parent=pathlib.Path('.boundx/products/0.1.0-candidate.031-r1.2-ui.29').resolve()
out=pathlib.Path('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02').resolve()
manifest=json.loads((root/'PRODUCT-MANIFEST.json').read_text(encoding='utf-8'))
package=out/(manifest['version']+'.zip')
if package.exists(): raise RuntimeError('PACKAGE_EXISTS')
patch=[]
with zipfile.ZipFile(package,'x',zipfile.ZIP_DEFLATED) as z:
    for f in manifest['files']:
        p=(root/f['path']).resolve()
        if not p.is_relative_to(root): raise RuntimeError('OUTSIDE_ROOT')
        data=p.read_bytes()
        if hashlib.sha256(data).hexdigest()!=f['sha256']: raise RuntimeError('DIGEST_CHANGED')
        z.writestr(f['path'],data)
        before=parent/f['path']
        old=before.read_bytes() if before.exists() else b''
        if old!=data and p.suffix in ('.mjs','.js','.md'):
            patch.extend(difflib.unified_diff(old.decode('utf-8').splitlines(True),data.decode('utf-8').splitlines(True),fromfile='a/'+f['path'],tofile='b/'+f['path']))
    z.writestr('PRODUCT-MANIFEST.json',(root/'PRODUCT-MANIFEST.json').read_bytes())
record={'package':str(package),'sha256':hashlib.sha256(package.read_bytes()).hexdigest(),'bytes':package.stat().st_size,'files':len(manifest['files'])+1,'dependencies_included':False,'history_included':False,'credentials_included':False,'semantic_acceptance':'NOT_PROVEN','deployed':False}
with (out/('PACKAGE.json' if suffix=='30' else 'PACKAGE-ui'+suffix+'.json')).open('x',encoding='utf-8',newline='\n') as f: json.dump(record,f,ensure_ascii=False,indent=2);f.write('\n')
with (out/('SOURCE-CHANGES.patch' if suffix=='30' else 'SOURCE-CHANGES-ui'+suffix+'.patch')).open('x',encoding='utf-8',newline='\n') as f: f.writelines(patch)
print(json.dumps(record))
