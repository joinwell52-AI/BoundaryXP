# BoundX 7+1：定义、原理、语义编译与边界计算说明

**从 ADMIN 自然语言任务到可计算授权边界的规范化方法 · v0.4**

> 文档性质：规范性定义 + 实现原则 + 计算约束。  
> 本版目标：冻结“ADMIN Task → Candidate Semantic Graph → 可认证授权边界语义 → Root Canonical 7+1”的可实现方法。  
> 当前工程阶段只验收 **Natural Language → Canonical 7+1**；后续边界公式与执行空间计算属于第二阶段。  
> 代码实现可以继续演进，但不得破坏本文的规范性语义。

> **v0.3.1 修正说明（2026-10-04）**：本版纠正旧 v0.3 后半部分“自动发现/聚类 WP、由 Local WP 汇总 Root 7+1”的实验路线。当前 Parser 只解析 ADMIN 源任务；WP 只能来自 ADMIN 显式声明。历史 v0.3 仍可从 Git 历史审计，不再作为当前规范。

> **v0.4 方法修正说明（2026-10-06）**：026/026E/026F 实验表明，“传统 NLP 信号 + 大量手工组合规则”不足以作为开放 ADMIN 自然语言的主语义解析方法。本版保留 7+1、Candidate Semantic Graph、Γ、Eligibility、Boundary IR、Proof/Coverage 的规范核心，但正式修改 Semantic Parsing P：**LLM/强语言模型成为主语义候选生成器；Typed Recognizer 保留精确字面量身份；HanLP/spaCy/SRL/SDP/成分分析降为辅助证据与交叉检查；Γ 仍是唯一最终认证点；LLM 不直接写 7+1、不直接认证授权边界。** v0.3.1 作为历史基线保留，不再是当前自然语言入口实现规范。


---

## 0. 文档定位与规范性层级

BoundX 7+1 的外部目标可以写成一句话：

```text
自然语言任务 → 结构化 7+1
```

但 7+1 不是“把词分到 8 个桶”的文本分类器。它是一套**任务边界的规范化表示（Canonical Boundary View）**，用于把自然语言任务中可以被明确计算、约束、验证的部分，转换为有类型、可追溯、可证明的边界结构。

本文把内容分为两层：

1. **规范性核心（Normative Core）**：7+1 的定义、状态语义、边界资格、计算规则、证明要求。实现不得违背。
2. **实现性方法（Implementation Method）**：Structure、Span Lattice、Semantic Graph、Eligibility、Boundary IR、Proof DAG 等。实现可以优化，但输出语义必须等价。

本文不追求“理解所有自然语言”。BoundX 只负责把**可定义的任务边界**编译成可计算结构；对无法可靠定义的部分必须保留不确定性，而不是猜测。

### 0.1 v0.2 相对 v0.1 的关键更新

v0.2 不推翻 7+1 的基本定义，主要把从自然语言到边界的中间语义正式化：

- 明确 `Span Lattice`，避免一次切分即决议；
- 明确 `Relation Bundle`，允许一个 Clause 同时承载多个语义关系；
- 正式定义动作模态 `REQUIRED / PERMITTED / NOT_REQUIRED / FORBIDDEN`；
- 正式定义参与者角色 `PERFORMER / APPROVER / REVIEWER / RECIPIENT / COLLABORATOR`；
- 将 Scope、Condition、Quantity 提升为一等表达式节点；
- 正式定义 `EligibilityDecision`：理解到一个事实不等于它有资格进入边界；
- 将旧称 `BoundaryAST` 统一为 `BoundaryIR`；
- 正式定义 `Canonical7Plus1`、槽位状态与开放性；
- 增加 `Coverage Accountability`，保证 ABSENT 不是“漏识别”；
- 增加 `Proof DAG`，保证最终 7+1 每个 resolved 条目可反向证明；
- 增加 `first divergence` 调优原则；
- 明确 Coverage 应按槽位影响传播，而不是局部未知全局污染。

### 0.2 v0.3 相对 v0.2 的关键更新

v0.3 **不改变 7+1 的规范定义**，主要把 7P-REPAIR-001 / 002 已经实证有效的解析方法正式化：

- 明确 **开放语言、有限关系、确定计算**：自然语言表达不可穷举，但边界关系、表达式类型和投影查询必须收敛为有限合同；
- 将自然语言解析的第一产物明确为 **Candidate Semantic Graph（候选结构化语义图）**，而不是 7+1；
- 引入 **Discourse Domain**，区分 CURRENT_TASK、BACKGROUND、OUTPUT_CONTENT、ACCEPTANCE、OUT_OF_SCOPE、CODE、QUOTE、TABLE、METADATA 等语义域；
- 引入 **Artifact Role Resolution**，区分 EXISTING_INPUT、READ_ONLY_INPUT、MODIFICATION_TARGET、GENERATED_OUTPUT、UPDATED_OUTPUT、CONDITIONAL_OUTPUT、REFERENCE_ONLY 等对象角色；
- 明确 **Structured Table Proposition**：表头 + 行 + 单元格共同构成关系命题，禁止孤立 TABLE_CELL 直接升格边界；
- 将 **OUTPUT_CONTENT** 提升为一等语义作用域：写 prompt/spec/doc 与“文档中要求未来执行 X”必须分离；
- 强化 **Participant Eligibility Gate**：SRL AGENT、PERSON-like token、技术名词均不能单独产生 P；
- 明确 **Quantity Classification**：数字先分类，再判断是否真正限制解空间；数量不自动进入 R；
- 明确 **Reference/Basis Resolution**：identifier 只有通过 BASIS / CONFORMS_TO / PREDECESSOR / SUPERSEDES / PROVENANCE 等有证据关系才进入 V；
- 明确 **Completion Composition**：验收项、only-if、AND/OR、ALL_OF/ANY_OF 形成结构化完成表达式，而不是把“验收”当普通动作；
- 将 Canonical 7+1 明确为对已认证边界语义图的 **八个确定性 Graph Views / Queries**；
- 明确“不确定”也是确定输出：无法唯一证明时进入 typed unresolved，不允许靠模型或字符串规则强行选边。


