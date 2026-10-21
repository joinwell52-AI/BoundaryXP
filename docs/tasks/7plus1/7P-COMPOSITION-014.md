# 7P-COMPOSITION-014 — R4 Distributive Construction Closure & Architecture Verdict

## 0. Task identity

- TASK: `7P-COMPOSITION-014`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Start base: latest `review/7plus1-parser` HEAD containing the sealed `7P-COMPOSITION-013` report
- Previous task: `7P-COMPOSITION-013`
- Previous outcome: `R4_IMPLEMENTATION_GATE_FAILED`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Active comparison contract: `fixtures/7plus1/standard-contract/v0.3-admin-20261002/`
- `PRODUCTION_READY=false`

This is the **final bounded deterministic systemic-repair decision task**.

R1/R2/R3 are already PASS and must remain frozen-compatible. The only authorized implementation work is to complete the generic R4 distributive / whole-frame construction that failed on a predeclared non-Gold case.

This task must produce an architecture verdict:

- `SYSTEMIC_REPAIR_VALIDATED`, or
- `SYSTEMIC_REPAIR_INSUFFICIENT`, or
- a concrete implementation gate failure.

Do not open another deterministic phrase/rule repair after this task.

---

## 1. Required reading

Read in full:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-COMPOSITION-013.md`
4. `docs/reports/7plus1/7P-COMPOSITION-013/REPORT.md`
5. `docs/reports/7plus1/7P-COMPOSITION-013/FINAL-OUTCOME.json`
6. `docs/reports/7plus1/7P-COMPOSITION-013/R1-GATE.json`
7. `docs/reports/7plus1/7P-COMPOSITION-013/R2-IDENTITY-ROLE-AUDIT.json`
8. `docs/reports/7plus1/7P-COMPOSITION-013/R3-RECIPIENT-AUDIT.json`
9. `docs/reports/7plus1/7P-COMPOSITION-013/R4-COMPOSITION-CERTIFICATION-AUDIT.json`
10. `docs/reports/7plus1/7P-COMPOSITION-013/FIRST-DIVERGENCE.json`
11. `docs/reports/7plus1/7P-CONTRACT-010/SCOPE-AWARE-COMPARISON-CONTRACT.md`
12. v0.3 §§7, 8, 10, 11, 12, 14.1, 16.1, 17, 18.1
13. all frozen non-Gold R4 inputs from 013
14. all 013 final STANDARD replays

Preserve all 001–013 sealed evidence.

---

## 2. Frozen baseline

Treat these as fixed:

```text
R1 = PASS
R2 = PASS
R3 = PASS
R4 = FAIL

focused = 103/103 PASS
non-Gold = 52 PASS / 1 FAIL
retained = 518/518 PASS
original parser = 739/739 PASS
full regression = 6042 PASS / 0 FAIL / 17 SKIP

CASE_IOA_JOINT = 0/9
STANDARD_PARSED = 0/9

