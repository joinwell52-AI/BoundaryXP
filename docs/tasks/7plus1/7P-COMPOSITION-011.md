# 7P-COMPOSITION-011 — v0.3 Systemic Ownership / Layer / Composition Repair

## 0. Task identity

- TASK: `7P-COMPOSITION-011`
- START_HEAD: `185474e4433fdccc462c84627d672ba267cebe65`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Previous task: `7P-CONTRACT-010`
- Previous recovery decision: `AUTHORIZE_V0_3_SYSTEMIC_COMPOSITION_REPAIR`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Active comparison contract: `fixtures/7plus1/standard-contract/v0.3-admin-20261002/`
- `PRODUCTION_READY=false`

This is a bounded systemic implementation task.

It is not a phrase-by-phrase repair campaign.

Its purpose is to test whether the remaining failures can be closed by four reusable v0.3 abstractions:

- R1 scoped semantic owner / predicate layer
- R2 qualified artifact/reference identity and role normalization
- R3 explicit transfer / recipient binding
- R4 deterministic whole-frame composition certification

If these abstractions do not produce same-case semantic closure, stop and report that the deterministic-heavy frontend remains insufficient. Do not continue adding local rules indefinitely.

---

## 1. Required reading

Read in full before implementation:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
4. `docs/reports/7plus1/7P-ARCH-009/REPORT.md`
5. `docs/reports/7plus1/7P-ARCH-009/CLUSTER-DEPENDENCY-DAG.json`
6. `docs/reports/7plus1/7P-ARCH-009/GOLD-CONTRACT-AUDIT.json`
7. `docs/reports/7plus1/7P-CONTRACT-010/REPORT.md`
8. `docs/reports/7plus1/7P-CONTRACT-010/ADMIN-ADJUDICATION.json`
9. `docs/reports/7plus1/7P-CONTRACT-010/SCOPE-AWARE-COMPARISON-CONTRACT.md`
10. `docs/reports/7plus1/7P-CONTRACT-010/OFFLINE-REEVALUATION.json`
11. `docs/reports/7plus1/7P-CONTRACT-010/REMAINING-IMPLEMENTATION-GAPS.json`
12. `docs/reports/7plus1/7P-CONTRACT-010/RECOVERY-DECISION.json`
13. all 008 final r03 traces
14. current 008 runtime candidate under `research/7plus1-parser/v0.3-7p-closure-008/`
15. historical sealed tasks/reports 001–010 as needed for compatibility evidence

Do not modify v0.3 or the 010 contract overlay in this task.

---

## 2. Frozen baseline

Treat the following as authoritative:

```text
PARSER_UNCHANGED after 010 = true

root required units = 257
owned-content required units = 25
total required units = 282
missing required units = 203

I_MATCH = 7
O_MATCH = 7
A_MATCH = 9
P_MATCH = 9
R_MATCH = 1
V_MATCH = 12
C_MATCH = 19
B_MATCH = 12

CASE_IOA_JOINT = 0/9
STANDARD_PARSED = 0/9

root false-defined total = 9
root wrong-binding total = 11
slot status mismatches = 72

dominant owner/layer/composition missing = 170/203
confirmed v0.3 representation gap = 0
```

The 010 contract correction did not create any new Parser MATCH.

Therefore this task evaluates actual Parser implementation, not contract bookkeeping.

---

# R1 — Scoped semantic owner / predicate-layer forest

## 3. Objective

Introduce one shared consumed semantic ownership abstraction that all downstream mechanisms use.

The parser currently has many local owner/discourse/frame annotations, but they are not consumed as one global semantic contract.

R1 must build an auditable forest / DAG of semantic ownership such that every candidate predicate/fact has:

- one admissible semantic owner, or typed ambiguity;
- one predicate layer;
- one discourse domain;
- one structural parent path;
- explicit inheritance/override provenance;
- source spans;
- negative ownership evidence where applicable.

The implementation may use existing structure provenance and metadata. It must not create a new v0.3 normative primitive.

