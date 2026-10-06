// The sealed v0.3 transport has a two-state SemanticNode enum and the older
// SpanCandidateStatus enum. These are compatibility shapes AFTER Γ, never
// candidate generation or decoding inputs. Full 026 statuses live in Gc/Γ.
export function contractNode(n,G){
 const {candidate_node_id,candidate_node_state,provider_ids,...body}=n;
 const d=G.node_decisions.find(d=>d.node_id===n.node_id);
 if(d.decision==='REJECTED')throw Error('REJECTED_NODE_BELONGS_TO_GC_HISTORY_NOT_GB_GU');
 return {...body,metadata:{...n.metadata,candidate_node_provenance:{candidate_node_id,candidate_node_state,provider_ids},gamma_node_decision:{gamma_decision_id:d.gamma_decision_id,decision:d.decision,reason:d.reason},transport_state_contract:'AFTER_GAMMA'}};
}
export function contractLattice(lattice){
 const candidates=lattice.candidates.map(c=>({span_candidate_id:c.span_candidate_id,source_span_id:c.source_span_id,candidate_type:c.candidate_type==='TYPED_LITERAL'?'ENTITY':c.candidate_type,status:'CANDIDATE',evidence_tier:c.evidence_tier,provider_refs:c.provider_refs,diagnostic_refs:c.diagnostic_refs,...(c.literal_tag?{literal_tag:c.literal_tag}:{})}));
 const edges=lattice.edges.map(e=>({edge_id:e.edge_id,edge_type:e.type==='OVERLAPS'?'OVERLAPS':e.type==='COEXTENSIVE'?'CAN_COEXIST':'CONTAINS',from_span_candidate_id:e.type==='CONTAINED_BY'?e.to_candidate_id:e.from_candidate_id,to_span_candidate_id:e.type==='CONTAINED_BY'?e.from_candidate_id:e.to_candidate_id}));
 return {source_id:lattice.source_id,candidates,edges};
}
