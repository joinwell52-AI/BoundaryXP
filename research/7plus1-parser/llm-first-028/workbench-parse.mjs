// Host-only adapter: saved clause parsing is separate from node generation.
import fs from 'node:fs';import path from 'node:path';
import {sha256,prepareSource} from './source.mjs';
import {callCodex,probeCodex} from './provider.mjs';
import {stable} from '../../../src/bxp/ir-kernel/values.mjs';
import {indexBoundary,ancestors} from '../../../src/bxp/workbench-model.mjs';
import {lowerReviewedPlan} from '../../../src/bxp/workbench-lowering.mjs';
import {normalizeBindingCoverage,bindingCompatible,bindingIssues,supplementsParentDuty} from '../../../src/bxp/workbench-binding.mjs';
import {bindProgramIdentities} from '../../../src/bxp/workbench-program-binding.mjs';
import {valueBindingPatch,eventBindingPatch,domainIdentityView,orderIdentityView,selectionBindingPatch} from '../../../src/bxp/workbench-member-binding.mjs';
import {applySymbolBindings} from '../../../src/bxp/workbench-symbol-binding.mjs';
import {validateFormal} from '../../../src/bxp/workbench-formal.mjs';
import {compareProgramPlan} from '../../../src/bxp/workbench-program.mjs';
import {validateCalculationPlan} from '../../../src/bxp/workbench-math-plan.mjs';
import {mathematicalTargets,requireMathematicalPlans} from './workbench-math-targets.mjs';
import {validateCompiledModels} from '../../../src/bxp/workbench-compiled-models.mjs';
import {applySemanticRevisions,synchronizeRevisionReferences} from './workbench-semantic-revisions.mjs';
export const PARSER_VERSION='saved-7plus1-parse/10';
const parserResources=()=>['local-parse/SKILL.md','full-math-parse/SKILL.md','seven-plus-one-relations.md','mathematical-expression.md'].map(name=>{const file='workbench-skills/'+name,text=fs.readFileSync(new URL(file,import.meta.url),'utf8');return {path:file,text,sha256:sha256(text)};});
const instructions=()=>parserResources().map(r=>r.text).join('\n\n');
export function decodeSavedParse(text){
 const raw=text.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'');
 try{return {patch:JSON.parse(raw),closure_repair:null};}catch(original){
  // Only close containers after a complete object/array. Never invent a value,
  // finish a string/number, remove tokens, or change an existing field.
  if(!/[}\]]$/.test(raw))throw original;
  const stack=[];let quoted=false,escaped=false;
  for(const char of raw){
   if(quoted){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')quoted=false;continue;}
   if(char==='"')quoted=true;
   else if(char==='{'||char==='[')stack.push(char);
   else if(char==='}'||char===']'){if(stack.pop()!==(char==='}'?'{':'['))throw original;}
  }
  if(quoted||escaped||!stack.length||stack.length>128)throw original;
  const suffix=stack.reverse().map(c=>c==='{'?'}':']').join('');
  try{return {patch:JSON.parse(raw+suffix),closure_repair:suffix};}catch{throw original;}
 }
}
export const parsingIdentity=()=>sha256(['../../../src/bxp/workbench-member-binding.mjs','../../../src/bxp/workbench-symbol-binding.mjs','../../../src/bxp/workbench-program-binding.mjs','../../../src/bxp/workbench-binding.mjs','../../../src/bxp/workbench-lowering.mjs','../../../src/bxp/workbench-math-plan.mjs','../../../src/bxp/workbench-unit-algebra.mjs','../../../src/bxp/workbench-mathematical-expression.mjs','../../../src/bxp/workbench-time-coordinate.mjs','../../../src/bxp/workbench-compiled-models.mjs','./workbench-parse.mjs','./workbench-math-targets.mjs','./workbench-semantic-revisions.mjs'].map(file=>fs.readFileSync(new URL(file,import.meta.url),'utf8')).join('\n')+instructions());
// No task original, expected answer, old comparison or generation instructions.
function savedInput(plan,boundaries){return plan.nodes.map(n=>({node_id:n.id,parent_id:n.parent_id,boundary:boundaries[n.id]?.boundary,review:boundaries[n.id]?.review}));}
function parseKey(plan,boundaries,settings,version=parsingIdentity()){return sha256(stable({version,saved:savedInput(plan,boundaries),model:settings.model,reasoning:settings.reasoning}));}
// Exact ui199 -> ui200 host-metadata compatibility. Core, skills and operands
// are byte-identical; never reuse model verdicts or unverified source changes.
const compatibleParserIdentities=["49a4c33cbcdfd4cff100421cd9bc6753531d7255f2cda28648e0b5cf631640d8"].concat("b7d7e295b4e943b72cbefb661921124e8b1ab1f7efc69f9d9dc0352a38c13775");
function local(plan,boundaries){
 const checked=Object.fromEntries(plan.nodes.map(n=>[n.id,{boundary:indexBoundary(boundaries[n.id]?.boundary,n.text),review:boundaries[n.id]?.review}]));
 const lowered=lowerReviewedPlan({plan,boundaries:checked});
 // Unsupported material is never silently dropped merely because axes differ.
 for(const row of Object.values(lowered.boundaries))for(const cv of row.boundary.formal?.coverage??[])if(cv.kind==='CONTEXT'&&cv.reason.startsWith('本次父边界未限制'))cv.kind='UNSUPPORTED';
 const linked=bindProgramIdentities(plan,lowered.boundaries);lowered.boundaries=linked.boundaries;lowered.bindings.push(...linked.bindings);return lowered;
}
export function parserInput(plan,lowered){return {scope:'FULL_SAVED_7PLUS1_SEMANTIC_PARSE',comparison_purpose:'PRE_EXECUTION_PARENT_CHILD_BOUNDARY_PRESERVATION',nodes:plan.nodes.map(n=>{
 const b=lowered.boundaries[n.id].boundary,gaps=new Set((b.formal?.coverage??[]).filter(c=>c.kind==='UNSUPPORTED'||c.unresolved?.length).map(c=>c.clause_id));
 // A contradictory coverage marker is an interface gap even when it was
 // not explicitly labelled UNSUPPORTED by the producer.
 for(const cv of b.formal?.coverage??[])if(['CONTEXT','INHERITED'].includes(cv.kind)&&cv.constraint_ids?.length)gaps.add(cv.clause_id);
 const invalid=validateFormal(b,lowered.boundaries[n.id].review).filter(e=>e.constraint_id&&!e.code&&(b.formal?.constraints??[]).some(c=>c.id===e.constraint_id));
 const invalidIds=new Set(invalid.map(e=>e.constraint_id));
 // An invalid emitted operand is a repair target too; valid operands from
 // that same clause stay locked. No values or meanings are inferred here.
 for(const e of invalid)for(const id of e.clause_ids??[])if(b.clauses.some(cl=>cl.id===id&&cl.source_valid))gaps.add(id);
 const all=b.formal?.constraints??[],anchors=all.filter(c=>!invalidIds.has(c.id)),unbound=anchors.filter(c=>bindingIssues(plan,lowered.boundaries,n,c).length);
 return {node_id:n.id,parent_id:n.parent_id,clauses:b.clauses,dictionary_sources:b.dictionary_sources??[],unstated_axes:b.unstated_axes,uncertainties:b.uncertainties,targets:b.clauses.filter(c=>gaps.has(c.id)),anchors,locked_constraint_ids:anchors.map(c=>c.id),semantic_revisable_constraint_ids:all.map(c=>c.id),invalid_constraints:all.filter(c=>invalidIds.has(c.id)),relations:b.formal?.relations??[],mathematical_targets:mathematicalTargets(plan,lowered.boundaries,n),binding_targets:unbound.map(c=>({constraint_id:c.id,issues:bindingIssues(plan,lowered.boundaries,n,c),clauses:b.clauses.filter(cl=>c.clause_ids.includes(cl.id))}))};
})};}
const forbidden=new Set(['verdict','status','result','operation','comparison','findings','math_analysis','accepted_check_ids']);
function rejectVerdicts(v){if(!v||typeof v!=='object')return;for(const[k,x]of Object.entries(v)){if(forbidden.has(k))throw Error('PARSER_VERDICT_FIELD_FORBIDDEN:'+k);rejectVerdicts(x);}}
export function applyParsePatch(plan,lowered,input,patch){
 rejectVerdicts(patch);if(!patch||Object.keys(patch).some(k=>!['patches','semantic_revisions','mathematical_models'].includes(k))||!Array.isArray(patch.patches))throw Error('INVALID_PARSE_PATCH');
 const revised=applySemanticRevisions(plan,lowered.boundaries,patch.semantic_revisions??[]);
 const transaction=synchronizeRevisionReferences(revised,input,patch),result=transaction.boundaries,seen=new Set();
 input=transaction.input;patch=transaction.patch;
 for(const p of patch.patches){
  const scope=input.nodes.find(n=>n.node_id===p.node_id);if(!scope||!(scope.targets.length||scope.binding_targets.length||scope.mathematical_targets?.length)||seen.has(p.node_id))throw Error('PARSE_SCOPE_INVALID');seen.add(p.node_id);
  if(Object.keys(p).some(k=>!['node_id','constraints','relations','coverage','bindings','calculation_plans'].includes(k))||!['constraints','relations','coverage'].every(k=>Array.isArray(p[k]))||p.bindings!==undefined&&!Array.isArray(p.bindings)||p.calculation_plans!==undefined&&!Array.isArray(p.calculation_plans))throw Error('PARSE_PATCH_FIELDS_INVALID');
  const ids=new Set(scope.targets.map(c=>c.id)),f=result[p.node_id].boundary.formal;
  const requestedMath=new Set((scope.mathematical_targets??[]).map(t=>t.target_constraint_id)),plans=p.calculation_plans??[];
  if(plans.length!==requestedMath.size||new Set(plans.map(x=>x.target_constraint_id)).size!==plans.length||plans.some(x=>!requestedMath.has(x.target_constraint_id)))throw Error('MATHEMATICAL_PARSE_MISSING_OR_OUTSIDE_SCOPE');
  if(plans.length)f.calculation_plans=[...(f.calculation_plans??[]).filter(x=>!requestedMath.has(x.target_constraint_id)),...structuredClone(plans)];
  if(p.coverage.length!==ids.size||new Set(p.coverage.map(c=>c.clause_id)).size!==ids.size||p.coverage.some(c=>!ids.has(c.clause_id)))throw Error('PARSE_COVERAGE_SCOPE_INVALID');
  for(const c of p.constraints)if(!c.clause_ids?.length||c.clause_ids.some(id=>!ids.has(id)))throw Error('PARSE_SOURCE_OUTSIDE_PATCH');
  const relationIds=new Set([...ids,...scope.binding_targets.flatMap(c=>c.clauses.map(cl=>cl.id))]);
  for(const c of p.relations)if(!c.clause_ids?.length||c.clause_ids.some(id=>!relationIds.has(id)))throw Error('PARSE_SOURCE_OUTSIDE_PATCH');
  const removeIds=new Set(f.coverage.filter(c=>ids.has(c.clause_id)).flatMap(c=>c.constraint_ids));
  // A binding-only target is an existing operand. Replacing the residual
  // clause interpretation must not delete that operand behind the binding.
  const bindingOnly=new Set(scope.binding_targets.map(t=>t.constraint_id));
  const partialIds=new Set(f.coverage.filter(cv=>cv.kind==='STRUCTURED'&&cv.unresolved?.length).flatMap(cv=>cv.constraint_ids));
  const locked=new Set([...bindingOnly,...partialIds,...(scope.locked_constraint_ids??[])]);
  if(p.constraints.some(c=>locked.has(c.id)))throw Error('局部解析不能改写已有有效操作数');
  const kept=f.constraints.filter(c=>!removeIds.has(c.id)||(locked.has(c.id)&&!p.constraints.some(x=>x.id===c.id)));
  f.constraints=[...kept,...p.constraints];
  const mergedCoverage=p.coverage.map(cv=>cv.kind==='STRUCTURED'?{...cv,constraint_ids:[...new Set([...cv.constraint_ids,...kept.filter(c=>removeIds.has(c.id)&&c.clause_ids.includes(cv.clause_id)).map(c=>c.id)])]}:cv);
  const partialClauses=new Set(f.coverage.filter(cv=>cv.kind==='STRUCTURED'&&(cv.unresolved?.length||cv.constraint_ids.some(id=>locked.has(id)))).map(cv=>cv.clause_id));
  f.relations=[...new Map([...f.relations.filter(c=>!c.clause_ids.some(id=>ids.has(id))||c.clause_ids.every(id=>partialClauses.has(id))),...p.relations].map(e=>[stable(e),e])).values()];
  // A clause's own explicit relation is a complete structural coverage source.
  // Discard only redundant references to real locked operands of OTHER clauses.
  // Never invent a relation, amend operand sources, or accept unknown IDs.
  for(const cv of mergedCoverage){
   if(cv.kind!=='STRUCTURED'||!Array.isArray(cv.constraint_ids)||!f.relations.some(e=>e.clause_ids?.includes(cv.clause_id)))continue;
   const misplaced=cv.constraint_ids.filter(id=>!f.constraints.some(c=>c.id===id&&c.clause_ids?.includes(cv.clause_id)));
   if(misplaced.length&&misplaced.every(id=>locked.has(id)&&kept.some(c=>c.id===id))){
    cv.constraint_ids=cv.constraint_ids.filter(id=>!misplaced.includes(id));
    f.parse_metadata_repairs??=[];f.parse_metadata_repairs.push({code:'RELATION_OWNS_CLAUSE_COVERAGE',clause_id:cv.clause_id,discarded_cross_clause_refs:misplaced});
   }
  }
  f.coverage=[...f.coverage.filter(c=>!ids.has(c.clause_id)),...mergedCoverage];
 }
 if(input.nodes.some(n=>(n.targets.length||n.binding_targets.length||n.mathematical_targets?.length)&&!seen.has(n.node_id)))throw Error('PARSE_PATCH_MISSING_NODE');
 // Expressions reference the final transaction, including operands introduced
 // by this patch or a later node. Diagnostics do not erase executable trees.
 for(const p of patch.patches)for(const record of p.calculation_plans??[]){
  try{validateCalculationPlan(record,{plan,boundaries:result,node_id:p.node_id});}
  catch(e){const f=result[p.node_id].boundary.formal;f.math_plan_diagnostics??=[];f.math_plan_diagnostics.push({target_constraint_id:record.target_constraint_id,reason:e.message});}
 }
 // Keep stable operand IDs while keys are canonicalized up the ancestry chain.
 const bindingAnchors=structuredClone(result);
 // Binding is its own patch operation: endpoints, values and source text stay locked.
 for(const p of [...patch.patches].sort((a,b)=>ancestors(plan,a.node_id).length-ancestors(plan,b.node_id).length)){
  const n=plan.nodes.find(n=>n.id===p.node_id),f=result[n.id].boundary.formal,parents=ancestors(plan,n.id);
  const allowed=new Set([...p.constraints.map(c=>c.id),...input.nodes.find(x=>x.node_id===n.id).binding_targets.map(c=>c.constraint_id)]);
  for(const b of p.bindings??[]){
   const c=f.constraints.find(c=>c.id===b.constraint_id),parent=parents.find(p=>p.id===b.parent_node_id),compatible=p=>b.relation==='INDEPENDENT'||bindingCompatible(c,p),pc=parent&&(result[parent.id].boundary.formal.constraints.find(p=>p.key===b.parent_key&&compatible(p))??result[parent.id].boundary.formal.constraints.find(p=>compatible(p)&&p.id===bindingAnchors[parent.id].boundary.formal.constraints.find(a=>a.key===b.parent_key&&compatible(a))?.id));
   const backup=c&&structuredClone(c),edgeCount=f.relations.length;
   try{
   const bindingFailure=reason=>{throw Error('绑定失败：任务 '+n.id+'，约束 '+b.constraint_id+' → '+b.parent_node_id+'/'+b.parent_key+'；'+reason);};
   if(!allowed.has(b.constraint_id))bindingFailure('该约束不在本次局部解析范围内');
   if(!c)bindingFailure('补丁合并后找不到子约束，不能建立绑定');
   if(!parent)bindingFailure('指定任务不在当前任务的祖先链中');
   if(!pc)bindingFailure('指定父边界身份不存在');
   if(!['SAME_AS','PART_OF','INDEPENDENT','SPECIALIZES'].includes(b.relation))bindingFailure('关系类型不受支持：'+b.relation);
   if(typeof b.reason!=='string'||!b.reason.trim())bindingFailure('没有提供原条款支持的绑定依据');
   if(b.symbols!==undefined){
    if(b.relation!=='SAME_AS')bindingFailure('只有同一事件的绑定可以声明内部条件变量对应');
    applySymbolBindings(plan,result,n,c,pc,parent,b.symbols);
   }
   const commitMembers=b.members===undefined?()=>{}:selectionBindingPatch(f,c,pc,parent,b.members);
   if(b.members!==undefined&&b.relation!=='SAME_AS')bindingFailure('选择成员映射需要同一选择组');
   const commitValues=b.values===undefined?()=>{}:valueBindingPatch(c,domainIdentityView(result[parent.id].boundary.formal,pc),parent,b.values);
   const commitEvents=c.type==='order'&&pc.type==='order'&&['SAME_AS','SPECIALIZES'].includes(b.relation)?eventBindingPatch(f,c,orderIdentityView(result[parent.id].boundary.formal,pc),parent,b.events??[]):()=>{};
   if(b.events!==undefined&&(c.type!=='order'||pc.type!=='order'))bindingFailure('事件映射必须绑定事件图');
   if(b.instance!==undefined){
    const r=b.instance,g=result[parent.id].boundary.formal.constraints.find(g=>g.type==='order'&&g.key===r.graph_key),events=g?.events??[];
    if(c.type!=='quantity'||pc.type!=='quantity'||b.relation!=='PART_OF'||r.from!==c.instance||!events.some(e=>e.id===r.to)||r.to===pc.instance||typeof r.reason!=='string'||!r.reason.trim()||events.some(e=>e.id===r.from)&&r.from!==r.to)bindingFailure('数量事件身份的类型、端点或来源无效');
    c.instance=r.to;
   }
   c.binding_provenance??=[];c.binding_provenance.push({...b,clause_ids:c.clause_ids});
   if(b.relation==='INDEPENDENT'){c.independent_of=[...new Set([...(c.independent_of??[]),pc.key])];continue;}
   if(b.relation==='SPECIALIZES'){
    if(!(c.type===pc.type&&['domain','order'].includes(c.type))&&!supplementsParentDuty(c,pc))bindingFailure('特化关系需要同类型集合、事件图或保留父义务的局部细化');
    if(c.key!==pc.key)f.relations.push({type:'SPECIALIZES',from:c.key,to:pc.key,clause_ids:c.clause_ids});
    commitValues();commitEvents();continue;
   }
   if(b.relation==='PART_OF'){if(c.type!=='quantity'||pc.type!=='quantity')bindingFailure('组成关系只支持数量约束，当前类型为 '+c.type+' → '+pc.type);if(c.key!==pc.key)f.relations.push({type:'PART_OF',from:c.key,to:pc.key,clause_ids:c.clause_ids});}
   else{if(!bindingCompatible(c,pc))bindingFailure('同一身份的约束类型不兼容：'+c.type+' → '+pc.type);if(c.key!==pc.key)f.relations.push({type:'SAME_AS',from:c.key,to:pc.key,clause_ids:c.clause_ids});c.key=pc.key;if(c.type==='quantity')c.instance=pc.instance;}
   commitValues();commitEvents();commitMembers();
   }catch(e){
    if(c&&backup){for(const k of Object.keys(c))delete c[k];Object.assign(c,backup);}
    f.relations.length=edgeCount;
    f.binding_patch_errors??=[];
    f.binding_patch_errors.push({code:'LOCAL_BINDING_REJECTED',constraint_id:c?.id??b.constraint_id,clause_ids:c?.clause_ids??[],axes:c?.axes??[],reason:e.message,requested_binding:structuredClone(b)});
   }
  }
 }

 const normalized=normalizeBindingCoverage(plan,result);
 // Final transaction diagnostics are independent of mathematical execution.
 // Never reject an entire expression because intermediate legacy coverage
 // lacks an operand supplied by another operation in this same response.
 for(const n of plan.nodes){
  const row=normalized[n.id],before=validateFormal(lowered.boundaries[n.id].boundary,lowered.boundaries[n.id].review);
  const added=validateFormal(row.boundary,row.review).filter(e=>!e.reason.startsWith('生成或计算覆盖缺口：')&&!before.some(x=>stable(x)===stable(e)));
  if(added.length)row.boundary.formal.parse_patch_errors=added.map(e=>({...e,code:'LOCAL_STRUCTURE_DIAGNOSTIC'}));
  else delete row.boundary.formal.parse_patch_errors;
 }
 if(patch.mathematical_models){validateCompiledModels(patch.mathematical_models,{plan,boundaries:normalized});normalized[plan.nodes.find(n=>!n.parent_id).id].boundary.formal.compiled_math_models=structuredClone(patch.mathematical_models);}
 return normalizeBindingCoverage(plan,normalized);
}
export function prepareSavedComparison({plan,boundaries,settings={},cacheDir,previous}){
 const begin=performance.now(),key=parseKey(plan,boundaries,settings),file=cacheDir&&path.join(cacheDir,key+'.json');
 let source=boundaries,reused=false;
 if(previous?.parsing?.input_sha256===key&&previous?.parsed_boundaries&&!previous.parsing?.error&&previous.comparison_input?.nodes?.length===plan.nodes.length&&plan.nodes.every(n=>{
  const old=previous.comparison_input.nodes.find(x=>x.id===n.id),saved=previous.parsed_boundaries[n.id];return old&&old.parent_id===n.parent_id&&stable(old.boundary)===stable(boundaries[n.id].boundary)&&stable(old.review)===stable(boundaries[n.id].review)&&stable(saved?.boundary?.clauses)===stable(boundaries[n.id].boundary.clauses);
 })){
  reused=true;
 }
 const lowered=local(plan,source),input=parserInput(plan,lowered);
 // A no-model replay, or a failed local patch, keeps the last accepted parse.
 // Reset coverage only in the patch input; do not silently discard binding gaps.
 let parsed=reused?structuredClone(previous.parsed_boundaries):lowered.boundaries,cached=false,cache_provenance=null;
 requireMathematicalPlans(input,parsed);
 let replay_error=null;
 if(file&&fs.existsSync(file)){try{const v=JSON.parse(fs.readFileSync(file));if(v.key===key){
  if(v.accepted_parse){
   if(!plan.nodes.every(n=>v.accepted_parse.boundaries[n.id]&&stable(v.accepted_parse.boundaries[n.id].boundary.clauses)===stable(lowered.boundaries[n.id].boundary.clauses)))throw Error('SAVED_PARSE_SOURCE_CHANGED');
   parsed=structuredClone(v.accepted_parse.boundaries);replay_error=v.accepted_parse.error??null;
  }else parsed=applyParsePatch(plan,lowered,input,v.patch);
  if(v.compiled_models){const owner=plan.nodes.find(n=>!n.parent_id);validateCompiledModels(v.compiled_models,{plan,boundaries:parsed});parsed[owner.id].boundary.formal.compiled_math_models=structuredClone(v.compiled_models);}
  cached=true;cache_provenance=v.provenance??null;
 }}catch{/* Invalid cache is not evidence. */}}
 return {key,file,lowered,input,parsed,cached,reused,cache_provenance,replay_error,timing:{program_parse_ms:performance.now()-begin,model_parse_ms:0,binding_validation_ms:0,parse_total_ms:0,calculator_ms:0},started:begin};
}
export async function parseAndCompare({plan,boundaries,settings={},output,cacheDir,previous,signal,onProgress=()=>{},resourceGuard=()=>{},allowModel=true,call=callCodex}){
 const s=prepareSavedComparison({plan,boundaries,settings,cacheDir,previous});let attempts=[],error=s.replay_error,formatRepair=null;
 onProgress({stage:'PARSING_7PLUS1',signal:'PROGRAM_PARSE_READY',elapsed_ms:s.timing.program_parse_ms});
 const hadSemanticTargets=s.input.nodes.some(n=>n.targets.length||n.mathematical_targets?.length);let bindingFollowupRequests=0;
 const issueKeys=input=>new Set(input.nodes.flatMap(n=>n.binding_targets.flatMap(t=>t.issues.map(i=>stable({node:n.node_id,constraint:t.constraint_id,code:i.code,vertex:i.vertex,variable:i.variable,parent:i.parent_key})))));
 const initialIssues=issueKeys(s.input);
 for(let pass=0;pass<2&&!s.cached&&allowModel&&(pass===0&&plan.nodes.some(n=>n.parent_id)||s.input.nodes.some(n=>n.targets.length||n.binding_targets.length||n.mathematical_targets?.length));pass++){
  const resources=parserResources(),text=resources.map(r=>r.text).join('\n\n'),bundle={transport_version:'BOUNDARY_REPORT_R01',phase:'parse',text,schema:{},resources,name:'saved-7plus1-semantic-mathematical-parser',mode:'LOCAL_PARSE',resource_profile:'SAVED_7PLUS1_SEMANTIC_MATH_PARSE',sha256:sha256(text)};
  const t=performance.now();let recorded=false;
  try{
   resourceGuard();const source=prepareSource(Buffer.from(JSON.stringify(s.input),'utf8'));
   const r=await call({bundle,source,directory:path.join(output,pass?'local-binding-followup':'local-parser-call'),probe:call===callCodex?probeCodex():null,model:settings.model,reasoning:settings.reasoning,signal,requestBudget:{remaining:1},onActivity:p=>onProgress({...p,stage:'LOCAL_PARSE'})});
   attempts.push(...r.attempts);if(pass)bindingFollowupRequests+=r.attempts.reduce((n,a)=>n+(a.conservative_request_count??1),0);
   s.timing.model_parse_ms+=performance.now()-t;recorded=true;
   const v=performance.now(),decoded=decodeSavedParse(r.value),patch=decoded.patch;formatRepair??=decoded.closure_repair;
   s.parsed=applyParsePatch(plan,s.lowered,s.input,patch);s.timing.binding_validation_ms+=performance.now()-v;
   const incomplete=Object.values(s.parsed).some(r=>r.boundary.formal?.binding_issues?.length||r.boundary.formal?.calculation_plans?.some(p=>!p.expression)||r.boundary.formal?.coverage?.some(cv=>cv.kind==='UNSUPPORTED'||cv.unresolved?.length));
   // An incremental binding patch alone is not a replayable full parse cache.
   if(s.file&&!incomplete&&!pass){fs.mkdirSync(cacheDir,{recursive:true});try{fs.writeFileSync(s.file,JSON.stringify({key:s.key,patch,provenance:'LLM_LOCAL_PARSE_NOT_INDEPENDENTLY_REVIEWED'}),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}}
  }catch(e){if(signal?.aborted)throw e;if(e.attempts)attempts.push(...e.attempts);error=e.message;if(!recorded)s.timing.model_parse_ms+=performance.now()-t;break;}
  // At most one continuation for binding gaps newly exposed by structure or key alignment.
  // Never regenerate, retry an unresolved semantic clause, or ask for verdicts.
  if(!pass){
   const v=performance.now(),next=local(plan,s.parsed),input=parserInput(plan,next);s.timing.program_parse_ms+=performance.now()-v;
   if((hadSemanticTargets||[...issueKeys(input)].some(k=>!initialIssues.has(k)))&&input.nodes.every(n=>!n.targets.length&&!n.mathematical_targets?.length)&&input.nodes.some(n=>n.binding_targets.length)&&!Object.values(s.parsed).some(r=>r.boundary.formal?.binding_patch_errors?.length)){
    s.lowered=next;s.input=input;continue;
   }
  }
  break;
 }
 const bindingFailures=Object.entries(s.parsed).flatMap(([node_id,r])=>(r.boundary.formal?.binding_issues??[]).filter(e=>e.code==='LOCAL_BINDING_REJECTED').map(e=>({node_id,...e})));
 if(!error&&bindingFailures.length)error='局部解析仍有 '+bindingFailures.length+' 项绑定未完成：'+bindingFailures.map(e=>e.reason).join('；');
 s.timing.parse_total_ms=performance.now()-s.started;
 onProgress({stage:'PARSING_7PLUS1',signal:'SAVED_PARSE_READY',elapsed_ms:s.timing.parse_total_ms});
 const t=performance.now();onProgress({stage:'CALCULATING',signal:'CALCULATION_STARTED'});
 const comparison=compareProgramPlan({plan,boundaries:s.parsed});s.timing.calculator_ms=performance.now()-t;
 const requests=attempts.reduce((n,a)=>n+(a.conservative_request_count??1),0);
 onProgress({stage:'CALCULATING',signal:'CALCULATION_READY',elapsed_ms:s.timing.calculator_ms});
 return {kind:'compare',interface_error:null,comparison,parsed_boundaries:s.parsed,parsing:{version:PARSER_VERSION,input_sha256:s.key,input_scope:'SAVED_7PLUS1_ONLY',cache_hit:s.cached,cache_provenance:s.cache_provenance,reused_previous_parse:s.reused,previous_parser_input_sha256:s.reused?previous.parsing.input_sha256:null,error,binding_failures:bindingFailures,format_repair:formatRepair,timing:s.timing,local_parse_requests:requests,local_binding_followup_requests:bindingFollowupRequests,verdict_model_requests:0,semantic_assurance:requests||s.cached||s.reused?'LOCAL_PARSE_NOT_INDEPENDENTLY_REVIEWED':'PROGRAM_GRAMMAR'},local_calculation_ms:s.timing.calculator_ms,model_calls:{parse:[],audit:[],local_parse:attempts},new_model_requests:requests,created_at:new Date().toISOString()};
}
