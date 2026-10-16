import fs from 'node:fs';import path from 'node:path';import {randomUUID} from 'node:crypto';
import {sha256} from './source.mjs';
import {selectDictionaries,dictionaryIdentity} from './dictionaries.mjs';
import {newPlan,mutatePlan,nodeInputKey,semanticInput,singleAxisStates} from '../../../src/bxp/workbench-model.mjs';
import {comparePlan,COMPARISON_VERSION} from '../../../src/bxp/workbench-comparison.mjs';
import {executeWorkbench,reviewWorkbenchComparison,workbenchResources,nodeResourceIdentity} from './workbench-runner.mjs';
import {stable} from '../../../src/bxp/ir-kernel/values.mjs';
import {calculateWorkbenchMath} from '../../../src/bxp/workbench-math.mjs';
const ID=/^[a-f0-9-]{36}$/,HASH=/^[a-f0-9]{64}$/;
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const put=(f,v,immutable=false)=>{fs.mkdirSync(path.dirname(f),{recursive:true});if(immutable){fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});return;}const t=f+'.'+randomUUID()+'.tmp';fs.writeFileSync(t,JSON.stringify(v,null,2)+'\n');fs.renameSync(t,f);};
const files=dir=>!fs.existsSync(dir)?[]:fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
export function createWorkbench({dataRoot,execute=executeWorkbench,resourceGuard=()=>{},productSnapshot=null,active=new Map()}={}){
 const root=path.join(dataRoot,'workbench');fs.mkdirSync(root,{recursive:true});
 const jobs=new Map();
 const projectDir=id=>{if(!ID.test(id))throw Error('INVALID_PROJECT_ID');return path.join(root,'projects',id);};
 const load=id=>read(path.join(projectDir(id),'current.json'));
 const result=key=>{if(!HASH.test(key??''))return null;const f=path.join(root,'results',key+'.json');return fs.existsSync(f)?read(f):null;};
 const resources=settings=>({...workbenchResources(),dictionaries:dictionaryIdentity(selectDictionaries(settings.dictionaries??{})),runtime:productSnapshot?.resources_sha256??'DEVELOPMENT'});
 const scopedKey=(plan,n,identity)=>sha256(stable({project_id:plan.project_id,node_id:n.id,input:nodeInputKey(plan,n,identity)}));
 const key=(plan,n)=>scopedKey(plan,n,nodeResourceIdentity(resources(plan.settings),plan.settings));
 const nodeResult=(plan,n)=>{
  const wanted=key(plan,n),legacyWanted=sha256(nodeInputKey(plan,n,nodeResourceIdentity(resources(plan.settings),plan.settings)));
  const prior=result(n.result_key);if(!prior?.resources)return null;
  const oldLegacy=sha256(nodeInputKey(plan,n,prior.resources)),normalizedLegacy=sha256(nodeInputKey(plan,n,nodeResourceIdentity(prior.resources,plan.settings)));
  const oldScoped=scopedKey(plan,n,prior.resources),normalizedScoped=scopedKey(plan,n,nodeResourceIdentity(prior.resources,plan.settings));
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
  const comparison=plan.comparison?result(plan.comparison):null;
  return {...plan,nodes,comparison,comparison_stale:!historical&&!!comparison&&stable(comparison.resources)!==stable(resources(plan.settings))};
 };
 const saveJob=j=>put(path.join(root,'jobs',j.id+'.json'),j);
 const comparisonInput=(plan,view)=>({planning:plan.planning,nodes:view.nodes.map(x=>({id:x.id,parent_id:x.parent_id,parent_basis:x.parent_basis,version:x.version,text:x.text,boundary:x.result.boundary,review:x.result.review})),dependencies:plan.dependencies,retained:plan.retained});
 const recalculate=(id,revision)=>{
  const p=load(id);if(p.revision!==revision)throw Error('PLAN_VERSION_CONFLICT');const view=materialize(p),prior=result(p.comparison);
  if(!prior||view.nodes.some(n=>!n.result))throw Error('CURRENT_SAVED_COMPARISON_REQUIRED');
  let original=prior.comparison_input;
  if(!original&&prior.trace_path){const file=path.resolve(path.dirname(prior.trace_path),'source.txt');if(!file.startsWith(path.resolve(root,'calls')+path.sep))throw Error('INVALID_COMPARISON_PROVENANCE');original=read(file);}
  const input=comparisonInput(p,view);if(stable(input)!==stable(original))throw Error('COMPARISON_INPUT_CHANGED');
  const boundaries=Object.fromEntries(view.nodes.map(n=>[n.id,n.result])),t=performance.now(),comparison=comparePlan({plan:p,boundaries,proposal:prior.proposal,review:prior.review}),calculation_ms=performance.now()-t;
  const k=sha256(stable({previous:p.comparison,core:resources(p.settings).core,operation:'PROGRAM_RECALCULATE'}));
  if(!result(k))put(path.join(root,'results',k+'.json'),{...prior,input_sha256:k,comparison,comparison_input:input,recalculated_from:p.comparison,calculation_resources:resources(p.settings),local_calculation_ms:calculation_ms,new_model_requests:0},true);
  p.comparison=k;p.revision++;save(p,'程序复算 · 0次模型请求');return materialize(p);
 };
 for(const f of files(path.join(root,'jobs')).filter(f=>f.endsWith('.json'))){const j=read(f);if(['QUEUED','RUNNING'].includes(j.status)){j.status='INTERRUPTED';j.ended_at=new Date().toISOString();saveJob(j);}jobs.set(j.id,j);}
 const create=(label,settings)=>{const p=newPlan(randomUUID(),label);p.settings=settings;save(p,'创建任务');return materialize(p);};
 const update=(id,revision,command)=>{
  const p=load(id);if(revision!==p.revision)throw Error('PLAN_VERSION_CONFLICT');
  const q=mutatePlan(p,command);
  // Eagerly invalidate only actual semantic dependencies, not display labels or independent children.
  for(const n of q.nodes)if(n.result_key&&n.result_key!==key(q,n))n.stale_result_key=n.result_key;
  save(q,command.type);return materialize(q);
 };
 const recordReceipts=dir=>{
  const requests=files(dir).filter(f=>/request-\d+\.json$/.test(f));
  return requests.map(f=>{const req=read(f),rf=f.replace(/request-(\d+)\.json$/,'receipt-$1.json'),receipt=fs.existsSync(rf)?read(rf):null;return {path:path.relative(root,f),phase:f.includes('audit-call')?'AUDIT':'GENERATE',count:receipt?.conservative_request_count??1,elapsed_ms:receipt?.elapsed_ms??receipt?.wall_time_ms??null,thread_id:receipt?.thread_id??null,usage:receipt?.usage??null,status:receipt?(receipt.exit_code===0?'RETURNED':'FAILED'):'RECEIPT_MISSING',requested_model:req.requested_model};});
 };
 async function run(j,controller){
  j.status='RUNNING';saveJob(j);
  const frozen=load(j.project_id),startResources=resources(frozen.settings);
  j.execution_settings=structuredClone(frozen.settings);j.dictionary_snapshot=startResources.dictionaries;saveJob(j);
  try{
   const generated=frozen.nodes.filter(n=>!j.node_ids?.length||j.node_ids.includes(n.id));
   const entries=j.kind==='generate'?[...generated,...(frozen.mode==='TREE'&&frozen.nodes.some(n=>n.parent_id)?[null]:[])]:[null];
   for(const n of entries){
    controller.signal.throwIfAborted();resourceGuard();
    const comparisonPlan=n?null:load(j.project_id);let input,k,boundaries;
    if(n){input=semanticInput(frozen,n,startResources);k=key(frozen,n);}
    else{
     const view=materialize(comparisonPlan);
     if(view.nodes.some(x=>!x.result||x.result.interface_error))throw Error('GENERATE_CURRENT_NODES_FIRST');
     boundaries=Object.fromEntries(view.nodes.map(x=>[x.id,x.result]));
     input=comparisonInput(comparisonPlan,view);
     k=sha256(stable({input,resources:startResources,calculator:COMPARISON_VERSION,settings:comparisonPlan.settings}));
    }
    const cached=null;let value=null;
    const entry={request_id:randomUUID(),node_id:n?.id??null,source_version:n?.version??null,input_sha256:k,kind:n?'NODE_GENERATE_REVIEW':'COMPARE_GENERATE_REVIEW',cache_hit:false,started_at:new Date().toISOString(),status:'RUNNING'};
    j.entries.push(entry);saveJob(j);
    try{
     const dir=path.join(root,'calls',entry.request_id);entry.directory=dir;
     try{
      const options={kind:n?'node':'compare',input,output:dir,settings:frozen.settings,signal:controller.signal,resourceGuard,productSnapshot,onProgress:p=>{const at=new Date().toISOString();j.progress={...p,at,node_id:n?.id??null};j.timeline??=[];const prior=j.timeline.at(-1);if(!prior||prior.stage!==p.stage||prior.signal!==p.signal||prior.node_id!==(n?.id??null))j.timeline.push({...j.progress});saveJob(j);}};
      value=j.kind==='review_compare'?await reviewWorkbenchComparison({...options,previous:result(frozen.comparison)}):await execute(options);
     }finally{
      entry.calls=recordReceipts(dir);j.request_count+=entry.calls.reduce((sum,c)=>sum+c.count,0);saveJob(j);
     }
     if(!n){const t=performance.now();value.comparison=comparePlan({plan:comparisonPlan,boundaries,proposal:value.proposal,review:value.review});value.local_calculation_ms=performance.now()-t;value.comparison_input=input;}
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
  if(active.size)throw Error('COMPILER_BUSY');const p=load(id);
  if(node_ids.some(n=>!p.nodes.some(x=>x.id===n)))throw Error('NODE_NOT_FOUND');
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
