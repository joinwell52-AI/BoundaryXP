import fs from 'node:fs';import {out,runtime,write} from './common.mjs';
for(const n of fs.readdirSync(out+'retained-tests/').filter(n=>n.startsWith('parser-7p-composition-013-'))){const p=out+'retained-tests/'+n;write(p,fs.readFileSync(p,'utf8').replaceAll("'../docs/","'../../../../../docs/"));}
write(runtime+'export.mjs',fs.readFileSync(runtime+'export.mjs','utf8').replaceAll("'v0.3-7p-composition-013'","'v0.3-7p-composition-013','v0.3-7p-composition-014'"));
