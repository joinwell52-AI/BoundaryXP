// Typed IR + a caller-supplied event record. Never read task text or infer roles.
export function evaluateDirectEventPolicies(ir,acceptance,eventRecord){
 const nodes=new Map(['entities','variables','events','states','expressions','requirements'].flatMap(k=>ir[k].map(x=>[x.id,x]))),accepted=new Map(acceptance.rows.map(x=>[x.id,x.status]));
 const expr=r=>r?.kind==='EXPRESSION'?nodes.get(r.id):null;
 const membership=(owner,task)=>{const seen=new Set();while(owner){if(owner===task)return true;if(seen.has(owner))return null;seen.add(owner);const n=nodes.get(owner);if(n?.kind!=='TASK')return null;if(n.owner_id===owner)return false;owner=n.owner_id;}return null;};
 const value=(r,binder)=>{if(r.kind==='ENTITY')return {kind:'ENTITY',id:r.id};const x=expr(r);if(!x)return null;if(['ENVIRONMENT_OF','OBJECT_OF','RECIPIENT_OF'].includes(x.operator)&&x.arguments[0]?.kind==='VARIABLE'&&x.arguments[0].id===binder){const role={ENVIRONMENT_OF:'ENVIRONMENT',OBJECT_OF:'OBJECT',RECIPIENT_OF:'RECIPIENT'}[x.operator];return eventRecord.roles?.[role]??null;}if(['BOOLEAN','NUMBER'].includes(x.operator))return x.literal;return null;};
 const equal=(a,b)=>a===null||b===null?null:typeof a==='object'||typeof b==='object'?a.kind&&b.kind?a.kind===b.kind&&a.id===b.id:null:a===b;
 const bool=(r,binder)=>{const x=expr(r);if(!x)return null;const a=x.arguments;if(x.operator==='BOOLEAN')return x.literal;if(x.operator==='EQ')return equal(value(a[0],binder),value(a[1],binder));if(x.operator==='NOT'){const v=bool(a[0],binder);return v===null?null:!v;}if(x.operator==='AND'||x.operator==='OR'){const v=a.map(y=>bool(y,binder));return x.operator==='AND'?v.includes(false)?false:v.includes(null)?null:true:v.includes(true)?true:v.includes(null)?null:false;}if(x.operator==='IMPLIES'){const l=bool(a[0],binder),r=bool(a[1],binder);return l===false||r===true?true:l===true&&r===false?false:null;}return null;};
 const results=[];for(const r of ir.requirements){const q=expr(r.body),d=expr(q?.arguments?.[0]);if(q?.operator!=='FORALL'||d?.operator!=='TASK_EVENTS')continue;
  const inScope=membership(eventRecord.owner_id,d.arguments[0].id),ready=accepted.get(r.id)==='ACCEPTED';
  const truth=ready&&inScope===true?bool(q.arguments[1],q.bound_variable.id):null;
  results.push({requirement_id:r.id,scope:inScope===true?'IN_SCOPE':inScope===false?'OUT_OF_SCOPE':'UNKNOWN',result:!ready?'NOT_ACCEPTED':inScope===false?'NOT_APPLICABLE':truth===true?'SATISFIED':truth===false?'VIOLATED':'UNKNOWN',source_refs:r.source_refs});
 }
 return {format:'boundx-direct-event-policy-result/1',results,execution_authorization:null,business_decision:null,not_applicable_is_not_permission:true};
}
