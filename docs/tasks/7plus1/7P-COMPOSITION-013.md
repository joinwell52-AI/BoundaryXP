# 7P-COMPOSITION-013 — R1 Source Binding / Condition Scope Certification, then Resume R2–R4

## 0. Task identity

- TASK: `7P-COMPOSITION-013`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Start base: latest `review/7plus1-parser` HEAD containing the sealed `7P-COMPOSITION-012` report
- Previous task: `7P-COMPOSITION-012`
- Previous outcome: `R1_SEMANTIC_GATE_FAILED`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Active comparison contract: `fixtures/7plus1/standard-contract/v0.3-admin-20261002/`
- `PRODUCTION_READY=false`

This is a bounded continuation of the systemic R1–R4 program.

It is **not** a phrase-level repair.

The only R1 work authorized here is generic certification of:

1. quantified/deictic referent sets before resolved scope admission;
2. condition ownership/binding before resolved constraint admission.

After R1 passes, continue R2–R4 from the 012 plan. If R1 cannot pass without v0.3 changes, stop.

---

## 1. Required reading

Read in full before implementation:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-COMPOSITION-012.md`
4. `docs/reports/7plus1/7P-COMPOSITION-012/REPORT.md`
5. `docs/reports/7plus1/7P-COMPOSITION-012/FINAL-OUTCOME.json`
6. `docs/reports/7plus1/7P-COMPOSITION-012/R1-GATE.json`
7. `docs/reports/7plus1/7P-COMPOSITION-012/FIRST-DIVERGENCE.json`
8. `docs/reports/7plus1/7P-COMPOSITION-012/SOURCE-FLOOR-REGRESSION.json`
9. `docs/reports/7plus1/7P-COMPOSITION-012/R1-FACT-ROLE-OWNER-AUDIT.json`
10. `docs/reports/7plus1/7P-COMPOSITION-012/RETAINED-COMPATIBILITY.json`
11. `docs/reports/7plus1/7P-CONTRACT-010/SCOPE-AWARE-COMPARISON-CONTRACT.md`
12. v0.3 §§7, 8, 10, 11, 14.1, 16.1, 17, 18.1
13. all 012 frozen non-Gold inputs and 012 replay traces

Preserve all 001–012 sealed evidence.

---

## 2. Frozen 012 facts

Treat as authoritative:

```text
focused = 59/59 PASS
non-Gold = 25/25 PASS
retained = 518/518 PASS
original parser = 739/739 PASS
full regression = 5939 PASS / 0 FAIL / 17 SKIP

CASE_IOA_JOINT = 0/9
STANDARD_PARSED = 0/9

root_false_defined = 8
root_wrong_binding = 7
slot_status_mismatches = 72
owned_content_missing = 22

old byte pin = RETIRED_OBSOLETE_COMPATIBILITY_ASSERTION
explicit acceptance BASELINE restored = true
known wrong owner predicates ("抓", "到") blocked = true

