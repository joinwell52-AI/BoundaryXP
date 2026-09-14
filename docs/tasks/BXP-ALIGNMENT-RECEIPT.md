# BXP 产品统一实施回执

- 授权任务书：[Draft PR #1](https://github.com/joinwell52-AI/BoundX/pull/1)，固定提交 `a2fb068565605c0ac83ad6d6d4a973941ee270c6`。
- 基线：`ae0bab1ac8a99e806327fc30b2b83c295826e5f0`。
- 实施分支：`impl/bxp-product-alignment-v1`。
- 前一轮废弃的生产者协议草案已按 ADMIN 明确指示删除其本地暂存备份，不纳入本轮交付；当前工作包改动保留。
- BXP-0001、Schema 与冻结向量保持不变；不新增协议编号。

## WP1 — COMPLETE

唯一生产计算、十进制与校验模块迁入 `src/bxp/`；conformance 测试与生成器直接导入生产实现。新增四个稳定 API、注册表信息及严格原始 JSON 路径。旧审阅版本常量明确命名为 legacy schema version，未冒充产品版本。

严格解析拒绝重复键（含转义同名键）、非法 UTF-8／Unicode、超限和十进制数值往返损失；解析失败使用既有无效结果信封，不改协议。适配器额外限制数值 token 最多 1024 字符，大数应使用协议十进制字符串。

验证：`npm test`，Core 21/21、Protocol 103/103、CALC 208/208。原冻结期望未刷新。

后续工作包待执行，尚未完成最终交付。

## WP2 — COMPLETE

新增产品生产者指南与中英六类共12份 BXP 示例；Schema 和版本信息直接取唯一注册表，不新增协议。示例覆盖完整、B缺失、主体未知、多来源、作用域未知和确定冲突，并验证改原文一个字符后旧证据失效。

验证：Core 33/33（新增示例12项）、Protocol 103/103、CALC 208/208、Docs 9/9；61份 Markdown、242个本地链接无失效。

## WP3 — COMPLETE

主 CLI 新增 evaluate（严格原始字节路径）和 protocol-info；旧四命令仅在 legacy 命名空间保留并输出弃用提示。协议无效输入输出完整无效信封且进程返回0，命令用法或文件 I/O 失败为进程错误。不静默迁移 legacy 对象。

验证：Core 43/43，新增 CLI 10项，覆盖四种业务状态、Schema、重复键、精度、超限、非法UTF-8、中文带空格路径及 legacy 负向行为。

## WP4 — COMPLETE

MCP 主工具接收完整 IR 或严格原始 JSON；Schema 与协议信息资源直接读取唯一 Core 注册表。旧工具仅保留显式 legacy 名称和弃用声明。进程无状态，不访问模型或网络；传输层从原始字节拒绝非法 UTF-8、重复键和精度损失。每帧上限 2 MB（包含传输信封）。

验证：Core 51/51，新增 MCP 8项，包含 CLI/Core/MCP 同输入同输出、资源一致性、严格 JSON、非法 UTF-8 及 legacy 负向测试。

## WP5 — COMPLETE

主 UI 改为双语 BXP IR 导入／粘贴模式，经原始字节路径调用唯一 Core。独立展示八桶三态、全部证据来源与码点范围、三结果轴、Profile、已明确项、缺项、作用域与五类计算；两个授权字段保持 null。主界面不调用模型或持久化客户原文。旧研究界面仅在 /legacy、旧 API 仅在 /api/legacy/，均不冒充 BXP。

Python 证据及 JS 规则、引用和展示统一为码点坐标；原业务判断不变，原测试仅更新坐标切片断言，不刷新历史结果或冻结向量。

验证：UI 147/147（新增 HTTP／渲染15项、JS/Python 码点5项）；Python 133/133。真实浏览器另行验证混合中文／英文／emoji 输入、独立 B、三轴和 null 授权；重复键随后显示 invalid 并清除旧八桶展示。HTTP、CLI、MCP 与 Core 已有同输入同输出覆盖。浏览器观察不计入自动测试数量。

## WP6 — COMPLETE

产品升级 1.3.0-preview.0，包主出口仅导出 BXP Core；旧比较、Schema、分解和本地化模块移到 src/legacy/。README 首个运行示例使用标准 IR，必改文档与三层语义包归属统一，历史研究材料加非规范标签而不重写结果。保留产品手册中的商业规划与未来 SDK/Server 边界，不把规划当作交付。更新来源清单，不修改协议正文、Schema 或冻结结果。

验证：Core 51/51、Protocol 103/103、CALC 208/208、UI 147/147、Docs 14/14（新增当前口径／版本／编码5项）；62份 Markdown、254个本地链接与锚点无失效。许可证未变，仓库未公开、未发布。
