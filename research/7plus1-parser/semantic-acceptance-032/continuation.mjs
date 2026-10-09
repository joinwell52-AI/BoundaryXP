// Continuation of the same 032 evaluation. Only the frozen installed CLI parses text.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';import {pathToFileURL} from 'node:url';
import {sha256} from '../llm-first-028/source.mjs';import {requestLedger,classifyRunFailure,walk} from './transport-ledger.mjs';
import {launchDecision,faithfulStatuses} from './continuation-policy.mjs';
export const oldReport=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG');
export const continuationReport=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION');
const productRoot=path.resolve('.boundx/experiments/032/packages/domain-c3');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n',{flag:'wx'});};
const critical=['Q05','D01','D02','D03','D04','D05','D06','D07','D08','S00'];
const registry=read(path.join(oldReport,'SOURCE-EXPECTATIONS.json'));
const order=[...critical,...registry.final_runs.filter(id=>!critical.includes(id))];assert.equal(order.length,79);
const manifestPath=path.join(productRoot,'PRODUCT-MANIFEST.json'),manifestBytes=fs.readFileSync(manifestPath),manifest=JSON.parse(manifestBytes);
const freeze=read(path.join(oldReport,'DOMAIN-V2-CANDIDATE-FROZEN.json')),environment=read(path.join(oldReport,'ENVIRONMENT.json'));
const bundles=await import(pathToFileURL(path.join(productRoot,'research/7plus1-parser/llm-first-028/bundle.mjs')));
function verifyFrozen(){
 assert.equal(sha256(fs.readFileSync(manifestPath)),freeze.package_manifest_sha256);
 assert.equal(manifest.version,'0.1.0-candidate.032.3');
 for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(productRoot,f.path))),f.sha256,'FROZEN_RESOURCE_CHANGED:'+f.path);
 assert.equal(sha256(fs.readFileSync(environment.binary)),environment.binary_sha256,'CODEX_BINARY_CHANGED');
 for(const phase of ['parse','audit'])assert.equal(bundles.buildBundle(phase).sha256,freeze[phase+'_bundle_sha256']);
 return {product_version:manifest.version,compiler:manifest.compiler_revision,contract:manifest.contract,package_sha256:sha256(manifestBytes),parse_bundle_sha256:freeze.parse_bundle_sha256,audit_bundle_sha256:freeze.audit_bundle_sha256,binary_sha256:environment.binary_sha256,requested_model:'gpt-6.1-sol',reasoning:'medium',actual_model:null};
}
export function continuationState(){
 const dir=path.join(continuationReport,'runs/domain-c3');
 const executions=walk(dir).filter(p=>path.basename(p)==='execution.json').map(read).sort((a,b)=>a.started_at.localeCompare(b.started_at));
 const reviews=walk(dir).filter(p=>path.basename(p)==='source-review.json').map(read);
 const launches=walk(dir).filter(p=>path.basename(p)==='launch.json').map(p=>({...read(p),directory:path.dirname(p)}));
 const requests=requestLedger(dir);let held=0;
 for(const l of launches){const finished=fs.existsSync(path.join(l.directory,'execution.json'));const ledger=requestLedger(l.directory);if(!finished||ledger.incomplete_receipts>0)held+=Math.max(0,l.max_conservative_requests-ledger.conservative_observed);}
 const charged=108+requests.conservative_observed+held;
 const complete=executions.filter(x=>x.exit_code===0).length;
 return {at:new Date().toISOString(),limit:360,historical_charge_unchanged:108,historical_outer_starts:57,historical_internal_retry_signals:31,historical_unfinished_reserve:20,new_requests:requests,new_unfinished_reserve:held,charged,remaining:360-charged,complete_compilations:complete,reviews,executions,registered:79,order,actual_backend_billing_claimed:false,next:launchDecision({order,executions,reviews,charged})};
}
function verifyRequests(directory){
 const results=[];
 for(const p of walk(directory).filter(p=>/request-\d+\.json$/.test(p))){
  const r=read(p),phase=r.resources.some(x=>x.path==='contracts/audit.schema.json')?'audit':'parse',b=bundles.buildBundle(phase);
  assert.equal(r.bundle_sha256,b.sha256);assert.deepEqual(r.resources,b.resources.map(({text,...x})=>x));
  assert.equal(r.binary_sha256,environment.binary_sha256);assert.equal(r.requested_model,'gpt-6.1-sol');assert.equal(r.requested_reasoning,'medium');
  assert.equal(r.isolation.new_session,true);assert.equal(r.skill_mode,'INLINE_BUNDLE');
  results.push({phase,path:path.relative(directory,p).replaceAll('\\','/'),bundle_sha256:r.bundle_sha256,new_session:r.isolation.new_session,requested_model:r.requested_model,actual_model:r.actual_model});
 }
 return results;
}
const [command,...args]=process.argv.slice(2);
if(command==='init'){
 assert.equal(fs.existsSync(continuationReport),false,'CONTINUATION_ALREADY_EXISTS');
 const original=read(path.join(oldReport,'CALL-BUDGET-FINAL-R02.json'));assert.equal(original.conservative_charged_including_reserve,108);
 const resources=verifyFrozen();
 const authorization={at:new Date().toISOString(),task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',base_commit:'b8a5db364858f85ac3af2d3cf4e050d14ee02406',user_authorized_limit:360,added:120,old_charge:108,old_charge_sha256:sha256(fs.readFileSync(path.join(oldReport,'CALL-BUDGET-FINAL-R02.json'))),old_seal_sha256:sha256(fs.readFileSync(path.join(oldReport,'SEAL.json'))),addendum_sha256:sha256(fs.readFileSync('docs/tasks/7plus1/ADDENDUM-032-CONTINUATION-360.md')),pointer_sha256:sha256(fs.readFileSync('docs/tasks/7plus1/CURRENT-TASK.md')),source_registry_sha256:sha256(fs.readFileSync(path.join(oldReport,'SOURCE-EXPECTATIONS.json'))),critical,order,resources,old_model_results_inherited:false,old_reports_unchanged:true,prior_budget_031:{used:239,limit:240},prior_budget_031_r1_q05:{used:175,limit:180},models_started:0};
 write(path.join(continuationReport,'AUTHORIZATION.json'),authorization);write(path.join(continuationReport,'FROZEN-RESOURCES.json'),resources);
 console.log(JSON.stringify({initialized:true,resources,budget:360,charged:108,remaining:252,critical}));
}else if(command==='run'){
 assert.ok(fs.existsSync(path.join(continuationReport,'TRANSPORT-GUARD.json')),'NO_MODEL_FAULT_CHECK_REQUIRED');
 assert.equal(read(path.join(continuationReport,'TRANSPORT-GUARD.json')).exit_code,0);
 const state=continuationState();assert.equal(state.next.allowed,true,JSON.stringify(state.next));assert.equal(args[0],state.next.id,'SERIAL_ORDER_REQUIRED');
 const id=args[0],sourceId=id.replace(/-R\d+$/,''),expected=registry.cases.find(x=>x.id===sourceId),input=path.join(oldReport,'inputs',sourceId+'.txt');
 assert.equal(sha256(fs.readFileSync(input)),expected.sha256,'SOURCE_CHANGED');assert.ok([...fs.readFileSync(input,'utf8')].length<=300);
 const resources=verifyFrozen(),directory=path.join(continuationReport,'runs/domain-c3',id,'attempt-01');assert.equal(fs.existsSync(directory),false,'FIRST_RESULT_EXISTS');
 const launch={id,attempt:1,source_id:sourceId,source_sha256:expected.sha256,started_at:new Date().toISOString(),...resources,max_conservative_requests:state.next.allocation,prior_charge:state.charged,reserve_after_next:state.next.reserveAfterNext,source_case_id_not_sent_to_model:true,expected_not_sent_to_model:true};
 write(path.join(directory,'launch.json'),launch);
 const started=Date.now(),child=spawn(process.execPath,[path.join(productRoot,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(directory,'run'),'--request-budget',String(launch.max_conservative_requests)],{cwd:productRoot,windowsHide:true,env:{...process.env,BOUNDX_CODEX_EXE:environment.binary},stdio:['ignore','pipe','pipe']});
 let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
 console.log(JSON.stringify({started:id,pid:child.pid,version:resources.product_version,allocation:launch.max_conservative_requests,prior_charge:state.charged}));
 const exit=await new Promise(resolve=>{child.on('error',e=>resolve({exit_code:null,error:e.message}));child.on('close',code=>resolve({exit_code:code}));});
 fs.writeFileSync(path.join(directory,'stdout.md'),stdout,{flag:'wx'});fs.writeFileSync(path.join(directory,'stderr.txt'),stderr,{flag:'wx'});
 const result={...launch,...exit,elapsed_ms:Date.now()-started,underlying_failure:exit.exit_code===0?null:classifyRunFailure(directory),requests:requestLedger(directory),actual_request_resources:verifyRequests(directory),semantic_status:'NOT_REVIEWED'};
 write(path.join(directory,'execution.json'),result);verifyFrozen();
 console.log(JSON.stringify({completed:id,exit:result.exit_code,failure:result.underlying_failure,elapsed_ms:result.elapsed_ms,requests:result.requests.conservative_observed,budget:continuationState().charged,source_review_required:true}));
}else if(command==='view'){
 const id=args[0],file=path.join(continuationReport,'runs/domain-c3',id,'attempt-01/run/trace.json');
 const t=read(file);const compact=x=>Array.isArray(x)?x.map(compact):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).filter(([k])=>!['proof','source_sha256','provenance_refs','audit_refs','checks','context_references_are_not_required_dependencies'].includes(k)).map(([k,v])=>[k,k==='sources'?v.map(s=>({quote:s.quote,span:s.span})):compact(v)])):x;
 console.log(JSON.stringify({id,source:t.source.text,revision:t.revision,candidate:compact(t.proposal),audit_issues:compact(t.audit.issues),audit_omissions:compact(t.audit.omissions),audit_non_support:t.audit.reviews.filter(r=>r.verdict!=='SUPPORT'),technical:{schemas:t.technical.schemas,nonaccepted_rows:t.technical.rows.filter(r=>r.status!=='ACCEPTED').map(r=>({id:r.id,status:r.status,errors:r.errors,uncertain:r.uncertain})),coverage:t.technical.coverage},ir:t.ir.facts.map(f=>({id:f.id,status:f.status,kind:f.kind,claim:f.claim?.id,event:f.event?.id,slots:f.slots})),slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([s,v])=>[s,{status:v.status,openness:v.openness,ids:v.entries.map(e=>e.id)}])),unresolved:t.canonical.unresolved.map(f=>({id:f.id,kind:f.kind,status:f.status,claim_ids:f.claim_ids})),clarifications:compact(t.canonical.clarifications),gaps:compact(t.canonical.gaps),chinese:t.chinese}));
}else if(command==='review'){
 const [id,status,note]=args;assert.ok(faithfulStatuses.has(status)||['SEMANTIC_FAIL','CONTRACT_FAIL','EVALUATION_REVIEW_REQUIRED'].includes(status));assert.ok(note);
 const directory=path.join(continuationReport,'runs/domain-c3',id,'attempt-01'),traceFile=path.join(directory,'run/trace.json'),t=read(traceFile);
 assert.equal(read(path.join(directory,'execution.json')).exit_code,0);
 const artifacts=path.join(directory,'run');assert.deepEqual(read(path.join(artifacts,'7plus1.json')),t.canonical,'JSON_TRACE_CONSISTENCY');assert.equal(fs.readFileSync(path.join(artifacts,'7plus1.zh.md'),'utf8'),t.chinese,'CHINESE_TRACE_CONSISTENCY');
 assert.equal(sha256(fs.readFileSync(path.join(artifacts,'source.txt'))),t.source.sha256,'SOURCE_TRACE_CONSISTENCY');
 const codepoints=[...t.source.text];let checkedSpans=0;
 const checkSpans=x=>{if(Array.isArray(x)){for(const v of x)checkSpans(v);return;}if(x&&typeof x==='object'){if(Array.isArray(x.span)&&typeof x.quote==='string'){assert.equal(codepoints.slice(...x.span).join(''),x.quote,'EXACT_SOURCE_SPAN');checkedSpans++;}for(const v of Object.values(x))checkSpans(v);}};checkSpans(t.canonical);
 const finalDirectory=path.join(artifacts,'revision-'+t.revision),threads=['parse-call','audit-call'].map(phase=>walk(path.join(finalDirectory,phase)).filter(p=>/receipt-\d+\.json$/.test(p)).map(read).filter(r=>r.exit_code===0&&r.schema_check?.ok).at(-1)?.thread_id);assert.ok(threads.every(Boolean)&&threads[0]!==threads[1],'INDEPENDENT_ACTUAL_SESSIONS');
 const decision={id,attempt:1,status,at:new Date().toISOString(),reviewer:'EXECUTING_CODEX_SOURCE_REVIEW_NOT_ADMIN_GOLD',source_sha256:t.source.sha256,trace_sha256:sha256(fs.readFileSync(traceFile)),revision:t.revision,reviewed_layers:['source','candidate','independent audit','technical validation','Boundary IR','canonical JSON','Chinese','extra output'],source_and_extra_output_checks:note,technical_artifact_checks:{json_matches_trace:true,chinese_matches_trace:true,source_matches_trace:true,exact_spans_checked:checkedSpans,actual_parse_audit_thread_ids:threads,independent_sessions:true},model_support_is_not_score:true};
 write(path.join(directory,'source-review.json'),decision);console.log(JSON.stringify({id,status,next:continuationState().next,budget:continuationState().charged}));
}else if(command==='state'){
 const s=continuationState();console.log(JSON.stringify({...s,new_requests:{...s.new_requests,records:undefined},reviews:s.reviews.map(({source_and_extra_output_checks,...r})=>r),executions:s.executions.map(x=>({id:x.id,exit_code:x.exit_code,underlying_failure:x.underlying_failure,elapsed_ms:x.elapsed_ms}))}));
}else if(command)throw Error('UNKNOWN_CONTINUATION_COMMAND');
