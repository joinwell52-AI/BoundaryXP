# 021：按 v0.3 §54 停止当前修复路线

当前终态为 `ARCHITECTURE_REVIEW_REQUIRED`。首次盲测 16/100；R01 完整闭环 20/100（+4）；R02 完整闭环 21/100（+1）。两轮实现前均冻结 minimum expected delta=5；两轮均未达到主指标门槛。第二轮缓存审阅纠正后独立对照为 33/36，不能替代完整任务闭环。

规范原文，v0.3 §54：

> 如果连续两轮 Primary Semantic Gate 没有实质改善：STOP CURRENT REPAIR LINE → Architecture Review。不能仅因为测试继续增加或局部 MATCH 增长而继续。

因此停止新增语义修补。余下执行只包含已冻结候选的保留性测试、重复性、静态审计、回归、归档和交付。021 候选不得切换为生产入口，也不撤销 020 历史验收。

## 源码证据与架构复审范围

1. `root-frames.mjs` 的词形候选/名词层过滤先于根动作框架重建。新增词形可让动作出现，却不能共同保证条件、参与者、范围和输出所有权同时闭环。ANB-010 仍缺 compare/root actor，ANB-028 内存目标仍是任务而不是健康检查事件。
2. `argument-evidence.mjs` 与 `certification-frontier.mjs` 能把 QA 报告内容绑定到唯一生成文件，ANB-004 首次闭环；但未决阻断器建立于较晚的局部对象上，早期已丢失的指代候选/跨句角色无法据此恢复。ANB-097 的真实候选来自读取的两个报告，晚期 RESULT-only 域不足。
3. `ownership.mjs` 能隔离明确文档引文，但 `output_content_ir` 对多章节/数量还只有 opaque content，ANB-066/075 的组件为空。文字保存不等于结构语义完整。未知内容 owner 与旧层语义 owner 可能产生残留诊断。
4. `certification-frontier.mjs` 建立 ROLE_NOT_ASSIGNED 状态，但 PARTICIPANT 资格与既有角色认证/投影仍可保留 PERFORMER，或者缺少 SUBMITTER/SENDER。ANB-041/049/083 不能只凭新增负角色状态宣布完整 7+1 正确。
5. `composition.mjs` / `generalization.mjs` 的数量目标认证与原事实资格需要同一证书。ANB-027/037 可同时存在 resolved scalar RESOURCE 和未决 AUX target；合同 Gate 不等于语义真值。
6. 继承的 `v0.3-p2.2-scope-consistency-repair/scope-consistency.mjs` 在 ANB-014 抛出对象缺少范围的错误，首次与两轮均保存 error。不能隐藏异常当作通过。

复审建议是先裁定统一框架认证合同：同一 task owner、predicate layer、typed argument、condition/quantity owner、participant role 和 unresolved dependencies 必须共同认证，再允许 eligibility。不得在本任务自动实施新架构，不建议继续逐短语增加修补。范围仍是 ADMIN root short task，未进入 WP、矩阵、正式 solver。

## 未关闭与方法合同疑点

ANB-047 的“无差异无需生成”不蕴含反向“有差异必须生成”；ANB-056 的 schema.sql 只在禁止修改中出现，不自动是输入；ANB-039 Source 的 test endpoint 与 Oracle 的 staging endpoint 不一致。均保留 Source/Oracle 原字节并列出，不通过修改源文或新增义务消除差异。这些疑点不抵消其余真实解析缺口。

本报告不宣称新候选成功；保留有效通用修复及所有失败供 ADMIN 裁定。
