import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
import {randomUUID,createHash} from 'node:crypto';
const stage=path.resolve(process.env.BOUNDX_EFFICIENCY_TEST_ROOT??'.boundx/skill-efficiency-ui15-work');
const base=path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.13');
const core='research/7plus1-parser/llm-first-028/';
const load=rel=>import(pathToFileURL(path.join(stage,rel)).href);
const {buildBundle}=await load(core+'bundle.mjs');
const {buildPrompt}=await load(core+'provider.mjs');
const {renderResources}=await load(core+'prompt-profile.mjs');
const {prepareSource}=await load(core+'source.mjs');
const {technicalValidate}=await load(core+'validate.mjs');
const {compileBoundary}=await load(core+'compile.mjs');
const {parse7Plus1,writeJSON}=await load(core+'engine.mjs');
const {createServer}=await load(core+'service.mjs');
const {comparisonEvidence}=await load(core+'comparison-bundle.mjs');
const oldBundle=await import(pathToFileURL(path.join(base,core+'bundle.mjs')).href);
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const frozenRoot=path.resolve('.boundx/exports/SKILL-MD-COMPACT-COMPARISON-r02/SKILL');
const frozen=read(path.join(frozenRoot,'trace.json'));
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'boundx-efficiency-test-'));
for(const phase of ['parse','audit'])test(`${phase}: same complete output Schema, one declared transport`,()=>{
 const current=buildBundle(phase,{parseMethod:'SKILL'}),prior=oldBundle.buildBundle(phase,{parseMethod:'SKILL'});
 assert.deepEqual(current.schema,prior.schema);
 assert.deepEqual(current.resources,prior.resources);
 assert.equal(current.request_profile,'SCHEMA_ONCE_R01');assert.equal(current.schema_delivery.mode,'CLI_OUTPUT_SCHEMA');
 assert.equal(current.schema_delivery.schema_sha256,hash(JSON.stringify(prior.schema)));
 assert.equal(current.text.includes(`<RESOURCE path="${current.schema_delivery.path}"`),false);
 assert.equal(current.text.split('<OUTPUT_SCHEMA ').length-1,1);
 assert.ok(current.text.includes('--output-schema'));
 assert.equal(current.schema_delivery.fields_or_constraints_removed,false);
});
test('Audit still receives proposal Schema and its interpretation rules',()=>{
 const audit=buildBundle('audit',{parseMethod:'SKILL'});
 assert.ok(audit.text.includes('<RESOURCE path="contracts/proposal.schema.json"'));
 for(const text of ['逐','SOURCE_DATA','NOT_REQUIRED','CONTRADICT','ARTIFACT_USE'])assert.ok(audit.text.includes(text));
});
test('Wrong or missing transport Schema fails closed',()=>{
 const b=buildBundle('parse',{parseMethod:'SKILL'});
 assert.throws(()=>renderResources([],b.schema_delivery),/OUTPUT_SCHEMA_DELIVERY_MISMATCH/);
 assert.throws(()=>renderResources([...b.resources,b.resources.at(-1)],b.schema_delivery),/OUTPUT_SCHEMA_DELIVERY_MISMATCH/);
 assert.throws(()=>renderResources(b.resources,{...b.schema_delivery,schema_sha256:'wrong'}),/OUTPUT_SCHEMA_DELIVERY_MISMATCH/);
});
test('Contract, Skills, validators, compiler and source interpretation byte-identical',()=>{
 const files=['source.mjs','compile.mjs','validate.mjs','revision.mjs','contracts/schema.mjs','contracts/proposal.schema.json','contracts/audit.schema.json','contracts/semantic-contract.md','contracts/comparison/semantic-contract.md','contracts/comparison/proposal.schema.json','contracts/comparison/audit.schema.json','skills/boundx-semantic-parse/SKILL.md','skills/boundx-semantic-audit/SKILL.md'];
 for(const rel of files)assert.equal(hash(fs.readFileSync(path.join(stage,core,rel))),hash(fs.readFileSync(path.join(base,core,rel))),rel);
});
test('Original source, entire candidate and audit problems survive request construction',()=>{
 const source=prepareSource(fs.readFileSync(path.join(frozenRoot,'source.txt')));
 const issues=read(path.join(frozenRoot,'revision-0/revision-request.json'));
 const proposal=read(path.join(frozenRoot,'revision-0/proposal.json'));
 const prompt=buildPrompt({bundle:buildBundle('parse',{parseMethod:'SKILL'}),source,candidate:proposal,revisionIssues:issues});
 const section=tag=>JSON.parse(prompt.match(new RegExp(`<${tag}>\\n([\\s\\S]*?)\\n</${tag}>`))[1]);
 assert.deepEqual(section('SOURCE_DATA'),{text:source.text,lines:source.lines,literals:source.literals});
 assert.deepEqual(section('CANDIDATE_DATA'),proposal);assert.deepEqual(section('ACTUAL_AUDIT_ISSUES'),issues);
 assert.ok(prompt.includes('逐节点审阅'));assert.ok(prompt.includes('保留全部必填字段'));assert.ok(prompt.includes('不省略真实语义'));
});
test('Measured request body reduction, with Schema retained separately',()=>{
 const source=prepareSource(fs.readFileSync(path.join(frozenRoot,'source.txt')));
 for(const phase of ['parse','audit']){
  const b=buildBundle(phase,{parseMethod:'SKILL'}),candidate=phase==='audit'?read(path.join(frozenRoot,'revision-0/proposal.json')):null;
  const next=Array.from(buildPrompt({bundle:b,source,candidate})).length;
  const previous=read(path.join(frozenRoot,`revision-0/${phase}-call/request-0.json`)).prompt_characters;
  assert.ok(previous-next>(phase==='parse'?6000:1800));
 }
});
for(const round of ['r01','r02'])for(const method of ['SKILL','MD'])for(const revision of [0,1])test(`Frozen response ${round}/${method}/${revision} keeps exact technical, IR, JSON and Chinese`,()=>{
 const f=path.resolve(`.boundx/exports/SKILL-MD-COMPACT-COMPARISON-${round}/${method}/revision-${revision}/trace.json`);
 const t=read(f),technical=technicalValidate(t.source,t.proposal,t.audit),compiled=compileBoundary(t.source,t.proposal,t.audit,technical);
 assert.deepEqual(technical,t.technical);assert.deepEqual(compiled.ir,t.ir);assert.deepEqual(compiled.canonical,t.canonical);assert.equal(compiled.chinese,t.chinese);
});
test('MD cannot start a new CLI/core model call',async()=>{
 let calls=0;
 await assert.rejects(()=>parse7Plus1(Buffer.from('test'),{output:path.join(temp(),'run'),parseMethod:'MD',call:async()=>{calls++;}}),/MD_COMPARISON_STOPPED/);
 assert.equal(calls,0);
});
test('Independent audit remains mandatory; a shared session is rejected',async()=>{
 const output=path.join(temp(),'run');
 await assert.rejects(()=>parse7Plus1(Buffer.from(frozen.source.text),{output,parseMethod:'SKILL',probe:{version:'unit-only'},maxModelRequests:2,
  call:async o=>({value:o.bundle.phase==='parse'?frozen.proposal:frozen.audit,receipt:{thread_id:'same-session'},attempts:[]})}),/AUDIT_SESSION_NOT_INDEPENDENT/);
});
test('Omission still requires bounded full revision, never silently accepted to save time',async()=>{
 const calls=[];let i=0;
 const result=await parse7Plus1(Buffer.from(frozen.source.text),{output:path.join(temp(),'run'),parseMethod:'SKILL',probe:{version:'unit-only'},maxModelRequests:4,
  call:async o=>{
   calls.push({phase:o.bundle.phase,profile:o.bundle.request_profile});
   const revision=Math.floor(i/2),file=o.bundle.phase==='parse'?'proposal.json':'audit.json';
   const receipt={thread_id:'unit-session-'+i++,elapsed_ms:0};return{value:read(path.join(frozenRoot,`revision-${revision}`,file)),receipt,attempts:[receipt]};
  }});
 assert.equal(calls.length,4);assert.deepEqual(calls.map(x=>x.phase),['parse','audit','parse','audit']);
 assert.ok(calls.every(x=>x.profile==='SCHEMA_ONCE_R01'));assert.deepEqual(result.canonical,frozen.canonical);
});
test('HTTP Skill-only requests, old MD history/exports intact, profile prevents stale request reuse',async()=>{
 const dataRoot=temp(),oldId=randomUUID(),oldRequest=randomUUID();
 const folder=path.join(dataRoot,'runs',oldId);fs.mkdirSync(folder,{recursive:true});
 const record={run_id:oldId,request_id:oldRequest,status:'COMPLETED',stage:'COMPLETED',created_at:new Date().toISOString(),ended_at:new Date().toISOString(),source_text:frozen.source.text,source_sha256:frozen.source.sha256,requested_model:'unit-model',requested_reasoning:'medium',parse_method:'MD',resource_profile:'COMPACT_R01'};
 writeJSON(path.join(folder,'run.json'),record);writeJSON(path.join(folder,'trace.json'),frozen);
 let calls=0;
 const server=createServer({dataRoot,legacyRoot:temp(),catalog:{default_model:'unit-model',default_reasoning:'medium',models:[{id:'unit-model',reasoning:['medium']}],sha256:'unit'},parse:async(bytes,options)=>{
  calls++;const result={...frozen,...comparisonEvidence(options.parseMethod)};writeJSON(path.join(options.output,'trace.json'),result);writeJSON(path.join(options.output,'run-summary.json'),{real_calls:0});return result;
 }});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port;
 try{
  const response=await fetch(url+'/api/session'),s=await response.json();assert.deepEqual(s.parse_methods,['SKILL']);assert.equal(s.request_profile,'SCHEMA_ONCE_R01');
  const headers={'content-type':'application/json',cookie:response.headers.get('set-cookie').split(';')[0],'x-boundx-session':s.token};
  const post=body=>fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify(body)});
  const payload={text:frozen.source.text,request_id:randomUUID(),model:'unit-model',reasoning:'medium'};
  assert.equal((await post({...payload,parse_method:'MD'})).status,400);assert.equal(calls,0);
  const oldJSON=await(await fetch(url+'/api/runs/'+oldId+'/json')).json();assert.deepEqual(oldJSON,frozen.canonical);
  const accepted=await post({...payload,parse_method:'SKILL'}),run=await accepted.json();assert.equal(accepted.status,202);
  while(server.activeJobs.size)await new Promise(r=>setTimeout(r,5));
  assert.equal(calls,1);assert.equal(run.request_profile,'SCHEMA_ONCE_R01');
  assert.equal((await post({...payload,parse_method:'SKILL'})).status,200);
  assert.equal((await post({...payload,request_id:oldRequest,parse_method:'SKILL'})).status,409);
  const history=await(await fetch(url+'/api/runs')).json();assert.equal(history.find(x=>x.run_id===oldId).parse_method,'MD');
 }finally{await new Promise(r=>server.close(r));}
});
