# 7+1边界视图

## I

- 本次核查与汇总任务：输入对象=app.yaml（ACCEPTED）
- 本次核查与汇总任务：输入对象=env.json（ACCEPTED）
- 必须：(本次核查与汇总任务实际使用的外部输入集合 ⊆ {app.yaml，env.json})（ACCEPTED）
- 必须：对所有成员(本次核查与汇总任务范围内的全部执行事件（含后续事件），(环境(本任务任一执行事件) = 测试环境))（ACCEPTED）
- 必须：检查app.yaml使用app.yaml；来源=外部输入；生产者=未指定；依赖=使用点所需数据可用（ACCEPTED）
- 必须：检查env.json使用env.json；来源=外部输入；生产者=未指定；依赖=使用点所需数据可用（ACCEPTED）
- 必须：提交dev.md给QA使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：提交ops.md给QA使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：QA复核两份报告使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：QA复核两份报告使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：依据两份报告生成summary.md使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：依据两份报告生成summary.md使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：交付summary.md给ADMIN使用summary.md；来源=内部产物；生产者=依据两份报告生成summary.md；依赖=使用点所需数据可用（ACCEPTED）

## O

- 生成dev.md：结果=dev.md；必须（ACCEPTED）
- 提交dev.md给QA：交付物=dev.md；必须（ACCEPTED）
- 生成ops.md：结果=ops.md；必须（ACCEPTED）
- 提交ops.md给QA：交付物=ops.md；必须（ACCEPTED）
- 依据两份报告生成summary.md：结果=summary.md；当状态成立(QA复核通过)时，必须；执行时必须满足：依据两份报告生成summary.md开始时，QA复核通过已成立（ACCEPTED）
- 交付summary.md给ADMIN：交付物=summary.md；当状态成立(QA复核通过)时，必须；执行时必须满足：交付summary.md给ADMIN开始时，QA复核通过已成立（ACCEPTED）
- 向ADMIN汇报高危问题：交付物=高危问题；当状态成立(发现高危问题)时，必须（ACCEPTED）
- 必须：事件发生(生成dev.md)（ACCEPTED）
- 必须：事件发生(提交dev.md给QA)（ACCEPTED）
- 必须：事件发生(生成ops.md)（ACCEPTED）
- 必须：事件发生(提交ops.md给QA)（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：事件发生(依据两份报告生成summary.md)（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：事件发生(交付summary.md给ADMIN)（ACCEPTED）
- 执行交付summary.md给ADMIN时，必须：交付summary.md给ADMIN开始时，QA复核通过已成立（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：事件发生(向ADMIN汇报高危问题)（ACCEPTED）
- 必须：提交dev.md给QA使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：提交ops.md给QA使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：依据两份报告生成summary.md使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：依据两份报告生成summary.md使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：交付summary.md给ADMIN使用summary.md；来源=内部产物；生产者=依据两份报告生成summary.md；依赖=使用点所需数据可用（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：向ADMIN汇报高危问题使用高危问题；来源=非输入通信内容；生产者=未指定；依赖=使用点所需数据可用（ACCEPTED）

## A

