# 自动检查与自动升级 / Automatic updates

从 `0.4.0-rc.2` 开始，managed launcher 支持自动更新。首次配置可信发行源后，运行中的 MCP 会定期自动检查并在后台下载、校验和自检新版；全部相关客户端退出后的下一次启动自动切换。不强制重启宿主、不取消分析、不自行提交模型请求。客户端一直不退出时，新版保持待生效。

Starting with `0.4.0-rc.2`, managed installations can check and prepare updates in the background. Activation is automatic at the next start after every client using the installation has exited. Long-running clients keep their current release. No forced restart, task cancellation or model request is performed.

## 启用 / Enable

自动更新默认关闭。npm发行包固定为`boundaryxp-mcp`；预发行使用`next`渠道及`--allow-prerelease`。安装包在npm可查询后，可选择启用：

```text
node <home>/launcher.mjs --manage auto-update --mode auto --registry https://registry.npmjs.org --channel next --allow-prerelease --interval-minutes 1440 --copy-migrate
```

`--copy-migrate` 允许跨核心版本自动复制迁移；不提供时，只自动激活核心摘要相同的版本。预发行通道还需 `--allow-prerelease`。同一版本不会反复安装，不会自动降级。检查模式只提示，不下载或切换：

```text
node <home>/launcher.mjs --manage auto-update --mode check
node <home>/launcher.mjs --manage auto-update --mode off
node <home>/launcher.mjs --manage status
```

Updates default to off. The package identity is fixed to boundaryxp-mcp. Once available on npm, use its next channel with --allow-prerelease for this candidate. `--copy-migrate` permits automatic copy migration across runtime digests; without it, such releases require attention. Check mode reports availability without downloading or activating. Off mode stops future checks and activation, retaining settings and history.

## 查看状态 / Read status

在 Cursor、Codex 等宿主说：“调用 BoundaryXP 的 bx_capabilities，显示 installation_update。”返回模式、最后检查状态、待生效版本；不读取本地文档、不调用模型分析。直接运行 server.mjs 的非 managed 安装没有自动更新状态。

Ask your MCP host to call `bx_capabilities` and show `data.installation_update`. `PREPARED` means a verified candidate awaits the next safe start; `APPLIED` means it was activated; `WAITING_FOR_CLIENTS` means another client is still running. `CHECK_FAILED` retains the active release and retries at the next interval. `MIGRATION_OPT_IN_REQUIRED` needs copy-migration opt-in. Non-managed direct server launches do not run the updater.

默认检查间隔 24 小时，可设置 1 分钟至 7 天；启动不会等待网络检查或 npm 下载。后台准备可能持续数分钟。可显式执行 `--manage auto-update-check` 提前检查，无需等待下一周期。自动更新只在 MCP 运行期间检查，不安装 Windows 常驻服务或计划任务。

Checks default to 24 hours (configurable from 1 minute to 7 days). Startup does not wait for network requests or npm downloads. Background preparation can take several minutes. Use `--manage auto-update-check` for an immediate check. No OS service or scheduled task is installed; periodic checks run while MCP is running.

## 数据、失败与回退 / Data and recovery

- 每个新包必须通过 HTTPS 来源、固定包名、SHA-512 压缩包校验、文件清单校验和真实 MCP/HTTP 自检。重定向及跨源压缩包拒绝。
- 源码、原任务、原失败记录、模型配置和宿主配置不被自动更新覆盖。跨核心版本复制到新目录，逐文件核对后才激活；原目录保留。
- 任一检查或迁移失败均保留旧版，失败候选与记录保留。运行中的任务不会为升级而中断。
- `--manage rollback` 恢复上一版本和对应数据目录。回滚出去的版本加入本地自动更新阻止列表，避免下次检查立即装回；更高版本仍可更新。手动指定版本安装不受自动阻止列表影响。
- 首次从 rc.1 或更早版本启用本功能，使用新版 bootstrap 安装器升级。只有已识别的旧 managed launcher 可替换，并保存备份；自定义入口拒绝覆盖。之后正常升级无需修改宿主配置。

Archives require HTTPS, the exact package identity, SHA-512 integrity, file verification and a real MCP/HTTP probe. Redirects and cross-origin archives are rejected. Cross-runtime changes copy and verify data before activation. Failure leaves the active release intact. Rollback restores its paired data directory and suppresses reinstallation of the rolled-back version by automatic checks. To upgrade from rc.1, use the new bootstrap installer once; it backs up and replaces only the recognized legacy launcher, refusing custom entry points. Existing host and provider settings remain unchanged.
