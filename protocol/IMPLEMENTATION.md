# BXP 参考实现 / Reference Implementation

BoundX 为私有研发中的独立产品。源码 `1.2.4-preview.1`，协议 `0.3.0-draft.2`，计算套件 `1.0.0-draft.3`；均不代表公开发布、正式认证或业务授权。

BoundX is an independent product in private development. The reference protocol remains a draft, not a published standard or execution authorization.

## 合同 / Contract

- 完整 Draft 2020-12 Schema 校验，再做语义校验和计算；不强转、不补齐未知。 / Full schema and semantic validation, without coercion or invented facts.
- 小数及大整数使用十进制字符串；区分整数域与实数域。 / Exact decimal strings and explicit integer/real domains.
- 原文按 Unicode 码点取证；来源版本与摘要必须匹配。 / Evidence uses Unicode code points and verified source digests.
- 同一作用域内的逻辑公式与假设合取；未知不能掩盖已计算冲突。 / Conjoin within-scope formulas; uncertainty cannot hide a proven conflict.
- 输入摘要采用 RFC 8785 JCS；拒绝稀疏数组和非数据属性，不进行 Unicode 归一化。 / JCS digests bind submitted JSON context without Unicode normalization.
- 结果回显实际 Profile 必填项、已明确项及缺项；区间有贡献约束 ID，环有节点和边 ID。 / Results expose profile requirements, deficits and calculation provenance.
- Schema 校验结果状态条件，但跨输入关系与数学真值仍需计算测试。 / Schema enforces result states; cross-input relationships require calculation tests.
- `business_decision` 与 `execution_authorization` 始终为空。 / Both authority fields remain null.

## 验证 / Verification

208 条冻结结构化向量包含48条基础与160条计算模式用例；向量通过不等于自然语言抽取准确率。生产者抽取、参考对象计算和产品入口分别验证。

The 208 structured vectors do not measure natural-language extraction accuracy. Producers, object calculations and product adapters require separate validation.

运行方式见 [验证说明](../docs/VALIDATION.md)。生成器默认只比较冻结结果，显式 `--candidate` 才产生候选；不能用刷新预期代替修复错误。

协议修订范围见 [变更记录](../CHANGELOG.md)。新增 [修订测试](conformance/revision.test.mjs) 覆盖反例、JCS、追踪与双语规范断言；双语断言防止已知条款漂移，不证明所有译文语义完全等价。

[协议 CI](../.github/workflows/protocol.yml) 在 Node.js 22/24 上重跑协议测试。配置存在不等于本次远端运行通过；运行状态以 GitHub Actions 为准。CI 是远端重跑，不是第二套独立实现。

Revision tests guard known bilingual clauses, not full translation equivalence. CI reruns are not independent-implementation interoperability evidence.

## 限制 / Limits

- BXP-EXTRACT 为 RESERVED / INFORMATIVE，不得宣称通过；本计算器不声明 BXP-RELAY。 / No extraction or relay conformance claim.
- CLI/MCP/UI 与参考 BXP 对象接口尚未统一。 / Product adapters are not yet unified on BXP.
- Profile ID 不自动加载策略，作用域不执行条件或跨域联合求解。 / No automatic policy loading or cross-scope solving.
- 原文证据不能证明归一化或全局约束投影完整。 / Evidence does not prove semantic correctness or completeness.
- 接收已解析 JSON；解码器负责拒绝重复键并保留数值精度。 / Decoders must reject duplicate keys and preserve numeric precision.
- 机器消息固定英文，展示可中英切换；不能翻译或覆盖原文证据。 / Displays may localize stable messages, never source evidence.
- 不宣称具备第二独立实现的互操作验证。 / No independent second-implementation conformance claim.

精确版本对应精确 Schema；不兼容输入必须拒绝，不能只改版本号。详见 [英文规范](BXP-0001.md) 与 [中文译本](BXP-0001.zh-CN.md)。
