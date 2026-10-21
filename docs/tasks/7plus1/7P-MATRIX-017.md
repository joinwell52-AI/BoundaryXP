# 7P-MATRIX-017 — Medium Multi-WP Semantic Matrix v0.1

## 0. Identity

- TASK: `7P-MATRIX-017`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Start from latest HEAD carrying sealed `7P-SHORT-016-R2`
- Parent result: `SHORT_DIRECT_PARSER_VALIDATED`
- Short-parser baseline: `5deb62b198d36f7ed0ae9b5a745c28b2b9aaf73e`
- Frozen medium cases: `docs/tasks/7plus1/7P-MATRIX-017-FROZEN-CASES.md`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Purpose

The short direct parser is now validated.

This task is the first controlled move from:

```text
one short task → one Canonical 7+1
```

to:

```text
medium 2–3 stage task
→ continuous Blocks
→ WP0...WPn
→ local 7+1 per WP
→ Block × 7+1 semantic matrix
→ dependency DAG
→ simple deterministic matrix/constraint resolution
→ one Global Canonical 7+1
```

This task does **not** target the long 9-case STANDARD corpus.

This task does **not** use Hybrid model proposals, MILP, SMT, or a general-purpose optimizer.

The objective is to prove the matrix representation and cross-WP semantic flow on small, fully controlled tasks.

## 2. Required reading

Read in full:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-MATRIX-017-FROZEN-CASES.md`
4. `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
5. sealed `7P-SHORT-016-R2` REPORT / FINAL-OUTCOME
6. D01–D08 frozen short cases
7. REF-001 source + current R2 adjudication

## 3. Non-negotiable baseline

The validated short parser is the row/local semantic compiler.

For each Block/WP, reuse the same short-task semantic contracts. Do not create a second incompatible local parser.

The following must remain true throughout 017:

```text
D01–D08 FULL_CASE_CLOSED = 8/8
REF-001 legacy assertions = 43/43
wrong_binding(short baseline) = 0
unsupported_RESOLVED_extra(short baseline) = 0
```

If the matrix work breaks the short parser, stop.

## 4. Required intermediate representations

Create explicit, serializable structures.

### 4.1 Block

Each source document becomes ordered Blocks:

```text
B1, B2, ... Bn
```

Each Block must carry:

- exact source span;
- block type;
- source order;
- discourse domain;
- candidate WP owner;
- local semantic items;
- unresolved items.

Paragraph boundaries may be used, but `paragraph == WP` must not be hardcoded.

### 4.2 WP Tree

Use:

```text
WP0 = Root Work Package
WP1...WPn = stage/subtask WPs
```

For 017, hierarchy depth is limited to:

```text
WP0
├─ WP1
├─ WP2
└─ WP3
```

No nested grandchildren are required in this task.

### 4.3 Local 7+1

Each WP has:

```text
Local7Plus1(WPk)
= {Ik, Ok, Ak, Pk, Rk, Vk, Ck, Bk}
```

These are internal computation views.

### 4.4 Semantic Matrix M

Build:

```text
M[block_or_wp, slot]
```

with 8 fixed columns:

```text
I O A P R V C B
```

Every cell contains `Set<SemanticItem>`, never only a boolean.

### 4.5 Dependency DAG D

Support in 017:

- `PRODUCES_FOR`
- `CONSUMES_OUTPUT`
- `REQUIRES_COMPLETION`
- `USES_AS_BASIS`
- `SEQUENCE`
- `PARALLEL`

Do not add these as new base 7+1 relation types if an orchestration graph is sufficient.

## 5. Matrix/constraint equations v0.1

017 must implement only simple deterministic equations/constraints.

### 5.1 Output-to-input identity

If WP_i produces X and WP_j explicitly consumes X:

```text
identity(WP_i.Ox) = identity(WP_j.Iy)
```

Record:

```text
PRODUCES_FOR(WP_i.Ox, WP_j.Iy)
CONSUMES_OUTPUT(WP_j, WP_i.Ox)
```

### 5.2 Completion enables next WP

If source says next stage starts only after previous completion:

```text
WP_i.C ⇒ ENABLE(WP_j)
```

Record:

```text
REQUIRES_COMPLETION(WP_j, WP_i.C)
```

### 5.3 Parallel fork

If two WPs share the same upstream input and source says/permits parallel work:

```text
PARALLEL(WP_i, WP_j)
```

### 5.4 Join

If WP_k requires outputs/completions of two predecessors:

```text
WP_i.O + WP_j.O → WP_k.I
WP_i.C ∧ WP_j.C ⇒ ENABLE(WP_k)
```

No probabilistic selection.

## 6. Global Canonical 7+1

The final product remains **one** Canonical 7+1.

Global projection is not a string union.

Each SemanticItem must preserve:

- semantic identity;
- `wp_id`;
- `stage_role`;
- source spans;
- produced_by / consumed_by;
- condition;
- proof lineage.

Required stage roles in 017:

- `EXTERNAL_INPUT`
- `INTERMEDIATE_INPUT`
- `INTERMEDIATE_OUTPUT`
- `FINAL_OUTPUT`
- `LOCAL_COMPLETION`
- `GLOBAL_COMPLETION`
- `GLOBAL_CONSTRAINT`

