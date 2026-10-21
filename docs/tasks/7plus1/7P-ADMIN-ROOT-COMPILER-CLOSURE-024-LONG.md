# 7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG

## Status

ADMIN AUTHORIZED — LONG-RUN CLOSURE TASK

本任务是一个长任务闭环，不是阶段任务，不得在内部某一阶段完成后停止等待新的 ADMIN 授权。

Codex 必须在本任务授权范围内持续执行：

~~~
读取现状
→ 找最早语义分歧
→ 修通用机制
→ 重放
→ 做逐源语义审阅
→ 再找最早分歧
→ 再修
→ 全量回归
→ 重复
~~~

直到：

1. 本任务最终验收 Gate 全部通过；或
2. 发现一个无法在当前 v0.3.1 规范内解决、必须由 ADMIN 修改规范才能继续的真实阻塞。

除上述两种终点外，不得因为“一个阶段完成”“某轮测试通过”“某个 case 修好”而停止。

---

## 0. Repository / Branch / Baseline

Repository: joinwell52-AI/BoundaryXP

Branch: review/7plus1-parser

Starting implementation baseline: a61f8bd8e04e9f63cbeda38dc75a2979363f5d9d

023 implementation root:

research/7plus1-parser/v0.3-candidate-semantic-023/

Current key runtime files include:

~~~
frontend.mjs
candidates.mjs
coreference.mjs
expressions.mjs
model-evidence.mjs
gamma.mjs
engine.mjs
gates.mjs
proof.mjs
trace.mjs
server.mjs
~~~

Do not silently replace the 023 evidence. Preserve it as historical baseline.

Create a new implementation/research root for 024 using the repository's existing immutable-revision convention. Do not mutate 023 sealed evidence to make 024 appear successful.

---

## 1. Normative sources — read all before coding

Mandatory:

docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md

docs/BoundaryXP-7plus1-ADMIN-ROOT-BENCHMARK-CONTRACT-v1.md

docs/tasks/7plus1/7P-CANDIDATE-SEMANTIC-GRAPH-023.md

docs/reports/7plus1/7P-CANDIDATE-SEMANTIC-GRAPH-023/REPORT.md

Also read the 023 semantic evidence:

~~~
FINAL-REVIEW-SUMMARY.json
ROOT-SOURCE-REVIEW.json
FIRST-DIVERGENCE-r05.json
CANDIDATE-RELATION-AUDIT.json
NATIVE-RULE-BYPASS-AUDIT.json
GAMMA-DECISION-AUDIT.json
FULL-REGRESSION.json
~~~

The method is fixed:

~~~
T_admin --P--> Gc --Γ--> (Gb, Gu) --Q--> Root Canonical 7+1
~~~

Chinese interpretation:

~~~
ADMIN 自然语言
→ 自然语言语义解析
→ 候选结构化语义图
→ Γ 确定性认证
→ 已认证边界语义 + 类型化未决
→ Boundary IR
→ Root Canonical 7+1
~~~

This task does not authorize a different method.

---

## 2. Final objective

The objective is not “improve tests”.

The objective is:

Make the current BoundaryXP compiler materially capable of reading valid ADMIN Root natural-language tasks and compiling their explicit authority boundary into correct, traceable Root Canonical 7+1 under v0.3.1.

The primary development corpus is:

fixtures/7plus1/admin-root-standard-050-v1/CASES.md

The expected end state is:

~~~
50/50 source tasks:
- all explicit boundary-bearing source semantics accounted;
- no missing clear semantic node;
- no missing clear candidate relation/expression;
- no unsupported RESOLVED semantics;
- no wrong binding;
- no clear source fact left unresolved without a genuine ambiguity;
- no false ABSENT caused by parser omission;
- no operator/connective/helper token promoted as a business action;
- every final resolved entry has complete proof lineage;
- 7+1 matches the source meaning.
~~~

Because Standard-050 was originally source-only, do not falsely call this a pre-existing blind Gold accuracy score.

Instead, produce a complete source semantic closure adjudication ledger for all 50 cases and report:

ROOT_050_SOURCE_SEMANTIC_CLOSURE

separately from any Gold metric.

---

## 3. Current confirmed failures — starting point, not patch list

023 has already established that architecture routing is now real:

