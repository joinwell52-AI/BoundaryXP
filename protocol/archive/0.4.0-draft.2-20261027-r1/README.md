# BXP-0001 · 0.4.0-draft.2

本版按界痕的发展修订基础协议，状态为 **DRAFT_FOR_REVIEW**。协议评审后再调整论文；本次未修改论文，也未迁移运行代码或冻结 Gold。

- **[中文正文](BXP-0001.zh-CN.md)**：完整译本，适合直接阅读。
- **[英文正文](BXP-0001.md)**：规范文本。
- [修订依据](DEVELOPMENT-TRACE.zh-CN.md)：发展事实、已有规范与本版新决定逐项对应。
- [变更与迁移](MIGRATION.zh-CN.md)：相对 draft.1 的差异、实现迁移要求及保留项。

八类语义保持不变。主要修订为共享关联载体、来源与解释依赖、状态分层、部分结果及修订、规格与执行比较、分阶段符合性。

## 配套合同

- [基础载体 Profile](contracts/org.boundx.core-7plus1.json)
- [阶段与 Profile 索引](contracts/PROFILE-FAMILY.json)
- [状态归约规则](contracts/STATUS-REDUCTION-RULES.json)
- [合同范围](contracts/README.md)

这些文件用于固定本版协议评审对象，未注册到产品运行时。完整传输 Schema、专用发布 Profile 和实现符合性应在协议评审之后分别交付，不能复用旧版本标签冒充完成。

## 历史版本

- [draft.1 规范正文](../0.4.0-draft.1/companion-r02/BXP-0001.md)
- [draft.1 原配套资产](../0.4.0-draft.1/companion-r02/BXP-0.4-COMPANION-ASSET-REPORT.md)
- [历史 0.3 英文正文](../../BXP-0001.md) · [中文正文](../../BXP-0001.zh-CN.md)

旧正文、配套资产和论文在修订前建立了逐文件摘要基线，参见 [保留清单](review/preservation-baseline.json)。没有将旧目录改名或覆盖旧摘要。

## 本地复核

在本仓库根目录，用可用的 Python 3 执行：

```text
python protocol/versions/0.4.0-draft.2/review/check_revision.py verify
```

该检查核对中英文公式、章节及规范条款编号、相对链接、配套规则、有限语义算例、版本文件清单和受保护旧文件字节。结果见 [verification.json](review/verification.json)，文件摘要见 [MANIFEST.json](MANIFEST.json)。这不是生产 Core、完整协议符合性或自然语言理解准确率测试。

协议版本与产品版本独立。本修订不授权公开仓库、发布产品或执行任何任务。
