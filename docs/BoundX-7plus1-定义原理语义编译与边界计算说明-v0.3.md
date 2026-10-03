# BoundX 7+1：定义、原理、语义编译与边界计算说明

**从开放自然语言到可计算任务边界的规范化方法 · v0.3**

> 文档性质：规范性定义 + 实现原则 + 计算约束。  
> 本版目标：冻结“开放自然语言 → 结构化语义 → 可认证边界语义 → Canonical 7+1”的可实现方法。  
> 当前工程阶段只验收 **Natural Language → Canonical 7+1**；后续边界公式与执行空间计算属于第二阶段。  
> 代码实现可以继续演进，但不得破坏本文的规范性语义。

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

v0.3 的规范实现采用以下编译拓扑：

```text
Raw Task Text
    ↓
Document Structure / Clauses
    ↓
Discourse Domain
    ↓
NLP Signals + Typed Literals
    ↓
Span Lattice
    ↓
Candidate Semantic Graph
    ├─ Semantic Nodes
    ├─ Candidate Relations / Relation Bundles
    └─ Candidate Expressions
    ↓
Artifact / Reference / Table / Output-Content Structured Recovery
    ↓
Scope / Condition / Quantity / Coreference Expressions
    ↓
Typed Graph Constraints + Evidence Resolution
    ↓
Eligibility Decisions
    ↓
Boundary-qualified Semantic Graph
    ↓
Boundary IR
    ↓
Deterministic 7+1 Graph Views / Queries
    ↓
Canonical 7+1
    ↓
Proof DAG + Coverage Accountability
```

其中自然语言入口是开放的，候选产生可以使用 NLP、typed recognizer、embedding、NLI 与有限语法规则；但进入 `Eligibility` 之后必须逐步收敛为有限类型、有限关系和可证明约束。

当前阶段的数学骨架写为：

```text
T --P--> Gc --Γ--> (Gb, Gu) --Q--> Canonical 7+1
```

其中：

- `T`：开放自然语言任务；
- `P`：Semantic Parsing，负责提出候选节点、候选关系、候选表达式；
- `Gc`：Candidate Semantic Graph；
- `Γ`：确定性的类型、作用域、证据、关系、基数与一致性约束；
- `Gb`：Boundary-qualified / Certified Semantic Graph，即有资格进入边界的语义子图；
- `Gu`：Typed Unresolved Graph，保存仍存在合法竞争解释或证据不足的部分；
- `Q`：八个固定、确定的 7+1 Graph Views / Queries。

这里的“确定性”不要求 `P` 对所有语言唯一理解；它要求：**对同一个候选图和同一组证据，Γ 与 Q 必须给出相同结果；无法唯一证明时必须稳定输出 typed unresolved。**

`Boundary IR` 是 `Gb` 的规范化、可序列化权威表示。实现可以使用普通对象、Map/Set、邻接表或专用图结构；本方法不要求图数据库，也不要求 GNN。

---

## 14. Structure Tree / Clause

第一层只恢复原文结构，不做槽位判断：

```text
ROOT
PARAGRAPH
CLAUSE
LIST
LIST_ITEM
TABLE / ROW / CELL
HEADING
```

Clause 是语义编译的基本局部单位，但不是最终事实边界。

硬要求：

- SourceSpan 必须精确对应原文码点；
- 不允许丢字符；
- 不允许无证据重写原文；
- 技术标识、路径、文件名、版本号应尽量作为 protected span 保留。

### 14.1 Discourse Domain：结构之后先确定“这段话在任务里做什么”

结构节点本身不足以决定边界资格。v0.3 增加一层有限的 Discourse Domain：

```text
CURRENT_TASK
BACKGROUND
RATIONALE
DECISION
DELIVERABLE_SPEC
OUTPUT_CONTENT
ACCEPTANCE
OUT_OF_SCOPE
EXAMPLE
CODE
QUOTE
TABLE
METADATA
```

核心规则：

