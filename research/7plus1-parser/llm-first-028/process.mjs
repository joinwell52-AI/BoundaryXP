import {spawn} from 'node:child_process';
// Cancel only a child created by this invocation, never an executable name.
export async function runChild(binary,args,{input='',signal,timeoutMs=300000,onEvent=()=>{},env=process.env}={}){
 signal?.throwIfAborted();
 let stdout='',stderr='',timedOut=false,cancelled=false,killReceipt=null;
 const started=Date.now();
 const child=spawn(binary,args,{windowsHide:true,stdio:['pipe','pipe','pipe'],env});
 let killPromise=null;
 const stop=()=>{
  if(child.exitCode!==null||child.signalCode!==null||!child.pid)return;
  if(killPromise)return;
  killPromise=process.platform==='win32'?new Promise(resolve=>{
   const killer=spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
   killer.on('error',e=>{killReceipt={error:e.message};child.kill();resolve();});
   killer.on('close',code=>{killReceipt={exit_code:code,target_pid:child.pid,tree:true};resolve();});
  }):Promise.resolve(child.kill('SIGTERM'));
 };
 const abort=()=>{cancelled=true;stop();};
 signal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(()=>{timedOut=true;stop();},timeoutMs);
 child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
 let pending='';
 child.stdout.on('data',chunk=>{stdout+=chunk;pending+=chunk;const lines=pending.split('\n');pending=lines.pop();for(const line of lines){try{onEvent(JSON.parse(line));}catch{}}});
 child.stderr.on('data',chunk=>stderr+=chunk);
 const result=await new Promise(resolve=>{
  child.once('error',e=>resolve({exit_code:null,error:e.message,exit_confirmed:true}));
  child.once('close',code=>resolve({exit_code:code,error:null,exit_confirmed:true}));
  child.stdin.on('error',()=>{});child.stdin.end(input);
 });
 clearTimeout(timer);signal?.removeEventListener('abort',abort);
 if(killPromise)await killPromise;
 return {...result,stdout,stderr,timed_out:timedOut,cancelled,pid:child.pid??null,kill_receipt:killReceipt,elapsed_ms:Date.now()-started};
}
export function classifyProviderFailure(text){
 if(/usage limit|quota|insufficient_quota|rate.?limit|429|limit reached/i.test(text))return 'CODEX_QUOTA_OR_RATE_LIMIT';
 if(/unauthoriz|authentication|not logged|login|401|403|refresh token/i.test(text))return 'CODEX_LOGIN_REQUIRED';
 if(/model.*(?:not available|not found|unsupported)|unsupported.*model/i.test(text))return 'CODEX_MODEL_UNAVAILABLE';
 if(/connect|network|fetch failed|TLS|socket|DNS|502|503/i.test(text))return 'CODEX_NETWORK_FAILURE';
 return 'CODEX_TRANSPORT_OR_SCHEMA_FAILURE';
}
