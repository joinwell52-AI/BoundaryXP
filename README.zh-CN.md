<p align="center">
  <a href="README.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v1/BoundX_Logo_CN_JieHen_white.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v1/BoundX_Logo_CN_JieHen_transparent.png">
    <img src="assets/branding/v1/BoundX_Logo_CN_JieHen_transparent.png" alt="界痕" width="420">
  </picture>
</p>

<p align="center"><strong>执行之前，先把任务边界算清楚。</strong></p>

<p align="center">
  <img alt="BXP" src="https://img.shields.io/badge/BXP-0.4.0--draft.1-4c6ef5">
  <img alt="Product" src="https://img.shields.io/badge/BoundX-1.3.0--preview.0-7950f2">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2f9e44">
  <img alt="Local first" src="https://img.shields.io/badge/Architecture-Local--first-0b7285">
  <img alt="Status" src="https://img.shields.io/badge/Status-Research%20Preview-f08c00">
</p>

---

## 界痕是什么？

**界痕（BoundX）是 BXP — Boundary Xplain Protocol（边界分析协议）的产品实现。**

它把自然语言任务转换为**可计算、可重放、可验证的形式边界**，并在正式任务进入 Agent 规划或执行生命周期之前，产生标准化的 **Boundary Result** 与 **Admission**。

BoundX 不是另一个 Agent 框架，不是权限系统，也不是“让模型猜一个最可能答案”的 Prompt 工具。

> **BoundX 不替 Agent 做决定。BoundX 先把 Agent 可以在哪个边界内做决定，变成可计算的事实。**

## 为什么需要 BoundX？

自然语言任务经常同时包含对象、动作、责任主体、时限、版本、完成条件和禁止项。危险的不只是“模型没有理解”，而是：

> **任务边界仍然有歧义、缺失或冲突，系统却已经把它当成一个确定任务。**

BoundX 的核心原则：

```math
Ambiguity \not\Rightarrow Guess
```

如果歧义会改变最终规范边界：

```math
BoundaryRelevantAmbiguity
\Rightarrow
BoundaryState=underdetermined
```

也就是说：**不确定时不猜，而是明确告诉 ADMIN 到底缺什么。**

## BXP 0.4：从自然语言到确定边界

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

| 层 | 作用 |
|---|---|
| **Task Semantics** | 原始自然语言任务及允许上下文 |
| **IR 7+1** | 标准语义中间表示 |
| **Formal Boundary Model** | 把语义编译为可计算约束 |
| **Boundary Result** | 形成标准边界对象与边界状态 |
| **Admission** | 判断正式任务是否可以进入后续生命周期 |
| **Downstream Conformance** | 检查 PM / Agent 的计划和子任务是否仍在父边界内 |

### 7+1 是语义 IR，不是最终边界

```math
IR_{7+1}=(I,O,A,P,R,V,C,B)
```

| 字段 | 含义 |
|---|---|
| **I — Input** | 输入、对象、范围 |
| **O — Output** | 交付物、结果 |
| **A — Action** | 动作 |
| **P — Participants** | 参与者、责任主体 |
| **R — Resource** | 时间、数量、容量、额度等资源约束 |
| **V — Version / Provenance** | 版本、依据、来源 |
| **C — Completion** | 完成、停止条件 |
| **B — Boundary** | 明确禁止边界 |

每个语义元素都必须显式保留 `resolved`、`unresolved` 或 `absent`。

```math
AllBucketsNonEmpty
\not\Rightarrow
BoundaryDetermined
```

## Formal Boundary Model

BXP 0.4 将标准语义 IR 编译为形式边界模型：

```math
\mathcal{M}(IR)
=
(E,\Sigma,Q,F,K,R_{cal},D,\Phi)
```

它可以表达实体与制品、作用域、必需结果与义务、禁止动作与状态、完成条件、身份与关系、依赖与版本，以及数值、集合、逻辑、时序、排序和基数约束。

Formalizer 必须版本化、可重放，并且**不得补造未知事实**。

## Boundary Result

BXP 0.4 的标准边界状态为：

