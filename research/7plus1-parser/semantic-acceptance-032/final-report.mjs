// Offline final accounting only. Does not import a Provider or invoke models.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {report,write} from './prepare.mjs';
import {sha256} from '../llm-first-028/source.mjs';

const read=n=>JSON.parse(fs.readFileSync(path.join(report,n),'utf8'));
const update=(n,v)=>{const p=path.join(report,n);fs.writeFileSync(p+'.tmp',JSON.stringify(v,null,2)+'\n',{flag:'wx'});fs.renameSync(p+'.tmp',p);};
const text=(n,v)=>{const p=path.join(report,n);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,v,{flag:'wx'});};
const root=path.resolve('.boundx/experiments/032/packages/consumer-c2');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json')));
const prior=read('CANDIDATE-FROZEN.json'),budget=read('CALL-BUDGET-FINAL.json');
const core=read('engineering/consumer-r02/RESULTS.json');
const full=read('engineering/consumer-r02-full/RESULTS.json');
const entry=read('engineering/consumer-r02-installed/RESULTS.json');
assert.equal(core.exit_code,0);assert.equal(core.fail,0);assert.equal(full.exit_code,0);assert.equal(full.fail,0);assert.equal(entry.exit_code,0);
const git=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();assert.equal(manifest.source_commit,git);
for(const f of manifest.files)assert.equal(sha256(fs.readFileSync(path.join(root,f.path))),f.sha256,'PACKAGE_CHANGED:'+f.path);
const byPath=new Map(prior.package_files.map(f=>[f.path,f.sha256]));
const changed=manifest.files.filter(f=>byPath.get(f.path)!==f.sha256);
const modelVisible=manifest.files.filter(f=>/\/(?:contracts|skills)\//.test(f.path)||/\/(?:provider|process|bundle|source)\.mjs$/.test(f.path));
for(const f of modelVisible)assert.equal(f.sha256,byPath.get(f.path),'MODEL_RESOURCE_CHANGED:'+f.path);
const {buildBundle}=await import(pathToFileURL(path.join(root,'research/7plus1-parser/llm-first-028/bundle.mjs')));
assert.equal(buildBundle('parse').sha256,prior.parse_bundle_sha256);assert.equal(buildBundle('audit').sha256,prior.audit_bundle_sha256);
for(const f of manifest.files.filter(f=>/\/web\//.test(f.path)))assert.equal(f.sha256,byPath.get(f.path),'UI_RESOURCE_CHANGED:'+f.path);
write('CONSUMER-CANDIDATE-FROZEN.json',{
 at:new Date().toISOString(),version:manifest.version,compiler_revision:manifest.compiler_revision,contract:manifest.contract,
 implementation_commit:git,package_manifest_sha256:sha256(fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json'))),package_files:manifest.files,
 model_visible_resources_identical_to_c1:true,model_visible_resource_hashes:modelVisible,
 parse_bundle_sha256:prior.parse_bundle_sha256,audit_bundle_sha256:prior.audit_bundle_sha256,
 provider_sha256:manifest.files.find(f=>f.path.endsWith('/provider.mjs')).sha256,
 models:prior.model,thresholds:prior.thresholds,semantic_packs:prior.semantic_packs,
 consumer_changes:changed,change_reason:'Generic typed expression identity must include its operator, operands and state; UNION and INTERSECTION over the same endpoints are competing interpretations, not duplicate alternatives.',
 original_first_freeze:'CANDIDATE-FROZEN.json',original_first_freeze_reserved:prior.final_reserved,
 current_budget_conservative_charged:budget.conservative_charged_including_reserve,current_budget_remaining:budget.remaining_conservative,
 budget_not_reset:true,additional_model_requests:0,exact_response_replay:'CONSUMER-R02-REPLAY.json',
 engineering:{core,installed_entry:entry,full},acceptance:'BLOCKED_BY_INCOMPLETE_REAL_VALIDATION',public_release:false
});

const log=fs.readFileSync(path.join(report,'engineering/consumer-r02-full/full.log'),'utf8');
const skips=log.split(/\r?\n/).filter(l=>/^(?:﹣|-) .* # /.test(l));assert.equal(skips.length,full.skip);
write('engineering/consumer-r02-full/SKIPS.json',{count:skips.length,records:skips,not_counted_as_pass:true});
write('engineering/transport-guard/RESULTS.json',{command:'node --test research/7plus1-parser/semantic-acceptance-032/transport-ledger.test.mjs',pass:2,fail:0,real_model_calls:0,scope:'Evaluation accounting and nested transport stop guard, separate from the frozen runtime and from full regression counts'});
const gates=read('GATES.json');write('GATES-C1-PRE-CONSUMER-REPAIR.json',gates);
gates.at=new Date().toISOString();gates.candidate={version:manifest.version,compiler_revision:manifest.compiler_revision,contract:manifest.contract};
gates.gates.find(g=>g.id==='G2').evidence=['engineering/consumer-r02/RESULTS.json','engineering/consumer-r02-installed/RESULTS.json','engineering/consumer-r02-full/RESULTS.json','engineering/consumer-r02-full/SKIPS.json'];
gates.gates.find(g=>g.id==='G2').counts={core:core.pass,installed_entry:entry.pass,full_pass:full.pass,full_fail:full.fail,full_skip:full.skip};
gates.gates.find(g=>g.id==='G5').evidence=['engineering/UI-REVIEW.json','engineering/consumer-r02/RESULTS.json','CONSUMER-CANDIDATE-FROZEN.json'];
gates.gates.find(g=>g.id==='G6').evidence=['engineering/isolation-consumer-c2/RESULTS.json','engineering/consumer-r02-full/RESULTS.json','delivery/PACKAGE-'+manifest.version+'.json','delivery/ZIP-ROUNDTRIP-C2.json'];
update('GATES.json',gates);
const performance=read('PERFORMANCE-AUDIT.json');write('PERFORMANCE-AUDIT-C1.json',performance);
performance.consumer_c2_full_regression=full;performance.consumer_c2_core=core;performance.consumer_c2_installed_entry=entry;
performance.real_observations_version=prior.version;performance.current_candidate_version=manifest.version;performance.additional_c2_model_requests=0;
performance.model_visible_resources_identical=true;performance.replay_is_not_new_semantic_observation=true;update('PERFORMANCE-AUDIT.json',performance);
const oldPackage=read('delivery/PACKAGE.json');write('delivery/PACKAGE-C1.json',oldPackage);
const currentPackage=read('delivery/PACKAGE-'+manifest.version+'.json');update('delivery/PACKAGE.json',currentPackage);
const matrix=read('FIRST-RESULT-MATRIX.json'),semantic=read('SEMANTIC-REVIEW.json');
assert.equal(matrix.rows.length,79);assert.equal(semantic.completed_source_semantic_reviews,3);
const decisions=read('REVIEW-DECISIONS.json');assert.equal(decisions.length,79);
const quote=s=>'"'+String(s??'').replaceAll('"','""')+'"';
text('RESULTS.csv','id,source_sha256,execution,semantic_review,trace\n'+matrix.rows.map(r=>[r.id,r.source_sha256,r.execution_status,decisions.find(d=>d.id===r.id)?.status,r.trace_path??''].map(quote).join(',')).join('\n')+'\n');

text('INSTALL-AND-ROLLBACK.md',`# 032候选运行包与固定入口

当前运行包：\`${manifest.version}\`，核心\`${manifest.compiler_revision}\`，合同\`${manifest.contract}\`。声明范围为非空、≤300码点的单一ADMIN短任务。**本轮语义质量门未通过，候选未安装到58618；不得把以下维护说明当作当前升级已经获准实施的回执。**

包文件：[BoundX-short-compiler-${manifest.version}.zip](delivery/BoundX-short-compiler-${manifest.version}.zip)。SHA-256：\`${currentPackage.sha256}\`。包不含模型权重、依赖缓存、凭据、私人历史或开发工作区的160项原有改动。包内包含实际唯一核心、两Skill、合同/Schema、原UI、锁定依赖清单及中文使用说明。

## 当前用户入口

当前完整安装指针仍为\`0.1.0-candidate.031-r1.2\`、核心\`031-r1-c3\`、合同\`031-r1.1\`。最终核查58618无监听，**没有报告已上线或已恢复**。本任务未重新启动旧服务或切换指针。

电脑重启后的既有启动命令：

\`\`\`bat
cd /d D:\\boundx
npm run 7plus1:ui
\`\`\`

该命令启动上面的完整旧安装；正常启动后固定地址为 http://127.0.0.1:58618/ 。安装版CLI使用同一版本：

\`\`\`bat
npm run 7plus1:installed -- --input task.txt --output new-run-directory
\`\`\`

开发入口\`npm run 7plus1\`与旧安装不是同一版，不可混称。既有登录和用量仍是模型运行前提；本轮真实传输故障没有通过更换账号、TLS设置、代理或模型绕过。

## 解压核验与依赖

将zip解压到独立干净目录，不覆盖旧安装。在包根核验及安装依赖：

\`\`\`bat
npm ci --omit=dev --ignore-scripts
npm run verify
\`\`\`

Windows、Node≥22.18、现有Codex CLI登录为运行前提。可设置进程级\`BOUNDX_CODEX_EXE\`指向既有二进制；不改全局账号配置。离线核验和干净安装已实测；真实服务路由/TLS故障尚未恢复。不得通过安装包自动补足额度或放宽校验。

## 后续受控升级与回滚步骤（本轮未执行）

只有G1–G6完成、目标实际PID/版本已核实、无在途请求、正常权限允许时，先备份\`current.json\`、\`config.json\`及配置中实际data_dir。只停止已确认的目标实例；拒绝不能换命令或工具绕过。保持原UI、配置和历史。

在已核验候选包根执行既有安装模块，固定home和端口，不新增用户端口：

\`\`\`bat
node product/short-compiler/deploy.mjs upgrade --home D:\\boundx\\.boundx\\short-compiler-031-r1 --confirmed-idle
cd /d D:\\boundx
npm run 7plus1:ui
\`\`\`

完成后核对页面会话、完整Manifest、两bundle、D08真实编译及同版JSON/中文导出。本轮G3/G4未通过，**不执行上述升级**。

如维护后出现回归，核实目标空闲并正常停止该实例，再从同一完整安装的deploy模块回滚：

\`\`\`bat
node product/short-compiler/deploy.mjs rollback --home D:\\boundx\\.boundx\\short-compiler-031-r1 --confirmed-idle
cd /d D:\\boundx
npm run 7plus1:ui
\`\`\`

回滚切换完整版本，不将新Skill混入旧核心，不重算历史。以上安装、资源隔离、备份及回滚只在自有干净测试home实测，没有读写用户私人历史。
`);

text('REPORT.md',`# 7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG

**产品验收：BLOCKED。工程实现、无模型验证和候选封装已完成；真实模型传输故障使整批语义验收未完成，因此没有升级58618，不宣称任务交付完成。停止于WAITING_ADMIN_REVIEW。**

当前候选\`${manifest.version}\` / 核心\`${manifest.compiler_revision}\` / 合同\`${manifest.contract}\`。实际用户安装指针仍是\`0.1.0-candidate.031-r1.2\` / \`031-r1-c3\` / \`031-r1.1\`；最终检查58618无监听。本任务既未恢复端口，也未尝试停止旧58618服务；不是一次新的自动审批拒绝。

运行包与电脑重启后的启动、受控升级和回滚方法：[INSTALL-AND-ROLLBACK.md](INSTALL-AND-ROLLBACK.md)。当前zip SHA-256：\`${currentPackage.sha256}\`；完整Manifest SHA-256：\`${currentPackage.manifest_sha256}\`。该包是待验收候选，不是已上线产品。

## 实现与方法

沿用\`llm-first-028\`唯一核心、两个实际INLINE_BUNDLE Skill、原UI及既有安装模块。没有另建解析器或新增长期用户端口；不改变7+1/BXP定义，不读Gold-60，不启动完整边界求解或业务执行。模型请求固定gpt-6.1-sol/medium；实际服务模型未披露，原生Skill发现未验证。

1. 类型化区分具体ITEM、有限枚举、CATEGORY、FORALL、例外、未限定任务类别、解析缺口及真实域竞争。DOMAIN_CHOICE是互斥的备选解释，不是自动并集、交集或同时生效的两条禁令。UNRESOLVED_DOMAIN保留覆盖缺口，不能用普通ITEM冒充完整全称。
2. 相同域不同成员可计算；域外成员不扩大纳入；未知/冲突归属保持UNKNOWN。竞争解释逐棵完整范围树计算，最终UNKNOWN。未命中某条禁止不等于获得许可；business_decision与execution_authorization仍为null。
3. 两Skill同时强化类别—容器—来源链与唯一回指。文件共现或同FILE类型不足以产生候选域；明确文本不能全部降未决。代码消费typed结构，不扫描原文/note/label补“任何”或猜答案。
4. 局部疑点保留禁止与全称、来源支持备选及最小问题，独立I/O/A/P不消失。原UI待确认页显示完整备选树和精确来源，不预选；编辑仅聚焦原文。新源、新摘要、新run与父记录关联，历史不覆盖，超300码点不截断。真实D08澄清编译尚未完成。
5. 同一IR生成JSON、中文和导出；产品验收、单次运行和单条未决分别展示。安装版CLI与UI读取同一完整Manifest，拒绝未知或混版资源；开发CLI明确区分。

原Q05的预声明产品口径为正确局部澄清，不证明唯一域，也没有倒改030/031结果。详见[SOURCE-DOMAIN-REVIEW.md](SOURCE-DOMAIN-REVIEW.md)及模型调用前冻结的[SOURCE-EXPECTATIONS.json](SOURCE-EXPECTATIONS.json)。69份不同测试源是53固定＋8N＋8D，绝不是已撤回的“69 Gold”集合。

## 缺陷关闭与保留的首次结果

开发共8次完整编译尝试，18次外层请求，无已见内部重试；不混入最终验收分母。

- D07首次结构正确但审阅context_ref引用现有来源有效ambiguity issue，技术校验错误拒绝并触发一次修订。通用修复仅允许唯一且来源有效issue作为context_ref；不能用它充当实体、论元或依赖节点。原始失败及纯消费者回放保留；新开发D07-R1为正确澄清。
- D01首次把明确“该文件内”误作原输入与单纯生成产物之间的竞争，模型自审SUPPORT也未拦住。两Skill要求真实类别—容器关系证据，不按文件角色硬排除所有输出。新开发D01-R1正确确定局部域；D02-R1正确保留跨文件范围。首次过度未决仍记SEMANTIC_FAIL。
- 离线审查发现DOMAIN_CHOICE去重只比较端点，错误合并同端点的UNION与INTERSECTION。消费者修复比较operator/operands/state；不选赢家。升为032.2，Schema、两Skill、Provider、模型配置及有效bundle与032.1完全相同。三份已有真实响应在032.2重编译，技术结果、JSON及中文均一致，新增模型0次；这不是新语义成绩，也不补足余下76次。
- 批量评测停止保护只看外层stderr，底层网络故障被预算取消错误遮住，前三次同类失败后仍启动Q07–Q12。核实本任务精确PID/所有直接子进程身份后仅终止自有批次；修复评测脚本读取保留的嵌套stderr，2项回归通过。没有修改冻结Provider来伪装成功，额外失败与中断记录全部保留。

证据：[DEVELOPMENT-REVIEW.md](DEVELOPMENT-REVIEW.md)、[CONSUMER-R02-REPLAY.json](CONSUMER-R02-REPLAY.json)、[CONSUMER-CANDIDATE-FROZEN.json](CONSUMER-CANDIDATE-FROZEN.json)、[TRANSPORT-PAUSE.json](TRANSPORT-PAUSE.json)。

## 真实验收与逐层结果

| 组 | 预登记 | 完整结果 | 当前结论 |
|---|---:|---:|---|
| S00–S12、T01–T10、Q01–Q30 | 53 | 3 | Q01–Q03逐事实来源复核SOURCE_FAITHFUL；Q04–Q09传输失败，Q10–Q12自有批次中断，其余41未运行 |
| 五例额外重复 | 10额外＋5首次形成15观察 | 0 | NOT_RUN；未评价稳定性 |
| N01–N08 | 8 | 0 | NOT_RUN；不继承旧结果 |
| D01–D08最终同版 | 8 | 0 | NOT_RUN；开发结果不替代 |
| 58618部署后D08 | 1 | 0 | 质量门未通过，未部署、未调用 |

79次总计：启动12，完整3，传输失败6，中断3，未运行67；只有3份完成逐事实语义复核，其余76份不可评为语义PASS或语义FAIL。Q05开发保留FORALL及域备选、正确澄清；最终Q05因传输失败没有完整输出。全称程序能力已验证，原案唯一域NOT_PROVED，最终产品澄清及补充新源能力仍待规定同版真实验证。

已完成3份逐项核对原文、候选、独立审阅、技术校验、IR、最终JSON和中文，包括额外输出；不是仅依据模型SUPPORT或JSON合法。评分为执行者来源复核，不是ADMIN人工Gold。Q04–Q12现有原始候选/回执保留，没有伪造缺失的审阅、IR或最终7+1。

完整79行：[RESULTS.csv](RESULTS.csv)、[FIRST-RESULT-MATRIX.json](FIRST-RESULT-MATRIX.json)、[SEMANTIC-REVIEW.json](SEMANTIC-REVIEW.json)。原始逐层文件见\`runs/final/<ID>/run/\`，新消费者相同响应见\`runs/consumer-r02-replay/\`。没有覆盖首次失败、重新措辞原文或选取最好响应。

## 工程、同源UI与安装验收

| 检查 | 实测结果 | 限制 |
|---|---|---|
| 032.2唯一核心 | ${core.pass}/${core.total} PASS，${core.fail} FAIL | 无模型正反、覆盖、技术引用、范围、澄清、来源与消费者测试 |
| 安装入口 | ${entry.pass}/${entry.total} PASS | 同完整安装CLI/UI；开发资源不混读 |
| 最终全量回归 | ${full.pass} PASS / ${full.fail} FAIL / ${full.skip} SKIP，共${full.total} | 跳过不计通过；详列[SKIPS.json](engineering/consumer-r02-full/SKIPS.json) |
| 评测传输停止保护 | 2 PASS / 0 FAIL | 仅评测脚本，未计入上行全量数 |
| 干净安装/升级/回滚/资源破坏拒绝/历史 | PASS | 自有干净home、临时测试端口已释放、0新Codex调用；未读写私人历史 |
| 原UI澄清、精确高亮、JSON/中文导出 | 已核对行为PASS | 冻结Q05响应，仅回放；不是用户实时模型验收；C2 UI字节与C1相同 |

完整回归约${(full.elapsed_ms/1000).toFixed(1)}秒，包含既有本地NLP模型回归，**不是所有模型推理都为0**；新增Codex请求为0。无关闭测试、删除预期或屏蔽错误。17项跳过包括本机符号链接权限等已有条件，逐项原因记录。

UI测试种子缺少旧详情元数据，详情行出现undefined被如实记为夹具限制；真实服务会生成对应字段，没有据此宣称完整生产UI验收完成。新源parent/source lineage通过无模型服务正反测试，最终D08仍是质量门必要项。

工程证据：[GATES.json](GATES.json)、[engineering/consumer-r02-full/RESULTS.json](engineering/consumer-r02-full/RESULTS.json)、[engineering/isolation-consumer-c2/RESULTS.json](engineering/isolation-consumer-c2/RESULTS.json)、[engineering/UI-REVIEW.json](engineering/UI-REVIEW.json)。

## 调用账本、阻断与剩余工作

开发18＋最终18＝36次可证明的外层模型进程启动。已见内部重试信号31，观测保守67；3个中断请求没有最终receipt，另保留其未完成分配11，**保守占用78/240，剩余162**。开发18≤24，首次冻结预留222≥216。旧031的239/240、031-R1/Q05的175/180保持原账，没有拼账、重置或自动追加上限。实际服务端模型和计费次数未知，传输重试信号不必然等于收费样本。

剩余76次完整编译＋部署冒烟至少约154次正常解析/审阅请求；162只剩很小余量，不能保证足够所有有界修订或传输重试。此次未因尚有预算就继续请求。完整账：[CALL-BUDGET-FINAL.json](CALL-BUDGET-FINAL.json)；性能：[PERFORMANCE-AUDIT.json](PERFORMANCE-AUDIT.json)，3个成功真实运行约81.1–113.2秒，样本不足以声明SLA。

真实阻断为Codex workspace routing discovery failed/timed out；普通TLS校验的HEAD https://chatgpt.com/也失败。暂停后没有追加模型请求，没有改账号、代理、TLS、安全校验或付费通道。未将传输问题写成Parser语义失败，未用工程PASS代替产品验收。

正常连接恢复后才可在剩余授权预算内续测：保持已冻结同源模型资源、新补测目录、首次失败不覆盖，先复核最低预算；不足则明确提交补测需求，不自行增加。G3/G4及D08闭环未完成前保持旧安装。

## 保护、封存与提交

原160项本地tracked改动逐字节核对不变；旧完整安装及历史143项摘要不变。不整体stage，不reset/clean，不修改旧封存、Gold、Source任务书或7+1/BXP定义，不混入无关缓存、权重、凭据。原C1冻结/运行记录保持不变，C2独立记录。

实现提交：\`71787ddea4e85b550f061c7b7c6675c8068a937b\`；消费者修复提交：\`${git}\`。报告提交为随后仅包含评测工具、状态页和本目录证据的提交；其hash由Git回执给出，避免封存自引用。只推送review/7plus1-parser，不merge/release/tag，不对外发布。

MANIFEST.json列出本目录payload摘要；SHA256SUMS包括payload和Manifest；SEAL.json记录两者摘要。封存只是证据冻结，**不等于产品通过**。

\`\`\`ini
SHORT_COMPILER_ACCEPTANCE=BLOCKED
EVALUATION_COVERAGE=PARTIAL
LOCAL_DEPLOYMENT=NOT_PERFORMED_QUALITY_GATES_BLOCKED
PUBLIC_RELEASE=false
STATE=WAITING_ADMIN_REVIEW
\`\`\`
`);
console.log(JSON.stringify({version:manifest.version,core:core.pass,full:full.pass,fail:full.fail,skip:skips.length,complete:3,acceptance:'BLOCKED',additional_models:0}));
