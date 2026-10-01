import {SLOTS,uniq} from './identity.mjs';
import {coarseImpact} from './coverage-fallback.mjs';
export const FACT_SLOTS=Object.freeze({TASK_OBJECT:'I',DELIVERABLE:'O',ACTION:'A',PARTICIPANT:'P',RESOURCE:'R',BASELINE:'V',COMPLETION:'C',STOP:'C',FORBID:'B',RESTRICT:'B'});
export function localizeCoverage(f){
 const nmap=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 function nodeSlots(n){
  if(!n)return [];
  if(n.node_type==='EVENT')return n.metadata.modality==='NOT_REQUIRED'?[]:n.metadata.completion||n.metadata.stop?['C']:n.metadata.modality==='FORBIDDEN'||n.metadata.restrict?['B']:['A',...(n.normalized==='generate'?['O']:[])];
  if(n.node_type==='STATE')return uniq(f.relations.filter(r=>r.head_node_id===n.node_id&&['CONDITION_OF','COMPLETION_OF','APPROVAL_OF'].includes(r.relation_type)).flatMap(r=>nodeSlots(nmap.get(r.tail_node_id))));
  if(n.metadata.participant_roles?.length)return ['P'];
  return uniq(f.relations.filter(r=>r.tail_node_id===n.node_id&&r.state!=='REJECTED').flatMap(r=>r.relation_type==='SCOPE_MEMBER'?['I']:r.relation_type==='BASIS'?['V']:r.relation_type==='LIMIT'?['R']:nodeSlots(nmap.get(r.head_node_id))));
 }
 for(const co of [...f.coverage].sort((a,b)=>Number(!a.clause_id)-Number(!b.clause_id))){
  const ds=f.eligibility_decisions.filter(e=>co.eligibility_decision_ids.includes(e.eligibility_decision_id));
  const us=f.unresolved.filter(u=>co.unresolved_refs.includes(u.unresolved_id));
  const problematic=['UNRESOLVED','COVERAGE_FAILURE'].includes(co.disposition);
  const evidenceDecisions=problematic?ds.filter(e=>e.unresolved_ref||['UNRESOLVED','COVERAGE_FAILURE'].includes(e.disposition)):ds;
  const known=uniq([...evidenceDecisions.flatMap(e=>FACT_SLOTS[e.proposed_fact_type]?[FACT_SLOTS[e.proposed_fact_type]]:e.candidate_node_ids.flatMap(i=>nodeSlots(nmap.get(i)))),...us.flatMap(u=>u.related_node_ids.flatMap(i=>nodeSlots(nmap.get(i))))]);
  // No typed endpoint means no justified exclusion of any slot. Fail conservatively, explicitly.
  const untypedFailure=co.disposition==='COVERAGE_FAILURE'&&!ds.some(e=>e.candidate_node_ids.length||e.proposed_fact_type);
  const cl=f.nlp_signals.clauses.find(c=>c.id===co.clause_id),fallback=untypedFailure&&cl?coarseImpact(cl):null;
  const children=!co.clause_id?f.coverage.filter(child=>child.clause_id&&f.structure.nodes.find(n=>n.structure_node_id===child.structure_node_id)?.parent_id===co.structure_node_id&&['UNRESOLVED','COVERAGE_FAILURE'].includes(child.disposition)):[];
  const childSlots=uniq(children.flatMap(c=>c.affected_slots??[]));
  co.affected_slots=untypedFailure?(fallback?fallback.slots:children.length?childSlots:[...SLOTS]):uniq([...known,...childSlots]);
  co.impact_kind=us.some(u=>u.kind==='UNRESOLVED_SCOPE')?'MAY_CHANGE_SCOPE':us.some(u=>u.kind==='UNRESOLVED_COREFERENCE')?'MAY_CHANGE_ENTRY':'MAY_ADD_ENTRY';
  co.impact_evidence={eligibility_decision_ids:ds.map(e=>e.eligibility_decision_id),unresolved_refs:us.map(u=>u.unresolved_id),untyped_source_failure:untypedFailure,...(fallback?{coarse_fallback:fallback}:{}),...(children.length?{child_coverage_ids:children.map(c=>c.coverage_record_id)}:{})};
 }
 return f;
}
