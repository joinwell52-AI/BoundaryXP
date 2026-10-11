import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const root=path.resolve(process.env.BOUNDX_INPUT_TEST_ROOT??'.boundx/unrestricted-input-ui19-work');
const core=path.join(root,'research/7plus1-parser/llm-first-028');
const load=name=>import(pathToFileURL(path.join(core,name)));
const {prepareSource,sha256,linkQuote}=await load('source.mjs');
const {MAX_SOURCE_BYTES,MAX_REQUEST_BYTES}=await load('input-limits.mjs');
const {buildBundle}=await load('bundle.mjs');
const {buildPrompt}=await load('provider.mjs');
const {createServer}=await load('service.mjs');
const {sourceExamples,loadSourceExample}=await load('examples.mjs');
const {sourceLength}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js')));
const longTask='ADMIN要求按阶段执行原文已有工作。\r\n'+Array.from({length:81},(_,i)=>`WP${i}：DEV检查第${i}组材料，提交QA；本阶段完成后才启动下一阶段。`).join('\r\n')+'\r\n最后由PM汇报ADMIN。禁止修改原始材料。';

test('full staged task above 300 characters and 4 KiB keeps exact bytes, lines and last-span evidence',()=>{
 const bytes=Buffer.from('\uFEFF'+longTask),s=prepareSource(bytes);
 assert.ok(s.codepoints>300);assert.ok(bytes.length>4096);
 assert.deepEqual(Buffer.from(s.text),bytes);assert.equal(s.sha256,sha256(bytes));
 for(const line of s.lines)assert.equal(Array.from(s.text).slice(...line.span).join(''),line.text);
 const q=linkQuote(s,{quote:'禁止修改原始材料。',occurrence:1});
 assert.equal(Array.from(s.text).slice(...q.span).join(''),q.quote);
 for(const literal of s.literals)assert.equal(Array.from(s.text).slice(...literal.span).join(''),literal.text);
});
test('301 and boundary-capacity input are accepted; larger input is explicitly rejected without a truncated replacement',()=>{
 assert.equal(prepareSource(Buffer.from('😀'.repeat(301))).codepoints,301);
 assert.equal(prepareSource(Buffer.alloc(MAX_SOURCE_BYTES,97)).codepoints,MAX_SOURCE_BYTES);
 assert.throws(()=>prepareSource(Buffer.alloc(MAX_SOURCE_BYTES+1,97)),/SOURCE_BYTE_LIMIT.*not truncated/);
 for(const t of ['', ' \n\t','\uFEFF'])assert.throws(()=>prepareSource(Buffer.from(t)),/EMPTY_SOURCE/);
 assert.throws(()=>prepareSource(Buffer.from([255])),TypeError);
});
test('Unicode source coordinates of literal hints are unchanged, including repeated literals after astral characters',()=>{
 const s=prepareSource(Buffer.from('中😀\r\nWP0：DEV检查app.yaml。\nWP1：提交app.yaml。限45分钟。'));
 const old=Array.from(s.text.matchAll(/[\w.-]+\.(?:csv|md|json|yaml|log|db)\b|\b[A-Z]+-\d+\b|\d+(?:\.\d+)?/g),m=>({text:m[0],span:[Array.from(s.text.slice(0,m.index)).length,Array.from(s.text.slice(0,m.index+m[0].length)).length]}));
 assert.deepEqual(s.literals,old);
});
test('parse and independent-audit model requests contain the complete source, including final WP and prohibition',()=>{
 const s=prepareSource(Buffer.from(longTask));
 for(const phase of ['parse','audit']){
  const b=buildBundle(phase,{parseMethod:'SKILL'}),prompt=buildPrompt({bundle:b,source:s});
  const raw=prompt.split('<SOURCE_DATA>\n')[1].split('\n</SOURCE_DATA>')[0];
  assert.equal(JSON.parse(raw).text,longTask);
  assert.ok(b.resources.find(x=>x.path===`skills/boundx-semantic-${phase}/SKILL.md`).text.includes('WP0—WPn'));
  assert.ok(prompt.includes('WP80'));assert.ok(prompt.includes('禁止修改原始材料'));
 }
});
test('input scope change does not change the candidate or audit schemas',()=>{
 const parent=path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.18/research/7plus1-parser/llm-first-028/contracts');
 for(const p of ['proposal.schema.json','audit.schema.json','comparison/proposal.schema.json','comparison/audit.schema.json'])assert.deepEqual(fs.readFileSync(path.join(core,'contracts',p)),fs.readFileSync(path.join(parent,p)));
});
test('display has no default short-text denominator and paste/upload share the server byte capacity',()=>{
 assert.equal(sourceLength('😀'.repeat(301)).label,'原文长度：301 字符');
 const app=fs.readFileSync(path.join(root,'research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js'),'utf8');
 assert.ok(app.includes("from '/input-limits.js'"));assert.ok(app.includes('f.size>MAX_SOURCE_BYTES'));
 assert.ok(app.includes("new TextEncoder().encode($('input').value).length>MAX_SOURCE_BYTES"));
 assert.ok(!app.includes('n>300'));assert.ok(!app.includes('f.size>4096'));
});
test('all 60 ACTIVE sources keep verified bytes and full request payload; no historical Gold answer is installed',()=>{
 const entries=sourceExamples();assert.equal(entries.length,60);
 const origin=path.resolve('.boundx/real-gold-60-review/REAL-GOLD-60-REVIEW-20260918-r01/adjudications-r02');
 const active=JSON.parse(fs.readFileSync(path.join(origin,'ACTIVE-REVISIONS.json')));
 for(const entry of entries){
  assert.equal(entry.active_revision,active.revisions[entry.id]);
  const m=JSON.parse(fs.readFileSync(path.join(origin,entry.id,entry.active_revision,'MANIFEST.json')));
  const original=fs.readFileSync(path.join(origin,entry.id,entry.active_revision,m.source_file));
  const loaded=loadSourceExample(entry.id);assert.deepEqual(Buffer.from(loaded.base64,'base64'),original);
  assert.equal(loaded.source_sha256,m.source_sha256);
  const s=prepareSource(original),prompt=buildPrompt({bundle:buildBundle('parse',{parseMethod:'SKILL'}),source:s});
  assert.equal(JSON.parse(prompt.split('<SOURCE_DATA>\n')[1].split('\n</SOURCE_DATA>')[0]).text,loaded.text);
  assert.deepEqual(fs.readdirSync(path.join(root,'fixtures/7plus1/real-gold-60-inputs',entry.id)),['source.md']);
 }
 assert.throws(()=>loadSourceExample('REAL-GOLD-000'),/NOT_FOUND/);
 assert.throws(()=>loadSourceExample('../source.md'),/NOT_FOUND/);
});
// This test exercises the real transport and source code only. The injected
// consumer records bytes and deliberately fails; it generates no fake semantic
// output and never substitutes for a real model acceptance test.
test('actual HTTP transport accepts full pasted/uploaded staged tasks and rejects overflow; no model is invoked',async()=>{
 const data=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-input-scope-'));
 const received=[];
 const server=createServer({dataRoot:data,legacyRoot:path.join(data,'legacy'),catalog:{default_model:'gpt-6.1-sol',default_reasoning:'medium',models:[{id:'gpt-6.1-sol',reasoning:['medium']}]},parse:async bytes=>{
  received.push(Buffer.from(bytes));throw Error('CODEX_NETWORK_FAILURE: transport-only test');
 }});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port;
 try{
  const response=await fetch(url+'/api/session'),session=await response.json();
  assert.equal(session.limit_codepoints,null);assert.equal(session.input_limits.max_source_bytes,MAX_SOURCE_BYTES);
  const headers={'content-type':'application/json','x-boundx-session':session.token,cookie:response.headers.get('set-cookie').split(';')[0],origin:url};
  const module=await(await fetch(url+'/input-limits.js')).text();assert.ok(module.includes('max_codepoints:null'));
  const examples=await(await fetch(url+'/api/examples')).json();assert.equal(examples.count,60);assert.equal(examples.answers_included,false);
  const example=await(await fetch(url+'/api/examples/REAL-GOLD-015')).json();assert.equal(example.codepoints,10374);assert.equal(example.text,loadSourceExample('REAL-GOLD-015').text);
  assert.equal(received.length,0);assert.equal((await fetch(url+'/api/examples/REAL-GOLD-000')).status,404);
  const text=longTask.repeat(5),bytes=Buffer.from(text);assert.ok(bytes.length>16384);
  for(const source of [{text},{base64:bytes.toString('base64'),filename:'phases.md'}]){
   const submitted=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({...source,request_id:randomUUID()})});
   assert.equal(submitted.status,202);const run=await submitted.json();
   for(let i=0;i<100&&server.activeJobs.size;i++)await new Promise(r=>setTimeout(r,5));
   const record=await(await fetch(url+'/api/runs/'+run.run_id)).json();
   assert.equal(record.status,'FAILED');assert.equal(record.error.code,'CODEX_NETWORK_FAILURE');
   assert.equal(record.source_text,text);assert.equal(record.source_sha256,sha256(bytes));
  }
  assert.deepEqual(received,[bytes,bytes]);
  const overflow=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({text:'x'.repeat(MAX_SOURCE_BYTES+1),request_id:randomUUID()})});
  assert.equal(overflow.status,400);assert.equal((await overflow.json()).error,'SOURCE_BYTE_LIMIT');
  const requestOverflow=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({text:'x'.repeat(MAX_REQUEST_BYTES),request_id:randomUUID()})});
  assert.equal(requestOverflow.status,413);assert.equal((await requestOverflow.json()).source_truncated,false);
  assert.equal(received.length,2);
 }finally{await new Promise(r=>server.close(r));fs.rmSync(data,{recursive:true,force:true});}
});
