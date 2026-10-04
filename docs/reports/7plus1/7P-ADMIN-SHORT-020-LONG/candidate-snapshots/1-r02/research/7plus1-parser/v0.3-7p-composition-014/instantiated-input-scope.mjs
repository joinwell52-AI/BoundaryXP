import {uniq} from './identity.mjs';
// Argument containers and qualified member aliases remain graph evidence; they do
// not independently widen a file-collection input already established by binding.
export function closeInstantiatedInputScope(f){
 const audit={decisions:[]},nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),d=f.semantic_decoding.declared_behavior,identity=f.semantic_decoding.cross_instruction_identity,frames=f.semantic_decoding.frame_certification;
 f.semantic_decoding.instantiated_input_scope=audit;
 function contextualize(relations,record,reason,replacements){for(const r of relations){if(r.state!=='RESOLVED')continue;const before=structuredClone(r);r.state='REJECTED';r.rule_refs=uniq([...r.rule_refs,'INSTANTIATED_INPUT_SCOPE']);audit.decisions.push({relation_id:r.relation_id,reason,source_span_ids:uniq([...r.evidence_span_ids,...record.source_span_ids]),structural_paths:record.structural_paths??[record.structural_path],replacement_node_ids:replacements,before,accountability:'PRESERVED_CONTEXT_ROLE_NOT_INDEPENDENT_TASK_INPUT'});}}
 for(const instance of d.instantiations){
  const frame=frames.call_sites.find(c=>c.frame_id===instance.call_frame_id);
  contextualize(f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&r.head_node_id===frame.behavior_node_id&&frame.argument_node_ids.includes(r.tail_node_id)),instance,'FORMAL_ACTUAL_CONTAINER_OF_INSTANTIATED_FILE_COLLECTION',instance.collection_node_ids);
  const continuity=identity.continuity.find(c=>c.call_frame_id===frame.frame_id&&c.state==='CERTIFIED');
  if(!continuity)continue;
  const parents=f.semantic_nodes.filter(n=>n.metadata.composition_operator==='QUALIFIED_MEMBERS'&&n.metadata.member_node_ids?.includes(continuity.member_node_id)&&f.relations.some(r=>r.relation_type==='SCOPE_MEMBER'&&r.tail_node_id===n.node_id&&r.state==='RESOLVED'));
  if(parents.length===1)contextualize(f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&r.tail_node_id===frame.owner_node_id&&r.head_node_id===f.tools.task.node_id),{...instance,source_span_ids:uniq([...instance.source_span_ids,...parents[0].source_span_ids])},'CALL_MEMBER_ALREADY_OWNED_BY_EXPLICIT_QUALIFIED_INPUT',parents.map(n=>n.node_id));
 }
 // Adding a declared symbol owns a destination file; this syntax alone is not
 // a declaration that the complete pre-existing file is a source input.
 for(const frame of frames.code_ownership.filter(f=>f.state==='CERTIFIED'&&f.frame_kind==='FUNCTION_DECLARATION')){
  if(!d.declarations.some(d=>d.declaration_frame_id===frame.frame_id&&d.status==='SIGNATURE_AVAILABLE'))continue;
  contextualize(f.relations.filter(r=>r.relation_type==='SCOPE_MEMBER'&&r.head_node_id===f.tools.task.node_id&&frame.file_node_ids.includes(r.tail_node_id)),frame,'SYMBOL_DECLARATION_DESTINATION_CONTEXT',frame.file_node_ids);
 }
 return f;
}
