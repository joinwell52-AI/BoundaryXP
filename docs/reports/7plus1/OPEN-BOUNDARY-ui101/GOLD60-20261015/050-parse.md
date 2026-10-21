## I｜输入与作用域

- **任务身份**：`TASK-20260522-007`，ADMIN 发给 ME；协议 `fcop v1`，优先级 P1，风险标记 low；关联 TASK-005、TASK-006，替代 TASK-006。线程为 `agent-bringup-prompt-20260522`，会话为 `sess-20260522-me-07`。〔原文：`sender: ADMIN`、`recipient: ME`、`related: [...]`、`supersedes: TASK-20260522-006`〕
- **本次工作对象**：制作随 wheel 部署的中英文 bringup prompt，覆盖从零到能用的“升级 → 验证 → 初始化 → 物理验证 → 体检”，面向需要逐步明确指令的 agent。本文中的安装、初始化、体检指令是**待写入文档的行为要求**，不等于要求本次文档编写者实际初始化项目。〔原文：“落一份……双语档”“每步必须停下报告、不准自由发挥”〕
- **场景分流必须保留**：

  | 场景 | 适用条件 | 指向 |
  |---|---|---|
  | A：装 fcop-mcp | 电脑从未安装 fcop-mcp／Cursor 未挂过 fcop | `agent-install-prompt.zh.md` |
  | B：新建／升级 FCoP 项目 | fcop-mcp 已挂好，在新空目录或已有目录使用最新版 | 本 bringup prompt |

  〔原文：“顶部‘两种新建场景’小表”及对应两行〕

## O｜产物与交付

| 产物 | 必须满足的边界 | 来源短引 |
|---|---|---|
| 中文 prompt | 新建 `src/fcop/rules/_data/agent-bringup-prompt.zh.md` | “新建文件（双语，跟随 wheel 部署）” |
| 英文 prompt | 新建同目录 `agent-bringup-prompt.en.md`；两份均包含顶部场景表及 §1～§6 | “双语档（zh + en）”“六段齐全” |
| 两份 README 索引 | `README.md`、`README.zh.md` 均在“agent 安装”附近加入 bringup 索引，表达换电脑／新项目／升级版本的用途及双语属性 | “在‘agent 安装’段落附近加一行” |
| 条件性清单更新 | release audit 触发文档相关 P0／P1 时，同步 `RULES-release-file-inventory.md` §2 | “触发了就同步” |
| 收尾记录 | 写 `REPORT-007`，归档 TASK-006 和 TASK-007；TASK-006 保留、不删除 | “写 REPORT-007，archive TASK-006 + TASK-007”“append-only 保留” |
| 可选 MCP 资源 | 架构允许时可注册 `fcop://prompt/bringup` → 中文文件、`fcop://prompt/bringup.en` → 英文文件 | “资源注册可选” |

资源注册若需要改 MCP 包结构，本次必须止于 wheel 内文件，注册留到下次发版；不能把可选注册变成验收必需项。〔原文：“如果发现注册需要改 mcp 包结构，本次只落 wheel 内文件”〕

## A｜动作与文档内容

以下六节是两份 prompt 都必须表达的要求。

| 节 | 必须写明的动作、判断和报告 |
|---|---|
| **§1 环境检查** | 执行 `python --version`，要求 Python ≥3.10；用 `pip show fcop fcop-mcp` 查看现状。结果报告 ADMIN 后停止。最新版依据 ADMIN 提供的 PyPI 信息判断；已是最新版不得重复安装；ADMIN 未说升级前不得 `pip install`。〔“报告结果给 ADMIN 后停”“ADMIN 没说升级前不要”〕 |
| **§2 升级** | 命令为 `pip install --upgrade --no-cache-dir fcop fcop-mcp`；全新安装也用相同参数。用 `python -c "import fcop, fcop_mcp; print('fcop:', fcop.__version__, '/ fcop-mcp:', fcop_mcp.__version__)"` 输出两包版本并贴给 ADMIN，由 ADMIN 判断是否够新。〔“全新装也照用，不区分场景”“ADMIN 自己判断够不够新”〕 |
| **§3 API 边界** | 必须有 MCP 工具／Python API 对照表、关键事实、至少六条 anti-pattern，以及不确定时的文档查阅指引；具体约束见下表及 B。〔“边界声明含……对照表 + anti-pattern ≥ 6 条”〕 |
| **§4 初始化** | 调 `fcop_report()` 获取 Phase 1 初始化汇报，列出 solo／预设团队／自定义三类选择，停止等待 ADMIN；选完才能调对应工具。〔“停下等 ADMIN 选”“ADMIN 选完后再调对应工具”〕 |
| **§5 物理验证** | 必须列出下述目录和文件，并用实际 `ls` 验证，把输出贴给 ADMIN；工具返回 OK 不能代替验证。生命周期五个子目录缺任意一个，判定 init 未成功，停止并报告。〔“必须 ls 验证”“缺任何一个就是 init 没成功”〕 |
| **§6 体检** | 最后调用 `fcop_audit(scope="new")`；接手老项目改为 `scope="takeover"`。说明工具生成 `fcop/shared/INSPECTION-YYYYMMDD-NNN-new.md`，并将报告 P0／P1／P2 计数贴给 ADMIN。停止与处置条件见 C。〔“体检（最后一步）”“如果接手老项目……换成……takeover”〕 |

