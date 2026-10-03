# ADM-035 回归结果对比

## 原文

QA 读取 before.json 和 after.json，对比失败用例及耗时变化，生成 regression-diff.md。必须分别列出新增失败和已消失失败。不得修改 Parser、模型或阈值，PM 将结果提交给 ADMIN。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- regression-diff.md [RESOLVED]
  - 对象=regression-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:c35860a14501f2300ffaf7c8","kind":"ITEM","entity_node_id":"p1:f406b8b72b3ae3bb2c42b5ab","source_span_ids":["p1:c016fc678c0c7a1bbe0b4d73","p1:6cdf8ea0b019ed14fdcf0af2"],"relation_ids":["p1:8248d8a875f7f07dccc644aa"]}；数量=null
  - 证据：[43,45) undefined；[43,64) undefined；[46,64) undefined

### A · PARSER_COVERAGE_FAILURE

- REQUIRED 生成 regression-diff.md [RESOLVED]
  - 对象=regression-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:c35860a14501f2300ffaf7c8","kind":"ITEM","entity_node_id":"p1:f406b8b72b3ae3bb2c42b5ab","source_span_ids":["p1:c016fc678c0c7a1bbe0b4d73","p1:6cdf8ea0b019ed14fdcf0af2"],"relation_ids":["p1:8248d8a875f7f07dccc644aa"]}；数量=null
  - 证据：[43,45) undefined；[43,64) undefined；[46,64) undefined
- REQUIRED 列出 失败、失败 [RESOLVED]
  - 对象=失败/失败；主体=；角色=；条件=null；作用域={"expr_id":"p1:6e857f818d95f4fb02ce6a52","kind":"UNION","operand_expr_ids":["p1:ae24ee5fdb19b3e06e8dce3b","p1:74548e79c8465ff9bb1652ea"],"source_span_ids":["p1:28e87e7c474aa980c995b7c3"],"relation_ids":["p1:793926b2a95c37da40af78e9","p1:2d604829dc16f1d0244b7564"]}；数量=null
  - 证据：[69,71) undefined；[65,81) undefined；[73,75) undefined；[79,81) undefined

### P · PARSER_COVERAGE_FAILURE

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[110,115) undefined；[100,115) undefined；[106,108) undefined

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 修改 阈值 [RESOLVED]
  - 对象=阈值；主体=；角色=；条件=null；作用域={"expr_id":"p1:60a44740dcc46abe40b6f6f1","kind":"ITEM","entity_node_id":"p1:32839ccff1cbfac351a34c60","source_span_ids":["p1:4a901a3146c995df4b534a47","p1:55a3df16c0383a8e6555e320"],"relation_ids":["p1:314b92203775bc306a63bcb5"]}；数量=null
  - 证据：[84,86) undefined；[82,99) undefined；[97,99) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
