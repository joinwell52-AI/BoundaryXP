## I｜输入与作用域

- **任务身份**：`TASK-20260509-005-ADMIN-to-ME`，ADMIN 发给 ME；协议 `fcop` v1，优先级 P0，状态 `in_progress`，开启日期 2026-05-09。采用 Solo 模式，属于 v1.0 七抽象 reference implementation 接线的第 **2/7** 项，前置任务为 TASK-004 的 Audit/REVIEW。  
  引文：“Solo 模式任务”“第 **2/7**”“第 1 个是 TASK-004 的 REVIEW”。
- **业务范围**：把 ADR-0020 的 layer 与 capability 词表接入配置、查询校验及指定写入路径，涉及 Agent、IPC、Audit；实际强制写入范围见 A，开头总述与详细决议的冲突见末尾。  
  引文：“接进配置层 + 校验函数 + 写入路径”“Agent…IPC…Audit”。
- **输入与依据**：`fcop.json`、现有 `TeamConfig`／`_role_labels` 配置载体、`boundary.schema.json` 的 **10 个 token 与 4 条规则**，以及引用的 ADR-0015、ADR-0020、ADR-0003、ADR-0001。正文未提供这些外部文档全文，不能据此补造具体词表或默认 bundle。  
  引文：“冻结了 10 个 capability token 词表 + 4 条 boundary 规则”“ref_charter”“ref_adr”。
- **配置对象身份**：字段落在 `TeamConfig.extra["_role_labels"][code]["layer"|"can"|"cannot"]`；必须区分配置驱动的 agent 与 envelope 中代表人的 ADMIN。  
  引文：“存在 `_role_labels[code]…` 路径下”“是‘人在角色’语义，不是‘config-driven agent’”。

## O｜产物与交付

| 产物 | 必须满足的边界 | 短原文引文 |
|---|---|---|
| `core/boundary.py` | 导出 `LAYER_DEFAULTS`、`Capability`、`BoundaryViolation`、`BOUNDARY_RULES`、`lookup_capability`、`validate_action`，可从 `fcop.core.boundary` 导入 | “公开 API（仅 import 一份就能用）”；A1 |
| `LAYER_DEFAULTS` | 类型为 `dict[str, LayerBundle]`，含 worker／governance／admin 三层默认 capability bundle，与 ADR-0020 决议表及 schema 词表一致 | “3 个 layer 的默认 capability bundle”；A2 |
| `Capability` | `@dataclass(frozen=True, slots=True)`；字段为 `code, layer, can: tuple[str, ...], cannot: tuple[str, ...]` | “表示 `(code, layer, can…cannot…)`” |
| `BoundaryViolation` | 同为 frozen、slots dataclass；字段为 `rule_id: str, actor: str, action: str, target: str \| None, message: str` | 决议 2 字段定义 |
| 规则常量 | `BOUNDARY_RULES: tuple[str, ...]`，包含四条规则 ID；UNKNOWN_CAPABILITY 是另列的 warning | “4 条规则 id 常量”“补充规则” |
| 导出与异常 | `BoundaryViolation` 经 `models.py` 重导出，`BoundaryViolationError` 从 `fcop.errors` 公开；A5 另要求二者可从顶层 `fcop` 导入 | “所以从 `models.py` 重导出”；A5 |
| 配置支持 | `_extract_roles`／`_collect_extra` 接受并保留 layer／can／cannot；serialize → load 后无数据丢失；反序列化 list → tuple | A9；“list → tuple normalize” |
| Project API | 新增 `boundary_violations` 与 `assert_boundary`，行为见 A | “opt-in 显式查询”“opt-in 守门 wrapper” |
| 测试与快照 | 提供规则、配置、Project、review enforcement、导入及公开面测试；更新 `tests/test_fcop/snapshots/public_surface.json` | A1—A10 |
| 文档与收尾 | REPORT-005、归档 TASK-005、commit、push；CHANGELOG 的 Unreleased／Added 条目；ADR-0020 Accepted、签署日期与 commit ref；核对 ADR-0010 的 superseded-by 链接并同步 `adr/README.md` | A11；R3、R4 |

## A｜动作与条件关系

### 查询、校验与写入

