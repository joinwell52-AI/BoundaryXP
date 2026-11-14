# BoundaryXP · 界痕

**7+1 任务边界分析与计算复核，供 AI Agent 和多角色协作使用。**

**7+1 task boundary analysis and computational verification for AI agents and teams.**

当一个任务被拆给多个 DEV、OPS、QA，如何确认子任务仍在父任务限定的范围内？BoundaryXP（简称 BXP）把任务文本整理为可追溯的 7+1 边界，让 LLM 进行语义判断，再由原生计算器独立复核提交的形式化输入。在同一份报告里查看任务要求、冲突依据、计算回执和未明确项。

When work is delegated across agents or roles, BoundaryXP helps inspect whether child tasks stay within their parent's stated constraints. An LLM interprets the text; a native calculator independently verifies the submitted formal inputs. Both judgments, source evidence and computation receipts remain visible.

**`boundaryxp-mcp@0.4.0-rc.4` · B-335 · Windows x64 · Node.js ≥22.18 · MIT · Prerelease**

通过标准 **stdio MCP** 接入 Cursor、Codex 等宿主，包含 **18 个工具、10 项资源、中英帮助和本地浏览器工作台**。一个 npm 包即可使用，无需另装 BoundaryXP 工作台、exe 安装器或自建 BoundaryXP 服务器。当前原生包只支持 Windows x64。

Standard stdio MCP for Cursor, Codex and compatible hosts. One package includes the compiled Core and workbench. No separate BoundaryXP installation or hosted BoundaryXP server is required. macOS/Linux native packages are not included in this release.

## 7+1 看什么？ / What does 7+1 mean?

7+1 是七项任务维度，加一项独立禁止边界；不是评分，也不是八个 Agent。

| 维度 / Dimension | 核对内容 / What to inspect |
|---|---|
| **I · 输入 / Input** | 哪些数据、材料和来源可用？ / Which data and sources are in scope? |
| **O · 交付 / Output** | 要交付什么，交给谁？ / What must be delivered, and to whom? |
| **A · 动作 / Action** | 可以执行哪些动作？ / Which actions are specified or permitted? |
| **P · 责任与分工 / Responsibility** | 谁负责、谁配合、如何交接？ / Who owns the work and handoffs? |
| **R · 资源 / Resources** | 工作区、容量、预算等限制？ / Which workspace, capacity or budget limits apply? |
| **V · 版本依据 / Version basis** | 以哪版规则、文档或基线为准？ / Which rule or baseline version applies? |
| **C · 完成与停止 / Completion and stopping** | 什么条件算完成，何时停止？ / What defines completion or a required stop? |
| **+1 B · 独立禁止边界 / Prohibitions** | 哪些事明确禁止？ / What is explicitly forbidden? |

未写明的条件保持“未明确”。L2 行业字典和 L3 企业字典为术语解释提供版本化依据；岗位、姓名及字典条目本身不构成授权。

Missing conditions remain unspecified. Versioned L2 industry and L3 enterprise dictionaries support interpretation; roles and dictionary entries do not grant permission.

## 一个父子任务案例 / A parent–child example

> **父任务 / Parent:** 仅处理测试目录；交付检查报告；禁止部署生产环境。
>
> Only inspect the test directory, deliver an inspection report, and do not deploy to production.
>
> **DEV-01:** 检查测试文件并交付报告。 / Inspect test files and deliver the report.
>
> **DEV-02:** 报告完成后部署生产环境。 / Deploy to production after the report is complete.

需要分别核对 DEV-01 和 DEV-02；不能把一个子任务的结论当作整个项目的结论。DEV-02 的部署条款与父任务的禁止条款构成待分析的文本冲突，报告应能回到这两处原文。

Each child must be assessed against the parent separately. DEV-02 introduces a deployment clause that conflicts with the parent's stated prohibition. This example illustrates what to inspect; it is not a saved execution result or a guarantee that every model extracts it correctly.

支持完整 UTF-8 Markdown/TXT、多级父子任务、多个同角色子任务，以及 `PM → DEV（1/14）` 等标题。显式任务编号、父任务编号和导入预览用于区分节点；同为 DEV 不会把任务合为一个。先确认关系，再提交分析。

Complete Markdown/TXT imports support explicit task/parent IDs and multiple children with the same role. Preview and confirm relationships before analysis.

## 边界怎样计算？ / How does verification work?

1. **导入与确认 / Import:** 预览完整父子任务，绑定需要的 L2/L3 字典。
2. **LLM 语义分析 / Interpret:** 显式提交一次联合分析，形成 7+1、原文证据、语义判断及结构化计算输入。
3. **原生 Core 复核 / Verify:** 对本轮提交的集合、布尔表达式、数值等受支持的形式化查询执行程序核验，记录实际操作数和回执。
4. **对照与追溯 / Inspect:** 对齐同一任务与核验范围，比较 LLM 判断和计算器结果，追溯原文与未明确项。保留失败，不把解析失败当作越界或未越界。

**LLM 判断与计算器复核分别记录。** 计算器不调用模型；它核对提交的形式化输入。计算通过不自动证明语义抽取正确，也不授予业务批准或执行权限。

**LLM judgments and calculator results are recorded separately.** The calculator does not call an LLM: it evaluates supported formal inputs. Successful computation does not prove that text was interpreted correctly. Neither result grants business approval or execution authority.

## 能看到什么？ / What do you get?

- 父子任务树、多个 DEV 节点及完整 7+1 分析。 / Task trees and distinct child assessments.
- 八轴边界雷达、独立 B 禁止边界、条款和原文证据。 / A boundary radar, prohibitions and evidence.
- LLM 判断、形式模型、计算回执及技术报告。 / LLM judgments, formal inputs and verification receipts.
- Markdown 报告、历史结果及失败记录。 / Markdown reports and retained results or failures.
- MCP 与浏览器读取同一份保存数据。 / The same saved project through MCP and the workbench.

