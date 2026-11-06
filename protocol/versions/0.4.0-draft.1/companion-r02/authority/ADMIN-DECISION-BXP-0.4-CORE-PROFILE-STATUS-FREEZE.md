# ADMIN DECISION — BXP 0.4 Core Profile / Status Policy Freeze
## Resume Companion Asset Freeze; Pass 8 remains paused

**Status**: ADMIN DECISION ISSUED  
**Decision authority**: ADMIN / ChatGPT design  
**Implementation owner**: Codex  
**Baseline**: `companion-asset-freeze-r01` audit  
**Purpose**: Resolve `ADMIN_DECISION_REQUIRED_REQUIRED_ELEMENTS` and `CORE_GOLD_CASE_PROFILE_MISMATCH` without inventing Pass 8 semantics.

---

# 0. Authorization

```text
BXP_0_4_COMPANION_ASSET_FREEZE_RESUME=true

PASS8_IMPLEMENTATION_AUTHORIZED=false
FORMAL_BOUNDARY_MODEL_AUTHORIZED=false
BOUNDARY_RESULT_AUTHORIZED=false
ADMISSION_AUTHORIZED=false
DOWNSTREAM_CONFORMANCE_AUTHORIZED=false
PUBLICATION_AUTHORIZED=false
RELEASE_AUTHORIZED=false
```

Preserve:

```text
r01–r30
Pass 8 gate audit
companion-asset-freeze-r01
all source Gold candidate bytes
historical 0.3 assets
```

immutably.

Do not modify compiler code in this task.

---

# 1. ADMIN Decision A — Separate structural slot presence from required-resolved policy

The 0.4 semantic carrier MUST contain all eight 7+1 bucket keys structurally:

```text
I O A P R V C B
```

This is a wire / semantic-IR shape requirement.

It is NOT equivalent to:

```text
all eight buckets must be resolved
```

These two concepts must be represented separately.

## 1.1 Core carrier policy

For:

```text
profile_id = org.boundx.core-7plus1
protocol_version = 0.4.0-draft.1
```

freeze:

```text
structural_elements = [I,O,A,P,R,V,C,B]
required_elements = []
```

Meaning:

> `org.boundx.core-7plus1` defines the canonical eight-slot semantic carrier, but by itself imposes no universal "must be resolved" set.

This is intentional.

The core profile is a representation/projection profile, not an Admission policy.

## 1.2 Consequence

A bucket may legitimately be:

```text
resolved
unresolved
absent
```

without violating the core carrier.

A later specialized profile MAY declare non-empty `required_elements`.

Do not infer universal required-resolved policy from:

- the fact that all eight keys appear in every Gold record;
- the absence of an `absent` example for a particular bucket;
- historical 0.3 `required_elements=[I,O,A,P,R,V,C,B]`.

Hard invariant:

```text
STRUCTURAL_PRESENCE_IS_NOT_REQUIRED_RESOLUTION
```

---

# 2. ADMIN Decision B — Version/baseline requirement is conditional profile policy, not Core default

Do NOT freeze:

```text
V is always required
```

Do NOT freeze:

```text
all code changes require V
```

under `org.boundx.core-7plus1`.

The r01 audit correctly found examples where V is absent in both determined and underdetermined cases.

Therefore:

```text
CORE_V_REQUIRED_BY_DEFAULT=false
```

A version/baseline requirement must come from one of:

1. an explicit specialized profile rule;
2. an explicit task/profile requirement carried in the protocol envelope;
3. a future version-sensitive policy profile separately frozen by ADMIN.

Until such a specialized policy is versioned, a Gold case whose BoundaryResult rationale depends on "this task class requires V" MUST NOT be used as evidence for the Core profile's universal `required_elements`.

Pass 8 only projects V evidence; it does not decide whether V is required for Admission.

---

# 3. ADMIN Decision C — Specialized Profiles share the 7+1 carrier but are NOT aliases

Preserve the original Profile IDs in the Core 100 candidate:

```text
org.boundx.core-7plus1
org.boundx.core-formal-conformance
org.boundx.boundary-result-conformance
org.boundx.admission-conformance
org.boundx.downstream-conformance
```

Do NOT rewrite the 75 specialized cases to `org.boundx.core-7plus1`.

Do NOT declare the IDs aliases.

Instead create an explicit profile family registry:

```text
org.boundx.core-7plus1
    semantic_carrier = true
    parent = null

org.boundx.core-formal-conformance
    semantic_carrier = org.boundx.core-7plus1
    stage = formal-boundary-model

org.boundx.boundary-result-conformance
    semantic_carrier = org.boundx.core-7plus1
    stage = boundary-result

org.boundx.admission-conformance
    semantic_carrier = org.boundx.core-7plus1
    stage = admission

org.boundx.downstream-conformance
    semantic_carrier = org.boundx.core-7plus1
    stage = downstream-conformance
```