root_false_defined = 8
root_wrong_binding = 5
slot_status_mismatches = 72
owned_content_missing = 22
source_floor_regression = 0
```

The R4 failure is generic and predeclared:

> a distributive instruction over an explicit three-member file set contains “each / 各” and one-per-member quantity semantics, but the typed producer does not construct the full distributive frame required for whole-frame certification.

---

# Part A — Generic distributive construction

## 3. Required semantic structure

Support a generic construction of the form:

```text
for/in MEMBER_SET, EACH member performs/receives ACTION exactly N times/items
```

Examples:

- 在三个文件中各加一个测试点
- 对四个模块分别生成一个报告
- add one check to each of the three files
- create two entries for every selected module

Do not hardcode these phrases.

The typed producer must construct, when evidence is explicit:

- governing action/predicate;
- member set identity;
- distributive operator `EACH`;
- per-member quantity;
- object/result identity;
- modality;
- semantic owner;
- source provenance;
- compatible scope expression.

---

## 4. Required distinctions

Do not confuse:

- AGENT vs PATIENT simply because a file appears before the verb;
- EACH(set) with ALL(set) as one aggregate action;
- “one per member” with total count one;
- list membership with participant role;
- imperative structure with a lexical guess.

If modality is not explicitly or structurally licensed, keep it unresolved.

If the member set is incomplete/ambiguous, do not certify the distributive frame.

---

## 5. Non-Gold suite

Before STANDARD replay, freeze and test at least:

1. three-file EACH + one item per file;
2. four-module EACH + two outputs per module;
3. English EACH equivalent;
4. reversed word order with explicit set;
5. explicit ALL aggregate but no distributive EACH;
6. EACH with ambiguous member set → unresolved;
7. EACH with missing quantity → preserve distributive relation but quantity unresolved;
8. explicit member set under OUTPUT_CONTENT owner;
9. nested subtask owner;
10. negative control where “each” occurs in background/example;
11. one member excluded from set;
12. conflicting quantities → unresolved;
13. same file names in another semantic owner must not join set;
14. distributive test insertion with explicit imperative;
15. non-imperative descriptive sentence with same nouns → not current action.

No SWAI ids, sample paths, sample function names, sample source hashes, or Gold text.

---

# Part B — R4 whole-frame certification

## 6. Whole-frame certificate

R4 may emit/certify a composite boundary fact only when all required components are proven:

- owner;
- action/predicate;
- target/member set;
- distributive operator if present;
- per-member quantity if required by source;
- modality;
- condition;
- artifact role;
- OUTPUT_CONTENT owner where applicable;
- negative evidence;
- complete provenance.

A local PATIENT, EVENT, or list membership alone is insufficient.

---

## 7. R4 PASS gate

R4 PASS requires all:

- all new distributive non-Gold tests PASS;
- the previously failing frozen R4 case now PASS without changing its expected mechanism contract;
- R1/R2/R3 retained gates remain PASS;
- focused compatibility PASS;
- retained 001–013 compatibility PASS;
- original Parser regression PASS;
- full regression = 0 FAIL;
- all 9 STANDARD replay successfully under 010 contract;
- no new source-floor regression;
- root false-defined <= 8;
- root wrong-binding <= 5;
- no retained expected MATCH loss;
- anti-overfit PASS;
- deterministic repeat PASS.

If R4 mechanism itself still fails, terminal outcome:

`R4_IMPLEMENTATION_GATE_FAILED`

and stop.

---

# Part C — Architecture verdict

## 8. Decisive STANDARD gate

Only after R4 PASS, evaluate the systemic architecture.

### If

```text
CASE_IOA_JOINT >= 1/9
```

and there is no semantic-floor regression:

terminal outcome:

`SYSTEMIC_REPAIR_VALIDATED`

Then recommend one final closure/certification task for the remaining cases.

### If

```text
CASE_IOA_JOINT = 0/9
```

after R1/R2/R3/R4 all PASS:

terminal outcome:

`SYSTEMIC_REPAIR_INSUFFICIENT`

The next recommendation must be:

`CONTROLLED_HYBRID_SEMANTIC_PROPOSAL_EXPERIMENT`

Do not recommend another deterministic phrase/rule repair.

This rule is mandatory.

---

## 9. Additional semantic indicators

Record, but do not substitute for the joint gate:

- STANDARD_PARSED;
- root I/O/A/P/R/V/C/B MATCH/MISSING;
- false-defined;
- wrong-binding;
- slot status mismatches;
- owned-content missing;
- per-case full completeness.

Item-count improvement alone does not validate the architecture.

---

# Performance / integrity

## 10. Performance

Repeat controlled deterministic compiler timing using the same methodology as 011–013.

If deterministic compiler cost grows >25% without case-level closure, mark performance concern.

---

## 11. Anti-overfit

No runtime logic may contain:

- SWAI ids;
- source hashes as behavior switches;
- expected strings;
- sample offsets;
- sample-specific files/functions/commits;
- comparator access;
- test-only semantic shortcuts.

---

## 12. Required artifacts

Create:

`docs/reports/7plus1/7P-COMPOSITION-014/`

At minimum:

- `REPORT.md`
- `BASELINE.json`
- `R4-DISTRIBUTIVE-CONSTRUCTION-AUDIT.json`
- `R4-COMPOSITION-CERTIFICATION-AUDIT.json`
- `R4-GATE.json`
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
- `ARCHITECTURE-VERDICT.json`
- `FINAL-OUTCOME.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `CHANGED-FILES.txt`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

Preserve all first-run/intermediate failures.

---

## 13. Allowed terminal outcomes

Exactly one:

- `SYSTEMIC_REPAIR_VALIDATED`
- `SYSTEMIC_REPAIR_INSUFFICIENT`
- `R4_IMPLEMENTATION_GATE_FAILED`
- `V0_3_METHOD_LIMITATION_CONFIRMED`

Do not declare full v0.3 Parser certification in this task.

---

## 14. Git / production rules

- work only on `review/7plus1-parser`;
- derive from latest branch HEAD carrying sealed 013;
- do not modify sealed 013 evidence;
- do not overwrite Gold/Source;
- do not modify 010 contract overlay;
- do not modify v0.3;
- do not merge/release/tag;
- do not switch production entry;
- stop at `WAITING_ADMIN_REVIEW`.

---

## 15. Final return format

Return:

- TASK
- final commit
- terminal outcome
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
- architecture verdict
- Gold/Source/v0.3/010 overlay unchanged
- no merge/release/tag/production switch
- report path
- `STATUS=WAITING_ADMIN_REVIEW`
