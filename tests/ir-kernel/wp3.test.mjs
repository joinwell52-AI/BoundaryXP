import test from 'node:test';import assert from 'node:assert/strict';
import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {queryCore,refinement} from '../../src/bxp/ir-kernel/queries.mjs';import {inferQueryCapability} from '../../src/bxp/ir-kernel/capabilities.mjs';import {verifyModel} from '../../src/bxp/ir-kernel/verify-model.mjs';import {solve} from '../../src/bxp/ir-kernel/backends/z3-adapter.mjs';import {expr,variable,req,E,V} from './fixtures.mjs';
import {v2,plan,callsIR} from './domain-fixtures.mjs';
function bounded(){
 const i=v2();i.expressions.push(expr('lo','NUMBER',[],'0'),expr('hi','NUMBER',[],'10'),expr('domain','INTEGER_RANGE',[E('lo'),E('hi')]),expr('cap','NUMBER',[],'3'),expr('admin','LTE',[V('n'),E('cap')]),expr('four','NUMBER',[],'4'),expr('fourEq','EQ',[V('n'),E('four')]),expr('two','NUMBER',[],'2'),expr('twoEq','EQ',[V('n'),E('two')]));i.variables.push(variable('n','INTEGER',E('domain')));i.requirements.push(req('A',E('admin')),req('P4',E('fourEq')),req('P2',E('twoEq')));return compileCore(i);
}
test('K15/K17 joint integer solve and independent tampered-model rejection',async()=>{
 const c=bounded(),r=await queryCore(c,{requirements:['A','P2']});assert.equal(r.result,'SAT');assert.equal(r.verification,'MODEL_CHECKED');
 const bad={...r.model};const key=Object.keys(r.problem.declarations).find(k=>r.problem.declarations[k].meaning.id==='n');bad[key]='4';
 assert.equal(verifyModel(c.core,r.problem,bad).valid,false);assert.match(r.smtlib,/check-sat-assuming/);
 const broken=inferQueryCapability(c.core,{requirements:['A','P4']}).problem;broken.assertions=broken.assertions.filter(a=>a.id!=='req:A');const missed=await solve(broken);assert.equal(missed.result,'SAT');assert.equal(verifyModel(c.core,broken,missed.model).valid,false);
});
test('K18 UNSAT core is backend evidence, not certificate; exact rationals strict endpoints',async()=>{
 const c=bounded(),r=await queryCore(c,{requirements:['A','P4']});assert.equal(r.result,'UNSAT');assert.equal(r.verification,'BACKEND_RESULT');assert.ok(r.conflict_core.length);
 const i=v2();i.expressions.push(expr('lo','NUMBER',[],'1/3','second'),expr('hi','NUMBER',[],'2/3','second'),expr('domain','REAL_INTERVAL',[E('lo'),E('hi')]),expr('greater','GT',[V('t'),E('lo')]),expr('less','LT',[V('t'),E('hi')]));i.variables.push(variable('t','REAL',E('domain')));i.requirements.push(req('g',E('greater')),req('l',E('less')));
 const t=await queryCore(compileCore(i));assert.equal(t.result,'SAT');assert.equal(t.verification,'MODEL_CHECKED');
});
test('K16/K19 open domains unsupported, complete fourth call not truncated',async()=>{
 const c=compileCore(callsIR());assert.equal(inferQueryCapability(c.core,{}).status,'UNSUPPORTED');
 const events=Array.from({length:4},(_,i)=>({id:'fresh'+i,task_id:'task',operation:'INVOKE',occurred:true,roles:[{role:'PERFORMER',value:{kind:'ENTITY',id:'worker1'}},{role:'OBJECT',value:{kind:'ENTITY',id:'tool'}}]}));
 const r=await queryCore(c,{plan:plan(events)});assert.equal(r.result,'UNSAT');assert.equal(r.query_scope.events.length,4);
});
test('K24 refinement first checks P then P and not A; both escape and inclusion',async()=>{
 const c=bounded();let r=await refinement(c,{planRequirements:['P4'],adminRequirements:['A']});assert.equal(r.result,'SAT');assert.equal(r.model_check.valid,true);assert.equal(r.meaning,'COUNTEREXAMPLE');
 r=await refinement(c,{planRequirements:['P2'],adminRequirements:['A']});assert.equal(r.result,'UNSAT');assert.equal(r.meaning,'PLAN_IMPLIES_ADMIN_WITHIN_SCOPE');
 r=await refinement(c,{planRequirements:['P2','P4'],adminRequirements:['A']});assert.equal(r.result,'INFEASIBLE_PLAN');
});
test('K25 child-process cancellation/capacity are not UNSAT; clean recovery',async()=>{
 const p=inferQueryCapability(bounded().core,{requirements:['A']}).problem;
 const controller=new AbortController();const pending=solve(p,{signal:controller.signal});controller.abort();assert.equal((await pending).reason,'CANCELLED');
 const timeout=await solve(p,{wallMs:1});assert.equal(timeout.result,'UNKNOWN');assert.equal(timeout.reason,'RESOURCE_LIMIT_WALL_TIME');assert.equal(timeout.worker_exited,true);
 const result=await solve(p);assert.equal(result.result,'SAT');assert.equal(result.worker_exited,true);
 assert.equal(inferQueryCapability(bounded().core,{requirements:['A'],maxTerms:1}).status,'RESOURCE_LIMIT');
});
