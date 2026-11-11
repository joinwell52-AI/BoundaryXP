# BoundaryXP MCP internal installation guide

[中文](INSTALL.zh-CN.md) · [Index](README.md) · [Recovery](OPERATIONS.md)

## Requirements and download

This private candidate is **0.4.0-rc.2 / B-335 / Windows x64**. It was tested with Node.js **24.19.0**. The package declares Node >=22.18.0; other Node versions, macOS and Linux have not received this acceptance. Node and npm are required; an executable installer, compiler, hosted business server and separate 58618 installation are not.

Download `boundaryxp-mcp-0.4.0-rc.2.tgz` and `SHA256SUMS.txt` from the private `joinwell52-AI/BoundaryXP` release assets. The test draft is named `mcp-v0.4.0-rc.2`; it requires maintainer access while in draft state. Do not install GitHub's automatic **Source code** archives. The package has not been published to npm.

Read-only MCP tools work without a model API. New analysis requires an explicit API profile; the MCP does not inherit the host's chat subscription. Initial npm dependency installation needs network access, but no npm publishing account.

## Verify and install

Run these commands in one PowerShell window. Adjust the downloaded package path if necessary. Use an empty installation home; existing installations should follow the upgrade guide.

```powershell
node --version
npm.cmd --version
$BxpPackage = Join-Path $HOME 'Downloads\boundaryxp-mcp-0.4.0-rc.2.tgz'
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP-rc2'
$BxpSha = '6b84a460956fb942ec19e662ceee4353f589de2ed6bc1f3b7ec6f5303f867c63'
if ((Get-FileHash -LiteralPath $BxpPackage -Algorithm SHA256).Hash.ToLowerInvariant() -ne $BxpSha) { throw 'Package checksum mismatch' }
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

Success returns `status: READY`, version `0.4.0-rc.2` and `probe.passed: true`. Installation may take several minutes. Keep the bootstrap, program, task data and settings in separate sibling directories; never point this installation at 58618 data.

Create empty settings for the first read-only check, preserving existing files. The encoding below is UTF-8 without BOM:

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

## Connect Cursor

Generate configuration for a new isolated workspace:

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

Open that workspace folder in Cursor and enable **BoundaryXP** in its MCP settings. After **18 tools** appear, send:

> Use only the BoundaryXP MCP tools to call bx_capabilities, bx_profiles_list and bx_workbench_open. Return the actual adapter_version, installation_update and workbench URL. Do not use a shell as a substitute or submit analysis.

Expect `0.4.0-rc.2`, update mode `off`, and a loopback URL with a dynamically assigned port. `browser_opened:false` means the host or user opens the returned link; it is not a failure. Use an external or built-in browser. For daily use, ask “Open the BXP workbench”; no startup command is needed in each chat.

If a BoundaryXP entry already exists, the merger preserves its data, profile and environment arguments. To update only its launcher, use `configure --config <existing absolute JSON path>` without the optional data/profile/env flags. Back up and inspect settings before changing their locations. Other MCP entries are preserved.

## Connect Codex or another host

Run `codex mcp list` first and inspect any existing entry with the same name. For a new entry:

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

Start a new Codex session and send the same read-only request. Other standard stdio hosts use the same executable and arguments; the browser URL is **not** a streamable-HTTP MCP endpoint. Do not pass a TOML configuration file to the JSON merger. Cursor and Codex have received actual host-call acceptance; other host interfaces are not individually certified here.

## Configure the analysis API

Edit `settings/profiles.json` and `settings/.env` with UTF-8 without BOM. Keep keys out of task text, chat messages and repositories. Choose a profile with a model your account can use.

Cursor API example:

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

```dotenv
CURSOR_API_KEY=REPLACE_WITH_YOUR_KEY
```

OpenAI-compatible Chat Completions example (placeholders, not a live service):

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

After changes, finish active work and reconnect all clients using the data directory. Call `bx_profiles_list`. `configured:true` validates local settings; it does not prove remote credentials, credit or model entitlement. Actual analysis contacts the provider and may incur charges.

## First complete task

Use the full [multi-DEV example](examples/multi-dev.en.md). Ask the host to preview it with your configured profile, explicitly bind an empty dictionary selection unless you choose a dictionary, and show the parent mapping without saving or analyzing. Expect one root and two separate DEV nodes. The root omits Parent Task ID; each child names its parent explicitly. A role ordinal does not establish execution order.

Once the preview is correct, ask:

> Save this confirmed task as a new project and return its ID and revision. Submit one analysis for that revision, then query the job until completed or failed. Do not retry failures automatically. On completion, read the formal result, distinguish the LLM judgment from Core verification, and open that project's workbench.

`job_id` is a submission receipt, not completion. A completed job supplies the exact result revision. Failed responses and history remain available; a model draft is not a formal result. Ask for a zero-model recheck of the saved result to create a new revision without another LLM request.

Closing the browser leaves MCP running. Closing the final MCP client stops the local service and cancels unfinished work, so finish jobs first. Reconnect and call `bx_workbench_open` for the current URL; saved projects remain in the data directory.
