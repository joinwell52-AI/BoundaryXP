## I｜输入与作用域

- **任务身份**：ADMIN → ME，协议 `fcop`、版本 `1`、优先级 `P0`；本次是 TASK-002，整改 ADR-0007..0014 并重组文档入口，不是实施完整 AI OS。  
  来源：“sender: ADMIN”“recipient: ME”“priority: P0”“整改 ADR-0007..0014 + 文档入口重组”。
- **仓库范围**：业务操作限定在 `D:\FCoP`；CodeFlow 仅作为跨语言契约、兼容与后续通知的关联方。  
  来源：“本 TASK 100% 在 `D:\FCoP` 仓内发生”“不在 CodeFlow 仓动 schema”。
- **定位与交付范围同时成立**：FCoP 定位为 AI OS 的 POSIX 协议层，定义七个核心抽象的契约；v1.0 仅冻结最小可稳定运行语义。  
  来源：“定位升级到 AI OS 协议层”“scope 仍要『最小可稳定运行』”。
- **输入依据**：TASK-001 的八份 ADR roadmap、ADMIN 五项决议、两段朋友建议及观察链均是整改背景；不是把朋友提出的全部批评都纳入 v1.0。  
  来源：“v1.0 只接 ADR-0015..0021 这 7 份的内容；其余进 v1.x 排期”。

## O｜产物与交付

### 本 TASK 必须交付的文件及状态

| 对象 | 必须达到的结果 | 短原文依据 |
|---|---|---|
| TASK-002 | `docs/agents/tasks/TASK-20260509-002-ADMIN-to-ME.md` 存在，commit、push 成功；最终归档到 `log/tasks/` | “写 TASK-002”“commit + push”“归档到 log/tasks/” |
| ADR-0015 | `adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md` 完整稿，`Status: Accepted` | “charter 完整稿 Status: Accepted” |
| ADR-0016..0021 | 六份草稿大纲，各自为 `Status: Proposed`，不要求本 TASK 全部成为完整稿 | “共 6 份草稿大纲存在，全部 Status: Proposed” |
| 八份旧 ADR、索引 | 按下表更新旧 ADR 状态，`adr/README.md` 收录 ADR-0015..0021 | “状态全部更新”“索引含 ADR-0015..0021” |
| 发布文档 | `docs/releases/1.0.0.md`、`1.1.0.md` 重写大纲，采用 AI OS Protocol 叙事 | “2 份”“narrative 升级” |
| 唯一入口 | 新建 `docs/getting-started.md`，合并 standalone 与 primer，覆盖 L0 framing 与 L1 跑通；不能继续依赖读者翻多份文档才能入门 | “L0+L1 唯一入口”“看完还要去翻其他文档”的反例 |
| 旧入口 | 删除 `docs/fcop-standalone.md`、`docs/fcop-standalone.en.md`；将 `primer/fcop-primer.md` 归档到 `primer/_archived/` | “已删”“已归档” |
| README 与首页 | `README.md`、`README.zh.md` 首段及 `docs/index.html` 的 Hero、What is FCoP 段采用新 framing；首页 EN/ZH 同步，入口内容不再重复，作导航 | “Agent Runtime Protocol — the AI OS protocol layer”“作纯导航” |
| 两类规则文件 | `fcop-rules.mdc`、`fcop-protocol.mdc` 顶部 description 加入 AI OS 协议层定位；`_data/` 两份真本同步到 `.cursor/rules/` 两份副本 | “4 份（2 真本 + 2 副本）”“副本与…真本一致” |
| REPORT-002 | 报告写完，完成三视角自验，随后 final commit、push | “REPORT-002 写完”“final commit + push” |

### 旧 ADR 逐份处理与新 ADR 身份

