export const cases=[
 {id:'MIXED_ZH',text:'## 现场\n系统此前连接 old_db。\n必须检查 `new.json`。',actions:1},
 {id:'MIXED_EN',text:'## Background\nThe old job writes old.csv.\nInspect `new.csv`.',actions:1},
 {id:'MIXED_CODE',text:'## 背景\n```python\ncheck("private.json")\n```',actions:0},
 {id:'MIXED_QUOTE',text:'## 背景\n> 必须检查 `quoted.json`。',actions:0},
 {id:'MIXED_CONDITION',text:'## 背景\n如果检查失败，则生成 `alert.json`。',actions:1,condition:true},
 {id:'MIXED_OLD',text:'## 现状\n昨天检查了 `previous.json`。',actions:0}
];
