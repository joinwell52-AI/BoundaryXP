import fs from 'node:fs';import {out,write} from './common.mjs';
for(const name of ['run-tests.mjs','seal.mjs','publish.mjs'])write(out+name,fs.readFileSync(out+name,'utf8').replaceAll('parser-7p-composition-013','parser-7p-composition-014'));
