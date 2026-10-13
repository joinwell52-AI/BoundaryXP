# 1.4 → 2.0 候选迁移

不自动改写历史 IR，不把过去的 GAP 改成 PASS，不替换当前 Skill 或 skill1。

新合同要求 root_task 和 sequences，NUMBER 改为精确字符串。新增事件选择器、操作／多值角色投影、按发生计数、普通／完整收件和活动区间构造。Schema 与审阅 Schema 由 src/bxp/ir-kernel/contract-registry.mjs 导出，能力条件见 LANGUAGE-CAPABILITIES.json。

现有计算、视图、摘要、事件和输入检查入口对 2.0 调用同一 Core。旧 1.4 路线保留显式版本兼容：它尚未整体迁移到新求解 profile；历史回放成绩属于旧接口兼容，不能冒充所有旧 IR 已由新内核完整计算。

`runKernel` 是新内核的完整异步入口。旧同步 calculateDirectIR 的 2.0 分支只执行 EVALUATE，不能把它当作异步 SAT 接口。finishDirectIR 的 2.0 分支返回 Promise，调用方必须 await；原引擎已调整。

未来模型接口适配仅需将解析和审阅资源绑定到同一 2.0 合同、Schema 和能力表；新生成的有界序列必须独立审阅 sequence 字段。不能只改版本字符串、把空 GROUP 变成所有人、把部分收件升级完整收件，或从预算反推封闭事件域。

本任务未发出新的解析、审阅或修订模型请求。未验证 2.0 下真实模型的保真性；当前运行包和两个 Skill 的活动版本保持原样。此候选不应直接覆盖 58618。
