import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';import {lockProduct} from './resources.mjs';
const root=path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.33'),lock=lockProduct(root),out=path.resolve('.boundx/exports/MANUAL-CONTRACT-REPAIR-r01/live');
const bytes=fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001.txt'),hash=createHash('sha256').update(bytes).digest('hex');
if(hash!=='ec5fbb0e8841b391bec8f4ee8586ec6656d7d0b6690eb58670c2eb674b9ea130')throw Error('SOURCE_CHANGED');
if(fs.existsSync(out))throw Error('FIRST_RESULT_EXISTS');fs.mkdirSync(out,{recursive:true});
const save=(f,x)=>fs.writeFileSync(path.join(out,f),JSON.stringify(x,null,2)+'\n',{flag:'wx'}),start=Date.now();
save('AUTHORIZATION.json',{scope:'User requests repair of the two observed defects, same-source retest and local version update',prior_user_run:'37a34be8-ce53-4a40-8657-7c7cb9e9eebf',prior_results_preserved:true,source_sha256:hash,maximum_conservative_requests:6,old_032_budget_unchanged:true,model:'gpt-6.1-sol',reasoning:'medium',product:lock.snapshot,started_at:new Date(start).toISOString()});
const {parse7Plus1}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/engine.mjs')));let result=null,failure=null;
try{result=await parse7Plus1(bytes,{output:out,productSnapshot:lock.snapshot,resourceGuard:lock.verify,parseMethod:'SKILL',model:'gpt-6.1-sol',reasoning:'medium',semanticRevision:true,maxModelRequests:6,timeoutMs:null,onProgress:p=>{const row={...p,at:new Date().toISOString(),elapsed_ms:Date.now()-start};fs.appendFileSync(path.join(out,'progress.ndjson'),JSON.stringify(row)+'\n');if(p.signal||!p.phase)console.log(JSON.stringify({stage:p.stage,signal:p.signal??null,elapsed_ms:row.elapsed_ms}));}});}catch(e){failure={code:e.code??e.message,detail:e.detail??null};save('FAILURE.json',failure);}
lock.verify();const summary=fs.existsSync(path.join(out,'run-summary.json'))?JSON.parse(fs.readFileSync(path.join(out,'run-summary.json'))):null;
save('ACTUAL-RESULT.json',{failure,summary,elapsed_ms:Date.now()-start,source_sha256:hash,semantic_acceptance:'AWAITING_SOURCE_REVIEW',user_install_changed:false});
console.log(JSON.stringify({failure,elapsed_ms:Date.now()-start,calls:summary?.real_calls,slots:summary?.slot_status}));
