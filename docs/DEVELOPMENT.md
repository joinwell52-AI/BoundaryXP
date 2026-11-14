# 资料维护指南 / Documentation maintenance

本仓库维护论文、协议和研究展示资料，不承担私有工作台源码构建。2026-11-14同步首次npm发行的MCP说明及编译包Release附件，入口为[MCP指南](mcp/README.md)；源码开发仍在私有boundaryxp-code。请先阅读[维护规则](../AGENTS.md)与[当前任务](tasks/7plus1/CURRENT-TASK.md)。

当前私有工作台说明按B335维护：[中文升级日志](../CHANGELOG.zh-CN.md) · [English changelog](../CHANGELOG.md)。补录历史升级须核对原始证据，区分当时的测试与本次文档检查；公开内容仅保留日期、行为、版本身份和脱敏验证摘要。

在隔离目录修改文档，逐项检查差异、链接、来源和范围。核对受保护的论文与协议基线文件集合及摘要。研究核验脚本按其自身README的声明范围使用；不要把历史命令自动当作本次授权。检查均在本地执行，不触发CI，不运行模型，不接触58618。

The repository maintains research material, protocol documentation and independent MCP product guides. Compiled packages are published on npm and mirrored in GitHub Releases; private implementation/build sources remain in boundaryxp-code. Validate changed links, provenance, scope and protected-file digests in an isolated checkout. Follow each research verifier's declared scope; do not resume historical experiments or model calls from old documents.
