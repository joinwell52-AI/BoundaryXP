# 三层结果报告 / Three-layer result report

CLI、MCP及模型页面的产品结果继续使用`src/product/assembler.mjs`中的唯一报告函数。三层顺序保持原文证据、标准7+1映射、计算结果与建议，不把模型文字当作计算结论。

The CLI, MCP and model page share one product report function: source evidence, the eight explicit buckets, then local calculations and advice. Model prose is not a calculation result.

## 缺项故障修复 / Deficit rendering fix

Core的`deficit`是`{element,status}`对象数组，不是字段名字符串数组。旧报告将整个对象用于`task.elements[...]`，导致缺项或歧义结果抛出TypeError，并被模型入口误归为生产者失败。现在按对象中的字段与状态显示`Diff [-P]`、`Diff [-B]`等，不吞掉已经生成的合法计算结果。

Core deficits contain element/status objects. The previous report used each object as a bucket key and threw for incomplete or unresolved results. Rendering now reads the actual element and status, preserving the valid Core result instead of converting it into a producer error.

## 当前展示 / Presentation

- 八桶显示中英文名称及明确三态；原文未提供与尚未明确分开，不自动补齐。
- 条目展示来源ID、Unicode码点区间`[start,end)`及精确引文。
- 展示应用要求与已明确项的差集；不根据自然语言自行生成无限集合或未注册数学关系。
- 保留Core三条独立结果轴及计算，不用单一PASS代替它们。
- 历史快照回放明确标注；计算前提和待澄清建议单列。
- 两个授权字段继续由Core保持null，报告不提供业务裁决或执行权。

Reports distinguish absent from unresolved, expose exact code-point evidence and the required/resolved deficit, retain independent Core axes, and label historical replays, assumptions and clarification proposals. They do not invent mathematical relations or execution authority.

## 回归 / Regression

新增14项定向测试：12个中英文模型候选到Core及报告场景，覆盖完整、B未提供、冲突、多来源、作用域未明确、主体未明确；另测历史/建议及未计算状态。模型传输使用模拟返回，不计入真实模型运行或金标准确率。

Fourteen focused tests cover bilingual complete, absent-B, conflicting, multi-source, unresolved-scope and unresolved-participant candidates, plus history/clarification and uncomputed reports. Mock model responses are not live acceptance evidence.
