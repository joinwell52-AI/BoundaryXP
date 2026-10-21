# REAL-GOLD-019 / GOLD.en.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-019`
- Source file: `source/TASK-20260509-008-ADMIN-to-ME.md`
- SHA-256: `38ad20b6f941101247abd013fcf0760641a58f5901a6494308df175faf9261c8`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- Status: `GOLD_REVIEW_PASSED`

## 2. Layer 1: Source Evidence

### Full Source

The original source is preserved in source/ without rewriting or translation.

### Evidence Index

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 912) | SOURCE | metadata, scope and migration motivation |
| E002 | [913, 1681) | SOURCE | eight ADMIN decisions defining CLI safety boundary |
| E003 | [1682, 2533) | SOURCE | eight acceptance criteria and execution plan |
| E004 | [2534, 3306) | SOURCE | risk controls and self-review |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. Layer 2: Evidence-linked 7+1

### [I] Input

- Status: `resolved`
- Adjudicated value: 0.7.x docs/agents workspace, target fcop directory, git workspace state, CLI entry point, ADR-0022, and advisory-scan files.
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_workspace_migration_inputs
- Ontology binding: null
- Note: No migration is executed in this adjudication workspace.

### [O] Output

- Status: `resolved`
- Adjudicated value: fcop migrate-workspace subcommand, dry-run output, apply migration and breadcrumb, git-aware strategy, conflict abort, advisory scan, tests, ADR/report/archive.
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_phase_1_outputs
- Ontology binding: null
- Note: Deliverables are not executed facts.

### [A] Actions

- Status: `resolved`
- Adjudicated value: Implement independent CLI subcommand with dry-run by default and movement only under --apply; use git mv for tracked paths otherwise shutil; scan but do not rewrite advisory files.
- Evidence: E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_migration_actions
- Ontology binding: null
- Note: Task actions are not executed.

### [P] Participants

- Status: `resolved`
- Adjudicated value: ADMIN decides solo and ME executes solo; user chooses --apply in their workspace.
- Evidence: E001, E002
- Origin: SOURCE
- Normalization: source_stated_participants
- Ontology binding: null
- Note: No authority is inferred.

### [R] Resources

- Status: `absent`
- Adjudicated value: The source sets no execution deadline or resource budget for this task; default dry-run, exit codes, and --apply define operations and safeguards, while 25 tests and the R1–R3 three-round sequence define delivery and execution plan.
- Evidence: E002, E003, E004
- Origin: SOURCE
- Normalization: no_binding_resource_constraint
- Ontology binding: null
- Note: The formal model retains the distinction between three rounds and the four-commit template; strategy, acceptance counts, and workflow are not resource quotas.

### [V] Version & Provenance

- Status: `resolved`
- Adjudicated value: ADR-0022, ADR-0015, TASK-007, v1.0 RC/Phase 1, and deferred Phase 2 boundary.
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_reference_basis
- Ontology binding: null
- Note: Textual references only.

### [C] Completion

- Status: `resolved`
- Adjudicated value: Eight criteria: help, dry-run, apply, git mv, migrated no-op, both-exist abort=2, advisory scan, and bare-fcop legacy information.
- Evidence: E003, E004
- Origin: SOURCE
- Normalization: explicit_acceptance_conjunction
- Ontology binding: null
- Note: Acceptance is not completion fact.

### [B] Forbidden Boundary

- Status: `resolved`
- Adjudicated value: Do not depend on Project change, mutate by default, auto-merge both-exist, rewrite .gitignore/README advisory files, add runtime dependency, or implement Phase 2 early.
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: explicit_safety_and_scope_boundaries
- Ontology binding: null
- Note: git-aware and shutil fallback are retained.

## 4. Layer 3: Formal Boundary Model

### E

$$
\texttt{E=\{docs\_agents,fcop,CLI,git\_workspace,advisory\_files\}}
$$

### Sigma

$$
\texttt{Sigma.acceptance=8}
$$

$$
\texttt{Sigma.tests=25}
$$

$$
\texttt{Sigma.commit\_count=3}
$$

### Q

$$
\texttt{Q.dry\_run}
$$

$$
\texttt{Q.apply}
$$

$$
\texttt{Q.git\_mv}
$$

$$
\texttt{Q.shutil\_fallback}
$$

$$
\texttt{Q.advisory\_scan}
$$

### F

$$
\texttt{F.default\_mutation}
$$

$$
\texttt{F.auto\_merge\_both\_exist}
$$

$$
\texttt{F.rewrite\_advisory\_files}
$$

