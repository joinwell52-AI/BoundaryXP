import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {directIRBundle} from '../research/7plus1-parser/llm-first-028/direct-ir-bundle.mjs';
import {buildBundle} from '../research/7plus1-parser/llm-first-028/bundle.mjs';
import {parse7Plus1,replay7Plus1} from '../research/7plus1-parser/llm-first-028/engine.mjs';
import {createServer} from '../research/7plus1-parser/llm-first-028/service.mjs';
import {runtimeInventory} from '../research/7plus1-parser/llm-first-028/evidence.mjs';
const frozen=JSON.parse(fs.readFileSync('docs/reports/7plus1/MANUAL-TEST-001-ui76-FIRST-RUN/TRACE.json'));
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'boundx-skill-profile-'));

test('Skill and skill1 differ only in their phase Skill while sharing authoritative contract and schemas',()=>{
 for(const phase of ['parse','audit']){
  const a=buildBundle(phase),b=buildBundle(phase,{parseMethod:'SKILL1'});
  assert.equal(a.parse_method,'SKILL');assert.equal(b.parse_method,'SKILL1');
  assert.notEqual(a.sha256,b.sha256);assert.strictEqual(a.schema,b.schema);
  assert.deepEqual(a.resources.slice(1),b.resources.slice(1));
  assert.equal(a.schema.properties.contract_version.const,'candidate-ir/1.4');
  assert.ok(b.resources[0].path.includes('semantics-first-r02/'));
  assert.ok(b.resources[0].path.includes('boundx-semantic-'+phase+'/'));
  assert.equal(b.resources.filter(x=>x.path.endsWith('SKILL.md')).length,1);
  assert.ok(!b.resources.some(x=>/evaluation|translations|CODEX-INTEGRATION|expected|README/.test(x.path)));
  assert.ok(!b.text.includes('name: boundx-semantic-'+(phase==='parse'?'audit':'parse')));
 }
});
test('invalid modes and retired MD cannot silently become Skill',()=>{
 assert.throws(()=>buildBundle('parse',{parseMethod:'SKILL2'}),/INVALID_PARSE_METHOD/);
 assert.throws(()=>buildBundle('parse',{parseMethod:'MD'}),/MD_COMPARISON_STOPPED/);
 assert.throws(()=>directIRBundle('unknown'),/DIRECT_IR_PHASE/);
 assert.equal(buildBundle('parse',{parseMethod:null}).parse_method,'SKILL');
});
test('skill1 files are protected by runtime inventory',()=>{
 const files=runtimeInventory().filter(x=>x.path.startsWith('skill-profiles/'));
 assert.ok(files.some(x=>x.path.endsWith('boundx-semantic-parse/SKILL.md')));
 assert.ok(files.some(x=>x.path.endsWith('boundx-semantic-audit/SKILL.md')));
});
test('profile reaches both independent phases and immutable trace without real model requests',async()=>{
 const dir=temp(),calls=[];
 // A frozen real response supplies only transport test data. This is no model accuracy test.
 const result=await parse7Plus1(Buffer.from(frozen.source.text),{output:dir,parseMethod:'SKILL1',probe:{test_only:true},maxModelRequests:2,call:async args=>{
  calls.push(args);const phase=args.bundle.phase;
  return {value:structuredClone(phase==='parse'?frozen.ir:frozen.audit),receipt:{thread_id:'test-only-'+phase},attempts:[{thread_id:'test-only-'+phase,elapsed_ms:0}]};
 }});
 assert.equal(calls.length,2);assert.equal(calls[0].candidate,undefined);
 assert.deepEqual(calls[1].candidate,frozen.ir);
 assert.ok(calls.every(x=>x.bundle.parse_method==='SKILL1'));
 assert.equal(result.parse_method,'SKILL1');assert.equal(result.resource_profile,'SEMANTICS_FIRST_R02_HOST_1_4');
 assert.deepEqual(result.ir,frozen.ir);
 const selected=JSON.parse(fs.readFileSync(path.join(dir,'selected-resources.json')));
 assert.equal(selected.parse_method,'SKILL1');
 assert.ok(selected.resources.parse[0].path.includes('boundx-semantic-parse/'));
 assert.ok(selected.resources.audit[0].path.includes('boundx-semantic-audit/'));
 const replay=replay7Plus1(Buffer.from(frozen.source.text),{output:path.join(temp(),'replayed'),replayFrom:dir});
 assert.equal(replay.parse_method,'SKILL1');assert.equal(replay.real_calls_in_this_replay,0);
 assert.deepEqual(replay.ir,frozen.ir);
});
test('API advertises both profiles, routes skill1 and keeps request idempotency tied to the selected resources',async()=>{
 const selected=[];
 const server=createServer({dataRoot:temp(),catalog:{sha256:'test-only',default_model:'gpt-6.1-sol',default_reasoning:'medium',models:[{id:'gpt-6.1-sol',label:'test',reasoning:['medium']}]},parse:async(bytes,args)=>{
  selected.push(args.parseMethod);
  fs.writeFileSync(path.join(args.output,'run-summary.json'),JSON.stringify({real_calls:0}));
  return {canonical:{slots:{},unresolved:[],gaps:[]},boundary_calculations:{status:'CALCULATED'}};
 }});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 try{
  const response=await fetch(url+'/api/session'),session=await response.json();
  assert.deepEqual(session.parse_methods,['SKILL','SKILL1']);
  assert.notEqual(session.comparison_resources.SKILL.effective_resource_sha256,session.comparison_resources.SKILL1.effective_resource_sha256);
  const headers={'content-type':'application/json','x-boundx-session':session.token,cookie:response.headers.get('set-cookie').split(';')[0]},request_id=randomUUID();
  const body={request_id,text:frozen.source.text,parse_method:'SKILL1',model:'gpt-6.1-sol',reasoning:'medium'};
  const r=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify(body)});assert.equal(r.status,202);const record=await r.json();
  assert.equal(record.parse_method,'SKILL1');assert.equal(record.resource_profile,'SEMANTICS_FIRST_R02_HOST_1_4');
  await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(selected,['SKILL1']);
  const same=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify(body)});assert.equal(same.status,200);
  const changed=await fetch(url+'/api/parse',{method:'POST',headers,body:JSON.stringify({...body,parse_method:'SKILL'})});assert.equal(changed.status,409);
  assert.deepEqual(selected,['SKILL1']);
 }finally{await new Promise(r=>server.close(r));}
});
