import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json'),'utf8'));
const failures=manifest.files.filter(x=>!fs.existsSync(path.join(root,x.path))||createHash('sha256').update(fs.readFileSync(path.join(root,x.path))).digest('hex')!==x.sha256);
console.log(JSON.stringify({version:manifest.version,files:manifest.files.length,integrity:failures.length?'FAIL':'PASS',failures}));if(failures.length)process.exitCode=1;
