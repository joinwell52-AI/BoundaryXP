# 确认错误与待审项

独立来源审阅，不以模型SUPPORT为判真依据。每项保留首错层和实际字段；待审不计PASS，类别可重叠。

## first/Q08 / Q08-RENDER-01 — ERROR

- 类别：来源/渲染错误；首错层：RENDERING；影响：delivered。
- 原文：本任务不要求QA复核
- 实际：无需 复核（不等于禁止）
- 原因：免除义务的执行角色和目标已在候选与JSON明确，中文没有渲染；只保留谓词不是该指定免除事实的完整中文表达。
- 事实：Q08-F07；主张：evt_review, cl_review_reviewer, cl_review_object。
- [完整Trace](runs/first/Q08/run/trace.json)

## first/Q09 / Q09-RENDER-01 — ERROR

- 类别：来源/渲染错误；首错层：RENDERING；影响：delivered。
- 原文：QA仅负责接收该报告，不负责执行核对
- 实际：无需 执行核对（不等于禁止）
- 原因：只免除QA的核对职责，中文省略QA，不能完整区分QA职责免除与DEV仍须核对。
- 事实：Q09-F05；主张：e4, c8。
- [完整Trace](runs/first/Q09/run/trace.json)

## first/Q10 / Q10-RENDER-01 — ERROR

- 类别：来源/渲染错误；首错层：RENDERING；影响：delivered。
- 原文：请QA复核并更新这份报告，PM再将更新后的同一报告提交给ADMIN
- 实际：时间先后 之后 AND(已完成(QA,report-a.md) [POSITIVE;运行值UNKNOWN],已完成(QA,report-a.md) [POSITIVE;运行值UNKNOWN])
- 原因：STATE.event_id在JSON分别指复核和更新，中文formatExpression未显示所指事件；无法从两个同名状态分辨先后所要求的两个动作。
- 事实：Q10-F07；主张：X_REVIEW_DONE, X_UPDATE_DONE, C_SUBMIT_ORDER。
- [完整Trace](runs/first/Q10/run/trace.json)

## first/Q15 / Q15-ROLE-01 — ERROR

- 类别：遗漏明确角色；首错层：LLM_PARSE；影响：first, final_candidate, canonical_json, delivered。
- 原文：请PM核对users.csv；可以另外生成optional.md
- 实际：A2=PERMITTED生成，仅C3 RESULT；U1=生成动作未另行明确执行者
- 原因：同一短任务只有PM，另外生成延续该主体；冻结预期已要求PM生成许可。审阅器没有纠正该遗漏。
- 事实：Q15-F02；主张：A2, U1。
- [完整Trace](runs/first/Q15/run/trace.json)

## first/Q15 / Q15-RENDER-01 — ERROR

- 类别：来源/渲染错误；首错层：RENDERING；影响：delivered。
- 原文：本任务不要求交付optional.md
- 实际：无需 交付（不等于禁止）
- 原因：NOT_REQUIRED的文件目标在候选/JSON存在，中文没有渲染目标，免除项不完整。
- 事实：Q15-F05；主张：A3, C4。
- [完整Trace](runs/first/Q15/run/trace.json)

## first/Q17 / Q17-RENDER-01 — ERROR

- 类别：来源/渲染错误；首错层：RENDERING；影响：delivered。
- 原文：无需生成optional.md
- 实际：无需 生成（不等于禁止）
- 原因：该文件只在非投影NOT_REQUIRED用途存在；中文不显示目标，全文无optional.md。
- 事实：Q17-F03；主张：evt_generate, cl_generate_result。
- [完整Trace](runs/first/Q17/run/trace.json)

## first/Q19 / Q19-IDENTITY-01 — ERROR

- 类别：错误对象/角色绑定；首错层：LLM_PARSE；影响：first, final_candidate, canonical_json, delivered。
- 原文：仅当本次报告通过QA复核时，允许PM向ADMIN提交check.md。
- 实际：条件state.args=[ent_report,ent_qa]；提交OBJECT/RESULT=ent_file；ent_report与ent_file分别独立且无链接；全SUPPORT/RESOLVED
- 原因：源文只有这一个报告，必要前提必须约束将提交的同一check.md。分离身份使机器条件无法与该交付物一致绑定。
- 事实：Q19-F03, Q19-F04；主张：ent_report, ent_file, cl_review_object, cl_submit_object, expr_review_pass, cl_submit_condition。
- [完整Trace](runs/first/Q19/run/trace.json)

## first/Q22 / Q22-O-REVIEW — REVIEW_REQUIRED

- 类别：交付视图合同待审；首错层：SKILL_SCHEMA_CONTRACT；影响：canonical_json, delivered。
- 原文：PM必须提交handover.md
- 实际：e1.required/c2.OBJECT=handover；O=ABSENT
- 原因：交付动作与对象保留，是否现有文件提交也必须作为O结果：v0.4产生定义与提交OBJECT例子存在解释空间；冻结预期未明确该槽位要求，须ADMIN裁定，不擅自修改预期。
- 事实：Q22-F01；主张：e1, c2。
- [完整Trace](runs/first/Q22/run/trace.json)

## first/Q23 / Q23-I-01 — ERROR

- 类别：错误槽用途；首错层：LLM_PARSE；影响：first。
- 原文：PM必须提交handover.md
- 实际：首候选c2.role=INPUT_OBJECT；首次审阅CONTRADICT；修订后OBJECT
- 原因：只指定提交对象，没有外部输入或受检用途。原审阅阻断并有界修订，首次候选不能算正确；首次用户交付用修订后结果。
- 事实：Q23-F01；主张：c2。
- [完整Trace](runs/first/Q23/run/trace.json)

## first/Q23 / Q23-O-REVIEW — REVIEW_REQUIRED

- 类别：交付视图合同待审；首错层：SKILL_SCHEMA_CONTRACT；影响：canonical_json, delivered。
- 原文：PM必须提交handover.md
- 实际：最终OBJECT=handover；O=ABSENT
- 原因：同Q22：预先账本只规定提交及完成语义，是否现有文件必须另外作为O交付结果存在方法解释空间，留ADMIN裁定，不改预期。
- 事实：Q23-F01；主张：e1, c2。
- [完整Trace](runs/first/Q23/run/trace.json)

## repeat-1/Q25 / Q25-R1-CONTRACT-01 — ERROR

- 类别：数量合同表达错误；首错层：SKILL_SCHEMA_CONTRACT；影响：first, final_candidate, canonical_json, delivered。
- 原文：生成feed-note.md，报告恰好列出2条异常记录
- 实际：cl_record_count.quantity.target_id=ent_records，count_scope=ent_report；技术CONTENT_QUANTITY_RESULT_TARGET拒绝；O/A生成REJECTED，中文没有2条约束
- 原因：共享合同要求OUTPUT_CONTENT.target_id为报告RESULT。模型候选和审阅未遵守该字段合同；技术拒绝有效但最终任务要求未完整交付。不是修改编译器或降低状态就通过。
- 事实：Q25-F02, Q25-F04, Q25-F06；主张：cl_record_count, evt_generate, cl_generate_result。
- [完整Trace](runs/repeat-1/Q25/run/trace.json)
