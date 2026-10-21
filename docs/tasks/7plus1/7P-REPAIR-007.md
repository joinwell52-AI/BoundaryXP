# 7P-REPAIR-007 — Cross-Instruction Identity Closure & Case-Level I/O/A Joint Acceptance

## 0. Task identity

- TASK: `7P-REPAIR-007`
- START_HEAD: `d2de84a97c415d02b9f2087afedbff4276a69287`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Previous task: `7P-REPAIR-006` — Frame Certification landed; component semantic MATCH increased, while `STANDARD_PARSED=0/9`
- `PRODUCTION_READY=false`

Read in full before coding:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
4. `docs/reports/7plus1/7P-REPAIR-006/REPORT.md`
5. `docs/reports/7plus1/7P-REPAIR-006/FIRST-DIVERGENCE.json`
6. `docs/reports/7plus1/7P-REPAIR-006/BEFORE-AFTER.json`
7. `docs/reports/7plus1/7P-REPAIR-006/COMPARISON.json`
8. `docs/reports/7plus1/7P-REPAIR-006/SLOT-SUMMARY.json`
9. `docs/reports/7plus1/7P-REPAIR-006/replay/`
10. `research/7plus1-parser/v0.3-7p-repair-006/` if present

Do **not** modify the v0.3 method in this task.

---

## 1. Accepted 006 baseline

The sealed 006 result is the immutable baseline.

Engineering:

```text
dedicated semantic/mechanism tests = 352/352
full regression = 4958 pass / 0 fail / 17 skipped
REF001 = PASS
STANDARD_PARSED = 0/9
MANIFEST / SHA256SUMS / SEAL = PASS
```

Semantic item counts after 006:

```text
I_MATCH = 8
I_MISSING = 41
I_FALSE_DEFINED = 3
I_WRONG_BINDING = 2

O_MATCH = 6
O_MISSING = 43
O_FALSE_DEFINED = 1
O_WRONG_BINDING = 2

A_MATCH = 7
A_MISSING = 49
A_FALSE_DEFINED = 2
A_WRONG_BINDING = 2

P_MATCH = 9
P_MISSING = 3
P_FALSE_DEFINED = 0
P_WRONG_BINDING = 0

R_MATCH = 1
R_MISSING = 0
R_FALSE_DEFINED = 0

V_MATCH = 12
V_MISSING = 19

C_MATCH = 19
C_MISSING = 4

B_MATCH = 14
B_MISSING = 28
B_WRONG_BINDING = 6

OUTPUT_CONTENT_MATCH = 3
OUTPUT_CONTENT_MISSING = 17
```

Important terminology:

- `I_MATCH=8 / O_MATCH=6 / A_MATCH=7` are **corpus semantic-item MATCH counts**, not “8/9, 6/9, 7/9 cases”.
- `STANDARD_PARSED=0/9` is the existing whole-case metric.
- This task adds an explicit **case-level I/O/A joint acceptance ledger** so item totals cannot be mistaken for same-case semantic closure.

Do not rewrite 006 evidence.

---

## 2. Confirmed first divergence after 006

006 closed the previous controlled-composition defect at the `使 next_seq ...` span.

The accepted 006 first divergence moved downstream to:

```text
CROSS_INSTRUCTION_ARTIFACT_IDENTITY
+
CALL_TO_DECLARATION_BEHAVIOR_BINDING
```

006 evidence identifies two missing relations:

1. unique structured group-member identities for the three-method target;
2. call-site symbol → declared function identity / declared behavior link.

Observed consequence:

- the aggregate three-member modification target exists, but member identity is not yet deterministically closed across later numbered call-site instructions;
- the three call-site frames preserve arguments and path expressions, but cannot yet prove that each call behavior belongs to the corresponding member of the earlier aggregate modification target;
- the callee symbol exists at each call site and the helper declaration exists, but the identity/behavior relation between call and declaration is not uniquely certified;
- therefore recovered evidence remains PARTIAL_SUPPORT/MISSING instead of closing the corresponding I/O/A semantics.

This task must repair the earliest causal identity/binding gap. Do not patch the final comparator.

---

## 3. Primary objective

Implement deterministic **cross-instruction identity closure** after structural/frame certification and before final Eligibility / canonical projection.

Target:

```text
Structured instruction frames
→ local certified identities
→ cross-instruction identity closure
→ call/declaration behavior binding
→ Eligibility / Γ
→ Boundary IR
→ QI...QB
```

The repair must allow semantically identical artifacts/symbols mentioned in:

- an aggregate modification instruction,
- later sibling member instructions,
- a declaration instruction,
- later call-site behavior,

to be linked only when identity is uniquely evidenced by structure, symbol/type, ownership and compatible scope.

No direct raw-text-to-Gold path.

---

## 4. Mandatory pre-repair case-level I/O/A ledger

Before implementation changes, reconstruct a case-level acceptance ledger from the sealed 006 evidence.

Create one row for every non-excluded STANDARD case:

| Case | I required | I full | O required | O full | A required | A full | I complete | O complete | A complete | I/O/A joint complete | first blocker |
|---|---:|---:|---:|---:|---:|---:|---|---|---|---|---|

Definitions:

- `I complete`: every accepted I requirement for that case is full MATCH, with no required I semantics left MISSING / FALSE_DEFINED / WRONG_BINDING / WRONG_STATUS.
- same for O and A.
- `I/O/A joint complete`: I complete AND O complete AND A complete for the **same case**.

Do not infer this from corpus totals.

Persist this as new 007 evidence, e.g.:

`docs/reports/7plus1/7P-REPAIR-007/CASE-IOA-JOINT-BASELINE.json`

Record the computed baseline exactly:

```text
CASE_IOA_JOINT_BASELINE = N/9
```

Do not assume N in advance. Derive it from 006 sealed evidence.

---

## 5. Mechanism A — Aggregate target member identity

Support a generic structure in which one instruction names an aggregate set of target members and later sibling instructions refer to those members individually.

Generic example:

```text
modify methods A / B / C ...
1. A ...
2. B ...
3. C ...
```

Required behavior:

1. preserve the aggregate target as a set/group expression;
2. materialize stable member identities when members are explicitly enumerable;
3. link each later sibling instruction to exactly one aggregate member only when:
   - symbol/identifier is compatible;
   - artifact/module/file context is compatible;
   - structural ownership is compatible;
   - no competing same-name candidate exists in the admissible scope;
4. retain source span and structural path for both aggregate mention and member mention;
5. ambiguous member identity remains typed unresolved.

Do not flatten an explicit member set into one opaque string.

Do not hardcode sample identifiers or SWAI-001 method names.

---

## 6. Mechanism B — Cross-instruction artifact continuity

Create a deterministic identity/continuity pass for a target appearing in multiple task clauses.

The pass must distinguish:

- same artifact / same symbol across instructions;
- member-of relation inside an explicit aggregate target;
- updated version of the same target;
- unrelated same-surface symbol in another owner/scope.

Evidence precedence:

1. exact typed symbol identity within compatible artifact owner;
2. explicit aggregate membership;
3. structural sibling ownership under one task section;
4. certified declaration/call frame ownership;
5. compatible source/discourse domain;
6. otherwise unresolved.

Distance alone is never sufficient.

Identity closure must be auditable and deterministic.

---

## 7. Mechanism C — Call-site → declaration identity / behavior binding

006 already certifies call-site frames and declaration frames.

Add a generic binding pass so a call-site callee may bind to a declaration only when uniqueness is established.

Certification requires:

1. matching compatible symbol identity;
2. declaration is in admissible task/document scope;
3. no competing declaration with equal authority exists;
4. declaration ownership is structurally valid;
5. call frame is already certified;
6. binding does not require executing code;
7. provenance includes call span + declaration span + structural owner.

The binding must express enough existing semantics to prove:

```text
this call invokes this declared helper/function behavior
```

Use existing v0.3 relation/metadata/expression mechanisms.

Do not add a new normative relation type unless already permitted by the frozen method.

Do not modify QI–QB.

Same-name symbols in unrelated scope must not bind.

---

## 8. Mechanism D — Compose member-specific behavior back to the governing modification

Once a later member instruction is uniquely linked to a member of an earlier aggregate modification target, the certified call behavior may contribute evidence to that member's governing modification semantics.

Required questions must become answerable from certified provenance:

```text
which target member is being modified?
what call behavior is required for that member?
which declared helper/function does the call refer to?
which argument/source scope is used?
how does this member relate to the earlier aggregate target?
```

Do not merge sibling member behaviors into one undifferentiated action.

Do not duplicate one call behavior across multiple members.

---

## 9. No overfitting

Runtime logic must not contain:

- SWAI IDs;
- Gold expected values;
- sample-specific offsets;
- `write_task`, `write_report`, `write_issue`;
- `_existing_filenames_for_seq`;
- `tasks_dir`, `reports_dir`, `issues_dir`;
- sample-specific path strings;
- expected A/O/I slot text.

Use generic symbol, structure, typed identity and ownership evidence only.

---

## 10. Required non-Gold tests

Add independent tests covering at least:

1. aggregate target with three named members + three sibling member instructions;
2. aggregate target with two members and reversed later order;
3. same member name under a different artifact owner must not bind;
4. ambiguous duplicate member names → unresolved;
5. declaration followed by multiple call sites to the same declared symbol;
6. same-name declaration in another scope must not steal binding;
7. two equally valid declarations → unresolved;
8. call before declaration in the same admissible task scope;
9. call arguments preserved through cross-instruction binding;
10. path-composition argument preserved;
11. aggregate member identity survives deterministic rerun;
12. Chinese and English paraphrases;
13. unrelated code block with same symbol text must not bind;
14. member instruction without aggregate parent still works locally;
15. nested task section with reused symbol name remains isolated.

Assert intermediate identity candidates, certified links, Eligibility decisions and canonical output.

---

## 11. Case-level semantic acceptance objective

The principal semantic objective of 007 is **same-case I/O/A closure**, not merely increasing global item counts.

