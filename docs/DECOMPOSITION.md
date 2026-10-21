# 界痕 · BoundaryXP：任务分解计算使用手册

> 历史／非规范研究或产品规划（legacy / non-normative）。本文中的旧接口、原始结果和未来能力不代表当前产品合同或本轮验证；当前入口以根 README 和产品手册为准。No BXP extraction certification or execution authority is implied.

本轮交付：`decomposition/v1` 独立计算接口。它检查 PM 的任务分解契约，供负责人核查，不创建任务、不修改规划、不裁决。函数、CLI 和通用 MCP 已接入；自动触发及专用工具适配由各宿主负责。

## 一、功能

| 检查 | 返回什么 | 不代表什么 |
|---|---|---|
| 原要求无承担关联 | `requirement_unassigned` | 不证明现实中无人承担 |
| 子任务产出组合可成立但原交付不成立 | `delivery_gap` 与赋值 | 不证明事故已经发生 |
| 原交付成立但规划组合不成立 | `additional_completion_condition` | 不自动判定合理内部步骤越权 |
| 上游承诺不足以保证下游输入 | `input_gap` 与赋值 | 不自动增加实施任务或批准实施 |
| 环境、根要求、规划或上游承诺矛盾 | 对应 `*_inconsistent` | 不把无反例当作通过 |
| 等待关系形成环 | `dependency_cycle` | 不证明真实运行已经死锁 |

未知 ID、重复 ID、伪造原文引用和超限表达式属于输入错误，函数抛错、CLI 非零退出、MCP 返回工具错误，不伪装成无异常结果。

## 二、数学模型和每个符号

设每个布尔变量描述一项事实或承诺，例如 r=报告已完成、h=已向 ADMIN 汇总交付、f=修复通过。状态 s 是这些变量的一组真假赋值；它是模型状态，不是系统日志。

| 符号 | 含义 | 输入字段 |
|---|---|---|
| D | 显式提供的环境关系 | `assumptions.expr` |
| Rᵢ | 第 i 条原要求 | `requirements[i].claim.expr` |
| C₀ | 所有原要求同时满足 | 所有 Rᵢ 的逻辑与 |
| Qⱼ | 子任务 j 承诺的产出条件 | `tasks[j].ensures.expr` |
| Preⱼ | 子任务 j 所需输入条件 | `tasks[j].requires.expr` |
| P | 将规划完成表达式中的任务 ID 替换成 Qⱼ 后的结果 | `completion.expr` |

### 1. 原要求追溯

$$
M_{ij}=\begin{cases}1,&\text{任务 j 声明覆盖要求 i}\\0,&\text{否则}\end{cases}
$$

$$
\mathrm{Missing}=\{i\mid\sum_j M_{ij}=0\}
$$

文字读法：找出没有任何子任务声明承担的原要求。这只是关联覆盖；即使每行都有承担者，产出依然可能不充分。

### 2. 局部完成，整体未完成

$$
C_0(s)=\bigwedge_i R_i(s),\qquad W_{gap}=\{s\mid D(s)\land P(s)\land\neg C_0(s)\}
$$

文字读法：在业务关系成立时，寻找“规划承诺都满足，但原任务还没完成”的状态。若集合非空，返回第一组反例及原文引用。

例：原要求 C₀=r∧h，PM 只安排报告编制 P=r。代入 r=真、h=假，则 P 为真、C₀ 为假。报告编制完成并不保证向 ADMIN 交付。完善交付义务后 P=r∧h，这个反例消失，不强制 PM 新建一张任务单。

### 3. 新增完成前提

$$
W_{extra}=\{s\mid D(s)\land C_0(s)\land\neg P(s)\}
$$

文字读法：原任务已可交付，新规划却不允许完成。例如 P=C₀∧f，令 C₀=真、f=假，即得到修复前提的反例。

两个方向应一起查看。两边都有反例表示两套条件互有增删，不能只说“更严格”。内部步骤和根交付必须有可比的映射；差异只是请 PM 解释的依据。

### 4. 上下游接口

$$
Up_j(s)=\bigwedge_{k\in\mathrm{deps}(j)}Q_k(s),\qquad W_{input,j}=\{s\mid D(s)\land Up_j(s)\land\neg Pre_j(s)\}
$$

文字读法：直接上游全部兑现承诺，下游所需输入仍可能缺失。外部已确认输入可写入 D；这里的 D 是模型事实或关系，不是授权认证机制。

没有上游时，空逻辑与为真，因此有实际前提但无来源的任务仍会提示输入缺口。当前只检查声明的直接上游保证，不根据实际执行自动传播所有中间状态。可选任务也会逐项检查接口，不能把其输入提醒解释为必然阻塞根任务。

### 5. 先排除空真

若 D、D∧C₀ 或 D∧P 无可行状态，返回矛盾诊断。否则，“因为任务永远无法完成，所以找不到完成后缺交付的反例”可能被误说成分解正确。

