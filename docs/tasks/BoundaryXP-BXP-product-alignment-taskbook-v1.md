# BoundaryXP 协议落地与产品统一改造任务书 v1

状态：`AUTHORIZED_FOR_IMPLEMENTATION`  
适用仓库：`joinwell52-AI/BoundaryXP`  
实施目录：`D:\boundx`  
基线分支：`main`  
基线提交：`ae0bab1ac8a99e806327fc30b2b83c295826e5f0`  
协议基线：`BXP-0001 0.3.0-draft.2`  
计算套件：`BXP-CALC 1.0.0-draft.3`  
决定主体：ADMIN  

## 1. 本轮结论

`BXP-0001 0.3.0-draft.2` 已足以作为本轮产品改造的固定合同。当前不新增 `BXP-0002`，也不把自然语言抽取技术、提示词、词库、Lark 文法、模型选择或 UI 流程写进协议正文。

协议规定的是跨实现可交换、可校验、可计算的数据标准：

```text
自然语言任务
    ↓  由 Agent 或其他生产者按 7+1 形成结构化解释
boundx-task/v1
    ↓  BoundaryXP 本地进行 Schema、证据、语义和确定性计算
boundx-result/v1
    ↓  宿主或人类决定是否澄清、修改、审批或执行
```

抽取方法属于 BoundaryXP 产品方法论和生产者实现；BXP 只规定抽取结果必须怎样表达。任何计算结果都不是业务裁决或执行授权。

## 2. 审计判定

### 2.1 协议层

协议层已经形成一套完整标准对象，包含：

- I/O/A/P/R/V/C 与独立 B；
- `resolved | unresolved | absent` 三态；
- Unicode 码点 Span 与多来源摘要；
- Profile、显式作用域和五类确定性计算；
- `validation / completeness / consistency` 三个独立结果轴；
- 固定为空的 `business_decision` 与 `execution_authorization`；
- 精确版本 Schema、RFC 8785 JCS 输入摘要和 208 条冻结计算向量。

本轮不得以产品实现困难为理由反向修改上述合同。若实施中发现协议本身存在不可实现或自相矛盾之处，必须停止对应工作包，以独立问题报告提交 ADMIN，不得直接改协议或刷新冻结期望。

### 2.2 产品层

当前产品尚未真正统一到协议对象。主要冲突如下：

| 编号 | 当前产品事实 | 协议要求 | 影响 |
|---|---|---|---|
| G01 | `src/index.ts` 的 `BOUNDARY_PARAMETERS` 只有七项 | 核心是 I/O/A/P/R/V/C+B | B 未进入主对象与主流程 |
| G02 | `parameters` 以缺省键表示未知 | 每个桶必须显式三态 | 无法区分缺失、歧义和已确认 |
| G03 | 证据只保存引文字符串并用 `includes` 核对 | 精确来源、Unicode 码点 `[start,end)` Span | 重复引文、多来源和偏移无法可靠复核 |
| G04 | 产品输入为 `BoundaryText/BoundaryPlan` | 规范输入为 `boundx-task/v1` | Agent 与第三方不能按协议直接对接 |
| G05 | 产品输出为 `task-boundary-review/v1` | 规范输出为 `boundx-result/v1` | 结果轴、计算来源及空授权字段不统一 |
| G06 | `boundaryDigest` 使用自定义排序与 `localeCompare` | 输入摘要必须使用 RFC 8785 JCS | 摘要不能作为协议摘要 |
| G07 | `BOUNDARYXP_VERSION = 1.0.0`，包版本为 `1.2.4-preview.1` | 产品、协议、Schema、套件版本各自精确声明 | 版本含义混淆 |
| G08 | CLI 的 `task/plan/decomposition/responses` 走旧对象 | 产品入口应消费或生成 BXP 对象 | CLI 不是协议入口 |
| G09 | MCP 仍宣称“Seven parameters”，只暴露旧四工具 | 7+1 与规范对象必须成为主接口 | Agent 无法按标准提交 IR |
| G10 | UI 的本地文本路径产生旧投影和旧审查结果 | UI 必须展示规范三态、证据和三轴结果 | UI 与协议形成两套产品语义 |
| G11 | Python/JS 中存在 UTF-16 代码单元偏移逻辑 | BXP Span 使用 Unicode 码点 | 含非 BMP 字符时证据位置错误 |
| G12 | 参考计算器位于 `protocol/conformance/` | 生产入口与测试必须共享一个实现 | 当前存在“测试实现”和“产品实现”分裂风险 |
| G13 | README/AGENTS 把产品核心表述为 ADMIN 纯本地抽取 | 当前产品决定为 Agent 按 7+1 形成 IR，本地检查与计算 | 产品架构口径需要修订 |
| G14 | 自然语言抽取没有独立金标 | `BXP-EXTRACT` 仍为 RESERVED | 不得宣称抽取符合性或准确率已验证 |

