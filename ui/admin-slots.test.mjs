import {pointSlice} from './codepoints.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkTaskSlots} from './admin-slots.mjs';
import {adminAdvice,completeTask,adminAdviceLayers} from './advice.mjs';
import {localTaskProjection} from './local-task.mjs';
const cases=JSON.parse(readFileSync(new URL('./admin-slots.cases.json',import.meta.url),'utf8'));
for(const [i,c] of cases.entries())test(`specific ADMIN slot ${i+1}: ${c.text}`,()=>{
 const r=checkTaskSlots(c.text),check=r.checks.find(s=>s.profile===c.profile);
 assert(check);
 assert.deepEqual(check.slots.filter(s=>s.status==='unconfirmed').map(s=>s.id),c.missing);
 assert.deepEqual(r,checkTaskSlots(c.text));
 for(const f of r.findings){assert.equal(pointSlice(c.text,f.start,f.end),f.quote);assert(f.en.suggestion&&f.suggestion);}
 for(const s of check.slots)if(s.evidence)assert.equal(pointSlice(c.text,s.evidence.start,s.evidence.end),s.evidence.quote);
});
test('layered recommendations preserve evidence and distinguish priority from adjudication',()=>{
 const advice=adminAdvice(localTaskProjection(cases[0].text));
 assert.equal(advice.find(a=>a.rule==='slot-report-output').layer,'meaning');
 assert.equal(advice.find(a=>a.rule==='slot-report-period').layer,'execution');
 assert.equal(advice.find(a=>a.key==='P').layer,'general');
 assert.equal(adminAdvice(localTaskProjection('必须修改配置；不得修改配置。'))[0].layer,'meaning');
 for(const a of advice){assert(adminAdviceLayers[a.layer].title);assert(adminAdviceLayers[a.layer].en);assert(!('decision' in a));}
});
test('specific recommendations use placeholders, no invented deletion, dates or blocking',()=>{
 const doc=localTaskProjection(cases[0].text),draft=completeTask(doc);
 assert(draft.includes('明细表／分类汇总表／文字摘要'));
 assert(!draft.includes('2026年Q2'));assert(!draft.includes('/output'));
 assert(completeTask(doc,'en').includes('grouped table'));
 assert(!completeTask(doc,'en').includes('No explicit value matched'));
 const r=checkTaskSlots(cases[4].text);assert(r.findings.some(f=>f.suggestion.includes('不确定为删除')));
 assert(!JSON.stringify(r).includes('"action":"DELETE"'));
 assert(adminAdvice(localTaskProjection(cases[8].text)).some(f=>f.rule==='slot-purchase-budget'));
 const advice=adminAdvice(doc);
 assert.equal(advice[0].rule,'slot-report-output');
 assert(!advice.some(a=>['I','O','C'].includes(a.key)));
 assert(!draft.includes('具体模块'));assert(!draft.includes('提交报告，列出发现'));
});
test('negated and quoted instructions, placeholders and unrelated work are not certified',()=>{
 for(const text of ['不要清理测试账号。','Do not clean up test accounts.','他说“汇总销售报表”。'])assert.equal(checkTaskSlots(text).checks.length,0);
 const r=checkTaskSlots('汇总销售报表，交付物为【Excel】。');
 assert.equal(r.checks[0].slots.find(s=>s.id==='output').status,'unconfirmed');
 assert.equal(checkTaskSlots('汇总销售报表。另一个任务交付物为Excel。').checks[0].slots.find(s=>s.id==='output').status,'unconfirmed');
 assert.throws(()=>checkTaskSlots('x'.repeat(100001)));
});
