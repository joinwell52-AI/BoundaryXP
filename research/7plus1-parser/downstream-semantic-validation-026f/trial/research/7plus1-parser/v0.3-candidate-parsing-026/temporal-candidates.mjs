import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {expressionCandidate as expr,expressionPlanCandidate as plan} from './expression-api.mjs';
// Source-marked procedural prerequisites. Candidate events and state readings
// coexist until Γ; no tense/modal/role decision is made by destructive edits.
export function temporalCandidates(f){
 f.proposals.provider='EXPLICIT_PROCEDURAL_TEMPORAL_CANDIDATES';
 const sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 f.semantic_decoding.temporal_candidate_domains=[];
 for(const a of f.analyses){
  const raw=a.cl.span.quote;if(/^(只有|仅在|只在|若|如果|当|未经|only|if\b|when\b|unless\b)/iu.test(raw))continue;
  const ts=a.cl.tokens;
  for(const marker of ts.filter(t=>/^(后|之后|after)$/iu.test(t.text))){
   const predicates=a.events.filter(e=>['review','confirm','receive','retry','run','probe','query'].includes(e.metadata.sense)&&sp(e).end<=marker.start);
   if(!predicates.length)continue;
   const targets=a.events.filter(e=>sp(e).start>=marker.end&&!['SOURCE_EVENT'].includes(e.metadata.sense));
   if(!targets.length)continue;
   const before=[];
   for(const original of predicates){
    const p=ts.find(t=>t.id===original.metadata.token_id);if(!p)continue;
    const event=f.tools.node(a.cl,'EVENT',sp(original).start,sp(original).end,{...original.metadata,modality:'REQUIRED',modality_rule:'EXPLICIT_PROCEDURAL_PREREQUISITE',local_modal_license:{modality:'REQUIRED',rule:'EXPLICIT_PROCEDURAL_PREREQUISITE',token_ids:[p.id,marker.id]},source_predicate_license:{rule:'EXPLICIT_PROCEDURAL_PREREQUISITE',source_span_ids:[a.sid],token_ids:[p.id,marker.id]}});a.events.push(event);before.push(event);
    for(const r of [...f.relations].filter(r=>r.head_node_id===original.node_id)){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id),alt=f.tools.relation(a.cl,r.relation_type,event,n,r.evidence_span_ids);alt.generic_evidence??=[];alt.generic_evidence.push({rule:'EXPLICIT_TEMPORAL_PREREQUISITE_ARGUMENT',source_span_ids:[a.sid],token_ids:[p.id,marker.id]});}
    // An explicit bare participant before a procedural predicate is identity
    // evidence even when a syntax model mislabels its dependency attachment.
    const subjects=ts.filter(t=>t.end<=p.start&&(/^(NR|PROPN)$/u.test(t.pos??'')||/^[A-Z][A-Za-z0-9_-]*$/u.test(t.text)||f.nlp_signals.literals.some(l=>l.type==='ROLE_PHRASE'&&l.span.start<=t.start&&l.span.end>=t.end)));
    if(subjects.length===1){const s=subjects[0],n=f.tools.node(a.cl,'ENTITY',s.start,s.end,{sense:'PROCEDURAL_SUBJECT',owner:event.node_id,syntax_token_ids:[s.id],participant_candidate:{eligible:true,rule:'EXPLICIT_LOCAL_PROCEDURAL_SUBJECT',source_span_ids:[a.sid],authority_inferred:false}}),r=f.tools.relation(a.cl,'AGENT',event,n,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_LOCAL_PROCEDURAL_SUBJECT',participant_role:'REVIEWER',source_span_ids:[a.sid],token_ids:[s.id,p.id]});}
   }
   const st=f.tools.node(a.cl,'STATE',a.cl.span.start,marker.end,{sense:'PROCEDURAL_PREREQUISITE_STATE',owner:a.cl.id,syntactic_layer:'CONDITION_ANTECEDENT',condition_text:[...f.source.raw_text].slice(a.cl.span.start,marker.end).join(''),procedural_predicate_node_ids:before.map(e=>e.node_id),quantity_target_candidates:before.filter(e=>['retry','run','probe','query'].includes(e.metadata.sense)).map(e=>e.node_id),attachment_path:[a.parent_structure_id,a.cl.id,marker.id]});
   const condition=expr(f,'condition_expr_nodes',{op:'STATE_REF',state_node_id:st.node_id,source_span_ids:[a.sid,...st.source_span_ids],relation_ids:[]});
   for(const target of targets){const r=f.tools.relation(a.cl,'CONDITION_OF',st,target,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_PROCEDURAL_TEMPORAL_SCOPE',source_span_ids:[a.sid],token_ids:[marker.id],structural_path:[a.parent_structure_id,a.cl.id]});for(const event of before){const seq=f.tools.relation(a.cl,'SEQUENCE',event,target,[a.sid]);seq.generic_evidence??=[];seq.generic_evidence.push({rule:'EXPLICIT_PROCEDURAL_TEMPORAL_ORDER',source_span_ids:[a.sid],token_ids:[marker.id]});}plan(f,target,{condition_expr_id:condition},[r.relation_id],[a.sid]);}
   f.semantic_decoding.temporal_candidate_domains.push({clause_id:a.cl.id,prerequisite_node_ids:uniq(before.map(e=>e.node_id)),target_node_ids:uniq(targets.map(e=>e.node_id)),condition_expr_id:condition,source_span_ids:[a.sid],candidate_only:true});
  }
 }
 return f;
}
