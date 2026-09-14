# 界痕双语界面指南 / Bilingual UI Guide

适用源码：`1.2.4-preview.1`。BoundX 当前为私有研发产品，请按 [快速开始](../QUICKSTART.md) 安装 Node.js 和 Python 依赖。

## 启动 / Start

在 `D:\boundx` 运行 `npm run ui`，或双击 `start-ui.cmd`。保持服务进程运行，通过它输出的本机地址使用；不要直接打开 `ui/index.html`。

## ADMIN 本地检查 / Local ADMIN checks

1. 粘贴中文或英文任务原文。
2. 点击“本地检查，给 ADMIN 建议”。
3. 核对原文证据、七要素与独立 B、计算结果和待澄清项。
4. 编辑建议后自行决定是否使用；任务变化后重新检查。

此路径调用本机 Python，不需要模型密钥，不自动启动 PM，不作业务批准。未识别不等于原文未声明，未明确项不自动补齐。

## PM 辅助 / Optional PM assistance

PM 有独立输入，可使用自行配置的模型生成拟议规划和回应。模型调用可能产生费用，必须与 ADMIN 本地检查区分。规划变化、回复或提醒减少不等于执行授权或问题已解决。

完整操作见 [任务建议与 PM 流程](UI-ADVICE.md)。

## 语言与隐私 / Language and privacy

在界面选择中文或 English；显示语言可以改变，原文和证据不能被翻译覆盖。密钥仅用于显式配置的模型功能，不应写进任务原文、导出文件或日志。

ADMIN runs locally without model calls. PM model assistance is optional. Switching the display language preserves original evidence. Suggestions do not authorize execution.

[产品功能](FUNCTIONS.md) · [分解接口](DECOMPOSITION.md) · [当前验证](VALIDATION.md)
