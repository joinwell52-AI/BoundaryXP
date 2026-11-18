# BoundaryXP Linux · Installation

[简体中文](INSTALL.zh-CN.md)

BoundaryXP (BXP) turns task sources and parent/child relationships into an evidence-linked 7+1 boundary representation. Your host LLM analyzes the task independently; the native Core verifies submitted formal inputs. Reports retain judgments, calculation receipts, evidence and unknowns separately. Calculation does not prove semantic extraction correct or grant execution authority.

Linux version: `0.4.0-rc.11-linux.1`, B348 runtime; unchanged B-335 Core calculation contract, 21 tools and 17 resources, including custom L2 industry and L3 enterprise dictionaries. MIT licensed. Original Core source is excluded; adapters, UI and resources remain readable distribution files.

## Requirements and MCP setup

rc.10 adds Installed/Import dictionary tabs and five steps: L2/L3 → full folder → validate → name → save. L2 requires 8 JSON files plus README; L3 requires 3 JSON files plus README. The format tool provides complete examples in both languages. Existing rc.9 dictionaries and legacy JSON tool imports remain compatible. Model settings and dictionary settings save independently without starting analysis.

Linux x64, glibc ≥2.36 (for example Debian 12), Node.js ≥22.19.0 and npm. ARM64, Alpine/musl and macOS are not supported. Windows users retain `0.4.0-rc.11`; npm `latest/next` remain Windows channels. Linux uses the `linux` tag or this pinned version.

Add a local stdio server to your MCP host, replacing the data path with your own absolute path:

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "npx",
      "args": ["--yes", "--package=boundaryxp-mcp@0.4.0-rc.11-linux.1", "bxp", "serve", "--data-root", "/home/you/.local/share/boundaryxp"]
    }
  }
}
```

Host configuration formats vary; the common stdio launch command is:

```sh
npx --yes --package=boundaryxp-mcp@0.4.0-rc.11-linux.1 bxp serve --data-root /absolute/path/to/bxp-data
```

The host keeps stdin open for MCP messages. First installation downloads npm packages. No separate workbench installation or hosted business server is required. The default workflow uses the current host LLM without an additional model API key; MCP itself is not a model.

## Use

Ask the host: “Call BoundaryXP bx_capabilities with language en and help_topic tools, then bx_workbench_open for the current page address.”

Full workflow: preview complete source with `bx_task_import`; validate/create the project; use `bx_analysis_submit` prepare; let the host LLM read instructions and submit its analysis; poll `bx_job_get`; read `bx_result_get`; run `bx_result_recheck`. Follow built-in schemas. Multiple DEV tasks need separate IDs and explicit parent IDs rather than one combined role node.

Use `bx_dictionary_format` for L2/L3 schemas and Chinese/English examples, `bx_dictionary_validate` to check, then `bx_dictionary_import`. Existing versions are not overwritten. The UI also supports validation and import. `bx_dictionaries_bind` binds versions and digests; dictionaries do not grant business authority.

Open the loopback URL returned by `bx_workbench_open` in a browser on the same Linux host. The port can change after restart. Closing the browser does not delete tasks; stopping MCP stops its page service. Keep the data directory and do not share it between active instances.

## Docker

The public Dockerfile downloads only the compiled package and verifies its checksum. It requires no private Core source.

```sh
git clone https://github.com/joinwell52-AI/BoundaryXP.git
cd BoundaryXP
docker build --platform linux/amd64 -t boundaryxp:linux .
docker volume create bxp-linux-data
docker run --rm -i --mount type=volume,source=bxp-linux-data,target=/data boundaryxp:linux
```

Use that final docker command as your host's MCP stdio launcher. The image runs as non-root user node and publishes no host ports by default. Preserve the `/data` volume; one container per volume.

The workbench URL belongs to the container loopback interface. It is not directly reachable in the host browser by default. Native Linux can explicitly use `--network host`; remote hosts require SSH local forwarding. This is not a universal Docker Desktop port-mapping solution. Origin/session checks remain enabled.

## Updates and troubleshooting

This independent Linux release does not replace installed Windows versions. A pinned npx configuration stays pinned. Finish active tasks before upgrading to a future Linux release and retain the data directory. `@linux` resolves the channel when the host restarts and npm refreshes it; running processes are not hot-swapped. Do not change the OS or overwrite existing Windows installs/data.

For `EBADPLATFORM`, check Linux x64 and the package version. `BXP_NATIVE_GLIBC_2_36_REQUIRED` requires a supported glibc distribution. For `DATA_ROOT_IN_USE`, confirm the existing instance has exited; do not blindly delete locks or share a volume. Built-in `bx_capabilities` help_topic troubleshooting provides more guidance.

Local isolated acceptance covered a full host-LLM case, dictionaries, reports, recheck, installation and container restart. Glama's build/review status is separate. Publication does not imply Glama approval; npm installation works independently.
