# 7P-ADMIN-SHORT-020-LONG — Autonomous Generalization Closure

## 0. Identity

- TASK: `7P-ADMIN-SHORT-020-LONG`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Parent: `7P-ADMIN-SHORT-019-LONG`
- Parent commit: `4d358fa5de5f224865fe7592459b06b9c6216204`
- ADMIN authorization: `docs/tasks/7plus1/7P-ADMIN-SHORT-020-LONG-ADMIN-AUTHORIZATION.md`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Mission

Take the 019 candidate from:

```text
50/50 development corpus
92/100 final shadow
```

to a parser whose standardized ADMIN short-task semantics generalize beyond the known corpus.

This is a long autonomous task. Do not stop after repairing the eight known shadow failures.

The work has two goals:

1. close the four known generic semantic gaps;
2. prove generalization on two consecutive fresh blind shadow suites, each 120/120, using the same frozen candidate and no tuning between them.

## 2. Known 019 gaps

Treat the eight failed 019 shadow cases as development regressions.

They collapse into four mechanism classes.

### G-A — scope exclusion / restriction paraphrases

Known symptom:

```text
生产环境不在本次核查范围内
```

fails to compile as a source-certified restriction/scope exclusion.

Required generic semantics:

```text
ScopeExpr / RestrictionExpr
  included_scope = testing environment
  excluded_scope = production environment
  owner = governing check/task
```

Do not invent a fake execution action for “不在”.

Support standardized equivalents such as:

- 不在本次范围内;
- 排除 X;
- 仅限 X，不包含 Y;
- exclude Y from this review;
- this check is limited to X, not Y.

### G-B — predicate synonym normalization + flow composition

Known symptom:

```text
读取 → 查看
生成 → 编写
提交 → 发送
PM 在 QA 发送报告后向 ADMIN 汇报
```

can lose I/O/A/P or transfer-flow semantics.

Implement a generic semantic normalization layer or equivalent mechanism:

```text
surface predicate
→ canonical semantic sense
→ source-preserving typed event
```

Examples:

- 读取 / 查看 / inspect / read;
- 生成 / 编写 / create / write;
- 提交 / 发送 / send / submit;
- 检查 / 核查 / review / inspect.

The canonical sense may normalize internally, but the original surface span must remain in provenance.

Flow composition must preserve:

- actor;
- recipient;
- reviewed/transferred artifact;
- before/after dependency;
- condition owner.

### G-C — completion-condition composition under paraphrase

Known symptom:

```text
QA 确认索引和约束两类核查都完成后，任务结束。
```

does not always form the same completion semantics as equivalent wording.

Required generic structure:

```text
CompletionExpr
  operator = AND
  members = {index-check-completed, constraint-check-completed}
  reviewer = QA
  governed_target = task completion
```

Support equivalent standardized forms:

- 两类检查都完成后;
- A 与 B 均完成后;
- only after both A and B are complete;
- when both checks have finished;
- after QA confirms both categories are complete.

Do not derive completion merely from keywords “完成/结束”; preserve typed members and owner.

### G-D — retry lower-bound quantity

Known symptom:

```text
至少重试 N 次
```

does not form a typed retry quantity.

Required:

```text
QuantityExpr
  metric = RETRY_COUNT
  comparator = GTE
  value = N
  target = unique retry-capable execution event
```

Must distinguish:

- 最多重试 N 次 → LTE retry count;
- 至少重试 N 次 → GTE retry count;
- 恰好重试 N 次 → EQ retry count if source is explicit;
- 至少 N 次成功 → success-count acceptance, not retry lower bound;
- 最多 N 分钟 → TIME, not retry;
- “最近 N 次日志” → observed-data window/count, not execution resource.

## 3. Phase P0 — preserve evidence and convert 019 shadow failures to regressions

Before implementation:

1. copy or reference all eight 019 final shadow failures and their exact traces;
2. create `KNOWN-GAPS-019.json`;
3. create explicit semantic expectations from their frozen shadow oracle;
4. mark them `DEVELOPMENT_REGRESSION_FROM_019_SHADOW`.

Never rewrite or delete the original 019 frozen shadow evidence.

## 4. Phase P1 — mechanism-level controls before repair acceptance

For each mechanism G-A through G-D, create a fresh development-control set before final acceptance.

Minimum per mechanism:

- 6 positive variants;
- 4 contrastive negatives;
- 2 genuine ambiguity cases that must remain UNRESOLVED where applicable.

At least 12 per mechanism, minimum 48 new development controls.

Controls must vary:

- nouns;
- filenames;
- actors;
- Chinese/English wording;
- word order;
- condition form;
- quantity values.

