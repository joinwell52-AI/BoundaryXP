import {checks as old} from './acceptance-checks.mjs';
export function checks(x,r){
 if(!x.new_in_013)return old(x,r);
 const c=r.compiler_v03,a=c.nlp_signals.semantic_decoding.source_binding,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),out=[];
 const add=(check,pass,evidence)=>out.push({check,pass:!!pass,evidence});
 add('contract gate',r.contract_gate_results.status==='PASS',r.contract_gate_results);
 add('exact source evidence',r.source_spans.every(s=>[...x.text].slice(s.start,s.end).join('')===s.text),null);
 if(x.family==='REFERENT'){
  const rows=a.referents.filter(v=>v.status!=='NOT_DEICTIC');
  if(x.expected_mechanism_contract==='NOT_DEICTIC')add('ordinary/finite target is not deictic',rows.length===0&&a.referents.some(v=>v.status==='NOT_DEICTIC'),a.referents);
  else{
   add('declared referent contract',rows.length>0&&rows.every(v=>v.status===x.expected_mechanism_contract),rows);
   if(x.expected_mechanism_contract==='CERTIFIED_REFERENT_SET'){
    add('certified member set, not mention ITEM',rows.every(v=>v.selected_member_node_ids.length===2&&v.collection_node_id&&v.scope_expr_id&&c.boundary_ir.set_expr_nodes.find(e=>e.expr_id===v.scope_expr_id)?.base_entity_node_id===v.collection_node_id),rows);
    if(x.quantifier)add('quantifier preserved',rows.every(v=>v.quantifier===x.quantifier),rows);
   }else add('unresolved mention never resolved boundary',rows.every(v=>v.unresolved_ref)&&!c.boundary_ir.facts.some(f=>f.state==='RESOLVED'&&f.object_node_ids.some(i=>rows.some(v=>v.mention_node_id===i))),rows);
  }
 }else{
  const rows=a.conditions.filter(v=>!x.target||c.boundary_ir.facts.some(f=>f.predicate_node_id===v.predicate_node_id&&f.object_node_ids.some(i=>nm.get(i)?.surface===x.target)));
  if(x.expected_mechanism_contract==='OUTPUT_OWNED')add('condition stays output owned',rows.length>0&&rows.every(v=>nm.get(v.predicate_node_id)?.metadata.semantic_ownership.owner_category==='OUTPUT_CONTENT')&&!c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'),rows);
  else{
   add('declared condition contract',rows.length>0&&rows.every(v=>v.status===x.expected_mechanism_contract),rows);
   if(x.expected_mechanism_contract==='CERTIFIED_CONDITIONAL')add('condition fact/proof carries actual expression',rows.every(v=>v.condition_expr_id&&c.boundary_ir.condition_expr_nodes.some(e=>e.expr_id===v.condition_expr_id)),rows);
   if(x.expected_mechanism_contract==='UNRESOLVED_CONDITION_BINDING')add('no unconditional resolved prohibition',rows.every(v=>v.unresolved_ref)&&!c.boundary_ir.facts.some(f=>f.fact_type==='FORBID'&&f.state==='RESOLVED'&&rows.some(v=>f.predicate_node_id===v.predicate_node_id)),rows);
  }
 }
 return out;
}
