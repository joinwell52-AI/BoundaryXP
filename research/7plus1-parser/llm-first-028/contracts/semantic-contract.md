# BoundaryXP 语义合同 031-r1.1

## 非文件交付用途（031-r1.11）

O的DELIVERABLE不限文件，包含原文明示要求或允许交出的汇报、答复及说明内容。动作、内容与接收者关联同一事件；没有文件名不等于没有交付。不补文件、生成义务、细目、存在断言或外部I。纯背景、内部思考及引文不升格为当前交付。条件中的提交完成可作为有来源的时序参照，不新增独立提交义务或执行授权。

## 可消费的操作和状态关联（031-r1.9）

event.semantic_signature由LLM依据原文表达，包含effects、extent、actor_domain、state_links。effects是当前动作本身的效果类别：READ读取/检查、WRITE改变已有对象、CREATE产生新结果、DELIVER交付、REVIEW复核、ORGANIZE组织、STOP停止、CONTINUE继续、ACCESS访问、REPORT汇报；不能确定用OTHER及OPEN。EXACT表示所列类别完整表达当前动作，不包含未列效果；这是候选解释，必须独立审阅，不能以程序词表推断。“不得修改”限制检查方式时，检查可在该限制下表达READ，不另增WRITE。生成新报告不同于修改禁止输入。actor_domain=EXPLICIT有明确参与者；TASK_SCOPE为本任务范围内不限定单一执行者的禁令；UNKNOWN是真正域未明，不靠组织者代填。

state_links引用同一event_id的正向STATE表达式，逐链接说明aspect和relation。COMPLETION是该具体动作已经完成，可用IFF；SUCCESS是成功/通过/批准，只能STATE_IMPLIES_EVENT，执行不保证成功；CONTROL_EFFECT是停止导致的停止期间状态，只能EVENT_IMPLIES_STATE，须STOP效果及来源支持。不存在这类引用时state_links=[]。外部风险状态不绑定为本任务必须发生的动作。不能把所有STATE当动作完成，更不能为凑联合通过捏造关联。来源和审阅覆盖事件与STATE两端。旧响应没有该字段时不得程序补语义，联合证明保留合同缺口。

STOP/CONTINUE的continuation_targets引用停止范围内原文明示的现有工作事件；其他效果写[]。停止期间不得继续的CONTINUE禁令须引用同一停止期间STATE及受限事件；汇报、停止自身不在继续核查/汇总范围内。范围成员由LLM按原文任务身份识别，程序不扫描词汇或把全体事件默认纳入。真正范围不唯一保留缺口。控制目标只作范围关系，不新增义务或工作包，不在requires制造循环。

静态联合求解搜索声明边界下的抽象赋值，不需要实际执行观测。任意约束SAT、完成目标可满足、高危分支可满足分别记录。产物就绪里程碑只表示本次RESULT在声明用途处可用，不推出生产者整项工作结束。逻辑先后排名不是实际耗时预测。技术接受和静态见证不签发执行授权。

## 条件辖域与并列后件（031-r1.8）

条件辖域由完整话语语义决定，不能仅靠逗号、分号或重述主体决定终止。同一条件段中的并列后件、追加处置或后续汇报，若来源支持它们受同一前提管辖，分别建立各自CONDITION，引用条件和后件两端。重复主体不自动撤销前提；“立即”等局部限定则不自动扩散到全部后件。新条件、独立无条件要求、转折、其他对象或任务辖域必须分别核对，不能机械传播。真正辖域竞争才记录局部疑点。程序不从标点或动作名称推导条件。

## 根任务限制闭环（031-r1.7，优先于旧执行量目标条款）

原文明示整项任务的总耗时、总预算或总次数时，QUANTITY采用event_id=null、scope_id=ROOT、quantity.target_id=ROOT、count_scope=ROOT、use=EXECUTION_LIMIT、distribution={mode:AGGREGATE,domain_id:null}。这不是某个组织事件的耗时；不虚构整个任务的ACTION来承载数量。不允许用count_scope=ROOT替代错误的事件目标。具体事件限制仍绑定该事件并回指constraint_ids。输出内容、计划及逐成员数量不得使用这个根执行量签名。

