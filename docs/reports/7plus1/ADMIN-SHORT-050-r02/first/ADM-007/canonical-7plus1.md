# ADM-007 权限最小化检查

## 原文

安全员顾宁负责本次权限检查，读取 roles.csv 和 grants.csv，并生成 permission-review.md。检查范围仅限测试环境，生产环境不在本次检查范围内。不得修改授权；只有两份输入都检查完且报告已生成，任务才完成。

## 实际 Canonical 7+1

### I · RESOLVED

- roles.csv [RESOLVED]
  - 对象=roles.csv；主体=；角色=；条件=null；作用域={"expr_id":"p1:40e204e25a5dadf8bc06aed1","kind":"ITEM","entity_node_id":"p1:09ff2ff66efaeb15749db7e5","source_span_ids":["p1:092e081a11a1a8f1c3d67804","p1:5cfc6937cb278f9ae72326a4"],"relation_ids":["p1:2ecb8ef60bdd5196d9749ea9"]}；数量=null
  - 证据：[17,26) undefined；[14,39) undefined；[14,16) undefined
- grants.csv [RESOLVED]
  - 对象=grants.csv；主体=；角色=；条件=null；作用域={"expr_id":"p1:545d79177a83ab897ea7266e","kind":"ITEM","entity_node_id":"p1:f8e3a7d1191b589f4806c395","source_span_ids":["p1:197e3c9be2efc30cf2f88323","p1:5cfc6937cb278f9ae72326a4"],"relation_ids":["p1:a5925538042ac9986137c974"]}；数量=null
  - 证据：[29,39) undefined；[14,39) undefined；[14,16) undefined

### O · RESOLVED

- permission-review.md [RESOLVED]
  - 对象=permission-review.md；主体=；角色=；条件=null；作用域={"expr_id":"p1:58cfe945ecd7bba926df3f6f","kind":"ITEM","entity_node_id":"p1:4de3ea533b39d32ea88c89f2","source_span_ids":["p1:8ec9cb30fe7ec782e1586b13","p1:47ee548200831ed50e681883"],"relation_ids":["p1:8b9d6ed0063c9df573dc839d"]}；数量=null
  - 证据：[41,43) undefined；[40,64) undefined；[44,64) undefined；[0,5) undefined；[0,13) undefined；[3,5) undefined

### A · UNRESOLVED

- REQUIRED 读取 grants.csv、roles.csv [RESOLVED]
  - 对象=grants.csv/roles.csv；主体=安全员顾宁；角色=；条件=null；作用域={"expr_id":"p1:07e46febdb906e66b3978849","kind":"UNION","operand_expr_ids":["p1:c531918bff7e8b5d686f5334","p1:5f661f4c2017778dbc5f47b3"],"source_span_ids":["p1:5cfc6937cb278f9ae72326a4"],"relation_ids":["p1:1c681d90bb2de0368ab821ac","p1:cbbd12f2a4eaf270822e8ecb"]}；数量=null
  - 证据：[14,16) undefined；[14,39) undefined；[29,39) undefined；[17,26) undefined；[0,5) undefined；[0,13) undefined；[3,5) undefined
- REQUIRED 生成 permission-review.md [RESOLVED]
  - 对象=permission-review.md；主体=安全员顾宁；角色=；条件=null；作用域={"expr_id":"p1:58cfe945ecd7bba926df3f6f","kind":"ITEM","entity_node_id":"p1:4de3ea533b39d32ea88c89f2","source_span_ids":["p1:8ec9cb30fe7ec782e1586b13","p1:47ee548200831ed50e681883"],"relation_ids":["p1:8b9d6ed0063c9df573dc839d"]}；数量=null
  - 证据：[41,43) undefined；[40,64) undefined；[44,64) undefined；[0,5) undefined；[0,13) undefined；[3,5) undefined

### P · RESOLVED

- 安全员顾宁 [PERFORMER] [RESOLVED]
  - 对象=；主体=；角色=安全员顾宁:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=安全员顾宁:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=安全员顾宁:PERFORMER；条件=null；作用域=null；数量=null
  - 对象=；主体=；角色=安全员顾宁:PERFORMER；条件=null；作用域=null；数量=null
  - 证据：[0,5) undefined；[0,13) undefined；[3,5) undefined；[14,16) undefined；[14,39) undefined；[41,43) undefined；[40,64) undefined；[92,94) undefined；[90,96) undefined；[5,7) undefined

### R · ABSENT

无实际条目。

### V · ABSENT

无实际条目。

### C · RESOLVED

- 完成 [RESOLVED]
  - 对象=；主体=；角色=；条件={"expr_id":"p1:6b880e8bc4aa85c012e7f215","op":"AND","operand_expr_ids":["p1:9e706a101c91fd488517d822","p1:8e81e4fea2a3a9db9baeb015"],"source_span_ids":["p1:0d5d4f83018ed5f86c584f6e","p1:91aa8ea3cca5b9935658c0a0","p1:5114d9e37e7a6a953987c4d2","p1:0d66a5c707e390777f4f75c9"],"relation_ids":["p1:c13655beeadf12e5fde8f676","p1:2cbc11b2ffff9697e3eeda2c"]}；作用域=null；数量=null
  - 证据：[117,119) undefined；[114,119) undefined；[97,107) undefined；[97,113) undefined；[107,113) undefined

### B · UNRESOLVED

- FORBIDDEN 修改 [UNRESOLVED]
  - 对象=；主体=安全员顾宁；角色=；条件=null；作用域=null；数量=null
  - 证据：[92,94) undefined；[90,96) undefined；[0,5) undefined；[0,13) undefined；[3,5) undefined

## 未决项

- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_RELATION: No boundary-eligible action modality
- UNRESOLVED_SCOPE: Action target not syntactically established

完整 IR、关系、证据与 Proof DAG 见 [trace.json](trace.json)。合同 Gate 通过不等于语义通过。
