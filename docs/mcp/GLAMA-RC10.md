# Glama rc.10 验证 / Glama rc.10 verification

2026-11-18，Glama 使用公开 npm 编译包完成构建、启动与 MCP 工具/资源发现，并发布对应平台版本。未提交原始 Core 源码，未购买托管实例，未操作本机任务、配置或 58618。

On November 18, 2026, Glama built and started the published compiled npm package and completed MCP tool/resource discovery. This is platform startup/introspection evidence, not semantic or algorithmic certification. No original Core source or customer data was uploaded.

| Item / 项目 | Observed value / 实际值 |
|---|---|
| Public listing / 公开页 | [BoundaryXP on Glama](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP) |
| npm package / 安装包 | `boundaryxp-mcp@0.4.0-rc.10-linux.1` |
| Glama release ID / 平台发行标记 | `0.4.0-rc.linux.10.1` — same npm archive / 同一 npm 安装包 |
| Product / 产品 | B-345; runtime `0.1.0-candidate.031-r1.2-ui.345` |
| Build / 构建 | `01a1ec2d-28be-7008-922a-73f25393c56d`, `success`, 1m 6.4s |
| Public repository commit / 固定公开提交 | `70100da17ee768668e27339d697e517818562520` |
| Actual startup / 实际启动 | adapter `0.4.0-rc.10-linux.1`, READY |
| Discovery / 发现 | 21 tools / 17 resources |
| Platform environment / 平台环境 | Debian bookworm, Node 24.22.3, mcp-proxy 6.9.0 |
| Published / 发布 | 2026-11-18 09:05 UTC+8; marked Latest / 标为 Latest |
| Archive SHA-256 / 包摘要 | `b878bd9ae366c79c9f9d8ced12241274f6163351f0cecf56f3efa31f26b96dbe` |

管理者可查看[构建日志](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP/admin/dockerfile/tests/01a1ec2d-28be-7008-922a-73f25393c56d)及[发行列表](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP/admin/releases)。这些管理链接需要登录；客户使用上方公开页、[npm Linux 包](https://www.npmjs.com/package/boundaryxp-mcp/v/0.4.0-rc.10-linux.1)和[安装指南](linux/INSTALL.en.md)。

Admin build/release pages require maintainer login. Customers can use the public listing, npm package and installation guide without admin access. Windows continues to use `0.4.0-rc.10` on `latest/next`; Linux uses the `linux` channel. This directory release does not change an existing customer's installed version or data.

## 为什么平台标记不同？ / Why the different platform ID?

Glama 拒绝原样发布 `0.4.0-rc.10-linux.1`，提示必须大于旧版 `0.4.0-rc.9-linux.1`。[SemVer 11.4](https://semver.org/#spec-item-11) 将含字母或连字符的 `9-linux`、`10-linux` 按文本排序，因此 `10-linux` 排在 `9-linux` 前面。

只将 Glama 的发行标记改为 `0.4.0-rc.linux.10.1`，将平台、候选序号与打包序号分开；发行说明明确映射到 npm `0.4.0-rc.10-linux.1`。npm 版本、摘要、安装命令和包内容未改；旧 rc.9 平台发行及其验证记录保留。

Glama requires monotonically increasing SemVer release IDs. The earlier hyphenated `9-linux` identifier sorts lexically after `10-linux`. The new Glama-only ID separates the platform and numeric release counters; it maps explicitly to the unchanged npm archive. This does not rename the npm package, declare a stable release, or overwrite the historical rc.9 evidence.

Automatic Glama releases from GitHub remain disabled because Windows and Linux use separate package channels. Core source remains private; the public Dockerfile installs compiled Core plus readable adapter/UI/resources.
