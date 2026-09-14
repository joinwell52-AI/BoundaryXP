# 独立语义包 / Independent Semantic Packages

状态：目录验证、受限ZIP、Registry、L1/L2迁移及候选回放入口已实现；完整Host实测、金标审阅和全部验收仍未完成。

## 已实现 / Implemented

描述符datapackage.json采用固定Data Package 2.0 Profile及BoundX封闭扩展。资源逐字节SHA-256；完整描述符使用现有Core的JCS摘要工具计算包digest，不向自身写入digest。JSON payload Schema在resources[].boundx.payload_schema，Table Schema不挪作他用。上游Draft-07与协议Draft 2020-12分开注册。

目录入口src/product/packages.mjs:validateDirectory不依赖Python，不联网取Schema/包/制度。它校验声明、哈希、资源身份、独立L1与窄L3 payload，并拒绝越界路径、链接、特殊文件、重复/未声明资源、大小超限。L2校验包括动作Schema、ID、计数与动作/实体/角色/风险引用；不能据此声称全部自然语言语义正确。

## ZIP与导入 / ZIP and Import

src/product/archive.mjs实现有界普通ZIP子集：stored与deflate、ASCII或明确UTF-8文件名。依据[PKWARE APPNOTE 6.3.10](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)的记录格式自行实现，未复制规范或引入第三方ZIP运行库。

拒绝加密、分卷、ZIP64、自解压前缀、流式data descriptor、extra fields、链接/特殊文件及重叠记录。此保守子集不保证接受任意工具生成的ZIP；不支持的变体明确报ZIP_UNSUPPORTED，可改用普通目录或本产品build命令。ZIP时间与注释不用于内容身份，资源仍按原始字节SHA-256验证。

压缩输入上限10MiB，累计展开上限10MiB，单资源2MiB，描述符256KiB；先核对全部记录和展开上限，再有界解压，CRC/长度验证后写入一次性目录，最后执行相同包校验。Registry通过暂存目录及rename提交，导入不等于启用；同版本异摘要拒绝。

Supported ZIP is intentionally conservative: stored/deflated ordinary files only, with no encryption, extra fields, streaming descriptors, ZIP64 or split archives. Unsupported ZIP variants fail explicitly; directories remain supported. Package digests do not depend on compression. These are bounded local import controls, not production multi-tenant authentication or a formal security proof.

```text
node cli.mjs pack build domain-packs/l1/core-ontology --output core-ontology.zip
node cli.mjs pack validate core-ontology.zip
node cli.mjs pack import core-ontology.zip
node cli.mjs pack list
```

build默认拒绝覆盖；导入依赖包必须已存在于本地Registry。不要将客户真实包放入本仓库，也不要提交本地测试生成的ZIP。

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
