import {operators,candidateSchema,auditSchema} from '../../../research/7plus1-parser/llm-first-028/contracts/candidate-ir-v1/schema.mjs';
export const contractVersion='candidate-ir/2.0';
export const registry=Object.fromEntries(Object.entries(operators).map(([op,[output,min,max]])=>[op,{op,output,min,max,rule:'IR14.'+op,version:'1.4',queries:['EVALUATE','BOUNDED_SAT'],binder:['FORALL','EXISTS'].includes(op)}]));
export {candidateSchema as legacySchema};
export const collections={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'};
const additions={SYMBOL:['SYMBOL',0,0],SELECT_EVENTS:['EVENT_DOMAIN',2,2],OPERATION_OF:['SYMBOL',1,1],ACTORS_OF:['SET',1,1],TARGETS_OF:['SET',1,1],RECIPIENTS_OF:['SET',1,1],COUNT_STARTED:['INTEGER',1,1],EVENT_COMPLETED:['BOOLEAN',1,1],EVENT_SUCCEEDED:['BOOLEAN',1,1],RECEIVED_ANY:['BOOLEAN',2,3],RECEIVED_COMPLETE:['BOOLEAN',2,3],ACTIVE_DURING:['BOOLEAN',3,3],ACTIVE_SINCE:['BOOLEAN',2,2]};
for(const [op,[output,min,max]]of Object.entries(additions))registry[op]={op,output,min,max,rule:'IR20.'+op,version:'2.0',queries:['EVALUATE','BOUNDED_SAT'],binder:op==='SELECT_EVENTS'};
export const v2Schema=structuredClone(candidateSchema);
v2Schema.properties.contract_version={const:contractVersion};
v2Schema.properties.root_task={$ref:'#/$defs/ref'};v2Schema.required.push('root_task');
v2Schema.properties.expressions.items.properties.operator.enum=Object.keys(registry);
v2Schema.properties.expressions.items.properties.literal={anyOf:[{type:'boolean'},{type:'null'},{type:'string',maxLength:4096}]};
v2Schema.properties.events.items.properties.operation.enum.push('INVOKE','MODIFY','DELETE');
v2Schema.properties.sequences={type:'array',items:{type:'object',additionalProperties:false,required:['template','task','index_base','max_instances','coverage','source_refs'],properties:{template:{$ref:'#/$defs/ref'},task:{$ref:'#/$defs/ref'},index_base:{type:'integer',enum:[0,1]},max_instances:{type:'integer',minimum:0,maximum:10000},coverage:{enum:['BOUNDED_DECLARATION','OPEN']},source_refs:{type:'array',minItems:1,items:{type:'string'}}}}};
v2Schema.required.push('sequences');
export const v2AuditSchema=structuredClone(auditSchema);v2AuditSchema.properties.contract_version={const:contractVersion};
// Capability is a signature + domain + query claim, never an operator-name count.
const signatures={
 SET:'T* -> FiniteSet<T>',GROUP_MEMBERS:'GROUP -> FiniteSet<OBJECT>',TASK_EVENTS:'TASK -> EventDomain',TASK_EXTERNAL_INPUTS:'TASK -> FiniteSet<OBJECT>',
 UNION:'Set<T>,Set<T>+ -> Set<T>',INTERSECTION:'Set<T>,Set<T>+ -> Set<T>',DIFFERENCE:'Set<T>,Set<T> -> Set<T>',MEMBER:'T,Set<T>|Interval -> BOOLEAN',SUBSET:'Set<T>,Set<T> -> BOOLEAN',CARDINALITY:'FiniteSet<T> -> INTEGER',
 BOOLEAN:'boolean literal',NUMBER:'exact numeric literal + unit',SYMBOL:'exact symbolic literal',REAL_INTERVAL:'NUMBER,NUMBER -> Interval',INTEGER_RANGE:'INTEGER,INTEGER -> FiniteDomain<INTEGER>',
 EQ:'T,T -> BOOLEAN',LT:'NUMBER,NUMBER -> BOOLEAN',LTE:'NUMBER,NUMBER -> BOOLEAN',GT:'NUMBER,NUMBER -> BOOLEAN',GTE:'NUMBER,NUMBER -> BOOLEAN',ADD:'NUMBER+ -> NUMBER',BEFORE:'TIME,TIME -> BOOLEAN',
 AND:'BOOLEAN+ -> BOOLEAN',OR:'BOOLEAN+ -> BOOLEAN',NOT:'BOOLEAN -> BOOLEAN',IMPLIES:'BOOLEAN,BOOLEAN -> BOOLEAN',IFF:'BOOLEAN,BOOLEAN -> BOOLEAN',
 STATE_VALUE:'STATE -> BOOLEAN',STATE_ESTABLISHED:'STATE -> TIME',EVENT_OCCURRED:'EVENT -> BOOLEAN',EVENT_COMPLETED:'EVENT -> BOOLEAN',EVENT_SUCCEEDED:'EVENT -> BOOLEAN',EVENT_START:'EVENT -> TIME',EVENT_END:'EVENT -> TIME',TRUE_AT_START:'STATE,EVENT -> BOOLEAN',IMMEDIATE_AFTER:'STATE,EVENT -> BOOLEAN',EVENT_INSTANCE:'TEMPLATE,INTEGER -> EVENT',PREVIOUS_INSTANCE:'INSTANCE -> EVENT',
 OBJECT_OF:'EVENT -> OBJECT singleton',RECIPIENT_OF:'EVENT -> OBJECT singleton',ENVIRONMENT_OF:'EVENT -> OBJECT singleton',OPERATION_OF:'EVENT -> SYMBOL',ACTORS_OF:'EVENT -> FiniteSet<OBJECT>',TARGETS_OF:'EVENT -> FiniteSet<OBJECT>',RECIPIENTS_OF:'EVENT -> FiniteSet<OBJECT>',
 FORALL:'FiniteDomain<T>, binder:T, BOOLEAN -> BOOLEAN',EXISTS:'FiniteDomain<T>, binder:T, BOOLEAN -> BOOLEAN',SELECT_EVENTS:'EventDomain, binder:EVENT, BOOLEAN -> EventDomain',COUNT_STARTED:'EventDomain -> INTEGER',
 RECEIVED_ANY:'OBJECT,OBJECT,EVENT? -> BOOLEAN',RECEIVED_COMPLETE:'OBJECT,OBJECT,EVENT? -> BOOLEAN',ACTIVE_DURING:'EVENT,TIME,TIME -> BOOLEAN',ACTIVE_SINCE:'EVENT,TIME -> BOOLEAN'
};
for(const [op,s]of Object.entries(registry))Object.assign(s,{signature:signatures[op],typecheck:'bind.mjs',reference_eval:'evaluate.mjs',lowering:'normalize.mjs',backend_compile:op==='IMMEDIATE_AFTER'?null:'compile.mjs',unknown_behavior:'UNKNOWN_IN_EVALUATION_OR_SYMBOLIC_WHERE_SUPPORTED',tests:['operator-matrix.test.mjs'],profile:op==='IMMEDIATE_AFTER'?'UNSUPPORTED_QUALITATIVE_PRIORITY':'FINITE_PLAN_QF_LIRA_V1',conditions:['Well-typed references and units','Finite expansion domains; explicit exact snapshot for event quantification','Fixed identity/roles or finite object variables','No symbolic sequence index','Configured resource bounds'],implementation_version:'kernel/1.0'});
