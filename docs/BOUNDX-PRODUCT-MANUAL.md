# BoundX 产品手册

目标规范：BXP-0001 0.4.0-draft.1。产品版本：1.3.0-preview.0。状态：目标设计与实施说明，完整0.4实现开发中。

## 产品定位

BoundX分析ADMIN任务文本，将有证据的任务语义编译为可计算边界，给出可核对的结果和修订建议。它不执行任务，不替业务责任主体作决定。

`Task Semantics → IR7+1 → FormalBoundaryModel → BoundaryResult → Admission → DownstreamConformance`

## ADMIN工作流

输入原文 → 选择已保存的路线与上下文 → 抽取并复核 → 计算边界 → 查看缺口与可填写修订稿 → ADMIN确认修改 → 重算 → 准入检查 → 进入任务书发布。

修订稿必须区分原文事实与待确认建议，不补造制度、权限、时限或验收标准。修改原文或绑定内容后，已缓存准入不能继续使用。

## 产品呈现

1. **原文证据**：保留原文，可复制并定位证据。
2. **标准7+1**：清晰呈现I/O/A/P/R/V/C/B与resolved、unresolved、absent；过程可展开。
3. **计算结果与建议**：呈现形式模型、边界对象与四状态、缺口/冲突、Admission、澄清及修订。

页面显示实际路线、模型和准备/加载/推理/映射/计算/总耗时。中文和英文独立切换，不夹带双语提示。

## Producer与Core

LLM、spaCy、HanLP负责候选生成；NLP共享版本化语义mapper。三路均经过证据及结构复核，再交给唯一Core。模型未识别不等于原文没有，结构复核成功不证明语义完整。

Core不调用模型、不联网读取制度、不自动下载模型。形式化和求值必须可重放；未知不能默认补齐。正式Wire Contract和版本分派须依照任务书冻结。

## 语义层

L1：core-ontology@1.1.0；L2：software-ai@0.2.0。行业子类为swe-devsecops、ai-mlops、ai-rag-infer、agent-governance。

Enterprise L3 Profile v2表达身份、别名、组织、岗位、职级/序列、状态、雇佣类型、显式权限、委派、政策版本、时间和作用域。身份、岗位、职级、权限不等同；岗位或经理关系不能推出权限。

## 准入

Boundary Result状态为determined、underdetermined、inconsistent、invalid。不能仅因八槽有内容就判定边界确定。

Admission绑定原文、IR、形式模型、协议/Profile、Formalizer、Operator、边界及L1/L2/L3版本摘要；发布前原子复核。Core套件L3绑定为null，企业套件绑定精确L3摘要。失败、陈旧或不匹配时阻止发布；下游计划仍须符合父边界。

`business_decision = null`；`execution_authorization = null`。Admission不是执行授权。

## 研究、许可与交付

Core 100与L3 100是独立候选基线，须ADMIN审定冻结。三路线计划Primary 600、Stability 1800；保留原始输出及所有失败。正式准确率尚未发布。

仓库LICENSE为MIT；模型、词典及依赖分别核验商业使用和再分发条件，不用仓库MIT替代第三方许可。

最终交付为本地ZIP、MANIFEST和可核验测试证据。所有开发及验收本地完成；不依赖云端CI。详细工作与门禁见[v1.2 LOCAL任务书](tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)。
