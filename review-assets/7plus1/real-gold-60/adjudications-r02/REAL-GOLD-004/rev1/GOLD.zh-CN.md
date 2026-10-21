# REAL-GOLD-004 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-004`
- 原始文件: `source/TASK-20260427-004-ADMIN-to-ME.md`
- SHA-256: `47dfb331551b6366774d73ebc9bb464416d9a815cf11f6b2c333b4920b6b727f`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 273) | SOURCE | source metadata, assigned participants, release subject, and related issues |
| E002 | [273, 583) | SOURCE | release failure background and all-in-one remediation scope |
| E003 | [583, 947) | SOURCE | protocol-document version and wording changes |
| E004 | [947, 1114) | SOURCE | library audit capability and fcop version target |
| E005 | [1114, 1605) | SOURCE | MCP dependency pin, version, tools, reports, and role lock changes |
| E006 | [1605, 1902) | SOURCE | four required test additions |
| E007 | [1902, 2155) | SOURCE | release infrastructure documentation deliverables |
| E008 | [2155, 2525) | SOURCE | verification, synchronization, closeout, publishing, yank, tag, push, and release actions |
| E009 | [2525, 2768) | SOURCE | explicit acceptance checks and prohibition on restoring an alias |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: 现有 fcop 与 fcop-mcp 源码、列名协议文档和信件、测试与发版文档、0.7.0 包版本和 ISSUE-001/004/005/006 记录。
- Evidence: E001, E002, E003, E004, E005, E006, E007, E009
- Origin: SOURCE
- Normalization: source_stated_release_inputs
- Ontology binding: null
- 说明: 不读取未附带的仓库、PyPI、GitHub、ISSUE 或账本状态。

### [O] 交付结果

- Status: `resolved`
- 审定值: 0.7.1 的 fcop 和 fcop-mcp 版本、更新的规则/协议/信件、审计与角色锁定能力、四项测试、发版文档、报告和关闭的四个 ISSUE，以及列明的发布制品与记录。
- Evidence: E003, E004, E005, E006, E007, E008, E009
- Origin: SOURCE
- Normalization: explicit_071_release_deliverables
- Ontology binding: null
- 说明: 输出只描述应交付的制品与状态，不断言它们已发布。

### [A] 动作

- Status: `resolved`
- 审定值: 按 A–F 的 24 项要求更新文档、库和 MCP，新增审计、工具和测试，运行列明验证、同步规则、完成归档与 ISSUE 关闭，并执行构建、检查、上传、yank、打标签、推送和发布动作。
- Evidence: E003, E004, E005, E006, E007, E008
- Origin: SOURCE
- Normalization: explicit_end_to_end_release_actions
- Ontology binding: null
- 说明: 动作列表不构成 BoundaryXP 的执行授权。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN 是任务发起主体，ME 是任务接收主体；fcop_check 的报告面向 ADMIN。
- Evidence: E001, E005
- Origin: SOURCE
- Normalization: symbolic_source_participants_only
- Ontology binding: null
- 说明: 不从 ADMIN、ME 或子 agent 文字推导身份、岗位、职级或权限。

### [R] 资源约束

- Status: `absent`
- 审定值: 原文要求立即补救和不延后，但未给出可计算的截止时间、预算、配额或资源上限。
- Evidence: E002
- Origin: SOURCE
- Normalization: absent_quantitative_resource_constraint
- Ontology binding: null
- 说明: 紧急措辞不被转换为数值资源约束。

### [V] 版本与依据

- Status: `resolved`
- 审定值: fcop-rules 1.7.0→1.8.0、fcop-protocol 1.5.0→1.6.0、fcop 与 fcop-mcp 0.7.0→0.7.1、ISSUE-001/004/005/006，以及 Rule 1、Rule 5、Rule 0.a.1。
- Evidence: E002, E003, E004, E005, E008
- Origin: SOURCE
- Normalization: source_stated_version_and_rule_references
- Ontology binding: null
- 说明: 只保留原文版本与规则引用，不验证外部包仓库或规则正文。

### [C] 完成条件

- Status: `resolved`
- 审定值: pytest -x 与 ruff check 通过；uvx 刷新后的 fcop-mcp 可启动 fcop_report 与 fcop_check；pip 显示两个包均为 0.7.1；旧 unbound_report 调用仍报 0.7.0 错误；四个 ISSUE closed 且对应 REPORT 落盘。
- Evidence: E008, E009
- Origin: SOURCE
- Normalization: explicit_release_acceptance_conjunction
- Ontology binding: null
- 说明: 这些是任务验收要求，不是本次审定已执行的结果。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 不得延后任何列明条目；不得保留 AMEND-* 或 *-v2.md 示例；不得回插 unbound_report alias；first-write-wins 必须拒绝跨 sender 二次写入。
- Evidence: E002, E003, E005, E009
- Origin: SOURCE
- Normalization: explicit_nondeferral_and_nonregression_boundaries
- Ontology binding: null
- 说明: 不加入未给出的发布审批、凭据或生产策略。

