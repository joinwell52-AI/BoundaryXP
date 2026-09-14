# BXP-CALC Conformance Suite 1.0

`bxp-calc-v1.0.json` 是 BXP-0001 `0.2.0-draft.1` 的结构化计算一致性套件草案。任何实现只有在 176 条向量的完整 `boundx-result/v1` 信封逐项一致时，才能声明通过该草案版本。

## 构成

| 类型 | 数量 | 含义 |
|---|---:|---|
| 基础向量 | 16 | 直接覆盖区间、集合、交接、DAG、布尔逻辑、证据和扩展边界 |
| 历史场景派生 | 160 | 与 140 个主案例及 20 个早期变体一一对应的计算模式向量 |
| 合计 | 176 | 全部属于 `BXP-CALC` |

历史场景派生使用独立、规范化的结构输入，只继承计算模式，`origin.derivation` 固定为 `calculation-pattern-only`。它们不是自然语言原文的 7+1 翻译，不构成 BXP-EXTRACT 金标。

## 运行

```text
node protocol/conformance/run.mjs
node --test protocol/conformance/conformance.test.mjs
```

`run.mjs` 比较完整结果信封，包括摘要算法、三个结果轴、发现、类型化计算、空业务决定、空执行授权和扩展对象。

每条向量通过 `schema_expectation` 声明内嵌任务应当通过还是拒绝任务 Schema。这样，一致性套件自身保持结构合法，同时可以承载故意构造的非法输入反例。

## 维护

`build-suite.mjs` 是确定性维护工具。重新生成会重写冻结预期，必须把 JSON Diff 当成规范变更进行独立评审；不能为了让失败实现“通过”而刷新金标。套件当前为 `DRAFT_FOR_REVIEW`，未授权公开发布或认证。
