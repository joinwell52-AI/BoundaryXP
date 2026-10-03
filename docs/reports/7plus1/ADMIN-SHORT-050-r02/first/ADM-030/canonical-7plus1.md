# ADM-030 训练数据清单审计

## 原文

数据员苏明读取 training-index.csv，核查每项数据的来源与许可记录，生成 training-audit.md。来源或许可缺失的条目应标为待确认。不得下载新数据，不得启动训练；QA 负责复核。

## 实际 Canonical 7+1

### I · RESOLVED

- 复核 [RESOLVED]
  - 对象=复核；主体=；角色=；条件=null；作用域={"expr_id":"p1:7558f58cbeed6ee7334aeb5a","kind":"ITEM","entity_node_id":"p1:8314f44d5eb05d54d2110e65","source_span_ids":["p1:2c10be4383962cebf7d98df7","p1:6f09480280b3042e46341599"],"relation_ids":["p1:53a1272fcdfd7c39f35e1005"]}；数量=null
  - 证据：[100,102) undefined；[95,102) undefined；[0,104) undefined

### O · RESOLVED

- training-audit.md [RESOLVED]
  - 对象=training-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:7a51e99e6d4febb42ea80c1a","kind":"ITEM","entity_node_id":"p1:cdb655615e43de1086ef3cec","source_span_ids":["p1:5b88122344a786ba198c1a47","p1:dcce9ce140838e207ebe4c04"],"relation_ids":["p1:711708bc54126f396d1ff55b"]}；数量=null
  - 证据：[42,44) undefined；[42,62) undefined；[45,62) undefined

### A · UNRESOLVED

- REQUIRED 生成 training-audit.md [RESOLVED]
  - 对象=training-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:7a51e99e6d4febb42ea80c1a","kind":"ITEM","entity_node_id":"p1:cdb655615e43de1086ef3cec","source_span_ids":["p1:5b88122344a786ba198c1a47","p1:dcce9ce140838e207ebe4c04"],"relation_ids":["p1:711708bc54126f396d1ff55b"]}；数量=null
  - 证据：[42,44) undefined；[42,62) undefined；[45,62) undefined
- REQUIRED 标 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[74,75) undefined；[63,79) undefined
- REQUIRED 待 确认 [RESOLVED]
  - 对象=确认；主体=；角色=；条件=null；作用域={"expr_id":"p1:86f9b2b14abb79b969c613aa","kind":"ITEM","entity_node_id":"p1:a3467950bd6fce01ef28f8f7","source_span_ids":["p1:c73118c99013cf4532fbf972","p1:16601291727f5d74087da47f"],"relation_ids":["p1:24bd243e7453b1a8e81da51d"]}；数量=null
  - 证据：[76,77) undefined；[63,79) undefined；[77,79) undefined
- REQUIRED 复核 [RESOLVED]
  - 对象=复核；主体=QA；角色=；条件=null；作用域={"expr_id":"p1:a5d43b0550a896e4017b6ed8","kind":"ITEM","entity_node_id":"p1:8314f44d5eb05d54d2110e65","source_span_ids":["p1:2c10be4383962cebf7d98df7","p1:6f09480280b3042e46341599"],"relation_ids":["p1:233a541298e7cfbd882f8194"]}；数量=null
  - 证据：[100,102) undefined；[95,102) undefined；[95,97) undefined

### P · RESOLVED

- QA [PERFORMER] [RESOLVED]
  - 对象=；主体=；角色=QA:PERFORMER；条件=null；作用域=null；数量=null
  - 证据：[95,97) undefined；[95,102) undefined；[100,102) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 下载 新数据 [RESOLVED]
  - 对象=新数据；主体=；角色=；条件=null；作用域={"expr_id":"p1:0490b4d8407851231c029128","kind":"ITEM","entity_node_id":"p1:5762d727c217a02865a7f547","source_span_ids":["p1:4005e30893339490f5ba9805","p1:b87a38844df829f1e95ea23c"],"relation_ids":["p1:074692fe38ebce2ab381bfb1"]}；数量=null
  - 证据：[82,84) undefined；[80,87) undefined；[84,87) undefined
- FORBIDDEN 启动 训练 [RESOLVED]
  - 对象=训练；主体=；角色=；条件=null；作用域={"expr_id":"p1:003a9914e8d805350f201986","kind":"ITEM","entity_node_id":"p1:4c3022161c9b943fe53a4d06","source_span_ids":["p1:7a9b5d7dd7d64e29001bdea9","p1:d51728fb0898045985eabdbe"],"relation_ids":["p1:f2dba452556d7007d3d06929"]}；数量=null
  - 证据：[90,92) undefined；[88,94) undefined；[92,94) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
