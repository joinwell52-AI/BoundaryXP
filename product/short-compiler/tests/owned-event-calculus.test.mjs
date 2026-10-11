import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDX_INPUT_TEST_ROOT??'.boundx/owned-event-calculus-r01/work');
const load=f=>import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028',f)));
const {calculateBoundary}=await load('calculus.mjs');
const {compileBoundary}=await load('compile.mjs'),{technicalValidate}=await load('validate.mjs');
const sha='a'.repeat(64),source={quote:'Synthetic accepted ownership evidence',occurrence:1,span:[0,36],source_sha256:sha};
const fact=(id,kind,extra={})=>({id:'fact:'+id,kind,status:'ACCEPTED',claim_ids:[id],sources:[source],...extra});
const event=(id,owner='ROOT',extra={})=>fact(id,'EVENT',{event:{id,predicate:id,kind:'ACTION',use:'CURRENT_TASK',layer:'MAIN',polarity:'POSITIVE',modality:'REQUIRED',owner_id:owner,...extra},constraints:[]});
const state=(id,event_id)=>({id,op:'STATE',operands:[],state:{predicate:'observed state',event_id,args:[],polarity:'POSITIVE'}});
const condition=(id,event_id,expression_id,direction='ORDER',temporal='AFTER')=>fact(id,'CONDITION',{claim:{id,kind:'CONDITION',event_id,scope_id:event_id,expression_id,direction,temporal}});
const ir=(facts=[],expressions=[])=>({format:'boundx-boundary-ir/031-r1.1',source_sha256:sha,facts,expressions,entities:[],artifact_dependencies:[],gaps:[]});
const executedIds=r=>r.boolean.atoms.filter(x=>x.meaning.kind==='EVENT_EXECUTED').map(x=>x.meaning.event_id);

