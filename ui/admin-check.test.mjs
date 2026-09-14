import test from 'node:test';
import assert from 'node:assert/strict';
import {checkAdminText} from './admin-check.mjs';
import {adminRulePack} from './admin-rules.mjs';
import {localTaskProjection} from './local-task.mjs';
import {adminAdvice,completeTask} from './advice.mjs';

const pairs=[
 ['全面检查系统。','全面检查系统，覆盖范围为订单模块和支付模块。','coverage'],
 ['Perform a comprehensive review.','Perform a comprehensive review; coverage is orders and payments.','coverage'],
 ['深度检查系统。','深度检查系统；验证方法为静态审查并保留检查记录。','depth'],
 ['Perform an in-depth review.','Perform an in-depth review; verification method is static inspection.','depth'],
 ['检查高频调用。','检查高频调用；高频指每分钟超过100次。','frequency'],
 ['Inspect high-frequency APIs.','Inspect high-frequency APIs; high frequency means more than 100 calls per minute.','frequency'],
 ['整理销售数据。','整理销售数据；交付物为按月份汇总的CSV表。','data-output'],
 ['Organize sales data.','Organize sales data; output is a CSV summary grouped by month.','data-output'],
 ['检查近期记录。','检查近期记录；时间范围为2026年6月1日至8月31日。','recent'],
 ['Inspect recent records.','Inspect recent records; date range is June 1, 2026 to August 31, 2026.','recent'],
 ['适当优化报表。','适当优化报表；优化范围为列宽调整。','degree'],
 ['Optimize appropriately.','Optimize appropriately; optimization scope is column widths.','degree'],
];
for(const [before,after,id] of pairs)test(`paired contextual rule ${id}: ${before}`,()=>{
 assert(checkAdminText(before).findings.some(f=>f.rule===id));
 assert(!checkAdminText(after).findings.some(f=>f.rule===id));
});
test('single characters, unrelated numbers and unrelated context do not establish meaning',()=>{
 assert.equal(checkAdminText('检查微服务的质量和常量；Audit microservices and quality constants.').findings.length,0);
 for(const text of ['检查高频调用，共3个模块。','全面检查系统。\n\n其他任务：覆盖范围为账务。','全面检查系统；覆盖范围待定。','全面检查系统；覆盖范围为【模块】。','全面检查系统；覆盖范围为未知。'])assert(checkAdminText(text).findings.length>0,text);
 assert(checkAdminText('全面检查系统甲；全面检查系统乙，覆盖范围为支付。').findings.some(f=>f.start===0));
});
test('negative mentions do not request work or new definitions',()=>{
 for(const text of ['无需深度检查。','不要求全面检查。','Do not optimize appropriately.','Deep inspection is not required.'])assert.equal(checkAdminText(text).findings.length,0,text);
});
test('mixed language, offsets, immutability, determinism and customizable rule data',()=>{
 const text='请全面检查系统；verification method is static. Inspect recent records.';
 const result=checkAdminText(text);assert(result.findings.some(f=>f.rule==='coverage'));assert(result.findings.some(f=>f.rule==='recent'));
 for(const f of result.findings){assert.equal(text.slice(f.start,f.end),f.quote);assert(text.includes(f.source_quote));assert(f.en.title&&f.en.suggestion);}
 assert.deepEqual(result,checkAdminText(text));
 const snapshot=JSON.stringify(adminRulePack);checkAdminText(text);assert.equal(JSON.stringify(adminRulePack),snapshot);
 assert.equal(checkAdminText(text,{version:'empty-test',languages:['zh-CN','en'],rules:[]}).findings.length,0);
});
test('advice is bilingual, source-preserving and proposed rather than authorized',()=>{
 const doc=localTaskProjection('全面检查系统。'),snapshot=JSON.stringify(doc);
 assert(adminAdvice(doc).some(a=>a.rule==='coverage'));
 assert(completeTask(doc).includes('覆盖【具体对象或清单】'));
 assert(completeTask(doc,'en').includes('Comprehensive inspection covers'));
 assert.equal(JSON.stringify(doc),snapshot);
});
test('frequency definitions do not fill the resource budget field',()=>{
 for(const text of ['高频指每分钟超过100次。','High frequency means more than 100 calls per minute.'])assert(!localTaskProjection(text).parameters.R);
 assert(localTaskProjection('本次时间上限为2小时。').parameters.R);
 assert(localTaskProjection('Time limit is 2 hours.').parameters.R);
});
