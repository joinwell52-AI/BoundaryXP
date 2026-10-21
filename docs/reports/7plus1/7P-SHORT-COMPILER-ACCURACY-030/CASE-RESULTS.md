# 030 逐案来源审阅

评审者：执行Codex；不是ADMIN Gold或模型自审评分。CHECKS与语义结论分开。最终JSON与包含中文的最终交付单列。

| Run | Runtime | First candidate | Final candidate | Canonical JSON | Delivered | Revision | Calls |
|---|---|---|---|---|---|---|---|
| first/Q01 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q02 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q03 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q04 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q05 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q06 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q07 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q08 | RUN_SUCCEEDED | PASS | PASS | PASS | FAIL | 0 | 2 |
| first/Q09 | RUN_SUCCEEDED | PASS | PASS | PASS | FAIL | 0 | 2 |
| first/Q10 | RUN_SUCCEEDED | PASS | PASS | PASS | FAIL | 0 | 2 |
| first/Q11 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q12 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q13 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q14 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q15 | RUN_SUCCEEDED | FAIL | FAIL | FAIL | FAIL | 0 | 2 |
| first/Q16 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q17 | RUN_SUCCEEDED | PASS | PASS | PASS | FAIL | 0 | 2 |
| first/Q18 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q19 | RUN_SUCCEEDED | FAIL | FAIL | FAIL | FAIL | 0 | 2 |
| first/Q20 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q21 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q22 | RUN_SUCCEEDED | PASS | PASS | REVIEW_REQUIRED | REVIEW_REQUIRED | 0 | 2 |
| first/Q23 | RUN_SUCCEEDED | FAIL | PASS | REVIEW_REQUIRED | REVIEW_REQUIRED | 1 | 4 |
| first/Q24 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q25 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q26 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q27 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q28 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q29 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| first/Q30 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-1/Q07 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-1/Q20 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-1/Q25 | RUN_SUCCEEDED | FAIL | FAIL | FAIL | FAIL | 0 | 2 |
| repeat-1/Q29 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-1/Q30 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-2/Q07 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-2/Q20 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-2/Q25 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-2/Q29 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |
| repeat-2/Q30 | RUN_SUCCEEDED | PASS | PASS | PASS | PASS | 0 | 2 |

## first/Q01

请PM统计audit.log中的错误总数，并生成count.md；不得清空audit.log。

首候选与最终候选相同。身份类型的不确定没有污染职责；中文保留统计对象、报告和禁止。