原文明示全任务对象/操作集合的属性限定时，SCOPE可以event_id=null、scope_id=ROOT、entity_id=来源支持的受限集合/对象，TEST.target_id必须等于该entity_id且TEST.event_id=null。保留集合身份和属性限定，不按标签展开成每个事件，不从ROOT借其他事件论元。具体事件属性保持原归属合同。程序只消费这些显式字段，不扫描原文补目标、成员或属性。

## 边界完整性与局部疑点（资源修订031-r1.5）

资源修订031-r1.6：候选采用最小忠实语义。TEMPORAL/ORDER已表达的单纯先后，不另补原文没有蕴含的充分触发或充要条件。另有明示准入、触发、成功前提时须单独表达并保留状态，不能把“成功后”缩成普通完成后。多造条件是候选错误，不是作者歧义；修订须保留真正的限制。note是解释记录，不能增设排他限定或替代规范字段；局部修饰范围竞争不改变独立已明确的角色/对象身份。

7+1表达任务可接受范围和规范要求，不陈述已发生结果。模型解释边界，程序消费显式结构；缺少运行观测不意味着原文明示边界未知。既有STOP→C、FORBIDDEN→B不变。

明示条件触发停止/暂停具体任务时，模型分别表达停止义务、根停止条件（适用时），以及该停止范围内不得继续的条件FORBIDDEN事件，绑定同一任务对象和触发来源。继续限制只覆盖该停止阶段及目标，不推出永久禁止、其他任务禁令或风险永不发生；告警/汇报/升级本身不推出停止。恢复条件/例外若无法安全表达，显式GAP，不省略后把停止限制当完整。程序不从STOP、predicate、note或原文机械补FORBIDDEN事件。

issues.field_path若为collection[id].property，只有该id是直接疑点目标；subject_ids中的其他id为关联背景，仍保留记录与来源，不将其降级。相对路径或空路径按列出的直接subject_ids处理。条件方向竞争不否定独立已表达和审阅的TEMPORAL；该时间关系不能证明条件方向或完整动作接受。无法明确定位的真实疑点不自动放行。

## 事件属性归属与立即限定（031-r1.4-additive）

兼容版本仍为031-r1.1，实际资源修订为031-r1.4。SCOPE引用TEST时，允许TEST目标为该SCOPE.event_id本身，或该事件明确ROLE绑定的实体；scope_id只表示适用域，不允许借用其他事件论元。ROOT不是TEST目标。

原文明确“立即/immediately/without delay”且限定具体事件时，LLM用TEST `{target_id:事件id,event_id:同一事件id,property_path:[],operator:"IMMEDIATE",value:null}`，再用该事件的SCOPE引用它。这是不得无故延迟的定性限定，不等于0秒，不自动增加数量期限；条件触发另以原有CONDITION表达，保持目标、方向及来源。只有引文/背景提到立即，不新增当前义务。多个明确限定分别表达，普通ITEM、STATE名称或note不能代替该约束；无法绑定时保留局部GAP。

程序只核对显式结构及来源，不扫描原文或note补IMMEDIATE。技术/审阅覆盖用PROPERTY_CONSTRAINT引用SCOPE与TEST。运行观测须为 `tests[expression_id]={target_id,event_id,property_path:[],known:true,immediate:布尔}`，对象/用途/路径不匹配、known非true或无布尔观测为UNKNOWN。FALSE表示本条及时性未满足，不产生授权；TRUE也不证明其他条件满足。不读取业务文件，不替调用方证明实际响应及时。

## 可计算属性与产物行为（031-r1.3-additive；优先于下文旧字段列表）

