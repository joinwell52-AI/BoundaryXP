## I｜输入与作用域

- 任务为 `TASK-20260509-012`：改造 `Project()` 的工作区路径，将全部硬编码 `docs/agents/` 路径改为可配置并自动探测。来源：“hard-coded `docs/agents/` 路径全部改造为可配置 + 自动 detect”。
- 范围涵盖 ADR-0022 的 `Decision §1`、`启动时 detect 行为`、`Tests Checklist` 中所有 deferred 项；明确排除 `MIGRATION-1.0.md`，归 TASK-013。来源：“所有 deferred 项（`MIGRATION-1.0.md` 除外，那是 TASK-013）”。
- 输入依据包括 ADR、`src/fcop/project.py`、`mcp/src/fcop_mcp/server.py` 及指定工作区测试文件。来源：原文 `references`。
- 去除 `1.0.0.md` 的 DRAFT 标记及 final tag 仅作为后续背景出现，不能据此视为本任务交付义务。来源：“Phase 2 完成后……仅余文档级工作”。

## O｜产物与交付

| 产物 | 要求及短引文 |
|---|---|
| 核心实现 | `src/fcop/project.py` 包括构造函数、`_resolve_workspace_root`、路径 properties、动态 ledger prefix。来源：“`__init__` + `_resolve_workspace_root` + 路径 properties + ledger prefix dynamic” |
| MCP 实现 | `mcp/src/fcop_mcp/server.py` 动态生成 init reply 的 LETTER 路径。来源：“init reply LETTER 路径动态化” |
| 新增测试 | `tests/test_fcop/test_project_workspace_dir.py`，原文交付记录为 15 用例；覆盖范围见 C。来源：“新建 15 用例” |
| 既有测试调整 | 9 个 fcop 测试文件及 `mcp test_server.py`，原文记录共 53 处期望替换。来源：“9 fcop test 文件 + mcp test_server.py — 53 处期望 swap” |
| 公共接口快照 | `tests/test_fcop/snapshots/public_surface.json` 新增字段。来源：“新增字段” |
| 文档交付 | 本 TASK 文档、REPORT、ADR sign-off、CHANGELOG 的 `[Unreleased]` 记录。来源：“R4：本 TASK 文档 + REPORT + ADR sign-off + CHANGELOG `[Unreleased]`” |

R1、R2、R3 的合并提交被原文记录为 `861713b`；这是已有交付声明，不是要求另行生成相同 hash。来源：“R1+R2+R3 合并 commit：`861713b`”。

## A｜动作与行为

| 条件或对象 | 必须满足的行为 | 短原文引文 |
|---|---|---|
| `Project.__init__` | 接受 `workspace_dir=` 关键字参数 | “接受 `workspace_dir=` kwarg” |
| 自动探测 | 覆盖仅 `fcop/`、仅 `docs/agents/`、双存在、双不存在四种场景，并遵循 ADR | “4 种 detect 场景……行为符合 ADR-0022” |
| 自动探测仅有 `docs/agents/` | 发出 `DeprecationWarning`，不抛出异常 | “打 `DeprecationWarning`，不 raise” |
| 自动探测双存在 | 以 `ConfigError` 中止 | “双存在时 `ConfigError` ABORT” |
| 显式 override | 接受相对路径及绝对路径，永不告警 | “显式 override 永不 warn，relative 与 absolute 路径都接受” |
| 8 个公开路径 properties | 每一个都由 `self._workspace_root` 派生 | “8 个……全部 derive from `self._workspace_root`” |
| LETTER 文件与 MCP 回复 | 动态确定文件落盘路径，且回复路径必须与实际位置一致 | “落盘路径动态化”；“与文件实际位置一致” |
| ADR 与 CHANGELOG | 标记 Phase 2 完成，附提交 hash 和测试覆盖证据；在 `[Unreleased]` 记录变更 | 验收标准 11、12 |

显式 override 的“不告警”是独立保证；不能将旧目录自动探测时的告警要求套用到显式 override。

## P｜参与关系

