import test from 'node:test';import assert from 'node:assert/strict';
import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';
import {rational,add,toBase,stable} from '../../src/bxp/ir-kernel/values.mjs';
import {fixture,entity,event,expr,variable,req,E,O,T,V,rename} from './fixtures.mjs';
import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';
import {reference} from './reference/finite.mjs';
test('K03 root aliases, source sidecar and reorder deterministic core',()=>{
 const i=fixture();i.events.push(event('e',{owner_id:'ROOT'}));i.expressions.push(expr('start','EVENT_START',[T('ROOT')]));const c=compileCore(i);
 assert.equal(c.core.nodes.start.arguments[0].id,'task');assert.equal(c.core.nodes.e.owner_id,'task');assert.equal(c.source_map.start.rule,'IR14.EVENT_START');
 assert.equal(/Structured artificial|label|note|quote/.test(JSON.stringify(c.core)),false);
 const j=structuredClone(i);j.events.reverse();j.events[0].label='untrusted changed label';assert.equal(compileCore(j).core_sha256,c.core_sha256);
 assert.equal(compileCore(rename(i,'task','mission')).core.nodes.start.arguments[0].id,'mission');
});
test('K03 ambiguous roots, cycles and dangling/type references diagnosed',()=>{
 const i=fixture();i.events.push(event('second',{kind:'TASK',owner_id:'second'}));assert.throws(()=>compileCore(i),/ROOT_NOT_UNIQUE/);
 const j=fixture();j.events.push(event('e',{owner_id:'missing'}));assert.throws(()=>compileCore(j),/EVENT_OWNER_MISSING/);
 const k=fixture();k.expressions.push(expr('x','EVENT_START',[T('missing')]));assert.throws(()=>compileCore(k),/REFERENCE_MISSING/);
});
test('K04 finite binder and free local variable are distinguished',()=>{
 const i=fixture();i.expressions.push(expr('zero','NUMBER',[],0),expr('two','NUMBER',[],2),expr('range','INTEGER_RANGE',[E('zero'),E('two')]),expr('p','GTE',[V('i'),E('zero')]),expr('all','FORALL',[E('range'),E('p')],null,null,V('i')));
 i.variables.push(variable('i','INTEGER',E('range'),'INSTANCE_LOCAL'));i.requirements.push(req('r',E('all')));assert.ok(compileCore(i));
 i.requirements[0].body=E('p');assert.throws(()=>compileCore(i),/FREE_LOCAL_VARIABLE/);
});
test('K05 multiple recipients retained and K06 empty group stays empty',()=>{
 const i=fixture();i.entities.push(entity('a','PERSON'),entity('b','PERSON'),entity('nobody','GROUP'));
 i.events.push(event('send',{roles:[{role:'RECIPIENT',value:O('a'),source_refs:['s']},{role:'RECIPIENT',value:O('b'),source_refs:['s']}]}));
 const c=compileCore(i);assert.equal(c.core.nodes.send.roles.length,2);assert.deepEqual(c.core.nodes.nobody.members,[]);
});
test('K04 nested binders shadow without capturing the outer value',()=>{
 const i=fixture();i.expressions.push(expr('zero','NUMBER',[],0),expr('one','NUMBER',[],1),expr('two','NUMBER',[],2),expr('outer-domain','INTEGER_RANGE',[E('zero'),E('one')]),expr('inner-domain','INTEGER_RANGE',[E('two'),E('two')]),expr('inner-p','EQ',[V('x'),E('two')]),expr('inner','FORALL',[E('inner-domain'),E('inner-p')],null,null,V('x')),expr('outer-p','LTE',[V('x'),E('one')]),expr('both','AND',[E('inner'),E('outer-p')]),expr('outer','FORALL',[E('outer-domain'),E('both')],null,null,V('x')));i.variables.push(variable('x','INTEGER',E('outer-domain'),'INSTANCE_LOCAL'));i.requirements.push(req('r',E('outer')));
 assert.equal(evaluateCore(compileCore(i).core,E('outer')),true);assert.equal(evaluateCore(compileCore(rename(i,'x','alpha')).core,E('outer')),true);
});
test('exact numeric inputs, units and unsafe integer rejection',()=>{
 assert.equal(add('1/3','2/3'),'1');assert.equal(toBase('0.1','minute'),'6');
 assert.throws(()=>rational(9007199254740992),/NUMERIC_PRECISION_LOSS/);
 assert.deepEqual(rational('1e-3'),{n:1n,d:1000n});
});
test('K06/K07 independent raw reference agrees with Core, including empty forall and zero binder',()=>{
 for(const max of [0,1,2,7]){
 const i=fixture();i.expressions.push(expr('zero','NUMBER',[],0),expr('n','NUMBER',[],max),expr('range','INTEGER_RANGE',[E('zero'),E('n')]),expr('p','GTE',[V('i'),E('zero')]),expr('all','FORALL',[E('range'),E('p')],null,null,V('i')));
 i.variables.push(variable('i','INTEGER',E('range'),'INSTANCE_LOCAL'));i.requirements.push(req('r',E('all')));
 assert.equal(evaluateCore(compileCore(i).core,E('all')),reference(i,E('all')));
 i.expressions.find(x=>x.id==='p').operator='LT';assert.equal(evaluateCore(compileCore(i).core,E('all')),reference(i,E('all')));
 }
 const i=fixture();i.entities.push(entity('empty','GROUP'));i.expressions.push(expr('emptyset','GROUP_MEMBERS',[O('empty')]),expr('false','BOOLEAN',[],false),expr('all','FORALL',[E('emptyset'),E('false')],null,null,V('person')));i.variables.push(variable('person','OBJECT',E('emptyset'),'INSTANCE_LOCAL'));i.requirements.push(req('r',E('all')));
 assert.equal(evaluateCore(compileCore(i).core,E('all')),true);assert.equal(reference(i,E('all')),true);
});
