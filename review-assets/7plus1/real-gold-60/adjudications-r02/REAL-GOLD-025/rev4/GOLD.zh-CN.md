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

- Status: `resolved`
- 审定值: 面向全部写侧 MCP 工具的 binding 守门、系统路径 deny-list、fcop_report 告警、机器可读 schema 字段、测试与 1.4 release notes；最终工具清单须在实施时由 OPS 枚举确认。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_outputs_with_required_runtime_enumeration
- Ontology binding: null
- 说明: 候选清单不等于封闭全集；实施时枚举是明确工作步骤，并非要求任务原文逐个列尽工具。

### [A] 动作

- Status: `unresolved`
- 审定值: OPS 枚举全部写侧工具，ME 实施 binding 与 deny-list 守门、告警、schema、测试和升级说明；但错误文案允许重启时设置 cwd，而 D1 禁止默认 cwd 兜底，尚未定义该启动方式是否形成显式绑定。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_guard_actions_with_unresolved_startup_binding
- Ontology binding: null
- 说明: 不得假定候选清单已穷尽，也不得把 cwd 设置自动视为 explicit bind。

### [P] 参与主体

- Status: `resolved`
- 审定值: ME 提出并在获准后实施，ADMIN 决定批准、调整或延后，OPS 在实施时确认写侧工具清单；原文未提供可核验的当前批准记录。
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: conditional_responsibility_without_authority_inference
- Ontology binding: null
- 说明: frontmatter 的 done 与正文描述的拟议时点可能对应不同时间；不能据此推断 ADMIN GREEN 或执行授权。

### [R] 资源约束

- Status: `absent`
- 审定值: 原文未给出有约束力的执行时限或资源预算；2–3 小时只是提案估时。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: no_binding_resource_constraint
- Ontology binding: null
- 说明: P0/high 是优先级和风险；路径列表为禁止作用域，六类测试为完成条件，回滚版本为版本信息。

### [V] 版本与依据

- Status: `resolved`
- 审定值: 目标 fcop-mcp v1.4、可回退 v1.3.x；PM #50 事件报告、ADR-0033/0034 与 Bridgeflow §5 是原文引用，未提供其正文。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: target_and_rollback_versions_with_unavailable_references
- Ontology binding: null
- 说明: 旧版所列 Rule 7 不见于本任务原文，不能补造。

### [C] 完成条件

- Status: `unresolved`
- 审定值: 七项验收覆盖 D1–D6 与 PM #50 干净环境复现拒绝写盘、USER HOME 零文件；但启动时 cwd 是否算显式绑定会改变 D1 与复现测试的预期。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: acceptance_with_unresolved_startup_binding_semantics
- Ontology binding: null
- 说明: 验收未证明已完成；不能自行选择一种启动绑定解释。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 未显式绑定时不得默认 cwd 兜底；绑定到 USER HOME、Unix/drive/system root 必须拒绝；home 下合法项目子目录不得误拒；PM #50 复现不得写盘；ADMIN GREEN 前不得实施。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_safety_and_approval_boundary
- Ontology binding: null
- 说明: 禁止项约束实施与工具行为，不表示本审定已核验实时权限。

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

- 审定说明: 事故背景、全部写侧工具的实施时枚举、精确路径拒绝、home 子目录例外、审批门槛及启动 cwd 绑定歧义均保留；frontmatter done 不自动覆盖正文的拟议时点。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{重启 MCP 并将 cwd 设为项目根目录是否建立 explicit binding，以及与禁止默认 cwd 兜底的关系}
$$

D1 要求显式绑定、禁止默认 cwd 兜底，但错误文案又给出“重启并设置项目根 cwd”的操作路径；原文未说明此路径如何形成显式绑定。

### 2. 禁止边界冲突

$$
ForbiddenConflict=\mathcal{A}_{planned}\cap F_{forbidden}
$$

$$
ForbiddenConflict=\text{empty}
$$

守门、受保护路径拒绝和获批后实施没有直接撞上原文禁止项。frontmatter 的 done 不能直接证明正文提案期已越过批准门槛。

### 3. 约束一致性

$$
Consistency=\text{PASS}
$$

若重启时另有显式绑定步骤，两种文字可以并存；若仅修改 cwd 则不可以。原文未排除所有一致解释，不能宣告空解。

### 4. 完成条件可判定性

$$
Decidable(K)=\text{FAIL}
$$

七项验收是可测试的框架，但 D1 的启动绑定判据不清楚，同一启动测试可能因解释不同而得出相反结论。

### 5. 合法解空间

$$
\Omega_B=\{x\in X_{\Sigma}\mid Q(x)\land\neg F(x)\land K(x)\land\Phi(x)\}
$$

$$
\Omega_B=\text{NONEMPTY}
$$

至少存在“仅 set_project_dir 显式绑定”或“重启时经确认建立启动绑定”两类候选；均须遵守受保护路径拒绝和 ADMIN gate。

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

两种启动绑定解释改变未调用 set_project_dir 的写入许可，故边界不唯一；OPS 运行时枚举的工具数并非需要预先猜出的另一边界。

### 7. 边界状态

$$
\boxed{BoundaryState=\text{underdetermined}}
$$

决定性缺口在重启 cwd 与显式绑定的关系。frontmatter 的 done 与正文初始 proposed 可能属于不同时点，不构成必然逻辑冲突。

### 8. Policy 评估

$$
PolicyEvaluation=\text{NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE}
$$

没有 OperatorProfile 或可核验的实时 ADMIN 批准；角色标签和历史状态不能替宿主作政策判断。

### 9. 准入

$$
Admission=\text{BLOCKED\_BOUNDARY\_UNDERDETERMINED}
$$

启动绑定边界仍未定，故准入阻断；本审定不会调用任何写侧工具、触碰 USER HOME 或执行测试复现。

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

保持阻断。请明确“重启 MCP 时设置项目根 cwd”是否建立显式绑定，以及与禁止默认 cwd 兜底的关系；实施时 OPS 仍须核全写侧工具，ADMIN 的 A/B/C 裁决由宿主另行核验。不得把候选清单或 `done` 当作授权。

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
| G7 | PASS | 保留写侧工具实施时枚举、审批门槛、受保护路径与启动绑定歧义。 |
| G8 | PASS | 非空候选、缺口与阻断可按所审定解释重放。 |
| G9 | PASS | 不把不同时点的状态当必然矛盾，保留启动绑定的边界不唯一。 |
| G10 | PASS | 缺少 OperatorProfile，且未定边界正确阻断 Admission。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 均通过；结论为未定阻断，未生成 ADMIN_GOLD_FROZEN。
