import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateDirectIR} from '../research/7plus1-parser/llm-first-028/direct-ir-calculate.mjs';
import {evaluateDirectObservations} from '../research/7plus1-parser/llm-first-028/direct-ir-observations.mjs';
const ref=(kind,id)=>({kind,id}),ev=id=>ref('EVENT',id),ex=id=>ref('EXPRESSION',id),en=id=>ref('ENTITY',id);
const expr=(id,operator,args=[],literal=null)=>({id,operator,arguments:args,literal,unit:null,bound_variable:null,source_refs:[]});
const event=(id,kind='ACTION',owner='root')=>({id,kind,owner_id:owner,operation:'DELIVER',operation_extent:'EXACT',actor_domain:'TASK_SCOPE',roles:[{role:'DELIVERABLE',value:en('artifact')},{role:'RECIPIENT',value:en('recipient')}],use:'CURRENT_TASK',layer:'MAIN',source_refs:[]});
function fixture(){return {entities:['artifact','recipient','person'].map(id=>({id,kind:'PERSON',members:[]})),variables:[],states:[],expressions:[expr('yes','BOOLEAN',[],true)],events:[{...event('root','TASK'),owner_id:'root',roles:[]},event('ban'),{...event('actual'),actor_domain:'EXPLICIT'}],requirements:[{id:'prohibition',kind:'EVENT_NORM',modality:'FORBIDDEN',subject:ev('ban'),body:ex('yes'),applicability:null,scope_id:'ROOT',source_refs:[]},{id:'required',kind:'EVENT_NORM',modality:'REQUIRED',subject:ev('actual'),body:ex('yes'),applicability:null,scope_id:'ROOT',source_refs:[]}],issues:[],coverage:[]};}
const accepted=ir=>({technical_ok:true,diagnostics:[],source_links:[],rows:['entities','variables','states','events','expressions','requirements'].flatMap(k=>ir[k].map(n=>({id:n.id,status:'ACCEPTED'})))});
const record=(id='fresh')=>({event_id:id,operation:'DELIVER',owner_id:'root',occurred:true,start:4,end:5,roles:{DELIVERABLE:en('artifact'),RECIPIENT:en('recipient'),PERFORMER:en('person')}});
const observed=(ir,events,extra={})=>evaluateDirectObservations(ir,accepted(ir),{events,closed_world:{events:true},...extra}).requirements.find(r=>r.requirement_id==='prohibition').result;
test('task-scoped ACTION prohibitions match fresh IDs; explicit ACTION remains an instance',()=>{
 const ir=fixture();for(const id of ['ban','fresh','renamed-again'])assert.equal(observed(ir,[record(id)]),'VIOLATED');
 ir.events[1].actor_domain='EXPLICIT';assert.equal(observed(ir,[record('fresh')]),'SATISFIED');assert.equal(observed(ir,[record('ban')]),'VIOLATED');
});
test('pattern matching separates object, recipient, operation, task and unknown membership',()=>{
 const ir=fixture();ir.events.push({...event('other','TASK'),owner_id:'other',roles:[]});
 for(const change of [r=>r.roles.DELIVERABLE=en('another'),r=>r.roles.RECIPIENT=en('another'),r=>r.operation='READ',r=>r.owner_id='other',r=>r.occurred=false]){const r=record();change(r);assert.equal(observed(ir,[r]),'SATISFIED');}
 for(const change of [r=>delete r.roles.RECIPIENT,r=>r.owner_id='unknown',r=>delete r.occurred,r=>r.operation='OTHER']){const r=record();change(r);assert.equal(observed(ir,[r]),'UNKNOWN');}
 assert.equal(observed(ir,[],{closed_world:{events:false}}),'UNKNOWN');assert.equal(observed(ir,[]),'SATISFIED');
 const multi=record();multi.roles.DELIVERABLE=[en('artifact'),en('another')];assert.equal(observed(ir,[multi]),'VIOLATED');
 ir.events.push({...event('child','TASK'),owner_id:'root',roles:[]});const child=record();child.owner_id='child';assert.equal(observed(ir,[child]),'VIOLATED');
});
test('conditions bind each matched event start, rather than the pattern ID or final state',()=>{
 const ir=fixture();ir.states.push({id:'passed',kind:'SUCCESS',subject:null});ir.expressions.push(expr('at','TRUE_AT_START',[ref('STATE','passed'),ev('ban')]),expr('not_at','NOT',[ex('at')]));ir.requirements[0].applicability=ex('not_at');
 const extras={time_unit:'min',states:{passed:{value:true,established_at:3}}};
 assert.equal(observed(ir,[record()],extras),'SATISFIED');const early=record('early');early.start=2;
 assert.equal(observed(ir,[early,record()],extras),'VIOLATED');delete early.start;assert.equal(observed(ir,[early],extras),'UNKNOWN');
});
test('static solver forbids matched required events and preserves explicit-instance semantics',()=>{
 const ir=fixture(),before=JSON.stringify(ir);let out=calculateDirectIR(ir,accepted(ir));assert.equal(out.status,'CONFLICT',JSON.stringify(out.gaps));assert.equal(out.joint.base.result,'unsatisfiable');assert.equal(JSON.stringify(ir),before);
 ir.events[1].actor_domain='EXPLICIT';out=calculateDirectIR(ir,accepted(ir));assert.equal(out.joint.base.result,'satisfiable');
 ir.events[1].actor_domain='TASK_SCOPE';ir.events[2].roles[0].value=en('other-artifact');out=calculateDirectIR(ir,accepted(ir));assert.equal(out.joint.base.result,'satisfiable');
});
test('multiple explicit recipients are conjunctive in observations, never overwritten or alternatives',()=>{
 const ir=fixture();ir.events[2].roles.push({role:'RECIPIENT',value:en('second')});
 const evaluate=r=>evaluateDirectObservations(ir,accepted(ir),{events:[r],closed_world:{events:true}}).requirements.find(r=>r.requirement_id==='required').result;
 const r=record('actual');assert.equal(evaluate(r),'VIOLATED');r.roles.RECIPIENT=[en('recipient'),en('second')];assert.equal(evaluate(r),'SATISFIED');
});

