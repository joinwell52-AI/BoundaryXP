# 界痕 · BoundX 功能 / Functions

产品 `1.3.0-preview.0`，私有研发。BXP 是 7+1 数据与计算标准，不是抽取算法。

Agent or another producer submits `boundx-task/v1`; a single local BXP Core returns `boundx-result/v1`. BXP-EXTRACT is reserved.

| 能力 / Capability | 当前行为 / Current behavior |
|---|---|
| Schema | 精确版本、严格对象边界，不强转或补齐 / Exact-version validation without coercion |
| 证据 / Evidence | 来源 ID、码点引文、UTF-8 摘要核对 / Source IDs, code-point spans and digests |
| 三态 / States | I/O/A/P/R/V/C 与独立 B；resolved、unresolved、absent |
| 完整性 / Completeness | 应用 Profile、resolved elements、deficit |
| 区间 / Intervals | 同作用域与量纲的精确十进制，整数／实数域 |
| 类型集合 / Target sets | 请求与禁止目标交集 / Requested/forbidden overlap |
| 交接 / Handoffs | 输入供给缺项 / Missing supplied inputs |
| 前置图 / Dependencies | 追踪节点和边 ID 的环 / Cycles with node/edge provenance |
| 布尔逻辑 / Logic | 同作用域合取与反例 / Within-scope conjunction and witnesses |

三个结果轴分别为 validation、completeness、consistency；两项授权字段始终 null。结果不是业务裁决，不保证抽取正确或任务可执行。

## API

[唯一入口](../src/bxp/index.mjs)：
- `evaluateBxpTask(object)`：返回完整结果。
- `parseAndEvaluateBxpTask(raw)`：接收 UTF-8 字节或字符串，严格 JSON 后返回完整结果。
- `validateBxpTask(object)`：内部评价后返回 valid/findings；不是另一套验证器。
- `validateBxpResult(object)`：结构与状态合同验证，不独立证明数学真值。
- `protocolInfo()`：机器可读的产品／协议／Schema／套件版本。

CLI、MCP、本机 UI 共用这些能力，见 [快速开始](../QUICKSTART.md)。对象 API 无法恢复上游已经丢失的精度或重复键，严格传输请用 raw API。

Legacy comparison, decomposition, Python/Lark and model-assisted research remain explicitly deprecated. They do not produce certified BXP IR and are not the product's main result. No general Python SDK, multi-tenant server or automatic pack activation is delivered.

[生产者指南](AGENT-BXP-PRODUCER.md) · [产品手册](BOUNDX-PRODUCT-MANUAL.md) · [验证](VALIDATION.md)
