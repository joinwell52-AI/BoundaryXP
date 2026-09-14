# ADMIN 本地检查 / Local ADMIN checks

> 历史／非规范研究或产品规划（legacy / non-normative）。本文中的旧接口、原始结果和未来能力不代表当前产品合同或本轮验证；当前入口以根 README 和产品手册为准。No BXP extraction certification or execution authority is implied.

最新增量：[组合约束、具体槽位与分层建议：原理、案例和测试](ADMIN-CALCULATION-010.md)。下述六类与 glossary 机制保留，新能力另有版本化算子和槽位模块。

ADMIN 检查不调用 AI、API、嵌入或学习模型。中文和英文是本轮支持范围；界面语言与任务原文独立，切换语言不翻译或修改证据。当前规则覆盖有限，未命中不是质量认证。

ADMIN checks use no AI, API, embeddings or learned models. This iteration covers Chinese and English. UI language does not change source evidence. No match is not a quality certificate.

## 实现 / Implementation

- `ui/admin-rules.mjs`: `1.1.1` 版本规则包，保存完整表达、定义锚点、关联字段、中英说明和建议。规则可替换，无需修改计算器。
- `ui/admin-check.mjs`: 纯函数 `checkAdminText(text, pack)`，返回规则版本、原句字符位置、候选问题和上下文检查轨迹。位置使用 JavaScript UTF-16 字符偏移，区间 `[start,end)`。
- `ui/advice.mjs`: 将候选提醒加入 ADMIN 建议与完整任务建议文本；原任务不变，新增文字需 ADMIN 确认。
- `ui/app.js`: 橙色建议卡，原句证据，折叠的技术详情。现有已知禁止事项保留原文条件，不自行判定执行违规。

The pack defines expressions, definition anchors, field mappings and bilingual advice. The pure evaluator returns exact UTF-16 source offsets, versioned checks and clarification candidates. Suggestions do not amend the original task or grant permission.

## 本轮六类检查 / Six checks

| 类型 / Kind | 原句 / Before | 明确后的示例 / Clarified example |
|---|---|---|
| 覆盖 / Coverage | 全面检查系统 | 全面检查系统，覆盖范围为订单模块和支付模块。 |
| 深度 / Depth | Perform an in-depth review. | Perform an in-depth review; verification method is static inspection. |
| 频率 / Frequency | 检查高频调用 | 检查高频调用；高频指每分钟超过100次。 |
| 时间 / Dates | Inspect recent records. | Inspect recent records; date range is June 1, 2026 to August 31, 2026. |
| 产物 / Output | 整理销售数据 | 整理销售数据；交付物为按月份汇总的CSV表。 |
| 程度 / Degree | Optimize appropriately. | Optimize appropriately; optimization scope is column widths. |

这些值是测试案例，不是工具自动生成的业务要求。实际建议使用占位符，不替 ADMIN 决定阈值、方法或产物。

These values are test fixtures, not automatically imposed requirements. Generated suggestions use placeholders.

## 计算原理与边界 / Method and limits

对规则 r 的每个原文匹配 m，查找局部上下文中的显式定义 d：

`remind(r,m) = matched(r,m) AND NOT negativeMention(m) AND NOT supportedDefinition(r,m)`

局部定义来自同一句或紧接的下一句，不跨空段落；按同类匹配项位置划分局部窗口，每个表述可以绑定其后的定义，但不能拿走下一个表述的定义。定义必须有“为／指／is／means／冒号”等关系和非空内容，包含占位符或待定内容不作为有效定义。频率与日期规则还要求定义内容有数字。附近的无关数字不产生支持。

## 显式跨段落定义 / Explicit glossary binding

```text
术语定义
G1: 覆盖范围为订单和支付模块。

按定义 G1，全面检查系统。
```

```text
Glossary
G1: coverage is orders and payments.

Perform a comprehensive review using definition G1.
```

仅识别独立行的术语定义/术语表/Glossary/Definitions标题及其后的编号冒号定义行；任务必须显式引用该编号。向前查找一个定义才可绑定；未找到、同编号重复、同一窗口引用多个编号、定义不符合目标规则时保留提醒。技术详情显示 `glossary-unique/missing/contested/inapplicable`、引用编号和原句位置。定义是待核对的数据，不是可执行指令或新增授权。

Only the explicit numbered glossary syntax above is supported. References resolve to one preceding definition, with missing or contested references retained for clarification. This is not a general glossary parser and does not infer business-object ownership.

**模型挑战测试暴露的限制：** 60条Codex/豆包合成样本中，候选版与基线的目标提醒完全相同；豆包30条全部未命中目标规则。当前变化支持受控句式，不能宣称改善广泛自然表达。详见 [中英模型挑战测试](ADMIN-MODEL-CHALLENGE-009.md)。

这是有限的句式与上下文规则，不是通用语义消歧。数字存在不能保证单位、窗口或日期完整；定义被发现也不等于内容已充分验证。未支持的前置定义、跨段落解释、同义表达可能仍被提醒；邻近定义也可能被错误关联。后续应通过实际任务评估这些误报和漏报，不能宣称算法穷尽歧义。

This is finite contextual rule evaluation, not general semantic disambiguation. Definition detection does not certify completeness or correctness. Remote definitions and unsupported paraphrases can be missed; nearby definitions can still be misattributed. No numeric ambiguity probability, population accuracy or full semantic guarantee is claimed.

七参数及禁止边界的协议不变；本轮并未完成任意自然语言到 SMT 的编译，也未增加自动授权或裁决。候选问题计数不能称为完整 Q 向量或全维度边界计算。

## 验证 / Validation

`node --test src/__tests__/*.test.ts ui/*.test.mjs`（在工具目录执行 / from tool directory）。

成对案例覆盖中英文原句与定义后文本，并检查微服务/质量/常量误报、无关数字、占位符、否定表述、中英混写、原句位置、输入不变和确定性。工程测试不能替代真实用户语料上的精确率与召回率测量。

Validation commands and scope: [Validation](VALIDATION.md).
