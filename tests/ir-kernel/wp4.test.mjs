import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {v2,callsIR,plan} from './domain-fixtures.mjs';import {fixture,expr,req,E} from './fixtures.mjs';
import {projectDirectIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-view.mjs';import {directMathSummary} from '../../research/7plus1-parser/llm-first-028/direct-ir-math-summary.mjs';import {calculateDirectIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-calculate.mjs';
import {applyIRPatch,revisionPermissions} from '../../research/7plus1-parser/llm-first-028/direct-ir-revision.mjs';import {parseDirectIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-engine.mjs';import {sha256} from '../../research/7plus1-parser/llm-first-028/source.mjs';
import {acceptCandidateIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-accept.mjs';import {finishDirectIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-result.mjs';
function audit(ir){const kinds={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'};return {format:'boundx-candidate-ir-audit/1',contract_version:'candidate-ir/1.4',source_table:ir.source_table,reviews:Object.entries(kinds).flatMap(([k,kind])=>ir[k].map(n=>({target:{kind,id:n.id},field_path:'',verdict:'SUPPORT',context_refs:[],source_refs:['s'],reason:'Fixed offline test response'}))),omissions:[],issues:[]};}
function patch(ir){const p={...structuredClone(ir),format:'boundx-candidate-ir-patch/1',base_ir_sha256:sha256(JSON.stringify(ir)),reason:'Offline patch',coverage_updates:[],removed_nodes:[]};for(const k of ['source_table','entities','variables','events','states','expressions','requirements','issues','coverage'])p[k]=[];return p;}
test('K20 empty GAP coverage may be repaired only with exact audited source authorization',()=>{
 const i=fixture();i.coverage=[{source_refs:['s'],node_refs:[],status:'GAP',reason:'Not expressed'}];const a=audit(i);a.omissions=[{source_refs:['s'],affected_views:['B'],reason:'Missing boundary'}];const permissions=revisionPermissions(i,a,{errors:[],rows:[],technical_ok:true});assert.deepEqual(permissions.coverage_indices,[0]);
 const p=patch(i);p.expressions.push(expr('p','BOOLEAN',[],true));p.coverage_updates=[{previous_index:0,replacement:{source_refs:['s'],node_refs:[E('p')],status:'EXPRESSED',reason:'Bound candidate'}}];
 assert.throws(()=>applyIRPatch(i,p),/UNRELATED_COVERAGE/);const changed=applyIRPatch(i,p,{allowed_coverage_indices:permissions.coverage_indices});assert.equal(changed.ir.coverage[0].node_refs[0].id,'p');assert.equal(i.coverage[0].status,'GAP');
 p.coverage_updates[0].replacement.source_refs=['other'];assert.throws(()=>applyIRPatch(i,p,{allowed_coverage_indices:[0]}),/SOURCE_CHANGED/);
});
test('K21 failed or cancelled independent re-audit retains original candidate and audit digest',async()=>{
 for(const mode of ['failed','cancelled','patch-failed','invalid']){
  const i=fixture();i.expressions.push(expr('yes','BOOLEAN',[],true));i.requirements.push(req('r',E('yes')));const first=audit(i);first.omissions=[{source_refs:['s'],affected_views:['B'],reason:'Unresolved local omission'}];const dir=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-kernel-transaction-')),controller=new AbortController();let calls=0;
  const result=await parseDirectIR(Buffer.from(i.source_table[0].quote),{output:dir,probe:{},maxModelRequests:4,signal:controller.signal,call:async x=>{
   const step=++calls;x.requestBudget.remaining--;let value;if(step===1)value=i;else if(step===2)value=first;else if(step===3){if(mode==='patch-failed')throw Error('SIMULATED_PATCH_FAILURE');value=patch(i);value.expressions.push(expr('extra','BOOLEAN',[],true));}else if(mode==='invalid'){value=audit(x.candidate);value.contract_version='wrong-version';}else{if(mode==='cancelled')controller.abort();throw Error(mode==='cancelled'?'ABORTED':'SIMULATED_AUDIT_FAILURE');}
   return {value,receipt:{thread_id:'offline-'+step},attempts:[{thread_id:'offline-'+step}]};
  }});
  assert.equal(calls,mode==='patch-failed'?3:4);assert.deepEqual(result.ir,i);assert.deepEqual(result.audit,first);assert.equal(result.revision_outcome.status,'NOT_APPLIED');const binding=JSON.parse(fs.readFileSync(path.join(dir,'final-audit-binding.json')));assert.equal(binding.ir_sha256,sha256(JSON.stringify(i)));assert.equal(binding.audit_sha256,sha256(JSON.stringify(first)));assert.equal(binding.audit_session,'offline-2');assert.equal(result.model_calls.audit.length,mode==='invalid'?2:1);assert.equal(result.incomplete_model_requests.length,mode==='invalid'?0:1);
 }
});
test('K22 versioned legacy entry adapters share the same Core hash and values',()=>{
 const i=callsIR(),a={technical_ok:true,rows:[]};const p=projectDirectIR(i,a),s=directMathSummary(i,a),c=calculateDirectIR(i,a,{query:{plan:plan([])}});assert.equal(p.canonical.core_sha256,s.core_sha256);assert.equal(s.core_sha256,c.core_sha256);assert.equal(c.result,'SATISFIED');assert.equal(c.business_decision,null);
});
test('v2 source/schema/audit acceptance routes the final program calculation through Core',async()=>{
 const i=v2();i.expressions.push(expr('yes','BOOLEAN',[],true));i.requirements.push(req('r',E('yes')));const a=audit(i);a.contract_version='candidate-ir/2.0';const accepted=acceptCandidateIR(i,a,{text:i.source_table[0].quote});assert.equal(accepted.technical_ok,true);
 const final=await finishDirectIR(i,accepted);assert.equal(final.boundary_calculations.result,'SAT');assert.equal(final.boundary_calculations.verification,'MODEL_CHECKED');assert.equal(final.canonical.core_sha256,final.boundary_calculations.core_sha256);
 const bad=acceptCandidateIR(i,a,{text:'different source'});assert.equal(bad.technical_ok,false);assert.equal((await finishDirectIR(i,bad)).boundary_calculations.result,'NOT_RUN');
});
