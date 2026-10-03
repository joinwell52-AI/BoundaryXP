# 7P-SHORT-016-R2

**SHORT_DIRECT_PARSER_VALIDATED**

STATUS=WAITING_ADMIN_REVIEW；PRODUCTION_READY=false。只认证本轮冻结短任务与锚点，不宣称任意文本准确率，也未切换生产入口。

四类通用机制：角色限定姓名以依存/NER 与唯一同 owner 名称证明归一；执行主体继承受谓词类型、owner、先行责任与局部显式主体限制；必要完成句保留 AND、完整确认谓词、全称项和逐项证据；未决传播沿真实 use-site，而不把候选先行词的其他用途传播到无关槽位。实现位于隔离 R2 目录，原投影、模型、阈值、Pack、QI–QB 与旧封存不改。

非 Gold 在 REF 前冻结 16 条：4 identity、5 subject、4 completion 为实际 HanLP/spaCy 结果重放；3 coverage 为显式 typed graph 单元验证，不能冒称端到端解析。最终全部 PASS。额外专项包含名称片段/多人歧义与 G16 篡改反例；完整日志保留。

|Case|I|O|A|P|R|V|C|B|Full|Joint IOA|
|---|---|---|---|---|---|---|---|---|---|---|
|D01|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D02|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D03|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D04|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D05|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D06|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D07|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|
|D08|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|MATCH|true|true|

D01–D08 full 8/8、同案 IOA 8/8；wrong binding=0，unsupported RESOLVED extra=0，重复身份=0。

REF-001 原断言 **43/43**，identity 与 completion_AND 通过。I/O/A/P/R/V/C 为 RESOLVED；B 为 UNRESOLVED，原文“上述材料”的歧义完整保留。**原始 Gold 结构比较仍在 A/C 显示差异，不写成字节一致。**

A 的两个生成动作增加 ITEM(其唯一对象)，关系、对象、owner、模态、条件、数量完全不变，按 ADMIN §D 明确记录为 EQUIVALENT_ENRICHMENT。C 的旧 Gold 含继承的编辑主体；ADMIN §B 已明确完成状态不能继承执行主体。当前 C 主体为空，源句“本次整理才算完成”没有人名主体；两个完整 AND 操作数与旧 Gold 一致，全称与必要性保留。此项单列 **ADMIN_ADJUDICATED_NON_EXECUTION_SUBJECT**，不是把错误主体称作身份等价，也未修改 Gold。条件节点已有 NECESSARY_ONLY，谓词同值补注不改变条件。

因此 REF 完整结果为 **CLOSED_UNDER_R2_ADMIN_ADJUDICATION**，是当前 ADMIN 方法合同下的 source-semantic closure。若仅按旧 Gold 原始结构比较，仍为 NOT_CLOSED。详细前后事实、关系、作用域、owner、原文 span、拒绝的 AGENT 和 13 项负控制见 SEMANTIC-EQUIVALENCE-AUDIT；改变 owner/条件/数量/模态/主体/对象/全称或丢条件项均不被豁免。

G4=PASS；当前九案已观测的真实错误绑定与无支持 RESOLVED 额外项均为 0/0。运行 Trace 中仍报告的 first_divergence 是保留的真实原文歧义，不是已消除的 Parser 缺陷。未将 UNKNOWN 清零来取得通过。

冻结后 D01–D08 与 REF 各执行两次 fresh NLP，8 类语义/证据字段 EXACT=EXACT。专项 19/19，保留重定向 45/45；原 Parser 4326/4326，0 fail、0 skipped；全仓库 6238/6255，0 fail、17 skipped，状态 PASS。合同 Gate 仅证结构完整，语义验收另列上述矩阵。

10695 个既有跟踪文件字节及原缺失状态核查 PASS；这不冒称重新计算未跟踪模型权重摘要。全部失败试跑保留于 TRIAL-HISTORY，首次记录未覆盖。封存仅包含 R2 新目录、专项测试与报告。

不合并、不发布、不打 tag、不切换生产、不启动 Hybrid/WP/Matrix。仅建议 ADMIN 在审定本轮后另行授权中型多 WP/Matrix 设计。
