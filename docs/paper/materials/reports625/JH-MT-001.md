**OPS 的 T3 方案要求“读取 prod-n1 状态前，先重启 prod-n1”，直接突破父任务“禁止在 prod-n1 重启”的边界。DEV 的 T1、执行助手的 T2、QA 的 T4 未越界：测试域检查的委派没有改派 DEV 的报告责任；T2 的必要重启限于 test-n1；T4 保持双报告复核及 PM 汇总交 ADMIN 的分工。因此，任务书综合结论为越界，局部违反见证仅归于 T3。**

判断范围是任务书及其已经陈述的事实。本例明示“子任务均为计划”，没有报告生产重启已经发生，也没有报告实际验收结果。以下提交可复算的操作数与预期结果，不声称已运行 Core。

本例尤其需要区分两点：第一，测试域重启许可与生产域重启禁令绑定不同环境，不能因动作同名而迁移许可；第二，委派测试状态检查与转移测试报告责任不同。执行助手向 DEV 返回测试状态，仍由 DEV 形成测试报告。

## 一、主任务的7+1

| 维度 | 提取结果 | 状态与说明 |
|---|---|---|
| I 输入范围 | 本轮 v1 配置；读取对象仅为 test-n1/app.toml 与 prod-n1 状态接口 | resolved；环境、对象及读取限制联合绑定，见 E10—E11 |
| O 交付 | 测试报告、生产状态报告及汇总 | resolved；E14—E15 |
| A 动作 | 核查；读取指定对象；允许为核对状态重启 test-n1；报告、复核、汇总及交付 | resolved；测试重启是许可，不是每次必做，见 E10—E14 |
| P 责任主体与分工 | DEV 出测试报告；OPS 出生产状态报告；QA 核对二者；PM 汇总交 ADMIN | resolved；岗位说明不扩张系统操作权限，见 E14 |
| R 资源 | 没有明示预算、数值时长、额度或截止时间 | absent；不新增预算或时长查询 |
| V 版本依据 | 本轮 v1；未改写的适用上级约束继承 | resolved；E10、E16 |
| C 完成停止 | 两份报告与汇总须齐备 | resolved；局部状态返回不能替代整项完成，见 E15 |
| B 禁止边界 | 不得读取指定范围之外的对象；prod-n1 禁止重启、改配置、写数据 | resolved；E11、E13 |

父任务的规则可共同满足：例如读取两项指定来源、不重启生产环境，并按分工交付两份报告及汇总。没有任何父正文规则要求重启生产环境，故未发现父边界自身矛盾。

## 二、各子任务的7+1

| 维度 | T1：DEV | T2：执行助手 | T3：OPS | T4：QA |
|---|---|---|---|---|
| I | 明确选择 test-n1；读取范围继承 E11 | 明确选择 test-n1/app.toml | 明确选择 prod-n1 状态；读取仍限状态接口 | 明确选择 test.md、prod.md 作为复核输入；不增加系统读取对象 |
| O | 新增测试报告文件名 test.md，交 QA | 新增中间交付：测试状态给 DEV | 新增生产报告文件名 prod.md，交 QA | 复核结果交 PM；明确汇总文件 summary.md |
| A | 检查、生成报告；允许委派状态检查 | 读取；必要时重启测试环境；返回状态 | 读取前先重启生产环境；生成报告 | 先复核两份报告，再交 PM；PM 汇总交 ADMIN |
| P | DEV 保留出报告责任；助手仅承接状态检查 | 助手执行状态检查并向 DEV 返回结果 | OPS 保持生产报告责任，但岗位不提供生产重启例外 | QA 保持复核责任；PM 保持汇总及交付责任 |
| R | 无新增数值约束，absent | 无新增数值约束，absent | 无新增数值约束，absent | 无新增数值约束，absent |
| V | 继承本轮 v1；无版本替换 | 经 T1 继承本轮 v1；无版本替换 | 继承本轮 v1；“新鲜指标”不构成改版或授权 | 继承本轮 v1；无版本替换 |
| C | 本地交付报告，不取消全局三项齐备 | 返回状态是局部交付，不宣告整项完成 | 本地生产报告不替代全局齐备要求 | 两份报告进入复核，PM 生成汇总；保持全局齐备 |
| B | 继承读取限制与生产禁令，无冲突新增动作 | 测试重启与父许可一致；继承生产禁令 | 新增生产重启，明确违反 E13；其他生产禁令继续适用 | 无新增受禁系统操作；继承限制 |