| 动作 | 要求及条件 | 短原文引文 |
|---|---|---|
| `lookup_capability(role_code: str, config: TeamConfig) -> Capability` | 按 role code 解析；显式 layer／can／cannot 使用显式值，未声明 capability 的 role 回落 worker default；显式 admin 配置触发异常 | “用显式值，否则回落 layer default = worker”；A3 |
| `validate_action(actor: Capability, action: str, *, target: Capability \| None = None) -> list[BoundaryViolation]` | 按四条规则及词表返回校验结果；通常空列表表示允许，未知 action 的例外见下表 | “空 = 允许”；决议 5 |
| `Project.boundary_violations(actor_role: str, action: str, *, target_role: str \| None = None)` | 显式 opt-in 查询，返回 `list[BoundaryViolation]`，须端到端可用 | 决议 3；A6 |
| `Project.assert_boundary(actor_role, action, *, target_role=None) -> None` | 显式 opt-in 守门；违规抛 `BoundaryViolationError`，合法静默返回 | “违规即 raise”；A7 |
| `write_review` | R2 接入强制校验，必须在写入前调用 `assert_boundary(reviewer_role, "review_decision", target_role=...)`；worker reviewer 评 governance subject 必须抛异常 | A8；“第一个**强制**接 boundary 的写入路径” |
| `write_task`／`write_report`／`write_issue` | 本任务不接入 boundary，维持 0.7.x caller 行为；后续引入的 `enforce_boundary=False` 默认参数属于未来范围 | “**不**接（保 0.7.x callers 不变）” |

### 四条规则与词表外 action

以下保留原文的主体、对象及精确触发条件，不把某个条件不成立解释为整体必然允许。

| 规则 | 触发条件 | 规定结果／记录 |
|---|---|---|
| `NO_ADMIN_PROGRAMMATIC_CREATE` | lookup 时，来自配置的 role 显式 `_role_labels[code]["layer"] == "admin"` | 抛 `BoundaryViolationError(rule="NO_ADMIN_PROGRAMMATIC_CREATE")`；记录 `actor=code, action="create", target=None` |
| `NO_GOVERNANCE_FISSION` | `actor.layer == governance` **且** `action == "spawn_agent"` **且** `target is None` | violation：`actor=code, action="spawn_agent"` |
| `NO_WORKER_REVIEWS_GOVERNANCE` | `actor.layer == worker` **且** `action == "review_decision"` **且** `target.layer == governance` | violation：`actor=actor.code, action="review_decision", target=target.code` |
| `EXPLICIT_OVERRIDES_LAYER` | 显式 `cannot` 包含该 action，不论 layer default 是否允许 | violation：`actor=code, action=action` |
| `UNKNOWN_CAPABILITY` | action 不属于十个 capability token | **不视为 violation**，但返回一条 `rule_id="UNKNOWN_CAPABILITY"`、`severity="warning"` 的 `BoundaryViolation` 通知 caller；表示方式与组合冲突见末尾 |

来源：决议 5 的“触发条件／violations”表，以及“无论 layer default 是否允许”“不视为 violation…返回一条 `severity="warning"`”。

ADMIN 仍允许作为 envelope frontmatter 的 sender／recipient，使用 `validate_role_code(allow_reserved=True)`；这项许可不豁免配置中的 admin 禁令。  
引文：“ADMIN 仍可作为 `sender` / `recipient`…两者不冲突”。

## P｜参与与责任关系

- **下达、执行与签署**：ADMIN 下达，ME 接收并执行；Solo 模式下 ADMIN ≡ ME，由本人完成 ADR sign-off。  
  引文：“Recipient: ME (solo 模式)”“solo 模式 ADMIN ≡ ME，本人 sign”。
- **复核视角**：Proposer／Executor／Reviewer 是原文给出的三视角预飞；原文没有要求另设三个执行主体。Reviewer 列出的拒收与拆任务条件必须保留，见 C、B。  
  引文：“三视角预飞”“拒收预设”。
- **后续责任归属**：BOUNDARY_VIOLATED 推送由 TASK-007 的 Event Model 接收方承担；本任务只完成当前接线范围。  
  引文：“事件留给 TASK-007 接收方实现…推送”。

## R｜数量、资源及时间范围

- **固定规模**：三层、十个 capability token、四个规则 ID；另有一个 UNKNOWN_CAPABILITY warning。不能把 warning 算成第五条 boundary 规则。  
  引文：“3 个 layer”“10 个 capability token”“4 条规则”“补充规则”。
