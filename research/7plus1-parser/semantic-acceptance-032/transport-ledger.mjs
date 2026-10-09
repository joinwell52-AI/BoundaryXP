// Evaluation transport accounting. Source semantics and runtime resources unchanged.
import fs from 'node:fs';import path from 'node:path';import {classifyProviderFailure} from '../llm-first-028/process.mjs';
export const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]):[];
export function classifyRunFailure(directory){
 const texts=walk(directory).filter(p=>/stderr(?:-\d+)?\.txt$/.test(p)).map(p=>fs.readFileSync(p,'utf8'));
 const text=texts.join('\n');
 if(/blocked by policy/i.test(text))return 'POLICY_BLOCKED';
 const result=classifyProviderFailure(text);
 if(['CODEX_LOGIN_REQUIRED','CODEX_QUOTA_OR_RATE_LIMIT','CODEX_MODEL_UNAVAILABLE','CODEX_NETWORK_FAILURE'].includes(result))return result;
 return /MODEL_REQUEST_BUDGET_EXHAUSTED/.test(text)?'MODEL_REQUEST_BUDGET_EXHAUSTED':result;
}
export function requestLedger(directory){
 const records=walk(directory).filter(p=>/request-\d+\.json$/.test(p)).map(p=>{
  const number=p.match(/request-(\d+)\.json$/)[1],dir=path.dirname(p),stderr=path.join(dir,'stderr-'+number+'.txt'),live=path.join(dir,'transport-retries-'+number+'.json'),receipt=path.join(dir,'receipt-'+number+'.json');
  const observed=fs.existsSync(stderr)?(fs.readFileSync(stderr,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length:fs.existsSync(live)?JSON.parse(fs.readFileSync(live)).observed_internal_retries:0;
  return {request_path:p.replaceAll('\\','/'),outer_started:1,observed_internal_retry_signals:observed,receipt_present:fs.existsSync(receipt),conservative_observed:1+observed};
 });return {outer_starts:records.length,observed_internal_retries:records.reduce((n,r)=>n+r.observed_internal_retry_signals,0),conservative_observed:records.reduce((n,r)=>n+r.conservative_observed,0),incomplete_receipts:records.filter(r=>!r.receipt_present).length,records};
}
