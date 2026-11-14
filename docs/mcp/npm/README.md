# BoundaryXP MCP · BXP

通用本地 MCP 服务，支持标准 stdio 宿主、18 个工具、10 项资源和中英内置帮助。浏览器工作台与 MCP 读取同一份数据。无需 exe，无需自建服务器。

Universal local MCP over stdio: 18 tools, 10 resources, bilingual built-in help and a loopback workbench sharing the same saved projects. No hosted business server or executable installer is required.

**`boundaryxp-mcp@0.4.0-rc.3` · B-335 · Windows x64 · MIT · next预发行渠道。** 核心已原生编译，包内不交付原始Core源码。测试使用Node 24.19.0，包要求Node >=22.18.0。The native package uses B-335 calculation contracts. Original Core source is excluded. Adapter and core versions are independent. Other operating systems have not been accepted; the separate 58618 workbench is never upgraded by this installer.

## npm安装 / Install from npm

首次安装在PowerShell中执行；`BoundaryXP`目录应为新目录，已有安装看[升级说明](INSTALL.md)。需要Node和npm，不需要编译器或额外安装58618。

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.3 bxp install --home $BxpHome --version 0.4.0-rc.3
if ($LASTEXITCODE -ne 0) { throw 'Installation failed' }
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
$BxpConfig = Join-Path $BxpRoot 'workspace\.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData
```

在Cursor打开`$BxpRoot/workspace`，启用BoundaryXP，看到18工具后说：“调用bx_capabilities和bx_workbench_open，返回版本和页面地址，不提交分析。”Open that workspace in Cursor, enable BoundaryXP, then ask for capabilities and the workbench URL without analysis. Codex等stdio宿主使用`node <绝对路径>/launcher.mjs --data-root <绝对数据路径>`；完整配置见[安装说明](INSTALL.md)。

只读与打开页面无需API；新分析需要自己的API/profile，不自动使用宿主聊天订阅。Read-only tools need no model key. Analysis requires your configured API/profile. 查看[中文及英文完整指南](guides/README.md)和[双语工具说明](guides/TOOLS.md)。

自动检查、后台准备和下次安全启动自动生效见 [自动更新](AUTO-UPDATE.md)。可信发行源需显式配置，默认关闭；运行中的任务不中断。 See [automatic updates](AUTO-UPDATE.md) for opt-in checks, preparation and activation without interrupting running tasks.

开发者从私有源码仓库的 `mcp/README.md` 和 `mcp/NATIVE-BUILD.md` 开始，这两份开发文档不属于客户安装包。此目录单独 `npm ci` 不会生成原生运行包；客户使用经过审核的完整安装包。源码仓库包含 C++ 实现，产品安装包不包含该源码。Cursor、Codex 或其他支持标准 stdio MCP 的宿主使用同一服务入口，宿主界面验收分别记录。

客户取得一个 npm `.tgz`，其中同时包含 MCP、浏览器工作台和 C++20 编译的 Node-API 核心，不需要另装 58618，也不需要开发者提供服务器。包内不包含 C++ 源码或原 JavaScript Core 实现；宿主适配器、页面代码、公开协议和字典仍是可读文件。二进制分发不保证无法逆向。本候选不采用 V8 字节码或 JavaScript 核心回退。

One package includes the MCP host, local workbench and native Node-API core. The original JavaScript Core and C++ sources are excluded; adapter/UI code and public resources remain readable. Native distribution is not a guarantee against reverse engineering. Unsupported platforms fail explicitly; there is no source fallback.

Node.js >=22.18.0 with npm is required. See [installation / 安装升级](INSTALL.md), [release preparation / 发布准备](RELEASING.md), [contract](CONTRACT.md), and [changes](CHANGELOG.md).

## In any MCP host / 对话使用

- “用 BoundaryXP 查看中文工具帮助和使用案例。” / “Read BoundaryXP tool help and examples in English.”
- `bx_capabilities({"language":"zh-CN","help_topic":"tools"})` or `language:"en"`.
- Resources: `boundaryxp://help/{zh-CN|en}/{overview|tools|examples|troubleshooting}`.
- “预览这份多 DEV 任务，核对任务编号和父任务编号；确认后保存并分析一次，失败不自动重试，打开工作台。”
- “List saved BoundaryXP projects and open the selected project without rerunning analysis.”

Only explicit analysis submission invokes the configured model; the server does not inherit the host chat model. Credentials stay in environment variables or an explicitly supplied env file. L2/L3 dictionary identity and source evidence remain attached. Program verification is not proof of semantic extraction or execution authorization.

Multiple stdio clients with identical version, runtime, profiles and provider environment share one backend per data directory. Closing one client leaves others working. Closing the last client shuts down the backend and cancels unfinished work; closing only the browser does not. Reopen the workbench using `bx_workbench_open` after reconnecting; never hardcode its random port. A browser alone is not a persistent service host.

不同版本或配置同时打开同一数据目录会明确拒绝连接；等任务结束后重连全部相关宿主。不会抢占数据、杀死旧进程或静默换配置。