- **测试下限**：四条规则每条至少两个 case，分别覆盖合法与违规，因此逐规则最低覆盖数为 `4 × 2 = 8`；同时须满足 A4 的 `test_boundary_rules ≥ 10`，以及 R1 全套 boundary 单测 `≥ 15`，并覆盖显式 cannot 覆盖默认值。这些是同时成立的下限，不能相加成必须 33 个独立用例。  
  引文：“各自至少 2 个 case（合法 + 违规）”“≥ 10 用例”“≥ 15 用例”。
- **公开面增量**：快照要求 **+5 项＝2 dataclass＋1 异常＋2 方法**；diff 必须全部是 added。具体导出范围有局部缺口，见末尾。  
  引文：“+5 项（2 dataclass + 1 异常 + 2 方法）”“diff 全部是 added 方向”。
- **提交组织**：按原文四轮、四个 commit 交付，不另行分解：

| 轮次 | 原文指定范围 | 指定 commit |
|---|---|---|
| R1 | boundary 模块、models／errors 增量、全套 boundary 单测 | `feat(core): boundary 词表与 4 条规则的 reference impl` |
| R2 | 配置支持、两个 Project 方法、write_review 强制校验、snapshot、CHANGELOG | `feat(project): boundary 接 write_review + Project 公开 API` |
| R3 | ADR 接受与签署信息、ADR-0010 链接核对、ADR 索引同步 | `adr(0020): accept boundary ADR + 索引同步` |
| R4 | REPORT-005、TASK-005 归档、push | `close TASK-20260509-005：boundary 抽象已发车` |

来源：“执行计划（4 commit）”及 R1—R4 表。

- **时间要求**：只规定“立即开始 R1”，未给数值期限或最终交付日期；2026-05-09 是任务开启日期，不是截止日期。未规定人员工时或费用额度。

## V｜版本与依据

- **兼容性基线**：遵守 ADR-0003 additive-only，保留 `TeamConfig.roles: tuple[str, ...]`；利用既有 extra carrier，仅追加 layer／can／cannot 三个 key，序列化路径不变。  
  引文：“不引入 `Role` dataclass”“仅**追加**…三个 key”“序列化路径不变”。
- **本任务明确修订**：ADR-0020 的“`models.Role` dataclass 加字段”设计由本任务决议改为 `_role_labels` 承载；不因此获得改写 ADR 设计正文的许可。  
  引文：“**修订**：v1.0 不引入 `Role` dataclass”；Reviewer：“除 Status 段”。
- **规则与默认依据**：默认 bundle 对齐 ADR-0020 §decision，规则依据 ADR-0020 与 ADR-0015 §抽象 6；新增规则须另有新 ADR。  
  引文：“与 ADR-0020 §decision 表对齐”“需新 ADR”。
- **版本后移事项**：Role dataclass 仅由独立 TASK-005-Phase-2 考虑在 v1.1 引入；给出的 additive 路径是新增 `TeamConfig.role_capabilities: tuple[Role, ...] | None = None`，不是当前实现要求。  
  引文：“独立后续 TASK”“再考虑是否在 v1.1 引入”。

## C｜完成、停止与升级条件

- **验收须覆盖全部 11 项**：A1 模块导入；A2 默认层与 schema 一致；A3 lookup 默认与 admin 拒绝；A4 规则及覆盖数量；A5 导出 smoke test；A6 查询端到端；A7 守门异常／静默；A8 review 写前强制；A9 配置 round-trip；A10 公开面快照；A11 报告、归档、提交推送、CHANGELOG 与 ADR 接受。各项具体边界见 O、A、R。  
  引文：“验收标准（11 条）”。
- **每轮提交门槛**：任何一轮 pytest 红，先修复再 commit；红测不得提交。  
  引文：“任何一轮 pytest 红 → 修完再 commit”。
- **立即拆任务条件**：`TeamConfig.roles` 类型被改。  
  引文：“触发立刻拆任务”。
- **拒收条件**：旧三类 write 方法自动接 boundary、越界改 ADR-0020、增加未授权规则、变更 `BoundaryViolation` 字段，均触发拒收；相关局部冲突见末尾。  
  引文：“拒收预设”。
- **未来状态**：测试是否通过、review 是否触发违规、commit ref 的实际值尚未产生，属于待执行结果，不是边界不明；原文未另设独立审批人或额外接收流程。

