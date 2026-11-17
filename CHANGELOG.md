<p><strong>English</strong> · <a href="CHANGELOG.zh-CN.md">简体中文</a></p>

# Workbench changelog

The current workbench baseline is **B345**. MCP rc.10 incorporates B345 functionality; its calculator algorithm remains unchanged. See [MCP release evidence](docs/mcp/RC10.md) and [L2/L3 directory specification](docs/mcp/npm/guides/DICTIONARIES.md). The B335 entries below remain historical records compiled on 2026-11-09 from their original receipts.

This repository distributes research and protocol materials. These notes describe the private workbench without distributing source, installation packages, raw runtime logs or private task data. The [redacted verification summary](docs/releases/WORKBENCH-HISTORY-VERIFICATION.json) retains build identities, check scopes, counts and source-receipt digests. Papers and saved cases retain their actual historical versions.

## 2026-11-06 — B335: startup and readiness

**Changes:** replace serial historical-job loading with bounded concurrent reads while preserving recovery rules and invalid-JSON errors. Report readiness only after HTTP identity matches the target installation. Early exit, identity mismatch and failed readiness waits produce explicit errors.

**Historical verification:**

- Four focused tests passed. An isolated service started with byte-identical copies of 6,450 real historical job files.
- Verified HTTP identity took about 10.68 seconds in isolation and 4.18 seconds in one installed-service measurement. These describe the recorded machine and cache conditions, not a fixed guarantee after reboot.
- Digests of 22,973 protected result, project-snapshot and job files remained unchanged. UI, radar, report rendering, Core, dictionaries and analysis-rule bytes were preserved.
- The corresponding private-source snapshot matched all 550 manifest files and passed an independent empty-data startup and asset check. The startup repair made no new model calls or Core recalculations.

## 2026-11-05 — B334: set identities and uncertain interpretations

**Changes:** support string and safe-integer set identities without conflating their types, guessing aliases or rounding identifiers. Keep uncertain interpretations, versions and references as unresolved choices. A branch diagnostic does not become an unconditional verdict; explicit conflicts remain findings.

**Historical verification:**

- Separate source and candidate checks passed 18 and 24 tests, with 128 independent typed-membership reference cases.
- Offline replay of 185 items from 30 old candidates restored four native-integer inputs from invalid to valid. This was replay of saved inputs, not 30 new model assessments.
- All 549 installed manifest files were verified; 545 remained byte-identical, including all UI, radar, translation and report resources.
- Two existing projects each received one completed reassessment. Original sources and old results were retained. Backup file sets and digests were verified before delivery continued.

## 2026-11-04 — B333: calculation purpose and input checks

**Changes:** distinguish permitted plan ranges from uncertain actual values. Parent/child consistency checks reject formulas placed on a side that would otherwise be ignored. Reported costs use original numeric operands and uncertainty ranges. Incomplete items remain separate from completed or matching calculations.

**Historical verification:**

- Two isolated baselines each passed 39 focused checks covering endpoints, purpose, consistency, cost intervals and incomplete counts.
- All 549 installed manifest files were verified; 545 remained byte-identical.
- Three existing projects each received one reassessment: all 20 calculations completed, with no calculation differences, invalid inputs or incomplete items.
- Digests of 680 frozen result and record files from the original 40 cases were preserved. Reassessing three cases was not a fresh run of all 40; earlier failures and differences retain their original scope.

## 2026-11-03 — B332: capability and documentation baseline

This is a historical capability check, not a claim that every capability was introduced that day:

- Complete parent/child task trees; UTF-8 text or Markdown import; explicit IDs and relationship preview.
- One joint semantic request produces 7+1 relations and calculation input, followed by shared Core checks. L2/L3 resources are active; L1 is not.
- Chinese/English UI, report translation, original evidence, radar and Markdown exports.
- Individual sources and serialized joint input each allow 1 MiB; HTTP bodies allow 8 MiB. Oversized input is rejected without truncation; there is no 300-code-point ceiling.

The recorded check covered 549 installed manifest files, 11 maintenance documents and 83 relative links. That documentation task did not upgrade, restart or alter the installed service.

## Reading these records

Tests and measurements above belong to their original dates. The 2026-11-09 work only updates documentation and checks evidence; it does not repeat builds, installations, model assessments or Core calculations. The hosted demo continues to replay fixed cases.

B335 still uses a recorded draft.1 runtime attachment. Protocol draft.2 review, paper revisions, dictionary versions and workbench builds have distinct identities. Neither upgrade records nor program checks grant business approval or execution authority.

[English overview](README.md) · [中文升级日志](CHANGELOG.zh-CN.md) · [Documentation](docs/README.md)
