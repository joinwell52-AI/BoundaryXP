# 7P-REPAIR-004 根因与实施界限

本轮实现没有达到任务书的 I/O/A 实际进展硬门槛，不能验收为修复完成。35 个 non-Gold 输入与 37 条新增测试覆盖补边机制，但其中 7 个输入明确保留上游覆盖缺口，不能计为端到端语义通过。

- 挂载点：engine.mjs:18–20，在 candidateGraph 后、Eligibility 前执行 closeEdges；QI–QB 与 projection 原字节不变。
- shared complement / local ownership：edge-closure.mjs:55 的 nominalOperands 只接纳有类型或受保护的明确局部操作数。它不能恢复缺失的嵌套谓词，也不能凭含义把任意名词拼成作用域。
- 首处分歧：edge-closure.mjs:82–86 发现 ccomp/xcomp 端点缺失时保留 UNRESOLVED。SWAI-001 原片段的候选只有使等不完整端点；新增模块没有得到可安全闭合的完整动作/对象/控制图，实际 A/O 未改善。详见 FIRST-DIVERGENCE.json。
- 共享产物复用使用 coreference.mjs:5 的 edgeReferenceDomain；过滤 domain、owner、类型、来源顺序、基数和条件，不按最近产物猜测。多候选仍未决。
- 依据前置仅在真实 dependency-root 动词存在时恢复候选；BASIS non-Gold 中动词被标为名词，仍缺动作。没有增加同义词补猜策略。
- CONTENT non-Gold 暴露旧 discourse 分类未识别正文体裁，不能把它宣称为内部图隔离成功；保留原失败输入。CONTENT_EXPLICIT 验证已有明确体裁中的内部图隔离。
- 全部标准文本只新增/拒绝 1 条边审计记录，并增加 4 条补边阶段未决诊断；其最终 Canonical/Fact/表达式与 003-r03 完全一致。没有把结构诊断当语义提升。
- export.mjs:5 仍识别旧 revision，导致 004 输出落入 legacy export 并读取不存在的 legacy_output.full_trace。正式 Parser JSON 已先落盘；原 ERROR/RUNS 保留，审阅 Markdown 用 report-only renderer 直接生成。冻结运行时导出缺陷没有被伪装为 PASS。

没有进一步改方法、Gold、模型、投影或生产入口。完整任务验收仍待上述失败项解决；当前只封存诊断候选，等待 ADMIN Review。
