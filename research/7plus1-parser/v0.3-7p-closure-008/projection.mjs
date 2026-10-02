import {queryGraph} from './graph-queries.mjs';
import {id,SLOTS} from './identity.mjs';
const map={TASK_OBJECT:'I',DELIVERABLE:'O',ACTION:'A',PARTICIPANT:'P',RESOURCE:'R',BASELINE:'V',COMPLETION:'C',STOP:'C',FORBID:'B',RESTRICT:'B'};
// This module consumes only BoundaryIR, semantic registry and coverage. No text recognizers or model imports.
export function projectCanonical(ir,nodes,coverage,unresolved){
 const nmap=new Map(nodes.map(n=>[n.node_id,n])),projection={projection_id:id(ir.boundary_ir_id,'projection')};
 const relevant=slot=>coverage.filter(c=>c.affected_slots.includes(slot));
 for(const slot of SLOTS){const entries=queryGraph(slot,ir,nodes).map(f=>{const pred=nmap.get(f.predicate_node_id),object=f.object_node_ids.map(i=>nmap.get(i)?.surface).filter(Boolean).join('、'),people=f.participant_node_ids.map(i=>{const original=nmap.get(i),n=nmap.get(original?.metadata.referent_node_id)??original;return n?.surface+' ['+(n?.metadata.participant_roles??[]).join(',')+']';}).join('、'),display=slot==='P'?people:slot==='A'||slot==='B'?[pred?.metadata.modality,pred?.surface,object===pred?.surface?null:object].filter(Boolean).join(' '):object||pred?.surface||f.node_ids.map(i=>nmap.get(i)?.surface).filter(Boolean).join('、');return {canonical_entry_id:id(f.boundary_fact_id,'entry',slot),slot,boundary_fact_ids:[f.boundary_fact_id],state:f.state,display_value:display,source_span_ids:f.source_span_ids,...Object.fromEntries(['scope_expr_id','condition_expr_id','quantity_expr_id'].filter(k=>f[k]).map(k=>[k,f[k]]))};});
  if(slot==='P'){const groups=new Map();for(const e of entries){const prior=groups.get(e.display_value);if(prior){prior.boundary_fact_ids.push(...e.boundary_fact_ids);prior.source_span_ids=[...new Set([...prior.source_span_ids,...e.source_span_ids])];}else groups.set(e.display_value,e);}entries.splice(0,entries.length,...groups.values());}
  projection[slot]={slot,status:entries.some(e=>e.state==='UNRESOLVED')?'UNRESOLVED':relevant(slot).some(c=>c.disposition==='COVERAGE_FAILURE')?'PARSER_COVERAGE_FAILURE':relevant(slot).some(c=>c.disposition==='UNRESOLVED')?'UNRESOLVED':entries.length?'RESOLVED':'ABSENT',entries};
 }
 return projection;
}
