export const cases=[
 {id:'NEGATIVE_INTRODUCE',text:'不引入 `temp/{id}.marker`。',forbidden:true},
 {id:'NEGATIVE_REMOVE',text:'不删除 `archive.csv`。',forbidden:true},
 {id:'NEGATIVE_REPEAT',text:'不再运行 `cleanup.py`。',forbidden:true},
 {id:'NEGATIVE_NOT_REQUIRED',text:'不需要生成 `result.csv`。',forbidden:false},
 {id:'NEGATIVE_BACKGROUND',text:'# 背景\n不连接生产数据库。',forbidden:false},
 {id:'NEGATIVE_QUOTE',text:'> 不删除 archive.csv。',forbidden:false},
 {id:'NEGATIVE_CODE',text:'```text\n不删除 archive.csv。\n```',forbidden:false},
 {id:'NEGATIVE_STATE',text:'服务不存在。',forbidden:false}
];
