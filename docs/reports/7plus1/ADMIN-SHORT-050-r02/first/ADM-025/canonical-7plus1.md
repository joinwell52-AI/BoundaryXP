# ADM-025 迁移计划评审

## 原文

DEV 读取 migration-plan.md，检查回滚步骤和停机窗口说明，生成 migration-review.md。不得执行任何迁移或回滚操作。只有 QA 确认两类说明均完整，PM 才能向 ADMIN 提交评审结论。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- migration-review.md [RESOLVED]
  - 对象=migration-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:19372302f77292fb35bccde3","kind":"ITEM","entity_node_id":"p1:20d1fdc9b5d21d69dd76c2b3","source_span_ids":["p1:c6f9826e2ed67b462339394a","p1:f6815957cc11bbee6c161198"],"relation_ids":["p1:9bd027681f53e8c7dbedc9e0"]}；数量=null
  - 证据：[39,41) undefined；[39,61) undefined；[42,61) undefined

### A · UNRESOLVED

- REQUIRED 检查 停机窗口说明 [RESOLVED]
  - 对象=停机窗口说明；主体=；角色=；条件=null；作用域={"expr_id":"p1:22600098f053af3ff506e6d5","kind":"ITEM","entity_node_id":"p1:077562f831ada7559da19814","source_span_ids":["p1:d677023f36e27195ea551cab","p1:65f2f57811fe95a7e4520400"],"relation_ids":["p1:0f660beb40290a400f2d9c52"]}；数量=null
  - 证据：[25,27) undefined；[25,38) undefined；[32,38) undefined
- REQUIRED 生成 migration-review.md [RESOLVED]
  - 对象=migration-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:19372302f77292fb35bccde3","kind":"ITEM","entity_node_id":"p1:20d1fdc9b5d21d69dd76c2b3","source_span_ids":["p1:c6f9826e2ed67b462339394a","p1:f6815957cc11bbee6c161198"],"relation_ids":["p1:9bd027681f53e8c7dbedc9e0"]}；数量=null
  - 证据：[39,41) undefined；[39,61) undefined；[42,61) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[99,104) undefined；[92,111) undefined；[105,107) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 回滚操作 [RESOLVED]
  - 对象=回滚操作；主体=；角色=；条件=null；作用域={"expr_id":"p1:2d3eb194524cb8480df8612d","kind":"ITEM","entity_node_id":"p1:cbb535bb28a27f9eba7a1799","source_span_ids":["p1:716c44a0de6a610893301d6c","p1:90e4daff1dc793963eba03f1"],"relation_ids":["p1:4f0a7a24bfe3d659c1b2266b"]}；数量=null
  - 证据：[71,75) undefined；[62,75) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