- `CURRENT_TASK` 是当前任务边界的主要候选域；
- `OUTPUT_CONTENT` 表示“当前任务要求写进交付物中的语义”，不是当前执行行为；
- `ACCEPTANCE` 优先参与 Completion 组合；
- `OUT_OF_SCOPE` 可以形成当前任务 B；
- `CODE / QUOTE / BACKGROUND / EXAMPLE` 默认只提供证据或上下文，不直接升格当前边界；
- `TABLE` 只表示结构域，必须通过行列语义恢复后才能形成边界关系；
- `METADATA` 可提供显式任务分派、reference/basis 等结构化证据，但字段名本身不产生槽位。

Discourse Domain 的作用不是“丢掉文本”，而是给每个候选节点与关系增加明确的语义作用域。

### 14.2 Structured Table Proposition

表格必须按结构命题恢复：

```text
Header + Row Subject + Cell Role + Cell Value
→ Row Proposition Bundle
→ Typed Relation
```

禁止：

```text
TABLE_CELL
→ 因为看见 ADR-0003
→ 直接 V
```

允许：

```text
表头 = 协议参照
行主体 = public surface
单元格 = ADR-0003

→ BASIS / CONFORMS_TO(public surface, ADR-0003)
```

要求：

- 表头参与解释 cell role；
- 行主体必须唯一或显式 unresolved；
- 同一行可形成多个 typed relations；
- 未知表头、行列数不一致或主体不唯一时保留 `STRUCTURED_TABLE_UNRESOLVED`；
- TABLE 域本身保持关闭，不能为恢复某个 Gold 而全域开放。

---

## 15. Span Lattice：延迟切分决议

自然语言实体边界不能在 NLP 分词时一次切死。

例如：

```text
“CR-2026-1184 中的异常路由剔除标准”
```

可以同时保留：

```text
CR-2026-1184                REFERENCE
异常路由剔除标准            ENTITY/REFERENCE candidate
CR-2026-1184 中的……标准      composite candidate
```

下游关系与类型约束再决定哪种 span 组合最合理。

因此 Span Lattice 的本质是：

> 上游保留多个合理切分候选，下游通过关系、作用域、类型和证据逐步收敛。

这避免“切分一错、全链路垃圾进垃圾出”。

---

## 16. Semantic Nodes

基础节点类型建议固定为有限集合：

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

节点不是槽位。

例：

```text
routes.csv              → ENTITY
复核                    → EVENT
配置复核通过            → STATE
3                       → VALUE
SPEC-42                 → REFERENCE
若存在重复路由          → CONDITION/STATE
随后/最后               → DISCOURSE
```

重要：

- `包括` 不默认是 EVENT；
- `完成` 可能是完成算子，也可能是业务动作，需要上下文；
- `批准` 可以是 APPROVAL_OF，而不是普通 A；
- `最多` 是数量操作符，不是 RESOURCE 本身。

### 16.1 Artifact Role Resolution

同一个文件/对象不能因为“出现了”就直接投影 I 或 O。先确定其任务角色：

```text
EXISTING_INPUT
READ_ONLY_INPUT
MODIFICATION_TARGET
GENERATED_OUTPUT
UPDATED_OUTPUT
REPORT_OUTPUT
TEST_OUTPUT
CONDITIONAL_OUTPUT
REFERENCE_ONLY
OUTPUT_CONTENT_REFERENCE
BACKGROUND_REFERENCE
UNRESOLVED_ARTIFACT_ROLE
```

典型规则：

```text
读取 / 检查 / 对比 X
→ X = READ_ONLY_INPUT

新建 / 生成 / 编写 X
→ X = GENERATED_OUTPUT

修改 X
→ before(X) = MODIFICATION_TARGET / EXISTING_INPUT
→ after(X)  = UPDATED_OUTPUT
→ 二者保持 same_artifact identity

依据 / 符合 X
→ X 优先进入 REFERENCE_ONLY / Basis 关系
→ 不因它是文件路径就自动 I
```

I/O 的确定应来自对象在关系图中的角色，而不是来自名词、扩展名或文件出现频次。

### 16.2 OUTPUT_CONTENT 是一等语义作用域

对于：

```text
“编写 prompt，并在 prompt 中要求 agent 每一步报告并停。”
```

必须区分：

```text
CURRENT_TASK:
  ACTION(write)
  RESULT(prompt)

OUTPUT_CONTENT(prompt):
  REQUIRED(report_each_step)
  REQUIRED(stop_each_step)
```

