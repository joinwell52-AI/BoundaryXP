import {certifyCandidateGraph} from './gamma.mjs';
import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';
import {CANDIDATE_STATES} from './candidate-store.mjs';
export function noBypassGates(c){
 const g=c.candidate_semantic_graph,G=c.gamma_certification,errors=Object.fromEntries(Array.from({length:12},(_,i)=>['G'+(i+1),[]])),fail=(k,reason)=>errors[k].push(reason);
 const cs=new Map(g.candidate_relations.map(r=>[r.relation_id,r])),ds=new Map(G.decisions.map(d=>[d.relation_id,d])),points=[...g.source_text],sm=new Map(g.source_spans.map(s=>[s.span_id,s]));
 for(const entry of [...'IOAPRVCB'].flatMap(s=>c.canonical_7plus1[s].entries))if(entry.boundary_fact_ids.some(i=>!c.boundary_ir.facts.some(f=>f.boundary_fact_id===i)))fail('G1','CANONICAL_WITHOUT_BOUNDARY_FACT');
 for(const fact of c.boundary_ir.facts){if(!c.eligibility_decisions.some(e=>e.eligibility_decision_id===fact.eligibility_decision_id))fail('G2','FACT_WITHOUT_ELIGIBILITY');if(fact.state==='RESOLVED'&&fact.relation_ids.some(i=>ds.get(i)?.decision!=='CERTIFIED'))fail('G12','RESOLVED_FACT_WITHOUT_CERTIFIED_RELATIONS');}
 for(const r of c.relations){const d=ds.get(r.relation_id);if(r.state==='RESOLVED'&&(!d||d.decision!=='CERTIFIED'))fail(r.model_signal_refs?.length?'G3':'G4','CERTIFIED_RELATION_WITHOUT_GAMMA');if(!cs.has(r.relation_id))fail('G9','RELATION_WITHOUT_PERSISTED_CANDIDATE');}
 const alternatives=g.span_lattice.candidates.length>1&&g.span_lattice.candidates.some(a=>g.span_lattice.candidates.some(b=>a!==b&&a.source_span.start<b.source_span.end&&b.source_span.start<a.source_span.end));
 if(alternatives&&!g.span_lattice.edges.length)fail('G5','ALTERNATIVES_WITHOUT_LATTICE_EDGES');
 for(const n of g.semantic_nodes)if(!CANDIDATE_STATES.has(n.state)||!CANDIDATE_STATES.has(n.candidate_node_state))fail('G6','PRE_GAMMA_FINAL_NODE_STATE '+n.node_id);
 for(const s of g.span_lattice.candidates)if(!CANDIDATE_STATES.has(s.status)&&s.status!=='PROTECTED_EXACT_SPAN')fail('G6','PRE_GAMMA_SELECTED_SPAN');
 for(const r of g.candidate_relations)if(!CANDIDATE_STATES.has(r.state)||!CANDIDATE_STATES.has(r.candidate_status))fail('G7','PRE_GAMMA_FINAL_RELATION_STATE '+r.relation_id);
 for(const [key,count] of Object.entries(g.runtime_observation.counts))if(count!==0)fail('G7','OBSERVED_PRE_GAMMA_VIOLATION '+key+' '+count);
 if(!c.nlp_signals.semantic_decoding.generic_relation_generator?.bounded_domains?.length)fail('G8','GENERIC_GENERATOR_NOT_A_RUNTIME_STAGE');
 for(const d of G.decisions)if(!g.candidate_relations.some(r=>r.candidate_relation_id===d.candidate_relation_id))fail('G9','GAMMA_DECISION_WITHOUT_CANDIDATE');
 for(const group of g.competition_groups)if(!G.competition_decisions.some(d=>d.competition_group_id===group.competition_group_id))fail('G10','COMPETITION_GROUP_NOT_CONSUMED');
 if(JSON.stringify(G)!==JSON.stringify(certifyCandidateGraph(g)))fail('G11','GAMMA_NOT_DETERMINISTIC');
 if(JSON.stringify(c.canonical_7plus1)!==JSON.stringify(projectCanonical(c.boundary_ir,c.semantic_nodes,c.coverage,c.unresolved)))fail('G12','CANONICAL_NOT_DETERMINISTIC_PROJECTION');
 let candidate_provenance_gap=0;for(const item of [...g.semantic_nodes,...g.candidate_relations,...g.candidate_expressions])if(!item.source_span_ids?.length||item.source_span_ids.some(i=>{const s=sm.get(i);return !s||points.slice(s.start,s.end).join('')!==s.text;}))candidate_provenance_gap++;
 if(candidate_provenance_gap)fail('G9','CANDIDATE_PROVENANCE_GAP '+candidate_provenance_gap);
 const gates=Object.fromEntries(Object.entries(errors).map(([k,v])=>[k,{status:v.length?'FAIL':'PASS',violations:v.length,errors:v}]));
 return {status:Object.values(gates).every(g=>g.status==='PASS')?'PASS':'FAIL',gates,counts:{...g.runtime_observation.counts,certified_relation_without_candidate:c.relations.filter(r=>r.state==='RESOLVED'&&!cs.has(r.relation_id)).length,gamma_decision_without_candidate:G.decisions.filter(d=>!g.candidate_relations.some(r=>r.candidate_relation_id===d.candidate_relation_id)).length,candidate_provenance_gap}};
}
export function assertNoBypass(c){const audit=noBypassGates(c);if(audit.status!=='PASS')throw Error('CANDIDATE_GRAPH_GATE_FAILURE '+JSON.stringify(audit));return audit;}