This relationship means:

> all five profiles use the same I/O/A/P/R/V/C/B slot meanings and public bucket status vocabulary.

It does NOT mean:

> all five profiles have the same required-elements, determination, Admission or conformance rules.

Hard invariant:

```text
PROFILE_CARRIER_COMPATIBILITY_IS_NOT_PROFILE_IDENTITY
```

---

# 4. ADMIN Decision D — How the 100 candidate cases may be used

Freeze three evidence scopes.

## 4.1 `CORE_PROFILE_ORACLE`

Cases using:

```text
org.boundx.core-7plus1
```

may validate:

- core profile identifier;
- core slot semantics;
- core projection/status representation.

Current audited count:

```text
25
```

## 4.2 `CORE_CARRIER_COMPATIBILITY_EVIDENCE`

All 100 cases MAY validate only the shared carrier aspects:

```text
eight slot keys
slot names/meanings
resolved/unresolved/absent vocabulary
normalized/evidence representability
```

They MUST NOT be treated as 100 cases all asserting the Core profile's required-elements policy.

## 4.3 `STAGE_PROFILE_EVIDENCE`

The remaining 75 cases remain evidence for their original specialized stages.

Their:

```text
FormalBoundaryModel
BoundaryResult
Admission
DownstreamConformance
```

expectations are outside Pass 8.

Do not modify the original Gold candidate package.

Create an external compatibility index that records these evidence scopes.

---

# 5. ADMIN Decision E — Exact bucket status reduction for Pass 8

Freeze the following deterministic reduction algorithm for Canonical 7+1 projection.

For each slot `S`:

Let:

```text
Resolved(S) =
  projection candidates assigned to S with projection entry state RESOLVED_ENTRY

Open(S) =
  projection candidates assigned to S with any of:
    UNRESOLVED_ENTRY
    DEFERRED_ENTRY
    UNSUPPORTED_ENTRY
    PROJECTION_SLOT_AMBIGUOUS where S is an explicit candidate slot
```

Then:

```text
if Open(S) is non-empty:
    bucket.status = unresolved

else if Resolved(S) is non-empty:
    bucket.status = resolved

else:
    bucket.status = absent
```

## 5.1 Required constraints

```text
RESOLVED_CANNOT_HIDE_OPEN_CANDIDATE
ABSENT_REQUIRES_COMPLETE_SLOT_ACCOUNTABILITY
EXTRACTION_FAILURE_IS_NOT_ABSENCE
```

`absent` is permitted only after all ResolutionEntries are accounted and no slot-relevant resolved/open candidate exists.

## 5.2 Empty resolved bucket

A bucket MUST NOT be:

```text
resolved + entries=[]
```

unless an authoritative protocol/Gold fact contains an explicit evidence-backed canonical "none" entry.

Pass 8 MUST NOT synthesize `none`.

## 5.3 Deferred/unsupported public state

The public 7+1 bucket vocabulary remains:

```text
resolved
unresolved
absent
```

Internal:

```text
DEFERRED_ENTRY
UNSUPPORTED_ENTRY
```

reduce to public `unresolved` when they are slot-relevant.

Their precise internal states remain preserved in projection metadata/diagnostics.

---

# 6. ADMIN Decision F — Determination/Admission is out of scope for this reducer

This bucket reduction does NOT calculate:

```text
Boundary determined / underdetermined
Profile completeness
FormalBoundaryModel consistency
Admission
Release
execution authorization
business decision
```

Therefore a Core Gold case may have a bucket projection that is reproducible while its later `BoundaryResult` expectation depends on a specialized required-elements or stage rule.

Do not use later-stage outcome mismatches to mutate Pass 8 bucket reduction.

Hard invariant:

```text
SLOT_STATUS_REDUCTION_IS_NOT_BOUNDARY_RESULT_REDUCTION
```

---

# 7. ADMIN Decision G — 0.4 task schema/profile structure

Create a formal 0.4 task/7+1 schema that:

1. requires all eight `elements` keys structurally;
2. permits public statuses:
   - `resolved`
   - `unresolved`
   - `absent`
3. rejects resolved empty entries unless protocol-authorized explicit `none` representation is present;
4. does not inject defaults;
5. does not coerce absent/unresolved to resolved;
6. keeps `profile.id` explicit;
7. keeps `profile.required_elements` explicit as an array.

For the formal Core profile artifact:

```json
{
  "id": "org.boundx.core-7plus1",
  "protocol_version": "0.4.0-draft.1",
  "structural_elements": ["I","O","A","P","R","V","C","B"],
  "required_elements": []
}
```

Additional fields may document evidence/projection semantics but may not redefine slots.

