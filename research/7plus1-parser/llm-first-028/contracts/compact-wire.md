# 精简传输接口 r01

031-r1.3-additive：events新增specifies_result_id，非产物内部行为为null。表达式新增TEST分支，仅输出test与来源，不输出固定operands=[]、state=null；程序机械展开。STATE及集合/逻辑分支的test必须null。内部属性测试、结果绑定和层级都是LLM的语义选择，程序不从词汇补齐。PROPERTY_CONSTRAINT与OUTPUT_BEHAVIOR按共享合同核查结构；旧响应缺省只代表未表达。

本资源追加031-r1.2-additive：GROUP.members、quantity.distribution、coverage.requirement_kind和audit.source_checks在本次wire中显式填写。普通实体members=null；未表达distribution=null不是AGGREGATE。MEMBERS只表达显式GROUP的成员域；程序不从文字补成员、量词或限定对象。WORK_PLAN是保留计划数量的用途，不自动进入R。旧内部响应只作标记后的消费者回放，不继承新Skill验收成绩。

内部 `031-r1.1` 语义合同与编译不变；输出版本 `COMPACT_SEMANTIC_WIRE_R01`。以下仅规定机械映射，语义选择及来源仍由LLM明确给出。

- source_table：真实引文 id / quote / occurrence 只列一次。每项必填 source_refs，选择至少一条；不同 occurrence 不合并，不用全篇作为万能证据。
- claim 公共字段 id / scope_id / requires / source_refs / note；binding 中明确 kind 及其语义字段。内部 claim.event_id 对应 binding.event_id。按kind禁用的字段由程序补固定null；TEMPORAL direction固定ORDER。其他合法可空语义仍必填。
- 模型不输出event.constraint_ids。程序仅从已明确的 CONDITION / TEMPORAL / QUANTITY claim.event_id生成逆索引，不选择目标。
- STATE表达式由程序补operands=[]；其他表达式补state=null。所有身份、谓词、角色、层级、模态、条件、数量、范围、依赖、疑点及覆盖选择仍必填。
- 审阅使用候选source_table；新证据列additional_sources，无则[]。每个实体/事件/claim/expression须显式审阅，不默认SUPPORT，属性意见不替代整体意见。保持新会话与逐来源核对。
- “立即”、整体期限、全称范围仅写note不等于可计算。不能表达时明确覆盖缺口，不造普通事实代替。

程序保留原始wire、内部图及机械派生记录；重复来源id、悬空引用、缺字段显式失败，不猜、不删、不借证据。技术接受不是业务授权；审阅一致不是正确性证明。
