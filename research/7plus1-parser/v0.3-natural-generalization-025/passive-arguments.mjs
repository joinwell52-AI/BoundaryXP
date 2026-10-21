import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';

// Passive grammar and typed source literals are independent evidence channels.
// A tagger's ADV/conj label cannot erase an explicit preposed FILE/role subject.
// Selection remains inside the predicate's explicit coordination segment.
export function passiveArguments(f){
 const {edge,expr,nm}=graphApi(f),log=[];f.semantic_decoding.passive_argument_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  const declared=/^(?:the\s+)?deliverable\s+is\s+(.+)$/iu.exec(a.cl.span.quote);
  if(declared){const files=f.nlp_signals.literals.filter(l=>['FILE','PATH','IDENTIFIER'].includes(l.type)&&l.span.start>=a.cl.span.start&&l.span.end<=a.cl.span.end&&/\.(?:md|txt|pdf|docx|json|csv|ya?ml)$/iu.test(l.span.quote));if(files.length===1&&declared[1].trim()===files[0].span.quote){const {retire,expr}=graphApi(f);retire(a,'EXPLICIT_SOURCE_DELIVERABLE_DECLARATION');const t=a.cl.tokens.find(t=>/^deliverable$/iu.test(t.text)),l=files[0];if(!t)continue;const n=f.tools.node(a.cl,'ENTITY',l.span.start,l.span.end,{sense:'DECLARED_ARTIFACT',literal_tag:'FILEPATH',literal_id:l.id,owner:a.cl.id,discourse:a.discourse}),e=f.tools.node(a.cl,'EVENT',t.start,t.end,{sense:'generate',modality:'REQUIRED',modality_rule:'EXPLICIT_DELIVERABLE_CONTRACT',result_declaration:true,owner:a.cl.id,discourse:a.discourse,token_id:t.id}),r=edge(a,'RESULT',e,n);f.expression_plans.set(e.node_id,{scope_expr_id:expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[r.relation_id]})});a.handled=true;log.push({rule:'EXPLICIT_DELIVERABLE_DECLARATION',event_node_id:e.node_id,argument_node_id:n.node_id,relation_id:r.relation_id,source_span_ids:uniq([a.sid,...n.source_span_ids])});}continue;}
  const ts=a.cl.tokens;
  for(const e of a.events){const own=f.source_spans.find(s=>s.span_id===e.source_span_ids[0]),pi=ts.findIndex(t=>t.id===e.metadata.token_id||own&&t.start===own.start&&t.end===own.end);if(pi<0)continue;const negative=ts.find(t=>/^(no|neither)$/iu.test(t.text)&&t.dep==='det'&&ts[t.head]?.head===pi),modal=ts.find(t=>t.head===pi&&/^(may|can|must|shall)$/iu.test(t.text));if(!negative||!modal)continue;
   e.metadata.modality='FORBIDDEN';e.metadata.modality_rule='NEGATIVE_QUANTIFIED_PASSIVE_PERMISSION';delete e.metadata.modality_unresolved;const olds=f.unresolved.filter(u=>u.related_node_ids.includes(e.node_id)&&/modality/iu.test(u.reason));f.unresolved=f.unresolved.filter(u=>!olds.includes(u));if(olds.some(u=>u.unresolved_id===e.unresolved_ref))delete e.unresolved_ref;
   const subject=ts[negative.head],n=f.tools.node(a.cl,'ENTITY',negative.start,subject.end,{sense:'NEGATIVE_PASSIVE_SUBJECT',owner:e.node_id,discourse:a.discourse,syntax_token_ids:[negative.id,subject.id]});for(const r of f.relations.filter(r=>r.head_node_id===e.node_id&&r.state==='SUPPORTED'&&['PATIENT','THEME','RESTRICTS'].includes(r.relation_type))){r.state='REJECTED';r.rejection_reason='NEGATIVE_PASSIVE_SUBJECT_RECONSTRUCTION';}const r=edge(a,'FORBIDS',e,n);f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),scope_expr_id:expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,relation_ids:[r.relation_id],source_span_ids:n.source_span_ids})});log.push({rule:'NEGATIVE_QUANTIFIED_PASSIVE_PERMISSION',event_node_id:e.node_id,argument_node_id:n.node_id,source_span_ids:uniq([a.sid,...n.source_span_ids]),token_ids:[negative.id,modal.id]});
  }
  for(const e of a.events.filter(e=>['generate','send','notify','read','review'].includes(e.metadata.sense))){
   const own=f.source_spans.find(s=>s.span_id===e.source_span_ids[0]),p=ts.find(t=>t.id===e.metadata.token_id||own&&t.start===own.start&&t.end===own.end),pi=ts.indexOf(p);if(pi<0)continue;e.metadata.token_id=p.id;
   const auxiliaries=ts.filter(t=>t.head===pi&&/^(auxpass|aux:pass)$/u.test(t.dep??''));if(auxiliaries.length!==1)continue;
   const aux=auxiliaries[0],bound=ts.filter((t,i)=>t.end<=aux.start&&(/^(and|or|otherwise)$/iu.test(t.text)||/^that$/iu.test(t.text)&&/^so$/iu.test(ts[i-1]?.text??''))).at(-1),start=bound?.end??a.cl.span.start;
   const subjectTokens=ts.filter(t=>t.start>=start&&t.end<=aux.start&&!/^(must|shall|should|may|can|will|the|a|an)$/iu.test(t.text));
   const files=f.nlp_signals.literals.filter(l=>(l.type==='FILE'||l.type==='IDENTIFIER'&&/\.(?:md|txt|pdf|docx|json|csv|ya?ml)$/iu.test(l.span.quote))&&l.span.start>=start&&l.span.end<=aux.start);
   let n=null,role=null;
   if(['generate','send','read','review'].includes(e.metadata.sense)&&files.length===1&&subjectTokens.every(t=>t.start>=files[0].span.start&&t.end<=files[0].span.end)){
    const l=files[0];n=f.tools.node(a.cl,'ENTITY',l.span.start,l.span.end,{sense:'PASSIVE_ARTIFACT_ARGUMENT',literal_id:l.id,literal_tag:'FILEPATH',owner:e.node_id,discourse:a.discourse,syntax_token_ids:subjectTokens.map(t=>t.id)});role=e.metadata.sense==='generate'?'RESULT':e.metadata.sense==='send'?'THEME':'PATIENT';
   }else if(e.metadata.sense==='notify'&&subjectTokens.length===1){
    const t=subjectTokens[0],person=/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text)||a.cl.entities.some(x=>['PERSON','PER'].includes(x.label)&&x.span.start===t.start&&x.span.end===t.end);
    if(person){n=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',token_id:t.id,owner:e.node_id,discourse:a.discourse,literal_tag:'PERSON'});role='RECIPIENT';
     n.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_TYPED_PASSIVE_RECIPIENT',source_span_ids:uniq([a.sid,...n.source_span_ids]),authority_inferred:false};n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),'RECIPIENT']);f.admin_explicit_roles.set(n.node_id,n.metadata.participant_roles);e.metadata.recipient_only=true;
    }
   }
   if(!n)continue;
   const governing=f.analyses.filter(p=>p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.start<=a.cl.span.start&&/\bso that\b/iu.test(p.cl.span.quote)&&p.organization_owner);
   if(e.metadata.modality==='UNSTATED'&&governing.length===1){e.metadata.modality='REQUIRED';e.metadata.modality_rule='EXPLICIT_ORGANIZATION_RESULT_CLAUSE';delete e.metadata.modality_unresolved;const old=f.unresolved.filter(u=>u.related_node_ids.includes(e.node_id)&&/modality/iu.test(u.reason));f.unresolved=f.unresolved.filter(u=>!old.includes(u));delete e.unresolved_ref;log.push({rule:'EXPLICIT_ORGANIZATION_RESULT_CLAUSE',event_node_id:e.node_id,governing_clause_id:governing[0].cl.id,source_span_ids:[a.sid,governing[0].sid],retired_diagnostics:structuredClone(old)});}
   const retired=[];
   for(const old of f.relations.filter(q=>q.head_node_id===e.node_id&&q.state==='SUPPORTED'&&['PATIENT','THEME','RESULT'].includes(q.relation_type))){if(old.tail_node_id===n.node_id&&old.relation_type===role)continue;old.state='REJECTED';old.rejection_reason='PASSIVE_SUBJECT_OWNS_TYPED_ARGUMENT';retired.push(old);}
   for(const old of retired)for(const scope of f.relations.filter(q=>q.state==='SUPPORTED'&&q.relation_type==='SCOPE_MEMBER'&&q.tail_node_id===old.tail_node_id&&q.clause_id===a.cl.id)){const other=f.relations.some(q=>q.state==='SUPPORTED'&&q.head_node_id!==e.node_id&&q.tail_node_id===old.tail_node_id&&['PATIENT','THEME'].includes(q.relation_type));if(!other){scope.state='REJECTED';scope.rejection_reason='RETIRED_PASSIVE_ARGUMENT_SCOPE';}}
   const r=edge(a,role,e,n);r.argument_inheritance={rule:'EXPLICIT_PASSIVE_TYPED_SUBJECT',structural_path:[a.parent_structure_id,a.cl.id,bound?.id??a.cl.id,aux.id,p.id],candidate_node_ids:[n.node_id],source_span_ids:uniq([a.sid,...n.source_span_ids])};
   // Notify's passive patient is also its recipient. Keep both explicit roles;
   // an object scope cannot point to a recipient-only relation.
   const operand=role==='RECIPIENT'?edge(a,'PATIENT',e,n):r;
   const scope=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,relation_ids:[operand.relation_id],source_span_ids:uniq([a.sid,...n.source_span_ids])});f.expression_plans.set(e.node_id,{...f.expression_plans.get(e.node_id),scope_expr_id:scope});
   if(['read','review'].includes(e.metadata.sense)){const input=edge(a,'SCOPE_MEMBER',f.tools.task,n);f.relation_scope_plans.set(input.relation_id,expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,relation_ids:[input.relation_id],source_span_ids:n.source_span_ids}));}
   for(const old of f.relations.filter(q=>q.head_node_id===e.node_id&&q.state==='SUPPORTED'&&q.relation_type==='AGENT')){if(subjectTokens.some(t=>f.semantic_nodes.find(n=>n.node_id===old.tail_node_id)?.surface===t.text)){old.state='REJECTED';old.rejection_reason='PASSIVE_SUBJECT_IS_NOT_AGENT';}}
   log.push({event_node_id:e.node_id,argument_node_id:n.node_id,relation_type:role,relation_id:r.relation_id,auxiliary_token_id:aux.id,source_span_ids:uniq([a.sid,...n.source_span_ids]),rule:'PASSIVE_GRAMMAR_AND_TYPED_SUBJECT'});
  }
 }
 return f;
}
