# 中英文模型挑战：哪些表达仍未覆盖？

这轮增加了显式术语表引用和局部定义归属，但**在模型生成的60条自然表达挑战中，没有观察到更新前后的提醒结果改善**。新增能力只在规定的显式格式及受控测试中得到验证，不能据此称为通用歧义检查。

## 方法

- 基线：提交 `4a6c90f9`，规则包1.0.0；初始候选规则包1.1.0，独立复核修复后1.1.1。
- Codex：独立子Agent一次生成30条合成案例，中英文各15条，没有读取实现。传输接口未独立提供具体模型版本，不推测模型名称。
- 豆包：6次独立请求，每次5条，中英文各3批，模型返回均为 `doubao-seed-2-0-pro-260215`；thinking关闭，没有自动重试。
- 每条模型案例带目标规则和模型预期标签。标签是待复核意见，不是人类真值；模型作者不同，不能用两组分数给模型排名。
- 先冻结候选计算代码，再读取模型案例运行基线/候选对照。此轮不根据盲测答案改规则。工程测试与模型挑战分开统计。

## 结果

下表中“误报/漏报”仅相对于模型标签；未命中规则的无提醒不得解释成已确认无歧义。

| 来源 | 样本 | 目标规则命中 | 相对标签误报 | 相对标签漏报 | 更新前后变化 |
|---|---:|---:|---:|---:|---|
| Codex中文 | 15 | 13 | 6 | 1 | 无 |
| Codex英文 | 15 | 8 | 4 | 4 | 无 |
| 豆包中文 | 15 | 0 | 0 | 6 | 无 |
| 豆包英文 | 15 | 0 | 0 | 6 | 无 |

所有样本均保留，没有剔除不利结果。Codex合计TP=11、FP=10、FN=5、TN=4；豆包TP=0、FP=0、FN=12、TN=18。这里TN只指“没提醒且模型说不需提醒”的数值巧合，特别是豆包整组没有目标规则匹配，不能当作正确理解的证据。

按候选模型标签计算：Codex精确率11/21、召回率11/16；豆包精确率分母为0，记null，召回率0/12。这些不是总体精度估计，不计算虚假的独立样本置信区间，也不宣称60次独立模型运行。

豆包6次均HTTP200/completed，合计5176 tokens（输入1731、输出3445），请求耗时合计79.578秒。未读取账单，金额未知；Codex用量未由接口提供，不并入豆包统计。

## 代表性缺口

1. “验证方法限定为……”不同于现有“验证方法为……”句式，即使人可以理解，规则仍可能提醒。
2. “稍微调整”没有命中“稍微修改”；“frequently called endpoints”没有命中现有高频API表达。
3. “Glossary for this task:”和行内术语表不属于当前严格格式。
4. 通用业务术语重定义，例如“客户”既指个人又指企业，不依赖六类模糊短语，当前规则没有覆盖。
5. “不要做适当优化……”的否定前缀未被完整处理，存在误报。

这些是下一轮开发用例。未来重新评估时它们属于已知开发集，需要另取未见案例，不能继续称为盲测。

## 已验证的本轮功能

75项核心/UI工程测试通过，包括中英显式编号定义、跨段落引用、缺失/竞争/类型不符定义、局部双对象分别定义、源位置和既有回归。浏览器中文唯一G1引用消除覆盖提醒，英文重复G1保留提醒，技术轨迹正确显示绑定类型。未调用模型参与ADMIN计算。

## 证据

[协议、请求、完整答卷、冻结哈希、旧版计算代码和前后结果](../../research/evidence/changes/TASK-20260911-SCOPEGAUGE-BINDING-009/runs/)。模型生成标签仍需独立人类复核；100～200条真实用户语料目标尚未完成。

## English summary

The candidate adds explicit numbered glossary references and local definition ownership. All 75 engineering tests passed, but its outputs were unchanged on 60 held-out model-authored synthetic cases. All 30 Doubao cases failed to match their target rule; absence of a warning is not evidence of understanding. Labels are provisional model opinions, not human gold. Six Doubao calls and one Codex authoring session are not 60 independent model runs. This iteration does not demonstrate improved general-language accuracy.

## 独立代码复核修复

Codex只读复核发现术语区吞掉Task行、否定引用误绑定、下一句不同规则引用干扰本句。三项已修复并由同一复核Agent复跑原例确认；初始冻结哈希与盲测结果保留，最终1.1.1复测另存。复测在已见样本上进行，不称为第二轮盲测；目标提醒结果仍未改善。界面新增未命中六类规则的明确提示。
