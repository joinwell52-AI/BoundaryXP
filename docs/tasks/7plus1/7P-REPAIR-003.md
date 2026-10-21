# 7P-REPAIR-003 — Semantic Graph Closure

**Status:** READY_FOR_CODEX  
**Repository:** `joinwell52-AI/BoundaryXP`  
**Branch:** `review/7plus1-parser`  
**Semantic baseline:** `7ccdcc349aba616e8952fab7755d8ab23c73819e`  
**Required method ancestor:** `f266f67df770ad5cd65947f29c7dbdc7a7f29bc2`

## 0. 启动规则

本任务从 `review/7plus1-parser` 的**实际最新 HEAD**开始执行。启动时必须确认：

1. 当前 HEAD 是 `f266f67df770ad5cd65947f29c7dbdc7a7f29bc2` 的后代；
2. 当前 HEAD 包含：
   - `docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`
   - 本任务书；
3. 本任务的语义指标基线来自 `7ccdcc349aba616e8952fab7755d8ab23c73819e`；
4. 控制文档提交不视为 Parser 语义修改。

不得从 `main` 开始，不得 merge main。

## 1. 规范性方法

必须先完整阅读：

`docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md`

该文档是本任务的规范性方法依据。

核心方法：

```text
T --P--> Gc --Γ--> (Gb, Gu) --Q--> Canonical 7+1
```

当前阶段唯一目标仍然是：

```text
Natural Language
→ Correct Canonical 7+1
```

本任务不是实现完整 BoundaryXP Solver，不做 Admission、Boundary Formula、Host Enforcement。

## 2. 当前正式标准与基线

正式人工 Gold：

- SWAI-001
- SWAI-002
- SWAI-003
- SWAI-004
- SWAI-006
- SWAI-007
- SWAI-008
- SWAI-009
- SWAI-010

分母 = 9。

SWAI-005：
`NEEDS_ADJUDICATION_SOURCE_CONFLICT`，继续排除。

权威索引：

`fixtures/7plus1/standard/ACTIVE-ADJUDICATION.json`

REF-001 必须继续：

```text
GOLD_7PLUS1_CONFIRMED=true
STANDARD_PARSED_SAMPLE=true
```

当前真实基线：

```text
STANDARD_PARSED = 0/9

I: MATCH 1, MISSING 48, FALSE_DEFINED 3, WRONG_BINDING 2, WRONG_STATUS 9
O: MATCH 4, MISSING 45, FALSE_DEFINED 1, WRONG_BINDING 2, WRONG_STATUS 9
A: MATCH 5, MISSING 51, FALSE_DEFINED 2, WRONG_BINDING 3, WRONG_STATUS 9
P: MATCH 9, MISSING 3, FALSE_DEFINED 0, WRONG_BINDING 0, WRONG_STATUS 9
R: MATCH 1, MISSING 0, FALSE_DEFINED 0, WRONG_BINDING 0, WRONG_STATUS 9
V: MATCH 12, MISSING 19, FALSE_DEFINED 0, WRONG_BINDING 0, WRONG_STATUS 9
C: MATCH 19, MISSING 4, FALSE_DEFINED 0, WRONG_BINDING 0, WRONG_STATUS 9
B: MATCH 11, MISSING 31, FALSE_DEFINED 0, WRONG_BINDING 6, WRONG_STATUS 9

OUTPUT_CONTENT: MATCH 2, MISSING 18
```

7P-REPAIR-002 全量回归：

```text
3271 pass / 0 fail / 17 skip
```

## 3. 本轮目标

当前 first divergence 已经从 P/R 污染转向：

1. 复合技术对象 / Artifact Identity 不完整；
2. I/O 对象组成关系不完整；
3. Action predicate-object-context 绑定不完整；
4. B 的完整禁止/保持不变语义绑定不完整；
5. OUTPUT_CONTENT 内部关系仍大量缺失；
6. Coverage 仍过宽，导致大量 slot WRONG_STATUS。

本轮必须围绕：

