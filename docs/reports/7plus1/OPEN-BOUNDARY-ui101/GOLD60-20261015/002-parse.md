## I｜输入与作用域

- **任务身份**：ADMIN 发给 ME 的 P1 任务，主题为 Rule 1 角色身份唯一性硬化，面向 **0.7.0 预站**。来源：`sender: ADMIN`、`recipient: ME`、`priority: P1`、标题“0.7.0 预站”。
- **本轮仅形成设计记录并排队**，ME 的抽明、起草、验证须受此范围约束；0.7.0 实现和发布不属于本轮授权。来源：“落设计记录 + 排队”“实现不在本轮会话范围内”。
- **未来修订对象**：规则文件 Rule 1、协议文件 UNBOUND 节、中英文 ADMIN 信、`server.py` 的 `fcop_report`，以及验收要求的版本与测试。来源：“修订清单（趋紧后的最终版）”“验收标准（0.7.0 实现后）”。
- **关联材料不自动扩张范围**：两份 ISSUE、上游 0.6.6 文档任务、原生说明书及架构公理作为依据或关联；手工 git 的 tripwire 缺口仅称“0.7.0 可一起修”，不是本轮必做实现项。来源：“上游违规……0.7.0 可一起修”“上游任务……0.6.6 文档级 patch”。

## O｜产物与交付

| 阶段 | 必需产物与边界 | 短引文 |
|---|---|---|
| 本轮 | 落盘设计记录并排队；REPORT 使用 `status=in_progress`，任务保持 `OPEN` | “落设计记录 + 排队”“REPORT 会以 status=in_progress 走，任务保持 OPEN” |
| 0.7.0 | Rule 1“贯穿两阶段的硬约束”加入一角色一 agent、ADMIN 禁止重复指派、磁盘账本唯一权威等条款；中英各一份 | “加一条……ADMIN 不得把同一角色码指派给多个 agent”“中英各一份” |
| 0.7.0 | UNBOUND 节加入 BOUND 前 occupancy 自检、冲突拒绝、proposal 记录和三选一出口 | “必须先用 `fcop_report` 输出的 occupancy 段对照自己的 session_id” |
| 0.7.0 | `letter-to-admin.{zh,en}.md` 加入 ADMIN 纪律提醒，明文禁止双 bind，并说明 team 协作与显式 co-reviewer 指派 | “要让两个 agent 协作请用 team 模式；要协审请明说” |
| 0.7.0 | `fcop_report()` 的 **UNBOUND、initialised 两分支**均在输出底部提供“角色占用 / Role occupancy”段；**逐角色**列出 open tasks、open reports、open issues 三项数量，archived 数、last session_id seen，以及 UNUSED / ARCHIVED / ACTIVE 标签 | “包括 UNBOUND 与 initialised 两分支”“逐角色列出” |
| 0.7.0 | 新增双 bind 场景测试，覆盖拒绝 BOUND 与落 `.fcop/proposals/`；happy/sad path 各一道 | “happy/sad path 各一道” |

本轮设计记录、REPORT 的具体文件名及位置未指定；不能把双 bind 现场的 proposal 路径直接当成本轮交付路径。

## A｜动作与条件链

1. **BOUND 前必须由 agent 自查**：ADMIN 明确指派身份后，agent 自己读取文件账本，通过 `fcop_report` occupancy 对照自身 `session_id`；ADMIN 的指派不能替代检查。来源：“BOUND 之前**自己**去翻文件账本”“在『等 ADMIN 明确指派』步骤后加一段”。

2. **发现角色占用冲突时，拒绝默认占领和 BOUND 转换**，联动 Rule 1、Rule 8；现场示例为角色 `ACTIVE` 且 `last session_id ≠ 我`。随后：
   - 落 `.fcop/proposals/double-bind-{ts}.md`，记录 ADMIN 指派与磁盘已有占用的冲突；
   - 向 ADMIN 提供 **handoff / co-review / 另立角色码**三选一；
   - 报告并等待回复。  
   来源：“发现角色已被使用就拒绝默认占领”“拒绝 BOUND 转换”“报告 ADMIN，等回复”。

