# ADMIN 原文计算：独立 B、七要素与五类实际结果

源码更新 016，2026-09-11。版本仍为 **1.2.1-preview.1**；没有生成新版下载包。按 [本地安装说明](ADMIN-PYTHON-011.md) 启动 `npm run ui`，选择 ADMIN，粘贴原文，点击“本地检查，给 ADMIN 建议”。修改过源码的已有页面需要刷新。此入口不需要模型配置，不执行输入里的短信、退款、锁车或断电操作。

这次修复的起因是三个真实漏检：明确禁令被误报为接口条件未绑定；同一扣款描述未合并求交；“目标节点集合”“禁止对象清单”的列表句式没有进入集合计算。用户随后加入了条件分支、紧急断电和另外五个任务。全部以原文作为输入，未把用户提供的预期 JSON 当成解析结果。

## 七个要素分别是什么，B 为什么独立

| 要素 | 本轮抽取内容 | 不能据此推断 |
|---|---|---|
| I 输入与范围 | 明确的处理对象、目标清单、文件输入、分支筛选清单 | 任意一个清单就是全部任务对象 |
| O 交付结果 | 原文要求的生成、打印、通知、返回结果 | 没写出的退款指令、成功凭证；读取描述中的“已生成文件”是本阶段产出承诺 |
| A 任务动作 | 原句中的操作及其适用条件 | 有动作描述就有执行权限；禁止的动作也被允许 |
| P 责任与授权主体 | 明写的执行者、协调者、授权主体 | 授权者就是执行者；自动执行就等于指派了某个团队 |
| R 资源与数值约束 | 原值、单位、严格/非严格算子及所属指标 | 不同费用、时间指标、阶段的数值都能求交 |
| V 版本与依据 | 原文引用的规程、工单、数据或协议 | 已核实文档存在、有效或版本正确 |
| C 完成与停止 | 原文的完成断言 | 有完成句就已证明任务必定终止 |

**B 是额外、独立的已知禁止边界。** 它先保留禁止事项及其原有限定，再决定能否和其他约束交叉计算。普通禁令不需要接口名称才能被识别。页面把 B 放在七字段表之外，单独列出。

例如：“不得扣减未授权押金”保留“未授权”，不改成禁止扣减一切押金。“未经 Risk_Manager 签字前，严禁解除锁定”同时保留签字前提；不会因为审批主体被识别，就视为已经批准。`不得超过 40 次` 是 R 的上限，不作为另一项禁止动作重复展示。

字段显示“未识别”表示解析器没有取得可靠值，不是证明原文缺失。没有用八个非空字段制造“100% 正确”或自动放行。

## 实例一：续约提醒与两条禁令

原文包含南京网点昨日到期的 20 辆 GL8、向承租人发送提醒、1800 秒、40 次、两种车辆处理状态，以及两条禁令。

| 字段 | 实际结果摘要 |
|---|---|
| I | 南京网点合同于昨日到期的 20 辆别克 GL8 |
| O / A | 发送续约提醒短信；A 另保留原文的状态标记 |
| P | 未识别，未补造“人工催收组” |
| R | 单批次处理耗时 ≤ 1800 秒；短信网关调用 ≤ 40 次 |
| V | 《长租车辆管理规定 v2.4》 |
| C | 20 辆车全部标记为已续费或转人工跟进 |
| 独立 B | 禁止远程切断油路动力；禁止扣减未授权押金 |

原来的 `guard_binding_unresolved` 误报消失。这里没有已声明的目标资产禁用名单，不能把车辆对象集合与禁止动作字符串求交后声称安全。页面也不把“未发现已计算约束冲突”写成整项任务可执行。

## 实例二：单笔扣除金额没有可满足值

> 单笔违章罚款扣除金额至少为 200 元，但根据承租协议，违章押金单笔扣除上限严格小于 150 元；处理耗时在 10 分钟以内；生成扣款结算流水即为完成。

I、O、A、V、C 保留原文已写出的对象、结算/生成动作、结算流水、两个依据和完成断言；没有额外生成退款指令。R 保留三条约束：

