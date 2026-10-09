// Same-version evaluation records every reviewed position, including semantic failures.
// A source review is mandatory; a failed score is never converted into PASS.
export function evaluationLaunchDecision({order,executions,reviews,charged,limit=360,allocation=6}){
 const reviewed=new Set(reviews.map(r=>r.id));
 const last=executions.at(-1);
 if(last){
  if(last.exit_code!==0)return {allowed:false,reason:last.underlying_failure??'RUN_FAILED_REQUIRES_INVESTIGATION'};
  if(!reviews.some(r=>r.id===last.id&&r.attempt===last.attempt))return {allowed:false,reason:'SOURCE_REVIEW_REQUIRED_BEFORE_NEXT_RUN'};
 }
 const id=order.find(id=>!reviewed.has(id));
 if(!id)return {allowed:false,reason:'REGISTERED_SUITE_COMPLETE'};
 const remaining=order.filter(id=>!reviewed.has(id)).length,reserveAfterNext=(remaining-1)*2+2;
 if(limit-charged-allocation<reserveAfterNext)return {allowed:false,reason:'INSUFFICIENT_BUDGET_FOR_REQUIRED_REMAINING_WORK',remaining,reserveAfterNext};
 return {allowed:true,id,allocation,remaining,reserveAfterNext};
}
