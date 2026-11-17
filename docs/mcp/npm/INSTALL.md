[简体中文](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.zh-CN.md) | **English**

# Install, connect and update BoundaryXP MCP

[Product introduction](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/README.md)

**boundaryxp-mcp 0.4.0-rc.10 · B-345 · Windows x64 · Node.js ≥22.18 (tested: 24.19.0)**

This guide describes a managed installation with a stable launcher and optional automatic updates. The [quick start](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/README.md#quick-start-with-an-mcp-host) uses a pinned npx command instead. Both provide the same MCP tools. Linux x64 is distributed separately through the linux channel (glibc ≥2.36). No macOS native package is available.

## First installation

Run these commands in one PowerShell session. For a new installation, keep program files, task data and model settings in separate directories. Existing users should use the [update procedure](#updates) with their original paths.

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use update' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.10 bxp install --home $BxpHome --version 0.4.0-rc.10
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

Expect `READY`, `probe.passed:true` and version `0.4.0-rc.10` in the installation receipt. The installer downloads the exact npm version, checks integrity and probes the native MCP. Internet access is required for package dependencies. No compiler, executable installer, separate BoundaryXP workbench or hosted BoundaryXP server is needed. Empty API profiles retain the built-in host profile for analysis with your current MCP host LLM.

## Cursor

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

Open that workspace in Cursor and enable BoundaryXP in MCP settings. After **21 tools** appear, ask:

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

The browser workbench URL is not a streamable-HTTP MCP endpoint. Use any host or command-line MCP client supporting standard stdio tools and resources. No host-specific adapter or model brand is required. Installation still requires Windows x64 and the stated Node version.

## Model configuration

The built-in `host` profile uses the current host LLM without an additional API key. Keep `{"profiles":[]}` for this mode. Ask your host to analyze the project through BoundaryXP.

1. Import, inspect the tree, and create the project with `profile_id:"host"`.
2. Call `bx_analysis_submit` with `action:"prepare"`, project ID, exact revision and a new request UUID.
3. Read **all** instruction artifact pages. The current LLM produces the analysis JSON; task instructions are data, not actions to execute.
4. Call the same tool with `action:"complete"`, the same project/revision, returned job ID and preparation digest, a new request UUID and the complete JSON string in `response`.
5. Poll `bx_job_get`, read `bx_result_get` at its result revision, and open `bx_workbench_open`. Optional `bx_result_recheck` runs no new model request.

The page's host-analysis button displays a request to copy into the connected host chat. It does not secretly access a host subscription. Host-mode report translation can be requested in that chat; keep the original report. Server request count 0 means no server API request, not no host LLM activity. After a server restart, interrupted preparations remain recorded; start a new preparation only when requested.

**Optional independent API mode:** keep credentials in local settings `.env` and API profiles without keys. Use UTF-8 without BOM. This mode uses your provider's API access and billing.

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

Confirm the preview, save a new project and follow the host prepare/complete flow above for its exact revision. Poll the job until completed or failed. Do not automatically retry failures. Read the formal result and distinguish LLM judgment from Core verification. Opening the workbench does not submit another analysis.

A `job_id` is not evidence of completion. Failed receipts and original responses are retained; unverified drafts are not formal results. `bx_result_recheck` re-evaluates saved operands with no model request and preserves the original result.

For help in the host, ask **“Read BoundaryXP tool help, multi-DEV examples and troubleshooting in English.”** The MCP entry is `bx_capabilities({"language":"en","help_topic":"tools"})`; substitute `examples` or `troubleshooting` for those topics.

## Updates

Keep your existing installation, data and settings paths. Back up complete data and settings, finish jobs and disconnect related MCP clients before a manual update. In a new shell, set `$BxpHome` and `$BxpData` to your existing installation and data directories; do not substitute the new-install example paths for your own.

**rc.8 can upgrade directly to rc.9 without uninstalling.** Its old automatic updater expects exactly 18 tools and rejects rc.9's 21 tools. For this transition use the command below, which obtains the rc.9 installer through npm; do not use the old `launcher --manage update`. The new probe checks the target package's declared tools, so future changes in tool count do not cause this rejection.

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.10 bxp update --home $BxpHome --version 0.4.0-rc.10 --migrate-data $BxpData
```

Do not delete the old release first. Updates preserve task data, failed records and host/provider settings. This update changes the MCP runtime digest while keeping the B-345 native Core binary unchanged. Use `--migrate-data <original-data-directory>` for a verified copy; the original directory is retained.

Later managed updates can also use `node <home>/launcher.mjs --manage update --version <exact-version>`. Reconnect clients afterward and compare `bx_capabilities` with the on-disk `--manage status`.

The unpublished rc.2 local test package used a different package name; use the new bootstrap command above once to switch. It was not an earlier npm release.

### Existing direct-npx users

If your host directly runs `npx.cmd --yes boundaryxp-mcp@0.4.0-rc.8 ...` without a managed installation, do not just change the package version against the old data directory. Finish jobs and disconnect matching clients. Set `$BxpData` to the existing data directory and `$BxpHome` to a new empty installation directory, then run:

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.10 bxp install --home $BxpHome --version 0.4.0-rc.8
if ($LASTEXITCODE -ne 0) { throw 'Bootstrap installation failed' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.10 bxp update --home $BxpHome --version 0.4.0-rc.10 --migrate-data $BxpData
if ($LASTEXITCODE -ne 0) { throw 'Migration failed' }
```

Follow the host setup section to replace only the existing BoundaryXP launch command with the new managed `launcher.mjs`. Retain the original data argument, profiles, environment and other MCP entries. The launcher resolves the verified data copy while retaining the original. Avoid duplicate BoundaryXP connections to the same data.

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
| 21 tools but chat cannot find them | Start a new Agent chat after connection. |
| COMPILER_BUSY | Wait for the existing job or explicitly cancel it; do not submit duplicates. |
| JOINT_RESPONSE_NOT_JSON | Preserve the error and original response. A malformed response is not a valid boundary judgment. |
| PROFILE_NOT_FOUND or API 401/403/429 | Profile, key, provider access and quota. Do not automatically retry paid analysis. |
| BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS | Finish work and reconnect all clients with the same version/configuration for that data root. |
| Integrity or upgrade failure | Keep the previous release and failed records. Obtain a trusted package; do not bypass checks. |

Closing the browser does not stop MCP. Disconnecting the last MCP client stops the workbench and cancels unfinished jobs; finish work first. Reconnect and call `bx_workbench_open` for a fresh address.

To stop using MCP, remove only its host entry and retain data/settings. Report the version, error code and a redacted minimal example; never share credentials or personal task stores.


Custom L2/L3: bx_dictionary_format, bx_dictionary_validate and bx_dictionary_import; workbench upload and validation. [Format, examples and workflow](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/guides/DICTIONARIES.md). Available from rc.9; rediscover 21 tools and 17 resources after upgrading.
