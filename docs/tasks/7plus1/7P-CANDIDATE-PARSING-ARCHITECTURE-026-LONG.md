# 7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG

## Status

ADMIN AUTHORIZED — LONG-RUN IMPLEMENTATION CORRECTION

本任务修复的是 **025 对 v0.3.1 方法的实现偏离**。

不是重新设计 7+1。
不是重新设计 Candidate Semantic Graph。
不是新增一层语义架构。
不是继续按 Blind-200 case 打补丁。
不是继续堆构式模块。

本任务唯一目标：

> 把现有程序真正改成手册规定的：
>
> 自然语言证据 → 开放候选 → Candidate Semantic Graph → Γ 唯一最终裁决 → Boundary IR → 7+1

本任务是长任务。不得在“某模块完成”“某批测试通过”“某语料闭合”时中止。

最终只允许：

CANDIDATE_PARSING_ARCHITECTURE_026_LONG=PASS

或：

CANDIDATE_PARSING_ARCHITECTURE_026_LONG=ADMIN_BLOCKED

其中 ADMIN_BLOCKED 只允许真实规范冲突，不允许以实现困难、工作量大、测试多为理由停止。

---

## 0. Repository / Branch / Baseline

Repository:

joinwell52-AI/BoundX

Branch:

review/7plus1-parser

Starting baseline:

5675c366c1ecf91e519f15f261617656a50c7cde

025 implementation:

research/7plus1-parser/v0.3-natural-generalization-025/

025 final report:

docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/REPORT.md

025 final state:

NATURAL_GENERALIZATION_025_LONG=EVAL_FAILED

Do not rewrite 023 / 024 / 025 sealed evidence.

Create a new immutable 026 implementation root.

---

# 1. Authoritative method

Read in full before coding:

docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md

Especially:

- §13 总体拓扑
- §15 Span Lattice
- §16 Semantic Nodes
- §17 Relation Space / Relation Bundle
- §18 Relation Candidate / Evidence Tier / Constraint Decoding
- §19 NLP 与模型职责
- §26 方法公式
- §27 Candidate Semantic Graph 必须保留开放语言候选
- §28 Γ 职责
- §41–45 工程约束

Normative formula remains:

T_admin --P--> Gc --Γ--> (Gb, Gu) --Q--> Root Canonical 7+1

Interpretation:

P:
only proposes candidate nodes / relations / expressions and attaches evidence.

Gc:
contains the open candidate semantic space supported by source evidence.

Γ:
is the authoritative deterministic point that decides:
CERTIFIED / REJECTED / TYPED_UNRESOLVED.

Q:
projects only certified boundary semantics.

No additional semantic layer is authorized.

---

# 2. Confirmed root cause from 025 code audit

026 begins from the following falsifiable hypothesis:

H026:

> 025 fails generalization primarily because the implementation performs destructive semantic selection and rejection before Gc is frozen and before Γ runs, so the actual runtime does not preserve the open candidate space required by v0.3.1.

Concrete evidence in 025:

### 2.1 Span Lattice is not functioning as a true alternative lattice

frontend.mjs currently builds:

span_lattice:
  candidates
  edges: []

and many candidates are immediately marked:

status = SELECTED

while semantic nodes are immediately created with:

state = RESOLVED

except special UNKNOWN_REFERENT cases.

This prematurely collapses ambiguity before graph constraints.

### 2.2 Pre-Γ code performs semantic adjudication

Many 025 modules mutate relations/events before freezeCandidateGraph():

r.state = SUPPORTED
r.state = REJECTED
retire(...)
delete unresolved
remove events
replace relations
replace arguments

migration/graph-api.mjs retire() can:

- reject all relations in a clause;
- remove unresolved diagnostics;
- clear events;
- clear local conditions;
- mark analysis handled.

These operations happen before Γ.

### 2.3 Construction modules act as mini-decoders

prepareCandidates() executes a long chain including:

predicateArguments
ownership frames
prepositionalExecution
conditionalConsequents
predicate semantics
retry domains
communication arguments
passive arguments
participant syntax
artifact references
organizational context
transfer syntax
elliptical arguments
condition contracts
coreference contracts
directive ownership
...

Many modules do more than propose candidates/evidence.

They choose, retire or replace semantic interpretations.

This creates:

construction module
→ local adjudication
→ partially collapsed Gc
→ Γ

instead of:

evidence providers
→ open Gc
→ Γ adjudication

### 2.4 Model evidence arrives too late to recover missing hypotheses

Current order is effectively:

prepareCandidates()
→ candidateModelEvidence()
→ freezeCandidateGraph()
→ Γ

BGE / E5 operate primarily on already-created EVENT nodes.
NLI validates already-created relation hypotheses.

If a valid semantic node or relation hypothesis was never proposed, model evidence cannot recover it.

This explains many 025 Blind-200 missing-candidate failures.

---

# 3. Falsification condition

026 must not assume H026 is true merely because it sounds plausible.

Before architectural changes:

1. instrument current 025;
2. count every pre-Γ destructive semantic decision;
3. trace at least the confirmed 025 Blind failures;
4. determine whether the missing/corrupt semantics disappeared before Γ or were correctly present in Gc and later mis-certified.

If the majority of confirmed failures already have correct competing candidates preserved in Gc and Γ alone is the first divergence, H026 is falsified.

If so:
- document the evidence;
- repair Γ under the same task;
- do not invent another architecture.

If valid semantics disappear before Gc freeze or are never proposed because local modules prune/replace them, H026 is confirmed and the implementation must be corrected as specified below.

---

# 4. Required runtime topology

Final 026 runtime must implement this topology literally:

Raw ADMIN Task
→ Document Structure / Clauses
→ Discourse Domain
→ NLP Signals + Typed Literals
→ Span Lattice
→ Candidate Node Generation
→ Generic Relation Candidate Generation
→ Candidate Expression Generation
→ Evidence Fusion
→ Candidate Semantic Graph Gc freeze
→ Γ deterministic constraint decoding
→ Certified Graph Gb + Typed Unresolved Graph Gu
→ Eligibility
→ Boundary IR
→ deterministic 7+1
→ Proof / Coverage

There must be no semantic certification between Candidate Generation and Γ.

---

# 5. Span Lattice correction

Span Lattice must become a real lattice, not a list of preselected spans.

For a source region, multiple reasonable candidates may coexist.

Example:

“测试环境关键服务的运行状态”

may preserve candidates such as:

测试环境
关键服务
运行状态
关键服务的运行状态
测试环境关键服务的运行状态

when supported by source/NLP/typed evidence.

The lattice must record:

span_candidate_id
source_span
candidate_type hypotheses
provider evidence
overlap / containment / composition edges
protected typed literal identity where applicable
candidate provenance

Do not mark a semantic interpretation SELECTED before Γ.

Allowed pre-Γ statuses:

PROPOSED
COMPETING
INSUFFICIENT
CONTRADICTED

A protected exact literal may be marked PROTECTED_EXACT_SPAN,
but that means only the byte/span identity is exact.
It must not imply a final semantic role such as Input, Output, Participant or Basis.

Required hard gates:

SPAN_LATTICE_EDGES_NONEMPTY_WHEN_ALTERNATIVES_EXIST = PASS

NO_PRE_GAMMA_SEMANTIC_SPAN_SELECTED = PASS

NO_SPAN_CANDIDATE_DROPPED_WITHOUT_PROVENANCE = PASS

---

# 6. Candidate Semantic Nodes

Semantic nodes before Γ are hypotheses.

Do not use RESOLVED as an authoritative semantic state before Γ.

Use candidate semantics such as:

candidate_node_state =
  PROPOSED
  COMPETING
  INSUFFICIENT
  CONTRADICTED

Node types remain finite:

