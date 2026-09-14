# 界痕 · BoundX

<p align="center">
  <img src="assets/branding/v1/BoundX_Logo_EN_white.png" alt="界痕 BoundX Logo" width="320">
</p>

[正式 Logo 素材与下载](assets/branding/README.md)

> **执行之前，先把任务边界算清楚。**

## 独立仓库与源码运行

本项目已从 CodeFlowMu 的 `boundx/` 组件迁出，独立仓库为 [joinwell52-AI/BoundX](https://github.com/joinwell52-AI/BoundX)，当前保持私有。本机唯一工作目录为 `D:\boundx`，不需要母仓目录。当前源码版本为 `1.2.4-preview.1`；迁移和协议修订不是新版 Release、公开发布或许可证变更。原母仓测试仅是历史记录，迁移来源与独立验证见 [迁移记录](docs/REPOSITORY-MIGRATION.md)。

已安装 Node.js 22.18+ 和 Python 3.10+ 后，在本仓库根目录执行：

```text
npm ci
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r python/requirements.txt
npm run ui
```

Linux/macOS 使用 `.venv/bin/python`。开发验证使用 `npm test`、`npm run test:ui` 和 `.venv\Scripts\python.exe -m unittest discover -s python -p "test_*.py"`。安装依赖后，ADMIN 检查不调用模型或远端 API。下文产品方案、旧预览下载包和母仓评审记录保留历史语境，不代表本仓库已经发布这些产物。

BoundX 是一个可嵌入、可服务化的任务边界预检引擎（Task Boundary Preflight Engine）。它通过 Python、CLI、MCP、HTTP、Web 表单或宿主插件接收任务，用统一 7+1 和确定性规则检查缺项、数值冲突、禁止对象碰撞、交接缺口和步骤成环，再输出带原文证据的结果或干净工单。它可以独立使用，不是 CodeFlowMu 独占组件。

**源码新功能：1.2.4-preview.1。** BXP-0001 `0.3.0-draft.1` 同步修订中英文规范，补齐完整 Schema 校验、精确十进制、来源注册与作用域；BXP-CALC `1.0.0-draft.2` 包含 208 条冻结向量。协议参考计算器新增锁定的 Ajv 依赖，使用前执行 `npm ci`。现有 ADMIN/PM 产品入口及旧下载包保持不变；未公开发布或启动认证。详见 [协议修订与迁移](protocol/CHANGES-0.3.md)。

**统一标识：** 中文正式名称“界痕”；英文开源/协议标识 `BoundX`；短命令 `bx`；模块前缀 `@boundx`。界痕以三层语义对齐和 7+1 边界可追溯为统一内核。详见 [命名与协议标识](docs/NAMING.md)。

**[协议入口：BXP-0001 v0.3 Draft →](protocol/)** · [英文规范](protocol/BXP-0001.md) · [中文译本](protocol/BXP-0001.zh-CN.md) · [任务 Schema](protocol/schemas/boundx-task-v1.schema.json) · [结果 Schema](protocol/schemas/boundx-result-v1.schema.json) · [BXP-CALC 1.0 套件](protocol/conformance/bxp-calc-v1.0.json)

**[产品手册 →](docs/BOUNDX-PRODUCT-MANUAL.md)** · **[轻量产品与发布方案 →](docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md)**：核心与通用入口免费，行业语义包、企业配置和 FDE 落地用于定制交付。当前决定是在手册定稿后建立独立 BoundX 开源仓库并采用 GNU AGPL v3；两份文件仍是评审草案，本次提交不改变 `codeflowmu` 许可证，也不授权立即公开。

BXP-0001 冻结 I/O/A/P/R/V/C+B 的核心含义，规定原文 Span、`resolved/unresolved/absent`、类型化区间/集合、强制前置图和命题一致性，以及始终为空的业务决定与执行授权。它目前是仓库评审草案，不是已发布行业标准。当前产品 API 是既有预览实现；BXP IR 尚未替换产品入口，也没有静默兼容或自动迁移。

## 第一次了解界痕

**[软件工程与 AI 任务语义包：107 个动作框架及完整 7+1 词条资产 →](domain-packs/l2/software-ai/)** · [使用说明](docs/SOFTWARE-AI-DOMAIN-PACK.md) · [清单](domain-packs/l2/software-ai/manifest.json) · [动作词条](domain-packs/l2/software-ai/actions.json)

**[019：软件工程与 AI 用例 121—140 实际回归](docs/USER-CASES-019.md)**。新增 Token、源码行、PR、GB 量纲，行内阶段文件交接、自然语言目标/保护名单、审批 quorum、Root 权限状态冲突与代词/效果身份挂起；同时纠正“有日期即有限集”“不同补丁必然同一变量”“图有环即线上必死锁”等过度结论。20 条原文与测试 fixture 均可复跑。

**[018：新增 101—120 用例、实际区间结果与未完成项](docs/USER-CASES-018.md)**。修复美元、压力等单位、指标相交、角色误切与长对象截短；未确定同名关系时给出假设下的计算和具体建议。[数学公式与源码方法](docs/QUANTITY-BINDING-018.md)。新增用例仍是部分支持。

**[编号 1—100、另 20 个中文数字变体：实际计算与未覆盖项](docs/USER-CASES-017.md)**。含长文本、WP-DATA 工作包、逐例原文、真实 7+1 和计算建议；请求成功不作为语义通过。

**[017 实现：从中英动作关系得到 7+1](docs/SEMANTIC-CONTRACT-017.md)**。读取、生成、发送、执行者/审批者分别建模，文件供给区分缺少产出和生成条件未明确；附计算公式、源码入口与十条用户原文的实际回归。ADMIN 无模型调用。

**[7+1 怎样从原文得到：GitHub 源码、原始论文与选型研究](docs/RESEARCH-7PLUS1-EXTRACTION.md)**。核对 FRET、CNL2ASP、Rimay、GF、APE 的抽取机制，附实际语法探针；区分可借鉴的方法、零模型限制和尚未接入的设计。

**[ADMIN 原文计算：七要素、独立 B、实际结论与建议](docs/ADMIN-BOUNDARIES-016.md)**。包含扣款空区间、目标/禁止名单交集、条件缺支、授权冲突、WP 文件来源缺口，以及十条用户原文的实际结果和支持限制。B 单独显示，计算表达式直接显示，技术详情折叠。

**[显式 WP 工作包检查：七要素 + B、分包建议、全局禁令继承与限制](docs/WORK-PACKAGES-013.md)**。已接入本地 ADMIN 页面；不按编号生成流程，不宣称跨包预算或停机已验证。

**[ADMIN 数学计算与 012 轮支持状态：三类引擎、公式、解析限制和实际测试记录](docs/ADMIN-COMPUTATION-STATUS-012.md)**。保留当轮结果；后续三层展示与局部条件/交接计算见上方 015 更新，复杂用例仍是部分支持。

**[Python 三类计算：安装、数学公式、原始巡检任务结果与限制](docs/ADMIN-PYTHON-011.md)**。新版 ADMIN 页面调用本机 Python，使用 portion、Z3、NetworkX；不调用模型。需要安装 Python 依赖，旧便携包尚未包含本次更新。

**[ADMIN 纯计算更新：三层建议、具体补全案例、组合公式与测试依据](docs/ADMIN-CALCULATION-010.md)**。不调用模型；检查结果是建议与待核对项，不认证任务已无歧义。

**[阅读产品介绍：让任务在分工之后，仍然回答原来的问题 →](docs/INTRODUCTION.md)**

用一份真实任务介绍七参数、ADMIN 检查、PM 拆分后的计算与建议，附实际输入输出和构造对照。

BoundX（可嵌入、可服务化的任务边界预检引擎），便携预览版本 1.2.0-preview.1，既有审阅协议版本保持 1.0.0。技术标识为 `boundx`。结构化比较内核不需要第三方运行依赖；新版 ADMIN 三类计算需要 Python 及锁定的库。源码保存在私有仓库内，尚未发布到 PyPI、npm 或插件市场。

Windows 便携包的解压、示例、MCP 配置和 CodeFlowMu 使用区别，见 [下载包首次使用](QUICKSTART.md)。便携包内置 Node.js，不必下载整个产品源码。仓库源码更新不代表已安装的 CodeFlowMu 自动获得新工具。

**当前状态：** `1.2.4-preview.1` 源码包含 BXP-0001 `0.3.0-draft.1` 与 BXP-CALC `1.0.0-draft.2`，尚未创建新版 BoundX Release；协议修订不等于公开发布、标准采用或认证授权。

**[本版说明：1.2.0-preview.1](docs/releases/1.2.0-preview.1.md)** · **[历次版本记录](CHANGELOG.md)**

**[产品功能与七参数](docs/FUNCTIONS.md)** · **[真实三项派单与 PM 根职责的计算结果](docs/THREE-TASK-CASE.md)**

**[豆包 PM 实测：三组规划与提醒前后变化](docs/DOUBAO-PM-TEST.md)**：六次真实 API 调用，保留派单、收口条件、人工映射与界痕反例；有回应不等于边界改善。

**[普通用户入口设计提案](docs/USER-PRODUCT-DESIGN.md)**：保留最初设计范围；当前实际能力以[界面使用指南](docs/UI-GUIDE.md)为准。

**界痕是一个独立的任务边界计算顾问。** 它接收任务原文及结构化映射，计算规划和派单相对于基线的变化，给出可复核的依据、反例与具体建议，并计算哪些发现尚未得到完整回应。它不依赖 CodeFlowMu，也不替任务授权方或负责人裁决业务。

## 解决什么问题

**先看 [七参数与一个简单任务的真实计算结果](docs/SEVEN-PARAMETERS-EXAMPLE.md)**：包括七个字段的含义、原文映射、实际返回的三项缺口，以及“提交报告”变为“修复后交报告”的反例。

| 参数 | 含义 | 要明确的问题 |
|---|---|---|
| I — Input | 输入与对象 | 检查什么，范围在哪里？ |
| O — Output | 交付物 | 交什么，交给谁？ |
| A — Actions | 允许动作 | 可以检查、运行或修改什么？ |
| P — People / Responsibility | 责任分工 | 谁负责、谁执行、谁独立观察？ |
| R — Resources | 资源约束 | 时间、调用量、费用的边界是什么？ |
| V — Version / Provenance | 版本与来源 | 依据哪个版本、哪些证据？ |
| C — Completion / Stop | 完成与停止 | 什么证据足以交付，何时停止或申请变更？ |

七参数是原文约束的组织字段，不是七个自动评分指标。填满不证明任务理解正确；当前先由调用方提供原文映射，界痕再检查缺口与差异。

委托方要求“检查并提交报告”，负责人却在规划中增加“修复通过才能交付”。界痕将这项变化展开为原文对照和条件反例：**报告已完成、修复未完成时，原条件满足，新条件不满足。** 负责人据此核查变化是否有依据，决定修改规划、解释差异或申请变更。

这种计算适用于任务委派、团队协作与 Agent 轮换中的边界核查。它计算已表达的约束，不直接测量模型智力，也不能证明负责人理解了全部业务意图。

## 三项服务：给什么，算什么，返回什么

| 服务 | 调用方提供 | 界痕计算 | 返回结果 |
|---|---|---|---|
| 原任务检查 | 原文、七参数引用、动作和完成条件映射 | 映射缺口、引用与结构是否合法 | 待补充项、明确的候选补充建议 |
| 规划与派单检查 | 已确认的基线、总规划、各份派单及依赖 | 动作差异、总规划完成条件变化、七参数引用变化、未知依赖与有向环 | 原文对照、变化依据、符号反例、后果说明与建议 |
| 回应检查 | 本次审阅结果和已有回复 | 回复结构是否合法、哪些发现尚未回应 | 待回应 ID、回应状态；业务决定始终为空 |

候选补充交任务授权方确认；规划差异交任务负责人解释。缺少映射不等于原文缺少要求，文字或动作标签不同不等于越权。子任务目前检查映射缺口与动作差异，尚未证明全部子任务的完成条件组合起来等价于总任务。

## 界痕与宿主系统各自负责什么

| 界痕负责 | 宿主系统负责，例如 CodeFlowMu |
|---|---|
| 定义输入输出协议并校验输入 | 从聊天、任务文件和派单中准备输入；可用人工或模型整理 |
| 对结构化边界进行确定性计算 | 决定何时自动调用，如提交任务、完成规划、派单或接班时 |
| 返回发现、证据引用和具体建议 | 展示结果、送达提醒，保存原文、基线、审阅和回复 |
| 计算尚未完整回应的发现 | 跟踪回应、催办、转交授权申请及恢复接班现场 |
| 保留“不裁决”的输出语义 | 验证身份与授权，执行已有负面清单及业务流程 |

**自动调用、界面交互和通知是宿主适配的开发任务，不是界痕计算内核的职责。** 宿主可以全自动调用界痕，不要求用户手动运行命令。本文命令行是独立调用入口；CodeFlowMu 的历史适配状态见 [CodeFlowMu 使用说明](https://github.com/joinwell52-AI/codeflowmu/blob/181a38f5ba3d1d8d66041352ea28be1c56c084f8/docs/engineering/BOUNDX.md)，不属于本仓库的运行依赖。

界痕通用接口无状态，不自行保存任务现场或发送通知。“必须回应”在内核中体现为可计算的待回应清单，不是内核能保证负责人收到提醒或采取行动。`needs_admin` 表示请求任务授权方澄清，宿主负责实际转交。

## 内核怎样计算

### 完成条件：集合差与符号反例

设原条件集合为 S₀，新条件集合为 S₁，且各条件按“全部满足”解释。内核先计算新增条件 S₁∖S₀ 和遗漏条件 S₀∖S₁，再构造使前后结果不同的一组真假赋值。

例如原条件是 r（报告完成），新条件是 r ∧ f（报告完成且修复通过）：

| r：报告完成 | f：修复通过 | 原条件 r | 新条件 r ∧ f |
|---|---|---|---|
| 假 | 假 | 不满足 | 不满足 |
| 假 | 真 | 不满足 | 不满足 |
| 真 | 假 | 满足 | 不满足 |
| 真 | 真 | 满足 | 满足 |

第三行就是反例：它反驳“前后完成条件完全一样”。该场景不必已经发生；它是在模型假设下可以代入复算的符号状态，不是产品事故证据或裁决。

当前算法将第一个新增条件置假，其他条件置真，产生原真新假的见证；对第一个遗漏条件反向构造原假新真的见证。同一比较若同时增删条件，可能同时存在两个方向的变化，不能只凭一个见证宣称新条件整体更严格。

以上依赖三个前提：条件标识含义一致、变量可独立取值、完成要求按逻辑与解释。如果存在“报告完成必然意味着修复通过”等业务关系，符号反例可能在现实中不可达，需要另行核查。当前不是一般逻辑求解器，也不支持自动证明自然语言等价。

### 依赖图：未知引用与循环等待

每个节点是一项派单，`A.depends_on = [B]` 表示 A 等待 B，源码按 A → B 存储这条等待关系。

- **未知引用**：A 等待 X，但本次图中没有 X。计算器指出等待对象未在图内定义；X 也可能是合法外部依赖，需要说明来源，不能直接判为任务错误。
- **有向环**：A 等待 B，B 等待 C，C 又等待 A。深度优先遍历维护当前访问路径；再次碰到当前路径中的节点时，返回环路。已经遍历完成的节点不构成这种回边，因此多个任务共享一个前置任务不会被当作环。

如果环中任务都尚未完成、每条边都要求对方先完成且没有外部满足途径，这个等待顺序无法启动。但当前接口没有实际执行状态，有环不证明线上已经死锁；无环也不证明一定能完成，资源不足、授权未获批或输入缺失仍可能阻塞。

执行前沿、割边界与一般死锁验证不是当前图检查的已实现功能。现有检查也不会替 PM 调整顺序或自动删除依赖。

### 回应：集合差，不代替验收

待回应项 = 本次发现 ID 集合 ∖ 已有结构完整回复的发现 ID 集合。清空待回应项只代表 `responded`；`resolution_status` 仍为 `not_adjudicated`。声明“已修正”必须由外部证据核验，回复本身不证明修正完成。

这些方法使用已有的集合运算、命题逻辑和图遍历。当前技术价值是把原文引用、可重算差异、解释建议及回应协议连接起来；不声称这些数学方法是原创算法，也不以本地测试替代真实模型效果实验。

## 独立运行

新增的 **PM 任务分解契约计算** 已提供函数、CLI 和通用 MCP 接口：检查原要求追溯、整体交付反例和上下游输入缺口。数学公式、逐项解释、D044 案例、完整数据协议及限制见 [任务分解计算手册](docs/DECOMPOSITION.md)。原有 `reviewPlanBoundary` 的行为保持不变，新能力通过 `reviewDecomposition` 显式调用；CodeFlowMu 的自动接入不在本轮范围。

需要 Node.js 22.18+（本轮实测 24.16.0），使用其原生 TypeScript 支持，无需安装 CodeFlowMu 或 API key。

```text
cd boundx
npm test
npm link
bx task examples/task.json
bx plan plan-input.json
bx responses response-input.json
bx decomposition examples/decomposition-d044.json
npm run mcp
```

CLI 只向标准输出打印结果，不写任务或授权文件。MCP 通过标准输入输出提供 `bx_review_task`、`bx_review_plan`、`bx_review_decomposition`、`bx_check_responses`；由宿主通过挂载/卸载启停。

通用工具无状态。宿主必须验证基线来源、身份与授权，保存原文/结果/回应并交付提醒。直接提交一个 baseline JSON 不证明它得到授权。CodeFlowMu 的默认关闭开关、不可覆盖存储、PM 专用工具和 ADMIN 确认入口属于其适配层，见 [历史适配说明](https://github.com/joinwell52-AI/codeflowmu/blob/181a38f5ba3d1d8d66041352ea28be1c56c084f8/docs/engineering/BOUNDX.md)。

## 数据接口

- `reviewBoundX(document)`：任务授权方入口。
- `reviewPlanBoundary(baseline, plan)`：任务负责人入口。
- `reviewDecomposition(input)`：显式提交要求、子任务契约与完成表达式，计算任务分解关系。
- `compareBoundaryConditions(beforeIds, afterIds)`：合取条件集合差与符号反例。
- `boundaryResponseStatus(review, replies)`：逐项回应核对。

文档格式见 [examples/task.json](examples/task.json)。七参数为 I 输入、O 产出、A 动作、P 责任、R 资源、V 版本与来源、C 完成与停止条件；每个值是原文引用，不知道的项目留缺，不能编造。动作包含 actor/verb/target/quote，完成条件包含 id/quote。

规划输入为 `{baseline: document, plan: {document, tasks:[{id,document,depends_on:[]}]}}`。回应输入为 `{review, replies:[{finding_id,disposition,reason,references:[]}]}`。回应立场为 accepted / partially_accepted / not_accepted / needs_admin，最后一种表示向任务授权方请求澄清；保留该协议枚举以兼容首版宿主。

通用结果责任角色为 `TASK_AUTHORIZER` 和 `TASK_OWNER`。它们可分别映射为用户/规划者、委托方/承包方、ADMIN/PM，计算内核不依赖 CodeFlowMu 生命周期。

## 能力边界

### 多语言

支持 UTF-8 原文；建议输出目前有简体中文（默认）和英文。CLI 使用 `--locale=en` 或 `--locale=zh-CN`，MCP 调用参数使用 `locale`，函数第三/第二参数传入 `{locale: "en"}`。例如：

```text
node cli.mjs task examples/task.json --locale=en
```

原文、引用、发现 ID 和符号赋值不随显示语言改变。JSON 字段名保持稳定英文；诊断错误信息主要为英文。其他建议语言包尚未实现；跨语言同义关系仍需确认，不能把翻译视为语义等价证明。

数学精确性以符号含义和约束映射正确为前提。当前版本不使用模型自动提取自然语言语义；原文引用存在也不证明映射含义正确。未发现差异不等于理解正确，回复不等于问题解决，建议不等于授权。

所有观察保持 `business_decision: null`、`semantic_status: requires_human_review`。七参数填满不是验收证据。完整回应仅变为 responded，仍为 not_adjudicated。没有自动派单、自动修复或基于分数的否决。

详细数学推导、实现和实测依据见 [原理文章](docs/原理与测试依据.md)。

原始设计见 [PM 任务分解一致性计算设计](docs/任务分解一致性设计.md)，实现范围以 [当前手册](docs/DECOMPOSITION.md) 为准。


## L2 软件工程与 AI 任务领域包（已合入主线）

当前主线已包含首个版本化 L2 领域包 `software-ai@0.1.0`：107 个动作框架、54 个实体类型、22 个角色、30 个资源指标、12 个版本/依据类型、10 个完成断言和 8 类风险边界，用于辅助 ADMIN 原文的 7+1 候选抽取。它复用现有 action/role/fact 与 I/O/A/P/R/V/C + B，不建立第二套语义系统。

领域包按注册 ID 显式加载；多框架词条、缺少必要论元和未覆盖表达保持 unresolved。它不从行业常识推断产物、完成或授权，也不代表已经具备运行时 UI 热插拔、企业 L3 上传或通用自然语言理解。直接查看 [完整语义包目录](domain-packs/l2/software-ai/)、[manifest](domain-packs/l2/software-ai/manifest.json)、[动作词条](domain-packs/l2/software-ai/actions.json)、[实体词条](domain-packs/l2/software-ai/entities.json)、[角色词条](domain-packs/l2/software-ai/roles.json)，以及 [分层治理](domain-packs/README.md) 和 [使用说明](docs/SOFTWARE-AI-DOMAIN-PACK.md)。
