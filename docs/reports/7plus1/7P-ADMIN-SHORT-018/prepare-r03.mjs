import fs from 'node:fs';const o='docs/reports/7plus1/7P-ADMIN-SHORT-018/';
function save(n,s){if(fs.existsSync(o+n))throw Error('Exists');fs.writeFileSync(o+n,s,'utf8');}
save('freeze-r03.mjs',fs.readFileSync(o+'freeze.mjs','utf8').replace('CANDIDATE-FREEZE.json','CANDIDATE-FREEZE-r03.json'));
save('retention-r03.mjs',fs.readFileSync(o+'retention.mjs','utf8').replaceAll('CANDIDATE-FREEZE.json','CANDIDATE-FREEZE-r03.json').replaceAll('retention','retention-r03'));
save('test-runner-r03.mjs',fs.readFileSync(o+'test-runner.mjs','utf8').replaceAll("OUT+mode+'-REGRESSION", "OUT+mode+'-r03-REGRESSION").replaceAll('retained-tests/','retained-tests-r03/').replaceAll('RETAINED-REDIRECT-AUDIT.json','RETAINED-REDIRECT-AUDIT-r03.json'));
