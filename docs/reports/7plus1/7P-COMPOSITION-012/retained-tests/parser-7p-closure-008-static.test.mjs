import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{bindArguments,inspectOwnedDeclaration}from'../../../../../research/7plus1-parser/v0.3-7p-composition-012/declared-behavior.mjs';
import{compileNative}from'../../../../../research/7plus1-parser/v0.3-7p-composition-012/engine.mjs';
import{sourceDocument}from'../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import{cases}from'../../../../../docs/reports/7plus1/7P-CLOSURE-008/phase-b/non-gold-declarations.mjs';
import{reachable}from'../../../../../research/7plus1-parser/v0.3-7p-composition-012/compiler/validation/proof.mjs';
test('008 positional, named, defaults and variadic argument identity',()=>{
 const p=(name,kind='POSITIONAL_OR_KEYWORD',default_range=null)=>({name,kind,default_range}),a=(node_id,keyword)=>({node_id,keyword});
 assert.equal(bindArguments([p('left'),p('right')],[a('x'),a('y')]).status,'CERTIFIED');
 assert.equal(bindArguments([p('left'),p('right')],[a('y','right'),a('x','left')]).status,'CERTIFIED');
 assert.equal(bindArguments([p('left','POSITIONAL_ONLY')],[a('x','left')]).status,'UNRESOLVED');
 assert.equal(bindArguments([p('left')],[a('x'),a('y','left')]).reason,'FORMAL_GIVEN_TWICE');
 assert.equal(bindArguments([p('left')],[a('x'),a('y')]).reason,'ARITY_OR_UNKNOWN_KEYWORD');
 assert.equal(bindArguments([p('left')],[]).reason,'REQUIRED_FORMAL_UNBOUND');
 assert.equal(bindArguments([p('left','POSITIONAL_OR_KEYWORD',[4,8])],[]).bindings[0].operator,'DECLARED_DEFAULT');
 const b=bindArguments([p('folders','VAR_POSITIONAL')],[a('x'),a('y'),a('z')]);assert.equal(b.status,'CERTIFIED');assert.deepEqual(b.bindings[0].actuals.map(a=>a.node_id),['x','y','z']);
});
test('008 inspector never executes target code and preserves Unicode offsets',()=>{
 const s='  def parse_label(名称):\n      raise RuntimeError("must not execute")\n',r=inspectOwnedDeclaration(s,'parse_label');assert.equal(r.status,'SIGNATURE_AVAILABLE');assert.equal(r.executed,false);assert.equal(r.parameters[0].name,'名称');const p=r.parameters[0];assert.equal([...s].slice(p.range[0],p.range[1]).join(''),'名称');assert.equal(r.behavior.status,'UNSUPPORTED');
});
for(const x of cases)test('008 frozen independent owned declaration '+x.id,()=>{
 const input=JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-CLOSURE-008/phase-b/non-gold/'+x.id+'.json'));assert(!input.error);const go=()=>compileNative(sourceDocument(x.text),structuredClone(input.signals)),r=go(),c=r.compiler_v03,a=c.nlp_signals.semantic_decoding.declared_behavior;
 assert.equal(r.contract_gate_results.status,'PASS');assert.equal(r.relation_type_audit.status,'PASS');assert.equal(a.bindings.filter(b=>b.status==='CERTIFIED').length,x.expect.bindings);assert.equal(a.instantiations.length,x.expect.instantiations);assert.equal(a.instantiations.reduce((n,i)=>n+i.collection_node_ids.length,0),x.expect.collections);
 for(const d of a.declarations){assert.equal(d.executed,false);for(const formal of d.formals??[])assert.equal(c.semantic_nodes.find(n=>n.node_id===formal.node_id).metadata.discourse.kind,'CODE');}
 for(const i of a.instantiations){const b=a.bindings.find(b=>b.record_id===i.formal_actual_record_id);assert(b&&b.status==='CERTIFIED');assert(i.source_span_ids.some(s=>r.source_spans.find(p=>p.span_id===s)?.text.includes('def ')));assert(i.source_span_ids.some(s=>r.source_spans.find(p=>p.span_id===s)?.text.includes('调用')));assert.equal(i.executed,false);for(const n of i.collection_node_ids){const node=c.semantic_nodes.find(x=>x.node_id===n);assert.equal(node.metadata.collection.member_kind,'FILE');assert(c.boundary_ir.facts.some(f=>f.fact_type==='TASK_OBJECT'&&f.object_node_ids.includes(n)&&f.scope_expr_id));}const fact=c.boundary_ir.facts.find(f=>f.fact_type==='ACTION'&&f.predicate_node_id===i.owning_call_event_id),proof=c.proof_dag.nodes.find(n=>n.boundary_fact_id===fact.boundary_fact_id),reached=reachable(c.proof_dag,proof.id);for(const sid of i.source_span_ids)assert(reached.some(n=>n.source_span_id===sid),'declared behavior must have a real ProofDAG source path');}
 for(const s of r.source_spans)assert.equal([...x.text].slice(s.start,s.end).join(''),s.text);
 const again=go().compiler_v03;for(const k of ['semantic_nodes','relations','eligibility_decisions','boundary_ir','canonical_7plus1','proof_dag'])assert.deepEqual(c[k],again[k],k);
});
test('008 frozen Q/projection/contracts remain identical to 007',()=>{for(const n of ['graph-queries.mjs','projection.mjs','relations.mjs','compiler/contracts/schema.mjs'])assert.deepEqual(fs.readFileSync('research/7plus1-parser/v0.3-7p-composition-012/'+n),fs.readFileSync('research/7plus1-parser/v0.3-7p-repair-007/'+n));const s=fs.readFileSync('research/7plus1-parser/v0.3-7p-composition-012/declared-behavior.mjs','utf8')+fs.readFileSync('research/7plus1-parser/v0.3-7p-composition-012/static-evidence.py','utf8');assert(!/SWAI-|_existing_filenames_for_seq|write_task|tasks_dir|expected-7plus1|eval\(|exec\(/u.test(s));});