After implementation freeze, regenerate the case-level I/O/A ledger.

Success requires:

```text
CASE_IOA_JOINT_AFTER > CASE_IOA_JOINT_BASELINE
```

and therefore at least one STANDARD case must newly satisfy:

```text
I complete = true
O complete = true
A complete = true
I/O/A joint complete = true
```

for the same case.

If no case-level joint closure is gained, the semantic gate is not met even if global I/O/A item MATCH totals increase.

---

## 12. Non-regression gates

Preserve at minimum the accepted 006 baseline:

- REF001=PASS
- I_MATCH >= 8
- O_MATCH >= 6
- A_MATCH >= 7
- P_MATCH >= 9
- R_MATCH >= 1
- V_MATCH >= 12
- C_MATCH >= 19
- B_MATCH >= 14
- I_FALSE_DEFINED <= 3
- O_FALSE_DEFINED <= 1
- A_FALSE_DEFINED <= 2
- P_FALSE_DEFINED=0
- P_WRONG_BINDING=0
- R_FALSE_DEFINED=0
- R_MISSING=0
- B_WRONG_BINDING <= 6
- A_WRONG_BINDING <= 2
- no increase in FALSE_DEFINED for any slot
- 004 Edge Closure tests remain green
- 005 Candidate Recall tests remain green
- 006 Frame Certification tests remain green
- Gold/Source/BXP/v0.3/Pack/model/threshold unchanged
- full regression: 0 failures

Skipped tests remain skipped and are not counted as PASS.

Any first-run anomaly must be preserved in evidence.

---

## 13. Required report package

Create:

`docs/reports/7plus1/7P-REPAIR-007/`

At minimum:

- REPORT.md
- BASELINE.json
- BEFORE-AFTER.json
- COMPARISON.json
- SLOT-SUMMARY.json
- FAILURES.json
- FIRST-DIVERGENCE.json
- CASE-IOA-JOINT-BASELINE.json
- CASE-IOA-JOINT-AFTER.json
- CASE-IOA-JOINT-DIFF.json
- AGGREGATE-MEMBER-IDENTITY-AUDIT.json
- CROSS-INSTRUCTION-IDENTITY-AUDIT.json
- CALL-DECLARATION-BINDING-AUDIT.json
- MEMBER-BEHAVIOR-COMPOSITION-AUDIT.json
- NON-GOLD-MECHANISM-RESULTS.json
- STAGE-DIVERGENCE-AUDIT.json
- TESTS.json
- RUNS.json
- PERFORMANCE.json
- CHANGED-FILES.txt
- IMPLEMENTATION-FROZEN.json
- VERIFY.json
- MANIFEST.json
- SEAL.md
- SEAL-VERIFICATION.json
- SHA256SUMS.txt

Keep MATCH / MISSING / FALSE_DEFINED / WRONG_BINDING / WRONG_STATUS / PARTIAL_SUPPORT distinct.

The report must explicitly separate:

1. corpus semantic-item counts;
2. case-level I/O/A joint acceptance;
3. `STANDARD_PARSED`.

Do not use one as a substitute for another.

---

## 14. Hard acceptance gates

### Engineering

- focused/new tests PASS
- 004/005/006 compatibility gates PASS
- full regression = 0 failures
- deterministic repeated output PASS
- MANIFEST PASS
- SHA256SUMS PASS
- SEAL PASS

### Semantic

- accepted 006 first divergence moves downstream or closes;
- at least one aggregate-member identity path is fully certified by the generic mechanism;
- at least one call-site → declaration identity/behavior path is fully certified by the generic mechanism;
- no sample-specific hardcoding;
- no Gold mutation;
- no increase in FALSE_DEFINED;
- `CASE_IOA_JOINT_AFTER > CASE_IOA_JOINT_BASELINE`.

If the case-level joint metric does not improve, report:

`SEMANTIC_GATE_NOT_MET`

even if mechanism tests and global item counts improve.

`STANDARD_PARSED > 0` is desirable but is not required by this repair unless naturally achieved.

---

## 15. Execution rules

- work only on `review/7plus1-parser`
- start from latest branch HEAD, descendant of `d2de84a97c415d02b9f2087afedbff4276a69287`
- do not merge
- do not release
- do not tag
- do not switch production runtime
- do not modify v0.3 method
- do not modify Gold/Source/BXP
- do not weaken comparator semantics
- push final implementation and evidence only to `review/7plus1-parser`
- stop at `WAITING_ADMIN_REVIEW`

---

## 16. Final return format

Return a concise execution summary containing:

- TASK
- branch
- commit hash
- focused/new test result
- compatibility test result
- full regression result
- I/O/A corpus semantic-item counts before → after
- case-level I/O/A joint count before → after
- `STANDARD_PARSED` before → after
- confirmed first divergence before → after
- aggregate-member identity result
- call→declaration binding result
- Manifest / SHA256SUMS / SEAL
- confirmation of no merge/release/tag/production switch
- report path
- `STATUS=WAITING_ADMIN_REVIEW`
