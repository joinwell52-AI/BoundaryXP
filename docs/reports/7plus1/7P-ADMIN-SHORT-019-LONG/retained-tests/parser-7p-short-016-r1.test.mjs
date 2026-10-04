import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {sourceDocument} from 'file:///D:/boundx/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {compileNative} from 'file:///D:/boundx/research/7plus1-parser/v0.3-admin-short-019/engine.mjs';
import {compare} from 'file:///D:/boundx/docs/reports/7plus1/7P-SHORT-016-R1/compare.mjs';
import {cases} from 'file:///D:/boundx/docs/reports/7plus1/7P-SHORT-016-R1/common.mjs';
const base='docs/reports/7plus1/7P-SHORT-016-R1/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const parse=c=>compileNative(sourceDocument(c.source),read(base+'final-first/'+c.id+'/signals.json'));
for(const c of cases())test(c.id+' full eight-slot semantics, no extra entries, typed owned content',()=>{const r=parse(c);assert.equal(r.contract_gate_results.status,'PASS');assert.equal(r.relation_type_audit.status,'PASS');assert.equal(compare(r,c).FULL_CASE_CLOSED,true);assert.equal(compare(r,c).IOA_CLOSED,true);});
test('explicit macro goal stays in graph and auxiliary eligibility with workflow proof, never additional input/action',()=>{const c=cases().find(c=>c.id==='D07'),r=parse(c),g=r.compiler_v03,a=g.nlp_signals.semantic_decoding.short_refinement_content.refinements[0];assert.ok(a);assert.equal(a.workflow_node_ids.length,2);assert.ok(g.semantic_nodes.some(n=>n.node_id===a.goal_node_id));assert.ok(g.eligibility_decisions.some(e=>e.disposition==='AUXILIARY'&&e.candidate_node_ids.includes(a.goal_node_id)));assert.ok(g.boundary_ir.facts.every(f=>f.fact_type!=='ACTION'||f.predicate_node_id!==a.goal_node_id));assert.ok(g.boundary_ir.facts.every(f=>f.fact_type!=='TASK_OBJECT'||!f.object_node_ids.includes(a.object_node_id)));assert.ok(a.relation_ids.every(i=>g.relations.some(r=>r.relation_id===i&&r.rule_refs.includes('GOAL_REFINED_BY')&&r.state==='RESOLVED')));});
for(const id of ['D07','D08'])test(id+' section states are distinct per output/member, both source layers remain in ProofDAG',()=>{
 const r=parse(cases().find(c=>c.id===id)),g=r.compiler_v03,a=g.nlp_signals.semantic_decoding.short_refinement_content,content=a.content[0],completion=a.completion[0];
 assert.equal(content.content_node_ids.length,2);assert.equal(completion.operand_expr_ids.length,3);assert.equal(new Set(completion.operand_expr_ids).size,3);
 const states=completion.operand_expr_ids.map(i=>g.boundary_ir.condition_expr_nodes.find(x=>x.expr_id===i).state_node_id);assert.equal(new Set(states).size,3);
 for(const state of states.slice(1)){const n=g.semantic_nodes.find(n=>n.node_id===state);assert.ok(content.content_node_ids.includes(n.metadata.content_node_id));assert.deepEqual(n.metadata.object_node_ids,content.owner_output_ids);const proof=g.proof_dag.nodes.find(p=>p.semantic_node_id===state);assert.ok(proof);const seen=new Set(),visit=i=>{if(seen.has(i))return;seen.add(i);for(const e of g.proof_dag.edges.filter(e=>e.from_id===i))visit(e.to_id);};visit(proof.id);const evidence=g.proof_dag.nodes.filter(p=>p.kind==='SOURCE_SPAN'&&seen.has(p.id)).map(p=>p.source_span_id);const part=g.semantic_nodes.find(n=>n.node_id===n.metadata.content_node_id);assert.ok(n.source_span_ids.every(i=>evidence.includes(i)));}
 assert.ok(!g.canonical_7plus1.A.entries.some(e=>e.display_value.includes('contain')||e.display_value.includes('包含')));
});
test('completion comparison rejects a sibling substitution even when contract and status remain PASS',()=>{const c=cases().find(c=>c.id==='D08'),r=parse(c);const states=r.compiler_v03.semantic_nodes.filter(n=>n.metadata.sense==='SECTION_PRESENT');states[1].metadata.content_node_id=states[0].metadata.content_node_id;assert.equal(compare(r,c).FULL_CASE_CLOSED,false);});
for(const v of read(base+'VALIDATION-INPUTS.json').cases)test(v.id+' predeclared non-Gold '+v.assertion,()=>{
 const r=compileNative(sourceDocument(v.source),read(base+'validation-r02/'+v.id+'/signals.json')),g=r.compiler_v03,a=g.nlp_signals.semantic_decoding.short_refinement_content;
 if(['N01','N02'].includes(v.id)){assert.equal(a.content.length,1);assert.equal(a.completion[0].operand_expr_ids.length,3);assert.equal(new Set(a.completion[0].operand_expr_ids).size,3);assert.ok(g.canonical_7plus1.C.entries.some(e=>e.state==='RESOLVED'));}
 else if(v.id==='N05')assert.equal(a.refinements.length,0);
 else assert.ok(!g.canonical_7plus1.C.entries.some(e=>e.state==='RESOLVED'));
});
test('runtime does not consume expected answers or fixture IDs',()=>{const code=fs.readFileSync('research/7plus1-parser/v0.3-7p-short-direct-016-r1/refinement-content.mjs','utf8');assert.ok(!/D0[1-8]|REF-001|王齐|Olivia Chen|deployment-guide|compliance-note|FROZEN-CASES|expected-7plus1|readFile/u.test(code));});
