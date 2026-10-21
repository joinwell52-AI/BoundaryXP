# SWAI-009 / REAL-GOLD-049

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- src/fcop/rules/_data/
- agent-install-prompt.zh.md
- README.md / README.zh.md
- MCP resource registry
- release_audit.py
- inventory_drift.py

O — RESOLVED
- agent-bringup-prompt.zh.md
- agent-bringup-prompt.en.md
- README 双语索引
- 可选 MCP resources
- REPORT-006

A — RESOLVED / REQUIRED
- 编写 bringup prompt
- 环境检查
- 升级目标版本
- 区分 MCP 工具和 Python API
- 加 anti-pattern
- ADMIN 选择后初始化
- 物理验证
- audit
- README 索引
- 条件允许时注册 MCP resource

P — RESOLVED
- ME [PERFORMER]
- ADMIN [RECIPIENT / DECISION_MAKER]

R — ABSENT

V — RESOLVED
- Python >= 3.10
- fcop 与 fcop-mcp 目标版本必须一致
- 3.0.2 lifecycle bug 作为验证依据

C — RESOLVED
- 8 条 Acceptance Criteria 全满足

B — RESOLVED
- 不改 agent-install-prompt.zh.md
- 不动 LETTER-TO-ADMIN.md
- 不做工具层 anti-pattern 防呆
- 不发新版本
- 不改协议规则
- agent 每步不得自动跳下一步
- 不得猜 API
- init 不得替 ADMIN 默认选择

