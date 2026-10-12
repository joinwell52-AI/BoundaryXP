# BoundX语义合同031-r1.1：精简阅读副本compact-r01

本副本压缩原合同的重复说明，保持031-r1.1接口及原规则；依据仍为v0.4/r04与031/031-R1 ADMIN批准的O口径、产物依赖区分。它供同版本解析、审阅、Schema、Γ及编译链使用，不修改运行程序或历史030/031输出，不静默升级旧合同。原合同为权威原件；本副本尚未经过独立语义等价审阅或模型复测。ACCEPTED仅表示有限检查及审阅支持，不证明自然语言真值，不授予业务执行权。

## 1. 八维、实体与模态

I=明确输入/作用域；O=明示要求或允许产生的结果及交付的产物，不要求本任务新建；A=当前要求/允许动作；P=逐事件参与关系；R=执行量化限制；V=规范依据；C=根完成/停止；B=禁止/限制。八维是同一关联结构的视图，不能按词语分桶、凭岗位推权限、补WP或默认执行者。

实体字段、类型枚举及全部必填项遵守同源Schema。实体ID稳定；角色/用途属于事件，没有排他的实体全局槽位。内部结果被复核、提交仍可为同一实体，但OBJECT消费不自动成为外部输入。

模态逐事件解释：REQUIRED=必须，PERMITTED=允许，NOT_REQUIRED=无义务，FORBIDDEN=禁止，UNSTATED=未明确。NOT_REQUIRED不等于禁止；UNSTATED不等于允许。RESULT为产生用途，DELIVERABLE为交付用途，各随自身事件模态与条件。明确交付须有DELIVERABLE，但不推生成、修改、存在断言或外部I。允许生成且无需交付分别保留PERMITTED RESULT和NOT_REQUIRED DELIVERABLE；后者与禁止交付均不产生正向O。普通接收OBJECT不自动成为新结果，引用中的交付不成为当前义务。

## 2. 通用结构与来源

顶层仅contract_version="031-r1.1"及entities/events/claims/expressions/issues/coverage六数组。全图ID唯一，ROOT为保留根标记。不适用claim字段填null，artifact_use不适用亦为null；sources、note始终保留。

sources/mentions使用原文完全一致、非空quote及从1起算的occurrence；不猜偏移，宿主按Unicode码点定位。跨句指代、主体承接引用两端，抽象状态可用多个片段，不伪造连续引文。requires只列真正必需的身份/语义依赖，owner、共现及背景不是证明依赖。

events的predicate为简洁中文动作/状态名。kind、layer、use、modality、polarity分别填写；枚举按Schema。owner_id为ROOT或结构父事件；constraint_ids必须列齐约束该事件的CONDITION/QUANTITY/TEMPORAL并双向回指。layer不替代use：引文、定语、目的、内容、背景中的MENTION_ONLY不成为任务动作；目的或条件提到批准/复核不增加独立义务。操作方式限制约束原操作，不凭只读等限制新增REQUIRED动作；限定内容用SCOPE/CONTENT及来源表达。

## 3. 主张及量化

ROLE绑定event_id、entity_id、role。参与角色枚举按Schema，组织不等于执行；当前明确参与关系进入P，纯条件/引文参与不增义务。INPUT_OBJECT=明确外部输入/受检范围；OBJECT=内部产物或普通对象；RESULT=生产结果；DELIVERABLE=交付产物；BASIS=对该用途有约束的依据；CONTENT=内容用途。

CONDITION以event_id指定目标、expression_id指定前提，direction为NECESSARY/SUFFICIENT/IFF，temporal为AFTER/BEFORE/null；缺失或不对称回指须拦截，不能变无条件许可。TEMPORAL同样绑定目标与表达式，direction=ORDER、temporal=AFTER/BEFORE，仅表达先后。

