# Cursor接入 / Cursor connection

在原页面 `/legacy` 的模型设置选择 **Cursor SDK**，点击“读取Cursor可用模型”，选择模型，然后测试连接。通过后，使用顶部标准BXP面板抽取和计算。自定义API入口仍独立保留；Codex通道尚未实现，不提供虚假的可选项。

Select **Cursor SDK** in the existing model settings, load the available catalog, select a model and test the connection. Then use the standard BXP panel. Custom API transport remains separate; Codex is not implemented here.

新运行目录首次打开产品Host时默认安装并启用内置L1；显式停用已有L1不会在重启后被覆盖。CLI `pack`管理操作仍保持“导入不等于启用”，不隐式激活。页面自动加载本地包；旧规则工具收进默认折叠的研究区，不作为模型抽取的替代结果。

On first product-host startup, an empty registry receives the bundled active L1. Explicit deactivation is preserved across restart. CLI `pack` management retains import-without-activation semantics. The page loads packages automatically and keeps deprecated rule controls in a collapsed research section.

密钥使用页面内存中的输入，或服务器环境变量 `CURSOR_API_KEY`。服务器密钥不会返回浏览器，不保存到源码。正式启动不得依赖其他项目目录；开发会话可经用户授权临时注入环境变量，进程结束即失效。

The key comes from page memory or the server environment. Never commit credentials. Production startup must not depend on another repository. An explicitly authorized development process may receive an ephemeral environment credential.

独立Cursor会话在临时空目录运行，`tools: []`，禁用MCP、子任务与shell；只生产文本候选，再经现有严格候选校验和唯一BXP Core计算。模型目录读取上限20秒，单次生成上限180秒；取消会解除等待，并关闭会话，迟到的句柄执行清理。准备快照与SDK运行记录的存储机制不同；不保证SDK不会在其自身存储中保留会话记录。调用可能产生模型费用，不自动回退为规则抽取。

An isolated Cursor session uses an empty temporary workspace with no built-in tools and MCP/task/shell disabled. Text candidates enter the existing validator and sole Core. SDK session storage is distinct from BoundX prepared snapshots; SDK records may persist in its own storage. Calls may incur model usage charges; no rule-extraction fallback is used.

主面板可显式选择已启用L3；服务器未设置 `BOUNDX_ALLOW_L3_DISCLOSURE=1` 时，整个模型请求在准备阶段拒绝，不静默忽略名册后继续生成。不要为真实员工数据随意开启外发；测试默认名册为虚构数据。仅披露命中身份，共享别名保留所有匹配。名册依赖的L2必须同时选择，依赖不匹配在模型调用前拒绝。

The model panel supports explicit active L3 selection. Without server authorization via `BOUNDX_ALLOW_L3_DISCLOSURE=1`, the request fails before sending to the provider instead of silently ignoring the directory. Only matched identities are disclosed; shared aliases retain all matches. Selected packages must include the directory's exact dependency closure. Authorization for real employee data must be handled explicitly.

依据：[Cursor TypeScript SDK](https://cursor.com/docs/sdk/typescript)。固定SDK版本1.0.30；undici覆盖为6.28.0以修复新增依赖审计告警，当前npm audit为0。

验证：本机真实模型目录及受保护HTTP入口返回39个模型；未执行真实生成验收。Core工作区287项（含并行行业测试）与UI154项通过；Cursor隔离、失败和取消为模拟SDK测试，不计入真实模型运行次数。模型目录可见不代表抽取质量合格。

Verification: the live catalog and guarded HTTP endpoint returned 39 models. Live generation acceptance remains pending. Workspace Core 287 and UI 154 tests passed, including concurrent industry tests. Mock SDK checks are not live runs or extraction-quality evidence.
