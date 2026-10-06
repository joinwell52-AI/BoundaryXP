import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
// A directive owns an explicit discourse container, not the nearest text.
// Propose modal/actor inheritance with every compatible governor retained.
// Γ validates the frozen structural path and decides whether it is unique.
export function contextCandidates(f){
 f.proposals.provider='STRUCTURAL_TASK_CONTEXT_CANDIDATES';
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]),analysis=n=>f.analyses.find(a=>a.cl.id===n.metadata.clause_id);
 const governors=f.semantic_nodes.filter(n=>n.node_type==='STATE'&&['DIRECTIVE_GOVERNOR','ORGANIZATION_GOVERNOR','RESPONSIBILITY_GOVERNOR'].includes(n.metadata.sense)&&analysis(n)?.discourse.kind==='CURRENT_TASK'&&(n.metadata.governed_predicate_token_ids?.length||n.metadata.governed_structure));
 f.semantic_decoding.task_context_candidates=[];
 for(const a of f.analyses){if(a.discourse.kind!=='CURRENT_TASK')continue;
  const domain=governors.filter(n=>analysis(n)?.parent_structure_id===a.parent_structure_id);
  for(const original of [...a.events]){const p=a.cl.tokens.find(t=>t.id===original.metadata.token_id);if(!p||!['MAIN','AFFECTED_ACTION'].includes(original.metadata.syntactic_layer??'MAIN'))continue;
   const explicit=original.metadata.local_modal_license||['FORBIDDEN','NOT_REQUIRED','PERMITTED'].includes(original.metadata.modality);
   if(explicit||original.metadata.modality!=='UNSTATED')continue;
   // A finite predicate / source-licensed nominal with explicit local roles
   // is eligible for an inherited directive hypothesis. No bare token guess.
   const uses=f.relations.filter(r=>r.head_node_id===original.node_id&&['AGENT','PATIENT','THEME','RESULT','RECIPIENT'].includes(r.relation_type));
   if(!uses.length&&original.metadata.sense==='SOURCE_EVENT'||!(/^(VV|VERB)$/u.test(p.pos??'')||original.metadata.source_predicate_license))continue;
   for(const governor of domain){const owner=analysis(governor),source_span_ids=uniq([a.sid,owner.sid,...governor.source_span_ids,...original.source_span_ids]),contract={rule:'EXPLICIT_DIRECTIVE_CONTAINER_INHERITANCE',governor_node_id:governor.node_id,governor_clause_id:owner.cl.id,owning_clause_id:a.cl.id,structural_container_id:a.parent_structure_id,structural_path:[a.parent_structure_id,owner.cl.id,a.cl.id],source_span_ids};
    const event=f.tools.node(a.cl,'EVENT',sp(original).start,sp(original).end,{...original.metadata,modality:'REQUIRED',modality_rule:'EXPLICIT_DIRECTIVE_CONTAINER_INHERITANCE',context_modal_candidate:contract,modality_unresolved:original.metadata.modality_unresolved});a.events.push(event);
    const inherited=f.tools.relation(a.cl,'CONJUNCTION',governor,event,source_span_ids);inherited.generic_evidence??=[];inherited.generic_evidence.push({...contract});
    for(const r of uses){const target=nm(r.tail_node_id),alt=f.tools.relation(a.cl,r.relation_type,event,target,r.evidence_span_ids);alt.generic_evidence??=[];alt.generic_evidence.push(...(r.generic_evidence??[]).map(x=>structuredClone(x)),{rule:'EXPLICIT_DIRECTIVE_CONTEXT_ARGUMENT',source_span_ids,dependency_relation_id:inherited.relation_id});alt.dependency_relation_ids=uniq([...(alt.dependency_relation_ids??[]),inherited.relation_id]);}
    f.semantic_decoding.task_context_candidates.push({predicate_node_id:event.node_id,...contract,source_relation_id:inherited.relation_id,candidate_only:true});
   }
  }
 }
 return f;
}
