ADMIN TASK
Task ID: 7P-STANDARD-002

目标：
把 ADMIN/ChatGPT 已人工审定的第一批 10 个正确 7+1 标准答案正式落库，
并与当前 Parser 的实际 7+1 输出做逐项对照。

本轮只建立标准答案和差异报告。
不得修改 Parser，不得修改 BXP，不得重新解释或重写人工标准答案。

Repository:
joinwell52-AI/BoundX

Branch:
review/7plus1-parser

BASE_COMMIT:
f567109cebacc4e93a60087969b132c142bdbf85

==================================================
一、定义
==================================================

本阶段固定定义：

标准样本 =
原始自然语言 Source
+
人工确认正确的 7+1

标准解析样本 =
标准样本
+
当前 Parser 能语义等价地解析出该人工 7+1

因此：

Parser 解析失败
≠ 标准样本失败

Parser 解析失败只表示：
该标准样本当前还不能晋级为 STANDARD_PARSED_SAMPLE。

==================================================
二、本轮输入
==================================================

使用已经冻结的：

fixtures/7plus1/standard-candidates/SWAI-001
...
fixtures/7plus1/standard-candidates/SWAI-010

对应关系：

SWAI-001 = REAL-GOLD-003
SWAI-002 = REAL-GOLD-015
SWAI-003 = REAL-GOLD-017
SWAI-004 = REAL-GOLD-019
SWAI-005 = REAL-GOLD-025
SWAI-006 = REAL-GOLD-032
SWAI-007 = REAL-GOLD-033
SWAI-008 = REAL-GOLD-046
SWAI-009 = REAL-GOLD-049
SWAI-010 = REAL-GOLD-050

source.md 已冻结，不得改写。

历史 GOLD.json / GOLD.md 只能做历史参考，
不得覆盖本任务人工标准答案。

==================================================
三、建立正式标准样本目录
==================================================

建立：

fixtures/7plus1/standard/

每个样本：

fixtures/7plus1/standard/SWAI-001/
├─ source.md
├─ expected-7plus1.json
├─ expected-7plus1.md
└─ manifest.json

...
SWAI-010

要求：

1. source.md 必须与 standard-candidates 中原文逐字节一致。
2. expected-7plus1.json 是机器标准答案。
3. expected-7plus1.md 是同一答案的人读版。
4. 两份 expected 的语义必须完全一致。
5. 不要求保存 Semantic IR / Boundary IR 作为 Gold。
6. 不得从 Parser actual 反推或修改 expected。

状态：

GOLD_7PLUS1_CONFIRMED

只有 actual 与 expected 通过后，才能额外标：

STANDARD_PARSED_SAMPLE

==================================================
四、统一 expected-7plus1.json 最小结构
==================================================

采用固定结构：

{
  "sample_id": "SWAI-xxx",
  "status": "GOLD_7PLUS1_CONFIRMED",
  "slots": {
    "I": {
      "status": "RESOLVED|UNRESOLVED|ABSENT",
      "entries": []
    },
    "O": {...},
    "A": {...},
    "P": {...},
    "R": {...},
    "V": {...},
    "C": {...},
    "B": {...}
  }
}

entry 可按需要包含：

value
modality
role
target
condition
quantity
scope
notes

不得为了适配当前 Parser 的 display_value 而降低人工答案结构。

==================================================
五、ADMIN/ChatGPT 人工审定答案
==================================================

以下为本轮唯一 authoritative expected 7+1。

Codex 不得重新 adjudicate。

--------------------------------------------------
SWAI-001 / REAL-GOLD-003
--------------------------------------------------

I — RESOLVED
- src/fcop/project.py 中：
  - write_task
  - write_report
  - write_issue
- 对应 active 与 log/archive 的 task/report/issue 文件集合
- 三个对应测试文件

O — RESOLVED
- 私有 helper `_existing_filenames_for_seq`
- 三个 writer 的 union-scan 修复
- 三个 `seq_skips_archived` 回归测试

