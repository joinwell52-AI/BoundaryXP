import test from 'node:test';import assert from 'node:assert/strict';import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';import {evaluateRequirements} from '../../src/bxp/ir-kernel/rules.mjs';import {preparePlan} from '../../src/bxp/ir-kernel/events.mjs';import {fixture,entity,event,expr,variable,req,E,O,T,V} from './fixtures.mjs';
import {v2,plan,callsIR} from './domain-fixtures.mjs';
const call=(id,actor='worker1',occurred=true)=>({id,task_id:'task',operation:'INVOKE',occurred,succeeded:false,roles:[{role:'PERFORMER',value:O(actor)},{role:'OBJECT',value:O('tool')}]});
test('K08/K10 fourth failed or off-template invocation counted; outside actor blocked',()=>{
 const c=compileCore(callsIR()).core;
 assert.equal(evaluateRequirements(c,{plan:plan([call('a'),call('b'),call('c')])}).result,'SATISFIED');
 assert.equal(evaluateRequirements(c,{plan:plan([call('a'),call('b'),call('c'),call('new-outside-template')])}).result,'VIOLATED');
 assert.equal(evaluateRequirements(c,{plan:plan([call('a','unlisted-qa')])}).result,'VIOLATED');
 assert.equal(evaluateCore(c,E('count'),{plan:plan([call('a'),call('b','worker1',false)])}).number,'1');
 assert.equal(evaluateCore(c,E('count'),{plan:{events:[call('a')]}}).unknown,true);
 assert.equal(evaluateRequirements(c,{plan:{events:[call('outside','unlisted-qa')]}}).result,'VIOLATED');
 assert.equal(evaluateRequirements(c,{plan:{events:[call('allowed')]}}).result,'UNKNOWN');
});
test('K09 repeated identical call logs deduplicate, conflicting identity rejected',()=>{
 const c=compileCore(callsIR()).core,p=preparePlan(c,plan([call('a'),call('a')]));assert.equal(evaluateCore(c,E('count'),{plan:p}).number,'1');
 assert.throws(()=>preparePlan(c,plan([call('a'),call('a','worker2')])),/CONFLICTING_OCCURRENCE_RECORDS/);
});
test('K11 exception uses the same event actor, target and gates; non-match is not permission',()=>{
 const i=v2();i.entities.push(...['manager','dev','admin','report','note'].map(x=>entity(x)));i.expressions.push(expr('events','TASK_EVENTS',[T('task')]),expr('actors','ACTORS_OF',[V('e')]),expr('targets','TARGETS_OF',[V('e')]),expr('recipients','RECIPIENTS_OF',[V('e')]),expr('isManager','MEMBER',[O('manager'),E('actors')]),expr('isReport','MEMBER',[O('report'),E('targets')]),expr('toAdmin','MEMBER',[O('admin'),E('recipients')]),expr('true','BOOLEAN',[],true),expr('false','BOOLEAN',[],false),expr('gates','AND',[E('true'),E('true')]),expr('except','AND',[E('isManager'),E('isReport'),E('gates')]),expr('operation','OPERATION_OF',[V('e')]),expr('deliver','SYMBOL',[],'DELIVER'),expr('isDeliver','EQ',[E('operation'),E('deliver')]),expr('bad','AND',[E('isDeliver'),E('toAdmin'),E('notExcept')]),expr('notExcept','NOT',[E('except')]),expr('occurs','EVENT_OCCURRED',[V('e')]),expr('deny','AND',[E('bad'),E('occurs')]),expr('anyViolation','EXISTS',[E('events'),E('deny')],null,null,V('e')));
 i.variables.push(variable('e','EVENT',E('events'),'INSTANCE_LOCAL'));i.requirements.push(req('ban',E('anyViolation'),{modality:'FORBIDDEN'}));
 const ev=(actor,target)=>({id:'fresh-delivery',task_id:'task',operation:'DELIVER',occurred:true,roles:[{role:'PERFORMER',value:O(actor)},{role:'OBJECT',value:O(target)},{role:'RECIPIENT',value:O('admin')}]});
 let c=compileCore(i).core;assert.equal(evaluateRequirements(c,{plan:plan([ev('manager','report')])}).result,'SATISFIED');
 assert.equal(evaluateRequirements(c,{plan:plan([ev('dev','report')])}).result,'VIOLATED');assert.equal(evaluateRequirements(c,{plan:plan([ev('manager','note')])}).result,'VIOLATED');
 i.expressions.find(x=>x.id==='gates').arguments[1]=E('false');c=compileCore(i).core;assert.equal(evaluateRequirements(c,{plan:plan([ev('manager','report')])}).result,'VIOLATED');
 assert.equal(evaluateRequirements(c,{plan:plan([])}).rows.some(r=>r.modality==='PERMITTED'),false);
});
test('K12 ordinary/partial receipt and delivery start never imply complete receipt',()=>{
 const i=v2();i.entities.push(entity('receiver','PERSON'),entity('artifact','FILE'));i.expressions.push(expr('any','RECEIVED_ANY',[O('receiver'),O('artifact')]),expr('complete','RECEIVED_COMPLETE',[O('receiver'),O('artifact')]));const c=compileCore(i).core;
 const check=receipt=>evaluateCore(c,E('complete'),{receipts:receipt});
 assert.equal(check([{receiver:'receiver',artifact:'artifact',any:true,complete:false}]),false);
 assert.equal(check([]).unknown,true);assert.equal(check([{receiver:'receiver',artifact:'artifact',complete:true}]),true);
 assert.equal(evaluateCore(c,E('any'),{receipts:[{receiver:'receiver',artifact:'artifact',complete:true}]}),true);
});
test('K14 interval overlap catches continued work, not just new starts; open-ended stop persists',()=>{
 const i=v2();i.events.push(event('work'));i.expressions.push(expr('stop','NUMBER',[],'5','second'),expr('resume','NUMBER',[],'10','second'),expr('overlap','ACTIVE_DURING',[T('work'),E('stop'),E('resume')]),expr('since','ACTIVE_SINCE',[T('work'),E('stop')]));const c=compileCore(i).core;
 const ctx=(start,end)=>({plan:plan([{id:'work',task_id:'task',occurred:true,start,end}])});
 assert.equal(evaluateCore(c,E('overlap'),ctx('2','8')),true);assert.equal(evaluateCore(c,E('overlap'),ctx('6','9')),true);
 assert.equal(evaluateCore(c,E('overlap'),ctx('1','5')),false);assert.equal(evaluateCore(c,E('since'),ctx('12','13')),true);
});
test('K13 explicit zero/one index bases have same previous identity and zero retry permitted',()=>{
 for(const base of [0,1]){const i=v2();i.events.push(event('attempt',{kind:'TEMPLATE'}));i.sequences.push({template:T('attempt'),task:T('task'),index_base:base,max_instances:3,coverage:'BOUNDED_DECLARATION',source_refs:['s']});i.expressions.push(expr('idx','NUMBER',[],String(base+1)),expr('instance','EVENT_INSTANCE',[T('attempt'),E('idx')]),expr('previous','PREVIOUS_INSTANCE',[E('instance')]));
 const c=compileCore(i).core;assert.equal(evaluateCore(c,E('previous')).event,'attempt@'+base);
 const p=preparePlan(c,plan([{id:'external-id',template_id:'attempt',index:base,task_id:'task',occurred:true}]));assert.equal(p.events.length,1);assert.equal(p.events[0].id,'attempt@'+base);
 }
});
test('K14 only the explicitly referenced emergency event is exempt during stopping',()=>{
 const i=v2();i.events.push(event('emergency',{operation:'STOP'}));i.expressions.push(expr('domain','TASK_EVENTS',[T('task')]),expr('when','NUMBER',[],'5','second'),expr('active','ACTIVE_SINCE',[V('e'),E('when')]),expr('emergencyId','EQ',[V('e'),T('emergency')]),expr('ordinary','NOT',[E('emergencyId')]),expr('banned','AND',[E('active'),E('ordinary')]),expr('anyBad','EXISTS',[E('domain'),E('banned')],null,null,V('e')));i.variables.push(variable('e','EVENT',E('domain'),'INSTANCE_LOCAL'));i.requirements.push(req('stop',E('anyBad'),{modality:'FORBIDDEN'}));const c=compileCore(i).core;
 const emergency={id:'emergency',task_id:'task',operation:'STOP',occurred:true,start:'5',end:'6'};assert.equal(evaluateRequirements(c,{plan:plan([emergency])}).result,'SATISFIED');
 const ordinary={id:'other-report',task_id:'task',operation:'REPORT',occurred:true,start:'2',end:'8'};assert.equal(evaluateRequirements(c,{plan:plan([emergency,ordinary])}).result,'VIOLATED');
});
