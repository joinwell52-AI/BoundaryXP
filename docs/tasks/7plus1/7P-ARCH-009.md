# 7P-ARCH-009 — BoundaryXP 7+1 Parser Architecture Review & Recovery Decision

## 0. Task identity

- TASK: `7P-ARCH-009`
- START_HEAD: `68d28da5c2f5db614867d1fa4ad8d0d3fb3ec53b`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Previous task: `7P-CLOSURE-008`
- Previous outcome: `IMPLEMENTATION_GAP_REMAINS`
- `PRODUCTION_READY=false`

This is a **diagnostic architecture decision task**.

It is not another parser repair task.

Do not modify parser runtime, Gold, Source, BXP, v0.3, model thresholds, QI–QB, production entry, or previous sealed evidence.

The purpose is to decide whether the remaining work should continue as v0.3 implementation repair, move to a model-assisted candidate-generation architecture, or require a v0.4 method revision.

---

## 1. Required reading

Read in full before analysis:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/tasks/7plus1/7P-v0.3-COMPLETION-PLAN.md`
4. `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
5. all taskbooks 001–008
6. all final reports 001–008
7. `docs/reports/7plus1/7P-CLOSURE-008/FINAL-OUTCOME.json`
8. `docs/reports/7plus1/7P-CLOSURE-008/PHASE-A/...` / `phase-a/` gap-map artifacts
9. `docs/reports/7plus1/7P-CLOSURE-008/phase-b/PHASE-B-GATE.json`
10. `docs/reports/7plus1/7P-CLOSURE-008/phase-c/PHASE-C-GATE.json`
11. `docs/reports/7plus1/7P-CLOSURE-008/FIRST-DIVERGENCE.json`
12. `docs/reports/7plus1/7P-CLOSURE-008/BEFORE-AFTER.json`
13. C02–C12 audit files
14. `FAILURES.json`
15. `PERFORMANCE.json`
16. `DETERMINISM.json`
17. final r03 traces for REF-001 and all 9 STANDARD cases

---

## 2. Accepted facts entering this review

Treat the following as fixed evidence, not assumptions:

```text
7P-CLOSURE-008 terminal outcome = IMPLEMENTATION_GAP_REMAINS

Phase A = PASS
Phase B = FAIL
Phase C = read-only assessment FAIL
Phase D = NOT RUN

focused tests = 518 PASS
original parser = 739 PASS
full regression = 5861 PASS / 0 FAIL / 17 SKIP

I_MATCH: 8 -> 7
O_MATCH: 6 -> 7
A_MATCH: 7 -> 9

CASE_IOA_JOINT: 0/9 -> 0/9
STANDARD_PARSED: 0/9 -> 0/9

remaining implementation clusters = C02..C12
method limitation confirmed = false
saved-signal determinism = PASS
independent post-freeze model repeat = NOT RUN
runtime anti-overfit scan = 0 listed forbidden hits
measured latency increase ≈ 42%
```

Also retain the semantic floor failures:

- I_MATCH fell below the accepted floor;
- B_MATCH fell below the accepted floor;
- A_FALSE_DEFINED increased materially;
- B_WRONG_BINDING increased materially.

Green mechanism/regression tests do not override these semantic failures.

---

## 3. Core question

The task must answer:

> Why has the parser accumulated many locally passing mechanisms while still producing 0/9 same-case joint closure and 0/9 full STANDARD closure?

Do not answer this with one more first-divergence patch.

Determine whether the dominant problem is:

1. still a finite set of independent implementation defects;
2. systemic composition failure in the current deterministic-heavy frontend;
3. insufficient candidate semantic recall/understanding before deterministic certification;
4. mismatch between current v0.3 representation and the semantic structures required by the accepted STANDARD set;
5. mismatch or overreach in the Gold/acceptance contract;
6. a combination of the above.

---

## 4. Required architecture decomposition

Reconstruct the effective current pipeline from actual code and traces:

