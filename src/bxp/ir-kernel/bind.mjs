import {collections,registry} from './contract-registry.mjs';import {taskScope} from '../../../research/7plus1-parser/llm-first-028/direct-ir-task-scope.mjs';import {dimension,rational} from './values.mjs';import {fail} from './diagnostics.mjs';
export function bindAndTypecheck(loaded,{maxDepth=128}={}){
 const ir=loaded.raw,nodes=new Map(),sources=new Set(ir.source_table.map(s=>s.id)),kinds=new Map(),scope=taskScope(ir);
 if(sources.size!==ir.source_table.length)fail('DUPLICATE_SOURCE_ID');
 for(const [collection,kind]of Object.entries(collections))for(const n of ir[collection]){if(nodes.has(n.id)||sources.has(n.id))fail('DUPLICATE_ID',n.id);nodes.set(n.id,n);kinds.set(n.id,kind);for(const s of n.source_refs)if(!sources.has(s))fail('SOURCE_REF_MISSING',n.id,s);}
 const tasks=ir.events.filter(e=>e.kind==='TASK'),roots=tasks.filter(e=>e.owner_id===e.id||e.owner_id==='ROOT'&&!tasks.some(t=>t.id==='ROOT'));
 if(roots.length!==1)fail('ROOT_NOT_UNIQUE',null,'events');
 const root=roots[0].id;if(ir.root_task&&(ir.root_task.kind!=='EVENT'||ir.root_task.id!==root))fail('ROOT_DECLARATION_MISMATCH');
 const ref=r=>{if(r.kind==='EVENT'&&r.id==='ROOT'&&!nodes.has('ROOT'))return {kind:'EVENT',id:root};if(!nodes.has(r.id))fail('REFERENCE_MISSING',r.id);if(kinds.get(r.id)!==r.kind)fail('REFERENCE_TYPE',r.id);return r;};
 const walk=(x,owner,depth=0)=>{if(depth>maxDepth)fail('IR_DEPTH_LIMIT',owner,null,'RESOURCE');if(Array.isArray(x)){x.forEach(y=>walk(y,owner,depth+1));return;}if(x&&typeof x==='object'){if(x.source_refs)for(const source of x.source_refs)if(!sources.has(source))fail('SOURCE_REF_MISSING',owner,source);if(typeof x.id==='string'&&Object.keys(x).length===2&&Object.hasOwn(collections,x.kind)===false&&Object.values(collections).includes(x.kind))ref(x);else Object.values(x).forEach(y=>walk(y,owner,depth+1));}};
 for(const n of nodes.values())walk(n,n.id);
 const issueIds=new Set();for(const issue of ir.issues){if(nodes.has(issue.id)||sources.has(issue.id)||issueIds.has(issue.id))fail('DUPLICATE_ID',issue.id);issueIds.add(issue.id);walk(issue,issue.id);}for(const row of ir.coverage)walk(row,null);
 for(const t of tasks){const a=scope.ancestry(t.id);if(!a.complete)fail(a.reason,t.id,'owner_id');}
 for(const e of ir.events)if(e.kind!=='TASK'&&!scope.resolve(e.owner_id))fail('EVENT_OWNER_MISSING',e.id,'owner_id');
 for(const r of ir.requirements)if(!scope.resolve(r.scope_id))fail('REQUIREMENT_SCOPE_MISSING',r.id,'scope_id');
 for(const seq of ir.sequences??[]){ref(seq.template);ref(seq.task);if(nodes.get(seq.template.id)?.kind!=='TEMPLATE'||nodes.get(seq.task.id)?.kind!=='TASK')fail('SEQUENCE_BINDING',seq.template.id);if(nodes.get(seq.template.id).owner_id!==seq.task.id)fail('SEQUENCE_OWNER',seq.template.id);for(const s of seq.source_refs)if(!sources.has(s))fail('SOURCE_REF_MISSING',seq.template.id,s);}
 if(new Set((ir.sequences??[]).map(s=>s.template.id)).size!==(ir.sequences??[]).length)fail('DUPLICATE_SEQUENCE_DECLARATION');
 for(const seq of ir.sequences??[])if([...nodes.keys()].some(id=>id.startsWith(seq.template.id+'@')))fail('INSTANCE_IDENTITY_COLLISION',seq.template.id);
 const types=new Map(),dimensions=new Map();
 const type=(r,stack=[])=>{
  r=ref(r);if(types.has(r.id))return types.get(r.id);if(stack.includes(r.id))fail('EXPRESSION_CYCLE',r.id);if(stack.length>maxDepth)fail('IR_DEPTH_LIMIT',r.id,null,'RESOURCE');const n=nodes.get(r.id),args=n.arguments??[],ts=args.map(a=>type(a,[...stack,r.id]));let t;
  if(r.kind==='ENTITY')t='OBJECT';else if(r.kind==='EVENT')t='EVENT';else if(r.kind==='STATE')t='STATE';else if(r.kind==='VARIABLE')t=n.type;else if(r.kind==='REQUIREMENT')t='BOOLEAN';
  else{const sig=registry[n.operator];if(!sig)fail('OPERATOR_UNKNOWN',n.id);if(args.length<sig.min||sig.max!==null&&args.length>sig.max)fail('OPERATOR_ARITY',n.id);t=sig.output;
   const numeric=t=>['INTEGER','REAL','NUMBER','TIME'].includes(t),set=t=>['SET','EVENT_DOMAIN','DOMAIN'].includes(t);
   const require=(v,code='OPERAND_TYPE')=>{if(!v)fail(code,n.id,'arguments','TYPE',{types:ts});};
   if(['AND','OR','NOT','IMPLIES','IFF'].includes(n.operator))require(ts.every(t=>t==='BOOLEAN'));
   if(['LT','LTE','GT','GTE','ADD','BEFORE'].includes(n.operator))require(ts.every(numeric));
   if(['INTEGER_RANGE','REAL_INTERVAL'].includes(n.operator))require(ts.every(numeric));
   if(n.operator==='EQ')require(ts[0]===ts[1]||ts.every(numeric));
   if(['UNION','INTERSECTION','DIFFERENCE'].includes(n.operator)){require(ts.every(set));if(ts.every(t=>t==='EVENT_DOMAIN'))t='EVENT_DOMAIN';}
   if(n.operator==='SUBSET')require(ts.every(set));if(n.operator==='MEMBER')require(set(ts[1]));
   if(n.operator==='CARDINALITY')require(set(ts[0]));if(n.operator==='TASK_EVENTS'||n.operator==='TASK_EXTERNAL_INPUTS')require(ts[0]==='EVENT'&&nodes.get(ref(args[0]).id)?.kind==='TASK');
   if(['EVENT_OCCURRED','EVENT_START','EVENT_END','PREVIOUS_INSTANCE','OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF'].includes(n.operator))require(ts[0]==='EVENT');
   if(['STATE_VALUE','STATE_ESTABLISHED'].includes(n.operator))require(ts[0]==='STATE');
   if(['OPERATION_OF','ACTORS_OF','TARGETS_OF','RECIPIENTS_OF','EVENT_COMPLETED','EVENT_SUCCEEDED','ACTIVE_DURING','ACTIVE_SINCE'].includes(n.operator))require(ts[0]==='EVENT');
   if(['ACTIVE_DURING','ACTIVE_SINCE'].includes(n.operator))require(ts.slice(1).every(numeric));
   if(['RECEIVED_ANY','RECEIVED_COMPLETE'].includes(n.operator))require(ts[0]==='OBJECT'&&ts[1]==='OBJECT'&&(ts.length===2||ts[2]==='EVENT'));
   if(n.operator==='SELECT_EVENTS')require(ts[0]==='EVENT_DOMAIN'&&ts[1]==='BOOLEAN'&&n.bound_variable?.kind==='VARIABLE'&&nodes.get(n.bound_variable.id).type==='EVENT');
   if(n.operator==='COUNT_STARTED')require(ts[0]==='EVENT_DOMAIN');
   if(n.operator==='SYMBOL')require(typeof n.literal==='string');
   if(n.operator==='BOOLEAN')require(typeof n.literal==='boolean');
   if(['TRUE_AT_START','IMMEDIATE_AFTER'].includes(n.operator))require(ts[0]==='STATE'&&ts[1]==='EVENT');
   if(n.operator==='NUMBER'){rational(n.literal);dimensions.set(n.id,dimension(n.unit));}
   if(n.operator==='EVENT_INSTANCE')require(ts[0]==='EVENT'&&nodes.get(args[0].id)?.kind==='TEMPLATE'&&numeric(ts[1]));
   if(['FORALL','EXISTS'].includes(n.operator)){require(set(ts[0])&&ts[1]==='BOOLEAN'&&n.bound_variable?.kind==='VARIABLE');}
  }
  types.set(r.id,t);return t;
 };
 for(const [id,k]of kinds)type({kind:k,id});
 const same=(a,b)=>a==='EMPTY'||b==='EMPTY'||a===b||['INTEGER','REAL','NUMBER'].includes(a)&&['INTEGER','REAL','NUMBER'].includes(b);
 const element=(r,seen=new Set())=>{
  r=ref(r);if(seen.has(r.id))fail('DOMAIN_CYCLE',r.id);seen=new Set([...seen,r.id]);const n=nodes.get(r.id),op=n.operator;
  if(['TASK_EVENTS','SELECT_EVENTS'].includes(op))return 'EVENT';if(op==='INTEGER_RANGE')return 'INTEGER';if(op==='REAL_INTERVAL')return 'REAL';
  if(['GROUP_MEMBERS','TASK_EXTERNAL_INPUTS','ACTORS_OF','TARGETS_OF','RECIPIENTS_OF'].includes(op))return 'OBJECT';
  if(op==='SET'){const ts=n.arguments.map(a=>type(a));if(ts.some(t=>!same(t,ts[0])))fail('HETEROGENEOUS_SET',n.id);return ts[0]??'EMPTY';}
  if(['UNION','INTERSECTION','DIFFERENCE'].includes(op)){const ts=n.arguments.map(a=>element(a,seen)).filter(t=>t!=='EMPTY');if(ts.some(t=>!same(t,ts[0])))fail('SET_ELEMENT_TYPE',n.id);return ts[0]??'EMPTY';}
  fail('DOMAIN_ELEMENT_TYPE',r.id);
 };
 for(const n of ir.expressions){
  if(['SET','UNION','INTERSECTION','DIFFERENCE'].includes(n.operator))element({kind:'EXPRESSION',id:n.id});
  if(n.operator==='MEMBER'&&!same(type(n.arguments[0]),element(n.arguments[1])))fail('MEMBER_ELEMENT_TYPE',n.id);
  if(n.operator==='SUBSET'&&!same(element(n.arguments[0]),element(n.arguments[1])))fail('SET_ELEMENT_TYPE',n.id);
  if(n.bound_variable&&!registry[n.operator].binder)fail('UNEXPECTED_BINDER',n.id);
  if(registry[n.operator].binder&&!same(nodes.get(n.bound_variable.id).type,element(n.arguments[0])))fail('BINDER_ELEMENT_TYPE',n.id);
  if(ir.contract_version==='candidate-ir/2.0'&&n.literal!==null&&!['BOOLEAN','NUMBER','SYMBOL','TASK_EVENTS'].includes(n.operator))fail('UNEXPECTED_LITERAL',n.id);
 }
 for(const r of ir.requirements){if(type(r.body)!=='BOOLEAN'||r.applicability&&type(r.applicability)!=='BOOLEAN')fail('REQUIREMENT_BOOLEAN_REQUIRED',r.id);}
 for(const v of ir.variables){if(!scope.resolve(v.scope_id)&&!(kinds.get(v.scope_id)==='EVENT'&&scope.resolve(nodes.get(v.scope_id).owner_id)))fail('VARIABLE_SCOPE_MISSING',v.id);const t=type(v.domain);if(!['SET','DOMAIN','EVENT_DOMAIN'].includes(t)||!same(v.type,element(v.domain)))fail('VARIABLE_DOMAIN_TYPE',v.id);}
 const dim=(r,seen=new Set())=>{r=ref(r);if(dimensions.has(r.id))return dimensions.get(r.id);if(seen.has(r.id))fail('EXPRESSION_CYCLE',r.id);seen=new Set([...seen,r.id]);const n=nodes.get(r.id);let d='SCALAR';if(['EVENT_START','EVENT_END','STATE_ESTABLISHED'].includes(n.operator))d='TIME';else if(n.operator==='ADD'){const ds=n.arguments.map(a=>dim(a,seen));if(new Set(ds).size!==1)fail('UNIT_DIMENSION_MISMATCH',n.id);d=ds[0];}else if(r.kind==='VARIABLE'&&['INTEGER','REAL'].includes(n.type)){const domain=nodes.get(n.domain.id);if(domain?.arguments?.[0])d=dim(domain.arguments[0],seen);}dimensions.set(r.id,d);return d;};
 for(const n of ir.expressions){if(['EQ','LT','LTE','GT','GTE','BEFORE','ADD','REAL_INTERVAL','INTEGER_RANGE'].includes(n.operator)&&n.arguments.every(a=>['INTEGER','REAL','NUMBER','TIME'].includes(type(a)))){const ds=n.arguments.map(a=>dim(a));if(new Set(ds).size!==1)fail('UNIT_DIMENSION_MISMATCH',n.id);}dim({kind:'EXPRESSION',id:n.id});}
 for(const n of ir.expressions)if(n.operator==='BEFORE'||['ACTIVE_DURING','ACTIVE_SINCE'].includes(n.operator)){const args=n.operator==='BEFORE'?n.arguments:n.arguments.slice(1);if(args.some(a=>dim(a)!=='TIME'))fail('TIME_UNIT_REQUIRED',n.id);}
 const checkBound=(r,env=new Set(),stack=[])=>{r=ref(r);const n=nodes.get(r.id);if(r.kind==='VARIABLE'){if(n.binding_mode==='INSTANCE_LOCAL'&&!env.has(n.id))fail('FREE_LOCAL_VARIABLE',n.id);return;}if(!['EXPRESSION','STATE'].includes(r.kind))return;if(stack.includes(r.id))fail('EXPRESSION_CYCLE',r.id);const next=[...stack,r.id];if(n.subject)checkBound(n.subject,env,next);if(n.bound_variable){checkBound(n.arguments[0],env,next);const inner=new Set(env);inner.add(n.bound_variable.id);for(const a of n.arguments.slice(1))checkBound(a,inner,next);}else for(const a of n.arguments??[])checkBound(a,env,next);};
 for(const r of ir.requirements){checkBound(r.body);if(r.applicability)checkBound(r.applicability);}
 return {...loaded,nodes,kinds,types,dimensions,root,scope,ref};
}
