## I｜输入与作用域

- **任务定位**：ADMIN 发给 ME 的 P0 任务，当前交付是回应 Issue #2、形成协议 charter 与 roadmap，以及报告、归档和提交；后续实现与两次正式发版不属于本 TASK 的实现范围。来源：“priority: P0”“这份 TASK 的可交付物”“只产出文档与 roadmap”。
- **仓库边界**：本地工作限定在 `D:\FCoP`；CodeFlow 仓 `D:\Bridgeflow` / `joinwell52-AI/codeflow-pwa` 是下游及设计依据。另有明确授权的外部产物：FCoP Issue #2 上的 comment。来源：“本 TASK 完全在 `D:\FCoP` 仓内发生”“在 Issue #2 留方向回复 comment”。
- **覆盖对象**：Agent、Task、Review、Session、Skill 全部 5 类 schema，以及下表中的 5 项治理字段，不能将路线图缩成只加字段。来源：“整套 5 类 schema 升级……不只是 5 个字段”。
- **现状基线**：按原文记载，当前包为 `0.7.2`；没有 Review schema、JSON Schema 文件及 `REVIEW-*.md` 类型；现有 `schema.py` 为 dataclass 加手写校验，`Report.status` 为 `done | blocked | in_progress`。Issue 假定已有的 `Review.decision: approve/reject` 枚举并不存在。来源：“关键发现”第 2—5 条。以上为原文提供的现状，非本次独立核验结果。

## O｜产物与交付

| 产物 | 必须包含或满足的边界 | 短引文 |
|---|---|---|
| Issue #2 方向 comment | ME 发布；包含现状差异表、Plan B、8 ADR 大纲、时间预期及引用 CodeFlow §3.3.1.b 的 5 步流程承诺；说明字段在 `1.1.0` 落地、此前先做 `1.0.0` freeze | “现状对账……Plan B 路径 + 8 ADR 大纲表 + 时间预期 + 5 步流程承诺” |
| `adr/ADR-0007-fcop-1.0-protocol-freeze-charter.md` | 严格按指定模板组织：Status / Date / Deciders / Related；Context 含背景对账；Decision 含 Plan B 与 8 ADR roadmap；Design Details 含每个 ADR 边界和依赖图；Non-Goals；A/C/D/E 四方案及否决理由；Positive/Negative/Neutral Consequences；Timeline | “严格走 `adr/README.md` 模板” |
| ADR-0007 的跨仓契约 | 明写 FCoP 是 spec 权威，给出 5 步流程图，全文引用 CodeFlow §3.3.1.b，包含“FCoP 评审通过 → CodeFlow mirror”关系 | “必须明写‘FCoP 是 spec 权威’+ 5 步流程图”“直接引……全文” |
| `adr/README.md` | 索引表新增 ADR-0007 一行；未明确要求同步索引全部草稿 | “索引表加这一行” |
| ADR-0008..0014 | **7 份**独立草稿文件，路径形态 `adr/ADR-NNNN-*.md`；各为 `Status: Proposed`，含 Context、Decision 一句话、Design Details 关键 bullet、Tests 清单、兼容性说明 | “每个 ADR 各自起一份”“只写……” |
| release-notes 大纲 | **1 份**同时覆盖 `1.0`、`1.1` 两次发版，风格对位 `docs/releases/0.7.2.md`；具体文件名未指定 | “1 份覆盖 1.0/1.1 两次发版的 release-notes 大纲” |
| `REPORT-20260509-001-ME-to-ADMIN.md` | 完整自查、任务完成勾选清单、git commit 链；“四步”的计数问题见 C | “完整自查……四步全部勾掉的清单 + git commit 链” |
| 旧任务归档 | 将 `docs/agents/tasks/TASK-20260428-001-ADMIN-to-ME.md` 归档至 `docs/agents/log/tasks/`，附指定原因 | “归档原因：内容已落地为 tetris/snake 教程 + Essay 06，无悬挂工作” |
| 仓库交付 | 所有本任务仓库改动 commit 并 push 到 `main`；无需 PR | “全部 commit + push 到 main”“无需 PR” |

## A｜动作及逐 ADR 边界

