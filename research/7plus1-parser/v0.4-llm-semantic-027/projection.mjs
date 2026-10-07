import {id,uniq} from './util.mjs';
export const queries={I:['TASK_OBJECT'],O:['DELIVERABLE'],A:['ACTION'],P:['PARTICIPANT'],R:['RESOURCE'],V:['BASELINE'],C:['COMPLETION','STOP'],B:['FORBIDDEN_OPERATION','RESTRICTION']};
export function project(graph,ir,coverage){
 const nodes=new Map(graph.nodes.map(n=>[n.id,n])),exprs=new Map(graph.expressions.map(e=>[e.id,e]));
 const value=ref=>{const n=nodes.get(ref),e=exprs.get(ref);return n?{node_id:ref,semantic_identity:n.semantic_identity,source_quotes:n.sources?.map(s=>s.quote)??[]}:e?{expression_id:ref,kind:e.kind,operator:e.operator,operands:e.operands,quantity:e.quantity}:null;};
 const slots={};
 for(const [slot,kinds]of Object.entries(queries)){
  const entries=ir.facts.filter(f=>kinds.includes(f.kind)).map(f=>({entry_id:id(graph.graph_id,'query',slot,f.boundary_fact_id),kind:f.kind,state:f.state,value:value(f.object_id??f.predicate_id??f.expression_ref??f.quantity_ref),predicate:value(f.predicate_id),arguments:f.argument_ids.map(value),participant_role:f.participant_role,modality:f.modality,condition:f.condition_refs.map(value),scope:f.scope_refs.map(value),quantity:value(f.quantity_ref),boundary_fact_ids:[f.boundary_fact_id],source_span_ids:f.source_span_ids,unresolved_ids:f.unresolved_ids}));
  const facts=ir.facts.filter(f=>kinds.includes(f.kind));
  const gaps=coverage.rows.filter(r=>r.disposition==='PARSER_COVERAGE_FAILURE'&&(!r.candidate_ids.length||r.issues.some(i=>['SOURCE_PARSER_COVERAGE_GAP','AUDITOR_CLEAR_SEMANTIC_MISS','REJECTED_SOURCE_SEMANTICS_NOT_ACCOUNTED','REGION_NOT_ACCOUNTED_EXACTLY_ONCE'].includes(i))||facts.some(f=>f.dependency_ids.some(i=>r.candidate_ids.includes(i)))));
  const unknown=coverage.rows.filter(r=>r.disposition==='TYPED_UNRESOLVED'&&(!r.candidate_ids.length||facts.some(f=>f.dependency_ids.some(i=>r.candidate_ids.includes(i)))));
  const structural=graph.structure_status==='MULTI_WP_STRUCTURE_REQUIRED'||graph.structure_status==='STRUCTURE_UNRESOLVED';
  slots[slot]={state:structural||gaps.length?'PARSER_COVERAGE_FAILURE':entries.some(e=>e.state==='UNRESOLVED')||unknown.length?'UNRESOLVED':entries.length?'RESOLVED':'ABSENT',openness:entries.length?'CONSTRAINED':'OPEN',entries,coverage_gap_regions:gaps.map(r=>r.region_id),unresolved_regions:unknown.map(r=>r.region_id)};
 }
 return {schema_version:'boundx-canonical-7plus1/v0.4-027',root_source_id:graph.source.document_id,structure_status:graph.structure_status,slots,business_decision:null,execution_authorization:null,detail_space:'OPEN_FOR_REFINEMENT'};
}
