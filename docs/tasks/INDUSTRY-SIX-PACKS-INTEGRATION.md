# 六行业接入与用例盘点 / Six-industry Integration

2026-09-14：ADMIN确认行业已扩充为六个，每个行业提供1000条记录。本增量替代v2中“仅软件/AI可选”的产品界面限制；仍一次选择一个L2，保持精确依赖、显式启用、无授权推定，不改BXP协议或冻结向量。

六个行业为software-ai、ops-sys、fleet-logistics、warehouse-inventory、customer-refund、auto-rental。新行业资产由并行任务维护，本轮读取核查，不改写或自动重生成其文件。

## 行业选择

ADMIN工作台按本地Registry实际安装且校验通过的L2动态列出选项，不再硬编码只显示software-ai。选择之后点击“确认切换行业”；仅选中未启用包不会静默退回L1，也不会自动导入或启用。L3依赖原行业时，先停用该名册，再切换；不自动破坏依赖。

已创建的仓库目录不等于已安装包。示例：先执行`node cli.mjs pack import domain-packs/l2/auto-rental/1.0.0`，依赖L1须先安装。刷新工作台后显示该版本，单独确认启用。页面不把尚未安装的行业显示为已可用，不根据用例数量推定包已验证。

The selector lists validated installed L2 packages, not arbitrary folders or a preselected industry. Switching is explicit, keeps at most one active L2 and invalidates prepared UI state. This change does not claim that six industries have passed extraction-quality acceptance.

## 6000记录的去重盘点

以下结果为本轮读取快照，不改动原文件，不作为人工金标审阅。每份文件有1000个不同ID、中英各500条，状态PENDING_REVIEW；但ID唯一不等于原文唯一。

| 行业 | 记录数 | 原文精确去重后 | 重复记录数 |
|---|---:|---:|---:|
| software-ai | 1000 | 1000 | 0 |
| ops-sys | 1000 | 76 | 924 |
| fleet-logistics | 1000 | 21 | 979 |
| warehouse-inventory | 1000 | 30 | 970 |
| customer-refund | 1000 | 10 | 990 |
| auto-rental | 1000 | 147 | 853 |
| 按行业合计 | 6000 | 1284 | 4716 |

语义覆盖还需单独核查。即使原文不同，模板替换也不能自动算作不同语义场景。现有PASS/FAIL和映射是待审核的输入预期，不是程序实测结果；例如软件首条原文未写1800秒，但附带R填入1800，需要金标审阅纠正，不能据此修改协议或强行让引擎匹配。

复现：`node scripts/audit-industry-cases.mjs fixtures/admin-text/cases-customer-refund-1000.json`。审计输出数量、重复ID、逐原文摘要及重复ID组；重复原文或数量不符时退出码1。通过inventory也不等于gold通过，model_runs_verified保持0。

## 文件快照摘要（SHA-256，原始UTF-8）

```text
software-ai 8a6ee1f257fb5332c77d05f8fbcfcbc5746d035b08fd99cd6aa5957239ade3d2
ops-sys beffd672f9155a8b63892f39a9cc8a4e67b598bc65ae5f8cc203eadfa59583c1
fleet-logistics 3a3c6259480945881d62308c2f48ead7cc5344fcb7ff2d1e4bf3af7d2498ceaa
warehouse-inventory f1ad659024966be2ac81041af716cd57384e69b4efa8d82b6dfbe3a37b012cf7
customer-refund c2badb53d2e1548d79afe566092c128c6dc6cfc2ef2ab60be4bc7412a8522245
auto-rental ab68d85c86ef327035e465588ae94411ba1763906da4e51390b34f348a1cbe8a
```

后续用例更新须重新盘点并保留新的摘要；不得把本快照数值套用于新文件。独立审阅应优先处理重复原文、无原文依据的补值、动作/实体组合适用性和禁止边界，不能只扩充编号。