test('an incomplete optional occurrence can be absent in a checked witness, but its active branch stays unknown',()=>{
 const ir=fixture();ir.events[2].roles=ir.events[2].roles.filter(r=>r.role!=='RECIPIENT');
 let c=calculateDirectIR(ir,accepted(ir));assert.equal(c.status,'PARTIAL');assert.ok(c.gaps.some(g=>g.reason==='PATTERN_ROLE_MEMBERSHIP_UNKNOWN'));
 ir.requirements[1].modality='PERMITTED';
 ir.expressions.push(expr('happened','EVENT_OCCURRED',[ev('actual')]),expr('absent','NOT',[ex('happened')]),expr('either','OR',[ex('happened'),ex('absent')]));ir.requirements.push({id:'identity_question',kind:'CONSTRAINT',modality:'REQUIRED',subject:ev('root'),body:ex('either'),applicability:null,scope_id:'ROOT',source_refs:[]});
 const before=JSON.stringify(ir);c=calculateDirectIR(ir,accepted(ir));assert.equal(JSON.stringify(ir),before);assert.equal(c.status,'CALCULATED',JSON.stringify(c.gaps));
 assert.ok(c.conditional_gaps.length);assert.equal(c.joint.base.conditional_gaps_inactive_in_witness,true);assert.ok(c.joint.base.verification.valid);assert.ok(!c.joint.base.witness.execution_trace.some(r=>r.event_id==='actual'));
 assert.equal(c.counterexample_query_limit,'UNRESOLVED_OCCURRENCE_BRANCHES_NOT_CERTIFIED');
 const r=record('actual');delete r.roles.RECIPIENT;assert.equal(observed(ir,[r]),'UNKNOWN');
});
