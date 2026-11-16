# 在哪里查找 BoundaryXP？ / Discover BoundaryXP

发行入口与下述公开目录页面核对日期：2026-11-16；人工审核与旧 PR 记录保留各自日期。安装包分发、目录登记和人工审核分别记录。

## 当前安装入口 / Current installation

Linux 独立发行入口：[`0.4.0-rc.9-linux.1`](https://www.npmjs.com/package/boundaryxp-mcp/v/0.4.0-rc.9-linux.1)，npm `linux` 渠道；[中文安装](linux/INSTALL.zh-CN.md)、[English](linux/INSTALL.en.md)、[Dockerfile](../../Dockerfile)、[验收范围](linux/RELEASE.md)。Windows `latest/next` 继续为 rc.9，官方 Registry 现有 rc.9 登记不因这个 Linux 分支而覆盖。公开 Dockerfile 只下载编译包并验证摘要，不要求公开 Core 源码。

Glama 已于 2026-11-16 17:26（UTC+8）发布 `0.4.0-rc.9-linux.1`。平台构建测试 `01a1e3ab-bf33-7cd8-9dbc-a536b14fffb7` 为 `success`，耗时 1m 6.4s，固定公开提交 `8c1397d`；实际启动并发现 21 工具、17 资源，公开页已显示工具目录。仅使用 npm 编译包及固定 SHA-256，没有提交原始 Core 源码。此结果是构建和协议发现通过，不扩大为算法正确性认证或付费实例已开通。

Linux is distributed separately through the `linux` tag; Windows `latest/next` and the existing official Registry rc.9 entry remain intact. Glama's Linux release is published after a successful platform build and discovery of 21 tools / 17 resources. This is not an algorithm certification or a purchase of a hosted instance. Automatic Glama releases from future GitHub releases are disabled because this build pins a Linux archive and Windows releases use a different channel.

当前发行版为 **0.4.0-rc.9（预发行版）/ B-335**。客户可直接使用 [npm 默认首页](https://www.npmjs.com/package/boundaryxp-mcp)：[简体中文](https://www.npmjs.com/package/boundaryxp-mcp#简体中文) / [English](https://www.npmjs.com/package/boundaryxp-mcp#english)，以及 [中文安装与升级](https://www.npmjs.com/package/boundaryxp-mcp#中文安装与升级) / [Installation and upgrades](https://www.npmjs.com/package/boundaryxp-mcp#installation-and-upgrades)。四个入口均在 npm 同页，不以 GitHub 跳转作为语言或安装入口。

官方目录可[搜索 BoundaryXP](https://registry.modelcontextprotocol.io/?q=boundaryxp)。[最新版 API](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.joinwell52-AI%2Fboundaryxp/versions/latest)返回服务器版本和 npm 包版本均为 rc.9，状态 active、isLatest=true。历史版本保留，不删除旧登记。

English and Chinese product descriptions and complete setup guides are available on the same npm page. The official Registry search and latest API were checked against rc.9. Pending directory applications below are not live installation listings.

rc.9 新增自定义 L2/L3 字典格式、校验、导入与页面入口，现为 21 个工具、17 个资源。rc.8 需一次性使用新版 bootstrap 升级；旧任务和字典不删除。见 npm 同页升级指南。目录收录不代表第三方已重新核验 rc.9。

rc.9 provides 21 tools and 17 resources, including custom L2/L3 format, validation and import. rc.8 requires the rc.9 bootstrap once; retain existing tasks and dictionaries. See npm's in-page upgrade guide. Directory approval does not imply a new third-party audit of rc.9.

## 已公开可查 / Public listings checked

| 入口 / Entry | 2026-11-16 页面事实 / Observed state |
|---|---|
| [TensorBlock PR #5989](https://github.com/TensorBlock/awesome-mcp-servers/pull/5989) | 2026-11-15 已合并到 main；收录内容仍为 rc.7。[rc.9 更新 PR #6087](https://github.com/TensorBlock/awesome-mcp-servers/pull/6087)已提交，尚未合并。rc.7 is merged; the rc.9 update is pending review. |
| [MCPServers 中文](https://mcpservers.org/zh-CN/servers/www-npmjs-com-package-boundaryxp-mcp) / [English entry](https://mcpservers.org/servers/www-npmjs-com-package-boundaryxp-mcp) | 已有 npm 按钮、仓库链接和文档；仍为 rc.8 / 18 工具 / 10 资源。11 月 16 日点击“请求更新”，页面返回“已请求”，尚未核实刷新为 rc.9。Documentation refresh requested; current displayed metadata remains rc.8. |
| [Serverdex](https://serverdex.io/server/io-github-joinwell52-ai-boundaryxp) | active，提供 npm 和仓库链接；缓存版本 rc.8，自动配置片段省略必填 `--data-root`，不能作为完整安装示例。Live, with a stale rc.8 snippet missing the required data path; use our installation guide. |
| [Glama](https://glama.ai/mcp/servers/joinwell52-AI/BoundaryXP) | Linux `0.4.0-rc.9-linux.1` 已发布；构建通过，21 工具和 17 资源发现通过，公开页可查 21 工具。Published Linux release; platform build and tool/resource discovery passed. |
| [MCPwell 分类页](https://mcpwell.com/categories/productivity/) | Productivity 分类中曾核实 BoundaryXP 条目和仓库链接；此链接不是 BXP 专属详情页，需在目录内查找，不作为直达安装入口。Category page only, not a verified BXP-specific detail URL. |
| [ToolCenter 总目录](https://www.toolcenter.ai/en/mcp) | 总目录中曾核实官方 Registry 同步条目及 npm 链接，显示 rc.8；此链接不是 BXP 专属详情页，不作为直达安装入口。General directory only; rc.9 ingestion and a BXP-specific detail URL have not been verified. |

这些页面可发现 BXP，不表示每个平台都完成 rc.9 安装验收；统一从 npm 和本仓库指南安装。第三方旧版描述按核对日期记录，不沿用其中已过时的模型配置要求。目录徽章仅表示条目存在，不表示安全评级、官方推荐或功能认证。

These are discovery entries, not claims of rc.9 deployment approval or certification. Install using the current npm package and our setup instructions. No Core source was published to obtain a listing.

<a id="rc9-contributions"></a>

## rc.9 本轮提交与测试 / Current contributions and tests

- **TensorBlock：**[更新 PR #6087](https://github.com/TensorBlock/awesome-mcp-servers/pull/6087)修改已有条目，使用 rc.9、21 工具 / 17 资源、宿主 LLM 默认模式及自定义 L2/L3 字典说明，保留 npm 同页安装入口。待维护者合并。
- **punkpeye：**[原 PR #19484](https://github.com/punkpeye/awesome-mcp-servers/pull/19484)在提交 `fa41a80a` 中为既有条目补充 Linux x64 / Docker 入口和描述末尾的真实 Glama 评分徽章；[跟进评论](https://github.com/punkpeye/awesome-mcp-servers/pull/19484#issuecomment-6912851096)已提供构建成功、21 工具 / 17 资源、Linux 发行、摘要和公开验收证据。PR 主说明已去掉过时的“无 Linux 验证”内容，明确原始 Core 源码私有及编译包分发范围。当前 open、非 draft、未合并；本次核对无新增人工修改意见，已请求维护者复核资格和余项。旧 Windows 替代验证问题由已跑通的 Linux 路线取代，历史评论保留，未重复开 PR。
- **OpenAI Community Plugins：**[PR #57](https://github.com/openai/community-plugins/pull/57)已转为 Ready for review，包含市场清单、启动器、锁定 rc.9 的 npm 依赖、中英文指南、多 DEV 示例和测试。只提交封装源码；原始 Core 实现不在 PR 中。尚未合并，也不等于进入 OpenAI 公共插件目录。
- **本地验证：**Windows x64 / Node 24.19，BXP 专项 7/7；真实 npm 冷安装、21 工具 / 17 资源、四份中英 L2/L3 示例、字典导入、多 DEV 项目保存、HTTP 工作台及重连保留数据通过。Codex 使用独立配置目录成功添加本地市场、安装插件，并通过安装后的副本返回 rc.9 / 21 工具。此处不冒称新一轮宿主 LLM 语义测试。
- **仓库范围：**市场静态校验、全仓静态校验和市场调度器 11/11 通过。BXP 在 Windows x64 的 Node 22.19、24.19 顺序补测均为 7/7；生产依赖审计 0 漏洞。全市场 Windows 测试仍非全通过：不含 BXP 的上游与 BXP 分支均为 Grafana 16 通过 / 10 失败 / 6 跳过，124 个相关文件逐字节相同、失败名称完全一致，原因是 Windows 路径、POSIX 权限假设和 Git 换行转换。[完整复现证据](https://github.com/joinwell52-AI/community-plugins/blob/codex/boundaryxp-plugin-20261116/tests/boundaryxp/GRAFANA-WINDOWS-BASELINE.md)。Grafana 不是 BXP 依赖，客户无需安装。新增单作业工作流仅供手动运行，无 push/PR 触发，未执行；所有成绩来自本地。贡献者已本人签署 CLA，[最新提交的 CLA 检查](https://github.com/openai/community-plugins/actions/runs/43818468947/job/133139843169)于 2026-11-16 通过。维护者仍需审核编译依赖资格和适用 Gate，不能宣称已获准合并。
- **其他目录：**MCPServers 已接受文档刷新请求；Glama 已完成本页上方记录的 Linux 构建与发行。Serverdex、ToolCenter 的 rc.9 同步未完成；这些第三方状态不能直接改写为 rc.9。

**punkpeye follow-up, November 16:** The existing entry now includes Linux support and the real Glama score badge in commit `fa41a80a`. The [follow-up comment](https://github.com/punkpeye/awesome-mcp-servers/pull/19484#issuecomment-6912851096) supplies successful build/discovery, published Linux release, checksums and public evidence. The PR body discloses the compiled distribution and private Core source. It remains open, non-draft and unmerged; no new human change request was present at this check. The earlier Windows-only alternative-verification question is superseded by the working Linux route, with historical comments retained.

最新检查：上游对 `fa41a80a45ed65af86885534e04829d73a62856a` 自动执行的 [check-submission](https://github.com/punkpeye/awesome-mcp-servers/actions/runs/43841990833/job/133212668882) 已通过；[机器人确认收到 Glama 徽章](https://github.com/punkpeye/awesome-mcp-servers/pull/19484#issuecomment-6912833061)，要求确保已有评分。实时徽章已核对 HTTP 200、21 工具、B 评级。该检查通过不代表维护者已批准或合并。本轮只读取上游检查结果，没有手动启动或重跑工作流。

The upstream `check-submission` check passed on the exact new head, and the bot acknowledged the badge. Its live SVG returned HTTP 200 and reported 21 tools / grade B. Maintainer approval and merge remain pending; no workflow was manually dispatched or rerun.

TensorBlock's rc.9 update and the updated punkpeye contribution await review. OpenAI Community Plugins PR #57 is now ready for review. BXP passed 7/7 tests on Windows with both Node 22.19 and 24.19; the isolated Codex installation, static validators and eleven dispatcher tests passed. Baseline and candidate Grafana runs have identical failures and 124 byte-identical files: these are Windows portability/checkout issues, not a BXP regression. Grafana is not a BXP dependency. The full marketplace suite is not green; the manual-only workflow was not run. The contributor has signed the CLA and the [check](https://github.com/openai/community-plugins/actions/runs/43818468947/job/133139843169) passed on 2026-11-16. Maintainer review and applicable gates remain outstanding. No original Core source, new semantic-accuracy claim or directory approval is implied.

补充：已从 GitHub fork 的实际分支完成 Codex 市场添加、插件安装/启用和安装后 MCP 调用，返回 rc.9 / 21 工具；仍使用全新隔离配置与数据目录。候选安装入口：[简体中文](PLUGIN-MARKETPLACE.zh-CN.md) / [English](PLUGIN-MARKETPLACE.en.md)。Git-backed installation and the installed plugin's actual MCP were also verified. These guides describe the contributor candidate, not an approved official listing.

## 可登记或认领的市场 / Submission and claiming options

### 宿主插件市场 / Host plugin marketplaces

用户截图中的「添加插件市场」接受带市场清单的 GitHub 仓库、Git URL 或本地目录，而不是普通 MCP 目录网址。BXP 插件封装已完成上述本地测试，PR 正式待审核；**尚未获批上架**：

| 路线 / Route | 对 BXP 的意义 / What it would provide |
|---|---|
| **[OpenAI Community Plugins](https://github.com/openai/community-plugins)** | [PR #57](https://github.com/openai/community-plugins/pull/57)正式待审核，本地封装测试通过并补齐 Grafana 基线对照；CLA 已通过，仍需维护者审核及适用 Gate。未合并，不等于进入 OpenAI 公共 Plugins Directory。见[贡献要求](https://github.com/openai/community-plugins/blob/main/CONTRIBUTING.md)。Ready for review, not merged or approved. |
| **自建 Codex 插件市场源 / Own Codex marketplace** | 在 GitHub 提供市场目录与插件清单，由本地插件启动 npm 编译包；客户通过「添加插件市场」加入后安装。无需自建托管服务器，不等于进入官方公共目录。见 [OpenAI 打包与市场文档](https://developers.openai.com/plugins/build/plugins)。 |
| **OpenAI 公共插件目录 / Public Plugins Directory** | 文档提供 ZIP 上传、检查、审核和发布流程；须先补插件资料并核对当前 Windows 本地 stdio 形态的提交要求，不能承诺直接收录或网页端可运行。见 [官方提交指南](https://developers.openai.com/plugins/deploy/submission)。 |
| **Claude Code 插件市场 / Claude Code marketplace** | 可自建含 `.claude-plugin/marketplace.json` 的 GitHub 市场源，封装本地 MCP；官方目录有另行发布流程。见 [市场创建](https://code.claude.com/docs/en/plugin-marketplaces)及[插件发布](https://code.claude.com/docs/en/plugins/publish)。 |
| **Cursor Marketplace** | 支持将 MCP 放入插件并提交审核；本项目保持此前“暂缓提交”的决定，尚未上架。见 [Cursor 插件文档](https://cursor.com/docs/plugins)。 |

候选市场源位于[社区插件 fork 分支](https://github.com/joinwell52-AI/community-plugins/tree/codex/boundaryxp-plugin-20261116)，不是本产品资料仓库。正式官方目录申请另行处理。市场源只公开分发清单、封装与测试，Core 继续从编译包交付。审核状态以上方 PR 为准，不把 fork 试用称为官方已收录。

A candidate marketplace is now in the linked contributor fork branch, with a locally tested wrapper for the compiled npm package. The product documentation repository is still not a marketplace source. A contributor fork and an approved public-directory listing are separate deliverables; no approval or Core source publication is implied.

大型仓库路线复核（2026-11-16）：[punkpeye #19484](https://github.com/punkpeye/awesome-mcp-servers/pull/19484)仍为 Open；[TensorBlock #5989](https://github.com/TensorBlock/awesome-mcp-servers/pull/5989)已于 11 月 15 日合并，覆盖下方历史待审记录。两者是 MCP 发现目录，不是截图中的插件市场源。[Anthropic 官方插件仓库](https://github.com/anthropics/claude-plugins-official)现明确不监看第三方 PR，改走 [Claude 目录管理入口](https://claude.ai/directory/manage)；[modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)主要维护参考服务器，产品收录应走 MCP Registry。

Repository review: punkpeye #19484 remains open; TensorBlock #5989 was merged on November 15, superseding the historical pending status below. Anthropic now directs third-party plugin submissions to its directory portal rather than repository PRs. The MCP reference-server repository directs discovery to the MCP Registry.

### 第三方 MCP 目录 / Third-party MCP directories

| 平台 / Platform | 当前可做什么 / Available route |
|---|---|
| [Serverdex 现有条目](https://serverdex.io/server/io-github-joinwell52-ai-boundaryxp) | 页面提供免费 GitHub 认领，可维护名称、描述和链接；适合先认领现有页，避免重复提交。Free GitHub claim of the existing page is offered; ownership is not claimed in this check. |
| [MCPServers](https://mcpservers.org/servers/www-npmjs-com-package-boundaryxp-mcp) | 已收录，可走页面“请求更新”；不应重复申请新条目。Existing listing has a request-update entry. |
| [MCP Market](https://mcpmarket.com/submit) | 提交页接受 GitHub 仓库；免费队列提示约 4–6 周。本项目已提交，继续待审核，不重复投递。Our free-queue application is already pending. |
| [MCP.so](https://mcp.so/submit) | 当前展示一次性 $39 提交入口，支持仓库 URL；本次未购买或提交。Paid repository-listing option, not purchased. |
| [MCP.Market](https://mcp.market/get-listed) | 说明先同步官方 Registry，再收取一次性 $25 审核；主页又声称自动出现，规则存在不同表述，需要提交前确认。本次不付费、不宣称已收录。Published fee and ingestion descriptions differ; confirm before any purchase. This is a different site from mcpmarket.com. |
| [PulseMCP](https://www.pulsemcp.com/) | 当前仍暂停新增及修改。New submissions and listing changes remain paused. |
| [Smithery](https://www.smithery.ai/future) | 官方公告说明 2026-10-31 已关闭连接管理、CLI/SDK 等服务，保留公共目录；不能沿用旧部署教程作为可用登记流程。Public directory remains; old proxy/CLI publishing instructions are no longer a valid route. |

Codex 的「添加 MCP 服务器」用于配置本地 stdio；「添加插件市场」用于加载另一类插件市场源。当前 BoundaryXP 公共仓库是产品资料与安装包入口，并非 Codex 插件市场源。npm / 官方 Registry 收录也不自动等于 Codex 插件目录或 Cursor Marketplace 上架。Cursor 仍按所有者要求暂缓提交。

Codex's **Add MCP server** and **Add plugin marketplace** are different routes. Our current product repository is not a Codex plugin marketplace. Directory registration does not automatically list the product in a host's plugin catalog. Cursor Marketplace submission remains paused.

## 申请与历史状态 / Applications and earlier checks

MCPServers 的批准通知已于 2026-11-15 核实；下表保留当时页面缺项与申请记录，MCPServers / Glama 当前公开状态以上方 2026-11-16 核对为准。其他第三方申请和 PR 保留 2026-11-14 记录。不因 rc.9 发布而宣称平台已重新审核该版本。

| 入口 | 状态与链接 |
|---|---|
| npm | **已发布rc.9**：[7+1产品介绍与安装](https://www.npmjs.com/package/boundaryxp-mcp) |
| 官方MCP Registry | **已登记并读回**：[io.github.joinwell52-AI/boundaryxp](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.joinwell52-AI%2Fboundaryxp/versions/0.4.0-rc.9) |
| MCPServers | **已批准收录，公开条目已核实**：2026-11-15 08:39（北京时间）收到批准通知。[公开条目](https://mcpservers.org/servers/www-npmjs-com-package-boundaryxp-mcp)的名称、简介、Windows x64 限制及 npm 入口正确；页面未展示官方仓库、版本号、18 个工具、10 个资源及 rc.8 宿主 LLM 模式，文档区显示暂无文档。2026-11-15 核对时 npm 为 0.4.0-rc.8，平台批准不代表已核验该版本。未重复提交申请 |
| MCP Market | **免费提交成功，待审核**：[提交入口](https://mcpmarket.com/submit)。页面返回 Success / Submitted，进入 Free Queue，提示约4–6周；未付费，尚无获批条目链接 |
| TensorBlock MCP Index | **PR已更新至 rc.7，待审核**：[#5989](https://github.com/TensorBlock/awesome-mcp-servers/pull/5989)。条目命令为 `npx.cmd --yes boundaryxp-mcp@0.4.0-rc.7 --data-root C:/BXP/data`，中英安装均链接到 npm 页内；说明和发行证据也已更新并读回。尚未合并，不能标为已进入索引 |
| MCPRush | 已核对发布者账号；新建流程要求自建HTTPS网关或平台托管，当前本地stdio产品不满足这条发布路径，未提交虚假托管信息 |
| Awesome MCP Servers | **PR已更新至 rc.7，待审核**：[#19484](https://github.com/punkpeye/awesome-mcp-servers/pull/19484)。条目、安装入口和 PR 说明均已读回 rc.7，使用 npm 同页指南。Glama 替代核验问题尚无维护者回复；不伪造检测徽章，历史评论中的 rc.5 证据链接保留其当时身份 |
| Glama | 已登录并核对新增表单：Runs from source 要求公开仓库含服务器实现，不能只有文档；通过 Docker 检查后才进入搜索。当前公开资料/编译包仓库不符合该入口，未提交；已在 Awesome PR 询问 Windows 编译包的替代核验方式 |
| Cursor Marketplace | **按所有者要求暂缓提交**。插件清单与实际npx启动已验证，网页申请未提交；个人发布归属尚未解决。**尚未上架，不能承诺在Cursor内搜到** |
| Cursor社区目录 | [cursor.directory](https://cursor.directory)为另一个入口；本轮不提交Cursor相关入口，不等于官方市场审核 |
| PulseMCP | [提交页](https://www.pulsemcp.com/submit)明确暂停新增与修改，建议先登记官方Registry；BoundaryXP已完成Registry登记，但不能据此声称已被PulseMCP收录 |
| MCP.so / MCP.Market | 当前提交页分别要求$39 / $25：[MCP.so](https://mcp.so/submit)、[MCP.Market](https://mcp.market/get-listed)。本轮未购买，也未提交付费申请；MCP.Market与上方mcpmarket.com是不同网站 |
| appcypher / Awesome-MCP-ZH | appcypher仓库已归档，PR未能创建；[中文目录贡献要求](https://github.com/yzfly/Awesome-MCP-ZH/blob/main/CONTRIBUTING.md)排除核心私有且仓库无可验证实现的形式，本轮未提交，不为收录公开核心源码 |

Official Registry registration describes the publicly installable npm package. It does not host the Core or require publishing its source. Third-party directory submission is not the same as approval. MCPServers approved the submission on 2026-11-15 at 08:39 China Standard Time. The [public listing](https://mcpservers.org/servers/www-npmjs-com-package-boundaryxp-mcp) was independently verified: its title, summary, Windows x64 requirement and npm link are correct. It does not display the official repository, package version, 18 tools, 10 resources or rc.8 current-host LLM mode, and its documentation section is empty. At the 2026-11-15 check, npm served 0.4.0-rc.8; directory approval does not establish verification of that release. No duplicate application was submitted. MCPRush's currently offered hosting flow does not match this local stdio product.

MCP Market accepted the free-queue submission (estimated 4–6 weeks). TensorBlock PR #5989 is open, not merged or indexed. Cursor submission is paused at the owner's request. Core source remains private; no payment, hosted deployment or existing local installation change was made for these submissions.

## 2026-11-14 历史记录 / Historical record

以下中英文段落保留 2026-11-14 的核对事实；其中 MCPServers 待审核及无公开条目的状态已由上方 2026-11-15 记录更新。下文 rc.7 为当时发行版本。

The following Chinese and English paragraphs retain the checks recorded on 2026-11-14. Their pending-review and unverified-listing statements for MCPServers have been superseded by the 2026-11-15 record above. rc.7 below identifies the release at that time.

2026-11-14 续查：MCP Market 站内 BoundaryXP 搜索未出现对应公开条目，继续记为待审核，不能称为已同步上线。MCPServers / MCP Market 的待审申请没有本轮可编辑的公开版本字段；其产品仓库入口保持原地址，仓库当前说明和发行包已是 rc.7。未重复提交、未支付加速费用。未提交或不适用的目录没有可更新的 BoundaryXP 安装条目；Cursor 市场仍按所有者要求暂缓。

PR #5989 and #19484 now reference rc.7 and npm's in-page setup guides; both remain open. MCPServers and MCP Market still have no verified public BoundaryXP listing. These are publication-metadata checks, not new model or runtime acceptance tests. Existing tasks, credentials, host configurations and the separate local workbench were not modified.

## 产品概述 / Product overview

BoundaryXP（界痕）用于AI Agent和多角色任务的7+1边界分析与原生计算复核；支持完整父子任务、多个DEV子任务、L2/L3字典、证据报告和本地工作台。Windows x64，中英双语。默认由当前宿主 LLM 分析，经 MCP 提交给原生 Core 复核；用户自己的模型 API/profile 为可选模式。
