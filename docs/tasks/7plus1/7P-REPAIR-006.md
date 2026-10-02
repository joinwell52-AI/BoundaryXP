# 7P-REPAIR-006 — Controlled Composition & Technical Instruction Frame Certification

## 0. Task identity

- TASK: `7P-REPAIR-006`
- START_HEAD: `da9aec61045934bb349e75355c955829ce82d8c1`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- Previous task: `7P-REPAIR-005` — candidate recall progressed, semantic acceptance still FAIL
- `PRODUCTION_READY=false`

Read in full before coding:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
4. `docs/reports/7plus1/7P-REPAIR-005/REPORT.md`
5. `docs/reports/7plus1/7P-REPAIR-005/FIRST-DIVERGENCE.json`
6. `docs/reports/7plus1/7P-REPAIR-005/ROOT-CAUSES.md`
7. `docs/reports/7plus1/7P-REPAIR-005/ACTION-FRAME-AUDIT.json`
8. `research/7plus1-parser/v0.3-7p-repair-005/`

Do **not** modify the v0.3 method in this task.

---

## 1. Confirmed first divergence

005 succeeded at Candidate Graph recall:

```text
EVENT 使
EVENT 计算
EVENT 看
ENTITY next_seq
ENTITY active
ENTITY archived
UNION(active, archived)
CAUSATIVE_OR_CONTROLLED frame
MULTI_ARGUMENT frames
```

The first divergence has moved to:

```text
ARGUMENT_FRAME_TO_CERTIFIED_RELATION / CONTROLLED_COMPOSITION
```

Actual 005 behavior:

- `看` has PATIENT(active, archived) and a resolved operand set;
- `计算` exists but remains unresolved because its target/context is not materialized as a certified relation;
- governing action and governing target are retained in frame metadata, but not composed into the final governed action semantics;
- embedded/support predicates appear as standalone A candidates even when they are semantically subordinate to a parent modification;
- current standard counts remain unchanged.

This task must convert already-resolved frame evidence into certified relations/expressions without bypassing Eligibility.

---

## 2. Core objective

Implement a deterministic **Frame Certification Pass** after Candidate Recall / Edge Closure and before Eligibility.

Target:

```text
Candidate Graph
→ Candidate Frames
→ Edge Closure
→ Frame Certification
→ Eligibility / Γ
→ Boundary IR
→ QI...QB
```

No direct raw-text-to-7+1 path.

Preferred isolated module:

`frame-certification.mjs`

or equivalent.

---

## 3. Mechanism A — Controlled composition certification

For a resolved `CAUSATIVE_OR_CONTROLLED` frame, certify only when all are true:

1. one controller/support predicate;
2. one compatible controlled context or subject;
3. at least one embedded predicate;
4. governing action is unique or explicitly absent;
5. governing target set is unique or explicitly absent;
6. discourse domain and structural owner are compatible;
7. no contradictory modality/condition/scope evidence exists.

If any required part is ambiguous, keep typed unresolved.

### Important behavior

A controller such as `使 / 让 / 令 / make / let / cause` is normally **not** an independent business ACTION when it only introduces a controlled result/behavior.

Likewise an embedded support predicate must not become a top-level A entry merely because it is an EVENT node.

Do not delete nodes. Mark their boundary eligibility role through certified frame provenance so Eligibility can distinguish:

- governing business action;
- subordinate controlled behavior;
- independent action.

Do not modify QI–QB.

---

## 4. Mechanism B — Primary target/context relation

005 already stores:

`primary_target_context_ids`

For a resolved embedded frame, materialize a certified relation from the embedded semantic predicate to its controlled target/context using existing v0.3 relation types only.

Do not introduce a new normative relation type.

Use deterministic role selection:

- THEME when the controlled node denotes the subject/topic/content whose behavior is being computed/observed/validated;
- PATIENT only when syntax shows the event directly acts on that entity;
- RESULT only for a newly created/generated result;
- AGENT only for a true actor/performer, never merely a code symbol.

Example class:

```text
使 sequence 计算 ...
使 cache 状态更新 ...
make report generation include ...
```

A code symbol such as `next_seq` must not become RESULT just to make O appear.

Every certification must preserve source span and frame id.

---

## 5. Mechanism C — Governing action composition

When a controlled frame has:

- `governing_action_ids`
- `governing_target_ids`

compose the embedded behavior into the governing action instead of flattening it into unrelated top-level actions.

Required representation may use existing:

- relation bundles;
- Set AST;
- expression plans;
- node metadata;
- certified relation provenance.

No new v0.3 relation type is required.

The resulting governing action must carry enough evidence to answer:

```text
what is being changed?
what behavior must the changed object have?
what source/input set does that behavior consume?
```

Do not arbitrarily merge unrelated nested actions.

---

## 6. Mechanism D — Structured technical call-site instruction frame

Software/AI task texts frequently contain explicit instructions such as:

```text
foo 中调用为 helper(a, b)
in foo, call helper(a, b)
foo should call helper(a, b)
replace foo's call with helper(a, b)
```

Implement a generic technical instruction frame for this construction.

It must recover:

- owner / modified symbol;
- call action;
- callee symbol;
- complete argument list;
- path-composition arguments such as `base / "subdir"`;
- modality;
- source span;
- numbered-list / structural ownership.

Interpretation:

- owner symbol is MODIFICATION_TARGET;
- updated owner is UPDATED_OUTPUT with same artifact/symbol identity;
- call expression is behavior/content of that modification;
- call arguments are input/source scope for the call behavior;
- callee is not automatically a deliverable.

Do not hardcode any sample identifiers, function names or directory names.

Three sibling numbered items with the same construction must remain three independently auditable instruction frames.

---

## 7. Mechanism E — Structured declaration + code-block ownership

