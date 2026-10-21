import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDARYXP_INPUT_TEST_ROOT??'.boundx/local-condition-repair-r01/work');
const {calculateBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculus.mjs')));
const sha='b'.repeat(64),sources=[{quote:'Explicit conditional test evidence',span:[0,34],occurrence:1,source_sha256:sha}];
const fixture=(direction='SUFFICIENT',modality='REQUIRED',kind='CONDITION',op='STATE')=>{
 const event={id:'operation',predicate:'Unrelated action',kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',modality,polarity:'POSITIVE',owner_id:'ROOT'};
 const claim={id:'gate',kind,event_id:kind==='CONDITION'?'operation':null,scope_id:kind==='CONDITION'?'operation':'ROOT',expression_id:'gate-expression',direction,temporal:null};
 const state=id=>({id,op:'STATE',operands:[],state:{predicate:id,event_id:null,args:[],polarity:'POSITIVE'}});
 const expr=op==='STATE'?state('gate-expression'):{id:'gate-expression',op,operands:op==='NOT'?['one']:['one','two']};
 return {format:'boundx-boundary-ir/031-r1.1',source_sha256:sha,entities:[],expressions:[expr,...(op==='STATE'?[]:[state('one'),state('two')])],artifact_dependencies:[],gaps:[],facts:[
  {id:'fact:operation',kind:'EVENT',status:'ACCEPTED',claim_ids:['operation'],event,constraints:kind==='CONDITION'?[claim]:[],sources},
  {id:'fact:gate',kind,status:'ACCEPTED',claim_ids:['gate'],claim,event:kind==='CONDITION'?event:null,sources}
 ]};
};
const observed=(g,antecedent,consequent,extra={})=>({states:typeof antecedent==='boolean'?{'gate-expression':antecedent}:antecedent??{},outcomes:{gate:{target_id:g.facts[1].claim.event_id??'ROOT',kind:g.facts[1].kind==='COMPLETION'?'TASK_COMPLETE':g.facts[1].kind==='STOP'?'TASK_STOP':'EVENT_EXECUTED',known:true,value:consequent,...extra}}});
const assessment=(g,obs)=>calculateBoundary(g,obs).conditions[0].assessment;
for(const [direction,expect] of [['SUFFICIENT','TRUE'],['NECESSARY','FALSE'],['IFF','FALSE']])test(direction+': false premise / true outcome preserves direction',()=>{
 const g=fixture(direction),r=assessment(g,observed(g,false,true));assert.equal(r.logical_result,expect);assert.equal(r.observed_outcome,'TRUE');assert.equal(r.execution_authorization,null);
});
for(const [direction,expect] of [['SUFFICIENT','FALSE'],['NECESSARY','TRUE'],['IFF','FALSE']])test(direction+': true premise / false outcome preserves direction',()=>{
 const g=fixture(direction);assert.equal(assessment(g,observed(g,true,false)).logical_result,expect);
});
test('Missing outcome remains UNKNOWN when the premise requires it; no fabricated execution',()=>{
 const g=fixture();assert.equal(assessment(g,{states:{'gate-expression':true}}).logical_result,'UNKNOWN');
 assert.equal(assessment(g,{states:{'gate-expression':true}}).observed_outcome,'UNKNOWN');
 assert.equal(assessment(g,{states:{'gate-expression':false}}).logical_result,'TRUE');
});
test('Mismatched target, wrong outcome kind, nonboolean value and missing knowledge cannot bind',()=>{
 const g=fixture();for(const extra of [{target_id:'another'},{kind:'TASK_COMPLETE'},{value:'true'},{known:false}]){
  assert.equal(assessment(g,observed(g,true,true,extra)).logical_result,'UNKNOWN');
 }
});
test('Conjunction and disjunction differ on the same two state observations',()=>{
 const conjunction=fixture('SUFFICIENT','REQUIRED','CONDITION','AND'),disjunction=fixture('SUFFICIENT','REQUIRED','CONDITION','OR');
 assert.equal(assessment(conjunction,observed(conjunction,{one:true,two:false},false)).logical_result,'TRUE');
 assert.equal(assessment(disjunction,observed(disjunction,{one:true,two:false},false)).logical_result,'FALSE');
});
test('A locally negated premise changes the consequence obligation, not an unrelated event',()=>{
 const g=fixture('SUFFICIENT','REQUIRED','CONDITION','NOT');assert.equal(assessment(g,observed(g,{one:false},false)).logical_result,'FALSE');
 assert.equal(assessment(g,observed(g,{one:true},false)).logical_result,'TRUE');
});
test('Conditional prohibition checks nonoccurrence instead of requiring forbidden execution',()=>{
 const g=fixture('SUFFICIENT','FORBIDDEN');assert.equal(assessment(g,observed(g,true,true)).logical_result,'FALSE');
 assert.equal(assessment(g,observed(g,true,false)).logical_result,'TRUE');assert.equal(assessment(g,observed(g,false,true)).logical_result,'TRUE');
});
test('Sufficient permission cannot be checked as an execution obligation',()=>{
 const g=fixture('SUFFICIENT','PERMITTED');const r=assessment(g,observed(g,true,false));assert.equal(r.logical_result,'UNKNOWN');assert.equal(r.status,'NOT_APPLICABLE');
});
test('Root completion and root stop use distinct observations and do not imply each other',()=>{
 for(const kind of ['COMPLETION','STOP']){const g=fixture('SUFFICIENT','REQUIRED',kind);assert.equal(assessment(g,observed(g,true,false)).logical_result,'FALSE');
  assert.equal(assessment(g,observed(g,true,true,{kind:kind==='STOP'?'TASK_COMPLETE':'TASK_STOP'})).logical_result,'UNKNOWN');}
});
test('Logical acceptance never proves temporal order without timestamps',()=>{
 const g=fixture();g.facts[1].claim.temporal='AFTER';const r=assessment(g,observed(g,true,true));assert.equal(r.logical_result,'TRUE');assert.equal(r.temporal_result,'UNKNOWN');
});
test('Malformed direction cannot silently pass and ORDER is not a causal implication',()=>{
 for(const direction of ['ORDER','GUESS']){const g=fixture(direction),r=assessment(g,observed(g,true,true));assert.equal(r.logical_result,'UNKNOWN');assert.equal(r.status,'NOT_APPLICABLE');}
});
test('Accepted IR stays byte-identical after assessment and independently missing observations stay UNKNOWN',()=>{
 const g=fixture(),before=JSON.stringify(g),r=calculateBoundary(g,observed(g,true,true));assert.equal(JSON.stringify(g),before);
 assert.equal(r.conditions[0].assessment.logical_result,'TRUE');assert.equal(r.execution_authorization,null);assert.equal(r.business_decision,null);
});
