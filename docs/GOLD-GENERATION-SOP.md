# BoundX Real Gold 生成执行方法（SOP）

- 文档名：`GOLD-GENERATION-SOP.md`
- 版本：`v0.1.1`
- 状态：`DRAFT_FOR_REVIEW`
- 配套标准：`GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md`
- 目标协议：`BXP-0001 0.4.0-draft.1`
- 适用对象：真实 TASK → Real Gold Case
- 原则：**标准统一答案，SOP 统一过程。**
- v0.1.1 修订：新增 Formalization 无损覆盖检查，并明确 Boundary 唯一不等于执行路径唯一。

---

# 1. 目的

本 SOP 规定如何把一份真实 TASK 文件，按统一、可追溯、可重放的方法生成一个 BoundX Real Gold Case。

本 SOP 不定义 Gold 的语义标准本身；语义正确性、7+1 含义、Boundary State、Admission 等判定规则，以：

`docs/GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md`

为唯一上位依据。

本 SOP 解决的是：

```text
同一个真实 TASK
由不同人 / Agent / 模型处理
仍必须走同一条生产线
产生同一类可审计产物
```

---

# 2. 总执行链

所有真实 TASK 必须严格按以下顺序执行：

```text
STEP 0  Source Freeze
   ↓
STEP 1  Context Assembly
   ↓
STEP 2  Evidence Extraction
   ↓
STEP 3  7+1 Adjudication
   ↓
STEP 4  Formalization
   ↓
STEP 5  Deterministic Calculation
   ↓
STEP 6  Policy / Admission Evaluation
   ↓
STEP 7  Diff / Recommendation
   ↓
STEP 8  Gold Validation G1-G10
   ↓
GOLD_REVIEW_PASSED
   ↓
ADMIN_GOLD_FROZEN
```

禁止跳步。

禁止在后一步偷偷补写前一步没有固定的事实。

禁止因为“最后结果看起来合理”而倒推修改 Source、Evidence 或 7+1。

---

# 3. 执行角色

逻辑上必须区分四种职责：

```text
Generator
Validator
Adjudicator
ADMIN
```

## 3.1 Generator

负责：

```text
Source 读取
Evidence 候选提取
7+1 候选生成
Formal Model 候选生成
```

Generator 不得宣布：

```text
GOLD_REVIEW_PASSED
ADMIN_GOLD_FROZEN
```

---

## 3.2 Validator

负责机器可验证事实：

```text
Source SHA-256
Evidence span replay
Schema validation
JSON parse
Formal result replay
Manifest consistency
```

Validator 不得修改 Gold 语义以让检查通过。

---

## 3.3 Adjudicator

负责人工/独立语义审定：

```text
resolved / unresolved / absent
边界相关歧义
ontology binding
角色身份
Formalization 是否补造
Boundary uniqueness
Gold 结论是否唯一合理
```

---

## 3.4 ADMIN

ADMIN 只负责最终冻结：

```text
ADMIN_GOLD_FROZEN
```

在 `GOLD_REVIEW_PASSED` 之前不得冻结。

---

# 4. Case 标识与目录

每个真实 TASK 对应一个独立 Case：

```text
REAL-GOLD-001
REAL-GOLD-002
...
```

推荐目录：

```text
REAL-GOLD-001/
├─ source/
│  └─ TASK-....md
├─ context/
│  └─ ...
├─ GOLD.md
├─ GOLD.json
├─ EVIDENCE.json
├─ FORMAL-MODEL.json
├─ RESULT.json
├─ REVIEW.json
└─ MANIFEST.json
```

---

# 5. STEP 0 — Source Freeze

## 5.1 输入

一份真实 TASK 原文件。

例如：

```text
TASK-20260530-001-ADMIN-to-ME.md
```

---

## 5.2 必须执行

1. 保存原文件全文。
2. 固定文件编码。
3. 计算 SHA-256。
4. 记录原文件名。
5. 记录 task_id。
6. 记录 Source metadata。
7. 禁止改写、摘要、润色、截短。

---

## 5.3 必须生成

`MANIFEST.json` 至少包含：

```text
case_id
source_file
source_sha256
source_digest_algorithm
source_encoding
source_task_id
source_metadata
standard_version
protocol_version
generation_status
```

推荐：

```text
source_digest_algorithm = sha-256:utf8
```

---

## 5.4 Source 状态

成功：

```text
SOURCE_FROZEN
```

