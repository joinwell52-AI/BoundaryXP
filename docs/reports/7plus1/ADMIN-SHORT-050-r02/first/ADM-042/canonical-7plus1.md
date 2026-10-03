# ADM-042 只读与可选动作

## 原文

DEV 必须读取 package.json，可以检查 README.md，并生成 package-review.md。不得修改这两个文件。QA 复核报告，PM 负责向 ADMIN 提交。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

- ADMIN [RESOLVED]
  - 对象=ADMIN；主体=；角色=；条件=null；作用域={"expr_id":"p1:1edde4f96a20f766757617dc","kind":"ITEM","entity_node_id":"p1:62c8d20c59de2f383138412f","source_span_ids":["p1:f7211c150a4dbaec784b2b8e","p1:852538548cfc18669b168b09"],"relation_ids":["p1:6fb5441dd80d5d94a90d069c"]}；数量=null
  - 证据：[84,89) undefined；[77,92) undefined；[0,94) undefined
- package.json [RESOLVED]
  - 对象=package.json；主体=；角色=；条件=null；作用域={"expr_id":"p1:9ca951f3f3b3a98dc9e75f7b","kind":"ITEM","entity_node_id":"p1:a303a4966b74722c93c551e9","source_span_ids":["p1:587e4ed1e963872165edbe91","p1:4528b4b7b6d0a336b3795780"],"relation_ids":["p1:1460aad2b57aa6be1ee9f113"]}；数量=null
  - 证据：[9,21) undefined；[0,21) undefined；[6,8) undefined
- README.md [RESOLVED]
  - 对象=README.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:d01c9d815a76ab8521a37832","kind":"ITEM","entity_node_id":"p1:e3729d6434e7af0d4386573a","source_span_ids":["p1:40ad33a020b0892acecdf850","p1:2a5b3c135c692e85432d88ea"],"relation_ids":["p1:1323f7236f9d85550684629c"]}；数量=null
  - 证据：[27,36) undefined；[22,36) undefined；[24,26) undefined

### O · PARSER_COVERAGE_FAILURE

- package-review.md [RESOLVED]
  - 对象=package-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:8263d3dac977e3625d6f3e8e","kind":"ITEM","entity_node_id":"p1:28039c1a6052c7db9301a6e2","source_span_ids":["p1:807f6c8abc939b0260d31bb2","p1:916a9882aab8d0ffc1ceaf7b"],"relation_ids":["p1:2c99f7d8b27fd6cbce9c0ba1"]}；数量=null
  - 证据：[38,40) undefined；[37,58) undefined；[41,58) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 读取 package.json [RESOLVED]
  - 对象=package.json；主体=；角色=；条件=null；作用域={"expr_id":"p1:64fc0a4b1949d4e3345bb325","kind":"ITEM","entity_node_id":"p1:a303a4966b74722c93c551e9","source_span_ids":["p1:587e4ed1e963872165edbe91","p1:4528b4b7b6d0a336b3795780"],"relation_ids":["p1:27060057ed08ac9d33ba4c5c"]}；数量=null
  - 证据：[6,8) undefined；[0,21) undefined；[9,21) undefined
- PERMITTED 检查 README.md [RESOLVED]
  - 对象=README.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:3be8cb50ee27a91945e81b0e","kind":"ITEM","entity_node_id":"p1:e3729d6434e7af0d4386573a","source_span_ids":["p1:40ad33a020b0892acecdf850","p1:2a5b3c135c692e85432d88ea"],"relation_ids":["p1:92bbc1e2e5321804b6cef802"]}；数量=null
  - 证据：[24,26) undefined；[22,36) undefined；[27,36) undefined
- REQUIRED 生成 package-review.md [RESOLVED]
  - 对象=package-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:8263d3dac977e3625d6f3e8e","kind":"ITEM","entity_node_id":"p1:28039c1a6052c7db9301a6e2","source_span_ids":["p1:807f6c8abc939b0260d31bb2","p1:916a9882aab8d0ffc1ceaf7b"],"relation_ids":["p1:2c99f7d8b27fd6cbce9c0ba1"]}；数量=null
  - 证据：[38,40) undefined；[37,58) undefined；[41,58) undefined
- REQUIRED ADMIN 提交 [RESOLVED]
  - 对象=ADMIN 提交；主体=；角色=；条件=null；作用域={"expr_id":"p1:b57668140713e1cd21544fe1","kind":"ITEM","entity_node_id":"p1:5ed66418661846e3d33bc4f4","source_span_ids":["p1:2b1caeda94fe5cb33a45d241","p1:852538548cfc18669b168b09"],"relation_ids":["p1:4d696e1522125db9c0c64189"]}；数量=null
  - 证据：[84,92) undefined；[77,92) undefined

### P · PARSER_COVERAGE_FAILURE

无实际条目。

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 修改 package-review.md [UNRESOLVED]
  - 对象=package-review.md；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[61,63) undefined；[59,68) undefined；[41,58) undefined；[37,58) undefined

## 未决项

- UNRESOLVED_COREFERENCE: Requested cardinality does not identify the complete declaration set; no unique subset
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