Do not use ADM case IDs or known fixture literals in runtime.

## 5. Phase P2 — implement generic semantic repair

Codex owns implementation details.

Preferred architecture principle:

```text
lexical normalization
→ typed semantic candidate
→ typed composition / ownership
→ deterministic relation resolution
→ Boundary IR
→ Canonical 7+1
```

Do not repair by adding source-string-specific branches.

### P2-A scope/restriction

Use typed scope/restriction semantics.

Required properties:

- positive included domain;
- negative excluded domain;
- governing owner;
- source spans;
- proof relations;
- no accidental positive action.

### P2-B canonical predicate senses

Unify surface synonyms at the semantic-sense level.

Requirements:

- surface provenance retained;
- modality retained;
- actor/object retained;
- normalized sense drives downstream composition;
- no cross-domain synonym leakage.

### P2-C flow/condition composition

Build transfer/review/reporting flows from typed events and temporal/conditional relations.

No fixed sentence template requirement.

### P2-D completion AST

Completion must be represented structurally with:

- operator;
- member states;
- owner;
- reviewer/approver if explicit;
- target completion state.

### P2-E quantity targeting

Retry quantities must bind only to a compatible retry-capable event.

If there are multiple compatible targets and source does not disambiguate, remain UNRESOLVED.

## 6. Phase P3 — old corpus closure

After generic repair:

### 6.1 Main 50

Run all 50 frozen ADMIN cases.

Required:

`50/50 FULL_ROOT_7PLUS1_CLOSED`

### 6.2 Old 019 shadow

Run all 100 final 019 shadow cases.

These are now regression cases, not blind evidence.

Required:

`100/100`

### 6.3 019 controls and legacy retention

Required:

- 48/48 019 independent controls;
- G0 5/5;
- R1 controls 18/18;
- D01–D08 8/8;
- REF-001 43/43;
- no known heading regression.

If any fail, continue generic repair. Do not proceed to blind validation.

## 7. Phase P4 — candidate freeze for blind validation

Once Phase P3 is fully green:

1. freeze all candidate runtime files;
2. freeze model/config hashes used by parser;
3. write `CANDIDATE-FREEZE-BLIND.json`;
4. no runtime/code/config changes are allowed while a blind suite is being counted as blind evidence.

## 8. Phase P5 — fresh blind shadow suite protocol

### 8.1 Suite construction

Each blind suite has exactly 120 cases.

Its input texts and semantic oracle must be frozen before parser execution.

A suite must not reuse exact texts from:

- the 50 main corpus;
- 019 final shadow;
- 020 development controls;
- earlier blind suites.

Each suite must include at least:

- 30 paraphrase / synonym cases;
- 20 scope / negation / exclusion cases;
- 20 quantity / cardinality cases;
- 20 condition / completion cases;
- 10 role / transfer-flow cases;
- 10 Basis/Version cases;
- 10 OUTPUT_CONTENT / quoted-content cases.

At least 30 cases per suite must be English or mixed-language equivalents.

At least 20 must combine two semantic mechanisms in one task.

At least 10 must be ambiguity/negative controls where correct behavior is to preserve an unresolved fact rather than guess.

### 8.2 Blind integrity

For every blind suite create before execution:

- `SUITE-xxx-SOURCE-FREEZE.json`
- `SUITE-xxx-ORACLE.json`
- `SUITE-xxx-ORACLE-FREEZE.json`

Oracle creation may use source semantics and deterministic transformation metadata, but must not inspect parser output.

### 8.3 Consecutive-pass rule

Success requires:

```text
Blind Suite N     = 120/120
Blind Suite N+1   = 120/120
same candidate hash
no tuning between
```

Only then can the task claim generalization validation.

## 9. Repair-cycle protocol

If a blind suite fails:

1. preserve the candidate freeze;
2. preserve the suite source/oracle freeze;
3. preserve all actual failures and first divergences;
4. mark that suite `BLIND_GENERALIZATION_GAP`;
5. reset consecutive-pass count to 0;
6. the failed suite may now become development evidence;
7. unfreeze candidate;
8. repair only generic semantic mechanisms;
9. rerun all development/retention sets;
10. refreeze;
11. generate an entirely new blind suite.

Maximum: three generic repair cycles after the initial 019 baseline.

Do not keep regenerating blind suites until one happens to pass without preserving failures.

## 10. Generalization success criteria

Terminal success:

`ADMIN_SHORT_GENERALIZATION_VALIDATED`

requires all of:

```text
Main 50                       50/50
019 old shadow                100/100
020 development controls      all PASS
Blind suite A                 120/120
Blind suite B                 120/120
same frozen candidate         YES
tuning between A and B        NO
partial_RESOLVED              0
wrong_binding                 0
unsupported_RESOLVED          0
clear-source unresolved       0
```