**§3 必须保留的调用关系：**

| 类型 | 对象与调用边界 |
|---|---|
| MCP 工具 | `fcop_report()`、`init_solo()`、`init_project()`、`create_custom_team()`、`fcop_audit()`、`write_task()` 等；先在 Cursor 的 `mcp.json` 挂载 fcop-mcp，重启 Cursor 后在**新会话**直接调用，不通过 Python import。〔“重启 Cursor 后生效”“不通过 Python import”〕 |
| Python 兜底 | `from fcop import Project; Project('.').init(...)`；未装 fcop-mcp 时，唯一合法的 Python 初始化兜底是该路径。`import fcop` 后没有上述 MCP 函数属于正常情况。〔“唯一合法的 Python 兜底”“它们是 MCP 工具，不在 Python 包里”〕 |

**§4 的选择与动作必须一一对应：**

- solo → `init_solo(role_code="...")`。
- 预设团队 → `init_project(team="...")`，预设范围为 `dev-team`、`media-team`、`mvp-team`、`qa-team`。
- 自定义 → `create_custom_team(team_name="...", roles=[...], leader="...")`。

角色码、自定义名称、角色列表和负责人保持待选变量，不替 ADMIN 填值。〔原文：“三选一”“ADMIN 选完后再调对应工具”及对应参数〕

**§5 必查对象完整清单：**

- `fcop/fcop.json`、`fcop/LETTER-TO-ADMIN.md`。
- `fcop/_lifecycle/` 下 `intent/`、`plan/`、`execution/`、`verification/`、`archive/`，五个必须全部存在。
- `fcop/shared/` 下 `TEAM-README.md`、`TEAM-ROLES.md`、`TEAM-OPERATING-RULES.md`、`roles/{ROLE}.md`；角色文件要求同时覆盖团队模式和 solo 模式。
- `fcop/` 下兼容五桶 `tasks/`、`reports/`、`issues/`、`shared/`、`log/`。
- `workspace/README.md`。
- `.cursor/rules/fcop-rules.mdc`、`.cursor/rules/fcop-protocol.mdc`。
- 根目录 `AGENTS.md`、`CLAUDE.md`。

〔原文：“应该看到的物理文件清单”“团队模式 / solo 模式都有”“v3 仍保留”〕

必须包含的 PowerShell 验证命令为 `ls fcop/_lifecycle/`、`ls fcop/`、`ls workspace/`、`ls .cursor/rules/`。〔原文：“PowerShell 验证命令”〕

**本次编写任务还必须执行的验收动作**：各跑一次 `python scripts/release_audit.py` 和 `python scripts/inventory_drift.py`；前者按 O 中条件同步清单，后者须达到三类警告清零；完成报告和归档。〔原文：验收标准 7～9〕

## P｜参与关系与决策权

- **ADMIN → ME**：ADMIN 下达本次文档任务，ME 为接收方；原文未指定额外复核人或独立审批流程。〔原文：`sender: ADMIN`、`recipient: ME`〕
- **未来使用 prompt 的 agent → ADMIN**：每完成一步都必须报告并停止，不能自动进入下一步；这些行为约束须在每段重申。〔原文：“每段都重申一次”“不准自动跳下一步”〕
- **ADMIN 保留的决定**：是否升级、版本是否够新、初始化模式及其参数、P0 出现后的处置，以及是否暂缓 P1／P2。前置检查或工具成功都不能代替这些选择。〔原文：“ADMIN 自己判断”“init 是 ADMIN 选择题”“让 ADMIN 决策”〕

## R｜数量、资源与时间

