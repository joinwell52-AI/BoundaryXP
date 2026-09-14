import test from 'node:test';
import assert from 'node:assert/strict';
import {withDeadline,requestStage,canReuseTask} from './progress.mjs';
test('remote model stages never masquerade as local calculations',()=>{
 assert.equal(requestStage('bxp-admin',{}).remote,true);
 for(const [route,data] of [['extract',{kind:'task'}],['extract',{kind:'plan'}],['pm',{mode:'generate'}],['pm',{mode:'recheck'}]]){const stage=requestStage(route,data);assert(stage.remote);assert(stage.zh.includes('模型'));assert(stage.en.includes('Waiting'));}
 assert.equal(requestStage('review',{}).remote,false);
 for(const route of ['cursor-models','codex-models']){const stage=requestStage(route,{});assert.equal(stage.remote,true);assert.ok(stage.zh.includes('目录'));assert.ok(stage.en.includes('catalog'));}
});
test('unchanged mapped source reuses extraction, changed source cannot',()=>{
 assert(canReuseTask({text:'task'},'task','task'));assert(!canReuseTask({text:'edited'},'task','edited'));assert(!canReuseTask(null,'task','task'));
});
test('deadline bounds an operation even if the transport never settles',async()=>{
 let signal;await assert.rejects(withDeadline(s=>{signal=s;return new Promise(()=>{});},{timeoutMs:10}),{name:'TimeoutError'});assert(signal.aborted);
});
test('cancellation rejects promptly and successful operations clean up their timers',async()=>{
 const controller=new AbortController();const pending=withDeadline(()=>new Promise(()=>{}),{signal:controller.signal,timeoutMs:1000});controller.abort();await assert.rejects(pending,{name:'AbortError'});
 assert.equal(await withDeadline(async()=>42,{timeoutMs:1000}),42);
});