结构兼容版本仍为031-r1.1，实际资源摘要区分031-r1.3。新增TEST表达式与events.specifies_result_id。新wire必须填全部字段；旧响应可缺省为未表达，不继承新模型验收。

- TEST是一项原文明示的原子属性约束：test={target_id,event_id,property_path,operator,value}。target_id为具体实体/事件；property_path为来源支持的属性层次数组，[]表示对象本身；event_id为属性所属用途，未说明才null。不得从注释、对象标签或predicate字符串机械补测试。
- operator为EQ/NEQ、IN/NOT_IN、LT/LTE/GT/GTE、EMPTY/NONEMPTY、EXISTS/NOT_EXISTS、UNCHANGED。前四种大小比较用数字；IN/NOT_IN用明示非空有限字面值数组；EMPTY/NONEMPTY、EXISTS/NOT_EXISTS、UNCHANGED的value=null；EQ/NEQ用原文明示的单个字面值。类别全称、方法调用、业务授权不由IN或EXISTS替代。属性路径不能冒充整句说明。
- TEST没有state和operands。多个独立属性分别TEST，合取/析取/否定用AND/OR/NOT；条件方向仍在CONDITION上。仅提到一个字符串或枚举不是要求其成立。真正的完成/批准等事件状态仍用STATE；不得把条件、例外、方法和后果整段合并成一个不透明predicate。
- 产物内部行为：CONTENT层、MENTION_ONLY事件用specifies_result_id显式引用所属生产者的RESULT主张；owner_id等于该RESULT的event_id。来源必须覆盖产物和行为。其角色、条件、模态保留，作为O的规格要求，不新增当前A/B/C执行义务。内部REQUIRED表示产物必须具备该行为；FORBIDDEN表示产物不得具备该行为。没有唯一产物绑定时保留局部GAP，不借最近对象。
- 原文要求实现的函数加载/调用某个输入，分别保留CONTENT行为及其OBJECT、条件、来源；只有原文明确当前内部产物供另一个当前事件使用时才建立ARTIFACT_USE。产物内部“应拒绝”不能变成当前禁止批准/提交；被要求实现的行为与当前实际执行分开。
- 如可明确表示操作方式、启用模式、保留既有状态，用SCOPE绑定具体操作/产物和TEST/Boolean表达式，不把复合政策塞进OTHER名称后用ITEM冒充可计算限定。仅opt-in若原文的限制对象仍竞争，保留局部歧义；不得因新增TEST就代替作者选择。
- coverage和source_checks新增PROPERTY_CONSTRAINT、OUTPUT_BEHAVIOR：前者须引用实际SCOPE/CONDITION及可达TEST，后者须引用显式specifies_result_id的行为或主张。普通CONTENT、ITEM和note不满足这些声明。无法表达的明确要求记录GAP及最小缺失，不报告完整解析。
- 程序对TEST只使用提供的运行观测tests[expression_id]={target_id,event_id,property_path,known:true,value}；UNCHANGED需unchanged布尔，EXISTS/NOT_EXISTS需exists布尔。对象/用途/路径不匹配或缺少观测为UNKNOWN，不读取业务文件。UNKNOWN观测不是源文语义缺口，未命中禁止不是许可。
- ARTIFACT_USE、TEMPORAL、owner与requires仍互不替代。只有明确先后形成时间边，不给每个含owner的阶段自动加调度边，不把产品内容比较变成资源R。先检查完整原文的明确用途与流程，再生成结构；逐项source_checks独立复核。


结构合同兼容标记仍为031-r1.1；本资源修订为031-r1.2-additive，冻结摘要区分版本。新增字段在旧响应回放中允许缺省为未表达，不把旧响应当作新版本模型验收；本次wire输出必须显式填写新增字段。

## 可计算限定与局部绑定（031-r1.2-additive）

