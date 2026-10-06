# 当前 7+1 编译器任务

**当前任务：`7P-LLM-SEMANTIC-COMPILER-027-LONG`**

任务书：

`docs/tasks/7plus1/7P-LLM-SEMANTIC-COMPILER-027-LONG.md`

当前规范手册：

`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.4.md`

历史规范：

`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md`

仓库：

`joinwell52-AI/BoundX`

唯一工作及推送分支：

`review/7plus1-parser`

## 方法

新主线：

```text
ADMIN 原文
→ Source Preservation + Typed Recognizer
→ Codex / LLM Semantic Parser
→ Candidate Semantic Graph
→ Coverage Auditor
→ NLP / SRL / SDP / DEP / CON / NLI 辅助证据
→ Γ
→ Eligibility
→ Boundary IR
→ Canonical 7+1
→ Proof / Coverage
```

Codex/LLM 是主语义候选生成器；NLP 不再承担主解析；Γ 是唯一最终认证点；LLM 不得直接写权威 7+1。

## 执行要求

先保护本地已有改动，非破坏性同步并完整读取本指针、v0.4 手册和 027 长任务书。

026、026E、026F、026G 作为历史证据保留，不继续在旧“传统 NLP + 构式规则拼完整语义”的路线追加补丁。

027 是全新主线长任务。在同一次授权内完成 Codex Provider、来源对齐、Candidate Graph、Coverage、NLP 辅助证据、v0.4 Γ、Eligibility、Boundary IR、7+1、Proof，以及现有350份材料的开发/锁定评测和完整交付。

不得逐阶段等待新任务；不得针对锁定105调优；不得 merge/release/tag/切生产。完成后停止于 `WAITING_ADMIN_REVIEW`，不得自动开始028。
