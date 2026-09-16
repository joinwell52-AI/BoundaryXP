# Producer适配器合同 / Producer Adapter Contract

状态：产品合同、固定prepare、候选验证与CLI/MCP/HTTP回放链路已实现；真实Host实测与抽取质量验收未完成。v2任务书优先。

唯一产品Schema源为src/product/contracts.mjs。Pack使用独立Draft-07实例，同时验证固定Data Package 2.0上游Profile；职员表和候选使用独立Draft 2020-12实例。所有实例禁用远程Schema加载、类型强转、默认值插入与字段删除。

候选boundx-extraction-candidate/v1显式回显prepare_id、source_digest、context_digest；producer记录kind、adapter_version与model_id（无法获取则unknown）。elements、constraints和scopes从固定task Schema派生，替换的只是span输入定位器，不复制第二套BXP枚举或计算器。

定位器为source_id、quote及可选prefix/suffix，不接收模型start/end。仅程序定位原文码点。候选条目可附semantic_refs、candidate_ids和解释；不接收自由normalized对象或授权字段。typed constraints保持协议已有结构，不能用自由字符串替代数学关系。

错误分层：STRICT_JSON/INPUT_LIMIT/STRUCTURE_LIMIT为解析限制；PRODUCT_SCHEMA为候选/产品结构错误；后续Pack、快照和证据错误必须保持生产者诊断，不伪造BXP结果。只有合法组装后才能调用唯一Core；业务裁决与执行授权保持null。

The producer contract is model-independent. Schema validity does not establish semantic entailment, omission-free extraction, business approval or execution permission. Structured and label replay are adapter tests, never substitutes for live Host evidence.

三层报告沿用用户标题与顺序：原文证据→7+1映射→计算结果与建议/Diff。缺证据不补事实，未计算不显示“引擎通过”，风险建议不冒充B违反。

本地MCP提供bx_list_semantic_packs、bx_get_semantic_pack_info、bx_prepare_admin_task和bx_evaluate_admin_candidate。Canonical BXP入口仍无状态；产品prepare会在本地持久化原文及选定上下文，不应描述为“完全无客户数据持久化”。默认数据目录为.boundx，可通过BOUNDX_DATA_DIR指定；不得提交真实客户内容。网页/admin只提供准备、候选导入和计算，不声称已自动接入Host AI。

## 回放适配器 / Replay Adapters

src/product/replay.mjs提供结构候选回放与标签/关系回放。后者将八个显式tag转换为同一候选合同，不运行自然语言抽取器。两者都调用现有Core；语义投影及计算一致，producer来源不同会导致输入摘要不同，不冒称两个适配器产生逐字节相同的任务。

tokenRangeLocator仅接受能够逐字节重组原文的已解码token片段，拒绝归一化、未配对代理项和越界；转换后再次经过精确引文定位。它不是通用tokenizer解码器，不把模型token下标直接当作Unicode码点。

Both adapters are deterministic test replays, not live model runs. Unknown model versions remain unknown. A valid quote and Schema do not prove that an interpretation is entailed by the source or that no prohibition was omitted.

## 行业上下文检索 / Industry Context Retrieval

检索规则literal-ascii-v2从已锁定L2读取动作、实体、岗位、资源、依据、完成词汇及风险。动作按显式触发词召回；实体可由命中动作的实体类型引用带入，风险可由动作风险关联带入，其余条目按包中已有名称/别名/完成表达命中。所有条目标为candidate_only并保留命中原因；岗位不补任务责任、完成表达不代表任务已完成、风险不自动转B。

非ASCII文本不归一化；ASCII只折叠大小写并核对词边界，继续检查后续出现位置，避免前一处嵌入其他词就漏掉后面的合法命中。这里是有限词法召回，不宣称语义检索完整或否定范围已正确解析。无命中不等于不存在，超过64KiB语义上下文预算显式失败，不静默截断。

产品semantic_refs增加可选kind以区分同包中不同资源类别的同名ID；没有kind时只有唯一匹配才接受，跨类别歧义拒绝，不选择第一项。L3角色引用如提供kind则必须是role。BXP Schema及协议版本不变；新prepare固定新的候选Schema摘要和检索规则，旧快照不被改写。

Retrieval candidates retain package provenance and selection reasons, not invented source evidence. Typed semantic references disambiguate identical IDs across resource kinds. This improves bounded context coverage but does not prove source entailment, complete extraction or independent gold-label acceptance.
