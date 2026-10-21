import test from 'node:test';
import assert from 'node:assert/strict';
import {operators,candidateSchema} from '../research/7plus1-parser/llm-first-028/contracts/candidate-ir-v1/schema.mjs';
import {validateCandidateIR} from '../research/7plus1-parser/llm-first-028/contracts/candidate-ir-v1/validate.mjs';
import {calculateDirectIR} from '../research/7plus1-parser/llm-first-028/direct-ir-calculate.mjs';
import {evaluateDirectObservations} from '../research/7plus1-parser/llm-first-028/direct-ir-observations.mjs';
import {evaluateDirectEventPolicies} from '../research/7plus1-parser/llm-first-028/direct-ir-event-policy.mjs';
import {revisionPermissions,applyIRPatch} from '../research/7plus1-parser/llm-first-028/direct-ir-revision.mjs';
import {sha256} from '../research/7plus1-parser/llm-first-028/source.mjs';
import {operatorRegistry} from '../research/7plus1-parser/llm-first-028/contracts/candidate-ir-v1/runtime-capabilities.mjs';
import {verifyJointWitness} from '../src/bxp/joint-boundary-solver.mjs';
const text='Typed operator conformance fixture; not a model accuracy result.';
const ref=(kind,id)=>({kind,id}),ev=id=>ref('EVENT',id),vr=id=>ref('VARIABLE',id),en=id=>ref('ENTITY',id),ex=id=>ref('EXPRESSION',id),meta=id=>({id,source_refs:['s']});
function build(){
 const ir={format:'boundx-candidate-ir/1',contract_version:candidateSchema.properties.contract_version.const,source_table:[{id:'s',quote:text,occurrence:1}],entities:[],events:[],states:[],variables:[],expressions:[],requirements:[],issues:[],coverage:[]};
 const e=(id,op,args=[],literal=null,unit=null,bound_variable=null)=>{ir.expressions.push({...meta(id),operator:op,arguments:args,literal,unit,bound_variable});return ex(id);};
 const req=(id,body,subject=ev('root'),kind='CONSTRAINT')=>ir.requirements.push({...meta(id),kind,views:['B'],scope_id:'ROOT',modality:'REQUIRED',subject,applicability:null,body,data_use:null,note:''});
 for(const id of ['a','b','person','lab'])ir.entities.push({...meta(id),kind:id==='lab'?'ENVIRONMENT':id==='person'?'PERSON':'FILE',label:id,instance_scope:'ROOT',members:[]});
 ir.entities.push({...meta('group'),kind:'GROUP',label:'group',instance_scope:'ROOT',members:[en('a'),en('b')]});
 const addEvent=(id,kind='ACTION',operation='READ')=>ir.events.push({...meta(id),kind,label:id,owner_id:id==='root'?'root':'root',operation,operation_extent:'EXACT',actor_domain:'EXPLICIT',layer:'MAIN',use:'CURRENT_TASK',roles:[{role:'OBJECT',value:en('a'),source_refs:['s']},{role:'RECIPIENT',value:en('person'),source_refs:['s']},{role:'ENVIRONMENT',value:en('lab'),source_refs:['s']}]});
 addEvent('root','TASK');addEvent('work');addEvent('later');addEvent('seq','TEMPLATE');addEvent('stop','ACTION','STOP');
 const yes=e('yes','BOOLEAN',[],true),no=e('no','BOOLEAN',[],false),zero=e('zero','NUMBER',[],0),one=e('one','NUMBER',[],1),two=e('two','NUMBER',[],2),three=e('three','NUMBER',[],3);
 const sa=e('sa','SET',[en('a')]),sb=e('sb','SET',[en('b')]),group=e('members','GROUP_MEMBERS',[en('group')]),union=e('union','UNION',[sa,sb]),intersection=e('intersection','INTERSECTION',[group,sa]),difference=e('difference','DIFFERENCE',[group,sb]);
 const clauses=[e('seteq','EQ',[union,group]),e('intersectioneq','EQ',[intersection,sa]),e('differenceeq','EQ',[difference,sa]),e('subset','SUBSET',[sa,group]),e('member','MEMBER',[en('a'),group]),e('count','EQ',[e('card','CARDINALITY',[union]),two]),e('sum','EQ',[e('add','ADD',[one,two]),three])];
 for(const [op,a,b]of [['LT',one,two],['LTE',two,two],['GT',two,one],['GTE',two,two]])clauses.push(e(op,op,[a,b]));
 clauses.push(e('or','OR',[no,yes]),e('not','NOT',[no]),e('implies','IMPLIES',[no,no]),e('iff','IFF',[yes,yes]));
 const range=e('range','INTEGER_RANGE',[zero,two]);ir.variables.push({...meta('i'),label:'i',type:'INTEGER',binding_mode:'INSTANCE_LOCAL',scope_id:'ROOT',owner:ev('root'),domain:range});
 clauses.push(e('forall','FORALL',[range,e('bounded','MEMBER',[vr('i'),range])],null,null,vr('i')),e('exists','EXISTS',[range,e('one_exists','EQ',[vr('i'),one])],null,null,vr('i')));
 const domain=e('task_events','TASK_EVENTS',[ev('root')]);ir.variables.push({...meta('each'),label:'each',type:'EVENT',binding_mode:'INSTANCE_LOCAL',scope_id:'ROOT',owner:ev('root'),domain});
 clauses.push(e('allenv','FORALL',[domain,e('env_eq','EQ',[e('env','ENVIRONMENT_OF',[vr('each')]),en('lab')])],null,null,vr('each')));
 clauses.push(e('object_eq','EQ',[e('object','OBJECT_OF',[ev('work')]),en('a')]),e('recipient_eq','EQ',[e('recipient','RECIPIENT_OF',[ev('work')]),en('person')]));
 const instance=e('instance','EVENT_INSTANCE',[ev('seq'),one]),previous=e('previous','PREVIOUS_INSTANCE',[instance]);clauses.push(e('instance_happened','EVENT_OCCURRED',[instance]),e('previous_happened','EVENT_OCCURRED',[previous]));
 ir.states.push({...meta('pass'),label:'pass',kind:'SUCCESS',subject:ev('work'),arguments:[]});
 clauses.push(e('state','STATE_VALUE',[ref('STATE','pass')]),e('at','TRUE_AT_START',[ref('STATE','pass'),ev('later')]),e('before','BEFORE',[e('end','EVENT_END',[ev('work')]),e('start','EVENT_START',[ev('later')])]),e('state_order','LTE',[e('established','STATE_ESTABLISHED',[ref('STATE','pass')]),ex('start')]),e('immediate','IMMEDIATE_AFTER',[ref('STATE','pass'),ev('stop')]));
 const external=e('external','TASK_EXTERNAL_INPUTS',[ev('root')]);clauses.push(e('external_allowed','SUBSET',[external,sa]));
 for(const id of ['work','later','stop'])req('must_'+id,yes,ev(id),'EVENT_NORM');
 req('all',e('all_clauses','AND',clauses));
 const low=e('low','NUMBER',[],0,'min'),high=e('high','NUMBER',[],10,'min'),real=e('real','REAL_INTERVAL',[low,high],null,'min');ir.variables.push({...meta('q'),label:'q',type:'REAL',binding_mode:'OBSERVATION',scope_id:'ROOT',owner:ev('root'),domain:real});req('real_bound',e('real_member','MEMBER',[vr('q'),real]));
 const acceptance={technical_ok:true,source_links:[],diagnostics:[],rows:['entities','events','states','variables','expressions','requirements'].flatMap(k=>ir[k].map(n=>({id:n.id,status:'ACCEPTED'})))};
 const record=(id,start,end)=>({event_id:id,operation:id==='stop'?'STOP':'READ',owner_id:'root',occurred:true,start,end,roles:{OBJECT:en('a'),RECIPIENT:en('person'),ENVIRONMENT:en('lab')},external_inputs:[]});
 const observations={events:[record('work',0,1),record('later',2,3),record('stop',1,1.5),record('seq@0',0,1),record('seq@1',2,3)],states:{pass:{value:true,established_at:1}},quantities:{q:{value:3,unit:'min',target_id:'root'}},time_unit:'min',closed_world:{events:true,inputs:true}};
 return {ir,acceptance,observations};
}
test('all contract operators participate in one validated composite IR and both calculation paths',()=>{
 const {ir,acceptance,observations}=build();const checked=validateCandidateIR(ir,text);assert.equal(checked.ok,true,JSON.stringify(checked.errors));
 assert.deepEqual([...new Set(ir.expressions.map(x=>x.operator))].sort(),Object.keys(operators).sort());
 const calc=calculateDirectIR(ir,acceptance);assert.equal(calc.status,'CALCULATED',JSON.stringify(calc.gaps));assert.equal(calc.joint.base.result,'satisfiable');
 assert.ok(calc.counterexample_queries.some(q=>q.id.startsWith('reverse-order:')&&q.result==='unsatisfiable'));
 const obs=evaluateDirectObservations(ir,acceptance,observations);assert.equal(obs.status,'SATISFIED',JSON.stringify(obs));assert.deepEqual(obs.gaps,[]);
});
test('finite quantifier zero binding and set membership are checked against an independent arithmetic oracle',()=>{
 for(const limit of [-1,0,1,2,3]){const {ir,acceptance,observations}=build();ir.expressions.find(e=>e.id==='one').literal=limit;
  // Isolate the quantified question; unrelated event-instance constraints stay out of the requirements.
  ir.requirements=ir.requirements.filter(r=>r.id==='all');ir.requirements[0].body=ex('exists');
  const out=evaluateDirectObservations(ir,acceptance,observations);assert.equal(out.requirements[0].result,[0,1,2].includes(limit)?'SATISFIED':'VIOLATED');
 }
});
test('operator registry is exhaustive and carries limits rather than an unsupported universal completeness claim',()=>{
 const registry=operatorRegistry();assert.deepEqual(Object.keys(registry),Object.keys(operators));for(const row of Object.values(registry)){assert.ok(row.consumers.includes('direct-ir-observations.mjs'));assert.ok(row.limits.length);}
});
test('set operations and cardinality give the same positive and negative answers in static and observed paths',()=>{
 for(const expected of [0,1,2,3])for(const id of ['union','intersection','difference']){
  const {ir,acceptance,observations}=build();ir.requirements=[];
  ir.expressions.push({...meta('expected'),operator:'NUMBER',arguments:[],literal:expected,unit:null,bound_variable:null},{...meta('selected_count'),operator:'CARDINALITY',arguments:[ex(id)],literal:null,unit:null,bound_variable:null},{...meta('answer'),operator:'EQ',arguments:[ex('selected_count'),ex('expected')],literal:null,unit:null,bound_variable:null});
  ir.requirements.push({...meta('test_count'),kind:'CONSTRAINT',scope_id:'ROOT',modality:'REQUIRED',subject:ev('root'),body:ex('answer'),applicability:null});
  for(const id of ['expected','selected_count','answer','test_count'])acceptance.rows.push({id,status:'ACCEPTED'});
  const correct=expected===(id==='union'?2:1),c=calculateDirectIR(ir,acceptance),o=evaluateDirectObservations(ir,acceptance,observations);
  assert.equal(c.joint.base.result,correct?'satisfiable':'unsatisfiable',JSON.stringify(c.gaps));assert.equal(o.requirements[0].result,correct?'SATISFIED':'VIOLATED');
 }
});
test('invalid cross-kind duplicate identity is a technical finding, never a validator crash',()=>{
 const {ir}=build();ir.requirements[0].id='all_clauses';const out=validateCandidateIR(ir,text);assert.equal(out.ok,false);assert.ok(out.errors.some(e=>e.code==='DUPLICATE_ID'));
});
test('conditional input-set cardinality counts active distinct members, with no loss through set composition',()=>{
 for(const active of [false,true])for(const expected of [0,1,2]){
  const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='must_work');
  const add=(id,operator,args=[],literal=null)=>{ir.expressions.push({...meta(id),operator,arguments:args,literal,unit:null,bound_variable:null});acceptance.rows.push({id,status:'ACCEPTED'});return ex(id);};
  ir.states.push({...meta('trigger'),kind:'EXTERNAL',subject:null,arguments:[],label:'trigger'});acceptance.rows.push({id:'trigger',status:'ACCEPTED'});
  const gate=add('trigger_value','STATE_VALUE',[ref('STATE','trigger')]),fixed=active?gate:add('no_trigger','NOT',[gate]);
  const composed=add('composed','UNION',[ex('external'),add('empty','SET')]),card=add('active_count','CARDINALITY',[composed]);
  for(const [id,body]of [['fixed_trigger',fixed],['expected_count',add('count_matches','EQ',[card,add('expected_value','NUMBER',[],expected)])]]){ir.requirements.push({...meta(id),kind:'CONSTRAINT',scope_id:'ROOT',modality:'REQUIRED',subject:ev('root'),body,applicability:null});acceptance.rows.push({id,status:'ACCEPTED'});}
  ir.requirements.push({...meta('conditional_use'),kind:'DATA_USE',scope_id:'ROOT',modality:'REQUIRED',subject:ev('work'),body:ex('yes'),applicability:gate,data_use:{object:en('a'),consumer:ev('work'),producer:null,origin:'EXTERNAL',availability:'AT_USE'}});acceptance.rows.push({id:'conditional_use',status:'ACCEPTED'});
  observations.states.trigger={value:active};observations.events.find(r=>r.event_id==='work').external_inputs=active?[en('a')]:[];
  const out=calculateDirectIR(ir,acceptance),obs=evaluateDirectObservations(ir,acceptance,observations);
  assert.equal(out.joint.base.result,expected===Number(active)?'satisfiable':'unsatisfiable',JSON.stringify(out.gaps));
  assert.equal(obs.requirements.find(r=>r.requirement_id==='expected_count').result,expected===Number(active)?'SATISFIED':'VIOLATED');
 }
});
test('reviewed issue replacement is linked through both target identity and source, not arbitrary issue mutation',()=>{
 const {ir,acceptance}=build();const issue=(id,target,source)=>({id,targets:[ev(target)],source_refs:[source],kind:'EXPRESSION_GAP',field_path:'roles',alternatives:[],reason:'before'});
 ir.issues=[issue('linked','work','s'),issue('other_target','later','s'),issue('other_source','work','another-source')];
 const audit={issues:[{targets:[ev('work')],source_refs:['s']}],reviews:[]},technical={...acceptance,errors:[]};
 const permitted=revisionPermissions(ir,audit,technical);assert.deepEqual(permitted.replacements,['linked']);
 const patch={base_ir_sha256:sha256(JSON.stringify(ir)),contract_version:ir.contract_version,source_table:[],entities:[],variables:[],events:[],states:[],expressions:[],requirements:[],issues:[{...ir.issues[0],reason:'review correction'}],coverage:[],coverage_updates:[],removed_nodes:[]};
 assert.equal(applyIRPatch(ir,patch,{allowed_replacements:permitted.replacements}).ir.issues[0].reason,'review correction');
 patch.issues=[{...ir.issues[1],reason:'unrelated'}];assert.throws(()=>applyIRPatch(ir,patch,{allowed_replacements:permitted.replacements}),/PATCH_UNRELATED_REPLACEMENT/);
});

