# 7P-REPAIR-006 — ADMIN 审阅交付

本轮已实现独立 Frame Certification 并完成冻结重放。任务书门槛核对为 **PASS**，仍需 ADMIN 审阅确认。STANDARD_PARSED=0/9，PRODUCTION_READY=false；没有宣称 Parser 已整体正确。

## 范围与实现

分支 review/7plus1-parser，基线 790e100cfba29db17d3219428b6692904336766f，是任务书指定 005 commit 的后继。已完整阅读 CURRENT-TASK、006 任务书、冻结 v0.3 方法及 005 诊断；其中被引用的 005/ROOT-CAUSES.md 不存在，已明确记录，未补写旧封存。实际核查冻结 REPORT、FIRST-DIVERGENCE、ACTION-FRAME-AUDIT 和源码。

- 新增 frame-certification.mjs：位于 Candidate Recall / Edge Closure 后、Eligibility 前。唯一控制上下文、所属域、上层动作、目标、模态、条件冲突先校验，再生成现有规范类型的关系。
- 主修改动作拥有受控行为、上下文及论元集合；controller/support 保留节点、精确来源、结构路径及 AUXILIARY 决策，阻止独立 A 泄漏。技术对象不冒充 P，也不因期望 O 而变成 RESULT。
- 新增 technical-instructions.mjs：有界显式调用语法，完整保留 callee、参数和路径组合；调用所在符号具有同一工件修改前/更新后身份。正文声明通过明确拥有的代码块识别唯一声明符号。测试插入保留 EACH × 每文件一个和例子代码归属。代码体不执行，也不成为当前任务动作。
- Eligibility 只增加受认证 SUBORDINATE 的 AUXILIARY 消费分支；其余旧规则保留。语义冲突或代码归属断裂保留未决。被覆盖的通用候选关系保留为 REJECTED 并记录仲裁理由。
- 未改 QI–QB、投影、规范关系类型、Gold、Source、BXP、v0.3、模型、阈值或 Pack。Candidate Recall/Edge Closure 原字节不变；现有生产入口、CLI/UI 和 58618 未切换。

## 实测与审计

25 个预声明非 Gold 原文由真实 HanLP/spaCy 产生信号；32 项新增语义/冲突断言与 320 项迁移旧机制断言合计 **352/352**。原 Parser 回归 **739/739**。最终全量回归 **4958 pass / 0 fail / 17 skipped**，共 4975 条；skipped 未执行，不能计 PASS。历史 Gold 数据完整性检查通过，不等于当前语义验收。

全量回归首轮出现 1 项历史 NLP worker 异常退出，状态码 3221225477（0xC0000005）；当时正式重放并行运行。没有证据确认具体崩溃原因。完整保留首轮 TESTS-first-attempt.json/full-regression.log，待正式重放退出后不改任何实现再完整运行，最终结果见 TESTS.json 和 REGRESSION-INCIDENT.json。

10/10 正式模型重放完成，REF-001=PASS。BGE-M3、E5、NLI 实际加载证据见 RUNS/PERFORMANCE；未将相似度当成语义裁决。35 个输入使用同一已保存 NLP 信号复算认证、IR 投影与 Canonical 完全一致；这是确定性编译核验，不冒称独立模型重复运行测试。

## 逐项语义对比

仅在实现冻结之后读取 ACTIVE r02 人工标准进行离线审阅。旧判断仅在 Canonical、事实和附加表达式相同后复用；每个变化的 RESOLVED 单独审核。完整 10 份 Trace 和实际 7+1 位于 replay/。SWAI-005 继续沿用审定 manifest 的分母排除，未改其状态。

| 槽位 | MATCH 前→后 | MISSING 前→后 | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS | PARTIAL_SUPPORT |
|---|---:|---:|---:|---:|---:|---:|
| I | 7 → 8 | 42 → 41 | 3 | 2 | 9 | 15 |
| O | 5 → 6 | 44 → 43 | 1 | 2 | 9 | 12 |
| A | 6 → 7 | 50 → 49 | 2 | 2 | 9 | 13 |
| P | 9 → 9 | 3 → 3 | 0 | 0 | 9 | 0 |
| R | 1 → 1 | 0 → 0 | 0 | 0 | 9 | 0 |
| V | 12 → 12 | 19 → 19 | 0 | 0 | 9 | 4 |
| C | 19 → 19 | 4 → 4 | 0 | 0 | 9 | 0 |
| B | 14 → 14 | 28 → 28 | 0 | 6 | 9 | 1 |

新增完整匹配为 SWAI-001 的 helper 交付 O0、新增 helper 动作 A0，以及三个对应测试文件 I2。I2 由同一认证框架的三个 TASK_OBJECT 与显式 UNION/EACH 成员共同证明，按一个人工条目计一次；每个文件单项仍是部分支持，不能任选其中一个算完整匹配。ledger 保存 required_actual_ids 和共同结构见证，比较脚本要求所有成员存在。未更改人工 expected 或评审分母。

三项 writer 调用保留完整参数、路径组合和更新身份，但尚未建立调用到声明行为的唯一绑定，因此不计完整 union-scan A/O MATCH。三测试文件及 EACH 一个测试已存在，但代码示例里的断言意义和命名要求没有完整类型化，也不计完整测试交付或动作。PARTIAL_SUPPORT 与 MISSING 分别保留。OUTPUT_CONTENT=3/20。

## 首处剩余偏离

005 的 [402,440) 控制认证缺口已闭合：next_seq 是上下文对象，计算/看组成主“修”动作的行为，controller 和嵌入谓词不再作为独立 A。首处分歧按编译依赖层推进到 **跨指令工件身份与行为组合**：三个方法仍是一个聚合字符串目标，单独调用尚未与该集合成员和 helper 声明行为闭合。完整证据、决策、事实及剩余缺失关系见 FIRST-DIVERGENCE.json。局部缺口关闭不表示整个案例闭环；runtime first unresolved 也不是语义 first divergence。

## 封存与停止

IMPLEMENTATION-FROZEN 固定 88 个文件；4099 个此前文件、旧封存和 2825 个依赖摘要已复核。全部必需审计、测试、实际结果、MANIFEST、SHA256SUMS 和 SEAL 一并交付。只推送 review/7plus1-parser，不 merge/release/tag，不切换生产运行时。STATUS=WAITING_ADMIN_REVIEW。
