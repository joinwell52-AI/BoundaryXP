**I｜输入与作用域**

- 任务为 `TASK-20260509-007-ADMIN-to-ME`，ADMIN 发给 ME，Solo 模式；协议 `fcop` v1，日期及开启日为 2026-05-09，优先级 P0，状态 `in_progress`。（引文：“recipient: ME”“Solo 模式任务”“priority: P0”）
- 范围是 v1.0 Event 抽象端到端实现：12 个事件、polling watcher、订阅 API，以及 TASK-005 boundary、TASK-006 failure 既有路径接入。（引文：“12 事件 + polling watcher + subscribe_events”“把这些钩子接到真实 watcher”）
- 输入对象包括 TASK、REPORT、REVIEW 文件及其 frontmatter、TASK 归档位置、`fcop.json` 的 `roles`／`leader`、边界检查和 failure／recovery／session 调用状态。（来源：决议 2 的逐事件定义，见下表）
- 涉及 `src/fcop/core/events.py` 新建，`models.py`、`project.py` additive 修改，并包含测试、公开面 snapshot、ADR、CHANGELOG、报告及任务归档。（引文：“Touches…（新建）…（additive）”；执行计划 R1—R4）

**O｜产物与交付**

| 产物 | 必须满足的边界及短引文 |
|---|---|
| 事件模型与核心模块 | `models.Event` 为公开 dataclass；`EventType` 与 frozen schema 的 12 值一致；`core/events.py` 导出 `Event`、`EventType`、`WatcherState`、`compute_diff`、`make_event`。（A1：“export”；A2：“公开 dataclass…enum 含 12 值”） |
| Project 接口 | 公开 `subscribe_events(types, callback)`、`poll_once()`；内部 `_emit_event(event)` 统一发送两种来源的相同 Event 对象。（A3—A4：“公开 API”“公开方法”；决议 5：“Event 对象一致”） |
| 集成与兼容 | 接入 TASK-005/006，完成真实 emitter；同时保留 stub 入口及旧测试兼容，具体关系见 A。（引文：“替换成真实 emitter”“保留 stub 入口”） |
| 公开面与记录格式 | 更新 snapshot，保持 additive 演化；event record 通过 schema，包括 `source`／`subject` 子句。（A10：“包括 source / subject 子句”；A11：“snapshot 更新”；预飞：“全 additive 演化”） |
| 文档及收尾 | ADR-0018 Accepted、Sign-off、Tests Checklist `[x]`、Open Questions 标解决；同步 `adr/README.md`；更新 CHANGELOG；交付 REPORT-007，归档 TASK-007 并 push。（A12；R3：“索引同步”；R4：“REPORT-007 + 归档 TASK-007 + push”） |

**A｜动作与触发关系**

事件类型锁定如下；各行短引文来自决议 2，路径划分来自决议 5。

| 事件 | 触发条件与必要关系 | 来源短引文 |
|---|---|---|
| `TASK_CREATED` | 文件 polling：新 TASK 文件落盘；另受下述 mtime 规则约束 | “新 TASK-*.md 文件落盘” |
| `TASK_ACCEPTED` | 文件 polling：TASK status 为 accepted，**或** recipient 写第一份 REPORT | “status: accepted 或 recipient 写第一份 REPORT” |
| `TASK_BLOCKED` | 文件 polling：REPORT status 为 blocked | “REPORT `status: blocked`” |
| `TASK_COMPLETED` | 文件 polling：REPORT done **且** TASK 移至 `log/tasks/` | “status: done + TASK 移到 log/tasks/” |
| `REPORT_FILED` | 文件 polling：新 REPORT 文件落盘；另受下述 mtime 规则约束 | “新 REPORT-*.md 文件落盘” |
| `REVIEW_DECIDED` | 文件 polling：新 REVIEW 文件落盘且带 decision；首次出现时只触发一次 | “文件落盘 with decision”；决议 6：“review 文件首次出现时” |
| `ROLE_SWITCHED` | 文件 polling：`fcop.json` 的 roles 或 leader 改动 | “`roles` / `leader` 改动” |
| `BOUNDARY_VIOLATED` | 同步：限 `Project.write_review` enforce 路径，在抛 `BoundaryViolationError` **前** emit | 风险 4：“仅在…抛…前 emit” |
| `FAILURE_DETECTED` | 同步：`Project.report_failure` 调用时 | “`Project.report_failure` 调用” |
| `RECOVERY_INITIATED` | 同步：`Project.apply_recovery` 调用前 | “调用前” |
| `RECOVERY_COMPLETED` | 同步：`Project.apply_recovery` 成功后 | “调用成功后” |
| `SESSION_LOST` | 同步：`recover_session(action=resume)` 找不到 session；并非任意 recovery 都触发 | “action=resume…找不到 session” |

共同动作边界：

