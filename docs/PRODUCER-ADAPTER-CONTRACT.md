# Producer适配合同

目标链路：原文与允许上下文 → Producer候选7+1及证据 → 本地复核 → Formalizer → 唯一BXP Core → Boundary Result → Admission。

LLM、spaCy、HanLP是可替换被测路线。Gold只进入独立比较器，不能进入prompt、语义上下文或根据case ID选择答案。NLP不调用LLM补答案。

## 本地NLP接口

Node通过严格JSON stdin调用Python；结构化观察只写stdout，日志写stderr。模型必须预先安装，推理期间不自动联网或下载。

spaCy和HanLP共享版本化semantic mapper，模型专属适配须明确记录。保留可用词性、实体、依存或语义角色观察；tokenizer下标不能冒充原文Unicode码点跨度，最终证据必须重新定位。

模型未识别不等于原文不存在；缺失、歧义与已识别事实保持区分。不得补造政策、权限、数值或版本。

## LLM接口

固定prompt版本及参数，记录请求/实际模型、provider、原始响应、结构错误和超时。不能静默回退模型或拿其他路线输出补缺。服务不披露权重版本时如实记录provider_not_disclosed。

## 共同要求

同一允许输入、相同语义包摘要、同一Core和evaluator。保留否定、条件、作用域、证据和未明确项。记录prepare、模型、映射、校验、形式化、计算与总耗时。

Wire Contract、Formalizer和Operator Profile的版本与摘要必须冻结。当前完整0.4适配验收未完成，现有接口存在不等于正式符合性已证明。
