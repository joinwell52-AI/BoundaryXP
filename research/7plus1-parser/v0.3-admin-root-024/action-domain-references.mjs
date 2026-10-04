import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {PREDICATE_WORDS} from './migration/lexical.mjs';

// A stop/resume nominal names an existing operation, not an external input.
// Keep the nominal and its denoted event distinct in the frozen type contract.
export function actionDomainReferences(f){
 const {nm,sp,edge}=graphApi(f),log=[];f.semantic_decoding.action_domain_reference_ir=log;
 for(const r of [...f.relations].filter(r=>r.state==='SUPPORTED'&&r.relation_type==='PATIENT')){
  const event=nm(r.head_node_id),ref=nm(r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);
  if(!['stop','restore'].includes(event?.metadata.sense)||!a)continue;
  const local=ref.surface.replace(/^(后续|随后的|remaining\s+|further\s+)/iu,''),senses=Object.entries(PREDICATE_WORDS).filter(([,words])=>words.some(w=>w.toLowerCase()===local.toLowerCase())).map(([sense])=>sense);
  if(!senses.length)continue;
  const domain=f.semantic_nodes.filter(n=>n.node_type==='EVENT'&&f.relations.some(q=>q.state==='SUPPORTED'&&q.head_node_id===n.node_id&&['PATIENT','THEME','LOCATION'].includes(q.relation_type))&&['REQUIRED','PERMITTED'].includes(n.metadata.modality)&&senses.includes(n.metadata.sense)&&sp(n).end<sp(ref).start&&f.analyses.find(b=>b.cl.id===n.metadata.clause_id)?.parent_structure_id===a.parent_structure_id);
  const candidates=uniq(domain.map(n=>n.node_id));
  const body={reference_node_id:ref.node_id,candidate_event_ids:candidates,source_span_ids:uniq([a.sid,...ref.source_span_ids,...domain.flatMap(n=>n.source_span_ids)]),attachment_path:[a.parent_structure_id,a.cl.id,event.node_id,ref.node_id],rule:'UNIQUE_STRUCTURALLY_BOUNDED_ACTION_NOMINAL'};
  if(!candidates.length){log.push({...body,status:'EXPLICIT_NOMINAL_ONLY',reason:'The source directly names an operation; no prior event identity is asserted'});continue;}
  if(candidates.length!==1){const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Action-domain nominal lacks one compatible explicitly requested event',candidates);ref.state='UNRESOLVED';ref.unresolved_ref=u;r.state='INSUFFICIENT';r.unresolved_ref=u;log.push({...body,status:'UNRESOLVED',unresolved_id:u});continue;}
  const target=domain[0],association=edge(a,'CONJUNCTION',ref,target,body.source_span_ids);
  ref.metadata.action_reference={...body,event_node_id:target.node_id,relation_id:association.relation_id};
  r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),association.relation_id,...f.relations.filter(q=>q.state==='SUPPORTED'&&q.head_node_id===target.node_id&&['PATIENT','THEME','LOCATION'].includes(q.relation_type)).map(q=>q.relation_id)]);
  log.push({...body,event_node_id:target.node_id,relation_id:association.relation_id,status:'UNIQUE'});
 }
 return f;
}
