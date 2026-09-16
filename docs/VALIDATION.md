# 本地验证与研究指标

开发与验收在D:\boundx进行，不依赖GitHub Actions、Artifacts或Codespaces。命令以当前package.json及实际交付为准，不凭云端绿灯宣布完成。

## 冻结门禁

正式实验前需要ADMIN_GOLD_FROZEN、BXP_0_4_WIRE_CONTRACT_FROZEN、FORMALIZER_FROZEN、OPERATOR_PROFILE_FROZEN、L3_PROFILE_FROZEN、ADMISSION_GATE_PASS、SCORER_FROZEN。

冻结前结果标记PRE_GOLD_FREEZE或PRE_IMPLEMENTATION，不发布正式准确率。

## 基线与实验

Core 100和L3 100分别包含四组各25例。Producer适用性逐例审定；非适用项报告N/A及原因，不能计为Producer失败或静默删除。

Primary计划200×3=600；Stability计划200×3×3=1800，独立保存。200例属于开发/符合性基线；论文泛化需独立封存Holdout。

## 指标

- 语义：事实Precision/Recall/F1、槽位状态、证据区间。
- 形式化：identity、scope、modality、negation、数值/时间/逻辑、权限与委派。
- 边界：四状态准确率、混淆矩阵、规范边界差异。
- FDR：预测determined且Gold非determined数量 / Gold非determined数量；分三种非确定状态报告。
- 准入：admitted/blocked、stale、binding mismatch、错误拒绝。
- FAR：预测admitted且Gold blocked数量 / Gold blocked数量。
- 性能：冷启动、热运行、加载、推理、映射、形式化、计算、总耗时、中位数与P95。

按套件、路线、分组报告分子/分母、适用性、失败及覆盖率；零分母为不适用，不能报告0%误导。FDR/FAR非零逐例分析。

## 证据

运行目录不得覆盖，失败和重试均保留。记录协议/Gold/模型/mapper/formalizer/operator版本、源码commit和未提交差异摘要、环境、命令、输入输出摘要及MANIFEST。真实凭据不得保存。

完整任务及交付清单见[v1.2 LOCAL任务书](tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)。当前无已审定完整三路线准确率结论。
