# BoundX Pass 8 — Canonical 7+1 Projection Specification
## Project the Frozen Root Boundary Resolution into the BXP 7+1 Semantic IR

**状态**：DESIGN_FROZEN_FOR_IMPLEMENTATION  
**设计责任**：ChatGPT / ADMIN Design  
**实现责任**：Codex  
**前置基线**：Pass 7 r30 closed；`READY_WITH_UNRESOLVED`  
**输入**：Frozen r30 Boundary Resolution Ledger + r27/r29 provenance references  
**输出**：Canonical 7+1 Projection（I/O/A/P/R/V/C + B）  
**禁止事项**：不重新解释自然语言；不修 Pass 1–7；不消除 Unknown；不做 FormalBoundaryModel/BoundaryResult/Admission；不使用 LLM/NLP/Pack。

---

# 0. Protocol Binding Gate — MUST RUN FIRST

Pass 8 touches the protocol-defined 7+1 meanings. Therefore the implementation MUST first bind to the repository's authoritative BXP baseline.

Expected baseline:

```text
BXP-0001 = 0.4.0-draft.1
profile   = org.boundx.core-7plus1
```

Before writing projection code:

1. locate the authoritative local repository copy of BXP-0001;
2. locate the authoritative `boundx-task/v1` schema / current 7+1 schema;
3. locate the current profile declaration for `org.boundx.core-7plus1`;
4. locate the BXP 0.4 Gold vectors used by the repository;
5. record exact paths + SHA-256 digests in:

```text
PASS8-PROTOCOL-BASELINE.json
```

If the authoritative local BXP version is not exactly the expected version:

```text
BXP_BASELINE_MISMATCH
```

STOP.

Do not silently fall back to BXP 0.3.

If this Pass 8 Spec conflicts with authoritative BXP 0.4 semantics:

```text
SPEC_CONFLICT_WITH_BXP
```

STOP and report the conflict. Do not redesign BXP.

---

# 1. Protocol meanings that Pass 8 must preserve

Pass 8 MUST use the authoritative BXP definitions verbatim.

The expected core meanings are:

```text
I — Input:
    task-involved objects, data, systems or overall input scope.

O — Output:
    explicit deliverables or externally observable results.

A — Actions:
    allowed or required operations expressed by subject/effect/target.

P — Participants:
    execution, approval, observation, receiving, review or collaboration roles.
    A recorded role/approval relationship is NOT execution authorization.

R — Resources:
    quantity limits, budget, capacity, thresholds and protocol-defined resource constraints.

V — Version and Provenance:
    applicable versions, rules/policies, evidence sources and time baselines.

C — Completion:
    completion, stop and escalation conditions.

B — Forbidden Boundary:
    prohibited effects, targets or combinations, including their conditions/exceptions.
```

Hard invariant:

```text
B_IS_INDEPENDENT_FROM_R
```

A numerical upper bound must not become B merely because the source used a negative phrase.

A prohibited operation/effect must not become R merely because it has a target.

---

# 2. Pass 8 is projection, not new semantics

Pass 8 MUST NOT create a semantic fact absent from r30.

Allowed inputs are only:

```text
RESOLVED ResolutionEntry
UNRESOLVED ResolutionEntry
DEFERRED ResolutionEntry
UNSUPPORTED ResolutionEntry
r30 Human Repair ledger
r30 Unknown Frontier
r30 Provenance
r27 graph structural roles
```

No raw W0 interpretation.

No semantic model calls.

No Pack lookup.

---

# 3. Projection Accountability

Every r30 ResolutionEntry MUST end in exactly one Pass 8 projection disposition:

```text
PROJECTED_RESOLVED
PROJECTED_UNRESOLVED
PROJECTED_DEFERRED
PROJECTED_UNSUPPORTED
PROJECTION_NOT_APPLICABLE
PROJECTION_SLOT_AMBIGUOUS
```

A ResolutionEntry MAY contribute to more than one 7+1 bucket only when the frozen structured evidence independently supports each contribution.

Example:

- an explicitly identified participant can contribute to P;
- an explicitly identified version basis in the same fact can separately contribute to V.

