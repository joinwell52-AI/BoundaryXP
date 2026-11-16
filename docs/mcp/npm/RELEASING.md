# npm发行流程 / npm release procedure

本轮发行版本为`boundaryxp-mcp@0.4.0-rc.9`，仍属于rc预发行系列，不宣称稳定版0.4.0。2026-11-16用户明确授权发布npm并同步公开产品仓库；不替换其现有安装或任务。保持MIT、仅交付编译核心，不交付核心源码。源码仓库保持私有。本轮21工具/17资源；从rc.8升级使用新版安装器处理旧自检固定18工具的过渡限制。发布是否成功以注册表与公开下载回执为准。

1. 从固定B-335原生运行包构建，保留runtime manifest和Core摘要。拒绝原始JavaScript Core、C++源码、调试符号、客户任务和凭据。
2. 生成准确的package.json、锁文件、DELIVERY-MANIFEST和双语安装说明；版本或文件有变化必须形成新候选，不能替换旧rc.2档案。
3. `npm pack --ignore-scripts --json`后逐文件核对，记录SHA-256/SHA-512，运行公开包检查及凭据扫描。
4. 本地执行适配器回归、真实tgz新装、旧命名包升级/回退、生成配置的stdio调用和HTTP检查。未变Core的历史计算证据按摘要复用，不冒称新的模型分析或IDE界面测试。
5. 用npm凭据核对账号和目标包权限，再进行`npm publish <exact.tgz> --access public --tag next --ignore-scripts`。凭据只通过环境变量注入发布进程；不进入归档、stdout或Git。
6. 发布后匿名查询registry版本/摘要，下载同版包核对字节，再从npm完成安装和工作台验收，记录最终dist-tag。同步产品仓库的安装说明和发行资产，不同步私有工程源码。

All gates run locally; no GitHub Actions. This document specifies a procedure and is not proof of publication. Registry receipts establish actual publication. Exact dependencies retain their own licenses; the product uses MIT as explicitly selected by its owner. The npm package contains compiled Core plus readable adapter/UI/resources.

The BoundaryXP product repository is now public by its owner's decision. Implementation source remains in the separate private boundaryxp-code repository. Publication status does not attest to the resolution of older GitHub cache/reference audit items.
