# BoundX 边界计算方法与产品作用说明

文档状态：`DRAFT_FOR_REVIEW`  
日期：2026-09-16  
产品：**界痕 · BoundX**  
协议：**BXP — Boundary Xplain Protocol（边界分析协议）**

---

# 1. BoundX 为什么存在

BoundX 的目标不是限制 Agent 的智能，也不是把 Agent 重新做成固定流程、轨道机或状态机。

Agent 是智能体，应当保留理解、规划、拆分、选择工具和形成执行路径的能力。

BoundX 真正要解决的问题是：

> **主任务一旦被理解，就应当能够计算出一个确定、可引用、可冻结、可验证的任务边界；此后无论 Agent 或 PM 如何规划、拆分和分配任务，都不得跨越这个边界。**

因此，BoundX 服务的是：

```text
任务边界的确定
+
任务边界的计算
+
下游计划的边界符合性验证
```

它不负责替 Agent 决定怎么做，不替 PM 规划任务，也不允许轨道机、状态机或工作流引擎代替责任主体裁决语义与业务决定。

---

# 2. 核心原则

## 2.1 Agent 的能力不应被限制，边界必须被确定

> **Agent 的路径可以涌现，任务边界必须确定。**

BoundX 把任务边界表示为满足父任务全部约束的合法解空间：

```math
\Omega_B
=
\left\{
x \in X_{\Sigma}
\;\middle|\;
\chi_{\mathcal{M}}(x)=\mathrm{true}
\right\}
```

Agent 可以自由选择任意合法方案：

```math
x \in \Omega_B
```

但不能越出父任务边界：

```math
x \notin \Omega_B
```

BoundX 因此限制的是边界，而不是智能体的能力。

---

## 2.2 轨道机和状态机不能裁决

轨道机、状态机、工作流引擎可以记录事实、物化状态、推进生命周期、保存证据和触发检查。

但它们不能因为状态发生了变化，就自动推出任务正确、计划正确、业务决定成立或边界已经确定。

```math
\text{StateMachine}
\not\Rightarrow
\text{SemanticDecision}
```

```math
\text{WorkflowState}
\not\Rightarrow
\text{BoundaryValidity}
```

状态只能描述发生了什么，不能替代任务边界的计算。

---

# 3. BXP 的核心链路

```text
ADMIN 原始自然语言任务
        ↓
LLM / NLP 语义识别
        ↓
7+1 Semantic IR
        ↓
确定性解析与形式化
        ↓
Formal Boundary Model
        ↓
数学 Boundary Core
        ↓
Boundary Result
        ↓
主任务 Boundary 冻结
        ↓
PM / Agent 自由规划、拆分、分配
        ↓
Downstream Conformance
        ↓
检查是否越过父任务 Boundary
```

模型负责理解自然语言并生成 7+1；最终边界由确定性形式化与数学 Core 计算。

---

# 4. 7+1 是计算入口，不是最终边界

BXP 使用标准语义中间表示：

```math
IR_{7+1}
=
(I,O,A,P,R,V,C,B)
```

| 字段 | 含义 |
|---|---|
| `I` — Input | 输入、对象、作用范围 |
| `O` — Output | 交付物、结果 |
| `A` — Action | 动作 |
| `P` — Participants | 参与者、责任主体 |
| `R` — Resource | 时间、数量、容量、金额等资源约束 |
| `V` — Version / Provenance | 版本、来源、依据 |
| `C` — Completion | 完成与停止条件 |
| `B` — Boundary | 明确禁止边界 |

7+1 的作用，是把自然语言任务转换为可以继续形式化和计算的标准语义结构。

---

# 5. Formal Boundary Model

标准 7+1 进入形式化后形成：

```math
\mathcal{M}(IR)
=
(E,\Sigma,Q,F,K,R_{cal},D,\Phi)
```

| 符号 | 含义 |
|---|---|
| `E` | 实体与制品 |
| `Σ` | 作用域与状态空间 |
| `Q` | 必须完成的结果与义务 |
| `F` | 禁止动作、效果与状态 |
| `K` | 完成与停止条件 |
| `Rcal` | 身份、角色、责任与关系约束 |
| `D` | 依赖、来源、交接与版本 |
| `Φ` | 数值、集合、逻辑、时序、排序、基数等形式约束 |

---

# 6. 主任务 Boundary 的计算

设主任务形式模型为：

```math
\mathcal{M}
=
(\Sigma,Q,F,K,R,D,\Phi)
```

则主任务的合法解空间定义为：

```math
\Omega_B
=
\left\{
x \in X_{\Sigma}
\;\middle|\;
Q(x)
\land
\neg F(x)
\land
K(x)
\land
R(x)
\land
D(x)
\land
\Phi(x)
\right\}
```

因此，Boundary 不是一条写死的执行流程，而是满足父任务全部约束的合法解空间。

---

# 7. PM / Agent 计划的计算验证

当 PM 将主任务拆分为：

```math
P
=
\{T_1,T_2,\ldots,T_n\}
```

BoundX 不判断 PM 是否采用了“最佳方案”，也不规定 PM 必须如何拆分。

BoundX 只计算这些计划和子任务是否仍然符合父任务 Boundary。

