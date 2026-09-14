# 界痕 · BoundX

<p align="center">
  <img src="assets/branding/v1/BoundX_Logo_EN_white.png" alt="界痕 BoundX Logo" width="320">
</p>

> **执行之前，先把任务边界算清楚。**
> Clarify task boundaries before execution.

## 独立项目 / Standalone project

BoundX 是独立的任务边界预检产品。唯一工作目录为 `D:\boundx`，仓库为 [joinwell52-AI/BoundX](https://github.com/joinwell52-AI/BoundX)，当前保持私有。

源码版本 `1.2.4-preview.1`；BXP-0001 `0.3.0-draft.2` 与 BXP-CALC `1.0.0-draft.3` 均为评审草案。当前没有 GitHub Release、npm/PyPI 分发包或正式认证。许可证以根目录 [LICENSE](LICENSE) 为准；AGPL 只是待确认的发布方案，尚未启用。

BoundX is an independent, private task-boundary preflight product. It is not yet publicly released or certified. The repository license is authoritative; a proposed license change is not effective.

## 产品边界 / Product boundary

| 要素 / Element | 含义 / Meaning |
|---|---|
| I | 输入范围 / Input scope |
| O | 交付结果 / Deliverables |
| A | 动作 / Actions |
| P | 责任主体与角色分工 / Participants |
| R | 资源 / Resources |
| V | 版本依据 / Version and provenance |
| C | 完成停止 / Completion and stop conditions |
| B | 独立禁止边界 / Independent forbidden boundary |

ADMIN 任务文本使用纯本地、确定性约束提取和 Python 计算，支持中文与英文，保留原文证据。未明确项保持未明确，不因模板、置信度或默认值自动补齐。PM 的可选模型辅助功能与 ADMIN 本地计算分开。

计算结果是可复核的建议，不是业务裁决或执行授权。BXP 的 `business_decision` 与 `execution_authorization` 始终为 `null`。宿主系统负责身份、审批、执行、记录和通知。

ADMIN processing is local and deterministic, with Chinese/English evidence-preserving extraction and Python calculations. Unknowns remain unknown. Optional model-assisted PM features are separate. Findings never grant execution authority.

## 独立仓库与源码运行

前提：Node.js 22.18+、Python 3.10+。在项目根目录运行：

```text
npm ci
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r python/requirements.txt
npm run ui
```

Linux/macOS 使用 `.venv/bin/python`。安装依赖后，ADMIN 本地检查不需要 API key，不调用远端模型。不要直接打开 `ui/index.html`。

[快速开始 / Quick start](QUICKSTART.md) · [双语界面指南](docs/UI-GUIDE.md) · [建议与操作流程](docs/UI-ADVICE.md)

## 当前接口 / Available interfaces

| 入口 | 当前能力与边界 |
|---|---|
| 本地 Web UI | ADMIN 本地检查、基线与规划比较、建议呈现；仅监听本机 |
| Python | 局部文法与数学计算；不是已发布的 PyPI SDK |
| CLI | `task / plan / decomposition / responses` |
| MCP | `bx_review_task / bx_review_plan / bx_review_decomposition / bx_check_responses` |
| BXP 参考计算器 | 严格 Schema、精确区间、类型集合、交接、前置图和同作用域布尔计算 |

产品 CLI/MCP/UI 与 BXP 参考对象接口尚未统一；不能把 BXP 任务 JSON 直接当作现有 CLI 输入。通用生产 HTTP Server、统一 Python SDK 和完整插件 SDK 仍是规划能力。

```text
node cli.mjs task examples/task.json --locale=zh-CN
node cli.mjs task examples/task.json --locale=en
node cli.mjs decomposition examples/decomposition-d044.json
npm run mcp
```

CLI 示例、字段及限制见 [任务分解计算手册](docs/DECOMPOSITION.md)、[核心数据结构](src/schemas.ts)；接口实现见 [src/index.ts](src/index.ts)。

## 文档 / Documentation

- [产品手册](docs/BOUNDX-PRODUCT-MANUAL.md)：产品形态、能力矩阵和授权边界。
- [产品与发布方案](docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md)：免费 Core、Packs、FDE 与未生效的发布计划。
- [BXP 协议入口](protocol/README.md) · [中文规范译本](protocol/BXP-0001.zh-CN.md) · [English specification](protocol/BXP-0001.md)。
- [协议实现说明](protocol/IMPLEMENTATION.md)：精确版本、结果合同和未实现边界。
- [语义包说明](domain-packs/README.md) · [软件与 AI 领域包](docs/SOFTWARE-AI-DOMAIN-PACK.md)。
- [产品功能](docs/FUNCTIONS.md) · [七参数示例](docs/SEVEN-PARAMETERS-EXAMPLE.md) · [数学与测试依据](docs/原理与测试依据.md)。
- [抽取技术依据](docs/RESEARCH-7PLUS1-EXTRACTION.md) · [中英文用例说明](docs/USER-CASES-019.md)。
- [正式 Logo 素材](assets/branding/README.md) · [命名](docs/NAMING.md) · [版本状态](CHANGELOG.md)。

## 验证 / Validation

```text
npm test
npm run test:ui
.venv\Scripts\python.exe -m unittest discover -s python -p "test_*.py"
npm run test:docs
```

[验证说明](docs/VALIDATION.md) 区分计算向量、产品回归与文档链接检查。测试通过不等于任意自然语言已被完整理解，不等于产品发布、业务批准或执行许可。
