import {evaluateRequirements} from './rules.mjs';import {evaluateCore} from './evaluate.mjs';import {unknown,compare,toBase,identity} from './values.mjs';
import {planEvent,roleBindingFailures} from './events.mjs';
export function modelContext(core,problem,model){
 const ctx={...structuredClone(problem.query),plan:structuredClone(problem.plan),event_values:{},variables:{...problem.query.variables},states:structuredClone(problem.query.states??{}),receipts:structuredClone(problem.query.receipts??[]),availability:structuredClone(problem.query.availability??{})};
 for(const s of Object.values(ctx.states))if(s&&typeof s==='object'&&s.established_at!=null){s.established_at=toBase(s.established_at,s.unit??'second');s.unit='second';}
 for(const [key,{meaning:m}]of Object.entries(problem.declarations)){
  if(!Object.hasOwn(model,key))throw Error('MODEL_VALUE_MISSING:'+key);const value=model[key];
  if(m.kind==='VARIABLE')ctx.variables[m.id]=typeof value==='boolean'?value:{number:value};
  if(m.kind==='OBJECT_VARIABLE')ctx.variables[m.id]=m.values[Number(value)];
  if(m.kind==='EVENT_FIELD'){let e=ctx.plan.events.find(e=>e.id===m.event);if(!e)e=ctx.event_values[m.event]??={id:m.event,task_id:core.root_task,unit:'second'};e[m.field]=value;}
  if(m.kind==='STATE_VALUE'||m.kind==='STATE_TIME'){const s=ctx.states[m.id];ctx.states[m.id]={...(typeof s==='boolean'?{value:s}:s),[m.kind==='STATE_VALUE'?'value':'established_at']:value,unit:'second'};}
  if(m.kind==='DATA_AVAILABLE')ctx.availability[m.key]={at:value,unit:'second'};
  if(m.kind==='RECEIPT'){let x=ctx.receipts.find(x=>x.receiver===m.receiver&&x.artifact===m.artifact&&(x.delivery??null)===m.delivery);if(!x){x={receiver:m.receiver,artifact:m.artifact,delivery:m.delivery};ctx.receipts.push(x);}x[m.field]=value;}
 }
 return ctx;
}
export function verifyModel(core,problem,model,{refinement=null}={}){
 try{
  const ctx=modelContext(core,problem,model),evaluation=evaluateRequirements(core,ctx),failures=evaluation.rows.filter(r=>r.constraining&&r.value!==true).map(r=>({id:r.id,code:unknown(r.value)?'MODEL_UNDECIDED':'MODEL_CONSTRAINT_VIOLATED'}));
  failures.push(...roleBindingFailures(core,ctx,r=>evaluateCore(core,r,ctx)));
  for(const [id,expected]of Object.entries(problem.query.variables??{})){const actual=ctx.variables[id];if(expected?.number!==undefined?actual?.number===undefined||compare(expected.number,actual.number)!==0:identity(expected)!==identity(actual))failures.push({id,code:'QUERY_VARIABLE_BINDING_CONFLICT'});}
  for(const e of [...ctx.plan.events,...Object.values(ctx.event_values)]){if(e.completed===true&&e.occurred!==true||e.succeeded===true&&e.completed!==true)failures.push({id:e.id,code:'EVENT_STATE_AXIOM'});if(e.occurred===true&&e.start!=null&&e.end!=null&&compare(e.start,e.end)>0)failures.push({id:e.id,code:'EVENT_TIME_AXIOM'});}
  for(const x of ctx.receipts)if(x.complete===true&&x.any===false)failures.push({id:x.artifact,code:'RECEIPT_AXIOM'});
  const states=[];
  for(const [key,value]of Object.entries(ctx.states)){
   let id=key,event=null;try{const parsed=JSON.parse(key);if(Array.isArray(parsed)){[id,event]=parsed;}}catch{}
   const state=core.nodes[id];if(!state||state.category!=='STATE'||!event||value?.value!==true)continue;
   const e=planEvent(core,ctx,event);states.push({id,event,kind:state.kind});
   if(['SUCCESS','FAILURE','COMPLETION','CONTROL_EFFECT'].includes(state.kind)&&e?.occurred!==true)failures.push({id,code:'STATE_REQUIRES_EVENT'});
   if(e?.start==null||e?.end==null||value.established_at==null||compare(value.established_at,e.start)<0||compare(value.established_at,e.end)>0||state.kind==='COMPLETION'&&compare(value.established_at,e.end)!==0)failures.push({id,code:'STATE_TIME_AXIOM'});
  }
  for(const a of states)for(const b of states)if(a.id<b.id&&a.event===b.event&&[a.kind,b.kind].sort().join(',')==='FAILURE,SUCCESS')failures.push({id:a.id,code:'EXCLUSIVE_OUTCOMES'});
  for(const [id,value]of Object.entries(ctx.variables)){const n=core.nodes[id];if(!n)continue;const d=evaluateCore(core,n.domain,ctx);if(d.set&&!d.set.some(x=>identity(x)===identity(value))||d.interval&&(compare(value.number,d.interval[0])<0||compare(value.number,d.interval[1])>0))failures.push({id,code:'VARIABLE_OUTSIDE_DOMAIN'});}
  if(refinement){const a=evaluateRequirements(core,{...ctx,requirements:refinement.adminRequirements});if(a.result!=='VIOLATED')failures.push({code:'COUNTEREXAMPLE_NOT_CONFIRMED'});}
  return {valid:failures.length===0,failures,evaluation,context:ctx,against:'CORE_SEMANTICS_NOT_BACKEND_AST'};
 }catch(e){return {valid:false,failures:[{code:'MODEL_CHECK_ERROR',message:e.message}],against:'CORE_SEMANTICS_NOT_BACKEND_AST'};}
}
