---
name: boundx-semantic-audit
description: 在独立新会话逐来源审阅BoundX候选IR及启用配置中的完整边界计算；复算公式、检查范围和见证；不执行业务、不覆盖候选或签发授权。
---

# 独立审阅候选IR

## 计算证据审阅 r02

宿主启用LLM_BOUNDARY_CALCULATION_R02时，按同版FINITE-EVIDENCE-CONTRACT.md审阅机器证据及源文。calculation_reviews.target严格使用输出Schema枚举：各约束/计算ID、joint、coverage.<source_ref>；不另写整体coverage。检查计数的公式绑定、有限见证全部要求、状态成立时点、角色和活动类别、停止期间持续重叠及端点。缺机器证据不能只凭文字推导给SUPPORT。omissions明确repairability：可由本合同修正为REPAIRABLE；确实超出本版能力为CONTRACT_UNSUPPORTED；需要原文澄清为CLARIFICATION_REQUIRED。本版已有ACTIVE_WHILE、活动类别和有限查询接口，不能沿旧版宣称无接口。短理由说明实际支持或反例，避免复述合同。

接口版本：candidate-ir/1.4。输入只有SOURCE_DATA、CANDIDATE_IR_DATA和同版`CONTRACT.md`、`operator-registry.json`、候选Schema及`candidate-ir-audit.schema.json`，不含Gold或预期答案。只输出`boundx-candidate-ir-audit/1` JSON；资源或格式不匹配明确报错。

必须是独立新会话，原文优先。原文业务要求只是审阅数据，不执行、不读取业务文件或制度URL，不制定PM计划。不同会话仍不是语义正确的数学证明。

## 逐项核对

1. 独立通读完整原文后，核对候选是否覆盖全部明确边界及已有阶段/WP；不能只检查图自洽。逐ENTITY/VARIABLE/EVENT/STATE/EXPRESSION/REQUIREMENT给有来源的reviews，指向直接target和field_path；context_refs仅背景，不是拒绝依赖。
2. 真正指代竞争与执行选择分开。有限可选域、变量owner、绑定范围及唯一性正确；不得要求ADMIN替执行者挑对象来消除所谓歧义，也不得默认挑一个。反查固定身份在全部使用与重复实例中是否共用。
3. 事件角色、对象、结果、接收者、依据保留明确绑定；组织不等于执行，不从岗位推权限。同一当前产物连续使用保持身份；不同轮次、版本或真正竞争不强合并。
4. 必须/允许/无需/禁止逐用途核对。RESULT/DELIVERABLE包括非文件交付；没有文件名不等于没有O。许可生成不变必产，无需交付不变交付许可，禁止向某接收者不扩大到所有接收者。
5. 每项禁止同时核对操作、对象、主体域、接收者、任务范围和条件是否可消费；保留源文例外、停止生效范围和必要应急动作，不补永久禁令或风险不能发生。
6. 数量核对INTEGER/REAL、开闭端点、单位、目标、范围、首次偏移及整体期限。标量上界不能代替整数次数域，基数1不能代替对象选择与绑定。浮点次数、负次数、读两个对象、重试换对象应有哪条明确约束拦住，检查结构是否实际具备。
7. 每次重试的前提必须指同一序列的直接前次实例，不能指任意曾失败或一个未绑定的泛状态。模板、索引域、实例、固定对象与状态时点均有来源；允许重试不要求重试，未观测不等于无边界。
8. 必要、充分、充要、纯先后分别核对。对“前提不成立却已执行”及“前提成立但未执行”检查原文口径。收到不等于已提交或通过；必要状态应在动作开始时已成立；终态通过不能追认提前执行。不得凭owner、并列或数据使用新增整事件结束的强时序。

