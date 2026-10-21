# ADM-024 报表数值复核

## 原文

财务员林悦读取 revenue.csv 和 monthly-report.xlsx，复核报表汇总金额，生成 finance-review.md。复核误差必须精确记录，不允许四舍五入后隐藏差异。QA 复核报告后由 PM 提交给 ADMIN。

## 实际 Canonical 7+1

### I · PARSER_COVERAGE_FAILURE

无实际条目。

### O · PARSER_COVERAGE_FAILURE

- finance-review.md [RESOLVED]
  - 对象=finance-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:56bd079c27ee0bf00347c8bf","kind":"ITEM","entity_node_id":"p1:6618d400e53b0c5bae7639ef","source_span_ids":["p1:87522ed3255c4dcbd098f6ca","p1:595c15bf024bd9b488fc2a33"],"relation_ids":["p1:e3ee1cbf6d6a0b2dd66354a5"]}；数量=null
  - 证据：[51,53) undefined；[51,71) undefined；[54,71) undefined；[0,5) undefined；[0,41) undefined

### A · UNRESOLVED

- REQUIRED 生成 finance-review.md [RESOLVED]
  - 对象=finance-review.md；主体=财务员林悦；角色=；条件=null；作用域={"expr_id":"p1:56bd079c27ee0bf00347c8bf","kind":"ITEM","entity_node_id":"p1:6618d400e53b0c5bae7639ef","source_span_ids":["p1:87522ed3255c4dcbd098f6ca","p1:595c15bf024bd9b488fc2a33"],"relation_ids":["p1:e3ee1cbf6d6a0b2dd66354a5"]}；数量=null
  - 证据：[51,53) undefined；[51,71) undefined；[54,71) undefined；[0,5) undefined；[0,41) undefined
- REQUIRED 复核 误差 [RESOLVED]
  - 对象=误差；主体=财务员林悦；角色=；条件=null；作用域={"expr_id":"p1:29be197e5f8def6d7f949de0","kind":"ITEM","entity_node_id":"p1:20a9fc648b555718a457f1d7","source_span_ids":["p1:c92c45a2a833341dacbe824f","p1:b734711b36565676200e8ada"],"relation_ids":["p1:a9a27a89d34160f51695a469"]}；数量=null
  - 证据：[72,74) undefined；[72,82) undefined；[74,76) undefined；[0,5) undefined；[0,41) undefined
- REQUIRED 记录 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[80,82) undefined；[72,82) undefined

### P · PARSER_COVERAGE_FAILURE

- 财务员林悦 [PERFORMER] [RESOLVED]
  - 对象=；主体=；角色=财务员林悦:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=财务员林悦:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=财务员林悦:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=财务员林悦:PERFORMER；条件=null；作用域=null；数量=null
  - 证据：[0,5) undefined；[0,41) undefined；[5,7) undefined；[51,53) undefined；[51,71) undefined；[72,74) undefined；[72,82) undefined；[87,88) undefined；[83,95) undefined
- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[113,118) undefined；[96,118) undefined；[109,111) undefined

### R · PARSER_COVERAGE_FAILURE

无实际条目。

### V · PARSER_COVERAGE_FAILURE

无实际条目。

### C · PARSER_COVERAGE_FAILURE

无实际条目。

### B · UNRESOLVED

- FORBIDDEN 舍 [UNRESOLVED]
  - 对象=；主体=财务员林悦；角色=；条件=null；作用域=null；数量=null
  - 证据：[87,88) undefined；[83,95) undefined；[0,5) undefined；[0,41) undefined
- FORBIDDEN 入 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[89,90) undefined；[83,95) undefined
- FORBIDDEN 隐藏 差异 [RESOLVED]
  - 对象=差异；主体=；角色=；条件=null；作用域={"expr_id":"p1:4cc0163bf7d832e64ab82387","kind":"ITEM","entity_node_id":"p1:70af25faf7921b1f9e871fa9","source_span_ids":["p1:1a07eb8d08ca6300a63b1bee","p1:668733ba94b4833ccbd1d2df"],"relation_ids":["p1:9d22434825397bf522fcbb70"]}；数量=null
  - 证据：[91,93) undefined；[83,95) undefined；[93,95) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_RELATION: No supported native semantic construction for this clause
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
