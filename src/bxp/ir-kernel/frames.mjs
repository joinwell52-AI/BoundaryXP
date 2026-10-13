// Structural contract checks. No source text, labels, or benchmark identifiers.
export function frameDiagnostics(ir,{nodes,types,ref,dimensions}){
 const errors=[];
 const issue=(code,id,path)=>errors.push({layer:'TYPE',code,node_id:id,id,path,depends_on:[]});
 const type=r=>r?types.get(ref(r).id):null;
 const node=r=>r?nodes.get(ref(r).id):null;
 const same=(a,b)=>a?.kind===b?.kind&&ref(a).id===ref(b).id;
 const incompatible=(value,roles)=>value?.kind==='ENTITY'&&roles.length>0&&roles.every(r=>r.kind==='ENTITY'&&!same(value,r));
 for(const r of ir.requirements){
  if(['EVENT_NORM','STOP'].includes(r.kind)&&type(r.subject)!=='EVENT')issue('EVENT_NORM_SUBJECT_TYPE',r.id,'subject');
  if(r.kind==='TOTAL_DURATION'){
   const v=node(r.subject);
   if(r.subject?.kind!=='VARIABLE'||v?.type!=='REAL')issue('DURATION_VARIABLE_REQUIRED',r.id,'subject');
   else{
    if(v.scope_id!==r.scope_id)issue('DURATION_SCOPE_BINDING',r.id,'subject');
    if(dimensions.get(v.id)!=='TIME')issue('DURATION_TIME_UNIT_REQUIRED',r.id,'subject');
   }
   if(!r.views.includes('R'))issue('VIEW_REQUIREMENT_MISMATCH',r.id,'views');
  }
  if(r.modality==='FORBIDDEN'&&!r.views.includes('B'))issue('VIEW_REQUIREMENT_MISMATCH',r.id,'views');
  if(r.kind==='DATA_USE'){
   const u=r.data_use;
   if(!u||type(u.object)!=='OBJECT'||type(u.consumer)!=='EVENT'||u.producer&&type(u.producer)!=='EVENT')issue('DATA_USE_FRAME_TYPE',r.id,'data_use');
   if(u?.origin==='EXTERNAL'&&u.producer)issue('EXTERNAL_DATA_HAS_TASK_PRODUCER',r.id,'data_use.producer');
  }else if(r.data_use)issue('UNEXPECTED_DATA_USE',r.id,'data_use');
 }
 for(const e of ir.expressions){
  if(!['RECEIVED_ANY','RECEIVED_COMPLETE'].includes(e.operator)||e.arguments.length<3)continue;
  const delivery=node(e.arguments[2]);
  if(delivery?.roles){
   if(incompatible(e.arguments[0],delivery.roles.filter(r=>r.role==='RECIPIENT').map(r=>r.value)))issue('RECEIPT_RECEIVER_BINDING',e.id,'arguments.0');
   if(incompatible(e.arguments[1],delivery.roles.filter(r=>r.role==='DELIVERABLE').map(r=>r.value)))issue('RECEIPT_ARTIFACT_BINDING',e.id,'arguments.1');
  }
 }
 return errors;
}
export const repairableFrameCodes=new Set(['EVENT_NORM_SUBJECT_TYPE','DURATION_VARIABLE_REQUIRED','DURATION_SCOPE_BINDING','DURATION_TIME_UNIT_REQUIRED','VIEW_REQUIREMENT_MISMATCH','DATA_USE_FRAME_TYPE','EXTERNAL_DATA_HAS_TASK_PRODUCER','UNEXPECTED_DATA_USE','RECEIPT_RECEIVER_BINDING','RECEIPT_ARTIFACT_BINDING']);
