# ADM-038 审批后只读检查

## 原文

负责人丁岚批准检查申请后，QA 才能读取 production-snapshot.csv 并生成 snapshot-review.md。未经批准不得读取该快照。PM 接收报告；此次不得连接生产数据库。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

无实际条目。

### A · PARSER_COVERAGE_FAILURE

无实际条目。

### P · PARSER_COVERAGE_FAILURE

- 负责人丁岚 [PERFORMER] [RESOLVED]
  - 对象=；主体=；角色=负责人丁岚:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=负责人丁岚:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=负责人丁岚:PERFORMER；条件=null；作用域=null；数量=null
  - 证据：[0,5) undefined；[0,12) undefined；[5,7) undefined；[46,48) undefined；[13,67) undefined；[92,94) undefined；[88,99) undefined

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 连接 生产数据库 [RESOLVED]
  - 对象=生产数据库；主体=负责人丁岚；角色=；条件=null；作用域={"expr_id":"p1:31163a04c382e9240a9f2f11","kind":"ITEM","entity_node_id":"p1:2671ec3a26b62d4630546377","source_span_ids":["p1:3c7f7bd559fefc37fabfb496","p1:eefdaeb716abc035a0815783"],"relation_ids":["p1:942bc033a747db56e8b7fd26"]}；数量=null
  - 证据：[92,94) undefined；[88,99) undefined；[94,99) undefined；[0,5) undefined；[0,12) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
