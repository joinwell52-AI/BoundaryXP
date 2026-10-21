export function checks(x,r){
 const c=r.compiler_v03,ns=c.semantic_nodes,ir=c.boundary_ir,sp=new Map(r.source_spans.map(s=>[s.span_id,s])),out=[];
 const add=(check,pass,evidence)=>out.push({check,pass:!!pass,evidence});
 add('contract-and-source',r.contract_gate_results.status==='PASS'&&c.source.sha256===x.source_sha256,null);
 if(x.stage==='R2'){
  if(x.expected_mechanism_contract==='QUALIFIED_MEMBER_PAIR'){const xs=c.nlp_signals.semantic_decoding.qualified_identity?.members??[];add('one-file-qualified-complete-member-set',xs.some(a=>a.status==='CERTIFIED'&&a.member_node_ids.length===2&&a.owner_file_node_ids.length===1&&ir.set_expr_nodes.some(s=>s.expr_id===a.member_set_expr_id&&s.kind==='UNION'&&s.operand_expr_ids.length===2)),xs);}
  if(x.expected_mechanism_contract==='PROTECTED_COLLECTION'){const lit=c.nlp_signals.literals.find(l=>l.type==='PATH'&&l.span.quote.includes('*')),nodes=ns.filter(n=>n.node_type==='ENTITY'&&n.source_span_ids.some(i=>sp.get(i)?.start===lit?.span.start&&sp.get(i)?.end===lit?.span.end));add('protected-wildcard-target-full-identity',lit&&nodes.length&&nodes.some(n=>c.relations.some(r=>r.tail_node_id===n.node_id&&['PATIENT','SCOPE_MEMBER'].includes(r.relation_type)&&r.state==='RESOLVED')),nodes);add('collection-ALL-source-pattern',nodes.some(n=>n.metadata.collection?.source_pattern===lit.span.quote&&ir.set_expr_nodes.some(e=>e.kind==='ALL'&&e.base_entity_node_id===n.node_id)),nodes);}
  if(x.expected_mechanism_contract==='BASIS_NOT_I'){const ids=ir.facts.filter(f=>f.fact_type==='BASELINE'&&f.state==='RESOLVED').flatMap(f=>f.object_node_ids);add('basis-explicit-relation-not-I',ids.length&&ids.every(i=>c.relations.some(r=>r.tail_node_id===i&&r.relation_type==='BASIS'&&r.state==='RESOLVED'))&&!c.canonical_7plus1.I.entries.some(e=>e.boundary_fact_ids.some(id=>ir.facts.find(f=>f.boundary_fact_id===id)?.object_node_ids.some(i=>ids.includes(i)))),ids);}
 }else if(x.stage==='R3'){
  const rs=c.relations.filter(r=>r.relation_type==='RECIPIENT'&&r.state==='RESOLVED'),ps=ir.facts.filter(f=>f.fact_type==='PARTICIPANT'&&f.state==='RESOLVED'&&f.participant_node_ids.some(i=>ns.find(n=>n.node_id===i)?.metadata.participant_roles?.includes('RECIPIENT')));
  add(x.expected_mechanism_contract,x.expected_mechanism_contract==='UNRESOLVED_RECIPIENT'?c.unresolved.some(u=>/referent|recipient|antecedent/iu.test(u.reason))&&!ps.length:rs.length>0&&ps.length>0,{relations:rs,facts:ps});
 }else if(x.stage==='R4'){
  const rows=c.nlp_signals.semantic_decoding.whole_composition?.frames??[];
  add(x.expected_mechanism_contract,rows.some(a=>a.status==='CERTIFIED'&&a.member_node_ids.length===3),rows);
 }
 return out;
}