QUANTITY绑定event_id及完整quantity：metric为被计数内容；target_id为受限目标；comparator、value、unit、use、count_scope保持原文。比较符与用途枚举按Schema。count_scope引用ROOT、事件或实体，不替代target。EXECUTION_LIMIT.target_id必须等于event_id；OUTPUT_CONTENT.target_id须为同一事件RESULT或DELIVERABLE实体，内容类别可另用CONTENT保留。多结果不得默认挑一个；报告/内容数量不改投R，输出内容数量挂O。

COMPLETION/STOP的event_id=null、scope_id=ROOT，表达式与direction保留根触发/前提。“只有才”为NECESSARY，“即”为SUFFICIENT，不擅改IFF；未知条件状态仍可表达。STOP可保留停止、中止、升级语义，不改作完成。SCOPE以expression_id表达明确范围、scope_id指定目标，event_id可空；禁止对象不自动成为外部输入。

## 4. ARTIFACT_USE与身份

ARTIFACT_USE绑定本次RESULT实例与消费用途：event_id=消费事件、entity_id=同一产物、scope_id=消费事件；artifact_use包含producer_result_id（生产ROLE RESULT）、consumer_role_id（同事件同实体的OBJECT/INPUT_OBJECT/DELIVERABLE）、availability（USED_PORTION/COMPLETE_RESULT）。role/expression_id/direction/temporal/quantity均null，sources覆盖生产、消费两端。

USED_PORTION仅要求被使用部分可用，默认不要求整个生产动作结束。只有明确完整产物要求才用COMPLETE_RESULT；完整产物也不等于生产者其他工作全部完成。明确生成完成后等顺序另用TEMPORAL/STATE，不能用ARTIFACT_USE、note或Proof.requires代替。明示本次结果供另一用途使用必须表达该主张并独立审阅；明确漏项走一次有界修订，不记ABSENT。

RESULT与对象共享身份可生成DERIVED同身份索引，但不证明同版本、可用性、先后。旧版复核后覆盖、不同轮次、部分/流式结果或多来源竞争不因同路径、标签、位置而强合并或全局串行；不同版本保留独立实体/明确版本。只有当前正向生产/消费、身份及关联主张技术闭合后，程序按031-r1-artifact-flow-v1生成可用性依赖，保留模态、条件、范围、输入主张、规则版本、来源；它不是执行调度、Proof.requires、完整事件完成或QA批准。真实竞争只阻断相关依赖。

身份检查同时向前、向后。唯一当前报告与文件名用同一ID，mentions及用途来源包含指称和名称两端；STATE参数引用同一身份。不得拆成无关联实体后在note声称相同。不同对象/轮次、多个来源、未说审批对象时不强合并。程序不从原文、文件名或note猜身份与执行者。

主体仅在连续同一指令的并列/追加动作、没有切换/另定/组织职责/竞争时承接；ROLE.sources引用主语及动作两端，note说明。组织者不自动执行被组织工作，条件/引文角色不传播为主命令执行者；真正未指定保留UNSPECIFIED。

## 5. 表达式、方向与状态

op仅STATE/ITEM/ALL/ANY/UNION/INTERSECTION/EXCEPT/AND/OR/NOT。STATE包含predicate、可空event_id、args（实体/事件/ROOT）、polarity，表示有参数状态而非已发生事实；event_id、args须匹配所指事件及原文对象、角色、时序。ITEM恰引用一个实体；其他operands引用表达式：NOT恰一个、EXCEPT恰两个，其余至少两个。只解释固定操作符，不执行模型代码。

必要前提限制目标，充分前提触发目标，IFF双向，ORDER只定先后。明确随后/再/最后/完成后须有TEMPORAL/STATE；后继承接整组并列工作时用AND保留全部前置状态，纯并列不补组内先后，不把ORDER升为SUFFICIENT。