For ambiguity controls, source-justified UNRESOLVED is correct and must not be counted as clear-source unresolved.

## 11. Anti-overfit

Static scan candidate runtime for:

- ADM IDs;
- F2 shadow IDs;
- case numbers;
- known fixture filenames;
- known participant names;
- source hashes;
- fixed offsets;
- oracle imports;
- expected-answer maps.

Behavioral audit:

- rename at least 30 identities;
- permute at least 20 harmless clause orders where semantics remains equivalent;
- vary at least 20 numeric values;
- use at least 20 Chinese/English paraphrase pairs.

No semantic difference may occur except values or ordering that source actually changes.

## 12. Repeatability

Final frozen candidate must be run twice on:

- 50 main corpus;
- 100 old shadow;
- all 020 development controls;
- both final 120-case blind suites;
- D01–D08;
- REF-001.

Semantic signatures must be EXACT excluding runtime IDs/timestamps/performance.

## 13. Regression

After final success candidate freeze:

- focused 020 tests;
- retained R1/R19 semantic tests;
- original Parser regression;
- full repository regression.

Report:

- total;
- pass;
- fail;
- skipped.

Skipped is never counted as pass.

## 14. Candidate / production boundary

Work in a new isolated candidate, e.g.:

`research/7plus1-parser/v0.3-admin-short-020/`

Do not modify sealed 019 candidate bytes.

Production entry remains unchanged.

## 15. Required reports

Create:

`docs/reports/7plus1/7P-ADMIN-SHORT-020-LONG/`

At minimum:

- REPORT.md
- ADMIN-AUTHORIZATION-READBACK.json
- KNOWN-GAPS-019.json
- DEVELOPMENT-CONTROLS.json
- SCOPE-RESTRICTION-AUDIT.json
- PREDICATE-NORMALIZATION-AUDIT.json
- FLOW-COMPOSITION-AUDIT.json
- COMPLETION-COMPOSITION-AUDIT.json
- RETRY-QUANTITY-AUDIT.json
- MAIN-50-RESULTS.json
- OLD-SHADOW-019-RESULTS.json
- G0-RETENTION.json
- D01-D08-RETENTION.json
- REF001-RETENTION.json
- BLIND-CYCLE-HISTORY.json
- CANDIDATE-FREEZE-BLIND.json
- FINAL-BLIND-SUITE-A-RESULTS.json
- FINAL-BLIND-SUITE-B-RESULTS.json
- ANTI-OVERFIT-AUDIT.json
- REPEATABILITY.json
- ORIGINAL-REGRESSION.json
- FULL-REGRESSION.json
- FINAL-OUTCOME.json
- NEXT-TASK-RECOMMENDATION.md
- VERIFY.json
- MANIFEST.json
- SHA256SUMS.txt
- SEAL.md
- SEAL-VERIFICATION.json

For every failed blind cycle, preserve:

- source freeze;
- oracle freeze;
- candidate freeze;
- complete results;
- first-divergence report.

## 16. Terminal outcomes

### Success

`ADMIN_SHORT_GENERALIZATION_VALIDATED`

### Repair budget exhausted

`ADMIN_SHORT_GENERALIZATION_GAP_REMAINS`

Report:

- all failed blind suites;
- recurring semantic mechanism;
- exact first divergence;
- why three generic repair cycles did not close it.

### Method review

`METHOD_CONTRACT_REVIEW_REQUIRED`

Only if existing v0.3 semantics cannot express the clear source meaning.

### Architecture review

`ARCHITECTURE_REVIEW_REQUIRED`

Only if the semantics can be stated but existing internal architecture cannot represent them without contradiction after genuine generic redesign.

### Implementation failure

`IMPLEMENTATION_GATE_FAILED`

Only for non-semantic execution/test failure.

## 17. Git rules

- branch only: `review/7plus1-parser`;
- no merge;
- no release;
- no tag;
- no production switch;
- preserve 019 seal and evidence;
- preserve all failed blind evidence;
- do not execute business actions described in fixtures.

## 18. Final return

Return only at a terminal outcome with:

- TASK
- final commit
- terminal outcome
- architecture/mechanism changes
- old 8 gap closure
- main 50 count
- old shadow 100 count
- development-control count
- blind cycle history
- final blind A count
- final blind B count
- candidate hash equality
- partial/wrong/unsupported/clear-source unresolved counts
- G0/D01–D08/REF-001
- focused/original/full regression
- repeatability
- anti-overfit
- remaining gaps
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
