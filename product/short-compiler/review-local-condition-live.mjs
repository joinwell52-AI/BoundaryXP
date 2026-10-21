import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const report=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01');
const trace=JSON.parse(fs.readFileSync(path.join(report,'live-V01-attempt-01/trace.json')));
const baseline=JSON.parse(fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001-standard-r01/actual/ui36/trace.json'));
const {calculateBoundary}=await import(pathToFileURL(path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.39/research/7plus1-parser/llm-first-028/calculus.mjs')));
const completion=trace.ir.facts.find(f=>f.kind==='COMPLETION');
assert.equal(completion.claim.direction,'NECESSARY');
const leaves=[];
const visit=id=>{const x=trace.ir.expressions.find(x=>x.id===id);assert.ok(x);if(x.op==='STATE')leaves.push(x.id);else {assert.equal(x.op,'AND');x.operands.forEach(visit);}};
visit(completion.claim.expression_id);assert.equal(leaves.length,4);
const checks=[];
for(const [premise,outcome,expected] of [[true,true,'TRUE'],[true,false,'TRUE'],[false,true,'FALSE'],[false,false,'TRUE']]){
 const observations={states:Object.fromEntries(leaves.map(id=>[id,premise])),outcomes:{[completion.claim.id]:{target_id:completion.claim.scope_id,kind:'TASK_COMPLETE',known:true,value:outcome}}};
 const result=calculateBoundary(trace.ir,observations).conditions.find(x=>x.claim_id===completion.claim.id).assessment;
 assert.equal(result.logical_result,expected);checks.push({synthetic:true,premise,outcome,expected,actual:result});
}
const changes=[];
for(const c of trace.proposal.claims.filter(c=>c.kind==='CONDITION')){
 const old=baseline.proposal.claims.find(x=>x.id===c.id);
 if(old&&old.direction!==c.direction)changes.push({claim_id:c.id,source:c.sources,previous:old.direction,current:c.direction,classification:'LOCAL_DIRECTION_DIFFERENCE_REQUIRES_SOURCE_REVIEW',not_proof_of_completion_direction_leak:true});
}
const events=fs.readFileSync(path.join(report,'LIVE-PROGRESS.jsonl'),'utf8').trim().split('\n').map(x=>JSON.parse(x));
const ledger=JSON.parse(fs.readFileSync(path.join(report,'LIVE-LEDGER.json')));
const result={case:'V01',source_sha256:trace.source.sha256,execution:'REAL_CODEX_PARSE_AND_INDEPENDENT_AUDIT',
 model_resource_changes:false,semantic_revision_enabled:false,reason:'Single parse/audit pair within remaining two-request sample allowance; not full bounded-revision product acceptance',
 outer_starts:events.filter(e=>e.signal==='REQUEST_STARTED').length,
 retry_signals:events.filter(e=>/RETRY/i.test(e.signal??'')).length,completed_receipts:ledger.completed_model_receipts,
 total_seconds:(Date.parse(ledger.ended_at)-Date.parse(ledger.started_at))/1000,
 receipts:ledger.completed_receipts,distinct_model_sessions:new Set(ledger.completed_receipts.map(r=>r.thread_id)).size===2,
 completion_direction:'NECESSARY',completion_leaf_states:leaves,completion_observation_checks:checks,
 audit_verdict_counts:trace.audit.reviews.reduce((a,x)=>(a[x.verdict]=(a[x.verdict]??0)+1,a),{}),
 technical_nonaccepted:trace.technical.rows.filter(x=>x.status!=='ACCEPTED'),
 slot_status:Object.fromEntries(Object.entries(trace.canonical.slots).map(([k,v])=>[k,v.status])),
 source_review:[
 {area:'I',result:'PRESERVED',reason:'Only app.yaml/env.json are external inputs; locally generated reports remain internal artifacts.'},
 {area:'O/A/P',result:'PRESERVED_WITH_LOCAL_CONDITION_REVIEW',reason:'DEV/OPS identities, separate report generation/submission, QA review and PM summary/delivery preserved.'},
 {area:'R/V',result:'PRESERVED',reason:'Test environment, aggregate <=30 minute limit and named rule v1.2 preserved.'},
 {area:'C',result:'TARGET_CHANGE_CORRECT',reason:'Only-if completion remains necessary, not sufficient or IFF; four explicit leaf states retained.'},
 {area:'B/STOP',result:'PRESERVED',reason:'Two-input modification prohibition, production-access prohibition and high-risk stop/report remain; ROOT STOP supplies the task target without inventing a performer for prohibitions.'},
 {area:'LOCAL_CONDITIONS',result:'REVIEW_REQUIRED',reason:'Unchanged summary/delivery wording now has NECESSARY instead of baseline SUFFICIENT. This is an observable semantic difference; baseline response is not an oracle. Need distinguish temporal prerequisite from duty activation. Neither model SUPPORT nor technical ACCEPTED settles that interpretation.'}
 ],local_direction_differences:changes,
 semantic_acceptance:'REVIEW_REQUIRED_NOT_PRODUCT_PASS',
 product_complete:false,remaining_work:['Resolve the local prerequisite versus conditional duty contract with counterexamples; do not infer direction from raw text in the consumer.','Expose host observations in the existing UI for user-triggered recalculation; current addition is a typed calculation API and display consumer.','Close or formally assess 42 inherited regression failures before whole-product acceptance.'],
 model_budget:{sample_prior:4,this_attempt:2,total:6,maximum:6,remaining:0,old_032_ledger_unchanged:true},
 deployment:{upgraded:false,current:'0.1.0-candidate.031-r1.2-ui.38',candidate:'0.1.0-candidate.031-r1.2-ui.39'}};
assert.equal(result.outer_starts,2);assert.equal(result.completed_receipts,2);assert.ok(result.distinct_model_sessions);
fs.writeFileSync(path.join(report,'LIVE-SOURCE-REVIEW.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({completion_checks:checks.length,semantic_acceptance:result.semantic_acceptance,calls:2,total_seconds:result.total_seconds}));
