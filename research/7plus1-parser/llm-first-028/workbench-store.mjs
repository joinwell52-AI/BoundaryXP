import fs from 'node:fs';import path from 'node:path';import {randomUUID} from 'node:crypto';
import {sha256} from './source.mjs';
import {parseAndCompare,prepareSavedComparison} from './workbench-parse.mjs';
import {selectDictionaries,dictionaryIdentity} from './dictionaries.mjs';
import {newPlan,mutatePlan,nodeInputKey,semanticInput,singleAxisStates,ancestors} from '../../../src/bxp/workbench-model.mjs';
import {compareProgramPlan as comparePlan,PROGRAM_COMPARISON_VERSION as COMPARISON_VERSION} from '../../../src/bxp/workbench-program.mjs';
import {executeWorkbench,reviewWorkbenchComparison,workbenchResources,nodeResourceIdentity} from './workbench-runner.mjs';
import {stable} from '../../../src/bxp/ir-kernel/values.mjs';
import {calculateWorkbenchMath} from '../../../src/bxp/workbench-math.mjs';
import {sameComparisonResources} from './workbench-comparison-resources.mjs';
import {savedDisplay} from './workbench-saved-display.mjs';
const ID=/^[a-f0-9-]{36}$/,HASH=/^[a-f0-9]{64}$/;
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export const receiptPhase=(request,file)=>request.skill_mode==='LOCAL_PARSE'||file.includes('local-parser-call')||file.includes('local-binding-followup')?'LOCAL_PARSE':file.includes('audit-call')?'AUDIT':'GENERATE';
// Windows readers/scanners may briefly deny replacement. Keep the old complete
// JSON until atomic rename succeeds; never unlink or truncate it as a fallback.
const renamePause=new Int32Array(new SharedArrayBuffer(4));
const replaceFile=(temp,file)=>{
 const delays=[20,40,80,120,200];
 for(let attempt=0;;attempt++)try{fs.renameSync(temp,file);return;}catch(error){
  if(process.platform!=='win32'||!['EPERM','EACCES','EBUSY'].includes(error.code)||attempt>=delays.length)throw error;
  Atomics.wait(renamePause,0,0,delays[attempt]);
 }
};
const put=(f,v,immutable=false)=>{fs.mkdirSync(path.dirname(f),{recursive:true});if(immutable){fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});return;}const t=f+'.'+randomUUID()+'.tmp';fs.writeFileSync(t,JSON.stringify(v,null,2)+'\n');replaceFile(t,f);};
const files=dir=>!fs.existsSync(dir)?[]:fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
export function createWorkbench({dataRoot,execute=executeWorkbench,reviewComparison=reviewWorkbenchComparison,resourceGuard=()=>{},productSnapshot=null,active=new Map()}={}){
 const root=path.join(dataRoot,'workbench');fs.mkdirSync(root,{recursive:true});
 const jobs=new Map();
 const projectDir=id=>{if(!ID.test(id))throw Error('INVALID_PROJECT_ID');return path.join(root,'projects',id);};
 const load=id=>read(path.join(projectDir(id),'current.json'));
 const result=key=>{if(!HASH.test(key??''))return null;const f=path.join(root,'results',key+'.json');return fs.existsSync(f)?read(f):null;};
 const resources=(settings,mode)=>({...workbenchResources(mode),dictionaries:dictionaryIdentity(selectDictionaries(settings.dictionaries??{})),runtime:productSnapshot?.resources_sha256??'DEVELOPMENT'});
 const scopedKey=(plan,n,identity)=>sha256(stable({project_id:plan.project_id,node_id:n.id,input:nodeInputKey(plan,n,identity)}));
 const key=(plan,n)=>scopedKey(plan,n,nodeResourceIdentity(resources(plan.settings,plan.mode),plan.settings));
 // Prompt revisions do not rewrite a saved semantic artifact. Retain it only
 // when its original input key still verifies and all non-prompt interfaces
 // match. New generation uses the new prompt key; source/model changes and
 // schema/adapter changes still invalidate. Comparison validates the saved
 // operands and evidence independently and never treats this as a new review.
 const promptCompatible=(prior,current)=>stable({...prior,resources:current.resources,profiles:current.profiles})===stable(current);
 // Explicit no-model replay reads the artifact previously compared against
 // this exact source tree. Preserve its original generation identity; a new
 // calculation is not a new extraction or review.
 const savedInputResult=(plan,n,comparison)=>{
  const prior=result(n.result_key),input=comparison?.comparison_input;
  if(!prior?.resources||prior.boundary?.formal?.version!=='workbench-formal/1'||input?.nodes?.length!==plan.nodes.length)return null;
  if(!plan.nodes.every(node=>{const old=input.nodes.find(x=>x.id===node.id);return old&&['parent_id','parent_basis','version','text'].every(k=>stable(old[k])===stable(node[k]));}))return null;
  if(stable(input.dependencies)!==stable(plan.dependencies)||stable(input.retained)!==stable(plan.retained))return null;
  const old=input.nodes.find(x=>x.id===n.id);
  if(stable(old.boundary)!==stable(prior.boundary)||stable(old.review)!==stable(prior.review))return null;
  if(stable(prior.resources.dictionaries)!==stable(resources(plan.settings,plan.mode).dictionaries))return null;
  return {...prior,retained_generation:{reason:'EXPLICIT_SAVED_INPUT_REPLAY',source_result_key:n.result_key,source_created_at:prior.created_at,original_resources:prior.resources,review_not_rerun:true}};
 };
 const nodeResult=(plan,n)=>{
  const wanted=key(plan,n),legacyWanted=sha256(nodeInputKey(plan,n,nodeResourceIdentity(resources(plan.settings,plan.mode),plan.settings)));
  const prior=result(n.result_key);if(!prior?.resources)return null;
  const comparison=result(plan.comparison);
  if(comparison?.saved_generation_replay?.some(x=>x.node_id===n.id&&x.result_key===n.result_key)){
   const saved=savedInputResult(plan,n,comparison);if(saved)return saved;
  }
  const oldLegacy=sha256(nodeInputKey(plan,n,prior.resources)),normalizedLegacy=sha256(nodeInputKey(plan,n,nodeResourceIdentity(prior.resources,plan.settings)));
  const oldScoped=scopedKey(plan,n,prior.resources),normalizedScoped=scopedKey(plan,n,nodeResourceIdentity(prior.resources,plan.settings));
  const originalInputValid=[oldLegacy,normalizedLegacy,oldScoped,normalizedScoped].some(k=>k===n.result_key||k===prior.input_sha256);
  const savedIdentity=nodeResourceIdentity(prior.resources,plan.settings),currentIdentity=nodeResourceIdentity(resources(plan.settings,plan.mode),plan.settings);
  if(originalInputValid&&prior.boundary?.formal?.version==='workbench-formal/1'&&promptCompatible(savedIdentity,currentIdentity)&&stable(savedIdentity)!==stable(currentIdentity))return {...prior,retained_generation:{reason:'PROMPT_UPDATED_SAVED_STRUCTURE_RETAINED',original_resources:savedIdentity,current_resources:currentIdentity,review_not_rerun:true}};
  return (prior.input_sha256===wanted||prior.input_sha256===legacyWanted||((n.result_key===oldLegacy||n.result_key===normalizedLegacy||n.result_key===oldScoped||n.result_key===normalizedScoped)&&(normalizedLegacy===legacyWanted||normalizedScoped===wanted)))?prior:null;
 };
 const hydrateTrace=r=>{
  if(!r)return r;let value=r;
  if(r.trace_path&&!r.boundary_calculations&&fs.existsSync(r.trace_path))try{const t=read(r.trace_path);value={...r,boundary_calculations:t.boundary_calculations,program_boundary_calculations:t.program_boundary_calculations,canonical:t.canonical,technical:t.technical,problem_report:t.problem_report};}catch{}
  if(value.workbench_math&&Number.isFinite(value.workbench_math_elapsed_ms))return value;
  const started=performance.now(),math=calculateWorkbenchMath(value.boundary?.clauses??[]);
  return {...value,workbench_math:math,workbench_math_elapsed_ms:performance.now()-started,workbench_math_timing_scope:'CURRENT_READ_RECALCULATION'};
 };
 const save=(p,label)=>{p.saved_at=new Date().toISOString();p.change_label=label;put(path.join(projectDir(p.project_id),'snapshots',String(p.revision)+'.json'),p,true);put(path.join(projectDir(p.project_id),'current.json'),p);return p;};
 const materialize=(plan,historical=false)=>{
  const nodes=plan.nodes.map(n=>{const wanted=key(plan,n),r=hydrateTrace(historical?result(n.result_key):n.result_key?nodeResult(plan,n):null);return {...n,expected_key:wanted,status:r?(r.interface_error?'UNRESOLVED':'RECORDED'):n.result_key?'STALE':'NOT_RUN',result:r,axes:r?.interface_error?Object.fromEntries(['I','O','A','P','R','V','C','B'].map(a=>[a,'UNRESOLVED'])):singleAxisStates(r?.boundary,r?.review)};});
  if(!historical && nodes.some(n=>n.status==='STALE')) {
   const snapshots=files(path.join(projectDir(plan.project_id),'snapshots')).filter(f=>f.endsWith('.json')).map(read);
   for(const n of nodes)if(n.status==='STALE')n.saved_display=savedDisplay(n,result(n.result_key),snapshots);
  }
  let comparison=plan.comparison?result(plan.comparison):null;
  // Preserve stored comparisons as historical evidence; no automatic reinterpretation.
  return {...plan,nodes,comparison,comparison_stale:!historical&&!!comparison&&!sameComparisonResources(comparison.resources,resources(plan.settings,plan.mode),productSnapshot?.presentation_compatibility)};
 };
 const saveJob=j=>put(path.join(root,'jobs',j.id+'.json'),j);
 const comparisonInput=(plan,view)=>({planning:plan.planning,nodes:view.nodes.map(x=>({id:x.id,parent_id:x.parent_id,parent_basis:x.parent_basis,version:x.version,text:x.text,boundary:x.result?.boundary??null,review:x.result?.review??null})),dependencies:plan.dependencies,retained:plan.retained});
 const recalculate=(id,revision,{reuse_saved=false,require_saved_parse=false}={})=>{
  const replayStartedAt=new Date().toISOString();
  const p=load(id);if(p.revision!==revision)throw Error('PLAN_VERSION_CONFLICT');const view=materialize(p),prior=result(p.comparison);
  if(reuse_saved)for(const n of view.nodes)n.result??=hydrateTrace(savedInputResult(p,n,prior));
  if(view.nodes.some(n=>!n.result||n.result.interface_error))throw Error('GENERATE_CURRENT_NODES_FIRST');
  const input=comparisonInput(p,view),currentResources=resources(p.settings,p.mode);
  const boundaries=Object.fromEntries(view.nodes.map(n=>[n.id,n.result])),parsed=prepareSavedComparison({plan:p,boundaries,settings:p.settings,previous:result(p.comparison),cacheDir:path.join(root,'parsed-7plus1')});
  if(require_saved_parse&&!parsed.cached&&!parsed.reused)throw Error('SAVED_PARSE_REQUIRED_NO_MODEL_REQUESTED');
  const t=performance.now(),comparison=comparePlan({plan:p,boundaries:parsed.parsed}),calculation_ms=performance.now()-t;
  const k=sha256(stable({input,core:currentResources.core,operation:'PROGRAM_RECALCULATE',parsing:parsed.key,parsed_structure:sha256(stable(parsed.parsed)),execution_id:randomUUID()}));
  if(!result(k))put(path.join(root,'results',k+'.json'),{kind:'compare',interface_error:null,input_sha256:k,comparison,comparison_input:input,recalculated_from:p.comparison,saved_generation_replay:reuse_saved||prior?.saved_generation_replay?p.nodes.map(n=>({node_id:n.id,result_key:n.result_key})):undefined,parsed_boundaries:parsed.parsed,parsing:{input_scope:'SAVED_7PLUS1_ONLY',cache_hit:parsed.cached,cache_provenance:parsed.cache_provenance,reused_previous_parse:parsed.reused,input_sha256:parsed.key,timing:{...parsed.timing,parse_total_ms:performance.now()-parsed.started-calculation_ms,calculator_ms:calculation_ms},local_parse_requests:0,verdict_model_requests:0},resources:currentResources,calculation_resources:currentResources,model_calls:{parse:[],audit:[]},local_calculation_ms:calculation_ms,new_model_requests:0},true);
  p.comparison=k;p.revision++;save(p,'程序复算 · 0次模型请求');
  const replayEndedAt=new Date().toISOString(),replayResult=result(k),replayJob={id:randomUUID(),request_id:randomUUID(),project_id:id,source_revision:revision,kind:'compare',operation:'PROGRAM_RECALCULATE',node_ids:[],request_count:0,status:'COMPLETED',started_at:replayStartedAt,ended_at:replayEndedAt,execution_settings:p.settings,entries:[{request_id:randomUUID(),node_id:null,source_version:null,input_sha256:k,result_key:k,kind:'PROGRAM_COMPARE',cache_hit:false,status:'COMPLETED',started_at:replayStartedAt,ended_at:replayEndedAt,calls:[],parsing:replayResult.parsing,attached_to_current:true}],timeline:[{at:replayEndedAt,stage:'PARSING_7PLUS1',signal:'SAVED_PARSE_READY',elapsed_ms:replayResult.parsing.timing.parse_total_ms},{at:replayEndedAt,stage:'CALCULATING',signal:'CALCULATION_READY',elapsed_ms:calculation_ms}]};
  jobs.set(replayJob.id,replayJob);saveJob(replayJob);return materialize(p);
 };
 for(const f of files(path.join(root,'jobs')).filter(f=>f.endsWith('.json'))){const j=read(f);if(['QUEUED','RUNNING'].includes(j.status)){j.status='INTERRUPTED';j.ended_at=new Date().toISOString();saveJob(j);}jobs.set(j.id,j);}
 const create=(label,settings)=>{const p=newPlan(randomUUID(),label);p.settings=settings;save(p,'创建任务');return materialize(p);};
 const update=(id,revision,command)=>{
  const p=load(id);if(revision!==p.revision)throw Error('PLAN_VERSION_CONFLICT');
  let q;
  if(command.type==='import_tree'){
   if(p.nodes.length||!Array.isArray(command.nodes)||command.nodes.length<2||command.nodes.length>200)throw Error('INVALID_TREE_IMPORT');
   if(typeof command.source_text!=='string'||command.source_text.length>2000000)throw Error('INVALID_IMPORT_SOURCE');
   // Validate the whole draft through the same Core before writing one snapshot.
   q=mutatePlan(p,{type:'mode',mode:'TREE'});
   for(const row of command.nodes)q=mutatePlan(q,{...row,type:'add'});
   q.revision=p.revision+1;q.import_source={format:'role-heading/1',text:command.source_text};
  }else q=mutatePlan(p,command);
  // Eagerly invalidate only actual semantic dependencies, not display labels or independent children.
  for(const n of q.nodes)if(n.result_key&&n.result_key!==key(q,n))n.stale_result_key=n.result_key;
  save(q,command.type);return materialize(q);
 };
 const recordReceipts=dir=>{
  const requests=files(dir).filter(f=>/request-\d+\.json$/.test(f));
  return requests.map(f=>{const req=read(f),rf=f.replace(/request-(\d+)\.json$/,'receipt-$1.json'),receipt=fs.existsSync(rf)?read(rf):null;return {path:path.relative(root,f),phase:receiptPhase(req,f),count:receipt?.conservative_request_count??1,elapsed_ms:receipt?.elapsed_ms??receipt?.wall_time_ms??null,thread_id:receipt?.thread_id??null,usage:receipt?.usage??null,status:receipt?(receipt.exit_code===0?'RETURNED':'FAILED'):'RECEIPT_MISSING',requested_model:req.requested_model};});
 };
 async function run(j,controller){
  j.status='RUNNING';saveJob(j);
  const frozen=load(j.project_id),startResources=resources(frozen.settings,frozen.mode);
  j.execution_settings=structuredClone(frozen.settings);j.dictionary_snapshot=startResources.dictionaries;saveJob(j);
  try{
   const generated=frozen.nodes.filter(n=>!j.node_ids?.length||j.node_ids.includes(n.id)).sort((a,b)=>ancestors(frozen,a.id).length-ancestors(frozen,b.id).length);
   const entries=j.kind==='generate'?[...generated,...(frozen.mode==='TREE'&&frozen.nodes.some(n=>n.parent_id)?[null]:[])]:[null];
   for(const n of entries){
    controller.signal.throwIfAborted();resourceGuard();
    const comparisonPlan=n?null:load(j.project_id);let input,k,boundaries;
    if(n){input=semanticInput(frozen,n,startResources);k=key(frozen,n);input={...input,extraction_profile:'CLAUSE_BOUNDARY'};}
    else{
     const view=materialize(comparisonPlan);
     if(view.nodes.some(x=>!x.result||x.result.interface_error))throw Error('GENERATE_CURRENT_NODES_FIRST');
     boundaries=Object.fromEntries(view.nodes.map(x=>[x.id,x.result]));
     input=comparisonInput(comparisonPlan,view);
     k=sha256(stable({input,resources:startResources,calculator:COMPARISON_VERSION,settings:comparisonPlan.settings}));
    }
    const cached=null;let value=null;
    const entry={request_id:randomUUID(),node_id:n?.id??null,source_version:n?.version??null,input_sha256:k,kind:n?'NODE_GENERATE_REVIEW':'PROGRAM_COMPARE',cache_hit:false,started_at:new Date().toISOString(),status:'RUNNING'};
    j.entries.push(entry);saveJob(j);
    try{
     const dir=path.join(root,'calls',entry.request_id);entry.directory=dir;
     try{
      const options={kind:n?'node':'compare',input,output:dir,settings:frozen.settings,signal:controller.signal,resourceGuard,productSnapshot,onProgress:p=>{const at=new Date().toISOString();j.progress={...p,at,node_id:n?.id??null};j.timeline??=[];j.timeline.push({...j.progress});
       // Receipt files are already durable when these events arrive. Count all
       // rounds during execution instead of waiting for the entire node to end.
       if(['REQUEST_STARTED','REPORT_SAVED','PARSE_READY','AUDIT_READY','LOCAL_REPAIR_STARTED','LOCAL_REPAIR_REJECTED'].includes(p.signal)){
        entry.calls=recordReceipts(dir);j.request_count=j.entries.reduce((sum,e)=>sum+(e.calls??[]).filter(c=>c.status!=='RECEIPT_MISSING').reduce((s,c)=>s+c.count,0),0);
       }saveJob(j);}};
      if(n)value=await execute(options);
      else value=await parseAndCompare({...options,plan:comparisonPlan,boundaries,previous:result(comparisonPlan.comparison),cacheDir:path.join(root,'parsed-7plus1')});
     }finally{
      entry.calls=recordReceipts(dir);j.request_count=j.entries.reduce((sum,e)=>sum+(e.calls??[]).reduce((s,c)=>s+c.count,0),0);saveJob(j);
     }
     if(!n){value.comparison_input=input;entry.parsing=value.parsing;j.progress={stage:'COMPILING',at:new Date().toISOString()};saveJob(j);}
     if(n){
      const at=new Date().toISOString();j.progress={stage:'CALCULATING',at};j.timeline??=[];j.timeline.push({...j.progress,node_id:n.id});saveJob(j);
      const started=performance.now();value.workbench_math=calculateWorkbenchMath(value.boundary?.clauses??[]);value.workbench_math_elapsed_ms=performance.now()-started;value.workbench_math_timing_scope='GENERATION';
      j.timeline.push({stage:'CALCULATING',signal:'CALCULATION_READY',node_id:n.id,elapsed_ms:value.workbench_math_elapsed_ms,at:new Date().toISOString()});j.progress={stage:'COMPILING',at:new Date().toISOString()};j.timeline.push({...j.progress,node_id:n.id});saveJob(j);
     }
     const resultKey=sha256(stable({input_sha256:k,execution_id:entry.request_id}));entry.result_key=resultKey;
     value.input_sha256=k;value.resources=startResources;put(path.join(root,'results',resultKey+'.json'),value,true);
     const current=load(j.project_id);
     if(n){
      const live=current.nodes.find(x=>x.id===n.id);
      if(live&&key(current,live)===k){live.result_key=resultKey;current.revision++;save(current,'生成 '+live.label);entry.attached_to_current=true;}else entry.attached_to_current=false;
     }else if(stable({...current,comparison:null,revision:0,saved_at:null,change_label:null})===stable({...comparisonPlan,comparison:null,revision:0,saved_at:null,change_label:null})){
      current.comparison=resultKey;current.revision++;save(current,'比较规划');entry.attached_to_current=true;
     }else entry.attached_to_current=false;
     entry.status=value.interface_error?'UNRESOLVED':'COMPLETED';
    }catch(e){entry.status='FAILED';entry.error=e.message;throw e;}
    finally{entry.ended_at=new Date().toISOString();saveJob(j);}
   }
   j.status='COMPLETED';
  }catch(e){j.status=controller.signal.aborted?'CANCELLED':'FAILED';j.error=e.message;}
  finally{j.ended_at=new Date().toISOString();saveJob(j);active.delete(j.id);}
 }
 const start=(id,{kind,node_ids=[],request_id})=>{
  if(!['generate','compare','review_compare'].includes(kind)||!ID.test(request_id??''))throw Error('INVALID_JOB_REQUEST');
  const existing=[...jobs.values()].find(j=>j.request_id===request_id);if(existing){if(existing.project_id!==id||existing.kind!==kind||stable(existing.node_ids)!==stable(node_ids))throw Error('REQUEST_ID_MISMATCH');return existing;}
  if(active.size)throw Error('COMPILER_BUSY');let p=load(id);
  if(node_ids.some(n=>!p.nodes.some(x=>x.id===n)))throw Error('NODE_NOT_FOUND');
  // Starting generation/comparison submits the current tree as a complete batch.
  // This changes coverage evaluation, not node inputs or previously saved evidence.
  if(['generate','compare'].includes(kind)&&p.mode==='TREE'&&p.nodes.some(n=>n.parent_id)&&p.planning!=='COMPLETE'){
   p=mutatePlan(p,{type:'planning',value:'COMPLETE'});save(p,'提交当前任务批次');
  }
  const j={id:randomUUID(),request_id,project_id:id,source_revision:p.revision,kind,node_ids,request_count:0,entries:[],status:'QUEUED',started_at:new Date().toISOString()};
  const c=new AbortController();active.set(j.id,c);jobs.set(j.id,j);saveJob(j);setImmediate(()=>run(j,c));return j;
 };
 return {create,update,start,recalculate,root,load,result,materialize,
  list:()=>files(path.join(root,'projects')).filter(f=>f.endsWith(path.sep+'current.json')).map(read).filter(p=>p.nodes.length>0).map(p=>({project_id:p.project_id,label:p.label,revision:p.revision,nodes:p.nodes.length,saved_at:p.saved_at})),
  get:(id,revision)=>materialize(revision===undefined?load(id):read(path.join(projectDir(id),'snapshots',String(Number(revision))+'.json')),revision!==undefined),
  snapshots:id=>files(path.join(projectDir(id),'snapshots')).filter(f=>f.endsWith('.json')).map(f=>{const p=read(f);return {revision:p.revision,saved_at:p.saved_at,label:p.change_label};}).sort((a,b)=>a.revision-b.revision),
  jobs:id=>[...jobs.values()].filter(j=>j.project_id===id).map(j=>{if(j.execution_settings)return j;try{const snapshot=read(path.join(projectDir(id),'snapshots',String(j.source_revision)+'.json'));return {...j,execution_settings:snapshot.settings,settings_provenance:'SOURCE_SNAPSHOT'};}catch{return j;}}),
  cancel:id=>{const c=active.get(id);if(c)c.abort();return {requested:!!c,remote_termination:'NOT_ASSERTED'};}
 };
}
