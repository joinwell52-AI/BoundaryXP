# BoundaryXP MCP · BXP

**boundaryxp-mcp 0.4.0-rc.5 / B-335 — 7+1任务边界分析与计算复核**

通用stdio MCP，18个工具、本地浏览器工作台、L2/L3资源、完整父子任务与多个同角色子任务。安装包包含原生编译Core，不需另装58618；适配器、UI及资源仍可读取。LLM独立分析，Core程序复验；两者的结论与证据分别保留，不授予业务或执行权限。

A standard stdio MCP with 18 tools, a local browser workbench, L2/L3 resources and explicit parent/child task IDs, including multiple DEV tasks. The package includes the native Core. New analysis requires a configured model API; host subscriptions are not automatically inherited. No separate 58618 installation or hosted BoundaryXP service is needed.

- [中文安装与接入](mcp/INSTALL.zh-CN.md) · [English installation](mcp/INSTALL.en.md)
- [18个工具 / Tool reference](mcp/TOOLS.md)
- [升级、回滚与排障 / Operations](mcp/OPERATIONS.md)
- [版本、支持范围和验收 / Release evidence](mcp/RELEASE.md)
- [许可与分发范围 / Distribution notices](mcp/NOTICES.md)

包已发布到[npm](https://www.npmjs.com/package/boundaryxp-mcp)，安装说明和匹配附件同步到[产品Releases](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.5)。见[7+1产品介绍](mcp/npm/README.md)和[目录状态](mcp/DISCOVERY.md)。产品GitHub仓库现已公开；核心实现源码仍私有。The complete npm package includes compiled Core; original Core source is excluded.
