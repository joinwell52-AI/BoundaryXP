# 升级、恢复与排障 / Upgrades, recovery and troubleshooting
# 更新与恢复 / Updates and recovery

当前npm包为`boundaryxp-mcp`，首次发行0.4.0-rc.3。按[安装说明的升级、回滚及排障章节](npm/INSTALL.md)操作；自动更新见[专门说明](npm/AUTO-UPDATE.md)。

Automatic updates default to off. Choose `next` with `--allow-prerelease` to receive prerelease updates from the official npm registry. Updates preserve active tasks and activate at the next safe start.

旧本机测试包首次切换需要新bootstrap；不要删除原安装、任务或配置。仓库可见性与npm更新源互相独立。若刚发行时遇到ETARGET，先确认npm版本已可见并刷新元数据；不要强制清空全部缓存或重提交分析。

[此前rc.2操作记录](rc2/OPERATIONS.md)保留为历史说明。
[中文安装](INSTALL.zh-CN.md) · [English installation](INSTALL.en.md) · [工具](TOOLS.md)

## 当前的内部更新方式 / Current internal updates

当前只准备私有 GitHub 测试包，不发布 npm。下载维护者提供的新 `.tgz` 和对应校验文件后手动安装。**GitHub Releases 页面不是 npm registry**；不要将 GitHub URL 传给 `--registry`。当前自动下载器不支持 GitHub 私有附件认证，也不支持私有 npm registry 的认证。

Download the verified `.tgz` from the private test release and install it locally. A GitHub release URL is not an npm registry. The updater currently has no GitHub private-asset authentication or authenticated private-registry support. Automatic checks remain off until an approved compatible HTTPS registry is configured.

## 检查状态 / Status

