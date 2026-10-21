import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
// Reference domains are proposals. All source mentions, candidate bindings and
// argument alternatives survive here; unique selection occurs only in Γ.
export function referenceCandidates(f){
 f.proposals.provider='STRUCTURALLY_BOUNDED_REFERENCE_CANDIDATES';
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const ledger=[];f.semantic_decoding.reference_candidate_domains=ledger;
 // Ellipsis has no invented text span: its predicate is the source witness.
 // All earlier generated documents in the same explicit discourse container
 // form the domain. Γ must establish uniqueness; proximity selects nothing.
 for(const a of f.analyses)for(const head of [...a.events].filter(n=>['send','report'].includes(n.metadata.sense))){
  if(f.relations.some(r=>r.head_node_id===head.node_id&&['PATIENT','THEME'].includes(r.relation_type)))continue;
  const domain=[...new Map(f.relations.filter(r=>r.relation_type==='RESULT'&&sp(nm(r.tail_node_id)).end<sp(head).start&&f.analyses.find(b=>b.cl.id===r.clause_id)?.parent_structure_id===a.parent_structure_id).map(r=>nm(r.tail_node_id)).filter(n=>/\.(?:md|txt|pdf|docx)$/iu.test(n.surface)).map(n=>[n.node_id,n])).values()];
  const s=sp(head),ref=f.tools.node(a.cl,'UNKNOWN_REFERENT',s.start,s.end,{sense:'ELLIPTICAL_DOCUMENT_OBJECT',owner:head.node_id,argument_role:'UNSTATED_OBJECT',reference_use:true,coreference_domain:{kind:'STRUCTURALLY_BOUNDED_GENERATED_DOCUMENT_ELLIPSIS',candidate_node_ids:domain.map(n=>n.node_id),structural_path:[a.parent_structure_id,a.cl.id,head.node_id],source_span_ids:uniq([a.sid,...head.source_span_ids,...domain.flatMap(n=>n.source_span_ids)])}});
  const original=f.tools.relation(a.cl,'THEME',head,ref,[a.sid,...head.source_span_ids]);original.generic_evidence??=[];original.generic_evidence.push({rule:'ELLIPTICAL_DOCUMENT_OBJECT_CANDIDATE',source_span_ids:original.evidence_span_ids});
 }
 for(const r of [...f.relations].filter(r=>['PATIENT','THEME'].includes(r.relation_type))){
  const head=nm(r.head_node_id),ref=nm(r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);
  const elliptical=ref.metadata.argument_role==='UNSTATED_OBJECT',pronounContinuation=/^(it|them|它|其)$/iu.test(ref.surface)&&['send','report','review'].includes(head.metadata.sense),previous=f.analyses[f.analyses.indexOf(a)-1],continued=pronounContinuation&&previous&&previous.parent_structure_id===a.parent_structure_id&&(/[;；]/u.test(previous.cl.delimiter??'')||previous.cl.sentence_id===a.cl.sentence_id)?f.relations.filter(q=>q.clause_id===previous.cl.id&&['PATIENT','THEME'].includes(q.relation_type)).map(q=>nm(q.tail_node_id)):[];
  if(!['send','report','receive','review','generate'].includes(head.metadata.sense)||!elliptical&&!pronounContinuation&&!/^(?:(?:该|这份|上述|最终|本次)?(?:报告|文档)|(?:the )?(?:final )?(?:report|document))$/iu.test(ref.surface))continue;
  const resultDomain=f.relations.filter(q=>q.relation_type==='RESULT'&&sp(nm(q.tail_node_id)).end<sp(ref).start&&f.analyses.find(b=>b.cl.id===q.clause_id)?.parent_structure_id===a.parent_structure_id).map(q=>nm(q.tail_node_id)).filter(n=>/\.(?:md|txt|pdf|docx)$/iu.test(n.surface));
  const allMaterials=f.relations.filter(q=>q.relation_type==='SCOPE_MEMBER'&&sp(nm(q.tail_node_id)).end<sp(ref).start&&f.analyses.find(b=>b.cl.id===q.clause_id)?.parent_structure_id===a.parent_structure_id).map(q=>nm(q.tail_node_id)).filter(n=>/\.(?:md|txt|pdf|docx)$/iu.test(n.surface));
  const continuedDocuments=continued.some(n=>/^(?:the )?(?:final )?(?:report|document)$|^(?:该|最终)?报告$/iu.test(n.surface)),domain=[...new Map((elliptical?ref.metadata.coreference_domain.candidate_node_ids.map(nm):pronounContinuation?continuedDocuments?resultDomain:continued:/^最终|^(?:the )?(?:final )?(?:report|document)$/iu.test(ref.surface)?resultDomain:[...resultDomain,...allMaterials]).map(n=>[n.node_id,n])).values()];
  if(!domain.length)continue;
  ref.metadata.reference_use=true;ref.metadata.coreference_domain={kind:'DOCUMENT_ROLE_REFERENCE',candidate_node_ids:domain.map(n=>n.node_id),structural_path:[a.parent_structure_id,a.cl.id],source_span_ids:uniq([a.sid,...ref.source_span_ids,...domain.flatMap(n=>n.source_span_ids)])};
  const alternatives=[];
  for(const target of domain){
   const alias=f.tools.relation(a.cl,'COREFERENCE',ref,target,ref.metadata.coreference_domain.source_span_ids);alias.generic_evidence??=[];alias.generic_evidence.push({rule:'STRUCTURALLY_OWNED_DOCUMENT_ROLE_DOMAIN',source_span_ids:ref.metadata.coreference_domain.source_span_ids,structural_path:ref.metadata.coreference_domain.structural_path});
   const replacement=f.tools.relation(a.cl,['send','report','receive'].includes(head.metadata.sense)?'THEME':'PATIENT',head,target,ref.metadata.coreference_domain.source_span_ids);replacement.generic_evidence??=[];replacement.generic_evidence.push({rule:'REFERENCE_ARGUMENT_BINDING_ALTERNATIVE',reference_node_id:ref.node_id,coreference_relation_id:alias.relation_id,source_span_ids:ref.metadata.coreference_domain.source_span_ids});replacement.dependency_relation_ids=uniq([...(replacement.dependency_relation_ids??[]),alias.relation_id]);alternatives.push(replacement.relation_id);
  }
  ledger.push({reference_node_id:ref.node_id,source_relation_id:r.relation_id,alternative_relation_ids:alternatives,candidate_node_ids:domain.map(n=>n.node_id),source_span_ids:ref.metadata.coreference_domain.source_span_ids,selected_node_ids:[]});
 }
 return f;
}