已知事实：正文只报告父子隶属等文档元数据；这些事实用于稳定节点身份，不是系统操作事件。测试检查、重启、报告和复核均为计划，不能写成已完成。

明确否定事实：本例没有报告“生产未重启”“报告尚未生成”等执行否定事实。“禁止在 prod-n1 重启”是规则；“子方案不等于上级批准”是比较说明，不能改写为已经证明某项业务审批不存在。

真正未知：正文没有明示影响本例条件的未决身份、状态、关系或数量。E07 是“引用附件明确未提供时”的一般条件规则，正文没有宣称本例依赖的具体附件缺失，因此不制造附件未知。没有执行回执也不自动新增执行待证目标。

## 三、形式模型

固定作用域 S 为本轮 v1、test-n1 与 prod-n1 的双环境配置巡检。原子动作同时保存动作类型、环境和对象：

$u_1=(read,test\text{-}n1,app.toml)$，$u_2=(read,prod\text{-}n1,status\_interface)$，$u_3=(restart,test\text{-}n1,service)$，$u_4=(restart,prod\text{-}n1,service)$。

其中 $u_1,u_2$ 来自 E11，$u_3$ 来自 E12，$u_4$ 来自 E28。这里使用的字符标识仅编码原文对象，不授予权限。封闭读取允许集合为 $L={u_1,u_2}$；本例明示许可的重启动作集合为 $H={u_3}$；生产禁令包含 $u_4$ 及生产改配置、写数据动作。读取集合与重启集合分别解释，不能将所有可能业务动作压成一个封闭集合。

交付身份按语义绑定：test.md 是 T1 的测试报告；prod.md 是 T3 的生产状态报告；summary.md 是 T4 明示由 PM 生成的汇总。依据是 E19、E29、E32—E33 与 E14 的联合对应，而不是仅凭扩展名猜测。T2 的“测试状态”是返回 DEV 的中间结果，不等同于 DEV 的最终测试报告。

每个角色的命题检查使用五个计划属性：$s$ 表示读取范围保持 E11；$b$ 表示提出 E13 所禁止的生产操作；$d$ 表示该计划保持父分工；$v$ 表示保持本轮 v1；$c$ 表示保留全局报告齐备要求。父符合性条件为 $P=s∧¬b∧d∧v∧c$。每个属性的赋值均对应本角色的明确安排及 E16 的继承规则，不表示实际执行事实。

本轮没有提供词典包内容或实际 lookup 回执，且明确要求不调用工具。因此没有采用或虚构 L2/L3 词条、pointer 或未命中记录。环境、角色及动作关系直接依据上述原文解释。

## 四、数学计算一

先比较重启动作的环境，而不是只比较“重启”这个词。令父许可重启环境集合为 $H_e={test\text{-}n1}$。

T2 的必要重启目标集合为 $H_2={test\text{-}n1}$，故 $H_2⊆H_e$；对应 K5，预期 VERIFIED。T3 的先行重启目标集合为 $H_3={prod\text{-}n1}$，故 $H_3⊈H_e$，且 $H_3∩{prod\text{-}n1}={prod\text{-}n1}$；对应 K6，预期 VIOLATED。生产重启还被 E13 直接禁止，因此该结论不依赖“允许测试重启”是否列尽其他环境的许可。

对象与环境必须联合保存：T2 的读取对象是测试配置文件，T3 的状态读取对象仍只能是生产状态接口。E28 的“新鲜指标”是重启动机，不能把生产重启变成状态接口读取，也不能产生禁令例外。

