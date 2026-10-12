import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.55'),folder='docs/reports/7plus1/JOINT-BOUNDARY-CLOSURE-r01/final-ui55-replay';
const {verifyJointWitness}=await import(pathToFileURL(path.join(root,'src/bxp/joint-boundary-solver.mjs')));
const t=JSON.parse(fs.readFileSync(folder+'/trace.json')),m=t.boundary_calculations.mathematical_results,j=m.joint,q=j.completion[0],problem={...j.problem,constraints:[...j.problem.constraints,...q.query_constraints]},checks=[];
const check=(name,pass)=>checks.push({name,pass:!!pass});
check('joint SAT and independently verified full witness',j.base.result==='satisfiable'&&verifyJointWitness(j.problem,j.base.witness).valid);
check('completion target SAT and independently verified full witness',q.result==='satisfiable'&&verifyJointWitness(problem,q.witness).valid);
check('high-risk branch SAT with verified witness',j.trigger_branches.length===1&&j.trigger_branches.every(x=>verifyJointWitness({...j.problem,constraints:[...j.problem.constraints,...x.query_constraints]},x.witness).valid));
check('no joint coverage or relation gap',!j.gaps.length&&!m.unknown_frontier.length);
check('three exact static prohibition pairs',m.negative_sets.static.length===3);
const roles=t.ir.facts.filter(x=>x.kind==='ROLE'),summary=t.ir.entities.find(x=>x.label==='summary.md').id,deliver=roles.find(x=>x.claim.entity_id===summary&&x.claim.role==='DELIVERABLE').claim.event_id;
const stateVariable=Object.keys(j.problem.variable_meanings).find(id=>j.problem.variable_meanings[id].kind==='STATE'&&j.problem.variable_meanings[id].event_id===deliver);
const invalidState=structuredClone(q.witness);invalidState.boolean[stateVariable]=false;check('delivered event with false terminal delivery state rejected',!verifyJointWitness(problem,invalidState).valid);
for(const n of ['-1','31']){const w=structuredClone(q.witness);w.intervals['interval:0']=n;check('out-of-range duration '+n+' rejected',!verifyJointWitness(problem,w).valid);}
for(const n of ['0','30']){const w=structuredClone(q.witness);w.intervals['interval:0']=n;check('declared duration endpoint '+n+' allowed in abstract interval model',verifyJointWitness(problem,w).valid);}
const ready=Object.keys(j.problem.variable_meanings).find(id=>j.problem.variable_meanings[id].kind==='ARTIFACT_READY_AT_USE'),badReady=structuredClone(q.witness);badReady.boolean[ready]=false;check('required use without declared result readiness rejected',!verifyJointWitness(problem,badReady).valid);
const edge=j.problem.orders.find(x=>x.rule==='EXPLICIT_ORDER_WITH_DECLARED_STATE_GUARD'),badOrder=structuredClone(q.witness);badOrder.order_rank[edge.from]=badOrder.order_rank[edge.to]+1;check('reversed active explicit predecessor rejected',!verifyJointWitness(problem,badOrder).valid);
const branch=j.trigger_branches[0],stopEdge=j.problem.orders.find(x=>x.rule==='COMPLETED_WORK_NOT_CONTINUED_DURING_DECLARED_STOP_PHASE'),badStop=structuredClone(branch.witness);badStop.order_rank[stopEdge.from]=badStop.order_rank[stopEdge.to]+1;check('scoped work continued in stop phase rejected',!verifyJointWitness({...j.problem,constraints:[...j.problem.constraints,...branch.query_constraints]},badStop).valid);
check('no business authorization inferred',m.business_decision===null&&m.execution_authorization===null);
fs.writeFileSync(folder+'/JOINT-STANDARD-COMPARISON.json',JSON.stringify({checks,all_pass:checks.every(x=>x.pass),computed_completion_checks:q.verification.checks.length,computed_stop_checks:branch.verification.checks.length,source_sha256:t.source.sha256,model_calls_this_check:0},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({checks:checks.length,pass:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass)}));if(checks.some(x=>!x.pass))process.exitCode=1;
