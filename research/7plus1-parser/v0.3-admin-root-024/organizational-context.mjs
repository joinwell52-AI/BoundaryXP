import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';

// Explicit delegation of internal work allocation is an organizational root
// constraint. It neither declares a WP nor invents the delegated work plan.
export function organizationalContext(f){
 const {edge,retire}=graphApi(f),log=[];f.semantic_decoding.organizational_context_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  const ts=a.cl.tokens;
  const organizer=ts.find(t=>/^(组织|organize|organise)$/iu.test(t.text)&&ts.some(q=>q.start<t.start&&/^(请|please|must|shall)$/iu.test(q.text)));
  if(organizer){const directive=ts[organizer.head],subjects=ts.filter(t=>(t.head===ts.indexOf(organizer)||/^(请|please)$/iu.test(directive?.text??'')&&t.head===organizer.head&&/^(dobj|obj|nsubj)$/u.test(t.dep??''))&&t.end<=organizer.start&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text));if(subjects.length===1){
   const t=subjects[0],who=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:t.id,owner:a.cl.id,discourse:a.discourse}),st=f.tools.node(a.cl,'STATE',t.start,organizer.end,{sense:'ROOT_ORGANIZATION_RESPONSIBILITY',owner:a.cl.id,discourse:a.discourse,WP_decomposition:false,authority_inferred:false});
   // Nominal review under "organize" does not assert that the organizer is
   // personally the reviewer. Rebuild that use-site's role from its owner.
   for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.source_span_ids.some(i=>f.source_spans.find(s=>s.span_id===i)?.start===t.start)&&n.metadata.participant_eligibility?.eligible)){n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]).filter(role=>role!=='REVIEWER'),'PERFORMER']);f.admin_explicit_roles.set(n.node_id,n.metadata.participant_roles);}
   who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_ROOT_ORGANIZER_SUBJECT',source_span_ids:[a.sid,...who.source_span_ids],authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]).filter(role=>role!=='REVIEWER'),'PERFORMER']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);const r=edge(a,'AGENT',st,who);log.push({clause_id:a.cl.id,state_node_id:st.node_id,delegate_node_id:who.node_id,relation_ids:[r.relation_id],source_span_ids:[a.sid],rule:'EXPLICIT_ROOT_ORGANIZER_RESPONSIBILITY'});
  }}
  const p=ts.find(t=>/^(决定|decide|decides)$/iu.test(t.text));if(!p)continue;
  const pi=ts.indexOf(p),fr=(a.cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===pi)),obj=fr?.find(r=>r[1]==='ARG1');
  if(!obj)continue;const objectTokens=ts.slice(obj[2],obj[3]);
  if(!objectTokens.some(t=>/^(分工|allocation)$/iu.test(t.text))||!objectTokens.some(t=>/^(团队|内部|人员|如何|具体|internal|team|staff)$/iu.test(t.text)))continue;
  const subjects=ts.filter(t=>t.head===pi&&(t.dep==='nsubj'||ts.some(q=>q.head===ts.indexOf(t)&&q.dep==='case'&&/^(由|by)$/iu.test(q.text)))&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text));if(subjects.length!==1)continue;
  const t=subjects[0];retire(a,'INTERNAL_WORK_ALLOCATION_IS_ORGANIZATIONAL_CONTEXT');
  const st=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'INTERNAL_WORK_ALLOCATION_DELEGATION',owner:a.cl.id,discourse:a.discourse,WP_decomposition:false,authority_inferred:false}),domain=f.tools.node(a.cl,'ENTITY',objectTokens[0].start,objectTokens.at(-1).end,{sense:'INTERNAL_WORK_ALLOCATION_DOMAIN',owner:st.node_id,discourse:a.discourse}),who=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:t.id,owner:a.cl.id,discourse:a.discourse});
  who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_INTERNAL_ALLOCATION_DELEGATE',source_span_ids:uniq([a.sid,...who.source_span_ids]),authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]),'COLLABORATOR']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);
  const ownership=edge(a,'AGENT',st,who),argument=edge(a,'CONJUNCTION',st,domain);ownership.dependency_relation_ids=[argument.relation_id];a.state=st;
  log.push({clause_id:a.cl.id,state_node_id:st.node_id,delegate_node_id:who.node_id,domain_node_id:domain.node_id,relation_ids:[ownership.relation_id,argument.relation_id],source_span_ids:[a.sid],rule:'EXPLICIT_INTERNAL_WORK_ALLOCATION_DELEGATION'});
 }
 return f;
}