- 任务发送方为 ADMIN，接收方为 ME；ADMIN 发出继续推进的指令。来源：`sender: "ADMIN"`、`recipient: "ME"`；“ADMIN 命令‘继续推进’”。
- 原文将交付分为 R1+R2+R3 合并提交及 R4 文档交付，但未定义这些编号对应的人员或具体分工。来源：“R1+R2+R3 合并 commit”；“R4”。
- 要求 ADR sign-off，但未指定签署人、独立复核人或最终验收人。来源：“ADR sign-off”。

## R｜数量、资源与时间

- 时间盒为 D0，即 **2026-05-09 单日完成 Phase 2**；未给具体截止时刻。来源：“D0（2026-05-09）单日完成 Phase 2”。
- 优先级为 P1。来源：`priority: "P1"`。
- 明确数量约束或交付记录包括：4 种探测场景、8 个公开路径 properties、15 个新增用例、**10 个既有测试文件**中的 53 处期望替换；10 来自 9 个 fcop 文件加 1 个 MCP 文件。来源：A、O 所引条目。
- “30+ 处路径”“600+ 既有测试可能撞红”是规模与风险描述，不是允许失败数量或额外配额。来源：优先级理由。

## V｜版本与依据

- 行为依据为 ADR-0022 指定章节；实施背景为 `v1.0.0-rc.1` 已发布、Phase 1 迁移 CLI 已落地，本任务推进 Phase 2。来源：“Phase 1……随 RC 落地”；“进入 RC → final 倒计时窗口”。
- 协议元数据为 `protocol: fcop`、`version: 1`、`fcop_version: "1.0.0rc1"`；会话为 `main-2026-05-09`。来源：原文头部。
- 代码交付版本声明为 `861713b`；ADR 完成记录还必须包含 commit hash 与测试覆盖证据。来源：O、A 所引条目。
- 既有失败例外以 **RC 之前已经存在** 为时间基线。来源：“RC 之前已存在的 1 个 pre-existing fail”。

## C｜完成、停止与升级条件

- 完成须同时满足 A 中各项行为要求、O 中文档与代码交付要求，以及以下测试条件，不能仅凭提交存在判定完成。
- 既有测试套应全部通过，仅接受 RC 之前已存在的 **1 个**失败；不能用新增失败替代该例外。来源：“既有测试套全部通过（接受……1 个 pre-existing fail）”。
- 新增测试须覆盖全部七类内容：四种 detect 场景、显式 override、路径派生不变量、`is_initialized` 作用域、自定义 workspace 下端到端 init。这里四种 detect 合为一类，另四项，共五类覆盖主题；要求以原文列项为准。来源：“覆盖 4 detect + explicit override + path derivation invariant + is_initialized scoping + end-to-end init under custom workspace”。
- 自动探测双目录存在时，运行行为必须中止；原文未规定因此停止整个工程任务或向谁升级。来源：“`ConfigError` ABORT”。
- 元数据声明 `status: "done"`，但所给材料未包含测试运行结果或提交内容，不能据此独立核实验收已满足。来源：`status: "done"`。

## B｜独立限制与原文缺口

- 不得将 `MIGRATION-1.0.md` 纳入本任务；不得在仅旧目录自动探测时抛异常；不得在显式 override 时告警；不得接受例外之外的测试失败。来源分别见 I、A、C。
- **ADR 内容未提供**：无法完整展开 deferred 清单，也无法确定仅 `fcop/`、双不存在时的完整行为，以及路径解析等细节；明确的 ADR 遵循义务仍保留。来源：“行为符合 ADR-0022”及范围章节。
- **override 与双存在的关系未完全展开**：原文明示 override 永不告警，但未直接说明显式 override 遇到两个默认目录同时存在时是否绕过 `ConfigError`；须依据缺失的 ADR 确认。
- **对象身份不完整**：未列出 8 个公开属性名称、9 个 fcop 测试文件名、快照新增字段、既有失败用例身份，也未给 REPORT 路径及 sign-off 流程。对应数量、覆盖、交付义务仍成立，不能自行补造。