~~~
G1–G12 = PASS
relations_without_candidate = 0
certified_relations_without_gamma_decision = 0
native_rule_direct_certifications = 0
model_direct_certifications = 0
candidate_provenance_gaps = 0
~~~

Do not redo 023 merely to reproduce those numbers.

023 also established real semantic failures.

Earliest confirmed divergence:

~~~
ROOT-001
source: 操作系统
stage: SEMANTIC_NODE
NLP tokens exist
typed semantic endpoint does not exist in Gc
~~~

Additional confirmed classes include:

~~~
explicit scope members missing semantic nodes
explicit deliverables missing RESULT candidates
operator/helper token "请" incorrectly surviving as a resolved business action
historical whole-frame / artifact / content / role / reference/basis / scope mechanisms not fully migrated into active 023 candidate production
3 full-regression failures:
  REF-N1
  ROLE-P2
  ROLE-N2
~~~

These are examples of failure classes, not permission to hard-code their strings.

---

## 4. Long-task execution rule

This task deliberately authorizes repeated internal repair loops.

Codex must not ask for a new task after each first divergence.

Use this loop:

~~~
LOOP:
  1. run frozen mechanism tests
  2. run Root-050
  3. perform source-semantic audit
  4. identify earliest confirmed divergence class
  5. quantify all occurrences of that class across Root-050
  6. inspect code path/root cause
  7. implement one general mechanism repair
  8. add class-level positive + negative + mutation tests
  9. run focused tests
 10. rerun Root-050
 11. run full regression
 12. if final gates are not met:
       continue LOOP
~~~

Do not stop after step 8, 10, or 11 merely because that iteration improved results.

A repair iteration may modify multiple files when the first-divergence mechanism crosses module boundaries.

---

## 5. What Codex is authorized to change

Within this one long task, Codex may repair the semantic compiler path as required by first-divergence evidence.

Authorized areas include:

~~~
document/clause consumption
discourse-domain propagation
HanLP/spaCy signal consumption
typed recognizer adapters
span lattice construction
semantic node construction
event/predicate ownership
argument extraction
candidate relation generation
candidate expression generation
coreference candidate generation
artifact-role resolution
participant eligibility
reference/basis attachment
scope ownership
condition ownership
quantity target construction
candidate evidence attachment
BGE/E5 normalization evidence
NLI candidate verification
Γ checks when the candidate is correct but certification logic is wrong
Eligibility when certified semantics are correct but boundary qualification is wrong
Boundary IR construction when Eligibility is correct but IR is wrong
Projection only when Boundary IR is demonstrably correct and Q is wrong
proof / coverage / first-divergence instrumentation
~~~

This is one authorization envelope. Do not stop to request a new task simply because a later iteration reaches another one of these stages.

---

## 6. What remains frozen

Do not change the meaning of:

~~~
I
O
A
P
R
V
C
B
OPEN / CONSTRAINED / CLOSED
RESOLVED / UNRESOLVED / ABSENT / PARSER_COVERAGE_FAILURE
REQUIRED / PERMITTED / NOT_REQUIRED / FORBIDDEN
Authority
ADMIN Root contract
explicit WP rule
Boundary Fact types
Canonical 7+1 semantics
BXP 0.4 semantics
~~~

Do not redefine the problem to make implementation easier.

Do not weaken proof or coverage requirements.

Do not treat missing semantics as ABSENT.

---

## 7. Frontend semantic parsing — main work area

The current frontend must be made capable of turning NLP signals into a sufficiently complete candidate semantic structure.

The semantic frontend must generically recover, when explicitly present:

~~~
actors / participants
actions / events
objects / patients / themes
scope members
deliverables / results
recipients
references / normative basis
locations / environments
quantities / bounds
conditions
completion / stop conditions
prohibitions / restrictions
sequence / dependency
coreference
output-content semantics
artifact roles
participant roles
~~~

The frontend must not require the source text to use one exact verb or one exact sentence template.

---

## 8. Semantic node completeness

A source expression that clearly denotes a semantic participant/object/state/value/reference relevant to a boundary relation must not disappear merely because it is not a protected typed literal.

Example class:

~~~
范围包括操作系统、磁盘余量和关键服务进程
~~~

NLP already exposes nominal tokens and dependency structure.

The frontend must generically construct candidate semantic nodes for such noun phrases when syntax/discourse makes them boundary-bearing.

