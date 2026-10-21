import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{compileNative}from'../../../../../research/7plus1-parser/v0.3-7p-composition-011/engine.mjs';import{sourceDocument}from'../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';import{cases}from'../../../../../docs/reports/7plus1/7P-REPAIR-002/non-gold-inputs.mjs';
import{meetingAssertions}from'../../../../../docs/reports/7plus1/7P-REPAIR-001/test-support/meeting-assertions.mjs';import{assertions}from'../../../../../docs/reports/7plus1/7P-REPAIR-001/test-support/verify-semantics.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
for(const x of cases)test('repair002 '+x.id+' '+x.check,()=>{
 const e=read('docs/reports/7plus1/7P-REPAIR-002/non-gold/'+x.id+'.json');assert.equal(e.text,x.text);const r=compileNative(sourceDocument(x.text),e.signals),c=r.compiler_v03,s=c.canonical_7plus1,a=c.nlp_signals.semantic_decoding.structured_recovery;
 assert.equal(r.contract_gate_results.status,'PASS',JSON.stringify(r.contract_gate_results));assert.equal(r.relation_type_audit.status,'PASS');
 for(const p of r.source_spans)assert.equal([...x.text].slice(p.start,p.end).join(''),p.text);
 const has=(slot,value)=>s[slot].entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes(value));
 if(x.check==='MODIFY'){assert.ok(has('I',x.artifact));assert.ok(has('O',x.artifact));assert.ok(a.artifact_roles.some(x=>x.roles.includes('UPDATED_OUTPUT')));}
 if(x.check==='CREATE'){assert.ok(has('O',x.artifact),JSON.stringify(s.O));assert.ok(!has('I',x.artifact));}
 if(x.check==='READ'){assert.ok(has('I',x.artifact));assert.ok(!has('O',x.artifact));}
 if(['BASIS','TABLE','REF_NOT_I'].includes(x.check))assert.ok(has('V',x.ref),JSON.stringify(s.V));
 if(x.check==='REF_NOT_I')assert.ok(!has('I',x.ref));
 if(x.check==='TABLE'){assert.ok(a.references.some(x=>x.structural_proof?.kind==='TABLE_ROW_PROPOSITION'));assert.equal(s.P.entries.length,0);}
 if(x.check==='TABLE_UNKNOWN'){assert.equal(s.V.entries.length,0);assert.ok(a.diagnostics.some(x=>x.code==='STRUCTURED_TABLE_UNRESOLVED'));}
 if(x.check==='TYPED_TABLE'){assert.ok(a.tables.some(x=>x.status==='TYPED_ROW_WITHOUT_BOUNDARY_RELATION'));assert.ok(c.semantic_nodes.some(x=>x.metadata.structural_role==='SIDE_EFFECT'));}
 if(x.check==='REFERENCE_TYPES')for(const type of ['PREDECESSOR','SUPERSEDES','REFERENCES','RELATED_REFERENCE'])assert.ok(a.references.some(x=>x.relation_type===type),type);
 if(x.check==='NO_CURRENT')for(const k of 'IOV')assert.equal(s[k].entries.length,0);
 if(x.check==='CONDITIONAL'){assert.ok(has('O',x.artifact));assert.ok(s.O.entries.find(e=>e.display_value.includes(x.artifact)).condition_expr_id);}
 if(x.check==='COMPLETION'||x.check==='COUNT_NOT_R'){assert.ok(s.C.entries.some(e=>e.state==='RESOLVED'));assert.ok(a.completion.some(x=>x.kind==='ALL_OF'));assert.equal(s.R.entries.length,0);}
 if(x.check==='SAFE_COMPLETION'){assert.ok(s.C.entries.length);for(const e of s.C.entries.filter(x=>x.state==='RESOLVED'))assert.ok(e.condition_expr_id);}
 if(x.check.startsWith('CONTENT')){assert.ok(a.output_content.length);const status={CONTENT_SET:'OUTPUT_SET',CONTENT_ONE:'UNIQUE_OUTPUT',CONTENT_AMBIGUOUS:'UNRESOLVED_OUTPUT_SET'}[x.check];if(status)assert.ok(a.output_content.every(x=>x.ownership_status===status),JSON.stringify(a.output_content.map(x=>({status:x.ownership_status,owners:x.owning_output_candidates}))));
  for(const fact of c.boundary_ir.facts)if(['ACTION','FORBID','PARTICIPANT'].includes(fact.fact_type))for(const nid of fact.node_ids)assert.notEqual(c.semantic_nodes.find(n=>n.node_id===nid).metadata.discourse?.kind,'OUTPUT_CONTENT');
  if(x.check==='CONTENT_CURRENT_B')assert.ok(has('B','server.yaml'));
 }
});
for(const x of read('fixtures/7plus1/regression/P22-SAVED-SIGNALS.json').cases)test('repair002 prior '+x.id,()=>{const r=compileNative(sourceDocument(x.text),x.signals);assert.equal(r.contract_gate_results.status,'PASS');assert.deepEqual((x.id==='MEETING'?meetingAssertions(r):assertions(r,x.id.split('-M')[0],x.text)).filter(x=>!x.pass),[]);});
