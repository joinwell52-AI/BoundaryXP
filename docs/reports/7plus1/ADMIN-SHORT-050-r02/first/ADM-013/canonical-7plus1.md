# ADM-013 依赖许可证核查

## 原文

DEV 读取 dependencies.lock，按 LICENSE-POLICY-4 核查直接依赖的许可证，生成 license-review.csv。范围不含间接依赖。发现缺少许可证信息时，必须在报告中标记为待确认，不得自动判为允许商用。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- license-review.csv [RESOLVED]
  - 对象=license-review.csv；主体=；角色=；条件=null；作用域={"expr_id":"p1:6cc3dc1d095d7ca4bccfa123","kind":"ITEM","entity_node_id":"p1:0f98b1cedf8b295ee2144d8c","source_span_ids":["p1:4643b22d9a935675e98cf241","p1:94cb90ffdef4018d03ea1959"],"relation_ids":["p1:075920daf544ad74e26c4103"]}；数量=null
  - 证据：[55,57) undefined；[55,76) undefined；[58,76) undefined

### A · UNRESOLVED

- REQUIRED 生成 license-review.csv [RESOLVED]
  - 对象=license-review.csv；主体=；角色=；条件=null；作用域={"expr_id":"p1:6cc3dc1d095d7ca4bccfa123","kind":"ITEM","entity_node_id":"p1:0f98b1cedf8b295ee2144d8c","source_span_ids":["p1:4643b22d9a935675e98cf241","p1:94cb90ffdef4018d03ea1959"],"relation_ids":["p1:075920daf544ad74e26c4103"]}；数量=null
  - 证据：[55,57) undefined；[55,76) undefined；[58,76) undefined
- REQUIRED 发现 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[86,88) undefined；[86,96) undefined
- REQUIRED 标记 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[103,105) undefined；[97,109) undefined
- REQUIRED 待 确认 [RESOLVED]
  - 对象=确认；主体=；角色=；条件=null；作用域={"expr_id":"p1:8c1e0bae0b58d491a0cb62f0","kind":"ITEM","entity_node_id":"p1:cf46231c4cf73299d9e53980","source_span_ids":["p1:5f3993f6b9484784cd975106","p1:54beddfe1996bce9375bf2b9"],"relation_ids":["p1:000c17c39b0ba2d01acac444"]}；数量=null
  - 证据：[106,107) undefined；[97,109) undefined；[107,109) undefined
- PERMITTED 商用 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[118,120) undefined；[110,120) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · RESOLVED

- POLICY-4 [RESOLVED]
  - 对象=POLICY-4；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[35,43) undefined；[25,54) undefined；[0,122) undefined

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 判 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[114,115) undefined；[110,120) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
