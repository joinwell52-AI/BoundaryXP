# 7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG

## Status

ADMIN AUTHORIZED — LONG-RUN GENERALIZATION TASK

本任务是一个持续闭环长任务，不是阶段任务。

不得在“修完一个 case”“修完一个类别”“某轮测试通过”“Natural-100 有明显提升”时停止。

Codex 必须持续执行：

~~~
Natural-100 全量诊断
→ 聚类最早语义分歧
→ 修通用机制
→ mutation / contrast 验证
→ Root-050 回归
→ Natural-100 全量重放
→ 全量回归
→ 再聚类
→ 再修
→ 直到开发集闭环
→ 冻结实现
→ 生成并封存 post-freeze Blind-200
→ 只运行一次 Blind-200
→ 最终判定
~~~

本任务只允许以下最终状态：

~~~
NATURAL_GENERALIZATION_025_LONG=PASS
NATURAL_GENERALIZATION_025_LONG=EVAL_FAILED
NATURAL_GENERALIZATION_025_LONG=ADMIN_BLOCKED
~~~

“还有一些问题”“本轮有所提升”“先等 ADMIN 再继续”不是合法的中间终点。

---

## 0. Repository / Branch / Baseline

Repository:
joinwell52-AI/BoundaryXP

Branch:
review/7plus1-parser

Starting baseline:
43d51d2727ceff7796d5f2adeb823d29df7c5466

024 implementation root:
research/7plus1-parser/v0.3-admin-root-024/

024 report:
docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/REPORT.md

Do not rewrite or replace 024 sealed evidence.

Create a new immutable 025 implementation/research root following repository conventions.

---

## 1. Mandatory authoritative documents

Read in full before coding:

docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md

docs/BoundaryXP-7plus1-ADMIN-ROOT-BENCHMARK-CONTRACT-v1.md

docs/tasks/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG.md

docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/REPORT.md

docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/NATURAL-100-FIRST-RUN.json

docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/NATURAL-100-DIAGNOSTIC.json

docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/ANTI-OVERFIT-AUDIT.json

The fixed method remains:

~~~
ADMIN natural language
→ NLP / Typed Recognizers
→ Semantic Nodes
→ Candidate Relations / Candidate Expressions
→ Candidate Semantic Graph Gc
→ Γ deterministic certification
→ Eligibility
→ Boundary IR
→ deterministic Canonical 7+1
→ Proof / Coverage
~~~

Do not redesign 7+1.
Do not redesign BXP.
Do not bypass CandidateSemanticGraph.
Do not turn the parser into an LLM answer generator.

---

## 2. Why 025 exists

024 proved:

~~~
Root-050 source semantic closure = 50/50
G1–G12 = PASS
direct certification bypass = 0
full regression = 0 FAIL
~~~

But protected Natural-100 exposed large generalization failures:

~~~
total = 100
runtime_errors = 0
confirmed_clear_source_misses = 78 cases
unsupported_RESOLVED = 30 cases
wrong_binding = 32 cases
ambiguity_controls = 5
correct_ambiguity_unresolved = 1
proof_or_coverage_gaps = 15 cases
~~~

The first confirmed divergence is already known:

~~~
NROOT-001
stage = CANDIDATE_GENERATION
problem =
  organization/accountability predicate admitted as independent business action
  QA independent review / participant candidates missing
later =
  Γ wrongly accepts unsupported semantics
~~~

Therefore 025 is not an architecture-repair task.

It is a semantic-generalization task.

---

## 3. Final objective

Make BoundaryXP robustly compile natural ADMIN Root task language into the correct candidate semantic graph and conservative 7+1 boundary result across paraphrase, clause variation, role variation, modality, condition, quantity, reference, coreference, English and mixed-language input.

025 must first close the already exposed Natural-100 development corpus, then prove that the resulting mechanisms survive a new post-freeze generated holdout without post-observation tuning.

---

## 4. Natural-100 changes role

The following corpus is no longer a blind holdout:

fixtures/7plus1/admin-root-natural-100-v1/CASES.md

It is now an authorized 025 development and diagnostic corpus.

Codex may inspect all 100 cases and their 024 diagnostics.

However:

- do not patch individual NROOT IDs;
- do not copy expected final slot values into runtime;
- do not add exact source sentences to runtime;
- do not use a benchmark filename as a semantic switch;
- do not create a phrase rule just because one case failed.

Natural-100 must be repaired by general semantic mechanisms only.

---

## 5. Eight confirmed generalization classes

Start from the 024 diagnostic classes:

~~~
1. TASK_REQUIREMENT_MODALITY_PROPAGATION
2. SUPPORT_AND_ORGANIZATION_PREDICATE_OWNERSHIP
3. LOCAL_NOUN_ARGUMENT_AND_ARTIFACT_DOMAIN
4. CONDITION_APPROVAL_AND_COMPLETION_BINDING
5. NEGATIVE_NOMINAL_AND_PASSIVE_MODALITY
6. TYPED_QUANTITY_TARGET_AND_OUTPUT_CONTENT
7. PARTICIPANT_NEGATIVE_ROLE_AND_REFERENT_ACCOUNTABILITY
8. MIXED_LANGUAGE_SCOPE_AND_COVERAGE
~~~

These are starting classes, not a frozen taxonomy.

If first-divergence analysis proves two classes share one root cause, consolidate them.

If a genuinely new general mechanism class appears, add it with evidence.

Do not create one mechanism class per failing case.

---

## 6. Required semantic mechanism architecture

025 must converge toward a small set of reusable semantic mechanisms.

### A. Predicate Ownership / Event Composition

Decide whether a token is:

~~~
business predicate
support predicate
organization/accountability predicate
directive/operator
modal auxiliary
condition/completion operator
quoted/content predicate
nominalized predicate
~~~

Examples such as:

~~~
请
负责
组织
进行
开展
要求
安排
完成
形成
批准
允许
需要
必须
~~~

must be interpreted contextually.

No token is a business action merely because it is in a verb list.

### B. Argument / Participant / Artifact Binding

Recover generic roles:

~~~
AGENT
PATIENT
THEME
RESULT
RECIPIENT
LOCATION
SCOPE_MEMBER
BASIS
~~~

including:

~~~
active
passive
由/by
对/针对
向/to
elliptical shared arguments
coordinated predicates
coordinated objects
local noun arguments
artifact references
role + person
negative role declarations
~~~

### C. Modality / Polarity Propagation

Handle:

~~~
REQUIRED
PERMITTED
NOT_REQUIRED
FORBIDDEN
~~~

across:

~~~
本次任务要求...
必须...
无需...
不得...
不要求...
只有...才...
if / unless / must not / need not
~~~

The modal owner and propagation domain must be explicit.

### D. Condition / Completion / Approval Binding

Recover:

~~~
CONDITION_OF
COMPLETION_OF
APPROVAL_OF
STOP_OF
SEQUENCE
AND / OR / NOT
~~~

without flattening condition clauses into independent actions.

### E. Quantity / Resource / Output-content Semantics

Recover target ownership for:

~~~
duration
count
retry
threshold
percentage
size
resource bounds
document required content
required sections
output-content conditions
~~~

### F. Coreference / Discourse Accountability

Handle:

~~~
该 / 此 / 其 / 上述 / 前述
it / this / that / these / those
report/result/task/config/service references
participant/accountability references
multiple antecedents
genuine ambiguity
~~~

Do not silently retire UNKNOWN_REFERENT to ordinary ENTITY when resolution is not justified.

### G. Cross-lingual Normalization

Chinese, English and mixed identifiers must preserve the same semantic contracts.

Mixed-language text is not a separate shortcut path.

### H. Conservative Γ Adjudication

Γ must reject or preserve typed unresolved when evidence is insufficient.

Candidate recall may be broad.
Final resolved semantics must be conservative.

---

## 7. No rule-pile growth

024 already contains many narrow implementation modules.

025 must not respond to Natural-100 by simply adding dozens of one-off lexical or construction files.

Before adding a new runtime mechanism, record:

~~~
What semantic invariant does this mechanism implement?
Which failure class does it address?
Why existing generic mechanisms cannot represent it?
Which unseen mutations prove it is generic?
~~~

Consolidation/refactoring of overlapping 024 mechanisms is authorized where it preserves semantics and improves generality.

No target file-count reduction is required.

The requirement is semantic consolidation, not cosmetic refactoring.

---

## 8. Candidate generation policy

Candidate generation must prefer recall.

If explicit source semantics plausibly support multiple typed relations, preserve competing candidates with provenance.

Do not force an early single answer.

Each candidate must retain:

~~~
source spans
NLP token/dependency/SRL support
typed recognizer support
discourse domain
scope ownership candidates
modality owner candidates
coreference candidates
semantic normalization evidence where used
NLI evidence where used
~~~

The final relation may be:

~~~
CERTIFIED
REJECTED
TYPED_UNRESOLVED
~~~

but no final relation may exist without an originating candidate.

---

## 9. Model evidence must become useful, not decorative

Keep model roles unchanged:

HanLP / spaCy:
linguistic structure

