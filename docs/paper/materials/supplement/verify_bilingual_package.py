"""Verify one study's two language editions and its own experimental material."""
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((R/'PACKAGE-MANIFEST.json').read_text(encoding='utf-8'))
assert m['revision']=='preprint-v1.2-en-zh-r23' and m['studies']==1
assert m['distribution_revision']=='RESEARCH_ONLY_1' and m['engineering_source_included'] is False
for f in m['files']:
    name=f['path']
    assert not name.startswith(('evidence-r14/','case-r17/overlay/','evidence-r22/reducer/','evidence-r22/prompts/')),name
    assert not name.endswith(('.js','.ts','.cjs','.map','.woff','.woff2','.ttf')),name
    if name.endswith('.mjs'):assert name=='evidence-r22/rebuild_statistics.mjs',name
for f in m['files']:
    p=R/f['path'];assert p.is_file() and sha(p)==f['sha256'],f['path']
assert {f['path'] for f in m['files'] if f['path'].startswith('manuscript.') and f['path'].endswith('.md')}=={'manuscript.en.md','manuscript.zh-CN.md'}
for suffix in ['.md','.zh-CN.md']:assert (R/('BXP-0001-0.4.0-draft.2'+suffix)).read_bytes()==(R/'protocol-r14'/('BXP-0001'+suffix)).read_bytes()
assert len(list((R/'evidence-r18/projects').glob('*.json')))==625
assert len(list((R/'evidence-r18/results').glob('*.json')))==625
reports=json.loads((R/'reports625/MANIFEST.json').read_text(encoding='utf-8'))
assert len(reports['entries'])==625
for r in reports['entries']:
    report=R/'reports625'/r['report_path'];result=R/'reports625'/r['result_path']
    assert sha(report)==r['report_sha256'] and sha(result)==r['result_sha256']
    assert report.read_bytes().decode('utf-8')==json.loads(result.read_text(encoding='utf-8'))['report_markdown']
assert not any(f['path'].startswith(('evidence-v0.9/','evidence-r02/','evidence-r03/','case-r16/','evidence-r14/cases/')) for f in m['files'])
print(json.dumps({'passed':True,'files':len(m['files']),'studies':1,'language_editions':2,'current_cases':625,'original_saved_reports':625,'data_rewritten':False}))
