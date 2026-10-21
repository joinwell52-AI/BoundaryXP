import test from 'node:test';
import assert from 'node:assert/strict';
import {localizeCoverage} from '../../../../../research/7plus1-parser/v0.3-7p-composition-011/coverage-locality.mjs';
import {id} from '../../../../../research/7plus1-parser/v0.3-7p-composition-011/identity.mjs';
for(const kind of ['CODE','METADATA','OUTPUT_CONTENT','CURRENT_TASK'])test('008 block coverage follows explicit '+kind+' domain without erasing failure',()=>{
 const co={coverage_record_id:'coverage',structure_node_id:id('source','block','block1'),eligibility_decision_ids:[],unresolved_refs:[],disposition:'COVERAGE_FAILURE'};
 const f={source:{sha256:'source'},semantic_nodes:[],eligibility_decisions:[],unresolved:[],relations:[],coverage:[co],structure:{nodes:[]},nlp_signals:{clauses:[]},semantic_decoding:{discourse:{annotations:[{structure_id:'block1',kind}]}}};
 localizeCoverage(f);assert.equal(co.disposition,'COVERAGE_FAILURE');assert.deepEqual(co.affected_slots,kind==='CURRENT_TASK'?['I','O','A','P','R','V','C','B']:kind==='OUTPUT_CONTENT'?['O']:[]);
});
