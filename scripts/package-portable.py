"""Build from the standalone repository at HEAD, without dependency trees."""
import hashlib,json,subprocess,sys,zipfile,re,posixpath
from urllib.parse import quote
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1]).resolve(); exe=Path(sys.argv[2]).resolve(); license_path=Path(sys.argv[3]).resolve()
if out.exists(): raise SystemExit('Refusing overwrite of package output')
version=json.loads(subprocess.check_output(['git','show','HEAD:package.json'],cwd=root,encoding='utf-8'))['version']
prefix=''
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
status=subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True)
if status.strip(): raise SystemExit('Commit component changes before packaging')
runtime=json.loads(subprocess.check_output([str(exe),'-p','JSON.stringify({version:process.version,arch:process.arch,platform:process.platform})'],text=True))
if runtime!={'version':'v24.16.0','arch':'x64','platform':'win32'}: raise SystemExit('Unexpected pinned runtime')
files={}
names=subprocess.check_output(['git','ls-files','-z'],cwd=root).decode('utf-8').rstrip('\0').split('\0')
for name in names:
    rel=name[len(prefix):]
    if rel.startswith(('src/','examples/','docs/','ui/','python/','protocol/','domain-packs/')) or rel in ['admin-python.mjs','cli.mjs','mcp.mjs','ui-server.mjs','start-ui.cmd','package.json','README.md','QUICKSTART.md','CHANGELOG.md']:
        files[rel]=subprocess.check_output(['git','show',sha+':'+name],cwd=root)
files['runtime/node.exe']=exe.read_bytes()
files['runtime/LICENSE']=license_path.read_bytes()
files['LICENSE']=subprocess.check_output(['git','show',sha+':LICENSE'],cwd=root)
for name in list(files):
    if not name.endswith('.md'): continue
    def link(match):
        target=match.group(1)
        if '://' in target or target.startswith('#'): return match.group(0)
        path,sep,fragment=target.partition('#')
        local=posixpath.normpath(posixpath.join(posixpath.dirname(name),path))
        if local in files: return match.group(0)
        repo=posixpath.normpath(posixpath.join(prefix,local))
        return '](https://github.com/joinwell52-AI/BoundaryXP/blob/'+sha+'/'+quote(repo)+ ('#'+fragment if sep else '')+')'
    files[name]=re.sub(r'\]\(([^)]+)\)',link,files[name].decode('utf-8')).encode('utf-8')
files['bx.cmd']=b'@echo off\r\n"%~dp0runtime\\node.exe" "%~dp0cli.mjs" %*\r\nexit /b %errorlevel%\r\n'
files['demo.cmd']=b'@echo off\r\ncall "%~dp0bx.cmd" decomposition "%~dp0examples\\decomposition-d044.json"\r\nset "boundx_result=%errorlevel%"\r\npause\r\nexit /b %boundx_result%\r\n'
files['self-test.cmd']=b'@echo off\r\n"%~dp0runtime\\node.exe" --test "%~dp0src\\__tests__\\*.test.ts" "%~dp0ui\\*.test.mjs"\r\nexit /b %errorlevel%\r\n'
files['BUILD.json']=(json.dumps(dict(version=version,git_sha=sha,runtime=runtime,node_sha256=hashlib.sha256(files['runtime/node.exe']).hexdigest(),node_license_source='https://raw.githubusercontent.com/nodejs/node/v24.16.0/LICENSE'),indent=2)+'\n').encode()
files['FILES.sha256']=''.join(hashlib.sha256(data).hexdigest()+'  '+name+'\n' for name,data in sorted(files.items())).encode()
out.mkdir(parents=True)
archive=out/f'BoundaryXP-{version}-win-x64.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for name,data in sorted(files.items()):
        entry=zipfile.ZipInfo('BoundaryXP/'+name,date_time=(2026,9,10,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(entry,data)
digest=hashlib.sha256(archive.read_bytes()).hexdigest()
(out/'SHA256SUMS.txt').write_bytes((digest+'  '+archive.name+'\n').encode())
print(json.dumps(dict(archive=str(archive),sha256=digest,files=len(files),git_sha=sha)))
