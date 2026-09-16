# 界痕（BoundX）产品手册

文档编号：`BX-PRODUCT-MANUAL-001`  
版本：`0.2.0-draft.1`  
状态：`DRAFT_FOR_REVIEW`  
日期：2026-09-16  
产品：**界痕 · BoundX**  
协议：**BXP — Boundary Xplain Protocol（边界分析协议）**  
决定主体：ADMIN  

---

# 0. 本版说明

本手册是 BoundX 的**新完整产品定义**。

它不沿用旧产品手册的产品模型，不把旧版“7+1 → 三轴结果”作为当前产品终点，也不继承旧版 L3、旧研究基线、旧开源许可证提案或旧商业结构中的限制性定义。

旧文档可以作为历史开发记录存在，但：

```text
OLD PRODUCT MANUAL
≠
CURRENT PRODUCT DEFINITION
```

本手册从 BXP `0.4.0-draft.1` 的协议模型重新定义 BoundX。

当前产品实际实现状态仍必须与产品定义分开：

- 当前产品版本：`1.3.0-preview.0`
- 当前已实现线上协议合同：BXP `0.3.0-draft.2`
- 当前已实现计算套件：`1.0.0-draft.3`
- BXP `0.4.0-draft.1`：当前为目标协议，正在实施，不得把旧实现重新贴标签冒充 0.4

因此：

```text
Product Definition
≠
Current Implementation Status
```

---

# 1. BoundX 是什么

## 1.1 一句话定义

> **BoundX 是 BXP 的产品实现：把自然语言任务转换为可计算的形式边界，并在正式任务进入 Agent 规划或执行之前，产生可验证的 Boundary Result 与 Admission。**

BoundX 不是一个“帮模型理解任务”的提示词工具。

BoundX 也不是一个“给任务打分”的 AI 审查器。

它解决的是：

> **一个任务到底有没有确定边界；如果有，这个边界是什么；如果没有，为什么不能放行。**

---

## 1.2 产品口号

> **执行之前，先把任务边界算清楚。**

英文：

> **Clarify task boundaries before execution.**

---

## 1.3 产品定位

BoundX 是：

> **Task Boundary Preflight Engine**

更完整地说：

> **A deterministic boundary modeling and admission engine for natural-language Agent tasks.**

BoundX 位于：

```text
人类任务
与
Agent 正式规划 / 执行
之间
```

它不是 Agent 本身，也不替代 Host、PM、审批系统、IAM 或执行系统。

---

# 2. 核心问题

自然语言任务天然可能包含：

- 歧义；
- 缺失；
- 指代不明；
- 条件不完整；
- 版本不明；
- 对象范围不明；
- 权限主体不明；
- 数值冲突；
- 时序冲突；
- 禁止条件冲突；
- 上下游交接缺失；
- 企业身份与岗位混淆；
- 企业岗位与权限混淆；
- 临时授权过期；
- 原任务被修改但旧结果仍被继续使用。

Agent 最危险的问题之一，不是“不会做”，而是：

> **在边界还没有被确定时，系统却把任务当作已经确定。**

BoundX 的设计原则是：

```math
Ambiguity \not\Rightarrow Guess
```

而是：

```math
BoundaryRelevantAmbiguity
\Rightarrow
underdetermined
```

---

# 3. BXP 0.4 的协议主链

BoundX 的产品主线必须与 BXP 0.4 一致：

```math
TaskSemantics
\rightarrow
IR_{7+1}
\rightarrow
FormalBoundaryModel
\rightarrow
BoundaryResult
\rightarrow
Admission
\rightarrow
DownstreamConformance
```

含义如下：

| 层 | 作用 |
|---|---|
| Task Semantics | 原始自然语言任务及其上下文 |
| `IR_{7+1}` | 标准语义中间表示 |
| Formal Boundary Model | 可计算的形式边界模型 |
| Boundary Result | 最终标准边界对象 |
| Admission | 是否允许正式任务进入后续生命周期 |
| Downstream Conformance | PM/Agent 后续计划或子任务是否仍在父边界内 |

