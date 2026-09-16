<p align="center">
  <strong>English</strong> · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/v1/BoundX_Logo_EN_white.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/branding/v1/BoundX_Logo_EN_transparent.png">
    <img src="assets/branding/v1/BoundX_Logo_EN_transparent.png" alt="BoundX" width="460">
  </picture>
</p>

<p align="center"><strong>Clarify task boundaries before execution.</strong></p>

<p align="center">
  <img alt="BXP" src="https://img.shields.io/badge/BXP-0.4.0--draft.1-4c6ef5">
  <img alt="Product" src="https://img.shields.io/badge/BoundX-1.3.0--preview.0-7950f2">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2f9e44">
  <img alt="Local first" src="https://img.shields.io/badge/Architecture-Local--first-0b7285">
  <img alt="Status" src="https://img.shields.io/badge/Status-Research%20Preview-f08c00">
</p>

---

## What is BoundX?

**BoundX is the product implementation of BXP — Boundary Xplain Protocol.**

It transforms natural-language tasks into **computable, replayable, and verifiable formal boundaries**, then produces a standardized **Boundary Result** and **Admission** before a formal task enters an Agent planning or execution lifecycle.

BoundX is not another Agent framework, not an authorization system, and not a prompt layer that asks a model to guess the most likely boundary.

> **BoundX does not make decisions for an Agent. It makes the space in which an Agent may decide computable.**

## Why BoundX?

Natural-language tasks routinely mix objects, actions, responsible parties, time limits, versions, completion conditions, and prohibitions. The dangerous case is not only that a model misunderstands a task. It is that:

> **The boundary is still ambiguous, incomplete, or contradictory, while the system has already treated the task as determined.**

The core principle is:

```math
Ambiguity \not\Rightarrow Guess
```

If an ambiguity changes the canonical boundary:

```math
BoundaryRelevantAmbiguity
\Rightarrow
BoundaryState=underdetermined
```

BoundX does not silently choose a likely interpretation. It exposes what remains unresolved.

## BXP 0.4: from language to a deterministic boundary

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

| Layer | Purpose |
|---|---|
| **Task Semantics** | Source natural-language task and allowed context |
| **IR 7+1** | Standard semantic intermediate representation |
| **Formal Boundary Model** | Compiles semantics into computable constraints |
| **Boundary Result** | Produces the canonical boundary object and state |
| **Admission** | Determines whether a formal task may enter the downstream lifecycle |
| **Downstream Conformance** | Checks whether PM / Agent plans and subtasks remain inside the frozen parent boundary |

### 7+1 is semantic IR, not the final boundary

```math
IR_{7+1}=(I,O,A,P,R,V,C,B)
```

| Field | Meaning |
|---|---|
| **I — Input** | Inputs, objects, scope |
| **O — Output** | Deliverables and outcomes |
| **A — Action** | Actions |
| **P — Participants** | Participants and responsible parties |
| **R — Resource** | Time, amount, capacity, quota, and other resource constraints |
| **V — Version / Provenance** | Version, basis, and provenance |
| **C — Completion** | Completion and stopping conditions |
| **B — Boundary** | Explicit prohibitions |

Every semantic element preserves an explicit state: `resolved`, `unresolved`, or `absent`.

```math
AllBucketsNonEmpty
\not\Rightarrow
BoundaryDetermined
```

## Formal Boundary Model

BXP 0.4 compiles the semantic IR into a formal boundary model:

```math
\mathcal{M}(IR)
=
(E,\Sigma,Q,F,K,R_{cal},D,\Phi)
```

The model may represent entities and artifacts, scopes, required outcomes and obligations, forbidden actions and states, completion conditions, identity and relation facts, dependencies and provenance, plus numeric, set, logical, temporal, ordering, and cardinality constraints.

The Formalizer must be versioned and replayable, and it must **never invent unknown facts**.

## Boundary Result

