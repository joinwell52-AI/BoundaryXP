**简体中文** | [English](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.md)

# 安装、接入与升级 BoundaryXP MCP

[产品介绍](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/README.zh-CN.md)

**boundaryxp-mcp 0.4.0-rc.6 · B-335 · Windows x64 · Node.js ≥22.18（实测 24.19.0）**

本指南采用固定启动器的管理安装，支持可选自动升级。[快速接入](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/README.zh-CN.md#快速接入-cursor)则直接使用固定版本 npx 命令，两者提供相同 MCP 工具。当前不提供 macOS、Linux 原生包。

## 首次安装

在同一个 PowerShell 窗口执行。首次安装将程序、任务数据、模型配置分开放置；已有安装请沿用原路径，跳到[升级](#升级)。

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use update' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.6 bxp install --home $BxpHome --version 0.4.0-rc.6
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

安装回执应显示 `READY`、`probe.passed:true` 和版本 `0.4.0-rc.6`。安装器下载指定 npm 版本、校验完整性并探测原生 MCP。安装依赖需要联网，无需编译器、exe 安装器、另外安装 BoundaryXP 工作台或自建服务器。空 profile 可以使用只读功能，不会启动分析。

## Cursor 接入

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

在 Cursor 打开这个工作区，在 MCP 设置启用 BoundaryXP。看到 **18 个工具** 后，在聊天里说：

> 只通过 BoundaryXP MCP 调用 bx_capabilities、bx_profiles_list 和 bx_workbench_open，返回实际版本和工作台地址；不用终端替代，不提交分析。

在浏览器打开返回的本地地址。`browser_opened:false` 表示需要宿主或用户打开页面，不代表故障。重连后端口可能变化。

已有配置仅更新启动入口时，运行 `configure --config <原配置绝对路径>`，省略替换 data/profile/env 的参数即可保留原值。工具会备份配置，并保留其他 MCP 条目。

## Codex 与其他宿主

先用 `codex mcp list` 检查是否已有需要保留的同名条目。新添加时执行：

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

随后新开 Codex 会话。其他 stdio 宿主使用相同 Node 程序和参数，按各自配置格式填写。将下例路径全部替换为上述安装对应的本机绝对路径。

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": ["--env-file=C:/BXP/settings/.env", "C:/BXP/install/launcher.mjs", "--data-root", "C:/BXP/data", "--profiles", "C:/BXP/settings/profiles.json"]
    }
  }
}
```

浏览器工作台地址不是 streamable-HTTP MCP 接口。当前有 Windows x64 下 Cursor/Codex 接入验收；协议兼容不等于其他宿主的界面均已测试。

## 模型配置

密钥只保存在本机 settings 的 `.env` 中，profile 不含密钥。文件使用 UTF-8 无 BOM。新分析需要独立 API 权限，不自动继承 Cursor/Codex 聊天订阅；只读工具无需模型密钥。

使用 Cursor API 时，`profiles.json` 可填写：

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

在本机 `.env` 中填自己的 `CURSOR_API_KEY`。也可以配置 Chat Completions 兼容服务：

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

将示例地址、模型编号和密钥替换为提供商实际值；占位符不是可用服务。修改配置后，先完成作业，再重连相关客户端。`bx_profiles_list` 只检查本地配置是否就绪，实际分析才能验证远端密钥、模型权限和额度。分析会将选定的任务与字典内容发送给模型提供商，并可能收费。不要把密钥放进任务、聊天或公开问题单。

## 第一个案例

使用[中文多 DEV 示例](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.md)的整篇内容，请 `bx_task_import` 预览：一个父任务，两个不同编号的 DEV 子任务。保留明确的任务编号和父任务编号；根节点不填父任务。不要因为角色相同就合并子任务。[14 子任务格式](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-14.md)可作扩展示例。

确认预览，保存为新项目，对准确的 revision 提交一次分析，然后查询作业，直到完成或失败。失败不自动重试。读取正式结果，区分 LLM 判断与 Core 复核；打开工作台不会再次提交分析。

`job_id` 不是完成标志。失败回执和原响应会保留，未完成的模型草稿不是正式结果。`bx_result_recheck` 对保存的操作数作零模型复验，保留原结果。

在宿主说：**“用 BoundaryXP 查看中文工具说明、完整多 DEV 案例和排障说明。”** MCP 入口为 `bx_capabilities({"language":"zh-CN","help_topic":"tools"})`；也可将主题改为 `examples` 或 `troubleshooting`。

## 升级

沿用原安装、数据和配置路径。先完整备份数据与配置，完成作业并断开相关 MCP 客户端，再手动升级。若新开 PowerShell 窗口，请先将 `$BxpHome` 设为原安装路径。

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.6 bxp update --home $BxpHome --version 0.4.0-rc.6
```

