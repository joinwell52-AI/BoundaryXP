import {projectCanonical} from '../v0.3-7p-composition-014/projection.mjs';
import {certifyCandidateGraph} from './gamma.mjs';
const slots=['I','O','A','P','R','V','C','B'];
export function noBypassGates(c){
 const g=c.candidate_semantic_graph,G=c.gamma_certification,cs=new Map((g?.candidate_relations??[]).map(x=>[x.relation_id,x])),ds=new Map((G?.decisions??[]).map(x=>[x.relation_id,x]));
 const errors=Object.fromEntries(Array.from({length:12},(_,i)=>['G'+(i+1),[]]));
 const fail=(gate,msg)=>errors[gate].push(msg);
 if(!g?.graph_id||g.phase!=='FROZEN_BEFORE_GAMMA')fail('G10','RUNTIME_CANDIDATE_GRAPH_MISSING');
 if(!G||G.consumed_graph_id!==g?.graph_id||JSON.stringify(G.consumed_candidate_ids)!==JSON.stringify(g?.candidate_relation_ids))fail('G11','GAMMA_DID_NOT_CONSUME_THIS_GRAPH');
 if(g?.phase==='FROZEN_BEFORE_GAMMA'&&JSON.stringify(certifyCandidateGraph(g))!==JSON.stringify(G))fail('G11','GAMMA_RECEIPT_DOES_NOT_REPLAY');
 for(const r of c.relations){const candidate=cs.get(r.relation_id),d=ds.get(r.relation_id),key=r.state==='RESOLVED'?'G5':r.state==='REJECTED'?'G6':'G7';
  if(!candidate)fail(key,r.relation_id);
  const expected=r.state==='RESOLVED'?'CERTIFIED':r.state==='REJECTED'?'REJECTED':'TYPED_UNRESOLVED';
  if(!d||d.decision!==expected||d.candidate_relation_id!==candidate?.candidate_relation_id||r.head_node_id!==candidate?.head_node_id||r.tail_node_id!==candidate?.tail_node_id||r.relation_type!==candidate?.relation_type){if(r.state==='RESOLVED')fail('G9',r.relation_id);else fail(key,'DECISION_MISMATCH '+r.relation_id);}
  if(r.state==='RESOLVED'&&r.rule_refs.some(x=>x.startsWith('NATIVE_'))&&(!d||d.decision!=='CERTIFIED'))fail('G3',r.relation_id);
  if(r.state==='RESOLVED'&&r.model_signal_refs.length&&(!d||d.decision!=='CERTIFIED'))fail('G4',r.relation_id);
 }
 const sm=new Map((g?.source_spans??[]).map(s=>[s.span_id,s])),points=[...g?.source_text??''];
 for(const x of [...g?.semantic_nodes??[],...g?.candidate_relations??[],...g?.candidate_expressions??[]])if(!x.source_span_ids?.length||x.source_span_ids.some(i=>{const s=sm.get(i);return !s||s.end<=s.start||points.slice(s.start,s.end).join('')!==s.text;}))fail('G8',x.candidate_relation_id??x.candidate_expression_id??x.node_id);
 for(const f of c.boundary_ir.facts){const receipt=c.boundary_certification?.find(x=>x.boundary_fact_id===f.boundary_fact_id),ed=c.eligibility_decisions.find(e=>e.eligibility_decision_id===f.eligibility_decision_id);
  if(!receipt||!ed||!['BOUNDARY','AUXILIARY'].includes(ed.disposition))fail('G2',f.boundary_fact_id);
  if(f.state==='RESOLVED'&&(!receipt||receipt.status!=='CERTIFIED'||f.relation_ids.some(i=>ds.get(i)?.decision!=='CERTIFIED')))fail('G12',f.boundary_fact_id);
 }
 for(const s of slots)for(const e of c.canonical_7plus1[s].entries){if(!e.boundary_fact_ids.length||e.boundary_fact_ids.some(i=>!c.boundary_ir.facts.some(f=>f.boundary_fact_id===i)))fail('G1',e.canonical_entry_id);}
 const recomputed=projectCanonical(c.boundary_ir,c.semantic_nodes,c.coverage,c.unresolved);
 if(JSON.stringify(recomputed)!==JSON.stringify(c.canonical_7plus1))fail('G12','NON_DETERMINISTIC_OR_DIRECT_SLOT_WRITE');
 const gates=Object.fromEntries(Object.entries(errors).map(([k,v])=>[k,{status:v.length?'FAIL':'PASS',violations:v.length,errors:v}]));return {status:Object.values(gates).every(g=>g.status==='PASS')?'PASS':'FAIL',gates};
}
export function assertNoBypass(c){const g=noBypassGates(c);if(g.status!=='PASS')throw Error('CANDIDATE_GRAPH_GATE_FAILURE '+JSON.stringify(g));return g;}

