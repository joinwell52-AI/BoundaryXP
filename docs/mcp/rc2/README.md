# BoundaryXP MCP · 内部测试交付 / Internal test delivery

**0.4.0-rc.2 / B-335 / Windows x64 / 2026-11-11**

产品仓库 `joinwell52-AI/BoundaryXP` 当前保持私有；这里提供内部测试说明和编译安装包。私有源码另存 `boundaryxp-code`。当前不发布 npm，不公开仓库，不升级独立的 58618。

The product repository remains private. This delivery is for internal testing; no public npm release or visibility change is performed. The separate 58618 installation is not required or modified.

| 入口 / Guide | 内容 / Contents |
|---|---|
| [中文安装与使用](INSTALL.zh-CN.md) | 下载、首次安装、Cursor/Codex、API 配置、任务示例 |
| [English installation](INSTALL.en.md) | Download, installation, hosts, API profiles and first task |
| [升级、回滚与排障 / Recovery](OPERATIONS.md) | 保留任务、版本切换、自动更新边界、错误处理 |
| [18 个工具 / Tool reference](TOOLS.md) | 工具用途、常用聊天口令与读写范围 |
| [版本与验收 / Release acceptance](RELEASE.md) | 固定包摘要、支持范围、验收与待公开事项 |
| [资料与第三方说明 / Notices](NOTICES.md) | 分发内容、依赖许可及内部测试范围 |
| [多 DEV 示例 / Multi-DEV example](examples/multi-dev.md) | 一个父任务、两个独立 DEV；不是已计算结果 |

## 附件 / Assets

- `boundaryxp-mcp-0.4.0-rc.2.tgz`：完整运行包 / complete runtime package。
- `BoundaryXP-MCP-0.4.0-rc.2-guides.zip`：本套中英文指南和示例 / these guides and examples。
- `SHA256SUMS.txt`：附件校验摘要 / asset checksums。
- `DEPENDENCIES.json`、`THIRD-PARTY-NOTICES.md`：依赖及第三方说明 / dependency inventory and notices。
- `ACCEPTANCE.json`：不含任务原文和机器路径的验收摘要 / sanitized acceptance summary。

请下载 Release 的 **Assets** 附件；GitHub 自动生成的 **Source code (zip/tar.gz)** 是资料仓库快照，不是 MCP 安装包。Release 若标记 Draft，仅有相应权限的内部维护者可访问；附件尚未可见时向维护者索取，不尝试 npm 包名下载。

Download **Assets**, not GitHub's automatic **Source code** archives. A draft release is visible only to authorized maintainers. This guide does not imply that a draft has been published or that an npm package exists.

安装包内原有简要说明保留原字节。本次补充指南作为独立附件维护，安装命令及测试范围以本目录与对应 Release 为准；没有因文档更新重新编译核心或改写已验收 tgz。
