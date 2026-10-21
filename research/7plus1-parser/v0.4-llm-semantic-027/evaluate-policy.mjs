import fs from 'node:fs';
import {REPORT,read,save,sha} from './util.mjs';
import {compileProposal} from './engine-policy-v2.mjs';
import {sourceDocument} from './source.mjs';
import {review} from './evaluator.mjs';
const initial=read(REPORT+'/runs/development-v1-recovered/RESULTS.json');
if(initial.total!==245)throw Error('FULL_V1_DEV_REQUIRED');
const rows=[],reviews=[];
for(const r of initial.rows){if(!r.trace){rows.push(r);reviews.push(review(r,null));continue;}
 const old=read(r.trace),t=compileProposal(sourceDocument(old.source.raw_text),old.parser_proposal,old.auditor_response,{nlp:old.nlp_input,receipts:old.provider_receipts}),base=`${REPORT}/runs/development-policy-v2/${r.corpus}/${r.id}`;
 save(base+'/trace.json',t);save(base+'/canonical.json',t.canonical_7plus1);
 const row={...r,trace:base+'/trace.json',canonical:base+'/canonical.json',proposal_origin:r.trace,new_model_calls:0};rows.push(row);reviews.push(review(row,t));
}
save(REPORT+'/runs/development-policy-v2/RESULTS.json',{total:245,rows,new_model_calls:0,unchanged_frozen_proposals:true,errors:rows.filter(r=>!r.trace).length});
save(REPORT+'/evaluations/development-policy-v2.json',{split:'development',revision:'policy-v2',total:245,rows:reviews,reference_checks_pass:reviews.filter(r=>r.reference_checks_pass).length,confirmed_semantic_closure:0,comparison_authority:'Same frozen offline reference checks; replay of original provider output; not a new model attempt.'});
const before=read(REPORT+'/evaluations/development-v1-recovered.json').rows;
const gained=reviews.filter(r=>r.reference_checks_pass&&!before.find(x=>x.id===r.id)?.reference_checks_pass).map(r=>r.id),lost=reviews.filter(r=>!r.reference_checks_pass&&before.find(x=>x.id===r.id)?.reference_checks_pass).map(r=>r.id);
const checkRegressions=reviews.flatMap(r=>r.checks.filter(c=>c.status==='FAIL'&&before.find(x=>x.id===r.id)?.checks.some(x=>x.claim===c.claim&&x.status==='PASS')).map(c=>({id:r.id,claim:c.claim,stage:c.first_divergence})));
const corpora=Object.fromEntries(['root','natural','exposed200'].map(c=>[c,{before:before.filter(r=>r.corpus===c&&r.reference_checks_pass).length,after:reviews.filter(r=>r.corpus===c&&r.reference_checks_pass).length,gained:gained.filter(i=>reviews.find(r=>r.id===i).corpus===c),lost:lost.filter(i=>reviews.find(r=>r.id===i).corpus===c)}]));
const integrityRegressions=rows.filter(r=>r.trace&&r.proposal_origin).flatMap(r=>{const old=read(r.proposal_origin),now=read(r.trace),errors=[];if(JSON.stringify(old.candidate_semantic_graph)!==JSON.stringify(now.candidate_semantic_graph))errors.push('GC_CHANGED');if(now.proof_dag.gap_count>old.proof_dag.gap_count)errors.push('PROOF_GAP_INCREASE');if(now.coverage.gap_count>old.coverage.gap_count)errors.push('COVERAGE_GAP_INCREASE');if(JSON.stringify(now.source_grounding_audit)!==JSON.stringify(old.source_grounding_audit))errors.push('SOURCE_GROUNDING_CHANGED');return errors.map(error=>({id:r.id,error}));});
const approved=gained.length>0&&!lost.length&&!checkRegressions.length&&!integrityRegressions.length;
save(REPORT+'/POLICY-SELECTION.json',{selected_policy:approved?'policy-v2':'v1',policy_v2_admission:approved?'ADMITTED':'NOT_ADMITTED',gained,lost,check_regressions:checkRegressions,integrity_regressions:integrityRegressions,corpora,criteria:'Reference failures decrease AND prior case/check PASS does not regress AND Gc/source grounding stay identical AND Proof/Coverage gaps do not increase; no replacement of source or provider output',source_semantic_truth_not_implied_by_reference_match:true,created_at:new Date().toISOString()});
console.log(JSON.stringify({approved,gained,lost,checkRegressions}));
