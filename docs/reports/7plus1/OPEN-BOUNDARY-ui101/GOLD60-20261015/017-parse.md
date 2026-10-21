## I · 输入与作用域

- **任务身份**：`TASK-20260509-006-ADMIN-to-ME`，ADMIN 发给 ME，Solo 模式；协议 `fcop`、版本 `1`，优先级 P0，状态 `in_progress`，日期 2026-05-09。〔引：头部及§7「Recipient: ME (solo 模式)」〕
- **目标**：把 ADR-0019 的 Failure & Recovery 语义接入 v1.0 reference impl，覆盖 **4 类失败、5 类恢复、Session 恢复 hook**；属于 7 抽象 wiring 的第 **3/7**。〔引：标题及开头「把…语义接进 reference impl」〕
- **输入依据**：ADR-0015 charter、ADR-0019、前序 `TASK-20260509-005-ADMIN-to-ME.md`、TASK-003 已冻结的 `failure.schema.json`，以及 0.7.x TASK / REPORT 的历史 `session_id`。这些引用文件的正文未随数据提供，不能补造其内容。〔引：头部 `ref_*`；§1「TASK-003 已把 schema 冻在」；决议5〕
- **主要作用对象**：新建 `src/fcop/core/recovery.py`，增量修改 `models.py`、`project.py`；同时涉及测试、公开面 snapshot、ADR-0019、ADR 索引、CHANGELOG、REPORT 和任务归档。〔引：§7「Touches」；§4 各轮交付物〕

## O · 产物与交付

| 必须交付 | 边界与来源 |
|---|---|
| 内存模型 | 公开 7 个 dataclass：`Failure`、`Recovery`、`RetryPlan`、`ResumePayload`、`RollbackPlan`、`RecoveryOutcome`、`SessionRecoveryResult`。`Failure` / `Recovery` 为纯内存 record。〔A2；决议1「纯内存 dataclass」〕 |
| 枚举 | `FailureType`：TIMEOUT / CRASH / DEADLOCK / DRIFT；`RecoveryAction`：RETRY / RESUME / ROLLBACK / ABORT / ESCALATE；`SessionRecoveryAction`：resume / rollback / abort。〔A3；决议4〕 |
| core 模块 | 导出覆盖 5 类 Recovery 的 reference impl 函数；5 个函数均须 pure、不依赖 Project。〔A1、A7；R1〕 |
| Project API | `report_failure(failure: Failure) -> Receipt`；`recover_session(session_id: str, action: Literal["resume","rollback","abort"]) -> SessionRecoveryResult`；`apply_recovery(failure: Failure, action: RecoveryAction \| None = None) -> RecoveryOutcome`。〔决议4「v1.0 公开面」〕 |
| 私有事件 hook | `_emit_event_stub` 为私有 no-op，仅记录调用；`report_failure` 调用 `_emit_event_stub("FAILURE_DETECTED", subject=failure)`。〔决议2〕 |
| 测试与 snapshot | 模型 import smoketest、枚举长度断言、core / Project / schema / Session 动作限制测试及公开面 snapshot 更新。〔A1—A10〕 |
| ADR 与索引 | ADR-0019 从 Proposed 改为 Accepted，填实 Sign-off，Tests Checklist 标 `[x]`，Open Questions 标解决；同步 `adr/README.md`。〔A11；R3〕 |
| 收尾交付 | REPORT-006、归档 TASK-006、commit、push；CHANGELOG 增加 `Unreleased / Added` 条目。〔A12；R2、R4〕 |

## A · 动作与行为关系

### 失败上报与恢复分派

- `report_failure` **不写盘**，触发上述 stub 并向 caller 返回 receipt；持久化若有需要，由 caller 自己的日志系统承担。这里的记录不具备 IPC envelope 的必填字段、文件名 grammar 或专用落盘目录。〔引：决议1「不写盘，只触发事件钩子…+ 返回 receipt」〕
- `apply_recovery(failure, action=None)` 中，`action=None` 时使用 `failure.suggested_recovery`；显式 action 则指定恢复动作。RETRY / ESCALATE 经此 task / 跨 session 恢复通路处理。〔引：决议4「action 为 None 时取 failure.suggested_recovery」〕

| Recovery | 必须行为 | 副作用、字段及执行责任 |
|---|---|---|
| RETRY | 返回 `RetryPlan` | 包含 `task_path`、`suggested_delay`、`attempt_count`；不写盘，caller 自行重试。〔决议3 RETRY 行〕 |
| RESUME | 返回 `ResumePayload` | 包含 task、last_report、frontmatter metadata；只读。〔决议3 RESUME 行〕 |
| ROLLBACK | 返回 `RollbackPlan` | 包含 `target_commit_hash`、`affected_files`、`executed: False`；只读，不执行 git revert；docstring 明示，测试断言 `executed` 字段。〔决议3；§5「显式标 `executed: False`」〕 |
| ABORT | 真正写 REPORT，`status: aborted` | 调用 `Project.write_report`；reporter 必须等于 `failure.subject.agent_code`，即原 TASK recipient。〔决议3；§5「只有 recipient 能 reply」〕 |
| ESCALATE | 真正写 ISSUE 给 leader 角色 | 调用 `Project.write_issue`。〔决议3 ESCALATE 行〕 |

