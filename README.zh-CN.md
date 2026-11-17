<p align="center"><a href="README.md">English</a> · <strong>简体中文</strong></p>
<p align="center"><img src="assets/branding/v2/BoundaryXP-logo-zh.png" alt="界痕 · BoundaryXP" width="320"></p>

<h1 align="center">从原文到边界，每一步都看得见。</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/boundaryxp-mcp"><img src="https://img.shields.io/badge/npm-Install%20rc.10-CB3837?style=for-the-badge&amp;logo=npm" alt="npm · 安装 BoundaryXP rc.10"></a>
  <a href="https://registry.modelcontextprotocol.io/?q=boundaryxp"><img src="https://img.shields.io/badge/Official%20MCP%20Registry-Listed-15803d?style=for-the-badge" alt="官方 MCP Registry · 已收录"></a>
  <a href="https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.10"><img src="https://img.shields.io/badge/Download-rc.10%20package-2563eb?style=for-the-badge" alt="下载 rc.10 编译安装包"></a>
  <a href="https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP"><img src="https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP/badges/score.svg" alt="BoundaryXP Glama 公开入口与实时评分"></a>
</p>

<p align="center">
  <a href="https://boundaryxp-demo.vercel.app/"><img src="https://img.shields.io/badge/Demo-Interactive-0891b2?style=flat-square" alt="演示 / Interactive demo"></a>
  <a href="#l2--l3行业与企业语义库"><img src="https://img.shields.io/badge/Semantics-L2%20%2B%20L3-7c3aed?style=flat-square" alt="L2 industry / L3 enterprise semantics"></a>
  <a href="https://doi.org/10.5281/zenodo.24072738"><img src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.24072738-1e3a8a?style=flat-square" alt="DOI: 10.5281/zenodo.24072738"></a>
</p>

<p align="center">从完整任务到带原文证据的 <strong>7+1 关联表示</strong>，再由确定性 Core 核验。<br>检查方案与子任务分解，追溯为什么<strong>越界、未越界，或信息不全</strong>。</p>

<p align="center"><a href="https://boundaryxp-demo.vercel.app/"><strong>▶ 在线演示</strong></a>　·　<a href="docs/mcp/INSTALL.zh-CN.md"><strong>MCP 接入</strong></a>　·　<a href="https://doi.org/10.5281/zenodo.24072738"><strong>论文</strong></a></p>

<p align="center">中英双语 · MCP 0.4.0-rc.10 / B-345 · npm 预发行 · 论文与协议资料 · Core 原实现源码私有</p>

> **欢迎提问、反例与贡献。** 7+1 方法有适用条件，研究用例不能证明它对所有任务都正确；MCP 实现、模型解释和 L2/L3 语义库也可能出错。确定性计算不等于语义解释必然正确。欢迎用问题、反例和复现证据共同检验与改进。
>

