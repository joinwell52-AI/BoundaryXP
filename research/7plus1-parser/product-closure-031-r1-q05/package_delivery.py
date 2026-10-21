"""Deliver a frozen allowlist; no service install/start and no model requests."""
from pathlib import Path
import json, hashlib, zipfile, tempfile, subprocess
root=Path('.boundx/experiments/031-r1/packages/q05-c1').resolve()
report=Path('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-Q05').resolve()
delivery=report/'delivery';delivery.mkdir(exist_ok=True)
b=(root/'PRODUCT-MANIFEST.json').read_bytes();m=json.loads(b)
h=lambda b:hashlib.sha256(b).hexdigest()
assert m['contract']=='031-r1-q05.1'
for x in m['files']:
    assert h((root/x['path']).read_bytes())==x['sha256']
    git_path='product/short-compiler/'+x['path'] if x['path'] in ['package.json','package-lock.json'] else x['path']
    committed=subprocess.check_output(['git','show',m['source_commit']+':'+git_path])
    assert h(committed)==x['sha256'],git_path
out=delivery/('BoundaryXP-short-compiler-'+m['version']+'.zip');assert not out.exists()
paths=[x['path'] for x in m['files']]+['PRODUCT-MANIFEST.json']
with zipfile.ZipFile(out,'x',compression=zipfile.ZIP_DEFLATED) as z:
    for rel in sorted(paths):
        p=(root/rel).resolve();assert p.is_relative_to(root)
        entry=zipfile.ZipInfo(rel,date_time=(1980,1,1,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(entry,p.read_bytes())
temp=Path(tempfile.mkdtemp(prefix='boundx-q05-clean-'))
with zipfile.ZipFile(out) as z:
    assert sorted(z.namelist())==sorted(paths);z.extractall(temp)
for x in m['files']:assert h((temp/x['path']).read_bytes())==x['sha256']
commands=[]
def run(args):
    p=subprocess.run(args,cwd=temp,capture_output=True,text=True,encoding='utf-8')
    commands.append({'args':args,'exit_code':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
    return p
assert run(['node',str(temp/'product/short-compiler/verify.mjs')]).returncode==0
assert run(['npm.cmd','ci','--ignore-scripts','--no-audit','--no-fund']).returncode==0
(temp/'input.txt').write_text('Inspect the record.',encoding='utf-8')
p=run(['node',str(temp/'product/short-compiler/cli.mjs'),'--input',str(temp/'input.txt'),'--output',str(temp/'zero-budget'),'--request-budget','0'])
assert p.returncode!=0 and 'MODEL_REQUEST_BUDGET_EXHAUSTED' in p.stderr
assert not list((temp/'zero-budget').rglob('request-*.json'))
result={'status':'PASS','source_commit':m['source_commit'],'zip':str(out),'zip_sha256':h(out.read_bytes()),'manifest_sha256':h(b),'files':len(m['files']),'source_commit_bytes':'PASS','clean_directory':str(temp),'commands':commands,'model_calls':0,'installed_or_started_service':False,'new_port':False,'credentials_included':False,'history_included':False,'quality_ready':False}
(delivery/'PACKAGE.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(delivery/'PRODUCT-MANIFEST.json').write_bytes(b)
print(json.dumps({k:result[k] for k in ['status','source_commit','zip_sha256','files','model_calls']}))
