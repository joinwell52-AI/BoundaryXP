// Consume typed task/set IR and supplied external-use observations only.
import {evaluateKernel} from '../../../src/bxp/ir-kernel/service.mjs';
import {typedInputDomains} from './direct-ir-sets.mjs';
import {taskScope} from './direct-ir-task-scope.mjs';
export function taskMembership(ir,owner,task){
 return taskScope(ir).member(owner,task);
}
export function evaluateDirectInputPolicies(ir,acceptance,records){
 if(ir.contract_version==='candidate-ir/2.0')return evaluateKernel(ir,records);
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
