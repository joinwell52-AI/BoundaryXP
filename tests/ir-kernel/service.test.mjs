import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateKernel,runKernel} from '../../src/bxp/ir-kernel/service.mjs';

test('invalid input returns a diagnostic through both public calculation facades',async()=>{
 for(const input of [Buffer.from('{broken'),{format:'wrong'}]){
  const evaluated=evaluateKernel(input),solved=await runKernel(input);
  for(const result of [evaluated,solved.calculation]){
   assert.equal(result.compile_status,'FAILED');assert.equal(result.result,'NOT_RUN');assert.ok(result.diagnostics.length);
  }
  assert.equal(evaluated.business_decision,null);assert.equal(solved.execution_authorization,null);
 }
});

test('Core modules have no model, network or business execution imports',()=>{
 const root=new URL('../../src/bxp/ir-kernel/',import.meta.url);
 for(const name of fs.readdirSync(root).filter(x=>x.endsWith('.mjs'))){
  const text=fs.readFileSync(new URL(name,root),'utf8');
  const imports=[...text.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(x=>x[1]);
  for(const module of imports)assert.doesNotMatch(module,/node:(?:https?|net|tls|child_process)|(?:codex|llm-call|engine|producer|semantic-parse)\./,name+': '+module);
 }
});
