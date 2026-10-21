import test from 'node:test';import assert from 'node:assert/strict';import {runChild} from '../process.mjs';
test('Visible transport retry stream can cancel only this child before further retry, without a model call',async()=>{
 const controller=new AbortController(),samples=[];
 const script="console.error('stream connection failed; waiting to retry');setInterval(()=>{},1000);";
 const result=await runChild(process.execPath,['-e',script],{signal:controller.signal,timeoutMs:5000,onStderr:text=>{samples.push(text);if(text.includes('waiting to retry'))controller.abort();}});
 assert.equal(samples.length,1);assert.equal(result.cancelled,true);assert.equal(result.exit_confirmed,true);assert.ok(result.kill_receipt);assert.equal(result.timed_out,false);
});
