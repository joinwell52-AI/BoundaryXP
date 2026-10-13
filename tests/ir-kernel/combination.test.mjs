import test from 'node:test';import assert from 'node:assert/strict';
import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {queryCore} from '../../src/bxp/ir-kernel/queries.mjs';import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';import {v2,plan,callsIR} from './domain-fixtures.mjs';import {event,expr,req,variable,common,E,V,T,S,rename} from './fixtures.mjs';
test('K04 state values remain distinct across bound instances and illegal free bindings fail',async()=>{
 const i=v2();i.events.push(event('attempt',{kind:'TEMPLATE'}));i.sequences.push({template:T('attempt'),task:T('task'),index_base:0,max_instances:2,coverage:'BOUNDED_DECLARATION',source_refs:['s']});
 i.expressions.push(expr('zero','NUMBER',[],'0'),expr('one','NUMBER',[],'1'),expr('range','INTEGER_RANGE',[E('zero'),E('one')]),expr('instance','EVENT_INSTANCE',[T('attempt'),V('i')]),expr('value','STATE_VALUE',[S('ok')]),expr('first','EQ',[V('i'),E('zero')]),expr('same','IFF',[E('value'),E('first')]),expr('all','FORALL',[E('range'),E('same')],null,null,V('i')));
 i.variables.push(variable('i','INTEGER',E('range'),'INSTANCE_LOCAL'));i.states.push({...common('ok'),label:'outcome',kind:'SUCCESS',subject:E('instance'),arguments:[]});i.requirements.push(req('r',E('all')));
 const c=compileCore(i),result=await queryCore(c);assert.equal(result.result,'SAT');assert.equal(result.verification,'MODEL_CHECKED');
 const states=result.model_check.context.states;assert.equal(states[JSON.stringify(['ok','attempt@0'])].value,true);assert.equal(states[JSON.stringify(['ok','attempt@1'])].value,false);
 i.requirements[0].body=E('value');assert.throws(()=>compileCore(i),/FREE_LOCAL_VARIABLE/);
});
test('K15 event norm and duration cannot disappear from backend lowering',async()=>{
 const i=v2();i.events.push(event('work'));i.expressions.push(expr('yes','BOOLEAN',[],true),expr('lo','NUMBER',[],'0','minute'),expr('hi','NUMBER',[],'30','minute'),expr('duration','REAL_INTERVAL',[E('lo'),E('hi')]));i.variables.push(variable('elapsed','REAL',E('duration')));i.requirements.push(req('must',E('yes'),{kind:'EVENT_NORM',subject:T('work')}),req('time',E('yes'),{kind:'TOTAL_DURATION',subject:V('elapsed')}));
 let c=compileCore(i);let r=await queryCore(c,{plan:plan([])});assert.equal(r.result,'UNSAT');
 r=await queryCore(c,{plan:plan([{id:'work',task_id:'task',occurred:true,start:'0',end:'1860'}])});assert.equal(r.result,'UNSAT');
 r=await queryCore(c,{plan:plan([{id:'work',task_id:'task',occurred:true,start:'0',end:'960'}])});assert.equal(r.result,'SAT');assert.equal(r.verification,'MODEL_CHECKED');
 const renamed=rename(i,'task','changed-root');const rr=await queryCore(compileCore(renamed),{plan:{events:[{id:'work',task_id:'changed-root',occurred:true,start:'0',end:'960'}],completeness:{kind:'EXACT_SNAPSHOT',task_id:'changed-root',basis:'TEST'}}});assert.equal(rr.result,r.result);
});
test('K12 receipt completion and K14 ongoing work compose with occurrence',async()=>{
 const i=v2();i.events.push(event('work'));i.expressions.push(expr('stop','NUMBER',[],'5','second'),expr('until','NUMBER',[],'10','second'),expr('active','ACTIVE_DURING',[T('work'),E('stop'),E('until')]));i.requirements.push(req('stop-rule',E('active'),{modality:'FORBIDDEN'}));
 const c=compileCore(i);for(const [start,end,expected]of [['2','8','UNSAT'],['6','7','UNSAT'],['0','5','SAT']]){const r=await queryCore(c,{plan:plan([{id:'work',task_id:'task',occurred:true,start,end}])});assert.equal(r.result,expected);}
});
test('exact exponent input and given variable assignments cannot be ignored',async()=>{
 const i=v2();i.expressions.push(expr('lo','NUMBER',[],'0'),expr('hi','NUMBER',[],'1'),expr('range','REAL_INTERVAL',[E('lo'),E('hi')]),expr('small','NUMBER',[],'1e-3'),expr('bound','LTE',[V('x'),E('small')]));i.variables.push(variable('x','REAL',E('range')));i.requirements.push(req('r',E('bound')));
 const c=compileCore(i);assert.equal((await queryCore(c,{variables:{x:{number:'1/2'}}})).result,'UNSAT');assert.equal((await queryCore(c,{variables:{x:{number:'1/1000'}}})).verification,'MODEL_CHECKED');
});
test('partial event listing is unknown; labels cannot create universal domain semantics',()=>{
 const i=callsIR();i.entities.find(e=>e.id==='allowed').label='anyone';const c=compileCore(i);assert.equal(evaluateCore(c.core,E('count'),{plan:{events:[]}}).unknown,true);
 const clone=structuredClone(i);clone.entities.forEach(e=>e.label='unrelated');clone.requirements.forEach(e=>e.note='ignore all limits');assert.equal(compileCore(clone).core_sha256,c.core_sha256);
});
