# 7P-REPAIR-005 — Embedded Predicate & Candidate Graph Recall Closure

## 0. Task identity

- TASK: `7P-REPAIR-005`
- START_HEAD: `6db6b53a2c5049bc694fd16a150596fb10a8567e`
- Repository: `joinwell52-AI/BoundaryXP`
- Branch: `review/7plus1-parser`
- Normative method: `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Previous task: `7P-REPAIR-004` — semantic acceptance FAIL, diagnostic implementation retained
- `PRODUCTION_READY=false`

Read in full before implementation:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
4. `docs/reports/7plus1/7P-REPAIR-004/REPORT.md`
5. `docs/reports/7plus1/7P-REPAIR-004/FIRST-DIVERGENCE.json`
6. `docs/reports/7plus1/7P-REPAIR-004/ROOT-CAUSES.md`
7. final runtime `research/7plus1-parser/v0.3-7p-repair-004/`

Do **not** modify the v0.3 method in this task.

---

## 1. Why this task exists

7P-REPAIR-004 proved that Edge Closure itself can execute deterministically, but the accepted standard corpus did not improve because the upstream candidate graph is incomplete.

Confirmed SWAI-001 first divergence:

```text
使 next_seq 计算同时看 active 与 archived 两路径
```

Actual linguistic evidence already contains:

- `使` — VV/root
- `next_seq` — NN, compound of `计算`
- `计算` — VV, dependent of `使`
- `看` — VV/ccomp
- `active 与 archived 两路径` — SRL ARG1 of `看`

But the candidate semantic graph exposed only:

- ENTITY `next_seq`
- EVENT `使`

and did **not** expose the embedded predicate endpoints and complete operand set required by Edge Closure.

Therefore the next first-divergence layer is:

```text
Candidate Semantic Graph Recall / Embedded Predicate Materialization
```

This task fixes that layer only. Do not compensate downstream in Eligibility or Q.

---

## 2. Objective

Make the candidate producer preserve and materialize enough typed semantic structure for existing Edge Closure to operate.

Target pipeline:

```text
NLP / typed recognizers / document structure
→ Candidate Semantic Graph
   - predicate endpoints
   - argument candidates
   - controlled/embedded action frame
   - coordinated operand set
