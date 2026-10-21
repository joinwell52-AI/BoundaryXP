import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';import {lockProduct} from './resources.mjs';
const home=path.resolve('.boundx/short-compiler-031-r1'),report=path.resolve('docs/reports/7plus1/PUBLIC-SESSION-ACTIVITY-R04');fs.mkdirSync(report,{recursive:true});
if(fs.existsSync(path.join(report,'VERIFY.json')))throw Error('VERIFICATION_ALREADY_SEALED');
const old=lockProduct(path.join(home,'versions','0.1.0-candidate.031-r1.2-ui.10')),next=lockProduct(path.join(home,'versions','0.1.0-candidate.031-r1.2-ui.12'));old.verify();next.verify();
const core='research/7plus1-parser/llm-first-028/',load=(root,name)=>import(pathToFileURL(path.join(root,core+name)));
const a=await load(old.root,'engine.mjs'),b=await load(next.root,'engine.mjs'),obs=await load(next.root,'observability.mjs'),reader=await load(next.root,'model-activity.mjs');
const view=await import(pathToFileURL(path.join(next.root,'research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js')));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),cases=[],activity=[];
const offlineRoot=path.join(home,'public-session-ui12-verification');if(fs.existsSync(offlineRoot))throw Error('OFFLINE_RESULTS_EXIST');fs.mkdirSync(offlineRoot);
for(const id of fs.readdirSync(path.join(home,'data/runs'))){const folder=path.join(home,'data/runs',id);if(!fs.existsSync(path.join(folder,'run.json')))continue;
 const run=JSON.parse(fs.readFileSync(path.join(folder,'run.json'),'utf8'));const x=reader.sessionActivity(folder,run);activity.push({run_id:id,calls:x.calls.map(c=>({phase:c.phase,revision:c.revision,attempt:c.attempt,thread_id:c.thread_id,summaries:c.summaries.length,diagnostics:c.diagnostic_count,status:c.status,log:c.log}))});
 if(!run.status.startsWith('COMPLETED'))continue;
 const original=sha(fs.readFileSync(path.join(folder,'trace.json'))),bytes=fs.readFileSync(path.join(folder,'source.txt'));
 const oldResult=a.replay7Plus1(bytes,{replayFrom:folder,output:path.join(offlineRoot,id,'base')}),newResult=b.replay7Plus1(bytes,{replayFrom:folder,output:path.join(offlineRoot,id,'updated')});
 const checks={canonical:JSON.stringify(oldResult.canonical)===JSON.stringify(newResult.canonical),ir:JSON.stringify(oldResult.ir)===JSON.stringify(newResult.ir),chinese:oldResult.chinese===newResult.chinese,original_trace_unchanged:original===sha(fs.readFileSync(path.join(folder,'trace.json')))};
 if(Object.values(checks).some(v=>!v))throw Error('SEMANTIC_REPLAY_CHANGED:'+id);cases.push({run_id:id,checks});
}
const latencyID='df178f11-df35-4a45-85c0-124ad5c1ca7b',latencyFolder=path.join(home,'data/runs',latencyID),latencyRun=JSON.parse(fs.readFileSync(path.join(latencyFolder,'run.json'),'utf8'));
const allActivity=reader.sessionActivity(latencyFolder,latencyRun),timing=view.timingView({...latencyRun,model_activity:allActivity});
if(timing.model_ms!==642648||timing.other_ms!==1436||timing.calls.length!==4||allActivity.revisions.length!==1)throw Error('ALL_ROUND_TIMING_INCORRECT');
fs.writeFileSync(path.join(report,'LATENCY.json'),JSON.stringify({run_id:latencyID,total_ms:timing.total_ms,model_ms:timing.model_ms,other_ms:timing.other_ms,rounds:timing.round_count,calls:allActivity.calls.map(c=>({revision:c.revision,phase:c.phase,elapsed_ms:c.elapsed_ms,receipt:c.receipt})),revisions:allActivity.revisions,old_final_round_only_ms:315911,old_misclassified_other_ms:328173,real_model_calls_this_check:0},null,2)+'\n',{flag:'wx'});
// An offline callback proves plumbing, not that a live model always emits a summary.
const id=cases[0].run_id,folder=path.join(home,'data/runs',id),trace=JSON.parse(fs.readFileSync(path.join(folder,'trace.json'),'utf8')),events=[];
const replay=await b.parse7Plus1(fs.readFileSync(path.join(folder,'source.txt')),{output:path.join(offlineRoot,'callback'),probe:{version:'OFFLINE_FROZEN_RESPONSE'},semanticRevision:false,call:async o=>{
 const phase=o.bundle.phase;o.onActivity({signal:'REQUEST_STARTED',attempt:0});o.onEvent({type:'thread.started',thread_id:'offline-'+phase});o.onEvent({type:'item.completed',item:{id:'summary_'+phase,type:'reasoning',text:'离线管线测试：'+phase+'；这不是新模型结果。',raw_reasoning:'MUST_NOT_PUBLISH'}});
 return{value:trace[phase==='parse'?'proposal':'audit'],attempts:[],receipt:{thread_id:'offline-'+phase}};
},onProgress:p=>events.push(obs.publicProgress(p))});
if(events.filter(e=>e.signal==='PUBLIC_REASONING_SUMMARY').length!==2||JSON.stringify(events).includes('MUST_NOT_PUBLISH'))throw Error('SUMMARY_CALLBACK_FAILURE');
if(JSON.stringify(replay.canonical)!==JSON.stringify(trace.canonical)||replay.chinese!==trace.chinese)throw Error('SUMMARY_CHANGED_SEMANTIC_RESULT');
const files=[...fs.readdirSync('product/short-compiler/tests').filter(x=>x.endsWith('.test.mjs')).map(x=>'product/short-compiler/tests/'+x),...fs.readdirSync(core+'tests').filter(x=>x.endsWith('.test.mjs')).map(x=>core+'tests/'+x)];
const test=spawnSync(process.execPath,['--test',...files],{encoding:'utf8',cwd:process.cwd(),timeout:120000}),log=test.stdout+test.stderr;fs.writeFileSync(path.join(report,'tests.log'),log,{flag:'wx'});if(test.status!==0)throw Error('REGRESSION_FAILED');
old.verify();next.verify();const result={status:'PASS',version:next.snapshot.product_version,manifest:next.snapshot.manifest_sha256,parent_manifest:old.snapshot.manifest_sha256,semantic_acceptance:'UNCHANGED / PARTIAL / REVIEW_REQUIRED',real_model_calls:0,hidden_reasoning_exposed:false,cases,activity,offline_callback_signals:events.map(e=>e.signal??e.kind??e.stage),tests:{pass:Number(log.match(/(?:#|ℹ) pass (\d+)/u)?.[1]),fail:Number(log.match(/(?:#|ℹ) fail (\d+)/u)?.[1])}};
fs.writeFileSync(path.join(report,'VERIFY.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:result.status,version:result.version,tests:result.tests,semantic_replays:cases.length,actual_saved_calls:activity.reduce((s,x)=>s+x.calls.length,0),actual_saved_summary_items:activity.reduce((s,x)=>s+x.calls.reduce((n,c)=>n+c.summaries,0),0),real_model_calls:0},null,2));
