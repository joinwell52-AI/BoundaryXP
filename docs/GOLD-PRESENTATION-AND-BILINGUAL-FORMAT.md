# BoundX Real Gold 文件版式与双语展示规范

- 文档名：`GOLD-PRESENTATION-AND-BILINGUAL-FORMAT.md`
- 版本：`v0.1`
- 状态：`DRAFT_FOR_REVIEW`
- 配套文件：
  - `GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md`
  - `GOLD-GENERATION-SOP.md`
- 适用对象：所有 BoundX Real Gold Case 的人读文档与双语展示
- 核心原则：**机器事实源只有一套，人类展示可以多语言；公式必须可读，解释必须紧跟结果。**

---

# 1. 本文件解决什么问题

本文件不重新定义 Gold 的语义标准，也不重新定义生成 SOP。

它只规定：

```text
Gold 应该怎样排版
Gold 应该怎样展示
中文与英文怎样对应
公式怎样写
Evidence 怎样展示
哪些内容进入 Markdown
哪些内容只留在 JSON
```

因此三份文件职责固定为：

```text
GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md
= 什么是正确 Gold

GOLD-GENERATION-SOP.md
= 怎么生成正确 Gold

GOLD-PRESENTATION-AND-BILINGUAL-FORMAT.md
= 怎么把正确 Gold 清楚地展示给人
```

---

# 2. 一个正式 Gold Case 的目录结构

推荐固定为：

```text
REAL-GOLD-001/
├─ source/
│  └─ TASK-....md
├─ context/
│  ├─ SOURCE-PROVENANCE.json
│  └─ ...
├─ GOLD.zh-CN.md
├─ GOLD.en.md
├─ GOLD.json
├─ EVIDENCE.json
├─ FORMAL-MODEL.json
├─ RESULT.json
├─ REVIEW.json
└─ MANIFEST.json
```

其中：

```text
GOLD.zh-CN.md
= 中文分析与审定稿

GOLD.en.md
= 同一 Case 的英文说明版

JSON files
= 唯一机器事实源
```

禁止维护两套独立 Gold 事实。

---

# 3. 双语规则

## 3.1 中文版与英文版是同一个 Case

以下内容必须完全一致：

```text
Case ID
Source Task ID
Source SHA-256
Evidence ID
Evidence span
7+1 status
Formal Model
数学公式
BoundaryState
PolicyEvaluation
Admission
G1-G10
最终 Review Status
```

只允许翻译：

```text
章节标题
自然语言解释
说明文字
Recommendation 展示文本
```

---

## 3.2 原始 Evidence 永远保持原文

若 Source Task 是中文：

```text
quote = 中文原文
```

则英文版不得把 quote 替换成英文翻译。

必须始终满足：

```text
Source[start:end] == quote
```

英文版如果需要帮助英文读者理解，可以附加：

```text
translation
```

但必须明确：

```text
quote_origin = SOURCE
translation_origin = DERIVED_TRANSLATION
```

翻译不是 Evidence。

---

## 3.3 英文说明版不等于英文输入测试用例

```text
GOLD.en.md
```

只是同一个 Gold Case 的英文说明版。

它不是：

```text
English NLP benchmark case
```

要测试英文抽取能力，必须另建独立英文 Case：

```text
English Source Task
+ independent SHA-256
+ independent Evidence spans
+ independent 7+1 adjudication
+ independent Gold result
```

禁止把中文 TASK 翻译成英文后，直接当作英文输入测试样本。

---

# 4. GOLD.zh-CN.md 的固定章节顺序

中文版统一采用以下结构：

```text
# REAL-GOLD-xxx / GOLD.zh-CN.md

Case 基本信息

## 1. Case Input & Source Metadata

## 2. 第一层：源证据
### 完整 Source
### Evidence 索引
### Evidence Replay

## 3. 第二层：Evidence-linked 7+1
### [I] 输入范围
### [O] 交付结果
### [A] 动作
### [P] 参与主体
### [R] 资源约束
### [V] 版本与依据
### [C] 完成条件
### [+1 / B] 禁止边界

## 4. 第三层：形式化边界模型
### E
### Sigma
### Q
### F
### K
### Relations
### D
### Phi
### Formalization Losslessness

## 5. 第四层：确定性计算与审定
### 1. 必需条件缺口
### 2. 禁止边界冲突
### 3. 约束一致性
### 4. 完成条件可判定性
### 5. 合法解空间
### 6. 边界唯一性
### 7. Boundary State
### 8. Policy Evaluation
### 9. Admission

## 6. Fixed Diff & Output Summary

## 7. Recommendation

## 8. Validator Replay

## 9. Gold Freeze Gates

## 10. Final Status
```