BXP 0.4 defines four canonical boundary states:

| State | Meaning |
|---|---|
| `determined` | Required facts are resolved and the canonical boundary is unique and consistent |
| `underdetermined` | Information is missing or multiple source-supported interpretations produce materially different boundaries |
| `inconsistent` | The requirements are understood, but the formal constraints contradict each other |
| `invalid` | The input, evidence, schema, reference, or formal expression is itself invalid |

BoundX does not search for a single implementation. It computes the allowed solution space:

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

A boundary can therefore be determined while multiple valid implementation plans remain available to the PM or Agent.

## Admission: the formal task gate

A formal task is not releasable merely because its 7+1 representation is populated.

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

If Admission fails, is stale, or cannot be computed:

```math
Admission=blocked
\Rightarrow
Release=blocked
```

A Host must fail closed. A green UI state, a model opinion, or stale cached data cannot override the current Admission result.

The following remain permanently separate:

```text
business_decision = null
execution_authorization = null
```

**Admission is not a business decision and is not execution authorization.**

## BoundX and the PM / Agent

```text
ADMIN task
    ↓
  BoundX
    ↓
determine and freeze the parent boundary
    ↓
    PM
    ↓
understand, plan, decompose
    ↓
  BoundX
    ↓
check downstream conformance
```

> **BoundX determines the solution space; the PM plans inside it.**

BoundX does not replace the PM. The PM also cannot silently expand the frozen parent boundary.

## Producers: replaceable models, stable BXP

Natural language reaches BXP through a Producer. The current research tracks are:

| Producer | Role |
|---|---|
| **LLM** | High-capability semantic reference route; especially useful for testing complex semantics and unsupported completion |
| **spaCy Local NLP** | Local NLP commercial-candidate route; model and data licenses are verified separately |
| **HanLP Local NLP** | Chinese NLP research/comparison route; remains research-only until the exact model license permits broader use |

Responsibilities are separated:

```text
LLM / NLP      → recognition
BXP / 7+1      → normalization
Formalizer     → formalization
Boundary Core  → deterministic evaluation
Host           → Admission Gate enforcement
```

**The Gold Oracle is not a fourth Producer.**

## L0 / L1 / L2 / L3

| Layer | Current definition |
|---|---|
| **L0 — BXP Core** | Evidence, Formal Model, Operator, Boundary Result, Admission, Canonicalization, Version Binding |
| **L1 — Core Ontology** | `core-ontology@1.1.0` |
| **L2 — Industry Semantic Pack** | Current software/AI pack: `software-ai@0.2.0` |
| **L3 — Enterprise Semantic Layer** | Enterprise identity, organization, job, grade, explicit authority, delegation, policy, time, and scope facts |

A central Enterprise L3 invariant is:

```math
Identity
\neq
JobTitle
\neq
Grade
\neq
Authority
```

Authority must be supported by explicit facts:

```math
Authority(e,a,s,t)
\iff
ExplicitAuthorityBinding(e,a,s,t)
\lor
ValidDelegation(e,a,s,t)
```

A job title, grade, or manager relationship does not automatically imply approval authority.

## Five-minute local start

> These commands are current repository entry points. The complete BXP 0.4 Wire Contract is still under implementation, so current runtime output must not be represented as BXP 0.4 conformance evidence.

Requires Node.js `>=22.18.0`.

```bash
git clone https://github.com/joinwell52-AI/BoundX.git
cd BoundX
npm ci
npm run ui
```

Inspect the currently implemented protocol information:

```bash
node cli.mjs protocol-info
```

Evaluate an existing structured example:

```bash
node cli.mjs evaluate examples/bxp/en-complete.json
```

Run local tests:

```bash
npm test
npm run test:ui
npm run test:docs
```

Legacy interfaces remain under an explicit `legacy` namespace; old inputs are never silently upgraded to a new protocol version. See [QUICKSTART.md](QUICKSTART.md) for details.