| 旧 ADR | 状态／指向 | 对应新内容 |
|---|---|---|
| 0007 | Superseded by ADR-0015 | AI OS Protocol Charter |
| 0008 | Superseded by ADR-0016 | 七抽象 JSON Schema，reframe |
| 0009 | Superseded by ADR-0017 | REVIEW 文件类型，v1.0 最小 surface |
| 0010 | Superseded by ADR-0020 | Agent Boundary & Capability |
| 0011 | Deferred to v1.1+ | Task.risk_level 延后 |
| 0012 | Deferred to v1.2+ | Review.decision needs_human 延后 |
| 0013 | Deferred to v1.2+ | Review.human_approval 延后 |
| 0014 | Deferred to v1.1+ | Skill.tools[] risk metadata 延后 |
| 无旧项 | 新增 ADR-0018、0019、0021 | 分别为 Event Model、Failure & Recovery Semantics、Encoding Abstraction |

来源：决议 4 逐项映射表；“只在 Status 行注明 Superseded/Deferred 与指向”。

### ADR-0015 必须承载的内容

- **Context / Decision**：引用 TASK-002 背景、两段朋友建议、定位与 scope 的调和；逐条固化五项决议、七抽象表和四层架构图。  
  来源：“5 项 ADMIN 决议固化 + 7 核心抽象表 + 4 层架构图”。
- **Design Details / Non-Goals**：七抽象逐项最小语义、Reference Encoding、与 CodeFlow TS mirror 的跨语言契约；明确不做 Kernel、完整 OS及 v1.0 延后项。  
  来源：“跨语言契约（与 CodeFlow TS mirror）”“不做 Kernel；不做完整 OS”。
- **Alternatives**：记录否决旧五字段路线、直接做完整 AI OS、v1.0 直接实现四层架构的理由；分别是 Event/Failure 缺失、通用 OS 越界、过度工程及两层渐进更稳。  
  来源：“Alternatives”中 A/B/C 三项。
- **Consequences**：记录定位和外部期望升级、CodeFlow 流程首例、时间及文档成本、永久兼容压力；保留“不影响 Zenodo DOI”“不影响 fcop-rules 版本号”。必须写入 CodeFlow 临时继续 pin `fcop>=0.7.2,<1.0`、1.0 发布后再升级的选项。  
  来源：“interim option…必须有”“必须明写这条不可逆性”。
- **Timeline / Sign-off**：载明 R 中路线图、遵守 CodeFlow §3.3.1.b 五步流程；记录 ADMIN 已批准。  
  来源：“timeline 必须 honor…5 步流程”“Sign-off｜ADMIN 已批准”。

## A｜动作与依赖

- **直接进入整改**，不再增加 Plan 模式细化作为前置；按原文十三步覆盖任务落盘及首次推送、charter、六份大纲、旧 ADR 和索引、发布大纲、入口合并与清理、README、首页、规则同步、报告归档及最终推送。  
  来源：“直接进入执行”“整改执行计划（13 步）”。
- **提交粒度是独立义务**：步骤 6、9、12 各自独立 commit；此外保留步骤 2 的 TASK commit + push 和步骤 13 的 final commit + push。原文没有要求每个里程碑都单独 push。  
  来源：“每个里程碑（步骤 6 / 9 / 12）独立 commit”。
- **规则同步有方向**：修改 `src/fcop/rules/_data/` 真本，再同步 `.cursor/rules/` 副本；四份均须满足 description 升级与一致性，正文保持不动。  
  来源：“2 真本 + 2 副本”“正文不动”。
- **spec 替换是发布时义务**：在 v1.0 ship 时，以 `spec/fcop-runtime-protocol-v1.0.md` 取代 `spec/fcop-spec-v1.0.3.md`；十三步和当前验收未将此列为即时交付。  
  来源：“在 v1.0 ship 时取代为”。
- **后续通知单独办理**：Issue #2 通知 CodeFlow 是必须发生的后续动作，但本 TASK 不执行；ADR-0015 ship 后单开 TASK。  
  来源：“必须在 Issue #2 上发后续 comment”“不是本 TASK 范围”“ship 后单开 TASK”。

## P｜参与关系

