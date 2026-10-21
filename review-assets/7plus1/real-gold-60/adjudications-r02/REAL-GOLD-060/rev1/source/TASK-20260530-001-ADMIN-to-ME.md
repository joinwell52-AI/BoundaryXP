---
protocol: fcop
version: 1
sender: ADMIN
recipient: ME
priority: P1
thread_key: fcop-352-remediation-20260530
subject: 阶段 C：误完成任务 supersede 修复（008/009 过早归档）
task_id: TASK-20260530-001
---

## 背景

FCoP 3.2.5 Redeploy 已通过。按 `FCoP更新.md` 第十五节，修正旧 Rule 0.a.1 下
「blocked REPORT 仍 archive_task」的误完成链。

## 范围

- `TASK-20260524-008` / `009`（thread: ai-must-write-it-down-20260524）
- 不修改旧 TASK/REPORT 正文（Rule 5 append-only）
- 追加带 `supersedes:` 的新 REPORT
- 将 blocked 且仍开放的 TASK 从 `fcop/log/tasks/` 恢复至 `fcop/tasks/`

## 不在范围

- `TASK-20260524-007` 的 git push（仍 blocked，等 ADMIN 二次确认）
- `010` / `011`（REPORT done，归档合理）
- 自动 finish / archive（Rule 0.a.5 / 0.a.6）

## 验收

- 008/009 TASK 回到 open 区
- 各有一条新 REPORT，`supersedes` 指向旧 REPORT
- 本阶段 TASK 有 ME→ADMIN 汇总 REPORT