test('per-event policy and whole-trace checks share composite set, quantifier, arithmetic and modal semantics',()=>{
 for(const allowed of [true,false]){
  const {ir,acceptance,observations}=build();
  const add=(id,operator,args=[],literal=null)=>{ir.expressions.push({...meta(id),operator,arguments:args,literal,unit:null,bound_variable:null});return ex(id);};
  const member=add('environment_member','MEMBER',[ex('env'),add('allowed_envs','SET',[en(allowed?'lab':'a')])]);
  const body=add('composite_policy','AND',[member,ex('forall'),ex('sum'),ex('iff'),ex('seteq')]);
  ir.expressions.find(e=>e.id==='allenv').arguments[1]=body;
  ir.requirements=ir.requirements.filter(r=>r.id==='all');ir.requirements[0].body=ex('allenv');
  for(const x of ir.expressions)if(!acceptance.rows.some(r=>r.id===x.id))acceptance.rows.push({id:x.id,status:'ACCEPTED'});
  const record=observations.events[0],expected=allowed?'SATISFIED':'VIOLATED';
  assert.equal(evaluateDirectEventPolicies(ir,acceptance,record).results[0].result,expected);
  assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,expected);
  ir.requirements[0].applicability=ex('no');assert.equal(evaluateDirectEventPolicies(ir,acceptance,record).results[0].result,'NOT_APPLICABLE');
  ir.requirements[0].applicability=null;ir.requirements[0].modality='PERMITTED';assert.equal(evaluateDirectEventPolicies(ir,acceptance,record).results[0].result,'NOT_APPLICABLE');
  ir.requirements[0].modality='FORBIDDEN';assert.equal(evaluateDirectEventPolicies(ir,acceptance,record).results[0].result,'UNKNOWN'); // not(forall) is not forall(not)
 }
});

