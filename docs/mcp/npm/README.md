# BoundaryXP · BXP

**[简体中文](#简体中文) | [English](#english)**

[中文安装与升级](#中文安装与升级) · [Installation and upgrades](#installation-and-upgrades)

---

## 简体中文

**面向 AI Agent 与协作团队的 7+1 任务边界分析和计算复核工具。**

从完整任务要求形成带原文证据的 **7+1 关联表示**，检查父子任务及其组合约束，追溯为什么**越界、未越界，或信息不全**。报告分别保留 LLM 判断、原生计算器复核、原文依据和未明确项。

**boundaryxp-mcp 0.4.0-rc.9 · B-335 · Windows x64 · Node.js ≥22.18 · MIT · 预发行版**

[安装与升级](#中文安装与升级) · [中文产品仓库](https://github.com/joinwell52-AI/BoundaryXP/blob/main/README.zh-CN.md) · [发行下载](https://github.com/joinwell52-AI/BoundaryXP/releases)

通过标准 **stdio MCP** 接入 Cursor、Codex 等宿主。一个包包含 **21 个工具、17 项资源、中英文内置帮助、编译后的 Core 和本地浏览器工作台**。无需另装 BoundaryXP 工作台或自建 BoundaryXP 服务器。当前原生包仅支持 Windows x64，不含 macOS、Linux 原生包。

### 7+1 核对什么？

七项任务维度，加一项独立禁止边界；不代表评分或 Agent 数量。

| 维度 | 核对内容 |
|---|---|
| **I · 输入** | 哪些数据、材料和来源可用？ |
| **O · 交付** | 要交付什么，交给谁？ |
| **A · 动作** | 指定或允许哪些动作？ |
| **P · 责任与分工** | 谁负责、谁配合、如何交接？ |
| **R · 资源** | 工作区、容量、预算和运行时限有哪些限制？ |
| **V · 版本依据** | 以哪版规则、文档或基线为准？ |
| **C · 完成与停止** | 什么条件算完成，何时必须停止？ |
| **+1 B · 独立禁止边界** | 哪些事明确禁止？ |

未写明的条件保持“未明确”。L2 行业字典和 L3 企业字典为术语解释提供版本化依据；岗位、姓名及字典条目本身不构成授权。

### 一个父子任务案例

> **父任务：** 仅处理测试目录，交付检查报告，禁止部署生产环境。
>
> **DEV-01：** 检查测试文件并交付报告。
>
> **DEV-02：** 报告完成后部署生产环境。

每个子任务分别核对。DEV-02 的部署条款与父任务的禁止条款存在文本冲突，报告应能追溯这两处原文。此例只说明核对对象，不是保存的计算结果，也不保证所有模型都能正确理解。

支持完整 UTF-8 Markdown/TXT、多级父子关系、显式任务编号和父任务编号，以及多个相同角色的子任务。DEV-01、DEV-02 是不同节点；支持 `PM → DEV（1/14）` 等标题。先预览并确认关系，再分析。

[交互演示](https://boundaryxp-workbench-demo.joinwell52.chatgpt.site/)提供 B-332 保存记录：RT044 存在严格前置闭环，RT042 是半开区间相邻，L23-050 的责任人指代未绑定。这是历史回放，不代表本轮 MCP 新分析或 B-335 测试结果。

### 边界怎样计算？

1. **导入：** 预览完整父子任务，绑定需要的 L2/L3 字典。
2. **理解：** 显式提交一次 LLM 联合分析，形成 7+1 关系、原文证据、语义判断及形式化计算输入。
3. **复核：** 原生 Core 核验支持的集合、布尔表达式和数值查询，记录实际操作数与回执。
4. **对照：** 对齐同一任务与核验范围，比较判断，追溯原文和未明确项；保留失败响应。

计算器不调用模型。计算通过不自动证明语义抽取正确；LLM 判断与计算复核均不授予业务批准或执行权限。

### 能看到什么？

- 父子任务树、各子任务独立结论和完整 7+1 分析。
- 八轴边界雷达、独立 B 禁止边界和原文证据。
- LLM 判断、形式模型、计算回执及技术报告。
- Markdown 报告、历史结果和失败记录。
- MCP 与浏览器工作台读取同一份保存数据。

雷达表达条款的维度关联，不表示评分、进度或授权大小。

### 快速接入 MCP 宿主

需要 Windows x64、Node.js ≥22.18 和 npm，已实测 Node 24.19.0。首次启动联网下载包及依赖。将以下条目合并到宿主 MCP 配置，保留其他服务；将示例数据路径改为自己的固定绝对路径。

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "npx.cmd",
      "args": ["--yes", "boundaryxp-mcp@0.4.0-rc.9", "--data-root", "C:/BXP/data"]
    }
  }
}
```

这个入口固定版本，不自动升级。Codex、API 配置和管理安装升级见[中文安装指南](#中文安装与升级)。已有用户沿用自己的数据与配置路径。

连接后应显示 **21 个工具**，在聊天里说：

> 调用 BoundaryXP 的 bx_capabilities 和 bx_workbench_open，返回版本及工作台地址，不提交分析。

打开返回的本地地址。端口会随重连变化，请重新获取地址。关闭浏览器不会关闭 MCP；最后一个 MCP 客户端断开后服务退出，未完成作业会取消，因此先完成正在运行的任务。

### 模型配置与首次分析

**默认 host 配置直接使用当前 MCP 宿主中的 LLM，无需为 BoundaryXP 另配模型 API Key。** 宿主读取分析规范、分析完整任务，通过 MCP 提交结构化分析，再读取原生计算回执和报告。MCP 不自行选择宿主模型或读取订阅凭据。独立 API/profile 是可选方式，见[模型配置](#模型配置)。

可以先用[完整多 DEV 案例](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.md)，然后说：

> 用 BoundaryXP 导入完整父子任务，保留每个 DEV 的任务编号，先展示关系预览；确认后保存，使用 host 配置和当前宿主 LLM 分析一次。返回 LLM 判断、计算器复核、原文依据和工作台地址。失败不自动重试。

### 通过 MCP 查看工具说明

在宿主聊天说：**“用 BoundaryXP 查看中文工具说明、完整多 DEV 案例和排障说明。”**

帮助入口为 `bx_capabilities({"language":"zh-CN","help_topic":"tools"})`；资源入口为 `boundaryxp://help/zh-CN/{overview|tools|examples|troubleshooting}`。具体参数以工具发现返回的 Schema 为准，无需读取本地文档。

工具覆盖能力查询、profile、L2/L3 字典、任务导入与校验、项目管理、分析提交与取消、作业状态、结果与文件读取、保存操作数的零模型复验，以及打开工作台。

### 升级与交付

[管理安装和可选自动更新](#升级)保留数据和配置。自动检查和升级默认关闭；准备好的新版在相关客户端退出后的下一次安全启动时生效，不强制中断运行中的任务。

公开仓库提供产品文档与编译发行包。Core 不包含原始 C++ 或 JavaScript 实现源码；适配器、UI、提示词及必要资源仍可读。MIT 和第三方许可说明随包保留。预发行版不宣称完整协议符合性或所有模型的语义准确率。

[目录收录状态](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/DISCOVERY.md)区分已上线入口和待审核申请。


自定义 L2/L3：新增 bx_dictionary_format、bx_dictionary_validate、bx_dictionary_import；页面支持上传、校验、导入及版本绑定。[格式、四份中英文示例与使用流程](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/guides/DICTIONARIES.zh-CN.md)。同版本不同内容拒绝覆盖，旧任务和字典保留。rc.8用户请按升级指南调用rc.9新版安装器，不能依赖旧版固定18工具的自动检查。

### 中文安装与升级

[产品介绍](#简体中文)

**boundaryxp-mcp 0.4.0-rc.9 · B-335 · Windows x64 · Node.js ≥22.18（实测 24.19.0）**

本指南采用固定启动器的管理安装，支持可选自动升级。[快速接入](#快速接入-mcp-宿主)则直接使用固定版本 npx 命令，两者提供相同 MCP 工具。当前不提供 macOS、Linux 原生包。

#### 首次安装

在同一个 PowerShell 窗口执行。首次安装将程序、任务数据、模型配置分开放置；已有安装请沿用原路径，跳到[升级](#升级)。

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use update' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp install --home $BxpHome --version 0.4.0-rc.9
if ($LASTEXITCODE -ne 0) { throw 'Installation failed' }
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
New-Item -ItemType Directory -Path $BxpSettings -Force | Out-Null
$BxpProfiles = Join-Path $BxpSettings 'profiles.json'
$BxpEnv = Join-Path $BxpSettings '.env'
$BxpUtf8 = New-Object System.Text.UTF8Encoding($false)
if (!(Test-Path $BxpProfiles)) { [IO.File]::WriteAllText($BxpProfiles, '{"profiles":[]}', $BxpUtf8) }
if (!(Test-Path $BxpEnv)) { [IO.File]::WriteAllText($BxpEnv, "# Model API configuration`n", $BxpUtf8) }
node $BxpLauncher --manage status
```

安装回执应显示 `READY`、`probe.passed:true` 和版本 `0.4.0-rc.9`。安装器下载指定 npm 版本、校验完整性并探测原生 MCP。安装依赖需要联网，无需编译器、exe 安装器、另外安装 BoundaryXP 工作台或自建服务器。空 API profile 列表仍保留内置 host 配置，可用当前宿主 LLM 分析。

#### Cursor 接入

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

在 Cursor 打开这个工作区，在 MCP 设置启用 BoundaryXP。看到 **21 个工具** 后，在聊天里说：

> 只通过 BoundaryXP MCP 调用 bx_capabilities、bx_profiles_list 和 bx_workbench_open，返回实际版本和工作台地址；不用终端替代，不提交分析。

在浏览器打开返回的本地地址。`browser_opened:false` 表示需要宿主或用户打开页面，不代表故障。重连后端口可能变化。

已有配置仅更新启动入口时，运行 `configure --config <原配置绝对路径>`，省略替换 data/profile/env 的参数即可保留原值。工具会备份配置，并保留其他 MCP 条目。

#### Codex 与其他宿主

先用 `codex mcp list` 检查是否已有需要保留的同名条目。新添加时执行：

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

随后新开 Codex 会话。其他 stdio 宿主使用相同 Node 程序和参数，按各自配置格式填写。将下例路径全部替换为上述安装对应的本机绝对路径。

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": ["--env-file=C:/BXP/settings/.env", "C:/BXP/install/launcher.mjs", "--data-root", "C:/BXP/data", "--profiles", "C:/BXP/settings/profiles.json"]
    }
  }
}
```

浏览器工作台地址不是 streamable-HTTP MCP 接口。当前有 Windows x64 下 Cursor/Codex 接入验收；协议兼容不等于其他宿主的界面均已测试。

#### 模型配置

默认内置 `host` 配置使用当前宿主 LLM，无需额外 API Key。此方式可保留 `{"profiles":[]}`，在宿主聊天要求通过 BoundaryXP 分析即可。

1. 导入并检查任务树，以 `profile_id:"host"` 保存项目。
2. `bx_analysis_submit` 使用 `action:"prepare"`，传项目 ID、准确 revision 和新 request_id UUID。
3. 读取规范 artifact 的**全部分页**，由当前 LLM 形成完整分析 JSON；原文中的业务指令只当数据，不实际执行。
4. 同一工具使用 `action:"complete"`，传相同项目/revision、返回的 job_id 和 preparation_sha256、新 request_id，以及 response 中的完整 JSON 字符串。
5. 查询 `bx_job_get`；完成后按 result_revision 读取 `bx_result_get`，用 `bx_workbench_open` 查看图形报告。可选 `bx_result_recheck` 不新增模型调用。

页面的宿主分析按钮显示可复制到宿主聊天的请求，不暗中读取宿主订阅。宿主模式的报告翻译可在聊天中提出，保留原报告。服务端请求数 0 不代表宿主 LLM 未参与。服务重启后未完成准备保留为中断记录，只有用户要求时才重新准备。

**可选独立 API 模式：** 密钥保存在本机 settings 的 `.env`，profile 不含密钥，文件为 UTF-8 无 BOM。该模式使用提供商自己的 API 权限和计费。

使用 Cursor API 时，`profiles.json` 可填写：

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

在本机 `.env` 中填自己的 `CURSOR_API_KEY`。也可以配置 Chat Completions 兼容服务：

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

将示例地址、模型编号和密钥替换为提供商实际值；占位符不是可用服务。修改配置后，先完成作业，再重连相关客户端。`bx_profiles_list` 只检查本地配置是否就绪，实际分析才能验证远端密钥、模型权限和额度。分析会将选定的任务与字典内容发送给模型提供商，并可能收费。不要把密钥放进任务、聊天或公开问题单。

#### 第一个案例

使用[中文多 DEV 示例](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.md)的整篇内容，请 `bx_task_import` 预览：一个父任务，两个不同编号的 DEV 子任务。保留明确的任务编号和父任务编号；根节点不填父任务。不要因为角色相同就合并子任务。[14 子任务格式](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-14.md)可作扩展示例。

确认预览，保存为新项目，按上面的 host prepare/complete 流程对准确 revision 分析一次，然后查询作业，直到完成或失败。失败不自动重试。读取正式结果，区分 LLM 判断与 Core 复核；打开工作台不会再次提交分析。

`job_id` 不是完成标志。失败回执和原响应会保留，未完成的模型草稿不是正式结果。`bx_result_recheck` 对保存的操作数作零模型复验，保留原结果。

在宿主说：**“用 BoundaryXP 查看中文工具说明、完整多 DEV 案例和排障说明。”** MCP 入口为 `bx_capabilities({"language":"zh-CN","help_topic":"tools"})`；也可将主题改为 `examples` 或 `troubleshooting`。

#### 升级

沿用原安装、数据和配置路径。先完整备份数据与配置，完成作业并断开相关 MCP 客户端，再手动升级。若新开 PowerShell 窗口，请先将 `$BxpHome`、`$BxpData` 分别设为原安装目录和原数据目录；不要照抄新安装示例覆盖自己的路径。

**rc.8可以直接升级到rc.9，无需卸载。** 旧版自动升级自检固定检查18工具，无法通过rc.9的21工具检查；这次请执行下面的命令，由npm临时取得rc.9新版安装器完成升级，不用旧版`launcher --manage update`。新版根据目标包声明核对工具清单，后续工具数量变化不会因此被拒绝。

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp update --home $BxpHome --version 0.4.0-rc.9 --migrate-data $BxpData
```

不要先删除旧版。升级保留任务、失败记录及宿主、模型配置。核心运行包摘要变化时，需显式指定 `--migrate-data <原数据目录>`，复制并校验后保留原目录。本版 MCP 运行包摘要变化，B-335 原生 Core 二进制不变。升级需用原数据路径执行 --migrate-data，校验复制后的新目录并保留原目录。

后续也可运行 `node <home>/launcher.mjs --manage update --version <准确版本>`。升级后重连，通过 `bx_capabilities` 与磁盘 `--manage status` 对照版本。

未发布的本机 rc.2 测试安装曾使用不同包名，需要先用上述新版 bootstrap 命令切换一次；它不是此前 npm 发行版。

##### 原来直接使用 npx 的用户

如果宿主命令直接是 `npx.cmd --yes boundaryxp-mcp@0.4.0-rc.8 ...`，没有管理安装目录，不要直接改成 rc.9 后指向旧数据。先完成作业并断开相关客户端，将 `$BxpData` 设为原数据目录，`$BxpHome` 设为一个新的空安装目录，再执行：

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp install --home $BxpHome --version 0.4.0-rc.8
if ($LASTEXITCODE -ne 0) { throw 'Bootstrap installation failed' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp update --home $BxpHome --version 0.4.0-rc.9 --migrate-data $BxpData
if ($LASTEXITCODE -ne 0) { throw 'Migration failed' }
```

然后按宿主接入章节，将原 BoundaryXP 条目改为新安装目录的 `launcher.mjs`，保留原数据路径、profiles、环境变量及其他 MCP 条目。启动器会使用已校验的迁移副本；原目录保留。不要同时保留两个指向同一数据的 BoundaryXP 连接。

##### 可选自动检查与升级

默认关闭。管理安装可显式开启预发行渠道：

```powershell
node $BxpLauncher --manage auto-update --mode auto --registry https://registry.npmjs.org --channel next --allow-prerelease --interval-minutes 1440
node $BxpLauncher --manage auto-update-check
node $BxpLauncher --manage status
```

不带 `--copy-migrate` 时，遇到核心运行包摘要变化会提示处理，不自动切换。只有确实希望自动复制迁移时才加这个参数。新版在后台准备，所有相关客户端退出后的下一次启动才生效，不强制停止作业。不安装 Windows 常驻服务或计划任务，仅在 MCP 运行期间检查。

只检查或关闭自动更新时，选择对应命令执行：

```powershell
node $BxpLauncher --manage auto-update --mode check
node $BxpLauncher --manage auto-update --mode off
```

通过 `bx_capabilities` 查看 `installation_update`：`PREPARED` 是待安全启动生效，`WAITING_FOR_CLIENTS` 是仍有客户端运行，`APPLIED` 是已生效。`CHECK_FAILED` 保留当前版本并在下一周期再检查；`MIGRATION_OPT_IN_REQUIRED` 需要明确允许复制迁移。直接使用固定版本 npx 的接入没有管理安装自动更新器。

##### 回滚

断开客户端后运行 `node $BxpLauncher --manage rollback`，恢复上一版本及其对应数据目录。迁移副本里的新任务仍留在副本，不会自动合并。回滚出去的版本会暂时阻止自动装回，请保留两份数据。

#### 排障与停用

| 现象 | 检查方式 |
|---|---|
| Connecting 或零工具 | 检查 Node 绝对路径、MCP 输出、JSON 编码和 `--manage status`。用 `--manage doctor` 做隔离 MCP/HTTP 自检。 |
| 显示 21 工具但聊天找不到 | 连接后新开 Agent 聊天。 |
| COMPILER_BUSY | 等待已有作业或明确取消，不重复提交。 |
| JOINT_RESPONSE_NOT_JSON | 保留错误及原响应，格式失败不能当作有效边界判断。 |
| PROFILE_NOT_FOUND 或 API 401/403/429 | 检查 profile、密钥、提供商权限与额度，不自动重试付费分析。 |
| BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS | 完成作业后，统一使用该数据目录的客户端版本、配置并全部重连。 |
| 校验或升级失败 | 保留旧版及失败记录，重新取得可信包，不绕过校验。 |

关闭浏览器不会关闭 MCP。最后一个 MCP 客户端断开后工作台服务退出，未完成作业会取消，请先完成作业。重连后调用 `bx_workbench_open` 获取新地址。

停用时只移除对应宿主条目，保留数据与配置。报告问题时提供版本、错误码和脱敏最小案例，不提供凭据或个人任务库。


自定义 L2/L3：新增 bx_dictionary_format、bx_dictionary_validate、bx_dictionary_import；页面支持上传与校验。[格式、完整示例与使用流程](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/guides/DICTIONARIES.zh-CN.md)。这些能力从rc.9提供；升级后重新发现21工具、17资源。

[English](#english) · [回到语言选择](#boundaryxp--bxp)

---

## English

**7+1 task boundary analysis and computational verification for AI agents and teams.**

Turn complete task requirements into evidence-backed **7+1 relationships**. Inspect parent–child tasks and their combined constraints, then trace why a result is **out of bounds, within bounds or incomplete**. LLM judgments and native calculator results are recorded separately, alongside original evidence and unspecified conditions.

**boundaryxp-mcp 0.4.0-rc.9 · B-335 · Windows x64 · Node.js ≥22.18 · MIT · Prerelease**

[Installation and upgrades](#installation-and-upgrades) · [Public repository](https://github.com/joinwell52-AI/BoundaryXP) · [Releases](https://github.com/joinwell52-AI/BoundaryXP/releases)

Connect through standard **stdio MCP** in Cursor, Codex or compatible hosts. The package includes **21 tools, 17 resources, English and Chinese built-in help, a compiled Core and a local browser workbench**. No separate BoundaryXP installation or hosted BoundaryXP server is required. This release does not include macOS or Linux native packages.

### What does 7+1 mean?

Seven task dimensions plus one independent prohibition boundary—not a score or a count of agents.

| Dimension | What to inspect |
|---|---|
| **I · Input** | Which data, materials and sources are in scope? |
| **O · Output** | What must be delivered, and to whom? |
| **A · Action** | Which actions are specified or permitted? |
| **P · Responsibility** | Who owns the work, cooperation and handoffs? |
| **R · Resources** | Which workspace, capacity, budget or time limits apply? |
| **V · Version basis** | Which rule, document or baseline version applies? |
| **C · Completion and stopping** | What defines completion or a required stop? |
| **+1 B · Prohibitions** | What is explicitly forbidden? |

Missing conditions remain unspecified. Versioned L2 industry and L3 enterprise dictionaries support interpretation; roles, names and dictionary entries do not grant permission.

### A parent–child example

> **Parent:** Only inspect the test directory, deliver an inspection report, and do not deploy to production.
>
> **DEV-01:** Inspect test files and deliver the report.
>
> **DEV-02:** Deploy to production after the report is complete.

Each child is assessed separately. DEV-02 introduces a deployment clause that conflicts with the parent's stated prohibition; the report should trace both source clauses. This illustrates what to inspect, not a saved result or a guarantee of correct model interpretation.

Import complete UTF-8 Markdown/TXT, explicit task and parent IDs, multiple hierarchy levels and multiple children with the same role. DEV-01 and DEV-02 remain separate nodes. Preview relationships before analysis.

[Try the interactive demo](https://boundaryxp-workbench-demo.joinwell52.chatgpt.site/?lang=en) for saved B-332 cases: RT044 has a strict dependency cycle, RT042 has adjacent half-open intervals, and L23-050 has an unresolved owner reference. These are historical replays, not new MCP analyses or B-335 test results.

### How verification works

1. **Import:** Preview the full task tree and bind any L2/L3 dictionaries.
2. **Interpret:** Explicitly submit one joint LLM analysis to produce 7+1 relationships, evidence, a semantic judgment and formal calculation inputs.
3. **Verify:** The native Core evaluates supported set, Boolean and numeric queries, recording actual operands and receipts.
4. **Inspect:** Compare judgments for the same task and scope. Trace evidence and unknowns; retain failed responses.

The calculator does not call an LLM. A successful calculation does not prove that semantic extraction is correct. Neither LLM judgment nor verification grants business approval or execution authority.

### What you can inspect

- Task trees, distinct child assessments and complete 7+1 analysis.
- An eight-axis boundary radar, independent prohibitions and source evidence.
- LLM judgments, formal inputs, calculation receipts and technical reports.
- Markdown reports, historical results and retained failure records.
- The same saved project through MCP and the browser workbench.

The radar shows clause relationships, not scores, progress or authority.

### Quick start with an MCP host

Requires Windows x64, Node.js ≥22.18 and npm; tested with Node 24.19.0. Initial startup downloads the package and dependencies. Merge this entry into your host configuration, retain other servers and replace the example data path with your persistent absolute path.

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "npx.cmd",
      "args": ["--yes", "boundaryxp-mcp@0.4.0-rc.9", "--data-root", "C:/BXP/data"]
    }
  }
}
```

This entry pins a version and does not auto-update. For Codex, API setup and managed updates, follow the [English installation guide](#installation-and-upgrades). Existing users must retain their original data and settings paths.

After connection, expect **21 tools**. Ask:

> Call BoundaryXP bx_capabilities and bx_workbench_open; return the version and workbench URL without submitting analysis.

Open the returned local URL. Its port changes after reconnection; request a new URL instead of saving an old port. Closing the browser leaves MCP running. Disconnecting the last MCP client stops the backend and cancels unfinished work, so finish active jobs first.

### Model access and first analysis

**The default host profile uses the current LLM in your MCP host. No separate BoundaryXP model API key is required.** The host reads the prepared specification, analyzes the complete task, submits structured analysis through MCP, and retrieves native calculation receipts and reports. The server does not select a host model or access your subscription credentials. Independent API profiles remain optional; see [model configuration](#model-configuration).

Use the [complete multi-DEV example](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.en.md), then ask:

> Import this parent–child task into BoundaryXP, keeping every DEV task ID. Preview relationships first. After confirmation, save and analyze once using the current host LLM and the host profile. Return LLM judgment, calculator verification, source evidence and the workbench URL. Do not automatically retry failures.

### Tool help through MCP

Ask: **“Read BoundaryXP tool help, multi-DEV examples and troubleshooting in English.”**

The help entry is `bx_capabilities({"language":"en","help_topic":"tools"})`. Resources are `boundaryxp://help/en/{overview|tools|examples|troubleshooting}`. Use discovered schemas for exact arguments. Help is available directly through MCP without reading local documentation.

Tools cover capabilities, profiles, L2/L3 dictionaries, task import and validation, project management, analysis submission/cancellation, job status, result/file retrieval, zero-model rechecks of saved operands and opening the workbench.

### Updates and distribution

[Managed installation and optional automatic updates](#updates) retain data and settings. Automatic checks and upgrades default to off. Prepared updates activate at a safe next start after related clients exit; running work is not forcibly interrupted.

The public repository provides product documentation and compiled releases. The native Core ships without its original C++ or JavaScript implementation source. Adapter, UI, prompt files and required resources remain readable. MIT and third-party notices are included. This prerelease makes no blanket protocol-conformance or model-accuracy claim.

[Directory status](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/DISCOVERY.md) distinguishes live listings from pending reviews.


Custom L2/L3: bx_dictionary_format, bx_dictionary_validate and bx_dictionary_import, with workbench upload, validation, import and explicit version binding. [Format, four bilingual examples and workflow](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/guides/DICTIONARIES.md). Changed content at the same version is rejected; old tasks and dictionaries are retained. rc.8 users must use the rc.9 installer described in the upgrade guide because the old automatic probe expects exactly 18 tools.

### Installation and upgrades

[Product introduction](#english)

**boundaryxp-mcp 0.4.0-rc.9 · B-335 · Windows x64 · Node.js ≥22.18 (tested: 24.19.0)**

This guide describes a managed installation with a stable launcher and optional automatic updates. The [quick start](#quick-start-with-an-mcp-host) uses a pinned npx command instead. Both provide the same MCP tools. macOS/Linux native packages are not available in this release.

#### First installation

Run these commands in one PowerShell session. For a new installation, keep program files, task data and model settings in separate directories. Existing users should use the [update procedure](#updates) with their original paths.

```powershell
$BxpRoot = Join-Path $env:LOCALAPPDATA 'BoundaryXP'
$BxpHome = Join-Path $BxpRoot 'install'
$BxpData = Join-Path $BxpRoot 'data'
$BxpSettings = Join-Path $BxpRoot 'settings'
if (Test-Path (Join-Path $BxpHome 'active.json')) { throw 'Already installed: use update' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp install --home $BxpHome --version 0.4.0-rc.9
if ($LASTEXITCODE -ne 0) { throw 'Installation failed' }
$BxpLauncher = Join-Path $BxpHome 'launcher.mjs'
New-Item -ItemType Directory -Path $BxpSettings -Force | Out-Null
$BxpProfiles = Join-Path $BxpSettings 'profiles.json'
$BxpEnv = Join-Path $BxpSettings '.env'
$BxpUtf8 = New-Object System.Text.UTF8Encoding($false)
if (!(Test-Path $BxpProfiles)) { [IO.File]::WriteAllText($BxpProfiles, '{"profiles":[]}', $BxpUtf8) }
if (!(Test-Path $BxpEnv)) { [IO.File]::WriteAllText($BxpEnv, "# Model API configuration`n", $BxpUtf8) }
node $BxpLauncher --manage status
```

Expect `READY`, `probe.passed:true` and version `0.4.0-rc.9` in the installation receipt. The installer downloads the exact npm version, checks integrity and probes the native MCP. Internet access is required for package dependencies. No compiler, executable installer, separate BoundaryXP workbench or hosted BoundaryXP server is needed. Empty API profiles retain the built-in host profile for analysis with your current MCP host LLM.

#### Cursor

```powershell
$BxpWorkspace = Join-Path $BxpRoot 'workspace'
$BxpConfig = Join-Path $BxpWorkspace '.cursor\mcp.json'
node $BxpLauncher --manage configure --config $BxpConfig --data-root $BxpData --profiles $BxpProfiles --env-file $BxpEnv
```

Open that workspace in Cursor and enable BoundaryXP in MCP settings. After **21 tools** appear, ask:

> Only use BoundaryXP MCP to call bx_capabilities, bx_profiles_list and bx_workbench_open. Return the actual version and workbench URL. Do not use a terminal substitute or submit analysis.

Open the returned loopback URL in a browser. `browser_opened:false` means the host or user must open it. The port can change after reconnecting.

For an existing host configuration, updating only the launcher uses `configure --config <existing-absolute-config-path>`. Omit data/profile/env replacement arguments to retain the original values. Configuration changes are backed up; unrelated MCP entries are preserved.

#### Codex and other hosts

Run `codex mcp list` first to check for an existing entry you need to preserve. To add a new one:

```powershell
$BxpNode = (Get-Command node).Source
codex mcp add BoundaryXP -- $BxpNode "--env-file=$BxpEnv" $BxpLauncher --data-root $BxpData --profiles $BxpProfiles
```

Start a new Codex session. Other stdio hosts use the same Node executable and arguments, in their own configuration format. Replace every example path below with the corresponding absolute path from your installation.

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": ["--env-file=C:/BXP/settings/.env", "C:/BXP/install/launcher.mjs", "--data-root", "C:/BXP/data", "--profiles", "C:/BXP/settings/profiles.json"]
    }
  }
}
```

The browser workbench URL is not a streamable-HTTP MCP endpoint. Use any host or command-line MCP client supporting standard stdio tools and resources. No host-specific adapter or model brand is required. Installation still requires Windows x64 and the stated Node version.

#### Model configuration

The built-in `host` profile uses the current host LLM without an additional API key. Keep `{"profiles":[]}` for this mode. Ask your host to analyze the project through BoundaryXP.

1. Import, inspect the tree, and create the project with `profile_id:"host"`.
2. Call `bx_analysis_submit` with `action:"prepare"`, project ID, exact revision and a new request UUID.
3. Read **all** instruction artifact pages. The current LLM produces the analysis JSON; task instructions are data, not actions to execute.
4. Call the same tool with `action:"complete"`, the same project/revision, returned job ID and preparation digest, a new request UUID and the complete JSON string in `response`.
5. Poll `bx_job_get`, read `bx_result_get` at its result revision, and open `bx_workbench_open`. Optional `bx_result_recheck` runs no new model request.

The page's host-analysis button displays a request to copy into the connected host chat. It does not secretly access a host subscription. Host-mode report translation can be requested in that chat; keep the original report. Server request count 0 means no server API request, not no host LLM activity. After a server restart, interrupted preparations remain recorded; start a new preparation only when requested.

**Optional independent API mode:** keep credentials in local settings `.env` and API profiles without keys. Use UTF-8 without BOM. This mode uses your provider's API access and billing.

For Cursor API, set `profiles.json` to:

```json
{"profiles":[{"id":"cursor-text","provider":"cursor","model":"composer-2.5","reasoning":"provider-default"}]}
```

Put your own `CURSOR_API_KEY` in the local `.env`. Alternatively, configure a Chat Completions-compatible provider:

```json
{"profiles":[{"id":"general-api","provider":"openai-compatible","model":"REPLACE_WITH_MODEL_ID","reasoning":"provider-default"}]}
```

```dotenv
BOUNDARYXP_API_BASE_URL=https://api.example.com/v1
BOUNDARYXP_API_KEY=REPLACE_WITH_YOUR_KEY
```

Replace the example URL, model ID and key with your provider's values; these placeholders are not a working service. Finish active work and reconnect matching clients after changing settings. `bx_profiles_list` checks local readiness; only actual analysis validates remote credentials, model access and credit. Analysis may incur charges and sends the selected task/dictionary content to the provider. Do not put keys in task text, chat or public issues.

#### First task

Use the entire [English multi-DEV example](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.en.md). Ask `bx_task_import` to preview one parent and two separately identified DEV tasks. Keep explicit task and parent IDs; leave the root's parent empty. Do not merge children just because their roles match.

Confirm the preview, save a new project and follow the host prepare/complete flow above for its exact revision. Poll the job until completed or failed. Do not automatically retry failures. Read the formal result and distinguish LLM judgment from Core verification. Opening the workbench does not submit another analysis.

A `job_id` is not evidence of completion. Failed receipts and original responses are retained; unverified drafts are not formal results. `bx_result_recheck` re-evaluates saved operands with no model request and preserves the original result.

For help in the host, ask **“Read BoundaryXP tool help, multi-DEV examples and troubleshooting in English.”** The MCP entry is `bx_capabilities({"language":"en","help_topic":"tools"})`; substitute `examples` or `troubleshooting` for those topics.

#### Updates

Keep your existing installation, data and settings paths. Back up complete data and settings, finish jobs and disconnect related MCP clients before a manual update. In a new shell, set `$BxpHome` and `$BxpData` to your existing installation and data directories; do not substitute the new-install example paths for your own.

**rc.8 can upgrade directly to rc.9 without uninstalling.** Its old automatic updater expects exactly 18 tools and rejects rc.9's 21 tools. For this transition use the command below, which obtains the rc.9 installer through npm; do not use the old `launcher --manage update`. The new probe checks the target package's declared tools, so future changes in tool count do not cause this rejection.

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp update --home $BxpHome --version 0.4.0-rc.9 --migrate-data $BxpData
```

Do not delete the old release first. Updates preserve task data, failed records and host/provider settings. This update changes the MCP runtime digest while keeping the B-335 native Core binary unchanged. Use `--migrate-data <original-data-directory>` for a verified copy; the original directory is retained.

Later managed updates can also use `node <home>/launcher.mjs --manage update --version <exact-version>`. Reconnect clients afterward and compare `bx_capabilities` with the on-disk `--manage status`.

The unpublished rc.2 local test package used a different package name; use the new bootstrap command above once to switch. It was not an earlier npm release.

##### Existing direct-npx users

If your host directly runs `npx.cmd --yes boundaryxp-mcp@0.4.0-rc.8 ...` without a managed installation, do not just change the package version against the old data directory. Finish jobs and disconnect matching clients. Set `$BxpData` to the existing data directory and `$BxpHome` to a new empty installation directory, then run:

```powershell
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp install --home $BxpHome --version 0.4.0-rc.8
if ($LASTEXITCODE -ne 0) { throw 'Bootstrap installation failed' }
npx.cmd --yes --package boundaryxp-mcp@0.4.0-rc.9 bxp update --home $BxpHome --version 0.4.0-rc.9 --migrate-data $BxpData
if ($LASTEXITCODE -ne 0) { throw 'Migration failed' }
```

Follow the host setup section to replace only the existing BoundaryXP launch command with the new managed `launcher.mjs`. Retain the original data argument, profiles, environment and other MCP entries. The launcher resolves the verified data copy while retaining the original. Avoid duplicate BoundaryXP connections to the same data.

##### Optional automatic updates

Disabled by default. For the managed installation, enable the prerelease channel explicitly:

```powershell
node $BxpLauncher --manage auto-update --mode auto --registry https://registry.npmjs.org --channel next --allow-prerelease --interval-minutes 1440
node $BxpLauncher --manage auto-update-check
node $BxpLauncher --manage status
```

Without `--copy-migrate`, releases with a changed runtime digest require attention instead of automatic activation. Add that option only if you want automatic copy migration. New releases are prepared in the background and activated on the next start after all related clients exit. Running jobs are not forcibly stopped. No Windows service or scheduled task is installed; checks run while MCP is running.

To select check-only mode, or turn automatic updates off, run the corresponding command:

```powershell
node $BxpLauncher --manage auto-update --mode check
node $BxpLauncher --manage auto-update --mode off
```

Ask `bx_capabilities` for `installation_update`. `PREPARED` awaits a safe start; `WAITING_FOR_CLIENTS` means another client is running; `APPLIED` means activated. `CHECK_FAILED` retains the active version and checks again at the next interval. `MIGRATION_OPT_IN_REQUIRED` needs explicit copy-migration permission. A pinned direct npx entry has no managed updater.

##### Rollback

After disconnecting clients, use `node $BxpLauncher --manage rollback` to restore the previous release and its paired data directory. New work in a migrated copy remains in that copy; it is not automatically merged. The rolled-back version is blocked from immediate automatic reinstallation. Keep both data copies.

#### Troubleshooting and shutdown

| Symptom | What to check |
|---|---|
| Connecting or zero tools | Node absolute path, MCP output, JSON encoding and `--manage status`. Run `--manage doctor` for an isolated MCP/HTTP probe. |
| 21 tools but chat cannot find them | Start a new Agent chat after connection. |
| COMPILER_BUSY | Wait for the existing job or explicitly cancel it; do not submit duplicates. |
| JOINT_RESPONSE_NOT_JSON | Preserve the error and original response. A malformed response is not a valid boundary judgment. |
| PROFILE_NOT_FOUND or API 401/403/429 | Profile, key, provider access and quota. Do not automatically retry paid analysis. |
| BROKER_CONFIGURATION_OR_VERSION_CONFLICT_RECONNECT_ALL_CLIENTS | Finish work and reconnect all clients with the same version/configuration for that data root. |
| Integrity or upgrade failure | Keep the previous release and failed records. Obtain a trusted package; do not bypass checks. |

Closing the browser does not stop MCP. Disconnecting the last MCP client stops the workbench and cancels unfinished jobs; finish work first. Reconnect and call `bx_workbench_open` for a fresh address.

To stop using MCP, remove only its host entry and retain data/settings. Report the version, error code and a redacted minimal example; never share credentials or personal task stores.


Custom L2/L3: bx_dictionary_format, bx_dictionary_validate and bx_dictionary_import; workbench upload and validation. [Format, examples and workflow](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/guides/DICTIONARIES.md). Available from rc.9; rediscover 21 tools and 17 resources after upgrading.

[简体中文](#简体中文) · [Back to language selection](#boundaryxp--bxp)
