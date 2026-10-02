# 7P-REPAIR-005 — Embedded Predicate & Candidate Graph Recall Closure

本 revision 依据冻结 v0.3 规范与 7P-REPAIR-005 任务书，继承冻结 004，增加 candidate-recall.mjs。在 Edge Closure 前显式生成嵌套谓词、控制框架、多论元候选与并列集合，并保留强类型字面量优先级。Eligibility、QI–QB、模型、阈值、Pack 和 BXP 保持原字节。

新增候选必须有 SRL、依存、POS 或控制构式证据；候选 EVENT 不等于获准边界动作。引号、依据、元数据、修饰语、条件、数量目标与完成上下文保留隔离。控制主体不唯一、显式数量不一致及不受合同支持的析取保持未决。

004 Edge Closure 仅增加新 operand-set 元数据的兼容消费入口，复用原 bind、所有权、模态与类型检查；原正负例保留。engine 输出候选阶段快照。export 仅修复本 revision 的导出分支和空节兼容，不参与语义推断。

实际结果与硬门槛见 docs/reports/7plus1/7P-REPAIR-005/REPORT.md；测试通过不表示语义验收通过。旧 README 为继承说明。本轮入口为 engine.mjs 的 parse7Plus1；未替换生产入口或现有 58618 服务。
