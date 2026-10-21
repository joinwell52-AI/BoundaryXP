import fs from 'node:fs';import path from 'node:path';import {sha256} from './blind-generator.mjs';
const report='docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG',from='research/7plus1-parser/v0.3-admin-root-024',to='research/7plus1-parser/v0.3-natural-generalization-025';
const freeze=JSON.parse(fs.readFileSync(report+'/BLIND-200-GENERATOR-FREEZE.json'));
for(const f of freeze.files)if(sha256(fs.readFileSync(report+'/'+f.path))!==f.sha256)throw Error('GENERATOR_FREEZE_DRIFT');
if(fs.existsSync(to))throw Error('RUNTIME_ALREADY_EXISTS');
fs.cpSync(from,to,{recursive:true,errorOnExist:true,force:false});
console.log(JSON.stringify({runtime:to,generator_frozen_before_copy:true}));