ENTITY
EVENT
STATE
VALUE
REFERENCE
CONDITION
DISCOURSE
UNKNOWN_REFERENT

A single source span may support competing node hypotheses.

Examples:

“完成”
may be:
- EVENT candidate
- completion operator / STATE relation candidate

“批准”
may be:
- EVENT candidate
- APPROVAL semantic candidate

“组织”
may be:
- business EVENT candidate
- organization/accountability STATE candidate
- support/operator candidate

The frontend may propose all source-supported alternatives.

It must not decide the final one by deleting the others.

Hard gate:

NO_PRE_GAMMA_FINAL_NODE_RESOLUTION = PASS

---

# 7. Generic Relation Candidate Generator

Implement a first-class generic relation candidate generator.

It must not be a global Cartesian product.

Candidate relation hypotheses must be generated from finite relation signatures plus bounded local evidence:

- dependency path
- SRL predicate/argument frames
- typed node compatibility
- clause ownership
- discourse domain
- token adjacency / phrase containment
- coordination
- passive/active voice evidence
- prepositional markers
- shared predicate / shared argument structure
- coreference candidates
- artifact identity
- explicit condition / quantity markers

Core finite relation space remains the v0.3.1 relation contract:

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

Construction-specific modules may contribute evidence or relation hypotheses,
but they may not be the only way a relation can exist.

Every candidate relation must contain at least:

candidate_relation_id
relation_type
head_candidate_node_id
tail_candidate_node_id
clause_id
discourse_domain
source_span_ids
syntax_evidence_ids
srl_evidence_ids
typed_evidence_ids
discourse_evidence_ids
coreference_evidence_ids
model_evidence_ids
candidate_status
provider_ids

Generic candidate generation must work for unseen nouns, filenames, people, roles and equivalent active/passive paraphrases.

Hard gate:

GENERIC_RELATION_CANDIDATE_GENERATOR_IS_RUNTIME_STAGE = PASS

---

# 8. Construction modules become evidence providers

Existing modules are not automatically deleted.

They must be audited and classified.

Each 025 module must end in one of:

A. EVIDENCE_PROVIDER
B. CANDIDATE_PROVIDER
C. STRUCTURE_PROVIDER
D. EXPRESSION_PROVIDER
E. RETIRED_AS_PRE_GAMMA_DECODER

A module may:

- add candidate spans;
- add candidate nodes;
- add candidate relations;
- add candidate expressions;
- add provenance/evidence;
- mark candidate evidence contradicted;
- describe local syntactic ownership alternatives.

A module may NOT before Γ:

- final-certify a semantic relation;
- final-reject a semantic relation destructively;
- delete a candidate because another local rule won;
- delete unresolved evidence;
- clear candidate events;
- convert a clause to “handled” in a way that prevents other plausible candidates;
- replace a candidate relation with one chosen interpretation and erase the old one.

The current graphApi.retire() semantics must not remain in the pre-Γ candidate path.

If a provider believes a candidate is impossible, retain it with:

candidate_status = CONTRADICTED

plus explicit contradiction evidence.

Γ decides REJECTED.

Hard gates:

PRE_GAMMA_DESTRUCTIVE_RETIRE_COUNT = 0

PRE_GAMMA_FINAL_RELATION_REJECT_COUNT = 0

PRE_GAMMA_UNRESOLVED_DELETION_COUNT = 0

PRE_GAMMA_EVENT_DELETION_COUNT = 0

---

# 9. Evidence Fusion before Γ

Evidence Fusion must happen on candidate hypotheses.

Evidence channels:

HanLP / spaCy:
syntax / NER / SRL / negation / modality / coordination / condition

Typed recognizers:
FILE / PATH / URI / VERSION / COMMIT / REFERENCE / NUMBER / DATE / TIME ...

BGE-M3:
semantic normalization / candidate ranking evidence

multilingual-E5-large:
secondary semantic cross-check

mDeBERTa-MNLI-XNLI:
validation of already-constructed candidate propositions

