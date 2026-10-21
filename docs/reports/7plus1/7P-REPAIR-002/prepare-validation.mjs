import fs from'node:fs';
const old='docs/reports/7plus1/7P-REPAIR-001/',next='docs/reports/7plus1/7P-REPAIR-002/';
let s=fs.readFileSync('src/__tests__/7plus1/regression/repair-001.test.mjs','utf8').replaceAll('../../../../','../').replaceAll('v0.3-7p-repair-001','v0.3-7p-repair-002').replaceAll('v0\\.3-7p-repair-001','v0\\.3-7p-repair-002');
fs.writeFileSync('tests/parser-7p-repair-002-prior.test.mjs',s,{flag:'wx'});
for(const name of ['freeze-implementation.mjs','replay.mjs','run-tests.mjs']){
 let s=fs.readFileSync(old+name,'utf8').replaceAll('7P-REPAIR-001','7P-REPAIR-002').replaceAll('v0.3-7p-repair-001','v0.3-7p-repair-002').replaceAll('parser-7p-repair-001','parser-7p-repair-002').replaceAll('2bab790eb39ddfd4cfe198abbbd57642be1809b7','13bd28fb25b02ee9358f20f2e1f2baa58df802f4');
 if(name==='replay.mjs')s=s.replace("../../../../research/7plus1-parser/v0.3-p2.2-scope-consistency-repair/meeting-assertions.mjs","../7P-REPAIR-001/test-support/meeting-assertions.mjs");
 if(name==='run-tests.mjs')s=s.replace("'tests/parser-7p-repair-002.test.mjs'","'tests/parser-7p-repair-002.test.mjs','tests/parser-7p-repair-002-prior.test.mjs'");
 fs.writeFileSync(next+name,s,{flag:'wx'});
}
