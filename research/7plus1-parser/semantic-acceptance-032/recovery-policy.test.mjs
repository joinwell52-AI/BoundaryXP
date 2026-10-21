import test from 'node:test';import assert from 'node:assert/strict';
import {evaluationLaunchDecision as decide} from './recovery-policy.mjs';
const order=['Q01','Q02','Q03'];
test('Inherited actual attempts preserve source review gating',()=>{assert.equal(decide({order,executions:[{id:'Q01',attempt:2,exit_code:0}],reviews:[],charged:137}).reason,'SOURCE_REVIEW_REQUIRED_BEFORE_NEXT_RUN');assert.equal(decide({order,executions:[{id:'Q01',attempt:2,exit_code:0}],reviews:[{id:'Q01',attempt:2,status:'SOURCE_FAITHFUL'}],charged:137}).id,'Q02');});
test('A reviewed semantic failure is preserved while remaining frozen evaluation continues',()=>{const reviews=[{id:'Q01',attempt:2,status:'SOURCE_FAITHFUL'},{id:'Q02',attempt:1,status:'SEMANTIC_FAIL'}];assert.equal(decide({order,executions:[{id:'Q02',attempt:1,exit_code:0}],reviews,charged:139}).id,'Q03');assert.equal(reviews[1].status,'SEMANTIC_FAIL');});
test('New transport failure never starts the next sample or another recovery probe',()=>{assert.equal(decide({order,executions:[{id:'Q01',attempt:2,exit_code:1,underlying_failure:'CODEX_NETWORK_FAILURE'}],reviews:[],charged:141}).reason,'CODEX_NETWORK_FAILURE');});
test('Final required work remains reserved under the same 360 limit',()=>{assert.equal(decide({order,executions:[],reviews:[],charged:351}).reason,'INSUFFICIENT_BUDGET_FOR_REQUIRED_REMAINING_WORK');});
