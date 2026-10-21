import {VERBS} from './frontend.mjs';
import {PREDICATE_WORDS} from './migration/lexical.mjs';
import {predicateLayer,isGovernedOperator,srlPredicate} from './predicate-ownership.mjs';
import {graphApi} from './migration/graph-api.mjs';

// A separate, explicitly modal consequent is not an antecedent state. This
// adapter proposes it from the same clause's SRL/dependency evidence only.
export function conditionalConsequents(f){
 const {cp,edge}=graphApi(f),log=[];f.semantic_decoding.inline_consequent_ir=log;
 for(const a of f.analyses){
  if(!a.condition_layer)continue;
  const retired=a.events.filter(e=>f.source_spans.find(s=>s.span_id===e.source_span_ids[0]).start<a.condition_layer.end);
  for(const e of retired){e.metadata.retired_by_inline_condition='ANTECEDENT_LAYER';for(const r of f.relations.filter(r=>r.head_node_id===e.node_id)){r.state='REJECTED';delete r.unresolved_ref;}f.expression_plans.delete(e.node_id);const u=e.metadata.modality_unresolved;delete e.metadata.modality_unresolved;f.unresolved=f.unresolved.filter(x=>x.unresolved_id!==u);}
  a.events=a.events.filter(e=>!retired.includes(e));
  for(const t of a.cl.tokens){
   if(t.start<a.condition_layer.end||isGovernedOperator(a.cl,t)||predicateLayer(a.cl,t).kind!=='MAIN'||!(/^(VV|VERB)$/u.test(t.pos??'')||srlPredicate(a.cl,t)))continue;
   const sense=Object.entries({...VERBS,...PREDICATE_WORDS}).find(([,words])=>words.includes(t.text.toLowerCase())||words.includes(t.lemma?.toLowerCase()))?.[0];if(!sense)continue;
   const prefix=cp.slice(a.condition_layer.end,t.start).join('');
   const license=/(应当|应|必须|须|不得|禁止|不(?=\s*$)|无需|不要求|允许|可以|方可|才可|才能|must(?:\s+not)?|may|need\s+not)/iu.exec(prefix);if(!license)continue;
   const modality=/不得|禁止|^不$|must\s+not/iu.test(license[0])?'FORBIDDEN':/无需|不要求|need\s+not/iu.test(license[0])?'NOT_REQUIRED':/允许|可以|方可|才可|才能|may/iu.test(license[0])?'PERMITTED':'REQUIRED';
   const existing=a.events.find(e=>f.source_spans.find(s=>s.span_id===e.source_span_ids[0]).start===t.start);if(existing){existing.metadata.modality=modality;existing.metadata.modality_rule='EXPLICIT_INLINE_CONSEQUENT_MODAL';if(sense==='report'){existing.metadata.recipient_only=true;existing.metadata.argument_contract='INTRANSITIVE_REPORT_MESSAGE_OPEN';}if(sense==='stop')existing.metadata.stop=true;const u=existing.metadata.modality_unresolved;delete existing.metadata.modality_unresolved;f.unresolved=f.unresolved.filter(x=>x.unresolved_id!==u);continue;}
   const e=f.tools.node(a.cl,'EVENT',t.start,t.end,{sense,token_id:t.id,modality,modality_rule:'EXPLICIT_INLINE_CONSEQUENT_MODAL',owner:a.cl.id,discourse:a.discourse,syntactic_layer:'CONDITION_CONSEQUENT',attachment_path:[a.cl.id,t.id],...(sense==='stop'?{stop:true}:{}),...(sense==='report'?{recipient_only:true,argument_contract:'INTRANSITIVE_REPORT_MESSAGE_OPEN'}:{})});
   a.events.push(e);a.handled=true;
   const pi=a.cl.tokens.indexOf(t),frame=(a.cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===pi)),literalArguments=a.cl.tokens.map((q,i)=>({q,i})).filter(({q})=>q.head===pi&&q.dep==='dobj'&&q.provider==='SOURCE_MODAL_TYPED_LITERAL_SEGMENTATION'),arg=frame?.find(r=>r[1]==='ARG1'&&a.cl.tokens[r[2]]?.start>=t.end)??(literalArguments.length===1?['TYPED_LITERAL_ARGUMENT','ARG1',literalArguments[0].i,literalArguments[0].i+1]:null);
   if(arg){const start=a.cl.tokens[arg[2]].start,end=a.cl.tokens[arg[3]-1].end,n=f.tools.node(a.cl,'ENTITY',start,end,{sense:sense==='stop'?'AFFECTED_ACTION_DOMAIN':'LOCAL_OBJECT',owner:e.node_id,discourse:a.discourse});edge(a,modality==='FORBIDDEN'?'FORBIDS':sense==='generate'?'RESULT':sense==='report'?'THEME':'PATIENT',e,n);}
   if(sense==='stop')edge(a,'STOP_OF',e,f.tools.task);
   log.push({event_node_id:e.node_id,clause_id:a.cl.id,modality,source_span_ids:[a.sid,...e.source_span_ids],condition_layer:a.condition_layer,rule:'EXPLICIT_INLINE_CONSEQUENT_MODAL'});
  }
  for(const e of a.events.filter(e=>['read','review'].includes(e.metadata.sense)&&['REQUIRED','PERMITTED'].includes(e.metadata.modality)))for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id&&r.relation_type==='PATIENT')){
   const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);edge(a,'SCOPE_MEMBER',f.tools.task,n);
  }
 }
 return f;
}
