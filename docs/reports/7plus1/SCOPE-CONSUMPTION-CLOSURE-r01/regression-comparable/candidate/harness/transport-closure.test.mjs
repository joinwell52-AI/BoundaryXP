import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
const root=path.resolve(process.env.BOUNDARYXP_COMPACT_TEST_ROOT??'.boundx/transport-repair-ui22-work');
const load=p=>import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028',p)));
const {runChild}=await load('process.mjs'),{prepareSource}=await load('source.mjs');
const {buildPrompt}=await load('provider.mjs'),{buildBundle}=await load('bundle.mjs'),{parse7Plus1}=await load('engine.mjs'),{createServer}=await load('service.mjs');
const prior=JSON.parse(fs.readFileSync('.boundx/exports/COMPACT-SEMANTIC-INTERFACE-r03/SKILL/revision-0/trace.json'));
const feedback=JSON.parse(fs.readFileSync('.boundx/exports/COMPACT-SEMANTIC-INTERFACE-r03/SKILL/revision-0/revision-request.json'));
const data=prompt=>JSON.parse(prompt.split('<SOURCE_DATA>\n')[1].split('\n</SOURCE_DATA>')[0]);
test('all model phases receive the exact source once; derived evidence stays local',()=>{
 const source=prepareSource(Buffer.from(prior.source.text));const before=structuredClone(source);
 for(const o of [{bundle:buildBundle('parse',{parseMethod:'SKILL'})},{bundle:buildBundle('audit',{parseMethod:'SKILL'}),candidate:prior.proposal},{bundle:buildBundle('parse',{parseMethod:'SKILL'}),candidate:prior.proposal,revisionIssues:feedback}]){
  assert.deepEqual(data(buildPrompt({...o,source})),{text:source.text});
 }
 assert.deepEqual(source,before);assert.ok(source.lines.length>0);assert.ok(source.literals.length>0);
});
test('unicode, CRLF, quotes and the final boundary are not normalized or truncated',()=>{
 const source=prepareSource(Buffer.from('\uFEFF中😀\r\n"a.yaml"\n'+('x'.repeat(12000))+'\r\n禁止修改原文。'));
 assert.deepEqual(data(buildPrompt({bundle:buildBundle('parse',{parseMethod:'SKILL'}),source})),{text:source.text});
});
test('default and explicit zero wait create no deadline timer',()=>{
 const moduleURL=pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/process.mjs')).href;
 // Observe the actual timer installation inside a separate process. No shared
 // clock mutation, no five-minute sleep and no model request are needed.
 const script=`let timers=[];const original=globalThis.setTimeout;globalThis.setTimeout=(f,ms,...a)=>{timers.push(ms);return original(f,ms,...a)};const {runChild}=await import(${JSON.stringify(moduleURL)});for(const options of [{},{timeoutMs:0}]){const r=await runChild(process.execPath,['-e','process.stdout.write("ok")'],options);if(r.exit_code!==0||r.timed_out)throw Error('BAD_EXIT');}process.stdout.write(JSON.stringify(timers));`;
 const r=spawnSync(process.execPath,['--input-type=module','-e',script],{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);assert.deepEqual(JSON.parse(r.stdout),[]);
});
test('an explicit deadline stops only this child and leaves a visible timeout receipt',async()=>{
 const r=await runChild(process.execPath,['-e','setInterval(()=>{},1000)'],{timeoutMs:120});
 assert.equal(r.timed_out,true);assert.equal(r.cancelled,false);assert.equal(r.exit_confirmed,true);assert.ok(r.pid>0);
});
test('manual cancel works without an automatic deadline',async()=>{
 const controller=new AbortController();const pending=runChild(process.execPath,['-e','setInterval(()=>{},1000)'],{signal:controller.signal});setTimeout(()=>controller.abort(),120);
 const r=await pending;assert.equal(r.cancelled,true);assert.equal(r.timed_out,false);assert.equal(r.exit_confirmed,true);
});
test('invalid explicit deadline is rejected before a child is started',async()=>{
 for(const timeoutMs of [-1,NaN,Infinity,'300000'])await assert.rejects(()=>runChild('must-not-spawn',[],{timeoutMs}),/INVALID_TIMEOUT/);
});
test('engine forwards no deadline and replays the same frozen response without semantic changes',async()=>{
 const output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-wait-replay-')),seen=[];let n=0;
 const r=await parse7Plus1(Buffer.from(prior.source.text),{output,parseMethod:'SKILL',semanticRevision:false,probe:{version:'NO_MODEL_TEST'},call:async o=>{
  seen.push(o.timeoutMs);const receipt={thread_id:'wait-test-'+n++,elapsed_ms:1};return{value:n===1?prior.proposal:prior.audit,attempts:[receipt],receipt};
 }});
 assert.deepEqual(seen,[null,null]);assert.deepEqual(r.canonical,prior.canonical);assert.deepEqual(r.ir,prior.ir);
 const {parse7Plus1:baseline}=await import(pathToFileURL(path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.21/research/7plus1-parser/llm-first-028/engine.mjs')));
 let b=0;const old=await baseline(Buffer.from(prior.source.text),{output:fs.mkdtempSync(path.join(os.tmpdir(),'boundx-wait-parent-')),parseMethod:'SKILL',semanticRevision:false,probe:{version:'NO_MODEL_TEST'},call:async()=>{const receipt={thread_id:'parent-test-'+b++,elapsed_ms:1};return{value:b===1?prior.proposal:prior.audit,attempts:[receipt],receipt};}});
 assert.deepEqual(r.boundary_calculations,old.boundary_calculations);assert.equal(r.chinese,old.chinese);
});
test('58618 service contract forwards unlimited wait and retains the request budget',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-wait-http-'));let received;
 const server=createServer({dataRoot:dir,legacyRoot:dir,catalog:{default_model:'gpt-6.1-sol',default_reasoning:'medium',models:[{id:'gpt-6.1-sol',reasoning:['medium']}]},parse:async(bytes,o)=>{received=o;throw Error('NO_MODEL_TEST_END');}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const url='http://127.0.0.1:'+server.address().port,sessionResponse=await fetch(url+'/api/session'),session=await sessionResponse.json();
  assert.deepEqual(session.model_wait_policy,{automatic_timeout_ms:null,manual_cancel:true});
  const response=await fetch(url+'/api/parse',{method:'POST',headers:{'content-type':'application/json',cookie:sessionResponse.headers.get('set-cookie').split(';')[0],'x-boundx-session':session.token},body:JSON.stringify({request_id:randomUUID(),text:'检查输入。',model:'gpt-6.1-sol',reasoning:'medium',parse_method:'SKILL'})});
  assert.equal(response.status,202);for(let i=0;!received&&i<20;i++)await new Promise(r=>setTimeout(r,10));
  assert.equal(received.timeoutMs,null);assert.equal(received.maxModelRequests,6);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
test('zero remaining request budget still blocks a real provider call',async()=>{
 const {callCodex}=await load('provider.mjs');await assert.rejects(()=>callCodex({bundle:buildBundle('parse',{parseMethod:'SKILL'}),source:prior.source,directory:fs.mkdtempSync(path.join(os.tmpdir(),'boundx-budget-')),requestBudget:{remaining:0}}),/MODEL_REQUEST_BUDGET_EXHAUSTED/);
});
