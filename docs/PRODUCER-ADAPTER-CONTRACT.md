# Producer适配器合同 / Producer Adapter Contract

状态：产品合同、固定prepare、候选验证与CLI/MCP/HTTP回放链路已实现；真实Host实测与抽取质量验收未完成。v2任务书优先。

唯一产品Schema源为src/product/contracts.mjs。Pack使用独立Draft-07实例，同时验证固定Data Package 2.0上游Profile；职员表和候选使用独立Draft 2020-12实例。所有实例禁用远程Schema加载、类型强转、默认值插入与字段删除。

候选boundx-extraction-candidate/v1显式回显prepare_id、source_digest、context_digest；producer记录kind、adapter_version与model_id（无法获取则unknown）。elements、constraints和scopes从固定task Schema派生，替换的只是span输入定位器，不复制第二套BXP枚举或计算器。

定位器为source_id、quote及可选prefix/suffix，不接收模型start/end。仅程序定位原文码点。候选条目可附semantic_refs、candidate_ids和解释；不接收自由normalized对象或授权字段。typed constraints保持协议已有结构，不能用自由字符串替代数学关系。

错误分层：STRICT_JSON/INPUT_LIMIT/STRUCTURE_LIMIT为解析限制；PRODUCT_SCHEMA为候选/产品结构错误；后续Pack、快照和证据错误必须保持生产者诊断，不伪造BXP结果。只有合法组装后才能调用唯一Core；业务裁决与执行授权保持null。

The producer contract is model-independent. Schema validity does not establish semantic entailment, omission-free extraction, business approval or execution permission. Structured and label replay are adapter tests, never substitutes for live Host evidence.

三层报告沿用用户标题与顺序：原文证据→7+1映射→计算结果与建议/Diff。缺证据不补事实，未计算不显示“引擎通过”，风险建议不冒充B违反。

## 回放适配器 / Replay Adapters

src/product/replay.mjs提供结构候选回放与标签/关系回放。后者将八个显式tag转换为同一候选合同，不运行自然语言抽取器。两者都调用现有Core；语义投影及计算一致，producer来源不同会导致输入摘要不同，不冒称两个适配器产生逐字节相同的任务。

tokenRangeLocator仅接受能够逐字节重组原文的已解码token片段，拒绝归一化、未配对代理项和越界；转换后再次经过精确引文定位。它不是通用tokenizer解码器，不把模型token下标直接当作Unicode码点。

Both adapters are deterministic test replays, not live model runs. Unknown model versions remain unknown. A valid quote and Schema do not prove that an interpretation is entailed by the source or that no prohibition was omitted.