- **ADMIN 决策、ME 执行并自验**：五项决议已由 ADMIN 选定，charter 标记 Accepted 有既有批准依据；其余六份新 ADR 仍为 Proposed。  
  来源：“全部选定推荐方案”“ADMIN 当面拍板”“全部 Status: Proposed”。
- **三种视角由报告编写者自行检查**，不等于指定三个独立审查人；原文未另设接收人或新增审批程序。  
  来源：“我必须三角度自验”。
- **分层责任**：Kernel 的 Scheduler/Event Loop/State Machine 属 reference implementation；`fcop-mcp`、`fcop-claude`、`fcop-cli` 属 Host Adapter；CodeFlow、Cursor、Claude Desktop 属 Application。FCoP 只定义协议契约。  
  来源：“不是协议本体”“Host Adapter，类比 libc”“用户态产品”。
- **历史可追溯对象涵盖所有 contributor**：旧 ADR 保留，使其能看到原计划、改向原因及新方向。  
  来源：“任何 contributor 应能看到…全过程”。

## R｜数量、额度与时间

| 边界 | 结果与简短依据 |
|---|---|
| ADR 数量 | 新 ADR 共 **7 份 = 1 份 Accepted 完整 charter + 6 份 Proposed 大纲**；旧 ADR 共 **8 份 = 4 Superseded + 4 Deferred**。来源：“ADR-0015..0021”“ADR-0007..0014”。 |
| Event 最小集 | 事件数量保留变量 \(n\)，\(n∈\{5,6,7,8\}\)；本次不能代选。来源：“最小事件集（5-8 个）”。 |
| charter 篇幅 | “~300 行”为近似预期，不是精确行数或硬上限。 |
| 入门体验 | L0 “30 秒 framing”、L1 “5 分钟跑起来”为入口体验目标，不是执行者工时额度。 |
| 执行轮次 | 可跨多轮，不强求单轮完成。来源：“13 步可在多轮回复内完成”。 |
| 后续路线图 | D+0 起步；D+7 七份新 ADR 全部完整稿；D+14 reference impl 开工；D+42～D+56 `fcop@1.0.0` 上 PyPI。来源：“Timeline”。 |
| 延期计算 | 相对旧 D+14 发布计划，延期 **28～42 天**；不据此安排具体日期。来源：“从 D+14 推到 D+42 ~ D+56”。 |

D 的具体日历基准未明确；后续 v1.1/v1.2 节奏由后续 ADR 决定。文档面“15+ 份”是影响估计，不替代逐项交付要求。来源：“之后 v1.1 / v1.2 节奏由后续 ADR 决定”“文档面 15+ 份要动”。

## V｜版本与依据

### 七抽象的逐项版本边界

| 抽象 | v1.0 必须限定的最小内容 | 留后续版本的内容 |
|---|---|---|
| Agent | Lifecycle 状态集、身份字段 | layer / capability 详细内容 |
| IPC | Task、Report、Issue、Review 四类 envelope 最小字段及 filename grammar | risk_level enforce、human approval |
| Encoding | Markdown 为 reference encoding，抽象层与实现层分开 | JSON、SQLite、event stream 替代 |
| Event | 5～8 个事件、事件与文件关系 | event log 文件类型、replay |
| Failure | 失败模式枚举、恢复动作枚举；ADR-0019 §Recovery 仅给 Session 最小 hook | Session 完整恢复语义与实现 |
| Boundary | can / cannot capability schema 占位 | role-based ACL |
| Audit | REVIEW 文件类型最小 surface | needs_human、human_approval，v1.2+ |

来源：“v1.0 最小冻结内容 / 留给 v1.x”表；“v1.0 仅在 ADR-0019 §Recovery 里给最小 hook”。

- **边界细化是当前大纲义务**：ADR-0018/0019/0020 必须明示事件、失败恢复、Boundary 的冻结粒度，不能把细化留到实现时随意扩展；具体取值目前未选定，不等于文本歧义。  
  来源：“草稿大纲里明示边界”。
