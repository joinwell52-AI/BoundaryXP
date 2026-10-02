ADMIN TASK
Task ID: 7P-REPAIR-002

目标：
在 7P-REPAIR-001 已完成的 discourse / participant / quantity 机制基础上，
继续修复 BoundX 7+1 Parser 的第二层通用语义机制：

1. Input / Output Role Resolution
2. Version / Basis / Reference Resolution
3. Completion Condition Resolution
4. Structured Table Proposition Resolution
5. OUTPUT_CONTENT Ownership / Content Requirement Resolution

本轮继续做“机制级修复”，不是逐句修补。

Repository:
joinwell52-AI/BoundX

Branch:
review/7plus1-parser

BASE_COMMIT:
13bd28fb25b02ee9358f20f2e1f2baa58df802f4


==================================================
一、当前权威基线
==================================================

当前正式人工 Gold：

SWAI-001
SWAI-002
SWAI-003
SWAI-004
SWAI-006
SWAI-007
SWAI-008
SWAI-009
SWAI-010

分母 = 9

SWAI-005：
NEEDS_ADJUDICATION_SOURCE_CONFLICT
继续排除，不进入评分。

Gold 权威索引：

fixtures/7plus1/standard/ACTIVE-ADJUDICATION.json

REF-001 Meeting Minutes：

必须继续：

GOLD_7PLUS1_CONFIRMED=true
STANDARD_PARSED_SAMPLE=true

不得退化。


==================================================
二、7P-REPAIR-001 后的真实基线
==================================================

STANDARD_PARSED = 0/9

当前主要结果：

I:
MATCH 0
MISSING 49
FALSE_DEFINED 3
WRONG_BINDING 2

O:
MATCH 4
MISSING 45
FALSE_DEFINED 1
WRONG_BINDING 2

A:
MATCH 5
MISSING 51
FALSE_DEFINED 2
WRONG_BINDING 2

P:
MATCH 9
MISSING 3
FALSE_DEFINED 0
WRONG_BINDING 0

R:
MATCH 1
MISSING 0
FALSE_DEFINED 0
WRONG_BINDING 0

V:
MATCH 0
MISSING 31
FALSE_DEFINED 0
WRONG_BINDING 0

C:
MATCH 0
MISSING 23
FALSE_DEFINED 0
WRONG_BINDING 0

B:
MATCH 11
MISSING 31
FALSE_DEFINED 0
WRONG_BINDING 6

OUTPUT_CONTENT_REQUIREMENTS:
MATCH 0
MISSING 20

REF-001 = PASS

全量回归：
2713 pass / 0 fail / 17 skip


==================================================
三、本轮总原则
==================================================

本轮核心不是继续过滤错误候选。

上一轮已经解决大量 P/R 污染。

现在要解决：

“正确语义存在于 Source，但没有被完整编译出来。”

重点从：

false positive suppression

转为：

structured semantic recovery

必须继续遵守：

Natural Language
→ Structure / Clause
→ NLP Signals + Typed Literals
→ Semantic Nodes
→ Relations
→ Scope / Condition / Quantity
→ Eligibility
→ Boundary IR
→ Canonical 7+1

禁止在 deterministic projection 中补 NLP 逻辑。


==================================================
四、Repair A：Input / Output Role Resolution
==================================================

当前问题：

大量文件、模块、API、schema、task、report 等已被识别，
但无法稳定区分：

- 已存在、被读取/检查/修改的对象 → I
- 当前任务要求新建/生成/提交的对象 → O
- 仅作为依据的文件 → V
- 只在背景中出现的对象 → 不进入当前 I/O
- OUTPUT_CONTENT 中提到的对象 → 不能直接变当前 I/O

建立 Artifact Role Resolution。

至少支持以下状态：

EXISTING_INPUT
MODIFICATION_TARGET
READ_ONLY_INPUT
REFERENCE_ONLY
GENERATED_OUTPUT
UPDATED_OUTPUT
REPORT_OUTPUT
TEST_OUTPUT
CONDITIONAL_OUTPUT
OUTPUT_CONTENT_REFERENCE
BACKGROUND_REFERENCE
UNRESOLVED_ARTIFACT_ROLE

要求：

1. “修改 X”
   X 可以同时是：
   I = existing modification target
   O = updated X
   但必须通过关系说明是同一 artifact 的 before/after role，
   不能无解释重复。

2. “新建 X / 生成 X / 写一份 X”
   X → O
   不应仅进入 I。

3. “检查 X / 读取 X / 对比 X / 审计 X”
   X → I
   除非文本另外要求修改/生成 X。

4. “写 REPORT-xxx”
   REPORT → O。

