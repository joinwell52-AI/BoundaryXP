import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {cases} from '../llm-first-028/tests/short-texts.mjs';import {deliveryCases} from '../llm-first-028/tests/delivery-cases.mjs';
import {implementationInventory,runtimeInventory} from '../llm-first-028/evidence.mjs';import {probeCodex} from '../llm-first-028/provider.mjs';import {writeJSON} from '../llm-first-028/engine.mjs';import {sha256} from '../llm-first-028/source.mjs';
export const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG');
const old=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-ACCURACY-030'),expected=JSON.parse(fs.readFileSync(path.join(old,'EXPECTED-FACTS.json')));
fs.mkdirSync(path.join(report,'inputs'),{recursive:true});
const plan=[...expected.cases.map(c=>({...c,origin:'030 regression; expectations plus ADMIN O amendment'})),...cases.map(c=>({...c,origin:'028/029 regression'})),...deliveryCases.map(c=>({...c,origin:'029 regression'}))];
for(const c of plan){const bytes=c.id.startsWith('Q')?fs.readFileSync(path.join(old,'inputs',c.id+'.txt')):Buffer.from(c.text,'utf8');const file=path.join(report,'inputs',c.id+'.txt');fs.writeFileSync(file,bytes,{flag:'wx'});c.sha256=sha256(bytes);}
writeJSON(path.join(report,'SOURCE-EXPECTATIONS.json'),{created_at:new Date().toISOString(),reviewer:'executing Codex, source-led development review, not ADMIN case signing',cases:plan,o_amendment:{authority:'AUTHORIZATION.md',all_cases:'Explicit permitted/required artifact delivery appears in O as DELIVERABLE; no inferred generation/existence/external input',Q22:'Required handover.md delivery in O; preserve necessary completion',Q23:'Required handover.md delivery in O; preserve sufficient completion',optional:'Permitted generated result and NOT_REQUIRED delivery remain separate'},historical_results_030_unchanged:true});
const probe=probeCodex();writeJSON(path.join(report,'ENVIRONMENT.json'),probe);
writeJSON(path.join(report,'DEVELOPMENT-INVENTORY.json'),{head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),implementation:implementationInventory(),runtime:runtimeInventory(),requested_model:'gpt-6.1-sol',reasoning:'medium',binary:probe.binary,binary_sha256:probe.binary_sha256,max_model_requests:240});
console.log(JSON.stringify({cases:plan.length,binary:probe.binary,version:probe.version}));
