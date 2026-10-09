// Read-only artifact consistency checks. These do not score source semantics.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {sha256} from '../llm-first-028/source.mjs';
import {walk} from './transport-ledger.mjs';
const root=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION');
const roots=process.argv.includes('--resume-032')?[root,root+'-R02']:[root];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const rows=[];
for(const p of roots.flatMap(d=>walk(path.join(d,'runs'))).filter(p=>path.basename(p)==='execution.json')){
 const execution=read(p);if(execution.exit_code!==0)continue;
 const run=path.join(path.dirname(p),'run'),t=read(path.join(run,'trace.json'));
 assert.deepEqual(read(path.join(run,'7plus1.json')),t.canonical);
 assert.equal(fs.readFileSync(path.join(run,'7plus1.zh.md'),'utf8'),t.chinese);
 assert.equal(sha256(fs.readFileSync(path.join(run,'source.txt'))),t.source.sha256);
 assert.equal(sha256(Buffer.from(t.source.text)),t.source.sha256);
 let spans=0;
 const points=[...t.source.text];
 const visit=x=>{if(Array.isArray(x)){x.forEach(visit);return;}if(!x||typeof x!=='object')return;
  if(Array.isArray(x.span)&&typeof x.quote==='string'){
   assert.ok(x.span.length===2&&x.span.every(Number.isInteger));
   assert.ok(x.span[0]>=0&&x.span[0]<=x.span[1]&&x.span[1]<=points.length);
   assert.equal(points.slice(...x.span).join(''),x.quote);
   if(x.source_sha256)assert.equal(x.source_sha256,t.source.sha256);
   spans++;
  }
  Object.values(x).forEach(visit);
 };visit(t);
 const receipts=walk(path.join(run,'revision-'+t.revision)).filter(p=>/receipt-\d+\.json$/.test(p)).map(p=>({path:p,...read(p)}));
 const threads=['parse-call','audit-call'].map(phase=>receipts.filter(r=>r.path.includes(phase)&&r.exit_code===0&&r.schema_check?.ok).at(-1)?.thread_id);
 assert.ok(threads.every(Boolean));assert.notEqual(threads[0],threads[1]);
 assert.equal(t.canonical.business_decision,null);assert.equal(t.canonical.execution_authorization,null);
 rows.push({id:execution.id,revision:t.revision,source_sha256:t.source.sha256,exact_source_spans:spans,json_trace_equal:true,chinese_trace_equal:true,independent_parse_audit_sessions:threads,business_decision:null,execution_authorization:null,semantic_score_not_inferred:true});
}
console.log(JSON.stringify({at:new Date().toISOString(),completed_checked:rows.length,rows},null,2));
