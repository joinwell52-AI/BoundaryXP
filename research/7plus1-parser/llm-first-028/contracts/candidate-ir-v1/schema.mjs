const ref={$ref:'#/$defs/ref'},refs={type:'array',items:ref},str={type:'string',minLength:1};
const object=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const array=items=>({type:'array',items});const enumeration=(...values)=>({type:'string',enum:values});const nullable=x=>({anyOf:[x,{type:'null'}]});
const sourceRefs={type:'array',minItems:1,uniqueItems:true,items:str};
const common={id:str,source_refs:sourceRefs};
export const operators={
 SET:['SET',0,null],GROUP_MEMBERS:['SET',1,1],TASK_EVENTS:['EVENT_DOMAIN',1,1],UNION:['SET',2,null],INTERSECTION:['SET',2,null],DIFFERENCE:['SET',2,2],
 MEMBER:['BOOLEAN',2,2],SUBSET:['BOOLEAN',2,2],CARDINALITY:['INTEGER',1,1],
 BOOLEAN:['BOOLEAN',0,0],NUMBER:['NUMBER',0,0],REAL_INTERVAL:['DOMAIN',2,2],INTEGER_RANGE:['DOMAIN',2,2],
 EQ:['BOOLEAN',2,2],LT:['BOOLEAN',2,2],LTE:['BOOLEAN',2,2],GT:['BOOLEAN',2,2],GTE:['BOOLEAN',2,2],ADD:['NUMBER',2,null],
 AND:['BOOLEAN',2,null],OR:['BOOLEAN',2,null],NOT:['BOOLEAN',1,1],IMPLIES:['BOOLEAN',2,2],IFF:['BOOLEAN',2,2],
 STATE_VALUE:['BOOLEAN',1,1],EVENT_OCCURRED:['BOOLEAN',1,1],EVENT_START:['TIME',1,1],EVENT_END:['TIME',1,1],STATE_ESTABLISHED:['TIME',1,1],
 TRUE_AT_START:['BOOLEAN',2,2],IMMEDIATE_AFTER:['BOOLEAN',2,2],BEFORE:['BOOLEAN',2,2],EVENT_INSTANCE:['EVENT',2,2],PREVIOUS_INSTANCE:['EVENT',1,1],
 OBJECT_OF:['OBJECT',1,1],RECIPIENT_OF:['OBJECT',1,1],ENVIRONMENT_OF:['OBJECT',1,1],FORALL:['BOOLEAN',2,2],EXISTS:['BOOLEAN',2,2]
};
const expression=object({...common,operator:enumeration(...Object.keys(operators)),arguments:refs,literal:{anyOf:[{type:'number'},{type:'boolean'},{type:'null'}]},unit:nullable(str),bound_variable:nullable(ref)});
export const candidateSchema={...object({format:{const:'boundx-candidate-ir/1'},contract_version:{const:'candidate-ir/1.2'},source_table:array(object({id:str,quote:str,occurrence:{type:'integer',minimum:1}})),
 entities:array(object({...common,label:str,kind:enumeration('PERSON','FILE','DOCUMENT','GROUP','ENVIRONMENT','OBJECT'),instance_scope:str,members:refs})),
 variables:array(object({...common,label:str,type:enumeration('OBJECT','EVENT','BOOLEAN','INTEGER','REAL'),domain:ref,binding_mode:enumeration('TASK_FIXED','INSTANCE_LOCAL','OBSERVATION'),scope_id:str,owner:nullable(ref)})),
 events:array(object({...common,label:str,kind:enumeration('ACTION','TASK','REFERENCE','TEMPLATE'),layer:enumeration('MAIN','CONDITION','QUOTED','MODIFIER','PURPOSE','CONTENT','BACKGROUND'),use:enumeration('CURRENT_TASK','MENTION_ONLY'),owner_id:str,operation:enumeration('READ','WRITE','CREATE','DELIVER','REVIEW','ORGANIZE','STOP','CONTINUE','ACCESS','REPORT','SELECT','OTHER'),operation_extent:enumeration('EXACT','OPEN'),actor_domain:enumeration('EXPLICIT','TASK_SCOPE','UNKNOWN'),roles:array(object({role:enumeration('PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR','INPUT_OBJECT','OBJECT','RESULT','DELIVERABLE','BASIS','CONTENT','ENVIRONMENT'),value:ref,source_refs:sourceRefs}))})),
 states:array(object({...common,label:str,kind:enumeration('COMPLETION','SUCCESS','FAILURE','RECEIPT','CONTROL_EFFECT','EXTERNAL'),subject:nullable(ref),arguments:refs})),expressions:array(expression),
 requirements:array(object({...common,kind:enumeration('EVENT_NORM','CONSTRAINT','TOTAL_DURATION','COMPLETION','STOP','DATA_USE'),views:{type:'array',uniqueItems:true,items:enumeration('I','O','A','P','R','V','C','B')},scope_id:str,modality:enumeration('REQUIRED','PERMITTED','NOT_REQUIRED','FORBIDDEN','UNSTATED'),subject:nullable(ref),applicability:nullable(ref),body:ref,data_use:nullable(object({object:ref,consumer:ref,producer:nullable(ref),availability:enumeration('USED_PORTION','COMPLETE_RESULT')})),note:{type:'string'}})),
 issues:array(object({...common,kind:enumeration('AMBIGUITY','UNSPECIFIED','EXPRESSION_GAP'),targets:refs,field_path:{type:'string'},alternatives:refs,reason:str})),
 coverage:array(object({source_refs:sourceRefs,node_refs:refs,status:enumeration('EXPRESSED','UNSPECIFIED','AMBIGUOUS','GAP'),reason:{type:'string'}}))
 }),$defs:{ref:object({kind:enumeration('ENTITY','VARIABLE','EVENT','STATE','EXPRESSION','REQUIREMENT'),id:str})}};
export const auditSchema={...object({format:{const:'boundx-candidate-ir-audit/1'},contract_version:{const:'candidate-ir/1.2'},source_table:array(object({id:str,quote:str,occurrence:{type:'integer',minimum:1}})),reviews:array(object({target:ref,field_path:{type:'string'},verdict:enumeration('SUPPORT','CONTRADICT','UNCERTAIN'),context_refs:refs,source_refs:sourceRefs,reason:str})),omissions:array(object({source_refs:sourceRefs,affected_views:array(enumeration('I','O','A','P','R','V','C','B')),reason:str})),issues:array(object({targets:refs,field_path:{type:'string'},source_refs:sourceRefs,reason:str}))}),$defs:candidateSchema.$defs};
