# 7P-SHORT-016 — Short Direct 7+1 Parser Foundation

## 0. Task identity

- TASK: `7P-SHORT-016`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Start from current branch HEAD carrying sealed `7P-HYBRID-015`
- Deterministic implementation baseline: sealed `7P-COMPOSITION-014` at `f03d09a099f06a4da2786a3c8e9dcd9fdb50dd37`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Benchmark authority: `docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md`
- PRODUCTION_READY=false

## 1. Purpose

This task is **not Hybrid**, **not WP decomposition**, **not Matrix**, and **not long-document parsing**.

The only goal is:

```text
short single-flow natural-language task
→ direct 7+1 parser
→ complete Canonical 7+1
→ JSON + Markdown
```

Do not use the unsafe 015 upstream proposal lane in the semantic path.

Use the 014 deterministic parser as implementation baseline and repair the short-task direct compiler generically.

The existing long 9-case STANDARD set is out of scope and must not drive implementation.

## 2. Required reading

Read in full:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md`
4. `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
5. `docs/reports/7plus1/7P-HYBRID-015-SHORT-r02/REPORT.md`
6. `docs/reports/7plus1/7P-HYBRID-015-SHORT-r02/FIRST-DIVERGENCE.json`
7. `docs/reports/7plus1/7P-HYBRID-015-SHORT-r02/FALSE-WRONG-STATUS-BEFORE-AFTER.json`
8. `docs/reports/7plus1/7P-HYBRID-015-SHORT-r02/OWNED-CONTENT-BEFORE-AFTER.json`
9. `fixtures/7plus1/golden/REF-001/source.txt`
10. `fixtures/7plus1/golden/REF-001/expected-7plus1.json`

Do not read existing long STANDARD expected answers for implementation work.

## 3. Frozen short-task rule

All 016 primary cases are authored by ADMIN and frozen before coding.

Do not:

- change source text after implementation starts;
- change expected semantics after implementation starts;
- add case-specific runtime branches;
- match case IDs, literal hashes, offsets, names, file names, or expected values in runtime;
- use long STANDARD as a tuning source.

If an expected semantic contract is found objectively inconsistent with the source, stop and report `ADMIN_CASE_CONTRACT_REVIEW_REQUIRED`; do not silently change it.

## 4. Architecture boundary

Create an isolated candidate such as:

`research/7plus1-parser/v0.3-7p-short-direct-016/`

Allowed inputs:

- document structure;
- HanLP/spaCy syntax, NER, SRL;
- typed literals;
- existing deterministic semantic mechanisms from 014.

The 015 BGE/E5/NLI upstream relation-proposal lane must be absent from the 016 semantic path.

Post-parse model diagnostics may remain only if they cannot change Candidate Graph, Eligibility, Boundary IR, Canonical 7+1, slot status, or proof.

## 5. What must be fixed

Use the frozen cases to repair **classes of short-task semantic errors**, especially:

1. input/output semantic identity and deduplication;
2. object-role normalization;
3. performer vs reviewer vs recipient;
4. time/resource R;
5. basis + version V composition;
6. condition/completion composition;
7. conditional output without turning NOT_REQUIRED into B;
8. OUTPUT_CONTENT ownership;
9. background/exclusion statements not becoming current B;
10. correct slot status: RESOLVED / ABSENT / UNRESOLVED / PARSER_COVERAGE_FAILURE;
11. complete proof/provenance.

Do not solve these as phrase-specific patches.

## 6. Progressive gates

Run the frozen cases in this order.

### Gate G0 — basic direct 7+1

Cases: `D01`, `D02`

Required: both achieve exact semantic closure.

### Gate G1 — R and V

Cases: `D03`, `D04`

Required: G0 remains closed; D03/D04 exact semantic closure.

### Gate G2 — participant roles and conditional output

Cases: `D05`, `D06`

Required: G0/G1 remain closed; D05/D06 exact semantic closure.

### Gate G3 — OUTPUT_CONTENT and English equivalence

Cases: `D07`, `D08`

Required: G0–G2 remain closed; D07/D08 exact semantic closure.

### Gate G4 — REF-001 anchor

