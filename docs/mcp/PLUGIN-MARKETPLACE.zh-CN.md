# Codex 社区插件候选版安装

[English](PLUGIN-MARKETPLACE.en.md) · [返回 MCP 安装指南](INSTALL.zh-CN.md)

**候选插件 0.4.0 · MCP rc.11 / B348 · Windows / Linux x64 · Node.js ≥22.19（含 npm）**

Windows 锁定 MCP `0.4.0-rc.11`；Linux 锁定 `0.4.0-rc.11-linux.1`，要求 glibc ≥2.36，例如 Debian 12、Ubuntu 24.04。不支持 macOS、ARM64、Alpine/musl。完整 L2/L3 目录导入见 [B348 格式指南](npm/guides/DICTIONARIES.zh-CN.md)。

[OpenAI Community Plugins PR #57](https://github.com/openai/community-plugins/pull/57)已正式待审核，尚未合并，也未获批进入 OpenAI 公共插件目录。下面安装的是发布者 fork 中可检查的候选插件，不是官方已审核插件。普通 MCP 安装仍可直接走 [npm](https://www.npmjs.com/package/boundaryxp-mcp#中文安装与升级)。

## 添加市场并安装

在 Codex 的「插件」→「添加」→「添加插件市场」填写：

| 字段 | 内容 |
|---|---|
| 来源 | `joinwell52-AI/community-plugins` |
| Git 引用 | `codex/boundaryxp-plugin-20261116` |
| 稀疏路径 | `.agents/plugins` 与 `plugins`，每项一行；也可留空使用完整仓库 |

随后从这个市场安装 **BoundaryXP · 界痕**。不要填 `joinwell52-AI/BoundaryXP`，那是产品资料仓库，没有此插件市场清单。

实际验证过的命令行等价入口：

```text
codex plugin marketplace add joinwell52-AI/community-plugins --ref codex/boundaryxp-plugin-20261116
codex plugin add boundaryxp@community-plugins
```

在新聊天中发送：

> 只通过 BoundaryXP MCP，调用 bx_capabilities 查看中文工具帮助，再调用 bx_profiles_list 和 bx_workbench_open。返回实际版本和工作台地址，不提交分析，不修改已有任务。

首次连接会从 npm 安装对应平台的锁定编译包，需联网；日志只写到 stderr，最多为首次启动预留 300 秒。后续复用本机安装。预期返回 Windows rc.11 或 Linux rc.11-linux.1、21 个工具、17 项资源和独立本地工作台地址。模型来自当前宿主，不需要另配模型 API Key。

## 数据和版本

Windows 数据路径仍为 `%LOCALAPPDATA%/BoundaryXP/CommunityPlugin`；Linux 使用 `$XDG_DATA_HOME/BoundaryXP/CommunityPlugin`，未设 XDG 时为 `$HOME/.local/share/BoundaryXP/CommunityPlugin`。均与普通 MCP 安装的数据目录分开。可用 `BXP_PLUGIN_HOME` 指向专用空目录；已有的无关非空目录会被拒绝。不会自动迁移其他安装的任务、字典或配置。请保留这个目录，卸载插件缓存不应删除任务数据。

插件按平台锁定版本，不跟随 npm 浮动标签。升级前关闭旧插件连接；0.4.0 首次连接将本插件已停止使用的 `data-rc10`（仅在 rc.10 不存在时选择 `data-rc9`） 复制到 `data-rc11`，校验文件摘要并保留原目录、配置和迁移回执。旧进程活动或目标目录不完整时拒绝启动，不杀进程、不删除数据。退回旧插件只能读取旧快照，不包含升级后的新增工作。`--install-only` 只下载、不迁移。未验收跨操作系统搬迁，不扫描或接管其他安装、58618；普通 MCP 用户无需改用此候选插件。

## 验证与限制

当前 **0.4.0 / rc.11**：四组 Windows/Linux × Node 22.19/24.19 各 9/9 通过；两平台完整案例回放保留 revision 7、复验新增 revision 8，中英文报告和计算一致，服务端新增模型请求为 0。使用同一保存宿主响应，不称为新增模型分析。隔离迁移检查保留 61 个原文件，旧数据不删除。[本轮证据](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/evidence/rc11-20261118.json)。插件 PR 尚未合并；下方保留此前各版本验收范围。


历史 **0.3.0 / rc.10**：Windows/Linux x64 × Node 22.19/24.19 各 **9/9 通过、无跳过**，完整字典示例、真实 npm/native 工具、工作台和重连保留通过。真实 rc.9 测试副本升级后原任务、配置、字典字节保留，复制后的审计日志仅追加。Linux 旧报告读取及保存响应重放、复验通过，不称为新一轮模型分析。全新隔离 Linux Codex 从本地市场安装启用 0.3.0，安装后副本实际返回 rc.10-linux.1 / 21 工具 / 17 资源。[当前证据](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/evidence/rc10-plugin-20261117.json)。以下保留旧版验收记录。

历史 Windows 0.1.0 验收：2026-11-16 在独立 Codex 配置和数据目录中，实际从上述 GitHub 来源添加市场、安装插件、读回启用状态，并调用安装后副本的 MCP 成功，返回 rc.9 / 21 工具。另有 7 项专项测试通过，覆盖中英文帮助、四份 L2/L3 格式示例、校验与导入、多 DEV 保存、工作台 HTTP 和重连数据保留。没有重新调用付费模型或伪造 LLM 响应；不称为本轮图形界面点击验收或语义准确率测试。

**2026-11-17 新验收：**插件 **0.2.0** 在 Windows、Linux 的 Node 22.19.0 / 24.19.0 四种组合均为 **9/9 通过、无跳过**。全新 Linux Codex 配置从上述 GitHub 分支安装并实际调用了插件副本；当前宿主完成分析案例，21 工具、3 项原生计算、七步及技术报告、零模型复验、历史与字典保留均通过。[证据和准确范围](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/README.md)。不宣称 Linux 桌面图形界面点击验收或任意输入的语义准确率。

此前社区全市场测试在 Grafana 套件失败；已在不含 BXP 的上游版本复现相同 Windows 失败，Grafana 不是 BXP 依赖，客户无需安装。BXP 在 Node 22.19 和 24.19 均为 7/7 通过。贡献者已本人签署 CLA，[CLA 检查](https://github.com/openai/community-plugins/actions/runs/43818468947/job/133139843169)于 2026-11-16 通过；PR 仍需维护者审核、处理适用平台 Gate；可选工作流仅供手动运行，本次未执行。macOS、ARM64、musl 仍不支持；Linux x64/glibc ≥2.36 现已由候选插件封装支持。

[候选插件完整中文说明](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/plugins/boundaryxp/README.zh-CN.md) · [目录状态](DISCOVERY.md#rc9-contributions)
