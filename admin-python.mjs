import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {checkAdminText} from './ui/admin-check.mjs';
const local=fileURLToPath(new URL(process.platform==='win32'?'./.venv/Scripts/python.exe':'./.venv/bin/python',import.meta.url));
export function calculateWithLibraries(text,{signal,python=process.env.BOUNDX_PYTHON||(existsSync(local)?local:'python'),timeoutMs=10000}={}){
 if(typeof text!=='string'||!text.trim()||text.length>100000)return Promise.reject(Error('请提供 1 至 100000 字符的任务。 / Provide 1–100000 characters.'));
 if(signal?.aborted)return Promise.reject(new DOMException('Cancelled','AbortError'));
 const statements=checkAdminText(text).structure.statements;
 return new Promise((resolve,reject)=>{
  const child=spawn(python,['-I',fileURLToPath(new URL('./python/admin_compute.py',import.meta.url))],{windowsHide:true,shell:false,stdio:['pipe','pipe','pipe']});
  let finished=false,size=0,chunks=[];
  const finish=(error,value)=>{if(finished)return;finished=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);if(error){child.kill();reject(error);}else resolve(value);};
  const cancel=()=>finish(new DOMException('Cancelled','AbortError'));
  const timer=setTimeout(()=>finish(Error('本机计算超时，未认定通过。 / Local calculation timed out; not a pass.')),timeoutMs);
  signal?.addEventListener('abort',cancel,{once:true});
  child.on('error',()=>finish(Error('本机 Python 不可用，请按安装指南配置三类计算库。 / Local Python is unavailable; install the calculation dependencies.')));
  child.stdin.on('error',()=>{});
  child.stderr.on('data',()=>{}); // Never relay paths, environment or traceback to UI.
  child.stdout.on('data',b=>{size+=b.length;if(size>2000000)return finish(Error('本机计算结果过大。 / Local result too large.'));chunks.push(b);});
  child.on('close',code=>{
   if(code!==0)return finish(Error('本机计算未完成，请核对依赖安装或输入规模。 / Local calculation failed; check dependencies or input size.'));
   try{const result=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if(result.schema!=='boundx-admin-engines/v1'||result.text!==text||result.engines?.length!==3)throw Error();
    finish(null,result);
   }catch{finish(Error('本机计算返回无效结果。 / Invalid local calculation result.'));}
  });
  child.stdin.end(JSON.stringify({text,statements}));
 });
}
