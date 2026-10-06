import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Demonstrative nominal arguments are source syntax even when a mixed-language
// tagger labels their noun as a verb. Propose the nominal and predicate layers
// independently; only Γ may decide which use survives.
export function localArgumentCandidates(f){
 f.proposals.provider='EXPLICIT_LOCAL_NOMINAL_ARGUMENT_CANDIDATES';
 const points=[...f.source.raw_text],sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 for(const a of f.analyses)for(const m of a.cl.span.quote.matchAll(/(?:该|此|上述|前述|这份|最终)(?:报告|文档|文件|材料|结果)/gu)){
  const start=a.cl.span.start+[...a.cl.span.quote.slice(0,m.index)].length,end=start+[...m[0]].length;
  const state=f.tools.node(a.cl,'STATE',start,end,{sense:'REFERENTIAL_NOMINAL_ARGUMENT',owner:a.cl.id,discourse:a.discourse,syntactic_layer:'NOMINAL_ARGUMENT',marker_evidence:{source_span_ids:[a.sid],text:m[0]},attachment_path:[a.parent_structure_id,a.cl.id]});
  f.semantic_decoding.structural_state_alternatives.push({clause_id:a.cl.id,state_node_id:state.node_id,range:{start,end},kind:state.metadata.sense,source_span_ids:[a.sid,...state.source_span_ids]});
  for(const event of a.events){if(!['review','read','send','report','generate','receive'].includes(event.metadata.sense))continue;const s=sp(event),post=s.end<=start&&/^\s*$/u.test(points.slice(s.end,start).join('')),pre=end<=s.start&&/^\s*$/u.test(points.slice(end,s.start).join(''))&&a.cl.tokens.some(t=>t.pos==='BA'&&t.end<=start);if(!post&&!pre)continue;
   const ref=f.tools.node(a.cl,'UNKNOWN_REFERENT',start,end,{sense:'EXPLICIT_DEMONSTRATIVE_NOMINAL',owner:event.node_id,argument_role:['send','report'].includes(event.metadata.sense)?'THEME':'PATIENT',discourse:a.discourse,attachment_path:[a.parent_structure_id,a.cl.id,event.metadata.token_id]});
   const r=f.tools.relation(a.cl,ref.metadata.argument_role,event,ref,[a.sid,...state.source_span_ids]);r.generic_evidence??=[];r.generic_evidence.push({rule:post?'DIRECT_POST_PREDICATE_DEMONSTRATIVE_NOMINAL':'EXPLICIT_BA_FRONTED_DEMONSTRATIVE_NOMINAL',source_span_ids:uniq([a.sid,...ref.source_span_ids,...event.source_span_ids]),nominal_state_id:state.node_id,attachment_path:[a.parent_structure_id,a.cl.id,event.metadata.token_id]});
  }
 }
 return f;
}