R1 = FAIL
R2/R3/R4 = NOT_STARTED
```

The two current R1 soundness blockers are generic:

- unresolved quantified/deictic target admitted as RESOLVED scope;
- condition-scoped prohibition admitted without uniquely certified condition.

---

# Part A — Quantified / deictic referent certification

## 3. Problem

A phrase such as:

```text
这些文件
上述文件
任何这些文件
these files
the above items
any of these files
```

must not become a resolved ITEM merely because the noun phrase is locally well formed.

Before a resolved boundary fact uses such a target, the parser must prove a unique admissible antecedent set or keep the referent unresolved.

---

## 4. Required generic mechanism

Add a bounded **Referent Set Certification** stage before Eligibility / whole-scope admission.

For a deictic or quantified referent candidate, produce one of:

```text
CERTIFIED_REFERENT_SET
UNRESOLVED_REFERENT_SET
NOT_DEICTIC
```

Certification requires:

- compatible semantic owner;
- structurally admissible antecedent region;
- compatible entity/artifact type;
- one uniquely supported antecedent set or an explicitly enumerated set;
- preserved cardinality / quantifier semantics;
- source-span provenance for mention + antecedent;
- no conflicting equally valid antecedent set.

If two or more compatible antecedent sets remain:

```text
UNRESOLVED_REFERENT_SET
```

Do not choose by nearest text or model score.

---

## 5. Quantifier semantics

Preserve at minimum:

- ALL / every / all / 全部
- EACH / each / 各
- ANY / any / 任何
- explicit finite member set

Do not flatten `ANY(set)` into one arbitrary ITEM.

Do not promote the deictic surface text itself as the resolved semantic target.

The final scope must point to the certified antecedent set/expression, or remain unresolved.

---

## 6. Required deictic non-Gold tests

Freeze independent tests before STANDARD replay:

1. “these files” with exactly one explicit prior file set → CERTIFIED;
2. “任何这些文件” with one prior set → ANY(set), not ITEM(surface);
3. two competing prior sets → UNRESOLVED;
4. no antecedent set → UNRESOLVED;
5. antecedent under different OUTPUT_CONTENT owner → not bind to root current-task referent;
6. same surface file set under two task sections → owner disambiguation required;
7. explicit finite enumeration → certified set;
8. English “any of these files” equivalent;
9. negative control: ordinary noun phrase without deictic marker → NOT_DEICTIC;
10. repeated referent after intervening unrelated paragraph → bind only if structural owner/provenance remains valid.

No SWAI ids, sample file names, sample paths, or Gold text.

---

# Part B — Condition ownership / constraint certification

## 7. Problem

A prohibition may be source-valid but only under a condition such as:

```text
dry-run 时不得写盘
if dry-run, do not modify files
仅在 X 情况下禁止 Y
```

The parser must not emit an unconditional resolved B fact unless the condition is either absent by source semantics or correctly certified.

---

## 8. Required generic mechanism

Add a bounded **Constraint Condition Certification** step.

For a candidate FORBID / RESTRICT / condition-sensitive action:

1. identify candidate local condition expressions;
2. verify semantic owner compatibility;
3. verify structural attachment / clause ownership;
4. require unique condition binding where source semantics are conditional;
5. attach the certified condition expression to the fact/proof;
6. if required condition is ambiguous/missing, do not emit unconditional RESOLVED constraint.

Allowed outcomes:

```text
CERTIFIED_UNCONDITIONAL
CERTIFIED_CONDITIONAL
UNRESOLVED_CONDITION_BINDING
```

Do not delete the predicate merely because condition binding is unresolved.

---

## 9. Required condition non-Gold tests

Freeze before STANDARD replay:

1. dry-run prohibition with explicit local condition → CERTIFIED_CONDITIONAL;
2. unconditional prohibition → CERTIFIED_UNCONDITIONAL;
3. condition two clauses away but structurally owned → certified if unique;
4. two competing conditions → unresolved;
5. parent condition interrupted by sibling section → must not leak;
6. parenthetical explanation under prohibition → explanation does not inherit prohibition;
7. acceptance-domain condition → condition/completion may survive without becoming current execution A;
8. OUTPUT_CONTENT condition → remains output-owned;
9. English if/when equivalents;
10. negative control where condition word appears in background only.

---

# Part C — R1 re-certification

## 10. R1 PASS gate

R1 passes only when all of the following are true:

- all 012 R1 non-Gold tests remain PASS;
- all new referent-set tests PASS;
- all new condition-binding tests PASS;
- focused compatibility PASS;
- retained 001–012 compatibility PASS;
- original Parser regression PASS;
- full regression = 0 FAIL;
- all 9 STANDARD replay successfully under 010 contract;
- SWAI-008 deictic prohibition is either correctly bound to a certified antecedent set or remains unresolved; no placeholder ITEM scope;
- SWAI-004 dry-run prohibition carries the correct condition or remains unresolved; no unconditional wrong binding;
- SWAI-006 “抓” false prohibition remains blocked;
- SWAI-010 “到” false action remains blocked;
- SWAI-007 explicit BASELINE remains present;
- no retained expected MATCH loss;
- root false-defined <= 8;
- root wrong-binding <= 5;
- source-floor regression count = 0;
- no new unreviewed top-level extra introduced by R1.

If R1 fails, stop with:

`R1_SOURCE_BINDING_GATE_FAILED`

Do not start R2–R4.

---

# Part D — Resume R2–R4 after R1 PASS

## 11. R2

Resume the 012/011 plan:

**Qualified artifact/reference identity and role normalization**

At minimum verify:

- protected technical spans;
- file/member and path/line identity;
- wildcard/collection identity;
- before/after artifact identity;
- reference/basis normalization;
- set/cardinality preservation;
- no lexical-role shortcut.

Non-Gold first, then all 9 STANDARD, then compatibility/regression.

Stop on failure.

---

## 12. R3

Resume:

**Explicit transfer / recipient constructs**

At minimum:

- explicit “给 X”, send/report to X, structured `to:`;
- actor/recipient distinction;
- no nearest-person/default-role guess;
- ambiguity unresolved.

Non-Gold first, then all 9 STANDARD and gates.

Stop on failure.

---

## 13. R4

Resume:

**Deterministic whole-frame composition certification**

Whole-frame admission requires compatible:

- owner;
- predicate;
- target/object;
- participant;
- modality;
- condition;
- scope/set;
- artifact role;
- OUTPUT_CONTENT owner if applicable;
- negative evidence;
- provenance completeness.

A local leaf or local relation is not enough.

---

# Architecture stop rule

## 14. Decisive rule

If R1–R4 all pass their mechanism/non-Gold/compatibility gates but:

```text
CASE_IOA_JOINT = 0/9
```

then final outcome must be:

`SYSTEMIC_REPAIR_INSUFFICIENT`

and the next recommendation must be:

`CONTROLLED_HYBRID_SEMANTIC_PROPOSAL_EXPERIMENT`

Do not create another deterministic phrase/rule repair task.

If:

```text
CASE_IOA_JOINT >= 1/9
```

with no semantic-floor regression, systemic repair is validated and may proceed to a final closure/certification task.

---

## 15. Semantic targets

Use 010 as frozen baseline, while retaining 012 diagnostics:

```text
CASE_IOA_JOINT baseline = 0/9
STANDARD_PARSED baseline = 0/9
root_false_defined baseline = 9
root_wrong_binding baseline = 11
slot_status_mismatches baseline = 72
owned_content_missing baseline = 22
```

Minimum systemic validation:

- CASE_IOA_JOINT >= 1/9;
- root_false_defined < 9;
- root_wrong_binding < 11;
- slot status mismatches < 72;
- owned-content missing < 22;
- source-floor regressions = 0.

---

# Performance / anti-overfit / integrity

## 16. Performance

Repeat controlled deterministic compiler timing using the 011/012 methodology.

Report median and total before/after.

If deterministic compiler cost grows >25% without case-level semantic closure, mark performance concern.

---

## 17. Anti-overfit

No runtime semantic logic may depend on:

- SWAI ids;
- source hashes as behavior switches;
- Gold expected strings;
- sample offsets;
- sample-specific file/function/path/commit literals;
- comparator access;
- test-only semantic shortcuts.

---

## 18. Required report package

Create:

`docs/reports/7plus1/7P-COMPOSITION-013/`

At minimum:

- `REPORT.md`
- `BASELINE.json`
- `R1-REFERENT-SET-AUDIT.json`
- `R1-CONDITION-BINDING-AUDIT.json`
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

Preserve all first-run/intermediate failures.

---

## 19. Allowed terminal outcomes

Exactly one:

- `SYSTEMIC_REPAIR_VALIDATED`
- `SYSTEMIC_REPAIR_INSUFFICIENT`
- `R1_SOURCE_BINDING_GATE_FAILED`
- `R2_IMPLEMENTATION_GATE_FAILED`
- `R3_IMPLEMENTATION_GATE_FAILED`
- `R4_IMPLEMENTATION_GATE_FAILED`
- `V0_3_METHOD_LIMITATION_CONFIRMED`

Do not declare full v0.3 Parser certification in this task.

---

## 20. Git / production rules

- work only on `review/7plus1-parser`;
- derive from latest branch HEAD carrying sealed 012;
- do not modify 012 sealed evidence;
- do not overwrite Gold/Source;
- do not modify 010 contract overlay;
- do not modify v0.3;
- do not merge/release/tag;
- do not switch production entry;
- stop at `WAITING_ADMIN_REVIEW`.

---

## 21. Final return format

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
- Gold/Source/v0.3/010 overlay unchanged
- no merge/release/tag/production switch
- report path
- `STATUS=WAITING_ADMIN_REVIEW`
