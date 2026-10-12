# 直接候选IR合同 candidate-ir/1.2

本合同落实用户选择的第二种接口：LLM直接输出候选IR，不输出旧proposal后再由程序重新解释语义。它是候选，不是已认证事实或最终求解结果。七个维度加独立B定义不变。

## 责任和启用条件

链路为原文→解析Skill/LLM候选IR→新会话审阅Skill→技术校验与接受记录→同一IR的7+1视图与数学计算。程序可以计算来源区间、整理索引、机械反向引用和附加接受/Proof记录；不得扫描原文或note补语义、抹掉约束或从7+1反推IR。

不能把旧wire-proposal、proposal或带程序认证字段的boundx-boundary-ir改名后提交。模型不生成ACCEPTED、RESOLVED、技术Proof、数学见证、耗时预测、业务完成记录或授权。business_decision和execution_authorization始终由宿主保持null。

本版本Schema与语义校验能检查候选接口，不代表所有算子已有运行消费者。宿主必须另提供消费者能力清单；未实现算子保持NOT_IMPLEMENTED，不能据Schema合法宣布可计算。本资源尚未接入58618，不能继承ui65或历史验收。

## 一份结构与有类型引用

对象、变量、事件、状态、表达式和要求分别有唯一id。引用统一为{kind,id}，不得以标签、文件名相同或位置邻近认定身份。来源表每个条目为{id,quote,occurrence}；quote是原文完整相同子串，occurrence从1开始。其他节点仅引用source_refs，程序计算精确码点区间。

ENTITY是明确对象身份；VARIABLE是执行时取值，带type、domain表达式和binding_mode。OBJECT变量的有限域表达可行执行选择，不能装进指代竞争。TASK_FIXED在本任务中一次绑定后不变；INSTANCE_LOCAL在所属实例中绑定；OBSERVATION表示尚无实际观测。真正指代/范围歧义放issues，不按选择数产生歧义。

GROUP.members是实体引用，GROUP_MEMBERS只接收GROUP实体。有限集合SET可包含实体或变量引用；不再有可混淆的MEMBERS(ITEM(...))两种表示。所有消费者遵守相同引用和算子注册表，不各自解释树形结构。

## 事件、模态和7+1视图

TASK节点是任务范围载体，不是另一个业务动作；其owner_id为本任务ID（根任务为ROOT）。TASK_EVENTS(TASK引用)表示该任务及其明确子任务所有执行事件的域，包含重复实例和后续执行事件，不等于当前IR节点列表。EVENT变量以该域为domain，INSTANCE_LOCAL只在量词体绑定。FORALL(domain, body)的bound_variable为该EVENT变量。ENVIRONMENT_OF(EVENT变量)是执行环境；OBJECT_OF是动作目标，两者不互换。

“全部操作仅限某环境”必须有任务域上的FORALL与环境相等约束；在各事件上复制环境角色或在TASK上写一项环境角色都不能代替该约束。已有明确子任务通过owner_id路径归属；域、量词、环境值均保留来源。当前程序可以对给定事件记录确定性核查此规则，并保留原量化约束；尚不能对任意开放事件域完成联合证明时，单列求解缺口，不能把只检查已列节点说成全称证明。

禁止模式不得附加原文未规定的执行环境、时间或接收者条件。任务级允许环境与独立禁止可同时约束同一事件，不能把前者塞进后者的匹配条件，造成禁止缩域。“访问某环境”将环境作为OBJECT目标；只有原文明示实施访问的位置时才同时绑定ENVIRONMENT。模式未限定某角色，代表该匹配字段不限定；明确的角色必须保持，不凭标签补值。

事件描述操作、层级、CURRENT_TASK/MENTION_ONLY用途、所有者和角色；角色包括PERFORMER、ORGANIZER、REVIEWER、APPROVER、RECIPIENT、COLLABORATOR、INPUT_OBJECT、OBJECT、RESULT、DELIVERABLE、BASIS、CONTENT。组织不等于执行，不从岗位推权限。当前产物跨生成、复核、交付引用同一实体；原文独立版本/轮次则分别表示。

