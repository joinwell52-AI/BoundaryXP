import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {classifyRunFailure,requestLedger} from './transport-ledger.mjs';
test('Nested transport failure remains visible when outer budget cancellation masks it',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-032-ledger-'));fs.writeFileSync(path.join(root,'stderr.txt'),'Error: MODEL_REQUEST_BUDGET_EXHAUSTED');const dir=path.join(root,'run/audit-call');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'stderr-0.txt'),'stream disconnected - retrying sampling request (4/5) sampling_error=workspace routing discovery failed');
 assert.equal(classifyRunFailure(root),'CODEX_NETWORK_FAILURE');fs.writeFileSync(path.join(dir,'stderr-0.txt'),'HTTP status 403 Forbidden');assert.equal(classifyRunFailure(root),'CODEX_LOGIN_REQUIRED');
});
test('Live retry signals counted once, incomplete receipt remains explicit',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-032-ledger-'));fs.writeFileSync(path.join(root,'request-0.json'),'{}');fs.writeFileSync(path.join(root,'transport-retries-0.json'),'{"observed_internal_retries":3}');assert.equal(requestLedger(root).conservative_observed,4);fs.writeFileSync(path.join(root,'stderr-0.txt'),'retrying sampling request\nretrying sampling request');fs.writeFileSync(path.join(root,'receipt-0.json'),'{}');const r=requestLedger(root);assert.equal(r.conservative_observed,3);assert.equal(r.incomplete_receipts,0);
});
