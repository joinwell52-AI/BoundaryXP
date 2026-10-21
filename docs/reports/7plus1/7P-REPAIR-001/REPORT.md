# 7P-REPAIR-001：第一层通用语义机制修复

TASK=7P-REPAIR-001
BASE=2bab790eb39ddfd4cfe198abbbd57642be1809b7
BRANCH=review/7plus1-parser
REF001=PASS
STANDARD_PARSED_BEFORE=0/9
STANDARD_PARSED_AFTER=0/9
P_FALSE_DEFINED=22 -> 0
P_WRONG_BINDING=8 -> 0
R_FALSE_DEFINED=8 -> 0
R_MISSING=1 -> 0
A_FALSE_DEFINED=3 -> 2
A_WRONG_BINDING=9 -> 2
B_FALSE_DEFINED=1 -> 0
B_WRONG_BINDING=10 -> 6
OUTPUT_CONTENT_MATCH=0 -> 0
PARSER_MODIFIED=true
GOLD_MODIFIED=false
SOURCE_MODIFIED=false
BXP_PROTOCOL_MODIFIED=false
PRODUCTION_READY=false
STATUS=WAITING_ADMIN_REVIEW

最终提交 SHA 见本地 PUSH-RECEIPT.json 与 Git commit；提交不能在自身内容中包含自身 SHA。

## 结论与限制

P/R 误报显著下降，当前写作任务与未来输出内容有独立作用域；REF-001 完整语义断言通过，“上述材料”的真实歧义保留。九个正式样本仍为 0/9。合同通过、模型调用成功、单项边界正确，都不表示整份任务语义通过。没有更改人工标准来制造通过。

必须同时披露：V MATCH 从 1 降为 0。SWAI-003 表格中的“符合 ADR-0003”被保存在 TABLE 的行列/表头证据中，但当前没有安全的整行语义消费者，因此不再把孤立单元格升格为当前 V；这是明确的 V 覆盖损失，不算改善。下一阶段应通过结构化表格消费恢复，不能靠取消作用域门兜回。

20 项人工 OUTPUT_CONTENT_REQUIREMENTS 仍 MATCH=0 / MISSING=20。009/010 的未来指令已从当前 A/P/B 隔离并保留在 Trace，但输出归属、条件、角色与完整组合语义尚未全部证明。不得把片段收录数量当作完成了这些人工条目。

## ROOT_CAUSE 与 MECHANISM_CHANGE

旧 eligibility.mjs:6 的 propose 没有文档话语域资格门；:18–19 将 AGENT/角色元数据直接提升为 P；:20 将 LIMIT 直接提升 RESOURCE。旧 frontend/semantic-decoder 的 PERSON/角色元数据还能由 NR/PROPN/SRL 路径产生；Markdown、技术名词和未解析指代随之污染 P。旧 quantity 单位处理不含天，且未区分验收计数与真实资源。模态词子串匹配还会把“不应该”的正向子串用作 REQUIRED。

新实现位于 research/7plus1-parser/v0.3-7p-repair-001/，没有覆盖旧 revision：

- discourse.mjs：从 Markdown heading/list 缩进、fence、quote、YAML、表格结构及文档体裁产生话语 annotation。记录 exact source span、结构路径、表格 row/column/header/cell。背景/代码/表格/输出内容候选保留为来源证据，资格门阻止无作用域升格。输出内容保留局部 typed nodes/relations 和 owning output candidates；无法唯一绑定时明确未决。
- semantic-eligibility.mjs：Participant Eligibility 要求角色/姓名/明确责任或收件/来源可追溯别名；SRL 和普通专名词性不足以直接成为 P。拒绝命令、API/类/枚举、标记、未决代词；frontmatter recipient 是任务分派，不从 sender 推批准权。数量按用途分类，保留 target/unit/bounds/inclusive；次数上限与验收条数分开，时间状态阈值有独立 typed target。
- document-constructions.mjs：通用写作文档构式产生当前编写动作和交付，列表文件通过明确父头路径连接；当前 Out-of-scope 保留完整补语。否定操作符单独存 span，谓词不重复包含否定。
- eligibility.mjs、grammar.mjs、expressions.mjs、coreference.mjs：在现有管线接入资格与作用域约束，补天/日单位、完整否定模态与有界候选域。argument-completeness.mjs 拦住仅功能词构成的假对象。

没有修改确定性 projection.mjs、Schema、BXP/7+1、模型、阈值或 Pack。没有训练，没有读取外部 ADR/TASK 来推权限，没有加入 SWAI/REAL-GOLD ID 或文件名特判。评审映射只存在 report/compare.mjs，生产运行没有导入它。

## FIRST_DIVERGENCE / KNOWN_REMAINING_FAILURES

FIRST-DIVERGENCE.json 保存每次真实运行返回的第一条未决及精确来源子句，不重写原返回值。剩余缺口仍在自然语言关系/论元/模态与文档内容组合：I 路径与输入/待生成对象混淆、O 交付限定与表格字段、V 引用/版本范围、C 条件合取、A/B 主体/对象/条件的完整绑定均未闭环。源码中已不可靠的“后剩”动作、“调查是否必须跑命令”被升级为执行要求等仍存在；本轮没有跨范围逐句补丁。

COMPARISON.json 逐项包含事实、节点、关系、scope/condition/quantity 与原文 spans。旧错误项目被排除或降为未决，不等于原标准已匹配；MISSING 独立计算。A/B 仍有错误 RESOLVED（见 FAILURES.json）。

## 当前对照