未来 agent 的动作、参与者、条件、禁止项可以在 OUTPUT_CONTENT 子图中保持完整结构，但不得自动投影为当前任务 A/P/B。

内容要求必须带：

```text
scope = OUTPUT_CONTENT
owner_output_ids
ownership_status
source_span_ids
```

当 owner 唯一时可 `UNIQUE_OUTPUT`；明确双语 sibling 可形成 `OUTPUT_SET`；无法唯一确定时必须 `UNRESOLVED_OUTPUT_SET`。

---

## 17. 有限 Relation Space 与 Relation Bundle

自然语言是开放的，但关系词汇应有限。

核心关系建议包括：

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

Reference/Basis 可以在有限关系族下保留更细的语义 subtype：

```text
BASED_ON
COMPLIES_WITH
VALIDATES_AGAINST
REFERENCES
PREDECESSOR
SUPERSEDES
RELATED_REFERENCE
CURRENT_BASELINE
PROVENANCE
```

实现可以把这些 subtype 编码为独立边或 `BASIS` 关系上的 typed attribute，但必须保留原始语义区别，不能把所有 identifier 扁平化为“V 字符串”。

`PART_OF` 是通用结构关系，用于表达文件—符号、交付物—章节、复合对象—成员等语义组成；它不能被替换成领域专用关系词表。若现有 Structure Tree 已能唯一证明组成关系，也可以由结构 provenance 等价实现，但最终必须可追溯。

一个 Clause 可以同时产生多个关系，因此不应强制“每句只能选一个标签”。

例如：

```text
“报告生成后需由审计组盖章生效”
```

可能同时包含：

```text
SEQUENCE(generate_report, approval)
APPROVAL_OF(audit_group, report)
COMPLETION_OF(approved_state, task/report)
AGENT(approval, audit_group)
```

有限的是关系积木种类，不是积木组合数量。

---

## 18. Relation Candidate、Evidence Tier 与约束解码

不能靠无限 `if/else` 穷举句子。

推荐方法：

```text
Candidate Generation
→ Type Filtering
→ Evidence Scoring
→ Constraint Decoding
→ Resolved / Unresolved
```

证据可以分级：

```text
HARD          结构/字面量/明确语法直接支持
STRONG        多源证据一致
AMBIGUOUS     多个竞争解释胶着
CONTRADICTED  与其他强证据冲突
```

连续模型分数只用于排序/诊断，不应直接作为边界真值。

### 18.1 Graph Constraint Resolution

v0.3 将关系解码明确为“候选图上的确定性约束求解”，而不是句子模板穷举。

候选关系被接受前至少可以受到以下约束：

```text
Node Type Constraint
Relation Signature Constraint
Discourse Domain Constraint
Participant Eligibility Constraint
Artifact Role Constraint
Reference/Basis Attachment Constraint
Scope Ownership Constraint
Condition Ownership Constraint
Quantity Target Constraint
Cardinality Constraint
Coreference Compatibility Constraint
Evidence/Provenance Constraint
Graph Consistency Constraint
```

例如：

```text
AGENT(x, y)
```

不能仅因 SRL 把 `y` 标成 ARG0 就成立；`y` 还必须满足 participant eligibility，并且关系必须处于正确任务作用域。

又如一个 referent 有两个同样合法的 antecedent：

```text
CompatibleAntecedents(x) = {a, b}
|CompatibleAntecedents(x)| = 2
```

确定结果应是：

```text
UNRESOLVED_COREFERENCE
```

而不是选择分数略高的一条边。

概念目标：

```text
R* = argmax Σ score(r)
```

但必须受以下约束：

- 节点类型签名；
- 关系方向；
- 互斥关系；
- 条件/作用域一致性；
- 模态一致性；
- provenance 完整性。

不需要一开始就上 SMT/ILP；但实现必须保留未来可替换为更强全局解码器的合同边界。

---

## 19. NLP 与模型的职责边界

v0.3 明确采用 **Evidence Fusion，而不是 Ensemble Voting**。

不同组件提供不同证据：

