# 7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F

`DOWNSTREAM_SEMANTIC_026F=FAIL`；`TRIAL_ADMISSION=DENIED`；`WAITING_ADMIN_REVIEW`。

本轮完成固定范围的一次隔离修复周期与验证，没有准入活动实现。活动基线仍为 Root 16/50、Natural 9/100、已暴露开发集 200/200；A/B 关闭、收窄 C 保持，生产入口未切换。不能以诊断图 10/10 或合同门禁通过宣布下游语义闭合。

## 实际结果

| 检查 | 通过 | 失败 | 待审／跳过 |
| --- | ---: | ---: | ---: |
| 原十份来源复核诊断图，隔离修复版 | 10 | 0 | 0 |
| 十二份固定语义对照 | 11 | 1 | 0 |
| 五份单特征故障检查 | 5 | 0 | — |
| 018/021 原有测试 | 78 | 0 | 0 |
| 隔离版现有 026 测试 | 19 | 0 | 0 |
| 完整 Node 回归（6683 项） | 6666 | 0 | 17 |

来源包 Python 校验另行保存真实日志和回执。17 个跳过项及其环境／可用性原因逐条记录于 TESTS.json，未计为通过。完整回归使用全部 295 个当前 Node 测试文件，记录测试文件 SHA、实际命令和完整 TAP；不声称这些旧测试全部覆盖本轮修改。19 项隔离测试只重定向实现导入；其中只读架构盘点工具仍检查原活动目录，不能冒充隔离版全面语义验收。原 npm test 运行结果相同，但工具输出截断，因此另行持久化的 full-r001 完整日志作为交付依据。

| 同一批实际冻结自动图 | 未改核心 | 隔离修复版 |
| --- | ---: | ---: |
| Root-050 | 16/50 | 12/50 |
| Natural-100 | 9/100 | 7/100 |
| 已暴露开发200 | 200/200 | 160/200 |
| 既有 PASS→FAIL | — | **46** |
| 新增完整语义闭合 | — | **0** |

350 份自动图全部实际运行，运行异常为 0。首次兼容实验回退 69 条；在本次修复周期内收窄条件检查后仍回退 46 条。两个版本全部原始结果保留，最终结论使用 compatibility-r002，不覆盖失败。350/350 自动路径 G8 及其他候选门禁通过，350/350 合同门禁通过；pre-Γ destructive 四项均为 0。这些结构检查并未拦住语义问题。

新增认证关系共 10 条，逐条来源审阅后有 **2 条无依据认证**，关联 **2 个 RESOLVED BoundaryFact**。372 份最终诊断／自动 Trace 的实际 RESOLVED 证明可达性检查缺口为 0。可达性只证明声明依赖有路径，不证明自然语言真值。

## 输入和真实引擎复现

从 026E 提交 `4dea24229f4189bb699bd1eef621bf928a0882b7` 的 EVIDENCE.zip 逐字节提取 154 份实际运行源码／依赖，逐项比对原 manifest；不把该 Git 提交号称为完整实际引擎版本。旧 ZIP SHA-256 为 `977cd15d6f436181e89baf67577c11bc77dca847c692d3130b865bfb59a535b0`。

旧快照没有打包动态读取的 JSON。另从上述提交补入 13 份 protocol schema、vendor datapackage schema 与 action-frame schema，并核对工作区字节相同，来源和摘要见 SNAPSHOT-EXTRA 三份记录。未修改 Schema；最初缺失资源导致的运行错误仍保存，不计为语义失败或 PASS。

旧原入口的 0/10 是自动生成器 G8 不满足；026E 诊断断言的 7/10 是旧标注口径。十份旧输入和八类下游输出已原样复现。独立来源复核后，订正版未改核心为 8/10；隔离版为 10/10。**标注更正带来 1 条变化，代码修复带来 2 条变化**，不混算成代码修好三条。

唯一旧图语义更正是 NROOT-038：`sent to QA for review` 保留接收者与复核用途／角色，不再额外构造 QA 独立强制复核 ACTION。更正为另存的 SOURCE_PURPOSE STATE，原图、旧断言和失败原样保留。NROOT-001 根据全文中明确的当前 QA 独立复核要求补充来源复核许可证据；不是仅凭“后”推执行义务。该证据标为人工来源复核，不假称模型输出。审阅者为 Codex，未称 ADMIN 已批准。

22 份原文、图、预期、比较规则和五份故障输入均在修改 Γ 前固定并保存 SHA。S12 不在通过之后换句、不排除分母：冻结图把“复核说明”的 OUTPUT_CONTENT 域覆盖到整个子句，连“引用”主谓词一起放入该域，与其当前写作动作预期不一致。第一分歧是手工输入来源审阅／层级标注，并非已证明的 Γ 或模型缺陷。两种合理读法及最小 ADMIN 审阅事项见 S12-INPUT-REVIEW-FAILURE.json。即使该项将来获更正，本轮仍因自动回退和错误认证而 FAIL。

比较程序曾纠正两处检查实现：STATE_REF 对应事实应沿其 state node 核对，而非假设所有事实都有 predicate_id；参与角色应读取实际 AGENT、participant_roles 与 PARTICIPANT 事实，而非显示字符串。没有改冻结预期、源文本或解析结果。初次错误比较和资源缺失结果保留在各轮目录；最终比较程序摘要另列于封存源码清单，不冒称它与首次冻结程序字节相同。