---

# 4. 7+1 不是最终边界

BXP 使用：

```math
IR_{7+1}=(I,O,A,P,R,V,C,B)
```

其中：

| 字段 | 含义 |
|---|---|
| I — Input | 输入、对象、范围 |
| O — Output | 交付物、结果 |
| A — Action | 动作 |
| P — Participants | 参与者、责任主体 |
| R — Resource | 数量、时间、容量、金额等资源约束 |
| V — Version / Provenance | 版本、依据、来源 |
| C — Completion | 完成、停止条件 |
| B — Boundary | 明确禁止边界 |

三态：

```text
resolved
unresolved
absent
```

但：

```math
AllBucketsNonEmpty
\not\Rightarrow
BoundaryDetermined
```

7+1 只是语义承载层。

它存在的目的，是为了进入形式模型并计算最终边界。

---

# 5. Formal Boundary Model

BoundX 将标准语义 IR 编译为形式模型：

```math
\mathcal{M}(IR)
=
(E,\Sigma,Q,F,K,R_{cal},D,\Phi)
```

其中可包含：

| 符号 | 含义 |
|---|---|
| E | 实体与制品 |
| Σ | 作用域、状态空间 |
| Q | 必需结果、义务 |
| F | 禁止动作、效果、状态 |
| K | 完成、停止条件 |
| Rcal | 角色、身份、关系事实 |
| D | 依赖、交接、来源、版本 |
| Φ | 数值、集合、逻辑、时序、排序、基数等形式约束 |

Formalizer 必须：

- 版本化；
- 可重放；
- 不补造未知事实；
- 不把“最可能”当“已确定”；
- 保留来源与证据。

---

# 6. Boundary Result

Boundary Result 是 BXP 的协议终点之一。

它不是解释文字，而是标准数据对象。

Boundary Result 至少具有四种状态：

```text
determined
underdetermined
inconsistent
invalid
```

---

## 6.1 determined

表示：

- 关键身份已解析；
- 关键 scope 已解析；
- 关键 required facts 已解析；
- 可接受解释产生同一个规范边界；
- 约束内部一致；
- 解空间可成立。

---

## 6.2 underdetermined

表示：

> 当前信息不足以形成唯一标准边界。

典型情况：

- “清理”可能表示删除或归档；
- “张工”对应多个员工；
- 使用了两个制度版本但没有优先级；
- 临时 delegation 的时间基线缺失；
- scope 未确定；
- 动作效果未确定。

BoundX 不替 ADMIN 猜答案。

---

## 6.3 inconsistent

表示：

> 已经理解清楚，但要求互相矛盾。

例如：

```text
必须今天发布 build-9
同时
今天不得发布任何 build
```

这里不是“不懂”，而是：

```math
\Omega_B=\varnothing
```

---

## 6.4 invalid

表示输入/协议对象本身无效，例如：

- source digest 不匹配；
- evidence span 无效；
- ID 重复；
- formula AST 非法；
- scope 引用不存在；
- wire contract 不合法。

---

# 7. Boundary 是解空间

BoundX 不规定唯一执行方案。

形式上：

```math
\chi_M(x)
=
Q(x)
\land
\neg F(x)
\land
K(x)
\land
\Phi(x)
```

定义允许解空间：

```math
\Omega_B
=
\{x \in X_\Sigma \mid \chi_M(x)=true\}
```

因此：

> Boundary 可以是确定的，而执行方案可以有很多个。

例如：

```text
方案 A：脚本
方案 B：库函数
```

只要：

```math
x_A \in \Omega_B
```

且：

```math
x_B \in \Omega_B
```

两者都符合父边界。

---

# 8. 唯一边界与歧义

设所有源文本支持的合法语义解释集合为：

```math
\mathfrak{I}(S)
```

对每种解释形成边界：

```math
\mathfrak{B}(S,O_v)
=
\{
Evaluate(M(I),O_v)
\mid
I \in \mathfrak{I}(S)
\}
```

