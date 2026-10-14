import {candidateSchema} from './contracts/candidate-ir-v1/schema.mjs';import {sha256} from './source.mjs';
import {v2Schema} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
import {boundaryCalculationSchema} from './boundary-calculation-schema.mjs';
import {calculationPatchSchema} from './calculation-patch.mjs';
import {isDeepStrictEqual} from 'node:util';
// Only explanatory text in existing issue/coverage records may be ignored.
// Status, kind, references, source text, labels and every mathematical field
// must still be identical. Retain the already-audited original IR in this case.
export function explanationOnlyPatch(base,next){
 const withoutExplanation=ir=>{const copy=structuredClone(ir);for(const k of ['issues','coverage'])for(const x of copy[k]??[])x.reason='';return copy;};
 return !isDeepStrictEqual(base,next)&&isDeepStrictEqual(withoutExplanation(base),withoutExplanation(next));
}
export const patchSchema={type:'object',additionalProperties:false,required:['format','contract_version','base_ir_sha256','reason','coverage_updates','removed_nodes',...Object.keys(candidateSchema.properties).filter(k=>!['format','contract_version'].includes(k))],properties:{...candidateSchema.properties,removed_nodes:{type:'array',items:{$ref:'#/$defs/ref'}},coverage_updates:{type:'array',items:{type:'object',additionalProperties:false,required:['previous_index','replacement'],properties:{previous_index:{type:'integer',minimum:0},replacement:candidateSchema.properties.coverage.items}}},format:{type:'string',const:'boundx-candidate-ir-patch/1'},base_ir_sha256:{type:'string',minLength:64,maxLength:64},reason:{type:'string',minLength:1}},$defs:candidateSchema.$defs};
export const kernelPatchSchema={...structuredClone(patchSchema),properties:{...structuredClone(patchSchema.properties),...structuredClone(v2Schema.properties),format:structuredClone(patchSchema.properties.format)},required:[...patchSchema.required,'root_task','sequences'],$defs:v2Schema.$defs};
export function revisionPermissions(base,audit,technical){
 const flagged=new Set([...technical.errors.map(e=>e.node_id??e.id),...audit.issues.flatMap(i=>i.targets.map(t=>t.id)),...audit.reviews.filter(r=>r.verdict!=='SUPPORT').map(r=>r.target.id),...technical.rows.filter(r=>r.missing_review_fields?.length).map(r=>r.id)]);
 const replacements=technical.rows.filter(r=>r.status!=='ACCEPTED'&&(technical.technical_ok||flagged.has(r.id))).map(r=>r.id);
 // Issues are not acceptance rows. Link them through audited node AND source identity.
 // Never authorize all issues merely because a patch is requested.
 for(const issue of base.issues){if(audit.issues.some(problem=>problem.targets.some(t=>issue.targets.some(u=>u.kind===t.kind&&u.id===t.id))&&problem.source_refs.some(s=>issue.source_refs.includes(s))))replacements.push(issue.id);}
 for(const issue of base.issues)if(issue.kind==='EXPRESSION_GAP'&&!issue.targets.length&&(audit.omissions??[]).some(o=>o.source_refs.length===issue.source_refs.length&&issue.source_refs.every(s=>o.source_refs.includes(s))))replacements.push(issue.id);
 const coverage_indices=base.coverage.flatMap((row,index)=>{
  const matching=(audit.omissions??[]).some(o=>row.source_refs.length===o.source_refs.length&&row.source_refs.every(s=>o.source_refs.includes(s)))||(audit.issues??[]).some(i=>i.field_path==='coverage'&&row.source_refs.length===i.source_refs.length&&row.source_refs.every(s=>i.source_refs.includes(s)));
  return matching?[index]:[];
 });
 return {replacements:[...new Set(replacements)],coverage_indices,removals:[...audit.reviews.filter(r=>r.verdict==='CONTRADICT'&&!r.field_path).map(r=>r.target.id),...technical.errors.filter(e=>e.code==='DATA_CONSUMER_EVENT').map(e=>e.id)]};
}
export function revisionBundle(bundle){let text=bundle.text+'\n有界局部修订：输出boundx-candidate-ir-patch/1，base_ir_sha256为宿主摘要。各集合只列新增或获准替换节点，空集合不修改。不得重建整图或改变无关事实。removed_nodes仅允许removable_node_ids内被审阅CONTRADICT或程序证实消费者类型错误的候选，真实边界及UNCERTAIN节点不能删除；原文要求必须在正确节点中保留，引用和coverage须同步修正。coverage_updates保留原行索引及同一来源。只修实际审阅、technical_errors和缺审问题；所有修订由独立新会话再次审阅。'+(bundle.contract_version==='candidate-ir/2.0'?' root_task必须原样保留；sequences只列新增或获准替换的序列，空数组不修改。':'');let schema=bundle.contract_version==='candidate-ir/2.0'?kernelPatchSchema:patchSchema;
 if(bundle.request_profile==='LLM_BOUNDARY_CALCULATION_R03'){schema=structuredClone(schema);const calculation=structuredClone(calculationPatchSchema);delete calculation.$defs;schema.properties.calculation_patch={anyOf:[calculation,{type:'null'}]};schema.required.push('calculation_patch');text+=' 计算修订仅输出calculation_patch（无变更为null），format=boundx-calculation-patch/1，base_calculation_sha256使用宿主提供的摘要。constraints/calculations/unresolved按id、coverage按source_ref合并，空数组保留原项；只列真正变化项。删除必须明列remove_*_ids，不得因省略丢弃边界；joint=null保留原联合结论。evidence_contexts只列新的证据，允许引用输入候选已有ctx编号但不可改写其内容；joint或计算对照使用witness_context_id/context_id。必要时新增唯一ctx编号。IR修改影响计算时同步修订受影响项，合并后的完整IR和计算将重新独立审阅。不得重输整份未变计算。';}
 else if(['LLM_BOUNDARY_CALCULATION_R01','LLM_BOUNDARY_CALCULATION_R02'].includes(bundle.request_profile)){schema=structuredClone(schema);const calculation=structuredClone(boundaryCalculationSchema);delete calculation.$defs;schema.properties.boundary_calculation={anyOf:[calculation,{type:'null'}]};schema.required.push('boundary_calculation');text+=' boundary_calculation=null表示不改计算；非null须为完整替换，不能用省略表示删除。';}
 return {...bundle,schema,text,sha256:sha256(text)};}
