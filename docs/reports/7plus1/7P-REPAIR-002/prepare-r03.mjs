import fs from'node:fs';
const old='research/7plus1-parser/v0.3-7p-repair-002-r02',next='research/7plus1-parser/v0.3-7p-repair-002-r03',report='docs/reports/7plus1/7P-REPAIR-002';
if(fs.existsSync(next))throw Error('REVISION_EXISTS');fs.cpSync(old,next,{recursive:true,errorOnExist:true,force:false});
for(const name of ['engine.mjs','history.mjs','export.mjs','web/native-app.js']){let s=fs.readFileSync(next+'/'+name,'utf8').replaceAll('v0.3-7p-repair-002-r02','v0.3-7p-repair-002-r03').replaceAll("'0.3-7p-repair-002-r02'","'0.3-7p-repair-002-r03'");fs.writeFileSync(next+'/'+name,s);}
for(const suffix of ['.test','-prior.test','-continuation.test']){let s=fs.readFileSync('tests/parser-7p-repair-002-r02'+suffix+'.mjs','utf8').replaceAll('v0.3-7p-repair-002-r02','v0.3-7p-repair-002-r03').replaceAll('v0\\.3-7p-repair-002-r02','v0\\.3-7p-repair-002-r03');fs.writeFileSync('tests/parser-7p-repair-002-r03'+suffix+'.mjs',s,{flag:'wx'});}
fs.mkdirSync(report+'/accepted-candidate',{recursive:true});
for(const name of ['freeze-implementation','replay','run-tests']){let s=fs.readFileSync(report+'/'+name+'-r02.mjs','utf8').replaceAll('v0.3-7p-repair-002-r02','v0.3-7p-repair-002-r03').replaceAll('/final-run','/accepted-candidate').replaceAll('tests/parser-7p-repair-002-r02','tests/parser-7p-repair-002-r03');fs.writeFileSync(report+'/'+name+'-r03.mjs',s,{flag:'wx'});}
