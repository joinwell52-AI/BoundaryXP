# 7P-CONTRACT-010 — ADMIN Gold Contract Adjudication & Scope-Aware Comparison Contract

## 0. Task identity

- TASK: `7P-CONTRACT-010`
- START_HEAD: `64d33f06eabdd3223670011a03e95df307f27f12`
- Repository: `joinwell52-AI/BoundX`
- Branch: `review/7plus1-parser`
- Previous task: `7P-ARCH-009`
- Previous decision: `GOLD_CONTRACT_REVIEW_REQUIRED`
- Normative method: `docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
- `PRODUCTION_READY=false`

This task records ADMIN adjudication of the six contract questions identified by 009 and freezes a scope-aware comparison contract.

It is **not** a Parser repair task.

Do not modify Parser runtime, QI–QB, models, thresholds, BXP, v0.3, production entry, or any sealed 001–009 evidence.

Original Gold files remain byte-preserved. Any revised active comparison baseline must be emitted as a new versioned contract artifact, never by silently editing historical Gold.

---

## 1. Required reading

Read in full:

1. `docs/tasks/7plus1/CURRENT-TASK.md`
2. this taskbook
3. `docs/reports/7plus1/7P-ARCH-009/REPORT.md`
4. `docs/reports/7plus1/7P-ARCH-009/DECISION.json`
5. `docs/reports/7plus1/7P-ARCH-009/GOLD-CONTRACT-AUDIT.json`
6. `docs/reports/7plus1/7P-ARCH-009/NEXT-TASK-RECOMMENDATION.md`
7. SWAI-009 and SWAI-010 full source and expected files
8. v0.3 §§7, 10, 14.1, 16.1, 16.2, 17, 18.1
9. 008 final r03 traces for SWAI-009 and SWAI-010
10. current comparison tooling used for 007/008/009 diagnostics

---

## 2. ADMIN adjudication — fixed decisions

These decisions are authoritative for this task. Codex verifies and encodes them; it does not re-decide them.

### D1 — SWAI-009:I1 is not a current-task Input

Item:

`SWAI-009:I1 = agent-install-prompt.zh.md`

Source context says the prior prompt existed, was not read by a weaker agent, and did not cover the new bring-up workflow. The current task does **not** explicitly require reading, checking, modifying, or consuming that file as a task object.

ADMIN decision:

```text
CURRENT I: NO
semantic role: BACKGROUND_REFERENCE / prior-art context
historical Gold item: preserve byte-for-byte
active comparison requirement: REMOVE_FROM_CURRENT_I_REQUIRED_SET
```

A lexical mention or background causal explanation is not sufficient to create I.

Do not infer that the file is irrelevant to the document; it remains provenance/background evidence.

### D2 — SWAI-009:V0 belongs to OUTPUT_CONTENT, not root V

`Python >= 3.10` is a requirement that the newly authored bring-up prompt must tell a future agent.

ADMIN decision:

```text
scope = OUTPUT_CONTENT(agent-bringup-prompt)
compare inside owned output-content subgraph
do not project/compare as root current-task V
```

### D3 — SWAI-009:V1 belongs to OUTPUT_CONTENT, not root V

`fcop and fcop-mcp target versions must match` is content of the authored prompt.

Same decision as D2.

### D4 — SWAI-010:V1 belongs to OUTPUT_CONTENT, not root V

`Python >= 3.10` is content of the authored prompt for the future agent.

Same decision as D2.

### D5 — SWAI-010:V2 belongs to OUTPUT_CONTENT, not root V

`latest version / no pinned package version` is content of the authored prompt.

Same decision as D2.

### D6 — SWAI-010:B0 belongs to OUTPUT_CONTENT, not root B

`FORBIDDEN generated prompt hard-codes ==X.Y.Z`

ADMIN decision:

```text
scope = OUTPUT_CONTENT(agent-bringup-prompt)
modality = FORBIDDEN
compare under the owned output-content graph
must NOT project as current-task root B
```

This follows v0.3 §16.2: future-agent prohibitions inside an output do not automatically become current-task B.

---

## 3. Scope-aware comparison contract

Freeze the following comparison rules.

### C1 — Root slots and OUTPUT_CONTENT are separate semantic scopes

Root `I/O/A/P/R/V/C/B` compare only current-task boundary facts.

Owned output-content semantics compare within:

```text
OUTPUT_CONTENT
  owner_output_ids
  owned semantic facts
  local modality / conditions / basis / prohibitions
