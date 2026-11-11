# BoundaryXP MCP 内部测试安装说明

[English](INSTALL.en.md) · [导航](README.md) · [升级与排障](OPERATIONS.md)

## 1. 需要准备什么

- Windows x64；本轮实际验收使用 Node.js **24.19.0**，包声明最低 Node **22.18.0**。其他 Node 版本、macOS、Linux 尚不在本轮实测范围。
- 可用的 Node.js、npm 和一个标准 stdio MCP 宿主，例如 Cursor 或 Codex。首次下载依赖需要网络；不需要 npm 发布账号。
- 私有测试 Release 中的 `.tgz` 与 `SHA256SUMS.txt`。无需 exe、编译器、自建服务器，也无需另装 58618。
- 只查看工具、打开页面、读取已有结果不需要模型 API。**提交新分析需要另外配置 API**，不会自动使用 Cursor/Codex 的聊天订阅。

PowerShell 中先检查：

```powershell
node --version
npm.cmd --version
(Get-Command node).Source
```

以下命令在同一 PowerShell 窗口运行。变量是本次安装路径，不要把开发机器上的旧端口、PID 或路径复制过来。

## 2. 下载和校验

打开私有仓库的 Releases，选择 `mcp-v0.4.0-rc.2` 测试草稿（须有访问权限），下载 **Assets** 内的安装包和指南。不要下载自动生成的 Source code 压缩包来安装。

假设 `.tgz` 放在自己的“下载”目录；如果位置不同，只改 `$BxpPackage`。本例使用自己的用户目录，不要求管理员权限：

```powershell
$BxpPackage = Join-Path $HOME 'Downloads\boundaryxp-mcp-0.4.0-rc.2.tgz'
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP-rc2'
$BxpSha = '6b84a460956fb942ec19e662ceee4353f589de2ed6bc1f3b7ec6f5303f867c63'
if ((Get-FileHash -LiteralPath $BxpPackage -Algorithm SHA256).Hash.ToLowerInvariant() -ne $BxpSha) { throw 'Package checksum mismatch' }
```

摘要应与本次 Release 的 `SHA256SUMS.txt` 一致。以后换包时必须同时换文件名和对应摘要。校验失败停止安装。

## 3. 首次安装

目录分工：`bootstrap` 是安装器，`install` 是可升级程序，`data` 保存任务，`settings` 保存模型配置，`workspace` 是独立测试工作区。它们互不包含，不要把数据放进程序安装目录或 58618 的数据目录。

如果已经安装过，直接看[升级](OPERATIONS.md)，不要清空目录或重复执行首次安装。

```powershell
$BxpBootstrap = Join-Path $BxpRoot 'bootstrap'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path -LiteralPath (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use the upgrade guide' }
npm.cmd install --prefix $BxpBootstrap --ignore-scripts --no-audit --no-fund $BxpPackage
if ($LASTEXITCODE -ne 0) { throw 'Bootstrap installation failed' }
$BxpCli = Join-Path $BxpBootstrap 'node_modules\@boundaryxp\mcp\cli.mjs'
node $BxpCli install --home $BxpHome --package $BxpPackage --sha256 $BxpSha
if ($LASTEXITCODE -ne 0) { throw 'Managed installation failed' }
```

完成标志是 JSON 返回 `status: READY`、`version: 0.4.0-rc.2`、`probe.passed: true`。首次安装依赖可能需要数分钟。不要把安静等待误判为完成；以命令返回为准。

创建空模型配置，先验收只读功能。以下命令仅在文件不存在时创建，不覆盖已有设置；UTF-8 不带 BOM，避免 JSON 读取失败：

```powershell
New-Item -ItemType Directory -Path $BxpSettings -Force | Out-Null
$BxpProfiles = Join-Path $BxpSettings 'profiles.json'
$BxpEnv = Join-Path $BxpSettings '.env'
$BxpUtf8 = New-Object System.Text.UTF8Encoding($false)
if (!(Test-Path -LiteralPath $BxpProfiles)) { [IO.File]::WriteAllText($BxpProfiles, '{"profiles":[]}', $BxpUtf8) }
if (!(Test-Path -LiteralPath $BxpEnv)) { [IO.File]::WriteAllText($BxpEnv, "# Local API configuration`n", $BxpUtf8) }
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
node $BxpLauncher --manage status
```

## 4. 在 Cursor 接入

首次测试建议打开一个独立空文件夹，不使用正在测试 58618 的工程。下面生成独立工作区的配置：

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

在 Cursor 中打开 `$BxpWorkspace` 指向的文件夹，到 MCP 设置启用 **BoundaryXP**。看到 **18 tools** 后，在 Agent 聊天发送：

> 只通过 BoundaryXP MCP 调用 bx_capabilities、bx_profiles_list 和 bx_workbench_open，返回实际 adapter_version、installation_update 和工作台地址；不使用终端代替，不提交分析。

应返回 `0.4.0-rc.2`、更新模式 `off` 和 `http://127.0.0.1:随机端口/`。`browser_opened:false` 表示由宿主或自己打开链接，不是启动失败。页面可在普通浏览器或宿主内置浏览器打开。

