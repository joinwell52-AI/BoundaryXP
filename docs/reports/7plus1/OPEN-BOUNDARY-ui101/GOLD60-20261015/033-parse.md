## I｜输入与作用域

- **审计对象**：`D:\codeflow-3` 的 FCoP 完整合规性，覆盖下述 A— I 全部检查项；`codeflow-1`、`codeflow-pwa`、`newflow-3` 仅为定位背景，不属于本次审计对象。依据：“项目实体位于 `D:\codeflow-3`”“按以下清单完整扫一遍 codeflow-3”。
- **跨项目归属**：任务 carrier 位于 `D:\FCoP`，审计产物归 FCoP 项目。依据：“本任务 carrier 落在 FCoP 仓库”“产出物归 FCoP 项目”。
- **读取范围**：codeflow 的 `TASK-*.md`、`REPORT-*.md` 只能读取文件名和 frontmatter；E 项文件合规检查同样仅限这两类信息。其余检查不因此获得读取受限正文的例外。依据：“只读文件名 + frontmatter，绝不读正文”“仅看 frontmatter 与文件名”。
- **初始事实输入**：原文提供的基线包括旧位置 `docs/agents/fcop.json`、缺少 `fcop/`、已部署 `.cursor/rules/fcop-*.mdc`、缺少 `AGENTS.md` 与 `CLAUDE.md`、岗位文件扁平、非 git repo，以及 `team=dev-team`、`leader=PM`。这些是待审计核对的已有线索，不代表完整审计结论。依据：“基线快查已暴露”“但这只是表层”。

## O｜产物与交付

- **报告名称**：`REPORT-20260513-003-ME-to-ADMIN-codeflow-cross-project-fcop-audit.md`；归属 FCoP 项目，具体落盘子目录未在原文指定。依据：“写出 `REPORT-20260513-003-ME-to-ADMIN-codeflow-cross-project-fcop-audit.md`”，归属见 I。
- **报告内容**：覆盖全部检查项，按 **P0 / P1 / P2** 分级列出全部问题；包含哑火清单，以及非 git repo 导致 tripwire 无法运行的 **P1 缺失及建议**。依据：“按 P0 / P1 / P2 分级列出全部问题”“哑火……清单”“这本身是 P1 级缺失……给出建议”。
- **证据要求**：每条结论都须附事实出处，精度为“路径 + 文件名 + 行号或字段”；允许标记 `unverified`，但不能用推测冒充事实。依据：“每条结论附事实出处”“不允许‘我以为是这样’，写‘unverified’也合法”。

## A｜动作与检查义务

以下均为要求检查的边界，不能把“检查是否存在”直接解释成“必须部署或修复”。

