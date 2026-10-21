import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';

// Passive grammar and typed source literals are independent evidence channels.
// A tagger's ADV/conj label cannot erase an explicit preposed FILE/role subject.
// Selection remains inside the predicate's explicit coordination segment.
export function passiveArguments(f){
 const {edge}=graphApi(f),log=[];f.semantic_decoding.passive_argument_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  const ts=a.cl.tokens;
  for(const e of a.events.filter(e=>['generate','send','notify'].includes(e.metadata.sense))){
   const p=ts.find(t=>t.id===e.metadata.token_id),pi=ts.indexOf(p);if(pi<0)continue;
   const auxiliaries=ts.filter(t=>t.head===pi&&/^(auxpass|aux:pass)$/u.test(t.dep??''));if(auxiliaries.length!==1)continue;
   const aux=auxiliaries[0],bound=ts.filter(t=>t.end<=aux.start&&/^(and|or|otherwise)$/iu.test(t.text)).at(-1),start=bound?.end??a.cl.span.start;
   const subjectTokens=ts.filter(t=>t.start>=start&&t.end<=aux.start&&!/^(must|shall|should|may|can|will|the|a|an)$/iu.test(t.text));
   const files=f.nlp_signals.literals.filter(l=>(l.type==='FILE'||l.type==='IDENTIFIER'&&/\.(?:md|txt|pdf|docx|json|csv|ya?ml)$/iu.test(l.span.quote))&&l.span.start>=start&&l.span.end<=aux.start);
   let n=null,role=null;
   if(['generate','send'].includes(e.metadata.sense)&&files.length===1&&subjectTokens.every(t=>t.start>=files[0].span.start&&t.end<=files[0].span.end)){
    const l=files[0];n=f.tools.node(a.cl,'ENTITY',l.span.start,l.span.end,{sense:'PASSIVE_ARTIFACT_ARGUMENT',literal_id:l.id,literal_tag:'FILEPATH',owner:e.node_id,discourse:a.discourse,syntax_token_ids:subjectTokens.map(t=>t.id)});role=e.metadata.sense==='generate'?'RESULT':'THEME';
   }else if(e.metadata.sense==='notify'&&subjectTokens.length===1){
    const t=subjectTokens[0],person=/^[A-Z][A-Z0-9_-]{1,15}$/u.test(t.text)||a.cl.entities.some(x=>['PERSON','PER'].includes(x.label)&&x.span.start===t.start&&x.span.end===t.end);
    if(person){n=f.tools.node(a.cl,'ENTITY',t.start,t.end,{sense:'PARTICIPANT_IDENTITY',token_id:t.id,owner:e.node_id,discourse:a.discourse,literal_tag:'PERSON'});role='RECIPIENT';
     n.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_TYPED_PASSIVE_RECIPIENT',source_span_ids:uniq([a.sid,...n.source_span_ids]),authority_inferred:false};n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),'RECIPIENT']);f.admin_explicit_roles.set(n.node_id,n.metadata.participant_roles);e.metadata.recipient_only=true;
    }
   }
   if(!n)continue;
   const r=edge(a,role,e,n);r.argument_inheritance={rule:'EXPLICIT_PASSIVE_TYPED_SUBJECT',structural_path:[a.parent_structure_id,a.cl.id,bound?.id??a.cl.id,aux.id,p.id],candidate_node_ids:[n.node_id],source_span_ids:uniq([a.sid,...n.source_span_ids])};
   for(const old of f.relations.filter(q=>q.head_node_id===e.node_id&&q.state==='SUPPORTED'&&q.relation_type==='AGENT')){if(subjectTokens.some(t=>f.semantic_nodes.find(n=>n.node_id===old.tail_node_id)?.surface===t.text)){old.state='REJECTED';old.rejection_reason='PASSIVE_SUBJECT_IS_NOT_AGENT';}}
   log.push({event_node_id:e.node_id,argument_node_id:n.node_id,relation_type:role,relation_id:r.relation_id,auxiliary_token_id:aux.id,source_span_ids:uniq([a.sid,...n.source_span_ids]),rule:'PASSIVE_GRAMMAR_AND_TYPED_SUBJECT'});
  }
 }
 return f;
}
