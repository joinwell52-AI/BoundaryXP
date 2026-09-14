import test from 'node:test';
import assert from 'node:assert/strict';
import {localTaskProjection,prohibitedActions} from './local-task.mjs';
import {adminAdvice,completeTask} from './advice.mjs';
test('explicit prohibitions preserve conditional source and remain separate from allowed actions',()=>{
 const text='检查系统；未经 ADMIN 另行授权，不得修改源代码；禁止操作在线实例。';
 const result=prohibitedActions(text);assert.equal(result.status,'stated');assert.equal(result.quotes.length,2);assert(result.quotes[0].includes('未经 ADMIN'));for(const quote of result.quotes)assert(text.includes(quote));
 assert(!localTaskProjection('不得修改源代码。').parameters.A);assert(!localTaskProjection('Source changes are not permitted.').parameters.A);
 assert.equal(prohibitedActions('Do not delete data. Never change permissions.').quotes.length,2);
});
test('missing and vague restrictions remain unknown; exemptions do not become bans',()=>{
 for(const text of ['检查并汇报。','无需修复。','不禁止修改。','没有禁止修改。','Repair is not prohibited.','No repair is required.'])assert.equal(prohibitedActions(text).status,'unmapped',text);
 for(const text of ['禁止事项待定。','不能确定范围。','本次禁止【具体操作】。'])assert.equal(prohibitedActions(text).status,'unclear',text);
 assert.equal(prohibitedActions('本次无额外禁止事项。').status,'none_declared');
});
test('missing prohibition advice enters complete text as a proposal, never edits input or invents concrete bans',()=>{
 const doc=localTaskProjection('检查系统并汇报。'),original=JSON.stringify(doc);const advice=adminAdvice(doc);assert.equal(advice[0].key,'prohibitions');
 const text=completeTask(doc);assert(text.startsWith(doc.text));assert(text.includes('禁止【具体操作及对象】'));assert(!text.includes('禁止修改源代码'));assert.equal(JSON.stringify(doc),original);
 const en=completeTask(doc,'en');assert(en.includes('Prohibited actions'));assert(!en.slice(doc.text.length).includes('禁止'));
 assert(!adminAdvice(localTaskProjection('检查系统；禁止删除数据。')).some(a=>a.key==='prohibitions'));
 assert(!adminAdvice(localTaskProjection('本次无额外禁止事项。')).some(a=>a.key==='prohibitions'));
});