因此，本轮不是继续扩写协议，而是把产品的输入、计算、接口、UI、文档和测试全部收敛到已确定的协议。

## 3. 固定产品边界

### 3.1 Agent 与本地程序分工

1. Agent、规则解析器或其他生产者可以依据 7+1 方法论，从任务原文产生候选 `boundx-task/v1`。
2. 生产者必须保留原文证据；不能确定的内容必须标记 `unresolved` 或 `absent`，不得猜成 `resolved`。
3. BoundaryXP 本地程序负责完整 Schema 校验、Span 核对、来源摘要核对、语义不变量和五类确定性计算。
4. 本地计算不访问网络、不调用模型、不自动读取制度 URL、不自动选择新版本。
5. Agent 的抽取结果不是事实本身；本地校验通过也不证明抽取正确。
6. `business_decision` 与 `execution_authorization` 永远由 BXP 返回 `null`，由宿主系统和责任主体另行决定。

### 3.2 三层文件归属

| 层 | 应存内容 | 不应存内容 |
|---|---|---|
| `protocol/` | BXP 规范、Schema、符合性套件、治理及来源 | 产品提示词、UI 流程、具体抽取器实现 |
| `src/` 与适配器 | BXP 生产计算实现、CLI/MCP/Server 接口 | 第二套核心语义或另一个结果合同 |
| `docs/`、`python/`、语义包 | 7+1 抽取方法、生产者指南、词汇与可选实现 | 对 I/O/A/P/R/V/C+B 的重新定义 |

## 4. 实施工作包

工作包必须按顺序执行。每个工作包单独提交、单独测试、单独回执；前一工作包不通过不得进入下一项。

### WP1：建立唯一生产级 BXP Core

目标：让冻结计算套件与产品入口调用同一个实现。

要求：

1. 将 BXP 计算器、精确十进制、Schema 注册与校验整理为 `src/bxp/` 下的生产模块。
2. `protocol/conformance/` 只能保留向量、生成器和测试入口；测试必须导入 `src/bxp/`，不得复制计算实现。
3. 导出至少以下稳定能力：
   - `evaluateBxpTask(taskObject)`；
   - `validateBxpTask(taskObject)`；
   - `validateBxpResult(resultObject)`；
   - `parseAndEvaluateBxpTask(rawJson)`，负责原始 JSON 字节上限、重复键拒绝和数值精度保护。
4. 明确区分：产品版本、协议版本、Schema 资源 ID、计算套件版本。删除或重命名含义混乱的 `BOUNDARYXP_VERSION = "1.0.0"`。
5. 所有摘要使用协议指定算法；不得把旧 `boundaryDigest` 结果标成 BXP `input_digest`。

验收：

- 208/208 冻结向量完整结果一致；
- 所有协议加固与修订测试通过；
- conformance 目录不再拥有独立计算实现；
- 原始 JSON 路径能够拒绝重复键、超限输入和会发生精度丢失的数值；
- 非 BMP 字符证据 Span 以码点正确复核。

### WP2：建立 Agent 生产者合同

目标：允许 Agent 依据 7+1 形成标准 IR，但不把抽取实现写入协议。

要求：

1. 新增产品文档 `docs/AGENT-BXP-PRODUCER.md`，说明 Agent 如何提交完整 `boundx-task/v1`。
2. 提供中英文最小示例，至少覆盖：
   - 八桶完整且一致；
   - B 为 `absent`；
   - 某桶 `unresolved`；
   - 多来源制度文本；
   - 作用域未明确；
   - 一个确定冲突。
3. 提供机器可取的当前 task/result Schema 与精确版本信息。
4. Agent 必须提交证据 Span、状态和类型化约束；BoundaryXP 不从“字段名称看起来合理”推导事实。
5. 不新增 `BXP-EXTRACT` 通过声明。现有 Python/Lark 规则可保留为可选生产者或研究实现，但必须标为非符合性证明。

验收：

- 一个未接触旧 `BoundaryText` 的 Agent 仅阅读生产者文档和 Schema 即可构造合法 IR；
- 示例经过生产 BXP Core 计算并通过结果 Schema；
- 改变原文一个字符后，旧 Span 或摘要必须失败；
- 未明确内容不会被默认填充。

### WP3：统一 CLI

目标：CLI 成为可实际使用的 BXP 标准入口。

要求：

