# 7P-ADMIN-SHORT-018 — ADMIN Root 7+1 Parser Hardening

## 0. Identity

- TASK: `7P-ADMIN-SHORT-018`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Start from current branch HEAD `5219eb5f28cb1e3bdb2b47f29784cc0428bfe8ce`
- Baseline parser: sealed short-direct R2 implementation
- Diagnostic corpus: `fixtures/7plus1/admin-short-050-r02/CASES.md`
- Diagnostic baseline: `docs/reports/7plus1/ADMIN-SHORT-050-r02/`
- PRODUCTION_READY=false

## 1. ADMIN correction of scope

This task returns to the actual BoundaryXP core problem:

```text
ADMIN natural-language task
→ Canonical Root 7+1
→ computable authority boundary
```

Do **not** do WP decomposition.

Do **not** infer WP0...WPn.

Do **not** run Matrix/WP code.

Do **not** treat PM planning as the input contract.

The 50 ADMIN task briefs are all treated in this task as **one ADMIN root authority scope each**. Multiple actors, review steps, reports, recipients, or sequencing inside the ADMIN task do not by themselves authorize the parser to split the task into WPs.

The active 017 Matrix line is suspended for this task. Preserve it unchanged.

## 2. What “short ADMIN task” means in this task

A short ADMIN task is not defined only by character count.

For 018, the class is:

```text
ADMIN_ROOT_SINGLE_AUTHORITY_SCOPE
```

with these properties:

- one ADMIN-issued authority boundary;
- no explicit WP-X headings;
- human readers can directly determine the intended root I/O/A/P/R/V/C/B;
- the task may contain multiple actors;
- the task may contain review/submit sequencing;
- the task may contain conditional outputs, time/quantity limits, basis/version, prohibitions, output-content requirements, or recipient/reviewer roles;
- the parser must not create execution detail not present in the source.

The r02 corpus happens to contain 50 texts of roughly 82–176 codepoints, but length is not the semantic definition.

## 3. What counts as “solved”

Do not use runtime success or contract/schema PASS as semantic success.

A case is `FULL_ROOT_7PLUS1_CLOSED` only if:

1. every source-supported root semantic fact is represented in the correct slot;
2. every slot status is correct;
3. no source-supported required fact is missing or partial;
4. no wrong binding exists;
5. no unsupported RESOLVED fact exists;
6. modality and negation are correct;
7. conditions and quantities bind to the correct target;
8. basis + version identity is complete;
9. OUTPUT_CONTENT stays owned by its output and does not leak into current-task A/B;
10. participant roles are correct;
11. recipients/reviewers are not turned into performers or inputs;
12. exact source/proof lineage exists for every RESOLVED fact.

The only successful terminal outcome for the 50-case corpus is:

```text
ADMIN_SHORT_ROOT_7PLUS1_VALIDATED
```

which requires all 50 cases to close under independent semantic review.

Anything less must be reported honestly.

## 4. Required reading

Read in full:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `fixtures/7plus1/admin-short-050-r02/CASES.md`
4. `docs/reports/7plus1/ADMIN-SHORT-050-r02/REPORT.md`
5. `docs/reports/7plus1/ADMIN-SHORT-050-r02/RESULTS.md`
6. `docs/reports/7plus1/ADMIN-SHORT-050-r02/SEMANTIC-REVIEW.json`
7. sealed `7P-SHORT-016-R2` report and implementation
8. v0.3 normative 7+1 method

Do not modify the 50 source texts.

## 5. Engineering method to test

The intended method is still:

```text
source text
→ discourse / clause structure
→ typed semantic candidates
→ relation / condition / quantity / ownership resolution
→ certified semantic graph
→ Canonical Root 7+1 projection
```

Do not replace the parser with an LLM answer generator.

No Hybrid model proposal lane is authorized.

The work must test whether deterministic semantic compilation can robustly cover this standardized ADMIN-task class.

## 6. Repair by semantic class, not by case

The existing 50-case diagnostic shows recurring classes. Repair them generically.

### Class A — I/O object-role completeness

Must correctly distinguish and recover:

- explicit read/check source objects → I;
- generated deliverables → O;
- recipients/participants/actions must not become I;
- forbidden-only objects must not automatically become I;
- conjunction tokens must not become part of file identity;
- generated report identity must remain exact.

Known examples include missing inputs, missing outputs, ADMIN-as-input, action-as-input, and `inference-health.md 并`.

### Class B — A/P role and modality

Must correctly support:

- performer;
- reviewer;
- recipient;
- coordinator/orchestrator;
- approver when explicitly stated;
- explicit exclusion such as “不负责审批”;
- REQUIRED vs PERMITTED;
- NOT_REQUIRED vs FORBIDDEN;
- quoted/output-content text must not become current execution action.

### Class C — V and R

Must compose:

```text
basis identifier + version
→ one complete V identity
```

Must bind quantities to the correct resource/limit target:

- task time;
- retry count;
- memory cap;
- success-count acceptance;
- classification thresholds must not become resource budgets.

### Class D — C conditions

Must support:

- AND;
- OR;
- conditional completion;
- reviewer-confirmed completion;
- all/every;
- at-least / at-most;
- stop/resume conditions;
- completion must bind to the intended output/state.

### Class E — OUTPUT_CONTENT ownership

Must support report/document content requirements without promoting them to current-task actions.

Examples:

- sections;
- “list added/deleted interfaces”;
- mark items as pending confirmation;
- record discrepancy categories;
- quoted text that must appear in an output.

### Class F — B / scope / negative semantics

Must preserve:

- forbidden actions;
- out-of-scope constraints;
- environment restrictions;
- “do not infer/approve/execute” semantics;
- do not reverse explicit negation;
- do not expand a prohibition to unrelated objects.

## 7. Progressive development gates

Start from uncomplicated, relatively standardized cases.

### G0 — core I/O/A/P/B

Development cases:

```text
ADM-003
ADM-006
ADM-012
ADM-021
ADM-047
```

These must reach 5/5 full root 7+1 closure before continuing.

No case-specific branches.

### G1 — V / R / exact identities

Development cases:

```text
ADM-001
ADM-010
ADM-026
ADM-032
ADM-048
```

G0 must remain 5/5.

G1 requires 5/5 full closure.

### G2 — role / modality / condition polarity

Development cases:

```text
ADM-038
ADM-039
ADM-041
ADM-042
ADM-049
```

G0/G1 must remain closed.

G2 requires 5/5 full closure.

### G3 — OUTPUT_CONTENT / completion / quantity

Development cases:

```text
ADM-011
ADM-029
ADM-043
ADM-045
ADM-046
```

G0–G2 must remain closed.

G3 requires 5/5 full closure.

At this point the candidate is frozen.

## 8. Independent non-case controls before each gate

Before implementing a gate, create and freeze at least 3 independent non-Gold variants for each semantic class being changed.

Examples:

- different filenames;
- different names;
- different word order;
- English/Chinese equivalent;
- negative counterexample;
- optional/permitted variant;
- output-content wording variant.

These controls must not reuse ADM literal names, file names, hashes, or offsets.

All controls must pass before the corresponding ADMIN gate can pass.

## 9. Candidate freeze and 30-case holdout

After G0–G3 pass, freeze the implementation.

Then run the remaining 30 ADMIN cases exactly once as holdout:

```text
ADM-002
ADM-004
ADM-005
ADM-007
ADM-008
ADM-009
ADM-013
ADM-014
ADM-015
ADM-016
ADM-017
ADM-018
ADM-019
ADM-020
ADM-022
ADM-023
ADM-024
ADM-025
ADM-027
ADM-028
ADM-030
ADM-031
ADM-033
ADM-034
ADM-035
ADM-036
ADM-037
ADM-040
ADM-044
ADM-050
```

Do not change parser behavior after seeing holdout results inside this task.

Do not tune on the holdout.

The purpose is to answer whether the method generalized from standardized semantic classes.

## 10. Full 50-case semantic review

After holdout execution, perform a source-by-source semantic review for all 50.

For each case create:

- source;
- canonical-7plus1.json;
- canonical-7plus1.md;
- slot-by-slot semantic review;
- missing;
- partial;
- wrong binding;
- unsupported RESOLVED;
- unresolved correctness;
- exact source evidence.

A case is not PASS because all slots have a syntactically valid status.

## 11. Success thresholds

### Gate success

```text
G0 = 5/5
G1 = 5/5
G2 = 5/5
G3 = 5/5
development total = 20/20
wrong_binding = 0
unsupported_RESOLVED = 0
```

### Method validation

The only `ADMIN_SHORT_ROOT_7PLUS1_VALIDATED` outcome requires:

```text
ALL 50 FULL_ROOT_7PLUS1_CLOSED = 50/50
wrong_binding = 0
unsupported_RESOLVED = 0
repeatability = EXACT
all independent non-Gold controls = PASS
D01–D08 retained = 8/8
REF-001 retained = 43/43
```

If the development 20 pass but holdout does not, terminal outcome must be:

`ADMIN_SHORT_GENERALIZATION_GAP`

If any development gate cannot be closed generically:

`ADMIN_SHORT_CORE_METHOD_GAP`

Do not soften these outcomes.

## 12. Critical anti-overfit rules

Forbidden:

- case ID branches;
- source hash branches;
- literal filename/name branches;
- offset-specific rules;
- expected-answer runtime reads;
- copying actual expected slot values into parser logic;
- changing a source to make it parse;
- changing a semantic review to fit actual output;
- using the holdout results to patch the candidate inside this task.

Search and report anti-overfit evidence.

## 13. Required implementation boundary

Create an isolated candidate, e.g.:

`research/7plus1-parser/v0.3-admin-short-018/`

Production parser entry remains unchanged.

Reuse proven R2 mechanisms where appropriate, but genericize them for ADMIN root tasks.

Do not touch:

- WP/Matrix runtime;
- Hybrid runtime;
- models;
- Packs;
- production entry;
- historical seals.

## 14. Required report package

Create:

`docs/reports/7plus1/7P-ADMIN-SHORT-018/`

At minimum:

- `REPORT.md`
- `BASELINE.json`
- `METHOD-CONTRACT.json`
- `G0-GATE.json`
- `G1-GATE.json`
- `G2-GATE.json`
- `G3-GATE.json`
- `NON-GOLD-CONTROLS.json`
- `CANDIDATE-FREEZE.json`
- `HOLDOUT-RESULTS.json`
- `FULL-50-SEMANTIC-REVIEW.json`
- `FALSE-WRONG-STATUS.json`
- `OUTPUT-CONTENT-AUDIT.json`
- `ROLE-MODALITY-AUDIT.json`
- `QUANTITY-CONDITION-AUDIT.json`
- `BASIS-VERSION-AUDIT.json`
- `SCOPE-NEGATION-AUDIT.json`
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

## 15. Regression

After candidate freeze and full 50 review:

- run focused tests;
- run retained R2 short tests;
- run original Parser regression;
- if and only if semantic gates permit, run full repository regression;
- repeat all 50 using the frozen candidate and compare semantic signatures exactly.

## 16. Allowed terminal outcomes

Exactly one:

- `ADMIN_SHORT_ROOT_7PLUS1_VALIDATED`
- `ADMIN_SHORT_GENERALIZATION_GAP`
- `ADMIN_SHORT_CORE_METHOD_GAP`
- `IMPLEMENTATION_GATE_FAILED`

## 17. Git / publication rules

- work only on `review/7plus1-parser`;
- preserve the 50-case r02 source and diagnostic baseline;
- preserve 016–017 sealed evidence;
- do not merge/release/tag;
- do not switch production;
- stop at `WAITING_ADMIN_REVIEW`.

## 18. Final return

Return:

- TASK
- final commit
- terminal outcome
- G0/G1/G2/G3
- development 20 full closure count
- holdout 30 full closure count
- total 50 full closure count
- wrong binding count
- unsupported RESOLVED count
- unresolved-correct count
- D01–D08 retention
- REF-001 retention
- focused/original/full regression
- repeatability
- anti-overfit
- report path
- no merge/release/tag/production switch
- `STATUS=WAITING_ADMIN_REVIEW`