Models still do not directly write boundary facts.

Important correction:

Model evidence must be attached before Γ to all eligible candidate hypotheses.

If multiple candidate senses/relations exist, BGE/E5/NLI may add evidence to those alternatives.

Model evidence cannot remove source ambiguity by score alone.

NLI cannot invent a relation that has no candidate hypothesis.

If a missing candidate is caused by candidate generation, fix candidate generation.

---

# 10. Γ becomes the only final semantic decoder

Γ must be the first authoritative stage that assigns:

CERTIFIED
REJECTED
TYPED_UNRESOLVED

No upstream semantic module may assign these final meanings.

Γ consumes the complete frozen Gc.

At minimum Γ evaluates:

Node Type
Relation Signature
Relation Direction
Discourse Domain
Participant Eligibility
Artifact Role
Reference/Basis Attachment
Scope Ownership
Condition Ownership
Quantity Target
Modality
Cardinality
Coreference Compatibility
Evidence / Provenance
Mutual Exclusion
Graph Consistency

Γ must reason over competing candidates.

Example:

If “组织” has:

EVENT candidate
ORGANIZATION_STATE candidate

with stronger structural evidence that it is an organization/accountability governor,
Γ may reject EVENT and certify ORGANIZATION_STATE.

The frontend must not delete EVENT first.

If evidence is genuinely tied:
TYPED_UNRESOLVED.

---

# 11. Candidate competition and global consistency

Implement explicit competition groups.

Examples:

same span competing node type
same predicate competing semantic sense
same argument competing relation role
same pronoun competing antecedent
same condition competing owner
same quantity competing target

Each group must have stable IDs.

Γ must see the whole group.

A local provider is not allowed to choose the winner.

The decoder need not use SMT/ILP.

A deterministic constrained search / scoring + abstention implementation is acceptable if:

- candidate set is explicit;
- constraints are explicit;
- tie/uncertainty produces typed unresolved;
- decisions are reproducible;
- proof lineage records why the winner survived.

---

# 12. Candidate recall accountability

Add candidate recall accountability before Γ.

For each source clause, record whether NLP/typed evidence produced candidates for:

predicate candidates
argument candidates
participant candidates
artifact candidates
reference candidates
condition candidates
quantity candidates
coreference candidates

Coverage failure may be emitted when source evidence strongly indicates a boundary-bearing structure but no candidate hypothesis exists.

This must happen before Γ.

A missing candidate must never be silently converted to ABSENT later.

---

# 13. Existing 025 Blind-200 changes role

The 025 Blind-200 is now exposed development evidence.

Do not call it a blind test in 026.

Use it only as a development corpus to verify that the architectural repair actually restores candidate recall and removes premature adjudication.

Do not create a new unseen test set in 026.

First fix the implementation method.

A new unseen evaluation requires a later ADMIN authorization only after 026 architecture and development closure pass.

---

# 14. Development corpora

Use all of these as development/regression evidence:

Root-050
Natural-100
025 Blind-200 generated corpus
historical 018 / 021
mutation / contrast suites

For 025 Blind-200:

- preserve original 025 first-run output unchanged;
- use source/frame evidence for development;
- correct comparator representation bugs separately from parser runtime;
- do not count comparator artifacts as parser errors;
- independently classify true parser failures.

---

# 15. Required mechanism tests

Build mechanism tests independent from benchmark IDs.

At minimum cover:

- active and passive voice;
- Chinese and English;
- Chinese/English mixed identifiers;
- organization/accountability + business action in same clause;
- directive + business action;
- support verb + nominal predicate;
- coordinated predicates;
- coordinated objects;
- shared actor;
- shared object;
- required/permitted/not-required/forbidden;
- condition before main clause;
- condition after main clause;
- approval;
- completion;
- stop/resume;
- quantity target;
- output content;
- artifact input/output/reference roles;
- recipient vs actor;
- role/person;
- pronoun/coreference;
- multiple antecedents;
- genuine ambiguity.

