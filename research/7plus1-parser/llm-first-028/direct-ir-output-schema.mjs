import {sha256} from './source.mjs';
// Transport restrictions do not weaken the local authoritative schema.
export function directIROutputSchema(original){
 const schema=structuredClone(original),adjustments=[];
 const visit=(value,p='')=>{if(!value||typeof value!=='object')return;
  if(!Array.isArray(value)&&Object.hasOwn(value,'const')){const c=value.const,type=c===null?'null':Array.isArray(c)?'array':typeof c==='object'?'object':typeof c;if(!['string','number','boolean','null'].includes(type))throw Error('UNSUPPORTED_OUTPUT_CONST_TYPE');if(value.type&&value.type!==type)throw Error('OUTPUT_CONST_TYPE_MISMATCH');value.type=type;value.enum=[c];delete value.const;adjustments.push({path:p,reason:'STRICT_CONST_AS_TYPED_SINGLETON_ENUM',type,value:c});}
  if(!Array.isArray(value)&&Object.hasOwn(value,'uniqueItems')){adjustments.push({path:p+'/uniqueItems',local_only_constraint:value.uniqueItems,reason:'STRICT_OUTPUT_CHANNEL_REJECTS_UNIQUE_ITEMS'});delete value.uniqueItems;}
  for(const [k,v]of Object.entries(value))visit(v,p+'/'+k);
 };visit(schema);
 return {schema,adjustments,local_schema_sha256:sha256(JSON.stringify(original)),output_schema_sha256:sha256(JSON.stringify(schema))};
}