方向不能按模态套用：范围成立触发必须/禁止通常为SUFFICIENT，不改为“只有该范围才禁止”的NECESSARY；许可必要前提与禁止充分触发分别表达。未发生用NOT(发生状态)或NEGATIVE状态；BEFORE不要求未来参照状态已发生，不删除禁止范围/方向。

同一状态键由predicate、event_id、args组成，polarity为极性；同参数互补状态遵守排中/矛盾律，各单独未知状态仍UNKNOWN，不合并不同参数/事件。观测由测试/宿主提供，不宣称真实运行状态已发生。

## 6. 疑点与覆盖

issues为AMBIGUITY/UNSPECIFIED/COVERAGE_GAP，subject_ids、field_path定位实际影响，alternatives保留合理备选，affected_views只定位范围，不签发槽位状态。执行者未指定通常UNSPECIFIED/OPEN_FOR_REFINEMENT，不阻断明确动作。REFERENT真实多备选依赖局部UNRESOLVED，不污染其他明确用途。

coverage从每项动作、要求、禁止、条件、数量、例外出发，记录sources、claim_ids、status（EXPRESSED/BACKGROUND/UNSPECIFIED/GAP）、affected_views。一句可含多个义项；字符覆盖不证明语义完整，GAP不能显示ABSENT，缺省维度开放不是授权。

## 7. 独立审阅与修订

audit同版本。reviews对每个entity/event/claim/expression独立给SUPPORT/CONTRADICT/UNCERTAIN、真实来源及短理由，角色主张独立审阅。subject_id+field_path为直接目标；context_refs只供背景，不作为拒绝列表。issues保留issue_kind、subject_ids、field_path、context_refs、sources、reason、suggested_json（仅建议）；omissions记录明确漏项、来源与affected_views。

field_path为空或精确collection[id]表示整节点；collection[id].property或相对property只表示属性。属性支持不扩大为整节点支持。仅type不确定与身份不确定分开，局部type疑点不影响无需type的明确身份用途；缺来源、身份竞争、整节点反对或未获支持仍阻断身份依赖。显式requires要求完整主张接受，不借属性处理越过。

同一运行最多一轮语义修订：审阅反对/明确漏项及宿主白名单技术错误共同触发，反馈只含真实错误码、字段、ID和合同要求，不含评测答案。改变主张须显式修订并新会话重新审阅、重验，旧候选/意见保留；失败保留缺口，不删条件/数量求通过。未经重验的建议不成为事实，审阅一致不是真值证明；局部用途疑点不污染独立动作。

## 8. Γ、投影及运行边界

Γ检查来源、Schema、唯一引用、签名、约束双向绑定、表达式参数、量化目标/单位、必需依赖闭合与循环、直接审阅、身份竞争。完整来源+SUPPORT+有限检查通过可ACCEPTED；局部疑点UNRESOLVED，技术坏结构REJECTED。只沿requires及实际身份/事件/约束依赖传播，不沿owner/context共现扩散；保存检查路径。

Q固定消费用途，不扫描predicate选槽：当前REQUIRED/PERMITTED→A，FORBIDDEN→B；INPUT_OBJECT→I，RESULT/DELIVERABLE→O，BASIS→V，参与角色→P；EXECUTION_LIMIT→R，OUTPUT_CONTENT挂O，根COMPLETION/STOP→C，SCOPE保留明确范围用途。I/O/V正向用途要求关联事件当前正向；NOT_REQUIRED不进A/B，UNSTATED不冒充允许，内部OBJECT不自动进I。约束、对象、参与者保留同一事件事实，不做笛卡尔积；中文从同一IR渲染，mention-only、未指定、无义务和缺口另列不丢弃。business_decision/execution_authorization固定null。

字段代码映射见原资源FIELD-MAP.md；Schema由schema.mjs唯一生成，模型与宿主用同一资源摘要。精简副本及去空白Schema的字节摘要发生变化，须在宿主明确选用时同步真实摘要，不沿用原件哈希或静默替换运行资源。
