// Evaluation/reporting only: never repairs candidates, source text, or frozen runtime.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
import {report,oldReport,write} from './check.mjs';
import {sha256} from '../llm-first-028/source.mjs';
import {lockProduct} from '../../../product/short-compiler/resources.mjs';
const frozenCommit='445e6c44256a9aaa6be13cb7439ce4ce6a716d32';
const root=path.resolve('.boundx/experiments/031-r1/packages/q05-c1'),lock=lockProduct(root);
const read=p=>JSON.parse(fs.readFileSync(path.join(report,p)));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
const relative=p=>path.relative(report,p).replaceAll('\\','/');
const markdown=(name,s)=>fs.writeFileSync(path.join(report,name),s.trim()+'\n',{flag:'wx'});
const {compileBoundary}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/compile.mjs')));
if(process.argv[2]!=='integrity'){
const ids=read('VALIDATION-PLAN.json').cases.map(c=>c.id),traces=Object.fromEntries(ids.map(id=>[id,read(`runs/${id}/run/trace.json`)]));
const acceptedScope=t=>t.canonical.slots.B.entries.filter(x=>x.kind==='EVENT').flatMap(x=>x.object_scopes??[]);
const reviewNotes={
 'Q05':{status:'REVIEW_REQUIRED',notes:['PM列出settings.json中的配置项；同一PM生成明确命名结果，未新增交付义务。','禁止谓词、CLASS和FORALL已进入B可计算结构，未新增I。','B域没有文件容器；与重复运行不一致。不能据技术接受确认唯一源语义。'],defect:'DOMAIN_SCOPE_VARIATION'},
 'U-CN':{status:'PASS',notes:['OPS核对inventory.csv内全部资产记录，I和A保留文件内类别域。','同一文件的任何资产记录进入FORALL(CATEGORY(CLASS,FILE))禁止删除域。','未新增交付、资源、版本或完成条件；文件外成员不自动纳入。']},
 'X-CN':{status:'PASS',notes:['DEV核对具体config.json，I为具体对象。','同文件内配置项为类别域；debug为明确有限例外。','B保留FORALL(EXCEPT(CATEGORY,ENUM))，没有新增修改许可或扩大例外。']},
 'E-CN':{status:'PASS',notes:['QA读取两个独立文件，身份在读取和禁止删除中一致。','禁止范围为两个明确文件的有限ENUM，没有发明所有文件类别或量词。','或出现在禁止列举中，两个明示文件都受禁止；没有产生执行许可。']},
 'U-EN':{status:'PASS',notes:['OPS inspect records.csv，具体文件输入与执行主体保持。','that file链接同一records.csv；禁令为该文件内record类别的FORALL。','没有把any当布尔OR/ALL，也没有把容器身份丢失。']},
 'I-EN':{status:'PASS',notes:['QA read plan.md与禁止modify plan.md保持同一具体文件身份。','两个范围均为ITEM，无CLASS或FORALL发明。','未新增交付、数量、依据或完成条件。']},
 'S00':{status:'PASS',notes:['PM读取routes.csv、生成report.md，QA复核该报告，PM向ADMIN提交同一报告；角色及身份无串绑。','本次生成结果向复核和提交提供两条ARTIFACT_USE/USED_PORTION依赖；没有机械增加全部生成完成时序。','复核通过的STATE包含本次QA、报告和复核事件；是提交许可的NECESSARY、AFTER条件，未宣称已经通过。','读取重试LTE 3次只绑定读取事件，首次执行不计重试；提交成功是ROOT完成的SUFFICIENT条件。','SPEC-42为明确依据；生成结果与允许交付分别进入O，不增加强制提交义务。','routes.csv的具体禁止范围保留；禁止执行者原文未明示，P的UNSPECIFIED记录保留，没有推定岗位权限。']},
 'Q05-R2':{status:'REVIEW_REQUIRED',notes:['同一原文、同一冻结资源的独立一次重复，未选最佳输出。','此次B域为settings.json内配置项，与首次无容器域不同。','FORALL结构完整，但源语义适用域稳定性不通过；审阅模型未报告争议。'],defect:'DOMAIN_SCOPE_VARIATION'}
};
const cases=ids.map(id=>{
 const t=traces[id],modelReviews=t.audit.reviews;
 return{id,reviewer:'CURRENT_CODEX_SOURCE_LED_REVIEW_NOT_ADMIN_ADJUDICATION',...reviewNotes[id],source:{text:t.source.text,sha256:t.source.sha256},execution:'PASS',technical_rejected:t.technical.rows.filter(x=>x.status==='REJECTED').length,
  model_audit_issues:t.audit.issues,model_audit_omissions:t.audit.omissions,slot_status:Object.fromEntries(Object.entries(t.canonical.slots).map(([s,x])=>[s,x.status])),
  facts:Object.fromEntries(Object.entries(t.canonical.slots).map(([s,x])=>[s,x.entries.map(f=>({id:f.id,kind:f.kind,status:f.status,claim_ids:f.claim_ids,sources:f.sources,provenance_refs:f.proof?.provenance_refs??[]}))])),
  relevant_B_scopes:acceptedScope(t),model_scope_reviews:modelReviews.filter(x=>acceptedScope(t).some(s=>s.id===x.subject_id||s.expression_id===x.subject_id)),
  actual_7plus1:`runs/${id}/run/7plus1.json`,chinese:`runs/${id}/run/7plus1.zh.md`,trace:`runs/${id}/run/trace.json`};
});
write('SEMANTIC-REVIEW.json',{method:'Source-first reviewer decisions; model SUPPORT and technical acceptance are evidence, not scoring authority.',original_plan_unchanged:true,total:8,distinct_sources:7,source_led_pass:6,review_required:2,admin_confirmation:'PENDING',cases});
const reproducibility=[];
for(const id of ids){
 const t=traces[id],result=compileBoundary(t.source,t.proposal,t.audit,t.technical);
 assert.deepEqual(result.canonical,t.canonical);assert.equal(result.chinese,t.chinese);
 const json=read(`runs/${id}/run/7plus1.json`);assert.deepEqual(json,t.canonical);
 assert.equal(fs.readFileSync(path.join(report,`runs/${id}/run/7plus1.zh.md`),'utf8').trimEnd(),t.chinese.trimEnd());
 const bad=t.ir.facts.flatMap(x=>x.sources).filter(s=>Array.from(t.source.text).slice(...s.span).join('')!==s.quote);assert.equal(bad.length,0);
 reproducibility.push({id,status:'PASS',same_response_deterministic_recompile:true,json_equal:true,chinese_equal:true,source_span_mismatches:0});
}
write('SAME-RESPONSE-DETERMINISM.json',{model_calls:0,runtime_unchanged:true,cases:reproducibility});
const first=traces.Q05,second=traces['Q05-R2'];assert.equal(first.source.sha256,second.source.sha256);
write('REPEAT-RESULTS.json',{id:'Q05',attempts:['Q05','Q05-R2'],attempts_selected_all:true,source_sha256:first.source.sha256,
 same_snapshot:first.product_snapshot.manifest_sha256===second.product_snapshot.manifest_sha256,first_scopes:acceptedScope(first),second_scopes:acceptedScope(second),
 quantifier_structure:'PASS_2_OF_2',semantic_domain_stability:'NOT_PASS',overall:'REVIEW_REQUIRED',
 distinction:'First CATEGORY has one operand (unbounded class); second has class plus settings.json container. This affects membership, not only wording or IDs.',
 source_ambiguity_proven:false,needs_admin_domain_adjudication:true,model_audit_detected_variation:false,outputs_rewritten:false,
 specified_original_5_case_repeats_completed:false});
const oldTraceFile=path.join(oldReport,'runs/final/Q05/run/trace.json'),old=JSON.parse(fs.readFileSync(oldTraceFile));
assert.equal(old.source.sha256,first.source.sha256);
write('Q05-BEFORE-AFTER.json',{source_sha256:first.source.sha256,old_trace:path.relative(report,oldTraceFile).replaceAll('\\','/'),old_trace_sha256:sha256(fs.readFileSync(oldTraceFile)),
 old:{compiler:old.product_snapshot?.compiler_revision,contract:old.proposal.contract_version,raw_machine_B_status:old.canonical.slots.B.status,review_status:'REVIEW_REQUIRED_UNCHANGED',expressions:old.proposal.expressions,B:old.canonical.slots.B.entries},
 new:{compiler:lock.snapshot.compiler_revision,contract:lock.snapshot.contract,first:acceptedScope(first),repeat:acceptedScope(second),review_status:'REVIEW_REQUIRED',quantifier_missing_defect:'STRUCTURALLY_REPAIRED',source_scope_stability:'NOT_CLOSED'},
 no_historical_status_regrading:true,no_source_edit:true,no_note_scanning:true});
const runs=read('REAL-RUNS.json'),environment=read('ENVIRONMENT.json'),bundles=read('BUNDLE-DIGESTS.json');
write('MODEL-CALL-AUDIT.json',{old031:{conservative_used:239,limit:240,separate:true},current031_r1:{limit:180,prior_conservative:159,new_outer:16,observed_internal_retry_signals:0,new_conservative:16,total_conservative:175,remaining:5},
 exact_server_billable_calls:'NOT_DISCLOSED',actual_model_identity:'NOT_DISCLOSED',requested_model:'gpt-6.1-sol',requested_reasoning:'medium',
 cli:{binary:environment.binary,version:environment.version,sha256:environment.binary_sha256,changed_from_prior:true,details:'CLI-ENVIRONMENT-CHANGE.json'},
 skills:{delivery:'INLINE_BUNDLE',native_cli_skill_loading:'NOT_VERIFIED',bundles},semantic_revisions:runs.outcomes.map(x=>({id:x.id,revision:x.revision})),
 receipts:ids.map(id=>({id,parse:traces[id].model_calls.parse,audit:traces[id].model_calls.audit})),
 response_replay_model_pass:0,first_outputs_preserved:true,no_best_selection:true,no_extra_budget:true});
write('RETEST-NEEDS.json',{new_method_full_validation:'NOT_COMPLETE',why:'Both Skills and effective Schema/contract changed; old52 are not current model validation.',
 required:{fixed_total:53,extra_repeats_total:10,original_N_total:8,normal_model_requests_total:142},
 current_matching_required_fixed:['Q05','S00'],remaining:{fixed:51,specified_extra_repeats:10,original_N:8,normal_compilations:69,normal_model_requests:138},
 targeted_new_comparisons:['U-CN','X-CN','E-CN','U-EN','I-EN'],Q05_extra_repeat:'Does not replace the specified five-case repeated-run plan.',
 conservative_remaining:5,additional_budget_not_authorized:true,minimum_beyond_remaining_without_retry_reserve:133,
 semantic_followup:'Determine Q05 intended category domain before claiming semantic closure; do not select a favorable run or modify source/answers.'});
const skillChecks=['boundx-semantic-parse','boundx-semantic-audit'].map(name=>{
 const dir=path.join(root,'research/7plus1-parser/llm-first-028/skills',name),s=spawnSync('python',['-X','utf8','C:/Users/wei/.codex/skills/.system/skill-creator/scripts/quick_validate.py',dir],{encoding:'utf8',windowsHide:true});
 assert.equal(s.status,0,s.stderr);return{name,exit_code:s.status,stdout:s.stdout,stderr:s.stderr,skill_sha256:sha256(fs.readFileSync(path.join(dir,'SKILL.md')))};
});write('SKILL-VALIDATION.json',{checks:skillChecks,encoding:'UTF-8',model_calls:0});
write('QUALITY-GATES.json',{state:'WAITING_ADMIN_REVIEW',contract_range:'PASS',offline_mechanisms:'PASS',source_gap_when_declared_universal_not_represented:'PASS',
 specific_enum_universal_exception_distinct:'PASS',same_domain_two_members:'PASS',outside_domain:'PASS',unknown_membership:'PASS',not_match_not_permission:'PASS',
 core:read('core-RESULTS.json'),service_regression:read('service-RESULTS.json'),full:read('full-RESULTS.json'),frozen_response_count:70,legacy_schema_accepted:0,
 frozen_response_comparison:'CONSUMER_ONLY_NOT_CURRENT_MODEL_ACCURACY',same_response_determinism:'PASS_8_OF_8',
 targeted_execution:'PASS_8_OF_8',targeted_source_led_review:{pass:6,review_required:2},Q05_structural_computability:'PASS_2_OF_2',Q05_semantic_closure:'REVIEW_REQUIRED',
 current_method_full_model_validation:'NOT_COMPLETE_BUDGET_INSUFFICIENT',product_quality:'NOT_CLOSED',PRODUCTION_READY:false,
 new_candidate_installation:'NOT_PERFORMED',service58621_liveness:'ECONNREFUSED',service58621_identity:'UNCHANGED_031_R1_C3',service58618_recovery:'NOT_ATTEMPTED_POLICY_BLOCKED',new_ports:false});
write('TOOLING-NOTE.json',{runtime_not_changed_after_freeze:true,notes:[
 {item:'Skill validator initial encoding',result:'GBK UnicodeDecodeError; rerun with Python -X utf8 passed both unchanged UTF-8 files.'},
 {item:'Old CLI path',result:'ENOENT before any model request. Available local CLI help/version verified; original environment and new binary digest separately retained.'},
 {item:'Evaluation membership helper',result:'Initial helper aliased an ENUM operands array and mutated the in-memory graph while adding outside test members. Fixed helper to copy operands; disk Trace/runtime never changed. Final actual-graph checks PASS8.'},
 {item:'Final protection helper',result:'Initial numeric object key syntax error corrected only in reporting script. Initial fetch threw ECONNREFUSED; changed reporting to preserve service error and completed protection scan. No process was started/stopped.'},
 {item:'File write locks',result:'apply_patch update failures were filesystem write-lock failures. UTF-8 edited copies recreated with apply_patch after workspace-local backup; not a policy rejection or 58618 operation.'}
]});
markdown('SEMANTIC-REVIEW.md',`# 冻结候选的来源语义复核\n\n程序运行8/8；当前Codex按原文逐事实复核6/8 PASS、2/8 REVIEW_REQUIRED。这不是ADMIN人工审定，也不是由模型自审SUPPORT或Schema接受计算出的成绩。7个不同原文，Q05独立重复一次。\n\n|记录|来源复核|要点|\n|---|---|---|\n${cases.map(c=>`|${c.id}|${c.status}|${c.notes.join(' ')}|`).join('\n')}\n\nQ05两次都已经有可计算的FORALL。但首次CATEGORY(配置项)没有容器，重复为CATEGORY(配置项, settings.json)。不同成员域可改变真实禁止范围；这不属于ID或中文措辞差异。两次审阅模型均SUPPORT且无omission，技术检查只能证实表达式类型、引用、来源与绑定合法，不能证实某种自然语言域解释唯一。首次剩余分歧发生在LLM候选的适用域选择，审阅没有拦下这个不稳定性。\n\n原Q05判定不倒改，不选择更好的一次；当前两条均待审。是否应承接前句文件域、还是完整配置项类别域，需ADMIN明确裁定；本报告未宣称原文真实歧义已被证明。\n\n每条原文、Claim/Fact ID、精确码点span、范围树和模型审阅依据见SEMANTIC-REVIEW.json。最终JSON、中文和完整Trace位于runs/<id>/run/，首次请求/响应不覆盖。`);
markdown('REPORT.md',`# 031-R1 Q05 全称对象范围闭环\n\n全称限制已成为可消费、可计算的结构；Q05整体语义验收仍为REVIEW_REQUIRED。不能据新结构、技术Gate或中文显示把旧Q05改判PASS。当前产品质量门未全部通过，不升级服务。停止状态WAITING_ADMIN_REVIEW。\n\n## 版本与交付\n\n- 源码冻结提交：${frozenCommit}。\n- 产品：${lock.snapshot.product_version}；编译器：${lock.snapshot.compiler_revision}；合同：${lock.snapshot.contract}。\n- 候选完整运行包：delivery/BoundX-short-compiler-0.1.0-candidate.031-r1.q05.1.zip。ZIP SHA-256：c592a70be7cc1cffb9d096ab84019e3153cf46377a8247992622403ec31e7af6。\n- 36个运行资源逐字节对应冻结提交；干净临时目录解压、依赖安装、verify和CLI零预算拒绝检查通过，未调用模型。见delivery/PACKAGE.json。运行包仍含同一核心、原UI、两个Skill、安装/升级/回滚模块及使用说明，不另建页面或服务。\n- 未安装此新包。58621原候选资源保持0.1.0-candidate.031-r1.2/c3，其36?资源清单实际为35项，摘要未变；最终只读HTTP检查ECONNREFUSED。因此当前不能提供实际在线的新候选地址。没有新端口、未重启或升级58621、未进行被策略拒绝的58618恢复。\n\n解压后可离线执行\n\n\`\`\`bat\nnode product/short-compiler/verify.mjs\nnpm ci --ignore-scripts --no-audit --no-fund\n\`\`\`\n\n真实CLI入口保持\n\n\`\`\`bat\nnpm run 7plus1 -- --input task.txt --output new-run-directory --request-budget 2\n\`\`\`\n\n以上CLI会实际消耗预算；本轮未继续执行该命令。剩余5次请求不足完整验收，不附加调用额度。当前不执行部署、启新端口或升级；原使用说明的安装/回滚示例仅为后续获准维护的说明，不能作为本轮操作授权。\n\n## 范围合同与实现\n\nITEM仅具体对象；ENUM为明确有限身份；CLASS/CATEGORY为类别及可选容器域；FORALL为域内每一成员的适用范围；EXCEPT是域减例外。Boolean ALL/AND与FORALL在类型及消费者中完全分开。范围的TRUE/FALSE/UNKNOWN只说明成员适用性，不裁决执行许可，也不计算所有成员动作已经满足；business_decision/execution_authorization保持null。成员归属依赖显式类型化观测，不读取业务文件、不按名称相似推定。\n\n同事件SCOPE必须绑定其OBJECT/INPUT_OBJECT/CONTENT/RESULT/DELIVERABLE，并由技术依赖保留所有权。JSON事件和对象事实携带object_scopes及范围树；同源中文从相同树渲染类别、容器、量词和例外。来源span、SCOPE/表达式/类别/容器引用进入Proof。条件仅消费布尔表达式，不能把FORALL转成条件真值。\n\ncoverage.range_requirement由LLM逐来源声明；没有表达必要全称时保留GAP、受影响槽位PARSER_COVERAGE_FAILURE。普通ITEM、FORALL(ITEM)、空SCOPE或错误绑定不能填平全称缺口。程序不扫描原文/note中的“任何/所有”，不在Γ里补语义。两Skill及共享Schema/合同明确量词、类别和容器职责；结构可修订错误仍走同一有界流程。若解析和审阅均未声明原文的全称语义，程序无法在不重新猜原文的情况下发现该遗漏；此限制明确保留，技术通过不是语义真值证明。\n\n## 无模型结果\n\n- 核心64/64 PASS（新增9条范围正反机制检查）；服务回归3/3 PASS。\n- 全量6706条：6689 PASS、0 FAIL、17 SKIP；SKIP保持原环境下可选模型/研究与Windows链接检查，不冒称通过。原始日志full.log。\n- 70份旧真实响应在保留旧技术证据的消费者回放中语义内容不变；新Schema全部拒绝旧合同，未静默升级。它们不是新Skill模型成绩。\n- 8份新真实响应再经同一冻结消费者重编译，JSON/中文完全一致，所有已编译事实来源span准确。\n- 真实候选图的8个范围检查（评测端显式模拟成员观测）通过：同域不同成员、域外、UNKNOWN、有限列举、例外、不中禁令不等于许可。模拟观测不冒充真实业务文件内容。\n- 两Skill UTF-8验证PASS；干净包核验PASS。\n\n## 冻结后真实调用与首次输出\n\n预先声明8次：Q05、原文重复Q05-R2、中英全称、带例外、有限枚举、具体对象、S00身份/产物回归。全部执行成功、技术接受；逐事实来源复核6 PASS、2 REVIEW_REQUIRED。S00保留PM/QA/ADMIN、同一报告、生成结果使用依赖、复核通过后的提交必要条件、LTE3读取重试与提交成功完成，未机械添加全部生成完成时序。\n\nQ05首次B=FORALL(CATEGORY(配置项))；重复B=FORALL(CATEGORY(配置项, settings.json))。两个都是可计算全称，成员域并不相同。审阅两次均SUPPORT，但来源唯一性未闭合；不挑最好结果、不改原文、不改旧Trace。剩余first divergence为LLM适用域选择与审阅遗漏，详见REPEAT-RESULTS.json和Q05-BEFORE-AFTER.json。\n\n旧钉定CLI路径已不存在，首探ENOENT未产生模型请求。冻结运行资源未变，使用本地实际可用codex-cli 0.162.0-alpha.2（路径/SHA记录ENVIRONMENT.json），gpt-6.1-sol/medium配置不变。两个Skill作为INLINE_BUNDLE真实进入请求；native Skill加载及服务实际模型身份未披露，不标PASS。16个真实外层请求、0可见内部重试、0语义修订，所有原始输出及receipt保留。\n\n031-R1保守计数159+16=175/180，剩5；旧031独立239/240。Skill/Schema改变，旧52不沿用为当前成绩。完整方法还缺51个固定源、10次规定重复、原N01—N08共69次编译，正常约138个模型启动，尚未获追加授权。当前定向变体不偷换原N组，Q05额外重复不替代指定五条重复计划。\n\n## 保护、范围及停止\n\n原160项未提交tracked改动及118857项untracked保护核对均无额外变化（原已授权P21服务测试例外单列）；旧031-R1的3379个封存文件与SEAL摘要保持不变。旧030/031结果不倒改，7+1维定义、O口径与唯一编译核心保持。未合并、发布或打tag。\n\n可提交审阅的是本轮结构实现、原始真实证据与尚未关闭的问题；不宣称任意短文本准确、Q05完整PASS或新产品全面交付。其余实际补测及域裁定见RETEST-NEEDS.json。封存仅冻结字节，不代表ADMIN批准。`);
// Fixed typo-free resource count from the actual retained installation snapshot.
const installed=read('FINAL-PROTECTION.json').service58621.snapshot.files.length;
// REPORT is derived once; source documentation and old sealed artifacts are untouched.
const reportPath=path.join(report,'REPORT.md');let reportText=fs.readFileSync(reportPath,'utf8');
reportText=reportText.replace('其36?资源清单实际为35项',`其实际资源清单为${installed}项`);fs.writeFileSync(reportPath,reportText,'utf8');
}
lock.verify();
const integrity=lock.snapshot.files.map(f=>{
 const sourcePath=['package.json','package-lock.json'].includes(f.path)?'product/short-compiler/'+f.path:f.path;
 const git=execFileSync('git',['show',`${frozenCommit}:${sourcePath}`],{encoding:null,maxBuffer:10_000_000});
 return{path:f.path,source_path:sourcePath,sha256:f.sha256,package_matches_commit:sha256(git)===f.sha256,workspace_matches_commit:sha256(fs.readFileSync(sourcePath))===f.sha256};
});assert.ok(integrity.every(f=>f.package_matches_commit&&f.workspace_matches_commit));
write('FROZEN-SOURCE-INTEGRITY.json',{source_commit:frozenCommit,files:integrity,frozen_runtime_changed:false});
console.log(JSON.stringify({reports_created:true,source_led_pass:6,review_required:2,deterministic_recompiles:8,runtime_integrity_files:integrity.length,model_calls:0}));
