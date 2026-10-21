import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Adapt migrated candidate certificates into the canonical coreference domain.
// Selection is copied only from their explicit unique source-backed domains.
export function coreferenceContracts(f){
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),log=[];f.semantic_decoding.coreference_contract_ir=log;
 for(const record of f.semantic_decoding.participant_role_ir??[]){
  if(record.rule!=='UNIQUE_SOURCE_TYPED_PARTICIPANT_ALIAS')continue;
  const n=nm(record.participant_node_id),target=nm(record.referent_node_id);if(!n||!target)continue;
  const candidates=f.semantic_nodes.filter(p=>p.metadata.participant_eligibility?.eligible&&p.metadata.identity_name===n.surface&&p.metadata.qualified_identity_evidence);
  const domain=[...new Map(candidates.map(p=>[p.node_id,p])).values()];
  if(!domain.some(p=>p.node_id===target.node_id)||new Set(domain.map(p=>JSON.stringify(p.metadata.qualified_identity_evidence.name_span))).size!==1)continue;
  n.metadata.resolution={rule:record.rule,candidate_node_ids:[target.node_id],selected_node_ids:[target.node_id],structural_path:[n.metadata.clause_id,target.metadata.clause_id],source_span_ids:uniq(record.source_span_ids)};log.push({node_id:n.node_id,...n.metadata.resolution});
 }
 return f;
}
