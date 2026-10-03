import fs from 'node:fs';
const o='docs/reports/7plus1/7P-ADMIN-SHORT-018/';
function save(name,s){if(fs.existsSync(o+name))throw Error('Exists '+name);fs.writeFileSync(o+name,s,'utf8');}
save('freeze-r02.mjs',fs.readFileSync(o+'freeze.mjs','utf8').replace('CANDIDATE-FREEZE.json','CANDIDATE-FREEZE-r02.json'));
save('retention-r02.mjs',fs.readFileSync(o+'retention.mjs','utf8').replaceAll('CANDIDATE-FREEZE.json','CANDIDATE-FREEZE-r02.json').replaceAll('retention','retention-r02'));
save('test-runner-r02.mjs',fs.readFileSync(o+'test-runner.mjs','utf8').replaceAll("OUT+mode+'-REGRESSION", "OUT+mode+'-r02-REGRESSION").replaceAll('retained-tests/','retained-tests-r02/').replaceAll('RETAINED-REDIRECT-AUDIT.json','RETAINED-REDIRECT-AUDIT-r02.json'));
