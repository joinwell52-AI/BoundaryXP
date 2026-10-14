// Runtime response extension. The authoritative IR/Core contract stays 2.0.
import {v2Schema,v2AuditSchema} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
const obj=properties=>({type:'object',additionalProperties:false,properties,required:Object.keys(properties)});
const list=items=>({type:'array',items});
const str={type:'string'},strings=list(str),nullable=s=>({anyOf:[s,{type:'null'}]});
const ref=v2Schema.$defs.ref,refs=list(ref),views=list({type:'string',enum:['I','O','A','P','R','V','C','B']});
const interval=obj({lower:nullable(str),upper:nullable(str),lower_inclusive:{type:'boolean'},upper_inclusive:{type:'boolean'},unit:str,empty:{type:'boolean'}});
const truth=obj({bindings:list(obj({name:str,reference:nullable(ref)})),rows:list(obj({values:list({type:'boolean'}),result:{type:'boolean'}})),true_count:{type:'integer',minimum:0},false_count:{type:'integer',minimum:0}});
const graph=obj({nodes:refs,edges:list(obj({from:ref,to:ref})),acyclic:{type:'boolean'}});
export const boundaryCalculationSchema=obj({
 format:{const:'boundx-llm-boundary-calculation/1'},method_version:{const:'boundx-boundary-math/1'},
 constraints:list(obj({id:str,views,formula:str,requirement_refs:refs,source_refs:strings})),
 calculations:list(obj({id:str,title:str,method:{type:'string',enum:['SET','INTERVAL','LOGIC','GRAPH','CONDITIONAL','JOINT']},input_refs:refs,source_refs:strings,formula:str,result:str,steps:strings,assumptions:strings,evidence:obj({set_members:nullable(refs),cardinality:nullable({type:'integer',minimum:0}),interval:nullable(interval),truth_table:nullable(truth),graph:nullable(graph)})})),
 joint:obj({result:{type:'string',enum:['SAT','UNSAT','UNKNOWN']},domain:{type:'string',enum:['DECLARED_IR','SOURCE_BOUNDARY','FINITE_QUERY']},formula:str,constraint_ids:strings,witness_query_json:nullable(str),unsat_requirement_refs:refs,proof_steps:strings,assumptions:strings,limitations:strings}),
 coverage:list(obj({source_ref:str,constraint_ids:strings,status:{type:'string',enum:['REPRESENTED','GAP','UNSPECIFIED']},reason:str})),
 unresolved:list(obj({id:str,source_refs:strings,reason:str,suggestion:str}))
});
boundaryCalculationSchema.$defs=v2Schema.$defs;
export const calculationReviewSchema=list(obj({target:str,verdict:{type:'string',enum:['SUPPORT','CONTRADICT','UNCERTAIN']},source_refs:strings,reason:str}));
export function calculationOutputSchema(phase){
 const schema=structuredClone(phase==='parse'?v2Schema:v2AuditSchema);
 const field=phase==='parse'?'boundary_calculation':'calculation_reviews';
 schema.properties[field]=structuredClone(phase==='parse'?boundaryCalculationSchema:calculationReviewSchema);
 // Nested references still resolve against the response's root definitions.
 if(phase==='parse')delete schema.properties[field].$defs;
 schema.required.push(field);return schema;
}
export function irOnly(value){const {boundary_calculation,...ir}=value;return ir;}
export function auditOnly(value){const {calculation_reviews,...audit}=value;return audit;}
export const calculationTargets=c=>['joint','coverage',...(c?.constraints??[]).map(x=>x.id),...(c?.calculations??[]).map(x=>x.id)];