原始完整证据：[Trace](runs/first/Q01/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q01-F01 | PM / 统计 / audit.log中的错误总数 / REQUIRED | SUPPORTED: evt_stat: 统计 REQUIRED; cl_stat_performer: ROLE PERFORMER=ent_pm @evt_stat; cl_stat_input: ROLE INPUT_OBJECT=ent_log @evt_stat; cl_stat_result: ROLE RESULT=ent_total @evt_stat | SUPPORTED: evt_stat: 统计 REQUIRED; cl_stat_performer: ROLE PERFORMER=ent_pm @evt_stat; cl_stat_input: ROLE INPUT_OBJECT=ent_log @evt_stat; cl_stat_result: ROLE RESULT=ent_total @evt_stat | SUPPORTED: I/bf:c338feec373066acfb2e, O/bf:268beae120cd725fa36d, A/bf:9a59811f00d75e0914c7, P/bf:d636880a3ba60f9d808a | evt_stat, cl_stat_performer, cl_stat_input, cl_stat_result：PM统计该日志错误总数；结果值仍未知。 |
| Q01-F02 | PM / 生成 / count.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_count @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_count @evt_generate | SUPPORTED: O/bf:e0b14b497ea9c20917d3, A/bf:7daef2ad9b422146231a, P/bf:4106630b7e5b402b11d4 | evt_generate, cl_generate_performer, cl_generate_result：PM生成count.md，共享明确命令主体。 |
| Q01-F03 | audit.log及其中错误统计范围 | SUPPORTED: cl_stat_input: ROLE INPUT_OBJECT=ent_log @evt_stat; cl_stat_result: ROLE RESULT=ent_total @evt_stat | SUPPORTED: cl_stat_input: ROLE INPUT_OBJECT=ent_log @evt_stat; cl_stat_result: ROLE RESULT=ent_total @evt_stat | SUPPORTED: I/bf:c338feec373066acfb2e, O/bf:268beae120cd725fa36d, A/bf:9a59811f00d75e0914c7 | cl_stat_input, cl_stat_result：I为audit.log，错误统计对象在统计RESULT与note保留。 |
| Q01-F04 | count.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_count @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_count @evt_generate | SUPPORTED: O/bf:e0b14b497ea9c20917d3, A/bf:7daef2ad9b422146231a | cl_generate_result：count.md在O且REQUIRED。 |
| Q01-F05 | 禁止清空audit.log | SUPPORTED: evt_clear: 清空 FORBIDDEN; cl_clear_object: ROLE OBJECT=ent_log @evt_clear | SUPPORTED: evt_clear: 清空 FORBIDDEN; cl_clear_object: ROLE OBJECT=ent_log @evt_clear | SUPPORTED: B/bf:94ef459a095ecfeafaa7 | evt_clear, cl_clear_object：禁止清空同一日志，未变读取禁止。 |
| Q01-F06 | 未知错误总数，不编造观测值或执行完成 | SUPPORTED: evt_stat: 统计 REQUIRED; evt_generate: 生成 REQUIRED; evt_clear: 清空 FORBIDDEN | SUPPORTED: evt_stat: 统计 REQUIRED; evt_generate: 生成 REQUIRED; evt_clear: 清空 FORBIDDEN | SUPPORTED: I/bf:c338feec373066acfb2e, O/bf:268beae120cd725fa36d, O/bf:e0b14b497ea9c20917d3, A/bf:9a59811f00d75e0914c7, A/bf:7daef2ad9b422146231a, P/bf:d636880a3ba60f9d808a, P/bf:4106630b7e5b402b11d4, B/bf:94ef459a095ecfeafaa7 | evt_stat, evt_generate, evt_clear：未增加观测数值或已完成事实；R/V/C空有原文依据。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q02

请PM核对accounts.csv的字段名，生成fields.md。只检查字段名，不得读取记录内容。

首候选与最终候选相同；JSON和中文都保留SCOPE及局部禁止。

原始完整证据：[Trace](runs/first/Q02/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q02-F01 | PM / 核对 / accounts.csv的字段名 / REQUIRED | SUPPORTED: evt_check: 核对字段名 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_object: ROLE OBJECT=ent_fields @evt_check | SUPPORTED: evt_check: 核对字段名 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_object: ROLE OBJECT=ent_fields @evt_check | SUPPORTED: I/bf:3d1938b8f6d313bbd603, I/bf:3f9a26b9a02b519db8ad, A/bf:e84ae9d3b9cdae908410, P/bf:8e4a36af55e5624b1934 | evt_check, cl_check_performer, cl_check_object：PM核对accounts.csv字段名，而非记录内容。 |
| Q02-F02 | PM / 生成 / fields.md / REQUIRED | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_output @evt_generate | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_output @evt_generate | SUPPORTED: O/bf:55422dbbba4b9e0a2560, A/bf:d42f710eaec743ea5dc2, P/bf:474ae7a7c4012315007b | evt_generate, cl_generate_performer, cl_generate_result：PM生成fields.md。 |
| Q02-F03 | 只检查字段名；可用文件身份+局部范围表达 | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_accounts @evt_check; cl_check_scope: SCOPE @evt_check; expr_fields: ITEM | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_accounts @evt_check; cl_check_scope: SCOPE @evt_check; expr_fields: ITEM | SUPPORTED: I/bf:3d1938b8f6d313bbd603, I/bf:3f9a26b9a02b519db8ad, A/bf:e84ae9d3b9cdae908410 | cl_check_input, cl_check_scope, expr_fields：I文件身份与仅字段名局部ITEM范围并存。 |
| Q02-F04 | fields.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_output @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_output @evt_generate | SUPPORTED: O/bf:55422dbbba4b9e0a2560, A/bf:d42f710eaec743ea5dc2 | cl_generate_result：fields.md REQUIRED O。 |
| Q02-F05 | 禁止读取记录内容；不是禁止文件全部用途 | SUPPORTED: evt_read: 读取记录内容 FORBIDDEN; cl_read_object: ROLE OBJECT=ent_records @evt_read | SUPPORTED: evt_read: 读取记录内容 FORBIDDEN; cl_read_object: ROLE OBJECT=ent_records @evt_read | SUPPORTED: B/bf:fa2f1ce4c3fa00f49f29 | evt_read, cl_read_object：FORBIDDEN读取accounts.csv记录内容；未禁止文件所有用途。 |
| Q02-F06 | 不增加核对记录内容或独立只检查义务 | SUPPORTED: evt_check: 核对字段名 REQUIRED; evt_generate: 生成文件 REQUIRED; evt_read: 读取记录内容 FORBIDDEN | SUPPORTED: evt_check: 核对字段名 REQUIRED; evt_generate: 生成文件 REQUIRED; evt_read: 读取记录内容 FORBIDDEN | SUPPORTED: I/bf:3d1938b8f6d313bbd603, I/bf:3f9a26b9a02b519db8ad, O/bf:55422dbbba4b9e0a2560, A/bf:e84ae9d3b9cdae908410, A/bf:d42f710eaec743ea5dc2, P/bf:8e4a36af55e5624b1934, P/bf:474ae7a7c4012315007b, B/bf:fa2f1ce4c3fa00f49f29 | evt_check, evt_generate, evt_read：只检查不是独立新事件；未增加核对记录或权限。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q03

请PM检查worker服务的运行状态，生成service-note.md。不得停止worker服务。

首尾候选相同；中文包含运行状态所属服务及独立禁令。

原始完整证据：[Trace](runs/first/Q03/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q03-F01 | PM / 检查 / worker服务的运行状态 / REQUIRED | SUPPORTED: evt_check: 检查运行状态 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_status @evt_check | SUPPORTED: evt_check: 检查运行状态 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_status @evt_check | SUPPORTED: I/bf:e03c05bddb27ee1c2c34, I/bf:accc19b93ff73dac62f3, A/bf:ff3dfadc15c86a5cd275, P/bf:3e9db1921aaf36b044e0 | evt_check, cl_check_performer, cl_check_input：PM检查worker服务运行状态。 |
| Q03-F02 | PM / 生成 / service-note.md / REQUIRED | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_note @evt_generate | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_note @evt_generate | SUPPORTED: O/bf:16bb75db3d55eedcca00, A/bf:c814a22a18929ab43795, P/bf:b2de6cc38364251aa3dc | evt_generate, cl_generate_performer, cl_generate_result：PM生成service-note.md。 |
| Q03-F03 | worker服务状态，状态可读性不是已观测正常 | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_status @evt_check; cl_status_scope: SCOPE @evt_check; expr_status_of: STATE | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_status @evt_check; cl_status_scope: SCOPE @evt_check; expr_status_of: STATE | SUPPORTED: I/bf:e03c05bddb27ee1c2c34, I/bf:accc19b93ff73dac62f3, A/bf:ff3dfadc15c86a5cd275 | cl_check_input, cl_status_scope, expr_status_of：受检运行状态属于worker；未断言其正常。 |
| Q03-F04 | service-note.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_note @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_note @evt_generate | SUPPORTED: O/bf:16bb75db3d55eedcca00, A/bf:c814a22a18929ab43795 | cl_generate_result：报告在O。 |
| Q03-F05 | 禁止停止worker服务 | SUPPORTED: evt_stop: 停止服务 FORBIDDEN; cl_stop_object: ROLE OBJECT=ent_worker @evt_stop | SUPPORTED: evt_stop: 停止服务 FORBIDDEN; cl_stop_object: ROLE OBJECT=ent_worker @evt_stop | SUPPORTED: B/bf:98897f9f26d9e9943ca2 | evt_stop, cl_stop_object：B禁止停止worker服务，未变根任务停止C。 |
| Q03-F06 | 不新增重启义务，不宣布worker正常 | SUPPORTED: evt_check: 检查运行状态 REQUIRED; evt_generate: 生成文件 REQUIRED; evt_stop: 停止服务 FORBIDDEN | SUPPORTED: evt_check: 检查运行状态 REQUIRED; evt_generate: 生成文件 REQUIRED; evt_stop: 停止服务 FORBIDDEN | SUPPORTED: I/bf:e03c05bddb27ee1c2c34, I/bf:accc19b93ff73dac62f3, O/bf:16bb75db3d55eedcca00, A/bf:ff3dfadc15c86a5cd275, A/bf:c814a22a18929ab43795, P/bf:3e9db1921aaf36b044e0, P/bf:b2de6cc38364251aa3dc, B/bf:98897f9f26d9e9943ca2 | evt_check, evt_generate, evt_stop：无重启动作、无运行观测值；禁止执行者未指定不污染明确职责。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q04

请PM检查tool-list.json中的MCP工具清单，并生成mcp-check.md；QA负责复核mcp-check.md。

首尾候选相同；中文角色、对象及清单范围完整。

原始完整证据：[Trace](runs/first/Q04/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q04-F01 | PM / 检查 / tool-list.json中的MCP工具清单 / REQUIRED | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_pm: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_input @evt_check; cl_check_scope: SCOPE @evt_check | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_pm: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_input @evt_check; cl_check_scope: SCOPE @evt_check | SUPPORTED: I/bf:39098a2d9ccb4c1fbc5c, I/bf:eddeaa47595f9c984cba, A/bf:307b2e00fa1296c660ef, P/bf:ef2d1e54fba4cd4b2cbe | evt_check, cl_check_pm, cl_check_input, cl_check_scope：PM检查指定文件中的MCP工具清单。 |
| Q04-F02 | PM / 生成 / mcp-check.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_pm: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_pm: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: O/bf:46ac52e6a90cbf827459, A/bf:e96a5b091d1e92689c9c, P/bf:5de11f592934a97c93ee | evt_generate, cl_generate_pm, cl_generate_result：PM生成mcp-check.md。 |
| Q04-F03 | QA / 复核 / mcp-check.md / REQUIRED | SUPPORTED: evt_review: 复核 REQUIRED; cl_review_qa: ROLE REVIEWER=ent_qa @evt_review; cl_review_object: ROLE OBJECT=ent_report @evt_review | SUPPORTED: evt_review: 复核 REQUIRED; cl_review_qa: ROLE REVIEWER=ent_qa @evt_review; cl_review_object: ROLE OBJECT=ent_report @evt_review | SUPPORTED: A/bf:845ccb7e70d83c2f1607, P/bf:cec0d794452bafb099c7 | evt_review, cl_review_qa, cl_review_object：QA承担复核，REVIEWER足以表达该明确复核职责。 |
| Q04-F04 | QA复核同一内部报告，复核用途不是新外部输入 | SUPPORTED: ent_report: mcp-check.md; cl_generate_result: ROLE RESULT=ent_report @evt_generate; cl_review_object: ROLE OBJECT=ent_report @evt_review | SUPPORTED: ent_report: mcp-check.md; cl_generate_result: ROLE RESULT=ent_report @evt_generate; cl_review_object: ROLE OBJECT=ent_report @evt_review | SUPPORTED: O/bf:46ac52e6a90cbf827459, A/bf:e96a5b091d1e92689c9c, A/bf:845ccb7e70d83c2f1607 | cl_generate_result, cl_review_object, ent_report：生成与复核用同一实体；内部报告复核OBJECT不变外部输入。 |
| Q04-F05 | 工具清单来自tool-list.json | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_input @evt_check; cl_check_scope: SCOPE @evt_check; expr_list: ITEM | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_input @evt_check; cl_check_scope: SCOPE @evt_check; expr_list: ITEM | SUPPORTED: I/bf:39098a2d9ccb4c1fbc5c, I/bf:eddeaa47595f9c984cba, A/bf:307b2e00fa1296c660ef | cl_check_input, cl_check_scope, expr_list：I文件身份与清单局部范围齐全。 |
| Q04-F06 | mcp-check.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: O/bf:46ac52e6a90cbf827459, A/bf:e96a5b091d1e92689c9c | cl_generate_result：O报告明确。 |
| Q04-F07 | MCP不是依据或执行授权；不新增安装、调用工具 | SUPPORTED: evt_check: 检查 REQUIRED; evt_generate: 生成 REQUIRED; evt_review: 复核 REQUIRED | SUPPORTED: evt_check: 检查 REQUIRED; evt_generate: 生成 REQUIRED; evt_review: 复核 REQUIRED | SUPPORTED: I/bf:39098a2d9ccb4c1fbc5c, I/bf:eddeaa47595f9c984cba, O/bf:46ac52e6a90cbf827459, A/bf:307b2e00fa1296c660ef, A/bf:e96a5b091d1e92689c9c, A/bf:845ccb7e70d83c2f1607, P/bf:ef2d1e54fba4cd4b2cbe, P/bf:5de11f592934a97c93ee, P/bf:cec0d794452bafb099c7 | evt_check, evt_generate, evt_review：无工具安装/调用/权限或凭MCP产生依据。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q05

请PM列出settings.json中的配置项，并生成settings-list.md；不得更改任何配置项。

首尾候选相同；JSON和中文全称范围均保留。

原始完整证据：[Trace](runs/first/Q05/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q05-F01 | PM / 列出 / settings.json中的配置项 / REQUIRED | SUPPORTED: e1: 列出 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: e1: 列出 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: I/bf:8add7119fad6ac71e12f, I/bf:4cb9d0cdc00ef4b4adee, A/bf:8a1e32c82a85ec2a4340, P/bf:f717380fdaa75b60bfdc | e1, c1, c2, c3：PM列出settings.json中的配置项。 |
| Q05-F02 | PM / 生成 / settings-list.md / REQUIRED | SUPPORTED: e2: 生成 REQUIRED; c4: ROLE PERFORMER=n1 @e2; c5: ROLE RESULT=n4 @e2 | SUPPORTED: e2: 生成 REQUIRED; c4: ROLE PERFORMER=n1 @e2; c5: ROLE RESULT=n4 @e2 | SUPPORTED: O/bf:121f4a3821f04b0ab6ab, A/bf:1c8c4ad2bb31d91d437b, P/bf:b636713bd87cee9e1ec6 | e2, c4, c5：PM生成settings-list.md。 |
| Q05-F03 | settings.json及其中配置项 | SUPPORTED: c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: I/bf:8add7119fad6ac71e12f, I/bf:4cb9d0cdc00ef4b4adee, A/bf:8a1e32c82a85ec2a4340 | c2, c3：源文件及局部配置项内容同时保留。 |
| Q05-F04 | settings-list.md | SUPPORTED: c5: ROLE RESULT=n4 @e2 | SUPPORTED: c5: ROLE RESULT=n4 @e2 | SUPPORTED: O/bf:121f4a3821f04b0ab6ab, A/bf:1c8c4ad2bb31d91d437b | c5：明确O报告。 |
| Q05-F05 | 不得更改任何配置项，全称范围不可缩单项 | SUPPORTED: e3: 更改 FORBIDDEN; c7: ROLE OBJECT=n5 @e3; c8: SCOPE @e3; x1: ITEM | SUPPORTED: e3: 更改 FORBIDDEN; c7: ROLE OBJECT=n5 @e3; c8: SCOPE @e3; x1: ITEM | SUPPORTED: B/bf:e458a7fdadb20da96b3a, B/bf:aa6c8685d57c882e5ff0 | e3, c7, c8, x1：任何配置项字面全称范围保留于禁止对象和SCOPE；没有缩为单个配置项。 |
| Q05-F06 | 没有更改许可 | SUPPORTED: e1: 列出 REQUIRED; e2: 生成 REQUIRED; e3: 更改 FORBIDDEN | SUPPORTED: e1: 列出 REQUIRED; e2: 生成 REQUIRED; e3: 更改 FORBIDDEN | SUPPORTED: I/bf:8add7119fad6ac71e12f, I/bf:4cb9d0cdc00ef4b4adee, O/bf:121f4a3821f04b0ab6ab, A/bf:8a1e32c82a85ec2a4340, A/bf:1c8c4ad2bb31d91d437b, P/bf:f717380fdaa75b60bfdc, P/bf:b636713bd87cee9e1ec6, B/bf:e458a7fdadb20da96b3a, B/bf:aa6c8685d57c882e5ff0 | e1, e2, e3：无更改许可，列出不是修改。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q06

请DEV-01读取queue.csv并生成queue-note.md；OPS-01核对该报告中的队列数量。

首尾候选相同；中文将该报告绑定到queue-note.md且保留核对内容。

原始完整证据：[Trace](runs/first/Q06/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q06-F01 | DEV-01 / 读取 / queue.csv / REQUIRED | SUPPORTED: ev_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_dev @ev_read; cl_read_input: ROLE INPUT_OBJECT=ent_input @ev_read | SUPPORTED: ev_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_dev @ev_read; cl_read_input: ROLE INPUT_OBJECT=ent_input @ev_read | SUPPORTED: I/bf:fc1b722309d9d48eaf4f, A/bf:a96a509290f46f0ffed0, P/bf:7ccf74b9c20e07315056 | ev_read, cl_read_performer, cl_read_input：DEV-01读取queue.csv。 |
| Q06-F02 | DEV-01 / 生成 / queue-note.md / REQUIRED | SUPPORTED: ev_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_dev @ev_generate; cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: ev_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_dev @ev_generate; cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: O/bf:4ffaa79c2e2055fa6f6c, A/bf:82bf32ad57dd23606eb9, P/bf:7e899b1fcbc8d48f9c75 | ev_generate, cl_generate_performer, cl_generate_result：DEV-01生成queue-note.md。 |
| Q06-F03 | OPS-01 / 核对 / queue-note.md中的队列数量 / REQUIRED | SUPPORTED: ev_check: 核对队列数量 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_ops @ev_check; cl_check_report: ROLE OBJECT=ent_report @ev_check; cl_check_count: ROLE OBJECT=ent_count @ev_check | SUPPORTED: ev_check: 核对队列数量 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_ops @ev_check; cl_check_report: ROLE OBJECT=ent_report @ev_check; cl_check_count: ROLE OBJECT=ent_count @ev_check | SUPPORTED: A/bf:781f787083569a7ff83b, P/bf:02e40331b38fb09ee46d | ev_check, cl_check_performer, cl_check_report, cl_check_count：OPS-01核对该内部报告中的队列数量，不读取新外部文件。 |
| Q06-F04 | 该报告唯一回指queue-note.md | SUPPORTED: ent_report: queue-note.md; cl_generate_result: ROLE RESULT=ent_report @ev_generate; cl_check_report: ROLE OBJECT=ent_report @ev_check | SUPPORTED: ent_report: queue-note.md; cl_generate_result: ROLE RESULT=ent_report @ev_generate; cl_check_report: ROLE OBJECT=ent_report @ev_check | SUPPORTED: O/bf:4ffaa79c2e2055fa6f6c, A/bf:82bf32ad57dd23606eb9, A/bf:781f787083569a7ff83b | ent_report, cl_generate_result, cl_check_report：同一报告实体唯一回指。 |
| Q06-F05 | queue.csv；内部报告内容核对不是另一外部输入 | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_input @ev_read; cl_check_report: ROLE OBJECT=ent_report @ev_check | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_input @ev_read; cl_check_report: ROLE OBJECT=ent_report @ev_check | SUPPORTED: I/bf:fc1b722309d9d48eaf4f, A/bf:a96a509290f46f0ffed0, A/bf:781f787083569a7ff83b | cl_read_input, cl_check_report：I仅queue.csv，内部报告内容用OBJECT。 |
| Q06-F06 | queue-note.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: O/bf:4ffaa79c2e2055fa6f6c, A/bf:82bf32ad57dd23606eb9 | cl_generate_result：O为queue-note.md。 |
| Q06-F07 | 队列数量是核对内容，无数值阈值/R；不拆WP | SUPPORTED: ev_check: 核对队列数量 REQUIRED; cl_check_count: ROLE OBJECT=ent_count @ev_check | SUPPORTED: ev_check: 核对队列数量 REQUIRED; cl_check_count: ROLE OBJECT=ent_count @ev_check | SUPPORTED: A/bf:781f787083569a7ff83b, P/bf:02e40331b38fb09ee46d | ev_check, cl_check_count：队列数量无观测值、执行阈值或WP；R空。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q07

请PM仅负责组织磁盘空间检查，具体检查执行者由后续计划确定。请QA汇总检查结果并生成capacity.md。

首尾候选相同。中文及I组织范围、P组织者/汇总者和UNSPECIFIED均保真；检查未变PM/QA独立义务。类型元数据未决与真正指代歧义分开。

原始完整证据：[Trace](runs/first/Q07/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q07-F01 | PM / 组织 / 磁盘空间检查 / REQUIRED | SUPPORTED: ev_organize: 组织检查 REQUIRED; cl_organizer: ROLE ORGANIZER=ent_pm @ev_organize; cl_organization_content: SCOPE @ev_organize | SUPPORTED: ev_organize: 组织检查 REQUIRED; cl_organizer: ROLE ORGANIZER=ent_pm @ev_organize; cl_organization_content: SCOPE @ev_organize | SUPPORTED: I/bf:f67af450d69e0ed42103, I/bf:8d01f7b6396070173f68, A/bf:7f8435fa7afc9838956a, P/bf:5fd27c47344b40c471ea | ev_organize, cl_organizer, cl_organization_content：PM仅组织；ORGANIZER不是检查PERFORMER。 |
| Q07-F02 | QA / 汇总 / 检查结果 / REQUIRED | SUPPORTED: ev_summarize: 汇总检查结果 REQUIRED; cl_summarize_performer: ROLE PERFORMER=ent_qa @ev_summarize; cl_summarize_object: ROLE OBJECT=ent_results @ev_summarize | SUPPORTED: ev_summarize: 汇总检查结果 REQUIRED; cl_summarize_performer: ROLE PERFORMER=ent_qa @ev_summarize; cl_summarize_object: ROLE OBJECT=ent_results @ev_summarize | SUPPORTED: A/bf:933f89e148a3fd04094a, P/bf:828d7980871e46eff713 | ev_summarize, cl_summarize_performer, cl_summarize_object：QA汇总内部检查结果。 |
| Q07-F03 | QA / 生成 / capacity.md / REQUIRED | SUPPORTED: ev_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @ev_generate; cl_generate_result: ROLE RESULT=ent_capacity @ev_generate | SUPPORTED: ev_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @ev_generate; cl_generate_result: ROLE RESULT=ent_capacity @ev_generate | SUPPORTED: O/bf:188bf7b02126f78f1507, A/bf:56ed4475a05937ce6b2e, P/bf:b69aeab3d0a3b7a00bbb | ev_generate, cl_generate_performer, cl_generate_result：QA生成capacity.md。 |
| Q07-F04 | PM仅组织；QA只明确汇总/生成，均不默认亲自检查 | SUPPORTED: cl_organizer: ROLE ORGANIZER=ent_pm @ev_organize; cl_pm_scope: SCOPE @ev_organize; ex_pm_scope: STATE | SUPPORTED: cl_organizer: ROLE ORGANIZER=ent_pm @ev_organize; cl_pm_scope: SCOPE @ev_organize; ex_pm_scope: STATE | SUPPORTED: I/bf:8d01f7b6396070173f68, A/bf:7f8435fa7afc9838956a, P/bf:5fd27c47344b40c471ea | cl_organizer, cl_pm_scope, ex_pm_scope：仅组织职责限制保留；无PM/QA执行检查角色。 |
| Q07-F05 | 检查执行者由后续计划确定，不是竞争指代歧义 | SUPPORTED: ev_check: 检查磁盘空间 UNSTATED; cl_deferred_assignment: SCOPE @ev_check; ex_deferred_assignment: STATE | SUPPORTED: ev_check: 检查磁盘空间 UNSTATED; cl_deferred_assignment: SCOPE @ev_check; ex_deferred_assignment: STATE | SUPPORTED: I/bf:298ae591cb07e9139fb9 | ev_check, cl_deferred_assignment, ex_deferred_assignment：检查CONTENT/MentionOnly，无执行者；UNSPECIFIED由后续计划确定，不是竞争指代。 |
| Q07-F06 | 磁盘空间检查的明确受检范围保留，可在被组织检查用途表达 | SUPPORTED: cl_organization_content: SCOPE @ev_organize; cl_check_object: ROLE INPUT_OBJECT=ent_disk_space @ev_check; ex_check_content: STATE | SUPPORTED: cl_organization_content: SCOPE @ev_organize; cl_check_object: ROLE INPUT_OBJECT=ent_disk_space @ev_check; ex_check_content: STATE | SUPPORTED: I/bf:f67af450d69e0ed42103 | cl_organization_content, ex_check_content, cl_check_object：被组织检查明确磁盘空间范围；I以组织SCOPE可达该检查，内容对象仍保留。 |
| Q07-F07 | capacity.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_capacity @ev_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_capacity @ev_generate | SUPPORTED: O/bf:188bf7b02126f78f1507, A/bf:56ed4475a05937ce6b2e | cl_generate_result：capacity.md在O REQUIRED。 |
| Q07-F08 | 不新增制定后续计划义务或默认检查人 | SUPPORTED: ev_organize: 组织检查 REQUIRED; ev_check: 检查磁盘空间 UNSTATED; ev_summarize: 汇总检查结果 REQUIRED; ev_generate: 生成文件 REQUIRED | SUPPORTED: ev_organize: 组织检查 REQUIRED; ev_check: 检查磁盘空间 UNSTATED; ev_summarize: 汇总检查结果 REQUIRED; ev_generate: 生成文件 REQUIRED | SUPPORTED: I/bf:f67af450d69e0ed42103, I/bf:8d01f7b6396070173f68, I/bf:298ae591cb07e9139fb9, O/bf:188bf7b02126f78f1507, A/bf:7f8435fa7afc9838956a, A/bf:933f89e148a3fd04094a, A/bf:56ed4475a05937ce6b2e, P/bf:5fd27c47344b40c471ea, P/bf:828d7980871e46eff713, P/bf:b69aeab3d0a3b7a00bbb | ev_organize, ev_check, ev_summarize, ev_generate：未生成制定计划/指定执行者的当前动作。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q08

请OPS-01检查备份目录的可读性，并生成access.md。由OPS-01将access.md交给QA；本任务不要求QA复核。

首尾候选正确，Canonical.retained_nonprojected也保留免除的QA及access对象；但中文NOT_REQUIRED行省略角色与对象。未修改编译器。

原始完整证据：[Trace](runs/first/Q08/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q08-F01 | OPS-01 / 检查 / 备份目录的可读性 / REQUIRED | SUPPORTED: evt_check: 检查可读性 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_ops @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_directory @evt_check | SUPPORTED: evt_check: 检查可读性 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_ops @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_directory @evt_check | SUPPORTED: I/bf:e1f0a79bfefe7f2b00dc, A/bf:e3db0fb8da28664439a9, P/bf:b7fd784a780a623d4616 | evt_check, cl_check_performer, cl_check_input：OPS-01检查备份目录可读性。 |
| Q08-F02 | OPS-01 / 生成 / access.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_result: ROLE RESULT=ent_access @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_result: ROLE RESULT=ent_access @evt_generate | SUPPORTED: O/bf:f0b069c687051e8a3964, A/bf:be0c35abe1b0aff87627, P/bf:2379b374bc6d18f2ecb9 | evt_generate, cl_generate_performer, cl_generate_result：OPS-01生成access.md。 |
| Q08-F03 | OPS-01 / 交给 / access.md / REQUIRED | SUPPORTED: evt_deliver: 交付 REQUIRED; cl_deliver_performer: ROLE PERFORMER=ent_ops @evt_deliver; cl_deliver_object: ROLE OBJECT=ent_access @evt_deliver | SUPPORTED: evt_deliver: 交付 REQUIRED; cl_deliver_performer: ROLE PERFORMER=ent_ops @evt_deliver; cl_deliver_object: ROLE OBJECT=ent_access @evt_deliver | SUPPORTED: A/bf:9a87b1ad5244b9d60e2b, P/bf:941acc041c3e18c72d16, P/bf:2b9fc415ddc5b904f194 | evt_deliver, cl_deliver_performer, cl_deliver_object：OPS-01交付同一access.md。 |
| Q08-F04 | 交给QA | SUPPORTED: cl_deliver_recipient: ROLE RECIPIENT=ent_qa @evt_deliver | SUPPORTED: cl_deliver_recipient: ROLE RECIPIENT=ent_qa @evt_deliver | SUPPORTED: A/bf:9a87b1ad5244b9d60e2b, P/bf:2b9fc415ddc5b904f194 | cl_deliver_recipient：QA仅作交付接收者。 |
| Q08-F05 | 备份目录可读性范围 | SUPPORTED: evt_check: 检查可读性 REQUIRED; cl_check_input: ROLE INPUT_OBJECT=ent_directory @evt_check | SUPPORTED: evt_check: 检查可读性 REQUIRED; cl_check_input: ROLE INPUT_OBJECT=ent_directory @evt_check | SUPPORTED: I/bf:e1f0a79bfefe7f2b00dc, A/bf:e3db0fb8da28664439a9, P/bf:b7fd784a780a623d4616 | cl_check_input, evt_check：目录身份及可读性检查谓词齐全。 |
| Q08-F06 | access.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_access @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_access @evt_generate | SUPPORTED: O/bf:f0b069c687051e8a3964, A/bf:be0c35abe1b0aff87627 | cl_generate_result：access.md在O REQUIRED。 |
| Q08-F07 | QA复核不要求；不产生复核义务/禁止/额外许可 | SUPPORTED: evt_review: 复核 NOT_REQUIRED; cl_review_reviewer: ROLE REVIEWER=ent_qa @evt_review; cl_review_object: ROLE OBJECT=ent_access @evt_review | SUPPORTED: evt_review: 复核 NOT_REQUIRED; cl_review_reviewer: ROLE REVIEWER=ent_qa @evt_review; cl_review_object: ROLE OBJECT=ent_access @evt_review | ERROR:  | evt_review, cl_review_reviewer, cl_review_object：候选与JSON以NOT_REQUIRED/QA/access.md保留免除复核义务；中文却只写“无需 复核”，丢QA和目标文件，无法从该免除项确定适用者及对象。 |
| Q08-F08 | 生成与交付access.md保持同一身份 | SUPPORTED: ent_access: access.md; cl_generate_result: ROLE RESULT=ent_access @evt_generate; cl_deliver_object: ROLE OBJECT=ent_access @evt_deliver | SUPPORTED: ent_access: access.md; cl_generate_result: ROLE RESULT=ent_access @evt_generate; cl_deliver_object: ROLE OBJECT=ent_access @evt_deliver | SUPPORTED: O/bf:f0b069c687051e8a3964, A/bf:be0c35abe1b0aff87627, A/bf:9a87b1ad5244b9d60e2b | ent_access, cl_generate_result, cl_deliver_object：生成、交付、免除复核用途为同一access.md。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q09

请DEV-01依据FORMAT-9核对index.csv，并生成format-check.md；QA仅负责接收该报告，不负责执行核对。

首尾候选正确，JSON免除有QA主体；中文NOT_REQUIRED行丢指定主体，程序渲染保真失败。

原始完整证据：[Trace](runs/first/Q09/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q09-F01 | DEV-01 / 核对 / index.csv / REQUIRED | SUPPORTED: e1: 核对 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: e1: 核对 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: I/bf:889bb5ad9a0aec6a2868, A/bf:2f0b5c1df46ca1171b3f, P/bf:41c7da8d9dd94d53abab, V/bf:5ed181e09f0f557bb511 | e1, c1, c3：DEV-01核对index.csv。 |
| Q09-F02 | DEV-01 / 生成 / format-check.md / REQUIRED | SUPPORTED: e2: 生成报告 REQUIRED; c4: ROLE PERFORMER=n1 @e2; c5: ROLE RESULT=n4 @e2 | SUPPORTED: e2: 生成报告 REQUIRED; c4: ROLE PERFORMER=n1 @e2; c5: ROLE RESULT=n4 @e2 | SUPPORTED: O/bf:5ab111acea19e6982d32, A/bf:14dd09b997885af7ea58, P/bf:0b6847a18d59177dcadd | e2, c4, c5：DEV-01生成format-check.md。 |
| Q09-F03 | FORMAT-9约束DEV核对，不是检查对象 | SUPPORTED: c2: ROLE BASIS=n2 @e1 | SUPPORTED: c2: ROLE BASIS=n2 @e1 | SUPPORTED: A/bf:2f0b5c1df46ca1171b3f, V/bf:5ed181e09f0f557bb511 | c2：FORMAT-9明确为e1依据，V而非I。 |
| Q09-F04 | QA仅接收format-check.md | SUPPORTED: e3: 接收报告 REQUIRED; c6: ROLE RECIPIENT=n5 @e3; c7: ROLE OBJECT=n4 @e3; c9: SCOPE @e3; x1: STATE | SUPPORTED: e3: 接收报告 REQUIRED; c6: ROLE RECIPIENT=n5 @e3; c7: ROLE OBJECT=n4 @e3; c9: SCOPE @e3; x1: STATE | SUPPORTED: I/bf:51e9f77161fd983a5826, A/bf:ecc52f0ddff4589dbbe5, P/bf:e463c170a93f5661495e | e3, c6, c7, c9, x1：QA仅接收同一内部报告，有明确RECIPIENT。 |
| Q09-F05 | QA不负责执行核对，不解释为通用禁止核对 | SUPPORTED: e4: 执行核对 NOT_REQUIRED; c8: ROLE PERFORMER=n5 @e4 | SUPPORTED: e4: 执行核对 NOT_REQUIRED; c8: ROLE PERFORMER=n5 @e4 | ERROR:  | e4, c8：JSON以QA/NOT_REQUIRED执行核对撤回该职责；中文独立写“无需 执行核对”却无QA限定，与DEV明确核对义务的区别没有在免除条目显示。 |
| Q09-F06 | index.csv | SUPPORTED: c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: I/bf:889bb5ad9a0aec6a2868, A/bf:2f0b5c1df46ca1171b3f | c3：I为index.csv，依据不变对象。 |
| Q09-F07 | format-check.md | SUPPORTED: c5: ROLE RESULT=n4 @e2 | SUPPORTED: c5: ROLE RESULT=n4 @e2 | SUPPORTED: O/bf:5ab111acea19e6982d32, A/bf:14dd09b997885af7ea58 | c5：O format-check.md。 |
| Q09-F08 | 不新增未述发送操作的执行者或QA检查义务 | SUPPORTED: e1: 核对 REQUIRED; e2: 生成报告 REQUIRED; e3: 接收报告 REQUIRED; e4: 执行核对 NOT_REQUIRED | SUPPORTED: e1: 核对 REQUIRED; e2: 生成报告 REQUIRED; e3: 接收报告 REQUIRED; e4: 执行核对 NOT_REQUIRED | SUPPORTED: I/bf:889bb5ad9a0aec6a2868, I/bf:51e9f77161fd983a5826, O/bf:5ab111acea19e6982d32, A/bf:2f0b5c1df46ca1171b3f, A/bf:14dd09b997885af7ea58, A/bf:ecc52f0ddff4589dbbe5, P/bf:41c7da8d9dd94d53abab, P/bf:0b6847a18d59177dcadd, P/bf:e463c170a93f5661495e, V/bf:5ed181e09f0f557bb511 | e1, e2, e3, e4：没有发送动作或未述发送者；没有QA核对/批准义务。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q10

请PM生成report-a.md。请QA复核并更新这份报告，PM再将更新后的同一报告提交给ADMIN。

首尾候选及JSON关系正确；中文STATE表达省略event_id，两个不同动作前提显示成完全相同文本。

原始完整证据：[Trace](runs/first/Q10/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q10-F01 | PM / 生成 / report-a.md / REQUIRED | SUPPORTED: EV_GENERATE: 生成 REQUIRED; C_GENERATE_PM: ROLE PERFORMER=E_PM @EV_GENERATE; C_GENERATE_RESULT: ROLE RESULT=E_REPORT @EV_GENERATE | SUPPORTED: EV_GENERATE: 生成 REQUIRED; C_GENERATE_PM: ROLE PERFORMER=E_PM @EV_GENERATE; C_GENERATE_RESULT: ROLE RESULT=E_REPORT @EV_GENERATE | SUPPORTED: O/bf:cd8aad083ea5d095d493, A/bf:bb18eb6bb08c2600a62c, P/bf:205de914cd5efe73a22c | EV_GENERATE, C_GENERATE_PM, C_GENERATE_RESULT：PM生成report-a.md。 |
| Q10-F02 | QA / 复核 / report-a.md / REQUIRED | SUPPORTED: EV_REVIEW: 复核 REQUIRED; C_REVIEW_QA: ROLE REVIEWER=E_QA @EV_REVIEW; C_REVIEW_OBJECT: ROLE OBJECT=E_REPORT @EV_REVIEW | SUPPORTED: EV_REVIEW: 复核 REQUIRED; C_REVIEW_QA: ROLE REVIEWER=E_QA @EV_REVIEW; C_REVIEW_OBJECT: ROLE OBJECT=E_REPORT @EV_REVIEW | SUPPORTED: A/bf:7f732183ad3d655b6647, P/bf:b1bcc2c5567f0f3eeeab | EV_REVIEW, C_REVIEW_QA, C_REVIEW_OBJECT：QA复核生成的同一报告。 |
| Q10-F03 | QA / 更新 / report-a.md / REQUIRED | SUPPORTED: EV_UPDATE: 更新 REQUIRED; C_UPDATE_QA: ROLE PERFORMER=E_QA @EV_UPDATE; C_UPDATE_OBJECT: ROLE OBJECT=E_REPORT @EV_UPDATE; C_UPDATE_RESULT: ROLE RESULT=E_REPORT @EV_UPDATE | SUPPORTED: EV_UPDATE: 更新 REQUIRED; C_UPDATE_QA: ROLE PERFORMER=E_QA @EV_UPDATE; C_UPDATE_OBJECT: ROLE OBJECT=E_REPORT @EV_UPDATE; C_UPDATE_RESULT: ROLE RESULT=E_REPORT @EV_UPDATE | SUPPORTED: O/bf:c094c362b4a1bb9410de, A/bf:1216152b5aa7bc2fd42b, P/bf:100b4b576466ba2dbb30 | EV_UPDATE, C_UPDATE_QA, C_UPDATE_OBJECT, C_UPDATE_RESULT：QA更新，RESULT是同一报告的新状态而非第二个无关联文件。 |
| Q10-F04 | PM / 提交 / 更新后的report-a.md / REQUIRED | SUPPORTED: EV_SUBMIT: 提交 REQUIRED; C_SUBMIT_PM: ROLE PERFORMER=E_PM @EV_SUBMIT; C_SUBMIT_OBJECT: ROLE OBJECT=E_REPORT @EV_SUBMIT | SUPPORTED: EV_SUBMIT: 提交 REQUIRED; C_SUBMIT_PM: ROLE PERFORMER=E_PM @EV_SUBMIT; C_SUBMIT_OBJECT: ROLE OBJECT=E_REPORT @EV_SUBMIT | SUPPORTED: A/bf:0dd3cf70db6039723c5c, P/bf:2513f3e6c7a60e50dab2, P/bf:ebe358b3f6e052d2eca0 | EV_SUBMIT, C_SUBMIT_PM, C_SUBMIT_OBJECT：PM提交QA更新后的同一报告。 |
| Q10-F05 | 提交给ADMIN | SUPPORTED: C_SUBMIT_RECIPIENT: ROLE RECIPIENT=E_ADMIN @EV_SUBMIT | SUPPORTED: C_SUBMIT_RECIPIENT: ROLE RECIPIENT=E_ADMIN @EV_SUBMIT | SUPPORTED: A/bf:0dd3cf70db6039723c5c, P/bf:ebe358b3f6e052d2eca0 | C_SUBMIT_RECIPIENT：接收者ADMIN。 |
| Q10-F06 | 单一报告；更新版本若单列必须有明确同一产物关联 | SUPPORTED: E_REPORT: report-a.md; C_GENERATE_RESULT: ROLE RESULT=E_REPORT @EV_GENERATE; C_REVIEW_OBJECT: ROLE OBJECT=E_REPORT @EV_REVIEW; C_UPDATE_OBJECT: ROLE OBJECT=E_REPORT @EV_UPDATE; C_UPDATE_RESULT: ROLE RESULT=E_REPORT @EV_UPDATE; C_SUBMIT_OBJECT: ROLE OBJECT=E_REPORT @EV_SUBMIT | SUPPORTED: E_REPORT: report-a.md; C_GENERATE_RESULT: ROLE RESULT=E_REPORT @EV_GENERATE; C_REVIEW_OBJECT: ROLE OBJECT=E_REPORT @EV_REVIEW; C_UPDATE_OBJECT: ROLE OBJECT=E_REPORT @EV_UPDATE; C_UPDATE_RESULT: ROLE RESULT=E_REPORT @EV_UPDATE; C_SUBMIT_OBJECT: ROLE OBJECT=E_REPORT @EV_SUBMIT | SUPPORTED: O/bf:cd8aad083ea5d095d493, O/bf:c094c362b4a1bb9410de, A/bf:bb18eb6bb08c2600a62c, A/bf:7f732183ad3d655b6647, A/bf:1216152b5aa7bc2fd42b, A/bf:0dd3cf70db6039723c5c | E_REPORT, C_GENERATE_RESULT, C_REVIEW_OBJECT, C_UPDATE_OBJECT, C_UPDATE_RESULT, C_SUBMIT_OBJECT：同一E_REPORT，内部更新和后续用途不变外部输入。 |
| Q10-F07 | 生成后复核/更新，再提交更新后的同一报告 | SUPPORTED: C_SUBMIT_ORDER: TEMPORAL ORDER AFTER @EV_SUBMIT; X_REVIEW_DONE: STATE; X_UPDATE_DONE: STATE; X_QA_DONE: AND | SUPPORTED: C_SUBMIT_ORDER: TEMPORAL ORDER AFTER @EV_SUBMIT; X_REVIEW_DONE: STATE; X_UPDATE_DONE: STATE; X_QA_DONE: AND | ERROR: A/bf:0dd3cf70db6039723c5c, P/bf:2513f3e6c7a60e50dab2, P/bf:ebe358b3f6e052d2eca0 | C_SUBMIT_ORDER, X_REVIEW_DONE, X_UPDATE_DONE, X_QA_DONE：JSON AFTER/AND分别指EV_REVIEW、EV_UPDATE完成；生成和内部用途具有同一产物数据依赖。但中文两个状态都只显示“已完成(QA,report-a.md)”，省略两个不同event_id，未说明分别完成复核与更新。 |
| Q10-F08 | report-a.md；内部更新不是新增外部输入 | SUPPORTED: C_GENERATE_RESULT: ROLE RESULT=E_REPORT @EV_GENERATE; C_UPDATE_RESULT: ROLE RESULT=E_REPORT @EV_UPDATE | SUPPORTED: C_GENERATE_RESULT: ROLE RESULT=E_REPORT @EV_GENERATE; C_UPDATE_RESULT: ROLE RESULT=E_REPORT @EV_UPDATE | SUPPORTED: O/bf:cd8aad083ea5d095d493, O/bf:c094c362b4a1bb9410de, A/bf:bb18eb6bb08c2600a62c, A/bf:1216152b5aa7bc2fd42b | C_GENERATE_RESULT, C_UPDATE_RESULT：O同一report-a生成/更新两种用途，I空。 |
| Q10-F09 | 没有版本依据，内部用途不自动I | SUPPORTED: EV_GENERATE: 生成 REQUIRED; EV_REVIEW: 复核 REQUIRED; EV_UPDATE: 更新 REQUIRED; EV_SUBMIT: 提交 REQUIRED | SUPPORTED: EV_GENERATE: 生成 REQUIRED; EV_REVIEW: 复核 REQUIRED; EV_UPDATE: 更新 REQUIRED; EV_SUBMIT: 提交 REQUIRED | SUPPORTED: O/bf:cd8aad083ea5d095d493, O/bf:c094c362b4a1bb9410de, A/bf:bb18eb6bb08c2600a62c, A/bf:7f732183ad3d655b6647, A/bf:1216152b5aa7bc2fd42b, A/bf:0dd3cf70db6039723c5c, P/bf:205de914cd5efe73a22c, P/bf:b1bcc2c5567f0f3eeeab, P/bf:100b4b576466ba2dbb30, P/bf:2513f3e6c7a60e50dab2, P/bf:ebe358b3f6e052d2eca0 | EV_GENERATE, EV_REVIEW, EV_UPDATE, EV_SUBMIT：无版本依据或外部输入增造。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q11

请QA按照RULE-17检查schema.yaml，生成conformance.md。

首尾候选相同；JSON/中文区分依据和受检对象，没有额外行为。

原始完整证据：[Trace](runs/first/Q11/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q11-F01 | QA / 检查 / schema.yaml / REQUIRED | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_qa @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_qa @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: I/bf:83ce877e6f86db6bc9d9, A/bf:0a7f3e2ed4bd532d72fa, P/bf:1412cdbe54408a82516e, V/bf:ea55cbc1fdab1530f79b | evt_check, cl_check_performer, cl_check_input：QA检查schema.yaml。 |
| Q11-F02 | QA / 生成 / conformance.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @evt_generate; cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @evt_generate; cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: O/bf:5d90a8e0dcc7cb99eec9, A/bf:2333dc46d62659a7d436, P/bf:e83bc97181efefe5350d | evt_generate, cl_generate_performer, cl_generate_result：QA生成conformance.md。 |
| Q11-F03 | RULE-17是检查依据 | SUPPORTED: cl_check_basis: ROLE BASIS=ent_rule @evt_check | SUPPORTED: cl_check_basis: ROLE BASIS=ent_rule @evt_check | SUPPORTED: A/bf:0a7f3e2ed4bd532d72fa, V/bf:ea55cbc1fdab1530f79b | cl_check_basis：RULE-17为按照指定的检查依据。 |
| Q11-F04 | schema.yaml，不是RULE-17 | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: I/bf:83ce877e6f86db6bc9d9, A/bf:0a7f3e2ed4bd532d72fa | cl_check_input：schema.yaml唯一受检对象，RULE-17不进入I。 |
| Q11-F05 | conformance.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: O/bf:5d90a8e0dcc7cb99eec9, A/bf:2333dc46d62659a7d436 | cl_generate_result：O conformance.md。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q12

请QA检查RULE-17的内容和schema.yaml，生成conformance.md。

首尾候选相同；与Q11区分正确，中文也把RULE内容放I而非V。

原始完整证据：[Trace](runs/first/Q12/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q12-F01 | QA / 检查 / RULE-17的内容和schema.yaml / REQUIRED | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_qa @evt_check; cl_check_rule: ROLE INPUT_OBJECT=ent_rule_content @evt_check; cl_check_schema: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_qa @evt_check; cl_check_rule: ROLE INPUT_OBJECT=ent_rule_content @evt_check; cl_check_schema: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: I/bf:529cf1e856ac7c37b48b, I/bf:8355a633c6967f4cf879, A/bf:050d5e66f0e06b7f8c7e, P/bf:db092cf79637ffb0d632 | evt_check, cl_check_performer, cl_check_rule, cl_check_schema：QA检查两个并列对象：RULE-17内容和schema.yaml。 |
| Q12-F02 | QA / 生成 / conformance.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @evt_generate; cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @evt_generate; cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: O/bf:85991862204b86be0798, A/bf:e97f44856500c84f2dda, P/bf:b07a60b03d78df603f09 | evt_generate, cl_generate_performer, cl_generate_result：QA生成conformance.md。 |
| Q12-F03 | 两者都为检查对象，可以并列实体/集合 | SUPPORTED: cl_check_rule: ROLE INPUT_OBJECT=ent_rule_content @evt_check; cl_check_schema: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: cl_check_rule: ROLE INPUT_OBJECT=ent_rule_content @evt_check; cl_check_schema: ROLE INPUT_OBJECT=ent_schema @evt_check | SUPPORTED: I/bf:529cf1e856ac7c37b48b, I/bf:8355a633c6967f4cf879, A/bf:050d5e66f0e06b7f8c7e | cl_check_rule, cl_check_schema：两者都在I，是并列受检对象而非两个角色误并。 |
| Q12-F04 | conformance.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_conformance @evt_generate | SUPPORTED: O/bf:85991862204b86be0798, A/bf:e97f44856500c84f2dda | cl_generate_result：O conformance.md。 |
| Q12-F05 | RULE-17不是依据，不凭编号进V | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_rule: ROLE INPUT_OBJECT=ent_rule_content @evt_check | SUPPORTED: evt_check: 检查 REQUIRED; cl_check_rule: ROLE INPUT_OBJECT=ent_rule_content @evt_check | SUPPORTED: I/bf:529cf1e856ac7c37b48b, I/bf:8355a633c6967f4cf879, A/bf:050d5e66f0e06b7f8c7e, P/bf:db092cf79637ffb0d632 | cl_check_rule, evt_check：无BASIS及V，不凭RULE编号认作依据。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q13

请PM以commit 7ac921e作为基线比较当前配置，生成diff.md。不得切换当前工作区的commit。

首尾候选相同；版本基线、对象及禁止在JSON和中文均分开，未断言当前提交值。

原始完整证据：[Trace](runs/first/Q13/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q13-F01 | PM / 比较 / 当前配置 / REQUIRED | SUPPORTED: ev_compare: 比较配置 REQUIRED; cl_compare_performer: ROLE PERFORMER=ent_pm @ev_compare; cl_compare_input: ROLE INPUT_OBJECT=ent_config @ev_compare | SUPPORTED: ev_compare: 比较配置 REQUIRED; cl_compare_performer: ROLE PERFORMER=ent_pm @ev_compare; cl_compare_input: ROLE INPUT_OBJECT=ent_config @ev_compare | SUPPORTED: I/bf:44a573162cd1e29bb952, A/bf:2813277174a3579ea6c4, P/bf:4e5c449d49988162bd37, V/bf:75d38a69967ee3fe7732 | ev_compare, cl_compare_performer, cl_compare_input：PM比较当前配置。 |
| Q13-F02 | PM / 生成 / diff.md / REQUIRED | SUPPORTED: ev_generate: 生成差异文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @ev_generate; cl_generate_result: ROLE RESULT=ent_diff @ev_generate | SUPPORTED: ev_generate: 生成差异文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @ev_generate; cl_generate_result: ROLE RESULT=ent_diff @ev_generate | SUPPORTED: O/bf:ec164b540a4241261057, A/bf:82f38ca49bc65755759a, P/bf:09c5d363671aa65fec95 | ev_generate, cl_generate_performer, cl_generate_result：PM生成diff.md。 |
| Q13-F03 | commit 7ac921e作为比较基线 | SUPPORTED: ent_baseline: commit 7ac921e; cl_compare_basis: ROLE BASIS=ent_baseline @ev_compare | SUPPORTED: ent_baseline: commit 7ac921e; cl_compare_basis: ROLE BASIS=ent_baseline @ev_compare | SUPPORTED: A/bf:2813277174a3579ea6c4, V/bf:75d38a69967ee3fe7732 | cl_compare_basis, ent_baseline：commit 7ac921e仅作明确比较基线，进入V。 |
| Q13-F04 | 当前配置 | SUPPORTED: cl_compare_input: ROLE INPUT_OBJECT=ent_config @ev_compare | SUPPORTED: cl_compare_input: ROLE INPUT_OBJECT=ent_config @ev_compare | SUPPORTED: I/bf:44a573162cd1e29bb952, A/bf:2813277174a3579ea6c4 | cl_compare_input：当前配置是I。 |
| Q13-F05 | diff.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_diff @ev_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_diff @ev_generate | SUPPORTED: O/bf:ec164b540a4241261057, A/bf:82f38ca49bc65755759a | cl_generate_result：O diff.md。 |
| Q13-F06 | 不得切换当前工作区的commit，不仅禁切到7ac921e | SUPPORTED: ev_switch: 切换提交 FORBIDDEN; cl_switch_object: ROLE OBJECT=ent_current_commit @ev_switch | SUPPORTED: ev_switch: 切换提交 FORBIDDEN; cl_switch_object: ROLE OBJECT=ent_current_commit @ev_switch | SUPPORTED: B/bf:da5be3ccab645b57c890 | ev_switch, cl_switch_object：禁止切换当前工作区commit，并未缩成只禁止切到7ac921e。 |
| Q13-F07 | 当前commit未知，没有切换或读取业务仓库操作 | SUPPORTED: ev_compare: 比较配置 REQUIRED; ev_generate: 生成差异文件 REQUIRED; ev_switch: 切换提交 FORBIDDEN | SUPPORTED: ev_compare: 比较配置 REQUIRED; ev_generate: 生成差异文件 REQUIRED; ev_switch: 切换提交 FORBIDDEN | SUPPORTED: I/bf:44a573162cd1e29bb952, O/bf:ec164b540a4241261057, A/bf:2813277174a3579ea6c4, A/bf:82f38ca49bc65755759a, P/bf:4e5c449d49988162bd37, P/bf:09c5d363671aa65fec95, V/bf:75d38a69967ee3fe7732, B/bf:da5be3ccab645b57c890 | ev_compare, ev_generate, ev_switch：无当前commit观测值、业务仓库读取操作或切换义务；技术requires(ev_compare)只保留生成差异的证据依赖。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q14

请PM读取ticket-516.txt并生成brief-516.md。ticket-516.txt是待读材料，不是任务依据。

首尾候选相同，JSON/中文保留非依据说明，文件不变V/R。

原始完整证据：[Trace](runs/first/Q14/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q14-F01 | PM / 读取 / ticket-516.txt / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_ticket @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_ticket @evt_read | SUPPORTED: I/bf:699d0f33e084f5b19891, A/bf:12c843f93d8c8fd9252d, P/bf:7306df7974df4b36ed3b | evt_read, cl_read_performer, cl_read_input：PM读取ticket-516.txt。 |
| Q14-F02 | PM / 生成 / brief-516.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_brief @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_brief @evt_generate | SUPPORTED: O/bf:ac3257a0f23c6961f76a, A/bf:b69f22c02dca8e5b8757, P/bf:cd1e274a35008d2401ac | evt_generate, cl_generate_performer, cl_generate_result：PM生成brief-516.md。 |
| Q14-F03 | ticket-516.txt待读材料 | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_ticket @evt_read | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_ticket @evt_read | SUPPORTED: I/bf:699d0f33e084f5b19891, A/bf:12c843f93d8c8fd9252d | cl_read_input：ticket文件为明确I待读材料。 |
| Q14-F04 | brief-516.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_brief @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_brief @evt_generate | SUPPORTED: O/bf:ac3257a0f23c6961f76a, A/bf:b69f22c02dca8e5b8757 | cl_generate_result：brief文件为O。 |
| Q14-F05 | 明确不是任务依据 | SUPPORTED: cl_basis_exclusion: SCOPE @ROOT; expr_not_basis: STATE | SUPPORTED: cl_basis_exclusion: SCOPE @ROOT; expr_not_basis: STATE | SUPPORTED: I/bf:27021cf54dfa2a88b27d | cl_basis_exclusion, expr_not_basis：根任务SCOPE以NEGATIVE状态明确排除该文件依据用途；V空，无禁止动作。 |
| Q14-F06 | 516标识符不是资源/次数 | SUPPORTED: ent_ticket: ticket-516.txt; ent_brief: brief-516.md; evt_read: 读取 REQUIRED; evt_generate: 生成 REQUIRED | SUPPORTED: ent_ticket: ticket-516.txt; ent_brief: brief-516.md; evt_read: 读取 REQUIRED; evt_generate: 生成 REQUIRED | SUPPORTED: I/bf:699d0f33e084f5b19891, O/bf:ac3257a0f23c6961f76a, A/bf:12c843f93d8c8fd9252d, A/bf:b69f22c02dca8e5b8757, P/bf:7306df7974df4b36ed3b, P/bf:cd1e274a35008d2401ac | evt_read, evt_generate, ent_ticket, ent_brief：516仅文件名组成；没有QUANTITY或R。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q15

请PM核对users.csv；可以另外生成optional.md，但本任务不要求交付optional.md。

首尾候选都把允许生成的主体写成UNSPECIFIED。模型审阅未纠正，技术层接受A2；最终P缺生成主体。另有无需交付中文对象遗漏。

原始完整证据：[Trace](runs/first/Q15/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q15-F01 | PM / 核对 / users.csv / REQUIRED | SUPPORTED: A1: 核对 REQUIRED; C1: ROLE PERFORMER=E1 @A1; C2: ROLE INPUT_OBJECT=E2 @A1 | SUPPORTED: A1: 核对 REQUIRED; C1: ROLE PERFORMER=E1 @A1; C2: ROLE INPUT_OBJECT=E2 @A1 | SUPPORTED: I/bf:f65e973c23718740725a, A/bf:eac24d0ca8a427edc53a, P/bf:606e49e7415987041d2e | A1, C1, C2：PM核对users.csv。 |
| Q15-F02 | PM / 生成 / optional.md / PERMITTED | ERROR: A2: 生成 PERMITTED; C3: ROLE RESULT=E3 @A2 | ERROR: A2: 生成 PERMITTED; C3: ROLE RESULT=E3 @A2 | ERROR: O/bf:b9f852fc789814bb71e4, A/bf:af489118c46903a0c184 | A2, C3：生成许可和optional对象正确，但省略同一任务主体PM；原文“可以另外生成”延续唯一明确主体PM，不应改成执行者未指定。 |
| Q15-F03 | users.csv | SUPPORTED: C2: ROLE INPUT_OBJECT=E2 @A1 | SUPPORTED: C2: ROLE INPUT_OBJECT=E2 @A1 | SUPPORTED: I/bf:f65e973c23718740725a, A/bf:eac24d0ca8a427edc53a | C2：I users.csv。 |
| Q15-F04 | optional.md可选生成，非必交；如O保留必须PERMITTED | SUPPORTED: A2: 生成 PERMITTED; C3: ROLE RESULT=E3 @A2 | SUPPORTED: A2: 生成 PERMITTED; C3: ROLE RESULT=E3 @A2 | SUPPORTED: O/bf:b9f852fc789814bb71e4, A/bf:af489118c46903a0c184 | A2, C3：optional在O标PERMITTED，未变必交。 |
| Q15-F05 | 交付optional.md不要求，不是禁止 | SUPPORTED: A3: 交付 NOT_REQUIRED; C4: ROLE OBJECT=E3 @A3 | SUPPORTED: A3: 交付 NOT_REQUIRED; C4: ROLE OBJECT=E3 @A3 | ERROR:  | A3, C4：JSON NOT_REQUIRED交付明确绑定optional；中文却仅“无需 交付”，省略文件身份。 |
| Q15-F06 | 不增加生成/交付义务或额外交付许可 | SUPPORTED: A1: 核对 REQUIRED; A2: 生成 PERMITTED; A3: 交付 NOT_REQUIRED | SUPPORTED: A1: 核对 REQUIRED; A2: 生成 PERMITTED; A3: 交付 NOT_REQUIRED | SUPPORTED: I/bf:f65e973c23718740725a, O/bf:b9f852fc789814bb71e4, A/bf:eac24d0ca8a427edc53a, A/bf:af489118c46903a0c184, P/bf:606e49e7415987041d2e | A1, A2, A3：无生成/交付义务，也没有交付许可/禁止；主体遗漏另记F02。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q16

请PM核对users.csv；不得生成optional.md。

首尾候选与JSON/中文正确；与Q15/Q17模态区别成立。

原始完整证据：[Trace](runs/first/Q16/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q16-F01 | PM / 核对 / users.csv / REQUIRED | SUPPORTED: evt_check: 核对 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: evt_check: 核对 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: I/bf:d44a35cf80e6d193c01a, A/bf:01be1f424ef483052e8e, P/bf:84b5de6d5c66e8e6a5d8 | evt_check, cl_check_performer, cl_check_input：PM核对users.csv。 |
| Q16-F02 | users.csv | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: I/bf:d44a35cf80e6d193c01a, A/bf:01be1f424ef483052e8e | cl_check_input：I users.csv。 |
| Q16-F03 | 禁止生成optional.md | SUPPORTED: evt_generate: 生成 FORBIDDEN; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED: evt_generate: 生成 FORBIDDEN; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED: B/bf:3e86e3d9b3ab5f79d386 | evt_generate, cl_generate_performer, cl_generate_result：FORBIDDEN生成optional.md，主体延续PM，产物只是禁止对象。 |
| Q16-F04 | optional.md不进入正向生成义务或必交O | SUPPORTED: evt_generate: 生成 FORBIDDEN; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED: evt_generate: 生成 FORBIDDEN; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED: B/bf:3e86e3d9b3ab5f79d386 | evt_generate, cl_generate_result：O空、A只有核对；禁止生成不会产生正向O。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q17

请PM核对users.csv；无需生成optional.md。

首尾候选正确保留不要求生成的目标文件；最终中文完全丢optional.md，最终交付不完整。NOT_REQUIRED开放执行者没有污染核对职责。

原始完整证据：[Trace](runs/first/Q17/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q17-F01 | PM / 核对 / users.csv / REQUIRED | SUPPORTED: evt_check: 核对 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: evt_check: 核对 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @evt_check; cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: I/bf:ebfb65013962a4108253, A/bf:bc5ffb69314bd4f4f9ef, P/bf:16adaede1a95e961b18d | evt_check, cl_check_performer, cl_check_input：PM核对users.csv。 |
| Q17-F02 | users.csv | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: cl_check_input: ROLE INPUT_OBJECT=ent_users @evt_check | SUPPORTED: I/bf:ebfb65013962a4108253, A/bf:bc5ffb69314bd4f4f9ef | cl_check_input：I users.csv。 |
| Q17-F03 | 无需生成optional.md，必须在非义务结构/记录保留 | SUPPORTED: evt_generate: 生成 NOT_REQUIRED; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED: evt_generate: 生成 NOT_REQUIRED; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | ERROR:  | evt_generate, cl_generate_result：JSON retained保留NOT_REQUIRED生成optional.md；但中文只“无需 生成”，全文不含optional.md，丢免除的产物目标。 |
| Q17-F04 | 不产生O义务 | SUPPORTED: evt_generate: 生成 NOT_REQUIRED; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED: evt_generate: 生成 NOT_REQUIRED; cl_generate_result: ROLE RESULT=ent_optional @evt_generate | SUPPORTED:  | evt_generate, cl_generate_result：O空，NOT_REQUIRED没有生成义务。 |
| Q17-F05 | 无需不变FORBIDDEN/PERMITTED/REQUIRED | SUPPORTED: evt_generate: 生成 NOT_REQUIRED | SUPPORTED: evt_generate: 生成 NOT_REQUIRED | SUPPORTED:  | evt_generate：没有PERMITTED/FORBIDDEN/REQUIRED转换；无需的执行者细节不产生正向职责或真实指代竞争。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q18

请PM对a.ini与b.ini逐一核对；不得修改b.ini。

首尾候选与JSON/中文一致，局部禁止范围未扩展或反推出许可。

原始完整证据：[Trace](runs/first/Q18/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q18-F01 | PM / 核对 / a.ini与b.ini / REQUIRED | SUPPORTED: A1: 核对 REQUIRED; C1: ROLE PERFORMER=E1 @A1; C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1; C4: SCOPE @A1; X1: STATE | SUPPORTED: A1: 核对 REQUIRED; C1: ROLE PERFORMER=E1 @A1; C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1; C4: SCOPE @A1; X1: STATE | SUPPORTED: I/bf:515495f83905945ec0e4, I/bf:e61df9299f0405acbc3b, I/bf:f1ba859b2f08f8901901, A/bf:a3c814c257f2329e8916, P/bf:7882deb310cfb4d393f7 | A1, C1, C2, C3, C4, X1：PM逐一核对a.ini和b.ini，两个INPUT加逐一SCOPE。 |
| Q18-F02 | 两个文件逐一核对，可拆事件或集合 | SUPPORTED: C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1; C4: SCOPE @A1 | SUPPORTED: C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1; C4: SCOPE @A1 | SUPPORTED: I/bf:515495f83905945ec0e4, I/bf:e61df9299f0405acbc3b, I/bf:f1ba859b2f08f8901901, A/bf:a3c814c257f2329e8916 | C2, C3, C4：I有两个文件，分配式逐一语义保留，不要求两个事件ID。 |
| Q18-F03 | 只禁止修改b.ini | SUPPORTED: A2: 修改 FORBIDDEN; C5: ROLE OBJECT=E3 @A2; C6: ROLE PERFORMER=E1 @A2 | SUPPORTED: A2: 修改 FORBIDDEN; C5: ROLE OBJECT=E3 @A2; C6: ROLE PERFORMER=E1 @A2 | SUPPORTED: B/bf:806fe26199e3e2908f15 | A2, C5, C6：B仅修改b.ini，主体PM；未扩大到a.ini。 |
| Q18-F04 | 不禁止修改a.ini，不授权修改a.ini；逐一不是资源次数 | SUPPORTED: A1: 核对 REQUIRED; A2: 修改 FORBIDDEN | SUPPORTED: A1: 核对 REQUIRED; A2: 修改 FORBIDDEN | SUPPORTED: I/bf:515495f83905945ec0e4, I/bf:e61df9299f0405acbc3b, I/bf:f1ba859b2f08f8901901, A/bf:a3c814c257f2329e8916, P/bf:7882deb310cfb4d393f7, B/bf:806fe26199e3e2908f15 | A1, A2：没有a.ini修改许可或禁止，没有执行次数R。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q19

仅当本次报告通过QA复核时，允许PM向ADMIN提交check.md。

首候选已明确写“未将其与本次报告合并”；审阅全SUPPORT且无遗漏；最终O/A/P均RESOLVED。程序保真传递了错误的身份分离，不是技术校验替代语义修复。

原始完整证据：[Trace](runs/first/Q19/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q19-F01 | PM / 提交 / check.md / PERMITTED | SUPPORTED: ev_submit: 提交 PERMITTED; cl_submit_performer: ROLE PERFORMER=ent_pm @ev_submit; cl_submit_object: ROLE OBJECT=ent_file @ev_submit; cl_submit_result: ROLE RESULT=ent_file @ev_submit | SUPPORTED: ev_submit: 提交 PERMITTED; cl_submit_performer: ROLE PERFORMER=ent_pm @ev_submit; cl_submit_object: ROLE OBJECT=ent_file @ev_submit; cl_submit_result: ROLE RESULT=ent_file @ev_submit | SUPPORTED: O/bf:aaaf3f3828a5268a08f6, A/bf:45ff1f121027da8f790d, P/bf:728d61d2a5a888743f1a, P/bf:e342722879af12056e17 | ev_submit, cl_submit_performer, cl_submit_object, cl_submit_result：PM获准提交check.md；交付RESULT为许可，不新增生成义务。 |
| Q19-F02 | ADMIN | SUPPORTED: cl_submit_recipient: ROLE RECIPIENT=ent_admin @ev_submit | SUPPORTED: cl_submit_recipient: ROLE RECIPIENT=ent_admin @ev_submit | SUPPORTED: A/bf:45ff1f121027da8f790d, P/bf:e342722879af12056e17 | cl_submit_recipient：ADMIN接收。 |
| Q19-F03 | 本次check.md通过QA复核为提交许可NECESSARY；时序可AFTER，未知观测 | ERROR: cl_review_object: ROLE OBJECT=ent_report @ev_review_pass; cl_submit_object: ROLE OBJECT=ent_file @ev_submit; cl_submit_condition: CONDITION NECESSARY @ev_submit; expr_review_pass: STATE | ERROR: cl_review_object: ROLE OBJECT=ent_report @ev_review_pass; cl_submit_object: ROLE OBJECT=ent_file @ev_submit; cl_submit_condition: CONDITION NECESSARY @ev_submit; expr_review_pass: STATE | ERROR: O/bf:aaaf3f3828a5268a08f6, A/bf:45ff1f121027da8f790d, P/bf:56688fd25c033aba657b, P/bf:728d61d2a5a888743f1a, P/bf:e342722879af12056e17 | cl_submit_condition, expr_review_pass, cl_review_object, cl_submit_object：NECESSARY方向正确、状态未知，但前提对象ent_report与提交对象ent_file分离且无身份链接；不能证明是check.md通过QA复核。 |
| Q19-F04 | 本次报告与check.md同一对象 | ERROR: ent_report: 本次报告; ent_file: check.md; cl_review_object: ROLE OBJECT=ent_report @ev_review_pass; cl_submit_object: ROLE OBJECT=ent_file @ev_submit | ERROR: ent_report: 本次报告; ent_file: check.md; cl_review_object: ROLE OBJECT=ent_report @ev_review_pass; cl_submit_object: ROLE OBJECT=ent_file @ev_submit | ERROR: O/bf:aaaf3f3828a5268a08f6, A/bf:45ff1f121027da8f790d | ent_report, ent_file, cl_review_object, cl_submit_object：唯一报告指称未与check.md关联，原文“本次报告”与该提交文件的同一身份丢失。 |
| Q19-F05 | 不新增QA复核义务；不因必要前提改充分许可 | SUPPORTED: ev_review_pass: 复核通过 UNSTATED; ev_submit: 提交 PERMITTED; cl_reviewer: ROLE REVIEWER=ent_qa @ev_review_pass | SUPPORTED: ev_review_pass: 复核通过 UNSTATED; ev_submit: 提交 PERMITTED; cl_reviewer: ROLE REVIEWER=ent_qa @ev_review_pass | SUPPORTED: O/bf:aaaf3f3828a5268a08f6, A/bf:45ff1f121027da8f790d, P/bf:56688fd25c033aba657b, P/bf:728d61d2a5a888743f1a, P/bf:e342722879af12056e17 | ev_review_pass, ev_submit, cl_reviewer：QA仅条件复核引用，没有独立复核义务，必要方向未变充分。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q20

若发现服务异常，OPS-01必须通知PM；无论是否发现异常，OPS-01都必须生成health.md。

首尾候选及JSON/中文完整保留条件局部性与无条件产物；本案后续两次真实重复仍须独立审阅。

原始完整证据：[Trace](runs/first/Q20/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q20-F01 | OPS-01 / 通知 / PM / REQUIRED | SUPPORTED: evt_notify: 通知 REQUIRED; cl_notify_performer: ROLE PERFORMER=ent_ops @evt_notify; cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: evt_notify: 通知 REQUIRED; cl_notify_performer: ROLE PERFORMER=ent_ops @evt_notify; cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: A/bf:ffa453c97b24d8d929b0, P/bf:1681bc20aa1a346aa364, P/bf:3d8a97006c167574086a | evt_notify, cl_notify_performer, cl_notify_recipient：OPS-01必须通知PM，受异常充分触发。 |
| Q20-F02 | OPS-01 / 生成 / health.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: O/bf:f76f02c9223476068c40, A/bf:7f7aa81fa35cdd5a9ae1, P/bf:7e2ca17caee1ecf1e6d8 | evt_generate, cl_generate_performer, cl_generate_result：OPS-01必须生成health.md。 |
| Q20-F03 | PM仅是通知接收者 | SUPPORTED: cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: A/bf:ffa453c97b24d8d929b0, P/bf:3d8a97006c167574086a | cl_notify_recipient：PM是通知接收者，不是发现/检查执行者。 |
| Q20-F04 | 发现服务异常SUFFICIENT触发通知义务 | SUPPORTED: cl_notify_condition: CONDITION SUFFICIENT @evt_notify; expr_discovered: STATE | SUPPORTED: cl_notify_condition: CONDITION SUFFICIENT @evt_notify; expr_discovered: STATE | SUPPORTED: A/bf:ffa453c97b24d8d929b0, P/bf:1681bc20aa1a346aa364, P/bf:3d8a97006c167574086a | cl_notify_condition, expr_discovered：发现服务异常SUFFICIENT只触发通知。 |
| Q20-F05 | health.md生成在异常/非异常都要求；无条件或显式恒真等价 | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: O/bf:f76f02c9223476068c40, A/bf:7f7aa81fa35cdd5a9ae1, P/bf:7e2ca17caee1ecf1e6d8 | evt_generate, cl_generate_result：生成约束为空，异常/非异常均要求；没有继承通知条件。 |
| Q20-F06 | health.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: O/bf:f76f02c9223476068c40, A/bf:7f7aa81fa35cdd5a9ae1 | cl_generate_result：health.md O REQUIRED。 |
| Q20-F07 | 不新增检查义务，不宣布异常已发生 | SUPPORTED: evt_discovered: 发现服务异常 UNSTATED; cl_discovered_object: ROLE OBJECT=ent_service @evt_discovered; expr_discovered: STATE | SUPPORTED: evt_discovered: 发现服务异常 UNSTATED; cl_discovered_object: ROLE OBJECT=ent_service @evt_discovered; expr_discovered: STATE | SUPPORTED:  | evt_discovered, cl_discovered_object, expr_discovered：STATE/CONDITION/MentionOnly保持未知状态，无新增监测/检查义务或已发现事实。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q21

允许PM发布本次report.md，但必须等QA和OPS-01都批准后；任何一项批准尚未取得时，不得发布。

首尾候选与JSON/中文均保留AND许可、OR禁止、同一对象及先后；发布现有报告的OBJECT用途没有凭空生成文件。

原始完整证据：[Trace](runs/first/Q21/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q21-F01 | PM / 发布 / report.md / PERMITTED | SUPPORTED: ev_publish_permitted: 发布 PERMITTED; cl_publish_performer: ROLE PERFORMER=ent_pm @ev_publish_permitted; cl_publish_object: ROLE OBJECT=ent_report @ev_publish_permitted | SUPPORTED: ev_publish_permitted: 发布 PERMITTED; cl_publish_performer: ROLE PERFORMER=ent_pm @ev_publish_permitted; cl_publish_object: ROLE OBJECT=ent_report @ev_publish_permitted | SUPPORTED: A/bf:706e1bf47615dcb5120d, P/bf:443e03a1e766590a3671 | ev_publish_permitted, cl_publish_performer, cl_publish_object：PM被允许发布本次report.md，没有发布义务或生成义务。 |
| Q21-F02 | QA与OPS-01都批准为AND NECESSARY且早于发布；状态均未知 | SUPPORTED: cl_permission_condition: CONDITION NECESSARY AFTER @ev_publish_permitted; ex_qa_approved: STATE; ex_ops_approved: STATE; ex_both_approved: AND | SUPPORTED: cl_permission_condition: CONDITION NECESSARY AFTER @ev_publish_permitted; ex_qa_approved: STATE; ex_ops_approved: STATE; ex_both_approved: AND | SUPPORTED: A/bf:706e1bf47615dcb5120d, P/bf:443e03a1e766590a3671, P/bf:f2faca1e39856bd66cfc, P/bf:21d323407cbb098df648 | cl_permission_condition, ex_both_approved, ex_qa_approved, ex_ops_approved：NECESSARY+AFTER，AND要求QA和OPS两项批准均取得，状态未知。 |
| Q21-F03 | 任一批准未取得SUFFICIENT触发禁止发布同一report.md | SUPPORTED: ev_publish_forbidden: 发布 FORBIDDEN; cl_forbidden_performer: ROLE PERFORMER=ent_pm @ev_publish_forbidden; cl_forbidden_object: ROLE OBJECT=ent_report @ev_publish_forbidden; cl_prohibition_condition: CONDITION SUFFICIENT @ev_publish_forbidden; ex_qa_missing: STATE; ex_ops_missing: STATE; ex_any_missing: OR | SUPPORTED: ev_publish_forbidden: 发布 FORBIDDEN; cl_forbidden_performer: ROLE PERFORMER=ent_pm @ev_publish_forbidden; cl_forbidden_object: ROLE OBJECT=ent_report @ev_publish_forbidden; cl_prohibition_condition: CONDITION SUFFICIENT @ev_publish_forbidden; ex_qa_missing: STATE; ex_ops_missing: STATE; ex_any_missing: OR | SUPPORTED: P/bf:f2faca1e39856bd66cfc, P/bf:21d323407cbb098df648, B/bf:f74afc2984f65a9b7af3 | ev_publish_forbidden, cl_forbidden_object, cl_forbidden_performer, cl_prohibition_condition, ex_any_missing, ex_qa_missing, ex_ops_missing：同一报告/PM禁止发布；OR任一未批准SUFFICIENT触发，未误缩成两个都未批准。 |
| Q21-F04 | 无独立批准义务；不能OR许可、必要方向用于禁止或无条件发布 | SUPPORTED: ev_qa_approval: 批准 UNSTATED; ev_ops_approval: 批准 UNSTATED; cl_qa_approver: ROLE APPROVER=ent_qa @ev_qa_approval; cl_ops_approver: ROLE APPROVER=ent_ops @ev_ops_approval | SUPPORTED: ev_qa_approval: 批准 UNSTATED; ev_ops_approval: 批准 UNSTATED; cl_qa_approver: ROLE APPROVER=ent_qa @ev_qa_approval; cl_ops_approver: ROLE APPROVER=ent_ops @ev_ops_approval | SUPPORTED: P/bf:f2faca1e39856bd66cfc, P/bf:21d323407cbb098df648 | ev_qa_approval, ev_ops_approval, cl_qa_approver, cl_ops_approver：批准引用MENTION_ONLY/UNSTATED，无独立批准义务；没有OR许可或无条件发布。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q22

PM必须提交handover.md；只有ADMIN确认已收到该文件，本任务才可标记为完成。

冻结账本中提交及完成事实全部表达。O却ABSENT：源文明确交付现有文件，v0.4表O写产生、同文示例又把提交列为OBJECT；预先账本未单列O，不能看结果后增补并直接判错，留独立合同/视图待审。

原始完整证据：[Trace](runs/first/Q22/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q22-F01 | PM / 提交 / handover.md / REQUIRED | SUPPORTED: e1: 提交 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE OBJECT=n3 @e1 | SUPPORTED: e1: 提交 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE OBJECT=n3 @e1 | SUPPORTED: A/bf:44e954a0207c00f8d7de, P/bf:0cb71eef4946ce9cb380 | e1, c1, c2：PM必须提交handover.md，OBJECT身份正确。 |
| Q22-F02 | ADMIN确认已收到同一handover.md为根任务完成NECESSARY；不擅改充分触发 | SUPPORTED: e2: 确认已收到文件 UNSTATED; c4: ROLE OBJECT=n3 @e2; c6: COMPLETION NECESSARY @ROOT; x1: STATE | SUPPORTED: e2: 确认已收到文件 UNSTATED; c4: ROLE OBJECT=n3 @e2; c6: COMPLETION NECESSARY @ROOT; x1: STATE | SUPPORTED: P/bf:f9b5a5e1dbd5d0af5654, C/bf:f364ac68cbecd9453335 | c6, x1, e2, c4：根任务COMPLETION为NECESSARY，ADMIN确认已收到同一handover；没有改充分。 |
| Q22-F03 | ADMIN为确认收到主体，参与上下文不新增确认义务 | SUPPORTED: e2: 确认已收到文件 UNSTATED; c3: ROLE PERFORMER=n2 @e2; c4: ROLE OBJECT=n3 @e2 | SUPPORTED: e2: 确认已收到文件 UNSTATED; c3: ROLE PERFORMER=n2 @e2; c4: ROLE OBJECT=n3 @e2 | SUPPORTED: P/bf:f9b5a5e1dbd5d0af5654 | e2, c3, c4：ADMIN仅条件中确认主体，无独立确认义务。 |
| Q22-F04 | 提交接收角色可由同文件连续语境表达，但不得创造确认动作义务 | SUPPORTED: e1: 提交 REQUIRED; e2: 确认已收到文件 UNSTATED; e3: 标记任务完成 PERMITTED; c5: CONDITION NECESSARY @e3; c6: COMPLETION NECESSARY @ROOT | SUPPORTED: e1: 提交 REQUIRED; e2: 确认已收到文件 UNSTATED; e3: 标记任务完成 PERMITTED; c5: CONDITION NECESSARY @e3; c6: COMPLETION NECESSARY @ROOT | SUPPORTED: A/bf:44e954a0207c00f8d7de, A/bf:0aaa32d1e5cb39ae6704, P/bf:0cb71eef4946ce9cb380, P/bf:f9b5a5e1dbd5d0af5654, C/bf:f364ac68cbecd9453335 | e1, e2, e3, c5, c6：源文未直接指定提交收件方或完成标记者，保留开放细节；没有确认动作义务。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q23

PM必须提交handover.md；ADMIN确认已收到该文件即表示本任务完成。

第一个发生产品内显式修订的案例，4次调用。首次审阅质疑c2的INPUT_OBJECT用途，第二次解析改OBJECT，仍保留SUFFICIENT完成。最终O缺失问题与Q22相同，不能用预期事后增补直接判错。

原始完整证据：[Trace](runs/first/Q23/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q23-F01 | PM / 提交 / handover.md / REQUIRED | SUPPORTED: e1: 提交 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE INPUT_OBJECT=n2 @e1 | SUPPORTED: e1: 提交 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE OBJECT=n2 @e1 | SUPPORTED: A/bf:edc4fa693fd0a37af6ea, P/bf:d2ae88c80aa66500f32e | e1, c1, c2：PM必须提交handover.md；首次c2错误增加INPUT_OBJECT用途，产品修订改为普通OBJECT。动作、主体、文件身份本身齐全。 |
| Q23-F02 | ADMIN确认已收到同一handover.md SUFFICIENT触发根任务完成；不改唯一/必要条件 | SUPPORTED: e2: 确认已收到 UNSTATED; c4: ROLE OBJECT=n2 @e2; c5: COMPLETION SUFFICIENT @ROOT; x1: STATE | SUPPORTED: e2: 确认已收到 UNSTATED; c4: ROLE OBJECT=n2 @e2; c5: COMPLETION SUFFICIENT @ROOT; x1: STATE | SUPPORTED: C/bf:d2de93ac7f1a99240b74 | c5, x1, e2, c4：COMPLETION/SUFFICIENT/ROOT，确认已收到同一文件即触发完成，未变必要/唯一条件。 |
| Q23-F03 | ADMIN为确认收到主体，参与上下文不新增确认义务 | SUPPORTED: e2: 确认已收到 UNSTATED; c3: ROLE PERFORMER=n3 @e2; c4: ROLE OBJECT=n2 @e2 | SUPPORTED: e2: 确认已收到 UNSTATED; c3: ROLE PERFORMER=n3 @e2; c4: ROLE OBJECT=n2 @e2 | SUPPORTED:  | e2, c3, c4：ADMIN为确认收到主体，CONDITION/MentionOnly，无当前确认义务；最终C内仍含ADMIN角色语境。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q24

请QA完成配置核验，核验用时不得超过6分钟。若出现权限错误，停止本任务。

核验耗时、充分停止与根作用域在首尾候选、JSON和中文一致；不以时限代替成功完成。

原始完整证据：[Trace](runs/first/Q24/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q24-F01 | QA / 核验 / 配置 / REQUIRED | SUPPORTED: evt_verify: 核验配置 REQUIRED; cl_verify_performer: ROLE PERFORMER=ent_qa @evt_verify; cl_verify_input: ROLE INPUT_OBJECT=ent_config @evt_verify | SUPPORTED: evt_verify: 核验配置 REQUIRED; cl_verify_performer: ROLE PERFORMER=ent_qa @evt_verify; cl_verify_input: ROLE INPUT_OBJECT=ent_config @evt_verify | SUPPORTED: I/bf:19818d3d3b392d315265, A/bf:e107ad42cae3000b45a9, P/bf:bf5fc83c122ba53fd7f7, R/bf:03f5cd9bab5f4c765e7c | evt_verify, cl_verify_performer, cl_verify_input：QA必须核验配置。 |
| Q24-F02 | 配置核验范围 | SUPPORTED: cl_verify_input: ROLE INPUT_OBJECT=ent_config @evt_verify | SUPPORTED: cl_verify_input: ROLE INPUT_OBJECT=ent_config @evt_verify | SUPPORTED: I/bf:19818d3d3b392d315265, A/bf:e107ad42cae3000b45a9 | cl_verify_input：配置受检范围进入I。 |
| Q24-F03 | 核验耗时<=6分钟，EXECUTION_LIMIT绑定核验而不是停止/ROOT完成 | SUPPORTED: cl_time: QUANTITY @evt_verify | SUPPORTED: cl_time: QUANTITY @evt_verify | SUPPORTED: I/bf:19818d3d3b392d315265, A/bf:e107ad42cae3000b45a9, P/bf:bf5fc83c122ba53fd7f7, R/bf:03f5cd9bab5f4c765e7c | cl_time：LTE 6分钟/EXECUTION_LIMIT，target与scope均为核验事件；不绑定停止或完成。 |
| Q24-F04 | 权限错误SUFFICIENT触发根任务停止 | SUPPORTED: evt_error: 出现权限错误 UNSTATED; evt_stop: 停止本任务 REQUIRED; cl_stop_condition: CONDITION SUFFICIENT @evt_stop; cl_root_stop: STOP SUFFICIENT @ROOT; expr_error: STATE | SUPPORTED: evt_error: 出现权限错误 UNSTATED; evt_stop: 停止本任务 REQUIRED; cl_stop_condition: CONDITION SUFFICIENT @evt_stop; cl_root_stop: STOP SUFFICIENT @ROOT; expr_error: STATE | SUPPORTED: A/bf:f44dca7ddff44d295788, P/bf:e661f2171ec46422cd1c, C/bf:aab8dddca7b9318df234 | evt_error, evt_stop, cl_stop_condition, cl_root_stop, expr_error：权限错误STATE未知，SUFFICIENT触发停止；根STOP保留，QA由唯一当前执行主体继承。 |
| Q24-F05 | 没有成功完成条件，不把6分钟当C | SUPPORTED: cl_time: QUANTITY @evt_verify; cl_root_stop: STOP SUFFICIENT @ROOT | SUPPORTED: cl_time: QUANTITY @evt_verify; cl_root_stop: STOP SUFFICIENT @ROOT | SUPPORTED: I/bf:19818d3d3b392d315265, A/bf:e107ad42cae3000b45a9, P/bf:bf5fc83c122ba53fd7f7, R/bf:03f5cd9bab5f4c765e7c, C/bf:aab8dddca7b9318df234 | cl_time, cl_root_stop：期限只在R；C仅权限错误停止，无成功完成条件或已发生错误。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q25

请PM读取feed.json，该读取最多重试4次；生成feed-note.md，报告恰好列出2条异常记录。

首轮数量算子、单位、目标、count_scope和投影视图均符合原文；后续两次重复仍单独审。

原始完整证据：[Trace](runs/first/Q25/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q25-F01 | PM / 读取 / feed.json / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: I/bf:b9abfcf9d1216641e029, A/bf:8c002e69d27161a81328, P/bf:b290ff06c70a9eab0493, R/bf:d2a7d6e7114bff55e1c0 | evt_read, cl_read_performer, cl_read_input：PM必须读取feed.json。 |
| Q25-F02 | PM / 生成 / feed-note.md / REQUIRED | SUPPORTED: evt_generate: 生成报告 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: evt_generate: 生成报告 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: O/bf:82f97ae4532eb81ff361, A/bf:d032fd91001266d97e9c, P/bf:607bbd0c6f4548f504d7 | evt_generate, cl_generate_performer, cl_generate_result：同一当前任务PM继承为报告生成者，必须生成feed-note.md。 |
| Q25-F03 | feed.json | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: I/bf:b9abfcf9d1216641e029, A/bf:8c002e69d27161a81328 | cl_read_input：feed.json外部读取用途进入I。 |
| Q25-F04 | feed-note.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: O/bf:82f97ae4532eb81ff361, A/bf:d032fd91001266d97e9c | cl_generate_result：feed-note.md RESULT/O，带内容数量。 |
| Q25-F05 | 读取重试次数<=4次，EXECUTION_LIMIT，仅读取，不包括最初执行 | SUPPORTED: cl_retry_limit: QUANTITY @evt_read | SUPPORTED: cl_retry_limit: QUANTITY @evt_read | SUPPORTED: I/bf:b9abfcf9d1216641e029, A/bf:8c002e69d27161a81328, P/bf:b290ff06c70a9eab0493, R/bf:d2a7d6e7114bff55e1c0 | cl_retry_limit：LTE4次/读取重试次数/EXECUTION_LIMIT，仅evt_read；重试概念不包含最初执行。 |
| Q25-F06 | 报告恰好2条异常记录，EQ/OUTPUT_CONTENT目标feed-note.md，挂O不进R | SUPPORTED: cl_output_count: QUANTITY @evt_generate | SUPPORTED: cl_output_count: QUANTITY @evt_generate | SUPPORTED: O/bf:82f97ae4532eb81ff361, A/bf:d032fd91001266d97e9c, P/bf:607bbd0c6f4548f504d7 | cl_output_count：EQ2条/OUTPUT_CONTENT，target和count_scope=报告，scope=生成；挂O不进入R。 |
| Q25-F07 | 不把2条当观测值、读取限制或重试次数 | SUPPORTED: cl_retry_limit: QUANTITY @evt_read; cl_output_count: QUANTITY @evt_generate | SUPPORTED: cl_retry_limit: QUANTITY @evt_read; cl_output_count: QUANTITY @evt_generate | SUPPORTED: I/bf:b9abfcf9d1216641e029, O/bf:82f97ae4532eb81ff361, A/bf:8c002e69d27161a81328, A/bf:d032fd91001266d97e9c, P/bf:b290ff06c70a9eab0493, P/bf:607bbd0c6f4548f504d7, R/bf:d2a7d6e7114bff55e1c0 | cl_output_count, cl_retry_limit：两个独立数量没有互换、没有断言现实已发现两条异常。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q26

请PM检查A、B、C、D四台测试机，本次检查范围不含B和D；不得重启任何测试机。

检查差集与全称禁止分别作用于两个事件；未知禁止执行者不影响明确禁止，未补造对A的修改许可。

原始完整证据：[Trace](runs/first/Q26/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q26-F01 | PM / 检查 / A/C两台测试机的有效范围 / REQUIRED | SUPPORTED: e_check: 检查 REQUIRED; c_performer: ROLE PERFORMER=n_pm @e_check; c_input_a: ROLE INPUT_OBJECT=n_a @e_check; c_input_c: ROLE INPUT_OBJECT=n_c @e_check | SUPPORTED: e_check: 检查 REQUIRED; c_performer: ROLE PERFORMER=n_pm @e_check; c_input_a: ROLE INPUT_OBJECT=n_a @e_check; c_input_c: ROLE INPUT_OBJECT=n_c @e_check | SUPPORTED: I/bf:4cd732b0c3367966638a, I/bf:8f840667d5954e94d77e, I/bf:32866a65ee37677b949a, A/bf:3989ff9c733358901adb, P/bf:c123827aec559036b0de | e_check, c_performer, c_input_a, c_input_c：PM检查的有效对象是A/C，输入论元没有B/D。 |
| Q26-F02 | 明确原集合A/B/C/D排除B/D；有效A/C；可等价集合 | SUPPORTED: c_check_scope: SCOPE @e_check; x_listed: UNION; x_excluded: UNION; x_check_scope: EXCEPT | SUPPORTED: c_check_scope: SCOPE @e_check; x_listed: UNION; x_excluded: UNION; x_check_scope: EXCEPT | SUPPORTED: I/bf:32866a65ee37677b949a | c_check_scope, x_check_scope, x_listed, x_excluded：EXCEPT(UNION(A,B,C,D),UNION(B,D))保留原集合与排除。 |
| Q26-F03 | 禁止重启任何测试机，不缩为A/C | SUPPORTED: e_restart: 重启 FORBIDDEN; c_restart_object: ROLE OBJECT=n_all @e_restart; c_restart_scope: SCOPE @e_restart; x_all: ITEM | SUPPORTED: e_restart: 重启 FORBIDDEN; c_restart_object: ROLE OBJECT=n_all @e_restart; c_restart_scope: SCOPE @e_restart; x_all: ITEM | SUPPORTED: B/bf:38a55510850b48d1e022, B/bf:08e81120e1aced518360 | e_restart, c_restart_object, c_restart_scope, x_all：FORBIDDEN重启任何测试机；禁止范围没有缩至A/C。 |
| Q26-F04 | 四台是原集合数量，不是执行资源次数 | SUPPORTED: c_check_scope: SCOPE @e_check; x_listed: UNION | SUPPORTED: c_check_scope: SCOPE @e_check; x_listed: UNION | SUPPORTED: I/bf:32866a65ee37677b949a | x_listed, c_check_scope：四台仅列举集合，没有QUANTITY或R次数。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q27

请PM生成howto.md，只在文中写入“可以停用worker服务”。本次不得停用worker服务。

候选、JSON及中文区分内容层许可与当前层禁止，没有把引文转换成执行授权。

原始完整证据：[Trace](runs/first/Q27/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q27-F01 | PM / 生成 / howto.md / REQUIRED | SUPPORTED: ev_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @ev_generate; cl_generate_result: ROLE RESULT=ent_file @ev_generate | SUPPORTED: ev_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @ev_generate; cl_generate_result: ROLE RESULT=ent_file @ev_generate | SUPPORTED: O/bf:769c2d807fc3ea78cc8a, A/bf:d948d1235e7d08f034af, P/bf:7b7b2f467aa1ca29b9ad | ev_generate, cl_generate_performer, cl_generate_result：PM必须生成howto.md。 |
| Q27-F02 | PM / 写入 / 引文内容 / REQUIRED | SUPPORTED: ev_write: 写入 REQUIRED; cl_write_performer: ROLE PERFORMER=ent_pm @ev_write; cl_write_object: ROLE OBJECT=ent_file @ev_write; cl_write_content: ROLE CONTENT=ent_content @ev_write | SUPPORTED: ev_write: 写入 REQUIRED; cl_write_performer: ROLE PERFORMER=ent_pm @ev_write; cl_write_object: ROLE OBJECT=ent_file @ev_write; cl_write_content: ROLE CONTENT=ent_content @ev_write | SUPPORTED: I/bf:7a20ee18347242764362, A/bf:33ef29d78f09b98dc9ea, P/bf:e38969658c023e38a524 | ev_write, cl_write_performer, cl_write_object, cl_write_content：PM必须在同一内部产物howto中写入引文；文件没有误作为外部I对象。 |
| Q27-F03 | howto.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_file @ev_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_file @ev_generate | SUPPORTED: O/bf:769c2d807fc3ea78cc8a, A/bf:d948d1235e7d08f034af | cl_generate_result：howto.md明确O。 |
| Q27-F04 | 引文可以停用worker服务仅文中内容，范围只在文中 | SUPPORTED: ev_quoted_disable: 停用 PERMITTED; cl_write_scope: SCOPE @ev_write; cl_quoted_object: ROLE OBJECT=ent_worker @ev_quoted_disable; expr_content: ITEM | SUPPORTED: ev_quoted_disable: 停用 PERMITTED; cl_write_scope: SCOPE @ev_write; cl_quoted_object: ROLE OBJECT=ent_worker @ev_quoted_disable; expr_content: ITEM | SUPPORTED: I/bf:7a20ee18347242764362 | cl_write_scope, expr_content, ev_quoted_disable, cl_quoted_object：内容范围保留；引文事件QUOTED/MENTION_ONLY，owner=写入。 |
| Q27-F05 | 本次禁止停用worker服务 | SUPPORTED: ev_forbidden_disable: 停用 FORBIDDEN; cl_forbidden_object: ROLE OBJECT=ent_worker @ev_forbidden_disable; cl_forbidden_scope: SCOPE @ev_forbidden_disable; expr_task: STATE | SUPPORTED: ev_forbidden_disable: 停用 FORBIDDEN; cl_forbidden_object: ROLE OBJECT=ent_worker @ev_forbidden_disable; cl_forbidden_scope: SCOPE @ev_forbidden_disable; expr_task: STATE | SUPPORTED: B/bf:62016f496ef02e348257, B/bf:ae1a521c4c9344d55036 | ev_forbidden_disable, cl_forbidden_object, cl_forbidden_scope, expr_task：本次FORBIDDEN停用worker，独立根任务范围。 |
| Q27-F06 | 引文许可不成为当前PERMITTED停用 | SUPPORTED: ev_quoted_disable: 停用 PERMITTED; ev_forbidden_disable: 停用 FORBIDDEN | SUPPORTED: ev_quoted_disable: 停用 PERMITTED; ev_forbidden_disable: 停用 FORBIDDEN | SUPPORTED: B/bf:62016f496ef02e348257, B/bf:ae1a521c4c9344d55036 | ev_quoted_disable, ev_forbidden_disable：PERMITTED只在引文内部，未进入当前A许可；当前禁止完整。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q28

请PM检查已归档日志的完整性，并生成archive-check.md。不得归档新日志。

首尾候选和最终结果保留对象定语及独立禁止；PM类别待细化只影响type，不影响明确主体。

原始完整证据：[Trace](runs/first/Q28/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q28-F01 | PM / 检查 / 已归档日志的完整性 / REQUIRED | SUPPORTED: ev_check: 检查完整性 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @ev_check; cl_check_input: ROLE INPUT_OBJECT=ent_archived_logs @ev_check | SUPPORTED: ev_check: 检查完整性 REQUIRED; cl_check_performer: ROLE PERFORMER=ent_pm @ev_check; cl_check_input: ROLE INPUT_OBJECT=ent_archived_logs @ev_check | SUPPORTED: I/bf:0f240820eaf16485bd95, A/bf:4af3a886b9d1f27b6a7f, P/bf:a9857de1fe00ae93a300 | ev_check, cl_check_performer, cl_check_input：PM必须检查已归档日志完整性。 |
| Q28-F02 | PM / 生成 / archive-check.md / REQUIRED | SUPPORTED: ev_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @ev_generate; cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: ev_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @ev_generate; cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: O/bf:5900f92db6a0f7637b7c, A/bf:ea83141737abe7352de4, P/bf:711abf1a707d0bb52fc8 | ev_generate, cl_generate_performer, cl_generate_result：并列生成沿用PM，archive-check结果明确。 |
| Q28-F03 | 已归档限定日志，不新增归档动作 | SUPPORTED: ev_archived: 已归档 UNSTATED; cl_check_input: ROLE INPUT_OBJECT=ent_archived_logs @ev_check; cl_archived_object: ROLE OBJECT=ent_archived_logs @ev_archived | SUPPORTED: ev_archived: 已归档 UNSTATED; cl_check_input: ROLE INPUT_OBJECT=ent_archived_logs @ev_check; cl_archived_object: ROLE OBJECT=ent_archived_logs @ev_archived | SUPPORTED: I/bf:0f240820eaf16485bd95, A/bf:4af3a886b9d1f27b6a7f | cl_check_input, ev_archived, cl_archived_object：已归档作为受检日志定语，MODIFIER/MENTION_ONLY，不升格归档命令。 |
| Q28-F04 | archive-check.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @ev_generate | SUPPORTED: O/bf:5900f92db6a0f7637b7c, A/bf:ea83141737abe7352de4 | cl_generate_result：archive-check.md O。 |
| Q28-F05 | 禁止归档新日志，不能改为禁止检查已归档日志 | SUPPORTED: ev_archive_new: 归档日志 FORBIDDEN; cl_archive_performer: ROLE PERFORMER=ent_pm @ev_archive_new; cl_archive_object: ROLE OBJECT=ent_new_logs @ev_archive_new | SUPPORTED: ev_archive_new: 归档日志 FORBIDDEN; cl_archive_performer: ROLE PERFORMER=ent_pm @ev_archive_new; cl_archive_object: ROLE OBJECT=ent_new_logs @ev_archive_new | SUPPORTED: B/bf:672d58b64c2307373350 | ev_archive_new, cl_archive_performer, cl_archive_object：FORBIDDEN归档新日志，未禁止检查已归档日志。 |
| Q28-F06 | 归档背景不升为当前REQUIRED动作 | SUPPORTED: ev_archive_new: 归档日志 FORBIDDEN; ev_archived: 已归档 UNSTATED | SUPPORTED: ev_archive_new: 归档日志 FORBIDDEN; ev_archived: 已归档 UNSTATED | SUPPORTED: B/bf:672d58b64c2307373350 | ev_archived, ev_archive_new：只有当前禁止归档；定语状态UNSTATED，没有生成新的归档义务或事实断言。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q29

请PM读取east.csv和west.csv，再把它交给QA；另请OPS-01生成port.md。

真实来源歧义保留也是整案PASS；歧义对象的技术UNRESOLVED不是额外语义缺陷，全部明确动作/关系未污染。

原始完整证据：[Trace](runs/first/Q29/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q29-F01 | PM / 读取 / east.csv和west.csv / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: I/bf:4bc060c0ca124dcefc58, I/bf:cf7df7787476f0b7a90c, A/bf:3f107b4eee258bdcc1ae, P/bf:85155753053838727e9f | evt_read, cl_read_pm, cl_read_east, cl_read_west：PM必须读取两份文件，各独立INPUT绑定明确。 |
| Q29-F02 | PM / 交给 / 它 / REQUIRED | SUPPORTED: evt_handoff: 交给 REQUIRED; cl_handoff_pm: ROLE PERFORMER=ent_pm @evt_handoff; cl_handoff_object: ROLE OBJECT=ent_it @evt_handoff; cl_order: TEMPORAL ORDER AFTER @evt_handoff | SUPPORTED: evt_handoff: 交给 REQUIRED; cl_handoff_pm: ROLE PERFORMER=ent_pm @evt_handoff; cl_handoff_object: ROLE OBJECT=ent_it @evt_handoff; cl_order: TEMPORAL ORDER AFTER @evt_handoff | SUPPORTED: A/bf:d45bab107de42d8bfebd, P/bf:e65a5ee5d2d6b9cf688b, P/bf:14a5d1e6d00b943c79ce | evt_handoff, cl_handoff_pm, cl_handoff_object, cl_order：读取之后PM必须交给，交付对象保留它，ORDER/AFTER未变充分条件。 |
| Q29-F03 | OPS-01 / 生成 / port.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: O/bf:c62e383d60e37daf8372, A/bf:885b258ad8eca549e3ce, P/bf:b2fc87a4b16b83cfe968 | evt_generate, cl_generate_ops, cl_generate_port：独立OPS-01必须生成port.md。 |
| Q29-F04 | 交给QA | SUPPORTED: cl_handoff_qa: ROLE RECIPIENT=ent_qa @evt_handoff | SUPPORTED: cl_handoff_qa: ROLE RECIPIENT=ent_qa @evt_handoff | SUPPORTED: A/bf:d45bab107de42d8bfebd, P/bf:14a5d1e6d00b943c79ce | cl_handoff_qa：QA仅接收，无复核义务。 |
| Q29-F05 | 两个明确读取保留 | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: I/bf:4bc060c0ca124dcefc58, I/bf:cf7df7787476f0b7a90c, A/bf:3f107b4eee258bdcc1ae | cl_read_east, cl_read_west：两个明确读取在I RESOLVED。 |
| Q29-F06 | 独立port.md生成保留 | SUPPORTED: cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: O/bf:c62e383d60e37daf8372, A/bf:885b258ad8eca549e3ce | cl_generate_port：port O RESOLVED，不受前句指代污染。 |
| Q29-F07 | 它有east/west竞争，交付用途UNRESOLVED；不按最近选择west | SUPPORTED: ent_it: 它; cl_handoff_object: ROLE OBJECT=ent_it @evt_handoff | SUPPORTED: ent_it: 它; cl_handoff_object: ROLE OBJECT=ent_it @evt_handoff | SUPPORTED: A/bf:d45bab107de42d8bfebd | ent_it, cl_handoff_object：east/west备选，真实歧义局部保留；A中该交付UNRESOLVED没有按邻近挑west。 |
| Q29-F08 | 不得污染明确读取、PM/QA关系可确定部分和独立OPS生成 | SUPPORTED: cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_handoff_pm: ROLE PERFORMER=ent_pm @evt_handoff; cl_handoff_qa: ROLE RECIPIENT=ent_qa @evt_handoff; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate | SUPPORTED: cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_handoff_pm: ROLE PERFORMER=ent_pm @evt_handoff; cl_handoff_qa: ROLE RECIPIENT=ent_qa @evt_handoff; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate | SUPPORTED: A/bf:3f107b4eee258bdcc1ae, A/bf:d45bab107de42d8bfebd, A/bf:885b258ad8eca549e3ce, P/bf:85155753053838727e9f, P/bf:e65a5ee5d2d6b9cf688b, P/bf:14a5d1e6d00b943c79ce, P/bf:b2fc87a4b16b83cfe968 | cl_read_pm, cl_handoff_pm, cl_handoff_qa, cl_generate_ops：P的明确关系仍接受，独立读取和生成仍接受，没有额外WP/QA核查。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## first/Q30

请PM读取east.csv和west.csv，再把前一个文件交给QA；另请OPS-01生成port.md。

Q29/Q30区别由实际解析保留：竞争它与明确前一个分开。JSON及中文包含same east交付和独立port，没有变成两份交付。

原始完整证据：[Trace](runs/first/Q30/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q30-F01 | PM / 读取 / east.csv和west.csv / REQUIRED | SUPPORTED: A1: 读取 REQUIRED; C1: ROLE PERFORMER=E1 @A1; C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1 | SUPPORTED: A1: 读取 REQUIRED; C1: ROLE PERFORMER=E1 @A1; C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1 | SUPPORTED: I/bf:df77a3af119dc56f1b92, I/bf:643816730a3757ea5066, A/bf:37e78e6afcf9d051321b, P/bf:06c691b04d086a46628b | A1, C1, C2, C3：PM必须读取east/west两个文件。 |
| Q30-F02 | PM / 交给 / east.csv / REQUIRED | SUPPORTED: A2: 交给 REQUIRED; C4: ROLE PERFORMER=E1 @A2; C5: ROLE OBJECT=E2 @A2; C7: TEMPORAL ORDER AFTER @A2 | SUPPORTED: A2: 交给 REQUIRED; C4: ROLE PERFORMER=E1 @A2; C5: ROLE OBJECT=E2 @A2; C7: TEMPORAL ORDER AFTER @A2 | SUPPORTED: A/bf:032b1e0a9764dc24d75e, P/bf:4795e014dc97b962d244, P/bf:f16fd6516697f9ebe3e9 | A2, C4, C5, C7：PM读取后交给east，前一个文件按明确顺序闭合，ORDER/AFTER。 |
| Q30-F03 | OPS-01 / 生成 / port.md / REQUIRED | SUPPORTED: A3: 生成 REQUIRED; C8: ROLE PERFORMER=E5 @A3; C9: ROLE RESULT=E6 @A3 | SUPPORTED: A3: 生成 REQUIRED; C8: ROLE PERFORMER=E5 @A3; C9: ROLE RESULT=E6 @A3 | SUPPORTED: O/bf:8b3445d7f41087b9eabc, A/bf:8bec39fe2d06149ab14d, P/bf:277dd3cd4efd3920a82f | A3, C8, C9：独立OPS必须生成port报告。 |
| Q30-F04 | 交给QA | SUPPORTED: C6: ROLE RECIPIENT=E4 @A2 | SUPPORTED: C6: ROLE RECIPIENT=E4 @A2 | SUPPORTED: A/bf:032b1e0a9764dc24d75e, P/bf:f16fd6516697f9ebe3e9 | C6：QA只接收east，不补复核义务。 |
| Q30-F05 | 两个文件读取 | SUPPORTED: C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1 | SUPPORTED: C2: ROLE INPUT_OBJECT=E2 @A1; C3: ROLE INPUT_OBJECT=E3 @A1 | SUPPORTED: I/bf:df77a3af119dc56f1b92, I/bf:643816730a3757ea5066, A/bf:37e78e6afcf9d051321b | C2, C3：I两个明确读取，未缩至交付对象。 |
| Q30-F06 | port.md | SUPPORTED: C9: ROLE RESULT=E6 @A3 | SUPPORTED: C9: ROLE RESULT=E6 @A3 | SUPPORTED: O/bf:8b3445d7f41087b9eabc, A/bf:8bec39fe2d06149ab14d | C9：port明确O，独立动作不受影响。 |
| Q30-F07 | 前一个唯一指east，交付用途应闭合；不是交付两文件 | SUPPORTED: E2: east.csv; C5: ROLE OBJECT=E2 @A2 | SUPPORTED: E2: east.csv; C5: ROLE OBJECT=E2 @A2 | SUPPORTED: I/bf:df77a3af119dc56f1b92, A/bf:032b1e0a9764dc24d75e | C5, E2：前一个唯一关联east同实体，交付无错误未决，不交两份。 |
| Q30-F08 | 不沿用Q29歧义或选择west | SUPPORTED: A2: 交给 REQUIRED; C5: ROLE OBJECT=E2 @A2 | SUPPORTED: A2: 交给 REQUIRED; C5: ROLE OBJECT=E2 @A2 | SUPPORTED: A/bf:032b1e0a9764dc24d75e, P/bf:4795e014dc97b962d244, P/bf:f16fd6516697f9ebe3e9 | A2, C5：没有选择west或沿用它的歧义，没有反推许可。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-1/Q07

请PM仅负责组织磁盘空间检查，具体检查执行者由后续计划确定。请QA汇总检查结果并生成capacity.md。

额外第一次实际调用重新审阅；与首轮相比多拆组织/检查事件及内部检查结果，语义等价。检查无默认执行者，真实来源义务完整保留。

原始完整证据：[Trace](runs/repeat-1/Q07/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q07-F01 | PM / 组织 / 磁盘空间检查 / REQUIRED | SUPPORTED: e_organize: 组织检查 REQUIRED; e_check: 检查磁盘空间 REQUIRED; c_organize_performer: ROLE PERFORMER=n_pm @e_organize; c_check_organizer: ROLE ORGANIZER=n_pm @e_check | SUPPORTED: e_organize: 组织检查 REQUIRED; e_check: 检查磁盘空间 REQUIRED; c_organize_performer: ROLE PERFORMER=n_pm @e_organize; c_check_organizer: ROLE ORGANIZER=n_pm @e_check | SUPPORTED: I/bf:091a89c99836577210f0, I/bf:b39a9da819272a734c58, O/bf:afc0b9aacf7290aa9b2a, A/bf:fd59e6826fb673410ffc, A/bf:31899fd1c55dfc5dcf76, P/bf:aa840a1380071e45ad8f, P/bf:c6ec26a4fba9b69f5119 | e_organize, c_organize_performer, e_check, c_check_organizer：PM必须组织检查；组织动作PERFORMER与受组织检查ORGANIZER分开。 |
| Q07-F02 | QA / 汇总 / 检查结果 / REQUIRED | SUPPORTED: e_summarize: 汇总检查结果 REQUIRED; c_summarize_performer: ROLE PERFORMER=n_qa @e_summarize; c_summarize_object: ROLE OBJECT=n_results @e_summarize | SUPPORTED: e_summarize: 汇总检查结果 REQUIRED; c_summarize_performer: ROLE PERFORMER=n_qa @e_summarize; c_summarize_object: ROLE OBJECT=n_results @e_summarize | SUPPORTED: A/bf:c3a6a42fc44279f4bb0e, P/bf:bc9b5d1ae116754c8f74 | e_summarize, c_summarize_performer, c_summarize_object：QA必须汇总同一检查结果。 |
| Q07-F03 | QA / 生成 / capacity.md / REQUIRED | SUPPORTED: e_generate: 生成文件 REQUIRED; c_generate_performer: ROLE PERFORMER=n_qa @e_generate; c_generate_result: ROLE RESULT=n_capacity @e_generate | SUPPORTED: e_generate: 生成文件 REQUIRED; c_generate_performer: ROLE PERFORMER=n_qa @e_generate; c_generate_result: ROLE RESULT=n_capacity @e_generate | SUPPORTED: O/bf:45932ec1c2f0e0902a40, A/bf:4205ef1baaead9b2e92b, P/bf:1cef9a5335303e5f6ef4 | e_generate, c_generate_performer, c_generate_result：QA必须生成capacity。 |
| Q07-F04 | PM仅组织；QA只明确汇总/生成，均不默认亲自检查 | SUPPORTED: c_check_organizer: ROLE ORGANIZER=n_pm @e_check; c_pm_scope: SCOPE @n_pm; x_pm_scope: STATE | SUPPORTED: c_check_organizer: ROLE ORGANIZER=n_pm @e_check; c_pm_scope: SCOPE @n_pm; x_pm_scope: STATE | SUPPORTED: A/bf:31899fd1c55dfc5dcf76, P/bf:c6ec26a4fba9b69f5119 | c_pm_scope, x_pm_scope, c_check_organizer：PM职责仅限组织，检查没有PM或QA PERFORMER；QA独立汇总/生成。 |
| Q07-F05 | 检查执行者由后续计划确定，不是竞争指代歧义 | SUPPORTED: c_executor_pending: SCOPE @e_check; x_executor_pending: STATE | SUPPORTED: c_executor_pending: SCOPE @e_check; x_executor_pending: STATE | SUPPORTED: I/bf:b39a9da819272a734c58 | c_executor_pending, x_executor_pending：后续计划确定执行者，UNSPECIFIED保留，非竞争歧义。 |
| Q07-F06 | 磁盘空间检查的明确受检范围保留，可在被组织检查用途表达 | SUPPORTED: c_check_input: ROLE INPUT_OBJECT=n_disk @e_check | SUPPORTED: c_check_input: ROLE INPUT_OBJECT=n_disk @e_check | SUPPORTED: I/bf:091a89c99836577210f0, A/bf:31899fd1c55dfc5dcf76 | c_check_input：明确磁盘空间范围进入I。 |
| Q07-F07 | capacity.md | SUPPORTED: c_generate_result: ROLE RESULT=n_capacity @e_generate | SUPPORTED: c_generate_result: ROLE RESULT=n_capacity @e_generate | SUPPORTED: O/bf:45932ec1c2f0e0902a40, A/bf:4205ef1baaead9b2e92b | c_generate_result：capacity O；内部检查结果是汇总对象，不是额外外部文件交付。 |
| Q07-F08 | 不新增制定后续计划义务或默认检查人 | SUPPORTED: e_check: 检查磁盘空间 REQUIRED; c_executor_pending: SCOPE @e_check | SUPPORTED: e_check: 检查磁盘空间 REQUIRED; c_executor_pending: SCOPE @e_check | SUPPORTED: I/bf:091a89c99836577210f0, I/bf:b39a9da819272a734c58, O/bf:afc0b9aacf7290aa9b2a, A/bf:31899fd1c55dfc5dcf76, P/bf:c6ec26a4fba9b69f5119 | e_check, c_executor_pending：检查任务执行者未指定；没有制定计划事件或默认检查人。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-1/Q20

若发现服务异常，OPS-01必须通知PM；无论是否发现异常，OPS-01都必须生成health.md。

第二次实测与首次语义一致。条件中的发现者额外标UNSPECIFIED是原文开放细节，不污染明确OPS通知/生成。

原始完整证据：[Trace](runs/repeat-1/Q20/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q20-F01 | OPS-01 / 通知 / PM / REQUIRED | SUPPORTED: event_notify: 通知 REQUIRED; claim_notify_performer: ROLE PERFORMER=entity_ops @event_notify; claim_notify_recipient: ROLE RECIPIENT=entity_pm @event_notify | SUPPORTED: event_notify: 通知 REQUIRED; claim_notify_performer: ROLE PERFORMER=entity_ops @event_notify; claim_notify_recipient: ROLE RECIPIENT=entity_pm @event_notify | SUPPORTED: A/bf:a6082ea1023a055dac2c, P/bf:5d7bf3ece10011dca9aa, P/bf:ef7a7ac633586fcbb7d5 | event_notify, claim_notify_performer, claim_notify_recipient：OPS必须通知PM，异常充分触发。 |
| Q20-F02 | OPS-01 / 生成 / health.md / REQUIRED | SUPPORTED: event_generate: 生成 REQUIRED; claim_generate_performer: ROLE PERFORMER=entity_ops @event_generate; claim_generate_result: ROLE RESULT=entity_health @event_generate | SUPPORTED: event_generate: 生成 REQUIRED; claim_generate_performer: ROLE PERFORMER=entity_ops @event_generate; claim_generate_result: ROLE RESULT=entity_health @event_generate | SUPPORTED: O/bf:61332d5ba67e4feb0c06, A/bf:e6898e0d132682f47454, P/bf:aed5095b9e5ada983b86 | event_generate, claim_generate_performer, claim_generate_result：OPS无条件必须生成health。 |
| Q20-F03 | PM仅是通知接收者 | SUPPORTED: claim_notify_recipient: ROLE RECIPIENT=entity_pm @event_notify | SUPPORTED: claim_notify_recipient: ROLE RECIPIENT=entity_pm @event_notify | SUPPORTED: A/bf:a6082ea1023a055dac2c, P/bf:ef7a7ac633586fcbb7d5 | claim_notify_recipient：PM仅通知接收者。 |
| Q20-F04 | 发现服务异常SUFFICIENT触发通知义务 | SUPPORTED: claim_notify_condition: CONDITION SUFFICIENT @event_notify; expression_discovered: STATE | SUPPORTED: claim_notify_condition: CONDITION SUFFICIENT @event_notify; expression_discovered: STATE | SUPPORTED: A/bf:a6082ea1023a055dac2c, P/bf:5d7bf3ece10011dca9aa, P/bf:ef7a7ac633586fcbb7d5 | claim_notify_condition, expression_discovered：SUFFICIENT服务异常只约束通知。 |
| Q20-F05 | health.md生成在异常/非异常都要求；无条件或显式恒真等价 | SUPPORTED: event_generate: 生成 REQUIRED | SUPPORTED: event_generate: 生成 REQUIRED | SUPPORTED: O/bf:61332d5ba67e4feb0c06, A/bf:e6898e0d132682f47454, P/bf:aed5095b9e5ada983b86 | event_generate：constraint_ids为空，是否异常均生成。 |
| Q20-F06 | health.md | SUPPORTED: claim_generate_result: ROLE RESULT=entity_health @event_generate | SUPPORTED: claim_generate_result: ROLE RESULT=entity_health @event_generate | SUPPORTED: O/bf:61332d5ba67e4feb0c06, A/bf:e6898e0d132682f47454 | claim_generate_result：health O REQUIRED。 |
| Q20-F07 | 不新增检查义务，不宣布异常已发生 | SUPPORTED: event_discover: 发现服务异常 UNSTATED; claim_discover_object: ROLE OBJECT=entity_service @event_discover | SUPPORTED: event_discover: 发现服务异常 UNSTATED; claim_discover_object: ROLE OBJECT=entity_service @event_discover | SUPPORTED:  | event_discover, claim_discover_object：条件事件MENTION_ONLY/UNSTATED，发现者未指定，无新增检查或事实断言。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-1/Q25

请PM读取feed.json，该读取最多重试4次；生成feed-note.md，报告恰好列出2条异常记录。

第二次真实运行不是首轮成功的重复证明：来源含义仍可读，但数量目标编码违反冻结合同，原模型审阅未拦截，技术拒绝并连带阻断O/A/P。实际失败完整保留，不重跑到正确。

原始完整证据：[Trace](runs/repeat-1/Q25/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q25-F01 | PM / 读取 / feed.json / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: I/bf:62c99d88bbd29a069124, A/bf:eceef57ba1bf612a28c2, P/bf:03210dbdda72e7597b08, R/bf:6b92dcdb7356d378b284 | evt_read, cl_read_performer, cl_read_input：PM读取义务保留。 |
| Q25-F02 | PM / 生成 / feed-note.md / REQUIRED | SUPPORTED: evt_generate: 生成报告 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: evt_generate: 生成报告 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | ERROR: O/bf:7dbe3b8267807324b215, A/bf:889e9e2cb2de93d5d3c7, P/bf:b6a927ee9d79161b1932 | evt_generate, cl_generate_performer, cl_generate_result：PM生成明确，但不合法输出数量依赖连带使交付事件REJECTED。 |
| Q25-F03 | feed.json | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: I/bf:62c99d88bbd29a069124, A/bf:eceef57ba1bf612a28c2 | cl_read_input：feed输入接受且独立。 |
| Q25-F04 | feed-note.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | ERROR: O/bf:7dbe3b8267807324b215, A/bf:889e9e2cb2de93d5d3c7 | cl_generate_result：报告RESULT在候选明确，最终O却REJECTED，无法完整接受源文明确交付。 |
| Q25-F05 | 读取重试次数<=4次，EXECUTION_LIMIT，仅读取，不包括最初执行 | SUPPORTED: cl_retry_limit: QUANTITY @evt_read | SUPPORTED: cl_retry_limit: QUANTITY @evt_read | SUPPORTED: I/bf:62c99d88bbd29a069124, A/bf:eceef57ba1bf612a28c2, P/bf:03210dbdda72e7597b08, R/bf:6b92dcdb7356d378b284 | cl_retry_limit：LTE4次/EXECUTION_LIMIT/target与count_scope读取，初次执行排除正确。 |
| Q25-F06 | 报告恰好2条异常记录，EQ/OUTPUT_CONTENT目标feed-note.md，挂O不进R | ERROR: cl_report_content: ROLE CONTENT=ent_records @ent_report; cl_record_count: QUANTITY @ent_report | ERROR: cl_report_content: ROLE CONTENT=ent_records @ent_report; cl_record_count: QUANTITY @ent_report | ERROR: O/bf:7dbe3b8267807324b215, A/bf:889e9e2cb2de93d5d3c7, P/bf:b6a927ee9d79161b1932 | cl_record_count, cl_report_content：EQ2/OUTPUT_CONTENT意图保留，但target_id=异常记录实体，违反合同必须指报告RESULT；计数范围报告尚正确，技术拒绝CONTENT_QUANTITY_RESULT_TARGET，最终未挂O。 |
| Q25-F07 | 不把2条当观测值、读取限制或重试次数 | SUPPORTED: cl_retry_limit: QUANTITY @evt_read; cl_record_count: QUANTITY @ent_report | SUPPORTED: cl_retry_limit: QUANTITY @evt_read; cl_record_count: QUANTITY @ent_report | SUPPORTED: I/bf:62c99d88bbd29a069124, O/bf:7dbe3b8267807324b215, A/bf:eceef57ba1bf612a28c2, A/bf:889e9e2cb2de93d5d3c7, P/bf:03210dbdda72e7597b08, P/bf:b6a927ee9d79161b1932, R/bf:6b92dcdb7356d378b284 | cl_record_count, cl_retry_limit：没有把内容数量转资源或实际观测，但该内容要求无法正常编译；R仅读取重试。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-1/Q29

请PM读取east.csv和west.csv，再把它交给QA；另请OPS-01生成port.md。

第二次实测再次保持对象歧义局部性；type局部未明没有污染身份/明确用途。原始JSON与中文含同样明确事实和未决对象。

原始完整证据：[Trace](runs/repeat-1/Q29/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q29-F01 | PM / 读取 / east.csv和west.csv / REQUIRED | SUPPORTED: ev_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @ev_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @ev_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @ev_read | SUPPORTED: ev_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @ev_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @ev_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @ev_read | SUPPORTED: I/bf:5dbc05a483256603041c, I/bf:bdca30cb63bd3dc7f967, A/bf:77a9a07ea9c44847cfff, P/bf:d013466845cd190a9c7a | ev_read, cl_read_performer, cl_read_east, cl_read_west：PM读取east/west均明确。 |
| Q29-F02 | PM / 交给 / 它 / REQUIRED | SUPPORTED: ev_handover: 交给 REQUIRED; cl_handover_performer: ROLE PERFORMER=ent_pm @ev_handover; cl_handover_object: ROLE OBJECT=ent_it @ev_handover; cl_order: TEMPORAL ORDER AFTER @ev_handover | SUPPORTED: ev_handover: 交给 REQUIRED; cl_handover_performer: ROLE PERFORMER=ent_pm @ev_handover; cl_handover_object: ROLE OBJECT=ent_it @ev_handover; cl_order: TEMPORAL ORDER AFTER @ev_handover | SUPPORTED: A/bf:b575b582781d341569b3, P/bf:724c3a770069289e3fa0, P/bf:0b4c56a88522dfdacfa5 | ev_handover, cl_handover_performer, cl_handover_object, cl_order：PM读取后交给，只有对象身份未决，AFTER/ORDER。 |
| Q29-F03 | OPS-01 / 生成 / port.md / REQUIRED | SUPPORTED: ev_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @ev_generate; cl_generate_result: ROLE RESULT=ent_port @ev_generate | SUPPORTED: ev_generate: 生成 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @ev_generate; cl_generate_result: ROLE RESULT=ent_port @ev_generate | SUPPORTED: O/bf:51a671522a2a639fd40b, A/bf:a09efaacabc4452ede3f, P/bf:2ed11aa946ec7efead53 | ev_generate, cl_generate_performer, cl_generate_result：OPS独立生成port。 |
| Q29-F04 | 交给QA | SUPPORTED: cl_handover_recipient: ROLE RECIPIENT=ent_qa @ev_handover | SUPPORTED: cl_handover_recipient: ROLE RECIPIENT=ent_qa @ev_handover | SUPPORTED: A/bf:b575b582781d341569b3, P/bf:0b4c56a88522dfdacfa5 | cl_handover_recipient：QA接收，没有复核义务。 |
| Q29-F05 | 两个明确读取保留 | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @ev_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @ev_read | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @ev_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @ev_read | SUPPORTED: I/bf:5dbc05a483256603041c, I/bf:bdca30cb63bd3dc7f967, A/bf:77a9a07ea9c44847cfff | cl_read_east, cl_read_west：I两文件RESOLVED不污染。 |
| Q29-F06 | 独立port.md生成保留 | SUPPORTED: cl_generate_result: ROLE RESULT=ent_port @ev_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_port @ev_generate | SUPPORTED: O/bf:51a671522a2a639fd40b, A/bf:a09efaacabc4452ede3f | cl_generate_result：port O RESOLVED不污染。 |
| Q29-F07 | 它有east/west竞争，交付用途UNRESOLVED；不按最近选择west | SUPPORTED: ent_it: 它; cl_handover_object: ROLE OBJECT=ent_it @ev_handover | SUPPORTED: ent_it: 它; cl_handover_object: ROLE OBJECT=ent_it @ev_handover | SUPPORTED: A/bf:b575b582781d341569b3 | ent_it, cl_handover_object：两个指代备选，局部UNRESOLVED，不按距离挑west。 |
| Q29-F08 | 不得污染明确读取、PM/QA关系可确定部分和独立OPS生成 | SUPPORTED: cl_read_performer: ROLE PERFORMER=ent_pm @ev_read; cl_handover_performer: ROLE PERFORMER=ent_pm @ev_handover; cl_handover_recipient: ROLE RECIPIENT=ent_qa @ev_handover; cl_generate_performer: ROLE PERFORMER=ent_ops @ev_generate | SUPPORTED: cl_read_performer: ROLE PERFORMER=ent_pm @ev_read; cl_handover_performer: ROLE PERFORMER=ent_pm @ev_handover; cl_handover_recipient: ROLE RECIPIENT=ent_qa @ev_handover; cl_generate_performer: ROLE PERFORMER=ent_ops @ev_generate | SUPPORTED: A/bf:77a9a07ea9c44847cfff, A/bf:b575b582781d341569b3, A/bf:a09efaacabc4452ede3f, P/bf:d013466845cd190a9c7a, P/bf:724c3a770069289e3fa0, P/bf:0b4c56a88522dfdacfa5, P/bf:2ed11aa946ec7efead53 | cl_read_performer, cl_handover_performer, cl_handover_recipient, cl_generate_performer：明确参与关系与独立动作接受，只有依赖指代的交付对象及事件整体未决。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-1/Q30

请PM读取east.csv和west.csv，再把前一个文件交给QA；另请OPS-01生成port.md。

第二次实测与首次明确指代一致，接收对象只east；保留独立读取两份以及OPS产物。

原始完整证据：[Trace](runs/repeat-1/Q30/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q30-F01 | PM / 读取 / east.csv和west.csv / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: I/bf:e037a1c0e5db2c44eea0, I/bf:9d46f70ed52594ba2be7, A/bf:6dc67daf52974e79a787, P/bf:7999136e8737870ef1d2 | evt_read, cl_read_pm, cl_read_east, cl_read_west：PM读取两份文件。 |
| Q30-F02 | PM / 交给 / east.csv / REQUIRED | SUPPORTED: evt_handoff: 交给 REQUIRED; cl_handoff_pm: ROLE PERFORMER=ent_pm @evt_handoff; cl_handoff_east: ROLE OBJECT=ent_east @evt_handoff; cl_order: TEMPORAL ORDER AFTER @evt_handoff | SUPPORTED: evt_handoff: 交给 REQUIRED; cl_handoff_pm: ROLE PERFORMER=ent_pm @evt_handoff; cl_handoff_east: ROLE OBJECT=ent_east @evt_handoff; cl_order: TEMPORAL ORDER AFTER @evt_handoff | SUPPORTED: A/bf:645f53f237abc8d3601e, P/bf:b033b107577684c3e738, P/bf:40e4045b4dcd181567c5 | evt_handoff, cl_handoff_pm, cl_handoff_east, cl_order：PM读取后交给明确east，ORDER/AFTER。 |
| Q30-F03 | OPS-01 / 生成 / port.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: O/bf:a527aa5bc903e17bf675, A/bf:da62d777c983e92fea87, P/bf:f635ea48bc1c96ec12bf | evt_generate, cl_generate_ops, cl_generate_port：OPS独立生成port。 |
| Q30-F04 | 交给QA | SUPPORTED: cl_handoff_qa: ROLE RECIPIENT=ent_qa @evt_handoff | SUPPORTED: cl_handoff_qa: ROLE RECIPIENT=ent_qa @evt_handoff | SUPPORTED: A/bf:645f53f237abc8d3601e, P/bf:40e4045b4dcd181567c5 | cl_handoff_qa：QA接收east，不执行核查。 |
| Q30-F05 | 两个文件读取 | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: I/bf:e037a1c0e5db2c44eea0, I/bf:9d46f70ed52594ba2be7, A/bf:6dc67daf52974e79a787 | cl_read_east, cl_read_west：I两份文件完整。 |
| Q30-F06 | port.md | SUPPORTED: cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: O/bf:a527aa5bc903e17bf675, A/bf:da62d777c983e92fea87 | cl_generate_port：port O。 |
| Q30-F07 | 前一个唯一指east，交付用途应闭合；不是交付两文件 | SUPPORTED: ent_east: east.csv; cl_handoff_east: ROLE OBJECT=ent_east @evt_handoff | SUPPORTED: ent_east: east.csv; cl_handoff_east: ROLE OBJECT=ent_east @evt_handoff | SUPPORTED: I/bf:e037a1c0e5db2c44eea0, A/bf:645f53f237abc8d3601e | cl_handoff_east, ent_east：前一个绑定同一east实体，交付明确接受，不是west/两份/它。 |
| Q30-F08 | 不沿用Q29歧义或选择west | SUPPORTED: evt_handoff: 交给 REQUIRED; cl_handoff_east: ROLE OBJECT=ent_east @evt_handoff | SUPPORTED: evt_handoff: 交给 REQUIRED; cl_handoff_east: ROLE OBJECT=ent_east @evt_handoff | SUPPORTED: A/bf:645f53f237abc8d3601e, P/bf:b033b107577684c3e738, P/bf:40e4045b4dcd181567c5 | evt_handoff, cl_handoff_east：无错误歧义，没有额外义务或权限。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-2/Q07

请PM仅负责组织磁盘空间检查，具体检查执行者由后续计划确定。请QA汇总检查结果并生成capacity.md。

第三次实测与首轮同样以内容检查结构保留范围；第二次拆成任务检查结构，两种都未指定检查执行者。三次完整保留PM组织、QA汇总/生成与未来执行者确定。

原始完整证据：[Trace](runs/repeat-2/Q07/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q07-F01 | PM / 组织 / 磁盘空间检查 / REQUIRED | SUPPORTED: evt_organize: 组织磁盘空间检查 REQUIRED; cl_organizer: ROLE ORGANIZER=ent_pm @evt_organize | SUPPORTED: evt_organize: 组织磁盘空间检查 REQUIRED; cl_organizer: ROLE ORGANIZER=ent_pm @evt_organize | SUPPORTED: I/bf:4d170c59570b43e1288f, A/bf:0482625ad65a096d2269, P/bf:5076e2187b9ed8366b97 | evt_organize, cl_organizer：PM组织磁盘空间检查，CURRENT_TASK/REQUIRED。 |
| Q07-F02 | QA / 汇总 / 检查结果 / REQUIRED | SUPPORTED: evt_summarize: 汇总检查结果 REQUIRED; cl_summarize_performer: ROLE PERFORMER=ent_qa @evt_summarize; cl_summarize_object: ROLE OBJECT=ent_results @evt_summarize | SUPPORTED: evt_summarize: 汇总检查结果 REQUIRED; cl_summarize_performer: ROLE PERFORMER=ent_qa @evt_summarize; cl_summarize_object: ROLE OBJECT=ent_results @evt_summarize | SUPPORTED: A/bf:44ddea309c06b629fc69, P/bf:00521710d674f39c09f0 | evt_summarize, cl_summarize_performer, cl_summarize_object：QA汇总检查结果义务。 |
| Q07-F03 | QA / 生成 / capacity.md / REQUIRED | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @evt_generate; cl_generate_result: ROLE RESULT=ent_file @evt_generate | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_qa @evt_generate; cl_generate_result: ROLE RESULT=ent_file @evt_generate | SUPPORTED: O/bf:9966826915625d984db2, A/bf:1fd0559d15c9d12fa451, P/bf:3d2b57cf30fc1cc26413 | evt_generate, cl_generate_performer, cl_generate_result：QA生成capacity义务。 |
| Q07-F04 | PM仅组织；QA只明确汇总/生成，均不默认亲自检查 | SUPPORTED: cl_pm_scope: SCOPE @evt_organize; expr_pm_scope: STATE | SUPPORTED: cl_pm_scope: SCOPE @evt_organize; expr_pm_scope: STATE | SUPPORTED: I/bf:4d170c59570b43e1288f | cl_pm_scope, expr_pm_scope：仅组织职责；PM不是具体检查PERFORMER，QA没有检查角色。 |
| Q07-F05 | 检查执行者由后续计划确定，不是竞争指代歧义 | SUPPORTED: cl_executor_assignment: SCOPE @evt_check; expr_executor_assignment: STATE | SUPPORTED: cl_executor_assignment: SCOPE @evt_check; expr_executor_assignment: STATE | SUPPORTED: I/bf:3fef21d4eca95f9ffc85 | cl_executor_assignment, expr_executor_assignment：执行者由后续计划确定，UNSPECIFIED无候选竞争。 |
| Q07-F06 | 磁盘空间检查的明确受检范围保留，可在被组织检查用途表达 | SUPPORTED: evt_check: 检查磁盘空间 UNSTATED; cl_check_object: ROLE INPUT_OBJECT=ent_space @evt_check | SUPPORTED: evt_check: 检查磁盘空间 UNSTATED; cl_check_object: ROLE INPUT_OBJECT=ent_space @evt_check | SUPPORTED: I/bf:3fef21d4eca95f9ffc85 | evt_check, cl_check_object：磁盘空间范围在被组织检查内容保持，有显式owner组织事件；没有新增外部结果I。 |
| Q07-F07 | capacity.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_file @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_file @evt_generate | SUPPORTED: O/bf:9966826915625d984db2, A/bf:1fd0559d15c9d12fa451 | cl_generate_result：capacity O。 |
| Q07-F08 | 不新增制定后续计划义务或默认检查人 | SUPPORTED: evt_check: 检查磁盘空间 UNSTATED; cl_executor_assignment: SCOPE @evt_check | SUPPORTED: evt_check: 检查磁盘空间 UNSTATED; cl_executor_assignment: SCOPE @evt_check | SUPPORTED: I/bf:3fef21d4eca95f9ffc85 | evt_check, cl_executor_assignment：MENTION_ONLY检查，不默认执行者，不新增制定计划或禁止检查。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-2/Q20

若发现服务异常，OPS-01必须通知PM；无论是否发现异常，OPS-01都必须生成health.md。

第三次实测仍保持条件通知与无条件产物、明确OPS/PM关系；发现者未单列issue但没有填造角色，开放细节保留。

原始完整证据：[Trace](runs/repeat-2/Q20/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q20-F01 | OPS-01 / 通知 / PM / REQUIRED | SUPPORTED: evt_notify: 通知 REQUIRED; cl_notify_performer: ROLE PERFORMER=ent_ops @evt_notify; cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: evt_notify: 通知 REQUIRED; cl_notify_performer: ROLE PERFORMER=ent_ops @evt_notify; cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: A/bf:14d8ab87812f4a2c174d, P/bf:b480c89ae037d3fb8323, P/bf:d394da28cd1f16a74806 | evt_notify, cl_notify_performer, cl_notify_recipient：OPS必须条件通知PM。 |
| Q20-F02 | OPS-01 / 生成 / health.md / REQUIRED | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: evt_generate: 生成文件 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: O/bf:e2b76f227532593e59f0, A/bf:8e507fa4202ed237b1be, P/bf:7ca60282583f5739c555 | evt_generate, cl_generate_performer, cl_generate_result：OPS必须无条件生成health。 |
| Q20-F03 | PM仅是通知接收者 | SUPPORTED: cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: cl_notify_recipient: ROLE RECIPIENT=ent_pm @evt_notify | SUPPORTED: A/bf:14d8ab87812f4a2c174d, P/bf:d394da28cd1f16a74806 | cl_notify_recipient：PM为通知接收者。 |
| Q20-F04 | 发现服务异常SUFFICIENT触发通知义务 | SUPPORTED: cl_notify_condition: CONDITION SUFFICIENT @evt_notify; expr_discovered: STATE | SUPPORTED: cl_notify_condition: CONDITION SUFFICIENT @evt_notify; expr_discovered: STATE | SUPPORTED: A/bf:14d8ab87812f4a2c174d, P/bf:b480c89ae037d3fb8323, P/bf:d394da28cd1f16a74806 | cl_notify_condition, expr_discovered：已发现服务异常SUFFICIENT触发通知，状态UNKNOWN。 |
| Q20-F05 | health.md生成在异常/非异常都要求；无条件或显式恒真等价 | SUPPORTED: evt_generate: 生成文件 REQUIRED | SUPPORTED: evt_generate: 生成文件 REQUIRED | SUPPORTED: O/bf:e2b76f227532593e59f0, A/bf:8e507fa4202ed237b1be, P/bf:7ca60282583f5739c555 | evt_generate：无异常限制，constraint_ids空。 |
| Q20-F06 | health.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_health @evt_generate | SUPPORTED: O/bf:e2b76f227532593e59f0, A/bf:8e507fa4202ed237b1be | cl_generate_result：health O REQUIRED。 |
| Q20-F07 | 不新增检查义务，不宣布异常已发生 | SUPPORTED: evt_discover: 发现异常 UNSTATED; cl_discover_object: ROLE OBJECT=ent_anomaly @evt_discover | SUPPORTED: evt_discover: 发现异常 UNSTATED; cl_discover_object: ROLE OBJECT=ent_anomaly @evt_discover | SUPPORTED:  | evt_discover, cl_discover_object：CONDITION/MENTION_ONLY，发现者没绑定，未新增检查或发现事实。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-2/Q25

请PM读取feed.json，该读取最多重试4次；生成feed-note.md，报告恰好列出2条异常记录。

第三次运行正确，不覆盖第二次失败：数量目标恢复报告，原技术检查接受，O/A/P完整；该组最终2/3，存在真实重复波动。

原始完整证据：[Trace](runs/repeat-2/Q25/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q25-F01 | PM / 读取 / feed.json / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_performer: ROLE PERFORMER=ent_pm @evt_read; cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: I/bf:f09b827c224a3113fa36, A/bf:c86fa46e2c1b19caf4fc, P/bf:2852587a856bac260d24, R/bf:be4b6f65f655e023e8be | evt_read, cl_read_performer, cl_read_input：PM必须读取feed。 |
| Q25-F02 | PM / 生成 / feed-note.md / REQUIRED | SUPPORTED: evt_generate: 生成报告 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: evt_generate: 生成报告 REQUIRED; cl_generate_performer: ROLE PERFORMER=ent_pm @evt_generate; cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: O/bf:6fe37db55d2f69c832ae, A/bf:66996f1750665b5f3ffb, P/bf:6b0e831c513c51a323d1 | evt_generate, cl_generate_performer, cl_generate_result：PM沿用生成报告，义务明确。 |
| Q25-F03 | feed.json | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: cl_read_input: ROLE INPUT_OBJECT=ent_feed @evt_read | SUPPORTED: I/bf:f09b827c224a3113fa36, A/bf:c86fa46e2c1b19caf4fc | cl_read_input：feed I。 |
| Q25-F04 | feed-note.md | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: cl_generate_result: ROLE RESULT=ent_report @evt_generate | SUPPORTED: O/bf:6fe37db55d2f69c832ae, A/bf:66996f1750665b5f3ffb | cl_generate_result：feed-note O接受，内容数量正确挂载。 |
| Q25-F05 | 读取重试次数<=4次，EXECUTION_LIMIT，仅读取，不包括最初执行 | SUPPORTED: cl_retry_limit: QUANTITY @evt_read | SUPPORTED: cl_retry_limit: QUANTITY @evt_read | SUPPORTED: I/bf:f09b827c224a3113fa36, A/bf:c86fa46e2c1b19caf4fc, P/bf:2852587a856bac260d24, R/bf:be4b6f65f655e023e8be | cl_retry_limit：LTE4次重试，target/count_scope=读取，不包括首次。 |
| Q25-F06 | 报告恰好2条异常记录，EQ/OUTPUT_CONTENT目标feed-note.md，挂O不进R | SUPPORTED: cl_report_content: ROLE CONTENT=ent_anomalies @ent_report; cl_output_count: QUANTITY @evt_generate | SUPPORTED: cl_report_content: ROLE CONTENT=ent_anomalies @ent_report; cl_output_count: QUANTITY @evt_generate | SUPPORTED: O/bf:6fe37db55d2f69c832ae, A/bf:66996f1750665b5f3ffb, P/bf:6b0e831c513c51a323d1 | cl_output_count, cl_report_content：EQ2条 OUTPUT_CONTENT，target/count_scope=报告，scope=生成；异常记录CONTENT有据，数量不进R。 |
| Q25-F07 | 不把2条当观测值、读取限制或重试次数 | SUPPORTED: cl_retry_limit: QUANTITY @evt_read; cl_output_count: QUANTITY @evt_generate | SUPPORTED: cl_retry_limit: QUANTITY @evt_read; cl_output_count: QUANTITY @evt_generate | SUPPORTED: I/bf:f09b827c224a3113fa36, O/bf:6fe37db55d2f69c832ae, A/bf:c86fa46e2c1b19caf4fc, A/bf:66996f1750665b5f3ffb, P/bf:2852587a856bac260d24, P/bf:6b0e831c513c51a323d1, R/bf:be4b6f65f655e023e8be | cl_output_count, cl_retry_limit：不把2条当观测值或执行次数，重试无实际执行声明。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-2/Q29

请PM读取east.csv和west.csv，再把它交给QA；另请OPS-01生成port.md。

第三次再次准确保留它的局部竞争。相较前两次时序状态参数显式带PM，仍指同一读取事件；不造成额外动作或歧义。

原始完整证据：[Trace](runs/repeat-2/Q29/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q29-F01 | PM / 读取 / east.csv和west.csv / REQUIRED | SUPPORTED: e1: 读取 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: e1: 读取 REQUIRED; c1: ROLE PERFORMER=n1 @e1; c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: I/bf:228d2d3ac7f4848758db, I/bf:7f4e2f20f6e66d29708c, A/bf:f7b2e6d42837ce627e0f, P/bf:b91fe283a2015257ac54 | e1, c1, c2, c3：PM必须读取两个文件。 |
| Q29-F02 | PM / 交给 / 它 / REQUIRED | SUPPORTED: e2: 交给 REQUIRED; c4: ROLE PERFORMER=n1 @e2; c5: ROLE OBJECT=n4 @e2; c9: TEMPORAL ORDER AFTER @e2 | SUPPORTED: e2: 交给 REQUIRED; c4: ROLE PERFORMER=n1 @e2; c5: ROLE OBJECT=n4 @e2; c9: TEMPORAL ORDER AFTER @e2 | SUPPORTED: A/bf:1477d6a52691fcf6928d, P/bf:aa3574178e6b7f146ee0, P/bf:2e3b073ff5bc523a5f24 | e2, c4, c5, c9：PM读取后交给它，局部身份未决；ORDER/AFTER。 |
| Q29-F03 | OPS-01 / 生成 / port.md / REQUIRED | SUPPORTED: e3: 生成 REQUIRED; c7: ROLE PERFORMER=n6 @e3; c8: ROLE RESULT=n7 @e3 | SUPPORTED: e3: 生成 REQUIRED; c7: ROLE PERFORMER=n6 @e3; c8: ROLE RESULT=n7 @e3 | SUPPORTED: O/bf:fe11db67a84e287df896, A/bf:113952af223963342b18, P/bf:d5dee806a1da337675d4 | e3, c7, c8：OPS独立必须生成port。 |
| Q29-F04 | 交给QA | SUPPORTED: c6: ROLE RECIPIENT=n5 @e2 | SUPPORTED: c6: ROLE RECIPIENT=n5 @e2 | SUPPORTED: A/bf:1477d6a52691fcf6928d, P/bf:2e3b073ff5bc523a5f24 | c6：QA明确接收者，不增加复核。 |
| Q29-F05 | 两个明确读取保留 | SUPPORTED: c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: c2: ROLE INPUT_OBJECT=n2 @e1; c3: ROLE INPUT_OBJECT=n3 @e1 | SUPPORTED: I/bf:228d2d3ac7f4848758db, I/bf:7f4e2f20f6e66d29708c, A/bf:f7b2e6d42837ce627e0f | c2, c3：I两文件独立接受。 |
| Q29-F06 | 独立port.md生成保留 | SUPPORTED: c8: ROLE RESULT=n7 @e3 | SUPPORTED: c8: ROLE RESULT=n7 @e3 | SUPPORTED: O/bf:fe11db67a84e287df896, A/bf:113952af223963342b18 | c8：port O接受。 |
| Q29-F07 | 它有east/west竞争，交付用途UNRESOLVED；不按最近选择west | SUPPORTED: n4: 它; c5: ROLE OBJECT=n4 @e2 | SUPPORTED: n4: 它; c5: ROLE OBJECT=n4 @e2 | SUPPORTED: A/bf:1477d6a52691fcf6928d | n4, c5：east/west竞争保留，未选择west，交付对象及事件聚合未决。 |
| Q29-F08 | 不得污染明确读取、PM/QA关系可确定部分和独立OPS生成 | SUPPORTED: c1: ROLE PERFORMER=n1 @e1; c4: ROLE PERFORMER=n1 @e2; c6: ROLE RECIPIENT=n5 @e2; c7: ROLE PERFORMER=n6 @e3 | SUPPORTED: c1: ROLE PERFORMER=n1 @e1; c4: ROLE PERFORMER=n1 @e2; c6: ROLE RECIPIENT=n5 @e2; c7: ROLE PERFORMER=n6 @e3 | SUPPORTED: A/bf:f7b2e6d42837ce627e0f, A/bf:1477d6a52691fcf6928d, A/bf:113952af223963342b18, P/bf:b91fe283a2015257ac54, P/bf:aa3574178e6b7f146ee0, P/bf:2e3b073ff5bc523a5f24, P/bf:d5dee806a1da337675d4 | c1, c4, c6, c7：明确PM/QA/OPS关系接受，读取和生成无污染。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。

## repeat-2/Q30

请PM读取east.csv和west.csv，再把前一个文件交给QA；另请OPS-01生成port.md。

第三次明确指代正确，与前两次等价；角色类别疑点没有感染用途。最终Q30三次均完整正确。

原始完整证据：[Trace](runs/repeat-2/Q30/run/trace.json)；结构检查 CHECKS_PASS，不代表语义通过。

| Fact | 原文预期 | 首候选 | 最终候选 | 最终交付 | 原始引用及理由 |
|---|---|---|---|---|---|
| Q30-F01 | PM / 读取 / east.csv和west.csv / REQUIRED | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: evt_read: 读取 REQUIRED; cl_read_pm: ROLE PERFORMER=ent_pm @evt_read; cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: I/bf:e037a1c0e5db2c44eea0, I/bf:9d46f70ed52594ba2be7, A/bf:6dc67daf52974e79a787, P/bf:7999136e8737870ef1d2 | evt_read, cl_read_pm, cl_read_east, cl_read_west：PM读取east/west义务明确。 |
| Q30-F02 | PM / 交给 / east.csv / REQUIRED | SUPPORTED: evt_handover: 交给 REQUIRED; cl_handover_pm: ROLE PERFORMER=ent_pm @evt_handover; cl_handover_east: ROLE OBJECT=ent_east @evt_handover; cl_order: TEMPORAL ORDER AFTER @evt_handover | SUPPORTED: evt_handover: 交给 REQUIRED; cl_handover_pm: ROLE PERFORMER=ent_pm @evt_handover; cl_handover_east: ROLE OBJECT=ent_east @evt_handover; cl_order: TEMPORAL ORDER AFTER @evt_handover | SUPPORTED: A/bf:80108702f3f0bdca414e, P/bf:c7a153c417135c5595c8, P/bf:f2e0cfef88cc4635c61d | evt_handover, cl_handover_pm, cl_handover_east, cl_order：读取后PM交给east，明确顺序指代。 |
| Q30-F03 | OPS-01 / 生成 / port.md / REQUIRED | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: evt_generate: 生成 REQUIRED; cl_generate_ops: ROLE PERFORMER=ent_ops @evt_generate; cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: O/bf:a527aa5bc903e17bf675, A/bf:ece4e366a8540e15e9fd, P/bf:5ac149b5f4c2b5b498e4 | evt_generate, cl_generate_ops, cl_generate_port：OPS独立生成port。 |
| Q30-F04 | 交给QA | SUPPORTED: cl_handover_qa: ROLE RECIPIENT=ent_qa @evt_handover | SUPPORTED: cl_handover_qa: ROLE RECIPIENT=ent_qa @evt_handover | SUPPORTED: A/bf:80108702f3f0bdca414e, P/bf:f2e0cfef88cc4635c61d | cl_handover_qa：QA只接收east。 |
| Q30-F05 | 两个文件读取 | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: cl_read_east: ROLE INPUT_OBJECT=ent_east @evt_read; cl_read_west: ROLE INPUT_OBJECT=ent_west @evt_read | SUPPORTED: I/bf:e037a1c0e5db2c44eea0, I/bf:9d46f70ed52594ba2be7, A/bf:6dc67daf52974e79a787 | cl_read_east, cl_read_west：两个文件I保留。 |
| Q30-F06 | port.md | SUPPORTED: cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: cl_generate_port: ROLE RESULT=ent_port @evt_generate | SUPPORTED: O/bf:a527aa5bc903e17bf675, A/bf:ece4e366a8540e15e9fd | cl_generate_port：port O保留。 |
| Q30-F07 | 前一个唯一指east，交付用途应闭合；不是交付两文件 | SUPPORTED: ent_east: east.csv; cl_handover_east: ROLE OBJECT=ent_east @evt_handover | SUPPORTED: ent_east: east.csv; cl_handover_east: ROLE OBJECT=ent_east @evt_handover | SUPPORTED: I/bf:e037a1c0e5db2c44eea0, A/bf:80108702f3f0bdca414e | cl_handover_east, ent_east：前一个与east同一实体，交给用途完整接受。 |
| Q30-F08 | 不沿用Q29歧义或选择west | SUPPORTED: evt_handover: 交给 REQUIRED; cl_handover_east: ROLE OBJECT=ent_east @evt_handover | SUPPORTED: evt_handover: 交给 REQUIRED; cl_handover_east: ROLE OBJECT=ent_east @evt_handover | SUPPORTED: A/bf:80108702f3f0bdca414e, P/bf:c7a153c417135c5595c8, P/bf:f2e0cfef88cc4635c61d | evt_handover, cl_handover_east：没有west/两份交付或虚构歧义，没有新增复核。 |

所有候选节点/主张及逐项独立审阅结论在 CASE-RESULTS.json 的 first_inventory / final_inventory，含技术接受状态和原始来源。
