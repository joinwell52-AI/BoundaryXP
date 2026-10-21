import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {classifyProviderFailure} from '../process.mjs';
test('provider classification requires status context; timestamps and IDs are not status codes',()=>{
 for(const code of [401,403,429,502,503])assert.equal(classifyProviderFailure(`2026-10-07T15:18:22.18${code}5Z thread=01a116f0-${code}a-7e11 retry=1`),'CODEX_TRANSPORT_OR_SCHEMA_FAILURE');
 for(const code of [401,403])for(const text of [`HTTP ${code}`,`HTTP/1.1 ${code}`,`status_code: ${code}`,`response status=${code}`])assert.equal(classifyProviderFailure(text),'CODEX_LOGIN_REQUIRED');
 assert.equal(classifyProviderFailure('HTTP status 429'),'CODEX_QUOTA_OR_RATE_LIMIT');
 assert.equal(classifyProviderFailure('HTTP 503'),'CODEX_NETWORK_FAILURE');
 assert.equal(classifyProviderFailure('authentication failed'),'CODEX_LOGIN_REQUIRED');
 assert.equal(classifyProviderFailure('workspace routing discovery failed'),'CODEX_NETWORK_FAILURE');
});
test('saved network-routing failure is not misreported as login failure',()=>{
 const root='docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG/runs/c3-first/Q23/run/revision-0/parse-call/';
 const text=fs.readFileSync(root+'stderr-0.txt','utf8')+fs.readFileSync(root+'events-0.jsonl','utf8');
 assert.equal(classifyProviderFailure(text),'CODEX_NETWORK_FAILURE');
});
