# REAL-GOLD-003 / GOLD.zh-CN.md

## 1. Case Input & Source Metadata

- Case ID: `REAL-GOLD-003`
- 原始文件: `source/TASK-20260427-003-ADMIN-to-ME.md`
- SHA-256: `c753ba96dea69aa9d92a9f53d84724b77391b5f8f3ca948f045b3c6c490e2869`
- Protocol: `BXP-0001 0.4.0-draft.1`
- OperatorProfile: `null`
- 状态: `GOLD_REVIEW_PASSED`

## 2. 第一层：源证据

### 完整 Source

原文保留在同目录 source/，本 Markdown 不改写或翻译它。

### Evidence 索引

| Evidence ID | Span | Origin | Purpose |
|---|---:|---|---|
| E001 | [0, 288) | SOURCE | source metadata, assigned recipient, issue reference, and named implementation target |
| E002 | [288, 453) | SOURCE | stated scope for active-and-archived sequence scanning |
| E003 | [453, 1252) | SOURCE | observed same-basename collision mechanism across task, report, and issue generators |
| E004 | [1252, 2233) | SOURCE | specified helper, call-site changes, and invariants to retain |
| E005 | [2233, 2564) | SOURCE | required test additions and naming requirement |
| E006 | [2564, 2708) | SOURCE | acceptance checks and protected manually renamed files |
| E007 | [2708, 2825) | SOURCE | explicitly rejected tombstone approach and next_sequence non-change |
| E008 | [2825, 3033) | SOURCE | related issue, upstream task, and manually renamed records |

### Evidence Replay

All Evidence spans are Unicode code-point half-open intervals and replay against the preserved source.

## 3. 第二层：Evidence-linked 7+1

### [I] 输入范围

- Status: `resolved`
- 审定值: ISSUE-003、src/fcop/project.py 中 write_task/write_report/write_issue 的 active 与 log/ 归档目录、三个对应测试文件，以及被手工 rename 的任务和报告文件。
- Evidence: E001, E002, E003, E005, E006, E008
- Origin: SOURCE
- Normalization: source_stated_sequence_generation_inputs_and_protected_files
- Ontology binding: null
- 说明: 不读取 ISSUE 或项目目录的外部内容，也不补造 archive_issue 行为。

### [O] 交付结果

- Status: `resolved`
- 审定值: 跨 active 与 log/ 目录扫描文件名的私有辅助函数、三个更新的生成器调用点、三项归档序号测试，以及满足列明验收条件的修复结果。
- Evidence: E004, E005, E006
- Origin: SOURCE
- Normalization: union_scan_repair_outputs_and_tests
- Ontology binding: null
- 说明: 不把 tombstone 文件或 next_sequence() 的变更列为输出。

### [A] 动作

- Status: `resolved`
- 审定值: 新增跨目录文件名枚举辅助函数；让三个写入方法同时扫描 active 和 log/；在三个测试文件中新增跳过已归档 basename 的测试。
- Evidence: E002, E004, E005
- Origin: SOURCE
- Normalization: explicit_union_scan_code_and_test_changes
- Ontology binding: null
- 说明: O_EXCL 预占和 retry 限保持不变；不把测试示例扩展成额外写盘动作。

### [P] 参与主体

- Status: `resolved`
- 审定值: ADMIN 为发起主体；ME 为本修复任务的接收与执行主体。
- Evidence: E001
- Origin: SOURCE
- Normalization: symbolic_source_participants_only
- Ontology binding: null
- 说明: 不从角色符号推导真实身份、岗位、职级或任何权限。

### [R] 资源约束

- Status: `absent`
- 审定值: 原文未给出时间、预算、容量或数量配额；587 passed 是质量基线，不是资源限制。
- Evidence: 
- Origin: 
- Normalization: absent
- Ontology binding: null
- 说明: 不把 retry 限或序号值误归为资源约束。

### [V] 版本与依据

- Status: `resolved`
- 审定值: ISSUE-20260427-003-ME、上游 TASK-002、src/fcop/project.py 的列明行、以及保持不变的 next_sequence() 与 O_EXCL 预占语义。
- Evidence: E001, E003, E004, E007, E008
- Origin: SOURCE
- Normalization: source_stated_issue_code_and_invariant_references
- Ontology binding: null
- 说明: 只保存原文引用，未验证外部 ISSUE、代码或版本状态。

### [C] 完成条件

- Status: `resolved`
- 审定值: 三项新增测试通过、既有 587 passed 基线不退、ruff clean，且两件手工 rename 文件在运行中不被误伤。
- Evidence: E005, E006
- Origin: SOURCE
- Normalization: conjunction_of_explicit_regression_and_protection_checks
- Ontology binding: null
- 说明: 完成条件只引用当前修复与保护检查，不添加发布或审批条件。

### [B] 禁止边界

- Status: `resolved`
- 审定值: 不得引入 .archived/<id>.tombstone 隐藏占位文件；不得改变 next_sequence() 本身语义；O_EXCL 预占和 retry 限必须不变。
- Evidence: E004, E007
- Origin: SOURCE
- Normalization: explicit_non_changes_and_rejected_design
- Ontology binding: null
- 说明: 这些都是 Task Boundary；不把任何未提供的主机策略混入其中。

