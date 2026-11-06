**本例四个子任务的任务书均未越界，完整方案的综合结论为未越界。DEV及执行助手安排的甲、乙制作分别为15、20分钟；OPS安排两次10分钟核验，使用同一席位串行执行，并分别等待对应制作结束；QA在两链核验结束后复核5分钟，PM随后汇总交付5分钟。计划于t=45完成，比父任务t=50的截止提前5分钟。乙链交执行助手制作没有取消DEV的链路责任，T4也明确由PM汇总，没有把PM职责改派给QA。**

判断范围仅为任务书边界及文本已经陈述的状态。本例没有报告已发生的制作、核验或交付，也没有明示身份或证据未定事项；不能因此新增执行成功待证目标。以下提供可复核公式与Core操作数，计算结果是预期结果，尚非宿主实际计算回执。

本例最需要分清两点：一是制作“可并行”只允许并行，不允许只有一个席位的核验并行；二是T1的乙链安排与T2的乙链制作属于同一个委派任务，不是两份独立制作。把它们重复计入会制造不存在的工时或资源冲突。

## 一、主任务的7+1

|维度|提取结果|状态与说明|
|---|---|---|
|I 输入范围|甲、乙两链及其材料、核验记录。|resolved；E08—E11、E14。|
|O 交付|两链材料、核验记录及总结。|resolved；E14。|
|A 动作|DEV制作两链；OPS逐链核验；两链核验后QA复核；PM汇总交付。|resolved；E08—E12。制作并行是许可。|
|P 责任主体与分工|DEV负责制作，OPS负责单席核验，QA负责复核，PM负责汇总交付。|resolved；E08—E12。角色责任明确，不要求额外给出自然人姓名。|
|R 资源|从t=0起50分钟；制作15、20分钟；核验每链10分钟；一个核验席；QA、PM各5分钟。|resolved；E07—E12。没有金额预算，金额约束为absent。|
|V 版本依据|本次各节点版本均为1；未改写的适用父边界继续适用。|resolved；输入版本元数据及E15。没有另外指定控制文件版本。|
|C 完成停止|在整体截止内完成上述流程并形成规定产出。|resolved；E07、E11—E14。对应制作结束是核验前置，不是整个任务的完成条件。|
|B 禁止边界|核验不得并行；不得早于对应制作完成；不得省略前置或超时。|resolved；E09、E10、E13。|

E05是本例比较方法说明，约束解释和授权推断，不增加生产流程动作；其中“引用附件明确未提供时”是一般条件，本文没有断言某项必需附件已经缺失。

## 二、各子任务的7+1

|维度|T1：DEV|T2：执行助手|T3：OPS|T4：QA及明确列出的PM工作|
|---|---|---|---|---|
|I|继承甲、乙两链。|缩小到乙链，继承对应材料对象。|继承甲、乙两链，接收对应材料。|继承两份核验记录及两链成果。|
|O|两链材料交OPS，具体化E14。|乙材料在t=20交OPS，落实T1委派。|分别输出核验记录，具体化E14。|两链成果纳入总结并交ADMIN，具体化E14。|
|A|新增精确安排：甲0—15、乙0—20；乙交执行助手。|新增精确安排：乙0—20，t=20交付。|新增精确安排：甲15—25、乙25—35。|新增精确安排：35—40复核；PM40—45汇总交付。|
|P|DEV维持制作链路责任，执行助手承担乙链具体制作。|明确承担乙链制作及向OPS交付。|OPS承担核验，独占同一席位。|QA承担复核；正文明确PM承担汇总，未改派给QA。|
|R|跨度15、20分钟；制作并行获父许可；继承整体截止。|跨度20分钟，与T1同一乙链任务，不重复相加。|每次10分钟；同一席位串行，总占用20分钟。|QA、PM各5分钟，计划t=45完成。|
|V|继承T0未改写边界；本节点版本1。|继承T1安排及T0约束；本节点版本1。|继承T0未改写边界；本节点版本1。|继承T0未改写边界；本节点版本1。|
|C|按安排完成制作并交OPS；不替代整体完成条件。|t=20交乙材料；不替代整体完成条件。|两次核验结束并分别形成记录。|复核两记录并汇总交付；继承t=50整体截止。|
|B|继承不得省略前置或超时；没有新增禁止项。|继承适用限制；没有另设核验或绕过前置。|保留单席、不并行及制作前置，具体安排均满足。|保留双核验完成前置及整体截止；没有取消PM责任。|

