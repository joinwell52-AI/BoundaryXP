# 当前剩余项 / Remaining work

2026-09-15检查点；本页不修改原任务书和历史回执，不宣称全部完成。

This checkpoint supplements, rather than rewrites, the taskbook and historical receipts. Overall acceptance is incomplete.

## 已补齐的工程项 / Engineering additions

- 64组契约/安全矩阵及固定名册setup已经实现，不再列为尚未编写。
- [验收运行器](../ADMIN-ACCEPTANCE-RUNNER.md)支持120条原文加固定30条复测计划、12种隔离场景及真实记录格式；完整初始计划已有150位置记录，其中149条完成、1条中断。中断项另行补跑，详见[真实运行回执](ADMIN-CODEX-LIVE-ACCEPTANCE.md)，不抹掉初始失败。
- [新增L2候选链路](../L2-PIPELINE-REGRESSION.md)覆盖15词帧×中英×四类120fixture，修复标签回放的歧义原因丢失/拒绝问题；这不是模型语义准确率证明。
- [离线金标草稿工作区](../ADMIN-GOLD-DRAFTS.md)已支持120条原文、真实包锁/准备快照、标注备选候选检查；不自动生成答案，不冻结语义匹配器，不认证独立审阅。
- 审阅入口新增`--check-all`，完整核对120条并按语言/类别报告缺口；拒绝不完整或重复清单。本机现有工作区实查为120条未标注、0条损坏，不是120条金标已完成。 / Whole-workspace auditing reports all 120 cases by language/category and rejects incomplete or duplicate manifests. The existing local workspace contains 120 unannotated cases and zero unavailable contexts, not completed gold labels.
- [草稿比较器](../ADMIN-DRAFT-SCORING.md)已支持多答案分开比较、失败分母、重复预测及关系差异；仍不是最终冻结评分器。
- 草稿比较器0.2.0增加逐桶证据计数，区分引文定位与解释匹配；中英重复引文、非BMP、CRLF和组合字符测试不替代独立语义审阅。 / Matcher 0.2.0 separately counts entry evidence; Unicode and bilingual regression tests do not replace independent semantic review.
- [批量比较](../ADMIN-BATCH-COMPARISON.md)已支持固定150个运行位置、运行器原始记录输入和逐语言/测试类别统计；不等于逐行业覆盖或正式语义准确率。
- API、Cursor和[Codex订阅通道](../CODEX-CONNECTION.md)已有代码，三层报告和唯一Core已接通；连接成功不等于语义验收完成。
- [固定复测审计](../ADMIN-REPEAT-AUDIT.md)已加入30组配对和同候选本地回放；缺失、模型/上下文变化与模拟运行分别报告，不替代真实验收。

2026-09-15：从用户提供的本仓库.env读取Cursor配置，模型目录40项正常。修复清理错误后，真实生成仍失败，服务端明确报告用量耗尽；不自动购买额度或切换模型。Codex订阅登录及最小生成成功，微服务单例已有真实候选通过本地校验和Core；第一次来源引用失败保留，不计入150次固定验收。

Cursor catalog access works but generation reports exhausted usage. Credentials came only from the repository .env, never another process or project. Codex managed sign-in and a full microservice smoke test now work; an earlier rejected candidate is retained. These checks do not count as the fixed 150-run acceptance.

The fixed safety matrix, setup builder, bounded runner and L2 candidate pipelines are implemented. API/Cursor/Codex transports exist. None substitutes for fixed-corpus Host generation or gold review.

## 必须完成的剩余项 / Remaining gates

最新作者草稿进展：`--create-authored`现已覆盖T001–T120逐条编写的候选与双语理由；`--create-io`保留10条模式。120条初稿均通过结构测试，包含精确数量区间、两组显式依赖环和重复引文定位。复杂关系/身份映射/完整BXP预期、允许替代表示及独立审阅仍未完成；不能计为120条完成金标。

Authored-draft progress: `--create-authored` covers all 120 first candidates with bilingual rationale, while IO-only mode remains available. Structural tests cover exact quantity intervals, two explicit dependency cycles and repeated quote location. Complex relations, identity mappings, complete BXP expectations, alternatives and independent review remain incomplete; first drafts are not reviewed gold.

关系增量：4条交接/环境scope用例、11条布尔条件用例已增加作者结构与反事实检查（T112重叠，共14条），不是完成了所有scope或冻结了最终语义评分。 / Relation increment: four handoff/environment-scope cases and eleven Boolean-condition cases now have authored structures and counterfactual checks (14 distinct cases, with T112 overlapping), not complete scope coverage or frozen semantic scoring.

| 项目 / Item | 当前缺口 / Outstanding work |
|---|---|
| Codex接入 / Codex transport | 已接通订阅文本候选，需持续维护实验接口兼容性；全局Codex策略仍可能加载，不宣称完全空白上下文 |
| WP1金标与评分 / Gold and scoring | 120条答案集合、证据/关系判定器和逐语言/类别的分子分母尚未冻结；独立审阅0/120 |
| WP3语义验收 / L2 semantic acceptance | 已补表示层端到端；真实模型的否定、歧义、缺证据行为尚未经独立答案评测 |
| WP6/WP9真实Host / Live Host | Codex初始150位置为141计算、8拒绝、1中断；中断项已补跑，T054单位修复及另外5条候选修复均各有一次真实返回并通过Core。原始结果不覆盖；跨实现/提示版本分开报告。独立金标、正式语义判定及新提示全语料表现仍未完成 |
| WP9最终交付 / Final delivery | 剩余门槛满足后，更新完整文件清单、失败与限制、真实模型及包身份，提交ADMIN审核；保持Draft，不合并发布 |

行业库和Case Explorer仍存在另一任务的未提交资产，本实施不覆盖或擅自提交。Codex订阅浏览器单例实查已记录于[交付检查点](ADMIN-CODEX-DELIVERY.md)，不等于固定语料验收。当前运行中的预览进程不自动代表最新提交。

Concurrent industry and Case Explorer assets remain untouched. The recorded browser smoke test does not replace fixed-corpus acceptance. An already running preview is not automatically evidence of the latest commit. Independent review, live runs and final ADMIN approval remain separate gates.