如果：

```math
\left|
\{
CanonBoundary(b)
\mid
b\in\mathfrak{B}(S,O_v)
\}
\right|
=1
```

则边界唯一。

如果存在两个 materially different canonical boundary，则：

```text
BoundaryState = underdetermined
```

---

# 9. Admission

Boundary Result 不等于正式放行。

正式任务必须通过 Admission。

定义：

```math
Admit(T_v)
=
ProtocolValid(T_v)
\land
BoundaryDetermined(T_v)
\land
ReleaseConditions(T_v)
\land
VersionBound(T_v)
```

只有：

```text
Admission = admitted
```

正式任务才允许进入后续正式规划生命周期。

否则：

```text
Release = blocked
```

---

# 10. Admission 不是执行授权

必须永久保持：

```text
business_decision = null
execution_authorization = null
```

即：

```math
Admission
\neq
BusinessDecision
```

```math
Admission
\neq
ExecutionAuthorization
```

BoundX 的职责是：

> **确定任务是否拥有可正式使用的边界。**

它不决定：

- 是否付款；
- 是否发布；
- 是否退款；
- 是否删除；
- 是否调用生产系统；
- 是否批准业务操作。

---

# 11. Admission Binding

正式 Admission 必须绑定精确事实源。

至少包括：

```math
D_A=
Hash(
ProtocolVersion,
Profile,
D_S,
D_{IR},
D_M,
FormalizerVersion,
OperatorProfileVersion,
D_B,
D_{L1},
D_{L2},
D_{L3}
)
```

如果当前：

```math
D_A^{current}
\neq
D_A^{admitted}
```

则：

```text
Release = blocked
```

即使重新计算后的 Boundary Result 表面相同，也不能继续复用旧 Admission。

---

# 12. Host Gate

BXP 0.4 对正式任务不是“可选检查”。

Host 必须 fail-closed：

```text
Admission admitted
→ 可进入正式规划

Admission blocked
→ 不得正式发布任务
```

Host 可以负责：

- Gate enforcement；
- UI；
- 工作流；
- 保存记录；
- 调用执行系统。

Host 不可以：

- 改写 Boundary Result；
- 把 blocked 改成 admitted；
- 用 UI PASS 覆盖 Admission；
- 用模型意见绕过 Gate。

---

# 13. PM 与 BoundX 的关系

BoundX 不取代 PM。

正确关系：

```text
ADMIN 原始任务
↓
BoundX
↓
确定并冻结父边界
↓
PM
↓
理解、规划、拆分
↓
BoundX
↓
检查下游计划是否仍符合父边界
```

也就是说：

> **BoundX 确定解空间；PM 在解空间内规划。**

PM 不能反过来定义父任务本来不存在的边界。

---

# 14. Producer 架构

自然语言进入 BXP 前，需要 Producer。

Producer 负责：

> **识别自然语言语义并形成候选。**

Producer 不负责最终边界。

统一结构：

```text
Natural Language
↓
Producer
↓
semantic observations / candidate IR
↓
BXP validation
↓
Formalizer
↓
Boundary Core
```

---

# 15. 三条 Producer 路线

BoundX 当前正式研究三条路线：

```text
Producer A — LLM
Producer B — spaCy Local NLP
Producer C — HanLP Local NLP
```

Gold Oracle 不是第四条 Producer。

---

## 15.1 LLM Producer

定位：

- 高能力语义理解参考路线；
- 测试复杂指代、条件、歧义、关系；
- 重点观察是否擅自补全；
- 重点观察 False Determination。

LLM 的输出仍必须经过本地合同和 Core。

---

## 15.2 spaCy Local NLP

定位：

- 本地 NLP 商用候选主路线；
- 无网络也可以运行；
- 适合规则、NER、依存、短语、实体关系等结构化识别；
- 需要 shared mapper；
- 模型和数据许可证必须单独核验。

---

## 15.3 HanLP Local NLP

定位：

