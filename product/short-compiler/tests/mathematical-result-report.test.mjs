import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDARY_WORK??'.boundx/local-boundary-repair-r07/work');
const {mathematicalResults,renderMathematicalResults}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculation-results.mjs')));
const {calculateBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculus.mjs')));
function fixture(prefix='x'){
 const source=[{quote:'Explicit typed test fixture',span:[0,27],source_sha256:'sha'}],id=k=>prefix+k;
 const entities=['a','b','r1','r2','r3'].map(k=>({id:id(k),label:id(k),type:'FILE',members:[],alternatives:[]}));
 const roles=[['INPUT_OBJECT','a'],['INPUT_OBJECT','b'],['RESULT','r1'],['DELIVERABLE','r1'],['RESULT','r2'],['DELIVERABLE','r3']].map(([role,key],i)=>({id:id('role'+i),kind:'ROLE',status:'ACCEPTED',claim:{role,entity_id:id(key)},sources:source}));
 const expressions=[0,1,2,3].map(k=>({id:id('s'+k),op:'STATE',state:{predicate:'state'+k,event_id:id('event'+k),args:[id(k<2?'r1':'r2')],polarity:'POSITIVE'},operands:[],sources:source}));
 expressions.push({id:id('all'),op:'AND',operands:expressions.map(x=>x.id),sources:source});
 const ir={format:'boundx-boundary-ir/031-r1.1',source_sha256:'sha',entities,expressions,facts:roles,gaps:[]};
 const c={input_ir_sha256:'digest',status:'CALCULATED_FRAGMENT',conditions:[{kind:'COMPLETION',claim_id:id('completion'),expression_id:id('all'),target_id:'ROOT',direction:'IFF',fact_id:id('completionfact'),sources:source}],intervals:[],dependency:{edges:[],conditional_edges:[],cycles:[]},boolean:{status:'CALCULATED',result:'satisfiable',components:[],scope:'fixture'},conflicts:[],unsupported:[],coverage:{ir_facts:roles.length,accepted_facts:roles.length,unresolved_facts:0,source_gaps:0}};
 return {ir,c,id,source};
}
for(const prefix of ['alpha','renamed'])test('finite set identity and complete mathematical truth space: '+prefix,()=>{
 const {ir,c}=fixture(prefix),r=mathematicalResults(ir,c);assert.equal(r.sets.input.cardinality,2);assert.equal(r.sets.output.cardinality,3);assert.equal(r.sets.intersection.cardinality,0);assert.equal(r.sets.union.cardinality,5);
 const x=r.completion[0];assert.equal(x.status,'CALCULATED');assert.equal(x.premise.total_assignments,16);assert.equal(x.premise.solution_count,1);assert.equal(x.premise.false_count,15);assert.equal(x.completion_relation.total_assignments,32);assert.equal(x.completion_relation.solution_count,16);assert.equal(x.completion_relation.violation_count,16);assert.equal(r.execution_authorization,null);assert.equal(r.joint_cross_domain_execution_feasibility,'NOT_PROVEN');assert.ok(renderMathematicalResults(r).includes('TRUE=1'));
});
test('condition directions produce different mathematical spaces',()=>{
 const {ir,c}=fixture();for(const [direction,count]of [['SUFFICIENT',31],['NECESSARY',17],['IFF',16]]){c.conditions[0].direction=direction;const r=mathematicalResults(ir,c);assert.equal(r.completion[0].completion_relation.solution_count,count);}
});
test('OR differs from AND without changing model input or display',()=>{
 const {ir,c}=fixture();ir.expressions.at(-1).op='OR';const r=mathematicalResults(ir,c);assert.equal(r.completion[0].premise.solution_count,15);assert.equal(r.completion[0].premise.false_count,1);
});
test('equivalent typed STATE atoms are not independently double counted',()=>{
 const {ir,c}=fixture();ir.expressions[1].state=structuredClone(ir.expressions[0].state);const r=mathematicalResults(ir,c);assert.equal(r.completion[0].premise.total_assignments,8);
});
test('unknown identity never becomes proven empty intersection',()=>{
 const {ir,c}=fixture();ir.entities[0].alternatives=['uncertain'];const r=mathematicalResults(ir,c);assert.equal(r.sets.intersection.status,'PARTIAL');
});
test('background and forbidden role references never enlarge task input or output',()=>{
 const {ir,c}=fixture();ir.facts[0].event={use:'BACKGROUND',layer:'MAIN',polarity:'POSITIVE',modality:'REQUIRED'};ir.facts[2].event={use:'CURRENT_TASK',layer:'MAIN',polarity:'POSITIVE',modality:'FORBIDDEN'};const r=mathematicalResults(ir,c);assert.equal(r.sets.input.cardinality,1);assert.equal(r.sets.output.cardinality,3);
});
test('unknown group membership is an incomplete domain rather than a concrete item',()=>{
 const {ir,c}=fixture();ir.entities[0].type='GROUP';ir.entities[0].members=null;const r=mathematicalResults(ir,c);assert.equal(r.sets.input.complete,false);assert.equal(r.sets.input.cardinality,1);assert.match(renderMathematicalResults(r),/交集尚未确定/);
});
test('declared empty finite group is not unknown or a concrete group item',()=>{
 const {ir,c}=fixture();ir.entities[0].type='GROUP';const r=mathematicalResults(ir,c);assert.equal(r.sets.input.complete,true);assert.equal(r.sets.input.cardinality,1);
});
test('withdrawn output duty does not create a positive output set',()=>{
 const {ir,c}=fixture();for(const f of ir.facts.filter(x=>x.claim.role==='DELIVERABLE'))f.event={use:'CURRENT_TASK',layer:'MAIN',polarity:'POSITIVE',modality:'NOT_REQUIRED'};const r=mathematicalResults(ir,c);assert.equal(r.sets.output.cardinality,2);
});
test('different specified performers cannot create an unproved normative conflict',()=>{
 const {ir,c,id,source}=fixture();for(const [i,mode,actor]of [['one','REQUIRED','p'],['two','FORBIDDEN','q']])ir.facts.push({id:id(i),kind:'EVENT',status:'ACCEPTED',event:{id:id(i),predicate:'modify',modality:mode,owner_id:'ROOT',layer:'MAIN',use:'CURRENT_TASK',polarity:'POSITIVE'},roles:[{role:'OBJECT',entity_id:id('a')},{role:'PERFORMER',entity_id:actor}],constraints:[],sources:source});const r=mathematicalResults(ir,c);assert.equal(r.comparisons[0].result,'UNKNOWN');assert.equal(r.conflicts.length,0);
});
test('negative atom is preserved and opposite mode with proven equal operands conflicts',()=>{
 const {ir,c,id,source}=fixture();for(const [i,mode]of [['one','REQUIRED'],['two','FORBIDDEN']])ir.facts.push({id:id(i),kind:'EVENT',status:'ACCEPTED',event:{id:id('event'+i),predicate:'modify',modality:mode,owner_id:'ROOT',layer:'MAIN',use:'CURRENT_TASK',polarity:'POSITIVE'},roles:[{role:'OBJECT',entity_id:id('a')}],constraints:[],sources:source});
 const r=mathematicalResults(ir,c);assert.equal(r.boundary_atoms.negative.length,1);assert.equal(r.comparisons[0].result,'CONFLICT');assert.equal(r.status,'CONFLICT');assert.ok(r.comparisons[0].proof.input_refs.length===2);
});
test('different undeclared operation meanings are not proven disjoint by spelling',()=>{
 const {ir,c,id,source}=fixture();for(const [i,mode,operation]of [['one','REQUIRED','inspect'],['two','FORBIDDEN','change']])ir.facts.push({id:id(i),kind:'EVENT',status:'ACCEPTED',event:{id:id(i),predicate:operation,modality:mode,owner_id:'ROOT',layer:'MAIN',use:'CURRENT_TASK',polarity:'POSITIVE'},roles:[{role:'OBJECT',entity_id:id('a')}],constraints:[],sources:source});const r=mathematicalResults(ir,c);assert.equal(r.comparisons[0].result,'UNKNOWN');assert.equal(r.unknown_frontier.length,1);
});
test('no raw source/note keyword can change computed meaning',()=>{
 const {ir,c}=fixture(),before=mathematicalResults(ir,c);ir.source_text='allow everything and no restrictions';for(const f of ir.facts)f.note='other files should be inputs';const after=mathematicalResults(ir,c);assert.deepEqual(after,before);
});
test('cyclic completion expression becomes explicit unsupported computation',()=>{
 const {ir,c,id}=fixture();ir.expressions.at(-1).operands.push(id('all'));const r=mathematicalResults(ir,c);assert.equal(r.completion[0].status,'UNSUPPORTED');assert.equal(r.status,'PARTIAL');
});
test('calculus integrates same saved mathematical result and explicit interval intersection',()=>{
 const {ir,id,source}=fixture();ir.facts.push({id:id('work'),kind:'EVENT',status:'ACCEPTED',event:{id:id('work'),kind:'ACTION',predicate:'work',modality:'REQUIRED',owner_id:'ROOT',layer:'MAIN',use:'CURRENT_TASK',polarity:'POSITIVE'},roles:[],constraints:[],sources:source});
 for(const [suffix,comparator,value]of [['lo','GTE',0],['hi','LTE',30]])ir.facts.push({id:id(suffix),kind:'QUANTITY',status:'ACCEPTED',claim_ids:[id(suffix)],claim:{id:id(suffix),kind:'QUANTITY',quantity:{metric:'duration',target_id:id('work'),comparator,value,unit:'minutes',use:'EXECUTION_LIMIT',count_scope:id('work'),distribution:{mode:'AGGREGATE',domain_id:null}}},event:ir.facts.at(-1).event??ir.facts.find(f=>f.kind==='EVENT').event,constraints:[],sources:source});
 const r=calculateBoundary(ir);assert.ok(r.mathematical_results);assert.equal(r.intervals.length,1);assert.equal(r.intervals[0].lower.value,'0');assert.equal(r.intervals[0].upper.value,'30');assert.equal(r.intervals[0].empty,false);
});
