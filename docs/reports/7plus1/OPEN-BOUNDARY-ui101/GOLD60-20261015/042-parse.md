## I｜输入与作用域

- **任务身份与关系**：`TASK-20260513-012`，ADMIN → ME，优先级 P0、风险 medium；父任务为 `TASK-20260513-011`，关联 TASK-010、TASK-011、REPORT-011；线程 `release-sync-discipline`，会话 `sess-20260513-me-04`。（引文：`sender: ADMIN`、`recipient: ME`、`parent`、`related` 等头字段）
- **目标与持续范围**：将 REPORT-011 的反思转为本仓面向所有未来发版的永久文档同步纪律；本次落实 checklist，不执行未来发版。（引文：“升格为面向所有未来发版的程序性约束”“本次先把 checklist 落到位”）
- **输入依据**：ADMIN 于 2026-05-13 21:55 +08:00 的原话、现有 v1.6.0 起的 SOP、§C L84–L106，以及过去两次发版的漏项记录。五处漏项必须被覆盖：`README.zh.md`、`mcp/README.md`、`docs/index.html`、`essays/README.md`、`CITATION.cff`。（引文：“各处的文档，一定要同步”“漏列 5 处”）

## O｜产物与交付

| 产物 | 必须满足的边界 | 短原文依据 |
|---|---|---|
| `docs/release-process.md` §C | 标题改为 `C. 文档层 / Docs — 全部同步,PyPI 不可补发`；首段增加突出警告框，说明 `mcp/README.md` 是 PyPI long_description、发版即永久定格、unique-per-version 与 Rule 7 不可回滚的关系 | “标题改为”“第一段加突出框” |
| §C.1 Visible-on-the-web | 覆盖 `README.md`、`README.zh.md`、`mcp/README.md`（PyPI 锁版，标红）、`docs/index.html`（GitHub Pages）、`essays/README.md`（若加 essay）、`CITATION.cff`（若需要） | “C.1 · Visible-on-the-web 类” |
| §C.2 Agent-touch | 覆盖 `letter-to-admin.zh.md`、`letter-to-admin.en.md`、`fcop-rules.mdc` 协议版、`fcop-protocol.mdc` 协议解释版、`CHANGELOG.md` 新版块 | “agent 部署后会读到” |
| §C.3 Hardcoded 断言 | 保留原 SOP 的“3 处 hardcoded 字符串”，增加 ADR `Status: Accepted` 检查及 `docs/MIGRATION-*.md`（若本版改了迁移路径） | “原 SOP…… + ADR……检查 / `docs/MIGRATION-*.md`” |
| `docs/release-process.md` §G | 新增 `发版前文档同步扫描 / Pre-Release Documentation Sync Audit`，位于 §F Rule 0.a.1 Carrier 之后、§Release Steps 之前；放入三条扫描命令清单，具体范围见 A | “在 §F……之后、§Release Steps 之前插入” |
| `fcop/shared/RULES-release-sync-checklist.md` | 新建；顶部放 ADMIN 原话作为“协议级红线引文”，其后只放指向 SOP §C / §G 的指针，供后续 agent 巡检发现 | “钉在文件顶部，然后只放指针” |
| `REPORT-20260513-012` | 编写并 archive；末尾按 Rule 0.c 直话记录：REPORT-011 反思被 ADMIN 升格为永久规则，同时说明这是“落真话”的兑现与“下次怎么不再翻车”的落地 | “末尾必须按 Rule 0.c 直话记一笔” |
| 仓库交付 | 完成 commit，并 push 至 `origin/main` | “commit + push origin/main” |

以上文档清单是 **SOP 必须覆盖的对象**，不构成本次修改这些被列文件的授权；本次允许改动的文件集合见 B。

## A｜动作

- **必须实施**：修改 SOP 标题、警告及三段 checklist，插入 §G，创建纪律书，完成提交、推送、报告与归档。（引文：“改动计划”“验收标准”）
- **§G 必须承载的扫描入口**：

  | 扫描 | 原文规定的范围与内容 | 短原文依据 |
  |---|---|---|
  | 旧版号扫描 | `rg --hidden`，排除 `.git`、`fcop/log`、`*.lock`，匹配 `\b1\.6\.0\b` | “扫所有面向公众文档里是否还含上一版号” |
  | 包元数据检查 | 使用 `py -3.10` 与 `importlib.metadata`，输出 `fcop`、`fcop-mcp` 的安装版本供对齐检查 | “扫 fcop/fcop-mcp 包元数据里是否对齐” |
  | 三份 README 扫描 | 限定 `README.md`、`README.zh.md`、`mcp/README.md`，匹配 `Current release:` 后的旧版号及 `v1.6.0` | “扫 PyPI 上一版本号有没有意外残留在 README × 3” |

- **条件修正义务**：扫描命中旧版号，立即修复；零命中才按原文判为通过。“立即”不换算为数值期限。（引文：“grep 命中 = 漏了，立即修；0 命中 = 通过”）
- 本次明确要求的是**将扫描命令清单写入 SOP**；原文未单列本次运行这些命令的验收义务。（引文：“扫描命令清单到位”）

## P｜参与关系

