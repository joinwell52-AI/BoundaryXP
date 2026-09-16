<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v1/BoundX_Logo_EN_white.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v1/BoundX_Logo_EN_transparent.png">
    <img src="assets/branding/v1/BoundX_Logo_EN_transparent.png" alt="BoundX" width="460">
  </picture>
  <br><br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v1/BoundX_Logo_CN_JieHen_white.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v1/BoundX_Logo_CN_JieHen_transparent.png">
    <img src="assets/branding/v1/BoundX_Logo_CN_JieHen_transparent.png" alt="界痕" width="300">
  </picture>
</p>

<p align="center">
  <strong>执行之前，先把任务边界算清楚。</strong><br>
  <strong>Clarify task boundaries before execution.</strong>
</p>

<p align="center">
  <img alt="BXP" src="https://img.shields.io/badge/BXP-0.4.0--draft.1-4c6ef5">
  <img alt="Product" src="https://img.shields.io/badge/BoundX-1.3.0--preview.0-7950f2">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2f9e44">
  <img alt="Local first" src="https://img.shields.io/badge/Architecture-Local--first-0b7285">
  <img alt="Status" src="https://img.shields.io/badge/Status-Research%20Preview-f08c00">
</p>

---

## 界痕是什么？ / What is BoundX?

**BoundX（界痕）是 BXP — Boundary Xplain Protocol（边界分析协议）的产品实现。**

它把自然语言任务转换为**可计算、可重放、可验证的任务边界**，并在正式任务进入 Agent 规划或执行生命周期之前，给出标准化的 **Boundary Result** 与 **Admission**。

**BoundX is an open-source-oriented deterministic boundary modeling and admission engine for Agent tasks.** It turns natural-language task semantics into a formal boundary model, computes a verifiable Boundary Result, and determines whether the task is ready to enter formal downstream planning.

BoundX 不是另一个 Agent 框架，也不是权限系统，更不是“让模型自己猜一个最可能答案”的 Prompt 工具。

> **BoundX 不替 Agent 做决定。BoundX 先把 Agent 可以在哪个边界内做决定，变成可计算的事实。**

---

## 为什么需要 BoundX？ / Why BoundX?

自然语言任务经常同时包含对象、动作、责任主体、时限、版本、完成条件和禁止项。真正危险的情况并不只是“模型没理解”，而是：

> **任务边界仍然有歧义、缺失或冲突，系统却已经把它当成一个确定任务。**

BoundX 的核心原则是：

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

---

## BXP 0.4：从语言到确定边界 / From language to deterministic boundaries

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

| 层 / Layer | 作用 / Purpose |
|---|---|
| **Task Semantics** | 原始自然语言任务及其允许上下文 / Source task and allowed context |
| **IR 7+1** | 标准语义中间表示 / Standard semantic IR |
| **Formal Boundary Model** | 把语义编译为可计算约束 / Compile semantics into computable constraints |
| **Boundary Result** | 产生确定、欠确定、矛盾或无效的标准结果 / Produce a canonical boundary state |
| **Admission** | 判断正式任务是否可以进入后续生命周期 / Gate formal task release |
| **Downstream Conformance** | 检查 PM/Agent 的计划与子任务是否仍在父边界内 / Check downstream plans against the frozen parent boundary |

### 7+1 是语义 IR，不是最终结果

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

每个语义元素都必须显式保留：`resolved`、`unresolved` 或 `absent`。

```math
AllBucketsNonEmpty
\not\Rightarrow
BoundaryDetermined
```

---

## Formal Boundary Model

BXP 0.4 把语义 IR 编译为形式边界模型：

```math
\mathcal{M}(IR)
=
(E,\Sigma,Q,F,K,R_{cal},D,\Phi)
```

它可以表达：

- 实体与制品 / entities & artifacts
- 作用域 / scopes
- 必需结果与义务 / required outcomes & obligations
- 禁止动作、效果和状态 / forbidden actions, effects & states
- 完成与停止条件 / completion & stopping conditions
- 身份、角色和关系 / identity, role & relation facts
- 依赖、交接、来源和版本 / dependency, handoff, provenance & version
- 数值、集合、逻辑、时序、排序、基数等形式约束 / numeric, set, logic, temporal, ordering and cardinality constraints

Formalizer 必须版本化、可重放，并且**不得补造未知事实**。

