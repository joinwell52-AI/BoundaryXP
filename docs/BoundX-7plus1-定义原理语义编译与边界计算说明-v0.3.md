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