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
