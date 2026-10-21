import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';
import {boundaryDomain} from '../v0.3-7p-composition-014/discourse.mjs';
import {graphApi} from './migration/graph-api.mjs';
import {PREDICATE_WORDS} from './migration/lexical.mjs';
import {VERBS} from './frontend.mjs';
import {predicateLayer} from './predicate-ownership.mjs';

const senses=new Map(Object.entries({...VERBS,...PREDICATE_WORDS}).flatMap(([s,ws])=>ws.map(w=>[w.toLowerCase(),s])));
const noun=t=>/^(NN|NR|PN|FW|NOUN|PROPN|PRON)/u.test(t.pos??'');
// A temporal case marker and two typed predicates delimit the argument domain.
// Neither a last-mentioned report nor a nearest actor is an attachment rule.
export function temporalPredicates(f){
 const {nm,expr,edge,retire,outputs}=graphApi(f),log=[];f.semantic_decoding.temporal_predicate_ir=log;
 for(const a of f.analyses){
  if(!boundaryDomain(a.discourse))continue;
  const ts=a.cl.tokens,marks=ts.filter(t=>/^(后|之前|之后|before|after)$/iu.test(t.text)&&/case|mark|advmod/u.test(t.dep??''));
  for(const marker of marks){
   if(!/^(后|之后|after)$/iu.test(marker.text))continue;
   const predicates=ts.filter(t=>senses.has(t.text.toLowerCase())&&predicateLayer(a.cl,t).kind==='MAIN'&&(/^(VV|VERB)$/u.test(t.pos??'')||(a.cl.srl??[]).some(fr=>fr.some(r=>r[1]==='PRED'&&r[2]<=ts.indexOf(t)&&r[3]>ts.indexOf(t)))));
   const first=predicates.filter(t=>t.end<=marker.start),last=predicates.filter(t=>t.start>=marker.end);
   if(first.length!==1||last.length!==1)continue;
   const p=first[0],q=last[0],pi=ts.indexOf(p),qi=ts.indexOf(q),frame=t=>(a.cl.srl??[]).find(fr=>fr.some(r=>r[1]==='PRED'&&r[2]<=ts.indexOf(t)&&r[3]>ts.indexOf(t)));
   // The marker must syntactically own the antecedent, or be in the target's
   // explicitly supplied SRL temporal argument.
   const temporal=frame(q)?.find(r=>r[1]==='ARGM-TMP');
   const resultative=ts[marker.head],passed=resultative&&/^(通过|合格|成功|passed|succeeded)$/iu.test(resultative.text)&&resultative.start>=p.end&&resultative.end<=marker.start;
   if(marker.head!==pi&&!(temporal&&temporal[2]<=pi&&temporal[3]>ts.indexOf(marker)))continue;
   const participant=(t,from,to)=>{
    const ti=ts.indexOf(t),direct=ts.filter(n=>noun(n)&&n.start>=from&&n.end<=to&&(n.head===ti&&/nsubj/u.test(n.dep??'')||ts.some(m=>m.head===ts.indexOf(n)&&m.dep==='case'&&/^(由|by)$/iu.test(m.text))));
    if(direct.length===1)return direct[0];
    const prefix=ts.filter(n=>n.start>=from&&n.end<=t.start&&!/^(请|应|应当|必须|再|由|please|must|shall)$/iu.test(n.text));
    // Exact subject position in this bounded predicate layer; no arbitrary
    // search across the marker or another predicate.
    return prefix.length===1&&noun(prefix[0])&&/^[A-Z][A-Z0-9_-]{1,15}$/u.test(prefix[0].text)?prefix[0]:null;
   };
   const actorP=participant(p,a.cl.span.start,marker.start),actorQ=participant(q,marker.end,a.cl.span.end);
   const objectFrame=frame(p)?.find(r=>r[1]==='ARG1'&&ts[r[2]]?.start>=p.end&&ts[r[3]-1]?.end<=marker.start),objectToken=ts.find(t=>noun(t)&&t.head===pi&&/^(dobj|obj)$/u.test(t.dep??'')&&t.start>=p.end&&t.end<=marker.start);
   let objectRange=objectFrame?{start:ts[objectFrame[2]]?.start,end:ts[objectFrame[3]-1]?.end}:objectToken?(()=>{const [start,end]=modifierPhrase(a.cl,objectToken);return {start,end};})():null;
   const compoundArguments=ts.filter(t=>t.head===pi&&t.dep==='compound:vc'&&t.start>=p.end&&t.end<=marker.start);
   if(!objectRange&&compoundArguments.length&&compoundArguments[0].start===p.end&&compoundArguments.at(-1).end===marker.start)objectRange={start:p.end,end:marker.start};
   const omittedCandidates=!objectRange&&passed?outputs(a).filter(n=>f.analyses.find(x=>x.cl.id===n.metadata.clause_id)?.parent_structure_id===a.parent_structure_id):[],inheritedObject=omittedCandidates.length===1?omittedCandidates[0]:null;
   if(!actorP||!actorQ||(!objectRange&&!inheritedObject)||objectRange&&(objectRange.start<p.end||objectRange.end>marker.start))continue;
   const receiver=ts.filter(t=>noun(t)&&t.head===qi&&ts.some(m=>m.head===ts.indexOf(t)&&m.dep==='case'&&/^(给|向|to)$/iu.test(m.text)));
   if(receiver.length>1)continue;
   retire(a,'EXPLICIT_DEPENDENCY_TEMPORAL_PREDICATE_LAYERS');
   const person=(token,role)=>{const n=f.tools.node(a.cl,'ENTITY',token.start,token.end,{sense:'PARTICIPANT_IDENTITY',literal_tag:'PERSON',token_id:token.id,owner:a.cl.id,discourse:a.discourse});n.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_TEMPORAL_LAYER_SUBJECT',source_span_ids:[a.sid,...n.source_span_ids],authority_inferred:false};n.metadata.participant_roles=uniq([...(n.metadata.participant_roles??[]),role]);f.admin_explicit_roles.set(n.node_id,n.metadata.participant_roles);return n;};
   const event=token=>{const n=f.tools.node(a.cl,'EVENT',token.start,token.end,{sense:senses.get(token.text.toLowerCase()),token_id:token.id,owner:a.cl.id,discourse:a.discourse,modality:'REQUIRED',modality_rule:'ADMIN_DIRECTIVE_TEMPORAL_CONSTRUCTION',syntactic_layer:'CURRENT_TASK',attachment_path:[a.cl.id,token.id]});Object.assign(n.metadata,{modality:'REQUIRED',retired_by_admin_root:undefined});delete n.metadata.modality_unresolved;delete n.unresolved_ref;a.events.push(n);return n;};
   const antecedent=event(p),consequent=event(q),object=inheritedObject??f.tools.node(a.cl,'ENTITY',objectRange.start,objectRange.end,{sense:'LOCAL_PREDICATE_ARGUMENT',owner:antecedent.node_id,discourse:a.discourse,syntax_token_ids:ts.filter(t=>t.start>=objectRange.start&&t.end<=objectRange.end).map(t=>t.id)});
   edge(a,'AGENT',antecedent,person(actorP,['review','confirm','ensure'].includes(senses.get(p.text.toLowerCase()))?'REVIEWER':'PERFORMER'));
   const argument=edge(a,'PATIENT',antecedent,object);if(inheritedObject)argument.argument_inheritance={rule:'UNIQUE_OUTPUT_REVIEW_PASS_DOMAIN',candidate_node_ids:omittedCandidates.map(n=>n.node_id),structural_path:[a.parent_structure_id,a.cl.id,p.id,marker.id],source_span_ids:uniq([a.sid,...object.source_span_ids])};edge(a,'AGENT',consequent,person(actorQ,'PERFORMER'));
   if(receiver[0])edge(a,'RECIPIENT',consequent,person(receiver[0],'RECIPIENT'));
   // Transfer omission may refer to the unique structurally available output;
   // reporting is also a valid intransitive communication with a recipient.
   if(senses.get(q.text.toLowerCase())==='send'){
    const outputs=[...new Map(f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='RESULT'&&nm(r.tail_node_id).source_span_ids.some(i=>f.source_spans.find(s=>s.span_id===i)?.end<a.cl.span.start)).map(r=>[nm(r.tail_node_id).metadata.artifact_identity??nm(r.tail_node_id).surface,nm(r.tail_node_id)])).values()];
    if(outputs.length===1){const r=edge(a,'THEME',consequent,outputs[0],[...outputs[0].source_span_ids]);r.argument_inheritance={rule:'UNIQUE_OUTPUT_IN_EXPLICIT_TRANSFER_DOMAIN',candidate_node_ids:outputs.map(n=>n.node_id),structural_path:[a.parent_structure_id,a.cl.id,consequent.node_id],source_span_ids:uniq([a.sid,...outputs[0].source_span_ids])};}
   }
   if(senses.get(q.text.toLowerCase())==='report'&&receiver.length===1)consequent.metadata.recipient_only=true;
   const state=f.tools.node(a.cl,'STATE',p.start,marker.start,{sense:passed?'EVENT_PASSED':'EVENT_COMPLETED',event_node_id:antecedent.node_id,object_node_ids:[object.node_id],owner:a.cl.id,discourse:a.discourse,syntactic_layer:'CONDITION_ANTECEDENT',temporal_marker_span_id:f.tools.span(marker.start,marker.end),resultative_token_id:passed?resultative.id:null});
   const cond=edge(a,'CONDITION_OF',state,consequent),order=edge(a,'SEQUENCE',antecedent,consequent),qexpr=expr(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:state.node_id,relation_ids:[cond.relation_id],source_span_ids:uniq([a.sid,...state.source_span_ids,f.tools.span(marker.start,marker.end)])});
   f.expression_plans.set(consequent.node_id,{...f.expression_plans.get(consequent.node_id),condition_expr_id:qexpr});a.local_condition_states=[state];
   log.push({clause_id:a.cl.id,antecedent_event_id:antecedent.node_id,consequent_event_id:consequent.node_id,condition_expr_id:qexpr,relation_ids:[cond.relation_id,order.relation_id],marker_span_id:f.tools.span(marker.start,marker.end),source_span_ids:[a.sid],structure_path:[a.parent_structure_id,a.cl.id]});
  }
 }
 return f;
}
