import test from 'node:test';import assert from 'node:assert/strict';import {v2,plan} from './domain-fixtures.mjs';import {entity,event,expr,variable,req,common,E,V,O,T,S} from './fixtures.mjs';import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {queryCore} from '../../src/bxp/ir-kernel/queries.mjs';import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';
test('K13 one task-fixed file survives every bounded attempt; maximum does not force retries',async()=>{
 for(const base of [0,1]){
  const i=v2();i.entities.push(entity('a'),entity('b'));i.events.push(event('attempt',{kind:'TEMPLATE',roles:[{role:'OBJECT',value:V('chosen'),source_refs:['s']}]}));i.sequences.push({template:T('attempt'),task:T('task'),index_base:base,max_instances:3,coverage:'BOUNDED_DECLARATION',source_refs:['s']});
  i.expressions.push(expr('files','SET',[O('a'),O('b')]),expr('first-index','NUMBER',[],String(base)),expr('next-index','NUMBER',[],String(base+1)),expr('first','EVENT_INSTANCE',[T('attempt'),E('first-index')]),expr('next','EVENT_INSTANCE',[T('attempt'),E('next-index')]),expr('start','EVENT_OCCURRED',[E('first')]),expr('file1','OBJECT_OF',[E('first')]),expr('file2','OBJECT_OF',[E('next')]),expr('one-file','EQ',[E('file1'),E('file2')]),expr('a-only','EQ',[E('file1'),O('a')]),expr('b-next','EQ',[E('file2'),O('b')]));i.variables.push(variable('chosen','OBJECT',E('files')));i.requirements.push(req('first-required',E('start')),req('fixed',E('one-file')),req('select-a',E('a-only')),req('illegally-change',E('b-next')));
  const c=compileCore(i),snapshot=plan([{id:'first-record',template_id:'attempt',index:base,task_id:'task',occurred:true}]);
  const valid=await queryCore(c,{requirements:['first-required','fixed','select-a'],plan:snapshot});assert.equal(valid.result,'SAT');assert.equal(valid.verification,'MODEL_CHECKED');assert.equal(valid.query_scope.events.length,1);
  assert.equal((await queryCore(c,{plan:snapshot})).result,'UNSAT');
 }
});
test('K11 necessary gates are checked at the event start, not eventual truth',()=>{
 const i=v2();i.events.push(event('delivery'));i.states.push({...common('approved'),label:'approval',kind:'EXTERNAL',subject:null,arguments:[]});i.expressions.push(expr('gate','TRUE_AT_START',[S('approved'),T('delivery')]));const c=compileCore(i).core;
 const context={plan:plan([{id:'delivery',task_id:'task',occurred:true,start:'5',end:'6'}]),states:{approved:{value:true,established_at:'11'}}};assert.equal(evaluateCore(c,E('gate'),context),false);context.states.approved.established_at='5';assert.equal(evaluateCore(c,E('gate'),context),true);delete context.states.approved;assert.equal(evaluateCore(c,E('gate'),context).unknown,true);
});
