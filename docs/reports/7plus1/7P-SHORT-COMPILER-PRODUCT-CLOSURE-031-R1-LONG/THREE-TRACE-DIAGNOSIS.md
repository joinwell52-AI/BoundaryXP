# 三份原Trace：修前来源核对

Q04原文：请PM检查tool-list.json中的MCP工具清单，并生成mcp-check.md；QA负责复核mcp-check.md。

- 已表达：e_generate/c_generate_result与e_review/c_review_object共享n_report；PM生成、QA复核、输入与范围均有来源支持。没有明确“全部生成完成后”的词语。
- 有限派生：RESULT与OBJECT可构造带原主张ID的同身份用途关联索引；不能仅据共享ID确定使用的是当前版本，不能从索引制造强时序。
- 真正缺口：当前图没有可机器消费的“复核针对本次生成结果”的用途/版本绑定。031以缺TEMPORAL计FAIL的口径过强；本轮单列评测澄清，但缺口仍需表达、校验与消费，不能只改分。

S00原文：请PM依据SPEC-42读取routes.csv并生成report.md，QA必须复核该报告。仅在本次QA复核通过后，允许PM向ADMIN提交该报告。该读取操作最多重试3次；提交成功即任务完成；不得修改routes.csv。

- 已表达：同一ent_report的RESULT、OBJECT与DELIVERABLE；必要提交前提明确引用ev_review与该报告；LTE3读取重试、充分完成与禁止完整。没有生产整体完成→复核强顺序。
- 真正缺口：结果实例与复核/提交用途关联未显式表达；必要条件及其AFTER不得改为充分触发或已通过。

T03原文：PM必须生成summary.md，QA复核该文件，随后PM把同一文件交给ADMIN；summary.md被ADMIN接收即任务完成。

- 已表达：同一n_file；交付已有ORDER/AFTER AND(x_generated,x_reviewed)，不是没有时序；根接收完成保留ADMIN。组内没有明示生成整项完成→复核的时序。
- 真正缺口：复核/交付究竟使用本次哪项结果需显式用途绑定。已有整组→交付顺序必须保留，不另造组内强顺序。

源码：contracts/schema.mjs没有产物用途引用字段；validate.mjs不检查结果实例—消费用途绑定；compile.mjs只保留各ROLE并未构造关联索引/可用性依赖。新增最小ARTIFACT_USE候选关系由LLM表达；程序只按声明的生产RESULT和消费ROLE派生，不自行理解原文。因此须进入路径B真实重验。旧031报告与三个原输出不修改；无模型适配测试明确不计新模型成绩。
