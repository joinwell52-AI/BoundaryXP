import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import {pathToFileURL} from 'node:url';
import {parse7Plus1} from './engine.mjs';import {traceHTML,traceMarkdown} from './trace.mjs';
import {hash} from '../p0-semantic-repair-r02/source.mjs';
// Isolated inspection adapter. No production scripts/entry are changed.
export function createServer({storeRoot='.boundx/candidate-024-history',parse=parse7Plus1}={}){
 fs.mkdirSync(storeRoot,{recursive:true});let busy=false;
 const file=id=>{if(!/^[a-zA-Z0-9:_-]+$/u.test(id))throw Error('INVALID_RUN_ID');return path.join(storeRoot,id.replaceAll(':','_')+'.json');};
 const get=id=>{const x=JSON.parse(fs.readFileSync(file(id)));if(hash(JSON.stringify(x.result))!==x.sha256)throw Error('HISTORY_INTEGRITY');return x.result;};
 return http.createServer(async(req,res)=>{const send=(status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));};
 try{const host=req.headers.host;if(!['127.0.0.1:'+req.socket.localPort,'localhost:'+req.socket.localPort].includes(host))return send(403,{error:'LOCALHOST_ONLY'});if(req.headers.origin&&req.headers.origin!=='http://'+host)return send(403,{error:'SAME_ORIGIN_REQUIRED'});
 const url=new URL(req.url,'http://'+host),m=/^\/api\/runs\/([^/]+)(?:\/trace\.(json|md|html))?$/u.exec(url.pathname);
 if(req.method==='GET'&&url.pathname==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','content-security-policy':"default-src 'self'; script-src 'self'"});return res.end('<!doctype html><meta charset="utf-8"><title>024 Candidate Lab</title><h1>024 候选语义图 / Γ 认证检查</h1><textarea id="text" rows="12" cols="100"></textarea><button id="parse">解析</button><div id="result"></div><script src="/app.js"></script>');}
 if(req.method==='GET'&&url.pathname==='/app.js'){res.writeHead(200,{'content-type':'text/javascript; charset=utf-8'});return res.end("document.querySelector('#parse').onclick=async()=>{const d=await fetch('/api/parse',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:document.querySelector('#text').value})}).then(r=>r.json());const a=document.createElement('a');a.href='/api/runs/'+d.run_id+'/trace.html';a.textContent='Source → Gc → Evidence → Γ → Relations → Eligibility → IR → 7+1 → Proof';document.querySelector('#result').replaceChildren(a);};");}
 if(req.method==='GET'&&m){const r=get(m[1]),ext=m[2]??'json';res.writeHead(200,{'content-type':ext==='html'?'text/html; charset=utf-8':ext==='md'?'text/markdown; charset=utf-8':'application/json; charset=utf-8','cache-control':'no-store'});return res.end(ext==='html'?traceHTML(r):ext==='md'?traceMarkdown(r):JSON.stringify(r));}
 if(req.method==='POST'&&url.pathname==='/api/parse'){if(busy)return send(409,{error:'PARSER_BUSY'});if(!/^application\/json/u.test(req.headers['content-type']??''))return send(415,{error:'JSON_REQUIRED'});const buffers=[];let size=0;for await(const b of req){size+=b.length;if(size>2e6)return send(413,{error:'INPUT_LIMIT'});buffers.push(b);}const input=JSON.parse(Buffer.concat(buffers));if(typeof input.text!=='string')return send(400,{error:'TEXT_REQUIRED'});busy=true;try{const r=await parse(input.text),run_id=r.compiler_v03.metadata.run_id;fs.writeFileSync(file(run_id),JSON.stringify({sha256:hash(JSON.stringify(r)),result:r}),{flag:'wx'});return send(200,{run_id,result:r});}finally{busy=false;}}
 return send(404,{error:'NOT_FOUND'});
 }catch(e){send(400,{error:e.message});}});
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)createServer().listen(Number(process.env.BOUNDX_PARSER_PORT??58618),'127.0.0.1');

