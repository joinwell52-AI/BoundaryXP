# BoundX 结果与建议 / Results and advice

当前主流程：生产者生成 BXP IR → 本地验证与确定性计算 → 宿主或责任人处理。This is not automatic approval or execution.

| 状态 / State | 建议 / Advice |
|---|---|
| validation=invalid | 核对原始 JSON、Schema、精度、版本和证据；不要把结果当作合法任务 / Repair input before interpretation |
| absent | 补充原文依据或明确缺失项；不能自动补齐 / Supply evidence; no invented default |
| unresolved | 明确歧义、主体、条件、范围或候选解释 / Clarify ambiguity and scope |
| completeness=incomplete | 对照 applied_profile 与 deficit，由责任人补充 / Review requirements against deficits |
| consistency=inconsistent | 查看贡献约束及反例，修改原文和 IR 后重算 / Inspect conflicting constraints and recalculate |
| consistency=undetermined | 查看未决作用域、身份或不支持项；不当作无冲突 / Resolve unknowns; do not assume consistency |
| complete / consistent | 只描述已提交对象，不证明抽取正确、现实安全或允许执行 / Not extraction certification or permission |

B 是独立禁止边界，不并入 A 或 R。原文、来源 ID 和 Unicode 码点证据均需保留；不能通过删除禁止项或改版本号隐藏冲突。

两项授权字段始终 null。Host systems and responsible people decide clarification, approval, business blocking and execution outside BXP. Findings do not implement a workflow.

主 UI 使用中英并列提示、原始三轴与完整机器结果。旧规则提示仅在已弃用 `/legacy`，不能覆盖主结果。BXP-EXTRACT 尚未启用。

[界面指南](UI-GUIDE.md) · [生产者指南](AGENT-BXP-PRODUCER.md) · [产品功能](FUNCTIONS.md)