---

# 第一部分：7+1 的规范性定义

## 1. 7+1 是什么

7+1 是任务边界的**规范化视图**。它把自然语言任务中已被证明可定义的边界，投影为七个正向维度与一个负向覆盖层 B：

| 维度 | 名称 | 规范定义 | 不应误收 |
|---|---|---|---|
| I | Input / Scope 输入与作用域 | 任务明确作用于、读取、检查、处理或纳入范围的对象、数据、文件、系统、服务、环境、显式输入与范围成员。 | 不是所有名词；参与者、条件、接收者、仅因被禁止而出现的对象，不自动进入 I。 |
| O | Output / Deliverable 交付与结果 | 任务明确要求或条件性要求产生的文件、报告、产物、输出、可观察结果或交付物。 | `不需要生成 X` 不产生正向 O；但若另一个条件分支要求生成 X，则 O 可以带条件存在。 |
| A | Actions 正向动作 | 任务明确要求或允许执行的正向操作与主任务事件。 | FORBIDDEN 不进入 A；NOT_REQUIRED 不进入 A；纯条件、顺序词、范围操作符不进入 A。 |
| P | Participants 参与者 | 与任务动作发生明确参与关系的执行者、审核者、批准者、接收者、协作者等。 | P 不等于 Authority；岗位名称本身不自动赋权。 |
| R | Resources / Quantitative Constraints 资源与量化约束 | 真正限制解空间的时间、预算、容量、次数、配额、阈值、上限、下限等量化边界。 | 数字本身不等于 R；验收计数、产物数量、完成条件里的数量，不因“有数字”自动进入 R。 |
| V | Version / Basis 版本与依据 | 对任务具有规范性约束作用的版本、commit、工单、ADR、政策、规程、规范、参考、基线、符合性依据。 | 不是所有 identifier；只有通过 BASIS / CONFORMS_TO / GOVERNS 等关系成为任务依据时才进入 V。 |
| C | Completion / Stop 完成与停止 | 任务何时完成、停止、中止、升级，及其必要/充分条件组合。 | 普通 IF/WHEN、顺序词、deadline 本身不等于 C。 |
| B | Forbidden / Restriction 禁止与限制 | 明确不能执行、不能访问、不能修改、在特定条件下受限的动作、对象或组合。 | B 是负向覆盖层，不是普通“第八个正向桶”。 |

### 1.1 Canonical Entry 不是字符串

最终每个 7+1 条目都应是有结构的 Canonical Entry，至少包含：

```text
value / semantic identity
state
condition
scope
quantity (如适用)
actor / participant role (如适用)
source_spans
boundary_fact_ids
proof lineage
```

显示层可以把它渲染成简短文字，但机器权威结构不能退化为字符串列表。

---

## 2. “7”与“+1”的关系

I/O/A/P/R/V/C 不是同一全集上的七张白名单。它们是同一任务边界图上的七种**有类型约束轴**。

同一个底层实体可以被不同关系引用。例如 `report.md`：

```text
O: report.md 是交付物
A: generate(report.md) 是动作
C: exists(report.md) 可以参与完成条件
```

这不表示字符串被重复分类，而表示同一个实体参与了不同语义关系。

B 与前七项不同。B 是负向覆盖层，例如：

```text
FORBID(modify, config.yaml)
FORBID(deploy, production, condition = NOT approved_by(manager))
```

因此 B 可以跨维度约束 A、I、P、Scope、Condition 等组合。

**规范性结论：B 是 +1，不能简化为普通第八个正向维度。**

---

## 3. 维度开放性：OPEN / CONSTRAINED / CLOSED

“某槽没有条目”不能自动解释为“禁止”。

每个正向维度 `d ∈ {I,O,A,P,R,V,C}` 在内部应具有开放性状态：

```text
OPEN         原文未定义该维，不增加约束
CONSTRAINED  原文对该维给出部分约束
CLOSED       原文明确定义封闭允许范围
```

例如：

```text
“由张工执行”              → P 被约束，但未必 CLOSED
“只能由张工执行”          → P 可被判为 CLOSED
“未提参与者”              → P = OPEN，而不是 P = 空集合禁止任何人
```

UI 可以显示 `ABSENT`，但计算语义必须理解为：**没有显式边界定义，维度保持开放。**

---

## 4. 四种槽位状态

最终 Canonical Slot 必须严格区分：

### 4.1 RESOLVED

存在真实边界事实，关键身份、关系、条件、作用域、数量足够确定，并且证明链完整。

### 4.2 UNRESOLVED

存在真实边界候选，但有会改变边界结论的不确定性，例如：

- 多个同等合理指代；
- 关系类别不能唯一确定；
- 条件或作用域无法闭合；
- 数量有“尽快/适量”等约束意味但无法计算。