失败：

```text
SOURCE_INVALID
SOURCE_ENCODING_INVALID
SOURCE_HASH_FAILED
```

任何 Source 失败都必须停止。

不得继续生成 7+1。

---

# 6. STEP 1 — Context Assembly

## 6.1 目的

在开始语义提取前，先固定这个 Case 允许读取哪些外部事实。

---

## 6.2 Context 类型

```text
AllowedContext
ParentBoundary
OperatorProfile
OntologyPack
L3Package
EvaluationTime
EvaluationVersion
```

---

## 6.3 固定原则

必须先写清楚：

```text
allowed_context = [...]
operator_profile = ...
parent_boundary = ...
ontology_pack = ...
evaluation_time = ...
```

没有就是：

```text
null
[]
```

不能在 STEP 3、4、5 过程中临时发现缺信息后，再偷偷从仓库找资料加入。

如果需要新增 Context：

```text
创建新的 Case revision
重新从 STEP 1 开始
```

---

## 6.4 Context 状态

成功：

```text
CONTEXT_FROZEN
```

若 Context 缺失但不影响当前任务：

```text
CONTEXT_FROZEN_WITH_NULLS
```

若边界依赖的 Context 缺失：

```text
CONTEXT_INSUFFICIENT
```

此时后续可能得到：

```text
BoundaryState = underdetermined
```

而不是补造。

---

# 7. STEP 2 — Evidence Extraction

## 7.1 目的

只做证据提取，不做最终语义判断。

---

## 7.2 Evidence 结构

每条 Evidence 必须包含：

```text
evidence_id
source_id
origin
start
end
quote
purpose
```

`origin` 只能是：

```text
SOURCE
CONTEXT
ONTOLOGY
PROFILE
DERIVED
```

---

## 7.3 Span 规则

采用 Unicode 码点半开区间：

```text
[start, end)
```

必须满足：

```text
Source[start:end] == quote
```

---

## 7.4 禁止行为

不得：

```text
只记录 quote 不记录 start/end
使用摘要替代 quote
修正原文错别字后再保存 quote
把推断内容当 Source Evidence
```

---

## 7.5 输出

`EVIDENCE.json`

---

## 7.6 验证

逐条执行：

```text
for each evidence:
    assert source[start:end] == quote
```

全部通过：

```text
EVIDENCE_VERIFIED
```

否则：

```text
EVIDENCE_INVALID
```

停止进入 STEP 3。

---

# 8. STEP 3 — 7+1 Adjudication

## 8.1 固定结构

```text
IR7+1 = (I, O, A, P, R, V, C, B)
```

每一槽位必须包含：

```text
status
value
evidence[]
origin[]
normalization
ontology_binding
notes
```

---

## 8.2 状态

只允许：

```text
resolved
unresolved
absent
```

### resolved

证据充分且解释唯一。

### unresolved

存在证据，但解释不唯一，且不同解释可能影响 Boundary。

### absent

Source / Allowed Context 没有提供。

---

## 8.3 关键规则

```text
absent != missing
unresolved != guessed
resolved != common-sense inference
```

例如：

```text
priority=P0
```

不能自动进入 R。

例如：

```text
ME
```

不能自动映射：

```text
software-engineer
```

例如：

```text
恢复任务
```

在 ontology 未核验前：

```text
semantic_action = resolved
ontology_binding = unresolved
```

---

## 8.4 输出

`GOLD.json`

---

## 8.5 状态

人工/独立审定完成：

```text
IR_ADJUDICATED
```

若有未解决槽位：

```text
IR_ADJUDICATED_WITH_UNRESOLVED
```

这不是失败。

---

# 9. STEP 4 — Formalization

## 9.1 目的

把已审定的 7+1 编译成 Formal Boundary Model。

禁止重新解释自然语言。

---

## 9.2 固定模型

```text
M = (
  E,
  Sigma,
  Q,
  F,
  K,
  Relations,
  D,
  Phi
)
```

---

## 9.3 来源要求

Formal Model 中每一项必须能追溯到：

```text
7+1
Evidence
Allowed Context
Operator Profile
确定性推导
```

---

## 9.4 允许的转换

允许：

```text
“不超过30分钟”
=> duration <= 1800s
```

允许：

```text
“不得修改 .py”
=> ModifiedTargets ∩ PythonFiles = ∅
```

不允许：

```text
“线上发布”
=> code review required
```

