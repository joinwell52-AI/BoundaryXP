// Explicit, digest-bound calculation deltas. Empty collections preserve saved facts.
import Ajv from 'ajv';
import {isDeepStrictEqual} from 'node:util';
import {calculationOutputSchema,savedCalculationSchema} from './boundary-calculation-schema.mjs';
import {compactBoundarySchema,compactBoundaryCandidate,expandCompactBoundary} from './compact-boundary.mjs';
import {sha256} from './source.mjs';
const obj=properties=>({type:'object',additionalProperties:false,properties,required:Object.keys(properties)}),strings={type:'array',items:{type:'string'}};
const compact=compactBoundarySchema(calculationOutputSchema('parse'),'parse'),p=compact.properties.boundary_calculation.properties;
export const calculationPatchSchema={...obj({format:{const:'boundx-calculation-patch/1'},base_calculation_sha256:{type:'string',minLength:64,maxLength:64},constraints:p.constraints,calculations:p.calculations,coverage:p.coverage,unresolved:p.unresolved,evidence_contexts:p.evidence_contexts,joint:{anyOf:[p.joint,{type:'null'}]},remove_constraint_ids:strings,remove_calculation_ids:strings,remove_unresolved_ids:strings}),$defs:compact.$defs};
const validate=new Ajv({strict:false,allErrors:true}).compile(calculationPatchSchema),validateResult=new Ajv({strict:false,allErrors:true}).compile(savedCalculationSchema);
export function applyCalculationPatch(base,delta){
 if(!validate(delta))throw Error('PATCH_CALCULATION_SCHEMA:'+JSON.stringify(validate.errors));
 if(delta.base_calculation_sha256!==sha256(JSON.stringify(base)))throw Error('PATCH_CALCULATION_BASE_DIGEST');
 const wire=compactBoundaryCandidate({requirements:[],boundary_calculation:base}).boundary_calculation,contexts=new Map(wire.evidence_contexts.map(x=>[x.id,x.context_json])),seen=new Set();
 for(const x of delta.evidence_contexts){if(seen.has(x.id))throw Error('PATCH_CALCULATION_DUPLICATE_CONTEXT');seen.add(x.id);if(contexts.has(x.id)&&contexts.get(x.id)!==x.context_json)throw Error('PATCH_CALCULATION_CONTEXT_COLLISION');contexts.set(x.id,x.context_json);}
 const part=expandCompactBoundary({requirements:[],boundary_calculation:{format:base.format,method_version:base.method_version,constraints:delta.constraints,calculations:delta.calculations,coverage:delta.coverage,unresolved:delta.unresolved,joint:delta.joint??wire.joint,evidence_contexts:[...contexts].map(([id,context_json])=>({id,context_json}))}}).boundary_calculation;
 const out=structuredClone(base),changed=[];
 for(const field of ['constraints','calculations','coverage','unresolved']){
  const key=field==='coverage'?'source_ref':'id',ids=new Set();
  for(const x of part[field]){if(ids.has(x[key]))throw Error('PATCH_CALCULATION_DUPLICATE_ID');ids.add(x[key]);const at=out[field].findIndex(y=>y[key]===x[key]);if(at>=0&&isDeepStrictEqual(out[field][at],x))continue;if(at<0)out[field].push(x);else out[field][at]=x;changed.push({collection:field,id:x[key],operation:at<0?'ADD':'REPLACE'});}
 }
 for(const [field,removals]of [['constraints',delta.remove_constraint_ids],['calculations',delta.remove_calculation_ids],['unresolved',delta.remove_unresolved_ids]]){
  const ids=new Set();for(const id of removals){if(ids.has(id)||part[field].some(x=>x.id===id))throw Error('PATCH_CALCULATION_CONFLICTING_REMOVAL');ids.add(id);const at=out[field].findIndex(x=>x.id===id);if(at<0)throw Error('PATCH_CALCULATION_UNKNOWN_REMOVAL');out[field].splice(at,1);changed.push({collection:field,id,operation:'EXPLICIT_REMOVE'});}
 }
 if(delta.joint!==null&&!isDeepStrictEqual(out.joint,part.joint)){out.joint=part.joint;changed.push({collection:'joint',id:'joint',operation:'REPLACE'});}
 if(!validateResult(out))throw Error('PATCH_CALCULATION_RESULT_SCHEMA');
 const ids=new Set(out.constraints.map(x=>x.id));if(out.joint.constraint_ids.some(id=>!ids.has(id))||out.coverage.some(x=>x.constraint_ids.some(id=>!ids.has(id))))throw Error('PATCH_CALCULATION_DANGLING_CONSTRAINT');
 return {calculation:out,changed};
}
export function requireCompleteCalculationReplacement(base,next){
 for(const key of ['constraints','calculations','coverage']){const id=key==='coverage'?'source_ref':'id';if(base[key].some(x=>!next[key].some(y=>y[id]===x[id])))throw Error('PATCH_CALCULATION_IMPLICIT_DATA_LOSS:'+key);}
 return next;
}