| 用途 | 文档与入口 |
|---|---|
| 一般提问 | [提问与建议表单](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=04-question.yml) |
| 方法反例 | [7+1 方法反例表单](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=01-method-counterexample.yml) |
| MCP 反馈 | [MCP 安装与使用问题表单](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=02-mcp-problem.yml) |
| 语义库反馈 | [L2/L3 语义问题表单](https://github.com/joinwell52-AI/BoundaryXP/issues/new?template=03-semantic-resource.yml) |
| 提交贡献 | [贡献指南与 PR 流程](CONTRIBUTING.md) |


## 安装 BXP · 在哪里找到 BXP

**Linux x64 / Docker：** `0.4.0-rc.10-linux.1` 使用 `linux` 渠道（glibc ≥2.36、Node ≥22.19）；Windows 的 `latest/next` 使用 rc.10。两者包含 B345 功能与未改动的原生 Core。此前 Glama 验证对应 rc.9-linux.1，不能冒称 rc.10 已通过平台复审。


| 用途 | 文档与入口 |
|---|---|
| npm 安装 | [npm 安装与升级](https://www.npmjs.com/package/boundaryxp-mcp#中文安装与升级) |
| Windows 接入 | [Windows 中文安装指南](docs/mcp/INSTALL.zh-CN.md) |
| Windows 接入 | [Windows 英文安装指南](docs/mcp/INSTALL.en.md) |


**21 个工具 · 17 项资源 · Windows x64 · Node.js ≥22.18 · rc.10 预发行版。** 默认使用当前宿主 LLM 分析，无需另外配置模型 API Key。

| 公开入口 | 现在能查到什么 |
|---|---|
| **[npm：下载安装](https://www.npmjs.com/package/boundaryxp-mcp)** | rc.10 安装包，同页中英文介绍与安装说明 |
| **[官方 MCP Registry](https://registry.modelcontextprotocol.io/?q=boundaryxp)** | 已登记 rc.10 及 npm 安装来源 |
| **[TensorBlock MCP Index：rc.9 已合并](https://github.com/TensorBlock/awesome-mcp-servers/pull/6087)** | rc.9 更新于 11 月 16 日合并；[Linux / Glama 后续 PR #6099](https://github.com/TensorBlock/awesome-mcp-servers/pull/6099)待审核 |
| **[MCPServers 中文页](https://mcpservers.org/zh-CN/servers/www-npmjs-com-package-boundaryxp-mcp)** | 已公开收录，有 npm 链接；仍显示 rc.8，11 月 16 日已请求刷新文档 |
| **[Serverdex](https://serverdex.io/server/io-github-joinwell52-ai-boundaryxp)** | 已有公开条目；rc.8 配置示例缺少必填数据路径，请按本项目指南安装 |
| **[Glama](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP)** | Linux `0.4.0-rc.9-linux.1` 已发布；平台构建通过，发现 21 工具 / 17 资源，公开工具目录可查。 |

核对日期：2026-11-16。搜索 **BoundaryXP** 或 **boundaryxp-mcp**。安装新版以 npm 为准，第三方目录可能延迟同步。“已收录”表示能查到，不代表功能认证。完整目录状态及可登记入口。

MCPwell、ToolCenter 的总目录中也有条目，但尚未核实 BXP 专属详情链接。分类/总目录只在完整说明中记录，不作为这里的 BXP 直达安装入口。

**Codex 桌面版：**「插件」→「添加」→ **「添加 MCP 服务器」**，按stdio 接入指南配置。「添加插件市场」需要独立的插件市场源，不能填 npm、Registry 地址或本产品仓库；目前 BXP 未上架 Codex 插件目录或 Cursor Marketplace。

**插件贡献进展：**OpenAI Community Plugins PR #57已转为正式待审核，内含经过 Windows、Linux x64 测试的 0.2.0 封装及无关 Grafana 失败的基线对照证据；punkpeye PR #19484已补充 Linux 支持、真实 Glama 徽章及构建与发现通过的跟进证据。两者仍待维护者审核，Glama 通过不等于 PR 已合并。测试范围与提交状态。

OpenAI PR 跟进说明现已补齐 **Linux 插件支持**：独立编译依赖锁、glibc 检查与 XDG 数据目录。Windows/Linux × Node 22.19/24.19 四种组合均为 9/9 通过；Linux Codex 从 GitHub 市场安装、安装后副本的完整分析/报告/复验流程均通过。候选插件安装。上游仍待审核，原始 Core 源码保持私有。

如需从「添加插件市场」试用发布者 fork，见候选插件安装指南。已隔离验证从 GitHub 添加市场、安装插件及调用安装后的 MCP；官方市场审核仍未完成。


| 用途 | 文档与入口 |
|---|---|
| Linux 安装包 | [npm Linux 编译包 0.4.0-rc.10-linux.1](https://www.npmjs.com/package/boundaryxp-mcp/v/0.4.0-rc.10-linux.1) |
| Linux / Docker | [Linux / Docker 中文安装指南](docs/mcp/linux/INSTALL.zh-CN.md) |
| Linux / Docker | [Linux / Docker 英文安装指南](docs/mcp/linux/INSTALL.en.md) |
| 容器构建 | [Dockerfile](Dockerfile) |
| Linux 发行 | [Linux 发行附件与摘要](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.10-linux.1) |
| 构建与发现验证 | [Linux 发行验证报告](docs/mcp/linux/RELEASE.md) |
| 目录收录 | [MCP 目录与审核状态](docs/mcp/DISCOVERY.md) |
| 宿主配置 | [Codex / Cursor stdio 接入指南](docs/mcp/npm/INSTALL.zh-CN.md#codex-与其他宿主) |
| 插件贡献 | [OpenAI Community Plugins PR #57](https://github.com/openai/community-plugins/pull/57) |
| punkpeye 目录贡献 | [Awesome MCP Servers PR #19484](https://github.com/punkpeye/awesome-mcp-servers/pull/19484) |
| 平台验证 | [Glama 构建与发现证据](https://github.com/punkpeye/awesome-mcp-servers/pull/19484#issuecomment-6912851096) |
| 贡献验证 | [插件测试与提交记录](docs/mcp/DISCOVERY.md#rc9-contributions) |
| Linux 插件支持 | [OpenAI PR #57 Linux 跟进](https://github.com/openai/community-plugins/pull/57#issuecomment-6935083522) |
| 插件试用 | [候选插件中文安装指南](docs/mcp/PLUGIN-MARKETPLACE.zh-CN.md) |
| 插件试用 | [候选插件中文安装指南](docs/mcp/PLUGIN-MARKETPLACE.zh-CN.md) |

## 先看一个真实用例

七个任务各自看起来可以执行，合起来却有一条 **A → D → B → C → A** 的严格前置闭环。界痕把跨小组依赖放回同一张图，保留原文与计算依据，让冲突可以逐项核对。

[![点击进入：RT044 的任务树、7+1 边界雷达和原文依据](assets/demos/workbench-zh.jpg)](https://boundaryxp-demo.vercel.app/#case=R389-383&axis=A&view=radar&lang=zh)

<p align="center"><a href="https://boundaryxp-demo.vercel.app/#case=R389-383&axis=A&view=radar&lang=zh"><strong>点击雷达，查看依据 →</strong></a>　·　<a href="https://boundaryxp-demo.vercel.app/#case=R389-383&axis=A&view=report&lang=zh">阅读与导出 7+1 报告 →</a></p>

### 不同用例，不同结果

| 结果与用例 | 关键问题 |
|---|---|
| **越界** · [RT044](https://boundaryxp-demo.vercel.app/#case=R389-383&axis=A&view=radar&lang=zh) | 局部顺序合并后形成严格闭环 |
| **未越界** · [RT042](https://boundaryxp-demo.vercel.app/#case=R389-381&axis=R&view=radar&lang=zh) | 10–11 点与 11–12 点的半开区间相邻，端点释放 |
| **信息不全** · [L23-050](https://boundaryxp-demo.vercel.app/#case=R389-153&axis=P&view=radar&lang=zh) | “由他确认”没有唯一绑定责任人，保留未知 U1 |

还有两个**英文原文**用例：ENG20-001 · 分支与汇合（未越界）、ENG20-003 · 四步依赖闭环（越界）。

这些用例来自 58618 已保存记录，保留各自任务树、原文、判定和原七步报告。**报告与 Markdown 导出跟随右上角语言；原文保留来源语言。** 演示回放 B-332 保存记录，不连接本地服务、不重新分析，也不会随 B335 自动重算。演示说明与已保存报告

<details>
<summary>展开查看中文报告和英文原文</summary>

[![中文 7+1 完整报告，支持 Markdown 导出](assets/demos/report-zh.jpg)](https://boundaryxp-demo.vercel.app/#case=R389-383&axis=A&view=report&lang=zh)

[![ENG20-003 的英文任务原文](assets/demos/english-source.jpg)](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=source&lang=en)

</details>


| 用途 | 文档与入口 |
|---|---|
| 英文用例 · 未越界 | [ENG20-001 · 分支与汇合](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-001&axis=A&view=radar&lang=en) |
| 英文用例 · 越界 | [ENG20-003 · 四步依赖闭环](https://boundaryxp-demo.vercel.app/?lang=en#case=ENG20-003&axis=A&view=radar&lang=en) |
| 演示与报告 | [演示说明与已保存报告](docs/demo/README.md) |

## 接入你的 AI 工作流

**rc.10 / B345 更新：** L2/L3 完整目录五步导入，模型与字典分别保存，完整中英文目录示例。旧任务、失败记录和 rc.9 字典保留，计算器算法未改。见 [中文格式规范](docs/mcp/npm/guides/DICTIONARIES.zh-CN.md)。

**BoundaryXP MCP** 通过标准 stdio 接入 Cursor、Codex 等兼容宿主，提供 **21 个工具、17 个资源和本地浏览器工作台**。Windows x64 安装包包含原生编译 Core，无需另装 58618 或自建 BoundaryXP 服务器。

1. **从 npm 安装：** 使用 `boundaryxp-mcp@0.4.0-rc.10`；预发行渠道为 `next`。GitHub Release 同步保存安装包和 SHA-256。
2. **安装并连接宿主：** 按对应指南配置 stdio MCP 服务。
3. **使用当前宿主 LLM：** 默认 host 配置通过标准 MCP 工具提供规范、接收宿主分析并运行原生复核，无需额外模型 API Key；也保留可选的独立 API 模式。
4. **打开工作台：** 导入完整任务，预览并确认任务树，再提交分析、查看证据与报告。


| 用途 | 文档与入口 |
|---|---|
| Windows 接入 | [Windows 中文安装指南](docs/mcp/INSTALL.zh-CN.md) |
| Windows 接入 | [Windows 英文安装指南](docs/mcp/INSTALL.en.md) |
| 工具参考 | [21 个 MCP 工具与资源](docs/mcp/TOOLS.md) |
| 升级与维护 | [升级、回滚与排障指南](docs/mcp/npm/INSTALL.zh-CN.md#升级) |


> **当前 npm 版本：** boundaryxp-mcp 0.4.0-rc.10，B-345 / Windows x64，MIT许可。入口：中文安装指南、7+1产品介绍、MCP目录状态。本产品仓库已经公开；核心实现源码在独立私有源码仓库维护。客户无需另装58618。


| 用途 | 文档与入口 |
|---|---|
| 自定义语义库 | [L2/L3 字典格式与中文示例](docs/mcp/npm/guides/DICTIONARIES.zh-CN.md) |
| 升级与维护 | [升级、回滚与排障指南](docs/mcp/npm/INSTALL.zh-CN.md#升级) |
| npm 发行 | [boundaryxp-mcp 0.4.0-rc.10](https://www.npmjs.com/package/boundaryxp-mcp) |
| Windows 接入 | [Windows 中文安装指南](docs/mcp/INSTALL.zh-CN.md) |
| 产品介绍 | [MCP 7+1 中文产品介绍](docs/mcp/npm/README.zh-CN.md) |
| 目录收录 | [MCP 目录与审核状态](docs/mcp/DISCOVERY.md) |

## L2 / L3：行业与企业语义库

同一个词在不同行业、企业中可能有不同含义。L2 / L3 为任务解释提供所选领域的语义上下文，与原文证据一起使用。

| 语义库 | 作用 |
|---|---|
| **L2 · 行业语义库** | 描述行业中的动作、实体、角色、资源及相关术语，帮助把任务要求放回具体业务领域理解。 |
| **L3 · 企业语义库** | 补充企业自己的术语、组织与角色称谓、受控别名等上下文，帮助区分企业内的具体对象和表述。 |

**当前没有活动 L1 层。** L0 是 BXP 协议与确定性 Core，不是语义库。L2 / L3 不替代任务原文，也不改变 7+1 的共同核验规则；加载词库、岗位或经理关系均不自动产生业务权限。

### 在 MCP 中使用

**rc.10 / B345 统一目录：L2 为 8 个 JSON＋README；L3 为 3 个 JSON＋README。** 页面分为“已安装字典”和“导入语义库”，按 **选择 L2/L3 → 选择完整文件夹 → 校验 → 输入名称 → 保存** 五步操作。校验通过才可保存；名称和选择在刷新后保留。模型设置与字典分别保存，旧 rc.9 字典及其绑定继续可读。

MCP 导入先调用 `bx_dictionary_format` 获取完整目录规范和中英文示例，再调用 `bx_dictionary_validate`，最后带校验摘要调用 `bx_dictionary_import`。完整目录不等于单个字典 JSON；旧 JSON 工具导入仍兼容。

**[格式与文件清单](docs/mcp/npm/guides/DICTIONARIES.zh-CN.md)** · **[L2 中文完整目录 ZIP](docs/mcp/npm/examples/dictionary-directory-L2-zh-CN.zip)** · **[L3 中文完整目录 ZIP](docs/mcp/npm/examples/dictionary-directory-L3-zh-CN.zip)**

1. 用 `bx_dictionaries_list` 列出当前安装可用的 L2 / L3 资源，核对词库标识与版本。
2. 用 `bx_dictionaries_bind` 校验所选资源并取得版本与摘要引用，避免混用不同词库快照。
3. 用 `bx_dictionary_lookup` 查询已绑定资源中的词条；查询本身不作语义裁决，也不提交分析。

可以对宿主说：**“列出 BXP 可用的 L2、L3 语义库，展示标识、版本和摘要，等我选择后再绑定；暂不提交分析。”**


| 用途 | 文档与入口 |
|---|---|
| Windows 接入 | [Windows 中文安装指南](docs/mcp/INSTALL.zh-CN.md) |
| 工具参考 | [21 个 MCP 工具与资源](docs/mcp/TOOLS.md) |
| 许可与分发 | [MCP 许可、资源与第三方说明](docs/mcp/NOTICES.md) |


可用资源以当前安装实际返回的清单为准。企业私有语义资料按自己的使用范围管理；本页提供能力和使用入口，不表示独立词库已在 GitHub 公开发布。

## 方法与研究证据

**《BXP：基于 7+1 关联表示的人工智能任务边界判定方法》**  
朱卫（Wei Zhu）· 中文 r23／英文 v1.2 · 首次发布 2026-11-06

| 研究用例 | 任务节点 | 计算项 |
|:---:|:---:|:---:|
| **625** | **3,219** | **3,469** |

论文提出以 7+1 及共享关联组织任务要求，通过 BXP 约定建立共同数学边界，检查子任务及其组合是否突破主任务边界。形式论证说明成立条件；上述数字描述研究覆盖范围，**不是准确率**。整组答案一致性、逐项差异与未完成计算分别报告。


| 用途 | 文档与入口 |
|---|---|
| 中文论文 | [中文论文 PDF · r23](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.zh-CN.pdf) |
| 英文论文 | [English paper PDF · v1.2](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.en.pdf) |
| 研究附件 | [公开研究材料包 · ZIP](https://zenodo.org/records/24072738/files/manuscript-with-materials.zip?download=1) |
| 研究材料 | [论文与材料导航 · 中文](docs/paper/README.md) |


**DOI：10.5281/zenodo.24072738**。Zenodo 于 2026-11-09 发布，保留首次 GitHub 发布日期。GitHub 论文 Release 与摘要

研究附件 `RESEARCH_ONLY_1` 包含任务原文、标注、7+1 报告、操作数、结果、协议正文、截图和独立研究核验脚本；不含工作台工程源码、运行依赖或生产提示模板。它与 MCP 测试安装包分别维护。


| 用途 | 文档与入口 |
|---|---|
| 论文引用 | [Zenodo DOI · 论文记录](https://doi.org/10.5281/zenodo.24072738) |
| 论文发行 | [GitHub 论文 Release 与校验摘要](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23) |

## 7+1 如何把要求连起来

**I 输入 · O 交付 · A 动作 · P 责任与分工 · R 资源 · V 版本依据 · C 完成停止，加独立 B 禁止边界。**

共享关联把同一对象、条件、依赖和交接连在一起，检查跨任务的约束。缺失信息保持未明确，岗位名称不产生权限。

```mermaid
flowchart LR
  A["完整任务原文"] --> B["确认父子任务树"]
  B --> C["LLM 联合分析"]
  D["所选 L2 / L3 字典"] --> C
  C --> E["共享确定性 Core"]
  E --> F["证据、发现与未决"]
  F --> G["人及宿主复核"]
```

B335 工作台采用**一次语义请求**，随后由 Core 作程序核验，没有独立审阅请求或自动重试。LLM 解释原文，Core 核验提交的结构、来源、绑定与受支持的有限操作数；Core 不调用模型、不访问网络、不执行任务中的业务指令。

<details>
<summary>展开查看 B335 功能、输入限制与证据边界</summary>

- **完整任务树：** 整篇 UTF-8 `.txt` / `.md` 导入，支持角色标题、显式任务及父任务编号、前向引用、多层关系和保存前预览。
- **可核对结果：** 任务树、7+1 雷达、LLM 与计算器结论、引用、未决、历史及导出；失败尝试与保存结果分开呈现。
- **L2 / L3：** 行业及企业字典保留版本化引用；没有活动 L1 层，加载资源不产生业务权限。
- **中英文：** 界面、报告及 Markdown 导出保留原始任务文本与保存判定；首次报告翻译调用模型，按快照缓存。
- **数学输入与未知项：** 区分允许取值、未定事实及父／子方案一致性；集合身份支持字符串和安全整数，不混同两者，不代填未知结论。
- **启动与恢复：** 有界并发读取历史作业，保留原恢复规则；HTTP 身份核对完成后才提示就绪。

单份来源和序列化联合输入各最多 **1 MiB**，HTTP 请求体最多 **8 MiB**；超限拒绝、不截断，没有 300 码点上限。功能及历史验证范围见升级日志。

引文对齐不证明语义蕴含，作业完成不表示全部证明通过。业务裁决与执行权由人及宿主掌握；`business_decision` 与 `execution_authorization` 保持 null。

已评审协议基线为 BXP-0001 `0.4.0-draft.2`；工作台仍使用已记录的 draft.1 附件，不声明已完整迁移或全面符合协议。实现说明 · 研究证据

宿主分析及首次翻译可能将所选原文与字典发送到配置的模型服务商。使用私有材料前应核对该数据流。

</details>


| 用途 | 文档与入口 |
|---|---|
| 版本变化 | [工作台升级日志](CHANGELOG.zh-CN.md) |
| 协议实现 | [BXP 实现与迁移说明](protocol/IMPLEMENTATION.md) |
| 研究证据 | [7+1 研究与验证范围](docs/RESEARCH.md) |

## 从这里继续

| 想了解什么 | 入口 |
|---|---|
| 行业与企业语义库 | [L2 / L3 介绍](#l2--l3行业与企业语义库) · [词库工具](docs/mcp/TOOLS.md) |
| 安装与使用 MCP | [接入指南](docs/mcp/README.md) · [版本与验收](docs/mcp/RELEASE.md) |
| 理解方法、引用论文 | [研究介绍](docs/RESEARCH.md) · [论文材料](docs/paper/README.md) |
| 阅读协议与实现差异 | [BXP 协议](protocol/README.md) · [实现说明](protocol/IMPLEMENTATION.md) |
| 查看版本变化、参与维护 | [升级日志](CHANGELOG.zh-CN.md) · [贡献指南](CONTRIBUTING.md) · [文档导航](docs/README.md) |

**分发范围：** Git 树维护论文、协议、案例、报告、截图、独立研究核验脚本和 MCP 使用说明，不包含私有工作台实现源码或源码构建入口。MCP 编译安装包发布到 npm，并同步到本仓库 Release；Core 原实现源码不随包提供，适配器、UI 和必要资源仍可读取。完整范围说明

**公开状态：** 所有者已将本产品仓库设为公开。历史核查文档保留当时记录；公开状态本身不证明旧 GitHub 引用或缓存已经清除。核查记录

保留既有 MIT 许可证。论文、案例与第三方材料按各自使用条件；MCP 安装包另见许可与第三方说明。


| 用途 | 文档与入口 |
|---|---|
| 分发范围 | [仓库公开范围说明](docs/PUBLICATION-SCOPE.md) |
| 历史核查 | [公开前核查记录](docs/PREPUBLICATION-CHECK.md) |
| 仓库许可 | [MIT 许可证](LICENSE) |
| 材料条件 | [论文与案例使用条件](docs/paper/materials/MATERIAL-ACCESS.md) |
| 许可与分发 | [MCP 许可、资源与第三方说明](docs/mcp/NOTICES.md) |


