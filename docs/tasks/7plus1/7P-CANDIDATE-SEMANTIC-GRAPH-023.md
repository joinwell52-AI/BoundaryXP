# 7P-CANDIDATE-SEMANTIC-GRAPH-023

## Status

`ADMIN AUTHORIZED`

This task authorizes one architectural repair only:

> Restore the normative `ADMIN natural language → Candidate Semantic Graph → Γ certification → Boundary IR → Canonical 7+1` main path.

Do not redesign 7+1. Do not redesign BXP. Do not tune individual ADMIN cases.

---

## 0. Mandatory normative source

Read in full before changing code:

`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md`

The authoritative method is fixed:

```text
T_admin --P--> Gc --Γ--> (Gb, Gu) --Q--> Root Canonical 7+1
```

Where:

- `T_admin` = ADMIN source task;
- `P` = semantic parsing;
- `Gc` = Candidate Semantic Graph / 候选结构化语义图;
- `Γ` = deterministic type/scope/relation/evidence/modality/quantity/condition/consistency certification;
- `Gb` = certified boundary-qualified semantic graph;
- `Gu` = typed unresolved graph;
- `Q` = deterministic 7+1 graph views / queries.

No alternative method is authorized.

---

## 1. Root cause to repair

The current implementation has real NLP signals, semantic nodes, typed recognizers, model calls, relations, Eligibility, Boundary IR and Canonical 7+1.

However, historical implementation allowed some paths equivalent to:

```text
NLP signal / finite predicate / NATIVE_* rule
→ decoded or resolved relation
→ Eligibility
→ Boundary IR
```

without an authoritative first-class Candidate Semantic Graph stage containing explicit candidate relations, candidate expressions, evidence fusion and a separate Γ certification decision.

This creates the wrong engineering pressure:

```text
new language construction
→ add/repair a parser rule
→ directly obtain relation
→ next construction fails
```

The repair target is architectural, not phrase-level.

---

## 2. Exact scope

Authorized:

```text
ADMIN natural-language frontend
Semantic Nodes
Candidate generation
Candidate Semantic Graph
evidence attachment
Γ certification interface
resolved / rejected / unresolved relation production
trace / diagnostics / tests required to prove the above
```

Frozen unless a compatibility adapter is strictly required:

```text
7+1 normative definitions
BXP 0.4 semantics
Boundary Fact meanings
Boundary IR meanings
Canonical projection meanings
Authority semantics
Negative Boundary semantics
OPEN / ABSENT / UNRESOLVED semantics
ADMIN Root / explicit-WP contract in v0.3.1
L1/L2/L3 contents
model versions
model thresholds
downstream mathematical semantics
```

This task is not permission to improve final case accuracy by downstream patches.

---

## 3. Required main path

The runtime must expose and execute:

```text
ADMIN source
→ Structure / Clauses / Discourse Domain
→ HanLP / spaCy NLP signals + Typed Recognizers
→ Span Lattice
→ Semantic Nodes
→ Candidate Relations + Candidate Expressions
→ Candidate Semantic Graph (Gc)
→ Evidence Fusion
→ Γ Certification
→ Resolved Relations
   + Rejected Relations
   + Typed Unresolved Relations
→ Eligibility
→ Boundary-qualified Graph / Boundary IR
→ Deterministic 7+1 Projection
→ Proof / Coverage
```

The Candidate Semantic Graph is not a report-only reconstruction. It must be a real runtime object consumed by Γ.

---

## 4. Candidate Semantic Graph contract

Implement an authoritative runtime object equivalent to:

```text
CandidateSemanticGraph {
  graph_id
  semantic_node_ids[]
  candidate_relation_ids[]
  candidate_expression_ids[]
  evidence_ids[]
  unresolved_refs[]
  source_span_ids[]
}
```

Exact field names may follow existing project conventions, but the semantic contract is mandatory.

It must be possible to prove:

```text
source/NLP
→ candidate
→ Γ decision
→ final relation
→ Eligibility
→ Boundary Fact
→ Canonical entry
```

