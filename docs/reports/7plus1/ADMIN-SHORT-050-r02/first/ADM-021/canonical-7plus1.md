# ADM-021 数据完整性核查

## 原文

分析员赵宁读取 orders.csv，检查订单号缺失和重复情况，生成 data-quality.md。只有全部记录都检查完且报告已生成，任务才完成。不得更改原始数据，整个核查须在 45 分钟内完成。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- data-quality.md [RESOLVED]
  - 对象=data-quality.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:7fa41e62d37048b52e81eb0b","kind":"ITEM","entity_node_id":"p1:4aa2af79c4701d079b640c46","source_span_ids":["p1:182eb8b3f7a82a90a24273e4","p1:975cd344dda93aaefba95565"],"relation_ids":["p1:55138f3caf3ce093dfdf8062"]}；数量=null
  - 证据：[32,34) undefined；[32,50) undefined；[35,50) undefined；[0,5) undefined；[0,18) undefined

### A · UNRESOLVED

- REQUIRED 检查 重复情况 [RESOLVED]
  - 对象=重复情况；主体=分析员赵宁；角色=；条件=null；作用域={"expr_id":"p1:3cd4c47eaa5a7c41fea04a98","kind":"ITEM","entity_node_id":"p1:e87572d2f901122dae080aa0","source_span_ids":["p1:e6e8bb9e087096ec11bd8a05","p1:28389f4412565a1e14b18768"],"relation_ids":["p1:1d2972a94c54b28512afe384"]}；数量=null
  - 证据：[19,21) undefined；[19,31) undefined；[27,31) undefined；[0,5) undefined；[0,18) undefined
- REQUIRED 生成 data-quality.md [RESOLVED]
  - 对象=data-quality.md；主体=分析员赵宁；角色=；条件=null；作用域={"expr_id":"p1:7fa41e62d37048b52e81eb0b","kind":"ITEM","entity_node_id":"p1:4aa2af79c4701d079b640c46","source_span_ids":["p1:182eb8b3f7a82a90a24273e4","p1:975cd344dda93aaefba95565"],"relation_ids":["p1:55138f3caf3ce093dfdf8062"]}；数量=null
  - 证据：[32,34) undefined；[32,50) undefined；[35,50) undefined；[0,5) undefined；[0,18) undefined

### P · UNRESOLVED

- 分析员赵宁 [PERFORMER] [RESOLVED]
  - 对象=；主体=；角色=分析员赵宁:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=分析员赵宁:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=分析员赵宁:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=分析员赵宁:PERFORMER；条件=null；作用域=null；数量=null
  - 证据：[0,5) undefined；[0,18) undefined；[5,7) undefined；[19,21) undefined；[19,31) undefined；[32,34) undefined；[32,50) undefined；[76,78) undefined；[74,82) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · UNRESOLVED

- 完成 [RESOLVED]
  - 对象=；主体=；角色=；条件={"expr_id":"p1:042a2befcaa4ef2c65296932","op":"AND","operand_expr_ids":["p1:51c83fabaacaac4c6165c3b6","p1:8aa9796a5a0a868108973c62"],"source_span_ids":["p1:ca8f236e29773ad126128323","p1:d37b9f5c8fc095bdf23e5766","p1:1c7e822f00e49cd3587be8d2","p1:0a482b35c4bea58c8830c409"],"relation_ids":["p1:77ef5dccf7ee96a6b633e5cd","p1:f6e2b31961a72314749b9582"]}；作用域=null；数量=null
  - 证据：[71,73) undefined；[68,73) undefined；[51,61) undefined；[51,67) undefined；[61,67) undefined
- 完成 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[96,98) undefined；[83,98) undefined

### B · RESOLVED

- FORBIDDEN 更改 原始数据 [RESOLVED]
  - 对象=原始数据；主体=分析员赵宁；角色=；条件=null；作用域={"expr_id":"p1:b19fca835fd04ee7862df9a6","kind":"ITEM","entity_node_id":"p1:0f2908ed9f7bda78aff69231","source_span_ids":["p1:6e00da639ca1d32213aad9b6","p1:1f44eeec66ad6a9d568747fb"],"relation_ids":["p1:a192f9d9b8b25db1a09d669b"]}；数量=null
  - 证据：[76,78) undefined；[74,82) undefined；[78,82) undefined；[0,5) undefined；[0,18) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Completion predicate has no explicit unique completion domain

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
