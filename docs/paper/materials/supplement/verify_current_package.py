"""Current package: integrity, source-based statistical reconstruction and resource checks."""
from pathlib import Path
import subprocess,sys,json
R=Path(__file__).resolve().parent.parent
commands=[
 [sys.executable,'-X','utf8','-B','supplement/verify_bilingual_package.py'],
 ['node','evidence-r22/rebuild_statistics.mjs'],
 [sys.executable,'-X','utf8','-B','evidence-r22/verify_resources.py']
]
checks=[]
for command in commands:
    p=subprocess.run(command,cwd=R,capture_output=True,text=True,encoding='utf-8')
    if p.returncode:
        raise RuntimeError(str(command)+'\n'+p.stdout+'\n'+p.stderr)
    checks.append(json.loads(p.stdout))
assert all(c['passed'] for c in checks)
revision=json.loads((R/'PACKAGE-MANIFEST.json').read_text(encoding='utf-8'))['revision']
print(json.dumps({'passed':True,'revision':revision,'checks':checks,'model_requests':0,'live_data_modified':False},ensure_ascii=False))
