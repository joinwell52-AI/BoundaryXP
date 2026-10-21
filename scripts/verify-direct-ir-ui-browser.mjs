// Real existing UI, frozen responses, actual observation HTTP calls; no model.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),pkg=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
if(fs.existsSync(output))throw Error('BROWSER_EVIDENCE_ALREADY_EXISTS');fs.mkdirSync(output,{recursive:true});
const {chromium}=await import(pathToFileURL(path.join(root,'.boundx/browser-tools/node_modules/playwright/index.mjs')));
const {createServer}=await import(pathToFileURL(path.join(pkg,'research/7plus1-parser/llm-first-028/service.mjs'))),{lockProduct}=await import(pathToFileURL(path.join(pkg,'product/short-compiler/resources.mjs'))),lock=lockProduct(pkg);
const trace=JSON.parse(fs.readFileSync(path.resolve(process.argv[4]??path.join(root,'docs/reports/7plus1/CLOUD-REPAIR-ui77/FINAL-PACKAGE-VERIFY/replay/trace.json')))),run='10000000-0000-4000-8000-000000000077',data=path.join(output,'data'),dir=path.join(data,'runs',run);fs.mkdirSync(dir,{recursive:true});
trace.product_snapshot=lock.snapshot;fs.writeFileSync(path.join(dir,'trace.json'),JSON.stringify(trace));const original=fs.readFileSync(path.join(dir,'trace.json'));
fs.writeFileSync(path.join(dir,'run.json'),JSON.stringify({run_id:run,status:'COMPLETED',stage:'COMPLETED',source_text:trace.source.text,source_sha256:trace.source.sha256,created_at:new Date().toISOString(),ended_at:new Date().toISOString(),engine:'BoundX 7+1 compiler',compiler_revision:lock.snapshot.compiler_revision,contract:lock.snapshot.contract,product_snapshot:lock.snapshot,parse_method:'SKILL',request_profile:'DIRECT_CANDIDATE_IR_R01',actual_model:null}));
let modelCalls=0;const server=createServer({dataRoot:data,productSnapshot:lock.snapshot,resourceGuard:lock.verify,parse:()=>{modelCalls++;throw Error('MODEL_CALL_FORBIDDEN');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:'+server.address().port);await page.getByText('Run History',{exact:true}).click();await page.locator('#history button').first().click();await page.getByRole('button',{name:'保存观测并核查',exact:true}).waitFor();
 assert.equal(await page.locator('#source-example option').count(),60);
 assert.equal(await page.locator('#slots').innerText().then(t=>t.includes('必须：true')),false);
 assert.ok((await page.locator('#calculation-root').innerText()).includes('程序反例查询'));
 await page.locator('#calculation-root .graph-edge button').first().click();assert.ok(await page.locator('#evidence mark').count()>0);
 for(const tab of ['pending','forbid','frames','diagnostics','json'])await page.locator('[data-tab="'+tab+'"]').click();
 await page.locator('#calculation-root').screenshot({path:path.join(output,'FINAL-RESULTS.png')});
 const submit=page.getByRole('button',{name:'保存观测并核查',exact:true});
 const unknownResponse=page.waitForResponse(r=>r.url().endsWith('/observations')&&r.request().method()==='POST');await submit.click();const unknown=await(await unknownResponse).json();assert.equal(unknown.calculation.observed_evaluation.status,'UNKNOWN');
 await page.getByText('补充其他实际操作与未列身份',{exact:true}).click();
 const prohibition=trace.ir.requirements.find(r=>r.modality==='FORBIDDEN'&&!r.applicability),event=trace.ir.events.find(e=>e.id===prohibition.subject.id),environment=trace.ir.entities.find(e=>e.kind==='ENVIRONMENT'&&e.id!=='prodenv');
 const extra=[{event_id:'browser-supplied-future-instance',operation:event.operation,owner_id:event.owner_id,roles:{...Object.fromEntries(event.roles.map(r=>[r.role,r.value])),ENVIRONMENT:{kind:'ENTITY',id:environment.id}},occurred:true,start:1,end:2,external_inputs:[]}];
 await page.getByLabel('补充实际操作记录').fill(JSON.stringify(extra));const violatedResponse=page.waitForResponse(r=>r.url().endsWith('/observations')&&r.request().method()==='POST');await submit.click();const violated=await(await violatedResponse).json();assert.equal(violated.calculation.observed_evaluation.status,'VIOLATED');assert.equal(violated.calculation.observed_evaluation.requirements.find(r=>r.requirement_id===prohibition.id).result,'VIOLATED');
 assert.equal(modelCalls,0);assert.deepEqual(fs.readFileSync(path.join(dir,'trace.json')),original);assert.deepEqual(errors,[]);
 const result={version:lock.snapshot.product_version,compiler:lock.snapshot.compiler_revision,model_calls:0,browser:'system Chromium via Playwright',source_examples:60,existing_ui_tabs:5,exact_source_highlight:true,default_unknown_observations:'UNKNOWN',confirmed_forbidden_event:'VIOLATED',original_trace_unchanged:true,page_errors:errors,local_58618_operated:false};fs.writeFileSync(path.join(output,'BROWSER-VERIFICATION.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}catch(error){fs.writeFileSync(path.join(output,'BROWSER-FAILURE.json'),JSON.stringify({error:error.message,page_errors:errors,model_calls:modelCalls},null,2)+'\n');throw error;}finally{await browser.close();await new Promise(r=>server.close(r));}
