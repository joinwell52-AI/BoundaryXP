# SWAI-010 / REAL-GOLD-050

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- TASK-20260522-006
- agent bringup prompt 相关文件
- README
- MCP resource registry
- release_audit.py
- inventory_drift.py

O — RESOLVED
- 修订版 agent-bringup-prompt.zh.md
- 修订版 agent-bringup-prompt.en.md
- 两种场景表
- §1～§6
- README 索引
- 可选 MCP resources
- REPORT-007
- TASK-006/TASK-007 archive

A — RESOLVED / REQUIRED
- 使用不锁版本的升级方式
- 每步执行后报告并停
- 明确 MCP/Python API 边界
- ADMIN 决定初始化模式
- 实际 ls 做物理验证
- fcop_audit
- P0 非零时停止并报告
- README 索引
- 两项 audit
- archive 006+007

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT / DECISION_MAKER]

R — ABSENT

V — RESOLVED
- TASK-20260522-006 为 superseded predecessor
- Python >= 3.10
- 当前规则采用“最新版”，不是固定 package version

C — RESOLVED
- 9 条 Acceptance Criteria 全满足

B — RESOLVED
- TASK-006 中固定 `==3.0.2` 要求已 superseded，不再有效
- FORBIDDEN 写死 `==X.Y.Z`
- 不改 agent-install-prompt.zh.md
- 不动 LETTER-TO-ADMIN.md
- 不改协议
- 不发版
- 不做工具层防呆
- agent 不得自动进入下一步
- 不得默认 init
- 不得把工具返回 OK 当物理成功
- P0 != 0 时不得自行整改

