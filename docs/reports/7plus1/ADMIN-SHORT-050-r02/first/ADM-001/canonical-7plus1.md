# ADM-001 系统环境核查

## 原文

PM 负责本次系统环境核查，安排 OPS 检查测试机的操作系统、磁盘余量和服务进程。OPS 必须生成 environment-check.md，QA 复核报告后由 PM 提交给 ADMIN。整个任务须在 40 分钟内完成，不得修改系统配置。

## 实际 Canonical 7+1

### I · RESOLVED

- 本次系统环境核查 [RESOLVED]
  - 对象=本次系统环境核查；主体=；角色=；条件=null；作用域={"expr_id":"p1:751f732355bbff360d2b00dc","kind":"ITEM","entity_node_id":"p1:67bf63997c89b2e9e983e1bb","source_span_ids":["p1:608e58109b9d04b408b33ab4","p1:a0f6cdaede281a4fb8794869"],"relation_ids":["p1:6c45aec8bb5c66c5b77cfa8e"]}；数量=null
  - 证据：[5,13) undefined；[0,13) undefined；[0,121) undefined

### O · RESOLVED

- environment-check.md [RESOLVED]
  - 对象=environment-check.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:6872adcfb55b74ee97a209ea","kind":"ITEM","entity_node_id":"p1:38b91a5c7831bbaa46dc7c57","source_span_ids":["p1:ceb06fad481cf4c5d28bd080","p1:d7d4c63b7eb73c6fbacd6301"],"relation_ids":["p1:f96b4313f34b71e2cf027ad0"]}；数量=null
  - 证据：[48,50) undefined；[42,71) undefined；[51,71) undefined

### A · UNRESOLVED

- REQUIRED 本次系统环境核查 [RESOLVED]
  - 对象=本次系统环境核查；主体=；角色=；条件=null；作用域={"expr_id":"p1:5be3637c969cc1ada3c692dd","kind":"ITEM","entity_node_id":"p1:67bf63997c89b2e9e983e1bb","source_span_ids":["p1:608e58109b9d04b408b33ab4","p1:a0f6cdaede281a4fb8794869"],"relation_ids":["p1:d9ac088b9cff6de920da8d68"]}；数量=null
  - 证据：[5,13) undefined；[0,13) undefined
- REQUIRED 生成 environment-check.md [RESOLVED]
  - 对象=environment-check.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:6872adcfb55b74ee97a209ea","kind":"ITEM","entity_node_id":"p1:38b91a5c7831bbaa46dc7c57","source_span_ids":["p1:ceb06fad481cf4c5d28bd080","p1:d7d4c63b7eb73c6fbacd6301"],"relation_ids":["p1:f96b4313f34b71e2cf027ad0"]}；数量=null
  - 证据：[48,50) undefined；[42,71) undefined；[51,71) undefined
- REQUIRED 完成 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[108,110) undefined；[95,110) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[89,94) undefined；[72,94) undefined；[85,87) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 修改 系统配置 [RESOLVED]
  - 对象=系统配置；主体=；角色=；条件=null；作用域={"expr_id":"p1:54d3a0701610211c3e1fb09d","kind":"ITEM","entity_node_id":"p1:99ab3782347ab47b808b0d34","source_span_ids":["p1:747e5c957dad2b605538659a","p1:427aed64957d8c121ecb5973"],"relation_ids":["p1:cf5dbad80d20ad16eb6ed4e3"]}；数量=null
  - 证据：[113,115) undefined；[111,119) undefined；[115,119) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
