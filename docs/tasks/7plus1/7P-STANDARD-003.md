ADMIN TASK
Task ID: 7P-STANDARD-003

目标：
完成第一批 7+1 人工标准样本的 ADMIN 复审修订。

本轮只修人工 expected Gold 与 comparison。
不得修改 Parser、Source、BXP、模型、Pack、threshold。
不得开始 Parser repair。

Repository:
joinwell52-AI/BoundaryXP

Branch:
review/7plus1-parser

BASE_COMMIT:
fe2cbee2bb9a73336bb179a64917a2cffb84a392


==================================================
一、修订原则
==================================================

标准样本定义不变：

Source
+
人工确认正确的当前任务 7+1
=
Gold Standard

必须严格区分：

1. 当前 TASK 本身要求执行的动作；
2. 当前 TASK 要生成的文档 / prompt / spec 中“写进去的未来动作”。

后者属于 OUTPUT CONTENT SEMANTICS，
不得无条件提升为当前 TASK 的 A / P / B。

历史 expected 不覆盖删除。
本次产生新的 adjudication revision / manifest。


==================================================
二、SWAI-003：接受 ADMIN_ADJUDICATION_CONFLICT
==================================================

Source 中明确存在：

“符合 ADR-0003”

因此：

SWAI-003 / V

在现有：
- ADR-0019
- ADR-0015
- failure.schema.json

基础上新增：

- ADR-0003

这是规范/公开面约束的明确依据。

重新比较时，若当前 Parser 的 ADR-0003 条目语义及绑定正确，
应计 MATCH，不得继续作为冲突悬置。

其余 SWAI-003 expected 保持不变。


==================================================
三、SWAI-005：撤销当前 GOLD_7PLUS1_CONFIRMED
==================================================

SWAI-005 Source 自身存在身份/授权状态冲突：

frontmatter:
sender = ADMIN
recipient = ME
status = done

正文末尾却明确：

“请 ADMIN 决：
(A) 批准推进
(B) 调整范围
(C) 拒绝/延后
我推荐 (A)”

在没有额外 Allowed Context / ADMIN choice Evidence 的情况下，
不能证明 D1～D6 已成为无条件 REQUIRED 当前动作。

因此本轮：

SWAI-005.status =
NEEDS_ADJUDICATION_SOURCE_CONFLICT

STANDARD_GOLD=false
STANDARD_PARSED_SAMPLE=false

不得删除样本。
不得猜 ADMIN 当时选择了 A。
不得利用历史执行结果反推 Source 当时已获授权。

继续保留：
source.md
historical-reference
parser actual
现有旧 expected revision

但该 Case 暂不进入正式标准准确率分母。

后续若提供权威 Context，再建立新 revision。


==================================================
四、SWAI-009：修正“元任务 / 嵌入指令”作用域
==================================================

当前 TASK 的核心是：

编写 agent-bringup-prompt 双语文档。

因此未来 agent 在 prompt 内应该做的事情，
不能直接作为当前 TASK 的 A/P/B。

重新 adjudicate 如下。


I — RESOLVED

保留当前输入/作用对象：

- src/fcop/rules/_data/
- agent-install-prompt.zh.md
- README.md / README.zh.md
- MCP resource registry
- release_audit.py
- inventory_drift.py


O — RESOLVED

当前 TASK 的交付结果：

- agent-bringup-prompt.zh.md
- agent-bringup-prompt.en.md
- README 双语索引
- 条件允许时的 MCP resource 注册
- REPORT-006
- TASK-006 archive

并显式增加 OUTPUT CONTENT REQUIREMENTS：

两份 bringup prompt 必须包含：

- 环境检查
- 版本检查/升级说明
- MCP 工具 vs Python API 边界
- anti-pattern 清单
- ADMIN 选择初始化模式
- 初始化后物理验证
- audit 流程
- 每一步报告后停下
- 不确定时读文档而非猜 API
- init 不替 ADMIN 默认选择