- 中文 NLP 研究与测试对照路线；
- 用于观察 spaCy 在中文语义、依存、SRL 等方面的缺陷；
- 当前不作为默认商用路线；
- HanLP 框架许可与具体模型许可必须分开核验；
- 具体模型商用许可不明确时保持 `research-only`。

---

# 16. Producer 与 BXP 的边界

固定：

```text
NLP / LLM
负责识别

BXP / 7+1
负责标准化

Formalizer
负责形式化

Core
负责确定性计算

Host
负责 Admission Gate
```

简写：

> **NLP 负责识别，BXP 负责标准化，数学 Core 负责确定边界，Host 负责强制准入。**

---

# 17. L0 / L1 / L2 / L3

## 17.1 L0 — Core

L0 不是语义包。

它包含：

- 协议不变量；
- evidence；
- 三态；
- Formal Model；
- operator；
- Boundary Result；
- Admission；
- canonicalization；
- version binding。

---

## 17.2 L1 — Core Ontology

当前：

```text
core-ontology@1.1.0
```

作用：

- 跨行业动作原语；
- 模态；
- 角色基础类型；
- 基础语言表达；
- 通用语义关系。

L1 不定义客户业务事实。

---

## 17.3 L2 — Industry Semantic Pack

当前软件/AI：

```text
software-ai@0.2.0
```

作用：

- 软件/AI 行业动作；
- 实体；
- 岗位类型；
- completion；
- resources；
- references；
- risk/boundary concepts。

L2 不自动产生企业事实。

---

# 18. L3 — Enterprise Semantic Layer

L3 是企业自己的语义事实层。

它可以包含：

- Employee Identity；
- Alias；
- Department；
- Job Title；
- Grade；
- Grade Track；
- Manager Relation；
- Active / Inactive；
- Employment Type；
- Enterprise Objects；
- Explicit Authority Binding；
- Delegation；
- Policy；
- Temporal Validity；
- Scope。

---

## 18.1 L3 最重要的不变量

```math
Identity
\neq
JobTitle
\neq
Grade
\neq
Authority
```

例如：

```text
李敏
SRE Engineer
L4
```

这些事实都不能自动推出：

```text
production approval authority
```

---

## 18.2 Authority

企业 authority 必须来自明确事实：

```math
Authority(e,a,s,t)
\iff
ExplicitAuthorityBinding(e,a,s,t)
\lor
ValidDelegation(e,a,s,t)
```

不能使用：

```math
Manager
\Rightarrow
Approver
```

不能使用：

```math
L4
\Rightarrow
Approver
```

不能使用：

```math
ManagerOf(x,y)
\Rightarrow
AuthorityInheritance
```

---

# 19. Enterprise L3 示例

BoundX 研究使用虚拟企业：

```text
星衡智能科技有限公司
Acme AI Systems Ltd.
```

Package：

```text
com.acme-ai.enterprise@1.0.0
```

虚拟内容包括：

- 24 名员工；
- 部门；
- 岗位；
- 职级；
- 直属关系；
- 在职状态；
- 10 条显式 authority binding；
- 4 条 delegation；
- 10 条 policy。

真实客户 L3 不进入公共研究仓库。

---

# 20. Pack 原则

所有 Pack 默认是：

> **声明式数据**

不是：

- 任意 Python；
- JavaScript 插件；
- Shell 脚本；
- 动态网络加载器；
- 模型权重；
- 执行器。

Pack 必须：

- 有 ID；
- 有版本；
- 有 digest；
- 有依赖；
- 可离线；
- 可核验；
- 不使用 `latest`；
- 不静默覆盖同名定义。

---

# 21. 产品组件

BoundX 产品由以下逻辑组件组成：

```text
BXP Protocol
Boundary Core
Formalizer
Operator Registry
Admission Engine
Semantic Pack Loader
Producer Adapters
CLI
MCP
Local UI
Benchmark Harness
Research Evidence Tools
```

未来可以扩展：

```text
Python SDK
HTTP Server
IDE Plugin
Enterprise Host Adapter
Pack Manager
```