---

## 4. Required owner/layer categories

At minimum distinguish:

- CURRENT_TASK_ROOT
- CURRENT_TASK_SUBTASK
- OUTPUT_CONTENT(owner_output)
- ACCEPTANCE
- BACKGROUND
- RATIONALE
- DECISION
- OUT_OF_SCOPE
- CODE
- EXAMPLE
- TABLE
- METADATA

These are implementation-level owner/layer categories over the existing v0.3 Discourse Domain and structure contracts.

They must not silently change v0.3 semantics.

---

## 5. R1 arbitration

Before Eligibility, conflicting candidate ownership must be resolved or remain typed unresolved.

Use deterministic precedence based on evidence:

1. explicit structure ownership
2. explicit output/content ownership
3. explicit current-task/subtask heading ownership
4. explicit acceptance/out-of-scope ownership
5. certified frame ownership
6. local linguistic evidence
7. ambiguous/unresolved

Do not use nearest-text alone.

Do not promote BACKGROUND/CODE/EXAMPLE predicates to current-task actions without independent current-task licensing.

---

## 6. R1 adversarial requirements

Directly test:

- parenthetical explanation must not inherit outer prohibition automatically;
- wrapped narrative line must not become current REQUIRED action merely from verb-like token;
- OUTPUT_CONTENT prohibition must stay owned by output;
- acceptance criterion must not become current execution action unless licensed;
- code block statements remain evidence/content unless explicitly task-owned;
- same surface symbol in different semantic owners remains distinct;
- nested current-task subtask may inherit scope when structure proves it;
- background reference may remain reference evidence without becoming I/V.

R1 PASS requires these negative cases.

---

# R2 — Qualified artifact/reference identity and role normalization

## 7. Objective

Normalize qualified objects before role projection.

R2 must represent:

- file/member pairs;
- module/symbol pairs;
- path/line locator;
- wildcard/collection target;
- before/after same-artifact identity;
- reference/basis identity;
- member sets and qualified scope;
- version/commit/ADR/task references.

A lexical path/identifier alone must not determine I/O/V/B.

Role must follow typed relation + semantic owner + scope.

---

## 8. R2 requirements

At minimum:

- complete protected technical spans remain intact;
- `spec/schemas/*.schema.json` remains one qualified collection, not `/schemas/`;
- file + member identity is preserved across sections;
- reference/basis must bind through explicit relation, not identifier presence;
- line/locator references remain attached to correct artifact;
- member collections preserve cardinality/set expression;
- identical surface identifiers under different owners remain distinct.

---

# R3 — Explicit transfer / recipient constructs

## 9. Objective

Implement recipient/transfer semantics only from explicit evidence.

Support generic patterns such as:

- “给 ADMIN …”
- “send/report to X”
- explicit typed metadata field `to:`
- explicit recipient field in structured task data

Required:

- actor/recipient/source/target distinction;
- exact source naming evidence;
- no nearest-person guess;
- no job-rank inference;
- filename-derived recipient only when a documented filename grammar is the source contract and structure proves that grammar is task-semantic evidence.

Ambiguity remains unresolved.

---

# R4 — Deterministic whole-frame composition certification

## 10. Objective

R4 is the decisive stage.

Local nodes/relations/frames may exist, but a Canonical boundary fact must be emitted only when the whole required semantic frame is certified.

Whole-frame certification must jointly check:

- semantic owner;
- predicate/action identity;
- object/target identity;
- participant roles where applicable;
- modality;
- condition;
- scope/set expression;
- artifact before/after role;
- output-content owner when applicable;
- negative evidence / exclusions;
- provenance completeness.

No one leaf string or one local relation may satisfy a composite expected requirement.

---

## 11. Aggregate semantics

For human expected aggregates such as:

- three writer union-scan repairs;
- three corresponding regression tests;
- multi-file delivery set;
- multi-condition completion;
- multilingual sibling outputs;

certification must prove:

- all required members;
- correct cardinality/operator;
- same intended semantic owner;
- compatible action/object role;
- correct modality/condition;
- complete provenance.

A component may be an internal witness without being a separate top-level Canonical fact.

---

## 12. Negative evidence

R4 must consume negative evidence before Canonical projection.

Examples:

- prohibition attached to parent action must not leak to explanatory child clause;
- OUTPUT_CONTENT prohibition must not become root B;
- narrative/background predicate must be blocked from root A;
- missing owner must prevent certification rather than fall back to nearest owner;
- conflicting owners must yield unresolved.

This is required to contain the false-defined / wrong-binding growth seen in 008.

---

# Non-Gold first development

## 13. Mandatory non-Gold suite before STANDARD tuning

Before using STANDARD semantic results to guide implementation details, create/freeze independent non-Gold construction tests for at least:

1. nested current-task owner inheritance;
2. background paragraph containing action-like verbs;
3. parenthetical explanation inside a prohibition;
4. OUTPUT_CONTENT required action;
5. OUTPUT_CONTENT forbidden action;
6. multilingual output sibling ownership;
7. acceptance criterion vs current action;
8. code block declaration owned by prose;
9. code block unrelated to current task;
10. file + member target;
11. wildcard collection target;
12. basis/reference identifier not I;
13. same identifier under different owners;
14. explicit recipient “给 X”;
15. explicit metadata recipient;
16. ambiguous recipient;
17. aggregate three-member action;
18. distributive EACH over files;
19. condition attached to only one branch;
20. negative control where local tokens look valid but semantic owner is wrong.

Freeze these inputs and expected **mechanism contracts** before STANDARD replay.

Do not copy SWAI literals/function names/paths.

---

# Execution gates

## 14. R1 gate

R1 PASS requires:

- non-Gold owner/layer suite PASS;
- two known false-defined owner errors from 008 are eliminated in frozen/replayed equivalents;
- no regression in retained 001–010 mechanism tests;
- all 9 STANDARD are replayed for diagnostics;
- false-defined / wrong-binding do not increase.

If R1 fails, stop. Do not proceed to R2–R4.

---

## 15. R2 gate

R2 PASS requires:

- non-Gold typed identity suite PASS;
- qualified technical spans/collections preserve full identity;
- no new false-defined/wrong-binding growth;
- retained R1 remains green;
- all 9 STANDARD replayed and compared under the 010 contract.

If R2 fails, stop.

---

## 16. R3 gate

R3 PASS requires:

- explicit recipient non-Gold tests PASS;
- ambiguous recipient remains unresolved;
- no nearest-person fallback;
- retained R1/R2 remain green;
- all 9 STANDARD replayed and compared.

If R3 fails, stop.

---

## 17. R4 gate

R4 PASS requires:

- aggregate/whole-frame non-Gold tests PASS;
- negative evidence tests PASS;
- false-defined and wrong-binding counts improve or remain below 010 baseline;
- at least one same-case I/O/A joint closure is achieved on STANDARD;
- no Gold/runtime hardcoding;
- full regression = 0 FAIL.

If after a completed R1–R4 implementation:

```text
CASE_IOA_JOINT = 0/9
```

then this task must terminate as:

`SYSTEMIC_REPAIR_INSUFFICIENT`

and recommend a controlled Hybrid semantic-proposal experiment.

Do not continue with phrase patches.

---

# Final semantic targets

## 18. Minimum success target

This task is a recovery-validation task, not final Parser certification.

Minimum semantic success:

```text
CASE_IOA_JOINT >= 1/9
STANDARD_PARSED >= 1/9 OR
clear downstream movement with one full 7+1 case blocked only by separately documented non-I/O/A contract issue
```

Also require:

- root false-defined < 9
- root wrong-binding < 11
- no new unreviewed top-level extras
- owned-content missing reduced from 22
- slot status mismatches reduced from 72

The target is intentionally case-level, not only item-count growth.

---

## 19. Strong success target

Strong success is:

- multiple STANDARD cases gain same-case I/O/A joint closure;
- at least one full STANDARD case closes;
- systemic owner/layer/composition errors disappear across unrelated cases;
- no semantic floor regression;
- no severe uncontrolled performance regression.

If strong success is achieved, recommend a follow-on full closure/certification task.

---

# Performance

## 20. Performance gate

008 showed ~42% historical latency growth.

For 011:

- measure controlled same-input replay latency before/after on the same machine/process settings;
- report median and total;
- separate NLP/model time from deterministic compiler time where possible;
- do not hide increased cost behind more tests;
- if deterministic compiler time grows >25% without proportional semantic closure, mark performance concern.

Performance concern alone does not invalidate semantic correctness, but must block production adoption.

---

# Anti-overfit

## 21. Prohibited runtime dependencies

Runtime semantic logic must not contain:

- SWAI ids;
- source hashes as behavior switches;
- Gold expected text;
- sample offsets;
- sample-specific file/function/path names;
- comparator state;
- test-only shortcuts.

Run static scan and targeted review.

---

# Required report package

## 22. Artifacts

Create:

`docs/reports/7plus1/7P-COMPOSITION-011/`

At minimum:

- `REPORT.md`
- `BASELINE.json`
- `R1-OWNER-LAYER-AUDIT.json`
- `R2-IDENTITY-ROLE-AUDIT.json`
- `R3-RECIPIENT-AUDIT.json`
- `R4-COMPOSITION-CERTIFICATION-AUDIT.json`
- `NON-GOLD-FROZEN-INPUTS.json`
- `NON-GOLD-RESULTS.json`
- `CASE-IOA-JOINT-BEFORE-AFTER.json`
- `FULL-CASE-BEFORE-AFTER.json`
- `OWNED-CONTENT-BEFORE-AFTER.json`
- `FALSE-WRONG-STATUS-BEFORE-AFTER.json`
- `PERFORMANCE.json`
- `ANTI-OVERFIT-AUDIT.json`
- `RETAINED-COMPATIBILITY.json`
- `FULL-REGRESSION.json`
- `FINAL-OUTCOME.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `CHANGED-FILES.txt`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

Preserve first-run failures and intermediate gate failures.

---

# Terminal outcomes

## 23. Allowed final outcomes

Exactly one:

### `SYSTEMIC_REPAIR_VALIDATED`

Use when R1–R4 pass and the minimum case-level semantic target is met.

### `SYSTEMIC_REPAIR_INSUFFICIENT`

Use when R1–R4 are implemented/validated on non-Gold but STANDARD still has `CASE_IOA_JOINT=0/9`, or systemic errors remain broadly unchanged.

Next recommendation should be a controlled Hybrid proposal experiment, not more local repair.

### `IMPLEMENTATION_GATE_FAILED`

Use when one of R1–R4 cannot be implemented without violating v0.3 or regressing retained gates.

### `V0_3_METHOD_LIMITATION_CONFIRMED`

Use only with a concrete representability counterexample. Do not modify v0.3.

---

## 24. Git / production rules

- work only on `review/7plus1-parser`;
- start from latest descendant of `185474e4433fdccc462c84627d672ba267cebe65`;
- do not merge;
- do not release;
- do not tag;
- do not switch production entry;
- do not modify historical Gold/Source;
- do not modify 010 contract overlay;
- do not modify v0.3;
- stop at `WAITING_ADMIN_REVIEW`.

---

## 25. Final return format

Return:

- TASK
- final commit
- terminal outcome
- R1/R2/R3/R4 gate states
- focused/non-Gold/retained/full-regression counts
- CASE_IOA_JOINT before → after
- STANDARD_PARSED before → after
- full-case count before → after
- root false-defined before → after
- root wrong-binding before → after
- slot status mismatch before → after
- owned-content missing before → after
- controlled performance delta
- anti-overfit result
- Gold/Source/v0.3/010-overlay unchanged confirmation
- no merge/release/tag/production switch
- report path
- `STATUS=WAITING_ADMIN_REVIEW`