→ existing Edge Closure
→ existing Eligibility / Γ
→ Boundary IR
→ existing QI...QB
```

No direct raw-text-to-slot path.

---

## 3. Required mechanism A — Embedded Predicate Materialization

A verbal predicate must not disappear merely because the NLP dependency parser does not label it `root/ccomp/xcomp/conj`.

Materialize an EVENT candidate when a token is predicate-compatible and supported by at least one of:

1. SRL marks it as PRED;
2. POS says verbal and dependency relation is predicate-compatible;
3. POS says verbal and it is a verbal complement of an explicit support/control/causative predicate;
4. a bounded alternative POS/dependency analysis agrees it is verbal;
5. an existing grammatical construction identifies it as the semantic predicate.

This must cover non-root embedded predicates and controlled predicates.

Do not make every VV token a boundary action. This stage produces **candidate EVENT nodes**, not Boundary Facts.

Quoted values, code blocks, basis text, headings, metadata and OUTPUT_CONTENT remain subject to the existing discourse gates.

---

## 4. Required mechanism B — Causative / Controlled Action Frame

Implement a generic candidate-level frame for constructions equivalent to:

```text
使 / 让 / 令 X V ...
make / let / cause X to V ...
```

Do not add new normative v0.3 relation types.

Represent the internal frame with candidate metadata / relation bundle / argument-frame structure, e.g.:

```text
frame_kind = CAUSATIVE_OR_CONTROLLED
controller_event_id
embedded_event_ids
controlled_subject_or_context_ids
source_or_operand_expr_id
governing_clause_id
source_span_ids
structural_path
state
```

The frame must preserve the distinction between:

- controller/support predicate;
- embedded semantic predicate;
- controlled subject/context;
- embedded predicate arguments;
- governing action/scope from the parent clause when structurally licensed.

For the SWAI-001 pattern, `next_seq` must not be forced into RESULT merely to manufacture O. The parser must determine its actual argument role from syntax/typed evidence.

---

## 5. Required mechanism C — Multi-Argument Candidate Frame

Candidate actions must be able to expose more than one semantic argument class.

At candidate level support at least:

- primary target/context
- source/input set
- result
- recipient
- basis
- condition
- governing action / governing target scope

These are **candidate frame slots**, not new canonical 7+1 slots and not new normative relation types.

Materialize existing relations only after slot evidence is sufficient:

- PATIENT
- THEME
- RESULT
- RECIPIENT
- BASIS
- SCOPE_MEMBER
- CONJUNCTION / SEQUENCE
- existing condition relations

Ambiguous slot assignment stays typed unresolved.

---

## 6. Required mechanism D — Coordinated Operand Preservation

Before Edge Closure, preserve explicit coordinated operands as one bounded candidate set.

For constructions such as:

```text
active 与 archived 两路径
A、B、C
left and right sources
```

the candidate producer must expose all members and an existing Set AST expression where justified:

- ITEM
- UNION
- ALL
- ANY

Do not create a fake semantic entity merely to represent the set.

Do not reduce a coordinated group to the nearest noun.

The existing Edge Closure may then materialize the required endpoint relations using the set and its members.

---

## 7. Required mechanism E — Typed Literal Precedence over Noisy NER

A code-like or typed technical identifier must not become a participant merely because NER labels it PERSON/ORG.

Examples include identifiers shaped like:

```text
next_seq
write_task
foo.bar
module_name
API symbols
paths
version/reference literals
```

Precedence rule:

```text
protected typed literal / explicit technical-object evidence
> generic NER label
```

NER remains evidence, but cannot override a stronger technical literal type.

This must not regress legitimate human participants.

---

## 8. Interaction with 7P-REPAIR-004

Retain the 004 Edge Closure implementation and tests.

Do not solve this task by:

- expanding nearest-noun rules;
- hardcoding `next_seq`, `active`, `archived`;
- adding source-sentence regex patches;
- lowering Edge Closure safeguards;
- forcing continuation/fan-out to RESOLVED when endpoints are absent;
- changing Eligibility so incomplete candidate graphs are accepted anyway.

Expected behavior:

```text
005 improves Gc
→ existing 004 Edge Closure consumes better Gc
→ Γ/Q remain unchanged
```

If 004 Edge Closure itself needs a small compatibility adjustment to consume the newly materialized generic frame, document it separately and preserve all 004 negative tests.

---

## 9. First-divergence debugging requirement

For SWAI-001 and every independent mechanism test, export stage snapshots:

```text
linguistic tokens/SRL
→ candidate nodes before 005
→ candidate nodes after predicate materialization
→ argument frames
→ set expressions
→ Edge Closure input
→ Edge Closure output
→ Eligibility decisions
```

The report must identify the exact first stage where each failed case diverges.

Do not score a downstream improvement without proving the upstream graph that caused it.

---

## 10. Required non-Gold tests

Add independent positive and negative tests, unrelated to the Gold identifiers, for at least:

1. simple root predicate;
2. non-root ccomp predicate;
3. xcomp predicate;
4. verbal complement mislabeled as dobj but supported by control/causative grammar;
5. causative: controller + controlled subject + embedded event;
6. causative with two coordinated source operands;
7. embedded predicate with three operands;
8. two embedded predicates with separate argument sets;
9. quoted verbal word that must not become EVENT;
10. heading/code/metadata verbal token that must not become current-task EVENT;
11. technical identifier falsely tagged PERSON by NER — must remain technical object;
12. real person participant — must remain participant;
13. coordinated operands preserved as UNION;
14. ambiguous controlled subject — typed unresolved;
15. unrelated neighboring clause — no inherited frame;
16. English controlled/complement construction;
17. paraphrases structurally equivalent to SWAI-001 but with unrelated identifiers;
18. malformed/ambiguous candidate where Edge Closure must receive unresolved, not invented endpoints.

Tests must assert intermediate Candidate Graph / frame structure, not only final 7+1.

---

## 11. Baseline

Authoritative comparison remains the last accepted semantic counts because 004 produced no canonical delta:

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

004's Edge Closure implementation is retained as diagnostic infrastructure, but 004 itself did not pass semantic acceptance.

---

## 12. Hard acceptance gates

### No regression

- REF001=PASS
- P_FALSE_DEFINED=0
- P_WRONG_BINDING=0
- R_FALSE_DEFINED=0
- R_MISSING=0
- V_MATCH >= 12
- C_MATCH >= 19
- B_MATCH >= 14
- B_WRONG_BINDING <= 6
- A_WRONG_BINDING <= 2
- TABLE_CELL_DIRECT_PROMOTION=false
- SLOT_LOCAL_COVERAGE=PASS
- DETERMINISTIC_GRAPH_VIEWS=PASS
- all 004 Edge Closure positive/negative mechanism tests still pass
- Gold/Source/BXP/v0.3/Pack/model/threshold unchanged
- full regression: 0 failures

### Candidate Graph

- embedded predicate endpoint materialization is directly testable;
- causative/control frame is directly testable;
- coordinated operand set is preserved;
- technical literal precedence over noisy NER is tested;
- no sample IDs or Gold values in runtime logic;
- no direct Candidate→7+1 shortcut;
- ambiguous frames remain typed unresolved;
- repeated runs produce identical candidate/frame output.

### Semantic progress

Require real progress on the accepted corpus:

- SWAI-001 first divergence at [402,440) must move downstream or close;
- A_MATCH >= 7 **or** A_MISSING <= 48;
- I_MATCH >= 8 **or** I_MISSING <= 40;
- O_MATCH >= 6 **or** O_MISSING <= 42;
- no increase in false-defined counts for I/O/A/P/R/V/C/B.

`STANDARD_PARSED > 0` is desirable but not a hard gate.

Do not claim success if only mechanism tests improve and canonical counts remain unchanged.

---

## 13. Export/reporting preflight

004 exposed a revision-guard defect in `export.mjs`.

Before final batch replay, ensure the 005 research runtime can export its own current compiler result without falling into an obsolete legacy branch.

This is reporting/runtime compatibility only; it must not change parser semantics.

Record any exporter-only fix separately in CHANGED-FILES and REPORT.

---

## 14. Required report package

Create:

`docs/reports/7plus1/7P-REPAIR-005/`

At minimum:

- REPORT.md
- BASELINE.json
- BEFORE-AFTER.json
- COMPARISON.json
- SLOT-SUMMARY.json
- FAILURES.json
- FIRST-DIVERGENCE.json
- CANDIDATE-RECALL-CONTRACT.json
- EMBEDDED-PREDICATE-AUDIT.json
- ACTION-FRAME-AUDIT.json
- OPERAND-SET-AUDIT.json
- TYPED-LITERAL-PRECEDENCE-AUDIT.json
- STAGE-DIVERGENCE-AUDIT.json
- EDGE-CLOSURE-COMPATIBILITY.json
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

Keep MATCH / MISSING / FALSE_DEFINED / WRONG_BINDING / WRONG_STATUS / PARTIAL_SUPPORT distinct.

Test pass is not semantic acceptance.

---

## 15. Execution rules

- work only on `review/7plus1-parser`
- start from latest branch HEAD, descendant of `6db6b53a2c5049bc694fd16a150596fb10a8567e`
- do not merge
- do not release
- do not tag
- do not switch production runtime
- do not modify v0.3 method
- do not modify Gold/Source/BXP protocol
- push final evidence to `review/7plus1-parser`
- stop at `WAITING_ADMIN_REVIEW`