| 状态 | 含义 |
|---|---|
| `determined` | 关键事实已解析，规范边界唯一且一致 |
| `underdetermined` | 信息不足，或存在会改变边界的合法多义解释 |
| `inconsistent` | 要求已经理解，但形式约束互相矛盾 |
| `invalid` | 输入、证据、Schema、引用或形式表达本身无效 |

BoundX 不是寻找唯一“做法”，而是计算允许的解空间：

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

```math
\Omega_B
=
\{x \in X_\Sigma \mid \chi_M(x)=true\}
```

因此，边界可以唯一，而 PM / Agent 仍然可以在边界内产生多个合法实现方案。

## Admission：正式任务的准入门

正式任务不是“7+1 填满了”就可以发布。

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

如果准入失败、陈旧或无法计算：

```math
Admission=blocked
\Rightarrow
Release=blocked
```

Host 必须 fail-closed，不能用 UI 的绿色提示、模型意见或旧缓存覆盖最新 Admission。

同时永久保持：

```text
business_decision = null
execution_authorization = null
```

**Admission 不等于业务决定，也不等于执行授权。**

## BoundX 与 PM / Agent

```text
ADMIN 原始任务
        ↓
      BoundX
        ↓
确定并冻结父任务边界
        ↓
        PM
        ↓
   理解、规划、拆分
        ↓
      BoundX
        ↓
检查下游计划是否仍符合父边界
```

> **BoundX 确定解空间；PM 在解空间内规划。**

BoundX 不取代 PM；PM 也不能静默扩大已经冻结的父任务边界。

## Producer：模型可以替换，BXP 不变

自然语言进入 BXP 前需要 Producer。当前研究三条路线：

| Producer | 定位 |
|---|---|
| **LLM** | 高能力语义理解参考路线，重点观察复杂语义以及是否擅自补全 |
| **spaCy Local NLP** | 本地 NLP 商用候选路线，模型与数据许可证单独核验 |
| **HanLP Local NLP** | 中文 NLP 研究/对照路线，具体模型许可明确前保持 research-only |

统一职责：

```text
LLM / NLP      → 负责识别
BXP / 7+1      → 负责标准化
Formalizer     → 负责形式化
Boundary Core  → 负责确定性计算
Host           → 负责 Admission Gate
```

**Gold Oracle 不是第四条 Producer。**

## L0 / L1 / L2 / L3

| 层 | 当前定义 |
|---|---|
| **L0 — BXP Core** | Evidence、Formal Model、Operator、Boundary Result、Admission、Canonicalization、Version Binding |
| **L1 — Core Ontology** | `core-ontology@1.1.0` |
| **L2 — Industry Semantic Pack** | 当前软件 / AI：`software-ai@0.2.0` |
| **L3 — Enterprise Semantic Layer** | 企业身份、组织、岗位、职级、显式权限、委派、Policy、时间和 Scope 等事实 |

Enterprise L3 的核心不变量：

```math
Identity
\neq
JobTitle
\neq
Grade
\neq
Authority
```

企业权限只能来自明确事实：

```math
Authority(e,a,s,t)
\iff
ExplicitAuthorityBinding(e,a,s,t)
\lor
ValidDelegation(e,a,s,t)
```

岗位、职级、经理关系本身都不能自动推出审批权。

## 5 分钟本地体验

> 以下命令是当前仓库已经存在的入口。BXP 0.4 完整 Wire Contract 仍在开发中，当前运行结果不能冒充 0.4 正式符合性证明。

要求：Node.js `>=22.18.0`。

```bash
git clone https://github.com/joinwell52-AI/BoundX.git
cd BoundX
npm ci
npm run ui
```

查看当前协议与实现信息：

```bash
node cli.mjs protocol-info
```

运行当前结构化示例：

```bash
node cli.mjs evaluate examples/bxp/zh-CN-complete.json
```

本地测试：

```bash
npm test
npm run test:ui
npm run test:docs
```

当前 CLI 的旧接口位于显式 `legacy` 命名空间；旧输入不会静默升级到新协议。更多说明见 [QUICKSTART.md](QUICKSTART.md)。

## Gold 与研究基线

BXP 0.4 的研究评价从零重新建立：

```text
Core Gold 100
+
L3 Gold 100
=
200 cases
```

