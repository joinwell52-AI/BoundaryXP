# 统一 IR 内核：候选语义合同

版本：`candidate-ir/2.0`；实现 `kernel/1.0-candidate.1`。这是隔离程序候选，不改变生产 1.4 合同，不构成新模型生成验收或业务授权。

## 输入与层次

原始候选字节 → Schema → 类型／唯一引用／根任务／binder → Core → 查询能力检查 → 本地 Z3 → Core 见证复核。

Core 不包含 quote、label、note 或来源正文。来源映射与显示标签侧挂；更改这些显示文字不能改变算式。程序不读标准答案补充语义。

`root_task` 必须引用结构上唯一的 TASK。旧 1.4 的 ROOT 仅在唯一根存在时作为兼容哨兵下降。任务事件按 owner 祖先关系归属；总期限覆盖所属子任务中的事件。普通动作约束在动作发生时适用；TASK 级约束不会因随意赋“任务未发生”而被关闭。

## 类型与精确值

- 对象、事件、状态、布尔、整数、有理数、有限集合、数值区间是不同类型。
- 2.0 NUMBER 使用精确字符串，例如 `"30"`、`"0.1"`、`"1/3"`；单位按注册有理数比例转换到秒。时间严格小于不被改成小于等于，也不引入 epsilon。
- 1.4 数字只代表 JSON 解析后实际得到的数值。超过安全整数范围拒绝；不能恢复上游已经丢失的小数位。要保留原始十进制，迁移到 2.0 字符串。
- `TASK_FIXED` 一次绑定，`INSTANCE_LOCAL` 由当前词法 binder 赋值，`OBSERVATION` 可保持符号。布尔域、对象域和数值域都属于约束。
- 空有限集合合法；未知集合不等于空集合。`FORALL(∅,p)=true`，但一个空 GROUP 不代表所有人。
- 角色是多值关系。RECIPIENTS_OF 保留多个接收者；RECIPIENT_OF 只有唯一值时才能求值。

## 事件域与计数

`TASK_EVENTS(task)` 默认含后代任务；literal=false 仅本层。SELECT_EVENTS 使用同一个事件 binder 的有类型谓词。OPERATION_OF、ACTORS_OF、TARGETS_OF、RECIPIENTS_OF 提取结构字段，不猜 OTHER 的含义。

有限查询必须提供 `plan.completeness={kind:EXACT_SNAPSHOT,task_id,basis}`，明确声明这一规划快照中的事件列举完整。这是查询假设，不是程序证明现实世界没有其他事件。无完备依据的开放集合不能用于全域 SAT 认证。

`COUNT_STARTED(C)=Σ[发生(e)]`，按事件身份去重，失败事件照计。不同调用实例使用同一个文件仍是两次调用；两个变量指向同一文件，输入集合基数只计一次。禁止从“最多三次”把反例事件域截成三个。

查询可包含未出现在人员枚举中的新主体，白名单仍检查该主体。与已声明固定事件具有相同身份的记录，不得静默改写操作、owner 或固定角色；冲突明确报 QUERY 错误。

## 状态、时间和禁止

EVENT_OCCURRED、EVENT_COMPLETED、EVENT_SUCCEEDED 分开；固定公理为成功 ⇒ 完成 ⇒ 发生。

状态按 `(state_id, event_instance)` 绑定。与事件绑定的 SUCCESS／FAILURE／COMPLETION／CONTROL_EFFECT 为真时要求该事件发生；建立时点位于相应事件区间；COMPLETION 的建立时点等于结束点。同一事件的成功与失败不能同时为真。EXTERNAL 状态不自动变成业务动作。

TRUE_AT_START 检查状态为真且建立时点 ≤ 动作开始；事后通过不能追认先前动作。RECEIVED_COMPLETE ⇒ RECEIVED_ANY，反向不成立，交付启动也不蕴含完整收件。

ACTIVE_DURING(e,a,b) 检查事件发生且 `start(e)<b ∧ end(e)>a`；ACTIVE_SINCE(e,a) 没有恢复上界，检查发生且 `end(e)>a`。它们表示输入 IR 明确给出的活动区间／停止区间，不推断恢复，不把被中断义务当成完成。应急事件须由规则显式排除，不能按 REPORT 等名称豁免。

有条件禁止用同一 binder 表达 `match(e) ∧ ¬exception(e)`。PERMITTED 与 NOT_REQUIRED 保留在投影中，不强迫事件发生；禁止未命中不产生许可。

IMMEDIATE_AFTER 的定性优先语义仍被保留，但不属于本次数值求解 profile。求值为 UNKNOWN，求解给出 OPERATOR_QUERY_UNSUPPORTED，不能偷换成零秒。

## 有界序列与数据使用

sequence 明示模板、任务、0/1 起算和最大实例数；最大不等于实际发生数。原生记录通过 template_id/index 绑定实例。直接前次不循环到首次。TASK_FIXED 选择在不同实例间保持同一对象；未声明实例上界不从某个整数域猜测。

DATA_USE 的 COMPLETE_RESULT 在有明示 producer 时要求生产发生并完成且结束 ≤ 消费开始；其他方式使用按对象与生产实例绑定的 availability 时点。EVALUATE 无观测时保持未知；SAT 可使用符号时点求安排，有 producer 时须位于其发生区间。符号可用性不证明文件现实中已经存在。TOTAL_DURATION 将总耗时变量与根任务 end−start 及事件 horizon 联结。

## 查询及证明等级

EVALUATE 保留三值事实；SAT 使用符号变量求一个满足安排。精确整数、有理数时间、布尔、有限身份选择可联合求解。无限事件域、符号实例索引、部分旧式模式规范和定性立即关系不在此 profile 内；明确输出 UNSUPPORTED。资源不足是 RESOURCE_LIMIT／UNKNOWN，不是 UNSAT。

规划包含先解 P；P 无解单列 INFEASIBLE_PLAN。P 有解后检查 `P ∧ ¬A`：SAT 给越界反例，UNSAT 只表示声明域内包含。绝不计算恒假的 `A ∧ P ∧ ¬A`。

当前 TOTAL_DURATION 联合编译只支持无条件 REQUIRED，其他模态或条件形式报告不支持，不能静默忽略条件。含符号对象选择的集合去重有 512 项容量门，超限报告 RESOURCE_LIMIT。旧 TASK_SCOPE 隐式模式 binder、动态枚举域和符号序列索引仍需显式迁移；保留旧版兼容计算不等于这些表达已进入新 profile。

SAT 模型必须逐项回到 Core 检查；模型损坏或漏约束时不得返回已验证 SAT。UNSAT 保留 SMT-LIB、断言映射和冲突核，标 BACKEND_RESULT；没有一般独立证书检查器，不标 CERTIFICATE_CHECKED。

任何结果的 business_decision、execution_authorization 均为 null。Schema、模型自审、程序可满足与原文语义完整正确是四件不同的事。
