# ADM-028 评测结果审阅

## 原文

QA 读取 evaluation.json，分别统计运行失败和语义错误，生成 evaluation-review.md。不得把程序运行成功等同于语义正确。PM 在报告复核后向 ADMIN 汇报，不得修改测试原文或标准答案。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- evaluation-review.md [RESOLVED]
  - 对象=evaluation-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:ae6a032b5cba40a4111702fd","kind":"ITEM","entity_node_id":"p1:72da634335b538f4ffe4d2e7","source_span_ids":["p1:5faba29d4ef0e21c74ebe44b","p1:b19233ea67a3b0712f2f0cd0"],"relation_ids":["p1:3f97030366fb0bbd38e8f96f"]}；数量=null
  - 证据：[36,38) undefined；[36,59) undefined；[39,59) undefined

### A · UNRESOLVED

- REQUIRED 生成 evaluation-review.md [RESOLVED]
  - 对象=evaluation-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:ae6a032b5cba40a4111702fd","kind":"ITEM","entity_node_id":"p1:72da634335b538f4ffe4d2e7","source_span_ids":["p1:5faba29d4ef0e21c74ebe44b","p1:b19233ea67a3b0712f2f0cd0"],"relation_ids":["p1:3f97030366fb0bbd38e8f96f"]}；数量=null
  - 证据：[36,38) undefined；[36,59) undefined；[39,59) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[88,93) undefined；[77,96) undefined；[94,96) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 运行 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[65,67) undefined；[60,76) undefined
- FORBIDDEN 等同 语义正确 [RESOLVED]
  - 对象=语义正确；主体=；角色=；条件=null；作用域={"expr_id":"p1:870495fe0dd3a7ded878d109","kind":"ITEM","entity_node_id":"p1:e629213b0a18c1b80f38030a","source_span_ids":["p1:81680270bc5f2a0963934c59","p1:459c65e2e25548ac8a5fc247"],"relation_ids":["p1:8071fc418d13a634f6fd252e"]}；数量=null
  - 证据：[69,71) undefined；[60,76) undefined；[72,76) undefined
- FORBIDDEN 修改 标准答案 [RESOLVED]
  - 对象=标准答案；主体=；角色=；条件=null；作用域={"expr_id":"p1:c8e1c6c7dcb56d1437400c5c","kind":"ITEM","entity_node_id":"p1:0f8e1cf1b66267eabd5748cc","source_span_ids":["p1:3cfdbd73688c15a59e07e2ad","p1:cfca98f56053e1e0f6c84264"],"relation_ids":["p1:e61217f2e985d16b15e5ce7a"]}；数量=null
  - 证据：[99,101) undefined；[97,110) undefined；[106,110) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