|槽位|MATCH 前→后|MISSING 前→后|FALSE_DEFINED 前→后|WRONG_BINDING 前→后|
|---|---:|---:|---:|---:|
|I|0 → 0|49 → 49|3 → 3|3 → 2|
|O|0 → 4|49 → 45|1 → 1|2 → 2|
|A|1 → 5|55 → 51|3 → 2|9 → 2|
|P|0 → 9|12 → 3|22 → 0|8 → 0|
|R|0 → 1|1 → 0|8 → 0|0 → 0|
|V|1 → 0|30 → 31|0 → 0|0 → 0|
|C|0 → 0|23 → 23|0 → 0|0 → 0|
|B|0 → 11|42 → 31|1 → 0|10 → 6|

评价分母固定九例；SWAI-005 源冲突排除。REF-001 不并入九例。槽位状态仍有覆盖未决，详见 SLOT-SUMMARY.json，不以空列表证明 ABSENT。

## GENERALIZATION_EVIDENCE 与测试

- mechanism-final：PASS，exit=0，{"tests":71,"pass":71,"fail":0,"cancelled":0,"skipped":0}；日志 docs/reports/7plus1/7P-REPAIR-001/mechanism-delivery-final.log。
- original-parser-regression：PASS，exit=0，{"tests":739,"pass":739,"fail":0,"cancelled":0,"skipped":0}；日志 docs/reports/7plus1/7P-REPAIR-001/original-parser-regression.log。
- gold-data-validation：PASS，exit=0，{}；日志 docs/reports/7plus1/7P-REPAIR-001/gold-data-validation.log。
- full-regression-final：PASS，exit=0，{"tests":2730,"pass":2713,"fail":0,"cancelled":0,"skipped":17}；日志 docs/reports/7plus1/7P-REPAIR-001/full-regression-final.log。
- portable-regression.log：71 pass / 0 fail；`node --test src/__tests__/7plus1/regression/repair-001.test.mjs` 使用已提交的 P22-SAVED-SIGNALS 与新 non-Gold 原始 NLP 信号，可独立验证本轮机制。旧断言按原字节复制到 test-support，不改验收标准。
- 新机制及 mutation：标题/代码/技术类型/未决代词、frontmatter 分派、版本/清单/验收计数、5/11/23 天阈值、40 分钟上限、不同文档体裁的未来动作/禁止与当前排除、表格行列和完整否定；另重放原 10 条固定文本 + 30 条变体及 REF-001。各测试组有重叠，不相加当独立语义样本。

真实 parse7Plus1 重放使用 HanLP/spaCy、BGE-M3、E5、NLI，所有十次的模型实际加载/调用和摘要保存在 RUN.json / PERFORMANCE.json。输入只有 source.md 的原始字节，Gold 不进入 Parser。9+1 全部完成、合同 Gate PASS；这不等于九例语义通过。

|样本|实际 run id|耗时 ms|完整 Trace|
|---|---|---:|---|
|REF-001|f9db4afe-bcf7-4376-981b-6f69779e5a6d|67964|docs/reports/7plus1/7P-REPAIR-001/replay/REF-001/trace.json|
|SWAI-001|b077cd77-283b-486d-bce1-3eda8220a3b0|27701|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-001/trace.json|
|SWAI-002|2a23e612-af6c-4360-a1cf-cb69006a3e60|73979|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-002/trace.json|
|SWAI-003|9d9a75d5-9073-4f45-9c00-42eda428d8b3|54802|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-003/trace.json|
|SWAI-004|e54b9ddc-791e-4116-9b5a-fa0492b81e01|26503|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-004/trace.json|
|SWAI-006|fa924df4-4f9b-45f2-89ef-2db0cb140d48|15938|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-006/trace.json|
|SWAI-007|65064243-ac37-4585-a699-c5b23cdcc72e|28504|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-007/trace.json|
|SWAI-008|eb7efcc8-d096-4718-a868-7d1012832f08|19305|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-008/trace.json|
|SWAI-009|7965ca33-65a9-444c-a10a-5d1e06c8fe88|41273|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-009/trace.json|
|SWAI-010|02fa953e-7326-4d4e-97c5-ab234231f52f|54578|docs/reports/7plus1/7P-REPAIR-001/replay/SWAI-010/trace.json|

耗时包含真实模型调用和同时回归负载，不作为独占机器性能基准。

## 失败记录、冻结与入口

第一候选的导出/历史版本派发没有接受新 revision，首轮重放出现真实导出异常；candidate-r01/、IMPLEMENTATION-FROZEN-r01.json、replay-r01/ 保留当时源码、Trace 和错误，不覆盖成成功。后续修正了 exporter/history 接线和负向谓词操作符分层后，重新执行全部 9+1，见 replay/ 与 IMPLEMENTATION-FROZEN-r02.json。

重放之后仅补 UI 的新 revision 识别，并恢复全局 package.json 的旧脚本以维持旧封存依赖摘要；语义 Parser 与模型调用源码未变。ENTRY-COMPATIBILITY.json 列明这些差异，最终 IMPLEMENTATION-FROZEN.json 覆盖交付源码；最终全量回归针对这份交付版本重跑。

当前新版本真实入口：

```text
node research/7plus1-parser/v0.3-7p-repair-001/cli.mjs --input task.md
node research/7plus1-parser/v0.3-7p-repair-001/server.mjs
```

CLI/UI 共享同一个 engine.mjs 的 parse7Plus1。未扩 UI 业务功能，未重启现有 58618/P3 进程；全局 npm 入口仍指旧 P2，不宣称当前浏览器进程已切到新实现。旧历史快照继续按旧格式读取。

VERIFY.json 核验 2825 个旧冻结文件、1841 个历史 Real Gold 文件和385项受保护文件；旧 source、Gold、协议、Pack 均保持字节。新 Manifest/SEAL 封存本轮交付，Git 只提交白名单新增文件，工作区其他既有修改不带入。只推 review/7plus1-parser；不合并、不发版、不打 tag，完成后停止等待 ADMIN Review。
