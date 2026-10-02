# 7P-COMPOSITION-011 — R1 diagnostic seal

TASK=7P-COMPOSITION-011
TERMINAL_OUTCOME=IMPLEMENTATION_GATE_FAILED
STATUS=WAITING_ADMIN_REVIEW
PRODUCTION_READY=false

R1 尚未通过：迁移测试保留一条历史源码字节锁失败，且最终审阅确认验收域 guard 误抑制一条明确的非执行 V 依据。后者是实际语义缺陷，不能因全量回归 0 FAIL 或错误计数下降而略过。R2–R4 未开始。

当前任务由 CURRENT-TASK.md 指向 011。实际 dispatch HEAD 为 44cc0f712d2ae9cb1d96fbe5a9ce3e0ab2eee69a；任务声明的上一封存为 185474e4433fdccc462c84627d672ba267cebe65。本轮仅独立候选 research/7plus1-parser/v0.3-7p-composition-011/，没有切换生产入口。

R1 已实现共享 ownership/layer forest，并在 Frame Certification 和 Eligibility 前消费。记录每个候选的唯一 owner 或 typed ambiguity、语法层、文档域、父路径、来源、继承/覆盖及负证据。显式缩进列表续行使用已有父项路径；括号内谓词不自动继承外层模态；验收执行谓词与完成状态区分；OUTPUT_CONTENT 继续绑定原有唯一输出或输出集合。代码声明的已有显式 prose ownership 机制保留。

## Gate 与实际测试

|检查|结果|
|---|---|
|R1 独立冻结 non-Gold|12 PASS / 0 FAIL|
|R1 专项（含 7 个 delimiter regression）|19 PASS / 0 FAIL|
|001–008 机制迁移到候选|517 PASS / 1 FAIL|
|原 Parser 回归|739 PASS / 0 FAIL|
|仓库全量回归|5880 PASS / 0 FAIL / 17 SKIP|
|9 个 STANDARD 实际 compiler 重放|9/9 完成，Contract/Relation Gate 均 PASS|
|R1|FAIL|
|R2 / R3 / R4|NOT_STARTED_R1_GATE_FAILED|

唯一仍失败的迁移测试位于 tests/parser-7p-closure-008-retained-007.test.mjs:19，要求 eligibility.mjs 与封存 006 逐字节相同。本轮授权的共享 owner 消费改变了该文件。此断言是历史源码锁，不是发生了语义输出退化的证据；但任务 §14 要求保留 Gate 全绿，因此不得把它忽略、改成 PASS，或为绕过它而移动相同逻辑。首次失败、修复中间两条失败和最终失败均保留。一个导出 revision dispatch 问题已修复，最终没有 exporter 失败。

按 §14，R1 Gate 失败后停止 R2–R4。本封存是失败执行诊断，不是 SYSTEMIC_REPAIR_VALIDATED；也没有完成四阶段的证据可宣称 SYSTEMIC_REPAIR_INSUFFICIENT 或 v0.3 方法限制。

## 010 冻结合同比较

|指标|before|after|
|---|---:|---:|
|I / O / A MATCH components|7 / 7 / 9|7 / 7 / 9|
|CASE_IOA_JOINT|0/9|0/9|
|STANDARD_PARSED / full case|0/9|0/9|
|root false-defined|9|8|
|root wrong-binding|11|5|
|slot status mismatches|72|72|
|owned-content missing|22/25|22/25|
|总 required missing|203/282|203/282|

两个已确认错误谓词均没有进入新 BoundaryFact：SWAI-006 括号内“抓”的禁止继承，以及 SWAI-010 缩进 narrative 续行的“到” REQUIRED action。完整原始 chain 与 after owner/arbitration/Eligibility 位于 R1-OWNER-LAYER-AUDIT.json。另有错误绑定也被同类负证据挡住。既有正确 MATCH 无损失，新增顶层条目为 0；减少错误并不等于填补缺失。9 案 I/O/A matrix、全槽矩阵及逐条实际 delta 分别见 CASE-IOA-JOINT-BEFORE-AFTER、FULL-CASE-BEFORE-AFTER、COMPARISON-r1-sealed.json。