这些是 O 的内容约束，
不是当前 TASK 中 ME 要实际执行一遍的未来 bringup 流程。


A — RESOLVED

当前 TASK 实际动作改为：

- REQUIRED 编写 zh bringup prompt
- REQUIRED 编写 en bringup prompt
- REQUIRED 在 README.md / README.zh.md 增加索引
- REQUIRED 运行 release_audit.py
- REQUIRED 运行 inventory_drift.py
- REQUIRED 写 REPORT-006
- REQUIRED archive TASK-006
- CONDITIONAL_REQUIRED 注册 MCP resources
  condition = 当前架构允许且无需改变 mcp 包结构

不得把：
“升级 fcop”
“调用 init_solo”
“物理 ls”
“未来 agent 每步停下”
等 prompt 内未来动作直接列为当前 TASK A。


P — RESOLVED

- ME [PERFORMER]

删除：

ADMIN [RECIPIENT / DECISION_MAKER]

理由：

DECISION_MAKER 不是当前冻结 Participant Role；
而且这里 ADMIN 的大量“决定”属于 prompt 描述的未来 workflow。

如果 Source 没有明确说明当前 REPORT 的接收关系，
不得仅凭未来 prompt 内容把 ADMIN 加为当前 P。


R — ABSENT


V — RESOLVED

以下版本事实可以保留，但必须带 scope：

- Python >= 3.10
  scope = OUTPUT_CONTENT(agent-bringup-prompt)

- fcop 与 fcop-mcp 目标版本一致
  scope = OUTPUT_CONTENT(agent-bringup-prompt)

- 3.0.2 lifecycle bug
  role = PROVENANCE / VALIDATION_BASIS

不得解释为当前开发环境已经被要求运行 Python >=3.10，
除非 Source 明确如此。


C — RESOLVED

当前 TASK 完成条件为原 8 条 Acceptance Criteria 全部满足。

应保留 AND 语义。


B — RESOLVED

当前 TASK 自身禁止边界：

- 不改 agent-install-prompt.zh.md
- 不动 LETTER-TO-ADMIN.md
- 不做工具层 anti-pattern 防呆
- 不发新版本
- 不改协议规则

以下内容移出当前 TASK B：

- agent 每步不得自动跳下一步
- 不得猜 API
- init 不得替 ADMIN 默认选择

这些属于 bringup prompt 的 OUTPUT CONTENT REQUIREMENTS。


==================================================
五、SWAI-010：同样修正元任务作用域 + supersedes
==================================================

SWAI-010 是 SWAI-009 的修订版 prompt 编写任务。

必须体现：

TASK-007 supersedes TASK-006。


I — RESOLVED

- TASK-20260522-006
- agent bringup prompt 相关文件
- README
- MCP resource registry
- release_audit.py
- inventory_drift.py


O — RESOLVED

- 修订版 agent-bringup-prompt.zh.md
- 修订版 agent-bringup-prompt.en.md
- 两种新建场景表
- §1～§6 内容
- README 索引
- 条件允许时 MCP resources
- REPORT-007
- TASK-006 / TASK-007 archive

OUTPUT CONTENT REQUIREMENTS 必须明确包括：

- 不锁固定版本号
- 每步报告并停
- MCP/Python API 边界
- ADMIN 选择初始化模式
- 实际 ls 物理验证
- fcop_audit
- P0 != 0 时停止并报告 ADMIN
- 不把 tool 返回 OK 当成物理成功
- 不猜 API
- 不自动整改 P0


A — RESOLVED

当前 TASK 的实际动作：

- REQUIRED 编写/修订 zh prompt
- REQUIRED 编写/修订 en prompt
- REQUIRED 加 README 索引
- REQUIRED 运行 release_audit.py
- REQUIRED 运行 inventory_drift.py
- REQUIRED 写 REPORT-007
- REQUIRED archive TASK-006 + TASK-007
- CONDITIONAL_REQUIRED 注册 MCP resource
  condition = 当前架构允许且无需改变 mcp 包结构

