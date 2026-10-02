# 7P-REPAIR-005 — ADMIN 审阅交付

本轮已实现并封存嵌套谓词与候选图召回机制，但**任务书语义验收仍为 FAIL**。首处分歧由谓词端点缺失推进到控制框架的论元关系闭合，未完全关闭。A_IMPROVEMENT、I_IMPROVEMENT、O_IMPROVEMENT 未达标；不能据机制测试宣称 Parser 修复完成。

## 实现与边界

执行分支 review/7plus1-parser，基线 52646c306e227dd6a8057e9ca65ff8e50fd50403（为任务书指定 6db6b53 的后继，仅新增 005 任务指针/任务书）。完整读取任务书、v0.3 方法及 004 诊断后执行。新增运行目录 research/7plus1-parser/v0.3-7p-repair-005/；没有切换现有生产入口或 58618。

- candidate-recall.mjs 保存 SRL/依存支持的非 root 谓词、受控动作框架、多论元候选、并列成员 Set AST 和精确证据。候选 EVENT 不自动成为 Boundary Fact。
- 控制主体、上层动作、上层目标与嵌套论元分别保留；未知主体、数量冲突与合同无法表达的析取维持 typed unresolved。
- 技术字面量优先于噪声 PERSON/ORG，真实人物不回退。引号、标题、代码、依据、输出正文和目的/完成层继续受结构门控。
- 004 Edge Closure 仅加 operand-set 兼容消费；复用原 bind/所有权/类型/模态检查。Eligibility、QI–QB、projection、coverage、模型和阈值原字节不变。
- export.mjs 修正 005 revision 分支及空节渲染，完整 JSON/Markdown 导出成功；导出前后语义对象不变。

## 实测

冻结实现包含 84 个文件。24 个非 Gold 原文使用真实 HanLP/spaCy 信号，新增 27 条断言和 293 条保留兼容断言合计 320/320；原 Parser 回归 739/739；全量回归 4606/4623，fail=0，另有 17 条 skipped（未执行，不算通过；原因见 SKIPPED-TESTS.json）。历史 Gold 数据完整性验证通过，不等于新方法语义验证。全部开发失败日志保留。

真实模型重放 10/10，REF-001=PASS。每个正式重放实际加载 BGE-M3、E5、NLI，具体模型诊断和耗时见 RUNS/PERFORMANCE。34 个输入的候选、框架与 Canonical 用同一 NLP 信号复算完全一致；这不冒称独立模型重新采样重复性。

## 语义逐项审阅

使用既有 ACTIVE r02 人工审定，只在解析冻结后离线对比。旧判断仅在 Canonical/Fact/表达式逐项相同后复用；新增 RESOLVED 必须有独立 ledger。PARTIAL_SUPPORT 单列，既不计 MATCH，也不掩盖 MISSING。

| 槽位 | MATCH 前→后 | MISSING 前→后 | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS | PARTIAL_SUPPORT |
|---|---:|---:|---:|---:|---:|---:|
| I | 7 → 7 | 42 → 42 | 3 | 2 | 9 | 2 |
| O | 5 → 5 | 44 → 44 | 1 | 2 | 9 | 6 |
| A | 6 → 6 | 50 → 50 | 2 | 2 | 9 | 10 |
| P | 9 → 9 | 3 → 3 | 0 | 0 | 9 | 0 |
| R | 1 → 1 | 0 → 0 | 0 | 0 | 9 | 0 |
| V | 12 → 12 | 19 → 19 | 0 | 0 | 9 | 4 |
| C | 19 → 19 | 4 → 4 | 0 | 0 | 9 | 0 |
| B | 14 → 14 | 28 → 28 | 0 | 6 | 9 | 1 |

OUTPUT_CONTENT=3/20；STANDARD_PARSED=0/9。SWAI-005 沿用审定 manifest 的分母排除，未改样本状态。

SWAI-001 新增两个 I 路径与一个 A 双路径动作均为 PARTIAL_SUPPORT，另有“计算”动作明确 UNRESOLVED。这证明上游端点/集合得以保留，但不等于完整的三个 writer 与目录组合的修改、输入集合或交付。未新增完整 O，I/O/A 硬门槛仍失败。所有实际条目、事实、关系、作用域、证据及判断见 COMPARISON.json。

## 首处剩余偏离

[402,440) 的“计算”“看”及双成员 UNION 已在候选图存在；技术符号 next_seq 保持对象。控制框架保存上下文和上层目标，但“计算”的完整论元仍未形成足够关系，Eligibility 保留 Action target not syntactically established。局部“看 active/archived”未证明三个 writer 各自的目录映射。详见 FIRST-DIVERGENCE.json 中逐层证据；不改 Eligibility/Q 来绕过缺口。

## 交付与封存

关键文件为 IMPLEMENTATION-FROZEN、RUNS、COMPARISON、SLOT-SUMMARY、FAILURES、FIRST-DIVERGENCE、四类机制审计、STAGE-DIVERGENCE-AUDIT、EDGE-CLOSURE-COMPATIBILITY、TESTS、VERIFY、MANIFEST、SHA256SUMS、SEAL。每次正式完整 Trace 位于 replay/<case>/trace.json，包含最终 7+1、所有中间图、候选快照、模型信号和未决项。24 个机制 Trace 位于 non-gold-results/。

此前 3883 个文件、旧 004 SEAL、模型/Pack 等 2825 个依赖摘要均复核。旧封存、Gold、Source、BXP、v0.3 方法不改。PRODUCTION_READY=false。仅推送 review/7plus1-parser；不 merge/release/tag；交付为诊断候选，停止等待 ADMIN Review。

只读确定性审计首轮因内存 undefined 字段与 JSON 省略字段的形状差异退出；审阅工具改为比较双方完整 JSON 表示后通过。Parser 与首次 replay 未改，首轮失败日志保留，见 AUDIT-INCIDENT.json。
