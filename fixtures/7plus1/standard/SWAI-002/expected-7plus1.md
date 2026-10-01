# SWAI-002 / REAL-GOLD-015

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- 7 份 spec/schemas/*.schema.json
- src/fcop 相关 schema/review 模块
- 0.7.x legacy TASK/REPORT/ISSUE
- tests 与 public surface snapshot

O — RESOLVED
- JSON Schema validator
- wheel 内 bundled schemas
- REVIEW dataclass
- ReviewDecision / ReviewSubjectType
- Project.write_review/read_review/list_reviews/archive_review
- schema/review 测试
- public surface snapshot
- CHANGELOG
- REPORT-004

A — RESOLVED / REQUIRED
- bundle 7 schemas
- 实现 jsonschema validator
- 实现 REVIEW 全链
- 更新 public surface
- 完成测试
- 按 3 commit 收口

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ADR-0015
- ADR-0016
- ADR-0017
- ADR-0001
- ADR-0003

C — RESOLVED
- Acceptance A1–A10 全部满足
- pytest 全绿后才 commit

B — RESOLVED
- FORBIDDEN 把 validator 强制接入已有 write_task/write_report/write_issue
- FORBIDDEN 实现 TASK-005～TASK-011 范围
- FORBIDDEN 加入 v1.2 REVIEW 特性
- FORBIDDEN 修改已有 dataclass 字段类型
- public surface 不得出现 deleted/renamed

