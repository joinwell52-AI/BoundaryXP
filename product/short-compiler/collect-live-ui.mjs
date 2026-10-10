// Collect completed observation evidence without model requests or semantic edits.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const report=path.resolve('docs/reports/7plus1/LIVE-COMPILATION-UI'),home=path.resolve('.boundx/short-compiler-031-r1'),id='a97337a7-243a-4cf3-979c-62eb2543b9b5',url='http://127.0.0.1:58618';
fs.mkdirSync(report,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const put=(name,bytes)=>fs.writeFileSync(path.join(report,name),bytes,{flag:'wx'});
const json=(name,x)=>put(name,JSON.stringify(x,null,2)+'\n');
const get=async p=>{const r=await fetch(url+p);if(!r.ok)throw Error('READ_FAILED:'+p);return Buffer.from(await r.arrayBuffer());};
const run=JSON.parse(await get('/api/runs/'+id));if(run.status!=='COMPLETED')throw Error('SAMPLE_NOT_COMPLETED');
const current=JSON.parse(await get('/api/session'));
if(current.product_snapshot.product_version!=='0.1.0-candidate.031-r1.2-ui.7')throw Error('WRONG_INSTALLATION');
const exported={};for(const [suffix,name] of [['json','SAMPLE-7PLUS1.json'],['export','SAMPLE-CHINESE.md'],['trace.json','SAMPLE-TRACE.json'],['trace.md','SAMPLE-TRACE.md']]){const bytes=await get('/api/runs/'+id+'/'+suffix);put(name,bytes);exported[name]=sha(bytes);}
put('SAMPLE-SOURCE.txt',run.source_text);
const downloaded=fs.readFileSync(path.join('C:/Users/wei/Downloads',id+'-7plus1.json'));if(sha(downloaded)!==exported['SAMPLE-7PLUS1.json'])throw Error('BROWSER_EXPORT_DIFFERS');
json('SAMPLE-RUN.json',{...run,result:undefined,progress:undefined});
const original=JSON.parse(fs.readFileSync(path.join(home,'live-ui-verification/SWITCH-PREFLIGHT.json')));
for(const name of ['VERIFY.json','ENGINE-EVENTS.json','SWITCH-PREFLIGHT.json','POST-SWITCH.json','ui-and-entry.log','core.log'])put(name,fs.readFileSync(path.join(home,'live-ui-verification-ui7',name)));
put('PRODUCT-MANIFEST.json',fs.readFileSync(path.join(home,'versions',current.product_snapshot.product_version,'PRODUCT-MANIFEST.json')));
put('LIVE-UI-BUILD.json',fs.readFileSync(path.join(home,'versions',current.product_snapshot.product_version,'LIVE-UI-BUILD.json')));
const progress=run.stages,parseThread=progress.find(x=>x.phase==='parse'&&x.thread_id)?.thread_id,auditThread=progress.find(x=>x.phase==='audit'&&x.thread_id)?.thread_id;
const sample={run_id:id,source_sha256:run.source_sha256,source_codepoints:run.codepoints,requested_model:run.requested_model,requested_reasoning:run.requested_reasoning,actual_model:run.actual_model,real_calls:run.real_calls,parse_thread:parseThread,audit_thread:auditThread,independent_sessions:!!parseThread&&!!auditThread&&parseThread!==auditThread,elapsed_ms:run.elapsed_ms,run_product_version:run.product_snapshot.product_version,display_product_version:current.product_snapshot.product_version,parse_ready_at:progress.find(x=>x.signal==='PARSE_READY')?.at,audit_started_at:progress.find(x=>x.phase==='audit'&&x.signal==='REQUEST_STARTED')?.at,proposal:{events:run.result.proposal.events.length,entities:run.result.proposal.entities.length,claims:run.result.proposal.claims.length,expressions:run.result.proposal.expressions.length},audit_reviews:run.result.audit.reviews.length,technical_rows:run.result.technical.rows.length,ir_facts:run.result.ir.facts.length,source_issues:run.result.ir.issues.length,semantic_acceptance:'REQUIRES_SOURCE_REVIEW_NOT_MODEL_SELF_AUDIT',exports:exported,browser_json_export_matches_api:true,original_history_backup:original.backup};
json('SAMPLE-EVIDENCE.json',sample);
const shots=path.join(home,'live-ui-verification/screenshots');fs.mkdirSync(path.join(report,'screenshots'),{recursive:true});
for(const name of fs.readdirSync(shots).filter(n=>n.endsWith('.png')))put('screenshots/'+name,fs.readFileSync(path.join(shots,name)));
console.log(JSON.stringify(sample,null,2));
