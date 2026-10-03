import test from 'node:test';import assert from 'node:assert/strict';import {directiveLayer} from '../../../../../research/7plus1-parser/v0.3-7p-composition-014/instruction-syntax.mjs';
const cases=[
 ['禁止连接数据库，只生成 `orchid.md`。','生成',true],
 ['核对 `beech.csv`，并生成 `hazel.md`。','生成',true],
 ['Inspect `elm.csv`, only produce `reed.md`.','produce',true],
 ['创建 `elm.md`，覆盖配置流程。','覆盖',false],
 ['在说明中写“核对配置，只生成 `fern.md`”。','生成',false],
 ['创建 `fir.md`（核对配置，并生成 `rose.md`）。','生成',false]
];
for(const [quote,predicate,allowed]of cases)test('008 explicit main-layer connector '+quote,()=>{const at=[...quote.slice(0,quote.indexOf(predicate))].length;assert.equal(directiveLayer({source_span:{quote,start:0}},at).allowed,allowed);});
test('008 restrictive output survives the same-source-main-layer binding',async()=>{const fs=await import('node:fs'),{compileNative}=await import('../../../../../research/7plus1-parser/v0.3-7p-composition-014/engine.mjs'),{sourceDocument}=await import('../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs');const old=JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-CLOSURE-008/replay/SWAI-008/trace.json')),r=compileNative(sourceDocument(old.compiler_v03.source.raw_text),structuredClone(old.compiler_v03.nlp_signals));assert(r.compiler_v03.canonical_7plus1.O.entries.some(e=>e.state==='RESOLVED'&&e.display_value==='一份 REPORT-003'));assert(!r.compiler_v03.canonical_7plus1.A.entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes('跑 python')));});
