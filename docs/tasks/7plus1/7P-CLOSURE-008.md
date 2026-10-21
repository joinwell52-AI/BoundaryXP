# 7P-CLOSURE-008 — BoundX 7+1 Parser v0.3 Semantic Closure & Certification

## 0. Task identity

- TASK: `7P-CLOSURE-008`
- START_HEAD: `e8d06c113ac8472bafefccab7d4349ff9b711e2a`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Completion plan: `docs/tasks/7plus1/7P-v0.3-COMPLETION-PLAN.md`
- Previous task: `7P-REPAIR-007`
- Previous result: `SEMANTIC_GATE_NOT_MET`, diagnostic implementation retained
- `PRODUCTION_READY=false`

This is the planned **long closure task** for the v0.3 parser campaign.

It replaces an open-ended sequence of REPAIR-008 / 009 / 010 tasks.

The task has internal phases and gates. Continue automatically from one phase to the next only when the current phase gate is satisfied. If a hard stop condition is reached, seal truthful evidence and stop for ADMIN Review.

Do **not** modify the v0.3 normative method in this task.

---

## 1. Required reading

Read in full before implementation:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-v0.3-COMPLETION-PLAN.md`
4. `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
5. `docs/reports/7plus1/7P-REPAIR-007/REPORT.md`
6. `docs/reports/7plus1/7P-REPAIR-007/FIRST-DIVERGENCE.json`
7. `docs/reports/7plus1/7P-REPAIR-007/CASE-IOA-JOINT-BASELINE.json`
8. `docs/reports/7plus1/7P-REPAIR-007/CASE-IOA-JOINT-AFTER.json`
9. `docs/reports/7plus1/7P-REPAIR-007/CASE-IOA-JOINT-DIFF.json`
10. `docs/reports/7plus1/7P-REPAIR-007/COMPARISON.json`
11. `docs/reports/7plus1/7P-REPAIR-007/SLOT-SUMMARY.json`
12. `docs/reports/7plus1/7P-REPAIR-007/CROSS-INSTRUCTION-IDENTITY-AUDIT.json`
13. `docs/reports/7plus1/7P-REPAIR-007/CALL-DECLARATION-BINDING-AUDIT.json`
14. `docs/reports/7plus1/7P-REPAIR-007/MEMBER-BEHAVIOR-COMPOSITION-AUDIT.json`
15. all 007 replay traces for REF-001 and the 9 STANDARD cases
16. current 007 runtime under `research/7plus1-parser/v0.3-7p-repair-007/`

Do not rewrite or “fix” any sealed 001–007 evidence.

---

## 2. ADMIN review of 007 and inherited baseline

007 is **not semantically accepted**, because its required same-case I/O/A joint gate did not move.

However, its implementation is retained as the starting diagnostic candidate because it:

- passed dedicated/compatibility tests;
- passed original Parser regression;
- passed full regression with zero failures;
- closed the explicitly authorized cross-instruction identity mechanisms;
- moved the first divergence downstream;
- preserved Gold, v0.3, QI–QB, production entry and prior seals.

Inherited 007 baseline:

```text
focused + compatibility = 385/385
original parser regression = 739/739
full regression = 5343 PASS / 0 FAIL / 17 SKIPPED

I_MATCH = 8
O_MATCH = 6
A_MATCH = 7

CASE_IOA_JOINT = 0/9
STANDARD_PARSED = 0/9

REF001 = PASS
MANIFEST = PASS
SHA256SUMS = PASS
SEAL = PASS
```

The 9-case I/O/A joint ledger is now an authoritative diagnostic surface. Do not replace it with corpus item totals.

---

## 3. Confirmed first divergence entering 008

007 certified:

- three aggregate member identities;
- three member continuity chains;
- three call-site → declaration identity chains;
- three member behavior composition records.

The current first divergence moved to:

```text
DECLARED_BEHAVIOR_SEMANTICS_AND_ARGUMENT_INSTANTIATION
```

Current evidence establishes the call and declaration identity, but does not yet establish enough semantics to prove:

```text
declared helper behavior
+
formal parameters
+
call-site actual arguments
→ instantiated behavior for the concrete target member
```

In SWAI-001 this prevents the already-certified call from becoming a complete proof of the required union-scan behavior.

Important v0.3 constraint:

- `CODE` is evidence/context by default, not automatically current-task A/P/B;
- code must not be executed to infer task truth;
- any static interpretation must remain evidence-backed, bounded, auditable and compatible with the existing finite relation / expression contracts;
- if satisfying the expected semantics requires adding a new normative method primitive, relation family, state, or projection rule not licensed by v0.3, classify it as a **method limitation**, do not silently extend v0.3.