Run existing `REF-001`.

Required:

- no regression of source-supported semantics;
- the known “上述材料” ambiguity remains UNRESOLVED unless a source-complete unique referent certificate exists;
- full Canonical comparison is reported separately from legacy meeting assertions.

If any gate fails, remain within that gate’s semantic class. Do not start WP/Matrix/long-task work.

## 7. Exact closure definition

A case is `FULL_CASE_CLOSED` only when:

- every expected I/O/A/P/R/V/C/B semantic requirement is present;
- every expected slot state is correct;
- no expected requirement is only partial;
- no wrong binding exists;
- no unsupported RESOLVED extra exists;
- no duplicate semantic identity survives projection;
- OUTPUT_CONTENT requirements are attached to the correct output owner;
- conditional semantics preserve modality and condition;
- every RESOLVED entry has source/proof lineage.

String equality is not required; semantic identity is.

## 8. Required output documents

For every case generate:

- `canonical-7plus1.json`
- `canonical-7plus1.md`
- `comparison.json`
- `trace.json`

The Markdown must be a readable 7+1 document, not a debug dump.

## 9. Validation

Run:

- focused 016 tests;
- retained 014 deterministic short-relevant tests;
- original Parser regression;
- full repository regression after G4;
- repeat run of all 016 cases;
- anti-overfit scan;
- protected-asset verification.

Do not count regression PASS as semantic closure.

## 10. Primary success gate

Required before any next stage:

```text
D01–D08 FULL_CASE_CLOSED = 8/8
D01–D08 same-case I/O/A closed = 8/8
wrong_binding = 0
unsupported_RESOLVED_extra = 0
duplicate_semantic_identity = 0
repeatability = EXACT
REF-001 legacy meeting assertions = PASS
```

REF-001 full Canonical closure is reported but is not allowed to hide a failure in D01–D08.

## 11. Stop rules

Allowed terminal outcomes:

- `SHORT_DIRECT_PARSER_VALIDATED`
- `G0_BASIC_GATE_FAILED`
- `G1_RESOURCE_BASIS_GATE_FAILED`
- `G2_ROLE_CONDITION_GATE_FAILED`
- `G3_OUTPUT_CONTENT_GATE_FAILED`
- `G4_REF001_REGRESSION`
- `ADMIN_CASE_CONTRACT_REVIEW_REQUIRED`

If D01–D08 do not reach 8/8 full closure, do not proceed to Matrix/WP work.

Do not create another Hybrid experiment in this task.

## 12. Required report package

Create:

`docs/reports/7plus1/7P-SHORT-016/`

At minimum:

- `REPORT.md`
- `BASELINE.json`
- `FROZEN-CASE-VERIFICATION.json`
- `G0-GATE.json`
- `G1-GATE.json`
- `G2-GATE.json`
- `G3-GATE.json`
- `G4-REF001.json`
- `FULL-CASE-MATRIX.json`
- `SEMANTIC-ERRORS.json`
- `DUPLICATE-IDENTITY-AUDIT.json`
- `OUTPUT-CONTENT-AUDIT.json`
- `SLOT-STATUS-AUDIT.json`
- `REPEATABILITY.json`
- `FULL-REGRESSION.json`
- `ANTI-OVERFIT-AUDIT.json`
- `PROTECTED-ASSET-VERIFICATION.json`
- `FINAL-OUTCOME.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

## 13. Git / production rules

- work only on `review/7plus1-parser`;
- do not modify sealed 008–015 reports;
- do not modify existing Gold/Source;
- do not modify v0.3 normative meaning in this task;
- do not merge/release/tag;
- do not switch production entry;
- stop at `WAITING_ADMIN_REVIEW`.

## 14. Final return

Return:

- TASK
- final commit
- terminal outcome
- G0/G1/G2/G3/G4 states
- D01–D08 full closure count
- D01–D08 same-case I/O/A closure count
- wrong-binding count
- unsupported RESOLVED extra count
- duplicate semantic identity count
- REF-001 legacy assertion result
- REF-001 full Canonical result
- focused / original / full regression counts
- repeatability result
- anti-overfit result
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
