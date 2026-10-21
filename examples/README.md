# BoundaryXP 示例 / Examples

当前标准输入位于 [bxp/](bxp/)，均为固定协议的 boundx-task/v1。Current canonical inputs are evidence-linked producer examples, not extraction benchmarks.

| 情况 / Case | 中文 | English |
|---|---|---|
| 完整一致 / Complete | [JSON](bxp/zh-CN-complete.json) | [JSON](bxp/en-complete.json) |
| B 缺失 / B absent | [JSON](bxp/zh-CN-b-absent.json) | [JSON](bxp/en-b-absent.json) |
| 未明确 / Unresolved | [JSON](bxp/zh-CN-unresolved.json) | [JSON](bxp/en-unresolved.json) |
| 多来源 / Multi-source | [JSON](bxp/zh-CN-multi-source.json) | [JSON](bxp/en-multi-source.json) |
| 作用域未知 / Scope unresolved | [JSON](bxp/zh-CN-unresolved-scope.json) | [JSON](bxp/en-unresolved-scope.json) |
| 冲突 / Conflict | [JSON](bxp/zh-CN-conflict.json) | [JSON](bxp/en-conflict.json) |

运行 `node cli.mjs evaluate examples/bxp/zh-CN-complete.json`，或在主 UI 导入同一文件。MCP 的 bx_evaluate_task 直接接收整个对象。

其余示例均为 legacy／历史研究输入（非规范），不能直接交给 BXP 主入口；旧结构对象只通过显式 legacy 命名空间使用，不静默升级。

[生产者指南](../docs/AGENT-BXP-PRODUCER.md) · [快速开始](../QUICKSTART.md)
