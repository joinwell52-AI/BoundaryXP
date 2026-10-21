export const cases=[
 {id:'INQUIRY_DEPLOY',text:'# 任务\n生成 report.txt，回答以下问题：\n## Q1\n必须部署 payment-api 才能查看状态吗？\n',inquiry:true,forbidEmbedded:true},
 {id:'INQUIRY_EN',text:'# Task\nGenerate report.txt and answer the following questions:\n## Q1\nMust the operator deploy relay-api?\n',inquiry:true,forbidEmbedded:true},
 {id:'INQUIRY_READ',text:'# 任务\n生成 report.txt，回答以下问题：\n## Q1\n看 settings.yaml。\n必须部署 relay-api 才能查看状态吗？\n',inquiry:true,forbidEmbedded:true,read:true},
 {id:'INQUIRY_DIFFERENT_SECTION',text:'# 任务甲\n生成 report.txt，回答以下问题：\n## Q1\n服务运行了吗？\n# 任务乙\n必须部署 relay-api？\n',outside:true},
 {id:'INQUIRY_NO_GOVERNOR',text:'# 任务\n必须部署 relay-api？\n',outside:true}
];
