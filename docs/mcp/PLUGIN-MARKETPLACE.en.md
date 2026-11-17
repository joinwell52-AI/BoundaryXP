# Install the candidate Codex community plugin

[简体中文](PLUGIN-MARKETPLACE.zh-CN.md) · [Standard MCP setup](INSTALL.en.md)

**Plugin 0.3.0 · MCP rc.10 / B345 · Windows / Linux x64 · Node.js ≥22.19 with npm**

Windows locks MCP `0.4.0-rc.10`; Linux locks `0.4.0-rc.10-linux.1` and requires glibc ≥2.36 (for example Debian 12 / Ubuntu 24.04). macOS, ARM64 and Alpine/musl are unsupported. Complete L2/L3 directory imports follow the [B345 format guide](npm/guides/DICTIONARIES.md).

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

First connection installs the platform-specific locked compiled package from npm. Network access is required; installation logs go to stderr and startup allows 300 seconds. Later connections reuse the installation. Expect Windows rc.10 or Linux rc.10-linux.1, 21 tools, 17 resources and a separate loopback workbench URL. Analysis uses the current host LLM without a separate model API key.

## Data and updates

Windows storage remains `%LOCALAPPDATA%/BoundaryXP/CommunityPlugin`. Linux uses `$XDG_DATA_HOME/BoundaryXP/CommunityPlugin`, or `$HOME/.local/share/BoundaryXP/CommunityPlugin` when XDG_DATA_HOME is unset. Both are separate from standalone installations. `BXP_PLUGIN_HOME` can select a dedicated empty directory; unrelated nonempty directories are refused. Tasks and dictionaries from other standalone installations are not migrated; host configurations are unchanged. Retain the plugin home when removing or updating the plugin cache.

The plugin pins each platform's package rather than following a moving npm tag. Close older plugin connections before upgrading. On first connection, 0.3.0 copies its inactive plugin-owned `data-rc9` to `data-rc10`, validates file hashes, and retains the original store, profiles and migration receipt. A live old process or incomplete target causes refusal, not process termination or deletion. Reverting to the older plugin reads the old snapshot, excluding later work. `--install-only` downloads without migrating. Cross-OS migration is unqualified. No standalone installation is scanned or changed; existing standalone MCP users do not need this candidate plugin.

## Verification and limitations

Current **0.3.0 / rc.10**: Windows/Linux x64 × Node 22.19/24.19 each passed **9/9**, no skips; complete dictionary examples, real npm/native tools, workbench and reconnect retention passed. Real rc.9 fixture copies retained original task/config/dictionary bytes (copied audit logs only append). Linux historical reports and a saved-response replay/recheck passed; no fresh LLM analysis was claimed. Fresh isolated Linux Codex installed/enabled 0.3.0 from a local marketplace and its installed copy returned rc.10-linux.1 / 21 tools / 17 resources. [Current evidence](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/evidence/rc10-plugin-20261117.json). The records below describe older releases.

Historical Windows 0.1.0 acceptance on 2026-11-16: an isolated Codex configuration added the GitHub source above, installed/enabled the plugin and called its installed MCP copy successfully: rc.9 / 21 tools. Seven targeted tests also passed, covering bilingual help, four L2/L3 examples, validation/import, multiple DEV persistence, workbench HTTP and preserved data after reconnection. No paid model or fabricated LLM response was used. This is CLI plugin-installation and native-tool evidence, not a new GUI-click or semantic-accuracy qualification.

On **2026-11-17**, plugin **0.2.0** passed **9/9 with zero skips** on both Windows and Linux, each with Node 22.19.0 and 24.19.0. A fresh Linux Codex configuration installed the candidate from the GitHub branch above and invoked the installed copy successfully. A current-host analysis case exercised all 21 tools, three native calculations, seven-step/technical reports, zero-model recheck and preserved history/dictionaries. [Evidence and exact scope](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/README.md). No Linux desktop GUI or arbitrary-input semantic-accuracy qualification is claimed.

The earlier full community marketplace suite stopped in Grafana tests. A controlled comparison reproduced identical Windows failures without BXP; Grafana is not a BXP dependency and customers need not install it. BXP passed 7/7 tests on both Node 22.19 and 24.19. The contributor has signed the CLA; the [CLA check](https://github.com/openai/community-plugins/actions/runs/43818468947/job/133139843169) passed on 2026-11-16. Maintainer review and applicable platform gates remain outstanding. The optional workflow is manual-only and was not run. macOS, ARM64 and musl remain unsupported. Linux x64/glibc ≥2.36 is now supported by the candidate wrapper.

[Full candidate plugin guide](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/plugins/boundaryxp/README.md) · [Directory status](DISCOVERY.md#rc9-contributions)
