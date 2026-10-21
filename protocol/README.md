# BXP — Boundary Xplain Protocol（边界分析协议）

本目录承载 BXP（边界分析协议）的协议草案、机器可读合同和一致性测试。界痕（BoundaryXP）是产品实现，不是协议名称。

This directory contains the BXP protocol drafts, machine-readable contracts and conformance evidence. BoundaryXP is the product implementation; BXP is the protocol.

## 当前版本 / Version status

| 层级 / Layer | 当前版本 / Current version | 状态 / Status |
|---|---|---|
| 协议规范 / Protocol specification | **BXP-0001 `0.4.0-draft.1`** | `DRAFT_FOR_REVIEW` |
| 0.4 实现状态 / 0.4 implementation | — | **`NOT_IMPLEMENTED`** |
| 当前产品 / Current product | `1.3.0-preview.0` | private preview |
| 当前已实现协议 / Implemented wire contract | BXP-0001 `0.3.0-draft.2` | implemented by current product |
| 当前计算套件 / Implemented calculation suite | `1.0.0-draft.3` | current 0.3 evidence |

**不要把协议草案版本与当前产品已实现版本混为一谈。** `0.4.0-draft.1` 已经是当前协议规范草案；当前 `1.3.0-preview.0` 产品仍实现 `0.3.0-draft.2`。在 Schema、Boundary Result、Operator Profile、conformance suite 和 Host Admission Gate 完成迁移之前，不得声明产品已经符合 0.4。

**Do not confuse the current specification draft with the currently implemented wire contract.** BXP `0.4.0-draft.1` is the current protocol specification draft, while product `1.3.0-preview.0` still implements `0.3.0-draft.2` with calculation suite `1.0.0-draft.3`.

## 协议主轴 / Normative chain

```math
\text{Task Semantics}
\rightarrow
IR_{7+1}
\rightarrow
\mathcal{M}(IR)
\rightarrow
\mathcal{B}
\rightarrow
Admission
```

其中 / Where:

- `IR₇₊₁`：任务语义的标准中间表示 / standard semantic IR;
- `𝓜(IR)`：Formal Boundary Model / 形式边界模型;
- `𝓑`：Boundary Result / 边界结果;
- `Admission`：正式任务强制准入 / mandatory formal-task admission.

7+1 不是最终边界；它存在是为了把任务语义送入形式化计算。Boundary Result 才是 BXP 的最终标准数据对象。

7+1 is not the protocol endpoint. It exists to carry task semantics into formalization and deterministic evaluation. The Boundary Result is the final standard BXP data object.

## 边界与准入 / Boundary and admission

BXP 把任务边界理解为一个由约束定义的可行解空间：

```math
\Omega_{\mathcal{B}}
=
\{x\in\mathcal{X}_{\Sigma}\mid\chi_{\mathcal{M}}(x)=true\}
```

正式任务只有在完整准入谓词成立时才能发布：

```math
Admit(T_v)=
ProtocolValid(T_v)
\land BoundaryDetermined(T_v)
\land ReleaseConditions(T_v)
\land VersionBound(T_v)
```

因此：

```math
AllBucketsNonEmpty
\not\Rightarrow
Admit(T_v)
```

7+1 填满不等于边界确定，也不等于准入通过。

For formal tasks, BXP Admission is a mandatory contract, not an optional advisory check. Drafts may remain incomplete for analysis and revision. A Host MUST fail closed when admission fails, is stale or cannot be computed.

## 当前文件 / Files

- [BXP-0001 English specification](BXP-0001.md)：**`0.4.0-draft.1`** normative review draft.
- [BXP-0001 中文规范](BXP-0001.zh-CN.md)：**`0.4.0-draft.1`** 中文评审版；发生差异时以英文草案为准。
- [任务 IR Schema](schemas/boundx-task-v1.schema.json)：当前仍对应 `0.3.0-draft.2` 实现合同。
- [结果 Schema](schemas/boundx-result-v1.schema.json)：当前仍对应 0.3 结果合同，尚未完成 0.4 Boundary Result / Admission 迁移。
- [BXP-CALC suite schema](schemas/boundx-calc-conformance-suite-v1.schema.json) 与 [208 条冻结向量](conformance/bxp-calc-v1.0.json)：属于现有 0.3 / `1.0.0-draft.3` 计算证据，不是 0.4 符合性证明。
- [IMPLEMENTATION.md](IMPLEMENTATION.md)：当前实现状态与限制。
- [benchmarks/README.md](benchmarks/README.md)：自然语言抽取评测候选。
- [PROVENANCE.md](PROVENANCE.md)：数字来源、摘要与取证边界。

## 0.4 核心定义 / Core definition

```math
\boxed{
IR_{7+1}
\rightarrow
\mathcal{M}(IR)
\rightarrow
\mathcal{B}
\rightarrow
Admission
}
```

- 7+1 是为了形式化 / 7+1 serves formalization.
- 形式化是为了确定性计算 / Formalization serves deterministic evaluation.
- 确定性计算是为了 Boundary Result / Evaluation produces the Boundary Result.
- Boundary Result 是为了形成准确、可参照、可交换、可冻结、可重放的边界基线 / The Boundary Result is the precise, referenceable, exchangeable, freezable and replayable boundary baseline.
- Admission 保证任何正式任务在进入后续流程前必须满足该边界契约 / Admission ensures that no formal task enters the downstream lifecycle without satisfying that boundary contract.

## 状态边界 / Status boundary

```yaml
protocol: BXP-0001
specification_version: 0.4.0-draft.1
specification_status: DRAFT_FOR_REVIEW
implementation_status: NOT_IMPLEMENTED
current_product: 1.3.0-preview.0
implemented_protocol: 0.3.0-draft.2
implemented_calc_suite: 1.0.0-draft.3
publication_authorized: false
standard_claim_authorized: false
certification_authorized: false
```
