## I｜输入与作用域

- **任务身份**：ADMIN 向 ME 下达 `TASK-20260427-004`，优先级 P0，所属会话 `sess-20260427-me-071`，协议封装为 `fcop` v1。来源：“`sender: ADMIN`”“`recipient: ME`”“`priority: P0`”及任务头。
- **全包范围**：0.7.1 必须覆盖协议、库、MCP、测试、发版基建、验证与发布，并处理 ISSUE-001／004／005／006；不能仅修依赖 pin。来源：“本次 0.7.1 是**全包发版**”“不准再延后任何条目”。
- **问题依据**：ISSUE-006 是发布依赖错误；004 是子 agent 冒充角色；005 是文件名示例悬空；001 是 tripwire 盲区。来源：“钉死 `fcop<0.7`”“子 agent 冒充角色”“AMEND-/v2 文件名悬空”“Rule 0.a.1 tripwire 盲区”。

## O｜产物与交付

以下各项均为独立必交内容，不能相互替代。

| 对象 | 必须交付的内容 | 短原文依据 |
|---|---|---|
| `fcop-rules.mdc` | Rule 1 增加子 agent 继承呼叫者身份；Rule 5 移除指定文件名例子；Rule 0.a.1 明确所有写入路径都适用，tripwire 仅事后审计 | “继承呼叫者身份”“移除 `AMEND-*` / `*-v2.md` 例子”“适用所有写入路径” |
| `fcop-protocol.mdc` | 与 rules 1.8.0 同步，附 v1.6 changelog | “与 1.8.0 同步，附 v1.6 changelog” |
| `letter-to-admin.zh.md`、`letter-to-admin.en.md` | 两个语言版本均在指定语句后补“子 agent ≠ 多一个角色”一节 | “在 ‘一个角色只能给一个 agent’ 后补一节” |
| `Project.audit_drift()` | 新方法：扫描 `git status --porcelain`，与 FCoP 账本对照，列出账本外未归账修改 | “与 FCoP 账本对照”“ledger 之外的未归账修改” |
| 两个包的版本文件、MCP 依赖声明 | 完成 V 中列出的版本及依赖变更 | 第 5、6、7 项 |
| MCP 工具 `fcop_check` | 调用 `audit_drift`，并审计 `session_id↔role` 一致性，返回 ADMIN 可读报告 | “`audit_drift` + `session_id↔role` 一致性审计” |
| `fcop_report` | 在 occupancy 段后追加漂移摘要及跨角色冲突计数 | “occupancy 段后追加” |
| `write_task`、`write_report`、`write_issue` | 三个工具均增加 A 中的 first-write-wins 角色锁定 | “加 first-write-wins 角色锁定” |
| `tests/test_pyproject_pins.py` | 自动核对 MCP 版本与 fcop 依赖 pin 的 minor 一致 | “依赖 pin 的 minor 一致” |
| `tests/test_audit_drift.py` | 覆盖账本外 git 改动审计 | “审计未在 ledger 中的 git 改动” |
| `tests/test_role_lock.py` | 覆盖首次写入锁定及拒绝跨角色二次写入 | “first-write-wins + 拒绝跨角色二写” |
| `tests/test_rule5_text.py` | 检查 rules 1.8.0 文案不含两个禁用模式 | “不再包含 `AMEND-*` / `*-v2.md`” |
| `adr/ADR-0002-package-split-and-migration.md` | 示例段动态化，新增 lockstep 检查表 | “示例段动态化 + 新增 lockstep 检查表” |
| `docs/releases/RELEASE-CHECKLIST.md` | 新增一条龙发版必勾项清单 | “一条龙发版必勾项” |
| `CHANGELOG.md` | 新增 `[0.7.1]` 段 | “新增 `[0.7.1]` 段” |
| `docs/releases/0.7.1.md` | 包含 pin bug 成因的 post-mortem | “pin bug 怎么发生的” |
| 完成与问题记录 | done report 落盘、任务归档、四个 ISSUE 关闭且对应 REPORT 落盘 | “写 done report、archive task”“对应 REPORT 落盘” |
| 发布交付 | 两个包完成构建、校验、上传；撤回 MCP 0.7.0；创建并推送版本标签及创建 release | 第 22—24 项；具体边界见 A、R |

## A｜动作与行为关系

- **审计须保留两类检查**：`fcop_check` 同时包含文件漂移审计和会话角色一致性审计；`fcop_report` 同时包含漂移摘要和跨角色冲突计数。仅实现其中一种不满足要求。来源：“+ `session_id↔role`”“+ 跨角色冲突计数”。
- **角色锁定以同一 `session_id` 为关联键**：第一次写入使用的 sender 成为该会话锁定角色；此后任一列出的写入工具若使用不同 sender，必须直接拒绝并指向 Rule 1。不能将锁定拆成互不关联的工具内锁。来源：“同一 `session_id` 第一次写谁就锁定那个 sender 角色，再用别的 sender 调用 → 工具直接拒绝并指向 Rule 1”。
- **部署同步必须覆盖全部目的地**：通过 `redeploy_rules` 将 rules 1.8.0／protocol 1.6.0 同步至 `.cursor/rules/`、`AGENTS.md`、`CLAUDE.md`。来源：“同步到 `.cursor/rules/` + `AGENTS.md` + `CLAUDE.md`”。
- **验证、发布及收尾均须实施**：执行 `pytest -x`、`ruff check`，完成两包构建／校验／上传、旧版本 yank、`git tag v0.7.1`、push、`gh release create`，并完成报告、归档和关闭问题。来源：第 19、21—24 项。原文未明确这些编号构成严格执行时序。

