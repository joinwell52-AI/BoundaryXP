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

各工作包结果按下文记录；最终交付状态以末尾回执和 GitHub CI 为准。

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

## WP7 — COMPLETE

增加生产主出口同一实现断言，以及中英各六例加 emoji、非 BMP 与组合字符的 Core/CLI/MCP/HTTP 四入口端到端测试。文件导入期间禁用计算，防止旧输入与新文件的异步竞态。CI 扩展为 Linux Node22/24、Windows Node24 全套验证；实际远端运行已通过，见最终回执；不以配置存在代替通过。

本目录全量命令实跑：npm ci（审计0漏洞）、npm test（Core54/54、Protocol103/103、CALC208/208）、npm run test:ui（147/147）、.venv Python unittest（133/133）、npm run test:docs（14/14，62份 Markdown、254链接）。无跳过。合计451项自动测试加208条冻结向量（659个判定），新增76项；结构化向量不是抽取金标。

新增集成／适配器相关53项：生产者12、CLI10、MCP8、UI HTTP/渲染15、JS/Python码点5、全入口与主出口3；另严格raw18、文档5。全入口两项内实际遍历12个双语变体，不重复算作12个 test。

已核对协议正文、三个Schema、208条冻结结果、LICENSE 相对基线无改动。已确认远端 PRIVATE，尚未合并或发布。

## 最终执行回执 / Final receipt

Draft PR：[BoundX #2](https://github.com/joinwell52-AI/BoundX/pull/2)。实现提交 b1cda5a 的 [实际 CI 34816141070](https://github.com/joinwell52-AI/BoundX/actions/runs/34816141070) 三组全通过：Ubuntu Node22、Ubuntu Node24、Windows Node24；每组包含所有测试命令。继承的固定版本 Actions 有 Node20 弃用提示，runner 已强制 Node24 执行，未造成测试失败。最终文档追加提交后的检查状态以 PR checks 为准。

最终文档检查14/14，63份 Markdown、255个本地链接与锚点通过。完整141项文件变更清单、工作包提交与回滚点见 docs/tasks/BXP-ALIGNMENT-DELIVERY.md；逐项与 Git diff 核对，无遗漏。测试日志中的依赖安装／平台分支 skip 是非本平台步骤，不是跳过测试用例。

```text
BOUNDX_BXP_ALIGNMENT_STATUS: COMPLETE
BASELINE_COMMIT: ae0bab1ac8a99e806327fc30b2b83c295826e5f0
IMPLEMENTATION_BRANCH: impl/bxp-product-alignment-v1
PULL_REQUEST: https://github.com/joinwell52-AI/BoundX/pull/2
PROTOCOL_CHANGED: false
PRODUCT_VERSION: 1.3.0-preview.0
PROTOCOL_VERSION: 0.3.0-draft.2
CONFORMANCE_SUITE: 1.0.0-draft.3
WORK_PACKAGES: WP1=COMPLETE, WP2=COMPLETE, WP3=COMPLETE, WP4=COMPLETE, WP5=COMPLETE, WP6=COMPLETE, WP7=COMPLETE
BXP_CALC: 208/208
CORE_TESTS: 54/54
UI_TESTS: 147/147
PYTHON_TESTS: 133/133
DOC_TESTS: 14/14
NEW_INTEGRATION_TESTS: 53/53
LEGACY_STATUS: namespaced_deprecated
KNOWN_LIMITS: BXP-EXTRACT reserved; import-only main UI; local preview server; legacy Python not a BXP SDK; object APIs cannot recover upstream precision loss; raw/frame 2MB, depth64, nodes100000, numeric token1024; no independent implementation certification
BLOCKERS: none
ADMIN_DECISION_REQUESTED: Review Draft PR #2; no merge or publication performed
```

Protocol 加固与严格 JSON 单元测试另计103/103，未混入208条冻结向量数。合计451项自动测试加208条向量。BXP-0001、Schema、冻结期望和许可证相对基线未改；当前仍私有，main 未合并。
