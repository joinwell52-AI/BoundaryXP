# ADM-005 轨道机运行检查

## 原文

OPS 按照 OPS-RULE-12 检查轨道机当前运行状态和最近一小时的告警日志，生成 orbit-review.md。发现停机时，OPS 必须立即停止后续检查并向 PM 汇报。不得重启轨道机；未发现停机时，报告提交给 PM 即完成。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- orbit-review.md [RESOLVED]
  - 对象=orbit-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:635c5464975b1f88f1413578","kind":"ITEM","entity_node_id":"p1:8bc6bc15fac04aecd12aae8f","source_span_ids":["p1:6be53ba8a10f65ccb6a3d263","p1:44adf2ec4755399030854916"],"relation_ids":["p1:54efd737daee398f994e3774"]}；数量=null
  - 证据：[42,44) undefined；[42,60) undefined；[45,60) undefined

### A · UNRESOLVED

- REQUIRED 生成 orbit-review.md [RESOLVED]
  - 对象=orbit-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:635c5464975b1f88f1413578","kind":"ITEM","entity_node_id":"p1:8bc6bc15fac04aecd12aae8f","source_span_ids":["p1:6be53ba8a10f65ccb6a3d263","p1:44adf2ec4755399030854916"],"relation_ids":["p1:54efd737daee398f994e3774"]}；数量=null
  - 证据：[42,44) undefined；[42,60) undefined；[45,60) undefined
- REQUIRED 发现 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[61,63) undefined；[61,66) undefined
- REQUIRED 汇报 PM [RESOLVED]
  - 对象=PM；主体=；角色=；条件=null；作用域={"expr_id":"p1:ebe7d81e31017c337019ef71","kind":"ITEM","entity_node_id":"p1:df69cd7b92825f31c84b5f1c","source_span_ids":["p1:b6550812ddc4c7c8c720f241","p1:accef2ee686b45e317b5ea18"],"relation_ids":["p1:2855313c1317b8e1d9b830b7"]}；数量=null
  - 证据：[87,89) undefined；[67,89) undefined；[84,86) undefined

### P · RESOLVED

- PM [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=PM:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[84,86) undefined；[67,89) undefined；[87,89) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · RESOLVED

- 后续检查 [RESOLVED]
  - 对象=后续检查；主体=；角色=；条件=null；作用域={"expr_id":"p1:154d8f2f6d9033086445920e","kind":"ITEM","entity_node_id":"p1:a016bd9475786b46e931d8bd","source_span_ids":["p1:564129fb140b09ab4bf4f954","p1:accef2ee686b45e317b5ea18"],"relation_ids":["p1:cba45c564cc97bbf3240180c"]}；数量=null
  - 证据：[75,77) undefined；[67,89) undefined；[77,81) undefined；[0,119) undefined

### B · RESOLVED

- FORBIDDEN 重启 轨道机 [RESOLVED]
  - 对象=轨道机；主体=；角色=；条件=null；作用域={"expr_id":"p1:403d5e0555c846d9e0eef183","kind":"ITEM","entity_node_id":"p1:468262eb95c9966c76ebc538","source_span_ids":["p1:80fa6d0176fc3ee6514b7b98","p1:ec95e1d3a27df8e0bb130bbe"],"relation_ids":["p1:b133d2b9c71190b0e08dc97f"]}；数量=null
  - 证据：[92,94) undefined；[90,97) undefined；[94,97) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
