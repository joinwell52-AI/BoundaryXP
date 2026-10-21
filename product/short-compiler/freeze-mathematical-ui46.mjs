import fs from 'node:fs';
let code=fs.readFileSync(new URL('./freeze-mathematical-ui45.mjs',import.meta.url),'utf8');
code=code.replaceAll('ui.45','ui.46').replaceAll('031-r1-c19','031-r1-c20').replaceAll('mathematical-ui45-overlay','mathematical-ui46-overlay').replaceAll("'FREEZE.json'","'FREEZE-ui46.json'");
await import('data:text/javascript;base64,'+Buffer.from(code.replace("from './resources.mjs'","from '"+new URL('./resources.mjs',import.meta.url).href+"'")).toString('base64'));