---

# PHASE A — Remaining Gap Map

## 4. Objective

Before any new parser modification, build a complete remaining-gap map for all 9 STANDARD cases and all 7+1 dimensions.

This phase is diagnostic only.

**No parser implementation changes are allowed before Phase A is sealed.**

For every STANDARD case:

- trace source → structure → discourse → spans → semantic nodes → candidate relations → closure/certification/identity → Eligibility → Boundary IR → Canonical 7+1;
- compare all required `I/O/A/P/R/V/C/B`, OUTPUT_CONTENT, status, scope and binding semantics;
- identify the earliest causal divergence for every incomplete required semantic unit;
- group divergences by root mechanism rather than sample id.

---

## 5. Required gap taxonomy

At minimum classify remaining gaps into these buckets when applicable:

- `STRUCTURE_OR_DISCOURSE`
- `SPAN_OR_TYPED_LITERAL`
- `CANDIDATE_RECALL`
- `RELATION_OR_EDGE_CLOSURE`
- `FRAME_CERTIFICATION`
- `CROSS_INSTRUCTION_IDENTITY`
- `DECLARED_BEHAVIOR_SEMANTICS`
- `FORMAL_ACTUAL_ARGUMENT_BINDING`
- `ARTIFACT_ROLE`
- `INPUT_OUTPUT_BINDING`
- `ACTION_COMPOSITION`
- `CONDITION_OR_MODALITY`
- `OUTPUT_CONTENT_OWNERSHIP`
- `REFERENCE_OR_BASIS`
- `PARTICIPANT`
- `QUANTITY_OR_SCOPE_EXPRESSION`
- `ELIGIBILITY`
- `PROJECTION_OR_NORMALIZATION`
- `EXPECTED_TYPED_UNRESOLVED`
- `METHOD_LIMITATION_CANDIDATE`
- `OTHER_WITH_EXPLICIT_DEFINITION`

Do not force a gap into a bucket if the evidence does not support it.

---

## 6. Root-cause clusters

Produce a finite cluster list.

Each cluster must contain:

- cluster id;
- compiler stage;
- affected STANDARD cases;
- affected required semantic entries;
- earliest divergence;
- current actual representation;
- expected semantic representation;
- why the difference is causal rather than downstream;
- v0.3 clauses that authorize the intended repair;
- whether the gap is:
  - `IMPLEMENTATION_GAP`
  - `METHOD_LIMITATION_CANDIDATE`
  - `INSUFFICIENT_SOURCE_EVIDENCE`

A cluster must not be defined as “fix SWAI-00x”.

---

## 7. Required Phase A artifacts

Create under:

`docs/reports/7plus1/7P-CLOSURE-008/phase-a/`

At minimum:

- `REMAINING-GAP-MAP.json`
- `REMAINING-GAP-MAP.md`
- `ROOT-CAUSE-CLUSTERS.json`
- `CASE-FULL-7PLUS1-BASELINE.json`
- `CASE-IOA-JOINT-BASELINE.json`
- `STAGE-FIRST-DIVERGENCES.json`
- `METHOD-COVERAGE-DECISIONS.json`
- `PHASE-A-GATE.json`

### Phase A gate

PASS only when:

- all 9 cases are represented;
- every incomplete required semantic entry has a recorded blocker;
- clusters cover all recorded blockers;
- each planned implementation cluster is justified by frozen v0.3 semantics;
- 007 current divergence is explicitly classified.

If the current divergence or another required closure can only be solved by changing v0.3 normative semantics, do not implement that method change. Record the limitation and continue only with independent implementation-gap clusters that do not depend on it.

---

# PHASE B — Multi-Case Semantic Closure

## 8. Objective

Repair **root-cause clusters**, not cases.

Work in compiler dependency order from earliest stage to latest stage.

After each cluster repair:

1. rerun all 9 STANDARD cases;
2. rerun retained 001–007 mechanism tests;
3. run new independent non-Gold tests for that mechanism;
4. update the gap map;
5. prove which gaps moved downstream, closed, or regressed.

Do not create one-off logic for a sample.

---

## 9. First authorized investigation: declared behavior + argument instantiation

The first 008 cluster to investigate is the confirmed 007 divergence:

`DECLARED_BEHAVIOR_SEMANTICS_AND_ARGUMENT_INSTANTIATION`.

The implementation may add a generic static evidence pass **only if Phase A confirms it is licensed by v0.3**.

