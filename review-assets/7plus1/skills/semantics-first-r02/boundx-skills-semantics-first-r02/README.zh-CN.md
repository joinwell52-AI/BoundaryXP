# BoundaryXP语义Skill：中文、英文与混合任务适用版

规程修订：`semantics-first-r02`；继承`semantics-first-r01`；接口：`candidate-ir/1.2`。

本包在原六步解析和双向审阅方法上补齐中文、英文和混合输入规范，并提供完整独立英文版。不是新的IR、不是已通过双语准确性验收的发布版。

## 文件与使用

| 文件 | 用途 |
|---|---|
| `skills/boundx-semantic-parse/SKILL.md` | 默认中文规程，直接处理中文/英文/混合原文 |
| `skills/boundx-semantic-audit/SKILL.md` | 默认中文独立审阅规程，直接审阅上述语言 |
| `translations/en/boundx-semantic-parse/SKILL.en.md` | 完整英文解析规程，作为可选择的另一指令语言版 |
| `translations/en/boundx-semantic-audit/SKILL.en.md` | 完整英文审阅规程，不与中文重复加载 |
| `docs/CODEX-INTEGRATION.zh-CN.md` / `.en.md` | 实际文件采用方式、已知程序责任及验收顺序 |
| `docs/LANGUAGE-ACCEPTANCE.zh-CN.md` / `.en.md` | 跨语言验收口径及限制 |
| `evaluation/language/` | 24组中英对应原文＋6份混合原文，预期单独保存 |
| `evaluation/legacy-r01/` | r01原20条开发样例，文件字节不变 |
| `tools/verify_package.py` | 无模型静态自检 |

**默认两份中文Skill已经适用于英文任务，不必先装英文版。** 规程的语言与输入语言是两个维度。要采用英文规程时，只选择英文解析/审阅这一套，并按接入说明复制到既有运行路径；不要把两种语言全文同时塞进模型。英文文件中的一行中文版本标记是旧装载器兼容注释，不是重复规程。

## 新增重点

原文和证据保留原语言；结构字段、枚举和算子保持同一合同。英文的must/shall/may/need not/must not、only if/if/iff/unless、全称/例外、not both/neither、被动语态、respectively、数量界限及日期歧义按具体语境处理，不当作机械词典。中英混合时继续保留跨句身份、条件、引用、重复和冲突，不按语言优先决定授权。

没有把001的文件名、见证或预期计算值写入运行Skill；评测端的原文对照和expected不能发送给被测模型。没有先翻译后替换SOURCE_DATA的步骤。

## 当前状态

- 文档与静态文件检查：见`VALIDATION.json`。
- 中文/英文/混合真实模型验证：`NOT_RUN`。
- 翻译语义等价的独立模型或人工双盲验证：未执行；英文是本次作者编写并核对的对应版。
- BoundaryXP程序集成与58618部署：未执行。
- IR Schema、消费者和求解器：本包未修改；原有表达和计算缺口继续保留。

运行`python tools/verify_package.py`只检查本包结构、摘要、配对元数据和若干参考逻辑，不调用模型、不连接业务系统，也不验证任意自然语言的正确性。没有任何静态检查结果可以换算成双语准确率。

## 版本保全

r01交付不覆盖。r02修订来源及原文件摘要见`docs/r01-provenance.json`；继承的仓库基线仅供对照，不能当作今天的实际HEAD。代码已有更新时先核对差异，不用本包回退本地修复。具体新调用、部署、merge/release/tag仍按ADMIN授权。
