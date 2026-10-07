import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {randomUUID,randomBytes,timingSafeEqual} from 'node:crypto';
import {ROOT,buildBundle} from './bundle.mjs';
import {prepareSource,sha256} from './source.mjs';
import {parse7Plus1,writeJSON,compilerRevision} from './engine.mjs';
import {runtimeInventory} from './evidence.mjs';
const loadedRuntime=JSON.stringify(runtimeInventory());
export const WEB=path.resolve(ROOT,'../v0.3-p2.1-generalization/web');
export const DATA=process.env.BOUNDX_DATA_DIR?path.resolve(process.env.BOUNDX_DATA_DIR):path.resolve(ROOT,'../../../.boundx/7plus1-short');
const ID=/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const terminal=new Set(['COMPLETED','COMPLETED_WITH_UNRESOLVED','FAILED','CANCELLED','INTERRUPTED']);
const save=(file,value)=>{const temp=file+'.'+randomUUID()+'.tmp';writeJSON(temp,value);fs.renameSync(temp,file);};
const knownErrors=['EMPTY_SOURCE','SOURCE_BYTE_LIMIT','SHORT_TEXT_SCOPE_EXCEEDED','SOURCE_UTF8_ROUNDTRIP_FAILED','CODEX_TIMEOUT','CODEX_LOGIN_REQUIRED','CODEX_QUOTA_OR_RATE_LIMIT','CODEX_NETWORK_FAILURE','CODEX_MODEL_UNAVAILABLE','CODEX_TRANSPORT_OR_SCHEMA_FAILURE','CODEX_ENV_UNAVAILABLE','UNSUPPORTED_CLI_FLAG','SKILL_CONTRACT_VERSION_MISMATCH','UNEXPECTED_TOOL_ACTIVITY','AUDIT_SESSION_NOT_INDEPENDENT','CANCELLED'];
export function publicError(e){const code=knownErrors.find(c=>String(e.code??e.message).startsWith(c))??(e instanceof TypeError?'INVALID_UTF8':'COMPILER_ERROR');return {code,message:code,details_available_locally:true};}
const safeTrace=trace=>{const {model_calls,...rest}=trace;return {...rest,model_calls:Object.fromEntries(Object.entries(model_calls??{}).map(([phase,calls])=>[phase,calls.map(({thread_id,elapsed_ms,exit_code,usage,skill_mode,actual_model,schema_check})=>({thread_id,elapsed_ms,exit_code,usage,skill_mode,actual_model,schema_check}))]))};};
export function createServer({dataRoot=DATA,parse=parse7Plus1,legacyRoot=process.env.BOUNDX_LEGACY_DIR?path.resolve(process.env.BOUNDX_LEGACY_DIR):path.resolve(ROOT,'../local-lab/history'),timeoutMs=300000}={}){
 fs.mkdirSync(path.join(dataRoot,'runs'),{recursive:true});
 const records=new Map(),sessions=new Map(),active=new Map(),clearTokens=new Map();
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
   if(req.method==='GET'&&['/','/app.js','/style.css'].includes(route)){
    const name=route==='/'?'index.html':route==='/app.js'?'native-app.js':'style.css';
    res.writeHead(200,{'content-type':name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'"});return res.end(fs.readFileSync(path.join(WEB,name)));
   }
   if(req.method==='GET'&&route==='/api/session'){
    const session=randomBytes(32).toString('hex');sessions.set(session,true);res.setHeader('set-cookie',`boundx_session=${session}; HttpOnly; SameSite=Strict; Path=/`);
    return send(200,{token:session,engine:'BoundX short compiler',compiler_revision:compilerRevision,runtime_sha256:sha256(loadedRuntime),contract:buildBundle('parse').schema.properties.contract_version.const,skill_mode:'INLINE_BUNDLE',native_skill_loading:'NOT_VERIFIED',actual_model:null,requested_model:'gpt-6.1-sol',limit_codepoints:300,business_execution_enabled:false});
   }
   if(req.method==='GET'&&route==='/api/runs')return send(200,[...[...records.values()].map(summary),...legacyList()].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))));
   const legacy=/^\/api\/legacy\/([a-f0-9-]+)$/u.exec(route);
   if(req.method==='GET'&&legacy){if(!ID.test(legacy[1]))return send(400,{error:'INVALID_RUN_ID'});return send(200,{status:'LEGACY_READ_ONLY',raw:JSON.parse(fs.readFileSync(path.join(legacyRoot,legacy[1]+'.json'),'utf8'))});}
   const match=/^\/api\/runs\/([^/]+)(?:\/(cancel|json|export|trace\.json|trace\.md|trace\.html))?$/u.exec(route);
   let record=match?records.get(match[1]):null;
   if(match&&!ID.test(match[1]))return send(400,{error:'INVALID_RUN_ID'});
   if(req.method==='GET'&&match){
    if(!record)return send(404,{error:'RUN_NOT_FOUND'});
    const traceFile=path.join(folder(record.run_id),'trace.json');
    const trace=fs.existsSync(traceFile)&&record.status.startsWith('COMPLETED')?safeTrace(JSON.parse(fs.readFileSync(traceFile,'utf8'))):null;
    if(!match[2])return send(200,{...summary(record),source_text:record.source_text,result:trace});
    if(!trace)return send(409,{error:'RESULT_NOT_READY'});
    if(match[2]==='json')return download(JSON.stringify(trace.canonical,null,2)+'\n','application/json',record.run_id+'-7plus1.json');
    if(match[2]==='export')return download(trace.chinese,'text/markdown',record.run_id+'-7plus1.md');
    if(match[2]==='trace.json')return download(JSON.stringify({run:summary(record),...trace},null,2)+'\n','application/json',record.run_id+'-trace.json');
    const md=trace.chinese+'\n## 原文及完整过程（候选不是最终边界）\n\n```json\n'+JSON.stringify(trace,null,2)+'\n```\n';
    if(match[2]==='trace.md')return download(md,'text/markdown',record.run_id+'-trace.md');
    if(match[2]==='trace.html'){const escaped=md.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');return download('<!doctype html><meta charset="utf-8"><title>BoundX local trace</title><pre>'+escaped+'</pre>','text/html',record.run_id+'-trace.html');}
    return send(404,{error:'NOT_FOUND'});
   }
   if(!['POST','DELETE'].includes(req.method))return send(404,{error:'NOT_FOUND'});
   const cookie=String(req.headers.cookie??'').split(';').map(v=>v.trim()).find(v=>v.startsWith('boundx_session='))?.slice(15);
   const token=String(req.headers['x-boundx-session']??'');
   if(!cookie||!sessions.has(cookie)||token.length!==cookie.length||!timingSafeEqual(Buffer.from(token),Buffer.from(cookie)))return send(403,{error:'SESSION_REQUIRED'});
   if(!/^application\/json\b/i.test(req.headers['content-type']??''))return send(415,{error:'JSON_REQUIRED'});
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16384)return send(413,{error:'REQUEST_BYTE_LIMIT'});chunks.push(chunk);}
   const input=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));
   if(req.method==='POST'&&route==='/api/parse'){
    if(Object.keys(input).some(k=>!['text','base64','filename','request_id'].includes(k)))return send(400,{error:'UNSUPPORTED_REQUEST_FIELD'});
    if(!ID.test(input.request_id??''))return send(400,{error:'REQUEST_ID_REQUIRED'});
    if((typeof input.text==='string')===(typeof input.base64==='string'))return send(400,{error:'ONE_SOURCE_REQUIRED'});
    if(input.base64!==undefined&&!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input.base64))return send(400,{error:'INVALID_BASE64'});
    if(JSON.stringify(runtimeInventory())!==loadedRuntime)return send(409,{error:'STALE_CODE_RESTART_REQUIRED'});
    const bytes=input.base64!==undefined?Buffer.from(input.base64,'base64'):Buffer.from(input.text,'utf8');const source=prepareSource(bytes);
    const prior=[...records.values()].find(r=>r.request_id===input.request_id);
    if(prior)return prior.source_sha256===source.sha256?send(200,summary(prior)):send(409,{error:'REQUEST_ID_SOURCE_MISMATCH'});
    if(active.size)return send(409,{error:'COMPILER_BUSY'});
    const id=randomUUID(),controller=new AbortController(),created_at=new Date().toISOString();fs.mkdirSync(folder(id));
    record={run_id:id,request_id:input.request_id,created_at,status:'QUEUED',stage:'QUEUED',source_text:source.text,source_sha256:source.sha256,codepoints:source.codepoints,filename:typeof input.filename==='string'?path.basename(input.filename).slice(0,100):'pasted-task.txt',engine:'BoundX short compiler',contract:buildBundle('parse').schema.properties.contract_version.const,skill_mode:'INLINE_BUNDLE',native_skill_loading:'NOT_VERIFIED',requested_model:'gpt-6.1-sol',actual_model:null,execution_mode:'LIVE_CODEX',stages:[{stage:'QUEUED',at:created_at}]};
    record.compiler_revision=compilerRevision;record.runtime_sha256=sha256(loadedRuntime);records.set(id,record);persist(record);active.set(id,controller);send(202,summary(record));
    setImmediate(async()=>{
     try{
      const result=await parse(bytes,{output:folder(id),timeoutMs,signal:controller.signal,onProgress:p=>{if(record.status==='CANCELLING')return;record.status='RUNNING';record.stage=p.stage;record.revision=p.revision??0;record.stages.push({...p,at:new Date().toISOString()});persist(record);}});
      if(controller.signal.aborted)throw Error('CANCELLED');
      record.status=result.canonical.unresolved.length||result.canonical.gaps.length?'COMPLETED_WITH_UNRESOLVED':'COMPLETED';record.stage=record.status;
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
  }catch(e){if(!res.headersSent)send(e.code==='ENOENT'?404:400,{error:publicError(e).code});else res.end();}
 });
 server.activeJobs=active;server.records=records;server.dataRoot=dataRoot;return server;
}
export function startServer(){
 const server=createServer();const port=Number(process.env.BOUNDX_PARSER_PORT??58618);
 server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'PORT_IN_USE: do not stop unknown services':e.message);process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>console.log(`BoundX short compiler 031 / INLINE_BUNDLE: http://127.0.0.1:${port}/`));return server;
}