- 走派生路径，事件来自 filesystem 状态变化／git diff；reference impl 使用 polling + state diff。`compute_diff(prev_state: WatcherState, curr_state: WatcherState) -> list[Event]` 必须是纯函数。（引文：“走…‘派生’路径”“`compute_diff`…纯函数”）
- `subscribe_events` 内部维护 `WatcherState` 缓存；caller 每次显式调用 `poll_once()` 才进行前后状态比较；同步事件则由 Project 内部直接调用 `_emit_event(event)`。（引文：“每次调 `poll_once()` 比较前后状态”“内部代码直接调”）
- `WatcherState.seen_paths: dict[Path, mtime]` 记录已知文件；`_CREATED`／`_FILED` 仅针对新增或 mtime 增加路径；`_BLOCKED`／`_COMPLETED`／`_ACCEPTED` 比较前后 frontmatter status。此规则不能悄然删除上表中“第一份 REPORT”及“归档”等独立条件。（引文：“新增 / mtime 增加”“status 字段变化（前后比对）”）
- 去重键为 `(event_type, subject_hash)`，同一 poll 周期内抑制重复，跨 poll 周期不抑制；稳定文件重复 poll 不得重复触发 `_CREATED`／`_FILED`。（引文：“同一 poll 周期内重复抑制。跨 poll 周期不抑制”；A9）
- mtime 相差不超过 1 秒视为同一时刻；测试使用 in-memory mock filesystem。（风险 1：“mtime ± 1s 视为同一时刻”“测试用 in-memory mock filesystem”）
- 保留 `_emit_event_stub` 入口，由新 `_emit_event` 内部调用；`test_project_failure` 不改，也不得破坏 TASK-006 既有测试。（风险 2：“新 _emit_event 内部调 stub 入口”；Reviewer：“既有测试被破坏 → 拒”）
- `seen_paths` 长跑增长问题 v1.0 不解决，归 host adapter 责任；本任务仍须在 docstring 写明并测试典型用例。（风险 3：“docstring 写明 + 测试覆盖典型用例”）
- 原文要求按 R1→R4 执行并“立即开始 R1”；“立即”没有数值时限。这里只提取该边界，不执行。（执行计划；末句）

**P｜参与关系**

- ADMIN 为发送方，ME 为 Solo 接收及执行方；Proposer／Executor／Reviewer 是文内“三视角预飞”，没有指定三个独立执行者或独立审阅者。（引文：“Sender: ADMIN”“Recipient: ME (solo 模式)”“三视角预飞”）
- caller 提供订阅类型及 callback，负责显式 poll，并自行决定是否写自己的日志；host adapter 可实现 loop，承担后台轮询、真实 OS watcher、低延迟及长期缓存问题。（引文：“caller 必须显式调”“caller 自己决定是否记录”“host adapter 责任”）
- “recipient 写第一份 REPORT”中的 recipient 是对应 TASK 的接收者；这一跨主体条件不能放宽为任何人提交 REPORT。（决议 2：“recipient 写第一份 REPORT”）
- ADR 需要 Sign-off，但原文没有指定签署人、授权链或另行签收流程；不能据此自行授予签署权限。（A12：“Accepted + Sign-off”）

**R｜数量、额度与时间**

- 事件类型必须恰为 **12**，不是最小集 8；按实际列名，文件 polling **7** 类、同步 **5** 类，合计 12。原文另有错误数量标注，见后文。（引文：“v1.0 锁定 12 个”；决议 5 的两组列名）
- 固定 **4 个 commit**：R1 核心模型／diff／核心测试；R2 Project API／集成／Project 测试／snapshot／CHANGELOG；R3 ADR 及索引；R4 报告／归档／push。原文为四轮给出了对应 commit 文案。（引文：“执行计划（4 commit）”）
- `test_core_events.py` ≥12 用例，`test_project_events.py` ≥12 用例，因此两个文件合计最低 **24** 用例。A4 的 ≥6 用例可计入 Project 测试，不另行推导总量为 30。（R1、R2：“≥ 12 用例”；A4：“≥ 6 用例”）
- A4 至少覆盖 CREATED／ACCEPTED／BLOCKED／COMPLETED／FILED／DECIDED 六类；其余验收约束仍独立有效。（A4：“至少 6 类”）
- “预期文件 ≤18”“+/- 在 2200-3000 区间”属于预估，未被写成硬拒收额度；`+/-` 的具体统计口径未定义。（Executor 原文）
- snapshot 增量保留为实际 `N`，不能固定成 4：原文仅估算“约…= 4 + Event/EventType 字段”。（A11）
- 无明确截止日、总工时或轮询间隔；v1.0 无 `<1s` 实时性要求，该目标归 host adapter。（引文：“v1.0 不追求实时性（< 1s latency 是 host adapter 的事）”）

**V｜版本与依据**

- 依据为 ADR-0015 charter／§execution roadmap step 2、ADR-0018 Event Model、ADR-0019 Failure 设计，以及前序 TASK-20260509-006；boundary 接入来自 TASK-005。（引文：`ref_charter`、`ref_adr`、`ref_predecessor`；决议 2）
- v1.0 frozen `event.schema.json` 决定事件枚举 12 值；ADR-0018 minimal 的 8 值不构成缩减依据。（引文：“已经 v1.0 frozen 12 个 event_type enum 值”）
- ADR-0018 当前 Proposed，要求本任务 R3 改为 Accepted，并补齐签署、测试清单和开放问题状态。（R3：“Proposed → Accepted”）
- v1.x 扩展、TASK-008 migration、TASK-010 MCP 及 TASK-009..011 release 链是后续范围；本任务“进 RC 候选”不等于授权执行发布链。（引文：“只剩…TASK-008 + release 链…非协议核心”）
- 所引用文件全文未提供；本结果只使用原文明确转述的约束，不补造引用文档规则。

