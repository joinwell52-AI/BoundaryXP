// Evaluation transport only: normal product CLI owns all semantic processing.
import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {sha256} from '../llm-first-028/source.mjs';
const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG'),args=process.argv.slice(2),group=args[0]??'first';
const manifest=JSON.parse(fs.readFileSync(path.join(report,process.env.BOUNDARYXP_EVAL_FREEZE??(group.startsWith('pilot')?'DEVELOPMENT-INVENTORY.json':'CANDIDATE-FROZEN.json')))),read=p=>JSON.parse(fs.readFileSync(p));
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]):[];
const requests=()=>walk(path.join(report,'runs')).filter(p=>/request-\d+\.json$/.test(p)).length;
// CLI may retry its own network sampling without emitting another wrapper request file.
// Count observed retry signals conservatively; do not assert that all reached a model server.
const internalRetries=()=>walk(path.join(report,'runs')).filter(p=>/stderr-\d+\.txt$/.test(p)).reduce((n,p)=>n+(fs.readFileSync(p,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length,0);
const budgetUse=()=>requests()+internalRetries();
const verify=()=>{for(const x of manifest.runtime){const p=path.join('research/7plus1-parser/llm-first-028',x.path);if(sha256(fs.readFileSync(p))!==x.sha256)throw Error('FROZEN_RESOURCE_CHANGED:'+p);}};
const selected=args.slice(1).length?args.slice(1):read(path.join(report,'SOURCE-EXPECTATIONS.json')).cases.map(c=>c.id);
let cursor=0,stop=null,reserved=0;
async function run(id){const dir=path.join(report,'runs',group,id);if(fs.existsSync(path.join(dir,'execution.json')))return;verify();
 let allocation;
 while(true){allocation=Math.min(12,240-budgetUse()-reserved);if(allocation>=2)break;if(!reserved){stop='REQUEST_BUDGET';return;}await new Promise(r=>setTimeout(r,100));}
 reserved+=allocation;
 fs.mkdirSync(dir,{recursive:true});if(fs.existsSync(path.join(dir,'run/source.txt')))throw Error('FIRST_RESULT_ALREADY_EXISTS:'+id);
 const started=Date.now(),launch={group,id,started_at:new Date().toISOString(),mode:'LIVE_CODEX',source_sha256:sha256(fs.readFileSync(path.join(report,'inputs',id+'.txt')))};
 fs.writeFileSync(path.join(dir,'launch.json'),JSON.stringify(launch,null,2));console.log('START '+group+'/'+id+' total='+requests());
 const child=spawn(process.execPath,['product/short-compiler/cli.mjs','--input',path.join(report,'inputs',id+'.txt'),'--output',path.join(dir,'run'),'--request-budget',String(allocation)],{windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,BOUNDARYXP_CODEX_EXE:manifest.binary}});let stdout='',stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
 const exit=await new Promise(resolve=>{child.on('error',e=>resolve({exit_code:null,error:e.message}));child.on('close',code=>resolve({exit_code:code}));});
 const result={...launch,...exit,elapsed_ms:Date.now()-started,requests:walk(dir).filter(p=>/request-\d+\.json$/.test(p)).length,status:exit.exit_code===0?'RUN_SUCCEEDED':'RUN_FAILED',semantic_status:'NOT_REVIEWED'};
 fs.writeFileSync(path.join(dir,'cli-stdout.md'),stdout);fs.writeFileSync(path.join(dir,'cli-stderr.txt'),stderr);fs.writeFileSync(path.join(dir,'execution.json'),JSON.stringify(result,null,2));reserved-=allocation;verify();console.log('END '+group+'/'+id+' '+result.status+' requests='+requests());
 if(stderr.includes('MODEL_REQUEST_BUDGET_EXHAUSTED'))stop='REQUEST_BUDGET';
 if(/CODEX_QUOTA_OR_RATE_LIMIT|CODEX_LOGIN_REQUIRED|CODEX_MODEL_UNAVAILABLE|CODEX_ENV_UNAVAILABLE/.test(stderr))stop=stderr.match(/CODEX_[A-Z_]+/)?.[0]??'ENV_BLOCKED';
}
const ticker=setInterval(()=>console.log('PROGRESS '+group+' requests='+requests()+' internal_retry_signals='+internalRetries()+' conservative_budget_use='+budgetUse()+' launched='+cursor+'/'+selected.length+' stop='+stop),30000);
try{await Promise.all(Array.from({length:3},async()=>{while(cursor<selected.length&&!stop){if(fs.existsSync(path.join(report,group+'-STOP-NEW-RUNS.json'))){stop='DEVELOPMENT_REPAIR_REQUIRED';break;}await run(selected[cursor++]);}}));}finally{clearInterval(ticker);}
const results=selected.map(id=>{const p=path.join(report,'runs',group,id,'execution.json');return fs.existsSync(p)?read(p):{group,id,status:'NOT_RUN',reason:stop};});fs.writeFileSync(path.join(report,group+'-RUN-RESULTS.json'),JSON.stringify(results,null,2));console.log('BATCH_END '+JSON.stringify({group,complete:results.filter(x=>x.status==='RUN_SUCCEEDED').length,requests:requests(),internal_retry_signals:internalRetries(),conservative_budget_use:budgetUse(),stop}));
