import Ajv from 'ajv';import {createHash} from 'node:crypto';
import {legacySchema,v2Schema} from './contract-registry.mjs';import {fail} from './diagnostics.mjs';
const validateLegacy=new Ajv({strict:false,allErrors:true}).compile(legacySchema);
const validateV2=new Ajv({strict:false,allErrors:true}).compile(v2Schema);
export const digest=b=>createHash('sha256').update(b).digest('hex');
export function loadCandidate(input,{schema=null,maxBytes=8*1024*1024,maxNodes=20000}={}){
 const bytes=Buffer.isBuffer(input)?input:Buffer.from(typeof input==='string'?input:JSON.stringify(input));
 if(bytes.length>maxBytes)fail('IR_BYTE_LIMIT',null,null,'RESOURCE');
 let raw;try{raw=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{fail('JSON_INVALID',null,null,'LOAD');}
 const validate=schema?new Ajv({strict:false,allErrors:true}).compile(schema):raw.contract_version==='candidate-ir/2.0'?validateV2:validateLegacy;
 if(!validate(raw))fail('SCHEMA_INVALID',null,null,'LOAD',{errors:validate.errors});
 const count=Object.values(raw).filter(Array.isArray).reduce((n,a)=>n+a.length,0);if(count>maxNodes)fail('IR_NODE_LIMIT',null,null,'RESOURCE');
 return {raw,raw_sha256:digest(bytes),bytes};
}
