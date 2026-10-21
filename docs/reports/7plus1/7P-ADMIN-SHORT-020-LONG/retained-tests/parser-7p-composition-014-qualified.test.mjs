import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from 'file:///D:/boundx/research/7plus1-parser/v0.3-admin-short-020/engine.mjs';
import {sourceDocument} from 'file:///D:/boundx/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {checks} from 'file:///D:/boundx/docs/reports/7plus1/7P-COMPOSITION-014/stage-checks.mjs';
import {cases} from 'file:///D:/boundx/docs/reports/7plus1/7P-CLOSURE-008/phase-b/non-gold-reference-recipient.mjs';
const dir='docs/reports/7plus1/7P-COMPOSITION-014/',read=p=>JSON.parse(fs.readFileSync(p));
for(const x of read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(x=>x.stage==='R2'))test('013 qualified identity '+x.id,()=>{
 const r=compileNative(sourceDocument(x.text),structuredClone(read(dir+'non-gold-signals/'+x.id+'.json').signals));for(const a of checks(x,r))assert(a.pass,a.check);
 for(const p of r.compiler_v03.nlp_signals.semantic_decoding.qualified_identity.protected){assert.equal(p.lexical_role_projection,false);const n=r.compiler_v03.semantic_nodes.find(n=>n.node_id===p.node_id);assert(n.source_span_ids.length);assert.equal(p.complete_protected_span.quote,[...x.text].slice(p.complete_protected_span.start,p.complete_protected_span.end).join(''));}
});
for(const x of cases.filter(x=>x.references))test('013 inherited qualified reference / locator '+x.id,()=>{
 const prior=read('docs/reports/7plus1/7P-CLOSURE-008/phase-b/NON-GOLD-REF-RECIPIENT-R02/'+x.id+'.json'),r=compileNative(sourceDocument(x.text),structuredClone(prior.compiler_v03.nlp_signals)),c=r.compiler_v03;
 const refs=c.semantic_nodes.filter(n=>n.node_type==='REFERENCE'&&c.relations.some(r=>r.relation_type==='BASIS'&&r.state==='RESOLVED'&&r.tail_node_id===n.node_id));assert.deepEqual(refs.map(n=>n.surface),x.references);if(x.locator){const n=refs[0],s=r.source_spans.find(s=>s.span_id===n.metadata.source_locator.source_span_id);assert.equal(n.metadata.source_locator.kind,x.locator);assert(n.surface.endsWith(s.text));assert(c.boundary_ir.facts.some(f=>f.fact_type==='BASELINE'&&f.object_node_ids.includes(n.node_id)));}assert.equal(r.contract_gate_results.status,'PASS');
});
