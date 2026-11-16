# 使用指南 / User guide

BoundaryXP MCP 0.4.0-rc.9 / B-335，Windows x64，rc预发行系列。核心随包原生编译，无需客户另外安装58618。

- [安装、Cursor/Codex接入、API配置、用例、升级回滚及排障 / Installation and operations](../INSTALL.md)
- [21工具中文与英文说明 / Bilingual tool reference](TOOLS.md)
- [L2/L3自定义字典规范、上传与示例](DICTIONARIES.zh-CN.md)
- [Custom L2/L3 format, import and examples](DICTIONARIES.md)
- [自动更新 / Automatic updates](../AUTO-UPDATE.md)
- [中文多DEV案例](../examples/multi-dev-2.md) · [English multi-DEV example](../examples/multi-dev-2.en.md)
- [输入输出合同 / Contract](../CONTRACT.md)
- [版本记录 / Changes](../CHANGELOG.md)
- [依赖与许可 / Notices](../THIRD-PARTY-NOTICES.md)

在宿主中调用bx_capabilities并指定language为zh-CN或en、help_topic为tools/examples/troubleshooting，即可直接通过MCP阅读帮助，不必读取本地文件。Call bx_capabilities for built-in bilingual help; no model request is made.