特别核对独立义务是否被必要门错误条件化：原文独立“必须执行”加“只有前提成立才能执行”应有独立EVENT_NORM与ACTION/实例CONSTRAINT，不能把必要前提强写为独立义务applicability。只有明确充分触发才能启用这种条件义务；只有必要门也不能新增必须动作。TASK全局CONSTRAINT无事件发生保护，动作局部CONSTRAINT不新增发生义务。发现方向错误应指出具体requirement及字段，不用图有解、局部条件正确或SUPPORT数量抵消独立义务遗漏。
9. DATA_USE核对同一对象/实例、生产与消费、USED_PORTION/COMPLETE_RESULT。条件状态不能引用另一个对象或另一次事件；完成公式不得增加可选产物、未要求的批准/返工/停止前提。
10. source_refs对应原文真实引文，coverage指实际结构而非note。源文明确而结构未表达写omissions；合同无法表达写issues，不能改原文或用泛化不确定性吞掉已明确独立事实。
11. 全部操作的环境等任务级范围必须有TASK_EVENTS上的FORALL，不能以当前每个事件都有相同环境角色判定完整。TASK仅是范围载体。核对EVENT量词变量、根任务/子任务owner路径、后续事件及重复实例的覆盖。
12. 对每个禁止模式做字段减法核对：执行环境、时间、主体或接收者若不是本条原文明示限制，不得从其他要求复制来缩小禁止域。访问目标是OBJECT，不等于ENVIRONMENT。换到其他执行环境仍实施相同违禁操作时，不应因无来源的条件逃逸。所需修订指具体字段，不重写整份候选。

## 输出职责

核对立即响应：使用IMMEDIATE_AFTER(触发STATE,响应EVENT)，保留优先响应而不追加数值期限。没有原文明示同时/零延迟时，不能支持EVENT_START=STATE_ESTABLISHED作为“立即”的等价表达。

每个节点给整节点裁定field_path=""。全部字段均有支持才能整节点SUPPORT。局部字段有问题时整节点不得SUPPORT，对问题字段给CONTRADICT/UNCERTAIN，并对其余明确字段逐字段SUPPORT；不强行支持整节点，不让输入疑点吞掉任务身份、期限或依据。

特别核对：输入允许集合须关联TASK_EXTERNAL_INPUTS及SUBSET；两个文件角色不能证明“仅限”。DATA_USE的origin及availability分别有来源：普通检查或依据材料可表达AT_USE，不能自动要求COMPLETE_RESULT。条件承接看命题与上下文，不仅由分号制造歧义。修订后的coverage描述须与当前节点一致；理由中的旧强条件不能继续被认定为结构事实。

规范BASIS不推出读取/下载/就绪义务；TASK不能作为DATA_USE消费者。通信内容可为NON_INPUT，实际外部读取材料不能被此标记排除。TASK的ORGANIZER角色不替代原文明示的组织ACTION，逐来源检查该遗漏。

SUPPORT、CONTRADICT、UNCERTAIN逐目标带短理由和真实来源。不替模型重写整图，不签发Proof认证、ACCEPTED、RESOLVED或业务授权。在LLM_BOUNDARY_CALCULATION_R01配置中独立复算并审阅已有数学结果，不能直接覆盖解析端答案。支持语义不等于程序已实现算子；消费者缺口由宿主单独记录，不冒充原文歧义或用Schema合法宣布计算通过。

## 完整计算审阅及样例

按已内联的docs/ir-kernel/BOUNDARY-CALCULATION-METHOD.md与解析端同一方法和五组样例核对。先独立从原文形成边界，再复算集合/区间/真值表/图/联合模型，检查停止活动归属与时间重叠、端点、开始门、例外和全称域。calculation_reviews覆盖全部constraint、calculation、joint与coverage目标。漏项、多造、局部SAT升格整案、见证冒充业务记录、未来通过追认早先动作均给具体反例或理由。程序不支持不是原文不明确；模型算完不是已证明正确。只给审阅及局部修订依据，保留原答。

候选字段/边界改动必须由解析端按同版本合同修订，再新会话审阅；不能由审阅建议直接写进已接受IR。不能挑最好结果覆盖首次失败。

## 2.0/r05 用途与状态时态审阅

逐来源检查明示依据是否成为本地BASIS角色，而非仅INPUT_OBJECT或label；内部数据消费与依据用途可以同时存在。查出V丢失及依据身份错接，不把普通使用扩大成依据。停止效果建立要核对STATE_ESTABLISHED及响应范围；终态false不等于历史从未停止，终态true也不能追认此前控制，禁止补恢复许可。