for every final resolved entry.

---

## 5. Candidate relation contract

Every relation that can affect boundary semantics must first exist as a candidate.

Minimum conceptual contract:

```text
CandidateRelation {
  candidate_relation_id
  relation_type
  head_node_id
  tail_node_id
  clause_id
  discourse_domain
  scope_refs[]
  source_span_ids[]

  syntax_evidence[]
  srl_evidence[]
  typed_evidence[]
  discourse_evidence[]
  embedding_evidence[]
  nli_evidence[]

  candidate_state
}
```

Minimum candidate states:

```text
PROPOSED
SUPPORTED
COMPETING
INSUFFICIENT
REJECTED
```

A candidate state is not a Boundary Fact and is not a 7+1 slot state.

---

## 6. NLP is the primary semantic-structure producer

HanLP / spaCy must materially participate in candidate generation.

Consume real available signals including:

```text
token
POS
lemma
dependency
head
NER
predicate candidates
SRL / predicate-argument hints
negation
modality
coordination
subordination
condition markers
temporal markers
coreference candidates
```

Example:

```text
由 QA 检查 routes.csv
```

Allowed frontend result:

```text
AGENT?(check, QA)
PATIENT?(check, routes.csv)
```

Forbidden frontend result:

```text
AGENT(check, QA) = RESOLVED
```

before Γ certification.

NLP is allowed to miss or propose competing candidates. It is not allowed to bypass certification.

---

## 7. Typed recognizers

Typed recognizers remain deterministic evidence producers for:

```text
FILE
PATH
URI
API
SYMBOL
VERSION
COMMIT
TICKET
ADR
POLICY
REFERENCE
NUMBER
PERCENT
DURATION
DATE
TIME
DEADLINE
...
```

Typed recognition may create/strengthen candidate nodes and candidate relations.

It must not directly assign I/O/A/P/R/V/C/B.

A literal type alone is never a slot decision.

---

## 8. Existing NATIVE_* mechanisms

Existing generic mechanisms such as:

```text
NATIVE_AGENT
NATIVE_PATIENT
NATIVE_RESULT
NATIVE_RECIPIENT
NATIVE_FORBIDS
NATIVE_RESTRICTS
NATIVE_LIMIT
NATIVE_CONDITION_OF
NATIVE_APPROVAL_OF
NATIVE_BASIS
...
```

must be audited.

They may remain as reusable candidate-generation or evidence-producing mechanisms.

They may:

```text
propose CandidateRelation
attach syntax evidence
attach typed evidence
attach structural evidence
attach discourse evidence
```

They must not bypass the Candidate Semantic Graph and directly create a certified relation.

Hard gate:

```text
NATIVE_RULE_DIRECT_TO_CERTIFIED_RELATION = 0
```

Do not delete useful generic mechanisms merely to satisfy the gate. Re-route them through candidates.

---

## 9. BGE-M3 role

BGE-M3 runs only after a source-supported semantic node/relation candidate exists.

Role:

```text
surface predicate / relation hypothesis
→ semantic normalization candidates
→ relation/concept candidate ranking
```

Output is evidence/ranking attached to candidates.

Forbidden:

```text
BGE score → certified relation
BGE score → Boundary Fact
BGE score → 7+1
BGE score → Authority
```

---

## 10. multilingual-E5-large role

E5 is a secondary semantic channel.

Use for:

```text
semantic cross-check
cross-lingual comparison
low-margin candidate comparison
normalization cross-check
```

It is not required on every candidate.

Its output must remain candidate evidence.

---

## 11. mDeBERTa-MNLI-XNLI role

NLI validates an already constructed relation hypothesis.

Conceptual interface:

```text
premise = exact source clause/span
hypothesis = normalized candidate relation statement

→ ENTAILMENT
→ NEUTRAL
→ CONTRADICTION
```

NLI must not:

```text
create candidate facts from nothing
invent actors
invent objects
resolve missing authority
directly decide slots
directly certify a relation only because entailment score is high
```