- 必需交付 **2 份 prompt、2 份 README 索引**；每份 prompt 为顶部场景表加 **6 节正文**，anti-pattern **至少 6 条**。〔原文：新建文件清单、验收标准 1、3、6〕
- 生命周期目录要求是 **5/5 全部存在**；兼容五桶也须列入验证清单。两组中的 `shared/` 与详细文件清单的 `fcop/shared/` 是同一目录，不另造一桶。〔原文：“五个子目录必须全部存在”“兼容五桶”〕
- Python 下限 **3.10，包含 3.10**；安装目标是届时最新版，不预选具体包版本。〔原文：“≥3.10”“不锁版本号”〕
- **无硬截止，但本次会话内须完成草稿和验收**；两项时间表述同时保留。未给出预算或其他额度。〔原文：“无硬截止。本次会话内完成草稿+验收”〕

## V｜版本与依据

- TASK-007 是当前修订依据，替代 TASK-006 的 `==3.0.2` 锁定要求；旧任务只保留记录，不继续作为锁版本依据。〔原文：“本 task 改为‘保持最新版’”“不删，append-only 保留”〕
- 升级命令不得包含 `==X.Y.Z`；3.0.0／3.0.1／3.0.2 是事故与修复背景，不是当前安装目标。〔原文：“不写 ==3.0.2 这种锁版本号”“3.0.2 才修”〕
- 不确定时优先查仓内 `fcop/LETTER-TO-ADMIN.md`，或 `docs/getting-started.md`，不得猜 API；是否能注册资源参照 `mcp/src/fcop_mcp/server.py` 的 resources 注册段。〔原文：“优先读”“如果架构允许（看……resources 注册段）”〕
- “永不过期”是原文目标，明确落实的机制是不锁包版本；原文没有给出未来 API 永远兼容的保证。〔原文：“永不过期（不锁版本号）”〕

## C｜完成、停止与升级条件

- **本次完成条件**：O、A 中的必需文件、内容、索引、两项检查及条件性清单更新均落实，inventory drift 三类警告为零，REPORT-007 写成，两项任务归档；资源注册仍为可选。〔原文：验收标准 1～9、“资源注册可选”〕
- **逐步停止**：每完成一步报告后不得自动继续；环境检查后和初始化选择前尤其明确要求停止。〔原文：“每完成一步必须报告结果”“停下等 ADMIN 选”〕
- **初始化失败停止**：生命周期五目录任意一个缺失即未成功，停止报告 ADMIN；不能以工具返回 OK 抵消。〔原文：“缺任何一个就是 init 没成功，停下报告 ADMIN”〕
- **体检升级决策**：P0 ≠ 0 即项目不合规，必须停止、报告 ADMIN，不得自行整改；P1／P2 为建议级，ADMIN 可决定暂放。P0 = 0 不取消逐步报告等独立义务，也不是本次文档任务的全部完成条件。〔原文：“P0 ≠ 0……必须停下”“P1 / P2 是建议级”〕

## B｜独立禁止与限制

- 不修改 `agent-install-prompt.zh.md`、`LETTER-TO-ADMIN.md`、`fcop-rules.mdc`、`fcop-protocol.mdc`；不做工具层 anti-pattern 防呆；不发布新版本。〔原文：“不做 / Out of scope”五项〕
- 文档必须明确禁止以下六类行为：将角色码 ME 当团队名传入 `init_project(team="ME")`；调用 `fcop.fcop_report()`；在 PowerShell 使用 `head`／`grep`；猜测 `fcop.project.Project.init_project(...)` 等 API；ADMIN 未选就默认 `init_solo()`；仅凭工具返回 OK 判断初始化成功。PowerShell 对应替代为 `Select-Object -First`／`Select-String`。〔原文：“Anti-pattern 清单（已知坑，不要做）”〕
- 不得未获 ADMIN 升级指示先安装、已是最新版仍重复安装、给升级命令锁版本、替 ADMIN 默认任何 `init_*` 选择，或遇 P0 自行整改。〔原文：§1、§2、§4、§6；关联上述边界〕

**原文局部不一致与未细化处：**

- 标题写“五段式正文”，实际列 §1～§6，验收明确“六段齐全”；应完整保留六节要求。〔原文：范围第 3 项标题、验收标准 1〕
- 必查清单包含嵌套文件及根目录文件，但给定四条 `ls` 不直接覆盖所有这些对象；“完整物理验证”义务仍成立，原文未给完整命令集合。〔原文：§5 清单及命令〕
- 未装 MCP 时允许 Python 初始化兜底，但 §4 的 `fcop_report()` 和 §6 的 `fcop_audit()` 依赖 MCP；纯 Python 情况如何完成整条链路未说明。〔原文：§3 兜底、§4、§6〕
- takeover 只明确替换 audit 的 scope，未明确对应报告文件名；逐步停止后的一般恢复信号、Python 低于 3.10 的处理、inventory drift“三类”的具体名称也未细化。不能据此自行补充授权或规则。〔原文：§1、§6、行为约束、验收标准 8〕