$$
\texttt{F.Project\_phase\_2}
$$

$$
\texttt{F.new\_runtime\_dependency}
$$

### K

$$
\texttt{K=A1..A8}
$$

$$
\texttt{K.both\_exist\_exit=2}
$$

$$
\texttt{K.migrated\_apply=no\_op}
$$

### Relations

$$
\texttt{apply -> moves -> docs\_agents\_to\_fcop}
$$

$$
\texttt{tracked\_path -> uses -> git\_mv}
$$

$$
\texttt{untracked\_path -> uses -> shutil}
$$

$$
\texttt{identity\_or\_authority\_binding=unresolved\_not\_inferred}
$$

### D

$$
\texttt{D.default=dry\_run}
$$

$$
\texttt{D.phase=1}
$$

### Phi

$$
\texttt{Phi.execution\_plan\_heading=4\_commit\_template\_not\_task\_requirement}
$$

$$
\texttt{Phi.execution\_rounds=\{R1,R2,R3\}}
$$

$$
\texttt{Phi.prose=3\_commits}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- Adjudication rationale: Migration strategy, eight criteria, safeguards, and the R1–R3 plan are retained; four commits describes the template heading, not an extra round.

## 5. Layer 4: Deterministic Calculations & Adjudication

### 1. Required Deficit

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{empty}
$$

The table contains exactly R1–R3, and the prose explicitly says three commits close this task. “4-commit template” labels the plan template rather than requiring an undefined R4 deliverable, so there is no fourth-round deficit.

### 2. Forbidden Conflict

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

Dry-run does not move directories; only an explicit --apply may do so. An already migrated tree is a no-op, while two existing trees must ABORT with exit 2 rather than being merged automatically.

### 3. Constraint Consistency

$$
Consistency=\text{PASS}
$$

The three-round task plan and four-commit template heading have different semantic roles; the heading cannot become a hard fourth-round constraint. Git-aware movement, shutil fallback, and read-only advisory scanning can coexist.

### 4. Completion Decidability

$$
Decidable(K)=\text{PASS}
$$

The eight acceptance checks cover help, dry-run, apply, git mv, no-op, both-exist ABORT, advisory scanning, and bare CLI compatibility. They are testable; source self-review claims are not treated as test evidence produced by this adjudication.

### 5. Solution Space

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

A satisfying implementation can use an independent CLI with default dry-run, explicit --apply movement, git mv for tracked paths, shutil fallback for others, and an abort on conflict. This checks satisfiability without running a migration.

### 6. Boundary Uniqueness

$$
BoundaryUnique\ne ExecutionPathUnique
$$

$$
canonical\_boundary\_candidates=1,\quad BoundaryUnique=true
$$

$$
|\Omega_B|=\text{MANY}
$$

The R1–R3 delivery boundary is unique, while concrete code structure, tests, and migration paths may vary. Multiple legal implementations do not imply that a fourth delivery round is required.

### 7. Boundary State

$$
\boxed{BoundaryState=\text{determined}}
$$

The source specifies Phase 1 and three delivery rounds; Project workspace_dir and startup detection remain in deferred Phase 2. Determination concerns those textual constraints, not independent verification of the ADR or a user workspace.

### 8. Policy Evaluation

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

ADMIN and ME task roles, and the user's choice to invoke --apply, are not verified authority bindings. Without an OperatorProfile, this adjudication cannot infer policy permission for migration.

### 9. Admission

$$
Admission=\text{NOT\_EVALUATED\_PROFILE\_MISSING}
$$

A determined boundary does not imply admission or authorize this review to move files or run git mv. Admission remains not evaluated without an OperatorProfile.

## 6. Fixed Diff & Output Summary

[I] OK
[O] OK
[A] OK
[P] OK
[R] OK
[V] OK
[C] OK
[B] OK

## 7. Recommendation

Read delivery as the R1–R3 three-round plan stated in both prose and table; “4-commit template” is only a heading. This adjudication neither migrates files nor grants admission or execution authority.

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
| G5 | PASS | The heading names a four-commit template, but the prose closes in three rounds; no fourth round is fabricated. |
| G6 | PASS | No authority binding is inferred. |
| G7 | PASS | 7+1, safeguards, and the distinction between template heading and three-round plan are formalized. |
| G8 | PASS | The determined boundary result replays. |
| G9 | PASS | The three-round boundary is unique; concrete migration execution paths remain many. |
| G10 | PASS | OperatorProfile is missing, so Admission remains not evaluated. |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 pass; the boundary is determined but admission is not evaluated, with no ADMIN_GOLD_FROZEN.
