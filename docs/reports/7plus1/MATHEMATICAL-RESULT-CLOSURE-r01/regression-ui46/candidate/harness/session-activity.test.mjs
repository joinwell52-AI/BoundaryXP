import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {randomUUID} from 'node:crypto';
import {modelSignal,publicProgress} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.46/research/7plus1-parser/llm-first-028/observability.mjs';
import {sessionActivity} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.46/research/7plus1-parser/llm-first-028/model-activity.mjs';
import {sessionView,renderSessionActivity} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.46/research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
import {createServer} from 'file:///D:/boundx/.boundx/products/0.1.0-candidate.031-r1.2-ui.46/research/7plus1-parser/llm-first-028/service.mjs';
const event=(text='核对原文中的执行者和报告接收关系。',type='item.completed')=>({type,item:{id:'item_1',type:'reasoning',text}});
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-public-summary-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;}
test('only documented public reasoning.text is shown; hidden fields are never traversed',()=>{
 const s=modelSignal({...event(),raw_reasoning:'PRIVATE',item:{...event().item,encrypted_content:'PRIVATE',reasoning_content:'PRIVATE'}});
 assert.equal(s.signal,'PUBLIC_REASONING_SUMMARY');assert.equal(s.summary,event().item.text);assert.ok(!JSON.stringify(s).includes('PRIVATE'));
 for(const type of ['reasoning_delta','raw_reasoning','analysis','agent_message'])assert.equal(modelSignal({type:'item.updated',item:{id:'item_1',type,text:'PRIVATE'}}),null);
 assert.equal(modelSignal({type:'item.completed',item:{type:'reasoning',text:'missing identity'}}),null);
});
test('summary is bounded, known credentials masked, arbitrary payload fields stay filtered',()=>{
 const p=publicProgress({stage:'PARSING',phase:'parse',...modelSignal(event('Bearer 12345678901234567890 '+ 'x'.repeat(20000))),raw:'PRIVATE',token:'PRIVATE'});
 assert.ok(p.summary.length<=12000);assert.ok(!p.summary.includes('12345678901234567890'));assert.ok(!JSON.stringify(p).includes('PRIVATE'));
 assert.equal(publicProgress({stage:'PARSING',summary:'PRIVATE',signal:'TURN_STARTED'}).summary,undefined);
});
test('session errors and tools expose metadata without commands, credentials, output or raw errors',()=>{
 for(const [type,signal] of [['error','SESSION_DIAGNOSTIC'],['command_execution','TOOL_ACTIVITY'],['mcp_tool_call','TOOL_ACTIVITY']]){
  const s=modelSignal({type:'item.completed',item:{id:'item_2',type,command:'PRIVATE',message:'PRIVATE',arguments:'PRIVATE',text:'PRIVATE'}});assert.equal(s.signal,signal);assert.ok(!JSON.stringify(s).includes('PRIVATE'));
 }
});
test('running summary updates remain one item, retain receipt time and do not imply a final result',t=>{
 const root=fixture(t),record={status:'RUNNING',revision:0,stages:[{stage:'PARSING',revision:0,phase:'parse',signal:'REQUEST_STARTED',attempt:0,at:'2026-10-10T00:00:00Z'},...['first','updated'].map(text=>({stage:'PARSING',phase:'parse',revision:0,...modelSignal(event(text,'item.updated')),at:'2026-10-10T00:00:01Z'}))]};
 const a=sessionActivity(root,record);assert.equal(a.provisional,true);assert.equal(a.semantic_evidence,false);assert.equal(a.calls.length,1);assert.equal(a.calls[0].summaries.length,1);assert.equal(a.calls[0].summaries[0].text,'updated');assert.equal(a.calls[0].summaries[0].at,'2026-10-10T00:00:01Z');assert.equal(a.calls[0].status,'STARTED');
});
test('saved log reopens without invented times and merges callback summary exactly once',t=>{
 const root=fixture(t),dir=path.join(root,'revision-0/parse-call');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,'events-0.jsonl');fs.writeFileSync(file,[event(),{type:'turn.completed'}].map(JSON.stringify).join('\n')+'\n');
 const record={status:'COMPLETED',stages:[{stage:'PARSING',phase:'parse',revision:0,...modelSignal(event()),at:'2026-10-10T00:00:01Z'}]};const before=fs.readFileSync(file);
 const a=sessionActivity(root,record);assert.equal(a.calls[0].summaries.length,1);assert.equal(a.calls[0].summaries[0].at,'2026-10-10T00:00:01Z');assert.equal(a.calls[0].events.at(-1).at,null);assert.equal(a.calls[0].summary_status,'AVAILABLE');assert.deepEqual(fs.readFileSync(file),before);
});
test('empty or malformed logs preserve absence/partial-read, never reconstruct from candidate',t=>{
 const root=fixture(t),dir=path.join(root,'revision-0/audit-call');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'events-0.jsonl'),JSON.stringify({type:'turn.completed'})+'\nINVALID\n');
 const a=sessionActivity(root,{status:'COMPLETED',stages:[],result:{proposal:{reasoning:'PRIVATE'}}});assert.equal(a.calls[0].summary_status,'UNVERIFIABLE');assert.equal(a.calls[0].log.malformed_lines,1);assert.equal(a.calls[0].log.read_status,'PARTIAL_READ');assert.ok(!JSON.stringify(a).includes('PRIVATE'));
 const v=sessionView({model_activity:a});assert.match(v.calls[0].message,/不能确认/);
});
test('missing history log is not proof that a completed model never returned summaries',t=>{
 const a=sessionActivity(fixture(t),{status:'COMPLETED',stages:[{stage:'PARSING',phase:'parse',signal:'TURN_COMPLETED'}]});assert.equal(a.calls[0].summary_status,'NOT_RECORDED');assert.match(sessionView({model_activity:a}).calls[0].message,/不能确认/);
});
test('revisions and attempts do not mix parse and audit summaries',t=>{
 const root=fixture(t);for(const [r,phase,attempt,text] of [[0,'parse',0,'parse-0'],[0,'audit',0,'audit-0'],[1,'parse',1,'parse-1']]){const dir=path.join(root,`revision-${r}/${phase}-call`);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,`events-${attempt}.jsonl`),JSON.stringify(event(text))+'\n');}
 const a=sessionActivity(root,{status:'FAILED',revision:1,stages:[]});assert.deepEqual(a.calls.map(c=>c.summaries[0].text),['parse-0','audit-0','parse-1']);assert.equal(a.calls[2].attempt,1);
});
test('per-call receipt provenance and saved bounded revision reasons remain separate from semantic output',t=>{
 const root=fixture(t);for(const [r,phase,ms] of [[0,'parse',1100],[0,'audit',1200],[1,'parse',1300],[1,'audit',1400]]){const dir=path.join(root,`revision-${r}/${phase}-call`);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'receipt-0.json'),JSON.stringify({elapsed_ms:ms,exit_code:0,thread_id:`thread-${r}-${phase}`,input:'PRIVATE',stderr:'PRIVATE'}));}
 fs.writeFileSync(path.join(root,'revision-0/revision-request.json'),JSON.stringify({reviews:[{subject_id:'event-a',reason:'局部限制不能新增动作。'}],technical_errors:[],omissions:[],binding_errors:[],suggested_json:'PRIVATE'}));
 const a=sessionActivity(root,{status:'COMPLETED',revision:1,stages:[]});assert.deepEqual(a.calls.map(c=>c.elapsed_ms),[1100,1200,1300,1400]);assert.ok(a.calls.every(c=>/^[a-f0-9]{64}$/.test(c.receipt.sha256)));assert.equal(a.revisions[0].reasons[0].reason,'局部限制不能新增动作。');assert.equal(a.revisions[0].next_revision,1);assert.ok(!JSON.stringify(a).includes('PRIVATE'));
});
test('HTML is plain text in the readable summary renderer, not interpreted as markup',()=>{
 class E{constructor(tag){this.tag=tag;this.children=[];this.dataset={};}append(...xs){this.children.push(...xs);}replaceChildren(...xs){this.children=xs;}querySelectorAll(){return[];}}
 const previous=globalThis.document;globalThis.document={createElement:tag=>new E(tag)};
 try{const root=new E('section');renderSessionActivity(root,{run_id:randomUUID(),model_activity:{kind:'PUBLIC_CODEX_SESSION_ACTIVITY',calls:[{id:'0:parse:0',phase:'parse',revision:0,attempt:0,status:'COMPLETED',summary_status:'AVAILABLE',summaries:[{text:'<img src=x onerror=alert(1)>',status:'completed'}],events:[]}]}});
 const nodes=e=>[e,...e.children.flatMap(nodes)],text=nodes(root).find(e=>e.className==='public-summary-text');assert.equal(text.textContent,'<img src=x onerror=alert(1)>');assert.ok(!nodes(root).some(e=>e.tag==='img'));
 }finally{globalThis.document=previous;}
});
test('live API and separate activity export expose summaries without changing semantic result exports',async t=>{
 const root=fixture(t);let release;const gate=new Promise(r=>release=r);
 const server=createServer({dataRoot:root,legacyRoot:path.join(root,'legacy'),parse:async(_b,o)=>{o.onProgress({stage:'PARSING',revision:0,phase:'parse',...modelSignal(event())});await gate;throw Error('CODEX_TIMEOUT');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 try{const r=await fetch(url+'/api/session'),s=await r.json(),headers={'content-type':'application/json','x-boundx-session':s.token,cookie:r.headers.get('set-cookie').split(';')[0]};
  const run=await(await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({text:'offline test',request_id:randomUUID()})})).json();
  for(let n=0;n<40&&server.records.get(run.run_id).stage!=='PARSING';n++)await new Promise(r=>setTimeout(r,5));
  const actual=await(await fetch(url+'/api/runs/'+run.run_id)).json();assert.equal(actual.result,null);assert.equal(actual.model_activity.calls[0].summaries[0].text,event().item.text);
  const exportFile=await(await fetch(url+'/api/runs/'+run.run_id+'/activity.json')).json();assert.equal(exportFile.semantic_evidence,false);assert.equal(exportFile.hidden_reasoning_included,false);assert.equal((await fetch(url+'/api/runs/'+run.run_id+'/json')).status,409);
 }finally{release();for(let n=0;n<50&&server.activeJobs.size;n++)await new Promise(r=>setTimeout(r,5));await new Promise(r=>server.close(r));}
});
