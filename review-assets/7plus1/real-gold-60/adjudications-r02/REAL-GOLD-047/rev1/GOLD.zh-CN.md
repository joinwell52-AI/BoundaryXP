# REAL-GOLD-047 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-047`
- 原始文件: `source/TASK-20260522-004-ADMIN-to-ME.md`
- SHA-256: `377a1d1c59c04a5cf55c74f8aec053f2146d3063be243d340bed028a577cdc06`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 801) | SOURCE | bug, chosen solution and version |
| E002 | [801, 2247) | SOURCE | code, tests, audit, docs and release scope |
| E003 | [2247, 2927) | SOURCE | risk, human approval and acceptance |
| E004 | [2927, 3060) | SOURCE | post-completion actions |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: v3 spec、Project._apply_init、lifecycle state、audit、现有测试、文档、MCP 工具描述、ISSUE-001 与现有夹生项目。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: v3_init_bugfix_inputs
- Ontology binding: null
- 说明: 现有源码/磁盘状态待执行时核验。

### [O] 交付结果

- Status: `resolved`
- 审定值: 3.0.2 修复、七项 init 测试、audit 扫描、同步文档/MCP 描述、CHANGELOG、REPORT/归档/ISSUE 关闭和迁移。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: protocol_bugfix_release_outputs
- Ontology binding: null
- 说明: 产物未执行。

### [A] 动作

- Status: `resolved`
- 审定值: 修改 _apply_init、增加 lifecycle/audit 测试与扫描、更新文档/工具/版本、在分支测试后经人工批准发布、完成报告归档和迁移。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: gated_v3_protocol_bugfix
- Ontology binding: null
- 说明: 审定不执行修改或迁移。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN 钦定方案并须 mark_human_approved；ME 实施；CI 控制 merge。
- Evidence: E001, E003
- Origin: SOURCE
- Normalization: human_gated_roles
- Ontology binding: null
- 说明: 任务身份不替代发布权限绑定。

### [R] 资源约束

- Status: `resolved`
- 审定值: P0、高风险、3.0.2、七项 init 测试、四种 audit 状态、仅 fresh init 受不可逆目录影响；无时限。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: high_risk_protocol_change_constraints
- Ontology binding: null
- 说明: risk=high 触发 approval 门。

### [V] 版本与依据

- Status: `resolved`
- 审定值: FCoP 3.0.0/3.0.1 spec §1.1/§6、ISSUE-001、TASK-004 草案、Rule 7。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_cited_protocol_basis
- Ontology binding: null
- 说明: 引用正文未验证。

### [C] 完成条件

- Status: `resolved`
- 审定值: 测试全绿，三种 init 产生五桶及三目录且不产生 tasks/log，audit P0/P1 正确，文档同步，CHANGELOG 落地，批准后才发布。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_protocol_fix_acceptance
- Ontology binding: null
- 说明: 条件不是已发布事实。

### [B] 禁止边界

- Status: `resolved`
- 审定值: CI 不绿不得 merge；未批准不得发版；不得把 v2 tasks/log 留给 fresh v3 init；不得影响既有项目。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: protocol_release_prohibitions
- Ontology binding: null
- 说明: 回滚限制保留。

## 4. 第三层：形式化边界模型

### E

$$
\texttt{E=\{spec,apply\_init,lifecycle,audit,tests,docs,MCP,ISSUE-001\}}
$$

### Sigma

$$
\texttt{Sigma.version=3.0.2}
$$

$$
\texttt{Sigma.lifecycle=\{inbox,active,review,done,archive\}}
$$

$$
\texttt{Sigma.v2\_dirs\_forbidden=\{tasks,log\}}
$$

$$
\texttt{Sigma.risk=high}
$$

### Q

$$
\texttt{Q.modify\_apply\_init}
$$

$$
\texttt{Q.ensure\_lifecycle}
$$

$$
\texttt{Q.add\_tests}
$$

$$
\texttt{Q.add\_audit\_scan}
$$

$$
\texttt{Q.sync\_docs}
$$

$$
\texttt{Q.release\_after\_approval}
$$

$$
\texttt{Q.migrate\_existing}
$$

### F

$$
\texttt{F.merge\_without\_CI}
$$

$$
\texttt{F.release\_without\_human\_approval}
$$

$$
\texttt{F.create(tasks|log)\_fresh\_v3}
$$

$$
\texttt{F.affect\_existing\_project}
$$

### K

$$
\texttt{K.tests=pass}
$$

$$
\texttt{K.init\_paths=3}
$$

$$
\texttt{K.audit=\{missing:P0,legacy:P1,v2:none\}}
$$

$$
\texttt{K.human\_approval=mark\_human\_approved}
$$

### Relations

$$
\texttt{human\_approval -> gates -> release}
$$

$$
\texttt{apply\_init -> creates -> lifecycle\_dirs}
$$

$$
\texttt{audit -> detects -> topology\_noncompliance}
$$

### D

$$
\texttt{D.priority=P0}
$$

$$
\texttt{D.risk=high}
$$

$$
\texttt{D.branch=fix/init-v3-topology}
$$

### Phi

$$
\texttt{Phi.human\_approval=absent}
$$

$$
\texttt{Phi.OperatorProfile=absent}
$$

$$
\texttt{Phi.execution=not\_performed}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 保留 init 默认拓扑、测试/audit矩阵、3.0.2 发版、人工批准门及既有项目保护。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{empty}
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
Decidable(K)=\text{PASS}
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
canonical\_boundary\_candidates=1,\quad BoundaryUnique=true
$$

$$
|\Omega_B|=\text{MANY}
$$

### 7. 边界状态

$$
\boxed{BoundaryState=\text{determined}}
$$

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

### 9. 准入

$$
Admission=\text{NOT\_EVALUATED\_PROFILE\_MISSING}
$$

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

应在受控分支跑测试及 audit；发版需可核验的 `mark_human_approved` 与权限绑定。

## 8. Validator Replay

- Source SHA replay: PASS
- Evidence replay: PASS
- Deterministic calculation replay: PASS

## 9. Gold Freeze Gates

| Gate | Status | Basis |
|---|---|---|
| G1 | PASS | 源未改写。 |
| G2 | PASS | SHA 已绑定。 |
| G3 | PASS | 证据可回放。 |
| G4 | PASS | 仅 Source。 |
| G5 | PASS | 未补造批准/测试结果。 |
| G6 | PASS | 未推导发布权限。 |
| G7 | PASS | 7+1 完整。 |
| G8 | PASS | 拓扑模型可复放。 |
| G9 | PASS | fresh 与既有项目边界保留。 |
| G10 | PASS | 无 Profile，正确未评估。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 通过；未生成 ADMIN_GOLD_FROZEN。