```text
Candidate Semantic Graph
→ Relation Completeness
→ Typed Constraint Resolution
→ Boundary-qualified Graph
→ Deterministic 7+1 Graph Views
```

推进。

禁止回到：

```text
word / regex → slot
```

## 4. Repair A — Technical Object / Artifact Identity Graph

当前 artifact 识别仍偏向 `filename.ext`，必须覆盖真实软件/AI任务中的：

- source file
- directory
- code symbol
- function / method
- CLI command
- API
- module
- test group
- report section
- named task artifact
- abstract deliverable
- compound artifact set

例如：

```text
src/fcop/project.py
├─ write_task
├─ write_report
└─ write_issue
```

必须形成通用组成关系：

```text
PART_OF(child, parent)
```

或等价、可证明的结构 provenance。

要求：

1. inline-code technical symbol 可成为 typed semantic entity；
2. 文件—symbol、目录—文件、输出文档—section 共用通用组成机制；
3. before/after 保持同一 artifact identity；
4. 同一对象承担 I/O 两个角色时不能生成两个无关实体；
5. parent 无法唯一确定时必须 `UNRESOLVED_RELATION` 或 `UNRESOLVED_SCOPE`；
6. 禁止增加领域/样本专属关系。

## 5. Repair B — Compound I/O Semantics

必须支持复合对象：

### 5.1 file + method set

```text
src/fcop/project.py
scope:
  write_task
  write_report
  write_issue
```

### 5.2 collection

例如：

```text
tasks_dir + log/tasks
```

形成：

```text
UNION(
  ITEM(tasks_dir),
  ITEM(log/tasks)
)
```

### 5.3 input collection

“检查 A、B、C、最近 git log”应形成多个 I；`git log` 不是文件也不能自动漏掉。

### 5.4 abstract deliverable

没有扩展名也可以是 O，例如：

- union-scan 修复
- Q1～Q4 回答
- Evidence
- 下一步建议
- 两种场景表
- §1～§6

### 5.5 conditional / updated output

继续保持：

`MODIFICATION_TARGET / UPDATED_OUTPUT / GENERATED_OUTPUT / CONDITIONAL_OUTPUT`。

## 6. Repair C — Action Relation Completeness

当前 `A WRONG_BINDING = 3`，必须修复 relation completeness，不能通过删 Action 降错误。

每个 RESOLVED ACTION 尽可能形成：

```text
ACTION
+ predicate
+ object
+ scope
+ condition
+ participant/context（如 Source 明确）
```

至少支持：

1. coordinated action + UNION object；
2. compare A vs B；
3. list continuation；
4. nested-list object；
5. technical symbol context；
6. 优先复用已有 Artifact / Reference identity，不新造局部字符串节点。

## 7. Repair D — Restriction / B 完整语义

当前：

```text
B MATCH = 11
B MISSING = 31
B WRONG_BINDING = 6
```

必须恢复：

```text
negative predicate
+ complete target
+ condition
+ scope
```

“保持不变”不得新增 Action modality。

Action Modality 仍仅：

```text
REQUIRED
PERMITTED
NOT_REQUIRED
FORBIDDEN
```

“保持不变”应规范化为：

```text
RESTRICT(change(target))
```

或等价的 `NO_CHANGE(target)` restriction。

## 8. Repair E — OUTPUT_CONTENT Internal Semantic Graph

当前 OUTPUT_CONTENT = 2/20。

7P-REPAIR-002 已建立 owner，本轮继续构造内部语义图：

```text
OUTPUT_CONTENT
→ semantic nodes
→ relations
→ conditions
→ prohibitions
→ participants
→ quantities
→ references
```

未来 agent 的 A/P/B/C 必须保持在 `OUTPUT_CONTENT` 域，并带：

```text
owner_output_ids
scope=OUTPUT_CONTENT
```

不得投影为 CURRENT_TASK A/P/B。

## 9. Repair F — Slot-local Coverage Closure

检查并修复 `coverage-locality.mjs` 及相关路径。

