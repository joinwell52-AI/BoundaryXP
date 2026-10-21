import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {deicticSetDescriptor} from '../research/7plus1-parser/v0.3-7p-composition-014/source-binding.mjs';
const dir='docs/reports/7plus1/7P-COMPOSITION-014/',read=p=>JSON.parse(fs.readFileSync(p));
for(const [q,op]of [['任何上述文件','ANY'],['全部上述文件','ALL'],['各上述文件','EACH'],['each of these files','EACH'],['every these files','EACH'],['all of those items','ALL'],['any of these files','ANY']])test('referent quantifier primitive '+q,()=>assert.equal(deicticSetDescriptor(q)?.quantifier,op));
for(const q of ['文件','prism.csv','测试通过','any','任何配置文件'])test('ordinary nominal not deictic '+q,()=>assert.equal(deicticSetDescriptor(q),null));
test('013 inputs and true upstream signals remain SHA-bound',()=>{const frozen=read(dir+'NON-GOLD-FREEZE.json'),inputs={cases:read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(x=>!x.new_in_014)};assert.equal(inputs.cases.length,53);assert.equal(inputs.cases.filter(c=>c.new_in_013).length,20);for(const x of inputs.cases){const s=read(dir+'non-gold-signals/'+x.id+'.json');assert.equal(s.input_sha256,x.source_sha256);}});