## 4. 第三层：形式化边界模型

### E

$$
\texttt{E.generators = \{write\_task, write\_report, write\_issue\}}
$$

$$
\texttt{E.active\_paths = \{tasks\_dir, reports\_dir, issues\_dir\}}
$$

$$
\texttt{E.archive\_paths = \{log/tasks, log/reports, log/issues\}}
$$

$$
\texttt{E.protected\_manual\_renames = \{TASK-20260427-002, REPORT-20260427-002\}}
$$

### Sigma

$$
\texttt{Sigma.sequence\_scan = active\_paths UNION archive\_paths}
$$

$$
\texttt{Sigma.write\_targets = \{src/fcop/project.py, test\_project\_tasks.py, test\_project\_reports.py, test\_project\_issues.py\}}
$$

$$
\texttt{Sigma.next\_sequence\_semantics = unchanged}
$$

### Q

$$
\texttt{Q.add\_existing\_filenames\_for\_seq\_helper}
$$

$$
\texttt{Q.use\_union\_scan\_in\_each\_generator}
$$

$$
\texttt{Q.add\_seq\_skips\_archived\_tests}
$$

$$
\texttt{Q.run\_regression\_and\_protection\_checks}
$$

### F

$$
\texttt{F.introduce\_tombstone\_placeholder}
$$

$$
\texttt{F.modify\_next\_sequence\_semantics}
$$

$$
\texttt{F.modify\_O\_EXCL\_reservation}
$$

$$
\texttt{F.modify\_retry\_limit}
$$

$$
\texttt{F.harm\_manual\_rename\_files}
$$

### K

$$
\texttt{K = three\_new\_tests\_green AND existing\_587\_passed\_not\_regressed AND ruff\_clean AND manual\_renames\_unharmed}
$$

### Relations

$$
\texttt{ADMIN -> assigns -> ME}
$$

$$
\texttt{archive\_task -> moves -> task\_and\_report\_records}
$$

$$
\texttt{active\_and\_archive\_paths -> determine -> next\_sequence\_input}
$$

$$
\texttt{identity\_or\_authority\_binding = unresolved\_not\_inferred}
$$

### D

$$
\texttt{D.issue = ISSUE-20260427-003-ME}
$$

$$
\texttt{D.upstream\_task = TASK-20260427-002-ADMIN-to-ME}
$$

$$
\texttt{D.code\_locations = \{project.py:1024, project.py:1468, project.py:1710\}}
$$

$$
\texttt{D.invariants = \{next\_sequence\_unchanged, O\_EXCL\_unchanged, retry\_limit\_unchanged\}}
$$

### Phi

$$
\texttt{Phi.archived\_basename\_must\_not\_be\_reused}
$$

$$
\texttt{Phi.issue\_archive\_path\_is\_future\_symmetric\_coverage\_not\_claimed\_archive\_issue\_behavior}
$$

$$
\texttt{Phi.no\_tombstone\_design}
$$

### Formalization Losslessness

$$
FormalCoverageGap=\varnothing
$$

$$
invented\_constraints=\varnothing
$$

- 审定说明: 三个生成器的联合扫描要求、归档同名碰撞机制、辅助函数和测试、质量与保护验收、以及 tombstone、next_sequence、O_EXCL、retry 限的不变边界均已保留；未补造 archive_issue 功能或任何身份权限。

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

实施时应把 union-scan 保持为调用方的目录选择责任，并逐项回归 three new tests、既有基线、ruff 与手工 rename 文件保护；任何新 archive_issue 设计必须另立 TASK 审定。

## 8. Validator Replay

- Source SHA replay: PASS
- Evidence replay: PASS
- Deterministic calculation replay: PASS

## 9. Gold Freeze Gates

| Gate | Status | Basis |
|---|---|---|
| G1 | PASS | 冻结 source 与输入 ZIP 中对应 TASK 的字节一致。 |
| G2 | PASS | 已重算并匹配 source SHA-256。 |
| G3 | PASS | E001–E008 均以 Unicode 码点区间回放。 |
| G4 | PASS | 八个槽位均仅按 Source 与冻结空 Context 独立审定。 |
| G5 | PASS | R 保持 absent，未把 587 基线或序号误填为资源，也未补造 archive_issue。 |
| G6 | PASS | 未声明 ontology binding，且不从 ADMIN/ME 推导身份或权限。 |
| G7 | PASS | FormalCoverageGap 与 invented_constraints 均为空；全部不变边界显式保留。 |
| G8 | PASS | 固定的 union-scan 模型和计算顺序可重放同一结果。 |
| G9 | PASS | 修复范围、非变更项与完成条件均只有一个受证据支持的边界解释；多种实现路径不影响唯一性。 |
| G10 | PASS | OperatorProfile 为 null；Policy 未评估，Admission 正确为 NOT_EVALUATED_PROFILE_MISSING。 |

## 10. Final Status

`GOLD_REVIEW_PASSED`

G1–G10 均通过；已确定为 active 与 archive 联合扫描的代码修复边界，未生成 ADMIN_GOLD_FROZEN。