- 必须：组织本次核查；组织者=PM；对象=本次核查与汇总任务；依据=《配置核查规程》v1.2（ACCEPTED）
- 必须：检查app.yaml；执行者=DEV；对象=app.yaml（ACCEPTED）
- 必须：生成dev.md；执行者=DEV；结果=dev.md（ACCEPTED）
- 必须：提交dev.md给QA；执行者=DEV；对象=dev.md；交付物=dev.md；接收者=QA（ACCEPTED）
- 必须：检查env.json；执行者=OPS；对象=env.json（ACCEPTED）
- 必须：生成ops.md；执行者=OPS；结果=ops.md（ACCEPTED）
- 必须：提交ops.md给QA；执行者=OPS；对象=ops.md；交付物=ops.md；接收者=QA（ACCEPTED）
- 当(状态成立(dev.md已提交QA) ∧ 状态成立(ops.md已提交QA))时，必须：QA复核两份报告；复核者=QA；对象=两份报告；执行时必须满足：(QA复核两份报告开始时，dev.md已提交QA已成立 ∧ QA复核两份报告开始时，ops.md已提交QA已成立 ∧ (状态成立时点(dev.md已提交QA) 先于 开始时点(QA复核两份报告)) ∧ (状态成立时点(ops.md已提交QA) 先于 开始时点(QA复核两份报告)))（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：依据两份报告生成summary.md；执行者=PM；依据=两份报告；结果=summary.md；执行时必须满足：依据两份报告生成summary.md开始时，QA复核通过已成立（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：交付summary.md给ADMIN；执行者=PM；对象=summary.md；交付物=summary.md；接收者=ADMIN；执行时必须满足：交付summary.md给ADMIN开始时，QA复核通过已成立（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：停止本次核查与汇总；执行者=PM；对象=本次核查与汇总任务（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：向ADMIN汇报高危问题；执行者=PM；内容=高危问题；交付物=高危问题；接收者=ADMIN（ACCEPTED）
- 必须：事件发生(组织本次核查)（ACCEPTED）
- 必须：事件发生(检查app.yaml)（ACCEPTED）
- 必须：事件发生(生成dev.md)（ACCEPTED）
- 必须：事件发生(提交dev.md给QA)（ACCEPTED）
- 必须：事件发生(检查env.json)（ACCEPTED）
- 必须：事件发生(生成ops.md)（ACCEPTED）
- 必须：事件发生(提交ops.md给QA)（ACCEPTED）
- 当(状态成立(dev.md已提交QA) ∧ 状态成立(ops.md已提交QA))时，必须：事件发生(QA复核两份报告)（ACCEPTED）
- 执行QA复核两份报告时，必须：(QA复核两份报告开始时，dev.md已提交QA已成立 ∧ QA复核两份报告开始时，ops.md已提交QA已成立 ∧ (状态成立时点(dev.md已提交QA) 先于 开始时点(QA复核两份报告)) ∧ (状态成立时点(ops.md已提交QA) 先于 开始时点(QA复核两份报告)))（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：事件发生(依据两份报告生成summary.md)（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：事件发生(交付summary.md给ADMIN)（ACCEPTED）
- 执行依据两份报告生成summary.md时，必须：依据两份报告生成summary.md开始时，QA复核通过已成立（ACCEPTED）
- 执行交付summary.md给ADMIN时，必须：交付summary.md给ADMIN开始时，QA复核通过已成立（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：事件发生(停止本次核查与汇总) 且 发现高危问题触发后，停止本次核查与汇总立即优先响应（无数值延迟要求）（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：事件发生(向ADMIN汇报高危问题)（ACCEPTED）
- 必须：检查app.yaml使用app.yaml；来源=外部输入；生产者=未指定；依赖=使用点所需数据可用（ACCEPTED）
- 必须：检查env.json使用env.json；来源=外部输入；生产者=未指定；依赖=使用点所需数据可用（ACCEPTED）
- 必须：提交dev.md给QA使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：提交ops.md给QA使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：QA复核两份报告使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：QA复核两份报告使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：依据两份报告生成summary.md使用dev.md；来源=内部产物；生产者=生成dev.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：依据两份报告生成summary.md使用ops.md；来源=内部产物；生产者=生成ops.md；依赖=使用点所需数据可用（ACCEPTED）
- 必须：交付summary.md给ADMIN使用summary.md；来源=内部产物；生产者=依据两份报告生成summary.md；依赖=使用点所需数据可用（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：向ADMIN汇报高危问题使用高危问题；来源=非输入通信内容；生产者=未指定；依赖=使用点所需数据可用（ACCEPTED）

## P

