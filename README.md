<p align="center"><strong>English</strong> · <a href="README.zh-CN.md">简体中文</a></p>
<p align="center"><img src="assets/branding/v2/BoundaryXP-logo-light.png" alt="BoundaryXP · 界痕" width="320"></p>

<h1 align="center">From source to boundaries, every step is visible.</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/boundaryxp-mcp"><img src="https://img.shields.io/badge/npm-Install%20rc.11-CB3837?style=for-the-badge&amp;logo=npm" alt="npm · Install BoundaryXP rc.11"></a>
  <a href="https://registry.modelcontextprotocol.io/?q=boundaryxp"><img src="https://img.shields.io/badge/Official%20MCP%20Registry-Listed-15803d?style=for-the-badge" alt="Official MCP Registry · Listed"></a>
  <a href="https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.11"><img src="https://img.shields.io/badge/Download-rc.11%20package-2563eb?style=for-the-badge" alt="Download compiled rc.11 package"></a>
  <a href="https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP"><img src="https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP/badges/score.svg" alt="BoundaryXP on Glama · live score"></a>
</p>

<p align="center">
  <a href="https://boundaryxp-demo.vercel.app/"><img src="https://img.shields.io/badge/Demo-Interactive-0891b2?style=flat-square" alt="演示 / Interactive demo"></a>
  <a href="#l2--l3-industry-and-enterprise-semantics"><img src="https://img.shields.io/badge/Semantics-L2%20%2B%20L3-7c3aed?style=flat-square" alt="L2 industry / L3 enterprise semantics"></a>
  <a href="https://doi.org/10.5281/zenodo.24072738"><img src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.24072738-1e3a8a?style=flat-square" alt="DOI: 10.5281/zenodo.24072738"></a>
</p>

<p align="center">Turn complete task requirements into an evidence-linked <strong>7+1 relational representation</strong>, then check it with a deterministic Core.<br>Inspect plans and task decompositions, and trace the evidence for <strong>Violation, Within bounds or Incomplete information</strong>.</p>

<p align="center"><a href="https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=radar&lang=en"><strong>▶ Try the demo</strong></a>　·　<a href="docs/mcp/INSTALL.en.md"><strong>MCP setup</strong></a>　·　<a href="https://doi.org/10.5281/zenodo.24072738"><strong>Paper</strong></a></p>

<p align="center">Chinese & English · MCP 0.4.0-rc.11 / B-348 · Research & protocol material · Original Core source private</p>

> **Questions, counterexamples and contributions are welcome.** The 7+1 method has assumptions and limits; the research cases do not establish correctness for every task. The MCP implementation, model interpretations and L2/L3 resources can also be wrong. Deterministic calculation does not guarantee correct semantic interpretation. Help test and improve the approach with questions, counterexamples and reproducible evidence.
>

| Purpose | Document or page |
|---|---|
| General questions | [Questions and ideas form](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=04-question.yml) |
| Method feedback | [7+1 counterexample form](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=01-method-counterexample.yml) |
| MCP feedback | [MCP installation and usage issue form](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=02-mcp-problem.yml) |
| Semantic feedback | [L2/L3 semantic resource issue form](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=03-semantic-resource.yml) |
| Contribute | [Contribution guide and PR process](CONTRIBUTING.md) |


## Install BXP · Find BXP

**Linux x64 / Docker:** `0.4.0-rc.11-linux.1` uses the `linux` channel (glibc ≥2.36, Node ≥22.19). Windows `latest/next` use rc.11. B348 adds complete Chinese/English reports, provider connection checks and a collapsible evidence panel; the native Core is unchanged. [rc.11 acceptance](docs/mcp/RC11.md). [Glama rc.11](docs/mcp/GLAMA-RC11.md) built and discovered the real native server, then published platform release `0.4.0-rc.linux.11.1` as Latest.


