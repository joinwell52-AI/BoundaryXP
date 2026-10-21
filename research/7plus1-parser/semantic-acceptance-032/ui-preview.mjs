// Temporary, self-owned browser check of the frozen product UI. No model requests.
import fs from 'node:fs';import path from 'node:path';import {randomUUID} from 'node:crypto';import {pathToFileURL} from 'node:url';
import {report} from './prepare.mjs';
const label=process.argv[2]??'final-c1',root=path.resolve('.boundx/experiments/032/packages',label),data=path.resolve('.boundx/experiments/032/ui-preview-'+label);
const core=path.join(root,'research/7plus1-parser/llm-first-028'),{createServer}=await import(pathToFileURL(path.join(core,'service.mjs'))),{lockProduct}=await import(pathToFileURL(path.join(root,'product/short-compiler/resources.mjs')));
const lock=lockProduct(root),id=randomUUID(),folder=path.join(data,'runs',id);fs.mkdirSync(folder,{recursive:true});
const sourceDir=path.join(report,'runs/development/Q05-R1/run'),trace=JSON.parse(fs.readFileSync(path.join(sourceDir,'trace.json')));
for(const name of ['trace.json','run-summary.json'])fs.copyFileSync(path.join(sourceDir,name),path.join(folder,name),fs.constants.COPYFILE_EXCL);
fs.writeFileSync(path.join(folder,'run.json'),JSON.stringify({run_id:id,request_id:randomUUID(),created_at:new Date().toISOString(),ended_at:new Date().toISOString(),status:'COMPLETED_WITH_UNRESOLVED',stage:'COMPLETED_WITH_UNRESOLVED',source_text:trace.source.text,source_sha256:trace.source.sha256,codepoints:trace.source.codepoints,filename:'FROZEN-RESPONSE-UI-CHECK.txt',compiler_revision:lock.snapshot.compiler_revision,contract:lock.snapshot.contract,product_snapshot:lock.snapshot,execution_mode:'FROZEN_RESPONSE_UI_CHECK_NOT_NEW_MODEL_SCORE',stages:[],slot_status:Object.fromEntries(Object.entries(trace.canonical.slots).map(([k,v])=>[k,v.status]))},null,2));
const server=createServer({dataRoot:data,legacyRoot:path.join(data,'legacy'),productSnapshot:lock.snapshot,resourceGuard:lock.verify,parse:async()=>{throw Error('UI_PREVIEW_NO_MODEL_REQUESTS');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const info={url:'http://127.0.0.1:'+server.address().port+'/',run_id:id,real_model_calls:0,temporary_self_owned_test_port:true,user_port_untouched:58618,source_trace_sha256:trace.source.sha256,product_snapshot:lock.snapshot};
fs.writeFileSync(path.join(report,'engineering/UI-PREVIEW.json'),JSON.stringify(info,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(info));
process.on('SIGINT',()=>server.close(()=>process.exit()));
