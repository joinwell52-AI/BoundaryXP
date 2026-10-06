import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
export const CANDIDATE_STATES=new Set(['PROPOSED','COMPETING','INSUFFICIENT','CONTRADICTED']);
// Proposal storage is append-only. Evidence can contradict a proposal; only Γ
// can convert that evidence into a final decision. No producer gets remove().
export function installCandidateStore(f){
 const g=f.candidate_semantic_graph;
 g.proposal_history=[];g.provider_inventory=[];g.node_hypotheses=[];g.competition_groups=[];
 const record=(kind,key,body,provider)=>{const proposal_id=id(g.graph_id,kind,key,body,provider);if(!g.proposal_history.some(x=>x.proposal_id===proposal_id))g.proposal_history.push({proposal_id,kind,candidate_id:key,provider_id:provider,...structuredClone(body)});return proposal_id;};
 f.proposals={record,provider:'SOURCE_SYNTAX',contradict(candidate,reason,source_span_ids){candidate.candidate_status='CONTRADICTED';candidate.contradiction_evidence??=[];const witness={reason,source_span_ids:uniq(source_span_ids),provider_id:this.provider};candidate.contradiction_evidence.push(witness);record('CONTRADICTION',candidate.node_id??candidate.relation_id,witness,this.provider);}};
 const oldNode=f.tools.node,oldRelation=f.tools.relation;
 f.tools.node=(cl,type,start,end,metadata={})=>{const n=oldNode(cl,type,start,end,metadata);n.candidate_node_id=n.node_id;n.candidate_node_state=n.state;n.provider_ids=uniq([...(n.provider_ids??[]),f.proposals.provider]);record('NODE',n.node_id,{node_type:type,source_span_ids:n.source_span_ids,metadata},f.proposals.provider);return n;};
 f.tools.relation=(cl,type,head,tail,spans=[])=>{const r=oldRelation(cl,type,head,tail,spans);if(!r)return r;r.head_candidate_node_id=head.node_id;r.tail_candidate_node_id=tail.node_id;r.candidate_status=r.state;r.provider_ids=uniq([...(r.provider_ids??[]),f.proposals.provider]);record('RELATION',r.candidate_relation_id,{relation_type:type,head_candidate_node_id:head.node_id,tail_candidate_node_id:tail.node_id,source_span_ids:r.evidence_span_ids},f.proposals.provider);return r;};
 for(const n of f.semantic_nodes){n.candidate_node_id=n.node_id;n.candidate_node_state=n.state;n.provider_ids=['SOURCE_SYNTAX'];record('NODE',n.node_id,{node_type:n.node_type,source_span_ids:n.source_span_ids,metadata:n.metadata},'SOURCE_SYNTAX');}
 for(const r of f.relations){r.head_candidate_node_id=r.head_node_id;r.tail_candidate_node_id=r.tail_node_id;r.candidate_status=r.state;r.provider_ids=['SOURCE_SYNTAX'];record('RELATION',r.candidate_relation_id,{relation_type:r.relation_type,head_candidate_node_id:r.head_node_id,tail_candidate_node_id:r.tail_node_id,source_span_ids:r.evidence_span_ids},'SOURCE_SYNTAX');}
 return f;
}
