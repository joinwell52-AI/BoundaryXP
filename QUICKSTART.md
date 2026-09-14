# BoundX 快速开始 / Quick Start

当前使用方式为独立仓库源码运行，暂无可下载的正式 Release 或 npm/PyPI 包。

The supported setup is the standalone source checkout. No public release or package is currently available.

## 1. 安装 / Install

准备 Node.js 22.18+ 与 Python 3.10+，进入 `D:\boundx`：

```text
npm ci
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r python/requirements.txt
```

Linux/macOS 使用 `.venv/bin/python`。需要联网安装依赖；完成后 ADMIN 本地计算不调用模型或远端 API。

## 2. 启动 / Start

```text
npm run ui
```

也可以双击 `start-ui.cmd`。请保持启动进程运行，并使用它输出的本机地址。不要直接双击 `ui/index.html`。

详见 [界面指南](docs/UI-GUIDE.md)。ADMIN 可直接检查中文或英文任务；原文、未明确项和计算建议分别保留，不会自动批准或执行任务。

## 3. CLI 与 MCP / CLI and MCP

```text
node cli.mjs task examples/task.json --locale=zh-CN
node cli.mjs task examples/task.json --locale=en
node cli.mjs decomposition examples/decomposition-d044.json
npm run mcp
```

CLI 接收结构化示例，不是任意自然语言文本。MCP 通过标准输入输出服务，由调用宿主配置启动；不自动注册到其他应用，也不授予宿主权限。产品接口与 BXP 参考计算器的输入合同不同，见 [分解接口](docs/DECOMPOSITION.md) 和 [协议实现说明](protocol/IMPLEMENTATION.md)。

## 4. 核对结果 / Review results

- 明确区分原文证据、已计算冲突与未明确项。
- 建议不是授权；核对基线不是组织审批。
- 可选 PM 模型功能需要自行配置服务，不属于 ADMIN 本地计算。
- 文件变更后重新检查，不把上一次结果套用到新任务。

[产品首页](README.md) · [产品手册](docs/BOUNDX-PRODUCT-MANUAL.md) · [本地验证](docs/VALIDATION.md)
