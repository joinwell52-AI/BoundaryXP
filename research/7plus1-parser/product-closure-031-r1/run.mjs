// Evaluation-only batch transport. Expected facts never reach the product/Provider.
import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';import {report} from './prepare.mjs';
const args=process.argv.slice(2),group=args[0],ids=args.slice(1),packageRoot=path.resolve(process.env.BOUNDARYXP_R1_PACKAGE??'.boundx/experiments/031-r1/packages/offline-c1b'),environment=JSON.parse(fs.readFileSync(path.join(report,'ENVIRONMENT.json'))),manifest=JSON.parse(fs.readFileSync(path.join(packageRoot,'PRODUCT-MANIFEST.json')));
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]):[];
export function counts(){const files=walk(path.join(report,'runs'));const outer=files.filter(p=>/request-\d+\.json$/.test(p)).length,retries=files.filter(p=>/stderr-\d+\.txt$/.test(p)).reduce((n,p)=>n+(fs.readFileSync(p,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length,0);return{outer_starts:outer,observed_internal_retries:retries,conservative_used:outer+retries};}
const verify=()=>{for(const x of manifest.files)if(sha256(fs.readFileSync(path.join(packageRoot,x.path)))!==x.sha256)throw Error('FROZEN_PACKAGE_CHANGED:'+x.path);};
const reserve=group==='pilot'?142:Number(process.env.BOUNDARYXP_R1_RESERVE??0);let stopped=null,networkFailures=0;
for(const id of ids){
 if(stopped)break;verify();const c=counts(),remaining=180-c.conservative_used-reserve,allocation=Math.min(6,remaining);if(allocation<2){stopped='BUDGET_RESERVED_FOR_FINAL';break;}
 const dir=path.join(report,'runs',group,id);if(fs.existsSync(dir))throw Error('FIRST_RESULT_ALREADY_EXISTS:'+dir);fs.mkdirSync(dir,{recursive:true});
 const launch={id,group,at:new Date().toISOString(),package_sha256:sha256(fs.readFileSync(path.join(packageRoot,'PRODUCT-MANIFEST.json'))),source_sha256:sha256(fs.readFileSync(path.join(report,'inputs',id.replace(/-R\d+$/,'')+'.txt'))),max_outer_attempts:allocation,reserved_for_final:reserve};fs.writeFileSync(path.join(dir,'launch.json'),JSON.stringify(launch,null,2)+'\n',{flag:'wx'});console.log('START '+group+'/'+id+' '+JSON.stringify(c));
 const start=Date.now(),child=spawn(process.execPath,[path.join(packageRoot,'product/short-compiler/cli.mjs'),'--input',path.join(report,'inputs',id.replace(/-R\d+$/,'')+'.txt'),'--output',path.join(dir,'run'),'--request-budget',String(allocation)],{cwd:packageRoot,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,BOUNDARYXP_CODEX_EXE:environment.binary}});let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
 const exit=await new Promise(r=>{child.on('error',e=>r({exit_code:null,error:e.message}));child.on('close',code=>r({exit_code:code}));});
 fs.writeFileSync(path.join(dir,'cli-stdout.md'),stdout,{flag:'wx'});fs.writeFileSync(path.join(dir,'cli-stderr.txt'),stderr,{flag:'wx'});
 const result={...launch,...exit,elapsed_ms:Date.now()-start,execution_status:exit.exit_code===0?'RUN_SUCCEEDED':'RUN_FAILED',semantic_status:'NOT_REVIEWED',counts_after:counts()};fs.writeFileSync(path.join(dir,'execution.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log('END '+id+' '+JSON.stringify(result));
 if(/CODEX_QUOTA_OR_RATE_LIMIT|CODEX_LOGIN_REQUIRED|CODEX_MODEL_UNAVAILABLE|CODEX_ENV_UNAVAILABLE|blocked by policy/i.test(stderr))stopped='EXTERNAL_BLOCKER';
 if(exit.exit_code!==0&&/CODEX_NETWORK_FAILURE|CODEX_TRANSPORT_OR_SCHEMA_FAILURE|CODEX_TIMEOUT/.test(stderr))networkFailures++;else networkFailures=0;if(networkFailures>=3)stopped='THREE_CONSECUTIVE_TRANSPORT_FAILURES';
 if(counts().conservative_used>=180)stopped='REQUEST_BUDGET';verify();
}
const results=ids.map(id=>{const p=path.join(report,'runs',group,id,'execution.json');return fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):{id,status:'NOT_RUN',reason:stopped};});fs.writeFileSync(path.join(report,group+'-RESULTS.json'),JSON.stringify({results,counts:counts(),stopped},null,2)+'\n',{flag:'wx'});console.log('BATCH_END '+JSON.stringify({group,counts:counts(),stopped}));
