# 当前 7+1 编译器任务

**当前任务：** `7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F`

任务书：

`docs/tasks/7plus1/7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F.md`

所属主任务：`7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG`

规范手册：

`docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.1.md`

前序证据：

`docs/reports/7plus1/7P-SEMANTIC-PARSER-FEASIBILITY-026E/REPORT.md`

026E 证据提交：`4dea24229f4189bb699bd1eef621bf928a0882b7`

仓库：`joinwell52-AI/BoundX`

唯一工作及推送分支：`review/7plus1-parser`

## 执行要求

先保护本地已有改动，非破坏性同步并读取本指针、026F 任务书及所列证据。026E 原封存不变；026 的扩大修复继续暂停。

本次只做来源复核的候选语义图到 Γ、边界资格、边界中间表示、7+1 与证明链的有界验证和隔离修复。十份旧诊断图先复核预期，另配十二条语义对照与五条结构故障检查；不改模型，不扩大候选生成，不新增盲测集，不改变手册语义，不直接改活动 026 或切生产。

诊断入口与自动入口共用实际语义核心；诊断来源必须显式标记，不能伪造生成器收据或关闭生产 G8。原入口 0/10 与旧语义诊断 7/10 分开记录，不以凑满 10/10 为目标修改答案。

按任务书完成固定修复周期及复测后，报告 `DOWNSTREAM_SEMANTIC_026F=PASS / FAIL / REVIEW_REQUIRED / ENV_BLOCKED` 之一，并停止于 `WAITING_ADMIN_REVIEW`。不自动恢复 026 扩大研发，不开始 027；不 merge、release、tag 或切换生产入口。