```text
HanLP / spaCy
→ syntax / NER / SRL evidence

Typed recognizers
→ FILE / PATH / URI / API / SYMBOL / VERSION / COMMIT / NUMBER / DATE ...

BGE-M3
→ semantic normalization / retrieval / candidate ranking

multilingual-E5
→ secondary semantic cross-check

mDeBERTa NLI/XNLI
→ verification of already-constructed relation hypotheses
```

多个模型“投票多的一方”不能直接决定边界。模型输出必须进入候选图，再接受类型、作用域、关系、证据和一致性约束。


NLP/模型负责**提供证据**，不直接写边界。

建议角色：

```text
HanLP / spaCy
→ token、POS、dependency、NER、SRL、否定、模态、并列、条件等

Typed Recognizer
→ FILE/PATH/URI/VERSION/COMMIT/TICKET/ADR/POLICY/REFERENCE/NUMBER/DATE/TIME 等

BGE-M3
→ 已有语义事实后的候选归一化/检索

multilingual-E5-large
→ 二级语义匹配/cross-check

mDeBERTa-MNLI-XNLI
→ 验证已经构造出的候选关系/命题是否被原文支持
```

---

# 第五部分：短任务直编译与长任务分层、矩阵化语义编译

## 20. 两条解析路径，一个 Canonical 7+1

7+1 Parser 对短任务和长任务采用不同的中间计算路径，但最终输出统一为同一种 Canonical 7+1。

### 20.1 短任务：直接编译

类似 REF-001 会议记录这类单流程任务，直接走：

```text
自然语言任务
→ Document / Paragraph / Clause Structure
→ Candidate Semantic Graph
→ Γ Deterministic Constraints
→ Boundary-qualified Semantic Graph
→ Canonical 7+1
→ canonical-7plus1.json / canonical-7plus1.md
```

短任务可以按句子、段落、列表、表格做内部结构解析，但**不要求拆分 WP0–WPn**。

### 20.2 长任务：先分层，再求解，再汇总

多阶段、多子任务、多依赖的长任务走：

```text
Long Task Document
→ Continuous Blocks B1...Bn
→ Local Semantic Candidates
→ WP0...WPn Hierarchy
→ Block × 7+1 Semantic Matrix
→ Cross-Block / Cross-WP Relations
→ Constraint Resolution
→ Global Consistent Semantic State
→ One Canonical 7+1
```

长任务内部可以存在多个 Work Package，但**最终权威结果仍然是一个总 Canonical 7+1**。

---

## 21. Canonical 7+1 是八个语义集合，不是八个单值

7+1 的每个槽位都应理解为带类型和证明链的语义项集合：

```text
Canonical7Plus1 = {
  I: Set<SemanticItem>,
  O: Set<SemanticItem>,
  A: Set<SemanticItem>,
  P: Set<SemanticItem>,
  R: Set<SemanticItem>,
  V: Set<SemanticItem>,
  C: Set<SemanticItem>,
  B: Set<SemanticItem>
}
```

因此长任务最终仍然可以表示为：

```text
I = {I1, I2, I3, ...}
O = {O1, O2, O3, ...}
A = {A1, A2, A3, ...}
P = {P1, P2, ...}
R = {R1, R2, ...}
V = {V1, V2, ...}
C = {C1, C2, ...}
B = {B1, B2, ...}
```

但长任务中的 SemanticItem 必须保留它来自哪个阶段、被谁产生、被谁消费、受什么条件控制。

建议内部至少携带：

```text
semantic_item_id
slot
semantic_identity
value
wp_id
parent_wp_id
source_block_ids
source_span_ids
scope
stage_role
depends_on
produced_by
consumed_by
condition
modality
boundary_fact_ids
proof_lineage
state
```

推荐阶段角色：

```text
EXTERNAL_INPUT
INTERMEDIATE_INPUT
INTERMEDIATE_OUTPUT
FINAL_OUTPUT
GLOBAL_CONSTRAINT
LOCAL_CONSTRAINT
GLOBAL_COMPLETION
LOCAL_COMPLETION
```

显示层可以简化，但机器权威结构不能退化为无来源的字符串并集。

---

## 22. 短任务的适用边界