一个 unresolved / coverage failure 只影响它可能改变的槽位。

例：

```text
Acceptance 未解析 → C
Reference 未解析 → V
OUTPUT_CONTENT 未解析 → O.content requirements
Participant identity 未决 → P
Artifact role 未决 → I/O，必要时沿关系传播到 A/B
```

禁止：

```text
一条 clause 未完全理解
→ I/O/A/P/R/V/C/B 全部 COVERAGE_FAILURE
```

除非确有证据表明该片段可能影响全部槽。

ABSENT 仍必须有 Coverage Accountability，不能靠缩小 affected_slots 制造 ABSENT。

## 10. Repair G — Deterministic Graph View Contract

在当前 Boundary IR 基础上正式明确：

```text
QI QO QA QP QR QV QC QB
```

八个查询只能读取：

- Boundary IR
- Semantic Nodes
- Expressions
- Coverage
- Typed Unresolved

不得读取：

- raw text
- regex
- embedding
- NLI
- Gold

语义：

```text
QI = TASK_OBJECT
QO = DELIVERABLE
QA = ACTION with REQUIRED/PERMITTED
QP = PARTICIPANT with legal roles
QR = RESOURCE
QV = BASELINE
QC = COMPLETION/STOP
QB = FORBID/RESTRICT
```

同一个 Boundary IR 重复运行必须稳定。

不要求图数据库；`Map / Set / adjacency index` 即可。

## 11. 禁止扩大词表

禁止加入具体样本词、项目词、技术对象名单来刷分，包括但不限于：

`write_task / write_report / write_issue / next_sequence / _lifecycle / REPORT-003 / fcop / ADR-0003 / TASK-006 / SWAI-xxx`

若新增 lexical grammar，必须属于通用封闭语言类别，并至少有 5 个非 Gold mutation。

## 12. Generalization Tests

至少覆盖：

### Composite technical object
- file + 3 random methods
- module + 4 functions
- output doc + sections
- directory + child files

### I/O
- read-only command output
- modify existing artifact
- new abstract deliverable without extension
- updated artifact
- conditional deliverable
- collection input

### Action
- action + two-object UNION
- compare A vs B
- nested list object
- continuation line
- technical symbol context

### B
- forbid changing semantics
- preserve atomic behavior
- preserve retry limit
- forbid modifying file class
- conditional prohibition

### OUTPUT_CONTENT
- future action
- future participant
- future prohibition
- future conditional stop
- two sibling outputs sharing requirement

### Coverage
- unsupported acceptance affects only C
- unsupported reference affects only V
- unsupported output-content does not poison current A/P/B
- participant ambiguity affects P
- artifact ambiguity affects I/O

## 13. 正式回归

必须重跑：

- REF-001
- 9 个正式 SWAI
- 7P-REPAIR-001 tests
- 7P-REPAIR-002 tests
- 原 Parser regression
- full regression

Gold 不得作为 Parser 输入。

## 14. 硬验收条件

必须：

```text
REF001=PASS

P_FALSE_DEFINED=0
P_WRONG_BINDING=0

R_FALSE_DEFINED=0
R_MISSING=0

V_MATCH >= 12
C_MATCH >= 19

SWAI003_ADR0003=MATCH
TABLE_CELL_DIRECT_PROMOTION=false
```

并满足：

- I_MATCH > 1，或 I_MISSING 显著下降；
- O_MATCH > 4，或 O_MISSING 显著下降；
- A_WRONG_BINDING <= 2；
- B_WRONG_BINDING < 6，或 B_MATCH > 11；
- OUTPUT_CONTENT_MATCH > 2；
- Slot-local coverage 必须有独立测试证明；
- STANDARD_PARSED 不强制 >0/9；
- 不得通过降低 Gold 标准制造完整样本 PASS。

## 15. 实现边界

允许：

- Candidate Semantic Graph helper
- typed node/relation utility
- generic PART_OF
- artifact identity / composite set
- graph adjacency/index helper
- slot-local coverage propagation
- deterministic query layer