Permitted design space:

- recover declaration symbol and formal parameter structure from owned code/declaration evidence;
- recover explicit call-site actual argument structure from certified call frames;
- construct deterministic formal → actual binding when arity/parameter form and ownership are unambiguous;
- propagate already-supported relation/scope semantics through the binding;
- use bounded static structural evidence from owned code, comments/docstrings or explicit syntax;
- preserve CODE as evidence/context rather than promoting arbitrary code statements to current-task actions;
- keep ambiguity typed unresolved.

Forbidden:

- executing task code;
- importing the target project to discover runtime behavior;
- running the declared helper to infer semantics;
- using Gold expected text to interpret code;
- Python-specific hardcoding aimed at SWAI-001 literals;
- inventing a new normative relation type merely to satisfy the sample;
- treating a function name as proof of behavior;
- interpreting arbitrary Turing-complete code as if a full program verifier existed.

If the required helper semantics cannot be established with bounded static evidence and existing v0.3 relations/expressions, record `METHOD_LIMITATION_CANDIDATE` or `INSUFFICIENT_SOURCE_EVIDENCE` as appropriate.

---

## 10. Generic formal → actual binding requirements

Where uniquely supported:

- declaration formal parameters remain stable semantic identities;
- variadic parameters preserve multiplicity and set/sequence semantics;
- call-site actual arguments bind positionally/named as explicitly supported;
- path expressions remain structured expressions, not flattened strings;
- substitution preserves source spans from both declaration and call;
- one declaration may instantiate multiple independent call behaviors without collapsing their target ownership;
- competing declarations or incompatible arity remain unresolved;
- the instantiated behavior remains attached to the correct current-task target/member.

No sample identifiers, function names, directory names or expected slot values may appear in runtime logic.

---

## 11. Other Phase B clusters

After the first authorized cluster, process the remaining Phase A implementation clusters in dependency order.

Examples may include:

- collection / set member reconstruction;
- typed path or wildcard scope;
- action content composition;
- test/output deliverable ownership;
- condition/modality attachment;
- OUTPUT_CONTENT subgraph ownership;
- basis/reference attachment;
- artifact before/after identity;
- eligibility/projection defects.

These examples are not automatic authorization to change semantics. Every implemented cluster must cite its v0.3 basis from Phase A.

---

## 12. Phase B progress metric

Global item-count increase alone is insufficient.

Phase B must improve at least one **case-level** semantic completeness measure without regressing earlier certified mechanisms.

Track after every cluster:

```text
I/O/A corpus item counts
CASE_IOA_JOINT
FULL_7PLUS1_CASE_COMPLETE
STANDARD_PARSED
```

A cluster is successful when its own affected requirements improve or correctly convert to typed unresolved under the method, with no unjustified regression.

---

## 13. Phase B non-regression floor

Unless Phase A proves a prior 007 MATCH was actually semantically invalid, preserve at minimum:

```text
REF001 = PASS

I_MATCH >= 8
O_MATCH >= 6
A_MATCH >= 7

P_MATCH >= 9
R_MATCH >= 1
V_MATCH >= 12
C_MATCH >= 19
B_MATCH >= 14

I_FALSE_DEFINED <= 3
O_FALSE_DEFINED <= 1
A_FALSE_DEFINED <= 2
P_FALSE_DEFINED = 0
P_WRONG_BINDING = 0
R_FALSE_DEFINED = 0
R_MISSING = 0
B_WRONG_BINDING <= 6
A_WRONG_BINDING <= 2
```

Also required:

- retained 004 Edge Closure tests green;
- retained 005 Candidate Recall tests green;
- retained 006 Frame Certification tests green;
- retained 007 Cross-Instruction Identity tests green;
- original Parser regression green;
- full regression zero failures;
- Gold/Source/BXP/v0.3/Pack/model/threshold unchanged.

If a prior MATCH is proven wrong, do not silently preserve it for score reasons. Downgrade it truthfully, document the correction, and treat this as a semantic accounting correction rather than hiding the regression.

---

## 14. Required Phase B artifacts

Under:

`docs/reports/7plus1/7P-CLOSURE-008/phase-b/`

At minimum:

- `CLUSTER-EXECUTION-ORDER.json`
- one audit file per implemented root cluster;
- `DECLARED-BEHAVIOR-AUDIT.json`
- `FORMAL-ACTUAL-BINDING-AUDIT.json`
- `CASE-IOA-JOINT-AFTER.json`
- `CASE-FULL-7PLUS1-AFTER.json`
- `ROOT-CAUSE-CLUSTERS-AFTER.json`
- `NON-GOLD-MECHANISM-RESULTS.json`
- `COMPATIBILITY-001-007.json`
- `PHASE-B-GATE.json`

