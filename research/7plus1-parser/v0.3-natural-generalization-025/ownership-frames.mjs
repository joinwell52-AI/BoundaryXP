// Source/dependency-owned discourse and support governors. Candidate stage only.
import {graphApi} from './migration/graph-api.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {PREDICATE_WORDS} from './migration/lexical.mjs';
const organization=/^(负责|组织|organize|organise|coordinate)$/iu;
const cpLength=x=>[...x].length;
export function prepareOwnershipFrames(f){
 const {retire}=graphApi(f);f.semantic_decoding.governor_ownership_ir=[];
 for(const a of f.analyses){if(!boundaryDomain(a.discourse)||a.condition)continue;
  const ts=a.cl.tokens,org=ts.filter(t=>organization.test(t.lemma??t.text));if(!org.length)continue;
  const first=org[0],prefix=[...f.source.raw_text].slice(a.cl.span.start,first.start).join('');
  const match=/(?:(?:由|by)\s*|(?:请|please)\s*)?([^，。:：]+?)\s*$/iu.exec(prefix);if(!match)continue;
  let text=match[1].replace(/^(?:请|please)\s*/iu,'').replace(/^(?:(?:本|此|这)(?:次|项)?任务\s*(?:由)?\s*|the task\s*(?:by)?\s*)/iu,'').replace(/\s*(?:must|shall|is responsible for)\s*$/iu,'').trim();
  const located=/^(.+?)\s*(?:在|in\s+)(.+)$/iu.exec(text),locationText=located?.[2]?.trim();if(located)text=located[1].trim();
  if(!text||/^(?:任务|task|本次|此次)$/iu.test(text))continue;
  const start=first.start-cpLength(prefix.slice(prefix.lastIndexOf(text))),end=start+cpLength(text),tokens=ts.filter(t=>t.start>=start&&t.end<=end);
  const typed=tokens.some(t=>/^(NR|PROPN)$/u.test(t.pos??''))||a.cl.entities?.some(x=>['PER','PERSON'].includes(x.label)&&x.span.start>=start&&x.span.end<=end)||/^[A-Z][A-Z0-9_-]{1,15}$/u.test(text);
  if(!typed||tokens.some(t=>/^(VV|VERB)$/u.test(t.pos??'')))continue;
  a.organization_owner={start,end,text,token_ids:tokens.map(t=>t.id),predicate_token_ids:org.map(t=>t.id),attachment_path:[a.cl.id,...org.map(t=>t.id),...tokens.map(t=>t.id)]};
  if(locationText){const at=a.cl.span.start+cpLength(prefix.slice(0,prefix.lastIndexOf(locationText)));a.organization_owner.location_span={start:at,end:at+cpLength(locationText)};}
  const known=t=>t&&Object.entries(PREDICATE_WORDS).filter(([sense])=>!['complete','confirm'].includes(sense)).some(([,ws])=>ws.includes((t.lemma??t.text).toLowerCase()));
  const lexical=ts.filter(t=>t.start>=org.at(-1).end&&known(t)&&!(/^(compound|amod)/u.test(t.dep??'')&&ts[t.head]?.start>t.start&&known(ts[t.head]))&&!f.nlp_signals.literals.some(l=>l.span.start<=t.start&&l.span.end>=t.end));
  const business=a.events.filter(e=>!organization.test(e.surface)&&!['complete','SOURCE_EVENT'].includes(e.metadata.sense));
  if(lexical.length||business.length){a.r2_assignment_actor={start,end,text};a.r2_execution_start=lexical.length?lexical[0].start:Math.min(...business.map(e=>f.source_spans.find(s=>s.span_id===e.source_span_ids[0]).start));}
  else{retire(a,'ORGANIZATION_RESPONSIBILITY_IS_NOT_A_BUSINESS_ACTION');a.r2_nonexecution=true;}
 }
 return f;
}
export function closeOwnershipFrames(f){
 const {edge,retire}=graphApi(f),log=f.semantic_decoding.governor_ownership_ir;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse)||! /^(?:关注|重点关注|focus on)\s*/iu.test(a.cl.span.quote))continue;
  const prior=f.analyses.filter(p=>p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.end<a.cl.span.start),events=prior.flatMap(p=>p.events).filter(e=>['review','analyze','probe'].includes(e.metadata.sense)&&!e.metadata.retired_reason);
  if(events.length!==1)continue;const target=events[0],marker=/^(?:关注|重点关注|focus on)\s*/iu.exec(a.cl.span.quote),start=a.cl.span.start+cpLength(marker[0]);if(start>=a.cl.span.end)continue;
  retire(a,'EXPLICIT_FOCUS_QUALIFIER_OF_UNIQUE_LOCAL_REVIEW');const q=f.tools.node(a.cl,'STATE',start,a.cl.span.end,{sense:'REVIEW_FOCUS_QUALIFIER',owner:target.node_id,discourse:a.discourse,attachment_path:[a.cl.sentence_id,target.metadata.clause_id,a.cl.id],qualifier_text:[...f.source.raw_text].slice(start,a.cl.span.end).join('')}),r=edge(a,'CONJUNCTION',q,target);a.state=q;log.push({rule:'EXPLICIT_FOCUS_QUALIFIER_OF_UNIQUE_LOCAL_REVIEW',clause_id:a.cl.id,target_node_id:target.node_id,qualifier_node_id:q.node_id,source_span_ids:uniq([a.sid,...target.source_span_ids,...q.source_span_ids]),relation_ids:[r.relation_id]});
 }
 for(const a of f.analyses){if(!a.organization_owner)continue;const o=a.organization_owner;
  for(const e of [...a.events].filter(e=>organization.test(e.surface)||e.metadata.sense==='complete'&&a.r2_nonexecution)){
   const rs=f.relations.filter(r=>r.head_node_id===e.node_id||r.tail_node_id===e.node_id);for(const r of rs){r.state='REJECTED';delete r.unresolved_ref;}
   e.metadata.retired_by_admin_root='ORGANIZATION_LAYER';delete e.metadata.modality_unresolved;delete e.unresolved_ref;f.expression_plans.delete(e.node_id);a.events=a.events.filter(x=>x!==e);
  }
  const who=f.tools.node(a.cl,'ENTITY',o.start,o.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',syntax_token_ids:o.token_ids,owner:a.cl.id,discourse:a.discourse});
  who.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_ORGANIZATION_SUBJECT',source_span_ids:uniq([a.sid,...who.source_span_ids]),authority_inferred:false};who.metadata.participant_roles=uniq([...(who.metadata.participant_roles??[]).filter(x=>x!=='REVIEWER'),'PERFORMER']);f.admin_explicit_roles.set(who.node_id,who.metadata.participant_roles);
  const predicate= a.cl.tokens.filter(t=>o.predicate_token_ids.includes(t.id)),st=f.tools.node(a.cl,'STATE',predicate[0].start,predicate.at(-1).end,{sense:'ROOT_ORGANIZATION_RESPONSIBILITY',owner:a.cl.id,discourse:a.discourse,syntactic_layer:'ORGANIZATION',attachment_path:o.attachment_path,authority_inferred:false,WP_decomposition:false});
  const r=edge(a,'AGENT',st,who);if(!a.state)a.state=st;a.handled=true;
  if(o.location_span){const s=o.location_span,location=f.tools.node(a.cl,'ENTITY',s.start,s.end,{sense:'EXECUTION_ENVIRONMENT',owner:st.node_id,discourse:a.discourse}),member=edge(a,'SCOPE_MEMBER',f.tools.task,location);for(const e of a.events.filter(e=>['REQUIRED','PERMITTED'].includes(e.metadata.modality)))edge(a,'LOCATION',e,location);log.push({rule:'EXPLICIT_PREPOSED_ORGANIZATION_LOCATION',state_node_id:st.node_id,location_node_id:location.node_id,relation_ids:[member.relation_id],source_span_ids:uniq([a.sid,...location.source_span_ids])});}
  log.push({clause_id:a.cl.id,rule:'SOURCE_TYPED_ORGANIZATION_OWNER',actor_node_id:who.node_id,state_node_id:st.node_id,relation_ids:[r.relation_id],attachment_path:o.attachment_path,source_span_ids:uniq([a.sid,...st.source_span_ids,...who.source_span_ids])});
 }
 // Negative determiners on an explicit passive subject scope over its own
 // predicate, even when a permissive auxiliary occurs. Quoted text is data.
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const ts=a.cl.tokens;
  for(const e of a.events){const p=f.source_spans.find(s=>s.span_id===e.source_span_ids[0]),t=ts.find(t=>p&&t.start===p.start&&t.end===p.end);if(!t)continue;
   const idx=ts.indexOf(t),subjects=ts.filter(q=>q.head===idx&&/^(nsubjpass|nsubj:pass)$/u.test(q.dep??'')),negative=subjects.flatMap(s=>ts.filter(q=>q.head===ts.indexOf(s)&&/^(no|neither)$/iu.test(q.text)&&q.dep==='det'));
   if(!negative.length||!ts.some(q=>q.head===idx&&/^(may|can|must|shall)$/iu.test(q.text)&&q.dep==='aux'))continue;
   e.metadata.modality='FORBIDDEN';delete e.metadata.modality_unresolved;
   const ids=new Set([e.node_id]);f.unresolved=f.unresolved.filter(u=>!(u.kind==='UNRESOLVED_RELATION'&&/modality/iu.test(u.reason)&&u.related_node_ids.every(id=>ids.has(id))));delete e.unresolved_ref;
   const rs=f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME'].includes(r.relation_type));for(const r of rs){r.relation_type='FORBIDS';r.rule_refs=uniq([...r.rule_refs,'NEGATIVE_PASSIVE_SUBJECT_MODAL_SCOPE']);}
   log.push({clause_id:a.cl.id,rule:'NEGATIVE_PASSIVE_SUBJECT_MODAL_SCOPE',event_node_id:e.node_id,negative_token_ids:negative.map(n=>n.id),predicate_token_id:t.id,source_span_ids:uniq([a.sid,...negative.map(n=>f.tools.span(n.start,n.end))]),relation_ids:rs.map(r=>r.relation_id)});
  }
 }
}