但所有入口必须共享同一个 BXP 语义合同。

---

# 22. 部署原则

BoundX 是部署中立的。

可以运行在：

- 本地电脑；
- 企业内网；
- 私有云；
- Server；
- IDE；
- Agent Host；
- MCP Host；
- Embedded 应用。

但：

```text
Deployment choice
≠
Protocol semantics
```

部署方式不能改变 BXP。

---

# 23. Offline-first

BoundX 的确定性 Core 应允许：

```text
offline
local
replayable
```

Core：

- 不要求公网；
- 不自动访问 URL；
- 不自动下载模型；
- 不自动加载远程制度；
- 不向外发送客户任务。

Producer 是否联网由 Producer 自己的 provider 决定。

---

# 24. CLI

目标：

```text
bx protocol-info
bx evaluate <ir-or-task>
bx boundary <task>
bx admission <task>
bx benchmark ...
```

具体命令名可以实现时冻结。

CLI 必须区分：

```text
BXP 0.3 historical mode
BXP 0.4 current mode
```

不得静默升级。

---

# 25. MCP

MCP 是一种接入方式，不定义协议。

MCP 可以提供：

- evaluate；
- boundary；
- admission；
- semantic pack info；
- protocol info；
- benchmark status。

MCP 不得：

- 授予 execution authority；
- 把模型意见写成 Admission；
- 绕过 Core。

---

# 26. UI

BoundX UI 的职责是：

- 输入任务；
- 查看 7+1；
- 查看证据；
- 查看 Formal Model；
- 查看 Boundary Result；
- 查看 Admission；
- 查看缺口；
- 提交澄清；
- 重新计算；
- 查看 Producer 路线差异；
- 查看版本和 digest。

UI 不是 Gate 本身。

---

# 27. 标准用户流程

```text
1. ADMIN 输入自然语言任务
2. Producer 识别语义
3. BXP 形成 7+1
4. Formalizer 形成 Formal Boundary Model
5. Core 计算 Boundary Result
6. 若 underdetermined → 返回具体澄清点
7. ADMIN 修订
8. 重新计算
9. Boundary determined
10. Admission 通过
11. PM / Agent 才进入正式规划
12. 下游计划继续做 Conformance Check
```

---

# 28. 澄清不是自由聊天

BoundX 应返回：

- 哪个字段未确定；
- 哪个实体有多个候选；
- 哪个 scope 未定义；
- 哪个 policy 版本冲突；
- 哪个 authority 缺少证据；
- 哪个约束互相矛盾。

而不是：

> “请补充更多信息。”

目标是：

> **把未知变成可回答的缺口。**

---

# 29. Downstream Conformance

父边界冻结后，PM/Agent 计划必须满足：

```math
Conform(X,B)
\iff
X \in \Omega_B
```

诊断至少包括：

```math
Missing
=
Required_B
\setminus
Covered_X
```

```math
Violation
=
Actions_X
\cap
Forbidden_B
```

以及：

```math
ConstraintViolation
=
\{\phi\in\Phi_B \mid X \not\models \phi\}
```

---

# 30. Gold Benchmark

BoundX 0.4 的开发/符合性基准为：

```text
Core Gold 100
+
L3 Gold 100
=
200
```

其中：

Core 100：

- Semantic IR / Ambiguity；
- Formal Boundary Model；
- Boundary Result；
- Admission / Version / Downstream。

L3 100：

- Identity / Organization；
- Job / Grade / Authority；
- Delegation / Policy / Temporal；
- L3 Version / Admission / Downstream。

---

# 31. 三路线 Benchmark

三条 Producer 都在同一 BXP Core 上测试：

```text
LLM
spaCy
HanLP
```

Primary：

```math
200\times3=600
```

Stability：

```math
200\times3\times3=1800
```

---

# 32. 关键研究指标

除普通 NLP 指标外，BoundX 特别关注：

## False Determination Rate

```math
FDR
=
\frac{
\#(Prediction=determined \land Gold\neq determined)
}{
\#(Gold\neq determined)
}
```

