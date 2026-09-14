import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTask, PROTOCOL_VERSION, sourceDigest } from './evaluate.mjs';
const SUITE_VERSION = '1.0.0-draft.1';

const here = new URL('./', import.meta.url);
const suite = JSON.parse(readFileSync(new URL('bxp-calc-v1.0.json', here), 'utf8'));
const sourceIndex = JSON.parse(readFileSync(new URL('../benchmarks/source-index.json', here), 'utf8'));

test('task, result and suite schemas are strict versioned Draft 2020-12 documents', () => {
  const taskSchema = JSON.parse(readFileSync(new URL('../schemas/boundx-task-v1.schema.json', here), 'utf8'));
  const resultSchema = JSON.parse(readFileSync(new URL('../schemas/boundx-result-v1.schema.json', here), 'utf8'));
  const suiteSchema = JSON.parse(readFileSync(new URL('../schemas/boundx-calc-conformance-suite-v1.schema.json', here), 'utf8'));

  assert.equal(taskSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(taskSchema.$id, 'urn:boundx:schema:task:v1');
  assert.equal(taskSchema.properties.protocol_version.const, PROTOCOL_VERSION);
  assert.ok(taskSchema.properties.constraints.required.includes('handoffs'));
  assert.equal(taskSchema.additionalProperties, false);

  assert.equal(resultSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(resultSchema.$id, 'urn:boundx:schema:result:v1');
  assert.equal(resultSchema.properties.schema.const, 'boundx-result/v1');
  assert.equal(resultSchema.properties.protocol_version.const, PROTOCOL_VERSION);
  assert.equal(resultSchema.properties.source_digest_algorithm.const, 'sha-256:utf8');
  assert.deepEqual(resultSchema.properties.business_decision, { type: 'null' });
  assert.deepEqual(resultSchema.properties.execution_authorization, { type: 'null' });
  for (const name of ['intervals', 'target_sets', 'handoffs', 'dependencies', 'logic']) {
    assert.ok(resultSchema.properties.calculations.properties[name].items, name);
  }

  assert.equal(suiteSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(suiteSchema.$id, 'urn:boundx:schema:calc-conformance-suite:v1');
  assert.equal(suiteSchema.properties.suite_version.const, SUITE_VERSION);
  assert.equal(suiteSchema.properties.protocol_version.const, PROTOCOL_VERSION);
  assert.equal(suiteSchema.properties.cases.minItems, 140);
  assert.ok(suiteSchema.$defs.case.required.includes('schema_expectation'));
});

test('official draft suite contains 176 unique BXP-CALC vectors', () => {
  assert.equal(suite.suite, 'boundx-calc-conformance/v1');
  assert.equal(suite.suite_version, SUITE_VERSION);
  assert.equal(suite.protocol_version, PROTOCOL_VERSION);
  assert.equal(suite.status, 'DRAFT_FOR_REVIEW');
  assert.equal(suite.normative, true);
  assert.equal(suite.publication_authorized, false);
  assert.equal(suite.certification_authorized, false);
  assert.equal(suite.case_count, 176);
  assert.equal(suite.cases.length, suite.case_count);
  assert.equal(suite.historical_source_count, 160);
  assert.equal(suite.foundational_case_count, 16);
  assert.equal(new Set(suite.cases.map(item => item.id)).size, suite.cases.length);
  assert.ok(suite.cases.every(item => item.class === 'BXP-CALC'));
  assert.equal(suite.cases.filter(item => item.schema_expectation === 'invalid').length, 1);
  assert.equal(suite.cases.find(item => item.id === 'BXP-C0015').schema_expectation, 'invalid');
});

test('all 160 historical scenarios are represented exactly once without becoming extraction gold', () => {
  assert.equal(sourceIndex.schema, 'boundx-historical-scenario-index/v1');
  assert.equal(sourceIndex.normative, false);
  assert.equal(sourceIndex.count, 160);
  assert.equal(sourceIndex.origins.length, 160);
  assert.equal(new Set(sourceIndex.origins.map(item => item.id)).size, 160);
  assert.ok(sourceIndex.origins.every(item => item.derivation === 'calculation-pattern-only'));
  assert.ok(sourceIndex.origins.every(item => /^[a-f0-9]{40}$/.test(item.source_blob_sha)));
  assert.ok(sourceIndex.origins.every(item => !Object.hasOwn(item, 'text') && !Object.hasOwn(item, 'reference')));

  const derived = suite.cases.filter(item => item.origin.kind === 'historical-scenario-derivative');
  assert.equal(derived.length, 160);
  assert.deepEqual(
    derived.map(item => item.origin.source_index_id).sort(),
    sourceIndex.origins.map(item => item.id).sort(),
  );
  assert.ok(derived.every(item => item.origin.derivation === 'calculation-pattern-only'));
});

test('every frozen result is exact, deterministic and non-adjudicative', () => {
  for (const item of suite.cases) {
    const first = evaluateTask(item.task);
    const second = evaluateTask(structuredClone(item.task));
    assert.deepEqual(first, second, item.id);
    assert.deepEqual(first, item.expected_result, item.id);
    assert.equal(first.schema, 'boundx-result/v1', item.id);
    assert.equal(first.protocol_version, PROTOCOL_VERSION, item.id);
    assert.equal(first.business_decision, null, item.id);
    assert.equal(first.execution_authorization, null, item.id);
    assert.deepEqual(first.extensions, {}, item.id);
  }
});

test('source digest is SHA-256 over the exact UTF-8 source text', () => {
  const text = '界痕 BoundX 🧭';
  const expected = createHash('sha256').update(text, 'utf8').digest('hex');
  assert.equal(sourceDigest(text), expected);
  const result = evaluateTask(suite.cases[0].task);
  assert.equal(result.source_digest_algorithm, 'sha-256:utf8');
  assert.equal(result.source_digest, sourceDigest(suite.cases[0].task.source.text));
});

test('profile completeness is independent from submitted-constraint consistency', () => {
  const result = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0002').task);
  assert.deepEqual(result.evaluation, {
    validation: 'valid',
    completeness: 'incomplete',
    consistency: 'consistent',
  });
  assert.deepEqual([...new Set(result.findings.map(item => item.code))], ['BXP.CORE.ELEMENT_ABSENT']);
});

test('typed intervals stay orthogonal and preserve open endpoints', () => {
  const empty = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0003').task);
  assert.equal(empty.calculations.intervals[0].empty, true);
  assert.ok(empty.findings.some(item => item.code === 'BXP.INTERVAL.EMPTY'));

  const orthogonal = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0004').task);
  assert.equal(orthogonal.calculations.intervals.length, 2);
  assert.deepEqual(orthogonal.calculations.intervals.map(item => item.dimension).sort(),
    ['digital_storage', 'duration']);
});

test('target-set and handoff calculations expose overlap, deficit and unresolved identity', () => {
  const overlap = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0005').task);
  assert.equal(overlap.calculations.target_sets[0].result, 'overlap');
  assert.equal(overlap.calculations.target_sets[0].overlap.length, 1);

  const targetUnknown = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0006').task);
  assert.equal(targetUnknown.calculations.target_sets[0].result, 'undetermined');

  const deficit = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0007').task);
  assert.equal(deficit.calculations.handoffs[0].result, 'deficit');
  assert.equal(deficit.calculations.handoffs[0].missing.length, 1);
  assert.ok(deficit.findings.some(item => item.code === 'BXP.HANDOFF.INPUT_DEFICIT'));

  const supplied = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0008').task);
  assert.equal(supplied.calculations.handoffs[0].result, 'satisfied');

  const handoffUnknown = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0009').task);
  assert.equal(handoffUnknown.calculations.handoffs[0].result, 'undetermined');
});

test('only prerequisite edges form DAG cycles and bounded iteration remains separate', () => {
  const cycle = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0010').task);
  assert.equal(cycle.calculations.dependencies[0].cycles.length, 1);
  const iteration = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0011').task);
  assert.equal(iteration.calculations.dependencies[0].prerequisite_edges, 0);
  assert.deepEqual(iteration.calculations.dependencies[0].cycles, []);
});

test('Boolean consistency distinguishes UNSAT from a satisfiable witness', () => {
  const unsat = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0012').task);
  assert.equal(unsat.calculations.logic[0].result, 'unsatisfiable');
  assert.equal(unsat.calculations.logic[0].witness, null);

  const sat = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0013').task);
  assert.equal(sat.calculations.logic[0].result, 'satisfiable');
  assert.ok(sat.calculations.logic[0].witness);
});

test('invalid evidence and extension namespaces stop all calculations', () => {
  for (const id of ['BXP-C0014', 'BXP-C0015']) {
    const result = evaluateTask(suite.cases.find(item => item.id === id).task);
    assert.equal(result.evaluation.validation, 'invalid', id);
    assert.deepEqual(result.calculations, {
      intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [],
    }, id);
  }
  const extension = evaluateTask(suite.cases.find(item => item.id === 'BXP-C0016').task);
  assert.equal(extension.evaluation.validation, 'valid');
});

test('checked-in protocol assets are strict UTF-8 without replacement or NUL characters', () => {
  const files = [
    '../BXP-0001.md',
    '../BXP-0001.zh-CN.md',
    '../GOVERNANCE.md',
    '../IPR.md',
    '../TRADEMARKS.md',
    '../PROVENANCE.md',
    '../../docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md',
    '../../docs/BOUNDX-PRODUCT-MANUAL.md',
    '../schemas/boundx-task-v1.schema.json',
    '../schemas/boundx-result-v1.schema.json',
    '../schemas/boundx-calc-conformance-suite-v1.schema.json',
    '../benchmarks/README.md',
    '../benchmarks/corpus-manifest.json',
    '../benchmarks/source-index.json',
    '../provenance/manifest.json',
    'bxp-calc-v1.0.json',
  ];
  for (const relative of files) {
    const bytes = readFileSync(new URL(relative, here));
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    assert.ok(!text.includes('\uFFFD'), relative);
    assert.ok(!text.includes('\u0000'), relative);
  }
});

test('provenance manifest reproduces every asset and the ordered case-ID digest', () => {
  const protocolRoot = new URL('../', here);
  const manifest = JSON.parse(readFileSync(new URL('provenance/manifest.json', protocolRoot), 'utf8'));
  assert.equal(manifest.schema, 'boundx-provenance-manifest/v1');
  assert.equal(manifest.hash_algorithm, 'sha-256');
  assert.equal(manifest.signature_status, 'unsigned-draft');
  assert.equal(manifest.signature, null);

  for (const asset of manifest.assets) {
    const bytes = readFileSync(new URL(asset.path, protocolRoot));
    assert.equal(bytes.length, asset.bytes, asset.path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.path);
  }

  const caseIds = suite.cases.map(item => item.id).join('\n');
  assert.equal(
    createHash('sha256').update(caseIds, 'utf8').digest('hex'),
    manifest.suite.case_id_set_sha256,
  );
});

test('lightweight product plan remains complete and non-operative', () => {
  const decision = readFileSync(new URL('../../docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md', here), 'utf8');
  assert.match(decision, /文档编号：`BX-PRODUCT-PLAN-001`/);
  assert.match(decision, /状态：`DRAFT_FOR_REVIEW`/);
  assert.match(decision, /公开授权：`false`/);
  assert.match(decision, /license_change_effective: false/);
  assert.match(decision, /首版采用 GNU AGPL v3/);
  assert.match(decision, /`AGPL-3\.0-only`/);
  assert.match(decision, /pip install boundx/);
  assert.match(decision, /三个真实小客户/);
  for (let i = 1; i <= 5; i += 1) {
    assert.match(decision, new RegExp(`\\| D${String(i).padStart(2, '0')} \\|`));
  }
  for (let i = 1; i <= 4; i += 1) {
    assert.match(decision, new RegExp(`\\| R${i} `));
  }
});

test('product manual separates current capability from deployment-neutral targets', () => {
  const manual = readFileSync(new URL('../../docs/BOUNDX-PRODUCT-MANUAL.md', here), 'utf8');
  assert.match(manual, /文档编号：`BX-PRODUCT-MANUAL-001`/);
  assert.match(manual, /可嵌入、可服务化的任务边界预检引擎/);
  assert.match(manual, /Python \/ PyPI/);
  assert.match(manual, /CLI/);
  assert.match(manual, /MCP Server/);
  assert.match(manual, /HTTP\/API Server/);
  assert.match(manual, /Web 表单与宿主插件/);
  assert.match(manual, /当前没有 `pyproject\.toml`/);
  assert.match(manual, /当前只允许 localhost/);
  assert.match(manual, /独立开源仓库/);
  assert.match(manual, /`AGPL-3\.0-only`/);
  assert.match(manual, /PR #35/);
  assert.match(manual, /核心测试 \*\*21\/21\*\*、协议测试 \*\*14\/14\*\*/);
  assert.match(manual, /BoundX Core/);
  assert.match(manual, /BoundX Packs/);
  assert.match(manual, /BoundX FDE/);
  assert.match(manual, /business_decision/);
  assert.match(manual, /execution_authorization/);
  assert.match(manual, /publication_authorized: false/);
});