除非 Operator Profile 明确声明。

---

## 9.5 Formalization Losslessness Check

形式化完成后，必须计算：

```text
FormalCoverageGap =
  BoundaryRelevant(IR7+1) - RepresentedInFormalModel
```

必须满足：

```text
FormalCoverageGap = empty
```

逐项检查：

```text
Q 是否完整保留
F 是否完整保留
K 是否完整保留
Relations 是否完整保留
D 是否完整保留
Phi 是否完整保留
条件模态是否被弱化
是否新增 Source / Context / Profile 中不存在的约束
是否新增 Source 未明确规定的时序关系
```

若发现：

```text
FormalCoverageGap != empty
```

则状态：

```text
FORMALIZATION_LOSSY
```

并停止进入 STEP 5。

如果 Formal Model 新增了无来源约束：

```text
FORMALIZATION_INVENTED_CONSTRAINT
```

并停止。

---

## 9.6 输出

`FORMAL-MODEL.json` 必须额外保存：

```text
formal_coverage_gap
invented_constraints
preserved_boundary_semantics
```

---

## 9.7 状态

```text
FORMALIZED
```

若 Formalization 需要未提供事实：

```text
FORMALIZATION_UNRESOLVED
```

不得补造。

---

# 10. STEP 5 — Deterministic Calculation

所有 Case 必须按相同顺序计算。

---

## 10.1 Required Deficit

```text
Missing_task =
  Required_task - Specified_task
```

注意：

```text
R = absent
```

如果任务不要求资源限制：

```text
R absent != Missing
```

---

## 10.2 Forbidden Conflict

```text
ForbiddenConflict =
  PlannedEffects ∩ ForbiddenEffects
```

条件必须保留。

例如：

```text
NOT AdminApproved => NOT Release
```

不得改成：

```text
Release forbidden
```

---

## 10.3 Constraint Consistency

```text
Consistency = true / false
```

若要求和禁止无法同时成立：

```text
BoundaryState = inconsistent
```

---

## 10.4 Completion Decidability

```text
Decidable(K) = true / false
```

完成条件必须可观察、可验证或明确允许：

```text
UNVERIFIED
```

---

## 10.5 Solution Space

```text
Omega_B != empty
```

表示至少存在一个合法执行方案。

```text
Omega_B = empty
```

表示：

```text
BoundaryState = inconsistent
```

---

## 10.6 Boundary Uniqueness

必须检查所有有证据支持的**边界解释**。

固定区分：

```text
BoundaryUnique != ExecutionPathUnique
```

判断对象是：

```text
canonical boundary candidates
```

不是：

```text
execution paths
```

允许：

```text
canonical_boundary_candidates = 1
legal_execution_paths > 1
```

此时仍然可以：

```text
BoundaryState = determined
```

若：

```text
CandidateBoundary1 != CandidateBoundary2
```

且二者都有充分证据支持，则：

```text
BoundaryState = underdetermined
```

禁止选择“最可能”解释。

也禁止因为 `BoundaryState = determined` 就输出：

```text
only one legal execution path
```

除非 Source 本身确实规定唯一执行路径。

---

## 10.7 Boundary State

最终只能是：

```text
determined
underdetermined
inconsistent
invalid
```

---

## 10.8 输出

`RESULT.json` 至少包含：

```text
Missing_task
ForbiddenConflict
Consistency
CompletionDecidable
SolutionSpace
BoundaryUnique
canonical_boundary_candidates
legal_execution_paths_cardinality
BoundaryState
```

其中 `legal_execution_paths_cardinality` 可为：

```text
1
MANY
UNKNOWN_NONZERO
```

它不参与“Boundary 是否唯一”的定义。

---

## 10.9 状态

```text
CALCULATED
```

---

# 11. STEP 6 — Policy / Admission Evaluation

## 11.1 Task Boundary 与 Policy Boundary 分离

必须先计算 Task Boundary。

再看：

```text
OperatorProfile 是否存在
```

---

## 11.2 Profile 不存在

固定输出：

```text
PolicyEvaluation =
  NOT_EVALUATED_NO_OPERATOR_PROFILE

Admission =
  NOT_EVALUATED_PROFILE_MISSING
```

不得写 PASS。

不得写 FAIL。

---

## 11.3 Profile 存在

计算：

```text
TaskBoundary
+ PolicyBoundary
=> EffectiveBoundary
=> Admission
```

Admission 至少检查：