operation是固定操作类别，不是程序再次解释的动词字符串；自然语言名称只在label。operation_extent为EXACT/OPEN；OTHER不得写EXACT或靠模糊类别断言相容。actor_domain=EXPLICIT表示明确主体角色，TASK_SCOPE表示本任务不限定个人的主体域，UNKNOWN表示原文真正未明确。接收者始终保留RECIPIENT角色引用，不能折入label后丢弃。

模态只在requirements中声明：REQUIRED、PERMITTED、NOT_REQUIRED、FORBIDDEN、UNSTATED，不重复在事件中给另一份权威值。EVENT_NORM的subject为事件或事件实例；适用前提applicability与被约束subject、body分开，不能把限制条件变成独立义务。引文和背景事件不能因被提到变成主任务动作。

O包含明确产生或交出的结果/内容，不以文件名、新建或文件存在为前提。RESULT表示产生用途，DELIVERABLE表示交付用途；允许生成、无需交付、禁止向特定接收者交付分别保留，不转成必交。禁止的事件模式完整绑定操作、对象、主体域、接收者、任务范围及生效条件，不只保留对象列表或predicate中的字样。

7+1是同一结构的用途视图：输入范围I、结果/交付O、动作A、责任/角色P、资源及执行量化R、约束性依据V、完成/停止C、独立禁止B。LLM不另写一份与IR竞争的八槽答案。

## 数学表达和组合

IMMEDIATE_AFTER(STATE,EVENT)是定性优先响应谓词：触发成立后该响应优先于继续本任务的普通工作；不规定数值延迟，不等同于时间点相等或0秒。程序在抽象事件次序中证明响应处于触发之后，并不允许普通任务动作开始点夹在二者之间；应急STOP和REPORT不作为被阻断的普通工作。这个证书属于抽象优先响应，不是现实调度器的实时性证明。

局部修订传输为boundx-candidate-ir-patch/1：base_ir_sha256绑定首次IR；各集合仅含新增和获准替换节点，空集合不删除任何节点。不得替换无关已接受节点，不得重建整图。宿主合并后重新做完整技术校验并在新会话审阅，最多一次修订，原始响应和全部失败保持。覆盖新增义项使用新增coverage行，不覆盖首次覆盖声明。

表达式是有类型DAG，各算子定义见operator-registry.json。数值字面量保持原值，REAL_INTERVAL与INTEGER_RANGE有固定unit；开闭边界通过GT/GTE/LT/LTE等比较表达，不靠字符串。整数域与实数域不同；计数采用整数，不允许负数和分数偷偷满足一个上界。被计数的目标、次数基数和首次偏移都要有表达式关联，不留note。

逻辑AND/OR/NOT/IMPLIES/IFF的每个输入必须为BOOLEAN。量词有bound_variable和domain，body中变量引用在该辖域内解释；有限可选对象是变量域，不是OR竞争解释。集合基数约束不能代替每个事件对象与选择变量之间的绑定。

状态有明确kind（COMPLETION、SUCCESS、FAILURE、RECEIPT、CONTROL_EFFECT、EXTERNAL）、所述subject及arguments。状态解释不宣称实际已真。SUCCESS不由仅执行动作推出；接收不等于发起提交；非成功STATE不要复用成功意义。

事件时间点、状态成立点和必要前提是独立表达。TRUE_AT_START(state,event)约束动作开始时该状态已经成立，不接受后来通过的终态追认；BEFORE表达纯先后，不自动增加动作义务或完整生产事件结束依赖。若原文同时要求收到后必须复核，既保留收到后的义务，又保留不得提前执行的边界。必要、充分、充要不互换。

重复以TEMPLATE事件、EVENT_INSTANCE(template,index)和有界整数索引域表达；PREVIOUS_INSTANCE只指该序列直接前一实例，不能指任意曾失败事件。每次尝试的对象都引用同一任务固定变量；次数域、首次与重试偏移及每次前提独立保留。不明确的次数/失败观测是运行未知，不是源文边界不明确。