## 4. 第三层：形式化边界模型

### E

$$
\texttt{E.library = fcop}
$$

$$
\texttt{E.mcp = fcop-mcp}
$$

$$
\texttt{E.docs = \{fcop-rules.mdc, fcop-protocol.mdc, letter-to-admin.zh/en.md\}}
$$

$$
\texttt{E.issues = \{ISSUE-001, ISSUE-004, ISSUE-005, ISSUE-006\}}
$$

### Sigma

$$
\texttt{Sigma.fcop\_version = 0.7.1}
$$

$$
\texttt{Sigma.mcp\_version = 0.7.1}
$$

$$
\texttt{Sigma.rules\_version = 1.8.0}
$$

$$
\texttt{Sigma.protocol\_version = 1.6.0}
$$

$$
\texttt{Sigma.mcp\_fcop\_pin = >=0.7,<0.8}
$$

### Q

$$
\texttt{Q.update\_protocol\_and\_release\_documents}
$$

$$
\texttt{Q.add\_audit\_drift\_and\_role\_lock}
$$

$$
\texttt{Q.add\_fcop\_check\_and\_report\_extensions}
$$

$$
\texttt{Q.add\_four\_tests}
$$

$$
\texttt{Q.run\_validation\_sync\_closeout\_and\_release\_steps}
$$

### F

$$
\texttt{F.defer\_any\_listed\_item}
$$

$$
\texttt{F.retain\_AMEND\_or\_v2\_examples}
$$

$$
\texttt{F.reinsert\_unbound\_report\_alias}
$$

$$
\texttt{F.allow\_cross\_sender\_second\_write}
$$

### K

$$
\texttt{K = pytest\_x\_green AND ruff\_clean AND refreshed\_mcp\_tools\_start AND package\_versions\_equal\_071 AND legacy\_unbound\_report\_errors AND four\_issues\_closed\_with\_reports}
$$

### Relations

$$
\texttt{ADMIN -> assigns -> ME}
$$

$$
\texttt{session\_id -> first\_sender -> role\_lock}
$$

$$
\texttt{fcop\_check -> reports\_to -> ADMIN}
$$

$$
\texttt{identity\_or\_authority\_binding = unresolved\_not\_inferred}
$$

### D

$$
\texttt{D.rule\_versions = \{1.8.0, 1.6.0\}}
$$

$$
\texttt{D.package\_versions = \{fcop:0.7.1, fcop-mcp:0.7.1\}}
$$

$$
\texttt{D.related\_issues = \{001,004,005,006\}}
$$

$$
\texttt{D.release\_commands = \{uv\_build, twine\_check, twine\_upload, yank, git\_tag\_push, gh\_release\_create\}}
$$

### Phi

$$
\texttt{Phi.release\_is\_all\_in\_one\_no\_deferral}
$$

$$
\texttt{Phi.child\_agent\_inherits\_caller\_identity\_clause}
$$

$$
\texttt{Phi.tripwire\_is\_post\_audit\_not\_write\_path\_exemption}
$$

$$
\texttt{Phi.legacy\_unbound\_report\_remains\_error}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 任务列出的协议、库、MCP、测试、发布基建、验证与发布动作，以及不得延后、不得保留旧文件名示例、不得回插 alias 等边界均被表示；未补造任何外部发布权限、凭据或审批。

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
[R] ABSENT
[V] OK
[C] OK
[B] OK

## 7. Recommendation

实施前应由宿主另行核验 PyPI、GitHub、凭据与发布授权；本审定只固定任务边界和验收，不执行上传、yank、推送或发布。

## 8. Validator Replay

- Source SHA replay: PASS
- Evidence replay: PASS
- Deterministic calculation replay: PASS

## 9. Gold Freeze Gates

| Gate | Status | Basis |
|---|---|---|
| G1 | PASS | 冻结 source 与候选 ZIP 中对应 TASK 的字节一致。 |
| G2 | PASS | 已重算并匹配 source SHA-256。 |
| G3 | PASS | E001–E009 均按 Unicode 码点半开区间回放。 |
| G4 | PASS | 八个槽位仅由 Source 与冻结空 Context 审定。 |
| G5 | PASS | R 保持 absent，未把紧急措辞误作数值资源限制。 |
| G6 | PASS | 未声明 ontology binding，也未从 ADMIN、ME 或子 agent 推导权限。 |
| G7 | PASS | FormalCoverageGap 与 invented_constraints 均为空，所有列明禁止项被保留。 |
| G8 | PASS | 固定模型及计算顺序可重放同一结果。 |
| G9 | PASS | 列明范围、版本、验收与禁止项构成唯一边界；多种执行路径不影响唯一性。 |
| G10 | PASS | OperatorProfile 为 null；Policy 未评估，Admission 正确为 NOT_EVALUATED_PROFILE_MISSING。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 均通过；0.7.1 一条龙发布任务边界已确定，未生成 ADMIN_GOLD_FROZEN。