## Gold and research baseline

BXP 0.4 research evaluation starts from a new baseline:

```text
Core Gold 100
+
L3 Gold 100
=
200 cases
```

These 200 cases are a development and conformance benchmark. A separate sealed holdout is required for final paper-level generalization claims.

Primary benchmark:

```math
200\times3=600
```

Stability benchmark:

```math
200\times3\times3=1800
```

In addition to Precision / Recall / F1, BoundX tracks two protocol-level failure rates.

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

Legacy 0.3 tests and earlier experiments remain historical regression/evidence only; their prior accuracy claims are not inherited by the new 0.4 research baseline.

## Current status

> **Product Definition is not the same thing as Current Implementation Status.**

| Item | Current status |
|---|---|
| Product | `1.3.0-preview.0` |
| Current protocol specification | BXP-0001 `0.4.0-draft.1` |
| Implemented wire contract | BXP `0.3.0-draft.2` |
| Implemented calculation suite | `1.0.0-draft.3` |
| BXP 0.4 implementation | `IN_PROGRESS` |
| L1 | `core-ontology@1.1.0` |
| L2 | `software-ai@0.2.0` |
| Enterprise L3 Profile v2 | target contract, implementation in progress |
| Gold | Core 100 + L3 100, pending formal freeze |
| Official three-route metrics | not published |
| Repository license | MIT |
| Repository visibility | private today |
| Product direction | open source |
| npm / PyPI / standalone installer | not published |

The current 0.3 implementation must not be relabeled as BXP 0.4.

## Local-first

BXP 0.4 development, testing, Gold evaluation, benchmarking, research evidence, and final acceptance are designed to complete locally in:

```text
D:\boundx
```

They do not depend on GitHub Actions, Artifacts, or Codespaces. GitHub quota exhaustion is not a valid reason to block local development or acceptance.

## Open-source direction

BoundX is intended to become open source. The planned public core includes:

```text
BXP specification
BoundX deterministic Core
Formal Boundary Model
Boundary Result
Admission
Schemas
L1
public L2 packs
virtual L3
Gold benchmark
Benchmark harness
Producer adapter interfaces
CLI / MCP foundations
research methods and metrics
```

Real customer L3 data, employee records, customer policies, credentials, private connection configuration, trade secrets, and model weights without redistribution rights do not belong in the public repository.

The repository currently uses the **MIT License**. Engine, model, dictionary, dataset, and dependency licenses must be verified independently.

## Documentation

- [Product Manual](docs/BOUNDX-PRODUCT-MANUAL.md)
- [Boundary Calculation Method](docs/BOUNDARY-CALCULATION-METHOD.md)
- [BXP 0.4 English Specification](protocol/BXP-0001.md)
- [BXP 0.4 Chinese Specification](protocol/BXP-0001.zh-CN.md)
- [Protocol index](protocol/README.md)
- [Quick Start](QUICKSTART.md)
- [Functions and delivery status](docs/FUNCTIONS.md)
- [Producer Adapter Contract](docs/PRODUCER-ADAPTER-CONTRACT.md)
- [Enterprise L3](docs/L3-EMPLOYEE-DIRECTORY-GUIDE.md)
- [Validation and research metrics](docs/VALIDATION.md)
- [BXP 0.4 local development taskbook v1.2](docs/tasks/BXP-PRODUCER-BENCHMARK-DEVELOPMENT-TASKBOOK-v1.2-LOCAL.md)

## Brand assets

Approved product assets live under [`assets/branding/v1/`](assets/branding/v1/):

- `BoundX_Logo_EN_transparent.png` — icon + BoundX
- `BoundX_Logo_CN_JieHen_transparent.png` — icon + 界痕
- `BoundX_Icon_transparent.png` — icon only
- `BoundX_Icon_512_transparent.png` — GitHub / app icon
- matching white-background variants and the complete logo pack

---

> **Clarify task boundaries before execution.**