上述 ABORT / ESCALATE 的写盘产物是 **REPORT / ISSUE**；不能据此把 Failure / Recovery record 写盘。core 函数的 pure 约束与 Project 层的实际写盘义务均须保留。〔关联：决议1、3；A5、A7〕

### Session 恢复

- `recover_session` 仅接受 `resume`、`rollback`、`abort`；非法 action 必须 raise。`session_recovery_call` 的 schema 动作枚举也只能有这 3 值，RETRY / ESCALATE 必须被拒绝。〔引：决议4；A6、A9〕
- 必须接受两种 `session_id`：
  1. `<task_id>:<agent_code>`；
  2. `sess-YYYYMMDD-<agent>-NNN`。
  
  决议5要求先按 `:` 尝试 task-id 形状，不匹配再按历史形状解析，用 `_role_labels` / 文件扫描查 task。〔引：决议5「接受两种形状」「不匹配则按 0.7.x 形状解析」〕
- Session 查找采用 best-effort；风险表规定 task-id 形状解析失败返回 `SessionRecoveryResult.error="session_not_found"`，不抛异常。它与非法 action 必须 raise 是不同条件；解析回退的局部歧义见 C。〔引：§5 session_id 风险行；A6〕

## P · 参与关系

- **ADMIN → ME**：ADMIN 下达任务，ME 以 Solo 模式执行；Proposer / Executor / Reviewer 是原文三视角，未另行指定独立人员或额外审批流程。〔引：开头「Solo 模式任务」；§6、§7〕
- **caller**：接收 receipt / plan / payload；按需自行持久化日志、执行重试；ROLLBACK 的真实执行由 host adapter / human 决定。〔引：决议1、3〕
- **host adapter**：负责 RETRY 计数、防无限重试；不属于本任务实现义务。〔引：决议6「host adapter 责任」〕
- **ABORT 身份关系**：报告者 = failure subject 的 agent_code = 原 TASK recipient，必须满足历史 Rule 5。〔引：§5 ABORT 风险行〕
- **ESCALATE 接收关系**：ISSUE 发给 leader **角色**；原文未指定具体人员。〔引：决议3「给 leader 角色」〕
- **后续任务承接**：真实事件分发交 TASK-007；迁移段交 TASK-008；实际 git revert 交 TASK-006-Phase-2，v1.1 视用户反馈；完整 Session schema 留给 v1.x。〔引：决议2、6〕

## R · 数量、资源与时间范围

- **固定规模**：4 类 Failure、5 类 Recovery、3 类 Session action、7 个公开 dataclass、3 个 enum、3 个 Project 方法；验收标准共 12 条。〔引：A1—A12；R1、R2〕
- **测试下限须同时满足**：
  - core：A7 要求 ≥8 用例，R1 要求 ≥12，因此有效下限为 **≥12**；
  - Project：R2 要求 **≥10** 用例；
  - `apply_recovery`：5 类 Recovery **各 ≥1** 用例，不能仅以总数替代逐类覆盖。
  
  原文未要求这些覆盖额外累加，也未要求两种 Session ID 与三种动作做全部组合穷举。〔引：A5—A7；R1、R2〕
- **公开面数量**：`7 + 3 + 3 = 13` 是原文预计增量；A10 用的是「+N」「约」，并非固定为恰好 13。snapshot 在 R2 一次更新，diff 须全 added。〔引：A10；§5「R2 一次更新；diff 全 added」〕
- **执行组织**：指定 **4 commit**，依次 R1 模型 / core / 测试，R2 Project / 测试 / snapshot / CHANGELOG，R3 ADR / 索引，R4 REPORT / 归档 / push；§4 为各轮给出了 commit 文案。〔引：§4「执行计划（4 commit）」〕
- **时间**：Opened 为 2026-05-09，要求「立即开始 R1」；没有截止日期、数值响应时限、工时或费用额度，不能把“立即”换算成分钟数。〔引：§7及末句〕

## V · 版本与依据

