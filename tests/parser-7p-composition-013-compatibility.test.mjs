import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative as candidate} from '../research/7plus1-parser/v0.3-7p-composition-013/engine.mjs';
import {compileNative as previous} from '../research/7plus1-parser/v0.3-7p-composition-011/engine.mjs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {identityCases} from '../docs/reports/7plus1/7P-REPAIR-007/identity-inputs.mjs';
import {factRoleOwnerPolicy} from '../research/7plus1-parser/v0.3-7p-composition-013/semantic-ownership.mjs';
for(const x of identityCases)test('012 retained identity semantics '+x.id,()=>{
 const signals=JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-REPAIR-007/non-gold/'+x.id+'.json')).signals;
 const go=f=>f(sourceDocument(x.text),structuredClone(signals)),a=go(previous),b=go(candidate),again=go(candidate);
 assert.equal(b.contract_gate_results.status,'PASS');assert.equal(b.relation_type_audit.status,'PASS');
 for(const k of ['eligibility_decisions','boundary_ir','canonical_7plus1','proof_dag']){assert.deepEqual(b.compiler_v03[k],a.compiler_v03[k],'unaffected '+k);assert.deepEqual(b.compiler_v03[k],again.compiler_v03[k],'deterministic '+k);}
 assert.deepEqual(b.compiler_v03.nlp_signals.semantic_decoding.cross_instruction_identity,a.compiler_v03.nlp_signals.semantic_decoding.cross_instruction_identity);
});
test('012 fixed query projection relation space and no corpus switches',()=>{
 const root='research/7plus1-parser/v0.3-7p-composition-013/';
 for(const file of ['graph-queries.mjs','projection.mjs','relations.mjs'])assert.deepEqual(fs.readFileSync(root+file),fs.readFileSync('research/7plus1-parser/v0.3-7p-repair-006/'+file));
 for(const file of ['eligibility.mjs','semantic-ownership.mjs','candidate-recall.mjs'])assert(!/SWAI-|REAL-GOLD-|expected-7plus1|OFFLINE-REEVALUATION|COMPARISON\.json|b4dc1f7|source\.sha256\s*===\s*['"]/u.test(fs.readFileSync(root+file,'utf8')));
});
for(const [type,accepted] of [['ACTION',false],['TASK_OBJECT',false],['DELIVERABLE',false],['PARTICIPANT',false],['BASELINE',true],['COMPLETION',true],['AUX_CONDITION',true],['FORBID',true],['RESTRICT',true]])test('012 orthogonal acceptance role '+type,()=>{
 const nodes=new Map([['e',{node_id:'e',node_type:'EVENT',metadata:{modality:'FORBIDDEN',restrict:true}}],['ref',{node_id:'ref',node_type:'REFERENCE'}]]),record={node_id:type==='BASELINE'?'ref':'e',owner_category:'ACCEPTANCE'},rs=[{relation_id:'basis',relation_type:'BASIS',state:'RESOLVED',head_node_id:'task',tail_node_id:'ref'},{relation_id:'negative',relation_type:'FORBIDS',state:'RESOLVED',head_node_id:'e',tail_node_id:'target'}];
 const p=factRoleOwnerPolicy(type,[record],rs,nodes);assert.equal(p.allowed,accepted);assert.equal(p.acceptance_domain,true);assert(p.candidate_fact_role);
});
test('012 identifier without basis cannot obtain acceptance V license',()=>{assert.equal(factRoleOwnerPolicy('BASELINE',[{node_id:'ref',owner_category:'ACCEPTANCE'}],[],new Map([['ref',{node_type:'REFERENCE'}]])).allowed,false);});
