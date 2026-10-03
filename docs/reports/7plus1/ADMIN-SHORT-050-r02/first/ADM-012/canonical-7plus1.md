# ADM-012 接口兼容性检查

## 原文

DEV 读取 api-old.json 和 api-new.json，检查公共接口的兼容性，生成 compatibility.md。QA 确认每个删除或改名的接口都已记录后，PM 将报告交给 ADMIN。不得修改任一接口定义文件。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- compatibility.md [RESOLVED]
  - 对象=compatibility.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:2cf84d8eb1780ba4ea2e48c3","kind":"ITEM","entity_node_id":"p1:138cb69ccb32a66a4582c828","source_span_ids":["p1:a143bb57cf7db6311e2cbcba","p1:0ee3d449967b26d35e7bc0b6"],"relation_ids":["p1:a1976be76dcfbc682ab92583"]}；数量=null
  - 证据：[46,48) undefined；[46,65) undefined；[49,65) undefined

### A · UNRESOLVED

- REQUIRED 检查 兼容性 [RESOLVED]
  - 对象=兼容性；主体=；角色=；条件=null；作用域={"expr_id":"p1:ed470ceb3b3da1d94e1ddb3e","kind":"ITEM","entity_node_id":"p1:5785b55e97d37ed627baefaa","source_span_ids":["p1:d2ca9bb7bcc58ed57c7d3a20","p1:bb8794ca290ded344cabbea2"],"relation_ids":["p1:3506a1e910a6d0b82c79a167"]}；数量=null
  - 证据：[35,37) undefined；[35,45) undefined；[42,45) undefined
- REQUIRED 生成 compatibility.md [RESOLVED]
  - 对象=compatibility.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:2cf84d8eb1780ba4ea2e48c3","kind":"ITEM","entity_node_id":"p1:138cb69ccb32a66a4582c828","source_span_ids":["p1:a143bb57cf7db6311e2cbcba","p1:0ee3d449967b26d35e7bc0b6"],"relation_ids":["p1:a1976be76dcfbc682ab92583"]}；数量=null
  - 证据：[46,48) undefined；[46,65) undefined；[49,65) undefined

### P · ABSENT

无实际条目。

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 修改 接口定义文件 [RESOLVED]
  - 对象=接口定义文件；主体=；角色=；条件=null；作用域={"expr_id":"p1:03db0a14373a2713df908c3f","kind":"ANY","base_entity_node_id":"p1:5fb7715aa33ecd5e59e78bd8","source_span_ids":["p1:474d2e8471f7c24ad4a21b8a"],"relation_ids":["p1:6582489979aa906d354e5284"]}；数量=null
  - 证据：[104,106) undefined；[102,114) undefined；[108,114) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_QUANTIFICATION: Comparator without safely parsed scalar
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
