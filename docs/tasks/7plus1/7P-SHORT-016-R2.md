# 7P-SHORT-016-R2 — Close REF-001 Anchor and Certify Short Direct Parser

## 0. Identity

- TASK: `7P-SHORT-016-R2`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Base: latest branch HEAD carrying sealed `7P-SHORT-016-R1`
- Parent result: `G4_REF001_REGRESSION`
- ADMIN adjudication: `docs/tasks/7plus1/7P-SHORT-016-R2-REF001-ADMIN-ADJUDICATION.md`
- Frozen direct cases: `docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- PRODUCTION_READY=false

## 1. Purpose

D01–D08 are already fully closed 8/8.

This task does **not** reopen G0–G3 design and does not add Hybrid, WP, Matrix, long STANDARD tuning, new models, new Packs, or new relation spaces.

The sole goal is to close the remaining generic REF-001 anchor issues and then decide whether the short direct parser is validated.

## 2. Required reading

Read in full:

1. CURRENT-TASK
2. this taskbook
3. `7P-SHORT-016-R2-REF001-ADMIN-ADJUDICATION.md`
4. sealed 016-R1 REPORT / G4 / REF001 full comparison / semantic errors
5. frozen D01–D08 cases
6. REF-001 source / expected Canonical / expected Boundary IR
7. normative method sections on Participant, Completion, Scope, Coverage, Canonical projection

## 3. Frozen facts

Treat these as fixed:

```text
D01–D08 FULL_CASE_CLOSED = 8/8
D01–D08 same-case IOA = 8/8
D01–D08 wrong_binding = 0
D01–D08 unsupported_RESOLVED_extra = 0
D01–D08 duplicate semantic identity = 0

REF-001 legacy = 41/43
failed:
  performer_identity_one
  completion_AND

REF-001 known source ambiguity:
  上述材料 = UNRESOLVED_COREFERENCE