以上有表达的安排均为resolved；各节点未另行表达金额、额外设备或其他版本制度，这些新增约束为absent，不构成信息不足。

已知事实仅包括文本给出的父子关系及版本元数据；这些是来源结构，不是业务执行事件。明确否定的业务事实：无。真正明示未知：无。本文未把“没有执行回执”改写成显式未知，也未把计划当成已完成事实。

## 三、形式模型

采用分钟为统一单位，时间原点均为父文的t=0，作用域为本轮同一甲、乙双链任务。定义六个稳定动作：$M_A$为甲制作，$M_B$为乙制作，$V_A$为甲核验，$V_B$为乙核验，$Q$为两记录复核，$H$为PM汇总交付。T1与T2均指向同一个$M_B$；T4中$H$的主体仍是PM。

父要求为：$d(M_A)=15$，$d(M_B)=20$，$d(V_A)=d(V_B)=10$，$d(Q)=d(H)=5$，最终结束不晚于50。前置为$M_A≺V_A$、$M_B≺V_B$、$V_A≺Q$、$V_B≺Q$，并按正文流程顺序在复核后汇总。核验共同占用唯一席位，必须顺序执行。关系同时保存链别、动作、主体和同轮时间，不能只因都是“材料”就交换甲、乙身份。

实际计划赋值为：$M_A=[0,15)$、$M_B=[0,20)$、$V_A=[15,25)$、$V_B=[25,35)$、$Q=[35,40)$、$H=[40,45)$。半开区间表示资源占用；前一动作结束的同一时刻可以开始后一动作。原文没有要求额外交接等待。

本次没有配置L2/L3词典包，也没有词典查询回执。故不登记词典命中或未命中；链别、角色及交接含义直接取自正文，不把词典当成权限来源。

## 四、数学计算一

关键问题是制作并行与核验串行能否联合满足前置和单席限制。公式为：$s(V_A)≥e(M_A)$、$s(V_B)≥e(M_B)$；所选顺序甲先乙后还要求$s(V_B)≥e(V_A)$。

代入计划端点：$15≥15$、$25≥20$、$25≥25$。甲核验与甲制作在t=15衔接；乙材料t=20到位，等待到t=25核验。两次核验占用$[15,25)$与$[25,35)$，交集为空。同一席位在t=25交接，不构成并行。

K5、K6、K7分别提交上述三个时间比较；K3、K4另检查两次核验各自的10分钟跨度。这里比较的是已选计划参数，无需知道现实执行能否准时，也不依赖任何未明身份。T2的t=20交接还明确支持乙材料在核验前已按计划到位。

## 五、数学计算二

完整计划结束时间可按关键串行链计算：$T=15+10+10+5+5=45$。其中首项是t=0至甲制作完成的15分钟；乙制作与其并行，且$20≤25$，所以乙链不会在甲核验之后新增等待。不能把乙制作20分钟再次串行相加，也不能把T1与T2重复当作两次乙制作。

局部跨度为：$15-0=15$、$20-0=20$、$25-15=10$、$35-25=10$、$40-35=5$、$45-40=5$。对应K1—K4、K9、K11。QA开始满足$35≥max(25,35)$；PM开始满足$40≥40$，对应K8、K10。最终$45≤50$，余量为$50-45=5$，对应K12的组合区间查询。

交付方面，T1明确两链材料交OPS，T2落实乙材料交接，T3分别输出记录，T4复核两记录并将两链成果纳入总结、由PM交ADMIN。K13核对这些有具体对象和主体的拟议产出；K14另核对T2的交接对象、接收方与直接父任务一致。数值检查与具体产出检查共同支持各角色未越界，不以“继承父规则”代替实际方案比较。

