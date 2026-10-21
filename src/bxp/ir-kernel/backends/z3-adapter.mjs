import {fork} from 'node:child_process';import {fileURLToPath} from 'node:url';
export function solve(problem,{signal,wallMs=15000,solverMs=5000,memoryMb=256}={}){
 if(signal?.aborted)return Promise.resolve({result:'UNKNOWN',reason:'CANCELLED',verification:'NOT_RUN'});
 if(wallMs<=0||solverMs<=0||memoryMb<32)return Promise.resolve({result:'UNKNOWN',reason:'RESOURCE_LIMIT',verification:'NOT_RUN'});
 return new Promise(resolve=>{
  const child=fork(fileURLToPath(new URL('./z3-worker.mjs',import.meta.url)),[],{stdio:['ignore','ignore','pipe','ipc'],windowsHide:true,execArgv:['--max-old-space-size='+memoryMb]});
  let settled=false,stderr='',reply=null;
  const finish=x=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);resolve({...x,worker_pid:child.pid,worker_exited:child.exitCode!==null||child.signalCode!==null});};
  const stop=reason=>{reply={result:'UNKNOWN',reason,verification:'NOT_RUN'};child.kill();};
  const cancel=()=>stop('CANCELLED');signal?.addEventListener('abort',cancel,{once:true});
  const timer=setTimeout(()=>stop('RESOURCE_LIMIT_WALL_TIME'),wallMs);
  child.stderr.on('data',b=>{if(stderr.length<8192)stderr+=b.toString().slice(0,8192-stderr.length);});
  child.once('message',x=>{reply=x;});
  child.once('error',e=>finish({result:'UNKNOWN',verification:'FAILED',reason:'WORKER_ERROR',message:e.message}));
  child.once('exit',(code,signal)=>finish(reply??{result:'UNKNOWN',verification:'FAILED',reason:/out of memory|heap limit|allocation failed|memory exceeded/i.test(stderr)?'RESOURCE_LIMIT_MEMORY':'WORKER_EXIT',exit_code:code,signal,stderr}));
  child.send({problem,budget:{wallMs,solverMs,memoryMb}});
 });
}
