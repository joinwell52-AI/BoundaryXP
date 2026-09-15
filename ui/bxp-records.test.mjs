import test from 'node:test';
import assert from 'node:assert/strict';
import { createBxpResultState } from './records.mjs';

const result=()=>({schema:'boundx-producer-result/v1',computed:true,report:'原文😀\r\nEnglish',task:{source:{text:'原文😀\r\nEnglish'}},result:{business_decision:null,execution_authorization:null},config:{key:'never-export'}});

test('BXP exports exact report and independent task/result, not configuration',()=>{
 const state=createBxpResultState(),value=result();
 assert.equal(state.accept(state.clear(),value),true);
 value.task.source.text='changed';
 assert.equal(state.export('report').text,'原文😀\r\nEnglish');
 assert.equal(JSON.parse(state.export('task').text).source.text,'原文😀\r\nEnglish');
 assert.deepEqual(JSON.parse(state.export('result').text),{business_decision:null,execution_authorization:null});
 for(const kind of ['report','task','result'])assert.doesNotMatch(state.export(kind).text,/never-export/);
 assert.throws(()=>state.export('config'),/Unknown export type/);
});

test('source/package changes invalidate exports and discard late responses',()=>{
 const state=createBxpResultState(),ticket=state.clear();
 state.accept(ticket,result());state.clear();
 assert.equal(state.accept(ticket,result()),false);
 for(const kind of ['report','task','result'])assert.throws(()=>state.export(kind),/Recalculate first/);
 assert.equal(state.accept(state.clear(),result()),true);
});

test('failed candidates export diagnostics report but never fabricate task/result',()=>{
 const state=createBxpResultState();
 state.accept(state.clear(),{schema:'boundx-producer-result/v1',computed:false,report:'尚未计算 / Not computed',task:null,result:null});
 assert.match(state.export('report').text,/Not computed/);
 for(const kind of ['task','result'])assert.throws(()=>state.export(kind),/Not computed/);
});

test('legacy objects cannot populate standard BXP export state',()=>{
 const state=createBxpResultState();
 assert.throws(()=>state.accept(state.clear(),{schema:'boundx-ui/v1',report:'legacy'}),/No valid BXP report/);
 assert.throws(()=>state.export('report'),/Recalculate first/);
});