---

## Boundary Result

BXP 0.4 的标准边界状态只有四类：

| State | 含义 / Meaning |
|---|---|
| `determined` | 关键事实已解析，规范边界唯一且一致 |
| `underdetermined` | 信息不足或存在会改变边界的合法多义解释 |
| `inconsistent` | 要求已经理解，但形式约束互相矛盾 |
| `invalid` | 输入、证据、Schema、引用或形式表达本身无效 |

BoundX 不是在寻找唯一“做法”，而是在计算允许的**解空间**：

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

因此，边界可以唯一，但 PM/Agent 仍然可以在边界内产生多个不同的合法实现方案。

---

## Admission：正式任务的准入门 / Formal task admission

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

如果 Admission 未通过：

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

**Admission ≠ Business Decision ≠ Execution Authorization.**

---

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

PM 不被 BoundX 取代，但 PM 也不能静默扩大已经冻结的父任务边界。

---

## Producer：模型可以替换，BXP 不变 / Replaceable producers, stable protocol

自然语言进入 BXP 之前需要 Producer。当前研究三条路线：

| Producer | 定位 / Role |
|---|---|
| **LLM** | 高能力语义理解参考路线；重点观察复杂语义以及是否擅自补全 |
| **spaCy Local NLP** | 本地 NLP 商用候选路线；模型与数据许可证单独核验 |
| **HanLP Local NLP** | 中文 NLP 研究/对照路线；具体模型许可明确前保持 research-only |

统一边界：

```text
LLM / NLP      → 负责识别 / recognition
BXP / 7+1      → 负责标准化 / normalization
Formalizer     → 负责形式化 / formalization
Boundary Core  → 负责确定性计算 / deterministic evaluation
Host           → 负责 Admission Gate / enforcement
```

**Gold Oracle 不是第四条 Producer。**

---

## L0 / L1 / L2 / L3

| 层 | 当前定义 |
|---|---|
| **L0 — BXP Core** | Evidence、Formal Model、Operator、Boundary Result、Admission、Canonicalization、Version Binding |
| **L1 — Core Ontology** | `core-ontology@1.1.0` |
| **L2 — Industry Semantic Pack** | 当前软件/AI：`software-ai@0.2.0` |
| **L3 — Enterprise Semantic Layer** | 企业身份、组织、岗位、职级、权限、委派、Policy、时间与 Scope 等事实 |

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

**Manager、L4、L5、直属上级关系本身都不能自动推出审批权。**

---

## 5 分钟本地体验 / Local quick start

> 当前命令运行的是仓库**已经实现**的产品能力。BXP 0.4 完整 Wire Contract 仍在开发中，不能把当前运行结果冒充 0.4 正式验收。

要求：Node.js `>=22.18.0`。

```bash
git clone https://github.com/joinwell52-AI/BoundX.git
cd BoundX
npm ci
npm run ui
```

打开终端打印的本地地址。

查看当前协议/实现信息：

```bash
node cli.mjs protocol-info
```

运行现有结构化示例：

```bash
node cli.mjs evaluate examples/bxp/zh-CN-complete.json
```

当前 CLI 还支持显式 legacy 命名空间；旧输入**不会静默升级**到新协议。

### 本地测试 / Local tests

```bash
npm test
npm run test:ui
npm run test:docs
```

使用和验证均可在本地完成，不依赖 GitHub Actions、Artifacts 或 Codespaces。

更多说明见 [QUICKSTART.md](QUICKSTART.md)。

---

## Gold 与研究基线 / Benchmark & research

BXP 0.4 的新开发/符合性研究从零开始：

```text
Core Gold 100
+
L3 Gold 100
=
200 cases
```

这 200 个案例用于 development / conformance benchmark；未来论文的最终泛化结论需要单独的 **sealed holdout**。

Primary benchmark：

```math
200\times3=600
```

Stability benchmark：

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

旧 0.3 测试和旧实验只作为 **historical regression / historical evidence** 保留，不继承旧准确率结论。

---

## 当前状态 / Current status

> **Product Definition ≠ Current Implementation Status.**

