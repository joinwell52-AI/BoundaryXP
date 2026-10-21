# 7P-ADMIN-SHORT-019-LONG — Autonomous 50-Case ADMIN Root 7+1 Implementation

## 0. Identity

- TASK: `7P-ADMIN-SHORT-019-LONG`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Start from current branch HEAD after ADMIN authorization
- ADMIN authorization: `docs/tasks/7plus1/7P-ADMIN-SHORT-019-LONG-ADMIN-AUTHORIZATION.md`
- Baseline success: `7P-ADMIN-SHORT-018-R1`, commit `64a1d3b9aecffb3314a796cff0ab7c30e939fb63`
- Corpus: `fixtures/7plus1/admin-short-050-r02/CASES.md`
- Diagnostic baseline: `docs/reports/7plus1/ADMIN-SHORT-050-r02/`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Mission

Implement the parser far enough that all 50 standardized ADMIN short tasks compile to correct Canonical Root 7+1.

This is a **long autonomous implementation task**.

Do not stop after G1/G2/G3 for routine ADMIN review.

Continue autonomously through diagnosis, generic semantic IR work, parser repair, testing, full 50-case closure, generalization checks, regression, repeatability and seal.

The target is not “contract PASS”.

The target is:

```text
ADMIN natural-language task
→ typed semantic compilation
→ source-faithful Canonical 7+1
```

for all 50 frozen cases.

## 2. Non-goals

Do not:

- decompose WPs;
- run Matrix/WP work;
- change PM planning semantics;
- change the 7+1 slot definitions;
- use an LLM answer generator as final authority;
- train models;
- change Packs;
- modify production entry;
- merge/release/tag;
- change frozen source texts;
- change historical seals;
- hard-code case answers.

All 50 cases are ADMIN-authorized root-scope inputs for this task.

## 3. Existing architecture to preserve

The intended architecture remains:

```text
Source
→ discourse / clause structure
→ typed lexical and semantic candidates
→ semantic ownership
→ relation + identity + scope + modality + condition + quantity composition
→ deterministic constraint resolution
→ Boundary IR
→ Canonical I/O/A/P/R/V/C/B
→ Proof
```

R1 already proved the value of:

- PART_OF;
- QualifiedDomain;
- compound qualifier ownership;
- source-object COREFERENCE / identity.

Preserve those mechanisms.

Do not fall back to direct slot extraction.

## 4. Autonomy boundary

Codex may redesign or extend internal candidate architecture without returning to ADMIN as long as it stays within existing v0.3 semantics.

Authorized internal structures include, but are not limited to:

```text
QualifiedDomain
BasisReference
ParticipantRole
ModalityExpr
NegationScope
ConditionExpr
CompletionExpr
QuantityExpr
QuantityTarget
OutputContentOwner
ArtifactIdentity
CoreferenceSet
SetExpr
QualifierExpr
TemporalExpr
ReviewState
TransferState
```

Internal representation may change if the final meaning, evidence and projection remain correct.

Codex may split modules, refactor candidate-only code, improve semantic decoders, add generic lexicons and add deterministic composition rules.

Do not edit sealed R1 candidate files in place. Create a new isolated candidate, e.g.:

`research/7plus1-parser/v0.3-admin-short-019/`

## 5. Mandatory stop conditions

Stop only for:

- `METHOD_CONTRACT_REVIEW_REQUIRED`: existing v0.3 semantics cannot represent a clear source meaning without changing the normative method or public relation space;
- `ARCHITECTURE_REVIEW_REQUIRED`: a generic IR-level redesign still cannot close a clear semantic class without contradiction;
- `IMPLEMENTATION_GATE_FAILED`: candidate cannot be made executable or testable without violating protected assets.

Normal parser failures are not stop conditions. Fix them and continue.

## 6. Phase P0 — freeze a task-local semantic acceptance oracle

Before modifying parser code:

1. Read all 50 source tasks.
2. Read the existing r02 diagnostic report/results.
3. Create a task-local acceptance oracle from source semantics only.

Create:

`docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/ADMIN-SHORT-050-ORACLE.json`

This is **not** a new normative Gold corpus. It is a frozen engineering acceptance contract for this task.

For every case record source-supported expectations at semantic-fact level:

- I inputs;
- O deliverables;
- A predicate + modality + subject + object/domain;
- P roles;
- R metric/comparator/value/unit/target;
- V identifier + version + relation meaning;
- C operator/state/target/condition;
- B predicate + modality + scope/object;
- output-content ownership;
- relevant quantifiers;
- relevant coreference;
- relevant source spans.

Every expected fact must cite source spans.

No expected fact may be based on current parser output.

Freeze oracle SHA before parser changes.

Runtime parser/tests must never read this oracle to generate output.

## 7. Phase P1 — full baseline and semantic gap inventory

Run the current sealed R1 candidate on all 50.

Create:

- `BASELINE-50.json`
- `BASELINE-50-SEMANTIC-REVIEW.json`
- `SEMANTIC-GAP-INVENTORY.json`

Group failures by semantic mechanism, not case number.

At minimum classify:

- I/O role completeness;
- artifact identity;
- participant role;
- modality;
- negation;
- Basis/Version;
- quantity target;
- condition ownership;
- AND/OR;
- completion;
- stop/resume;
- approval;
- recipient/reviewer flow;
- output-content ownership;
- coreference;
- scope restriction;
- all/every/at-least/at-most;
- conditional outputs;
- quoted content;
- source/output distinction;
- structural heading coverage.

Rank by earliest semantic divergence.

## 8. Phase P2 — semantic compiler completion

Implement generic mechanisms in architecture order.

### P2-A Basis / Reference identity

Must compose a complete reference identity such as:

```text
RELEASE-6 + v3.0
SEARCH-SPEC-5 + v1.2
CHECK-19 + v2.4
```

into one typed V fact.

Prevent:

- version-only V;
- duplicate split V;
- input file accidentally becoming V;
- observed version value becoming task basis.

### P2-B Quantity / resource targeting

Support task-resource semantics:

- time limit;
- retry limit;
- memory cap;
- other explicit execution budgets.

Keep separate:

- observation windows;
- content thresholds;
- percentages;
- classification thresholds;
- acceptance counts.

Every quantity must have an explicit target.

### P2-C participant roles and execution flow

Correctly distinguish:

- performer;
- reviewer;
- recipient;
- coordinator;
- approver;
- submitter/transfer actor when relevant.

Role is determined by use-site semantics, not title alone.

### P2-D modality and negation scope

Preserve:

- REQUIRED;
- PERMITTED;
- FORBIDDEN;
- NOT_REQUIRED.

Do not reverse:

- “不负责审批”;
- “不要求修复”;
- “无需生成”;
- “不得执行”.

### P2-E condition / completion composition

Support:

- AND;
- OR;
- if/otherwise;
- only-if;
- after/before;
- reviewer-confirmed guards;
- ALL / ANY / GTE / LTE;
- stop conditions;
- resume conditions;
- completion state.

Conditions must bind to the correct governed action/state.

### P2-F OUTPUT_CONTENT ownership

Content inside a required output must stay owned by that output.

Examples include:

- required sections;
- phrases to quote;
- lists of added/deleted interfaces;
- “mark as pending confirmation”;
- risk list / rollback advice;
- content-dependent branches.

Do not promote output content into current-task A/B unless the source separately authorizes it.

### P2-G source scope and identity

Preserve and extend:

- QualifiedDomain;
- PART_OF;
- COREFERENCE;
- generic source object identity;
- exclusion scope;
- environment scope;
- current-task vs background distinction.

### P2-H structure normalization

Fix the known D6 heading coverage gap generically.

Headings such as:

```text
# 当前任务
## 当前任务
# Current Task
## Current Task
```

must function as discourse structure, not create unsupported execution semantics.

Do not overfit to D6 literal text.

## 9. Independent controls — required before every semantic mechanism is accepted

For each changed semantic class, freeze independent controls before final implementation acceptance.

