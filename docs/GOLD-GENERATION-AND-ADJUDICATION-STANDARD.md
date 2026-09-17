# BoundX Real Gold 生成与审定标准

- 文档状态：`DRAFT_FOR_REVIEW`
- 适用目标：`BXP-0001 0.4.0-draft.1`
- 适用对象：真实 TASK → Gold Case
- 版本：`v0.1`
- 原则：Gold 不是“看起来合理的标准答案”，而是从真实 Source 出发，经可追溯提取、形式化、确定性计算和人工审定后得到的可重放 Oracle。

---

## 1. Gold 的基本单位

一个完整真实 TASK 对应一个 Gold Case：

```text
1 Real TASK = 1 Gold Case
```

禁止把长 TASK 截成一句话再当 Gold。

Case 输入合同：

```text
CaseInput =
  SourceTask
  + AllowedContext
  + ParentBoundary (optional)
  + OperatorProfile (optional)
  + EvaluationVersion / EvaluationTime (when required)
```

任务长短不构成质量高低。短任务允许大量 `absent`；长任务允许跨段、跨文件、条件与版本关系。

---

## 2. Layer 1：Source Evidence

必须保存：

```text
source_file
source_text
source_sha256
source_version
source_metadata
allowed_context[]
```

原 TASK 必须原样保存，不得用摘要、改写或润色替代。

每个证据使用精确 span：

```text
source_id
start
end
quote
```

必须满足：

```text
Source[start:end] == quote
```

每条语义事实必须标明来源类型：

```text
SOURCE
CONTEXT
ONTOLOGY
PROFILE
DERIVED
```

不得把不同来源混为一谈。

---

## 3. Layer 2：Evidence-linked 7+1

固定：

```text
IR7+1 = (I, O, A, P, R, V, C, B)
```

每个槽位必须至少保存：

```text
status
value
evidence
origin
normalization
ontology_binding
```

状态只有三种：

```text
resolved
unresolved
absent
```

### resolved
有充分证据，解释唯一，且不会产生边界相关歧义。

### unresolved
Source/Context 提到了，但当前无法唯一确定；不同解释可能改变 Boundary。

### absent
Source/Allowed Context 根本没有提供该语义。

硬规则：

```text
absent != missing
unresolved != guessed
resolved != inferred-by-common-sense
```

---

## 4. 7+1 固定语义

| 槽位 | 规范含义 |
|---|---|
| I | 输入、对象、数据、系统、明确作用范围 |
| O | 交付物、外部可观察结果 |
| A | 必需、允许、相关动作及其目标/效果/模态 |
| P | 执行、审批、观察、复核、接收等参与主体 |
| R | 预算、数量、时间、容量、阈值等资源约束 |
| V | 版本、规范、证据来源、时间基线、Provenance |
| C | 完成、停止、验收、升级条件 |
| B | Source 明确禁止的动作、效果、对象、状态及条件 |

例如：

```text
priority=P0      != R
risk_level=high  != R
只生成一份报告   != R
```

资源维度不存在时：

```text
R.status = absent
```

---

## 5. 禁止 Gold 自行补造事实

以下行为一律禁止：

```text
ME -> software-engineer
```

除非 L3/Context 明确给出该绑定。

以下行为也禁止：

```text
“重启服务”
=> ops.restart_service
```

除非当前 L2 ontology 中确实存在该 action，且映射已核验。

合法写法：

```text
semantic_action = resolved
ontology_binding = unresolved
```

宁可 `unresolved`，不得错绑。

---

## 6. Task Boundary 与 Policy Boundary 分离

Source 自己声明的禁止/要求属于 Task Boundary。

企业/Host/Operator Profile 的要求属于 Policy Boundary。

固定链：

```text
Task Source
  -> Task IR
  -> Task Boundary

Operator Profile
  -> Policy Boundary

Task Boundary + Policy Boundary
  -> Effective Boundary / Admission
```

不得把 Policy 偷塞进 Source `B`。

---

## 7. Layer 3：Formal Boundary Model

7+1 必须编译为：

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

含义：

```text
E          已确定身份的实体/制品
Sigma      作用域、状态切片、读写范围
Q          必须满足的结果与义务
F          禁止动作、状态、效果、对象
K          完成/停止条件
Relations  人、Agent、服务、制品之间的关系
D          dependency / provenance / handoff / version
Phi        数值、集合、逻辑、条件、时间、排序等约束
```

Formalization 只允许：

```text
语义等价规范化
确定性推导
```

例如：

```text
“不超过30分钟”
=> duration <= 1800s
```

可以。

但：

```text
“线上发布”
=> 必须 code review
```

除非 Profile 明确规定，否则不可以。

---

## 8. Layer 4：固定计算顺序

每个 Gold 必须按同一顺序计算。

### 8.1 Required Deficit

```text
Missing_task =
  Required_task - Specified_task
```

`R=absent` 若并非必需，不计 Missing。

### 8.2 Forbidden Conflict

```text
ForbiddenConflict =
  PlannedEffects ∩ ForbiddenEffects
```

条件性禁止必须保留条件：

```text
NOT AdminApproved => NOT Release
```

不能简化成：

```text
Release forbidden
```

### 8.3 Constraint Consistency

```text
Consistency = true / false
```

若要求与禁止无法同时满足：