```text
单笔扣除金额 ≥ 200 CNY
单笔扣除金额 < 150 CNY
处理耗时 ≤ 10 × 60 = 600 seconds
```

两个金额描述使用相同动作“扣除”、相同粒度“单笔”和相邻主题“违章”。局部绑定保留两处完整证据以及绑定依据；它是**原文映射假设**，不是语义等价的数学证明。若实际针对不同费用，应分别命名。

在这个映射下，portion 实际计算：

$$[200,+\infty)\cap(-\infty,150)=\varnothing$$

页面直接显示：**“按两处描述指向同一笔金额计算，金额要求 ≥200 元且 <150 元，不存在同时满足的数值。”** 返回 `interval_empty`，附每个操作数、原值、单位、完整源句和交集。

改下限为 100 元后不再为空；把严格上限改为 200 元仍为空；改成不超过 200 元时边界值 200 可满足。不同费用主题、币种、粒度或另一个阶段不会仅因单位相同而合并。这些变化都通过了同一入口的反例测试。

## 实例三：目标节点和禁止对象重叠

> 目标节点集合包括 `app-node-01`、`app-node-02` 与 `db-primary`……禁止对象清单包括 `db-primary` 和 `auth-center`。

```text
T = {app-node-01, app-node-02, db-primary}
B_objects = {auth-center, db-primary}
T ∩ B_objects = {db-primary}
```

结果为 `target_forbidden_overlap`，红色卡片直接指出 **db-primary 同时位于两个名单**，并显示集合表达式。每个名称都保留自己的原文位置，不从文本中随意收集所有标识符作为资产。

40 分钟同时换算为 2400 秒。升级动作和安装成功返回要求进入 A/O/C；禁止句里的“重启”不会进入 A。工具不自动剔除节点，不产生豁免，也不把差集中剩余的两个节点当成已授权。

## 实例四：VIN 条件的另一分支未说明

> 若车辆属于高风险车架号清单 [VIN-001, VIN-002, VIN-003]，则调用网关下发电子锁车指令，并在工单系统生成红色警报……未经风控经理 Risk_Manager 签字前，严禁对任何车辆解除锁定。

I 保留条件清单，A/O 保留“在清单内”这一前提，P 保留签字主体，R 得到 300 秒，B 保留完整签字前禁令。

```text
vehicle ∈ L  → 锁车指令、红色警报
vehicle ∉ L  → 未识别到明确处理分支
已声明的布尔结果分支 = {True}
待说明分支 = {True, False} − {True} = {False}
```

返回 `dangling_conditional_branch`：**“未说明不在清单内时如何处理。”** 建议 ADMIN 明确记录后跳过、转人工、停止等处理方式。加入明确的否则分支后，这项提醒消失。

这里的两种结果是布尔分支，不是概率。缺少 Else 不能证明死锁，清单也不提供完整车辆全集；系统没有默认为正常车辆自动放行。

## 实例五：紧急切断与禁止切断的条件冲突

保留原句中的 `温度 >85°C`，以及“电流尚未平稳归零”这个事件条件。后者没有被改成 `Current >0`，也没有补造 120A。

在明确列出的有限动作术语表将两段描述映射为同一受控对象的假设下，令 `p` 表示原文尚未归零事件成立，`x` 表示切断：

```text
(temperature > 85) ⇒ x
p ⇒ ¬x
```

Z3 先求 `temperature >85 ∧ p`，得到 SAT；再带入该假设取值和两条蕴含式，得到 UNSAT。结果 `modal_logical_conflict` 在主界面明确说明“若两处指同一受控对象”的前提。`witness.hypothetical=true`。

这是条件规则反例，不是传感器实测、物理死锁证明或安全优先级决定。当前自然动作映射只覆盖声明的切断/接触器术语，附加对象名称不匹配时不会强行归组。不能据此宣称已具备任意设备规约的语义理解。

## 用户追加五例的逐例核对