章节顺序不得任意变化。

---

# 5. GOLD.en.md 的固定章节顺序

英文版与中文版一一对应：

```text
# REAL-GOLD-xxx / GOLD.en.md

Case metadata

## 1. Case Input & Source Metadata

## 2. Layer 1: Source Evidence
### Full Source
### Evidence Index
### Evidence Replay

## 3. Layer 2: Evidence-linked 7+1
### [I] Input
### [O] Output
### [A] Actions
### [P] Participants
### [R] Resources
### [V] Version & Provenance
### [C] Completion
### [+1 / B] Forbidden Boundary

## 4. Layer 3: Formal Boundary Model
### E
### Sigma
### Q
### F
### K
### Relations
### D
### Phi
### Formalization Losslessness

## 5. Layer 4: Deterministic Calculations & Adjudication
### 1. Required Deficit
### 2. Forbidden Conflict
### 3. Constraint Consistency
### 4. Completion Decidability
### 5. Solution Space
### 6. Boundary Uniqueness
### 7. Boundary State
### 8. Policy Evaluation
### 9. Admission

## 6. Fixed Diff & Output Summary

## 7. Recommendation

## 8. Validator Replay

## 9. Gold Freeze Gates

## 10. Final Status
```

两种语言的章节数量和对应关系必须一致。

---

# 6. 人读版的总体排版原则

正式 `GOLD.zh-CN.md` / `GOLD.en.md` 必须遵循：

```text
人类可读优先
数学严谨不丢
机器细节不堆叠
公式与解释紧邻
每一步都有明确结果
```

禁止把整个 Gold 写成密集 JSON 转录。

禁止把大段 Formal Model 压成一行。

禁止只写：

```text
PASS
```

而不给计算过程和解释。

---

# 7. 7+1 的固定展示格式

每个槽位单独成段，不使用超宽总表。

推荐格式：

```markdown
### [I] 输入范围 / Input

**status：** `resolved`

**value：**
...

**Evidence：**
`E-01`, `E-02`

**origin：**
`SOURCE`

**normalization：**
...

**ontology_binding：**
`unresolved`

**说明：**
...
```

顺序固定为：

```text
status
value
evidence
origin
normalization
ontology_binding
notes
```

---

# 8. 数学公式展示规则

## 8.1 数学公式必须使用 LaTeX

行内公式：

```markdown
$R = absent$
```

独立公式：

```markdown
$$
Missing_{task}
=
Required_{task}
-
Specified_{task}
$$
```

禁止把主要数学公式全部放入：

```text
plain text code block
```

因为人读效果差。

---

## 8.2 每个计算必须有四层

固定顺序：

```text
公式
↓
本 Case 代入
↓
计算结果
↓
中文/英文解释
```

例如：

### 必需条件缺口

定义：

$$
Missing_{task}
=
Required_{task}
-
Specified_{task}
$$

本 Case：

$$
Missing_{task}
=
\varnothing
$$

**结果：通过**

说明：Q1~Q4、报告结构和证据要求已经明确，`R = absent` 不构成缺项。

---

# 9. 第四层：确定性计算的固定人读格式

每个 Gold 都必须按以下顺序展示。

---

## 9.1 必需条件缺口

$$
Missing_{task}
=
Required_{task}
-
Specified_{task}
$$

最后必须明确显示：

$$
Missing_{task}
=
...
$$

---

## 9.2 禁止边界冲突

定义：

$$
ForbiddenConflict
=
PlannedEffects
\cap
ForbiddenEffects
$$

应展示两个集合：

$$
\mathcal{A}_{planned}
=
\{...\}
$$

$$
F_{forbidden}
=
\{...\}
$$

再展示交集结果：

$$
\mathcal{A}_{planned}
\cap
F_{forbidden}
=
...
$$

---

## 9.3 约束一致性

展示关键约束是否可以同时成立。

例如：

$$
ModifiedInvestigatedSourceFiles
=
\varnothing
$$

与：