DATA_USE明确消费者、被使用对象、生产实例（若源文指定）、USED_PORTION或COMPLETE_RESULT；不把全部数据可用性升级成整个生产任务完成的强顺序。所有者owner不是时间边。

requirements.data_use仅在DATA_USE时非null，固定object/consumer/producer/availability；其他要求为null。producer无来源指定则null，不能凭文件存在虚构生成者。

## 算子固定语义

| 算子 | 输入与固定含义 |
|---|---|
| SET、GROUP_MEMBERS | 有限成员引用；GROUP_MEMBERS输入直接GROUP实体，不接ITEM包裹 |
| UNION、INTERSECTION、DIFFERENCE | 集合并、交、差；DIFFERENCE有序，A减B |
| MEMBER、SUBSET、CARDINALITY | 对象属于域、集合子集、有限集合成员数 |
| BOOLEAN、NUMBER | 无参数字面量；值在literal，其他算子literal=null |
| REAL_INTERVAL、INTEGER_RANGE | 下、上界两个数值参数，闭区间域；仅INTEGER_RANGE要求整数边界。开端点另以GT/LT约束，unit固定 |
| EQ、LT、LTE、GT、GTE、ADD | 相等、数值比较、加法；算术量须同维度/单位，EQ不按标签判身份 |
| AND、OR、NOT、IMPLIES、IFF | 布尔合取、析取、否定、蕴含、充要，保持方向 |
| STATE_VALUE、EVENT_OCCURRED | 引用状态是否成立、指定事件或实例是否发生；未提供观测不设真 |
| EVENT_START、EVENT_END、STATE_ESTABLISHED | 指定事件起止点、指定状态成立点；不默认三者相同 |
| TRUE_AT_START | 第一个参数为STATE，第二个为事件/实例；该状态须截至开始点已经成立 |
| BEFORE | 两个时间点的严格先后；相同时点是否允许须以LTE显式表达，不猜固定间隔 |
| EVENT_INSTANCE、PREVIOUS_INSTANCE | TEMPLATE与整数索引形成实例；前次索引严格减1且必须在所属序列域内，不循环、不任意回找 |
| OBJECT_OF、RECIPIENT_OF、ENVIRONMENT_OF | 指定事件/实例的对象、接收者、环境；未知不是空域或许可 |
| FORALL、EXISTS | arguments=[domain,boolean body]；bound_variable为VARIABLE引用，只绑定该body辖域，不能裸写ALL替代成员量词 |

未能保持单位、实例边界、量词绑定或唯一类型时保留局部EXPRESSION_GAP；不靠字符串note暗示程序应做何运算。

requirements.views记录该要求应出现的7+1视图，程序按该字段展示，技术检查只拦住与明确结构矛盾的归槽，不扫描原文重选维度。多维要求可保留多个视图。TOTAL_DURATION必须明确引用ROOT任务的唯一REAL变量作为subject，body为其数值限制；仅该要求授权把对应区间与本任务时序图联合嵌入。不能从首个REAL变量、单位或note猜整体期限。动作事件、产物角色等固定视图仍由类型和角色直接显示，不改变数学IR。

## 覆盖、疑点与不能表达

coverage逐源义项指向实际IR节点；若规则只写在note而没有节点，不能报EXPRESSED。issues区分AMBIGUITY、UNSPECIFIED、EXPRESSION_GAP；消费者尚未实现由程序另报NOT_IMPLEMENTED，不能归成原文歧义。对象范围、角色和条件时序的不确定性各自局部保留，不能污染已明确的事实。

独立审阅逐节点核对原文，不以图自洽、Schema合法或先前模型自审替代支持证据。局部修订仅改变直接受影响节点，保留首次结果；来源、实体身份、约束引用及量词辖域变更须再审阅。该版本尚未提供修订传输Schema时，宿主不得把旧patch Schema用于新IR。

审阅完整性：整节点裁定field_path=""。若采用多个字段裁定，只有全部语义字段均被支持、没有矛盾或疑点时才能覆盖整节点；只支持members不能代表身份、类型和作用域也已被支持。程序必须记录缺审字段，不把审阅格式缺失归为原文歧义。