短任务不按字符数机械判断，而按语义结构判断。

典型特征：

- 一个主要目标；
- 一个主流程；
- 一个任务边界；
- 没有多个明显独立阶段；
- 没有复杂的中间 O→I 传递；
- 没有多个相互依赖的子任务；
- 条件、验收、参与者和禁止项都服务于同一个任务。

REF-001 是当前典型正向锚点。

短任务的正式目标是：

```text
Natural Language
→ Complete Canonical 7+1
→ JSON + Markdown
```

即：文本不仅要“机制测试通过”，还必须能真正生成完整的 7+1 文档。

---

## 23. 长任务的复杂度变量

长任务的难度不应只用字符数衡量。

更重要的是：

```text
WP 数量
+ WP 层级深度
+ 跨 WP 依赖数量
+ 中间产物数量
+ 跨段指代数量
+ 条件传播数量
+ OUTPUT_CONTENT / ACCEPTANCE / BACKGROUND 的作用域切换数量
```

一篇 5000 字但只有一个流程的文本，可能比一篇 1500 字、包含 4 个相互依赖阶段的文本更简单。

因此“长文本解析”本质上不是简单提高最大上下文长度，而是恢复：

> **阶段、所属、依赖、条件和中间语义流。**

---

## 24. WP0–WPn：长任务的阶段结构

### 24.1 WP0 是 Root Work Package

WP0 不是“第一步”。

WP0 表示：

> **根任务合同 / Root Work Package**

它保存：

- 总目标；
- 全局输入；
- 最终交付；
- 全局参与者；
- 全局版本/依据；
- 全局资源限制；
- 全局禁止项；
- 全局完成条件；
- 子 WP 的组织关系。

### 24.2 WP1–WPn 是局部阶段或子任务

每个 WP 可以有一个内部 Local 7+1 视图：

```text
WP_k.local_7plus1 = {
  I_k, O_k, A_k, P_k, R_k, V_k, C_k, B_k
}
```

Local 7+1 是**内部计算视图**，不是要求最终生成多个彼此独立的 7+1 产品文档。

最终仍投影为一个 Global Canonical 7+1。

---

## 25. WP Tree 与 Dependency DAG 必须分开

### 25.1 WP Tree：回答“属于谁”

```text
WP0
├── WP1
├── WP2
├── WP3
└── WP4
```

Tree 表达：

- parent / child；
- 语义 owner；
- 局部作用域；
- 全局约束继承；
- 子任务包含关系。

### 25.2 Dependency DAG：回答“谁依赖谁”

真实任务可能串行、并行或汇合，因此执行关系不能只靠 Tree。

例如：

```text
          ┌→ WP2 ─┐
WP1 ──────┤       ├→ WP4
          └→ WP3 ─┘
```

因此：

> **组织结构用 Tree，执行/依赖结构用 DAG。**

---

## 26. Block：长任务的基本计算单位

长任务首先恢复连续文本块：

```text
Document = B1 + B2 + ... + Bn
```

Block 可以是：

- Heading；
- Paragraph；
- Clause group；
- List / List Item；
- Table / Row；
- Code block；
- Quote；
- Acceptance 子段；
- Out-of-scope 子段。

### 26.1 Block 不等于 WP

一个 WP 可以包含多个 Block。

一个 Block 默认应有一个主要语义 owner；若无法唯一确定，则保持 typed unresolved。

推荐过程：

```text
Block
→ local semantic candidates
→ owner candidates
→ WP assignment
```

禁止简单假设：

```text
Paragraph == WP
```

---

## 27. 连续解析状态

长文档虽然分块，但不能把每个 Block 完全孤立解析，因为自然语言存在：

- “上述文件”；
- “这些结果”；
- “完成后”；
- “然后提交给 ADMIN”；
- “前述检查”；
- “若上一阶段通过”。

因此长任务可采用连续状态：

```text
State_i = {
  active_wp,
  known_entities,
  previous_outputs,
  active_conditions,
  active_global_constraints,
  unresolved_references
}
```

局部解析写为：

```text
X_i = Parse(B_i | State_i)
State_i → State_(i+1)
```

这更接近编译器：

