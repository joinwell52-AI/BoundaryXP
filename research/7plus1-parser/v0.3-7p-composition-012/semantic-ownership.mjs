import {id,uniq} from './identity.mjs';
import {directiveLayer} from './instruction-syntax.mjs';

// Implementation metadata over v0.3 discourse/structure. This is not a new IR type.
const inert=new Set(['BACKGROUND','RATIONALE','CODE','EXAMPLE','TABLE','METADATA','QUOTE','OUTPUT_CONTENT']);
const modal=/不得|禁止|严禁|不要|必须|务必|须|应当|must|shall|do not|may|only/iu;
export function predicateEnclosure(source,at){
 const cp=[...source.quote],stack=[],pairs={'（':'）','(':')','“':'”','「':'」','『':'』','"':'"',"'":"'",'`':'`'};
 for(let i=0;i<Math.max(0,at-source.start);i++){
  const ch=cp[i];if(ch==="'"&&/[A-Za-z0-9]/u.test(cp[i-1]??'')&&/[A-Za-z0-9]/u.test(cp[i+1]??''))continue;
  if(ch===stack.at(-1)?.close){stack.pop();continue;}if(stack.at(-1)?.open==='`')continue;
  if(pairs[ch])stack.push({open:ch,close:pairs[ch],start:source.start+i});
 }
 return stack;
}
function structuralBlock(f,d,at){
 const ann=f.discourse.annotations.find(a=>a.structure_id===d?.structure_id);
 const parent=f.discourse.annotations.find(a=>a.structure_id===ann?.owner_structure_id);
 const child=f.doc.structure.nodes.find(n=>n.id===ann?.structure_id),pnode=f.doc.structure.nodes.find(n=>n.id===parent?.structure_id);
 // Explicit Markdown indentation plus the existing list-owner path, never adjacency.
 const ind=s=>/^\s*/u.exec(s.quote)[0].replace(/[\r\n]/gu,'').length;
 if(ann&&parent&&ann!==parent&&pnode?.type==='LIST_ITEM'&&child?.type==='PARAGRAPH'&&ind(ann.source_span)>ind(parent.source_span)&&ann.structural_path.includes(parent.structure_id)){
  return {start:parent.source_span.start,end:ann.source_span.end,quote:[...f.source.raw_text].slice(parent.source_span.start,ann.source_span.end).join(''),continuation:{parent_structure_id:parent.structure_id,child_structure_id:ann.structure_id,structural_path:ann.structural_path,source_span_ids:[f.tools.span(parent.source_span.start,parent.source_span.end),f.tools.span(ann.source_span.start,ann.source_span.end)],rule:'INDENTED_LIST_CONTINUATION'}};
 }
 return d?.source_span??ann?.source_span??{start:at,end:at,quote:''};
}
export function buildSemanticOwnership(f,phase='FINAL'){
 const spans=new Map(f.source_spans.map(s=>[s.span_id,s])),relations=f.relations.filter(r=>r.state!=='REJECTED'),byNode=new Map(),owners=new Map();
 const contents=f.semantic_decoding.discourse.output_content_requirements??[];
 const records=[];
 for(const n of f.semantic_nodes){
  const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id),d=n.metadata.discourse??a?.discourse??{},s=spans.get(n.source_span_ids[0]);
  const task=n===f.tools.task,at=s?.start??0,block=structuralBlock(f,d,at),stack=task?[]:predicateEnclosure(block,at),path=uniq([...(d.structural_path??['document']),d.structure_id]);
  const rawDomain=d.kind??(task?'CURRENT_TASK':null),headings=path.map(i=>f.discourse.annotations.find(x=>x.structure_id===i)).filter(x=>x?.heading_marker_span);
  const subtask=headings.findLast(h=>/^\s*#{1,6}\s*(?:子任务|subtask(?:\s|$))/iu.test(h.source_span.quote));
  let category=rawDomain==='CURRENT_TASK'||rawDomain==='DELIVERABLE_SPEC'?subtask?'CURRENT_TASK_SUBTASK':'CURRENT_TASK_ROOT':rawDomain;
  const layer=rawDomain==='CODE'?'CODE':stack.some(x=>['（','('].includes(x.open))?'PARENTHETICAL':stack.length?'QUOTED':n.node_type==='STATE'&&relations.some(r=>r.head_node_id===n.node_id&&r.relation_type==='CONDITION_OF')?'CONDITION_ANTECEDENT':relations.some(r=>r.tail_node_id===n.node_id&&r.relation_type==='CONDITION_OF')?'CONDITION_CONSEQUENT':'MAIN';
  const layerStart=stack.at(-1)?.start??block.start,layerPath=stack.map(x=>({kind:['（','('].includes(x.open)?'PARENTHETICAL':'QUOTED',source_span_id:f.tools.span(x.start,x.start+1)}));
  const inheritance=[{rank:1,rule:'EXPLICIT_STRUCTURE_PATH',structural_path:path,source_span_ids:d.source_span?[f.tools.span(d.source_span.start,d.source_span.end)]:n.source_span_ids}];
  if(block.continuation)inheritance.push({rank:1,...block.continuation});
  const negative=[];let status=category?'UNIQUE':'AMBIGUOUS',ownerOutputIds=[],ownerRelations=[];
  if(category==='OUTPUT_CONTENT'){
   const local=contents.filter(r=>r.clause_id===a?.cl.id&&r.semantic_node_ids.includes(n.node_id));
   const candidates=local.filter(r=>['UNIQUE_OUTPUT','OUTPUT_SET'].includes(r.ownership_status)&&r.owner_output_ids?.length);
   const domains=uniq(candidates.map(r=>JSON.stringify([...r.owner_output_ids].sort())));
   if(domains.length===1){ownerOutputIds=JSON.parse(domains[0]);ownerRelations=uniq(candidates.flatMap(r=>r.ownership_evidence_relation_ids??[]));inheritance.push({rank:2,rule:'EXPLICIT_OUTPUT_CONTENT_OWNER',requirement_ids:candidates.map(r=>r.requirement_id),relation_ids:ownerRelations,source_span_ids:uniq(candidates.flatMap(r=>r.source_span_ids))});}
   else{status='AMBIGUOUS';negative.push({reason:'OUTPUT_OWNER_NOT_UNIQUE',candidate_output_sets:domains.map(JSON.parse),source_span_ids:n.source_span_ids});}
  }
  if(d.mixed_section)inheritance.push({rank:3,rule:'INDEPENDENT_DIRECTIVE_IN_MIXED_SECTION',source_span_ids:[f.tools.span(d.directive_marker_span.start,d.directive_marker_span.end)]});
  if(category==='ACCEPTANCE'||category==='OUT_OF_SCOPE')inheritance.push({rank:4,rule:'EXPLICIT_SECTION_ROLE',structural_path:path,source_span_ids:inheritance[0].source_span_ids});
  const cert=n.metadata.frame_certification;
  if(cert?.state==='CERTIFIED')inheritance.push({rank:5,rule:'CERTIFIED_FRAME_OWNER',frame_id:cert.frame_id,boundary_role:cert.boundary_role,source_span_ids:cert.source_span_ids,structural_path:cert.structural_path});
  if(n.metadata.structural_ownership?.source_span_ids)inheritance.push({rank:5,rule:'CERTIFIED_ARGUMENT_ATTACHMENT',...n.metadata.structural_ownership});
  const modalIds=uniq([...(n.metadata.modality_source_span_ids??[]),n.metadata.modality_source_span_id]);
  const localModal=modalIds.map(i=>spans.get(i)).filter(s=>s&&s.start>=layerStart&&s.end<=block.end&&modal.test(s.text));
  const localPrefix=[...block.quote].slice(layerStart-block.start,at-block.start).join(''),layerModal=modal.test(localPrefix);
  const predicate=n.node_type==='EVENT'||n.node_type==='STATE';
  if(predicate&&stack.length&&!localModal.length&&!layerModal)negative.push({reason:'ENCLOSED_PREDICATE_HAS_NO_INDEPENDENT_MODAL_LICENSE',rejected_modal_source_span_ids:modalIds,source_span_ids:uniq([...n.source_span_ids,...layerPath.map(x=>x.source_span_id)]),layer_path:layerPath});
  if(predicate&&block.continuation&&n.metadata.modality_rule==='EXPLICIT_DOCUMENT_IMPERATIVE'&&!directiveLayer({source_span:block},at).allowed&&!layerModal){status='AMBIGUOUS';negative.push({reason:'WRAPPED_LINE_HAS_NO_INDEPENDENT_DIRECTIVE_LICENSE',source_span_ids:block.continuation.source_span_ids,owning_source_prefix:localPrefix});}
  if(inert.has(category))negative.push({reason:'DOMAIN_IS_NOT_CURRENT_EXECUTION',domain:category,source_span_ids:inheritance[0].source_span_ids});
  if(category==='ACCEPTANCE')negative.push({reason:'ACCEPTANCE_IS_NOT_EXECUTION',source_span_ids:inheritance[0].source_span_ids});
  const ownerId=category==='OUTPUT_CONTENT'&&ownerOutputIds.length?id(f.source.sha256,'semantic-owner','OUTPUT_CONTENT',ownerOutputIds):id(f.source.sha256,'semantic-owner',category,category==='CURRENT_TASK_ROOT'?'document':subtask?.structure_id??d.owner_structure_id??'document');
  const record={node_id:n.node_id,status,semantic_owner_id:status==='UNIQUE'?ownerId:null,owner_category:category??'UNKNOWN_OWNER',predicate_layer:layer,syntactic_layer_id:id(f.source.sha256,'predicate-layer',block.start,layerPath,layer,a?.cl.sentence_id),owning_proposition_id:a?.cl.id??'DOCUMENT',discourse_domain:rawDomain??'UNKNOWN',structural_parent_path:path,attachment_path:[...path,...layerPath.map(x=>x.source_span_id),a?.cl.id].filter(Boolean),owner_output_ids:ownerOutputIds,ownership_relation_ids:ownerRelations,source_span_ids:uniq([...n.source_span_ids,...inheritance.flatMap(x=>x.source_span_ids??[])]),inheritance_override_proof:inheritance,negative_ownership_evidence:negative};
  records.push(record);byNode.set(n.node_id,record);n.metadata.semantic_ownership=record;
  if(!owners.has(ownerId))owners.set(ownerId,{semantic_owner_id:ownerId,category:record.owner_category,parent_owner_id:subtask?id(f.source.sha256,'semantic-owner','CURRENT_TASK_ROOT','document'):null,structural_parent_path:path,owner_output_ids:ownerOutputIds,source_span_ids:inheritance[0].source_span_ids});
 }
 const previous=f.semantic_decoding.semantic_ownership;
 f.semantic_ownership=byNode;f.semantic_decoding.semantic_ownership={version:'7P-COMPOSITION-012-R1',phase,precedence:['EXPLICIT_STRUCTURE','EXPLICIT_OUTPUT_CONTENT','CURRENT_SUBTASK_HEADING','ACCEPTANCE_OUT_OF_SCOPE','CERTIFIED_FRAME','LOCAL_LINGUISTIC','UNRESOLVED'],owners:[...owners.values()],records,consumed_by:['FRAME_CERTIFICATION','ELIGIBILITY'],pre_frame_consumption:previous?.phase==='PRE_FRAME'?previous.decisions:previous?.pre_frame_consumption??[],decisions:[]};return f;
}
// Owner/domain and fact role are orthogonal. This policy licenses only existing
// typed evidence; it never creates a relation or supplies a missing argument.
export function factRoleOwnerPolicy(type,records,rs,byNode){
 const role=type==='ACTION'?'EXECUTION_ACTION':type==='BASELINE'?'NORMATIVE_BASIS':['FORBID','RESTRICT'].includes(type)?'CONSTRAINT':['COMPLETION','STOP','AUX_CONDITION'].includes(type)?'COMPLETION_CONDITION':type.startsWith('AUX_')?'STRUCTURAL_EVIDENCE':type==='PARTICIPANT'?'PARTICIPATION':['TASK_OBJECT','DELIVERABLE'].includes(type)?'ARTIFACT_ROLE':'UNKNOWN_ROLE';
 const acceptance=records.some(r=>r.owner_category==='ACCEPTANCE');
 const evidence=rs.filter(r=>r.state==='RESOLVED');
 const basis=type==='BASELINE'&&evidence.some(r=>r.relation_type==='BASIS'&&byNode.get(r.tail_node_id)?.node_type==='REFERENCE');
 const constraint=['FORBID','RESTRICT'].includes(type)&&records.some(r=>{
  const n=byNode.get(r.node_id);return ['EVENT','STATE'].includes(n?.node_type)&&
   (type==='FORBID'?n.metadata.modality==='FORBIDDEN':n.metadata.restrict||n.metadata.restriction_kind==='NO_CHANGE')&&
   evidence.some(e=>e.head_node_id===n.node_id&&['FORBIDS','RESTRICTS','PATIENT','THEME'].includes(e.relation_type));
 });
 const condition=['COMPLETION','STOP','AUX_CONDITION','AUX_QUANTITY','AUX_SEQUENCE'].includes(type);
 const allowed=!acceptance||basis||constraint||condition;
 return {candidate_fact_role:role,owner_categories:uniq(records.map(r=>r.owner_category)),acceptance_domain:acceptance,allowed,policy:acceptance?'ACCEPTANCE_FACT_ROLE_COMPATIBILITY':'EXISTING_OWNER_DOMAIN_GATES',licensing_relation_ids:acceptance&&(basis||constraint)?evidence.filter(r=>basis?r.relation_type==='BASIS':['FORBIDS','RESTRICTS','PATIENT','THEME'].includes(r.relation_type)).map(r=>r.relation_id):[],reason:allowed?'OWNER_FACT_ROLE_COMPATIBLE':'ACCEPTANCE_DOES_NOT_LICENSE_EXECUTION_OR_ARTIFACT_ROLE'};
}
export function ownershipDecision(f,type,rs,nodeIds,details={}){
 if(!f.semantic_ownership)throw Error('SEMANTIC_OWNER_CONTRACT_NOT_BUILT');
 // Condition witnesses are arguments of the governing predicate, not co-owners
 // of its execution layer. Their own auxiliary facts are checked independently.
 const byNode=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),heads=details.predicate_node_id?[details.predicate_node_id]:uniq(rs.filter(r=>byNode.get(r.head_node_id)?.node_type!=='DISCOURSE').map(r=>r.head_node_id));
 const ids=heads.length?heads:nodeIds,records=ids.map(i=>f.semantic_ownership.get(i)).filter(Boolean),negative=records.flatMap(r=>r.negative_ownership_evidence);
 const relevant=records.filter(r=>['EVENT','STATE'].includes(byNode.get(r.node_id)?.node_type));
 const ambiguous=records.some(r=>r.status==='AMBIGUOUS'),enclosed=relevant.some(r=>r.negative_ownership_evidence.some(e=>e.reason==='ENCLOSED_PREDICATE_HAS_NO_INDEPENDENT_MODAL_LICENSE'));
 const policy=factRoleOwnerPolicy(type,records,rs,byNode);
 const result={type,candidate_node_ids:ids,owner_record_node_ids:records.map(r=>r.node_id),semantic_owner_ids:uniq(records.map(r=>r.semantic_owner_id)),source_span_ids:uniq(records.flatMap(r=>r.source_span_ids)),negative_ownership_evidence:negative,fact_role_policy:policy,decision:ambiguous?'UNRESOLVED_OWNER':enclosed||!policy.allowed?'OUTSIDE_ENVELOPE':'ALLOW',reason:ambiguous?'NO_UNIQUE_ADMISSIBLE_SEMANTIC_OWNER':enclosed?'ENCLOSED_PREDICATE_WITHOUT_INDEPENDENT_LICENSE':!policy.allowed?policy.reason:'OWNER_AND_LAYER_RETAINED'};
 f.semantic_decoding.semantic_ownership.decisions.push(result);return result;
}
