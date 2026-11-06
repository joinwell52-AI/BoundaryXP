# BXP 0.4 Core Gold 100 v3 — 全量适用修复候选

状态：`GOLD_CANDIDATE_FOR_REVIEW`

## v3 修复规则

- 100 / 100 用例全部是可执行/可审定的任务测试案例。
- 100 / 100 都有 `Gold 7+1`。
- 100 / 100 都有 `Formal Boundary Model`。
- 100 / 100 都有 `Boundary Result`。
- 100 / 100 的 `Admission.applicable = true`。
- 100 / 100 的 `producer_scored = true`。
- 不再用“此例不提供语义抽取标准答案”或 Admission `applicable=false` 逃避构造标准答案。
- 协议 mutation、版本绑定、Admission、Downstream Conformance 仍保留各自测试目的，但都从一个完整任务输入开始。
- Boundary/Admission digest 在 canonicalizer / binding 合同冻结前保持 `null`，不伪造摘要。

此版本用于替换 v2，不保留 v2 用例入口。
