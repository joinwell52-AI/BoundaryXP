# 7P-ADMIN-SHORT-020-LONG

本轮任务结果为 `ADMIN_SHORT_GENERALIZATION_VALIDATED`，状态为 `WAITING_ADMIN_REVIEW`。结论限于任务书规定的标准化 ADMIN 短任务测试域，`PRODUCTION_READY=false`，生产入口未切换。

基线为 `ce4c3b598701f642cab3df37356b6275bf7e53f3`，019 实现基线为 `4d358fa5de5f224865fe7592459b06b9c6216204`。实施前完整阅读当前指针、任务书、ADMIN 授权、v0.3 方法及 019 失败证据。旧封存、历史 Gold、Source、Pack、模型、v0.3 定义和确定性投影均保留原字节。`PROTECTED-ASSETS-AUDIT.json` 核对启动时 13,593 个跟踪文件，变化为 0；启动前已有的工作区改动没有纳入本轮提交。

## 实现

新候选位于 `research/7plus1-parser/v0.3-admin-short-020/`，共享既有编译合同、Eligibility、Boundary IR、投影与 Proof 实现。主入口为该目录的 `parse7Plus1()`；真实 HanLP/spaCy 链路运行，不使用 LLM、Gold 输入或模拟中间结构。

1. `lexical.mjs` 与 `root-frames.mjs`：通用谓词词形/语义归一化，保留原始谓词 span、模态和论元。标识符与引号内容不能因包含谓词字样泄漏为执行动作。
2. `generalization.mjs`：显式范围排除与限制生成有来源、范围和 owner 的限制关系，避免把“不在”当正向动作。重试数量通过唯一兼容执行域绑定，区分 GTE/LTE/EQ、时间、观察窗口与成功次数；内部 `RETRY_COUNT` 分类不改变公开 COUNT Schema。
3. `typed-composition.mjs`、`composition.mjs`：唯一已生成产物的局部指代和有时序条件的发送/汇报，保存 actor、recipient、artifact、condition 与证明路径；多候选保持未决。显式输出引用归属于产物内容，不把引用中的命令当业务执行授权。
4. `conditions.mjs` 与组合闭包：共享谓词的两类检查形成不同的完成状态成员及 AND，保留 reviewer、governed target 与局部来源。不存在唯一成员域时不猜。

各类完整事实及来源见五份机制 `*-AUDIT.json`。`KNOWN-GAPS-019.json` 保留原 8 个失败的证据引用；这 8 个现已在旧 shadow 全集与回归中关闭，不再算新盲测。

## 实际验收

| 数据/检查 | 实际结果 |
| --- | --- |
| 原 50 个 ADMIN 完整任务 | 50/50 FULL_ROOT_7PLUS1_CLOSED |
| 019 shadow，现为回归 | 100/100 |
| 019 独立 controls | 48/48 |
| 新预声明机制 controls | 48/48（每类 6 正例、4 对照、2 歧义） |
| G0 / R1 controls / D01–D08 / REF-001 | 5/5、18/18、8/8、43/43 |
| 最终新 shadow A：C2-A | 首次 120/120 |
| 最终新 shadow B：C2-B2 | 首次 120/120 |
| 新候选专项 / 保留测试 | 57/57、131/131 |
| 原 Parser 回归 | 4400/4400；0 fail、0 skip |
| 全仓 `npm test` | 6416 total；6399 pass、0 fail、17 skipped |
| 重新加载 NLP 重复性 | 633/633 EXACT |
| 抗过拟合 | 90/90；静态检查 0 hits |

最终候选 SHA-256：

`42b1676906fd50576bee5023520584bf55096e047605330cb50d475bbe4ec9d7`

两个最终套件使用相同候选；之间与之后未改代码、规则、模型或阈值。每套 120 个原文与 oracle 都在首次解析前冻结，均为 30 paraphrase、20 scope、20 quantity、20 condition、10 flow、10 basis、10 output-content；每套 54 个英语/混合文本、82 个组合机制文本、18 个歧义/负向控制。精确文本重用为 0。

