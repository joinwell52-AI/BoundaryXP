import fs from 'node:fs';
let code=fs.readFileSync(new URL('./replay-joint-ui55.mjs',import.meta.url),'utf8').replaceAll('ui.55','ui.57').replaceAll('final-ui55-replay','final-ui57-replay');
await import('data:text/javascript;base64,'+Buffer.from(code.replace("from './resources.mjs'","from '"+new URL('./resources.mjs',import.meta.url).href+"'")).toString('base64'));
