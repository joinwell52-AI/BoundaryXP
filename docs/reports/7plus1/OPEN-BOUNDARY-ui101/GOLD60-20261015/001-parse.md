## I｜输入与作用域

- 本单是 **0.6.6 文档级 patch 的追溯补登**，涵盖跨表面一致性自查、文档修复和协议记录；不是重新发布软件包的授权。来源：「跨表面一致性自查 + 修复（追溯落档）」「协议侧的纠正补登」。
- 自查覆盖全部文档、GitHub、PyPI，并包含说明 fcop-mcp 各项功能的作用。已报告：版本号、包定位、tool/resource 签名一致，漂移仅在人读副本。来源：「自我检查所有文档、GitHub、PyPI」「那么多功能究竟什么作用？」「漂移仅在『人读副本』一侧」。
- 修复范围以应交付物逐项清单为明确要求，并受「该补齐的补齐，该重写的重写」约束；PyPI 是检查对象，但本轮不刷新其发布内容。来源：上下文第 2、3 项及「ME 的应交付物」。

## O｜产物与交付

以下共涉及 **8 个明确命名的文档文件**；双语文件须逐个满足要求。

| 产物 | 必须达到的内容边界 | 短原文依据 |
|---|---|---|
| `docs/mcp-tools.md` | 资源数由 10 改为 12；补 `prompt/install` zh、en 两行；`fcop_report`、`new_workspace` 各补 0.6.5 行为说明 | 「资源数 10 → 12」「各加 0.6.5 行为说明」 |
| `mcp/README.md` | 在已有 0.6.4 注释后追加一段 0.6.5 Rule 0.a.1 tripwire 说明 | 「在现有 0.6.4 注释后追加」 |
| `LETTER-TO-ADMIN.zh.md`、`LETTER-TO-ADMIN.en.md` | 两版保留对应的「0.6.4 摘要」标题，块尾追加 0.6.5 polish bullet | 「保留『0.6.4 摘要』标题」「块尾追加」 |
| 根 `README.md`、`README.zh.md` | 将旧 highlights 长段重写为版本无关的 5 行 Pointers 表、3 行 Recent releases 表；「PyPI 同名 fcop」独立为 blockquote | 「5 行 Pointers 表 + 3 行 Recent releases 表」「单独 blockquote」 |
| `CHANGELOG.md`、`docs/releases/0.6.6.md` | 前者写入 `[Unreleased]` 段；两处完整记录两个 commit 的范围、明确不做的事及验证命令 | 「完整记录两个 commit 的范围、明确不做的事、验证命令」 |

- 协议交付还包括任务记录、报告和归档；它们用于补齐此前缺失的追溯链。来源：「没写 `TASK-*.md`、没写 `REPORT-*.md`、没归档」「再补 `write_task` 落档」「后续 `write_report` 与 `archive_task`」。

## A｜动作

- 对已识别的人读文档漂移执行补齐、追加和重写，并刷新 GitHub 主线；源码中的文档随下次代码发包带出。来源：「GitHub 主线刷新，下次代码发包自动捎带」。
- 协议补登顺序为：以 `init_solo` 将仓库纳入 Solo 模式，再 `write_task` 落档，后续完成 `write_report` 和 `archive_task`。来源：「用 `init_solo` 把仓库 dogfood 化、再补 `write_task` 落档」。
- 「两次 commit + 两次 push」是此前已发生行为；本单要求追溯其范围，未要求另做两次提交或推送。来源：「直接动手编辑 + 两次 commit + 两次 push」。

## P｜参与关系

- ADMIN 为任务发起方及协议纠正反馈方；ME 为接收方、文档修复与补登责任方。来源：`sender: ADMIN`、`recipient: ME`、「ME 的应交付物」「ADMIN 第四轮明确指出」。
- 仓库从本次纠正起按 Solo 模式运行；以后 ADMIN 交办、ME 执行的工作均须遵循记录流程。来源：「从此 FCoP 仓本身按 Solo 模式跑」「以后 ADMIN 给的活，ME 走 task → do → report → archive」。
- 未指定独立复核人、最终验收人或额外审批关系；不能仅凭 ADMIN 身份补造这些职责。

