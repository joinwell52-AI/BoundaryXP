# ADMIN TASK — BXP 0.4 Companion Protocol Asset Freeze
## Required before Pass 8 Canonical 7+1 Projection

**Status**: AUTHORIZED FOR PROTOCOL-ASSET COMPLETION ONLY  
**Design authority**: ADMIN / ChatGPT  
**Implementation owner**: Codex  
**Baseline**: Pass 8 binding audit stopped with `BXP_BASELINE_MISMATCH`  
**Goal**: Produce a single internally consistent, version-pinned BXP `0.4.0-draft.1` companion asset bundle that Pass 8 can bind to without falling back to 0.3 or inventing protocol semantics.

---

# 0. Authorization

```text
BXP_0_4_COMPANION_ASSET_FREEZE_AUTHORIZED=true

PASS8_IMPLEMENTATION_AUTHORIZED=false
FORMAL_BOUNDARY_MODEL_AUTHORIZED=false
BOUNDARY_RESULT_AUTHORIZED=false
ADMISSION_AUTHORIZED=false
PUBLICATION_AUTHORIZED=false
RELEASE_AUTHORIZED=false
```

Preserve r01–r30 and the existing Pass 8 gate audit immutably.

Do not modify compiler code in this task.

---

# 1. Accepted audit result

Treat the following as frozen evidence:

- authoritative local Git contains BXP-0001 `0.4.0-draft.1`;
- current working-tree task schema is still `0.3.0-draft.2`;
- no formal `org.boundx.core-7plus1` 0.4 profile was bound;
- no formal repository-local 0.4 conformance vector package was bound;
- exact bucket status-reduction rules were not available as a versioned companion asset.

This is a protocol-asset packaging/completeness gap, not a Pass 8 compiler defect.

---

# 2. Required authoritative inputs

Before creating anything, locate and hash:

```text
A. authoritative BXP-0001 0.4.0-draft.1 body
B. any existing BXP 0.4 Core Gold 100 artifact
C. any existing BXP 0.4 L3 Gold 100 artifact
D. any existing org.boundx.core-7plus1 profile material
E. any existing bxp-core-0.4-gold-v1 operator-profile material
F. existing 0.3 schema/profile assets for structural comparison only
```

Do not treat 0.3 as semantic authority.

If an existing 0.4 Gold artifact is found, preserve its bytes and digest. Do not regenerate it.

---

# 3. Required output layout

Create a new versioned companion directory; do not overwrite historical 0.3 assets:

```text
protocol/versions/0.4.0-draft.1/
    BXP-0001.md
    schemas/
        boundx-task-v1.schema.json
    profiles/
        org.boundx.core-7plus1.json
        bxp-core-0.4-gold-v1.json
    conformance/
        BXP-0.4-CORE-GOLD-100.*
    PROTOCOL-MANIFEST.json
    STATUS-REDUCTION-RULES.json
    ASSET-COMPATIBILITY-REPORT.md
```

If the repository already has a preferred versioned layout, use that layout instead, but record the exact paths.

Do not replace current 0.3 files unless separately authorized.

---

# 4. BXP body handling

The 0.4 BXP body must be copied byte-for-byte from the authoritative local Git object already identified by the audit.

Do not edit the protocol prose in this task.

Record:

```text
source_commit
source_blob_sha
sha256
```

---

# 5. Core Gold handling

If the existing `BXP-0.4-GOLD-100` artifact is available:

- copy it byte-for-byte into the versioned conformance area;
- verify protocol version = `0.4.0-draft.1`;
- verify profile = `org.boundx.core-7plus1`;
- verify operator profile = `bxp-core-0.4-gold-v1`;
- record its original digest and copied digest.

Do not alter expected statuses or normalized values.

If the exact existing Gold artifact is unavailable:

```text
CORE_GOLD_100_UNAVAILABLE
```

STOP. Do not synthesize replacement Gold.

L3 Gold is not required to unblock the Core Pass 8 projection, but if found it may be indexed in the manifest without becoming a Pass 8 dependency.

---

# 6. Task / 7+1 Schema

Create the 0.4 companion task schema from:

1. explicit requirements in BXP-0001 0.4;
2. structures actually exercised by the frozen Core Gold;
3. existing 0.3 schema only as historical structural reference.

Hard rules:

```text
NO_0_3_SEMANTIC_FALLBACK
NO_DEFAULT_INJECTION
NO_UNKNOWN_TO_RESOLVED_COERCION
NO_CORE_SLOT_REDEFINITION
```

The schema must support all eight buckets:

```text
I O A P R V C B
```

and the public bucket statuses required by 0.4:

```text
resolved
unresolved
absent
```

Do not add a new public bucket status in this task.

All Core Gold 7+1 structures must validate against the resulting 0.4 schema representation intended for those vectors.

If a Gold case and the 0.4 body require incompatible structures:

```text
BXP_0_4_BODY_GOLD_CONFLICT
```

STOP and report exact cases.

---

# 7. Formal Core Profile

Create:

```text
profiles/org.boundx.core-7plus1.json
```

The profile must define only what is supported by:

- BXP 0.4 body;
- Core Gold 100;
- explicit prior ADMIN protocol decisions.

It must at minimum bind:

