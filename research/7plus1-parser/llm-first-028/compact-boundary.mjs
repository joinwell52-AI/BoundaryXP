// Lossless transport compression, never semantic inference or default acceptance.
import {isDeepStrictEqual} from 'node:util';
const list=items=>({type:'array',items}),str={type:'string'};
const obj=properties=>({type:'object',additionalProperties:false,properties,required:Object.keys(properties)});
export function compactBoundaryCandidate(value){
 if(!value.boundary_calculation)return value;
 const copy=structuredClone(value),c=copy.boundary_calculation,contexts=new Map();
 const id=json=>{if(!contexts.has(json))contexts.set(json,'ctx'+(contexts.size+1));return contexts.get(json);};
 for(const r of copy.requirements)if(r.note==='')delete r.note;
 for(const item of c.calculations){if(!item.steps?.length)delete item.steps;for(const entry of item.evidence.expression_cases??[]){entry.context_id=id(entry.context_json);delete entry.context_json;}}
 c.joint.witness_context_id=c.joint.witness_query_json===null?null:id(c.joint.witness_query_json);delete c.joint.witness_query_json;
 c.evidence_contexts=[...contexts].map(([context_json,id])=>({id,context_json}));return copy;
}
export function compactBoundarySchema(schema,phase){
 const s=structuredClone(schema);
 if(phase==='parse'){
  const r=s.properties.requirements.items;delete r.properties.note;r.required=r.required.filter(k=>k!=='note');
  const c=s.properties.boundary_calculation.properties.calculations.items;delete c.properties.steps;c.required=c.required.filter(k=>k!=='steps');
  const calculation=s.properties.boundary_calculation;
  calculation.properties.evidence_contexts=list(obj({id:str,context_json:str}));calculation.required.push('evidence_contexts');
  const cases=c.properties.evidence.properties.expression_cases.anyOf[0].items;
  delete cases.properties.context_json;cases.properties.context_id=str;cases.required=cases.required.map(k=>k==='context_json'?'context_id':k);
  const joint=calculation.properties.joint;delete joint.properties.witness_query_json;joint.properties.witness_context_id={anyOf:[str,{type:'null'}]};joint.required=joint.required.map(k=>k==='witness_query_json'?'witness_context_id':k);
 }else{
  delete s.properties.source_table;s.required=s.required.filter(k=>k!=='source_table');
  s.properties.use_candidate_source_table={const:true};
  s.properties.support_groups=list(obj({targets:list(s.$defs.ref),field_path:str,source_refs:list(str),reason:str}));
  s.properties.calculation_support_groups=list(obj({targets:list(str),source_refs:list(str),reason:str}));
  s.required.push('use_candidate_source_table','support_groups','calculation_support_groups');
 }
 return s;
}
export function expandCompactBoundary(value,candidate=null){
 if(value.use_candidate_source_table!==true){
  if(value.boundary_calculation&&value.requirements){
   const {evidence_contexts,...calculation}=value.boundary_calculation,contexts=new Map((evidence_contexts??[]).map(c=>[c.id,c.context_json]));
   if(contexts.size!==(evidence_contexts??[]).length)throw Error('DUPLICATE_CALCULATION_CONTEXT');
   const get=id=>{if(!contexts.has(id))throw Error('CALCULATION_CONTEXT_MISSING:'+id);return contexts.get(id);};
   if(evidence_contexts){const {witness_context_id,...joint}=calculation.joint;calculation.joint={...joint,witness_query_json:witness_context_id===null?null:get(witness_context_id)};}
   calculation.calculations=calculation.calculations.map(c=>({...c,steps:c.steps??[],evidence:{...c.evidence,...(evidence_contexts?{expression_cases:c.evidence.expression_cases?.map(({context_id,...entry})=>({...entry,context_json:get(context_id)}))??null}:{})}}));
   return {...value,requirements:value.requirements.map(r=>({...r,note:r.note??''})),boundary_calculation:calculation};
  }
  return value;
 }
 if(!candidate?.source_table)throw Error('COMPACT_AUDIT_SOURCE_REQUIRED');
 const {use_candidate_source_table,support_groups,calculation_support_groups,...audit}=value;
 const sourceIds=new Set(candidate.source_table.map(s=>s.id)),nodes=new Map(Object.entries({entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'}).flatMap(([k,kind])=>candidate[k].map(n=>[n.id,kind])));
 const checkSources=g=>{if(!g.reason||!g.source_refs.length||g.source_refs.some(id=>!sourceIds.has(id)))throw Error('COMPACT_AUDIT_SOURCE_REFERENCE');};
 const reviews=[...(audit.reviews??[])],calculation_reviews=[...(audit.calculation_reviews??[])];
 for(const g of support_groups){checkSources(g);for(const target of g.targets){if(nodes.get(target.id)!==target.kind)throw Error('COMPACT_AUDIT_TARGET');const r={target,field_path:g.field_path,verdict:'SUPPORT',context_refs:[],source_refs:g.source_refs,reason:g.reason};if(reviews.some(x=>isDeepStrictEqual(x.target,target)&&x.field_path===g.field_path))throw Error('COMPACT_AUDIT_DUPLICATE_TARGET');reviews.push(r);}}
 for(const g of calculation_support_groups){checkSources(g);for(const target of g.targets){if(calculation_reviews.some(x=>x.target===target))throw Error('COMPACT_AUDIT_DUPLICATE_TARGET');calculation_reviews.push({target,verdict:'SUPPORT',source_refs:g.source_refs,reason:g.reason});}}
 return {...audit,source_table:structuredClone(candidate.source_table),reviews,calculation_reviews};
}
