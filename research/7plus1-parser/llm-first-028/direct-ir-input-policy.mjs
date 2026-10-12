// Consume typed task/set IR and supplied external-use observations only.
export function taskMembership(ir,owner,task){
 const tasks=new Map(ir.events.filter(e=>e.kind==='TASK').map(e=>[e.id,e])),seen=new Set();
 while(owner){if(owner===task)return true;if(seen.has(owner))return null;seen.add(owner);const n=tasks.get(owner);if(!n)return null;if(n.owner_id===owner)return false;owner=n.owner_id;}return null;
}
export function evaluateDirectInputPolicies(ir,acceptance,records){
 const exprs=new Map(ir.expressions.map(e=>[e.id,e])),rows=new Map(acceptance.rows.map(r=>[r.id,r]));
 const finite=r=>{if(r.kind==='ENTITY')return [r.id];const x=exprs.get(r.id);if(!x)return null;if(x.operator==='SET')return x.arguments.every(a=>a.kind==='ENTITY')?[...new Set(x.arguments.map(a=>a.id))]:null;if(x.operator==='GROUP_MEMBERS'){const g=ir.entities.find(e=>e.id===x.arguments[0].id&&e.kind==='GROUP');return g?.members.map(a=>a.id)??null;}return null;};
 const results=[];
 for(const r of ir.requirements){const body=exprs.get(r.body.id),projection=exprs.get(body?.arguments?.[0]?.id);if(body?.operator!=='SUBSET'||projection?.operator!=='TASK_EXTERNAL_INPUTS')continue;
  const task=projection.arguments[0].id,allowed=finite(body.arguments[1]),uses=[],unknown=[];
  for(const record of records){const member=taskMembership(ir,record.owner_id,task);if(member===false)continue;if(member===null){unknown.push('UNKNOWN_TASK_MEMBERSHIP');continue;}
   if(!Array.isArray(record.external_inputs)){unknown.push('EXTERNAL_USE_NOT_OBSERVED');continue;}
   for(const ref of record.external_inputs){if(ref?.kind!=='ENTITY'||!ref.id)unknown.push('UNKNOWN_INPUT_IDENTITY');else uses.push(ref.id);}
  }
  const outside=allowed?[...new Set(uses)].filter(id=>!allowed.includes(id)):[];
  // Scope/conditional variants require their own explicit evaluation; never assume active.
  const result=rows.get(r.id)?.status!=='ACCEPTED'?'NOT_ACCEPTED':r.applicability||r.modality!=='REQUIRED'?'UNKNOWN':!allowed?'UNKNOWN':outside.length?'VIOLATED':unknown.length?'UNKNOWN':'SATISFIED';
  results.push({requirement_id:r.id,task_id:task,operator:'SUBSET',allowed,used:[...new Set(uses)],outside,unknown,result,source_refs:r.source_refs});
 }
 return {format:'boundx-direct-input-policy-result/1',results,business_decision:null,execution_authorization:null,not_applicable_is_not_permission:true};
}