| Purpose | Document or page |
|---|---|
| npm installation | [npm installation and upgrades](https://www.npmjs.com/package/boundaryxp-mcp#installation-and-upgrades) |
| Windows setup | [Windows installation guide · English](docs/mcp/INSTALL.en.md) |
| Windows setup | [Windows installation guide · 中文](docs/mcp/INSTALL.zh-CN.md) |


**21 tools · 17 resources · Windows x64 · Node.js ≥22.18 · rc.11 prerelease.** Default analysis uses your current host LLM; no separate model API key is required.

| Public entry | What you can find there |
|---|---|
| **[npm — install the package](https://www.npmjs.com/package/boundaryxp-mcp)** | rc.11 package, Chinese/English descriptions and installation on the same page |
| **[Official MCP Registry](https://registry.modelcontextprotocol.io/?q=boundaryxp)** | Published rc.11 metadata and npm installation reference |
| **[TensorBlock MCP Index](https://tensorblock.co/mcp/servers/github-joinwell52-ai-boundaryxp-16b09093)** | rc.10 / B345 PR #6225 merged November 18; [rc.11 PR #6302](https://github.com/TensorBlock/awesome-mcp-servers/pull/6302) awaits review |
| **[MCPServers](https://mcpservers.org/servers/www-npmjs-com-package-boundaryxp-mcp)** | rc.8 summary / rc.9 docs; refresh requested again November 18, not yet applied |
| **[Serverdex](https://serverdex.io/server/io-github-joinwell52-ai-boundaryxp)** | November 19: free listing live, rc.11 and `--data-root` present; owner edits saved and publicly verified. Replace `<data-root>` before use; the lower README excerpt still caches rc.8 |
| **[Glama](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP)** | rc.11 Linux package verified and published November 18; 21 tools / 17 resources. [Platform ID and evidence](docs/mcp/GLAMA-RC11.md) |

Serverdex and the three contribution PRs checked 2026-11-19; release and other platform evidence retain their recorded dates. Search **BoundaryXP** or **boundaryxp-mcp**. Use npm for the current package; directory caches can lag. “Listed” means discoverable, not a certification. [Full directory status](docs/mcp/DISCOVERY.md).

MCPwell and ToolCenter also contain directory entries, but no BXP-specific detail URL was verified. Their category/index pages are listed only in the full directory notes, not as direct BXP installation entries here.

**Codex desktop:** Plugins → Add → **Add MCP server**. Follow the stdio setup guide. **Add plugin marketplace** expects a separate plugin-marketplace source; the npm URL, Registry URL and this product repository are not such a source. BXP is not currently listed in the Codex plugin catalog or Cursor Marketplace.

**Plugin contribution (November 18):** [OpenAI PR #57](https://github.com/openai/community-plugins/pull/57) contains plugin **0.4.0**, pinned to rc.11 / rc.11-linux.1. Windows/Linux × Node 22.19/24.19 each passed 9/9; copy migration retained original files, and complete bilingual case replay/recheck passed on both platforms. The latest-head CLA passed. [punkpeye #19484](https://github.com/punkpeye/awesome-mcp-servers/pull/19484) now contains the rc.11 entry and Glama evidence. Both await maintainer review. See [directory status](docs/mcp/DISCOVERY.md) and [candidate plugin installation](docs/mcp/PLUGIN-MARKETPLACE.en.md).

The plugin supports Linux through separate compiled locks, glibc checks and XDG storage. Dated original-analysis and current replay checks remain distinct in the linked evidence. Upstream approval remains pending; original Core source stays private.

**Review check, November 19:** TensorBlock #6302, punkpeye #19484 and OpenAI #57 are all open and unmerged, with no new human review requests. punkpeye's submission check and the plugin CLA pass. Merged TensorBlock #6225 covers rc.10, not rc.11.

To try the contributor fork through **Add plugin marketplace**, use the candidate plugin installation guide. Its GitHub-to-Codex installation and installed MCP were verified in isolation; official marketplace approval is still pending.


| Purpose | Document or page |
|---|---|
| Linux package | [npm Linux package 0.4.0-rc.11-linux.1](https://www.npmjs.com/package/boundaryxp-mcp/v/0.4.0-rc.11-linux.1) |
| Linux / Docker | [Linux / Docker installation · English](docs/mcp/linux/INSTALL.en.md) |
| Linux / Docker | [Linux / Docker installation · 中文](docs/mcp/linux/INSTALL.zh-CN.md) |
| Container build | [Dockerfile](Dockerfile) |
| Linux release | [Linux release assets and checksums](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.11-linux.1) |
| Build and discovery | [Linux release verification report](docs/mcp/linux/RELEASE.md#发布后核对--post-publication-checks) |
| Directory listings | [MCP listings and review status](docs/mcp/DISCOVERY.md) |
| Host configuration | [Codex / Cursor stdio setup guide](docs/mcp/npm/INSTALL.md#codex-and-other-hosts) |
| Plugin contribution | [OpenAI Community Plugins PR #57](https://github.com/openai/community-plugins/pull/57) |
| punkpeye listing | [Awesome MCP Servers PR #19484](https://github.com/punkpeye/awesome-mcp-servers/pull/19484) |
| Platform verification | [Glama rc.11 build and discovery evidence](docs/mcp/GLAMA-RC11.md) |
| Contribution checks | [Plugin tests and submission records](docs/mcp/DISCOVERY.md#rc9-contributions) |
| Linux plugin support | [OpenAI PR #57 Linux follow-up](https://github.com/openai/community-plugins/pull/57#issuecomment-6935083522) |
| Plugin trial | [Candidate plugin installation · English](docs/mcp/PLUGIN-MARKETPLACE.en.md) |
| Plugin trial | [Candidate plugin installation · English](docs/mcp/PLUGIN-MARKETPLACE.en.md) |

## Start with a real case

In **ENG20-003**, five tasks span several roles. Their combined dependencies form a strict **A → B → C → D → A** cycle. BoundaryXP brings those dependencies into one graph and preserves the original English sources and calculation records for inspection.

[![Open the demo: ENG20-003 task tree, clickable 7+1 radar and original evidence](assets/demos/workbench-en.jpg)](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=radar&lang=en)

<p align="center"><a href="https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=radar&lang=en"><strong>Click the radar to inspect evidence →</strong></a>　·　<a href="https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=report&lang=en">Read and export the 7+1 report →</a></p>

### Different cases, different results

| Result / case | What to inspect |
|---|---|
| **Violation** · [RT044](https://boundaryxp-demo.vercel.app/?lang=en#case=R389-383&axis=A&view=radar&lang=en) | Local orders combine into a strict dependency cycle |
| **Within bounds** · [RT042](https://boundaryxp-demo.vercel.app/?lang=en#case=R389-381&axis=R&view=radar&lang=en) | Adjacent half-open 10–11 and 11–12 bookings release the endpoint |
| **Incomplete information** · [L23-050](https://boundaryxp-demo.vercel.app/?lang=en#case=R389-153&axis=P&view=radar&lang=en) | “Confirmed by him” has no unique owner binding; U1 remains unknown |

Two cases have **original English sources**: ENG20-001 · Branches and a join (Within bounds) and ENG20-003 · Four-step dependency cycle (Violation).

All five come from saved 58618 records, retaining task trees, exact sources, verdicts and seven-step reports. **Reports and Markdown exports follow the top-right language switch; source evidence keeps its original language.** The demo replays B-332 records without connecting to a local service or running new analysis. B335 upgrades do not regenerate those records. Demo and saved reports

<details>
<summary>See the English report and original task text</summary>

[![English 7+1 report with Markdown export](assets/demos/report-en.jpg)](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=report&lang=en)

[![ENG20-003 original English task sources](assets/demos/english-source.jpg)](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=source&lang=en)

</details>


| Purpose | Document or page |
|---|---|
| English case · Within bounds | [ENG20-001 · Branches and a join](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-001&axis=A&view=radar&lang=en) |
| English case · Violation | [ENG20-003 · Four-step dependency cycle](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=radar&lang=en) |
| Demo and reports | [Demo guide and saved reports](docs/demo/README.md) |

## Connect to your AI workflow

**New in rc.10 / B345:** import complete L2/L3 directories through the five-step workbench UI or MCP. Read the [format specification and complete English examples](docs/mcp/npm/guides/DICTIONARIES.md). Model settings save separately from dictionaries. Existing tasks, failed jobs and rc.9 dictionaries are retained; the calculator algorithm is unchanged.

**BoundaryXP MCP** connects through standard stdio to Cursor, Codex and compatible hosts, with **21 tools, 17 resources and a local browser workbench**. The Windows x64 package includes the compiled native Core; no separate 58618 installation or hosted BoundaryXP server is required.

1. **Install from npm:** use `boundaryxp-mcp@0.4.0-rc.11`, available through the `next` prerelease channel. GitHub Releases retain the matching archive and SHA-256.
2. **Install and connect:** follow the guide to configure the host's stdio MCP server.
3. **Use your current host LLM:** the built-in host profile prepares instructions and accepts the host analysis through standard MCP tools. No separate model API key is required; an independent API profile remains optional.
4. **Open the workbench:** import complete task text, preview and confirm the task tree, then analyze and inspect evidence and reports.


| Purpose | Document or page |
|---|---|
| Windows setup | [Windows installation guide · English](docs/mcp/INSTALL.en.md) |
| Windows setup | [Windows installation guide · 中文](docs/mcp/INSTALL.zh-CN.md) |
| Tool reference | [21 MCP tools and resources](docs/mcp/TOOLS.md) |
| Updates and maintenance | [Upgrade, rollback and troubleshooting guide](docs/mcp/npm/INSTALL.md#updates) |


> **Current npm release:** boundaryxp-mcp 0.4.0-rc.11, B-348 / Windows x64, MIT. Start with the installation guide, 7+1 introduction, 21 tools and directory status. This product repository is public. Core implementation source remains in a separate private repository.


| Purpose | Document or page |
|---|---|
| Custom semantics | [L2/L3 dictionary format and English examples](docs/mcp/npm/guides/DICTIONARIES.md) |
| Updates and maintenance | [Upgrade, rollback and troubleshooting guide](docs/mcp/npm/INSTALL.md#updates) |
| npm release | [boundaryxp-mcp 0.4.0-rc.11](https://www.npmjs.com/package/boundaryxp-mcp) |
| Windows setup | [Windows installation guide · English](docs/mcp/INSTALL.en.md) |
| Product overview | [MCP 7+1 product introduction · English](docs/mcp/npm/README.en.md) |
| Tool reference | [21 MCP tools and input reference](docs/mcp/npm/guides/TOOLS.md) |
| Directory listings | [MCP listings and review status](docs/mcp/DISCOVERY.md) |

## L2 / L3: industry and enterprise semantics

The same term can mean different things across industries and organizations. L2 / L3 provide selected domain context for interpreting tasks alongside the original evidence.

| Semantic library | Purpose |
|---|---|
| **L2 · Industry** | Describes domain actions, entities, roles, resources and related terminology to help interpret requirements in their industry context. |
| **L3 · Enterprise** | Adds organization-specific terminology, organizational and role names, controlled aliases and other context to distinguish local objects and expressions. |

**There is no active L1 layer.** L0 is the BXP protocol and deterministic Core, not a semantic library. L2 / L3 do not replace source text or change the shared 7+1 verification rules. Loading a library, a job title or a reporting relationship does not grant business authority.

### Use through MCP

**rc.10 / B345 folder standard:** L2 contains **8 JSON files + README**; L3 contains **3 JSON files + README**. The workbench has **Installed dictionaries** and **Import semantic library** tabs. Import in five steps: select L2/L3 → choose the full folder → validate → name → save. Validation must pass before saving; names and selections persist after refresh. Model settings save separately. Older rc.9 dictionaries and their bindings remain readable.

For MCP import, call `bx_dictionary_format` (language `en` or `zh-CN`) for the full directory envelope and example; call `bx_dictionary_validate`, then `bx_dictionary_import` with the returned digest. Follow the returned schema; a folder is not a single dictionary JSON file. Legacy JSON tool imports remain compatible.

**[Format and file requirements](docs/mcp/npm/guides/DICTIONARIES.md)** · **[L2 English folder ZIP](docs/mcp/npm/examples/dictionary-directory-L2-en.zip)** · **[L3 English folder ZIP](docs/mcp/npm/examples/dictionary-directory-L3-en.zip)**

1. Call `bx_dictionaries_list` to inspect the L2 / L3 resources available in the current installation and their identifiers and versions.
2. Call `bx_dictionaries_bind` to validate the selected resources and obtain version-and-digest references, keeping library snapshots distinct.
3. Call `bx_dictionary_lookup` to look up entries in bound resources. Lookup does not make a semantic ruling or submit analysis.

Ask your host: **“List the available BXP L2 and L3 semantic libraries with their identifiers, versions and digests. Wait for my selection before binding; do not submit analysis.”**


| Purpose | Document or page |
|---|---|
| Windows setup | [Windows installation guide · English](docs/mcp/INSTALL.en.md) |
| Tool reference | [21 MCP tools and resources](docs/mcp/TOOLS.md) |
| Licensing and distribution | [MCP licenses, resources and third-party notices](docs/mcp/NOTICES.md) |


Available resources are determined by the installed inventory. Manage private enterprise semantic material within its own usage scope. This section documents capabilities and entry points; it does not claim a separate public GitHub library release.

## Method and research evidence

**BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation**  
Wei Zhu · English v1.2 / Chinese r23 · First published 2026-11-06

| Research cases | Task nodes | Calculation items |
|:---:|:---:|:---:|
| **625** | **3,219** | **3,469** |

The paper organizes requirements through 7+1 views and shared relations, uses BXP conventions to establish a common mathematical boundary, and checks whether subtasks and their combination exceed the parent task's boundary. Formal arguments state the conditions for the method. These figures describe research coverage, **not accuracy**. Case-level agreement, item-level differences and incomplete calculations are reported separately.


| Purpose | Document or page |
|---|---|
| English paper | [English paper PDF · v1.2](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.en.pdf) |
| Chinese paper | [Chinese paper PDF · r23](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.zh-CN.pdf) |
| Research supplement | [Public research package · ZIP](https://zenodo.org/records/24072738/files/manuscript-with-materials.zip?download=1) |
| Research material | [Paper and materials guide · English](docs/paper/README.en.md) |


**DOI: 10.5281/zenodo.24072738**. Deposited on Zenodo on 2026-11-09, retaining the first GitHub publication date. GitHub paper release and checksums

The `RESEARCH_ONLY_1` supplement contains task sources, annotations, 7+1 reports, operands, results, protocol texts, screenshots and independent research verification scripts. It excludes workbench engineering source, runtime dependencies and production prompt templates. It is maintained separately from the MCP test package.


| Purpose | Document or page |
|---|---|
| Paper citation | [Zenodo DOI · Paper record](https://doi.org/10.5281/zenodo.24072738) |
| Paper release | [GitHub paper release and checksums](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23) |

## How 7+1 connects the requirements

**I Inputs · O Outputs · A Actions · P Responsibilities and division of work · R Resources · V Version / basis · C Completion / stopping, plus independent B Prohibitions.**

Shared relations connect objects, conditions, dependencies and handoffs across task boundaries. Missing information stays missing; a role title does not grant authority.

```mermaid
flowchart LR
  A["Complete task text"] --> B["Confirm parent–child task tree"]
  B --> C["LLM joint analysis"]
  D["Selected L2 / L3 dictionaries"] --> C
  C --> E["Shared deterministic Core"]
  E --> F["Evidence, findings and unresolved items"]
  F --> G["Human / host review"]
```

The B348 joint workflow uses **one semantic analysis**, followed by Core checks, with no separate audit request or automatic retry. LLMs interpret source meaning; Core validates submitted structures, source references, bindings and supported finite operands. Core does not call models, access the network or execute task instructions.

<details>
<summary>B348 capabilities, input limits and evidence boundaries</summary>

- **Complete task trees:** whole-document UTF-8 `.txt` / `.md` import, role headings, explicit task and parent IDs, forward references, multiple levels and relationship preview.
- **Inspectable results:** task tree, 7+1 radar, model/calculator conclusions, quotations, unresolved items, saved history and exports. Failed attempts remain distinct from saved results.
- **L2 / L3:** versioned industry and enterprise dictionaries; no active L1 layer. Loading resources does not grant business authority.
- **Chinese and English:** new B348 analyses save complete reports in both languages with shared verdicts and calculation receipts. Switching languages reads the saved report; Markdown exports support the current language or both languages. Historical reports retain their original versions.
- **Mathematical input and unknowns:** allowed values, uncertain facts and parent/child plan consistency have distinct meanings. Set identities support strings and safe integers without conflating their types or filling in unknown conclusions.
- **Startup and recovery:** historical jobs load with bounded concurrency under existing recovery rules. Readiness follows HTTP identity verification.

Individual sources and serialized joint input are each limited to **1 MiB**; HTTP request bodies to **8 MiB**. Oversized input is rejected without truncation; there is no 300-code-point ceiling. See the changelog for features and historical validation scope.

Exact quotations do not prove semantic entailment. A completed job does not mean every proof passed. People and host systems retain business decisions and execution authority; `business_decision` and `execution_authorization` remain null.

The reviewed baseline is BXP-0001 `0.4.0-draft.2`; the workbench still uses a recorded draft.1 attachment. Full migration and protocol conformance are not claimed. Implementation notes · Research evidence

Host analysis, or an explicitly selected API profile, may send selected source and dictionary content to its model provider. Switching between saved B348 report languages does not request another translation. Review the analysis data flow before supplying private material.

</details>


| Purpose | Document or page |
|---|---|
| Version history | [Workbench changelog](CHANGELOG.md) |
| Protocol implementation | [BXP implementation and migration notes](protocol/IMPLEMENTATION.md) |
| Research evidence | [7+1 research and validation scope](docs/RESEARCH.en.md) |

## Explore further

| Looking for | Start here |
|---|---|
| Industry and enterprise semantics | [L2 / L3 overview](#l2--l3-industry-and-enterprise-semantics) · [Dictionary tools](docs/mcp/TOOLS.md) |
| MCP installation and usage | [Setup guide](docs/mcp/README.md) · [Release evidence](docs/mcp/RELEASE.md) |
| Method and citation | [Research overview](docs/RESEARCH.en.md) · [Paper materials](docs/paper/README.en.md) |
| Protocol and implementation differences | [BXP protocol](protocol/README.md) · [Implementation notes](protocol/IMPLEMENTATION.md) |
| Version history and contribution | [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [Documentation](docs/README.md) |

**Distribution scope:** the Git tree contains paper, protocol, cases, reports, screenshots, independent research verification scripts and MCP documentation. It excludes private workbench implementation source and source-build entry points. Compiled MCP packages are published to npm and mirrored in this repository's Releases. Original Core implementation source is excluded from those packages; adapter, UI and required resources remain readable. Full scope

**Public status:** the owner has made this product repository public. Historical audit notes describe their recorded state; public visibility alone does not confirm that old GitHub references or caches have been cleared. Audit record

The existing MIT license is retained. Paper, case data and third-party materials have their own usage terms; the MCP package has separate license and third-party notices.


| Purpose | Document or page |
|---|---|
| Distribution scope | [Repository publication scope](docs/PUBLICATION-SCOPE.md) |
| Historical audit | [Pre-publication audit](docs/PREPUBLICATION-CHECK.md) |
| Repository license | [MIT license](LICENSE) |
| Material terms | [Paper and case-data usage terms](docs/paper/materials/MATERIAL-ACCESS.md) |
| Licensing and distribution | [MCP licenses, resources and third-party notices](docs/mcp/NOTICES.md) |


