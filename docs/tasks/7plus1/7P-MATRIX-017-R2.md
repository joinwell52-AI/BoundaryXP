# 7P-MATRIX-017-R2 — Certified WP-Local Context Closure

## 0. Identity

- TASK: `7P-MATRIX-017-R2`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Parent result: `G0_SEGMENTATION_MATRIX_FAILED`
- Parent commit: `2514ca34a7a21c277a0899bdc87bb74e68e30abe`
- ADMIN authorization: `docs/tasks/7plus1/7P-MATRIX-017-R2-WP-CONTEXT-ADMIN-ADJUDICATION.md`
- M04 orchestration adjudication: `docs/tasks/7plus1/7P-MATRIX-017-M04-ADMIN-ADJUDICATION.md`
- Frozen M01–M04: `docs/tasks/7plus1/7P-MATRIX-017-FROZEN-CASES.md`
- Short parser validated baseline: `5deb62b198d36f7ed0ae9b5a745c28b2b9aaf73e`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Purpose

Do not redesign the matrix.

017-R1 already proves:

- Block segmentation 4/4;
- WP Tree 4/4;
- matrix structural/reference integrity 4/4;
- orchestration evidence handling for M03/M04 is directionally correct.

The failure is at the boundary:

```text
WP structure
→ local short-parser semantic compilation
```

This task must add one bounded `CertifiedWPContext` interface and use it to make child-WP local 7+1 complete without rewriting source.

Target:

```text
Blocks
→ WP Tree
→ CertifiedWPContext
→ Local 7+1
→ Matrix
→ Dependency DAG
→ Global 7+1
```

## 2. Required reading

Read in full:

1. CURRENT-TASK
2. this taskbook
3. WP-context ADMIN adjudication
4. M04 ADMIN adjudication
5. sealed 017-R1 REPORT
6. ROOT-CAUSE-EVIDENCE.json
7. LOCAL-7PLUS1.json
8. DEPENDENCY-DAGS.json
9. MATRIX-EQUATION-AUDIT.json
10. frozen M01–M04
11. sealed 016-R2 short-parser report
12. normative method sections on WP, Block, stateful parsing, Matrix, dependency graph, global projection

## 3. Frozen architecture decisions

Do not reopen:

- short Direct Parser result;
- Block segmentation representation;
- WP0 + sibling WP tree depth for 017;
- M03 explicit PARALLEL semantics;
- M04 no inferred PARALLEL/SEQUENCE;
- one final Global Canonical 7+1.

Do not use long STANDARD as tuning input.

## 4. Implement CertifiedWPContext

Create a typed context contract, serializable in Trace.

Required fields:

```text
wp_id
wp_label
root_task_id
source_block_ids
task_domain_span_ids
responsible_participant_id | null
responsibility_span_ids[]
execution_domain
completion_target
completion_domain_span_ids[]
global_basis_refs[]
global_constraint_refs[]
upstream_artifact_refs[]
downstream_artifact_refs[]
orchestration_refs[]
```

Each field must carry exact source/proof lineage.

The local compiler call must be conceptually:

```text
compileLocal(sourceView, certifiedWPContext)
```

not:

```text
rewriteSourceIntoStandaloneTask(...)
```

Source text bytes must remain unchanged.

## 5. Gate A — WP responsibility + modality

Fix generically:

### A1. Preposed stage responsibility

Support:

```text
第一阶段由张宁负责
API 检查由赵岚负责
```

as source-certified responsibility assignment.

Do not require the responsibility target to occur after “负责”.

### A2. WP-domain required modality

Within a certified execution WP, explicit execution clauses may inherit REQUIRED from the stage task contract when all ADMIN conditions are met.

Must close examples equivalent to:

```text
张宁读取 x，检查 y，并生成 z。
Alice reads x and creates z.
```

when inside an assigned task stage.

Must NOT turn these into REQUIRED merely because they are declarative:

- background descriptions;
- examples;
- artifact state descriptions;
- output content;
- rationale;
- quoted text.

### A3. Non-Gold freeze before implementation

Freeze at least 8 independent cases:

- 3 Chinese stage responsibility/order variants;
- 2 English stage assignment variants;
- 2 negative background/declarative controls;
- 1 explicit conflicting actor case.

Gate A passes only if all 8 pass.

## 6. Gate B — Stage completion domain

Support completion targets other than literal “任务/task”:

- 第一阶段完成;
- 第二阶段才算完成;
- API 检查完成;
- security review stage is complete.

Completion must bind to exactly one WP.

Freeze at least 6 non-Gold tests:

- output exists → WP completion;
- reviewer confirmation → WP completion;
- conjunction completion;
- ambiguous stage name → UNRESOLVED;
- root task completion distinct from child completion;
- negative unrelated “完成” statement.

Gate B passes only if all 6 pass.

## 7. Gate C — local artifact roles and O→I identity

The short parser may emit generated output without knowing final/intermediate stage role.

The matrix layer must certify:

```text
upstream generated output
+ downstream certified input of same artifact identity
+ unique producer
→ INTERMEDIATE_OUTPUT / INTERMEDIATE_INPUT
→ PRODUCES_FOR
→ CONSUMES_OUTPUT
```

Requirements:

- local source identity must exist at both endpoints;
- string match alone is insufficient;
- one producer only;
- ambiguity stays unresolved;
- downstream READ/CONSUME must support I.

Freeze at least 6 non-Gold tests:

- simple unique O→I;
- same name mentioned only in background → no link;
- two producers same artifact → unresolved;
- downstream input with renamed alias but certified identity → link if supported;
- final output with no consumer remains FINAL_OUTPUT;
- conditional output consumed downstream preserves condition.

Gate C passes only if all 6 pass.

## 8. Gate D — C→Enable

A completion dependency may resolve only if predecessor C is fully certified.

Required:

```text
source orchestration evidence
+
certified predecessor C
+
certified successor WP
→ REQUIRES_COMPLETION
```

No endpoint synthesis.

Freeze at least 5 non-Gold tests:

- one sequential predecessor;
- two-predecessor AND join;
- explicit sequence but unresolved predecessor C → dependency remains unresolved;
- parallel branches + AND join;
- unrelated completion phrase → no edge.

Gate D passes only if all 5 pass.

## 9. Gate E — Root V/B endpoint certification

### E1. V

Root basis must compose rule + version:

```text
AUDIT-RULE-3 + v2.0
→ one BASIS identity
```

A version-only endpoint must not permit RESOLVED USES_AS_BASIS.

### E2. B

A root set constraint with forward references may resolve only from a certified unique member set.

For M04, if and only if source evidence certifies the two source files:

```text
accounts.csv
permissions.csv
```

then global B may contain exactly two FORBIDDEN MODIFY facts.

Freeze at least 6 non-Gold tests:

- basis + version;
- version alone;
- basis without version;
- two-member forward constraint resolved;
- wrong cardinality remains unresolved;
- competing member set remains unresolved.

Gate E passes only if all 6 pass.

## 10. M01–M04 replay order

Only after Gates A–E pass, replay frozen matrix cases.

### G0 — M01

Required full success:

- Blocks;
- WP Tree;
- Local 7+1;
- O→I;
- C→Enable;
- Matrix;
- DAG;
- Global 7+1.

If G0 fails: stop.

### G1 — M02

Required:

- 3 local WPs complete;
- two O→I chains;
- reviewer completion;
- two completion dependencies;
- Global 7+1 complete.

If G1 fails: stop.

### G2 — M03

Required:

- explicit PARALLEL;
- two branches isolated;
- two O→I links;
- AND join completion;
- Global 7+1 complete.

If G2 fails: stop.

### G3 — M04

Required:

- root V = full AUDIT-RULE-3 v2.0 identity;
- root B = exactly two protected sources;
- child basis refs certified;
- no unsupported RESOLVED USES_AS_BASIS;
- no PARALLEL/SEQUENCE between WP1/WP2;
- two O→I links;
- two completion dependencies into WP3;
- no duplicated global V/B;
- Global 7+1 complete.

## 11. Final semantic success gate

Required:

```text
M01–M04 Blocks = 4/4
WP Tree = 4/4
Local 7+1 = 4/4
Dependency DAG = 4/4
Semantic Matrix = 4/4
Global Canonical 7+1 = 4/4

missing O→I links = 0
missing completion dependencies = 0
wrong WP assignment = 0
wrong O→I identity = 0
wrong completion binding = 0
cross-WP contamination = 0
unsupported RESOLVED orchestration edges = 0

M03 PARALLEL = PASS
M04 no inferred PARALLEL/SEQUENCE = PASS

D01–D08 = 8/8
REF-001 = 43/43
repeatability = EXACT
```

## 12. Anti-shortcut requirements

Forbidden:

- reconstructing per-WP pseudo-prompts from expected answers;
- inserting “必须/任务/完成” into source before local parse;
- case-name switches;
- source-hash switches;
- file-name special cases;
- expected JSON in runtime path;
- using M01–M04 text literals as parser rules;
- loosening RESOLVED gates to make edges appear.

The source must remain verbatim; only typed, source-certified context may be passed.

## 13. Validation

Run:

- focused 017-R2 tests;
- all frozen non-Gold context tests;
- retained 017-R1 structural/orchestration tests;
- retained 016-R2 short parser tests;
- original Parser regression;
- full repository regression after G3;
- repeat all M01–M04 + D01–D08 + REF-001;
- anti-overfit;
- protected assets;
- SEAL.

## 14. Allowed terminal outcomes

Exactly one:

- `MEDIUM_MATRIX_PARSER_VALIDATED`
- `WP_CONTEXT_GATE_FAILED`
- `STAGE_COMPLETION_GATE_FAILED`
- `OI_IDENTITY_GATE_FAILED`
- `COMPLETION_DEPENDENCY_GATE_FAILED`
- `ROOT_CONSTRAINT_GATE_FAILED`
- `G0_SEGMENTATION_MATRIX_FAILED`
- `G1_SEQUENTIAL_DEPENDENCY_FAILED`
- `G2_PARALLEL_JOIN_FAILED`
- `G3_GLOBAL_CONSTRAINT_FAILED`
- `IMPLEMENTATION_GATE_FAILED`

Do not start long STANDARD, MILP/SMT, Hybrid, or production adoption.

## 15. Required report package

Create:

`docs/reports/7plus1/7P-MATRIX-017-R2/`

At minimum:

- REPORT.md
- ADMIN-AUTHORIZATION-READBACK.json
- WP-CONTEXT-SCHEMA.json
- WP-CONTEXT-AUDIT.json
- NON-GOLD-WP-CONTEXT.json
- NON-GOLD-STAGE-COMPLETION.json
- NON-GOLD-OI-IDENTITY.json
- NON-GOLD-COMPLETION-DEPENDENCY.json
- NON-GOLD-ROOT-CONSTRAINTS.json
- BLOCKS.json
- WP-TREES.json
- LOCAL-7PLUS1.json
- SEMANTIC-MATRICES.json
- DEPENDENCY-DAGS.json
- MATRIX-EQUATION-AUDIT.json
- ROOT-CONSTRAINT-AUDIT.json
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

Generate readable M01–M04 Markdown results showing:

```text
Source Blocks
CertifiedWPContext
WP Tree
Local 7+1
Semantic Matrix
Dependency DAG
Global 7+1
```

## 16. Git / production rules

- work only on `review/7plus1-parser`;
- preserve sealed 017/017-R1 evidence;
- do not modify frozen M01–M04 source/expected;
- do not modify D01–D08 or REF Source/Gold;
- do not modify v0.3 normative meaning;
- no merge/release/tag;
- no production switch;
- stop at `WAITING_ADMIN_REVIEW`.

## 17. Final return

Return:

- TASK
- final commit
- terminal outcome
- Gates A/B/C/D/E
- G0/G1/G2/G3
- M01–M04 Block/WP/Local/DAG/Matrix/Global counts
- missing O→I
- missing completion dependencies
- unsupported RESOLVED orchestration
- M03 parallel
- M04 no inferred order
- D01–D08 retention
- REF retention
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