NLI evidence is consumed by Γ together with other evidence and constraints.

---

## 12. Γ certification

Implement or expose an explicit Γ decision stage over Gc.

Γ must produce a decision record for every candidate that can affect the boundary.

Minimum checks:

```text
Node Type Constraint
Relation Signature Constraint
Relation Direction
Discourse Domain
Participant Eligibility
Artifact Role
Reference / Basis Attachment
Scope Ownership
Condition Ownership
Quantity Target
Modality
Cardinality
Coreference Compatibility / Uniqueness
Evidence / Provenance Sufficiency
Mutual Exclusion
Graph Consistency
```

Output classes:

```text
CERTIFIED / RESOLVED
REJECTED
TYPED_UNRESOLVED
```

If two interpretations remain materially valid:

```text
TYPED_UNRESOLVED
```

Do not select the highest score merely to get a resolved answer.

---

## 13. Candidate expressions

Scope / condition / quantity / set / coreference expressions that can affect the boundary must also be represented before certification.

Do not allow anonymous logical operators to appear only after certification.

Preserve IDs and provenance for:

```text
ITEM / ALL / ANY / UNION / INTERSECTION / EXCEPT
STATE_REF / RELATION_REF / BOUNDARY_FACT_REF / AND / OR / NOT
quantity metric / comparator / target / value / unit
coreference candidate sets
```

---

## 14. Required no-bypass invariants

Add executable gates for all of the following:

```text
G1  NLP_DIRECT_TO_CANONICAL_SLOT = 0

G2  NLP_DIRECT_TO_BOUNDARY_FACT = 0

G3  NATIVE_RULE_DIRECT_TO_CERTIFIED_RELATION = 0

G4  MODEL_DIRECT_TO_CERTIFIED_RELATION = 0

G5  EVERY_CERTIFIED_RELATION_HAS_CANDIDATE = PASS

G6  EVERY_REJECTED_RELATION_HAS_CANDIDATE = PASS

G7  EVERY_TYPED_UNRESOLVED_RELATION_HAS_CANDIDATE = PASS

G8  EVERY_CANDIDATE_HAS_SOURCE_PROVENANCE = PASS

G9  EVERY_CERTIFIED_RELATION_HAS_GAMMA_DECISION = PASS

G10 CANDIDATE_SEMANTIC_GRAPH_IS_RUNTIME_OBJECT = PASS

G11 GAMMA_CONSUMES_CANDIDATE_SEMANTIC_GRAPH = PASS

G12 CANONICAL_PROJECTION_CONSUMES_ONLY_CERTIFIED_BOUNDARY_SEMANTICS = PASS
```

The most important gates are:

```text
NATIVE_RULE_DIRECT_TO_CERTIFIED_RELATION = 0
EVERY_CERTIFIED_RELATION_HAS_CANDIDATE = true
EVERY_CERTIFIED_RELATION_HAS_GAMMA_DECISION = true
```

Any failure blocks acceptance.

---

## 15. Execution / Trace visibility

The actual runtime trace and 58618 inspection surface must distinguish at least:

```text
1 Source
2 Structure / Discourse
3 NLP Signals / Typed Literals
4 Span Lattice
5 Semantic Nodes
6 Candidate Semantic Graph
7 Candidate Relations / Expressions
8 Candidate Evidence
9 Γ Decisions
10 Certified / Rejected / Typed-Unresolved Relations
11 Eligibility
12 Boundary IR
13 Canonical 7+1
14 Proof / Coverage
```

Do not merge Candidate and Certified relations into a single opaque view.

History/export must preserve the same execution snapshot and must not re-run parsing.

---

## 16. First-divergence discipline

Any semantic failure must report only the earliest incorrect stage from:

```text
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
```

Example:

```text
NLP correct
Semantic node correct
candidate AGENT missing

FIRST_DIVERGENCE = CANDIDATE_GENERATION
```

Repair that class of mechanism only.

Do not repair downstream symptoms.

