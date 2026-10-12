import {candidateSchema} from './contracts/candidate-ir-v1/schema.mjs';import {sha256} from './source.mjs';
export const patchSchema={type:'object',additionalProperties:false,required:['format','contract_version','base_ir_sha256','reason',...Object.keys(candidateSchema.properties).filter(k=>!['format','contract_version'].includes(k))],properties:{...candidateSchema.properties,format:{type:'string',const:'boundx-candidate-ir-patch/1'},base_ir_sha256:{type:'string',minLength:64,maxLength:64},reason:{type:'string',minLength:1}},$defs:candidateSchema.$defs};
export function revisionBundle(bundle){const text=bundle.text+'\n有界局部修订：输出boundx-candidate-ir-patch/1，base_ir_sha256为宿主指定摘要。各集合只列新增或需替换节点，空集合表示不修改。不得删除、重建整图或改变无关事实。只修ACTUAL_AUDIT_ISSUES或宿主缺审节点；新增DATA_USE和必要表达式可引用原图既有节点。保留来源，所有修订另由独立会话审阅。';return {...bundle,schema:patchSchema,text,sha256:sha256(text)};}
export function applyIRPatch(base,patch,{allowed_replacements=[]}={}){
 if(patch.base_ir_sha256!==sha256(JSON.stringify(base)))throw Error('PATCH_BASE_DIGEST_MISMATCH');
 if(patch.contract_version!==base.contract_version)throw Error('PATCH_CONTRACT_MISMATCH');
 const out=structuredClone(base),allowed=new Set(allowed_replacements),changed=[];
 const globalIds=new Map(['source_table','entities','variables','events','states','expressions','requirements','issues'].flatMap(k=>base[k].map(n=>[n.id,k])));
 for(const collection of ['source_table','entities','variables','events','states','expressions','requirements','issues'])for(const node of patch[collection]){
  const oldCollection=globalIds.get(node.id);if(oldCollection&&oldCollection!==collection)throw Error('PATCH_GLOBAL_ID_COLLISION');
  const at=out[collection].findIndex(x=>x.id===node.id);
  if(at>=0){if(JSON.stringify(out[collection][at])===JSON.stringify(node))continue;if(collection==='source_table'||!allowed.has(node.id))throw Error('PATCH_UNRELATED_REPLACEMENT:'+node.id);out[collection][at]=node;}else{out[collection].push(node);globalIds.set(node.id,collection);}
  changed.push({collection,id:node.id,operation:at<0?'ADD':'REPLACE'});
 }
 out.coverage.push(...patch.coverage);return {ir:out,changed};
}
