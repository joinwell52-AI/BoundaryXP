import {spawn} from 'node:child_process';import path from 'node:path';import {fileURLToPath} from 'node:url';
const BASE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(BASE,'../../..');let worker=null,serial=Promise.resolve();
function invoke(request){return new Promise((resolve,reject)=>{if(!worker){worker=spawn(path.join(ROOT,'.boundx/nlp-venv/Scripts/python.exe'),['-X','utf8',path.join(BASE,'linguistic-worker.py')],{cwd:ROOT,windowsHide:true,stdio:['pipe','pipe','pipe']});worker.stderr.on('data',()=>{});worker.on('exit',()=>{worker=null;});}const p=worker;let out='';const cleanup=()=>{p.stdout.off('data',receive);p.off('error',fail);p.off('exit',fail);clearTimeout(timer);};const fail=e=>{cleanup();reject(Error(String(e)));};const receive=b=>{out+=b.toString('utf8');if(!out.includes('\n'))return;cleanup();try{const r=JSON.parse(out);if(r.error)reject(Error(r.error));else resolve(r);}catch(e){reject(e);}};const timer=setTimeout(()=>{p.kill();fail('NLP_TIMEOUT');},120000);p.stdout.on('data',receive);p.once('error',fail);p.once('exit',fail);p.stdin.write(JSON.stringify(request)+'\n');});}
export function closeNlp(){worker?.kill();worker=null;}
export function modelRequest(request){const p=serial.then(()=>invoke(request));serial=p.catch(()=>{});return p;}
export function lexical(doc){
 const text=doc.source.raw_text,found=[];
 const patterns={URI:/https?:\/\/[^\s<>]+/giu,PATH:/(?:[A-Za-z]:[\\/]|\.{0,2}\/)[\w./\\*-]+/gu,FILE:/\b[\w-]+(?:\.[\w-]+)*\.(?:yaml|yml|json|toml|py|md|txt|log|csv|js|ts|xml|pdf|tar|zip)\b/giu,REFERENCE:/\b[A-Z][A-Z0-9]{1,12}-\d+(?:[-.]\d+)*\b/gu,COMMIT:/\b(?=[a-f0-9]*[a-f])(?=[a-f0-9]*\d)[a-f0-9]{7,40}\b/giu,VERSION:/\bv?\d+\.\d+(?:\.[\w*-]+)?\b/giu,IDENTIFIER:/\b[A-Za-z][A-Za-z0-9]*(?:[-_.][A-Za-z0-9]+)+\b/gu,DURATION:/\d+(?:\.\d+)?\s*(?:分钟|小时|秒|天|minutes?\b|hours?\b|seconds?\b)/giu,NUMBER:/\b\d+(?:\.\d+)?\b/gu};
 for(const [type,re] of Object.entries(patterns))for(const m of text.matchAll(re)){const start=[...text.slice(0,m.index)].length,end=start+[...m[0]].length;if(found.some(x=>x.span.start<=start&&x.span.end>=end))continue;found.push({id:'literal:'+found.length,type,span:doc.span(start,end)});}
 // Role suffixes compose nominal phrases; they never supply a business predicate.
 const roles=/(?:由|向|给)\s*([^，,。；;\s]{0,10}?(?:工程师|经理|负责人|主管|审查员|审核员|操作者)(?:\p{Script=Han}{1,3}(?:工|先生|女士))?)/gu;
 for(const m of text.matchAll(roles)){const start=[...text.slice(0,m.index+m[0].indexOf(m[1]))].length;found.push({id:'literal:'+found.length,type:'ROLE_PHRASE',span:doc.span(start,start+[...m[1]].length)});}
 for(const m of text.matchAll(/在\s*([^，,。；;\s]{1,12}?(?:环境|系统|平台|目录|服务器))/gu)){const start=[...text.slice(0,m.index+m[0].indexOf(m[1]))].length;found.push({id:'literal:'+found.length,type:'LOCATION_PHRASE',span:doc.span(start,start+[...m[1]].length)});}
 return found;
}
export async function analyze(doc){
 const literals=lexical(doc),points=[...doc.source.raw_text],clauses=[];let start=0,sentence=0;
 for(let i=0;i<=points.length;i++){const protectedHere=literals.some(l=>l.span.start<=i&&l.span.end>i);if(i<points.length&&(protectedHere||!/[，,。！？!?；;\n]/u.test(points[i])))continue;let a=start,b=i;while(a<b&&/\s/u.test(points[a]))a++;while(b>a&&/\s/u.test(points[b-1]))b--;if(b>a)clauses.push({id:'clause:'+clauses.length,span:doc.span(a,b),sentence_id:sentence,delimiter:points[i]??''});if(/[。！？!?；;\n]/u.test(points[i]??''))sentence++;start=i+1;}
 const request={clauses:clauses.map(c=>({id:c.id,text:c.span.quote,language:/\p{Script=Han}/u.test(c.span.quote)?'zh':'en',protected:literals.filter(l=>l.span.start>=c.span.start&&l.span.end<=c.span.end).map(l=>({start:l.span.start-c.span.start,end:l.span.end-c.span.start}))}))};
 const promise=serial.then(()=>invoke(request));serial=promise.catch(()=>{});const result=await promise;
 for(const c of clauses){const raw=result.clauses.find(x=>x.id===c.id);c.model=raw.model;c.tokens=raw.tokens.map((t,i)=>({...t,id:c.id+':token:'+i,start:c.span.start+t.start,end:c.span.start+t.end,span:doc.span(c.span.start+t.start,c.span.start+t.end)}));c.entities=raw.entities.map(e=>({...e,span:doc.span(c.span.start+e.start,c.span.start+e.end)}));c.pos_alternatives=raw.pos_alternatives;c.srl=raw.srl;}
 return {clauses,literals,metrics:{model_load_count:result.model_load_count,nlp_ms:result.nlp_ms},models:result.models};
}
