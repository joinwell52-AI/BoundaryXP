import {registry,slotIdentity} from './compiler/validation/proof.mjs';
import {proofFields} from './compiler/contracts/schema.mjs';
import {id,uniq} from './identity.mjs';
export function produceProof(context,spans){const reg=registry(context,spans),nodes=[],edges=[],lookup=new Map();const keys={...proofFields,SEMANTIC_NODE:'node_id',SOURCE_SPAN:'span_id'};
 for(const [kind,objects] of Object.entries(reg))for(const obj of objects){const objectId=obj[keys[kind]],pid=id('proof',kind,objectId);nodes.push({kind,id:pid,[proofFields[kind]]:objectId});lookup.set(kind+':'+objectId,pid);}
 const edge=(kind,a,other,b,type)=>{const from=lookup.get(kind+':'+a),to=lookup.get(other+':'+b);if(!from||!to)throw Error('DANGLING_PROOF_PRODUCTION '+kind+':'+a+' -> '+other+':'+b);const key=id('proof-edge',from,to,type);if(!edges.some(e=>e.edge_id===key))edges.push({edge_id:key,edge_type:type,from_id:from,to_id:to});};
 for(const x of reg.SPAN_CANDIDATE)edge('SPAN_CANDIDATE',x.span_candidate_id,'SOURCE_SPAN',x.source_span_id,'EXTRACTED_FROM');
 for(const x of reg.SEMANTIC_NODE)for(const b of x.span_candidate_ids)edge('SEMANTIC_NODE',x.node_id,'SPAN_CANDIDATE',b,'ASSEMBLED_FROM');
 for(const x of reg.RELATION)for(const b of [x.head_node_id,x.tail_node_id])edge('RELATION',x.relation_id,'SEMANTIC_NODE',b,'DECODED_FROM');
 for(const x of reg.STRUCTURE_NODE)for(const b of x.source_span_ids)edge('STRUCTURE_NODE',x.structure_node_id,'SOURCE_SPAN',b,'EXTRACTED_FROM');
 for(const x of reg.CLAUSE){edge('CLAUSE',x.clause_id,'STRUCTURE_NODE',x.structure_node_id,'ASSEMBLED_FROM');for(const b of x.source_span_ids)edge('CLAUSE',x.clause_id,'SOURCE_SPAN',b,'EXTRACTED_FROM');}
 for(const x of reg.COVERAGE_RECORD){if(x.clause_id)edge('COVERAGE_RECORD',x.coverage_record_id,'CLAUSE',x.clause_id,'COMPILES_FROM');if(x.structure_node_id)edge('COVERAGE_RECORD',x.coverage_record_id,'STRUCTURE_NODE',x.structure_node_id,'COMPILES_FROM');}
 for(const x of reg.COVERAGE_RECORD)for(const e of x.eligibility_decision_ids)edge('COVERAGE_RECORD',x.coverage_record_id,'ELIGIBILITY_DECISION',e,'COMPILES_FROM');
 for(const x of reg.ELIGIBILITY_DECISION){for(const b of x.candidate_relation_ids)edge('ELIGIBILITY_DECISION',x.eligibility_decision_id,'RELATION',b,'DECODED_FROM');for(const b of x.candidate_node_ids)edge('ELIGIBILITY_DECISION',x.eligibility_decision_id,'SEMANTIC_NODE',b,'DECODED_FROM');}
 for(const [kind,field] of [['SET_EXPR','scope_expr_id'],['CONDITION_EXPR','condition_expr_id'],['QUANTITY_EXPR','quantity_expr_id']]){
  for(const x of reg[kind]){for(const b of x.source_span_ids)edge(kind,x.expr_id,'SOURCE_SPAN',b,'EXTRACTED_FROM');for(const b of uniq([...x.relation_ids,x.relation_id]))edge(kind,x.expr_id,'RELATION',b,'COMPILES_FROM');for(const b of uniq([x.entity_node_id,x.base_entity_node_id,x.state_node_id,...x.target_node_ids??[],...x.value_node_ids??[]]))edge(kind,x.expr_id,'SEMANTIC_NODE',b,'COMPILES_FROM');for(const b of uniq([...x.operand_expr_ids??[],x.operand_expr_id,x.base_expr_id,x.excluded_expr_id]))edge(kind,x.expr_id,kind,b,'ASSEMBLED_FROM');if(x.boundary_fact_id)edge(kind,x.expr_id,'BOUNDARY_FACT',x.boundary_fact_id,'COMPILES_FROM');}
  for(const f of reg.BOUNDARY_FACT)if(f[field]){edge('BOUNDARY_FACT',f.boundary_fact_id,kind,f[field],'COMPILES_FROM');edge('ELIGIBILITY_DECISION',f.eligibility_decision_id,kind,f[field],'DECODED_FROM');}
 }
 for(const f of reg.BOUNDARY_FACT){edge('BOUNDARY_FACT',f.boundary_fact_id,'ELIGIBILITY_DECISION',f.eligibility_decision_id,'COMPILES_FROM');for(const b of f.relation_ids)edge('BOUNDARY_FACT',f.boundary_fact_id,'RELATION',b,'COMPILES_FROM');for(const b of f.node_ids)edge('BOUNDARY_FACT',f.boundary_fact_id,'SEMANTIC_NODE',b,'COMPILES_FROM');}
 for(const x of reg.CANONICAL_ENTRY)for(const b of x.boundary_fact_ids)edge('CANONICAL_ENTRY',x.canonical_entry_id,'BOUNDARY_FACT',b,'PROJECTS_TO');
 for(const x of reg.CANONICAL_SLOT_RESULT)for(const b of reg.COVERAGE_RECORD)edge('CANONICAL_SLOT_RESULT',slotIdentity(context.canonical_7plus1.projection_id,x.slot),'COVERAGE_RECORD',b.coverage_record_id,'PROJECTS_TO');
 return {proof_dag_id:id(context.boundary_ir.boundary_ir_id,'proof-dag'),nodes,edges};
}
