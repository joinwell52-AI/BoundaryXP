<p align="center"><a href="README.md">English</a> · <strong>简体中文</strong></p>
<p align="center"><img src="assets/branding/v2/BoundaryXP-logo-zh.png" alt="界痕 · BoundaryXP" width="320"></p>

<h1 align="center">从原文到边界，每一步都看得见。</h1>

<p align="center">
  <img src="https://img.shields.io/badge/MCP-21%20tools-2563eb?style=flat-square" alt="MCP · 21个工具">
  <img src="https://img.shields.io/badge/Semantics-L2%20%2B%20L3-7c3aed?style=flat-square" alt="L2行业与L3企业语义库">
  <img src="https://img.shields.io/badge/Language-ZH%20%2F%20EN-0891b2?style=flat-square" alt="中英双语">
</p>

界痕把完整任务组织成带原文证据的 **7+1 关联表示**，帮助检查 AI 方案和父子任务分解是否保留原任务的交付、责任、资源限制与禁止事项。LLM 解释原文，确定性 Core 核验提交的结构与受支持的计算。

通过 MCP 接入宿主，也提供本地浏览器工作台。结论为**越界、未越界、信息不全**，可回到原文与计算依据逐项核对。

## 先看一个真实用例

七个任务各自看起来可以执行，合起来却出现 **A → D → B → C → A** 的严格前置闭环。RT044 将跨小组依赖放回同一张图，展示冲突来自哪里。

