# REAL-GOLD-018 / GOLD.en.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-018`
- Source file: `source/TASK-20260509-007-ADMIN-to-ME.md`
- SHA-256: `8c389de9eca92721286a1f6d8afea2dad33ad97dd285de7513a8393ab4cc8811`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- Status: `GOLD_REVIEW_PASSED`

## 2. Layer 1: Source Evidence

### Full Source

The original source is preserved in source/ without rewriting or translation.

### Evidence Index

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 1190) | SOURCE | metadata, scope, and why-now facts |
| E002 | [1191, 4852) | SOURCE | seven ADMIN decisions defining event types, polling, callbacks, deduplication, and exclusions |
| E003 | [4853, 7037) | SOURCE | twelve acceptance criteria, four-round plan, and quality constraints |
| E004 | [7038, 8819) | SOURCE | risk, reviewer boundaries, and signoff |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. Layer 2: Evidence-linked 7+1

### [I] Input

- Status: `resolved`
- Adjudicated value: event.schema.json, ADR-0018/0015, event stubs from TASK-005/006, Project state, filesystem snapshots, and existing tests.
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_event_wiring_inputs
- Ontology binding: null
- Note: No OS watcher or external filesystem is accessed.

### [O] Output

- Status: `resolved`
- Adjudicated value: Event model, a 12-value enum, polling/state-diff, subscription API, synchronous emitter, deduplication, tests, snapshot, ADR, report, archive, commits, and push.
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_event_reference_implementation_outputs
- Ontology binding: null
- Note: Outputs do not mean execution has occurred.

### [A] Actions

- Status: `unresolved`
- Adjudicated value: Use four commits to implement events module, state diff, subscription and poll_once, integrate boundary/failure stubs, tests, and documentation closeout; however, the complete allocation of 12 events between polling and synchronous callback paths is not uniquely determined.
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_actions_with_source_path_count_ambiguity
- Ontology binding: null
- Note: Source calls file events 11, names 8 (actually lists 7), and calls synchronous events 5.

### [P] Participants

- Status: `resolved`
- Adjudicated value: ADMIN originates; ME executes solo; caller explicitly calls poll_once, while host adapter owns background loop or OS watcher.
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: source_stated_actor_split
- Ontology binding: null
- Note: No authority is inferred.

### [R] Resources

- Status: `unresolved`
- Adjudicated value: Fourth of seven abstractions, four commits, 12 event types, minimum test counts, and cross-OS mtime ±1 second handling; however, one decision gives three file-event counts: 11, 8, and an actual list of 7.
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: source_stated_counts_with_internal_ambiguity
- Ontology binding: null
- Note: No value is chosen to replace another.

### [V] Version & Provenance

- Status: `resolved`
- Adjudicated value: ADR-0018, ADR-0015, TASK-005, TASK-006, TASK-008, TASK-010, event.schema.json, and v1.0/v1.x boundaries.
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_reference_basis
- Ontology binding: null
- Note: References only.

### [C] Completion

- Status: `resolved`
- Adjudicated value: A1–A12: module, model and enum, subscription/poll, boundary/failure/session integration, role switch, deduplication, schema, snapshot, ADR, report/archive/commits/push.
- Evidence: E003, E004
- Origin: SOURCE
- Normalization: explicit_acceptance_conjunction
- Ontology binding: null
- Note: Acceptance is not completed fact.

### [B] Forbidden Boundary

- Status: `resolved`
- Adjudicated value: Do not add EVENT file envelopes, deviate from the 12-value enum, add background thread/asyncio polling, persist event streams, use OS filesystem watchers, break TASK-006 tests, or add migration section or MCP tool.
- Evidence: E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_scope_and_side_effect_boundaries
- Ontology binding: null
- Note: Host-adapter responsibility remains external.

## 4. Layer 3: Formal Boundary Model

### E

$$
\texttt{E=\{Event,EventType,WatcherState,Project,filesystem\_state\}}
$$

### Sigma

$$
\texttt{Sigma.event\_types=12}
$$

$$
\texttt{Sigma.polling\_file\_count∈\{11,8,7\}}
$$

