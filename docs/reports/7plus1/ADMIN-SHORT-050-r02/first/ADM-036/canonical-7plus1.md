# ADM-036 PM 总体组织

## 原文

检查服务状态、权限配置和日志留存情况。PM 负责安排 DEV 与 OPS 分工，双方分别提交检查报告。QA 在两份报告均提交后复核，最后由 PM 向 ADMIN 统一汇报；不得实际修复发现的问题。

## 实际 Canonical 7+1

### I · RESOLVED

- 分工 [RESOLVED]
  - 对象=分工；主体=；角色=；条件=null；作用域={"expr_id":"p1:551005fdc6b1b9eb2f2b0626","kind":"ITEM","entity_node_id":"p1:50706278b4113d826eba67be","source_span_ids":["p1:b4b9153034e25f4ba4880c84","p1:eed77600268681d5f4fdb689"],"relation_ids":["p1:810404be03f066b7abbe8ead"]}；数量=null
  - 证据：[37,39) undefined；[19,39) undefined；[0,99) undefined

### O · ABSENT

无实际条目。

### A · UNRESOLVED

- REQUIRED 检查 日志留存情况 [RESOLVED]
  - 对象=日志留存情况；主体=；角色=；条件=null；作用域={"expr_id":"p1:39cdb21478679887df0da655","kind":"ITEM","entity_node_id":"p1:e70c1b5d0d4ddac46299a80e","source_span_ids":["p1:b923af7e46eab5a5c3a6585a","p1:bffeb0306f8a1b259f6eb415"],"relation_ids":["p1:e22c584edb7696b0d899bd50"]}；数量=null
  - 证据：[0,2) undefined；[0,18) undefined；[12,18) undefined
- REQUIRED 安排 分工 [RESOLVED]
  - 对象=分工；主体=；角色=；条件=null；作用域={"expr_id":"p1:ea832df868dc1aa65564375a","kind":"ITEM","entity_node_id":"p1:50706278b4113d826eba67be","source_span_ids":["p1:b4b9153034e25f4ba4880c84","p1:eed77600268681d5f4fdb689"],"relation_ids":["p1:cc52a379edce3c76d2aa139f"]}；数量=null
  - 证据：[24,26) undefined；[19,39) undefined；[37,39) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[75,80) undefined；[66,85) undefined；[83,85) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 发现 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[92,94) undefined；[86,97) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