One fact MUST NOT be duplicated across slots merely because it could plausibly fit them.

Hard invariant:

```text
NO_CROSS_SLOT_SEMANTIC_INVENTION
```

---

# 4. Projection Source Classes

Projection rules MUST inspect frozen semantic roles / claim classes, not raw text.

At minimum use:

```text
claim_type
mode
operation
operand role
operand kind
condition role
state role
basis/version/provenance role
participant/agent role
resolution status
diagnostics
```

---

# 5. Slot I — Input

Project to I only when frozen evidence identifies an object/data/system/task-target that the task acts on, reads from, transforms, validates, preserves, loads, sends, writes, creates into, or otherwise explicitly involves.

Eligible evidence classes MAY include explicitly frozen roles such as:

```text
PATIENT
THEME
SOURCE
TARGET / OBJECT
STATE_HOLDER
explicit task-object operand
```

`INSTRUMENT` may project to I only if the authoritative BXP/profile treats such task-used artifacts/systems as Input and the frozen structure identifies it as task-involved scope.

Do not project:

```text
RESULT-only operand
pure version/basis reference
participant identity
numeric resource limit
diagnostic text
```

A CREATE target may be I only if the protocol's Input definition/profile treats the target object as task-involved scope; do not automatically turn it into O.

---

# 6. Slot O — Output

O requires explicit result/deliverable evidence.

Eligible evidence:

```text
RESULT operand
explicit DELIVERABLE / OUTPUT typed component preserved upstream
externally observable result explicitly represented in the frozen graph
```

Do NOT infer Output merely because:

```text
CREATE operation exists
WRITE operation exists
a destination exists
the task probably produces a file
```

Hard invariant:

```text
OUTPUT_REQUIRES_EXPLICIT_RESULT_EVIDENCE
```

If the task likely has an output but Pass 1–7 never established it:

```text
O = absent or unresolved according to BXP status rules
```

Never invent a result.

---

# 7. Slot A — Actions

A contains positive/required task operations, not prohibited operations.

Eligible modes:

```text
REQUIRE
ALLOW
PRESERVE
COMPLETE
STOP
```

only when the frozen operation is itself an allowed/required task operation under BXP semantics.

`ACTION_LITERAL(...)` may be projected as an opaque action literal if already preserved upstream.

Do not normalize it to another primitive.

FORBID operations do NOT enter A solely because they are operations; their prohibition belongs in B.

DECLARE / descriptive facts do not become A unless frozen upstream already established a normative action.

Hard invariant:

```text
FORBIDDEN_ACTION_DOES_NOT_BECOME_POSITIVE_A
```

---

# 8. Slot P — Participants

P requires independent participant/role evidence.

Eligible:

```text
resolved semantic agent
explicit reviewer
explicit approver
explicit receiver
explicit observer
explicit collaborator
explicit system/service participant
```

Preserve role type.

Do NOT project:

```text
syntactic subject without agentive evidence
patient/theme/object
container label
review section name
ADR author
```

Hard invariant:

```text
P_REQUIRES_PARTICIPANT_EVIDENCE
```

Also:

```text
PARTICIPANT_IS_NOT_EXECUTION_AUTHORIZATION
```

Pass 8 MUST NOT output an authorization decision.

---

# 9. Slot R — Resources

R contains only protocol-defined resource constraints.

Eligible evidence:

```text
RESOURCE_CLAIM
LIMIT over quantity/budget/capacity/threshold
explicit cardinality/quantity limit
explicit duration/time budget if BXP classifies it as R
explicit capacity or quota
other resource constraints explicitly permitted by authoritative BXP 0.4
```

Do NOT put ordinary object counts into R merely because a quantity is present.

Example:

```text
"load 7 schema files"
```

The `7` describes the task object cardinality, not necessarily a resource upper bound.

Do NOT move FORBID actions into R.

Hard invariant:

```text
RESOURCE_CONSTRAINT_REQUIRES_RESOURCE_SEMANTICS
```

---

# 10. Slot V — Version and Provenance

Eligible evidence:

```text
VERSION operand
version binding claim
source revision
policy/rule/ADR basis
evidence source basis
explicit time baseline when BXP classifies it as V
```

A provenance link used only internally by the compiler does NOT automatically become a V entry.

V requires a source-level task basis/version fact preserved by the boundary representation.

Example:

```text
basis = ADR-0017
```

may project to V only if it is a task-applicable basis, not merely compiler provenance.

Hard invariant:

```text
COMPILER_PROVENANCE_IS_NOT_TASK_VERSION_BASIS
```

---

# 11. Slot C — Completion

C is NOT a general-purpose condition bucket.

Eligible:

```text
explicit completion condition
explicit stop condition
explicit escalation condition
COMPLETE claim
STOP claim
condition structurally governed by completion/stop/escalation semantics
```

Do NOT project:

```text
arbitrary precondition
descriptive if/when clause
condition attached only to a FORBID
validation condition with no completion meaning
```

Hard invariant:

```text
C_IS_NOT_GENERIC_CONDITION_BUCKET
```

---

# 12. Slot B — Forbidden Boundary

Every FORBID boundary fact MUST be considered for B.

Project:

```text
prohibited operation/effect
prohibited target
prohibited combination
scope
condition
exception
```

as one evidence-bound B entry.

Preserve status:

```text
RESOLVED FORBID   → resolved B entry
UNRESOLVED FORBID → unresolved B candidate
DEFERRED FORBID   → deferred/unresolved B candidate
UNSUPPORTED FORBID→ unresolved/unsupported B candidate
```

Do NOT drop a prohibition because its actor/target/condition is unresolved.

Hard invariants:

```text
NEGATIVE_BOUNDARY_PRESERVATION
B_IS_INDEPENDENT_FROM_A
B_IS_INDEPENDENT_FROM_R
```

---

# 13. Slot Entry State

Pass 8 MUST maintain an internal per-entry projection state:

```text
RESOLVED_ENTRY
UNRESOLVED_ENTRY
DEFERRED_ENTRY
UNSUPPORTED_ENTRY
```

even if the protocol envelope exposes only bucket-level status.

Each entry must preserve:

```text
source resolution entry ref
source claim ref
source spans/provenance
normalized value or opaque literal
condition/scope refs when applicable
diagnostics
```

---

# 14. Bucket Status Reduction

Final bucket status MUST conform exactly to authoritative BXP 0.4.

Before implementing, Codex MUST extract the normative bucket-status rules into:

```text
PASS8-BXP-STATUS-RULES.json
```

and cite exact local BXP sections / file digests.

The expected public status vocabulary is:

```text
resolved
unresolved
absent
```

Conservative requirement:

- never emit `resolved` if doing so would hide a slot-relevant unresolved/deferred/unsupported candidate that the BXP rules require to keep unresolved;
- never emit `absent` if there is a slot-relevant unresolved/deferred/unsupported candidate;
- never invent an empty resolved entry.

If exact BXP 0.4 rules differ, follow BXP and report the difference.

---

# 15. Projection Ambiguity

If one ResolutionEntry has sufficient evidence that it belongs to the 7+1 model but the available frozen structure cannot determine which slot uniquely applies:

```text
PROJECTION_SLOT_AMBIGUOUS
```

Do NOT guess a slot.

This must appear in the Pass 8 diagnostics and may force candidate buckets to `unresolved` only if BXP 0.4 explicitly permits such candidate propagation.

No arbitrary multi-slot duplication.

---

# 16. Absent vs Unknown

`absent` means:

> the source/projection contains no element of this kind after complete projection accountability.

It does NOT mean:

```text
we failed to extract it
the frontend cannot represent it
an unsupported fact may contain it
```

If capability gaps could contain a slot-relevant fact and the slot relevance is explicitly known:

```text
unresolved
```

If slot relevance itself is unknown, preserve the projection gap in diagnostics; do not silently label a slot resolved because of that gap.

---

# 17. Relations and Conditions remain auxiliary

7+1 is not allowed to swallow all graph structure.

Pass 8 MUST preserve auxiliary:

```text
Relations
Conditions
Unknown Frontier
Contradiction Groups
Human Repair
```

