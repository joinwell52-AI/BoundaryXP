# SWAI-001 / REAL-GOLD-003

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- src/fcop/project.py 中：
  - write_task
  - write_report
  - write_issue
- 对应 active 与 log/archive 的 task/report/issue 文件集合
- 三个对应测试文件

O — RESOLVED
- 私有 helper `_existing_filenames_for_seq`
- 三个 writer 的 union-scan 修复
- 三个 `seq_skips_archived` 回归测试

A — RESOLVED / REQUIRED
- 新增 `_existing_filenames_for_seq`
- write_task 同时扫描 tasks_dir + log/tasks
- write_report 同时扫描 reports_dir + log/reports
- write_issue 同时扫描 issues_dir + log/issues
- 新增三项 archived-basename sequence 回归测试

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ISSUE-20260427-003-ME.md
- TASK-20260427-002-ADMIN-to-ME.md
- src/fcop/project.py 对应现状代码位置

C — RESOLVED
AND:
- 三份新测试通过
- 原有 587 passed 不退
- ruff clean
- 两件人工 rename 文件不被误伤

B — RESOLVED
- FORBIDDEN 引入 `.archived/<id>.tombstone`
- FORBIDDEN 修改 `next_sequence()` 本身语义
- O_EXCL 原子预占逻辑保持不变
- retry 限保持不变

