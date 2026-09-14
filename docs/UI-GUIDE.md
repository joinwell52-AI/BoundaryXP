# 界痕双语界面指南 / Bilingual UI Guide

适用 `1.3.0-preview.0`，私有 preview。先按 [快速开始](../QUICKSTART.md) 安装 Node 依赖。

## 启动与输入 / Start and input

运行 `npm run ui`，保持进程运行，通过输出的本机地址打开页面。本页采用中英并列文案；原文不翻译、不归一化。不要直接打开 HTML。

1. 导入 UTF-8 JSON 或粘贴 Agent／其他生产者形成的 BXP IR。
2. 点击“本地验证与计算”。
3. 查看三轴与八桶三态，核对每条证据的来源、引文、码点范围。
4. 对照 Profile、已明确项、deficit、作用域、五类计算和 findings。
5. 在完整原始结果中核对协议 JSON；修改输入后重新计算。

The main page imports producer-generated IR and evaluates it locally. It does not call a model, infer missing fields, persist customer text or execute tasks. CLI, MCP and UI share the same core.

## 无效输入 / Invalid input

非法 UTF-8 文件不会填入编辑器。重复键、精度损失、超限、Schema 或证据不一致会显示 invalid 结果，而不是旧的成功状态；不会把未校验的任务显示成已明确的八桶。

## Legacy

`/legacy` 是显式弃用的旧研究界面，输出不符合 BXP；旧服务器端点只能通过 `/api/legacy/` 使用。Python/Lark 只提供有限覆盖研究检查。旧 PM 模型功能会向用户显式配置的服务发送任务，不属于主界面的本地计算路径。

## 权限 / Authority

建议不是业务裁决，结果不授予执行权。完整与一致不等于批准；`business_decision` 和 `execution_authorization` 始终 null。

[如何处理发现](UI-ADVICE.md) · [BXP 示例](../examples/README.md) · [验证](VALIDATION.md)