### 4.3 ABSENT

只有在**该槽相关源文本问责闭合**之后，才能判定 ABSENT：

```text
该槽没有 Boundary Fact
AND 没有可能映射到该槽的 unresolved
AND 没有该槽相关 coverage failure
AND 源文本已被完整问责
```

ABSENT 表示“原文没有显式定义这一维”，不是禁止。

### 4.4 PARSER_COVERAGE_FAILURE

原文存在明显可能承载边界的语义区域，但 Parser 当前不能可靠解释。

Coverage failure 不得被伪装为 ABSENT；也不应在可以确定具体受影响槽位时污染无关槽位。

---

## 5. Typed UNRESOLVED

UNRESOLVED 不能成为“懒惰出口”。至少应区分：

```text
UNRESOLVED_AMBIGUOUS
UNRESOLVED_COREFERENCE
UNRESOLVED_SCOPE
UNRESOLVED_RELATION
UNRESOLVED_QUANTIFICATION
```

可扩展其他类别，但必须满足：

- 原因可定位；
- 关联到 source span / node / relation / clause；
- 下游知道需要人工澄清、模型调优还是关系词汇扩展。

---

# 第二部分：什么才有资格成为边界

## 6. Boundary Definition Envelope

BoundX 不要求所有语义事实都进入边界。语义事实必须先落入“可定义边界域”。

### 6.1 DEFINED

典型包括：

- 明确任务对象和范围；
- 明确交付物；
- 明确正向动作；
- 明确参与关系；
- 明确可计算量化限制；
- 明确规范/版本/依据；
- 明确完成/停止条件；
- 明确禁止/限制。

### 6.2 UNRESOLVED_WITHIN_ENVELOPE

属于边界问题，但信息不足：

```text
“尽快完成”
“由合适的人审核”
“不得操作这些文件”但“这些”指代不清
```

### 6.3 OUTSIDE_ENVELOPE

对任务可能有意义，但不参与边界计算：

```text
“这个任务很重要”
“希望效果更好”
“最好更专业”
未陈述的业务动机
```

**规范性原则：语义理解 ≠ 边界资格。**

---

## 7. Boundary Eligibility

任何语义节点或关系在进入 Boundary IR 前，必须有显式 `EligibilityDecision`。

Eligibility 的核心问题是：

> 这个已理解的语义事实，是否真的定义了任务边界？

建议状态：

```text
BOUNDARY
AUXILIARY
OUTSIDE_ENVELOPE
UNRESOLVED
COVERAGE_FAILURE
```

典型例子：

```text
SCOPE_MEMBER(task, routes.csv)
→ BOUNDARY / TASK_OBJECT

RESULT(generate, report.md)
→ BOUNDARY / DELIVERABLE

LIMIT(health_check, retry <= 3)
→ BOUNDARY / RESOURCE

BASIS(task, SPEC-42)
→ BOUNDARY / BASELINE

“若发现重复路由”
→ 通常是 AUXILIARY CONDITION

“这个任务很重要”
→ OUTSIDE_ENVELOPE
```

Raw token、POS、dependency、embedding score 不能绕过 Eligibility 直接生成 Boundary Fact。

---

# 第三部分：动作、参与者、条件、数量的规范语义

## 8. Action Modality

动作模态是语义编译中的一等属性：

```text
REQUIRED      必须/应执行
PERMITTED     可以/允许执行
NOT_REQUIRED  在给定条件下没有义务执行
FORBIDDEN     禁止执行
```

### 8.1 与 7+1 的投影关系

```text
REQUIRED / PERMITTED  → 正向 A 候选
FORBIDDEN              → B 候选，不进入 A
NOT_REQUIRED           → 不进入 A，也不进入 B
```

`NOT_REQUIRED` 表示义务撤回或不存在，不等于禁止。

例如：

```text
若发现异常 → 应生成 report.md
若未发现异常 → 无需生成该报告
```

正确表示应是：

```text
O: report.md, condition = 异常存在
A: generate(report.md), condition = 异常存在, modality=REQUIRED
Aux: NOT_REQUIRED(generate(report.md)), condition = NOT 异常存在
```

错误表示包括：

```text
B: FORBID(generate report.md)       # 错
A: NOT_REQUIRED generate report.md  # 错
```

---

## 9. Participant Role

P 不是简单的人名列表。参与者应带角色：

```text
PERFORMER
APPROVER
REVIEWER
RECIPIENT
COLLABORATOR
```

同一参与者可以有多个角色。

例如：

```text
“林工执行检查”             → 林工 [PERFORMER]
“发送给架构负责人”         → 架构负责人 [RECIPIENT]
“未经架构负责人批准”       → 架构负责人 [APPROVER]
```

**岗位名称不等于 Authority。**

“负责人”“管理员”“经理”等词，只有在出现实际 APPROVAL / REVIEW / PERFORM / RECEIVE 等关系时才产生相应 P 角色。

---

## 10. Scope / Set Expression

作用域必须是可计算结构，不应保存成模糊字符串。

推荐集合表达式：

```text
ITEM
ALL
ANY
UNION
INTERSECTION
EXCEPT
```

例如：

```text
“除 test.csv 外的所有待归档数据”
```

应表达为：

```text
EXCEPT(
  ALL(待归档数据),
  ITEM(test.csv)
)
```

范围声明如：

```text
“检查范围包括 A、B、C”
“核验对象为 A、B 以及 C”
```