当前动作顺序为：**先发布方向 comment → 写 ADR-0007 并更新索引 → 切 Plan 模式细化 ADR-0008..0014**。报告、归档、commit 与 push 也是独立交付义务，原文未另定其完整先后顺序。来源：“三件事都做”“先在 Issue #2 留方向 comment”“三步执行计划”。

下表是本次文档必须表达的未来落地范围，**不构成本次实现代码授权**：

| ADR | 目标版本 | 必须保留的对象、约束与关系 | 短引文 |
|---|---|---|---|
| 0007 | `1.0.0` | Protocol Freeze Charter 与 roadmap；覆盖全部 8 ADR 的边界及依赖 | “charter + roadmap”“每个 ADR 的边界 + 依赖图” |
| 0008 | `1.0.0` | 5 份 `spec/schemas/{agent,task,review,session,skill}.schema.json`，`tests/test_schemas/`，`jsonschema` 依赖及库验证；必须确定 schema 与 dataclass 谁是真相源 | “`1.0.0` 就上”“必须定一个‘谁是 single source of truth’” |
| 0009 | `1.0.0` | `REVIEW-*` 与 TASK / REPORT / ISSUE 并列；扩展 `core/filename.py`，新增 `models.Review`、`Project.write_review`、REVIEW frontmatter parser；REVIEW 是审 TASK、REPORT、role-switch 的独立事件 | “新建 `REVIEW-*.md` 文件类型”“REVIEW 是……独立事件” |
| 0010 | `1.1.0` | `Agent.layer` 对应 `TeamConfig.roles[i].layer`；取值 `worker | governance | admin`，带校验，默认 `worker` | “校验 + 默认 worker” |
| 0011 | `1.1.0` | `Task.risk_level` 取值 `low | medium | high | irreversible`；加入 `TaskFrontmatter._KNOWN_KEYS`，默认 `medium` | “`_KNOWN_KEYS` 加 + 默认 medium” |
| 0012 | `1.1.0` | Review decision 枚举扩展 `needs_human`，并扩展 Reviewer 接口 | “Review schema 加 enum + Reviewer 接口扩展” |
| 0013 | `1.1.0` | `Review.human_approval` 子对象、`Project.mark_human_approved()` API 及校验；每个 approver 都必须为 `layer: admin` | “approver 必须是 `layer: admin`” |
| 0014 | `1.1.0` | `Skill.tools[]` 风险元数据，覆盖 Skill schema、`_data/skills/` 模板及 Skill loader | “`spec/schemas/skill.schema.json` + `_data/skills/` 模板 + Skill loader” |

其中，ADR-0008 **必须作出真相源选择**；原文仅“建议 schema.json 是真相”，生成 dataclass 或以对照测试 enforce 也属于建议方案，不能解释为已定实现。

## P｜参与关系

- **ADMIN 决策，ME 执行并报告**：ADMIN 已认可 Plan B、REVIEW 新文件类型、`1.0.0` 上 JSON Schema、三件事全做及 8 ADR 大纲；细节留给后续 Plan。报告接收人为 ADMIN。来源：“ADMIN……明确选定”“ADMIN 已认可，细节由 Plan 模式后续补完”。
- **FCoP 与 CodeFlow**：FCoP 是协议权威及演进先发生的仓库；CodeFlow 在 FCoP 评审通过后 mirror，`1.0` freeze 后 TS 端要 mirror schema。来源：“协议任何演进必须先在本仓发生，CodeFlow 后镜像”“FCoP 评审通过 → CodeFlow mirror”。
- **worker 与 governance**：`Report.status` 是 worker 对“我做完没”的自报；`Review.decision` 是 governance 审 worker 的“我审过了”。ADR-0009 必须明确切割这两个语义。来源：“两者各管一段”“ADR-0009 必须明写边界”。
- **人工审批资格**：`layer: admin` 是 approver 的必要条件，不等于所有 admin 自动成为审批人，也未规定每次 Review 都必须人工审批。来源：ADR-0013“approver 必须是 `layer: admin`”。
- **后续审阅与实施**：7 份草稿均待单独评审；实现留给每个 ADR 各自的 TASK + PR。本 TASK 的“无需 PR”不覆盖后续实现。来源：“待后续单独评审”“后续每个 ADR 单独的 TASK + PR”。

## R｜资源、数量与时间