```text
source
→ structure/discourse
→ span lattice / typed literals
→ candidate nodes
→ candidate relations
→ edge closure
→ frame certification
→ cross-instruction identity
→ declared behavior / owned content interpretation
→ eligibility
→ Boundary IR
→ QI...QB
→ Canonical 7+1
→ comparison
```

For each stage record:

- inputs;
- outputs;
- deterministic/probabilistic nature;
- evidence source;
- error amplification behavior;
- whether later stages can recover earlier omissions;
- current C02–C12 dependencies;
- number of STANDARD blockers attributable to the stage;
- observed false-positive risk.

Produce a dependency DAG between remaining clusters.

---

## 5. Coupling analysis

Determine whether C02–C12 are actually independent.

At minimum answer:

- which clusters are upstream causes versus downstream symptoms;
- which clusters repeatedly touch the same semantic ownership/composition problem;
- whether C12 is only downstream accountability and should not be considered an independent repair target;
- whether C02/C04/C05/C06/C07/C08/C11 share one missing semantic composition abstraction;
- whether C03/C09/C10 are separable typed identity/reference defects;
- whether current incremental repairs create new false-defined/wrong-binding entries because local rules lack a global semantic owner/tree.

Use trace evidence, not naming similarity.

---

## 6. STANDARD topology analysis

For each of the 9 STANDARD cases, compute:

- document length / structural depth;
- number of task sections;
- number of cross-section references;
- number of explicit code/table/output-content regions;
- number of required semantic entries;
- number of cross-scope bindings;
- number of composite set/condition expressions;
- number of dependencies on implicit semantic ownership.

Classify cases by complexity.

Determine whether the current parser succeeds mainly on local/atomic semantics but fails when composition depth rises.

---

## 7. Gold / acceptance-contract audit

Without changing Gold, independently review whether each expected requirement is:

- explicitly supported by source;
- derivable under frozen v0.3;
- only derivable by code execution or external repository inspection;
- dependent on an implicit domain convention not represented in v0.3;
- overly aggregated relative to Canonical entry semantics;
- appropriately comparable to current IR granularity.

For every questionable item, classify:

- `GOLD_OK_V0_3_REPRESENTABLE`
- `GOLD_OK_BUT_REQUIRES_STRONGER_FRONTEND`
- `METHOD_REPRESENTATION_GAP`
- `INSUFFICIENT_SOURCE_EVIDENCE`
- `COMPARATOR_GRANULARITY_ISSUE`

Do not modify expected values.

---

## 8. Compare three architecture options

Evaluate these three options against the same evidence.

### Option A — Continue current deterministic-heavy v0.3 implementation

Architecture:

```text
NLP + typed rules
→ deterministic candidate graph
→ deterministic closure/certification
→ Canonical 7+1
```

Assess:

- remaining work estimate by root abstraction, not by case;
- expected ability to close C02–C12;
- false-positive risk;
- maintenance complexity;
- performance impact;
- likelihood of continued rule proliferation;
- whether global composition can be added without changing v0.3.

### Option B — Model-assisted semantic candidate generation + deterministic certification

Architecture:

```text
Natural language
→ LLM/NLP/model-assisted semantic proposal
→ typed Candidate Graph
→ deterministic type/scope/relation/consistency checks
→ Eligibility
→ Canonical 7+1
→ Boundary Certification
```

Constraints:

- model output is never boundary truth;
- model may propose nodes, relations, owners, scope trees and candidate expressions;
- every accepted fact still requires deterministic evidence/provenance;
- ambiguity remains typed unresolved;
- no direct LLM → final 7+1 bypass.

Assess whether this would reduce C02–C12 without weakening BoundaryXP's deterministic boundary-certification principle.

### Option C — v0.4 method revision with explicit hierarchical semantic ownership

Evaluate whether the evidence requires a method-level representation such as:

- explicit Scope Tree / Task Tree;
- semantic owner nodes;
- behavior composition tree;
- parent/child obligation graph;
- declaration/call/test behavior subtrees;
- scope inheritance and override;
- cross-section reference edges.

