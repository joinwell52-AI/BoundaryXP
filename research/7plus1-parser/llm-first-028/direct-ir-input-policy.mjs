// Consume typed task/set IR and supplied external-use observations only.
import {typedInputDomains} from './direct-ir-sets.mjs';
export function taskMembership(ir,owner,task){
 const tasks=new Map(ir.events.filter(e=>e.kind==='TASK').map(e=>[e.id,e])),seen=new Set();
 while(owner){if(owner===task)return true;if(seen.has(owner))return null;seen.add(owner);const n=tasks.get(owner);if(!n)return null;if(n.owner_id===owner)return false;owner=n.owner_id;}return null;
}
export function evaluateDirectInputPolicies(ir,acceptance,records){
 const results=[];
 for(const policy of typedInputDomains(ir,acceptance).policies){
  const task=policy.task_id,allowed=policy.allowed,uses=[],unknown=[...policy.diagnostics];
  for(const record of records){const member=taskMembership(ir,record.owner_id,task);if(member===false)continue;if(member===null){unknown.push('UNKNOWN_TASK_MEMBERSHIP');continue;}
   if(!Array.isArray(record.external_inputs)){unknown.push('EXTERNAL_USE_NOT_OBSERVED');continue;}
   for(const ref of record.external_inputs){if(ref?.kind!=='ENTITY'||!ref.id)unknown.push('UNKNOWN_INPUT_IDENTITY');else uses.push(ref.id);}
  }
  const outside=allowed?[...new Set(uses)].filter(id=>!allowed.includes(id)):[];
  // Scope/conditional variants require their own explicit evaluation; never assume active.
  const result=!policy.verified?'NOT_ACCEPTED':!policy.unconditional||allowed===null?'UNKNOWN':outside.length?'VIOLATED':unknown.length?'UNKNOWN':'SATISFIED';
  results.push({...policy,used:[...new Set(uses)],outside,unknown,result});
 }
 return {format:'boundx-direct-input-policy-result/1',results,business_decision:null,execution_authorization:null,not_applicable_is_not_permission:true};
}
