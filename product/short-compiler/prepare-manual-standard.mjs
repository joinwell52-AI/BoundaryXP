// Offline test asset preparation only. This module is never imported by runtime.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve('docs/testing/7plus1/MANUAL-TEST-001-standard-r01');
const run=path.resolve('.boundx/short-compiler-031-r1/data/runs/2d564b91-2496-4fd2-9314-f71eb794408b');
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=fs.readFileSync('docs/testing/7plus1/MANUAL-TEST-001.txt');
const text=bytes.toString('utf8'),sourceHash=hash(bytes);
assert.equal(sourceHash,'ec5fbb0e8841b391bec8f4ee8586ec6656d7d0b6690eb58670c2eb674b9ea130');
assert.deepEqual(bytes,fs.readFileSync(path.join(run,'source.txt')));
const trace=JSON.parse(fs.readFileSync(path.join(run,'trace.json'))),first=JSON.parse(fs.readFileSync(path.join(run,'revision-0/trace.json')));
const save=(file,value)=>{const p=path.join(root,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n',{flag:'wx'});};
const source=quote=>{const pos=text.indexOf(quote);assert.ok(pos>=0,quote);assert.equal(text.indexOf(quote,pos+1),-1,'Source must be uniquely anchored: '+quote);return {quote,occurrence:1,span:[[...text.slice(0,pos)].length,[...text.slice(0,pos+quote.length)].length],source_sha256:sourceHash};};
const requirement=(id,views,meaning,quotes)=>({id,views,meaning,sources:quotes.map(source)});
const requirements=[
 requirement('REQ-01',['V'],'The governing basis is the configuration checking rule at v1.2; no inferred authority.',['依据《配置核查规程》v1.2']),
 requirement('REQ-02',['A','P'],'PM organizes checking; organization does not imply performance of every check.',['由PM组织核查']),
 requirement('REQ-03',['I','B'],'External file input domain is closed to app.yaml and env.json.',['输入仅限app.yaml和env.json']),
 requirement('REQ-04',['I'],'All work uses the test environment; this execution scope is distinct from the file input domain.',['使用测试环境']),
 requirement('REQ-05',['R'],'Aggregate elapsed time for the whole work is LTE 30 minutes, not each action.',['全部工作须在30分钟内完成']),
 requirement('REQ-06',['A','P','I'],'DEV checks app.yaml.',['DEV检查app.yaml并生成dev.md']),
 requirement('REQ-07',['A','P','O'],'DEV generates dev.md; preserve the source subject on generation.',['DEV检查app.yaml并生成dev.md']),
 requirement('REQ-08',['A','P','I'],'OPS checks env.json.',['OPS检查env.json并生成ops.md']),
 requirement('REQ-09',['A','P','O'],'OPS generates ops.md.',['OPS检查env.json并生成ops.md']),
 requirement('REQ-10',['A','P','O'],'DEV submits the same dev.md to QA.',['DEV检查app.yaml并生成dev.md','DEV和OPS分别将各自报告提交QA']),
 requirement('REQ-11',['A','P','O'],'OPS submits the same ops.md to QA.',['OPS检查env.json并生成ops.md','DEV和OPS分别将各自报告提交QA']),
 requirement('REQ-12',['A'],'Both submissions precede QA review; AND, not OR.',['DEV和OPS分别将各自报告提交QA','两份报告均提交后，QA复核两份报告']),
 requirement('REQ-13',['A','P','O'],'QA reviews the same two reports generated in this task.',['DEV检查app.yaml并生成dev.md','OPS检查env.json并生成ops.md','两份报告均提交后，QA复核两份报告']),
 requirement('REQ-14',['A','O'],'Passing review governs both PM summary generation and its delivery, preserving AFTER and conditional direction.',['复核通过后，PM依据两份报告生成summary.md并交付ADMIN']),
 requirement('REQ-15',['A','P','O'],'PM generates summary.md.',['复核通过后，PM依据两份报告生成summary.md并交付ADMIN']),
 requirement('REQ-16',['A','V','O'],'PM uses the same dev.md and ops.md as basis and inputs of the summary, not new external inputs.',['DEV检查app.yaml并生成dev.md','OPS检查env.json并生成ops.md','复核通过后，PM依据两份报告生成summary.md并交付ADMIN']),
 requirement('REQ-17',['A','P','O'],'PM delivers the same summary.md to ADMIN.',['复核通过后，PM依据两份报告生成summary.md并交付ADMIN']),
 requirement('REQ-18',['C'],'dev submitted to QA AND ops submitted to QA AND QA passed AND summary delivered to ADMIN sufficiently establish the stated completion criterion, without adding IFF.',['两份报告均提交QA、QA复核通过且summary.md交付ADMIN时，任务完成']),
 requirement('REQ-19',['A','P','C'],'Finding a high-risk problem triggers PM to stop this task, not a different object.',['发现高危问题时，PM立即停止本任务并向ADMIN汇报']),
 requirement('REQ-20',['A','B'],'Stopping is immediate qualitatively, not a fabricated zero-second numerical deadline.',['发现高危问题时，PM立即停止本任务并向ADMIN汇报']),
 requirement('REQ-21',['A','P','C'],'The same high-risk condition triggers PM to report to ADMIN.',['发现高危问题时，PM立即停止本任务并向ADMIN汇报']),
 requirement('REQ-22',['B'],'Modification is forbidden for both named input files; it does not forbid generating reports.',['输入仅限app.yaml和env.json','本任务禁止修改输入文件']),
 requirement('REQ-23',['B'],'Access to the production environment is forbidden.',['禁止访问生产环境'])
];
const scenarios=[
 ['OBS-00',{}, {completion:'UNKNOWN',high_risk:'UNKNOWN',duration:'UNKNOWN',immediate:'UNKNOWN',availability:'UNKNOWN'}],
 ['OBS-01',{D:true,O:true,Q:true,S:true},{completion:'TRUE'}],
 ['OBS-02',{D:true,O:false,Q:true,S:true},{completion:'FALSE'}],
 ['OBS-03',{D:true,O:true,Q:false,S:true},{completion:'FALSE'}],
 ['OBS-04',{D:true,O:true,Q:true,S:false},{completion:'FALSE'}],
 ['OBS-05',{D:true,O:true,Q:true},{completion:'UNKNOWN'}],
 ['OBS-06',{D:false},{completion:'FALSE'}],
 ['OBS-07',{elapsed_minutes:30,quantity_binding:'MATCH'},{duration:'TRUE'}],
 ['OBS-08',{D:true,O:true,Q:true,S:true,elapsed_minutes:31,quantity_binding:'MATCH'},{completion:'TRUE',duration:'FALSE'}],
 ['OBS-09',{elapsed_minutes:30,quantity_binding:'WRONG_UNIT_OR_TARGET'},{duration:'UNKNOWN'}],
 ['OBS-10',{H:true},{high_risk:'TRUE',stopping_observed:'UNKNOWN',reporting_observed:'UNKNOWN'}],
 ['OBS-11',{H:false},{high_risk:'FALSE',execution_authorization:null}],
 ['OBS-12',{immediate:true,property_binding:'MATCH'},{immediate:'TRUE'}],
 ['OBS-13',{immediate:false,property_binding:'MATCH'},{immediate:'FALSE'}],
 ['OBS-14',{immediate:true,property_binding:'MISMATCH_OR_NOT_KNOWN'},{immediate:'UNKNOWN'}],
 ['OBS-15',{query_modify:'app.yaml'},{prohibition_membership:'TRUE',execution_authorization:null}],
 ['OBS-16',{query_modify:'env.json'},{prohibition_membership:'TRUE',execution_authorization:null}],
 ['OBS-17',{query_modify:'dev.md'},{prohibition_membership:'FALSE',execution_authorization:null}],
 ['OBS-18',{query_modify:'UNKNOWN_IDENTITY'},{prohibition_membership:'UNKNOWN',execution_authorization:null}],
 ['OBS-19',{used_portion_available:true,artifact_binding:'MATCH'},{availability:'TRUE',whole_producer_complete:'UNKNOWN'}],
 ['OBS-20',{used_portion_available:true,artifact_binding:'MISMATCH'},{availability:'UNKNOWN'}]
].map(([id,observations,expected])=>({id,synthetic:true,observations,expected,business_decision:null,execution_authorization:null}));
save('expected.json',{
 format:'boundx-test-reference/manual-001-r01',status:'STANDARD_REFERENCE_CANDIDATE_FOR_ADMIN_REVIEW',golden_confirmed:false,
 source:{sha256:sourceHash,body_codepoints:[...text.trimEnd()].length,file_codepoints:[...text].length,encoding:'UTF-8',span_unit:'UNICODE_CODEPOINT_HALF_OPEN'},
 method:'Existing v0.4 method and installed 031-r1.4-additive contract; no new protocol or projection definitions',
 comparison:{internal_ids:'IGNORE_RENAMING',node_counts:'NOT_A_CORRECTNESS_METRIC',allowed:'Semantically equivalent grouping or Boolean trees with complete source provenance',expected_must_not_enter_model_context:true},
 stage_order:['SOURCE','PARSE_SKILL_CODEX','AUDIT_SKILL_NEW_SESSION','TECHNICAL_VALIDATION','BOUNDARY_IR','CANONICAL_7PLUS1','STRUCTURAL_CALCULATION','OBSERVATION_CALCULATION'],
 requirements,
 calculation:{completion:{operator:'AND',operands:['D','O','Q','S'],direction:'SUFFICIENT',target:'ROOT_TASK_COMPLETE',inverse_not_assumed:true},quantity:{target:'ALL_WORK',distribution:'AGGREGATE',comparator:'LTE',value:30,unit:'分钟'},
 explicit_order:[{from:'DEV_SUBMIT',to:'QA_REVIEW',guard:'BOTH_SUBMITTED'},{from:'OPS_SUBMIT',to:'QA_REVIEW',guard:'BOTH_SUBMITTED'},{from:'QA_REVIEW_PASSED',to:'PM_GENERATE_SUMMARY',guard:'QA_REVIEW_PASSED'},{from:'QA_REVIEW_PASSED',to:'PM_DELIVER_SUMMARY',guard:'QA_REVIEW_PASSED'}],
 stop:{trigger:'H',direction:'SUFFICIENT',performer:'PM',object:'THIS_TASK',immediate:'QUALITATIVE_NOT_ZERO_SECONDS'},escalation:{trigger:'H',performer:'PM',recipient:'ADMIN'},
 prohibition:[{action:'MODIFY',domain:['app.yaml','env.json']},{action:'ACCESS',object:'生产环境'}],
 observations_missing:'UNKNOWN_NOT_IMPLEMENTATION_FAILURE',owner_is_event_order:false,availability_is_event_order:false,solver_witness_is_business_observation:false},
 scenarios,business_decision:null,execution_authorization:null
});
const copy=(from,to)=>{const p=path.join(root,to);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(run,from),p,fs.constants.COPYFILE_EXCL);};
copy('source.txt','source.txt');
for(const f of ['run.json','run-summary.json','selected-resources.json','trace.json','7plus1.json','7plus1.zh.md','boundary-calculations.json'])copy(f,'actual/ui36/'+f);
for(const revision of [0,1]){
 for(const f of ['proposal.json','proposal.wire.json','audit.json','audit.wire.json','technical-validation.json','boundary-ir.json','7plus1.json','7plus1.zh.md'])copy('revision-'+revision+'/'+f,'actual/ui36/revision-'+revision+'/'+f);
 for(const phase of ['parse','audit'])for(const f of ['response-0.txt','receipt-0.json','request-0.json','output-schema-0.json'])copy('revision-'+revision+'/'+phase+'-call/'+f,'actual/ui36/revision-'+revision+'/'+phase+'-call/'+f);
}
copy('revision-1/revision.patch.json','actual/ui36/revision-1/revision.patch.json');
copy('revision-0/revision-request.json','actual/ui36/revision-0/revision-request.json');
const runRecord=JSON.parse(fs.readFileSync(path.join(run,'run.json'))),receipts=[...first.model_calls.parse,...first.model_calls.audit,...trace.model_calls.parse,...trace.model_calls.audit];
const firstTechnical=first.technical.rows.filter(x=>x.status!=='ACCEPTED');
save('baseline-comparison.json',{
 baseline_run_id:runRecord.run_id,version:trace.product_snapshot.product_version,compiler:trace.product_snapshot.compiler_revision,manifest_sha256:trace.product_snapshot.manifest_sha256,
 source_sha256:sourceHash,source_bytes_match:true,first_technical_nonaccepted:firstTechnical.map(x=>({id:x.id,status:x.status,diagnostics:x.diagnostics??x.reasons??x.errors??[]})),
 final_technical_rows:trace.technical.rows.length,final_technical_status_counts:trace.technical.rows.reduce((a,x)=>(a[x.status]=(a[x.status]??0)+1,a),{}),
 slot_status:Object.fromEntries(Object.entries(trace.canonical.slots).map(([k,v])=>[k,v.status])),coverage_gap_count:trace.canonical.gaps.length,
 calculation_status:trace.boundary_calculations.status,unsupported_count:trace.boundary_calculations.unsupported.length,unsupported_counts:trace.boundary_calculations.unsupported.reduce((a,x)=>(a[x.reason]=(a[x.reason]??0)+1,a),{}),
 prerequisite_edges:trace.boundary_calculations.dependency.prerequisite_edges,conditional_edges:trace.boundary_calculations.dependency.conditional_edges.length,
 real_calls:receipts.length,requested_model:runRecord.requested_model,actual_service_model:'NOT_DISCLOSED',reasoning:runRecord.requested_reasoning,
 elapsed_ms:Date.parse(runRecord.ended_at)-Date.parse(runRecord.created_at),calls:receipts.map(x=>({thread_id:x.thread_id,elapsed_ms:x.elapsed_ms,response_sha256:x.response_sha256})),
 no_new_model_calls_for_reference_preparation:0,source_review:'PER_REQUIREMENT_REVIEW_REQUIRED',end_to_end_standard_pass:false,
 reason:'All slots resolved does not close the 13 implementation gaps in owned-event and temporal calculation',business_decision:null,execution_authorization:null
});
const files=[];const walk=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push({path:path.relative(root,p).replaceAll('\\','/'),sha256:hash(fs.readFileSync(p)),bytes:fs.statSync(p).size});}};walk(root);files.sort((a,b)=>a.path.localeCompare(b.path));
save('MANIFEST.json',{format:'boundx-test-reference-manifest/r01',source_sha256:sourceHash,standard_content_review:'PENDING_ADMIN_REVIEW',golden_confirmed:false,files});
fs.writeFileSync(path.join(root,'SHA256SUMS'),files.map(x=>x.sha256+'  '+x.path).join('\n')+'\n',{flag:'wx'});
save('SEAL.json',{format:'boundx-test-reference-byte-seal/r01',sealed_at:new Date().toISOString(),manifest_sha256:hash(fs.readFileSync(path.join(root,'MANIFEST.json'))),sha256sums_sha256:hash(fs.readFileSync(path.join(root,'SHA256SUMS'))),file_count:files.length,semantic_approval:false,golden_confirmed:false,old_source_unchanged:true,old_run_unchanged:true,new_model_calls:0,compiler_modified:false});
console.log(JSON.stringify({root,requirements:requirements.length,observation_scenarios:scenarios.length,source_sha256:sourceHash,file_count:files.length,baseline_calculation:trace.boundary_calculations.status,new_model_calls:0}));