Each class must have at least:

- 3 positive variants;
- 2 contrastive negative variants;
- 1 ambiguity variant that must stay UNRESOLVED.

Use different:

- filenames;
- names;
- roles;
- identifiers;
- quantities;
- word order;
- Chinese/English expressions where applicable.

No ADM case IDs, literal filenames or source hashes in runtime rules.

## 10. Development strategy

Codex may iterate as many times as needed inside this task.

Use this loop:

```text
find earliest semantic divergence
→ identify missing generic representation/resolution
→ freeze independent controls
→ implement generic mechanism
→ run controls
→ run affected corpus cases
→ run retention
→ continue to next divergence
```

If two consecutive attempts only add phrase-specific rules without fixing the semantic class, stop adding phrases and redesign the relevant IR/resolver.

Do not return to ADMIN merely because a Gate is not yet closed.

## 11. Corpus closure target

All 50 cases may be used as the engineering acceptance corpus.

A case is `FULL_ROOT_7PLUS1_CLOSED` only if:

1. every oracle fact supported by source is represented;
2. every represented fact has correct slot;
3. modality is correct;
4. subject/role is correct;
5. object/domain is correct;
6. quantity target is correct;
7. condition ownership is correct;
8. output-content ownership is correct;
9. no unsupported RESOLVED fact exists;
10. no partial RESOLVED fact remains;
11. no clear fact remains unresolved;
12. proof lineage reaches exact source spans.

Required:

```text
50/50 FULL_ROOT_7PLUS1_CLOSED
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
clear_source_unresolved = 0
```

Do not count schema/contract PASS as semantic PASS.

## 12. Metamorphic generalization suite after 50/50

After the implementation first reaches 50/50, freeze the candidate.

Then generate a separate shadow suite that is **not** used to tune the frozen candidate.

Required minimum:

### 12.1 Identity-renaming invariance

At least 25 variants changing:

- participant names;
- filenames;
- IDs;
- rule identifiers.

Expected: same semantic structure except identity values.

### 12.2 Paraphrase invariance

At least 25 variants using alternate standardized wording:

- 读取 / 查看 / inspect;
- 生成 / 编写 / create;
- 提交 / 发送 / send;
- 检查 / 核查 / review;
- Chinese/English equivalents.

Expected: same intended 7+1 semantics.

### 12.3 Contrastive polarity

At least 20 variants switching:

- must ↔ may;
- required ↔ not required;
- allowed ↔ forbidden;
- positive ↔ negated role.

Expected: only the relevant modality/role semantics change.

### 12.4 Quantity/condition contrast

At least 20 variants changing:

- LTE/GTE;
- AND/OR;
- time budget vs observation window;
- retry count vs success count;
- if/otherwise.

Expected: correct typed target/operator change.

### 12.5 Output-content contrast

At least 10 variants where action-looking text appears only inside an output.

Expected: no leakage into current-task A/B.

Minimum shadow total: 100 cases.

If frozen candidate fails any shadow case, record:

`GENERALIZATION_SHADOW_GAP`

Do not tune the frozen candidate using the failed shadow case inside this task.

This preserves an honest generalization signal even though all 50 main cases are now development/acceptance cases.

## 13. Retention requirements

Must retain:

- R1 G0 = 5/5;
- PART_OF controls;
- QualifiedDomain controls;
- compound qualifier controls;
- source identity controls;
- D01–D08 = 8/8;
- REF-001 = 43/43;
- original Parser regression;
- all previously retained short-parser semantics.

Any intentional representation change must preserve semantic equivalence and proof lineage.

## 14. Repeatability

After final freeze, rerun:

- all 50;
- all accepted independent controls;
- all 100+ shadow cases that were run;
- D01–D08;
- REF-001.

Semantic signatures must be EXACT across two fresh NLP runs, excluding run IDs, timestamps and performance timing.

## 15. Anti-overfit audit

Search source and tests for:

- `ADM-0`;
- literal corpus filenames;
- literal participant names;
- source hashes;
- source offsets;
- expected oracle reads;
- expected canonical values copied into runtime;
- case-specific switch statements.

