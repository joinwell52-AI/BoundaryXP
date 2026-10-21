import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {pathToFileURL} from 'node:url';import {randomUUID,createHash} from 'node:crypto';
const root=path.resolve(process.env.BOUNDARYXP_COMPARISON_ROOT??'.boundx/method-comparison-ui13-work');
const base=path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.10');
const core='research/7plus1-parser/llm-first-028/';
const load=rel=>import(pathToFileURL(path.join(root,rel)).href);
const {buildBundle}=await load(core+'bundle.mjs'),{comparisonEvidence}=await load(core+'comparison-bundle.mjs');
const {parse7Plus1,replay7Plus1,writeJSON}=await load(core+'engine.mjs');
const {technicalValidate}=await load(core+'validate.mjs'),{compileBoundary}=await load(core+'compile.mjs');
const {createServer}=await load(core+'service.mjs');
const oldBundle=await import(pathToFileURL(path.join(base,core+'bundle.mjs')).href);
const hash=b=>createHash('sha256').update(b).digest('hex');
const frozen=path.resolve('.boundx/short-compiler-031-r1/data/runs/26f90823-b0e2-4bb2-8d24-8f1706a535a0');
const old=JSON.parse(fs.readFileSync(path.join(frozen,'trace.json'),'utf8'));
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'boundx-method-test-'));
test('Legacy Skill request bundles remain byte-identical',()=>{for(const phase of ['parse','audit'])assert.equal(buildBundle(phase).sha256,oldBundle.buildBundle(phase).sha256);});
test('Only the parser document differs; compact contract and Schemas are identical',()=>{
 const skill=buildBundle('parse',{parseMethod:'SKILL'}),md=buildBundle('parse',{parseMethod:'MD'});
 assert.equal(skill.resources.length,3);assert.equal(md.resources.length,3);
 assert.deepEqual(skill.resources.slice(1),md.resources.slice(1));assert.deepEqual(skill.schema,md.schema);
 assert(!md.text.includes('skills/boundx-semantic-parse/SKILL.md'));assert(!skill.text.includes('BOUNDARYXP-LLM-SEMANTIC-ESSENTIALS'));
 assert.notEqual(skill.resources[0].sha256,md.resources[0].sha256);
 assert.equal(skill.resources[1].characters,5550);assert.equal(skill.resources[2].characters,6694);
});
test('Audit request text is exactly identical for both modes',()=>{assert.equal(buildBundle('audit',{parseMethod:'SKILL'}).sha256,buildBundle('audit',{parseMethod:'MD'}).sha256);});
test('Compact Schema equals the frozen registry; no semantic compilation files changed',()=>{
 for(const file of ['compile.mjs','validate.mjs','revision.mjs','source.mjs','contracts/schema.mjs','contracts/proposal.schema.json','contracts/audit.schema.json','contracts/semantic-contract.md','skills/boundx-semantic-parse/SKILL.md','skills/boundx-semantic-audit/SKILL.md'])assert.equal(hash(fs.readFileSync(path.join(root,core,file))),hash(fs.readFileSync(path.join(base,core,file))),file);
});
test('Unsupported method fails before model calls',async()=>{
 let calls=0;await assert.rejects(parse7Plus1(Buffer.from(old.source.text),{output:temp(),parseMethod:'OTHER',probe:{},call:()=>{calls++;}}),/INVALID_PARSE_METHOD/);assert.equal(calls,0);
});
test('Each mode uses the same compiler for the same frozen response',async()=>{
 const original=compileBoundary(old.source,old.proposal,old.audit,technicalValidate(old.source,old.proposal,old.audit));
 for(const method of ['SKILL','MD']){
  const bundles=[];const output=temp();const result=await parse7Plus1(Buffer.from(old.source.text),{output,probe:{test_only:true},parseMethod:method,semanticRevision:false,call:async({bundle})=>{
   bundles.push(bundle);const receipt={thread_id:randomUUID(),exit_code:0,elapsed_ms:1};return {value:bundle.phase==='parse'?old.proposal:old.audit,receipt,attempts:[receipt]};
  }});
  assert.equal(result.parse_method,method);assert.equal(result.resource_profile,'COMPACT_R01');assert.equal(bundles.length,2);
  assert.deepEqual(result.canonical,original.canonical);assert.deepEqual(result.ir,original.ir);assert.equal(result.chinese,original.chinese);
  assert.equal(result.selected_resources.audit.bundle_sha256,comparisonEvidence(method).selected_resources.audit.bundle_sha256);
  assert.equal(JSON.parse(fs.readFileSync(path.join(output,'run-summary.json'),'utf8')).parse_method,method);
 }
});
test('Historical frozen replay still has identical JSON and Chinese; zero new model calls',()=>{
 const result=replay7Plus1(Buffer.from(old.source.text),{output:temp(),replayFrom:frozen});
 assert.deepEqual(result.canonical,old.canonical);assert.equal(result.chinese,old.chinese);assert.equal(result.real_calls_in_this_replay,0);
});
test('UI explanation reflects the actual run, not the next selection',async()=>{
 const view=await load('research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js');
 const run={parse_method:'MD',resource_profile:'COMPACT_R01',stage:'PARSING',stages:[],source_text:''};
 assert(view.processView(run).stages[0].actor.includes('r02 MD'));assert(view.processView(run).stages[0].input.includes('精简'));
 assert(view.liveView(run).phase.startsWith('r02 MD'));assert.equal(view.methodLabel({}),'解析Skill');
});
test('HTTP forwards selected method, rejects changed-mode identity reuse, and exports the actual method',async()=>{
 const calls=[];const dataRoot=temp();const server=createServer({dataRoot,legacyRoot:temp(),catalog:{default_model:'test-model',default_reasoning:'medium',models:[{id:'test-model',reasoning:['medium']}],sha256:'test'},parse:async(bytes,options)=>{
  calls.push(options.parseMethod);const trace={...old,...comparisonEvidence(options.parseMethod)};
  writeJSON(path.join(options.output,'trace.json'),trace);writeJSON(path.join(options.output,'run-summary.json'),{real_calls:0});return trace;
 }});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 try{
  const res=await fetch(url+'/api/session'),s=await res.json();assert.deepEqual(s.parse_methods,['SKILL','MD']);assert.equal(s.resource_profile,'COMPACT_R01');
  const headers={'content-type':'application/json','cookie':res.headers.get('set-cookie').split(';')[0],'x-boundx-session':s.token};
  const post=body=>fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify(body)});
  assert.equal((await post({text:'test',request_id:randomUUID(),parse_method:'INVALID'})).status,400);assert.equal(calls.length,0);
  for(const method of ['SKILL','MD']){
   const payload={text:old.source.text,request_id:randomUUID(),parse_method:method,model:'test-model',reasoning:'medium'};const r=await post(payload);const run=await r.json();assert.equal(r.status,202,JSON.stringify(run));assert.equal(run.parse_method,method);
   while(server.activeJobs.size)await new Promise(r=>setTimeout(r,5));
   assert.equal((await post(payload)).status,200);assert.equal((await post({...payload,parse_method:method==='MD'?'SKILL':'MD'})).status,409);
   const trace=await(await fetch(url+'/api/runs/'+run.run_id+'/trace.json')).json();assert.equal(trace.parse_method,method);assert.equal(trace.run.parse_method,method);
   const history=await(await fetch(url+'/api/runs')).json();assert.equal(history.find(x=>x.run_id===run.run_id).parse_method,method);
  }assert.deepEqual(calls,['SKILL','MD']);
 }finally{await new Promise(r=>server.close(r));}
});
