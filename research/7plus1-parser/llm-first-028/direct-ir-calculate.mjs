// Candidate AST -> mathematical constraints. No task-text, note or label interpretation.
import {solveJointBoundary} from '../../../src/bxp/joint-boundary-solver.mjs';
import {intersectValidatedIntervals} from '../../../src/bxp/interval-solver.mjs';
import {sha256} from './source.mjs';
import {evaluateDirectEventPolicies} from './direct-ir-event-policy.mjs';
import {directMathSummary} from './direct-ir-math-summary.mjs';
import {evaluateDirectInputPolicies,taskMembership} from './direct-ir-input-policy.mjs';
const refkey=r=>r.kind+':'+r.id,unique=a=>[...new Set(a)];
const all=xs=>xs.includes(false)?false:xs.filter(x=>x!==true).length?{all:xs.filter(x=>x!==true)}:true;
const any=xs=>xs.includes(true)?true:xs.filter(x=>x!==false).length?{any:xs.filter(x=>x!==false)}:false;
export function calculateDirectIR(ir,acceptance,{observations={}}={}){
 const index=new Map(['entities','variables','events','states','expressions','requirements'].flatMap(k=>ir[k].map(x=>[x.id,x])));
 const rows=new Map(acceptance.rows.map(x=>[x.id,x])),constraints=[],orders=[],intervalInputs=[],domains={},atoms=new Map(),gaps=[],stateChecks=[],statesSeen=new Map(),instances=new Map(),quantifiedRules=[],priorityRules=[],roleChoices=new Map();
 const add=(id,formula,rule,source_refs=[])=>constraints.push({id,formula,rule,source_refs});
 const atom=(key,meaning)=>{const id='ir:'+sha256(JSON.stringify(key)).slice(0,24);atoms.set(id,{id,meaning});return {var:id};};
 const node=r=>{const n=index.get(r.id);if(!n)throw Error('IR_REFERENCE_MISSING:'+r.id);return n;};
 const expression=r=>{if(r.kind!=='EXPRESSION')throw Error('IR_EXPRESSION_EXPECTED:'+r.id);return node(r);};
 const numeric=(r,ctx)=>terms(r,ctx).map(x=>{if(typeof x.value!=='number')throw Error('NUMERIC_VALUE_EXPECTED');return x;});
 const event=(r,ctx)=>{
  if(r.kind==='VARIABLE'&&Object.hasOwn(ctx,r.id))return event({kind:'EVENT',id:ctx[r.id]},ctx);
  if(r.kind==='EVENT'){const n=node(r);if(n.kind==='TEMPLATE')throw Error('TEMPLATE_INSTANCE_REQUIRED:'+n.id);instances.set(n.id,{key:n.id,event:n});return {key:n.id,event:n};}
  const x=expression(r);
  if(x.operator==='EVENT_INSTANCE'){const t=node(x.arguments[0]),values=numeric(x.arguments[1],ctx);if(t.kind!=='TEMPLATE'||values.length!==1||values[0].guard!==true||!Number.isSafeInteger(values[0].value)||values[0].value<0)throw Error('INSTANCE_INDEX_NOT_FIXED_NONNEGATIVE_INTEGER');const key=t.id+'@'+values[0].value;const e={key,event:t,index:values[0].value};instances.set(key,e);return e;}
  if(x.operator==='PREVIOUS_INSTANCE'){const e=event(x.arguments[0],ctx);if(e.index===undefined||e.index===0)throw Error('PREVIOUS_INSTANCE_OUTSIDE_SEQUENCE');const key=e.event.id+'@'+(e.index-1),out={key,event:e.event,index:e.index-1};instances.set(key,out);return out;}
  throw Error('NOT_EVENT_EXPRESSION:'+x.id);
 };
 const patterns=new Map();
 const occurred=(r,ctx)=>{if(r.kind==='EVENT'&&node(r).kind==='TEMPLATE'){patterns.set(r.id,node(r));return atom(['PATTERN',r.id],{kind:'PATTERN_OCCURRED',event_id:r.id});}const e=event(r,ctx);return atom(['EVENT',e.key],{kind:'EVENT_OCCURRED',event_id:e.event.id,instance:e.index??null});};
 const finiteDomain=(r,ctx)=>{
  const x=expression(r);
  if(x.operator==='SET')return x.arguments.flatMap(a=>terms(a,ctx));
  if(x.operator==='GROUP_MEMBERS'){const g=node(x.arguments[0]);if(g.kind!=='GROUP')throw Error('GROUP_TYPE_REQUIRED');return g.members.flatMap(a=>terms(a,ctx));}
  if(x.operator==='TASK_EXTERNAL_INPUTS'){
   const scope=x.arguments[0].id,out=[];
   for(const use of ir.requirements.filter(r=>r.kind==='DATA_USE')){
    const d=use.data_use,consumer=event(d.consumer,ctx),member=taskMembership(ir,consumer.event.owner_id,scope);
    if(member===false)continue;if(member===null)throw Error('INPUT_USE_SCOPE_UNKNOWN');
    if(d.origin==='UNSTATED')throw Error('INPUT_ORIGIN_UNSTATED');if(d.origin!=='EXTERNAL')continue;
    for(const t of terms(d.object,ctx))out.push({...t,guard:all([t.guard,occurred(d.consumer,ctx)])});
   }
   return out;
  }
  if(['UNION','INTERSECTION','DIFFERENCE'].includes(x.operator)){const sets=x.arguments.map(a=>finiteDomain(a,ctx));if(sets.some(s=>s.some(a=>a.guard!==true)))throw Error('DYNAMIC_SET_OPERATION_NOT_IMPLEMENTED');const a=unique(sets[0].map(v=>v.value));const out=x.operator==='UNION'?unique(sets.flatMap(s=>s.map(v=>v.value))):x.operator==='INTERSECTION'?a.filter(v=>sets.every(s=>s.some(x=>x.value===v))):a.filter(v=>!sets[1].some(x=>x.value===v));return out.map(value=>({value,guard:true}));}
  if(x.operator==='INTEGER_RANGE'){const lo=numeric(x.arguments[0],ctx),hi=numeric(x.arguments[1],ctx),out=[];for(const a of lo)for(const b of hi){if(!Number.isSafeInteger(a.value)||!Number.isSafeInteger(b.value)||b.value-a.value>16)throw Error('INTEGER_DOMAIN_CAPACITY_OR_TYPE');for(let n=a.value;n<=b.value;n++)out.push({value:n,guard:all([a.guard,b.guard])});}return out;}
  throw Error('FINITE_DOMAIN_NOT_IMPLEMENTED:'+x.operator);
 };
 const terms=(r,ctx={})=>{
  if(r.kind==='ENTITY')return [{value:r.id,guard:true}];
  if(r.kind==='EVENT')return [{value:'EVENT:'+r.id,guard:true}];
  if(r.kind==='VARIABLE'){
   if(Object.hasOwn(ctx,r.id))return [{value:ctx[r.id],guard:true}];if(domains[r.id])return domains[r.id];const v=node(r);if(expression(v.domain).operator==='REAL_INTERVAL')throw Error('CONTINUOUS_TERM_REQUIRES_DIRECT_BOUND');
   const possible=finiteDomain(v.domain,ctx);if(possible.some(x=>x.guard!==true))throw Error('DYNAMIC_VARIABLE_DOMAIN_NOT_IMPLEMENTED');if(v.type==='INTEGER'&&possible.some(x=>!Number.isSafeInteger(x.value)))throw Error('INTEGER_DOMAIN_TYPE');const values=unique(possible.map(x=>x.value));if(values.length>16)throw Error('FINITE_VARIABLE_CAPACITY');
   const choices=values.map(value=>({value,guard:atom(['VALUE',v.id,value],{kind:'VARIABLE_VALUE',variable_id:v.id,value})}));domains[r.id]=choices;add('domain:'+v.id,any(choices.map(x=>x.guard)),'FINITE_VARIABLE_HAS_ONE_VALUE',v.source_refs);for(let a=0;a<choices.length;a++)for(let b=a+1;b<choices.length;b++)add('exclusive:'+v.id+':'+a+':'+b,{not:all([choices[a].guard,choices[b].guard])},'FINITE_VARIABLE_SINGLE_BINDING',v.source_refs);return choices;
  }
  const x=expression(r);
  if(x.operator==='NUMBER')return [{value:x.literal,guard:true}];
  if(x.operator==='BOOLEAN')return [{value:x.literal,guard:true}];
  if(x.operator==='CARDINALITY'){const d=finiteDomain(x.arguments[0],ctx);if(d.some(v=>v.guard!==true))throw Error('DYNAMIC_CARDINALITY_NOT_IMPLEMENTED');return [{value:unique(d.map(v=>v.value)).length,guard:true}];}
  if(x.operator==='ADD'){let out=[{value:0,guard:true}];for(const a of x.arguments){const d=numeric(a,ctx);out=out.flatMap(l=>d.map(r=>({value:l.value+r.value,guard:all([l.guard,r.guard])})));if(out.length>128)throw Error('ARITHMETIC_PRODUCT_CAPACITY');}return out;}
  if(['OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF'].includes(x.operator)){const e=event(x.arguments[0],ctx),rs=e.event.roles.filter(a=>x.operator==='RECIPIENT_OF'?a.role==='RECIPIENT':x.operator==='ENVIRONMENT_OF'?a.role==='ENVIRONMENT':['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE'].includes(a.role));
   if(!rs.length&&x.operator==='ENVIRONMENT_OF'){const key=e.key+':ENVIRONMENT';if(!roleChoices.has(key)){const ids=ir.entities.filter(n=>n.kind==='ENVIRONMENT').map(n=>n.id);if(!ids.length)throw Error('ENVIRONMENT_VALUE_DOMAIN_MISSING');const choices=ids.map(value=>({value,guard:atom(['WITNESS_ROLE',key,value],{kind:'WITNESS_ROLE',event_id:e.key,role:'ENVIRONMENT',value})}));roleChoices.set(key,choices);add('role-domain:'+key,any(choices.map(c=>c.guard)),'CONSTRUCTIVE_ROLE_VALUE',x.source_refs);for(let a=0;a<choices.length;a++)for(let b=a+1;b<choices.length;b++)add('role-unique:'+key+':'+a+':'+b,{not:all([choices[a].guard,choices[b].guard])},'CONSTRUCTIVE_ROLE_SINGLE_VALUE',x.source_refs);}return roleChoices.get(key);}
   if(rs.length!==1)throw Error('SINGLE_ROLE_VALUE_REQUIRED');return terms(rs[0].value,ctx);}
  throw Error('TERM_NOT_IMPLEMENTED:'+x.operator);
 };
 const stateValue=(r,ctx)=>{
  const s=node(r);if(r.kind!=='STATE')throw Error('STATE_EXPECTED');const e=s.subject&&['EVENT','EXPRESSION'].includes(s.subject.kind)?event(s.subject,ctx):null;
  const key=s.id+(e?'@'+e.key:''),v=atom(['STATE',key],{kind:'STATE',state_id:s.id,instance:e?.index??null}),point='state:'+key;
  if(!statesSeen.has(key)){statesSeen.set(key,{state:s,value:v,point,event:e});if(e){const occur=occurred(s.subject,ctx);if(['SUCCESS','FAILURE','COMPLETION','CONTROL_EFFECT'].includes(s.kind))add('state-occur:'+key,{implies:[v,occur]},'TYPED_STATE_REQUIRES_EVENT',s.source_refs);if(s.kind==='COMPLETION')orders.push({id:'completion-end:'+key,from:e.key+':end',to:point,relation:'LTE',guard:v});
    orders.push({id:'state-start:'+key,from:e.key+':start',to:point,relation:'LTE',guard:v},{id:'state-end:'+key,from:point,to:e.key+':end',relation:'LTE',guard:v});}}
  return {value:v,point,key};
 };
 const time=(r,ctx)=>{const x=expression(r);if(x.operator==='STATE_ESTABLISHED')return stateValue(x.arguments[0],ctx).point;const e=event(x.arguments[0],ctx);if(x.operator==='EVENT_START')return e.key+':start';if(x.operator==='EVENT_END')return e.key+':end';throw Error('TIME_POINT_REQUIRED');};
 const compare=(operator,a,b)=>({EQ:()=>a===b,LT:()=>a<b,LTE:()=>a<=b,GT:()=>a>b,GTE:()=>a>=b})[operator]();
 const bool=(r,ctx={})=>{
  if(r.kind==='VARIABLE'){const v=node(r);if(v.type!=='BOOLEAN')throw Error('BOOLEAN_VARIABLE_REQUIRED');return any(terms(r,ctx).filter(x=>x.value===true).map(x=>x.guard));}
  const x=expression(r),args=x.arguments;
  if(x.operator==='BOOLEAN')return x.literal;
  if(['AND','OR'].includes(x.operator))return x.operator==='AND'?all(args.map(a=>bool(a,ctx))):any(args.map(a=>bool(a,ctx)));
  if(x.operator==='NOT')return {not:bool(args[0],ctx)};
  if(x.operator==='IMPLIES')return {implies:args.map(a=>bool(a,ctx))};
  if(x.operator==='IFF'){const [a,b]=args.map(a=>bool(a,ctx));return all([{implies:[a,b]},{implies:[b,a]}]);}
  if(x.operator==='EQ'&&args.every(a=>a.kind==='EXPRESSION'&&['SET','GROUP_MEMBERS','UNION','INTERSECTION','DIFFERENCE'].includes(expression(a).operator))){const [a,b]=args.map(r=>finiteDomain(r,ctx));const subset=(l,r)=>all(l.map(v=>({implies:[v.guard,any(r.filter(x=>x.value===v.value).map(x=>x.guard))]})));return all([subset(a,b),subset(b,a)]);}
  if(['EQ','LT','LTE','GT','GTE'].includes(x.operator)&&args.every(a=>a.kind==='EXPRESSION'&&['EVENT_START','EVENT_END','STATE_ESTABLISHED'].includes(expression(a).operator))){
   const left=time(args[0],ctx),right=time(args[1],ctx),v=atom(['TIME_COMPARE',x.id,ctx],{kind:'TIME_COMPARE',operator:x.operator,left,right});
   const edge=(suffix,from,to,relation,guard)=>orders.push({id:'time:'+x.id+':'+suffix,from,to,relation,guard});
   if(x.operator==='EQ'){edge('equal-forward',left,right,'LTE',v);edge('equal-backward',right,left,'LTE',v);const direction=atom(['TIME_NEQ_DIRECTION',x.id,ctx],{kind:'TIME_ORDER_CHOICE'});edge('unequal-forward',left,right,'LT',all([{not:v},direction]));edge('unequal-backward',right,left,'LT',all([{not:v},{not:direction}]));}
   else{const reverse=['GT','GTE'].includes(x.operator),a=reverse?right:left,b=reverse?left:right;edge('true',a,b,['LT','GT'].includes(x.operator)?'LT':'LTE',v);edge('false',b,a,['LT','GT'].includes(x.operator)?'LTE':'LT',{not:v});}return v;
  }
  if(['EQ','LT','LTE','GT','GTE'].includes(x.operator))return any(terms(args[0],ctx).flatMap(a=>terms(args[1],ctx).map(b=>all([a.guard,b.guard,compare(x.operator,a.value,b.value)]))));
  if(x.operator==='MEMBER'){const d=finiteDomain(args[1],ctx);return any(terms(args[0],ctx).flatMap(a=>d.map(b=>all([a.guard,b.guard,a.value===b.value]))));}
  if(x.operator==='SUBSET'){const a=finiteDomain(args[0],ctx),b=finiteDomain(args[1],ctx);return all(a.map(x=>({implies:[x.guard,any(b.filter(y=>y.value===x.value).map(y=>y.guard))]})));}
  if(x.operator==='EVENT_OCCURRED')return occurred(args[0],ctx);
  if(x.operator==='STATE_VALUE')return stateValue(args[0],ctx).value;
  if(x.operator==='IMMEDIATE_AFTER'){const s=stateValue(args[0],ctx),e=event(args[1],ctx),v=atom(['PRIORITY_RESPONSE',x.id,ctx],{kind:'PRIORITY_RESPONSE',state:s.key,event:e.key});orders.push({id:'priority:'+x.id,from:s.point,to:e.key+':start',relation:'LTE',guard:v});const target=e.event.operation==='STOP'?e.event.roles.find(r=>r.role==='OBJECT'&&r.value.kind==='EVENT'&&node(r.value).kind==='TASK'):null;priorityRules.push({id:x.id,state_point:s.point,event:e.key,scope_id:target?.value.id??e.event.owner_id,guard:v,source_refs:x.source_refs,interpretation:'Qualitative priority response; no numerical delay asserted'});return v;}
  if(x.operator==='TRUE_AT_START'){const s=stateValue(args[0],ctx),e=event(args[1],ctx),local=atom(['STATE_AT_START',s.key,e.key],{kind:'STATE_AT_START',state:s.key,event:e.key}),guard=occurred(args[1],ctx);
   add('local-state:'+x.id+':'+e.key,{implies:[local,s.value]},'STATE_AT_START_REQUIRES_GLOBAL_STATE',x.source_refs);orders.push({id:'already:'+x.id+':'+e.key,from:s.point,to:e.key+':start',relation:'LTE',guard:all([guard,local])},{id:'later:'+x.id+':'+e.key,from:e.key+':start',to:s.point,guard:all([guard,s.value,{not:local}])});stateChecks.push({id:x.id+':'+e.key,global_variable:s.value.var,local_variable:local.var,state_point:s.point,event_start:e.key+':start',guard});return local;}
  if(x.operator==='BEFORE'){const v=atom(['ORDER',x.id,ctx],{kind:'ORDER'});orders.push({id:x.id+':'+sha256(JSON.stringify(ctx)).slice(0,8),from:time(args[0],ctx),to:time(args[1],ctx),guard:v});return v;}
  if(['FORALL','EXISTS'].includes(x.operator)){if(expression(args[0]).operator==='TASK_EVENTS'){
   if(x.operator!=='FORALL')throw Error('OPEN_EVENT_EXISTENTIAL_NOT_IMPLEMENTED');const scope=expression(args[0]).arguments[0].id;
   const belongs=e=>{let id=e.owner_id;const seen=new Set();while(id&&!seen.has(id)){if(id===scope)return true;seen.add(id);const parent=index.get(id);if(parent?.kind!=='TASK')return false;id=parent.owner_id;}return false;};
   const candidates=ir.events.filter(e=>e.kind==='ACTION'&&e.use==='CURRENT_TASK'&&e.layer==='MAIN'&&belongs(e));
   if(ir.events.some(e=>e.kind==='TEMPLATE'&&e.use==='CURRENT_TASK'&&belongs(e)&&ir.requirements.some(r=>r.subject?.id===e.id&&r.modality==='REQUIRED')))throw Error('UNBOUNDED_REQUIRED_TEMPLATE_WITNESS_NOT_IMPLEMENTED');
   quantifiedRules.push({expression_id:x.id,domain:args[0],bound_variable:x.bound_variable,body:args[1],source_refs:x.source_refs,witness_scope:'ALL_ACTUAL_EVENTS_OF_CONSTRUCTED_TRACE',future_query_consumer:'evaluateDirectEventPolicies'});
   return all(candidates.map(e=>({implies:[occurred({kind:'EVENT',id:e.id},ctx),bool(args[1],{...ctx,[x.bound_variable.id]:e.id})]})));
  }const d=finiteDomain(args[0],ctx),values=d.map(v=>({implies:[v.guard,bool(args[1],{...ctx,[x.bound_variable.id]:v.value})]}));return x.operator==='FORALL'?all(values):any(d.map(v=>all([v.guard,bool(args[1],{...ctx,[x.bound_variable.id]:v.value})])));}
  throw Error('BOOLEAN_OPERATOR_NOT_IMPLEMENTED:'+x.operator);
 };
 const bound=(r,requirement)=>{
  const x=expression(r);if(x.operator==='AND'){for(const a of x.arguments)if(!bound(a,requirement))return false;return true;}
  if(x.operator==='MEMBER'&&x.arguments[0].kind==='VARIABLE'){const v=node(x.arguments[0]),d=expression(x.arguments[1]);if(v.type==='REAL'&&d.operator==='REAL_INTERVAL'){const [lo,hi]=d.arguments.map(a=>expression(a));if(lo.operator!=='NUMBER'||hi.operator!=='NUMBER')return false;intervalInputs.push({id:requirement.id+':'+x.id,scope_id:v.scope_id,subject:v.id,dimension:v.id,unit:d.unit,domain:'real',lower:{value:String(lo.literal),inclusive:true},upper:{value:String(hi.literal),inclusive:true}});return true;}}
  if(!['EQ','GT','GTE','LT','LTE'].includes(x.operator)||x.arguments[0].kind!=='VARIABLE')return false;
  const v=node(x.arguments[0]);if(v.type!=='REAL')return false;const n=expression(x.arguments[1]);if(n.operator!=='NUMBER')return false;const d=expression(v.domain);if(d.operator!=='REAL_INTERVAL')return false;
  const b={value:String(n.literal),inclusive:['EQ','LTE','GTE'].includes(x.operator)};intervalInputs.push({id:requirement.id+':'+x.id,scope_id:v.scope_id,subject:v.id,dimension:v.id,unit:d.unit,domain:'real',lower:['EQ','GT','GTE'].includes(x.operator)?b:null,upper:['EQ','LT','LTE'].includes(x.operator)?b:null});return true;
 };
 if(!acceptance.technical_ok)gaps.push({reason:'DIRECT_IR_TECHNICAL_FAILURE'});
 for(const row of acceptance.rows)if(row.status!=='ACCEPTED')gaps.push({node_id:row.id,reason:'IR_NODE_'+row.status});
 for(const d of acceptance.diagnostics)gaps.push({reason:d.code});
 for(const v of ir.variables){try{const d=expression(v.domain);if(d.operator==='REAL_INTERVAL'){const [lo,hi]=d.arguments.map(a=>expression(a));if(lo.operator!=='NUMBER'||hi.operator!=='NUMBER'||!d.unit)throw Error('REAL_DOMAIN_LITERAL_UNIT_REQUIRED');intervalInputs.push({id:'domain:'+v.id,scope_id:v.scope_id,subject:v.id,dimension:v.id,unit:d.unit,domain:'real',lower:{value:String(lo.literal),inclusive:true},upper:{value:String(hi.literal),inclusive:true}});}else if(v.binding_mode!=='INSTANCE_LOCAL')terms({kind:'VARIABLE',id:v.id},{});}catch(e){gaps.push({node_id:v.id,reason:e.message});}}
 for(const r of ir.requirements){try{if(rows.get(r.id)?.status!=='ACCEPTED')continue;if(r.kind==='DATA_USE'){const d=r.data_use,consumer=event(d.consumer,{});if(d.producer){const producer=event(d.producer,{});add('data-producer:'+r.id,{implies:[occurred(d.consumer,{}),occurred(d.producer,{})]},'DECLARED_DATA_PRODUCER_REQUIRED_AT_USE',r.source_refs);orders.push({id:'data-use:'+r.id,from:producer.key+(d.availability==='COMPLETE_RESULT'?':end':':start'),to:consumer.key+':start',relation:'LTE',guard:occurred(d.consumer,{})});}else{const available=any(terms(d.object,{}).map(v=>all([v.guard,atom(['DATA_AVAILABLE',v.value,consumer.key,d.availability],{kind:'DATA_AVAILABLE_AT_USE',object_id:v.value,consumer:consumer.key,availability:d.availability})])));add('external-data:'+r.id,{implies:[occurred(d.consumer,{}),available]},'DECLARED_DATA_USE_AVAILABILITY',r.source_refs);}}
   if(['PERMITTED','NOT_REQUIRED','UNSTATED'].includes(r.modality))continue;
   if(['CONSTRAINT','TOTAL_DURATION'].includes(r.kind)&&r.modality==='REQUIRED'&&!r.applicability&&bound(r.body,r))continue;
   const body=bool(r.body),f=['EVENT_NORM','STOP'].includes(r.kind)?all([occurred(r.subject,{}),body]):body,ap=r.applicability?bool(r.applicability):true;if(r.modality==='REQUIRED')add(r.id,{implies:[ap,f]},'DECLARED_IR_REQUIREMENT',r.source_refs);else if(r.modality==='FORBIDDEN')add(r.id,{implies:[ap,{not:f}]},'DECLARED_IR_PROHIBITION',r.source_refs);
  }catch(e){gaps.push({node_id:r.id,reason:e.message});}}
 for(const e of instances.values()){const v=atom(['EVENT',e.key],{kind:'EVENT_OCCURRED',event_id:e.event.id,instance:e.index??null});orders.push({id:'lifecycle:'+e.key,from:e.key+':start',to:e.key+':end',relation:'LTE',guard:v});}
 for(const e of instances.values()){if(e.event.kind!=='ACTION')continue;let owner=e.event.owner_id;const seen=new Set();while(!seen.has(owner)&&index.get(owner)?.kind==='TASK'){seen.add(owner);const scope=index.get(owner),guard=occurred({kind:'EVENT',id:e.event.id},{});orders.push({id:'scope-start:'+owner+':'+e.key,from:owner+':start',to:e.key+':start',relation:'LTE',guard},{id:'scope-end:'+owner+':'+e.key,from:e.key+':end',to:owner+':end',relation:'LTE',guard});if(scope.owner_id===owner)break;owner=scope.owner_id;}}
 for(const p of priorityRules)for(const e of instances.values()){if(e.event.kind!=='ACTION'||taskMembership(ir,e.event.owner_id,p.scope_id)!==true||['STOP','REPORT'].includes(e.event.operation)||e.key===p.event)continue;const side=atom(['PRIORITY_SIDE',p.id,e.key],{kind:'PRIORITY_ORDER_CHOICE'}),guard=all([p.guard,occurred({kind:'EVENT',id:e.event.id},{})]);orders.push({id:'priority-before:'+p.id+':'+e.key,from:e.key+':start',to:p.state_point,relation:'LTE',guard:all([guard,side])},{id:'priority-after:'+p.id+':'+e.key,from:p.event+':start',to:e.key+':start',relation:'LTE',guard:all([guard,{not:side}])});}
 // Exact structural pattern matching: operation, explicit roles, owner and actor.
 // It never infers an operation or entity from label/note/source text.
 for(const [id,p]of patterns)for(const e of instances.values()){
  if(e.event.kind==='TASK'||e.event.kind==='REFERENCE'||e.event.use==='MENTION_ONLY'||e.event.layer!=='MAIN')continue;
  if(p.operation_extent!=='EXACT'||e.event.operation_extent!=='EXACT'){gaps.push({node_id:id,reason:'OPEN_OPERATION_PATTERN_NOT_COMPUTABLE'});continue;}
  if(p.operation!==e.event.operation||p.owner_id!==e.event.owner_id)continue;
  const matches=[];let unknown=false;
  for(const r of p.roles){const candidates=e.event.roles.filter(v=>v.role===r.role);if(!candidates.length){unknown=true;break;}try{matches.push(any(terms(r.value,{}).flatMap(a=>candidates.flatMap(v=>terms(v.value,{}).map(b=>all([a.guard,b.guard,a.value===b.value]))))));}catch{unknown=true;break;}}
  if(unknown){gaps.push({node_id:id,event_id:e.key,reason:'PATTERN_ROLE_MEMBERSHIP_UNKNOWN'});continue;}
  add('pattern:'+id+':'+e.key,{implies:[all([atom(['EVENT',e.key],{kind:'EVENT_OCCURRED',event_id:e.event.id,instance:e.index??null}),...matches]),atom(['PATTERN',id],{kind:'PATTERN_OCCURRED',event_id:id})]},'EXACT_ROLE_BOUND_PATTERN_MEMBERSHIP',p.source_refs);
 }
 for(const [key,s]of statesSeen)if(['SUCCESS','FAILURE'].includes(s.state.kind)&&s.event)for(const [other,t]of statesSeen)if(other>key&&t.event?.key===s.event.key&&t.state.kind!==s.state.kind&&['SUCCESS','FAILURE'].includes(t.state.kind))add('outcome-exclusive:'+key+':'+other,{not:all([s.value,t.value])},'SUCCESS_AND_FAILURE_EXCLUSIVE');
 const intervals=intersectValidatedIntervals(intervalInputs),problem={variables:[...atoms.keys()],constraints,intervals:intervals.map((x,i)=>({...x,id:'numeric:'+i})),orders,domains:[],state_checks:stateChecks,variable_meanings:Object.fromEntries([...atoms].map(([id,x])=>[id,x.meaning])),temporal_horizons:[]};
 // Only an explicitly typed total-duration requirement enables horizon binding.
 for(const r of ir.requirements.filter(r=>r.kind==='TOTAL_DURATION')){
  const v=r.subject?.kind==='VARIABLE'?index.get(r.subject.id):null;
  if(r.scope_id!=='ROOT'||v?.type!=='REAL'||r.modality!=='REQUIRED'||r.applicability){gaps.push({node_id:r.id,reason:'TOTAL_DURATION_BINDING_REQUIRED'});continue;}
  for(const x of problem.intervals.filter(x=>x.subject===v.id))problem.temporal_horizons.push({interval_id:x.id,unit:x.unit,start_point:r.scope_id+':start',end_point:r.scope_id+':end'});
 }
 const result={format:'boundx-direct-ir-calculation/1',input_ir_sha256:sha256(JSON.stringify(ir)),mathematical_summary:directMathSummary(ir,acceptance),gaps,quantified_rules:quantifiedRules,priority_rules:priorityRules,finite_domains:Object.fromEntries(Object.entries(domains).map(([id,x])=>[id,x.map(v=>v.value)])),intervals,problem,observations_supplied:Object.keys(observations).length>0,business_decision:null,execution_authorization:null};
 if(Object.keys(observations).length){gaps.push({reason:'DIRECT_IR_OBSERVATION_BINDING_NOT_IMPLEMENTED'});}
 if(gaps.length)return {...result,status:'PARTIAL',joint:{status:'PARTIAL',base:{result:'unknown',witness:null}}};
 const completionQueries=[];
 try{for(const r of ir.requirements.filter(r=>r.kind==='COMPLETION'&&rows.get(r.id)?.status==='ACCEPTED')){const root=expression(r.body);if(root.operator!=='IFF')continue;const left=expression(root.arguments[0]);if(left.operator!=='STATE_VALUE')continue;const state=left.arguments[0],meaning=[...atoms].find(([,a])=>a.meaning.kind==='STATE'&&a.meaning.state_id===state.id);if(!meaning)continue;const extra={id:'query-complete:'+r.id,formula:{var:meaning[0]},rule:'EXPLICIT_COMPLETION_QUERY_NOT_ADDED_SOURCE_OBLIGATION',source_refs:r.source_refs};const query=solveJointBoundary({...problem,constraints:[...problem.constraints,extra]});completionQueries.push({requirement_id:r.id,assumption:{state_id:state.id,value:true},result:query.result,witness:query.witness,verification:query.verification,not_actual_completion:true,not_new_source_obligation:true});}
 const solved=solveJointBoundary(problem);const complete=completionQueries.find(q=>q.result==='satisfiable');if(complete){solved.witness=complete.witness;solved.verification=complete.verification;solved.selected_witness_scope='SOURCE_CONSTRAINTS_PLUS_EXPLICIT_COMPLETION_QUERY';}
 if(solved.result==='satisfiable'){const records=[];for(const [id,a]of atoms){if(a.meaning.kind!=='EVENT_OCCURRED'||!solved.witness.boolean[id])continue;const e=instances.get(a.meaning.event_id);if(e?.event.kind!=='ACTION')continue;const roles=Object.fromEntries(e.event.roles.filter(r=>r.value.kind==='ENTITY').map(r=>[r.role,r.value]));for(const choice of roleChoices.get(e.key+':ENVIRONMENT')??[])if(solved.witness.boolean[choice.guard.var])roles.ENVIRONMENT={kind:'ENTITY',id:choice.value};const external_inputs=ir.requirements.filter(r=>r.kind==='DATA_USE'&&r.data_use.origin==='EXTERNAL'&&r.data_use.consumer.id===e.key).map(r=>r.data_use.object);records.push({event_id:e.key,owner_id:e.event.owner_id,roles,external_inputs,role_values_are_witness_assignments:true});}
   const verification=records.map(record=>({record,check:evaluateDirectEventPolicies(ir,acceptance,record)}));if(verification.some(x=>x.check.results.some(r=>!['SATISFIED','NOT_APPLICABLE'].includes(r.result))))throw Error('QUANTIFIED_WITNESS_VERIFICATION_FAILED');const inputs=evaluateDirectInputPolicies(ir,acceptance,records);if(inputs.results.some(r=>r.result!=='SATISFIED'))throw Error('INPUT_BOUNDARY_WITNESS_VERIFICATION_FAILED');solved.witness.execution_trace=records;solved.input_boundary_verification=inputs;solved.quantified_verification={scope:'EVERY_EVENT_IN_THIS_CONSTRUCTED_EXECUTION_TRACE',checks:verification,future_execution_not_certified:true};
  }return {...result,completion_queries:completionQueries,status:solved.result==='satisfiable'?'CALCULATED':solved.result==='unsatisfiable'?'CONFLICT':'PARTIAL',joint:{status:solved.result==='satisfiable'?'PROVEN':solved.result==='unsatisfiable'?'UNSAT':'PARTIAL',base:solved}};}catch(e){return {...result,status:'PARTIAL',gaps:[...gaps,{reason:e.message,...(e.failed_checks?{failed_checks:e.failed_checks}:{})}],joint:{status:'PARTIAL',base:{result:'unknown',witness:null}}};}
}
