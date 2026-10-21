## I · 输入与作用域

- **任务身份**：`TASK-20260512-001`，对象为 fcop-mcp 1.4 的写侧工具绑定守门及系统路径保护；元数据标为 `P0`、`high`，发送方 ADMIN、接收方 ME。来源：“`task_id: TASK-20260512-001`”“`priority: P0`”“`risk_level: high`”。
- **全面覆盖写侧工具**：作用域是**所有 write-side MCP 工具**，不以候选清单为上限；OPS 须在实现时枚举确认。候选清单按独立工具名计为 **14 个**：`redeploy_rules`、`deploy_role_templates`、`init_project`、`init_solo`、`create_custom_team`、`new_workspace`、`write_task`、`write_report`、`write_issue`、`write_review`、`archive_task`、`mark_human_approved`、`report_failure`、`drop_suggestion`。来源：“所有 write-side MCP 工具”“候选清单（待 OPS 在实现时枚举确认）”。
- **历史事件是依据，不是新增清理任务**：PM #50 的 USER HOME 污染已完成备份、删除、重绑定及重跑，并经 ADMIN 验证；归档目录为 `D:\Bridgeflow\.scratch\pm50-user-home-pollution-20260512-1535\`，证据引用 PM-01 的 15:38、15:42 UTC+8 汇报。来源：“事件已完整闭环”“污染已 0 残留”。

## O · 产物与交付

| 产物 | 必须交付的边界 | 短原文依据 |
|---|---|---|
| D1 绑定守门 | 确定完整写侧工具清单；全部工具在未显式绑定项目根时抛 `ConfigError`，落实所给 `WriteRefused` 文案，包含工具名、绑定缺失、处理提示及 v1.4 release notes 引用 | “清单确定 + 全部加 binding 守门 + 错误文案落实” |
| D2 路径保护 | 实现跨 Windows / Unix 的保护路径拒绝逻辑；落实所给错误模板，包含解析后的路径、拒绝原因及绑定项目子目录提示 | “即使绑定了……直接拒绝”“deny-list 跨 Windows / Unix 覆盖” |
| D3 报告显示 | `fcop_report()` 首段显示 `当前 project_path: <abs_path>`；路径命中 D2 时增加红字警告，说明写操作将被拒绝，并提示 `set_project_dir(...)` | “报告首段加一段”“加红字告警” |
| D4 schema | 保留 `set_project_dir` 现有文档警告；**每个写侧工具** schema 均新增 `binding_required: true` 和 `allowed_project_dir_class: "real_project_root"` | “schema 文档警告保留”“所有 write-side 工具的 schema 加机器可读字段” |
| D5 测试 | 覆盖下述六类测试并全部 GREEN | “测试用例（必须覆盖）”“6 类用例全 GREEN” |
| D6 发布与迁移 | `docs/releases/1.4.0.md` 增加 “Breaking-ish behavior change” 小节，说明 unbound 从静默成功变为 `ConfigError`、老脚本可能须先绑定；显式标 breaking 并提供迁移指南；`fcop_report()` 检测版本 `< 1.4` 时在底部提醒升级 | “老脚本可能需要先调”“提供迁移指南”“底部加升级提醒” |
| 完成报告及归档 | 到 `done` 状态须写 `REPORT-001-ME-to-ADMIN.md` 并 archive | “`done` → 写 REPORT-001-ME-to-ADMIN.md + archive” |

D1 错误模板中的“以项目根作为 cwd 重启”提示与显式绑定要求存在局部冲突，见 V。

## A · 动作

- **调用守门**：每个写侧工具调用均受 D1 约束；未显式绑定即 `ConfigError`，不得进入 cwd 兜底写入。来源：“在未 explicit bind 项目根时直接 ConfigError”。
- **解析并检查绑定路径**：显式绑定不豁免 D2；解析结果命中保护路径仍拒绝。绑定合法项目目录须正常工作，但合法路径不取消 D1 的显式绑定要求。来源：“即使绑定了”“绑定到合法 project dir → 正常工作”。
- **报告及 schema 改造**：执行 O 中 D3、D4、D6 的显示、告警、字段及升级检测要求；机器可读字段供 Cursor / Claude Code / Devin 等上层 orchestrator 使用，原文未要求改造这些上层产品。来源：“这给上层 orchestrator……一个机器可读的 hook”。
- **条件回滚**：若发现严重副作用，可降级至 `v1.3.x`；这是条件性回滚方案，不是必做动作。来源：“如果发现严重副作用，降级回 v1.3.x 即可，无数据损失”。