Specialized profile artifacts may declare their own `required_elements` only when supported by their stage's frozen evidence. If not uniquely supported:

```text
required_elements_status = NOT_FROZEN
```

Do not block Core Pass 8 on unresolved later-stage profile policies.

---

# 8. ADMIN Decision H — Operator Profile scope

Create:

```text
bxp-core-0.4-gold-v1
```

as the version pin for:

```text
Pass 8 slot projection rule IDs
bucket reduction algorithm
canonical ordering
shared-carrier compatibility checks
```

It MUST NOT define:

```text
FormalBoundaryModel construction
BoundaryResult determination
Admission
Downstream PM conformance
```

Those require later operator/profile contracts.

---

# 9. Required Gold compatibility validation after these decisions

Run two separate validations.

## 9.1 Carrier validation — 100/100

Check all 100 candidate cases for:

```text
protocol_version
eight-slot presence
public status vocabulary
slot-value/evidence structural representability
profile-family registration
```

Expected profile IDs remain unchanged.

## 9.2 Core profile validation — only original Core-profile cases

Use only cases whose actual profile ID is:

```text
org.boundx.core-7plus1
```

to validate the Core profile artifact.

For any case whose later BoundaryResult depends on an unstated specialized requirement (for example a conditional V requirement), classify:

```text
LATER_STAGE_POLICY_NOT_PART_OF_CORE_PROJECTION
```

Do not fail the 7+1 carrier projection solely for that reason.

---

# 10. Status-reduction validation

The current Gold package contains aggregate bucket statuses, not raw candidate ledgers.

Therefore do NOT claim:

```text
the reducer was reconstructed from Gold input
```

Instead perform two independent validations:

### A. Rule-mechanism tests

Create frozen synthetic candidate-ledger cases for:

```text
resolved only              → resolved
resolved + unresolved      → unresolved
resolved + deferred        → unresolved
resolved + unsupported     → unresolved
unresolved only            → unresolved
deferred only              → unresolved
unsupported only           → unresolved
no candidates              → absent
explicit evidence-backed none if supported → per protocol rule
```

### B. Gold compatibility check

Verify the reducer's output vocabulary and representational constraints are compatible with every Gold bucket status, without claiming the Gold is reducer input.

Report separately:

```text
MECHANISM_VALIDATION
GOLD_STATUS_COMPATIBILITY
```

---

# 11. Protocol Manifest

Freeze:

```text
PROTOCOL-MANIFEST.json
```

only when it binds exact hashes for:

```text
BXP-0001 0.4 body
0.4 task/7+1 schema
org.boundx.core-7plus1 profile
profile-family registry
bxp-core-0.4-gold-v1 operator profile
STATUS-REDUCTION-RULES
Core 100 candidate source artifact
compatibility index
```

Manifest must state:

```text
bindable_by_pass8 = true
scope = canonical-7plus1-projection
```

It MUST also state:

```text
formal_boundary_model_authorized = false
boundary_result_authorized = false
admission_authorized = false
downstream_conformance_authorized = false
```

---

# 12. Required outputs

Produce/update in the versioned 0.4 companion package:

```text
schemas/boundx-task-v1.schema.json
profiles/org.boundx.core-7plus1.json
profiles/PROFILE-FAMILY.json
profiles/bxp-core-0.4-gold-v1.json

STATUS-REDUCTION-RULES.json
STATUS-REDUCTION-MECHANISM-TESTS.json
STATUS-REDUCTION-EVIDENCE-MATRIX.json

CORE-GOLD-COMPATIBILITY.json
CORE-PROFILE-COMPATIBILITY.json
PROFILE-FAMILY-COMPATIBILITY.json

PROTOCOL-MANIFEST.json
BXP-0.4-COMPANION-ASSET-REPORT.md
ASSET-INTEGRITY.json
MANIFEST.json
SEAL.json
```

Preserve the original candidate Gold bytes.

---

# 13. Acceptance criteria

Recommend:

```text
BXP_0_4_COMPANION_ASSETS_READY=true
```

if and only if:

```text
authoritative BXP 0.4 body bound
0.4 task schema frozen
Core profile frozen
profile family registry frozen
operator profile frozen
status reducer frozen
status mechanism tests pass
Core 100 carrier compatibility passes
Core-profile subset compatibility passes within Pass 8 scope
manifest hashes valid
historical assets unchanged
no unresolved design ambiguity blocks Canonical 7+1 projection
```

Do not require later-stage specialized Profile policies to be fully frozen.

---

# 14. Stop boundary

Even if accepted:

```text
PASS8_IMPLEMENTATION_AUTHORIZED=false
```

Stop for ADMIN Review.

The next ADMIN action, if assets are ready, will authorize resuming the already-frozen Pass 8 design package against the exact `PROTOCOL-MANIFEST.json`.
