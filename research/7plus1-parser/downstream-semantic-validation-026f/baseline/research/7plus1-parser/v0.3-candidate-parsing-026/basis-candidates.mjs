import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Source-local normative attachment only. Reference IDs never confer Authority.
export function basisCandidates(f){
 f.proposals.provider='EXPLICIT_REFERENCE_ATTACHMENT_CANDIDATES';
 const span=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),ledger=[];f.semantic_decoding.basis_reference_candidates=ledger;
 for(const a of f.analyses){const points=[...f.source.raw_text],raw=a.cl.span.quote,declaration=/^(?:.+?\s+)?(?:检查|编译|运行|审计)?依据\s*(?:为|是|:|：)\s*/u.exec(raw),refs=f.semantic_nodes.filter(n=>n.node_type==='REFERENCE'&&n.metadata.clause_id===a.cl.id&&n.metadata.literal_tag!=='VERSION');
  // A protected identifier can be a normative reference only at an explicit
  // source use site. The material reading survives as a competing node.
  for(const l of f.nlp_signals.literals.filter(l=>['IDENTIFIER','REFERENCE','COMMIT'].includes(l.type)&&l.span.start>=a.cl.span.start&&l.span.end<=a.cl.span.end)){
   const before=points.slice(a.cl.span.start,l.span.start).join(''),after=points.slice(l.span.end,a.cl.span.end).join('');
   if(!/(?:依据|根据|按|遵照|遵循|against|according to|based on|under|using)\s*$/iu.test(before)&&!/(?:以|using)\s*(?:commit\s*)?$/iu.test(before)&&!/^\s*(?:为|作为)\s*(?:基线|依据)/u.test(after))continue;
   if(refs.some(n=>span(n).start===l.span.start&&span(n).end===l.span.end))continue;
   refs.push(f.tools.node(a.cl,'REFERENCE',l.span.start,l.span.end,{sense:'EXPLICIT_BASIS_REFERENCE',literal_id:l.id,literal_tag:l.type==='COMMIT'?'COMMIT':'REFERENCE',owner:a.cl.id,discourse:a.discourse,basis_use_site:true,authority_inferred:false}));
  }
  if(declaration){const at=a.cl.span.start+[...declaration[0]].length,version=f.semantic_nodes.find(n=>n.node_type==='REFERENCE'&&n.metadata.literal_tag==='VERSION'&&n.metadata.clause_id===a.cl.id&&span(n).start>=at),end=version?span(version).start:a.cl.span.end;let start=at,stop=end;while(start<stop&&/\s/u.test(points[start]))start++;while(stop>start&&/\s/u.test(points[stop-1]))stop--;if(stop>start&&!refs.some(n=>span(n).start===start&&span(n).end===stop)){const n=f.tools.node(a.cl,'REFERENCE',start,stop,{sense:'EXPLICIT_BASIS_REFERENCE',owner:a.cl.id,discourse:a.discourse,authority_inferred:false});refs.push(n);}
   const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'EXPLICIT_BASIS_DECLARATION',owner:a.cl.id,syntactic_layer:'DECLARATION'});f.semantic_decoding.structural_state_alternatives.push({clause_id:a.cl.id,state_node_id:state.node_id,range:{start:a.cl.span.start,end:a.cl.span.end},kind:state.metadata.sense,source_span_ids:[a.sid]});
  }
  for(const ref of refs){const before=points.slice(a.cl.span.start,span(ref).start).join(''),after=points.slice(span(ref).end,a.cl.span.end).join(''),copular=/^\s*(?:为|作为)\s*(?:基线|依据)/u.exec(after);if(!declaration&&!ref.metadata.basis_use_site&&!/(?:依据|根据|按|遵照|遵循|against|according to|based on|under|using)\s*$/iu.test(before)&&!copular)continue;
   if(copular){const at=span(ref).end+[...after.slice(0,after.search(/为|作为/u))].length,stop=span(ref).end+[...copular[0]].length,st=f.tools.node(a.cl,'STATE',at,stop,{sense:'EXPLICIT_BASIS_OPERATOR',owner:ref.node_id,syntactic_layer:'DECLARATION',source_span_ids:[a.sid],authority_inferred:false});f.semantic_decoding.structural_state_alternatives.push({clause_id:a.cl.id,state_node_id:st.node_id,range:{start:at,end:stop},kind:st.metadata.sense,source_span_ids:[a.sid]});}
   const following=f.semantic_nodes.filter(n=>n.node_type==='REFERENCE'&&n.metadata.literal_tag==='VERSION'&&n.metadata.clause_id===a.cl.id&&span(n).start>=span(ref).end&&!a.events.some(e=>span(e).start>=span(ref).end&&span(e).end<=span(n).start)),versions=uniq(following.map(n=>n.surface));
   ref.metadata.basis_version_candidates=following.map(n=>n.node_id);ref.metadata.basis_attachment_evidence={source_span_ids:uniq([a.sid,...ref.source_span_ids,...following.flatMap(n=>n.source_span_ids)]),explicit_marker:before.trim(),structural_path:[a.parent_structure_id,a.cl.id]};
   const r=f.tools.relation(a.cl,'BASIS',f.tools.task,ref,ref.metadata.basis_attachment_evidence.source_span_ids);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_LOCAL_REFERENCE_VERSION_DOMAIN',version_candidate_node_ids:following.map(n=>n.node_id),source_span_ids:ref.metadata.basis_attachment_evidence.source_span_ids});
   ledger.push({reference_node_id:ref.node_id,relation_id:r.relation_id,version_candidate_node_ids:following.map(n=>n.node_id),versions,source_span_ids:ref.metadata.basis_attachment_evidence.source_span_ids,selected_version:null});
  }
 }
 return f;
}
