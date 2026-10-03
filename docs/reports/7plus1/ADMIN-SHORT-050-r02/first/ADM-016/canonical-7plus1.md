# ADM-016 数据库结构检查

## 原文

DEV 读取 schema.sql，依据 DB-SPEC-9 检查索引与约束声明，生成 schema-review.md。只允许离线分析，不得连接生产数据库。QA 确认索引和约束两类检查都完成后，任务结束。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- schema-review.md [RESOLVED]
  - 对象=schema-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:09853ea5356500731718bc92","kind":"ITEM","entity_node_id":"p1:99c0dcb09f63ce251e2287a3","source_span_ids":["p1:82e80934bc1d03bf3c7682e9","p1:a446fd0322ffd02eb30e59ea"],"relation_ids":["p1:1a40634f118eb1118fd13e51"]}；数量=null
  - 证据：[41,43) undefined；[41,60) undefined；[44,60) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 生成 schema-review.md [RESOLVED]
  - 对象=schema-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:09853ea5356500731718bc92","kind":"ITEM","entity_node_id":"p1:99c0dcb09f63ce251e2287a3","source_span_ids":["p1:82e80934bc1d03bf3c7682e9","p1:a446fd0322ffd02eb30e59ea"],"relation_ids":["p1:1a40634f118eb1118fd13e51"]}；数量=null
  - 证据：[41,43) undefined；[41,60) undefined；[44,60) undefined

### P · PARSER_COVERAGE_FAILURE

无实际条目。

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

- DB-SPEC-9 [RESOLVED]
  - 对象=DB-SPEC-9；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[21,30) undefined；[18,40) undefined；[0,104) undefined
- SPEC-9 [RESOLVED]
  - 对象=SPEC-9；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[24,30) undefined；[18,40) undefined；[0,104) undefined

### C · UNRESOLVED

- 结束 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[100,102) undefined；[98,102) undefined

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 连接 生产数据库 [RESOLVED]
  - 对象=生产数据库；主体=；角色=；条件=null；作用域={"expr_id":"p1:c115a15f8bc86fc61a20e980","kind":"ITEM","entity_node_id":"p1:73051548b340d4bb2fe6778e","source_span_ids":["p1:96581755a8658b1acc307013","p1:915fe3c088341dcfe5ef7610"],"relation_ids":["p1:37366396df2c71a528eec51c"]}；数量=null
  - 证据：[71,73) undefined；[69,78) undefined；[73,78) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Completion predicate has no explicit unique completion domain
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
