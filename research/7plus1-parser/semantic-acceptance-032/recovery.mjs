// Same 032 evaluation; this helper only invokes the unchanged frozen product CLI.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';import {pathToFileURL} from 'node:url';
import {sha256} from '../llm-first-028/source.mjs';
import {walk,requestLedger,classifyRunFailure} from './transport-ledger.mjs';
import {faithfulStatuses} from './continuation-policy.mjs';
import {evaluationLaunchDecision as launchDecision} from './recovery-policy.mjs';
export const prior=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION');
export const report=prior+'-R02';
const old=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG');
const product=path.resolve('.boundx/experiments/032/packages/domain-c3');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
const budget=read(path.join(prior,'CALL-BUDGET.json')),auth=read(path.join(report,'AUTHORIZATION.json'));
assert.equal(budget.charged,135);assert.equal(auth.carried_charge,135);assert.equal(auth.limit,360);
const registry=read(path.join(old,'SOURCE-EXPECTATIONS.json'));
const environment=read(path.join(old,'ENVIRONMENT.json'));
const resources=read(path.join(report,'FROZEN-RESOURCES.json'));
const bundle=await import(pathToFileURL(path.join(product,'research/7plus1-parser/llm-first-028/bundle.mjs')));
const manifestPath=path.join(product,'PRODUCT-MANIFEST.json');
const attempt=id=>id==='Q01'?2:1;
const directory=id=>path.join(report,'runs/domain-c3',id,'attempt-'+String(attempt(id)).padStart(2,'0'));
function verifyFrozen(){
 assert.equal(sha256(fs.readFileSync(manifestPath)),resources.package_sha256);
 for(const f of read(manifestPath).files)assert.equal(sha256(fs.readFileSync(path.join(product,f.path))),f.sha256,'RESOURCE_CHANGED:'+f.path);
 assert.equal(sha256(fs.readFileSync(environment.binary)),resources.binary_sha256);
 for(const phase of ['parse','audit'])assert.equal(bundle.buildBundle(phase).sha256,resources[phase+'_bundle_sha256']);
}
function verifyRequests(d){return walk(d).filter(p=>/request-\d+\.json$/.test(p)).map(p=>{
 const r=read(p),phase=r.resources.some(x=>x.path==='contracts/audit.schema.json')?'audit':'parse',b=bundle.buildBundle(phase);
 assert.equal(r.bundle_sha256,b.sha256);assert.deepEqual(r.resources,b.resources.map(({text,...x})=>x));
 assert.equal(r.binary_sha256,resources.binary_sha256);assert.equal(r.requested_model,resources.requested_model);assert.equal(r.requested_reasoning,resources.reasoning);assert.equal(r.isolation.new_session,true);
 return {path:path.relative(d,p).replaceAll('\\','/'),phase,bundle_sha256:r.bundle_sha256,new_session:true,actual_model:r.actual_model};
});}
export function state(){
 const inherited=walk(path.join(prior,'runs')).filter(p=>path.basename(p)==='execution.json').map(read).filter(e=>e.exit_code===0).sort((a,b)=>a.started_at.localeCompare(b.started_at));
 const inheritedReviews=walk(path.join(prior,'runs')).filter(p=>path.basename(p)==='source-review.json').map(read);
 assert.equal(inherited.length,10);assert.equal(inheritedReviews.length,10);
 const fresh=walk(path.join(report,'runs')).filter(p=>path.basename(p)==='execution.json').map(read).sort((a,b)=>a.started_at.localeCompare(b.started_at));
 const reviews=[...inheritedReviews,...walk(path.join(report,'runs')).filter(p=>path.basename(p)==='source-review.json').map(read)];
 const requests=requestLedger(path.join(report,'runs'));let reserve=0;
 for(const p of walk(path.join(report,'runs')).filter(p=>path.basename(p)==='launch.json')){const l=read(p),d=path.dirname(p),r=requestLedger(d);if(!fs.existsSync(path.join(d,'execution.json'))||r.incomplete_receipts)reserve+=Math.max(0,l.max_conservative_requests-r.conservative_observed);}
 const charged=135+requests.conservative_observed+reserve,executions=[...inherited,...fresh];
 return {at:new Date().toISOString(),limit:360,carried_charge:135,old_charge_unchanged:108,prior_continuation_charge:27,prior_transport_failures_preserved:budget.executions.filter(e=>e.exit_code!==0),new_requests:requests,new_unfinished_reserve:reserve,charged,remaining:360-charged,complete_compilations:executions.filter(e=>e.exit_code===0).length,reviews,executions,registered:79,order:budget.order,actual_backend_billing_claimed:false,next:launchDecision({order:budget.order,executions,reviews,charged})};
}
const [command,id,status,note]=process.argv.slice(2);
if(command==='run'){
 const s=state();assert.equal(s.next.allowed,true,JSON.stringify(s.next));assert.equal(s.next.id,id,'SERIAL_ORDER');
 const preflight=read(path.join(report,'PREFLIGHT.json'));assert.equal(preflight.logged_in,true);assert.equal(preflight.account_quota_policy_rejection_in_old_receipt,false);
 const d=directory(id);assert.equal(fs.existsSync(d),false,'ATTEMPT_ALREADY_EXISTS_NO_REPEAT');verifyFrozen();
 const sourceId=id.replace(/-R\d+$/,''),expected=registry.cases.find(x=>x.id===sourceId),input=path.join(old,'inputs',sourceId+'.txt');assert.equal(sha256(fs.readFileSync(input)),expected.sha256);assert.ok([...fs.readFileSync(input,'utf8')].length<=300);
 const launch={id,attempt:attempt(id),source_id:sourceId,source_sha256:expected.sha256,started_at:new Date().toISOString(),...resources,max_conservative_requests:6,prior_charge:s.charged,reserve_after_next:s.next.reserveAfterNext,recovery_probe:id==='Q01',source_case_id_not_sent_to_model:true,expected_not_sent_to_model:true,original_failed_attempt:id==='Q01'?'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION/runs/domain-c3/Q01/attempt-01':null};
 write(path.join(d,'launch.json'),launch);
 const started=Date.now(),child=spawn(process.execPath,[path.join(product,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(d,'run'),'--request-budget','6'],{cwd:product,windowsHide:true,env:{...process.env,BOUNDARYXP_CODEX_EXE:environment.binary},stdio:['ignore','pipe','pipe']});
 let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);console.log(JSON.stringify({started:id,attempt:attempt(id),pid:child.pid,allocation:6,prior_charge:s.charged,version:resources.product_version}));
 const exit=await new Promise(resolve=>{child.on('error',e=>resolve({exit_code:null,error:e.message}));child.on('close',code=>resolve({exit_code:code}));});
 fs.writeFileSync(path.join(d,'stdout.md'),stdout,{flag:'wx'});fs.writeFileSync(path.join(d,'stderr.txt'),stderr,{flag:'wx'});
 const result={...launch,...exit,elapsed_ms:Date.now()-started,underlying_failure:exit.exit_code===0?null:classifyRunFailure(d),requests:requestLedger(d),actual_request_resources:verifyRequests(d),semantic_status:'NOT_REVIEWED'};write(path.join(d,'execution.json'),result);verifyFrozen();
 console.log(JSON.stringify({completed:id,attempt:attempt(id),exit:result.exit_code,failure:result.underlying_failure,elapsed_ms:result.elapsed_ms,requests:result.requests.conservative_observed,budget:state().charged,source_review_required:true}));
}else if(command==='view'){
 const t=read(path.join(directory(id),'run/trace.json'));
 const compact=x=>Array.isArray(x)?x.map(compact):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).filter(([k])=>!['proof','provenance_refs','audit_refs','checks'].includes(k)).map(([k,v])=>[k,k==='sources'?v.map(s=>({quote:s.quote,span:s.span})):compact(v)])):x;
 console.log(JSON.stringify({id,source:t.source.text,revision:t.revision,candidate:compact(t.proposal),audit_issues:t.audit.issues,audit_omissions:t.audit.omissions,audit_non_support:t.audit.reviews.filter(r=>r.verdict!=='SUPPORT'),technical:{schemas:t.technical.schemas,nonaccepted_rows:t.technical.rows.filter(r=>r.status!=='ACCEPTED').map(r=>({id:r.id,status:r.status,errors:r.errors,uncertain:r.uncertain})),coverage:compact(t.technical.coverage)},ir:t.ir.facts.map(f=>({id:f.id,status:f.status,kind:f.kind,claim:f.claim?.id,event:f.event?.id,slots:f.slots})),slots:Object.fromEntries(Object.entries(t.canonical.slots).map(([s,v])=>[s,{status:v.status,openness:v.openness,ids:v.entries.map(e=>e.id)}])),unresolved:t.canonical.unresolved.map(f=>({id:f.id,kind:f.kind,status:f.status,claim_ids:f.claim_ids})),clarifications:compact(t.canonical.clarifications),gaps:compact(t.canonical.gaps),chinese:t.chinese}));
}else if(command==='review'){
 assert.ok(faithfulStatuses.has(status)||['SEMANTIC_FAIL','CONTRACT_FAIL','EVALUATION_REVIEW_REQUIRED'].includes(status));assert.ok(note);
 const d=directory(id),run=path.join(d,'run'),p=path.join(run,'trace.json'),t=read(p);assert.equal(read(path.join(d,'execution.json')).exit_code,0);
 assert.deepEqual(read(path.join(run,'7plus1.json')),t.canonical);assert.equal(fs.readFileSync(path.join(run,'7plus1.zh.md'),'utf8'),t.chinese);assert.equal(sha256(fs.readFileSync(path.join(run,'source.txt'))),t.source.sha256);
 const points=[...t.source.text];let spans=0;const visit=x=>{if(Array.isArray(x)){x.forEach(visit);return;}if(x&&typeof x==='object'){if(Array.isArray(x.span)&&typeof x.quote==='string'){assert.equal(points.slice(...x.span).join(''),x.quote);spans++;}Object.values(x).forEach(visit);}};visit(t);
 const threads=['parse-call','audit-call'].map(phase=>walk(path.join(run,'revision-'+t.revision,phase)).filter(p=>/receipt-\d+\.json$/.test(p)).map(read).filter(r=>r.exit_code===0&&r.schema_check?.ok).at(-1)?.thread_id);assert.ok(threads.every(Boolean)&&threads[0]!==threads[1]);
 write(path.join(d,'source-review.json'),{id,attempt:attempt(id),status,at:new Date().toISOString(),reviewer:'EXECUTING_CODEX_SOURCE_REVIEW_NOT_ADMIN_GOLD',source_sha256:t.source.sha256,trace_sha256:sha256(fs.readFileSync(p)),revision:t.revision,reviewed_layers:['source','candidate','independent audit','technical validation','Boundary IR','canonical JSON','Chinese','extra output'],source_and_extra_output_checks:note,technical_artifact_checks:{json_matches_trace:true,chinese_matches_trace:true,source_matches_trace:true,exact_spans_checked:spans,actual_parse_audit_thread_ids:threads,independent_sessions:true},model_support_is_not_score:true});
 console.log(JSON.stringify({id,status,budget:state().charged,next:state().next}));
}else if(command==='state'){
 const s=state();console.log(JSON.stringify({...s,new_requests:{...s.new_requests,records:undefined},reviews:s.reviews.map(({source_and_extra_output_checks,...r})=>r),executions:s.executions.map(e=>({id:e.id,attempt:e.attempt,exit_code:e.exit_code,underlying_failure:e.underlying_failure,elapsed_ms:e.elapsed_ms}))}));
}else if(command)throw Error('UNKNOWN_RECOVERY_COMMAND');
