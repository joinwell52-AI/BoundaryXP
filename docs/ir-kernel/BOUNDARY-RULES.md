# 在线边界规则合同 r01

输出boundx-boundary-rules/1。交付是原文授权边界，不是执行计划、底层IR或求解报告。程序按固定规则展开到既有candidate-ir/2.0；模型不输出expressions、requirements、反向索引、计算见证或7+1全文。

sources登记精确引文及occurrence；tasks、objects、actions、states、rules使用唯一短ID及source_refs。ID不能含~（程序派生命名空间）。唯一parent=null任务为root；其他任务保留父级，动作与规则scope引用所属任务。对象保持实例身份，同名不同产物不能合并。

tasks/actions.roles直接表达原文明示的PERFORMER、ORGANIZER、REVIEWER、RECIPIENT、OBJECT、RESULT、DELIVERABLE、INPUT_OBJECT、BASIS、ENVIRONMENT等关系。依据不自动增加读取义务，交付不自动增加生成义务。动作声明本身不代表必须执行。

同一主体承接的“允许生成、无需交付”须在两个动作中分别保留主体，不能丢失无需条款的主体，也不能将其变成任何人。主体不明确时保留疑点；审阅须检查该绑定。程序不从中文补写主体。REVIEW的REVIEWER、ORGANIZE的ORGANIZER参与相应动作的主体匹配，不扩成其他操作的执行者。O只汇集明确生成或交付要求（保留必须/允许区别）；无需交付、复核和数据使用关系分别保留，不冒充正向交付。

## 固定规则

- INPUT_SCOPE.members是允许外部输入域，实际使用为其子集，不要求全部使用。
- ENVIRONMENT.environment限制scope及其后代全部实际操作。
- NORM：action的REQUIRED、PERMITTED、NOT_REQUIRED；when=null无条件，非空表示适用条件。重复模板上的NORM针对首次实例。
- FORBID：按match匹配scope及后代实际操作。各非空字段同时成立，字段列表内部任一；空列表表示该维度不限，operation=null表示不限操作。during_state非空仅限制控制状态实际有效期间。任何人禁止不能缩成已列人员。
- GATE：对全部匹配操作检查开始前提condition（state/all/any），必须在开始时已经成立，后来成立不能追认。独立义务另用NORM。
- CHOICE：id同时为对象选择变量，相关动作OBJECT及消费者INPUT_OBJECT/BASIS直接引用它。options减excluded为候选集合，恰选一个且locked=true任务内固定；action/actor限定同一业务，first_required表明首次必须发生。不替执行者选具体对象；其他选择形式保留gaps。
- RETRY：action为重复动作，match限定同一业务的实际操作。max_extra不含首次，在scope跨子任务累计；previous_failure_required=true时每次重试开始须直接前次已失败。重试不强制发生，首次义务另由CHOICE或NORM表达；不展开实例或索引。
- DATA_USE：同一object在consumer使用，producer保留明确生产者，origin为EXTERNAL时producer=null。AT_USE只要求使用点内容可用；COMPLETE_RESULT额外要求整个生产动作完成后消费，须有明确来源。“生成报告并提交”不自动加强成后一种。
- DURATION：scope总耗时的精确数字字符串lower/upper、unit及两个inclusive端点；不是每个子任务各获同一额度。
- COMPLETION：任务完成当且仅当condition。条件可用state、completed(action)、all、any、not。只有单向定义时保留方向缺口，不变为双向。
- RESPONSE：trigger状态触发必须完成action，immediate保留定性立即，不捏造0秒。
- CONTROL_EFFECT：仅在明示时表示action建立控制状态，建立点在动作期间；停止期间禁止另用FORBID.during_state。

states不填实际真假。SUCCESS/FAILURE.subject为动作；RECEIPT.subject为交付动作，arguments依次为接收者、产物；CONTROL_EFFECT和EXTERNAL保留明示状态。收到、完成、通过不同。未选择或未来未知不是文本歧义。

例如“某角色在许可文件中固定选一个、首次必须读取，额外最多n次且仅前次失败后可重试”，只需CHOICE和RETRY；程序生成集合差、变量、实例上限及前次失败门。允许生成附件而无需交付用两个NORM；禁止给指定接收者再用FORBID。不把无需变成许可。

不能表达的明示约束写gaps并引用原文，不藏进label、不删约束换速度。程序不扫描原文或说明文字补语义；未命中禁止不等于许可。技术接受、语义审阅、PM规划核验与业务授权分开。

## 独立审阅

仅接收完整原文、同一紧凑边界、本合同及技术预检摘要。输出boundx-boundary-rules-audit/1，原样回传candidate_sha256；examined_sources列实际核对来源；verdicts覆盖任务、对象、动作、状态和规则ID，短reason说明支持或具体问题，遗漏写omissions。不重写候选，不审程序派生表达式。未审不默认通过，模型一致不等于准确性证明。

本版不自动进入旧底层IR补丁流程；保留具体问题，不增加隐藏修订请求。原始响应、问题和版本分别保存。未知未来状态不影响边界提取，但明确规则缺失仍是缺口。
