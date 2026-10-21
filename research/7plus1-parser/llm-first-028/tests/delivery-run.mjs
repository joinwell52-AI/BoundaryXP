import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {cases} from './short-texts.mjs';
import {deliveryCases} from './delivery-cases.mjs';
import {evaluate} from './evaluate.mjs';
import {evaluateDelivery} from './delivery-evaluate.mjs';
import {replay7Plus1,parse7Plus1,writeJSON} from '../engine.mjs';
import {probeCodex} from '../provider.mjs';
import {sha256} from '../source.mjs';
const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-DELIVERY-029-LONG');
fs.mkdirSync(report,{recursive:true});
const args=process.argv.slice(2),kind=args[0]??'prepare';
const prior=path.resolve('docs/reports/7plus1/7P-LLM-FIRST-SEMANTIC-REBUILD-028-LONG/method-r2');
const inputDir=path.join(report,'inputs');
if(kind==='prepare'){
 fs.mkdirSync(inputDir,{recursive:true});
 for(const c of [...cases,...deliveryCases]){const file=path.join(inputDir,c.id+'.txt');fs.writeFileSync(file,c.text,{flag:'wx'});}
 writeJSON(path.join(report,'PREDECLARED-EXPECTATIONS.json'),{at:new Date().toISOString(),cases:[...cases,...deliveryCases],comparison_files:['evaluate.mjs','delivery-evaluate.mjs'].map(file=>({path:'research/7plus1-parser/llm-first-028/tests/'+file,sha256:sha256(fs.readFileSync(new URL(file,import.meta.url)))}))});
 console.log('23 source texts and expectations frozen before new T calls');
}
if(kind==='replay'){
 const output=path.join(report,args[1]??'s-regression');fs.mkdirSync(output,{recursive:true});const results=[];
 for(const c of cases){const trace=replay7Plus1(Buffer.from(c.text),{output:path.join(output,c.id),replayFrom:path.join(prior,c.id)});const r=evaluate(c,trace);results.push(r);console.log(c.id,r.end_to_end?'PASS':'FAIL',r.failures.map(f=>f.name).join(','));}
 writeJSON(path.join(output,'RESULTS.json'),results);
}
if(kind==='replay-current'){
 const output=path.join(report,args[1]??'final-compiled');fs.mkdirSync(output);const results=[];
 for(const c of [...cases,...deliveryCases]){const trace=replay7Plus1(Buffer.from(c.text),{output:path.join(output,c.id),replayFrom:path.join(report,'final',c.id,'run')});const r=c.id.startsWith('S')?evaluate(c,trace):evaluateDelivery(c,trace);results.push(r);writeJSON(path.join(output,c.id,'evaluation.json'),r);console.log(c.id,r.end_to_end?'PASS':'FAIL',r.failures.map(f=>f.name).join(','));}
 writeJSON(path.join(output,'RESULTS.json'),results);
}
if(kind==='live'){
 const ids=(args[1]??deliveryCases.map(c=>c.id).join(',')).split(','),batch=args[2]??'first';
 const url='http://127.0.0.1:58618';const response=await fetch(url+'/api/session'),s=await response.json(),cookie=response.headers.get('set-cookie').split(';')[0];
 const results=[],output=path.join(report,batch);fs.mkdirSync(output,{recursive:true});
 for(const id of ids){const c=[...cases,...deliveryCases].find(c=>c.id===id);if(!c)throw Error('UNKNOWN_TEST');const dest=path.join(output,id);fs.mkdirSync(dest);fs.writeFileSync(path.join(dest,'source.txt'),c.text,{flag:'wx'});
  const request={text:c.text,request_id:randomUUID()},accepted=await fetch(url+'/api/parse',{method:'POST',headers:{'content-type':'application/json','x-boundx-session':s.token,cookie,origin:url},body:JSON.stringify(request)});const receipt=await accepted.json();writeJSON(path.join(dest,'submission.json'),{...receipt,http_status:accepted.status});
  if(!accepted.ok){results.push({id,run_failure:receipt,end_to_end:false});continue;}
  console.log(id,'accepted',receipt.run_id);let record;
  while(true){record=await(await fetch(url+'/api/runs/'+receipt.run_id)).json();if(!['QUEUED','RUNNING','CANCELLING'].includes(record.status))break;await new Promise(r=>setTimeout(r,1000));}
  writeJSON(path.join(dest,'service-result.json'),record);
  const runRoot=path.resolve('.boundx/7plus1-short/runs',receipt.run_id);fs.cpSync(runRoot,path.join(dest,'run'),{recursive:true,errorOnExist:true});
  if(!record.result){const result={id,end_to_end:false,run_failure:record.error};results.push(result);writeJSON(path.join(dest,'evaluation.json'),result);console.log(id,'RUN_FAIL',record.error);continue;}
  const trace=JSON.parse(fs.readFileSync(path.join(runRoot,'trace.json'),'utf8')),r=id.startsWith('S')?evaluate(c,trace):evaluateDelivery(c,trace);
  results.push(r);writeJSON(path.join(dest,'evaluation.json'),r);console.log(id,r.end_to_end?'PASS':'FAIL',r.failures.map(f=>f.name).join(','));
 }
 writeJSON(path.join(output,'RESULTS.json'),results);
}
if(kind==='collect'){
 const id=args[1],run=args[2],dest=path.join(report,args[3]??'browser',id);fs.mkdirSync(dest,{recursive:true});fs.cpSync(path.resolve('.boundx/7plus1-short/runs',run),path.join(dest,'run'),{recursive:true,errorOnExist:true});
 const c=[...cases,...deliveryCases].find(c=>c.id===id),trace=JSON.parse(fs.readFileSync(path.join(dest,'run/trace.json'),'utf8'));const result=id.startsWith('S')?evaluate(c,trace):evaluateDelivery(c,trace);writeJSON(path.join(dest,'evaluation.json'),result);console.log(id,result.end_to_end?'PASS':'FAIL',result.failures.map(f=>f.name));
}
if(kind==='native-live'){
 const ids=args[1].split(','),batch=args[2],output=path.join(report,batch);fs.mkdirSync(output,{recursive:true});const probe=probeCodex(),results=[];let next=0;
 const worker=async()=>{while(next<ids.length){const id=ids[next++],c=[...cases,...deliveryCases].find(c=>c.id===id);if(!c)throw Error('UNKNOWN_CASE');const dest=path.join(output,id);fs.mkdirSync(dest);console.log(id,'START');let result;
  try{const trace=await parse7Plus1(Buffer.from(c.text),{output:path.join(dest,'run'),probe});result=id.startsWith('S')?evaluate(c,trace):evaluateDelivery(c,trace);}
  catch(e){result={id,end_to_end:false,run_failure:{code:e.code??e.message}};}
  results.push(result);writeJSON(path.join(dest,'evaluation.json'),result);console.log(id,result.end_to_end?'PASS':'FAIL',result.failures?.map(f=>f.name).join(',')??result.run_failure);
 }};
 // Bounded evaluation workers only; the interactive service still permits one active run.
 await Promise.all([worker(),worker(),worker()]);writeJSON(path.join(output,'RESULTS.json'),results.sort((a,b)=>a.id.localeCompare(b.id)));
}
