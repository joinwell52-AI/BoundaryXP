# BXP 产品统一实施回执

- 授权任务书：[Draft PR #1](https://github.com/joinwell52-AI/BoundX/pull/1)，固定提交 `a2fb068565605c0ac83ad6d6d4a973941ee270c6`。
- 基线：`ae0bab1ac8a99e806327fc30b2b83c295826e5f0`。
- 实施分支：`impl/bxp-product-alignment-v1`。
- 前一轮未提交草案完整保存在本地 stash `752298ea8c59255bf2d6a9cda3bd97f8d30c981e`，不纳入本轮交付，不自动恢复。
- BXP-0001、Schema 与冻结向量保持不变；不新增协议编号。

## WP1 — COMPLETE

唯一生产计算、十进制与校验模块迁入 `src/bxp/`；conformance 测试与生成器直接导入生产实现。新增四个稳定 API、注册表信息及严格原始 JSON 路径。旧审阅版本常量明确命名为 legacy schema version，未冒充产品版本。

严格解析拒绝重复键（含转义同名键）、非法 UTF-8／Unicode、超限和十进制数值往返损失；解析失败使用既有无效结果信封，不改协议。适配器额外限制数值 token 最多 1024 字符，大数应使用协议十进制字符串。

验证：`npm test`，Core 21/21、Protocol 103/103、CALC 208/208。原冻结期望未刷新。

后续工作包待执行，尚未完成最终交付。
