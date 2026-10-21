import fs from 'node:fs';
let code=fs.readFileSync(new URL('./freeze-joint-ui56.mjs',import.meta.url),'utf8');
code=code.replace("parent='0.1.0-candidate.031-r1.2-ui.55'","parent='0.1.0-candidate.031-r1.2-ui.56'").replace("version='0.1.0-candidate.031-r1.2-ui.56'","version='0.1.0-candidate.031-r1.2-ui.57'").replaceAll('031-r1-c28','031-r1-c29').replaceAll('joint-ui56-overlay','joint-ui57-overlay').replaceAll('FREEZE-ui56','FREEZE-ui57');
code=code.replace("new URL('./freeze-joint-ui53.mjs',import.meta.url)","new URL('"+new URL('./freeze-joint-ui53.mjs',import.meta.url).href+"')");
await import('data:text/javascript;base64,'+Buffer.from(code.replace("new URL('./resources.mjs',import.meta.url)","new URL('"+new URL('./resources.mjs',import.meta.url).href+"')")).toString('base64'));
