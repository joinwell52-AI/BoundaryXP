import test from 'node:test';import assert from 'node:assert/strict';import {samples} from './operator-samples.mjs';
import {registry} from '../../src/bxp/ir-kernel/contract-registry.mjs';import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';import {inferQueryCapability} from '../../src/bxp/ir-kernel/capabilities.mjs';import {expr,req,E} from './fixtures.mjs';
const expected={SET:{set:[{object:'a'},{object:'b'}]},GROUP_MEMBERS:{set:[{object:'a'},{object:'b'}]},TASK_EVENTS:{set:[{event:'job'}]},TASK_EXTERNAL_INPUTS:{set:[{object:'a'},{object:'b'}]},UNION:{set:[{object:'a'},{object:'b'}]},INTERSECTION:{set:[{object:'a'},{object:'b'}]},DIFFERENCE:{set:[]},MEMBER:true,SUBSET:true,CARDINALITY:{number:'2'},NUMBER:{number:'3'},BOOLEAN:false,REAL_INTERVAL:{interval:['0','2']},INTEGER_RANGE:{set:[{number:'0'},{number:'1'},{number:'2'}]},EQ:false,LT:true,LTE:true,GT:false,GTE:{unknown:true},ADD:{number:'3'},AND:false,OR:true,NOT:false,IMPLIES:false,IFF:false,STATE_VALUE:true,STATE_ESTABLISHED:{number:'1'},TRUE_AT_START:true,IMMEDIATE_AFTER:{unknown:true},BEFORE:true,EVENT_INSTANCE:{event:'attempt@1'},PREVIOUS_INSTANCE:{event:'attempt@0'},EVENT_OCCURRED:true,EVENT_COMPLETED:true,EVENT_SUCCEEDED:false,EVENT_START:{number:'2'},EVENT_END:{number:'4'},OBJECT_OF:{object:'a'},RECIPIENT_OF:{object:'person'},ENVIRONMENT_OF:{object:'env'},FORALL:true,EXISTS:true,SELECT_EVENTS:{set:[{event:'job'}]},COUNT_STARTED:{number:'1'},SYMBOL:{symbol:'INVOKE'},OPERATION_OF:{symbol:'INVOKE'},ACTORS_OF:{set:[{object:'person'}]},TARGETS_OF:{set:[{object:'a'}]},RECIPIENTS_OF:{set:[{object:'person'}]},RECEIVED_ANY:true,RECEIVED_COMPLETE:false,ACTIVE_DURING:true,ACTIVE_SINCE:true};
test('K16 registry signatures have explicit evaluator samples and whole-query lowering gates',()=>{
 const {ir,entries,query}=samples();assert.deepEqual(Object.keys(entries).sort(),Object.keys(registry).sort());const c=compileCore(ir);
 for(const [op,r]of Object.entries(entries)){
  assert.deepEqual(evaluateCore(c.core,r,query),expected[op],op);
  const variant=structuredClone(ir);if(op==='GTE')continue; // This sample intentionally has a free binder; tested by its FORALL.
  variant.expressions.push(expr('same','EQ',[r,r]));variant.requirements.push(req('same-rule',E('same')));
  const cap=inferQueryCapability(compileCore(variant).core,query);
  if(op==='IMMEDIATE_AFTER')assert.equal(cap.status,'UNSUPPORTED',op);else assert.equal(cap.status,'SUPPORTED',op+':'+JSON.stringify(cap.diagnostics));
  const malformed=structuredClone(ir),node=malformed.expressions.find(x=>x.id===r.id);node.arguments=Array.from({length:registry[op].min?registry[op].min-1:registry[op].max===0?1:0},()=>E('yes'));
  if(registry[op].min||registry[op].max===0)assert.throws(()=>compileCore(malformed),undefined,op);
 }
});
