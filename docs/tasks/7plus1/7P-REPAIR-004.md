# 7P-REPAIR-004 — Deterministic Relation / Edge Closure

## 0. Task identity

- TASK: `7P-REPAIR-004`
- START_HEAD: `7fca920f0253347342bc70dd199db670c38596d9`
- SEMANTIC_BASE: `1594ab9a4de1b66a19678c7d2b66eca63afaf66a`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Previous accepted task: `7P-REPAIR-003`
- `PRODUCTION_READY=false`

Read in full before implementation:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
4. `docs/reports/7plus1/7P-REPAIR-003/REPORT.md`
5. `docs/reports/7plus1/7P-REPAIR-003/FIRST-DIVERGENCE.json`
6. `docs/reports/7plus1/7P-REPAIR-003/ROOT-CAUSES.md`
7. final runtime `research/7plus1-parser/v0.3-7p-repair-003-r03/`

Do **not** modify the v0.3 method in this task.

---

## 1. Objective

Implement an isolated deterministic **Edge Closure Pass** between candidate semantic graph construction and Eligibility.

Current confirmed first divergence:

> SWAI-001: “使 next_seq 计算同时看 active 与 archived 两路径”

The current parser already has candidate nodes, PART_OF, artifact identity, deterministic QI–QB, slot-local coverage and partial graph closure. The remaining problem is incomplete relation closure: coordinated operands, shared complements, clause continuation and reused results/context are not always connected into a complete argument graph.

This task must fix the **general relation mechanism**, not the visible sentence.

Target pipeline remains:

```text
Natural Language
→ Structure / Discourse
→ Candidate Semantic Graph Gc
→ Edge Closure Pass
→ Eligibility / Γ
→ Boundary IR
→ deterministic QI...QB
→ Canonical 7+1
```

---

## 2. Implementation boundary

Create a clearly auditable module boundary, preferably:

`edge-closure.mjs`

or an equivalent isolated module.

Mount it after current candidate/structured graph recovery and before Eligibility. Do not rewrite QI–QB.

The Edge Closure Pass may read:

- semantic nodes
- current decoded relations
- token/dependency/SRL evidence
- typed recognizers / protected spans
- structure/discourse ownership
- Set/Condition expressions
- current typed unresolved records

It must not read:

- Gold expected answers
- sample IDs
- expected slot values
- model score as final authority
- final Canonical 7+1

No raw model/embedding/NLI result may directly force a RESOLVED edge.

---

## 3. Operator 1 — Guarded Cross-Clause Continuation

### Purpose

Close omitted/shared action arguments across explicitly connected clauses without arbitrary paragraph borrowing.

### Do not add new normative relation types

Do **not** add `CONTINUATION_OF` or `INHERITED_ACTION` to the v0.3 relation contract in this task.

Use existing semantic relations such as:

- PATIENT
- THEME
- RESULT
- RECIPIENT
- FORBIDS
- RESTRICTS
- CONJUNCTION
- SEQUENCE
- COREFERENCE

If continuation provenance is needed, record it as audit/provenance metadata, e.g. `continuation_proof`, not as a new normative relation.

### Resolution rule

A clause may inherit an active action context only when all are true:

1. same discourse domain;
2. explicit continuation evidence exists:
   - same sentence + conjunction/continuation marker; or
   - same explicit list parent with structural continuation; or
   - explicit coreference with unique antecedent; or
   - existing SEQUENCE/CONJUNCTION structural relation;
3. there is exactly one compatible active event context;
4. the current clause has a typed candidate object/set that is not already owned by another predicate;
5. no BASIS / condition / completion / output-content boundary explains the candidate instead;
6. relation type is uniquely determined.

If any condition is not unique, emit typed unresolved.

Hard prohibition:

```text
no verb in current clause
+ previous action exists
≠ automatically attach every orphan noun
```

No arbitrary adjacent-paragraph borrowing.

---

## 4. Operator 2 — Guarded Shared-Complement / Fan-out Closure

### Purpose

Handle genuine shared complements such as:

```text
检查并更新 A、B、C
inspect and update A, B, C
```

while avoiding false Cartesian products such as:

```text
检查 A，并更新 B、C
```

### Algorithm

First resolve:

- coordinated action group `A = {a1...am}`
- explicit shared object set `O = {o1...on}`
- local object ownership for every action

Fan-out is allowed only when:

1. actions are in one explicit coordination group;
2. the object set is syntactically/structurally shared by that group;
3. no action has an exclusive local object that partitions the scope;
4. modality/domain are compatible;
5. each generated edge passes relation type constraints.