BGE-M3:
semantic normalization / candidate ranking evidence

multilingual-E5-large:
secondary semantic cross-check

mDeBERTa-MNLI-XNLI:
candidate proposition verification

mDeBERTa-v3-base:
do not use as a classifier unless an independently justified trained checkpoint exists

LLM:
not part of parser runtime

For 025:

- model evidence must not write 7+1 slots;
- model evidence must not directly certify a relation;
- model evidence must not exist only in logs.

Where candidates genuinely compete, record whether BGE/E5/NLI evidence changed candidate support, candidate ranking, abstention, or Γ unresolved/reject decisions.

If model evidence never changes any decision, report that fact instead of pretending it contributed.

---

## 10. Natural-100 long-run development loop

Run repeated internal iterations until Natural-100 development closure is reached.

Each iteration:

~~~
1. replay all 100 cases
2. compute source-semantic diagnostics
3. identify earliest divergence class across corpus
4. count all cases affected by that mechanism
5. inspect shared root cause
6. implement generic repair
7. add positive tests
8. add negative tests
9. add mutation-equivalent tests
10. add semantic-contrast tests
11. rerun affected cases
12. rerun all Natural-100
13. rerun Root-050
14. rerun architecture gates
15. rerun full regression
16. continue automatically if any development gate remains open
~~~

Do not stop between iterations for ADMIN approval.

---

## 11. Natural-100 development PASS gate

Before the implementation may be frozen for final evaluation:

~~~
Natural-100 total = 100
runtime_errors = 0

source_semantically_closed = 100/100

confirmed_clear_source_misses = 0
unsupported_RESOLVED = 0
wrong_binding = 0
false_ABSENT = 0
operator_or_support_predicate_as_false_business_action = 0
clear_source_unresolved = 0
proof_gaps = 0
coverage_gap_cases = 0

ambiguity_controls = 5
correct_typed_ambiguity_unresolved = 5/5
~~~

For ambiguity controls, a correct result is not merely “something is unresolved”.

The unresolved item must preserve the correct semantic alternatives and the correct reason for ambiguity.

---

## 12. Root-050 preservation gate

The 024 Standard Root corpus remains a strict regression gate:

~~~
Root-050 source_semantically_closed = 50/50
missing_semantic_node = 0
missing_clear_candidate = 0
wrong_binding = 0
unsupported_RESOLVED = 0
clear_source_unresolved = 0
false_ABSENT = 0
operator_as_business_action = 0
proof_gap = 0
source_accountability_gap = 0
~~~

Natural-100 improvement may not regress Root-050.

---

## 13. Architecture gates remain frozen

All no-bypass gates remain mandatory:

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

Semantic gains obtained by violating these gates are invalid.

---

## 14. Full regression gate

Final development freeze requires:

~~~
full_regression_failures = 0
~~~

Do not delete tests, skip new failures, weaken assertions, exclude old suites, or convert FAIL to warning.

SKIP count must be reported exactly.

---

## 15. Mutation / metamorphic suite

Each general repair must be tested with semantic-equivalent mutations and semantic contrasts.

At minimum vary:

~~~
noun / object
artifact filename
person / role
reference identifier
verb synonym
support-verb form
active / passive
Chinese / English
mixed identifier
condition position
condition connector
AND / OR
REQUIRED / PERMITTED / NOT_REQUIRED / FORBIDDEN
quantity value
quantity unit
recipient
coreference surface
~~~

Metamorphic expectations should be expressed at semantic graph / Boundary IR level where possible, not only final display-string equality.

---

## 16. Build a protected post-freeze Blind-200 generator before parser tuning

Before modifying 025 parser runtime, create and freeze a generator contract for later Blind-200 evaluation.

The generator must construct an abstract semantic frame first, then realize natural-language text from that frame.

Expected semantics must derive from the abstract frame, not from parsing the generated text.

The generator must be frozen before 025 parser tuning begins.

Required coverage:

~~~
200 total cases

language distribution:
  Chinese = 80
  English = 60
  mixed Chinese/English = 60

genuine ambiguity controls:
  at least 20 cases, distributed across language groups

mechanism coverage, categories may overlap:
  support / organization predicate ownership >= 40
  modality / polarity >= 50
  condition / approval / completion >= 50
  quantity / resource / content >= 40
  participant / artifact / role binding >= 50
  coreference / discourse >= 40
  passive / nominal constructions >= 40
  coordinated predicates / objects >= 40
~~~

The generator must use unseen combinations and variable lexical inventories.

It must not copy Root-050 or Natural-100 full sentences.

It must not include parser outputs or expected Canonical strings as runtime selectors.