5. 测试文件：
   如果 Source 明确要求新增/修改测试文件：
   可为 I + O（existing modification target / updated artifact）
   或纯 O（明确新建）。
   必须依据 Source。

6. `ref_*` / “依据 X”：
   默认 V，
   不因为是文件路径就自动进入 I。

7. 背景中提到某文件，
   但当前任务不读取/修改/依赖它：
   不自动进入 I。


==================================================
五、Repair B：Version / Basis / Reference Resolution
==================================================

这是本轮重点。

当前 V：
MATCH 0 / MISSING 31

必须建立独立 Reference/Basis layer。

typed recognizer 至少继续支持：

ADR
TASK
REPORT
ISSUE
SPEC
POLICY
VERSION
COMMIT
HASH
FILE_REFERENCE
URI_REFERENCE

但“识别 literal”不等于自动进入 V。

进入 V 需要语义关系：

BASED_ON
COMPLIES_WITH
ACCORDING_TO
REFERENCES
SUPERSEDES
PREDECESSOR
VALIDATES_AGAINST
VERSION_BASIS
PROVENANCE
CURRENT_BASELINE

要求支持：

1. YAML/frontmatter：

ref_adr:
ref_charter:
ref_predecessor:
references:
related:
supersedes:

这些必须进入结构化 reference candidate。

但需要保留各自关系类型，不能都扁平化为字符串。

例如：

ref_adr → BASIS
ref_predecessor → PREDECESSOR
supersedes → SUPERSEDES
related → RELATED_REFERENCE

2. 正文明确：

“按 ADR-0003”
“符合 ADR-0003”
“per ADR-0019”
“依据 commit d2ed13c”
“见 ISSUE-...”
“与 failure.schema.json 对齐”

必须形成完整关系。

3. 版本：

“fcop 1.1.0”
“rules 2.2.0”
“protocol 2.0.0”

只有当它们是当前检查/实现/基线依据时才进入 V。

纯背景版本号不能自动进入 V。


==================================================
六、Repair C：Structured Table Proposition
==================================================

这是必须修复的 7P-REPAIR-001 回退点。

禁止恢复旧逻辑：

TABLE_CELL → 直接升格语义

正确逻辑必须是：

TABLE
→ Header
→ Row
→ Cells
→ Row Proposition
→ Semantic Relation

例如：

| 项目 | 现状 | 协议参照 |
| public surface | ... | ADR-0003 |

不能只抽出：

ADR-0003

必须得到类似：

subject = public surface
relation = BASIS / COMPLIES_WITH
object = ADR-0003

要求：

1. 单元格不得脱离 header/row 直接升格。
2. 表头必须参与解释当前 cell role。
3. 同一行构成 proposition bundle。
4. 表格里的：
   - 依据
   - 状态
   - 动作
   - 副作用
   - 验收标准
   可根据 header 生成 typed relation。
5. 不认识表头语义时：
   保留 STRUCTURED_TABLE_UNRESOLVED，
   不得猜。
6. 不能通过放开整个 TABLE discourse domain 来恢复 V。

目标验证：

SWAI-003 中 Source 明确支持的 ADR-0003
应重新 MATCH。


==================================================
七、Repair D：Completion Condition Resolution
==================================================

当前 C：

MATCH 0
MISSING 23

需要把以下结构恢复为 Completion，而不是普通 A/R：

“验收标准”
“Acceptance Criteria”
“只有 X 才算完成”
“全部通过”
“A1～A10”
“以下条件均满足”
“X AND Y”
“X 或 Y”
“如果 X，则完成”
“P0 = 0”
“测试全绿”
“push 成功”

建立 Completion Expression。

至少支持：

ATOMIC_COMPLETION
AND
OR
CONDITIONAL_COMPLETION
ALL_OF
ANY_OF
COUNTED_CRITERIA_REFERENCE

例如：

“三份新测试绿
AND
587 passed 不退
AND
ruff clean
AND
两件文件不受影响”

必须生成组合 C。

不能只生成：

C = “完成”

也不能把验收条数：

“10 条 acceptance”

错误放进 R。

重要：

“10 条 Acceptance Criteria 全满足”

可形成：

C = ALL_OF(AC1...AC10)

而：

10

本身不成为 R。


==================================================
八、Repair E：OUTPUT_CONTENT Ownership
==================================================

7P-REPAIR-001 已正确把未来 prompt 行为
从 CURRENT_TASK A/P/B 中隔离。

现在下一步是：

真正把这些内容绑定到 O。

当前：

OUTPUT_CONTENT_REQUIREMENTS
MATCH 0 / MISSING 20

必须建立：

OUTPUT
  └─ OUTPUT_CONTENT_REQUIREMENT

