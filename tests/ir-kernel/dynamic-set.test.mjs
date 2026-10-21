import test from 'node:test';import assert from 'node:assert/strict';import {v2} from './domain-fixtures.mjs';import {entity,expr,variable,req,E,O,V} from './fixtures.mjs';import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {queryCore} from '../../src/bxp/ir-kernel/queries.mjs';
test('K09 symbolic references to the same input count once, separate identities count twice',async()=>{
 const i=v2();i.entities.push(entity('a'),entity('b'));i.expressions.push(expr('domain','SET',[O('a'),O('b')]),expr('used','SET',[V('x'),V('y')]),expr('size','CARDINALITY',[E('used')]),expr('one','NUMBER',[],'1'),expr('exactOne','EQ',[E('size'),E('one')]));i.variables.push(variable('x','OBJECT',E('domain')),variable('y','OBJECT',E('domain')));i.requirements.push(req('r',E('exactOne')));const c=compileCore(i);
 const same=await queryCore(c,{variables:{x:{object:'a'},y:{object:'a'}}});assert.equal(same.result,'SAT');assert.equal(same.verification,'MODEL_CHECKED');
 const different=await queryCore(c,{variables:{x:{object:'a'},y:{object:'b'}}});assert.equal(different.result,'UNSAT');
});
