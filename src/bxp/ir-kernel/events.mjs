import {stable,unique,toBase} from './values.mjs';import {fail} from './diagnostics.mjs';
export function preparePlan(core,plan={}){
 const result=structuredClone(plan),byKey=new Map();
 for(const e of result.events??[]){
  for(const k of ['occurred','completed','succeeded'])if(e[k]!=null&&typeof e[k]!=='boolean')fail('PLAN_BOOLEAN_REQUIRED',e.id,k,'QUERY');
  for(const k of ['start','end'])if(e[k]!=null)e[k]=toBase(e[k],e.unit??'second');e.unit='second';
  if(!e.id||!e.task_id)fail('PLAN_EVENT_IDENTITY',e.id,null,'QUERY');
  if(!core.nodes[e.task_id]||core.nodes[e.task_id].kind!=='TASK')fail('PLAN_TASK_MISSING',e.id);
  const declared=core.nodes[e.template_id??e.id];
  if(e.operation_extent==='OPEN')fail('OPEN_OPERATION_VALUE',e.id,null,'CAPABILITY');
  if(declared?.category==='EVENT'&&declared.kind!=='TASK'){
   if(e.operation&&declared.operation_extent==='EXACT'&&e.operation!==declared.operation)fail('PLAN_OPERATION_IDENTITY_CONFLICT',e.id,null,'QUERY');
   if(e.task_id!==declared.owner_id)fail('PLAN_OWNER_IDENTITY_CONFLICT',e.id,null,'QUERY');
   if(e.roles)for(const r of declared.roles.filter(r=>['ENTITY','EVENT'].includes(r.value.kind)))if(!e.roles.some(v=>v.role===r.role&&stable(v.value)===stable(r.value)))fail('PLAN_ROLE_IDENTITY_CONFLICT',e.id,r.role,'QUERY');
  }
  if(!e.template_id&&core.sequences.some(s=>e.id.startsWith(s.template.id+'@')))fail('INSTANCE_METADATA_REQUIRED',e.id,null,'QUERY');
  if(e.template_id!=null){
   const seq=core.sequences.find(s=>s.template.id===e.template_id);
   if(!seq||!Number.isSafeInteger(e.index)||e.index<seq.index_base||e.index>=seq.index_base+seq.max_instances)fail('INSTANCE_OUTSIDE_DECLARED_SEQUENCE',e.id);
   e.record_id=e.id;e.id=e.template_id+'@'+e.index;
  }
  if(e.roles)e.roles=e.roles.map(r=>({...r})).sort((a,b)=>stable(a).localeCompare(stable(b)));
  const previous=byKey.get(e.id);
  if(previous){const a={...previous},b={...e};delete a.record_id;delete b.record_id;if(stable(a)!==stable(b))fail('CONFLICTING_OCCURRENCE_RECORDS',e.id,null,'QUERY');}
  else byKey.set(e.id,e);
 }
 result.events=[...byKey.values()].sort((a,b)=>a.id.localeCompare(b.id));
 if(result.completeness&&(result.completeness.kind!=='EXACT_SNAPSHOT'||result.completeness.task_id!==core.root_task||!result.completeness.basis))fail('DOMAIN_COMPLETENESS_UNSUPPORTED',null,null,'CAPABILITY');
 return result;
}
export const rolesOf=(core,event,role)=>unique((event.roles??core.nodes[event.template_id??event.id]?.roles??[]).filter(r=>r.role===role).map(r=>r.value));
export function roleBindingFailures(core,context,resolve){
 const failures=[];
 for(const e of context.plan?.events??[]){
  if(!e.roles)continue;
  const declaration=core.nodes[e.template_id??e.id];
  if(declaration?.category!=='EVENT')continue;
  for(const role of declaration.roles){
   const expected=resolve(role.value),observed=e.roles.filter(r=>r.role===role.role).map(r=>resolve(r.value));
   if(expected?.unknown||observed.some(v=>v?.unknown))failures.push({id:e.id,code:'PLAN_ROLE_BINDING_UNDECIDED',role:role.role});
   else if(!observed.some(v=>stable(v)===stable(expected)))failures.push({id:e.id,code:'PLAN_ROLE_BINDING_CONFLICT',role:role.role,expected});
  }
 }
 return failures;
}
export function planEvent(core,context,id){
 const found=context.plan?.events?.find(e=>e.id===id)??context.event_values?.[id];
 if(found)return found;
 if(context.plan?.completeness?.kind==='EXACT_SNAPSHOT'&&core.nodes[id]?.kind!=='TASK')return {id,occurred:false,completed:false,succeeded:false};
 return undefined;
}
export function taskContains(core,owner,task){const seen=new Set();while(owner&&!seen.has(owner)){if(owner===task)return true;seen.add(owner);const n=core.nodes[owner];if(!n||n.owner_id===owner)break;owner=n.owner_id;}return false;}
