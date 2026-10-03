import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from '../research/7plus1-parser/v0.3-7p-short-direct-016/engine.mjs';
import {compare} from '../docs/reports/7plus1/7P-SHORT-016/compare.mjs';
import {cases} from '../docs/reports/7plus1/7P-SHORT-016/common.mjs';
const base='docs/reports/7plus1/7P-SHORT-016/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
for(const c of cases().slice(0,6))test(c.id+' complete typed I/O/A/P/R/V/C/B and no extras',()=>{
 const sig=read(base+'baseline-014/'+c.id+'/signals.json'),r=compileNative(sourceDocument(c.source),structuredClone(sig));
 assert.equal(compare(r,c).FULL_CASE_CLOSED,true);assert.equal(r.relation_type_audit.status,'PASS');
 assert.ok(r.compiler_v03.proof_dag.nodes.length);assert.equal(r.native_provenance.LLM,'NOT_USED');
});
test('negative requirement remains auxiliary with explicit negative condition',()=>{const c=cases().find(c=>c.id==='D06'),r=compileNative(sourceDocument(c.source),read(base+'baseline-014/D06/signals.json')),g=r.compiler_v03;const n=g.semantic_nodes.find(n=>n.node_type==='EVENT'&&n.metadata.modality==='NOT_REQUIRED');assert.ok(n);const f=g.boundary_ir.facts.filter(f=>f.predicate_node_id===n.node_id);assert.ok(f.length&&f.every(f=>f.fact_type.startsWith('AUX')));assert.ok(f.every(f=>g.boundary_ir.condition_expr_nodes.some(e=>e.expr_id===f.condition_expr_id&&e.op==='NOT')));});
test('D07 disagreement is retained, not forced into a closed expected answer',()=>{const c=cases().find(c=>c.id==='D07'),r=compileNative(sourceDocument(c.source),read(base+'baseline-014/D07/signals.json'));assert.equal(compare(r,c).FULL_CASE_CLOSED,false);assert.ok(r.compiler_v03.canonical_7plus1.A.entries.some(e=>e.display_value.includes('整理')));});
test('candidate source has no unsafe Hybrid proposal import or expected-input reader',()=>{const code=fs.readFileSync('research/7plus1-parser/v0.3-7p-short-direct-016/engine.mjs','utf8')+fs.readFileSync('research/7plus1-parser/v0.3-7p-short-direct-016/short-frames.mjs','utf8');assert.ok(!/proposal-lane|generateProposals|admitProposals|expected-7plus1|FROZEN-CASES|readFile/u.test(code));});