## P · 参与关系

| 主体 | 关系及边界 | 短原文依据 |
|---|---|---|
| ADMIN | 决定批准、调整范围或拒绝／延后；状态机把 ADMIN GREEN 作为推进门槛 | “等 ADMIN GREEN”“请 ADMIN 决” |
| ME | 接收任务；获接受后实施；完成后向 ADMIN 交报告并归档 | “`recipient: ME`”“`accepted` → ME 开工实施” |
| OPS | 实现时枚举确认写侧工具清单；未明确承担全部实施或最终验收 | “待 OPS 在实现时枚举确认” |
| PM / ADMIN | 历史事件由 PM 自检处置、ADMIN 独立验证；不能据此认定本次修复也已验收 | “PM 自检发现 + 备份 + 删除 + 重绑定 + 重跑，ADMIN 独立验证” |
| Bridgeflow PM / QA | 本修复不得阻塞 §5 A 路径，其中 PM 的 30 件 commit 与 QA verdict 工作应保持不冲突 | “不阻塞 Bridgeflow §5 A 路径”“commit 30 件 + QA verdict 互不冲突” |

原文未明确指定**本次修复**的最终验收执行人，亦未明确归档对象和位置。

## R · 资源、数量与时间

- **工具数量**：原文概称“≥ 8 个”，列出的独立候选工具实际为 **14 个**；两者不矛盾，最终工具集合须枚举确认，不能限定为 8 个或只覆盖这 14 个。来源：“下面 ≥ 8 个”“候选清单”。
- **保护路径集合**：D2 要求解析后的 `project_dir` 命中以下任一路径即拒绝：

  | 平台／类别 | 保护路径 |
  |---|---|
  | Windows home | `%USERPROFILE%` |
  | 跨平台 home | 展开后的 `~` |
  | Unix 根目录 | `/` |
  | Windows 驱动器根目录 | 任一 drive letter root，如 `C:\`、`D:\` |
  | Windows 系统／应用数据目录 | `%PROGRAMDATA%`、`%APPDATA%`、`%LOCALAPPDATA%` |
  | Unix 系统目录 | `/etc`、`/usr`、`/opt` |

  来源：“解析到以下路径之一”。这些是路径类别／表达式，展开后可能重合，不能据此确定固定的保护目录数量。

- **路径匹配范围**：保护对象为列明路径本身；home 明确要求**精确相等才拒绝**，home 下合法项目子目录放行，不能扩张成整个 home 子树禁用。来源：“只拒绝精确等于 home 的情况，子目录放行”。
- **时间**：选项 A 获批后要求 ME“立即开工”；D1～D5 的“2～3 小时”为预计工期，D6 同步，不能解释为硬截止时间或把“立即”换算成数值时限。来源：“批准推进，ME 立即开工（预计 2~3 小时完成 D1~D5，D6 同步）”。
- **资源额度**：未规定人员额度、费用预算或其他资源上限；历史“4 件协议文件／4 件备份”及外部工作的“30 件”不是本修复的交付数量。来源：“4 件协议文件”“4 件备份 sha256 齐”“PM 那边 commit 30 件”。

## V · 版本、依据与局部不确定性

- **版本依据**：消息协议为 `fcop`、`version: 1`；修复面向 fcop-mcp 1.4，发布文档为 `1.4.0.md`；升级提醒条件严格为 `< 1.4`；条件回滚目标为 `v1.3.x`。来源：元数据及 D6、“回滚”段。
- **关联范围**：PM 的“9.2 v2.5 v1.6 自约束”是已有操作纪律背景，不能代替本次硬守门；ADR-0033 的相关章节会引用本次 fix 作为 motivation；ADR-0034 与本任务无关。来源：“但归因偏轻”“会引用本次 fix 作为 motivation”“与 ADR-0034……互不相关”。
- **显式绑定与错误提示冲突**：D1 明确禁止未绑定时以 cwd 兜底，错误模板却允许提示“`or restart the MCP server with cwd set to the project root`”。原文未定义“以项目根 cwd 启动”是否产生显式绑定；因此不能据此自行授予 cwd 兜底例外。
- **状态及授权记录不一致**：头部标 `status: done`、sender 为 ADMIN；正文却写“`proposed`（本文件落盘时）→ 等 ADMIN GREEN”，结尾由 ME 署名并请求 ADMIN 决策。只能保留这些记录，不能认定批准或本次验收已经发生。
- **D2 拒绝时点未明确**：正文要求受保护路径“即使绑定了”也直接拒绝，测试又写“绑定到 USER HOME → ConfigError”；究竟在 `set_project_dir` 时拒绝、写工具调用时拒绝，还是两处均拒绝，没有明确规定。明确不变的是受保护路径不得发生写侧操作。
- **路径解析细节未规定**：原文要求“解析到”，但未具体规定符号链接、Windows 大小写及路径别名的归一化规则；不能虚构实现要求。
- ADMIN 尚未选择的 A／B／C、最终枚举的工具集合及未来测试结果，应保留为待决定或待验证事项，不属于原文歧义。

## C · 完成、停止与升级条件

**完成要求为合取**：D1～D6 全部落实，且第 7 项 PM #50 干净环境复现通过；不能以历史污染已闭环代替本次修复验收。来源：“验收标准”第 1～7 项。

D5 的六类测试必须覆盖：

| 类别 | 判定 |
|---|---|
| 逐工具 unbound 单测 | **每个**写侧工具均返回 `ConfigError` |
| USER HOME 单测 | 绑定到 USER HOME → `ConfigError` |
| drive root 单测 | 绑定到驱动器根目录 → `ConfigError` |
| 合法目录单测 | 绑定到合法项目目录 → 正常工作 |
| PM #50 集成测试 | MCP cwd 为 USER HOME，直接调 `redeploy_rules` → `ConfigError` 且不写盘 |
| 既有套件回归 | 已有 fcop-mcp 测试全部仍 GREEN |

来源：“D5 · 测试用例（必须覆盖）”。

第 7 项另要求在**干净环境**模拟 PM 当时的 cwd／调用序列，确认拒绝写盘、USER HOME 仍为 0 文件；可与相关集成测试关联，但不能遗漏干净环境和零文件条件。来源：“在干净环境模拟……USER HOME 仍然 0 文件”。

- **推进条件**：正文状态机要求 `proposed` 等 ADMIN GREEN，`accepted` 后开工，`done` 后报告及归档；不能把作者推荐 A 当成 ADMIN 已批准。来源：“我推荐 (A)”及状态机。
- **范围调整／延期**：B 中增减 D2 项、D6 另起任务，以及 C 中随 v1.4 延后或拆分，都是供 ADMIN 决定的方案，当前不构成已生效的范围修改。来源：“请 ADMIN 决”。
- **异常条件**：未绑定或命中保护路径时拒绝写操作；严重副作用时适用回滚方案；版本 `< 1.4` 时触发升级提醒。来源：D1、D2、D6 及回滚段。

## B · 独立禁止与限制

- **禁止未显式绑定的写侧工具用 cwd 兜底**，也不能只添加文档／schema 警告而缺少运行时硬守门。来源：“不允许默认 cwd 兜底”“协议层硬约束”。
- **禁止绑定豁免系统路径保护**：D1 与 D2 同时成立；通过绑定检查不等于通过路径检查。来源：“即使绑定了……直接拒绝”。
- **禁止将 home 子目录一概封禁**：合法项目可放在 home 下，仍须满足显式绑定等其他条件。来源：“用户把项目放在 home 下子目录是合法的”。
- **不得删除既有 `set_project_dir` schema 文档警告**，新增机器可读字段是叠加要求。来源：“schema 文档警告保留”。
- **不得因本修复阻塞 Bridgeflow §5 A 路径**；ADR-0034 不在本任务范围内。来源：“不阻塞”“互不相关”。