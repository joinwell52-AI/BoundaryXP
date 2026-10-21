import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';
export function communicationArguments(f){
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),log=[];f.semantic_decoding.communication_argument_ir=log;
 for(const a of f.analyses)for(const e of a.events){
  if(['send','notify','report','publish','upload','access'].includes(e.metadata.sense)&&e.metadata.modality==='FORBIDDEN'){
   const ts=a.cl.tokens,primary=f.source_spans.find(s=>s.span_id===e.source_span_ids[0]),finite=ts.filter(t=>/^(VV|VERB)$/u.test(t.pos??'')&&primary&&t.start>=primary.start&&t.end<=primary.end),p=ts.find(t=>t.id===e.metadata.token_id||e.source_span_ids.some(i=>{const s=f.source_spans.find(s=>s.span_id===i);return s?.start===t.start&&s?.end===t.end;}))??(finite.length===1?finite[0]:null),pi=ts.indexOf(p),preps=ts.filter(t=>t.head===pi&&/^(prep|dative)$/u.test(t.dep??'')&&/^to$/iu.test(t.text));
   if(pi<0)continue;
   const recipientFrame=(a.cl.srl??[]).find(fr=>fr.some(row=>row[1]==='PRED'&&row[2]===pi)),recipientArgument=recipientFrame?.find(row=>row[1]==='ARG2'&&row[2]>pi),direction=recipientArgument&&ts.find(q=>q.head===pi&&/^(向|给|到)$/u.test(q.text)&&q.start>=p.end&&q.end<=ts[recipientArgument[2]]?.start);
   const targets=ts.filter(t=>preps.some(prep=>t.head===ts.indexOf(prep))&&t.dep==='pobj'||t.head===pi&&(ts.some(q=>q.head===ts.indexOf(t)&&q.dep==='case'&&/^(向|给|到)$/u.test(q.text))||direction&&t.start>=ts[recipientArgument[2]].start&&t.end<=ts[recipientArgument[3]-1].end));
   if(targets.length===1){
    const t=targets[0],[start,end]=modifierPhrase(a.cl,t),n=f.tools.node(a.cl,'ENTITY',start,end,{sense:'PROHIBITED_DESTINATION',token_id:t.id,owner:e.node_id,discourse:a.discourse,argument_role:'PROHIBITED_RECIPIENT'});
    n.metadata.participant_eligibility={eligible:false,reason:'NEGATIVE_DESTINATION_DOES_NOT_ASSIGN_PARTICIPATION',source_span_ids:[a.sid,...n.source_span_ids]};
    const markers=ts.filter(q=>q.head===ts.indexOf(t)&&q.dep==='case'||preps.includes(q)||q===direction),r=f.tools.relation(a.cl,'RECIPIENT',e,n,[a.sid,...markers.map(q=>f.tools.span(q.start,q.end))]);r.state='SUPPORTED';r.argument_contract={kind:'EXPLICIT_PROHIBITED_DESTINATION',marker_token_ids:markers.map(q=>q.id),object_token_id:t.id,source_span_ids:r.evidence_span_ids};
    for(const prior of f.relations.filter(q=>q!==r&&q.state==='SUPPORTED'&&q.head_node_id===e.node_id&&q.relation_type==='RECIPIENT')){prior.state='REJECTED';prior.rejection_reason='NEGATIVE_DESTINATION_IS_NOT_PARTICIPANT_ASSIGNMENT';}
    log.push({event_node_id:e.node_id,destination_node_id:n.node_id,relation_id:r.relation_id,rule:'EXPLICIT_PROHIBITED_DESTINATION',source_span_ids:r.evidence_span_ids});
   }
   continue;
  }
  if(['send','notify','report'].includes(e.metadata.sense)&&!e.metadata.retired_by_admin_root){
   const ts=a.cl.tokens,p=ts.find(t=>t.id===e.metadata.token_id),pi=ts.indexOf(p);
   const prepositions=ts.filter(t=>t.head===pi&&/^(prep|dative)$/u.test(t.dep??'')&&/^to$/iu.test(t.text));
   const recipients=ts.filter(t=>prepositions.some(prep=>t.head===ts.indexOf(prep))&&t.dep==='pobj'&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text));
   if(recipients.length===1){const t=recipients[0],who=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:t.id,owner:e.node_id,discourse:a.discourse});who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_DATIVE_RECIPIENT',source_span_ids:[a.sid,...who.source_span_ids],authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]),'RECIPIENT']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);const r=f.tools.relation(a.cl,'RECIPIENT',e,who,[a.sid]);r.state='SUPPORTED';log.push({event_node_id:e.node_id,recipient_node_id:who.node_id,relation_id:r.relation_id,source_span_ids:[a.sid,...who.source_span_ids],rule:'EXPLICIT_DATIVE_RECIPIENT'});}
  }
  if(e.metadata.sense==='explain'){
   const ts=a.cl.tokens,p=ts.find(t=>t.id===e.metadata.token_id||t.start===f.source_spans.find(s=>s.span_id===e.source_span_ids[0]).start),pi=ts.indexOf(p),frame=(a.cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===pi)),arg=frame?.find(r=>r[1]==='ARG1'&&ts[r[2]]?.start>=p?.end),recipient=ts.filter(t=>t.head===pi&&ts.some(q=>q.head===ts.indexOf(t)&&q.dep==='case'&&/^(向|给|to)$/iu.test(q.text))&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text));
   if(arg&&recipient.length===1){
    const message=f.tools.node(a.cl,'ENTITY',ts[arg[2]].start,ts[arg[3]-1].end,{sense:'MESSAGE_CONTENT',owner:e.node_id,discourse:a.discourse,argument_role:'MESSAGE'}),t=recipient[0],who=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:t.id,owner:a.cl.id,discourse:a.discourse});
    who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_MESSAGE_RECIPIENT',source_span_ids:[a.sid,...who.source_span_ids],authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]),'RECIPIENT']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);
    for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME'].includes(r.relation_type))){r.state='REJECTED';r.rejection_reason='MESSAGE_ARGUMENT_ROLES';}
    const theme=f.tools.relation(a.cl,'THEME',e,message,[a.sid]),receiver=f.tools.relation(a.cl,'RECIPIENT',e,who,[a.sid]);theme.state='SUPPORTED';receiver.state='SUPPORTED';
    for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.clause_id===a.cl.id&&r.relation_type==='SCOPE_MEMBER')){r.state='REJECTED';r.rejection_reason='MESSAGE_CONTENT_IS_NOT_EXTERNAL_INPUT';}
    const plan=f.expression_plans.get(e.node_id);if(plan)delete plan.scope_expr_id;
    log.push({event_node_id:e.node_id,message_node_id:message.node_id,recipient_node_id:who.node_id,relation_ids:[theme.relation_id,receiver.relation_id],source_span_ids:[a.sid],rule:'EXPLICIT_EXPLANATION_MESSAGE_ROLES'});
   }
  }
  if(e.metadata.sense==='report'&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)){
   e.metadata.recipient_only=true;e.metadata.argument_contract='INTRANSITIVE_REPORT_MESSAGE_OPEN';
  }
  if(e.metadata.sense!=='notify'||!['REQUIRED','PERMITTED'].includes(e.metadata.modality))continue;
  const p=a.cl.tokens.find(t=>t.id===e.metadata.token_id||t.start===f.source_spans.find(s=>s.span_id===e.source_span_ids[0]).start),pi=a.cl.tokens.indexOf(p);if(pi<0)continue;
  for(const old of f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'&&r.relation_type==='PATIENT')){
   const n=nm(old.tail_node_id),s=f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),ts=a.cl.tokens.filter(t=>t.start>=s.start&&t.end<=s.end);
   if(!ts.some(t=>t.head===pi&&/^(dobj|obj|nsubjpass|nsubj:pass)$/u.test(t.dep??''))||!(/^[A-Z][A-Z0-9_-]{1,15}$/u.test(n.surface)||a.cl.entities.some(x=>['PERSON','PER'].includes(x.label)&&x.span.start>=s.start&&x.span.end<=s.end)))continue;
   old.state='REJECTED';const r=f.tools.relation(a.cl,'RECIPIENT',e,n,[a.sid]);r.state='SUPPORTED';delete r.unresolved_ref;n.metadata.participant_eligibility={eligible:true,reason:'NOTIFICATION_RECIPIENT_DEPENDENCY',source_span_ids:uniq([a.sid,...n.source_span_ids]),authority_inferred:false};n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),'RECIPIENT']);f.admin_explicit_roles.set(n.node_id,n.metadata.participant_roles);e.metadata.recipient_only=true;const plan=f.expression_plans.get(e.node_id);if(plan){const {scope_expr_id,...rest}=plan;f.expression_plans.set(e.node_id,rest);}log.push({event_node_id:e.node_id,recipient_node_id:n.node_id,relation_id:r.relation_id,source_span_ids:[a.sid,...n.source_span_ids]});
  }
 }
 return f;
}