## B｜独立禁止与范围排除

- **禁止结构及兼容破坏**：当前不得引入 Role dataclass、改 `TeamConfig.roles` 类型、改既有序列化路径或给 0.7.x callers 自动加校验；dataclass 必须 frozen、slots，can／cannot 用 tuple。  
  引文：“v1.0 不引入”“0.7.x callers 0 影响”“用 tuple”。
- **限制公开面**：`core.*` 按 ADR-0001 视为 internal，不走顶层 `__all__`；A5 的两个明确顶层导入要求须同时保留，不能擅自扩展到全部 core 符号。  
  引文：“**不**走 fcop 顶层 `__all__`”；A5。
- **禁止扩展规则和记录字段**：除四条规则与 UNKNOWN_CAPABILITY warning 外，不得加 boundary 规则；不得变更 `BoundaryViolation` 字段。  
  引文：“任何 boundary 规则新增…拒”“字段变更 → 拒”。
- **当前不实现的事项**：
  - BOUNDARY_VIOLATED 事件触发 → TASK-007；
  - `fcop migrate-fcop-json` 自动加 layer → TASK-008 的 migrate-workspace；
  - 旧三类 write 方法强制 boundary、`fcop_report()` 缺字段警告 → TASK-005-Phase-2；
  - 自定义 capability token 注册机制 → v1.1，依用户反馈。  
  引文：“v1.0 不实现的（独立 TASK）”。
- **ADR 编辑限制**：Reviewer 禁止修改 ADR-0020 的 Status 段以外内容；与签署要求的冲突须保留，不自行豁免。  
  引文：“ADR-0020 改文（除 Status 段）→ 拒”。

## 原文局部冲突与未确定项

| 位置 | 具体问题 |
|---|---|
| 开头总述 vs 决议 3、A8 | “每写一个 envelope 时默认就检查 boundary”与仅强制 `write_review`、旧三类 write 明确不接冲突。详细决议明确了具体路径，但原文没有消除总述冲突。 |
| why now vs 决议 5 | 背景称 governance 给另一个 governance `write_task` 应被 NO_GOVERNANCE_FISSION 拒；精确规则却只在 `spawn_agent` 且 `target is None` 时触发，同时 write_task 不接校验。不能自行把“目标为 governance”加入规则。 |
| `BoundaryViolation` 定义 vs warning | 固定五字段没有 `severity`，但 UNKNOWN_CAPABILITY 要求 `severity="warning"`，且 Reviewer 禁止字段变更。warning 的表达方式未闭合；异常 wrapper 如何区分返回列表中的 warning 与真实违规也未明确。 |
| UNKNOWN_CAPABILITY 与显式 cannot 的组合 | 词表外 action 若同时出现在显式 cannot 中，一处要求“不视为 violation”，另一处要求 cannot 包含 action 即违规；原文未给两者优先级或合并结果。 |
| A4 vs admin 规则入口 | A4 要求 `validate_action` 四条规则各有合法／违规 case，但 admin 规则被明确定义为在 lookup 阶段抛异常；该规则如何归入 `validate_action` 测试未说明。 |
| 导出约定 vs A10 | A10 要求两个 dataclass 计入公开面，但只明确了 `BoundaryViolation` 的 models 重导出路径；`Capability` 如何进入公开面快照未明确。顶层可 import 与进入 `__all__` 并非同一件事，不能仅凭 A5 推断全部顶层导出安排。 |
| R3／风险登记 vs ADR immutable | 要求在 ADR Sign-off 段加日期、commit ref，但又只允许改 Status 段；未给章节结构或例外，不能假定二者属于同一段。 |
| R1 表 vs Executor 描述 | R1 明确要求修改 models.py／errors.py；Executor 却称 R1“无既有 src 修改”，并把这两处修改列入 R2。轮次归属存在冲突。 |
| 配置与默认细节 | 未提供十个 token、三层完整 bundle、`LayerBundle` 定义；部分字段缺失时 can／cannot 如何补齐、显式 can 与默认值如何组合、未知 role code／非法 layer 如何处理，正文未完整规定。风险表同时明确“仅 `layer: "admin"` 一条 raise；其他 default 路径无 raise”，不能自行增加拒绝条件。 |

以上均为来源文本的边界解释；未执行其中业务指令，也未访问引用文件或链接。