import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
export function transferSyntax(f){
 const {edge,sp}=graphApi(f),log=[];f.semantic_decoding.transfer_syntax_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const ts=a.cl.tokens;
  for(const e of a.events.filter(e=>e.metadata.sense==='send')){
   const p=ts.find(t=>t.id===e.metadata.token_id)||ts.find(t=>t.start===sp(e).start),pi=ts.indexOf(p);if(pi<0)continue;
   const subjects=ts.filter(t=>t.head===pi&&t.dep==='nsubj'&&/^(报告|文档|文件|report|document)$/iu.test(t.text));
   const receiver=ts.filter(t=>t.head===pi&&/^(dobj|obj)$/u.test(t.dep??'')&&a.cl.entities.some(n=>['PERSON','PER'].includes(n.label)&&n.span.start===t.start&&n.span.end===t.end)&&ts.some(q=>q.start>=p.end&&q.end<=t.start&&/^(给|to)$/iu.test(q.text)));
   if(subjects.length!==1||receiver.length!==1)continue;
   const prior=f.analyses.filter(b=>b.cl.sentence_id===a.cl.sentence_id&&b.cl.span.end<a.cl.span.start&&b.parent_structure_id===a.parent_structure_id),licenses=prior.flatMap(b=>b.events.filter(n=>n.metadata.modality==='REQUIRED'&&f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===n.node_id&&r.relation_type==='RESULT')));
   if(!['REQUIRED','PERMITTED'].includes(e.metadata.modality)&&(!licenses.length||!ts.some(t=>/^(最终|最后|finally)$/iu.test(t.text))))continue;
   const [start,end]=modifierPhrase(a.cl,subjects[0]),ref=f.tools.node(a.cl,'ENTITY',start,end,{sense:'LOCAL_ARTIFACT_REFERENCE',owner:e.node_id,discourse:a.discourse,token_id:subjects[0].id}),[rs,re]=modifierPhrase(a.cl,receiver[0]),person=f.tools.node(a.cl,'ENTITY',rs,re,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:receiver[0].id,owner:a.cl.id,discourse:a.discourse,identity_name:receiver[0].text,qualified_identity_evidence:{name_span:{start:receiver[0].start,end:receiver[0].end},full_span:{start:rs,end:re},rule:'EXPLICIT_APPOSITION_PERSON_NER'}});
   person.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_TRANSFER_RECIPIENT',source_span_ids:uniq([a.sid,...person.source_span_ids]),authority_inferred:false};person.metadata.participant_roles=['RECIPIENT'];f.admin_explicit_roles.set(person.node_id,['RECIPIENT']);
   for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME','AGENT','RECIPIENT'].includes(r.relation_type))){r.state='REJECTED';r.rejection_reason='PREPOSED_ARTIFACT_TRANSFER_ROLE_RECOVERY';}
   const message=edge(a,'THEME',e,ref),destination=edge(a,'RECIPIENT',e,person);e.metadata.modality='REQUIRED';e.metadata.modality_rule='EXPLICIT_FINAL_TRANSFER_IN_SAME_DIRECTIVE';
   const old=f.unresolved.filter(u=>u.related_clause_ids.length===1&&u.related_clause_ids[0]===a.cl.id&&u.related_node_ids.includes(e.node_id)&&/modality|Transfer object/iu.test(u.reason));
   const ids=new Set(old.map(u=>u.unresolved_id));f.unresolved=f.unresolved.filter(u=>!ids.has(u.unresolved_id));delete e.metadata.modality_unresolved;delete e.unresolved_ref;const plan=f.expression_plans.get(e.node_id);if(plan){delete plan.unresolved_ref;delete plan.scope_expr_id;}
   log.push({event_node_id:e.node_id,reference_node_id:ref.node_id,recipient_node_id:person.node_id,relation_ids:[message.relation_id,destination.relation_id],retired_diagnostics:structuredClone(old),source_span_ids:[a.sid,...licenses.flatMap(n=>n.source_span_ids)],rule:'PREPOSED_ARTIFACT_TRANSFER_WITH_EXPLICIT_RECIPIENT'});
  }
 }
 return f;
}
