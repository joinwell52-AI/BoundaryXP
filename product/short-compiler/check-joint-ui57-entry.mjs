import fs from 'node:fs';
let code=fs.readFileSync(new URL('./check-joint-entry.mjs',import.meta.url),'utf8').replaceAll('ui.56','ui.57').replaceAll('ENTRY-before.json','ENTRY-ui57-before.json').replace("root+'/ENTRY-'+phase+'.json'","root+'/ENTRY-ui57-'+phase+'.json'");
await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