这一步只首次设置需要终端；日常可以在聊天说“用 BXP 打开工作台”。无需输入固定端口或反复运行启动命令。

若已有 BoundaryXP 配置，安装器不会替换其数据、profiles 或 env 参数。只更新已有入口时运行 `configure --config <现有配置绝对路径>`，不要再附加 `--data-root/--profiles/--env-file`。需要改配置位置时先备份并明确选择；不要删除其他 MCP 条目。

## 5. 在 Codex 或其他宿主接入

Codex CLI 使用同一个 Node、启动器和数据路径。先运行 `codex mcp list`；已有同名条目时检查其用途，不直接覆盖。首次添加：

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

在 Codex 中开始新会话并发送上面的只读口令。Desktop 宿主需要让其 MCP 配置生效；不要把 JSON 配置文件直接交给 TOML 配置合并器。

其他标准 stdio 宿主填入相同的可执行文件和参数；不是把工作台 HTTP 地址作为 MCP 服务 URL。JSON 示例中的路径需替换为自己的**绝对路径**，Windows 路径可用 `/`：

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": [
        "--env-file=C:/BXP/settings/.env",
        "C:/BXP/install/launcher.mjs",
        "--data-root", "C:/BXP/data",
        "--profiles", "C:/BXP/settings/profiles.json"
      ]
    }
  }
}
```

Cursor 和 Codex 已有实际宿主调用验收；其他宿主满足协议并不等于已逐一完成产品界面验收。

## 6. 配置 AI 后再分析

用文本编辑器保存 `settings/profiles.json` 和 `settings/.env`（UTF-8 不带 BOM）。密钥放 `.env`，不要贴到任务正文、聊天或 Git 仓库。两种配置任选其一，也可按不同 id 保留多个 profile。

**Cursor API**：这与“用 Cursor 软件聊天”不是同一件事，需要有效的 `CURSOR_API_KEY` 及相应模型权限。

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

```dotenv
CURSOR_API_KEY=REPLACE_WITH_YOUR_KEY
```

**通用 OpenAI 兼容 API**：使用服务商提供的 Chat Completions 兼容地址和真实模型 ID。下面是占位符，不是可用服务：

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

保存后等当前作业结束，断开并重连使用这套数据的全部 MCP 客户端。说“调用 bx_profiles_list，检查模型配置”。`configured:true` 是本地配置检查，不证明服务商额度、网络或模型权限都可用；真实分析才会访问提供商。

## 7. 用一个案例测试完整流程

打开 [examples/multi-dev.md](examples/multi-dev.md)，把**整篇**文本交给宿主，先说：

> 用 BXP 预览这份完整任务文本，使用我的已配置 profile。没有指定字典时用空选择；返回父子关系。必须保留 DEV-01、DEV-02 两个节点，不能按相同 DEV 角色合并。暂不保存、不分析。

核对结果后说：

> 将刚才确认的任务保存为一个新项目，返回项目 ID 和 revision。对这一版本提交一次分析，查询到完成或失败为止。失败不自动重试。完成后读取正式结果、LLM 独立判断和计算器复验，打开对应工作台。

模型分析可能产生服务商费用。工具提交返回 `job_id` 只是开始；只有作业完成并取得 `result_revision` 后才能读取正式结果。失败记录保留，不能把原始模型草稿当成正式结果。

再说“对保存结果做一次零模型复验，保留旧结果”，应创建新快照，不重新请求 LLM。同一角色支持多个任务；`PM → DEV（1/14）` 的数字是角色序号，不替代任务编号、父任务编号或执行顺序。

**使用完成：** 关闭浏览器不会停止 MCP；最后一个 MCP 客户端断开后，本地页面服务退出，未完成作业会被取消。先等任务完成再关闭宿主。重新连接后用 `bx_workbench_open` 获取新地址，原项目仍在 `data` 中。