Then create the required PATIENT / THEME / RESULT edges per action family and retain complete provenance.

Do **not** implement unconditional `actions × nouns`.

If the source supports partitioned scopes, preserve partitions instead of broadcasting.

For explicit object coordination, preserve all members through existing Set AST:

- ITEM
- UNION
- ALL
- ANY

Do not reduce a coordinated set to the nearest item.

---

## 5. Operator 3 — Shared Result / Coreference Reuse

### Purpose

Support:

```text
生成 report.md，然后将其发送给审计员，并在最后归档。
```

where one artifact identity is reused as:

- RESULT(generate, report.md)
- THEME/PATIENT(send, report.md)
- PATIENT(archive, report.md)

### Implementation requirement

Extend/reuse the existing `coreference.mjs` mechanism. Do not create a second incompatible coreference resolver.

A referent may resolve only after filtering candidates by:

1. same compatible discourse domain;
2. same section/structural ownership unless explicit cross-section reference exists;
3. semantic type compatibility;
4. referent class compatibility, e.g. report/file/result/artifact/person;
5. source order;
6. explicit cardinality;
7. unique compatible antecedent.

Recency may break a tie only inside an already uniquely bounded candidate set; “nearest result” is not sufficient by itself.

If exactly one candidate remains:

- create COREFERENCE;
- replace/redirect the downstream action argument to the real entity identity.

If multiple compatible candidates remain:

- `UNRESOLVED_COREFERENCE`
- do not guess.

Preserve the existing MODIFY invariant:

```text
one artifact identity
→ MODIFICATION_TARGET
→ UPDATED_OUTPUT
→ same_artifact=true
```

---

## 6. Operator 4 — Baseline Detachment / Shielding

### Purpose

Prevent normative references from being consumed as task objects, e.g.:

```text
依据 SPEC-42 修复路由解析器
```

Correct structure:

```text
BASIS(action, SPEC-42)
PATIENT(action, 路由解析器)
```

not:

```text
PATIENT(action, SPEC-42)
```

### Rule

For a node already typed/proven as a normative reference under an explicit basis construction:

- reject weaker PATIENT/THEME edges that attach the same reference as the action object;
- preserve/create BASIS / CONFORMS_TO using existing v0.3 relation types;
- mark artifact-role interpretation as REFERENCE_ONLY where applicable;
- do not allow it into I merely because it is a file/identifier near the verb.

This must extend existing `source-semantics.mjs` / `structured-recovery.mjs` behavior, not duplicate or weaken it.

Do not classify every prepositional phrase as BASIS. Only explicit normative/basis constructions qualify.

---

## 7. Edge resolution evidence order

Use this deterministic precedence:

1. explicit dependency/SRL relation
2. protected typed operand span
3. explicit conjunction/set syntax
4. structural list / parent-child ownership
5. same-sentence explicit continuation
6. explicit coreference with unique antecedent
7. typed unresolved

Distance can only be a tie-break inside a type-compatible, structurally bounded set.

Distance alone must never produce a final semantic edge.

---

## 8. Required audit record

Every newly RESOLVED or REJECTED edge created by Edge Closure must expose:

```text
edge/relation id
operator
head node
tail node / target set
relation type
source spans
structural path
evidence kind
competing candidates
rejected-alternative reason
resolution state
```

The same input/intermediate graph must produce deterministic edge closure output.

---

## 9. Anti-overfitting hard fail

Runtime logic must not contain:

- `SWAI-001`, `REF-001`, other sample IDs;
- Gold expected slot values;
- `next_seq`, `active`, `archived`, writer names, ADR-0003 as special-case keys;
- source-sentence-specific regex patches;
- nearest-noun greedy binding as final authority;
- arbitrary previous/next paragraph attachment;
- “missing verb → add synonym” as the repair strategy;
- forced RESOLVED state without unique evidence.

Generic grammatical categories and existing generic action families are allowed.

---

## 10. Required non-Gold mechanism tests

Add independent tests for at least:

1. one action + one object;
2. one action + two-object coordination;
3. three-object coordination;
4. two coordinated actions sharing one object set;
5. two actions with partitioned object scopes — must **not** Cartesian fan-out;
6. basis phrase before real action object;
7. passive / BA / BEI case where parser evidence supports it;
8. same-sentence continuation;
9. structural list continuation;
10. neighboring paragraph without continuation evidence — must not attach;
11. one generated output reused by later send/archive;
12. ambiguous two-result coreference — unresolved;
13. MODIFY same identity → I + O;
14. OUTPUT_CONTENT graph remains internal;
15. reference near verb remains V/basis, not I;
16. paraphrases of the SWAI-001 structural pattern using unrelated identifiers and nouns.

