// Audit captured real requests/receipts only; does not invoke Provider.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
import {buildBundle} from '../llm-first-028/bundle.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),report=path.join(root,'docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>createHash('sha256').update(b).digest('hex');
const manifest=read(path.join(report,'RUN-MANIFEST.json'));
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]):[];
const requests=walk(path.join(report,'runs')).filter(p=>/request-\d+\.json$/.test(p));
const rows=[];
for(const file of requests){
 const req=read(file),dir=path.dirname(file),n=path.basename(file).match(/request-(\d+)/)[1],phase=path.basename(dir).startsWith('audit')?'audit':'parse',bundle=buildBundle(phase),prompt=fs.readFileSync(path.join(dir,'prompt-'+n+'.txt'),'utf8'),run=path.dirname(path.dirname(dir)),source=read(path.join(run,'source.json'));
 const errors=[];if(req.bundle_sha256!==manifest.bundles[phase].sha256||hash(prompt)!==req.prompt_sha256||!prompt.startsWith(bundle.text))errors.push('PROMPT_RESOURCE_MISMATCH');
 if(req.requested_model!==manifest.model||req.requested_reasoning!==manifest.reasoning||req.binary_sha256!==manifest.binary_sha256)errors.push('MODEL_CONFIG_MISMATCH');
 if(!req.isolation?.new_session||!req.isolation?.user_config_ignored||!req.isolation?.project_instructions_disabled||!req.isolation?.host_skill_discovery_disabled)errors.push('ISOLATION_CONFIG_MISSING');
 const payload=prompt.match(/<SOURCE_DATA>\n([\s\S]*?)\n<\/SOURCE_DATA>/)?.[1];
 try{assert.deepEqual(JSON.parse(payload),{text:source.text,lines:source.lines,literals:source.literals});}catch{errors.push('SOURCE_PAYLOAD_CHANGED');}
 const tail=prompt.slice(bundle.text.length);if(/7P-SHORT-COMPILER-ACCURACY-030|EXPECTED-FACTS|accuracy-030|Q\d\d-F\d\d|\bQ(?:0[1-9]|[12]\d|30)\b|必须核对的语义/.test(tail))errors.push('EVALUATION_LEAK');
 if(phase==='audit'){
  const raw=prompt.match(/<CANDIDATE_DATA>\n([\s\S]*?)\n<\/CANDIDATE_DATA>/)?.[1];
  try{assert.deepEqual(JSON.parse(raw),read(path.join(path.dirname(dir),'proposal.json')));}catch{errors.push('AUDIT_CANDIDATE_CHANGED');}
 }
 const receiptPath=path.join(dir,'receipt-'+n+'.json'),receipt=fs.existsSync(receiptPath)?read(receiptPath):null;
 if(receipt){
  const raw=fs.readFileSync(path.join(dir,'response-'+n+'.txt'));
  if(receipt.response_sha256&&hash(raw)!==receipt.response_sha256)errors.push('RESPONSE_DIGEST_MISMATCH');
  const events=fs.readFileSync(path.join(dir,'events-'+n+'.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(x=>JSON.parse(x));
  if(events.find(e=>e.type==='thread.started')?.thread_id!==receipt.thread_id)errors.push('SESSION_RECEIPT_MISMATCH');
 }
 if(receipt?.tool_events?.length)errors.push('TOOLS_USED');
 rows.push({path:path.relative(report,file).replaceAll('\\','/'),phase,attempt:Number(n),request_started:true,receipt_present:!!receipt,thread_id:receipt?.thread_id??null,exit_code:receipt?.exit_code??null,timed_out:receipt?.timed_out??null,elapsed_ms:receipt?.elapsed_ms??null,schema_check:receipt?.schema_check??null,usage:receipt?.usage??null,response_sha256:receipt?.response_sha256??null,actual_model:receipt?.actual_model??req.actual_model??null,cli_version:req.cli_version,binary_sha256:req.binary_sha256,prompt_sha256:req.prompt_sha256,errors});
}
const ids=rows.filter(r=>r.thread_id).map(r=>r.thread_id),duplicateSessions=ids.filter((id,i)=>ids.indexOf(id)!==i);
const summary={as_of:new Date().toISOString(),started_model_requests:rows.length,completed_receipts:rows.filter(r=>r.receipt_present).length,parse_requests:rows.filter(r=>r.phase==='parse').length,audit_requests:rows.filter(r=>r.phase==='audit').length,format_or_transport_retries:rows.filter(r=>r.attempt>0).length,unique_sessions:new Set(ids).size,duplicate_sessions:[...new Set(duplicateSessions)],isolation_errors:rows.filter(r=>r.errors.length),actual_model:'NOT_DISCLOSED',native_skill_loading:'NOT_VERIFIED',skill_delivery:'INLINE_BUNDLE; resource and prompt digests checked',rows};
fs.writeFileSync(path.join(report,'CALL-AUDIT.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({...summary,rows:undefined},null,2));
