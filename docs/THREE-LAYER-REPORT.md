# 三层结果报告 / Three-layer result report

CLI、MCP及模型页面的产品结果继续使用`src/product/assembler.mjs`中的唯一报告函数。三层顺序保持原文证据、标准7+1映射、计算结果与建议，不把模型文字当作计算结论。

The CLI, MCP and model page share one product report function: source evidence, the eight explicit buckets, then local calculations and advice. Model prose is not a calculation result.

## 缺项故障修复 / Deficit rendering fix

Core的`deficit`是`{element,status}`对象数组，不是字段名字符串数组。旧报告将整个对象用于`task.elements[...]`，导致缺项或歧义结果抛出TypeError，并被模型入口误归为生产者失败。现在按对象中的字段与状态显示`Diff [-P]`、`Diff [-B]`等，不吞掉已经生成的合法计算结果。

Core deficits contain element/status objects. The previous report used each object as a bucket key and threw for incomplete or unresolved results. Rendering now reads the actual element and status, preserving the valid Core result instead of converting it into a producer error.

## 当前展示 / Presentation

模型页面按模型设置、任务原文、语义上下文、独立开始分析按钮、结果区排列。浏览器将同一报告投影为三层区块，证据与解释可展开，不直接显示Markdown格式标记；下载的Markdown保持原始报告内容。展示只用文本DOM节点，不执行原文中的HTML。

The model page orders configuration, source, semantic context, a separate analysis action and results. Its view renders the same report as three sections with expandable evidence, without exposing Markdown formatting markers or executing source HTML. Markdown downloads remain unchanged.

- 八桶显示中英文名称及明确三态；原文未提供与尚未明确分开，不自动补齐。
- 条目展示来源ID、Unicode码点区间`[start,end)`及精确引文。
- A标题使用“任务动作”，不把所有被提及的动作统称为“允许动作”；条目类型、生产者解释及备选解释一并展示。生产者解释明确标注“非原文”，不会伪装成证据，也不改变Core结果。
- 展示应用要求与已明确项的差集；不根据自然语言自行生成无限集合或未注册数学关系。
- 保留Core三条独立结果轴及计算，不用单一PASS代替它们。
- 历史快照回放明确标注；计算前提和待澄清建议单列。
- 两个授权字段继续由Core保持null，报告不提供业务裁决或执行权。

Reports distinguish absent from unresolved, expose exact code-point evidence and the required/resolved deficit, retain independent Core axes, and label historical replays, assumptions and clarification proposals. They do not invent mathematical relations or execution authority.

Action headings do not imply permission. Entry kinds, producer interpretations and alternative IDs remain visible; interpretations are explicitly distinguished from source evidence. This also preserves prohibition metadata in older candidates whose action text alone omitted the negative modality. Rendering never rewrites the underlying task or result.

## 回归 / Regression

模型页面的标准BXP面板可分别下载三层Markdown报告、Core输入任务JSON与Core结果JSON；不使用旧研究记录格式，也不附模型连接配置或密钥。未计算时仅允许导出诊断报告。编辑原文、切换选包、刷新包或开始新请求会清除可导出结果，过期请求不得恢复旧结果。

The standard model panel exports the three-layer Markdown report, Core task JSON and Core result JSON separately, without connection configuration or credentials. Uncomputed responses only export the diagnostic report. Source/package changes, package reloads and new requests invalidate exports; late responses cannot restore stale results.

新增14项定向测试：12个中英文模型候选到Core及报告场景，覆盖完整、B未提供、冲突、多来源、作用域未明确、主体未明确；另测历史/建议及未计算状态。模型传输使用模拟返回，不计入真实模型运行或金标准确率。

Fourteen focused tests cover bilingual complete, absent-B, conflicting, multi-source, unresolved-scope and unresolved-participant candidates, plus history/clarification and uncomputed reports. Mock model responses are not live acceptance evidence.
