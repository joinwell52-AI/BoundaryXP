# 027 v0.4 最终执行报告

LLM_SEMANTIC_COMPILER_027=EVAL_FAILED
WAITING_ADMIN_REVIEW=true

已切换到全新 v0.4 主链；旧 026 封存和生产入口未修改。codex-cli 0.160.1 的真实自动调用通过探针，使用已认证能力与 gpt-6.1-sol。PATH 中旧 0.147.0 的实际失败回执保留。模型仅提出候选；最终认证由新的有限 Γ 执行。

245 开发原文与105锁定原文在首个语义调用前按哈希划分。开发 v1 的首次请求、响应和 Trace 全部保留。有限 Eligibility 策略在相同冻结 Gc 上完成整批重放比较；选择结果见 POLICY-SELECTION.json。方法摘要冻结后才运行105，原始输出在评分前独立封存，之后未改方法、未重新覆盖105。

| 语料 | 实际运行成功 | 已有参考检查全通过 | 完整语义闭合 |
|---|---:|---:|---|
| root | 50/50 | 4/50 | 未证实 |
| natural | 100/100 | 15/100 | 未证实 |
| exposed200 | 200/200 | 0/200 | 未证实 |

实际 Trace：350/350；运行错误：0。已有来源比较未通过检查：2007；比较器未验证项：182。参考检查通过率不等同于完整语义准确率，不与历史026的16/50、9/100、200/200冒作同一指标比较。完整图精确率/召回率因参考不完整而未建立，未用模型补标准答案。

候选来源引文错误：0；无效锚点：4；Coverage缺口区域：298；Proof路径缺口：0。后两项是实际结构检查，不替代自然语言语义审定。

全量回归：6688 PASS / 0 FAIL / 17 SKIP，共295个测试文件。初次全量结果和原始日志保留；FULL-REGRESSION.json为最终实际结果。

NLP只复用冻结的HanLP/spaCy语言证据，实际新调用数为0；没有宣称BGE/E5/NLI实际被调用。本轮没有建立它们的v0.4候选/命题适配器，状态明确为NOT_SELECTED。

首处分歧及每条引用证据见 FAILURE-LEDGER.json、DEV-245.json 与 LOCKED-105-FIRST-RUN.json；完整源码与运行说明见 ARCHITECTURE.md 和新实现 README。所有350原文与各条运行记录均已保存；已生成的350份逐阶段Trace、最终7+1、模型原始输出及回执保留，未完成条目保留错误而不补造Trace。没有 merge、release、tag 或生产切换。当前不声明027 PASS，停止等待 ADMIN Review。

具体依赖链及比较限制见 [REVIEW-CAVEATS.md](REVIEW-CAVEATS.md)。逐条引用证据索引、实际请求隔离、CLI 重放、性能和20项验收状态分别见 FIRST-DIVERGENCE-EVIDENCE.json、PROVIDER-INPUT-ISOLATION-AUDIT.json、CLI-VERIFICATION.json、PERFORMANCE-AUDIT.json、TASK-ACCEPTANCE.json；这些审计不参与 Parser，也不替代完整语义审定。

来源对齐总审计还包括独立 Auditor 的 checks/findings 引用：总引文错误 0，总无效锚点 5，总歧义对齐 5。候选与审计引用分别列在 SOURCE-GROUNDING-AUDIT.json，不以其中一侧为零替代全链为零。

开发阶段发生环境中断：原 CLI 0.160.0 的路径消失，137 条完整首次 Trace 保留；4 条在途失败及104条调用前的路径保护失败保留在原 development-v1，原首次错误合计 108。新 CLI 0.160.1 经实际 help/catalog/probe 重新核实后，在 development-v1-recovered 另存恢复结果。提示、Schema、模型请求 gpt-6.1-sol/medium 和语义实现不变；不把恢复结果冒称全部首次成功。245 开发策略比较使用同一组恢复后记录的 Gc，105 锁定仍严格只有冻结后首次运行。
