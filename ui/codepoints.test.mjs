import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWithLibraries} from '../admin-python.mjs';
import {checkAdminText} from './admin-check.mjs';
import {sourceCatalog,materializeSelection} from './grounding.mjs';
import {originalBoundary} from './admin-boundary.mjs';
import {pointSlice,pointLength} from './codepoints.mjs';

for(const text of [
  '😀𠮷\n必须检查配置；不得检查配置。',
  '😀𠮷\nMust inspect configuration; must not inspect configuration.',
  '😀 中 English\n总时长至少120分钟；总时长最多60分钟。',
  '😀 项目\n## WP1\n由工程师生成 out.json。\n## WP2\n读取 out.json。',
])test(`JS/Python code-point evidence roundtrip ${text.slice(0,18)}`,async()=>{
  let count=0;
  const check=value=>{
    if(!value||typeof value!=='object')return;
    if(typeof value.quote==='string'&&Number.isInteger(value.start)&&Number.isInteger(value.end)){
      assert.equal(pointSlice(text,value.start,value.end),value.quote);assert.ok(value.end<=pointLength(text));count++;
    }
    for(const child of Object.values(value))check(child);
  };
  check(checkAdminText(text));check(originalBoundary(text));
  check(await calculateWithLibraries(text,{timeoutMs:30000}));assert.ok(count>0);
});
test('JS code-point glossary and source selection preserve non-BMP text',()=>{
  const text='😀\nGlossary\nG1: scope is 𠮷 service.\nTask\nPerform a comprehensive review using definition G1.';
  const result=checkAdminText(text);
  for(const entry of result.glossary)assert.equal(pointSlice(text,entry.start,entry.end),entry.text);
  const segments=sourceCatalog(text);for(const entry of segments)assert.equal(pointSlice(text,entry.start,entry.end),entry.text);
  const selected=materializeSelection({parameters:{I:{from:segments[0].id,to:segments.at(-1).id}},actions:[],completion:[]},'task',text);
  assert.equal(selected.parameters.I,text);
});