### Phase B gate

PASS when:

- every `IMPLEMENTATION_GAP` cluster from Phase A has either:
  - been repaired and verified, or
  - been reclassified with explicit new evidence;
- no Gold/sample hardcoding exists;
- no new normative method primitive was silently introduced;
- full regression has zero failures;
- case-level semantic completeness has materially moved downstream from the 007 baseline.

If all remaining blockers are method limitations or insufficient source evidence, Phase B may end without forcing further parser changes.

---

# PHASE C — Full 7+1 Case Closure

## 15. Objective

Stop optimizing only I/O/A.

Evaluate complete per-case semantics:

```text
I
O
A
P
R
V
C
+
B
+
OUTPUT_CONTENT
+
slot state
+
scope/binding
+
artifact identity
+
proof/provenance
```

For each STANDARD case, determine whether the correct v0.3 outcome is:

- `RESOLVED`
- `ABSENT`
- typed `UNRESOLVED`
- `PARSER_COVERAGE_FAILURE`

`PARSER_COVERAGE_FAILURE` is not an acceptable final state when v0.3 contains enough method semantics and the source contains enough evidence.

---

## 16. Full-case acceptance ledger

Create a full-case ledger for all 9 STANDARD cases.

Each required semantic entry must show:

- expected canonical semantics;
- actual canonical semantics;
- slot state;
- relation/binding proof;
- source span;
- scope;
- match decision;
- blocker if incomplete.

A case is `STANDARD_PARSED=true` only when the complete accepted canonical 7+1 semantics match the human standard under the frozen comparator contract.

Do not redefine the comparator merely to increase the count.

---

## 17. Phase C target

For a final status of `V0.3_PARSER_CERTIFIED`, all 9 accepted STANDARD cases must be semantically accounted for.

Therefore certification requires:

```text
STANDARD_PARSED = 9/9
```

unless Phase A/C proves that an accepted STANDARD expectation itself requires semantics outside frozen v0.3. In that event, do **not** mutate Gold. The terminal outcome becomes `V0.3_METHOD_LIMITATION_CONFIRMED`.

There is no “close enough” certification state.

---

## 18. Required Phase C artifacts

Under:

`docs/reports/7plus1/7P-CLOSURE-008/phase-c/`

At minimum:

- `FULL-7PLUS1-LEDGER.json`
- `FULL-7PLUS1-LEDGER.md`
- `STANDARD-PARSED.json`
- `TYPED-UNRESOLVED-AUDIT.json`
- `PARSER-COVERAGE-FAILURE-AUDIT.json`
- `OUTPUT-CONTENT-AUDIT.json`
- `SCOPE-BINDING-AUDIT.json`
- `PROOF-PROVENANCE-AUDIT.json`
- `PHASE-C-GATE.json`

### Phase C gate

One of:

1. all 9 cases fully close under v0.3 → continue to Phase D;
2. implementation gaps remain → record `IMPLEMENTATION_GAP_REMAINS` and stop;
3. method limitation is confirmed → record `V0.3_METHOD_LIMITATION_CONFIRMED` and stop.

Do not continue into final certification with unresolved implementation gaps.

---

# PHASE D — Generalization, Anti-Overfit & Final Certification

## 19. Objective

Prove that full STANDARD closure is a property of the parser mechanism, not memorization of the 9 cases.

Phase D begins only after Phase C reaches full v0.3 case closure.

---

## 20. Generalization corpus

Use:

1. all previously retained independent non-Gold mechanism cases from 004–007;
2. a new frozen generalization set created **before** looking at final outputs.

The new set must include at least:

- Chinese task prose;
- English task prose;
- paraphrases of known semantic mechanisms using unrelated entities;
- reordered sibling instructions;
- nested numbered/bulleted lists;
- long multi-section tasks;
- multi-level scope;
- tables;
- code blocks;
- OUTPUT_CONTENT instructions;
- same symbol name in different scopes;
- ambiguous coreference;
- missing information;
- conflicting instructions;
- true typed-unresolved cases;
- unrelated negative controls.

Do not copy Gold/SWAI literals into the new generalization cases.

Freeze the inputs and expected mechanism-level contracts before final execution.

---

## 21. Anti-overfit source audit

Scan runtime/parser source for prohibited dependence on:

- `SWAI-`;
- Gold entry ids;
- Gold expected strings;
- STANDARD source hashes used as behavior switches;
- sample-specific offsets;
- sample-specific function names;
- sample-specific directory/path names;
- case-specific regexes;
- test-only shortcuts;
- comparator bypasses;
- direct raw-text → Canonical 7+1 lookup tables.

Any such behavior causes Phase D FAIL.

Diagnostic/report tooling may refer to sample ids; runtime semantic logic may not.

---

## 22. Determinism and repeatability

Required:

- same saved NLP/model signals → byte-stable semantic graph / Boundary IR / Canonical output where the representation contract is deterministic;
- repeated real NLP/model execution on a representative cross-section, with semantic equivalence checked despite irrelevant model/runtime metadata;
- all 9 STANDARD cases repeated at least once after final freeze;
- representative ambiguous cases repeat to the same typed unresolved outcome.

Do not call saved-signal replay an independent model run.

---

## 23. Full regression and performance

Run:

- focused closure tests;
- retained 001–007 tests;
- original Parser regression;
- all repository tests;
- Gold integrity checks;
- generalization suite;
- anti-overfit audit;
- determinism suite;
- performance measurement.

Required:

- zero failures in required test suites;
- skipped tests reported separately;
- first-run anomalies preserved;
- no unexplained severe performance regression; report measured deltas rather than hiding them.

---

## 24. Final terminal outcomes

The final report must end in exactly one of:

### `V0.3_PARSER_CERTIFIED`

Allowed only when:

- Phase A PASS;
- all implementation gaps closed;
- `STANDARD_PARSED=9/9`;
- full 7+1 ledger accepted;
- generalization suite PASS;
- anti-overfit audit PASS;
- determinism/repeatability PASS;
- full regression zero failures;
- Gold/Source/BXP/v0.3 unchanged;
- Manifest / SHA256SUMS / SEAL PASS.

### `IMPLEMENTATION_GAP_REMAINS`

Use when frozen v0.3 and source evidence are sufficient, but one or more parser mechanisms remain incorrectly implemented.

Do not create another REPAIR task automatically. Seal the exact remaining clusters and stop for ADMIN.

### `V0.3_METHOD_LIMITATION_CONFIRMED`

Use when faithful completion would require changing frozen v0.3 normative semantics or adding a semantic capability the method does not define.

Do not modify v0.3 in this task.

Seal:

- exact limiting examples;
- why source evidence is sufficient;
- why existing v0.3 types/relations/expressions cannot represent or deterministically resolve them;
- minimal candidate requirements for a future v0.4 method discussion.

Then stop for ADMIN.

---

## 25. Main report package

Create:

`docs/reports/7plus1/7P-CLOSURE-008/`

At minimum:

- `REPORT.md`
- `BASELINE.json`
- `BEFORE-AFTER.json`
- `FINAL-OUTCOME.json`
- `FAILURES.json`
- `FIRST-DIVERGENCE.json`
- `CHANGED-FILES.txt`
- `IMPLEMENTATION-FROZEN.json`
- `TESTS.json`
- `RUNS.json`
- `PERFORMANCE.json`
- `GENERALIZATION.json`
- `ANTI-OVERFIT-AUDIT.json`
- `DETERMINISM.json`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

plus all required phase directories and artifacts.

Do not overwrite 001–007 report packages.

---

## 26. Execution and Git rules

- work only on `review/7plus1-parser`;
- start from latest branch HEAD, descendant of `e8d06c113ac8472bafefccab7d4349ff9b711e2a`;
- multiple internal commits are allowed for the long task;
- each phase must preserve its own evidence before proceeding;
- do not merge;
- do not release;
- do not tag;
- do not switch production runtime;
- do not modify v0.3 method;
- do not modify Gold/Source/BXP;
- do not weaken semantic acceptance to manufacture progress;
- push implementation and evidence to `review/7plus1-parser`;
- stop only at a defined terminal/hard-stop state.

---

## 27. Final return format

Return:

- TASK;
- start/final commit;
- terminal outcome;
- phase A/B/C/D gate states;
- focused/compatibility/original-parser/full-regression results;
- I/O/A item counts before → after;
- CASE_IOA_JOINT before → after;
- STANDARD_PARSED before → after;
- full 7+1 case count;
- remaining root-cause clusters, if any;
- method limitation statement, if any;
- generalization result;
- anti-overfit result;
- determinism result;
- performance summary;
- Manifest / SHA256SUMS / SEAL;
- confirmation of no merge/release/tag/production switch;
- report path;
- `STATUS=WAITING_ADMIN_REVIEW`.
