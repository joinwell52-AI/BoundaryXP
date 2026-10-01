# REAL-GOLD-018 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-018`
- 原始文件: `source/TASK-20260509-007-ADMIN-to-ME.md`
- SHA-256: `8c389de9eca92721286a1f6d8afea2dad33ad97dd285de7513a8393ab4cc8811`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 1190) | SOURCE | metadata, scope, and why-now facts |
| E002 | [1191, 4852) | SOURCE | seven ADMIN decisions defining event types, polling, callbacks, deduplication, and exclusions |
| E003 | [4853, 7037) | SOURCE | twelve acceptance criteria, four-round plan, and quality constraints |
| E004 | [7038, 8819) | SOURCE | risk, reviewer boundaries, and signoff |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: event.schema.json、ADR-0018/0015、TASK-005/006 的事件 stub、Project 状态、文件系统快照与现有测试。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_event_wiring_inputs
- Ontology binding: null
- 说明: 不访问 OS watcher 或外部文件系统。

### [O] 交付结果

- Status: `resolved`
- 审定值: Event 模型、12 值 enum、polling/state-diff、订阅 API、同步 emitter、去重、测试、snapshot、ADR、报告、归档、提交和推送。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_event_reference_implementation_outputs
- Ontology binding: null
- 说明: 输出不代表已经执行。

### [A] 动作

- Status: `unresolved`
- 审定值: 以四轮提交实现 events 模块、state diff、订阅与 poll_once、接入 boundary/failure stub、测试和文档收尾；但 12 个事件在 polling 与同步 callback 两条路径中的完整归属未被唯一确定。
- Evidence: E002, E003
- Origin: SOURCE
- Normalization: explicit_actions_with_source_path_count_ambiguity
- Ontology binding: null
- 说明: 原文同时称文件类为 11、列名为 8（实际列出 7），并称同步类为 5。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN 发起；ME solo 执行；caller 显式调用 poll_once，host adapter 负责后台循环或 OS watcher。
- Evidence: E001, E002, E004
- Origin: SOURCE
- Normalization: source_stated_actor_split
- Ontology binding: null
- 说明: 不推导权限。

### [R] 资源约束

- Status: `unresolved`
- 审定值: 第 4/7 抽象、四提交、12 事件类型、若干测试最低数量与跨 OS mtime ±1 秒处理；但文件类事件数在同一决议中出现 11、8 与实际列出 7 三种表达。
- Evidence: E001, E002, E003, E004
- Origin: SOURCE
- Normalization: source_stated_counts_with_internal_ambiguity
- Ontology binding: null
- 说明: 不选择其中任一数值替代其他数值。

### [V] 版本与依据

- Status: `resolved`
- 审定值: ADR-0018、ADR-0015、TASK-005、TASK-006、TASK-008、TASK-010、event.schema.json、v1.0/v1.x 边界。
- Evidence: E001, E002, E003
- Origin: SOURCE
- Normalization: source_stated_reference_basis
- Ontology binding: null
- 说明: 仅保留引用。

### [C] 完成条件

- Status: `resolved`
- 审定值: A1–A12：模块、模型与 enum、订阅/poll、boundary/failure/session 集成、角色切换、去重、schema、snapshot、ADR、报告归档提交推送。
- Evidence: E003, E004
- Origin: SOURCE
- Normalization: explicit_acceptance_conjunction
- Ontology binding: null
- 说明: 验收不是已完成事实。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 不得新增 EVENT 文件 envelope、偏离 12 值 enum、引入后台线程/asyncio 自动轮询、持久化事件流、使用 OS filesystem watcher、破坏 TASK-006 测试、加入迁移段或 MCP 工具。
- Evidence: E002, E003, E004
- Origin: SOURCE
- Normalization: explicit_scope_and_side_effect_boundaries
- Ontology binding: null
- 说明: host adapter 责任保持在外部。

## 4. 第三层：形式化边界模型

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

- 审定说明: 保留 12 事件、双触发路径、所有禁止边界及文件类事件计数与归属的三重差异，未猜测修正。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

$$
Missing_{task}=Required_{task}\setminus Specified_{task}
$$

$$
Missing_{task}=\text{12 个事件在 polling 与同步 callback 两条路径中的唯一完整分配；文件类事件的确切基数}
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
canonical\_boundary\_candidates=3,\quad BoundaryUnique=false
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
[A] UNRESOLVED
[P] OK
[R] UNRESOLVED
[V] OK
[C] OK
[B] OK

## 7. Recommendation

保持阻断；请 ADMIN 明确列出 12 个事件逐项的唯一触发来源，并更正文件类事件的计数。不得由实现自行把计数差异视为笔误。

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
| G5 | PASS | 未把计数差异修正为假设事实。 |
| G6 | PASS | 未推导权限绑定。 |
| G7 | PASS | 7+1、触发路径和不确定项均形式化。 |
| G8 | PASS | 差异与未定结果可重放。 |
| G9 | PASS | 正确识别边界不唯一。 |
| G10 | PASS | 缺少 OperatorProfile，且未定边界正确阻断 Admission。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 均通过；审定保留未定与阻断，未生成 ADMIN_GOLD_FROZEN。