---

## 17. Mechanism test suite before ADMIN corpus replay

Before using ADMIN-ROOT Standard-050, 018 or 021 as acceptance evidence, freeze a mechanism suite covering at minimum:

```text
simple subject-verb-object
passive/由... construction
omitted subject
coordinated actions
shared object
shared actor
condition
nested condition
negation
FORBIDDEN
NOT_REQUIRED
approval condition
sequence
reference/basis
single coreference antecedent
multiple compatible antecedents
file/path/version/reference typed literals
quantity limits
completion conditions
cross-clause actor inheritance
role + person construction
Chinese
English
mixed Chinese/technical identifiers
long sentence
```

Primary assertions are candidate recall, provenance, competition preservation and Γ behavior.

Do not make “all eight slots non-empty” an acceptance goal.

---

## 18. ADMIN corpus replay order

Only after G1–G12 and the mechanism suite pass, replay:

```text
1. ADMIN Root Standard-050
2. 7P-ADMIN-SHORT-018 / its authoritative successor evidence
3. 7P-ADMIN-NATURAL-021 / its authoritative successor evidence
```

These runs are diagnostics of generalization.

They must not become runtime phrase templates.

For every mismatch, classify the first divergence.

---

## 19. Forbidden repairs

Do not add:

```text
case-id-specific logic
exact ADMIN sentence matches
fixture text lookup
expected 7+1 lookup
Gold output lookup
task-specific regex
person/file/identifier hard-coding
special rules whose only evidence is one failing case
```

Do not change the normative method because a case fails.

Do not modify Γ or Q to compensate for missing candidate generation.

Do not convert UNRESOLVED to ABSENT for appearance.

Do not fill all 8 slots merely to improve completeness counts.

---

## 20. Required reports

Create a new immutable report directory using existing conventions for task 023.

At minimum provide:

```text
REPORT.md
ARCHITECTURE-BEFORE-AFTER.md
CANDIDATE-GRAPH-CONTRACT.json
CANDIDATE-RELATION-AUDIT.json
NATIVE-RULE-BYPASS-AUDIT.json
MODEL-ROLE-AUDIT.json
GAMMA-DECISION-AUDIT.json
MECHANISM-SUITE.json
ADMIN-REPLAY-MATRIX.json
FIRST-DIVERGENCE.json
TRACE-AUDIT.json
FULL-REGRESSION.json
MANIFEST.json
SHA256SUMS.txt
SEAL.json
```

Report exact counts for:

```text
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
direct_nlp_to_slot_edges
direct_nlp_to_boundary_fact_edges
```

---

## 21. Acceptance

Task 023 passes only when:

```text
G1–G12 = PASS

relations_without_candidate = 0
certified_relations_without_gamma_decision = 0
native_rule_direct_certifications = 0
model_direct_certifications = 0
candidate_provenance_gaps = 0
direct_nlp_to_slot_edges = 0
direct_nlp_to_boundary_fact_edges = 0

Candidate Semantic Graph is a real runtime object
Γ consumes Candidate Semantic Graph
Canonical 7+1 remains a deterministic projection of certified boundary semantics
full regression failures = 0
```

ADMIN corpus accuracy may still expose semantic gaps. Such gaps must be reported truthfully and do not authorize phrase patches.

Only after the architectural gates pass may the implementation marker be:

```text
CANDIDATE_SEMANTIC_GRAPH_MAIN_PATH=PASS
```

Do not claim:

```text
BOUNDX_PRODUCTION_READY=true
ADMIN_ROOT_GENERALIZATION_COMPLETE=true
```

unless separately authorized and proven.

---

## 22. Git / stop boundary

Work only on:

`review/7plus1-parser`

When complete:

1. preserve all previous sealed evidence;
2. commit the implementation and report;
3. push only to `review/7plus1-parser`;
4. do not merge;
5. do not tag;
6. do not release;
7. do not switch production;
8. stop at:

`WAITING_ADMIN_REVIEW`

Do not automatically start another repair task.
