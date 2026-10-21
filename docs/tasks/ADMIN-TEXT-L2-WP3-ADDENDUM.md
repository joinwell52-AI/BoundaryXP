# v2 WP3：软件/AI词帧增补

本增补来自ADMIN在当前对话的追加授权，与[v2任务书](BoundaryXP-ADMIN-task-text-semantic-packs-taskbook-v2.md)共同执行；不恢复v1的.bxpack、岗位推定或L3政策功能。

## 实施范围 / Scope

- code.autofix、code.transpile、dependency.audit。
- database.migrate_schema、database.rollback_migration。
- agent.invoke_tool、ops.exec_shell、agent.retrieve_context、agent.interrupt、agent.resume。
- model.align、model.rlhf、prompt.optimize、vector_index.search、data.chunk。

新增词帧必须复用现有L1 operation/角色合同；若与既有Frame同义，用别名或明确多候选并记录理由，不复制同义Frame凑数。DPO不当作RLHF同义词。中断/恢复、命令调用只描述任务，BoundaryXP不执行这些动作。

配套实体包括tool、session、context、document、lora-adapter、tokenizer、guardrail、ast、sbom。依赖文件区分锁文件、校验记录、依赖声明，不能无条件把Cargo.lock、go.sum、requirements.txt归为同一类。

资源区分GPU卡数/节点数、输入/输出Token预算；完成词汇区分lint通过、评测达标、安全扫描通过、无高危、零漏洞，保留明确阈值与作用域，不从产物生成推断任务完成。

风险候选扩展arbitrary-code-execution、model-data-poisoning、cross-tenant-leakage、unbounded-network-access。命中风险不自动生成B；需原文明确禁止或已核实且带证据的有效制度绑定。本期L3不实现制度绑定。无依据的业务裁决和执行授权始终不产生。

## 必测门禁 / Test gates

每个新增或语义变更Frame，至少中文、英文各四类，共8条独立fixture：

| 类别 | 断言 |
|---|---|
| 正例 / positive | Frame、operation、必需角色及精确码点证据，不推断O/C或授权 |
| 否定 / negation | 禁止与肯定动作分离，NOT_REQUIRED不等于FORBID |
| 歧义 / ambiguity | 全部合法候选可见，未知不按顺序偷选；不为测试污染生产词表 |
| 缺证据 / missing evidence | 缺论元、伪造quote或无quote诊断，不伪造合法resolved条目 |

另验计数、全部引用、Frame/fixture ID唯一性、精确版本和摘要、与原107个Frame的碰撞、非BMP/重复引文；资源单位和完成断言不得误合并。选择工具调用、数据库迁移、检索的双语样例贯通候选→Assembler→唯一Core→适用CLI/MCP/UI入口。

迁移目标software-ai@0.2.0，精确依赖core-ontology@1.1.0及其实际摘要；如身份已占用按v2改用未用版本。最终计数按实际数据统计，不写“约53个”。这批fixture与120自然语言种子、64契约组、208冻结向量分别报告，不混称抽取准确率。

No BXP protocol/schema/frozen-vector changes. These are WP3 requirements, not delivered capabilities or evidence of EXTRACT conformance.
