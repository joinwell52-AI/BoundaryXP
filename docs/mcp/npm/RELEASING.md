# 编译包发行流程 / Compiled package release procedure

此文件描述流程，不作为某个版本已发布的证明。公开回执见 [产品发行记录](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/RELEASE.md)，目录、认领及审核状态见 [发现与审核记录](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/DISCOVERY.md)。维护者完整手册保存在私有源码仓库 `mcp/RELEASE-WORKFLOW.md`。

1. 固定产品快照、源清单和 Core 身份，分别构建 Windows、Linux 编译包；所有 Gate 本地执行。
2. 验证 MCP 合同、真实宿主案例、多子任务、L2/L3、双语报告、实际浏览器下载、旧版复制迁移及回滚。保留失败与历史记录；合成测试和响应重放明确标注。
3. 冻结最终 tgz，核对文件清单、SHA-256/integrity、依赖许可及源码/凭据排除范围。核心原始源码不交付；适配器、页面和资源可以读取。
4. 在已有授权范围内先发布 Linux 的 linux 渠道，再发布 Windows 的 next/latest；不覆盖已发布版本。匿名下载核对精确归档，再核对 npm 默认首页的版本和同页双语安装指南。
5. 更新官方 MCP Registry、公开产品说明和编译 Release 附件；同步 Glama、目录及现有 PR，逐项记录已生效、待审或缓存延迟，不以提交代替通过。
6. 发布不强制升级或重启现有客户端。管理安装按用户配置检查更新，安全启动时激活；原任务、字典、配置和独立工作台保留。

This is a procedure, not a publication receipt. Freeze and audit the exact archives, validate protocol and complete workflows on supported platforms, verify migration and rollback, and distinguish real host analysis from synthetic fixtures or saved-response replay. Publish immutable Linux and Windows packages to their separate channels, then anonymously verify downloaded bytes and the default npm page. Update the official Registry, public release assets and directory/PR records without claiming pending review as approval. Core implementation source remains private; readable adapters, UI and resources accompany the compiled module. Publication does not forcibly upgrade existing installations. The owner-selected MIT license and dependency licenses remain unchanged.
