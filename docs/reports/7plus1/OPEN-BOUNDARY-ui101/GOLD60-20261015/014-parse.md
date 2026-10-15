## I｜输入与作用域

- **任务身份**：`TASK-20260509-003-ADMIN-to-ME`；协议 `fcop`、版本 `1`、类型 `TASK`，ADMIN 发给 ME，优先级 P0，状态 `in_progress`，开启日期为 2026-05-09。日期是任务元数据，未给出截止日期。〔引文：`sender: ADMIN`、`recipient: ME`、`priority: P0`、`Opened: 2026-05-09`〕
- **本任务只承担机器可读契约及配套长篇规范**：将已形成的章程与 ADR 决策落实为 7 个 JSON Schema 和一份统一规范，为 v1.0.0 实现提供依据。〔引文：“This TASK-003 only owns item #1”；“7 JSON Schemas + one consolidated long-form spec”〕
- **输入依据**：章程 `adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md`；前序任务 `docs/agents/log/tasks/TASK-20260509-002-ADMIN-to-ME.md`；正文指定 ADR-0015..0022，版本稳定性另引用 ADR-0003。原文没有附这些文件的内容，不能据此补造具体字段和枚举。〔引文：`ref_charter`、`ref_predecessor`；“consolidating ADR-0015..0022”；“link to ADR-0003”〕
- **后续任务不归本任务执行**：TASK-004 的 Python API、dataclass 对齐与 pytest；TASK-005 的迁移 CLI、detect+warn 与迁移文档；TASK-006 的 Issue #2 回复；TASK-007 的规则重发；TASK-008 的 RC 标签和 DOI 更新。〔引文：“next task (TASK-004)”至“TASK-008”；“only owns item #1”〕

## O｜产物与交付

### 1. Schema 目录：恰好 8 个文件

| 路径（均位于 `spec/schemas/`） | 对应内容 |
|---|---|
| `README.md` | 索引、验证方法，并说明 `$id` 是协议标识符，不是抓取 URL |
| `agent.schema.json` | Agent：生命周期与身份 |
| `encoding.schema.json` | Encoding：文件名与工作区目录 |
| `ipc-envelope.schema.json` | IPC：4 种 envelope 类型共享基底 |
| `event.schema.json` | Event Model |
| `failure.schema.json` | Failure & Recovery |
| `boundary.schema.json` | Boundary & Capability |
| `review.schema.json` | Audit／REVIEW |

〔引文：Decision 1 文件树；A1：“exactly 8 files (7 schemas + 1 README)”；“Document this in `spec/schemas/README.md`”〕

**逐个 Schema 的要求：**

- 是合法且可由 Python `json.load` 解析的 JSON；声明 Draft 2020-12，`$schema` 为 `https://json-schema.org/draft/2020-12/schema`。〔引文：A2；“JSON Schema Draft 2020-12”〕
- `$id` 按 `https://fcop.dev/schemas/{abstraction}/v1.0.json` 格式；顶层具有 `title`、`description`、`version: "1.0.0"`。A3 的域名前缀检查不替代 Decision 1 的完整格式要求。〔引文：Decision 1：“`$id: ...`”；“Top-level `title`, `description`, `version`”；A3〕
- 每个字段的 `description` 引用来源 ADR 及章节；每个枚举和必填字段均可通过内联 `description` 追溯决策来源。〔引文：“every field cites its originating ADR”；“every field cites ADR §”；“Each enum / required field traceable”〕
- 在能够减少重复之处，使用相对 `$ref` 引用兄弟 Schema；agent 与 ipc-envelope 引用 boundary capabilities 是示例，不是无条件指定的唯一实现。〔引文：“via relative `$ref` where it cuts duplication (e.g. …)”〕
- 封闭对象使用 `additionalProperties: false`，且该值仅用于封闭子对象；envelope frontmatter 根对象必须为 `additionalProperties: true`，允许 0.7.x 附加字段。〔引文：“on closed objects”；“ONLY on closed sub-objects”；“root uses `additionalProperties: true`”〕

### 2. 长篇规范

产物为 `spec/fcop-runtime-protocol-v1.0.md`，是统一的规范性文档，必须重组 ADR 内容，用实现要求表达协议；ADR 与规范两者都要保留。〔引文：“single normative spec”；“NOT a copy-paste”；“Both must exist”〕