属于 `SCOPE_MEMBER` 关系，不是业务 ACTION。

---

## 11. Condition Expression

条件必须是一等逻辑结构：

```text
STATE_REF
RELATION_REF
BOUNDARY_FACT_REF
AND
OR
NOT
```

例如：

```text
只有当配置复核通过，并且至少一次健康检查成功时才完成
```

应形成类似：

```text
AND(
  STATE_REF(config_review_passed),
  QUANTIFIED_STATE(health_check_success, GTE 1)
)
```

不能把 `只有当`、`并且`、`若` 等词直接当 C；它们是逻辑操作符或条件连接词。

---

## 12. Quantity Expression 与 R 的严格区分

数量表达式至少包含：

```text
metric
target
lower_bound / upper_bound
inclusive
unit
source provenance
```

常见比较符归一化：

```text
最多 / 至多 / 不超过  → LTE
至少 / 最少 / 不少于  → GTE
恰好 / 正好           → EQ
```

但**数量事实 ≠ R**。

例 1：

```text
每项检查最多重试 3 次
```

这是执行解空间限制：

```text
R: retry_count <= 3
```

例 2：

```text
至少两轮检查成功才完成
```

这是 C 的数量化条件，不自动进入 R。

例 3：

```text
提交 3 个 commit
```

只有当它真正限制任务执行资源/解空间时才是 R；若只是计划或产物结构，应保留为其他结构化事实。

---

# 第四部分：自然语言到边界的语义编译器

## 13. 总体拓扑

v0.4 的规范实现采用以下编译拓扑：

```text
Raw ADMIN Task
    ↓
Document Structure + Source Preservation
    ↓
Typed Recognizers
(FILE / PATH / URI / VERSION / COMMIT / REFERENCE / NUMBER / DATE / TIME ...)
    ├──────────────────────────────┐
    ↓                              ↓
LLM Semantic Parser P_llm      NLP Evidence E_nlp
(primary semantic proposals)   (HanLP/spaCy/SRL/SDP/DEP/CON)
    │                              │
    └──────────────┬───────────────┘
                   ↓
Candidate Semantic Graph Gc
    ├─ Candidate Nodes
    ├─ Candidate Relations / Bundles
    ├─ Candidate Expressions
    ├─ Competing Interpretations
    ├─ Source Grounding
    └─ Evidence / Contradiction
                   ↓
LLM Coverage Audit P_cov
(只提出漏项/冲突/竞争解释，不直接认证)
                   ↓
Deterministic Source / Schema Validation
                   ↓
Γ Deterministic Certification
CERTIFIED / REJECTED / TYPED_UNRESOLVED
                   ↓
Eligibility Decisions
                   ↓
Boundary-qualified Graph Gb + Unresolved Graph Gu
                   ↓
Boundary IR
                   ↓
Deterministic 7+1 Graph Views / Queries
                   ↓
Canonical 7+1
                   ↓
Proof DAG + Coverage Accountability
```

数学骨架更新为：

```text
T_admin
  --(Typed, P_llm, E_nlp, P_cov)--> Gc
  --Γ--> (Gb, Gu)
  --Q--> Root Canonical 7+1
```

其中：

- `P_llm`：主语义解析器，只负责提出来源可追溯的语义候选；
- `Typed`：确定性字面量识别，只证明精确 span / literal identity，不直接决定 I/O/A/P/R/V/C/B；
- `E_nlp`：辅助语言学证据，不再负责用大量手工规则重建完整语义；
- `P_cov`：独立覆盖审阅调用，检查候选图可能遗漏、矛盾或误提升的源语义，只产生候选审计结果；
- `Gc`：开放候选语义图；
- `Γ`：唯一最终语义认证点；
- `Gb / Gu`：已认证边界语义与类型化未决；
- `Q`：固定的 7+1 图查询。

**v0.4 的核心变化：自然语言理解不再主要由 BoundX 自己的构式规则拼接完成。LLM 负责语言理解和候选结构生成；BoundX 负责来源约束、证据融合、确定性认证、边界资格、计算和证明。**

---

## 14. Source Preservation / Typed Recognition

进入任何模型前必须冻结原文和精确码点位置。

Typed Recognizer 继续负责：

```text
FILE / PATH / URI / API / SYMBOL
VERSION / COMMIT / TICKET / ADR / POLICY / REFERENCE
NUMBER / PERCENT / DURATION / DATE / TIME / DEADLINE
```

Typed 识别的权威只限于：

- 原文 span；
- 字面量类型候选；
- 可确定规范化值。

例如识别到 `report.md` 只能证明这是文件样式字面量，不能直接证明它是 I 或 O。

LLM 不直接计算字符偏移。推荐输出：

```text
source_quote
clause_id / sentence_id
occurrence / local context
```

由确定性 Source Linker 映射回原文精确 span。重复字符串不能仅凭第一次出现位置绑定。

---

## 15. LLM Semantic Parser：主语义候选生成

LLM 输入至少包括：

- ADMIN 原文；
- 文档/句段结构；
- protected typed spans；
- Candidate Graph 输出 Schema；
- 当前方法的有限 node/relation/expression 合同。

LLM **不得看到 benchmark Gold、期望 7+1、case-specific 修复说明或答案表**。

LLM 必须输出结构化候选，而不是最终 7+1。至少包括：

### 15.1 Candidate Nodes

有限节点类型仍为：

