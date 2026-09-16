<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v1/BoundX_Logo_EN_white.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v1/BoundX_Logo_EN_transparent.png">
    <img src="assets/branding/v1/BoundX_Logo_EN_transparent.png" alt="BoundX" width="440">
  </picture>
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v1/BoundX_Logo_CN_JieHen_white.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v1/BoundX_Logo_CN_JieHen_transparent.png">
    <img src="assets/branding/v1/BoundX_Logo_CN_JieHen_transparent.png" alt="界痕" width="320">
  </picture>
</p>

# 界痕 · BoundX

> **执行之前，先把任务边界算清楚。**  
> **Clarify task boundaries before execution.**

BoundX 是 **BXP — Boundary Xplain Protocol（边界分析协议）** 的产品实现：把自然语言任务转换为可计算的形式边界，并在正式任务进入 Agent 规划或执行之前，产生可验证的 **Boundary Result** 与 **Admission**。

它不是一个 Agent，也不是一个权限系统，更不是“让模型自己猜边界”的提示词工具。

## BXP 0.4 产品主链

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

- **7+1**：I 输入、O 交付、A 动作、P 责任主体、R 资源、V 依据、C 完成与停止、B 禁止边界；它是标准语义 IR，不是最终边界。
- **Formal Boundary Model**：把任务语义编译为实体、作用域、义务、禁止、完成条件、关系、版本和形式约束。
- **Boundary Result**：输出 `determined`、`underdetermined`、`inconsistent`、`invalid`。
- **Admission**：只有边界已经确定、版本绑定有效、Release Conditions 满足时，正式任务才允许进入后续生命周期。
- **Downstream Conformance**：PM / Agent 后续计划和子任务必须继续符合已冻结的父边界。

BoundX 的基本原则：

```math
Ambiguity \not\Rightarrow Guess
```

```math
BoundaryRelevantAmbiguity
\Rightarrow
underdetermined
```

## BoundX 与 PM / Agent

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

> **BoundX 确定解空间；PM 在解空间内规划。**

Admission 不是业务审批，也不是执行授权：

```text
business_decision = null
execution_authorization = null
```

## Producer：模型可以替换，BXP 不变

自然语言进入 BXP 前需要 Producer。当前正式研究三条路线：

| 路线 | 定位 |
|---|---|
| **LLM** | 高能力语义理解参考路线，重点观察是否擅自补全 |
| **spaCy Local NLP** | 本地 NLP 商用候选路线，模型与数据许可证独立核验 |
| **HanLP Local NLP** | 中文 NLP 研究/对照路线，具体模型许可明确前保持 research-only |

统一边界：

```text
NLP / LLM       → 负责识别
BXP / 7+1       → 负责标准化
Formalizer      → 负责形式化
Boundary Core   → 负责确定性计算
Host            → 负责 Admission Gate
```

Gold Oracle 不是第四条 Producer。

## L0 / L1 / L2 / L3

- **L0 — BXP Core**：协议不变量、Evidence、Formal Model、Operator、Boundary Result、Admission、Canonicalization、Version Binding。
- **L1 — Core Ontology**：`core-ontology@1.1.0`。
- **L2 — Industry Semantic Pack**：当前软件/AI 为 `software-ai@0.2.0`。
- **L3 — Enterprise Semantic Layer**：企业自己的身份、组织、岗位、职级、显式权限、委派、Policy、时间和 Scope 事实。

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

```math
Authority(e,a,s,t)
\iff
ExplicitAuthorityBinding(e,a,s,t)
\lor
ValidDelegation(e,a,s,t)
```

岗位、职级、经理关系本身都不能自动推出企业授权。

## Gold 与研究基线

BXP 0.4 的新开发/符合性基准从零开始：

```text
Core Gold 100
+
L3 Gold 100
=
200
```

三条 Producer 共享同一 Gold、同一 BXP Core、同一 Evaluator。

Primary：

```math
200\times3=600
```

Stability：

```math
200\times3\times3=1800
```

除普通 NLP 指标外，BoundX 特别关注：

```math
FDR=
\frac{
\#(Prediction=determined \land Gold\neq determined)
}{
\#(Gold\neq determined)
}
```

```math
FAR=
\frac{
\#(Prediction=admitted \land Gold=blocked)
}{
\#(Gold=blocked)
}
```

旧 0.3 / 旧实验只保留为历史实现和 backward regression，不继承旧准确率结论。

## 当前状态

| 项目 | 当前状态 |
|---|---|
| 产品版本 | `1.3.0-preview.0` |
| 当前规范 | BXP-0001 `0.4.0-draft.1` |
| 当前已实现 Wire Contract | BXP `0.3.0-draft.2` |
| 当前已实现 Calc Suite | `1.0.0-draft.3` |
| BXP 0.4 实现 | `IN_PROGRESS` |
| Gold | Core 100 + L3 100，待正式冻结 |
| 三路线正式结果 | 尚未发布 |
| Repository License | MIT |
| Product Direction | Open Source |

> **Product Definition ≠ Current Implementation Status.**  
> 不得把 0.3 现有实现重新贴标签冒充 0.4。

## Local-first

当前 BXP 0.4 开发、测试、Gold、Benchmark 与研究证据全部要求在本地完成：

```text
D:\boundx
```

不依赖 GitHub Actions、Artifacts 或 Codespaces；GitHub 配额不足不得成为开发和验收的阻塞条件。

## 开源方向

BoundX 的方向是开源。

计划公开的核心包括：

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

真实客户 L3、员工数据、客户 Policy、密钥、私有配置、商业秘密以及无再分发权的模型权重不进入公共仓库。

当前仓库许可证为 **MIT**；不继承旧文档中的 AGPL 提案。第三方 Engine / Model / Dictionary / Data 许可证分别核验。

## 文档

- [完整产品手册](docs/BOUNDX-PRODUCT-MANUAL.md)
- [当前文档导航](docs/README.md)
- [中文 BXP 0.4 规范](protocol/BXP-0001.zh-CN.md)
- [English BXP 0.4 Specification](protocol/BXP-0001.md)
- [协议导航](protocol/README.md)
- [快速开始](QUICKSTART.md)
- [功能与实现状态](docs/FUNCTIONS.md)
- [Producer Adapter Contract](docs/PRODUCER-ADAPTER-CONTRACT.md)
- [Enterprise L3](docs/L3-EMPLOYEE-DIRECTORY-GUIDE.md)
- [本地验证与研究指标](docs/VALIDATION.md)
- [BXP 0.4 本地开发任务书 v1.2](docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)

## Brand Assets

完整产品 Logo 已保存在 [`assets/branding/v1/`](assets/branding/v1/)：

- `BoundX_Logo_EN_transparent.png` — 图标 + BoundX
- `BoundX_Logo_EN_white.png` — 深色模式版本
- `BoundX_Logo_CN_JieHen_transparent.png` — 图标 + 界痕
- `BoundX_Logo_CN_JieHen_white.png` — 深色模式版本
- `BoundX_Icon_transparent.png` — 仅图标
- 完整 Logo Pack 保留在品牌目录中

---

> **BoundX 不替 Agent 做决定。BoundX 先把 Agent 可以在哪个边界内做决定，变成可计算的事实。**
