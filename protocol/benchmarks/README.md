# BoundX Natural-Language Extraction Benchmark Candidate

本目录管理“自然语言 → 7+1 候选 IR”的信息性评测，不属于 BXP-CALC 规范一致性测试。

## 为什么必须分开

结构化 IR 上的区间、集合、图和布尔计算可以要求完全确定；自然语言抽取则包含词义、指代、范围、角色、效果身份和行业知识的不确定性。把两者混成一个“140/140 通过率”，会把计算正确率错误包装成语言理解正确率。

因此：

- `protocol/conformance/` 检查结构化 IR 的确定性行为；
- 本目录评测自然语言编译器是否正确抽取、保留证据并在不能证明时挂起；
- 私有对抗集不进入公开仓库，防止按答案调规则。

## 当前 160 条来源记录

[corpus-manifest.json](corpus-manifest.json) 登记 140 个主编号案例（1—140）和 20 个早期 1—20 变体，共 160 条来源记录；[source-index.json](source-index.json) 以 Git Blob SHA 固定其来源。它们目前不是规范性抽取 Gold Corpus，`gold_cases` 仍为 0。

BXP-CALC `1.0.0-draft.3` 为每条历史来源保留一个 `calculation-pattern-only` 派生向量，基础向量含原16条与本次加固32条，总计208条。派生向量只继承“应覆盖哪类数学路径”的灵感，使用独立的规范化结构输入；不宣称是原文的完整 7+1 翻译。加固与双语计算测试不增加抽取 Gold 数量。

## 进入 Gold Corpus 的门禁

每条用例必须同时具备：

1. 不可变原文和内容摘要；
2. I/O/A/P/R/V/C+B 每项的 `resolved/unresolved/absent`；
3. Unicode 码点 Span；
4. 归一化对象、量纲、单位、动作效果和身份假设；
5. 允许多个合法解释的歧义集；
6. 预期计算输入与结果，而不是只写“通过/阻断”；
7. 两名标注者及分歧解决记录；
8. 正例、反例和应当拒绝猜测的样本；
9. 语义包、规则或模型版本；
10. 与公开规范向量分离的测试编号。

## 建议指标

| 指标 | 计算对象 |
|---|---|
| Element precision / recall | 八个要素桶及条目 |
| Evidence exact match / overlap | 原文 Span |
| Normalization accuracy | 实体、动作、效果、量纲与单位 |
| Ambiguity recall | Gold 标为多解时是否挂起 |
| Unsupported abstention | 证据不足时是否拒绝填充 |
| False authorization rate | 是否把审批提及误写成已授权 |
| Calculation readiness | 输出是否满足 BXP-CALC 输入合同 |

不得用单一平均分掩盖高风险错误。越权动作、审批守卫、生产目标、密钥和不可逆效果应单独报告召回率与错误样本。