```text
ENTITY
EVENT
STATE
VALUE
REFERENCE
CONDITION
DISCOURSE
UNKNOWN_REFERENT
```

每个节点必须有：

```text
candidate_node_id
node_type
surface / source_quote
source_ref
semantic_identity / normalized_hint
discourse_layer
candidate_status
evidence_refs
alternative_group_id (如适用)
```

### 15.2 Candidate Relations

关系空间仍有限：

```text
AGENT
PATIENT
THEME
RESULT
RECIPIENT
LOCATION
BASIS
CONFORMS_TO
SCOPE_MEMBER
LIMIT
CONDITION_OF
COMPLETION_OF
STOP_OF
APPROVAL_OF
FORBIDS
RESTRICTS
COREFERENCE
CONJUNCTION
SEQUENCE
PART_OF
```

LLM 必须区分：

- 当前任务动作；
- 条件/时间前提中的事件；
- 定语/补语/目的结构；
- OUTPUT_CONTENT / QUOTE / BACKGROUND 中被提及的事件；
- 组织、复核、接收、批准等参与用途；
- 必须、允许、无需、禁止的作用目标；
- 依据与任务对象。

### 15.3 Candidate Expressions

Scope / Condition / Quantity / Set / Coreference 必须保持结构，不得扁平化成字符串。

例如：

```text
“只有 QA 复核通过后，PM 才可以提交 report.md”
```

应能够提出：

```text
EVENT(review)      actor=QA
STATE(review_passed)
EVENT(submit)      actor=PM, object=report.md, modality=PERMITTED
CONDITION_OF(review_passed, submit)
```

但 **不能仅因时间前提出现 review，就自动补造“QA 必须执行 review”**；是否存在独立 REQUIRED review 必须有原文来源。

### 15.4 竞争解释和未决

LLM 不需要强行唯一理解。若原文存在两个合理指代或作用域，必须输出竞争候选或 UNKNOWN_REFERENT，而不是只给最高概率答案。

LLM 自报 confidence 不具有认证权。

---

## 16. Source Grounding：LLM 候选必须可回到原文

所有边界相关候选至少需要一个精确源见证。

确定性 Source Linker 负责：

1. 验证 quote 确实来自原文；
2. 解析重复出现位置；
3. 生成精确 source span；
4. 拒绝伪造、改写或不存在的 quote；
5. 记录跨句关系两端的来源。

抽象语义（例如“复核通过状态”）可以没有单一连续 span，但必须引用构成它的真实 source spans，并记录组合来源。

**Source grounding 只证明“这条候选有原文依据”，不单独证明候选解释一定正确。**

---

## 17. NLP / NLI / Embedding：辅助证据，不再承担主解析

HanLP / spaCy 可提供：

```text
token / POS / dependency / NER / SRL / SDP / constituency
```

其职责：

- 为 LLM 候选提供支持或冲突证据；
- 帮助验证谓词—论元连接、主句/修饰层和局部结构；
- 暴露 LLM 与传统语言学分析的分歧。

不得：

- 因一个 POS 标签直接否决完整来源结构；
- 因 SRL ARG0 直接产生 P；
- 因 dependency 邻近直接产生业务对象；
- 用大量构式规则重新复制一个平行语义解析器。

BGE-M3 / multilingual-E5 仅用于语义归一化、相似性和检索证据。

NLI/XNLI 仅验证已经形成的候选命题；不能创造缺失事实。

---

## 18. 双通道语义审阅：Parser Pass + Coverage Audit

v0.4 推荐对同一原文进行两个职责分离的 LLM 调用：

### Pass A — Semantic Parser

输出完整 Candidate Semantic Graph 候选。

### Pass B — Coverage Auditor

输入原文和 Pass A 候选图，检查：

- 明确语义是否漏掉；
- 是否存在没有来源的关系；
- 条件/模态是否绑定错；
- 主句事件是否被误降级；
- 修饰/引用/输出内容是否被误升格；
- 是否有真实歧义被错误唯一化。

Pass B 只能输出 audit findings / additional candidates / contradictions，不能直接改写最终 7+1。

两个 Pass 可以由同一模型执行，但必须使用独立 prompt 与上下文；同模型一致不等于真值，只是 Evidence Tier 的一部分。

---

## 19. Γ：唯一最终认证点

Γ 的职责保持：

```text
CERTIFIED / REJECTED / TYPED_UNRESOLVED
```

但 v0.4 明确：

> Γ 不再负责“重新理解自然语言”。它只认证已经由候选解析层表达出来的语义。

至少检查：

- Source grounding；
- Node/Relation Type 与方向；
- Discourse Domain；
- Participant Eligibility；
- Artifact Role；
- Reference/Basis；
- Modality / Polarity；
- Scope / Condition Ownership；
- Quantity Target；
- Coreference；
- Cardinality / Competition；
- NLP/NLI 辅助证据一致性；
- Parser/Auditor 冲突；
- Graph Consistency；
- Proof provenance。

边界改变型事实若只有单一、无佐证、存在明确冲突的模型解释，不得仅凭 LLM 自信分数认证。

若 Parser 与 Auditor、NLP/NLI 或源结构存在无法确定消解的竞争解释，输出 typed unresolved。

**LLM 不能直接调用 Γ 的认证结果来反向改写原文语义；Γ 也不能通过隐藏字符串模板重新成为第二套自然语言解析器。**



# 第五部分：ADMIN Root Task 输入合同

## 20. Parser 的权威输入只有 ADMIN Task

