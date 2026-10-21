# 7P-ADMIN-NATURAL-021-LONG — Independent Natural Blind Evaluation and Repair

## 0. Identity

- TASK: `7P-ADMIN-NATURAL-021-LONG`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Parent validated task: `7P-ADMIN-SHORT-020-LONG`
- Parent delivery commit: `65f72aad`
- Frozen 020 candidate SHA-256: `42b1676906fd50576bee5023520584bf55096e047605330cb50d475bbe4ec9d7`
- ADMIN authorization: `docs/tasks/7plus1/7P-ADMIN-NATURAL-021-LONG-ADMIN-AUTHORIZATION.md`
- Source: `fixtures/7plus1/admin-natural-blind-100/CASES.md`
- Source blob SHA: `15154b2f30453de830f8fd4d78c1a92cf52d9f1e`
- Oracle: `fixtures/7plus1/admin-natural-blind-100/ORACLE.json`
- Oracle blob SHA: `5410fb1d6d71333ff95f01f4d64b6dcf55103866`
- Oracle freeze: `fixtures/7plus1/admin-natural-blind-100/ORACLE-FREEZE.json`
- PRODUCTION_READY=false

## 1. Mission

Evaluate the already frozen 020 parser candidate on 100 independently authored, naturally worded ADMIN root-scope short tasks.

This task has two possible paths:

### Path A — first blind 100/100

If the untouched 020 candidate passes all 100 on first execution:

1. seal the independent blind result;
2. verify all historical retention and full regression;
3. perform production-admission preflight;
4. stop before any production switch.

### Path B — first blind below 100/100

If any case fails:

1. preserve the first blind result exactly;
2. diagnose failures by semantic mechanism;
3. convert failed cases into development evidence;
4. autonomously implement generic repairs;
5. rerun all historical suites and the 100 natural cases as regression;
6. stop with a request for a **new ADMIN-authored blind set**.

A repaired 100/100 after seeing failures is regression closure, not independent-blind validation.

## 2. Required reading

Read fully before execution:

1. CURRENT-TASK
2. this taskbook
3. 021 ADMIN authorization
4. Source / Source Freeze v2
5. Oracle / Oracle Freeze
6. 020 REPORT / FINAL-OUTCOME / BLIND-CYCLE-HISTORY
7. 020 candidate implementation and freeze record
8. v0.3 normative method
9. 019 and 020 anti-overfit rules

## 3. Phase B0 — integrity gate before parser execution

Before running any ANB case:

Create:

`docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG/PRE-RUN-INTEGRITY.json`

Verify:

- source blob SHA exactly matches frozen SHA;
- oracle blob SHA exactly matches frozen SHA;
- source has 100 cases;
- oracle has 100 cases;
- 020 candidate hash exactly matches `42b167...`;
- production entry is unchanged;
- parser runtime does not import/read Oracle;
- no task-local parser code has been created yet;
- no model/config/threshold change since 020 freeze.

If candidate hash does not match, terminal outcome:

`BLIND_INTEGRITY_FAILED`

Do not run the 100 cases.

## 4. Phase B1 — untouched first blind run

Run the exact frozen 020 candidate once over ANB-001..ANB-100.

Do not modify parser code beforehand.

For each case save:

- source;
- actual Canonical 7+1 JSON/Markdown;
- full semantic Trace;
- unresolved;
- proof summary;
- slot-state inventory;
- post-parse semantic review against frozen Oracle.

Directory:

`docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG/first-blind/ANB-xxx/`

Create:

- `FIRST-BLIND-RESULTS.json`
- `FIRST-BLIND-SEMANTIC-REVIEW.json`
- `FIRST-BLIND-FIRST-DIVERGENCE.json`

## 5. Blind scoring contract

### 5.1 Clear cases ANB-001..095

A case is PASS only if:

- every listed Oracle semantic fact is present;
- correct slot;
- correct predicate sense;
- correct modality;
- correct subject/participant role;
- correct object/domain;
- correct quantity target;
- correct condition/completion owner;
- correct OutputContent ownership;
- exact source/proof lineage exists;
- no unsupported RESOLVED;
- no partial RESOLVED;
- no wrong binding;
- no clear source-supported semantic left unresolved.

### 5.2 Ambiguity controls ANB-096..100

A case is PASS only if:

- declared ambiguity is retained as unresolved;
- parser does not arbitrarily select one candidate;
- all other clear facts are correctly represented;
- provenance includes the competing source candidates.

Correct unresolved is not a failure.

### 5.3 Review independence

The evaluator may read Oracle after parser output exists.

The parser runtime itself must never read Oracle.

## 6. First-blind terminal branch

### Branch A: first blind = 100/100

Required aggregate:

```text
100/100 PASS
partial_RESOLVED = 0
wrong_binding = 0
unsupported_RESOLVED = 0
clear_source_unresolved = 0
ambiguity_controls = 5/5 correct unresolved
```

Then proceed directly to Phase H — hardening/preflight.

Do not modify runtime between first blind and retention/preflight unless a non-semantic packaging/test defect prevents execution. Any semantic runtime change invalidates Branch A.

### Branch B: first blind < 100/100

Seal first blind immediately.

Create:

- `FIRST-BLIND-SEAL.md`
- `FIRST-BLIND-SHA256SUMS.txt`
- `FIRST-BLIND-FAILURE-INVENTORY.json`

Then proceed to Phase R.

## 7. Phase R — autonomous generic repair after a failed first blind

This phase is allowed only after the first blind evidence is sealed.

### R1. Mechanism inventory

Group failures by semantic mechanism, not case ID.

Examples:

- lexical normalization;
- predicate/argument frame;
- participant role;
- coreference;
- Basis/Version;
- scope restriction;
- modality/negation;
- quantity target;
- condition ownership;
- completion;
- transfer flow;
- OutputContent;
- artifact identity;
- structure/discourse.

Create `REPAIR-MECHANISM-INVENTORY.json`.

### R2. Independent development controls

Before each generic repair, freeze at least:

- 3 positive controls;
- 2 contrastive negatives;
- 1 ambiguity control where applicable.

Controls must use new identities and wording.

### R3. Candidate repair

Create a new isolated candidate:

`research/7plus1-parser/v0.3-admin-natural-021/`

Do not edit the sealed 020 candidate in place.

Authorized internal repairs remain within existing v0.3 semantics.

### R4. Closure after repair

After generic repair:

- 100 natural cases must be 100/100 as development regression;
- 020 main50 = 50/50;
- 020 old shadow100 = 100/100;
- 020 blind A = 120/120;
- 020 blind B = 120/120;
- 020 controls pass;
- G0/R1/D/REF retained;
- original/full regressions pass;
- anti-overfit passes;
- repeatability exact.

But terminal outcome is **not** independent-blind validated.

Use:

`ADMIN_NATURAL_100_REPAIRED_AWAITING_NEW_BLIND`

and stop for a new ADMIN-authored blind set.

## 8. Phase H — hardening/preflight after untouched 100/100

Only if first blind was 100/100 on the unchanged 020 candidate.

Do not switch production.

Perform:

1. candidate/public contract diff;
2. relation/schema/runtime contract consistency;
3. CLI/service/API compatibility review;
4. error and UNRESOLVED behavior review;
5. deterministic performance baseline;
6. packaging/import closure;
7. rollback design;
8. migration plan from research candidate to official parser;
9. production-admission checklist.

Create:

- `PRODUCTION-ADMISSION-PREFLIGHT.md`
- `PUBLIC-CONTRACT-DIFF.json`
- `SCHEMA-RELATION-CONSISTENCY.json`
- `ERROR-UNRESOLVED-CONTRACT.json`
- `PERFORMANCE-BASELINE.json`
- `PACKAGING-IMPORT-CLOSURE.json`
- `ROLLBACK-PLAN.md`
- `OFFICIAL-PARSER-MIGRATION-PLAN.md`
- `PRODUCTION-ADMISSION-CHECKLIST.json`

No official parser bytes are changed in this task.

## 9. Historical retention

Always verify as applicable:

- 020 main50 = 50/50;
- 019 old shadow = 100/100;
- 020 final blind A/B = 120/120 each;
- 020 development controls = 48/48;
- 019 controls = 48/48;
- G0 = 5/5;
- R1 controls = 18/18;
- D01–D08 = 8/8;
- REF-001 = 43/43;
- original Parser regression;
- full repository regression.

## 10. Anti-overfit

Static scan for:

- ANB case IDs;
- fixture filenames;
- participant names;
- source hashes;
- source offsets;
- Oracle imports;
- expected semantic maps in runtime.

Behavioral checks:

- at least 30 identity renames;
- 20 harmless clause-order changes;
- 20 number changes;
- 20 bilingual paraphrase pairs.

## 11. Repeatability

Final evaluated candidate must be run twice with fresh NLP on:

- all 100 ANB cases;
- all 020 main/shadow/blind suites;
- all development controls used in 021;
- D01–D08;
- REF-001.

Semantic signatures must be EXACT excluding run IDs/timestamps/performance.

## 12. Required report package

Create:

`docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG/`

At minimum:

- REPORT.md
- ADMIN-AUTHORIZATION-READBACK.json
- PRE-RUN-INTEGRITY.json
- FIRST-BLIND-RESULTS.json
- FIRST-BLIND-SEMANTIC-REVIEW.json
- FIRST-BLIND-FIRST-DIVERGENCE.json
- FIRST-BLIND-SEAL.md
- FIRST-BLIND-SHA256SUMS.txt
- FIRST-BLIND-FAILURE-INVENTORY.json
- RETENTION-020.json
- D01-D08-RETENTION.json
- REF001-RETENTION.json
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

If Branch B is used, also create repair mechanism/control/architecture reports.

If Branch A is used, also create all Phase H production-preflight reports.

## 13. Allowed terminal outcomes

### Independent success

`ADMIN_NATURAL_BLIND_100_VALIDATED`

Requires untouched 020 candidate first blind = 100/100 and all retention/preflight checks pass.

### First blind gap, repaired

`ADMIN_NATURAL_100_REPAIRED_AWAITING_NEW_BLIND`

Requires first blind preserved, generic repair closed, all regressions green, and explicit statement that a new external blind set is still required.

### First blind gap, not closed

`ADMIN_NATURAL_GENERALIZATION_GAP_REMAINS`

### Method review

`METHOD_CONTRACT_REVIEW_REQUIRED`

### Architecture review

`ARCHITECTURE_REVIEW_REQUIRED`

### Integrity failure

`BLIND_INTEGRITY_FAILED`

## 14. Git rules

- branch only: `review/7plus1-parser`;
- no merge;
- no release;
- no tag;
- no production switch;
- preserve Source/Oracle/freeze;
- preserve 020 seal;
- preserve first blind evidence permanently;
- do not execute business actions described inside fixtures.

## 15. Final return

Return only after a terminal outcome with:

- TASK
- final commit
- terminal outcome
- pre-run integrity
- untouched first blind score
- clear-case score
- ambiguity-control score
- partial/wrong/unsupported/clear-unresolved counts
- first divergence(s)
- whether semantic runtime was changed after first blind
- if repaired: repaired regression score and mechanisms changed
- 020 retention
- G0/R1/D/REF
- focused/original/full regression
- repeatability
- anti-overfit
- production-preflight status if Branch A
- remaining gap
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
