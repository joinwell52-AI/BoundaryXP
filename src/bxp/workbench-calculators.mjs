// Comparison of submitted interpretations; no NLP, file access or model calls.
import {canonicalBooleanBoundary} from './boolean-solver.mjs';
import {solveAllowedSets} from './allowed-set-solver.mjs';
import {intersectValidatedIntervals} from './interval-solver.mjs';
import {solveValidatedPrerequisites} from './dependency-solver.mjs';
import {add,compare,exact,stable,rational,multiply} from './ir-kernel/values.mjs';
import {evaluateMathematicalExpression} from './workbench-mathematical-expression.mjs';
const unknown=reason=>({status:'UNRESOLVED',reason,basis:'PROGRAM_INPUT_CHECK'});
export function calculateComparison(op,context={}){
 try{
  if(!op||typeof op.kind!=='string')return unknown('CALCULATION_NOT_SPECIFIED');
  switch(op.kind){
   case 'mathematical_expression':return evaluateMathematicalExpression(op.expression,context);
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
    // Scale all rational endpoints by one positive denominator before using the
    // existing decimal interval solver. No floating-point conversion or rounding.
    const scale=[op.parent.lower,op.parent.upper,op.child.lower,op.child.upper].filter(Boolean).reduce((d,b)=>d*rational(b.value).d,1n).toString();
    const item=v=>({...v,lower:v.lower?{...v.lower,value:multiply(v.lower.value,scale)}:null,upper:v.upper?{...v.upper,value:multiply(v.upper.value,scale)}:null,id:'range',scope_id:'submitted',subject:'same',dimension:op.dimension,unit:op.unit});
    const [ps]=intersectValidatedIntervals([item(op.parent)]),[cs]=intersectValidatedIntervals([item(op.child)]);
    const p={...ps,lower:op.parent.lower,upper:op.parent.upper},c={...cs,lower:op.child.lower,upper:op.child.upper};
    if(c.empty)return {status:'VIOLATED',basis:'PROGRAM',reason:'CHILD_INTERVAL_EMPTY'};
    const lower=!p.lower||(c.lower&&(compare(c.lower.value,p.lower.value)>0||(compare(c.lower.value,p.lower.value)===0&&(p.lower.inclusive||!c.lower.inclusive))));
    const upper=!p.upper||(c.upper&&(compare(c.upper.value,p.upper.value)<0||(compare(c.upper.value,p.upper.value)===0&&(p.upper.inclusive||!c.upper.inclusive))));
    return {status:!p.empty&&lower&&upper?'VERIFIED':'VIOLATED',basis:'PROGRAM',method:'INTERVAL_SUBSET',parent:p,child:c};}
   case 'interval_composition':{
    const xs=op.intervals;
    if(!Array.isArray(xs)||!xs.length||!['ADDITIVE','SERIAL','PARALLEL','EXCLUSIVE'].includes(op.combination))return unknown('INTERVAL_COMPOSITION_REQUIRED');
    if(xs.some(x=>!Object.hasOwn(x,'lower')||!Object.hasOwn(x,'upper')))return unknown('INTERVAL_BOUNDS_REQUIRED');
    for(const x of xs){const check=calculateComparison({kind:'interval_subset',dimension:op.dimension,unit:op.unit,parent:{lower:null,upper:null},child:x});if(check.status!=='VERIFIED')return unknown('EMPTY_OR_INVALID_COMPONENT_INTERVAL');}
    const max=op.combination==='PARALLEL'||op.combination==='EXCLUSIVE';
    const bound=k=>{
     if(op.combination==='EXCLUSIVE'){
      if(xs.some(x=>x[k]===null))return null;
      const sorted=xs.map(x=>x[k]).sort((a,b)=>compare(a.value,b.value)),v=k==='lower'?sorted[0]:sorted.at(-1);
      return {value:exact(v.value),inclusive:sorted.some(b=>compare(b.value,v.value)===0&&b.inclusive)};
     }
     if(max){
      const bs=xs.map(x=>x[k]);if(k==='upper'&&bs.includes(null))return null;
      const known=bs.filter(Boolean);if(!known.length)return null;
      const value=known.reduce((a,b)=>compare(a,b.value)>0?a:b.value,known[0].value);
      const at=known.filter(b=>compare(b.value,value)===0);
      return {value:exact(value),inclusive:k==='lower'?at.every(b=>b.inclusive):at.some(b=>b.inclusive)};
     }
     if(xs.some(x=>x[k]===null))return null;
     return {value:xs.reduce((v,x)=>add(v,x[k].value),'0'),inclusive:xs.every(x=>x[k].inclusive)};
    };
    const child={lower:bound('lower'),upper:bound('upper')};
    const r=calculateComparison({kind:'interval_subset',dimension:op.dimension,unit:op.unit,parent:op.parent,child});
    const fixed=xs.every(x=>x.lower&&x.upper&&x.lower.inclusive&&x.upper.inclusive&&compare(x.lower.value,x.upper.value)===0);
    // A bound enclosing correlated choices can prove containment, but crossing
    // the bound is not a reachable witness unless choices are independent.
    if(r.status==='VIOLATED'&&!fixed&&op.independent!==true&&op.combination!=='EXCLUSIVE'){
     const allAbove=child.lower&&op.parent.upper&&(compare(child.lower.value,op.parent.upper.value)>0||compare(child.lower.value,op.parent.upper.value)===0&&(!child.lower.inclusive||!op.parent.upper.inclusive));
     const allBelow=child.upper&&op.parent.lower&&(compare(child.upper.value,op.parent.lower.value)<0||compare(child.upper.value,op.parent.lower.value)===0&&(!child.upper.inclusive||!op.parent.lower.inclusive));
     if(!allAbove&&!allBelow)return unknown('JOINT_CHOICE_RELATION_NOT_ESTABLISHED');
    }
    return {...r,method:'INTERVAL_COMPOSITION',combination:op.combination,unit:op.unit,composed:child,component_intervals:xs,independent:op.independent===true};
   }
   case 'cardinality_composition':{
    const xs=op.items,{min,max}=op;
    if(!Array.isArray(xs)||!Number.isInteger(min)||!Number.isInteger(max)||min<0||max<min||max>xs.length||new Set(xs.map(x=>x.instance)).size!==xs.length)return unknown('SELECTION_CARDINALITY_INVALID');
    if(xs.length>20)return unknown('SELECTION_CAPACITY');
    let visited=0,low=null,high=null,witness=null;
    const visit=(i,chosen)=>{
     if(chosen.length>max||chosen.length+xs.length-i<min)return;
     if(i!==xs.length){visit(i+1,chosen);visit(i+1,[...chosen,xs[i]]);return;}
     if(++visited>4096)throw Error('SELECTION_CAPACITY');
     const intervals=chosen.length?chosen.map(x=>x.interval):[{lower:{value:'0',inclusive:true},upper:{value:'0',inclusive:true}}];
     const r=calculateComparison({kind:'interval_composition',combination:'ADDITIVE',intervals,dimension:op.dimension,unit:op.unit,parent:op.parent,independent:op.independent});
     if(r.status==='UNRESOLVED')throw Error(r.reason);
     if(r.composed.lower&&(low===null||compare(r.composed.lower.value,low)<0))low=r.composed.lower.value;
     if(r.composed.upper&&(high===null||compare(r.composed.upper.value,high)>0))high=r.composed.upper.value;
     if(r.status==='VIOLATED'&&!witness)witness={instances:chosen.map(x=>x.instance),interval:r.composed};
    };
    visit(0,[]);
    return {status:witness?'VIOLATED':'VERIFIED',basis:'PROGRAM',method:'CARDINALITY_COMPOSITION',min,max,choices_checked:visited,min_total:low,max_total:high,unit:op.unit,witness};
   }
   case 'containment_lower_bound':{
    if(!op.parent_upper||!op.part_lower)return unknown('CONTAINMENT_BOUNDS_REQUIRED');
    const n=compare(op.part_lower.value,op.parent_upper.value),violated=n>0||n===0&&(!op.part_lower.inclusive||!op.parent_upper.inclusive);
    return {status:violated?'VIOLATED':'VERIFIED',basis:'PROGRAM',method:'CONTAINMENT_LOWER_BOUND',lower:op.part_lower,upper:op.parent_upper,unit:op.unit,excess:add(op.part_lower.value,multiply(op.parent_upper.value,'-1'))};
   }
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