$$
WriteTargets
\subseteq
\{REPORT\text{-}003\}
$$

若可同时成立：

$$
Consistency=true
$$

---

## 9.4 完成条件可判定性

必须引用 $K$：

$$
Decidable(K)=true
$$

并说明为什么可被事实检查。

---

## 9.5 合法解空间

必须展示：

$$
\Omega_B
=
\{
x\in X_{\Sigma}
\mid
Q(x)
\land
\neg F(x)
\land
K(x)
\land
\Phi(x)
\}
$$

然后给出：

$$
\Omega_B
\neq
\varnothing
$$

或：

$$
\Omega_B
=
\varnothing
$$

---

## 9.6 边界唯一性

必须明确区分：

$$
BoundaryUnique
\neq
ExecutionPathUnique
$$

如边界唯一但合法路径多条：

$$
canonical\_boundary\_candidates=1
$$

$$
|\Omega_B|>1
$$

仍可：

$$
BoundaryUnique=true
$$

推荐展示竞争解释：

```text
Candidate A
→ REJECTED

Candidate B
→ REJECTED

Candidate C
→ ACCEPTED_CANONICAL
```

这样人工审查最容易理解。

---

## 9.7 Boundary State

最终结果应单独突出：

$$
\boxed{BoundaryState=determined}
$$

或：

$$
\boxed{BoundaryState=underdetermined}
$$

或：

$$
\boxed{BoundaryState=inconsistent}
$$

或：

$$
\boxed{BoundaryState=invalid}
$$

---

## 9.8 Policy Evaluation

如无 Profile：

$$
OperatorProfile=null
$$

因此：

$$
PolicyEvaluation
=
NOT\_EVALUATED\_NO\_OPERATOR\_PROFILE
$$

必须解释：

```text
这不是 PASS，也不是 FAIL。
```

---

## 9.9 Admission

如 Profile 缺失：

$$
Admission
=
NOT\_EVALUATED\_PROFILE\_MISSING
$$

不得写成 PASS 或 FAIL。

---

# 10. Evidence 的展示要求

Evidence 推荐只在 Markdown 里展示索引：

| Evidence | 用途 | Span | 行号 | Replay |
|---|---|---:|---:|---|
| `E-01` | ... | `30:57` | `4-5` | PASS |

完整 quote 可以：

```text
直接展示
```

或者放在 `EVIDENCE.json` 中。

但 Markdown 中必须让人能够明确知道：

```text
Evidence ID
用途
原始 span
Replay 状态
```

---

# 11. 表格使用规则

Markdown 人读版只建议在以下场景使用表格：

```text
Evidence 索引
G1-G10 Gate
少量最终状态摘要
```

不建议用大表展示：

```text
整个 7+1
整个 Formal Model
全部数学计算
```

因为会显著降低可读性。

---

# 12. JSON 与 Markdown 的分工

## Markdown 负责

```text
解释
审阅
数学展示
结论
推导过程
人工理解
```

## JSON 负责

```text
唯一机器事实
精确结构
Evidence quote
span
SHA
Formal model atoms
计算结果
Gate state
Replay hash
```

Markdown 不应成为另一套机器事实源。

---

# 13. 固定 Diff 的展示

推荐：

```text
[I] OK
[O] OK
[A] OK
[P] OK
[R] ABSENT
[V] OK
[C] OK
[B] OK
```

然后单独给出计算摘要。

中文版可写：

```text
Missing_task        = NONE
ForbiddenConflict   = NONE
Consistency         = PASS
CompletionDecidable = PASS
SolutionSpace       = NON_EMPTY
BoundaryUnique      = TRUE
BoundaryState       = determined
PolicyEvaluation    = ...
Admission           = ...
```

协议字段保持固定，不翻译字段名。

---

# 14. Recommendation 展示规则

Recommendation 必须来自：

$$
Recommendation
=
f(Diff,Findings,AdmissionGap)
$$

中文版用中文解释。

英文版用英文解释。

不得改变 Recommendation 的事实含义。

---

# 15. Validator Replay 展示规则

Markdown 中必须简洁展示真实机器验证状态，例如：

```text
Source byte equality              = PASS
SHA-256 recalculation             = PASS
Evidence spans replayed           = PASS
Ontology binding-state compliance = PASS
FormalCoverageGap                 = empty
Deterministic STEP 5 replay       = PASS
```

