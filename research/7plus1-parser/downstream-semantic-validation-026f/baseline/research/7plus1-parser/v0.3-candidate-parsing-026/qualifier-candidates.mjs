import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Preserve modifier ownership and all competing argument extents. Qualifiers
// add source witnesses; they neither license siblings nor retire predicates.
export function qualifierCandidates(f){
 f.proposals.provider='DEPENDENCY_QUALIFIER_CANDIDATES';
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 f.semantic_decoding.qualifier_candidates=[];
 for(const a of f.analyses){const ts=a.cl.tokens;
  for(const st of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id&&n.metadata.sense==='NOMINAL_QUALIFIER_PREDICATE')){
   const p=ts.find(t=>t.id===st.metadata.token_id),owner=ts.find(t=>t.id===st.metadata.owning_token_id);if(!p||!owner)continue;
   const domain=[...new Map(f.relations.filter(r=>r.clause_id===a.cl.id&&['PATIENT','THEME','RESULT','FORBIDS','CONFORMS_TO','BASIS'].includes(r.relation_type)&&sp(nm(r.tail_node_id)).start<=owner.start&&sp(nm(r.tail_node_id)).end>=owner.end).map(r=>[r.tail_node_id,nm(r.tail_node_id)])).values()];
   const markers=ts.filter(t=>t.head===ts.indexOf(p)&&/^(已|已经|未|不|被|already|not)$/iu.test(t.text));
   st.metadata.aspect_candidate=markers.some(t=>/^(已|已经|already)$/iu.test(t.text))?'COMPLETED':'UNSTATED';st.metadata.modifier_span_ids=markers.map(t=>f.tools.span(t.start,t.end));
   for(const target of domain){const r=f.tools.relation(a.cl,'CONJUNCTION',st,target,[a.sid,...st.metadata.modifier_span_ids]);r.generic_evidence??=[];r.generic_evidence.push({rule:'NOMINAL_QUALIFIER_ATTACHMENT_CANDIDATE',candidate_owner_ids:domain.map(n=>n.node_id),source_span_ids:[a.sid,...st.source_span_ids,...st.metadata.modifier_span_ids],dependency_path:[p.id,owner.id]});
    for(const use of f.relations.filter(q=>q.tail_node_id===target.node_id&&['PATIENT','THEME','RESULT','FORBIDS','CONFORMS_TO','BASIS'].includes(q.relation_type)))use.dependency_relation_ids=uniq([...(use.dependency_relation_ids??[]),r.relation_id]);
    f.semantic_decoding.qualifier_candidates.push({state_node_id:st.node_id,owner_node_id:target.node_id,relation_id:r.relation_id,rule:'NOMINAL_QUALIFIER_ATTACHMENT_CANDIDATE',source_span_ids:r.evidence_span_ids,attachment_path:[a.parent_structure_id,a.cl.id,p.id,owner.id,target.node_id]});
   }
  }
  for(const marker of ts.filter(t=>/^(只读|read-only)$/iu.test(t.text)&&/amod|advmod|acl|compound/u.test(t.dep??''))){
   const owner=ts[marker.head];if(!owner)continue;
   const domain=a.events.filter(e=>e.metadata.token_id===owner.id);
   for(const event of domain){const st=f.tools.node(a.cl,'STATE',marker.start,marker.end,{sense:'READ_ONLY_MODE',owner:event.node_id,syntactic_layer:'LOCAL_QUALIFIER',mode:'READ_ONLY',attachment_path:[a.parent_structure_id,a.cl.id,marker.id,owner.id]}),binding=f.tools.relation(a.cl,'CONJUNCTION',st,event,[a.sid]);binding.generic_evidence??=[];binding.generic_evidence.push({rule:'DEPENDENCY_LOCAL_READ_ONLY_MODE',source_span_ids:[a.sid,...st.source_span_ids],token_ids:[marker.id,owner.id]});
    for(const argument of [...f.relations].filter(r=>r.head_node_id===event.node_id&&['PATIENT','THEME'].includes(r.relation_type))){const r=f.tools.relation(a.cl,'RESTRICTS',event,nm(argument.tail_node_id),[a.sid,...st.source_span_ids]);r.dependency_relation_ids=uniq([argument.relation_id,binding.relation_id]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_READ_ONLY_ARGUMENT_RESTRICTION',mode_state_node_id:st.node_id,source_span_ids:[a.sid,...st.source_span_ids],token_ids:[marker.id,owner.id]});}
    f.semantic_decoding.qualifier_candidates.push({event_node_id:event.node_id,state_node_id:st.node_id,relation_id:binding.relation_id,rule:'DEPENDENCY_LOCAL_READ_ONLY_MODE',source_span_ids:[a.sid,...st.source_span_ids],attachment_path:st.metadata.attachment_path});
   }
  }
  // Argument exclusivity needs its own local source witness. An antecedent's
  // "Only after/when/if" is a condition operator, not a patient restriction.
  // These are open attachment proposals; Γ checks their ownership and scope.
  for(const marker of ts.filter(t=>/^(只|仅|只能|仅可|只允许|仅允许|only)$/iu.test(t.text))){
   const after=[...f.source.raw_text].slice(marker.end,a.cl.span.end).join('');
   if(/^\s*(?:after|when|if|unless|until)\b/iu.test(after))continue;
   const owner=ts[marker.head],domain=a.events.filter(e=>{
    const p=ts.find(t=>t.id===e.metadata.token_id);if(!p||!['MAIN','AFFECTED_ACTION'].includes(e.metadata.syntactic_layer??'MAIN'))return false;
    const direct=owner?.id===p.id&&/^(advmod|aux(?::|$))/u.test(marker.dep??'');
    const object=owner&&owner.head===ts.indexOf(p)&&/^(obj|dobj)$/u.test(owner.dep??'')&&/^(advmod|det|amod)$/u.test(marker.dep??'');
    return direct||object;
   });
   for(const event of domain){const p=ts.find(t=>t.id===event.metadata.token_id),state=f.tools.node(a.cl,'STATE',marker.start,marker.end,{sense:'LOCAL_RESTRICTION_MODE',owner:event.node_id,syntactic_layer:'LOCAL_QUALIFIER',mode:'ARGUMENT_ONLY',attachment_path:[a.parent_structure_id,a.cl.id,marker.id,owner.id,p.id]}),binding=f.tools.relation(a.cl,'CONJUNCTION',state,event,[a.sid,...state.source_span_ids]);
    binding.generic_evidence??=[];binding.generic_evidence.push({rule:'DEPENDENCY_LOCAL_ARGUMENT_ONLY_MODE',source_span_ids:[a.sid,...state.source_span_ids],token_ids:[marker.id,owner.id,p.id]});
    for(const argument of [...f.relations].filter(r=>r.head_node_id===event.node_id&&['PATIENT','THEME'].includes(r.relation_type))){const target=nm(argument.tail_node_id),targetSpan=sp(target);if(owner.id!==p.id&&!(targetSpan.start<=owner.start&&targetSpan.end>=owner.end))continue;
     const restriction=f.tools.relation(a.cl,'RESTRICTS',event,target,[a.sid,...state.source_span_ids]);restriction.dependency_relation_ids=uniq([...(restriction.dependency_relation_ids??[]),argument.relation_id,binding.relation_id]);restriction.generic_evidence??=[];restriction.generic_evidence.push({rule:'EXPLICIT_ARGUMENT_ONLY_RESTRICTION',mode_state_node_id:state.node_id,source_span_ids:[a.sid,...state.source_span_ids],token_ids:[marker.id,owner.id,p.id],argument_relation_id:argument.relation_id});
    }
    f.semantic_decoding.qualifier_candidates.push({event_node_id:event.node_id,state_node_id:state.node_id,relation_id:binding.relation_id,rule:'DEPENDENCY_LOCAL_ARGUMENT_ONLY_MODE',source_span_ids:[a.sid,...state.source_span_ids],attachment_path:state.metadata.attachment_path});
   }
  }
 }
 return f;
}