BoundX 7+1 Parser 当前阶段解析的是 **ADMIN 发布给 PM 的任务合同**，目标是把 ADMIN 明确授予、限制、要求和保留未决的任务边界转成可计算对象。

权威链固定为：

```text
ADMIN Task
→ Candidate Semantic Graph
→ Deterministic Certification
→ Boundary IR
→ Root Canonical 7+1
```

这里的 `Root Canonical 7+1` 表示 **ADMIN Authority Boundary**。

Parser 当前阶段不负责：

- 替 PM 制定执行方案；
- 替 PM 决定由 DEV / OPS / QA 如何分工；
- 从执行层任务反推 ADMIN 的原始授权；
- 自动生成 WP；
- 自动拆分 ADMIN 没有声明的 WP；
- 以 PM 计划、DEV/OPS/QA 执行描述替代 ADMIN 源任务。

### 20.1 “给 PM 的任务”不等于“必须每句都写 PM”

ADMIN Task 可以显式写：

```text
由 PM 负责组织实施。
QA 必须进行独立复核。
最终由 PM 向 ADMIN 汇报。
```

这些都是 ADMIN 自己定义的参与、验收或交付约束，应进入 Root Boundary。

但以下文本默认属于执行层计划，而不是当前 ADMIN Root Parser 的基准输入：

```text
DEV 读取 A。
OPS 修改 B。
QA 执行 C。
```

除非这些角色和动作本身就是 ADMIN 明确写入的授权边界，否则不能用 PM 后续计划代替 ADMIN Task。

---

## 21. ADMIN Root Task 的允许内容

一个合格 ADMIN Root Task 可以明确：

- 任务目标；
- 输入/检查/处理范围；
- 最终交付物；
- 被授权或要求的动作类别；
- 必须保留的参与约束；
- 资源/时间/次数/容量边界；
- 版本、规范、commit、政策、规则等依据；
- 完成、停止、中止、升级条件；
- 禁止动作、禁止对象、排除范围；
- 必须由 QA 复核、必须由 PM 汇报等组织级约束；
- 显式声明的 WP 标题和 WP 边界。

ADMIN 未指定的执行细节保持开放，不能由 Parser 补造。

例如：

```text
检查系统环境、FCoP 落地情况、MCP 工具与 Skills 分配使用及轨道机运行状态。
由 PM 组织完成，QA 对检查结果进行复核，最终由 PM 向 ADMIN 提交 overall-review.md。
不得修改任何被检查配置，不得重启相关服务。
```

这是有效的 ADMIN Root Task。

---

## 22. ADMIN Task 的结构状态

Parser 在语义认证前必须先给出任务结构状态：

```text
SINGLE_ROOT
EXPLICIT_MULTI_WP
MULTI_WP_STRUCTURE_REQUIRED
STRUCTURE_UNRESOLVED
```

### 22.1 SINGLE_ROOT

一个 ADMIN 根任务边界，没有显式多 WP 结构。

直接编译：

```text
ADMIN Task
→ Candidate Semantic Graph
→ Γ
→ Boundary IR
→ Root Canonical 7+1
```

### 22.2 EXPLICIT_MULTI_WP

ADMIN 已经在源任务中显式声明：

```markdown
## WP-01 ...
## WP-02 ...
```

Parser 可以读取这些 **ADMIN 已声明的结构边界**。

Parser 不创建 WP，也不移动 WP 边界。

### 22.3 MULTI_WP_STRUCTURE_REQUIRED

如果 ADMIN Task 已明显包含多个彼此独立的工作包，但没有显式 WP 标题，Parser 不替 ADMIN 猜，也不自动拆。

返回：

```text
StructureStatus = MULTI_WP_STRUCTURE_REQUIRED
BoundaryCertification = BLOCKED
```

并要求 ADMIN 以显式 WP 标题重写任务书。

### 22.4 STRUCTURE_UNRESOLVED

若现有证据不足以判断是否必须拆成多个 WP，保持结构未决，不强行分段。

---

# 第六部分：显式 WP 合同

## 23. WP 只能来自 ADMIN 源文本

WP 是 ADMIN 授权边界的一部分时，必须有显式来源。

推荐格式：

```markdown
## WP-01 <标题>
...

## WP-02 <标题>
...
```

允许实现支持等价的严格结构标记，但不得仅根据：

- 段落；
- 人名；
- 多个动作；
- 多个输出；
- embedding 聚类；
- 句子相似度

自动创造 WP。

**规范性结论：不存在 `WP = Cluster(Block...)` 规则。**

---

## 24. 显式 Multi-WP 的 Root Boundary

显式 WP Task 仍然是一个 ADMIN Task Contract。

Root Authority 直接来自 ADMIN 全文，而不是通过“Local WP 7+1 的并集”创造出来。

可以保留：

```text
RootCanonical7Plus1
DeclaredWpScopes[]
DeclaredWpRelations[]
```

其中：

- `RootCanonical7Plus1`：ADMIN 根授权边界；
- `DeclaredWpScopes`：ADMIN 已明确声明的 WP 范围；
- `DeclaredWpRelations`：ADMIN 源文本明确表达并成功认证的 WP 间关系。

实现可以为每个显式 WP 生成局部计算视图，但它只是 Root Contract 的从属视图：

```text
LocalView(WP-x) ⊆ ADMIN source authority
```

不得反过来用局部视图扩张 Root Authority。

---

## 25. Parser 不负责 PM 的执行计划

