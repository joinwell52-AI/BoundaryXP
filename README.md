# 界痕 · BoundX

> 执行之前，先把任务边界算清楚。

BoundX 是 **BXP — Boundary Xplain Protocol（边界分析协议）** 的产品实现，为 ADMIN 的任务文本提供语义分析、确定性边界计算和修订建议。

## 当前产品目标

`Task Semantics → IR7+1 → FormalBoundaryModel → BoundaryResult → Admission → DownstreamConformance`

- **7+1**：I输入、O交付、A动作、P责任主体、R资源、V依据、C完成与停止、B禁止边界；保留原文证据和未知。
- **形式模型**：表达实体、作用域、关系、义务、禁止、资源、逻辑和时间约束。
- **边界结果**：输出 determined、underdetermined、inconsistent、invalid，以及具体边界、冲突和缺口。
- **准入**：绑定精确版本；任务修改后重新复核，宿主在失败或未知时阻止发布。
- **下游符合性**：计划与子任务必须符合已冻结的父边界。

ADMIN 完善建议后重新计算，再进入任务书发布。Admission 不等于执行授权；`business_decision`、`execution_authorization` 始终为 null。

## 开发状态

| 项目 | 当前状态 |
| --- | --- |
| 产品版本 | 1.3.0-preview.0 |
| 目标规范 | BXP-0001 0.4.0-draft.1 |
| 完整0.4实现与验收 | 开发中，尚未完成 |
| Gold | Core 100 + L3 100，候选待审定 |
| 正式三路准确率 | 尚未发布 |
| 仓库许可证 | MIT，见 [LICENSE](LICENSE) |
| 仓库可见性 | 私有；本次文档更新不授权公开或发布 |

## 三路线与语义上下文

LLM、spaCy、HanLP是被测Producer，不是标准答案。三路使用同一允许上下文、同一Core和比较器，Gold只用于独立比较。

- **LLM**：参考对照，记录实际模型、配置和原始响应。
- **spaCy**：本地商用候选，具体模型及依赖许可须核验。
- **HanLP**：研究对照，具体模型许可明确前不进入商用默认路径。

L1为 `core-ontology@1.1.0`，L2为 `software-ai@0.2.0`。软件与AI分为 DevSecOps、MLOps、RAG与推理、Agent治理四个子类。

L3目标为 **Enterprise L3 Profile v2**：身份、岗位、职级、权限彼此分离；权限由适用的显式绑定或有效委派支持，不由岗位或经理关系推断。

## 本地研究与验收

依照 **v1.2 LOCAL任务书**，开发、测试、证据和交付在 `D:\boundx` 完成，不依赖GitHub Actions、Artifacts或Codespaces。

正式评测需先冻结Gold、Wire Contract、Formalizer、Operator Profile、L3 Profile、Scorer并通过Admission门禁。Primary计划600个单元，Stability计划1800个单元，适用性和N/A逐例公开。指标包括语义、形式化、边界和准入准确率，以及 **FDR、FAR**。

每次实验保留失败、重试、源码状态、原始输出和摘要清单。200例用于开发与符合性验证；论文泛化结论需要另行制作并封存Holdout。

## 文档

- [当前文档导航](docs/README.md)
- [产品手册](docs/BOUNDX-PRODUCT-MANUAL.md)
- [v1.2 LOCAL开发任务书](docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)
- [中文协议](protocol/BXP-0001.zh-CN.md) · [English specification](protocol/BXP-0001.md)
- [快速开始](QUICKSTART.md) · [功能与状态](docs/FUNCTIONS.md)
- [验证与研究指标](docs/VALIDATION.md)
- [Producer合同](docs/PRODUCER-ADAPTER-CONTRACT.md) · [语义上下文](docs/SEMANTIC-PACK-SPEC.md)
