// Evaluation evidence only. This never changes or deploys the frozen product.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';import {walk,requestLedger} from './transport-ledger.mjs';
const root=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION-R02');
const prior=root.replace(/-R02$/,'');
const old=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const execute=(file,args=[])=>JSON.parse(execFileSync(process.execPath,[file,...args],{encoding:'utf8',maxBuffer:30000000}));
const write=(name,v)=>fs.writeFileSync(path.join(root,name),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const self=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
if(process.argv[2]==='verify'){
 const manifest=read(path.join(root,'MANIFEST.json')),seal=read(path.join(root,'SEAL.json'));
 const files=walk(root).map(p=>path.relative(root,p).replaceAll('\\','/')).filter(p=>!self.has(p)).sort();
 assert.deepEqual(files,manifest.files.map(f=>f.path));
 for(const f of manifest.files){assert.equal(sha256(fs.readFileSync(path.join(root,f.path))),f.sha256);assert.equal(fs.statSync(path.join(root,f.path)).size,f.bytes);}
 assert.equal(sha256(fs.readFileSync(path.join(root,'MANIFEST.json'))),seal.manifest_sha256);
 assert.equal(sha256(fs.readFileSync(path.join(root,'SHA256SUMS'))),seal.sha256sums_sha256);
 console.log(JSON.stringify({seal:'VERIFIED',files:files.length,acceptance:seal.SHORT_COMPILER_ACCEPTANCE}));
}else if(process.argv[2]==='seal'){
 const s=execute('research/7plus1-parser/semantic-acceptance-032/recovery.mjs',['state']);
 assert.equal(s.next.allowed,false,'DO_NOT_SEAL_WHILE_EVALUATION_CAN_CONTINUE');
 assert.notEqual(s.next.reason,'SOURCE_REVIEW_REQUIRED_BEFORE_NEXT_RUN');assert.equal(s.new_unfinished_reserve,0);
 const registry=read(path.join(old,'SOURCE-EXPECTATIONS.json'));
 const corrections=fs.existsSync(path.join(root,'SOURCE-REVIEW-CORRECTIONS.json'))?read(path.join(root,'SOURCE-REVIEW-CORRECTIONS.json')).corrections:[];
 const rows=s.order.map(id=>{
  const sourceId=id.replace(/-R\d+$/,''),source=registry.cases.find(c=>c.id===sourceId);
  assert.equal(sha256(fs.readFileSync(path.join(old,'inputs',sourceId+'.txt'))),source.sha256);
  const execution=s.executions.find(e=>e.id===id),attempt=execution?.attempt??(id==='Q01'?2:1);
  const base=['Q05','D01','D02','D03','D04','D05','D06','D07','D08','S00'].includes(id)?prior:root;
  const d=path.join(base,'runs/domain-c3',id,'attempt-'+String(attempt).padStart(2,'0'));
  const reviewPath=path.join(d,'source-review.json'),review=fs.existsSync(reviewPath)?read(reviewPath):null;
  assert.ok(!execution||execution.exit_code!==0||review,'COMPLETED_OUTPUT_MUST_BE_REVIEWED');
  const rel=p=>path.relative(root,p).replaceAll('\\','/');
  const trace=review?read(path.join(d,'run/trace.json')):null;
  const revisions=trace?fs.readdirSync(path.join(d,'run')).filter(n=>/^revision-\d+$/.test(n)).map(n=>{
   const p=path.join(d,'run',n,'technical-validation.json');if(!fs.existsSync(p))return {revision:n,technical_result:'NOT_COMPLETED'};
   const t=read(p);return {revision:n,schemas:t.schemas,rejected_ids:t.rows.filter(r=>r.status==='REJECTED').map(r=>r.id),unresolved_ids:t.rows.filter(r=>r.status==='UNRESOLVED').map(r=>r.id)};
  }):[];
  const correction=corrections.find(c=>c.id===id);if(correction)assert.equal(review.status,correction.original_status);
  return {id,source_id:sourceId,source:source.text,source_sha256:source.sha256,status:correction?.status??review?.status??(execution?'RUN_FAILED':'NOT_RUN'),original_review_status:review?.status??null,review_correction:correction??null,attempt,revision:trace?.revision??null,revision_results:revisions,
   slot_status:trace?Object.fromEntries(Object.entries(trace.canonical.slots).map(([slot,v])=>[slot,v.status])):null,
   audit_issues:trace?.audit.issues??null,audit_omissions:trace?.audit.omissions??null,
   execution_path:execution?rel(path.join(d,'execution.json')):null,source_review_path:review?rel(reviewPath):null,
   trace_path:review?rel(path.join(d,'run/trace.json')):null,canonical_path:review?rel(path.join(d,'run/7plus1.json')):null,
   chinese_path:review?rel(path.join(d,'run/7plus1.zh.md')):null,review_reason:review?.source_and_extra_output_checks??null,
   failure:execution?.underlying_failure??null,model_support_is_not_score:true};
 });
 const counts=Object.fromEntries(['SOURCE_FAITHFUL','CLARIFICATION_CORRECT','SEMANTIC_FAIL','CONTRACT_FAIL','EVALUATION_REVIEW_REQUIRED','RUN_FAILED','NOT_RUN'].map(k=>[k,rows.filter(r=>r.status===k).length]));
 const allComplete=s.reviews.length===79;
 const semanticPass=allComplete&&rows.every(r=>['SOURCE_FAITHFUL','CLARIFICATION_CORRECT'].includes(r.status));
 const repeated=fs.existsSync(path.join(root,'REPEAT-COMPARISON.json'))?read(path.join(root,'REPEAT-COMPARISON.json')):null;
 assert.ok(!allComplete||repeated,'FULL_SUITE_REQUIRES_ACTUAL_REPEAT_REVIEW');
 const acceptance=semanticPass&&repeated?.all_faithful_and_stable?'PASS_PREDEPLOYMENT':!allComplete&&s.next.reason==='CODEX_NETWORK_FAILURE'?'PARTIAL_TRANSPORT_AND_SEMANTIC_BLOCKED':'PARTIAL_'+(allComplete?'SEMANTIC_FAILURE':s.next.reason);
 const artifact=execute('research/7plus1-parser/semantic-acceptance-032/continuation-artifacts.mjs',['--resume-032']);
 write('ARTIFACT-CONSISTENCY.json',artifact);
 const preservation=execute('.boundx/experiments/032/protect.mjs',['verify']);assert.deepEqual(preservation.tracked_changes,[]);assert.deepEqual(preservation.untracked_changes,[]);
 const installed=execute('research/7plus1-parser/semantic-acceptance-032/snapshot.mjs',['verify']);assert.deepEqual(installed.changed,[]);
 const seals=[execute('research/7plus1-parser/semantic-acceptance-032/seal-report.mjs',['verify']),execute('research/7plus1-parser/semantic-acceptance-032/close-continuation.mjs',['verify'])];
 write('PRESERVATION-CHECK.json',{preservation,installed,prior_seals:seals});
 write('CALL-BUDGET.json',{...s,actual_backend_billing_unknown:true,original_Q01_failure_preserved:true});
 write('CALL-RECEIPTS.json',{carried_charge:135,old_charge_unchanged:108,prior_continuation_charge:27,prior_ledger:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION/CALL-BUDGET.json',new_ledger:requestLedger(path.join(root,'runs')),actual_backend_billing_unknown:true});
 write('PER-RUN-RESULTS.json',{version:read(path.join(root,'FROZEN-RESOURCES.json')),registered:79,counts,rows});
 write('DEFECTS.json',{rows:rows.filter(r=>!['SOURCE_FAITHFUL','CLARIFICATION_CORRECT','NOT_RUN'].includes(r.status)),first_transport_failure:{path:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION/runs/domain-c3/Q01/attempt-01',...s.prior_transport_failures_preserved[0]},not_repaired_in_frozen_evaluation:true});
 const groups={fixed:rows.filter(r=>/^(?:Q\d\d|S\d\d|T\d\d)$/.test(r.id)),extra_repeats:rows.filter(r=>/-R\d$/.test(r.id)),N:rows.filter(r=>/^N/.test(r.id)),D:rows.filter(r=>/^D/.test(r.id))};
 write('GROUP-RESULTS.json',Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,{registered:v.length,counts:Object.fromEntries(Object.keys(counts).map(status=>[status,v.filter(r=>r.status===status).length]))}])));
 const faithful=r=>['SOURCE_FAITHFUL','CLARIFICATION_CORRECT'].includes(r.status);
 write('GATES.json',{G1:'UNCHANGED_FROZEN_CONTRACT_AND_PREDECLARED_EXPECTATIONS',G2:counts.CONTRACT_FAIL?'NOT_PASS_OBSERVED_CONSUMER_CONTRACT_DEFECTS':'REUSED_SEALED_SAME_VERSION_ENGINEERING',G3:groups.fixed.length===53&&groups.fixed.every(faithful)?'PASS':'NOT_PASS',G4:repeated?.all_faithful_and_stable&&groups.N.every(faithful)&&groups.D.every(faithful)?'PASS':'NOT_PASS',G5:counts.CONTRACT_FAIL?'NOT_PASS_OPEN_CONTRACT_OR_RENDERING_DEFECTS':'SOURCE_CHECKS_RECORDED',G6:'REUSED_SEALED_SAME_VERSION_6700_PASS_0_FAIL_17_SKIP_NOT_RERUN_THIS_CONTINUATION',G7:'NOT_PERFORMED_PREDEPLOYMENT_GATES_NOT_PASSED',SHORT_COMPILER_ACCEPTANCE:acceptance,counts,complete_compilations:s.complete_compilations,original_first_transport_failure_not_overwritten:true,PUBLIC_RELEASE:false,WAITING_ADMIN_REVIEW:true});
 const current=read('.boundx/short-compiler-031-r1/current.json');
 const port=execFileSync('powershell.exe',['-NoProfile','-Command',"$c = @(Get-NetTCPConnection -LocalPort 58618 -State Listen -ErrorAction SilentlyContinue); ConvertTo-Json -InputObject $c -Compress"],{encoding:'utf8'}).trim();
 write('DEPLOYMENT-STATE.json',{at:new Date().toISOString(),installed_version:current.version,previous_version:current.previous,port_58618:JSON.parse(port||'[]'),upgrade_performed:false,post_deployment_D08:'NOT_RUN',reason:'Predeployment quality gates do not pass; frozen evaluation did not alter installation',candidate_package:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/delivery/BoundaryXP-short-compiler-0.1.0-candidate.032.3.zip',candidate_package_sha256:'1e65b9598d85788e0e9cc96cd07db3a9a09c17a207e009e3fb701d4ab05e5dd3',repackaged:false});
 fs.writeFileSync(path.join(root,'PER-RUN-RESULTS.md'),['# 同版79个验收位置','', '| ID | 状态 | 原始完整Trace |','|---|---|---|',...rows.map(r=>`| ${r.id} | ${r.status} | ${r.trace_path?'[Trace]('+r.trace_path+')':'—'} |`),'','首次传输失败与Q01补测分别保留；SOURCE_FAITHFUL与正确澄清分别统计。',''].join('\n'),{flag:'wx'});
 assert.ok(fs.existsSync(path.join(root,'REPORT.md')),'WRITE_SOURCE_REVIEW_REPORT_BEFORE_SEAL');
 const files=walk(root).filter(p=>!self.has(path.relative(root,p).replaceAll('\\','/'))).map(p=>({path:path.relative(root,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:sha256(fs.readFileSync(p))})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 for(const f of files)assert.equal(/(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(fs.readFileSync(path.join(root,f.path),'utf8')),false,'POSSIBLE_CREDENTIAL:'+f.path);
 write('MANIFEST.json',{schema:'boundx-report-manifest/v1',task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',continuation:'R02',files,excluded_self_references:[...self],raw_first_runs_preserved:true});
 const manifestSHA=sha256(fs.readFileSync(path.join(root,'MANIFEST.json'))),sums=files.map(f=>f.sha256+'  '+f.path).concat(manifestSHA+'  MANIFEST.json').join('\n')+'\n';
 fs.writeFileSync(path.join(root,'SHA256SUMS'),sums,{flag:'wx'});
 write('SEAL.json',{schema:'boundx-evidence-seal/v1',at:new Date().toISOString(),task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',continuation:'R02',report_parent_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),manifest_sha256:manifestSHA,sha256sums_sha256:sha256(Buffer.from(sums)),files:files.length,SHORT_COMPILER_ACCEPTANCE:acceptance,counts,budget_charged:s.charged,budget_limit:360,state:'WAITING_ADMIN_REVIEW',evidence_sealed_does_not_mean_product_pass:true});
 console.log(JSON.stringify({sealed:true,acceptance,counts,budget:s.charged,files:files.length}));
}else throw Error('USE_SEAL_OR_VERIFY');
