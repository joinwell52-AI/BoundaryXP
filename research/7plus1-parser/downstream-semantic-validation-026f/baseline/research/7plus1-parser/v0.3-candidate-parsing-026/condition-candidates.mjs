import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {expressionCandidate as expr,expressionPlanCandidate as plan} from './expression-api.mjs';
const conditional=/^(?:若|如果|当(?!前)|只有|仅在|只在|未经|未获|if\b|when\b|unless\b|only (?:after|when)\b)/iu;
const cpLength=s=>[...s].length;
// Explicit antecedent/consequent boundaries and boolean operators produce
// alternative expressions. This stage never withdraws a predicate candidate.
export function conditionCandidates(f){
 f.proposals.provider='LOCAL_STRUCTURAL_CONDITION_CANDIDATES';
 const points=[...f.source.raw_text],domains=[];f.semantic_decoding.condition_candidate_domains=domains;
 const state=(a,start,end,sense='EXPLICIT_CONDITION_STATE')=>f.tools.node(a.cl,'STATE',start,end,{sense,owner:a.cl.id,discourse:a.discourse,syntactic_layer:'CONDITION_ANTECEDENT',condition_text:points.slice(start,end).join(''),polarity:'POSITIVE',attachment_path:[a.parent_structure_id,a.cl.id]});
 function sharedApproval(a,start,end){
  const ts=a.cl.tokens,p=ts.find(t=>t.start>=start&&t.end<=end&&/^(批准|审批|approve|approves|approved)$/iu.test(t.text));if(!p)return null;
  const actors=ts.filter(t=>t.start>=start&&t.end<=p.start&&t.head===ts.indexOf(p)&&(/^nsubj$/u.test(t.dep)||t.dep==='nmod:prep'&&/^[A-Z][A-Za-z0-9_-]*$/u.test(t.text)));
  for(let i=0;i<actors.length;i++)for(const t of ts.filter(t=>t.start>=start&&t.end<=p.start&&t.dep==='conj'&&t.head===ts.indexOf(actors[i])))if(!actors.includes(t))actors.push(t);
  actors.sort((a,b)=>a.start-b.start);if(actors.length<2)return null;
  const connector=ts.find(t=>t.start>=actors[0].end&&t.end<=actors.at(-1).start&&/^(或|和|与|or|and)$/iu.test(t.text));if(!connector)return null;
  const parts=actors.map(actor=>{
   const who=f.tools.node(a.cl,'ENTITY',actor.start,actor.end,{sense:'SYNTACTIC_ARGUMENT',owner:a.cl.id,syntax_token_ids:[actor.id],argument_role:'AGENT',participant_candidate:{eligible:/^(NR|PROPN)$/u.test(actor.pos??'')||/^[A-Z][A-Za-z0-9_-]*$/u.test(actor.text)&&/^(NN|NOUN)$/u.test(actor.pos??''),rule:'EXPLICIT_SHARED_CONDITION_SUBJECT',source_span_ids:[a.sid],authority_inferred:false}});
   const st=f.tools.node(a.cl,'STATE',start,end,{sense:'EXPLICIT_SHARED_APPROVAL_STATE',owner:who.node_id,discourse:a.discourse,syntactic_layer:'CONDITION_ANTECEDENT',condition_text:points.slice(start,end).join(''),polarity:'POSITIVE',syntax_token_ids:[actor.id,p.id],attachment_path:[a.parent_structure_id,a.cl.id,p.id,actor.id]});
   const r=f.tools.relation(a.cl,'AGENT',st,who,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'CONDITION_APPROVAL_SUBJECT',participant_role:'APPROVER',token_ids:[p.id,actor.id],source_span_ids:[a.sid,...st.source_span_ids,...who.source_span_ids]});
   return {node:st,actor:who,expression_id:expr(f,'condition_expr_nodes',{op:'STATE_REF',state_node_id:st.node_id,source_span_ids:[a.sid,...st.source_span_ids],relation_ids:[r.relation_id]})};
  });
  return {expression_id:expr(f,'condition_expr_nodes',{op:/或|or/iu.test(connector.text)?'OR':'AND',operand_expr_ids:parts.map(p=>p.expression_id),source_span_ids:[a.sid],relation_ids:[]}),nodes:parts.map(p=>p.node),actor_node_ids:parts.map(p=>p.actor.node_id),range:{start,end},negative:false};
 }
 function atomic(a,start,end){
  while(start<end&&/\s/u.test(points[start]))start++;while(end>start&&/\s/u.test(points[end-1]))end--;
  if(end<=start)return null;const raw=points.slice(start,end).join(''),unless=/^unless\s+/iu.exec(raw),negative=/^(?:未经|未获)|(?:不|未|没有)存在|\b(?:not|no)\b/iu.test(raw),n=state(a,start+(unless?cpLength(unless[0]):0),end);n.metadata.polarity=negative?'NEGATIVE':'POSITIVE';n.metadata.conditional_marker_span_id=unless?f.tools.span(start,start+cpLength(unless[0])):null;
  const rs=[];
  for(const p of a.cl.tokens.filter(t=>t.start>=start&&t.end<=end&&/批准|审批|approve|approval/iu.test(t.text))){
   const subjects=a.cl.tokens.filter(t=>t.start>=start&&t.end<=p.start&&t.head===a.cl.tokens.indexOf(p)&&t.dep==='nsubj');
   if(!subjects.length){const candidate=a.cl.tokens.filter(t=>t.start>=start&&t.end<=p.start&&/^[A-Z][A-Za-z0-9_-]*$/u.test(t.text));if(candidate.length===1&&/^(?:只有|仅在|若|如果|当|only\s+(?:after|when)|if|when)?\s*$/iu.test(points.slice(start,candidate[0].start).join(''))&&/^\s*$/u.test(points.slice(candidate[0].end,p.start).join('')))subjects.push(candidate[0]);}
   for(const subject of subjects){
    const who=f.tools.node(a.cl,'ENTITY',subject.start,subject.end,{sense:'SYNTACTIC_ARGUMENT',owner:n.node_id,syntax_token_ids:[subject.id],argument_role:'AGENT'});
    who.metadata.participant_candidate={eligible:/^(NR|PROPN)$/u.test(subject.pos??'')||/^[A-Z][A-Za-z0-9_-]*$/u.test(subject.text)||a.cl.entities.some(e=>['PERSON','PER'].includes(e.label)&&e.span.start>=subject.start&&e.span.end<=subject.end),rule:'EXPLICIT_CONDITION_SUBJECT_POSITION',source_span_ids:[a.sid,...who.source_span_ids],authority_inferred:false};
    const r=f.tools.relation(a.cl,'AGENT',n,who,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'CONDITION_APPROVAL_SUBJECT',participant_role:'APPROVER',token_ids:[p.id,subject.id],source_span_ids:[a.sid,...n.source_span_ids,...who.source_span_ids]});rs.push(r.relation_id);
   }
  }
  const ref=expr(f,'condition_expr_nodes',{op:'STATE_REF',state_node_id:n.node_id,source_span_ids:[a.sid,...n.source_span_ids],relation_ids:rs});
  return {expression_id:unless?expr(f,'condition_expr_nodes',{op:'NOT',operand_expr_id:ref,source_span_ids:[a.sid,...n.source_span_ids],relation_ids:rs}):ref,nodes:[n],range:{start,end},negative};
 }
 function boolean(a,start,end){
  const shared=sharedApproval(a,start,end);if(shared)return shared;
  const raw=points.slice(start,end).join(''),connectors=[...raw.matchAll(/并且|且|或者|或|\band\b|\bor\b/giu)],ops=uniq(connectors.map(m=>/或|\bor\b/iu.test(m[0])?'OR':'AND'));
  if(!connectors.length)return atomic(a,start,end);
  if(ops.length!==1){f.tools.unknown(a.cl,'UNRESOLVED_SCOPE','Mixed condition operators without explicit grouping');return null;}
  let begin=start;const parts=[];for(const m of connectors){const at=start+cpLength(raw.slice(0,m.index));parts.push(atomic(a,begin,at));begin=at+cpLength(m[0]);}parts.push(atomic(a,begin,end));
  if(parts.some(p=>!p))return null;return {expression_id:expr(f,'condition_expr_nodes',{op:ops[0],operand_expr_ids:parts.map(p=>p.expression_id),source_span_ids:[a.sid,...parts.flatMap(p=>p.nodes.flatMap(n=>n.source_span_ids))],relation_ids:[]}),nodes:parts.flatMap(p=>p.nodes),range:{start,end},negative:false};
 }
 for(const a of f.analyses){
  const raw=a.cl.span.quote,header=/^(?:completion|完成条件)\s*(?:requires?|需要|要求|:|：)\s*/iu.exec(raw),complete=/(?:时\s*)?(?:任务\s*)?才\s*(?:完成|结束)|\b(?:only when|before completion)\b/iu.exec(raw),modal=a.cl.tokens.find(t=>t.start>a.cl.span.start&&/^(aux(?::.*)?|neg)$/u.test(t.dep??'')&&/^(必须|应|须|不得|不|允许|must|may|shall|can|not)$/iu.test(t.text));
  let range=null,kind='CONDITION',postposed=false;
  if(header){range={start:a.cl.span.start+cpLength(header[0]),end:a.cl.span.end};kind='COMPLETION';const token=a.cl.tokens.find(t=>/^(completion|完成)$/iu.test(t.text));if(token){const event=f.tools.node(a.cl,'EVENT',token.start,token.end,{sense:'complete',owner:a.cl.id,discourse:a.discourse,token_id:token.id,syntactic_layer:'MAIN',modality:'REQUIRED',completion_candidate:true,source_predicate_license:{rule:'EXPLICIT_COMPLETION_REQUIREMENT_HEADER',source_span_ids:[a.sid],token_ids:[token.id]},attachment_path:[a.parent_structure_id,a.cl.id,token.id]});a.events.push(event);}const governor=a.cl.tokens.find(t=>/^(requires?|需要|要求)$/iu.test(t.text));if(governor){const st=state(a,governor.start,governor.end,'COMPLETION_REQUIREMENT_OPERATOR');f.semantic_decoding.structural_state_alternatives.push({clause_id:a.cl.id,state_node_id:st.node_id,range:{start:governor.start,end:governor.end},kind:'COMPLETION_REQUIREMENT_OPERATOR',source_span_ids:[a.sid]});}}
  else if(complete){range={start:a.cl.span.start,end:a.cl.span.start+cpLength(raw.slice(0,complete.index))};kind='COMPLETION';}
  else if(conditional.test(raw)){
   const cnd=(a.cl.srl??[]).flat().find(r=>r[1]==='ARGM-CND'&&a.cl.tokens[r[2]]?.start===a.cl.span.start);
   const temporal=/(?:后|时|\bthen\b)/iu.exec(raw),consequent=temporal&&raw.slice(temporal.index+temporal[0].length).trim();
   const explicitConsequent=consequent&&/^(?:才|则|方|可|允许|必须|不得|then|may|must)/iu.test(consequent),end=explicitConsequent?a.cl.span.start+cpLength(raw.slice(0,temporal.index+temporal[0].length)):modal?modal.start:a.cl.span.end;
   // A subordinate-only source clause cannot be shortened to a partial SRL
   // adjunct. Without an explicit local consequent, its entire markup span
   // is the antecedent witness; the following clause supplies the main frame.
   range={start:a.cl.span.start,end};
  }
  else {const marker=/\b(?:only\s+(?:after|when)|unless)\b/iu.exec(raw),temporal=a.cl.tokens.find(t=>/^(时|时候)$/u.test(t.text)&&/case|mark/u.test(t.dep??'')&&a.cl.tokens.some(p=>p.start>=t.end&&/^(VV|VERB)$/u.test(p.pos??'')&&/root|conj/u.test(p.dep??'')));if(marker){range={start:a.cl.span.start+cpLength(raw.slice(0,marker.index)),end:a.cl.span.end};postposed=true;}else if(temporal)range={start:a.cl.span.start,end:temporal.end};}
  if(!range)continue;const body=boolean(a,range.start,range.end);if(!body)continue;
  const doubts=f.semantic_nodes.filter(n=>n.metadata.unspecified_connector_domain&&f.analyses.some(b=>b.cl.id===n.metadata.clause_id&&b.parent_structure_id===a.parent_structure_id&&b.cl.sentence_id===a.cl.sentence_id));
  if(doubts.length===1&&body.actor_node_ids?.length>1){
   const doubt=doubts[0],neutral=state(a,range.start,range.end,'SOURCE_UNSPECIFIED_CONDITION_CONNECTOR');neutral.metadata.source_ambiguity=true;neutral.metadata.source_ambiguity_kind='UNRESOLVED_APPROVAL';neutral.metadata.argument_candidate_node_ids=body.actor_node_ids;neutral.metadata.doubt_source_span_ids=doubt.source_span_ids;
   f.semantic_decoding.source_ambiguity_candidates??=[];f.semantic_decoding.source_ambiguity_candidates.push({kind:'UNRESOLVED_APPROVAL',alternatives:['ANY','ALL'],candidate_actor_node_ids:body.actor_node_ids,selected_alternative:null,condition_candidate_expression_id:body.expression_id,source_span_ids:uniq([a.sid,...doubt.source_span_ids]),structural_path:[a.parent_structure_id,a.cl.id,doubt.metadata.clause_id]});
   body.expression_id=expr(f,'condition_expr_nodes',{op:'STATE_REF',state_node_id:neutral.node_id,source_span_ids:uniq([a.sid,...doubt.source_span_ids]),relation_ids:[]});body.nodes=[neutral];
  }
  if(kind==='COMPLETION')for(const old of [...a.events].filter(e=>e.metadata.sense==='complete')){const s=f.source_spans.find(s=>s.span_id===old.source_span_ids[0]),licensed=f.tools.node(a.cl,'EVENT',s.start,s.end,{...old.metadata,modality:'REQUIRED',syntactic_layer:'MAIN',modality_rule:'EXPLICIT_NECESSARY_COMPLETION_MARKER',local_modal_license:{modality:'REQUIRED',rule:'EXPLICIT_NECESSARY_COMPLETION_MARKER',source_span_ids:[a.sid]},source_predicate_license:{rule:'EXPLICIT_NECESSARY_COMPLETION_MARKER',source_span_ids:[a.sid]},modality_candidates:[{modality:'REQUIRED',source_span_ids:[a.sid],marker:(header??complete)[0]}],completion_candidate:true});if(!a.events.some(e=>e.node_id===licensed.node_id))a.events.push(licensed);for(const r of [...f.relations].filter(r=>r.head_node_id===old.node_id)){const tail=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),alternative=f.tools.relation(a.cl,r.relation_type,licensed,tail,r.evidence_span_ids);alternative.generic_evidence??=[];alternative.generic_evidence.push({rule:'EXPLICIT_NECESSARY_COMPLETION_MARKER',source_span_ids:[a.sid]});}}
  a.local_condition_states??=[];a.local_condition_states.push(...body.nodes);
  domains.push({clause_id:a.cl.id,kind,...body,postposed,source_span_ids:uniq([a.sid,...body.nodes.flatMap(n=>n.source_span_ids)]),structural_path:[a.parent_structure_id,a.cl.id],candidate_only:true});
 }
 for(const d of domains){const a=f.analyses.find(a=>a.cl.id===d.clause_id),targets=f.analyses.filter(b=>b.parent_structure_id===a.parent_structure_id&&b.cl.sentence_id===a.cl.sentence_id&&b.cl.span.start>=a.cl.span.start&&(!conditional.test(b.cl.span.quote)||b===a));
  for(const b of targets)for(const target of f.semantic_nodes.filter(n=>n.node_type==='STATE'&&n.metadata.sense==='OUTPUT_CONTENT_REQUIREMENT'&&n.metadata.clause_id===b.cl.id)){const ids=[];for(const st of d.nodes){const r=f.tools.relation(b.cl,'CONJUNCTION',st,target,d.source_span_ids);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_OUTPUT_CONTENT_CONDITION',kind:d.kind,source_span_ids:[b.sid,...d.source_span_ids],structural_path:[a.parent_structure_id,a.cl.id,b.cl.id]});ids.push(r.relation_id);}plan(f,target,{condition_expr_id:d.expression_id},ids,[b.sid,...d.source_span_ids]);}
  for(const b of targets)for(const e of b.events){const s=f.source_spans.find(s=>s.span_id===e.source_span_ids[0]);if(f.semantic_decoding.structural_state_alternatives.some(x=>x.clause_id===b.cl.id&&x.kind==='SOURCE_CORRESPONDENCE_UNSPECIFIED'))continue;if(b===a&&d.kind!=='COMPLETION'&&(d.postposed?s.start>=d.range.start:s.start<d.range.end))continue;if(d.kind==='COMPLETION'&&e.metadata.sense!=='complete')continue;
   const ids=[];for(const st of d.nodes){const r=f.tools.relation(b.cl,d.kind==='COMPLETION'?'COMPLETION_OF':'CONDITION_OF',st,e,d.source_span_ids);r.generic_evidence??=[];r.generic_evidence.push({rule:'STRUCTURAL_SENTENCE_CONDITION_SCOPE',kind:d.kind,antecedent_range:d.range,source_span_ids:uniq([b.sid,...d.source_span_ids]),structural_path:[a.parent_structure_id,a.cl.id,b.cl.id]});ids.push(r.relation_id);}
   plan(f,e,{condition_expr_id:d.expression_id},ids,[b.sid,...d.source_span_ids]);
  }
 }
 for(const a of f.analyses.filter(a=>/^(?:否则|otherwise\b)/iu.test(a.cl.span.quote))){const at=f.analyses.indexOf(a),previous=f.analyses[at-1],matches=previous&&/[;；]/u.test(previous.cl.delimiter??'')?domains.filter(d=>d.kind==='CONDITION'&&f.candidate_plan_sets.some(p=>p.condition_expr_id===d.expression_id&&previous.events.some(e=>e.node_id===p.predicate_node_id))):[];
  if(matches.length!==1){f.tools.unknown(a.cl,'UNRESOLVED_SCOPE','Otherwise lacks a unique explicit preceding conditional branch');continue;}
  const d=matches[0],q=expr(f,'condition_expr_nodes',{op:'NOT',operand_expr_id:d.expression_id,source_span_ids:[a.sid,...d.source_span_ids],relation_ids:[]});
  for(const e of a.events)plan(f,e,{condition_expr_id:q},[],[a.sid,...d.source_span_ids]);
 }
 return f;
}
