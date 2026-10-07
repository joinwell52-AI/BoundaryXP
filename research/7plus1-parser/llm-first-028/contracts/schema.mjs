import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const s={type:'string'}, id={type:'string',minLength:1}, ids={type:'array',items:id};
const en=(...values)=>({type:'string',enum:values});
const obj=p=>({type:'object',properties:p,required:Object.keys(p),additionalProperties:false});
const arr=items=>({type:'array',items});
const nil=t=>({anyOf:[t,{type:'null'}]});
const src=obj({quote:{type:'string',minLength:1},occurrence:{type:'integer',minimum:1}});
const sources={type:'array',items:src,minItems:1};
export const roles=['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR','INPUT_OBJECT','OBJECT','RESULT','BASIS','CONTENT'];
export const views=['I','O','A','P','R','V','C','B'];
const affected=arr(en(...views));
const quantity=obj({metric:id,target_id:id,comparator:en('EQ','LT','LTE','GT','GTE'),value:{type:'number'},unit:id,use:en('EXECUTION_LIMIT','OUTPUT_CONTENT','COMPLETION_THRESHOLD','CLASSIFICATION_THRESHOLD'),count_scope:id});
export const proposalSchema=obj({
 contract_version:{const:'028-r02.2',type:'string'},
 entities:arr(obj({id,label:id,type:en('PERSON','FILE','SYSTEM','DOCUMENT','GROUP','REFERENT','OTHER'),mentions:sources,alternatives:ids})),
 events:arr(obj({id,predicate:id,kind:en('ACTION','STATE'),layer:en('MAIN','CONDITION','QUOTED','MODIFIER','PURPOSE','CONTENT','BACKGROUND'),use:en('CURRENT_TASK','MENTION_ONLY'),modality:en('REQUIRED','PERMITTED','NOT_REQUIRED','FORBIDDEN','UNSTATED'),polarity:en('POSITIVE','NEGATIVE'),owner_id:id,constraint_ids:ids,requires:ids,sources})),
 claims:arr(obj({id,kind:en('ROLE','CONDITION','TEMPORAL','QUANTITY','COMPLETION','STOP','SCOPE'),event_id:nil(id),entity_id:nil(id),role:nil(en(...roles)),expression_id:nil(id),direction:nil(en('NECESSARY','SUFFICIENT','IFF','ORDER')),temporal:nil(en('AFTER','BEFORE')),quantity:nil(quantity),scope_id:id,requires:ids,sources,note:s})),
 expressions:arr(obj({id,op:en('STATE','ITEM','ALL','ANY','UNION','INTERSECTION','EXCEPT','AND','OR','NOT'),operands:ids,state:nil(obj({predicate:id,event_id:nil(id),args:ids,polarity:en('POSITIVE','NEGATIVE')})),sources})),
 issues:arr(obj({id,kind:en('AMBIGUITY','UNSPECIFIED','COVERAGE_GAP'),subject_ids:ids,field_path:s,alternatives:ids,affected_views:affected,sources,note:s})),
 coverage:arr(obj({sources,claim_ids:ids,status:en('EXPRESSED','BACKGROUND','UNSPECIFIED','GAP'),affected_views:affected}))
});
export const auditSchema=obj({contract_version:{const:'028-r02.2',type:'string'},
 reviews:arr(obj({subject_id:id,field_path:s,verdict:en('SUPPORT','CONTRADICT','UNCERTAIN'),context_refs:ids,sources,reason:s})),
 issues:arr(obj({id,issue_kind:en('BINDING','SCOPE','MODALITY','LAYER','IDENTITY','CONDITION','QUANTITY','SOURCE','CONTRACT'),subject_ids:ids,field_path:s,context_refs:ids,sources,reason:s,suggested_json:nil(s)})),
 omissions:arr(obj({id,sources,affected_views:affected,reason:s}))
});
if(process.argv[1]===fileURLToPath(import.meta.url))for(const [name,schema] of Object.entries({proposal:proposalSchema,audit:auditSchema}))fs.writeFileSync(new URL(`${name}.schema.json`,import.meta.url),JSON.stringify(schema,null,2)+'\n');
