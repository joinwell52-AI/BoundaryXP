import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

const modal={REQUIRED:'必须',PERMITTED:'可以',NOT_REQUIRED:'无需',FORBIDDEN:'不得'};
export function nliProposition(f,r){
 const nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sm=i=>f.source_spans.find(s=>s.span_id===i),h=nm(r.head_node_id),t=nm(r.tail_node_id),plan=f.expression_plans.get(['CONDITION_OF','COMPLETION_OF'].includes(r.relation_type)?t.node_id:h.node_id)??{};
 const relevant=f.relations.filter(x=>x.state==='SUPPORTED'&&x.head_node_id===h.node_id),values=types=>uniq(relevant.filter(x=>types.includes(x.relation_type)).map(x=>nm(x.tail_node_id)?.surface)).join('、');
 const actor=r.relation_type==='AGENT'?t.surface:values(['AGENT']),object=['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS'].includes(r.relation_type)?t.surface:values(['PATIENT','THEME','RESULT','FORBIDS','RESTRICTS']),recipient=r.relation_type==='RECIPIENT'?t.surface:values(['RECIPIENT']);
 const expressions=new Map(f.expressions.condition_expr_nodes.map(x=>[x.expr_id,x])),conditions=[];
 function condition(id,seen=[]){if(seen.includes(id))return null;const e=expressions.get(id);if(!e)return null;
  if(e.op==='STATE_REF'){const n=nm(e.state_node_id);if(!n)return null;conditions.push(n);
   if(n.metadata.shared_predicate_state_id){const objects=(n.metadata.object_node_ids??[]).map(nm),parent=nm(n.metadata.shared_predicate_state_id),text=parent?.metadata.condition_text??parent?.surface??n.surface;
    const explicit=n.metadata.predicate_state&&text.includes(n.metadata.predicate_state)?n.metadata.predicate_state:null,verbs=[...text.matchAll(/失败|通过|完成|完整|成功|\b(?:failed|fails|passed|succeeded|complete|completed)\b/giu)].map(m=>m[0]),predicate=explicit??(uniq(verbs).length===1?verbs[0]:null);
    if(objects.length!==1||!objects[0]||!predicate)return null;return objects[0].surface+' '+predicate;}
   return n.metadata.condition_text??sm(n.source_span_ids[0])?.text;}
  if(e.op==='NOT'){const value=condition(e.operand_expr_id,[...seen,id]);return value?'非（'+value+'）':null;}
  const children=(e.operand_expr_ids??[]).map(j=>condition(j,[...seen,id]));return children.length&&children.every(Boolean)?children.map(x=>'（'+x+'）').join(e.op==='OR'?'或':'且'):null;
 }
 const antecedent=plan.condition_expr_id?condition(plan.condition_expr_id):null;
 if(plan.condition_expr_id&&!antecedent)return {status:'UNSUPPORTED_CONDITIONAL_HYPOTHESIS',relation_id:r.relation_id,condition_expr_id:plan.condition_expr_id};
 let consequent;
 if(r.relation_type==='LIMIT'){
  const q=f.expressions.quantity_expr_nodes.find(x=>x.target_node_ids.includes(h.node_id)&&x.value_node_ids.includes(t.node_id));
  if(!q)return {status:'UNSUPPORTED_QUANTITY_HYPOTHESIS',relation_id:r.relation_id};
  consequent=h.surface+' 的'+q.metric+' '+(q.lower_bound?(q.lower_bound.inclusive?'至少':'大于')+q.lower_bound.value:'')+(q.upper_bound?(q.upper_bound.inclusive?'至多':'小于')+q.upper_bound.value:'')+' '+(q.unit??'');
 }else if(h.node_type==='EVENT')consequent=[actor,modal[h.metadata.modality],h.metadata.local_restriction?.kind==='ARGUMENT_ONLY'?'仅':h.metadata.local_restriction?.kind==='READ_ONLY'?'以只读方式':null,...(h.metadata.action_modifier_node_ids??[]).map(i=>nm(i)?.surface),h.surface,object,recipient?'给 '+recipient:null].filter(Boolean).join(' ');
 else if(r.relation_type==='AGENT')consequent=t.surface+' 是源状态“'+h.surface+'”中明示的主体';
 else consequent='源状态“'+h.surface+'”明确关联“'+t.surface+'”';
 const witnessIds=uniq([...r.evidence_span_ids,...conditions.flatMap(n=>n.source_span_ids)]),witnesses=witnessIds.map(sm).filter(Boolean),maximal=witnesses.filter(s=>!witnesses.some(o=>o.span_id!==s.span_id&&o.start<=s.start&&o.end>=s.end&&(o.start<s.start||o.end>s.end))).sort((a,b)=>a.start-b.start);
 const hypothesis=antecedent?'在源条件“'+antecedent+'”限定下，'+consequent:consequent;
 return {status:'SUPPORTED_HYPOTHESIS_STRUCTURE',relation_id:r.relation_id,premise:uniq(maximal.map(s=>s.text)).join('\n'),hypothesis,antecedent,consequent,polarity:h.metadata.modality==='FORBIDDEN'?'NEGATIVE':'POSITIVE',modality:h.metadata.modality??null,scope_refs:plan.scope_expr_id?[plan.scope_expr_id]:[],condition_expr_id:plan.condition_expr_id??null,condition_operator_contracts:h.metadata.condition_operator_contracts??[],template:'SOURCE_ACTION_ARGUMENT_CONDITIONAL_V2',source_span_ids:witnessIds};
}
