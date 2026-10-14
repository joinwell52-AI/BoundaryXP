// Transport and review binding only. No inference from source text or labels.
import {v2Schema,v2AuditSchema,collections} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
import {sha256} from './source.mjs';
export const boundaryProfile='DECLARATIVE_BOUNDARY_R01';
export function boundarySchema(phase){
 const s=structuredClone(phase==='parse'?v2Schema:v2AuditSchema);
 if(phase==='parse'){
  const compact=x=>{if(!x||typeof x!=='object')return x;if(x.$ref==='#/$defs/ref')return {type:'string',minLength:1};return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,Array.isArray(v)?v.map(compact):compact(v)]));};
  const wire=compact(s);wire.properties.format={const:'boundx-boundary/1'};delete wire.$defs;
  delete wire.properties.requirements.items.properties.note;wire.properties.requirements.items.required=wire.properties.requirements.items.required.filter(k=>k!=='note');return wire;
 }
 delete s.properties.source_table;s.required=s.required.filter(k=>k!=='source_table');
 s.properties.candidate_sha256={type:'string',minLength:64,maxLength:64};
 s.properties.examined_source_ids={type:'array',items:{type:'string'}};
 s.properties.support_groups={type:'array',items:{type:'object',additionalProperties:false,properties:{ids:{type:'array',items:{type:'string'}},field_path:{type:'string'},reason:{type:'string'}},required:['ids','field_path','reason']}};
 s.required.push('candidate_sha256','examined_source_ids','support_groups');
 if(!s.properties.omissions.items.required.includes('repairability'))s.properties.omissions.items.required.push('repairability');
 return s;
}
function mapReferences(value,schema,fn){
 if(value==null)return value;if(schema.$ref==='#/$defs/ref')return fn(value);
 if(schema.anyOf)return mapReferences(value,schema.anyOf.find(s=>s.type!=='null'),fn);
 if(Array.isArray(value))return value.map(v=>mapReferences(v,schema.items??{},fn));
 if(typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,mapReferences(v,schema.properties?.[k]??{},fn)]));return value;
}
export function compactDeclaration(ir){const wire=mapReferences(ir,v2Schema,r=>r.id);wire.format='boundx-boundary/1';for(const r of wire.requirements)if(!r.note)delete r.note;return wire;}
export function expandDeclaration(value){
 if(value?.format!=='boundx-boundary/1')return value;
 const ids=new Map();for(const [k,kind]of Object.entries(collections))for(const n of value[k]){if(ids.has(n.id))throw Error('BOUNDARY_DUPLICATE_ID');ids.set(n.id,kind);}
 const ir=mapReferences(value,v2Schema,id=>{if(!ids.has(id))throw Error('BOUNDARY_REFERENCE_MISSING:'+id);return {kind:ids.get(id),id};});
 ir.format='boundx-candidate-ir/1';for(const r of ir.requirements)r.note=r.note??'';return ir;
}
export const boundaryReviewInput=ir=>({...compactDeclaration(ir),audit_binding:{candidate_sha256:sha256(JSON.stringify(ir))}});
export function expandBoundaryAudit(value,candidate){
 if(!Object.hasOwn(value,'candidate_sha256'))return value;
 const {audit_binding,technical_precheck,...wire}=candidate??{},ir=expandDeclaration(wire);
 if(!audit_binding||value.candidate_sha256!==audit_binding.candidate_sha256||sha256(JSON.stringify(ir))!==value.candidate_sha256)throw Error('BOUNDARY_AUDIT_DIGEST_MISMATCH');
 const {candidate_sha256,examined_source_ids,support_groups,...audit}=value;
 const sources=new Set(ir.source_table.map(s=>s.id));
 if(new Set(examined_source_ids).size!==examined_source_ids.length||examined_source_ids.some(id=>!sources.has(id)))throw Error('BOUNDARY_AUDIT_SOURCE_REFERENCE');
 const nodes=new Map(Object.entries(collections).flatMap(([k,kind])=>ir[k].map(n=>[n.id,{kind,node:n}])));
 const reviews=[...audit.reviews];
 for(const group of support_groups){if(!group.reason)throw Error('BOUNDARY_AUDIT_REASON_REQUIRED');for(const id of group.ids){
  const entry=nodes.get(id);if(!entry)throw Error('BOUNDARY_AUDIT_TARGET');
  if(reviews.some(r=>r.target.id===id&&r.field_path===group.field_path))throw Error('BOUNDARY_AUDIT_DUPLICATE_TARGET');
  reviews.push({target:{kind:entry.kind,id},field_path:group.field_path,verdict:'SUPPORT',context_refs:[],source_refs:entry.node.source_refs,reason:group.reason});
 }}
 // Missing review is an explicit gap; never auto-support omitted nodes or sources.
 const omissions=[...audit.omissions,...[...sources].filter(id=>!examined_source_ids.includes(id)).map(id=>({source_refs:[id],affected_views:[],reason:'独立审阅未确认核对本条来源',repairability:'REPAIRABLE'}))];
 return {...audit,source_table:structuredClone(ir.source_table),reviews,omissions};
}
