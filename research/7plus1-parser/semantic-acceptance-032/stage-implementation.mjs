// Explicit task-only staging. Never stages historical assets or unrelated work.
import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const scoped=['research/7plus1-parser/llm-first-028','research/7plus1-parser/v0.3-p2.1-generalization/web','product/short-compiler','package.json'];
if(execFileSync('git',['diff','--cached','--name-only'],{encoding:'utf8'}).trim())throw Error('EXISTING_INDEX_NOT_EMPTY');
const changed=execFileSync('git',['diff','--name-only','-z','--',...scoped],{encoding:'utf8'}).split('\0').filter(Boolean);
const added=['product/short-compiler/cli-installed.mjs','research/7plus1-parser/llm-first-028/tests/domain-clarification.test.mjs','research/7plus1-parser/llm-first-028/tests/audit-issue-context.test.mjs','research/7plus1-parser/llm-first-028/tests/transport-cancel.test.mjs','tests/short-compiler-domain-clarification.test.mjs','tests/short-compiler-audit-context.test.mjs'];
const helper='research/7plus1-parser/semantic-acceptance-032/';added.push(...fs.readdirSync(helper).filter(f=>f.endsWith('.mjs')).map(f=>helper+f));
const report='docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG/';added.push(...['AUTHORIZATION.json','CALL-BUDGET.json','ENVIRONMENT.json','SOURCE-DOMAIN-REVIEW.md','SOURCE-EXPECTATIONS.json'].map(f=>report+f));
added.push(...fs.readdirSync(report+'inputs').map(f=>report+'inputs/'+f));
const protectedPaths=new Set(JSON.parse(fs.readFileSync('.boundx/experiments/032/PRE-WORKTREE.json')).dirty.map(x=>x.path));
const paths=[...new Set([...changed,...added])];for(const p of paths){if(protectedPaths.has(p))throw Error('PROTECTED_DIRTY_FILE:'+p);if(!fs.existsSync(p))throw Error('MISSING_TASK_FILE:'+p);}
execFileSync('git',['add','--',...paths],{stdio:'inherit'});console.log(JSON.stringify({task_only_staged:paths.length,paths},null,2));
