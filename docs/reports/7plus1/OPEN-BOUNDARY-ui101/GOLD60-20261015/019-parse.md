**I｜输入与作用域**

- 本任务为 `TASK-20260509-008-ADMIN-to-ME`，范围是 ADR-0022 Phase 1 的独立迁移 CLI，服务于默认 workspace 从 `docs/agents/` 迁至 `fcop/` 的升级路径，属于 v1.0 RC 必交付物。（引文：“ADR-0022 Phase 1”“v1.0 RC 必交付物”“默认 workspace 从 `docs/agents/` 迁到 `fcop/`”）
- CLI 必须独立于 `Project` 改造；`Project()` 默认目录、`workspace_dir` 参数及启动 detect 属于 Phase 2，延期至另一个任务，并须在 ADR 中明确记录。（引文：“独立工具，不依赖 `Project` 改造”“Phase 2 显式 deferred 并写进 ADR”“v1.0 final 之前的另一个 task”）

**O｜产物与交付**

- 代码交付包括 CLI 模块、`migrate_workspace.py`、console-script entry point 更新、legacy test 放宽及新增 25 个测试。（引文：“CLI 模块 + migrate_workspace.py + 25 测试 + entry point bump + legacy test 放宽”）
- 迁移须生成留痕文件 `MIGRATED_FROM_DOCS_AGENTS.md`，包含时间戳和版本号，以支持发现迁移记录及回滚；原文未要求实现自动回滚命令。（引文：“留痕文件 `MIGRATED_FROM_DOCS_AGENTS.md`”“可发现 + 可回滚；含时间戳/版本号”）
- 文档交付包括 ADR-0022 状态更新、Implementation 段及 sign-off，以及 TASK-008 报告和 task 归档。（引文：“ADR-0022 状态更新 + Implementation 段 + sign-off”“TASK-008 报告 + 归档 task”）

**A｜动作与行为**

| 对象／条件 | 必须满足的行为 | 短原文依据 |
|---|---|---|
| `fcop` 入口 | 升级为子命令派发器，采用 argparse 和 lazy import | “subcommand 派发器”“argparse + lazy import” |
| 默认运行／dry-run | 不动盘；输出带 `[dry-run]` 的 summary，含 source、target、strategy、entries；末尾给出 apply 提示 | “默认 dry-run”“含 source/target/strategy/entries”“末尾打印 `Run again with --apply ...`” |
| `--apply` 正常迁移 | 将 `docs/agents/` 移至 `fcop/`，并写留痕文件；仍须遵守已迁移和冲突分支 | “实际把 `docs/agents/` 移到 `fcop/`，并写 breadcrumb” |
| git 工作区且路径已 tracked | 使用 `git mv`，保留历史，并可由 `git status` 观察；否则使用 shutil fallback | “git 工作区 + tracked path 时使用 `git mv`”“否则 shutil fallback” |
| Windows 下的 `git mv` 路径 | 使用 `as_posix()` 和反斜杠替换处理路径分隔符 | “用 `as_posix()` + `replace("\\", "/")`” |
| 顾问扫描 | 列出 `.gitignore`、`README.md` 等含 `docs/agents` 的文件，仅列出，不改写 | “列出 `.gitignore` / `README.md` 等含 `docs/agents` 的文件”“显式不改写，仅列” |
| entry-points cache 兼容测试 | `test_console_script_resolves_to_cli_main` 接受新旧两个值 | “接受新旧两个值” |

**P｜参与关系**

- ADMIN 为发送方及决议制定者，ME 为接收方；采用 Solo 模式。（引文：“sender: ADMIN”“recipient: ME”“Solo 模式任务”“ADMIN solo 自定”）
- 任务包含 self-review 和 ADR sign-off，但没有指定额外执行者、独立复核者、sign-off 签署者或最终验收接收者。（引文：“self-review”“sign-off”）
- 下游是迁移路径的测试使用方；CLI 落地应使下游能立即开始测试，原文未将下游测试完成设为本任务收口条件。（引文：“保证下游能立即开始测试迁移路径”）

**R｜资源、数量与时间**

- 优先级为 P0，任务日期为 2026-05-09，所载状态为 `in_progress`；任务位于 `fcop@1.0.0-rc.1` release prep 之后。未给出具体截止时间或工时额度。（引文：“priority: P0”“date: 2026-05-09”“status: in_progress”“release prep 之后的第一个收尾 task”）
- 验收标准共 8 项；新增测试数量为 25，覆盖 plan、apply、render、CLI、standalone run 五条路径。（引文：“acceptance_criteria_count: 8”“新增 25 用例”“五条路径”）
- 执行计划实际规定 R1—R3 三轮提交，依次使用 `feat(cli):`、`docs(adr):`、`docs(workflow):` 前缀。（引文：执行计划三行；“3 commits 即可收口”）
- 不引入新 runtime 依赖，使用标准库及 subprocess。（引文：“不引入新 runtime 依赖（pure stdlib + subprocess）”）

