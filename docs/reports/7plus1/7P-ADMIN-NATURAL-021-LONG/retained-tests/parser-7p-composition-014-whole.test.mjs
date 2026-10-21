import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from 'file:///D:/boundx/research/7plus1-parser/v0.3-admin-natural-021/engine.mjs';import {sourceDocument} from 'file:///D:/boundx/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
const dir='docs/reports/7plus1/7P-COMPOSITION-014/',read=p=>JSON.parse(fs.readFileSync(p));
for(const x of read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(x=>x.stage==='R4'))test('013 whole-frame provenance and fail-closed '+x.id,()=>{
 const r=compileNative(sourceDocument(x.text),structuredClone(read(dir+'non-gold-signals/'+x.id+'.json').signals)),c=r.compiler_v03,rows=c.nlp_signals.semantic_decoding.whole_composition.frames;assert.equal(r.contract_gate_results.status,'PASS');assert(rows.length);
 for(const a of rows){assert(a.source_span_ids.length);assert(a.source_span_ids.every(id=>r.source_spans.some(s=>s.span_id===id&&[...x.text].slice(s.start,s.end).join('')===s.text)));if(a.status==='CERTIFIED')assert(Object.values(a.checks).every(Boolean));else if(a.unresolved_ref)assert(c.unresolved.some(u=>u.unresolved_id===a.unresolved_ref));}
 if(x.expected_mechanism_contract==='COMPLETE_THREE_MEMBER_ACTION')assert(rows.some(a=>a.status==='CERTIFIED'&&a.member_node_ids.length===3&&a.member_node_ids.every(id=>a.scope_member_ids.includes(id))));
 if(x.expected_mechanism_contract==='EACH_THREE_FILES'){const a=rows.find(a=>a.distribution?.operator==='EACH');assert(a&&a.status==='CERTIFIED');assert.equal(a.member_node_ids.length,3);assert.equal(a.distribution.count_per_member,1);assert(c.boundary_ir.facts.some(f=>f.predicate_node_id===a.predicate_node_id&&f.state==='RESOLVED'&&f.fact_type==='ACTION'&&f.quantity_expr_id===a.quantity_expr_id));}
});
