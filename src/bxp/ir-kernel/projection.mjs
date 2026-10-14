import {evaluateCore} from './evaluate.mjs';
import {diagnostic} from './diagnostics.mjs';
// Presentation reads the exact Core used by evaluation; annotations never feed back.
export function projectCore(compiled,context={}){
 const {core,annotations,source_map}=compiled;
 const label=id=>annotations[id]?.label??id;
 const describe=(ref,seen=new Set())=>{
  if(seen.has(ref.id))return ref.id;
  const n=core.nodes[ref.id];if(!n||ref.kind!=='EXPRESSION')return label(ref.id);
  return n.arguments.length?`${n.operator}(${n.arguments.map(r=>describe(r,new Set([...seen,ref.id]))).join(', ')})`:`${n.operator}(${n.literal??''}${n.unit?' '+n.unit:''})`;
 };
 const slots=Object.fromEntries('IOAPRVCB'.split('').map(k=>[k,{status:'EXPLICIT_REQUIREMENTS',items:[],entries:[]}]));
 for(const id of core.requirements){const n=core.nodes[id],subject=n.subject&&core.nodes[n.subject.id],entry={id,kind:n.kind,modality:n.modality,scope_id:n.scope_id,subject:n.subject,subject_label:n.subject?describe(n.subject):null,roles:subject?.roles??[],operation:subject?.operation??null,applicability:n.applicability,body:n.body,expression:describe(n.body),source_refs:source_map[id].source_refs};for(const view of n.views){slots[view].items.push(entry);slots[view].entries.push(entry);}}
 const canonical={format:'boundx-kernel-7plus1/1',contract_version:core.input_contract,core_sha256:compiled.core_sha256,slots,gaps:compiled.semantic_gaps,business_decision:null,execution_authorization:null};
 // Preserve explicit BASIS declarations without manufacturing obligations.
 for(const n of Object.values(core.nodes)){if(n.category!=='EVENT'||n.use!=='CURRENT_TASK')continue;const roles=(n.roles??[]).filter(r=>r.role==='BASIS');if(!roles.length)continue;
  const refs=[...new Set((source_map[n.id].role_sources??[]).filter(r=>r.role==='BASIS').flatMap(r=>r.source_refs))];
  const entry={id:n.id,kind:'BASIS_DECLARATION',modality:'UNSTATED',scope_id:n.owner_id,subject:{kind:'EVENT',id:n.id},subject_label:label(n.id),roles,operation:n.operation,applicability:null,body:null,expression:'BASIS('+roles.map(r=>describe(r.value)).join(', ')+')',source_refs:refs.length?refs:source_map[n.id].source_refs};slots.V.items.push(entry);slots.V.entries.push(entry);
 }
 const values=[];
 for(const n of Object.values(core.nodes).filter(n=>n.category==='EXPRESSION')){
  try{values.push({id:n.id,operator:n.operator,value:evaluateCore(core,{kind:'EXPRESSION',id:n.id},context),source_refs:source_map[n.id].source_refs});}
  catch(e){values.push({id:n.id,operator:n.operator,diagnostic:diagnostic(e),source_refs:source_map[n.id].source_refs});}
 }
 const purposes={input_policies:[],used_external_inputs:context.plan?.external_inputs??null,required_generation:[],permitted_generation:[],required_delivery:[],permitted_delivery:[],no_delivery_obligation:[]};
 for(const id of core.requirements){const r=core.nodes[id],body=core.nodes[r.body.id],subject=r.subject&&core.nodes[r.subject.id];
  if(r.views.includes('I'))purposes.input_policies.push({requirement:id,modality:r.modality,scope_id:r.scope_id,applicability:r.applicability,expression:describe(r.body)});
  if(r.kind!=='EVENT_NORM'||!subject||subject.operation_extent!=='EXACT')continue;
  const key=subject.operation==='CREATE'?({REQUIRED:'required_generation',PERMITTED:'permitted_generation'}[r.modality]):subject.operation==='DELIVER'?({REQUIRED:'required_delivery',PERMITTED:'permitted_delivery',NOT_REQUIRED:'no_delivery_obligation'}[r.modality]):null;
  if(key)purposes[key].push({requirement:id,event:subject.id,objects:subject.roles.filter(x=>['RESULT','DELIVERABLE','OBJECT'].includes(x.role)).map(x=>x.value),applicability:r.applicability,body:r.body});
 }
 const chinese=['# 7+1 边界表达',`计算核心摘要：${compiled.core_sha256}`,...Object.entries(slots).map(([slot,s])=>`\n## ${slot}\n\n${s.items.length?s.items.map(x=>`- ${x.kind==='BASIS_DECLARATION'?'依据声明':x.modality}：${x.subject_label??''}${x.roles.length?' ['+x.roles.map(r=>r.role+'='+describe(r.value)).join('；')+']':''}；${x.expression}${x.applicability?'；适用前提：'+describe(x.applicability):''}（来源：${x.source_refs.join('、')}）`).join('\n'):'没有明示要求。'}`),'\n技术接受不是业务授权；本页表达结构化候选，不证明原文语义完整。'].join('\n');
 return {canonical,chinese,summary:{core_sha256:compiled.core_sha256,values,purposes,gaps:compiled.semantic_gaps}};
}
