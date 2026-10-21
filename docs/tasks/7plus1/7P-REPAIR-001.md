ADMIN TASK
Task ID: 7P-REPAIR-001

目标：
修复 BoundaryXP 7+1 Parser 的第一层通用语义机制：

1. Document / Discourse Scope
2. Participant Eligibility
3. Quantity / Resource Eligibility

本任务必须做机制级修复。
禁止针对 SWAI 编号、具体句子、具体文件名做 hardcode。

Repository:
joinwell52-AI/BoundaryXP

Branch:
review/7plus1-parser

BASE_COMMIT:
2bab790eb39ddfd4cfe198abbbd57642be1809b7

==================================================
一、权威测试集
==================================================

正式 Gold：

SWAI-001
SWAI-002
SWAI-003
SWAI-004
SWAI-006
SWAI-007
SWAI-008
SWAI-009
SWAI-010

路径以：

fixtures/7plus1/standard/ACTIVE-ADJUDICATION.json

为当前人工 Gold 权威索引。

SWAI-005：
NEEDS_ADJUDICATION_SOURCE_CONFLICT
禁止进入评分分母。

另保留：

REF-001 Meeting Minutes

其当前正确结果不得退化。

==================================================
二、当前事实基线
==================================================

7P-STANDARD-003：

STANDARD_GOLD_CONFIRMED = 9
STANDARD_PARSED = 0/9

主要 finding：

I:
MISSING 49
FALSE_DEFINED 3
WRONG_BINDING 3

O:
MISSING 49
FALSE_DEFINED 1
WRONG_BINDING 2

A:
MATCH 1
MISSING 55
FALSE_DEFINED 3
WRONG_BINDING 9

P:
MISSING 12
FALSE_DEFINED 22
WRONG_BINDING 8

R:
MISSING 1
FALSE_DEFINED 8

V:
MATCH 1
MISSING 30

C:
MISSING 23

B:
MISSING 42
FALSE_DEFINED 1
WRONG_BINDING 10

OUTPUT_CONTENT_REQUIREMENTS:
20 项，当前 MATCH=0。

本轮不要求解决全部 missing。
本轮优先消除前端结构错误和明显 false positive，
给下一阶段 I/O/A/V/C/B semantic decoding 建立可靠输入。

==================================================
三、Repair A：Document / Discourse Scope
==================================================

当前问题：

Markdown 标记、标题、代码块、表格、引用、背景描述、
验收条目、Out of scope、以及“要求写进某个输出文档里的未来指令”
没有可靠区分。

造成：

- `##` / `###` 被当 participant
- code/docstring 中 `we` 被当当前 participant
- prompt 内未来 agent 行为被提升为当前 A/B
- 背景事实被当当前动作
- 示例命令被当当前任务动作
- “不应该触发 drift”被解析成 REQUIRED 触发 drift

要求：

在 SourceDocument / frontend 阶段建立通用 discourse annotation。

至少区分：

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

名称可按现有实现风格调整，
但语义必须等价。

结构信息必须从 Markdown/YAML/句法结构产生，
不得通过 SWAI case id 特判。

规则：

1. Markdown heading marker 本身永远不能成为实体/participant/action。
2. fenced code 内容默认不是当前任务 action。
3. quoted historical/background text 默认不是当前任务 action。
4. 表格必须保留行列关系，不能把单个 cell 脱离表意后直接升格。
5. “要求生成的 prompt/spec/doc 中必须包含 X”
   必须支持：

   CURRENT_TASK action:
   编写/修改该 output

   OUTPUT_CONTENT:
   X

   禁止直接把 X 中描述的未来动作升为 CURRENT_TASK A。

6. OUT_OF_SCOPE / 不做 / 不实现 / 不修改：
   仍然可以形成当前任务 B，
   但其 target 必须是完整对象，
   不能截成“在”“做”“写”等残片。

==================================================
四、Repair B：Participant Eligibility
==================================================

当前问题：

SRL AGENT / 名词候选被直接提升成 P。

出现过：

三个 generator
Schema
Event
ConfigError
prompt
pip show fcop fcop-mcp
##
###
diff
RETRY 计数
ESCALATE
本身
这
它们

等错误 participant。

建立 Participant Eligibility Gate。

一个候选只有存在以下至少一种可靠证据时，
才允许成为 P：

A. frontmatter sender / recipient
B. 明确的人名
C. 明确 Agent / role code
D. 明确责任关系：
   X 负责...
   由 X...
   提交给 X...
   X 审核...
   X 批准...
E. 已建立且来源可追溯的 coreference 到合法 participant

SRL AGENT alone 不足以成为 Participant。

普通：

文件
命令
API
类
枚举
模块
Markdown 标记
代词未解析项
抽象概念

不得直接成为 P。

角色仍限定：

PERFORMER
APPROVER
REVIEWER
RECIPIENT
COLLABORATOR

不要新增 DECISION_MAKER 等角色。

如果身份关系不能唯一解析：

UNRESOLVED_COREFERENCE

而不是随意绑定 PERFORMER。

==================================================
五、Repair C：Quantity / Resource Eligibility
==================================================

当前问题：

所有 NUMBER/LIMIT 太容易进入 R。

错误示例类型：

7 个 schema
12 条 acceptance
8 个 test
3 commit
版本 4.0
第 3/7
anti-pattern >=6 条

这些不是当然的 Resource。

建立 Quantity Classification：

NUMBER
VERSION
ORDINAL
COUNT_OF_OUTPUT
COUNT_OF_TEST
COUNT_OF_CRITERIA
ENUM_COUNT
DURATION
DEADLINE
BUDGET
CAPACITY
LIMIT
THRESHOLD
OTHER

只有真正限制合法解空间的 quantity 才可以进入 R。

