# BXP 0.4实现状态

规范：BXP-0001 0.4.0-draft.1。产品版本：1.3.0-preview.0。完整实现状态：IN_PROGRESS，尚未完成正式验收。

本页不修改协议语义。规范见[英文](BXP-0001.md)及[中文](BXP-0001.zh-CN.md)。

## 实施要求

- CLI、MCP、UI共用src/bxp唯一Core，版本与Schema共用注册表。
- 冻结task、IR、Formal Model、Boundary Result及Admission的Wire Contract。
- 记录Formalizer、Operator Profile与上下文的版本/摘要。
- 保留未知，确定性求值输出四状态及规范边界对象。
- Admission绑定精确源事实与版本，发布时原子复核；下游检查父边界。
- Core无模型调用、无网络读取、无执行授权。
- 正式指标前冻结Gold和实现；数据完整性不是协议符合性证明。

实现、回归、适配、门禁和最终本地交付依据[v1.2 LOCAL任务书](../docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)。本次文档修订不宣称实现Gate已经通过。