**C｜完成、拒收与未决局部**

完成须联合满足 A1—A12，不能仅以用例数量或 RC 描述代替验收：

| 验收项 | 必须交付的证据或结果 |
|---|---|
| A1—A2 | 核心导出 import smoketest；公开 Event dataclass；`len(EventType) == 12` |
| A3—A4 | `TestSubscribeEvents`；`TestPollOnce` ≥6 用例并覆盖指定六类 |
| A5 | `TestBoundaryEventIntegration`，验证 write_review 违规 emit |
| A6 | `TestFailureRecoveryEvents`，三种 failure／recovery 事件全部接入 |
| A7—A8 | `TestSessionLostEvent`；`TestRoleSwitchEvent` |
| A9—A10 | `TestEventDedup`；`test_event_record_schema_compat` |
| A11 | 更新后的 `test_public_surface` 通过 |
| A12 | ADR 完整收尾、REPORT-007、归档、push、CHANGELOG，以 adr／git log／changelog diff 核对 |

来源：§3“验收标准（12 条）”及各行同名证据。

原文将全部完成的结果声明为 v1.0.0 RC 候选条件全部达成；这不是当前已经通过验收的事实。（引文：“完成本任务后”“RC 候选条件 100% 达成”）

具体歧义或冲突须保留：

- **事件数量笔误：**决议 5 标题写文件类“11 个”，列表尾写“8 个”，实际只列 7 个；A4 又称“文件类 8 事件”。明确列名仍是 7+5=12，不能补造第八个文件事件。
- **覆盖要求冲突：**总体要求“12 个事件类型全部有 trigger 实现 + 测试守门”，风险 5 却说“剩余在 v1.x 补”。A4 的六类加 A5—A8 明确覆盖全部 12 类；风险缓解语句不能无说明地成为删去验收项的依据。风险 5 的“A6/A7/A8…覆盖 4 个”也与实际 3+1+1=5 不符。
- **触发细则衔接不完整：**决议 2 定义 `_CREATED`／`_FILED` 为新文件落盘，决议 6 又允许 mtime 增加路径；既有文件仅修改是否应再次产生这些事件，语义未统一。首次 REPORT 接受、done 加归档，也没有在“仅比较 status”的说明中完整展开。
- **首次快照未明确：**“区分‘新建’和‘已存在’”明确要求避免混淆，但订阅时如何初始化已有文件、如何对待已有 REVIEW，未给具体规则。
- **缓存措辞不一致：**决议 6 标题称“单调 cache”，正文明确跨 poll 不抑制；应保留正文的周期范围，同时标明标题不一致，不能推导永久去重。
- **未来 envelope 立场冲突：**决议 1 允许“v1.x…派生不够再加”，Reviewer 却写“永远不加”；对本任务禁止新增没有冲突，对未来版本存在冲突。
- **进度表述未解释：**“第 4/7”与“最后一环”“7 抽象…全落地”同时出现，缺少其余进度依据；不影响明确交付边界，但不能据本文独立证明所有 RC 前置条件已满足。
- 未规定异常后的停止／升级接收方及处理流程；未来测试是否通过属于待产生结果，不是边界歧义。

**B｜独立禁止与限制**

- 本任务不得新增 `EVENT-*.md` 或第 5 类 envelope。（决议 1：“不新增”；Reviewer：“新增…→ 拒”）
- EventType 不得偏离 frozen schema 12 值。（Reviewer：“偏离 schema 12 值 → 拒”）
- reference impl 不得自动后台轮询、引入该用途线程／asyncio，或使用 inotify 等真实 OS watcher。（决议 3、7；Reviewer 对应拒收项）
- v1.0 不持久化事件流、不实现 `Project.tail_events()`；事件只作当时订阅通知，caller 自行记录的许可不取消实现侧禁令。（决议 4：“不持久化事件流”“caller 自己决定是否记录”）
- 跨 agent ordering／Lamport clock 明确“永远不做”。（决议 7）
- 不实现 MCP `subscribe_events` tool，不塞入 `MIGRATION-1.0.md` 内容；分别属于 TASK-010、TASK-008。（Reviewer：“→ 拒”）
- 不新增 `TASK_REASSIGNED`／`REVIEW_AMENDED` 等细分事件，留待 v1.x 视使用情况决定。（决议 7）
- boundary 插桩仅限前述 `write_review` 路径，不动 `boundary.py` 核心逻辑；不得修改 `test_project_failure` 或破坏 TASK-006 既有测试。（风险 2、4；Reviewer）
- 以上禁止均与完成义务独立成立；完成其他交付不能抵消任一明确拒收项。