1. 新增主命令：`bx evaluate <task.json>`。
2. 该命令必须走原始 JSON 严格解析路径，输出完整 `boundx-result/v1`。
3. 新增 `bx protocol-info`，返回产品版本、协议版本、Schema ID、套件版本和声明的符合性等级。
4. 旧 `task/plan/decomposition/responses` 不得继续被 README 描述为 BXP 标准接口。若暂时保留，移动到明确的 `legacy` 命名空间并输出弃用提示；不得静默把旧对象升级成 BXP。
5. 错误也必须遵守协议定义的无效结果合同；只有进程级不可恢复错误才写 stderr 并返回非零。

验收：

- 合法、缺项、未明确、冲突、非法 Schema、重复键、超限与精度反例均有 CLI 测试；
- Windows 和 Linux/macOS 路径均可运行；
- CLI 输出与直接调用 BXP Core 深度相等。

### WP4：统一 MCP

目标：让外部 Agent 直接按 BXP 交换标准对象。

要求：

1. 新增主工具 `bx_evaluate_task`，输入为完整 BXP IR，输出完整 BXP Result。
2. 为需要严格原始传输的集成提供 `bx_evaluate_task_json`，输入 JSON 文本并走严格解析路径。
3. 增加协议信息与 Schema 资源，内容必须来自当前版本注册表，不得手写第二份字段说明。
4. MCP 初始化说明改为 7+1，明确“Agent 生产 IR、本地校验与计算、宿主裁决和授权”。
5. 旧四工具只能作为显式 legacy 能力保留；工具描述不得暗示它们符合 BXP-IR 或 BXP-CALC。
6. MCP 进程保持无状态；不执行任务、不审批、不持久化客户原文、不访问模型或网络。

验收：

- `tools/list` 中 BXP 主工具优先且版本边界明确；
- MCP 与 CLI 对同一输入返回相同结果；
- `business_decision`、`execution_authorization` 始终为 `null`；
- MCP Schema 不再只列七项。

### WP5：统一 UI 与本地检查

目标：UI 展示一套协议语义，而不是把旧启发式结果当成 BXP 结果。

要求：

1. UI 主结果以八桶三态显示，并展示每条证据的来源、引文和码点范围。
2. 分别展示 `validation`、`completeness`、`consistency`，不得合并成一个“通过/不通过”。
3. 显示 Profile、resolved elements、deficit、作用域及五类计算结果。
4. 明示“建议不是业务裁决，结果不授予执行权”。
5. 若 UI 没有宿主 Agent，只能提供以下两种明确模式：
   - 导入或粘贴 Agent 生成的 BXP IR；
   - 使用本地规则生成候选 IR，并醒目标记为“有限覆盖的候选生产者”。
6. 旧 `task-boundary-review/v1` 不能继续作为 UI 主结果。旧规则发现如有价值，必须作为 namespaced 扩展或候选生产者诊断，不得覆盖 BXP 结果轴。
7. 清理所有 UTF-16 偏移；Python 与 JavaScript 跨语言传递时统一使用 Unicode 码点。

验收：

- 中文、英文、混合文本和 emoji/非 BMP 文本均有端到端用例；
- UI 与 CLI/MCP 使用同一计算结果；
- B 独立显示，不并入 A 或 R；
- `unresolved` 与 `absent` 有不同展示和澄清建议；
- UI 不出现“测试通过即允许执行”的文案。

### WP6：文档、示例和版本收口

目标：删除协议确定前的旧口径，形成一个对外可理解的产品。

必须修订：

- `AGENTS.md`；
- 根 `README.md`；
- `QUICKSTART.md`；
- `protocol/IMPLEMENTATION.md`；
- `docs/BOUNDARYXP-PRODUCT-MANUAL.md`；
- `docs/FUNCTIONS.md`；
- `docs/UI-GUIDE.md`；
- `docs/UI-ADVICE.md`；
- `docs/VALIDATION.md`；
- `CHANGELOG.md`；
- `examples/`。

统一口径：

1. BXP 是 7+1 数据与计算标准，不是某种抽取算法。
2. Agent 或其他生产者按 7+1 形成 IR；BoundaryXP 在本地检查与计算。
3. Python/Lark、词库、模型提示等属于实现方法，不属于协议。
4. `BXP-EXTRACT` 尚未启用，不得宣传自然语言抽取已符合协议。
5. 产品入口统一为 BXP；legacy 能力必须显式标识。
6. 当前仍是私有 preview，不自动发布、不改许可证、不创建 Release。

版本建议：完成 WP1–WP6 后将产品版本提升到 `1.3.0-preview.0`；若实施者认为兼容性影响需要其他版本，必须在回执中说明，但不得改变协议版本。

验收：

