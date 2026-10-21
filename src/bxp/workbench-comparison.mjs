// Comparison of submitted interpretations; no NLP, file access or model calls.
import {AXES,ancestors,validatePlan} from './workbench-model.mjs';
import {canonicalBooleanBoundary} from './boolean-solver.mjs';
import {solveAllowedSets} from './allowed-set-solver.mjs';
import {intersectValidatedIntervals} from './interval-solver.mjs';
import {solveValidatedPrerequisites} from './dependency-solver.mjs';
import {add,compare,exact,stable} from './ir-kernel/values.mjs';
export const COMPARISON_VERSION='boundx-plan-comparison/7';
const nil={business_decision:null,execution_authorization:null};
const unknown=reason=>({status:'UNRESOLVED',reason,basis:'PROGRAM_INPUT_CHECK'});
export function calculateComparison(op){
 try{
  if(!op||typeof op.kind!=='string')return unknown('CALCULATION_NOT_SPECIFIED');
  switch(op.kind){
   case 'boolean_implication':{
    const p=canonicalBooleanBoundary(op.variables,[op.parent]),c=canonicalBooleanBoundary(op.variables,[op.child]);
    if(c.solution_count===0)return {status:'VIOLATED',basis:'PROGRAM',reason:'CHILD_CONDITION_INCONSISTENT',counterexamples:[]};
    const counterexamples=[];for(let i=0;i<c.membership.length;i++)if(c.membership[i]==='1'&&p.membership[i]==='0')counterexamples.push(Object.fromEntries(c.variables.map((n,b)=>[n,!!(i&(1<<(c.variables.length-b-1)))])));
    return {status:counterexamples.length?'VIOLATED':'VERIFIED',basis:'PROGRAM',counterexamples,method:'CHILD_IMPLIES_PARENT',variables:c.variables};}
   case 'set_subset':{
    if(!Array.isArray(op.parent)||!Array.isArray(op.child)||[...op.parent,...op.child].some(x=>typeof x!=='string'))return unknown('SET_IDENTITIES_REQUIRED');
    const base={scope_id:'submitted',universe:'mapped-identities',effect:'use',actor_scope:'mapped',guard_context:'mapped',identity_status:'resolved',evidence:[]};
    const [r]=solveAllowedSets([{...base,id:'parent',operator:'allowed_set',allowed:op.parent},{...base,id:'child',operator:'target_set',requested:op.child}]);
    return {status:r.outside.length?'VIOLATED':'VERIFIED',basis:'PROGRAM',method:'CLOSED_SET_SUBSET',allowed:r.allowed,requested:r.requested,outside:r.outside};}
   case 'interval_subset':{
    if(!op.parent||!op.child||!op.dimension||!op.unit||!['parent','child'].every(k=>Object.hasOwn(op[k],'lower')&&Object.hasOwn(op[k],'upper')))return unknown('INTERVAL_BOUNDS_REQUIRED');
    const item=v=>({...v,id:'range',scope_id:'submitted',subject:'same',dimension:op.dimension,unit:op.unit});
    const [p]=intersectValidatedIntervals([item(op.parent)]),[c]=intersectValidatedIntervals([item(op.child)]);
    if(c.empty)return {status:'VIOLATED',basis:'PROGRAM',reason:'CHILD_INTERVAL_EMPTY'};
    const lower=!p.lower||(c.lower&&(compare(c.lower.value,p.lower.value)>0||(compare(c.lower.value,p.lower.value)===0&&(p.lower.inclusive||!c.lower.inclusive))));
    const upper=!p.upper||(c.upper&&(compare(c.upper.value,p.upper.value)<0||(compare(c.upper.value,p.upper.value)===0&&(p.upper.inclusive||!c.upper.inclusive))));
    return {status:!p.empty&&lower&&upper?'VERIFIED':'VIOLATED',basis:'PROGRAM',method:'INTERVAL_SUBSET',parent:p,child:c};}
   case 'budget':{
    if(!op.resource||!op.unit||!op.window||!op.scope||!Array.isArray(op.allocations))return unknown('BUDGET_IDENTITY_UNIT_WINDOW_SCOPE_REQUIRED');
    if(!['ADDITIVE','EXCLUSIVE'].includes(op.combination))return unknown('BUDGET_COMBINATION_NOT_ESTABLISHED');
    if(op.combination==='EXCLUSIVE'&&!op.exclusion_ref)return unknown('EXCLUSION_EVIDENCE_REQUIRED');
    const ids=new Set();let total='0';
    for(const a of op.allocations){
     if(!a.instance||ids.has(a.instance))return unknown('DUPLICATE_ALLOCATION_INSTANCE');ids.add(a.instance);
     if(a.resource!==op.resource||a.unit!==op.unit||a.window!==op.window||a.scope!==op.scope)return unknown('BUDGET_SCOPE_MISMATCH');
     if(compare(a.amount,'0')<0)return unknown('NEGATIVE_ALLOCATION');
     total=op.combination==='ADDITIVE'?add(total,a.amount):compare(total,a.amount)<0?exact(a.amount):total;
    }
    if(compare(op.limit,'0')<0)return unknown('NEGATIVE_BUDGET');
    return {status:compare(total,op.limit)>0?'VIOLATED':'VERIFIED',basis:'PROGRAM',method:op.combination,total,limit:exact(op.limit),unit:op.unit};}
   case 'duration':{
    if(!op.unit||!['SERIAL','PARALLEL'].includes(op.schedule)||!Array.isArray(op.durations)||!op.durations.length||!Array.isArray(op.order_evidence)||!op.order_evidence.length)return unknown('DURATION_ORDER_NOT_ESTABLISHED');
    let total='0';for(const t of op.durations){if(compare(t,'0')<0)return unknown('NEGATIVE_DURATION');total=op.schedule==='SERIAL'?add(total,t):compare(total,t)<0?exact(t):total;}
    return {status:compare(total,op.limit)>0?'VIOLATED':'VERIFIED',basis:'PROGRAM',method:op.schedule,total,limit:exact(op.limit),unit:op.unit};}
   case 'dependency':{
    if(!Array.isArray(op.edges)||!Array.isArray(op.required)||!op.edges.every(e=>e&&typeof e.id==='string'&&e.kind==='prerequisite'&&typeof e.from==='string'&&typeof e.to==='string')||!op.required.every(e=>e&&typeof e.from==='string'&&typeof e.to==='string'))return unknown('DEPENDENCIES_REQUIRED');
    const r=solveValidatedPrerequisites(op.edges,op.required);
    return {status:r.cycles.length?'VIOLATED':r.reachability?.some(e=>!e.reachable)?'VIOLATED':'VERIFIED',basis:'PROGRAM',method:'DEPENDENCY_GRAPH',...r};}
   case 'equal':return !Object.hasOwn(op,'parent')||!Object.hasOwn(op,'child')?unknown('EQUALITY_OPERANDS_REQUIRED'):{status:stable(op.parent)===stable(op.child)?'VERIFIED':'VIOLATED',basis:'PROGRAM',method:'EXACT_MAPPED_VALUE_EQUALITY',parent:op.parent,child:op.child};
   default:return unknown('CALCULATOR_NOT_IMPLEMENTED:'+op.kind);
  }
 }catch(e){return unknown('CALCULATION_INPUT_INVALID:'+e.message);}
}
const refKey=r=>r.node_id+':'+r.clause_id;
const invalidAnalysisReferences=(check,all,boundaries)=>{
 const refs=[...(Array.isArray(check.analysis_refs)?check.analysis_refs:[]),...(Array.isArray(check.operation?.analysis_refs)?check.operation.analysis_refs:[])];
 return (check.analysis_refs!==undefined&&!Array.isArray(check.analysis_refs))||(check.operation?.analysis_refs!==undefined&&!Array.isArray(check.operation.analysis_refs))||refs.some(r=>!r||!all.some(c=>c.node_id===r.node_id)||!boundaries[r.node_id]?.proposal?.math_analysis?.some(m=>m.id===r.analysis_id));
};
// analysis_ids 指向分析项；clause_ids 是其来源条款，不自动成为有误条款。
// 未能绑定分析目标的问题仍保守处理，不能按中文关键词猜测问题范围。
function reviewIssuesForCheck(check, boundaries, all) {
 const blocking=[],local=[];
 const analysisRefs=[...(Array.isArray(check.analysis_refs)?check.analysis_refs:[]),...(Array.isArray(check.operation?.analysis_refs)?check.operation.analysis_refs:[])];
 for(const id of new Set(all.map(r=>r.node_id))){
  const node=boundaries[id],math=node?.proposal?.math_analysis??[];
  for(const [issue_index,issue] of (node?.review?.issues??[]).entries()){
   const related=!Array.isArray(issue.clause_ids)||!issue.clause_ids.length||all.some(r=>r.node_id===id&&issue.clause_ids.includes(r.clause_id));
   const targets=issue.analysis_ids;
   const analysisOnly=Array.isArray(targets)&&targets.length>0&&targets.every(a=>typeof a==='string'&&math.some(m=>m.id===a))&&!['CLAUSE','BOTH'].includes(issue.issue_scope);
   const used=analysisOnly&&analysisRefs.some(r=>r?.node_id===id&&targets.includes(r.analysis_id));
   const item={node_id:id,issue_index,clause_ids:issue.clause_ids??[],analysis_ids:targets??[],reason:issue.reason,suggestion:issue.suggestion};
   if(used||related&&!analysisOnly)blocking.push({...item,scope:used?'ANALYSIS_DEPENDENCY':'CLAUSE_OR_UNSPECIFIED'});
   else if(related&&analysisOnly)local.push({...item,scope:'LOCAL_ANALYSIS',comparison_effect:'NOT_USED_BY_THIS_REVIEWED_CLAUSE_COMPARISON'});
  }
 }
 return {blocking,local};
}
// An old extraction dispute can be resolved only by an independently accepted,
// exact-source recheck. Never silently disregard a node review or a math dependency.
function sourceRechecks(check,issue,proposal,review,boundaries,nodes){
 if(issue.scope!=='CLAUSE_OR_UNSPECIFIED'||!issue.clause_ids.length||issue.analysis_ids.length)return [];
 const used=[...check.parent_refs,...check.child_refs].filter(r=>r.node_id===issue.node_id&&issue.clause_ids.includes(r.clause_id));
 if(!used.length)return [];
 const entries=(Array.isArray(proposal.source_rechecks)?proposal.source_rechecks:[]).filter(r=>
  r&&Array.isArray(check.source_recheck_ids)&&check.source_recheck_ids.includes(r.id)&&
  Array.isArray(review.accepted_source_recheck_ids)&&review.accepted_source_recheck_ids.includes(r.id)&&
  proposal.source_rechecks.filter(x=>x?.id===r.id).length===1&&r.node_id===issue.node_id&&r.issue_index===issue.issue_index&&
  typeof r.reason==='string'&&r.reason.trim()&&typeof r.quote==='string'&&r.quote&&
  nodes.get(r.node_id)?.text.includes(r.quote)&&
  boundaries[r.node_id]?.boundary?.clauses?.some(c=>c.id===r.clause_id&&c.source_valid&&c.evidence?.some(e=>e.quote===r.quote)));
 return used.every(ref=>entries.some(r=>r.clause_id===ref.clause_id))?entries:[];
}
export function comparePlan({plan,boundaries,proposal,review}){
 validatePlan(plan);
 const findings=[],diagnostics=[],clauses=new Map(),nodes=new Map(plan.nodes.map(n=>[n.id,n]));
 for(const [id,b]of Object.entries(boundaries))for(const c of b?.boundary?.clauses??[])clauses.set(id+':'+c.id,c);
 const valid=r=>!!r&&clauses.get(refKey(r))?.source_valid===true;
 const refs=rs=>Array.isArray(rs)&&rs.length>0&&rs.every(valid);
 const sourceResponsibility=proposal?.contract_version===2&&review?.contract_version===2;
 const missingRows=Array.isArray(proposal?.missing)?proposal.missing:[];
 const acceptedMissing=missingRows.filter(m=>m&&valid(m.parent_ref)&&review?.accepted_missing_ids?.includes(m.id));
 const affected=(row,related)=>Array.isArray(row?.affected_axes)&&row.affected_axes.length>0&&row.affected_axes.every(a=>AXES.includes(a)&&related.includes(a))?[...new Set(row.affected_axes)]:null;
 const parentWorkValid=(row)=>Array.isArray(row.retained_work)&&row.retained_work.length>0&&row.retained_work.every(w=>typeof w?.action==='string'&&w.action.trim()&&typeof w.quote==='string'&&w.quote.trim()&&(w.task_wide===true||typeof w.actor==='string'&&w.actor.trim()&&w.quote.includes(w.actor))&&nodes.get(row.parent_ref?.node_id)?.text.includes(w.quote)&&clauses.get(refKey(row.parent_ref))?.evidence?.some(e=>e.quote.includes(w.quote)));
 const approved=new Set(Array.isArray(review?.accepted_check_ids)?review.accepted_check_ids:[]),checked=new Set(),coverage=new Set(),partialCoverage=new Set(),seen=new Set(),diagnosticChecks=new Set();
 const push=f=>findings.push({id:'F'+(findings.length+1),...f,...nil});
 if(plan.mode==='SINGLE'||!plan.nodes.some(n=>n.parent_id))return {format:COMPARISON_VERSION,status:'NO_PARENT_COMPARISON',findings:[],axes:Object.fromEntries(AXES.map(a=>[a,'NOT_APPLICABLE'])),...nil};
 if(!Array.isArray(proposal?.checks)||!Array.isArray(review?.accepted_check_ids)||!Array.isArray(review?.issues))return {format:COMPARISON_VERSION,status:'UNRESOLVED',findings:[{id:'F1',status:'UNRESOLVED',reason:'COMPARISON_INTERFACE_INCOMPLETE',axes:AXES,basis:'PROGRAM_INPUT_CHECK'}],axes:Object.fromEntries(AXES.map(a=>[a,'UNRESOLVED'])),...nil};
 for(const note of Array.isArray(proposal.diagnostics)?proposal.diagnostics:[])diagnostics.push({detail:note,basis:'MODEL_DIAGNOSTIC',comparison_effect:'NOT_A_PARENT_BOUNDARY_VERDICT'});
 for(const check of proposal.checks){
  if(!check||!Array.isArray(check.parent_refs)||!Array.isArray(check.child_refs)){push({status:'UNRESOLVED',reason:'CHECK_REFERENCE_INTERFACE_INVALID',axes:AXES,basis:'PROGRAM_INPUT_CHECK'});continue;}
  if(!check.id||seen.has(check.id)){push({status:'UNRESOLVED',reason:'DUPLICATE_CHECK_ID',axes:AXES,basis:'PROGRAM_INPUT_CHECK'});continue;}seen.add(check.id);
  if(check.scope==='INCONSISTENCY'){
   diagnosticChecks.add(check.id);
   diagnostics.push({...check,category:'INTERNAL_ANALYSIS_ONLY',basis:'MODEL_DIAGNOSTIC',comparison_effect:'NOT_A_PARENT_BOUNDARY_VERDICT'});
   continue;
  }
  if(!check.parent_refs.every(r=>r&&typeof r.node_id==='string'&&typeof r.clause_id==='string')||!check.child_refs.every(r=>r&&typeof r.node_id==='string'&&typeof r.clause_id==='string')||(check.target_node_ids!==undefined&&!Array.isArray(check.target_node_ids))){push({status:'UNRESOLVED',reason:'CHECK_REFERENCE_INTERFACE_INVALID',axes:AXES,basis:'PROGRAM_INPUT_CHECK'});continue;}
  const parentRefs=check.parent_refs??[],childRefs=check.child_refs??[],all=[...parentRefs,...childRefs],targets=[...new Set([...childRefs.map(r=>r.node_id),...(check.target_node_ids??[])])];
  const relatedAxes=[...new Set(all.flatMap(r=>clauses.get(refKey(r))?.axes??[]))],impact=affected(check,relatedAxes);
  const parentAxes=[...new Set(parentRefs.flatMap(r=>clauses.get(refKey(r))?.axes??[]))];
  const base={check_id:check.id,parent_refs:parentRefs,child_refs:childRefs,target_node_ids:targets,axes:impact??parentAxes,scope:check.scope,reason:check.reason,model_reason:check.reason,operands:check.operation??null,semantic_basis:approved.has(check.id)?'LLM_MAPPING_INDEPENDENTLY_REVIEWED':'LLM_MAPPING_NOT_CONFIRMED'};
  const nodeIssues=reviewIssuesForCheck(check,boundaries,all);
  const sourceRechecked=[];
  nodeIssues.blocking=nodeIssues.blocking.filter(issue=>{
   const resolutions=sourceRechecks(check,issue,proposal,review,boundaries,nodes);
   if(!resolutions.length)return true;
   sourceRechecked.push({issue,resolutions});return false;
  });
  if(sourceRechecked.length)base.source_rechecks=sourceRechecked;
  const invalidAnalysisRefs=invalidAnalysisReferences(check,all,boundaries);
  if(nodeIssues.local.length)base.local_analysis_issues=nodeIssues.local;
  // A disagreement about meaning must not erase a reproducible mathematical result.
  // It remains conditional on the supplied operands, distinct from the boundary verdict.
  if(check.operation)base.operand_calculation={...calculateComparison(check.operation),scope:'SUPPLIED_OPERANDS_ONLY',semantic_mapping_confirmed:approved.has(check.id)};
  let result;
  if(!refs(parentRefs)||!all.every(valid))result=unknown('SOURCE_OR_CLAUSE_BINDING_INVALID');
  else if(invalidAnalysisRefs)result={...unknown('ANALYSIS_DEPENDENCY_NOT_BOUND'),reason_zh:'本项比较引用的分析来源未能绑定到当前任务的已保存分析，尚不能判定。'};
  else if(!approved.has(check.id))result=unknown('MAPPING_NOT_CONFIRMED_BY_REVIEW');
  else if(targets.some(id=>!nodes.has(id)||!parentRefs.some(p=>ancestors(plan,id).some(a=>a.id===p.node_id)))&&check.scope!=='INCONSISTENCY')result=unknown('NOT_AN_ANCESTOR_RELATION');
  else if(nodeIssues.blocking.length)result={...unknown('NODE_REVIEW_HAS_RELEVANT_ISSUE'),blocking_review_issues:nodeIssues.blocking,reason_zh:'本项比较依赖的条款或分析仍有审阅问题：'+nodeIssues.blocking.map(i=>i.reason??'问题范围尚未明确').join('；')};
  else if(check.operation){
   // Aggregation cannot add a middle promise to its own descendants.
   const allocationNodes=(Array.isArray(check.operation.allocations)?check.operation.allocations:[]).map(a=>a?.node_id);
   if(allocationNodes.some(id=>allocationNodes.some(other=>other!==id&&ancestors(plan,other).some(a=>a.id===id))))result=unknown('ANCESTOR_AND_DESCENDANT_DOUBLE_COUNT');
   else if(check.operation.kind==='budget'&&(!Array.isArray(check.operation.allocations)||check.operation.allocations.some(a=>!a||!childRefs.some(r=>r.node_id===a.node_id))))result=unknown('ALLOCATION_SOURCE_NOT_BOUND');
   else if(check.operation.kind==='budget'&&check.operation.combination==='EXCLUSIVE'&&!all.some(r=>refKey(r)===check.operation.exclusion_ref))result=unknown('EXCLUSION_SOURCE_NOT_BOUND');
   else if(check.operation.kind==='duration'&&(!check.operation.order_evidence?.length||check.operation.order_evidence.some(key=>!all.some(r=>refKey(r)===key))))result=unknown('DURATION_ORDER_SOURCE_NOT_BOUND');
   else result=calculateComparison(check.operation);
  }else if(['COMPATIBLE','VIOLATED','NOT_APPLICABLE','INHERITED','UNRESOLVED'].includes(check.verdict))result={status:check.verdict,basis:'LLM_REVIEWED',reason:check.reason};
  else result=unknown('COMPARISON_OUTCOME_MISSING');
  // Old omission checks relied on an empty manual register, not an assessment of
  // responsibilities explicitly retained in the parent source. Never turn them green.
  if(!sourceResponsibility&&check.scope==='COMBINATION'&&!check.operation&&result.status==='VIOLATED'&&parentRefs.length===1&&acceptedMissing.some(m=>refKey(m.parent_ref)===refKey(parentRefs[0])))result=unknown('PARENT_RESPONSIBILITY_REVIEW_REQUIRED');
  if(result.status==='VIOLATED'&&!impact)result={...result,axis_status:'UNRESOLVED',axis_reason:'AFFECTED_AXES_NOT_REVIEWED'};
  push({...base,...result});
  // A source-bound comparison can be unresolved; it is still a comparison.
  // Keep its finding, without inventing a second missing-comparison issue.
  if(refs(parentRefs)&&all.every(valid)&&targets.every(id=>nodes.has(id)&&parentRefs.some(p=>ancestors(plan,id).some(a=>a.id===p.node_id)))){
   for(const cr of childRefs)checked.add(refKey(cr));
   for(const pr of parentRefs)for(const id of targets)checked.add(pr.node_id+'>'+id+':'+pr.clause_id);
  }
 }
 // Reviewed cancellations can be expressed as missing rows. Their explicit,
 // valid child sources are also comparisons, not a second missing-comparison gap.
 const missingBindings=new Map();
 for(const missing of acceptedMissing){
  if(missing.child_refs===undefined||Array.isArray(missing.child_refs)&&!missing.child_refs.length)continue; // Preserve legacy unbound rows.
  const child=missing.child_refs,parent=[missing.parent_ref];
  const bound=refs(child)&&child.every(r=>ancestors(plan,r.node_id).some(a=>a.id===missing.parent_ref.node_id));
  if(!bound){missingBindings.set(missing,{invalid:true});continue;}
  const all=[...parent,...child],issues=reviewIssuesForCheck(missing,boundaries,all);
  missingBindings.set(missing,{child,issues,invalidAnalysis:invalidAnalysisReferences(missing,all,boundaries)});
  for(const r of child){checked.add(refKey(r));checked.add(missing.parent_ref.node_id+'>'+r.node_id+':'+missing.parent_ref.clause_id);}
 }
 // Missing comparison work is explicit and localized; a successful partial check is not whole-plan PASS.
 for(const n of plan.nodes.filter(n=>n.parent_id)){
  for(const c of boundaries[n.id]?.boundary?.clauses??[])if(!checked.has(n.id+':'+c.id))push({status:'UNRESOLVED',reason:'CHILD_CLAUSE_NOT_COMPARED',axes:c.axes,parent_refs:[],child_refs:[{node_id:n.id,clause_id:c.id}],basis:'PROGRAM_COVERAGE'});
  for(const a of ancestors(plan,n.id))for(const c of boundaries[a.id]?.boundary?.clauses??[])if(!checked.has(a.id+'>'+n.id+':'+c.id))push({status:'UNRESOLVED',reason:'ANCESTOR_APPLICABILITY_NOT_CHECKED',axes:c.axes,parent_refs:[{node_id:a.id,clause_id:c.id}],child_refs:[],target_node_id:n.id,basis:'PROGRAM_COVERAGE'});
 }
 for(const row of Array.isArray(proposal?.coverage)?proposal.coverage:[]){
  if(!row||!Array.isArray(row.child_refs))continue;
  const p=row.parent_ref,child=row.child_refs??[],key=p?refKey(p):'';
  const explicitlyRetained=plan.retained.some(r=>r.node_id===p?.node_id&&r.clause_id===p?.clause_id&&r.basis);
  const validChildren=child.every(r=>valid(r)&&nodes.get(r.node_id)?.parent_id===p?.node_id);
  const verified=refs([p])&&validChildren&&Array.isArray(review?.accepted_coverage_ids)&&review.accepted_coverage_ids.includes(row.id);
  if(!verified)continue;
  if(row.coverage_scope==='PARTIAL'){
   partialCoverage.add(key);
   diagnostics.push({reason:'PARTIAL_COVERAGE_RECORDED',reason_zh:'这里只登记该父条款的一部分责任，不代表整条覆盖；明确取消的其余义务另按原文比较。',parent_refs:[p],child_refs:child,basis:'LLM_REVIEWED',comparison_effect:'RECORDING_ONLY'});
   continue;
  }
  const retainedValid=row.retained===true&&(explicitlyRetained||(sourceResponsibility&&parentWorkValid(row)));
  if(row.retained===true&&!retainedValid){diagnostics.push({reason:'PARENT_WORK_SOURCE_REQUIRED',reason_zh:'保留工作登记的来源不完整；这不是子任务突破父边界的证据。',parent_refs:[p],child_refs:child,basis:'PROGRAM_INPUT_CHECK',comparison_effect:'RECORDING_ONLY'});continue;}
  if(child.length||retainedValid||row.not_obligation===true)coverage.add(key);
 }
 for(const p of plan.nodes.filter(n=>plan.nodes.some(c=>c.parent_id===n.id)))for(const c of boundaries[p.id]?.boundary?.clauses??[]){
  // Missing bookkeeping is not evidence that children removed a parent duty.
  // Actual omitted obligations remain findings through reviewed missing rows.
  if(!coverage.has(p.id+':'+c.id)&&!partialCoverage.has(p.id+':'+c.id))diagnostics.push({reason:'COVERAGE_MAPPING_NOT_RECORDED',reason_zh:'该父条款没有单独登记责任覆盖；其适用边界仍由父子比较检查，不据此判为越界或未决。',parent_refs:[{node_id:p.id,clause_id:c.id}],basis:'PROGRAM_COVERAGE'});
 }
 // Review-confirmed omissions are actual COMPLETE-plan defects, not generic unproved coverage.
 for(const missing of acceptedMissing){
  const parentAxes=clauses.get(refKey(missing.parent_ref)).axes,impact=affected(missing,parentAxes);
  const currentBasis=sourceResponsibility&&typeof missing.parent_work_reason==='string'&&missing.parent_work_reason.trim();
  const conflict=coverage.has(refKey(missing.parent_ref));
  const binding=missingBindings.get(missing),blocking=binding?.issues?.blocking??[];
  const sourceProblem=binding?.invalid?'SOURCE_OR_CLAUSE_BINDING_INVALID':binding?.invalidAnalysis?'ANALYSIS_DEPENDENCY_NOT_BOUND':blocking.length?'NODE_REVIEW_HAS_RELEVANT_ISSUE':null;
  const unresolved=!currentBasis||conflict||sourceProblem;
  push({status:unresolved?'UNRESOLVED':plan.planning==='COMPLETE'?'VIOLATED':'PENDING_COVERAGE',reason:sourceProblem??(!currentBasis?'PARENT_RESPONSIBILITY_REVIEW_REQUIRED':conflict?'CONTRADICTORY_COVERAGE_ASSESSMENT':'REQUIRED_RESPONSIBILITY_MISSING'),...(!unresolved?{reason_zh:missing.reason??'子任务取消或削弱了父任务明确要求的必要义务。'}:blocking.length?{reason_zh:'本项取消义务的比较仍依赖有审阅问题的条款：'+blocking.map(i=>i.reason??'问题范围尚未明确').join('；'),blocking_review_issues:blocking}:{}),axes:impact??parentAxes,...(!impact?{axis_status:'UNRESOLVED',axis_reason:'AFFECTED_AXES_NOT_REVIEWED'}:{}),parent_refs:[missing.parent_ref],child_refs:binding?.child??[],basis:unresolved?'PROGRAM_INPUT_CHECK':'LLM_REVIEWED',missing_id:missing.id,detail:missing.reason,parent_work_reason:missing.parent_work_reason,...(binding?.issues?.local.length?{local_analysis_issues:binding.issues.local}:{})});
 }
 for(const note of Array.isArray(review?.diagnostics)?review.diagnostics:[]){
  const row=(Array.isArray(proposal?.coverage)?proposal.coverage:[]).find(r=>r.id===note?.coverage_id);
  if(note?.category==='COVERAGE_RECORDING_ONLY'&&row&&valid(row.parent_ref)&&typeof note.reason==='string'&&note.reason.trim())diagnostics.push({...note,parent_refs:[row.parent_ref],basis:'INDEPENDENT_REVIEW_DIAGNOSTIC'});
 }
 for(const issue of review?.issues??[]){
  if(diagnosticChecks.has(issue?.check_id)){diagnostics.push({...issue,basis:'INDEPENDENT_REVIEW',category:'INTERNAL_ANALYSIS_ONLY'});continue;}
  const rejectedMissing=issue?.category==='REJECTED_MISSING'&&typeof issue.missing_id==='string'&&missingRows.some(m=>m.id===issue.missing_id)&&!review.accepted_missing_ids?.includes(issue.missing_id);
  if(rejectedMissing){diagnostics.push({...issue,basis:'INDEPENDENT_REVIEW'});continue;}
  const related=typeof issue?.check_id==='string'?findings.find(f=>f.check_id===issue.check_id):null;
  if(related&&related.status==='UNRESOLVED'){related.review_reason=issue.reason;continue;}
  push({status:'UNRESOLVED',reason:issue?.reason??String(issue),axes:related?.axes??[],parent_refs:related?.parent_refs??[],child_refs:related?.child_refs??[],check_id:issue?.check_id,basis:'INDEPENDENT_REVIEW'});
 }
 // Merge only explicitly proposed AND independently reviewed duplicates. Different
 // operands, distinct parent limits, and new combination violations stay separate.
 const refSet=rs=>[...new Set(rs.map(refKey))].sort().join('|');
 for(const check of proposal.checks){
  if(!check?.duplicate_of||!review.accepted_duplicate_ids?.includes(check.id))continue;
  const duplicate=findings.find(f=>f.check_id===check.id),original=findings.find(f=>f.check_id===check.duplicate_of);
  if(!duplicate||!original||duplicate===original||duplicate.operands||original.operands||!approved.has(check.id)||!approved.has(check.duplicate_of)||
   !['VIOLATED','UNRESOLVED'].includes(original.status)||original.status!==duplicate.status||
   refSet(original.parent_refs)!==refSet(duplicate.parent_refs)||stable([...original.axes].sort())!==stable([...duplicate.axes].sort())||
   !original.child_refs.every(r=>duplicate.child_refs.some(d=>refKey(d)===refKey(r))))continue;
  original.related_checks??=[];original.related_checks.push({...duplicate});
  original.target_node_ids=[...new Set([...original.target_node_ids,...duplicate.target_node_ids])];
  findings.splice(findings.indexOf(duplicate),1);
 }
 // Group legacy omission claims by the exact parent clause, keeping every source
 // finding. This is one reassessment item, not multiple confirmed violations.
 const grouped=new Map();
 for(let i=0;i<findings.length;){const f=findings[i];if(f.reason!=='PARENT_RESPONSIBILITY_REVIEW_REQUIRED'){i++;continue;}const key=stable(f.parent_refs),prior=grouped.get(key);if(prior){prior.related_claims.push({...f});findings.splice(i,1);}else{f.related_claims=[{check_id:f.check_id,missing_id:f.missing_id,reason:f.model_reason??f.detail}];grouped.set(key,f);i++;}}
 findings.forEach((f,i)=>{f.id='F'+(i+1);});
 const priority=['VIOLATED','UNRESOLVED','PENDING_COVERAGE','COMPATIBLE','INHERITED','VERIFIED','NOT_APPLICABLE'];
 const axes=Object.fromEntries(AXES.map(a=>[a,priority.find(s=>findings.some(f=>f.axes.includes(a)&&(f.axis_status??f.status)===s))??'NOT_RUN']));
 const status=priority.find(s=>findings.some(f=>f.status===s))??'NOT_RUN';
 return {format:COMPARISON_VERSION,status,axes,findings,diagnostics,covered_clause_count:coverage.size,coverage_basis:'REVIEWED_MAPPING_NOT_EXECUTION',...nil};
}
