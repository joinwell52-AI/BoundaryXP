# 当前版本 / Current release: 0.4.0-rc.6

2026-11-14：npm首页使用英文正文，顶部提供“简体中文 / English”独立入口；中文产品介绍及两份完整安装指南分别维护，不逐段混排。仓库首页、MCP导航和旧guides入口同步。

[中文介绍](npm/README.zh-CN.md) · [English introduction](npm/README.md) · [中文安装](npm/INSTALL.zh-CN.md) · [English installation](npm/INSTALL.md) · [rc.6 Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.6)

- 包 SHA-256：`d243eeab864a99770dbf7258bc3b64df2d674ff31cdaa97871747e606fe3c1b2`，3,928,786 bytes，276个归档成员。
- 本地归档和npm新装均通过：18工具、10资源、两份中英多DEV导入、工作台HTTP 200，零模型调用。npm匿名下载与本地最终包逐字节一致。
- 四份语言文档与包内源文件一致，英文正文不混入中文段落；两份安装指南的命令块完全相同，9个公开文档目标均HTTP 200。
- 已实际打开npm rc.6，点击中文介绍、中文安装、English安装切换，并核对仓库双语首页。
- 仅文档和版本元数据改变，Core、运行资源、适配器执行逻辑及依赖身份与rc.5一致。未访问或更改58618、既有任务和配置。

The rc.6 documentation release provides separate English and Simplified Chinese product and installation pages. Exact-archive and public npm installation checks passed. The npm language link and both installation pages were opened in the browser. Runtime behavior is unchanged.

## 历史：0.4.0-rc.5

2026-11-14：按公开仓库的产品定义修正npm说明；恢复旧 `guides/README.md` 入口，使用完整公开链接，分清固定版本npx接入与管理安装自动更新。产品仓库现已公开，核心实现源码仍在独立私有源码仓库维护。

[npm产品页](https://www.npmjs.com/package/boundaryxp-mcp) · [rc.5 Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.5) · [目录状态](DISCOVERY.md)

- 包 SHA-256：`dc03511dc1e91d024e2ba17ba24f420b345224acc039541959fb45940e133c41`，274个归档成员。
- 本地归档新装、npm匿名下载字节核对、npm新装和stdio调用通过：18工具、10资源、两个中英多DEV示例、工作台HTTP 200、零模型调用。
- npm README 中10个不同的公开指南链接全部返回200；旧入口在浏览器中实际打开正常。
- Cursor插件清单变量替换后的真实 `npx.cmd` 入口启动通过，发现18工具、10资源并打开页面。此项是标准输入输出验收，不冒称Cursor市场已经上架或本轮做过新的IDE界面分析。
- 只有文档、package版本和锁文件根版本改变；Core、完整runtime、可执行适配器和依赖身份与rc.4相同。未修改既有任务、宿主配置或58618。

The documentation-only release aligns the npm introduction with the public product repository and repairs guide links. Public-registry installation, actual stdio entry points and the workbench passed isolated checks. Marketplace approval remains separate. Existing installations are not forcibly upgraded.

## 历史：0.4.0-rc.4

2026-11-14：重写npm中英文产品介绍，补齐7+1八个维度、父子任务与多个DEV案例、LLM判断和计算复核的关系、报告内容和使用流程；增加官方Registry身份与检索关键词。未改变B-335 Core、适配器运行逻辑、页面或依赖版本。

[npm产品页](https://www.npmjs.com/package/boundaryxp-mcp) · [rc.4 Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.4) · [目录收录](DISCOVERY.md)

- SHA-256：`d1be10f19090431352f5b92a55f093aad69b49dc74acb8528caa0ad417509643`。
- 从npm匿名下载与本地最终包完全一致；从npm重新安装及真实stdio验收通过，18工具、10资源、2份中英多DEV示例、页面HTTP 200、零模型调用。
- 浏览器已确认npm页面实际显示rc.4及新版7+1介绍。官方MCP Registry发布成功并已读回记录。
- 只改变README、安装/发布说明、CHANGELOG和包身份元数据；rc.3的升级回滚及模型/IDE证据按未变组件复用，不声称本次新增模型或Cursor界面验收。
- 既有任务、配置、失败记录和58618不变；六项附件包含编译包、指南、摘要、依赖、notices与脱敏验收。

The rc.4 release changes documentation and discovery metadata only. Core, executable adapter logic, runtime resources and dependency versions are unchanged. Public-registry installation and actual stdio calls passed; no new model analysis is claimed.

## 历史：首次npm发行 / First npm release

**boundaryxp-mcp 0.4.0-rc.3 · B-335 · 2026-11-14 · Windows x64 · MIT**

[npm公开安装入口](https://www.npmjs.com/package/boundaryxp-mcp) · [GitHub预发行](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.3) · [完整安装说明](npm/INSTALL.md)

这是首次npm发行。此前rc.2是本机及Cursor的内部测试包，不是此前npm版本。发布指定next渠道；registry首次发行后实际返回next和latest均指向0.4.0-rc.3，包版本仍明确标为预发行。This is the first npm release; earlier local rc.2 packages were internal tests.

## 包身份 / Identity

- 文件：`boundaryxp-mcp-0.4.0-rc.3.tgz`
- 大小：3,921,067 bytes；274个归档成员。
- SHA-256：`6b751dec9d690afb61b2627dda1e3d1baf59948c27a2719fb5dcf26f342a40aa`
- 原生Core：`e41e0dc3e853d2fc52425d4d660b9a91caea1a897ac756770520efd7ecfeee2c`
- Runtime manifest：`85b6324362c4ea94c41a529d85fab3567ecdedd6e7829941ea7b1785d5a2c3f9`

安装包不含核心C++和原JavaScript Core源码、账号、凭据或个人任务。接口、UI、提示词及必要资源仍可读。B-335核心及运行资源与此前验收版本完全一致。MIT许可保持不变，第三方组件各保留原许可。

## 实际验证 / Verification

- npm发布命令成功；等待registry处理完成后匿名下载，同本地验收tgz逐字节一致，SHA-512与registry一致。
- 从npm重新安装精确版本，通过真实managed安装及原生MCP自检；18工具、10资源、中英帮助、页面HTTP 200。
- 中英文完整任务分别导入，均保留一个父任务和两个DEV子任务；校验、保存新项目及读取列表成功，零模型请求。
- 本机rc.2测试包到最终rc.3的升级、连接保持、重新连接、回滚、篡改拒绝通过；8个测试任务文件及宿主/profile配置保持一致。
- 适配器回归51项：47通过、0失败、4个专用夹具项另行记录；本次执行真实安装及迁移。依赖审计零漏洞。
- Core、625案操作数对比、真实模型及Cursor/Codex界面历史证据按未变组件摘要复用；本次不冒称新的模型分析或IDE界面验收。

The exact public archive was anonymously downloaded and installed from npm, then exercised through native stdio calls and its HTTP workbench. This is engineering publication acceptance, not a new model-accuracy claim. Earlier immutable-component evidence is explicitly reused.

## 同步附件 / Assets

安装包、指南ZIP、SHA256SUMS、DEPENDENCIES、THIRD-PARTY-NOTICES、ACCEPTANCE共六个附件。GitHub仓库当前仍为私有，其可见性与npm公开包不同；不需要访问GitHub才能从npm安装。原论文Release及[rc.2内部测试记录](rc2/RELEASE.md)保留。

现有用户任务、配置和失败记录不作为测试目录；未访问或修改58618。未来切换GitHub公开可见性前仍需完成历史PR引用清理。
