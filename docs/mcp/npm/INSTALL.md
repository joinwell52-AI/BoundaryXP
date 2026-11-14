# 安装、接入和升级 / Installation and upgrades

**boundaryxp-mcp 0.4.0-rc.3 · B-335 · Windows x64 · Node >=22.18.0（实测24.19.0）**

## 首次安装 / First installation

在同一个PowerShell窗口执行。程序、数据和配置分开放置，使用新目录；不要指向58618或旧版MCP的数据。

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use update' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.3 bxp install --home $BxpHome --version 0.4.0-rc.3
if ($LASTEXITCODE -ne 0) { throw 'Installation failed' }
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
New-Item -ItemType Directory -Path $BxpSettings -Force | Out-Null
$BxpProfiles = Join-Path $BxpSettings 'profiles.json'
$BxpEnv = Join-Path $BxpSettings '.env'
$BxpUtf8 = New-Object System.Text.UTF8Encoding($false)
if (!(Test-Path $BxpProfiles)) { [IO.File]::WriteAllText($BxpProfiles, '{"profiles":[]}', $BxpUtf8) }
if (!(Test-Path $BxpEnv)) { [IO.File]::WriteAllText($BxpEnv, "# Model API configuration`n", $BxpUtf8) }
node $BxpLauncher --manage status
```

Wait for `READY`, `probe.passed:true`, and version `0.4.0-rc.3`. Download and integrity checks use the exact package version on npm. Empty profiles allow read-only inspection; no analysis is started. Installation needs internet access for dependencies. No compiler, separate 58618 installation or hosted BoundaryXP server is required.

## Cursor

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

打开这个工作区，在MCP设置启用BoundaryXP。看到18工具后发送：

> 只通过BoundaryXP MCP调用bx_capabilities、bx_profiles_list和bx_workbench_open，返回实际版本与页面地址；不使用终端替代、不提交分析。

Open that workspace in Cursor, enable BoundaryXP, then ask for capabilities, profiles and the workbench URL using native MCP calls only. Open the returned loopback URL in a browser. `browser_opened:false` is not a failure; the host or user opens it. Ports change after reconnection.

已有配置只更新启动入口时运行`configure --config <原配置绝对路径>`，不要附带替换data/profile/env的参数；工具备份并保留其他MCP条目和原参数。

## Codex与其他宿主 / Other hosts

先用`codex mcp list`核对没有需要保留的同名条目；新添加时：

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

Start a new Codex session after registering. Other stdio hosts use the same Node executable and arguments. Replace all example paths with absolute local paths. The browser URL is not a streamable-HTTP MCP endpoint.

```json
{"mcpServers":{"BoundaryXP":{"command":"C:/Program Files/nodejs/node.exe","args":["--env-file=C:/BXP/settings/.env","C:/BXP/install/launcher.mjs","--data-root","C:/BXP/data","--profiles","C:/BXP/settings/profiles.json"]}}}
```

## 配置模型 / Configure the model API

密钥只保存在本机settings/.env，profiles.json不含密钥。使用UTF-8无BOM。新分析需要独立API权限，不继承Cursor/Codex聊天订阅。只读工具不需要API。

Cursor API的profiles.json：

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

.env中填入自己的`CURSOR_API_KEY`。通用Chat Completions兼容服务可使用：

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

Placeholders are not a live API service. After editing settings, finish active work and reconnect all matching clients. `bx_profiles_list` reports local configuration readiness; only a real analysis validates remote credentials, model permission and credit. Analysis may incur provider charges. Do not send keys in task text or chat.

## 第一个案例 / First task

用[中文多DEV示例](examples/multi-dev-2.md)或[English example](examples/multi-dev-2.en.md)的整篇内容，要求`bx_task_import`预览：一个父任务、两个不同DEV编号，不合并相同角色。根节点不填父任务编号。需要14个子任务时参考[14节点格式](examples/multi-dev-14.md)。

Confirm the preview, save it as a new project, submit one analysis for the exact revision and poll the job until completed or failed. Do not retry failures automatically. Read the formal result and distinguish the LLM judgment from Core verification; opening the workbench does not submit another analysis.

失败回执和原响应保留；`job_id`不是完成标志。LLM与计算器分别形成结论，不能把未完成的模型草稿当正式结果。对已保存操作数使用`bx_result_recheck`可零模型复验并保留原结果。[工具和口令](guides/TOOLS.md)。

## 从旧rc.2升级 / Upgrade from private rc.2

旧包名为`@boundaryxp/mcp`。旧更新器不会自行切换到新包名；首次使用新版bootstrap，保持原安装目录及数据配置：

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.3 bxp update --home $BxpHome --version 0.4.0-rc.3
```

先备份数据和配置并等待作业结束，再断开所有相关MCP客户端，升级后重连。不要先删除旧版。rc.2到rc.3运行核心摘要相同，不需要迁移数据；将来不同摘要需显式`--migrate-data <原数据目录>`，复制验证后保留旧目录。只对这套独立MCP操作，不操作58618。

Later updates use `node <home>/launcher.mjs --manage update --version <exact-version>`. Enable optional automatic updates using [AUTO-UPDATE.md](AUTO-UPDATE.md), `next` and `--allow-prerelease`. Defaults remain off.

## 回滚、排障和停用 / Recovery

- `node <home>/launcher.mjs --manage status`检查磁盘版本；聊天`bx_capabilities`检查当前连接版本。
- `node <home>/launcher.mjs --manage doctor`执行隔离MCP/HTTP自检，不分析现有任务。
- 断开客户端后，使用新版bootstrap运行`bxp rollback --home <home>`恢复上一个版本。跨核心迁移产生的新任务仍留在新数据副本，不自动合并。
- `Connecting`或0工具：核对Node绝对路径、MCP输出、JSON编码和安装状态。18工具但聊天找不到时新开Agent聊天。
- `COMPILER_BUSY`：等待已有作业或明确取消，不重复提交。`JOINT_RESPONSE_NOT_JSON`：保留错误与原响应，不能自行改成通过。
- `PROFILE_NOT_FOUND`或API 401/403/429：核对profile、密钥、提供商额度和权限，不自动重试付费分析。
- `BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS`：同一数据的客户端配置/版本不一致，完成作业后统一配置重连。
- 校验或升级失败：保留旧版和失败记录，重新取得可信包，不跳过摘要验证。
- 关闭浏览器不会关闭MCP；最后一个MCP客户端断开后页面服务退出，未完成作业会取消。先完成作业。重连后重新获取页面地址。
- 停用只移除对应宿主条目，保留data、settings和失败记录。没有破坏性自动卸载。

Back up complete data and settings, not just Markdown exports. Report version, error code and a redacted minimal example; never post credentials or personal task stores. Full native host acceptance is documented for Cursor/Codex on Windows x64; compatible protocol support is not a claim that every other host UI was tested.
