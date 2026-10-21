import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=new URL('./',import.meta.url),read=f=>JSON.parse(fs.readFileSync(new URL(f,root),'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const inventory=read('INVENTORY.json'),freeze=read('FREEZE.json'),assess=read('ASSESSMENT.json');
assert.equal(assess.cases.length,60);assert.equal(new Set(assess.cases.map(c=>c[0])).size,60);
const get=async path=>{const r=await fetch('http://127.0.0.1:58618'+path);assert.equal(r.status,200);return r.json()};
const session=await get('/api/session');
assert.equal(session.product_snapshot.manifest_sha256,freeze.product_snapshot.manifest_sha256);
const live=await get('/api/runs');assert.equal(live.filter(r=>['QUEUED','RUNNING','CANCELLING'].includes(r.status)).length,0);
const cases=[];
for(let i=1;i<=60;i++){
 const n=String(i).padStart(3,'0'),r=read(n+'.json'),item=inventory.find(c=>c.id===r.case);
 assert.equal(r.status,'COMPLETED');assert.equal(r.model,freeze.model);assert.equal(r.reasoning,freeze.reasoning);assert.equal(r.method,freeze.method);
 assert.equal(r.manifest_sha256,freeze.product_snapshot.manifest_sha256);
 assert.equal(r.independent_sessions,true);assert.equal(r.outer_started,2);assert.equal(r.unfinished_reservations,0);
 assert.ok(fs.statSync(new URL(n+'-comparison.md',root)).size>0);
 for(const phase of ['parse','audit'])assert.equal(hash(fs.readFileSync(new URL(n+'-'+phase+'.md',root))),r[phase+'_sha256']);
 for(const [f,h] of Object.entries(item.reference_hashes))assert.equal(hash(fs.readFileSync(item.reference_directory+'/'+f)),h);
 const manifest=JSON.parse(fs.readFileSync(item.reference_directory+'/MANIFEST.json','utf8'));
 assert.equal(hash(fs.readFileSync(item.reference_directory+'/'+manifest.source_file)),r.source_sha256);
 assert.equal(item.admin_gold_frozen,false);
 const stored=await get('/api/runs/'+r.run_id);assert.equal(stored.status,'COMPLETED');
 assert.equal(hash(stored.source_text),r.source_sha256);assert.equal(hash(stored.result.report),r.parse_sha256);assert.equal(hash(stored.result.review),r.audit_sha256);
 assert.equal(stored.result.canonical.report,stored.result.report);
 assert.equal(r.exports.length,6);assert.ok(r.exports.every(e=>e.status===200));
 const [id,category,finding]=assess.cases.find(c=>c[0]===i);cases.push({...r,category,finding});
}
const sum=k=>cases.reduce((s,c)=>s+c[k],0);
const describe=(rows,k)=>{const a=rows.map(c=>c[k]/1000).sort((a,b)=>a-b),n=a.length;return {count:n,min:a[0],max:a[n-1],mean:a.reduce((x,y)=>x+y,0)/n,median:n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2,under_60:a.filter(x=>x<60).length}};
const result={checked_at:new Date().toISOString(),status:'WAITING_ADMIN_REVIEW',runtime:'v0.1.101',product_snapshot:session.product_snapshot,completed:60,failed:0,not_run:0,full_original_and_reference_hashes_verified:60,live_history_records_verified:60,independent_sessions_verified:60,export_checks:360,active_runs:0,history_count:live.length,model:freeze.model,reasoning:freeze.reasoning,method:freeze.method,outer_started:sum('outer_started'),internal_retry_signals:sum('observed_internal_retries'),conservative_requests:sum('conservative_requests'),conservative_cap:144,remaining:144-sum('conservative_requests'),unfinished_reservations:0,billable_requests:null,prior_batch_conservative:22,prior_batch_unchanged:true,source_codepoints:{min:Math.min(...cases.map(c=>c.source_codepoints)),max:Math.max(...cases.map(c=>c.source_codepoints)),total:sum('source_codepoints')},generation_seconds:describe(cases,'parse_ms'),audit_seconds:describe(cases,'audit_ms'),local_seconds:describe(cases,'other_ms'),total_seconds:describe(cases,'total_ms'),under_1000_codepoints_generation_seconds:describe(cases.filter(c=>c.source_codepoints<1000),'parse_ms'),under_300_codepoints_count:cases.filter(c=>c.source_codepoints<=300).length,assessment_counts:Object.fromEntries(Object.keys(assess.categories).map(k=>[k,cases.filter(c=>c.category===k).length])),formal_gold_certification:false,pm_plan_comparison_tested:false,source_frozen_by_admin:false,program_semantic_or_math_proof:false};
fs.writeFileSync(new URL('FINAL-VERIFICATION.json',root),JSON.stringify(result,null,2)+'\n');
const lines=['# Gold60逐例结果与独立计时','',assess.meaning,'','所有时间单位为秒，来自实际回执；含传输等待，不把它们解释成纯模型计算时间。生成与审阅分开，不用总时间衡量生成60秒目标。','', '| 用例/修订 | 原文字符 | LLM生成 | LLM审阅 | 本地 | 总时长 | 人工核对主要分类 | 主要发现 |','|---|---:|---:|---:|---:|---:|---|---|'];
for(const c of cases){const n=c.case.slice(-3);lines.push(`| [${n}/${c.revision}](${n}-comparison.md) | ${c.source_codepoints} | ${(c.parse_ms/1000).toFixed(3)} | ${(c.audit_ms/1000).toFixed(3)} | ${(c.other_ms/1000).toFixed(3)} | ${(c.total_ms/1000).toFixed(3)} | ${assess.categories[c.category]} | ${c.finding} |`)}
lines.push('','原始生成见NNN-parse.md，独立审阅见NNN-audit.md；运行标识、来源/参考摘要、请求计数及导出摘要见NNN.json。未修订覆盖任何首次结果。');
fs.writeFileSync(new URL('RESULTS.md',root),lines.join('\n')+'\n');
console.log(JSON.stringify({...result,product_snapshot:undefined},null,2));
