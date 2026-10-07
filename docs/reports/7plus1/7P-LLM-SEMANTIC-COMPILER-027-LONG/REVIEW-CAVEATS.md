# 比较结果与原文语义的复核边界

本文件只审阅已保存的开发输出，不改变输入、参考、候选图或方法。锁定集在首轮输出封存前不参与本文件的例证选择。

## 已保存的具体依赖链

开发案例 `BLIND-001` 原文包含：

> 核验 隔离环境 中的 build-6771.csv。并比较 snapshot-13955.json。

`development-policy-v2/exposed200/BLIND-001/trace.json` 中，`e_check` 已获 CERTIFIED；`f_build` 的来源是原文文件名，类型为 FILE，artifact_use 为 EXISTING_INPUT，Auditor 的候选检查也支持其输入解释。

但是 `finding_compare_operand` 对比较的另一端是否明确提出 COVERAGE_GAP，把 `e_compare`、`r_compare_material`、`f_build`、`f_snapshot` 一起列为相关候选。其疑问针对比较操作：原文没有明确要求将 build 与 snapshot 彼此比较，不能补出该关系。

当前有限 Γ 对 finding 的 candidate_ids 采取整体保留未决的策略。因此 `f_build` 变成 TYPED_UNRESOLVED，理由为 `UNRESOLVED_BOUNDARY_CHANGING_AUDIT_FINDING`；`r_check_material` 随之成为 `UNCERTIFIED_DEPENDENCY`。

这条链说明：候选存在、来源正确、独立候选检查支持，也可能因审计疑问的影响范围过宽而无法认证。比较另一端未指定的真实疑问必须保留，但其对独立核验对象的影响需要 ADMIN 复核。完整候选、原始 finding 和 Γ 决策均保留在 Trace；本轮锁定评测开始后未修该策略。

源码位置：`gamma-v04.mjs` 中 `UNRESOLVED_BOUNDARY_CHANGING_AUDIT_FINDING` 检查；不是模型置信度排序问题，也不是 source offset 丢失。

## 历史参考不是完整的当前语义裁定

同一案例原文说“本任务由 Taylor 负责组织”。已有暴露开发参考还要求各项操作的 actor 为 Taylor。这涉及组织职责与每个具体动作执行主体的区别：不能单凭参考断言失败就断定 Parser 漏掉了原文明确给出的执行者，也不能自动把组织者复制为所有动作的执行者。原文、实际组织角色与历史检查一起提交，等待 ADMIN 裁定；参考没有被修改。

Root 参考以描述性 intent 为主，未枚举全部动作、scope、内容条件和角色。Natural 参考和 exposed200 框架也有未适配或需复核的区别项。所有无法验证项显式标记 NOT_VERIFIED，不由另一次模型调用补答案。

## 参考全通过仍不等于任务完整闭合

开发案例 `ROOT-020` 在有限策略重放后通过已有参考检查，但整体多个槽位仍为 UNRESOLVED，完整描述性 intent 审阅也仍为 NOT_VERIFIED。因此“参考检查新增通过”只用于同一冻结候选图上的有限策略比较，不计为一个任务完整语义闭合。

`NROOT-015` 在重放后具有已解析的输入、交付、动作、参与者和独立禁止边界，新增参考检查通过。但这也只是已有检查覆盖范围内的结果，不据此宣称整个方法已满足 027 的零遗漏、零错误认证要求。

## 数字的含义

- 运行成功：实际 Provider 两次调用完成且保存 Trace。
- 参考检查全通过：当前离线比较适配器没有 FAIL；可能仍有 NOT_VERIFIED。
- 有限合同通过：来源、类型、依赖、层级等有限检查成立；不是自然语言真值证明。
- 完整语义闭合：需要原文全部明确边界、真实歧义、未指定内容、binding 和 scope 的独立审定；本次未证实。

FAILURE-LEDGER 与 FIRST-DIVERGENCE-EVIDENCE 保留每条对比失败、未验证项、准确来源以及候选/认证依赖。审计疑问不会在报告中冒称已证实错误；历史参考通过也不会冒称完整正确。
