import fs from'node:fs';import path from'node:path';
const root=path.resolve('docs/reports/7plus1/7P-REPAIR-002');
for(const name of ['IMPLEMENTATION-FROZEN.json','RUNS.json','TESTS.json']){
 const original=path.resolve(root,name),archive=path.resolve(root,'FIRST-CANDIDATE-'+name),final=path.resolve(root,'final-candidate',name);
 if(![original,archive,final].every(p=>p.startsWith(root+path.sep)))throw Error('PATH_ESCAPE');
 if(!fs.existsSync(final)||fs.existsSync(archive))throw Error('FINAL_NOT_READY_OR_ALREADY_CONSOLIDATED');
 fs.renameSync(original,archive);fs.copyFileSync(final,original,fs.constants.COPYFILE_EXCL);
}
