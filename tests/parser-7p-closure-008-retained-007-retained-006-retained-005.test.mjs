import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative,candidateGraph} from '../research/7plus1-parser/v0.3-7p-closure-008/engine.mjs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {traceMarkdown,traceHTML} from '../research/7plus1-parser/v0.3-7p-closure-008/export.mjs';
import {cases} from '../docs/reports/7plus1/7P-REPAIR-005/non-gold-inputs.mjs';
const load=id=>JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-REPAIR-005/non-gold/'+id+'.json'));
for(const x of cases)test('005 candidate '+x.id,()=>{
 const input=load(x.id),r=compileNative(sourceDocument(x.text),structuredClone(input.signals)),c=r.compiler_v03,a=c.nlp_signals.semantic_decoding.candidate_recall,nodes=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),frames=a.frames.filter(f=>f.frame_kind==='CAUSATIVE_OR_CONTROLLED');
 assert.equal(r.contract_gate_results.status,'PASS',JSON.stringify(r.contract_gate_results));assert.equal(r.relation_type_audit.status,'PASS');
 const {edge_output,eligibility_decisions,...beforeEligibility}=a;assert.deepEqual(candidateGraph(sourceDocument(x.text),structuredClone(input.signals)).semantic_decoding.candidate_recall,beforeEligibility);
 for(const s of r.source_spans)assert.equal([...x.text].slice(s.start,s.end).join(''),s.text);
 for(const p of a.predicates){assert(nodes.has(p.node_id));assert(p.source_span_ids.length&&p.structural_path.length);}
 const members=a.operand_sets.map(g=>g.member_node_ids.map(i=>nodes.get(i).surface));
 const resolved=slot=>c.canonical_7plus1[slot].entries.filter(e=>e.state==='RESOLVED');
 if(x.id==='ROOT')assert(a.predicates.some(p=>nodes.get(p.node_id).surface==='检查'));
 if(['CCOMP','XCOMP'].includes(x.id))assert(a.predicates.some(p=>/ccomp|xcomp/iu.test(p.dependency)));
 if(x.id==='CONTROL'){assert(a.predicates.some(p=>nodes.get(p.node_id).surface==='计算'&&!p.was_present));assert(frames.some(f=>f.state==='RESOLVED'&&f.embedded_event_ids.length===2));assert(members.some(g=>g.includes('north')&&g.includes('south')));assert(!resolved('P').length);}
 if(x.id==='THREE')assert(members.some(g=>g.join(',')==='red,green,blue'));
 if(x.id==='SEPARATE'){assert.equal(frames.length,2);const action=c.relations.filter(r=>r.state==='RESOLVED'&&r.relation_type==='PATIENT');assert(!action.some(r=>nodes.get(r.head_node_id).surface==='检查'&&nodes.get(r.tail_node_id).surface==='south.bin'));assert(!action.some(r=>nodes.get(r.head_node_id).surface==='更新'&&nodes.get(r.tail_node_id).surface==='north.bin'));}
 if(x.id==='QUOTED')assert(!a.predicates.some(p=>nodes.get(p.node_id).surface==='检查'));
 if(['HEADING','CODE','METADATA'].includes(x.id))assert(!a.predicates.some(p=>nodes.get(p.node_id).surface==='生成'));
 if(x.id==='TECHNICAL'){assert(a.literal_precedence.some(p=>nodes.get(p.node_id).surface==='retry_counter'));assert(!resolved('P').length);}
 if(x.id==='PERSON')assert(resolved('P').some(e=>e.display_value.includes('陈林')));
 if(x.id==='UNION'){assert(members.some(g=>g.length===2));assert(a.after_materialization.set_expressions.some(s=>s.kind==='UNION'&&s.operand_expr_ids.length===2));}
 if(x.id==='AMBIG_SUBJECT'){assert(frames.some(f=>f.state==='UNRESOLVED'));assert(!resolved('A').length);}
 if(x.id==='NEIGHBOR')assert(frames.every(f=>!f.governing_action_ids.length));
 if(x.id==='EN_CONTROL')assert(frames.some(f=>f.state==='RESOLVED')&&members.some(g=>g.includes('left.csv')&&g.includes('right.csv')));
 if(x.id==='PARAPHRASE'){assert(frames.some(f=>f.embedded_event_ids.length===2&&f.state==='RESOLVED'));assert(members.some(g=>g.includes('warm')&&g.includes('cold')));}
 if(x.id==='MALFORMED')assert(frames.some(f=>f.state==='UNRESOLVED'));
 if(x.id==='CONTENT')assert(!resolved('A').some(e=>e.display_value.includes('检查')));
 if(x.id==='NEGATIVE')assert(!resolved('A').length);
 if(x.id==='AMBIG_COUNT')assert(c.unresolved.some(u=>u.kind==='UNRESOLVED_QUANTIFICATION')&&!resolved('A').length);
 if(x.id==='RESULT')assert(resolved('O').some(e=>e.display_value==='result.json'));
 if(x.id==='ALTERNATIVE')assert(c.unresolved.some(u=>u.reason.includes('alternative-set'))&&!resolved('A').length);
});
test('005 typed identifier prevails under injected noisy PERSON evidence',()=>{const x=load('TECHNICAL'),s=x.signals.clauses[0],t=s.tokens.find(t=>t.text==='retry_counter');s.entities.push({label:'PERSON',text:t.text,span:{...t.span}});const f=candidateGraph(sourceDocument(x.text),x.signals);assert(f.semantic_nodes.filter(n=>n.surface===t.text).every(n=>n.metadata.participant_eligibility.eligible===false));});
test('005 exporter renders own native revision without legacy or semantic mutation',()=>{const x=load('ROOT'),r=compileNative(sourceDocument(x.text),x.signals),before=JSON.stringify(r);assert(traceMarkdown(r).includes('canonical_7plus1'));assert(traceHTML(r).includes('compiler-v03-snapshot'));assert.equal(JSON.stringify(r),before);});
test('005 implementation never reads fixtures, expected answers or projection',()=>{const code=fs.readFileSync('research/7plus1-parser/v0.3-7p-closure-008/candidate-recall.mjs','utf8');assert(!/SWAI-|REF-001|next_seq|archived|expected-7plus1|canonical_7plus1|\bfs\.|readFile/u.test(code));});
