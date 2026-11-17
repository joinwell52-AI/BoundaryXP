# Install the candidate Codex community plugin

[简体中文](PLUGIN-MARKETPLACE.zh-CN.md) · [Standard MCP setup](INSTALL.en.md)

**Plugin 0.2.0 · Windows / Linux x64 · Node.js ≥22.19 with npm**

Windows locks MCP `0.4.0-rc.9`; Linux locks `0.4.0-rc.9-linux.1` and requires glibc ≥2.36 (for example Debian 12 / Ubuntu 24.04). macOS, ARM64 and Alpine/musl are unsupported.

[OpenAI Community Plugins PR #57](https://github.com/openai/community-plugins/pull/57) is ready for review, but not merged or approved for the OpenAI public plugin directory. These instructions install the inspectable candidate from the publisher's fork. Standard MCP installation remains available through [npm](https://www.npmjs.com/package/boundaryxp-mcp#installation-and-upgrades).

## Add the marketplace and install

In Codex, open Plugins → Add → Add plugin marketplace:

| Field | Value |
|---|---|
| Source | `joinwell52-AI/community-plugins` |
| Git ref | `codex/boundaryxp-plugin-20261116` |
| Sparse paths | `.agents/plugins` and `plugins`, one per line; or leave empty for the full repository |

Install **BoundaryXP · 界痕** from this marketplace. Do not enter the product documentation repository `joinwell52-AI/BoundaryXP`, which has no corresponding marketplace manifest.

The tested CLI equivalent is:

```text
codex plugin marketplace add joinwell52-AI/community-plugins --ref codex/boundaryxp-plugin-20261116
codex plugin add boundaryxp@community-plugins
```

Start a new chat and ask:

> Only through BoundaryXP MCP, call bx_capabilities for English tool help, bx_profiles_list and bx_workbench_open. Return the actual version and URL. Do not submit analysis or modify existing projects.

First connection installs the platform-specific locked compiled package from npm. Network access is required; installation logs go to stderr and startup allows 300 seconds. Later connections reuse the installation. Expect Windows rc.9 or Linux rc.9-linux.1, 21 tools, 17 resources and a separate loopback workbench URL. Analysis uses the current host LLM without a separate model API key.

## Data and updates

Windows storage remains `%LOCALAPPDATA%/BoundaryXP/CommunityPlugin`. Linux uses `$XDG_DATA_HOME/BoundaryXP/CommunityPlugin`, or `$HOME/.local/share/BoundaryXP/CommunityPlugin` when XDG_DATA_HOME is unset. Both are separate from standalone installations. `BXP_PLUGIN_HOME` can select a dedicated empty directory; unrelated nonempty directories are refused. Existing tasks, dictionaries and host configurations are not migrated. Retain the plugin home when removing or updating the plugin cache.

The plugin pins each platform's package and does not automatically switch Core versions. The existing Windows runtime lock remains byte-identical. Cross-OS data migration has not been qualified. It runs the compiled npm dependency locally, distributes no original Core source, and does not install or take over the separate workbench product. Existing MCP installations do not need to switch to this candidate plugin.

## Verification and limitations

Historical Windows 0.1.0 acceptance on 2026-11-16: an isolated Codex configuration added the GitHub source above, installed/enabled the plugin and called its installed MCP copy successfully: rc.9 / 21 tools. Seven targeted tests also passed, covering bilingual help, four L2/L3 examples, validation/import, multiple DEV persistence, workbench HTTP and preserved data after reconnection. No paid model or fabricated LLM response was used. This is CLI plugin-installation and native-tool evidence, not a new GUI-click or semantic-accuracy qualification.

On **2026-11-17**, plugin **0.2.0** passed **9/9 with zero skips** on both Windows and Linux, each with Node 22.19.0 and 24.19.0. A fresh Linux Codex configuration installed the candidate from the GitHub branch above and invoked the installed copy successfully. A current-host analysis case exercised all 21 tools, three native calculations, seven-step/technical reports, zero-model recheck and preserved history/dictionaries. [Evidence and exact scope](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/README.md). No Linux desktop GUI or arbitrary-input semantic-accuracy qualification is claimed.

The earlier full community marketplace suite stopped in Grafana tests. A controlled comparison reproduced identical Windows failures without BXP; Grafana is not a BXP dependency and customers need not install it. BXP passed 7/7 tests on both Node 22.19 and 24.19. The contributor has signed the CLA; the [CLA check](https://github.com/openai/community-plugins/actions/runs/43818468947/job/133139843169) passed on 2026-11-16. Maintainer review and applicable platform gates remain outstanding. The optional workflow is manual-only and was not run. macOS, ARM64 and musl remain unsupported. Linux x64/glibc ≥2.36 is now supported by the candidate wrapper.

[Full candidate plugin guide](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/plugins/boundaryxp/README.md) · [Directory status](DISCOVERY.md#rc9-contributions)
