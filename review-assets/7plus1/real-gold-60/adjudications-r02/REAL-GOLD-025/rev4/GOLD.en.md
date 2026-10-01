# REAL-GOLD-025 / GOLD.en.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-025`
- Source file: `source/TASK-20260512-001-ADMIN-to-ME.md`
- SHA-256: `f34c2fb2578312a6a97a2d3904dfd967d40089244e71e4ec73725cda47c648c0`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- Status: `GOLD_REVIEW_PASSED`

## 2. Layer 1: Source Evidence

### Full Source

The original source is preserved in source/ without rewriting or translation.

### Evidence Index

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 1307) | SOURCE | metadata, PM #50 incident narrative, and root cause |
| E002 | [1308, 3919) | SOURCE | D1-D6 deliverables including binding gate and deny-list |
| E003 | [3920, 4608) | SOURCE | acceptance criteria and risk/rollback |
| E004 | [4609, 5282) | SOURCE | cross-work references, state machine, and ADMIN decision request |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. Layer 2: Evidence-linked 7+1

### [I] Input

- Status: `resolved`
- Adjudicated value: fcop-mcp write-side tools, set_project_dir schema, process cwd, project_dir, USER HOME/system roots, fcop_report, schemas, release notes, and test suite.
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_binding_guard_inputs
- Ontology binding: null
- Note: Bridgeflow incident path is source evidence only and is not accessed.

### [O] Output

- Status: `resolved`
- Adjudicated value: Binding guards for all write-side MCP tools, a protected-path deny-list, fcop_report warning, machine-readable schema fields, tests, and 1.4 release notes; OPS must enumerate and confirm the final tool list during implementation.
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_outputs_with_required_runtime_enumeration
- Ontology binding: null
- Note: The candidate list is not exhaustive; enumeration is an explicit implementation step, not a requirement that the source pre-list every tool.

### [A] Actions

- Status: `unresolved`
- Adjudicated value: OPS enumerates all write-side tools; ME implements binding and deny-list guards, warning, schema, tests, and upgrade notice. The error text allows restarting with project-root cwd, while D1 forbids default cwd fallback; whether restart establishes explicit binding is undefined.
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_guard_actions_with_unresolved_startup_binding
- Ontology binding: null
- Note: Do not assume the candidate list is exhaustive or that setting cwd automatically counts as explicit binding.

### [P] Participants

- Status: `resolved`
- Adjudicated value: ME proposes and implements only after approval, ADMIN decides whether to approve, adjust, or defer, and OPS confirms the write-side tool list during implementation; no verifiable current approval record is supplied.
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: conditional_responsibility_without_authority_inference
- Ontology binding: null
- Note: Front-matter done and the body's proposal-time state may describe different times; neither proves ADMIN GREEN or execution authorization.

### [R] Resources

- Status: `absent`
- Adjudicated value: No binding execution deadline or resource budget is stated; two to three hours is only a proposal estimate.
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: no_binding_resource_constraint
- Ontology binding: null
- Note: P0/high denotes priority and risk; the path list defines forbidden scope, six test classes define acceptance, and the rollback target is version information.

### [V] Version & Provenance

- Status: `resolved`
- Adjudicated value: Target fcop-mcp v1.4 and rollback v1.3.x; the PM #50 incident report, ADR-0033/0034, and Bridgeflow §5 are cited but their bodies are not supplied.
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: target_and_rollback_versions_with_unavailable_references
- Ontology binding: null
- Note: Rule 7 from the prior candidate is absent from this source and must not be invented.

### [C] Completion

- Status: `unresolved`
- Adjudicated value: Seven criteria cover D1–D6 and clean-environment PM #50 reproduction refusing writes with zero USER HOME files; whether startup cwd counts as explicit binding changes D1 and reproduction-test expectations.
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: acceptance_with_unresolved_startup_binding_semantics
- Ontology binding: null
- Note: Acceptance does not prove completion; one startup-binding interpretation must not be selected without evidence.

### [B] Forbidden Boundary

- Status: `resolved`
- Adjudicated value: No default cwd fallback without explicit binding; reject binding to USER HOME or Unix/drive/system roots; do not wrongly reject valid project subdirectories under home; PM #50 reproduction must not write to disk; do not implement before ADMIN GREEN.
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_safety_and_approval_boundary
- Ontology binding: null
- Note: These prohibitions constrain implementation and tool behavior; this review has not verified live authority.

## 4. Layer 3: Formal Boundary Model

### E

$$
\texttt{E=\{MCP\_server,write\_tools,project\_dir,cwd,protected\_paths,schemas,fcop\_report\}}
$$

### Sigma

$$
\texttt{Sigma.candidate\_write\_tools≥8}
$$

$$
\texttt{Sigma.deny\_list=\{home,root,drive\_root,appdata,system\_roots\}}
$$

$$
\texttt{Sigma.acceptance=7}
$$

$$
\texttt{Sigma.home\_subdirectories=allowed\_when\_real\_project\_root}
$$

### Q

$$
\texttt{Q.set\_project\_dir}
$$

$$
\texttt{Q.validate\_binding}
$$

$$
\texttt{Q.validate\_protected\_path}
$$

