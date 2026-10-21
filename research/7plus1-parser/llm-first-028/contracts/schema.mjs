import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const s={type:'string'}, id={type:'string',minLength:1}, ids={type:'array',items:id};
const en=(...values)=>({type:'string',enum:values});
const obj=p=>({type:'object',properties:p,required:Object.keys(p),additionalProperties:false});
const arr=items=>({type:'array',items});
const nil=t=>({anyOf:[t,{type:'null'}]});
const src=obj({quote:{type:'string',minLength:1},occurrence:{type:'integer',minimum:1}});
const sources={type:'array',items:src,minItems:1};
export const roles=['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR','INPUT_OBJECT','OBJECT','RESULT','DELIVERABLE','BASIS','CONTENT'];
export const views=['I','O','A','P','R','V','C','B'];
export const contractVersion='031-r1.1';
const affected=arr(en(...views));
// Additive canonical fields are optional for explicitly labelled old-response replay.
// The compact output Schema makes every field explicit for new model responses.
const extended=(shape,properties)=>({...shape,properties:{...shape.properties,...properties}});
const quantity=extended(obj({metric:id,target_id:id,comparator:en('EQ','LT','LTE','GT','GTE'),value:{type:'number'},unit:id,use:en('EXECUTION_LIMIT','OUTPUT_CONTENT','COMPLETION_THRESHOLD','CLASSIFICATION_THRESHOLD','WORK_PLAN'),count_scope:id}),{distribution:nil(obj({mode:en('AGGREGATE','EACH'),domain_id:nil(id)}))});
const requirement=en('GENERAL','RESTRICTION','QUANTITY_TOTAL','QUANTITY_EACH','WORK_PLAN','NON_BOUNDARY','PROPERTY_CONSTRAINT','OUTPUT_BEHAVIOR');
const propertyTest=obj({target_id:id,event_id:nil(id),property_path:arr(id),operator:en('EQ','NEQ','IN','NOT_IN','LT','LTE','GT','GTE','EMPTY','NONEMPTY','EXISTS','NOT_EXISTS','UNCHANGED','IMMEDIATE'),value:{anyOf:[{type:'string'},{type:'number'},{type:'boolean'},{type:'null'},{type:'array',items:{anyOf:[{type:'string'},{type:'number'},{type:'boolean'}]}}]}});
const semanticSignature=extended(obj({effects:arr(en('READ','WRITE','CREATE','DELIVER','REVIEW','ORGANIZE','STOP','CONTINUE','ACCESS','REPORT','OTHER')),extent:en('EXACT','OPEN'),actor_domain:en('EXPLICIT','TASK_SCOPE','UNKNOWN'),continuation_targets:ids,state_links:arr(obj({expression_id:id,aspect:en('COMPLETION','SUCCESS','CONTROL_EFFECT'),relation:en('IFF','STATE_IMPLIES_EVENT','EVENT_IMPLIES_STATE')}))}),{external_input_ids:ids});
const scopeBinding=obj({domain_kind:en('EXTERNAL_INPUT','EXECUTION_ENVIRONMENT'),relation:en('ONLY_ALLOWED'),subject_mode:en('TASK_OPERATIONS','EVENTS'),subject_event_ids:ids});
export const proposalSchema=obj({
 contract_version:{const:contractVersion,type:'string'},
 entities:arr(extended(obj({id,label:id,type:en('PERSON','FILE','SYSTEM','DOCUMENT','GROUP','REFERENT','OTHER'),mentions:sources,alternatives:ids}),{members:nil(ids)})),
 events:arr(extended(obj({id,predicate:id,kind:en('ACTION','STATE'),layer:en('MAIN','CONDITION','QUOTED','MODIFIER','PURPOSE','CONTENT','BACKGROUND'),use:en('CURRENT_TASK','MENTION_ONLY'),modality:en('REQUIRED','PERMITTED','NOT_REQUIRED','FORBIDDEN','UNSTATED'),polarity:en('POSITIVE','NEGATIVE'),owner_id:id,constraint_ids:ids,requires:ids,sources}),{specifies_result_id:nil(id),semantic_signature:nil(semanticSignature)})),
 claims:arr(extended(obj({id,kind:en('ROLE','CONDITION','TEMPORAL','QUANTITY','COMPLETION','STOP','SCOPE','ARTIFACT_USE'),event_id:nil(id),entity_id:nil(id),role:nil(en(...roles)),expression_id:nil(id),direction:nil(en('NECESSARY','SUFFICIENT','IFF','ORDER')),temporal:nil(en('AFTER','BEFORE')),quantity:nil(quantity),artifact_use:nil(obj({producer_result_id:id,consumer_role_id:id,availability:en('USED_PORTION','COMPLETE_RESULT')})),scope_id:id,requires:ids,sources,note:s}),{scope_binding:nil(scopeBinding)})),
 expressions:arr(extended(obj({id,op:en('STATE','TEST','ITEM','MEMBERS','ALL','ANY','UNION','INTERSECTION','EXCEPT','AND','OR','NOT'),operands:ids,state:nil(obj({predicate:id,event_id:nil(id),args:ids,polarity:en('POSITIVE','NEGATIVE')})),sources}),{test:nil(propertyTest)})),
 issues:arr(obj({id,kind:en('AMBIGUITY','UNSPECIFIED','COVERAGE_GAP'),subject_ids:ids,field_path:s,alternatives:ids,affected_views:affected,sources,note:s})),
 coverage:arr(extended(obj({sources,claim_ids:ids,status:en('EXPRESSED','BACKGROUND','UNSPECIFIED','GAP'),affected_views:affected}),{requirement_kind:requirement}))
});
export const auditSchema=extended(obj({contract_version:{const:contractVersion,type:'string'},
 reviews:arr(obj({subject_id:id,field_path:s,verdict:en('SUPPORT','CONTRADICT','UNCERTAIN'),context_refs:ids,sources,reason:s})),
 issues:arr(obj({id,issue_kind:en('BINDING','SCOPE','MODALITY','LAYER','IDENTITY','CONDITION','QUANTITY','SOURCE','CONTRACT'),subject_ids:ids,field_path:s,context_refs:ids,sources,reason:s,suggested_json:nil(s)})),
 omissions:arr(obj({id,sources,affected_views:affected,reason:s}))
}),{source_checks:arr(obj({sources,claim_ids:ids,requirement_kind:requirement,status:en('EXPRESSED','BACKGROUND','UNSPECIFIED','GAP'),affected_views:affected,reason:s}))});
if(process.argv[1]===fileURLToPath(import.meta.url))for(const [name,schema] of Object.entries({proposal:proposalSchema,audit:auditSchema}))fs.writeFileSync(new URL(`${name}.schema.json`,import.meta.url),JSON.stringify(schema,null,2)+'\n');
