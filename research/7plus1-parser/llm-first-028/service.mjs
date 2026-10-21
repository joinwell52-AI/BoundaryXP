import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {randomUUID,randomBytes,timingSafeEqual} from 'node:crypto';
import {ROOT,buildBundle} from './bundle.mjs';
import {parseMethod,bundleEvidence} from './comparison-bundle.mjs';
const requestProfile='DIRECT_CANDIDATE_IR_R01';
import {prepareSource,sha256} from './source.mjs';
import {MAX_REQUEST_BYTES,INPUT_LIMITS} from './input-limits.mjs';
import {sourceExamples,loadSourceExample} from './examples.mjs';
import {parse7Plus1,writeJSON,compilerRevision} from './engine.mjs';
import {runtimeInventory} from './evidence.mjs';
import {modelCatalog,requestSettings,publicProgress,partialArtifacts,savedCallHistory} from './observability.mjs';
import {sessionActivity} from './model-activity.mjs';
import {recalculateObservedTrace} from './observation-request.mjs';
import {dictionaryCatalog,selectDictionaries,dictionaryIdentity,scanDictionaries} from './dictionaries.mjs';
import {createWorkbench} from './workbench-store.mjs';
import {previewDictionaries} from './dictionary-preview.mjs';
const loadedRuntime=JSON.stringify(runtimeInventory());
const resourceProfile=buildBundle('parse').resource_profile;
const resourceFingerprint=(method='SKILL')=>sha256(JSON.stringify([buildBundle('parse',{parseMethod:method}).sha256,buildBundle('audit',{parseMethod:method}).sha256,compilerRevision,sha256(loadedRuntime)]));
const resourceEvidence=(method='SKILL')=>({parse_method:method,resource_profile:buildBundle('parse',{parseMethod:method}).resource_profile,request_profile:requestProfile,effective_resource_sha256:resourceFingerprint(method),selected_resources:{parse:bundleEvidence(buildBundle('parse',{parseMethod:method})),audit:bundleEvidence(buildBundle('audit',{parseMethod:method}))}});
export const WEB=path.resolve(ROOT,'../v0.3-p2.1-generalization/web');
export const DATA=process.env.BOUNDARYXP_DATA_DIR?path.resolve(process.env.BOUNDARYXP_DATA_DIR):path.resolve(ROOT,'../../../.boundx/7plus1-short');
const ID=/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const terminal=new Set(['COMPLETED','COMPLETED_WITH_UNRESOLVED','FAILED','CANCELLED','INTERRUPTED']);
const save=(file,value)=>{const temp=file+'.'+randomUUID()+'.tmp';writeJSON(temp,value);fs.renameSync(temp,file);};
const knownErrors=['INSTALLED_RESOURCE_CHANGED','EMPTY_SOURCE','SOURCE_BYTE_LIMIT','SHORT_TEXT_SCOPE_EXCEEDED','SOURCE_UTF8_ROUNDTRIP_FAILED','CODEX_TIMEOUT','CODEX_LOGIN_REQUIRED','CODEX_QUOTA_OR_RATE_LIMIT','CODEX_NETWORK_FAILURE','CODEX_MODEL_UNAVAILABLE','CODEX_TRANSPORT_OR_SCHEMA_FAILURE','CODEX_ENV_UNAVAILABLE','UNSUPPORTED_CLI_FLAG','SKILL_CONTRACT_VERSION_MISMATCH','UNEXPECTED_TOOL_ACTIVITY','AUDIT_SESSION_NOT_INDEPENDENT','CANCELLED'];
export function publicError(e){
 const additional=['DIRECT_IR_TECHNICAL_REJECTED','CODEX_OUTPUT_SCHEMA_REJECTED','DIRECT_IR_PATCH_TRANSPORT_NOT_IMPLEMENTED','COMPACT_WIRE_CONTRACT_FAILURE','MODEL_REQUEST_BUDGET_EXHAUSTED','IDENTITY_RESERVED_ID','PATCH_GLOBAL_ID_COLLISION','REVISION_BASE_DIGEST_MISMATCH'];
 const code=[...knownErrors,...additional].find(c=>String(e.code??e.message).startsWith(c))??(e instanceof TypeError?'INVALID_UTF8':'COMPILER_ERROR');
 const safeDetails=['PATCH_GLOBAL_ID_COLLISION','IDENTITY_RESERVED_ID','WIRE_SCHEMA_INVALID','REVISION_BASE_DIGEST_MISMATCH'];
 return {code,message:code,...(safeDetails.includes(e.detail)?{detail_code:e.detail}:{}),details_available_locally:true};
}
const safeTrace=trace=>{const {model_calls,...rest}=trace;return {...rest,model_calls:Object.fromEntries(Object.entries(model_calls??{}).map(([phase,calls])=>[phase,calls.map(({thread_id,elapsed_ms,exit_code,usage,skill_mode,actual_model,schema_check})=>({thread_id,elapsed_ms,exit_code,usage,skill_mode,actual_model,schema_check}))]))};};
export function createServer({dataRoot=DATA,parse=parse7Plus1,legacyRoot=process.env.BOUNDARYXP_LEGACY_DIR?path.resolve(process.env.BOUNDARYXP_LEGACY_DIR):path.resolve(ROOT,'../local-lab/history'),timeoutMs=null,resourceGuard=()=>{},productSnapshot=null,maxModelRequests=6,catalog=modelCatalog()}={}){
 const selectedBundle=(phase,method='SKILL')=>buildBundle(phase,{parseMethod:method,contractVersion:productSnapshot?.contract??'candidate-ir/1.4'});
 const requestProfile=selectedBundle('parse').request_profile;
 const resourceProfile=selectedBundle('parse').resource_profile;
 const resourceFingerprint=(method='SKILL')=>sha256(JSON.stringify([selectedBundle('parse',method).sha256,selectedBundle('audit',method).sha256,compilerRevision,sha256(loadedRuntime)]));
 const resourceEvidence=(method='SKILL')=>({parse_method:method,resource_profile:selectedBundle('parse',method).resource_profile,request_profile:requestProfile,effective_resource_sha256:resourceFingerprint(method),selected_resources:{parse:bundleEvidence(selectedBundle('parse',method)),audit:bundleEvidence(selectedBundle('audit',method))}});
 fs.mkdirSync(path.join(dataRoot,'runs'),{recursive:true});
 const records=new Map(),sessions=new Map(),active=new Map(),clearTokens=new Map();
 const workbench=createWorkbench({dataRoot,resourceGuard,productSnapshot,active});
 const folder=id=>{if(!ID.test(id))throw Error('INVALID_RUN_ID');return path.join(dataRoot,'runs',id);};
 const persist=r=>save(path.join(folder(r.run_id),'run.json'),r);
 for(const dir of fs.readdirSync(path.join(dataRoot,'runs'))){if(!ID.test(dir))continue;const file=path.join(folder(dir),'run.json');if(!fs.existsSync(file))continue;const r=JSON.parse(fs.readFileSync(file,'utf8'));if(!terminal.has(r.status)){r.status='INTERRUPTED';r.stage='INTERRUPTED';r.ended_at=new Date().toISOString();r.error={code:'SERVER_RESTART_INTERRUPTED'};persist(r);}if(!r.hidden)records.set(dir,r);}
 const summary=r=>({...r,source_text:undefined,filename:r.filename??'task.txt',elapsed_ms:(r.ended_at?Date.parse(r.ended_at):Date.now())-Date.parse(r.created_at),summary:r.source_text.slice(0,100)});
 const legacyList=()=>fs.existsSync(legacyRoot)?fs.readdirSync(legacyRoot).filter(f=>ID.test(f.replace(/\.json$/,''))&&f.endsWith('.json')).map(f=>{try{const raw=JSON.parse(fs.readFileSync(path.join(legacyRoot,f),'utf8'));const p=raw.payload??raw;return {run_id:'legacy:'+f.slice(0,-5),created_at:p.created_at??null,status:'LEGACY_READ_ONLY',engine:p.parser_version??raw.format??'unknown legacy',summary:'旧引擎原始快照（不重算）'};}catch{return null;}}).filter(Boolean):[];
 const server=http.createServer(async(req,res)=>{
  const send=(status,value)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(value));};
  const download=(value,type,name)=>{res.writeHead(200,{'content-type':type+'; charset=utf-8','content-disposition':`attachment; filename="${name}"`,'cache-control':'no-store'});res.end(value);};
  try{
   const host=req.headers.host,allowed=['127.0.0.1:'+req.socket.localPort,'localhost:'+req.socket.localPort];
   if(!allowed.includes(host))return send(403,{error:'LOCALHOST_ONLY'});
   if(req.headers.origin&&req.headers.origin!=='http://'+host)return send(403,{error:'SAME_ORIGIN_REQUIRED'});
   const url=new URL(req.url,'http://'+host),route=url.pathname;
   const brandAssets={'/branding/logo-light.png':'BoundaryXP-logo-light.png','/branding/logo-dark.png':'BoundaryXP-logo-dark.png','/branding/icon.png':'BoundaryXP-icon.png'};
   if(req.method==='GET'&&Object.hasOwn(brandAssets,route)){
    resourceGuard();res.writeHead(200,{'content-type':'image/png','cache-control':'no-store','x-content-type-options':'nosniff'});return res.end(fs.readFileSync(path.resolve(ROOT,'../../../assets/branding/v2',brandAssets[route])));
   }
   if(req.method==='GET'&&route==='/brand.css'){
    res.writeHead(200,{'content-type':'text/css; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});return res.end(fs.readFileSync(path.join(WEB,'brand.css')));
   }
   if(req.method==='GET'&&route==='/api/examples'){resourceGuard();return send(200,{count:sourceExamples().length,cases:sourceExamples(),answers_included:false,automatic_model_calls:false});}
   const example=/^\/api\/examples\/(REAL-GOLD-\d{3})$/.exec(route);
   if(req.method==='GET'&&example){resourceGuard();try{return send(200,loadSourceExample(example[1]));}catch(e){if(e.message==='SOURCE_EXAMPLE_NOT_FOUND')return send(404,{error:e.message});throw e;}}
   if(req.method==='GET'&&route==='/input-limits.js'){
    res.writeHead(200,{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store'});return res.end(fs.readFileSync(path.join(ROOT,'input-limits.mjs')));
   }
   if(req.method==='GET'&&['/dictionary-preview.js','/dictionary-preview.css','/comparison-math-view.js','/workbench-progress.js','/single-radar-center.js','/single-radar-project.js','/single-radar-adapter.js','/single-radar-center.css'].includes(route)){const name=route.slice(1);res.writeHead(200,{'content-type':name.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});return res.end(fs.readFileSync(path.join(WEB,name)));}
   if(req.method==='GET'&&['/','/history','/workbench.js','/workbench.css','/app.js','/process-view.js','/direct-ir-process.js','/calculation-view.js','/style.css'].includes(route)){
    const name=route==='/'?'workbench.html':route==='/history'?'index.html':route==='/workbench.js'?'workbench.js':route==='/workbench.css'?'workbench.css':route==='/app.js'?'native-app.js':route==='/process-view.js'?'process-view.js':route==='/direct-ir-process.js'?'direct-ir-process.js':route==='/calculation-view.js'?'calculation-view.js':'style.css';
    res.writeHead(200,{'content-type':name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'"});return res.end(fs.readFileSync(path.join(WEB,name)));
   }
   if(req.method==='GET'&&route==='/api/session'){
    resourceGuard();
    const session=randomBytes(32).toString('hex');sessions.set(session,true);res.setHeader('set-cookie',`boundx_session=${session}; HttpOnly; SameSite=Strict; Path=/`);
    return send(200,{token:session,dictionary_catalog:dictionaryCatalog(),product_snapshot:productSnapshot,engine:'BoundaryXP 7+1 compiler',compiler_revision:compilerRevision,runtime_sha256:sha256(loadedRuntime),contract:selectedBundle('parse').contract_version??selectedBundle('parse').schema.properties.contract_version.const,skill_mode:'INLINE_BUNDLE',parse_method:'SKILL',parse_methods:['SKILL','SKILL1'],resource_profile:resourceProfile,request_profile:requestProfile,comparison_resources:{SKILL:resourceEvidence(),SKILL1:resourceEvidence('SKILL1')},native_skill_loading:'NOT_VERIFIED',actual_model:null,requested_model:catalog.default_model,requested_reasoning:catalog.default_reasoning,model_catalog:catalog,source_lineage_supported:false,limit_codepoints:null,input_limits:INPUT_LIMITS,model_wait_policy:{automatic_timeout_ms:timeoutMs>0?timeoutMs:null,manual_cancel:true},business_execution_enabled:false});
   }
   if(req.method==='GET'&&route==='/api/runs')return send(200,[...[...records.values()].map(summary),...legacyList()].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))));
   if(req.method==='GET'&&route==='/api/workbench/projects')return send(200,workbench.list());
   const wb=/^\/api\/workbench\/projects\/([a-f0-9-]{36})(?:\/(snapshots|jobs|export))?$/.exec(route);
   if(req.method==='GET'&&wb){
    if(wb[2]==='snapshots')return send(200,workbench.snapshots(wb[1]));
    if(wb[2]==='jobs')return send(200,workbench.jobs(wb[1]));
    const p=workbench.get(wb[1],url.searchParams.has('revision')?url.searchParams.get('revision'):undefined);
    if(wb[2]==='export')return download(JSON.stringify({plan:p,jobs:workbench.jobs(wb[1]),business_decision:null,execution_authorization:null},null,2),'application/json',wb[1]+'-plan.json');
    return send(200,p);
   }
   const legacy=/^\/api\/legacy\/([a-f0-9-]+)$/u.exec(route);
   if(req.method==='GET'&&legacy){if(!ID.test(legacy[1]))return send(400,{error:'INVALID_RUN_ID'});return send(200,{status:'LEGACY_READ_ONLY',raw:JSON.parse(fs.readFileSync(path.join(legacyRoot,legacy[1]+'.json'),'utf8'))});}
   const match=/^\/api\/runs\/([^/]+)(?:\/(cancel|json|export|trace\.json|trace\.md|trace\.html|activity\.json|calculations\.json))?$/u.exec(route);
   let record=match?records.get(match[1]):null;
   if(match&&!ID.test(match[1]))return send(400,{error:'INVALID_RUN_ID'});
   if(req.method==='GET'&&match){
    if(!record)return send(404,{error:'RUN_NOT_FOUND'});
    const traceFile=path.join(folder(record.run_id),'trace.json');
    const trace=fs.existsSync(traceFile)&&record.status.startsWith('COMPLETED')?safeTrace(JSON.parse(fs.readFileSync(traceFile,'utf8'))):null;
    if(!match[2]){const scanFile=path.join(folder(record.run_id),'dictionary-scan.json');return send(200,{...summary(record),source_text:record.source_text,dictionary_scan:fs.existsSync(scanFile)?JSON.parse(fs.readFileSync(scanFile,'utf8')):null,result:trace,progress:trace?null:partialArtifacts(folder(record.run_id),record),call_history:savedCallHistory(folder(record.run_id)),model_activity:sessionActivity(folder(record.run_id),record)});}
    if(match[2]==='activity.json')return download(JSON.stringify({run_id:record.run_id,run_product_version:record.product_snapshot?.product_version??null,requested_model:record.requested_model,actual_model:record.actual_model??null,...sessionActivity(folder(record.run_id),record)},null,2)+'\n','application/json',record.run_id+'-sessions.json');
    if(!trace)return send(409,{error:'RESULT_NOT_READY'});
    if(match[2]==='calculations.json')return trace.boundary_calculations?download(JSON.stringify(trace.boundary_calculations,null,2)+'\n','application/json',record.run_id+'-calculations.json'):send(404,{error:'CALCULATIONS_NOT_RECORDED'});
    if(match[2]==='json')return download(JSON.stringify(trace.canonical,null,2)+'\n','application/json',record.run_id+'-7plus1.json');
    if(match[2]==='export')return download(trace.chinese,'text/markdown',record.run_id+'-7plus1.md');
    if(match[2]==='trace.json')return download(JSON.stringify({run:summary(record),...trace},null,2)+'\n','application/json',record.run_id+'-trace.json');
    const md=trace.chinese+'\n## 原文及完整过程（候选不是最终边界）\n\n```json\n'+JSON.stringify(trace,null,2)+'\n```\n';
    if(match[2]==='trace.md')return download(md,'text/markdown',record.run_id+'-trace.md');
    if(match[2]==='trace.html'){const escaped=md.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');return download('<!doctype html><meta charset="utf-8"><title>BoundaryXP local trace</title><pre>'+escaped+'</pre>','text/html',record.run_id+'-trace.html');}
    return send(404,{error:'NOT_FOUND'});
   }
   if(!['POST','DELETE'].includes(req.method))return send(404,{error:'NOT_FOUND'});
   const cookie=String(req.headers.cookie??'').split(';').map(v=>v.trim()).find(v=>v.startsWith('boundx_session='))?.slice(15);
   const token=String(req.headers['x-boundx-session']??'');
   if(!cookie||!sessions.has(cookie)||token.length!==cookie.length||!timingSafeEqual(Buffer.from(token),Buffer.from(cookie)))return send(403,{error:'SESSION_REQUIRED'});
   if(!/^application\/json\b/i.test(req.headers['content-type']??''))return send(415,{error:'JSON_REQUIRED'});
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>MAX_REQUEST_BYTES)return send(413,{error:'REQUEST_BYTE_LIMIT',limit_bytes:MAX_REQUEST_BYTES,source_truncated:false});chunks.push(chunk);}
   const input=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));
   if(route.startsWith('/api/workbench/')&&req.method==='POST'){
    resourceGuard();
    const validatedSettings=s=>{const parsed=requestSettings(s??{},catalog);const method=parseMethod(s?.parse_method);if(!['SKILL','SKILL1'].includes(method))throw Error('INVALID_PARSE_METHOD');selectDictionaries(s?.dictionaries??{});return {model:parsed.model,reasoning:parsed.reasoning,parse_method:method,dictionaries:s?.dictionaries??{}};};
    try{
     if(route==='/api/workbench/projects')return send(201,workbench.create(String(input.label??'新任务').slice(0,100),validatedSettings(input.settings)));
     if(wb&&!wb[2]){if(input.command?.type==='recalculate')return send(200,workbench.recalculate(wb[1],input.revision,{reuse_saved:input.command.reuse_saved===true,require_saved_parse:input.command.require_saved_parse===true}));if(['add','edit'].includes(input.command?.type)&&input.command.text!==undefined)prepareSource(Buffer.from(input.command.text,'utf8'));if(input.command?.type==='settings')input.command.settings=validatedSettings(input.command.settings);return send(200,workbench.update(wb[1],input.revision,input.command));}
     if(wb?.[2]==='jobs')return send(202,workbench.start(wb[1],input));
     const cancel=/^\/api\/workbench\/jobs\/([a-f0-9-]{36})\/cancel$/.exec(route);if(cancel)return send(200,workbench.cancel(cancel[1]));
    }catch(e){return send(e.message==='COMPILER_BUSY'||e.message==='PLAN_VERSION_CONFLICT'?409:400,{error:e.message});}
   }
   if(req.method==='POST'&&route==='/api/dictionaries/preview'){
    if(typeof input?.text!=='string')return send(400,{error:'INVALID_DICTIONARY_PREVIEW'});
    if(Buffer.byteLength(input.text,'utf8')>INPUT_LIMITS.max_source_bytes)return send(413,{error:'SOURCE_BYTE_LIMIT'});
    resourceGuard();
    try{return send(200,previewDictionaries(input));}catch(e){return send(400,{error:e.message});}
   }
   if(req.method==='POST'&&route==='/api/dictionaries/scan'){
    if(!input||typeof input.text!=='string'||Object.keys(input).some(k=>!['text','dictionaries'].includes(k)))return send(400,{error:'INVALID_SCAN_TEXT'});
    if(Buffer.byteLength(input.text,'utf8')>INPUT_LIMITS.max_source_bytes)return send(413,{error:'SOURCE_BYTE_LIMIT'});
    resourceGuard();
    let snapshot;try{snapshot=selectDictionaries(input.dictionaries??{});}catch{return send(400,{error:'INVALID_DICTIONARY_SELECTION'});}
    return send(200,scanDictionaries(snapshot,input.text));
   }
   const observed=/^\/api\/runs\/([a-f0-9-]+)\/observations$/u.exec(route);
   if(req.method==='POST'&&observed){
    if(!ID.test(observed[1]))return send(400,{error:'INVALID_RUN_ID'});
    const r=records.get(observed[1]);if(!r)return send(404,{error:'RUN_NOT_FOUND'});
    if(!r.status.startsWith('COMPLETED'))return send(409,{error:'RESULT_NOT_READY'});
    resourceGuard();
    const trace=JSON.parse(fs.readFileSync(path.join(folder(r.run_id),'trace.json'),'utf8'));
    if(trace.pipeline==='BOUNDARY_REPORT_R01')return send(409,{error:'REPORT_PLAN_COMPARISON_NOT_PERFORMED',message:'本次保留LLM边界报告，尚未接入结构化PM规划核验。'});
    if(productSnapshot&&trace.product_snapshot?.manifest_sha256!==productSnapshot.manifest_sha256)return send(409,{error:'OBSERVATION_VERSION_MISMATCH'});
    let result;try{result=recalculateObservedTrace(trace,input);}catch(e){return send(400,{error:e.message});}
    const observation_id=randomUUID(),at=new Date().toISOString();
    const output={run_id:r.run_id,observation_id,at,calculator_revision:compilerRevision,...result};
    const dir=path.join(folder(r.run_id),'observations');fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,observation_id+'.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
    return send(201,output);
   }
   if(req.method==='POST'&&route==='/api/parse'){
    if(Object.keys(input).some(k=>!['text','base64','filename','request_id','model','reasoning','parse_method','dictionaries'].includes(k)))return send(400,{error:'UNSUPPORTED_REQUEST_FIELD'});
    let dictionarySelection;try{dictionarySelection=dictionaryIdentity(selectDictionaries(input.dictionaries??{}));}catch(e){return send(400,{error:'INVALID_DICTIONARY_SELECTION'});}
    let settings;try{settings=requestSettings(input,catalog);}catch(e){return send(400,{error:e.message});}
    let method;try{method=parseMethod(input.parse_method);if(method==='MD')throw Error('MD_COMPARISON_STOPPED');}catch(e){return send(400,{error:e.message});}
    if(!ID.test(input.request_id??''))return send(400,{error:'REQUEST_ID_REQUIRED'});
    if((typeof input.text==='string')===(typeof input.base64==='string'))return send(400,{error:'ONE_SOURCE_REQUIRED'});
    if(input.base64!==undefined&&!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input.base64))return send(400,{error:'INVALID_BASE64'});
    resourceGuard();
    if(JSON.stringify(runtimeInventory())!==loadedRuntime)return send(409,{error:'STALE_CODE_RESTART_REQUIRED'});
    const bytes=input.base64!==undefined?Buffer.from(input.base64,'base64'):Buffer.from(input.text,'utf8');const source=prepareSource(bytes);
    const prior=[...records.values()].find(r=>r.request_id===input.request_id);
    if(prior)return (prior.dictionaries?.sha256??dictionaryIdentity(selectDictionaries()).sha256)===dictionarySelection.sha256&&prior.source_sha256===source.sha256&&prior.requested_model===settings.model&&(prior.requested_reasoning??'medium')===settings.reasoning&&(prior.parse_method??'SKILL')===method&&prior.resource_profile===selectedBundle('parse',method).resource_profile&&prior.request_profile===requestProfile&&prior.effective_resource_sha256===resourceFingerprint(method)?send(200,summary(prior)):send(409,{error:'REQUEST_ID_SOURCE_MISMATCH'});
    if(active.size)return send(409,{error:'COMPILER_BUSY'});
    const id=randomUUID(),controller=new AbortController(),created_at=new Date().toISOString();fs.mkdirSync(folder(id));
    record={run_id:id,request_id:input.request_id,created_at,status:'QUEUED',stage:'QUEUED',source_text:source.text,source_sha256:source.sha256,codepoints:source.codepoints,filename:typeof input.filename==='string'?path.basename(input.filename).slice(0,100):'pasted-task.txt',engine:'BoundaryXP 7+1 compiler',contract:selectedBundle('parse',method).contract_version??selectedBundle('parse',method).schema.properties.contract_version.const,skill_mode:'INLINE_BUNDLE',native_skill_loading:'NOT_VERIFIED',requested_model:'gpt-6.1-sol',actual_model:null,execution_mode:'LIVE_CODEX',stages:[{stage:'QUEUED',at:created_at}]};
    record.requested_model=settings.model;record.requested_reasoning=settings.reasoning;record.model_catalog_sha256=catalog.sha256;record.model_config_acceptance=settings.model===catalog.default_model&&settings.reasoning===catalog.default_reasoning?'BASELINE_PARTIAL':'USER_SELECTED_NOT_SEMANTICALLY_ACCEPTED';
    Object.assign(record,resourceEvidence(method));record.dictionaries=dictionarySelection;record.parse_resource_acceptance='SEMANTIC_REPAIR_CANDIDATE_NOT_ADMIN_ACCEPTED';
    record.product_snapshot=productSnapshot;record.compiler_revision=compilerRevision;record.runtime_sha256=sha256(loadedRuntime);records.set(id,record);persist(record);active.set(id,controller);send(202,summary(record));
    setImmediate(async()=>{
     try{
      const result=await parse(bytes,{output:folder(id),resourceGuard,productSnapshot,timeoutMs,maxModelRequests,model:settings.model,reasoning:settings.reasoning,parseMethod:method,dictionaries:input.dictionaries??{},signal:controller.signal,onProgress:p=>{if(record.status==='CANCELLING')return;const event=publicProgress(p);record.status='RUNNING';record.stage=event.stage;record.revision=event.revision;record.stages.push({...event,at:new Date().toISOString()});persist(record);}});
      if(controller.signal.aborted)throw Error('CANCELLED');
      record.calculation_status=result.boundary_calculations?.status??'NOT_RECORDED';record.status=result.canonical.unresolved.length||result.canonical.gaps.length||['PARTIAL','CONFLICT'].includes(record.calculation_status)?'COMPLETED_WITH_UNRESOLVED':'COMPLETED';record.stage=record.status;
      record.slot_status=Object.fromEntries(Object.entries(result.canonical.slots).map(([k,v])=>[k,v.status]));
      const s=JSON.parse(fs.readFileSync(path.join(folder(id),'run-summary.json'),'utf8'));record.real_calls=s.real_calls;
     }catch(e){record.status=controller.signal.aborted?'CANCELLED':'FAILED';record.stage=record.status;record.error=publicError(e);}
     finally{record.ended_at=new Date().toISOString();record.stages.push({stage:record.stage,at:record.ended_at});persist(record);active.delete(id);}
    });return;
   }
   if(req.method==='POST'&&match?.[2]==='cancel'){
    const controller=active.get(match[1]);if(!record)return send(404,{error:'RUN_NOT_FOUND'});
    if(!controller)return send(200,summary(record));record.status='CANCELLING';record.stage='CANCELLING';persist(record);controller.abort();return send(202,summary(record));
   }
   if(req.method==='POST'&&route==='/api/review'){
    if(!records.has(input.run_id)||typeof input.notes!=='string'||input.notes.length>20000)return send(400,{error:'INVALID_REVIEW'});
    fs.mkdirSync(path.join(dataRoot,'reviews'),{recursive:true});const file=randomUUID()+'.json';writeJSON(path.join(dataRoot,'reviews',file),{run_id:input.run_id,notes:input.notes,at:new Date().toISOString()});return send(201,{file});
   }
   if(req.method==='DELETE'&&match&&!match[2]){if(active.has(match[1]))return send(409,{error:'COMPILER_BUSY'});if(input.confirmation!==match[1])return send(409,{error:'CONFIRMATION_REQUIRED'});record.hidden=true;persist(record);records.delete(match[1]);return send(200,{deleted:match[1],files_retained:true});}
   // Whole-history deletion was an old destructive convenience, keep explicit local hiding only.
   if(req.method==='POST'&&route==='/api/clear-confirmation'){const token=randomUUID();clearTokens.set(token,cookie);return send(200,{token,message:'仅从列表隐藏本轮历史；原始文件与旧历史保持不变。'});}
   if(req.method==='DELETE'&&route==='/api/runs'){if(active.size)return send(409,{error:'COMPILER_BUSY'});if(clearTokens.get(input.token)!==cookie||input.confirmation!=='DELETE_ALL_HISTORY')return send(409,{error:'CONFIRMATION_REQUIRED'});clearTokens.delete(input.token);let count=0;for(const r of records.values()){r.hidden=true;persist(r);count++;}records.clear();return send(200,{hidden:count,files_retained:true});}
   return send(404,{error:'NOT_FOUND'});
  }catch(e){if(!res.headersSent)send(String(e.message).startsWith('INSTALLED_RESOURCE_CHANGED')?409:e.code==='ENOENT'?404:400,{error:publicError(e).code});else res.end();}
 });
 server.activeJobs=active;server.records=records;server.dataRoot=dataRoot;return server;
}
export function startServer(){
 const server=createServer();const port=Number(process.env.BOUNDARYXP_PARSER_PORT??58618);
 server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'PORT_IN_USE: do not stop unknown services':e.message);process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>console.log(`BoundaryXP short compiler 031 / INLINE_BUNDLE: http://127.0.0.1:${port}/`));return server;
}


