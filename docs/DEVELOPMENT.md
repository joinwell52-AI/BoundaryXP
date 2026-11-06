# 资料维护指南 / Documentation maintenance

本仓库维护论文、协议和研究展示资料，不再承担私有工作台源码的构建与安装分发。请先阅读[维护规则](../AGENTS.md)与[当前任务](tasks/7plus1/CURRENT-TASK.md)。

在隔离目录修改文档，逐项检查差异、链接、来源和范围。核对受保护的论文与协议基线文件集合及摘要。研究核验脚本按其自身README的声明范围使用；不要把历史命令自动当作本次授权。检查均在本地执行，不触发CI，不运行模型，不接触58618。

The repository maintains research material and protocol documentation. It does not provide the private workbench build or installation workflow. Validate changed links, provenance, scope and protected-file digests in an isolated checkout. Follow each research verifier's declared scope; do not resume historical experiments or model calls from old documents.