典型可进入 R：

- 总用时 <= 40 分钟
- 成本 <= ...
- 内存 <= ...
- 并发 <= ...
- 哑火定义为 >= 7 天无回应
- 明确容量/预算/资源上限

不得自动进入 R：

- “7 个 schema”
- “12 条验收”
- “3 commits”
- “第 3/7”
- 版本号
- 枚举有 5 个值
- “至少 3 个测试”如果它只是 C/O 的验收数量

Quantity 必须保留 target/unit/bounds/inclusive/scope。

SWAI-007：

>= 7 天无回应

必须能够作为真正 R threshold 被保留。

==================================================
六、009 / 010 专项机制验证
==================================================

不得 hardcode SWAI-009/010。

它们只是验证通用机制：

文本：

“编写一份 prompt，prompt 中要求 agent 做 X”

必须得到类似：

CURRENT_TASK:
  A = 编写 prompt

OUTPUT:
  O = prompt

OUTPUT_CONTENT:
  requirement = agent 做 X

而不是：

CURRENT_TASK:
  A = agent 做 X

同理：

“prompt 中写 agent 不得 Y”

应保留为输出内容约束，
不能无条件成为当前 task 的 B。

但：

“本任务不修改 Z”

仍然是当前 task B。

==================================================
七、本轮不解决的内容
==================================================

本轮允许继续存在：

- I/O recall 不完整
- V recall 不完整
- C recall 不完整
- 复杂 Action decomposition 不完整
- AND/OR 完成条件不完整
- supersedes 完整 temporal reasoning 不完整
- 深层 coreference unresolved

除非修复 A/B/C 机制自然改善。

不得为了提高数字顺手加句子 patch。

==================================================
八、测试
==================================================

必须至少包括：

1. 新机制单元测试
2. 泛化 mutation tests
3. REF-001 完整回归
4. 9 个正式 SWAI 全部重新 Parser
5. 当前原有 parser regression
6. full regression

必须新增反例：

- Markdown heading 不是 participant
- code block 中 we 不是 participant
- API/class/enum 不是 participant
- unresolved pronoun 不直接成为 participant
- version number 不进入 R
- list count 不进入 R
- acceptance count 不进入 R
- duration threshold 正确进入 R
- OUTPUT_CONTENT future action 不进入 CURRENT_TASK A
- OUTPUT_CONTENT future prohibition 不进入 CURRENT_TASK B
- 当前任务 Out-of-scope prohibition 仍进入 B

==================================================
九、评价
==================================================

重新对照当前 ACTIVE Gold。

报告必须给出修复前后：

P.FALSE_DEFINED
P.WRONG_BINDING

R.FALSE_DEFINED
R.MISSING

A.FALSE_DEFINED
A.WRONG_BINDING

B.FALSE_DEFINED
B.WRONG_BINDING

OUTPUT_CONTENT_REQUIREMENTS MATCH/MISSING

以及：

STANDARD_PARSED before = 0/9
STANDARD_PARSED after = x/9

本轮不要求 x > 0。

如果通用机制明显改善但仍 0/9，
也可以 PASS。

禁止为了制造 x>0 降低 Gold。

==================================================
十、验收重点
==================================================

至少要求：

A. REF-001 仍然 STANDARD_PARSED_SAMPLE=true

B. P false positive 显著下降，
以下类型不得再成为 resolved P：
Markdown marker / command / API / enum /普通技术名词

C. R false positive 显著下降，
版本号/清单计数/验收计数不得进入 R

D. SWAI-009 / 010 embedded future instructions
不得再作为无作用域 CURRENT_TASK A/P/B

E. 不新增 sample-specific logic

F. Source / Gold / BXP 不修改

==================================================
十一、报告
==================================================

生成：

docs/reports/7plus1/7P-REPAIR-001/

至少：

REPORT.md
BEFORE-AFTER.json
COMPARISON.json
SLOT-SUMMARY.json
FAILURES.json
TESTS.json
CHANGED-FILES.txt
MANIFEST.json

报告必须明确：

FIRST_DIVERGENCE
ROOT_CAUSE
MECHANISM_CHANGE
GENERALIZATION_EVIDENCE
KNOWN_REMAINING_FAILURES

不要只写“测试通过”。

==================================================
十二、禁止事项
==================================================

禁止：

- 修改人工 Gold
- 修改 source
- 修改 BXP
- 样本 ID hardcode
- 原文字符串 hardcode
- 为某一句增加 regex 特判
- 训练模型
- 修改 Gold 来适配 Parser
- merge main
- release
- tag

允许：

修改当前真实 Parser 的通用实现及测试。

==================================================
十三、Push
==================================================

完成后 push：

review/7plus1-parser

停止等待 ADMIN Review。

完成回复：

TASK=7P-REPAIR-001
BASE=2bab790eb39ddfd4cfe198abbbd57642be1809b7
HEAD=<sha>

REF001=<PASS/FAIL>

STANDARD_PARSED_BEFORE=0/9
STANDARD_PARSED_AFTER=<x>/9

P_FALSE_DEFINED=<before> -> <after>
P_WRONG_BINDING=<before> -> <after>

R_FALSE_DEFINED=<before> -> <after>
R_MISSING=<before> -> <after>

A_FALSE_DEFINED=<before> -> <after>
A_WRONG_BINDING=<before> -> <after>

B_FALSE_DEFINED=<before> -> <after>
B_WRONG_BINDING=<before> -> <after>

OUTPUT_CONTENT_MATCH=<before> -> <after>

PARSER_MODIFIED=true
GOLD_MODIFIED=false
SOURCE_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false
PRODUCTION_READY=false

STATUS=WAITING_ADMIN_REVIEW