不得把 prompt 中未来 agent 的：
pip install
init_solo
ls
fcop_audit
停下等待 ADMIN
直接无条件提升成当前 TASK A。


P — RESOLVED

- ME [PERFORMER]

删除：

ADMIN [RECIPIENT / DECISION_MAKER]

不得使用 DECISION_MAKER 角色。


R — ABSENT


V — RESOLVED

- TASK-20260522-006
  temporal_status = SUPERSEDED
  current_requirement = false

- Python >= 3.10
  scope = OUTPUT_CONTENT(agent-bringup-prompt)

- “最新版、不固定 package version”
  scope = OUTPUT_CONTENT(agent-bringup-prompt)

关键规则：

superseded 的旧要求保留 provenance，
但不得作为当前有效要求。


C — RESOLVED

原 9 条 Acceptance Criteria 全部满足。
保持 AND 语义。


B — RESOLVED

当前 TASK 禁止：

- FORBIDDEN 生成的 prompt 写死 `==X.Y.Z`
  target = agent-bringup-prompt output

- 不改 agent-install-prompt.zh.md
- 不动 LETTER-TO-ADMIN.md
- 不改协议规则
- 不发版
- 不做工具层防呆

删除旧 B 项：

“TASK-006 中固定 ==3.0.2 要求已 superseded，不再有效”

原因：

这不是当前 prohibition，
而是 V / temporal provenance。

以下未来 agent 行为也不得作为当前 TASK B：

- agent 不得自动进入下一步
- 不得默认 init
- 不得把 tool OK 当物理成功
- P0 != 0 不得自行整改

这些属于 O 的 prompt 内容约束。


==================================================
六、重新生成 comparison
==================================================

以修订后的人工 expected 为唯一标准。

重新生成：

docs/reports/7plus1/7P-STANDARD-003/

至少：

REPORT.md
COMPARISON.json
COMPARISON.md
SLOT-SUMMARY.json
FAILURES.json
MANIFEST.json

不得重跑或修改 Parser。

仍使用 7P-STANDARD-001 冻结的 actual。


==================================================
七、统计口径
==================================================

正式标准集暂时：

SWAI-001
SWAI-002
SWAI-003
SWAI-004
SWAI-006
SWAI-007
SWAI-008
SWAI-009
SWAI-010

= 9 个 GOLD_7PLUS1_CONFIRMED

SWAI-005：

NEEDS_ADJUDICATION_SOURCE_CONFLICT

不进入当前标准准确率分母。


REF-001 Meeting Minutes 保持：

GOLD_7PLUS1_CONFIRMED
STANDARD_PARSED_SAMPLE=true


==================================================
八、本轮禁止
==================================================

不得：

- 修改 Parser
- 修语义机制
- 修改 Source
- 修改 BXP
- 修改模型
- 修改 Pack
- 修改 threshold
- 根据 actual 调整 expected
- 根据旧 Gold 恢复错误答案
- merge main
- release


==================================================
九、完成报告
==================================================

报告必须给出：

STANDARD_GOLD_CONFIRMED = 9
SOURCE_CONFLICT = 1
STANDARD_PARSED = <x>/9

并重新输出 slot findings。

特别确认：

SWAI-003 ADR-0003 是否变为 MATCH。

SWAI-009 / 010：
不得再把 embedded prompt instructions
作为当前 task 的 A/P/B 来评价。

完成后 push：

review/7plus1-parser

然后停止等待 ADMIN Review。

完成回复：

TASK=7P-STANDARD-003
BASE=<sha>
HEAD=<sha>
STANDARD_GOLD_CONFIRMED=9
SOURCE_CONFLICT=1
STANDARD_PARSED=<x>/9
SWAI003_ADR0003=<MATCH/other>
SWAI009_META_SCOPE=CORRECTED
SWAI010_META_SCOPE=CORRECTED
PARSER_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false
PRODUCTION_READY=false
STATUS=WAITING_ADMIN_REVIEW
