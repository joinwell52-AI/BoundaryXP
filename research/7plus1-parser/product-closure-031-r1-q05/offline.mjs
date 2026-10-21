import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {report,oldReport,write} from './check.mjs';
import {compileBoundary} from '../llm-first-028/compile.mjs';import {validateSchema} from '../llm-first-028/validate.mjs';import {buildBundle} from '../llm-first-028/bundle.mjs';
import {lockProduct} from '../../../product/short-compiler/resources.mjs';
const prior=path.resolve('.boundx/experiments/031-r1/packages/final-c3');
const priorCompile=(await import(pathToFileURL(path.join(prior,'research/7plus1-parser/llm-first-028/compile.mjs')))).compileBoundary;
const normalize=c=>Object.fromEntries(Object.entries(c.slots).map(([k,v])=>[k,{status:v.status,entries:v.entries.map(f=>({kind:f.kind,status:f.status,event:f.event,roles:f.roles,claim:f.claim,entity:f.entity,expression:f.expression,constraints:f.constraints,content_quantities:f.content_quantities,content_scopes:f.content_scopes})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))}]));
const rows=[];for(const group of ['final','repeat','new'])for(const id of fs.readdirSync(path.join(oldReport,'runs',group))){
 const p=path.join(oldReport,'runs',group,id,'run/trace.json');if(!fs.existsSync(p))continue;const t=JSON.parse(fs.readFileSync(p));
 const before=priorCompile(t.source,t.proposal,t.audit,t.technical),after=compileBoundary(t.source,t.proposal,t.audit,t.technical);
 const same=JSON.stringify(normalize(before.canonical))===JSON.stringify(normalize(after.canonical));assert.ok(same,group+'/'+id);
 const schema=validateSchema('proposal',t.proposal);assert.equal(schema.ok,false);
 rows.push({case:group+'/'+id,legacy_consumer_semantics_preserved:same,new_contract_rejected_legacy_response:!schema.ok,real_calls:0});
}
write('FROZEN-RESPONSE-REGRESSION.json',{mode:'LEGACY_TECHNICAL_CHECKS_CONSUMER_ONLY',new_skill_accuracy:'NOT_TESTED_BY_OLD_RESPONSES',rows,real_calls:0});
const lock=lockProduct(path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2'));lock.verify();
write('ACTIVE-58621-RESOURCES.json',{unchanged:true,snapshot:lock.snapshot,process_not_changed:true,ports_not_added:true});
write('BUNDLE-DIGESTS.json',['parse','audit'].map(phase=>({phase,sha256:buildBundle(phase).sha256,mode:buildBundle(phase).mode,resources:buildBundle(phase).resources.map(({text,...x})=>x)})));
const texts=[
 {id:'Q05',text:fs.readFileSync(path.join(oldReport,'inputs/Q05.txt'),'utf8'),requirements:['原文不变；PM列出settings.json配置项并产生settings-list.md','明确禁止对配置项类别的全称更改；不能用ITEM/布尔ALL/note代替FORALL','不从禁止新增外部I或业务授权']},
 {id:'U-CN',text:'请OPS核对inventory.csv中的所有资产记录；不得删除该文件中的任何资产记录。',requirements:['OPS核对当前文件内记录；I/P/A明确','B全称域包含资产记录CLASS与inventory.csv容器，范围外不扩展']},
 {id:'X-CN',text:'请DEV核对config.json；不得修改该文件中的任何配置项，但debug选项不受本条禁止限制。',requirements:['DEV核对config.json','FORALL(EXCEPT(文件内配置类别域,debug))','例外不新增修改许可或取消其余禁止']},
 {id:'E-CN',text:'请QA读取alpha.txt和beta.txt；不得删除alpha.txt或beta.txt。',requirements:['QA读取两个明确文件','禁止有限枚举两个文件，不扩大成所有文件类别']},
 {id:'U-EN',text:'OPS must inspect records.csv. Do not delete any record in that file.',requirements:['OPS inspect with explicit input file','FORALL category RECORD within same file, deletion FORBIDDEN, not Boolean ALL']},
 {id:'I-EN',text:'QA must read plan.md. Do not modify plan.md.',requirements:['specific FILE item only, no universal/category invention','QA performer retained, read input, modification forbidden']},
 {id:'S00',text:fs.readFileSync(path.join(oldReport,'inputs/S00.txt'),'utf8'),requirements:['PM/QA/ADMIN same current report identity and distinct roles','produced report used in review/submission; approval necessary AFTER','retry LTE3 execution limit; submission sufficient completion; routes.csv specific prohibition']},
 {id:'Q05-R2',text:fs.readFileSync(path.join(oldReport,'inputs/Q05.txt'),'utf8'),requirements:['same original Q05, independent single repeat, no best-result selection']}
];
write('VALIDATION-PLAN.json',{frozen_before_model:true,cases:texts,normal_requests:16,remaining:21,full_method_validation_required_normal_requests:142,full_method_validation_status:'BUDGET_INSUFFICIENT',requirements_not_delivered_to_provider:true});
for(const x of texts){fs.mkdirSync(path.join(report,'inputs'),{recursive:true});fs.writeFileSync(path.join(report,'inputs',x.id+'.txt'),x.text,{flag:'wx'});}
console.log(JSON.stringify({legacy_consumer_rows:rows.length,preserved:rows.filter(x=>x.legacy_consumer_semantics_preserved).length,new_legacy_inputs_rejected:rows.filter(x=>x.new_contract_rejected_legacy_response).length,active58621:lock.snapshot.product_version,planned:8}));
