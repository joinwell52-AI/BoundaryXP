import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluateBxpTask } from '../bxp/index.mjs';
import { renderThreeLayers } from '../product/assembler.mjs';
import { createProductHost } from '../product/host.mjs';
import { runAdminModel } from '../product/model-pipeline.mjs';

function candidateFor(task, prepared) {
  const convert = value => {
    if (Array.isArray(value)) return value.map(convert);
    if (!value || typeof value !== 'object') return value;
    if (Object.hasOwn(value, 'quote')) return { source_id: value.source_id ?? 'task', quote: value.quote };
    return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'normalized').map(([key, child]) => [key, convert(child)]));
  };
  return { schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id, source_digest: prepared.source_digest,
    context_digest: prepared.context_digest, elements: convert(task.elements), constraints: convert(task.constraints),
    ...(task.scopes ? { scopes: convert(task.scopes) } : {}),
    producer: { producer_kind: 'host-ai', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
}

for (const language of ['en', 'zh-CN']) for (const scenario of ['complete', 'b-absent', 'conflict', 'multi-source', 'unresolved-scope', 'unresolved']) {
  test(`model report preserves ${language} ${scenario} instead of turning findings into a producer failure`, async () => {
    const root = mkdtempSync(join(tmpdir(), 'boundx-report-'));
    try {
      const task = JSON.parse(readFileSync(new URL(`../../examples/bxp/${language}-${scenario}.json`, import.meta.url), 'utf8'));
      const host = createProductHost({ root });
      const output = await runAdminModel(host, { consent: true, config: { provider: 'cursor', model: 'fixture-model', key: 'fixture-key' },
        prepare: { source: task.source, profile: task.profile, ...(task.sources ? { sources: task.sources } : {}), packs: host.registry.active() } },
      { sendModel: async (config, messages) => {
        const prepared = JSON.parse(messages[1].content);
        return { text: JSON.stringify(candidateFor(task, prepared)), model: 'fixture-model' };
      } });
      assert.equal(output.computed, true, JSON.stringify(output.diagnostics));
      const expected = evaluateBxpTask(task);
      assert.deepEqual(output.result.evaluation, expected.evaluation);
      assert.deepEqual(output.result.deficit, expected.deficit);
      assert.deepEqual(output.result.calculations, expected.calculations);
      assert.equal(output.stage, 'result');
      for (const item of expected.deficit) assert.ok(output.report.includes(`Diff [-${item.element}]`));
      for (const finding of expected.findings) assert.ok(output.report.includes(`Diff [${finding.code}]`));
      assert.equal(output.report.includes('[object Object]'), false);
      assert.equal(output.report.includes('undefined'), false);
      assert.ok(output.report.includes('Input scope'));
      assert.ok(output.report.includes('Evidence'));
      assert.equal(output.result.business_decision, null);
      assert.equal(output.result.execution_authorization, null);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}

test('three-layer report labels history, assumptions and clarifications without changing Core output', () => {
  const task = JSON.parse(readFileSync(new URL('../../examples/bxp/en-conflict.json', import.meta.url), 'utf8'));
  const result = evaluateBxpTask(task);
  const before = JSON.stringify(result);
  const report = renderThreeLayers(task.source.text, { task, result, computed: true, historical: true, clarifications: ['请明确时限 / Clarify the time limit'] });
  assert.ok(report.includes('Historical snapshot replay'));
  assert.ok(report.includes('Only identical scope'));
  assert.ok(report.includes('Clarify the time limit'));
  assert.equal(JSON.stringify(result), before);
});

test('uncomputed report never fills eight buckets or presents a model failure as a Core finding', () => {
  const report = renderThreeLayers('🧪待核验\r\nNext line', { computed: false, task: null, result: null, diagnostics: [{ code: 'MODEL_FAILED', message: 'No result' }] });
  assert.ok(report.includes('Not computed'));
  assert.ok(report.includes('Diff [MODEL_FAILED]'));
  assert.equal(report.includes('S_required'), false);
  assert.ok(report.includes('🧪待核验\r\n'));
});

test('report exposes modality and producer interpretation without claiming permission', () => {
  const task = JSON.parse(readFileSync(new URL('../../examples/bxp/en-complete.json', import.meta.url), 'utf8'));
  const entry = task.elements.A.entries[0];
  entry.kind = 'prohibited_action';
  task.extensions = { ...task.extensions, 'org.boundx.producer': { provenance: [{ element: 'A', entry_id: entry.id,
    interpretation: '被提及但禁止执行 / Mentioned but prohibited', candidate_ids: ['interpretation-one', 'interpretation-two'] }] } };
  const result = evaluateBxpTask(task);
  const before = JSON.stringify({ task, result });
  const report = renderThreeLayers(task.source.text, { task, result, computed: true });
  assert.ok(report.includes('A (任务动作)'));
  assert.equal(report.includes('A (允许动作)'), false);
  assert.ok(report.includes('prohibited_action'));
  assert.ok(report.includes('Producer interpretation (not source text)'));
  assert.ok(report.includes('Mentioned but prohibited'));
  assert.ok(report.includes('interpretation-one'));
  assert.ok(report.includes('interpretation-two'));
  assert.equal(JSON.stringify({ task, result }), before);
});