Do not solve this by adding:

~~~
操作系统
磁盘余量
关键服务进程
~~~

to a hard-coded entity list.

The mechanism must work for unseen noun phrases with equivalent grammatical/semantic roles.

Required tests include mutations that replace these nouns with unseen nouns.

---

## 9. Predicate / business-action ownership

Helper, modal, directive, structural and support tokens must not become independent business actions without evidence.

Examples of tokens/classes requiring correct ownership include:

~~~
请
由
根据
依据
包括
形成
需要
必须
应
可以
允许
不得
禁止
完成
停止
组织
进行
开展
执行
~~~

Their role is contextual.

Example:

~~~
请 PM 组织检查 X
~~~

must not automatically produce:

~~~
ACTION = 请
~~~

“组织” may be organization/accountability semantics rather than the domain action being requested.

Likewise:

~~~
形成 report.md
~~~

must preserve the production action and RESULT/deliverable relation.

Implement predicate ownership from NLP structure + semantic construction, not a list of case sentences.

Add negative tests proving directive/modal/operator tokens are not independently projected when they merely govern another predicate.

---

## 10. Candidate relation recall

After node construction, explicit source relations must have candidate hypotheses before Γ.

At minimum systematically cover:

~~~
AGENT
PATIENT
THEME
RESULT
RECIPIENT
LOCATION
BASIS
CONFORMS_TO
SCOPE_MEMBER
LIMIT
CONDITION_OF
COMPLETION_OF
STOP_OF
APPROVAL_OF
FORBIDS
RESTRICTS
COREFERENCE
CONJUNCTION
SEQUENCE
PART_OF
~~~

Do not require all candidates to be certified.

Recall belongs in candidate generation; precision belongs in Γ.

A missing candidate for an explicit clear source relation is a candidate-generation bug.

---

## 11. Candidate expressions

The long task must close real expression coverage, including:

~~~
scope sets
AND / OR / NOT
necessary vs sufficient completion conditions
conditional outputs
NOT_REQUIRED branches
quantity bounds
time bounds
retry bounds
condition ownership
approval gating
stop / resume gating
~~~

Expressions must have IDs and provenance before Γ.

Do not construct anonymous logic downstream to make Canonical output look correct.

---

## 12. Reuse / migrate prior generic mechanisms

023 report states that older whole-frame, artifact/content, role, reference/basis and scope mechanisms were not all migrated into the new active candidate producer.

This long task authorizes migration of generic mechanisms from historical implementations where they conform to v0.3.1.

For every migrated mechanism:

1. identify the old source file/function;
2. state the semantic invariant it provides;
3. adapt it to output Candidate nodes/relations/expressions;
4. remove or block any direct-certified relation path;
5. add candidate + Γ provenance tests;
6. verify no legacy reverse projection is introduced.

Do not copy final answers or fixture outputs from historical traces.

Do not import mechanisms that conflict with current ADMIN Root semantics.

---

## 13. Model roles remain evidence roles

Use real models already frozen in the repository/runtime.

HanLP / spaCy:

linguistic structure and semantic-role evidence

BGE-M3:

semantic normalization / candidate ranking evidence

multilingual-E5-large:

secondary semantic cross-check evidence

mDeBERTa-MNLI-XNLI:

verification of already constructed candidate propositions

Do not let model scores directly create final slots or Authority.

However, do not reduce model calls to decorative logging.

Where semantic normalization uncertainty materially affects candidate interpretation, the evidence must actually participate in Γ or typed-unresolved decisions according to the normative method.

Report exactly where model evidence changed a candidate's support state or helped preserve ambiguity.

---

## 14. Γ is not presumed correct

023 proved that Γ is structurally in the path. It did not prove every Γ semantic decision is correct.

Example already observed:

~~~
candidate predicate = 请
Γ = CERTIFIED
~~~

If the candidate itself is semantically invalid, fix candidate generation first.

If a correct candidate reaches Γ but Γ incorrectly certifies/rejects/unresolves it, repair Γ at the relevant general constraint.

Do not modify Γ to compensate for missing nodes/candidates.

Every Γ change must have:

~~~
positive case
negative case
competing-candidate case where relevant
mutation case
~~~

---

## 15. Eligibility / Boundary IR / Projection discipline

Use strict first-divergence.

Only modify Eligibility when:

~~~
semantic nodes correct
candidate graph correct
Γ decision correct
but boundary qualification is wrong
~~~

Only modify Boundary IR when:

~~~
Eligibility correct
but fact construction / expression binding is wrong
~~~

Only modify Projection Q when:

~~~
Boundary IR is semantically correct
but final I/O/A/P/R/V/C/B is wrong
~~~

Do not use downstream layers to hide upstream parsing failures.

---

## 16. Root-050 complete source-semantic adjudication

For every one of the 50 cases, produce an auditable ledger containing at minimum:

~~~
case_id
source
explicit boundary-bearing spans
expected semantic node/relationship meaning derived from source
actual candidate nodes
actual candidate relations
actual expressions
Γ decisions
Eligibility decisions
Boundary Facts
Canonical 7+1
wrong bindings
unsupported RESOLVED
clear-source unresolved
missing source semantics
proof lineage status
case closure status
~~~

This is not a template lookup used by runtime.

It is an offline acceptance review.

Runtime must never import this ledger.

A case may be marked closed only if all explicit source boundary semantics are accounted for and the final Canonical 7+1 is source-equivalent.

---

## 17. Root-050 final closure gates

Final Standard-050 requirements:

~~~
root_cases_total = 50
root_cases_source_semantically_closed = 50

cases_with_missing_semantic_nodes = 0
cases_with_missing_clear_candidates = 0
cases_with_wrong_binding = 0
cases_with_unsupported_RESOLVED = 0
cases_with_clear_source_unresolved = 0
cases_with_false_ABSENT = 0
cases_with_operator_as_business_action = 0
cases_with_proof_gap = 0
cases_with_source_accountability_gap = 0
~~~

Genuine ambiguity is allowed only where the source itself is materially ambiguous.

Do not label a parser limitation as source ambiguity.

---

## 18. Old 018 / 021 role

Historical 018 / 021 remain regression/diagnostic evidence, not the primary Root metric.

The three existing full-regression failures:

~~~
REF-N1
ROLE-P2
ROLE-N2
~~~

must end at 0 full-regression failures.

Do not:

~~~
delete tests
skip tests
weaken assertions
rename failures away
special-case test IDs
~~~

Repair them only through general semantic mechanisms consistent with v0.3.1.

If one of these tests is provably inconsistent with the current normative method, document the exact contradiction with source/spec evidence. Do not change it silently. Such a contradiction is a legitimate ADMIN_BLOCKED end state.

---

## 19. Corrected Natural-100 holdout

After Root-050 closure and before any tuning on this corpus, run:

fixtures/7plus1/admin-root-natural-100-v1/CASES.md

This corpus includes deliberate ambiguity controls.

Rules:

1. freeze the 024 implementation before the first Natural-100 run;
2. preserve the first-run outputs immutably;
3. do not modify implementation after seeing Natural-100 output within this task;
4. perform read-only source-semantic diagnostics;
5. report:
   - clear-source semantic misses;
   - unsupported RESOLVED;
   - wrong binding;
   - correct typed unresolved for ambiguity controls;
   - coverage/proof gaps.

Because the benchmark source set was created source-only and no pre-existing frozen Gold is assumed here, do not fabricate a blind accuracy number.

The Natural-100 first run is a generalization holdout diagnostic.

If it exposes failures, report them for ADMIN review. Do not reopen implementation in this task after first holdout observation.

This protects the value of the holdout.

---

## 20. Anti-overfitting requirements

No runtime code may contain:

~~~
ROOT-001 ... ROOT-050 IDs
018/021 case IDs
exact full benchmark sentences
expected slot arrays
expected Canonical values
benchmark filenames used as semantic selectors
specific person/file/entity literals solely because a case failed
~~~

Class-level lexical resources are allowed only when they represent stable language/semantic categories and are validated with unseen mutations.

For every new lexical primitive, show:

~~~
why it is a language/semantic class
positive unseen example
negative contrast
mutation test
~~~

Prefer syntax/structure/type evidence over adding more verb strings where feasible.

---

## 21. Mutation and contrast testing

Every repaired class must have mutations.

Examples:

~~~
replace object noun
replace filename
replace person/role
replace reference ID
swap Chinese synonym
use English equivalent
change active/passive form
move condition before/after main clause
replace AND with OR
replace REQUIRED with NOT_REQUIRED
replace FORBIDDEN with PERMITTED
~~~

