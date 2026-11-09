# BXP 实现状态与迁移范围

当前私有工作台为 **B335**（截至2026-11-09），升级记录见[中文日志](../CHANGELOG.zh-CN.md) / [English changelog](../CHANGELOG.md)。联合分析与Core核验按实际实现提供，运行指令仍加载已记录的draft.1附件；协议文档评审和历史复算不等于完整draft.2迁移或符合性。本仓库提供研究与协议资料，不提供私有工作台的源码或安装入口。

规范基线：[BXP-0001 0.4.0-draft.2 / 2026-10-27-r2](baselines/0.4.0-draft.2-20261027-r2/README.md)，已通过本轮文档评审。固定正文的实现字段仍为 `NOT_IMPLEMENTED`；这表示未交付本版完整符合性，不表示仓库不存在计算或准入原型。

The reviewed protocol baseline is not a runtime conformance claim. Existing Core modules and experimental contracts retain their actual versions; neither their presence nor historical tests certify draft.2.

## 既有实现的身份

产品根版本为 `1.3.0-preview.0`。当前 `boundx-task/v1` 与 `boundx-result/v1` 的注册 Schema 仍标注 `0.3.0-draft.2`。其他实验 Schema、工作台构建包及计算模块分别管理版本。机器接口的实际合同以私有实现的版本注册表为准；本文不通过改标签迁移对象。

私有工程中旧生产者字段和示例仅适用于其对应旧合同。draft.2 的部分载体必须支持未完成问责时省略聚合状态，并保留独立诊断；旧 Schema 的必填字段不能被当作新协议定义。

## 后续实现与验证责任

| 交付层 | 需要落实的合同 | 验证重点 |
|---|---|---|
| 传输 Schema | 来源、完整载体、形式模型、查询、数学内容 E、上下文 Θ、结果 B、准入 | 身份与引用闭合；部分载体与三态归约分开 |
| 参考 Profile | 对象种类、解释依赖、支持语言、证据要求和规范化 | 通用、对象专属、条件要求不混用 |
| 数学求值 | 精确查询、实际操作数、算子版本及可复核证据 | 相同完整输入的确定性；超时和未知不作数学结论 |
| 整体评估 | 固定 Θ 与结果归约 | 同一 E 在不同证据上下文下的状态有明确依据 |
| 规格比较 | 情境覆盖、父环境绑定、分支及共享约束 | 局部与组合责任；必要时独立验证因果策略 |
| 宿主准入 | 精确版本、发布政策、失效和重新评估 | 未决或必要证据缺失不能放行；不产生执行授权 |

各层须固定实现快照、输入输出、依赖和正反例后才能作对应范围的符合性声明。本页列出迁移责任，不启动新的 Compiler Pass、冻结 Gold 或扩大既有专项实施权限。

## 2026-10-27协议评审的验证范围（历史记录）

该轮只复核协议文档包、19 份清单文件、26 个双语公式块、43 个章节编号、40 条规范编号及 8 组有限例子。不是生产者准确率、完整 Core/Host 符合性、端到端自动解析或第二独立实现互操作验证。全部本轮检查在本地执行；GitHub 同步不以 Actions 结果作为验收。

[协议入口](README.md) · [协议版本说明](versions/0.4.0-draft.2/README.md) · [工作台升级日志](../CHANGELOG.zh-CN.md) · [研究证据](../docs/RESEARCH.md)
