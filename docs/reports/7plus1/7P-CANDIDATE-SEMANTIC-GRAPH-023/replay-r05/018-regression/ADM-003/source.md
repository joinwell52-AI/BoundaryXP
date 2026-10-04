OPS 读取 mcp-config.json，检查已启用 MCP 工具的访问权限；PM 负责协调本次审计。OPS 必须生成 mcp-access.md，并交给 QA 复核。不得调用被审计的工具，也不得改动 mcp-config.json。

**审阅重点：** 工具是被审计对象，不是调用授权；配置只读与禁止调用分别保留。