不允许：

- Graph DB
- GNN
- 新模型训练
- 更换模型
- Gold-aware runtime
- sentence-specific parser
- BXP Formal Solver
- Admission
- Host Enforcement

## 16. 版本

建立新 revision：

`research/7plus1-parser/v0.3-7p-repair-003/`

或合理冻结后缀。

不得覆盖：

`v0.3-7p-repair-002-r03/`

历史必须可重放。

## 17. 报告

生成：

`docs/reports/7plus1/7P-REPAIR-003/`

至少包含：

- REPORT.md
- BEFORE-AFTER.json
- COMPARISON.json
- SLOT-SUMMARY.json
- FAILURES.json
- FIRST-DIVERGENCE.json
- GRAPH-CONTRACT.json
- GRAPH-QUERY-RESULTS.json
- COVERAGE-LOCALITY.json
- TESTS.json
- RUNS.json
- PERFORMANCE.json
- CHANGED-FILES.txt
- IMPLEMENTATION-FROZEN.json
- VERIFY.json
- MANIFEST.json
- SEAL.md
- SEAL-VERIFICATION.json
- SHA256SUMS.txt

REPORT 必须单列：

- SEMANTIC_GRAPH_CLOSURE
- COMPOSITE_OBJECT_IDENTITY
- IO_ROLE_COMPOSITION
- ACTION_ARGUMENT_COMPLETENESS
- RESTRICTION_BINDING
- OUTPUT_CONTENT_GRAPH
- SLOT_LOCAL_COVERAGE
- DETERMINISTIC_GRAPH_VIEWS
- KNOWN_REMAINING_FAILURES

## 18. 禁止事项

禁止修改：

- Gold
- Source
- BXP Protocol
- Pack
- 模型
- threshold

禁止：

- SWAI ID hardcode
- REAL-GOLD ID hardcode
- 原句 hardcode
- 新增样本词 blacklist
- 为单个 Gold 加 regex
- 取消 TABLE gate
- unresolved 强制 RESOLVED
- coverage failure 静默改 ABSENT
- merge main
- release
- tag

## 19. Push

完成后 push：

`review/7plus1-parser`

不得 merge main。

完成后停止等待 ADMIN Review。

## 20. 完成回复格式

```text
TASK=7P-REPAIR-003

START_HEAD=<实际启动 HEAD>
SEMANTIC_BASE=7ccdcc349aba616e8952fab7755d8ab23c73819e
HEAD=<最终 sha>

REF001=<PASS/FAIL>

STANDARD_PARSED_BEFORE=0/9
STANDARD_PARSED_AFTER=<x>/9

I_MATCH=1 -> <n>
I_MISSING=48 -> <n>

O_MATCH=4 -> <n>
O_MISSING=45 -> <n>

A_MATCH=5 -> <n>
A_MISSING=51 -> <n>
A_WRONG_BINDING=3 -> <n>

P_FALSE_DEFINED=0 -> <n>
P_WRONG_BINDING=0 -> <n>

R_FALSE_DEFINED=0 -> <n>
R_MISSING=0 -> <n>

V_MATCH=12 -> <n>
V_MISSING=19 -> <n>

C_MATCH=19 -> <n>
C_MISSING=4 -> <n>

B_MATCH=11 -> <n>
B_MISSING=31 -> <n>
B_WRONG_BINDING=6 -> <n>

OUTPUT_CONTENT_MATCH=2 -> <n>
OUTPUT_CONTENT_MISSING=18 -> <n>

SLOT_LOCAL_COVERAGE=<PASS/FAIL>
DETERMINISTIC_GRAPH_VIEWS=<PASS/FAIL>

SWAI003_ADR0003=<MATCH/FAIL>
TABLE_CELL_DIRECT_PROMOTION=false

PARSER_MODIFIED=true
GOLD_MODIFIED=false
SOURCE_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false

PRODUCTION_READY=false
STATUS=WAITING_ADMIN_REVIEW
```
