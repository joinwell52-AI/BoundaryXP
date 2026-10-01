# SWAI-003 / REAL-GOLD-017

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- failure.schema.json
- models.py
- core/recovery.py
- project.py
- failure/recovery 测试
- ADR-0019

O — RESOLVED
- Failure / Recovery dataclasses
- FailureType / RecoveryAction / SessionRecoveryAction
- 5 类 recovery reference implementation
- Project.report_failure
- Project.apply_recovery
- Project.recover_session
- event stub
- ADR/REPORT 更新

A — RESOLVED / REQUIRED
- 实现 Failure/Recovery 模型
- 实现五类恢复
- 支持两类 session_id
- recover_session 支持 resume/rollback/abort
- schema 对齐
- 测试/public surface/ADR/REPORT 收口

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ADR-0019
- ADR-0015
- failure.schema.json

C — RESOLVED
- A1–A12 全部满足
- 四个 commit 完成

B — RESOLVED
- Failure/Recovery 不写成文件 envelope
- ROLLBACK 不实际执行 git revert
- 不实现真实 Event 推送
- recover_session 不接受 RETRY / ESCALATE
- 不实现 DRIFT 自动检测
- 不实现完整 LLM session
- 不做 MIGRATION-1.0.md 本任务外内容