必须具有以下 9 项结构，其中第 4 项的 7 个抽象各自成节：

1. 摘要、状态块、版本。
2. RFC-2119 的 MUST／SHOULD／MAY 合规用语。
3. 五层 AI OS 栈图及 FCoP 的位置。
4. 七个核心抽象。
5. 实现必须保持的协议不变量。
6. Markdown 参考编码及具体文件格式。
7. 版本与稳定性，链接 ADR-0003。
8. 合规测试面，链接 Schema。
9. 术语表。

〔引文：Decision 2 “Structure” 的 1–9 项；“each as one §”〕

逐抽象链接其 Schema 和 ADR；逐规范章节具有 ADR 回链；一致使用 RFC-2119 关键词，不使用 “we”。〔引文：A6：“links each abstraction to its schema + ADR”；“Any spec section without an ADR backref → block”；“No ‘we’ in spec”〕

既有 `spec/fcop-spec-v1.0.3.md` 必须保留，继续作为历史产物及 0.7.x 合规基线；新文件承担 v1.0 规范角色。〔引文：“is not deleted”；“historical artefact + the 0.7.x conformance baseline”〕

### 3. 配套交付

- `pyproject.toml` 的 `dependencies` 加入 `jsonschema>=4.0,<5.0`，只改依赖条目。〔引文：“Only the dependency entry”〕
- 交付 REPORT-003、TASK-003 归档、提交与推送，git 日志体现 TASK-003 已关闭。原文未给出报告及归档的具体落点。〔引文：A8：“REPORT-003 + TASK-003 archive + commit + push”；“git log shows TASK-003 closed”〕

## A｜动作边界

- 业务原文要求立即开始，并先完成 R1；“立即”没有可换算的数值时限。〔引文：“Begin execution immediately. R1 first.”〕
- **一个 TASK，严格按顺序两个提交**，分组和提交信息如下。〔引文：“one TASK, two commits”；“Two commits, in order”〕

| 顺序 | 提交内容 | 原文指定的提交信息 |
|---|---|---|
| R1 | 全部 7 个 Schema、Schema README、依赖补丁 | `spec(schemas): freeze 7 JSON Schemas for FCoP v1.0 abstractions` |
| R2 | 长篇规范、REPORT-003、TASK-003 归档 | `spec: ship fcop-runtime-protocol-v1.0.md (close TASK-20260509-003)` |

- 先落地契约，再落地引用契约的人类可读规范；执行原文列出的手工解析、键值检查、结构阅读和链接审计等验收检查，但不得扩展为本任务内编写 pytest Schema 测试。〔引文：“R1 lands the contract; R2 lands the human-readable spec”；A2–A7；“pytest tests for schemas”列为范围外〕

## P｜参与关系

- ADMIN 是任务发送者和决策来源，ME 是接收者及单人执行者；不授权多代理分工。〔引文：“ADMIN decisions”；“Recipient: ME (solo mode)”〕
- proposer／executor／reviewer 是预检的三个观察角度，原文没有指定三个独立人员，也未指定额外签收人或审批流程。执行者须自行识别阻断条件并停止、拆分。〔引文：“Three-angle pre-flight check”；“If executor catches itself … stop and split”〕
- CodeFlow v2、第三方 host adapters 是规范的下游消费者，不是本任务的执行人或指定验收人。〔引文：“downstream consumers (CodeFlow v2, third-party host adapters)”〕

## R｜数量、资源与时间范围

| 项目 | 边界或必要计算 |
|---|---|
| Schema 目录 | 恰好 `7 + 1 = 8` 个文件；该数量只约束 `spec/schemas/`，不是全任务文件总数 |
| 任务与提交 | 1 个 TASK，2 次提交，R1 在 R2 之前 |
| 验收项 | A1–A8 共 8 项，全部要求满足 |
| ADR 引用证据 | A4 所列 grep `"ADR-"` 计数须 `>30`，即至少 31；原文未明确计数是逐文件还是跨文件汇总。计数不能替代逐字段追溯要求 |
| 长篇规范长度 | 目标约 600 行；超过 800 行触发阻断，恰好 800 行不触发该条数值条件，但仍须遵守约 600 行的控制目标 |
| 总工作量 | “约 600 + 约 7×80 ≈1200 行”是估算；直接算术为约 1160 行，不能据此推出每个 Schema 的硬性 80 行上限 |
| 时间 | “Doable in one session”是可行性判断，未规定会话时长或明确截止时间 |

