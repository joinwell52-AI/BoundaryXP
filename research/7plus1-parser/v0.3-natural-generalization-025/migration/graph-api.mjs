import {id,uniq} from '../../v0.3-7p-composition-014/identity.mjs';
export const length=s=>[...s].length;
export function graphApi(f){
 const cp=[...f.source.raw_text],nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const expr=(list,body)=>{if(body.op==='NOT'&&body.operand_expr_ids){if(body.operand_expr_ids.length!==1)throw Error('NEGATION_REQUIRES_ONE_OPERAND');const {operand_expr_ids,...rest}=body;body={...rest,operand_expr_id:operand_expr_ids[0]};}body={...body,source_span_ids:uniq(body.source_span_ids??[]),relation_ids:uniq(body.relation_ids??[])};const e={expr_id:id(f.source.sha256,'expr',body),...body};if(!list.some(x=>x.expr_id===e.expr_id))list.push(e);return e.expr_id;};
 const edge=(a,type,h,t,evidence=[])=>{const r=f.tools.relation(a.cl,type,h,t,uniq([a.sid,...h.source_span_ids,...t.source_span_ids,...evidence]));if(!r)throw Error('ILLEGAL_LOCAL_RELATION_'+type);r.state='SUPPORTED';delete r.unresolved_ref;r.evidence_tier='HARD';r.rule_refs=uniq([...r.rule_refs,'ADMIN_ROOT_019_TYPED_COMPOSITION']);return r;};
 const retire=(a,reason)=>{
  const relations=f.relations.filter(r=>r.clause_id===a.cl.id);for(const r of relations){r.state='REJECTED';delete r.unresolved_ref;}
  for(const e of a.events){e.metadata.retired_by_admin_root=reason;delete e.unresolved_ref;delete e.metadata.modality_unresolved;f.expression_plans.delete(e.node_id);}
  const old=f.unresolved.filter(u=>u.related_clause_ids.length===1&&u.related_clause_ids[0]===a.cl.id);
  f.semantic_decoding.local_replacements??=[];f.semantic_decoding.local_replacements.push({clause_id:a.cl.id,reason,retired_relation_ids:relations.map(r=>r.relation_id),retired_diagnostics:structuredClone(old),source_span_ids:[a.sid]});
  const ids=new Set(old.map(u=>u.unresolved_id));f.unresolved.splice(0,f.unresolved.length,...f.unresolved.filter(u=>!ids.has(u.unresolved_id)));
  for(const n of f.semantic_nodes)if(ids.has(n.unresolved_ref)){delete n.unresolved_ref;if(n.state==='UNRESOLVED')n.state='RESOLVED';}
  a.events=[];a.state=null;a.local_condition_states=[];a.handled=true;
 };
 const outputs=a=>[...new Map(f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='RESULT'&&sp(nm(r.tail_node_id)).start<a.cl.span.start).map(r=>[nm(r.tail_node_id).metadata.artifact_identity??nm(r.tail_node_id).surface,nm(r.tail_node_id)])).values()];
 return {cp,nm,sp,expr,edge,retire,outputs};
}