不要先删除旧版。升级保留任务、失败记录及宿主、模型配置。核心运行包摘要变化时，需显式指定 `--migrate-data <原数据目录>`，复制并校验后保留原目录。本次文档更新的核心运行包摘要与上一版相同。

后续也可运行 `node <home>/launcher.mjs --manage update --version <准确版本>`。升级后重连，通过 `bx_capabilities` 与磁盘 `--manage status` 对照版本。

未发布的本机 rc.2 测试安装曾使用不同包名，需要先用上述新版 bootstrap 命令切换一次；它不是此前 npm 发行版。

### 可选自动检查与升级

默认关闭。管理安装可显式开启预发行渠道：

```powershell
node $BxpLauncher --manage auto-update --mode auto --registry https://registry.npmjs.org --channel next --allow-prerelease --interval-minutes 1440
node $BxpLauncher --manage auto-update-check
node $BxpLauncher --manage status
```

不带 `--copy-migrate` 时，遇到核心运行包摘要变化会提示处理，不自动切换。只有确实希望自动复制迁移时才加这个参数。新版在后台准备，所有相关客户端退出后的下一次启动才生效，不强制停止作业。不安装 Windows 常驻服务或计划任务，仅在 MCP 运行期间检查。

只检查或关闭自动更新时，选择对应命令执行：

```powershell
node $BxpLauncher --manage auto-update --mode check
node $BxpLauncher --manage auto-update --mode off
```

通过 `bx_capabilities` 查看 `installation_update`：`PREPARED` 是待安全启动生效，`WAITING_FOR_CLIENTS` 是仍有客户端运行，`APPLIED` 是已生效。`CHECK_FAILED` 保留当前版本并在下一周期再检查；`MIGRATION_OPT_IN_REQUIRED` 需要明确允许复制迁移。直接使用固定版本 npx 的接入没有管理安装自动更新器。

### 回滚

断开客户端后运行 `node $BxpLauncher --manage rollback`，恢复上一版本及其对应数据目录。迁移副本里的新任务仍留在副本，不会自动合并。回滚出去的版本会暂时阻止自动装回，请保留两份数据。

## 排障与停用

| 现象 | 检查方式 |
|---|---|
| Connecting 或零工具 | 检查 Node 绝对路径、MCP 输出、JSON 编码和 `--manage status`。用 `--manage doctor` 做隔离 MCP/HTTP 自检。 |
| 显示 18 工具但聊天找不到 | 连接后新开 Agent 聊天。 |
| COMPILER_BUSY | 等待已有作业或明确取消，不重复提交。 |
| JOINT_RESPONSE_NOT_JSON | 保留错误及原响应，格式失败不能当作有效边界判断。 |
| PROFILE_NOT_FOUND 或 API 401/403/429 | 检查 profile、密钥、提供商权限与额度，不自动重试付费分析。 |
| BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS | 完成作业后，统一使用该数据目录的客户端版本、配置并全部重连。 |
| 校验或升级失败 | 保留旧版及失败记录，重新取得可信包，不绕过校验。 |

关闭浏览器不会关闭 MCP。最后一个 MCP 客户端断开后工作台服务退出，未完成作业会取消，请先完成作业。重连后调用 `bx_workbench_open` 获取新地址。

停用时只移除对应宿主条目，保留数据与配置。报告问题时提供版本、错误码和脱敏最小案例，不提供凭据或个人任务库。
