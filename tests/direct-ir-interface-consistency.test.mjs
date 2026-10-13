import test from 'node:test';
import assert from 'node:assert/strict';
import {candidateSchema} from '../research/7plus1-parser/llm-first-028/contracts/candidate-ir-v1/schema.mjs';
import {acceptCandidateIR} from '../research/7plus1-parser/llm-first-028/direct-ir-accept.mjs';
import {calculateDirectIR} from '../research/7plus1-parser/llm-first-028/direct-ir-calculate.mjs';
import {taskScope} from '../research/7plus1-parser/llm-first-028/direct-ir-task-scope.mjs';
import {evaluateDirectEventPolicies} from '../research/7plus1-parser/llm-first-028/direct-ir-event-policy.mjs';
import {evaluateDirectInputPolicies} from '../research/7plus1-parser/llm-first-028/direct-ir-input-policy.mjs';
const source='Synthetic typed-interface fixture. It is not a model semantic accuracy test.';
const ref=(kind,id)=>({kind,id}),ex=id=>ref('EXPRESSION',id),ev=id=>ref('EVENT',id);
const common=id=>({id,source_refs:['s']});
const expr=(id,operator,args=[],literal=null,unit=null)=>({...common(id),operator,arguments:args,literal,unit,bound_variable:null});
const task=(id,owner=id)=>({...common(id),label:id,kind:'TASK',layer:'MAIN',use:'CURRENT_TASK',owner_id:owner,operation:'OTHER',operation_extent:'OPEN',actor_domain:'TASK_SCOPE',roles:[]});
const req=(id,kind,subject,body)=>({...common(id),kind,subject,body,scope_id:'ROOT',views:['R'],modality:'REQUIRED',applicability:null,data_use:null,note:''});
function fixture(id='arbitrary-task',owner='ROOT'){
 return {format:'boundx-candidate-ir/1',contract_version:candidateSchema.properties.contract_version.const,source_table:[{id:'s',quote:source,occurrence:1}],
 entities:[{...common('file'),label:'f',kind:'FILE',instance_scope:'ROOT',members:[]},{...common('lab'),label:'test',kind:'ENVIRONMENT',instance_scope:'ROOT',members:[]}],
 events:[task(id,'ROOT'),{...task('work',owner),kind:'ACTION',operation:'READ',operation_extent:'EXACT',roles:[{role:'OBJECT',value:ref('ENTITY','file'),source_refs:['s']},{role:'ENVIRONMENT',value:ref('ENTITY','lab'),source_refs:['s']}]}],
 variables:[{...common('elapsed'),label:'elapsed',type:'REAL',binding_mode:'OBSERVATION',scope_id:'ROOT',owner:ev(id),domain:ex('minutes')}],states:[],
 expressions:[expr('yes','BOOLEAN',[],true),expr('lo','NUMBER',[],5,'minutes'),expr('hi','NUMBER',[],25,'minutes'),expr('minutes','REAL_INTERVAL',[ex('lo'),ex('hi')],null,'minutes'),expr('upper','LT',[ref('VARIABLE','elapsed'),ex('hi')]),expr('allowed','SET',[ref('ENTITY','file')]),expr('actual','TASK_EXTERNAL_INPUTS',[ev(id)]),expr('subset','SUBSET',[ex('actual'),ex('allowed')])],
 requirements:[req('norm','EVENT_NORM',ev('work'),ex('yes')),req('duration','TOTAL_DURATION',ref('VARIABLE','elapsed'),ex('upper')),req('inputs','CONSTRAINT',ev(id),ex('subset')),
 {...req('use','DATA_USE',ev('work'),ex('yes')),data_use:{object:ref('ENTITY','file'),consumer:ev('work'),producer:null,origin:'EXTERNAL',availability:'AT_USE'}}],issues:[],coverage:[]};
}
function accepted(ir){const kinds={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'};
 const audit={format:'boundx-candidate-ir-audit/1',contract_version:ir.contract_version,source_table:ir.source_table,reviews:Object.entries(kinds).flatMap(([k,kind])=>ir[k].map(n=>({target:ref(kind,n.id),field_path:'',verdict:'SUPPORT',context_refs:[],source_refs:['s'],reason:'Synthetic interface fixture only'}))),issues:[],omissions:[]};
 const a=acceptCandidateIR(ir,audit,{text:source});assert.equal(a.technical_ok,true,JSON.stringify(a.errors));return a;}
const calc=ir=>calculateDirectIR(ir,accepted(ir));
function addEventRule(ir,body){ir.expressions.push(expr('domain','TASK_EVENTS',[ev(ir.events[0].id)]),expr('environment','ENVIRONMENT_OF',[ref('VARIABLE','each')]),expr('environment_ok','EQ',[ex('environment'),ref('ENTITY','lab')]),{...expr('all','FORALL',[ex('domain'),ex(body??'environment_ok')]),bound_variable:ref('VARIABLE','each')});ir.variables.push({...common('each'),label:'each',type:'EVENT',binding_mode:'INSTANCE_LOCAL',scope_id:'ROOT',owner:ev(ir.events[0].id),domain:ex('domain')});ir.requirements.push(req('environment_rule','CONSTRAINT',ev(ir.events[0].id),ex('all')));}

test('arbitrary root IDs and sentinel/explicit owners produce the same checked time, input and event constraints',()=>{
 for(const id of ['ROOT','renamed-root','task-73'])for(const alias of [true,false]){
  const ir=fixture(id,alias?'ROOT':id);addEventRule(ir);const before=JSON.stringify(ir),a=accepted(ir),c=calculateDirectIR(ir,a);
  assert.equal(c.status,'CALCULATED',JSON.stringify(c.gaps));assert.equal(c.joint.base.verification.valid,true);
  assert.equal(c.problem.temporal_horizons[0].start_point,id+':start');assert.equal(c.problem.temporal_horizons[0].end_point,id+':end');
  assert.equal(c.joint.base.input_boundary_verification.results[0].result,'SATISFIED');
  const record={owner_id:alias?'ROOT':id,external_inputs:[ref('ENTITY','file')],roles:{ENVIRONMENT:ref('ENTITY','lab')}};
  assert.equal(evaluateDirectInputPolicies(ir,a,[record]).results[0].result,'SATISFIED');assert.equal(evaluateDirectEventPolicies(ir,a,record).results[0].result,'SATISFIED');
  record.owner_id='missing';assert.equal(evaluateDirectEventPolicies(ir,a,record).results[0].result,'UNKNOWN');assert.equal(evaluateDirectInputPolicies(ir,a,[record]).results[0].result,'UNKNOWN');assert.equal(JSON.stringify(ir),before);
 }
});
test('task ancestry separates nested, unrelated, ambiguous, missing and cyclic ownership',()=>{
 const ir={events:[task('alpha','ROOT'),task('child','alpha'),task('grandchild','child')]};let s=taskScope(ir);
 assert.equal(s.member('ROOT','alpha'),true);assert.equal(s.member('grandchild','alpha'),true);assert.equal(s.member('alpha','child'),false);
 ir.events.push(task('other'));s=taskScope(ir);assert.equal(s.member('ROOT','alpha'),null);assert.equal(s.member('other','alpha'),false);
 ir.events.push(task('cycle-a','cycle-b'),task('cycle-b','cycle-a'));s=taskScope(ir);assert.equal(s.member('cycle-a','cycle-b'),null);assert.equal(s.member('missing','alpha'),null);
 ir.events.push(task('ROOT'));assert.equal(taskScope(ir).resolve('ROOT'),'ROOT');
});
test('total duration cannot borrow another task, missing owner or scope, and an empty task still has a duration lifecycle',()=>{
 for(const mode of ['missing','wrong','scope']){
  const ir=fixture();if(mode==='missing')ir.variables[0].owner=null;
  if(mode==='wrong'){ir.events.push(task('other'));ir.variables[0].owner=ev('other');}
  if(mode==='scope')ir.variables[0].scope_id='work';
  const c=calc(ir);assert.equal(c.status,'PARTIAL');assert.ok(c.gaps.some(g=>g.reason==='TOTAL_DURATION_TASK_OWNER_REQUIRED'));
 }
 const ir=fixture();ir.events.splice(1);ir.requirements=ir.requirements.filter(r=>r.kind==='TOTAL_DURATION');
 const c=calc(ir);assert.equal(c.status,'CALCULATED',JSON.stringify(c.gaps));assert.equal(c.joint.base.verification.valid,true);
});
function eventEquality(leftIndex,rightIndex,depth=1){const ir=fixture();
 ir.events.push({...task('sequence','ROOT'),kind:'TEMPLATE',operation:'READ',operation_extent:'EXACT'});
 ir.expressions.push(expr('i','NUMBER',[],leftIndex),expr('j','NUMBER',[],rightIndex),expr('left','EVENT_INSTANCE',[ev('sequence'),ex('i')]),expr('right','EVENT_INSTANCE',[ev('sequence'),ex('j')]));
 let operand=ex('left');for(let i=0;i<depth;i++){ir.expressions.push(expr('previous'+i,'PREVIOUS_INSTANCE',[operand]));operand=ex('previous'+i);}
 ir.expressions.push(expr('equal','EQ',[operand,ex('right')]));ir.requirements.push(req('comparison','CONSTRAINT',ev(ir.events[0].id),ex('equal')));return ir;
}
test('EVENT equality composes nested previous-instance terms with a numerical identity oracle',()=>{
 for(const [a,b,depth]of [[1,0,1],[3,1,2],[4,0,2],[2,2,1],[5,3,2]]){
  const ir=eventEquality(a,b,depth),c=calc(ir);assert.equal(c.status,a-depth===b?'CALCULATED':'CONFLICT',JSON.stringify(c.gaps));
 }
 const ir=eventEquality(0,0);const c=calc(ir);assert.equal(c.status,'PARTIAL');assert.ok(c.gaps.some(g=>g.reason==='PREVIOUS_INSTANCE_OUTSIDE_SEQUENCE'));
});
test('EVENT variables compare by identity inside quantifiers and propagate NOT/OR without inventing occurrences',()=>{
 const ir=fixture();ir.expressions.push(expr('same','EQ',[ref('VARIABLE','each'),ev('work')]),expr('different','NOT',[ex('same')]),expr('either','OR',[ex('same'),ex('different')]));addEventRule(ir,'either');
 let c=calc(ir);assert.equal(c.status,'CALCULATED',JSON.stringify(c.gaps));assert.equal(c.joint.base.witness.execution_trace.length,1);
 ir.expressions.find(e=>e.id==='all').arguments[1]=ex('different');c=calc(ir);assert.equal(c.status,'CONFLICT');
});
test('ambiguous task sentinel is a calculation finding, never an empty universal domain or a fabricated root',()=>{
 const ir=fixture();ir.events.push(task('other'));addEventRule(ir);const c=calc(ir);
 assert.equal(c.status,'PARTIAL');assert.ok(c.gaps.some(g=>g.reason==='TASK_EVENT_SCOPE_UNKNOWN:work'));assert.equal(c.joint.base.witness,null);
});
