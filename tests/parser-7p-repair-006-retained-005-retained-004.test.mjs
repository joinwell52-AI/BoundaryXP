import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{compileNative,candidateGraph}from'../research/7plus1-parser/v0.3-7p-repair-006/engine.mjs';
import{closeEdges}from'../research/7plus1-parser/v0.3-7p-repair-006/edge-closure.mjs';
import{sourceDocument}from'../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import{cases}from'../docs/reports/7plus1/7P-REPAIR-004/non-gold-inputs.mjs';
const load=id=>JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-REPAIR-004/non-gold/'+id+'.json'));
for(const x of cases)test('004 real syntax '+x.id,()=>{
 const {signals}=load(x.id),doc=sourceDocument(x.text),r=compileNative(doc,structuredClone(signals)),c=r.compiler_v03,a=c.nlp_signals.semantic_decoding.edge_closure;
 assert.equal(r.contract_gate_results.status,'PASS',JSON.stringify(r.contract_gate_results));assert.equal(r.relation_type_audit.status,'PASS');
 const nodes=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),edges=c.relations.filter(r=>r.state==='RESOLVED');
 const has=(event,target,types=['PATIENT','THEME','RESULT'])=>edges.some(r=>types.includes(r.relation_type)&&nodes.get(r.head_node_id).surface===event&&nodes.get(r.tail_node_id).surface===target);
 const actual=id=>c.canonical_7plus1[id].entries.filter(e=>e.state==='RESOLVED');
 for(const row of a.edges){assert.ok(row.relation_id&&row.operator&&row.head_node_id&&row.tail_node_id&&row.relation_type&&row.evidence_kind);assert.ok(row.source_span_ids.length&&row.structural_path.length);assert.ok(Array.isArray(row.competing_candidates));if(row.resolution_state==='REJECTED')assert.ok(row.rejected_alternative_reason);for(const sid of row.source_span_ids){const s=r.source_spans.find(s=>s.span_id===sid);assert.ok(s);assert.equal([...x.text].slice(s.start,s.end).join(''),s.text);}}
 const repeated=compileNative(doc,structuredClone(signals)).compiler_v03;assert.deepEqual(a,repeated.nlp_signals.semantic_decoding.edge_closure);assert.deepEqual(c.canonical_7plus1,repeated.canonical_7plus1);
 if(['SINGLE','PAIR','TRIPLE','CONTINUATION','LIST'].includes(x.id)){assert.ok(has('检查','delta.csv'));if(x.id!=='SINGLE')assert.ok(has('检查','epsilon.csv'));if(x.id==='TRIPLE')assert.ok(has('检查','zeta.csv'));}
 if(x.id==='SHARED')for(const event of ['检查','更新'])for(const target of ['delta.csv','epsilon.csv','zeta.csv'])assert.ok(has(event,target),event+target);
 if(x.id==='PARTITION'){assert.ok(has('检查','delta.csv'));assert.ok(!has('检查','epsilon.csv'));assert.ok(!has('检查','zeta.csv'));assert.ok(!has('更新','delta.csv'));assert.ok(has('更新','epsilon.csv')&&has('更新','zeta.csv'));}
 if(x.id==='EN_SHARED')for(const event of ['Inspect','update'])for(const target of ['delta.csv','epsilon.csv'])assert.ok(has(event,target));
 if(x.id==='EN_PARTITION'){assert.ok(has('Inspect','delta.csv')&&has('update','epsilon.csv'));assert.ok(!has('Inspect','epsilon.csv')&&!has('update','delta.csv'));}
 if(['BA','BEI','MODIFY'].includes(x.id)){const event=x.id==='MODIFY'?'修改':'更新';assert.ok(has(event,'delta.csv'));assert.ok(has(event,'delta.csv',['RESULT']));assert.ok(actual('I').length&&actual('O').length);assert.ok(!actual('P').length);}
 if(x.id==='NEIGHBOR')assert.ok(!has('检查','epsilon.csv'));
 if(x.id==='REUSE'){assert.ok(has('生成','report.md',['RESULT'])&&has('发送','report.md')&&has('归档','report.md'));const ids=edges.filter(r=>['RESULT','THEME'].includes(r.relation_type)&&['生成','发送','归档'].includes(nodes.get(r.head_node_id).surface)).map(r=>r.tail_node_id);assert.equal(new Set(ids).size,1);}
 if(['AMBIGUOUS','AMBIGUOUS_CHECK','SECTION_CHECK'].includes(x.id)){assert.ok(c.unresolved.some(u=>u.kind==='UNRESOLVED_COREFERENCE'));assert.ok(!a.edges.some(e=>e.operator==='RESULT_REUSE'&&e.resolution_state==='RESOLVED'));}
 if(['MULTI_REUSE','CROSS_SECTION'].includes(x.id)){assert.ok(c.unresolved.length,'Missing predicate endpoint remains a reported coverage failure');assert.ok(!a.edges.some(e=>e.operator==='RESULT_REUSE'&&e.resolution_state==='RESOLVED'));assert.equal(actual('A').filter(e=>e.display_value.includes('归档')).length,0);}
 if(x.id==='AMBIG_CONT'){assert.ok(!has('检查','epsilon.csv'));assert.ok(!has('检查','zeta.csv')&&!has('更新','zeta.csv'));assert.ok(a.decisions.some(d=>d.operator==='CONTINUATION'&&d.resolution_state==='UNRESOLVED'));}
 if(x.id==='BASIS_FILE'){assert.ok(has('检查','delta.csv'));assert.ok(!actual('I').some(e=>e.display_value.includes('protocol.md')));assert.ok(actual('V').some(e=>e.display_value.includes('protocol.md')));}
 if(x.id==='BASIS_NEG'){assert.ok(actual('I').some(e=>e.display_value.includes('protocol.md')));assert.equal(actual('V').length,0);}
 if(x.id==='CONTENT_EXPLICIT'){assert.equal(actual('A').filter(e=>e.display_value.includes('检查')||e.display_value.includes('更新')).length,0);assert.ok(has('检查','delta.csv')&&has('更新','epsilon.csv'));}
 if(x.id==='CONTENT')assert.equal(c.nlp_signals.semantic_decoding.discourse.authoring_document,false,'Known upstream missing discourse genre: this sample is not an end-to-end semantic PASS');
 if(x.id.startsWith('PARAPHRASE_')){const event=x.id==='PARAPHRASE_1'?'扫描':'检查',vals=x.id==='PARAPHRASE_1'?['north.bin','south.bin','west.bin']:['branch_one.yaml','branch_two.yaml','branch_three.yaml'];for(const v of vals)assert.ok(has(event,v));assert.ok(a.edges.some(e=>e.operator==='CONTINUATION'));}
 // 005 is explicitly authorized to materialize the endpoint whose absence 004 recorded.
 if(x.id==='PATTERN_A')assert.ok(c.nlp_signals.semantic_decoding.candidate_recall.predicates.some(p=>!p.was_present));
 if(x.id==='PATTERN_B')assert.ok(c.unresolved.length,'Subordinate predicate lacking a unique controlling relation cannot be flattened into a main-clause action');
 if(x.id==='READ_RESULTS')assert.ok(actual('A').some(e=>e.display_value.includes('检查')));
 if(x.id==='LIST_NEG')assert.ok(!a.edges.some(e=>e.operator==='CONTINUATION'&&e.resolution_state==='RESOLVED'));
});
test('004 basis shield rejects weaker patient and scope with exact reference proof',()=>{
 const x=load('BASIS_FILE'),f=candidateGraph(sourceDocument(x.text),x.signals),a=f.analyses.find(a=>a.events.length),event=a.events[0],ref=f.semantic_nodes.find(n=>n.node_type==='REFERENCE'),s=f.source_spans.find(s=>s.span_id===ref.source_span_ids[0]);
 const candidate=f.tools.node(a.cl,'ENTITY',s.start,s.end,{sense:'WEAK_TEST_CANDIDATE',discourse:a.discourse});
 const bad=f.tools.relation(a.cl,'PATIENT',event,candidate,[a.sid]),scope=f.tools.relation(a.cl,'SCOPE_MEMBER',event,candidate,[a.sid]);
 closeEdges(f);assert.equal(bad.state,'REJECTED');assert.equal(scope.state,'REJECTED');assert.ok(f.semantic_decoding.edge_closure.edges.filter(r=>r.operator==='BASIS_SHIELD'&&r.resolution_state==='REJECTED').length>=2);assert.deepEqual(candidate.metadata.artifact_roles,['REFERENCE_ONLY']);
});
test('004 isolated same Gc input is deterministic and never imports a projection',()=>{
 const x=load('SHARED'),a=closeEdges(candidateGraph(sourceDocument(x.text),structuredClone(x.signals))),b=closeEdges(candidateGraph(sourceDocument(x.text),structuredClone(x.signals)));
 assert.deepEqual(a.relations,b.relations);assert.deepEqual(a.expressions,b.expressions);assert.deepEqual(a.semantic_decoding.edge_closure,b.semantic_decoding.edge_closure);
 const code=fs.readFileSync('research/7plus1-parser/v0.3-7p-repair-004/edge-closure.mjs','utf8');assert.ok(!/SWAI-|REF-001|next_seq|archived|ADR-0003|canonical_7plus1|expected-7plus1|CONTINUATION_OF|INHERITED_ACTION/u.test(code));
});
