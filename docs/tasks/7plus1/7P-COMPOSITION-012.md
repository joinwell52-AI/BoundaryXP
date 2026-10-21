# 7P-COMPOSITION-012 — R1 Contract Reconciliation & Resume Systemic Repair

## 0. Task identity

- TASK: `7P-COMPOSITION-012`
- START_HEAD: `e1e0fdeac934cc24aa2fb69dafb68d70aa5b2cf2`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Previous task: `7P-COMPOSITION-011`
- Previous outcome: `IMPLEMENTATION_GATE_FAILED`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Active comparison contract: `fixtures/7plus1/standard-contract/v0.3-admin-20261002/`
- `PRODUCTION_READY=false`

This task has two purposes:

1. reconcile the R1 implementation with an obsolete retained byte-lock that conflicts with the authorized owner-layer change;
2. repair the real R1 semantic blocker: owner/domain classification must not suppress a source-supported non-execution fact role.

If R1 is fully repaired and re-certified, continue with the originally planned R2–R4 systemic repair. Do not create a separate phrase-level repair task.

---

## 1. Required reading

Read in full before implementation:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-COMPOSITION-011.md`
4. `docs/reports/7plus1/7P-COMPOSITION-011/REPORT.md`
5. `docs/reports/7plus1/7P-COMPOSITION-011/FINAL-OUTCOME.json`
6. `docs/reports/7plus1/7P-COMPOSITION-011/R1-OWNER-LAYER-AUDIT.json`
7. `docs/reports/7plus1/7P-COMPOSITION-011/SOURCE-FLOOR-REGRESSION.json`
8. `docs/reports/7plus1/7P-COMPOSITION-011/RETAINED-COMPATIBILITY.json`
9. `tests/parser-7p-closure-008-retained-007.test.mjs`
10. `docs/reports/7plus1/7P-CONTRACT-010/SCOPE-AWARE-COMPARISON-CONTRACT.md`
11. v0.3 §§7, 8, 14.1, 16.1, 16.2, 17, 18.1
12. all 011 frozen non-Gold R1 inputs and retained failure receipts

Preserve all 001–011 sealed evidence.

---

# Part A — ADMIN compatibility-contract adjudication

## 2. Historical byte-lock conflict

011 failed one retained test because this assertion requires the current candidate `eligibility.mjs` to be byte-identical to the old 006 implementation:

```text
for ['graph-queries.mjs','projection.mjs','relations.mjs','eligibility.mjs']
  current == repair-006
