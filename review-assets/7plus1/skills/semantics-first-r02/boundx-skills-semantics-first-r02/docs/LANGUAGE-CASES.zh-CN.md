# 中英文与混合输入公开开发对照

本组为作者设计的语义对照，不是新的Gold冻结，也不是模型实测成绩。24组中文/英文预期对应段落，共48份原文，另有6份混合原文；共54份文本。
每次只发送一份TXT或选中的text。pairs.json和expected.json仅供评测端使用。不得把配对译文当成额外模型上下文。
旧r01的20份公开开发样例保留在evaluation/legacy-r01，原始字节不变，不与本组计数混算。

| 对照ID | 主题 | 预期所在文件 |
|---|---|---|
| BI01 | 明确祈使义务 | `evaluation/language/expected.json` |
| BI02 | 许可不是义务 | `evaluation/language/expected.json` |
| BI03 | 无需不是禁止 | `evaluation/language/expected.json` |
| BI04 | 明确禁止 | `evaluation/language/expected.json` |
| BI05 | 两个动作各有必要前提 | `evaluation/language/expected.json` |
| BI06 | 条件义务不是反向禁令 | `evaluation/language/expected.json` |
| BI07 | 完成充要与独立时间限制 | `evaluation/language/expected.json` |
| BI08 | unless并不自动授予许可 | `evaluation/language/expected.json` |
| BI09 | 类别全称和例外 | `evaluation/language/expected.json` |
| BI10 | 恰选一个与选择自由 | `evaluation/language/expected.json` |
| BI11 | including不是穷尽清单 | `evaluation/language/expected.json` |
| BI12 | 首次与累计重试 | `evaluation/language/expected.json` |
| BI13 | 团队共享预算 | `evaluation/language/expected.json` |
| BI14 | 同名不同轮次 | `evaluation/language/expected.json` |
| BI15 | 被动语态施事和接收者 | `evaluation/language/expected.json` |
| BI16 | respectively配对 | `evaluation/language/expected.json` |
| BI17 | 不能两个都做 | `evaluation/language/expected.json` |
| BI18 | 两个都禁止 | `evaluation/language/expected.json` |
| BI19 | 开闭端点和单位 | `evaluation/language/expected.json` |
| BI20 | 开发者与产物行为分层 | `evaluation/language/expected.json` |
| BI21 | 引文中的指令不能执行 | `evaluation/language/expected.json` |
| BI22 | 触发与立即的局部范围 | `evaluation/language/expected.json` |
| BI23 | 可能性与建议不是硬义务 | `evaluation/language/expected.json` |
| BI24 | 真正的指代歧义 | `evaluation/language/expected.json` |
| MX01 | 混合条件和中文文件名 | `evaluation/language/expected.json` |
| MX02 | 混合非义务和禁止 | `evaluation/language/expected.json` |
| MX03 | Unicode身份与证据 | `evaluation/language/expected.json` |
| MX04 | 同一要求的明确双语重复 | `evaluation/language/expected.json` |
| MX05 | 冲突译文无优先级 | `evaluation/language/expected.json` |
| MX06 | 英文日期不默认地区 | `evaluation/language/expected.json` |

检查清单不是Schema输出的预制答案，也不要求模型生成相同ID、节点顺序或相同字节。规范化比较不得删除否定、条件、例外、身份或来源用途。合同未支持的语义必须显式计为表达缺口，不可当成完整成功。
