# 7P-COMPOSITION-012 — R1 fact-role compatibility diagnostic

TASK=7P-COMPOSITION-012
TERMINAL_OUTCOME=R1_SEMANTIC_GATE_FAILED
STATUS=WAITING_ADMIN_REVIEW
PRODUCTION_READY=false

本轮先完成 ADMIN 的旧字节锁裁定：仅退休 eligibility.mjs 对 006 的 byte equality，保留 graph queries、projection、relations 原字节，旧测试和 001–011 封存不改。当前活动副本以身份聚合、成员/调用声明、未受影响 Eligibility/IR/Canonical/Proof 等价及 repeat、禁止语料开关等语义断言替代。此裁定不算 Parser PASS。

独立候选 research/7plus1-parser/v0.3-7p-composition-012/ 从封存 011 克隆，生产入口未切换。原文中的验收域和候选 fact role 分开判断，明确 BASIS、完成条件、显式约束可以保留；验收谓词不因此成为执行 A，文件提及不自动成为 I/O。OUTPUT_CONTENT 与 BACKGROUND/CODE/EXAMPLE 门控不开放。显式负模态候选仍要求依存/SRL 和本语法层证据，括号解释不继承外层禁止。

## R1 不能关闭

SWAI-007 显式 commit BASELINE 已原样恢复，并仍受 C5 人工审阅阻断；这不是新增 expected MATCH。已确认的括号“抓”和 narrative“到”两处错误仍被阻止。

但新准入的 SWAI-008 禁止项把“任何这些文件”作为 RESOLVED ENTITY/ITEM，没有先行集合绑定，错误 RESOLVED 已独立逐链复核并列为 WRONG_BINDING。另外恢复了历史 SWAI-004 的禁止项，而它仍缺 dry-run 条件范围。相对 011 中间候选，这两项均增加误绑定；相对正式 010 基线，前者是 1 项新 soundness regression，后者是重新暴露的既有错误。本轮不将它们隐藏、计为改善或修改 Gold。任务 §8 要求语义 floor 无退化、wrong binding 最多 5，目前为 7，因此 R1=FAIL，R2–R4 未开始。

完整根因链与码点证据见 FIRST-DIVERGENCE.json、SOURCE-FLOOR-REGRESSION.json 和 NEW-ACTUAL-REVIEW-r1-sealed.json。owner/fact-role license 并不能代替完整 scope/condition certification。Contract Gate 的 ID、类型、引用和 provenance 通过，也不能证明指代集合或 dry-run 条件语义正确。

## 实测

|检查|结果|
|---|---|
|R1 frozen non-Gold|25 PASS / 0 FAIL（原 12 + 新 13）|
|专项 / replacement compatibility|59 PASS / 0 FAIL|
|001–008 迁移回归|518 PASS / 0 FAIL|
|原 Parser 回归|739 PASS / 0 FAIL|
|仓库全量|5939 PASS / 0 FAIL / 17 SKIP|
|9 STANDARD 重放|9/9 实际 compiler 完成，类型和合同 Gate PASS|
|R1 semantic Gate|FAIL|
|R2 / R3 / R4|NOT_STARTED_R1_SEMANTIC_GATE_FAILED|

首次新构式 5 个失败、中间 1 个失败、首次专项 57/2（fixture 缺 node_id）及所有更正结果均保留。测试原文、mechanism expected 未在 STANDARD 后改动。unit fixture 的 node_id 更正并不修改 expected；全量 worker 实际加载的是更正后的测试，日志逐项记录其通过，另有更正后专项独立重跑。错误的旧 focused 命令只运行了 011 的 19 项，其真实结果也保留，不冒充 012。

## 冻结合同比较

|指标|010 before|012 after|
|---|---:|---:|
|I / O / A MATCH components|7 / 7 / 9|7 / 7 / 9|
|CASE_IOA_JOINT|0/9|0/9|
|STANDARD_PARSED|0/9|0/9|
|root false-defined|9|8|
|root wrong-binding|11|7|
|slot status mismatches|72|72|
|owned-content missing|22/25|22/25|
|新增错误 RESOLVED scope|0|1|

9 案 per-case I/O/A 及全槽矩阵均交付。旧 MATCH 无损失，但 joint 仍 0/9，不能宣称任务语义成功。未变的结果严格复核 Canonical/Fact/Relation/来源节点完全一致后复用 010 审阅并重验完整 root/aggregate/content/proof；唯一新事实先独立审阅，不用显示字符串或部分叶子补答案，未增加 Gold 或 MATCH credit。

## 模型、性能与完整性

共冻结 33 个非 Gold 输入；原 20 个真实 NLP signals 原样复用，新 13 个实际调用 HanLP/spaCy。R2–R4 的 8 个输入未验收。STANDARD 重放使用 008-r03 原文及真实冻结 NLP signals，实际重新编译 graph → Eligibility → IR → Canonical → Proof；BGE/E5/NLI 未重新执行，不声称新的模型验证。

受控性能采用与 011 相同的正式 010/008 before 基线、单进程交替顺序、每案 1 对 warmup + 3 对测量，只计 deterministic compiler。各案 median 总和 39376.38 → 38710.92 ms（-1.69%）；concern=false。不是端到端模型延迟。

反过拟合静态 import-closure 与运行期读取检查通过其明确范围：新运行模块无样例 ID/commit/offset/hash/expected/comparator 决策开关，25 个构式 runtime 0 文件读取；宽匹配的旧 barrel loader/provenance flags 完整保留复核。6020 个旧 tracked 资产原字节保持，预先存在的脏工作保留。Gold/Source/v0.3/010 overlay/模型/阈值/Pack/关系空间/查询/投影/生产入口不改。没有 merge/release/tag。

完成 R1 失败诊断封存后等待 ADMIN。没有四阶段完成证据，不宣称 SYSTEMIC_REPAIR_INSUFFICIENT、Hybrid 必要性或 v0.3 方法限制。
