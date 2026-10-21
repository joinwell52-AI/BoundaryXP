import test from 'node:test';import assert from 'node:assert/strict';import {legacyBoundaryBundle as directIRKernelBundle} from './legacy-boundary-bundle.mjs';import {directIRBundle} from '../../research/7plus1-parser/llm-first-028/direct-ir-bundle.mjs';
test('prepared parse/audit resources agree on 2.0 and do not change either active Skill profile',()=>{
 for(const parseMethod of ['SKILL','SKILL1']){
  const before=directIRBundle('parse',{parseMethod}).sha256,p=directIRKernelBundle('parse',{parseMethod}),a=directIRKernelBundle('audit',{parseMethod});
  assert.equal(p.schema.properties.contract_version.const,'candidate-ir/2.0');assert.equal(a.schema.properties.contract_version.const,'candidate-ir/2.0');assert.equal(p.resources[1].sha256,a.resources[1].sha256);assert.equal(p.resources[2].sha256,a.resources[2].sha256);assert.equal(p.resources[0].text.includes('candidate-ir/1.4'),false);assert.equal(p.enabled_by_default,false);assert.equal(before,directIRBundle('parse',{parseMethod}).sha256);
 }
});