Behavioral anti-overfit checks must rename identities and preserve semantics.

Any case-specific runtime branch is failure.

## 16. Full regression

After 50/50:

- run focused candidate tests;
- retained semantic tests;
- original Parser regression;
- full repository regression.

Report passed/failed/skipped separately.

No skipped test counts as a pass.

## 17. Deliverables

Create:

`docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/`

At minimum:

- `REPORT.md`
- `ADMIN-AUTHORIZATION-READBACK.json`
- `ADMIN-SHORT-050-ORACLE.json`
- `ORACLE-FREEZE.json`
- `BASELINE-50.json`
- `BASELINE-50-SEMANTIC-REVIEW.json`
- `SEMANTIC-GAP-INVENTORY.json`
- `ARCHITECTURE-CHANGES.md`
- `BASIS-REFERENCE-AUDIT.json`
- `QUANTITY-TARGET-AUDIT.json`
- `PARTICIPANT-ROLE-AUDIT.json`
- `MODALITY-NEGATION-AUDIT.json`
- `CONDITION-COMPLETION-AUDIT.json`
- `OUTPUT-CONTENT-AUDIT.json`
- `SCOPE-IDENTITY-AUDIT.json`
- `HEADING-STRUCTURE-AUDIT.json`
- `INDEPENDENT-CONTROLS.json`
- `FULL-50-RESULTS.json`
- `FULL-50-SEMANTIC-REVIEW.json`
- `FALSE-WRONG-STATUS.json`
- `SHADOW-SUITE-FREEZE.json`
- `SHADOW-SUITE-RESULTS.json`
- `G0-RETENTION.json`
- `D01-D08-RETENTION.json`
- `REF001-RETENTION.json`
- `REPEATABILITY.json`
- `ANTI-OVERFIT-AUDIT.json`
- `ORIGINAL-REGRESSION.json`
- `FULL-REGRESSION.json`
- `FINAL-OUTCOME.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

Also save per-case actual outputs:

`docs/reports/7plus1/7P-ADMIN-SHORT-019-LONG/final-50/ADM-xxx/`

with at least:

- source;
- canonical-7plus1.json;
- canonical-7plus1.md;
- semantic-review.json;
- trace;
- unresolved;
- proof summary.

## 18. Terminal outcomes

Allowed terminal outcomes:

### Success

`ADMIN_SHORT_050_ROOT_7PLUS1_VALIDATED`

Requires:

- 50/50 full closure;
- zero partial/wrong/unsupported resolved;
- zero clear-source unresolved;
- G0 retained;
- D01–D08 retained;
- REF-001 retained;
- anti-overfit PASS;
- repeatability EXACT;
- full regression PASS.

If the 50 pass but the frozen shadow suite exposes failures, use:

`ADMIN_SHORT_050_CLOSED_SHADOW_GENERALIZATION_GAP`

Do not hide the shadow failure.

### Review required

`METHOD_CONTRACT_REVIEW_REQUIRED`

or

`ARCHITECTURE_REVIEW_REQUIRED`

with exact first divergence and proof why ordinary implementation work is insufficient.

### Engineering failure

`IMPLEMENTATION_GATE_FAILED`

only for genuine non-semantic execution/test failure.

## 19. Git and safety rules

- work only on `review/7plus1-parser`;
- preserve all prior seals;
- preserve 50 source tasks;
- preserve normative method bytes unless returning for method review;
- production parser entry unchanged;
- no merge;
- no release;
- no tag;
- no production switch;
- no business execution described inside fixtures.

## 20. Final return

Return only after the long task reaches a terminal outcome.

Include:

- TASK
- final commit
- terminal outcome
- architecture changes
- 50-case full closure count
- partial_RESOLVED
- wrong_binding
- unsupported_RESOLVED
- clear-source unresolved
- shadow suite count/result
- G0 retention
- D01–D08
- REF-001
- focused/original/full regression
- repeatability
- anti-overfit
- known remaining gaps
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