Do not design v0.4 implementation in this task; only determine whether v0.3 lacks a normative abstraction needed to represent the observed semantics cleanly.

---

## 9. Controlled counterfactual analysis

No production parser changes are allowed.

However, diagnostic scripts may operate on frozen traces to answer counterfactual questions, for example:

- If a correct semantic owner were supplied, how many downstream blockers disappear?
- If missing candidate relations were supplied, can current Eligibility/Q projection represent the expected result without changes?
- If a model proposed the missing owner/relation candidates, would current deterministic constraints accept or reject them?
- If a Scope Tree were available, which C02–C12 defects collapse into one ownership/composition problem?

All injected facts must be clearly marked `DIAGNOSTIC_COUNTERFACTUAL` and must never be written into Gold, runtime, or final canonical results.

---

## 10. Decision criteria

The final architecture decision must be based on evidence.

### Choose `CONTINUE_V0_3_IMPLEMENTATION` only if:

- remaining clusters reduce to a small number of clearly separable implementation abstractions;
- current v0.3 can represent all accepted STANDARD semantics;
- counterfactual injection shows current downstream deterministic pipeline closes correctly;
- false-defined/wrong-binding growth is explainable and containable;
- no new normative abstraction is required.

### Choose `HYBRID_FRONTEND_REQUIRED` only if:

- v0.3 representation is sufficient;
- deterministic certification remains suitable;
- the dominant failure is upstream semantic candidate/owner/relation discovery;
- model-assisted proposals measurably collapse multiple remaining clusters without bypassing deterministic gates.

### Choose `V0_4_METHOD_REQUIRED` only if:

- one or more accepted semantics cannot be represented cleanly or deterministically under frozen v0.3;
- missing abstraction is structural/normative, not merely an implementation omission.

### Choose `GOLD_CONTRACT_REVIEW_REQUIRED` only if:

- expected entries require information not available from source under the declared task contract;
- or comparator granularity fundamentally mismatches Canonical semantics.

Multiple flags may be true, but one primary next-development path must be selected.

---

## 11. Required artifacts

Create:

`docs/reports/7plus1/7P-ARCH-009/`

At minimum:

- `REPORT.md`
- `PIPELINE-STAGE-MAP.json`
- `CLUSTER-DEPENDENCY-DAG.json`
- `SYSTEMIC-FAILURE-ANALYSIS.md`
- `STANDARD-COMPLEXITY-MAP.json`
- `GOLD-CONTRACT-AUDIT.json`
- `COUNTERFACTUAL-RESULTS.json`
- `OPTION-A-V0.3-CONTINUE.json`
- `OPTION-B-HYBRID-FRONTEND.json`
- `OPTION-C-V0.4-METHOD.json`
- `DECISION.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `CHANGED-FILES.txt`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

---

## 12. Hard rules

- diagnostic-only;
- no parser runtime changes;
- no Gold changes;
- no v0.3 method changes;
- no comparator weakening;
- no production switch;
- no merge/release/tag;
- preserve all prior seals;
- do not call mechanism tests semantic success;
- do not recommend “just keep adding rules” without quantifying the abstraction count and dependency structure.

---

## 13. Final return format

Return:

- TASK;
- commit hash;
- primary architecture diagnosis;
- cluster dependency summary;
- Gold contract audit summary;
- counterfactual findings;
- Option A assessment;
- Option B assessment;
- Option C assessment;
- primary decision:
  - `CONTINUE_V0_3_IMPLEMENTATION`
  - `HYBRID_FRONTEND_REQUIRED`
  - `V0_4_METHOD_REQUIRED`
  - `GOLD_CONTRACT_REVIEW_REQUIRED`
- any secondary flags;
- exact next-task recommendation;
- Manifest / SHA256SUMS / SEAL;
- confirmation of no runtime/Gold/v0.3/production changes;
- `STATUS=WAITING_ADMIN_REVIEW`.
