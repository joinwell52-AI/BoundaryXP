# 内部测试范围及第三方说明 / Internal scope and notices

本次交付供仓库授权维护者内部测试。仓库保持私有，Release 为草稿；不把准备测试包解释为公开发布、公开核心源码或另行授予对外再分发权。原仓库和各材料的既有许可保持原样。

This draft delivery is prepared for authorized internal maintainers. It does not change visibility, publish Core source, or establish a new external redistribution license. Existing repository and material licenses remain unchanged.

安装包当前元数据保留 `MIT` 标记。正式外部分发前须明确其与拟闭源原生核心、适配器、工作台及资源的适用范围，并一致更新最终许可文件及元数据；本轮不单方面改写既有许可证，也不声称仅靠二进制即可限制所有使用行为。

The candidate still carries an MIT metadata label. Before external distribution, resolve its scope relative to the intended proprietary native core, adapter/UI and resources, and make the final notices and metadata consistent. This internal preparation neither changes existing licenses nor certifies legal compliance.

## 随附组件 / Included components

| 组件 / Component | 说明 / Notice |
|---|---|
| `@modelcontextprotocol/sdk`、`ajv`、其他锁定 npm 依赖 | 版本和许可清单见 Release 的 `DEPENDENCIES.json`；首次安装由 npm 获取 / Versions and notices are in the dependency inventory |
| `@cursor/sdk` | 适用其自身 LICENSE.md，不归为 BoundaryXP 的 MIT / Governed by its own LICENSE.md |
| nlohmann/json 3.12.0 | MIT |
| Boost.Multiprecision 1.89.0 | Boost Software License 1.0 |
| Zig libc++ / libc++abi / Windows support | 具体许可原文随 `.node` 位于 `runtime/native/THIRD-PARTY-NOTICES/` / Exact notices bundled beside the native binary |
| L2/L3 字典及协议资源 | 摘要确认身份，不能代替再分发授权 / Digests verify identity, not redistribution rights |

同一 Release 附 `THIRD-PARTY-NOTICES.md`、依赖清单及校验摘要。不要移除已有第三方许可。产品包不含模型权重，不提供服务商账号、API 密钥、免费额度或用户的历史任务。

Retain all third-party notices. No model weights, provider account, API key, free credit or personal task history is supplied. API usage remains subject to the selected provider's access and terms.

## 支持与报告 / Support

安装或使用问题请通过仓库内部维护渠道反馈：版本、操作步骤、错误码、脱敏小样例即可。不要提交密钥、登录信息、完整个人任务或原始运行日志。公开问题渠道和私密漏洞报告地址在正式公开前另行确认。

Use the internal maintainer channel with version, steps, error code and a redacted example. Do not upload credentials or full personal records. A public support/disclosure route must be confirmed before public launch.
