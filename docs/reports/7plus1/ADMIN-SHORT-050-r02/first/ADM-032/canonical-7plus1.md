# ADM-032 检索配置复核

## 原文

DEV 读取 retrieval.yaml，按 SEARCH-SPEC-5 的 v1.2 版本复核索引和过滤配置，生成 retrieval-review.md。不得调整召回阈值或重建索引。QA 复核通过后，PM 汇报 ADMIN。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- retrieval-review.md [RESOLVED]
  - 对象=retrieval-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:93da51e2447ab2687c2d987d","kind":"ITEM","entity_node_id":"p1:33f597f3f6526d98fa5bd2f2","source_span_ids":["p1:bd9181e2816ee6acb1fe998b","p1:08f59047e19fb7f4e1eeeccb"],"relation_ids":["p1:93a3da1950be5dc3fd5dc31a"]}；数量=null
  - 证据：[57,59) undefined；[57,79) undefined；[60,79) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 生成 retrieval-review.md [RESOLVED]
  - 对象=retrieval-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:93da51e2447ab2687c2d987d","kind":"ITEM","entity_node_id":"p1:33f597f3f6526d98fa5bd2f2","source_span_ids":["p1:bd9181e2816ee6acb1fe998b","p1:08f59047e19fb7f4e1eeeccb"],"relation_ids":["p1:93a3da1950be5dc3fd5dc31a"]}；数量=null
  - 证据：[57,59) undefined；[57,79) undefined；[60,79) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · RESOLVED

- SPEC-5 [RESOLVED]
  - 对象=SPEC-5；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[31,37) undefined；[22,56) undefined；[0,116) undefined
- v1.2 [RESOLVED]
  - 对象=v1.2；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[40,44) undefined；[22,56) undefined；[0,116) undefined

### C · ABSENT

无实际条目。

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 调整 阈值、重建索引 [RESOLVED]
  - 对象=阈值/重建索引；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[82,84) undefined；[80,93) undefined；[86,88) undefined；[89,93) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Multiple operands without an explicit supported set connector
- UNRESOLVED_RELATION: No supported native semantic construction for this clause
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
