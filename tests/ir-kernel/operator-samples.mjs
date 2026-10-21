import {v2,plan} from './domain-fixtures.mjs';import {entity,event,expr,variable,E,O,T,V,S,common} from './fixtures.mjs';
export function samples(){
 const ir=v2();ir.entities.push(entity('a'),entity('b'),entity('person','PERSON'),entity('env','ENVIRONMENT'),entity('group','GROUP',[O('a'),O('b')]));
 ir.events.push(event('job',{operation:'INVOKE',roles:[{role:'PERFORMER',value:O('person'),source_refs:['s']},{role:'OBJECT',value:O('a'),source_refs:['s']},{role:'RECIPIENT',value:O('person'),source_refs:['s']},{role:'ENVIRONMENT',value:O('env'),source_refs:['s']}]}),event('attempt',{kind:'TEMPLATE'}));
 ir.states.push({...common('state'),label:'external',kind:'EXTERNAL',subject:null,arguments:[]});ir.sequences.push({template:T('attempt'),task:T('task'),index_base:0,max_instances:3,coverage:'BOUNDED_DECLARATION',source_refs:['s']});
 const entries={},add=(op,args=[],literal=null,unit=null,binder=null,id=op)=>{ir.expressions.push(expr(id,op,args,literal,unit,binder));entries[op]=E(id);return E(id);};
 const zero=add('NUMBER',[],'0',null,null,'zero'),one=add('NUMBER',[],'1',null,null,'one'),two=add('NUMBER',[],'2',null,null,'two'),time=add('NUMBER',[],'1','second',null,'time'),until=add('NUMBER',[],'3','second',null,'until');
 const yes=add('BOOLEAN',[],true,null,null,'yes'),no=add('BOOLEAN',[],false,null,null,'no');
 const set=add('SET',[O('a'),O('b'),O('a')]),group=add('GROUP_MEMBERS',[O('group')]),events=add('TASK_EVENTS',[T('task')]);add('TASK_EXTERNAL_INPUTS',[T('task')]);
 add('UNION',[set,group]);add('INTERSECTION',[set,group]);add('DIFFERENCE',[set,group]);add('MEMBER',[O('a'),set]);add('SUBSET',[set,group]);add('CARDINALITY',[set]);
 const range=add('INTEGER_RANGE',[zero,two]);add('REAL_INTERVAL',[zero,two]);
 for(const op of ['EQ','LT','LTE','GT','GTE','ADD'])add(op,[one,two]);
 for(const op of ['AND','OR','IMPLIES','IFF'])add(op,[yes,no]);add('NOT',[yes]);
 for(const op of ['STATE_VALUE','STATE_ESTABLISHED'])add(op,[S('state')]);
 for(const op of ['EVENT_OCCURRED','EVENT_COMPLETED','EVENT_SUCCEEDED','EVENT_START','EVENT_END','OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF','OPERATION_OF','ACTORS_OF','TARGETS_OF','RECIPIENTS_OF'])add(op,[T('job')]);
 add('TRUE_AT_START',[S('state'),T('job')]);add('IMMEDIATE_AFTER',[S('state'),T('job')]);add('BEFORE',[time,until]);const instance=add('EVENT_INSTANCE',[T('attempt'),one]);add('PREVIOUS_INSTANCE',[instance]);
 ir.variables.push(variable('n','INTEGER',range,'INSTANCE_LOCAL'),variable('ev','EVENT',events,'INSTANCE_LOCAL'));
 const positive=add('GTE',[V('n'),zero],null,null,null,'positive');add('FORALL',[range,positive],null,null,V('n'));add('EXISTS',[range,positive],null,null,V('n'));
 const selected=add('SELECT_EVENTS',[events,yes],null,null,V('ev'));add('COUNT_STARTED',[selected]);add('SYMBOL',[],'INVOKE');
 for(const op of ['RECEIVED_ANY','RECEIVED_COMPLETE'])add(op,[O('person'),O('a')]);add('ACTIVE_DURING',[T('job'),time,until]);add('ACTIVE_SINCE',[T('job'),time]);
 const query={plan:{...plan([{id:'job',task_id:'task',operation:'INVOKE',occurred:true,completed:true,succeeded:false,start:'2',end:'4'}]),external_inputs:{task:['a','b']}},states:{state:{value:true,established_at:'1',unit:'second'}},receipts:[{receiver:'person',artifact:'a',any:true,complete:false}]};
 ir.entities.push(entity('activity','ACTIVITY_CLASS'));
 ir.events.find(e=>e.id==='job').roles.push({role:'ACTIVITY_CLASS',value:O('activity'),source_refs:['s']});
 add('ACTIVITY_CLASSES_OF',[T('job')]);add('ACTIVE_WHILE',[T('job'),S('state')]);
 query.states.state.periods={completeness:'EXACT_FOR_TASK_HORIZON',task_id:'task',intervals:[{start:'3',end:'8',unit:'second',start_inclusive:true,end_inclusive:false}]};
 return {ir,entries,query};
}
