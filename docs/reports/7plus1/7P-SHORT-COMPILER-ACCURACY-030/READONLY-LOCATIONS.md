# 030 只读源码核对

受测代码保持029-c4原字节。以下是定位证据，不是修复或新规则方案。行号对应受测commit `ca86e87ea5b07ca770948e5e1231ae9972542ff5`。

| 问题 | 已核实位置 | 实际机制 |
|---|---|---|
| NOT_REQUIRED中文丢执行者/对象 | `research/7plus1-parser/llm-first-028/compile.mjs:89` | 仅渲染`f.event.predicate`，没有该免除事件的roles/目标；JSON仍保留。 |
| 不同动作的完成参照中文同名 | 同文件`:64` | STATE渲染predicate/args/polarity，没用state.event_id区分复核和更新事件。 |
| 输出内容数量目标合同不符 | `research/7plus1-parser/llm-first-028/validate.mjs:63`；`compile.mjs:53` | OUTPUT_CONTENT.target_id必须关联同事件RESULT；只有count_scope指报告不足以通过。repeat-1/Q25指异常记录实体，技术拒绝而非模型审阅纠正。 |
| 同一产物身份未关联仍被接受 | `skills/boundx-semantic-parse/SKILL.md:12`；`skills/boundx-semantic-audit/SKILL.md:12` | 已要求跨用途同一实体，Q19实际候选/审阅仍把“本次报告”与check.md分别独立，程序引用合法性不能证明二者同一。 |
| 同一任务生成许可漏PM | 同parse Skill角色条款、Q15实际A2/U1及审阅 | 候选显式将生成执行者标未指定；原审阅没有纠正；不是投影后来删除PM。 |

原文、首候选、最终候选、原审阅与技术接受/拒绝状态均在CASE-RESULTS和每份原始Trace中。没有借定位阶段改源码、Skill、合同、Schema、模型或投影。
