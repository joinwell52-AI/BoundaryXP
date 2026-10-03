# ADM-014 单元测试审阅

## 原文

QA 检查 unit-results.json 中的失败用例，生成 failures.md。DEV 只负责解释失败原因，不在本任务中修改实现。PM 汇总 QA 报告和 DEV 说明后提交给 ADMIN；不得重新运行测试。

## 实际 Canonical 7+1

### I · RESOLVED

- 失败原因 [RESOLVED]
  - 对象=失败原因；主体=；角色=；条件=null；作用域={"expr_id":"p1:bdb6e77906d43357e0758d5d","kind":"ITEM","entity_node_id":"p1:56e97e754bdcaab9ce5a8bfd","source_span_ids":["p1:8e578a24bcbec7ece1462e71","p1:6c80d77f6666f0affabc0dc1"],"relation_ids":["p1:fe4525771c45355b13c578ee"]}；数量=null
  - 证据：[55,59) undefined；[46,59) undefined；[0,111) undefined

### O · RESOLVED

- failures.md [RESOLVED]
  - 对象=failures.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:a67e596d7ea5d8636f16339d","kind":"ITEM","entity_node_id":"p1:0de018bf1ae59296bcbb6889","source_span_ids":["p1:a5078eae7fc9e672eddcaabc","p1:60054310b712e0149e957a24"],"relation_ids":["p1:0b434365dc2b940c6481fe2d"]}；数量=null
  - 证据：[31,33) undefined；[31,45) undefined；[34,45) undefined

### A · UNRESOLVED

- REQUIRED 生成 failures.md [RESOLVED]
  - 对象=failures.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:a67e596d7ea5d8636f16339d","kind":"ITEM","entity_node_id":"p1:0de018bf1ae59296bcbb6889","source_span_ids":["p1:a5078eae7fc9e672eddcaabc","p1:60054310b712e0149e957a24"],"relation_ids":["p1:0b434365dc2b940c6481fe2d"]}；数量=null
  - 证据：[31,33) undefined；[31,45) undefined；[34,45) undefined
- REQUIRED 解释 失败原因 [RESOLVED]
  - 对象=失败原因；主体=DEV；角色=；条件=null；作用域={"expr_id":"p1:8599022363bc37e0ff8c7385","kind":"ITEM","entity_node_id":"p1:56e97e754bdcaab9ce5a8bfd","source_span_ids":["p1:8e578a24bcbec7ece1462e71","p1:6c80d77f6666f0affabc0dc1"],"relation_ids":["p1:5847c84dc5fdf0ca9ca18211"]}；数量=null
  - 证据：[53,55) undefined；[46,59) undefined；[46,49) undefined；[55,59) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 修改 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[66,68) undefined；[60,70) undefined；[62,65) undefined
- FORBIDDEN 运行 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[105,107) undefined；[101,109) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Multiple operands without an explicit supported set connector
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
