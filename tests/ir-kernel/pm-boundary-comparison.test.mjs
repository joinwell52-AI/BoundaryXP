import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compare002} from '../../scripts/compare-ui99-002-plans.mjs';
import {boundaryFixture} from './boundary-rules-fixture.mjs';
import {lowerBoundaryRules} from '../../research/7plus1-parser/llm-first-028/boundary-rules.mjs';
import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';
import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';
import {compareRetryAllocations} from '../../src/bxp/ir-kernel/plan-budget.mjs';
const wire=JSON.parse(fs.readFileSync(new URL('./fixtures/ui99-002-boundary.json',import.meta.url),'utf8'));
test('actual ui99 response: six PM contrasts and four controls; original model omission retained',()=>{
 const before=JSON.stringify(wire),r=compare002(wire);assert.equal(r.rows.length,10);for(const x of r.rows)assert.equal(x.actual.result,x.expected,x.id);
 assert.equal(JSON.stringify(wire),before);assert.equal(wire.actions.find(a=>a.id==='delex').roles.some(r=>r.role==='PERFORMER'),false);
 assert.equal(r.output_projection.length,4);assert.ok(r.output_projection.every(r=>r.kind==='EVENT_NORM'&&['CREATE','DELIVER'].includes(r.operation)&&r.modality!=='NOT_REQUIRED'));
});
test('actor matching respects operation, never borrows parent organizer or recipient as performer',()=>{
 const {ir}=lowerBoundaryRules(boundaryFixture());ir.expressions.push({id:'actor_query',source_refs:['s'],operator:'ACTORS_OF',arguments:[{kind:'EVENT',id:'review'}],literal:null,unit:null,bound_variable:null});
 const core=compileCore(ir).core;
 const q=(operation,role)=>evaluateCore(core,{kind:'EXPRESSION',id:'actor_query'},{plan:{events:[{id:'review',task_id:'task',operation,roles:[{role,value:{kind:'ENTITY',id:'qa'}}]}]}});
 assert.deepEqual(q('REVIEW','REVIEWER'),{set:[{object:'qa'}]});assert.deepEqual(q('ORGANIZE','ORGANIZER'),{set:[{object:'qa'}]});
 for(const [op,role]of [['DELIVER','REVIEWER'],['READ','ORGANIZER'],['REVIEW','RECIPIENT']])assert.equal(q(op,role).unknown,true);
});
test('shared allocation uses declared business identity and changed limits, not fixture-specific values',()=>{
 const w=boundaryFixture();w.rules.find(r=>r.type==='RETRY').max_extra=4;const core=compileCore(lowerBoundaryRules(w).ir).core;
 const base={template_id:'read',scope_id:'task',allocations:[{fragment_id:'one',max_extra:2},{fragment_id:'two',max_extra:2}],complete:true};
 assert.equal(compareRetryAllocations(core,base).result,'SATISFIED');
 assert.equal(compareRetryAllocations(core,{...base,complete:false}).result,'UNKNOWN');
 assert.equal(compareRetryAllocations(core,{...base,template_id:'renamed_read'}).result,'UNKNOWN');
 assert.equal(compareRetryAllocations(core,{...base,allocations:[...base.allocations,{fragment_id:'three',max_extra:1}]}).result,'VIOLATED');
 assert.equal(compareRetryAllocations(core,{...base,allocations:[base.allocations[0],base.allocations[0]]}).result,'UNKNOWN');
});