| 原文 | 本轮实际结果 | 与参考答案的差别 |
|---|---|---|
| 续约催收 | 范围、通知/合同/明细、动作、1800 秒、40 次、规程、完成断言、两条 B 可见 | P 没有写明具体团队，保持未识别；不报 8/8 或放行 |
| 押金退还 | 金额交集为空，600 秒保留 | 不因未声明 B 就编造禁令 |
| 异地调拨 | 抽取原文前置边并计算；提示步骤名称对应待核对 | 不把“板车承运”“承运交付”“到达验收”“网点最终验收确认资产完好”自动合并后宣称依赖环 |
| CFO 退款守卫 | `guard_modal_conflict`，反例下 SAT/UNSAT 查询，60 秒、依据、完成句和两条 B | 警报是事件条件，不自动当成版本依据；不把 CFO 当执行者 |
| WP 违章账单 | `io_handover_deficit`，缺少 `violation_clean.json` 的文件来源声明 | 读取短语里“初筛生成的文件”不算本包承诺生成文件；不按 WP 编号发明依赖 |

有明确且相同的步骤名称时，NetworkX 可以计算实际依赖环；名称同义关系未确认时，结果必须保留这一缺口。原文的未知不能通过补造边来消除。

## 计算代码与证据

| 模块 | 计算职责 |
|---|---|
| [source_boundaries.py](../python/source_boundaries.py) | 独立 B、显式清单语法、成员条件与另一分支 |
| [metric_binding.py](../python/metric_binding.py) | 带证据的局部金额指标绑定，明确映射假设 |
| [structural_checks.py](../python/structural_checks.py) | portion 区间、同类资产集合交集、NetworkX 显式前置图 |
| [guard_constraints.py](../python/guard_constraints.py) | 接口指代、审批和事件守卫、Z3 反例 |
| [actuation_constraints.py](../python/actuation_constraints.py) | 限定自然动作的条件冲突，不加入物理因果假设 |
| [task_projection.py](../python/task_projection.py) | 七字段与独立 B 的证据投影，分离读取/产出与禁止/动作 |
| [test_boundaries_016.py](../python/test_boundaries_016.py) | 原文、各字段、求值及反例联动断言 |

词项和有限句式是版本化配置，不声称完全没有规则。没有把换成声明式模式包装为自然语言的形式化正确性保证。所有结果都来自实际入口；未直接把示例结论送进求解器。

验证：**44 个 Python 测试方法、121 项 UI/适配/服务测试、21 项原有内核测试通过**，两项 JS 语法检查通过。10 条用户原文各执行两次，10 对完整计算结果一致；一轮输出递归核对 726 个 UTF-16 证据出现位置，错误 0。重复一致性不是准确率，测试数量不是全语言覆盖率。

前序失败与修复、原始输入、Node→Python 完整输出、两轮对比及运行耗时见 [016 证据包](../../research/evidence/changes/TASK-20260911-SCOPEGAUGE-PROHIBITIONS-016/comparison.md)。中文禁止/金额及英文集合页面经实际浏览器检查；详情默认折叠。

## 用户参考脚本与库选型核对

两份脚本作为建议逐段阅读；后一份还在现有本地环境实际运行了原始测试和反例。它的 A/O 始终是 None、SMT 根据特定字符串插入固定退款要求、同币种不同费用被求交、严格大于被映射为包含等号的区间。这些问题不能通过更多测试标题或非空键计数解决，故没有直接纳入产品实现。原始运行及反例保存在证据包的 `runs/reference-*` 文件。

