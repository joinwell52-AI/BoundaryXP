# ADM-049 英文条件与停止

## 原文

OPS must read health.log. If a critical error is found, stop the inspection and notify PM; otherwise generate health-summary.md. Do not restart the service.

## 实际 Canonical 7+1

### I · RESOLVED

- health.log [RESOLVED]
  - 对象=health.log；主体=；角色=；条件=null；作用域={"expr_id":"p1:b68b675615d1b5e7b434a93e","kind":"ITEM","entity_node_id":"p1:2f8fd7415450d9b247be0185","source_span_ids":["p1:80c0257b8332ad33c84a23ae","p1:c2067ea3049ac6c60c0d8496"],"relation_ids":["p1:2be4bc375276912b9fc8a8f1"]}；数量=null
  - 证据：[14,24) undefined；[0,24) undefined；[9,13) undefined

### O · UNRESOLVED

无实际条目。

### A · UNRESOLVED

- REQUIRED read health.log [RESOLVED]
  - 对象=health.log；主体=；角色=；条件=null；作用域={"expr_id":"p1:20481878c896727cb8e536a9","kind":"ITEM","entity_node_id":"p1:2f8fd7415450d9b247be0185","source_span_ids":["p1:80c0257b8332ad33c84a23ae","p1:c2067ea3049ac6c60c0d8496"],"relation_ids":["p1:a276823dd8ffc685f01f99e3"]}；数量=null
  - 证据：[9,13) undefined；[0,24) undefined；[14,24) undefined
- REQUIRED notify [UNRESOLVED]
  - 对象=；主体=；角色=；条件={"expr_id":"p1:cd83e3c53d10987c987eb69a","op":"STATE_REF","state_node_id":"p1:f8c41ae192e46c01644eb46b","source_span_ids":["p1:a768557c5628fdd2fee3db51"],"relation_ids":[]}；作用域=null；数量=null
  - 证据：[80,86) undefined；[56,89) undefined；[26,54) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · RESOLVED

- the inspection [RESOLVED]
  - 对象=the inspection；主体=；角色=；条件={"expr_id":"p1:cd83e3c53d10987c987eb69a","op":"STATE_REF","state_node_id":"p1:f8c41ae192e46c01644eb46b","source_span_ids":["p1:a768557c5628fdd2fee3db51"],"relation_ids":[]}；作用域={"expr_id":"p1:d4f06f00755d9f0c39d47c35","kind":"ITEM","entity_node_id":"p1:cc86e77a7cfd7e0f8196933c","source_span_ids":["p1:eec4660a08b10c44fc54b98d","p1:c7090e42e7f6625e9f475b8b"],"relation_ids":["p1:b83eaa6865fbc2f4fdd6d7e1"]}；数量=null
  - 证据：[56,60) undefined；[56,89) undefined；[61,75) undefined；[0,157) undefined；[26,54) undefined

### B · RESOLVED

- FORBIDDEN restart the service [RESOLVED]
  - 对象=the service；主体=；角色=；条件=null；作用域={"expr_id":"p1:f2e9e0a5b6953a214c90ee20","kind":"ITEM","entity_node_id":"p1:bb0c1374e7f6749d66f75190","source_span_ids":["p1:06aa2c0362365c28da56ecb6","p1:6c7a681a821b8a30d4a71160"],"relation_ids":["p1:d7246cd21b407395396c84c1"]}；数量=null
  - 证据：[136,143) undefined；[129,155) undefined；[144,155) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
