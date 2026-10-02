import fs from 'node:fs';
const s=fs.readFileSync('tests/parser-7p-repair-002-r03.test.mjs','utf8').replaceAll('../research/7plus1-parser/v0.3-7p-repair-002-r03/','../research/7plus1-parser/v0.3-7p-repair-003/');fs.writeFileSync('tests/parser-7p-repair-003-prior.test.mjs',s,{flag:'wx'});
