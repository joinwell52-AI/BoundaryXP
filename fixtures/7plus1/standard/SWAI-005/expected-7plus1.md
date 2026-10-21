# SWAI-005 / REAL-GOLD-025

GOLD_7PLUS1_CONFIRMED

I — RESOLVED
- fcop-mcp write-side 工具集合
- project binding state
- project_dir
- fcop_report()
- MCP tool schemas
- USER HOME / system root path classes

O — RESOLVED
- explicit binding guard
- protected-path deny-list
- fcop_report project_path warning
- schema binding_required 标记
- 回归测试
- 1.4 release notes / upgrade 提示

A — RESOLVED / REQUIRED
- 所有 write-side 工具增加 explicit binding guard
- protected root 检查
- report warning
- schema metadata
- 测试
- PM #50 reproduction

P — RESOLVED
- ME [PERFORMER]

R — ABSENT

V — RESOLVED
- fcop-mcp 1.4
- PM #50 事故证据

C — RESOLVED
AND:
- D1～D6 全部完成
- PM #50 复现被拒写
- USER HOME 保持 0 污染
- 全测试绿

B — RESOLVED
- 未 explicit bind 时 FORBIDDEN cwd fallback
- project_dir 精确等于 USER HOME/system roots 时 FORBIDDEN write
- home 下合法子目录不得被误伤
- FORBIDDEN 全局污染

