# Codex 社区插件候选版安装

[English](PLUGIN-MARKETPLACE.en.md) · [返回 MCP 安装指南](INSTALL.zh-CN.md)

**候选插件 0.1.0 · MCP 0.4.0-rc.9 · Windows x64 · Node.js ≥22.19（含 npm）**

[OpenAI Community Plugins PR #57](https://github.com/openai/community-plugins/pull/57)已正式待审核，尚未合并，也未获批进入 OpenAI 公共插件目录。下面安装的是发布者 fork 中可检查的候选插件，不是官方已审核插件。普通 MCP 安装仍可直接走 [npm](https://www.npmjs.com/package/boundaryxp-mcp#中文安装与升级)。

## 添加市场并安装

在 Codex 的「插件」→「添加」→「添加插件市场」填写：

| 字段 | 内容 |
|---|---|
| 来源 | `joinwell52-AI/community-plugins` |
| Git 引用 | `codex/boundaryxp-plugin-20261116` |
| 稀疏路径 | 留空，使用完整仓库 |

随后从这个市场安装 **BoundaryXP · 界痕**。不要填 `joinwell52-AI/BoundaryXP`，那是产品资料仓库，没有此插件市场清单。

实际验证过的命令行等价入口：

```text
codex plugin marketplace add joinwell52-AI/community-plugins --ref codex/boundaryxp-plugin-20261116
codex plugin add boundaryxp@community-plugins
```

在新聊天中发送：

> 只通过 BoundaryXP MCP，调用 bx_capabilities 查看中文工具帮助，再调用 bx_profiles_list 和 bx_workbench_open。返回实际版本和工作台地址，不提交分析，不修改已有任务。

首次连接会从 npm 安装锁定的 rc.9 编译包，需联网；日志只写到 stderr，最多为首次启动预留 300 秒。后续复用本机安装。预期返回 rc.9、21 个工具、17 项资源和独立本地工作台地址。模型来自当前宿主，不需要另配模型 API Key。

## 数据和版本

默认数据位于 `%LOCALAPPDATA%/BoundaryXP/CommunityPlugin`，与普通 MCP 安装的数据目录分开。可用 `BXP_PLUGIN_HOME` 指向专用空目录；已有的无关非空目录会被拒绝。不会自动迁移其他安装的任务、字典或配置。请保留这个目录，卸载插件缓存不应删除任务数据。

插件锁定 rc.9，不自动切换核心。它启动本机原生编译包，不上传原始 Core 源码，不安装独立工作台产品，不接管 58618。已有 MCP 安装不需要为了使用 rc.9 改用这个候选插件。

## 验证与限制

2026-11-16 在独立 Codex 配置和数据目录中，实际从上述 GitHub 来源添加市场、安装插件、读回启用状态，并调用安装后副本的 MCP 成功，返回 rc.9 / 21 工具。另有 7 项专项测试通过，覆盖中英文帮助、四份 L2/L3 格式示例、校验与导入、多 DEV 保存、工作台 HTTP 和重连数据保留。没有重新调用付费模型或伪造 LLM 响应；不称为本轮图形界面点击验收或语义准确率测试。

社区全市场测试在 Grafana 套件失败；已在不含 BXP 的上游版本复现相同 Windows 失败，Grafana 不是 BXP 依赖，客户无需安装。BXP 在 Node 22.19 和 24.19 均为 7/7 通过。PR 仍需维护者审核、处理适用平台 Gate 和贡献者本人 CLA；可选工作流仅供手动运行，本次未执行。macOS/Linux 不属于该原生包支持范围。

[候选插件完整中文说明](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/plugins/boundaryxp/README.zh-CN.md) · [目录状态](DISCOVERY.md#rc9-contributions)
