import fs from'node:fs';const d='docs/reports/7plus1/7P-REPAIR-006',rt='research/7plus1-parser/v0.3-7p-repair-006';
for(const n of ['engine.mjs','export.mjs'])fs.writeFileSync(rt+'/'+n,fs.readFileSync(rt+'/'+n,'utf8').replaceAll('v0.3-7p-repair-005','v0.3-7p-repair-006').replaceAll("compiler_version:'0.3-7p-repair-005'","compiler_version:'0.3-7p-repair-006'"),'utf8');
fs.writeFileSync(d+'/collect.mjs',fs.readFileSync('docs/reports/7plus1/7P-REPAIR-005/collect.mjs','utf8').replaceAll('7P-REPAIR-005','7P-REPAIR-006').replaceAll('v0.3-7p-repair-005','v0.3-7p-repair-006'),{flag:'wx'});
