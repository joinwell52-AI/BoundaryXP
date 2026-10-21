// Seal a continuation's real evidence; never manufacture model outputs or PASS.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';
import {walk} from './transport-ledger.mjs';
const root=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-CONTINUATION');
const oldRoot=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(name,data)=>fs.writeFileSync(path.join(root,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const execute=(file,args=[])=>JSON.parse(execFileSync(process.execPath,[file,...args],{encoding:'utf8',maxBuffer:10000000}));
const self=new Set(['MANIFEST.json','SHA256SUMS','SEAL.json']);
if(process.argv[2]==='verify'){
 const m=read(path.join(root,'MANIFEST.json')),s=read(path.join(root,'SEAL.json'));
 const files=walk(root).map(p=>path.relative(root,p).replaceAll('\\','/')).filter(p=>!self.has(p)).sort();
 assert.deepEqual(files,m.files.map(f=>f.path));
 for(const f of m.files){const p=path.join(root,f.path);assert.equal(sha256(fs.readFileSync(p)),f.sha256);assert.equal(fs.statSync(p).size,f.bytes);}
 assert.equal(sha256(fs.readFileSync(path.join(root,'MANIFEST.json'))),s.manifest_sha256);
 assert.equal(sha256(fs.readFileSync(path.join(root,'SHA256SUMS'))),s.sha256sums_sha256);
 for(const row of fs.readFileSync(path.join(root,'SHA256SUMS'),'utf8').trim().split('\n')){
  const m=row.match(/^([a-f0-9]{64})  (.+)$/);assert.ok(m);assert.equal(sha256(fs.readFileSync(path.join(root,m[2]))),m[1]);
 }
 console.log(JSON.stringify({seal:'VERIFIED',files:m.files.length,acceptance:s.SHORT_COMPILER_ACCEPTANCE,at:s.at}));
}else{
 const state=execute('research/7plus1-parser/semantic-acceptance-032/continuation.mjs',['state']);
 assert.equal(state.next.reason,'CODEX_NETWORK_FAILURE');assert.equal(state.complete_compilations,10);
 assert.equal(state.executions.at(-1).id,'Q01');assert.equal(state.charged,135);assert.equal(state.limit,360);
 assert.equal(state.new_unfinished_reserve,0);
 const resources=read(path.join(root,'FROZEN-RESOURCES.json'));
 const packageRoot=path.resolve('.boundx/experiments/032/packages/domain-c3');
 const manifest=read(path.join(packageRoot,'PRODUCT-MANIFEST.json'));
 assert.equal(sha256(fs.readFileSync(path.join(packageRoot,'PRODUCT-MANIFEST.json'))),resources.package_sha256);
 for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(packageRoot,f.path))),f.sha256);
 const preserved=execute('.boundx/experiments/032/protect.mjs',['verify']);
 assert.deepEqual(preserved.tracked_changes,[]);assert.deepEqual(preserved.untracked_changes,[]);
 const installation=execute('research/7plus1-parser/semantic-acceptance-032/snapshot.mjs',['verify']);assert.deepEqual(installation.changed,[]);
 const oldSeal=execute('research/7plus1-parser/semantic-acceptance-032/seal-report.mjs',['verify']);assert.equal(oldSeal.seal,'VERIFIED');
 write('PRESERVATION-CHECK.json',{at:new Date().toISOString(),local_existing_changes:preserved,installed_history:installation,old_report_seal:oldSeal,package_files_checked:manifest.files.length,package_manifest_sha256:resources.package_sha256});
 const artifacts=execute('research/7plus1-parser/semantic-acceptance-032/continuation-artifacts.mjs');assert.equal(artifacts.completed_checked,10);write('ARTIFACT-CONSISTENCY.json',artifacts);
 write('CALL-BUDGET.json',{...state,actual_backend_billing_unknown:true,historical_budget_path:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/CALL-BUDGET-FINAL-R02.json',resumption_minimum_outer_starts:140,backend_model_identity_unknown:true});
 const registry=read(path.join(oldRoot,'SOURCE-EXPECTATIONS.json'));
 const rows=state.order.map(id=>{
  const sourceId=id.replace(/-R\d+$/,''),source=registry.cases.find(c=>c.id===sourceId);
  const input=path.join(oldRoot,'inputs',sourceId+'.txt');assert.equal(sha256(fs.readFileSync(input)),source.sha256);
  const directory=path.join(root,'runs/domain-c3',id,'attempt-01'),p=path.join(directory,'execution.json');
  const execution=fs.existsSync(p)?read(p):null,reviewFile=path.join(directory,'source-review.json');
  const review=fs.existsSync(reviewFile)?read(reviewFile):null;
  assert.ok(!execution||execution.exit_code!==0||review);
  return {id,source_id:sourceId,source:source.text,source_sha256:source.sha256,codepoints:[...source.text].length,source_path:path.relative(root,input).replaceAll('\\','/'),status:review?.status??(execution?'RUN_FAILED':'NOT_RUN'),source_review_path:review?path.relative(root,reviewFile).replaceAll('\\','/'):null,execution_path:execution?path.relative(root,p).replaceAll('\\','/'):null,trace_path:review?'runs/domain-c3/'+id+'/attempt-01/run/trace.json':null,canonical_path:review?'runs/domain-c3/'+id+'/attempt-01/run/7plus1.json':null,chinese_path:review?'runs/domain-c3/'+id+'/attempt-01/run/7plus1.zh.md':null,first_failure_preserved:execution?.exit_code!==0&&!!execution,model_support_is_not_score:true,original_minimum:source.minimum??source.expect??null,review_reason:review?.source_and_extra_output_checks??null,first_divergence:execution?.underlying_failure??null};
 });
 assert.equal(rows.filter(r=>r.status==='RUN_FAILED').length,1);assert.equal(rows.filter(r=>r.status==='NOT_RUN').length,68);
 write('PER-RUN-RESULTS.json',{profile:'original 032 79 registered compilations; no new dataset',resources,rows});
 const table=['# 79次登记验收结果','', '| ID | 来源 | 实际状态 | 完整Trace |', '|---|---|---|---|',...rows.map(r=>`| ${r.id} | ${r.source_id} | ${r.status} | ${r.trace_path?'[Trace]('+r.trace_path+')':'—'} |`),'','完整输出8项SOURCE_FAITHFUL、2项CLARIFICATION_CORRECT。1项传输RUN_FAILED、68项NOT_RUN不能写成语义通过。',''];
 fs.writeFileSync(path.join(root,'PER-RUN-RESULTS.md'),table.join('\n'),{flag:'wx'});
 write('GATES.json',{at:new Date().toISOString(),G1:'PASS_SAME_FROZEN_CONTRACT',G2:'PASS_EXISTING_FROZEN_ENGINEERING_AND_NEW_RANGE_CHECKS',G3:'INCOMPLETE_2_OF_53_FIXED_COMPLETE',G4:'INCOMPLETE_D8_OF8_N0_OF8_STABILITY0_OF15',G5:'PARTIAL_FROZEN_UI_CHECKS_REAL_DEPLOYMENT_LOOP_NOT_RUN',G6:'EXISTING_SAME_VERSION_ENGINEERING_PASS_NOT_RERUN',G7:'NOT_RUN_QUALITY_GATES_INCOMPLETE',SHORT_COMPILER_ACCEPTANCE:'PARTIAL_TRANSPORT_BLOCKED',EVALUATION_COVERAGE:{registered:79,complete:10,source_faithful:8,clarification_correct:2,run_failed:1,not_run:68,semantic_fail_confirmed:0,semantic_correct_claimed_for_unrun:false},LOCAL_DEPLOYMENT:'NOT_PERFORMED_QUALITY_GATES_INCOMPLETE',PUBLIC_RELEASE:false,WAITING_ADMIN_REVIEW:true});
 write('TRANSPORT-STOP.json',{at:new Date().toISOString(),failed_case:'Q01',failure:'CODEX_NETWORK_FAILURE',underlying_error:'workspace routing discovery failed',source_semantics_not_evaluated:true,outer_starts:1,internal_retry_signals:5,request_conservative_charge:6,cancelled_own_request_tree:true,exit_confirmed:true,next_sample_started:false,account_quota_policy_rejection_proven:false,public_connectivity_observation:{recorded_at:new Date().toISOString(),check:'DNS and credential-free HTTPS HEAD, timeout 10000ms, no model',chatgpt_com:{head_status:403,proves_authenticated_workspace_ready:false},github_com:{head_status:200},not_account_login_test:true},model_or_network_configuration_changed:false,global_budget_exhausted:false,remaining_032_budget:225,retry_not_automatically_started:true});
 const full=read(path.join(oldRoot,'engineering/domain-v2-full/RESULTS.json'));
 write('TESTS.json',{at:new Date().toISOString(),new_no_model_transport_tests:read(path.join(root,'TRANSPORT-GUARD.json')),new_artifact_consistency:{completed_checked:artifacts.completed_checked,exact_source_spans:artifacts.rows.reduce((n,r)=>n+r.exact_source_spans,0),fail:0,does_not_score_semantics:true},unchanged_implementation_regression:{reused_sealed_same_version:true,new_full_run_this_continuation:false,path:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/engineering/domain-v2-full/RESULTS.json',sha256:sha256(fs.readFileSync(path.join(oldRoot,'engineering/domain-v2-full/RESULTS.json'))),result:full},actual_model_results:{registered:79,complete:10,failed:1,not_run:68,source_faithful:8,clarification_correct:2},deployment_smoke:'NOT_RUN'});
 const current=read('.boundx/short-compiler-031-r1/current.json');assert.equal(current.version,'0.1.0-candidate.031-r1.2');
 const port=execFileSync('pwsh',['-NoProfile','-Command',"$c = @(Get-NetTCPConnection -LocalPort 58618 -State Listen -ErrorAction SilentlyContinue); ConvertTo-Json -InputObject $c -Compress"],{encoding:'utf8'}).trim();
 write('DEPLOYMENT-STATE.json',{at:new Date().toISOString(),installed_version:current.version,previous_version:current.previous,installation_changed:false,58618:JSON.parse(port||'[]'),page_available_claimed:false,upgrade_performed:false,post_deploy_D08:'NOT_RUN',reason:'G3/G4 incomplete; model transport stop',candidate_package:'../7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/delivery/BoundaryXP-short-compiler-0.1.0-candidate.032.3.zip',candidate_sha256:'1e65b9598d85788e0e9cc96cd07db3a9a09c17a207e009e3fb701d4ab05e5dd3'});
 const remaining=rows.filter(r=>!['SOURCE_FAITHFUL','CLARIFICATION_CORRECT'].includes(r.status)).map(r=>({id:r.id,current_status:r.status,first_output_must_remain:r.status==='RUN_FAILED'}));
 write('REMAINING-WORK.json',{remaining_registered_positions:69,positions:remaining,already_complete_critical_group_rerun_required:false,resources_must_remain:resources,additional_deployment_smoke:1,minimum_outer_starts:140,remaining_conservative_budget:225,resume_only_after_normal_transport_recovery:true,no_change_to_runtime_required_by_observed_Q01_failure:true});
 const helperFiles=['continuation.mjs','continuation-policy.mjs','continuation-policy.test.mjs','continuation-artifacts.mjs','close-continuation.mjs'].map(name=>{const p='research/7plus1-parser/semantic-acceptance-032/'+name;return {path:p,sha256:sha256(fs.readFileSync(p))};});
 write('EVALUATION-HELPER-PROVENANCE.json',{at:new Date().toISOString(),helpers:helperFiles,not_compiler_runtime:true,does_not_score_automatically_from_model_support:true});
 const files=walk(root).filter(p=>!self.has(path.relative(root,p).replaceAll('\\','/'))).map(p=>({path:path.relative(root,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:sha256(fs.readFileSync(p))})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 assert.ok(!files.some(f=>f.path.endsWith('.tmp')));
 for(const f of files)if(f.bytes<10000000)assert.equal(/(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/.test(fs.readFileSync(path.join(root,f.path),'utf8')),false,'POSSIBLE_CREDENTIAL:'+f.path);
 write('MANIFEST.json',{schema:'boundx-report-manifest/v1',task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',continuation:true,at:new Date().toISOString(),files,excluded_self_references:[...self],raw_first_runs_preserved:true});
 const manifestSHA=sha256(fs.readFileSync(path.join(root,'MANIFEST.json')));
 const sums=files.map(f=>f.sha256+'  '+f.path).concat(manifestSHA+'  MANIFEST.json').join('\n')+'\n';fs.writeFileSync(path.join(root,'SHA256SUMS'),sums,{flag:'wx'});
 write('SEAL.json',{schema:'boundx-evidence-seal/v1',task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',continuation:true,at:new Date().toISOString(),report_parent_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),implementation_commit:'ff2edad0d5db9acdf98ec932eb4a0589d753249b',manifest_sha256:manifestSHA,sha256sums_sha256:sha256(Buffer.from(sums)),files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0),SHORT_COMPILER_ACCEPTANCE:'PARTIAL_TRANSPORT_BLOCKED',state:'WAITING_ADMIN_REVIEW',complete_compilations:10,registered:79,run_failed:1,not_run:68,post_deployment_smoke:'NOT_RUN',budget_limit:360,budget_charged:135,old_charge_unchanged:108,resources,evidence_sealed_does_not_mean_product_pass:true});
 console.log(JSON.stringify({sealed:true,files:files.length,complete:10,run_failed:1,not_run:68,charged:135,state:'WAITING_ADMIN_REVIEW'}));
}
