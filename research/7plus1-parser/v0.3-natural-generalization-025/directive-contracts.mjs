import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {graphApi} from './migration/graph-api.mjs';
export function directiveDiscourse(f){
 for(const a of f.analyses)if(a.cl.quoted_directive){
  const wrapper=f.analyses.find(b=>b.cl.id===a.cl.quoted_directive.wrapper_clause_id);
  if(!wrapper||!['CURRENT_TASK','DELIVERABLE_SPEC'].includes(wrapper.discourse.kind))continue;
  a.discourse={...wrapper.discourse,kind:'CURRENT_TASK',syntactic_layer:'EXPLICIT_GOVERNED_QUOTED_COMMAND',quoted_directive:a.cl.quoted_directive};
  for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id))n.metadata.discourse=a.discourse;
 }
 return f;
}
export function directiveOwnership(f){
 buildSemanticOwnership(f,'CANDIDATE_EVIDENCE');
 for(const a of f.analyses.filter(a=>a.cl.quoted_directive&&a.discourse.kind==='CURRENT_TASK')){
  const q=a.cl.quoted_directive,marker=f.tools.span(q.governor_span.start,q.governor_span.end),text=f.source_spans.find(s=>s.span_id===marker)?.text;
  if(!/^(要求|require|request)$/iu.test(text??''))continue;
  for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id)){
   const owner=n.metadata.semantic_ownership;if(!owner)continue;
   owner.negative_ownership_evidence=owner.negative_ownership_evidence.filter(e=>e.reason!=='ENCLOSED_PREDICATE_HAS_NO_INDEPENDENT_MODAL_LICENSE');
   owner.inheritance_override_proof.push({rank:5,rule:'EXPLICIT_REQUIRE_GOVERNED_QUOTED_COMMAND',source_span_ids:[marker,...n.source_span_ids],structural_path:[q.wrapper_clause_id,a.cl.id],governor_token_id:q.governor_token_id});
   owner.predicate_layer='QUOTED_DIRECTIVE';
  }
 }
 return f;
}
export function quotedDirectiveRecipients(f){const {edge}=graphApi(f);
 for(const a of f.analyses.filter(a=>a.cl.quoted_directive))for(const e of a.events.filter(e=>e.metadata.sense==='send')){
  const ts=a.cl.tokens,at=ts.findIndex(t=>t.start===f.source_spans.find(s=>s.span_id===e.source_span_ids[0]).start),marker=ts.find(t=>t.head===at&&/^(给|to)$/iu.test(t.text)),recipient=marker&&ts.find(t=>t.head===at&&t.start>=marker.end&&/^(NR|NN|PROPN|NOUN)$/u.test(t.pos??''));
  if(!recipient||!(/^[A-Z][A-Z0-9_-]{1,15}$/u.test(recipient.text)||a.cl.entities.some(n=>['PERSON','PER'].includes(n.label)&&n.span.start===recipient.start&&n.span.end===recipient.end)))continue;
  const n=f.tools.node(a.cl,'ENTITY',recipient.start,recipient.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:recipient.id,owner:a.cl.id,discourse:a.discourse});n.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_QUOTED_TRANSFER_RECIPIENT',source_span_ids:[a.sid,...n.source_span_ids],authority_inferred:false};n.metadata.participant_roles=['RECIPIENT'];f.admin_explicit_roles.set(n.node_id,['RECIPIENT']);edge(a,'RECIPIENT',e,n);
 }
 return f;
}