它衡量：

> 本来不该确定的任务，有多少被错误地说成确定。

---

## False Admission Rate

```math
FAR
=
\frac{
\#(Prediction=admitted \land Gold=blocked)
}{
\#(Gold=blocked)
}
```

它衡量：

> 本来应该拦截的任务，有多少被错误放行。

---

# 33. 研究证据

BoundX 从 BXP 0.4 研究开始建立正式证据链。

任何：

- Gold；
- 模型版本；
- Producer 输出；
- 失败；
- 重试；
- Formal Model；
- Boundary Result；
- Admission；
- 指标；

都必须保留。

已经用于结论的实验不得覆盖。

---

# 34. Paper Holdout

Core 100 + L3 100 是：

```text
Development / Conformance Benchmark
```

因为开发过程会看到它们。

未来论文必须另建：

```text
Sealed Paper Holdout
```

Holdout：

- 开发期间不可见 expected output；
- 不用于调规则；
- 不用于增加 case-specific 逻辑；
- 作为论文最终泛化实验。

---

# 35. 开源定义

BoundX 的产品方向是：

> **Open Source**

开源的核心应包括：

```text
BXP specification
BoundX deterministic Core
Formal Boundary Model
Boundary Result
Admission
Schemas
L1
公开 L2
虚拟 L3
Gold benchmark
Benchmark harness
Producer adapter interfaces
CLI / MCP 基础能力
研究方法与指标
```

---

# 36. 不进入公共开源仓库的内容

以下不公开：

- 真实客户 L3；
- 员工表；
- 客户 policy；
- 客户任务；
- 密钥；
- token；
- 私有连接配置；
- 商业秘密；
- 无再分发权的模型权重；
- 许可证不明确的资源。

---

# 37. 开源许可证

当前仓库实际 LICENSE 为：

```text
MIT
```

本手册不继承旧文档中的 AGPL 提案。

未来若 ADMIN 决定更换许可证，必须：

- 明确决定；
- 更新 LICENSE；
- 更新包元数据；
- 更新 README；
- 更新第三方许可清单；
- 对发布制品重新验收。

在 ADMIN 未作新决定前：

```text
Current repository license = MIT
```

---

# 38. 第三方许可证

必须分别核验：

```text
framework license
model license
dictionary license
training/data license where known
dependency license
redistribution rights
```

特别是：

```text
Engine license
≠
Model license
```

HanLP adapter 可以开源。

但许可不明确的 HanLP 模型权重不得随 BoundX 分发。

---

# 39. 商业化与开源并不冲突

BoundX 的核心价值不应该依赖隐藏算法。

可以开源：

- 协议；
- Core；
- Gold；
- Benchmark；
- Adapter；
- 基础 Pack。

商业价值可以来自：

- 私有 L3；
- 企业部署；
- Pack 治理；
- FDE；
- 企业连接器；
- 支持 SLA；
- 私有行业 Pack；
- 审计与监控；
- 大规模运行支持。

---

# 40. FDE

BoundX 可以提供 FDE / 规则实施服务。

FDE 负责：

- 梳理企业语言；
- 建立企业 L3；
- 整理 policy；
- 发现歧义；
- 建立 Gold；
- 做系统集成；
- 做版本迁移；
- 做回归与验收。

FDE 不得代替企业责任主体作业务决定。

---

# 41. 产品安全边界

BoundX 永远不应宣称：

- “百分之百防止事故”；
- “数学证明任务绝对安全”；
- “AI 已理解全部企业制度”；
- “测试通过等于批准执行”；
- “Admission 等于 execution authorization”；
- “安装 BoundX 就完成合规”。

---

# 42. 当前实现状态

截至本手册版本：