## 六、关键区别与可满足性

规则保持：未改写的适用约束继续继承；明确计划又分别满足时长、席位、前置和产出要求。事实条件：本文没有报告业务事件，也没有提出某个当前批准证据是否足够的问题，因此不制造OCCURRED_ACTION或READINESS查询。

父规则存在可满足见证，就是上述完整排程：两个制作并行、核验甲先乙后串行、QA及PM顺序收尾，t=45完成。另一个符合父许可的选择是乙先核验：乙20—30、甲30—40、QA40—45、PM45—50，仍能在截止内完成；这说明父文没有强制规定核验先后链别。后一排程只是说明父边界可满足，不替换本次提交的甲先方案。

相反，若把乙核验改成20—30，它会与甲核验15—25在同一席位重叠5分钟；即使最终仍能在50分钟内完成，也违反E09。该反例说明整体及时完成不能豁免单席禁止边界。此反例不是原方案事实，不进入原方案操作数。

没有明示未知需要补全。角色名称未给自然人姓名，不妨碍确定本任务书中的角色责任；任务文本中的执行助手安排也不是新增业务批准。E05中的条件性附件说明不能推导出本例已经缺附件。

## 七、最终结果

T1任务书规则边界：未越界；两链制作安排符合15、20分钟及可并行要求，交付对象明确。

T2任务书规则边界：未越界；落实同一乙链任务，在0—20制作并于t=20交OPS，没有重复新增制作实例。

T3任务书规则边界：未越界；两次核验均10分钟，制作前置满足，同席串行且分别形成记录。

T4任务书规则边界：未越界；双核验完成后复核5分钟，PM随后汇总交付5分钟，职责未被改派。

文本已述事实／证据符合性：没有已报告业务事件或明示前置证据缺口需要另判；来源结构事实予以保留，不据此宣称已经执行或验收。

综合结论：未越界。完整计划于t=45结束，满足t=50截止，且规定产出、单席及前置边界均有具体方案支持。

来源措辞校正：无须校正。T4虽由PM向QA下发，正文仍明确由PM汇总；不能因节点岗位把汇总动作归为QA。本文不作业务批准、实际验收或正式准入。

---
### 计算器复算记录

范围：仅提交的数值、单位、公式、引用位置及结构关系。
LLM原判定：未越界
已计算 14 项；与预期一致 14 项；不同 0 项；无预期 0 项；输入无效 0 项。

| 计算项 | 程序返回 | LLM预期 | 比较 | 引用检查 |
|---|---|---|---|---|
| K1 | VERIFIED | VERIFIED | MATCH | VALID |
| K2 | VERIFIED | VERIFIED | MATCH | VALID |
| K3 | VERIFIED | VERIFIED | MATCH | VALID |
| K4 | VERIFIED | VERIFIED | MATCH | VALID |
| K5 | VERIFIED | VERIFIED | MATCH | VALID |
| K6 | VERIFIED | VERIFIED | MATCH | VALID |
| K7 | VERIFIED | VERIFIED | MATCH | VALID |
| K8 | VERIFIED | VERIFIED | MATCH | VALID |
| K9 | VERIFIED | VERIFIED | MATCH | VALID |
| K10 | VERIFIED | VERIFIED | MATCH | VALID |
| K11 | VERIFIED | VERIFIED | MATCH | VALID |
| K12 | VERIFIED | VERIFIED | MATCH | VALID |
| K13 | VERIFIED | VERIFIED | MATCH | VALID |
| K14 | VERIFIED | VERIFIED | MATCH | VALID |

整份原文语义覆盖审查：不执行。