test('scalar role projection handles role aliases consistently and diagnoses plural values',()=>{
 const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');ir.requirements[0].body=ex('object_eq');
 const record=observations.events[0];delete record.roles.OBJECT;record.roles.DELIVERABLE=en('a');
 assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'SATISFIED');
 record.roles.OBJECT=en('b');const out=evaluateDirectObservations(ir,acceptance,observations);assert.equal(out.requirements[0].result,'UNKNOWN');assert.ok(out.gaps.some(g=>g.reason==='SINGLE_ROLE_VALUE_REQUIRED'));
});

test('indexed state observations preserve separate attempts and check the matching instance time',()=>{
 const {ir,acceptance,observations}=build();
 const indexed={...meta('attempt_pass'),label:'attempt pass',kind:'SUCCESS',subject:ex('instance'),arguments:[]};ir.states.push(indexed);
 const state=ref('STATE','attempt_pass');
 for(const x of [{...meta('attempt_ok'),operator:'STATE_VALUE',arguments:[state],literal:null,unit:null,bound_variable:null},{...meta('attempt_at'),operator:'TRUE_AT_START',arguments:[state,ev('later')],literal:null,unit:null,bound_variable:null}])ir.expressions.push(x);
 ir.requirements=ir.requirements.filter(r=>r.id==='all');ir.requirements[0].body=ex('attempt_at');
 for(const id of ['attempt_pass','attempt_ok','attempt_at'])acceptance.rows.push({id,status:'ACCEPTED'});
 observations.state_instances=[{state_id:'attempt_pass',subject:ev('seq@0'),value:true,established_at:0.5},{state_id:'attempt_pass',subject:ev('seq@1'),value:true,established_at:1.5}];
 assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'SATISFIED');
 observations.state_instances[1].established_at=2.5;assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'VIOLATED');
 observations.state_instances.pop();assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'UNKNOWN');
 observations.states.attempt_pass={value:true};assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'UNKNOWN');
 observations.state_instances.push({...observations.state_instances[0]});assert.throws(()=>evaluateDirectObservations(ir,acceptance,observations),/INVALID_DIRECT_IR_OBSERVATIONS/);
});

