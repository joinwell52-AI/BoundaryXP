// Offline data model. Tree membership is explicit; it never comes from role names.
import {stable} from './ir-kernel/values.mjs';
export const WORKBENCH_VERSION='boundx-workbench/1';
export const AXES=['I','O','A','P','R','V','C','B'];
const clone=x=>structuredClone(x);
const fail=code=>{throw Error(code);};
export function validatePlan(plan){
 if(!plan||typeof plan.project_id!=='string'||!['SINGLE','TREE'].includes(plan.mode)||!['OPEN','COMPLETE'].includes(plan.planning)||!Array.isArray(plan.nodes)||plan.nodes.length>200)fail('INVALID_PLAN');
 const nodes=new Map();
 for(const n of plan.nodes){
  if(!n||typeof n.id!=='string'||!/^[-\w.]{1,100}$/.test(n.id)||nodes.has(n.id))fail('DUPLICATE_OR_INVALID_NODE_ID');
  if(n.project_id!==plan.project_id)fail('CROSS_PROJECT_NODE');
  if(typeof n.text!=='string'||!n.text.trim()||typeof n.label!=='string'||!Number.isSafeInteger(n.version)||n.version<1)fail('INVALID_NODE');
  if(!['NONE','PARENT'].includes(n.context_mode))fail('INVALID_CONTEXT_MODE');
  nodes.set(n.id,n);
 }
 const roots=plan.nodes.filter(n=>n.parent_id===null);
 if(plan.nodes.length&&roots.length!==1)fail('ONE_ROOT_REQUIRED');
 if(plan.mode==='SINGLE'&&plan.nodes.length>1)fail('SINGLE_MODE_HAS_CHILDREN');
 for(const n of plan.nodes){
  if(n.parent_id!==null&&!nodes.has(n.parent_id))fail('MISSING_PARENT');
  if(n.parent_id!==null&&(typeof n.parent_basis!=='string'||!n.parent_basis.trim()))fail('PARENT_BASIS_REQUIRED');
  const visited=new Set([n.id]);let p=n.parent_id;
  while(p!==null){if(visited.has(p))fail('TREE_CYCLE');visited.add(p);p=nodes.get(p)?.parent_id;if(p===undefined)fail('MISSING_PARENT');}
 }
 if(!Array.isArray(plan.dependencies)||!Array.isArray(plan.retained))fail('INVALID_PLAN_RELATIONS');
 for(const edge of plan.dependencies)if(!nodes.has(edge.from)||!nodes.has(edge.to)||!['handoff','prerequisite','shared_resource','exclusion'].includes(edge.kind)||!edge.basis)fail('INVALID_DEPENDENCY');
 for(const r of plan.retained)if(!nodes.has(r.node_id)||!r.clause_id||!r.basis)fail('INVALID_RETAINED_WORK');
 return plan;
}
export function newPlan(project_id,label='新任务'){
 return {format:WORKBENCH_VERSION,project_id,label,revision:0,mode:'SINGLE',planning:'OPEN',nodes:[],dependencies:[],retained:[],settings:{},comparison:null};
}
export function ancestors(plan,id){
 const out=[],byId=new Map(plan.nodes.map(n=>[n.id,n]));let n=byId.get(id);
 while(n?.parent_id){n=byId.get(n.parent_id);if(!n||out.some(x=>x.id===n.id))fail('INVALID_TREE');out.push(n);}return out;
}
export function semanticInput(plan,node,resources){
 const parent=plan.nodes.find(n=>n.id===node.parent_id);
 const context=node.context_mode==='PARENT'&&parent?{text:parent.text,source_version:parent.version,node_id:parent.id,ancestor_context:parent.context_mode==='PARENT'?semanticInput(plan,parent,resources).context:null}:null;
 return {text:node.text,context,settings:plan.settings,resources};
}
// Stable, canonical input is hashed by the host. Display labels/visibility are absent.
export const nodeInputKey=(plan,node,resources)=>stable(semanticInput(plan,node,resources));
export function mutatePlan(current,command){
 const p=clone(current);let n=p.nodes.find(x=>x.id===command.id);
 switch(command.type){
  case 'mode': p.mode=command.mode;break;
  case 'settings': p.settings=clone(command.settings);break;
  case 'planning': p.planning=command.value;break;
  case 'add':
   if(n)fail('DUPLICATE_NODE_ID');
   p.nodes.push({id:command.id,project_id:p.project_id,label:command.label??command.id,text:command.text,version:1,parent_id:command.parent_id??null,parent_basis:command.parent_basis??'',context_mode:command.context_mode??'NONE',result_key:null});break;
  case 'edit':
   if(!n)fail('NODE_NOT_FOUND');
   if(command.label!==undefined)n.label=command.label;
   if(command.text!==undefined&&command.text!==n.text){n.text=command.text;n.version++;n.result_key=null;}
   if(command.context_mode!==undefined&&command.context_mode!==n.context_mode){n.context_mode=command.context_mode;n.version++;n.result_key=null;}break;
  case 'move':
   if(!n)fail('NODE_NOT_FOUND');n.parent_id=command.parent_id;n.parent_basis=command.parent_basis;
   if(n.context_mode==='PARENT')n.result_key=null;break;
  case 'remove':{
   if(!n)fail('NODE_NOT_FOUND');
   const removed=new Set(p.nodes.filter(x=>x.id===n.id||ancestors(p,x.id).some(a=>a.id===n.id)).map(x=>x.id));
   p.nodes=p.nodes.filter(x=>!removed.has(x.id));p.dependencies=p.dependencies.filter(e=>!removed.has(e.from)&&!removed.has(e.to));p.retained=p.retained.filter(r=>!removed.has(r.node_id));break;}
  case 'relations': p.dependencies=clone(command.dependencies);p.retained=clone(command.retained);break;
  default:fail('UNKNOWN_PLAN_COMMAND');
 }
 validatePlan(p);
 p.revision++;p.comparison=null;return p;
}
export function quoteEvidence(text,quote,occurrence=1){
 if(typeof quote!=='string'||!quote||!Number.isSafeInteger(occurrence)||occurrence<1)fail('INVALID_QUOTE');
 const chars=[...text],q=[...quote];let count=0;
 for(let i=0;i<=chars.length-q.length;i++)if(q.every((c,j)=>chars[i+j]===c)&&++count===occurrence)return {quote,occurrence,span:[i,i+q.length],coordinates:'UNICODE_CODEPOINT_HALF_OPEN',line_endings:'PRESERVED'};
 fail('SOURCE_QUOTE_NOT_FOUND');
}
export function indexBoundary(raw,source){
 const issues=[],clauses=[],ids=new Set();
 if(!raw||!Array.isArray(raw.clauses))return {clauses,issues:[{code:'CLAUSE_INDEX_MISSING'}],unstated_axes:[],review_status:'UNRESOLVED'};
 for(const c of raw.clauses){
  if(!c||typeof c.id!=='string'||ids.has(c.id)||typeof c.text!=='string'||!c.text||!Array.isArray(c.axes)||!c.axes.length||c.axes.some(a=>!AXES.includes(a))){issues.push({code:'CLAUSE_ID_OR_AXIS_INVALID',clause_id:c?.id});continue;}
  ids.add(c.id);const evidence=[];
  for(const q of Array.isArray(c.quotes)?c.quotes:[])try{evidence.push(quoteEvidence(source,q.quote,q.occurrence??1));}catch(e){issues.push({code:e.message,clause_id:c.id});}
  if(!evidence.length)issues.push({code:'CLAUSE_SOURCE_MISSING',clause_id:c.id});
  clauses.push({...clone(c),evidence,source_valid:evidence.length>0&&!issues.some(i=>i.clause_id===c.id)});
 }
 const unstated_axes=Array.isArray(raw.unstated_axes)?raw.unstated_axes.filter(a=>AXES.includes(a)&&!clauses.some(c=>c.axes.includes(a))):[];
 for(const a of AXES)if(!clauses.some(c=>c.axes.includes(a))&&!unstated_axes.includes(a))issues.push({code:'AXIS_NOT_ACCOUNTED',axis:a});
 return {clauses,issues,unstated_axes,uncertainties:Array.isArray(raw.uncertainties)?raw.uncertainties:[],context_used:raw.context_used===true};
}
export function singleAxisStates(boundary,review){
 return Object.fromEntries(AXES.map(a=>[a,!boundary?'NOT_RUN':boundary.issues.some(i=>i.axis===a||boundary.clauses.some(c=>c.id===i.clause_id&&c.axes.includes(a)))?'UNRESOLVED':review?.issues?.some(i=>!i.clause_ids?.length||i.clause_ids.some(id=>boundary.clauses.some(c=>c.id===id&&c.axes.includes(a))))?'UNRESOLVED':boundary.clauses.some(c=>c.axes.includes(a))?'RECORDED':boundary.unstated_axes.includes(a)?'UNSTATED':'UNRESOLVED']));
}
