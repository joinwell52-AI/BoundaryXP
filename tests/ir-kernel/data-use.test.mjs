import test from 'node:test';import assert from 'node:assert/strict';import {v2,plan} from './domain-fixtures.mjs';import {entity,event,expr,variable,req,E,V,T,O} from './fixtures.mjs';import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {queryCore} from '../../src/bxp/ir-kernel/queries.mjs';import {stable} from '../../src/bxp/ir-kernel/values.mjs';
test('data availability is symbolic in planning, unknown in evaluation and keyed by actual object',async()=>{
 const i=v2();i.entities.push(entity('a'),entity('b'));i.events.push(event('consume'));i.expressions.push(expr('objects','SET',[O('a'),O('b')]),expr('yes','BOOLEAN',[],true),expr('occur','EVENT_OCCURRED',[T('consume')]));i.variables.push(variable('chosen','OBJECT',E('objects')));i.requirements.push(req('must',E('occur')),req('use',E('yes'),{kind:'DATA_USE',data_use:{object:V('chosen'),consumer:T('consume'),producer:null,origin:'EXTERNAL',availability:'AT_USE'}}));const c=compileCore(i);
 const context={variables:{chosen:{object:'a'}},plan:plan([{id:'consume',task_id:'task',occurred:true,start:'5',end:'6'}])};
 assert.equal((await queryCore(c,{...context,kind:'EVALUATE'})).result,'UNKNOWN');assert.equal((await queryCore(c,context)).verification,'MODEL_CHECKED');
 const availability={[stable({object:{object:'a'},producer:null})]:{at:'10'},[stable({object:{object:'b'},producer:null})]:{at:'3'}};
 assert.equal((await queryCore(c,{...context,availability})).result,'UNSAT');assert.equal((await queryCore(c,{...context,variables:{chosen:{object:'b'}},availability})).result,'SAT');
});
