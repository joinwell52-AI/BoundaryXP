# 条件参照时序与非文件交付修复

## 结论

同一原文真实复测并逐来源核对12/12通过。O保留PM向ADMIN交付的统一汇报内容；明确时序进入计算。联合有限抽象约束有解，61项见证检查通过，无计算缺口。四项检查执行者未指定的事实仍保留，不代填PM或DEV/OPS。

58618升级至ui65 / 031-r1-c37；HTTP页面、会话、运行资源及历史导出检查通过。64项历史原样保留，首次失败未覆盖。不以本次单案通过宣称全部产品语义验收完成。

## 源码根因与通用修改

- 实际安装源码`research/7plus1-parser/llm-first-028/calculus.mjs`中`orderEndpointProof`只接受CURRENT_TASK/MAIN。修复为：条件参照必须为CONDITION/MENTION_ONLY/UNSTATED、正向、独立审阅和技术证明接受，并与唯一明确完成STATE及COMPLETION/IFF签名闭合，才能贡献参照里程碑。不支持的引文、否定、OR竞争和未认证结构仍保留缺口。
- `joint-results.mjs`将上述完成STATE作为时序点，要求目标执行时前提已成立；不为参照事件生成当前任务激活变量或新提交义务。业务授权仍为空。
- 两个Skill及共享合同原先重点举“提交文件”，漏掉非文件交付。现在明确DELIVERABLE也可表示原文明示的汇报、答复或说明内容，不要求文件名，不增加生成、修改、外部输入或内容细目。程序仍只消费结构字段，不扫描原文补O。
- ROOT未提交改动保持原样。完整修复消费者和资源位于版本包与`condition-report-ui65-overlay.json`；没有用开发目录的混版资源启动服务。

## 首次与修订结果

`FIRST-RUN.json`、`FIRST-TRACE.json`保存用户首次真实运行：354.537秒、O ABSENT、PARTIAL，原因ORDER_ENDPOINT_LAYER_NOT_CURRENT_MAIN。

`CONSUMER-REPLAY.json`用完全相同的旧IR验证程序端修复：计算无缺口、有解；该回放没有修复模型的O遗漏，明确不宣称语义全部正确。

`live-source-retest/`保存新版本真实解析和独立审阅。首轮候选修好O，但遗漏“最后”对之前全部工作的时序范围；独立审阅检出，按现有有界流程做一次局部Patch，再由新会话审阅。首次候选、失败意见、Patch和再审阅全部保留。没有重新整图生成或选择最好结果。

最终I/O/A/P有明确结构；R/V/C/B没有源文明示的对应要求，保持ABSENT。报告提交为条件参照，不新增独立提交义务。明示范围、角色和最后汇报的前置关系逐项见`SOURCE-REVIEW.json`及`RESULT.zh-CN.md`，完整Trace见`live-source-retest/trace.json`。

## 验证和实际限制

- 机制与既有数学自检58/58通过，其中新增8项条件时序正反检查。
- 既有时序兼容检查12/12通过；父版本也是12/12。
- 比较回归：父/新版本均260项、218通过、42项既有失败；新增失败0。全量回归不能写0 FAIL。
- 标准001的同一已审阅IR回放保持联合可满足、完成目标与高危分支结果，无新增缺口。不是新Skill在标准001上重新真实调用通过。
- 干净安装、升级、回滚4/4通过。安装版CLI用本次同一真实响应回放核对JSON与计算结果，不额外调用模型。
- 本次4个真实外层调用：初次解析、独立审阅、局部Patch、新会话再审阅。实际模型未由回执披露，不能把请求模型写成服务端实际模型。调用耗时和回执见CALL-LEDGER.json，不推断收费次数，不重置历史账本。
- 用户页面实际点击编译冒烟未执行；此前浏览器操作策略拒绝未绕过。页面HTTP、会话、同版资源、历史及Trace导出已实际检查。

## 使用与回滚

地址：http://127.0.0.1:58618/ 。刷新后使用新版本重新编译；原历史失败结果仍保持原样。

启动：在`D:\boundx`执行`npm run 7plus1:ui`。完整运行包为本目录下`0.1.0-candidate.031-r1.2-ui.65.zip`；实际安装为`.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.65`。

受控升级备份：`.boundx/short-compiler-031-r1/backups/2026-10-12T03-55-32.452Z`。需要回滚时先确认目标无在途请求、正常停止本次目标实例，再执行安装版`product/short-compiler/deploy.mjs rollback --home D:\boundx\.boundx\short-compiler-031-r1 --confirmed-idle`，最后用原启动命令启动。回滚保留历史，不重算旧结果。

PRODUCTION_READY=false；business_decision=null；execution_authorization=null。不修改Gold、标准原文或已封存结果；只推送review分支，不merge/release/tag。结束于WAITING_ADMIN_REVIEW。
