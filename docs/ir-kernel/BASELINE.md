# BXP-IR-KERNEL-CLOSURE-001 基线与改动

任务包：`BoundX-IR-Kernel-Implementation-v1.0.zip`，SHA-256 `bd05bb768f1a79b8bb9747140a17a1cb16f5329fcd449064cc37198f63dc8f4a`。原始任务书、计划及验收矩阵逐字节保存在 `docs/tasks/7plus1/BXP-IR-KERNEL-CLOSURE-001/`。

主工作区为 `D:\boundx`，HEAD `e25ad6a139f7649e3c8067627d1a83a06223fff4`，已有大量未提交改动。开发采用其下隔离 worktree，分支 `work/ir-kernel-closure-001`，起点为 `ec5706c693752fffc8ba5beab76a69d1c57c3708`。没有 reset、clean、stash 或覆盖主工作区。任务包中的远端参考提交没有用作覆盖来源。

本次新增 `src/bxp/ir-kernel`，使用新候选合同 `candidate-ir/2.0`；原 `candidate-ir/1.4`、Skill、skill1 原文件保持原样。原计算、投影和摘要入口增加显式2.0适配；1.4仍走独立兼容路径，不声称已全部迁移。实际生产安装为 `0.1.0-candidate.031-r1.2-ui.82`，manifest摘要始终为 `d02f77af82e75c2d1717bab385bc50b7e0b51808269f21f763e95f5c9d839242`。

冻结001、002两份和004两份原Trace，五份原始字节及审阅摘要均保留。目录、摘要及原始状态见 [BASELINE.json](BASELINE.json)。回放输出单独保存，不回写历史结果。

收尾时主工作区新增47条未跟踪文件状态，均为005—010及新的测试套件文件。本次未读取其内容、未纳入候选、未改写它们。初始Git状态条目没有减少或变更；因此不宣称主工作区状态摘要完全相同。精确差异及安装、四份原Skill、五份Trace的摘要复核见 [PRESERVATION.json](evidence/PRESERVATION.json)。Git状态比较不是对所有未冻结文件的逐字节证明。

求解依赖锁定 `z3-solver@5.2.0`，官方Z3 Node/WASM，MIT；完整性及WASM、许可摘要见 [依赖证据](evidence/solver/Z3-DEPENDENCY.json) 与 package-lock.json。依赖只在隔离目录安装。现有依赖审计提示没有通过自动升级消除；本次没有更换账号、模型、代理或计费配置。

本轮被测解析／审阅／修订调用0；58618服务变更0；新监听端口0。终态为隔离候选待审，生产安装未升级。
