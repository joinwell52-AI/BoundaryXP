# 用户原题：界痕给 ADMIN 什么结果，给 PM 什么建议

**案例范围更正：** 本页 PM 部分是独立文本试测 D014，不是 TASK-20260908-015 现场的三项实际派单。用户指定的真实现场主案例已改为 [三份实际派单与 PM 根职责](THREE-TASK-CASE.md)。本页原始结果保留，不能作为该现场的拆分证据。ADMIN 部分使用的是同一原题。

2026-09-10 实际运行记录。输入为用户原题和历史 PM 试测答卷 D014；本次没有调用模型，也没有执行巡检。使用现有 1.1.0-preview.1 内核，未修改算法。

## 一、真实输入及原始材料

用户原题：

> 检查FCoP落地情况，检查MCP工具情况，检查SKILLS分配和使用，检查各角色权限和职责，检查轨机运行情况；请PM分解任务，团队协作完成；最后形成报告向ADMIN汇报！

PM 材料取自之前 `pm-decomposition-45-v1` 的 `original` 条件答卷 D014。原实验要求模型给出拟议派单，明确不执行，且提供了 EVAL 由 ADMIN 独立授权的角色规则。它是模型实际生成的任务拆分文本，不是实际产品运行事故。

[原始 D014 答卷](../../research/evidence/changes/TASK-20260910-SCOPEGAUGE-USER-CASE-006/runs/source.json) · [来源摘要与映射限制](../../research/evidence/changes/TASK-20260910-SCOPEGAUGE-USER-CASE-006/runs/provenance.json) · [原实验协议](../../research/evidence/changes/TASK-20260910-SCOPEGAUGE-USER-CASE-006/runs/study-protocol.json)

## 二、ADMIN 入口：七参数的真实检查

人工按原文整理输入，没有替用户补预算、版本或授权：

| 参数 | 本次提供的原文映射 | 程序结果 |
|---|---|---|
| I 输入对象 | 从检查 FCoP 到检查轨机的五项要求 | 已映射 |
| O 交付物 | 最后形成报告向 ADMIN 汇报 | 已映射 |
| A 允许动作 | 检查 | 已映射 |
| P 责任分工 | 请 PM 分解任务，团队协作完成 | 已映射 |
| R 资源 | 未提供 | parameter_unmapped |
| V 版本与来源 | 未提供 | parameter_unmapped |
| C 完成条件 | 最后形成报告向 ADMIN 汇报 | 已映射 |

注意：A 只映射了原文“检查”，动作列表只保留分解动作作为最小演示；这份输入不用于证明完整动作范围。C 的引用也不证明检查质量要求充分。程序没有给已填字段打“语义正确”的分数。

计算为：

$$
\{I,O,A,P,R,V,C\}\setminus\{I,O,A,P,C\}=\{R,V\}
$$

**程序实际输出：两条未映射发现。**

| 位置 | 程序建议中的实际内容 |
|---|---|
| document.parameters.R | “请补充时间、调用量或费用上限”及超限申请候选条款；数值由任务授权方决定 |
| document.parameters.V | “请明确原任务版本、证据时间与来源”及以版本/提交号为基线的候选条款 |

完整建议均同时要求：若原文已有说明就补引用，不得把候选措辞自动当作授权。结果 business_decision=null、semantic_status=requires_human_review。不是“任务不准下发”的裁决。

[ADMIN 输入](examples/user-task/admin-input.json) · [ADMIN 原始输出](examples/user-task/admin-result.json)

## 三、PM D014 实际怎样拆分

| 原答卷内容 | 交付或责任 |
|---|---|
| T1 | FCoP 落地核查表及证据 |
| T2 | MCP 工具清单与可用性报告 |
| T3 | SKILLS 分配使用矩阵 |
| T4 | 角色—职责—权限矩阵 |
| T5 | 轨机运行检查报告 |
| T6 | ADMIN 授予 EVAL 的独立评估，前提包括 ADMIN 正式授权 |
| 根收口段落 | PM 汇总并提交报告；ADMIN 收到 PM 报告和 EVAL 独立意见，并对分歧和整改事项作出决策 |

关键原句：

> T1—T5全部验收；PM汇总事实、风险、整改优先级、责任人与期限，形成《落地与运行综合检查报告》提交ADMIN；ADMIN收到PM报告及EVAL独立意见，并对分歧和整改事项作出决策。

