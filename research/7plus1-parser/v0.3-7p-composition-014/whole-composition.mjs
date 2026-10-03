import {id,uniq} from './identity.mjs';
// Certification consumes typed graph evidence. It does not infer an imperative,
// a distributive quantity, or an aggregate action from an isolated leaf.
export function certifyWholeFrames(f){
 const audit={version:'7P-COMPOSITION-013-R4',consumed_before:'ELIGIBILITY',frames:[]};f.semantic_decoding.whole_composition=audit;f.whole_frame_certificates=new Map();
 const ns=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),ss=new Map(f.source_spans.map(s=>[s.span_id,s])),sets=new Map(f.expressions.set_expr_nodes.map(s=>[s.expr_id,s]));
 const scopeMembers=expr=>{const s=sets.get(expr);if(!s)return [];return s.kind==='ITEM'?[s.entity_node_id]:['ALL','ANY'].includes(s.kind)?[s.base_entity_node_id]:(s.operand_expr_ids??[]).flatMap(scopeMembers);};
 for(const e of f.semantic_nodes.filter(n=>n.node_type==='EVENT')){
  const owner=f.semantic_ownership.get(e.node_id),plan=f.expression_plans.get(e.node_id)??{},rs=f.relations.filter(r=>r.state!=='REJECTED'&&r.head_node_id===e.node_id),args=rs.filter(r=>['PATIENT','THEME','RESULT','AGENT','RECIPIENT'].includes(r.relation_type)),member=e.metadata.qualified_member_certificate,aggregate=f.semantic_decoding.cross_instruction_identity.aggregates.find(a=>a.governing_event_id===e.node_id&&a.state==='CERTIFIED'),a=f.analyses.find(a=>a.cl.id===e.metadata.clause_id);
  const each=a?.cl.tokens.filter(t=>/^(各|each|every)$/iu.test(t.text)&&t.head===a.cl.tokens.findIndex(t=>t.id===e.metadata.token_id))??[],distribution=e.metadata.distribution;
  const members=member?.member_node_ids??aggregate?.member_node_ids??distribution?.file_node_ids??[];
  const rec={certificate_id:id(f.source.sha256,'whole-frame',e.node_id),status:'PARTIAL',predicate_node_id:e.node_id,semantic_owner_id:owner?.semantic_owner_id,owner_status:owner?.status,predicate_layer:owner?.predicate_layer,syntactic_layer_id:owner?.syntactic_layer_id,modality:e.metadata.modality,argument_relation_ids:args.map(r=>r.relation_id),participant_role_witnesses:args.filter(r=>['AGENT','RECIPIENT'].includes(r.relation_type)).map(r=>({relation_id:r.relation_id,node_id:r.tail_node_id,roles:ns.get(r.tail_node_id)?.metadata.participant_roles??[],identity_eligible:!!ns.get(r.tail_node_id)?.metadata.participant_eligibility?.eligible})),member_node_ids:members,scope_expr_id:plan.scope_expr_id??null,condition_expr_id:plan.condition_expr_id??null,scope_member_ids:scopeMembers(plan.scope_expr_id),distribution:distribution??null,output_owner_ids:owner?.owner_output_ids??[],negative_evidence:owner?.negative_ownership_evidence??[],source_span_ids:uniq([...e.source_span_ids,...args.flatMap(r=>r.evidence_span_ids),...(member?.source_span_ids??aggregate?.source_span_ids??[])]),structural_path:owner?.attachment_path??[],checks:{},reasons:[]};
  const exact=ids=>ids.length>0&&ids.every(i=>{const s=ss.get(i);return s&&[...f.source.raw_text].slice(s.start,s.end).join('')===s.text;});
  rec.checks={unique_owner:owner?.status==='UNIQUE',explicit_modality:['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality),arguments_resolved:args.length>0&&args.every(r=>r.state==='RESOLVED'&&ns.get(r.tail_node_id)?.state==='RESOLVED'&&!ns.get(r.tail_node_id)?.unresolved_ref),predicate_provenance:exact(e.source_span_ids),argument_provenance:args.every(r=>exact(r.evidence_span_ids)),required_condition:!plan.unresolved_ref&&e.metadata.condition_binding_certificate?.status!=='UNRESOLVED_CONDITION_BINDING',qualified_member_completeness:!member||member.status==='CERTIFIED'&&members.length>0&&members.every(i=>rec.scope_member_ids.includes(i)&&args.some(r=>r.tail_node_id===i)&&ns.get(i)?.metadata.structural_ownership?.file_node_id===member.owner_file_node_ids[0]),distribution_if_explicit:!each.length||!!distribution&&distribution.operator==='EACH'&&Number.isFinite(distribution.count_per_member)&&members.length>0};
  const insertion=typeof distribution==='object'&&f.semantic_decoding.frame_certification?.test_insertions?.find(t=>t.state==='CERTIFIED'&&t.event_node_id===e.node_id);
  if(insertion){
   rec.checks.owned_insertion_members=members.length>0&&members.every(i=>rec.scope_member_ids.includes(i)&&args.some(r=>r.relation_type==='PATIENT'&&r.tail_node_id===i)&&args.some(r=>r.relation_type==='RESULT'&&r.tail_node_id===i)&&ns.get(i)?.metadata.role_transition?.same_artifact===true);
   rec.checks.owned_insertion_quantity=distribution.operator==='EACH'&&Number.isFinite(distribution.count_per_member)&&distribution.count_per_member>0&&insertion.distribution.count_per_member===distribution.count_per_member&&exact(insertion.source_span_ids)&&insertion.file_node_ids.length===members.length&&insertion.file_node_ids.every(i=>members.includes(i));
   rec.existing_typed_insertion_certificate=insertion;
  }else if(typeof distribution==='object'){
   const q=f.expressions.quantity_expr_nodes.find(q=>q.expr_id===distribution.quantity_expr_id),result=ns.get(distribution.result_node_id);
   rec.source_span_ids=uniq([...rec.source_span_ids,...(distribution.source_span_ids??[]),...(q?.source_span_ids??[])]);
   rec.checks.distributive_members_complete=members.length>0&&new Set(members).size===members.length&&members.every(i=>rec.scope_member_ids.includes(i)&&args.some(r=>r.tail_node_id===i&&r.relation_type==='PATIENT'))&&rec.scope_member_ids.length===members.length;
   rec.checks.distributive_quantity_per_member=distribution.operator==='EACH'&&Number.isFinite(distribution.count_per_member)&&q?.unit==='items_per_member'&&q.lower_bound?.value===distribution.count_per_member&&q.upper_bound?.value===distribution.count_per_member&&q.target_node_ids.includes(result?.node_id)&&exact(q.source_span_ids);
   rec.checks.distributive_result_role=!!result&&args.some(r=>r.relation_type==='RESULT'&&r.tail_node_id===result.node_id)&&exact(result.source_span_ids);
   rec.checks.distributive_owner_and_layer=args.every(r=>{const o=f.semantic_ownership.get(r.tail_node_id);return o?.status==='UNIQUE'&&o.semantic_owner_id===owner.semantic_owner_id&&(o.predicate_layer===owner.predicate_layer);});
   rec.checks.distributive_negative_evidence=!owner?.negative_ownership_evidence.some(n=>n.reason!=='DOMAIN_IS_NOT_CURRENT_EXECUTION')&&(!rec.output_owner_ids.length||owner.owner_category==='OUTPUT_CONTENT');
   rec.quantity_expr_id=distribution.quantity_expr_id??null;
  }
  for(const [k,v]of Object.entries(rec.checks))if(!v)rec.reasons.push(k);rec.status=rec.reasons.length?'PARTIAL':'CERTIFIED';audit.frames.push(rec);f.whole_frame_certificates.set(e.node_id,rec);
  // Only a certified aggregate may be used as a whole-frame scope. A missing
  // distribution remains typed unresolved; no ALL/UNION is fabricated for it.
  if((member||aggregate||distribution||each.length)&&rec.status!=='CERTIFIED'&&a){const ref=plan.unresolved_ref??f.tools.unknown(a.cl,'UNRESOLVED_RELATION','WHOLE_FRAME_INCOMPLETE: '+rec.reasons.join(', '),[e.node_id,...members]);f.expression_plans.set(e.node_id,{...plan,unresolved_ref:ref});rec.unresolved_ref=ref;}
 }
 return f;
}
