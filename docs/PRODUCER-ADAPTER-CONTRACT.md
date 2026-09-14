# Producer适配器合同 / Producer Adapter Contract

状态：产品合同实现中；不是已交付Host链路或抽取认证。v2任务书优先。

唯一产品Schema源为src/product/contracts.mjs。Pack使用独立Draft-07实例，同时验证固定Data Package 2.0上游Profile；职员表和候选使用独立Draft 2020-12实例。所有实例禁用远程Schema加载、类型强转、默认值插入与字段删除。

候选boundx-extraction-candidate/v1显式回显prepare_id、source_digest、context_digest；producer记录kind、adapter_version与model_id（无法获取则unknown）。elements、constraints和scopes从固定task Schema派生，替换的只是span输入定位器，不复制第二套BXP枚举或计算器。

定位器为source_id、quote及可选prefix/suffix，不接收模型start/end。仅程序定位原文码点。候选条目可附semantic_refs、candidate_ids和解释；不接收自由normalized对象或授权字段。typed constraints保持协议已有结构，不能用自由字符串替代数学关系。

错误分层：STRICT_JSON/INPUT_LIMIT/STRUCTURE_LIMIT为解析限制；PRODUCT_SCHEMA为候选/产品结构错误；后续Pack、快照和证据错误必须保持生产者诊断，不伪造BXP结果。只有合法组装后才能调用唯一Core；业务裁决与执行授权保持null。

The producer contract is model-independent. Schema validity does not establish semantic entailment, omission-free extraction, business approval or execution permission. Structured and label replay are adapter tests, never substitutes for live Host evidence.

三层报告沿用用户标题与顺序：原文证据→7+1映射→计算结果与建议/Diff。缺证据不补事实，未计算不显示“引擎通过”，风险建议不冒充B违反。
