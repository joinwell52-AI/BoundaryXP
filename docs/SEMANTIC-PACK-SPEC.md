# 独立语义包 / Independent Semantic Packages

状态：目录验证与L1迁移已实现；ZIP、Registry、L2增量及完整Host链路仍在实施，不能据本文声称全部交付。

## 已实现 / Implemented

描述符datapackage.json采用固定Data Package 2.0 Profile及BoundX封闭扩展。资源逐字节SHA-256；完整描述符使用现有Core的JCS摘要工具计算包digest，不向自身写入digest。JSON payload Schema在resources[].boundx.payload_schema，Table Schema不挪作他用。上游Draft-07与协议Draft 2020-12分开注册。

目录入口src/product/packages.mjs:validateDirectory不依赖Python，不联网取Schema/包/制度。它校验声明、哈希、资源身份、独立L1与窄L3 payload，并拒绝越界路径、链接、特殊文件、重复/未声明资源、大小超限。L2 payload深度校验和ZIP原子导入仍待后续工作包完成，不将目录验证等同安全ZIP导入。

## L1逐字段迁移 / L1 Field Migration

新真相源：domain-packs/l1/core-ontology/ontology.json，core-ontology@1.1.0。

| 原字段 | 归类与落点 |
|---|---|
| operations | 语义数据：原样迁移到独立L1，不执行正则 |
| modalities | 语义数据：原样迁移到独立L1 |
| pack.entityMetaTypes、pack.roleMetaModel | 语义元数据：迁移独立L1，不授予权限 |
| schema、pack的旧身份/状态/维度/兼容信息 | 旧研究适配器兼容元数据；保留原身份用于旧L2检查，不冒称新物理包身份 |
| reference_prefix、executor_duty、executor_nominal_end | 解析器匹配实现，保留python/semantic_lexicon.json |
| incomplete_argument_prefix、recipient_only_argument、completion_reference | 解析器匹配实现，保留原处 |
| completion、approval_context、non_action、unsafe_argument、guard_prefix、trim_prefix | 解析器匹配实现，保留原处 |
| semantic_actions.lark | 研究文法，保持适配器层，不进入语义包 |

python/semantic_data.py验证L1资源摘要后组合兼容视图。operations/modalities及语义元类型不再有两份人工维护源；旧研究接口仍非标准BXP生产者。

Independent distribution does not remove dependencies. L1 semantic data is model-independent; parser grammar and regular expressions stay outside the package. Package acceptance, activation and task execution authority are separate states.
