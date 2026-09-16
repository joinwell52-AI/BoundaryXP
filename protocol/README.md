# BXP — Boundary Xplain Protocol（边界分析协议）

本目录承载 BXP（边界分析协议）的协议草案、机器可读合同和一致性测试。界痕（BoundX）是产品实现，不是协议名称。

当前修订草案为 **BXP-0001 `0.4.0-draft.1`**。本版重新明确协议主轴：

```math
\text{Task Semantics}
\rightarrow
IR_{7+1}
\rightarrow
Formal Boundary Model
\rightarrow
Boundary Result
\rightarrow
Admission
```

其中：

- 7+1 是任务语义的标准中间表示，不是最终边界；
- Formal Boundary Model 是可计算的形式模型；
- Boundary Result 是 BXP 最终标准数据对象；
- 对正式任务，BXP Admission 是强制准入契约，不是可选检查；
- 草稿可以分析和修订，但未通过准入的任务不得进入正式规划或执行生命周期；
- ADMIN 或其他权威来源修改任务后，旧准入失效，必须重新核验；
- Producer／NLP／模型负责提出语义候选，BXP 负责验证、形式化和计算，Host 负责 fail-closed 强制拦截；
- Admission 不等于业务批准或执行授权。

## 当前文件

- [BXP-0001 英文规范](BXP-0001.md)：`0.4.0-draft.1` 规范性评审草案。
- [BXP-0001 中文译本](BXP-0001.zh-CN.md)：中文评审版；发生差异时以英文草案为准。
- [任务 IR Schema](schemas/boundx-task-v1.schema.json)：当前仍对应既有 `0.3.0-draft.2` 实现合同，尚未迁移到 0.4。
- [计算结果 Schema](schemas/boundx-result-v1.schema.json)：当前仍是既有结果合同，尚未加入 0.4 所需完整 Boundary Result / Admission 身份。
- [BXP-CALC 套件 Schema](schemas/boundx-calc-conformance-suite-v1.schema.json) 与 [208 条冻结向量](conformance/bxp-calc-v1.0.json)：属于既有 0.3 计算合同证据，不得直接视为 0.4 符合性证明。
- [生产实现说明](IMPLEMENTATION.md)：当前实现状态与限制。
- [自然语言抽取基准候选](benchmarks/README.md)：抽取评测与计算符合性分层治理。
- [数字来源与取证边界](PROVENANCE.md)：哈希清单、稳定编号与私有挑战集的合规约束。

## 0.4 的协议核心

BXP 的稳定核心不是 7+1 本身，也不是区间、集合、依赖图或布尔逻辑中的任何一种算法。

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

- `IR_{7+1}`：语义承载层；
- `\mathcal{M}(IR)`：Formal Boundary Model；
- `\mathcal{B}`：Boundary Result；
- `Admission`：正式任务发布准入。

Boundary Result 的目标性质包括：准确（不伪造确定性）、可参照、可交换、可冻结、可重放。

## 状态边界

```yaml
protocol: BXP-0001
version: 0.4.0-draft.1
status: DRAFT_FOR_REVIEW
implementation_status: NOT_IMPLEMENTED
publication_authorized: false
standard_claim_authorized: false
certification_authorized: false
```

`0.4.0-draft.1` 目前是协议修订草案。与其匹配的 Schema、Operator Profile、一致性套件、正式发布记录和 Host Admission Gate 尚未完成版本迁移，因此当前实现不得声明已经符合 0.4。

既有 `0.3.0-draft.2` 仍保留为历史实现合同与证据，不得只修改版本号后冒充 0.4。