```text
source block
→ local IR
→ symbol/scope state update
→ next block
→ final linking
```

---

# 第六部分：Block × 7+1 语义矩阵

## 28. 基础语义矩阵 M

对于 n 个 Block，建立：

```text
M ∈ SemanticSet^(n×8)
```

固定 8 列：

```text
[I, O, A, P, R, V, C, B]
```

定义：

```text
M[i,j] = Block_i 在 slot_j 上产生的局部语义项集合
```

例如：

| Block | I | O | A | P | R | V | C | B |
|---|---|---|---|---|---|---|---|---|
| B1 | 当前代码 | 问题清单 | 检查 | DEV | — | — | 检查完成 | — |
| B2 | 问题清单 | 修改后代码 | 修改 | DEV | — | — | 修复完成 | — |
| B3 | 修改后代码 | 测试结果 | 测试 | QA | — | — | 测试通过 | — |
| B4 | 前述结果 | 最终报告 | 汇总 | DEV | — | — | 报告完成 | 不得提前发布 |

矩阵单元格不是简单的 0/1，而是：

```text
Set<SemanticItem>
```

每个 SemanticItem 继续保留 source span、owner、scope、condition、modality 与 proof。

---

## 29. 从矩阵形成 WP

WP 可以由连续 Block 的语义内聚形成：

- 相同或兼容 owner；
- 相同主目标；
- 同一局部 completion；
- 连续动作链；
- 明确 section；
- 局部 O→I 内聚；
- 局部约束一致。

概念上：

```text
WP_k = Cluster(B_i ... B_j)
```

但 embedding/model score 只能提出候选，不能直接决定 WP。

最终 WP assignment 必须通过结构、来源、作用域与关系约束认证。

---

# 第七部分：跨 Block / 跨 WP 关系矩阵

## 30. Dependency Matrix D

对于 m 个 WP，建立：

```text
D ∈ RelationSet^(m×m)
```

```text
D[i,j]
```

表示 WP_i 与 WP_j 之间的关系集合。

WP-level 关系至少可以表达：

```text
PRODUCES_FOR
CONSUMES_OUTPUT
REQUIRES_COMPLETION
USES_AS_BASIS
VERIFIES
SEQUENCE
PARALLEL
BLOCKS
SUPERSEDES
```

这些 WP-level orchestration relations 不要求污染 7+1 的基础 Relation Space；实现可以用独立的 orchestration graph 保存。

---

## 31. 典型跨 WP 语义流

### 31.1 上一阶段输出成为下一阶段输入

```text
WP1.O1 = X
WP2.I1 = X
```

语义关系：

```text
PRODUCES_FOR(WP1.O1, WP2.I1)
```

可以写成守恒式：

```text
identity(WP1.O1) - identity(WP2.I1) = 0
```

这里的等式表示**语义身份守恒**，不是简单字符串相等。

### 31.2 上一阶段完成允许下一阶段开始

```text
WP1.C → ENABLE(WP2)
```

或者：

```text
REQUIRES_COMPLETION(WP2, WP1.C)
```

### 31.3 上一阶段结果成为后续依据

```text
WP1.O → WP3.V
```

即：

```text
USES_AS_BASIS(WP3, WP1.O)
```

### 31.4 多前驱汇合

```text
WP1.O + WP2.O + WP3.O → WP4.I
```

必须保留每个输入的独立 provenance，不能退化为拼接字符串。

---

# 第八部分：矩阵、图与约束方程

## 32. 长任务不是普通线性方程组

矩阵用于表达结构，但长任务的真实求解还需要：

> **矩阵 + 图 + 离散/逻辑约束**

因此不应把整个问题简化成普通实数线性系统 `Ax=b`。

长任务语义状态可以定义为：

```text
SemanticState = (M, D, Γ)
```

其中：

- `M`：Block × 7+1 Semantic Matrix；
- `D`：Cross-Block / Cross-WP Dependency Graph / Matrix；
- `Γ`：确定性约束集合。

最终目标是求：

```text
X* = Solve(M, D, Γ)
```

使得：

```text
Γ(X*) = true
```

且所有被 RESOLVED 的语义项具有完整 source evidence 与 proof lineage。

---

