import fs from'node:fs';
const root='research/7plus1-parser/v0.3-7p-repair-002/';
for(const name of ['engine.mjs','history.mjs','export.mjs','web/native-app.js']){
 let s=fs.readFileSync(root+name,'utf8').replaceAll('v0.3-7p-repair-001','v0.3-7p-repair-002').replaceAll("'0.3-7p-repair-001'","'0.3-7p-repair-002'");
 if(['history.mjs','export.mjs'].includes(name))s=s.replaceAll('../v0.3-p2.2-scope-consistency-repair/', '../v0.3-7p-repair-001/');
 if(name==='engine.mjs')s=s.replace('export function compileNative',"import {structuredRecovery} from './structured-recovery.mjs';\nexport function compileNative").replace('f.tools.attachContext();','structuredRecovery(f);f.tools.attachContext();');
 fs.writeFileSync(root+name,s);
}
