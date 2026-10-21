import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDX_INPUT_TEST_ROOT??'.boundx/unrestricted-input-ui19-work');
const {calculateBoundary,renderCalculations}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculus.mjs')));
const {technicalValidate}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/validate.mjs')));
const {compileBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/compile.mjs')));
const sha='0'.repeat(64),source={quote:'人工构造的无模型计算对照',occurrence:1,span:[0,13],source_sha256:sha};
const fact=(id,kind,data)=>({id,kind,status:'ACCEPTED',claim_ids:[id],sources:[source],...data});
const event=(id,modality='REQUIRED',constraints=[])=>fact(id,'EVENT',{event:{id,predicate:id,kind:'ACTION',use:'CURRENT_TASK',layer:'MAIN',polarity:'POSITIVE',owner_id:'ROOT',modality},constraints});
const state=(id,predicate,event_id=null,polarity='POSITIVE')=>({id,op:'STATE',state:{predicate,event_id,args:[],polarity},operands:[]});
const quantity=(id,cmp,value,unit='minutes',target='work')=>fact(id,'QUANTITY',{claim:{id,kind:'QUANTITY',quantity:{metric:'duration',target_id:target,comparator:cmp,value,unit,use:'EXECUTION_LIMIT',count_scope:'ROOT'}},constraints:[],event:{owner_id:'ROOT'}});
const condition=(id,expression_id,direction='NECESSARY',event_id='work',temporal=null)=>fact(id,'CONDITION',{claim:{id,kind:'CONDITION',event_id,scope_id:event_id,expression_id,direction,temporal}});
const ir=(facts=[],expressions=[])=>({format:'boundx-boundary-ir/031-r1.1',source_sha256:sha,facts,expressions,entities:[],artifact_dependencies:[],gaps:[],business_decision:null,execution_authorization:null});

test('required event with an impossible necessary condition produces UNSAT from existing Core, with provenance',()=>{
 const c=condition('c','impossible'),i=ir([event('work','REQUIRED',[c.claim]),c],[state('a','approved'),state('not-a','approved',null,'NEGATIVE'),{id:'impossible',op:'AND',operands:['a','not-a']}]);
 const result=calculateBoundary(i);assert.equal(result.boolean.result,'unsatisfiable');assert.equal(result.status,'CONFLICT');
 assert.ok(result.boolean.formulas.every(f=>f.sources[0].source_sha256===sha));assert.equal(result.execution_authorization,null);assert.equal(result.business_decision,null);
});
test('sufficient conditional obligation does not become unconditional required execution',()=>{
 const c=condition('c','a','SUFFICIENT'),r=calculateBoundary(ir([event('work','REQUIRED',[c.claim]),c],[state('a','risk')]));
 assert.equal(r.boolean.result,'satisfiable');assert.equal(r.boolean.witness[r.boolean.atoms.find(x=>x.meaning.kind==='EVENT_EXECUTED').id],false);
 assert.equal(r.conditions[0].condition_value,'UNKNOWN');assert.equal(r.conditions[0].sufficient_trigger,'UNKNOWN');
});
test('permission does not become an obligation; unsupported conditional prohibition is explicit',()=>{
 const c=condition('c','a','SUFFICIENT');let r=calculateBoundary(ir([event('work','PERMITTED',[c.claim]),c],[state('a','approved')]));
 assert.equal(r.boolean.result,null);assert.ok(r.unsupported.some(x=>x.reason==='PERMISSION_IS_NOT_REQUIRED_EXECUTION'));
 const necessary=condition('n','a','NECESSARY');r=calculateBoundary(ir([event('work','FORBIDDEN',[necessary.claim]),necessary],[state('a','approved')]));assert.ok(r.unsupported.some(x=>x.reason==='CONDITIONAL_PROHIBITION_DIRECTION_NOT_SUPPORTED'));
});
test('quote and withdrawn obligation cannot contribute business execution formulas; owned activation is not flattened',()=>{
 const quote=event('quote');quote.event.layer='QUOTED';quote.event.use='MENTION_ONLY';
 const withdrawn=event('withdrawn','NOT_REQUIRED'),owned=event('owned');owned.event.owner_id='phase';
 const r=calculateBoundary(ir([quote,withdrawn,owned]));assert.equal(r.boolean.formulas.length,0);assert.equal(r.status,'PARTIAL');assert.ok(r.unsupported.some(x=>x.reason==='OWNED_EVENT_ACTIVATION_SCOPE_NOT_SUPPORTED'));
});
test('more than 12 independent obligations use unchanged bounded Core per independent component',()=>{
 const r=calculateBoundary(ir(Array.from({length:40},(_,i)=>event('event-'+i))));assert.equal(r.boolean.result,'satisfiable');assert.equal(r.boolean.components.length,40);assert.equal(r.boolean.formulas.length,40);
});
test('a connected Boolean fragment beyond Core capacity remains unsupported, never passed',()=>{
 const states=Array.from({length:13},(_,i)=>state('a'+i,'state'+i)),c=condition('c','all','SUFFICIENT');
 const r=calculateBoundary(ir([event('work','REQUIRED',[c.claim]),c],[...states,{id:'all',op:'AND',operands:states.map(s=>s.id)}]));assert.equal(r.boolean.status,'PARTIAL');assert.equal(r.boolean.result,null);assert.equal(r.status,'PARTIAL');
});
test('interval contradiction, strict endpoints, decimal comparison and target/unit separation come from existing Core',()=>{
 let r=calculateBoundary(ir([quantity('lo','GT',30),quantity('hi','LTE',30)]));assert.equal(r.intervals[0].empty,true);assert.equal(r.status,'CONFLICT');
 r=calculateBoundary(ir([quantity('lo','GTE',0.1),quantity('hi','LTE',0.2),quantity('other','EQ',999,'seconds'),quantity('target','EQ',999,'minutes','another')]));assert.equal(r.intervals.length,3);assert.ok(r.intervals.every(x=>!x.empty));assert.equal(r.quantities[0].result,'UNKNOWN');
 r=calculateBoundary(ir([quantity('a','LTE',30)]),{quantities:{a:{value:31,unit:'minutes',target_id:'work',count_scope:'ROOT'}}});assert.equal(r.quantities[0].result,'FALSE');
 r=calculateBoundary(ir([quantity('a','LTE',30)]),{quantities:{a:{value:1,unit:'seconds',target_id:'work',count_scope:'ROOT'}}});assert.equal(r.quantities[0].result,'UNKNOWN');
});
test('opposite branch quantities are not intersected as global simultaneous constraints',()=>{
 const a=quantity('a','LTE',20),b=quantity('b','GTE',30);a.constraints=[{kind:'CONDITION',expression_id:'risk',direction:'SUFFICIENT'}];b.constraints=[{kind:'CONDITION',expression_id:'safe',direction:'SUFFICIENT'}];
 const r=calculateBoundary(ir([a,b]));assert.equal(r.intervals.length,2);assert.ok(r.intervals.every(x=>!x.empty));
});
test('explicit conjunctive order edges detect cycles; OR and sufficient-trigger order are not flattened',()=>{
 const a=condition('a-order','b-end','ORDER','a','AFTER'),b=condition('b-order','a-end','ORDER','b','AFTER');
 let r=calculateBoundary(ir([event('a'),event('b'),a,b],[state('a-end','done','a'),state('b-end','done','b')]));assert.equal(r.dependency.cycles.length,1);assert.equal(r.status,'CONFLICT');
 const alternative=condition('alt','either','ORDER','b','AFTER');r=calculateBoundary(ir([event('a'),event('b'),alternative],[state('a-end','done','a'),state('b-end','done','b'),{id:'either',op:'OR',operands:['a-end','b-end']}]));assert.equal(r.dependency.edges.length,0);assert.ok(r.unsupported.length);
 const conditional=condition('cond','a-end','SUFFICIENT','b','AFTER');r=calculateBoundary(ir([event('a'),event('b'),conditional],[state('a-end','done','a')]));assert.equal(r.dependency.edges.length,0);assert.equal(r.dependency.conditional_edges.length,1);
 const quoted=event('a');quoted.event.use='MENTION_ONLY';quoted.event.layer='QUOTED';
 r=calculateBoundary(ir([quoted,event('b'),a,b],[state('a-end','done','a'),state('b-end','done','b')]));assert.equal(r.dependency.edges.length,0);assert.equal(r.dependency.cycles.length,0);assert.ok(r.unsupported.some(x=>x.reason==='ORDER_ENDPOINT_ACTIVATION_SCOPE_NOT_SUPPORTED'));
});
test('finite sets and exceptions preserve members; range exclusion is not execution permission',()=>{
 const expr=[{id:'a',op:'ITEM',operands:['file-a']},{id:'b',op:'ITEM',operands:['file-b']},{id:'both',op:'UNION',operands:['a','b']},{id:'except',op:'EXCEPT',operands:['both','b']}];
 const f=fact('scope','SCOPE',{claim:{id:'scope',scope_id:'work',expression_id:'except'}}),r=calculateBoundary(ir([f],expr));assert.deepEqual(r.ranges[0].members,['file-a']);assert.equal(r.ranges[0].execution_authorization,null);
});
test('artifact availability remains UNKNOWN without specific observations and never implies full event completion',()=>{
 const i=ir();i.artifact_dependencies=[{id:'dep',artifact_id:'report',producer_event_id:'make',consumer_event_id:'review',availability:'USED_PORTION',eligible:true,status:'ACCEPTED',sources:[source],input_claim_ids:['claim']}];
 let r=calculateBoundary(i);assert.equal(r.availability[0].result,'UNKNOWN');assert.equal(r.availability[0].implies_event_order,false);assert.equal(r.dependency.edges.length,0);
 r=calculateBoundary(i,{artifacts:{dep:{artifact_id:'report',producer_event_id:'make',used_portion_available:true,complete_result_available:false}}});assert.equal(r.availability[0].result,'TRUE');
});
test('source gaps and unresolved IR facts cannot be hidden by satisfiable local calculations',()=>{
 const i=ir([event('good'),{...event('uncertain'),status:'UNRESOLVED'}]);i.gaps=[{id:'gap'}];const r=calculateBoundary(i);assert.equal(r.boolean.result,'satisfiable');assert.equal(r.status,'PARTIAL');assert.equal(r.coverage.source_gaps,1);assert.equal(r.coverage.unresolved_facts,1);
});
test('same saved real response replays unchanged IR/7+1 and adds real program calculations, not new LLM acceptance',()=>{
 const prior=JSON.parse(fs.readFileSync('.boundx/exports/COMPACT-SEMANTIC-INTERFACE-r06/SKILL/trace.json'));
 const checks=technicalValidate(prior.source,prior.proposal,prior.audit),compiled=compileBoundary(prior.source,prior.proposal,prior.audit,checks);
 assert.deepEqual(compiled.ir,prior.ir);assert.deepEqual(compiled.canonical,prior.canonical);
 const before=JSON.stringify(compiled.ir),r=calculateBoundary(compiled.ir);assert.equal(JSON.stringify(compiled.ir),before);assert.equal(r.source_sha256,prior.source.sha256);assert.ok(r.boolean.formulas.length);assert.ok(renderCalculations(r).includes('程序边界计算'));
});
