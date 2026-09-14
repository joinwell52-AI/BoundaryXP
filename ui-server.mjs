#!/usr/bin/env node
import {calculateWithLibraries} from './admin-python.mjs';
import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { reviewBoundX, reviewPlanBoundary, boundaryResponseStatus, validateBoundaryText } from './src/index.ts';
import { sourceCatalog, materializeSelection, selectionInstruction } from './ui/grounding.mjs';
import { resolveEndpoint } from './ui/connection.mjs';
import {parseAndEvaluateBxpTask, evaluateBxpTask, protocolInfo, PRODUCT_VERSION, RAW_JSON_BYTE_LIMIT} from './src/bxp/index.mjs';
const version=PRODUCT_VERSION;
const LIMIT=1_000_000;
export function validateExtract(value,kind,text,baseline){
  const docs=kind==='task'?[value]:[value?.document,...(Array.isArray(value?.tasks)?value.tasks.map(t=>t.document):[])];
  for(const [index,doc] of docs.entries()){
    if(!doc||typeof doc.text!=='string')continue;
    for(const [key,quote] of Object.entries(doc.parameters??{}))if(typeof quote!=='string'||!doc.text.includes(quote))throw Error(`第 ${index+1} 份文档的 ${key} 引用不在原文中，请改用原文连续片段。`);
    for(const entry of [...(Array.isArray(doc.actions)?doc.actions:[]),...(Array.isArray(doc.completion)?doc.completion:[])])if(typeof entry?.quote!=='string'||!doc.text.includes(entry.quote))throw Error(`第 ${index+1} 份文档的动作或完成条件引用不在原文中。`);
  }
  if(kind==='task'){validateBoundaryText(value); if(value.text!==text) throw Error('整理结果改变了原文，请重试或手动整理。');}
  else {reviewPlanBoundary(baseline,value); if(value.document.text!==text || value.tasks.some(t=>!text.includes(t.document.text))) throw Error('派单原文与提交文本不一致。');}
  return value;
}
export async function callModel(config,messages,{signal,fetchImpl=fetch,maxOutputTokens=6000}={}){
  if(!config || typeof config.key!=='string' || !config.key.trim() || typeof config.model!=='string' || !config.model.trim()) throw Error('请先填写模型和 API 密钥。');
  const {url}=resolveEndpoint(config.url,config.protocol);
  const body=config.protocol==='responses' ? {model:config.model,input:messages,max_output_tokens:maxOutputTokens,stream:false,store:false} : {model:config.model,messages,max_tokens:maxOutputTokens,stream:false};
  if(config.protocol==='responses'&&config.disableThinking===true)body.thinking={type:'disabled'};
  const response=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.key},body:JSON.stringify(body),signal,redirect:'error'});
  if(!response.ok){await response.body?.cancel();const hint={404:'请核对接口路径、模型名称及该账号的模型访问权限。',401:'请核对密钥是否有效。',403:'请核对模型访问权限。',429:'可能是限流或额度不足，请检查服务商控制台。'}[response.status]??'请检查服务商状态。';throw Error('模型服务返回 HTTP '+response.status+'。'+hint+' 未自动重试。');}
  const reader=response.body.getReader(); let size=0,chunks=[];
  for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>2_000_000){await reader.cancel();throw Error('模型响应过大。');}chunks.push(value);}
  let raw;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw Error('模型返回了无效响应。');}
  let text;
  if(config.protocol==='responses'){
    if(raw.status!=='completed') throw Error('模型未完整完成输出，请检查输出限制或手动整理。');
    text=(raw.output??[]).filter(x=>x.type==='message').flatMap(x=>x.content??[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n');
  }else{
    if(raw.choices?.[0]?.finish_reason!=='stop') throw Error('模型输出被截断或未正常结束。');
    text=raw.choices[0].message?.content;
  }
  if(typeof text!=='string'||!text.trim()) throw Error('模型没有返回文本。');
  return {text,model:raw.model??config.model,usage:raw.usage??null};
}
export function createApp({fetchImpl=fetch}={}){
  const token=randomBytes(32).toString('hex');
  const server=http.createServer(async(req,res)=>{
    const origin='http://127.0.0.1:'+server.address().port;
    const send=(status,data,type='application/json')=>{res.writeHead(status,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"});res.end(type==='application/json'?JSON.stringify(data):data);};
    if(req.headers.host!==new URL(origin).host) return send(403,{error:'仅允许本机地址访问。'});
    if(req.method==='GET'){
      if(req.url==='/api/protocol-info')return send(200,protocolInfo());
      const assets={'/':['ui/bxp.html','text/html'],'/legacy':['ui/index.html','text/html'],'/bxp.mjs':['ui/bxp.mjs','text/javascript'],'/bxp-view.mjs':['ui/bxp-view.mjs','text/javascript'],'/bxp.css':['ui/bxp.css','text/css'],'/codepoints.mjs':['ui/codepoints.mjs','text/javascript'],'/app.js':['ui/app.js','text/javascript'],'/records.mjs':['ui/records.mjs','text/javascript'],'/connection.mjs':['ui/connection.mjs','text/javascript'],'/advice.mjs':['ui/advice.mjs','text/javascript'],'/i18n.mjs':['ui/i18n.mjs','text/javascript'],'/progress.mjs':['ui/progress.mjs','text/javascript'],'/task-risks.mjs':['ui/task-risks.mjs','text/javascript'],'/local-task.mjs':['ui/local-task.mjs','text/javascript'],'/admin-check.mjs':['ui/admin-check.mjs','text/javascript'],'/admin-boundary.mjs':['ui/admin-boundary.mjs','text/javascript'],'/source-advice.mjs':['ui/source-advice.mjs','text/javascript'],'/source-render.mjs':['ui/source-render.mjs','text/javascript'],'/admin-operators.mjs':['ui/admin-operators.mjs','text/javascript'],'/admin-slots.mjs':['ui/admin-slots.mjs','text/javascript'],'/admin-glossary.mjs':['ui/admin-glossary.mjs','text/javascript'],'/admin-rules.mjs':['ui/admin-rules.mjs','text/javascript'],'/paired-copy.mjs':['ui/paired-copy.mjs','text/javascript'],'/style.css':['ui/style.css','text/css']};
      const asset=assets[req.url];if(!asset)return send(404,{error:'Not found'});
      return send(200,readFileSync(new URL(asset[0],import.meta.url),'utf8').replaceAll('__SESSION_TOKEN__',token).replaceAll('__APP_VERSION__',version),asset[1]);
    }
    if(req.method!=='POST'||req.headers.origin!==origin||req.headers['x-boundx-token']!==token||!req.headers['content-type']?.startsWith('application/json')) return send(403,{error:'请求来源或会话无效，请重新打开页面。'});
    const controller=new AbortController();
    res.on('close',()=>controller.abort());
    const timer=setTimeout(()=>controller.abort(),180000);
    try{
      const bxp=req.url==='/api/bxp/evaluate';
      if(!bxp&&!req.url.startsWith('/api/legacy/'))return send(404,{error:'Legacy endpoints require /api/legacy/.'});
      let size=0,buffers=[];for await(const chunk of req){size+=chunk.length;if(size>(bxp?RAW_JSON_BYTE_LIMIT:LIMIT)){if(bxp)return send(200,evaluateBxpTask(undefined));throw Error('输入超过 1 MB。');}buffers.push(chunk);}
      if(bxp)return send(200,parseAndEvaluateBxpTask(Buffer.concat(buffers)));
      req.url=req.url.replace('/api/legacy/','/api/');
      let data;try{data=JSON.parse(Buffer.concat(buffers).toString('utf8'));}catch{throw Error('输入不是有效 JSON。');}
      if(req.url==='/api/admin-boundary')return send(200,await calculateWithLibraries(data.text,{signal:controller.signal}));
      if(req.url==='/api/connection'){
        const started=Date.now();
        const output=await callModel(data.config,[{role:'user',content:'这是API连接测试，请只回复 OK。'}],{signal:controller.signal,fetchImpl,maxOutputTokens:256});
        return send(200,{connected:true,model:output.model,usage:output.usage,elapsed_ms:Date.now()-started,checked_at:new Date().toISOString(),endpoint:resolveEndpoint(data.config.url,data.config.protocol).url});
      }
      if(req.url==='/api/review'){
        const result=data.kind==='task'?reviewBoundX(data.document):reviewPlanBoundary(data.baseline,data.plan);
        return send(200,{result,english:data.kind==='task'?reviewBoundX(data.document,{locale:'en'}):reviewPlanBoundary(data.baseline,data.plan,{locale:'en'})});
      }
      if(req.url==='/api/replies')return send(200,{result:boundaryResponseStatus(data.review,data.replies)});
      if(!['/api/extract','/api/pm'].includes(req.url))return send(404,{error:'Not found'});
      const text=data.text;
      if(typeof text!=='string'||!text.trim()||text.length>100000)throw Error('请提供 1 至 100000 字符的文本。');
      let messages;
      if(req.url==='/api/extract'){
        if(!['task','plan'].includes(data.kind))throw Error('未知整理类型。');
        if(data.kind==='plan')validateBoundaryText(data.baseline);
        messages=[{role:'system',content:selectionInstruction+(data.kind==='task'?'本次只输出一个Mapping。':'本次输出{"document":总规划Mapping,"tasks":[{"id":"任务编号","source":{"from":"起始原句编号","to":"结束原句编号"},"mapping":派单Mapping,"depends_on":["必须完成的前置任务编号"]}]}。派单mapping中的引用不得超出source范围。PM保留职责在总规划，不伪造为派出的子任务。相同含义的完成条件沿用基线id；含义不同不可复用。')},
          {role:'user',content:JSON.stringify({source_text:text,segments:sourceCatalog(text).map(({id,text})=>({id,text})),...(data.kind==='plan'?{confirmed_baseline:data.baseline}:{})})}];
      }else{
        if(!['generate','recheck'].includes(data.mode))throw Error('未知 PM 请求。');
        messages=[{role:'system',content:'你扮演PM，仅生成拟议规划，不执行、不调用工具、不声称已巡检。DEV、QA、OPS为执行角色；EVAL独立，由ADMIN安排，PM不得向EVAL派单。自行决定拆分数量，每份派单写编号、负责人、工作、交付物、启动依赖、验收条件，并写PM保留职责和根任务收口条件。约1500字以内。提醒不是新增授权；自主说明保留、修改或需ADMIN澄清的内容。'}, {role:'user',content:text}];
        if(data.mode==='recheck'){
          if(typeof data.plan!=='string'||!data.plan.trim()||data.plan.length>100000||typeof data.reminder!=='string'||!data.reminder.trim()||data.reminder.length>100000)throw Error('复核需要完整规划和提醒文本。');
          messages.push({role:'assistant',content:data.plan},{role:'user',content:data.reminder});
        }
      }
      const output=await callModel(data.config,messages,{signal:controller.signal,fetchImpl});
      if(req.url==='/api/pm')return send(200,output);
      let value;try{value=JSON.parse(output.text.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}catch{throw Error('模型未返回有效结构，请手动整理或重新分析。');}
      const notes=[];
      try{value=materializeSelection(value,data.kind,text,notes);validateExtract(value,data.kind,text,data.baseline);}catch(e){throw Error('候选引用或结构校验失败：'+e.message);}
      return send(200,{value,notes,model:output.model,usage:output.usage});
    }catch(e){
      // Never relay provider bodies, request headers, keys, or network exception details.
      const message=e.name==='AbortError'?'请求已取消或超时，未自动重试。':e instanceof TypeError?'请求失败，请检查网络和输入配置。':e.message;
      if(!res.destroyed)send(400,{error:message});
    }finally{clearTimeout(timer);}
  });
  return server;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
  const app=createApp();const port=Number(process.env.BOUNDX_PORT??0);
  app.listen(port,'127.0.0.1',()=>{
    const url='http://127.0.0.1:'+app.address().port;
    console.log('BoundX '+version+' — '+url+' (Ctrl+C to stop)');
    if(process.argv.includes('--open')&&process.platform==='win32')spawn('rundll32.exe',['url.dll,FileProtocolHandler',url],{windowsHide:true,stdio:'ignore'}).on('error',()=>{});
  });
}