test('negated BEFORE constrains the reverse order and cannot coexist with strict forward order',()=>{
 const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
 for(const x of [{...meta('not_before'),operator:'NOT',arguments:[ex('before')],literal:null,unit:null,bound_variable:null},{...meta('also_before'),operator:'LT',arguments:[ex('end'),ex('start')],literal:null,unit:null,bound_variable:null},{...meta('contradiction'),operator:'AND',arguments:[ex('not_before'),ex('also_before')],literal:null,unit:null,bound_variable:null}]){ir.expressions.push(x);acceptance.rows.push({id:x.id,status:'ACCEPTED'});}
 ir.requirements[0].body=ex('contradiction');assert.equal(calculateDirectIR(ir,acceptance).joint.base.result,'unsatisfiable');assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'VIOLATED');
 ir.requirements[0].body=ex('not_before');const c=calculateDirectIR(ir,acceptance);assert.equal(c.status,'CALCULATED');assert.ok(c.joint.base.witness.order_rank['work:end']>=c.joint.base.witness.order_rank['later:start']);
 observations.events.find(e=>e.event_id==='later').start=1;assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,'SATISFIED');
});

test('Boolean equality composes arbitrary predicates rather than requiring Boolean literals',()=>{
 for(const expected of [true,false]){
  const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
  const x={...meta('predicate_equality'),operator:'EQ',arguments:[ex('member'),ex(expected?'yes':'no')],literal:null,unit:null,bound_variable:null};ir.expressions.push(x);acceptance.rows.push({id:x.id,status:'ACCEPTED'});ir.requirements[0].body=ex(x.id);
  assert.equal(calculateDirectIR(ir,acceptance).joint.base.result,expected?'satisfiable':'unsatisfiable');assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,expected?'SATISFIED':'VIOLATED');
 }
});

