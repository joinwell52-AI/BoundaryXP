# 7P-ARCH-009 — Architecture Review & Recovery Decision

TASK=7P-ARCH-009；STATUS=WAITING_ADMIN_REVIEW；PRODUCTION_READY=false。

主架构诊断：**上游候选发现与归属/组合认证存在系统性缺口**。当前主决策为 **GOLD_CONTRACT_REVIEW_REQUIRED**：先裁定 1 个源角色问题和 5 个 owned-content 比较问题，再决定恢复实现路径。此选择并不把 0/9 归咎于 Gold：忽略 extras/status 后，required-only IOA 仍为 0/9。

## 范围与冻结基线

CURRENT-TASK 指向本任务。任务声明的旧封存 HEAD 为 68d28da5c2f5db614867d1fa4ad8d0d3fb3ec53b；实际任务分发 HEAD 为 4f7bea24e767b993f59d3721bcdaf6891a8a7cc7，只增加 009 task/pointer。分析对象为 008 final r03 与实际 runtime；不切换生产入口，不解析新 Gold，不执行原文描述的业务操作，不调用 LLM 或改变模型/阈值。

阅读覆盖 CURRENT/taskbook/completion plan/v0.3、001–008 任务书和终报告、008 gap/cluster/gate/diagnostic/performance/determinism、9 STANDARD 与 REF 的完整原文、expected、10 份 r03 Trace 及运行源码。READING-INVENTORY 记录字节摘要和读取方式；大 Trace 全量 JSON 读取、完整实体关系枚举与针对性语义审阅，不把打印模型 score 全文当作推理证据。trace-views 是旧 Trace 的只读切片，counterfactual 是明确标记的诊断副本，不是新正式 replay。

## 冻结事实及同一样本矩阵

008 的 Phase A PASS / B FAIL / C 只读评估 FAIL / D NOT RUN 保持不变。专项 518 PASS、原 Parser 739 PASS、全量 5861 PASS / 0 FAIL / 17 SKIP 是 **008 历史实测**，本轮未冒称重新执行。I=7、O=7、A=9、P=9、R=1、V=12、C=19、B=12 是单项 MATCH；A_FALSE_DEFINED=6、I_FALSE_DEFINED=3、A_WRONG_BINDING=2、B_WRONG_BINDING=9。joint=0/9、full=0/9；输出内容 3/20。机制绿灯不能覆盖这些语义失败。相对 007，I_MATCH 8→7、B_MATCH 14→12，A_FALSE_DEFINED 2→6、B_WRONG_BINDING 6→9，均保留真实退步。冻结首处缺口仍为 SWAI-001 的 OWNED_TEST_BEHAVIOR_COMPOSITION（O2/A4），不以此再开 phrase patch。

下表是每个 case 的 expected I/O/A MATCH 数/required 数，FAIL 指同一样本三个字段全部满足没有成立，未改变原比较口径。

| Case | I | O | A | joint |
|---|---:|---:|---:|---|
| SWAI-001 | 3/3 | 2/3 | 4/5 | FAIL |
| SWAI-002 | 0/4 | 0/9 | 0/6 | FAIL |
| SWAI-003 | 0/6 | 0/8 | 0/6 | FAIL |
| SWAI-004 | 0/5 | 0/5 | 0/7 | FAIL |
| SWAI-006 | 0/2 | 0/4 | 0/6 | FAIL |
| SWAI-007 | 0/7 | 0/1 | 1/5 | FAIL |
| SWAI-008 | 4/10 | 1/5 | 0/5 | FAIL |
| SWAI-009 | 0/6 | 2/6 | 2/8 | FAIL |
| SWAI-010 | 0/6 | 2/8 | 2/8 | FAIL |

## 架构与依赖结果

PIPELINE-STAGE-MAP 逐阶段给出实际代码、输入输出、确定性/模型来源、错误放大、恢复限制、cluster 与 blocker。CLUSTER-DEPENDENCY-DAG 区分历史 blocker 与当前未 MATCH，计数可重叠。C02/C04/C05/C06/C07/C08/C11 共用 owner/predicate-layer/behavior composition；C03/C09/C10 局部可分离但入界仍依赖 owner；C12 是下游问责症状。当前未 MATCH 为 204，其中旧 map 有 199 个已归因，5 个 r03 新损失由 SUPPLEMENTAL-CLUSTER-ATTRIBUTION 单独分析。

