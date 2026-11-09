# 7+1与BXP研究

[English](RESEARCH.en.md) · **简体中文**

## 当前论文

**《BXP：基于7+1关联表示的人工智能任务边界判定方法》**

朱卫（Wei Zhu），独立研究者。**中文r23／英文v1.2，2026-11-06，已在GitHub发布预印本。**

[中文PDF](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.zh-CN.pdf) · [英文PDF](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/BoundaryXP-manuscript.en.pdf) · [完整研究材料包](https://github.com/joinwell52-AI/BoundaryXP/releases/download/paper-v1.2-r23/manuscript-with-materials.zip) · [Release与校验摘要](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/paper-v1.2-r23) · [附件导航](paper/README.md)

**Zenodo DOI：[10.5281/zenodo.24072738](https://doi.org/10.5281/zenodo.24072738)。** 2026-11-09完成Zenodo发布，[公开记录及全部文件](https://zenodo.org/records/24072738)无需GitHub仓库权限即可访问。出版日期保留首次GitHub发布日2026-11-06。

当前分发修订为`RESEARCH_ONLY_1`。GitHub仓库仍保持私有；Zenodo公开存档不表示论文已经同行评审或期刊录用，也不替材料新增使用授权。

引用可用：Zhu, W. (2026). BXP: A Method for AI Task Boundary Verification Using a 7+1 Relational Representation (Version 1.2; 中文r23). Zenodo. https://doi.org/10.5281/zenodo.24072738 。

## 研究什么

把自然语言任务转为执行方案或分解为子任务时，如何检查它是否保留原任务的交付义务、行为限制和整体约束？7+1用输入、交付、动作、责任、资源、版本依据、完成停止及独立禁止边界组织要求，共享结构保留对象身份、条件、顺序和交接。

稿件围绕三个环节展开：

1. **语义组织与来源责任：** 将原文主张、用途、关联和未决记录下来，不把分类或引文匹配当作语义正确的证明。
2. **形式化与数学判定：** 在来源对应健全完整、用途及关联覆盖、结构恢复、解释一致和编码精确等前提下，研究受支持片段内的相容性、成员、等价和蕴含判定。
3. **分解保持：** 处理父环境范围、逐情境覆盖、分支激活和共享约束，避免把各子任务局部成立直接等同于整体保持。

这些保证有明确前提，不是对任意自然语言无损理解的证明。端到端语义质量、形式模型是否忠于原文，以及后端计算是否正确，需要分别核实。

## 实验与附件

论文采用**625组用例、3219个任务节点、3469项计算**。现行标注与LLM最终答案、LLM与计算器整体答案均为625/625一致；整组结论为越界259、未越界246、信息不足120。

逐项计算另计：3457项一致、9项差异、3项未完成。9项差异包括6项标签编码差异和3项实际计算判断差异；后3项计算器正确，LLM该项判断不当，均不改变整组结论。3项未完成源于题面缺少固定汇率或税率；另有1例引用编号错误影响3项。整体一致不代表所有局部角色或计算项一致，也不是独立盲测准确率。

附件保留原始任务、现行标注及修订、7+1报告、操作数、保存结果、双语协议、真实界面截图，以及独立数学和统计核验脚本。**不含58618工程源码、运行依赖或生产提示模板。**保存的产品结果核对与独立数学复算分别说明，不将附件核对称为产品重放。

协议评审基线、论文采用的方法和受测运行实现分别绑定版本。稿件采用draft.2；实际工作台仍有draft.1附件迁移差异，[实现说明](../protocol/IMPLEMENTATION.md)保留这一事实。

## 与产品及MCP的关系

论文阐述方法及条件，BoundaryXP是其工程实现。受测工作流由LLM联合生成候选语义及操作数，再由共享Core核验；论文描述的完整准入职责不等于当前工具已通过全部协议符合性。此次论文发布不改动产品安装或运行状态。

计划通过MCP向宿主提供当前自然语言联合分析能力，保持同一Core、原文来源和未决语义；已有结构化MCP工具与该计划分别说明，见[MCP状态](MCP.md)。

[项目介绍](INTRODUCTION.md) · [协议](../protocol/README.md) · [路线图](ROADMAP.md)
