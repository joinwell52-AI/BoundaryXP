# Glama rc.11 verification · 2026-11-18

**已通过构建和协议发现，并发布为 Latest。Build/discovery passed; release published as Latest.**

| Item | Verified value |
|---|---|
| Public entry | [BoundaryXP on Glama](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP) |
| npm package | `boundaryxp-mcp@0.4.0-rc.11-linux.1` |
| Glama release ID | `0.4.0-rc.linux.11.1` |
| Build ID | `01a1ee23-92dc-7dec-840e-7951364174c7` |
| Pinned public commit | `624f9c0321834f14f5f8684d4bf1e18d6f9ab763` |
| Status / duration | `success` / 1m 1.1s |
| Published | 2026-11-18 18:13 UTC+8 |
| Discovery | 21 tools / 17 resources |
| Archive SHA-256 | `6ee48baa7cd45cc273dccef9326167dfbe9cffa15872f72e0bc4a08ce530b94b` |

构建只下载固定 npm 编译包，核对 SHA-256，安装锁定依赖后启动真实原生 MCP；没有上传 Core 原始源码。B348 提供同次分析的完整双语报告、模型连接验证和证据折叠；原生算法不变。平台标记用于正确的预发行版本排序，npm 安装版本仍为 `0.4.0-rc.11-linux.1`，不可互换。

The build downloads the immutable compiled npm archive, checks its SHA-256, installs locked dependencies and starts the real native MCP. No original Core source was uploaded. The separate Glama identifier preserves prerelease ordering; it does not rename the npm version.

这是启动与工具/资源发现验证，不是算法正确性或语义准确率认证，也没有购买或启动付费托管实例。此前 [rc.10](GLAMA-RC10.md) 验证仍保留。完整产品与案例验证见 [rc.11 验收](RC11.md)。

This is startup/introspection evidence, not semantic or algorithmic certification. No paid hosting instance was purchased. Earlier dated evidence remains intact.
