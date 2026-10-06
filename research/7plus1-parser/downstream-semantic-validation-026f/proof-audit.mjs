export function auditProof(t){
 const c=t.compiler_v03,g=c.candidate_semantic_graph,G=c.gamma_certification,sm=new Map(t.source_spans.map(s=>[s.span_id,s])),points=[...c.source.raw_text],gaps=[],rows=[];
 function reach(dag,root){const seen=new Set(),stack=[root];while(stack.length){const id=stack.pop();if(!id||seen.has(id))continue;seen.add(id);stack.push(...dag.edges.filter(e=>e.from_id===id).map(e=>e.to_id));}return dag.nodes.filter(n=>seen.has(n.id));}
 for(const fact of c.boundary_ir.facts.filter(f=>f.state==='RESOLVED')){
  const standard=reach(c.proof_dag,c.proof_dag.nodes.find(n=>n.kind==='BOUNDARY_FACT'&&n.boundary_fact_id===fact.boundary_fact_id)?.id),candidate=reach(c.candidate_proof,c.candidate_proof.nodes.find(n=>n.kind==='BOUNDARY_FACT'&&n.object_id===fact.boundary_fact_id)?.id),missing=[];
  const required=[...fact.node_ids.map(i=>G.node_decisions.find(d=>d.node_id===i)?.gamma_decision_id),...fact.relation_ids.map(i=>G.decisions.find(d=>d.relation_id===i)?.gamma_decision_id),...['scope_expr_id','condition_expr_id','quantity_expr_id'].filter(k=>fact[k]).map(k=>G.expression_decisions.find(d=>d.expression_id===fact[k])?.gamma_decision_id)];
  for(const id of required)if(!id||!candidate.some(n=>n.kind==='GAMMA_DECISION'&&n.object_id===id))missing.push('MISSING_REACHABLE_GAMMA_DECISION '+id);
  for(const id of fact.node_ids){const n=c.semantic_nodes.find(n=>n.node_id===id);if(!standard.some(n=>n.kind==='SEMANTIC_NODE'&&n.semantic_node_id===id))missing.push('MISSING_REACHABLE_SEMANTIC_NODE '+id);if(!n?.metadata.semantic_ownership?.attachment_path?.length)missing.push('MISSING_OWNERSHIP_PATH '+id);}
  for(const id of fact.source_span_ids){const s=sm.get(id);if(!s||points.slice(s.start,s.end).join('')!==s.text||!standard.some(n=>n.kind==='SOURCE_SPAN'&&n.source_span_id===id))missing.push('MISSING_EXACT_REACHABLE_SOURCE '+id);}
  for(const k of ['scope_expr_id','condition_expr_id','quantity_expr_id'])if(fact[k]&&!standard.some(n=>n.expr_id===fact[k]))missing.push('MISSING_REACHABLE_EXPRESSION '+fact[k]);
  rows.push({boundary_fact_id:fact.boundary_fact_id,standard_reachable_ids:standard.map(n=>n.id),candidate_reachable_ids:candidate.map(n=>n.id),ownership_records:fact.node_ids.map(i=>c.semantic_nodes.find(n=>n.node_id===i)?.metadata.semantic_ownership),required_gamma_ids:required,gaps:missing});gaps.push(...missing.map(reason=>({boundary_fact_id:fact.boundary_fact_id,reason})));
 }
 return {resolved_facts:rows.length,gap_count:gaps.length,gaps,rows,scope:'Actual final-fact reachability in standard and candidate DAG; exact source, Γ node/relation/expression and ownership path. Not a natural-language truth proof.'};
}
