// Stores the executing reviewer's explicit source-led decisions. Never scores from
// JSON validity, model SUPPORT, labels, or successful exit, and never enters runtime.
import fs from 'node:fs';import path from 'node:path';import {report} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';
const noteFile=path.join(report,'REVIEW-DECISIONS.json');if(!fs.existsSync(noteFile))throw Error('EXPLICIT_REVIEW_DECISIONS_REQUIRED');
const decisions=JSON.parse(fs.readFileSync(noteFile)),registry=JSON.parse(fs.readFileSync(path.join(report,'SOURCE-EXPECTATIONS.json'))),records=[];
for(const review of decisions){
 const sourceId=review.id.replace(/-R\d+$/,''),expected=registry.cases.find(c=>c.id===sourceId),dir=path.join(report,'runs/final',review.id,'run'),p=path.join(dir,'trace.json');
 if(!expected)throw Error('UNREGISTERED_REVIEW');
 if(!fs.existsSync(p)){records.push({...review,source_text:expected.text,source_sha256:expected.sha256,first_result_preserved:true,trace_available:false,facts:(expected.facts??[{id:sourceId+'-TASK-MINIMUM',detail:expected.minimum_review??expected.minimum}]).map(f=>({...f,status:'NOT_ASSESSABLE',reason:review.source_checks})),candidate_path:fs.existsSync(path.join(dir,'revision-0/proposal.json'))?path.relative(process.cwd(),path.join(dir,'revision-0/proposal.json')).replaceAll('\\','/'):null});continue;}
 const bytes=fs.readFileSync(p),t=JSON.parse(bytes);if(t.source.sha256!==expected.sha256)throw Error('REVIEW_SOURCE_CHANGED');
 const expectedFacts=expected.facts??[{id:sourceId+'-TASK-MINIMUM',detail:expected.minimum_review??expected.minimum}],bad=new Map((review.fact_failures??[]).map(f=>[f.id,f]));
 records.push({...review,reviewer:'EXECUTING_CODEX_SOURCE_REVIEW_NOT_ADMIN_GOLD',source_text:expected.text,source_sha256:expected.sha256,trace_sha256:sha256(bytes),trace_path:path.relative(process.cwd(),p).replaceAll('\\','/'),bounded_revision:t.revision,
  facts:expectedFacts.map(f=>({...f,status:bad.has(f.id)?bad.get(f.id).status:review.status==='RUN_FAILED'?'NOT_ASSESSABLE':'SOURCE_CHECKED',reason:bad.get(f.id)?.reason??review.source_checks,expected_is_not_model_input:true})),
  actual_slot_status:Object.fromEntries(Object.entries(t.canonical.slots).map(([k,v])=>[k,v.status])),candidate_events:t.proposal.events.map(e=>({id:e.id,predicate:e.predicate,modality:e.modality,layer:e.layer,use:e.use,owner_id:e.owner_id,source:e.sources})),
  exact_final_facts:Object.fromEntries(Object.entries(t.canonical.slots).map(([k,v])=>[k,v.entries])),
  independent_audit_does_not_establish_accuracy:true,extra_output_review:review.extra_output_review,unresolved:t.canonical.unresolved,coverage_gaps:t.canonical.gaps,retained_nonprojected:t.canonical.retained_nonprojected,
  first_response_preserved:true,model_candidate_path:path.relative(process.cwd(),path.join(dir,'revision-0/parse-call/response-0.txt')).replaceAll('\\','/'),chinese_export_sha256:sha256(t.chinese)});
}
const sourceReviewed=records.filter(r=>r.trace_sha256).length;
const output=path.join(report,'SEMANTIC-REVIEW.json');fs.writeFileSync(output+'.tmp',JSON.stringify({at:new Date().toISOString(),reviewer:'EXECUTING_CODEX_SOURCE_REVIEW_NOT_ADMIN_GOLD',recorded_dispositions:records.length,completed_source_semantic_reviews:sourceReviewed,not_semantically_reviewed:registry.final_runs.filter(id=>!records.some(r=>r.id===id&&r.trace_sha256)),records},null,2)+'\n');fs.renameSync(output+'.tmp',output);console.log(JSON.stringify({dispositions:records.length,source_semantic_reviews:sourceReviewed,not_semantically_reviewed:registry.final_runs.length-sourceReviewed}));