PM 后续可以把 Root Boundary 细化为执行计划，例如：

```text
ADMIN Root Action: CHECK(system environment)

PM Plan:
- query operating system
- inspect disk
- collect service status
```

后续 BoundX 可以验证这些 PM 动作是否是 Root Action 的合法 refinement。

但这属于 **Root Boundary → Plan Validation**，不是当前 7+1 Parser 的输入解析阶段。

因此当前方法不包含：

- PM Plan 自动生成；
- PM Plan 自动 WP decomposition；
- 从 PM Plan 聚合 Root 7+1；
- 从 DEV/OPS/QA 执行报告反推 ADMIN Authority。

---

# 第七部分：ADMIN Root 语义编译方法

## 26. 方法公式固定

ADMIN Root Task 的正式计算骨架更新为：

```text
T_admin
 --(Typed + P_llm + E_nlp + P_cov)-->
 Gc
 --Γ-->
 (Gb, Gu)
 --Q-->
 Root Canonical 7+1
```

其中：

- `P_llm` 是主语义解析器；
- `Typed` 与 `E_nlp` 是辅助确定性/语言学证据；
- `P_cov` 是覆盖审阅候选生成；
- `Γ` 是唯一最终认证点；
- `Q` 仍是固定的八个 7+1 Graph Views / Queries。

Canonical 7+1 仍然只从已认证边界语义投影，禁止 LLM 直接填写最终槽位。

---

## 27. Candidate Semantic Graph 的来源合同

Gc 必须同时保存：

- LLM Parser 候选；
- Coverage Auditor 补充/反驳候选；
- typed literal evidence；
- NLP/SRL/SDP/CON 辅助证据；
- NLI/embedding（如启用）；
- 精确 source grounding；
- competing interpretation groups；
- unresolved evidence。

每条候选必须标记来源类型，例如：

```text
LLM_PRIMARY
LLM_COVERAGE_AUDIT
TYPED_LITERAL
NLP_SRL
NLP_SDP
NLP_DEP
NLP_CONSTITUENCY
NLI_VALIDATION
EMBEDDING_NORMALIZATION
DETERMINISTIC_SOURCE_RULE
```

不得把“模型直接生成”和“程序推导”混成一个不可审计结果。

---

## 28. 确定性认证职责固定

Γ 只认证已有候选，不创造新的自然语言事实。

对相同 Gc、相同 source bytes、相同 evidence policy，Γ 必须稳定输出相同结果。

任何会改变授权边界的事实若存在未消解竞争解释，必须进入 Gu，而不是按 LLM 置信度强选。

---

## 29. 7+1 仍不是模型第一层输出

正式顺序：

```text
Natural Language
→ LLM/NLP/Typed Candidate Semantic Graph
→ Γ Certified / Unresolved Semantics
→ Eligibility
→ Boundary IR
→ Canonical 7+1
```

禁止：

```text
Natural Language
→ LLM直接输出最终 I/O/A/P/R/V/C/B
→ 当作权威边界
```

LLM 可以生成供调试的人类可读摘要，但摘要不具有机器权威性。


# 第八部分：Root 7+1 与 PM 后续边界验证

## 30. Root 7+1 是授权上界，不是执行方案

Root Canonical 7+1 表示：

> ADMIN 明确授予、要求、限制和保留未决的任务边界。

它回答：

- 可以做什么；
- 必须做什么；
- 不能做什么；
- 作用于什么；
- 依据什么；
- 在什么条件下完成/停止；
- 哪些角色关系被 ADMIN 明确定义。

它不要求 ADMIN 预先写出 PM 的全部实现细节。

---

## 31. 开放细节应标记为可细化，而不是未解决事实

ADMIN 没有说明实现细节时，不应自动判为语义歧义。

例如：

```text
检查系统环境
```

并不要求 ADMIN 枚举 CPU / 内存 / 磁盘 / 服务。

这表示：

```text
CHECK(system environment)
detail_space = OPEN_FOR_REFINEMENT
```

后续 PM 可以提出更具体的合法 refinement，但不能改变 Root Authority 的动作类别和禁止边界。

---

## 32. 后续 Plan Validation 的目标

未来 PM Plan 验证至少需要判断：

```text
Coverage
Legal Refinement
Violation
Unresolved Refinement
```

例如：

```text
Root: CHECK(config)

PM: READ(config)          → candidate legal refinement
PM: INSPECT(config)       → candidate legal refinement
PM: MODIFY(config)        → not authorized by CHECK alone
PM: DELETE(config)        → violation unless ADMIN separately authorized
```

这属于 BoundX 的后续边界认证阶段，不改变 ADMIN Root Parser 的职责。

---

# 第九部分：Benchmark 与 Gold 合同

## 33. Root Parser Benchmark 只使用 ADMIN Root Task

正式 Root Parser Benchmark 必须满足：

1. 发令权威是 ADMIN；
2. 任务接收责任主体是 PM 或未显式命名但语义上仍是 Root Task；
3. 文本描述授权目标、范围、交付、限制、依据、完成条件；
4. 可以规定 QA 复核等组织约束；
5. 不以 DEV/OPS/QA 已分配好的执行计划作为主要正文；
6. 不把 PM Plan、执行报告、角色任务单冒充 ADMIN Root Task；
7. 显式 Multi-WP 必须带 WP 标题；
8. 明显 Multi-WP 但无标题的样本用于结构诊断，不用于单 Root 7+1 正确率。