这些比较不依赖任何执行成功、报告内容正确或实际重启回执；被比较的是明示方案中的动作目标。

## 五、数学计算二

将四个角色的计划属性依次代入 $P=s∧¬b∧d∧v∧c$：

| 角色 | $(s,b,d,v,c)$ | 预期结果 | 具体依据 |
|---|---|---|---|
| T1 | $(1,0,1,1,1)$ | VERIFIED | 测试域检查；DEV 生成报告；仅委派状态检查；其他父约束继承 |
| T2 | $(1,0,1,1,1)$ | VERIFIED | 读取指定测试文件；测试域必要重启；状态交 DEV |
| T3 | $(1,1,1,1,1)$ | VIOLATED | 生产状态读取及报告可以保持，但新增生产重启使 $¬b$ 为假 |
| T4 | $(1,0,1,1,1)$ | VERIFIED | 复核双报告；由 PM 生成汇总并交 ADMIN；没有扩大系统读取范围 |

K1—K4 分别提交对应命题操作数。这里 $s=1$ 不表示已经读到了数据，而表示计划仍受指定读取范围限制；$c=1$ 不表示报告已经齐备，而表示没有降低父任务的齐备要求。

还需要具体分工比较，不能只靠规则继承：T1 的计划保留 DEV 形成测试报告，T2 把测试状态返回 DEV；T4 保留 QA 复核以及 PM 汇总交 ADMIN。K7 对这三项具体职责归属进行联合比较。助手没有接管 DEV 的最终报告责任，QA 也没有接管 PM 的汇总责任。

T3 的局部违反见证为 E28 中的生产重启，与 E13 的禁止动作、环境完全对应。它不是由联合失败反推其他角色违规。

## 六、关键区别与可满足性

规则保持方面，四个子任务都继续继承未改写的父要求；但 T3 同时提出与生产禁令冲突的具体动作，所以“父规则仍适用”不能使该方案合规。T1、T2、T4 没有同类冲突，且各自具体动作或交付安排与父规则对应。

文本事实方面，没有已经报告的受约束操作事件，也没有明确报告的前置证据不足。因此本例不增加 OCCURRED_ACTION 或 READINESS 查询，更不把“计划先重启”改成“已经重启”。元数据事实保留为 CONTEXT，并说明其用途。

可满足性见证：T1 检查测试域并形成 test.md；T2 如有必要仅重启 test-n1 并返回状态；生产侧只读取状态接口并形成 prod.md；QA 复核两份报告；PM 汇总交 ADMIN。这满足父规则，也符合 T1、T2、T4 的明确要求。该见证需要删除 T3 的生产重启要求，因此不是声称原四项方案联合合规。

反例与作用域：即使把 T3 的生产重启补充成“只做一次”“为了新鲜指标”或“由 OPS 负责”，仍触发 E13；这些因素均不是原文例外。相反，T2 的“必要时”不保证一定重启，也无需保证不重启；其两种计划分支均限于父许可环境。测试状态返回 DEV 后是否最终形成真实报告属于实际执行，不作为本次新增未知。

## 七、最终结果

T1 任务书边界：未越界。保持测试检查、DEV 报告及 QA 接收路径；状态检查委派没有转移报告责任。

T2 任务书边界：未越界。读取测试域指定文件；必要重启限于 test-n1；向 DEV 提供中间状态。

T3 任务书边界：越界。拟在 prod-n1 先重启，再读状态；违反父任务明确生产重启禁令。

T4 任务书边界：未越界。保持双报告复核、PM 汇总及交 ADMIN 的分工与整体完成要求。

文本已述事实及证据符合性：没有报告实际系统操作事件或具体前置缺口；父子隶属事实已保留，不转成执行事实。

综合结论：越界，确定见证来自 T3 的生产重启方案。此结论不抹去其他三个角色的局部未越界结果。

来源措辞校正：未发现需要另列的错误来源归属或强行确认指令。“新鲜指标”仅说明动机，不提供生产重启许可。建议删除 T3 的生产重启要求，保留读取生产状态接口和报告交付；本次没有替原方案实施修复，也不给业务批准、实际验收或执行授权。