雷达表达条款的维度关联，不表示评分、进度或授权大小。The radar shows clause relationships, not scores, progress or authority.

## 安装 / Install

需要 Windows x64、Node.js ≥22.18 和 npm（实测 Node 24.19.0）。首次安装在 PowerShell 执行；已有安装保留自己的 home、data-root 和配置，使用升级入口。

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.4 bxp install --home $BxpHome --version 0.4.0-rc.4
if ($LASTEXITCODE -ne 0) { throw 'Installation failed' }
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
```

**Cursor：** 生成独立工作区配置，打开 `$BxpRoot/workspace`，启用 BoundaryXP。

```powershell
$BxpConfig = Join-Path $BxpRoot 'workspace\.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData
```

**Codex 或其他 MCP 宿主 / Other hosts：** 使用标准 stdio 命令和参数；不同宿主的配置文件位置与格式可能不同。替换下面的绝对路径，保留其他 MCP 配置。

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "node",
      "args": ["C:/absolute/path/install/launcher.mjs", "--data-root", "C:/absolute/path/data"]
    }
  }
}
```

首次连接后，在宿主聊天发送 / After connection, ask:

> 调用 BoundaryXP 的 bx_capabilities 和 bx_workbench_open，返回版本及工作台地址，不提交分析。
>
> Call BoundaryXP bx_capabilities and bx_workbench_open; return the version and workbench URL without submitting analysis.

工作台地址由 MCP 返回，端口动态分配，不要固定旧地址。关闭浏览器不会结束 MCP；最后一个 MCP 客户端断开时服务退出，未完成作业会取消。重连后重新调用 `bx_workbench_open`。

The workbench uses a dynamic local port. Closing its browser tab leaves MCP running; closing the last MCP client stops the backend and cancels unfinished work. Obtain a new URL after reconnecting.

## 模型配置与首次分析 / Model access and first analysis

**只读帮助、读取已有结果和打开页面无需模型 API。新分析需要自己的模型 API/profile；不会自动继承 Cursor 或 Codex 聊天订阅。** 提供商配置见随包交付的 `INSTALL.md`，工具说明也可通过 MCP 直接读取。

Read-only tools need no model key. Analysis uses your configured API/profile and may incur provider charges. Keep credentials in environment variables or an explicit local env file, never in task text. Requested analysis sends selected task/dictionary content to your model provider; Core computation is local.

配置好模型后，将完整任务文本交给宿主 / After configuring your model:

> 用 BoundaryXP 导入下面的完整父子任务，保留每个 DEV 的任务编号，先展示关系预览；确认后保存，使用我配置的 profile 分析一次。返回 LLM 判断、计算器复核、原文依据和工作台地址。失败不自动重试。

> Import this parent–child task into BoundaryXP, keeping every DEV task ID. Preview relationships first. After confirmation, save and analyze once with my configured profile. Return both judgments, evidence and the workbench URL. Do not automatically retry failures.

## 18 个工具怎么用？ / Tool help

在宿主聊天说 / Ask in chat:

> 用 BoundaryXP 查看中文工具说明、完整多 DEV 案例和排障说明。
>
> Read BoundaryXP tool help, multi-DEV examples and troubleshooting in English.

帮助入口：`bx_capabilities({"language":"zh-CN","help_topic":"tools"})`；英文用 `language:"en"`。资源入口：`boundaryxp://help/{zh-CN|en}/{overview|tools|examples|troubleshooting}`。参数以工具发现返回的 Schema 为准。

工具覆盖能力/帮助、profile 查询、L2/L3 字典、任务导入与校验、项目管理、分析提交与取消、作业状态、结果和文件读取、保存操作数的零模型复验以及打开工作台。

Tools cover discovery, profiles, dictionaries, imports, projects, analysis jobs, results, verification of saved inputs and opening the workbench.

## 升级与数据 / Updates and data

已安装用户沿用自己的 `$BxpHome`，不要替换原任务数据目录：

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.4 bxp update --home $BxpHome --version 0.4.0-rc.4
```

自动检查和升级默认关闭，可显式启用；新版准备好后，在相关客户端全部退出后的下次启动切换，不在分析中强制更新。保留原安装、数据和 profile，支持回滚。详见随包交付的 `AUTO-UPDATE.md` 和 `INSTALL.md`。

Automatic updates are opt-in, with safe next-start activation and rollback. Existing data and configuration are retained. The independent 58618 installation is outside this package's update scope.

## 文档与交付 / Documentation and distribution

- [npm 安装入口 / Package](https://www.npmjs.com/package/boundaryxp-mcp)
- [产品资料与 Release / Product repository](https://github.com/joinwell52-AI/BoundaryXP)：当前仍私有，访问需权限；npm 安装不依赖该仓库权限。Currently private; npm installation is independent.
- 完整指南随 npm 包交付：`INSTALL.md`、`AUTO-UPDATE.md`、`guides/TOOLS.md`、`examples/multi-dev-2.md`、`examples/multi-dev-2.en.md`。MCP 内置帮助无需读取私有仓库。

MIT 及第三方 notices 随包保留。Core 以编译后的 Node-API 模块交付，不含原始 C++ 或 JavaScript Core 源码；适配器、UI、提示词及必要资源仍可读。当前预发行不宣称完整协议符合性或所有模型的语义准确率。

The native Core ships without original Core source. Adapter/UI/prompt files and required resources remain readable. This prerelease makes no blanket protocol-conformance or model-accuracy claim.