〔引文：A1、A4；“Acceptance criteria (8)”；“Two commits, in order”；“Cap at ~600 lines”；“exceeding 800 lines → block”；“~600 + ~7×80 ≈ 1200 lines total. Doable in one session”〕

## V｜版本与依据

- **契约优先关系**：Schema 是真相来源，dataclass 应从 Schema 派生；本任务不能通过先改 dataclass 反向决定契约。〔引文：“schema is truth, dataclass is derived”；“Writing schemas first”〕
- **版本分别约束不同对象**：任务信封 `version: 1`；Schema 方言 Draft 2020-12；Schema 元数据 `1.0.0`；Schema `$id` 路径含 `v1.0.json`；新规范为 v1.0；旧规范继续服务 0.7.x。〔引文：frontmatter；Decision 1、2〕
- **兼容性与标识语义**：envelope 根允许 0.7.x 扩展字段；`$id` 无法解析在 v1.0 可接受，无需据此注册域名或部署服务，但 README 必须说明标识符语义。〔引文：“so 0.7.x extra fields stay legal”；“Acceptable in v1.0 — `$id` is a protocol identifier, not a fetch URL”〕

**原文局部不一致：**

- 标题范围是 ADR-0015..0021，正文规范整合与 A4 来源范围是 ADR-0015..0022。两者存在端点差异；正文关于包含 ADR-0022 的明确要求应保留。〔引文：`subject`；Decision 2；A4〕
- 背景声称有 “8 next-task seeds”，实际仅列出 6 项。本任务仍明确只拥有第 1 项，不能补造另外 2 项。〔引文：“listed 8 next-task seeds”；编号 1–6〕
- “Pure `spec/` work”与明确要求修改 `pyproject.toml`、生成报告及归档不完全一致。后者是具体点名的交付要求，不能因概括语句删除，也不能据此扩展其他非 `spec/` 修改。〔引文：“Pure `spec/` work”；Decision 3；A8；R1/R2〕

## C｜完成、停止与升级条件

- **完成要求是合取关系**：A1–A8 全部成立，并满足各 Decision、兼容性限制及提交顺序；通过简单 grep 不等于满足字段来源、链接正确性或规范语义要求。当前 `in_progress` 不是已验收状态，实际检查结果仍待执行产生。〔引文：“Acceptance criteria (8)”及 A1–A8〕
- **范围越界即停止并拆分后续 TASK**：遇到 Decision 4 中任一范围外事项，不得静默扩张当前任务。〔引文：“If any of these creep in … stop and split into a follow-up TASK”〕
- **任一复核阻断条件即停止并拆分**：
  - 任一 Schema 的必填字段缺少 `description`。
  - 任一规范章节缺少 ADR 回链。
  - envelope 根设置 `additionalProperties: false`。
  - 长篇规范超过 800 行。

  〔引文：“Would-block conditions”；“If executor catches itself doing any of those, stop and split”〕

原文未规定拆分后的新任务由谁批准、如何编号，不能补造升级流程。

## B｜独立禁止与限制

- **不得改动整个 `src/`**；`src/fcop/` 与 `src/fcop_mcp/` 均被明确点名。〔引文：“nothing in `src/`”；“nothing in `src/fcop/` is touched”；“Anything in `src/fcop_mcp/`”〕
- **本任务禁止**：Python `models.*` dataclass 修改、`core/schema.py` validator 实现、`Project.*` 新方法、Schema pytest 测试、`fcop_report` CLI 修改、`MIGRATION-1.0.md`、回复 GitHub Issue #2。〔引文：Decision 4 “do NOT do in this task”〕
- **依赖新增不授权 Python 使用代码**，尚不得添加 Python import。〔引文：“no Python import yet”〕
- **不得删除旧规范、复制粘贴 ADR 充当新规范、在新规范中使用 “we”、将 envelope 根关闭**；具体对象及例外见 O、V。〔引文：“not deleted”；“NOT a copy-paste”；“No ‘we’”；“root envelope → block”〕
- **不得静默扩张范围**；依赖补丁、报告与归档这些具体要求不构成其他实现工作或后续发布动作的授权。〔引文：“do not silently expand scope”；“only owns item #1”〕