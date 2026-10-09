import test from 'node:test';import assert from 'node:assert/strict';
import {launchDecision} from './continuation-policy.mjs';
const initial={order:['Q05','D01','D02'],executions:[],reviews:[],charged:108};
test('Only one next run is allowed, with the original budget retained',()=>{const d=launchDecision(initial);assert.equal(d.id,'Q05');assert.equal(d.allowed,true);assert.equal(d.allocation,6);});
test('Successful process and JSON are insufficient without source review',()=>{const d=launchDecision({...initial,executions:[{id:'Q05',attempt:1,exit_code:0}]});assert.equal(d.reason,'SOURCE_REVIEW_REQUIRED_BEFORE_NEXT_RUN');});
test('Semantic failure prevents the next sample from starting',()=>{const d=launchDecision({...initial,executions:[{id:'Q05',attempt:1,exit_code:0}],reviews:[{id:'Q05',attempt:1,status:'SEMANTIC_FAIL'}]});assert.equal(d.reason,'SEMANTIC_DEFECT_PAUSE');});
test('Nested transport, account, quota and policy failures stop scheduling',()=>{for(const failure of ['CODEX_NETWORK_FAILURE','CODEX_LOGIN_REQUIRED','CODEX_QUOTA_OR_RATE_LIMIT','POLICY_BLOCKED']){const d=launchDecision({...initial,executions:[{id:'Q05',attempt:1,exit_code:1,underlying_failure:failure}]});assert.equal(d.allowed,false);assert.equal(d.reason,failure);}});
test('Remaining suite and deployment requests are reserved before dispatch',()=>{assert.equal(launchDecision({...initial,charged:351}).allowed,false);assert.equal(launchDecision({...initial,charged:348}).allowed,true);});
test('Faithful reviewed result advances without unnecessary repeat',()=>{const d=launchDecision({...initial,executions:[{id:'Q05',attempt:1,exit_code:0}],reviews:[{id:'Q05',attempt:1,status:'CLARIFICATION_CORRECT'}]});assert.equal(d.id,'D01');});
