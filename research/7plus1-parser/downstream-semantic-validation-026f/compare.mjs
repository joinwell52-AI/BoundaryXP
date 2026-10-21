export function compare(trace,expected){
 const c=trace.compiler_v03,g=c.candidate_semantic_graph,nm=new Map(g.semantic_nodes.map(n=>[n.node_id,n])),nd=new Map(c.gamma_certification.node_decisions.map(d=>[d.node_id,d])),rd=new Map(c.gamma_certification.decisions.map(d=>[d.relation_id,d])),checks=[];
 const check=(claim,ok,evidence)=>checks.push({claim,status:ok?'PASS':'FAIL',evidence});
 check('contract gates',trace.contract_gate_results.status==='PASS',trace.contract_gate_results);
 check('architecture diagnostic gates with G8 NOT_APPLICABLE',trace.candidate_graph_gate_results.status==='PASS'&&trace.candidate_graph_gate_results.gates.G8.status==='NOT_APPLICABLE',trace.candidate_graph_gate_results);
 check('resolved facts require all certified nodes/relations/expressions',c.boundary_ir.facts.filter(f=>f.state==='RESOLVED').every(f=>f.node_ids.every(i=>nd.get(i)?.decision==='CERTIFIED')&&f.relation_ids.every(i=>rd.get(i)?.decision==='CERTIFIED')&&['scope_expr_id','condition_expr_id','quantity_expr_id'].every(k=>!f[k]||c.gamma_certification.expression_decisions.some(d=>d.expression_id===f[k]&&d.decision==='CERTIFIED'))));
 const current=[];
 for(const [index,frame]of expected.frames.entries()){
  const n=g.semantic_nodes.find(n=>n.metadata.oracle_index===index),facts=c.boundary_ir.facts.filter(f=>f.predicate_node_id===n.node_id),inert=['BACKGROUND','OUTPUT_CONTENT','QUOTE'].includes(frame.domain);
  if((frame.type??'EVENT')==='EVENT'&&!inert){const type=frame.scope?'RESTRICT':frame.modal==='FORBIDDEN'?'FORBID':frame.modal==='NOT_REQUIRED'?'AUX_CONDITION':frame.sense==='stop'?'STOP':'ACTION';
   check('predicate boundary '+JSON.stringify(frame.p)+' '+type,facts.some(f=>f.fact_type===type&&f.state==='RESOLVED'),{node:n,gamma:nd.get(n.node_id),facts});if(type==='ACTION')current.push(n.node_id);
  }else check('no current action for non-execution '+JSON.stringify(frame.p),!facts.some(f=>f.fact_type==='ACTION'&&f.state==='RESOLVED'),facts);
  if(inert)continue;
  if(frame.type==='STATE')check('state retained '+JSON.stringify(frame.p),nd.get(n.node_id)?.decision==='CERTIFIED',nd.get(n.node_id));
  for(const [role,arg]of frame.args??[]){const matches=g.candidate_relations.filter(r=>r.head_node_id===n.node_id&&r.relation_type===(frame.type==='STATE'&&role!=='AGENT'?'CONJUNCTION':role)&&[arg,frame.uniqueReference?.[0]===arg?frame.uniqueReference[1]:null].includes(nm.get(r.tail_node_id)?.surface));
   check('role '+JSON.stringify(frame.p)+' '+role+' '+arg,matches.some(r=>rd.get(r.relation_id)?.decision==='CERTIFIED'),matches.map(r=>({relation:r,decision:rd.get(r.relation_id)})));
  }
  if(frame.condition){const ownedFacts=frame.type==='STATE'?c.boundary_ir.facts.filter(f=>f.node_ids.includes(n.node_id)):facts;check('exact condition binding '+JSON.stringify(frame.p),ownedFacts.some(f=>f.condition_expr_id&&c.boundary_ir.condition_expr_nodes.some(e=>e.expr_id===f.condition_expr_id&&nm.get(e.state_node_id)?.surface===frame.condition)),ownedFacts);}
  if(frame.purposeOwner){const edge=g.candidate_relations.find(r=>r.head_node_id===n.node_id&&nm.get(r.tail_node_id)?.surface===frame.purposeOwner);check('purpose attachment retained',edge&&rd.get(edge.relation_id)?.decision==='CERTIFIED',edge);}
  if(frame.actor&&frame.participantRole){const relations=c.relations.filter(r=>r.head_node_id===n.node_id&&r.relation_type==='AGENT'&&r.state==='RESOLVED');check('source-supported participant role '+frame.participantRole,relations.some(r=>c.semantic_nodes.find(x=>x.node_id===r.tail_node_id)?.metadata.participant_roles?.includes(frame.participantRole)&&c.boundary_ir.facts.some(f=>f.fact_type==='PARTICIPANT'&&f.state==='RESOLVED'&&f.relation_ids.includes(r.relation_id))),relations);}
 }
 check('no extra current actions',c.boundary_ir.facts.filter(f=>f.fact_type==='ACTION'&&f.state==='RESOLVED').every(f=>current.includes(f.predicate_node_id)));
 if(expected.quantity){const q=c.boundary_ir.quantity_expr_nodes.find(q=>q.upper_bound?.value===expected.quantity.value&&q.unit===expected.quantity.unit);check('quantity value/inclusivity',q&&q.upper_bound.inclusive===expected.quantity.inclusive,q);check('budget versus classifier',expected.quantity.kind==='BUDGET'?c.boundary_ir.facts.some(f=>f.fact_type==='RESOURCE'&&f.quantity_expr_id===q?.expr_id):!c.boundary_ir.facts.some(f=>f.fact_type==='RESOURCE'&&f.quantity_expr_id===q?.expr_id));}
 return {status:checks.every(x=>x.status==='PASS')?'PASS':'FAIL',checks,failures:checks.filter(x=>x.status==='FAIL')};
}
