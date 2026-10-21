# REAL-GOLD-025 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-025`
- 原始文件: `source/TASK-20260512-001-ADMIN-to-ME.md`
- SHA-256: `f34c2fb2578312a6a97a2d3904dfd967d40089244e71e4ec73725cda47c648c0`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 1307) | SOURCE | metadata, PM #50 incident narrative, and root cause |
| E002 | [1308, 3919) | SOURCE | D1-D6 deliverables including binding gate and deny-list |
| E003 | [3920, 4608) | SOURCE | acceptance criteria and risk/rollback |
| E004 | [4609, 5282) | SOURCE | cross-work references, state machine, and ADMIN decision request |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: fcop-mcp write-side 工具、set_project_dir schema、进程 cwd、project_dir、USER HOME/系统根路径、fcop_report、schema、release notes 与测试套件。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_binding_guard_inputs
- Ontology binding: null
- 说明: Bridgeflow 事件路径仅为原文证据，不访问其目录。

### [O] 交付结果

- Status: `unresolved`
- 审定值: binding 守门、系统路径 deny-list、fcop_report 告警、机器可读 schema 字段、测试和 1.4 release notes；但所有 write-side 工具的最终枚举仍待 OPS 确认。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_outputs_with_open_tool_universe
- Ontology binding: null
- 说明: 候选清单不等于封闭全集。

### [A] 动作

- Status: `unresolved`
- 审定值: 为写侧工具增加 explicit binding 与 deny-list 守门、可视告警、schema 字段、测试和升级说明；但未确定哪些工具属于“所有 write-side 工具”。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: guard_actions_with_unresolved_tool_set
- Ontology binding: null
- 说明: 不得假定候选清单已穷尽。

### [P] 参与主体

- Status: `unresolved`
- 审定值: ME 提出任务并请求 ADMIN 在 A/B/C 中裁决；OPS 被点名确认工具枚举；当前无 ADMIN GREEN 证据。
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: approval_and_responsibility_are_unresolved
- Ontology binding: null
- 说明: frontmatter status=done 与状态机 proposed→等待 ADMIN GREEN 冲突。

### [R] 资源约束

- Status: `resolved`
- 审定值: P0/high；建议 D1–D5 2–3 小时并同步 D6；系统路径列表、六类测试、跨平台精确 home 拒绝、可回退 v1.3.x。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: source_stated_urgency_and_safety_constraints
- Ontology binding: null
- 说明: 估时不是批准。

### [V] 版本与依据

- Status: `resolved`
- 审定值: fcop-mcp v1.4、Rule 7、PM #50、ADR-0033/0034、Bridgeflow §5 与 release notes 引用。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: source_stated_reference_basis
- Ontology binding: null
- 说明: 仅保留引用与事件陈述。

### [C] 完成条件

- Status: `resolved`
- 审定值: 七项验收：D1–D6 和 PM #50 干净环境复现拒绝写盘、USER HOME 零文件。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_acceptance_conjunction
- Ontology binding: null
- 说明: 验收未证明已完成。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 未绑定时不得 cwd 兜底；不得在 USER HOME、Unix/drive/system root 写入；不得拒绝 home 子目录；不得实际写入复现；不得在 ADMIN 未批准时开工。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_safety_and_approval_boundary
- Ontology binding: null
- 说明: 批准前禁止执行优先。

## 4. 第三层：形式化边界模型

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
\texttt{Phi.write\_tool\_universe=awaiting\_OPS\_enumeration}
$$

$$
\texttt{Phi.ADMIN\_GREEN=absent}
$$

$$
\texttt{Phi.frontmatter\_status=done}
$$

$$
\texttt{Phi.state\_machine\_initial=proposed}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 事故背景、守门、拒绝路径、候选工具、审批请求和状态冲突均保留。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{write-side 工具的封闭枚举；OPS 的枚举确认；ADMIN 对 A/B/C 的裁决或 GREEN}
$$

### 2. 禁止边界冲突

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{frontmatter 将任务标为 done，而状态机将本文件落盘时定为 proposed 并要求 ADMIN GREEN 后才 accepted/实施。}
$$

### 3. 约束一致性

$$
Consistency=\text{FAIL}
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
\Omega_B=\text{EMPTY}
$$

### 6. 边界唯一性

$$
BoundaryUnique\ne ExecutionPathUnique
$$

$$
canonical\_boundary\_candidates=0,\quad BoundaryUnique=false
$$

$$
|\Omega_B|=\text{ZERO}
$$

### 7. 边界状态

$$
\boxed{BoundaryState=\text{inconsistent}}
$$

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

### 9. 准入

$$
Admission=\text{BLOCKED\_BOUNDARY\_INCONSISTENT}
$$

## 6. Fixed Diff & Output Summary

[I] OK
[O] UNRESOLVED
[A] UNRESOLVED
[P] UNRESOLVED
[R] OK
[V] OK
[C] OK
[B] OK

## 7. Recommendation

保持阻断。请先由 OPS 确认完整写侧工具清单，再由 ADMIN 明确 A/B/C 裁决并更正任务状态；不得把候选清单或 `done` 当作授权。

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
| G5 | PASS | 未补造 OPS 枚举或 ADMIN 批准。 |
| G6 | PASS | 未推导权限绑定。 |
| G7 | PASS | 7+1、状态机和工具全集缺口均形式化。 |
| G8 | PASS | 空解与阻断可重放。 |
| G9 | PASS | 正确识别内部状态冲突与边界不唯一。 |
| G10 | PASS | 缺少 OperatorProfile，且不一致边界正确阻断 Admission。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 均通过；结论为不一致阻断，未生成 ADMIN_GOLD_FROZEN。
