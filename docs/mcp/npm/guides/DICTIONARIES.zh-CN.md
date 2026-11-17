# L2 / L3 字典：格式、导入与升级

[English](DICTIONARIES.md) · [安装与升级](../INSTALL.zh-CN.md)

**MCP rc.10 / B-345**：页面和 MCP 使用同一字典存储与校验器。rc.9 单 JSON 字典继续兼容；既有 ID、版本、摘要和历史任务不重写。

## 层级与用途

| 层级 | 内容 | 权限边界 |
|---|---|---|
| L2 行业 | 动作、实体、岗位、资源、引用、完成条件和禁止风险术语 | 不补造任务条件或授权 |
| L3 企业 | 本企业的术语、对象和带证据的关系事实；必须填写 boundx.tenant_id | 姓名、岗位和经理关系不授予权限 |

没有活动 L1。校验只检查目录、清单、身份、摘要和有限条目结构，不证明语义正确或完整符合全部语义 Schema。业务裁决、执行授权保持 null。

## 完整目录

选择**直接含 datapackage.json 的版本文件夹**，不选单文件或包含多个版本的上层目录。

| L2：8 个 JSON＋README | L3：3 个 JSON＋README |
|---|---|
| datapackage.json | datapackage.json |
| actions.json | enterprise-ontology.json |
| entities.json | enterprise-facts.json |
| roles.json | README.md |
| resources.json | |
| references.json | |
| completions.json | |
| boundaries.json | |
| README.md | |

清单的 $schema 为 urn:boundx:product:semantic-data-package:v1；name、version、boundx.layer 明确身份。resources 列出除清单自身以外的全部文件，包括 README：相对 path、资源 kind、encoding=utf-8、UTF-8 字节数 bytes、hash=sha256:摘要。JSON 资源的 packId/version 与清单一致。编辑内容后重新计算摘要并使用新版本。

限制：单文件 256 KiB，完整传输 JSON 1 MiB，每安装最多 200 个自定义包。拒绝重复路径/JSON 键、路径穿越、缺失资源、错误层级及摘要不符。不读取资料里的 URL 或路径，不执行代码。不要放密钥或客户敏感资料。

完整可导入示例：

- [L2 中文](../examples/dictionary-directories/L2-zh-CN/) · [L2 English](../examples/dictionary-directories/L2-en/)
- [L3 中文](../examples/dictionary-directories/L3-zh-CN/) · [L3 English](../examples/dictionary-directories/L3-en/)

页面提供完整 ZIP；先解压再选择版本目录。

## 页面五步导入

打开 bx_workbench_open 返回的地址，进入**字典设置 → 导入语义库**：

1. 选择 L2/L3。
2. 选择完整文件夹，检查文件列表。
3. 校验；通过后才允许保存。
4. 填写显示名称。
5. 保存。

随后到**已安装字典**选择并保存配置。导入本身不绑定任务。名称与选择刷新后保留；模型设置单独保存。更改绑定形成新修订，旧结果仍可按原修订读取，不自动运行模型或计算。

## MCP 工具

在 Codex、Cursor 或其他 stdio 宿主中说：

> 用 BoundaryXP 获取 L3 中文完整目录规范和示例，校验我提供的全部文件；通过后用返回的 sha256 导入，显示名称为“企业术语”。返回新字典 ID，先不要修改已有任务。

调用顺序：bx_dictionary_format（language=zh-CN、layer=L3）→ bx_dictionary_validate → bx_dictionary_import → bx_dictionaries_list → 显式 bx_dictionaries_bind。

document 是**完整传输对象序列化成的字符串**。对象具有 schema=boundaryxp-dictionary-directory/1 和 files 数组；每个元素有相对 path 与完整原文 content。例如 datapackage.json、enterprise-ontology.json、enterprise-facts.json、README.md 都必须包含。format 的 example 返回完整有效对象，不能只提交本机路径。

宿主只读取获准访问的文件。content 保留 UTF-8 原文，不能重新格式化资源却沿用旧清单摘要。validate 返回 sha256；import 提交同一 document、sha256 和可选 display_name。显示名称独立保存，不改变内容身份或绑定摘要。

内置资源：boundaryxp://dictionaries/zh-CN/guide、boundaryxp://dictionaries/schema，以及 boundaryxp://dictionaries/zh-CN/L2/example、L3/example。英文把 zh-CN 改为 en。无需本地开发文档。

## 旧格式与排障

rc.9 的 boundaryxp-custom-dictionary/1 仍可通过 MCP 导入：最多 256 KiB、1–512 条目；必填 schema/id/layer/version/label/entries 及两个 null 权限字段；L3 另需 tenant。每项必填唯一 id、terms、definition。四份历史单 JSON 示例继续保留在 examples/dictionary-L2-en.json 等路径。新页面使用目录导入。

| 提示 | 处理 |
|---|---|
| DICTIONARY_DESCRIPTOR_REQUIRED | 选直接含 datapackage.json 的目录 |
| DICTIONARY_REQUIRED_RESOURCE | 补齐该层级全部资源与 README |
| DICTIONARY_RESOURCE_DIGEST | 核对编码、换行、字节数和摘要 |
| DICTIONARY_LAYER_MISMATCH | 不混合行业与企业资源 |
| DICTIONARY_VALIDATION_DIGEST_MISMATCH | 内容变动后重新校验 |
| DICTIONARY_VERSION_CONFLICT | 保留旧包，使用新版本，不覆盖 |
| 导入后未用于分析 | 到已安装字典选择保存，或显式 bind |
| 看不到目录入口 | capabilities 应为 rc.10/B-345；活动任务结束后重连 |

升级保留原安装目录和配置路径。运行摘要改变时按安装指南复制迁移；不删除原数据，不强制中断活动任务。旧字典、失败记录、报告和任务修订保留。
