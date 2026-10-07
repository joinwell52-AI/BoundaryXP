import {id} from './util.mjs';
export function boundaryIR(graph,decisions){
 const facts=decisions.filter(d=>['BOUNDARY','UNRESOLVED'].includes(d.decision)).map(d=>({boundary_fact_id:id(graph.graph_id,'fact',d.eligibility_id),kind:d.kind,state:d.decision==='BOUNDARY'?'RESOLVED':'UNRESOLVED',eligibility_id:d.eligibility_id,predicate_id:d.predicate_id??null,object_id:d.object_id??null,argument_ids:d.argument_ids??[],participant_role:d.participant_role??null,modality:d.modality??null,condition_refs:d.condition_refs,scope_refs:d.scope_refs,quantity_ref:d.quantity_ref??null,expression_ref:d.expression_ref??null,node_ids:d.node_ids,relation_ids:d.relation_ids,dependency_ids:d.dependency_ids,source_span_ids:d.source_span_ids,unresolved_ids:d.unresolved_ids}));
 return {schema_version:'boundx-boundary-ir/v0.4-027',root_source_id:graph.source.document_id,facts,expressions:graph.expressions,business_decision:null,execution_authorization:null};
}
