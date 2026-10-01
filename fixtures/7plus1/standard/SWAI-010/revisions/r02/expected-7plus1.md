# SWAI-010 / ADMIN adjudication r02

GOLD_7PLUS1_CONFIRMED

授权：docs/tasks/7plus1/7P-STANDARD-003.md。原 r01 文件保持不变。以下字段来自 ADMIN 003；OUTPUT_CONTENT 是交付内容约束，不是当前执行授权。

## I — RESOLVED

- TASK-20260522-006
- agent bringup prompt 相关文件
- README
- MCP resource registry
- release_audit.py
- inventory_drift.py

## O — RESOLVED

- 修订版 agent-bringup-prompt.zh.md
- 修订版 agent-bringup-prompt.en.md
- 两种新建场景表
- §1～§6 内容
- README 索引
- 条件允许时 MCP resources
  - modality: "CONDITIONAL_REQUIRED"
  - condition: {"operator":"AND","operands":[{"value":"当前架构允许"},{"value":"无需改变 mcp 包结构"}]}
- REPORT-007
- TASK-006 / TASK-007 archive

OUTPUT CONTENT REQUIREMENTS（共同约束中英文 prompt）：

- OCR-01: 不锁固定版本号
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-02: 每步报告并停
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-03: MCP/Python API 边界
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-04: ADMIN 选择初始化模式
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-05: 实际 ls 物理验证
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-06: fcop_audit
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-07: P0 != 0 时停止并报告 ADMIN
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-08: 不把 tool 返回 OK 当成物理成功
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-09: 不猜 API
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- OCR-10: 不自动整改 P0
  - modality: "REQUIRED"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}

## A — RESOLVED

- 编写/修订 zh prompt
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 编写/修订 en prompt
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 加 README 索引
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 运行 release_audit.py
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 运行 inventory_drift.py
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 写 REPORT-007
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- archive TASK-006 + TASK-007
  - modality: "REQUIRED"
  - scope: {"kind":"CURRENT_TASK"}
- 注册 MCP resource
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

- TASK-20260522-006
  - temporal_status: "SUPERSEDED"
  - current_requirement: false
  - superseded_by: "TASK-20260522-007"
  - notes: "TASK-007 supersedes TASK-006；旧固定 ==3.0.2 要求仅保留 provenance，不再作为当前有效要求。"
- Python >= 3.10
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- 最新版、不固定 package version
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}

## C — RESOLVED

- 原 9 条 Acceptance Criteria 全部满足
  - condition: {"operator":"AND","operands":[{"acceptance_criterion":1},{"acceptance_criterion":2},{"acceptance_criterion":3},{"acceptance_criterion":4},{"acceptance_criterion":5},{"acceptance_criterion":6},{"acceptance_criterion":7},{"acceptance_criterion":8},{"acceptance_criterion":9}]}
  - scope: {"kind":"CURRENT_TASK"}

## B — RESOLVED

- FORBIDDEN 生成的 prompt 写死 `==X.Y.Z`
  - modality: "FORBIDDEN"
  - target: "agent-bringup-prompt output"
  - scope: {"kind":"OUTPUT_CONTENT","target":"agent-bringup-prompt","output_targets":["agent-bringup-prompt.zh.md","agent-bringup-prompt.en.md"]}
- 不改 agent-install-prompt.zh.md
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不动 LETTER-TO-ADMIN.md
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不改协议规则
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不发版
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}
- 不做工具层防呆
  - modality: "FORBIDDEN"
  - scope: {"kind":"CURRENT_TASK"}

