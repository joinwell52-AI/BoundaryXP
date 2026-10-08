# BoundX文档导航

整理日期：2026-10-08。本导航区分完整产品目标、稳定语义方法、实际安装候选、开发中的新合同及历史研究。文档在`review/7plus1-parser`整理；不表示主分支或已安装包已经同步。

## 1. 先看这六份

| 需要了解什么 | 文档 | 职责 |
|---|---|---|
| 产品是什么 | [中文首页](../README.zh-CN.md) / [English overview](../README.md) | 定位、当前候选、主要入口和产品方向 |
| 怎样开始使用 | [中文快速开始](../QUICKSTART.md) / [English quick start](../QUICKSTART.en.md) | 已安装58618与新目录安装分开，CLI/UI版本不能混用 |
| 最终交付什么 | [产品手册](BOUNDX-PRODUCT-MANUAL.md) | 可靠7+1→实际边界计算→下游符合性，明确当前阶段 |
| 7+1如何得到 | [v0.4方法手册](BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md) | Skill＋LLM主解析、来源、范围、产物流、有限校验和保真编译 |
| 当前做到哪里 | [版本与验收状态](SHORT-COMPILER-STATUS.md) / [功能矩阵](FUNCTIONS.md) | 已安装候选与Q05新包分开；未决问题和实际成绩集中维护 |
| 怎样验证准确 | [验证规程](VALIDATION.md) | 首次候选、修订、JSON、中文、计算结构及工程验收分别记录 |

中文和英文首页、快速开始分别成文；详细产品和方法手册当前为中文，不以英文导航冒充完整英文版已经交付。

## 2. 当前实现与证据

正式运行配置以所选安装版本的清单为准。源码路径用于实现核查，不授予修改本地服务或模型调用的权限。

| 资源 | 用途 |
|---|---|
| [当前开发任务](tasks/7plus1/CURRENT-TASK.md) | 实际执行授权与停止状态；本导航不替代它 |
| [短文本产品交付要求](tasks/7plus1/SHORT-COMPILER-PRODUCT-DELIVERY-CONTRACT.md) | 产品质量、安装、维护与发布门 |
| [语义合同](../research/7plus1-parser/llm-first-028/contracts/semantic-contract.md) / [Schema源](../research/7plus1-parser/llm-first-028/contracts/schema.mjs) | 当前工作区资源；不等于58618已安装合同 |
| [解析Skill](../research/7plus1-parser/llm-first-028/skills/boundx-semantic-parse/SKILL.md) / [审阅Skill](../research/7plus1-parser/llm-first-028/skills/boundx-semantic-audit/SKILL.md) | 同版本实际进入模型请求的规程 |
| [固定安装启动器](../product/short-compiler/launch-installed.mjs) | 用户入口58618，核对版本和已有进程，不改用新端口 |
| [031-R1候选报告](reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/REPORT.md) | 旧候选有效样本、重复、新文本、部署与未决 |
| [Q05范围续作报告](reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-Q05/REPORT.md) | 新范围结构及域解释缺口，未完整验证的新包 |
| [58618恢复回执](reports/7plus1/031-R1-RESTORE-58618/REPORT.md) | 固定入口维护记录；零模型调用，不增加语义成绩 |

## 3. BXP与既有计算能力

[协议导航](../protocol/README.md)、[中文协议](../protocol/BXP-0001.zh-CN.md)、[英文协议](../protocol/BXP-0001.md)和[实现说明](../protocol/IMPLEMENTATION.md)保留各自版本。不能仅因7+1方法文档叫v0.4，就宣称所选分支Wire Contract已符合BXP 0.4。

[Core入口](../src/bxp/index.mjs)与[结构化示例](../examples/README.md)用于已有结构化计算和适配能力。既有[Producer接口说明](PRODUCER-ADAPTER-CONTRACT.md)及[Agent结构化生产者指南](AGENT-BXP-PRODUCER.md)应按其声明的接口版本阅读，不用来覆盖当前短文本Skill合同。`npm run ui`对应的[原BXP UI指南](UI-GUIDE.md)不是58618新入口说明。

资源资料：[语义包](../domain-packs/README.md)、[企业L3说明](L3-EMPLOYEE-DIRECTORY-GUIDE.md)。资源目录存在不等于已自动加载，也不能从岗位推导权限。

## 4. Gold与旧阶段文档

以下是主分支固定快照中的Gold规范入口，**不是本次新生成或重新审定的Gold结果**：

- [Gold生成与审定标准](https://github.com/joinwell52-AI/BoundX/blob/f7aae6421681be22eb2035504b824f4d169bf90c/docs/GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md)
- [Gold生成SOP](https://github.com/joinwell52-AI/BoundX/blob/f7aae6421681be22eb2035504b824f4d169bf90c/docs/GOLD-GENERATION-SOP.md)
- [Gold文件版式与双语展示](https://github.com/joinwell52-AI/BoundX/blob/f7aae6421681be22eb2035504b824f4d169bf90c/docs/GOLD-PRESENTATION-AND-BILINGUAL-FORMAT.md)

完整Source、机器事实、说明Markdown与审定状态分开。源摘要一致和回放成功不能替代语义审定；符号公式和自报PASS不能证明计算已复算。Gold-60不作为当前已授权的短文本自动补测，原文不可裁短、答案不可送入解析器。

旧v0.3方法、三路线实验、200/350样本计划、028的13条启动阶段，以及历史原型用法保留在Git或各自报告中。它们不是当前产品主路线、即时预算或永久输入限制。查看旧页时，先核对日期、分支和所选合同，避免把历史进度当作今天的事实。

## 5. 文档和运行版本的边界

方法手册r05是已存在方法的编辑性整编，未修改运行目录中的Skill、Schema、共享合同或代码。已安装候选仍使用其冻结资源；文件名相同不意味着字节或运行合同相同。

根仓库包、短文本候选包、方法文档修订及BXP协议版本独立记录。文档链接到候选不自动合并main，不移动发布标签，不升级安装包，也不声明Q05通过。

[品牌资产](../assets/branding/README.md)和[许可证](../LICENSE)保持原状。[变更历史](../CHANGELOG.md)记录其覆盖的提交；本轮文档整理由专门回执补充，不把旧版本说明改写成新发布。
