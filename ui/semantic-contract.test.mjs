import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWithLibraries} from '../admin-python.mjs';
import {sourcePresentation} from './source-advice.mjs';

test('isolated Python bridge returns shared bilingual roles and preserves file origin',async()=>{
 for(const text of ['由 Analyst 读取 orders.csv 并生成 summary.json。','Analyst reads orders.csv and generates summary.json.']){
  const r=await calculateWithLibraries(text),p=r.sourceAnalysis.projection;
  assert.equal(p.contract.schema,'boundx-semantic-contract/v1');
  assert.deepEqual(p.contract.actions.map(a=>a.operation),['read','create']);
  assert.deepEqual(p.fileInputs.map(f=>f.name),['orders.csv']);assert.deepEqual(p.fileOutputs.map(f=>f.name),['summary.json']);
  const view=sourcePresentation(r,text);assert(view.elements.P.some(v=>v.text.en==='Analyst (executor)'));
  assert.equal(view.hasApplicableChecks,false);
  assert.equal(r.businessDecision,null);
 }
});
test('conditional handover and alternatives produce concrete localized advice',async()=>{
 for(const [text,code] of [
  ['## WP1 Prepare\nIf approved, generate data.json.\n## WP2 Execute\nRead data.json.','io_conditional_supply'],
  ['生成 a.csv 或 b.csv。','alternative_file_role']]){
  const r=await calculateWithLibraries(text),p=sourcePresentation(r,text);
  const f=p.findings.find(x=>x.code===code);assert(f);assert(f.suggestion.en);assert(f.suggestion['zh-CN']);
  assert.equal(f.decision,null);
  for(const s of f.sources)assert.equal(text.slice(s.start,s.end),s.quote);
 }
});
