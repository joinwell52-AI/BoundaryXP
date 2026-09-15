import test from 'node:test';
import assert from 'node:assert/strict';
import {modelPreferences} from './connection.mjs';

test('subscription preferences retain provider/model but never secrets or success state',()=>{
 assert.deepEqual(modelPreferences({provider:'codex',model:'gpt-5.6-terra',key:'secret',connected:true,source:'private',url:'secret'}),{provider:'codex',model:'gpt-5.6-terra'});
});
test('API preferences normalize endpoint and exclude credentials',()=>{
 assert.deepEqual(modelPreferences({provider:'api',model:'custom',protocol:'responses',url:'https://example.com/v1',key:'secret',disableThinking:true}),{provider:'api',model:'custom',protocol:'responses',url:'https://example.com/v1/responses',disableThinking:true});
 assert.throws(()=>modelPreferences({provider:'api',model:'custom',protocol:'responses',url:'https://example.com/v1?key=secret'}));
});
test('invalid or incomplete saved preferences cannot be restored',()=>{
 for(const value of [null,{}, {provider:'other',model:'abc'},{provider:'codex',model:''}])assert.throws(()=>modelPreferences(value));
 const preference=modelPreferences({provider:'cursor',model:'selected-model',key:'secret'});
 assert.deepEqual(modelPreferences(JSON.parse(JSON.stringify(preference))),preference);
});