工作量应按 R1 owner/layer + R2 typed identity + R3 transfer + R4 composition certification 四根抽象估算，而非按九个短语估算。R1/R4 高耦合；没有证据证明四块简单补齐就全闭合。

283 个 Gold 单位（263 slot + 20 content）逐项审计：79 GOLD_OK_V0_3_REPRESENTABLE，198 GOLD_OK_BUT_REQUIRES_STRONGER_FRONTEND，1 INSUFFICIENT_SOURCE_EVIDENCE，5 COMPARATOR_GRANULARITY_ISSUE，0 METHOD_REPRESENTATION_GAP。审计 79 个可表示项与冻结 MATCH 数一致；该审计不构成新的 ADMIN 语义审定。ADR-0015 的 ref_charter 及 TASK-006 的归档要求经完整原文复核均有明确证据，不列为 Gold 缺证。198 指有源要求但前端/组合见证不足，并非 198 个独立规则。定位性词面证据单独标记，不当作 role/entailment 证明。全部 expected 保持原字节。

## 受控反事实

5 个注入实验在改变诊断副本前，nodes/relations/IR/Canonical 均复现旧 r03；另有 1 个 dangling negative control。CF01 owner metadata 无效果；CF02/03 各删除 1 个错误事实；CF04 明示 recipient 提案产生 2 个事实（含 AUX）；CF05 无效 owner metadata Gate PASS，但 Canonical 不变；CF06 悬空对象 Gate FAIL。均未生成 official MATCH，没有完整 case 闭合，未测模型 proposal。原文、runtime、Gold、正式 Canonical 均未覆盖。

两条实际错误 RESOLVED 完整链保存在 SOUNDNESS-SOURCE-EVIDENCE：括号解释“抓”错误继承主句禁止；换行叙述“到”被提升为任务动作。前者 NLI entailment、后者 neutral，都不会改已生成 Canonical。说明当前模型信号的真实位置和合同 Gate 的语义边界，不能把合法 ID/type 当作人类意图符合性证明。

## 三个选项与决策

A：v0.3 继续实现有条件可行，四根抽象，owner/global certification 需重于局部补规则。尚未证明完整下游反事实闭合，也未证明错界增长已可控；不满足无条件 CONTINUE criteria。历史十案总延迟 451961→641998 ms，约 +42%，受并发/查询量影响，不是本轮可控性能对比。

B：模型可提出 typed node/relation/owner/scope 候选，再确定性认证，原则上不冲突。但当前 BGE/E5/NLI 是 post-Canonical signals；本轮没有实际模型 proposal 测量，现有认证亦不能安全接收任意合法 owner。因此不能宣称 HYBRID_FRONTEND_REQUIRED。

C：尚无 v0.3 不能表示的规范反例。§16.2 owned content、§17 PART_OF 或等价结构 provenance、条件/集合及 graph consistency 可表达已观察需求。运行枚举缺少 PART_OF 不等于规范缺失；不设计 v0.4。

主决策 GOLD_CONTRACT_REVIEW_REQUIRED，次级标记 SYSTEMIC_COMPOSITION_REPAIR_REQUIRED / STRONGER_FRONTEND_CANDIDATE_DISCOVERY_NEEDED / GLOBAL_SEMANTIC_OWNER_CERTIFICATION_GAP。建议仅 7P-CONTRACT-010 人工 source-role、owned-content scope 与比较合同裁定，详见 NEXT-TASK-RECOMMENDATION；本次不自动授权下一轮实现。

## 验证与交付

本轮实际执行 12 项诊断完整性、计数、DAG、源角色正例及反事实基线/重复性检查：12 PASS / 0 FAIL。VERIFY 实际核对本轮起始 5,747 个文件、旧受保护 46,736 个文件、2,825 个模型/Pack/依赖文件以及 760 个旧封存文件/封套，无字节差异；CURRENT-TASK 的已授权任务分发单独列为例外。结果在 DIAGNOSTIC-TESTS/VERIFY。旧 r03 语义 FAIL 保留，不用完整性 PASS 替代语义验收。只读工具失败及恢复在 INCIDENTS，未把失败写成 PASS。Manifest/SHA256SUMS 覆盖交付，SEAL/SEAL-VERIFICATION 验证字节；push 仅 review/7plus1-parser。Parser=false、Gold=false、Source=false、BXP=false、v0.3=false、模型/阈值=false、QI–QB/projection=false、生产入口=false；不 merge/release/tag。
