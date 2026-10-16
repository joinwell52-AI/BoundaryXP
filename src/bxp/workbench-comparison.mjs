// Comparison of submitted interpretations; no NLP, file access or model calls.
import {AXES,ancestors,validatePlan} from './workbench-model.mjs';
import {canonicalBooleanBoundary} from './boolean-solver.mjs';
import {solveAllowedSets} from './allowed-set-solver.mjs';
import {intersectValidatedIntervals} from './interval-solver.mjs';
import {solveValidatedPrerequisites} from './dependency-solver.mjs';
import {add,compare,exact,stable} from './ir-kernel/values.mjs';
export const COMPARISON_VERSION='boundx-plan-comparison/1';
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
export function comparePlan({plan,boundaries,proposal,review}){
 validatePlan(plan);
 const findings=[],clauses=new Map(),nodes=new Map(plan.nodes.map(n=>[n.id,n]));
 for(const [id,b]of Object.entries(boundaries))for(const c of b?.boundary?.clauses??[])clauses.set(id+':'+c.id,c);
 const valid=r=>!!r&&clauses.get(refKey(r))?.source_valid===true;
 const refs=rs=>Array.isArray(rs)&&rs.length>0&&rs.every(valid);
 const approved=new Set(Array.isArray(review?.accepted_check_ids)?review.accepted_check_ids:[]),checked=new Set(),coverage=new Set(),seen=new Set();
 const push=f=>findings.push({id:'F'+(findings.length+1),...f,...nil});
 if(plan.mode==='SINGLE'||!plan.nodes.some(n=>n.parent_id))return {format:COMPARISON_VERSION,status:'NO_PARENT_COMPARISON',findings:[],axes:Object.fromEntries(AXES.map(a=>[a,'NOT_APPLICABLE'])),...nil};
 if(!Array.isArray(proposal?.checks)||!Array.isArray(review?.accepted_check_ids)||!Array.isArray(review?.issues))return {format:COMPARISON_VERSION,status:'UNRESOLVED',findings:[{id:'F1',status:'UNRESOLVED',reason:'COMPARISON_INTERFACE_INCOMPLETE',axes:AXES,basis:'PROGRAM_INPUT_CHECK'}],axes:Object.fromEntries(AXES.map(a=>[a,'UNRESOLVED'])),...nil};
 for(const check of proposal.checks){
  if(!check||!Array.isArray(check.parent_refs)||!Array.isArray(check.child_refs)){push({status:'UNRESOLVED',reason:'CHECK_REFERENCE_INTERFACE_INVALID',axes:AXES,basis:'PROGRAM_INPUT_CHECK'});continue;}
  if(!check.id||seen.has(check.id)){push({status:'UNRESOLVED',reason:'DUPLICATE_CHECK_ID',axes:AXES,basis:'PROGRAM_INPUT_CHECK'});continue;}seen.add(check.id);
  if(!check.parent_refs.every(r=>r&&typeof r.node_id==='string'&&typeof r.clause_id==='string')||!check.child_refs.every(r=>r&&typeof r.node_id==='string'&&typeof r.clause_id==='string')||(check.target_node_ids!==undefined&&!Array.isArray(check.target_node_ids))){push({status:'UNRESOLVED',reason:'CHECK_REFERENCE_INTERFACE_INVALID',axes:AXES,basis:'PROGRAM_INPUT_CHECK'});continue;}
  const parentRefs=check.parent_refs??[],childRefs=check.child_refs??[],all=[...parentRefs,...childRefs],targets=[...new Set([...childRefs.map(r=>r.node_id),...(check.target_node_ids??[])])];
  const axes=[...new Set(all.flatMap(r=>clauses.get(refKey(r))?.axes??[]))];
  const base={check_id:check.id,parent_refs:parentRefs,child_refs:childRefs,target_node_ids:targets,axes:axes.length?axes:AXES,scope:check.scope,reason:check.reason,model_reason:check.reason,operands:check.operation??null,semantic_basis:approved.has(check.id)?'LLM_MAPPING_INDEPENDENTLY_REVIEWED':'LLM_MAPPING_NOT_CONFIRMED'};
  // A disagreement about meaning must not erase a reproducible mathematical result.
  // It remains conditional on the supplied operands, distinct from the boundary verdict.
  if(check.operation)base.operand_calculation={...calculateComparison(check.operation),scope:'SUPPLIED_OPERANDS_ONLY',semantic_mapping_confirmed:approved.has(check.id)};
  let result;
  if(!refs(parentRefs)||!all.every(valid))result=unknown('SOURCE_OR_CLAUSE_BINDING_INVALID');
  else if(!approved.has(check.id))result=unknown('MAPPING_NOT_CONFIRMED_BY_REVIEW');
  else if(targets.some(id=>!nodes.has(id)||!parentRefs.some(p=>ancestors(plan,id).some(a=>a.id===p.node_id)))&&check.scope!=='INCONSISTENCY')result=unknown('NOT_AN_ANCESTOR_RELATION');
  else if(all.some(r=>boundaries[r.node_id]?.review?.issues?.some(i=>!Array.isArray(i?.clause_ids)||!i.clause_ids.length||i.clause_ids.includes(r.clause_id))))result=unknown('NODE_REVIEW_HAS_RELEVANT_ISSUE');
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
  push({...base,...result});
  if(result.status!=='UNRESOLVED'){
   for(const cr of childRefs)checked.add(refKey(cr));
   for(const pr of parentRefs)for(const id of targets)checked.add(pr.node_id+'>'+id+':'+pr.clause_id);
  }
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
  if(child.length||row.retained===true&&explicitlyRetained||row.not_obligation===true)coverage.add(key);
 }
 for(const p of plan.nodes.filter(n=>plan.nodes.some(c=>c.parent_id===n.id)))for(const c of boundaries[p.id]?.boundary?.clauses??[]){
  if(!coverage.has(p.id+':'+c.id))push({status:plan.planning==='OPEN'?'PENDING_COVERAGE':'UNRESOLVED',reason:plan.planning==='OPEN'?'RESPONSIBILITY_AWAITING_MAPPING':'COMPLETE_PLAN_COVERAGE_NOT_ESTABLISHED',axes:c.axes,parent_refs:[{node_id:p.id,clause_id:c.id}],child_refs:[],basis:'PROGRAM_COVERAGE'});
 }
 // Review-confirmed omissions are actual COMPLETE-plan defects, not generic unproved coverage.
 for(const missing of Array.isArray(proposal?.missing)?proposal.missing:[])if(missing&&valid(missing.parent_ref)&&Array.isArray(review?.accepted_missing_ids)&&review.accepted_missing_ids.includes(missing.id))push({status:plan.planning==='COMPLETE'?'VIOLATED':'PENDING_COVERAGE',reason:'REQUIRED_RESPONSIBILITY_MISSING',axes:clauses.get(refKey(missing.parent_ref)).axes,parent_refs:[missing.parent_ref],child_refs:[],basis:'LLM_REVIEWED',detail:missing.reason});
 for(const issue of review?.issues??[]){const related=findings.find(f=>f.check_id===issue?.check_id);push({status:'UNRESOLVED',reason:issue?.reason??String(issue),axes:related?.axes??AXES,parent_refs:related?.parent_refs??[],child_refs:related?.child_refs??[],check_id:issue?.check_id,basis:'INDEPENDENT_REVIEW'});}
 const priority=['VIOLATED','UNRESOLVED','PENDING_COVERAGE','COMPATIBLE','INHERITED','VERIFIED','NOT_APPLICABLE'];
 const axes=Object.fromEntries(AXES.map(a=>[a,priority.find(s=>findings.some(f=>f.axes.includes(a)&&f.status===s))??'NOT_RUN']));
 const status=priority.find(s=>findings.some(f=>f.status===s))??'NOT_RUN';
 return {format:COMPARISON_VERSION,status,axes,findings,covered_clause_count:coverage.size,coverage_basis:'REVIEWED_MAPPING_NOT_EXECUTION',...nil};
}
