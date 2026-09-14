import {pointSlice} from './codepoints.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkOperatorText,parseAuthority} from './admin-operators.mjs';
import {checkAdminText} from './admin-check.mjs';
import {adminAdvice,completeTask} from './advice.mjs';
import {localTaskProjection} from './local-task.mjs';
const cases=JSON.parse(readFileSync(new URL('./admin-operators.cases.json',import.meta.url),'utf8'));
for(const [i,c] of cases.entries())test(`operator contract ${i+1}: ${c.text}`,()=>{
 const result=checkOperatorText(c.text),first=result.statements[0]?.candidates[0];
 if(c.modal)assert.equal(first?.modality,c.modal);
 if(c.condition)assert.equal(first?.condition.op,c.condition);
 if(c.action)assert.equal(first?.action,c.action);
 if(c.risk)assert(result.findings.some(f=>f.rule===c.risk));
 if(c.noRisk)assert(!result.findings.some(f=>f.rule===c.noRisk));
 if(c.uncovered)assert.equal(result.coverage.candidate,0);
 assert.deepEqual(result,checkOperatorText(c.text));
 for(const s of result.statements)assert.equal(pointSlice(c.text,s.start,s.end),s.quote);
 for(const f of result.findings){assert(f.en.title&&f.en.suggestion);assert.equal(pointSlice(c.text,f.start,f.end),f.quote);}
});
test('operator composition respects parentheses, negation and resource bounds',()=>{
 assert.equal(parseAuthority('A and B and C').length,1);
 assert.equal(parseAuthority('A and B or C').length,2);
 assert.equal(parseAuthority('(A and B) or C').length,1);
 for(const s of ['(A and B','A or','or A','A B','A and B and C and D and E and F and G'])assert.deepEqual(parseAuthority(s),[]);
 const ast=checkOperatorText('未经 A 和 B 授权，不得修改配置。').statements[0].candidates[0];
 assert.equal(ast.condition.op,'NOT');assert.equal(ast.condition.arg.authorities.op,'AND');
 assert.equal(ast.actor,null);assert.equal(ast.authorizationDecision,null);
 assert.throws(()=>checkOperatorText('a'.repeat(100001)));
});
test('advice integration, no input mutation, no invented permission and bilingual draft',()=>{
 const text='必须修改配置；不得修改配置。',doc=localTaskProjection(text),before=JSON.stringify(doc);
 assert(checkAdminText(text).findings.some(f=>f.rule==='constraint-collision'));
 assert(adminAdvice(doc).some(f=>f.rule==='constraint-collision'));
 assert(completeTask(doc).includes('请说明两条要求'));
 assert(completeTask(doc,'en').includes('Clarify actor or scope'));
 assert.equal(JSON.stringify(doc),before);
 assert(!checkOperatorText('不必修改配置。').statements.some(s=>s.candidates.some(c=>c.modality==='PERMIT')));
});
test('conditional differences, relational predicates and quoted instructions stay distinct',()=>{
 for(const text of [
  '经 A 授权，必须修改配置；经 B 授权，不得修改配置。',
  '必须修改甲配置；不得修改乙配置。',
  '文档说“必须修改配置”；不得修改配置。',
  'Must compare A and B; must not compare A.',
 ])assert(!checkOperatorText(text).findings.some(f=>f.rule==='constraint-collision'));
});
test('mixed-language source offsets and authorization mentions never grant authority',()=>{
 const text='🧭任务说明。未经 ADMIN 授权，不得修改生产配置和 test_env。';
 const result=checkOperatorText(text),s=result.statements.find(s=>s.candidates.length);
 assert(s);assert.equal(pointSlice(text,s.start,s.end),s.quote);
 assert.equal(s.candidates[0].condition.op,'NOT');
 assert.equal(s.candidates[0].authorizationDecision,null);
 assert.equal(s.candidates[0].action,'修改生产配置和 test_env');
 assert.equal(checkOperatorText('Must not 修改生产配置。').statements[0].candidates[0].modality,'FORBID');
});
