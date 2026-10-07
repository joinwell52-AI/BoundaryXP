# 7P-SHORT-COMPILER-ACCURACY-030

受测029：`ca86e87ea5b07ca770948e5e1231ae9972542ff5`，029-c4 / 028-r02.3，请求gpt-6.1-sol/medium。

最终交付完整正确 **22/30**；FAIL 6，REVIEW_REQUIRED 2，ENV_FAILED 0，NOT_RUN 0。30次首次及10次额外真实运行全部保留；15份重复观察中 4/5 组全部正确。确认存在反例，不能作为无需审阅的自动业务依据。

`SHORT_ACCURACY_030=TEST_COMPLETED`
`ACCURACY_030=FAIL_IN_TESTED_SET`
`STATUS=WAITING_ADMIN_REVIEW`

| 评分层 | 完整正确/30 |
|---|---|
| 首次LLM候选 | 27/30 |
| 产品有界修订后的最终候选 | 28/30 |
| Canonical JSON | 26/30 |
| 最终交付（含中文） | 22/30 |

Q23内置一次语义修订，不是第二次挑答案；首候选错误仍计入首次指标。Q22/Q23的O用途解释保留待审，不通过事后改预期计PASS。

## 确认问题

- Q15：同一当前任务的生成许可漏PM执行者，审阅器未纠正，下游接受。
- Q19：复核前提绑定“本次报告”独立实体，提交绑定check.md，缺同一报告身份关联；SUPPORT和技术接受未能阻断。
- Q08/Q09/Q15/Q17：NOT_REQUIRED的中文只显示动作，丢主体或文件对象。
- Q10：两个不同事件完成状态在中文变成同名“已完成”，丢复核/更新事件区别。
- Q23首候选：提交文件被误赋INPUT_OBJECT，经原审阅阻断并有界修订纠正；最终O合同问题仍待审。
- Q22/Q23：提交现有文件是否必须另外投影O；来源动作/完成方向保留，但方法与冻结预期留解释空间，交ADMIN裁定。

4个整份正确最终候选在中文交付损坏（Q08, Q09, Q10, Q17）；5案有正确语义组件在渲染损坏；2案错误最终候选被技术接受（Q15, Q19）。类别/事实可重叠，完整证据见[FAILURES](FAILURES.md)及[逐案对照](CASE-RESULTS.md)。

本测试集确认的最终错误没有无依据新增义务/许可、遗漏明确禁止或必要条件方向改写；这只限定于本轮30案，不证明其他文本不会发生。Q19为必要条件对象绑定错误，不能拿方向NECESSARY正确掩盖它。Q29局部真歧义正确保留也计PASS。

重复运行中另外确认的错误见REPEATS/FAILURES：repeat-1/Q25 数量合同表达错误（共享合同要求OUTPUT_CONTENT.target_id为报告RESULT。模型候选和审阅未遵守该字段合同；技术拒绝有效但最终任务要求未完整交付。不是修改编译器或降低状态就通过。）。首次准确率保持首轮结果，不用重复中的最好输出替换。

## 实际运行与隔离

- 40次完整产品运行，82次真实模型请求（parse 41 / audit 41）；1次运行有产品内部修订，格式/传输重试 0；未用冻结候选回放替代真实重复。
- 82个新会话，重复会话0、工具调用0、请求预期泄露检查0；源文payload、Skill bundle、Schema、CLI二进制与请求摘要实际核对。解析/审阅输入不含case ID或预期。
- 两Skill以INLINE_BUNDLE交付；native Skill加载NOT_VERIFIED。CLI codex-cli 0.160.1；服务未披露实际模型/权重，保持NOT_DISCLOSED，不把请求名当证明。
- 串行运行累计 75.0分钟；请求中位数 53.7秒，最大 89.1秒。usage见[调用审计](CALL-AUDIT.json)。
- 40次原文、引用、精确码点span和结构检查均CHECKS_PASS；73项离线逻辑/数量检查，1项失败（真实输出中的差异保留，不修到通过）；90项局部字段检查只提供审阅旗标，不等于准确率。评测器更正见[EVALUATOR-NOTES](../../../../research/7plus1-parser/accuracy-030/EVALUATOR-NOTES.md)。

## 不变项与交付

029运行资源、两个Skill、模型配置、合同/Schema/投影未改；160项原有本地tracked改动及5868项原有untracked路径保留。58618不重启、不替换、不写入用户历史；前后只读状态见UI-BEFORE/AFTER及POST-RUN-AUDIT。旧029及更早封存不覆盖。

[RUN-MANIFEST](RUN-MANIFEST.json)冻结输入/预期/受测资源；[EXPECTED-FACTS](EXPECTED-FACTS.json)为运行前180项来源账本；[CASE-RESULTS](CASE-RESULTS.json)逐事实首/最终/Canonical/中文及全部节点库存；[REPEATS](REPEATS.md)记录5组3次；runs目录保存40份完整原始逐阶段请求、响应、审阅、技术结果、Boundary IR、7+1和中文。摘要清单/SEAL只证明证据字节完整，不证明语义正确。

评审者是执行Codex，不是ADMIN签字或独立人工Gold。30案为目的选择的短任务机制测试，不是随机业务抽样，不推断全部自然语言总体准确率。

`Parser修改=false`；`Gold修改=false`；`Source修改=false`；`PRODUCTION_READY=false`。仅推送review/7plus1-parser，不merge/release/tag；测试完停止等待ADMIN Review，不自动修复。

当前短文本范围可继续作为人工核对工具使用；本轮已确认关键绑定与交付缺陷，产品正式准确性验收尚未通过。最新追加产品交付合同已读取，030停止规则不变，未启动后续修复。