Tests must assert intermediate edge graph, not only final 7+1.

---

## 11. Baseline

Authoritative semantic baseline from accepted 7P-REPAIR-003:

```text
REF001=PASS
STANDARD_PARSED=0/9

I_MATCH=7
I_MISSING=42
I_FALSE_DEFINED=3
I_WRONG_BINDING=2

O_MATCH=5
O_MISSING=44
O_FALSE_DEFINED=1
O_WRONG_BINDING=2

A_MATCH=6
A_MISSING=50
A_FALSE_DEFINED=2
A_WRONG_BINDING=2

P_MATCH=9
P_MISSING=3
P_FALSE_DEFINED=0
P_WRONG_BINDING=0

R_MATCH=1
R_MISSING=0
R_FALSE_DEFINED=0

V_MATCH=12
V_MISSING=19

C_MATCH=19
C_MISSING=4

B_MATCH=14
B_MISSING=28
B_FALSE_DEFINED=0
B_WRONG_BINDING=6

OUTPUT_CONTENT_MATCH=3
OUTPUT_CONTENT_MISSING=17
```

---

## 12. Hard acceptance gates

All must pass.

### No regression

- REF001=PASS
- P_FALSE_DEFINED=0
- P_WRONG_BINDING=0
- R_FALSE_DEFINED=0
- R_MISSING=0
- V_MATCH >= 12
- C_MATCH >= 19
- SWAI003_ADR0003=MATCH
- TABLE_CELL_DIRECT_PROMOTION=false
- SLOT_LOCAL_COVERAGE=PASS
- DETERMINISTIC_GRAPH_VIEWS=PASS
- Gold/Source/BXP/Pack/model/threshold unchanged
- full regression: 0 failures

### Edge Closure

- isolated deterministic Edge Closure stage exists and is directly testable;
- all four operators above have positive and negative tests;
- coordinated operands keep all intended members;
- partitioned scopes do not fan-out;
- ambiguous continuation/coreference stays typed unresolved;
- basis shielding prevents reference→I contamination;
- no arbitrary cross-paragraph borrowing;
- Edge Closure output is stable across repeated runs.

### Semantic progress

Require real aggregate progress:

- A_WRONG_BINDING <= 2
- A_MATCH >= 7 **or** A_MISSING <= 48
- I_MATCH >= 8 **or** I_MISSING <= 40
- O_MATCH >= 6 **or** O_MISSING <= 42
- B_MATCH >= 14
- B_WRONG_BINDING <= 6
- OUTPUT_CONTENT_MATCH >= 3
- no new false-defined count in P/R/V/C/B

`STANDARD_PARSED > 0` is desirable, but not a hard gate. Do not overfit to manufacture a complete sample.

SWAI-001 first divergence may be marked CLOSED only if the general mechanism closes the complete intended action/object/context relation, not merely the visible phrase.

---

## 13. Required report package

Create:

`docs/reports/7plus1/7P-REPAIR-004/`

At minimum:

- REPORT.md
- BASELINE.json
- BEFORE-AFTER.json
- COMPARISON.json
- SLOT-SUMMARY.json
- FAILURES.json
- FIRST-DIVERGENCE.json
- EDGE-CLOSURE-CONTRACT.json
- EDGE-RESOLUTION-AUDIT.json
- CONTINUATION-AUDIT.json
- FANOUT-AUDIT.json
- COREFERENCE-AUDIT.json
- BASIS-SHIELD-AUDIT.json
- NON-GOLD-MECHANISM-RESULTS.json
- GRAPH-QUERY-RESULTS.json
- COVERAGE-LOCALITY.json
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

Keep MATCH / MISSING / FALSE_DEFINED / WRONG_BINDING / WRONG_STATUS / PARTIAL_SUPPORT distinct. PARTIAL_SUPPORT is not MATCH.

Do not infer semantic accuracy from test-pass counts.

---

## 14. Execution rules

- work only on `review/7plus1-parser`
- start from the latest branch HEAD, which must be a descendant of `7fca920f0253347342bc70dd199db670c38596d9`
- do not merge
- do not release
- do not tag
- do not switch production runtime
- do not modify v0.3 method
- do not modify Gold/Source/BXP protocol
- push final evidence to `review/7plus1-parser`
- stop at `WAITING_ADMIN_REVIEW`