**V｜版本与依据**

- 协议标记为 `fcop`、版本 `1`、类型 `TASK`；引用依据包括：
  - `adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md`
  - `adr/ADR-0022-workspace-directory-convention.md`
  - 前序任务 `docs/agents/log/tasks/TASK-20260509-007-ADMIN-to-ME.md`  
  （引文：头部 `protocol`、`version`、`type`、`ref_charter`、`ref_adr`、`ref_predecessor`）
- 本文明确引用 ADR-0022 的 Decision §3、Design Details 第 1／3 项、启动 detect 行为及 v1.0 RC Implementation Notes。引用文件全文未提供，不能据此补入额外要求；当前 Phase 1 的 both-exist 冲突处理仍是独立明确义务。（引文：决议表第 3—8 项）
- 兼容行为须保留 0.5→0.6 legacy 信息；升级背景涉及 0.7.x 用户迁至 v1.0。留痕“版本号”的具体取值未确定，不能直接认定为协议版本或 `1.0.0-rc.1`。（引文：“仍打印 0.5→0.6 legacy 信息”“0.7.x 用户升级 v1.0”“含时间戳/版本号”）

**C｜完成、停止与验收条件**

以下 8 项均为验收要求；关联行为沿用 A，不重复展开：

| 项 | 验收条件 | 短原文依据 |
|---|---|---|
| 1 | `fcop migrate-workspace --help` 列出所有选项，退出 0 | “退出 0；列出所有选项” |
| 2 | dry-run 满足 A 中的不动盘及 summary 要求 | “Dry-run 不动盘” |
| 3 | `--apply` 完成迁移并写 breadcrumb | “移到 `fcop/`，并写 breadcrumb” |
| 4 | git 工作区中的 tracked path 按 A 使用 `git mv` 并可观察 | “保留历史；`git status` 可见” |
| 5 | 已迁移 tree 上执行 `--apply` 为 no-op，退出 0 | “是 no-op，退出 0” |
| 6 | both-exist 时执行 `--apply`，不动盘、输出 `ABORT`、退出 2 | “退出 2，不动盘，输出 `ABORT`” |
| 7 | 顾问扫描列出指定类别中含旧路径的文件 | “等含 `docs/agents` 的文件” |
| 8 | 无子命令的 `fcop` 打印 legacy 信息，退出 1 | “仍打印 0.5→0.6 legacy 信息，退出 1” |

- 回归要求是全跑且无回归；原文报告“963 passed”，包括新增 25 例，另有唯一已知 pre-existing fail。该记录不构成允许出现任意新失败的豁免。（引文：“全跑 → 仅 1 pre-existing red，无回归”“全回归 963 passed……唯一 fail 为已知 pre-existing”）
- 冲突必须停止，禁止自动合并；原文没有规定额外升级汇报流程。（引文：“both-exist conflict 必 ABORT 退出 2”“绝不自动合并”）

**B｜独立禁止与限制，以及局部未确定处**

- 禁止默认运行或 dry-run 动盘；`--apply` 只是允许写盘的必要条件，不取消冲突不动盘、已迁移 no-op 等约束。（引文：“`--apply` 才动盘”；关联 C5、C6）
- 禁止自动合并并存目录、改写扫描发现的用户文件、引入新 runtime 依赖或把 Phase 2 `Project` 改造纳入本次范围。（引文：“绝不自动合并”“仅列”“不引入新 runtime 依赖”“Phase 2……defer”）
- **提交数量存在局部不一致**：章节标题写“4-commit template”，但仅列 R1—R3，正文明确“3 commits 即可收口”；没有第四次提交的内容依据。
- **冲突条件的命令范围未完全一致**：决议第 7 项未限定 `--apply`，验收第 6 项仅明确 `--apply` 场景。`--apply` 下的行为确定；dry-run 遇 both-exist 是否同样退出 2，原文未单独澄清。
- **尚未给出具体定义**：完整选项列表、扫描范围及排除规则、breadcrumb 所在目录和格式、“已迁移 tree”的判定细节均未展开。（引文：“列出所有选项”“等”“留痕文件”“已迁移的 tree”）
- **状态记录需区分**：头部仍为 `in_progress`，验收及 self-review 却全部勾选，并报告已验证结果。这是原文所载状态与完成声明的差异；不能仅凭勾选认定已完成正式验收或归档。