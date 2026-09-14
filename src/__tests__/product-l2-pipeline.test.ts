import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { createProductHost } from '../product/host.mjs';
import { replayStructured, replayLabels } from '../product/replay.mjs';
import { runAdminModel } from '../product/model-pipeline.mjs';

const root = mkdtempSync(join(tmpdir(), 'boundx-l2-pipeline-'));
after(() => rmSync(root, { recursive: true, force: true }));
const host = createProductHost({ root });
const l2 = host.registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l2/software-ai/0.2.0/', import.meta.url)));
host.registry.activate(l2);
const fixtures = JSON.parse(readFileSync(new URL('../../fixtures/admin-text/l2-frame-cases.json', import.meta.url), 'utf8'));
const oldFrames = JSON.parse(readFileSync(new URL('../../domain-packs/l2/software-ai/actions.json', import.meta.url), 'utf8')).frames;
const additions = host.registry.load(l2).payloads.actions.frames.filter(frame => !oldFrames.some(old => old.id === frame.id)).map(frame => frame.id);

function fixtureCandidate(fixture, prepared) {
  const elements = Object.fromEntries(CORE_ELEMENTS.map(element => [element, { status: 'absent', entries: [] }]));
  const field = fixture.type === 'negation' ? 'B' : 'A';
  const frames = [fixture.frame_id, ...(fixture.type === 'ambiguity' ? [fixture.expected.also_contains_frame] : [])];
  const references = frames.map(id => {
    const entry = prepared.entries.find(entry => entry.kind === 'action' && entry.reference.entry_id === id);
    assert.ok(entry, `Missing retrieved frame ${id}`);
    return { ...entry.reference, kind: 'action' };
  });
  elements[field] = { status: fixture.type === 'ambiguity' ? 'unresolved' : 'resolved', entries: [{
    id: 'frame-interpretation', kind: field === 'B' ? 'prohibition' : 'action', text: fixture.task_text,
    evidence: [fixture.locator], semantic_refs: references, candidate_ids: frames,
  }], ...(fixture.type === 'ambiguity' ? { reason_codes: ['ACTION_ALTERNATIVES_UNRESOLVED'] } : {}) };
  return { schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id, source_digest: prepared.source_digest,
    context_digest: prepared.context_digest, elements, constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] },
    producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
}

test('pipeline coverage matches every added frame, both languages and all four fixture classes', () => {
  assert.equal(additions.length, 15);
  assert.deepEqual([...new Set(fixtures.cases.map(fixture => fixture.frame_id))].sort(), [...additions].sort());
  assert.equal(new Set(fixtures.cases.map(fixture => fixture.id)).size, 120);
  for (const frame of additions) for (const language of ['zh-CN', 'en']) for (const type of ['positive', 'negation', 'ambiguity', 'missing-evidence']) {
    assert.equal(fixtures.cases.filter(fixture => fixture.frame_id === frame && fixture.language === language && fixture.type === type).length, 1);
  }
});

for (const fixture of fixtures.cases) test(`L2 candidate pipeline ${fixture.id} (replay and mock, not live extraction)`, async () => {
  const input = { source: { text: fixture.task_text, language: fixture.language }, profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: host.registry.active() };
  const prepared = host.invoke('bx_prepare_admin_task', input);
  const candidate = fixtureCandidate(fixture, prepared);
  const structured = replayStructured(candidate);
  const labels = replayLabels(prepared, { schema: 'boundx-label-replay/v1', tags: CORE_ELEMENTS.map(element => ({ element, ...candidate.elements[element] })),
    relations: candidate.constraints, clarifications: [] });
  const first = host.invoke('bx_evaluate_admin_candidate', { candidate: structured });
  const second = host.invoke('bx_evaluate_admin_candidate', { candidate: labels });
  const model = await runAdminModel(host, { consent: true, config: { provider: 'cursor', model: 'fixture-only', key: 'synthetic-not-a-key' }, prepare: input }, {
    sendModel: async (config, messages) => {
      const output = fixtureCandidate(fixture, JSON.parse(messages[1].content));
      output.producer.producer_kind = 'host-ai';
      return { text: JSON.stringify(output), model: 'fixture-only' };
    },
  });
  for (const result of [first, second, model]) {
    if (fixture.type === 'missing-evidence') {
      assert.equal(result.computed, false);
      assert.equal(result.diagnostics[0].code, 'QUOTE_NOT_FOUND');
      assert.equal(result.task, null);
      assert.equal(result.result, null);
      continue;
    }
    assert.equal(result.computed, true, JSON.stringify(result.diagnostics));
    assert.equal(result.task.source.text, fixture.task_text);
    assert.equal(result.result.business_decision, null);
    assert.equal(result.result.execution_authorization, null);
    assert.equal(result.task.elements.B.status, fixture.type === 'negation' ? 'resolved' : 'absent');
    assert.equal(result.task.elements.A.status, fixture.type === 'negation' ? 'absent' : fixture.type === 'ambiguity' ? 'unresolved' : 'resolved');
    for (const element of ['I', 'O', 'P', 'R', 'V', 'C']) assert.equal(result.task.elements[element].status, 'absent');
    const field = fixture.type === 'negation' ? 'B' : 'A';
    const span = result.task.elements[field].entries[0].evidence[0];
    assert.equal(Array.from(fixture.task_text).slice(span.start, span.end).join(''), fixture.task_text);
    const provenance = result.task.extensions['org.boundx.producer'].provenance[0];
    assert.deepEqual(provenance.semantic_refs, candidate.elements[field].entries[0].semantic_refs);
    for (const layer of [1, 2, 3]) assert.ok(result.report.includes('【Layer ' + layer + '：'));
    assert.deepEqual(result.result.calculations, first.result.calculations);
    assert.deepEqual(result.result.evaluation, first.result.evaluation);
  }
  if (fixture.type === 'ambiguity') {
    assert.deepEqual(second.task.elements.A.reason_codes, ['ACTION_ALTERNATIVES_UNRESOLVED']);
    const collapsed = structuredClone(candidate);
    collapsed.elements.A.status = 'resolved';
    const rejected = host.invoke('bx_evaluate_admin_candidate', { candidate: collapsed });
    assert.equal(rejected.computed, false);
    assert.equal(rejected.diagnostics[0].code, 'CANDIDATE_AMBIGUOUS');
  }
});
