export const cases=[];
for(let i=0;i<5;i++){
 const file=`lib/unit_${i}.py`,names=[`alpha_${i}`,`beta_${i}`,`gamma_${i}`],dir=`pkg_${i}/`,doc=`guide_${i}.md`;
 const add=(kind,text,values=[])=>cases.push({id:`${kind}-${i}`,kind,text,values});
 add('FILE_METHODS',`修改 \`${file}\` 中 \`${names[0]}\` / \`${names[1]}\` / \`${names[2]}\` 三个方法。`,[file,...names]);
 add('MODULE_FUNCTIONS',`修订 \`module_${i}\` 的 \`f_${i}\` / \`g_${i}\` / \`h_${i}\` / \`j_${i}\` 四个函数。`);
 add('COMMAND',`读取 \`tool_${i} inspect --all\`。`,[`tool_${i} inspect --all`]);
 add('COLLECTION',`检查 \`in_${i}.csv\` + \`log_${i}/\`。`,[`in_${i}.csv`,`log_${i}/`]);
 add('COMPARE',`对比 \`left_${i}.json\` 与 \`right_${i}.json\`。`,[`left_${i}.json`,`right_${i}.json`]);
 add('ABSTRACT',`生成方案${i}。`,[`方案${i}`]);
 add('MODIFY',`修改 \`${file}\`。`,[file]);
 add('CONDITIONAL',`如果检查失败，则生成 \`alert_${i}.md\`。`,[`alert_${i}.md`]);
 add('NO_CHANGE',`保持 \`${names[0]}\` 不变。`,[names[0]]);
 add('NO_CHANGE_SUFFIX',`\`${names[1]}\` 保持不变。`,[names[1]]);
 add('FORBID',`禁止修改 \`${file}\`。`,[file]);
 add('CONDITIONAL_B',`如果检查失败，禁止修改 \`${file}\`。`,[file]);
 add('LIST',`检查：\n  - \`one_${i}.json\`\n  - \`two_${i}.json\``);
 add('DIRECTORY',`修改 \`${dir}\` 中 \`one_${i}.py\` / \`two_${i}.py\`。`);
 add('CONTENT',`编写 \`${doc}\` 文档。\n## 正文\n必须生成 \`future_${i}.json\`。\n禁止修改 \`settings_${i}.json\`。\n如果检查失败，则停止操作。`,[doc]);
 add('CONTENT_SET',`编写 \`guide_${i}.zh.md\` 与 \`guide_${i}.en.md\` 文档。\n## 正文\n必须生成 \`future_${i}.json\`。`);
 add('ACCEPTANCE_UNKNOWN',`## 验收\n以质量为准${i}。`);
 add('READ_LOOK',`看 \`tree_${i}/\`、\`record_${i}.json\`、\`cli_${i} log\`。`,[`tree_${i}/`,`record_${i}.json`,`cli_${i} log`]);
 add('PRODUCE',`只产出一份备选方案${i}。`,[`备选方案${i}`]);
 add('WRITE',`写出 \`note_${i}.md\`。`,[`note_${i}.md`]);
 add('CONTENT_MODAL',`编写 \`${doc}\` 文档。\n## 正文\n不得猜测接口${i}。\n必须整理数据${i}。`);
 add('COMPOSITE_COMPARE',`对比 \`spec_${i}.md\` 描述的 \`tree_${i}/{a,b,c}/\` 与 \`impl_${i}.py\`、\`state_${i}.py\` 实际实现。`);
 add('NESTED',`检查：\n  - \`group_${i}/\`：\n    - \`a_${i}.json\`\n    - \`b_${i}.json\``);
}