这些是任务允许的内部预声明、确定性变换的标准化合成套件，oracle 生成未读取 Parser 输出。它们不是 ADMIN 隔离保管的独立自然文本盲测，因此本结果不扩大为任意自然语言准确率承诺。

513 个最终任务逐条按冻结断言与全部 RESOLVED 事实的身份、直接论元、Eligibility、scope/object 及来源一致性复核：`partial_RESOLVED=0`、`wrong_binding=0`、`unsupported_RESOLVED=0`、明确来源的 unresolved=0。真实歧义仍保留；版本多候选不会被选为唯一版本。实际 8 槽状态与全部未决项另见 `SLOT-STATE-AND-UNRESOLVED-INVENTORY.json`。这些是本测试域的审阅结果，不以 Contract Gate PASS 代替语义断言。

## 周期与首次失败

使用 2 个通用修复周期，未超过任务书上限 3。

第一候选 C1-A 首次为 **112/120**，8 个失败的原始 trace、oracle、实现快照和 first divergence 均保留。错误来自重试域消费者误排除被旧阶段标记、但当前语义层仍在使用的有效 event。它成为 development 证据，连续通过计数清零。通用修复使用当前有效 typed domain，并补齐已有局部执行名词的数量绑定；旧全集全部通过后冻结候选 2，再首次运行新的 A/B。失败套件在最终候选上另做两次 fresh NLP development replay，120/120 且 EXACT，未冒充盲测。

第二套件的 `C2-B` 冻结后、解析前发现 authoring transform 错改 oracle 的 canonical sense（read→reads），未执行、无通过计数。其原文件保留，替代套件 `C2-B2` 重新冻结后才解析。更早的英语数量检查与文本去重检查也在有效冻结/解析前中止，均不算运行。周期、摘要与元数据纠正见 `BLIND-CYCLE-HISTORY.json`。原 freeze 的显示标签 focused49 与 `1-r02` 的 null cycle 未覆盖；实际专项 57、周期 1 另行说明。

## 审阅脚本纠正

保留第一次审阅输出于 `audit-r01/`：3 次把同一产物的不同 TRANSFER_STATE/REVIEW_STATE 误判为重复完成成员，23 次把附加版本歧义 provenance 当成直接语义论元。复核依据为实际字段合同：直接角色和使用关系必须完整，CHECK_COMPLETED 的两项检查对象必须不同；独立版本歧义仍使 V 未决，不导致已明确参与者或动作失效。未修改 Parser、Source、oracle 或 replay。

抗过拟合原结果也保留：20 个数值变体误报，因为第一视图仅归一化 QuantityExpr bounds，没有归一化随源文本同样 +10 的 VALUE。按预声明变换同步比较两个字段，90 对全部通过。详见 `AUDIT-CORRECTION-NOTE.json` 与 `ANTI-OVERFIT-AUDIT.json`。人工 ADMIN 仍可对这些复核依据提出不同意见。

## 证据与封存

最终 50 例的原文、Canonical、完整 Trace 与逐条审阅直接提交；其他首次/失败/重复/抗过拟合证据按原字节无损分包为 63 个 tar.gz，不删除本地原文件。`ARCHIVE-INDEX.json` 逐文件记录路径、大小、SHA-256，解包后恢复原相对路径。模型权重、虚拟环境和缓存不上传，只记录冻结摘要。

所有首次失败和错误记录均保留，`test-runs/` 保存完整日志、运行命令、时间及跳过项。全量回归包含本地启动前已有的未跟踪测试，实际输入摘要见 `TEST-INPUT-INVENTORY.json`，不把这些无关文件作为本轮改动上传。

`MANIFEST.json` 与 `SHA256SUMS.txt` 封存本轮代码、报告、冻结输入和无损证据包；`SEAL-VERIFICATION.json` 校验文件、包内成员、候选/模型/协议、Sources/oracle 及旧资产。Git 发布回执单独记录，不进入自引用摘要。只推送 `review/7plus1-parser`，不 merge/release/tag、不切换生产，完成后停止等待 ADMIN Review。
