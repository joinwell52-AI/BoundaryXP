import {spawn} from 'node:child_process';
// Cancel only a child created by this invocation, never an executable name.
export async function runChild(binary,args,{input='',signal,timeoutMs=null,onEvent=()=>{},onStderr=()=>{},env=process.env}={}){
 if(timeoutMs!==null&&(typeof timeoutMs!=='number'||!Number.isFinite(timeoutMs)||timeoutMs<0))throw Error('INVALID_TIMEOUT');
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
 // No implicit model deadline. Explicit deadlines and manual cancel remain.
 const timer=timeoutMs>0?setTimeout(()=>{timedOut=true;stop();},timeoutMs):null;
 child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
 let pending='';
 child.stdout.on('data',chunk=>{stdout+=chunk;pending+=chunk;const lines=pending.split('\n');pending=lines.pop();for(const line of lines){try{onEvent(JSON.parse(line));}catch{}}});
 child.stderr.on('data',chunk=>{stderr+=chunk;onStderr(stderr);});
 const result=await new Promise(resolve=>{
  child.once('error',e=>resolve({exit_code:null,error:e.message,exit_confirmed:true}));
  child.once('close',code=>resolve({exit_code:code,error:null,exit_confirmed:true}));
  child.stdin.on('error',()=>{});child.stdin.end(input);
 });
 if(timer!==null)clearTimeout(timer);signal?.removeEventListener('abort',abort);
 if(killPromise)await killPromise;
 return {...result,stdout,stderr,timed_out:timedOut,cancelled,pid:child.pid??null,kill_receipt:killReceipt,elapsed_ms:Date.now()-started};
}
export function classifyProviderFailure(text){
 // Numeric substrings in timestamps, UUIDs and retry durations are not HTTP status evidence.
 const status=code=>new RegExp('(?:HTTP(?:/\\d(?:\\.\\d)?)?(?:\\s+status)?|status(?:[_ ]code)?|response(?:[_ ]status)?|error[_ ]code)\\s*[:=]?\\s*'+code+'\\b','i').test(text);
 if(/usage limit|quota|insufficient_quota|rate.?limit|limit reached|\b429\s+Too Many Requests\b/i.test(text)||status(429))return 'CODEX_QUOTA_OR_RATE_LIMIT';
 if(/unauthoriz|authentication|not logged|\blogin\b|refresh token|\b(?:401\s+Unauthorized|403\s+Forbidden)\b/i.test(text)||status(401)||status(403))return 'CODEX_LOGIN_REQUIRED';
 if(/model.*(?:not available|not found|unsupported)|unsupported.*model/i.test(text))return 'CODEX_MODEL_UNAVAILABLE';
 if(/connect|network|fetch failed|TLS|socket|DNS|workspace routing discovery failed/i.test(text)||status(502)||status(503))return 'CODEX_NETWORK_FAILURE';
 return 'CODEX_TRANSPORT_OR_SCHEMA_FAILURE';
}
