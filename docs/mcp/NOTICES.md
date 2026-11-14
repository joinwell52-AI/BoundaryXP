# MIT与编译包交付 / MIT and compiled delivery

用户在2026-11-14明确选择保留MIT许可并发布编译版MCP。完整安装包包括原生Core、适配器、UI和必要资源；核心C++及原JavaScript实现源码不交付。

The owner retained MIT for the first npm distribution. Source delivery and license permission are distinct. Native Core is shipped without original implementation source; adapter/UI and required resources remain readable.

[第三方依赖与许可说明](npm/THIRD-PARTY-NOTICES.md)。依赖保留各自许可证，Cursor API需自己的账号、密钥及服务权限。产品不提供模型权重或额度。

npm发布不会公开私有源码仓库，也不会改变BoundaryXP仓库可见性。历史PR引用清理仍须在未来将GitHub仓库改为公开前完成。[原内部测试说明](rc2/NOTICES.md)保留其历史阶段。
