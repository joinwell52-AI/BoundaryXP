# ADMIN 三层结果页：从原文到计算结论

> 历史／非规范研究或产品规划（legacy / non-normative）。本文中的旧接口、原始结果和未来能力不代表当前产品合同或本轮验证；当前入口以根 README 和产品手册为准。No BXP extraction certification or execution authority is implied.

本文说明结果展示、限定句式的条件冲突与工作包文件差集。它是技术说明，不代表全部自然语言均受支持；当前版本与验证见 [验证说明](VALIDATION.md)。

## 如何使用

按 [Python 安装说明](ADMIN-PYTHON-011.md) 准备本机依赖，在界痕目录运行 `npm run ui`。选择“给 ADMIN 的任务建议”，粘贴任务，点击“本地检查，给 ADMIN 建议”。不用配置模型，也不用先测试 PM。

页面请求本机 Node 服务，由本机 Python 计算。ADMIN 路径不调用模型、不执行任务里的退款、入库等业务操作。右上角选择中文或 English；原文证据保留输入语言。

结果统一为三层，内容来自实际输出：

1. **原文证据**：保留提交的任务文字。
2. **七要素 + B**：显示已识别的具体值；有 WP 时逐包列出。动作和禁止项保留适用条件。未识别的字段显示“未识别”，不擅自填造。
3. **计算结果与建议**：指出具体冲突情形或缺少来源的文件，解释需要明确什么。冲突用红色，待明确项用黄色，同时有文字说明。

原句切片、分类记录、公式、布尔表和完整 JSON 收进“查看技术详情”。可复制的内容保留原任务，并附具体待确认建议；系统不替 ADMIN 选择新的预算、权限或例外。

## 例一：退款要求与财务授权条件冲突

**原文证据**

> 对商户批量执行退款操作 `batch_refund`。未经 Finance_Director 电子签名授权，严禁调用该退款接口；但若系统收到来自风控系统的高危欺诈拦截指令，必须立即执行 `batch_refund` 原路退回资金；调用耗时须在 60 秒内结束。

**七要素 + B 的实际提取**

| 字段 | 本例识别结果 |
|---|---|
| I 输入与范围 | 商户；没有自动推导具体账户或交易集合 |
| O 交付结果 | 原路退回资金；没有补造“退款成功记录”产物 |
| A 任务动作 | 收到所述风控指令时，要求调用 `batch_refund` |
| P 责任与授权主体 | 授权主体 `Finance_Director`；没有把它当成执行者 |
| R 资源约束 | 调用耗时 ≤ 60 秒 |
| V 版本与依据 | 未识别；风控事件没有被自动当成版本标准 |
| C 完成与停止 | 未识别完整完成断言 |
| B 已知禁止边界 | 未获 `Finance_Director` 授权时，禁止调用 `batch_refund` |

**实际计算**

设 `a` 表示财务已授权，`r` 表示原句中的风控事件成立，`x` 表示本次调用执行。原文映射成：

```text
规则 1：¬a ⇒ ¬x
规则 2： r ⇒  x
条件重叠：r ∧ ¬a
```

先用 Z3 查询两个条件能否同时成立，返回 **SAT**，得到 `r=True, a=False`。再将这组取值与两条完整蕴含规则一起送入求解器，返回 **UNSAT**，即该情形下两条要求无法同时满足。两次查询回答不同的问题，不能把 SAT 本身叫作“任务通过”。

| 财务已授权 a | 风控事件 r | 要求调用 | 禁止调用 |
|---|---|---|---|
| False | False | 否 | 是 |
| False | True | 是 | 是：冲突反例 |
| True | False | 否 | 否 |
| True | True | 是 | 否 |

这是对已映射约束的反例，不是当前财务授权状态，也不是证明业务已经死锁。计算以两条原句指向同一接口、执行者和对象范围为前提；详情保留这一假设。

**页面结论与建议**

> 当所述风控指令已到、财务尚未授权时，同一接口既被要求执行，又被禁止执行，两条要求不能同时满足。请明确该情形下应等待授权、停止并转交，还是适用另行明确授权的例外。

程序输出 `guard_modal_conflict`，包含实际 witness、完整蕴含式、两次求解状态及冲突核心。`unsat_core()` 返回的核心在输出前按标识排序，避免内部返回顺序影响结果比较；它不被宣称为基数最小的冲突集。

## 例二：WP2 输入文件缺少已声明来源

**原文证据**

> 【阶段一/WP1：数据清洗】由数据分析员处理历史订单日志，清理异常字符，耗时不得超过 30 分钟，执行完毕后在控制台打印日志并输出处理行数计数。
>
> 【阶段二/WP2：报表入库】读取清洗后的中间文件 `cleaned_orders.parquet` 并执行批量入库，操作限制在 15 分钟内完成，入库成功生成审计报告；全过程禁止直接写入主库生产表。

**逐包结果**

