// Counterexample assumptions are separate from the immutable source problem.
import {solveJointBoundary} from '../../../src/bxp/joint-boundary-solver.mjs';
export function queryDirectIRCounterexamples(problem){
 const queries=[];
 const query=(id,constraints,orders=[])=>{
  const out=solveJointBoundary({...problem,constraints:[...problem.constraints,...constraints],orders:[...problem.orders,...orders]});
  queries.push({id,assumptions:constraints,additional_orders:orders,...out,scope:'SOURCE_PROBLEM_PLUS_EXPLICIT_COUNTEREXAMPLE_ASSUMPTIONS',not_actual_execution:true});
 };
 for(const s of problem.state_checks??[]){
  query('absent-state:'+s.id,[{id:'query-activation:'+s.id,formula:s.guard??true},{id:'query-no-state:'+s.id,formula:{not:{var:s.global_variable}}}]);
  query('late-state:'+s.id,[{id:'query-activation:'+s.id,formula:s.guard??true},{id:'query-state:'+s.id,formula:{var:s.global_variable}}],[{id:'query-late:'+s.id,from:s.event_start,to:s.state_point,relation:'LT'}]);
 }
 for(const e of problem.orders.filter(e=>e.guard?.var&&problem.variable_meanings?.[e.guard.var]?.kind==='ORDER'))
  query('reverse-order:'+e.id,[{id:'query-order-active:'+e.id,formula:e.guard}],[{id:'query-reverse:'+e.id,from:e.to,to:e.from,relation:'LTE'}]);
 return queries;
}