- **实现版本**：本任务范围是 v1.0 reference impl，并兼容 0.7.x 已有的 `status: aborted` 与历史 `session_id`。〔引：决议3、5〕
- **schema 强制对齐**：枚举不得偏离冻结的 `failure.schema.json`；每个 Failure / Recovery instance 序列化后都须通过 schema 校验，failure record 使用 `validate_record` 验证。〔引：A8；§5「每个 Failure / Recovery instance」；Reviewer 拒收项〕
- **本任务明确修订 ADR 表述**：
  - “envelope”按实际 schema 的 discriminated union / `oneOf` record 实现；
  - `session_id` 从 ADR 单一形状扩为两种；
  - 事件触发落实为 stub，ROLLBACK 落实为 plan。
  
  不能用 ADR 被引用的旧表述覆盖这些 ADMIN 决议。〔引：决议1—3、5「修订」〕
- **公开面兼容依据**：增量修改、snapshot diff 全 added，原文称符合 ADR-0003。〔引：§5 公开面风险行〕
- **路线图依据**：ADR-0015 §execution roadmap step 2、ADR-0019，并承接头部所列前序任务；路线图背景不扩张本任务授权范围。〔引：头部及§7〕

## C · 完成、拒收及局部不明确处

**完成须联合满足 A1—A12 及执行计划的附加要求**，不能仅有代码或单测通过：

- import / enum 断言通过；stub 调用可观察，使用 `monkeypatch.setattr` 替换验证。〔引：A1—A4；决议2〕
- 五类恢复行为、读写边界、两种 Session ID、非法 action 抛错、schema 三值锁定及 core 单测满足 A5—A9 和 R1 / R2 的数量要求。〔引：A5—A9；§4〕
- `test_public_surface` 通过，ADR 状态及签署 / 清单 / Open Questions、索引、CHANGELOG、REPORT、归档、commit、push 均完成。〔引：A10—A12；R2—R4〕

**明确拒收条件**：ROLLBACK 实际操作 git；failure enum 偏离 schema；`recover_session` 接受 RETRY / ESCALATE；Failure / Recovery 写盘；塞入 `MIGRATION-1.0.md` 迁移段。〔引：§6 Reviewer「拒收预设」〕

**局部歧义或未说明：**

| 位置 | 应保留的问题 |
|---|---|
| 决议5 vs §5 session_id 风险行 | 前者要求 task-id 形状“不匹配则”回退历史形状，后者说“解析失败直接返回”错误。未区分“不匹配”“解析失败”“查找不到 task”的具体边界；必须保留双形状支持与错误返回要求，不能自行取消其一。 |
| 决议2 vs R2 | stub 验证写在 `tests/test_fcop/test_failure.py`；R2 指定 `tests/test_fcop/test_project_failure.py`。是否要求两文件并存、或测试位置表述不一致，原文未说明。 |
| 决议1 vs A2 / R1 | 决议1将 `SessionRecoveryCall` 也列入 record 并称实现为 dataclass，但明确列出的 7 个公开 dataclass 没有它。其是否另建、是否公开未定；session_recovery_call 的三值 schema 约束仍明确。 |
| R3 vs §6 Executor | R3要求修改 Tests Checklist、Open Questions 并同步索引；Executor 简述为“R3 仅 ADR 元数据”。“仅”的范围未解释，不能据此删去 R3 明列交付。 |
| API 与查找细节 | 非法 action 的异常类型、历史 session 多匹配时的选择规则、未列字段及具体返回构造，数据未给全；相关 schema / ADR 正文也未提供。 |

原文没有另外规定超时停止或受阻升级流程；Recovery 的 ESCALATE 是实现行为，不自动构成本任务管理上的升级规则。

## B · 独立禁止与限制

- Failure / Recovery 不得作为文件 envelope 落盘；`report_failure` 不写盘。caller 自行记录日志的许可，不解除实现侧限制。〔引：决议1；Reviewer〕
- RETRY 不写盘，RESUME / ROLLBACK 只读；ROLLBACK 不实际执行 git revert，v1.0 不引入 git 操作依赖。该限制针对恢复实现，不取消 R4 的 commit / push 交付。〔引：决议3；A12、R4〕
- 本任务不得实现 FAILURE_DETECTED / RECOVERY_INITIATED / RECOVERY_COMPLETED / SESSION_LOST 的真实推送；私有 stub 仍必须实现。〔引：决议2、6〕
- `recover_session` 与 session_recovery_call 均不得接受 RETRY / ESCALATE，也不得提前加入推迟的动作值；`apply_recovery` 仍须支持全部 5 类。〔引：决议4；A5、A9〕
- DRIFT **自动检测永远不做**；这不取消 DRIFT 作为 FailureType 的支持。〔引：决议6；A3〕
- 不实现包含 LLM context / tool history 的完整 Session schema，不承接 host adapter 的防无限重试责任，不加入 `MIGRATION-1.0.md` 失败处理迁移段。〔引：决议6；Reviewer〕
- core 的 5 个 reference impl 函数不得依赖 Project；公开面修改须保持 additive，不能以删除现有符号完成 snapshot 更新。〔引：A7；§5、§7〕