| 项目 | 当前状态 |
|---|---|
| Product | `1.3.0-preview.0` |
| Current specification | BXP-0001 `0.4.0-draft.1` |
| Implemented wire contract | BXP `0.3.0-draft.2` |
| Implemented calc suite | `1.0.0-draft.3` |
| BXP 0.4 implementation | `IN_PROGRESS` |
| L1 | `core-ontology@1.1.0` |
| L2 | `software-ai@0.2.0` |
| Enterprise L3 Profile v2 | target contract / implementation in progress |
| Gold | Core 100 + L3 100, pending formal freeze |
| Official three-route metrics | not published yet |
| Repository license | MIT |
| Repository visibility | private today |
| Product direction | open source |
| npm / PyPI / standalone installer | not published |

**不得把当前 0.3 实现重新贴标签冒充 0.4。**

---

## Local-first & offline-capable

BoundX 的确定性 Core 目标是：

```text
local
replayable
offline-capable
model-independent
```

Core 不应该：

- 自动访问公网；
- 自动下载模型；
- 自动读取远程制度；
- 把客户任务发送到外部服务；
- 依赖 GitHub CI 才能完成本地验证。

Producer 是否联网由具体 Provider 决定，并且必须显式配置。

---

## 开源方向 / Open-source direction

BoundX 的产品方向是开源。

计划公开的核心包括：

```text
BXP specification
BoundX deterministic Core
Formal Boundary Model
Boundary Result
Admission
Schemas
L1
public L2 packs
virtual L3 examples
Gold benchmark
benchmark harness
Producer adapter interfaces
CLI / MCP basics
research methodology & metrics
```

不会进入公共仓库的内容包括：真实客户 L3、员工数据、客户 Policy、任务原文、密钥、Token、私有连接配置、商业秘密，以及没有再分发权的第三方模型权重。

当前仓库许可证为 **MIT**。第三方 Engine / Model / Dictionary / Dataset 的许可证必须分别核验：

```text
Engine License
≠
Model License
≠
Data License
```

---

## 文档地图 / Documentation

| 文档 | 用途 |
|---|---|
| [产品手册 / Product Manual](docs/BOUNDX-PRODUCT-MANUAL.md) | 完整产品定义、产品边界、研究与开源策略 |
| [中文 BXP 0.4 规范](protocol/BXP-0001.zh-CN.md) | BXP 0.4 中文规范 |
| [English BXP 0.4 Specification](protocol/BXP-0001.md) | BXP 0.4 English specification |
| [协议导航](protocol/README.md) | Protocol status and navigation |
| [Quick Start](QUICKSTART.md) | 当前真实可运行的本地入口 |
| [功能与状态](docs/FUNCTIONS.md) | 已实现 / 目标能力的边界 |
| [Producer Adapter Contract](docs/PRODUCER-ADAPTER-CONTRACT.md) | LLM / spaCy / HanLP 统一适配边界 |
| [Enterprise L3](docs/L3-EMPLOYEE-DIRECTORY-GUIDE.md) | 企业身份、岗位、职级、权限与委派 |
| [Validation](docs/VALIDATION.md) | 本地验证、Gold、FDR/FAR 与研究口径 |
| [BXP 0.4 本地开发任务书 v1.2](docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md) | 当前实施与研究任务基线 |
| [Docs Index](docs/README.md) | 当前文档入口 |

---

## Brand Assets / 品牌资产

BoundX 的产品 Logo 是仓库的一部分，不是临时 README 装饰。

[`assets/branding/v1/`](assets/branding/v1/) 包含：

- `BoundX_Logo_EN_transparent.png` — 图标 + BoundX
- `BoundX_Logo_EN_white.png` — 深色背景英文版
- `BoundX_Logo_CN_JieHen_transparent.png` — 图标 + 界痕
- `BoundX_Logo_CN_JieHen_white.png` — 深色背景中文版
- `BoundX_Icon_transparent.png` — 仅图标
- `BoundX_Icon_white.png` — 深色背景图标
- `BoundX-logo-pack-v1.zip` — 完整品牌包

README 会根据 GitHub 明暗主题自动切换对应 Logo。

---

## License

BoundX 当前仓库代码使用 [MIT License](LICENSE)。第三方模型、词典、数据集和依赖可能有各自的许可证，不能用仓库 MIT 许可证替代。

---

<p align="center">
  <strong>BoundX — 执行之前，先把任务边界算清楚。</strong><br>
  <strong>Clarify task boundaries before execution.</strong>
</p>