- GROUP实体的members为来源明确的成员id数组，未列全用null，不用空数组伪装未知。不从标签、邻近文本或岗位类别推成员。非GROUP填写null。一个较窄子集与整个集合不能交换。
- quantity.distribution明确为AGGREGATE（domain_id=null）或EACH（domain_id为集合表达式）。未知而无法表示用null，并记录局部覆盖缺口；不能用metric/note中的“每份”代替EACH。ITEM(group)选中一个组对象；MEMBERS(ITEM(group))才是组内各成员。有限成员域用ITEM/UNION/INTERSECTION/EXCEPT，不把布尔ALL当集合全称。成员未枚举的GROUP也可形成MEMBERS域；实际成员和计数没有观测时求值UNKNOWN，约束本身仍保留。
- 数量use新增WORK_PLAN，目标为拥有该计划的事件，保留明示阶段/提交等安排，不变成EXECUTION_LIMIT资源配额。只有原文确立执行时间、预算、容量、次数限制时才用EXECUTION_LIMIT。不得按次数单位或标识符数字选择用途。
- 引用事件的STATE论元必须来自该事件的角色端点，或来源明确GROUP.members中的成员/子集。不能因同一领域而把宽集合放进窄验收。阶段通过状态引用对应阶段的测试事件实例；同一测试命令在不同轮次是不同实例。没有唯一来源时保留局部疑点，不借先前阶段的成功。
- 每个coverage项新增requirement_kind：GENERAL、RESTRICTION、QUANTITY_TOTAL、QUANTITY_EACH、WORK_PLAN或NON_BOUNDARY。来源明确的选择性、方式或禁止限制必须链接可消费CONDITION/SCOPE/禁止事件；受限对象无法唯一绑定则GAP/UNSPECIFIED加局部疑点，不能只保留引文。数量coverage须链接相应AGGREGATE/EACH/WORK_PLAN结构。
- 独立审阅新增source_checks：先按原文明示义项记录来源、requirement_kind、实际候选id、status、affected_views、reason，再逐节点审阅。原文每个明确义务/许可/限制/条件/数量/交付/角色及阶段都要核对；来源可多片段，但不能以全篇引文证明所有事实。遗漏写GAP和omissions；原文真正未指定或竞争保持局部UNSPECIFIED，不能把整个任务降为未知。
- 字段格式与引用有效不证明语义真值。局部角色绑定的技术状态与关联事件/约束的完整状态分开保存，不能用独立角色正确证明整项动作正确。明确要求尚无执行记录是运行观测UNKNOWN，不是解析遗漏。

依据v0.4/r04及031/031-R1 ADMIN批准的O口径与产物依赖区分。两个Skill、Schema、Γ和编译器共用本合同。模型提交候选；宿主的ACCEPTED仅代表有限技术检查与审阅支持，不证明自然语言真值。历史合同输出不静默升级；030/031不倒改。

## 维度及用途

I是明确输入/作用域；O包含明示要求或允许产生的结果及明示要求或允许交付的产物，不要求本任务新建。A是当前要求/允许动作，P是逐事件参与关系，R是执行量化限制，V是规范依据，C是根任务完成/停止，B是禁止/限制。八个维度是同一关联结构的视图，不是词语桶。不能由岗位推权限，不能补WP、默认执行者或业务授权。

RESULT仅表示产生结果的用途；DELIVERABLE表示交付产物的用途。两种用途均绑定各自事件、模态和条件，正向时进入O。明确提交/交付/发送某产物应有DELIVERABLE，不凭它新增生成/修改事件、存在断言或外部输入I。禁止或无需交付不产生正向O，仍保留事件和DELIVERABLE用途；允许生成+无需交付分别为PERMITTED RESULT和NOT_REQUIRED DELIVERABLE，不变成必交。普通接收的OBJECT也不自动变成新结果。引用中的交付不是当前任务。

实体有稳定 id、label、type、mentions 和 alternatives，不具有排他的全局槽位。FILE、PERSON、SYSTEM、DOCUMENT、GROUP、REFERENT、OTHER 是身份类型；角色与用途属于具体事件。生成的结果被复核、提交仍是同一实体，但这些内部用途不是外部输入。

