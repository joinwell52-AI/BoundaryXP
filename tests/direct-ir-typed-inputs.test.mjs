import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {typedInputDomains} from '../research/7plus1-parser/llm-first-028/direct-ir-sets.mjs';
import {directMathSummary} from '../research/7plus1-parser/llm-first-028/direct-ir-math-summary.mjs';
import {evaluateDirectInputPolicies} from '../research/7plus1-parser/llm-first-028/direct-ir-input-policy.mjs';
import {savedCallHistory} from '../research/7plus1-parser/llm-first-028/observability.mjs';
import {timingView} from '../research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
const ref=(kind,id)=>({kind,id}), x=id=>ref('EXPRESSION',id), ent=id=>ref('ENTITY',id);
const exp=(id,operator,args=[],literal=null)=>({id,operator,arguments:args,literal,source_refs:['source']});
const acceptance=ir=>({rows:['entities','events','states','expressions','requirements'].flatMap(k=>ir[k].map(n=>({id:n.id,status:'ACCEPTED'})))});
function fixture(count=3,prefix='item') {
 const ids=Array.from({length:count},(_,i)=>prefix+i);
 return {entities:[...ids.map(id=>({id,kind:'FILE',label:id})),{id:'group',kind:'GROUP',label:'domain',members:ids.map(ent)}],events:[{id:'task',kind:'TASK',owner_id:'task',roles:[]}],states:[],expressions:[exp('allowed','GROUP_MEMBERS',[ent('group')]),exp('used','TASK_EXTERNAL_INPUTS',[ref('EVENT','task')]),exp('limit','SUBSET',[x('used'),x('allowed')])],requirements:[{id:'input_policy',kind:'CONSTRAINT',subject:ref('EVENT','task'),modality:'REQUIRED',applicability:null,body:x('limit'),source_refs:['source']}],variables:[]};
}
test('input roles and absent roles yield the same typed domain; IDs and cardinalities are unconstrained',()=>{
 for(const count of [0,1,2,3,5,9])for(const prefix of ['renamed-','artifact-']){
  const ir=fixture(count,prefix),a=acceptance(ir),first=directMathSummary(ir,a);
  ir.events[0].roles=[{role:'INPUT_OBJECT',value:ent('group')}];
  const second=directMathSummary(ir,a);assert.deepEqual(first,second);assert.equal(first.input_count,count);assert.equal(first.union_count,count);assert.equal(first.input_boundary.status,'KNOWN');
 }
});
test('set, group, union, intersection and difference share exact membership with observations',()=>{
 for(const kind of ['SET','GROUP_MEMBERS','UNION','INTERSECTION','DIFFERENCE']){
  const ir=fixture(),allowed=ir.expressions[0];
  ir.entities.push({id:'outside',kind:'FILE',label:'outside'});
  ir.expressions.push(exp('left','SET',[ent('item0'),ent('item1'),ent('item2'),ent('item1')]),exp('right','SET',kind==='DIFFERENCE'?[ent('outside')]:[ent('item0'),ent('item1'),ent('item2')]));
  if(kind==='SET')Object.assign(allowed,{operator:kind,arguments:['item0','item1','item2','item2'].map(ent)});
  else if(kind!=='GROUP_MEMBERS')Object.assign(allowed,{operator:kind,arguments:[x('left'),x('right')]});
  const a=acceptance(ir),domain=typedInputDomains(ir,a);assert.deepEqual(domain.allowed,['item0','item1','item2']);
  for(const member of ['item0','item1','item2','outside']){const result=evaluateDirectInputPolicies(ir,a,[{owner_id:'task',external_inputs:[ent(member)]}]).results[0];assert.deepEqual(result.allowed,domain.allowed);assert.equal(result.result,member==='outside'?'VIOLATED':'SATISFIED');}
 }
});
test('unknown, nonaccepted and cyclic domains are not empty sets or a count of zero',()=>{
 for(const failure of ['missing','dynamic','cycle','not_accepted']){
  const ir=fixture();if(failure==='missing')ir.expressions[2].arguments[1]=x('missing');
  if(failure==='dynamic')ir.expressions[0].operator='TASK_EXTERNAL_INPUTS';
  if(failure==='cycle')Object.assign(ir.expressions[0],{operator:'UNION',arguments:[x('allowed'),x('allowed')]});
  const a=acceptance(ir);if(failure==='not_accepted')a.rows.find(r=>r.id==='group').status='UNRESOLVED';
  const m=directMathSummary(ir,a);assert.equal(m.input_count,null);assert.equal(m.input_files,null);assert.equal(m.union_count,null);assert.equal(m.input_boundary.status,'UNKNOWN');
 }
});
test('declared input role or source/note prose cannot fabricate an exclusive input domain',()=>{
 const ir=fixture();ir.requirements=[];ir.events[0].roles=[{role:'INPUT_OBJECT',value:ent('group')}];ir.note='Only these three inputs are allowed.';
 assert.equal(directMathSummary(ir,acceptance(ir)).input_count,null);
});
test('conjunctive bounds intersect; disjunction and conditional bounds are never promoted',()=>{
 const ir=fixture();ir.expressions.push(exp('narrow','SET',[ent('item1')]),exp('second','SUBSET',[x('used'),x('narrow')]),exp('both','AND',[x('limit'),x('second')]));ir.requirements[0].body=x('both');
 assert.deepEqual(typedInputDomains(ir,acceptance(ir)).allowed,['item1']);
 ir.expressions.at(-1).operator='OR';assert.equal(typedInputDomains(ir,acceptance(ir)).allowed,null);
 ir.requirements[0].body=x('limit');ir.requirements[0].applicability=x('conditional');
 const a=acceptance(ir);assert.equal(typedInputDomains(ir,a).allowed,null);assert.equal(evaluateDirectInputPolicies(ir,a,[{owner_id:'task',external_inputs:[ent('item0')]}]).results[0].result,'UNKNOWN');
});
test('a child scope cannot supply the missing root scope, and unknown membership stays unknown',()=>{
 const ir=fixture();ir.events.push({id:'child',kind:'TASK',owner_id:'task',roles:[]});ir.expressions[1].arguments=[ref('EVENT','child')];
 const a=acceptance(ir);assert.equal(typedInputDomains(ir,a).allowed,null);assert.deepEqual(typedInputDomains(ir,a).task_domains.find(t=>t.task_id==='child').allowed,['item0','item1','item2']);
 assert.equal(evaluateDirectInputPolicies(ir,a,[{owner_id:'missing',external_inputs:[ent('item0')]}]).results[0].result,'UNKNOWN');
 assert.equal(evaluateDirectInputPolicies(ir,a,[{owner_id:'child'}]).results[0].result,'UNKNOWN');
});
test('completion supports typed event occurrence without converting it to delivery completion',()=>{
 for(const eventOperand of [true,false]){
  const ir=fixture();ir.states=[{id:'done'},{id:'passed'},{id:'delivered'}];ir.events.push({id:'delivery',kind:'ACTION',roles:[]});
  ir.expressions.push(exp('done_value','STATE_VALUE',[ref('STATE','done')]),exp('qa','STATE_VALUE',[ref('STATE','passed')]),exp('delivery_value',eventOperand?'EVENT_OCCURRED':'STATE_VALUE',[ref(eventOperand?'EVENT':'STATE',eventOperand?'delivery':'delivered')]),exp('premise','AND',[x('qa'),x('delivery_value')]),exp('completion','IFF',[x('done_value'),x('premise')]));
  ir.requirements.push({id:'complete',kind:'COMPLETION',body:x('completion')});
  const f=directMathSummary(ir,acceptance(ir)).completions[0];assert.equal(f.satisfied_count,4);assert.equal(f.violation_count,4);assert.equal(f.premise_true_count,1);assert.equal(f.premise_false_count,3);assert.equal(f.atoms.at(-1).operator,eventOperand?'EVENT_OCCURRED':'STATE_VALUE');
  // Reversing an implication is not equivalent; the consumer follows the AST.
  ir.expressions.at(-1).operator='IMPLIES';assert.equal(directMathSummary(ir,acceptance(ir)).completions[0].satisfied_count,5);
 }
});
test('patch receipts count as model work even when rejected, without rewriting history',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-receipts-'));
 try{
  for(const [revision,kind,ms]of [[0,'parse',200],[0,'audit',300],[1,'patch',40]]){const folder=path.join(root,'revision-'+revision,kind+'-call');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'receipt-0.json'),JSON.stringify({elapsed_ms:ms,thread_id:kind}));}
  const calls=savedCallHistory(root),t=timingView({status:'COMPLETED_WITH_UNRESOLVED',created_at:'2026-01-01T00:00:00Z',ended_at:'2026-01-01T00:00:01Z',real_calls:3,call_history:calls});
  assert.equal(calls.length,3);assert.equal(t.complete,true);assert.equal(t.patch_ms,40);assert.equal(t.phases[0].ms,240);assert.equal(t.other_ms,460);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
