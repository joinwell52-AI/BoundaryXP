// Finite abstract joint solving. No source text, model, network or business execution.
import {validateBooleanConstraints,evaluateBooleanAssignment} from './boolean-solver.mjs';
import {compareDecimal} from './decimal.mjs';
import {intersectValidatedIntervals} from './interval-solver.mjs';
import {evaluateScopeMembership,finiteDomainAssignment} from './scope-domains.mjs';
const variablesOf=f=>typeof f==='boolean'?[]:f.var?[f.var]:'not' in f?variablesOf(f.not):Object.values(f)[0].flatMap(variablesOf);
const partial=(f,v)=>{if(typeof f==='boolean')return f;if(f.var)return v[f.var];if('not' in f){const a=partial(f.not,v);return a===undefined?undefined:!a;}if(f.implies){const a=partial(f.implies[0],v),b=partial(f.implies[1],v);return a===false||b===true?true:a===true&&b===false?false:undefined;}const a=(f.all??f.any).map(x=>partial(x,v));return f.all?a.includes(false)?false:a.every(x=>x===true)?true:undefined:a.includes(true)?true:a.every(x=>x===false)?false:undefined;};
const decimal=s=>{if(!/^-?\d+(\.\d+)?$/.test(s))throw Error('NON_DECIMAL_BOUND');const [a,b='']=s.split('.');return {n:BigInt(a+b),scale:b.length};};
const text=(n,scale)=>{const sign=n<0n?'-':'';let s=(n<0n?-n:n).toString().padStart(scale+1,'0');return sign+(scale?s.slice(0,-scale)+'.'+s.slice(-scale):s);};
function midpoint(a,b){const x=decimal(a),y=decimal(b),scale=Math.max(x.scale,y.scale),n=x.n*10n**BigInt(scale-x.scale)+y.n*10n**BigInt(scale-y.scale);return text(n*5n,scale+1);}
function shift(a,n){const x=decimal(a);return text(x.n+BigInt(n)*10n**BigInt(x.scale),x.scale);}
function intervalValue(x){if(x.empty)return null;if(x.upper?.inclusive)return x.upper.value;if(x.lower?.inclusive)return x.lower.value;if(x.lower&&x.upper)return midpoint(x.lower.value,x.upper.value);if(x.lower)return shift(x.lower.value,1);if(x.upper)return shift(x.upper.value,-1);return '0';}
function intervalContains(x,v){return (!x.lower||compareDecimal(v,x.lower.value)>0||x.lower.inclusive&&compareDecimal(v,x.lower.value)===0)&&(!x.upper||compareDecimal(v,x.upper.value)<0||x.upper.inclusive&&compareDecimal(v,x.upper.value)===0);}
function temporalEmbedding(problem,numeric,ranks){const schedules={};for(const h of problem.temporal_horizons??[]){const bound=problem.intervals.find(x=>x.id===h.interval_id);if(!bound)throw Error('TEMPORAL_HORIZON_BINDING');let value=numeric[h.interval_id],max=Math.max(0,...Object.values(ranks));if(max===0&&Object.keys(ranks).length){if(!intervalContains(bound,'0'))return null;value='0';numeric[h.interval_id]=value;}if(max>0&&compareDecimal(value,'0')<=0){if(bound.upper&&compareDecimal(bound.upper.value,'0')<=0)return null;value=bound.upper?midpoint('0',bound.upper.value):shift(bound.lower?.value??'0',1);if(!intervalContains(bound,value))return null;numeric[h.interval_id]=value;}
 const d=decimal(value),den=10n**BigInt(d.scale)*BigInt(Math.max(1,max));schedules[h.interval_id]={duration:value,unit:h.unit,origin:'0',measure:'ELAPSED_FIRST_START_TO_LAST_END',points:Object.fromEntries(Object.entries(ranks).map(([id,rank])=>[id,{numerator:(BigInt(rank)*d.n).toString(),denominator:den.toString()}])),interpretation:'Constructive abstract elapsed time assignment; not predicted/observed durations'};}return schedules;}
