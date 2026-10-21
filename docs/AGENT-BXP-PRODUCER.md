# Agent / Producer → BXP

Agent、规则或其他生产者负责形成候选 `boundx-task/v1`；BoundaryXP 本地验证和计算，宿主负责澄清、审批及执行。本指南是产品方法说明，不是新增协议。BXP-EXTRACT 仍为 RESERVED，候选不等于事实，Schema 通过不证明抽取准确率。

Agents, rules or other producers construct candidate IR. BoundaryXP validates and calculates locally; the host owns clarification, approval and execution. This guide does not certify extraction or introduce another protocol.

## 机器合同 / Machine Contract

- [Task Schema](../protocol/schemas/boundx-task-v1.schema.json)
- [Result Schema](../protocol/schemas/boundx-result-v1.schema.json)
- [中文规范](../protocol/BXP-0001.zh-CN.md) / [English specification](../protocol/BXP-0001.md)
- [唯一生产 API](../src/bxp/index.mjs)：`protocolInfo()` 返回产品版本、协议版本、Schema ID、套件版本和符合性范围，直接从包及注册表读取。

从项目根目录获取版本信息：

```text
node --input-type=module -e "import {protocolInfo} from './src/bxp/index.mjs'; console.log(JSON.stringify(protocolInfo()))"
```

## 构造步骤 / Construction

1. 保留 source.text 原文，不裁剪、翻译、归一化或转换换行。 / Preserve exact source text.
2. 按 Schema 提交八桶 I/O/A/P/R/V/C+B，每桶显式 resolved、unresolved 或 absent。无证据不得补齐；resolved/unresolved 都要非空带证据条目。 / Submit all eight explicit-state buckets; never fill unknown facts.
3. 引用必须为来源中的连续精确片段；start 含、end 不含，按 Unicode 码点计数。JavaScript 使用 Array.from(text)，Python 使用字符串索引；不要直接把 JS UTF-16 下标传给 BXP。 / Use code-point spans, not UTF-16 offsets.
4. 附加制度／澄清原文放 sources，固定版本和文本 UTF-8 SHA-256，Span 指向 source_id。来源摘要不证明可信，不自动读取 URL。 / Supply versioned secondary sources locally.
5. Profile 必填项是调用方声明；固定业务要求由宿主另行核对。分阶段条件需显式 scopes，不能静默跨作用域合并；身份未知用 unresolved。 / Declare profile requirements and scopes explicitly.
6. 数学内容放类型化 constraints；条目名称或 normalized 元数据不能代替约束。小数及大整数必须用十进制字符串，不使用科学计数法端点。 / Encode typed constraints; use decimal strings for fractional/large bounds.
7. B 是禁止行为边界，不能用“不得超过120秒”的资源上界代替 B。没发现 B 就保持 absent，不臆造禁止事项。 / Keep B independent from numeric R negation.
8. 提交到本地核心，读取三轴和 findings，保留 unresolved 并向用户澄清；不得把 complete/consistent 当作可以执行。 / Read all three result axes; never infer execution authority.

## 中英最小示例 / Bilingual Examples

| 情形 | 中文 | English | 预期 |
|---|---|---|---|
| 八桶完整 | [完整](../examples/bxp/zh-CN-complete.json) | [Complete](../examples/bxp/en-complete.json) | complete / consistent |
| B 缺失 | [缺失](../examples/bxp/zh-CN-b-absent.json) | [B absent](../examples/bxp/en-b-absent.json) | incomplete / consistent |
| 主体未明确 | [歧义](../examples/bxp/zh-CN-unresolved.json) | [Unresolved](../examples/bxp/en-unresolved.json) | unresolved / undetermined |
| 制度来源 | [多来源](../examples/bxp/zh-CN-multi-source.json) | [Multi-source](../examples/bxp/en-multi-source.json) | complete / consistent |
| 作用域未知 | [未知作用域](../examples/bxp/zh-CN-unresolved-scope.json) | [Unknown scope](../examples/bxp/en-unresolved-scope.json) | complete / undetermined |
| 确定冲突 | [区间冲突](../examples/bxp/zh-CN-conflict.json) | [Conflict](../examples/bxp/en-conflict.json) | complete / inconsistent |

这些是手写结构化示例，不是自然语言抽取金标，不增加 208 条冻结计算向量。当前 Python/Lark 只是有限覆盖的研究抽取器，不直接输出标准 BXP IR，不能称为标准 BXP 生产者。若未来接入，必须先显式转换为 `boundx-task/v1`、保留原文码点证据并通过本地验证；这也不提供 EXTRACT 符合性证明。

These are manually authored IR examples, not extraction gold or additional frozen CALC vectors. Current Python/Lark implementations are research extractors, not standard BXP producers. Future integration requires explicit conversion to `boundx-task/v1`, exact code-point evidence and local validation; it does not establish EXTRACT conformance.

## 本地调用 / Local Evaluation

```javascript
import { readFileSync } from 'node:fs';
import { parseAndEvaluateBxpTask } from './src/bxp/index.mjs';
const result = parseAndEvaluateBxpTask(readFileSync('examples/bxp/zh-CN-complete.json'));
console.log(JSON.stringify(result));
```

对象 API `evaluateBxpTask` 接收已经正确解码的 JSON；原始文本／字节用 `parseAndEvaluateBxpTask` 检查重复键、字节上限与数值精度。`validateBxpTask` 返回 valid/findings（含语义检查），`validateBxpResult` 检查结构和有界 JSON，不重算任意来源语义。摘要、认证和授权不可混同。