```

All D01–D08 must remain 8/8.

## 4. Generic mechanism A — role-qualified identity normalization

Implement a generic identity rule:

```text
role-qualified full identity
+ later unique bare-name reference
→ same semantic participant identity
```

Examples for independent non-Gold tests:

- `编辑李梅` ... later `李梅`
- `复核人周安` ... later `周安`
- English role + full name ... later same full name / unambiguous shortened mention where supported

Requirements:

- preserve all source spans;
- keep the most informative display identity;
- do not merge two different people with same family/name fragment;
- do not merge by string containment alone;
- participant aliases must propagate consistently to action subjects and participant projection.

## 5. Generic mechanism B — bounded subject inheritance

A task performer may fill an omitted action subject only if:

- the predicate is an execution action;
- local owner/discourse supports the same task;
- no explicit conflicting subject exists;
- the predicate is not an artifact state, format/basis proposition, completion state, or actor-unspecified task-level prohibition.

Independent non-Gold tests must include:

1. omitted subject in continuation action → inherit;
2. artifact format conformance → do not inherit performer;
3. task-level prohibition with no local actor → remain actor-unspecified;
4. completion predicate → do not inherit performer as execution subject;
5. conflicting explicit actor → no inheritance.

No REF literal/name/file special cases.

## 6. Generic mechanism C — completion conjunction

Support constructions equivalent to:

```text
只有 X，并且 Y，才算完成
only when X and Y is the task complete
```

Required:

- preserve both operands;
- preserve AND;
- preserve necessary condition semantics;
- preserve universal quantification where source says all/every;
- do not collapse `没有遗漏` into a standalone NOT condition that loses reviewer confirmation;
- retain exact source provenance per operand.

Add Chinese and English non-Gold tests.

## 7. Generic mechanism D — coverage locality

A typed unresolved affecting one slot must not contaminate unrelated slots.

For REF-001:

- `上述材料` ambiguity belongs to the upload prohibition in B;
- I/A must not become PARSER_COVERAGE_FAILURE solely because of that ambiguity.

Add non-Gold tests where:

- unresolved B coreference coexists with fully resolved I/O/A;
- unresolved recipient affects P/A recipient semantics but not R/V;
- unresolved output identity affects O/A/C but not an unrelated V.

## 8. Semantic-equivalence audit

Do not force byte/shape identity when representation enrichment is semantically equivalent.

Specifically audit:

- ITEM scope added to an action already bound to the same object;
- equivalent source-supported identity normalization.

But do **not** use “equivalence” to hide:

- different owner;
- different condition;
- different cardinality;
- different modality;
- wrong participant;
- wrong object;
- missing logical operand.

Create explicit semantic-equivalence evidence rather than weakening the comparator globally.

## 9. Non-Gold first

Before REF rerun, freeze at least:

- 4 identity tests;
- 5 subject-inheritance tests;
- 4 completion-AND tests;
- 3 coverage-locality tests.

All must pass before REF evaluation.

## 10. Final G4 gate

G4 PASS requires:

```text
REF legacy assertions = 43/43
performer_identity_one = PASS
completion_AND = PASS
known 上述材料 ambiguity = preserved UNRESOLVED
no new wrong binding
no unsupported RESOLVED extra
slot-local coverage correct
D01–D08 remain 8/8
repeatability = EXACT
```

For full Canonical:

- all source-semantic requirements must match;
- source-supported semantically equivalent enrichment may be classified `EQUIVALENT_ENRICHMENT`;
- no true semantic mismatch may remain.

If full Canonical still has a genuine semantic gap, terminal outcome must be `REF001_FULL_CLOSURE_GAP_REMAINS`.

## 11. Final certification

If G4 passes and no genuine full-Canonical semantic gap remains:

`SHORT_DIRECT_PARSER_VALIDATED`

Then and only then may NEXT-TASK recommend starting the separate medium multi-WP / Matrix design stage.

Do not implement WP/Matrix in this task.

## 12. Validation

Run:

- R2 focused tests;
- retained 016/016-R1 tests;
- original Parser regression;
- full repository regression;
- D01–D08 + REF repeat;
- anti-overfit;
- protected assets;
- SEAL.

## 13. Allowed outcomes

Exactly one:

- `SHORT_DIRECT_PARSER_VALIDATED`
- `IDENTITY_NORMALIZATION_GATE_FAILED`
- `SUBJECT_INHERITANCE_GATE_FAILED`
- `COMPLETION_AND_GATE_FAILED`
- `COVERAGE_LOCALITY_GATE_FAILED`
- `REF001_FULL_CLOSURE_GAP_REMAINS`
- `IMPLEMENTATION_GATE_FAILED`

## 14. Required report package

Create:

`docs/reports/7plus1/7P-SHORT-016-R2/`

At minimum:

- REPORT.md
- ADMIN-ADJUDICATION-READBACK.json
- NON-GOLD-FROZEN-INPUTS.json
- IDENTITY-NORMALIZATION-AUDIT.json
- SUBJECT-INHERITANCE-AUDIT.json
- COMPLETION-AND-AUDIT.json
- COVERAGE-LOCALITY-AUDIT.json
- SEMANTIC-EQUIVALENCE-AUDIT.json
- D01-D08-RETAINED.json
- G4-REF001.json
- REF001-FULL-CANONICAL-COMPARISON.json
- SEMANTIC-ERRORS.json
- SLOT-STATUS-AUDIT.json
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

## 15. Git rules

- work only on `review/7plus1-parser`;
- do not modify sealed 016 / 016-R1 reports;
- do not modify D01–D08 source/expected;
- do not modify REF-001 Source/Gold;
- do not modify v0.3 normative meaning;
- do not merge/release/tag;
- do not switch production;
- stop at `WAITING_ADMIN_REVIEW`.

## 16. Final return

Return:

- TASK
- final commit
- terminal outcome
- identity gate
- subject inheritance gate
- completion AND gate
- coverage locality gate
- D01–D08 full closure
- REF legacy assertions
- REF full Canonical result
- wrong binding / unsupported RESOLVED extras
- repeatability
- focused/original/full regression
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