例如：

当前 TASK：
“编写 agent-bringup-prompt”

O：
agent-bringup-prompt.zh.md
agent-bringup-prompt.en.md

然后：

“prompt 中必须要求 agent 每步报告并停”

应得到：

OUTPUT_CONTENT_REQUIREMENT
owner =
agent-bringup-prompt.zh.md
agent-bringup-prompt.en.md

content =
agent 每步报告并停

而不是：

CURRENT_TASK A = 报告并停

要求支持：

1. 一个内容要求可绑定一个或多个明确 output。
2. 如果只有一个 output，允许 UNIQUE_OUTPUT。
3. 两个双语 sibling output 明确共享内容要求时：
   支持 OUTPUT_SET ownership。
4. ownership 无法唯一确定：
   UNRESOLVED_OUTPUT_SET。
5. OUTPUT_CONTENT 内容自身仍可具有：
   action
   participant
   condition
   prohibition
   version
   quantity
   但必须带：
   scope=OUTPUT_CONTENT
   owner_output_ids

6. OUTPUT_CONTENT 内的 B：
   不得投影成当前 task B，
   除非 Source 同时明确它也是当前任务禁止项。


==================================================
九、Repair F：Action / B 关系完整性，只修必要部分
==================================================

本轮不是全面修 A/B，
但为了 I/O/V/C/OUTPUT_CONTENT 建关系，允许修：

- predicate + complete object
- negation + complete target
- conditional ownership
- output/content owner
- reference/basis relation

当前剩余：

A WRONG_BINDING = 2
B WRONG_BINDING = 6

如果这些能被上述通用机制自然修掉，应修。

禁止逐句添加 regex。


==================================================
十、禁止扩大技术词 blacklist
==================================================

7P-REPAIR-001 中 participant eligibility
已有技术词 defensive blacklist。

本轮禁止通过继续加入：

某个 API 名
某个类名
某个 enum
某个工具名
某个测试名
某个样本词

来提高指标。

技术实体判断应尽量依赖：

typed literal
inline code span
syntactic role
semantic relation
discourse scope
artifact type

若必须增加 lexical rule，
必须证明是通用语法类别，
并提供至少 5 个非 Gold mutation。


==================================================
十一、明确不做
==================================================

本轮不要求：

- 9/9 全通过
- 全面解决 coreference
- 全面解决 supersedes temporal reasoning
- 复杂 permission / NOT_REQUIRED 全部修完
- Parser 架构迁移
- UI 重做
- BXP formal model
- Admission
- Boundary Result
- Host enforcement

不得扩任务范围。


==================================================
十二、测试要求
==================================================

必须至少包括：

A. Table tests

至少覆盖：

- 2 列 table
- 3 列 table
- header = 依据
- header = 状态
- header = 副作用
- header = 验收
- unknown header → unresolved
- 不允许孤立 cell 升格

B. I/O tests

至少覆盖：

- 修改 existing file
- 新建 file
- 只读 file
- reference-only file
- conditional output
- report output
- test output
- background artifact

C. V tests

至少覆盖：

- ref_adr
- ref_predecessor
- references array
- supersedes
- 正文 “符合 ADR”
- “per ADR”
- commit basis
- version baseline
- background version negative case

D. C tests

至少覆盖：

- AND completion
- OR completion
- only-if completion
- ALL acceptance criteria
- success state
- threshold completion
- acceptance count not R

E. OUTPUT_CONTENT

至少覆盖：

- one output owner
- bilingual two-output owner set
- ambiguous output owner
- future action
- future prohibition
- future participant
- future condition
- current task prohibition remains current B

F. Regression

必须重新跑：

- REF-001
- 9 个正式 SWAI
- 7P-REPAIR-001 mechanism tests
- 原 Parser regression
- full regression


==================================================
十三、真实评测
==================================================

必须使用当前人工 Gold，
重新运行 9 个正式样本。

不得读取 Gold 作为 Parser 输入。

报告必须提供 before → after：

I:
MATCH
MISSING
FALSE_DEFINED
WRONG_BINDING
WRONG_STATUS

O:
同上

V:
同上

C:
同上

OUTPUT_CONTENT:
MATCH
MISSING
WRONG_BINDING

同时继续监控：

P FALSE_DEFINED
P WRONG_BINDING

R FALSE_DEFINED
R MISSING

A FALSE_DEFINED
A WRONG_BINDING

B FALSE_DEFINED
B WRONG_BINDING

P/R 不允许明显退化。


==================================================
十四、重点验收条件
==================================================

A. REF-001 必须保持 PASS。