## P｜参与关系

- **下达与承接主体**：ADMIN 下达，ME 接收；未另行指定执行分工或独立复核人。来源：任务头“`sender: ADMIN`”“`recipient: ME`”。
- **子 agent 的身份约束**：子 agent 继承呼叫者身份，不能因创建子 agent 而多获得一个角色；此关系必须进入协议及中英信件。来源：“子 agent 继承呼叫者身份”“子 agent ≠ 多一个角色”。
- **报告面向对象**：`fcop_check` 的结果须让 ADMIN 可读；原文未规定额外人工签收或批准流程。来源：“返回 ADMIN 可读报告”。

## R｜数量、资源与时间

- **发布对象为两个包**：`fcop` 与 `fcop-mcp`；构建、校验、上传各要求两次，对应两包，共六次指定发布操作。来源：B／C 的包名及“`uv build` × 2、`twine check` × 2、`twine upload` × 2”。
- **逐成员覆盖**：两份语言信件、三个写入工具、三个规则同步目的地、四个 ISSUE 均须逐一满足对应要求，不能用其中一项代表整体。来源：O、A 所引名单及“全部 `status: closed`”。
- **时间约束为定性紧急**：P0、立即补救，本轮 0.7.1 不得延期任何条目；没有给出具体截止日期、耗时或重试额度。来源：“需要立刻补救”“不准再延后任何条目”。

## V｜版本与依据

| 对象 | 指定版本边界 | 短原文依据 |
|---|---|---|
| rules | 1.7.0 → **1.8.0** | 第 1 项 |
| protocol | 1.5.0 → **1.6.0**，语义与 rules 1.8.0 同步 | 第 2 项 |
| `src/fcop/_version.py` | 0.7.0 → **0.7.1** | 第 5 项 |
| `mcp/src/fcop_mcp/_version.py` | 0.7.0 → **0.7.1** | 第 7 项 |
| `mcp/pyproject.toml` | `fcop>=0.6,<0.7` → **`fcop>=0.7,<0.8`** | 第 6 项，标为“CRITICAL” |
| 发布标签 | **`v0.7.1`** | 第 24 项 |
| 旧 API 行为 | `unbound_report()` 维持 0.7.0 的报错行为 | “仍按 0.7.0 报错” |

依赖范围下界包含 0.7，上界不包含 0.8；0.7.1 位于此范围内。但验收进一步要求实际安装的两个包都为 **0.7.1**，不能仅以满足依赖范围代替。来源：“`pip show fcop fcop-mcp` 显示 0.7.1 / 0.7.1”。

## C｜完成、停止与升级条件

**完成须合取全部交付义务与以下验证结果：**

- `pytest -x` 与 `ruff check` 均全绿。来源：“`pytest -x` 全绿；`ruff check` 全绿”。
- 通过 `uvx --refresh fcop-mcp` 能正常启动并使用 `fcop_report()`、`fcop_check()`。来源：“能正常启动 `fcop_report()` 与 `fcop_check()`”。
- `pip show` 显示两个包均为 0.7.1。来源：V 中验收引文。
- 任何旧脚本调用 `unbound_report()` 仍按 0.7.0 报错。来源：“任何旧脚本调用……仍按 0.7.0 报错”。
- ISSUE-001／004／005／006 全部 `status: closed`，对应 REPORT 落盘；done report 与任务归档也必须完成。来源：验收末项及第 21 项。

原文没有另设失败后的停止、回滚或升级流程；未来测试是否通过、是否发现漂移或冲突尚未知，**不构成边界歧义**。原文也没有独立要求审计报告必须为零漂移、零冲突。

## B｜独立禁止、限制与局部不明确处

- **不得遗留或延后本轮条目**。来源：“不要残留”“不准再延后任何条目”；其明确覆盖范围为本任务列出的工作与关联问题。
- **不得回插旧 API alias**，即使为兼容旧脚本也不允许。来源：“不要回插 alias”。
- **不得使用跨角色二写绕过身份锁定**，拒绝须指向 Rule 1。来源：第 10 项；关联 A。
- **不得把 tripwire 当成写入前授权或缩小规则适用范围**：Rule 0.a.1 适用于所有写入路径，tripwire 仅事后审计。来源：第 1 项。
- **rules 1.8.0 文案不得包含 `AMEND-*`／`*-v2.md`**。第 1 项要求移除例子，第 14 项给出了更广的文案检查边界；不能据此推导所有其他文件也禁止出现这些字符串。来源：“rules 1.8.0 文案不再包含”。

**具体不明确处：**

| 位置 | 已确定内容 | 未确定内容 |
|---|---|---|
| 第 23 项：“`pip install fcop-mcp 0.7.0` yank 掉” | 意图是 yank `fcop-mcp` 0.7.0 | 将安装命令表述与 yank 动作混写，不能直接作为有效撤回命令；具体操作方式未给出 |
| 第 10 项：首次写入锁定 | 同一会话首次写入锁 sender，后续不同 sender 必须拒绝 | 锁的持久化／重置范围，以及失败写入是否算“第一次写”，未说明 |
| 第 15 项：“示例段动态化” | ADR 示例必须动态化，并增加 lockstep 清单 | 动态化机制与具体验收标准未说明 |
| 第 24 项：“push + `gh release create`” | 须推送发布标签并创建 release | 远端、分支、release 具体参数未指定 |

这些局部未确定项不取消其余明确义务，也不由本次边界解释代为选定。