export function applyIRPatch(base,patch,{allowed_replacements=[],allowed_coverage_targets=[],allowed_coverage_indices=[],allowed_removals=[],authorized_contract_transition=null}={}){
 if(patch.base_ir_sha256!==sha256(JSON.stringify(base)))throw Error('PATCH_BASE_DIGEST_MISMATCH');
 const transition=patch.contract_version!==base.contract_version;
 if(transition&&!(authorized_contract_transition?.from===base.contract_version&&authorized_contract_transition?.to===patch.contract_version&&patch.contract_version===candidateSchema.properties.contract_version.const))throw Error('PATCH_CONTRACT_MISMATCH');
 const out=structuredClone(base),allowed=new Set(allowed_replacements),changed=[];
 if(base.contract_version==='candidate-ir/2.0'&&patch.root_task&&JSON.stringify(patch.root_task)!==JSON.stringify(base.root_task))throw Error('PATCH_ROOT_CHANGED');
 for(const sequence of patch.sequences??[]){const at=out.sequences.findIndex(s=>s.template.id===sequence.template.id);if(at>=0){if(JSON.stringify(out.sequences[at])===JSON.stringify(sequence))continue;if(!allowed.has(sequence.template.id))throw Error('PATCH_UNRELATED_SEQUENCE');if(JSON.stringify(out.sequences[at].source_refs)!==JSON.stringify(sequence.source_refs))throw Error('PATCH_SEQUENCE_SOURCE_CHANGED');out.sequences[at]=sequence;}else out.sequences.push(sequence);changed.push({collection:'sequences',id:sequence.template.id,operation:at<0?'ADD':'REPLACE'});}
 if(transition)out.contract_version=patch.contract_version;
 const globalIds=new Map(['source_table','entities','variables','events','states','expressions','requirements','issues'].flatMap(k=>base[k].map(n=>[n.id,k])));
 for(const collection of ['source_table','entities','variables','events','states','expressions','requirements','issues'])for(const node of patch[collection]){
  const oldCollection=globalIds.get(node.id);if(oldCollection&&oldCollection!==collection)throw Error('PATCH_GLOBAL_ID_COLLISION');
  const at=out[collection].findIndex(x=>x.id===node.id);
  if(at>=0){if(JSON.stringify(out[collection][at])===JSON.stringify(node))continue;if(collection==='source_table'||!allowed.has(node.id))throw Error('PATCH_UNRELATED_REPLACEMENT:'+node.id);out[collection][at]=node;}else{out[collection].push(node);globalIds.set(node.id,collection);}
  changed.push({collection,id:node.id,operation:at<0?'ADD':'REPLACE'});
 }
 for(const ref of patch.removed_nodes??[]){const collection=globalIds.get(ref.id),at=collection&&out[collection].findIndex(n=>n.id===ref.id);if(!allowed_removals.includes(ref.id)||!collection||collection==='source_table'||at<0)throw Error('PATCH_UNAUTHORIZED_REMOVAL');const expected={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'}[collection];if(ref.kind!==expected)throw Error('PATCH_REMOVAL_TYPE');const previous=out[collection][at];out[collection].splice(at,1);changed.push({collection,id:ref.id,operation:'REMOVE_CONTRADICTED_CANDIDATE',previous});}
 const updated=new Set(),permitted=new Set([...allowed_replacements,...allowed_coverage_targets,...allowed_removals,...changed.map(c=>c.id)]);
 for(const update of patch.coverage_updates??[]){const i=update.previous_index,old=base.coverage[i],next=update.replacement;if(!old||updated.has(i))throw Error('PATCH_COVERAGE_INDEX');if(!allowed_coverage_indices.includes(i)&&!old.node_refs.some(r=>permitted.has(r.id)))throw Error('PATCH_UNRELATED_COVERAGE');if(JSON.stringify([...old.source_refs].sort())!==JSON.stringify([...next.source_refs].sort()))throw Error('PATCH_COVERAGE_SOURCE_CHANGED');out.coverage[i]=next;updated.add(i);changed.push({collection:'coverage',id:null,operation:'REPLACE_COVERAGE',previous_index:i,previous:old,replacement:next});for(const ref of next.node_refs)changed.push({collection:'coverage',id:ref.id,operation:'REPLACE_COVERAGE',previous_index:i,previous:old,replacement:next});}
 out.coverage.push(...patch.coverage);return {ir:out,changed};
}
