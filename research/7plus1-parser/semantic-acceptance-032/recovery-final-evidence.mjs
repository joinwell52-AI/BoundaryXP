// Evaluation-only closure. No model requests, product edits, deployment or retries.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';
import {walk} from './transport-ledger.mjs';
const root=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION-R02');
const prior=root.replace(/-R02$/,'');
const old=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG');
const product=path.resolve('.boundx/experiments/032/packages/domain-c3');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(name,value)=>fs.writeFileSync(path.join(root,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const state=JSON.parse(execFileSync(process.execPath,['research/7plus1-parser/semantic-acceptance-032/recovery.mjs','state'],{encoding:'utf8',maxBuffer:20000000}));
assert.equal(state.next.allowed,false);assert.equal(state.next.reason,'CODEX_NETWORK_FAILURE');
assert.equal(state.new_unfinished_reserve,0);
const corrections=read(path.join(root,'SOURCE-REVIEW-CORRECTIONS.json')).corrections;
const adjusted=state.reviews.map(r=>({...r,status:corrections.find(c=>c.id===r.id)?.status??r.status}));
const counts=Object.fromEntries(['SOURCE_FAITHFUL','CLARIFICATION_CORRECT','SEMANTIC_FAIL','CONTRACT_FAIL','EVALUATION_REVIEW_REQUIRED'].map(k=>[k,adjusted.filter(r=>r.status===k).length]));
const notStarted=state.order.filter(id=>!state.executions.some(e=>e.id===id));
const failure=state.executions.find(e=>e.id==='S07');
const failureDir=path.join(root,'runs/domain-c3/S07/attempt-01');
const parseReceipt=read(path.join(failureDir,'run/revision-0/parse-call/receipt-0.json'));
const auditReceipt=read(path.join(failureDir,'run/revision-0/audit-call/receipt-0.json'));
const completed=[...walk(path.join(prior,'runs')),...walk(path.join(root,'runs'))].filter(p=>path.basename(p)==='execution.json').map(p=>({directory:path.dirname(p),execution:read(p)})).filter(x=>x.execution.exit_code===0);
const projection=[];const negatives=[];const requestResources=[];
for(const {directory,execution} of completed){
 const t=read(path.join(directory,'run/trace.json'));
 for(const f of t.ir.facts){
  if(f.slots?.includes('O')&&f.event&&(f.event.use!=='CURRENT_TASK'||!['REQUIRED','PERMITTED'].includes(f.event.modality)))projection.push({id:execution.id,fact_id:f.id,kind:f.kind,claim_id:f.claim?.id,event_id:f.event.id,use:f.event.use,modality:f.event.modality,trace:path.relative(root,path.join(directory,'run/trace.json')).replaceAll('\\','/')});
  if(f.kind==='EVENT'&&f.event.polarity==='NEGATIVE')negatives.push({id:execution.id,event_id:f.event.id,predicate:f.event.predicate,layer:f.event.layer,use:f.event.use,polarity:f.event.polarity,trace:path.relative(root,path.join(directory,'run/trace.json')).replaceAll('\\','/')});
 }
}
const frozen=read(path.join(root,'FROZEN-RESOURCES.json'));
const manifestPath=path.join(product,'PRODUCT-MANIFEST.json'),manifest=read(manifestPath);
assert.equal(sha256(fs.readFileSync(manifestPath)),frozen.package_sha256);
for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(product,f.path))),f.sha256);
const environment=read(path.join(old,'ENVIRONMENT.json'));assert.equal(sha256(fs.readFileSync(environment.binary)),frozen.binary_sha256);
for(const p of walk(path.join(root,'runs')).filter(p=>/request-\d+\.json$/.test(p))){
 const r=read(p);const phase=r.resources.some(x=>x.path==='contracts/audit.schema.json')?'audit':'parse';
 assert.equal(r.bundle_sha256,frozen[phase+'_bundle_sha256']);assert.equal(r.binary_sha256,frozen.binary_sha256);
 assert.equal(r.requested_model,frozen.requested_model);assert.equal(r.requested_reasoning,frozen.reasoning);
 assert.equal(r.isolation.new_session,true);
 requestResources.push({path:path.relative(root,p).replaceAll('\\','/'),phase,bundle_sha256:r.bundle_sha256,binary_sha256:r.binary_sha256,requested_model:r.requested_model,actual_model:r.actual_model,new_session:true});
}
const summary={at:new Date().toISOString(),complete:state.complete_compilations,reviewed:adjusted.length,counts,transport_failed:state.executions.filter(e=>e.exit_code!==0).length,not_run:notStarted.length,budget:{limit:360,carried:135,outer_starts:state.new_requests.outer_starts,internal_retry_signals:state.new_requests.observed_internal_retries,new_charge:state.new_requests.conservative_observed,charged:state.charged,remaining:state.remaining,unfinished_reserve:state.new_unfinished_reserve},not_started:notStarted};
if(process.argv.includes('--preview')){console.log(JSON.stringify({summary,nonpositive_O:projection,negative_events:negatives}));process.exit(0);}
write('FINAL-SUMMARY.json',summary);
write('FROZEN-RESOURCE-RECHECK.json',{at:new Date().toISOString(),package_manifest_sha256:frozen.package_sha256,verified_product_files:manifest.files.length,binary_sha256:frozen.binary_sha256,requests:requestResources,semantic_resources_changed:false,repackaged:false,model_calls_for_this_check:0});
write('TRANSPORT-STOP.json',{id:'S07',stage:'INDEPENDENT_AUDIT_WORKSPACE_ROUTING_BEFORE_SEMANTIC_RESPONSE',parse_schema_ok:parseReceipt.schema_check?.ok,parse_exit_code:parseReceipt.exit_code,audit_exit_code:auditReceipt.exit_code,audit_output:auditReceipt.schema_check,audit_elapsed_ms:auditReceipt.elapsed_ms,audit_cancelled:auditReceipt.cancelled,owned_tree_only:auditReceipt.kill_receipt,internal_retry_signals:auditReceipt.observed_internal_retries,per_run_conservative_allocation:6,total_charged:state.charged,total_remaining:state.remaining,not_total_budget_exhaustion:true,no_account_quota_policy_rejection_proven:true,failed_attempt_preserved:true,subsequent_requests_started:false,no_public_http_proxy_for_model_test:true,no_account_proxy_tls_model_or_billing_changes:true,remaining_work:{failed_position:'S07',unstarted_positions:notStarted,complete_compilations_needed:1+notStarted.length,minimum_normal_parse_audit_requests:2*(1+notStarted.length),post_deployment_D08_requests:2,extra_revision_and_retry_costs_unknown:true},connection_condition:'正常认证Codex独立审阅会话的workspace routing discovery需恢复；本轮遵守再次传输停止规则，未追加探测或补测。'});
write('PROJECTION-CONTRACT-REVIEW.json',{purpose:'只读字段/实际投影核对，不作为自动语义评分或修复',nonpositive_O_facts:projection,negative_events_requiring_chinese_fidelity_check:negatives,contract_anchor:'frozen contracts/semantic-contract.md:9,63',consumer_anchors:['frozen compile.mjs:53-57 (SCOPE to O lacks positive-event gate)','frozen compile.mjs:92,118 (eventText/retained-event text omit event.polarity)','frozen validate.mjs:158-167 (range coverage rejects unresolved identity)','frozen validate.mjs:66-67 (revised DOMAIN_CHOICE targets exclude referent identity)'],manual_review_corrections:'SOURCE-REVIEW-CORRECTIONS.json',automatic_findings_are_not_gold:true,runtime_modified:false});
const repeatIds=['Q07','Q20','Q25','Q29','Q30'];
write('REPEAT-COMPARISON.json',{status:'NOT_COMPLETED_TRANSPORT_STOP',required_observations:15,completed_observations:5,extra_runs_started:0,all_faithful_and_stable:false,stability_claim:'NOT_EVALUATED',rows:repeatIds.map(id=>({source_id:id,first_status:adjusted.find(r=>r.id===id)?.status??'NOT_RUN',observations:[id,id+'-R1',id+'-R2'].map(position=>({position,status:adjusted.find(r=>r.id===position)?.status??'NOT_RUN'})),comparison:'NOT_PERFORMED_MISSING_TWO_REPEAT_OUTPUTS'})),no_best_of_selection:true});
const files=['transport-ledger.test.mjs','continuation-policy.test.mjs','recovery-policy.test.mjs'].map(f=>'research/7plus1-parser/semantic-acceptance-032/'+f);
const tests=spawnSync(process.execPath,['--test',...files],{encoding:'utf8',windowsHide:true});assert.equal(tests.status,0,tests.stdout+tests.stderr);
fs.writeFileSync(path.join(root,'EVALUATION-HELPER-TESTS.log'),tests.stdout+tests.stderr,{flag:'wx'});
const pass=Number(tests.stdout.match(/\bpass (\d+)/)?.[1]),fail=Number(tests.stdout.match(/\bfail (\d+)/)?.[1]);assert.ok(Number.isInteger(pass)&&Number.isInteger(fail));
write('TESTS.json',{evaluation_helper_tests:{pass,fail,exit_code:tests.status,model_calls:0,files,evidence:'EVALUATION-HELPER-TESTS.log'},frozen_product_engineering:{reuse:true,rerun_this_continuation:false,core:read(path.join(old,'engineering/domain-v2-core/RESULTS.json')),installed_entry:read(path.join(old,'engineering/domain-v2-installed/RESULTS.json')),full:read(path.join(old,'engineering/domain-v2-full/RESULTS.json')),evidence:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/engineering/',semantic_correctness_not_proven_by_engineering_pass:true},actual_model_evaluation:summary,repeat_tests:'NOT_COMPLETED',post_deployment_D08:'NOT_RUN'});
write('PERFORMANCE.json',{executions:state.executions.map(e=>({id:e.id,attempt:e.attempt,elapsed_ms:e.elapsed_ms,completed:e.exit_code===0,failure:e.underlying_failure})),new_total_wall_ms:state.executions.filter(e=>e.id!=='Q05'&&!/^D/.test(e.id)&&e.id!=='S00').reduce((sum,e)=>sum+e.elapsed_ms,0),parallel_model_runs:false,token_billing_not_claimed:true,actual_backend_billed_requests:'UNKNOWN'});
console.log(JSON.stringify({summary,helper_tests:{pass,fail},nonpositive_O:projection.length,verified_requests:requestResources.length}));
