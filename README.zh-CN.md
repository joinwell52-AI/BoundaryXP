<p align="center"><a href="README.md">English</a> · <strong>简体中文</strong></p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v2/BoundaryXP-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v2/BoundaryXP-logo-light.png">
    <img src="assets/branding/v2/BoundaryXP-logo-light.png" alt="BoundaryXP" width="620">
  </picture>
</p>

<p align="center"><a href="https://github.com/joinwell52-AI/BoundaryXP/tree/main">仓库文件列表</a> · <a href="#文档列表">文档列表</a> · <a href="#仓库文件与目录">目录索引</a> · <a href="#品牌资产">Logo与品牌资产</a></p>

# 界痕 · BoundaryXP

> **2026-10-21：BoundaryXP 品牌已更新到 58618，当前为 ui222。** 仓库名称、文档、归档文件、包名和 Logo 已统一更新。运行 `npm run 7plus1:build-candidate` 可重建 408 文件安装包。见[改名与验证记录](docs/workbench/BOUNDARYXP-REBRAND.md)。

**把ADMIN的任务边界变成可计算对象。执行之前，先把任务边界算清楚。**

[快速开始](QUICKSTART.md) · [产品手册](docs/BOUNDARYXP-PRODUCT-MANUAL.md) · [7+1方法](docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md) · [当前状态](docs/SHORT-COMPILER-STATUS.md) · [文档导航](docs/README.md)

> **2026-10-21更新：本次合并纳入本机58618运行的ui220候选源码。** 包括7+1生成和数学解析资源、确定性计算器、公式展示及新版企业A语义库。运行`npm run 7plus1:build-candidate`可重建同一404文件运行包，详见[ui220同步与验证](docs/workbench/UI220-SYNC.md)。主产品版本仍为`1.3.0-preview.0`。下文旧候选说明和成绩保留为历史资料，不代表ui220语义验收。

## BoundaryXP是什么？

BoundaryXP是BXP（边界分析协议）的产品实现，将自然语言任务中的对象、动作、角色、条件、数量与禁止关系转换为可追溯的7+1，再用于形式化边界计算和下游符合性核查。

**当前第一优先级是把7+1解析正确。** 安装包、绿色页面、合法JSON、模型自审和工程测试通过都不能替代语义准确性。完整产品终点也不止八组文字：正确的7+1必须成为程序可计算的边界结构。

BoundaryXP不替ADMIN决定授权范围，不替PM规划，不执行任务中提及的业务操作。边界使用准入不等于业务裁决或执行授权。

## 当前候选主链：LLM理解，程序保真编译

```text
ADMIN短任务原文
→ 解析Skill＋LLM语义分析
→ 带来源的事件、对象、角色、条件和范围结构
→ 审阅Skill＋新会话核对
→ 程序技术校验与Boundary IR
→ 确定性7+1 JSON＋同源中文＋证据与未决
```

两个Skill实际以同源`INLINE_BUNDLE`进入请求；原生Skill加载尚未验证。HanLP、spaCy和NLI的既有研究记录保留，但不是当前候选的主解析路线或强制前置依赖。程序不再用旧NLP规则重新猜LLM已经表达的语义。

具体合同与限制见[方法手册](docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md)。

## 7+1必须保留完整关系

| 视图 | 内容 |
|---|---|
| I | 输入与作用域 |
| O | 产生结果与交付产物，保留必须、允许和条件性用途 |
| A | 当前要求或允许的动作实例 |
| P | 逐事件执行、组织、复核、批准、接收和协作关系 |
| R | 绑定目标与单位的执行量化限制 |
| V | 对具体用途有约束的版本、规范与依据 |
| C | 根任务完成、停止与升级条件 |
| B | 禁止与限制，保留对象、量词、范围、条件和例外 |

同一文件可以是生成结果、复核对象和提交产物，不是三个无关联名字。无需不等于禁止，许可不等于义务，未指定不等于任意授权，条件未知不等于满足。真实歧义应局部保留，不能为了八槽全满补答案。

## 已安装用户入口：固定58618

以下命令仅适用于已检出开发分支、并已完成候选安装与入口恢复的本地工作区；不适用于只克隆`main`的全新目录：

```bat
cd /d D:\boundx
npm run 7plus1:ui
```