```yaml
product_version: 1.3.0-preview.0

protocol_spec:
  BXP-0001: 0.4.0-draft.1

implemented_wire_contract:
  BXP-0001: 0.3.0-draft.2

implemented_calc_suite:
  version: 1.0.0-draft.3

bxp_0_4_implementation:
  status: IN_PROGRESS

repository_license:
  SPDX: MIT

repository_visibility:
  current: private
  product_direction: open-source

pypi:
  published: false

npm:
  published: false

standalone_binary:
  available: false

production_server:
  ready: false
```

---

# 43. 0.3 的定位

BXP 0.3 继续保留为：

```text
historical implementation
backward regression
```

不再定义当前产品未来模型。

旧 208 条计算向量属于：

```text
0.3 historical conformance evidence
```

不是 0.4 Gold。

---

# 44. BXP 0.4 首次实现完成标准

BXP 0.4 首次实现至少要求：

- 0.4 Wire Contract；
- Formal Model；
- Formalizer version；
- Operator Profile；
- Boundary Result；
- canonical digest；
- Admission；
- version binding；
- L1/L2/L3 binding；
- Host fail-closed；
- downstream conformance；
- Core 100；
- L3 100；
- LLM/spaCy/HanLP routes；
- FDR；
- FAR；
- local reproducible research evidence。

---

# 45. 首个开源版本完成标准

正式把 BoundX 对外开源前至少完成：

1. BXP 0.4 实现；
2. 公共资产许可核验；
3. 删除真实客户数据；
4. 第三方依赖清单；
5. spaCy/HanLP 模型分发边界；
6. Core 100 + L3 100 可公开复现；
7. README 与产品手册一致；
8. 安装流程明确；
9. CLI/MCP 至少一个最小稳定入口；
10. 本地离线验证；
11. 发布包 SHA-256；
12. ADMIN 明确发布授权。

---

# 46. 对外产品主文案

## 中文

> **BoundX — 执行之前，先把任务边界算清楚。**
>
> 一个面向 Agent 任务的开源边界建模与确定性准入引擎。BoundX 将自然语言任务转化为标准 7+1 语义表示和 Formal Boundary Model，计算 Boundary Result，并在正式任务进入规划或执行前给出可验证的 Admission。LLM、spaCy、HanLP 等只负责语义识别；BXP 协议与确定性 Core 不依赖任何单一模型。

## English

> **BoundX — Clarify task boundaries before execution.**
>
> An open-source deterministic boundary modeling and admission engine for Agent tasks. BoundX transforms natural-language tasks into a standardized 7+1 semantic representation and Formal Boundary Model, computes a Boundary Result, and provides verifiable Admission before formal planning or execution. LLMs, spaCy, HanLP, and other systems are replaceable semantic producers; BXP and the deterministic Core remain model-independent.

---

# 47. 面向开发者的定义

> 输入自然语言任务或标准 BXP 对象，BoundX 通过可替换 Producer、标准 7+1 IR、Formalizer、确定性 Boundary Core 与 Admission Gate，把“任务是否有确定边界”变成可计算、可重放、可审计的数据问题。

---

# 48. 面向企业的定义

> BoundX 不替换企业现有 Agent、审批系统或执行系统。它在任务进入这些系统之前增加一个标准化边界层：把人、岗位、权限、对象、范围、条件、禁止项和版本事实变成可计算边界，避免系统在任务仍然模糊时就进入正式执行生命周期。

---

# 49. 面向研究的定义

> BoundX 提供一个研究自然语言任务确定性边界的开放实验框架：同一 BXP Core 下比较 LLM、spaCy、HanLP 等 Producer，使用 Gold、FDR、FAR、Boundary State、Admission 与 L3 企业语义评估“理解得像不像”之外更关键的问题——系统是否错误地制造了确定性。

---

# 50. 最终产品原则

BoundX 必须长期保持：

```text
协议可以开放
Producer 可以替换
模型可以变化
Pack 可以扩展
企业语义可以私有
确定性边界必须可重放
Admission 必须可验证
未知必须显式保留
执行权永远属于 Host / 业务责任主体
```

一句话：

> **BoundX 不替 Agent 做决定。BoundX 先把 Agent 可以在哪个边界内做决定，变成可计算的事实。**