spaCy 可以提供规则匹配组件，但 `zh_core_web_sm` 及其依存分析是训练模型；官方明确区分统计组件与规则组件。离线运行不等于不使用模型，依存标签预测也不是百分之百语义保证。见 [spaCy 官方训练流水线说明](https://spacy.io/usage/spacy-101/) 与 [规则匹配说明](https://spacy.io/usage/rule-based-matching/)。本轮不增加 spaCy 模型依赖，继续使用已安装的本地确定性库；没有证据支持“Lark 固定比正则稳健十倍”或“全链路毫秒级”的泛化数字。

### 已接入的库，以及各自证明的范围

| 当前组件 | 本机版本 | 实际职责与证明范围 |
|---|---|---|
| Lark | 1.3.1 | 局部文法解析；语法匹配不证明原文语义无损，也不自动保证字段都被投影 |
| Python set | Python 3.10.11 | 对已明确命名、同类别的对象做交并差；不把禁止动作与车辆对象混为同一个集合 |
| portion | 2.6.2 | 对同指标、同作用域、同量纲的 Decimal 数值求区间交集；本机包依赖包含 sortedcontainers，不是零依赖 |
| Z3 | 5.1.0.0 | 求守卫共存状态，再检查该状态下 REQUIRE/FORBID 是否相容；证明限于给定符号约束 |
| NetworkX | 3.4.2 | 计算显式依赖图的环路、拓扑序；没有实现任意程序的停机判定 |

Z3 的 `unsat_core()` 给出导致不可满足的一组已跟踪约束，默认不保证是最小冲突集，也不是反例模型。这里先对守卫共存查询求 SAT 模型作为假设见证，再对带入该见证的动作要求查询求 UNSAT；两次查询的职责分开。超时或 `unknown` 也不能写成通过。参见 [Z3 官方冲突核心说明](https://microsoft.github.io/z3guide/docs/logic/propositional-logic/) 与 [core.minimize 默认参数](https://microsoft.github.io/z3guide/programming/Parameters/)。

依赖图无环只证明声明的前置关系不存在环，并不证明每个步骤会结束、外部系统一定响应、失败分支都能退出。关键路径也需要声明边含义、持续时间和并发假设；不能把 WP 编号直接连成串行图。参见 [NetworkX DAG 算法说明](https://networkx.org/documentation/stable/reference/algorithms/dag.html)。

SciPy/PuLP 的预算优化和 SymPy 的符号集合可以作为以后明确需求下的扩展，本轮没有增加这些依赖。数值优化器有容差、迭代限制和数值失败状态，不能把一个浮点 `success` 值等同于精确数学证明；若引入，应保存这些条件并对边界复核。参见 [SciPy linprog 的返回状态与容差说明](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html)。

用户随后提供的 CNL/Lark 示例也进行了原样运行：它返回 `Tree`，原示例的 `json.dumps(result)` 抛出 `TypeError: Object of type Tree is not JSON serializable`。进一步检查实际树，只有一个 WP1 节点，I/O/A/P/R/B 都是空数组，V/C 为 None，没有得到附件展示的两个完整 WP。详见证据包 `runs/reference-cnl-output.json` 和 `runs/reference-cnl-details.json`。受限文法方向有参考价值，但还要分别验证 AST 到七字段的映射、重复条款累积和未覆盖分句，而不是把“文法接受”当作 7+1 已完整抽取。

最新的双语脚本也保留了实跑审查：在项目 Python 3.10.11 上原脚本编译失败；独立执行原类定义后，5 个内置用例仍遇到 `pat_role` 属性或正则捕获组错误。`must not exceed 30 seconds` 还被归入 B，R 为空。中英文共用 IR 的方向可借鉴，币种却不能都变成 `curr`，不同指标也不能仅凭单位相同求交。完整记录见 [参考代码核对](../../research/evidence/changes/TASK-20260911-SCOPEGAUGE-PROHIBITIONS-016/reference-review.md)。

## English overview

B is an independent known-prohibition boundary, displayed outside the seven-element table. Ordinary prohibitions no longer require an interface identifier. Qualifiers and approval prerequisites are preserved; numeric upper limits remain R constraints.

The original tasks now produce an empty deduction interval, an explicit forbidden-target overlap, an unspecified false membership branch, a conditional actuation conflict and a missing WP file source. Every result keeps source slices, assumptions and specific advice. Unrecognized actors, absent step aliases and unverified file availability are not filled in. No permission, exemption, automatic task blocking or whole-task safety certificate is issued.

Validation used 44 Python methods, 121 UI/adapter/server tests, 21 core tests and two JS syntax checks. Ten original tasks were run twice with identical results and 726 checked evidence occurrences without an offset mismatch. This is bounded regression evidence, not proof of complete natural-language accuracy.