| 字段 | WP1 | WP2 |
|---|---|---|
| I | 历史订单日志 | 文件 `cleaned_orders.parquet` |
| O | 控制台日志、处理行数计数 | 审计报告 |
| A | 清理异常字符、打印、输出计数 | 批量入库、生成报告 |
| P | 数据分析员 | 未识别 |
| R | 耗时 ≤ 1800 秒 | 操作耗时 ≤ 900 秒 |
| V | 未识别 | 未识别 |
| C | 未识别完整完成断言 | 未识别完整完成断言 |
| B | 显示原文“全过程禁止直接写入主库生产表” | 同一全局禁止原句 |

不会把 O 的产物自动等同于 C 的全部完成条件。全文末尾的“全过程”禁令在各包中保持可见，但这项展示不代表已经完成全局模态求解。

**实际计算**

当前文件检查只比较显式命名文件。设 `F_in(WP2)` 为输入文件，`F_out` 为全文已识别的文件产出声明，`F_ext(WP2)` 为 WP2 有效范围中声明的外部文件：

```text
Δ = F_in(WP2) − (F_out ∪ F_ext(WP2))
  = {cleaned_orders.parquet} − ∅
  = {cleaned_orders.parquet}
```

控制台日志与行数计数不是这个 parquet 文件的产出声明。程序返回 `io_handover_deficit`，明确文件名与读取工作包 WP2。

**页面建议**

> WP2 需要 `cleaned_orders.parquet`，但任务中没有识别到该文件的产出或外部输入声明。请明确提供方；如由其他工作包生成，请补充该包的文件交付要求及依赖关系。

程序没有按 WP 编号添加顺序，也没有把提供方写死为 WP1，因此结果中 `from_stage=null`。补上“WP1 导出该文件”后，来源缺口消失，但仍提示尚未核验交付先后和版本；显式声明为外部输入也能补足来源。文件声明匹配不证明文件实际存在、可读或按时交付。

## 代码和计算边界

| 模块 | 本次职责 |
|---|---|
| [guard_patterns.json](../python/guard_patterns.json) | 版本化局部句式：接口声明、单一主体授权、事件条件、模态及指代 |
| [guard_constraints.py](../python/guard_constraints.py) | 核心动作与条件分离、唯一指代绑定、Z3 条件重叠、反例与相容性计算 |
| [task_projection.py](../python/task_projection.py) | 有来源的简明字段及命名文件输入/产出，不补造值 |
| [work_packages.py](../python/work_packages.py) | 显式分包、原始坐标映射、文件集合差、全局禁止原句可见性 |
| [source-render.mjs](../ui/source-render.mjs) | 三层结果、颜色提示、具体建议、折叠证据 |

这仍是**有限文法和词项支持**，不是任意自然语言的无损编译器。当前接口识别支持含下划线的显式标识、唯一前置接口指代、单一授权主体和限定的事件句式。并列主体、复杂附加条件、多个候选接口不强行合并。无法绑定时返回 `guard_binding_unresolved`。格式和计算框架可复用；解析覆盖仍需逐例验证。

数值使用 Decimal 与 portion，保留开闭关系、量纲和原文；Z3 使用有界本地查询；已有显式前置依赖检测继续使用 NetworkX。本次跨 WP 文件差集是 Python 集合计算，**不虚构 NetworkX 跨包依赖图**。无环不等于必定停机，未见文件来源不等于文件不存在。

## 本次真实验证

本轮在同一输入上保存修改前输出与修改后两次输出；没有按预期答案补写结果。

| 原用例 | 本轮实际变化 |
|---|---|
| 1 准入规则 | 数值保留；新增尚未绑定的执行条件提醒，不宣称全文通过 |
| 2 扣款上下限 | 仍未把两个指标合并，未得到期待的区间冲突；未解决 |
| 3 目标与禁止列表 | 该句式仍未得到期待的集合重叠；未解决 |
| 4 退款与审批 | 新增真实条件重叠 SAT、反例下相容性 UNSAT 和具体建议 |
| 5 WP 文件交接 | 新增两包划分、1800/900 秒与文件来源差集 |

- Python 34 个测试方法、UI/适配/服务 118 项、原有内核 21 项通过；两项 JS 语法检查通过。
- 五例修改后各运行两次，5/5 完整结果对相同（外围耗时不参与比较）；一轮输出递归检查 281 个证据出现位置，UTF-16 切片错误为 0。
- 实际 Node→Python 单次调用含启动约 468–505 毫秒；不是“全链路 5 毫秒”的性能证明。
- 中文退款、英文改名退款与 WP 页面经过实际浏览器核验；详情默认折叠、结果与建议可直接阅读。

这些是限定功能的回归证据，不是自然语言准确率、生产放行或所有用户用例均已支持的证明。

## English overview

The ADMIN result uses three layers: original evidence, concise seven-element-plus-B values, then computed results and specific advice. Guards remain attached to actions. Technical traces are collapsed; switching languages keeps source quotations unchanged.

The refund case has a satisfiable overlap (`event=true`, `approval=false`) and incompatible action requirements under that witness. The WP case calculates a missing declared file source, without assigning an unmentioned producer or inferring execution order. Both are local deterministic computations over supported source mappings, not live authorization decisions or general language guarantees. The UI still identifies incomplete coverage, and original cases 2 and 3 remain unsupported for their expected anomalies.