| 项目 | 必须检查的内容与条件 | 短原文依据 |
|---|---|---|
| A．协议部署 | 四件套是否齐全：`.cursor/rules/fcop-rules.mdc`、`fcop-protocol.mdc`、`AGENTS.md`、`CLAUDE.md`；比较项目本地 rules 与包内最新版本；从文件 mtime、`.fcop/migrations/` 推断是否调用过 `redeploy_rules()`，并保留推断性质 | “四件套……是否齐全”“P=E 漂移检测”“从文件 mtime / `.fcop/migrations/` 推断” |
| B．目录 | 检查 canonical `fcop/` 与 legacy `docs/agents/`；逐一检查 `tasks/`、`reports/`、`issues/`、`shared/`、`log/` 五桶；检查 `workspace/<slug>/` 约定使用情况 | “canonical……还是 legacy”“五桶……是否齐全”“工作区约定……是否在用” |
| C．团队文档 | 检查 Layer 0 `TEAM-README.md`（ADMIN 入口）、Layer 1 `TEAM-ROLES.md`（角色边界）、Layer 2 `TEAM-OPERATING-RULES.md`（运作规则）、Layer 3 `roles/{ROLE}.md`（单岗深度）；检查不存在 `roles/ADMIN.md` | “Layer 0”至“Layer 3”“没有 `roles/ADMIN.md`” |
| D．配置 | 检查 `mode`、`team`、`roles`、`leader` 齐全；`layer` 可选，但每个已声明值须正确，取值范围为 worker / governance / admin；角色列表不得包含 `ADMIN` | “可选，但若声明则需正确”“不含 `ADMIN` 角色” |
| E．命名与元数据 | 任务命名为 `TASK-{YYYYMMDD}-{NNN}-{sender}-to-{recipient}.md`；报告按原文“同上模式”且位于 `reports/`；问题命名为 `ISSUE-{YYYYMMDD}-{NNN}-{summary}.md`；检查 `AMEND-*`、`*-v2.md` 等幽灵命名；检查必填 `protocol`、`version`、`sender`、`recipient`；核对双方角色与配置一致、无未声明角色码或冒充 ADMIN；通过 sender/recipient pair 统计间接检查 team 模式的 leader 路由 | “报告命名 同上模式，在 `reports/`”“Rule 5 禁”“frontmatter 必填字段”“通过统计 sender/recipient pair 间接验证” |
| F．互惠回应 | 对**每条** `tasks/TASK-*.md`，检查是否有匹配的 `reports/TASK-*.md` **或** follow-up TASK；按 `thread_key` / 文件名 pair 对照；列出存在至少 7 天且无回应的任务 | “每条……是否都有匹配的……或 follow-up TASK”“存在 ≥7 天无回应” |
| G．历史完整性 | 检查同前缀同序号的重名文件，并将其作为原地修改后追加的线索；检查 `log/` 中未归档 sprint artifact | “暗示原地修改后追加”“是否有未归档的 sprint artifact” |
| H．新能力 | 检查是否出现 `REVIEW-*`；**若出现**，逐一校验 `decision` 五值枚举，以及 `subject_id`、`reviewer`、`reviewed_at` 齐全；检查 `risk_level` 使用情况；检查 `needs_human` / `human_approval` 滥用，`pending` 被明确禁止 | “若出现需校验”“`risk_level` 字段是否在使用”“`pending` 严禁” |
| I．tripwire | 说明非 git repo 导致 `fcop_check()` 的“git diff vs FCoP 账本”事后审计无法运行，并按 P1 报告、给出建议；执行替代统计，检查 `workspace/` 与开放 TASK 的对应关系 | “事后审计无法运行”“替代方案：统计……对应关系” |

以上检查不授权调用 `redeploy_rules()`、部署协议文件、初始化 git 或修复被审项目。依据：任务整体限定为“只读跨项目审计”“绝不修改”。

## P｜参与与身份关系

- **指派关系**：ADMIN 向 FCoP 项目的 `ME` 下达任务，报告接收者为 ADMIN；ME 未获 codeflow 项目任何角色。依据：`sender: ADMIN`、`recipient: ME`，以及“我是 FCoP 项目里被 ADMIN 指派的 `ME`”。
- **身份约束**：角色与身份一对一；不得自命 `codeflow.PM`、`codeflow.AUDITOR` 等身份。依据：“角色 ↔ 身份一对一”“严禁自命……冒充身份”。
- **子 agent 条件关系**：若使用子 agent，其继承调用者身份，不能借委派取得 codeflow 角色或扩大读取权限；原文没有要求必须委派。依据：“子 agent 继承呼叫者身份”，读取限制见 I。
- **被审团队关系**：team 模式下，ADMIN 与 leader 构成唯一对外接口；ADMIN 为真人，不应进入角色文件或配置角色列表。依据：“ADMIN ↔ leader 唯一对外接口”“ADMIN 是真人，不入 roles/”，配置要求见 A-D。
- **复核与接收**：原文明确报告发往 ADMIN，未另行指定独立复核者或审批流程。依据：交付文件名中的 `ME-to-ADMIN`。

## R｜资源、数量与时间

- **资源范围**：被审资源为 `D:\codeflow-3`；任务 carrier 与产物归属资源为 `D:\FCoP`。前者写入额度为 **0 个文件**，也不得修改现有文件。依据：“不在 codeflow-3 仓库下写任何文件”“绝不修改……任何文件”。
- **覆盖数量**：四件套、五桶均须逐项检查；任务互惠检查覆盖每条 TASK；出现的 REVIEW 均触发附加字段与枚举校验。依据见 A-A、A-B、A-F、A-H。
- **哑火时间边界**：`任务存在时长 ≥ 7 天 ∧ 无回应`，恰好 7 天也包含在内。原文未指定存在时长的取时字段或审计参考时点，不能据此预先计算具体清单。依据：“任务存在 ≥7 天无回应”。
- **任务属性**：优先级 `P1`、风险 `low`；创建时间为 `2026-05-13T07:20:00+08:00`。原文没有给出交付截止时间、工时或人员配额。依据：`priority`、`risk_level`、`created_at`。

## V｜版本与依据