如存在 replay hash：

```text
Replay hash #1 = ...
Replay hash #2 = ...
```

并说明：

$$
ReplayHash_1
=
ReplayHash_2
$$

---

# 16. Gold Freeze Gates 展示规则

固定使用简洁表格：

| Gate | Check | Result |
|---|---|---|
| G1 | Source immutable | PASS |
| G2 | Source SHA verified | PASS |
| G3 | All evidence replayable | PASS |
| G4 | 7+1 adjudicated | PASS |
| G5 | absent/unresolved preserved | PASS |
| G6 | ontology binding state correct | PASS |
| G7 | Formalization lossless | PASS |
| G8 | deterministic replay | PASS |
| G9 | Boundary uniquely justified | PASS |
| G10 | Admission status justified | PASS |

未验证必须显示：

```text
PENDING
```

不得为了版面好看而隐藏。

---

# 17. Final Status 的展示要求

Review 结果必须单独突出：

$$
\boxed{ReviewStatus=GOLD\_REVIEW\_PASSED}
$$

如果尚未通过：

$$
\boxed{ReviewStatus=DRAFT\_FOR\_REVIEW}
$$

ADMIN 状态单独展示：

$$
ADMINStatus
=
AWAITING\_ADMIN\_GOLD\_FREEZE
$$

只有 ADMIN 明确签署后：

$$
ADMIN\_GOLD\_FROZEN
$$

---

# 18. 中文版措辞要求

中文人读版应：

```text
中文为主
协议固定字段保留英文
公式使用统一数学符号
避免一句话堆多个概念
避免中英词汇反复混杂
```

推荐：

```text
必需条件缺口
禁止边界冲突
约束一致性
完成条件可判定性
合法解空间
边界唯一性
```

而协议固定字段保留：

```text
BoundaryState
Admission
OperatorProfile
Missing_task
ForbiddenConflict
```

---

# 19. 英文版措辞要求

英文版：

```text
必须忠于中文版 Gold 的事实
不得重新审定
不得重新解释 Evidence
不得改变数学结论
```

若中文版与英文版出现结论差异：

```text
以 JSON 机器事实源为准
两份 Markdown 均视为需要修订
```

---

# 20. 正式模板示例

以下示例展示推荐的阅读节奏。

## 5. 第四层：确定性计算与审定

### 1. 必需条件缺口

定义：

$$
Missing_{task}
=
Required_{task}
-
Specified_{task}
$$

本 Case：

$$
Missing_{task}
=
\varnothing
$$

**结果：通过**

说明：任务要求已闭合；`R = absent` 不属于缺项。

---

### 2. 禁止边界冲突

计划动作集合：

$$
\mathcal{A}_{planned}
=
\{
read,\ inspect,\ write(REPORT\text{-}003)
\}
$$

禁止写范围：

$$
F_{write}
=
SourceTree
\setminus
\{REPORT\text{-}003\}
$$

计算：

$$
\mathcal{A}_{planned}
\cap
F_{write}
=
\varnothing
$$

所以：

$$
ForbiddenConflict
=
NONE
$$

**结果：通过**

---

### 3. 合法解空间

$$
\Omega_B
=
\{
x\in X_{\Sigma}
\mid
Q(x)
\land
\neg F(x)
\land
K(x)
\land
\Phi(x)
\}
$$

存在合法方案：

$$
\Omega_B
\neq
\varnothing
$$

因此：

$$
SolutionSpace
=
NON\_EMPTY
$$

---

### 4. 边界唯一性

$$
canonical\_boundary\_candidates
=
1
$$

同时：

$$
|\Omega_B|
>
1
$$

因此：

$$
BoundaryUnique
\neq
ExecutionPathUnique
$$

仍可得到：

$$
BoundaryUnique
=
true
$$

---

### 5. Boundary State

$$
\boxed{
BoundaryState
=
determined
}
$$

---

# 21. 结论

以后所有正式 Real Gold 的人读文档必须遵循：

```text
中文一份
英文一份
机器事实一套
原始 Evidence 永远不翻译替换
数学公式直接可读
解释紧跟公式
每一步都给结果
```

最终目标不是“文档看起来技术化”，而是：

> **让人类审阅者能够轻松理解 BoundX 为什么得出这个边界结论，同时机器仍能独立重放全部事实与计算。**
