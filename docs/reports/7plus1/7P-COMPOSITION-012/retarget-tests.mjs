import fs from 'node:fs';import {out,write,digest} from './common.mjs';
const files=fs.readdirSync('tests').filter(n=>n.startsWith('parser-7p-closure-008')&&n.endsWith('.test.mjs')).sort();
const rows=[];
for(const file of files){const p='tests/'+file,src=fs.readFileSync(p,'utf8');const modified=src.replaceAll('research/7plus1-parser/v0.3-7p-closure-008/','research/7plus1-parser/v0.3-7p-composition-012/').replaceAll('../research/','../../../../../research/').replaceAll('../docs/','../../../../../docs/');const target=out+'retained-tests/'+file;
 write(target,modified);rows.push({original:p,original_sha256:digest(p),retargeted:target,retargeted_sha256:digest(target),assertions_unchanged:true,transformation:'ONLY_RUNTIME_DIRECTORY_AND_RELATIVE_MODULE_LOCATION'});}
write(out+'RETAINED-TEST-RETARGET.json',rows);console.log(JSON.stringify({files:rows.length}));