test('An accepted unconditional container preserves descendant local obligations without inventing parent-completion order',()=>{
 const r=calculateBoundary(ir([event('container'),event('action','container')]));
 assert.equal(r.status,'CALCULATED_FRAGMENT');assert.deepEqual(new Set(executedIds(r)),new Set(['container','action']));
 assert.equal(r.dependency.prerequisite_edges,0);assert.equal(r.dependency.conditional_edges.length,0);
 const f=r.boolean.formulas.find(x=>x.claim_ids.includes('action'));assert.deepEqual(f.ownership_paths[0].path,['action','container','ROOT']);
 assert.deepEqual(f.ownership_paths[0].evidence.map(x=>x.fact_id),['fact:action','fact:container']);
 assert.ok(f.ownership_paths[0].evidence.every(x=>x.sources[0].source_sha256===sha));
});
for(const [name,predicates] of [['English',['audit','inspect','write']],['Chinese',['整体核验','局部检查','编制']]])test('Three-layer ownership and renamed predicates preserve the same local rules: '+name,()=>{
 const r=calculateBoundary(ir([event('outer','ROOT',{predicate:predicates[0]}),event('inner','outer',{predicate:predicates[1]}),event('leaf','inner',{predicate:predicates[2]})]));
 assert.equal(r.status,'CALCULATED_FRAGMENT');assert.equal(r.boolean.formulas.length,3);assert.deepEqual(r.boolean.formulas.find(x=>x.claim_ids.includes('leaf')).ownership_paths[0].path,['leaf','inner','outer','ROOT']);
 assert.equal(r.dependency.edges.length,0);
});
test('Explicit two-predecessor conjunction survives owned endpoints with individual provenance',()=>{
 const c=condition('order','target','both'),r=calculateBoundary(ir([event('parent'),event('left','parent'),event('right','parent'),event('target','parent'),c],[state('ls','left'),state('rs','right'),{id:'both',op:'AND',operands:['ls','rs']}]));
 assert.deepEqual(r.dependency.edges.map(x=>[x.from,x.to]),[['left','target'],['right','target']]);
 assert.ok(r.dependency.edges.every(x=>x.expression_id==='both'&&x.ownership_paths.length===2&&x.ownership_paths.every(p=>p.supported&&p.evidence.length===2)));
 assert.equal(r.unsupported.length,0);
});
test('Sufficient conditional child keeps its trigger and never gains an unconditional execution formula',()=>{
 const c=condition('when','child','trigger','SUFFICIENT',null),child=event('child','parent');child.constraints=[c.claim];
 const r=calculateBoundary(ir([event('parent'),child,c],[state('trigger',null)]));
 const formulas=r.boolean.formulas.filter(x=>x.claim_ids.includes('child')||x.claim_ids.includes('when'));
 assert.equal(formulas.length,1);assert.ok(formulas[0].formula.implies);assert.equal(formulas[0].rule,'EXPLICIT_SUFFICIENT_TRANSITION');
 assert.equal(r.conditions[0].condition_value,'UNKNOWN');assert.equal(r.dependency.edges.length,0);
});
test('Conditional temporal descendants retain guarded edges rather than entering unconditional cycle detection',()=>{
 const c=condition('when','target','prior','SUFFICIENT','AFTER'),target=event('target','parent');target.constraints=[c.claim];
 const r=calculateBoundary(ir([event('parent'),event('before','parent'),target,c],[state('prior','before')]));
 assert.equal(r.dependency.edges.length,0);assert.equal(r.dependency.conditional_edges.length,1);assert.equal(r.dependency.conditional_edges[0].direction,'SUFFICIENT');
});
test('Explicit cycle between owned events is detected by the existing dependency Core',()=>{
 const r=calculateBoundary(ir([event('parent'),event('left','parent'),event('right','parent'),condition('lr','right','l'),condition('rl','left','r')],[state('l','left'),state('r','right')]));
 assert.equal(r.status,'CONFLICT');assert.equal(r.dependency.cycles.length,1);
});
for(const [name,parent]of [['permitted',event('parent','ROOT',{modality:'PERMITTED'})],['withdrawn',event('parent','ROOT',{modality:'NOT_REQUIRED'})],['quoted',event('parent','ROOT',{layer:'QUOTED',use:'MENTION_ONLY'})],['state container',event('parent','ROOT',{kind:'STATE'})]])test('Unsupported '+name+' ancestor cannot silently activate a child',()=>{
 const r=calculateBoundary(ir([parent,event('child','parent')]));assert.ok(!executedIds(r).includes('child'));assert.equal(r.status,'PARTIAL');assert.ok(r.unsupported.some(x=>x.claim_ids.includes('child')));
});
test('A guarded ancestor is not guessed to apply globally or to all descendants',()=>{
 const c=condition('guard','parent','trigger','SUFFICIENT',null),parent=event('parent');parent.constraints=[c.claim];
 const r=calculateBoundary(ir([parent,event('child','parent'),c],[state('trigger',null)]));
 assert.ok(!executedIds(r).includes('child'));assert.ok(r.unsupported.some(x=>x.detail==='OWNER_GUARDED_ACTIVATION_NOT_SUPPORTED'));
});
test('Missing and unaccepted parents remain accountable, with no fallback to ROOT',()=>{
 for(const parents of [[],[{...event('parent'),status:'UNRESOLVED'}]]){
  const r=calculateBoundary(ir([...parents,event('child','parent')]));assert.ok(!executedIds(r).includes('child'));assert.ok(r.unsupported.some(x=>x.detail==='OWNER_NOT_ACCEPTED'));
 }
});
test('Owner cycles and missing source provenance cannot manufacture local obligations',()=>{
 let r=calculateBoundary(ir([event('a','b'),event('b','a')]));assert.equal(r.boolean.formulas.length,0);assert.ok(r.unsupported.some(x=>x.detail==='OWNER_CYCLE'));
 r=calculateBoundary(ir([{...event('parent'),sources:[]},event('child','parent')]));assert.ok(!executedIds(r).includes('child'));assert.ok(r.unsupported.some(x=>x.detail==='OWNER_PROVENANCE_MISSING'));
});
test('OR alternatives and negative states do not become unconditional ordering edges',()=>{
 for(const expr of [{id:'choice',op:'OR',operands:['ls','rs']},{id:'choice',op:'NOT',operands:['ls']}]){
  const r=calculateBoundary(ir([event('p'),event('l','p'),event('r','p'),event('t','p'),condition('c','t','choice')],[state('ls','l'),state('rs','r'),expr]));
  assert.equal(r.dependency.edges.length,0);assert.ok(r.unsupported.some(x=>x.reason==='ORDER_ENDPOINT_NOT_UNIQUE_CONJUNCTIVE_EVENT'));
 }
});
test('Local child prohibition remains negative; local permission gains no execution obligation',()=>{
 const r=calculateBoundary(ir([event('parent'),event('denied','parent',{modality:'FORBIDDEN'}),event('optional','parent',{modality:'PERMITTED'})]));
 const target=r.boolean.atoms.find(x=>x.meaning.event_id==='denied');assert.ok(r.boolean.formulas.some(x=>x.formula.not?.var===target.id));
 assert.ok(!r.boolean.formulas.some(x=>x.claim_ids.includes('optional')));assert.equal(r.execution_authorization,null);
});
test('Explicit cross-container order may use validated paths, while ownership alone creates none',()=>{
 const r=calculateBoundary(ir([event('p1'),event('p2'),event('a','p1'),event('b','p2'),condition('order','b','a-state')],[state('a-state','a')]));
 assert.equal(r.dependency.edges.length,1);assert.deepEqual(r.dependency.edges[0].ownership_paths.map(x=>x.path),[['a','p1','ROOT'],['b','p2','ROOT']]);
});
test('Core-backed finite membership queries keep unresolved identity UNKNOWN and issue no permission',()=>{
 const g=ir([fact('range','SCOPE',{claim:{id:'range',scope_id:'action',expression_id:'members'}})],[{id:'one',op:'ITEM',operands:['x']},{id:'two',op:'ITEM',operands:['y']},{id:'members',op:'UNION',operands:['one','two']}]);g.entities=['x','y','z'].map(id=>({id,type:'FILE'}));
 const queries=[{id:'x',target_id:'x',identity_known:true},{id:'y',target_id:'y',identity_known:true},{id:'z',target_id:'z',identity_known:true},{id:'u',target_id:'missing',identity_known:true},{id:'v',target_id:'x',identity_known:false}];
 const r=calculateBoundary(g,{range_queries:{range:queries}});assert.deepEqual(r.ranges[0].membership_queries.map(x=>x.result),['TRUE','TRUE','FALSE','UNKNOWN','UNKNOWN']);
 assert.ok(r.ranges[0].membership_queries.every(x=>x.execution_authorization===null));
});
test('The frozen real candidate and review compile into identical IR and 7+1; only generic calculation changes',()=>{
 const prior=JSON.parse(fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001-standard-r01/actual/ui36/trace.json'));
 const checks=technicalValidate(prior.source,prior.proposal,prior.audit),compiled=compileBoundary(prior.source,prior.proposal,prior.audit,checks),before=JSON.stringify(compiled.ir);
 assert.deepEqual(compiled.ir,prior.ir);assert.deepEqual(compiled.canonical,prior.canonical);const r=calculateBoundary(compiled.ir);
 assert.equal(JSON.stringify(compiled.ir),before);assert.equal(r.status,'CALCULATED_FRAGMENT');assert.equal(r.unsupported.length,0);assert.equal(r.dependency.edges.length,2);assert.equal(r.dependency.conditional_edges.length,2);
 assert.ok(r.conditions.every(x=>x.condition_value==='UNKNOWN'));assert.equal(r.quantities[0].result,'UNKNOWN');assert.ok(r.availability.every(x=>x.result==='UNKNOWN'));
 assert.equal(r.coverage.full_bxp_conformance,'NOT_PROVEN');assert.equal(r.execution_authorization,null);
});