```

This byte lock was valid for 007, where changing Eligibility was out of scope.

It is no longer a valid compatibility requirement for 011/012 because R1 is explicitly authorized to make the new global owner/layer contract **consumed before / by Eligibility**.

ADMIN decision:

```text
graph-queries.mjs byte lock: RETAIN
projection.mjs byte lock: RETAIN
relations.mjs byte lock: RETAIN
eligibility.mjs byte lock to 006: RETIRE FOR 012+
```

Do not delete the historical test evidence from sealed tasks.

In the active 012 regression suite, replace only the obsolete `eligibility.mjs` byte-equality assertion with semantic compatibility assertions.

---

## 3. Required semantic compatibility replacement

The replacement test must prove at minimum:

- retained 007 cross-instruction identity cases still produce the same certified aggregate/member/call-declaration behavior where unaffected;
- no raw Gold/expected/comparator access in Eligibility;
- no SWAI/source-hash/sample-literal behavior switches;
- QI–QB / projection remain unchanged;
- relation type space remains unchanged;
- existing v0.3 Eligibility dispositions not affected by owner/layer semantics remain behaviorally compatible on retained non-Gold fixtures;
- new owner/layer arbitration is the only authorized reason for Eligibility delta;
- deterministic repeat remains stable.

Record the old byte-pin as:

`RETIRED_OBSOLETE_COMPATIBILITY_ASSERTION`

not as a Parser PASS/FAIL.

---

# Part B — R1 fact-role-aware owner/domain repair

## 4. Confirmed semantic blocker

011 correctly eliminated multiple wrong owner/modality promotions, but it also suppressed this source-supported fact:

- case: SWAI-007
- slot: V
- fact type: BASELINE
- source: explicit commit `b4dc1f7`
- domain: ACCEPTANCE
- erroneous suppression reason: `ACCEPTANCE_CRITERION_NOT_EXECUTION`

The error is systemic:

> ACCEPTANCE is not current execution, but “not execution” does not imply that every fact role inside ACCEPTANCE is outside the current boundary.

A source-supported normative basis/reference/completion/constraint may remain valid without becoming an execution ACTION.

Do not patch the commit literal or SWAI-007.

---

## 5. Required separation: owner/domain vs fact role

R1 arbitration must determine two orthogonal dimensions:

### A. semantic owner / discourse layer

Examples:

- CURRENT_TASK
- OUTPUT_CONTENT
- ACCEPTANCE
- BACKGROUND
- CODE
- OUT_OF_SCOPE

### B. candidate fact role

Examples already expressible under v0.3/runtime contracts:

- execution ACTION
- INPUT / OUTPUT artifact role
- BASELINE / BASIS / REFERENCE
- COMPLETION / CONDITION
- FORBID / RESTRICT
- PARTICIPANT / RECIPIENT
- structural/internal evidence

A domain guard may restrict some fact roles without blanketing all roles.

---

## 6. Acceptance-domain compatibility matrix

Implement a generic, auditable policy consistent with frozen v0.3.

At minimum:

### ACCEPTANCE may support

- explicit BASELINE / BASIS / REFERENCE facts;
- COMPLETION / CONDITION facts;
- explicit constraint/prohibition facts when they constrain acceptance semantics and are not merely quoted/background;
- structural evidence required to prove an accepted completion condition.

### ACCEPTANCE does not automatically support

- current execution ACTION merely because an action-like predicate appears;
- new current-task INPUT/OUTPUT merely because an artifact is named in an acceptance statement;
- participant execution role without explicit relation;
- inherited modality from a parent criterion into explanatory/narrative child text.

### OUTPUT_CONTENT remains separate

Facts owned by OUTPUT_CONTENT remain under that output owner and do not become root V/B/A solely because they are mentioned in acceptance text.

### BACKGROUND / CODE / EXAMPLE remain non-current by default

Unless independently licensed by explicit current-task relation.

This matrix is implementation policy over existing v0.3 semantics, not a new normative method primitive.

---

## 7. Required R1 non-Gold additions

Add/freeze independent generic tests before fixing STANDARD behavior:

1. acceptance criterion containing explicit baseline commit/reference → V/BASIS retained;
2. acceptance criterion containing action-like explanatory verb → not current A;
3. acceptance criterion with completion condition → C retained;
4. acceptance criterion containing parenthetical explanation under prohibition → child predicate does not inherit FORBIDDEN;
5. acceptance criterion naming artifact without read/modify relation → not I/O;
6. OUTPUT_CONTENT constraint nested in acceptance → remains OUTPUT_CONTENT;
7. background commit mention → not root V without basis relation;
8. explicit “based on commit X” in acceptance → root V allowed;
9. conflicting acceptance owner/fact-role evidence → typed unresolved;
10. multilingual equivalents of at least baseline/reference and explanatory-action negatives.

No SWAI ids, sample commit values, sample paths, or Gold text.

---

# Part C — R1 re-certification gate

## 8. R1 PASS requirements

R1 PASS only when all are true:

- original 011 R1 non-Gold suite PASS;
- new fact-role-aware acceptance suite PASS;
- 011 focused owner/layer suite PASS;
- semantic replacement compatibility suite PASS;
- original Parser regression PASS;
- full regression 0 FAIL;
- all 9 STANDARD replay successfully under 010 contract;
- the two known owner errors remain eliminated:
  - SWAI-006 parenthetical “抓” false prohibition;
  - SWAI-010 narrative “到” false REQUIRED action;
- SWAI-007 explicit BASELINE is no longer suppressed;
- no previously source-supported non-execution V/C/B fact is lost due to a blanket domain guard;
- root false-defined <= 8;
- root wrong-binding <= 5;
- no retained expected MATCH loss;
- no new unreviewed top-level extra introduced by R1.

If any semantic floor regression remains, stop with:

`R1_SEMANTIC_GATE_FAILED`

Do not proceed to R2.

---

# Part D — Resume R2–R4 after R1 PASS

## 9. R2

Resume the R2 requirements from 011:

**Qualified artifact/reference identity and role normalization**

Required:

- complete protected technical spans;
- file/member, path/line, wildcard/collection identity;
- before/after artifact identity;
- reference/basis role normalization;
- cardinality/set expression;
- no lexical-role shortcut.

Run non-Gold first, then all 9 STANDARD and compatibility/regression gates.

Stop if R2 fails.

---

## 10. R3

Resume:

**Explicit transfer / recipient constructs**

Required:

- explicit actor/recipient/source/target;
- “给 X”, send/report to X, structured `to:`;
- no nearest-person/default-role guess;
- ambiguity unresolved.

Run non-Gold first, then all 9 STANDARD and gates.

Stop if R3 fails.

---

## 11. R4

Resume:

**Deterministic whole-frame composition certification**

Certification must jointly require:

- owner;
- predicate;
- target/object;
- participants;
- modality;
- condition;
- set/scope;
- artifact role;
- OUTPUT_CONTENT owner where applicable;
- negative evidence;
- provenance completeness.

Local leaf success is not sufficient.

---

# Final stop rule

## 12. Architecture decision gate

After R1–R4 all pass their own mechanism gates:

If:

```text
CASE_IOA_JOINT >= 1/9
```

and systemic error metrics improve without semantic-floor regression:

terminal outcome may be:

`SYSTEMIC_REPAIR_VALIDATED`

If R1–R4 are successfully implemented on non-Gold and compatibility gates but:

```text
CASE_IOA_JOINT = 0/9
```

then terminal outcome must be:

`SYSTEMIC_REPAIR_INSUFFICIENT`

and recommend a **controlled Hybrid semantic-proposal experiment**.

Do not start another deterministic phrase/rule repair task.

---

## 13. Minimum semantic targets

Use 010 as the baseline:

```text
CASE_IOA_JOINT: 0/9
STANDARD_PARSED: 0/9
root_false_defined: 9
root_wrong_binding: 11
slot_status_mismatches: 72
owned_content_missing: 22
```

Use the 011 R1 diagnostic only as an intermediate candidate, not as the frozen semantic baseline.

Minimum systemic validation still requires:

- CASE_IOA_JOINT >= 1/9;
- false-defined < 9;
- wrong-binding < 11;
- slot status mismatches < 72;
- owned-content missing < 22;
- no new semantic-floor regression.

---

# Performance / anti-overfit / integrity

## 14. Performance

Repeat controlled deterministic compiler timing with same methodology as 011.

Report before/after medians and total.

If deterministic compiler cost increases >25% without case-level semantic closure, mark performance concern.

---

## 15. Anti-overfit

Runtime logic must contain no:

- SWAI ids;
- source hashes as behavior switches;
- expected strings;
- sample offsets;
- sample-specific functions/paths/commits;
- comparator access;
- test-only semantic shortcuts.

---

## 16. Required artifacts

Create:

`docs/reports/7plus1/7P-COMPOSITION-012/`

At minimum:

- `REPORT.md`
- `ADMIN-COMPATIBILITY-ADJUDICATION.json`
- `R1-FACT-ROLE-OWNER-AUDIT.json`
- `R1-COMPATIBILITY-REPLACEMENT.json`
- `R1-GATE.json`
- `R2-IDENTITY-ROLE-AUDIT.json`
- `R3-RECIPIENT-AUDIT.json`
- `R4-COMPOSITION-CERTIFICATION-AUDIT.json`
- `NON-GOLD-FROZEN-INPUTS.json`
- `NON-GOLD-RESULTS.json`
- `CASE-IOA-JOINT-BEFORE-AFTER.json`
- `FULL-CASE-BEFORE-AFTER.json`
- `FALSE-WRONG-STATUS-BEFORE-AFTER.json`
- `OWNED-CONTENT-BEFORE-AFTER.json`
- `RETAINED-COMPATIBILITY.json`
- `PERFORMANCE.json`
- `ANTI-OVERFIT-AUDIT.json`
- `FULL-REGRESSION.json`
- `FINAL-OUTCOME.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `CHANGED-FILES.txt`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