3. **三个出口保留各自条件，不预选**：

| ADMIN 的明确回复 | 后续约束 | 短引文 |
|---|---|---|
| 指派 co-reviewer | 接受 BOUND，但活动限制为只读及只写二审段落；同时仍受角色唯一性要求约束，相关身份细节见下文未明确项 | “接受 BOUND，但只读+只写二审段落” |
| 旧 session 先归档 | 必须等待旧 session 写 handoff TASK；不能把 ADMIN 的回复本身当作交班完成 | “等旧 session 写 handoff TASK” |
| 使用新角色码，如 ME-2 | 走现有 `create_custom_team / init_* force=True` 路径；新角色码仍须满足显式指派与不重合要求 | “叫你 ME-2 吧”“走 create_custom_team / init_* force=True” |

## P｜参与关系与身份约束

- **ADMIN**：显式指派每个 agent 的身份，但不得重复发放角色码；ADMIN 自身是不可借出的人类角色，不能指派给 agent。来源：“每个 agent，都要 admin 确认身份”“ADMIN 是不可借出的人类角色（→ 0 个 agent）”。
- **逐 agent、逐角色约束同时成立**：一人一角色；每个非 ADMIN 角色至多对应一个 agent，并非要求每个角色都必须有人占用。来源：标题“一人一角色”、不变量“其他每个角色至多 1 个 agent”。
- **新 session agent**：承担自查、拒绝冲突绑定、记录及上报义务；ADMIN 双 bind 是 ADMIN 的失误，但不免除 agent 的自查与拒绝义务。来源：“ADMIN 双 bind 是 ADMIN 的失误，但协议必须接得住”。
- **旧 session**：在交班出口中负责写 handoff TASK。来源：“等旧 session 写 handoff TASK”。
- **ME / ADMIN 的本任务分工**：ME 负责抽明、起草、验证；ADMIN 拍板启动 0.7.0 发布窗口。来源：“ME（本角色）负责抽明、起草、验证；ADMIN 拍板启动”。

## R｜资源、数量与时间

- **占用权威源**：原文列明 `docs/agents/tasks/`、`reports/`、`issues/`、`log/`，它们是占用状态的“唯一权威源”；`fcop.json` 确认角色存在，文件账本确认角色活跃。不能仅凭配置存在推定占用。来源：“fcop.json 说『这个角色存在』……说『这个角色正活跃』”。
- **角色容量**：对任意角色 \(r\)，ADMIN 角色的 agent 数为 0；其他角色的 agent 数不超过 1。临时身份同样占用独立角色码，不获得额外容量。来源：“ADMIN……0 个 agent”“其他每个角色至多 1 个 agent”“临时身份 = 临时角色码”。
- **新增工具数为 0**；冲突处理组合使用现有报告、proposal 落盘和 Rule 8 拒绝权。来源：“0 个新工具”。
- **新增指定路径测试合计 2 道**：happy、sad 各 1 道；现有 **587 passed 基线不降**。来源：“各一道”“现有 587 passed 基线不降”。
- **时间边界由 ADMIN 启动发布窗口控制**；原文未给具体日期或时长。“2026-04-27 下午”是起因时间，不是交付期限。来源：“等 ADMIN 启动 0.7.0”。

## V｜版本与依据

| 对象 | 要求 | 短引文 |
|---|---|---|
| 协议版本 | `fcop_protocol_version: 1.4.0 → 1.5.0` | 同名验收条目 |
| 规则版本 | `fcop_rules_version: 1.6.0 → 1.7.0` | 同名验收条目 |
| 两个包 | `fcop`、`fcop-mcp` **均**由 `0.6.5 → 0.7.0`，minor bump | “包版本 `fcop` / `fcop-mcp` 从 0.6.5 跳 0.7.0” |
| frontmatter | 使用已落地的 v1.1 `session_id`，本轮只读不改 | “`session_id` 字段 v1.1 已落地，本轮只读不改” |
| 协议依据 | Rule 1 身份约束与 Rule 8 拒绝权联动；Rule 7 是 ADMIN 受协议约束的既有先例；遵循文件系统协议与便利工具层架构公理 | “触发 Rule 1 + Rule 8 联动”“从 Rule 7 拓到 Rule 1”“Tools are a Convenience Layer” |