## 共用核心与隔离修复

baseline/trial 的 compileCandidates 自动路径和冻结诊断入口共用同一 compileFrozenCandidates 下游函数。350 份自动 Gc 按旧缓存 NLP 证据复原后，每个字段与旧图完全相同；抽取前后 Γ、BoundaryIR、Canonical、ProofDAG、CandidateProof、Unresolved、Coverage、Eligibility 八类输出完全一致。只重放模型缓存，不声称 350 次新模型调用。

诊断域仅为 REVIEWED_GRAPH_TEST_ONLY，候选门禁 G8 显示 NOT_APPLICABLE，另存原始 G8 FAIL；不是 G8 PASS。所有其他证据／竞争／来源门禁继续运行。该域只存在于隔离目录，没有改生产入口。全量旧测试自身会运行其已有模型测试，不把全量回归描述为完全无模型调用。

隔离修改限于以下实际位置，源码清单与摘要见 MANIFEST：

- trial 的 v0.3-candidate-parsing-026/gamma.mjs：完整名词与单独介词 token 包络分离；具完整局部证据的当前任务用途认证；来源复核局部对象所有权检查；表达式条件依赖检查。
- 同目录 local-use-certification.mjs：验证 exact span、predicate token、局部依存论元、clause/discourse ownership 和声明结构路径；不按案例 ID 或实体选择答案。
- 同目录 downstream-core.mjs：声明的执行条件未认证时，阻止丢掉条件而产出无条件 RESOLVED；其他投影及定义保持原样。

目的补语更正由已有 STATE、接收关系与参与角色路径表达，没有新造独立业务执行义务。五种故障分别覆盖悬空引用、偏移错误、条件依赖缺失、局部对象证据缺失和竞争伪唯一；故障检查只证明这些固定证据合同有效，不证明能识别所有伪造语义图。

## 最早剩余分歧与不准入原因

46 条自动回退最早均在 Γ expression certification。现有冻结自动图的 STATE_REF 有空 expression.relation_ids，但其 CONDITION_OF 已在 candidate plan 与图的关系中。隔离检查额外要求同一依赖再次出现在表达式 relation_ids，拒绝原有条件表达式，随后 Boundary dependency closure 保留 UNRESOLVED。代表 ROOT-002 的“QA 复核缺失项后由 PM 向 ADMIN 汇报”及全部前后 expression/plan/decision 证据列于 COMPATIBILITY-FAILURE-ANALYSIS.json。故障 F03 的局部检查有效，不意味着这项更强要求兼容现有所有合法表达式路径；本轮没有修改冻结自动图或继续扩大合同修复。

NROOT-091 的原文要求按照 API-GUIDE-3 version v2.6 检查 api-map.json。包络放宽改变了 ARGUMENT_EXTENT 竞争，错误认证“检查→API-GUIDE-3 version v2.6”为 PATIENT，并派生 SCOPE_MEMBER，使依据误变为受检材料。该原文没有要求检查指南。这是 2 条新增无依据关系／2 个受影响事实，逐条源片段、候选、前后 Γ 决定和事实 ID 见 NEW-CERTIFICATION-SOURCE-REVIEW.json。没有以合同通过掩盖。

自动图共有 2 条旧 unresolved 消失，分别是 ROOT-023 的“在用设备编号”和 ROOT-033 的“向量”对象范围；对应完整名词与已有局部证据可核查。没有删原始图中的竞争解释或 pre-Γ unresolved；这不能外推为所有真实源歧义已经排除。

修复周期已经结束，隔离版不准入，不再补第二轮规则，不扩大候选生成、不换模型或阈值、不恢复 pre-Γ 裁决。下一步必须由 ADMIN 判断表达式依赖合同与名词／依据竞争约束的处理方向。

## 交付、完整性与停止状态

原文、冻结图／预期及来源审阅账本在 inputs、INPUT-FREEZE、SOURCE-REVIEW-LEDGER；逐案对照在 BEFORE-AFTER；最终真实 Canonical 和完整 Trace 在 runs/trial-r004。自动最终 Trace／矩阵在 compatibility-r002；首次兼容失败在 automatic/evaluation。各轮失败、异常、故障结果和完整日志不覆盖，均放入 EVIDENCE ZIP。ZIP 内保留仓库完整相对路径，解压到仓库根目录后可直接复现。

可复现入口及说明：`research/7plus1-parser/downstream-semantic-validation-026f/replay-frozen.mjs` 和同目录 README。自包含烟雾验证已核对一份诊断图、同一份自动图的 baseline/trial；自动八类输出与封存结果完全一致。该烟雾测试不替代已经执行的 350 条对照。

用户原有 160 份 tracked 改动、46 份活动 026 文件摘要均未变；旧 026E 的 2348 份受保护资产及原 manifest 的 791 文件均未变。仅提交本轮隔离目录和报告／证据，不提交用户旧改动、模型、缓存或凭据。MANIFEST、SHA256SUMS、SEAL 与 ZIP 内逐文件摘要核验记录随交付提供。

只推送 review/7plus1-parser，不 merge/release/tag，不切生产，不启动 027 或继续 026 扩大研发。`PRODUCTION_READY=false`。本轮停止于 WAITING_ADMIN_REVIEW。