test('first-attempt guard excludes the nonexistent previous instance regardless of OR argument order',()=>{
 for(const reverse of [false,true]){
  const {ir,acceptance}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
  const add=(id,operator,args,bound_variable=null)=>{const x={...meta(id),operator,arguments:args,literal:null,unit:null,bound_variable};ir.expressions.push(x);acceptance.rows.push({id,status:'ACCEPTED'});return ex(id);};
  const current=add('current_attempt','EVENT_INSTANCE',[ev('seq'),vr('i')]),prev=add('previous_attempt','PREVIOUS_INSTANCE',[current]),happened=add('previous_occurred','EVENT_OCCURRED',[prev]),first=add('first_attempt','EQ',[vr('i'),ex('zero')]);
  const body=add('first_or_previous','OR',reverse?[happened,first]:[first,happened]),quant=add('retry_domain','FORALL',[ex('range'),body],vr('i'));
  ir.requirements[0].body=quant;const out=calculateDirectIR(ir,acceptance);assert.equal(out.status,'CALCULATED',JSON.stringify(out.gaps));
  assert.ok(!out.joint.base.witness.execution_trace.some(e=>e.event_id.includes('@-1')));
  // Without the first-attempt guard, the undefined index remains a specific gap.
  ir.expressions.find(e=>e.id==='first_or_previous').arguments=[ex('no'),happened];assert.ok(calculateDirectIR(ir,acceptance).gaps.some(g=>g.reason==='PREVIOUS_INSTANCE_OUTSIDE_SEQUENCE'));
 }
});

