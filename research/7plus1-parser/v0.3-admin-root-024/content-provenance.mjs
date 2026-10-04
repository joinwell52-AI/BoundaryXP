import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';

// Content is a deliverable's requirement, not an independent execution frame.
// Only the already explicit requirement→output ownership path is propagated.
export function contentProvenance(f){
 const requirements=f.semantic_decoding.output_content_ir.requirements,nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),byNode=new Map();
 for(const req of requirements.filter(r=>r.ownership_status==='UNIQUE_OUTPUT'&&r.owner_output_ids.length===1))for(const i of req.semantic_node_ids){if(!byNode.has(i))byNode.set(i,[]);byNode.get(i).push(req);}
 for(const [i,records] of byNode){const owners=uniq(records.flatMap(r=>r.owner_output_ids)),n=nm.get(i),own=f.semantic_ownership.get(i);if(!n||!own||owners.length!==1)continue;
  const spans=uniq(records.flatMap(r=>r.source_span_ids)),relations=uniq(records.flatMap(r=>r.ownership_evidence_relation_ids));
  const proof={rank:2,rule:'EXPLICIT_COMPONENT_REQUIREMENT_OWNER',requirement_ids:records.map(r=>r.requirement_id),relation_ids:relations,source_span_ids:spans};
  Object.assign(own,{status:'UNIQUE',owner_category:'OUTPUT_CONTENT',semantic_owner_id:id(f.source.sha256,'semantic-owner','OUTPUT_CONTENT',owners),owner_output_ids:owners,ownership_relation_ids:relations,source_span_ids:uniq([...own.source_span_ids,...spans]),inheritance_override_proof:[...own.inheritance_override_proof,proof],negative_ownership_evidence:own.negative_ownership_evidence.filter(e=>e.reason!=='OUTPUT_OWNER_NOT_UNIQUE')});
  n.metadata.semantic_ownership=own;n.metadata.content_owner_provenance=proof;
 }
 for(const req of requirements.filter(r=>r.ownership_status==='UNIQUE_OUTPUT'&&r.owner_output_ids.length===1)){
  const dependencies=uniq(req.ownership_evidence_relation_ids),owner=req.owner_output_ids[0];
  for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='RESULT'&&r.tail_node_id===owner)){r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),...dependencies]);r.content_requirement_ids=uniq([...(r.content_requirement_ids??[]),req.requirement_id]);}
 }
 return f;
}