```text
ProtocolValid
BoundaryDetermined
ReleaseConditionsSatisfied
VersionBound
ProfileSatisfied
```

---

## 11.4 Fail Closed

如果 Boundary 为：

```text
underdetermined
inconsistent
invalid
```

则：

```text
Admission = blocked
```

---

## 11.5 状态

```text
ADMISSION_EVALUATED
```

或：

```text
ADMISSION_NOT_EVALUATED_PROFILE_MISSING
```

---

# 12. STEP 7 — Diff / Recommendation

## 12.1 固定 Diff

必须输出：

```text
[I] OK / UNRESOLVED / ABSENT
[O] OK / UNRESOLVED / ABSENT
[A] OK / UNRESOLVED / ABSENT
[P] OK / UNRESOLVED / ABSENT
[R] OK / UNRESOLVED / ABSENT
[V] OK / UNRESOLVED / ABSENT
[C] OK / UNRESOLVED / ABSENT
[B] OK / UNRESOLVED / ABSENT
```

---

## 12.2 固定计算摘要

```text
Missing_task        = ...
ForbiddenConflict   = ...
Consistency         = PASS/FAIL
CompletionDecidable = PASS/FAIL
SolutionSpace       = NON_EMPTY/EMPTY/UNRESOLVED
BoundaryState       = ...
PolicyEvaluation    = ...
Admission           = ...
```

---

## 12.3 Recommendation

建议必须来自：

```text
Recommendation =
  function(Diff, Findings, AdmissionGap)
```

禁止自由发挥。

例如：

```text
V = unresolved
=> 建议补充版本依据
```

例如：

```text
BoundaryState = determined
Profile = null
=> 任务文本无需重写；若需 Host Admission，请挂载 Profile 后重算
```

---

## 12.4 输出

写入：

```text
GOLD.md
RESULT.json
```

---

# 13. STEP 8 — Gold Validation

所有 Gate 默认：

```text
PENDING
```

不得默认 PASS。

---

## G1 — Source immutable

验证：

```text
当前 source bytes
==
冻结 source bytes
```

---

## G2 — Source SHA verified

重新计算 SHA-256。

一致：

```text
PASS
```

---

## G3 — All evidence replayable

对每条 Evidence：

```text
Source[start:end] == quote
```

全部成立：

```text
PASS
```

---

## G4 — 7+1 manually adjudicated

确认八个槽位均已人工/独立审定。

允许：

```text
absent
unresolved
```

---

## G5 — absent/unresolved preserved correctly

检查：

```text
没有为了填满而补值
没有把 unresolved 猜成 resolved
```

---

## G6 — ontology bindings verified

只有核验过的 binding 才允许：

```text
resolved
```

否则必须：

```text
unresolved
null
```

---

## G7 — Formal Model independently reviewable

检查 Formal Model 每条内容都有来源，并且：

```text
FormalCoverageGap = empty
invented_constraints = empty
```

必须证明 `7+1 -> Formal Model` 没有丢失 boundary-relevant 语义，也没有新增无来源约束。

---

## G8 — deterministic reproducible

重新执行 STEP 5。

结果必须完全一致。

如果 STEP 4 的 Formal Model 发生变化，G8 必须重新执行，旧结果不得沿用。

---

## G9 — Boundary Result uniquely justified

必须保存：

```text
candidate_interpretations_reviewed
boundary_changing_ambiguity
canonical_boundary_candidates
legal_execution_paths_cardinality
```

仅在：

```text
canonical_boundary_candidates = 1
```

且无未解决边界歧义时，`determined` 才可通过。

`legal_execution_paths_cardinality` 不要求为 1。

允许：

```text
canonical_boundary_candidates = 1
legal_execution_paths_cardinality = MANY
BoundaryState = determined
```

G9 不得把“执行路径不唯一”误判为“Boundary 不唯一”。

---

## G10 — Admission status justified

检查实际 Profile availability。

例如：

```text
operator_profile = null
```

则只能：

```text
NOT_EVALUATED_PROFILE_MISSING
```

---

# 14. Gold 状态机

固定状态：

```text
SOURCE_FROZEN
CONTEXT_FROZEN
EVIDENCE_VERIFIED
IR_ADJUDICATED
FORMALIZED
CALCULATED
ADMISSION_EVALUATED
GOLD_VALIDATED
GOLD_REVIEW_PASSED
ADMIN_GOLD_FROZEN
```

