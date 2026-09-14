# 当前剩余项 / Remaining work

2026-09-15检查点；本页不修改原任务书和历史回执，不宣称全部完成。

This checkpoint supplements, rather than rewrites, the taskbook and historical receipts. Overall acceptance is incomplete.

## 已补齐的工程项 / Engineering additions

- 64组契约/安全矩阵及固定名册setup已经实现，不再列为尚未编写。
- [验收运行器](../ADMIN-ACCEPTANCE-RUNNER.md)支持120条原文加固定30条复测计划、12种隔离场景及真实记录格式；未实际运行模型验收。
- [新增L2候选链路](../L2-PIPELINE-REGRESSION.md)覆盖15词帧×中英×四类120fixture，修复标签回放的歧义原因丢失/拒绝问题；这不是模型语义准确率证明。
- API及Cursor接入已有代码，三层报告和唯一Core已接通；不以此宣称Codex登录通道可用。

The fixed safety matrix, setup builder, bounded runner and L2 candidate pipelines are implemented. API/Cursor transports exist. None substitutes for actual Host generation or gold review.

## 必须完成的剩余项 / Remaining gates

| 项目 / Item | 当前缺口 / Outstanding work |
|---|---|
| Codex接入 / Codex transport | 未实现；须验证纯文本生产者隔离，不能把只读沙箱等同于禁用所有工具 |
| WP1金标与评分 / Gold and scoring | 120条答案集合、证据/关系判定器和逐语言/类别的分子分母尚未冻结；独立审阅0/120 |
| WP3语义验收 / L2 semantic acceptance | 已补表示层端到端；真实模型的否定、歧义、缺证据行为尚未经独立答案评测 |
| WP6/WP9真实Host / Live Host | 真实生成0/150；需明确兼容Host及虚构数据外发/费用授权，不能以API目录读取或mock替代 |
| WP9最终交付 / Final delivery | 剩余门槛满足后，更新完整文件清单、失败与限制、真实模型及包身份，提交ADMIN审核；保持Draft，不合并发布 |

行业库和Case Explorer仍存在另一任务的未提交资产，本实施不覆盖或擅自提交。当前运行中的预览进程不自动代表最新提交；尚未把新提交的浏览器实查作为验收证据。

Concurrent industry and Case Explorer assets remain untouched. An already running preview is not automatically evidence of the latest commit. Independent review, live runs and final ADMIN approval remain separate gates.