## 数据约定

顶层 contract_version 固定为 031-r1.1；entities/events/claims/expressions/issues/coverage 六个数组。所有 id 全图唯一，ROOT 是保留根任务标记。每项来源 sources/mentions 均使用真实非空 quote + occurrence（从 1 开始的完全相同字符串出现次数）。不要输出猜测偏移；宿主按 Unicode 码点定位。跨句指代/共享主体要引用两端；抽象状态可用多个片段，不伪造连续引文。每个claim的artifact_use不适用时为null；旧合同不静默升级。

events：predicate 是模型解释的规范动作/状态名称（使用简洁中文），kind 为 ACTION/STATE；layer 是 MAIN/CONDITION/QUOTED/MODIFIER/PURPOSE/CONTENT/BACKGROUND；use 是 CURRENT_TASK/MENTION_ONLY；modality 为 REQUIRED/PERMITTED/NOT_REQUIRED/FORBIDDEN/UNSTATED；polarity 是 POSITIVE/NEGATIVE；owner_id 为 ROOT 或结构父事件；constraint_ids 是约束此事件的全部 CONDITION/QUANTITY/TEMPORAL 主张；requires 仅列真正必需的语义依赖。owner 和共现不是证明依赖。

claims 按 kind 区分：

- ROLE：event_id + entity_id + role。参与角色 PERFORMER/ORGANIZER/REVIEWER/APPROVER/RECIPIENT/COLLABORATOR；对象用途 INPUT_OBJECT/OBJECT/RESULT/DELIVERABLE/BASIS/CONTENT。INPUT_OBJECT 是明确外部输入/受检范围；OBJECT 是内部产物或普通动作对象，不自动进 I；RESULT 是该动作产生结果；DELIVERABLE是该动作交付产物，不推定新建或存在；BASIS 是对该用途有约束的依据。组织不等于执行。CURRENT_TASK 的明确参与关系进 P；纯条件/引文参与者不增义务。
- CONDITION：event_id 为被约束事件；expression_id 为条件表达式；direction 为 NECESSARY/SUFFICIENT/IFF；temporal 可为 AFTER/BEFORE/null。事件的 constraint_ids 必须回指该主张，缺失或不对称会拦截而不是变无条件许可。
- TEMPORAL：event_id + expression_id + direction=ORDER + temporal=AFTER/BEFORE；保留单纯先后，不假装是充分因果。
- QUANTITY：event_id + quantity；quantity 的 metric、target_id、comparator(EQ/LT/LTE/GT/GTE)、value、unit、use(EXECUTION_LIMIT/OUTPUT_CONTENT/COMPLETION_THRESHOLD/CLASSIFICATION_THRESHOLD)、count_scope 全部明确。count_scope 引用 ROOT、事件或实体。R 只收 EXECUTION_LIMIT；输出内容数量挂到 O，不变成资源次数。
- COMPLETION/STOP：event_id=null，scope_id=ROOT，expression_id + direction 指明根任务触发/前提；只有才=NECESSARY，即=SUFFICIENT。条件状态未知不妨碍表达。STOP 可包含停止/中止/升级语义 note，不能抹成完成。
- SCOPE：event_id 可空，expression_id 描述明确作用范围，scope_id 指出目标；不能从禁止对象推外部输入。
- ARTIFACT_USE：LLM明确表达某消费用途使用本次某RESULT实例。event_id=消费事件，entity_id=同一产物身份，scope_id=消费事件；artifact_use={producer_result_id:生产ROLE RESULT主张ID,consumer_role_id:同一事件/实体的OBJECT/INPUT_OBJECT/DELIVERABLE主张ID,availability:USED_PORTION或COMPLETE_RESULT}。role/expression_id/direction/temporal/quantity均null；sources至少引用生产与使用两端。USED_PORTION仅要求被使用部分可用，默认不要求整个生产动作结束；只有原文明示需要完整产物才用COMPLETE_RESULT，完整产物也不等于生产者全部其他工作完成。明确“生成完成后再复核”等事件顺序另用TEMPORAL/STATE，不能由ARTIFACT_USE代替。

