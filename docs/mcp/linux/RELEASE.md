# BoundaryXP Linux 0.4.0-rc.9-linux.1

> 当前 Linux 版本为 **rc.11-linux.1 / B348**，见 [rc.11 验收](../RC11.md)、[发行回执](../RC11-PUBLICATION.json)及 [Glama rc.11](../GLAMA-RC11.md)。本文以下保留首次 rc.9 Linux 发行的历史记录。
> Current Linux release: **rc.11-linux.1 / B348**. The records below describe the first rc.9 Linux release, not the current package.

[中文安装](INSTALL.zh-CN.md) · [English setup](INSTALL.en.md) · [npm](https://www.npmjs.com/package/boundaryxp-mcp/v/0.4.0-rc.9-linux.1)

Linux x64 / glibc ≥2.36 / Node.js ≥22.18.0，B-335 计算合同，21 工具、17 资源。首次独立 Linux 预发行采用 `linux` npm 渠道，保留 Windows `latest/next` 为 rc.9。Dockerfile 从 npm 下载固定版本并核验 SHA-256，以非 root 用户运行；默认 stdio、不开放主机端口。

This Linux prerelease contains the compiled native Core, adapters, UI, resources and license notices. Original Core C++/JavaScript source, private build tools, credentials, customer data and private Git history are excluded. No separately hosted business service or additional workbench installation is required.

安装包 SHA-256 / package SHA-256:

```text
4f2c1127eb77047881a4886cd421dd5968cd039e9f9e35a6a0abe1da10293fb6
```

Core SHA-256:

```text
def7859641e6ff7ebf436ea542e822a8fa890faf9e28bd9ce19f2e4e20b0fc3e
```

## 验证 / Validation

- Linux 原生差分：计算器 682/682、任务模型 104/104、宿主合同 25/25；JSON 解析 18/18。
- Node 22.18.0 最低版本实际加载与计算通过，主要验收使用 Node 24.19.0。
- Docker 完整案例逐项调用 21 工具，列出 17 资源；当前宿主 LLM 形成分析后，由原生 Core 计算三项查询，报告和复验一致。服务器端额外模型请求为 0，不代表宿主 LLM 未参与。
- 中英 L2/L3 格式、导入、校验、版本绑定、引用、页面和历史保留通过。安装、同候选重装与回滚保留测试任务、字典及配置。
- 候选镜像 8 层与安装包范围检查未发现原 Core 源码。正式包与已验收候选只改变发行元数据和安装说明，原生二进制及运行代码字节一致。
- 初轮软件模拟环境回归发生超时，相关项随后串行重跑通过；依赖旧 Windows 跨版本夹具的跳过项未计为 Linux 通过。不声称 ARM64、musl、跨 OS 迁移或强制终止容器后的锁恢复已验收。

候选中的字典交付回执改为 `INLINE_FROZEN_SNAPSHOT`，与实际冻结字典及校验器一致；Docker 使用显式 foreground 后台生命周期，正常停止后可重连；更新检查拒绝不兼容 OS/CPU。未改变 B-335 的 Core 计算算法。

## 发布后核对 / Post-publication checks

- npm 公开 tgz 已匿名下载，SHA-256 / SHA-512 与正式归档一致；GitHub 五项发行附件逐项下载比对通过。
- Linux 全新目录按公开说明通过 npx 安装：21 工具、17 资源，字典格式及能力可读，工作台 HTTP 200。
- 公开 Dockerfile 实际构建和默认 stdio 启动通过，非 root、无主机端口映射，21 工具 / 17 资源；最终镜像全部 8 层、286 个应用文件审计未发现原始 Core 源码。
- Glama 实际构建 `01a1e3ab-bf33-7cd8-9dbc-a536b14fffb7` 成功，发现 21 工具和 17 资源；2026-11-16 17:26（UTC+8）Linux 版本显示 Published。[公开页](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP) 已有工具目录、Deploy 与 Try in Browser 入口。未购买或启动付费托管实例。

Glama's platform build and MCP tool/resource discovery passed, and the Linux release is published. This does not certify algorithmic or business conclusions. See [directory status](../DISCOVERY.md). Existing Windows installations and task data are not changed by publishing this Linux package.