B. SWAI-003 ADR-0003：
必须由结构化 table proposition 恢复，
不能靠开放孤立 table cell。

C. V：
MATCH 必须从 0 提升。
若仍为 0，本任务不得声明机制完成。

D. C：
必须至少产生真实 Completion MATCH。
不能继续 0。

E. OUTPUT_CONTENT：
20 项中必须出现真实 MATCH。
不能继续 0。

F. I/O：
至少有一项明显 recall 改善，
且不能靠把所有文件都塞入 I/O。

G. P：
FALSE_DEFINED 继续保持 0 或等价水平。

H. R：
FALSE_DEFINED 继续保持 0；
SWAI-007 的 >=7 天阈值不得丢失。

I. 不得修改 Gold / Source / BXP。

J. 不得加入 sample-specific logic。


==================================================
十五、关于 STANDARD_PARSED
==================================================

当前：

0/9

本轮仍不强制要求 >0。

如果：

V / C / OUTPUT_CONTENT / I/O
出现明显通用改善，

即使仍 0/9，
任务也可验收。

禁止为了制造 1/9 而降标准。


==================================================
十六、代码版本
==================================================

在：

research/7plus1-parser/

建立新的 revision，例如：

v0.3-7p-repair-002/

不要覆盖：

v0.3-7p-repair-001/

保持历史可重放。

CLI / server / UI
必须共享同一个 engine / parse7Plus1。

现有 58618 不要求本任务自动切换。

如果不切换：

报告必须明确新 server 启动命令。


==================================================
十七、报告
==================================================

生成：

docs/reports/7plus1/7P-REPAIR-002/

至少包含：

REPORT.md
BEFORE-AFTER.json
COMPARISON.json
SLOT-SUMMARY.json
FAILURES.json
FIRST-DIVERGENCE.json
TESTS.json
RUNS.json
PERFORMANCE.json
CHANGED-FILES.txt
IMPLEMENTATION-FROZEN.json
VERIFY.json
MANIFEST.json
SEAL.md
SEAL-VERIFICATION.json
SHA256SUMS.txt

报告必须明确：

FIRST_DIVERGENCE
ROOT_CAUSE
MECHANISM_CHANGE
GENERALIZATION_EVIDENCE
KNOWN_REMAINING_FAILURES

特别单列：

TABLE_SEMANTICS
IO_ROLE_RESOLUTION
REFERENCE_BASIS
COMPLETION_LOGIC
OUTPUT_CONTENT_OWNERSHIP


==================================================
十八、禁止事项
==================================================

禁止：

- 修改人工 Gold
- 修改 Source
- 修改 BXP
- 修改 Pack
- 训练模型
- Gold-aware runtime
- SWAI ID hardcode
- REAL-GOLD ID hardcode
- 原句 hardcode
- 为单一 case 增加专属 regex
- 扩大 participant 技术词 blacklist 来刷分
- 取消 TABLE discourse gate
- 把 NUMBER 全部塞 R
- 把 Acceptance 全部当 A
- 把 OUTPUT_CONTENT future action 当当前 A
- merge main
- release
- tag


==================================================
十九、Push
==================================================

完成后 push：

review/7plus1-parser

不得 merge main。

完成后停止等待 ADMIN Review。


==================================================
二十、完成回复格式
==================================================

TASK=7P-REPAIR-002

BASE=13bd28fb25b02ee9358f20f2e1f2baa58df802f4
HEAD=<sha>

REF001=<PASS/FAIL>

STANDARD_PARSED_BEFORE=0/9
STANDARD_PARSED_AFTER=<x>/9

I_MATCH=0 -> <n>
I_MISSING=49 -> <n>

O_MATCH=4 -> <n>
O_MISSING=45 -> <n>

V_MATCH=0 -> <n>
V_MISSING=31 -> <n>

C_MATCH=0 -> <n>
C_MISSING=23 -> <n>

OUTPUT_CONTENT_MATCH=0 -> <n>
OUTPUT_CONTENT_MISSING=20 -> <n>

P_FALSE_DEFINED=0 -> <n>
P_WRONG_BINDING=0 -> <n>

R_FALSE_DEFINED=0 -> <n>
R_MISSING=0 -> <n>

A_FALSE_DEFINED=2 -> <n>
A_WRONG_BINDING=2 -> <n>

B_FALSE_DEFINED=0 -> <n>
B_WRONG_BINDING=6 -> <n>

SWAI003_ADR0003=<MATCH/FAIL>
TABLE_CELL_DIRECT_PROMOTION=false

PARSER_MODIFIED=true
GOLD_MODIFIED=false
SOURCE_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false

PRODUCTION_READY=false
STATUS=WAITING_ADMIN_REVIEW