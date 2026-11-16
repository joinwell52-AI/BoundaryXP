# Install the candidate Codex community plugin

[简体中文](PLUGIN-MARKETPLACE.zh-CN.md) · [Standard MCP setup](INSTALL.en.md)

**Plugin 0.1.0 · MCP 0.4.0-rc.9 · Windows x64 · Node.js ≥22.19 with npm**

[OpenAI Community Plugins PR #57](https://github.com/openai/community-plugins/pull/57) is ready for review, but not merged or approved for the OpenAI public plugin directory. These instructions install the inspectable candidate from the publisher's fork. Standard MCP installation remains available through [npm](https://www.npmjs.com/package/boundaryxp-mcp#installation-and-upgrades).

## Add the marketplace and install

In Codex, open Plugins → Add → Add plugin marketplace:

| Field | Value |
|---|---|
| Source | `joinwell52-AI/community-plugins` |
| Git ref | `codex/boundaryxp-plugin-20261116` |
| Sparse paths | Leave empty for the full repository |

Install **BoundaryXP · 界痕** from this marketplace. Do not enter the product documentation repository `joinwell52-AI/BoundaryXP`, which has no corresponding marketplace manifest.

The tested CLI equivalent is:

```text
codex plugin marketplace add joinwell52-AI/community-plugins --ref codex/boundaryxp-plugin-20261116
codex plugin add boundaryxp@community-plugins
```

Start a new chat and ask:

> Only through BoundaryXP MCP, call bx_capabilities for English tool help, bx_profiles_list and bx_workbench_open. Return the actual version and URL. Do not submit analysis or modify existing projects.

First connection installs the locked compiled rc.9 package from npm. Network access is required; installation logs go to stderr and startup allows 300 seconds. Later connections reuse the installation. Expect rc.9, 21 tools, 17 resources and a separate loopback workbench URL. Analysis uses the current host LLM without a separate model API key.

## Data and updates

Default storage is `%LOCALAPPDATA%/BoundaryXP/CommunityPlugin`, separate from standalone installations. `BXP_PLUGIN_HOME` can select a dedicated empty directory; unrelated nonempty directories are refused. Existing tasks, dictionaries and host configurations are not migrated. Retain the plugin home when removing or updating the plugin cache.

The plugin pins rc.9 and does not automatically switch Core versions. It runs the compiled npm dependency locally, distributes no original Core source, and does not install or take over the separate workbench product. Existing MCP installations do not need to switch to this candidate plugin.

## Verification and limitations

On 2026-11-16, an isolated Codex configuration added the GitHub source above, installed/enabled the plugin and called its installed MCP copy successfully: rc.9 / 21 tools. Seven targeted tests also passed, covering bilingual help, four L2/L3 examples, validation/import, multiple DEV persistence, workbench HTTP and preserved data after reconnection. No paid model or fabricated LLM response was used. This is CLI plugin-installation and native-tool evidence, not a new GUI-click or semantic-accuracy qualification.

The full community marketplace suite stopped in Grafana tests. A controlled comparison reproduced identical Windows failures without BXP; Grafana is not a BXP dependency and customers need not install it. BXP passed 7/7 tests on both Node 22.19 and 24.19. Maintainer review, applicable platform gates and the contributor's own CLA remain outstanding. The optional workflow is manual-only and was not run. macOS/Linux are not supported by this native release.

[Full candidate plugin guide](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/plugins/boundaryxp/README.md) · [Directory status](DISCOVERY.md#rc9-contributions)