消息头的 `protocol: fcop, version: 1` 是来源消息元数据，不替代上述待升级版本。

## C｜完成、停止与升级条件

- **本轮交付不等于业务任务关闭**：设计记录落盘并排队后，仍须维持 REPORT `in_progress`、任务 `OPEN`，等待 ADMIN 开启 0.7.0。来源：“任务保持 OPEN，等 ADMIN 启动 0.7.0”。
- **0.7.0 验收须组合满足**：上述报告两分支、逐角色字段、规则中英条款、UNBOUND 自检与出口、双语纪律提醒、全部版本升级、指定测试及既有基线要求，不能用其中一项替代其余项。来源：“验收标准（0.7.0 实现后）”完整列表。
- **冲突停止点**：拒绝 BOUND 并向 ADMIN 升级，等待三选一处理；交班路线另需等待旧 session 的 handoff TASK。来源：“拒绝 BOUND 转换”“等回复”“等旧 session 写 handoff TASK”。

## B｜独立禁止与限制

- 禁止把 ADMIN 角色借给 agent；禁止同一非 ADMIN 角色码重复授予多个 agent，临时占用也不例外。来源：“不得重复发放”“即使是临时性的 temp，也不能产生本质的角色冲突”。
- 任何要写盘的 agent 都必须取得不与已有角色码重合的代号；“快速顶一下”不能作为绕过理由。来源：“任何要写盘的 agent 都要拿到……不重合的代号”。
- 不引入运行时 lock / lease 文件，包括被否决的 `.fcop/sessions/<role>.lock`；不通过运行时状态补接协议。来源：“不引入运行时 lock / lease 文件”“不能拼接运行时状态”。
- 不改 frontmatter 语义，不改 `init_*`，不改 Rule 4 的 thread-driver 条款，不加新工具。来源：“【不动】”“Rule 4 的 thread-driver 那条不动”。现场**调用**现有初始化路径不等于允许**修改**其实现。
- 本轮禁止开展实现；co-reviewer 的写入权限限于二审段落。来源：“实现不在本轮会话范围内”“只读+只写二审段落”。

## 原文局部未明确之处

- **co-reviewer 的角色码及写盘身份**：现场允许其 BOUND 并写二审段落，但未说明如何分配独立角色码、如何记入账本，以满足“任何要写盘的 agent”不得重码的总约束。不能据此推导允许借用 ME。
- **账本路径与统计口径**：权威源列出 `log/`，报告字段只列 tasks/reports/issues；未定义 log 如何参与活跃判定、archived 的累计范围、三个状态标签的判定，以及 `last session_id seen` 的排序依据。权威源列表的 `reports/`、`issues/`、`log/` 路径基准也未展开。
- **冲突判定覆盖范围**：原则称“已被使用”即拒绝默认占领，现场明确展示的是 `ACTIVE` 且最后 session 不同；对 ARCHIVED、缺失 session_id、多 session 历史等情况未给完整判定规则，不能把现场示例当作全部充要条件。
- **交班后重新绑定的判据**：明确要求旧 session 写 handoff TASK，但未规定该文件与归档、占用释放、重新检查之间的完整关系。
- **报告分支要求**：修订清单只明确点名 UNBOUND，验收则明确要求 UNBOUND 与 initialised 两分支；两分支交付要求保留，不因清单写得较窄而省略。
- **测试细节**：happy/sad path 的具体输入与断言未展开；“各一道”及对拒绝 BOUND、proposal 落盘的覆盖要求明确。

ADMIN 未来选择哪个出口、何时启动窗口，以及实际账本统计结果，属于尚未发生或尚未选择的状态，不构成原文歧义。