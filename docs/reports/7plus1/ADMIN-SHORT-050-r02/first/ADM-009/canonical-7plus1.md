# ADM-009 日志排查

## 原文

DEV 读取 app.log 和 error.log，定位重复报错，生成 incident-notes.md。单次查询最多重试 3 次，整个排查不得超过 30 分钟。若发现凭据泄露，立即停止排查并通知 PM；不得把日志上传到外部服务。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- incident-notes.md [RESOLVED]
  - 对象=incident-notes.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:52e0431a6dcf6b437cf4efbb","kind":"ITEM","entity_node_id":"p1:185ce706af8ee51a78b715b8","source_span_ids":["p1:80c0cef20723264dab97c8e9","p1:5b26093f72704096255e0580"],"relation_ids":["p1:16b246d696abeb79001ac15a"]}；数量=null
  - 证据：[34,36) undefined；[34,54) undefined；[37,54) undefined

### A · UNRESOLVED

- REQUIRED 生成 incident-notes.md [RESOLVED]
  - 对象=incident-notes.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:52e0431a6dcf6b437cf4efbb","kind":"ITEM","entity_node_id":"p1:185ce706af8ee51a78b715b8","source_span_ids":["p1:80c0cef20723264dab97c8e9","p1:5b26093f72704096255e0580"],"relation_ids":["p1:16b246d696abeb79001ac15a"]}；数量=null
  - 证据：[34,36) undefined；[34,54) undefined；[37,54) undefined

### P · ABSENT

无实际条目。

### R · RESOLVED

- 30 [RESOLVED]
  - 对象=30；主体=；角色=；条件=null；作用域=null；数量={"expr_id":"p1:a28080e7fab65ddf69b461c1","metric":"TIME","target_node_ids":["p1:4cb031a8fd1dda00d59e2c26"],"upper_bound":{"inclusive":true,"value":30},"unit":"分钟","value_node_ids":["p1:b386b512f7ca6fec0f227bbe"],"source_span_ids":["p1:a99b09dede0d496717603ee9","p1:adbe9588574809a99bd56e45","p1:aa6d8098d2fef7d57d95c4a5"],"relation_ids":["p1:b907c57d8c1abadd9a4f275c"]}
  - 证据：[70,72) undefined；[68,82) undefined；[77,79) undefined

### V · ABSENT

无实际条目。

### C · UNRESOLVED

- 排查 [UNRESOLVED]
  - 对象=排查；主体=；角色=；条件={"expr_id":"p1:5e54aaebc7412a1c6bc607da","op":"STATE_REF","state_node_id":"p1:bfa422df126b8dea85e2b07a","source_span_ids":["p1:999bbf1a351ce92a3c62f7a9"],"relation_ids":[]}；作用域={"expr_id":"p1:2d898a74a88f8ea5850f49bd","kind":"ITEM","entity_node_id":"p1:b3c42dacc4ae56f237203222","source_span_ids":["p1:5b803b2abc63a5406283d575","p1:a2adf874dc4c1ce1b850c96c"],"relation_ids":["p1:94854a5391c93b8bb49e056a"]}；数量=null
  - 证据：[93,95) undefined；[91,103) undefined；[95,97) undefined；[0,118) undefined；[83,90) undefined

### B · UNRESOLVED

- FORBIDDEN 上传 外部、日志 [RESOLVED]
  - 对象=外部/日志；主体=；角色=；条件=null；作用域={"expr_id":"p1:0a8abdbada0d426d6cd5008b","kind":"ITEM","entity_node_id":"p1:54aae4a16c10e2dc242bfb0d","source_span_ids":["p1:1bbeab289256723553352d82","p1:beea7395254a0a9b9cb1adb6"],"relation_ids":["p1:eb6fb0f1662f7a5f4d3ab3de"]}；数量=null
  - 证据：[109,111) undefined；[104,116) undefined；[112,114) undefined；[107,109) undefined
- FORBIDDEN 服务 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[114,116) undefined；[104,116) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
