// Evaluation-only registry. Never imported by the engine, bundles or Provider.
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {sha256} from '../llm-first-028/source.mjs';
export const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG');
export const write=(name,value)=>{const p=path.join(report,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(value,null,2)+'\n',{flag:'wx'});};
const old=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG');
const d=[
 ['D01','请PM列出settings.json中的配置项，生成settings-list.md。本任务不得更改该文件内的任何配置项。','明确单文件全称；独立动作和产物；不扩大域'],
 ['D02','请PM列出settings.json中的配置项，生成settings-list.md。本任务不得更改任何文件中的任何配置项，包括settings.json以外文件中的配置项。','明示跨文件禁令；正向输入不扩大；无许可'],
 ['D03','请PM核对alpha.json中的配置项，不得更改其中任何一项。另请QA生成check.md。','唯一其中回指；alpha内全称；QA独立结果'],
 ['D04','请PM核对alpha.json和beta.json的配置项。本任务不得更改上述两个文件中的任何配置项。','两个文件内配置项全称；不只是两个文件实体'],
 ['D05','请PM读取app.json。本任务不得更改app.json中的任何配置项，debug项除外；本句不授予更改debug项的许可。','文件内全称减例外；例外不是许可'],
 ['D06','请PM核对a.json和b.json。不得更改a.json中的timeout项及b.json中的retries项。','两个有限具体项与各自文件身份；不全称'],
 ['D07','请PM读取a.json和b.json；不得更改该文件中的任何配置项；另请QA生成audit.md。','单数文件回指竞争；禁令及全称保留；独立读取与QA生成'],
 ['D08','请PM列出settings.json中的配置项，并生成settings-list.md；不得更改任何配置项。ADMIN补充：这条更改禁令仅针对settings.json内的配置项，不据此授予对其他对象的任何操作权限。','新补充源确定文件内全称；不替换Q05；无额外许可']
];
if(process.argv[2]==='prepare'){
 const registry=JSON.parse(fs.readFileSync(path.join(old,'SOURCE-EXPECTATIONS.json')));
 const newly=JSON.parse(fs.readFileSync(path.join(old,'NEW-TEXTS-PREREGISTERED.json')));
 const cases=registry.cases.map(x=>({...x,...(x.id==='Q05'?{historical_expectations:x.expected??x.expectations,product_review_profile:'CLARIFICATION_CORRECT:032-SOURCE-DOMAIN-REVIEW',domain_uniqueness_proved:false}:{})}));
 for(const x of newly.cases)cases.push({...x,sha256:x.source_sha256});
 for(const [id,text,minimum_review]of d)cases.push({id,text,sha256:sha256(Buffer.from(text)),minimum_review,origin:'032 task r01'});
 fs.mkdirSync(path.join(report,'inputs'),{recursive:true});
 for(const c of cases){const bytes=c.id.startsWith('D')?Buffer.from(c.text):fs.readFileSync(path.join(old,'inputs',c.id+'.txt'));if(sha256(bytes)!==c.sha256)throw Error('SOURCE_HASH:'+c.id);if([...bytes.toString('utf8')].length>300)throw Error('SOURCE_LIMIT:'+c.id);fs.writeFileSync(path.join(report,'inputs',c.id+'.txt'),bytes,{flag:'wx'});}
 const repeats=['Q07','Q20','Q25','Q29','Q30'].flatMap(id=>[id+'-R1',id+'-R2']);
 write('SOURCE-EXPECTATIONS.json',{at:new Date().toISOString(),reviewer:'EXECUTING_CODEX_SOURCE_REVIEW_NOT_ADMIN_GOLD',pre_model_outputs:true,old_sources_unchanged:true,q05_profile_revision:'032 r01; SOURCE-DOMAIN-REVIEW.md',cases,final_runs:[...registry.cases.map(c=>c.id),...repeats,...newly.cases.map(c=>c.id),...d.map(c=>c[0])],post_deploy_smoke:'D08'});
 write('AUTHORIZATION.json',{at:new Date().toISOString(),task:'7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG',user_authorized:true,commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),task_sha256:sha256(fs.readFileSync('docs/tasks/7plus1/7P-SHORT-COMPILER-SEMANTIC-ACCEPTANCE-032-LONG.md')),pointer_sha256:sha256(fs.readFileSync('docs/tasks/7plus1/CURRENT-TASK.md')),protected_snapshot_sha256:sha256(fs.readFileSync('.boundx/experiments/032/PRE-WORKTREE.json')),model_requests:0});
 write('CALL-BUDGET.json',{limit:240,development_limit:24,final_reserve_at_freeze:216,development_conservative_used:0,final_conservative_used:0,prior031:239,prior031_limit:240,prior031_r1_q05:175,prior031_r1_q05_limit:180,prior_budgets_unchanged:true,requests_started:0,backend_billing_claimed:false});
 console.log(JSON.stringify({sources:cases.length,final_compilations:registry.cases.length+repeats.length+newly.cases.length+d.length,models:0}));
}