$$
\texttt{Sigma.sync\_callbacks=5}
$$

$$
\texttt{Sigma.acceptance=12}
$$

$$
\texttt{Sigma.commits=4}
$$

### Q

$$
\texttt{Q.compute\_diff}
$$

$$
\texttt{Q.subscribe\_events}
$$

$$
\texttt{Q.poll\_once}
$$

$$
\texttt{Q.emit\_event}
$$

### F

$$
\texttt{F.EVENT\_envelope}
$$

$$
\texttt{F.background\_polling}
$$

$$
\texttt{F.event\_persistence}
$$

$$
\texttt{F.OS\_watcher}
$$

$$
\texttt{F.migration\_section}
$$

$$
\texttt{F.MCP\_subscribe\_tool}
$$

### K

$$
\texttt{K=A1..A12}
$$

$$
\texttt{K.EventType=12}
$$

$$
\texttt{K.explicit\_polling}
$$

### Relations

$$
\texttt{poll\_once -> computes -> state\_diff}
$$

$$
\texttt{subscribe\_events -> receives -> Event}
$$

$$
\texttt{boundary\_and\_failure\_paths -> emit -> Event}
$$

$$
\texttt{identity\_or\_authority\_binding=unresolved\_not\_inferred}
$$

### D

$$
\texttt{D.event\_sources=\{polling,synchronous\}}
$$

$$
\texttt{D.mtime\_tolerance=1s}
$$

### Phi

$$
\texttt{Phi.file\_events\_claimed\_as\_11}
$$

$$
\texttt{Phi.file\_events\_claimed\_as\_8}
$$

$$
\texttt{Phi.file\_events\_explicitly\_named\_as\_7}
$$

$$
\texttt{Phi.synchronous\_events=5}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- Adjudication rationale: All 12 events, both trigger paths, prohibitions, and the three-way discrepancy in file-event count/allocation are retained without guessed correction.

## 5. Layer 4: Deterministic Calculations & Adjudication

### 1. Required Deficit

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{12 个事件在 polling 与同步 callback 两条路径中的唯一完整分配；文件类事件的确切基数}
$$

### 2. Forbidden Conflict

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

### 3. Constraint Consistency

$$
Consistency=\text{PASS}
$$

### 4. Completion Decidability

$$
Decidable(K)=\text{FAIL}
$$

### 5. Solution Space

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

### 6. Boundary Uniqueness

$$
BoundaryUnique\ne ExecutionPathUnique
$$

$$
canonical\_boundary\_candidates=3,\quad BoundaryUnique=false
$$

$$
|\Omega_B|=\text{MANY}
$$

### 7. Boundary State

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

### 8. Policy Evaluation

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

### 9. Admission

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

## 6. Fixed Diff & Output Summary

[I] OK
[O] OK
[A] UNRESOLVED
[P] OK
[R] UNRESOLVED
[V] OK
[C] OK
[B] OK

## 7. Recommendation

Keep blocked; ADMIN must list the single trigger source for each of the 12 events and correct the file-event count. Implementation must not treat the discrepancy as a typo.

## 8. Validator Replay

- Source SHA replay: PASS
- Evidence replay: PASS
- Deterministic calculation replay: PASS

## 9. Gold Freeze Gates

| Gate | Status | Basis |
|---|---|---|
| G1 | PASS | Frozen source matches. |
| G2 | PASS | SHA-256 matches manifest. |
| G3 | PASS | Four evidence ranges replay. |
| G4 | PASS | Only Source and empty Context are used. |
| G5 | PASS | Count discrepancy is not corrected into an assumed fact. |
| G6 | PASS | No authority binding is inferred. |
| G7 | PASS | 7+1, trigger paths, and uncertainty are formalized. |
| G8 | PASS | Discrepancy and underdetermined result replay. |
| G9 | PASS | Boundary non-uniqueness is correctly identified. |
| G10 | PASS | OperatorProfile is missing and underdetermination correctly blocks Admission. |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 pass; adjudication retains underdetermination and block, with no ADMIN_GOLD_FROZEN.