#### K1
提交算式：`{"kind":"interval_subset","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true}},"child":{"lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K2
提交算式：`{"kind":"interval_subset","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"20","inclusive":true},"upper":{"value":"20","inclusive":true}},"child":{"lower":{"value":"20","inclusive":true},"upper":{"value":"20","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"20","inclusive":true},"upper":{"value":"20","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"20","inclusive":true},"upper":{"value":"20","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K3
提交算式：`{"kind":"interval_subset","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}},"child":{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K4
提交算式：`{"kind":"interval_subset","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}},"child":{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K5
提交算式：`{"kind":"interval_subset","dimension":"time","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"15","inclusive":true},"upper":null},"child":{"lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"15","inclusive":true},"upper":null,"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K6
提交算式：`{"kind":"interval_subset","dimension":"time","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"20","inclusive":true},"upper":null},"child":{"lower":{"value":"25","inclusive":true},"upper":{"value":"25","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"20","inclusive":true},"upper":null,"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"25","inclusive":true},"upper":{"value":"25","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K7
提交算式：`{"kind":"interval_subset","dimension":"time","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"25","inclusive":true},"upper":null},"child":{"lower":{"value":"25","inclusive":true},"upper":{"value":"25","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"25","inclusive":true},"upper":null,"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"25","inclusive":true},"upper":{"value":"25","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K8
提交算式：`{"kind":"interval_subset","dimension":"time","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"35","inclusive":true},"upper":null},"child":{"lower":{"value":"35","inclusive":true},"upper":{"value":"35","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"35","inclusive":true},"upper":null,"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"35","inclusive":true},"upper":{"value":"35","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K9
提交算式：`{"kind":"interval_subset","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}},"child":{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K10
提交算式：`{"kind":"interval_subset","dimension":"time","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"40","inclusive":true},"upper":null},"child":{"lower":{"value":"40","inclusive":true},"upper":{"value":"40","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"40","inclusive":true},"upper":null,"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"time","unit":"minute","domain":"real","lower":{"value":"40","inclusive":true},"upper":{"value":"40","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K11
提交算式：`{"kind":"interval_subset","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","parent":{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}},"child":{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACT_INTERVAL_ASSESSMENT","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true},"empty":false,"constraint_ids":["range"]}}`

#### K12
提交算式：`{"kind":"interval_composition","dimension":"duration","unit":"minute","assessment_mode":"FACT_ASSESSMENT","range_semantics":"POSSIBLE_VALUE","combination":"SERIAL","independent":true,"parent":{"lower":{"value":"0","inclusive":true},"upper":{"value":"50","inclusive":true}},"intervals":[{"lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true}},{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}},{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}},{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}},{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}}]}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"INTERVAL_COMPOSITION","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","parent":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"0","inclusive":true},"upper":{"value":"50","inclusive":true},"empty":false,"constraint_ids":["range"]},"child":{"scope_id":"submitted","subject":"same","dimension":"duration","unit":"minute","domain":"real","lower":{"value":"45","inclusive":true},"upper":{"value":"45","inclusive":true},"empty":false,"constraint_ids":["range"]},"combination":"SERIAL","unit":"minute","composed":{"lower":{"value":"45","inclusive":true},"upper":{"value":"45","inclusive":true}},"component_intervals":[{"lower":{"value":"15","inclusive":true},"upper":{"value":"15","inclusive":true}},{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}},{"lower":{"value":"10","inclusive":true},"upper":{"value":"10","inclusive":true}},{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}},{"lower":{"value":"5","inclusive":true},"upper":{"value":"5","inclusive":true}}],"independent":true}`

#### K13
提交算式：`{"kind":"boolean_implication","assessment_mode":"FACT_ASSESSMENT","variables":["ma","mb","ra","rb","q","h"],"parent":{"all":[{"var":"ma"},{"var":"mb"},{"var":"ra"},{"var":"rb"},{"var":"q"},{"var":"h"}]},"child":{"all":[{"var":"ma"},{"var":"mb"},{"var":"ra"},{"var":"rb"},{"var":"q"},{"var":"h"}]}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACTS_SATISFY_BOUNDARY","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","passing_completions":1,"failing_completions":0,"possible_counterexamples":[],"variables":["h","ma","mb","q","ra","rb"]}`

#### K14
提交算式：`{"kind":"equal","parent":"HANDOFF_B_TO_OPS","child":"HANDOFF_B_TO_OPS"}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"EXACT_MAPPED_VALUE_EQUALITY","parent":"HANDOFF_B_TO_OPS","child":"HANDOFF_B_TO_OPS"}`