# ADM-033 向量索引审计

## 原文

OPS 读取 index-manifest.json，检查索引文件的版本与校验值，生成 index-audit.md。检查范围排除 archive 目录。不得重新计算向量；发现校验失败时必须向 PM 报告。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- index-audit.md [RESOLVED]
  - 对象=index-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:87fcd9f5a09412a9af0a6050","kind":"ITEM","entity_node_id":"p1:69ea536e91f17ca2833b3e1b","source_span_ids":["p1:e1fd79428b5696f7fcb61db1","p1:8508489ae262cde457ec13ca"],"relation_ids":["p1:5a6ae47ea42c51e6d09d1d80"]}；数量=null
  - 证据：[41,43) undefined；[41,58) undefined；[44,58) undefined

### A · UNRESOLVED

- REQUIRED 检查 校验值 [RESOLVED]
  - 对象=校验值；主体=；角色=；条件=null；作用域={"expr_id":"p1:220cca5d3ad98f1b9bfbb008","kind":"ITEM","entity_node_id":"p1:5844f9024d405d14075dc337","source_span_ids":["p1:920ed86e739ede107b14549c","p1:b7b49c2ed62885765e22d9c7"],"relation_ids":["p1:d31b18552149ced3f5ab8507"]}；数量=null
  - 证据：[27,29) undefined；[27,40) undefined；[37,40) undefined
- REQUIRED 生成 index-audit.md [RESOLVED]
  - 对象=index-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:87fcd9f5a09412a9af0a6050","kind":"ITEM","entity_node_id":"p1:69ea536e91f17ca2833b3e1b","source_span_ids":["p1:e1fd79428b5696f7fcb61db1","p1:8508489ae262cde457ec13ca"],"relation_ids":["p1:5a6ae47ea42c51e6d09d1d80"]}；数量=null
  - 证据：[41,43) undefined；[41,58) undefined；[44,58) undefined
- REQUIRED 发现 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[86,88) undefined；[86,102) undefined
- REQUIRED 报告 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[100,102) undefined；[86,102) undefined；[97,99) undefined

### P · RESOLVED

- PM [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=PM:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[97,99) undefined；[86,102) undefined；[100,102) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 计算 向量 [RESOLVED]
  - 对象=向量；主体=；角色=；条件=null；作用域={"expr_id":"p1:f1bcb28a71dcc1f0e67e00e5","kind":"ITEM","entity_node_id":"p1:d8afdd6508689472735f1e39","source_span_ids":["p1:60d584699a9bbdf0fa5d5a49","p1:056171120331ea2293e9a162"],"relation_ids":["p1:60fce78853f8be6d6615b0bc"]}；数量=null
  - 证据：[81,83) undefined；[77,85) undefined；[83,85) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