An intermediate artifact may legitimately appear in both:

```text
WP1.O
WP2.I
```

with one semantic identity and two stage roles.

## 7. Frozen cases

Use only the ADMIN-authored M01–M04 cases in the frozen-case file as the primary 017 benchmark.

Do not modify their source or expected semantics after implementation begins.

If a frozen contract is objectively inconsistent with source, stop with:

`ADMIN_MATRIX_CASE_REVIEW_REQUIRED`

## 8. Progressive gates

### G0 — segmentation + 2 WP sequential

Case: M01

Must pass:

- blocks correct;
- WP0/WP1/WP2 correct;
- local 7+1 correct;
- matrix cells correct;
- WP1.O → WP2.I identity correct;
- WP1.C → WP2 enable correct;
- Global 7+1 correct.

### G1 — 3 WP sequential + reviewed completion

Case: M02

Must pass G0 plus:

- 3 WPs;
- two O→I links;
- reviewed completion gates WP3;
- participant roles remain local/correct.

### G2 — parallel fork/join

Case: M03

Must pass G0/G1 plus:

- parallel WP1/WP2;
- join into WP3;
- no cross-branch semantic contamination;
- both predecessor completions required.

### G3 — global V/B inheritance + join

Case: M04

Must pass G0–G2 plus:

- global basis/version represented at WP0;
- global source-protection prohibition represented at WP0;
- child WPs inherit the constraint semantically without duplicating it as unrelated local facts;
- final Global 7+1 remains correct.

## 9. Exact success gate

```text
M01–M04 block segmentation = 4/4
M01–M04 WP tree = 4/4
M01–M04 local 7+1 = 4/4
M01–M04 dependency DAG = 4/4
M01–M04 semantic matrix = 4/4
M01–M04 Global Canonical 7+1 = 4/4

wrong WP assignment = 0
wrong O→I identity = 0
wrong completion dependency = 0
cross-WP contamination = 0
unsupported RESOLVED orchestration edge = 0

D01–D08 retained = 8/8
REF-001 legacy = 43/43
repeatability = EXACT
```

If any primary M01–M04 case fails, do not move to the long STANDARD stage.

## 10. No long-task tuning

The existing long STANDARD corpus may be used only after 017 closes, in a later separately authorized task.

Do not:

- run it as a tuning target;
- add phrase rules from it;
- inspect its expected answers while implementing M01–M04;
- claim long-task success from 017.

## 11. Validation

Run:

- focused 017 tests;
- retained 016-R2 short tests;
- original Parser regression;
- full repository regression after G3;
- repeat M01–M04 + D01–D08 + REF-001;
- anti-overfit;
- protected assets;
- SEAL.

## 12. Allowed outcomes

Exactly one:

- `MEDIUM_MATRIX_PARSER_VALIDATED`
- `G0_SEGMENTATION_MATRIX_FAILED`
- `G1_SEQUENTIAL_DEPENDENCY_FAILED`
- `G2_PARALLEL_JOIN_FAILED`
- `G3_GLOBAL_CONSTRAINT_FAILED`
- `ADMIN_MATRIX_CASE_REVIEW_REQUIRED`
- `IMPLEMENTATION_GATE_FAILED`

## 13. Required report package

Create:

`docs/reports/7plus1/7P-MATRIX-017/`

At minimum:

- REPORT.md
- FROZEN-CASE-VERIFICATION.json
- BLOCKS.json
- WP-TREES.json
- LOCAL-7PLUS1.json
- SEMANTIC-MATRICES.json
- DEPENDENCY-DAGS.json
- MATRIX-EQUATION-AUDIT.json
- GLOBAL-7PLUS1-COMPARISON.json
- G0-GATE.json
- G1-GATE.json
- G2-GATE.json
- G3-GATE.json
- SHORT-BASELINE-RETENTION.json
- REF001-RETENTION.json
- SEMANTIC-ERRORS.json
- REPEATABILITY.json
- FULL-REGRESSION.json
- ANTI-OVERFIT-AUDIT.json
- PROTECTED-ASSET-VERIFICATION.json
- FINAL-OUTCOME.json
- NEXT-TASK-RECOMMENDATION.md
- VERIFY.json
- MANIFEST.json
- SHA256SUMS.txt
- SEAL.md
- SEAL-VERIFICATION.json

For each M case also generate a readable Markdown artifact showing:

```text
Blocks
WP Tree
Local 7+1
Matrix
Dependency DAG
Global 7+1
```

## 14. Git / production rules

- work only on `review/7plus1-parser`;
- do not modify sealed 016/016-R1/016-R2 reports;
- do not modify D01–D08 or REF-001 source/Gold;
- do not modify v0.3 normative meaning in this task;
- do not merge/release/tag;
- do not switch production;
- stop at `WAITING_ADMIN_REVIEW`.

## 15. Final return

Return:

- TASK
- final commit
- terminal outcome
- G0/G1/G2/G3
- block segmentation count
- WP tree count
- local 7+1 count
- dependency DAG count
- semantic matrix count
- Global Canonical 7+1 count
- wrong WP / O→I / completion dependency / contamination counts
- D01–D08 retention
- REF-001 retention
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