The repaired mechanism passes only if it survives semantic-equivalent mutations and rejects semantic contrasts.

---

## 22. First-divergence ledger

Maintain a long-run ledger for every repair iteration:

~~~
iteration
corpus
case
earliest_stage
source_span
expected semantic observation
actual observation
root cause
mechanism class
changed files
focused tests
Root-050 before/after counts
full regression before/after
~~~

Stage order:

~~~
STRUCTURE
NLP_SIGNAL
SPAN_LATTICE
SEMANTIC_NODE
CANDIDATE_GENERATION
CANDIDATE_EXPRESSION
EVIDENCE_ATTACHMENT
GAMMA_CERTIFICATION
ELIGIBILITY
BOUNDARY_IR
PROJECTION
PROOF
COVERAGE
~~~

Only repair the earliest confirmed divergence class for that iteration.

After it is repaired, recompute the earliest divergence across the corpus.

---

## 23. No intermediate ADMIN stop

This is the core long-task rule.

Do not stop and return:

~~~
SEMANTIC_NODE_FIXED
CANDIDATE_GENERATION_FIXED
ROOT_001_PASS
25/50 improved
GAMMA_PASS
~~~

as the final task result.

Those are internal progress markers only.

Continue automatically within this authorized task.

The only valid final states are:

~~~
A. ADMIN_ROOT_COMPILER_024_LONG=PASS
~~~

or

~~~
B. ADMIN_ROOT_COMPILER_024_LONG=ADMIN_BLOCKED
~~~

where ADMIN_BLOCKED requires one precise normative/spec contradiction that cannot be solved by implementation without changing the authoritative method.

“More work remains” is not itself a valid reason to stop.

---

## 24. Full regression

Run the full regression repeatedly during development as needed.

Final gate:

~~~
full_regression_failures = 0
~~~

Skipped tests must be listed and remain 17 or fewer unless an existing skipped test is legitimately enabled.

Do not count SKIP as PASS.

Do not hide flaky or historical failures.

---

## 25. Candidate architecture gates remain mandatory

023's no-bypass architecture must remain intact throughout 024.

Final values:

~~~
NLP_DIRECT_TO_CANONICAL_SLOT = 0
NLP_DIRECT_TO_BOUNDARY_FACT = 0
NATIVE_RULE_DIRECT_TO_CERTIFIED_RELATION = 0
MODEL_DIRECT_TO_CERTIFIED_RELATION = 0

EVERY_CERTIFIED_RELATION_HAS_CANDIDATE = PASS
EVERY_REJECTED_RELATION_HAS_CANDIDATE = PASS
EVERY_TYPED_UNRESOLVED_RELATION_HAS_CANDIDATE = PASS
EVERY_CANDIDATE_HAS_SOURCE_PROVENANCE = PASS
EVERY_CERTIFIED_RELATION_HAS_GAMMA_DECISION = PASS
CANDIDATE_SEMANTIC_GRAPH_IS_RUNTIME_OBJECT = PASS
GAMMA_CONSUMES_CANDIDATE_SEMANTIC_GRAPH = PASS
CANONICAL_PROJECTION_CONSUMES_ONLY_CERTIFIED_BOUNDARY_SEMANTICS = PASS
~~~

If semantic accuracy improves by breaking these gates, the task fails.

---

## 26. Required final evidence

Create a new immutable report directory under:

docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/

At minimum:

~~~
REPORT.md
BASELINE-023-AUDIT.md
IMPLEMENTATION-MAP.md
LONG-RUN-ITERATION-LEDGER.json
ROOT-050-SOURCE-SEMANTIC-LEDGER.json
ROOT-050-CLOSURE-MATRIX.json
ROOT-050-FIRST-DIVERGENCE-HISTORY.json
SEMANTIC-NODE-AUDIT.json
CANDIDATE-RECALL-AUDIT.json
PREDICATE-OWNERSHIP-AUDIT.json
EXPRESSION-AUDIT.json
COREFERENCE-AUDIT.json
MODEL-EVIDENCE-AUDIT.json
GAMMA-AUDIT.json
ELIGIBILITY-AUDIT.json
BOUNDARY-IR-AUDIT.json
PROJECTION-AUDIT.json
PROOF-COVERAGE-AUDIT.json
ANTI-OVERFIT-AUDIT.json
MUTATION-TESTS.json
NATURAL-100-FIRST-RUN.json
NATURAL-100-DIAGNOSTIC.json
FULL-REGRESSION.json
GATES.json
MANIFEST.json
SHA256SUMS.txt
SEAL.json
SEAL-VERIFICATION.json
~~~

