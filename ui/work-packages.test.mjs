import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateWithLibraries} from '../admin-python.mjs';
test('actual adapter preserves WP scopes and does not apply flat statement coordinates',async()=>{
 const text='## WP1 准备\n必须修改配置。\n## WP2 验证\n不得修改配置。';
 const r=await calculateWithLibraries(text);
 assert.equal(r.engines.length,3);
 assert.equal(r.pipeline.stages.length,2);
 assert.deepEqual(r.engines.flatMap(e=>e.findings),[]);
 assert.equal(r.unscopedStatementsUsed,false);
 assert.deepEqual(r.pipeline.globalTopology.edges,[]);
});
test('duplicate WP IDs return incomplete result through real adapter',async()=>{
 const r=await calculateWithLibraries('## WP1\n必须修改配置\n## WP1\n不得修改配置');
 assert.equal(r.sourceAnalysisError.code,'unsupported_work_package_scope');
 assert.ok(r.engines.every(e=>e.status==='incomplete'));
});
