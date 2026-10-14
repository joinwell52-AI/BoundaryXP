# 有限计算证据接口 r01

该接口由程序机械绑定到同版Core；不从原文、label或note抽取语义。解析模型负责提供本次真实引用、数学赋值及计算主张。程序整理状态键、单位和产物使用键，不让模型重复拼索引。

## witness_query_json与expression_cases.context_json

两者都是序列化的JSON字符串。当前生成使用format=boundx-finite-evidence/1，完整结构由已内联的kernel/finite-evidence.schema.json规定。不是可执行代码。以下字段全部提供，没有信息的数组为空；不能用null代替数组。

- plan.events：每条id、task_id、occurred、completed、succeeded、start、end、unit、roles。roles=null沿用IR明确角色；若IR只有全称环境/类别约束而未给具体角色，见证须显式选取满足它的roles并保持已有身份，程序不补环境或分类。完整见证须包含根TASK及发生的动作。未发生的声明动作由EXACT_SNAPSHOT作为不发生处理，不伪造新的发生义务。
- plan.completeness：完整见证必须为{kind:EXACT_SNAPSHOT,task_id:本次根TASK,basis:FINITE_MODEL_ASSUMPTION}。局部公式对照可为null。它是有限数学见证假设，不是未来业务域关闭或执行观测。
- plan.external_inputs：数组，每条{task_id,objects:[真实ENTITY引用]}。保留实际使用集合与允许输入集合的区别，内部报告不加入外部输入。
- states：数组，每条{id,value,established_at,unit,periods}。id引用真实STATE。程序从IR的subject生成Core键；不要自行拼状态复合索引。value表示查询终态，为boolean或null，established_at为数值字符串或null。COMPLETION=true时成立时点与其事件end一致；SUCCESS/FAILURE/CONTROL_EFFECT的真值成立点在对应事件范围内。完整期间与终态值不得矛盾。
- periods为null或{completeness:EXACT_FOR_TASK_HORIZON,task_id,intervals:[{start,end,unit,start_inclusive,end_inclusive}]}。它是此见证在任务时间域上的明确状态历史。空intervals表示此有限见证期间该状态未激活；缺periods表示未知，不得由终态false推定此前从未激活。未知停止终点不自动变成正无穷或恢复许可。
- variables：数组，每条{id,value,unit}。布尔值直接boolean；数值为精确字符串并给单位；对象值为真实ENTITY引用且unit=null。程序换算为Core值并检查变量域。
- availability：数组，每条{object:ENTITY引用,producer:EVENT引用或null,at:数值字符串,unit}。引用同一当前产物身份；程序机械生成对象/生产者键。
- receipts：数组，每条{receiver:ENTITY引用,artifact:ENTITY引用,delivery:EVENT引用或null,any:boolean或null,complete:boolean或null}。没有收件算子时空数组即可，不因交付义务另造收件事实。

完整见证不能包含requirements子集、additional_assertions或放宽限制。Core检查全部声明要求、绑定、数据可用性、整体期限及时间范围。数学时间由模型自行构造，不能混成源文指定工作规划或真实结果。

expression_cases是局部公式对照：EXACT_SNAPSHOT只关闭所给该任务的事件域，不要求提供根TASK载体和所有其他动作，不能升格为整案见证。joint.witness_query_json仍必须给根TASK、完整时间域及全部所需状态/变量，并核对终态与历史一致。局部假设不能被程序自动补齐为联合证明。

## 通用完整见证片段

新假设事件没有IR声明时，plan.events可显式提供operation枚举及roles，程序按这些结构值检查通用禁止/范围，不按名称猜操作。已声明事件的operation=null或省略表示沿用IR，不能覆盖其固定操作身份。

下面假设候选已声明TASK work、ACTION make、STATE done、REAL变量clock与OBJECT result。示例ID必须换成本次真实ID；没有相应节点就不添加该绑定。

```json
{"format":"boundx-finite-evidence/1","plan":{"events":[{"id":"work","task_id":"work","occurred":true,"completed":true,"succeeded":true,"start":"0","end":"8","unit":"minute","roles":null},{"id":"make","task_id":"work","occurred":true,"completed":true,"succeeded":true,"start":"1","end":"3","unit":"minute","roles":null}],"completeness":{"kind":"EXACT_SNAPSHOT","task_id":"work","basis":"FINITE_MODEL_ASSUMPTION"},"external_inputs":[]},"states":[{"id":"done","value":true,"established_at":"8","unit":"minute","periods":null}],"variables":[{"id":"clock","value":"8","unit":"minute"}],"availability":[{"object":{"kind":"ENTITY","id":"result"},"producer":{"kind":"EVENT","id":"make"},"at":"3","unit":"minute"}],"receipts":[]}
```

