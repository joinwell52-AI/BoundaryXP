import {graphApi,length} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
// A source-material adjunct does not replace the verb's direct argument.
export function sourceMaterialAdjuncts(f){
 const {edge,expr,retire,sp}=graphApi(f),log=[];f.semantic_decoding.source_material_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const ts=a.cl.tokens,marks=ts.filter(t=>/^(基于|根据|based|using)$/iu.test(t.text));
  for(const marker of marks){const first=a.events.filter(e=>f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id)).map(e=>sp(e)).filter(s=>s.start>=marker.end).sort((x,y)=>x.start-y.start)[0],end=first?.start??a.cl.span.end;
   const literals=f.nlp_signals.literals.filter(l=>(['FILE','PATH'].includes(l.type)||l.type==='IDENTIFIER'&&/\.[A-Za-z0-9]+$/u.test(l.span.quote))&&l.span.start>=marker.end&&l.span.end<=end);if(!literals.length)continue;
   for(const l of literals){const n=f.tools.node(a.cl,'ENTITY',l.span.start,l.span.end,{literal_tag:'FILEPATH',literal_id:l.id,sense:'SOURCE_MATERIAL',owner:a.cl.id,discourse:a.discourse}),r=edge(a,'SCOPE_MEMBER',f.tools.task,n,[f.tools.span(marker.start,marker.end)]);log.push({marker_span_id:f.tools.span(marker.start,marker.end),operand_node_id:n.node_id,relation_id:r.relation_id,structural_path:[a.parent_structure_id,a.cl.id,marker.id]});}
  }
  const qualifier=/^(?:仅|只)\s*基于(.+)$/u.exec(a.cl.span.quote);
  if(qualifier&&ts.some(t=>/^(基于)$/u.test(t.text))){const start=a.cl.span.start+length(a.cl.span.quote.slice(0,a.cl.span.quote.indexOf(qualifier[1]))),tokens=ts.filter(t=>t.start>=start&&/^(NN|NR|NOUN|PROPN)/u.test(t.pos??''));if(!tokens.length)continue;retire(a,'SOURCE_MATERIAL_ONLY_SCOPE_QUALIFIER');const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'SOURCE_MATERIAL_RESTRICTION',owner:a.cl.id,discourse:a.discourse,quantifier:'ONLY',modality:'REQUIRED'}),object=f.tools.node(a.cl,'ENTITY',start,a.cl.span.end,{sense:'SOURCE_MATERIAL',syntax_token_ids:tokens.map(t=>t.id),owner:a.cl.id,discourse:a.discourse});edge(a,'CONJUNCTION',state,object);edge(a,'CONJUNCTION',state,f.tools.task);a.state=state;log.push({state_node_id:state.node_id,operand_node_id:object.node_id,source_span_ids:[a.sid],rule:'EXPLICIT_PREPOSITIONAL_ONLY_SCOPE'});}
 }
 return f;
}
// Source operators are preserved as propositions with their typed local roles.
export function declarationAdjuncts(f){
 const {edge,retire}=graphApi(f),log=[];f.semantic_decoding.declaration_adjunct_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;const raw=a.cl.span.quote;
  const delegation=/(?:由谁|who)\s*(?:执行|perform).*?(?:由|by)\s*(.+?)\s*(?:决定|decid)/iu.exec(raw),concession=/^无论是否/u.test(raw);
  if(!delegation&&!concession)continue;
  retire(a,delegation?'EXPLICIT_WORK_ALLOCATION_DECLARATION':'EXPLICIT_CONCESSIVE_UNCONDITIONAL_OPERATOR');const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:delegation?'WORK_ALLOCATION_DELEGATION':'CONCESSIVE_UNCONDITIONAL_SCOPE',owner:a.cl.id,discourse:a.discourse,modality:'REQUIRED',authority_inferred:false}),r=edge(a,'CONJUNCTION',state,f.tools.task);a.state=state;
  if(delegation){const value=delegation[1].trim(),start=a.cl.span.start+length(raw.slice(0,raw.lastIndexOf(value))),token=a.cl.tokens.find(t=>t.start===start);if(token&&(/^(NR|PROPN)$/u.test(token.pos??'')||/^[A-Z][A-Z0-9_-]+$/u.test(value))){const n=f.tools.node(a.cl,'ENTITY',start,start+length(value),{literal_tag:'PERSON',token_id:token.id,sense:'PARTICIPANT_IDENTITY',owner:a.cl.id,discourse:a.discourse});n.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_ALLOCATION_SUBJECT',source_span_ids:[a.sid],authority_inferred:false};n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),'PERFORMER']);f.admin_explicit_roles.set(n.node_id,n.metadata.participant_roles);edge(a,'AGENT',state,n);}}
  log.push({state_node_id:state.node_id,relation_id:r.relation_id,source_span_ids:[a.sid],rule:state.metadata.sense});
 }
 return f;
}
export function prohibitedOperationNominals(f){
 const {edge,sp}=graphApi(f),log=[];f.semantic_decoding.prohibited_operation_ir=log;
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;for(const e of a.events){if(e.metadata.modality!=='FORBIDDEN'||f.relations.some(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','THEME','FORBIDS','RESTRICTS','RESULT'].includes(r.relation_type)))continue;
   const s=sp(e),t=a.cl.tokens.find(t=>t.start===s.start&&t.end===s.end),children=t&&a.cl.tokens.filter(q=>q.head===a.cl.tokens.indexOf(t)&&/^(dobj|obj|iobj)$/u.test(q.dep??''));
   if(!t||children.length||!['publish','deploy','review','supplement','choose','guess'].includes(e.metadata.sense))continue;
   const n=f.tools.node(a.cl,'ENTITY',s.start,s.end,{sense:'EVENT_NOMINAL',owner:e.node_id,token_id:t.id,discourse:a.discourse,argument_role:'PROHIBITED_OPERATION_DOMAIN'}),r=edge(a,'FORBIDS',e,n);e.metadata.argument_contract='EXPLICIT_PROHIBITED_OPERATION_NO_ARTIFACT_INFERENCE';log.push({event_node_id:e.node_id,operation_node_id:n.node_id,relation_id:r.relation_id,source_span_ids:[a.sid,...e.source_span_ids],rule:e.metadata.argument_contract});
  }}return f;
}
export function inputUseSiteContracts(f){const {edge}=graphApi(f),log=[];f.semantic_decoding.input_use_site_ir=log;
 for(const a of f.analyses)for(const e of a.events.filter(e=>['read','review','compare'].includes(e.metadata.sense))){if(!boundaryDomain(a.discourse))continue;for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&['PATIENT','RESTRICTS','FORBIDS'].includes(r.relation_type))){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);if(n.metadata.literal_tag!=='FILEPATH'||n.node_type==='UNKNOWN_REFERENT')continue;const scope=edge(a,'SCOPE_MEMBER',f.tools.task,n);log.push({event_node_id:e.node_id,operand_node_id:n.node_id,relation_ids:[r.relation_id,scope.relation_id],source_span_ids:[a.sid,...n.source_span_ids],rule:'EXPLICIT_READ_REVIEW_FILE_USE_SITE'});}}
 return f;
}
