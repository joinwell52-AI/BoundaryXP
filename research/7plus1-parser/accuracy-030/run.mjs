// Serial wrapper only. The frozen normal CLI owns parsing, review and compilation.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),report=path.join(root,'docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>createHash('sha256').update(b).digest('hex'),save=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const manifest=read(path.join(report,'RUN-MANIFEST.json'));
const walk=p=>fs.existsSync(p)?fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]):[];
const countRequests=()=>walk(path.join(report,'runs')).filter(p=>/request-\d+\.json$/.test(p)).length;
const verify=()=>{for(const x of [...manifest.resources,...manifest.expectedResources])assert.equal(hash(fs.readFileSync(path.join(root,x.path))),x.sha256,x.path);};
const plan=[...manifest.cases.map(({id})=>({group:'first',id})),...['repeat-1','repeat-2'].flatMap(group=>manifest.repeat_ids.map(id=>({group,id})))];
const results=[];let stop=false;
for(const item of plan){
 const dir=path.join(report,'runs',item.group,item.id),receipt=path.join(dir,'execution.json');
 if(fs.existsSync(receipt)){results.push(read(receipt));continue;}
 if(stop){results.push({...item,status:'NOT_RUN',reason:'EARLIER_ENVIRONMENT_OR_BUDGET_STOP'});continue;}
 verify();if(countRequests()+12>manifest.max_model_requests){stop=true;results.push({...item,status:'NOT_RUN',reason:'REQUEST_BUDGET_RESERVE'});continue;}
 // Observe only. Never cancel, restart, clear or modify the user's UI run/history.
 while(true){const r=await fetch('http://127.0.0.1:58618/api/runs'),active=(await r.json()).filter(x=>['QUEUED','RUNNING','CANCELLING'].includes(x.status));assert.equal(r.status,200);if(!active.length)break;console.log('WAIT_USER_UI '+item.group+'/'+item.id);await new Promise(r=>setTimeout(r,20000));}
 if(fs.existsSync(path.join(dir,'run','source.txt'))){results.push({...item,status:'INTERRUPTED',reason:'INCOMPLETE_FIRST_OUTPUT_PRESERVED'});stop=true;continue;}
 fs.mkdirSync(dir,{recursive:true});const start=new Date().toISOString(),args=['research/7plus1-parser/llm-first-028/cli.mjs','--input',path.join(report,'inputs',item.id+'.txt'),'--output',path.join(dir,'run')];
 const launch={...item,status:'RUNNING',started_at:start,args,source_sha256:manifest.cases.find(x=>x.id===item.id).sha256};save(path.join(dir,'launch.json'),launch);console.log('START '+item.group+'/'+item.id+' requests='+countRequests());
 const child=spawn(process.execPath,args,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,BOUNDX_CODEX_EXE:manifest.binary}});
 const out=fs.createWriteStream(path.join(dir,'cli-stdout.txt'),{flags:'wx'}),err=fs.createWriteStream(path.join(dir,'cli-stderr.txt'),{flags:'wx'});child.stdout.pipe(out);child.stderr.pipe(err);
 const timer=setInterval(()=>{const req=walk(path.join(dir,'run')).filter(p=>/request-\d+\.json$/.test(p)).at(-1);console.log('RUNNING '+item.group+'/'+item.id+' elapsed_s='+Math.round((Date.now()-Date.parse(start))/1000)+' requests='+countRequests()+' latest='+(req?path.relative(dir,req).replaceAll('\\','/'):'preparation'));},30000);
 const ended=await new Promise(resolve=>{child.on('error',e=>resolve({exit_code:null,error:e.message}));child.on('close',code=>resolve({exit_code:code,error:null}));});clearInterval(timer);await Promise.all([new Promise(r=>out.close(r)),new Promise(r=>err.close(r))]);
 const stderr=fs.readFileSync(path.join(dir,'cli-stderr.txt'),'utf8'),finalFile=path.join(dir,'run/trace.json');
 const result={...launch,...ended,status:ended.exit_code===0&&fs.existsSync(finalFile)?'RUN_SUCCEEDED':'RUN_FAILED',ended_at:new Date().toISOString(),elapsed_ms:Date.now()-Date.parse(start),model_requests_in_run:walk(path.join(dir,'run')).filter(p=>/request-\d+\.json$/.test(p)).length,model_requests_total:countRequests(),semantic_status:'NOT_REVIEWED'};
 save(receipt,result);results.push(result);save(path.join(report,'RUN-RESULTS.json'),results);console.log('END '+item.group+'/'+item.id+' '+result.status+' elapsed_s='+Math.round(result.elapsed_ms/1000)+' requests='+result.model_requests_total);verify();
 if(/CODEX_LOGIN_REQUIRED|CODEX_QUOTA_OR_RATE_LIMIT|CODEX_ENV_UNAVAILABLE|UNSUPPORTED_CLI_FLAG|CODEX_MODEL_UNAVAILABLE/.test(stderr)||ended.exit_code===null)stop=true;
}
save(path.join(report,'RUN-RESULTS.json'),results);console.log('BATCH_END '+JSON.stringify({planned:40,ran:results.filter(x=>x.status==='RUN_SUCCEEDED'||x.status==='RUN_FAILED').length,requests:countRequests(),not_run:results.filter(x=>x.status==='NOT_RUN'||x.status==='INTERRUPTED').length}));