## 分项证据

constraints.requirement_refs的当前Schema允许合法类型的IR引用。REQUIREMENT引用用于要求覆盖及联合核验；EVENT/ENTITY等引用作为声明操作数单独绑定，不能代替任何必须覆盖的REQUIREMENT。依据声明保留真实BASIS关系，不从formula文字生成额外约束。

evidence保留set_members/cardinality、interval、truth_table、graph，并增加expression_cases。

- SET给实际成员引用及基数；INTERVAL给精确上下界、端点及单位；GRAPH给真实节点/边及有环主张。
- LOGIC给truth_table.formula_ref明确引用本项input_refs中的被计算EXPRESSION，以及bindings、true_count、false_count，不靠引用数组次序猜公式。binding.reference是STATE、BOOLEAN VARIABLE或STATE_VALUE/EVENT_OCCURRED/EVENT_COMPLETED/EVENT_SUCCEEDED表达式。rows=[]允许程序机械枚举全部布尔组合并复核模型计数，不再让模型重复输出每行引用。若提供rows，必须完整且每行结果一致。未绑定的文字变量不算可验证证据。
- 开始门、禁止、动态停止等给expression_cases：每条{input_ref:本项input_refs中的真实EXPRESSION,context_json:上述格式字符串,expected:true/false/UNKNOWN}。覆盖正例、反例及信息未知；只验证明确引用的公式，不扩成整案证明。
- JOINT的SAT必须给完整witness_query_json。该见证复核适用于本次全部IR约束；若有源文GAP、漏映射或审阅异议，不能升级完整原文通过。

## 活动与控制区间

事件用角色ACTIVITY_CLASS引用kind=ACTIVITY_CLASS的类别ENTITY；ACTIVITY_CLASSES_OF(event)读取该集合。类别由模型解释原文并接受独立审阅，程序不按操作词或名称猜。TASK_EVENTS不包含TASK载体时间记录，但保留所属动作及未知后续成员的开放域。ACTIVE_WHILE(event,state)检查事件占用时间与该状态明确期间的重叠。持续事件占用[start,end)，零时长事件占其时点；控制期间的端点由periods显式给出并说明建模假设，未命中禁止不授予许可。

动态禁止可用EXISTS(TASK_EVENTS(task), AND(EVENT_OCCURRED(e),类别匹配,ACTIVE_WHILE(e,control_state)))作为FORBIDDEN的body。主体不限时用事件binder，不缩成当前列出的几个动作。停止响应和必要汇报须保留各自类别，不能被误列入受停活动。

## 审阅与修订

calculation_reviews.target只使用本次输出Schema枚举的目标：各constraint ID、calculation ID、unresolved ID、joint及coverage.<source_ref>，逐来源检查，不使用额外整体coverage或新造编号。独立审阅给出真实来源和裁定，机器证据缺失不能用SUPPORT抵消。

unresolved.kind必须明确：SOURCE_SEMANTICS是源文解释未决，IR_REPRESENTATION是明示语义表达缺口，QUERY_SUPPORT是特定查询/分支的程序支持限制，NORMAL_UNSPECIFIED是源文正常未陈述。全部保留并独立审阅。只有明确可满足的完整Core见证检查全部声明要求后，其他未激活分支的QUERY_SUPPORT及正常未陈述才不阻止该有限存在性结论；不因此认证那些分支或未来执行。源文歧义、IR缺口、遗漏、无效证据均继续阻断完整原文结论。

omissions.repairability为REPAIRABLE、CONTRACT_UNSUPPORTED或CLARIFICATION_REQUIRED。只有本版接口确实无法表示时才用CONTRACT_UNSUPPORTED；本版已支持ACTIVITY_CLASS、ACTIVE_WHILE和有限证据接口，不能再宣称不存在这些能力。不可修接口缺口或需用户澄清不触发空补丁请求。可修技术证据问题进入有界局部修订；变化后重新绑定审阅，原答和失败不覆盖。
