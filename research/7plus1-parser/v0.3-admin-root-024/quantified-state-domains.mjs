import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

// A quantified referential state binds to a unique prior explicit nominal
// domain, never to the nearest phrase or an unconstrained pool of nouns.
export function quantifiedStateDomains(f){
 const {nm,sp,edge,expr}=graphApi(f),log=[],substitutions=new Map();f.semantic_decoding.quantified_state_domain_ir=log;
 for(const st of f.semantic_nodes.filter(n=>n.node_type==='STATE'&&n.metadata.quantifier==='ALL'&&!n.metadata.object_node_ids?.length)){
  const a=f.analyses.find(a=>a.cl.id===st.metadata.clause_id),match=/(?:两类|两个)(检查|说明)(?:都|均)(完成|完整)/u.exec(st.surface);if(!a||!match)continue;
  const domains=f.semantic_decoding.nominal_coordination_ir.filter(d=>d.component_node_ids.length===2&&d.operator==='AND'&&sp(nm(d.parent_node_id)).end<sp(st).start).filter(d=>{
   const r=f.relations.find(r=>r.relation_id===d.argument_relation_id),event=nm(r?.head_node_id),previous=f.analyses.find(b=>b.cl.id===r?.clause_id);
   return r?.state==='SUPPORTED'&&r.relation_type==='PATIENT'&&event?.node_type==='EVENT'&&['review','analyze'].includes(event.metadata.sense)&&previous?.parent_structure_id===a.parent_structure_id&&(match[1]==='检查'||nm(d.parent_node_id).surface.endsWith(match[1]));
  });
  const distinct=[...new Map(domains.map(d=>[d.component_node_ids.map(i=>nm(i).surface).join('|'),d])).values()];
  if(distinct.length!==1){
   const u=f.tools.unknown(a.cl,'UNRESOLVED_COREFERENCE','Quantified state reference has no unique compatible explicit two-member domain',distinct.flatMap(d=>d.component_node_ids));st.state='UNRESOLVED';st.unresolved_ref=u;
   log.push({state_node_id:st.node_id,candidate_domain_ids:distinct.map(d=>d.expression_id),status:'UNRESOLVED',unresolved_id:u});continue;
  }
  const domain=distinct[0],members=domain.component_node_ids.map(nm),rs=members.map(n=>edge(a,'CONJUNCTION',st,n,domain.source_span_ids));st.metadata.object_node_ids=members.map(n=>n.node_id);st.metadata.domain_binding_rule='UNIQUE_EXPLICIT_QUANTIFIED_NOMINAL_DOMAIN';st.metadata.referent_scope_expr_id=domain.expression_id;
  const agents=f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===st.node_id&&r.relation_type==='AGENT');
  const childExprs=members.map(member=>{
   const s=sp(st),child=f.tools.node(a.cl,'STATE',s.start,s.end,{sense:match[2]==='完成'?'CHECK_COMPLETED':'CONTENT_COMPLETE',owner:member.node_id,discourse:a.discourse,syntactic_layer:'CONDITION_ANTECEDENT',object_node_ids:[member.node_id],participant_node_ids:agents.map(r=>r.tail_node_id),predicate_state:match[2],shared_predicate_state_id:st.node_id,domain_binding_rule:st.metadata.domain_binding_rule});
   const r=edge(a,'CONJUNCTION',child,member,domain.source_span_ids),owned=edge(a,'CONJUNCTION',st,child,domain.source_span_ids);rs.push(r,owned);
   const actorRelations=agents.map(r=>edge(a,'AGENT',child,nm(r.tail_node_id),r.evidence_span_ids));rs.push(...actorRelations);
   a.local_condition_states??=[];if(!a.local_condition_states.some(n=>n.node_id===child.node_id))a.local_condition_states.push(child);
   return expr(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:child.node_id,source_span_ids:uniq([a.sid,...child.source_span_ids,...member.source_span_ids]),relation_ids:[r.relation_id,owned.relation_id,...actorRelations.map(r=>r.relation_id)]});
  });
  const replacement=expr(f.expressions.condition_expr_nodes,{op:'AND',operand_expr_ids:childExprs,source_span_ids:uniq([a.sid,...domain.source_span_ids]),relation_ids:rs.map(r=>r.relation_id)});
  for(const x of f.expressions.condition_expr_nodes.filter(x=>x.op==='STATE_REF'&&x.state_node_id===st.node_id))substitutions.set(x.expr_id,replacement);
  for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===st.node_id&&['CONDITION_OF','COMPLETION_OF'].includes(r.relation_type)))r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),...rs.map(x=>x.relation_id)]);
  log.push({state_node_id:st.node_id,candidate_domain_ids:[domain.expression_id],selected_domain_id:domain.expression_id,member_node_ids:members.map(n=>n.node_id),condition_expr_id:replacement,source_span_ids:uniq([a.sid,...domain.source_span_ids]),status:'UNIQUE'});
 }
 const rewrite=(key,seen=[])=>{if(!key||seen.includes(key))return key;if(substitutions.has(key))return substitutions.get(key);const x=f.expressions.condition_expr_nodes.find(x=>x.expr_id===key);if(!x)return key;const childKeys=uniq([...x.operand_expr_ids??[],x.operand_expr_id]);if(!childKeys.length)return key;const mapped=childKeys.map(i=>rewrite(i,[...seen,key]));if(mapped.every((j,k)=>j===childKeys[k]))return key;const {expr_id,...body}=x;return expr(f.expressions.condition_expr_nodes,{...body,...(x.operand_expr_ids?{operand_expr_ids:mapped}:{operand_expr_id:mapped[0]})});};
 for(const p of f.expression_plans.values())if(p.condition_expr_id)p.condition_expr_id=rewrite(p.condition_expr_id);
 return f;
}
