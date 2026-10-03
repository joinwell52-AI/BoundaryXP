import {localizeTypedUnresolved} from '../../../../research/7plus1-parser/v0.3-7p-short-direct-016-r2/anchor-contracts.mjs';
export function checks(x,r){const c=r.compiler_v03,ns=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),a=c.nlp_signals.semantic_decoding.anchor_contracts,rows=[],add=(name,pass)=>rows.push({name,pass:Boolean(pass)});
 add('contract',r.contract_gate_results.status==='PASS');
 if(x.group==='identity'){
  const people=c.canonical_7plus1.P.entries.map(e=>e.display_value);
  if(x.expect.merge){add('informative_identity',people.some(s=>s.startsWith(x.expect.identity+' [')));add('no_bare_duplicate',!people.some(s=>s.startsWith(x.expect.alias+' [')));add('alias_proof',a.identity.some(y=>y.status==='RESOLVED'&&ns.get(y.canonical_node_id)?.surface===x.expect.identity));}
  else {add('distinct_people',x.expect.distinct.every(name=>c.semantic_nodes.some(n=>n.surface===name&&n.metadata.participant_eligibility?.eligible&&!n.metadata.referent_node_id)));add('no_cross_name_coreference',c.relations.filter(y=>y.relation_type==='COREFERENCE'&&y.state==='RESOLVED').every(y=>{const h=ns.get(y.head_node_id),t=ns.get(y.tail_node_id);return !x.expect.distinct.some(name=>h.surface===name&&t.surface!==name&&x.expect.distinct.includes(t.surface));}));}
 }
 if(x.group==='subject'){
  const events=c.semantic_nodes.filter(n=>n.node_type==='EVENT'&&(x.expect.completion_no_actor?n.metadata.completion:n.surface===x.expect.predicate)),agents=events.flatMap(e=>c.relations.filter(r=>r.head_node_id===e.node_id&&r.relation_type==='AGENT'&&r.state!=='REJECTED').map(r=>ns.get(r.tail_node_id)?.surface));
  add('predicate_exists',events.length>0);if(x.expect.no_actor||x.expect.completion_no_actor)add('no_inferred_actor',agents.length===0);else{add('correct_actor',agents.includes(x.expect.actor));if(x.expect.forbidden_actor)add('no_conflicting_actor',!agents.includes(x.expect.forbidden_actor));}
 }
 if(x.group==='completion'){
  const facts=c.boundary_ir.facts.filter(f=>f.fact_type==='COMPLETION'),expr=c.boundary_ir.condition_expr_nodes.find(e=>e.expr_id===facts[0]?.condition_expr_id),states=(expr?.operand_expr_ids??[]).map(i=>ns.get(c.boundary_ir.condition_expr_nodes.find(e=>e.expr_id===i)?.state_node_id));
  add('one_completion',facts.length===1);add('AND_two_operands',expr?.op==='AND'&&states.length===x.expect.operands&&new Set(expr.operand_expr_ids).size===2);add('necessary',facts.length&&ns.get(facts[0].predicate_node_id).metadata.condition_strength==='NECESSARY_ONLY');add('universal',states.some(n=>n?.metadata.universal_scope));add('all_operand_provenance',states.every(n=>n?.source_span_ids.length));if(x.expect.confirmation)add('confirmation_not_flat_negation',states.some(n=>/确认|confirms/u.test(n?.surface??'')));
 }
 return rows;
}
export function coverageFixture(x){
 const uid='unknown',endpoint={node_id:'u',node_type:'UNKNOWN_REFERENT',surface:x.text,unresolved_ref:uid,metadata:{}},other={node_id:'candidate',node_type:'ENTITY',metadata:{}},types=x.expect.typed_unknown_role==='FORBID_OBJECT'?['FORBID']:x.expect.typed_unknown_role==='RECIPIENT'?['ACTION','PARTICIPANT']:['ACTION','DELIVERABLE','COMPLETION'];
 const f={source:{raw_text:x.text},semantic_decoding:{},semantic_nodes:[endpoint,other],relations:[],unresolved:[{unresolved_id:uid,related_node_ids:['u','candidate'],related_clause_ids:['c']}],eligibility_decisions:types.map((type,i)=>({eligibility_decision_id:'d'+i,proposed_fact_type:type,disposition:'BOUNDARY',unresolved_ref:uid})),boundary_ir:{facts:types.map((type,i)=>({boundary_fact_id:'b'+i,fact_type:type,unresolved_ref:uid}))},coverage:[{coverage_record_id:'coverage',clause_id:'c',disposition:'UNRESOLVED',unresolved_refs:[uid],eligibility_decision_ids:types.map((_,i)=>'d'+i),affected_slots:['I','O','A','P','R','V','C','B'],impact_evidence:{}}],structure:{nodes:[]}};
 localizeTypedUnresolved(f);const slots=f.coverage[0].affected_slots;return {source:x.text,fixture_type:'EXPLICIT_TYPED_USE_SITE_GRAPH_NOT_END_TO_END_EXTRACTION',result:f,assertions:[{name:'exact_typed_impact',pass:JSON.stringify([...slots].sort())===JSON.stringify([...x.expect.affected].sort())},{name:'unrelated_slots_excluded',pass:x.expect.unaffected.every(s=>!slots.includes(s))},{name:'unknown_retained',pass:f.unresolved.length===1&&f.semantic_nodes[0].node_type==='UNKNOWN_REFERENT'}]};
}