---

## 34. Benchmark 分类

每个测试输入必须先分类：

```text
ROOT_ADMIN_VALID
EXPLICIT_MULTI_WP
MULTI_WP_STRUCTURE_REQUIRED
EXECUTION_LEVEL
INVALID_OR_AMBIGUOUS_INPUT
```

只有 `ROOT_ADMIN_VALID` 进入 Single Root 7+1 准确率。

`EXECUTION_LEVEL` 可以保留为执行语义回归集，但不能统计进 ADMIN Root Parser 的主指标。

---

## 35. Root 任务的成功标准

一个 ROOT_ADMIN_VALID 用例只有在以下条件全部满足时才是完整闭合：

- I/O/A/P/R/V/C/B 与原文一致；
- 无 wrong binding；
- 无 unsupported RESOLVED；
- clear source fact 不得 unresolved；
- 源文本问责完整；
- Proof lineage 完整；
- 未声明执行细节不被补造；
- PM/DEV/OPS/QA 的角色只在 ADMIN 明确规定时进入边界；
- OPEN_FOR_REFINEMENT 不被误当作授权扩张。

---

# 第十部分：工程阶段重新冻结

## 36. Stage A — ADMIN Root Single Task

先稳定：

```text
ADMIN Root Task
→ Root Canonical 7+1
```

不做 WP 自动发现，不做 PM Plan。

这是当前唯一主线。

---

## 37. Stage B — Explicit ADMIN Multi-WP

只有 ADMIN 已显式提供 WP 标题时才进入。

验证：

- WP 标题结构读取；
- 每个 WP 的源范围；
- Root Boundary 不被局部 WP 扩张；
- 源文本明确的 WP 间条件/依赖。

不做自动 WP clustering。

---

## 38. Stage C — PM Plan Boundary Validation

在 Root 7+1 稳定以后，另行研究：

```text
Root 7+1 × PM Plan
→ COVERED / LEGAL_REFINEMENT / UNRESOLVED / VIOLATION
```

这不是 Parser 的任务分解功能。

---

## 39. Stage D — Formal Boundary Solver

最后再研究：

- constraint propagation；
- fixed-point；
- SMT / MILP（必要时）；
- UNSAT；
- multiple solution；
- formal proof。

---

# 第十一部分：本版修正的退役路线

## 40. 以下路线从 v0.3.1 Root Parser 方法中退出

以下内容不再作为 ADMIN Root Parser 的规范方法：

```text
Paragraph / Block clustering → automatic WP
WP_k = Cluster(B_i...B_j)
Global Root 7+1 = Normalize(union(Local WP 7+1))
用 PM/DEV/OPS/QA 执行任务替代 ADMIN Root Task benchmark
```

旧 v0.3 文档中相关段落属于历史探索，不再具有当前规范性。

---

# 第十二部分：工程约束

## 41. 完整语义闭环优先于局部机制 PASS

局部测试通过不能代替：

- full Root Canonical 7+1 closure；
- false-defined；
- wrong-binding；
- unresolved correctness；
- source/proof completeness。

---

## 42. 每轮实现必须先有可证伪假设

开始实现前必须定义：

```text
Hypothesis
Primary Semantic Gate
Minimum Expected Delta
Falsification Condition
Stop / Architecture Review Rule
```

---

## 43. 连续两轮无实质改善必须停线

如果同一实现路线连续两轮主指标无实质改善：

```text
STOP CURRENT REPAIR LINE
→ Architecture Review
```

不得继续逐句补丁。

---

## 44. LLM / NLP / Γ 的职责冻结

v0.4 的职责固定为：

```text
LLM Semantic Parser
→ 理解开放自然语言并提出完整候选语义结构

Typed Recognizer
→ 精确字面量身份与规范化值

NLP / SRL / SDP / CON / NLI / Embedding
→ 辅助证据、交叉检查、归一化与反驳

Coverage Auditor
→ 查漏、查冲突、提出竞争解释

Γ
→ certify / reject / typed unresolved

Eligibility / Boundary IR / Q
→ 确定性边界资格、序列化与 7+1 投影
```

LLM 不直接写权威 7+1；NLP 不再被要求单独完成开放任务语义解析；Γ 不重新解析自然语言。



# 45. 兼容性冻结语义，不冻结错误实现

历史 evidence 可以封存，但 active implementation 兼容性优先验证：

- semantic behavior；
- typed IR；
- public contract；
- deterministic projection；
- proof lineage。

不能因为历史内部实现结构而阻止正式架构修正。

---

# 第十三部分：v0.3.1 的固定结论

1. Parser 的当前权威输入是 **ADMIN Task**。
2. 输出是 **ADMIN Root Authority Boundary 的 Canonical 7+1**。
3. PM Plan 不属于当前 Parser 输入。
4. Parser 不替 ADMIN 猜 WP、不替 ADMIN 拆 WP。
5. 显式 Multi-WP 只能读取 ADMIN 已声明的 WP。
6. 明显 Multi-WP 但无 WP 标题时，要求 ADMIN 修改任务书。
7. 7+1 不是第一层 NLP 输出，而是 Certified Semantic Graph 的确定性视图。
8. Candidate Graph 负责覆盖开放自然语言候选，Γ 负责认证。
9. 未指定执行细节保持 OPEN_FOR_REFINEMENT，不由 Parser 补造。
10. 后续 PM Plan 只能在 Root Boundary 内细化，不能扩大授权。