- **其他版本归属**：Mobile/Cloud adapter 具体设计为 v2+；risk_level 的 event tag reframe 为 v1.1，ADR-0023 是否开立仍是条件；规则正文重组、Skill 完整字段为 v1.1；`requires_rollback_plan` enforce 为 v1.2。EVENT 文件是否需要仅在 ADR-0018 大纲讨论，不构成本 TASK 实现授权。  
  来源：“不属于本 TASK 的延后事项”表。
- **兼容约束覆盖整个 1.x**：任何 1.x schema 变动均不得破坏 1.0.0 用户，而非只约束某一抽象或某一次升级。  
  来源：“任何 1.x 内的 schema 变动都不能 break 1.0.0 用户”。

## C｜完成、停止与待明确处

- **闭环必须同时满足**：十三步验收全部通过，并在 REPORT-002 写完时完成提案者、执行者、审查者三视角自验。任一项失败，TASK-002 不闭环。  
  来源：“13 步是否全部有交付物”“如果三角度任何一条 fail，TASK-002 不闭环”。
- **自验覆盖**：五项决议逐条进入 charter Decision；timeline 诚实；不成为无所不包的蓝图；七抽象边界收紧；未修改 Python 实现；保留八份旧 ADR；getting-started 能独立承担入门。  
  来源：“审查者视角（提前预登记自检项）”。
- **文本中的勾选不是外部执行证据**：“本 TASK 文件存在 ✅”只是原文陈述，不能据此确认仓库文件、提交或推送的实际状态。
- **具体冲突与缺失**：
  1. 背景称八份旧 ADR“全部加 `Status: Superseded`”，详细映射、步骤 6 和验收则要求四份 Superseded、四份 Deferred。上表按反复出现的详细要求列示，保留该总述冲突。
  2. 风险 #5 写“不动 src/”，步骤 12 却明确要求修改 `src/fcop/rules/_data/*.mdc`。**目录级禁令与指定文件修改直接冲突**；“不动 Python 实现代码”本身明确，两者不能被合并成毫无冲突的规则。
  3. Issue #2 通知分别写“ADR-0015 完成后”和“ship 后”；排除在本 TASK 外明确，但完成与 ship 是否同一时点未定义。
  4. CodeFlow §3.3.1.b 五步流程、朋友建议全文和 TASK-001 未附完整内容，无法补造其细节。
  5. REPORT-002 文件路径未给定；自验句“有没有保留…（违反风险 #6）”括注方向不严谨，风险 #6 和其余明确要求均是**必须保留**。

未规定额外升级审批机制，也未给“现在就”的数值时限。四层架构图作为设计表达、否决 v1.0 四层实现直接到位，可以同时成立。

## B｜独立禁止与限制

- **不得将 Kernel、Host、Application 纳入 FCoP 协议本体，不做完整或通用 AI OS。**来源：“FCoP 不包含…”三项；“不做通用 AI OS”。
- **不得把延后内容提前塞入 v1.0，或以朋友的十一条批评扩大冻结范围。**来源：“其余进 v1.x 排期”。
- **不得删除八份旧 ADR、复用 ADR 编号或改写其历史正文；仅改 Status 及指向。**来源：“ADR 编号永不复用”“旧 ADR 文件保留在仓里”“只在 Status 行”。
- **不得修改 Python 实现代码、CodeFlow 仓 schema 或两类规则正文。**来源：“不动 Python 实现代码”“不在 CodeFlow 仓动 schema”“正文不动”；`src/` 目录冲突见 C。
- **不得把本 TASK 扩展为 reference implementation、PyPI 发布、外部通知或其他后续实现任务。**来源：“reference impl 由后续 ADR 各自的 PR 落地”“不是本 TASK 范围”；路线图记录义务仍须履行。
- **不得以文档存在代替内容验收、以单项通过代替整体闭环。**来源：“5 项决议是否每条都体现在…”“任何一条 fail…不闭环”。