Preserve all first-run and intermediate failures.

---

## 17. Allowed terminal outcomes

Exactly one:

- `SYSTEMIC_REPAIR_VALIDATED`
- `SYSTEMIC_REPAIR_INSUFFICIENT`
- `R1_SEMANTIC_GATE_FAILED`
- `R2_IMPLEMENTATION_GATE_FAILED`
- `R3_IMPLEMENTATION_GATE_FAILED`
- `R4_IMPLEMENTATION_GATE_FAILED`
- `V0_3_METHOD_LIMITATION_CONFIRMED`

Do not report certification of the full v0.3 Parser in this task.

---

## 18. Git / production rules

- work only on `review/7plus1-parser`;
- create a new isolated candidate derived from the sealed 011 candidate;
- do not modify 011 sealed evidence;
- do not overwrite historical Gold/Source;
- do not modify 010 contract overlay;
- do not modify v0.3;
- do not merge/release/tag;
- do not switch production entry;
- stop at `WAITING_ADMIN_REVIEW`.

---

## 19. Final return format

Return:

- TASK
- final commit
- terminal outcome
- retired byte-pin adjudication status
- R1/R2/R3/R4 gate states
- focused/non-Gold/retained/original/full-regression counts
- CASE_IOA_JOINT before → after
- STANDARD_PARSED before → after
- root false-defined before → after
- root wrong-binding before → after
- slot status mismatch before → after
- owned-content missing before → after
- source-floor regression count
- controlled performance delta
- anti-overfit result
- Gold/Source/v0.3/010 overlay unchanged
- no merge/release/tag/production switch
- report path
- `STATUS=WAITING_ADMIN_REVIEW`
