export const cases=[
 {id:'TABLE_ACTION_OBJECT',text:'# Deliverables\n| Action | Object |\n|---|---|\n| must modify | relay.ini |\n',frames:1,action:true,output:true},
 {id:'TABLE_FORBID',text:'# 交付\n| 动作 | 对象 |\n|---|---|\n| 不得修改 | archive.yaml |\n',frames:1,forbidden:true},
 {id:'TABLE_CONDITION',text:'# 交付\n| 操作 | 文件 | 条件 |\n|---|---|---|\n| 必须生成 | result.csv | 尚未批准 |\n',frames:1,action:true,output:true,condition:true},
 {id:'TABLE_ACTOR',text:'# 交付\n| 操作 | 对象 | 执行者 |\n|---|---|---|\n| 必须检查 | relay.ini | 核验员 |\n',frames:1,action:true,participant:true},
 {id:'TABLE_UNSTATED_MODE',text:'| Action | Object |\n|---|---|\n| modify | relay.ini |\n',frames:0},
 {id:'TABLE_NOT_REQUIRED',text:'# Deliverables\n| Action | Object |\n|---|---|\n| need not generate | result.csv |\n',frames:1},
 {id:'TABLE_RISK_NEGATIVE',text:'# Deliverables\n| Risk | Mitigation |\n|---|---|\n| relay.ini | must modify |\n',frames:0},
 {id:'TABLE_UNKNOWN_OBJECT',text:'# 交付\n| 动作 | 对象 |\n|---|---|\n| 必须检查 | 上述文件 |\n',frames:0},
 {id:'TABLE_COMPOSITE_OBJECT',text:'# 交付\n| 动作 | 对象 |\n|---|---|\n| 必须检查 | relay.ini 和 archive.yaml |\n',frames:0},
 {id:'TABLE_DUPLICATE_ROLE',text:'# Deliverables\n| Action | Object | Object |\n|---|---|---|\n| must modify | relay.ini | result.csv |\n',frames:0}
];