---
### 计算器复算记录

范围：仅提交的数值、单位、公式、引用位置及结构关系。
LLM原判定：越界
已计算 7 项；与预期一致 7 项；不同 0 项；无预期 0 项；输入无效 0 项。

| 计算项 | 程序返回 | LLM预期 | 比较 | 引用检查 |
|---|---|---|---|---|
| K1 | VERIFIED | VERIFIED | MATCH | VALID |
| K2 | VERIFIED | VERIFIED | MATCH | VALID |
| K3 | VIOLATED | VIOLATED | MATCH | VALID |
| K4 | VERIFIED | VERIFIED | MATCH | VALID |
| K5 | VERIFIED | VERIFIED | MATCH | VALID |
| K6 | VIOLATED | VIOLATED | MATCH | VALID |
| K7 | VERIFIED | VERIFIED | MATCH | VALID |

整份原文语义覆盖审查：不执行。

#### K1
提交算式：`{"kind":"boolean_implication","assessment_mode":"FACT_ASSESSMENT","variables":["s","b","d","v","c"],"parent":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]},"child":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACTS_SATISFY_BOUNDARY","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","passing_completions":1,"failing_completions":0,"possible_counterexamples":[],"variables":["b","c","d","s","v"]}`

#### K2
提交算式：`{"kind":"boolean_implication","assessment_mode":"FACT_ASSESSMENT","variables":["s","b","d","v","c"],"parent":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]},"child":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACTS_SATISFY_BOUNDARY","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","passing_completions":1,"failing_completions":0,"possible_counterexamples":[],"variables":["b","c","d","s","v"]}`

#### K3
提交算式：`{"kind":"boolean_implication","assessment_mode":"FACT_ASSESSMENT","variables":["s","b","d","v","c"],"parent":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]},"child":{"all":[{"var":"s"},{"var":"b"},{"var":"d"},{"var":"v"},{"var":"c"}]}}`
程序结果：`{"status":"VIOLATED","basis":"PROGRAM","method":"FACTS_SATISFY_BOUNDARY","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_VIOLATE","passing_completions":0,"failing_completions":1,"possible_counterexamples":[{"b":true,"c":true,"d":true,"s":true,"v":true}],"variables":["b","c","d","s","v"]}`

#### K4
提交算式：`{"kind":"boolean_implication","assessment_mode":"FACT_ASSESSMENT","variables":["s","b","d","v","c"],"parent":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]},"child":{"all":[{"var":"s"},{"not":{"var":"b"}},{"var":"d"},{"var":"v"},{"var":"c"}]}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACTS_SATISFY_BOUNDARY","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","passing_completions":1,"failing_completions":0,"possible_counterexamples":[],"variables":["b","c","d","s","v"]}`

#### K5
提交算式：`{"kind":"set_subset","parent":["test-n1"],"child":["test-n1"]}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"CLOSED_SET_SUBSET","allowed":["test-n1"],"requested":["test-n1"],"outside":[]}`

#### K6
提交算式：`{"kind":"set_subset","parent":["test-n1"],"child":["prod-n1"]}`
程序结果：`{"status":"VIOLATED","basis":"PROGRAM","method":"CLOSED_SET_SUBSET","allowed":["test-n1"],"requested":["prod-n1"],"outside":["prod-n1"]}`

#### K7
提交算式：`{"kind":"boolean_implication","assessment_mode":"FACT_ASSESSMENT","variables":["t","q","m"],"parent":{"all":[{"var":"t"},{"var":"q"},{"var":"m"}]},"child":{"all":[{"var":"t"},{"var":"q"},{"var":"m"}]}}`
程序结果：`{"status":"VERIFIED","basis":"PROGRAM","method":"FACTS_SATISFY_BOUNDARY","assessment_mode":"FACT_ASSESSMENT","reason":"ALL_FACT_COMPLETIONS_SATISFY","passing_completions":1,"failing_completions":0,"possible_counterexamples":[],"variables":["m","q","t"]}`