import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compileNative} from 'file:///D:/boundx/research/7plus1-parser/v0.3-7p-short-direct-016/engine.mjs';import {sourceDocument} from 'file:///D:/boundx/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';import {checks} from 'file:///D:/boundx/docs/reports/7plus1/7P-COMPOSITION-014/stage-checks.mjs';
const dir='docs/reports/7plus1/7P-COMPOSITION-014/',read=p=>JSON.parse(fs.readFileSync(p));
for(const x of read(dir+'NON-GOLD-FROZEN-INPUTS.json').cases.filter(x=>x.stage==='R3'))test('013 explicit transfer '+x.id,()=>{
 const r=compileNative(sourceDocument(x.text),structuredClone(read(dir+'non-gold-signals/'+x.id+'.json').signals));for(const a of checks(x,r))assert(a.pass,a.check);assert.equal(r.compiler_v03.nlp_signals.semantic_decoding.explicit_recipient.nearest_person_fallback,false);assert(!r.compiler_v03.semantic_nodes.some(n=>n.metadata.authority));
 const a=compileNative(sourceDocument(x.text),structuredClone(read(dir+'non-gold-signals/'+x.id+'.json').signals));assert.deepEqual(r.compiler_v03.boundary_ir,a.compiler_v03.boundary_ir);
});
