import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.env.BOUNDARY_WORK??'.boundx/local-boundary-repair-r05/work');
const {calculateBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/calculus.mjs')));
function fixture(prefix='x'){
 const a=prefix+'a',b=prefix+'b',s=prefix+'state',sha='source-digest',sources=[{source_sha256:sha,span:[0,20],quote:'First finish A; then B.'}];
 const event=id=>({id,kind:'ACTION',layer:'MAIN',use:'CURRENT_TASK',polarity:'POSITIVE',modality:'REQUIRED',owner_id:'ROOT'});
 const facts=[a,b].map(id=>({id:'fact:'+id,kind:'EVENT',event:event(id),status:id===a?'ACCEPTED':'UNRESOLVED',constraints:[],sources,claim_ids:[id]}));
 facts.push({id:'order',kind:'TEMPORAL',status:'ACCEPTED',event:event(b),claim:{id:'order-claim',kind:'TEMPORAL',event_id:b,expression_id:s,direction:'ORDER',temporal:'AFTER',scope_id:b},sources,claim_ids:['order-claim',s,b],relation_acceptance_is_not_event_acceptance:true,proof:{checks:[a,b].map(id=>({id,status:id===a?'ACCEPTED':'UNRESOLVED',errors:[],sources}))}});
 return {format:'boundx-boundary-ir/031-r1.1',source_sha256:sha,facts,entities:[],expressions:[{id:s,op:'STATE',operands:[],state:{predicate:'finished',event_id:a,args:[],polarity:'POSITIVE'}}],gaps:[]};
}
for(const name of ['alpha','different'])test('independent order retains a generic edge without certifying target execution: '+name,()=>{
 const ir=fixture(name),c=calculateBoundary(ir);assert.equal(c.dependency.edges.length,1);assert.equal(c.dependency.edges[0].to,name+'b');
 assert.equal(c.dependency.edges[0].ordering_is_not_execution_authorization,true);
 assert.ok(!c.boolean.atoms.some(x=>x.meaning.event_id===name+'b'));
 assert.equal(c.execution_authorization,null);assert.equal(c.status,'PARTIAL','unrelated uncertainty must remain visible');
});
for(const defect of ['missing','rejected','quoted','unproved'])test('invalid endpoint cannot enter order computation: '+defect,()=>{
 const ir=fixture(),f=ir.facts.find(f=>f.kind==='TEMPORAL');
 if(defect==='missing')ir.facts=ir.facts.filter(f=>f.event.id!=='xb'||f.kind==='TEMPORAL');
 if(defect==='rejected')ir.facts.find(f=>f.event.id==='xb'&&f.kind==='EVENT').status='REJECTED';
 if(defect==='quoted')ir.facts.find(f=>f.event.id==='xb'&&f.kind==='EVENT').event.layer='QUOTED';
 if(defect==='unproved')f.proof.checks=[];
 const c=calculateBoundary(ir);assert.equal(c.dependency.edges.length,0);assert.ok(c.unsupported.some(x=>x.reason.startsWith('ORDER_ENDPOINT')));
});
test('guarded parent is not promoted to unconditional activation',()=>{
 const ir=fixture(),child=ir.facts.find(f=>f.event?.id==='xb'&&f.kind==='EVENT');child.event.owner_id='parent';
 ir.facts.push({id:'parent-fact',kind:'EVENT',status:'ACCEPTED',event:{...child.event,id:'parent',owner_id:'ROOT'},constraints:[{kind:'CONDITION'}],sources:child.sources,claim_ids:['parent']});
 const c=calculateBoundary(ir);assert.equal(c.dependency.edges.length,0);
 assert.ok(c.unsupported.some(x=>x.reason==='ORDER_ENDPOINT_ACTIVATION_SCOPE_NOT_SUPPORTED'));
});
test('invalid member in a conjunctive predecessor creates no partial ordering edges',()=>{
 const ir=fixture(),order=ir.facts.find(f=>f.kind==='TEMPORAL');
 ir.expressions.push({id:'second-state',op:'STATE',operands:[],state:{predicate:'finished',event_id:'missing-member',args:[],polarity:'POSITIVE'}},{id:'both',op:'AND',operands:['xstate','second-state']});
 order.claim.expression_id='both';const c=calculateBoundary(ir);
 assert.equal(c.dependency.edges.length,0);assert.ok(c.unsupported.some(x=>x.reason==='ORDER_ENDPOINT_INVALID'));
});