```text
BoundaryState = inconsistent
```

### 8.4 Completion Decidability

```text
Decidable(K) = true / false
```

完成条件必须可观察、可计算或明确允许 `UNVERIFIED`。

### 8.5 Solution Space

```text
Omega_B != empty
```

表示存在至少一个合法执行方案。

```text
Omega_B = empty
```

表示 `inconsistent`。

### 8.6 Boundary Uniqueness

若存在多个均有证据支持但会产生不同规范边界的解释：

```text
CandidateBoundary1 != CandidateBoundary2
```

则：

```text
BoundaryState = underdetermined
```

不能选择“最可能”的一个。

---

## 9. Boundary State 仅允许四种

```text
determined
underdetermined
inconsistent
invalid
```

### determined

```text
结构有效
+ 所有 boundary-relevant 事实已确定
+ 约束一致
+ 解空间非空
+ Canonical Boundary 唯一
```

### underdetermined
仍存在会改变 Boundary 的语义、身份、版本、作用域等歧义。

### inconsistent
输入足够明确，但约束无法同时满足。

### invalid
协议数据或结构自身非法。

---

## 10. Policy Evaluation

只有 Case 明确提供 Operator Profile 才能计算 Policy。

没有 Profile：

```text
PolicyEvaluation =
  NOT_EVALUATED_NO_OPERATOR_PROFILE
```

不得凭常识自动加入：

```text
ticket required
approval required
code review required
health check required
```

---

## 11. Admission

固定：

```text
Admission =
  ProtocolValid
  AND BoundaryDetermined
  AND ReleaseConditionsSatisfied
  AND VersionBound
  AND ProfileSatisfied
```

若 Profile 缺失：

```text
Admission =
  NOT_EVALUATED_PROFILE_MISSING
```

这既不是 PASS，也不是 FAIL。

若 Boundary 为：

```text
underdetermined
inconsistent
invalid
```

Admission 必须 fail closed。

---

## 12. 固定 Diff 输出

每个 Case 必须输出：

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

并输出统一计算摘要：

```text
Missing_task        = ...
ForbiddenConflict   = ...
Consistency         = PASS/FAIL
CompletionDecidable = PASS/FAIL
SolutionSpace       = NON_EMPTY/EMPTY/UNRESOLVED
BoundaryState       = determined/underdetermined/inconsistent/invalid
PolicyEvaluation    = ...
Admission           = ...
```

---

## 13. Recommendation 生成标准

建议必须是计算结果的函数：

```text
Recommendation =
  function(Diff, Findings, AdmissionGap)
```

禁止 LLM 自由发挥。

例如：

```text
Missing V
=> 请补充版本依据
```

若 Boundary 已确定，不应无端建议 ADMIN 重写任务。

---

## 14. Gold 硬性拒收条件

任一命中则不得冻结：

```text
原文没写，Gold 自己补出事实
Evidence span 无法回放
角色靠常识推断
ontology ID 未核验就绑定
Task Policy 混入 Source B
absent 被强行改成 resolved
boundary-relevant ambiguity 被偷偷选一个
Profile 不存在却写 Admission PASS
数学结果无法独立重算
Source 被缩写/改写后拿来评分
Gold 为适应 Producer 输出而修改
```

---

## 15. Gold Freeze Gates

固定 10 个 Gate：

```text
G1  Source immutable
G2  Source SHA verified
G3  All evidence replayable
G4  7+1 manually adjudicated
G5  absent/unresolved preserved correctly
G6  ontology bindings verified
G7  Formal Model independently reviewable
G8  deterministic calculations reproducible
G9  Boundary Result uniquely justified
G10 Admission status justified by actual Profile availability
```

全部通过：

```text
GOLD_REVIEW_PASSED
```

最终由 ADMIN：

```text
ADMIN_GOLD_FROZEN
```

---

## 16. 标准 Case 目录

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
└─ MANIFEST.json
```

`GOLD.md` 为人读审定稿；其余文件为机器可重放资产。

---

## 17. 质量判定

Gold 质量不看“是否全填满”“是否全 PASS”，而看：

```text
Fidelity       是否忠于 Source
Traceability   每个结论能否追溯
No Invention   是否零补造
Determinism    计算是否可重复
Replayability  是否能被独立重放
Separation     Source / Context / Ontology / Policy 是否分离
```

因此以下结果也可以是高质量 Gold：

```text
R = absent
P = unresolved
BoundaryState = underdetermined
Admission = NOT_EVALUATED_PROFILE_MISSING
```

只要这是该 Source 在固定 Context 和固定协议下唯一正确的标准答案。

---

## 18. 当前真实 TASK Corpus 的应用

当前用户提供的真实 TASK：

```text
total = 62
encoding-damaged = 2
current candidates = 60
```

60 个候选全部按本标准生成，不按任务长短、复杂度或 PASS/FAIL 进行淘汰。

两个编码损坏文件在恢复原始 Source 前不得进入 Gold。

---

## 19. 与 BXP 0.4 的关系

本标准服从 BXP 0.4 的以下原则：

```text
7+1 != Boundary Result
resolved / unresolved / absent 必须显式保留
Formalization 不得补造事实
Ambiguous => underdetermined
Admission != ExecutionAuthorization
```

本标准是 **Gold 生成与审定方法**，不是 BXP 协议本体。