---

## 17. Blind-200 materialization rule

Do not materialize the exact 200 cases before the 025 implementation is frozen.

After all development gates pass:

1. freeze 025 runtime implementation;
2. record implementation tree SHA-256;
3. record generator SHA-256;
4. derive deterministic seed from:

~~~
SHA256(
  "BOUNDARYXP-025-BLIND-200"
  + implementation_freeze_sha256
  + generator_sha256
)
~~~

5. materialize the exact 200 source tasks from that seed;
6. seal source + abstract semantic frames + expected boundary semantics;
7. run parser exactly once on all 200;
8. save raw output before evaluation;
9. perform evaluation;
10. do not modify parser/runtime/generator after seeing Blind-200 outputs.

This is a post-freeze generative holdout.

It is not claimed to replace an independent human-authored external benchmark.

---

## 18. Blind-200 semantic evaluation

Evaluate against the pre-generated abstract semantic frames.

For every case report:

~~~
semantic node recall
candidate relation recall
candidate expression recall
wrong binding
unsupported RESOLVED
clear-source unresolved
ambiguity correctness
Boundary IR equivalence
Canonical 7+1 equivalence
proof lineage
coverage accountability
~~~

Do not reduce evaluation to “program ran”.

---

## 19. Blind-200 PASS gate

025 may declare PASS only if:

~~~
Blind-200 runtime_errors = 0

clear cases:
  semantic closure = 180/180

ambiguity controls:
  correct typed unresolved = 20/20

missing clear semantic nodes = 0
missing clear candidates = 0
wrong_binding = 0
unsupported_RESOLVED = 0
false_ABSENT = 0
operator/support false business action = 0
proof_gap = 0
coverage_gap = 0

architecture gates = PASS
~~~

If Blind-200 fails any semantic gate:

~~~
NATURAL_GENERALIZATION_025_LONG=EVAL_FAILED
~~~

and stop.

Do not tune on Blind-200 inside 025 after seeing its results.

The failed Blind-200 becomes future development evidence only in a later ADMIN-authorized task.

---

## 20. Anti-overfitting audit

Runtime must contain none of:

~~~
NROOT-001 ... NROOT-100 selectors
ROOT-001 ... ROOT-050 selectors
Blind-200 case IDs
exact benchmark sentences
expected final slot arrays
expected Canonical display strings
fixture lookup
Gold lookup
source-semantic ledger lookup
case-specific person/file/reference literals
~~~

For any lexical resource added in 025, report:

~~~
semantic/language class
why required
positive examples
negative examples
unseen mutations
cases affected
~~~

---

## 21. First-divergence discipline

Use the existing stage order:

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

Repair the earliest shared divergence.

Do not modify Γ when the candidate is wrong.
Do not modify Eligibility when Γ is wrong.
Do not modify Boundary IR when Eligibility is wrong.
Do not modify Projection when Boundary IR is wrong.

---

## 22. Required 025 evidence

Create:

docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/

At minimum include:

~~~
REPORT.md
BASELINE-024-AUDIT.md
IMPLEMENTATION-MAP.md
GENERALIZATION-CLASS-MATRIX.json
LONG-RUN-ITERATION-LEDGER.json
NATURAL-100-SOURCE-SEMANTIC-LEDGER.json
NATURAL-100-CLOSURE-MATRIX.json
NATURAL-100-FIRST-DIVERGENCE-HISTORY.json
PREDICATE-OWNERSHIP-AUDIT.json
ARGUMENT-BINDING-AUDIT.json
MODALITY-POLARITY-AUDIT.json
CONDITION-COMPLETION-AUDIT.json
QUANTITY-CONTENT-AUDIT.json
COREFERENCE-DISCOURSE-AUDIT.json
MIXED-LANGUAGE-AUDIT.json
MODEL-EVIDENCE-AUDIT.json
GAMMA-AUDIT.json
BOUNDARY-IR-AUDIT.json
PROOF-COVERAGE-AUDIT.json
MUTATION-METAMORPHIC-AUDIT.json
ANTI-OVERFIT-AUDIT.json
ROOT-050-PRESERVATION.json
ARCHITECTURE-GATES.json
FULL-REGRESSION.json

BLIND-200-GENERATOR-CONTRACT.md
BLIND-200-GENERATOR-FREEZE.json
IMPLEMENTATION-FREEZE.json
BLIND-200-SEED.json
BLIND-200-SOURCE.json
BLIND-200-FRAMES.json
BLIND-200-FIRST-RUN.json
BLIND-200-EVALUATION.json