## R｜资源、数量与时间

- 资源总数为 **12 = 9 静态 + 3 模板**；相较原记载 10 个，缺少的是 `fcop://prompt/install` 的 zh、en 两项。来源：「真值 12（9 静态 + 3 模板）」「漏列……zh + en」。
- 根 README **每一版**均要求 5 行 Pointers 表、3 行 Recent releases 表，且两版对应表行数一致。来源：交付物第 4 项及「两表行数一致」。
- 测试基线为 **587/587**，对齐 0.6.5。来源：「587/587 与 0.6.5 同基线」。
- `write_report` 与 `archive_task` 必须在同一 session 内完成；原文未给具体截止日期或耗时额度。来源：「在同一 session 内完成」。
- `2026-04-27` 是原会话日期，`P1` 是优先级；均不能换算为未明示的交付时限。来源：上下文日期及 `priority: P1`。

## V｜版本与依据

- 协议信封为 `fcop`、版本 `1`；追溯依据为 commit `274ce06`、commit `87e178a` 和 `docs/releases/0.6.6.md`。来源：头部 `protocol`、`version`、`references`。
- 本轮以 **0.6.6 文档级 patch** 组织说明，保留 0.6.5 软件与测试基线；不能据此升级包内版本。来源：「按 0.6.6 出文档级 patch」「不动 `_version.py`」。
- 0.6.4 摘要标记必须保留以兼容既有测试，同时补充 0.6.5 信息。来源：「避免破坏 `test_zh_contains_064_summary_marker`」。

## C｜完成、停止及升级条件

文档交付和协议补登之外，下列验收条件须**同时成立**：

| 验收对象 | 必须满足 | 短原文依据 |
|---|---|---|
| 静态检查 | `ruff check .` clean | 「`ruff check .`：clean」 |
| 测试 | `pytest tests` 达到 587/587，与 0.6.5 同基线 | 「587/587 与 0.6.5 同基线」 |
| 公共表面快照 | `tool_surface.json`、`public_surface.json` 均不变 | 「snapshot 不变」 |
| 中文信件截取 | `get_letter_intro('zh')` 同时包含「0.6.4 摘要」和「0.6.5 微调」，截取安全 | 「同时含……（slice 安全）」 |
| 旧 README 文案 | `rg "0.6.3 highlights" README*.md` 无匹配 | 「无匹配」 |
| 双语 README | 结构对齐，两个对应表的行数分别一致，并满足 O 中规定数量 | 「根 README 两版结构对齐」 |

原文未提供上述检查的实际结果，故不能判定已经验收通过；这属于结果未知，不是边界不明。未另设停止或升级触发条件。

## B｜独立禁止与限制

- 禁止改动软件包及 `_version.py`、发布或重发 PyPI、打 tag。来源：「不动包，PyPI 不重发」「不动 `_version.py`、不发 PyPI、不打 tag」。
- 两份公共表面快照不得改变；不得破坏既有摘要标记及中文 intro 截取要求。来源：C 中快照、信件验收条件及 V 中测试兼容要求。
- 后续 ADMIN 交办工作不得绕过 task → do → report → archive 流程。来源：「不再绕」。

**原文局部问题与未说明项**

- 轮次表述不一致：上下文称「两轮工作」，实际列出三项，随后又称「上面三轮会话」；第四轮反馈另有明确记载。
- 「只刷 GitHub 上的 README 和 mcp 子包源码 README」与后续明确列出的非 README 交付物存在字面范围张力；须保留全部逐项交付要求，不能据前句删去它们。
- 「5 行」「3 行」未说明是否计入表头及 Markdown 分隔行。
- 双语信件均要求保留摘要标题，但原文仅明确给出中文标记和中文测试要求，未给英文标题的精确字面值。
- 未给两个 commit 各自的详细变更范围，也未给各功能说明的完整正文；仍保留完整记录、解释功能的义务，不虚构具体内容。