地址：`http://127.0.0.1:58618/`。需要Node.js 22.18或以上和本机已登录、具有可用用量的Codex。接受非空、≤300 Unicode码点的ADMIN短任务；可粘贴或上传UTF-8文件，查看证据、未决、历史并导出结果。

**这是已有安装的启动命令，不是新克隆自动安装器。** 新目录安装、版本选择、CLI与UI同版比较见[快速开始](QUICKSTART.md)。本地页面仍会将文本发送到模型服务，不是离线推理。端口与PID的报告记录不保证此刻服务在线。

`npm run ui`是另一条既有BXP应用入口。开发分支工作区的`npm run 7plus1`与固定安装UI可能属于不同版本，不应混合验证。

## 现在做到哪里？

| 项目 | 当前状态 |
|---|---|
| 固定入口候选 | `0.1.0-candidate.031-r1.2` / `031-r1-c3`；58618恢复已有维护回执，候选仍为PARTIAL |
| 该候选的有效固定样本 | 52通过、Q05一项待审；含明确记录的冻结响应回放和补测，不是53次最终版本首次全部正确 |
| 该候选的重复与N组 | 指定重复15/15、原N组8/8；有限、目的选择的来源复核，不是总体准确率 |
| Q05开发新包 | 显式全称结构已形成，但两次适用域不同；定向8次中6通过、2待审，完整新方法补测未完成，未安装到58618 |
| 工程回归 | 最近Q05报告为6689通过、0失败、17跳过；不等于语义验收，也不是本次main文档合并的测试成绩 |
| 完整边界产品链 | 新LLM编译链到全部BXP计算与下游核查的端到端产品验收仍待完成 |

版本、结果来源、未关闭事项与调用预算统一维护在[状态页](docs/SHORT-COMPILER-STATUS.md)。**旧版本成绩不能冒充新Skill/Schema成绩，候选包存在不等于正式发布。**

## 产品继续怎样推进？

```text
完成可靠的短文本7+1编译
→ 接通同一结构到既有形式化与确定性边界计算
→ 核查PM计划和Agent下游内容是否符合父边界
→ 扩展完整真实任务
```

7+1是语义基础，Boundary Result是后续计算产物。ADMIN确定边界，PM在边界内规划；BoundaryXP既检查越界，也检查必需内容遗漏，不新增业务执行器。

300码点是当前支持范围，不是永久产品上限。Gold-60用于完整真实TASK的后续验证时，必须保留原文，不能裁短或把Gold答案送入模型。

## 分支、版本与既有能力

BXP协议版本、方法手册修订、根仓库包版本与短文本安装包版本不同。不要为了名称一致把它们都改成“0.4”，也不要将旧Wire Contract重新贴标签当作新版符合性。