- 本次核查与汇总任务：组织者=PM（ACCEPTED）
- 组织本次核查：组织者=PM（ACCEPTED）
- 检查app.yaml：执行者=DEV（ACCEPTED）
- 生成dev.md：执行者=DEV（ACCEPTED）
- 提交dev.md给QA：执行者=DEV（ACCEPTED）
- 提交dev.md给QA：接收者=QA（ACCEPTED）
- 检查env.json：执行者=OPS（ACCEPTED）
- 生成ops.md：执行者=OPS（ACCEPTED）
- 提交ops.md给QA：执行者=OPS（ACCEPTED）
- 提交ops.md给QA：接收者=QA（ACCEPTED）
- QA复核两份报告：复核者=QA（ACCEPTED）
- 依据两份报告生成summary.md：执行者=PM（ACCEPTED）
- 交付summary.md给ADMIN：执行者=PM（ACCEPTED）
- 交付summary.md给ADMIN：接收者=ADMIN（ACCEPTED）
- 停止本次核查与汇总：执行者=PM（ACCEPTED）
- 向ADMIN汇报高危问题：执行者=PM（ACCEPTED）
- 向ADMIN汇报高危问题：接收者=ADMIN（ACCEPTED）
- 必须：事件发生(组织本次核查)（ACCEPTED）
- 必须：事件发生(检查app.yaml)（ACCEPTED）
- 必须：事件发生(生成dev.md)（ACCEPTED）
- 必须：事件发生(提交dev.md给QA)（ACCEPTED）
- 必须：事件发生(检查env.json)（ACCEPTED）
- 必须：事件发生(生成ops.md)（ACCEPTED）
- 必须：事件发生(提交ops.md给QA)（ACCEPTED）
- 当(状态成立(dev.md已提交QA) ∧ 状态成立(ops.md已提交QA))时，必须：事件发生(QA复核两份报告)（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：事件发生(依据两份报告生成summary.md)（ACCEPTED）
- 当状态成立(QA复核通过)时，必须：事件发生(交付summary.md给ADMIN)（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：事件发生(停止本次核查与汇总) 且 发现高危问题触发后，停止本次核查与汇总立即优先响应（无数值延迟要求）（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：事件发生(向ADMIN汇报高危问题)（ACCEPTED）

## R

- 必须：((本任务总耗时 ≥ 0 分钟) ∧ (本任务总耗时 ≤ 30 分钟))（ACCEPTED）

## V

- 本次核查与汇总任务：依据=《配置核查规程》v1.2（ACCEPTED）
- 组织本次核查：依据=《配置核查规程》v1.2（ACCEPTED）
- 依据两份报告生成summary.md：依据=两份报告（ACCEPTED）
- 必须：事件发生(组织本次核查)（ACCEPTED）

## C

- 必须：(状态成立(任务完成) ⇔ ((状态成立(dev.md已提交QA) ∧ 状态成立(ops.md已提交QA)) ∧ 状态成立(QA复核通过) ∧ 状态成立(summary.md已交付ADMIN)))（ACCEPTED）
- 当状态成立(发现高危问题)时，必须：事件发生(停止本次核查与汇总) 且 发现高危问题触发后，停止本次核查与汇总立即优先响应（无数值延迟要求）（ACCEPTED）
- 当状态成立(本次核查与汇总处于停止期间)时，禁止：事件发生(继续本次核查与汇总)（ACCEPTED）

## B

- 当状态成立(发现高危问题)时，必须：事件发生(停止本次核查与汇总) 且 发现高危问题触发后，停止本次核查与汇总立即优先响应（无数值延迟要求）（ACCEPTED）
- 当状态成立(本次核查与汇总处于停止期间)时，禁止：事件发生(继续本次核查与汇总)（ACCEPTED）
- 禁止：事件发生(修改app.yaml)（ACCEPTED）
- 禁止：事件发生(修改env.json)（ACCEPTED）
- 禁止：事件发生(访问生产环境)（ACCEPTED）

技术接受不等于业务授权。

## 程序边界计算结果

计算状态：CALCULATED；联合求解：satisfiable。
外部输入文件集合：{app.yaml，env.json}；数量=2。
文件产物集合：{dev.md，ops.md，summary.md}；数量=3。
输入与文件产物交集：{}；并集：{app.yaml，env.json，dev.md，ops.md，summary.md}；并集数量=5。
完成公式 r_completion：满足赋值=16，违反赋值=16；接受状态=ACCEPTED。
完成前提：真=1，假=15。这些是独立公式赋值数，不是全模型解数量。
数值允许区间 duration：[0,30] 分钟；空集=false。
外部输入子集边界 r_inputs：实际使用={app，envfile} ⊆ 允许={app，envfile}；核验=SATISFIED。此处为构造见证，不是实际业务观测。

### 程序联合见证
这是一份构造数学赋值，不是业务执行记录。
构造整体耗时=30 分钟；逐时间点与核验见完整Trace。
见证逐约束核验=true。
全称约束覆盖本构造执行的全部实际事件；不证明任意未来执行自动合规。
优先响应 immediate_stop：触发后优先响应；没有追加数值延迟。