in the canonical projection package outside the eight buckets.

Do not force every relation into P/C/B.

---

# 18. Contradictions

If Pass 7 has a contradiction group:

- preserve all contributing 7+1 entries;
- mark affected projection entries as contradiction-linked;
- do not choose a winner;
- do not delete one side.

A contradiction is not itself a ninth slot.

---

# 19. Canonical Ordering

To make projection deterministic:

Bucket order:

```text
I, O, A, P, R, V, C, B
```

Within each bucket:

1. resolved entries;
2. unresolved entries;
3. deferred entries;
4. unsupported entries;

then stable sort by:

```text
source start codepoint
source end codepoint
claim_id / resolution_entry_id
```

Do not sort by translated or normalized display text.

---

# 20. Canonical 7+1 Output

Required primary artifact:

```text
PASS8-CANONICAL-7PLUS1.json
```

Conceptual shape:

```json
{
  "protocol_version": "0.4.0-draft.1",
  "profile": "org.boundx.core-7plus1",
  "source_resolution_ref": "...",
  "elements": {
    "I": {"status": "...", "entries": []},
    "O": {"status": "...", "entries": []},
    "A": {"status": "...", "entries": []},
    "P": {"status": "...", "entries": []},
    "R": {"status": "...", "entries": []},
    "V": {"status": "...", "entries": []},
    "C": {"status": "...", "entries": []},
    "B": {"status": "...", "entries": []}
  },
  "relations": [],
  "conditions": [],
  "unresolved_frontier": [],
  "contradictions": [],
  "human_repair": [],
  "provenance": {}
}
```

This conceptual shape does not override the authoritative BXP schema.

If the official BXP envelope differs, the official envelope wins.

---

# 21. BXP Envelope Projection

If the repository's authoritative BXP 0.4 schema permits direct construction of a `boundx-task/v1` semantic envelope, also output:

```text
PASS8-BXP-TASK-IR.json
```

It MUST validate against the authoritative local schema.

Do NOT manufacture mandatory source/profile fields absent from frozen upstream evidence.

If a mandatory protocol field cannot be produced faithfully:

```text
BXP_ENVELOPE_PROJECTION_UNAVAILABLE
```

The Canonical 7+1 artifact may still exist, but do not claim BXP envelope conformance.

---

# 22. This Pass does NOT produce BoundaryResult or Admission

Explicitly forbidden outputs:

```text
FormalBoundaryModel
BoundaryResult
Admission
Release
execution_authorization
business_decision
```

If compatibility metadata contains these fields, they MUST remain:

```text
null / NOT_PRODUCED
```

as permitted by the artifact format.

Pass 8 goal is exactly:

> Canonical 7+1 semantic projection.

---

# 23. Projection Accountability Ledger

Produce:

```text
PASS8-PROJECTION-ACCOUNTABILITY.json
```

For every r30 ResolutionEntry:

```text
resolution_entry_ref
projection_disposition
projected_slots[]
projection_rule_ids[]
evidence_refs[]
diagnostics[]
```

Required:

```text
63 / 63 ResolutionEntry accounted
```

Also account for the NON_BOUNDARY index separately.

---

# 24. Required Rule IDs

At minimum:

```text
P8-I-EXPLICIT-TASK-OBJECT
P8-O-EXPLICIT-RESULT
P8-A-POSITIVE-NORMATIVE-ACTION
P8-P-EXPLICIT-PARTICIPANT
P8-R-RESOURCE-CONSTRAINT
P8-V-EXPLICIT-VERSION-BASIS
P8-C-COMPLETION-STOP-ESCALATION
P8-B-FORBID-BOUNDARY
P8-NOT-APPLICABLE
P8-SLOT-AMBIGUOUS
```

Every projected entry must name its rule.

---

# 25. Non-Gold Projection Validation

Freeze before production.

At minimum:

1. explicit task object → I
2. explicit result → O
3. REQUIRE action → A
4. ALLOW action → A
5. FORBID action → B but not positive A
6. explicit reviewer → P without authorization
7. numeric duration upper bound → R
8. prohibited delete → B, not R
9. explicit version/policy basis → V
10. completion condition → C
11. generic precondition → not C
12. deferred FORBID remains B-unresolved candidate
13. unresolved participant → P unresolved
14. compiler provenance alone → not V
15. CREATE target without explicit result evidence → not automatically O
16. output absent when no output evidence
17. slot ambiguity → no guessed slot
18. contradiction preserves both entries
19. non-boundary produces no 7+1 entry
20. no execution authorization emitted

Also run a compatibility subset of current BXP 0.4 Gold vectors focused on 7+1 slot semantics/status.

Do NOT tune rules after REAL-GOLD-015 projection.

---

# 26. Required Outputs

```text
PASS8-PROTOCOL-BASELINE.json
PASS8-BXP-STATUS-RULES.json
PASS8-CANONICAL-7PLUS1.json
PASS8-BXP-TASK-IR.json            # only if conformant/available
PASS8-PROJECTION-ACCOUNTABILITY.json
PASS8-PROJECTION-DIAGNOSTICS.json
PASS8-RELATIONS.json
PASS8-CONDITIONS.json
PASS8-UNRESOLVED-FRONTIER.json
PASS8-CONTRADICTIONS.json
PASS8-HUMAN-REPAIR.json
PASS8-PROVENANCE.json
PASS8-VALIDATION.json
PASS8-INTEGRITY-AUDIT.json
PASS8-DETERMINISTIC-REPLAY.json
PASS8-IMPLEMENTATION-REPORT.md
MANIFEST.json
SEAL.json
```

---

# 27. Required Metrics

Report:

```text
resolution_entries_total
resolution_entries_accounted
projection_accountability_gaps

I_status / I_entries_resolved / I_entries_unresolved
O_status / O_entries_resolved / O_entries_unresolved
A_status / A_entries_resolved / A_entries_unresolved
P_status / P_entries_resolved / P_entries_unresolved
R_status / R_entries_resolved / R_entries_unresolved
V_status / V_entries_resolved / V_entries_unresolved
C_status / C_entries_resolved / C_entries_unresolved
B_status / B_entries_resolved / B_entries_unresolved

slot_ambiguous_items
projection_not_applicable_items
relations_preserved
conditions_preserved
unknown_frontier_preserved
contradiction_groups_preserved
human_repair_items_preserved

cross_slot_invention_findings
output_invention_findings
participant_authorization_invention_findings
resource_misclassification_findings
completion_bucket_abuse_findings
negative_boundary_loss_findings
unknown_collapse_findings
provenance_gaps
schema_validation_errors
referential_integrity_errors
deterministic_replay_pass
```

---

# 28. Pass 8 Closure

Recommend:

```text
PASS8_CLOSE
```

only if:

```text
projection_accountability_gaps = 0
cross_slot_invention_findings = 0
output_invention_findings = 0
participant_authorization_invention_findings = 0
resource_misclassification_findings = 0
completion_bucket_abuse_findings = 0
negative_boundary_loss_findings = 0
unknown_collapse_findings = 0
provenance_gaps = 0
schema_validation_errors = 0 for every artifact claiming schema conformance
referential_integrity_errors = 0
deterministic_replay_pass = true
```

Do NOT require all eight buckets to be `resolved`.

A valid final result MAY be:

```text
READY_CANONICAL_7PLUS1_WITH_UNRESOLVED
```

This is expected when the ADMIN source itself or the compiler capability leaves unresolved facts.

---

# 29. Stop Boundary

After Pass 8:

```text
FULL_COMPILER_IMPLEMENTATION_AUTHORIZED=false
FORMAL_BOUNDARY_MODEL_AUTHORIZED=false
BOUNDARY_RESULT_AUTHORIZED=false
ADMISSION_AUTHORIZED=false
DOWNSTREAM_PM_CONFORMANCE_AUTHORIZED=false
```

Stop for ADMIN Review.

The deliverable of this Pass is the first complete end-to-end:

```text
ADMIN natural language
→ deterministic compiler pipeline
→ Canonical 7+1
```

with Unknown / Deferred / Unsupported preserved honestly.
