# ADM-023 资产清单核对

## 原文

OPS 读取 assets.csv 和 inventory.csv，核对设备编号，生成 asset-diff.md。仅检查在用设备，已报废设备不在范围内。PM 负责分配核对人员；不得创建、删除或修改资产记录。

## 实际 Canonical 7+1

### I · RESOLVED

- 核对人员 [RESOLVED]
  - 对象=核对人员；主体=；角色=；条件=null；作用域={"expr_id":"p1:9b0061a8b746cb0bea62f364","kind":"ITEM","entity_node_id":"p1:a1a8462215d07118d04ddef4","source_span_ids":["p1:23bdd3f934e7cbbf9e7b1174","p1:5449b5de8832a474bb79ccae"],"relation_ids":["p1:9f1d37439da93f49f631ae6d"]}；数量=null
  - 证据：[84,88) undefined；[77,88) undefined；[0,105) undefined

### O · RESOLVED

- asset-diff.md [RESOLVED]
  - 对象=asset-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:18d1544e2a220b8f99c77336","kind":"ITEM","entity_node_id":"p1:f0a1dad21018215f5bf56ad3","source_span_ids":["p1:5cd7a82c673eaa9ac3c5443f","p1:6b405ff4098e1fc2e5d80022"],"relation_ids":["p1:88ef5833181acc8ac1c2c63b"]}；数量=null
  - 证据：[41,43) undefined；[41,57) undefined；[44,57) undefined

### A · UNRESOLVED

- REQUIRED 生成 asset-diff.md [RESOLVED]
  - 对象=asset-diff.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:18d1544e2a220b8f99c77336","kind":"ITEM","entity_node_id":"p1:f0a1dad21018215f5bf56ad3","source_span_ids":["p1:5cd7a82c673eaa9ac3c5443f","p1:6b405ff4098e1fc2e5d80022"],"relation_ids":["p1:88ef5833181acc8ac1c2c63b"]}；数量=null
  - 证据：[41,43) undefined；[41,57) undefined；[44,57) undefined
- REQUIRED 分配 核对人员 [RESOLVED]
  - 对象=核对人员；主体=；角色=；条件=null；作用域={"expr_id":"p1:8d92838b8aa63bf27e0673c3","kind":"ITEM","entity_node_id":"p1:a1a8462215d07118d04ddef4","source_span_ids":["p1:23bdd3f934e7cbbf9e7b1174","p1:5449b5de8832a474bb79ccae"],"relation_ids":["p1:3ecf8e91e10648ef2b4d4e1f"]}；数量=null
  - 证据：[82,84) undefined；[77,88) undefined；[84,88) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 创建 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[91,93) undefined；[89,103) undefined
- FORBIDDEN 修改 资产记录 [RESOLVED]
  - 对象=资产记录；主体=；角色=；条件=null；作用域={"expr_id":"p1:1cc1e4150329a516f16c0183","kind":"ITEM","entity_node_id":"p1:0197f23dd3b48001c05b335d","source_span_ids":["p1:8b23337a03c07eb0eb87292b","p1:7bd23515ecf70c818d13550a"],"relation_ids":["p1:833b105fb9a3be89be660946"]}；数量=null
  - 证据：[97,99) undefined；[89,103) undefined；[99,103) undefined
- FORBIDDEN 删除 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[94,96) undefined；[89,103) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