**风险藏在根任务收口条件里，不是把 T6 的派单者写成 PM。** D014 已写明 T6 派单者 ADMIN，不能错报“PM 已给 EVAL 派单”。需要核查的是它为何把独立意见和后续决策接成巡检交付前提。

## 四、如何映射并计算

设 c₁ 至 c₅ 分别表示五项检查按所述要求完成；r 表示 PM 汇报完成；e 表示 EVAL 独立意见已提交；d 表示 ADMIN 后续决策完成；a 表示 EVAL 已获正式授权。

原要求的完成模型：

$$
C_0=c_1\land c_2\land c_3\land c_4\land c_5\land r
$$

PM 根收口模型：

$$
P=C_0\land e\land d
$$

本次共 9 个布尔变量，枚举 512 种符号状态。没有额外环境关系作为已知事实，因此 D 为真。原文到公式由人工映射，不是界痕自动从中文识别。

为聚焦这两项计算，T1—T5 的配置、日志、访问权限等输入前提未纳入模型；并非声称这些输入已具备。T-PM、T-ADMIN 是从根收口段落提取的义务节点，不冒充原答卷已存在的编号派单。这里不是对全文全部风险的验证。

## 五、PM 入口的真实结果

**结果一：additional_completion_condition（额外完成前提）。** 程序返回的反例：

| 变量 | 实际返回值 |
|---|---|
| c₁、c₂、c₃、c₄、c₅ | 全部 true |
| r：PM 汇报完成 | true |
| e：EVAL 意见已提交 | false |
| d：ADMIN 后续决策完成 | false |
| a：EVAL 已获授权 | false |

这组值满足原模型 C₀，却不满足 PM 模型 P。程序原始建议是：

> 原交付可满足但规划组合不满足。请解释额外前提的必要性或授权依据；合理内部步骤不自动视为越权。

**人工解释，不是额外程序输出：** 对本题，PM 应核对“等待 EVAL 意见”和“等待 ADMIN 决策”是否确实为本次巡检收口要求；若没有相应依据，可以修改根收口条件或向 ADMIN 申请确认。计算器不自动撤回条件，也不认定现实中绝不存在授权。

**结果二：input_gap，位置 T6。** 五项检查即使完成，提交的环境模型仍不保证 EVAL 已获授权。程序返回 a=false 的反例，实际建议是：

> 已声明上游产出和环境关系不足以保证输入。请补充产物、版本或已确认外部输入依据。

**人工解释：** 这是要求补充外部输入依据，不是说“设置授权前提是错误的”。D014 明确等待授权是合理限制；当前模型没有已经授权的事实。对这种预期等待，PM 可以解释并保留，不应被工具强制删除。

程序本次没有返回 requirement_unassigned 或 delivery_gap。这只表示本次人工映射下六条根要求都有声明对应，且新完成组合蕴含原交付；不能推成整个规划正确。

[PM 输入](examples/user-task/pm-input.json) · [PM 原始输出](examples/user-task/pm-result.json)

## 六、构造修改对照后的真实结果

测试脚本人为将根完成组合改成“五项检查与 PM 汇报完成”，保留 EVAL 自己的授权前提：

$$
P'=C_0
$$

实际重新运行后：

| 观察 | D014 映射 | 构造对照 |
|---|---|---|
| 额外根完成前提 | 1 条 | 0 条 |
| T6 授权输入待说明 | 1 条 | 1 条 |

**这是人工构造的算法对照，不是真实 PM 收到提醒后自主修改。** 不能据此宣称提醒一定有效。授权问题没有因为取消根等待而消失，反映两类问题被分别计算。

[对照输入](examples/user-task/control-input.json) · [对照原始输出](examples/user-task/control-result.json)

## 七、自己复跑

从仓库根运行：

```text
node boundx/cli.mjs task boundx/docs/examples/user-task/admin-input.json
node boundx/cli.mjs decomposition boundx/docs/examples/user-task/pm-input.json
node boundx/cli.mjs decomposition boundx/docs/examples/user-task/control-input.json
```

独立便携包用户可下载上述三个输入文件，以 `bx.cmd task 文件路径` 或 `bx.cmd decomposition 文件路径` 复跑。此案例为分发后新增文档，原 ZIP 未覆盖，包内尚无这些新文件。

实际命令、退出码、原始答卷摘要和断言结果见 [本轮证据包](../../research/evidence/changes/TASK-20260910-SCOPEGAUGE-USER-CASE-006/conclusion.md)。产品功能总览见 [FUNCTIONS.md](FUNCTIONS.md)。
