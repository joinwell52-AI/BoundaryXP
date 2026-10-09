// Final offline report revision following actual transport recovery and a semantic failure.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {pathToFileURL} from 'node:url';
import {report,write} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';
const read=n=>JSON.parse(fs.readFileSync(path.join(report,n),'utf8'));
const replace=(n,v)=>{const p=path.join(report,n);fs.writeFileSync(p+'.tmp',typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});fs.renameSync(p+'.tmp',p);};
const archive=(name,label)=>fs.copyFileSync(path.join(report,name),path.join(report,label),fs.constants.COPYFILE_EXCL);
const root=path.resolve('.boundx/experiments/032/packages/domain-c3'),manifestBytes=fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json')),manifest=JSON.parse(manifestBytes),budget=read('CALL-BUDGET-FINAL-R02.json'),matrix=read('CURRENT-C2-RESULT-MATRIX.json');
const full=read('engineering/domain-v2-full/RESULTS.json'),core=read('engineering/domain-v2-core/RESULTS.json'),entry=read('engineering/domain-v2-installed/RESULTS.json');
assert.equal(full.exit_code,0);assert.equal(full.fail,0);assert.equal(core.pass,75);assert.equal(entry.pass,4);assert.ok(budget.remaining_conservative<160);
assert.equal(manifest.source_commit,execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(root,f.path))),f.sha256);
const c2=read('CONSUMER-CANDIDATE-FROZEN.json'),previous=new Map(c2.package_files.map(f=>[f.path,f.sha256])),changed=manifest.files.filter(f=>previous.get(f.path)!==f.sha256);
for(const f of manifest.files.filter(f=>/\/(?:provider|process|source|compile|report|scopes)\.mjs$/.test(f.path)||/\.schema\.json$/.test(f.path)||/\/web\//.test(f.path)))assert.equal(f.sha256,previous.get(f.path),'UNCHANGED_RESOURCE_EXPECTED:'+f.path);
const {buildBundle}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/bundle.mjs'))),parse=buildBundle('parse'),audit=buildBundle('audit');assert.notEqual(parse.sha256,c2.parse_bundle_sha256);assert.notEqual(audit.sha256,c2.audit_bundle_sha256);
const protocolProvenance={task_sha256:sha256(fs.readFileSync('docs/tasks/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG.md')),source_registry_sha256:sha256(fs.readFileSync(path.join(report,'SOURCE-EXPECTATIONS.json'))),source_domain_review_sha256:sha256(fs.readFileSync(path.join(report,'SOURCE-DOMAIN-REVIEW.md'))),thresholds:c2.thresholds,semantic_packs:c2.semantic_packs,model_binary_sha256:sha256(fs.readFileSync(c2.models.cli.binary)),model_binary_unchanged:sha256(fs.readFileSync(c2.models.cli.binary))===c2.models.cli.binary_sha256};assert.ok(protocolProvenance.model_binary_unchanged);
write('DOMAIN-V2-PROTOCOL-PROVENANCE.json',protocolProvenance);
write('DOMAIN-V2-CANDIDATE-FROZEN.json',{at:new Date().toISOString(),task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',implementation_commit:manifest.source_commit,version:manifest.version,compiler_revision:manifest.compiler_revision,structural_contract:manifest.contract,domain_interpretation_procedure:'032-domain-interpretation-v2',package_manifest_sha256:sha256(manifestBytes),package_files:manifest.files,parse_bundle_sha256:parse.sha256,audit_bundle_sha256:audit.sha256,model_config:c2.models,model_provider_unchanged:true,schemas_structurally_unchanged:true,core_consumers_unchanged_except_version:true,ui_unchanged:true,changed_resources:changed,full_regression:full,core,entry,skill_validation:{parse:'PASS',audit:'PASS',command:'skill-creator quick_validate.py with UTF-8 Python'},new_model_validation:0,registered_model_compilations:79,post_deploy_required_if_gates_pass:1,old_model_scores_inherited:false,original_first_freeze_reserve:222,current_reserve:budget.remaining_conservative,current_minimum_fresh_validation:160,budget_shortfall:budget.minimum_shortfall,first_freeze_not_reset:true,SHORT_COMPILER_ACCEPTANCE:'BLOCKED_BY_BUDGET_AND_UNVERIFIED_SEMANTIC_REPAIR',state:'WAITING_ADMIN_REVIEW',public_release:false});
const raw=fs.readFileSync(path.join(report,'engineering/domain-v2-full/full.log'),'utf8'),skips=raw.split(/\r?\n/).filter(l=>/^(?:﹣|-) .* # /.test(l));assert.equal(skips.length,full.skip);write('engineering/domain-v2-full/SKIPS.json',{count:skips.length,records:skips,not_counted_as_pass:true,source_condition_details:'../consumer-r02-full/SKIP-CONDITIONS.json',tests_and_skip_conditions_unchanged:true});
archive('REPORT.md','REPORT-C2-TRANSPORT-PAUSE.md');archive('GATES.json','GATES-C2-TRANSPORT-PAUSE.json');archive('PERFORMANCE-AUDIT.json','PERFORMANCE-AUDIT-C2-TRANSPORT-PAUSE.json');archive('delivery/PACKAGE.json','delivery/PACKAGE-C2.json');archive('INSTALL-AND-ROLLBACK.md','INSTALL-AND-ROLLBACK-C2.md');
const currentPackage=read('delivery/PACKAGE-'+manifest.version+'.json');replace('delivery/PACKAGE.json',currentPackage);
const gates=read('GATES.json');gates.at=new Date().toISOString();gates.candidate={version:manifest.version,compiler_revision:manifest.compiler_revision,contract:manifest.contract,domain_interpretation_procedure:'032-domain-interpretation-v2'};gates.SHORT_COMPILER_ACCEPTANCE='BLOCKED_BY_BUDGET_AND_UNVERIFIED_SEMANTIC_REPAIR';gates.EVALUATION_COVERAGE='NOT_RUN_CURRENT_MODEL_RESOURCES';gates.historical_c2_evaluation={completed:11,source_faithful:10,semantic_fail:1,case:'Q05',cancelled:3,not_run:65};
gates.gates.find(g=>g.id==='G1').evidence.push('DOMAIN-V2-CANDIDATE-FROZEN.json');
Object.assign(gates.gates.find(g=>g.id==='G2'),{evidence:['engineering/domain-v2-core/RESULTS.json','engineering/domain-v2-installed/RESULTS.json','engineering/domain-v2-full/RESULTS.json'],counts:{core:core.pass,installed_entry:entry.pass,full_pass:full.pass,full_fail:full.fail,full_skip:full.skip}});
Object.assign(gates.gates.find(g=>g.id==='G3'),{status:'BLOCKED_CURRENT_SKILLS_NOT_MODEL_VALIDATED',evidence:['CURRENT-C2-RESULT-MATRIX.json','RESUME-REVIEW-DECISIONS.json','DOMAIN-V2-CANDIDATE-FROZEN.json','BUDGET-STOP.json'],fixed_completed:0,source_faithful:0,fixed_started:0,previous_c2_completed:11,previous_c2_semantic_fail:1});
Object.assign(gates.gates.find(g=>g.id==='G6'),{evidence:['engineering/isolation-domain-c3/RESULTS.json','engineering/domain-v2-full/RESULTS.json','delivery/PACKAGE-'+manifest.version+'.json','delivery/ZIP-ROUNDTRIP-C3.json']});replace('GATES.json',gates);
const p=read('PERFORMANCE-AUDIT.json');p.final_candidate_version=manifest.version;p.domain_v2_full_regression=full;p.new_domain_v2_model_observations=0;p.historical_c2_compilations=matrix.complete;p.observed_outer_requests=budget.outer_starts_total;p.conservative_observed=budget.observed_conservative_total;p.conservative_charged_with_inflight_reserve=budget.conservative_charged_including_reserve;p.actual_service_model=null;p.models_stopped_for_budget_after_semantic_failure=true;replace('PERFORMANCE-AUDIT.json',p);
const realTimes=matrix.rows.filter(r=>r.current_c2_status==='RUN_SUCCEEDED').map(r=>({id:r.id,semantic_status:r.current_c2_semantic_status,elapsed_ms:['Q01','Q02','Q03'].includes(r.id)?read('FIRST-RESULT-MATRIX.json').rows.find(o=>o.id===r.id).first_execution.elapsed_ms:JSON.parse(fs.readFileSync(path.join(report,path.dirname(path.dirname(r.trace_path)),'execution.json'))).elapsed_ms}));
p.original_c1_complete_count=p.completed_runs;p.completed_runs=realTimes.length;p.completed_real_model_observations=realTimes;p.success_mean_ms=realTimes.reduce((n,r)=>n+r.elapsed_ms,0)/realTimes.length;p.latency_includes_program_success_with_semantic_failure=true;p.real_observations_model_resource_profile='C1/C2 identical model-visible resources; C3 has zero real model observations';replace('PERFORMANCE-AUDIT.json',p);
const q=s=>'"'+String(s??'').replaceAll('"','""')+'"';archive('RESULTS.csv','RESULTS-C1.csv');replace('RESULTS.csv','id,source_sha256,original_first,current_c2_execution,current_c2_semantic,current_c2_trace,current_c3\n'+matrix.rows.map(r=>[r.id,r.source_sha256,r.original_first_status,r.current_c2_status,r.current_c2_semantic_status,r.trace_path,r.c3_status].map(q).join(',')).join('\n')+'\n');
let install=fs.readFileSync(path.join(report,'INSTALL-AND-ROLLBACK-C2.md'),'utf8');const c2package=read('delivery/PACKAGE-C2.json');install=install.replaceAll(c2.version,manifest.version).replaceAll(c2.compiler_revision??'032-c2',manifest.compiler_revision).replaceAll(c2package.sha256,currentPackage.sha256);install=install.replace('真实服务路由/TLS故障尚未恢复。','真实路由已在一次有界核查中恢复；新版Skill完整验收因剩余预算不足未运行。');replace('INSTALL-AND-ROLLBACK.md',install);
replace('REPORT.md',`# 032最终回执：产品未通过，新版待真实验收

**SHORT_COMPILER_ACCEPTANCE=BLOCKED_BY_BUDGET_AND_UNVERIFIED_SEMANTIC_REPAIR。本轮没有完成产品交付，不升级58618。停止于WAITING_ADMIN_REVIEW。**

最新完整候选是\`${manifest.version}\` / 核心\`${manifest.compiler_revision}\` / 结构合同\`${manifest.contract}\` / 域解释规程\`032-domain-interpretation-v2\`。真实模型验证为**0/79**，不继承C1/C2成绩。原用户安装指针仍为\`0.1.0-candidate.031-r1.2\` / \`031-r1-c3\` / \`031-r1.1\`，最终核查58618无监听；本轮未恢复、停止或升级该入口，也没有声称发生新的策略拒绝。

完整运行包：[BoundX-short-compiler-${manifest.version}.zip](delivery/BoundX-short-compiler-${manifest.version}.zip)，SHA-256 \`${currentPackage.sha256}\`。包包含唯一实际核心、两个Skill、合同/Schema、原UI和依赖锁定文件，不含凭据、历史、权重、缓存或160项旧工作区改动。使用与回滚见[INSTALL-AND-ROLLBACK.md](INSTALL-AND-ROLLBACK.md)。电脑重启后的原入口命令仍是：

\`\`\`bat
cd /d D:\\boundx
npm run 7plus1:ui
\`\`\`

该命令启动完整**旧安装**，正常启动后地址为 http://127.0.0.1:58618/ 。\`npm run 7plus1:installed -- --input task.txt --output new-run-directory\`与旧UI同版；工作区开发CLI明确不同。不要在质量门未通过时激活032.3，也没有提供第二个用户端口。

## 本轮实际完成与没有完成

沿用唯一llm-first-028核心、两INLINE_BUNDLE Skill、原UI及现有产品安装模块。完成类型化全称/有限枚举/类别/例外/范围竞争及解析缺口、成员计算的UNKNOWN保护、同源澄清展示、新原文与父摘要关联、JSON/中文/导出一致、安装版CLI、资源隔离、干净安装/升级/回滚验证。没有扫描原文/note/label猜量词或主体，没有另搭解析器或页面，没有改7+1/BXP定义、模型/阈值/Pack、长文本、Gold-60或旧350调优。

D07审阅context_ref技术误拒与D01过度文件竞争在开发中修复并保留首次失败；DOMAIN_CHOICE去重的算子身份误合并作为纯消费者修复形成C2。详细修改、第一次冻结及逐层证据见[REPORT-C2-TRANSPORT-PAUSE.md](REPORT-C2-TRANSPORT-PAUSE.md)。该报告是传输暂停时的历史快照，其3/79与78/240不是最终计数。

传输暂停后，一次普通TLS HEAD探测返回HTTP403；该匿名HEAD既不证明Codex可用，也不证明账号有问题。随后预留最多4次请求做相同原文Q04有界核查，实测2次解析/独立审阅成功、无重试，确认真实路由恢复。于是继续C2冻结同源资源的预登记短文本，而不是因旧网络错误提前停下。原始失败不覆盖，回放、恢复补测与首次分别记录。

## 真正捕获的语义错误与通用修复

Q05在C2完整模型结果中，FORALL、配置项类别、局部容器与独立I/O/A/P都存在；但解析选择settings.json内的确定域，独立审阅全部SUPPORT，最终B=RESOLVED，没有范围备选或最小澄清。**按模型输出前冻结的032保守澄清口径，Q05=SEMANTIC_FAIL；未把它改判PASS，不修改原文或旧评分。** 原案唯一域仍NOT_PROVED。

最早分歧在LLM域解释，随后审阅未拦住；程序忠实消费了错误的确定候选，技术检查通过不等于语义正确。根因是把范围竞争收窄为“多个文件先行项竞争”，没有独立比较“继承局部域”与“未限定容器的任务类别域”两个读法；后者不需要另有第二个文件。

C3修复共享合同与两Skill的通用规程：对独立全称限制分别比较实体回指与域读法；明示限定、明确指示回指、同一语法限定或已提供排他上下文足以唯一确定时必须确定，否则保留来源支持且会改变成员边界的DOMAIN_CHOICE/FORALL与局部AMBIGUITY。仅出现一个文件不证明该域排他；没有真实竞争也不能一律未决。代码、Schema结构和确定性消费者没有替模型扫描原文补答案，没有Q05、固定文件名、case ID或实体特判。

该修改遵循任务§3已有规则，并不是新方法；它改变了模型可见资源，因此**旧11份模型结果不能继承为C3验收**。无模型范围正反与程序检查通过，只证明结构可消费；不能证明新Skill会正确解释原文。Q05模型缺陷关闭状态为IMPLEMENTED_NOT_REAL_VALIDATED，仍待新冻结版真实验证。

## 真实逐层成绩，版本分别报告

| 版本/批次 | 实际结果 | 口径 |
|---|---|---|
| C1原首次79登记 | 启动12，完整3，传输失败6，中断3，未运行67 | 原始模型响应及失败始终保留 |
| C2消费者回放Q01–Q03 | 技术、JSON、中文与原输出一致，新增模型0 | 模型资源摘要相同；不冒充新增成绩 |
| C2恢复核查Q04＋继续Q05–Q11 | 8份完整；7来源忠实、Q05语义失败 | 都完成原文→候选→新会话审阅→技术→IR→JSON/中文逐事实与额外输出复核 |
| C2合计覆盖79登记位置 | 完整11：10来源忠实、1语义失败；3预算停止中断；65未运行 | 不是11/79通过，也不是其余68份语义失败 |
| C2五例稳定性、N8、D8 | 未完成，0完整观察 | 开发D01/D02/D07结果不替代最终成绩 |
| C3新模型资源 | 0/79，部署D08也未运行 | 不继承旧成绩，不挑最好结果 |

Q01–Q03是原真实响应在C2纯消费者下同源重编译；Q04是恢复补测；Q05–Q11是C2各一份结果，不是自动重抽到成功。Q12–Q14因不足以为新修复保留完整验收预算而中断，原始半成品保留。评测由执行者对照来源，不是ADMIN独立Gold，也不以模型SUPPORT、JSON合法或进程成功评分。

逐案表：[RESULTS.csv](RESULTS.csv)、[CURRENT-C2-RESULT-MATRIX.json](CURRENT-C2-RESULT-MATRIX.json)。首次证据：[FIRST-RESULT-MATRIX.json](FIRST-RESULT-MATRIX.json)、[SEMANTIC-REVIEW.json](SEMANTIC-REVIEW.json)；恢复阶段事实核对：[RESUME-REVIEW-DECISIONS.json](RESUME-REVIEW-DECISIONS.json)。每份完整结果的原文、候选、审阅、技术、IR、最终7+1和中文均在对应trace目录；缺失阶段不伪造。

## 工程、产品包与保护

- C3核心：${core.pass}/${core.total} PASS；安装入口：${entry.pass}/${entry.total} PASS；两Skill格式检查PASS。
- C3最终全量：${full.pass} PASS、${full.fail} FAIL、${full.skip} SKIP，共${full.total}；约${(full.elapsed_ms/1000).toFixed(1)}秒。包含既有本地NLP模型回归，新增Codex调用0；不宣称所有推理为0。跳过逐项列明，不计通过，不启用本轮未授权的Gold研究/模型批次。
- 评测嵌套传输停止保护2 PASS；第一次评测脚本曾因只看外层stderr漏停，被如实记录并修复，新增失败未删除。
- C3干净安装、同完整版本CLI/UI、依赖锁定、资源破坏拒绝、备份、历史及升级回滚PASS；仅自有home和结束释放的临时测试监听，不读写私人历史，不新增长期用户入口。
- 原UI冻结Q05开发响应的待确认、备选、证据高亮与同源导出已核对；新源parent/run/hash通过无模型测试。实际C3 D08模型与58618部署闭环仍未验证，G5不能宣称全通过。
- 原160项本地改动原字节与旧安装/历史143项摘要不变；无reset/clean/整体stage。包与资源完整摘要见[DOMAIN-V2-CANDIDATE-FROZEN.json](DOMAIN-V2-CANDIDATE-FROZEN.json)。

证据：[GATES.json](GATES.json)、[engineering/domain-v2-full/RESULTS.json](engineering/domain-v2-full/RESULTS.json)、[engineering/domain-v2-full/SKIPS.json](engineering/domain-v2-full/SKIPS.json)、[engineering/isolation-domain-c3/RESULTS.json](engineering/isolation-domain-c3/RESULTS.json)、[FINAL-PROTECTION-C3.json](FINAL-PROTECTION-C3.json)、[delivery/ZIP-ROUNDTRIP-C3.json](delivery/ZIP-ROUNDTRIP-C3.json)。工程通过不能代替语义验收。

## 预算阻断与明确补测需求

外层模型进程启动${budget.outer_starts_total}次；已见内部重试信号${budget.internal_retry_signals_total}；观测保守${budget.observed_conservative_total}，加两次停止时未完成分配保留共${budget.conservative_charged_including_reserve-budget.observed_conservative_total}，**保守占用${budget.conservative_charged_including_reserve}/240，余${budget.remaining_conservative}**。开发18≤24，首次冻结预留222≥216。旧031的239/240、031-R1/Q05的175/180原样保留。实际服务端身份和计费次数未知，未把中断算免费、未自动追加上限。

新模型可见资源须重新做79次编译＋质量门通过后的1次部署冒烟，通常至少160次请求；现余132，**最低还缺28次请求**，未含修订/重试余量。若仍要求216次安全预留，则差84。此处是补测资源需求，不是自动授予预算。不能为了省请求继承C2、缩分母、只重测Q05或换计数口径。

发现Q05语义失败并确定需改模型可见规程后，停止本任务精确Node批次及其核验过的三项CLI子树，没有按名称批量杀进程、误停其他Codex或触碰58618。新C3不再发模型请求。当前真实阻断是预算不足，不再把已经恢复的网络故障当最终原因。

完整账：[CALL-BUDGET-FINAL-R02.json](CALL-BUDGET-FINAL-R02.json)、[BUDGET-STOP.json](BUDGET-STOP.json)。最低后续工作是新冻结版全部规定同版真实验证及来源复核，必要修订另计；全部质量门通过后才受控升级原58618。当前不自动继续调用或激活候选。

## 封存、提交及最终状态

实现提交71787ddea4e85b550f061c7b7c6675c8068a937b；消费者修复f365b93da283f061363d770f3e3a5a339b67077c；当前C3规程修复\`${manifest.source_commit}\`。后续报告提交只含必要评测工具、状态页及本目录证据，其hash由Git回执给出避免封存自引用。只push review/7plus1-parser，不merge/release/tag或对外发布。

MANIFEST / SHA256SUMS / SEAL封存证据，不证明产品通过。此前版本、原始首次、失败、开发、恢复補测和同响应回放分目录保留；没有修改Source、历史Gold或旧任务封存。

\`\`\`ini
SHORT_COMPILER_ACCEPTANCE=BLOCKED_BY_BUDGET_AND_UNVERIFIED_SEMANTIC_REPAIR
EVALUATION_COVERAGE=NOT_RUN_CURRENT_MODEL_RESOURCES
LOCAL_DEPLOYMENT=NOT_PERFORMED_QUALITY_GATES_BLOCKED
PUBLIC_RELEASE=false
STATE=WAITING_ADMIN_REVIEW
\`\`\`
`);
console.log(JSON.stringify({version:manifest.version,full_pass:full.pass,full_fail:full.fail,new_model_tests:0,historical_complete:11,historical_semantic_fail:1,charged:budget.conservative_charged_including_reserve,acceptance:'BLOCKED'}));
