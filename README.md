# 界痕 · BoundX

<p align="center"><img src="assets/branding/v1/BoundX_Logo_EN_white.png" alt="界痕 BoundX Logo" width="320"></p>

> 执行之前，先把任务边界算清楚。 / Clarify task boundaries before execution.

## 独立项目 / Standalone project

**协议名称：BXP — Boundary Xplain Protocol（边界分析协议）。** 界痕（BoundX）是产品实现，BXP 是协议；LLM、HanLP、spaCy 等只是语义 Producer 的不同实现方式，不改变 BXP 的协议语义。

**Protocol name: BXP — Boundary Xplain Protocol.** BoundX is the product implementation; BXP is the protocol. LLMs, HanLP, spaCy and other producer methods do not redefine the protocol semantics.

当前 BXP 协议规范草案为 **BXP-0001 `0.4.0-draft.1`**。其协议主轴是：

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
```

7+1 只是标准语义中间表示；Formal Boundary Model 才进入确定性计算；Boundary Result 是最终可参照、可交换、可冻结、可重放的边界对象；对正式任务，Admission 是强制准入契约。

BoundX 是独立的任务边界预检引擎。唯一目录 `D:\boundx`，私有仓库 [joinwell52-AI/BoundX](https://github.com/joinwell52-AI/BoundX)。产品版本为 `1.3.0-preview.0`。

**版本必须分层理解：**

- 当前协议规范草案：**BXP-0001 `0.4.0-draft.1`**；
- 当前产品 `1.3.0-preview.0` 已实现的线上协议合同：**BXP-0001 `0.3.0-draft.2`**；
- 当前已实现计算套件：**`1.0.0-draft.3`**；
- `0.4.0-draft.1` 当前标记为 **`NOT_IMPLEMENTED`**：对应 Schema、Boundary Result、Admission binding、conformance suite 与 Host fail-closed gate 尚未完成迁移，不得把现有 0.3 实现重新贴标签声称符合 0.4。

已有[私有 GitHub 源码预发布版](https://github.com/joinwell52-AI/BoundX/releases/tag/v1.3.0-preview.0)；无 npm/PyPI 分发、安装包或独立二进制，不代表正式认证；[LICENSE](LICENSE) 保持不变。

The current protocol specification draft is **BXP-0001 `0.4.0-draft.1`**. The existing product prerelease `1.3.0-preview.0` still implements the `0.3.0-draft.2` wire contract with calculation suite `1.0.0-draft.3`. The 0.4 protocol draft is **not yet implemented** in the schemas, Core, conformance suite or host admission gate. Product, protocol and suite versions are distinct. The repository remains private; its license is unchanged, and extraction is not certified.

发布标签 `v1.3.0-preview.0` 固定在 `9acb30f87b57b38223713b8c38614e72874e81cf`，不会移动。此后的协议和文档修订不进入该标签的源码归档；若要归档包含 0.4 实现，需另行完成迁移并发布新版本。

The existing tag and source archive are immutable snapshots. Later protocol and documentation changes apply to subsequent commits, not to that archive; an archive containing the 0.4 implementation requires a separately authorized new release.

## 立即运行 / Run now

Node.js 22.18+，在项目根目录运行。以下命令运行的是当前已实现的 `0.3.0-draft.2` 线上合同；不能据此声明 `0.4.0-draft.1` 已实现。

```text
npm ci
node cli.mjs evaluate examples/bxp/zh-CN-complete.json
node cli.mjs evaluate examples/bxp/en-complete.json
node cli.mjs protocol-info
npm run ui
```

The CLI reads strict UTF-8 JSON and emits the current implemented `boundx-result/v1`. Open the local URL printed by the UI server; paste or import these same task files. Python and model keys are not required for the canonical local BXP calculation path.

## 产品架构 / Architecture

### BXP 0.4 协议模型 / Protocol model

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

其中：

- `IR_{7+1}`：语义承载层；
- `\mathcal{M}(IR)`：Formal Boundary Model；
- `\mathcal{B}`：Boundary Result；
- `Admission`：正式任务强制准入。

对正式任务，BXP 不是可选检查：未满足准入条件不得进入正式规划或执行生命周期。草稿可以继续分析、澄清和修订；ADMIN 或其他权威来源修改任务后，旧准入必须失效并重新核验。模型或其他 Producer 提出候选，BXP 负责验证、形式化和计算，Host 负责 fail-closed 强制拦截。

### 当前 1.3.0-preview.0 已实现路径 / Current implemented path

`Agent / other producer → boundx-task/v1 (BXP 0.3.0-draft.2) → local BXP Core → boundx-result/v1 → host decision`

Agent、规则或其他生产者按 7+1 形成候选 IR；BoundX 本地执行 Schema、原文证据、来源摘要、语义不变量验证和确定性计算。Core 不调用模型、不访问网络、不自动加载制度 URL。Python/Lark、词库和提示词属于生产者方法，不定义协议；BXP-EXTRACT 仍为 RESERVED。

| 要素 / Element | 含义 / Meaning |
|---|---|
| I | 输入范围 / Input scope |
| O | 交付 / Deliverables |
| A | 动作 / Actions |
| P | 责任主体与角色分工 / Participants |
| R | 资源 / Resources |
| V | 版本依据 / Version and provenance |
| C | 完成停止 / Completion and stopping |
| B | 独立禁止边界 / Independent forbidden boundary |

每桶显式 `resolved / unresolved / absent`，不能默认填齐。证据为来源 ID、原文引文及 Unicode 码点 `[start,end)`，不是浏览器字符串代码单元。

Producers supply evidence-linked IR; local validation does not prove extraction correctness. Preserve unknowns and exact source text. The independent B bucket cannot be merged into A or R.

当前 0.3 实现独立输出 `validation / completeness / consistency`，以及 Profile、resolved elements、deficit、作用域下的既有计算结果。**这些现有结果不能冒充 0.4 的最终 Boundary Result 或 Admission。** `business_decision` 与 `execution_authorization` 始终 `null`。Host systems own clarification, approval and execution; 0.4 所要求的 Host Admission Gate 尚待实施。

## 唯一 Core 与入口 / Shared core and adapters

| 入口 / Entry | 当前能力 / Current capability |
|---|---|
| Node API | [src/index.ts](src/index.ts) 导出唯一 [src/bxp/index.mjs](src/bxp/index.mjs) |
| CLI | `bx evaluate <task.json>`、`bx protocol-info` |
| MCP | `bx_evaluate_task`、`bx_evaluate_task_json`；当前 Schema 和协议信息资源 |
| 本机 UI | 导入／粘贴当前 BXP IR；八桶、证据、三轴与计算；仅监听 127.0.0.1 |
| Legacy | 显式弃用命名空间，不属于 BXP 输入输出合同 |

```text
npm run mcp
node cli.mjs legacy task examples/task.json --locale=en
```

Legacy CLI 使用 `legacy task/plan/decomposition/responses`，MCP 工具使用 `bx_legacy_*`，旧研究 UI 为 `/legacy`。旧 API 函数仅从 [src/legacy/index.ts](src/legacy/index.ts) 导入；包主出口不再提供它们。不会静默转换旧对象。旧 Python 研究路径需另装依赖，见 [快速开始](QUICKSTART.md)。生产级多租户 HTTP、Python SDK、Pack 激活和插件产品仍未交付。

Invalid BXP inputs return the canonical invalid-result envelope, not a business failure or approval. CLI usage/I/O errors use stderr and nonzero exit. Legacy endpoints are explicitly deprecated; they are not certified BXP adapters.

## 文档 / Documentation

- [BXP 协议入口](protocol/README.md)：当前协议状态与 0.4/0.3 实现边界。
- [BXP-0001 English specification](protocol/BXP-0001.md)：当前规范性草案 `0.4.0-draft.1`。
- [BXP-0001 中文规范](protocol/BXP-0001.zh-CN.md)：中文评审版 `0.4.0-draft.1`。
- [实现与限制](protocol/IMPLEMENTATION.md)：当前产品实际支持合同；不得与 0.4 草案混同。
- [实施授权任务书（原字节归档）](docs/tasks/BoundX-BXP-product-alignment-taskbook-v1.md)：来自提交 `a2fb068565605c0ac83ad6d6d4a973941ee270c6`，是实施时的授权快照，不是当前协议状态。 / Original authorization snapshot, not current protocol status.
- [Agent 生产者指南（中英）](docs/AGENT-BXP-PRODUCER.md) · [示例索引](examples/README.md)。
- [ADMIN验收运行器 / Acceptance runner](docs/ADMIN-ACCEPTANCE-RUNNER.md)：离线计划与显式授权运行；模拟结果不替代真实模型验收。
- [金标草稿工作区 / Gold draft workspace](docs/ADMIN-GOLD-DRAFTS.md)：离线准备原文与包快照，检查人工候选；不自动认证金标。
- [产品手册](docs/BOUNDX-PRODUCT-MANUAL.md) · [功能](docs/FUNCTIONS.md) · [UI 指南](docs/UI-GUIDE.md) · [结果建议](docs/UI-ADVICE.md)。
- [语义包](domain-packs/README.md) · [产品与商业规划（非交付声明）](docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md)。
- [正式 Logo](assets/branding/README.md) · [版本](CHANGELOG.md) · [验证](docs/VALIDATION.md)。

## 验证 / Validation

```text
npm test
npm run test:ui
.venv\Scripts\python.exe -m unittest discover -s python -p "test_*.py"
npm run test:docs
```

完整开发验证需安装 Python 研究依赖。当前 208 条冻结结构化向量属于既有 `0.3.0-draft.2` / `1.0.0-draft.3` 计算合同证据，**不是 0.4 符合性向量**，也不是自然语言金标；测试通过不代表抽取准确率、业务许可、产品发布或第二独立实现互操作证明。Actual counts and CI evidence belong in the [execution receipt](docs/tasks/BXP-ALIGNMENT-RECEIPT.md).
