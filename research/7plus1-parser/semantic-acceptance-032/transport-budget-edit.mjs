import fs from 'node:fs';
function edit(p,changes){let t=fs.readFileSync(p,'utf8');for(const [a,b]of changes){if(t.split(a).length!==2)throw Error('ANCHOR:'+p);t=t.replace(a,b);}fs.writeFileSync(p+'.032.tmp',t,{flag:'wx'});fs.renameSync(p+'.032.tmp',p);}
edit('research/7plus1-parser/llm-first-028/process.mjs',[
 ["timeoutMs=300000,onEvent=()=>{},env=process.env","timeoutMs=300000,onEvent=()=>{},onStderr=()=>{},env=process.env"],
 ["child.stderr.on('data',chunk=>stderr+=chunk);","child.stderr.on('data',chunk=>{stderr+=chunk;onStderr(stderr);});"]
]);
edit('research/7plus1-parser/llm-first-028/provider.mjs',[
 ["const execution=await runChild(probe.binary,args,{input:prompt,signal,timeoutMs,onEvent,env:","const retryAbort=new AbortController();let internalRetries=0,retryBudgetExceeded=false;\n  const childSignal=signal?AbortSignal.any([signal,retryAbort.signal]):retryAbort.signal;\n  const onStderr=text=>{const count=(text.match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length;const delta=count-internalRetries;if(delta<=0)return;internalRetries=count;if(requestBudget){requestBudget.remaining-=delta;if(requestBudget.remaining<=0){retryBudgetExceeded=true;retryAbort.abort();}}const file=path.join(directory,`transport-retries-${attempt}.json`);fs.writeFileSync(file+'.tmp',JSON.stringify({observed_internal_retries:internalRetries,cancelled_for_budget:retryBudgetExceeded,backend_billing_claimed:false}));fs.renameSync(file+'.tmp',file);};\n  const execution=await runChild(probe.binary,args,{input:prompt,signal:childSignal,timeoutMs,onEvent,onStderr,env:"],
 ["const receipt={...result,timed_out:timedOut,thread_id:","const receipt={...result,observed_internal_retries:internalRetries,conservative_request_count:1+internalRetries,retry_budget_exceeded:retryBudgetExceeded,timed_out:timedOut,thread_id:"],
 ["if(result.cancelled)throw Object.assign(Error('CANCELLED')","if(retryBudgetExceeded)throw Object.assign(Error('MODEL_REQUEST_BUDGET_EXHAUSTED'),{code:'MODEL_REQUEST_BUDGET_EXHAUSTED',attempts,exit_confirmed:result.exit_confirmed});\n  if(result.cancelled)throw Object.assign(Error('CANCELLED')"]
]);
