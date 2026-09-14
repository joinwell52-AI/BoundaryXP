import test from 'node:test';
import assert from 'node:assert/strict';
import {checkAdminText} from './admin-check.mjs';
import {glossaryEntries} from './admin-glossary.mjs';

const contexts=[
 ['zh-CN','术语定义\nG1: 覆盖范围为订单和支付模块。','按定义 G1，全面检查系统。','coverage'],
 ['en','Glossary\nG1: coverage is orders and payments.','Perform a comprehensive review using definition G1.','coverage'],
 ['zh-CN','术语表\nG2: 高频指每分钟超过100次。','按定义 G2，检查高频调用。','frequency'],
 ['en','Definitions\nG2: high frequency means 100 calls per minute.','Inspect high-frequency APIs using definition G2.','frequency'],
];
for(const [lang,definitions,task,rule] of contexts)test(`explicit glossary ${lang} ${rule}`,()=>{
 const text=definitions+'\n\n'+task;
 const r=checkAdminText(text);assert(!r.findings.some(f=>f.rule===rule));assert(r.checks.some(c=>c.binding==='glossary-unique'));
 for(const e of glossaryEntries(text))assert.equal(text.slice(e.start,e.end),e.text);
});
test('missing, contested, wrong-type and placeholder definitions stay unresolved',()=>{
 const cases=[
  '按定义 G9，全面检查系统。',
  '术语定义\nG1: 覆盖范围为订单。\nG1: 覆盖范围为支付。\n\n按定义 G1，全面检查系统。',
  'Glossary\nG1: date range is 2026 to 2027.\n\nPerform a comprehensive review using definition G1.',
  'Glossary\nG1: coverage is [modules].\n\nPerform a comprehensive review using definition G1.',
  'Glossary\nG1: coverage is orders.\nG2: coverage is payments.\n\nPerform a comprehensive review using definition G1 and using definition G2.',
 ];for(const text of cases)assert(checkAdminText(text).findings.some(f=>f.rule==='coverage'),text);
});
test('glossary never binds implicitly or forward; declarations are not task occurrences',()=>{
 for(const text of ['术语定义\nG1: 覆盖范围为订单。\n\n全面检查系统。','Perform a comprehensive review using definition G1.\n\nGlossary\nG1: coverage is orders.'])assert(checkAdminText(text).findings.some(f=>f.rule==='coverage'));
 assert.equal(checkAdminText('术语定义\nG1: 全面检查的覆盖范围为订单。').findings.length,0);
});
test('two local occurrences can each own a definition without stealing later definitions',()=>{
 for(const text of ['全面检查甲，覆盖范围为订单；全面检查乙，覆盖范围为支付。','Perform a comprehensive review of A, coverage is orders; perform a comprehensive review of B, coverage is payments.'])assert(!checkAdminText(text).findings.some(f=>f.rule==='coverage'),text);
 const result=checkAdminText('全面检查甲；全面检查乙，覆盖范围为支付。');assert(result.findings.some(f=>f.start===0));assert.equal(result.findings.filter(f=>f.rule==='coverage').length,1);
});
test('independent review: task lines end glossary, negative references do not bind, other work owns its references',()=>{
 const swallowed='Glossary:\nG1: scope is billing only.\nTask: perform a comprehensive inspection of inventory.';
 assert.equal(glossaryEntries(swallowed).length,1);assert(checkAdminText(swallowed).findings.some(f=>f.rule==='coverage'));
 const negative='术语表\nG1: 检查范围为支付接口。\n\n执行任务\n全面检查库存模块，不要按定义G1。';
 assert(checkAdminText(negative).findings.some(f=>f.rule==='coverage'));
 const english='Glossary\nG1: coverage is billing.\n\nPerform a comprehensive inspection, not using definition G1.';
 assert(checkAdminText(english).findings.some(f=>f.rule==='coverage'));
 const cross='术语表\nG1: 检查方法为静态阅读。\n\n执行任务\n全面检查支付模块，检查范围为支付和退款接口。深度检查库存模块，按定义G1。';
 assert(!checkAdminText(cross).findings.some(f=>f.rule==='coverage'));assert(!checkAdminText(cross).findings.some(f=>f.rule==='depth'));
});
