# ADM-020 安全扫描复核

## 原文

安全员蒋川读取 scan.json，复核高危发现，生成 security-review.md。若确认存在可利用漏洞，立即向 PM 升级汇报。不得执行漏洞利用，不得删除扫描结果；PM 统一向 ADMIN 报告。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- security-review.md [RESOLVED]
  - 对象=security-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:b8ce659f26bdfd019bb81bc0","kind":"ITEM","entity_node_id":"p1:ac29400472372d6492e603bc","source_span_ids":["p1:58dede0fffc5373e3987d95e","p1:50a81720488e76868806a56e"],"relation_ids":["p1:02061078fc88ad360b516d76"]}；数量=null
  - 证据：[25,27) undefined；[25,46) undefined；[28,46) undefined

### A · UNRESOLVED

- REQUIRED 复核 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[18,20) undefined；[18,24) undefined
- REQUIRED 生成 security-review.md [RESOLVED]
  - 对象=security-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:b8ce659f26bdfd019bb81bc0","kind":"ITEM","entity_node_id":"p1:ac29400472372d6492e603bc","source_span_ids":["p1:58dede0fffc5373e3987d95e","p1:50a81720488e76868806a56e"],"relation_ids":["p1:02061078fc88ad360b516d76"]}；数量=null
  - 证据：[25,27) undefined；[25,46) undefined；[28,46) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[95,100) undefined；[88,103) undefined；[101,103) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 漏洞利用 [RESOLVED]
  - 对象=漏洞利用；主体=；角色=；条件=null；作用域={"expr_id":"p1:14ac468da85418ddfedc83b0","kind":"ITEM","entity_node_id":"p1:2970d4e80eedfa67de9af098","source_span_ids":["p1:61591777870005f0df91f580","p1:bda0e38feb9292a3b49c4122"],"relation_ids":["p1:ba3c61a9098b936ee11c81b1"]}；数量=null
  - 证据：[74,78) undefined；[70,78) undefined
- FORBIDDEN 删除 扫描结果 [RESOLVED]
  - 对象=扫描结果；主体=；角色=；条件=null；作用域={"expr_id":"p1:a47e6d00a3e7d12a57652cfe","kind":"ITEM","entity_node_id":"p1:a358d8020cfe6823de2a99c7","source_span_ids":["p1:9bb1af6c12c87935067831d4","p1:61812b80fb535967299a43db"],"relation_ids":["p1:fd2f6697fc5cc0856e45c53d"]}；数量=null
  - 证据：[81,83) undefined；[79,87) undefined；[83,87) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_COREFERENCE: Transfer object lacks one explicit coordinated result
- UNRESOLVED_COREFERENCE: RECIPIENT_REFERENT_NOT_UNIQUELY_EXPLICIT
- UNRESOLVED_SCOPE: Action target not syntactically established
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
