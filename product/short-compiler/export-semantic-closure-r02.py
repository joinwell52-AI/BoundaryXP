"""Export exact, authorized evidence to the private review branch, without account files."""
import pathlib, json, hashlib, zipfile, shutil, re
root=pathlib.Path('.boundx/exports/SEMANTIC-CONTRACT-CLOSURE-r02').resolve()
report=pathlib.Path('docs/reports/7plus1/SEMANTIC-CONTRACT-CLOSURE-r02').resolve()
sha=lambda b:hashlib.sha256(b).hexdigest()
candidate=report/'candidate'; candidate.mkdir(exist_ok=True)
def copy(src,dst):
    if dst.exists(): raise RuntimeError('FIRST_EVIDENCE_EXISTS:'+str(dst))
    data=src.read_bytes()
    if src.suffix in ('.json','.md','.txt','.patch','.tap') and re.search(rb'(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|Bearer\s+[A-Za-z0-9._-]{24,})',data): raise RuntimeError('POSSIBLE_CREDENTIAL_DO_NOT_EXPORT')
    dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(data)
for name in ['0.1.0-candidate.031-r1.2-ui.32.zip','PACKAGE-ui32.json','SOURCE-CHANGES-ui32.patch']:
    copy(root/name,candidate/name)
for name in ['ADMIN-AUTHORIZATION.md','CALL-LEDGER.json','BEFORE-AFTER-METRICS.json','FULL-SEMANTIC-INVENTORY.json','UNRESOLVED-AND-DIAGNOSTICS.json','FINAL-ENGINEERING-VERIFICATION.json','CLI-REPLAY-EQUALITY.json','58618-AFTER.json']:
    copy(root/name,report/name)
for name in ['targeted.json','targeted.tap','parent.json','parent.tap','candidate.json','candidate.tap','parent-ledger.json','candidate-ledger.json','SUMMARY.json']:
    copy(root/'frozen-ui32'/name,report/'tests'/name)
files=['live-REAL-GOLD-015/START.json','live-REAL-GOLD-015/ACTUAL-RESULT.json','live-REAL-GOLD-015/source.txt','live-REAL-GOLD-015/source.json','live-REAL-GOLD-015/selected-resources.json','live-REAL-GOLD-015/progress.ndjson','live-REAL-GOLD-015/run-summary.json','live-REAL-GOLD-015/trace.json']
for phase in ['parse','audit']:
    for name in ['response-0.txt','receipt-0.json','request-0.json','prompt-0.txt','output-schema-0.json']:
        files.append('live-REAL-GOLD-015/revision-0/'+phase+'-call/'+name)
for name in ['proposal.json','audit.json','technical-validation.json','boundary-ir.json','7plus1.json','7plus1.zh.md','boundary-calculations.json','trace.json','run-summary.json']:
    files.append('consumer-replay-ui32/'+name)
ledger=[];archive=report/'REAL-GOLD-015-trace.zip'
with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as z:
    for name in files:
        src=(root/name).resolve()
        if not src.is_relative_to(root):raise RuntimeError('OUTSIDE_EVIDENCE')
        data=src.read_bytes()
        if re.search(rb'(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|Bearer\s+[A-Za-z0-9._-]{24,})',data):raise RuntimeError('POSSIBLE_CREDENTIAL_DO_NOT_EXPORT')
        z.writestr(name,data);ledger.append({'path':name,'sha256':sha(data),'bytes':len(data)})
    z.writestr('MANIFEST.json',json.dumps({'files':ledger,'raw_semantics_unchanged':True,'account_files_included':False,'model_events_with_unknown_fields_included':False},ensure_ascii=False,indent=2)+'\n')
record={'candidate_sha256':sha((candidate/'0.1.0-candidate.031-r1.2-ui.32.zip').read_bytes()),'trace_archive_sha256':sha(archive.read_bytes()),'trace_archive_bytes':archive.stat().st_size,'trace_files':len(ledger),'branch':'review/7plus1-parser','repository_visibility_checked':'PRIVATE','semantic_quality_gate':'FAIL','deployed':False,'unrelated_dirty_changes_staged':False}
with (report/'DELIVERY.json').open('x',encoding='utf-8',newline='\n') as f:json.dump(record,f,ensure_ascii=False,indent=2);f.write('\n')
print(json.dumps(record))
