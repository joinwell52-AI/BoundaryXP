# 固定复测与回放审计 / Repeat and replay audit

验收运行器对任务书固定30组复测单独报告；不增加模型调用，不将复测相同解释为语义正确。

The acceptance runner reports the thirty fixed repeat pairs separately, without extra model calls or treating equality as semantic correctness.

- 每个成功进入Core的候选使用相同生产者身份再次本地求值，记录任务、结果与诊断的摘要。MATCHED仅证明本次同输入回放一致；MISMATCH必须调查。未进入Core记NOT_APPLICABLE。
- 复测按case ID配对。缺记录、不同上下文、不同模型、live/mock混用和失败输出均明确报告，不能从30组分母移除。
- 原始文本、完整结构、计算结果分别比较。结构保留局部ID、顺序、证据、语义引用和关系；结构不等不自动表示语义错误。
- 未知模型版本仍写unknown。统计不认证运行记录来源，不代替独立审阅，acceptance_passed始终false。

Successful candidates are replayed locally with identical producer metadata. Missing pairs, changed contexts/models and failed outputs remain visible. Exact structure comparison retains IDs and ordering; a difference is not automatically an extraction error. Unknown model versions remain unknown. These engineering checks neither authenticate records nor certify acceptance.

使用[验收运行器](ADMIN-ACCEPTANCE-RUNNER.md)原命令，最终summary.json增加repeats和deterministic_replay；单次record.json保留比较摘要。所有记录仍位于忽略目录，不包含密钥。

Use the existing runner command. Its final summary includes repeat pairs and replay counts; individual records retain comparison digests. Credentials are not recorded.