[![点击进入交互演示：任务树、7+1边界雷达与原文依据](assets/demos/workbench-zh.jpg)](https://boundaryxp-demo.vercel.app/#case=R389-383&axis=A&view=radar&lang=zh)

**点击上图进入演示。** 选择用例、点击雷达，再查看原文或完整报告；报告和 Markdown 导出跟随界面语言，任务原文保留来源语言。

| 用例 | 展示结果 |
|---|---|
| RT044 · 跨小组执行链形成严格闭环 | **越界** |
| RT042 · 共享检测仪相邻时段交接，端点释放 | **未越界** |
| L23-050 · “由他确认”没有唯一绑定责任人 | **信息不全** |

演示含五个来自58618保存记录的开发用例，包括两个英文原文案例。它回放原 B-332 任务树、判定与原七步报告，不连接本地服务或重新分析，也不代表当前发行版的新验收。

## 安装与接入

**21 个工具 · 17 项资源 · Node.js ≥22.18 · 编译后的 B-335 Core。**

默认使用当前宿主 LLM 分析，无需另配模型 API Key；也保留可选的独立 API 模式。安装包自带 Core，无需另装58618或自建 BoundaryXP 服务器。

| 运行平台 | 安装入口 |
|---|---|
| Windows x64 | [Windows 安装与升级](docs/mcp/INSTALL.zh-CN.md) |
| Linux x64 / Docker | [Linux 与 Docker 安装](docs/mcp/linux/INSTALL.zh-CN.md) |

Windows 版本为 **0.4.0-rc.9**，使用 latest/next 渠道；Linux 版本为 **0.4.0-rc.9-linux.1**，使用 linux 渠道，需要 glibc ≥2.36。两者均为预发行版。已有 rc.8 安装升级时，需按指南使用新版安装器并保留原数据路径。

安装后配置宿主的 stdio MCP 服务，打开工作台，导入完整任务，预览并确认父子关系，再分析与查看报告。

## 7+1 如何工作

**I 输入 · O 交付 · A 动作 · P 责任与分工 · R 资源 · V 版本依据 · C 完成停止，加独立 B 禁止边界。**

共享关联保存同一对象、条件、依赖和交接，帮助核对跨任务约束。缺失信息保持未明确，岗位名称不产生权限。

## L2 / L3：行业与企业语义库

| 语义库 | 作用 |
|---|---|
| **L2 · 行业语义库** | 行业动作、实体、角色、资源及相关术语，为任务解释提供领域上下文。 |
| **L3 · 企业语义库** | 企业自己的术语、组织与角色称谓、受控别名等上下文，帮助区分具体对象和表述。 |

rc.9 支持自定义字典的格式获取、校验与导入。先校验，再按返回摘要导入；选择资源时绑定版本和摘要。导入不自动绑定或修改已有任务，也不代表语义内容已被证明正确。

没有活动 L1 层；L0 是 BXP 协议与确定性 Core，不是语义库。资源加载、岗位、职级及经理关系均不建立业务权限。

## 方法与研究证据

**《BXP：基于7+1关联表示的人工智能任务边界判定方法》**  
朱卫（Wei Zhu）· 中文 r23 / 英文 v1.2 · 首次发布于2026-11-06。

研究材料包含 **625 组用例、3,219 个任务节点、3,469 项计算**。这些数字描述研究覆盖范围，**不是准确率**；整组答案一致性、逐项差异与未完成计算分别报告。

7+1 方法有适用条件，形式论证和现有案例不能证明它对所有自然语言任务都正确。MCP 实现、模型解释及词库也可能出错；确定性计算不自动证明输入表示或语义解释正确。

## 能力与边界

- **完整任务：** 整篇 UTF-8 .txt / .md 导入，支持显式任务和父任务编号、多个同角色子任务、多层关系与保存前预览。
- **可核对结果：** 任务树、7+1 雷达、LLM 与计算器结论、引文、未决、历史和双语报告导出；失败尝试与保存结果分开呈现。
- **输入限制：** 单份来源和序列化联合输入各最多 1 MiB，HTTP 请求体最多 8 MiB；超限拒绝，不截断。
- **责任边界：** Core 不调用模型、不访问网络、不执行任务中的业务指令。分析与首次翻译的数据流取决于所选宿主或模型服务商；程序核验不授予执行权，业务决定仍由人及宿主负责。

已评审协议基线为 BXP-0001 draft.2；B-335 仍使用已记录的 draft.1 附件，不声明已完整迁移或全面符合协议。平台收录、构建通过与评分也不等于算法或语义正确性认证。

## 参与改进

欢迎提问、质疑、反例、独立复现和 PR。无需先认可本方法或证明缺陷才能参与；中文、英文均可。公开贡献可涉及文档、协议、案例、词库示例和独立验证，请只提交有权公开的最小材料。

本仓库公开论文、协议、指南、研究材料与编译发行包；Core 原实现源码保持私有。论文、案例及第三方资料各按其使用条件管理。公开状态本身不证明历史 GitHub 引用或缓存已经清除。

## 从这里继续

| 想了解什么 | 入口 |
|---|---|
| MCP 工具与自定义语义库 | [21个工具](docs/mcp/TOOLS.md) · [L2/L3 字典指南](docs/mcp/npm/guides/DICTIONARIES.zh-CN.md) |
| 阅读论文、查看研究材料 | [论文与材料](docs/paper/README.md) · [Zenodo DOI](https://doi.org/10.5281/zenodo.24072738) |
| 协议及实现范围 | [BXP 协议](protocol/README.md) · [实现说明](protocol/IMPLEMENTATION.md) |
| npm、目录与插件状态 | [npm 安装包](https://www.npmjs.com/package/boundaryxp-mcp) · [收录与审核进展](docs/mcp/DISCOVERY.md) |
| 版本变化与完整说明 | [升级日志](CHANGELOG.zh-CN.md) · [文档导航](docs/README.md) |
| 提问或提交贡献 | [问题入口](https://github.com/joinwell52-AI/BoundaryXP/issues/new/choose) · [贡献指南](CONTRIBUTING.md) |
| 许可与公开核查 | [MIT 许可](LICENSE) · [范围与材料条件](docs/PUBLICATION-SCOPE.md) · [历史核查](docs/PREPUBLICATION-CHECK.md) |