在 PowerShell 中按自己的安装路径设置变量；这里沿用安装指南的目录：

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP-rc2'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
node $BxpLauncher --manage status
node $BxpLauncher --manage doctor
```

`status` 核对磁盘安装；`doctor` 启动隔离自检，不对现有任务发起分析。聊天调用 `bx_capabilities` 返回**当前连接**的版本。安装后磁盘是新版、旧聊天仍是旧版可能同时出现，必须等作业结束后重连全部相关 MCP 客户端。

`status` describes the installed selection; `doctor` uses an isolated probe without analyzing existing tasks. `bx_capabilities` describes the connected service. A running old connection can legitimately differ from the newly installed selection until all clients reconnect.

## 升级 / Upgrade

升级前先完成作业，备份 `data`、`settings`、宿主配置。不要覆盖 `.env` 或把程序目录当数据目录。普通更新保留原配置；不要先删除旧安装。

**首次 rc.1 → rc.2 或 0.3.x → 原生版**，必须用新版包的 bootstrap 安装器，旧安装器不能更新新版启动器。以下变量替换为实际新包与匹配摘要：

```powershell
$BxpNewPackage = 'C:\Downloads\boundaryxp-mcp-NEW-VERSION.tgz'
$BxpNewSha = 'REPLACE_WITH_RELEASE_SHA256'
if ((Get-FileHash -LiteralPath $BxpNewPackage -Algorithm SHA256).Hash.ToLowerInvariant() -ne $BxpNewSha) { throw 'Package checksum mismatch' }
$BxpNewBootstrap = Join-Path $BxpRoot 'bootstrap-next'
npm.cmd install --prefix $BxpNewBootstrap --ignore-scripts --no-audit --no-fund $BxpNewPackage
if ($LASTEXITCODE -ne 0) { throw 'Bootstrap installation failed' }
$BxpNewCli = Join-Path $BxpNewBootstrap 'node_modules\@boundaryxp\mcp\cli.mjs'
node $BxpNewCli update --home $BxpHome --package $BxpNewPackage --sha256 $BxpNewSha
```

后续同核心更新也可使用：

```powershell
node $BxpLauncher --manage update --package $BxpNewPackage --sha256 $BxpNewSha
```

若返回 `RUNTIME_MIGRATION_REQUIRED_USE_MIGRATE_DATA`，先确认所有相关客户端已断开，再使用新版 bootstrap 的同一升级命令，追加 `--migrate-data $BxpData`。程序复制并验证新的数据目录，旧目录保留；不合并新旧目录，不重算旧任务。安装成功后正常重连，并以 `bx_capabilities` 核对版本。

Use the new bootstrap once for rc.1 or legacy upgrades. Later same-runtime upgrades can use the managed launcher. A changed runtime digest requires inactive clients and explicit `--migrate-data <original data root>` with the new installer. It verifies a copy and preserves the original data, settings and history. Reconnect and verify the actual running version.

## 回滚与备份 / Rollback and backup

先结束作业并断开客户端，再从可信 bootstrap 执行：

```powershell
node $BxpNewCli rollback --home $BxpHome
```

恢复上一程序版本及其数据映射。跨核心升级后创建的新任务仍保存在新版副本；切回旧版时不会自动合并或显示它们。保留 bootstrap 和两个数据目录。再次回滚可切回另一版本。自动更新会跳过刚回滚出去的版本，避免立即重装；更高版本仍可更新。

Rollback restores the previous release/data pair. New results in a migrated copy are retained there and do not merge into the older data tree. Keep the bootstrap and both copies. Automatic checks suppress the rolled-back version. A first installation has no previous release to restore.

备份时应等作业结束并断开客户端。备份整个数据目录和独立模型设置，不能只备份报告 Markdown；任务、版本、失败记录及摘要关联也需要保留。恢复到新位置后，检查宿主参数是否指向恢复的数据与配置。

Back up the entire data tree and settings after work finishes and clients disconnect. Report exports alone do not preserve project revisions, failures or artifact links. Verify restored host paths before starting.

## 自动升级的边界 / Automatic-update behavior

rc.2 已测试自动检查、后台下载和自检、全部客户端退出后的下次启动自动生效、复制迁移及回滚保护。当前内部测试没有线上发行源，`mode:off` 是正确状态，不是故障。

默认检查间隔为 24 小时，只在 MCP 运行期间检查；没有 Windows 常驻服务。运行中的客户端不会被强制中断。跨核心自动升级还需显式允许复制迁移。将来发行源确认后再按随包 `AUTO-UPDATE.md` 配置，当前不提供假定可用的 npm 下载命令。

The mechanism is tested, but the internal candidate has no live update feed. `mode:off` is expected. Checks run while MCP is running, defaulting to 24 hours; no OS service is installed. Prepared updates wait for all clients to exit. Cross-runtime activation requires copy-migration opt-in.

## 常见问题 / Troubleshooting

| 现象或错误 / Symptom | 处理 / Action |
|---|---|
| `Connecting` / 0 tools | 等待首次校验；查看 MCP 输出中的启动阶段。检查 Node 路径、包完整性、JSON 编码和命令是否退出。不要用“显示在列表中”代替实际工具调用。 / Wait for startup verification; inspect output and paths. |
| 显示 18 tools，但聊天找不到 / Chat cannot discover tools | 新开 Agent 聊天，要求重新发现 BoundaryXP 工具；不要用终端模拟工具调用。 / Start a new Agent chat and discover deferred MCP tools. |
| 更新后仍返回旧版本 / Old version after update | 作业结束后断开所有使用这套数据的 MCP 连接再重连。必要时重载独立窗口；核对工具回执。不要删除任务、修改端口或批量结束 Node。 / Reconnect all matching clients after jobs finish. |
| `EXISTING_CONFIG_OPTIONS_PRESERVED` | 已有配置不接受覆盖 data/profile/env 参数。只传 `--config` 更新入口，或备份后明确编辑设置。 / Preserve existing arguments; omit replacement flags. |
| `BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS` | 相同数据被不同版本或配置使用；结束作业后统一配置并重连全部客户端。 / Align versions/settings and reconnect. |
| `DATA_ROOT_IN_USE_RECONNECT_ALL_CLIENTS` / `MIGRATION_SOURCE_BUSY_CLOSE_CLIENTS` | 仍有活动实例；正常断开 MCP。只关浏览器无效。 / Disconnect actual MCP clients, not just the browser. |
| `PACKAGE_FILE_MISMATCH` / 摘要错误 | 停止，重新取得可信包；不跳过校验、不修改 manifest。 / Obtain the verified archive; never bypass verification. |
| `PROFILE_NOT_FOUND` / `API_KEY_NOT_CONFIGURED` | 检查 profile id、UTF-8 JSON、env 文件和新连接；密钥不要写进 profile。 / Check profile and environment, then reconnect. |
| API 401/403/429 | 核对服务商密钥、模型权限、额度及限流；不自动重复付费分析。 / Check provider access and limits; do not auto-retry analysis. |
| `COMPILER_BUSY` | 查看当前作业，等待完成或明确取消；不要同时在聊天与页面重复提交。 / Wait or explicitly cancel the existing job. |
| `JOINT_RESPONSE_NOT_JSON` / 计算输入格式失败 | 保留失败作业与原始响应，读取错误；不要把候选草稿当正式结果或自行改成通过。 / Retain failure evidence and inspect it. |
| 页面打不开 / Browser URL fails | MCP 断开后服务会退出；重连后调用 `bx_workbench_open` 获取新 URL。端口变化正常，不能固定 61079 或 58618。 / Obtain the live URL again. |
| `RELEASE_NOT_PUBLISHED` | 当前无公共 npm 包；使用私有交付 tgz。 / Use the private local tarball. |
| 回滚后“少了新任务” / New tasks absent after rollback | 检查是否切回旧数据副本；新版副本仍保留，不删除、不自动合并。 / Keep the newer data copy. |

反馈时附版本、OS/Node 版本、操作步骤、错误码、是否仍有活动作业，以及去除敏感信息的最小样例。不要上传 `.env`、密钥、整套个人任务或原始日志。联系仓库内部维护者；敏感问题不要发到可能公开的 Issue。

Report version, OS/Node version, steps, error code and a redacted minimal example through the internal maintainer channel. Do not attach credentials, full personal task stores or raw logs.

## 停用 / Removal

完成作业后断开 MCP，移除对应宿主条目，归档程序目录；保留数据和模型设置。没有自动破坏性卸载命令。解绑 MCP 不等于删除任务。关闭页面也不等于停用 MCP。

Finish work, disconnect MCP, remove only its host entry and archive the program directory. Preserve task data and settings. There is no destructive automatic uninstaller.