## 33. Γ：长任务约束集合

至少包括：

```text
Node Type Constraint
Relation Signature Constraint
WP Ownership Constraint
Discourse Domain Constraint
Scope Constraint
Coreference Constraint
Artifact Role Constraint
Condition Ownership Constraint
Quantity Constraint
Cardinality Constraint
Temporal / Sequence Constraint
Negative / Forbidden Constraint
Evidence / Provenance Constraint
Graph Consistency Constraint
```

---

## 34. 可数学化的典型约束

### 34.1 唯一 owner

设：

```text
x(i,k) ∈ {0,1}
```

表示语义项 i 是否属于 WP_k。

若 owner 唯一：

```text
Σ_k x(i,k) = 1
```

如果多个 WP 同样成立且无法消歧：

```text
→ UNRESOLVED_OWNER
```

不能强选一个。

### 34.2 O→I 语义守恒

```text
identity(WP1.Oa) = identity(WP2.Ib)
```

可以写成：

```text
WP1.Oa - WP2.Ib = 0
```

但实际实现必须比较 semantic identity、scope 和 provenance，而不是 display string。

### 34.3 条件启用

```text
WP1.C = true ⇒ enabled(WP2)
```

### 34.4 禁止

```text
B_k ⇒ ¬A_m
```

条件禁止：

```text
Condition_q ∧ B_k ⇒ ¬A_m
```

### 34.5 全局完成

```text
WP0.C = WP1.C ∧ WP2.C ∧ ... ∧ WPn.C
```

是否所有局部 C 都必须进入 WP0.C，由根任务 source contract 决定；不能机械 AND 全部局部条件。

### 34.6 分配式 EACH

```text
∀x ∈ S, ACTION(x)
```

若每成员数量为 1：

```text
∀x ∈ S, count(ACTION(x)) = 1
```

---

## 35. 求解器不是预先固定的一种算法

长任务扩展可以分阶段采用：

```text
Graph Algorithms
→ Constraint Propagation
→ Fixed-point Resolution
→ MILP（必要时）
→ SMT（必要时）
```

模型/NLP负责提出候选；矩阵与图负责组织；Γ/Solver 负责确定性认证。

```text
Model / NLP
→ Candidate Proposals

Matrix / Graph Builder
→ Structured Semantic State

Γ / Solver
→ Globally Consistent Certified State

Q
→ Canonical 7+1
```

求解器不能凭空发明 owner、referent、action、output 或 condition。

---

# 第九部分：长任务最终如何汇总成一个 7+1

## 36. Global Projection

对 WP0...WPn 的内部 Local 7+1，可定义：

```text
Global.I = Normalize( ⋃ I_k )
Global.O = Normalize( ⋃ O_k )
Global.A = Normalize( ⋃ A_k )
Global.P = Normalize( ⋃ P_k )
Global.R = Normalize( ⋃ R_k )
Global.V = Normalize( ⋃ V_k )
Global.C = Normalize( ⋃ C_k )
Global.B = Normalize( ⋃ B_k )
```

这里的 `Normalize` 绝不是字符串去重。

必须保留：

- semantic identity；
- wp_id；
- stage_role；
- source；
- dependency；
- condition；
- scope；
- proof lineage。

### 36.1 中间产物同时具有 O 与 I 角色

例如：

```text
WP1.O = 问题清单
WP2.I = 问题清单
```

总 Canonical 7+1 可以保留：

```text
O: 问题清单
   [wp=WP1, stage_role=INTERMEDIATE_OUTPUT]

I: 问题清单
   [wp=WP2, stage_role=INTERMEDIATE_INPUT, derived_from=WP1.O]
```

二者共享 semantic identity，但边界角色不同。

### 36.2 最终产物

```text
O: 最终报告
   [wp=WP4, stage_role=FINAL_OUTPUT]
```

因此：

> **多 WP 任务不是一个更大的“扁平 7+1”，而是先形成多阶段结构，再投影成一个保留阶段关系的总 7+1。**

---

# 第十部分：Gold 与 Benchmark 的分层

## 37. 现有 expected-7plus1.json 不推翻

现有 Gold 继续有效。

### 37.1 对短任务