```

A fact cannot satisfy both scopes merely because its display text matches.

### C2 — Owned content remains first-class semantics

Moving V/B-like semantics into OUTPUT_CONTENT does **not** delete the requirement.

It remains required for full case completeness, but under the output-content subtree.

Therefore:

- it does not count as root V/B MATCH;
- it does count toward owned-content completeness;
- missing owned content still blocks full STANDARD completion.

### C3 — Aggregated human expected entries may be satisfied compositionally

A human expected entry such as “three writer union-scan repairs” may be satisfied by multiple typed witnesses only when all are proven to share:

- the required semantic owner;
- the required member set/cardinality;
- compatible action/object roles;
- compatible modality;
- compatible scope;
- required set/condition expression;
- complete provenance.

No single leaf string or one member may satisfy the aggregate.

### C4 — Internal decomposition is not an extra boundary fact

Intermediate nodes, relations, frame records, helper declarations, or proof witnesses do not count as false-defined extras if they are internal evidence and do not project as additional top-level canonical boundary obligations.

### C5 — Unlisted top-level boundary semantics remain blocking

If the Parser projects a source-supported but semantically distinct **top-level current-task boundary fact** that is absent from the active expected contract, the comparator must flag it for ADMIN review / false-defined assessment.

Do not globally ignore extras.

### C6 — Role requires relation, not lexical presence

A path, version, identifier, person, or document mentioned in source becomes I/O/V/P/B only through an admissible typed relation/role and scope.

Lexical occurrence alone cannot satisfy the expected slot.

### C7 — Status comparison follows semantic completeness

`RESOLVED / ABSENT / UNRESOLVED / PARSER_COVERAGE_FAILURE` must be compared after scope-aware semantic requirements are evaluated.

Do not clear coverage failure merely because local contract tests pass.

---

## 4. Required active contract artifact

Create a new versioned adjudicated comparison contract, for example:

`fixtures/7plus1/standard-contract/v0.3-admin-20261002/`

It must reference historical Gold by hash and contain only contract overlays / scope adjudications needed for active comparison.

Do not overwrite:

- historical expected files;
- source files;
- previous comparison ledgers.

At minimum include:

- removal overlay for SWAI-009:I1 from current-I required set;
- scope relocation overlays for the five owned-content units;
- aggregate comparison rules;
- explicit historical Gold SHA256 references.

---

## 5. Offline re-evaluation on frozen 008 traces

Using **only frozen 008 r03 traces**, rerun the comparator under the new adjudicated contract.

No Parser rerun and no Parser modification.

Report:

- root I/O/A/P/R/V/C/B MATCH counts before → adjudicated;
- owned-content MATCH / missing counts;
- CASE_IOA_JOINT before → adjudicated;
- STANDARD_PARSED before → adjudicated;
- false-defined / wrong-binding changes caused purely by contract correction;
- which failures remain undeniable Parser/frontend implementation gaps.

This is a comparator/contract re-evaluation only.

Any result must explicitly state:

`PARSER_UNCHANGED=true`

---

## 6. Architecture recovery decision after adjudication

After re-evaluation, determine the next implementation path using 009 evidence plus the corrected contract.

Allowed outcomes:

### `AUTHORIZE_V0_3_SYSTEMIC_COMPOSITION_REPAIR`

Use only if:

- corrected Gold/contract still leaves the dominant failure in the shared owner/layer/composition abstractions;
- v0.3 remains representationally sufficient;
- no evidence requires v0.4.

Then recommend one bounded implementation task around the four root abstractions R1–R4 from 009, not phrase-by-phrase repair.

### `AUTHORIZE_HYBRID_PROPOSAL_EXPERIMENT`

Use only if:

- contract correction is insufficient;
- upstream candidate discovery remains dominant;
- existing deterministic downstream can be meaningfully tested with external proposals;
- next step is a non-Gold controlled experiment, not production adoption.

### `V0_4_METHOD_REVIEW_REQUIRED`

Use only with a concrete representability counterexample after adjudication.

### `FURTHER_CONTRACT_REVIEW_REQUIRED`

Use only if the six decisions expose additional unresolved contract ambiguities.

---

## 7. Required artifacts

Create:

`docs/reports/7plus1/7P-CONTRACT-010/`

At minimum:

- `REPORT.md`
- `ADMIN-ADJUDICATION.json`
- `SCOPE-AWARE-COMPARISON-CONTRACT.md`
- `HISTORICAL-GOLD-HASHES.json`
- `ACTIVE-CONTRACT-OVERLAY.json`
- `OFFLINE-REEVALUATION.json`
- `REMAINING-IMPLEMENTATION-GAPS.json`
- `RECOVERY-DECISION.json`
- `NEXT-TASK-RECOMMENDATION.md`
- `CHANGED-FILES.txt`
- `VERIFY.json`
- `MANIFEST.json`
- `SHA256SUMS.txt`
- `SEAL.md`
- `SEAL-VERIFICATION.json`

---

## 8. Hard rules

- no Parser runtime modification;
- no Gold overwrite;
- no source modification;
- no QI–QB/projection modification;
- no model/threshold modification;
- no v0.3 modification;
- no production switch;
- no merge/release/tag;
- historical Gold remains auditable;
- active overlay must be explicit and hash-linked;
- do not use contract correction to erase genuine Parser omissions.

---

## 9. Final return format

Return:

- TASK;
- commit hash;
- six ADMIN adjudication outcomes;
- historical Gold preserved=true/false;
- parser unchanged=true/false;
- root slot counts before → adjudicated;
- owned-content counts before → adjudicated;
- CASE_IOA_JOINT before → adjudicated;
- STANDARD_PARSED before → adjudicated;
- remaining systemic root abstractions;
- recovery decision;
- exact next-task recommendation;
- Manifest / SHA256SUMS / SEAL;
- confirmation of no merge/release/tag/production switch;
- `STATUS=WAITING_ADMIN_REVIEW`.