test('decimal ADD is exact in both consumers, including scientific notation and cancellation',()=>{
 for(const [numbers,total]of [[[0.1,0.2],0.3],[[1e-7,2e-7],3e-7],[[1e20,1,-1e20],1],[[0.3,-0.2],0.1]])for(const correct of [true,false]){
  const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
  const add=(id,operator,args=[],literal=null)=>{ir.expressions.push({...meta(id),operator,arguments:args,literal,unit:null,bound_variable:null});acceptance.rows.push({id,status:'ACCEPTED'});return ex(id);};
  const operands=numbers.map((n,i)=>add('decimal_'+i,'NUMBER',[],n));
  // Nest ADD to require exact values to survive intermediate terms.
  const inner=add('decimal_inner','ADD',operands.slice(0,2)),sum=operands.length===2?inner:add('decimal_sum','ADD',[inner,...operands.slice(2)]);
  ir.requirements[0].body=add('decimal_equal','EQ',[sum,add('decimal_expected','NUMBER',[],correct?total:total+1)]);
  assert.equal(calculateDirectIR(ir,acceptance).joint.base.result,correct?'satisfiable':'unsatisfiable');assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,correct?'SATISFIED':'VIOLATED');
 }
});

test('real bounds compose through Boolean conditions and independently verify the selected interval',()=>{
 for(const active of [false,true])for(const minimum of [0,5,10,11]){
  const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
  const add=(id,operator,args=[],literal=null,unit=null)=>{ir.expressions.push({...meta(id),operator,arguments:args,literal,unit,bound_variable:null});acceptance.rows.push({id,status:'ACCEPTED'});return ex(id);};
  const condition=add('conditional_real','IMPLIES',[ex(active?'yes':'no'),add('real_gt','GT',[vr('q'),add('limit','NUMBER',[],minimum,'min')])]);ir.requirements[0].body=condition;
  const out=calculateDirectIR(ir,acceptance),exists=!active||minimum<10;
  assert.equal(out.joint.base.result,exists?'satisfiable':'unsatisfiable',JSON.stringify(out.gaps));
  if(exists){const value=Number(out.joint.base.witness.intervals['numeric:0']);assert.ok(0<=value&&value<=10&&(!active||value>minimum));assert.ok(verifyJointWitness(out.problem,out.joint.base.witness).valid);}
  for(const value of [0,5,10]){observations.quantities.q.value=value;assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,!active||value>minimum?'SATISFIED':'VIOLATED');}
 }
});

