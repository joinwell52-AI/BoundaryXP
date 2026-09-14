export function canReuseTask(task,mappedText,text){return !!task&&task.text===text&&mappedText===text;}
export function requestStage(route,data){
 if(route==='bxp-admin')return {zh:'等待模型抽取7+1；候选通过后进行本地BXP计算',en:'Waiting for model extraction; local BXP calculation follows candidate validation',remote:true};
 if(route==='connection')return {zh:'正在测试模型连接',en:'Testing model connection',remote:true};
 if(route==='pm')return {zh:data.mode==='recheck'?'等待模型回复 PM 提醒':'等待模型生成 PM 分工',en:data.mode==='recheck'?'Waiting for the PM response':'Waiting for the model to generate PM assignments',remote:true};
 if(route==='extract')return {zh:data.kind==='task'?'等待模型提取任务原文，尚未开始边界计算':'等待模型提取 PM 规划，尚未开始差异计算',en:data.kind==='task'?'Waiting for task extraction; boundary calculation has not started':'Waiting for PM plan extraction; comparison has not started',remote:true};
 return {zh:'正在本地计算，不调用模型',en:'Calculating locally without a model call',remote:false};
}
export async function withDeadline(operation,{signal,timeoutMs=185000}={}){
 const controller=new AbortController();let timer,listener;
 const interrupted=new Promise((_,reject)=>{
  const stop=reason=>{controller.abort(reason);reject(reason);};
  listener=()=>stop(signal.reason??new DOMException('Cancelled','AbortError'));
  if(signal?.aborted)listener();else signal?.addEventListener('abort',listener,{once:true});
  timer=setTimeout(()=>stop(Object.assign(new Error('等待超时，已停止本次请求，未自动重试。已有结果保留。'),{name:'TimeoutError'})),timeoutMs);
 });
 try{return await Promise.race([interrupted,Promise.resolve().then(()=>{controller.signal.throwIfAborted();return operation(controller.signal);})]);}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',listener);}
}
