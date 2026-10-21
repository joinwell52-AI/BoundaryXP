import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Role codes require a subject/by/recipient use-site; no title grants Authority.
export function participantSyntax(f){
 for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&['AGENT','RECIPIENT'].includes(r.relation_type))){
  const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),head=f.semantic_nodes.find(n=>n.node_id===r.head_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);
  if(r.relation_type==='RECIPIENT'&&head?.metadata.modality==='FORBIDDEN')continue;
  if(!n||!a||!['CURRENT_TASK','DELIVERABLE_SPEC','DECISION'].includes(a.discourse.kind)||n.node_type==='UNKNOWN_REFERENT')continue;
  const primary=f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),tokens=a.cl.tokens.filter(t=>t.start>=primary.start&&t.end<=primary.end);
  const roleCode=/^[A-Z][A-Z0-9_-]{1,15}$/u.test(n.surface),named=a.cl.entities.some(e=>['PERSON','PER'].includes(e.label)&&e.span.start>=primary.start&&e.span.end<=primary.end);
  const subject=n.metadata.argument_role==='ORGANIZATION_SUBJECT'||tokens.some(t=>/nsubj/u.test(t.dep??'')||a.cl.tokens.some(q=>q.head===a.cl.tokens.indexOf(t)&&q.dep==='case'&&/^(由|by|向|to)$/iu.test(q.text)));
  if((roleCode||named)&&subject&&!['FILEPATH','REFERENCE','VERSION','COMMIT','SYSTEM','URI'].includes(n.metadata.literal_tag)){
   n.metadata.participant_eligibility={eligible:true,reason:'TYPED_EXPLICIT_DEPENDENCY_PARTICIPATION',source_span_ids:uniq([a.sid,...n.source_span_ids]),token_ids:tokens.map(t=>t.id),authority_inferred:false};
   n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),r.relation_type==='RECIPIENT'?'RECIPIENT':/^(复核|审核|审阅|确认|确保|review|reviews|reviewed|confirm|confirms|ensure|ensures)$/iu.test(head.surface)?'REVIEWER':'PERFORMER']);
  }
 }
 return f;
}
