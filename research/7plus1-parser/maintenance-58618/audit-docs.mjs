// Read-only audit of Git documents; no checkout/merge or documentation rewrite.
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';import {report,write} from './prepare.mjs';
const git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:64000000}).trimEnd();
const main=git(['rev-parse','origin/main']),review=git(['rev-parse','HEAD']);
const targets=[
 ['origin/main','README.zh-CN.md',/Producer|spaCy|HanLP|npm run ui|Gold 100|200 cases|600|1800|当前状态|产品版本|Wire Contract|安装包|完整产品手册|Input|Output/],
 ['origin/main','QUICKSTART.md',/npm run ui|不固定端口|NLP|LLM|配置Producer/],
 ['origin/main','docs/PRODUCER-ADAPTER-CONTRACT.md',/目标链路|可替换|LLM接口|本地NLP/],
 ['origin/main','docs/FUNCTIONS.md',/Producer|Formalizer|Gold|本地交付/],
 ['origin/main','docs/BOUNDARYXP-PRODUCT-MANUAL.md',/主路线|spaCy|HanLP|参考路线|Core Gold|L3 Gold|200|600|1800|npm run ui/],
 ['origin/main','docs/VALIDATION.md',/Core 100|L3 100|600|1800|v1.2/],
 ['HEAD','README.md',/固定协议|无 npm|7plus1|npm run ui|产品架构|boundx-task/],
 ['HEAD','AGENTS.md',/v0.2|FULL_COMPILER|LLM|当前唯一Gold|当前以用户修订|当前专项授权/],
 ['HEAD','docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md',/规范版本|O \||当前实现任务|主链|两个|量化|强制补充/],
 ['HEAD','product/short-compiler/使用说明.md',/候选|300|Codex CLI|58619|端口|58618|结果|PARTIAL/],
 ['HEAD','product/short-compiler/ACCEPTANCE.md',/POLICY|PARTIAL|最终|53|10次/],
 ['HEAD','docs/tasks/7plus1/CURRENT-TASK.md',/当前优先|58618|candidate|PARTIAL|175|主链/]
];
const docs=targets.map(([ref,file,pattern])=>{const text=git(['show',ref+':'+file]);return{ref:ref==='origin/main'?main:review,file,sha256:createHash('sha256').update(text).digest('hex'),lines:text.split('\n').flatMap((text,i)=>pattern.test(text)?[{line:i+1,text}]:[])};});
const mainPkg=JSON.parse(git(['show','origin/main:package.json'])),reviewPkg=JSON.parse(git(['show','HEAD:package.json']));
const list=git(['ls-tree','-r','--name-only','HEAD']);
write('DOCUMENTATION-EVIDENCE.json',{at:new Date().toISOString(),main_commit:main,review_base_commit:review,
 branch_relation:'MAIN_NOT_MERGED; current candidate lives on review/7plus1-parser',main_scripts:mainPkg.scripts,review_base_scripts:{ui:reviewPkg.scripts.ui,short_ui:reviewPkg.scripts['7plus1:ui']},
 review_has_readme_zh_cn:list.split('\n').includes('README.zh-CN.md'),docs,scope:'READ_ONLY; no README/manual/Gold/definition edits'});
for(const d of docs)console.log(JSON.stringify({file:d.file,ref:d.ref.slice(0,8),lines:d.lines}));