- 全仓搜索不再出现把核心定义成仅七项的当前口径；历史研究材料中的原始表述可保留，但必须有历史/非规范标签；
- README 的首个可运行示例直接使用 `boundx-task/v1`；
- 文档链接、示例、协议版本和包版本检查通过；
- README 不再声称“产品 CLI/MCP/UI 尚未统一”，而是准确描述完成后的接口。

### WP7：全量验证与 GitHub 审核交付

目标：用可复核证据证明改造完成，而不是只报告“已修改”。

必须运行：

```text
npm ci
npm test
npm run test:ui
.venv\Scripts\python.exe -m unittest discover -s python -p "test_*.py"
npm run test:docs
```

另须增加并运行：

- CLI 与 MCP 同输入同输出测试；
- BXP Raw JSON 重复键与精度测试；
- Unicode 码点跨 JS/Python 测试；
- legacy 不得伪装 BXP 的负向测试；
- 文档当前口径扫描；
- 208 条冻结向量逐对象完整比对。

GitHub 交付要求：

1. 从最新 `origin/main` 建立独立分支，不直接向 main 写入。
2. 每个工作包形成可审查提交；不得用一次巨型提交掩盖迁移过程。
3. 创建 Draft PR，列出基线、提交、文件清单、测试命令、实际计数、已知限制和回滚点。
4. CI 必须实际运行；仅存在 workflow 文件不算通过。
5. 未获 ADMIN 审核不得合并 main、发布 npm/PyPI/GitHub Release、公开仓库或修改许可证。

## 5. 明确禁止

- 不新增 `BXP-0002` 来承载本轮产品实现细节。
- 不修改 I/O/A/P/R/V/C+B 的含义。
- 不把 B 合并进 R 或 A。
- 不让模型输出直接成为业务裁决或执行授权。
- 不把 `complete` 或 `consistent` 显示为“可以执行”。
- 不以通过 208 条计算向量宣称自然语言抽取准确。
- 不用刷新 expected 结果掩盖计算差异。
- 不静默迁移旧对象或旧协议版本。
- 不复制第二套 Schema、计算器、字段枚举或版本常量。
- 不访问、改动或引用其他项目目录作为本轮实现来源。
- 不使用 PowerShell 修改中文文件。

## 6. 停止条件

出现以下任一情况立即停止对应工作包并提交问题报告：

1. 规范文字、Schema 和冻结向量无法同时满足；
2. 必须修改协议核心语义才能继续；
3. 严格 JSON 解析无法在所选入口保证重复键或数值精度边界；
4. JS/Python 证据偏移无法无损统一；
5. 旧接口是否保留会改变外部兼容性且没有证据可判断；
6. 测试期望只能通过重写历史结果才能恢复；
7. 发现需要公开仓库、发布制品或修改许可证。

停止后只报告事实、影响、可选方案与最小复现，不自行改变授权范围。

## 7. 最终完成定义

只有同时满足以下条件，本任务才可提交 ADMIN 审核：

- 产品主输入是 `boundx-task/v1`；
- 产品主输出是 `boundx-result/v1`；
- Agent/生产者负责形成 IR，本地程序负责验证与计算；
- CLI、MCP、UI 共用唯一 BXP Core；
- 八桶三态、码点证据、作用域、Profile、五类计算和三结果轴全部贯通；
- 两个授权字段始终为空；
- 208 条冻结向量及新增端到端测试全部通过；
- 文档不再混淆协议、抽取方法、产品实现与业务授权；
- Draft PR 和完整验证证据已提交；
- 未合并 main、未发布、未公开、未修改许可证。

## 8. Codex 执行回执格式

```text
BOUNDARYXP_BXP_ALIGNMENT_STATUS: COMPLETE | BLOCKED | PARTIAL
BASELINE_COMMIT: <sha>
IMPLEMENTATION_BRANCH: <branch>
PULL_REQUEST: <url or null>
PROTOCOL_CHANGED: false
PRODUCT_VERSION: <version>
PROTOCOL_VERSION: 0.3.0-draft.2
CONFORMANCE_SUITE: 1.0.0-draft.3
WORK_PACKAGES: WP1=<status>, WP2=<status>, WP3=<status>, WP4=<status>, WP5=<status>, WP6=<status>, WP7=<status>
BXP_CALC: <passed>/<total>
CORE_TESTS: <passed>/<total>
UI_TESTS: <passed>/<total>
PYTHON_TESTS: <passed>/<total>
DOC_TESTS: <passed>/<total>
NEW_INTEGRATION_TESTS: <passed>/<total>
LEGACY_STATUS: removed | namespaced_deprecated | blocked_for_admin
KNOWN_LIMITS: <facts>
BLOCKERS: <facts or none>
ADMIN_DECISION_REQUESTED: <exact decision or none>
```

完成回执不得使用“整体正常”“基本通过”等不可复核表述。
