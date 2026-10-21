// Resume the registered suite only after the bounded real recheck succeeded.
// Old first failures and cancelled allocations remain charged and immutable.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';
import {report,write} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';import {requestLedger,classifyRunFailure} from './transport-ledger.mjs';
const prior=JSON.parse(fs.readFileSync(path.join(report,'CALL-BUDGET-FINAL.json'))),recheck=JSON.parse(fs.readFileSync(path.join(report,'BOUNDED-RECHECK-RESULT.json')));assert.equal(recheck.exit_code,0);
const root=path.resolve('.boundx/experiments/032/packages/consumer-c2'),manifestFile=path.join(root,'PRODUCT-MANIFEST.json'),manifestBytes=fs.readFileSync(manifestFile),manifest=JSON.parse(manifestBytes),env=JSON.parse(fs.readFileSync(path.join(report,'ENVIRONMENT.json'))),registry=JSON.parse(fs.readFileSync(path.join(report,'SOURCE-EXPECTATIONS.json')));
const completed=new Set(['Q01','Q02','Q03','Q04']),pending=registry.final_runs.filter(id=>!completed.has(id)),batchRoot=path.join(report,'runs/final-c2');assert.equal(pending.length,75);fs.mkdirSync(batchRoot,{recursive:false});
const counts=()=>({original_paused_conservative_charge:prior.conservative_charged_including_reserve,recheck:requestLedger(path.join(report,'runs/connectivity-recheck-c2')),resume:requestLedger(batchRoot),get charged(){return this.original_paused_conservative_charge+this.recheck.conservative_observed+this.resume.conservative_observed;}});
const verify=()=>{assert.equal(sha256(fs.readFileSync(manifestFile)),sha256(manifestBytes));for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(root,f.path))),f.sha256);};
let stopped=null,consecutiveTransport=0;const active=new Map(),results=[];
async function launch(id,allocation){
 const sourceId=id.replace(/-R\d+$/,''),input=path.join(report,'inputs',sourceId+'.txt'),expected=registry.cases.find(c=>c.id===sourceId),directory=path.join(batchRoot,id);assert.equal(sha256(fs.readFileSync(input)),expected.sha256);fs.mkdirSync(directory,{recursive:false});
 const launch={id,source_id:sourceId,at:new Date().toISOString(),source_sha256:expected.sha256,version:manifest.version,package_sha256:sha256(manifestBytes),max_conservative_requests:allocation,expected_not_sent_to_model:true,source_case_id_not_sent_to_model:true,old_first_result_preserved:true};fs.writeFileSync(path.join(directory,'launch.json'),JSON.stringify(launch,null,2)+'\n',{flag:'wx'});
 const started=Date.now(),child=spawn(process.execPath,[path.join(root,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(directory,'run'),'--request-budget',String(allocation)],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,BOUNDX_CODEX_EXE:env.binary}});let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);console.log('START c2/'+id+' allocation='+allocation+' charged='+counts().charged);
 const exit=await new Promise(r=>{child.on('error',e=>r({exit_code:null,error:e.message}));child.on('close',code=>r({exit_code:code}));});fs.writeFileSync(path.join(directory,'stdout.md'),stdout,{flag:'wx'});fs.writeFileSync(path.join(directory,'stderr.txt'),stderr,{flag:'wx'});
 const failure=exit.exit_code===0?null:classifyRunFailure(directory),result={...launch,...exit,elapsed_ms:Date.now()-started,underlying_failure:failure,semantic_status:'NOT_REVIEWED',ledger:requestLedger(directory),total_conservative_charged:counts().charged};fs.writeFileSync(path.join(directory,'execution.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});results.push(result);console.log('END c2/'+id+' '+JSON.stringify({exit:exit.exit_code,failure,charged:result.total_conservative_charged}));
 if(['CODEX_LOGIN_REQUIRED','CODEX_QUOTA_OR_RATE_LIMIT','CODEX_MODEL_UNAVAILABLE','POLICY_BLOCKED'].includes(failure))stopped='EXTERNAL_ACCOUNT_QUOTA_PERMISSION_BLOCKER';
 if(exit.exit_code!==0&&(failure==='CODEX_NETWORK_FAILURE'||/CODEX_TRANSPORT_OR_SCHEMA_FAILURE|CODEX_TIMEOUT/.test(stderr)))consecutiveTransport++;else consecutiveTransport=0;
 if(consecutiveTransport>=3)stopped='THREE_CONSECUTIVE_TRANSPORT_FAILURES';verify();
}
while(pending.length||active.size){
 while(!stopped&&pending.length&&active.size<3){
  verify();const activeReserve=[...active.values()].reduce((n,e)=>n+Math.max(0,e.allocation-requestLedger(e.directory).conservative_observed),0),minimumAfter=(pending.length-1)*2+2,allocation=Math.min(6,240-counts().charged-activeReserve-minimumAfter);
  if(allocation<2){if(!active.size)stopped='INSUFFICIENT_BUDGET_FOR_REQUIRED_REMAINING_WORK';break;}
  const id=pending.shift(),entry={allocation,directory:path.join(batchRoot,id)};entry.promise=launch(id,allocation).finally(()=>active.delete(id));active.set(id,entry);
 }
 if(active.size)await Promise.race([...active.values()].map(e=>e.promise));else break;
}
write('RESUMED-FINAL-BATCH.json',{at:new Date().toISOString(),version:manifest.version,package_sha256:sha256(manifestBytes),results,not_run:pending,counts:counts(),stopped,reserved_post_deploy_requests:2,old_budget_reserve_not_refunded:true,old_first_results_preserved:true,concurrency:3});console.log('RESUMED_FINAL_END '+JSON.stringify({runs:results.length,not_run:pending.length,charged:counts().charged,stopped}));
