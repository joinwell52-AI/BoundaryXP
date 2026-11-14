[简体中文](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.zh-CN.md) | **English**

# Install, connect and update BoundaryXP MCP

[Product introduction](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/README.md)

**boundaryxp-mcp 0.4.0-rc.7 · B-335 · Windows x64 · Node.js ≥22.18 (tested: 24.19.0)**

This guide describes a managed installation with a stable launcher and optional automatic updates. The [quick start](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/README.md#quick-start-in-cursor) uses a pinned npx command instead. Both provide the same MCP tools. macOS/Linux native packages are not available in this release.

## First installation

Run these commands in one PowerShell session. For a new installation, keep program files, task data and model settings in separate directories. Existing users should use the [update procedure](#updates) with their original paths.

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use update' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.7 bxp install --home $BxpHome --version 0.4.0-rc.7
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

Expect `READY`, `probe.passed:true` and version `0.4.0-rc.7` in the installation receipt. The installer downloads the exact npm version, checks integrity and probes the native MCP. Internet access is required for package dependencies. No compiler, executable installer, separate BoundaryXP workbench or hosted BoundaryXP server is needed. Empty profiles support read-only use without starting analysis.

## Cursor

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

Open that workspace in Cursor and enable BoundaryXP in MCP settings. After **18 tools** appear, ask:

> Only use BoundaryXP MCP to call bx_capabilities, bx_profiles_list and bx_workbench_open. Return the actual version and workbench URL. Do not use a terminal substitute or submit analysis.

Open the returned loopback URL in a browser. `browser_opened:false` means the host or user must open it. The port can change after reconnecting.

For an existing host configuration, updating only the launcher uses `configure --config <existing-absolute-config-path>`. Omit data/profile/env replacement arguments to retain the original values. Configuration changes are backed up; unrelated MCP entries are preserved.

## Codex and other hosts

Run `codex mcp list` first to check for an existing entry you need to preserve. To add a new one:

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

Start a new Codex session. Other stdio hosts use the same Node executable and arguments, in their own configuration format. Replace every example path below with the corresponding absolute path from your installation.

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

The browser workbench URL is not a streamable-HTTP MCP endpoint. Native host acceptance is documented for Cursor/Codex on Windows x64; protocol compatibility does not mean every other host UI was tested.

## Model configuration

Keep credentials only in the local settings `.env`; profiles contain no keys. Use UTF-8 without BOM. New analysis requires independent API access and does not inherit a Cursor/Codex chat subscription. Read-only tools need no API key.

For Cursor API, set `profiles.json` to:

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

Put your own `CURSOR_API_KEY` in the local `.env`. Alternatively, configure a Chat Completions-compatible provider:

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

Replace the example URL, model ID and key with your provider's values; these placeholders are not a working service. Finish active work and reconnect matching clients after changing settings. `bx_profiles_list` checks local readiness; only actual analysis validates remote credentials, model access and credit. Analysis may incur charges and sends the selected task/dictionary content to the provider. Do not put keys in task text, chat or public issues.

## First task

Use the entire [English multi-DEV example](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.en.md). Ask `bx_task_import` to preview one parent and two separately identified DEV tasks. Keep explicit task and parent IDs; leave the root's parent empty. Do not merge children just because their roles match.

Confirm the preview, save a new project, submit one analysis for its exact revision and poll the job until completed or failed. Do not automatically retry failures. Read the formal result and distinguish LLM judgment from Core verification. Opening the workbench does not submit another analysis.

A `job_id` is not evidence of completion. Failed receipts and original responses are retained; unverified drafts are not formal results. `bx_result_recheck` re-evaluates saved operands with no model request and preserves the original result.

For help in the host, ask **“Read BoundaryXP tool help, multi-DEV examples and troubleshooting in English.”** The MCP entry is `bx_capabilities({"language":"en","help_topic":"tools"})`; substitute `examples` or `troubleshooting` for those topics.

## Updates

Keep your existing installation, data and settings paths. Back up complete data and settings, finish jobs and disconnect related MCP clients before a manual update. Restore `$BxpHome` to the original installation path if using a new shell.

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.7 bxp update --home $BxpHome --version 0.4.0-rc.7
```

Do not delete the old release first. Updates preserve task data, failed records and host/provider settings. A changed runtime digest requires explicit `--migrate-data <original-data-directory>`; the installer copies and verifies data while retaining the original directory. This documentation release retains the preceding runtime digest.

Later managed updates can also use `node <home>/launcher.mjs --manage update --version <exact-version>`. Reconnect clients afterward and compare `bx_capabilities` with the on-disk `--manage status`.

The unpublished rc.2 local test package used a different package name; use the new bootstrap command above once to switch. It was not an earlier npm release.

### Optional automatic updates

Disabled by default. For the managed installation, enable the prerelease channel explicitly:

```powershell
node $BxpLauncher --manage auto-update --mode auto --registry https://registry.npmjs.org --channel next --allow-prerelease --interval-minutes 1440
node $BxpLauncher --manage auto-update-check
node $BxpLauncher --manage status
```

Without `--copy-migrate`, releases with a changed runtime digest require attention instead of automatic activation. Add that option only if you want automatic copy migration. New releases are prepared in the background and activated on the next start after all related clients exit. Running jobs are not forcibly stopped. No Windows service or scheduled task is installed; checks run while MCP is running.

To select check-only mode, or turn automatic updates off, run the corresponding command:

```powershell
node $BxpLauncher --manage auto-update --mode check
node $BxpLauncher --manage auto-update --mode off
```

Ask `bx_capabilities` for `installation_update`. `PREPARED` awaits a safe start; `WAITING_FOR_CLIENTS` means another client is running; `APPLIED` means activated. `CHECK_FAILED` retains the active version and checks again at the next interval. `MIGRATION_OPT_IN_REQUIRED` needs explicit copy-migration permission. A pinned direct npx entry has no managed updater.

### Rollback

After disconnecting clients, use `node $BxpLauncher --manage rollback` to restore the previous release and its paired data directory. New work in a migrated copy remains in that copy; it is not automatically merged. The rolled-back version is blocked from immediate automatic reinstallation. Keep both data copies.

## Troubleshooting and shutdown

| Symptom | What to check |
|---|---|
| Connecting or zero tools | Node absolute path, MCP output, JSON encoding and `--manage status`. Run `--manage doctor` for an isolated MCP/HTTP probe. |
| 18 tools but chat cannot find them | Start a new Agent chat after connection. |
| COMPILER_BUSY | Wait for the existing job or explicitly cancel it; do not submit duplicates. |
| JOINT_RESPONSE_NOT_JSON | Preserve the error and original response. A malformed response is not a valid boundary judgment. |
| PROFILE_NOT_FOUND or API 401/403/429 | Profile, key, provider access and quota. Do not automatically retry paid analysis. |
| BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS | Finish work and reconnect all clients with the same version/configuration for that data root. |
| Integrity or upgrade failure | Keep the previous release and failed records. Obtain a trusted package; do not bypass checks. |

Closing the browser does not stop MCP. Disconnecting the last MCP client stops the workbench and cancels unfinished jobs; finish work first. Reconnect and call `bx_workbench_open` for a fresh address.

To stop using MCP, remove only its host entry and retain data/settings. Report the version, error code and a redacted minimal example; never share credentials or personal task stores.
