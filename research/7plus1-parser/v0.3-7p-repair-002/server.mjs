import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import {randomUUID} from 'node:crypto';import {fileURLToPath,pathToFileURL} from 'node:url';
import {parse7Plus1} from './engine.mjs';import {warmup} from '../full-pipeline-trace-v0.1/warmup.mjs';import {markdown,exportName} from '../local-lab/history.mjs';import {HistoryStore} from './history.mjs';import {traceMarkdown,traceHTML} from './export.mjs';
export const BASE=path.dirname(fileURLToPath(import.meta.url));
export function createServer({store=new HistoryStore(path.join(BASE,'../local-lab/history')),parse=parse7Plus1,reviewRoot=path.join(BASE,'../local-lab/reviews')}={}){
 let busy=false;const tokens=new Map();
 return http.createServer(async(req,res)=>{
 const send=(status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));};
 try{
  const host=req.headers.host;if(!['127.0.0.1:'+req.socket.localPort,'localhost:'+req.socket.localPort].includes(host))return send(403,{error:'LOCALHOST_ONLY'});if(req.headers.origin&&req.headers.origin!=='http://'+host)return send(403,{error:'SAME_ORIGIN_REQUIRED'});
  const url=new URL(req.url,'http://'+host),route=url.pathname;
  if(req.method==='GET'&&['/','/app.js','/trace-ui.js','/annotations.js','/compiler-ui.js','/style.css'].includes(route)){const name=route==='/'?'index.html':route==='/app.js'?'native-app.js':route.slice(1);res.writeHead(200,{'content-type':name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'"});return res.end(fs.readFileSync(path.join(BASE,'web',name)));}
  if(req.method==='GET'&&route==='/api/runs')return send(200,store.list());
  const traceRoute=/^\/api\/runs\/([^/]+)\/trace\.(md|json|html)$/u.exec(route);
  if(req.method==='GET'&&traceRoute){const run=store.get(traceRoute[1]),trace=run.result.compiler_v03?run.result:run.result.full_trace;if(!trace)return send(409,{error:'TRACE_NOT_RECORDED',reason:'Historical snapshots are never recomputed'});const ext=traceRoute[2],name=exportName(run).replace('7plus1-result-','7plus1-trace-').replace(/\.md$/u,'.'+ext);res.writeHead(200,{'content-type':ext==='html'?'text/html; charset=utf-8':ext==='md'?'text/markdown; charset=utf-8':'application/json; charset=utf-8','content-disposition':`attachment; filename="${name}"`,'cache-control':'no-store'});return res.end(ext==='html'?traceHTML(trace):ext==='md'?traceMarkdown(trace):JSON.stringify(trace,null,2)+'\n');}
  const match=/^\/api\/runs\/([^/]+)(?:\/(export|json))?$/u.exec(route);
  if(req.method==='GET'&&match){const run=store.get(match[1]);if(match[2]){res.writeHead(200,{'content-type':match[2]==='export'?'text/markdown; charset=utf-8':'application/json; charset=utf-8','cache-control':'no-store','content-disposition':`attachment; filename="${match[2]==='export'?exportName(run):exportName(run).replace(/\.md$/u,'.json')}"`});return res.end(match[2]==='export'?(run.result.compiler_v03?traceMarkdown(run.result):markdown(run)):JSON.stringify(run.result,null,2)+'\n');}return send(200,run);}
  if(!['POST','DELETE'].includes(req.method))return send(404,{error:'NOT_FOUND'});
  if(!/^application\/json\b/iu.test(req.headers['content-type']??''))return send(415,{error:'JSON_REQUIRED'});
  const chunks=[];let size=0;for await(const b of req){size+=b.length;if(size>2*1024*1024)return send(413,{error:'MAX_INPUT_SIZE'});chunks.push(b);}const input=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if(req.method==='POST'&&route==='/api/clear-confirmation'){const token=randomUUID();tokens.set(token,Date.now()+60000);return send(200,{token,message:'将删除全部 7+1 Parser 本地测试历史，此操作不可撤销。'});}
  if(req.method==='DELETE'&&route==='/api/runs'){if(busy)return send(409,{error:'PARSER_BUSY'});const expires=tokens.get(input.token);tokens.delete(input.token);if(!expires||expires<Date.now()||input.confirmation!=='DELETE_ALL_HISTORY')return send(409,{error:'SECOND_CONFIRMATION_REQUIRED'});return send(200,{deleted:store.clear()});}
  if(req.method==='DELETE'&&match&&!match[2]){if(input.confirmation!==match[1])return send(409,{error:'CONFIRMATION_REQUIRED'});store.delete(match[1]);return send(200,{deleted:match[1]});}
  if(req.method==='POST'&&route==='/api/parse'){if(busy)return send(409,{error:'PARSER_BUSY'});if(typeof input.text!=='string'&&typeof input.base64!=='string')return send(400,{error:'TEXT_REQUIRED'});busy=true;try{const bytes=input.base64!==undefined?Buffer.from(input.base64,'base64'):Buffer.from(input.text,'utf8');const result=await parse(bytes,{filename:input.filename??'task.txt'});return send(200,store.save(result));}finally{busy=false;}}
  if(req.method==='POST'&&route==='/api/review'){store.get(input.run_id);if(typeof input.notes!=='string'||input.notes.length>20000)return send(400,{error:'INVALID_REVIEW'});fs.mkdirSync(reviewRoot,{recursive:true});const name=randomUUID()+'.json';fs.writeFileSync(path.join(reviewRoot,name),JSON.stringify({run_id:input.run_id,notes:input.notes,timestamp:new Date().toISOString()},null,2),{flag:'wx'});return send(201,{file:name});}
  return send(404,{error:'NOT_FOUND'});
 }catch(e){send(e.code==='ENOENT'?404:400,{error:e.message});}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){console.log('Warming frozen linguistic and retrieval models for native P2.2…');await warmup();createServer().listen(Number(process.env.BOUNDX_PARSER_PORT??58618),'127.0.0.1',()=>console.log('BoundX P2.2 Semantic Decoding Lab: http://127.0.0.1:'+(process.env.BOUNDX_PARSER_PORT??58618)));}
