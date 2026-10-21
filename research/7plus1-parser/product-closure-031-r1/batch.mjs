// Evaluation transport only; separate immutable case folders, no expected facts in requests.
import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {sha256} from '../llm-first-028/source.mjs';import {report} from './prepare.mjs';
const packageRoot=path.resolve(process.env.BOUNDARYXP_R1_PACKAGE??'.boundx/experiments/031-r1/packages/final-c2'),environment=JSON.parse(fs.readFileSync(path.join(report,'ENVIRONMENT.json'))),manifest=JSON.parse(fs.readFileSync(path.join(packageRoot,'PRODUCT-MANIFEST.json'))),manifestHash=sha256(fs.readFileSync(path.join(packageRoot,'PRODUCT-MANIFEST.json')));
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]):[];
const count=d=>{const f=walk(d),outer=f.filter(p=>/request-\d+\.json$/.test(p)).length,retries=f.filter(p=>/stderr-\d+\.txt$/.test(p)).reduce((n,p)=>n+(fs.readFileSync(p,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length,0);return{outer_starts:outer,observed_internal_retries:retries,conservative_used:outer+retries};};
const counts=()=>count(path.join(report,'runs'));
const verify=()=>{if(sha256(fs.readFileSync(path.join(packageRoot,'PRODUCT-MANIFEST.json')))!==manifestHash)throw Error('MANIFEST_CHANGED');for(const f of manifest.files)if(sha256(fs.readFileSync(path.join(packageRoot,f.path)))!==f.sha256)throw Error('FROZEN_PACKAGE_CHANGED:'+f.path);};
const selected=process.argv.slice(2);const defaultIDs=[...Array.from({length:30},(_,i)=>'Q'+String(i+1).padStart(2,'0')),...Array.from({length:13},(_,i)=>'S'+String(i).padStart(2,'0')),...Array.from({length:10},(_,i)=>'T'+String(i+1).padStart(2,'0')),...['Q15','Q19','Q25','Q29','Q30'].flatMap(id=>[id+'-R1',id+'-R2']),...Array.from({length:7},(_,i)=>'N'+String(i+2).padStart(2,'0'))];
const pending=(selected.length?selected:defaultIDs).map(id=>({id,group:id.startsWith('N')?'new':id.includes('-R')?'repeat':'final'})),active=new Map(),done=[];let stopped=null,networkFailures=0;
const reserve=Number(process.env.BOUNDARYXP_R1_RESERVE??6),concurrency=3;
async function launch(job,allocation){
 const {id,group}=job,dir=path.join(report,'runs',group,id);if(fs.existsSync(dir))throw Error('FIRST_RESULT_ALREADY_EXISTS:'+dir);fs.mkdirSync(dir,{recursive:true});
 const input=path.join(report,'inputs',id.replace(/-R\d+$/,'')+'.txt'),launch={id,group,at:new Date().toISOString(),package_sha256:manifestHash,source_sha256:sha256(fs.readFileSync(input)),max_outer_attempts:allocation,other_validation_reserve:reserve};fs.writeFileSync(path.join(dir,'launch.json'),JSON.stringify(launch,null,2)+'\n',{flag:'wx'});console.log('START '+group+'/'+id+' '+JSON.stringify(counts()));
 const start=Date.now(),child=spawn(process.execPath,[path.join(packageRoot,'product/short-compiler/cli.mjs'),'--input',input,'--output',path.join(dir,'run'),'--request-budget',String(allocation)],{cwd:packageRoot,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,BOUNDARYXP_CODEX_EXE:environment.binary}});let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
 const exit=await new Promise(r=>{child.on('error',e=>r({exit_code:null,error:e.message}));child.on('close',code=>r({exit_code:code}));});fs.writeFileSync(path.join(dir,'cli-stdout.md'),stdout,{flag:'wx'});fs.writeFileSync(path.join(dir,'cli-stderr.txt'),stderr,{flag:'wx'});
 const result={...launch,...exit,elapsed_ms:Date.now()-start,execution_status:exit.exit_code===0?'RUN_SUCCEEDED':'RUN_FAILED',semantic_status:'NOT_REVIEWED',counts_after:counts()};fs.writeFileSync(path.join(dir,'execution.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});done.push(result);console.log('END '+id+' '+JSON.stringify(result));
 if(/CODEX_QUOTA_OR_RATE_LIMIT|CODEX_LOGIN_REQUIRED|CODEX_MODEL_UNAVAILABLE|CODEX_ENV_UNAVAILABLE|blocked by policy/i.test(stderr))stopped='EXTERNAL_BLOCKER';
 if(exit.exit_code!==0&&/CODEX_NETWORK_FAILURE|CODEX_TRANSPORT_OR_SCHEMA_FAILURE|CODEX_TIMEOUT/.test(stderr))networkFailures++;else networkFailures=0;if(networkFailures>=3)stopped='THREE_CONSECUTIVE_TRANSPORT_FAILURES';verify();
}
while(pending.length||active.size){
 while(!stopped&&pending.length&&active.size<concurrency){verify();const c=counts(),reservedActive=[...active.values()].reduce((n,a)=>n+Math.max(0,a.allocation-count(a.dir).outer_starts)+2,0),minimumOther=(pending.length-1)*2;
  const available=180-c.conservative_used-reservedActive-reserve-minimumOther,allocation=Math.min(6,available);if(allocation<2){if(!active.size)stopped='INSUFFICIENT_BUDGET_FOR_REMAINING_VALIDATION';break;}
  const job=pending.shift(),key=job.group+'/'+job.id,entry={allocation,dir:path.join(report,'runs',job.group,job.id)};entry.promise=launch(job,allocation).finally(()=>active.delete(key));active.set(key,entry);
 }
 if(active.size)await Promise.race([...active.values()].map(x=>x.promise));else break;
}
fs.writeFileSync(path.join(report,'FINAL-BATCH-TRANSPORT.json'),JSON.stringify({at:new Date().toISOString(),package_sha256:manifestHash,concurrency,results:done,not_run:pending,counts:counts(),stopped,reserved_for_installed_ui:reserve,backend_billing_claimed:false},null,2)+'\n',{flag:'wx'});console.log('BATCH_END '+JSON.stringify({done:done.length,pending:pending.length,counts:counts(),stopped}));
