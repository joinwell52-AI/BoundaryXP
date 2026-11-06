# BXP — Boundary Xplain Protocol（边界分析协议）

当前本地工作台为 **B-332**。联合分析与Core核验已按实现提供，但运行指令仍加载已记录的draft.1附件；不得把协议文档评审或历史复算当作完整draft.2迁移/符合性。当前用户操作见[B-332快速开始](../QUICKSTART.md)，已有审计见[验证索引](../docs/VALIDATION.md)。

当前协议文档评审通过基线：**BXP-0001 0.4.0-draft.2 / 2026-10-27-r2**。中英文正文、配套描述符与核验材料保持已审定字节，评审通过记录单独保存。

**[中文正文](versions/0.4.0-draft.2/BXP-0001.zh-CN.md) · [English normative text](versions/0.4.0-draft.2/BXP-0001.md) · [固定基线与完整下载](baselines/0.4.0-draft.2-20261027-r2/README.md)**

## 版本与状态 / Versions and status

| 对象 | 版本／状态 | 含义 |
|---|---|---|
| 本轮协议文档基线 | 0.4.0-draft.2 / 2026-10-27-r2 | 本轮文档评审通过；以 ZIP SHA-256 固定内容 |
| 已固定正文元数据 | DRAFT_FOR_REVIEW；NOT_IMPLEMENTED | 保留原字节；外置评审记录不修改这些字段 |
| 产品根版本 | 1.3.0-preview.0 | 与协议、工作台构建包及方法文档版本独立 |
| 既有 boundx-task/v1、boundx-result/v1 | 0.3.0-draft.2 | 运行 Schema 维持原合同，不静默改标签 |
| draft.2 传输 Schema、可执行 Profile、宿主准入 | 待分阶段交付并验证 | 现有实验模块不等于完整新协议符合性 |

The accepted document baseline is distinct from runtime conformance and product release. The frozen text still carries its original draft metadata. The acceptance record binds the exact archive; it does not certify the implementation or authorize execution.

## 当前方法约定 / Current method contract

任务原文 → 候选解释 → 7+1 与共享关联组成的完整载体 → 形式模型 M → 固定算子与精确查询的数学内容 E → 固定上下文 Θ 下的整体结果 B → 宿主按精确版本准入。

- I/O/A/P/R/V/C 与独立 B 的定义不变；跨视图身份、顺序、条件及交接由共享结构保留。
- 数学求值与整体评估分开；固定查询包含操作数、参数、观察域、依赖和必需性。
- 问责未完成时省略视图聚合状态，保存归约元数据；不补造 null 或第四态。
- 下游比较区分具体实现、部分观察与候选规格。父环境和策略证据仅在相应条件下要求。
- 准入不等于业务裁决或执行授权；两个授权字段保持 null。

完整语义以双语正文为准。本页只提供导航，不重新定义协议或机器 Schema。

## 配套与复核 / Companions and verification

- [当前版本入口及变更说明](versions/0.4.0-draft.2/README.md)
- [配套描述符](versions/0.4.0-draft.2/contracts/README.md)：基础载体、阶段索引、状态归约、求值与评估责任；尚未注册为运行合同。
- [实现与迁移范围](IMPLEMENTATION.md) · [全仓文档核对记录](../docs/BXP-DOCUMENTATION-AUDIT-20261027.md)
- [旧 task Schema](schemas/boundx-task-v1.schema.json) · [旧 result Schema](schemas/boundx-result-v1.schema.json)：仅按各自精确版本使用。

从本仓库核验固定包内材料：

```text
python -B protocol/versions/0.4.0-draft.2/review/check_revision.py verify --package
```

该模式检查包内字节、双语公式及有限算例。仓库模式的旧文件保留检查针对原制作工作区，不把后续文档同步后的工作树冒充原快照。详见[基线说明](baselines/0.4.0-draft.2-20261027-r2/README.md)。

## 历史资料 / History

- [前一份 draft.2 原始归档](archive/0.4.0-draft.2-20261027-r1/README.md)
- [draft.1 原始资产](versions/0.4.0-draft.1/BXP-0001.md)
- [同步前 GitHub 英文入口](archive/before-draft2-github-main-20261027/BXP-0001.md) · [中文入口](archive/before-draft2-github-main-20261027/BXP-0001.zh-CN.md)
- [治理草案](GOVERNANCE.md) · [来源规则](PROVENANCE.md) · [知识产权](IPR.md) · [商标](TRADEMARKS.md)

历史任务书、原稿、用例和验证记录按各自版本读取，不自动升级、重计通过率或成为当前实施授权。仓库保持私有；本次同步不发布产品，不移动已有发布标签，也不修改许可证。