- **完整审计基线**：`fcop@1.1.0`、rules `2.2.0`、protocol commentary `2.0.0` 的全部规则点。依据：“全部规则点过一遍”。
- **专项依据**：canonical 路径引用 Rule `2.0.0` 起的要求；四件套引用 ADR-0006；岗位结构引用 Rule 4.5（原文标注自 v1.3.0）；其他检查按原文指定的 Rule 0.a.1、0.c、1、3、4、5、6、7.5 等执行。依据：基线表及各检查项的规则参照。
- **版本比较关系**：仍须核对“项目本地 rules 版本 vs 包内最新版本”；“包内最新版本”不能未经核实就赋值为 `2.2.0`。依据：“项目本地 rules 版本 vs 包内最新版本”。
- **提交依据**：本任务若发生 commit，必须遵守 SOP v2 问题 7、提交 `b4dc1f7` 所指的 `git add` 显式路径硬约束；该条件不等于单独要求必须提交。依据：“本任务 commit 时严格遵守……显式路径硬约束”。
- **任务标识**：carrier 为 `protocol: fcop`、`version: 1`、`kind: task`，任务号 `TASK-20260513-003`；此处 `version: 1` 不应与上述包或规则版本混同。依据：原文 frontmatter。

## C｜完成、停止与升级条件

- **完成要求**：完成全部检查并形成指定名称的分级报告，每条结论具备要求的出处，同时满足只读与身份边界；如提交，再满足显式路径要求。依据：“完整扫一遍”“验收”四项。
- **审计完成不等于被审项目合规**：发现不合规是报告内容，原文没有要求修复后才可交付。依据：“分级合规报告”“列出全部问题”。
- **证据不足的处理**：允许 `unverified`；不得为补齐结论而越权读取正文。依据：“写‘unverified’也合法”，读取边界见 I。
- **已规定的异常处理**：tripwire 无法运行时，报告 P1 缺失、提出建议并进行替代统计；原文未要求因此停止整个审计。依据见 A-I。
- **其他停止或升级流程**：原文未规定额外触发条件、审批门槛或响应时限。“无需回滚”源于无副作用的只读前提。依据：“不存在副作用，无需回滚”。

## B｜独立禁止与限制及局部不确定性

**禁止与限制**

- 禁止向 codeflow-3 写入或修改任何文件，包括 FCoP 协议文件。依据：“不在 codeflow 仓库下落任何 FCoP 协议文件”“不在 codeflow-3 仓库下写任何文件”。
- 禁止冒充 codeflow 角色，禁止读取受限 TASK / REPORT 正文；子 agent 同样不能突破这些边界。依据见 I、P。
- 禁止把无证据判断写成事实；重名文件只构成“暗示”，mtime 等只支持推断，不自动证明历史行为。依据：“不允许‘我以为是这样’”“暗示”“推断”。
- 提交时禁止偏离显式路径 `git add` 约束。依据见 V。

**原文局部未定或存在张力**

| 位置 | 应保留的问题 |
|---|---|
| E、F 与验收的报告命名 | E 称报告“同上模式”，F 明列 `reports/TASK-*.md`；读取限制及交付名称又使用 `REPORT-*`。指定交付文件名明确，但被审报告应接受哪些前缀不能擅自统一。 |
| E 的角色一致性与 ADMIN 路由 | E 要求 sender/recipient 与不含 ADMIN 的配置角色一致，同时要求检查 ADMIN ↔ leader 路由。真人 ADMIN 作为合法端点的例外未明确写出；“不得冒充 ADMIN”仍是明确限制。 |
| C 的层级称谓 | 标题称“三层”，实际列出 Layer 0—3 共四层。四项文档检查均明确，不应因标题删掉其中一项。 |
| H 的枚举与禁值 | 未列出 `decision` 五个枚举值，也未明确 `pending` 分别适用于 `needs_human`、`human_approval` 的哪些值结构；不得自行补全。 |
| 分级与外部依据 | 除 tripwire 缺失明确为 P1 外，未给出完整 P0/P1/P2 分级标准；引用的协议、ADR、SOP 详细内容未随原文提供。 |
| 互惠与替代统计 | “回应”“开放 TASK”的状态判定，以及时长取时口径未详细定义；按 thread_key / 文件名 pair 对照和逐任务覆盖的要求仍然明确。 |

实际文件是否合规、哪些任务无回应、哪些 REVIEW 存在，属于后续审计结果未知，不属于任务边界本身不明。