---

# 8. 子任务不越界

对子任务 `T_i`，其符合性至少由以下条件共同决定：

```math
\operatorname{Conform}(T_i,B_p)
=
\operatorname{ScopeOK}
\land
\operatorname{ForbiddenOK}
\land
\operatorname{ConstraintOK}
\land
\operatorname{RelationOK}
\land
\operatorname{DependencyOK}
```

## 8.1 Scope 不得扩大

```math
\operatorname{Scope}(T_i)
\subseteq
\operatorname{Scope}(B_p)
```

若不成立：

```text
SCOPE_EXPANSION
```

## 8.2 不得触碰禁止边界

```math
\operatorname{Effects}(T_i)
\cap
\operatorname{Forbidden}(B_p)
=
\varnothing
```

若不成立：

```text
FORBIDDEN_BOUNDARY_VIOLATION
```

## 8.3 必须满足父任务形式约束

```math
T_i
\models
\Phi_{B_p}
```

若不成立：

```text
CONSTRAINT_VIOLATION
```

## 8.4 责任与关系约束必须成立

例如独立验证要求：

```math
\operatorname{Executor}
\neq
\operatorname{IndependentVerifier}
```

或者某项动作要求明确 authority：

```math
\operatorname{Authority}(e,a,s,t)
=
\mathrm{true}
```

若不满足：

```text
RELATION_VIOLATION
```

---

# 9. 计划不仅不能越界，还必须完整覆盖主任务

一个 PM 计划可能所有子任务都没有越界，但仍然遗漏父任务要求。

因此必须满足：

```math
Q_{parent}
\subseteq
\bigcup_{i=1}^{n}
\operatorname{Coverage}(T_i)
```

如果存在父任务要求：

```math
q \in Q_{parent}
```

但：

```math
q
\notin
\bigcup_{i=1}^{n}
\operatorname{Coverage}(T_i)
```

则产生：

```text
MISSING_REQUIRED_OUTCOME
```

这使 BoundX 能同时发现“越界”和“漏项”。

---

# 10. Boundary-preserving Task Decomposition

一个合法的任务拆分必须同时满足不扩张、完整覆盖、约束保持、关系有效和依赖有效。

```math
\operatorname{ValidDecomposition}
=
\operatorname{NoExpansion}
\land
\operatorname{RequiredCoverage}
\land
\operatorname{ConstraintPreservation}
\land
\operatorname{RelationValidity}
\land
\operatorname{DependencyValidity}
```

对整个 PM 计划，可以定义：

```math
\operatorname{ValidPlan}(P,B_p)
=
\operatorname{NoBoundaryViolation}(P,B_p)
\land
\operatorname{RequiredCoverage}(P,B_p)
\land
\operatorname{ConstraintPreservation}(P,B_p)
\land
\operatorname{RelationValidity}(P,B_p)
```

这就是 BoundX 对 PM 规划、拆分和任务分配进行数学验证的核心计算。

---

# 11. 自由度与边界必须区分

父任务没有约束的维度，不应被 BoundX 自动视为禁止。

任务空间可以表示为：

```math
X
=
X_{constrained}
\times
X_{free}
```

BoundX 约束的是：

```math
X_{constrained}
```

而不是消灭：

```math
X_{free}
```

因此 Agent 仍然可以在自由维度上选择实现语言、工具、算法和执行路径。

> **BoundX 限制的是边界，而不是 Agent 的能力。**

---

# 12. Boundary Result 的作用

主任务 Boundary Result 一旦 `determined`，就可以成为后续规划的正式数学基准。

对整个 PM 计划：

```math
\operatorname{Conform}(P,B_{parent})
```

其结果可以是：

```text
conformant
nonconformant
```

并给出明确诊断：

```text
scope_expansion
missing_required_outcome
forbidden_action
constraint_violation
relation_violation
dependency_violation
```

---

# 13. BoundX 的真正作用

BoundX 不是 Agent 工作流、状态机、轨道机或 RPA，也不是让另一个 AI 去评价 Agent 做得好不好。

BoundX 是：

> **一个把任务边界变成可计算数学对象，并用该边界验证 Agent 后续规划是否仍然合法的边界分析系统。**

其产品闭环是：

```text
第一次 BoundX
主任务 → 计算并冻结 Boundary

PM / Agent
自由规划、拆分、分配

第二次 BoundX
计划 / 子任务 → 计算是否符合父 Boundary
```

---

# 14. 一句话产品定义

> **BoundX 先把主任务计算成一个确定边界，再把 Agent 的每一次规划、拆分和任务分配投影回这个边界进行数学验证。**

---

# 15. 最终原则

```text
Agent 可以自由发挥能力
PM 可以自由规划和拆分
路径可以涌现
轨道机不能裁决
状态机不能裁决
工作流不能裁决
主任务 Boundary 一旦确定，就不能被下游静默跨越
```

如果：

```math
P
\in
\Omega_{B_{parent}}
```

则计划符合父边界。

如果：

```math
P
\notin
\Omega_{B_{parent}}
```

则计划越界。

> **BoundX 不限制智能体的能力，只确定并守住智能体不可跨越的任务边界。**
