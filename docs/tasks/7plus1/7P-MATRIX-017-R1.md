# 7P-MATRIX-017-R1 — Resume Medium Multi-WP Matrix After M04 ADMIN Adjudication

## 0. Identity

- TASK: `7P-MATRIX-017-R1`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Parent task: `7P-MATRIX-017`
- Parent outcome: `ADMIN_MATRIX_CASE_REVIEW_REQUIRED`
- Parent review commit: `e40f90ea50280acb61580d681431a343d86568ec`
- ADMIN adjudication: `docs/tasks/7plus1/7P-MATRIX-017-M04-ADMIN-ADJUDICATION.md`
- Frozen cases: `docs/tasks/7plus1/7P-MATRIX-017-FROZEN-CASES.md`
- Short parser baseline: `5deb62b198d36f7ed0ae9b5a745c28b2b9aaf73e`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Resume rule

Resume 017 from pre-implementation state.

The parser was not modified in the parent review, so no rollback or reconciliation is required.

Read the ADMIN M04 adjudication before implementation. It overrides exactly one item in the original frozen M04 expectation:

```text
REMOVE:
PARALLEL(WP1, WP2)
```

All other M01–M04 contracts remain unchanged.

Do not edit or overwrite the original frozen-case file or the sealed parent review.

## 2. Orchestration evidence rule

Implement and test the following generic rule:

```text
explicit/equivalent positive parallel permission
→ PARALLEL edge may be certified

no sequence evidence
≠ parallel evidence

join on both predecessors
≠ parallel evidence
```

Therefore:

- M03 MUST emit `PARALLEL(WP1, WP2)`;
- M04 MUST NOT emit either `PARALLEL(WP1, WP2)` or `SEQUENCE(WP1, WP2)`;
- M04 MUST emit both predecessor-to-join dependencies.

Do not create a synthetic `UNORDERED` edge unless the existing orchestration schema already has a normative equivalent. Absence of a relation is sufficient.

## 3. Main architecture target

Implement:

```text
medium 2–3 stage task
→ ordered Blocks
→ WP0 + child WPs
→ local 7+1
→ Semantic Matrix M
→ Dependency DAG D
→ deterministic cross-WP constraints
→ one Global Canonical 7+1
```

The validated short direct parser remains the local/WP semantic compiler.

No Hybrid, no new model, no new Pack, no MILP/SMT, no long STANDARD tuning.

## 4. Required representations

### Blocks

Each block must preserve:

- exact source span;
- order;
- discourse type;
- candidate WP owner;
- local semantic items;
- unresolved items.

Paragraph != WP by definition.

### WP Tree

For this task:

```text
WP0
├─ WP1
├─ WP2
└─ optional WP3
```

No grandchildren.

### Local 7+1

Each WP must have a complete local semantic view generated through the validated short parser semantics.

### Semantic Matrix

Fixed columns:

```text
I | O | A | P | R | V | C | B
```

Each cell is `Set<SemanticItem>`.

### Dependency DAG

Use only source-supported/certified edges:

- PRODUCES_FOR
- CONSUMES_OUTPUT
- REQUIRES_COMPLETION
- USES_AS_BASIS
- SEQUENCE
- PARALLEL

### Global Canonical 7+1

One normalized global 7+1 preserving:

- wp_id;
- stage_role;
- semantic identity;
- source/proof;
- produced_by / consumed_by;
- condition;
- global/local ownership.

## 5. Progressive gates

### G0 — M01

2-WP sequential flow.

Required:

- block segmentation;
- WP tree;
- local 7+1;
- O→I identity;
- C→Enable;
- matrix;
- DAG;
- global 7+1.

### G1 — M02

3-WP sequence + reviewed completion.

Required:

- two O→I chains;
- two completion dependencies;
- reviewer semantics;
- no cross-WP contamination.

### G2 — M03

Parallel fork/join.

Required:

- explicit `PARALLEL(WP1, WP2)`;
- both branches isolated;
- both outputs consumed by WP3;
- both completions required before WP3.

### G3 — M04

Global basis/prohibition + underdetermined predecessor order + join.

Required:

- WP0 global V = AUDIT-RULE-3 v2.0;
- WP0 global B protects accounts.csv and permissions.csv;
- child WPs inherit constraints semantically without duplicate global facts;
- no `PARALLEL(WP1, WP2)`;
- no `SEQUENCE(WP1, WP2)`;
- WP1/WP2 both feed WP3;
- WP1.C AND WP2.C enables WP3;
- one normalized global V identity;
- exactly two global B facts.

## 6. Additional non-Gold orchestration tests

Freeze before implementation at least:

1. explicit “可并行” → PARALLEL;
2. explicit “同时进行” → PARALLEL;
3. no ordering statement + later join → no PARALLEL / no SEQUENCE;
4. explicit second-after-first → SEQUENCE;
5. two branches with distinct inputs + explicit parallel → PARALLEL;
6. same input without explicit parallel permission → no PARALLEL merely from shared input.

These must be generic and must not contain M01–M04 literal names/paths.

## 7. Exact success gate

Required:

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

M03 explicit PARALLEL = PASS
M04 no inferred PARALLEL = PASS

D01–D08 retained = 8/8
REF-001 retained = 43/43
repeatability = EXACT
```

If any M01–M04 primary case fails, stop before long STANDARD.

## 8. Validation

Run:

- focused 017-R1 tests;
- non-Gold orchestration tests;
- retained short direct parser tests;
- original Parser regression;
- full repository regression after G3;
- repeat M01–M04 + D01–D08 + REF-001;
- anti-overfit;
- protected assets;
- SEAL.

## 9. Allowed terminal outcomes

Exactly one:

- `MEDIUM_MATRIX_PARSER_VALIDATED`
- `G0_SEGMENTATION_MATRIX_FAILED`
- `G1_SEQUENTIAL_DEPENDENCY_FAILED`
- `G2_PARALLEL_JOIN_FAILED`
- `G3_GLOBAL_CONSTRAINT_FAILED`
- `ORCHESTRATION_EVIDENCE_GATE_FAILED`
- `ADMIN_MATRIX_CASE_REVIEW_REQUIRED`
- `IMPLEMENTATION_GATE_FAILED`

## 10. Required report package

Create:

`docs/reports/7plus1/7P-MATRIX-017-R1/`

At minimum:

- REPORT.md
- ADMIN-ADJUDICATION-READBACK.json
- NON-GOLD-ORCHESTRATION-TESTS.json
- BLOCKS.json
- WP-TREES.json
- LOCAL-7PLUS1.json
- SEMANTIC-MATRICES.json
- DEPENDENCY-DAGS.json
- MATRIX-EQUATION-AUDIT.json
- ORCHESTRATION-EVIDENCE-AUDIT.json
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

Generate a readable Markdown result per M case showing:

```text
Blocks
WP Tree
Local 7+1
Semantic Matrix
Dependency DAG
Global 7+1
```

## 11. Git / production rules

- work only on `review/7plus1-parser`;
- do not modify sealed 016–017 parent reports;
- do not modify the original frozen M01–M04 file;
- adjudication file is the explicit M04 override;
- do not modify D01–D08 or REF source/Gold;
- do not merge/release/tag;
- do not switch production;
- stop at `WAITING_ADMIN_REVIEW`.

## 12. Final return

Return:

- TASK
- final commit
- terminal outcome
- G0/G1/G2/G3
- M01–M04 block/WP/local7+/DAG/matrix/global counts
- M03 PARALLEL result
- M04 no-inferred-PARALLEL result
- wrong WP / O→I / completion / contamination / unsupported edge counts
- D01–D08 retention
- REF-001 retention
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
