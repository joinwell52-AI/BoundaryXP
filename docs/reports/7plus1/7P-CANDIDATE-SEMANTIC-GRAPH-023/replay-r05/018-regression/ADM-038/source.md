负责人丁岚批准检查申请后，QA 才能读取 production-snapshot.csv 并生成 snapshot-review.md。未经批准不得读取该快照。PM 接收报告；此次不得连接生产数据库。

**审阅重点：** 正向动作和禁止共用审批条件；快照不等于生产库连接。