Support generic instruction:

```text
在 FILE 新增/添加/定义一个函数：
<code block>
```

The prose instruction is the current task action.
The code block is evidence/content of the declared deliverable, not a second set of current task actions.

Recover when structurally explicit:

- owning file/module;
- declared symbol name from the code block;
- CREATE/ADD action;
- generated symbol as DELIVERABLE;
- file/module as task object or modification target;
- source span linking prose instruction and owned code block.

Do not execute or semantically promote arbitrary code statements inside the block.

---

## 8. Mechanism F — Structured test-insertion instruction

Support generic form:

```text
在 test_file_1、test_file_2、test_file_3 中各加一个测试点：
<example code>
```

Recover:

- explicit test files as task objects;
- one distributive add-test instruction over the file set;
- generated/updated test deliverables;
- example code as owned content evidence, not extra current-task actions.

Preserve distributive semantics: `each` / `各` must not collapse into one arbitrary file.

---

## 9. Frame arbitration rules

When candidate frames compete, use deterministic precedence:

1. explicit structural instruction ownership;
2. explicit dependency/SRL argument;
3. typed technical literal/call syntax;
4. explicit set/list/distributive syntax;
5. controlled-frame evidence;
6. generic local syntax;
7. typed unresolved.

A stronger certified frame may reject a weaker edge, but rejected edges must remain auditable.

Never use distance alone as final authority.

---

## 10. No overfitting

Runtime logic must not contain:

- SWAI IDs;
- Gold expected values;
- `next_seq`, `write_task`, `write_report`, `write_issue`;
- `_existing_filenames_for_seq`;
- `tasks_dir`, `reports_dir`, `issues_dir`;
- source-specific sentence regexes;
- expected A/O slot text.

Use generic syntax/structure only.

---

## 11. Required non-Gold tests

Add independent tests for at least:

1. causative with one controlled context + one embedded event;
2. causative with nested source set;
3. controller that must not become top-level A;
4. genuinely independent embedded event that must remain A;
5. controlled target mapped to THEME, not RESULT;
6. true CREATE result mapped to RESULT;
7. ambiguous controlled context → unresolved;
8. unique governing action + target composition;
9. two competing governing actions → unresolved;
10. technical call-site update in one symbol;
11. three sibling call-site updates with distinct argument sets;
12. path-expression call arguments;
13. callee not promoted to deliverable;
14. helper/function declaration owned by prose + code block;
15. code block statements not promoted as current A;
16. distributive add-test over multiple files;
17. test example code owned by the test instruction;
18. English equivalents of call-site and declaration patterns;
19. negative examples where prose and code block are unrelated;
20. paraphrases of the controlled-composition pattern using unrelated symbols.

Assert intermediate frames, certified relations, final Eligibility decisions, and canonical output.

---

## 12. Baseline

005 final accepted diagnostic baseline:

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
B_WRONG_BINDING=6

OUTPUT_CONTENT_MATCH=3
OUTPUT_CONTENT_MISSING=17
```

005 PARTIAL_SUPPORT is diagnostic only and does not alter this baseline.

---

## 13. Hard acceptance gates

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
- 004 Edge Closure tests remain green
- 005 Candidate Recall tests remain green
- Gold/Source/BXP/v0.3/Pack/model/threshold unchanged
- full regression: 0 failures

### Frame certification

- dedicated Frame Certification stage exists;
- resolved controlled frame produces auditable certified relations;
- subordinate controller/support events do not leak as standalone A unless independently licensed;
- technical call-site frame is directly tested;
- code-block ownership is directly tested;
- distributive test insertion is directly tested;
- no new normative relation type;
- deterministic repeated output.

### Semantic progress

This task is not accepted if only mechanism tests pass.

Require at least:

- SWAI-001 first divergence at [402,440) moves downstream or closes;
- at least **one new full MATCH** in I/O/A on the standard corpus;
- A_MATCH >= 7 **or** A_MISSING <= 48;
- I_MATCH >= 8 **or** I_MISSING <= 40 **or** one new I full MATCH;
- O_MATCH >= 6 **or** O_MISSING <= 42 **or** one new O full MATCH;
- no increase in FALSE_DEFINED for any slot.

`STANDARD_PARSED > 0` is desirable but not mandatory.

Do not convert PARTIAL_SUPPORT to MATCH without full semantic equivalence.

---

## 14. Required report package

Create:

`docs/reports/7plus1/7P-REPAIR-006/`

At minimum:

- REPORT.md
- BASELINE.json
- BEFORE-AFTER.json
- COMPARISON.json
- SLOT-SUMMARY.json
- FAILURES.json
- FIRST-DIVERGENCE.json
- FRAME-CERTIFICATION-CONTRACT.json
- CONTROLLED-COMPOSITION-AUDIT.json
- PRIMARY-TARGET-AUDIT.json
- GOVERNING-ACTION-AUDIT.json
- CALL-SITE-FRAME-AUDIT.json
- CODE-BLOCK-OWNERSHIP-AUDIT.json
- TEST-INSERTION-AUDIT.json
- FRAME-ARBITRATION-AUDIT.json
- NON-GOLD-MECHANISM-RESULTS.json
- STAGE-DIVERGENCE-AUDIT.json
- EDGE-CLOSURE-COMPATIBILITY.json
- CANDIDATE-RECALL-COMPATIBILITY.json
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

---

## 15. Execution rules

- work only on `review/7plus1-parser`
- start from latest branch HEAD, descendant of `da9aec61045934bb349e75355c955829ce82d8c1`
- do not merge
- do not release
- do not tag
- do not switch production runtime
- do not modify v0.3 method
- do not modify Gold/Source/BXP
- push final evidence to `review/7plus1-parser`
- stop at `WAITING_ADMIN_REVIEW`
