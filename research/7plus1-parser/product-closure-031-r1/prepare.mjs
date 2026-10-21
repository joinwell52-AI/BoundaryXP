import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';import {probeCodex} from '../llm-first-028/provider.mjs';
export const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG');
export const old=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG');
if(process.argv[1]===new URL(import.meta.url).pathname.slice(1).replaceAll('/','\\')||process.argv.includes('--prepare')){
 fs.mkdirSync(path.join(report,'inputs'),{recursive:true});
 const expected=JSON.parse(fs.readFileSync(path.join(old,'SOURCE-EXPECTATIONS.json')));
 for(const c of expected.cases){const bytes=fs.readFileSync(path.join(old,'inputs',c.id+'.txt'));if(sha256(bytes)!==c.sha256)throw Error('SOURCE_CHANGED:'+c.id);fs.writeFileSync(path.join(report,'inputs',c.id+'.txt'),bytes,{flag:'wx'});}
 fs.writeFileSync(path.join(report,'SOURCE-EXPECTATIONS.json'),JSON.stringify({...expected,origin_report:old,source_expectations_changed:false,review_status:'EXECUTING_CODEX_SOURCE_REVIEW_NOT_ADMIN_GOLD',evaluation_clarification:'THREE-TRACE-DIAGNOSIS.md; availability versus hard event order'},null,2)+'\n',{flag:'wx'});
 const probe=probeCodex();fs.writeFileSync(path.join(report,'ENVIRONMENT.json'),JSON.stringify({...probe,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({sources:expected.cases.length,binary:probe.binary,version:probe.version,budget:180,path:'B',final_normal_calls:142}));
}
