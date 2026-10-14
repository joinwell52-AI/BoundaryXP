import {preparePlan,taskContains} from './events.mjs';import {exact,toBase,stable,compare} from './values.mjs';import {fail} from './diagnostics.mjs';import {digest} from './load.mjs';
import {resolveInstance,instanceDefinition} from './instances.mjs';
export const bool=value=>({sort:'Bool',op:'const',value});
export const num=(value,sort='Real')=>({sort,op:'const',value:exact(value)});
export function term(op,args,sort='Bool'){
 if(op==='not'&&args[0].op==='const')return bool(!args[0].value);
 if(op==='and'||op==='or'){const absorbing=op==='and'?false:true;if(args.some(a=>a.op==='const'&&a.value===absorbing))return bool(absorbing);args=args.filter(a=>!(a.op==='const'&&a.value===!absorbing));if(!args.length)return bool(!absorbing);if(args.length===1)return args[0];}
 return {sort,op,args};
}
export function compileQuery(core,query={}){
 const plan=preparePlan(core,query.plan),nodes=core.nodes,declarations={},assertions=[],statesSeen=new Map(),usedEvents=new Map(),durations=[],count={n:0},max=query.maxTerms??100000;
 const rec=e=>plan.events.find(x=>x.id===e.event),def=e=>nodes[rec(e)?.template_id??e.event]??instanceDefinition(core,e.event);
 const variable=(sort,meaning)=>{const name='v'+digest(stable(meaning)).slice(0,24);declarations[name]={sort,meaning};return {sort,op:'var',name};};
 const assertion=(id,formula,source_id=null)=>assertions.push({id,formula,source_id});
 const eq=(a,b)=>{
  if(a.choice){return term('or',a.values.map((v,i)=>term('and',[eq(v,b),term('eq',[a.choice,num(i,'Int')])])));}
  if(b.choice)return eq(b,a);
  if(a.op==='const'&&b.op==='const')return bool(a.sort==='Bool'||b.sort==='Bool'?a.value===b.value:compare(a.value,b.value)===0);
  if(a.sort&&b.sort)return term('eq',[a,b]);
  if(a.set&&b.set)return term('and',[subset(a,b),subset(b,a)]);
  return bool(stable(a)===stable(b));
 };
 const member=(v,set)=>term('or',set.set.map(x=>term('and',[x.guard,eq(x.value,v)])));
 const subset=(a,b)=>term('and',a.set.map(x=>term('or',[term('not',[x.guard]),member(x.value,b)])));
 const set=items=>{
  const concrete=v=>v.object!==undefined||v.event!==undefined||v.symbol!==undefined||v.op==='const',key=v=>v.op==='const'&&v.sort!=='Bool'?'NUMBER:'+exact(v.value):stable(v),groups=new Map();
  for(const x of items){const k=key(x.value);if(!groups.has(k))groups.set(k,{value:x.value,guards:[]});groups.get(k).guards.push(x.guard);}
  const grouped=[...groups.values()].map(x=>({value:x.value,guard:term('or',x.guards)}));
  if(grouped.every(x=>concrete(x.value)))return {set:grouped};
  if(grouped.length>512)fail('SYMBOLIC_SET_CAPACITY',null,null,'RESOURCE');
  return {set:grouped.map((x,i)=>({value:x.value,guard:term('and',[x.guard,...grouped.slice(0,i).map(prior=>term('not',[term('and',[prior.guard,eq(x.value,prior.value)])]))])}))};
 };
 const field=(e,key,sort)=>{usedEvents.set(e.event,e);const record=rec(e),value=record?.[key];if(value!=null)return sort==='Bool'?bool(value):num(toBase(value,record.unit??'second'),sort);if(['occurred','completed','succeeded'].includes(key)&&plan.completeness?.kind==='EXACT_SNAPSHOT'&&!record&&def(e)?.kind!=='TASK')return bool(false);return variable(sort,{kind:'EVENT_FIELD',event:e.event,field:key});};
 const visit=(r,env={},depth=0)=>{
  if(++count.n>max||depth>128)fail('TERM_LIMIT',r.id,null,'RESOURCE');
  const n=nodes[r.id];if(r.kind==='ENTITY')return {object:r.id};if(r.kind==='EVENT')return {event:r.id};if(r.kind==='STATE'){const subject=n.subject?visit(n.subject,env,depth+1):null;return {state:stable([r.id,subject?.event??null]),fallback:subject?.event?null:r.id,node_id:r.id,subject};}
  if(r.kind==='VARIABLE'){
   if(Object.hasOwn(env,r.id))return env[r.id];if(n.binding_mode==='INSTANCE_LOCAL')fail('FREE_LOCAL_VARIABLE',r.id);
   if(n.type==='BOOLEAN'){const v=variable('Bool',{kind:'VARIABLE',id:n.id}),domain=visit(n.domain,env,depth+1);if(!domain.set||domain.set.some(x=>x.value.sort!=='Bool'))fail('BOOLEAN_DOMAIN_REQUIRED',n.id,null,'CAPABILITY');assertion('domain:'+v.name,member(v,domain));if(Object.hasOwn(query.variables??{},n.id)){if(typeof query.variables[n.id]!=='boolean')fail('QUERY_BOOLEAN_REQUIRED',n.id);assertion('given:'+n.id,eq(v,bool(query.variables[n.id])));}return v;}
   const domain=visit(n.domain,env,depth+1);
   if(n.type==='OBJECT'){if(!domain.set||domain.set.some(x=>typeof x.value.object!=='string'))fail('OBJECT_DOMAIN_OPEN',n.id,null,'CAPABILITY');const v=variable('Int',{kind:'OBJECT_VARIABLE',id:n.id,values:domain.set.map(x=>x.value)});assertion('domain:'+v.name,term('or',domain.set.map((x,i)=>term('and',[x.guard,term('eq',[v,num(i,'Int')])]))));const choice={choice:v,values:domain.set.map(x=>x.value)};if(Object.hasOwn(query.variables??{},n.id))assertion('given:'+n.id,eq(choice,query.variables[n.id]));return choice;}
   if(!['INTEGER','REAL'].includes(n.type))fail('VARIABLE_TYPE_UNSUPPORTED',n.id,null,'CAPABILITY');
   const v=variable(n.type==='INTEGER'?'Int':'Real',{kind:'VARIABLE',id:n.id});
   if(domain.interval)assertion('domain:'+v.name,term('and',[term('ge',[v,domain.interval[0]]),term('le',[v,domain.interval[1]])]));
   else if(domain.set)assertion('domain:'+v.name,member(v,domain));else fail('VARIABLE_DOMAIN_OPEN',n.id,null,'CAPABILITY');
   if(Object.hasOwn(query.variables??{},n.id)){const value=query.variables[n.id]?.number;if(value==null)fail('QUERY_NUMBER_REQUIRED',n.id);assertion('given:'+n.id,eq(v,num(value,v.sort)));}
   return v;
  }
  const op=n.operator,ar=n.arguments,go=r=>visit(r,env,depth+1);
  if(['FORALL','EXISTS','SELECT_EVENTS'].includes(op)){
   const domain=go(ar[0]);if(!domain.set)fail('UNBOUNDED_QUANTIFIER',n.id,null,'CAPABILITY');
   const body=domain.set.map(x=>({value:x.value,guard:x.guard,body:visit(ar[1],{...env,[n.bound_variable.id]:x.value},depth+1)}));
   if(op==='SELECT_EVENTS')return set(body.map(x=>({value:x.value,guard:term('and',[x.guard,x.body])})));
   return op==='FORALL'?term('and',body.map(x=>term('or',[term('not',[x.guard]),x.body]))):term('or',body.map(x=>term('and',[x.guard,x.body])));
  }
  if(op==='IMPLIES'){const a=go(ar[0]);if(a.op==='const'&&!a.value)return bool(true);return term('or',[term('not',[a]),go(ar[1])]);}
  if(op==='AND'||op==='OR'){const args=[];for(const a of ar){const v=go(a);args.push(v);if(v.op==='const'&&v.value===(op==='OR'))return bool(op==='OR');}return term(op.toLowerCase(),args);}
  if(op==='NUMBER'){const value=toBase(n.literal,n.unit);return num(value,value.includes('/')||n.unit&&!['count','次'].includes(n.unit)?'Real':'Int');}
  if(op==='BOOLEAN')return bool(n.literal);if(op==='SYMBOL')return {symbol:n.literal};
  if(op==='GROUP_MEMBERS')return set(nodes[ar[0].id].members.map(r=>({value:go(r),guard:bool(true)})));
  const a=ar.map(go);
  if(op==='ACTIVITY_CLASSES_OF'){
   const classes=(rec(a[0])?.roles??def(a[0])?.roles??[]).filter(r=>r.role==='ACTIVITY_CLASS');
   if(!classes.length)fail('ACTIVITY_CLASS_UNKNOWN',n.id,null,'CAPABILITY');
   return set(classes.map(r=>({value:go(r.value),guard:bool(true)})));
  }
  if(op==='ACTIVE_WHILE'){
   const occurred=field(a[0],'occurred','Bool');if(occurred.op==='const'&&!occurred.value)return bool(false);
   const entry=query.states?.[a[1].state]??(a[1].fallback?query.states?.[a[1].fallback]:null),periods=controlPeriods(entry,core.root_task);
   if(periods?.unknown)fail('CONTROL_PERIODS_UNKNOWN',n.id,null,'CAPABILITY');
   const start=field(a[0],'start','Real'),end=field(a[0],'end','Real'),point=term('eq',[start,end]);
   return term('and',[occurred,term('or',periods.map(p=>term('and',[
    term('or',[term('gt',[end,num(p.start)]),...(p.start_inclusive?[term('and',[point,term('eq',[start,num(p.start)])])]:[])]),
    term(p.end_inclusive?'le':'lt',[start,num(p.end)])
   ])))]);
  }
  if(op==='SET')return set(a.map(value=>({value,guard:bool(true)})));
  if(op==='TASK_EVENTS'){
   if(plan.completeness?.kind!=='EXACT_SNAPSHOT'||plan.completeness.task_id!==core.root_task)fail('OPEN_EVENT_DOMAIN',n.id,null,'CAPABILITY');
   const belongs=id=>taskContains(core,id,a[0].event);
   return set(plan.events.filter(e=>nodes[e.template_id??e.id]?.kind!=='TASK'&&(n.literal===false?e.task_id===a[0].event:belongs(e.task_id))).map(e=>({value:{event:e.id},guard:bool(true)})));
  }
  if(op==='TASK_EXTERNAL_INPUTS'){if(!Object.hasOwn(plan.external_inputs??{},a[0].event))fail('INPUT_DOMAIN_NOT_GIVEN',n.id,null,'CAPABILITY');return set(plan.external_inputs[a[0].event].map(id=>({value:{object:id},guard:bool(true)})));}
  if(op==='INTEGER_RANGE'){if(a.some(x=>x.op!=='const'))fail('DYNAMIC_ENUMERATION_DOMAIN',n.id,null,'CAPABILITY');const lo=BigInt(a[0].value),hi=BigInt(a[1].value);if(hi-lo>10000n)fail('INSTANCE_LIMIT',n.id,null,'RESOURCE');return set(Array.from({length:Number(hi>=lo?hi-lo+1n:0n)},(_,i)=>({value:num(lo+BigInt(i),'Int'),guard:bool(true)})));}
  if(op==='REAL_INTERVAL')return {interval:a};
  if(['UNION','INTERSECTION','DIFFERENCE'].includes(op)){if(a.some(x=>!x.set))fail('NON_FINITE_SET_ALGEBRA',n.id,null,'CAPABILITY');if(op==='UNION')return set(a.flatMap(x=>x.set));return set(a[0].set.map(x=>({value:x.value,guard:term('and',[x.guard,...a.slice(1).map(s=>op==='DIFFERENCE'?term('not',[member(x.value,s)]):member(x.value,s))])})));}
  if(op==='MEMBER')return a[1].set?member(a[0],a[1]):term('and',[term('ge',[a[0],a[1].interval[0]]),term('le',[a[0],a[1].interval[1]])]);
  if(op==='SUBSET')return subset(a[0],a[1]);if(op==='EQ')return eq(a[0],a[1]);
  if(op==='CARDINALITY'||op==='COUNT_STARTED'){if(!a[0].set)fail('UNBOUNDED_COUNT',n.id,null,'CAPABILITY');return term('add',a[0].set.map(x=>term('ite',[op==='COUNT_STARTED'?term('and',[x.guard,field(x.value,'occurred','Bool')]):x.guard,num(1,'Int'),num(0,'Int')],'Int')),'Int');}
  if(op==='ADD')return term('add',a,a.every(x=>x.sort==='Int')?'Int':'Real');
  if(['LT','LTE','GT','GTE','BEFORE'].includes(op))return term({LT:'lt',LTE:'le',GT:'gt',GTE:'ge',BEFORE:'lt'}[op],a);
  if(op==='NOT')return term('not',a);if(op==='IFF')return term('eq',a);
  if(op==='EVENT_INSTANCE'||op==='PREVIOUS_INSTANCE')return resolveInstance(core,r,x=>{const v=go(x);if(v.op!=='const')fail('SYMBOLIC_INSTANCE_INDEX',n.id,null,'CAPABILITY');return v.value;},env);
  if(['EVENT_OCCURRED','EVENT_COMPLETED','EVENT_SUCCEEDED','EVENT_START','EVENT_END'].includes(op))return field(a[0],{EVENT_OCCURRED:'occurred',EVENT_COMPLETED:'completed',EVENT_SUCCEEDED:'succeeded',EVENT_START:'start',EVENT_END:'end'}[op],op==='EVENT_START'||op==='EVENT_END'?'Real':'Bool');
  if(['OPERATION_OF','ACTORS_OF','TARGETS_OF','RECIPIENTS_OF','OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF'].includes(op)){
   const e=rec(a[0]),d=def(a[0]);if(op==='OPERATION_OF'){const operation=e?.operation??(d?.operation_extent==='EXACT'?d.operation:null);if(!operation)fail('UNKNOWN_OPERATION',n.id,null,'CAPABILITY');return {symbol:operation};}
   const names={ACTORS_OF:['PERFORMER'],TARGETS_OF:['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE'],RECIPIENTS_OF:['RECIPIENT'],OBJECT_OF:['OBJECT','INPUT_OBJECT','RESULT','DELIVERABLE'],RECIPIENT_OF:['RECIPIENT'],ENVIRONMENT_OF:['ENVIRONMENT']}[op];
   const vals=(e?.roles??d?.roles??[]).filter(r=>names.includes(r.role)).map(r=>go(r.value));if(!vals.length)fail('ROLE_VALUE_UNKNOWN',n.id,null,'CAPABILITY');
   const s=set(vals.map(value=>({value,guard:bool(true)})));if(op.endsWith('S_OF'))return s;if(s.set.length!==1)fail('ROLE_NOT_SINGLETON',n.id,null,'CAPABILITY');return s.set[0].value;
  }
  if(['STATE_VALUE','STATE_ESTABLISHED','TRUE_AT_START'].includes(op)){
   const id=a[0].state,s=query.states?.[id]??(a[0].fallback?query.states?.[a[0].fallback]:null),value=s?.value??(typeof s==='boolean'?s:null);
   const b=value==null?variable('Bool',{kind:'STATE_VALUE',id}):bool(value);
   const time=s?.established_at==null?variable('Real',{kind:'STATE_TIME',id}):num(toBase(s.established_at,s.unit??'second'));
   const state=nodes[a[0].node_id],subject=a[0].subject;
   statesSeen.set(id,{id,state,subject,value:b,time});
   if(subject?.event){
    const constraints=[term('le',[field(subject,'start','Real'),time]),term('le',[time,field(subject,'end','Real')])];
    if(['SUCCESS','FAILURE','COMPLETION','CONTROL_EFFECT'].includes(state.kind))constraints.push(field(subject,'occurred','Bool'));
    if(state.kind==='COMPLETION')constraints.push(term('eq',[time,field(subject,'end','Real')]));
    assertion('state:'+id,term('or',[term('not',[b]),term('and',constraints)]));
   }
   if(op==='STATE_VALUE')return b;
   return op==='STATE_ESTABLISHED'?time:term('and',[b,term('le',[time,field(a[1],'start','Real')])]);
  }
  if(op==='RECEIVED_ANY'||op==='RECEIVED_COMPLETE'){
   const meaning={receiver:a[0].object,artifact:a[1].object,delivery:a[2]?.event??null},s=query.receipts?.find(x=>x.receiver===meaning.receiver&&x.artifact===meaning.artifact&&(!meaning.delivery||x.delivery===meaning.delivery));
   const receipt=(key)=>s?.[key]==null?variable('Bool',{kind:'RECEIPT',...meaning,field:key}):bool(s[key]);
   const any=s?.any!=null?receipt('any'):s?.complete===true?bool(true):receipt('any'),complete=receipt('complete');assertion('receipt:'+digest(stable(meaning)),term('or',[term('not',[complete]),any]));return op==='RECEIVED_ANY'?any:complete;
  }
  if(op==='ACTIVE_DURING'||op==='ACTIVE_SINCE')return term('and',[field(a[0],'occurred','Bool'),term('gt',[field(a[0],'end','Real'),a[1]]),...(op==='ACTIVE_DURING'?[term('lt',[field(a[0],'start','Real'),a[2]])]:[])]);
  fail('OPERATOR_QUERY_UNSUPPORTED',n.id,null,'CAPABILITY',{operator:op});
 };
 const formulas={};
 // Plan records cannot override a declaration's bound variable roles.
 for(const record of plan.events){
  if(!record.roles)continue;
  const declared=nodes[record.template_id??record.id];if(declared?.category!=='EVENT')continue;
  for(const role of declared.roles){
   const expected=visit(role.value),actual=record.roles.filter(r=>r.role===role.role).map(r=>visit(r.value));
   assertion('role:'+record.id+':'+role.role+':'+digest(stable(role.value)),term('or',actual.map(value=>eq(expected,value))),declared.id);
  }
 }
 for(const id of query.requirements??core.requirements){
  const r=nodes[id];if(!r||r.category!=='REQUIREMENT')fail('QUERY_REQUIREMENT_MISSING',id);
  if(['PERMITTED','NOT_REQUIRED','UNSTATED'].includes(r.modality))continue;
  const applicability=r.applicability?visit(r.applicability):null;
  // The requirement is valid and typed, but its body is irrelevant when this
  // query proves its applicability false. Never replace an unknown gate.
  if(applicability?.op==='const'&&applicability.value===false){formulas[id]=bool(true);assertion('req:'+id,formulas[id],id);continue;}
  let body=visit(r.body);
  if(['EVENT_NORM','STOP'].includes(r.kind)){
   if(!r.subject)fail('EVENT_NORM_SUBJECT_REQUIRED',r.id);
   const e=visit(r.subject);if(def(e)?.kind==='TEMPLATE'||def(e)?.actor_domain==='TASK_SCOPE')fail('LEGACY_PATTERN_REQUIRES_EXPLICIT_SELECTOR',r.id,null,'CAPABILITY');
   body=term('and',[field(e,'occurred','Bool'),body]);
  }
  if(r.kind==='CONSTRAINT'&&r.subject?.kind==='EVENT'&&nodes[r.subject.id]?.kind!=='TASK')body=term('or',[term('not',[field(visit(r.subject),'occurred','Bool')]),body]);
  if(r.kind==='TOTAL_DURATION'){
   if(r.modality!=='REQUIRED'||r.applicability)fail('CONDITIONAL_DURATION_QUERY_UNSUPPORTED',r.id,null,'CAPABILITY');
   if(r.subject?.kind!=='VARIABLE')fail('DURATION_VARIABLE_REQUIRED',r.id,null,'CAPABILITY');
   const duration=visit(r.subject),task={event:r.scope_id},start=field(task,'start','Real'),end=field(task,'end','Real');
   body=term('and',[body,term('eq',[end,term('add',[start,duration],'Real')]),term('ge',[duration,num(0)])]);
   durations.push({id:r.id,scope:r.scope_id,start,end});
  }
  if(r.kind==='DATA_USE'){
   const use=r.data_use;if(!use)fail('DATA_USE_REQUIRED',r.id);const consumer=visit(use.consumer);
   let available;
   if(use.producer&&use.availability==='COMPLETE_RESULT'){const producer=visit(use.producer);available=term('and',[field(producer,'occurred','Bool'),field(producer,'completed','Bool'),term('le',[field(producer,'end','Real'),field(consumer,'start','Real')])]);}
   else{
    const producer=use.producer?visit(use.producer):null,object=visit(use.object),availabilityFor=object=>{const key=stable({object,producer}),entry=query.availability?.[key];return entry==null?variable('Real',{kind:'DATA_AVAILABLE',key}):num(toBase(entry.at,entry.unit??'second'));},point=object.choice?object.values.reduceRight((rest,value,i)=>term('ite',[term('eq',[object.choice,num(i,'Int')]),availabilityFor(value),rest],'Real'),num(0)):availabilityFor(object);
    available=term('and',[term('le',[point,field(consumer,'start','Real')]),...(producer?[field(producer,'occurred','Bool'),term('le',[field(producer,'start','Real'),point]),term('le',[point,field(producer,'end','Real')])]:[])]);
   }
   body=term('and',[body,term('or',[term('not',[field(consumer,'occurred','Bool')]),available])]);
  }
  const formula=r.modality==='FORBIDDEN'?term('not',[body]):body;
  formulas[id]=applicability?term('or',[term('not',[applicability]),formula]):formula;
  assertion('req:'+id,formulas[id],id);
 }
 // Fundamental event state implications and well-formed finite plan intervals.
 const universe=new Map([...Object.values(nodes).filter(n=>n.category==='EVENT'&&n.kind==='ACTION').map(e=>[e.id,{event:e.id}]),...plan.events.map(e=>[e.id,{event:e.id}]),...usedEvents]);
 for(const [id,ev]of universe){
  const o=field(ev,'occurred','Bool'),completed=field(ev,'completed','Bool'),succeeded=field(ev,'succeeded','Bool');
  assertion('event:'+id,term('and',[term('or',[term('not',[completed]),o]),term('or',[term('not',[succeeded]),completed]),term('or',[term('not',[o]),term('le',[field(ev,'start','Real'),field(ev,'end','Real')])])]));
 }
 for(const duration of durations){
  const horizon=[...universe.values()].filter(e=>def(e)?.kind!=='TASK'&&taskContains(core,rec(e)?.task_id??def(e)?.owner_id,duration.scope)).map(ev=>term('or',[term('not',[field(ev,'occurred','Bool')]),term('and',[term('ge',[field(ev,'start','Real'),duration.start]),term('le',[field(ev,'end','Real'),duration.end])])]));
  formulas[duration.id]=term('and',[formulas[duration.id],...horizon]);assertion('req:'+duration.id,formulas[duration.id],duration.id);
 }
 for(const a of statesSeen.values())for(const b of statesSeen.values())if(a.id<b.id&&a.subject?.event&&a.subject.event===b.subject?.event&&[a.state.kind,b.state.kind].sort().join(',')==='FAILURE,SUCCESS')assertion('state-exclusive:'+a.id+':'+b.id,term('not',[term('and',[a.value,b.value])]));
 const uniqueAssertions=[...new Map(assertions.map(a=>[a.id,a])).values()];
 return {format:'boundx-kernel-problem/1',core_sha256:digest(stable(core)),declarations,assertions:uniqueAssertions,formulas,query_scope:{kind:plan.completeness?.kind??'DECLARED_SYMBOLS',task_id:core.root_task,events:plan.events.map(e=>e.id),completeness:plan.completeness??null},plan,query,term_count:count.n};
}
import {controlPeriods} from './control-periods.mjs';
