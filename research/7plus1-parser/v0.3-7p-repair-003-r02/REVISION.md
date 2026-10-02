# 7P-REPAIR-003 r02

本 revision 依据 v0.3 规范与 7P-REPAIR-003 任务书实现 Candidate Graph 闭合，继承 002-r03 的前端、模型和语义包配置。

新增 graph-closure.mjs 与 graph-queries.mjs；组合身份、局部论元、NO_CHANGE、输出内容子图先进入候选语义结构，再经过既有 Eligibility / Boundary IR。PART_OF 以带精确来源的 composition_provenance 表示。QI–QB 只消费确定结构。

首个 003 候选保留；r02 纠正限定对象被扩成整个父文件，以及破折号前独立限定语混入不变目标的问题。独立限定语保持未决。

正式运行、逐项语义审阅和局限见 docs/reports/7plus1/7P-REPAIR-003/REPORT.md。旧 README 为继承说明，当前权威入口为本目录 engine.mjs 的 parse7Plus1；未替换现有 58618 服务。
