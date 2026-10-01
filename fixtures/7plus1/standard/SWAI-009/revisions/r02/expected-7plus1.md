# SWAI-009 / ADMIN adjudication r02

GOLD_7PLUS1_CONFIRMED

授权：docs/tasks/7plus1/7P-STANDARD-003.md。原 r01 文件保持不变。以下字段来自 ADMIN 003；OUTPUT_CONTENT 是交付内容约束，不是当前执行授权。

## I — RESOLVED

- src/fcop/rules/_data/
- agent-install-prompt.zh.md
- README.md / README.zh.md
- MCP resource registry
- release_audit.py
- inventory_drift.py

## O — RESOLVED

- agent-bringup-prompt.zh.md
- agent-bringup-prompt.en.md
- README 双语索引
- 条件允许时的 MCP resource 注册
  - modality: "CONDITIONAL_REQUIRED"
  - condition: {"operator":"AND","operands":[{"value":"当前架构允许"},{"value":"无需改变 mcp 包结构"}]}
- REPORT-006
- TASK-006 archive

OUTPUT CONTENT REQUIREMENTS（共同约束中英文 prompt）：

- OCR-01: 环境检查
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-02: 版本检查/升级说明
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-03: MCP 工具 vs Python API 边界
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-04: anti-pattern 清单
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-05: ADMIN 选择初始化模式
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-06: 初始化后物理验证
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-07: audit 流程
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-08: 每一步报告后停下
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-09: 不确定时读文档而非猜 API
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-10: init 不替 ADMIN 默认选择
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}

## A — RESOLVED

- 编写 zh bringup prompt
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 编写 en bringup prompt
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 在 README.md / README.zh.md 增加索引
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 运行 release_audit.py
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 运行 inventory_drift.py
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 写 REPORT-006
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- archive TASK-006
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 注册 MCP resources
  - modality: "CONDITIONAL_REQUIRED"
  - condition: {"operator":"AND","operands":[{"value":"当前架构允许"},{"value":"无需改变 mcp 包结构"}]}
  - scope: {"kind":"CURRENT_TASK"}

## P — RESOLVED

- ME [PERFORMER]
  - target: "ME"
  - role: ["PERFORMER"]
  - scope: {"kind":"CURRENT_TASK"}

## R — ABSENT


## V — RESOLVED

- Python >= 3.10
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- fcop 与 fcop-mcp 目标版本一致
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- 3.0.2 lifecycle bug
  - role: ["PROVENANCE","VALIDATION_BASIS"]

## C — RESOLVED

- 原 8 条 Acceptance Criteria 全部满足
  - condition: {"operator":"AND","operands":[{"acceptance_criterion":1},{"acceptance_criterion":2},{"acceptance_criterion":3},{"acceptance_criterion":4},{"acceptance_criterion":5},{"acceptance_criterion":6},{"acceptance_criterion":7},{"acceptance_criterion":8}]}
  - scope: {"kind":"CURRENT_TASK"}

## B — RESOLVED

- 不改 agent-install-prompt.zh.md
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不动 LETTER-TO-ADMIN.md
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不做工具层 anti-pattern 防呆
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不发新版本
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不改协议规则
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}

