<p align="center"><strong>English</strong> · <a href="README.zh-CN.md">简体中文</a></p>
<p align="center"><img src="assets/branding/v2/BoundaryXP-logo-light.png" alt="BoundaryXP · 界痕" width="320"></p>

<h1 align="center">From source to boundaries, every step is visible.</h1>

<p align="center">
  <img src="https://img.shields.io/badge/MCP-21%20tools-2563eb?style=flat-square" alt="MCP · 21 tools">
  <img src="https://img.shields.io/badge/Semantics-L2%20%2B%20L3-7c3aed?style=flat-square" alt="L2 industry and L3 enterprise semantics">
  <img src="https://img.shields.io/badge/Language-ZH%20%2F%20EN-0891b2?style=flat-square" alt="Chinese and English">
</p>

BoundaryXP organizes complete tasks into an evidence-linked **7+1 relational representation**. It helps inspect whether AI plans and parent–child task decompositions preserve required outputs, responsibilities, resource limits and prohibitions. LLMs interpret source text; a deterministic Core checks submitted structures and supported calculations.

Connect through MCP or use the local browser workbench. Findings are **Violation, Within bounds or Incomplete information**, with source quotations and calculation records for inspection.

## Start with a real case

In **ENG20-003**, five tasks span several roles. Their combined dependencies form the strict **A → B → C → D → A** cycle. The demo preserves the original English sources and calculation records.

[![Open the interactive demo: task tree, 7+1 radar and original English evidence](assets/demos/workbench-en.jpg)](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=radar&lang=en)

**Click the screenshot to try the demo.** Select a case, click a radar view and inspect sources or the full report. Reports and Markdown exports follow the interface language; task evidence retains its source language.

| Case | Displayed result |
|---|---|
| RT044 · Cross-team orders combine into a strict cycle | **Violation** |
| RT042 · Adjacent instrument bookings release the shared endpoint | **Within bounds** |
| L23-050 · “Confirmed by him” has no unique accountable-owner binding | **Incomplete information** |

The demo replays five saved 58618 development cases, including two originally written in English. It retains their B-332 task trees, verdicts and seven-step reports without connecting to a local service or rerunning analysis. It is not a new acceptance test of the current release.

## Install and connect

**21 tools · 17 resources · Node.js ≥22.18 · Compiled B-335 Core.**

Default analysis uses the current host LLM without a separate model API key; an explicit independent API mode is also available. The package includes Core, with no separate 58618 installation or hosted BoundaryXP server required.

| Platform | Installation |
|---|---|
| Windows x64 | [Windows installation and upgrades](docs/mcp/INSTALL.en.md) |
| Linux x64 / Docker | [Linux and Docker installation](docs/mcp/linux/INSTALL.en.md) |

Windows uses **0.4.0-rc.9** on latest/next; Linux uses **0.4.0-rc.9-linux.1** on the linux channel and requires glibc ≥2.36. Both are prereleases. Existing rc.8 installations need the newer installer and the original data path preserved, as described in the guide.

Configure a stdio MCP server in your host, open the workbench, import complete task text, preview and confirm parent links, then analyze and inspect reports.

## How 7+1 works

**I Inputs · O Outputs · A Actions · P Responsibilities and division of work · R Resources · V Version / basis · C Completion / stopping, plus independent B Prohibitions.**

Shared relations preserve objects, conditions, dependencies and handoffs across task boundaries. Missing information stays missing; a role title does not grant authority.

## L2 / L3: industry and enterprise semantics

| Semantic library | Purpose |
|---|---|
| **L2 · Industry** | Domain actions, entities, roles, resources and terminology provide industry context for interpreting tasks. |
| **L3 · Enterprise** | Organization-specific terminology, organizational and role names, controlled aliases and related context distinguish local objects and expressions. |

rc.9 supports custom-dictionary formats, validation and import. Validate first and import with the returned digest, then explicitly select version-and-digest-bound resources. Import does not bind resources or edit existing tasks automatically, and does not establish semantic correctness.

There is no active L1 layer. L0 is the BXP protocol and deterministic Core, not a semantic library. Loading resources, job titles, grades or reporting relationships does not establish business authority.

## Method and research evidence

**BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation**  
Wei Zhu · English v1.2 / Chinese r23 · First published 2026-11-06.

The research material covers **625 cases, 3,219 task nodes and 3,469 calculation items**. These figures describe coverage, **not accuracy**. Case-level agreement, item-level differences and incomplete calculations are reported separately.

The 7+1 method has assumptions and limits. Formal arguments and existing cases do not establish correctness for every natural-language task. The MCP implementation, model interpretations and resources can be wrong; deterministic calculation does not by itself validate its representation or interpretation.

## Capabilities and boundaries

- **Complete tasks:** whole-document UTF-8 .txt / .md import, explicit task and parent IDs, repeated roles, multiple levels and relationship preview.
- **Inspectable results:** task tree, 7+1 radar, LLM/calculator findings, quotations, unresolved items, history and bilingual report exports. Failed attempts remain distinct from saved results.
- **Input limits:** individual sources and serialized joint input are each limited to 1 MiB; HTTP request bodies to 8 MiB. Oversized input is rejected without truncation.
- **Responsibility:** Core does not call models, access the network or execute task instructions. Analysis and first-time translation data flows depend on the selected host or model provider. Program checks do not grant execution authority; people and host systems retain business decisions.

The reviewed baseline is BXP-0001 draft.2; B-335 still uses a recorded draft.1 attachment. Full migration and protocol conformance are not claimed. Directory listings, successful builds and platform scores do not certify algorithmic or semantic correctness.

## Help improve BoundaryXP

Questions, criticism, counterexamples, independent reproductions and PRs are welcome in Chinese or English. You do not need to endorse the approach or prove a defect before participating. Contribute documentation, protocol discussion, cases, dictionary examples and independent checks using minimal material you are allowed to publish.

This public repository contains paper, protocol, guides, research material and compiled releases. Original Core implementation source remains private. Paper, case-data and third-party usage terms remain distinct. Public visibility alone does not confirm that historical GitHub references or caches have been cleared.

## Explore further

| Looking for | Start here |
|---|---|
| MCP tools and custom semantics | [21-tool reference](docs/mcp/TOOLS.md) · [L2/L3 dictionary guide](docs/mcp/npm/guides/DICTIONARIES.md) |
| Paper and research material | [Paper and materials](docs/paper/README.en.md) · [Zenodo DOI](https://doi.org/10.5281/zenodo.24072738) |
| Protocol and implementation scope | [BXP protocol](protocol/README.md) · [Implementation notes](protocol/IMPLEMENTATION.md) |
| npm, directories and plugins | [npm package](https://www.npmjs.com/package/boundaryxp-mcp) · [Listings and review status](docs/mcp/DISCOVERY.md) |
| Version history and full documentation | [Changelog](CHANGELOG.md) · [Documentation](docs/README.md) |
| Questions and contributions | [Open an issue](https://github.com/joinwell52-AI/BoundaryXP/issues/new/choose) · [Contributing](CONTRIBUTING.md) |
| License and publication audit | [MIT license](LICENSE) · [Scope and material terms](docs/PUBLICATION-SCOPE.md) · [Historical audit](docs/PREPUBLICATION-CHECK.md) |
