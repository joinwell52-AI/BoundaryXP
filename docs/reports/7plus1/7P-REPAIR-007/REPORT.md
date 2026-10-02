# 7P-REPAIR-007 — 身份闭合候选与语义验收

本轮任务**未完成语义验收：SEMANTIC_GATE_NOT_MET**。同一样本 I/O/A 联合完整匹配 **0/9 → 0/9**；STANDARD_PARSED **0/9 → 0/9**。没有首个 joint MATCH，因此不存在可交付的首个 joint MATCH 形成证明；身份机制认证不能替代该证明。 PRODUCTION_READY=false。

## 授权与实现

完整读取 007 任务书、v0.3 规范、006 封存报告、诊断、对比和真实 Trace/实现。分支 review/7plus1-parser，从 e35fb21667c4f13d743863d21cd4a570a97a38af（006 后继）开始；任务书和指针由 ADMIN 远端提交取得，没有自行重设计任务。

新增 cross-instruction-identity.mjs，位于 Frame Certification 后、Eligibility 前。已有解析动作、单一显式文件、backtick 枚举的符号成员建立稳定的 owner+symbol 身份；成员集合产生 ITEM→UNION，动作对象关系与作用域一致。原始聚合 mention 保留 provenance，成员不再只有一串文字。更新前/后保持同一工件身份。

已认证调用仅在兼容任务根、符号、文件上下文及候选唯一时链接集合成员与声明；同名不同文件、竞争成员或等权声明保持未决。COREFERENCE 和已有 CONJUNCTION/PATIENT 是原合同关系；不新增规范关系。成员行为按 member ID 分别记录主修改、调用、声明、参数表达式和双方原文/路径，禁止一条调用复制给多个成员。

当前结构支持独立一级任务标题隔离、显式文件标题限定及唯一候选；没有按文本距离绑定。未覆盖的非 backtick 集合、无唯一文件或条件依赖集合保持原前端状态。绑定声明证明的是身份与明确调用；代码体仍是 owned content，不执行、不从函数名猜枚举语义。实验副本 engine 与导出版本标记为 007；其余 006 模块字节保留。QI–QB、Eligibility、投影、模型、阈值、Pack、Gold/Source、BXP/v0.3 方法及生产入口/58618 不变。

## 实际验证

41 个预声明非 Gold 原文由真实 NLP 收集；17 项新身份断言、352 项保留机制断言及 16 项新增输入上的旧 Frame 断言合计 **385/385**。原 Parser 回归 739/739。全量 **5343 pass / 0 fail / 17 skipped**，skipped 不是 PASS。

开发期失败回执与后续磁盘日志保留，见 DEVELOPMENT-INCIDENTS.json。首次 scope 断言运行未重定向完整 TAP，仅工具回执与计数/原因摘要保留，不能宣称完整磁盘日志已保存；后续日志未覆盖。修复未决类型与导出标签等问题后冻结。冻结后 10/10 原文模型重放，REF-001=PASS，BGE/E5/NLI 实际加载见 RUNS/PERFORMANCE。51 份保存信号复算的身份层、IR、Canonical 一致；这是确定性编译核验。此外 SWAI-001 已独立重新执行真实 HanLP/spaCy 与模型解析；两轮 semantic_nodes、relations、Eligibility、BoundaryIR、Canonical、ProofDAG 和身份认证一致，见 REAL-REPEAT-DETERMINISM.json。

## 三个不同指标

下表分数仅是该槽已完整匹配的人工条目数/必需条目数，boolean 才表示槽位完全匹配。完整账本及逐项阻断在 CASE-IOA-JOINT-BASELINE/AFTER/DIFF；没有修改比较器、分母或 expected。

| STANDARD | I 条目 | O 条目 | A 条目 | I complete | O complete | A complete | Joint |
|---|---:|---:|---:|---|---|---|---|
| SWAI-001 | 2/3 | 1/3 | 1/5 | false | false | false | false |
| SWAI-002 | 0/4 | 0/9 | 0/6 | false | false | false | false |
| SWAI-003 | 0/6 | 0/8 | 0/6 | false | false | false | false |
| SWAI-004 | 0/5 | 0/5 | 0/7 | false | false | false | false |
| SWAI-006 | 0/2 | 0/4 | 0/6 | false | false | false | false |
| SWAI-007 | 0/7 | 0/1 | 1/5 | false | false | false | false |
| SWAI-008 | 6/10 | 1/5 | 1/5 | false | false | false | false |
| SWAI-009 | 0/6 | 2/6 | 2/8 | false | false | false | false |
| SWAI-010 | 0/6 | 2/8 | 2/8 | false | false | false | false |

全语料语义条目数量如下，不是案例通过率：

| 槽 | MATCH 前→后 | MISSING | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS | PARTIAL_SUPPORT |
|---|---:|---:|---:|---:|---:|---:|
| I | 8 → 8 | 41 | 3 | 2 | 9 | 15 |
| O | 6 → 6 | 43 | 1 | 2 | 9 | 12 |
| A | 7 → 7 | 49 | 2 | 2 | 9 | 13 |
| P | 9 → 9 | 3 | 0 | 0 | 9 | 0 |
| R | 1 → 1 | 0 | 0 | 0 | 9 | 0 |
| V | 12 → 12 | 19 | 0 | 0 | 9 | 4 |
| C | 19 → 19 | 4 | 0 | 0 | 9 | 0 |
| B | 14 → 14 | 28 | 0 | 6 | 9 | 1 |

仅在冻结重放后离线审阅 expected。Canonical、事实和表达式原样的条目才复用 006 判断；变化的 RESOLVED 独立复核。SWAI-001 的聚合 O/A 因增加成员关系有新事实 ID，但仍为 PARTIAL_SUPPORT，没有因为身份认证就改判完整扫描行为。未决、缺失、错误 resolved 分别保留。

## 首处分歧与未达门槛

006 的三个成员身份以及调用到声明缺口已认证闭合：SWAI-001 有 3 个成员、3 条成员连续性、3 条调用→声明和 3 条成员行为组合，全部含精确来源、文件拥有者及结构路径。完整链在四份身份/绑定/组合审计与 FIRST-DIVERGENCE 中。

下一处首要依赖缺口为 **DECLARED_BEHAVIOR_SEMANTICS_AND_ARGUMENT_INSTANTIATION**：冻结前端尚未把 helper 文件名枚举行为及形参—实际目录的对应转换成可证明的语义图。三个调用虽绑定 helper 身份，仍不能自动等同于相应 active/archived 文件集合并集扫描。测试的断言语义与命名要求也未完整类型化。不能按答案补槽，不能执行任务代码来推断边界；超出本轮身份机制的授权由 ADMIN 决定。

因此 CASE_IOA_JOINT_INCREASE=false，**SEMANTIC_GATE_NOT_MET_NOT_COMPLETE**。专项/合同/全量测试即使通过，也不允许声明 007 已完成。此交付封存的是诊断候选；46396 个原文件和旧封存不变，冻结 107 个实现/测试/输入文件。

## 停止

只推送 review/7plus1-parser，未 merge/release/tag、未切换生产入口。MANIFEST/SHA256SUMS/SEAL 固定候选与首次重放；完整 structured Trace 与实际 7+1 位于 replay/。停止，STATUS=WAITING_ADMIN_REVIEW。
