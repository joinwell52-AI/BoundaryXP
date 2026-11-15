**简体中文** | [English](https://www.npmjs.com/package/boundaryxp-mcp#english)

# 界痕 · BoundaryXP（BXP）

**面向 AI Agent 与协作团队的 7+1 任务边界分析和计算复核工具。**

从完整任务要求形成带原文证据的 **7+1 关联表示**，检查父子任务及其组合约束，追溯为什么**越界、未越界，或信息不全**。报告分别保留 LLM 判断、原生计算器复核、原文依据和未明确项。

**boundaryxp-mcp 0.4.0-rc.8 · B-335 · Windows x64 · Node.js ≥22.18 · MIT · 预发行版**

[安装与升级](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.zh-CN.md) · [中文产品仓库](https://github.com/joinwell52-AI/BoundaryXP/blob/main/README.zh-CN.md) · [发行下载](https://github.com/joinwell52-AI/BoundaryXP/releases)

通过标准 **stdio MCP** 接入 Cursor、Codex 等宿主。一个包包含 **18 个工具、10 项资源、中英文内置帮助、编译后的 Core 和本地浏览器工作台**。无需另装 BoundaryXP 工作台或自建 BoundaryXP 服务器。当前原生包仅支持 Windows x64，不含 macOS、Linux 原生包。

## 7+1 核对什么？

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

## 一个父子任务案例

> **父任务：** 仅处理测试目录，交付检查报告，禁止部署生产环境。
>
> **DEV-01：** 检查测试文件并交付报告。
>
> **DEV-02：** 报告完成后部署生产环境。

每个子任务分别核对。DEV-02 的部署条款与父任务的禁止条款存在文本冲突，报告应能追溯这两处原文。此例只说明核对对象，不是保存的计算结果，也不保证所有模型都能正确理解。

支持完整 UTF-8 Markdown/TXT、多级父子关系、显式任务编号和父任务编号，以及多个相同角色的子任务。DEV-01、DEV-02 是不同节点；支持 `PM → DEV（1/14）` 等标题。先预览并确认关系，再分析。

[交互演示](https://boundaryxp-workbench-demo.joinwell52.chatgpt.site/)提供 B-332 保存记录：RT044 存在严格前置闭环，RT042 是半开区间相邻，L23-050 的责任人指代未绑定。这是历史回放，不代表本轮 MCP 新分析或 B-335 测试结果。

## 边界怎样计算？

1. **导入：** 预览完整父子任务，绑定需要的 L2/L3 字典。
2. **理解：** 显式提交一次 LLM 联合分析，形成 7+1 关系、原文证据、语义判断及形式化计算输入。
3. **复核：** 原生 Core 核验支持的集合、布尔表达式和数值查询，记录实际操作数与回执。
4. **对照：** 对齐同一任务与核验范围，比较判断，追溯原文和未明确项；保留失败响应。

计算器不调用模型。计算通过不自动证明语义抽取正确；LLM 判断与计算复核均不授予业务批准或执行权限。

## 能看到什么？

- 父子任务树、各子任务独立结论和完整 7+1 分析。
- 八轴边界雷达、独立 B 禁止边界和原文证据。
- LLM 判断、形式模型、计算回执及技术报告。
- Markdown 报告、历史结果和失败记录。
- MCP 与浏览器工作台读取同一份保存数据。

雷达表达条款的维度关联，不表示评分、进度或授权大小。

## 快速接入 MCP 宿主

需要 Windows x64、Node.js ≥22.18 和 npm，已实测 Node 24.19.0。首次启动联网下载包及依赖。将以下条目合并到宿主 MCP 配置，保留其他服务；将示例数据路径改为自己的固定绝对路径。

```json
{
  "mcpServers": {
    "BoundaryXP": {
      "command": "npx.cmd",
      "args": ["--yes", "boundaryxp-mcp@0.4.0-rc.8", "--data-root", "C:/BXP/data"]
    }
  }
}
```

这个入口固定版本，不自动升级。Codex、API 配置和管理安装升级见[中文安装指南](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.zh-CN.md)。已有用户沿用自己的数据与配置路径。

连接后应显示 **18 个工具**，在聊天里说：

> 调用 BoundaryXP 的 bx_capabilities 和 bx_workbench_open，返回版本及工作台地址，不提交分析。

打开返回的本地地址。端口会随重连变化，请重新获取地址。关闭浏览器不会关闭 MCP；最后一个 MCP 客户端断开后服务退出，未完成作业会取消，因此先完成正在运行的任务。

## 模型配置与首次分析

**默认 host 配置直接使用当前 MCP 宿主中的 LLM，无需为 BoundaryXP 另配模型 API Key。** 宿主读取分析规范、分析完整任务，通过 MCP 提交结构化分析，再读取原生计算回执和报告。MCP 不自行选择宿主模型或读取订阅凭据。独立 API/profile 是可选方式，见[模型配置](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.zh-CN.md#模型配置)。

可以先用[完整多 DEV 案例](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/examples/multi-dev-2.md)，然后说：

> 用 BoundaryXP 导入完整父子任务，保留每个 DEV 的任务编号，先展示关系预览；确认后保存，使用 host 配置和当前宿主 LLM 分析一次。返回 LLM 判断、计算器复核、原文依据和工作台地址。失败不自动重试。

## 通过 MCP 查看工具说明

在宿主聊天说：**“用 BoundaryXP 查看中文工具说明、完整多 DEV 案例和排障说明。”**

帮助入口为 `bx_capabilities({"language":"zh-CN","help_topic":"tools"})`；资源入口为 `boundaryxp://help/zh-CN/{overview|tools|examples|troubleshooting}`。具体参数以工具发现返回的 Schema 为准，无需读取本地文档。

工具覆盖能力查询、profile、L2/L3 字典、任务导入与校验、项目管理、分析提交与取消、作业状态、结果与文件读取、保存操作数的零模型复验，以及打开工作台。

## 升级与交付

[管理安装和可选自动更新](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/npm/INSTALL.zh-CN.md#升级)保留数据和配置。自动检查和升级默认关闭；准备好的新版在相关客户端退出后的下一次安全启动时生效，不强制中断运行中的任务。

公开仓库提供产品文档与编译发行包。Core 不包含原始 C++ 或 JavaScript 实现源码；适配器、UI、提示词及必要资源仍可读。MIT 和第三方许可说明随包保留。预发行版不宣称完整协议符合性或所有模型的语义准确率。

[目录收录状态](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/DISCOVERY.md)区分已上线入口和待审核申请。
