import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';import {lockProduct} from './resources.mjs';
const repo=process.cwd(),home=path.join(repo,'.boundx/short-compiler-031-r1'),version='0.1.0-candidate.031-r1.2-ui.7',base=path.join(home,'versions','0.1.0-candidate.031-r1.2-ui.4'),root=path.join(home,'versions',version);
const report=path.join(home,'live-ui-verification-ui7');if(fs.existsSync(path.join(report,'VERIFY.json')))throw Error('VERIFICATION_ALREADY_SEALED');fs.mkdirSync(report,{recursive:true});
const locks=[lockProduct(base),lockProduct(root)];locks.forEach(x=>x.verify());
const oldEngine=await import(pathToFileURL(path.join(base,'research/7plus1-parser/llm-first-028/engine.mjs'))),newEngine=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/engine.mjs')));
const sha=b=>createHash('sha256').update(b).digest('hex'),cases=[];
for(const id of fs.readdirSync(path.join(home,'data/runs'))){
 const folder=path.join(home,'data/runs',id);if(!fs.existsSync(path.join(folder,'run.json')))continue;const run=JSON.parse(fs.readFileSync(path.join(folder,'run.json'),'utf8'));if(!run.status.startsWith('COMPLETED'))continue;
 const before=sha(fs.readFileSync(path.join(folder,'trace.json'))),bytes=fs.readFileSync(path.join(folder,'source.txt'));
 const a=oldEngine.replay7Plus1(bytes,{replayFrom:folder,output:path.join(report,id,'base')}),b=newEngine.replay7Plus1(bytes,{replayFrom:folder,output:path.join(report,id,'update')});
 const checks={canonical:JSON.stringify(a.canonical)===JSON.stringify(b.canonical),ir:JSON.stringify(a.ir)===JSON.stringify(b.ir),chinese:a.chinese===b.chinese,original_trace_unchanged:before===sha(fs.readFileSync(path.join(folder,'trace.json')))};
 if(Object.values(checks).some(x=>!x))throw Error('FROZEN_RESPONSE_REGRESSION:'+id);cases.push({run_id:id,checks,model_calls:0});
}
// Exercise the installed engine callbacks with the same recorded responses (not model evidence).
const first=cases[0].run_id,trace=JSON.parse(fs.readFileSync(path.join(home,'data/runs',first,'trace.json'),'utf8')),events=[],phases=[];
const result=await newEngine.parse7Plus1(fs.readFileSync(path.join(home,'data/runs',first,'source.txt')),{output:path.join(report,'installed-engine-observation'),probe:{version:'OFFLINE_FROZEN_RESPONSE_TEST'},semanticRevision:false,call:async o=>{
 const phase=o.bundle.phase;phases.push({phase,model:o.model,reasoning:o.reasoning});o.onActivity({signal:'REQUEST_STARTED',attempt:0});o.onEvent({type:'thread.started',thread_id:'offline-'+phase});o.onEvent({type:'item.completed',item:{type:'reasoning',text:'MUST_NOT_PUBLISH'}});
 return {value:trace[phase==='parse'?'proposal':'audit'],attempts:[],receipt:{thread_id:'offline-'+phase}};
},onProgress:p=>events.push(p)});
if(JSON.stringify(result.canonical)!==JSON.stringify(trace.canonical)||result.chinese!==trace.chinese)throw Error('INSTALLED_ENGINE_OBSERVATION_CHANGED_RESULT');
if(!['PARSE_READY','AUDIT_READY','TECHNICAL_READY','COMPILE_READY'].every(k=>events.some(e=>e.kind===k))||JSON.stringify(events).includes('MUST_NOT_PUBLISH'))throw Error('INSTALLED_TELEMETRY_FAILURE');
fs.writeFileSync(path.join(report,'ENGINE-EVENTS.json'),JSON.stringify({mode:'OFFLINE_FROZEN_RESPONSE_TEST',real_model_calls:0,events,phases},null,2)+'\n');
const suites=[['ui-and-entry',['product/short-compiler/tests/process-presentation.test.mjs','product/short-compiler/tests/live-progress.test.mjs','product/short-compiler/tests/installed-entry.test.mjs']],['core',fs.readdirSync('research/7plus1-parser/llm-first-028/tests').filter(p=>p.endsWith('.test.mjs')).map(p=>'research/7plus1-parser/llm-first-028/tests/'+p)]];
const tests=[];for(const [name,files] of suites){const x=spawnSync(process.execPath,['--test',...files],{cwd:repo,encoding:'utf8'}),out=x.stdout+x.stderr;fs.writeFileSync(path.join(report,name+'.log'),out);if(x.status!==0)throw Error('REGRESSION_FAILED:'+name);tests.push({suite:name,pass:Number(out.match(/(?:#|ℹ) pass (\d+)/u)?.[1]),fail:Number(out.match(/(?:#|ℹ) fail (\d+)/u)?.[1])});}
locks.forEach(x=>x.verify());const output={status:'PASS',version,manifest:locks[1].snapshot.manifest_sha256,base_manifest:locks[0].snapshot.manifest_sha256,cases,tests,engine_signals:events.map(e=>e.kind??e.signal??e.stage),real_model_calls:0,account_configuration_changed:false,semantic_acceptance:'PARTIAL / REVIEW_REQUIRED'};fs.writeFileSync(path.join(report,'VERIFY.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(output,null,2));