- **ADMIN** 是指令来源，**ME** 是本任务接收方；后续发版 agent 是永久纪律的适用者与纪律书的发现者。（引文：`sender: ADMIN`、`recipient: ME`；“下一次发版的 agent……巡检”）
- **ADMIN 二次确认**适用于未来涉及 Rule 7 的破坏性／不可回滚操作；原文明示 PyPI 锁版属于该范围。该关系不等于本任务已获发版授权。（引文：“必走 ADMIN 二次确认”“PyPI 锁版本身就属于 Rule 7 适用范围”）
- 原文未另行指定独立复核人、验收签收人或报告接收人；不能由 ME 的接收身份推定这些角色。

## R｜资源、数量与时间

- **改动额度**：两份目标文件，加本 TASK 与配套 REPORT；限制作用于累计改动范围。（引文：“改动只在上述 2 个文件 + 本 TASK + 配套 REPORT 内”）
- **结构数量**：§C 必须有三个子段；验收另要求 **12 项 checkbox**，但与详细列举存在局部冲突，见下文。（引文：“§C 三段拆完，12 项 checkbox 齐”）
- **扫描时长定位**：§G 是“30 秒‘扫一眼’”的命令清单；原文未给整个任务的截止时间，也未明确 30 秒是否为运行硬上限。（引文：“插入一个 30 秒‘扫一眼’命令清单”）
- **生效范围**：纪律面向所有未来发版，没有给终止日期。（引文：“永久规则”“所有未来发版”）

## V｜版本与依据

- **唯一权威源**为 `docs/release-process.md`；纪律书仅保留原话与指针，避免规则在两处独立维护。（引文：“单文件，SOP 权威源”“避免两处冗余、避免漂移”）
- **既有规则关联**：PyPI 不可补发警告关联 Rule 7；§G 的插入位置关联 §F Rule 0.a.1 Carrier；报告末尾关联 Rule 0.c；本次不新增协议规则。（引文：“Rule 7 已经覆盖”“不需要新规则”）
- **版本参数**：给定扫描命令将 `1.6.0` 当作上一版号；本次目标发布版本未给定。永久规则后续如何更新扫描参数，原文未明确。（引文：“上一版号”“`\\b1\\.6\\.0\\b`”）

## C｜完成、停止与升级条件

- **完成必须合取满足**：§C 三段、要求的 checkbox 数量与警告框，§G 命令清单，新纪律书，引文与指针，改动范围合规，commit 与 push，REPORT 与 archive，以及报告末尾的 Rule 0.c 记录。单项完成不能替代其余项。（引文：“验收标准”；“末尾必须”）
- **扫描通过条件**采用 A 中的命中判定；本次尚未知的扫描结果不是边界不明。
- **后续另立任务**：自动化 lint 属于下一阶段，不以本任务顺带实现。（引文：“这是更大工作，另立 TASK”）
- **不可回滚操作的确认前提**见 P；原文没有另设本任务的停止或失败升级流程。

## B｜独立禁止与限制

- 禁止越出“两份目标文件 + 本 TASK + 配套 REPORT”的修改范围。（引文：“改动只在……”）
- 本次不实现 `scripts/check_release_docs.py`，不承接 SOP §Automation Roadmap 的四项 TODO。（引文：“不在本任务范围”“自动化是下一阶段”）
- 本次不修改 `fcop-rules.mdc`、`fcop-protocol.mdc`；它们仍须被纳入 SOP 的未来发版检查清单。（引文：“改 FCoP 协议本身……不在本任务范围”）
- 纪律书除顶部引文外只放指针，不复制完整 checklist。（引文：“然后只放指针”）
- 未来发版前不得遗漏文档同步，尤其须在 PyPI 锁版之前处理 `mcp/README.md`。（引文：“发版前不要遗漏，因为 PYPI 不能补发”）

## 原文局部未定与冲突

1. **12 项与详细列举不一致**：C.1 有 6 项，C.2 有 5 项；C.3 若将“3 处 hardcoded 字符串”合为一项，再加 ADR、迁移文档，则共 **6 + 5 + 3 = 14 项**；若三处分别计数，则为 **16 项**。原文同时要求“当前 7 项 + 新增 5 项”和“12 项 checkbox 齐”，未说明合并口径。不能为凑 12 项删掉列明对象。
2. **扫描口径与命令范围不完全一致**：文字指“面向公众文档”，第一条命令却未按文档限定范围；“任何旧版本号命中即漏项”也未给历史记录、合法旧版引用设置例外。后续如何适用需明确，不能自行添加豁免。
3. **元数据通过判据缺失**：命令仅打印两个包的版本；“对齐”没有明确是两个包彼此相等，还是都等于目标发布版本。目标版本也未提供。
4. **条件项判据不完整**：`essays/README.md` 与迁移文档分别有“若加 essay”“若本版改了迁移路径”的明确触发条件；`CITATION.cff` 的“若需要”未定义，盘点仅补充“一般不动但 v2 须扫”。ADR `Status: Accepted` 检查的对象集合及具体通过标准未给定。
5. **引用材料与归档位置未展开**：原 SOP 三处 hardcoded 字符串的具体位置、相关 TASK／REPORT 全文均不在数据内；archive 的目的地、对象细节及 TASK／REPORT 文件路径未说明。若归档会触及允许集合之外的文件，其与改动范围限制的关系亦未明确。