```text
expected-7plus1.json
```

就是完整语义 Gold。

### 37.2 对长 multi-WP 任务

现有：

```text
expected-7plus1.json
```

定义：

> **最终 Global Canonical 7+1 Gold**

它仍然用于验证最终答案，但不再单独承担“完整中间推理 Gold”的职责。

---

## 38. 长任务新增中间 Gold

未来长任务 Benchmark 建议增加：

```text
expected-blocks.json
expected-wp-tree.json
expected-local-7plus1.json
expected-dependencies.json
expected-semantic-matrix.json
expected-global-7plus1.json
```

其中：

```text
expected-global-7plus1.json
```

必须与已有 `expected-7plus1.json` 在规范语义上等价。

这样可以分别验证：

1. 文本是否正确分块；
2. Block owner 是否正确；
3. WP Tree 是否正确；
4. 每个 WP 的 Local 7+1 是否正确；
5. O→I / C→Enable / Basis 等跨 WP 关系是否正确；
6. 矩阵是否完整；
7. 约束求解是否全局一致；
8. 最终 Global 7+1 是否正确。

---

# 第十一部分：工程阶段与测试顺序

## 39. Stage 015：短任务直接生成完整 7+1

范围：

```text
REF-001 级别
single task
single flow
no WP decomposition
```

目标：

```text
Natural Language
→ Complete Canonical 7+1
→ JSON + Markdown
```

先证明短任务路径可稳定工作。

---

## 40. Stage 016：中等任务 / 2–3 WP

首次引入：

- Block segmentation；
- WP0–WPn；
- WP Tree；
- Local 7+1；
- O→I；
- C→Enable；
- 小型 Dependency DAG。

此阶段重点不是“更长文本”，而是验证**多阶段结构**。

---

## 41. Stage 017：长 multi-WP

引入：

- Block × 7+1 Matrix；
- Dependency Matrix；
- 全局 Constraint Set；
- Matrix / Graph Resolution；
- 多 WP 汇合；
- 现有长 STANDARD。

---

## 42. Stage 018：全局数学求解与认证

研究：

- fixed-point resolution；
- graph constraint solver；
- MILP / SMT 的适用边界；
- unique / multiple solution；
- UNSAT；
- unresolved proof；
- Global 7+1 projection consistency。

---

# 第十二部分：长任务方法的核心不变量

## 43. 最终只有一个 Canonical 7+1

WP 是内部层级，不改变 7+1 Parser 的最终产品定义。

## 44. 每个槽位都是集合

I/O/A/P/R/V/C/B 均为 SemanticItem 集合，不是单值。

## 45. 阶段关系不能在汇总时丢失

必须保存在 SemanticItem 元数据、WP Tree、Dependency DAG 与 Proof 中。

## 46. 不确定性不能被求解器“猜成确定”

约束不足时必须保持 typed unresolved。

## 47. 模型负责提候选，数学/确定性约束负责认证

模型分数可以排序，不直接成为边界真值。

## 48. 先短后长，逐层增加结构复杂度

短任务先直接编译；中等任务验证 WP；长任务再进入矩阵与全局求解。

这避免在基础单流程解析尚未稳定时，用超长 multi-WP 文档反复驱动局部规则修补。

---

# 第十三部分：与 v0.3 基础公式的关系

## 49. 短任务

v0.3 已有公式保持：

```text
T --P--> Gc --Γ--> (Gb, Gu) --Q--> Canonical 7+1
```

## 50. 长任务

扩展为：

```text
T
→ B = {B1...Bn}
→ M(Block × 7+1)
→ W(WP Tree)
→ D(Dependency DAG)
→ Γ_long
→ X*
→ Q_global
→ Canonical 7+1
```

可写成：

```text
X* = Solve(M, W, D, Γ_long)
```

其中：

- `M` 提供局部语义；
- `W` 提供 owner / hierarchy；
- `D` 提供阶段依赖；
- `Γ_long` 提供类型、作用域、条件、集合、时序、禁止、证据和一致性约束；
- `Q_global` 把全局一致语义投影为最终一个 Canonical 7+1。

该扩展不改变 7+1 的基础定义，而是增加长任务的结构化计算方法。
