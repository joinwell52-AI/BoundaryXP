# BXP-0001 · 0.4.0-draft.2

本目录已用用户提供的新内容更新，**协议版本仍为 0.4.0-draft.2**，文件修订为 **2026-10-27-r2**，状态为 **DRAFT_FOR_REVIEW**。中英文正文和配套说明已同步。协议评审后再调整论文；本次未修改论文，也未迁移运行代码或冻结 Gold。

- **[中文正文](BXP-0001.zh-CN.md)**：完整译本，适合直接阅读。
- **[英文正文](BXP-0001.md)**：规范文本。
- [本次中文变更说明](CHANGELOG.zh-CN.md) · [English change notes](CHANGELOG.md)
- [修订依据](DEVELOPMENT-TRACE.zh-CN.md)：发展事实、已有规范与本版新决定逐项对应。
- [变更与迁移](MIGRATION.zh-CN.md)：相对 draft.1 的差异、实现迁移要求及保留项。

八类语义保持不变；原 36 条规范编号保留，新增 4 条。本次补齐数学求值 E 与整体评估 B 的分离、精确查询清单、部分视图状态省略、父环境范围以及因果可实现性声明。

## 配套合同

- [基础载体 Profile](contracts/org.boundx.core-7plus1.json)
- [阶段与 Profile 索引](contracts/PROFILE-FAMILY.json)
- [状态归约规则](contracts/STATUS-REDUCTION-RULES.json)
- [求值与评估合同](contracts/EVALUATION-ASSESSMENT-CONTRACT.json)
- [合同范围](contracts/README.md)

这些文件用于固定本版协议评审对象，未注册到产品运行时。完整传输 Schema、专用发布 Profile 和实现符合性应在协议评审之后分别交付，不能复用旧版本标签冒充完成。

## 历史版本

- [本次更新前的 draft.2 完整归档](../../archive/0.4.0-draft.2-20261027-r1/README.md)
- [用户提供的两份原稿](source-artifacts/README.md)：原文件名虽含 draft.3，活动版本按用户决定仍为 draft.2。

- [draft.1 规范正文](../0.4.0-draft.1/companion-r02/BXP-0001.md)
- [draft.1 原配套资产](../0.4.0-draft.1/companion-r02/BXP-0.4-COMPANION-ASSET-REPORT.md)
- [历史 0.3 英文正文](../../BXP-0001.md) · [中文正文](../../BXP-0001.zh-CN.md)

旧正文、配套资产、论文及相关根配置已建立逐文件摘要基线，参见[本次保留清单](review/update-preservation.json)。更新前目录的 14 个文件已完整归档，保留原字节和原清单。

## 本地复核

在本仓库根目录，用可用的 Python 3 执行：

```text
python protocol/versions/0.4.0-draft.2/review/check_revision.py verify
```

该检查核对中英文公式、章节及规范条款编号、来源正文保留、相对链接、配套规则、有限语义算例、版本文件清单和受保护旧文件字节。结果见 [verification.json](review/verification.json)，文件摘要见 [MANIFEST.json](MANIFEST.json)。这不是生产 Core、完整协议符合性或自然语言理解准确率测试。

## 下载包 / Download bundle

本次文件包位于仓库 `output/protocol/BXP-0001-0.4.0-draft.2.zip`，包含当前中英文协议、说明、配套合同、原稿及核验材料。解压后可直接阅读正文。

在解压得到的 `BXP-0001-0.4.0-draft.2` 文件夹中，可独立检查包内清单、双语文本、原稿与有限例子：

```text
python review/check_revision.py verify --package
```

包内的历史开发来源与旧版归档链接依赖原仓库；独立包检查会明确跳过这些仓库外链接及旧仓库字节保留检查，不把它们记为已复跑。该范围不影响包内正文、用户原稿和清单的核对。

独立包模式还将 `prior_rule_count`、`new_rule_count`、`semantic_view_definitions_unchanged` 设为 `null`，并将历史比较标为 `NOT_RUN_REQUIRES_REPOSITORY`；它没有重新比较旧版。包内 `verification.json` 保存的是仓库模式运行记录，与本次包模式输出分开解释。仓库模式才会实际比较旧版并计算这些计数。

The bundle contains both current language texts, change notes, companion descriptors, supplied originals and verification materials. Package mode verifies these local contents; repository-only historical links and preservation checks require the original workspace. Historical comparison counts are null in package mode, with an explicit not-run status. The bundled verification.json records a workspace run and is not a new package-mode comparison of the old archive.

协议版本与产品版本独立。本修订不授权公开仓库、发布产品或执行任何任务。
