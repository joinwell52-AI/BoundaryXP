# REAL-GOLD-019 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-019`
- 原始文件: `source/TASK-20260509-008-ADMIN-to-ME.md`
- SHA-256: `38ad20b6f941101247abd013fcf0760641a58f5901a6494308df175faf9261c8`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 912) | SOURCE | metadata, scope and migration motivation |
| E002 | [913, 1681) | SOURCE | eight ADMIN decisions defining CLI safety boundary |
| E003 | [1682, 2533) | SOURCE | eight acceptance criteria and execution plan |
| E004 | [2534, 3306) | SOURCE | risk controls and self-review |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: 0.7.x docs/agents 工作区、目标 fcop 目录、git 工作区状态、CLI entry point、ADR-0022 与顾问扫描文件。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_workspace_migration_inputs
- Ontology binding: null
- 说明: 不对本审定工作区执行迁移。

### [O] 交付结果

- Status: `resolved`
- 审定值: fcop migrate-workspace 子命令、dry-run 输出、apply 迁移与 breadcrumb、git-aware 策略、冲突 abort、顾问扫描、测试、ADR/报告/归档。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_phase_1_outputs
- Ontology binding: null
- 说明: 交付不是已执行事实。

### [A] 动作

- Status: `resolved`
- 审定值: 实现独立 CLI 子命令，以 dry-run 为默认，--apply 才移动目录；对 tracked path 用 git mv，否则 shutil；扫描但不改写顾问文件。
- Evidence: E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_migration_actions
- Ontology binding: null
- 说明: 不执行 task 内动作。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN solo 自定并由 ME solo 执行；用户负责在其工作区选择 --apply。
- Evidence: E001, E002
- Origin: SOURCE
- Normalization: source_stated_participants
- Ontology binding: null
- 说明: 不推导权限。

### [R] 资源约束

- Status: `unresolved`
- 审定值: 默认 dry-run、apply 的退出码与 no-op/ABORT 条件、25 测试和既有回归约束已明确；但标题称四提交模板，表中只给 R1–R3 且正文称三提交收口。
- Evidence: E002, E003, E004
- Origin: SOURCE
- Normalization: source_stated_constraints_with_commit_count_ambiguity
- Ontology binding: null
- 说明: 不假定遗漏的第四轮。

### [V] 版本与依据

- Status: `resolved`
- 审定值: ADR-0022、ADR-0015、TASK-007、v1.0 RC/Phase 1 与 Phase 2 延后边界。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_reference_basis
- Ontology binding: null
- 说明: 仅记录文本引用。

### [C] 完成条件

- Status: `resolved`
- 审定值: 八项验收：help、dry-run、apply、git mv、已迁移 no-op、both-exist abort=2、顾问扫描与 bare fcop legacy 信息。
- Evidence: E003, E004
- Origin: SOURCE
- Normalization: explicit_acceptance_conjunction
- Ontology binding: null
- 说明: 验收不是完成事实。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 不得依赖 Project 改造、默认动盘、自动合并 both-exist、改写 .gitignore/README 等顾问文件、引入 runtime 依赖或提前实现 Phase 2。
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: explicit_safety_and_scope_boundaries
- Ontology binding: null
- 说明: 保留 git-aware 与 shutil fallback。

## 4. 第三层：形式化边界模型

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
\texttt{Sigma.commit\_count∈\{3,4\}}
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
\texttt{Phi.execution\_plan\_heading=4\_commits}
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

- 审定说明: 迁移策略、八验收、所有保护边界和提交数的原文差异均保留。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{第四提交的范围，或四提交标题应被更正为三提交}
$$

### 2. 禁止边界冲突

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

### 3. 约束一致性

$$
Consistency=\text{PASS}
$$

### 4. 完成条件可判定性

$$
Decidable(K)=\text{FAIL}
$$

### 5. 合法解空间

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

### 6. 边界唯一性

$$
BoundaryUnique\ne ExecutionPathUnique
$$

$$
canonical\_boundary\_candidates=2,\quad BoundaryUnique=false
$$

$$
|\Omega_B|=\text{MANY}
$$

### 7. 边界状态

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

### 9. 准入

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

## 6. Fixed Diff & Output Summary

[I] OK
[O] OK
[A] OK
[P] OK
[R] UNRESOLVED
[V] OK
[C] OK
[B] OK

## 7. Recommendation

保持阻断，要求 ADMIN 确认三提交还是四提交，并在四提交时列出 R4 范围；不得由实现推断。

## 8. Validator Replay

- Source SHA replay: PASS
- Evidence replay: PASS
- Deterministic calculation replay: PASS

## 9. Gold Freeze Gates

| Gate | Status | Basis |
|---|---|---|
| G1 | PASS | 冻结源文件一致。 |
| G2 | PASS | SHA-256 与清单一致。 |
| G3 | PASS | 四段证据可回放。 |
| G4 | PASS | 仅使用 Source 与空 Context。 |
| G5 | PASS | 未补造第四提交。 |
| G6 | PASS | 未推导权限绑定。 |
| G7 | PASS | 7+1、迁移保护与歧义均形式化。 |
| G8 | PASS | 未定结果可重放。 |
| G9 | PASS | 正确识别边界不唯一。 |
| G10 | PASS | 缺少 OperatorProfile，且未定边界正确阻断 Admission。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 均通过；保留未定与阻断，未生成 ADMIN_GOLD_FROZEN。
