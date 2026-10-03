# ADM-008 证书有效期核查

## 原文

OPS 读取 certificates.csv，检查每张证书的到期时间，生成 expiry-report.md。距到期不足 15 天的证书必须在报告中单独列出。不得更换证书；PM 收到报告后向 ADMIN 汇报。

## 实际 Canonical 7+1

### I · ABSENT

无实际条目。

### O · RESOLVED

- expiry-report.md [RESOLVED]
  - 对象=expiry-report.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:312f54e360f9c51408001f88","kind":"ITEM","entity_node_id":"p1:5096584305066b27befe256a","source_span_ids":["p1:ec07e0188e9be417462d1c53","p1:3ddb7c85c7c006afe20006cc"],"relation_ids":["p1:410e9bad9cb6f6c3736dd697"]}；数量=null
  - 证据：[36,38) undefined；[36,55) undefined；[39,55) undefined

### A · UNRESOLVED

- REQUIRED 检查 到期时间 [RESOLVED]
  - 对象=到期时间；主体=；角色=；条件=null；作用域={"expr_id":"p1:71e0803341cba3ac9b28fa5c","kind":"ITEM","entity_node_id":"p1:00bda999fbdd5c744a101088","source_span_ids":["p1:6f2109b515e61925ecf877b9","p1:4bb0f144611290a5ffa4e6c5"],"relation_ids":["p1:ded4abf53cd476603722b4fd"]}；数量=null
  - 证据：[24,26) undefined；[24,35) undefined；[31,35) undefined
- REQUIRED 生成 expiry-report.md [RESOLVED]
  - 对象=expiry-report.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:312f54e360f9c51408001f88","kind":"ITEM","entity_node_id":"p1:5096584305066b27befe256a","source_span_ids":["p1:ec07e0188e9be417462d1c53","p1:3ddb7c85c7c006afe20006cc"],"relation_ids":["p1:410e9bad9cb6f6c3736dd697"]}；数量=null
  - 证据：[36,38) undefined；[36,55) undefined；[39,55) undefined
- REQUIRED 列出 [UNRESOLVED]
  - 对象=；主体=；角色=；条件=null；作用域=null；数量=null
  - 证据：[77,79) undefined；[56,79) undefined

### P · UNRESOLVED

- ADMIN [RECIPIENT] [RESOLVED]
  - 对象=；主体=；角色=ADMIN:RECIPIENT；条件=null；作用域=null；数量=null
  - 证据：[97,102) undefined；[87,105) undefined；[103,105) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · ABSENT

无实际条目。

### B · RESOLVED

- FORBIDDEN 更换 证书 [RESOLVED]
  - 对象=证书；主体=；角色=；条件=null；作用域={"expr_id":"p1:356764569aa005b728991024","kind":"ITEM","entity_node_id":"p1:463778710cd0f30ca2b66148","source_span_ids":["p1:cfc263470c29724fbe3dbd8c","p1:a811ad66b3aa4aadcc2181b6"],"relation_ids":["p1:0b5bfd79314b9960bfe5acaf"]}；数量=null
  - 证据：[82,84) undefined；[80,86) undefined；[84,86) undefined

## 未决项

- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_RELATION: Action modality is not explicit
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
