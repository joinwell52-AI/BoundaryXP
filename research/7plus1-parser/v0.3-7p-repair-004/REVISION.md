# 7P-REPAIR-004 — Deterministic Edge Closure

本 revision 依据 v0.3 规范与 7P-REPAIR-004 任务书，继承冻结 003-r03，实现独立的 edge-closure.mjs。候选图闭合后、Eligibility 之前执行；不改 QI–QB、模型、阈值、Pack 或 BXP。

四类机制为：显式续接、受所有权约束的共享补语、通过既有 coreference 模块复用唯一产物，以及依据隔离。source-semantics 仅补充依据前置修饰语不应遮蔽已有 dependency-root 谓词的候选产生。未知嵌套谓词端点不能用补边或同义词猜测代替。

每条新增或拒绝的边带独立 audit、端点、关系类型、精确来源和结构路径。独占对象保持分区；多个先行词保持未决。开发探针发现的上游覆盖缺口单独报告，测试通过不表示长文本语义验收通过。

实际结果和硬门槛见 docs/reports/7plus1/7P-REPAIR-004/REPORT.md。旧 README 为继承说明；本轮入口是 engine.mjs 的 parse7Plus1，candidateGraph 与 closeEdges 可独立测试。未替换生产入口或现有 58618 服务。