test('negated real equality and disjoint real alternatives retain both sides of each predicate',()=>{
 const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
 const add=(id,operator,args=[],literal=null,unit=null)=>{ir.expressions.push({...meta(id),operator,arguments:args,literal,unit,bound_variable:null});acceptance.rows.push({id,status:'ACCEPTED'});return ex(id);};
 const n=add('mid','NUMBER',[],5,'min'),eq=add('real_eq','EQ',[vr('q'),n]),ne=add('real_ne','NOT',[eq]);
 ir.requirements[0].body=add('real_impossible','AND',[eq,ne]);assert.equal(calculateDirectIR(ir,acceptance).joint.base.result,'unsatisfiable');
 ir.requirements[0].body=ne;let out=calculateDirectIR(ir,acceptance);assert.equal(out.status,'CALCULATED');assert.notEqual(Number(out.joint.base.witness.intervals['numeric:0']),5);
 const bad=structuredClone(out.joint.base.witness);bad.intervals['numeric:0']='5';assert.equal(verifyJointWitness(out.problem,bad).valid,false);
 const low=add('under','LT',[vr('q'),add('two_min','NUMBER',[],2,'min')]),high=add('over','GT',[vr('q'),add('eight_min','NUMBER',[],8,'min')]);ir.requirements[0].body=add('disjoint','OR',[low,high]);
 out=calculateDirectIR(ir,acceptance);assert.equal(out.status,'CALCULATED');const chosen=Number(out.joint.base.witness.intervals['numeric:0']);assert.ok(chosen<2||chosen>8);
 for(const value of [0,2,5,8,10]){observations.quantities.q.value=value;assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,value<2||value>8?'SATISFIED':'VIOLATED');}
});

test('numeric interval membership handles computed literals and a real value restricted to an integer domain',()=>{
 const {ir,acceptance,observations}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');
 const add=(id,operator,args=[],literal=null,unit=null)=>{ir.expressions.push({...meta(id),operator,arguments:args,literal,unit,bound_variable:null});acceptance.rows.push({id,status:'ACCEPTED'});return ex(id);};
 const lo=add('low_min','NUMBER',[],0,'min'),hi=add('high_min','NUMBER',[],2,'min'),range=add('minutes_int','INTEGER_RANGE',[lo,hi],null,'min');
 ir.requirements[0].body=add('real_integer_membership','MEMBER',[vr('q'),range]);let out=calculateDirectIR(ir,acceptance);assert.equal(out.status,'CALCULATED');assert.ok([0,1,2].includes(Number(out.joint.base.witness.intervals['numeric:0'])));
 for(const value of [0,0.5,1,2,2.5]){observations.quantities.q.value=value;assert.equal(evaluateDirectObservations(ir,acceptance,observations).requirements[0].result,[0,1,2].includes(value)?'SATISFIED':'VIOLATED');}
 for(const value of [0,2,3]){const id='literal_'+value,number=add(id,'NUMBER',[],value,'min');ir.requirements[0].body=add('test_'+id,'MEMBER',[number,add('interval_'+id,'REAL_INTERVAL',[lo,hi],null,'min')]);assert.equal(calculateDirectIR(ir,acceptance).joint.base.result,value<=2?'satisfiable':'unsatisfiable');}
});

test('event-variable identity is the declared template instance, not the observation transport ID',()=>{
 const {ir,acceptance}=build();ir.requirements=ir.requirements.filter(r=>r.id==='all');ir.requirements[0].body=ex('allenv');
 ir.expressions.push({...meta('instance_identity'),operator:'EQ',arguments:[vr('each'),ex('instance')],literal:null,unit:null,bound_variable:null});acceptance.rows.push({id:'instance_identity',status:'ACCEPTED'});ir.expressions.find(e=>e.id==='allenv').arguments[1]=ex('instance_identity');
 for(const event_id of ['seq@1','transport-generated-id']){
  const record={event_id,template_id:'seq',instance:1,owner_id:'root'};assert.equal(evaluateDirectEventPolicies(ir,acceptance,record).results[0].result,'SATISFIED');
  record.instance=0;assert.equal(evaluateDirectEventPolicies(ir,acceptance,record).results[0].result,'VIOLATED');
 }
 assert.equal(evaluateDirectEventPolicies(ir,acceptance,{owner_id:'root'}).results[0].result,'UNKNOWN');
});
