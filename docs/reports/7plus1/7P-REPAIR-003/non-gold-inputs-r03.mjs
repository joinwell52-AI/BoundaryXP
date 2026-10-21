import{cases as old}from './non-gold-inputs-r02.mjs';export const cases=[...old];for(let i=0;i<5;i++){
cases.push({id:'LIST_QUESTION-'+i,kind:'LIST_QUESTION',text:`检查：\n  - \`worker_${i}\` 是否默认生成 \`cache_${i}/\`？`});
cases.push({id:'NON_IMPERATIVE-'+i,kind:'NON_IMPERATIVE',text:`写 "unknown_${i}" 也合法。`});
cases.push({id:'FILE_CLASS-'+i,kind:'FILE_CLASS',text:`禁止修改任何 \`.cfg${i}\` / \`.dat${i}\` 源文件。`});
cases.push({id:'CONTENT_PAREN-'+i,kind:'CONTENT_PAREN',text:`编写 \`manual_${i}.md\` 文档。\n## 正文\n**§2 · 配置（不锁固定标签${i}）**`});
}