### 显式先后与必要条件
严格先后 dev_before_review：dev_submit_time → review_start。
严格先后 ops_before_review：ops_submit_time → review_start。
显式先后环数量=0；必要条件另列，不混为严格时间边。
开始时必要条件 dev_at_review：review发生 ⇒ dev_submitted在开始时已成立。
开始时必要条件 ops_at_review：review发生 ⇒ ops_submitted在开始时已成立。
开始时必要条件 passed_at_generation：make_summary发生 ⇒ review_passed在开始时已成立。
开始时必要条件 passed_at_delivery：deliver_summary发生 ⇒ review_passed在开始时已成立。
使用依赖 du_app：对象=app，消费者=check_app，生产者=未指定；AT_USE，可用点=available:du_app ≤ 使用点=use:du_app。
使用依赖 du_env：对象=envfile，消费者=check_env，生产者=未指定；AT_USE，可用点=available:du_env ≤ 使用点=use:du_env。
使用依赖 du_submit_dev：对象=devreport，消费者=submit_dev，生产者=make_dev；AT_USE，可用点=available:du_submit_dev ≤ 使用点=use:du_submit_dev。
使用依赖 du_submit_ops：对象=opsreport，消费者=submit_ops，生产者=make_ops；AT_USE，可用点=available:du_submit_ops ≤ 使用点=use:du_submit_ops。
使用依赖 du_review_dev：对象=devreport，消费者=review，生产者=make_dev；AT_USE，可用点=available:du_review_dev ≤ 使用点=use:du_review_dev。
使用依赖 du_review_ops：对象=opsreport，消费者=review，生产者=make_ops；AT_USE，可用点=available:du_review_ops ≤ 使用点=use:du_review_ops。
使用依赖 du_summary_dev：对象=devreport，消费者=make_summary，生产者=make_dev；AT_USE，可用点=available:du_summary_dev ≤ 使用点=use:du_summary_dev。
使用依赖 du_summary_ops：对象=opsreport，消费者=make_summary，生产者=make_ops；AT_USE，可用点=available:du_summary_ops ≤ 使用点=use:du_summary_ops。
使用依赖 du_deliver_summary：对象=summary，消费者=deliver_summary，生产者=make_summary；AT_USE，可用点=available:du_deliver_summary ≤ 使用点=use:du_deliver_summary。
使用依赖 du_report_risk：对象=risk，消费者=report_risk，生产者=未指定；AT_USE，可用点=available:du_report_risk ≤ 使用点=use:du_report_risk。
完成分支查询：假设task_completed=true，结果=satisfiable，见证核验=true。不是新增原文义务，也不是实际完成记录。
反例查询 absent-state:dev_at_review:review：unsatisfiable；BOOLEAN；冲突证书核验=true。
反例查询 late-state:dev_at_review:review：unsatisfiable；STRICT_ORDER_CYCLE；冲突证书核验=true。
反例查询 absent-state:ops_at_review:review：unsatisfiable；BOOLEAN；冲突证书核验=true。
反例查询 late-state:ops_at_review:review：unsatisfiable；STRICT_ORDER_CYCLE；冲突证书核验=true。
反例查询 absent-state:passed_at_generation:make_summary：unsatisfiable；BOOLEAN；冲突证书核验=true。
反例查询 late-state:passed_at_generation:make_summary：unsatisfiable；STRICT_ORDER_CYCLE；冲突证书核验=true。
反例查询 absent-state:passed_at_delivery:deliver_summary：unsatisfiable；BOOLEAN；冲突证书核验=true。
反例查询 late-state:passed_at_delivery:deliver_summary：unsatisfiable；STRICT_ORDER_CYCLE；冲突证书核验=true。
反例查询 reverse-order:dev_before_review:44136fa3：unsatisfiable；STRICT_ORDER_CYCLE；冲突证书核验=true。
反例查询 reverse-order:ops_before_review:44136fa3：unsatisfiable；STRICT_ORDER_CYCLE；冲突证书核验=true。

技术接受、抽象可满足、实际完成和业务授权分别判断。business_decision=null；execution_authorization=null。
