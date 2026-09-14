# BoundX 快速开始 / Quick Start

私有源码 preview `1.3.0-preview.0`；未发布 npm/PyPI 或 Release。 / Private source preview, not a published package.

## 1. 安装与计算 / Install and evaluate

Node.js 22.18+，在 `D:\boundx` 运行：

```text
npm ci
node cli.mjs evaluate examples/bxp/zh-CN-complete.json
node cli.mjs evaluate examples/bxp/en-unresolved.json
node cli.mjs protocol-info
```

输入为生产者提供的 `boundx-task/v1`，输出为 `boundx-result/v1`；不是把自然语言文本直接交给计算器。No model key or Python is needed for the canonical BXP path.

## 2. 本机 UI / Local UI

```text
npm run ui
```

也可运行 `start-ui.cmd`。保持进程运行，打开显示的 127.0.0.1 地址，导入或粘贴 [BXP 示例](examples/README.md)。不要直接打开 HTML。八桶显式三态；三个结果轴独立；原文不翻译覆盖。

Keep the server running and open its loopback URL. Import/paste producer IR; the UI calls the same local core as CLI/MCP. No extraction or model invocation occurs in the main page.

## 3. MCP / Agent

```text
npm run mcp
```

宿主显式配置 Node 运行 `mcp.mjs`。优先使用 `bx_evaluate_task`（完整 IR 直接作为 arguments）或 `bx_evaluate_task_json`（仅 `raw_json` 文本字段）。读取 `boundx://protocol-info` 以及资源列表中的精确 task/result Schema。No automatic registration, approval or task execution.

## 4. 可选研究依赖 / Optional research dependencies

Python 3.10+，仅旧研究功能与完整开发测试需要：

```text
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r python/requirements.txt
node cli.mjs legacy task examples/task.json
```

Linux/macOS 将路径改为 `.venv/bin/python`。旧界面位于 `/legacy`，旧 API 位于 `/api/legacy/`，均已弃用、不是 BXP。旧 PM 模型功能只有显式配置并调用时才会向选定服务发送任务；不要把它与 BXP 本地计算混淆。

## 5. 核对结果 / Inspect results

核对来源、码点、版本及发现；`absent` 要求补依据，`unresolved` 要求澄清解释。不要把完整或一致当成可执行。Both authority fields remain null; only the host and responsible people may decide what happens next.

[生产者指南](docs/AGENT-BXP-PRODUCER.md) · [UI](docs/UI-GUIDE.md) · [验证](docs/VALIDATION.md) · [首页](README.md)