共享身份可按RESULT和对象用途形成DERIVED同身份关联索引，不自动证明同版本、可用性或先后。原文明确当前结果供另一用途使用时必须有ARTIFACT_USE并接受独立来源审阅；旧版本先复核再覆盖、两轮同路径、部分/流式结果、多来源竞争不能全局串行化。相同路径但版本不同应保留独立实体/明确版本；不从标签、note、位置或文件名推用途实例。只有当前正向生产/使用、身份及全部关联主张技术闭合后，程序按031-r1-artifact-flow-v1生成可用性依赖，保留各自模态/条件/范围、输入主张、规则版本和来源。该依赖不是Proof.requires、执行调度、完整事件完成或QA已批准。真实竞争只阻断相关依赖，不否定独立动作；明确漏表达经原有一次有界修订，不能记ABSENT。

每个 claim 的不适用字段填 null，requires 只引用必需身份/语义主张；sources 和 note 始终保留。每个事件和角色独立审阅。FORBIDDEN 事件进 B 而不是 A，NOT_REQUIRED 保留撤回义务不进 A/B；UNSTATED 不能冒充允许。layer 本身不代替 use，但 QUOTED/MODIFIER/PURPOSE/CONTENT/BACKGROUND 的 MENTION_ONLY 事件不是任务动作。目的补语不自动增加独立义务。条件中的批准/复核不自动要求其发生。

操作方式限制只约束原有操作，不凭“只读/不可改写”等限制新增独立 REQUIRED 事件。限定内容用 SCOPE/CONTENT 及来源表达；原文明确要求的动作仍独立保留。

## 表达式与条件

expressions 的 op 为 STATE/ITEM/ALL/ANY/UNION/INTERSECTION/EXCEPT/AND/OR/NOT。STATE 的 state 包含 predicate、event_id（可空）、args（实体/事件/ROOT 引用）、polarity；表示有参数状态，不表示已观测为真。ITEM 的 operands 恰为一个实体引用。其他 operands 是表达式引用：NOT 恰一个；EXCEPT 恰两个；AND/OR/ALL/ANY/UNION/INTERSECTION 至少两个。只解释固定操作符，绝不执行模型代码。

必要前提限制目标动作，充分触发在前提成立时触发目标，IFF 双向，ORDER 仅时序。保持条件方向、目标、极性与时间；不能把有前提的许可编译成无条件许可，也不能把“即完成”改成唯一完成条件。

**方向不可由模态整类套用。** “在某范围内必须/不得做某事”是范围成立足以触发该义务/禁止，通常为 SUFFICIENT；不能将“该范围触发禁止”写成“只有该范围才可能禁止”的 NECESSARY。必要的许可前提与充分的禁止触发分别表达，不能共用方向。未发生状态使用 NOT(已发生状态) 或带 NEGATIVE 极性的状态；纯时间 BEFORE 只描述先后，不能要求未来参照事件已经发生才判断前置范围。不得省掉禁止方向/范围，不推定任何状态的真实运行值。

条件方向逐目标独立解释，不从根完成条件复制到动作或并列组。区分三件事：A 是执行 B 的必要前提（B⇒A）；A 成立触发 B 的义务（A⇒B）；A 与 B 仅有明确先后（ORDER）。同一状态被多处引用不使这些方向相同。“之后”本身不能证明充分触发，REQUIRED 本身不能证明必要前提；需要结合该目标完整的局部指令及其来源判断。必要条件与 REQUIRED 结合会限制该已要求动作，不能借此新增“保证前提成功”的动作或改写条件义务。若原文允许多个解释而合同不能唯一表达，保留局部疑点及影响用途，不用一个方向冒充全部解释，也不抹去其他明示义务。

