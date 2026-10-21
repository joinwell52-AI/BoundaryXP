# BoundaryXP short-text compiler: quick start

[简体中文](QUICKSTART.md) · [Home](README.md) · [Version and acceptance status — Chinese](docs/SHORT-COMPILER-STATUS.md)

Documentation date: 2026-10-08. The available short-text compiler is a **runnable candidate, not a fully accepted product release**. Distinguish the installed user application, the development checkout, and the older BXP application before choosing a command.

> **2026-10-21: main includes ui220 candidate sources and the reproducible build entry.** See [ui220 build and validation](docs/workbench/UI220-SYNC.md). Existing port-58618 installations use `npm run 7plus1:ui`. The 2026-10-08 package references, branch differences and scores below are historical; build ui220 for a new installation.

## 1. Existing local installation: fixed port 58618

In the Windows development checkout whose installation and entry restoration are already complete:

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

Open `http://127.0.0.1:58618/`. When the same installed version is already running, the launcher returns its address without starting another server. Verify live state on the machine; a PID recorded in an old report is not a safe process identifier for future maintenance.

The launcher currently pins candidate `0.1.0-candidate.031-r1.2`, compiler `031-r1-c3`, and contract `031-r1.1`. Configuration and history are under `.boundx/short-compiler-031-r1/`; complete runtime versions are under its `versions/` directory. The application does not mix installed resources with changing development Skills or schemas.

**This is not a fresh-clone installer.** Missing installation files, an unexpected version, an occupied or unverified port, or mismatched resource hashes cause an explicit error. The launcher neither chooses another port nor stops an unknown process. See the [development launcher](https://github.com/joinwell52-AI/BoundaryXP/blob/a55363226b465cb120ce8f2624d5d900d5a39d9d/product/short-compiler/launch-installed.mjs) and the [restoration receipt](https://github.com/joinwell52-AI/BoundaryXP/blob/a55363226b465cb120ce8f2624d5d900d5a39d9d/docs/reports/7plus1/031-R1-RESTORE-58618/REPORT.md).

## 2. Requirements and normal use

The tested environment requires Windows, Node.js 22.18 or newer, and a locally installed, signed-in Codex CLI with available usage. Do not add an API key, change billing routes, or modify global account settings for these instructions. Task text is sent to the configured model service: a local UI is not offline inference.

Paste a nonempty task or upload a UTF-8 `.txt` or `.md` file, up to 300 Unicode code points, then start compilation. The current supported task profile is a single ADMIN task in Chinese, possibly containing technical identifiers. Multiple actions or roles do not automatically make it multiple work packages. Oversized input must not be truncated.

Inspect actions, objects, participants, modality, conditions, provenance, and unresolved portions. The detailed view exposes proposals, audit results, technical checks, and IR. Export JSON, the Chinese rendering derived from that same structure, or the full trace. Viewing history must not call the model again. Editing the source creates a new source identity and a new run.

Parsing and the separate audit take actual model time; follow the stage display. Refreshing should recover the same run rather than resubmit it. Cancellation confirms only the controlled local process state, not remote computation or billing. A completed run, unresolved meaning, and product acceptance are different outcomes.

## 3. Fresh installation from a complete candidate package

Use the [031-R1 delivery page](https://github.com/joinwell52-AI/BoundaryXP/blob/a55363226b465cb120ce8f2624d5d900d5a39d9d/docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/REPORT.md) and its [versioned package](https://github.com/joinwell52-AI/BoundaryXP/blob/a55363226b465cb120ce8f2624d5d900d5a39d9d/docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/delivery/BoundaryXP-short-compiler-0.1.0-candidate.031-r1.2.zip). These resources are linked to the development snapshot, not copied into main. The candidate still has the documented Q05 universal-scope limitation. A downloadable package does not establish semantic acceptance.

Only on a fresh installation where port 58618 is available, run from the extracted package root:

```bat
node product/short-compiler/deploy.mjs install --home D:\boundx-short --port 58618
node product/short-compiler/deploy.mjs start --home D:\boundx-short
```

Do not install over an existing instance, delete its history, or take over an occupied port. An independently chosen installation home differs from the development checkout's default home; that checkout launcher does not automatically discover arbitrary locations.

The newer `0.1.0-candidate.031-r1.q05.1` development package adds explicit universal-scope structures but has unresolved domain interpretation and incomplete full validation. It is not an automatic upgrade target. See the [status page](docs/SHORT-COMPILER-STATUS.md).

## 4. Compare the UI and CLI only within the same version

From the root of the **same complete installed version**:

```bat
npm run 7plus1 -- --input D:\boundx\task.txt --output D:\boundx\new-run-directory
```

Use a new output directory; do not overwrite an earlier run. This command invokes models. History and explicit frozen-response replay are different operations and do not count as fresh model validation.

In the development branch checkout, `npm run 7plus1` points directly to the working-tree core, which may already use the newer Q05 contract. In contrast, `npm run 7plus1:ui` pins the installed candidate. They share the implementation lineage, but are not necessarily the same version today. A working-tree CLI run and an older installed UI run are not a valid same-version comparison. Neither script is provided by main in this documentation-only update.

## 5. Maintenance, upgrade, and rollback

Verify the exact instance, version, active requests, and backups before stopping it through normal approved controls. Do not kill every Node or Codex process, bypass a policy rejection, or revive a mixed-version historical process.

After a normal idle shutdown, use an approved complete new package:

```bat
node product/short-compiler/deploy.mjs upgrade --home D:\boundx-short --confirmed-idle
node product/short-compiler/deploy.mjs start --home D:\boundx-short
```

Rollback, also after stopping the identified idle instance:

```bat
node product/short-compiler/deploy.mjs rollback --home D:\boundx-short --confirmed-idle
node product/short-compiler/deploy.mjs start --home D:\boundx-short
```

These describe maintenance operations; merging documentation does not authorize an upgrade. The checkout launcher also pins a specific approved version and must be updated as part of an authorized version change. Do not disable validation to force a different version to run. Keep historical results under their generating version without automatic reparsing.

## 6. Existing main-branch BXP entry and branch differences

For the code already present on main, prepare Node.js 22.18 or newer and run from the repository root:

```bat
npm ci
node cli.mjs protocol-info
node cli.mjs evaluate examples/bxp/zh-CN-complete.json
npm run ui
```

This evaluates structured IR and starts the existing BXP application, not the short-text 58618 application. It does not itself parse raw natural-language tasks. See [protocol implementation](protocol/IMPLEMENTATION.md) and [examples](examples/README.md).

`main` and `review/7plus1-parser` remain different code snapshots. Inspect candidate code on the [development branch](https://github.com/joinwell52-AI/BoundaryXP/tree/review/7plus1-parser). This merge updates documentation without resetting a dirty checkout, merging candidate code, or moving existing tags.

## 7. Troubleshooting and evidence

Check the selected manifest, installation home, port, login, and network before interpreting a failure. A contract or digest mismatch requires a complete matching version, not a copied schema from another build. Stop retrying login, usage-limit, or policy errors instead of looping model calls.

This documentation pass checked commands against source; it did not execute maintenance or model calls on the user's machine. See [validation](docs/VALIDATION.md) and the [current status](docs/SHORT-COMPILER-STATUS.md). Detailed product and method manuals are currently Chinese; this English guide does not imply that an English output renderer or general English-task acceptance has been delivered.