算法枚举最多 12 个变量的全部状态：

$$
|S|=2^n,\qquad n\leq12,\qquad |S|\leq4096
$$

每个状态代入表达式，不使用随机抽样、不调用模型。一般开销随 2ⁿ 和表达式总量增长，因此明确限制规模；超出边界拒绝输入，不悄悄抽样后声称没有反例。

返回 `evaluated` 只代表有限计算执行完毕。没有任何发现也仍是 `requires_human_review`。本文公式是标准逻辑与集合方法，参考 [Z3 官方逻辑说明](https://microsoft.github.io/z3guide/docs/logic/propositional-logic/)；本实现未引入 Z3。

## 三、真实研究案例 D044

之前 45 次 PM 拆分文本试测中的 D044：T2 交付《SKILLS一致性整改方案》及待办清单；T3 却要求“整改实施完成并提交变更证据”。方案完成与实施完成是不同产出。

本轮对其做**人工部分映射**，得到 `scheme=真、implemented=假` 的输入缺口反例。T2 可以兑现交方案的承诺，T3 却还不能据此启动。建议应是“说明实施产物的来源与授权，或修订接口”，不是工具替 PM 补派实施任务。

测试另构造“上游承诺方案和实施都完成”的对照，验证这项输入缺口消失。该对照仅检验算法，不代表真实 D044 获得修改或实施授权。

示例为聚焦接口而把五项检查折叠为报告变量，并把已有检查证据作为已具备输入；它不是完整任务语义证明，也不是自动文本提取。样本原文、SHA256 和映射限制保存在本轮证据包。此前六份研究投影并未全部移植；传递祖先基线比较、完整追溯必要性及状态投影仍待后续深化。

## 四、输入和使用

需要 Node.js 22.18+。本轮在现有 Node.js 24.16.0 环境验证，无 API key、无在线实例操作。

从产品根执行：

```text
node cli.mjs legacy decomposition examples/decomposition-d044.json
node mcp.mjs
```

MCP 工具名为 `bx_legacy_review_decomposition`，调用参数为 `{"input":完整输入对象}`。启动 MCP 后由支持标准输入输出 MCP 的宿主调用；不是在终端输入自然语言。该新接口解释建议目前为中文，不接受 locale；已有任务/规划接口的中英文行为保持不变。

函数调用：

```javascript
import { reviewDecomposition } from './src/legacy/index.ts';
const result = reviewDecomposition(input);
```

完整可运行 JSON 见 [D044 示例](../examples/decomposition-d044.json)。字段契约：

| 字段 | 格式与约束 |
|---|---|
| `baseline_text`、`plan_text` | 原任务和规划的完整引用来源，每个上限 100000 字符 |
| `variables` | 最多 12 个 `{id,quote}`，ID 唯一，引用必须在原文或规划中 |
| `assumptions` | `{expr,quote}`，引用必须来自基线 |
| `requirements` | 1 至 64 个 `{id,claim:{expr,quote}}`，引用来自基线 |
| `tasks` | 1 至 64 个 `{id,requires,ensures,covers,depends_on}`，两个 Claim 的引用来自规划 |
| `covers` | 原要求 ID 列表，代表声明的对应关系 |
| `depends_on` | 上游任务 ID 列表；A 列 B 表示 A 等待 B |
| `completion` | `{expr,quote}`，引用来自规划；表达式中使用任务 ID，不是变量 ID |

普通表达式使用变量 ID 字符串，或 `{"all":[...]}`、`{"any":[...]}`、`{"not":...}`。每个表达式最多 128 个节点、嵌套深度 12；空 all 为真，空 any 为假。是否全部子任务必需，由 completion 明确表达，工具不擅自假设。

精确引用只是必要校验，不证明符号含义准确。调用方需要确保同一变量含义一致；不能把报告“已生成”与“已发送”合并为同一变量来隐藏遗漏。

## 五、输出与回应

结果使用既有 `task-boundary-review/v1` 审阅信封，新增 `analysis_kind:decomposition/v1`。每条发现含稳定 ID、位置、引用、反例 witness 或 null、建议；源摘要绑定整个输入。

可将结果与回复传给既有 `boundaryResponseStatus(review,replies)` 或 MCP `bx_check_responses`。每条回复需 finding_id、disposition、reason、references。回应完整性与建议正确性分开；`business_decision` 永远为空。通用工具不存档、不催办，宿主负责保存和送达。

## 六、验证与限制

本轮测试覆盖反例、可选分支、环境关系、空真、未分配要求、输入错位、循环、非法输入和布尔真值表；另有 D044 人工投影与修正对照、CLI/MCP 进程调用及既有内核回归。

这些是计算与接口测试，不是新增 PM 模型实验，不证明提醒能改善真实 PM 表现。尚未计算资源调度、预算最优、完整动作权限、时序可达性、全部自然语言歧义或全部研究案例；既有动作检查应与本接口配合使用。