A — RESOLVED / REQUIRED
- 新增 `_existing_filenames_for_seq`
- write_task 同时扫描 tasks_dir + log/tasks
- write_report 同时扫描 reports_dir + log/reports
- write_issue 同时扫描 issues_dir + log/issues
- 新增三项 archived-basename sequence 回归测试

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ISSUE-20260427-003-ME.md
- TASK-20260427-002-ADMIN-to-ME.md
- src/fcop/project.py 对应现状代码位置

C — RESOLVED
AND:
- 三份新测试通过
- 原有 587 passed 不退
- ruff clean
- 两件人工 rename 文件不被误伤

B — RESOLVED
- FORBIDDEN 引入 `.archived/<id>.tombstone`
- FORBIDDEN 修改 `next_sequence()` 本身语义
- O_EXCL 原子预占逻辑保持不变
- retry 限保持不变

--------------------------------------------------
SWAI-002 / REAL-GOLD-015
--------------------------------------------------

I — RESOLVED
- 7 份 spec/schemas/*.schema.json
- src/fcop 相关 schema/review 模块
- 0.7.x legacy TASK/REPORT/ISSUE
- tests 与 public surface snapshot

O — RESOLVED
- JSON Schema validator
- wheel 内 bundled schemas
- REVIEW dataclass
- ReviewDecision / ReviewSubjectType
- Project.write_review/read_review/list_reviews/archive_review
- schema/review 测试
- public surface snapshot
- CHANGELOG
- REPORT-004

A — RESOLVED / REQUIRED
- bundle 7 schemas
- 实现 jsonschema validator
- 实现 REVIEW 全链
- 更新 public surface
- 完成测试
- 按 3 commit 收口

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ADR-0015
- ADR-0016
- ADR-0017
- ADR-0001
- ADR-0003

C — RESOLVED
- Acceptance A1–A10 全部满足
- pytest 全绿后才 commit

B — RESOLVED
- FORBIDDEN 把 validator 强制接入已有 write_task/write_report/write_issue
- FORBIDDEN 实现 TASK-005～TASK-011 范围
- FORBIDDEN 加入 v1.2 REVIEW 特性
- FORBIDDEN 修改已有 dataclass 字段类型
- public surface 不得出现 deleted/renamed

--------------------------------------------------
SWAI-003 / REAL-GOLD-017
--------------------------------------------------

I — RESOLVED
- failure.schema.json
- models.py
- core/recovery.py
- project.py
- failure/recovery 测试
- ADR-0019

O — RESOLVED
- Failure / Recovery dataclasses
- FailureType / RecoveryAction / SessionRecoveryAction
- 5 类 recovery reference implementation
- Project.report_failure
- Project.apply_recovery
- Project.recover_session
- event stub
- ADR/REPORT 更新

A — RESOLVED / REQUIRED
- 实现 Failure/Recovery 模型
- 实现五类恢复
- 支持两类 session_id
- recover_session 支持 resume/rollback/abort
- schema 对齐
- 测试/public surface/ADR/REPORT 收口

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ADR-0019
- ADR-0015
- failure.schema.json

C — RESOLVED
- A1–A12 全部满足
- 四个 commit 完成

B — RESOLVED
- Failure/Recovery 不写成文件 envelope
- ROLLBACK 不实际执行 git revert
- 不实现真实 Event 推送
- recover_session 不接受 RETRY / ESCALATE
- 不实现 DRIFT 自动检测
- 不实现完整 LLM session
- 不做 MIGRATION-1.0.md 本任务外内容

--------------------------------------------------
SWAI-004 / REAL-GOLD-019
--------------------------------------------------

I — RESOLVED
- legacy docs/agents workspace
- 目标 fcop/ workspace
- fcop CLI
- git tracked/untracked workspace 路径
- advisory files

O — RESOLVED
- `fcop migrate-workspace`
- dry-run/apply 能力
- MIGRATED_FROM_DOCS_AGENTS.md breadcrumb
- 测试
- ADR/REPORT 更新

A — RESOLVED / REQUIRED
- 实现 migrate-workspace 子命令
- 默认 dry-run
- --apply 才移动
- tracked path 使用 git mv
- 非 tracked 使用 fallback
- advisor scan
- 保持 bare fcop legacy 行为

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ADR-0022
- ADR-0015

C — RESOLVED
- 8 条 acceptance criteria 全部满足

B — RESOLVED
- dry-run 不得修改磁盘
- both-exist 必须 ABORT / exit 2 / 不动盘
- advisor scan 不得自动修改 .gitignore/README 等
- 不实现 Project Phase 2
- 不新增 runtime dependency

--------------------------------------------------
SWAI-005 / REAL-GOLD-025
--------------------------------------------------

I — RESOLVED
- fcop-mcp write-side 工具集合
- project binding state
- project_dir
- fcop_report()
- MCP tool schemas
- USER HOME / system root path classes

O — RESOLVED
- explicit binding guard
- protected-path deny-list
- fcop_report project_path warning
- schema binding_required 标记
- 回归测试
- 1.4 release notes / upgrade 提示

A — RESOLVED / REQUIRED
- 所有 write-side 工具增加 explicit binding guard
- protected root 检查
- report warning
- schema metadata
- 测试
- PM #50 reproduction

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- fcop-mcp 1.4
- PM #50 事故证据

C — RESOLVED
AND:
- D1～D6 全部完成
- PM #50 复现被拒写
- USER HOME 保持 0 污染
- 全测试绿

B — RESOLVED
- 未 explicit bind 时 FORBIDDEN cwd fallback
- project_dir 精确等于 USER HOME/system roots 时 FORBIDDEN write
- home 下合法子目录不得被误伤
- FORBIDDEN 全局污染

--------------------------------------------------
SWAI-006 / REAL-GOLD-032
--------------------------------------------------

I — RESOLVED
- docs/release-process.md 阶段 4
- docs/release-process.md 常见故障区域

O — RESOLVED
- 阶段4 commit 指令修订
- 新增“问题7”
- REPORT-20260513-002...
- 干净 main commit

A — RESOLVED / REQUIRED
- 把 git add -A 改为显式路径
- commit 前运行 git status --short
- 写事故与恢复说明
- 引用 4 个历史 commit
- 本任务自身 dogfood 显式路径
- push origin main

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT]

R — ABSENT

V — RESOLVED
- d2ed13c
- cc60186
- 979bcd2
- dfe68e3

C — RESOLVED
AND:
- 两处文档均完成
- 4 个 commit hash 都作为依据
- REPORT 完成
- staging 仅含预期 3 个文件
- push main 成功

B — RESOLVED
- FORBIDDEN `git add -A`
- 不动协议
- 不发版

--------------------------------------------------
SWAI-007 / REAL-GOLD-033
--------------------------------------------------

I — RESOLVED
- D:\codeflow-3 的 FCoP 部署
- fcop.json
- FCoP 目录结构
- team docs
- TASK/REPORT/ISSUE 文件名与 frontmatter
- reciprocity/history/workspace
- rules/协议版本状态

O — RESOLVED
- P0/P1/P2 分级合规审计报告

A — RESOLVED / REQUIRED
- 完成 A～I 全部只读检查
- TASK/REPORT 只读文件名和 frontmatter
- 所有结论附事实依据
- 给出合规建议
- 以显式 git add 路径提交报告

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT]

R — RESOLVED
- 哑火判定阈值：>= 7 天无回应

V — RESOLVED
- fcop 1.1.0
- rules 2.2.0
- protocol commentary 2.0.0
- 文中对应 Rule / ADR

C — RESOLVED
AND:
- A～I 均检查
- 报告按 P0/P1/P2 分级
- 每条结论有路径+行号/字段
- 未验证项明确写 unverified

B — RESOLVED
- FORBIDDEN 在 codeflow-3 写任何文件
- FORBIDDEN 自命 codeflow.PM / codeflow.AUDITOR 等角色
- FORBIDDEN 阅读 codeflow TASK/REPORT 正文
- FORBIDDEN 把未验证内容写成确定事实

--------------------------------------------------
SWAI-008 / REAL-GOLD-046
--------------------------------------------------

I — RESOLVED
- src/fcop/project.py
- src/fcop/cli/_main.py
- src/fcop/cli/migrate_v3.py
- src/fcop/lifecycle/migrate.py
- src/fcop/lifecycle/state.py
- fcop/fcop.json
- CHANGELOG.md
- git log
- spec/fcop-3.0-spec.md
- fcop/LETTER-TO-ADMIN.md

O — RESOLVED
- 一份 REPORT-003
- 回答 Q1～Q4
- Evidence
- 下一步建议
- 附带发现

A — RESOLVED / REQUIRED
- 调查 _lifecycle 由谁生成
- 调查本仓为何没有 _lifecycle
- 对比 spec 与实现
- 审查 LETTER 的 Rule 0.c 风险
- 给 ADMIN 下一步选项

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT]

R — ABSENT

V — RESOLVED
- spec/fcop-3.0-spec.md
- Rule 0.c
- 当前实现及 migration 事实

C — RESOLVED
AND:
- Q1～Q4 各有结论+证据
- 下一步建议完整
- 查不到的明确写“未验证”

B — RESOLVED
- FORBIDDEN 修改任何 .md / .py 源文件
- FORBIDDEN 现场修复附带发现
- FORBIDDEN 猜测未知事实

--------------------------------------------------
SWAI-009 / REAL-GOLD-049
--------------------------------------------------

I — RESOLVED
- src/fcop/rules/_data/
- agent-install-prompt.zh.md
- README.md / README.zh.md
- MCP resource registry
- release_audit.py
- inventory_drift.py

O — RESOLVED
- agent-bringup-prompt.zh.md
- agent-bringup-prompt.en.md
- README 双语索引
- 可选 MCP resources
- REPORT-006

A — RESOLVED / REQUIRED
- 编写 bringup prompt
- 环境检查
- 升级目标版本
- 区分 MCP 工具和 Python API
- 加 anti-pattern
- ADMIN 选择后初始化
- 物理验证
- audit
- README 索引
- 条件允许时注册 MCP resource

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT / DECISION_MAKER]

R — ABSENT

V — RESOLVED
- Python >= 3.10
- fcop 与 fcop-mcp 目标版本必须一致
- 3.0.2 lifecycle bug 作为验证依据

C — RESOLVED
- 8 条 Acceptance Criteria 全满足

B — RESOLVED
- 不改 agent-install-prompt.zh.md
- 不动 LETTER-TO-ADMIN.md
- 不做工具层 anti-pattern 防呆
- 不发新版本
- 不改协议规则
- agent 每步不得自动跳下一步
- 不得猜 API
- init 不得替 ADMIN 默认选择

--------------------------------------------------
SWAI-010 / REAL-GOLD-050
--------------------------------------------------

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
- 两种场景表
- §1～§6
- README 索引
- 可选 MCP resources
- REPORT-007
- TASK-006/TASK-007 archive

A — RESOLVED / REQUIRED
- 使用不锁版本的升级方式
- 每步执行后报告并停
- 明确 MCP/Python API 边界
- ADMIN 决定初始化模式
- 实际 ls 做物理验证
- fcop_audit
- P0 非零时停止并报告
- README 索引
- 两项 audit
- archive 006+007

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT / DECISION_MAKER]

R — ABSENT

V — RESOLVED
- TASK-20260522-006 为 superseded predecessor
- Python >= 3.10
- 当前规则采用“最新版”，不是固定 package version

C — RESOLVED
- 9 条 Acceptance Criteria 全满足

B — RESOLVED
- TASK-006 中固定 `==3.0.2` 要求已 superseded，不再有效
- FORBIDDEN 写死 `==X.Y.Z`
- 不改 agent-install-prompt.zh.md
- 不动 LETTER-TO-ADMIN.md
- 不改协议
- 不发版
- 不做工具层防呆
- agent 不得自动进入下一步
- 不得默认 init
- 不得把工具返回 OK 当物理成功
- P0 != 0 时不得自行整改

==================================================
六、特别语义规则
==================================================

以下必须在 expected 中正确体现：

1. 数字不自动进入 R。

例如：
- “7 个 schema”
- “12 条验收”
- “3 commit”
- “anti-pattern >= 6”
- “六段”
均不是自动 R。

只有真正约束解空间的数量约束才进入 R。

本批中明确进入 R 的：
SWAI-007：
`>= 7 天无回应` 的哑火判定阈值。

2. priority=P0/P1 不进入 R。

3. Participant 不能把普通名词、标题、Markdown 标记、API、枚举当人/Agent。

4. `supersedes` 必须生效。

SWAI-010 中：
TASK-006 固定 `==3.0.2` 的旧要求已经失效，
不得继续作为当前要求。

==================================================
七、actual vs expected 对照
==================================================

使用已有：

fixtures/7plus1/standard-candidates/SWAI-xxx/parser-actual-7plus1.json

与本轮 expected 做机械对照。

生成：

docs/reports/7plus1/7P-STANDARD-002/

至少包含：

REPORT.md
COMPARISON.json
COMPARISON.md
SLOT-SUMMARY.json
FAILURES.json
MANIFEST.json

每个样本必须给出：

I: MATCH / MISSING / FALSE_DEFINED / WRONG_BINDING / WRONG_STATUS
O: ...
A: ...
P: ...
R: ...
V: ...
C: ...
B: ...

允许一个 slot 同时有多个 finding。

禁止用“slot 非空”代替语义正确。

禁止因为 actual 和 expected 文本表述不同就误判；
应比较语义内容、模态、角色、scope、condition、quantity。

==================================================
八、标准解析样本判定
==================================================

只有：

I/O/A/P/R/V/C/B
全部语义等价

才允许：

STANDARD_PARSED_SAMPLE=true

否则：

STANDARD_PARSED_SAMPLE=false

不得降标准答案来制造通过。

==================================================
九、本轮禁止事项
==================================================

禁止：

- 修改 Parser
- 新增针对 SWAI-xxx 的硬编码
- 修改 NLP threshold
- 修改 Pack
- 修改模型
- 修改 BXP
- 修改 Source
- 根据 actual 修改 expected
- 根据旧 GOLD.json 修改 expected
- 修 P3
- merge main
- release
- tag

如果认为 ADMIN 给出的人工 expected 与 Source 存在冲突：

不得自行修正。

必须记录：

ADMIN_ADJUDICATION_CONFLICT

并在 REPORT 中指出具体 Source span 和冲突理由，
等待 ADMIN/ChatGPT 决定。

==================================================
十、报告必须回答
==================================================

REPORT.md 必须明确：

1. 10/10 expected 是否成功落库
2. source SHA 是否保持一致
3. 每个样本 STANDARD_PARSED_SAMPLE true/false
4. 10 个中 Parser 完整正确多少个
5. 每个槽位：
   - missing 数
   - false-defined 数
   - wrong-binding 数
   - wrong-status 数
6. 最常见的 5～8 个 first-divergence / root-cause 候选
7. 哪些错误跨多个样本重复出现
8. 不得开始修复
9. PRODUCTION_READY=false

==================================================
十一、Push
==================================================

完成后 push：

review/7plus1-parser

不得 merge main。

完成回复固定格式：

TASK:
7P-STANDARD-002

BRANCH:
review/7plus1-parser

BASE_COMMIT:
f567109cebacc4e93a60087969b132c142bdbf85

HEAD_COMMIT:
<sha>

STANDARD_GOLD:
10/10

STANDARD_PARSED:
<x>/10

SLOT_FINDINGS:
<summary>

ROOT_CAUSE_CANDIDATES:
<count>

PARSER_MODIFIED:
false

GOLD_SOURCE_MODIFIED:
false

BXP_PROTOCOL_MODIFIED:
false

MAIN_MERGED:
false

RELEASED:
false

PRODUCTION_READY:
false

STATUS:
WAITING_ADMIN_REVIEW

完成后停止。