# ADM-040 停止与恢复边界

## 原文

OPS 检查 service.log，生成 operation-review.md。发现高危告警时立即停止检查并通知 PM；只有 PM 明确批准继续后才能恢复检查。不得自行重启服务。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- operation-review.md [RESOLVED]
  - 对象=operation-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:f3c962118cbd1624dbe38cb6","kind":"ITEM","entity_node_id":"p1:bdf8a681b03fe5d4941bceeb","source_span_ids":["p1:646c19e9b9668b0576aeb959","p1:b9d7a8fc6790364ba46480a9"],"relation_ids":["p1:2d7e8a22918229324e77a1b7"]}；数量=null
  - 证据：[19,21) undefined；[19,41) undefined；[22,41) undefined

### A · UNRESOLVED

- REQUIRED 生成 operation-review.md [RESOLVED]
  - 对象=operation-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:f3c962118cbd1624dbe38cb6","kind":"ITEM","entity_node_id":"p1:bdf8a681b03fe5d4941bceeb","source_span_ids":["p1:646c19e9b9668b0576aeb959","p1:b9d7a8fc6790364ba46480a9"],"relation_ids":["p1:2d7e8a22918229324e77a1b7"]}；数量=null
  - 证据：[19,21) undefined；[19,41) undefined；[22,41) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · UNRESOLVED

- 停止 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[51,53) undefined；[42,61) undefined；[0,92) undefined

### B · RESOLVED

- FORBIDDEN 重启 服务 [RESOLVED]
  - 对象=服务；主体=；角色=；条件=null；作用域={"expr_id":"p1:00b8a7472141bd493bfd4ab9","kind":"ITEM","entity_node_id":"p1:a741ae9501d94d6d9fcdd173","source_span_ids":["p1:3221914924bb606038605243","p1:935fa45bc701ea006e616a22"],"relation_ids":["p1:5b0333a55c1975cdbb530744"]}；数量=null
  - 证据：[86,88) undefined；[82,90) undefined；[88,90) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
