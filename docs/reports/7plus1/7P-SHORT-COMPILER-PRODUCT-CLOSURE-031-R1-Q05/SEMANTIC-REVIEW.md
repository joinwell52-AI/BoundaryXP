# 冻结候选的来源语义复核

程序运行8/8；当前Codex按原文逐事实复核6/8 PASS、2/8 REVIEW_REQUIRED。这不是ADMIN人工审定，也不是由模型自审SUPPORT或Schema接受计算出的成绩。7个不同原文，Q05独立重复一次。

|记录|来源复核|要点|
|---|---|---|
|Q05|REVIEW_REQUIRED|PM列出settings.json中的配置项；同一PM生成明确命名结果，未新增交付义务。 禁止谓词、CLASS和FORALL已进入B可计算结构，未新增I。 B域没有文件容器；与重复运行不一致。不能据技术接受确认唯一源语义。|
|U-CN|PASS|OPS核对inventory.csv内全部资产记录，I和A保留文件内类别域。 同一文件的任何资产记录进入FORALL(CATEGORY(CLASS,FILE))禁止删除域。 未新增交付、资源、版本或完成条件；文件外成员不自动纳入。|
|X-CN|PASS|DEV核对具体config.json，I为具体对象。 同文件内配置项为类别域；debug为明确有限例外。 B保留FORALL(EXCEPT(CATEGORY,ENUM))，没有新增修改许可或扩大例外。|
|E-CN|PASS|QA读取两个独立文件，身份在读取和禁止删除中一致。 禁止范围为两个明确文件的有限ENUM，没有发明所有文件类别或量词。 或出现在禁止列举中，两个明示文件都受禁止；没有产生执行许可。|
|U-EN|PASS|OPS inspect records.csv，具体文件输入与执行主体保持。 that file链接同一records.csv；禁令为该文件内record类别的FORALL。 没有把any当布尔OR/ALL，也没有把容器身份丢失。|
|I-EN|PASS|QA read plan.md与禁止modify plan.md保持同一具体文件身份。 两个范围均为ITEM，无CLASS或FORALL发明。 未新增交付、数量、依据或完成条件。|
|S00|PASS|PM读取routes.csv、生成report.md，QA复核该报告，PM向ADMIN提交同一报告；角色及身份无串绑。 本次生成结果向复核和提交提供两条ARTIFACT_USE/USED_PORTION依赖；没有机械增加全部生成完成时序。 复核通过的STATE包含本次QA、报告和复核事件；是提交许可的NECESSARY、AFTER条件，未宣称已经通过。 读取重试LTE 3次只绑定读取事件，首次执行不计重试；提交成功是ROOT完成的SUFFICIENT条件。 SPEC-42为明确依据；生成结果与允许交付分别进入O，不增加强制提交义务。 routes.csv的具体禁止范围保留；禁止执行者原文未明示，P的UNSPECIFIED记录保留，没有推定岗位权限。|
|Q05-R2|REVIEW_REQUIRED|同一原文、同一冻结资源的独立一次重复，未选最佳输出。 此次B域为settings.json内配置项，与首次无容器域不同。 FORALL结构完整，但源语义适用域稳定性不通过；审阅模型未报告争议。|

Q05两次都已经有可计算的FORALL。但首次CATEGORY(配置项)没有容器，重复为CATEGORY(配置项, settings.json)。不同成员域可改变真实禁止范围；这不属于ID或中文措辞差异。两次审阅模型均SUPPORT且无omission，技术检查只能证实表达式类型、引用、来源与绑定合法，不能证实某种自然语言域解释唯一。首次剩余分歧发生在LLM候选的适用域选择，审阅没有拦下这个不稳定性。

原Q05判定不倒改，不选择更好的一次；当前两条均待审。是否应承接前句文件域、还是完整配置项类别域，需ADMIN明确裁定；本报告未宣称原文真实歧义已被证明。

每条原文、Claim/Fact ID、精确码点span、范围树和模型审阅依据见SEMANTIC-REVIEW.json。最终JSON、中文和完整Trace位于runs/<id>/run/，首次请求/响应不覆盖。
