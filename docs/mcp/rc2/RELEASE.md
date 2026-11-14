# rc.2 测试版说明 / Test release

**适配器 / Adapter:** `0.4.0-rc.2`

**计算基线 / Baseline:** B-335

**验证环境 / Tested environment:** Windows x64, Node 24.19.0

**分发状态 / Distribution:** private GitHub draft; not on npm

## 包身份 / Package identity

| 文件或组件 / Item | SHA-256 |
|---|---|
| `boundaryxp-mcp-0.4.0-rc.2.tgz`（3,918,062 bytes） | `6b84a460956fb942ec19e662ceee4353f589de2ed6bc1f3b7ec6f5303f867c63` |
| 原生 Core / Native Core | `e41e0dc3e853d2fc52425d4d660b9a91caea1a897ac756770520efd7ecfeee2c` |
| 核心运行包清单 / Runtime manifest | `85b6324362c4ea94c41a529d85fab3567ecdedd6e7829941ea7b1785d5a2c3f9` |

270 个 tgz 文件成员；已逐成员核对交付清单。原始 JavaScript Core、C++ 源文件、调试符号、凭据及个人任务历史不在包内。适配器、工作台页面、提示词、协议和必要资源仍可读；原生二进制不等于不可逆向。

The archive contains 270 file members verified against its delivery manifest. Original JavaScript Core and C++ source, debug symbols, credentials and personal task history are excluded. Adapter/UI/prompt and required resource files remain readable; native compilation is not a guarantee against reverse engineering.

## 本版变化 / Changes

- 新增可选择启用的自动检查、后台准备、全部相关客户端退出后的下次启动自动切换。默认关闭。 / Opt-in background preparation and safe next-start activation; off by default.
- 显式允许时复制迁移跨核心数据，保留旧目录；损坏包和失效候选拒绝激活；回滚后阻止自动立即装回同版。 / Verified copy migration, damaged/stale candidate rejection and rollback suppression.
- `bx_capabilities` 提供 managed 更新状态，仍是 18 工具与 10 资源。 / Managed update status; unchanged tool/resource counts.
- 修复管理命令的模块循环加载退出，实际 CLI 命令加入回归。B-335 算法与页面未改变。 / Fixed the managed-command import deadlock; B-335 algorithms and UI unchanged.

## 已执行验证 / Executed validation

14 项工程检查通过。适配器回归为 51 项中 47 通过、0 失败，4 个安装夹具相关测试由单独真实包流程覆盖。实际 tgz 的新装、旧版迁移、回滚、HTTPS 自动下载/切换、多客户端保护、复制迁移及失败保留旧版均已测试。升级前后核对 29 个任务文件和 2 个配置文件一致。

Cursor 原生 MCP 连接已实际调用能力及页面工具，Codex CLI 已完成五项只读调用；不是用终端模拟宿主工具。核心未变化的 811 项对比、625 案/3469 项操作数对比和 rc.1 真实模型/页面证据，按组件摘要一致性明确复用。本轮自动升级测试没有新模型分析请求。

Fourteen engineering gates passed, including actual archive installation, upgrade/rollback and HTTPS updater exercises. Cursor and Codex made native MCP tool calls. Earlier Core, real-model and browser evidence is reused only where the implementation bytes are unchanged. This is engineering acceptance, not a new semantic-accuracy claim or a guarantee for every model/host/platform.

2026-11-11补做安装说明验收：直接提取中文指南的前五段PowerShell命令，仅替换为隔离目录和已校验本地包，完成首次安装与宿主配置。按生成的stdio配置实际调用能力、profile及页面工具，确认18工具、HTTP 200、零模型请求；中英文多DEV示例均解析为一个父任务和两个子任务。此项是文档安装/连接验证，不冒称重新执行Cursor界面或模型分析验收。

The documented fresh-install commands were executed in an isolated directory on 2026-11-11. The generated stdio configuration returned 18 tools and HTTP 200 with no model requests; both bilingual examples preserved the three-node tree. This additional guide check does not claim a new IDE UI or model-analysis test.

## 尚未对外发布 / Before public distribution

当前目标是内部测试，不把 GitHub 仓库保持私有视为内部交付故障。公开前仍需处理原有历史源码引用清理、重新检查仓库可见性、确认私有核心的对外许可和资源再分发范围。仓库原有公开前核查文档继续保留；本轮不声称 GitHub 已完成历史引用清理。

Npm 账号、命名空间、在线包和正式更新通道均未创建。本轮也不修改已有源码/材料的 MIT 许可。内部测试包与源码仓库分开；GitHub 的自动 Source code 附件不是安装包。

The existing historical-reference cleanup and external distribution-license/resource decisions remain separate prerequisites for going public. No public npm release, registry namespace claim or new license grant is made here. These external-publication prerequisites do not block private test preparation.