Preserve raw logs and actual parser traces referenced by these reports.

---

## 27. Required final report numbers

Report at least:

~~~
Root-050:
  total
  source_semantically_closed
  missing_semantic_node
  missing_clear_candidate
  wrong_binding
  unsupported_RESOLVED
  clear_source_unresolved
  correct_typed_unresolved
  false_ABSENT
  operator_as_business_action
  proof_gap
  source_accountability_gap

Architecture:
  candidate_nodes
  candidate_relations
  candidate_expressions
  certified_relations
  rejected_relations
  typed_unresolved_relations
  relations_without_candidate
  certified_relations_without_gamma_decision
  native_rule_direct_certifications
  model_direct_certifications
  candidate_provenance_gaps

Regression:
  tests
  pass
  fail
  skip

Natural-100 first holdout:
  runtime_errors
  confirmed_clear_source_misses
  unsupported_RESOLVED
  wrong_binding
  correct_ambiguity_unresolved
  proof_or_coverage_gaps
~~~

Do not replace these with “mechanism tests pass”.

---

## 28. Final PASS criteria

Only declare:

ADMIN_ROOT_COMPILER_024_LONG=PASS

when all of the following are true:

~~~
A. Root-050 source_semantically_closed = 50/50

B. Root-050:
   missing_semantic_node = 0
   missing_clear_candidate = 0
   wrong_binding = 0
   unsupported_RESOLVED = 0
   clear_source_unresolved = 0
   false_ABSENT = 0
   operator_as_business_action = 0
   proof_gap = 0
   source_accountability_gap = 0

C. candidate architecture gates all PASS

D. full_regression_failures = 0

E. no benchmark-specific runtime hard-coding

F. all repaired mechanisms have mutation/contrast evidence

G. Natural-100 first-run output is frozen and honestly reported

H. no merge / release / tag / production switch
~~~

Natural-100 is a holdout diagnostic in this task and does not authorize post-observation tuning.

Do not claim:

~~~
BOUNDARYXP_PRODUCTION_READY=true
GENERAL_NATURAL_LANGUAGE_SOLVED=true
~~~

This task validates ADMIN Root compiler closure on Standard-050 plus a protected Natural-100 diagnostic, not all human language.

---

## 29. ADMIN_BLOCKED criteria

ADMIN_ROOT_COMPILER_024_LONG=ADMIN_BLOCKED

is allowed only if Codex identifies a precise contradiction such as:

~~~
the same source semantics are required to map to two incompatible normative meanings
a frozen test requirement contradicts v0.3.1
a required relation cannot be represented by the frozen relation/IR contract
a required source distinction cannot be expressed without changing the normative schema
~~~

The final report must include:

~~~
exact source span
exact normative clauses
exact code/contract limitation
why a general implementation repair cannot solve it
minimal ADMIN decision required
~~~

Performance inconvenience, implementation difficulty, large workload, or “more cases remain” are not ADMIN_BLOCKED.

---

## 30. Commit / push / stop rule

Work only on:

review/7plus1-parser

Codex may make internal checkpoints/commits during the long run if useful.

Final requirements:

1. push all authorized 024 work to review/7plus1-parser;
2. preserve prior sealed evidence;
3. do not merge;
4. do not tag;
5. do not release;
6. do not switch production entry;
7. return final commit hash;
8. return exact final Gate numbers;
9. return final report path;
10. stop at WAITING_ADMIN_REVIEW.

Do not automatically start 025.

---

## 31. One-sentence execution instruction

从 023 当前真实实现出发，不再按 case 打补丁，不再按阶段停工；持续按最早语义分歧修通用自然语言编译机制，直到 Standard-050 的 ADMIN Root 语义 50/50 闭合、架构旁路仍为 0、全量回归 0 FAIL，并冻结 Natural-100 首次泛化诊断；否则只有发现必须修改规范的真实矛盾时才允许以 ADMIN_BLOCKED 结束。
