// Runtime response extension. The authoritative IR/Core contract stays 2.0.
import {v2Schema,v2AuditSchema} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
const obj=properties=>({type:'object',additionalProperties:false,properties,required:Object.keys(properties)});
const list=items=>({type:'array',items});
const str={type:'string'},strings=list(str),nullable=s=>({anyOf:[s,{type:'null'}]});
const ref=v2Schema.$defs.ref,refs=list(ref),views=list({type:'string',enum:['I','O','A','P','R','V','C','B']});
const interval=obj({lower:nullable(str),upper:nullable(str),lower_inclusive:{type:'boolean'},upper_inclusive:{type:'boolean'},unit:str,empty:{type:'boolean'}});
const truth=obj({bindings:list(obj({name:str,reference:nullable(ref)})),rows:list(obj({values:list({type:'boolean'}),result:{type:'boolean'}})),true_count:{type:'integer',minimum:0},false_count:{type:'integer',minimum:0}});
const graph=obj({nodes:refs,edges:list(obj({from:ref,to:ref})),acyclic:{type:'boolean'}});
const expressionCases=nullable(list(obj({input_ref:obj({kind:{const:'EXPRESSION'},id:str}),context_json:str,expected:{anyOf:[{type:'boolean'},{const:'UNKNOWN'}]}})));
export const boundaryCalculationSchema=obj({
 format:{const:'boundx-llm-boundary-calculation/1'},method_version:{const:'boundx-boundary-math/1'},
 constraints:list(obj({id:str,views,formula:str,requirement_refs:refs,source_refs:strings})),
 calculations:list(obj({id:str,title:str,method:{type:'string',enum:['SET','INTERVAL','LOGIC','GRAPH','CONDITIONAL','JOINT']},input_refs:refs,source_refs:strings,formula:str,result:str,steps:strings,assumptions:strings,evidence:obj({set_members:nullable(refs),cardinality:nullable({type:'integer',minimum:0}),interval:nullable(interval),truth_table:nullable(truth),graph:nullable(graph)})})),
 joint:obj({result:{type:'string',enum:['SAT','UNSAT','UNKNOWN']},domain:{type:'string',enum:['DECLARED_IR','SOURCE_BOUNDARY','FINITE_QUERY']},formula:str,constraint_ids:strings,witness_query_json:nullable(str),unsat_requirement_refs:refs,proof_steps:strings,assumptions:strings,limitations:strings}),
 coverage:list(obj({source_ref:str,constraint_ids:strings,status:{type:'string',enum:['REPRESENTED','GAP','UNSPECIFIED']},reason:str})),
 unresolved:list(obj({id:str,source_refs:strings,reason:str,suggestion:str}))
});
boundaryCalculationSchema.$defs=v2Schema.$defs;
boundaryCalculationSchema.properties.calculations.items.properties.evidence.properties.expression_cases=expressionCases;
boundaryCalculationSchema.properties.calculations.items.properties.evidence.required.push('expression_cases');
truth.properties.formula_ref=nullable(obj({kind:{const:'EXPRESSION'},id:str}));truth.required.push('formula_ref');
boundaryCalculationSchema.properties.unresolved.items.properties.kind={type:'string',enum:['SOURCE_SEMANTICS','IR_REPRESENTATION','QUERY_SUPPORT','NORMAL_UNSPECIFIED']};
boundaryCalculationSchema.properties.unresolved.items.required.push('kind');
export const savedCalculationSchema=structuredClone(boundaryCalculationSchema);
savedCalculationSchema.properties.calculations.items.properties.evidence.required=savedCalculationSchema.properties.calculations.items.properties.evidence.required.filter(x=>x!=='expression_cases');
savedCalculationSchema.properties.unresolved.items.required=savedCalculationSchema.properties.unresolved.items.required.filter(x=>x!=='kind');
savedCalculationSchema.properties.calculations.items.properties.evidence.properties.truth_table.anyOf[0].required=savedCalculationSchema.properties.calculations.items.properties.evidence.properties.truth_table.anyOf[0].required.filter(x=>x!=='formula_ref');
export const calculationReviewSchema=list(obj({target:str,verdict:{type:'string',enum:['SUPPORT','CONTRADICT','UNCERTAIN']},source_refs:strings,reason:str}));
export function calculationOutputSchema(phase){
 const schema=structuredClone(phase==='parse'?v2Schema:v2AuditSchema);
 const field=phase==='parse'?'boundary_calculation':'calculation_reviews';
 schema.properties[field]=structuredClone(phase==='parse'?boundaryCalculationSchema:calculationReviewSchema);
 // Nested references still resolve against the response's root definitions.
 if(phase==='parse')delete schema.properties[field].$defs;
 schema.required.push(field);
 if(phase==='audit')schema.properties.omissions.items.required.push('repairability');
 return schema;
}
export function irOnly(value){const {boundary_calculation,...ir}=value;return ir;}
export function auditOnly(value){const {calculation_reviews,...audit}=value;return audit;}
export const calculationTargets=c=>['joint',...(c?.coverage??[]).map(x=>'coverage.'+x.source_ref),...(c?.constraints??[]).map(x=>x.id),...(c?.calculations??[]).map(x=>x.id),...(c?.unresolved??[]).map(x=>x.id)];
export function calculationAuditBundle(bundle,c){
 if(!c)return bundle;
 const schema=structuredClone(bundle.schema);
 schema.properties.calculation_reviews.items.properties.target={type:'string',enum:[...new Set(calculationTargets(c))]};
 schema.properties.calculation_reviews.minItems=calculationTargets(c).length;
 return {...bundle,schema};
}
