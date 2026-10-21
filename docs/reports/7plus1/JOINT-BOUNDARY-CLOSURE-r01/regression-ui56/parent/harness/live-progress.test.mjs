import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {modelCatalog,requestSettings,publicProgress,modelSignal,partialArtifacts} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.52/research/7plus1-parser/llm-first-028/observability.mjs';
import {createServer} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.52/research/7plus1-parser/llm-first-028/service.mjs';
import {liveView,processView,decisionView,modelView,stageDisclosure} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.52/research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
const catalog={models:[{id:'gpt-6.1-sol',reasoning:['low','medium','high']},{id:'alternate',reasoning:['low','medium']}],default_model:'gpt-6.1-sol',default_reasoning:'medium',sha256:'catalog'};
test('new active stage opens once, later polling respects user collapse and history never opens itself',()=>{
 assert.equal(stageDisclosure({status:'RUNNING',stage:'PARSING'},'parse'),true);
 assert.equal(stageDisclosure({status:'RUNNING',stage:'AUDITING'},'audit',{previousStage:'PARSING',previousOpen:false}),true);
 assert.equal(stageDisclosure({status:'RUNNING',stage:'AUDITING'},'audit',{previousStage:'AUDITING',previousOpen:false}),false);
 assert.equal(stageDisclosure({status:'RUNNING',stage:'AUDITING'},'parse',{previousStage:'PARSING',previousOpen:true}),true);
 assert.equal(stageDisclosure({status:'COMPLETED',stage:'COMPLETED'},'parse'),false);
});
test('model catalog is local, sanitised, excludes hidden and unsupported entries',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-catalog-')),file=path.join(root,'models.json');
 fs.writeFileSync(file,JSON.stringify({identity:'PRIVATE',models:[{slug:'visible',visibility:'list',supported_reasoning_levels:[{effort:'high'},{effort:'ultra'}]},{slug:'hidden',visibility:'hide'},{slug:'bad/value',visibility:'list'},{slug:'unsupported',visibility:'list',supported_in_api:false}]}));
 const c=modelCatalog(file);assert.ok(c.models.some(m=>m.id==='visible'));assert.deepEqual(c.models.find(m=>m.id==='visible').reasoning,['high']);assert.ok(!JSON.stringify(c).includes('PRIVATE'));assert.ok(!c.models.some(m=>['hidden','bad/value','unsupported'].includes(m.id)));assert.ok(c.sha256);
});
test('per-run model settings use a validated catalog, with no silent fallback',()=>{assert.deepEqual(requestSettings({},catalog),{model:'gpt-6.1-sol',reasoning:'medium'});assert.deepEqual(requestSettings({model:'alternate',reasoning:'low'},catalog),{model:'alternate',reasoning:'low'});assert.throws(()=>requestSettings({model:'bad'},catalog));assert.throws(()=>requestSettings({model:'alternate',reasoning:'high'},catalog));});
test('model reasoning and raw errors cannot leak through progress',()=>{
 assert.equal(modelSignal({type:'item.completed',item:{type:'reasoning',text:'PRIVATE_REASONING'}}),null);
 const p=publicProgress({stage:'PARSING',event:{type:'error',message:'SECRET'},raw:'SECRET',token:'SECRET'});assert.equal(p.signal,'MODEL_ERROR_REPORTED');assert.ok(!JSON.stringify(p).includes('SECRET'));
 assert.deepEqual(publicProgress({stage:'AUDITING',phase:'audit',signal:'SESSION_STARTED',thread_id:'thread-2',attempt:1,revision:1}),{stage:'AUDITING',revision:1,phase:'audit',signal:'SESSION_STARTED',thread_id:'thread-2',attempt:1});
});
test('47 seconds of model wait stays running, does not imply progress percent or semantic output',()=>{const run={status:'RUNNING',stage:'PARSING',created_at:'2026-10-10T00:00:00Z',stages:[{stage:'PARSING',at:'2026-10-10T00:00:00Z'}]};const v=liveView(run,Date.parse('2026-10-10T00:00:47Z'));assert.equal(v.elapsed,47);assert.equal(v.steps.find(s=>s.id==='parse').state,'RUNNING');assert.equal(v.steps.find(s=>s.id==='audit').state,'WAITING');assert.equal(processView(run).stages[0].ready,false);});
test('candidate available during audit is displayed while final result is absent',()=>{const run={status:'RUNNING',stage:'AUDITING',progress:{proposal:{events:[{id:'e',predicate:'inspect',sources:[]}],entities:[],claims:[]}},stages:[]};assert.equal(processView(run).stages[0].ready,true);assert.equal(liveView(run).steps.find(s=>s.id==='parse').state,'DONE');assert.equal(liveView(run).steps.find(s=>s.id==='audit').state,'RUNNING');assert.equal(processView(run).stages[4].ready,false);});
test('failed audit preserves parsed candidates and never passes audit or later stages',()=>{const run={status:'FAILED',stage:'FAILED',progress:{proposal:{events:[]}},stages:[{stage:'PARSING'},{stage:'AUDITING'},{stage:'FAILED'}]};const states=liveView(run).steps;assert.equal(states.find(s=>s.id==='parse').state,'DONE');assert.equal(states.find(s=>s.id==='audit').state,'STOPPED');assert.equal(states.find(s=>s.id==='canonical').state,'WAITING');});
test('bounded revision reads only its own artifacts, not previous final result',()=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-partial-'));for(const n of [0,1])fs.mkdirSync(path.join(root,'revision-'+n));fs.writeFileSync(path.join(root,'revision-0/proposal.json'),'{}');fs.writeFileSync(path.join(root,'revision-0/7plus1.json'),'{}');const p=partialArtifacts(root,{revision:1});assert.equal(p.proposal,null);assert.equal(p.canonical,undefined);});
test('partial malformed output is not a completed candidate',()=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-partial-'));fs.mkdirSync(path.join(root,'revision-0'));fs.writeFileSync(path.join(root,'revision-0/proposal.json'),'{');assert.equal(partialArtifacts(root,{}).proposal,null);});
test('history model differs from next selected model and actual model is not invented',()=>{const v=modelView({requested_model:'historic',requested_reasoning:'low'}, {requested_model:'new',requested_reasoning:'high'});assert.equal(v.requested,'historic');assert.equal(v.reasoning,'low');assert.match(v.actual,/未披露/);});
test('candidate comparison follows actual fact identity, rejecting undefined joins',()=>{const run={result:{proposal:{events:[{id:'e',predicate:'inspect'},{predicate:'unknown'}],claims:[]},audit:{reviews:[{subject_id:'e',verdict:'SUPPORT',reason:'explicit'}]},technical:{rows:[{id:'e',status:'ACCEPTED',sources:[]}]},ir:{facts:[{id:'bf',kind:'EVENT',claim_ids:['e'],event:{id:'e'},status:'ACCEPTED'}]},canonical:{slots:{A:{entries:[{id:'bf'}]},I:{entries:[]}}}}};const rows=decisionView(run);assert.equal(rows[0].cells[4],'A（直接）');assert.equal(rows[1].cells[4],'没有进入最终事实');assert.match(rows[0].cells[1],/explicit/);});
test('running API exposes only complete stage artifacts, blocks final exports and forwards selected settings',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-live-'));let release,received;const gate=new Promise(r=>release=r);
 const server=createServer({dataRoot:root,legacyRoot:path.join(root,'legacy'),catalog,parse:async(_bytes,o)=>{received=o;fs.mkdirSync(path.join(o.output,'revision-0'));fs.writeFileSync(path.join(o.output,'revision-0/proposal.json'),JSON.stringify({events:[{id:'e',predicate:'inspect'}]}));o.onProgress({stage:'AUDITING',signal:'SESSION_STARTED',phase:'audit',thread_id:'audit-123',secret:'DO_NOT_PUBLISH'});await gate;throw Error('CODEX_TIMEOUT');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;const s=await fetch(url+'/api/session'),session=await s.json(),headers={'content-type':'application/json','x-boundx-session':session.token,cookie:s.headers.get('set-cookie').split(';')[0]};
 try{
  const id=randomUUID(),payload={text:'test input',request_id:id,model:'alternate',reasoning:'low'},response=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify(payload)});assert.equal(response.status,202);const r=await response.json();
  for(let i=0;i<50&&!received;i++)await new Promise(r=>setTimeout(r,5));assert.equal(received.model,'alternate');assert.equal(received.reasoning,'low');
  const run=await(await fetch(url+'/api/runs/'+r.run_id)).json();assert.equal(run.result,null);assert.equal(run.progress.proposal.events.length,1);assert.ok(!JSON.stringify(run).includes('DO_NOT_PUBLISH'));assert.equal(run.requested_model,'alternate');assert.equal(run.model_config_acceptance,'USER_SELECTED_NOT_SEMANTICALLY_ACCEPTED');
  assert.equal((await fetch(url+'/api/runs/'+r.run_id+'/json')).status,409);
  assert.equal((await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({...payload,model:'gpt-6.1-sol'})})).status,409);
  assert.equal((await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({...payload,request_id:randomUUID(),model:'not-in-catalog'})})).status,400);
  release();for(let i=0;i<50&&server.activeJobs.size;i++)await new Promise(r=>setTimeout(r,5));assert.equal(server.records.get(r.run_id).status,'FAILED');assert.equal((await(await fetch(url+'/api/runs/'+r.run_id)).json()).progress.proposal.events.length,1);
 }finally{release();await new Promise(r=>server.close(r));}
});
