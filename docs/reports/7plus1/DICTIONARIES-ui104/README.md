# ui104：修复模型端字典工具调度

五组真实对照试验的 ui103 前三次运行揭示：MCP 能发现 lookup 不等于模型可调用它。gpt-6.1-sol 的本地模型目录声明 tool_mode=code_mode_only，provider 却关闭 code_mode_host；运行回执出现“Code Mode is unavailable because code-mode host is disabled”，模型明确报告 lookup 不可调用，实际查询数为零。

ui104 仅在选中字典时启用现有 Codex 自带的 code-mode 调度器。Shell、浏览器、其他工具仍关闭；MCP 仍限定本次所选快照与唯一只读 lookup；其他工具活动仍保留并拒绝。未启用字典的调用参数不变，生成和审阅 Skill、字典资源字节不变。

12 项无模型回归及实际 Codex MCP 发现检查通过。真正的模型查词效果由后续真实对照记录给出，不以此检查预填通过。ui103 三次运行保留为接线诊断，不能当作语义库效果试验。

官方配置参考：https://learn.chatgpt.com/docs/config-file/config-reference 。本故障的直接证据来自本地模型目录与本次真实回执，而不是根据文档推定模型成功调用工具。
