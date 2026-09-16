# ADMIN文本与语义包 v2：基线与采用记录

## WP0 基线 / Baseline

- 仓库：joinwell52-AI/BoundX；目录：`D:\boundx`。
- main：`50b9882c7b3e5118e85fb6993ba365d8f054fe0b`。
- 授权入口、v2任务书和120条种子：`b432f9ed734850191d170022f01d7589251fdbd8`；本地文件按原字节保留。
- 分支：`feat/admin-text-semantic-packs-v2`；不合并、不发布。
- 产品1.3.0-preview.0；固定BXP-0001 0.3.0-draft.2、BXP-CALC 1.0.0-draft.3。
- 已有成果：唯一Core、Node API、CLI、MCP、本机BXP UI、显式legacy、文档收口全部保留，不重做。
- 本轮开始时3个未提交文件来自本对话：L2 evidence文字、微调fixture ID、Python两项回归。原样保留并纳入WP0。不是其他开发者的未知改动。
- 本地未提交v1增补保存在[历史本地草稿](ADMIN-TEXT-L2-LOCAL-DRAFT-ARCHIVE.md)，原始v1任务书从授权提交恢复为独立历史快照；v2覆盖其冲突要求。

## 已核对资产 / Asset inventory

L2实际计数为107动作、54实体、22岗位、30资源、12依据、10完成、8风险，Manifest吻合。Python加载器已有计数及引用验证；24条历史包fixture不是120条新种子，也不是208冻结向量。重复的微调fixture ID修为zh-model-fine-tune，训练fixture保留zh-model。

L1旧JSON混合语义词表和解析器正则；Lark保持适配器层，不作为可执行包资源。目标新身份core-ontology@1.1.0、software-ai@0.2.0当前尚未占用。现有L2的仓库相对Schema路径在迁移版本中改为离线产品注册表身份。

## v1 → v2 与用户追加 / Changes

普通目录/ZIP取代.bxpack；L3仅职员表，允许自定义岗位和空role_ref；inactive保留身份，关闭名册保留文字主体。PM-01不推定为产品经理。每次prepare固定来源、包和上下文；候选不能按新激活状态重新解释。真实Host运行和独立金标审阅不能被回放替代。

用户追加的L2范围在[WP3增补](ADMIN-TEXT-L2-WP3-ADDENDUM.md)记录，与v2一并执行；不改变协议、Schema或208期望。

## 标准采用 / Adoption

| 资源 | 本轮状态 | 版本/来源与许可处理 |
|---|---|---|
| JSON Schema/Ajv | 已有依赖，继续复用 | Ajv 8.20.0；协议Draft 2020-12注册表不动；产品实例独立 |
| Data Package/Data Resource | 上游Profile已固定，产品验证待WP1交付 | [Data Package 2.0](https://datapackage.org/standard/data-package/)、[Data Resource](https://datapackage.org/standard/data-resource/)；上游实际声明Draft-07，不改写方言 |
| Extensions | 采用受限产品扩展 | [官方扩展机制](https://datapackage.org/standard/extensions/)；产品字段在boundx，不将JSON payload Schema误放Table Schema字段 |
| SKOS/JSON-LD | 仅字段映射参考 | [SKOS 2009](https://www.w3.org/TR/skos-reference/)、[JSON-LD 1.1](https://www.w3.org/TR/json-ld11/)；ID/label/alias可作映射，未声称符合性，无RDF运行时，无全文导入 |
| 24765/SEVOCAB | 未采用内容 | [ISO目录](https://www.iso.org/standard/71952.html)；未取得内容复制许可，不导入词表或训练 |
| ESCO/SCIM | 仅概念参考 | [ESCO](https://esco.ec.europa.eu/en/classification)、[SCIM RFC7643](https://datatracker.ietf.org/doc/html/rfc7643)；不复制职业数据库，不实现SCIM；岗位/名册状态不是任务授权 |
| FrameNet/PropBank | 未采用 | 不导入语料、模型或运行时，不声称兼容 |

Data Package官方2.0 Profile原文包含Data Resource约束，固定于vendor/datapackage-2.0/datapackage.json。来源：https://datapackage.org/profiles/2.0/datapackage.json；下载日期2026-09-14；SHA-256 `34cf87616814215bc57b66d3cbabc4fc4f453de90710a0236d4924992f69623b`。未删改上游Schema字段；产品限制另定义。

上游[许可原文](https://raw.githubusercontent.com/frictionlessdata/datapackage/main/LICENSE.md)为Unlicense，随副本保留；SHA-256 `88d9b4eb60579c191ec391ca04c16130572d7eedc4a86daa58bf28c6e14c9bcd`。这是第三方资源许可记录，不更改BoundX根LICENSE。其他参考未复制内容，不声称已经完成额外资源的许可批准。

## 验收门禁 / Acceptance gates

120条种子已提供但未独立审阅为金标。150次是v2规定的120次初始加30次固定复测，不是新增用例请求；当前尚无真实Host运行证据。不得把这两项写为通过。实现、回放、金标审阅与真实Host验收分别报告。
