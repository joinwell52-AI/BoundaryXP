import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateWithLibraries} from '../admin-python.mjs';
import {sourceView,sourceDraft} from './source-advice.mjs';
test('five original complex tasks produce source calculations without fill-in templates',async()=>{
 const cases=JSON.parse(await readFile(new URL('../python/complex_cases.json',import.meta.url),'utf8'));
 for(const text of cases){
  const r=await calculateWithLibraries(text);const view=sourceView(r,text);assert(view.analysis.facts.length>0);
  for(const language of ['zh-CN','en']){const draft=sourceDraft(r,text,language);assert(draft.startsWith(text));assert(!draft.includes('【'));assert(!draft.includes('[duration]'));}
  assert.equal(r.confirmation,null);assert.equal(r.businessDecision,null);assert.equal(sourceView(r,text+'x'),null);
  for(const f of view.findings)for(const s of f.sources)assert.equal(text.slice(s.start,s.end),s.quote);
 }
});
test('unknown input is not rewritten as seven missing requirements',async()=>{
 const text='整理一下资料。';const r=await calculateWithLibraries(text);
 assert.equal(sourceDraft(r,text),text);assert.equal(sourceDraft(null,text),text);
 assert.equal(r.sourceAnalysis.summary.completeInterpretation,false);
});