Every mechanism test needs:

positive
negative
semantic-equivalent mutation
semantic contrast

---

# 16. Static architecture audit

Create an automated audit over the 026 active runtime.

It must fail if pre-Γ code contains unauthorized destructive semantics such as:

relation.state = "REJECTED"
relation.state = "RESOLVED"
node.state = "RESOLVED" as final semantics
delete unresolved because a local provider won
events removal used to suppress competing candidate meaning
retire() destructive semantics
direct BoundaryFact creation
direct Canonical slot write

Do not rely only on string grep.

Combine:
- static source audit;
- runtime instrumentation;
- trace audit.

Some internal transport fields may still be named "state" for compatibility,
but the audit must prove they are candidate status, not final certification.

---

# 17. Dynamic architecture audit

For a representative corpus, trace:

source
→ span candidates
→ node candidates
→ relation candidates
→ expression candidates
→ evidence
→ competition groups
→ Γ decisions
→ certified graph
→ Boundary IR
→ 7+1

Required assertions:

Every certified relation had a persisted pre-Γ candidate.

Every Γ-rejected relation still exists in Gc history.

Every typed-unresolved relation still exists in Gc history.

No candidate disappeared between proposal and Γ without a recorded structural invalidity.

No module before Γ writes final boundary state.

---

# 18. Required hard gates

Final 026 gates:

G1 NLP_DIRECT_TO_CANONICAL_SLOT = 0
G2 NLP_DIRECT_TO_BOUNDARY_FACT = 0
G3 MODEL_DIRECT_TO_CERTIFIED_RELATION = 0
G4 NATIVE_RULE_DIRECT_TO_CERTIFIED_RELATION = 0

G5 SPAN_LATTICE_REAL_ALTERNATIVES = PASS
G6 NO_PRE_GAMMA_SEMANTIC_SELECTION = PASS
G7 NO_PRE_GAMMA_DESTRUCTIVE_RETIRE = PASS
G8 GENERIC_RELATION_CANDIDATE_GENERATOR = PASS
G9 EVERY_GAMMA_DECISION_HAS_PERSISTED_CANDIDATE = PASS
G10 COMPETING_CANDIDATES_REACH_GAMMA = PASS
G11 GAMMA_IS_FIRST_FINAL_SEMANTIC_DECODER = PASS
G12 CANONICAL_CONSUMES_ONLY_CERTIFIED_BOUNDARY_SEMANTICS = PASS

Additional zero-count gates:

pre_gamma_destructive_retire = 0
pre_gamma_final_relation_reject = 0
pre_gamma_final_relation_resolve = 0
pre_gamma_unresolved_delete = 0
pre_gamma_candidate_drop_without_provenance = 0
certified_relation_without_candidate = 0
gamma_decision_without_candidate = 0
candidate_provenance_gap = 0

---

# 19. Semantic development closure

Architecture conformance alone is insufficient.

Before PASS, all development corpora must be semantically closed under corrected evaluators:

Root-050:
50/50

Natural-100:
100/100
ambiguity 5/5 correctly unresolved

025 Blind-200 development corpus:
all 200 cases reviewed against frozen semantic frames/source
all confirmed parser defects repaired
comparator-only limitations separately classified and not counted as parser passes/fails

Required parser-defect counts after repair:

confirmed clear-source miss = 0
confirmed wrong binding = 0
confirmed unsupported RESOLVED = 0
confirmed false ABSENT = 0
confirmed operator/support false business action = 0
confirmed clear-source unresolved = 0
proof gap = 0
coverage accountability gap = 0

Do not claim this is unseen generalization evidence.

It is development closure after architectural repair.

---

# 20. Full regression

Final:

full_regression_failures = 0

Do not delete, skip, weaken, filter, or rename failing assertions.

Report SKIP separately.

---

# 21. Required reports

Create:

docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG/

At minimum:

REPORT.md
METHOD-VS-025-IMPLEMENTATION-AUDIT.md
H026-FALSIFICATION.json
PRE-GAMMA-DECISION-AUDIT.json
SPAN-LATTICE-AUDIT.json
CANDIDATE-NODE-AUDIT.json
GENERIC-RELATION-GENERATOR-AUDIT.json
MODULE-CLASSIFICATION.json
CANDIDATE-COMPETITION-AUDIT.json
EVIDENCE-FUSION-AUDIT.json
GAMMA-FIRST-DECODER-AUDIT.json
CANDIDATE-RECALL-ACCOUNTABILITY.json
ROOT-050-CLOSURE.json
NATURAL-100-CLOSURE.json
BLIND-200-DEVELOPMENT-CLOSURE.json
BLIND-200-COMPARATOR-CORRECTION.json
MUTATION-CONTRAST-AUDIT.json
STATIC-ARCHITECTURE-AUDIT.json
DYNAMIC-ARCHITECTURE-AUDIT.json
FULL-REGRESSION.json
GATES.json
IMPLEMENTATION-MAP.md
LONG-RUN-ITERATION-LEDGER.json
MANIFEST.json
SHA256SUMS.txt
SEAL.json
SEAL-VERIFICATION.json

Preserve raw traces.

---

# 22. PASS criteria

Only declare:

CANDIDATE_PARSING_ARCHITECTURE_026_LONG=PASS

when all are true:

1. H026 was tested and either confirmed then repaired, or falsified with evidence and the real first divergence repaired.

2. Span Lattice preserves real alternatives and provenance.

3. Candidate nodes are hypotheses, not pre-certified semantic facts.

4. Generic relation candidate generation exists as a first-class runtime stage.

5. Construction modules no longer destructively adjudicate semantics before Γ.

6. Γ is the first and only final semantic decoder.

7. Competing candidates reach Γ.

8. All G1–G12 architecture gates PASS.

9. All zero-count pre-Γ destructive decision gates are 0.

10. Root-050 remains 50/50.

11. Natural-100 remains 100/100 and ambiguity controls 5/5.

12. Exposed 025 Blind-200 development corpus has 0 confirmed parser defects after corrected semantic review.

13. Full regression has 0 FAIL.

14. No benchmark-specific runtime hardcoding.

15. No merge / release / tag / production switch.

Do not claim production ready.
Do not claim general natural language solved.
Do not create a new blind benchmark in this task.

---

# 23. ADMIN_BLOCKED

Allowed only if implementation work proves a real contradiction in v0.3.1, such as:

- v0.3.1 requires preserving a candidate that another normative clause requires deleting before Γ;
- a required semantic distinction cannot be represented by the frozen candidate/Γ/BoundaryIR contracts;
- two normative clauses require incompatible outputs for the same source meaning.

Report exact clauses and minimal ADMIN decision.

Implementation complexity is not ADMIN_BLOCKED.

---

# 24. Commit / push / stop

Work only on:

review/7plus1-parser

Final response must include:

final commit hash
final task state
H026 result
pre-Γ destructive-decision counts
Span Lattice gates
generic candidate generator gates
G1–G12
Root-050
Natural-100
025 Blind-200 development closure
full regression
report path
seal verification

Push only to review/7plus1-parser.

Stop at WAITING_ADMIN_REVIEW.

Do not start 027.

---

# 25. One-sentence execution instruction

不要继续修句子；把 025 中所有“Γ 之前已经选、删、退役、替换语义”的实现收回为候选/证据提供，把 Span Lattice 做成真正保留竞争解释的候选格，把关系生成收敛为基于依存、SRL、类型、话语域、指代等证据的通用 Candidate Relation Generator，并确保所有合法竞争候选完整进入 Gc，最终只由 Γ 做 CERTIFIED / REJECTED / TYPED_UNRESOLVED；完成后再用 Root-050、Natural-100 和已暴露的 025 Blind-200 作为开发语料验证实现是否真正符合 v0.3.1。
