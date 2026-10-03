import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from '../research/7plus1-parser/v0.3-7p-composition-014/engine.mjs';import {certifyWholeFrames} from '../research/7plus1-parser/v0.3-7p-composition-014/whole-composition.mjs';import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
const dir='docs/reports/7plus1/7P-COMPOSITION-014/',read=p=>JSON.parse(fs.readFileSync(p)),inputs=read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases;
for(const x of inputs.filter(x=>x.new_in_014))test('014 independent typed distribution '+x.id,()=>{
 const r=compileNative(sourceDocument(x.text),structuredClone(read(dir+'non-gold-signals/'+x.id+'.json').signals));assert.equal(r.contract_gate_results.status,'PASS');
 const c=r.compiler_v03,a=c.nlp_signals.semantic_decoding.distributive_construction.frames,f=c.nlp_signals.semantic_decoding.whole_composition.frames,actions=c.boundary_ir.facts.filter(f=>f.fact_type==='ACTION'&&f.state==='RESOLVED');
 assert(r.source_spans.every(s=>[...x.text].slice(s.start,s.end).join('')===s.text));
 if(['CERTIFIED','OUTPUT_OWNED','ISOLATED'].includes(x.expected_mechanism_contract)){
  const valid=a.filter(a=>a.status==='CONSTRUCTED');assert(valid.length);for(const a of valid){assert.equal(a.member_node_ids.length,x.members);assert.equal(a.quantity,x.quantity);const cert=f.find(f=>f.predicate_node_id===a.predicate_node_id);assert.equal(cert.status,'CERTIFIED');assert(Object.values(cert.checks).every(Boolean));assert(c.boundary_ir.quantity_expr_nodes.some(q=>q.expr_id===a.quantity_expr_id&&q.unit==='items_per_member'&&q.lower_bound.value===x.quantity&&q.upper_bound.value===x.quantity));assert(!c.relations.some(r=>r.relation_type==='AGENT'&&r.state==='RESOLVED'&&a.member_node_ids.includes(r.tail_node_id)));}
  if(x.expected_mechanism_contract==='OUTPUT_OWNED')assert(!actions.some(f=>valid.some(a=>a.predicate_node_id===f.predicate_node_id)));
  if(x.expected_mechanism_contract==='ISOLATED')assert.equal(new Set(valid.map(a=>a.semantic_owner_id)).size,2);
  if(x.id==='D03')assert.deepEqual(valid[0].member_node_ids.map(i=>c.semantic_nodes.find(n=>n.node_id===i).surface),['probe/a.py','probe/b.py','probe/c.py']);
 }else if(x.expected_mechanism_contract==='UNRESOLVED'){assert(a.some(a=>a.status==='UNRESOLVED'));assert(!f.some(f=>f.distribution&&f.status==='CERTIFIED'));assert(!actions.some(f=>a.some(a=>a.predicate_node_id===f.predicate_node_id)));}
 else if(x.expected_mechanism_contract==='NOT_DISTRIBUTIVE')assert.equal(a.length,0);
 else assert(!a.some(a=>a.status==='CONSTRUCTED'));
});
const mutations={missing_quantity:e=>e.metadata.distribution.quantity_expr_id=null,wrong_count:e=>e.metadata.distribution.count_per_member=99,aggregate_operator:e=>e.metadata.distribution.operator='ALL',missing_member:e=>e.metadata.distribution.file_node_ids=e.metadata.distribution.file_node_ids.slice(1),missing_result:e=>e.metadata.distribution.result_node_id=null,missing_modality:e=>e.metadata.modality='UNSTATED'};
for(const [name,mutate]of Object.entries(mutations))test('014 whole frame rejects incomplete/conflicting '+name,()=>{
 const r=read(dir+'non-gold-third/D01.json'),c=r.compiler_v03,frames=c.nlp_signals.semantic_decoding.whole_composition.frames,e=c.semantic_nodes.find(n=>n.metadata.distribution),cert=frames.find(x=>x.predicate_node_id===e.node_id);
 const f={source:c.source,source_spans:r.source_spans,semantic_nodes:c.semantic_nodes,relations:c.relations,semantic_decoding:c.nlp_signals.semantic_decoding,analyses:c.nlp_signals.clauses.map(cl=>({cl})),semantic_ownership:new Map(c.semantic_nodes.map(n=>[n.node_id,n.metadata.semantic_ownership])),expression_plans:new Map([[e.node_id,{scope_expr_id:cert.scope_expr_id}]]),expressions:c.boundary_ir,tools:{unknown:()=>name}};
 mutate(e);certifyWholeFrames(f);assert.equal(f.whole_frame_certificates.get(e.node_id).status,'PARTIAL');assert.equal(f.expression_plans.get(e.node_id).unresolved_ref,name);
});
