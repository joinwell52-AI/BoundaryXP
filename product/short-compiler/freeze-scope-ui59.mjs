import fs from 'node:fs';
let code=fs.readFileSync(new URL('./freeze-scope-ui58.mjs',import.meta.url),'utf8');
code=code.replace("parent='0.1.0-candidate.031-r1.2-ui.57'","parent='0.1.0-candidate.031-r1.2-ui.58'").replace("version='0.1.0-candidate.031-r1.2-ui.58'","version='0.1.0-candidate.031-r1.2-ui.59'").replaceAll('031-r1-c30','031-r1-c31').replaceAll('scope-ui58-overlay','scope-ui59-overlay').replaceAll('FREEZE-ui58','FREEZE-ui59').replaceAll('model_resources_changed:true','model_resources_changed:false');
code=code.replace("const extras=['src/bxp/scope-domains.mjs','research/7plus1-parser/llm-first-028/scope-results.mjs']","const extras=['src/bxp/ir-binding-consistency.mjs']");
await import('data:text/javascript;base64,'+Buffer.from(code.replace("from './resources.mjs'","from '"+new URL('./resources.mjs',import.meta.url).href+"'")).toString('base64'));
