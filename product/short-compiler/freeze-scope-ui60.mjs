import fs from 'node:fs';
let code=fs.readFileSync(new URL('./freeze-scope-ui59.mjs',import.meta.url),'utf8');
code=code.replace("parent='0.1.0-candidate.031-r1.2-ui.58'","parent='0.1.0-candidate.031-r1.2-ui.59'").replace("version='0.1.0-candidate.031-r1.2-ui.59'","version='0.1.0-candidate.031-r1.2-ui.60'").replaceAll('031-r1-c31','031-r1-c32').replaceAll('scope-ui59-overlay','scope-ui60-overlay').replaceAll('FREEZE-ui59','FREEZE-ui60').replace("const extras=['src/bxp/ir-binding-consistency.mjs']","const extras=[]");
// The nested source loader is resolved against its original helper.
code=code.replace("new URL('./freeze-scope-ui58.mjs',import.meta.url)","new URL('"+new URL('./freeze-scope-ui58.mjs',import.meta.url).href+"')");
code=code.replaceAll("new URL('./resources.mjs',import.meta.url)","new URL('"+new URL('./resources.mjs',import.meta.url).href+"')");
// Apply the ui60 substitutions to the generated inner freezer as well.
code=code.replace("await import('data:","code=code.replace(\"parent='0.1.0-candidate.031-r1.2-ui.58'\",\"parent='0.1.0-candidate.031-r1.2-ui.59'\").replace(\"version='0.1.0-candidate.031-r1.2-ui.59'\",\"version='0.1.0-candidate.031-r1.2-ui.60'\").replaceAll('031-r1-c31','031-r1-c32').replaceAll('scope-ui59-overlay','scope-ui60-overlay').replaceAll('FREEZE-ui59','FREEZE-ui60').replace(\"const extras=['src/bxp/ir-binding-consistency.mjs']\",\"const extras=[]\");await import('data:");
await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
