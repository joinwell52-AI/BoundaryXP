// Evaluation-only scheduling. It does not interpret source text or change the compiler.
export const faithfulStatuses=new Set(['SOURCE_FAITHFUL','CLARIFICATION_CORRECT']);
export function launchDecision({order,executions,reviews,charged,limit=360,allocation=6}){
 const approved=new Set(reviews.filter(r=>faithfulStatuses.has(r.status)).map(r=>r.id));
 const last=executions.at(-1);
 if(last){
  if(last.exit_code!==0)return {allowed:false,reason:last.underlying_failure??'RUN_FAILED_REQUIRES_INVESTIGATION'};
  const reviewed=reviews.find(r=>r.attempt===last.attempt&&r.id===last.id);
  if(!reviewed)return {allowed:false,reason:'SOURCE_REVIEW_REQUIRED_BEFORE_NEXT_RUN'};
  if(!faithfulStatuses.has(reviewed.status))return {allowed:false,reason:'SEMANTIC_DEFECT_PAUSE'};
 }
 const id=order.find(id=>!approved.has(id));
 if(!id)return {allowed:false,reason:'REGISTERED_SUITE_COMPLETE'};
 const remaining=order.filter(id=>!approved.has(id)).length;
 const reserveAfterNext=(remaining-1)*2+2; // Preserve the original deployment smoke.
 if(limit-charged-allocation<reserveAfterNext)return {allowed:false,reason:'INSUFFICIENT_BUDGET_FOR_REQUIRED_REMAINING_WORK',remaining,reserveAfterNext};
 return {allowed:true,id,allocation,remaining,reserveAfterNext};
}