失败使用：

```text
BLOCKED_<reason>
```

例如：

```text
BLOCKED_SOURCE_INVALID
BLOCKED_EVIDENCE_INVALID
BLOCKED_ONTOLOGY_UNVERIFIED
BLOCKED_BOUNDARY_AMBIGUITY
```

---

# 15. 何时允许 GOLD_REVIEW_PASSED

仅当：

```text
G1 = PASS
G2 = PASS
G3 = PASS
G4 = PASS
G5 = PASS
G6 = PASS
G7 = PASS
G8 = PASS
G9 = PASS
G10 = PASS
```

才允许：

```text
GOLD_REVIEW_PASSED
```

否则必须保持：

```text
DRAFT_FOR_REVIEW
```

或：

```text
BLOCKED_<reason>
```

---

# 16. 何时允许 ADMIN_GOLD_FROZEN

前置条件：

```text
GOLD_REVIEW_PASSED
```

只有 ADMIN 明确签署后：

```text
ADMIN_GOLD_FROZEN
```

任何 Generator / Validator / Adjudicator 均不得自行赋予此状态。

---

# 17. Revision 规则

任何以下变化：

```text
Source 变化
Allowed Context 变化
Operator Profile 变化
Ontology 版本变化
Gold 语义修订
Formalization 修订
计算规则修订
```

必须产生：

```text
new revision
```

禁止覆盖旧版本。

例如：

```text
REAL-GOLD-001/rev1
REAL-GOLD-001/rev2
```

旧版本保留用于研究追溯。

---

# 18. 批量执行 60 个真实 TASK 的方法

当前真实语料：

```text
62 total
2 source encoding damaged
60 current candidates
```

固定批量执行方式：

```text
for each TASK in 60 candidates:

  STEP 0 Source Freeze
  if fail: stop case

  STEP 1 Context Assembly

  STEP 2 Evidence Extraction
  verify spans
  if fail: stop case

  STEP 3 7+1 Adjudication

  STEP 4 Formalization

  STEP 5 Deterministic Calculation

  STEP 6 Policy / Admission

  STEP 7 Diff / Recommendation

  STEP 8 G1-G10 Validation

  if all gates PASS:
      GOLD_REVIEW_PASSED
  else:
      DRAFT_FOR_REVIEW / BLOCKED
```

禁止：

```text
先生成60个结果
再统一补验证
```

必须：

```text
一 Case 一闭环
```

---

# 19. 一个 Case 的完成判据

一个 Case 的“生成完成”不等于：

```text
GOLD.md 写完
```

而必须同时具备：

```text
Source frozen
SHA verified
Evidence replayable
7+1 adjudicated
Formal Model generated
Calculation replayed
Boundary justified
Admission justified
G1-G10 completed
```

---

# 20. Gold 不以 PASS 数量为目标

Gold 允许：

```text
R = absent
P = unresolved
BoundaryState = underdetermined
BoundaryState = inconsistent
Admission = NOT_EVALUATED_PROFILE_MISSING
Admission = blocked
```

Gold 的目标不是“全 PASS”。

Gold 的目标是：

```text
唯一正确
证据充分
可复算
不补造
```

---

# 21. 输出质量检查

每个 Case 完成前必须问：

```text
1. 原 TASK 是否完整保留？
2. 每个 resolved/unresolved 是否有 Evidence？
3. absent 是否真的没有证据？
4. 是否混入了常识推断？
5. ontology binding 是否真实核验？
6. Policy 是否混进 Task B？
7. Formal Model 是否只来自已审定语义？
8. 计算是否固定顺序？
9. Formalization 是否无损，FormalCoverageGap 是否为空？
10. 是否新增了 Source 未明确规定的时序/模态约束？
11. Boundary 是否唯一？
12. 是否把 Boundary 唯一误写成执行路径唯一？
13. Admission 是否尊重 Profile availability？
14. G1-G10 是否真实验证而非自报 PASS？
```

任一回答“不确定”：

```text
不得 GOLD_REVIEW_PASSED
```

---

# 22. SOP 与标准的关系

```text
GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md
= 定义“什么是正确 Gold”

GOLD-GENERATION-SOP.md
= 定义“如何生成正确 Gold”
```

两份文件共同构成 Real Gold 的生成治理基线。

以后任何 ChatGPT、Codex、脚本或人工流程生成 Gold，必须同时遵守两份文件。