MANIFEST.json
SHA256SUMS.txt
SEAL.json
SEAL-VERIFICATION.json
~~~

Raw traces and logs must be preserved and referenced.

---

## 23. Required final numbers

Final report must include:

~~~
Natural-100:
  total
  source_semantically_closed
  clear_source_misses
  unsupported_RESOLVED
  wrong_binding
  false_ABSENT
  clear_source_unresolved
  operator/support false business action
  ambiguity_controls
  correct_ambiguity_unresolved
  proof_gap
  coverage_gap

Root-050:
  source_semantically_closed
  semantic regression counts

Architecture:
  candidate_nodes
  candidate_relations
  candidate_expressions
  certified_relations
  rejected_relations
  typed_unresolved_relations
  relations_without_candidate
  certified_relations_without_gamma_decision
  direct certification counts
  provenance gaps

Models:
  BGE calls
  E5 calls
  NLI calls
  number of candidate decisions materially affected by model evidence

Full regression:
  tests
  pass
  fail
  skip

Blind-200:
  clear cases
  ambiguity controls
  semantic closure
  wrong_binding
  unsupported_RESOLVED
  false_ABSENT
  missing candidates
  ambiguity correctness
  proof_gap
  coverage_gap
~~~

---

## 24. Final PASS criteria

Only declare:

NATURAL_GENERALIZATION_025_LONG=PASS

when all are true:

~~~
A. Natural-100 source semantic closure = 100/100

B. Natural-100:
   clear_source_misses = 0
   unsupported_RESOLVED = 0
   wrong_binding = 0
   false_ABSENT = 0
   clear_source_unresolved = 0
   operator/support false business action = 0
   ambiguity controls correct = 5/5
   proof_gap = 0
   coverage_gap = 0

C. Root-050 remains 50/50

D. G1–G12 and all no-bypass gates remain PASS

E. full regression = 0 FAIL

F. no benchmark-specific runtime hardcoding

G. mutation/metamorphic suite PASS

H. Blind-200 is generated only after implementation freeze

I. Blind-200 clear semantic closure = 180/180

J. Blind-200 ambiguity correctness = 20/20

K. Blind-200 wrong_binding / unsupported_RESOLVED / false_ABSENT /
   proof_gap / coverage_gap = 0

L. no parser modification after Blind-200 observation

M. no merge / release / tag / production switch
~~~

PASS means BoundaryXP has strong evidence of semantic generalization across the tested ADMIN Root language families.

PASS does not mean all human natural language solved, production ready, or all domains solved.

---

## 25. EVAL_FAILED criteria

If development gates pass but post-freeze Blind-200 fails any semantic gate:

~~~
NATURAL_GENERALIZATION_025_LONG=EVAL_FAILED
~~~

Required final report:

~~~
exact failing Blind-200 cases
earliest divergence per failing mechanism class
aggregate failure counts
whether failures are misses / false positives / wrong bindings / ambiguity failures
no post-holdout code changes
~~~

Stop at WAITING_ADMIN_REVIEW.

Do not automatically begin 026.

---

## 26. ADMIN_BLOCKED criteria

ADMIN_BLOCKED is allowed only for a real normative contradiction that cannot be solved without changing authoritative semantics.

Implementation difficulty, runtime cost, many remaining failures, or lack of time are not ADMIN_BLOCKED.

---

## 27. Production boundary

Do not change production entry.
Do not change npm production scripts to 025.
Do not merge to main.
Do not tag.
Do not release.
Do not claim BOUNDARYXP_PRODUCTION_READY=true.

025 is semantic generalization validation.

---

## 28. Commit / push / stop

Work only on:
review/7plus1-parser

Final response must return:

~~~
final commit hash
final task state
Natural-100 numbers
Root-050 numbers
G1–G12
full regression
Blind-200 numbers
model-evidence contribution count
report path
seal verification result
~~~

Push only to review/7plus1-parser.

Stop at WAITING_ADMIN_REVIEW.

Do not start 026.

---

## 29. One-sentence execution instruction

从 024 已正确的 Candidate Graph → Γ → Boundary IR → 7+1 流程出发，把 Natural-100 暴露出的 8 类自然语言泛化缺口收敛为少量通用语义机制，持续修到 Natural-100 100/100、Root-050 50/50、全量回归 0 FAIL；随后冻结实现，用冻结前已定义的抽象语义帧生成器按冻结摘要派生 Blind-200，首次运行后禁止再改代码，只有 Blind-200 的 180 条明确任务全部闭环且 20 条真实歧义全部正确保持 typed unresolved 时，才允许声明 NATURAL_GENERALIZATION_025_LONG=PASS。
