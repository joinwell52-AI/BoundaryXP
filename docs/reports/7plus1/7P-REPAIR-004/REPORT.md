# 7P-REPAIR-004 — 实施诊断交付

**未达到任务书验收门槛。** 四类 Edge Closure 已实现并冻结，测试和原资产完整性检查通过，但真实 10 份重放的最终语义没有改善：A/I/O 进展门槛均 FAIL。首处分歧 NOT_CLOSED，STANDARD_PARSED=0/9，PRODUCTION_READY=false。本交付不得称为 004 验收完成。

开始前完整阅读 CURRENT-TASK、004 任务书、v0.3 方法文档、003 报告/首处分歧/根因及最终源码。实际起点 9b5ab06b50bb939ba73a54823f9bca6b05a2bc8a 是任务指定起点的后继，前一语义基线为 1594ab9a4de1b66a19678c7d2b66eca63afaf66a。

## 实现和范围

新增独立 edge-closure.mjs；通过已有 coreference 模块筛选唯一产物，隔离依据，保留分区对象与显式续接。新增边和拒绝边均保存身份、精确 span、结构路径、候选和原因。没有新规范关系类型，没有改 QI–QB。现有 58618 与生产入口未切换；旧封存、Source、Gold、BXP、v0.3 方法、模型、Pack、阈值原字节不变。工作区其他既有改动不纳入提交。

## 实测测试

- 新机制及沿用兼容断言：293 pass / 0 fail。
- 原有 Parser 回归：739 pass / 0 fail。
- 全量 node 回归：4303 tests，4286 pass，0 fail，17 skipped。跳过项不计 PASS。
- Gold 数据完整性验证：PASS；这不是语义验收。
- 35 个 non-Gold 输入保存实际 NLP 信号、完整 Trace 和重复确定性检查；7 个已知上游覆盖缺口原样报告。机制断言通过不等于这 35 条全部语义通过。
- 3651 个既有文件和 2825 个依赖/模型指纹复核；详见 VERIFY.json。

## 真实重放和导出错误

REF-001 加 9 个正式 SWAI，共 10 份；SWAI-005 按 ACTIVE 审定排除。实际调用新 engine 的 parse7Plus1，BGE/E5/NLI 均实际加载，完整输入输出在各 trace.json。REF-001 全部语义断言 PASS，“上述材料”真实歧义保留。

首次批处理 RUNS.json 为 10 条 FAILED，错误发生在 Parser 返回并保存 trace.json 后的 Markdown 导出。不能将它改写为首次成功。PARSER-RUNS.json 单独记录已成功解析的原始快照及导出失败；replay/*/ERROR.json 保留错误。报告辅助脚本直接从这些原始 Trace 导出 Canonical 和 Markdown，未重跑或改写解析结果。冻结 runtime/export.mjs 的 revision guard 缺陷仍 FAIL，见 EXPORT-INCIDENT.json。

## 逐项语义结果

| Slot | MATCH | MISSING | FALSE_DEFINED | WRONG_BINDING | WRONG_STATUS |
| --- | ---: | ---: | ---: | ---: | ---: |
| I | 7 | 42 | 3 | 2 | 9 |
| O | 5 | 44 | 1 | 2 | 9 |
| A | 6 | 50 | 2 | 2 | 9 |
| P | 9 | 3 | 0 | 0 | 9 |
| R | 1 | 0 | 0 | 0 | 9 |
| V | 12 | 19 | 0 | 0 | 9 |
| C | 19 | 4 | 0 | 0 | 9 |
| B | 14 | 28 | 0 | 6 | 9 |

OUTPUT_CONTENT：MATCH=3、MISSING=17。PARTIAL_SUPPORT 不计 MATCH。相对 003-r03 上表所有计数不变。所有现有 Canonical 条目、Fact、Scope/Condition/Quantity 表达式逐项深比较完全一致，才复用原人工审阅映射；证据在 UNCHANGED-ENTRY-EVIDENCE.json 和 COMPARISON.json。没有用测试数量推导准确率。

失败硬门槛：A_IMPROVEMENT、I_IMPROVEMENT、O_IMPROVEMENT。要求 A≥7 或 missing≤48，实际 6/50；I≥8 或 missing≤40，实际 7/42；O≥6 或 missing≤42，实际 5/44。其余既有无回退门槛见 REQUIRED-CHECKS.json。

## 首处分歧与产物

SWAI-001 [402,440) 原片段仍缺完整嵌套动作、双路径对象及 writer 上下文关系。局部新诊断不等于闭合；FIRST-DIVERGENCE.json 保留 exact spans、实际节点/边、当前未决和独立 non-Gold 构式证据。

完整审计：EDGE-RESOLUTION-AUDIT、CONTINUATION、FANOUT、COREFERENCE、BASIS-SHIELD、TABLE-PROMOTION、GRAPH-QUERY-RESULTS、COVERAGE-LOCALITY、NON-GOLD-MECHANISM-RESULTS、PERFORMANCE。TESTS.json 对应本次实际日志，IMPLEMENTATION-FROZEN.json 对应最终冻结文件，MANIFEST/SHA256SUMS/SEAL 为交付完整性封存，**不是验收通过证明**。

STATUS=WAITING_ADMIN_REVIEW。仅推送 review/7plus1-parser；不 merge、release、tag，不替换生产运行时。
