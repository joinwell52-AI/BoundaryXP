# ADM-004 Skills 分配审计

## 原文

PM 安排 DEV 检查 skills-map.yaml 中的 Skills 分配，核对每个角色是否只获得已批准的能力。DEV 生成 skills-audit.md，QA 复核角色与能力的对应关系，PM 最后向 ADMIN 汇报。禁止修改角色授权或安装新 Skill。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

无实际条目。

### A · PARSER_COVERAGE_FAILURE

无实际条目。

### P · PARSER_COVERAGE_FAILURE

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[106,111) undefined；[99,114) undefined；[112,114) undefined

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · PARSER_COVERAGE_FAILURE

- FORBIDDEN 修改 角色授权 [RESOLVED]
  - 对象=角色授权；主体=；角色=；条件=null；作用域={"expr_id":"p1:f0caf90fa2f197f4ca418534","kind":"ITEM","entity_node_id":"p1:08609ef429341a09eafafebe","source_span_ids":["p1:763d13eb16adb65bcb9f26b2","p1:49f4c73c794e6b905821a0a7"],"relation_ids":["p1:60abfceefefdd2b4f5659c13"]}；数量=null
  - 证据：[117,119) undefined；[115,133) undefined；[119,123) undefined
- FORBIDDEN 安装 新 Skill [RESOLVED]
  - 对象=新 Skill；主体=；角色=；条件=null；作用域={"expr_id":"p1:fbf0ec81e2cff0cfcc81ed2c","kind":"ITEM","entity_node_id":"p1:e9caa5f298e51364f0f619bb","source_span_ids":["p1:a3e5ca35bdb8ce44a3db33b8","p1:49f4c73c794e6b905821a0a7"],"relation_ids":["p1:88f3318749efdecb844c1635"]}；数量=null
  - 证据：[124,126) undefined；[115,133) undefined；[126,133) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Multiple operands without an explicit supported set connector
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No supported native semantic construction for this clause

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
