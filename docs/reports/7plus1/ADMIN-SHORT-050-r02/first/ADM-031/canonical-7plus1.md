# ADM-031 推理资源检查

## 原文

OPS 只在测试环境执行推理健康检查，内存使用不得超过 2 GB，最多重试 2 次。生成 inference-health.md 并提交给 PM。若内存超限，立即停止检查；不得切换到生产环境。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- inference-health.md 并 [RESOLVED]
  - 对象=inference-health.md 并；主体=；角色=；条件=null；作用域={"expr_id":"p1:b4ed2b67f16678b03129ad68","kind":"ITEM","entity_node_id":"p1:4391b5e021019f4ffa791e83","source_span_ids":["p1:10a52df7629ddbfd28259cb6","p1:62f045c5832f604f1181c8af"],"relation_ids":["p1:3c1acbc75b2d4b52d9e8ae4b"]}；数量=null
  - 证据：[42,44) undefined；[42,72) undefined；[45,66) undefined

### A · UNRESOLVED

- REQUIRED 生成 inference-health.md 并 [RESOLVED]
  - 对象=inference-health.md 并；主体=；角色=；条件=null；作用域={"expr_id":"p1:b4ed2b67f16678b03129ad68","kind":"ITEM","entity_node_id":"p1:4391b5e021019f4ffa791e83","source_span_ids":["p1:10a52df7629ddbfd28259cb6","p1:62f045c5832f604f1181c8af"],"relation_ids":["p1:3c1acbc75b2d4b52d9e8ae4b"]}；数量=null
  - 证据：[42,44) undefined；[42,72) undefined；[45,66) undefined
- REQUIRED 提交 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[66,68) undefined；[42,72) undefined；[70,72) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · UNRESOLVED

- 检查 [UNRESOLVED]
  - 对象=检查；主体=；角色=；条件={"expr_id":"p1:5f49bc9360fb8e3cf137ee09","op":"STATE_REF","state_node_id":"p1:f301d21b934a4437e649d14d","source_span_ids":["p1:c7bd6ce3d840ca446e11af3b"],"relation_ids":[]}；作用域={"expr_id":"p1:f79baecd19e1f1760c3bde42","kind":"ITEM","entity_node_id":"p1:9c6a068b546660b36b941f9e","source_span_ids":["p1:ef29e222cd97318674f38f28","p1:82ff460effa07156c01dcf4a"],"relation_ids":["p1:d0104253ce9d2dc55f08a5ee"]}；数量=null
  - 证据：[81,83) undefined；[79,85) undefined；[83,85) undefined；[0,97) undefined；[73,78) undefined

### B · RESOLVED

- FORBIDDEN 切换 生产环境 [RESOLVED]
  - 对象=生产环境；主体=；角色=；条件=null；作用域={"expr_id":"p1:f70296634ca9e73b4f13a6b4","kind":"ITEM","entity_node_id":"p1:86a3b0c38e604b53a6d5ae0d","source_span_ids":["p1:3112d384e2d505c0b622afbf","p1:806e273b7df484ff28eaa398"],"relation_ids":["p1:7d6475d5a8b1bea05c4e915e"]}；数量=null
  - 证据：[88,90) undefined；[86,95) undefined；[91,95) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_QUANTIFICATION: No local typed quantity target
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
