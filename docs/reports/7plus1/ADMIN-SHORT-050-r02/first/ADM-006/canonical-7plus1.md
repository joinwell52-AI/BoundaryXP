# ADM-006 备份核验

## 原文

PM 安排 OPS 读取 backup-index.csv，检查其中所有备份的校验结果，生成 backup-audit.md。QA 确认报告覆盖清单中的每一项后，PM 向 ADMIN 提交报告。不得恢复备份，不得删除任何备份文件。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- backup-audit.md [RESOLVED]
  - 对象=backup-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:5409410856af10ff7ae1ad67","kind":"ITEM","entity_node_id":"p1:72fbbb043b68d3311bfa58b3","source_span_ids":["p1:c7e6de0fc9c9322bbc0c3f48","p1:7c78e3cfb542b298ce93ec6b"],"relation_ids":["p1:77980bc8be8b5fb2a67f4ace"]}；数量=null
  - 证据：[44,46) undefined；[44,62) undefined；[47,62) undefined

### A · UNRESOLVED

- REQUIRED 检查 校验结果 [RESOLVED]
  - 对象=校验结果；主体=；角色=；条件=null；作用域={"expr_id":"p1:c19a1063be7304e40e5c7b07","kind":"ALL","base_entity_node_id":"p1:b866f45c68982632fc7aae75","source_span_ids":["p1:143fa849dc7a494f2a524f2c"],"relation_ids":["p1:7872895012d242155d998faf"]}；数量=null
  - 证据：[30,32) undefined；[30,43) undefined；[39,43) undefined
- REQUIRED 生成 backup-audit.md [RESOLVED]
  - 对象=backup-audit.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:5409410856af10ff7ae1ad67","kind":"ITEM","entity_node_id":"p1:72fbbb043b68d3311bfa58b3","source_span_ids":["p1:c7e6de0fc9c9322bbc0c3f48","p1:7c78e3cfb542b298ce93ec6b"],"relation_ids":["p1:77980bc8be8b5fb2a67f4ace"]}；数量=null
  - 证据：[44,46) undefined；[44,62) undefined；[47,62) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[86,91) undefined；[81,96) undefined；[92,94) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 恢复 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[99,101) undefined；[97,103) undefined
- FORBIDDEN 删除 任何备份文件 [RESOLVED]
  - 对象=任何备份文件；主体=；角色=；条件=null；作用域={"expr_id":"p1:94ecdafb532722f169d6e026","kind":"ITEM","entity_node_id":"p1:1f546b9ee36fc0fc48bdd3ed","source_span_ids":["p1:b210e4070ae748ce1d07399d","p1:c245d139bd5e4cb97d46a34e"],"relation_ids":["p1:8225a6ee2b3c179efbd51bc3"]}；数量=null
  - 证据：[106,108) undefined；[104,114) undefined；[108,114) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
