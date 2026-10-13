// Typed IR + a caller-supplied event record. Never read task text or infer roles.
import {taskScope} from './direct-ir-task-scope.mjs';
import {resolveEventTerm} from './direct-ir-event-identity.mjs';
export function evaluateDirectEventPolicies(ir,acceptance,eventRecord){
 const nodes=new Map(['entities','variables','events','states','expressions','requirements'].flatMap(k=>ir[k].map(x=>[x.id,x]))),accepted=new Map(acceptance.rows.map(x=>[x.id,x.status]));
 const expr=r=>r?.kind==='EXPRESSION'?nodes.get(r.id):null;
 const membership=taskScope(ir).member;
 const number=r=>{const x=expr(r);if(x?.operator==='NUMBER')return x.literal;if(x?.operator==='ADD'){const values=x.arguments.map(number);return values.every(v=>typeof v==='number')?values.reduce((a,b)=>a+b,0):null;}return null;};
 const value=(r,binder)=>{if(r.kind==='ENTITY')return {kind:'ENTITY',id:r.id};const x=expr(r);
  if(r.kind==='EVENT'||r.kind==='VARIABLE'&&r.id===binder||['EVENT_INSTANCE','PREVIOUS_INSTANCE'].includes(x?.operator)){
   try{const e=resolveEventTerm(r,{node:r=>{const n=nodes.get(r.id);if(!n)throw Error('IR_REFERENCE_MISSING');return n;},number,variable:r=>{
    if(r.id!==binder||!eventRecord.event_id)return null;
    if(eventRecord.template_id&&Number.isSafeInteger(eventRecord.instance)&&eventRecord.instance>=0){const template=nodes.get(eventRecord.template_id);return template?.kind==='TEMPLATE'?{event:template,index:eventRecord.instance,key:template.id+'@'+eventRecord.instance}:null;}
    const n=nodes.get(eventRecord.event_id);if(n?.kind==='TEMPLATE')return null;
    return {event:n??{id:eventRecord.event_id,kind:'ACTION'},key:eventRecord.event_id};
   }});return {kind:'EVENT',id:e.key};}catch{return null;}
  }
  if(!x)return null;if(['ENVIRONMENT_OF','OBJECT_OF','RECIPIENT_OF'].includes(x.operator)&&x.arguments[0]?.kind==='VARIABLE'&&x.arguments[0].id===binder){const role={ENVIRONMENT_OF:'ENVIRONMENT',OBJECT_OF:'OBJECT',RECIPIENT_OF:'RECIPIENT'}[x.operator];return eventRecord.roles?.[role]??null;}if(['BOOLEAN','NUMBER'].includes(x.operator))return x.literal;return null;};
 const equal=(a,b)=>a===null||b===null?null:typeof a==='object'||typeof b==='object'?a.kind&&b.kind?a.kind===b.kind&&a.id===b.id:null:a===b;
 const bool=(r,binder)=>{const x=expr(r);if(!x)return null;const a=x.arguments;if(x.operator==='BOOLEAN')return x.literal;if(x.operator==='EQ')return equal(value(a[0],binder),value(a[1],binder));if(x.operator==='NOT'){const v=bool(a[0],binder);return v===null?null:!v;}if(x.operator==='AND'||x.operator==='OR'){const v=a.map(y=>bool(y,binder));return x.operator==='AND'?v.includes(false)?false:v.includes(null)?null:true:v.includes(true)?true:v.includes(null)?null:false;}if(x.operator==='IMPLIES'){const l=bool(a[0],binder),r=bool(a[1],binder);return l===false||r===true?true:l===true&&r===false?false:null;}return null;};
 const results=[];for(const r of ir.requirements){const q=expr(r.body),d=expr(q?.arguments?.[0]);if(q?.operator!=='FORALL'||d?.operator!=='TASK_EVENTS')continue;
  const inScope=membership(eventRecord.owner_id,d.arguments[0].id),ready=accepted.get(r.id)==='ACCEPTED';
  const truth=ready&&inScope===true?bool(q.arguments[1],q.bound_variable.id):null;
  results.push({requirement_id:r.id,scope:inScope===true?'IN_SCOPE':inScope===false?'OUT_OF_SCOPE':'UNKNOWN',result:!ready?'NOT_ACCEPTED':inScope===false?'NOT_APPLICABLE':truth===true?'SATISFIED':truth===false?'VIOLATED':'UNKNOWN',source_refs:r.source_refs});
 }
 return {format:'boundx-direct-event-policy-result/1',results,execution_authorization:null,business_decision:null,not_applicable_is_not_permission:true};
}