$$
\texttt{Q.fcop\_report\_warning}
$$

### F

$$
\texttt{F.unbound\_cwd\_fallback}
$$

$$
\texttt{F.write\_to\_protected\_path}
$$

$$
\texttt{F.home\_subdirectory\_denial}
$$

$$
\texttt{F.execute\_before\_ADMIN\_GREEN}
$$

### K

$$
\texttt{K=D1..D6}
$$

$$
\texttt{K.PM50\_reproduction}
$$

$$
\texttt{K.write\_side\_tool\_enumeration\_by\_OPS}
$$

### Relations

$$
\texttt{explicit\_binding -> gates -> write\_tool}
$$

$$
\texttt{protected\_path -> refuses -> write\_operation}
$$

$$
\texttt{ADMIN\_GREEN -> enables -> implementation}
$$

$$
\texttt{identity\_or\_authority\_binding=unresolved\_not\_inferred}
$$

### D

$$
\texttt{D.binding\_required=true}
$$

$$
\texttt{D.allowed\_project\_dir\_class=real\_project\_root}
$$

### Phi

$$
\texttt{Phi.write\_tool\_universe=runtime\_enumeration\_required}
$$

$$
\texttt{Phi.ADMIN\_GREEN=unverified}
$$

$$
\texttt{Phi.frontmatter\_status=done}
$$

$$
\texttt{Phi.state\_machine\_initial=proposed}
$$

$$
\texttt{Phi.status\_time\_relation=unresolved}
$$

$$
\texttt{Phi.startup\_cwd\_counts\_as\_explicit\_binding=unresolved}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- Adjudication rationale: Incident background, runtime enumeration of all write-side tools, exact protected-path refusal, home-subdirectory exception, approval gate, and startup-cwd binding ambiguity are retained; front-matter done does not automatically override the body's proposal-time state.

## 5. Layer 4: Deterministic Calculations & Adjudication

### 1. Required Deficit

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{重启 MCP 并将 cwd 设为项目根目录是否建立 explicit binding，以及与禁止默认 cwd 兜底的关系}
$$

D1 requires explicit binding and forbids default cwd fallback, while the error text suggests restarting with project-root cwd. The source does not define how that restart establishes explicit binding.

### 2. Forbidden Conflict

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

The proposed guards, protected-path refusal, and approval-gated implementation do not directly violate a source prohibition. Front-matter done does not prove approval had already occurred during the proposal.

### 3. Constraint Consistency

$$
Consistency=\text{PASS}
$$

The statements can coexist if restarting entails a separate explicit startup binding, but not if merely changing cwd grants write access. The source does not eliminate every consistent interpretation.

### 4. Completion Decidability

$$
Decidable(K)=\text{FAIL}
$$

The seven acceptance items define a test framework, but D1's startup-binding predicate is unclear. The same restart test could yield different verdicts under different readings.

### 5. Solution Space

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

At least a set_project_dir-only reading and an explicitly confirmed startup-binding reading remain candidates. Both must respect protected-path refusal and the ADMIN gate.

### 6. Boundary Uniqueness

$$
BoundaryUnique\ne ExecutionPathUnique
$$

$$
canonical\_boundary\_candidates=2,\quad BoundaryUnique=false
$$

$$
|\Omega_B|=\text{MANY}
$$

The two readings change whether a write can proceed without set_project_dir, so the boundary is not unique. OPS's runtime tool enumeration is not another boundary to guess in advance.

### 7. Boundary State

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

The decisive gap concerns startup cwd versus explicit binding. Front-matter done and the body's initial proposed state may describe different times and are not necessarily contradictory.

### 8. Policy Evaluation

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

No OperatorProfile or verifiable current ADMIN approval is supplied. Role labels and historical status cannot substitute for Host policy evaluation.

### 9. Admission

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

Startup-binding semantics remain boundary-changing, so admission is blocked. This review invokes no write-side tool, touches no USER HOME files, and performs no incident reproduction.

## 6. Fixed Diff & Output Summary

[I] OK
[O] OK
[A] UNRESOLVED
[P] OK
[R] ABSENT
[V] OK
[C] UNRESOLVED
[B] OK

## 7. Recommendation

Keep blocked. Clarify whether restarting MCP with project-root cwd establishes explicit binding and how this differs from forbidden default cwd fallback. OPS must still enumerate every write-side tool during implementation, and the Host must separately verify ADMIN's A/B/C decision. Neither the candidate list nor `done` authorizes execution.

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
| G5 | PASS | No OPS enumeration or ADMIN approval is fabricated. |
| G6 | PASS | No authority binding inferred. |
| G7 | PASS | Runtime tool enumeration, approval gate, protected paths, and startup-binding ambiguity are retained. |
| G8 | PASS | Nonempty candidates, deficit, and block replay under the adjudicated interpretation. |
| G9 | PASS | Statuses from potentially different times are not declared contradictory; startup-binding non-uniqueness remains. |
| G10 | PASS | OperatorProfile missing and underdetermination correctly blocks Admission. |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 pass; conclusion is underdetermined and blocked, no ADMIN_GOLD_FROZEN.