仓库保留[主分支既有BXP Core入口](src/bxp/index.mjs)、[协议说明](protocol/README.md)和[结构化示例](examples/README.md)。开发分支的计算扩展须按[对应源码快照](https://github.com/joinwell52-AI/BoundaryXP/blob/a55363226b465cb120ce8f2624d5d900d5a39d9d/src/bxp/index.mjs)核对；局部能力不等于新原文链已经全面贯通。本次仅合并文档，不合并候选代码，不发布新包、不移动标签、不部署服务。

## 数据、许可与品牌

用户历史、凭据、真实企业身份/策略和模型权重不随候选源码公开。取消、升级、回滚与服务恢复遵守正常审批及版本校验，不绕过拒绝。

许可以[LICENSE](LICENSE)及第三方实际条款为准；本轮不变更许可或包发布状态。[品牌资产](assets/branding/README.md)保留，不因方法更新重做Logo。

进一步阅读：[功能矩阵](docs/FUNCTIONS.md) · [验证规程](docs/VALIDATION.md) · [开发分支当前任务](https://github.com/joinwell52-AI/BoundaryXP/blob/review/7plus1-parser/docs/tasks/7plus1/CURRENT-TASK.md)。历史研究方法和成绩与当前候选能力分开，不把测试报告当产品本身。

## 文档列表

保留原有文档入口，同时列出新的7+1方法与状态说明。旧规范和历史任务按各自版本阅读，不因列入导航而成为当前开发指令或验收结论。

| 文档 | 入口 |
|---|---|
| 完整文档导航 | [文档目录](docs/README.md) |
| 完整产品手册 | [BoundaryXP产品手册](docs/BOUNDARYXP-PRODUCT-MANUAL.md) |
| 7+1编译方法 | [定义、原理、语义编译与边界计算说明 v0.4](docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md) |
| 7+1雷达图形展示方法 | [单文本条款—维度关联投影与展示规范](docs/7PLUS1-RADAR-VISUALIZATION-METHOD.md) |
| 边界计算方法与产品作用 | [边界计算说明](docs/BOUNDARY-CALCULATION-METHOD.md) |
| 快速开始 | [中文](QUICKSTART.md) · [英文](QUICKSTART.en.md) |
| 功能、版本与交付状态 | [功能矩阵](docs/FUNCTIONS.md) · [短文本编译器状态](docs/SHORT-COMPILER-STATUS.md) |
| BXP协议 | [中文规范](protocol/BXP-0001.zh-CN.md) · [英文规范](protocol/BXP-0001.md) · [协议导航](protocol/README.md) |
| Gold案例规范入口 | [案例规范索引](docs/GOLD-CASE-SPECIFICATIONS.md) |
| Real Gold生成与审定标准 | [生成与审定标准](docs/GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md) |
| Real Gold生成执行方法 | [SOP](docs/GOLD-GENERATION-SOP.md) |
| Real Gold文件版式与双语展示 | [展示规范](docs/GOLD-PRESENTATION-AND-BILINGUAL-FORMAT.md) |
| Producer接口 | [Producer Adapter Contract](docs/PRODUCER-ADAPTER-CONTRACT.md) |
| 语义资源与企业L3 | [语义包目录](domain-packs/) · [Enterprise L3说明](docs/L3-EMPLOYEE-DIRECTORY-GUIDE.md) |
| 本地验证与研究指标 | [验证说明](docs/VALIDATION.md) |
| 历史BXP 0.4本地开发任务 | [v1.2任务书，历史记录](docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md) |
| 当前开发任务 | [review分支当前指针](https://github.com/joinwell52-AI/BoundaryXP/blob/review/7plus1-parser/docs/tasks/7plus1/CURRENT-TASK.md) |
| 版本与许可 | [变更历史](CHANGELOG.md) · [LICENSE](LICENSE) |

## 仓库文件与目录

[打开main的完整文件列表](https://github.com/joinwell52-AI/BoundaryXP/tree/main)。当前这个`README.zh-CN.md`地址是单个文件的阅读页；文件浏览入口与README中的文档列表是两回事。

| 目录或文件 | 内容 |
|---|---|
| [docs/](docs/) | 产品、方法、功能、验证与开发文档 |
| [protocol/](protocol/) | BXP规范、Schema及符合性资料 |
| [src/](src/) | 当前main源码 |
| [domain-packs/](domain-packs/) | 当前分支语义包与资源说明 |
| [examples/](examples/) · [fixtures/](fixtures/) | 示例和测试资料 |
| [ui/](ui/) · [ui-server.mjs](ui-server.mjs) | 既有本地应用页面与服务入口 |
| [python/](python/) · [scripts/](scripts/) | Python组件与辅助脚本 |
| [cli.mjs](cli.mjs) · [mcp.mjs](mcp.mjs) | CLI与MCP入口 |
| [package.json](package.json) · [package-lock.json](package-lock.json) | 本分支实际命令与依赖锁 |
| [assets/](assets/) | Logo与品牌素材 |

短文本候选源码与运行包在[开发分支](https://github.com/joinwell52-AI/BoundaryXP/tree/review/7plus1-parser)，不与main现有文件混为同一版本。

## 品牌资产

原有Logo文件继续使用，不重新设计、不改色、不改名。全部素材见[品牌目录](assets/branding/README.md)及[原Logo素材包](assets/branding/BoundaryXP-logo-pack-v1.zip)。

| 素材 | 原文件 |
|---|---|
| 中文Logo：图标＋界痕 | [透明版](assets/branding/v2/BoundaryXP-logo-light.png) · [白底版](assets/branding/v2/BoundaryXP-logo-dark.png) |
| 英文Logo：图标＋BoundaryXP | [透明版](assets/branding/v2/BoundaryXP-logo-light.png) · [白底版](assets/branding/v2/BoundaryXP-logo-dark.png) |
| 独立图标 | [透明版](assets/branding/v1/BoundaryXP_Icon_transparent.png) · [白底版](assets/branding/v1/BoundaryXP_Icon_white.png) |
| GitHub／App图标 | [512像素透明版](assets/branding/v1/BoundaryXP_Icon_512_transparent.png) |
