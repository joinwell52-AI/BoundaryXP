import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {callCodex} from '../provider.mjs';import {parse7Plus1} from '../engine.mjs';import {prepareSource} from '../source.mjs';
test('Caller request budget stops before any provider launch; no partial acceptance',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-budget-')),requestBudget={remaining:0};
 await assert.rejects(callCodex({bundle:{text:'unit',resources:[],schema:{},phase:'parse'},source:prepareSource(Buffer.from('预算检查')),directory,probe:{binary:'MUST_NOT_LAUNCH'},requestBudget}),e=>e.code==='MODEL_REQUEST_BUDGET_EXHAUSTED'&&e.attempts.length===0);
 assert.equal(requestBudget.remaining,0);assert.deepEqual(fs.readdirSync(directory),[]);
});
test('Invalid model request budgets fail before probe/call',async()=>{
 for(const maxModelRequests of [-1,1.5,NaN])await assert.rejects(parse7Plus1(Buffer.from('预算检查'),{output:fs.mkdtempSync(path.join(os.tmpdir(),'boundx-bad-budget-')),maxModelRequests,call:()=>{throw Error('MUST_NOT_CALL');}}),/INVALID_MODEL_REQUEST_BUDGET/);
});