```text
profile_id
protocol_version
element_semantics_refs for I/O/A/P/R/V/C/B
public_status_vocabulary
required/optional element policy if determinable
evidence requirements
unknown-preservation rule
negative-boundary independence
```

Do not infer required-elements policy from one example.

Determine required/optional status by reviewing the complete Core Gold corpus plus the 0.4 body.

If the evidence does not uniquely determine required-elements policy:

```text
ADMIN_DECISION_REQUIRED_REQUIRED_ELEMENTS
```

STOP before claiming the profile is frozen.

---

# 8. Operator Profile

Create:

```text
profiles/bxp-core-0.4-gold-v1.json
```

This is where deterministic projection / reduction rules used by Pass 8 are version-pinned.

It must not redefine BXP core meanings.

It may define:

```text
slot projection rule IDs
bucket status reduction
canonical ordering
Gold compatibility requirements
```

---

# 9. Bucket Status Reduction — required exact rule

The companion package must provide one exact deterministic bucket-reduction algorithm.

The candidate conservative algorithm is:

```text
For one bucket:

1. If one or more slot-relevant candidates are unresolved/deferred/unsupported
   in a way that BXP requires to remain semantically open:
       status = unresolved

2. Else if one or more evidence-backed resolved entries exist:
       status = resolved

3. Else:
       status = absent
```

Additional mandatory constraints:

```text
resolved must not hide slot-relevant unresolved candidates
absent must not mean extraction failure
absent requires complete projection accountability for that slot
resolved empty bucket is forbidden unless BXP 0.4 explicitly defines an
evidence-backed canonical "none" representation
```

Before freezing this algorithm, validate it against the complete Core Gold 100.

If the Gold corpus demonstrates a different rule, do not silently change it.

Produce:

```text
STATUS-REDUCTION-EVIDENCE-MATRIX.json
```

showing every Gold case relevant to mixed/resolved/unresolved/absent behavior.

If multiple algorithms remain equally consistent with BXP + Gold:

```text
ADMIN_DECISION_REQUIRED_STATUS_REDUCTION
```

STOP.

---

# 10. B = Forbidden Boundary

The companion assets must explicitly preserve:

```text
B_IS_INDEPENDENT_FROM_A
B_IS_INDEPENDENT_FROM_R
```

Resource numerical upper bounds must remain R when BXP/Gold classifies them as resource constraints.

Forbidden operations/effects/targets must remain B.

No schema/profile rule may collapse B into A or R.

---

# 11. P = Participants, not authorization

The profile must explicitly state:

```text
PARTICIPANT_IS_NOT_EXECUTION_AUTHORIZATION
```

No task schema/profile field in this companion package may turn a participant/approver/reviewer into execution authorization.

---

# 12. C = Completion, not arbitrary condition

The profile/operator profile must preserve:

```text
C_IS_NOT_GENERIC_CONDITION_BUCKET
```

Only completion/stop/escalation semantics may map to C.

---

# 13. V = task basis/version, not compiler provenance

The profile must preserve:

```text
COMPILER_PROVENANCE_IS_NOT_TASK_VERSION_BASIS
```

Only task-applicable version/evidence/policy/time-basis semantics may map to V.

---

# 14. Protocol Manifest

Create:

```text
PROTOCOL-MANIFEST.json
```

with exact hashes for:

```text
BXP body
task schema
core profile
operator profile
status-reduction rules
Core Gold vectors
optional L3 Gold index
```

Include:

```text
protocol_version = 0.4.0-draft.1
profile_id = org.boundx.core-7plus1
operator_profile_id = bxp-core-0.4-gold-v1
```

Pass 8 must later bind by this manifest, not by filename guessing.

---

# 15. Required validation

Before declaring the package frozen:

1. schema self-validation;
2. all Core Gold 100 version/profile identifiers match;
3. all Gold 7+1 states are representable;
4. status reduction reproduces Gold bucket statuses for the tested projection cases;
5. no 0.3 semantic fallback;
6. manifest hashes match bytes;
7. deterministic re-read/re-validation;
8. historical 0.3 assets unchanged.

Do not implement Pass 8 in this task.

---

# 16. Required outputs

```text
BXP-0.4-COMPANION-ASSET-REPORT.md
PROTOCOL-MANIFEST.json
STATUS-REDUCTION-RULES.json
STATUS-REDUCTION-EVIDENCE-MATRIX.json
CORE-GOLD-COMPATIBILITY.json
SCHEMA-COMPATIBILITY.json
PROFILE-EVIDENCE.json
ASSET-INTEGRITY.json
MANIFEST.json
SEAL.json
```

---

# 17. Acceptance

Recommend:

```text
BXP_0_4_COMPANION_ASSETS_READY=true
```

only if:

```text
authoritative 0.4 body bound
0.4 task schema bound
core profile bound
operator profile bound
exact status reduction bound
Core Gold 100 bound
all required hashes valid
no unresolved protocol design ambiguity
```

If any protocol design ambiguity remains, stop with a precise `ADMIN_DECISION_REQUIRED_*` result.

---

# 18. Stop

Even if successful:

```text
PASS8_IMPLEMENTATION_AUTHORIZED=false
```

Stop for ADMIN Review.

A later ADMIN authorization will resume the already-frozen Pass 8 design package against this exact protocol manifest.
