# SWAI-004 / REAL-GOLD-019

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- legacy docs/agents workspace
- 目标 fcop/ workspace
- fcop CLI
- git tracked/untracked workspace 路径
- advisory files

O — RESOLVED
- `fcop migrate-workspace`
- dry-run/apply 能力
- MIGRATED_FROM_DOCS_AGENTS.md breadcrumb
- 测试
- ADR/REPORT 更新

A — RESOLVED / REQUIRED
- 实现 migrate-workspace 子命令
- 默认 dry-run
- --apply 才移动
- tracked path 使用 git mv
- 非 tracked 使用 fallback
- advisor scan
- 保持 bare fcop legacy 行为

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- ADR-0022
- ADR-0015

C — RESOLVED
- 8 条 acceptance criteria 全部满足

B — RESOLVED
- dry-run 不得修改磁盘
- both-exist 必须 ABORT / exit 2 / 不动盘
- advisor scan 不得自动修改 .gitignore/README 等
- 不实现 Project Phase 2
- 不新增 runtime dependency

