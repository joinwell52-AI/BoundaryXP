import {add,compare} from './values.mjs';

// Compare planned additional attempts for ONE declared business sequence.
// Fragment names never create a fresh budget. This is a plan comparison, not
// evidence that any attempt actually occurred, nor an execution authorization.
export function compareRetryAllocations(core,{template_id,scope_id,allocations,complete=false}){
 const sequence=core.sequences.find(s=>s.template.id===template_id&&s.task.id===scope_id);
 const base={kind:'RETRY_ALLOCATION',template_id,scope_id,business_decision:null,execution_authorization:null};
 if(!sequence)return {...base,result:'UNKNOWN',reason:'BOUNDARY_SEQUENCE_NOT_IDENTIFIED'};
 if(!Array.isArray(allocations)||allocations.some(x=>!x.fragment_id||!Number.isSafeInteger(x.max_extra)||x.max_extra<0)||new Set(allocations.map(x=>x.fragment_id)).size!==allocations.length)return {...base,result:'UNKNOWN',reason:'INVALID_OR_DUPLICATE_ALLOCATION'};
 const allocated=allocations.reduce((sum,x)=>add(sum,String(x.max_extra)),'0'),limit=String(sequence.max_instances-1);
 return {...base,boundary_template:sequence.template,allocations:structuredClone(allocations),allocated_extra:allocated,allowed_extra:limit,
  result:compare(allocated,limit)>0?'VIOLATED':complete?'SATISFIED':'UNKNOWN',
  reason:compare(allocated,limit)>0?'SHARED_RETRY_BUDGET_EXCEEDED':complete?'DECLARED_ALLOCATIONS_WITHIN_BUDGET':'ALLOCATION_COVERAGE_OPEN'};
}
