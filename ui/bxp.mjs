import {renderBxpResult} from './bxp-view.mjs';
const input=document.querySelector('#task-json'), file=document.querySelector('#task-file');
const button=document.querySelector('#evaluate'), message=document.querySelector('#message'), host=document.querySelector('#result');
const token=document.querySelector('meta[name="session-token"]').content;
let info;
try {
  const response=await fetch('/api/protocol-info');
  if(!response.ok)throw Error('Cannot load protocol info');
  info=await response.json();
  document.querySelector('#protocol-info').textContent=`Product ${info.product_version} · Protocol ${info.protocol_version} · Suite ${info.suite_version}`;
  button.disabled=false;
} catch { message.textContent='协议信息加载失败，请重新打开。 / Could not load protocol info; reopen the page.'; }
file.addEventListener('change',async()=>{
  host.replaceChildren(); message.textContent='';
  try { if(file.files[0])input.value=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await file.files[0].arrayBuffer()); }
  catch { input.value=''; message.textContent='文件必须是有效 UTF-8。 / File must be valid UTF-8.'; }
});
input.addEventListener('input',()=>host.replaceChildren());
button.addEventListener('click',async()=>{
  button.disabled=true; input.disabled=true; file.disabled=true; host.replaceChildren();
  message.textContent='本地计算中 / Calculating locally';
  const raw=input.value;
  try {
    const response=await fetch('/api/bxp/evaluate',{method:'POST',headers:{'Content-Type':'application/json','X-BoundX-Token':token},body:raw});
    const result=await response.json();
    if(!response.ok)throw Error(result.error);
    renderBxpResult(host,result.evaluation.validation==='valid'?JSON.parse(raw):null,result,info);
    message.textContent='计算已完成，不代表审批或执行授权。 / Calculated; not approval or execution authority.';
  } catch { message.textContent='检查未完成，请核对本地服务。 / Evaluation did not complete; check the local server.'; }
  finally { button.disabled=false; input.disabled=false; file.disabled=false; }
});
