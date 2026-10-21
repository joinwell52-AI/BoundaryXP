// Repeated producers may propose the same exact source-denoting membership.
// Identity requires the same root, exact span and compatible endpoint type;
// lexical similarity or repeated names at different offsets are insufficient.
export function scopeMembershipIdentity(f){
 const nodes=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),spans=new Map(f.source_spans.map(s=>[s.span_id,s])),groups=new Map(),log=[];
 f.semantic_decoding.scope_membership_identity_ir=log;
 for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='SCOPE_MEMBER')){
  const n=nodes.get(r.tail_node_id),s=spans.get(n?.source_span_ids[0]);if(!s||n.node_type!=='ENTITY')continue;
  const key=[r.head_node_id,n.node_type,s.start,s.end,n.metadata.semantic_ownership?.domain??n.metadata.discourse?.kind??'CURRENT_TASK'].join(':');
  const prior=groups.get(key);if(!prior){groups.set(key,r);continue;}
  r.state='REJECTED';r.rejection_reason='DUPLICATE_EXACT_SOURCE_MEMBERSHIP';
  log.push({retained_relation_id:prior.relation_id,rejected_relation_id:r.relation_id,endpoint_node_ids:[prior.tail_node_id,r.tail_node_id],source_span_ids:[s.span_id],rule:'EXACT_SOURCE_TYPED_MEMBERSHIP_IDENTITY'});
 }
 return f;
}