function activeEdges(p,values){return p.orders.filter(x=>!x.guard||partial(x.guard,values)===true);}
function activeIntervals(p,values){return p.intervals.map(base=>{
 const restrictions=(p.guarded_intervals??[]).filter(x=>x.interval_id===base.id&&partial(x.guard,values)===true);
 if(!restrictions.length)return base;
 const [intersection]=intersectValidatedIntervals([base,...restrictions.map(x=>({...base,id:x.id,lower:x.lower,upper:x.upper}))]);
 return {...intersection,id:base.id};
});}
function ranking(edges){const nodes=[...new Set(edges.flatMap(x=>[x.from,x.to]))].sort(),rank=Object.fromEntries(nodes.map(id=>[id,0]));for(let i=0;i<=nodes.length;i++){let changed=false;for(const e of edges){const bound=rank[e.from]+(e.relation==='LTE'?0:1);if(rank[e.to]<bound){rank[e.to]=bound;changed=true;}}if(!changed)return rank;if(i===nodes.length)return null;}return rank;}
// Force only consequences of a required truth value. No guessed value enters
// this trail; disjunctions with several possible members remain search choices.
function propagate(constraints,initial={}){
 const values={...initial},trail=[];let changed=false,conflict=null;
 const force=(f,wanted,id)=>{
  if(conflict)return;
  const actual=partial(f,values);
  if(actual===wanted)return;
  if(actual!==undefined){conflict={kind:'BOOLEAN',constraint_id:id};return;}
  if(f.var){values[f.var]=wanted;trail.push({constraint_id:id,variable:f.var,value:wanted});changed=true;return;}
  if('not' in f){force(f.not,!wanted,id);return;}
  if(f.implies){force({any:[{not:f.implies[0]},f.implies[1]]},wanted,id);return;}
  const members=f.all??f.any;
  if((!!f.all&&wanted)||(!f.all&&!wanted)){for(const member of members)force(member,wanted,id);return;}
  const undecided=members.filter(member=>partial(member,values)===undefined);
  if(undecided.length===1)force(undecided[0],wanted,id);
 };
 do{changed=false;for(const c of constraints)force(c.formula,true,c.id);}while(changed&&!conflict);
 return {values,trail,conflict};
}
function strictCycle(edges){
 for(const strict of edges.filter(e=>e.relation!=='LTE')){
  const queue=[strict.to],previous=new Map([[strict.to,null]]);
  for(let i=0;i<queue.length&&!previous.has(strict.from);i++)for(const edge of edges.filter(e=>e.from===queue[i]))if(!previous.has(edge.to)){previous.set(edge.to,edge);queue.push(edge.to);}
  if(!previous.has(strict.from))continue;
  const path=[];let at=strict.from;while(at!==strict.to){const edge=previous.get(at);path.push(edge.id);at=edge.from;}
  return {kind:'STRICT_ORDER_CYCLE',edge_ids:[strict.id,...path.reverse()]};
 }
 return null;
}
// A root conflict is a certificate of forced values and a concrete Boolean
// contradiction or closed order path with at least one strict edge.
export function verifyJointConflict(problem,certificate){
 if(!certificate||certificate.initial_assignment&&Object.keys(certificate.initial_assignment).length)return {valid:false};
 const p=propagate(problem.constraints),same=JSON.stringify(p.trail)===JSON.stringify(certificate.propagation);
 if(certificate.kind==='BOOLEAN')return {valid:same&&p.conflict?.constraint_id===certificate.constraint_id};
 if(certificate.kind!=='STRICT_ORDER_CYCLE'||!same||p.conflict)return {valid:false};
 const active=new Map(activeEdges(problem,p.values).map(e=>[e.id,e])),path=certificate.edge_ids.map(id=>active.get(id));
 return {valid:path.length>0&&path.every(Boolean)&&path.some(e=>e.relation!=='LTE')&&path.every((e,i)=>e.to===path[(i+1)%path.length].from)};
}
export function verifyJointWitness(problem,witness){
 const checks=[];const add=(id,pass,kind)=>checks.push({id,pass,kind});
 add('EXACT_VARIABLE_ASSIGNMENT',Object.keys(witness.boolean).length===problem.variables.length&&problem.variables.every(v=>typeof witness.boolean[v]==='boolean'),'BINDING');
 for(const c of problem.constraints){const vars=[...new Set(variablesOf(c.formula))];let pass=false;try{pass=evaluateBooleanAssignment(vars,c.formula,Object.fromEntries(vars.map(v=>[v,witness.boolean[v]])),{maxVariables:128});}catch{}add(c.id,pass,'BOOLEAN');}
 for(const x of problem.intervals)add('interval:'+x.id,typeof witness.intervals[x.id]==='string'&&intervalContains(x,witness.intervals[x.id]),'INTERVAL');
 for(const x of problem.guarded_intervals??[])if(partial(x.guard,witness.boolean)===true)add('guarded-interval:'+x.id,typeof witness.intervals[x.interval_id]==='string'&&intervalContains(x,witness.intervals[x.interval_id]),'CONDITIONAL_INTERVAL');
 for(const d of problem.domains??[]){if(d.guard&&partial(d.guard,witness.boolean)!==true)continue;const value=witness.domain_values?.[d.variable_id??d.id];add('domain:'+d.id,evaluateScopeMembership(d.allowed,[value],{identityKnown:typeof value==='string'}).result==='SATISFIED','FINITE_SCOPE_MEMBERSHIP');}
 for(const x of activeEdges(problem,witness.boolean))add('order:'+x.id,Number.isSafeInteger(witness.order_rank[x.from])&&Number.isSafeInteger(witness.order_rank[x.to])&&(x.relation==='LTE'?witness.order_rank[x.from]<=witness.order_rank[x.to]:witness.order_rank[x.from]<witness.order_rank[x.to]),'ABSTRACT_ORDER');
 for(const x of problem.state_checks??[]){if(x.guard&&partial(x.guard,witness.boolean)!==true)continue;const actual=witness.boolean[x.global_variable]===true&&Number.isSafeInteger(witness.order_rank[x.state_point])&&Number.isSafeInteger(witness.order_rank[x.event_start])&&witness.order_rank[x.state_point]<=witness.order_rank[x.event_start];add('state-at-start:'+x.id,witness.boolean[x.local_variable]===actual,'NECESSARY_STATE_AT_EVENT_START');}
 for(const h of problem.temporal_horizons??[]){const schedule=witness.metric_schedule?.[h.interval_id],duration=witness.intervals[h.interval_id];let valid=!!schedule&&schedule.duration===duration&&schedule.unit===h.unit;
  if(valid){try{const d=decimal(duration),scale=10n**BigInt(d.scale);let hasOrigin=false,hasEnd=false;for(const id of Object.keys(witness.order_rank)){const p=schedule.points[id];const n=BigInt(p.numerator),den=BigInt(p.denominator);if(den<=0n||n<0n||n*scale>d.n*den)valid=false;if(n===0n)hasOrigin=true;if(n*scale===d.n*den)hasEnd=true;}if(Object.keys(witness.order_rank).length&&(!hasOrigin||!hasEnd))valid=false;for(const e of activeEdges(problem,witness.boolean)){const a=schedule.points[e.from],b=schedule.points[e.to],cmp=BigInt(a.numerator)*BigInt(b.denominator)-BigInt(b.numerator)*BigInt(a.denominator);if(e.relation==='LTE'?cmp>0n:cmp>=0n)valid=false;}}catch{valid=false;}}
  if(valid&&h.start_point&&h.end_point){try{const a=schedule.points[h.start_point],b=schedule.points[h.end_point],d=decimal(duration);valid=BigInt(b.numerator)*BigInt(a.denominator)*10n**BigInt(d.scale)-BigInt(a.numerator)*BigInt(b.denominator)*10n**BigInt(d.scale)===d.n*BigInt(a.denominator)*BigInt(b.denominator);}catch{valid=false;}}
  add('temporal-horizon:'+h.interval_id,valid,'TOTAL_DURATION_EMBEDDING');
 }
 return {valid:checks.every(x=>x.pass),checks};
}
export function solveJointBoundary(problem,{maxNodes=100000}={}){
 if(!Array.isArray(problem.variables)||problem.variables.length>128||new Set(problem.variables).size!==problem.variables.length||problem.constraints.length>1024||problem.orders.length>1024||!Number.isSafeInteger(maxNodes)||maxNodes<1)throw Error('JOINT_CAPACITY_OR_SIGNATURE');
 const declared=new Set(problem.variables);
 for(const c of problem.constraints){const vars=[...new Set(variablesOf(c.formula))];if(vars.some(v=>!declared.has(v)))throw Error('JOINT_DANGLING_VARIABLE');validateBooleanConstraints(vars,[c.formula],{maxVariables:128});}
 for(const e of problem.orders)if(e.guard){const vars=[...new Set(variablesOf(e.guard))];if(vars.some(v=>!declared.has(v)))throw Error('ORDER_DANGLING_VARIABLE');validateBooleanConstraints(vars,[e.guard],{maxVariables:128});}
 if((problem.guarded_intervals??[]).length>1024)throw Error('JOINT_CONDITIONAL_INTERVAL_CAPACITY');
 for(const x of problem.guarded_intervals??[]){if(!problem.intervals.some(i=>i.id===x.interval_id))throw Error('CONDITIONAL_INTERVAL_TARGET');const vars=[...new Set(variablesOf(x.guard))];if(vars.some(v=>!declared.has(v)))throw Error('INTERVAL_DANGLING_VARIABLE');validateBooleanConstraints(vars,[x.guard],{maxVariables:128});for(const b of [x.lower,x.upper])if(b)decimal(b.value);}
 for(const d of problem.domains??[]){if(typeof d.id!=='string'||!Array.isArray(d.allowed)||d.allowed.some(x=>typeof x!=='string'||!x))throw Error('FINITE_SCOPE_SIGNATURE');if(d.guard){const vs=[...new Set(variablesOf(d.guard))];if(vs.some(v=>!declared.has(v)))throw Error('SCOPE_DANGLING_VARIABLE');validateBooleanConstraints(vs,[d.guard],{maxVariables:128});}}
 for(const s of problem.state_checks??[])if(!declared.has(s.global_variable)||!declared.has(s.local_variable)||typeof s.state_point!=='string'||typeof s.event_start!=='string')throw Error('STATE_START_BINDING_SIGNATURE');
 const numeric=Object.fromEntries(problem.intervals.map(x=>[x.id,intervalValue(x)]));if(Object.values(numeric).includes(null))return {result:'unsatisfiable',reason:'EMPTY_INTERVAL',witness:null};
 const frequency=new Map(problem.variables.map(v=>[v,0]));for(const c of problem.constraints)for(const v of new Set(variablesOf(c.formula)))frequency.set(v,frequency.get(v)+1);
 const ordered=[...problem.variables].sort((a,b)=>frequency.get(b)-frequency.get(a)||a.localeCompare(b));let nodes=0,limited=false;
 let rootConflict=null;
 const search=initial=>{if(++nodes>maxNodes){limited=true;return null;}const propagated=propagate(problem.constraints,initial),values=propagated.values;
  const edges=activeEdges(problem,values),orderConflict=!propagated.conflict&&ranking(edges)===null?strictCycle(edges):null;
  if(propagated.conflict||orderConflict){if(nodes===1)rootConflict={...(propagated.conflict??orderConflict),initial_assignment:{},propagation:propagated.trail};return null;}
  if(ordered.every(v=>values[v]!==undefined)){const branch={...problem,intervals:activeIntervals(problem,values)},intervals=Object.fromEntries(branch.intervals.map(x=>[x.id,intervalValue(x)]));if(Object.values(intervals).includes(null))return null;const edges=activeEdges(problem,values);let ranks=ranking(edges);if(!ranks)return null;if(Math.max(0,...Object.values(ranks))===0){const positive=(branch.temporal_horizons??[]).filter(h=>!intervalContains(branch.intervals.find(i=>i.id===h.interval_id),'0'));if(positive.length){if(positive.some(h=>!h.start_point||!h.end_point))return null;ranks=ranking([...edges,...positive.map(h=>({from:h.start_point,to:h.end_point,relation:'LT'}))]);if(!ranks)return null;}}const domain_values=finiteDomainAssignment(problem.domains??[],values,partial);if(!domain_values)return null;const metric_schedule=temporalEmbedding(branch,intervals,ranks);return metric_schedule?{boolean:{...values},intervals,order_rank:ranks,metric_schedule,domain_values}:null;}
  const v=ordered.find(v=>values[v]===undefined);for(const value of [false,true]){const found=search({...values,[v]:value});if(found)return found;if(limited)return null;}return null;};
 const witness=search({});if(limited)return {result:'unknown',reason:'SEARCH_CAPACITY',nodes,witness:null};if(!witness)return {result:'unsatisfiable',reason:rootConflict?.kind??'BOOLEAN_OR_ACTIVE_ORDER',nodes,witness:null,...(rootConflict?{conflict:rootConflict,conflict_verification:verifyJointConflict(problem,rootConflict)}:{})};
 const verification=verifyJointWitness(problem,witness);if(!verification.valid){const error=Error('JOINT_WITNESS_VERIFICATION_FAILED');error.failed_checks=verification.checks.filter(c=>!c.pass);error.witness=witness;throw error;}return {result:'satisfiable',nodes,witness,verification,proof_scope:'FINITE_DECLARED_BOOLEAN_INTERVAL_AND_ABSTRACT_ORDER'};
}