- **版本与时间范围**：路线是 `0.7.2 → 1.0.0 freeze → 1.1.0 加 5 字段`，共两次发版，时间预期 **4—5 周**；未给明确起算点、各版日期或当前文档 TASK 的独立截止日。来源：“分两次发版，4-5 周”。
- **逐份限制**：ADR-0008..0014 每份草稿 **≤80 行**；7 份合计最多 **560 行**，但合计不超限不能替代逐份不超限。ADR-0007 不在这项草稿限额内。来源：“步骤 3 严格控制为‘草稿大纲’（每份 ≤80 行）”。
- **发布工具边界**：Issue comment 使用 `gh issue comment 2 --body-file ...`，body 用 HEREDOC 写入文件后提交。来源：“body 用 HEREDOC 走文件”。
- 原文未指定其他预算、工时、人员配额或工具额度，不据此推导额外授权。

## V｜版本与依据

- **决策依据**：2026-05-09 ADMIN 锁定的决议；协议消息头为 `protocol: fcop`、`version: 1`，此处消息版本与包版本、发版目标分别保留。来源：“ADMIN 决议（2026-05-09 聊天对话锁定）”及消息头。
- **下游依据**：Issue #2；CodeFlow 设计文档 §3、§0.9.1、§0.9.4、§1.3、§3.3.1.b、§8.0；JSON Schema 对应 §3.1 原则 #1，仓库演进规则对应 §3.3.1.b 与 §8.0 硬规则 #4/#5。来源：“ME 已读完……”及“与 CodeFlow §8.0 硬规则的对齐”。
- **本仓依据**：`adr/README`、ADR-0001..0006、`spec/fcop-spec-v1.0.3.md`、`src/fcop/`、`mcp/`、`docs/releases/0.7.2.md`、`CHANGELOG.md`。模板与发版大纲风格分别受 O 中指定文件约束。来源：“探索报告……”。
- **资料缺口**：提供的数据未包含 §3.3.1.b 全文、ADR 模板全文、A/C/D/E 的具体内容及否决理由；可以明确引用和写作义务，不能补造这些内容。来源：“直接引……全文”“A/C/D/E 4 个备选 + 否决理由”。

## C｜完成、状态与待澄清处

- **完成需合并检查全部要求**：O 中所有产物、逐份内容与状态、归档以及 commit/push 均须满足；release-notes 大纲虽未重复出现在验收勾选项中，仍是步骤 3 的明确义务。来源：“输出格式……+ 1 份……release-notes 大纲”“验收标准”。
- **Issue 关闭条件**：本 TASK 不关闭 Issue #2；只有 5 个字段**全部进入 `1.1.0` 之后**才可关闭。当前文档交付完成不满足该条件。来源：“不关闭 Issue（5 个字段全部进 1.1.0 之后再关）”。
- **ADR-0007 状态指令存在局部冲突**：步骤 2 要求“起手 `Proposed`；本 TASK closed 后改 `Accepted`”；验收要求“直接 `Accepted`；不走 Proposed→Accepted 两次提交”。最终要求 `Accepted` 明确，但初始状态和转换时点互不一致，不能同时作为单一路径执行。
- **步骤数量不一致**：主体明确列出“三步执行计划”，报告却要求“四步全部勾掉”；第四步没有定义。报告与其他明确义务仍成立，不能自行补造第四步。
- 原文没有另行规定阻塞升级流程或停止阈值；未来评审结果、真相源选择及具体排期尚未确定，本身不构成原文矛盾。

## B｜独立禁止与限制

- **禁止本 TASK 编写 Python 或其他实现代码**；步骤 3 只写可视化 roadmap 和草稿大纲，不写正文、不展开实现细节。来源：“本 TASK 不动 Python 实现”“任何实现代码留给后续 TASK”“不写正文”。
- **禁止在 CodeFlow 仓修改 schema，禁止绕过 FCoP 先行演进及评审再 mirror 的关系**。来源：“不在 CodeFlow 仓动 schema”“协议演进唯一合法仓库 = `D:\FCoP`”。
- **不得混同 Report 与 Review 的职责**；不得放任 JSON Schema 与 dataclass 双源漂移，必须在 ADR-0008 明确真相源。来源：“语义切割”“避免 schema.json 和 `core/schema.py` 漂移”。
- **不得提前关闭 Issue**，逐份草稿不得超过 80 行；分别按 C、R 的来源与作用域判断。