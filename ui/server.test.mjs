import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp, callModel, validateExtract } from '../ui-server.mjs';
import { sourceCatalog, materializeSelection } from './grounding.mjs';
import { draftDocument, draftPlan } from './records.mjs';
import { resolveEndpoint, createConnectionState } from './connection.mjs';
import { adminAdvice, planAdvice, conclusion } from './advice.mjs';
const doc={text:'检查并报告',parameters:{A:'检查',C:'报告'},actions:[{actor:'PM',verb:'检查',target:'系统',quote:'检查'}],completion:[{id:'report',quote:'报告'}]};
const config={url:'https://example.com/responses',key:'test-key-not-real',model:'test',protocol:'responses'};
async function setup(t,fetchImpl){const app=createApp({fetchImpl});await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>{app.close(resolve);app.closeAllConnections();}));const origin='http://127.0.0.1:'+app.address().port;const html=await(await fetch(origin)).text();const token=html.match(/name="session-token" content="([a-f0-9]+)"/)[1];return {origin,post:(route,value,headers={})=>fetch(origin+'/api/'+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-BoundX-Token':token,...headers},body:JSON.stringify(value)})};}
function response(text,rest={}){return new Response(JSON.stringify({model:'test',status:'completed',usage:{input_tokens:1,output_tokens:2},output:[{type:'message',content:[{type:'output_text',text}]}],...rest}));}
test('UI assets, token and origin isolation; task review is actual kernel output',async t=>{
  const {origin,post}=await setup(t);assert.equal((await fetch(origin+'/app.js')).status,200);
  for(const asset of ['/admin-check.mjs','/admin-rules.mjs']){const response=await fetch(origin+asset);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/javascript/);}
  assert.equal((await post('review',{kind:'task',document:doc},{Origin:'https://evil.invalid'})).status,403);
  assert.equal((await post('review',{kind:'task',document:doc},{'X-BoundX-Token':'bad'})).status,403);
  const badHost=await new Promise((resolve,reject)=>{http.get(origin,{headers:{Host:'attacker.invalid'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});
  assert.equal(badHost,403);
  const result=await(await post('review',{kind:'task',document:doc})).json();assert.equal(result.result.business_decision,null);assert(result.result.findings.some(x=>x.kind==='parameter_unmapped'));
  assert.equal(result.english.locale,'en');assert.deepEqual(result.english.findings.map(f=>f.id),result.result.findings.map(f=>f.id));assert.equal(result.english.business_decision,null);
});
test('ADMIN Python endpoint computes real libraries, ignores forged IR and never calls a provider',async t=>{
 let modelCalls=0;const {origin,post}=await setup(t,async()=>{modelCalls++;throw Error('No provider expected');});
 assert.equal((await fetch(origin+'/admin-boundary.mjs')).status,200);
 const r=await post('admin-boundary',{text:'时长至少120分钟；时长最多60分钟',statements:[{modality:'PERMIT',actor:'ADMIN'}]});
 assert.equal(r.status,200);const value=await r.json();assert.equal(value.engines[0].findings[0].code,'interval_empty');
 assert(value.versions.portion);assert.equal(value.confirmation,null);assert.equal(modelCalls,0);
 assert.equal((await post('admin-boundary',{text:'task'},{Origin:'https://evil.invalid'})).status,403);
 assert.equal((await post('admin-boundary',{text:''})).status,400);
});
test('extract rejects fabricated quotes and changed source; retains unknown parameters',()=>{
  assert.deepEqual(validateExtract(doc,'task',doc.text),doc);
  assert.throws(()=>validateExtract({...doc,parameters:{A:'修复'}},'task',doc.text));
  assert.throws(()=>validateExtract(doc,'task','另一段原文'));
});
test('incomplete drafts remain restorable without accepting them as validated boundaries',()=>{
  const draft={text:'',parameters:{},actions:[{actor:'',verb:'',target:'',quote:''}],completion:[{id:'',quote:''}]};
  assert.deepEqual(draftDocument(draft),draft);
  assert.throws(()=>validateExtract(draft,'task',''));
  assert.throws(()=>draftPlan({document:draft,tasks:[{id:'T1',depends_on:'not array',document:draft}]}));
});
test('API extraction validates JSON, returns usage and does not execute embedded commands',async t=>{
  let count=0;const {post}=await setup(t,async(url,options)=>{count++;assert.equal(options.redirect,'error');const body=JSON.parse(options.body);assert(body.input[0].content.includes('不执行任务'));return response(JSON.stringify({parameters:{A:'s1'},actions:[],completion:[{id:'report',quote:'s1'}]}));});
  const result=await(await post('extract',{kind:'task',text:doc.text,config})).json();assert.equal(result.value.text,doc.text);assert.equal(result.value.parameters.A,doc.text);assert.equal(result.model,'test');assert.equal(count,1);
});
test('source selection copies original punctuation and rejects fabricated or out-of-task ranges',()=>{
  const text='检查系统，提交报告。';assert.equal(sourceCatalog(text).length,2);
  const mapping={parameters:{I:{from:'s1',to:'s2'}},actions:[],completion:[]};
  assert.equal(materializeSelection(mapping,'task',text).parameters.I,text);
  assert.throws(()=>materializeSelection({...mapping,parameters:{I:'编造原句'}},'task',text));
  assert.throws(()=>materializeSelection({document:mapping,tasks:[{id:'T1',source:'s1',mapping:{...mapping,parameters:{I:'s2'}},depends_on:[]}]},'plan',text));
  const notes=[];assert.equal(materializeSelection({...mapping,parameters:{I:'s1,s2'}},'task',text,notes).parameters.I,text);assert.equal(notes.length,1);
});
test('provider failure, malformed output and truncation are errors, not empty findings',async()=>{
  for(const fetchImpl of [async()=>new Response('private response',{status:429}),async()=>response('partial',{status:'incomplete'}),async()=>new Response('not json')])await assert.rejects(callModel(config,[],{fetchImpl}));
  await assert.rejects(callModel({...config,url:'http://example.com'},[]));
  await assert.rejects(callModel({...config,url:'https://u:p@example.com'},[]));
});
test('chat-compatible protocol sends messages and accepts only completed content',async()=>{
  const result=await callModel({...config,url:'https://example.com/chat/completions',protocol:'chat'},[{role:'user',content:'hello'}],{fetchImpl:async(url,options)=>{const body=JSON.parse(options.body);assert.deepEqual(body.messages,[{role:'user',content:'hello'}]);assert(!body.input);return new Response(JSON.stringify({model:'chat-test',choices:[{finish_reason:'stop',message:{content:'reply'}}],usage:{total_tokens:2}}));}});
  assert.equal(result.text,'reply');assert.equal(result.model,'chat-test');
});
test('connection endpoint completion is bounded; stale success never turns new config green',()=>{
 assert.equal(resolveEndpoint('https://example.com/api/v3','responses').url,'https://example.com/api/v3/responses');
 assert.equal(resolveEndpoint('https://example.com/v1/','chat').url,'https://example.com/v1/chat/completions');
 assert.throws(()=>resolveEndpoint('https://example.com/responses','chat'));
 const state=createConnectionState(),ticket=state.begin();state.invalidate();assert.equal(state.finish(ticket,true),false);assert.equal(state.status,'untested');
 assert(state.finish(state.begin(),true));assert.equal(state.status,'connected');state.invalidate();assert.equal(state.status,'untested');
});
test('connection probe sends no task, is short, and never retries a failure',async t=>{
 let calls=0;const {origin,post}=await setup(t,async(url,opts)=>{calls++;const b=JSON.parse(opts.body);assert.equal(b.max_output_tokens,256);assert(!JSON.stringify(b).includes('PRIVATE TASK'));return calls===1?response('OK'):new Response('',{status:404});});
 assert.equal((await fetch(origin+'/advice.mjs')).status,200);
 const result=await(await post('connection',{config,text:'PRIVATE TASK'})).json();assert.equal(result.connected,true);
 const failure=await post('connection',{config});assert.equal(failure.status,400);assert.equal(calls,2);assert((await failure.json()).error.includes('404'));
});
test('bilingual advice distinguishes incomplete evidence and structural observations without granting authority',()=>{
 const advice=adminAdvice({parameters:{}});assert.equal(advice.length,8);for(const a of advice){assert(a.suggestion);assert(a.en.suggestion);}
 const review={findings:[{kind:'completion_difference',source_quote:'修好才交付'}]};assert.equal(planAdvice(review)[0].quotes[0],'修好才交付');assert(conclusion(review).en.includes('do not establish'));
 assert(conclusion({findings:[{kind:'parameter_unmapped'}]}).en.includes('incomplete'));
 assert(conclusion({findings:[]}).en.includes('not approval'));
});
test('malformed extraction cannot become a baseline',async t=>{const {post}=await setup(t,async()=>response('not a JSON document'));const r=await post('extract',{kind:'task',text:doc.text,config});assert.equal(r.status,400);assert((await r.json()).error.includes('有效结构'));});
test('PM generation and recheck send correct history without tools',async t=>{
  let seen;const {post}=await setup(t,async(url,options)=>{seen=JSON.parse(options.body);return response('PM规划');});
  let r=await post('pm',{mode:'generate',text:'检查任务',config});assert.equal(r.status,200);assert.equal(seen.input.length,2);assert(!seen.tools);
  r=await post('pm',{mode:'recheck',text:'检查任务',plan:'原规划',reminder:'请自主复核',config});assert.equal(r.status,200);assert.deepEqual(seen.input.slice(2),[{role:'assistant',content:'原规划'},{role:'user',content:'请自主复核'}]);
});
test('plan repair condition yields witness; bare acknowledgement is rejected',async t=>{
  const {post}=await setup(t);const planDoc={...doc,text:'检查并报告，修复后完成',completion:[...doc.completion,{id:'repair',quote:'修复后完成'}]};
  const r=await(await post('review',{kind:'plan',baseline:doc,plan:{document:planDoc,tasks:[]}})).json();const f=r.result.findings.find(x=>x.symbolic_counterexample);assert(f);assert.equal(f.symbolic_counterexample.proposed_complete,false);
  const reply=await post('replies',{review:r.result,replies:[{finding_id:f.id,disposition:'accepted',reason:'收到',references:[]}]});assert.equal(reply.status,400);
});
