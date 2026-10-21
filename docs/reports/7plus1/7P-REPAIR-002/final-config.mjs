import fs from'node:fs';
const root='docs/reports/7plus1/7P-REPAIR-002';
fs.renameSync(root+'/accepted-candidate',root+'/final-candidate');
for(const name of ['freeze-implementation','replay','run-tests']){let s=fs.readFileSync(root+'/'+name+'-r03.mjs','utf8').replaceAll('/accepted-candidate','/final-candidate');
 if(name==='freeze-implementation')s=s.replace("'tests/parser-7p-repair-002-r03-continuation.test.mjs'","'tests/parser-7p-repair-002-r03-continuation.test.mjs','tests/parser-7p-repair-002-r03-reference.test.mjs','docs/reports/7plus1/7P-REPAIR-002/collect-reference-negative.mjs'");
 if(name==='run-tests')s=s.replace("'tests/parser-7p-repair-002-r03-continuation.test.mjs'","'tests/parser-7p-repair-002-r03-continuation.test.mjs','tests/parser-7p-repair-002-r03-reference.test.mjs'");
 fs.writeFileSync(root+'/'+name+'-r03.mjs',s);
}
let s=fs.readFileSync(root+'/compare.mjs','utf8').replace("out=dir+'/replay/'+id","out=dir+'/final-candidate/replay/'+id").replace("dir+'/replay/REF-001/RUN.json'","dir+'/final-candidate/replay/REF-001/RUN.json'");fs.writeFileSync(root+'/compare.mjs',s);
s=fs.readFileSync(root+'/review-inventory.mjs','utf8').replace("7P-REPAIR-002/replay/","7P-REPAIR-002/final-candidate/replay/");fs.writeFileSync(root+'/review-inventory-final.mjs',s,{flag:'wx'});
