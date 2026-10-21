import fs from 'node:fs';import {fileURLToPath} from 'node:url';import Ajv from 'ajv';
import {wireProposalSchema,encodeProposal,decodeProposal,validateWire} from './compact-wire.mjs';import {sha256} from './source.mjs';
import {identityInventory} from './identity.mjs';
export const revisionWireVersion='COMPACT_SEMANTIC_PATCH_R01';
const clone=x=>structuredClone(x),groups=['entities','events','claims','expressions','issues'];
const obj=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const arr=items=>({type:'array',items}),id={type:'string',minLength:1},refs={$ref:'#/$defs/sourceRefs'};
export const revisionWireSchema={$defs:clone(wireProposalSchema.$defs),...obj({
 transport_version:{type:'string',const:revisionWireVersion},base_candidate_sha256:id,disposition:{type:'string',enum:['PATCH','NO_SAFE_CHANGE']},
 source_additions:arr({$ref:'#/$defs/sourceEntry'}),
 upserts:obj(Object.fromEntries(groups.map(g=>[g,arr(clone(wireProposalSchema.properties[g].items))]))),
 coverage_updates:arr(obj({index:{type:'integer',minimum:0},value:clone(wireProposalSchema.properties.coverage.items)})),
 retirements:arr(obj({collection:{type:'string',enum:groups},id,source_refs:refs,reason:{type:'string',minLength:1}})),
 reason:{type:'string',minLength:1}
})};
const check=new Ajv({allErrors:true,strict:false}).compile(revisionWireSchema);
export function validateRevisionWire(value){return {ok:check(value),errors:clone(check.errors??[])};}
export const revisionBaseDigest=canonical=>sha256(JSON.stringify(encodeProposal(canonical)));
export function applyRevisionPatch(canonical,patch,feedback){
 const valid=validateRevisionWire(patch);if(!valid.ok)throw Object.assign(Error('REVISION_WIRE_SCHEMA_INVALID'),{check:valid});
 const base=encodeProposal(canonical),digest=sha256(JSON.stringify(base));
 if(patch.base_candidate_sha256!==digest)throw Error('REVISION_BASE_DIGEST_MISMATCH');
 const changes=groups.reduce((n,g)=>n+patch.upserts[g].length,0)+patch.source_additions.length+patch.coverage_updates.length+patch.retirements.length;
 if(patch.disposition==='NO_SAFE_CHANGE'){
  if(changes)throw Error('NO_CHANGE_WITH_MUTATIONS');
  return {value:clone(canonical),wire:base,no_change:true,evidence:{transport_version:revisionWireVersion,base_candidate_sha256:digest,no_change:true,reason:patch.reason,semantic_choices_inferred:0,preserved_all_nodes:true,gaps_preserved:true}};
 }
 if(!changes)throw Error('EMPTY_PATCH');
 const next=clone(base),touched=new Set(),operations=[];
 const sourceIds=new Set(base.source_table.map(s=>s.id));
 for(const s of patch.source_additions){if(sourceIds.has(s.id))throw Error('PATCH_SOURCE_ID_COLLISION');sourceIds.add(s.id);next.source_table.push(clone(s));}
 for(const g of groups)for(const n of patch.upserts[g]){
  const key=g+'/'+n.id;if(touched.has(key))throw Error('PATCH_DUPLICATE_OPERATION');touched.add(key);
  const index=next[g].findIndex(x=>x.id===n.id);operations.push({operation:index<0?'ADD':'REPLACE',collection:g,id:n.id,before_sha256:index<0?null:sha256(JSON.stringify(next[g][index])),after_sha256:sha256(JSON.stringify(n))});
  if(index<0)next[g].push(clone(n));else next[g][index]=clone(n);
 }
 const coverageIds=new Set();
 for(const u of patch.coverage_updates){if(coverageIds.has(u.index)||u.index>next.coverage.length)throw Error('PATCH_COVERAGE_INDEX_INVALID');coverageIds.add(u.index);next.coverage[u.index]=clone(u.value);}
 // Invalid formatting/ownership is permission to repair, never to delete a
 // source limitation. Retirement needs actual semantic contradiction evidence.
 const initialIdentities=identityInventory(base);
 const authorized=new Set((feedback?.reviews??[]).filter(r=>r.verdict==='CONTRADICT'&&initialIdentities.get(r.subject_id)?.length===1).map(r=>r.subject_id));
 for(const r of patch.retirements){
  const key=r.collection+'/'+r.id;if(touched.has(key))throw Error('PATCH_DUPLICATE_OPERATION');touched.add(key);
  const index=next[r.collection].findIndex(n=>n.id===r.id);if(index<0)throw Error('PATCH_RETIRE_MISSING_NODE');
  if(r.source_refs.some(id=>!sourceIds.has(id)))throw Error('PATCH_RETIRE_SOURCE_MISSING');
  if(!authorized.has(r.id))throw Error('PATCH_RETIRE_NOT_SUPPORTED_BY_ACTUAL_REVIEW');
  operations.push({operation:'RETIRE',collection:r.collection,id:r.id,reason:r.reason,source_refs:r.source_refs,before_sha256:sha256(JSON.stringify(next[r.collection][index]))});next[r.collection].splice(index,1);
 }
 // Global ID and source uniqueness are mechanical properties. Dangling semantic
 // references remain subject to the unchanged full technical validator.
 // An old malformed candidate may be replayed, but a patch may never create
 // another collision. Existing duplicates are mechanically renamed by decode;
 // their ambiguous references stay explicit and require an independent audit.
 for(const [id,entries] of identityInventory(next))if(entries.length>1){
  const before=initialIdentities.get(id)??[];
  if(entries.length!==before.length||entries.some(e=>!before.some(b=>b.collection===e.collection&&b.index===e.index)))throw Error('PATCH_GLOBAL_ID_COLLISION');
 }
 const full=validateWire('proposal',next);if(!full.ok)throw Object.assign(Error('PATCH_MERGED_WIRE_INVALID'),{check:full});
 const decoded=decodeProposal(next),preserved=[];
 for(const g of groups)for(const n of base[g])if(!touched.has(g+'/'+n.id)){
  const remaining=next[g].find(x=>x.id===n.id);if(JSON.stringify(n)!==JSON.stringify(remaining))throw Error('PATCH_UNTOUCHED_NODE_CHANGED');
  preserved.push({collection:g,id:n.id,sha256:sha256(JSON.stringify(n))});
 }
 return {value:decoded.value,wire:next,no_change:false,evidence:{...decoded.evidence,revision_transport:revisionWireVersion,base_candidate_sha256:digest,operations,preserved_nodes:preserved,coverage_updates:patch.coverage_updates.map(u=>u.index),semantic_choices_inferred:0}};
}
if(process.argv[1]===fileURLToPath(import.meta.url))fs.writeFileSync(new URL('./contracts/wire-revision.schema.json',import.meta.url),JSON.stringify(revisionWireSchema)+'\n');
