# 历史BXP-CALC向量 / Historical BXP-CALC vectors

本目录保留BXP-0001 `0.3.0-draft.2` 的结构化计算套件 `1.0.0-draft.3`，共208条冻结向量。它是历史协议数据，不是BXP draft.2完整符合性声明，也不是当前B335工作台的新验收。

This directory retains 208 frozen vectors for BXP-0001 `0.3.0-draft.2`, suite `1.0.0-draft.3`. These historical protocol data do not establish full draft.2 conformance or a new B335 acceptance result.

## 构成 / Contents

| 类型 / Group | 数量 / Count | 范围 / Scope |
|---|---:|---|
| 原基础向量 / Original foundations | 16 | 区间、集合、交接、图、布尔逻辑及来源等计算模式 |
| 加固基础向量 / Additional foundations | 32 | 校验、精度、来源、作用域与未知／冲突归约 |
| 历史模式派生 / Historical pattern-derived cases | 160 | 独立规范化结构输入；不是自然语言抽取Gold |
| 合计 / Total | 208 | 全部为BXP-CALC历史向量 |

[向量JSON / Vector data](bxp-calc-v1.0.json) · [套件Schema / Suite schema](../schemas/boundx-calc-conformance-suite-v1.schema.json) · [历史来源索引 / Source index](../benchmarks/README.md)

## 读取与验证边界 / Inspection and verification

各条目保留原任务对象、`schema_expectation`和完整预期结果信封。对象键顺序不参与比较；数组顺序与全部字段值参与比较。两个授权字段保持null。历史预期由当时参考实现生成，不宣称第二独立实现互操作或独立人工Gold。

这里不再提供依赖私有Core的工程生成器、运行器或产品测试脚本，也没有可用的工作台安装命令。阅读这些JSON不需要安装工作台；如另行实现验证器，应明确对应旧协议／套件身份、实际执行范围和差异，不能通过改写冻结预期制造通过。

The JSON retains task objects, schema expectations and complete expected envelopes. The former engineering generators, runners and tests depended on a private Core and are not distributed here. Reading the data does not require a workbench installation. Any independent verification must name its exact protocol and suite versions, report its actual scope and differences, and preserve frozen expectations.

[协议实现范围 / Implementation scope](../IMPLEMENTATION.md) · [仓库公开范围 / Repository scope](../../docs/PUBLICATION-SCOPE.md)
