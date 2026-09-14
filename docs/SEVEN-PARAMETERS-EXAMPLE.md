# 界痕：七参数与一个简单任务的计算结果

本页使用现有计算内核实际运行，未修改算法。样例演示不是新的模型实验；现有下载包未覆盖，本页及原始输出是后补的仓库文档。

## 1. ADMIN 写下任务

> 检查产品并提交报告。

输入文件是已有的 [examples/task.json](../examples/task.json)。人工提供的映射如下：

| 参数 | 含义 | 本例原文映射 | 本次能确认什么 |
|---|---|---|---|
| I | 输入、检查对象 | 产品 | 有对象引用，但具体哪个产品仍不明确 |
| O | 交付物与接收方 | 报告 | 有产出引用，但没有指定接收方 |
| A | 允许的动作 | 检查 | 有检查动作引用，不等于授权修复 |
| P | 责任分工 | 未提供 | 需要补充承担者或已有原文引用 |
| R | 时间、费用、调用量等资源 | 未提供 | 需要补充上限或明确待定事项 |
| V | 版本与证据来源 | 未提供 | 需要明确检查和证据基线 |
| C | 完成与停止条件 | 提交报告 | 有交付条件引用，报告质量要求仍可能不足 |

**当前程序只检查字段是否已映射、引用是否存在，不自动识别“产品太泛”“缺接收人”等语义不足。** 表格中的这些解释是人工阅读，不冒充程序输出。这也是为什么七参数填满不能算通过。

## 2. 实际执行与输出

源码目录中执行：

```text
node boundx/cli.mjs task boundx/examples/task.json
```

便携包目录中执行同一输入：

```text
bx.cmd task examples\task.json
```

程序实际返回 **3 条 parameter_unmapped**：

| 位置 | 建议内容摘要 |
|---|---|
| document.parameters.P | 明确负责人、执行角色；独立观察角色由其授权方安排 |
| document.parameters.R | 明确时间、调用量或费用上限，数值由任务授权方决定 |
| document.parameters.V | 明确原任务版本、证据时间与来源 |

完整原始输出见 [simple-task-result.json](examples/simple-task-result.json)。此外返回 business_decision=null、semantic_status=requires_human_review、response_required=false。这里是 ADMIN 原任务入口，不是要求 PM 回应的规划入口。

以已映射集合 K 表示输入提供了哪些参数：

$$
B=\{I,O,A,P,R,V,C\},\quad K=\{I,O,A,C\},\quad B\setminus K=\{P,R,V\}
$$

读作：七参数全集减去已有映射，得到 P、R、V 三个待映射字段。可以数出已映射 4 项、未映射 3 项，**不能据此说任务质量是 4/7 或 PM 理解得了 57 分**；内核没有输出这样的质量分数。

## 3. ADMIN 可以怎样完善

以下仅为候选范例，不是本轮实际授权：

> PM 负责检查产品 X 的版本 abc123；仅检查并提出建议，产品修改另行申请；在 30 分钟内向 ADMIN 提交带证据索引的报告。完成约定检查并提交报告即可交付，无法验证的项目说明原因。

产品名、版本和预算应由 ADMIN 根据实际情况确认。程序不能自动替换这些值；也不能为了填满七个框，把同一句泛泛表述复制七次就认定理解正确。

## 4. PM 又增加“修复通过”怎么办

为单独展示完成条件算法，取原集合 `[report]`，新集合 `[report, repair]`，实际调用 compareBoundaryConditions。变量含义在本例中明确为：r=报告完成，f=修复通过。

$$
C_0=r,\qquad C_1=r\land f
$$

| r | f | 原条件 C₀ | 新条件 C₁ |
|---|---|---|---|
| 假 | 假 | 假 | 假 |
| 假 | 真 | 假 | 假 |
| 真 | 假 | 真 | 假 |
| 真 | 真 | 真 | 真 |

内核实际返回新增条件 repair、无遗漏条件，以及赋值 report=true、repair=false；该赋值使 baseline_complete=true、proposed_complete=false。完整结果见 [simple-condition-result.json](examples/simple-condition-result.json)。

它证明在“变量含义一致、可独立取值、条件按逻辑与解释”的模型下，完成条件发生变化，不证明现实中已发生越权。若映射错了，符号反例也可能不适用。建议应交 PM 核查新增前提的依据，必要时向 ADMIN 申请。

## 5. 这和拆分计算有什么关系

七参数组织原任务边界；任务分解契约接口进一步比较子任务产出组合与根交付，检查上下游接口。两者是互补检查，不是填写七参数后就自动获得完整分解证明。详见 [数学原理与分解案例](DECOMPOSITION.md)。