这 200 例属于开发与符合性 Benchmark。未来论文最终泛化结论需要另建并封存独立 Holdout。

Primary Benchmark：

```math
200\times3=600
```

Stability Benchmark：

```math
200\times3\times3=1800
```

除普通 Precision / Recall / F1 外，BoundX 特别关注两类协议级错误。

### False Determination Rate

```math
FDR=
\frac{
\#(Prediction=determined \land Gold\neq determined)
}{
\#(Gold\neq determined)
}
```

### False Admission Rate

```math
FAR=
\frac{
\#(Prediction=admitted \land Gold=blocked)
}{
\#(Gold=blocked)
}
```

旧 0.3 测试与旧实验只作为历史回归和历史证据保留，不继承旧准确率结论。

## 当前状态

> **产品定义不等于当前实现状态。**

| 项目 | 当前状态 |
|---|---|
| 产品版本 | `1.3.0-preview.0` |
| 当前协议规范 | BXP-0001 `0.4.0-draft.1` |
| 当前已实现 Wire Contract | BXP `0.3.0-draft.2` |
| 当前已实现计算套件 | `1.0.0-draft.3` |
| BXP 0.4 实现 | `IN_PROGRESS` |
| L1 | `core-ontology@1.1.0` |
| L2 | `software-ai@0.2.0` |
| Enterprise L3 Profile v2 | 目标合同，开发中 |
| Gold | Core 100 + L3 100，待正式冻结 |
| 三路线正式指标 | 尚未发布 |
| 仓库许可证 | MIT |
| 仓库当前可见性 | 私有 |
| 产品方向 | 开源 |
| npm / PyPI / 独立安装包 | 尚未发布 |

不得把当前 0.3 实现重新贴标签冒充 0.4。

## Local-first

当前 BXP 0.4 开发、测试、Gold、Benchmark、研究证据和最终验收全部要求在本地完成：

```text
D:\boundx
```

不依赖 GitHub Actions、Artifacts 或 Codespaces；GitHub 配额不足不得成为开发和验收阻塞条件。

## 开源方向

BoundX 的产品方向是开源。计划公开的核心包括：

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

真实客户 L3、员工数据、客户 Policy、密钥、私有连接配置、商业秘密，以及无再分发权的模型权重不进入公共仓库。

当前仓库许可证是 **MIT**。第三方 Engine、Model、Dictionary、Data 和依赖许可证必须分别核验。

## 文档

- [完整产品手册](docs/BOUNDX-PRODUCT-MANUAL.md)
- [边界计算方法与产品作用](docs/BOUNDARY-CALCULATION-METHOD.md)
- [Real Gold 生成与审定标准](docs/GOLD-GENERATION-AND-ADJUDICATION-STANDARD.md)
- [Real Gold 生成执行方法（SOP）](docs/GOLD-GENERATION-SOP.md)
- [Real Gold 文件版式与双语展示规范](docs/GOLD-PRESENTATION-AND-BILINGUAL-FORMAT.md)
- [BXP 0.4 中文规范](protocol/BXP-0001.zh-CN.md)
- [BXP 0.4 English Specification](protocol/BXP-0001.md)
- [协议导航](protocol/README.md)
- [快速开始](QUICKSTART.md)
- [功能与交付状态](docs/FUNCTIONS.md)
- [Producer Adapter Contract](docs/PRODUCER-ADAPTER-CONTRACT.md)
- [Enterprise L3](docs/L3-EMPLOYEE-DIRECTORY-GUIDE.md)
- [本地验证与研究指标](docs/VALIDATION.md)
- [BXP 0.4 本地开发任务书 v1.2](docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)

## 品牌资产

已确认的产品 Logo 位于 [`assets/branding/v1/`](assets/branding/v1/)：

- `BoundX_Logo_CN_JieHen_transparent.png` — 图标 + 界痕
- `BoundX_Logo_EN_transparent.png` — 图标 + BoundX
- `BoundX_Icon_transparent.png` — 仅图标
- `BoundX_Icon_512_transparent.png` — GitHub / App 图标
- 对应白底版本与完整 Logo Pack

---

> **执行之前，先把任务边界算清楚。**