## 未指定、歧义与覆盖

issues 的 kind 为 AMBIGUITY/UNSPECIFIED/COVERAGE_GAP，subject_ids 和 field_path 指向实际影响主张，alternatives 保留合理备选，affected_views 仅定位影响范围，不签发槽位状态。执行者未指定通常 UNSPECIFIED/OPEN_FOR_REFINEMENT，不阻断已明确动作；REFERENT 的多个 alternatives 是真实身份歧义，依赖该身份的用途保持 UNRESOLVED，不能污染同文件的其他明确用途。

coverage 从原文每项动作/要求/禁止/条件/数量/例外出发，sources + claim_ids + status(EXPRESSED/BACKGROUND/UNSPECIFIED/GAP) + affected_views。一条原文可含多项，字符覆盖不是语义覆盖证明。GAP 不能显示 ABSENT。缺省维度开放不是业务授权。

## 审阅合同

audit.contract_version 同版本，reviews 为每个 entity/event/claim/expression id 提供独立 verdict；subject_id + field_path 是直接质疑目标，context_refs 只解释背景，不是待拒绝集合。SUPPORT/CONTRADICT/UNCERTAIN，带真实 sources 和短 reason。issues 记录 issue_kind、subject_ids、field_path、context_refs、sources、reason 和 suggested_json（仅建议，不执行）。omissions 是原文明确信息漏项，提供来源与 affected_views。不能把审阅一致当真值证明。对一个比较对象的疑问不影响其他读取；身份本身歧义才影响依赖它的用途。

改变主张只能通过一次显式解析修订 + 新会话审阅，旧候选和意见不覆盖。宿主仅提供真实疑点，不提供评测答案。审阅补充未经重验不会直接成为事实。

field_path 的空字符串及精确 collection[id] 表示整节点；collection[id].property 与相对 property 指同一属性，不能将属性支持扩大为整节点支持。实体的 type 类别不确定与身份不确定分开：仅 type 的局部疑点保留为未决属性，不影响无需该属性的明确身份用途；缺来源、竞争身份、整节点反对或未获支持仍阻断身份依赖。显式 requires 依然要求完整主张接受，不能借属性级处理越过它。

有限计算以 STATE 的 predicate、event_id、args 构成同一状态键，polarity 表示极性。互补的同参数状态遵守排中/矛盾律，但每个单独的未知状态仍 UNKNOWN；不同事件/参数不合并。观察是测试/宿主输入，不宣称真实状态已发生。

## 技术策略与投影

### 031-r1.10：排他范围与消费绑定

SCOPE的scope_binding明确限定域，不由note或词语扫描推导。domain_kind为EXTERNAL_INPUT或EXECUTION_ENVIRONMENT，relation=ONLY_ALLOWED；expression_id指向允许成员的ITEM/UNION/MEMBERS有限集合，环境也使用真实实体ITEM，不以单一TEST布尔变量代替逐操作范围。subject_mode=TASK_OPERATIONS代表scope_id下所有当前正向操作（ROOT时全部任务操作）；subject_event_ids=[]。只限明确事件时用EVENTS并列出对应事件ID，不扩大为全局。

每个正向事件semantic_signature.external_input_ids明确列出本事件实际消费的外部输入实体，未消费填[]。组织范围不是读取行为，不将所有受检范围强造为外部消费。内部产物用途由ARTIFACT_USE连接，不列入external_input_ids；同一消费对象不可既为本次内部产物又为外部输入。实体及消费角色须引用同一来源；身份未知保留疑点，不能空数组掩盖缺失。

程序据此计算外部消费集合是否为允许域子集，并给每个实际操作分别建立环境成员约束。未知成员不判满足；不在允许域中的已知成员判违反；未命中禁止不签发许可。声明范围与观测值分开；抽象可满足见证只分配合法成员，不声称真实环境已使用。

