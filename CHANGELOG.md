# BoundX 版本状态 / Version Status

## 1.2.4-preview.1

当前独立项目源码版本；仓库保持私有，尚未发布 GitHub Release、npm/PyPI 包或正式认证。正式产品维护不等于协议已采用或产品已公开。

- 中英文 BXP-0001：`0.3.0-draft.2`。
- BXP-CALC：`1.0.0-draft.3`，208 条结构化计算向量。
- 协议参考实现提供完整 Schema 校验、精确数值、来源摘要和显式作用域。
- ADMIN 保持本地确定性抽取与 Python 计算，未明确项保持未明确。
- 产品 CLI/MCP/UI 尚未统一为 BXP 对象接口。
- 发布与许可证变更必须另获明确授权；当前许可证见 [LICENSE](LICENSE)。

Current standalone source version; private, unreleased and uncertified. Protocol drafts do not grant execution authority. Product adapters are not yet unified on the BXP object interface.

[快速开始](QUICKSTART.md) · [协议实现说明](protocol/IMPLEMENTATION.md) · [验证说明](docs/VALIDATION.md)

## 协议修订 / Protocol revision

BXP `0.3.0-draft.2` 是不兼容草案修订，计算套件更新为 `1.0.0-draft.3`：
- 补齐结果 Schema 状态条件，拒绝矛盾信封。 / Reject contradictory result states.
- P 统一为 Participants／责任主体与角色分工，不产生授权。 / Clarify roles without granting authority.
- EXTRACT 暂为预留；IR、CALC、RELAY 按各自测试范围声明。 / Separate testable conformance claims.
- Schema 资源 ID 精确版本化；旧协议输入拒绝，不静默升级。 / Exact schema resource versions.
- 结果回显实际 Profile 要求、已明确要素及缺项；区间与环关联贡献约束／依赖边 ID。 / Trace profile and calculation evidence.
- 输入摘要明确采用 RFC 8785 JCS，并固定算法标识。 / Explicit JCS digest identification.
- 新增反例、双语规范断言及最小协议 CI。 / Negative tests, bilingual assertions and protocol CI.

208 个既有向量只更新协议版本、依赖 ID 与新增结果字段；迁移核对确认原有计算、发现和三轴结论未变。此处记录本项目协议修订，不恢复其他项目历史。

The 208 vectors retain their previous calculations, findings and verdicts after the explicit wire-format migration. This is not a new extraction benchmark or a public release.
