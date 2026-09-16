# 界痕 · BoundX

<p align="center"><img src="assets/branding/v1/BoundX_Logo_EN_white.png" alt="界痕 BoundX Logo" width="320"></p>

> **执行之前，先把任务边界算清楚。**  
> **Clarify task boundaries before execution.**

## BoundX 是什么 / What is BoundX?

**BoundX（界痕）是 BXP — Boundary Xplain Protocol（边界分析协议）的产品实现。**  
它把自然语言任务转换为可计算的形式边界，并在正式任务进入 Agent 规划或执行之前，产生可验证、可重放的 **Boundary Result** 与 **Admission**。

**BoundX is the product implementation of BXP — Boundary Xplain Protocol.**  
It turns natural-language tasks into computable formal boundaries and produces a verifiable, replayable **Boundary Result** and **Admission** before a task enters formal Agent planning or execution.

BoundX 不是黑箱任务评分器，也不替 Agent、PM、审批系统或业务责任主体作决定。  
BoundX is not a black-box task scorer and does not replace Agents, PMs, approval systems, or accountable business owners.

---

## BXP 0.4 / Current protocol baseline

当前协议规范从 **BXP-0001 `0.4.0-draft.1`** 开始。

The current protocol baseline starts from **BXP-0001 `0.4.0-draft.1`**.

```math
\text{Task Semantics}
\rightarrow
IR_{7+1}
\rightarrow
Formal\ Boundary\ Model
\rightarrow
Boundary\ Result
\rightarrow
Admission
\rightarrow
Downstream\ Conformance
```

- `IR_{7+1}` 是标准语义中间表示，不是最终边界。  
  `IR_{7+1}` is a semantic intermediate representation, not the final boundary.
- Formal Boundary Model 把语义事实编译为可计算约束。  
  The Formal Boundary Model compiles semantic facts into computable constraints.
- Boundary Result 给出正式边界状态与规范边界对象。  
  The Boundary Result provides the formal boundary state and canonical boundary object.
- Admission 决定正式任务是否可以进入后续正式生命周期。  
  Admission determines whether a formal task may enter the downstream lifecycle.
- PM / Agent 后续计划和子任务仍必须符合已经冻结的父边界。  
  Downstream PM / Agent plans and subtasks must remain conformant with the frozen parent boundary.

---

## 7+1 语义 IR / 7+1 semantic IR

```math
IR_{7+1}=(I,O,A,P,R,V,C,B)
```

| Element | 中文 | English |
|---|---|---|
| I | 输入、对象、范围 | Input, target and scope |
| O | 输出、交付 | Output and deliverables |
| A | 动作 | Actions |
| P | 参与者、责任主体 | Participants and responsible subjects |
| R | 时间、数量、金额、容量等资源约束 | Resource constraints |
| V | 版本、依据、来源 | Version and provenance |
| C | 完成与停止条件 | Completion and stopping conditions |
| B | 明确禁止边界 | Explicit forbidden boundary |

每个元素显式保持：`resolved / unresolved / absent`。未知不能默认补齐。

Each element preserves one of `resolved / unresolved / absent`. Unknowns must not be silently completed.

```math
AllBucketsNonEmpty
\not\Rightarrow
BoundaryDetermined
```

---

## Formal Boundary Model

BXP 0.4 将 7+1 编译为形式边界模型：

BXP 0.4 compiles 7+1 into a formal boundary model:

```math
\mathcal{M}(IR)
=
(E,\Sigma,Q,F,K,R_{cal},D,\Phi)
```

它可以包含实体、作用域、必需结果、禁止动作与状态、完成条件、身份与关系、依赖与来源，以及数值、集合、逻辑、时序、排序和基数约束。

It may contain entities, scopes, required outcomes, forbidden actions and states, completion conditions, identities and relations, dependencies and provenance, plus numeric, set, logical, temporal, ordering, and cardinality constraints.

Formalizer 必须版本化、可重放，并且不得补造任务和已选语义上下文中不存在的事实。

The Formalizer must be versioned and replayable, and it must not invent facts absent from the task and selected semantic context.

---

## Boundary Result

Boundary Result 至少具有四种标准状态：

The Boundary Result has at least four normative states:

| State | 中文 | English |
|---|---|---|
| `determined` | 边界已确定 | A unique usable canonical boundary exists |
| `underdetermined` | 信息不足以确定唯一边界 | Multiple materially different boundaries remain possible |
| `inconsistent` | 已解析要求互相矛盾 | Resolved constraints are mutually inconsistent |
| `invalid` | 协议对象或证据无效 | The protocol object or evidence is invalid |

BoundX 的原则不是“猜一个最可能答案”：

BoundX does not guess the most likely interpretation when the boundary is still ambiguous:

```math
BoundaryRelevantAmbiguity
\Rightarrow
underdetermined
```

---

## Boundary 是解空间 / Boundary as a solution space

```math
\chi_M(x)
=
Q(x)\land\neg F(x)\land K(x)\land\Phi(x)
```

```math
\Omega_B
=
\{x\in X_\Sigma\mid\chi_M(x)=true\}
```

BoundX 不要求唯一执行方案；它要求正式任务具有确定的允许解空间。不同实现只要都位于 `\Omega_B` 中，就可以同时符合边界。

BoundX does not require a unique implementation plan. It requires a determined allowed solution space. Multiple implementations may all conform if they remain inside `\Omega_B`.

---

## Admission / Mandatory admission for formal tasks

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

只有 `Admission = admitted` 的正式任务，才允许进入后续正式规划生命周期；否则必须 fail-closed。

Only a formal task with `Admission = admitted` may enter the downstream formal planning lifecycle; otherwise the host must fail closed.

```math
Admission=false
\Rightarrow
Release=blocked
```

Admission 不是业务决定，也不是执行授权：

Admission is neither a business decision nor execution authorization:

```text
business_decision = null
execution_authorization = null
```

---

## BoundX 与 PM / BoundX and PM

```text
ADMIN 原始任务 / raw task
        ↓
      BoundX
        ↓
确定并冻结父边界 / determine and freeze parent boundary
        ↓
        PM
        ↓
规划、拆分 / plan and decompose
        ↓
      BoundX
        ↓
下游符合性检查 / downstream conformance
```

**BoundX 确定解空间；PM 在解空间内规划。**  
**BoundX determines the solution space; PM plans inside that space.**

---

## Producer 架构 / Producer architecture

自然语言语义识别与 BXP 协议是两层不同职责：

Natural-language semantic recognition and the BXP protocol are separate responsibilities:

```text
Natural Language
      ↓
Producer
      ↓
7+1 candidate + evidence
      ↓
BXP validation
      ↓
Formalizer
      ↓
Deterministic Boundary Core
      ↓
Boundary Result + Admission
```

当前研究路线：

Current research routes:

| Producer | 定位 / Role |
|---|---|
| LLM | 高能力参考路线；重点观察语义理解与擅自补全 / high-capability reference route |
| spaCy Local NLP | 本地 NLP 商用候选主路线 / local NLP commercial candidate |
| HanLP Local NLP | 中文研究与对照路线；具体模型许可明确前保持 research-only / Chinese research and comparison route |

**LLM、spaCy、HanLP 都只是可替换 Producer；它们不改变 BXP 的协议语义。**

**LLMs, spaCy, and HanLP are replaceable Producers; none of them redefine BXP semantics.**

---

## L0 / L1 / L2 / L3

### L0 — Protocol & deterministic Core

L0 不是语义包。它包含协议不变量、证据、三态、Formal Model、Operator、Boundary Result、Admission、canonicalization 与 version binding。

L0 is not a semantic pack. It contains protocol invariants, evidence rules, tri-state semantics, the Formal Model, operators, Boundary Result, Admission, canonicalization, and version binding.

### L1 — Core ontology

当前基线：`core-ontology@1.1.0`。

Current baseline: `core-ontology@1.1.0`.

### L2 — Industry semantic pack

当前软件 / AI 基线：`software-ai@0.2.0`。

Current software / AI baseline: `software-ai@0.2.0`.

### L3 — Enterprise semantic layer

L3 是企业自己的事实层，可以包含员工身份、别名、部门、岗位、职级、组织关系、在职状态、企业对象、显式权限、委派、政策、时间有效性和作用域。

L3 is the enterprise-specific fact layer. It may contain employee identity, aliases, departments, job titles, grades, organizational relations, employment status, enterprise objects, explicit authority bindings, delegations, policies, temporal validity, and scope.

最重要的不变量：

The key invariant:

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

岗位、职级、经理关系本身不能自动推出权限。

Job title, grade, and manager relations must not imply authority by themselves.

---

## 研究基准 / Research benchmark

从 BXP 0.4 开始，研究评价重新建立基线；旧研究结果只作为历史材料，不进入新的正式统计。

Research evaluation is reset from BXP 0.4 onward. Earlier experimental results remain historical material and are not part of the new formal statistics.

```text
BXP-0.4-CORE-GOLD-100
+
BXP-0.4-L3-GOLD-100
=
200 development / conformance cases
```

三条 Producer 使用同一 Gold、同一 BXP Core 与同一 evaluator。

All three Producer routes use the same Gold, the same BXP Core, and the same evaluator.

重点指标包括：

Key metrics include:

```math
FDR
=
\frac{
\#(Prediction=determined\land Gold\neq determined)
}{
\#(Gold\neq determined)
}
```

```math
FAR
=
\frac{
\#(Prediction=admitted\land Gold=blocked)
}{
\#(Gold=blocked)
}
```

其中 FDR 关注“错误制造确定性”，FAR 关注“错误放行”。

FDR measures false determination; FAR measures false admission.

Core 100 + L3 100 属于 development / conformance benchmark。论文最终泛化实验将使用单独封存的 Paper Holdout。

Core 100 + L3 100 are the development / conformance benchmark. Final paper generalization experiments will use a separately sealed Paper Holdout.

---

## 开源方向 / Open-source direction

BoundX 的产品方向是开源。

BoundX is intended to be open source.

计划公开的核心包括：

The intended public core includes:

- BXP specification
- deterministic Boundary Core
- Formal Boundary Model
- Boundary Result & Admission
- Schemas
- L1 and public L2 packs
- virtual / synthetic L3 examples
- Gold benchmark and benchmark harness
- Producer adapter interfaces
- baseline CLI / MCP capabilities
- research methodology and metrics

真实客户 L3、员工表、客户制度、客户任务、密钥、私有连接配置以及无再分发权的模型权重不会进入公共仓库。

Real customer L3 data, employee records, customer policies and tasks, secrets, private connection settings, and model weights without redistribution rights will not be included in the public repository.

当前仓库实际许可证为 **MIT**。任何未来许可证变化都必须由 ADMIN 明确决定并同步 `LICENSE`、README、包元数据和发布制品。

The repository currently uses the **MIT License**. Any future license change requires an explicit ADMIN decision and corresponding updates to `LICENSE`, the README, package metadata, and release artifacts.

---

## 当前实现状态 / Current implementation status

BXP 0.4 是当前协议和产品开发起点，但实现迁移仍在进行。

BXP 0.4 is the current protocol and product-development baseline, while implementation migration is still in progress.

```yaml
protocol_spec:
  BXP-0001: 0.4.0-draft.1

bxp_0_4_implementation:
  status: IN_PROGRESS

l1:
  core-ontology: 1.1.0

l2:
  software-ai: 0.2.0

repository_license:
  SPDX: MIT

repository_visibility:
  current: private
  direction: open-source
```

历史 `0.3.0-draft.2` 实现和既有 208 条计算向量继续保留为 backward regression / historical conformance evidence，但不再定义 BXP 0.4 的产品模型，也不是新的 Gold 基准。

The historical `0.3.0-draft.2` implementation and its 208 calculation vectors remain as backward-regression / historical-conformance evidence. They no longer define the BXP 0.4 product model and are not the new Gold benchmark.

---

## 本地优先 / Local-first

BXP 确定性 Core 设计为可本地、离线和可重放：

The deterministic BXP Core is designed to be local, offline-capable, and replayable:

- Core 不要求公网 / no public network required by the Core
- Core 不自动下载模型 / no automatic model downloads
- Core 不自动访问制度 URL / no automatic policy URL access
- Core 不秘密上传客户任务 / no hidden task upload
- Producer 是否联网由具体 Provider 决定 / Producer connectivity depends on the selected provider

当前 BXP 0.4 开发、Gold、Benchmark 与研究证据均以本地 `D:\boundx` 为主，不依赖 GitHub Actions 或 GitHub Artifacts 完成验收。

Current BXP 0.4 development, Gold evaluation, benchmark runs, and research evidence are local-first under `D:\boundx`; completion does not depend on GitHub Actions or GitHub Artifacts.

---

## 文档 / Documentation

- [BXP protocol index](protocol/README.md)
- [BXP-0001 English](protocol/BXP-0001.md)
- [BXP-0001 中文](protocol/BXP-0001.zh-CN.md)
- [Product manual / 产品手册](docs/BOUNDX-PRODUCT-MANUAL.md)
- [Producer adapter contract](docs/PRODUCER-ADAPTER-CONTRACT.md)
- [Semantic packs](domain-packs/README.md)
- [Quick start](QUICKSTART.md)
- [Validation](docs/VALIDATION.md)
- [Functions](docs/FUNCTIONS.md)

旧任务书、旧研究结果和旧实现说明可以保留为历史证据，但不得作为 BXP 0.4 当前产品定义的上位来源。

Historical taskbooks, experiment results, and implementation records may remain as evidence, but they are not authoritative for the current BXP 0.4 product definition.

---

## 最终原则 / Final principle

> **BoundX 不替 Agent 做决定。BoundX 先把 Agent 可以在哪个边界内做决定，变成可计算的事实。**
>
> **BoundX does not make decisions for the Agent. It first turns the boundary within which an Agent may decide into a computable fact.**
