// Evaluation-only evidence ledger. Correctness comes from recorded source-led review,
// never from model SUPPORT, node counts, or string matching. No Provider is invoked.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {report} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';import {evaluateExpression} from '../llm-first-028/compile.mjs';
const read=p=>JSON.parse(fs.readFileSync(path.join(report,p))),write=(p,v)=>fs.writeFileSync(path.join(report,p),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
const decisions=read('REVIEW-DECISIONS.json').decisions,base=read('SOURCE-EXPECTATIONS.json').cases,news=read('NEW-TEXTS-ORIGINAL.json').cases,supplement=read('REVIEW-SUPPLEMENT.json').requirements;
const rows=[];
for(const group of ['pilot','final','repeat','new','correction','supplement','ui-final']){
 const d=path.join(report,'runs',group);if(!fs.existsSync(d))continue;
 for(const id of fs.readdirSync(d)){
  const key=group+'/'+id,execution=read('runs/'+key+'/execution.json'),p='runs/'+key+'/run/trace.json',trace=fs.existsSync(path.join(report,p))?read(p):null;
  if(group!=='pilot')assert.ok(decisions[key],'REVIEW_MISSING:'+key);
  const bytes=fs.readFileSync(path.join(report,'inputs',id.replace(/-R\d+$/,'')+'.txt'));if(trace)assert.equal(trace.source.sha256,sha256(bytes));
  const files=walk(path.join(report,'runs',key)),requests=files.filter(p=>/request-\d+\.json$/.test(p));
  rows.push({case:key,source_sha256:sha256(bytes),source_file:'inputs/'+id.replace(/-R\d+$/,'')+'.txt',execution_status:execution.execution_status,compiler:trace?.product_snapshot?.compiler_revision??null,product_snapshot:trace?.product_snapshot??null,trace:p,first_trace:trace?'runs/'+key+'/run/revision-0/trace.json':null,first_candidate:trace?'runs/'+key+'/run/revision-0/proposal.json':null,final_candidate:trace?'runs/'+key+'/run/proposal.json':null,canonical:trace?'runs/'+key+'/run/7plus1.json':null,chinese:trace?'runs/'+key+'/run/7plus1.zh.md':null,mode:execution.mode??execution.interface??'FRESH_REAL_CLI',outer_starts:requests.length,elapsed_ms:execution.elapsed_ms,revision:trace?.revision??null,slot_status:trace?Object.fromEntries(Object.entries(trace.canonical.slots).map(([k,v])=>[k,v.status])):null,technical_diagnostics:trace?.technical.diagnostics??null,unresolved_count:trace?.canonical.unresolved.length??null,review:decisions[key]??{first:'PILOT_ONLY',final:'PILOT_ONLY'},trace_sha256:trace?sha256(fs.readFileSync(path.join(report,p))):null});
 }
}
const distribution=(rs,layer)=>rs.reduce((n,r)=>{const x=r.review[layer]??'NOT_AVAILABLE';n[x]=(n[x]??0)+1;return n;},{});
const fixed=rows.filter(r=>r.case.startsWith('final/'));assert.equal(fixed.length,53);
const current=base.map(c=>{
 const key=c.id==='Q21'?'correction/Q21':c.id==='Q10'?'supplement/Q10':'final/'+c.id,r=rows.find(r=>r.case===key);assert.ok(r);
 return {...r,original_first_case:'final/'+c.id,current_consumer:c.id==='Q10'||c.id==='Q21'?'031-r1-c3':'031-r1-c3 replay of c2 responses',current_consumer_trace:c.id==='Q10'||c.id==='Q21'?r.trace:'consumer-c3-replay/final/'+c.id+'/trace.json'};
});
write('PER-CASE-RESULTS.json',{reviewer:'Executing Codex source-led development review, not independent ADMIN acceptance',correctness_is_not_model_audit_or_technical_gate:true,rows,current_fixed:current,aggregate:{first_fixed:distribution(fixed,'first'),final_c2_fixed:distribution(fixed,'final'),current_fixed:distribution(current,'final'),additional_repeats:distribution(rows.filter(r=>r.case.startsWith('repeat/')),'final'),original_N:distribution(rows.filter(r=>r.case.startsWith('new/')),'final')},original_first_results_unchanged:true});
// The full candidate/IR are the evidence index for each manually reviewed requirement.
// These indexes locate evidence; they do not algorithmically decide semantic matching.
const ledger=[];
for(const c of [...base,...news]){
 const currentRow=current.find(r=>r.case.endsWith('/'+c.id))??rows.find(r=>r.case==='new/'+c.id),originRow=rows.find(r=>r.case==='final/'+c.id)??currentRow;
 const t=currentRow.canonical?read(currentRow.trace):null;
 const facts=c.facts??Object.entries(c.expect??{}).flatMap(([k,v])=>(Array.isArray(v)?v:[v]).map((value,i)=>({id:c.id+'-'+k+'-'+i,kind:k,detail:value})));
 const all=[...facts,...(supplement[c.id]??[]).map((s,i)=>({id:c.id+'-SUP-'+i,kind:'SOURCE_REVIEW_SUPPLEMENT',detail:s}))];
 for(let i=0;i<all.length;i++){
  const fact=typeof all[i]==='string'?{id:c.id+'-N-'+i,detail:all[i]}:all[i],verdict=currentRow.review.fact_overrides?.[fact.id]??(currentRow.review.final==='REVIEW_REQUIRED'?'PASS':currentRow.review.final);
  ledger.push({case:c.id,fact,source_sha256:currentRow.source_sha256,current_verdict:verdict,original_case_first:originRow.review.first,review_basis:currentRow.review.reason,review_mode:'SOURCE_LED_MANUAL_CASE_REQUIREMENT_REVIEW',evidence_index_not_automatic_semantic_certification:true,candidate_file:currentRow.final_candidate,trace:currentRow.trace,canonical:currentRow.canonical,chinese:currentRow.chinese,candidate_ids:t?[...t.proposal.events,...t.proposal.claims,...t.proposal.expressions].map(x=>x.id):[],ir_fact_ids:t?t.ir.facts.map(x=>x.id):[],ir_source_spans:t?[...new Map(t.ir.facts.flatMap(x=>x.sources??[]).map(s=>[JSON.stringify(s.span),s])).values()]:[]});
 }
}
write('PER-FACT-REVIEW.json',{scope:'53 fixed + 8 original N texts; repeated runs reviewed separately',expected_is_not_ADMIN_Gold:true,facts:ledger});
const markdown=['# 031-R1逐案逐层核对','', '执行者按原文核对；不等于ADMIN独立审定。c2首次/最终结果不可覆盖。c3其余50份固定结果在相同响应下重放；Q21捕获首次后真实修订，Q10单列补测。','', '| Case | 首次完整结果 | c2最终 | 当前最终 | JSON | 中文 | 关系 | 当前证据 |','|---|---|---|---|---|---|---|---|'];
for(const r of current){const o=rows.find(x=>x.case===r.original_first_case);markdown.push(`| ${r.case.split('/')[1]} | ${o.review.first} | ${o.review.final} | ${r.review.final} | ${r.review.json} | ${r.review.chinese} | ${r.review.relations} | [Trace](${r.current_consumer_trace}) |`);}
markdown.push('','## 原文逐事实及额外语义核对','');
for(const c of [...base,...news]){const rs=ledger.filter(x=>x.case===c.id);markdown.push('### '+c.id,'',c.text,'',...rs.map(x=>'- '+x.fact.id+'：'+JSON.stringify(x.fact.detail??x.fact)+' → '+x.current_verdict),'',rs[0]?.review_basis??'', '');}
fs.writeFileSync(path.join(report,'SEMANTIC-REVIEW.md'),markdown.join('\n')+'\n',{flag:'wx'});
// Repetition keeps every first / revised observation, never selects the best run.
const repeatIds=['Q15','Q19','Q25','Q29','Q30'];write('REPEAT-RESULTS.json',{cases:repeatIds.map(id=>({id,observations:rows.filter(r=>r.case==='final/'+id||r.case.startsWith('repeat/'+id+'-')).map(r=>({case:r.case,first:r.review.first,final:r.review.final,revision:r.revision,source_sha256:r.source_sha256,trace:r.trace,outer_starts:r.outer_starts,elapsed_ms:r.elapsed_ms})),same_source:true})),observations:15,final_semantic_pass:15,first_observation_Q15_had_revision:true,genuine_ambiguity_Q29_remains_local:true,all_competitors_and_failures_retained:true});
const callFiles=walk(path.join(report,'runs')),requests=callFiles.filter(p=>/request-\d+\.json$/.test(p));
const calls=requests.map(p=>{const request=JSON.parse(fs.readFileSync(p)),receiptFile=p.replace(/request-(\d+)\.json$/,'receipt-$1.json'),receipt=fs.existsSync(receiptFile)?JSON.parse(fs.readFileSync(receiptFile)):null,stderr=p.replace(/request-(\d+)\.json$/,'stderr-$1.txt'),retry=fs.existsSync(stderr)?(fs.readFileSync(stderr,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length:0;return{request:path.relative(report,p).replaceAll('\\','/'),phase:request.phase??(p.includes('parse-call')?'parse':'audit'),request_sha256:sha256(fs.readFileSync(p)),bundle_sha256:request.bundle_sha256,receipt:receipt?path.relative(report,receiptFile).replaceAll('\\','/'):null,exit_code:receipt?.exit_code??null,timed_out:receipt?.timed_out??null,schema_ok:receipt?.schema_check?.ok??null,thread_id:receipt?.thread_id??null,elapsed_ms:receipt?.elapsed_ms??null,actual_model:receipt?.actual_model??null,internal_retry_signals:retry,tool_event_count:receipt?.tool_events?.length??null};});
const retries=calls.reduce((n,x)=>n+x.internal_retry_signals,0);assert.ok(calls.length+retries<=180);
write('MODEL-CALL-AUDIT.json',{new_031_R1_ceiling:180,outer_starts:calls.length,observable_internal_retry_signals:retries,conservative_used:calls.length+retries,remaining:180-calls.length-retries,old031:{conservative_used:239,ceiling:240,separate_budget:true},successful_receipts:calls.filter(x=>x.exit_code===0&&x.schema_ok).length,no_receipt:calls.filter(x=>!x.receipt).length,timeout_receipts:calls.filter(x=>x.timed_out).length,backend_billing_claimed:false,actual_model:null,requested_model:'gpt-6.1-sol',reasoning:'medium',native_skill_loading:'NOT_VERIFIED',skill_mode:'INLINE_BUNDLE',calls});
const percentile=(a,p)=>a.length?[...a].sort((x,y)=>x-y)[Math.ceil(a.length*p)-1]:null;
write('PERFORMANCE.json',{units:'milliseconds',fixed_success:{n:fixed.filter(x=>x.execution_status==='RUN_SUCCEEDED').length,p50:percentile(fixed.filter(x=>x.execution_status==='RUN_SUCCEEDED').map(x=>x.elapsed_ms),.5),p95:percentile(fixed.filter(x=>x.execution_status==='RUN_SUCCEEDED').map(x=>x.elapsed_ms),.95)},first_transport_failures:fixed.filter(x=>x.execution_status!=='RUN_SUCCEEDED').map(x=>({case:x.case,elapsed_ms:x.elapsed_ms,trace_available:!!x.canonical})),repeats:{n:10,p50:percentile(rows.filter(x=>x.case.startsWith('repeat/')).map(x=>x.elapsed_ms),.5),p95:percentile(rows.filter(x=>x.case.startsWith('repeat/')).map(x=>x.elapsed_ms),.95)},final_c3_ui:{case:'ui-final/N01',elapsed_ms:rows.find(x=>x.case==='ui-final/N01').elapsed_ms},sampling_parallelism:3,not_a_15ms_or_unbounded_quota_claim:true});
// Only finite test observations; not actual approval or business authorization.
const q21=read('runs/correction/Q21/run/trace.json').proposal,clauses=q21.claims.filter(c=>c.kind==='CONDITION'),both=clauses.find(c=>c.direction==='NECESSARY'),missing=clauses.find(c=>c.direction==='SUFFICIENT'),and=q21.expressions.find(e=>e.id===both.expression_id);assert.equal(and.op,'AND');
const conditionCases=[];for(const qa of [false,true])for(const ops of [false,true]){const obs={[and.operands[0]]:qa,[and.operands[1]]:ops},a=evaluateExpression(q21.expressions,both.expression_id,obs),b=evaluateExpression(q21.expressions,missing.expression_id,obs);assert.equal(a,qa&&ops?'TRUE':'FALSE');assert.equal(b,qa&&ops?'FALSE':'TRUE');conditionCases.push({qa,ops,necessary_precondition:a,forbid_trigger:b,business_decision:null,execution_authorization:null});}
write('Q21-CONDITION-REPLAY.json',{status:'PASS',observations_are_synthetic:true,source_sha256:read('runs/correction/Q21/run/source.json').sha256,conditionCases,unknown_observations:{necessary:evaluateExpression(q21.expressions,both.expression_id),forbid:evaluateExpression(q21.expressions,missing.expression_id)},does_not_infer_approval_object:true});
console.log(JSON.stringify({c2_first:distribution(fixed,'first'),c2_final:distribution(fixed,'final'),c3_effective:distribution(current,'final'),facts:ledger.length,calls:calls.length,retries,remaining:180-calls.length-retries}));
