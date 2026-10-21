# ADM-017 构建产物校验

## 原文

QA 读取 checksums.txt，核验 dist 目录中的全部压缩包，生成 package-check.md。任何一个校验值不匹配时，必须停止核验并向 PM 汇报。不得删除或重新生成压缩包。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- package-check.md [RESOLVED]
  - 对象=package-check.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:02d9fa2f2dddbcade681bdbf","kind":"ITEM","entity_node_id":"p1:bc6a44511dfb896f72fbc9d4","source_span_ids":["p1:d5b4be5fd876dbc8744365ca","p1:ac6c49fc389cca76307c1e3a"],"relation_ids":["p1:5174cffd5b7deecf574f4d56"]}；数量=null
  - 证据：[38,40) undefined；[38,57) undefined；[41,57) undefined

### A · UNRESOLVED

- REQUIRED 生成 package-check.md [RESOLVED]
  - 对象=package-check.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:02d9fa2f2dddbcade681bdbf","kind":"ITEM","entity_node_id":"p1:bc6a44511dfb896f72fbc9d4","source_span_ids":["p1:d5b4be5fd876dbc8744365ca","p1:ac6c49fc389cca76307c1e3a"],"relation_ids":["p1:5174cffd5b7deecf574f4d56"]}；数量=null
  - 证据：[38,40) undefined；[38,57) undefined；[41,57) undefined
- REQUIRED 汇报 PM [RESOLVED]
  - 对象=PM；主体=；角色=；条件=null；作用域={"expr_id":"p1:da85e6c5f5c510608a4cf1b6","kind":"ITEM","entity_node_id":"p1:96fd7e30aa348e63c67c35af","source_span_ids":["p1:bf7b7da071fa9e352ef20b11","p1:afbb01c14ddebb42541d481e"],"relation_ids":["p1:33f0ac6569264a0d6a59d92d"]}；数量=null
  - 证据：[82,84) undefined；[70,84) undefined；[79,81) undefined

### P · RESOLVED

- PM [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=PM:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[79,81) undefined；[70,84) undefined；[82,84) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · RESOLVED

- 核验 [RESOLVED]
  - 对象=核验；主体=；角色=；条件=null；作用域={"expr_id":"p1:04b3c87fb587f12e34f6b622","kind":"ITEM","entity_node_id":"p1:1f7c6a3884dda76f74ba85f4","source_span_ids":["p1:d07bab6dc9ed65db82a25be2","p1:afbb01c14ddebb42541d481e"],"relation_ids":["p1:8f8e76ef522261c9efe92668"]}；数量=null
  - 证据：[72,74) undefined；[70,84) undefined；[74,76) undefined；[0,99) undefined

### B · UNRESOLVED

- FORBIDDEN 生成 压缩包 [RESOLVED]
  - 对象=压缩包；主体=；角色=；条件=null；作用域={"expr_id":"p1:0181d7ebb92226673747aff2","kind":"ITEM","entity_node_id":"p1:5174b04b4f75ae631ff8f9a6","source_span_ids":["p1:8e92114f2ace61934a5297ce","p1:b0ee52956d6ecdbd68451e3e"],"relation_ids":["p1:91457bed8e3a74db3c7c9998"]}；数量=null
  - 证据：[92,94) undefined；[85,97) undefined；[94,97) undefined
- FORBIDDEN 删除 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[87,89) undefined；[85,97) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
