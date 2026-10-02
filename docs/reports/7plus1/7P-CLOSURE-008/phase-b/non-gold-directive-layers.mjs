// Frozen independent source/layer contracts, declared before execution.
export const cases=[
 {id:'LAYER_MAIN_ZH',text:'检查 `maple.json`。',asserted:['检查']},
 {id:'LAYER_MAIN_EN',text:'Inspect `birch.csv`.',asserted:['Inspect']},
 {id:'LAYER_QUOTE',text:'在说明中加一句“检查 `willow.csv`”。',forbidden:['检查']},
 {id:'LAYER_QUOTE_SPLIT',text:'在文档中写一句“找不到文件？检查 `juniper.json`”。',forbidden:['检查']},
 {id:'LAYER_PAREN',text:'新建 `cedar.md`（双语，跟随 wheel 部署）。',forbidden:['跟随']},
 {id:'LAYER_QUALIFIER',text:'创建 `spruce.md`，覆盖**配置流程**的内容。',forbidden:['覆盖']},
 {id:'LAYER_BACKGROUND_COMPLEMENT',text:'## 背景\n现有说明未覆盖：\n1. 安装 Python 包\n2. 检查版本\n\n## 必做\n检查 `ash.json`。',forbidden:['安装'],asserted:['检查']},
 {id:'LAYER_BACKGROUND_EN',text:'## Background\nThe manual does not cover:\n1. Inspect `old.csv`.\n\n## Required\nInspect `new.csv`.',not_objects:['old.csv'],asserted:['Inspect']},
 {id:'LAYER_MIXED_EXPLICIT',text:'## 背景\n历史任务失败。\n必须检查 `oak.json`。',asserted:['检查']},
 {id:'LAYER_AFTER_SENTENCE',text:'昨天检查失败。检查 `elm.json`。',asserted:['检查']},
 {id:'LAYER_CODE',text:'```python\ninspect("hidden.csv")\n```',no_actions:true},
 {id:'LAYER_NOTES',text:'## 备注\n工具层改造是未来规划，留给设计组起草。',forbidden:['留给']}
];