比较复用 010 人工审阅仅限 Canonical、BoundaryFact、relation 和 source node 语义完全相同的实际结果，同时重新验证 root/content/aggregate/proof 路径。新条目或语义改动会直接拒绝该复用并要求独立复核，不能字符串补答案。所有 retained MATCH 和 C3 aggregate proof 都实际重验。Owned-content 图完全未变，因此没有给予新的 content credit。

## 重放与模型边界

20 个独立输入及 mechanism contracts 在实现前冻结；真实 HanLP/spaCy 已实际运行并保存 signals。R1 的 12 个构式进入本轮验收，其余 8 个 R2–R4 输入只有 NLP capture，阶段验收 NOT_RUN。

9 案从 008-r03 的原文和真实冻结 NLP signals 输入 compileNative，重新建立语义图、Eligibility、BoundaryIR、Canonical 和 ProofDAG；没有从 legacy 7+1 反推。此重放不是新的端到端模型运行：BGE/E5/NLI 未重新执行，不宣称新的模型验证结果。多次 intermediate replay 与 first failures 全部保留，最终源码 digest 与 replay-r1-sealed/IMPLEMENTATION-FREEZE.json 一致。

## 性能与完整性

受控测量在回归结束后单进程交替 before/after，9 案各 warmup 1 对、测量 3 对；时间只包含 deterministic compiler，不混同历史 NLP 或模型时间。各样本 median 总和 43652.63 → 42166.74 ms，变化 -3.40%。PERFORMANCE_CONCERN=false。性能 concern 和阶段失败均不能授权生产采用。

反过拟合扫描覆盖 115 个实际 import-closure modules。7 个宽匹配 flags 原样保留并逐条复核：既有 provenance hash 校验及经 src/bxp/index barrel export 间接导入、但 compiler 不调用的历史 Gold loader 配置；新候选语义模块没有 corpus/答案/offset/hash 决策开关。12 个候选构式的 runtime file access guard 记录 0 次 read，实际无 Gold/comparator 读取。反过拟合审计 PASS 是该明确范围的扫描与检查结果，不是通用准确率证明。

5593 个旧资产逐字节核验，Gold/Source/v0.3/010 overlay/旧封存/原 runtime/模型职责与阈值/Pack/生产入口均未写入；既有脏工作保留。17 个全量 SKIP 不计 PASS。没有 merge/release/tag，没有启动后续阶段。

ADMIN 下一步需要先裁定新的 R1 实现与历史 eligibility 字节 pin 的合同冲突；本轮不会自行废除这个断言。随后是否允许恢复 R1–R4，由 ADMIN 决定。

## 追加的实际语义阻断（不可算作改善）

最终只读复核确认：SWAI-007 中位于验收段的显式 commit 依据，其 V 条目原被 010 审阅为 UNLISTED_SOURCE_SUPPORTED（来源支持，但不能代替要求中的其它版本依据），新 R1 接受域 blanket guard 将该 BASELINE 判为 ACCEPTANCE_CRITERION_NOT_EXECUTION 并抑制。验收域不是执行动作，并不能推出其中的明确依据无效。这是 R1 的作用域类别与 fact role 判定仍未正确区分的程序性缺陷。完整 before Canonical/Fact、原文局部精确 spans 和 after arbitration 位于 SOURCE-FLOOR-REGRESSION.json。

因此只能说既有 expected MATCH 无损失，不能声称所有原文支持语义均无退化。这条 V 的移除不计作改善；R1 除了历史字节 pin 失败，还有这一明确语义 blocker。旧实现未覆盖、未回滚，生产入口未切换。ADMIN 不能仅废除 byte pin 就认定 R1 关闭；后续需授权一般 fact-role/owner 兼容性修复和独立验收域 basis 构式验证。本执行仍按失败 Gate 边界停在 R1，不进入 R2–R4。
