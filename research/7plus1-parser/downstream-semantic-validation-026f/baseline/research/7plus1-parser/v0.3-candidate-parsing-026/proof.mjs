import {id} from '../v0.3-7p-composition-014/identity.mjs';
export function candidateProof(c){
 const g=c.candidate_semantic_graph,G=c.gamma_certification,nodes=[],edges=[];
 const add=(kind,object_id)=>{const key=id(g.graph_id,'candidate-proof',kind,object_id);if(!nodes.some(n=>n.id===key))nodes.push({id:key,kind,object_id});return key;};
 const link=(kind,a,other,b,edge_type)=>{const from_id=add(kind,a),to_id=add(other,b),edge_id=id(from_id,to_id,edge_type);if(!edges.some(e=>e.edge_id===edge_id))edges.push({edge_id,from_id,to_id,edge_type});};
 for(const r of g.candidate_relations){for(const s of r.source_span_ids)link('CANDIDATE_RELATION',r.candidate_relation_id,'SOURCE_SPAN',s,'PROPOSED_FROM');for(const e of r.evidence_ids)link('CANDIDATE_RELATION',r.candidate_relation_id,'EVIDENCE',e,'SUPPORTED_BY');}
 for(const e of g.evidence)for(const s of e.source_span_ids??[])link('EVIDENCE',e.evidence_id,'SOURCE_SPAN',s,'EXTRACTED_FROM');
 for(const e of g.candidate_expressions)for(const s of e.source_span_ids)link('CANDIDATE_EXPRESSION',e.candidate_expression_id,'SOURCE_SPAN',s,'PROPOSED_FROM');
 for(const d of G.decisions){link('RELATION',d.relation_id,'GAMMA_DECISION',d.gamma_decision_id,'DECIDED_BY');link('GAMMA_DECISION',d.gamma_decision_id,'CANDIDATE_RELATION',d.candidate_relation_id,'CERTIFIES_CANDIDATE');}
 for(const d of G.expression_decisions)link('GAMMA_DECISION',d.gamma_decision_id,'CANDIDATE_EXPRESSION',d.candidate_expression_id,'CERTIFIES_CANDIDATE');
 for(const d of G.node_decisions)for(const s of d.source_span_ids)link('GAMMA_DECISION',d.gamma_decision_id,'SOURCE_SPAN',s,'CERTIFIES_NODE_EVIDENCE');
 for(const d of G.normalization_decisions??[]){link('GAMMA_DECISION',d.gamma_decision_id,'CANDIDATE_NORMALIZATION',d.candidate_id,'DECIDES_NORMALIZATION_EVIDENCE');for(const s of d.source_span_ids)link('CANDIDATE_NORMALIZATION',d.candidate_id,'SOURCE_SPAN',s,'PROPOSED_FROM');for(const e of d.evidence_ids??[])link('CANDIDATE_NORMALIZATION',d.candidate_id,'EVIDENCE',e,'SUPPORTED_BY');}
 for(const b of c.boundary_certification){for(const d of b.gamma_decision_ids)link('BOUNDARY_FACT',b.boundary_fact_id,'GAMMA_DECISION',d,'REQUIRES_CERTIFICATION');for(const r of c.boundary_ir.facts.find(f=>f.boundary_fact_id===b.boundary_fact_id).relation_ids)link('BOUNDARY_FACT',b.boundary_fact_id,'RELATION',r,'COMPILES_FROM');}
 for(const slot of [...'IOAPRVCB'])for(const e of c.canonical_7plus1[slot].entries)for(const f of e.boundary_fact_ids)link('CANONICAL_ENTRY',e.canonical_entry_id,'BOUNDARY_FACT',f,'PROJECTS_FROM');
 return {proof_dag_id:id(g.graph_id,'candidate-lineage-proof'),nodes,edges};
}
