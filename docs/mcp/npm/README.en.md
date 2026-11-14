[简体中文](https://www.npmjs.com/package/boundaryxp-mcp#简体中文) | **English**

# BoundaryXP · BXP

**7+1 task boundary analysis and computational verification for AI agents and teams.**

Turn complete task requirements into evidence-backed **7+1 relationships**. Inspect parent–child tasks and their combined constraints, then trace why a result is **out of bounds, within bounds or incomplete**. LLM judgments and native calculator results are recorded separately, alongside original evidence and unspecified conditions.

**boundaryxp-mcp 0.4.0-rc.7 · B-335 · Windows x64 · Node.js ≥22.18 · MIT · Prerelease**

[Installation and upgrades](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.md) · [Public repository](https://github.com/joinwell52-AI/BoundaryXP) · [Releases](https://github.com/joinwell52-AI/BoundaryXP/releases)

Connect through standard **stdio MCP** in Cursor, Codex or compatible hosts. The package includes **18 tools, 10 resources, English and Chinese built-in help, a compiled Core and a local browser workbench**. No separate BoundaryXP installation or hosted BoundaryXP server is required. This release does not include macOS or Linux native packages.

## What does 7+1 mean?

Seven task dimensions plus one independent prohibition boundary—not a score or a count of agents.

| Dimension | What to inspect |
|---|---|
| **I · Input** | Which data, materials and sources are in scope? |
| **O · Output** | What must be delivered, and to whom? |
| **A · Action** | Which actions are specified or permitted? |
| **P · Responsibility** | Who owns the work, cooperation and handoffs? |
| **R · Resources** | Which workspace, capacity, budget or time limits apply? |
| **V · Version basis** | Which rule, document or baseline version applies? |
| **C · Completion and stopping** | What defines completion or a required stop? |
| **+1 B · Prohibitions** | What is explicitly forbidden? |

Missing conditions remain unspecified. Versioned L2 industry and L3 enterprise dictionaries support interpretation; roles, names and dictionary entries do not grant permission.

## A parent–child example

> **Parent:** Only inspect the test directory, deliver an inspection report, and do not deploy to production.
>
> **DEV-01:** Inspect test files and deliver the report.
>
> **DEV-02:** Deploy to production after the report is complete.

Each child is assessed separately. DEV-02 introduces a deployment clause that conflicts with the parent's stated prohibition; the report should trace both source clauses. This illustrates what to inspect, not a saved result or a guarantee of correct model interpretation.

Import complete UTF-8 Markdown/TXT, explicit task and parent IDs, multiple hierarchy levels and multiple children with the same role. DEV-01 and DEV-02 remain separate nodes. Preview relationships before analysis.

[Try the interactive demo](https://boundaryxp-workbench-demo.joinwell52.chatgpt.site/?lang=en) for saved B-332 cases: RT044 has a strict dependency cycle, RT042 has adjacent half-open intervals, and L23-050 has an unresolved owner reference. These are historical replays, not new MCP analyses or B-335 test results.

## How verification works

1. **Import:** Preview the full task tree and bind any L2/L3 dictionaries.
2. **Interpret:** Explicitly submit one joint LLM analysis to produce 7+1 relationships, evidence, a semantic judgment and formal calculation inputs.
3. **Verify:** The native Core evaluates supported set, Boolean and numeric queries, recording actual operands and receipts.
4. **Inspect:** Compare judgments for the same task and scope. Trace evidence and unknowns; retain failed responses.

The calculator does not call an LLM. A successful calculation does not prove that semantic extraction is correct. Neither LLM judgment nor verification grants business approval or execution authority.

## What you can inspect

- Task trees, distinct child assessments and complete 7+1 analysis.
- An eight-axis boundary radar, independent prohibitions and source evidence.
- LLM judgments, formal inputs, calculation receipts and technical reports.
- Markdown reports, historical results and retained failure records.
- The same saved project through MCP and the browser workbench.

The radar shows clause relationships, not scores, progress or authority.

## Quick start in Cursor

Requires Windows x64, Node.js ≥22.18 and npm; tested with Node 24.19.0. Initial startup downloads the package and dependencies. Merge this entry into your host configuration, retain other servers and replace the example data path with your persistent absolute path.

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "npx.cmd",
      "args": ["--yes", "boundaryxp-mcp@0.4.0-rc.7", "--data-root", "C:/BXP/data"]
    }
  }
}
```

This entry pins a version and does not auto-update. For Codex, API setup and managed updates, follow the [English installation guide](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.md). Existing users must retain their original data and settings paths.

After connection, expect **18 tools**. Ask:

> Call BoundaryXP bx_capabilities and bx_workbench_open; return the version and workbench URL without submitting analysis.

Open the returned local URL. Its port changes after reconnection; request a new URL instead of saving an old port. Closing the browser leaves MCP running. Disconnecting the last MCP client stops the backend and cancels unfinished work, so finish active jobs first.

## Model access and first analysis

Read-only help, saved results and the workbench need no model key. **New analysis uses your configured model API/profile; it does not inherit your Cursor or Codex chat subscription.** See [model configuration](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.md#model-configuration). Analysis sends selected task/dictionary content to your provider and may incur charges. Core calculation runs locally. Keep keys in a local env file, never in task text or chat.

Use the [complete multi-DEV example](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.en.md), then ask:

> Import this parent–child task into BoundaryXP, keeping every DEV task ID. Preview relationships first. After confirmation, save and analyze once with my configured profile. Return LLM judgment, calculator verification, source evidence and the workbench URL. Do not automatically retry failures.

## Tool help through MCP

Ask: **“Read BoundaryXP tool help, multi-DEV examples and troubleshooting in English.”**

The help entry is `bx_capabilities({"language":"en","help_topic":"tools"})`. Resources are `boundaryxp://help/en/{overview|tools|examples|troubleshooting}`. Use discovered schemas for exact arguments. Help is available directly through MCP without reading local documentation.

Tools cover capabilities, profiles, L2/L3 dictionaries, task import and validation, project management, analysis submission/cancellation, job status, result/file retrieval, zero-model rechecks of saved operands and opening the workbench.

## Updates and distribution

[Managed installation and optional automatic updates](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.md#updates) retain data and settings. Automatic checks and upgrades default to off. Prepared updates activate at a safe next start after related clients exit; running work is not forcibly interrupted.

The public repository provides product documentation and compiled releases. The native Core ships without its original C++ or JavaScript implementation source. Adapter, UI, prompt files and required resources remain readable. MIT and third-party notices are included. This prerelease makes no blanket protocol-conformance or model-accuracy claim.

[Directory status](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/DISCOVERY.md) distinguishes live listings from pending reviews.
