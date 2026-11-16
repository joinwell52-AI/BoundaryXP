# Cursor Marketplace 接入 / Marketplace setup

本仓库的 `.cursor-plugin/plugin.json` 和 `mcp.json` 是现有 BoundaryXP MCP 的插件入口。市场审核与 npm 发行分别进行；是否已经上架以[收录状态](DISCOVERY.md)和 Cursor 实际页面为准。

This plugin wraps the existing npm-distributed MCP. Marketplace approval is separate from npm publication. It does not expose original Core implementation source or turn the product into a hosted service.

## 使用前准备 / Requirements

1. Windows x64、Node.js ≥22.18（含 npm）；当前不支持 macOS/Linux 原生包。
2. 选择固定的本地任务目录，例如 `C:/BXP/data`。已有用户保持原目录，不覆盖任务或配置。
3. 默认由当前宿主 LLM 分析，再通过 MCP 提交给原生计算器复核。不需要额外模型 API Key 或 profiles 文件。可选的服务端 API 模式见[安装指南](npm/INSTALL.zh-CN.md)。

## 安装与配置 / Install and configure

市场收录后，在 Cursor 的 Customize 中搜索 BoundaryXP，安装插件，在配置中设置：

| 字段 | 填写内容 |
|---|---|
| `BXP_DATA_ROOT` | 固定的任务数据目录绝对路径 |

当前宿主模式不需填写密钥。首次启动由 npx 下载固定版本的公开 npm 包；插件缓存目录不用于保存任务。使用可选 API 模式时，按安装指南另行配置，勿将密钥提交到仓库或任务文本。

Set a persistent absolute data directory. The current host LLM performs analysis through MCP prepare/complete; no additional API key or profiles file is needed. A separately configured model API remains optional.

连接后发送：“只通过 BoundaryXP MCP 调用 bx_capabilities 和 bx_workbench_open，返回版本与工作台地址，不提交分析。”应发现 21 个工具。插件服务名称可能带 Cursor 的 `plugin-` 前缀。

市场批准前可按[普通 MCP 安装指南](INSTALL.zh-CN.md)使用产品；不要为了测试重复连接同一数据目录的不同版本。

## 更新 / Updates

此插件清单固定 npm 版本。已有 rc.8 数据升级至 rc.9 时，先按[升级指南](npm/INSTALL.zh-CN.md#升级)使用 rc.9 安装器完成数据复制迁移，不要只改版本号后让新运行时直接使用旧数据目录。作业完成并断开旧连接后再迁移和重新连接；原任务与数据副本保留。需要 BoundaryXP 自己的自动检查、安全切换和回滚时，使用[管理安装方式](npm/INSTALL.md)及[自动升级指南](npm/AUTO-UPDATE.md)，不要同时添加重复入口。

The manifest pins the npm version. Plugin updates and BoundaryXP managed automatic updates are different mechanisms. Preserve existing profiles and data, finish jobs before reconnecting, and avoid duplicate server entries.

官方流程：[Cursor 插件说明](https://cursor.com/docs/plugins) · [插件清单与审核要求](https://cursor.com/docs/reference/plugins) · [提交入口](https://cursor.com/marketplace/publish)。
