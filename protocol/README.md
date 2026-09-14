# BoundX Protocol

本目录承载界痕（BoundX）的协议草案、机器可读合同和一致性测试，不是第二套语义系统。

当前协议标识为 **BoundX Task Boundary Protocol（BXP）**，第一份草案为 `BXP-0001`。协议核心固定为 I/O/A/P/R/V/C 与独立禁止边界 B；自然语言抽取、L1/L2/L3 语义包和商业引擎都是这一核心表示的生产者或消费者。

## 当前文件

- [BXP-0001 英文规范](BXP-0001.md)：当前规范性草案。
- [BXP-0001 中文译本](BXP-0001.zh-CN.md)：便于中文评审；发生差异时以英文草案为准。
- [任务 IR Schema](schemas/boundx-task-v1.schema.json)：`boundx-task/v1`。
- [计算结果 Schema](schemas/boundx-result-v1.schema.json)：`boundx-result/v1`，包含类型化计算结果和空授权字段。
- [BXP-CALC 套件 Schema](schemas/boundx-calc-conformance-suite-v1.schema.json)：正式向量文件合同。
- [BXP-CALC Conformance Suite 1.0 Draft](conformance/bxp-calc-v1.0.json)：208 条冻结向量，完整结果逐项比对。
- [参考实现说明](IMPLEMENTATION.md)：当前计算合同、验证范围和未实现边界。
- [历史案例来源索引](benchmarks/source-index.json)：140 个主案例、20 个早期变体，共 160 个来源记录。
- [自然语言抽取基准候选](benchmarks/README.md)：抽取评测与 BXP-CALC 分层治理。
- [数字来源与取证边界](PROVENANCE.md)：哈希清单、稳定编号与私有挑战集的合规约束。
- [轻量产品与发布方案](../docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md)：部署中立的轻量预检引擎、公开范围、行业定制、价格验证与四项发布检查的待确认草案。
- [BoundX 产品手册](../docs/BOUNDX-PRODUCT-MANUAL.md)：部署中立定位、Python/CLI/MCP/Server/插件入口、语义包和 FDE 落地合同。
- [治理草案](GOVERNANCE.md)、[IPR 草案](IPR.md)和[商标使用草案](TRADEMARKS.md)。

## 状态边界

```yaml
protocol: BXP-0001
version: 0.3.0-draft.1
conformance_suite: 1.0.0-draft.2
status: DRAFT_FOR_REVIEW
publication_authorized: false
standard_claim_authorized: false
certification_authorized: false
business_decision: null
```

本目录进入代码仓库只表示形成了可评审的协议候选，不表示已经公开发布、形成行业标准、获得专利或商标注册，也不授权任何任务执行。

## 本地验证

```text
npm ci
npm run test:protocol
npm test
```

在独立仓库根目录 `D:\boundx` 执行；完整 Schema 校验使用锁定的 Ajv，运行计算不联网。一致性通过只表示实现对 208 条冻结结构化向量给出了完全一致的 `boundx-result/v1`。160 个历史来源与计算模式是一一对应的 `calculation-pattern-only` 派生，不是原文语义翻译或抽取金标；通过也不表示任务安全、获得授权或业务目标已经完成。
