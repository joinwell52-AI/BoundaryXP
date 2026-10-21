// Internal bridge to the existing Core, not a new calculator or BXP protocol.
// Deliberately does not consume historical LLM comparison proposals, verdicts,
// math_analysis answers, or accepted_check_ids.
import {compareFormalPlan} from './workbench-formal.mjs';
import {indexBoundary,validatePlan} from './workbench-model.mjs';
import {appendCompiledModels} from './workbench-compiled-models.mjs';
export const PROGRAM_COMPARISON_VERSION='workbench-program-interface/1';

export function compareProgramPlan({plan,boundaries}){
 validatePlan(plan);
 const inputs={},interfaceDiagnostics=[];
 for(const node of plan.nodes){
  const value=boundaries[node.id]??{};
  // Recheck source evidence rather than trusting persisted source_valid flags.
  const boundary=indexBoundary(value.boundary,node.text);
  if(!boundary.formal){
   interfaceDiagnostics.push({node_id:node.id,code:'CLAUSE_TO_CONSTRAINT_CONVERSION_MISSING',clause_ids:boundary.clauses.map(c=>c.id),reason_zh:'当前条款有正文和维度，但没有程序可读取的对象绑定、操作类型和组合关系；现有接口尚未完成转换。'});
  }
  inputs[node.id]={boundary,review:value.review};
 }
 const comparison=appendCompiledModels(compareFormalPlan({plan,boundaries:inputs}),{plan,boundaries:inputs});
 return {...comparison,comparison_interface:PROGRAM_COMPARISON_VERSION,new_model_requests:0,interface_diagnostics:interfaceDiagnostics};
}