其他claim的scope_binding=null，非此类范围的SCOPE也为null。旧响应缺少上述类型绑定时只支持历史分项重放，不能声明完整范围联合证明。既有SemanticSignature的状态/停止字段保持不变。

Γ 逐主张检查来源、Schema、唯一引用、签名、约束双向绑定、表达式参数、量化目标/单位、必需依赖闭合和循环、直接审阅及身份竞争。完整来源+SUPPORT+有限检查通过可 ACCEPTED；疑点局部 UNRESOLVED；技术坏结构 REJECTED。仅沿 requires 和实际角色身份/事件/约束依赖传播，不沿 owner/context 共现扩散。所有结果保存检查路径。

Q 固定消费用途，不用 predicate 字符串选槽：当前 REQUIRED/PERMITTED 事件→A；FORBIDDEN→B；ROLE INPUT_OBJECT→I、RESULT/DELIVERABLE→O、BASIS→V、参与角色→P；EXECUTION_LIMIT→R；OUTPUT_CONTENT挂O；根 COMPLETION/STOP→C；SCOPE→其明确范围用途。I/O/V 正向用途要求关联事件当前正向，内部 OBJECT 不自动 I。约束、对象与参与者留在同一事件事实，不做笛卡尔积。中文从同一 IR 渲染。NOT_REQUIRED、mention-only、未指定和缺口另列而非丢弃。business_decision/execution_authorization 固定 null。

字段到代码的映射见 FIELD-MAP.md。Schema 由 schema.mjs 唯一生成；模型与宿主使用同一文件摘要。

## 031 角色承接、身份与数量字段闭环

- 主体承接由LLM逐事件解释：连续同一指令的并列/追加动作没有主体切换、执行者另定、组织职责或竞争主体时，可承接明确主语；ROLE.sources须引用主语所在片段和省略主语的动作片段，note说明承接。组织者不自动执行被组织工作；条件/引文角色不传播为主命令执行者。真正未指定保留UNSPECIFIED。
- 先将mentions关联到实体身份，再绑定各用途。“本次报告”等唯一当前报告和随后文件名可由来源确定为同一实体，mentions包含两端；条件STATE.args与该文件动作用途引用同一id。复核A后提交B、不同轮报告、多报告竞争、未说批准对象等不得强合并。程序不读note猜同一性，也不从原文再推执行者或对象。
- quantity.metric描述被计数内容；target_id是被数量限制的事件或产物，不是内容项类别。EXECUTION_LIMIT.target_id必须为event_id；OUTPUT_CONTENT.target_id必须是同一event_id的RESULT或DELIVERABLE实体，计数项可另以CONTENT表达。count_scope明确计数范围；它不是target_id的自动替代。报告数量不能改投R。多个结果不能默认挑一个。
- 审阅逐字段核对上述关系，不仅检查数值或每节点SUPPORT。STATE.event_id若有值，应对应所引用事件；args与原文角色、对象和时序一致。
- 一次运行共享最多一轮语义修订：审阅CONTRADICT/明确遗漏及宿主白名单技术错误可共同触发。技术反馈只有真实错误码、字段、相关ID、合同要求，不含测试答案。修订后新会话审阅并重验；仍失败保留缺口，禁止删除数量/条件后当作成功。

身份检查须覆盖向前及向后的指称。唯一当前产物的指称与明确名称应有同一来源支持的实体id与mentions，不得拆为两个不相连实体并仅在note声称相关。真正有多个来源、不同轮次、不同对象或未陈述审批对象时不强合并。审阅器须检查跨用途引用链；缺失身份连接是可修订的语义遗漏，不是程序从原文猜答案的授权。

明确的随后、再、最后等事件先后需以TEMPORAL/STATE表达，不能仅留在note。后继工作承接整组并列前置工作时，表达式保留整组状态；并列本身不增加组内顺序。不推定状态已发生，不能把ORDER升为SUFFICIENT。程序只消费声明的引用及方向。


