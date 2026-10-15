## I｜输入与作用域

- 面向 **0.7.x → 1.0** 升级用户编写完整迁移指南，包含企业用户与下游集成方的使用背景。依据：“写一份 0.7.x → 1.0 完整迁移指南”“尤其是企业用户与下游集成方（CodeFlow / Bridgeflow）”。
- 以已落地的 CLI 与 Project `workspace_dir` 改造为背景，完成 ADR-0022 的用户文档收尾；本任务未要求重新实施这两项改造。依据：“Phase 1（CLI）+ Phase 2（Project workspace_dir 改造）已落地（TASK-008 + TASK-012）”“用户向迁移指南是 ADR-0022 收尾”。

## O｜产物与交付

主产物为 `docs/MIGRATION-1.0.md`，必须存在并覆盖以下全部内容：

| 必需内容 | 原文依据 |
|---|---|
| “Workspace 迁移”段，说明目录变化、3 个选项及自动 detect 矩阵，并含命令与风险说明 | “workspace 目录变化（最大 breaking）+ 3 个选项 + 自动 detect 矩阵”；“‘Workspace 迁移’段（含命令 + 风险说明）” |
| escape hatch 的完整说明，保留具体配置 `workspace_dir="docs/agents"` | “提供 escape hatch（`workspace_dir="docs/agents"`）的完整说明” |
| `fcop migrate-workspace` 命令及 dry-run、`--apply`、风险说明 | “列出 `fcop migrate-workspace` 命令 + dry-run / `--apply` / 风险” |
| 协议 framing 从“规则”到“协议层”的升级 | “协议 framing 升级（‘规则’→‘协议层’）” |
| REVIEW、Failure、Boundary、Event 四个新抽象 | “4 个新抽象（REVIEW / Failure / Boundary / Event）—— additive” |
| 面向工具编写者的 JSON Schema 形式化说明 | “JSON Schema 形式化（给写工具的人）” |
| 至少 5 项常见踩坑 | “5+ 常见踩坑” |
| 估时表与进一步阅读链接 | “估时表 + 进一步阅读链接” |
| 分别区分协议 framing、workspace、4 新抽象三条轴；其 breaking 定性问题见 V | “区分……3 条独立 breaking 轴” |

配套交付全部必需：

- `README.md`、`README.zh.md` **各自在头部**增加指向新指南的 callout。依据：“README.md / README.zh.md 头部加 callout 指向新指南”。
- ADR-0022 的 **Tests Checklist 与 Sign-off 两处**标记完成。依据：“ADR-0022 Tests Checklist + Sign-off 标记完成”。
- CHANGELOG 的 `[Unreleased]` 段记录本次变更。依据：“CHANGELOG `[Unreleased]` 段记录本次变更”。

## A｜动作

- 编写迁移指南，并完成上述 README 引导、ADR 完成标记及 CHANGELOG 记录；这些是组合交付义务，不能仅交指南代替其余修改。依据：“写一份……完整迁移指南”及验收标准 1—8。
- 对迁移命令的要求是**列出并说明**，原文没有要求实际运行迁移、执行 `--apply` 或改变用户 workspace。依据：“列出……命令 + dry-run / `--apply` / 风险”。

## P｜参与关系

- ADMIN 向 ME 下达任务；未指定额外执行者、独立复核者、验收接收者或 Sign-off 签署人。依据：`sender: "ADMIN"`、`recipient: "ME"`；“Sign-off 标记完成”未进一步指定人员。
- 指南面向升级用户，其中 JSON Schema 内容特别面向工具编写者；CodeFlow / Bridgeflow 是下游集成方背景，不是被指派的执行或审批主体。依据：“用户向迁移指南”“给写工具的人”“下游集成方（CodeFlow / Bridgeflow）”。

## R｜资源、数量与时间

- 数量边界：**3 个 workspace 选项、4 个指定新抽象、至少 5 项踩坑、3 条需区分的轴、2 份 README 各一处头部引导**。依据：O 中对应引文；“5+”表示下限为 5。
- 时间要求同时成立：**D0（2026-05-09）内、单 session 完成，并在 final tag 之前落地**。final tag 的具体时间未给出，不自行换算。依据：“D0（2026-05-09），单 session 完成”“final tag 之前必须落地”。
- 优先级为 P1；未给出工时或费用额度。指南中的“估时表”是交付内容，不是本任务的执行工时预算。依据：`priority: "P1"`；“估时表 + 进一步阅读链接”。

## V｜版本与依据

- 迁移版本范围为 **0.7.x → 1.0**；体例参考 `docs/MIGRATION-0.6.md`，Workspace 段满足 ADR-0022 §“Tests Checklist”。依据：“参考 `docs/MIGRATION-0.6.md` 的体例”；“涵盖 ADR-0022 §‘Tests Checklist’要求”。
- 列明的参考文件还包括 `docs/releases/1.0.0-rc.1.md`。其正文未提供，不能据此补造版本细节。依据：`references` 三项。
- 任务消息自身的 `version: 1`、`fcop_version: "1.0.0rc1"` 属于消息元数据，不替代明确的迁移版本范围。依据：消息头及“0.7.x → 1.0”。
- **局部表述不一致：**范围将四个新抽象定为“additive”，验收标准却将其纳入“3 条独立 breaking 轴”。应保留“四抽象均需介绍”和“三轴需区分”两项明确要求，但不能擅自裁定四抽象是否造成不兼容。“唯一的物理 breaking”仅限定物理层面，不等于否认其他类别的变化。依据：“—— additive”“3 条独立 breaking 轴”“唯一的物理 breaking”。
- **内容尚未提供：**3 个选项的完整清单、detect 矩阵具体规则及迁移风险细节未在本原文展开；明确给出的配置仅有 escape hatch。应由所列依据支持，不自行编造。依据：“3 个选项 + 自动 detect 矩阵”“风险”。

## C｜完成、停止与升级条件

- 完成边界为：范围内全部内容与八项验收要求共同满足，并遵守 R 的时间要求；不是八项任选其一。依据：“完整迁移指南，覆盖”“验收标准”及“时间盒”。
- 消息头虽为 `status: "done"`，但未附文件内容、检查结果或签署证据；仅凭该状态不能核实上述验收均已达成。依据：`status: "done"`。
- 原文没有另设停止条件、失败处理或升级路径；不能自行指定审批机制。依据：全文仅列范围、验收、优先级理由与时间盒。

## B｜独立禁止与限制

- 原文没有额外明确的禁止条款；明确限制已体现于指定交付位置、内容、版本范围和时间要求。
- 未说明的事项不构成授权：实际迁移 workspace、发布 final tag、代替未指定人员签署，均不能由“列出命令”“final tag 之前”“Sign-off 标记完成”直接推出。对应动作与参与边界见 A、P、R。