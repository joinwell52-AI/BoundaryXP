// Read-only post-freeze review. No semantic decisions or model calls.
import fs from 'node:fs';
import {ROOT,REPORT,read,save,sha} from './util.mjs';
import {signatures} from './contracts.mjs';
const method=read(REPORT+'/METHOD-FREEZE.json');
const selected=method.selected_policy==='policy-v2'?'development-policy-v2':'development-v1-recovered';
const records=[...read(REPORT+'/runs/'+selected+'/RESULTS.json').rows,...read(REPORT+'/runs/locked-first/RESULTS.json').rows];
const reviews=[...read(REPORT+'/DEV-245.json').rows,...read(REPORT+'/LOCKED-105-FIRST-RUN.json').rows];
const parserPrompt=fs.readFileSync(ROOT+'/prompts/parser-v1.md','utf8'),auditorPrompt=fs.readFileSync(ROOT+'/prompts/auditor-v1.md','utf8');
const count=(rows,key)=>rows.reduce((a,r)=>(a[r[key]]=(a[r[key]]??0)+1,a),{});
const isolation=[],details=[],gammaFailures=[];
for(const r of records){
 if(!r.trace){isolation.push({id:r.id,status:'NOT_COMPLETED',error:r.error});continue;}
 const t=read(r.trace),g=t.candidate_semantic_graph;
 // The admitted deterministic policy reuses the original call receipts. The
 // request bodies are reconstructed from frontend input and the own proposal,
 // not from an answer, comparison score or candidate selected after auditing.
 const providerBase=r.proposal_origin?read(r.proposal_origin):t;
 const receipt=providerBase.provider_receipts;
 const parserDir=receipt.parser.command?.stdin?receipt.parser.command.cwd:null;
 const auditDir=receipt.auditor.command?.stdin?receipt.auditor.command.cwd:null;
 const originalTracePath=r.proposal_origin??r.trace;
 const base=originalTracePath.replace(/\/trace\.json$/u,'/provider');
 const actualParser=fs.readFileSync(base+'/parser/request.txt','utf8'),actualAuditor=fs.readFileSync(base+'/auditor/request.txt','utf8');
 const parserPayload={raw_text:t.source.raw_text,document_id:t.source.document_id,source_regions:t.source.regions,typed_spans:t.source.typed_spans,structure:t.source.structure,relation_signatures:signatures};
 const auditorPayload={raw_text:t.source.raw_text,candidate_graph:{...t.parser_proposal,source_regions:t.source.regions},relation_signatures:signatures};
 const expectedParser=parserPrompt+'\nSOURCE_DATA_JSON\n'+JSON.stringify(parserPayload),expectedAuditor=auditorPrompt+'\nAUDIT_DATA_JSON\n'+JSON.stringify(auditorPayload);
 isolation.push({id:r.id,parser_request_exactly_source_and_contract:actualParser===expectedParser,auditor_request_exactly_source_and_own_proposal:actualAuditor===expectedAuditor,parser_request_sha256:sha(actualParser),auditor_request_sha256:sha(actualAuditor),independent_working_directories:parserDir!==auditDir,forbidden_tool_events:[...receipt.parser.forbidden_tool_events,...receipt.auditor.forbidden_tool_events].length,parser_receipt_version:receipt.parser.version,auditor_receipt_version:receipt.auditor.version,parser_elapsed_ms:receipt.parser.elapsed_ms,auditor_elapsed_ms:receipt.auditor.elapsed_ms,status:'CHECKED'});
 const all=[...g.nodes,...g.relations,...g.expressions],map=new Map(all.map(c=>[c.id,c])),decisions=new Map(t.gamma_certification.decisions.map(d=>[d.candidate_id,d]));
 const sourceEvidence=c=>c?{candidate_id:c.id,family:c.family,type:c.type??c.kind,source_span_ids:c.source_span_ids,source_spans:c.source_span_ids.map(id=>g.source_spans.find(s=>s.span_id===id)),canonical_candidate:c,certification:decisions.get(c.id)}:null;
 const dependencies=c=>c?.family==='relations'?[c.head,c.tail]:c?.family==='expressions'?[c.owner,...c.operands,c.quantity?.target].filter(Boolean):c?.owner?[c.owner]:[];
 const chain=(cid,seen=new Set())=>{if(seen.has(cid))return {candidate_id:cid,cycle_or_repeated:true};seen.add(cid);const c=map.get(cid);return {candidate:sourceEvidence(c),dependencies:dependencies(c).map(d=>chain(d,new Set(seen)))};};
 const review=reviews.find(x=>x.id===r.id);
 const detail={id:r.id,corpus:r.corpus,source_path:r.source_path,trace:r.trace,canonical:r.canonical,first_divergence:review.first_divergence,complete_semantic_adjudication:'NOT_ESTABLISHED',failed_checks:review.checks.filter(c=>c.status==='FAIL').map(c=>({...c,exact_candidate_evidence:c.evidence.filter(e=>typeof e==='string'&&map.has(e)).map(id=>chain(id)),empty_comparison_evidence_does_not_prove_candidate_absence:c.evidence.length===0})),unverified_checks:review.checks.filter(c=>c.status==='NOT_VERIFIED'),coverage_region_issues:t.coverage.rows.filter(c=>c.issues.length),auditor_suspicions:g.auditor_findings};
 const detailPath=REPORT+'/first-divergence-evidence/'+r.corpus+'/'+r.id+'.json';save(detailPath,detail);
 details.push({id:r.id,corpus:r.corpus,source_path:r.source_path,trace:r.trace,canonical:r.canonical,first_divergence:review.first_divergence,evidence_path:detailPath,failed_checks:detail.failed_checks.length,unverified_checks:detail.unverified_checks.length});
 for(const d of t.gamma_certification.decisions)for(const f of d.failures)gammaFailures.push({id:r.id,candidate_id:d.candidate_id,rule:f.rule,decision:d.decision});
}
const isolationFailed=isolation.filter(r=>r.status==='CHECKED'&&(!r.parser_request_exactly_source_and_contract||!r.auditor_request_exactly_source_and_own_proposal||!r.independent_working_directories||r.forbidden_tool_events));
save(REPORT+'/PROVIDER-INPUT-ISOLATION-AUDIT.json',{status:isolationFailed.length?'FAIL':'PASS',rows:isolation,failures:isolationFailed,actual_request_reconstruction:true,uncompleted_runs_retained:true,independent_model_calls_do_not_establish_truth:true});
const times=isolation.filter(r=>r.status==='CHECKED').map(r=>r.parser_elapsed_ms+r.auditor_elapsed_ms).sort((a,b)=>a-b),percentile=p=>times.length?times[Math.min(times.length-1,Math.ceil(times.length*p)-1)]:null;
save(REPORT+'/PERFORMANCE-AUDIT.json',{complete_two_call_cases:times.length,selected_output_model_calls:times.length*2,two_call_elapsed_ms:{min:times.at(0)??null,p50:percentile(0.5),p95:percentile(0.95),max:times.at(-1)??null,sum:times.reduce((a,b)=>a+b,0)},measurement:'Actual parser+auditor subprocess elapsed from call receipts, including provider/network/process wait. Sums are not wall time because batch calls run concurrently. No synthetic latency or hosted-weight digest is substituted.',environment_interrupted_first_calls_recorded_separately:true,cli_replay:read(REPORT+'/CLI-VERIFICATION.json'),fresh_nlp_calls:0});
save(REPORT+'/FIRST-DIVERGENCE-EVIDENCE.json',{cases:details,counts:count(details.filter(x=>x.first_divergence),'first_divergence'),gamma_rule_failure_counts:count(gammaFailures,'rule'),gamma_rule_failures:gammaFailures,interpretation:'Recorded candidate, exact source spans and certification dependency chains explain comparison failures. Comparison-adapter failures and audit suspicions require review; this is not an exhaustive semantic oracle.'});
const result=read(REPORT+'/RESULT.json'),source=read(REPORT+'/SOURCE-GROUNDING-AUDIT.json'),coverage=read(REPORT+'/COVERAGE-AUDIT.json'),boundary=read(REPORT+'/BOUNDARY-METRICS.json');
save(REPORT+'/TASK-ACCEPTANCE.json',{terminal:result.LLM_SEMANTIC_COMPILER_027,criteria:[
 {id:1,name:'Automatic raw-source Codex provider',status:result.run_errors?'PARTIAL':'VERIFIED',actual_traces:result.actual_traces,run_errors:result.run_errors},
 {id:2,name:'LLM does not write final authoritative 7+1',status:'VERIFIED',evidence:'Strict candidate schemas, fixed deterministic query contract and request isolation audit'},
 {id:3,name:'No invented source quote',status:source.invented_source_quote?'FAIL':'VERIFIED',count:source.invented_source_quote},
 {id:4,name:'No invalid source span',status:source.invalid_source_span?'FAIL':'VERIFIED',count:source.invalid_source_span},
 ...['No unsupported certified semantics','No wrong binding','No clear semantic miss','No false business-action promotion','No clear-source unresolved','True ambiguity preserved'].map((name,i)=>({id:i+5,name,status:'NOT_ESTABLISHED',reason:'Finite contracts, reference assertions and auditor suspicions are supplied; exhaustive independent source adjudication is unavailable.'})),
 {id:11,name:'Root-050 complete semantic closure',status:'NOT_ESTABLISHED',reference_checks:result.corpora.root},
 {id:12,name:'Natural-100 complete semantic closure',status:'NOT_ESTABLISHED',reference_checks:result.corpora.natural},
 {id:13,name:'exposed200 zero confirmed semantic defects',status:'NOT_ESTABLISHED',reference_checks:result.corpora.exposed200},
 {id:14,name:'Zero Coverage gaps',status:coverage.coverage_gap_regions?'FAIL':'VERIFIED',count:coverage.coverage_gap_regions},
 {id:15,name:'Zero Proof paths missing',status:coverage.proof_gaps?'FAIL':'VERIFIED',count:coverage.proof_gaps,scope:'Source and certification reachability, not semantic truth'},
 {id:16,name:'Zero pre-Gamma destructive final adjudication',status:reviews.some(r=>r.checks.some(c=>c.kind==='ARCHITECTURE'&&c.status==='FAIL'))?'FAIL':'VERIFIED'},
 {id:17,name:'Full regression zero FAIL',status:result.regression_fail?'FAIL':'VERIFIED',pass:result.regression_pass,fail:result.regression_fail,skip:result.regression_skip},
 {id:18,name:'No case/entity/sentence-specific runtime rule',status:'VERIFIED_BY_SOURCE_REVIEW',evidence:'New finite graph contracts and generic literal syntax; offline references are confined to the evaluator and absent from reconstructed provider input.'},
 {id:19,name:'Production unchanged',status:read(REPORT+'/WORKSPACE-PRESERVATION.json').changed_protected_paths.length?'FAIL':'VERIFIED'},
 {id:20,name:'Locked first run semantic acceptance',status:'FAIL',reason:'Frozen first outputs do not establish the strict task semantic criteria; no method repair after inspection.'}
],finite_contract_unsupported_resolved:boundary.finite_contract_unsupported_resolved,finite_contract_zero_is_not_exhaustive_semantic_zero:true});
console.log(JSON.stringify({request_isolation_failures:isolationFailed.length,reviewed_traces:details.length,first_divergences:count(details.filter(x=>x.first_divergence),'first_divergence')}));
if(isolationFailed.length)process.exitCode=1;
