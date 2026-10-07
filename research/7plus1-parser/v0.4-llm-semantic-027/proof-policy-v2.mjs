import {proofDAG as baseProof} from './proof.mjs';
export function proofDAG(graph,gamma,eligibility,ir,receipts){
 const proof=baseProof(graph,gamma,eligibility,ir,receipts),items=new Map([...graph.nodes,...graph.relations,...graph.expressions].map(c=>[c.id,c])),decisions=new Map(gamma.decisions.map(d=>[d.candidate_id,d]));
 for(const f of ir.facts){for(const ref of f.dependency_ids){const d=decisions.get(ref);if(d&&!proof.edges.some(e=>e.from===f.eligibility_id&&e.to===d.decision_id))proof.edges.push({from:f.eligibility_id,to:d.decision_id,kind:'FACT_CONSTRAINT_DEPENDENCY'});}for(const scopeId of f.scope_refs){const scope=ir.expressions.find(e=>e.id===scopeId);if(scope?.origin!=='DETERMINISTIC_CERTIFIED_ARGUMENT_ROLE')continue;if(!proof.nodes.some(n=>n.id===scopeId))proof.nodes.push({id:scopeId,kind:'CERTIFIED_ARGUMENT_SCOPE_NORMALIZATION',operator:scope.operator,operands:scope.operands,source_span_ids:scope.source_span_ids});proof.edges.push({from:f.boundary_fact_id,to:scopeId,kind:'LOCAL_ROLE_SCOPE'});for(const ref of scope.normalization_dependencies){const d=decisions.get(ref);if(d)proof.edges.push({from:scopeId,to:d.decision_id,kind:'NORMALIZATION_DEPENDENCY'});}}}
 const dependencies=c=>c.family==='nodes'?[c.owner].filter(Boolean):c.family==='relations'?[c.head,c.tail]:[c.owner,...c.operands,...(c.quantity?[c.quantity.target]:[])];
 for(const d of gamma.decisions){const c=items.get(d.candidate_id);for(const ref of dependencies(c)){const target=decisions.get(ref);if(target&&!proof.edges.some(e=>e.from===d.decision_id&&e.to===target.decision_id))proof.edges.push({from:d.decision_id,to:target.decision_id,kind:'CERTIFICATION_DEPENDENCY'});}}
 proof.audit=[];
 for(const f of ir.facts.filter(f=>f.state==='RESOLVED')){
  const reachable=new Set(),queue=[f.boundary_fact_id];while(queue.length){const i=queue.pop();if(reachable.has(i))continue;reachable.add(i);queue.push(...proof.edges.filter(e=>e.from===i).map(e=>e.to));}
  const closure=new Set(),todo=[...f.dependency_ids],gaps=[];while(todo.length){const i=todo.pop();if(closure.has(i))continue;closure.add(i);const c=items.get(i),d=decisions.get(i);if(!c||d?.decision!=='CERTIFIED'||!reachable.has(d.decision_id)){gaps.push('UNPROVED_CERTIFICATION_DEPENDENCY '+i);continue;}for(const sid of c.source_span_ids)if(!reachable.has(sid))gaps.push('UNREACHABLE_SOURCE '+sid);todo.push(...dependencies(c));}
  if(!f.source_span_ids.length)gaps.push('EMPTY_FACT_SOURCE');proof.audit.push({boundary_fact_id:f.boundary_fact_id,reachable_ids:[...reachable],transitive_candidate_dependencies:[...closure],gaps});
 }
 proof.gap_count=proof.audit.reduce((n,a)=>n+a.gaps.length,0);proof.transitive_certification_dependencies_recorded=true;
 return proof;
}
